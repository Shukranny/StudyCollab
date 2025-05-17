"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setCurrentUser(user)
      setIsLoading(false)
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setCurrentUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      const {
        data: { user },
      } = await supabase.auth.getUser()
      return user
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email, password, name) => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            avatar: `https://i.pravatar.cc/150?u=${email}`,
          },
        },
      })
      if (error) throw error
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: "consent",
            access_type: "offline",
          },
        },
      })
      if (error) throw error
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      throw error
    }
  }

  // Update the updateProfile function to handle avatar uploads

  const updateProfile = async (userData) => {
    try {
      setIsLoading(true)

      // First update the user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          name: userData.name,
          avatar: userData.avatar || currentUser?.user_metadata?.avatar,
          bio: userData.bio,
        },
      })

      if (updateError) throw updateError

      // If email is different from current email, update it
      if (userData.email && userData.email !== currentUser?.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: userData.email,
        })

        if (emailError) throw emailError
      }

      // Get the updated user data
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setCurrentUser(user)

      return { success: true }
    } catch (error) {
      console.error("Error updating profile:", error)
      return { success: false, error }
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    currentUser,
    isLoading,
    login,
    register,
    logout,
    signInWithGoogle, // Make sure this is included in the context value
    signUpWithGoogle: signInWithGoogle, // Alias for sign-up if needed
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
