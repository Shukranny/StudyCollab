"use client"

import { useState } from "react"
import { X } from "lucide-react"
import Button from "../ui/Button"
import Input from "../ui/Input"
import { useProjects } from "../../contexts/ProjectContext"

const colorOptions = [
  { name: "Blue", value: "#2563EB" },
  { name: "Teal", value: "#0D9488" },
  { name: "Amber", value: "#F59E0B" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Red", value: "#DC2626" },
  { name: "Green", value: "#16A34A" },
]

const AddProjectModal = ({ isOpen, onClose }) => {
  const { createProject } = useProjects()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!name) {
      setError("Project name is required")
      return
    }

    try {
      setIsSubmitting(true)

      const projectData = {
        name,
        description,
        dueDate: dueDate || null,
        color: selectedColor,
      }

      console.log("Submitting project data:", projectData)

      const { success, error, project } = await createProject(projectData)

      if (success) {
        console.log("Project created successfully:", project)
        resetForm()
        onClose()
      } else {
        console.error("Failed to create project:", error)
        setError(error || "Failed to create project. Please try again.")
      }
    } catch (err) {
      console.error("Exception during project creation:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setName("")
    setDescription("")
    setDueDate("")
    setSelectedColor(colorOptions[0].value)
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
                <h3 className="text-lg font-medium leading-6 text-gray-900">Create New Project</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Fill in the details to create a new project.</p>
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
                      id="project-name"
                      label="Project Name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />

                    <div>
                      <label htmlFor="project-description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="project-description"
                        rows={3}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Describe your project"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    </div>

                    <Input
                      id="project-due-date"
                      label="Due Date"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Project Color</label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            className={`h-8 w-8 rounded-full border-2 ${
                              selectedColor === color.value ? "border-gray-900" : "border-transparent"
                            }`}
                            style={{ backgroundColor: color.value }}
                            onClick={() => setSelectedColor(color.value)}
                            title={color.name}
                          ></button>
                        ))}
                      </div>
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
                      Create Project
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

export default AddProjectModal
