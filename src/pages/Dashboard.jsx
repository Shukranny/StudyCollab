"use client"
import { Link } from "react-router-dom"
import { CalendarClock, Users, FileCheck, Clock } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useProjects } from "../contexts/ProjectContext"
import DashboardCard from "../components/dashboard/DashboardCard"
import ProjectCard from "../components/projects/ProjectCard"
import TaskList from "../components/tasks/TaskList"
import Button from "../components/ui/Button"
import { Plus } from "lucide-react"
import { useState } from "react"
import AddProjectModal from "../components/projects/AddProjectModal"

const Dashboard = () => {
  const { currentUser } = useAuth()
  const { projects, tasks, isLoading, updateTaskStatus, getProjectStats, databaseReady, error, setupDetails } =
    useProjects()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Get active projects (limit to 3 for display)
  const activeProjects = projects.slice(0, 3)

  // Get upcoming tasks (due in the next 7 days)
  const upcomingTasks = tasks
    .filter((task) => !task.completed && new Date(task.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
    .slice(0, 5)

  // Get project statistics
  const stats = getProjectStats()

  const handleTaskComplete = async (taskId, completed) => {
    await updateTaskStatus(taskId, completed)
  }

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      {/* Welcome message */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, {currentUser?.user_metadata?.name || currentUser?.email}
        </h2>
        <p className="text-gray-600 mt-1">Here's an overview of your collaborative work</p>
      </div>

      {/* Database setup warning */}
      {!databaseReady && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Database Setup Required</h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>
                  The database tables required for projects are not set up. Please run the SQL commands in{" "}
                  <code className="bg-amber-100 px-1 py-0.5 rounded">src/utils/supabaseSchema.js</code> in the Supabase
                  SQL editor.
                </p>
                {setupDetails.missingTables.length > 0 && (
                  <p className="mt-1">
                    <strong>Missing tables:</strong> {setupDetails.missingTables.join(", ")}
                  </p>
                )}
                {setupDetails.missingBuckets.length > 0 && (
                  <p className="mt-1">
                    <strong>Missing storage buckets:</strong> {setupDetails.missingBuckets.join(", ")}
                  </p>
                )}
                <div className="mt-3">
                  <p className="font-medium">Setup Instructions:</p>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>
                      Log in to your{" "}
                      <a
                        href="https://app.supabase.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Supabase dashboard
                      </a>
                    </li>
                    <li>Select your project</li>
                    <li>Go to the "SQL Editor" section in the left sidebar</li>
                    <li>Click "New Query" to create a new SQL query</li>
                    <li>
                      Copy ALL the SQL commands from{" "}
                      <code className="bg-amber-100 px-1 py-0.5 rounded">src/utils/supabaseSchema.js</code>
                    </li>
                    <li>Paste the SQL commands into the SQL Editor</li>
                    <li>Click "Run" to execute the SQL commands</li>
                    <li>Refresh this page</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Active Projects"
          value={stats.totalProjects.toString()}
          icon={<Users className="text-blue-600" />}
          trend={`${stats.totalProjects} total`}
          trendUp={null}
        />
        <DashboardCard
          title="Completed Tasks"
          value={stats.completedTasks.toString()}
          icon={<FileCheck className="text-green-600" />}
          trend={`${((stats.completedTasks / (stats.completedTasks + stats.pendingTasks)) * 100 || 0).toFixed(0)}% completion rate`}
          trendUp={true}
        />
        <DashboardCard
          title="Pending Tasks"
          value={stats.pendingTasks.toString()}
          icon={<Clock className="text-amber-600" />}
          trend={`${stats.pendingTasks} remaining`}
          trendUp={null}
        />
        <DashboardCard
          title="Upcoming Deadlines"
          value={stats.upcomingDeadlines.toString()}
          icon={<CalendarClock className="text-red-600" />}
          trend="Next 7 days"
          trendUp={null}
        />
      </div>

      {/* Recent projects */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Active Projects</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
              <Plus size={16} className="mr-1" />
              New Project
            </Button>
            <Link to="/projects" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View all
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading projects...</p>
          </div>
        ) : activeProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-800">No projects yet</h3>
            <p className="text-gray-500 mt-2">Create your first project to get started</p>
            <Button variant="primary" className="mt-4" onClick={() => setIsModalOpen(true)}>
              <Plus size={16} className="mr-1" />
              Create Project
            </Button>
          </div>
        )}
      </div>

      {/* Upcoming tasks */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Upcoming Tasks</h2>
          <span className="text-sm text-gray-500">Next 7 days</span>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading tasks...</p>
          </div>
        ) : (
          <TaskList tasks={upcomingTasks} onTaskComplete={handleTaskComplete} />
        )}
      </div>

      {/* Add Project Modal */}
      <AddProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default Dashboard
