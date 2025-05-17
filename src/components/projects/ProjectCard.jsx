import { Link } from "react-router-dom"
import { Clock, Users } from "lucide-react"
import ProgressBar from "../ui/ProgressBar"

const ProjectCard = ({ project }) => {
  // Format the date
  const formatDate = (dateString) => {
    if (!dateString) return "No due date"
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Link
      to={`/projects/${project.id}`}
      className="block bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]"
    >
      {/* Project color indicator */}
      <div className="h-2" style={{ backgroundColor: project.color || "#2563EB" }}></div>

      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-800 mb-2">{project.name}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{project.description || "No description"}</p>

        <ProgressBar percentage={project.progress || 0} color={project.color || "#2563EB"} />

        <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{formatDate(project.dueDate)}</span>
          </div>

          <div className="flex items-center">
            <Users size={16} className="mr-1" />
            <span>{project.members?.length || 1}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProjectCard
