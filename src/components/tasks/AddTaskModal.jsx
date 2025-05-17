"use client"

import { useState } from "react"
import { X } from "lucide-react"
import Button from "../ui/Button"
import Input from "../ui/Input"
import { useProjects } from "../../contexts/ProjectContext"

const priorityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
]

const AddTaskModal = ({ isOpen, onClose, projectId }) => {
  const { createTask, projects } = useProjects()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState("medium")
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || "")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!title) {
      setError("Task title is required")
      return
    }

    if (!selectedProjectId) {
      setError("Please select a project")
      return
    }

    try {
      setIsSubmitting(true)

      const taskData = {
        title,
        description,
        projectId: selectedProjectId,
        dueDate: dueDate || null,
        priority,
      }

      const { success, error } = await createTask(taskData)

      if (success) {
        resetForm()
        onClose()
      } else {
        setError(error || "Failed to create task")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setDueDate("")
    setPriority("medium")
    if (!projectId) setSelectedProjectId("")
    setError("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>

          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Add New Task</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Fill in the details to create a new task.</p>
                </div>

                {error && (
                  <div className="mt-4 rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{error}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="space-y-4">
                    <Input
                      id="task-title"
                      label="Task Title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />

                    <div>
                      <label htmlFor="task-description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="task-description"
                        rows={3}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Describe the task"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    </div>

                    {!projectId && (
                      <div>
                        <label htmlFor="project-select" className="block text-sm font-medium text-gray-700">
                          Project
                        </label>
                        <select
                          id="project-select"
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={selectedProjectId}
                          onChange={(e) => setSelectedProjectId(e.target.value)}
                          required
                        >
                          <option value="">Select a project</option>
                          {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                              {project.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <Input
                      id="task-due-date"
                      label="Due Date"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />

                    <div>
                      <label htmlFor="priority-select" className="block text-sm font-medium text-gray-700">
                        Priority
                      </label>
                      <select
                        id="priority-select"
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                      >
                        {priorityOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                      className="w-full sm:ml-3 sm:w-auto"
                    >
                      Add Task
                    </Button>
                    <Button type="button" variant="outline" onClick={onClose} className="mt-3 w-full sm:mt-0 sm:w-auto">
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddTaskModal
