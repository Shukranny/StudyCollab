"use client"

import { useState } from "react"
import { Search, Send, UserPlus, Phone, Video, Info, Paperclip, Smile } from "lucide-react"
import Button from "../components/ui/Button"

const Messages = () => {
  const [activeConversation, setActiveConversation] = useState("1")
  const [messageText, setMessageText] = useState("")

  // Mock conversations
  const conversations = [
    {
      id: "1",
      name: "Team Project Group",
      avatar: "https://i.pravatar.cc/150?img=1",
      lastMessage: "Alex: I submitted the final version",
      timestamp: "10:45 AM",
      unread: 3,
      online: true,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?img=2",
      lastMessage: "Can we review the math homework?",
      timestamp: "Yesterday",
      unread: 0,
      online: true,
    },
    {
      id: "3",
      name: "Study Group - Biology",
      avatar: "https://i.pravatar.cc/150?img=3",
      lastMessage: "Meeting scheduled for tomorrow",
      timestamp: "Yesterday",
      unread: 1,
      online: false,
    },
    {
      id: "4",
      name: "David Williams",
      avatar: "https://i.pravatar.cc/150?img=4",
      lastMessage: "Thanks for your help!",
      timestamp: "Monday",
      unread: 0,
      online: false,
    },
  ]

  // Mock messages for the first conversation
  const messages = {
    1: [
      {
        id: "1",
        text: "Hey everyone! Has anyone started working on the presentation slides?",
        timestamp: "10:30 AM",
        sender: "user",
        read: true,
      },
      {
        id: "2",
        text: "I started putting together the outline and first few slides.",
        timestamp: "10:32 AM",
        sender: "other",
        read: true,
      },
      {
        id: "3",
        text: "Great, should we divide up the work?",
        timestamp: "10:35 AM",
        sender: "user",
        read: true,
      },
      {
        id: "4",
        text: "I can handle the research section if someone else wants to do the introduction?",
        timestamp: "10:38 AM",
        sender: "other",
        read: true,
      },
      {
        id: "5",
        text: "I'll take the introduction and conclusion. Alex, can you handle the visuals?",
        timestamp: "10:40 AM",
        sender: "user",
        read: true,
      },
      {
        id: "6",
        text: "Sure thing! I just found some great graphs we can use.",
        timestamp: "10:42 AM",
        sender: "other",
        read: true,
      },
      {
        id: "7",
        text: "I submitted the final version for everyone to review.",
        timestamp: "10:45 AM",
        sender: "other",
        read: false,
      },
    ],
    2: [
      {
        id: "1",
        text: "Hi Sarah, how are you doing with the calculus assignment?",
        timestamp: "Yesterday",
        sender: "user",
        read: true,
      },
      {
        id: "2",
        text: "Actually, I was just about to message you. I'm stuck on problem 3.",
        timestamp: "Yesterday",
        sender: "other",
        read: true,
      },
      {
        id: "3",
        text: "Can we review the math homework together?",
        timestamp: "Yesterday",
        sender: "other",
        read: true,
      },
    ],
  }

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeConversation) return

    // Clear the input
    setMessageText("")

    // In a real app, this would send the message to the server
    console.log("Message sent:", messageText)
  }

  const currentMessages = activeConversation ? messages[activeConversation] || [] : []
  const currentConversation = conversations.find((c) => c.id === activeConversation)

  return (
    <div className="h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex">
        {/* Sidebar / Conversation list */}
        <div className="w-full md:w-72 border-r border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold mb-2">Messages</h2>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search messages..."
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                className={`w-full text-left p-3 border-b border-gray-100 hover:bg-gray-50 flex items-center ${
                  activeConversation === conversation.id ? "bg-blue-50" : ""
                }`}
                onClick={() => setActiveConversation(conversation.id)}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={conversation.avatar}
                    alt={conversation.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {conversation.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                <div className="ml-3 flex-1 overflow-hidden">
                  <div className="flex justify-between items-baseline">
                    <p className="font-medium text-gray-900 truncate">{conversation.name}</p>
                    <p className="text-xs text-gray-500">{conversation.timestamp}</p>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                </div>

                {conversation.unread > 0 && (
                  <div className="ml-2 flex-shrink-0 bg-blue-600 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {conversation.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main chat area */}
        <div className="hidden md:flex flex-1 flex-col">
          {activeConversation ? (
            <>
              {/* Chat header */}
              <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <img
                    src={currentConversation?.avatar}
                    alt={currentConversation?.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div>
                    <h3 className="font-medium">{currentConversation?.name}</h3>
                    <p className="text-xs text-gray-500">{currentConversation?.online ? "Online" : "Offline"}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                    <Phone size={18} />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                    <Video size={18} />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                    <Info size={18} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-3">
                  {currentMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                          message.sender === "user"
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-200" : "text-gray-500"}`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message input */}
              <div className="p-3 border-t border-gray-200">
                <div className="flex items-center">
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                    <Paperclip size={18} />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 mx-2 focus:outline-none focus:border-blue-500"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage()
                      }
                    }}
                  />
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                    <Smile size={18} />
                  </button>
                  <button
                    className={`ml-1 p-2 rounded-full ${
                      messageText.trim() ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.9C9.87812 3.30493 11.1801 2.99656 12.5 3H13C15.0843 3.11499 17.053 3.99476 18.5291 5.47086C20.0052 6.94696 20.885 8.91565 21 11V11.5Z"
                      stroke="#3B82F6"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Your Messages</h3>
                <p className="text-sm text-gray-500 mb-4">Send private messages to collaborators</p>
                <Button variant="primary" size="sm" onClick={() => {}}>
                  <UserPlus size={16} className="mr-1" />
                  New Message
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Messages
