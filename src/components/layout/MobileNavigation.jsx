import { NavLink } from "react-router-dom"
import { LayoutDashboard, FolderKanban, Calendar, MessageCircle, FileText } from "lucide-react"

const MobileNavigation = () => {
  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Projects", path: "/projects", icon: <FolderKanban size={20} /> },
    { name: "Calendar", path: "/calendar", icon: <Calendar size={20} /> },
    { name: "Messages", path: "/messages", icon: <MessageCircle size={20} /> },
    { name: "Files", path: "/files", icon: <FileText size={20} /> },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `
              flex flex-col items-center py-2 px-1 text-xs font-medium
              ${isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}
            `}
          >
            {link.icon}
            <span className="mt-1">{link.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default MobileNavigation
