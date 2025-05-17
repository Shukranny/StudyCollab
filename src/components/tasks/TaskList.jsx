import TaskItem from "./TaskItem"

const TaskList = ({ tasks, onTaskComplete }) => {
  if (tasks.length === 0) {
    return <div className="text-center py-8 text-gray-500">No tasks found.</div>
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onComplete={onTaskComplete} />
      ))}
    </div>
  )
}

export default TaskList
