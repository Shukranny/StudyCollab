"use client"
import { FaGoogle } from "react-icons/fa"
import Button from "../ui/Button" // Fixed import path

const GoogleButton = ({ onClick, isSignUp = false }) => {
  return (
    <Button type="button" onClick={onClick} variant="outline" className="w-full flex items-center justify-center gap-2">
      <FaGoogle className="text-red-500" />
      {isSignUp ? "Sign up with Google" : "Sign in with Google"}
    </Button>
  )
}

export default GoogleButton
