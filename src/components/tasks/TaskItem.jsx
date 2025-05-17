"use client"
import { Check, AlertCircle } from "lucide-react"

const TaskItem = ({ task, onComplete }) => {
  // Calculate days remaining
  const today = new Date()
  const dueDate = new Date(task.dueDate)
  const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  // Determine task status
  const isOverdue = daysRemaining < 0 && !task.completed
  const isPriority = task.priority === "high" && !task.completed

  const handleToggle = () => {
    if (onComplete) {
      onComplete(task.id, !task.completed)
    }
  }

  return (
    <div
      className={`bg-white border rounded-lg transition-all duration-200 ${
        task.completed
          ? "border-gray-200 bg-gray-50"
          : isOverdue
            ? "border-red-200 bg-red-50"
            : isPriority
              ? "border-amber-200 bg-amber-50"
              : "border-gray-200 hover:border-blue-200"
      }`}
    >
      <div className="flex items-center p-4">
        <div className="flex-shrink-0 mr-3">
          <button
            onClick={handleToggle}
            className={`w-5 h-5 rounded-full border ${
              task.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-blue-500"
            } flex items-center justify-center focus:outline-none`}
          >
            {task.completed && <Check size={12} />}
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${task.completed ? "text-gray-500 line-through" : "text-gray-800"}`}>
            {task.title}
          </p>
          <p className="text-xs text-gray-500 truncate mt-0.5">{task.projectName}</p>
        </div>

        <div className="ml-4 flex-shrink-0 flex items-center">
          {isOverdue ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
              <AlertCircle size={12} className="mr-1" />
              Overdue
            </span>
          ) : task.completed ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              <Check size={12} className="mr-1" />
              Complete
            </span>
          ) : (
            <span
              className={`text-xs font-medium ${
                daysRemaining === 0 ? "text-red-600" : daysRemaining <= 2 ? "text-amber-600" : "text-gray-500"
              }`}
            >
              {daysRemaining === 0
                ? "Due today"
                : daysRemaining < 0
                  ? `${Math.abs(daysRemaining)} days overdue`
                  : daysRemaining === 1
                    ? "Due tomorrow"
                    : `${daysRemaining} days left`}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskItem
