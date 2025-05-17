"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Calendar, MessageCircle, FileText, Users, Plus, Edit, ChevronLeft, Trash2 } from "lucide-react"
import Button from "../components/ui/Button"
import ProgressBar from "../components/ui/ProgressBar"
import TaskList from "../components/tasks/TaskList"
import AddTaskModal from "../components/tasks/AddTaskModal"
import { useProjects } from "../contexts/ProjectContext"
import { useAuth } from "../contexts/AuthContext"

const ProjectDetails = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { projects, tasks, isLoading, updateTaskStatus, deleteProject, updateProject } = useProjects()
  const [activeTab, setActiveTab] = useState("tasks")
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  // Find the current project
  const project = projects.find((p) => p.id === projectId)

  // Get tasks for this project
  const projectTasks = tasks.filter((task) => task.projectId === projectId)

  // Handle task completion
  const handleTaskComplete = async (taskId, completed) => {
    await updateTaskStatus(taskId, completed)
  }

  // Handle project deletion
  const handleDeleteProject = async () => {
    try {
      setIsDeleting(true)
      const { success } = await deleteProject(projectId)
      if (success) {
        navigate("/projects")
      }
    } catch (error) {
      console.error("Error deleting project:", error)
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  // Calculate project progress based on completed tasks
  useEffect(() => {
    const calculateProgress = async () => {
      if (project && projectTasks.length > 0) {
        const completedCount = projectTasks.filter((task) => task.completed).length
        const progress = Math.round((completedCount / projectTasks.length) * 100)

        if (progress !== project.progress) {
          await updateProject(projectId, { ...project, progress })
        }
      }
    }

    calculateProgress()
  }, [projectTasks, project])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-gray-800">Project not found</h2>
        <Link to="/projects" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-500">
          <ChevronLeft size={16} className="mr-1" />
          Back to Projects
        </Link>
      </div>
    )
  }

  // Format the date
  const formatDate = (dateString) => {
    if (!dateString) return "No due date"
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      {/* Project header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <Link to="/projects" className="text-gray-500 hover:text-gray-700 mr-2">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => {}}>
            <Edit size={16} className="mr-1" />
            Edit
          </Button>

          <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 size={16} className="mr-1" />
            Delete
          </Button>
        </div>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Trash2 className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Delete Project</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Are you sure you want to delete this project? This action cannot be undone.</p>
              </div>
              <div className="mt-4">
                <div className="flex space-x-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleDeleteProject}
                    isLoading={isDeleting}
                    disabled={isDeleting}
                  >
                    Yes, Delete Project
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project info card */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="h-2" style={{ backgroundColor: project.color }}></div>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <p className="text-gray-600 mb-4">{project.description || "No description provided."}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                <div className="flex items-center">
                  <Calendar size={16} className="text-gray-500 mr-1" />
                  <span>Due: {formatDate(project.dueDate)}</span>
                </div>

                <div className="flex items-center">
                  <Users size={16} className="text-gray-500 mr-1" />
                  <span>{project.members?.length || 1} members</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-64">
              <ProgressBar percentage={project.progress || 0} color={project.color} size="lg" showLabel />
            </div>
          </div>
        </div>
      </div>

      {/* Project tabs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 text-sm font-medium border-b-2 focus:outline-none ${
                activeTab === "tasks"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("tasks")}
            >
              Tasks
            </button>
            <button
              className={`py-4 px-6 text-sm font-medium border-b-2 focus:outline-none ${
                activeTab === "files"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("files")}
            >
              <div className="flex items-center">
                <FileText size={16} className="mr-1" />
                Files
              </div>
            </button>
            <button
              className={`py-4 px-6 text-sm font-medium border-b-2 focus:outline-none ${
                activeTab === "discussions"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("discussions")}
            >
              <div className="flex items-center">
                <MessageCircle size={16} className="mr-1" />
                Discussions
              </div>
            </button>
            <button
              className={`py-4 px-6 text-sm font-medium border-b-2 focus:outline-none ${
                activeTab === "members"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("members")}
            >
              <div className="flex items-center">
                <Users size={16} className="mr-1" />
                Members
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "tasks" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800">Project Tasks</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                      {projectTasks.filter((t) => t.completed).length} completed
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-gray-300 mr-1"></span>
                      {projectTasks.filter((t) => !t.completed).length} pending
                    </span>
                  </div>
                  <Button variant="primary" size="sm" onClick={() => setIsTaskModalOpen(true)}>
                    <Plus size={16} className="mr-1" />
                    Add Task
                  </Button>
                </div>
              </div>

              <TaskList tasks={projectTasks} onTaskComplete={handleTaskComplete} />

              {projectTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <h3 className="text-lg font-medium text-gray-800 mb-1">No tasks yet</h3>
                  <p>Add tasks to track your project progress</p>
                  <Button variant="outline" className="mt-4" onClick={() => setIsTaskModalOpen(true)}>
                    <Plus size={16} className="mr-1" />
                    Add First Task
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === "files" && (
            <div className="text-center py-8 text-gray-500">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-1">No files yet</h3>
              <p>Upload files to share with your team</p>
              <Button variant="outline" className="mt-4">
                <Plus size={16} className="mr-1" />
                Upload Files
              </Button>
            </div>
          )}

          {activeTab === "discussions" && (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-1">No discussions yet</h3>
              <p>Start a discussion with your team</p>
              <Button variant="outline" className="mt-4">
                <Plus size={16} className="mr-1" />
                New Discussion
              </Button>
            </div>
          )}

          {activeTab === "members" && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Team Members</h2>

              <div className="flex items-center p-3 hover:bg-gray-50 rounded-md">
                <div className="flex-shrink-0 mr-3">
                  <img
                    src={currentUser?.user_metadata?.avatar || `https://i.pravatar.cc/150?u=${currentUser?.email}`}
                    alt={currentUser?.user_metadata?.name || currentUser?.email}
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{currentUser?.user_metadata?.name || currentUser?.email}</p>
                  <p className="text-sm text-gray-500">Project Owner</p>
                </div>
              </div>

              <Button variant="outline" className="mt-2">
                <Plus size={16} className="mr-1" />
                Add Member
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} projectId={projectId} />
    </div>
  )
}

export default ProjectDetails
