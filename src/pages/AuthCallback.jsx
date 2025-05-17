"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"
import LoadingSpinner from "../components/ui/LoadingSpinner" // Make sure you have this component

const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Set up the auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        navigate("/dashboard")
      }
      if (event === "SIGNED_OUT") {
        navigate("/login")
      }
    })

    // Check the current session immediately
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        navigate("/dashboard")
      } else {
        navigate("/login")
      }
    }

    checkSession()

    return () => {
      subscription?.unsubscribe()
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  )
}

export default AuthCallback
