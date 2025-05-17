"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  FolderPlus,
  Upload,
  FileText,
  FileImage,
  FileArchive,
  File,
  Download,
  Trash,
} from "lucide-react"
import Button from "../components/ui/Button"

const Files = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")

  // Mock files
  const files = [
    {
      id: "1",
      name: "Project Presentation.pptx",
      type: "document",
      size: "4.2 MB",
      uploadedBy: "John Doe",
      lastModified: "2 hours ago",
      project: "Final Year Project",
    },
    {
      id: "2",
      name: "Research-data-analysis.xlsx",
      type: "document",
      size: "1.8 MB",
      uploadedBy: "Sarah Johnson",
      lastModified: "Yesterday",
      project: "Research Methods",
    },
    {
      id: "3",
      name: "Team Logo.png",
      type: "image",
      size: "842 KB",
      uploadedBy: "Alex Wilson",
      lastModified: "3 days ago",
      project: "Design Project",
    },
    {
      id: "4",
      name: "Meeting Notes.pdf",
      type: "document",
      size: "560 KB",
      uploadedBy: "You",
      lastModified: "1 week ago",
      project: "Study Group",
    },
    {
      id: "5",
      name: "Research papers.zip",
      type: "archive",
      size: "18.5 MB",
      uploadedBy: "Emma Lee",
      lastModified: "2 weeks ago",
      project: "Literature Review",
    },
    {
      id: "6",
      name: "Project Mockups.fig",
      type: "other",
      size: "6.2 MB",
      uploadedBy: "You",
      lastModified: "2 weeks ago",
      project: "Design Project",
    },
  ]

  // Filter files based on search and type
  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())

    if (filterType === "all") return matchesSearch
    return matchesSearch && file.type === filterType
  })

  // File type icon component
  const FileTypeIcon = ({ type }) => {
    switch (type) {
      case "document":
        return <FileText className="text-blue-600" />
      case "image":
        return <FileImage className="text-green-600" />
      case "archive":
        return <FileArchive className="text-amber-600" />
      default:
        return <File className="text-gray-600" />
    }
  }

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Files</h1>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="md" onClick={() => {}}>
            <FolderPlus size={18} className="mr-1" />
            New Folder
          </Button>

          <Button variant="primary" size="md" onClick={() => {}}>
            <Upload size={18} className="mr-1" />
            Upload
          </Button>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search files..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="sm:w-48">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Files</option>
              <option value="document">Documents</option>
              <option value="image">Images</option>
              <option value="archive">Archives</option>
              <option value="other">Others</option>
            </select>
          </div>
        </div>
      </div>

      {/* Files table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Project
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Size
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Uploaded By
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Last Modified
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center">
                          <FileTypeIcon type={file.type} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{file.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{file.project}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{file.size}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{file.uploadedBy}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{file.lastModified}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-gray-500 hover:text-gray-700">
                          <Download size={18} />
                        </button>
                        <button className="text-gray-500 hover:text-red-600">
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                    No files found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Files
