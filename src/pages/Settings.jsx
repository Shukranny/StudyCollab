"use client"

import { useState, useEffect, useRef } from "react"
import { Save, User, Bell, Lock, Shield, CheckCircle, Upload } from "lucide-react"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import { useAuth } from "../contexts/AuthContext"
import Avatar from "../components/ui/Avatar"
import { supabase } from "../supabaseClient"

const Settings = () => {
  const { currentUser, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const fileInputRef = useRef(null)

  // Profile settings
  const [name, setName] = useState(currentUser?.name || "")
  const [email, setEmail] = useState(currentUser?.email || "")
  const [bio, setBio] = useState("Computer Science student with interests in web development and machine learning.")
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.user_metadata?.avatar || "")
  const [avatarFile, setAvatarFile] = useState(null)

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [projectUpdates, setProjectUpdates] = useState(true)
  const [messageNotifications, setMessageNotifications] = useState(true)
  const [reminderNotifications, setReminderNotifications] = useState(true)

  // Add these after the notification settings state variables
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Add this after the state declarations
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.user_metadata?.name || "")
      setEmail(currentUser.email || "")
      setBio(
        currentUser.user_metadata?.bio ||
          "Computer Science student with interests in web development and machine learning.",
      )
      setAvatarUrl(currentUser.user_metadata?.avatar || "")
    }
  }, [currentUser])

  const handleAvatarClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file)
      setAvatarUrl(objectUrl)
    }
  }

  const uploadAvatar = async (file) => {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${currentUser.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload the file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage.from("avatars").upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
        onUploadProgress: (progress) => {
          setUploadProgress(Math.round((progress.loaded / progress.total) * 100))
        },
      })

      if (uploadError) {
        throw uploadError
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error("Error uploading avatar:", error)
      throw error
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setNotification(null)
    setUploadProgress(0)

    try {
      let avatarPublicUrl = currentUser?.user_metadata?.avatar || ""

      // If there's a new avatar file, upload it
      if (avatarFile) {
        avatarPublicUrl = await uploadAvatar(avatarFile)
      }

      const { success, error } = await updateProfile({
        name,
        email,
        bio,
        avatar: avatarPublicUrl,
      })

      if (success) {
        setNotification({
          type: "success",
          message: "Profile updated successfully!",
        })
        // Reset the file input
        setAvatarFile(null)
      } else {
        setNotification({
          type: "error",
          message: error.message || "Failed to update profile. Please try again.",
        })
      }
    } catch (err) {
      setNotification({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      })
      console.error("Error updating profile:", err)
    } finally {
      setIsSubmitting(false)

      // Clear notification after 5 seconds
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-56 md:border-r border-gray-200">
            <nav className="flex md:flex-col overflow-x-auto md:overflow-x-hidden">
              <button
                className={`px-4 py-3 flex items-center text-sm font-medium border-b-2 md:border-b-0 md:border-l-2 focus:outline-none ${
                  activeTab === "profile"
                    ? "border-blue-500 text-blue-600 md:bg-blue-50"
                    : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                <User size={16} className="mr-2" />
                Profile
              </button>

              <button
                className={`px-4 py-3 flex items-center text-sm font-medium border-b-2 md:border-b-0 md:border-l-2 focus:outline-none ${
                  activeTab === "notifications"
                    ? "border-blue-500 text-blue-600 md:bg-blue-50"
                    : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("notifications")}
              >
                <Bell size={16} className="mr-2" />
                Notifications
              </button>

              <button
                className={`px-4 py-3 flex items-center text-sm font-medium border-b-2 md:border-b-0 md:border-l-2 focus:outline-none ${
                  activeTab === "security"
                    ? "border-blue-500 text-blue-600 md:bg-blue-50"
                    : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("security")}
              >
                <Lock size={16} className="mr-2" />
                Security
              </button>

              <button
                className={`px-4 py-3 flex items-center text-sm font-medium border-b-2 md:border-b-0 md:border-l-2 focus:outline-none ${
                  activeTab === "privacy"
                    ? "border-blue-500 text-blue-600 md:bg-blue-50"
                    : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("privacy")}
              >
                <Shield size={16} className="mr-2" />
                Privacy
              </button>
            </nav>
          </div>

          {/* Settings content */}
          <div className="flex-1 p-6">
            {activeTab === "profile" && (
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">Profile Settings</h2>
                {notification && (
                  <div
                    className={`mb-4 p-3 rounded-md ${notification.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}
                  >
                    <div className="flex items-center">
                      {notification.type === "success" ? (
                        <CheckCircle size={16} className="mr-2 text-green-500" />
                      ) : (
                        <div className="mr-2 text-red-500">!</div>
                      )}
                      {notification.message}
                    </div>
                  </div>
                )}

                <form onSubmit={handleProfileSubmit}>
                  <div className="space-y-6">
                    {/* Avatar upload section */}
                    <div className="flex items-center">
                      <div className="relative group">
                        <Avatar
                          src={avatarUrl}
                          alt="Profile"
                          size="xl"
                          className="cursor-pointer group-hover:opacity-80 transition-opacity"
                          onClick={handleAvatarClick}
                        />
                        <div
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          onClick={handleAvatarClick}
                        >
                          <Upload size={24} className="text-white" />
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                      <div className="ml-4">
                        <button
                          type="button"
                          className="text-sm font-medium text-blue-600 hover:text-blue-500"
                          onClick={handleAvatarClick}
                        >
                          Change avatar
                        </button>
                        <p className="text-xs text-gray-500 mt-1">JPG, GIF or PNG. 1MB max.</p>

                        {/* Upload progress bar */}
                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Form fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        id="name"
                        type="text"
                        label="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />

                      <Input
                        id="email"
                        type="email"
                        label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        rows={4}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting}>
                        <Save size={16} className="mr-1" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "notifications" && (
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">Notification Settings</h2>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                        <p className="text-xs text-gray-500 mt-1">Receive email notifications for important updates</p>
                      </div>
                      <div className="ml-4 flex items-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={emailNotifications}
                            onChange={() => setEmailNotifications(!emailNotifications)}
                          />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-900">Notification Preferences</h3>

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm text-gray-700">Project updates</p>
                        <p className="text-xs text-gray-500">Changes to projects you're a member of</p>
                      </div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={projectUpdates}
                          onChange={() => setProjectUpdates(!projectUpdates)}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm text-gray-700">Messages</p>
                        <p className="text-xs text-gray-500">When you receive new messages</p>
                      </div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={messageNotifications}
                          onChange={() => setMessageNotifications(!messageNotifications)}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm text-gray-700">Reminders</p>
                        <p className="text-xs text-gray-500">For upcoming deadlines and meetings</p>
                      </div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={reminderNotifications}
                          onChange={() => setReminderNotifications(!reminderNotifications)}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button variant="primary" onClick={() => {}}>
                      <Save size={16} className="mr-1" />
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">Security Settings</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Change Password</h3>
                    <div className="space-y-4">
                      <Input
                        id="current-password"
                        type="password"
                        label="Current Password"
                        value=""
                        onChange={() => {}}
                        required
                      />

                      <Input
                        id="new-password"
                        type="password"
                        label="New Password"
                        value=""
                        onChange={() => {}}
                        required
                      />

                      <Input
                        id="confirm-password"
                        type="password"
                        label="Confirm New Password"
                        value=""
                        onChange={() => {}}
                        required
                      />
                    </div>

                    <div className="mt-4">
                      <Button variant="primary">Update Password</Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">Privacy Settings</h2>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Profile Visibility</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Make your profile visible to other students in your network
                        </p>
                      </div>
                      <div className="ml-4 flex items-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Activity Status</h3>
                        <p className="text-xs text-gray-500 mt-1">Show when you're active on the platform</p>
                      </div>
                      <div className="ml-4 flex items-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Research Participation</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Help improve StudyCollab by allowing anonymized usage data collection
                        </p>
                      </div>
                      <div className="ml-4 flex items-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={false} />
                          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button variant="primary" onClick={() => {}}>
                      <Save size={16} className="mr-1" />
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
