"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ProjectProvider } from "./contexts/ProjectContext"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import Layout from "./components/layout/Layout"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import ProjectDetails from "./pages/ProjectDetails"
import Calendar from "./pages/Calendar"
import Messages from "./pages/Messages"
import Files from "./pages/Files"
import Settings from "./pages/Settings"
import AuthCallback from "./pages/AuthCallback"
import { useEffect } from "react"
import { setupStorage } from "./utils/setupStorage"

function App() {
  // Initialize storage on app load
  useEffect(() => {
    const initStorage = async () => {
      await setupStorage()
    }

    initStorage()
  }, [])

  return (
    <Router>
      <AuthProvider>
        <ProjectProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:projectId" element={<ProjectDetails />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="messages" element={<Messages />} />
              <Route path="files" element={<Files />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </ProjectProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
