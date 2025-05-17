"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import { useAuth } from "./AuthContext"
import { checkDatabaseSetup } from "../utils/checkDatabaseSetup"

const ProjectContext = createContext()

export const useProjects = () => {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider")
  }
  return context
}

export const ProjectProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [databaseReady, setDatabaseReady] = useState(true)
  const [setupDetails, setSetupDetails] = useState({
    missingTables: [],
    missingBuckets: [],
  })

  // Fetch projects when user changes
  useEffect(() => {
    if (currentUser) {
      fetchProjects()
      fetchTasks()
    } else {
      setProjects([])
      setTasks([])
    }
  }, [currentUser])

  useEffect(() => {
    const verifyDatabaseSetup = async () => {
      if (currentUser) {
        const result = await checkDatabaseSetup()
        setDatabaseReady(result.success)
        setSetupDetails({
          missingTables: result.missingTables || [],
          missingBuckets: result.missingBuckets || [],
        })

        if (!result.success) {
          console.error(result.message)
          setError(result.message)
        }
      }
    }

    verifyDatabaseSetup()
  }, [currentUser])

  // Fetch all projects for the current user
  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("projects")
        .select("*, project_members(*)")
        .order("created_at", { ascending: false })

      if (error) throw error

      // Transform the data to match our frontend model
      const transformedProjects = data.map((project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        dueDate: project.due_date,
        progress: project.progress,
        color: project.color,
        members: project.project_members.map((member) => member.user_id),
        createdAt: project.created_at,
        updatedAt: project.updated_at,
        userId: project.user_id,
      }))

      setProjects(transformedProjects)
    } catch (error) {
      console.error("Error fetching projects:", error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch all tasks for the current user
  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("tasks")
        .select("*, projects(name)")
        .order("due_date", { ascending: true })

      if (error) throw error

      // Transform the data to match our frontend model
      const transformedTasks = data.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        projectId: task.project_id,
        projectName: task.projects?.name || "Unknown Project",
        assignedTo: task.assigned_to,
        dueDate: task.due_date,
        priority: task.priority,
        completed: task.completed,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
      }))

      setTasks(transformedTasks)
    } catch (error) {
      console.error("Error fetching tasks:", error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Create a new project
  const createProject = async (projectData) => {
    try {
      setIsLoading(true)
      setError(null)

      // Make sure the user is authenticated
      if (!currentUser) {
        console.error("No authenticated user found")
        return { success: false, error: "You must be logged in to create a project" }
      }

      console.log("Creating project with data:", projectData)
      console.log("Current user:", currentUser)

      // Prepare the data for insertion
      const newProject = {
        name: projectData.name,
        description: projectData.description,
        due_date: projectData.dueDate,
        color: projectData.color || "#2563EB",
        progress: 0,
        user_id: currentUser.id,
      }

      console.log("Prepared project data:", newProject)

      // Insert the project
      const { data, error } = await supabase.from("projects").insert(newProject).select()

      if (error) {
        console.error("Supabase error creating project:", error)
        throw error
      }

      console.log("Project created successfully:", data)

      // Add members if provided
      if (projectData.members && projectData.members.length > 0) {
        const members = projectData.members.map((userId) => ({
          project_id: data[0].id,
          user_id: userId,
          role: userId === currentUser.id ? "admin" : "member",
        }))

        const { error: membersError } = await supabase.from("project_members").insert(members)

        if (membersError) {
          console.error("Error adding project members:", membersError)
          throw membersError
        }
      } else {
        // Always add the current user as a member and admin
        const { error: memberError } = await supabase.from("project_members").insert({
          project_id: data[0].id,
          user_id: currentUser.id,
          role: "admin",
        })

        if (memberError) {
          console.error("Error adding project owner as member:", memberError)
          // Don't throw here, as the project was already created
        }
      }

      // Refresh the projects list
      await fetchProjects()

      return { success: true, project: data[0] }
    } catch (error) {
      console.error("Error creating project:", error)
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  // Update an existing project
  const updateProject = async (projectId, projectData) => {
    try {
      setIsLoading(true)
      setError(null)

      // Prepare the data for update
      const updatedProject = {
        name: projectData.name,
        description: projectData.description,
        due_date: projectData.dueDate,
        color: projectData.color,
        progress: projectData.progress,
        updated_at: new Date().toISOString(),
      }

      // Update the project
      const { error } = await supabase.from("projects").update(updatedProject).eq("id", projectId)

      if (error) throw error

      // Refresh the projects list
      await fetchProjects()

      return { success: true }
    } catch (error) {
      console.error("Error updating project:", error)
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  // Delete a project
  const deleteProject = async (projectId) => {
    try {
      setIsLoading(true)
      setError(null)

      // Delete the project
      const { error } = await supabase.from("projects").delete().eq("id", projectId)

      if (error) throw error

      // Refresh the projects list
      await fetchProjects()

      return { success: true }
    } catch (error) {
      console.error("Error deleting project:", error)
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  // Create a new task
  const createTask = async (taskData) => {
    try {
      setIsLoading(true)
      setError(null)

      // Prepare the data for insertion
      const newTask = {
        title: taskData.title,
        description: taskData.description,
        project_id: taskData.projectId,
        assigned_to: taskData.assignedTo || currentUser.id,
        due_date: taskData.dueDate,
        priority: taskData.priority || "medium",
        completed: false,
      }

      // Insert the task
      const { data, error } = await supabase.from("tasks").insert(newTask).select()

      if (error) throw error

      // Refresh the tasks list
      await fetchTasks()

      return { success: true, task: data[0] }
    } catch (error) {
      console.error("Error creating task:", error)
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  // Update task completion status
  const updateTaskStatus = async (taskId, completed) => {
    try {
      setIsLoading(true)
      setError(null)

      // Update the task
      const { error } = await supabase
        .from("tasks")
        .update({ completed, updated_at: new Date().toISOString() })
        .eq("id", taskId)

      if (error) throw error

      // Refresh the tasks list
      await fetchTasks()

      return { success: true }
    } catch (error) {
      console.error("Error updating task status:", error)
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  // Get project statistics
  const getProjectStats = () => {
    const totalProjects = projects.length
    const completedTasks = tasks.filter((task) => task.completed).length
    const pendingTasks = tasks.filter((task) => !task.completed).length

    // Calculate upcoming deadlines (tasks due in the next 7 days)
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)

    const upcomingDeadlines = tasks.filter(
      (task) => !task.completed && new Date(task.dueDate) <= nextWeek && new Date(task.dueDate) >= today,
    ).length

    return {
      totalProjects,
      completedTasks,
      pendingTasks,
      upcomingDeadlines,
    }
  }

  const value = {
    projects,
    tasks,
    isLoading,
    error,
    databaseReady,
    setupDetails,
    fetchProjects,
    fetchTasks,
    createProject,
    updateProject,
    deleteProject,
    createTask,
    updateTaskStatus,
    getProjectStats,
  }

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}
