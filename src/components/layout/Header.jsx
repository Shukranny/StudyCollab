"use client"
import { Menu, Bell, Search } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { Link } from "react-router-dom"

const Header = ({ title, onMenuClick }) => {
  const { currentUser } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button className="md:hidden text-gray-600 hover:text-gray-900 mr-4" onClick={onMenuClick}>
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-md px-3 py-1.5">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none ml-2 text-sm"
            />
          </div>

          {/* Notifications */}
          <button className="text-gray-600 hover:text-gray-900 relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 bg-red-500 rounded-full w-2 h-2"></span>
          </button>

          {/* User profile - Make it clickable */}
          <Link to="/settings" className="flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden transition-transform hover:scale-105">
              <img
                src={currentUser?.user_metadata?.avatar || "https://i.pravatar.cc/150?img=1"}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="hidden md:block ml-2 text-sm font-medium text-gray-700">
              {currentUser?.user_metadata?.name || "User"}
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
