"use client"
import { NavLink, Link } from "react-router-dom"
import { X, LayoutDashboard, FolderKanban, Calendar, MessageCircle, FileText, Settings } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser, logout } = useAuth()

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Projects", path: "/projects", icon: <FolderKanban size={20} /> },
    { name: "Calendar", path: "/calendar", icon: <Calendar size={20} /> },
    { name: "Messages", path: "/messages", icon: <MessageCircle size={20} /> },
    { name: "Files", path: "/files", icon: <FileText size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ]

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={onClose}></div>}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-30 h-full w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="text-white font-semibold">SC</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900">StudyCollab</h2>
            </div>
            <button className="md:hidden text-gray-600 hover:text-gray-900" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* User profile - Make it clickable */}
          <Link to="/settings" className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden transition-transform hover:scale-105">
                <img
                  src={currentUser?.user_metadata?.avatar || "https://i.pravatar.cc/150?img=1"}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-gray-900">{currentUser?.user_metadata?.name || "User"}</p>
                <p className="text-xs text-gray-500">{currentUser?.email || "user@example.com"}</p>
              </div>
            </div>
          </Link>

          {/* Navigation links */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `
                  flex items-center px-4 py-2.5 text-sm font-medium rounded-md
                  transition-colors duration-200
                  ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}
                `}
                onClick={() => onClose()}
              >
                <span className="mr-3">{link.icon}</span>
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Sign out button */}
          <div className="p-4 border-t border-gray-200">
            <button
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none"
              onClick={() => logout()}
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
