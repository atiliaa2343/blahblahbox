"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Send, ChevronDown } from "lucide-react"
import { io, type Socket } from "socket.io-client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OpenPeepsAvatar } from "@/components/open-peeps-avatar"
import { CallDialog } from "@/components/call-dialog"
import type { ClientToServerEvents, ServerToClientEvents, UserRole, CallStatus } from "@/types/chat"
import CallIcon from "@/components/call-icon"

type Message = {
  id: string
  content: string
  sender: "user" | "match" | "system"
}

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [role, setRole] = useState<UserRole>((searchParams.get("role") as UserRole) || "chat")
  const username = searchParams.get("username") || "AnonymousUser"
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [matchStatus, setMatchStatus] = useState<"searching" | "connected" | "disconnected">("searching")
  const [matchUsername, setMatchUsername] = useState("")
  const [matchRole, setMatchRole] = useState<UserRole>("chat")
  const [onlineCount, setOnlineCount] = useState(1)
  const [callStatus, setCallStatus] = useState<CallStatus>("idle")
  const [isCallInitiator, setIsCallInitiator] = useState(false)
  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> |null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleLogoClick = () => {
    // Disconnect the socket before navigating
    socketRef.current?.disconnect()
    // Clear any stored session data
    localStorage.removeItem("userRole")
    localStorage.removeItem("username")
    // Navigate to the home page
    router.push("/")
  }

  useEffect(() => {
    const socket = io("/", {
      path: "/api/socket",
      addTrailingSlash: false,
    })

    socketRef.current = socket

    socket.on("connect", () => {
      console.log("Connected to server")
      setMatchStatus("searching")
    })

    socket.on("disconnect", () => {
      console.log("Disconnected from server")
      setMatchStatus("disconnected")
    })

    socket.on("match-found", (match) => {
      setMatchStatus("connected")
      setMatchUsername(match.username)
      setMatchRole(match.role)
    })

    socket.on("match-lost", () => {
      setMatchStatus("searching")
      setMatchUsername("")
      setMatchRole("chat")
    })

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message])
    })

    socket.on("online-count", (count) => {
      setOnlineCount(count)
    })

    socket.on("incomingCall", () => {
      if (callStatus === "idle") {
        setCallStatus("ringing")
        setIsCallInitiator(false)
      }
    })

    socket.on("callAccepted", () => {
      setCallStatus("connected")
    })

    socket.on("callDeclined", () => {
      setCallStatus("declined")
      setTimeout(() => setCallStatus("idle"), 3000)
    })

    socket.on("callEnded", () => {
      setCallStatus("idle")
      setIsCallInitiator(false)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim() === "" || matchStatus !== "connected") return
    socketRef.current?.emit("message", inputMessage)
    setInputMessage("")
  }

  const handleShufflePartner = () => {
    if (matchStatus === "connected") {
      socketRef.current?.emit("shuffle")
    }
  }

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole)
    socketRef.current?.emit("rolechange", newRole)
  }

  const handleInitiateCall = () => {
    if (callStatus === "idle" && socketRef.current) {
      socketRef.current.emit("initiateCall")
      setCallStatus("calling")
      setIsCallInitiator(true)
    }
  }

  const handleAcceptCall = () => {
    if (socketRef.current) {
      socketRef.current.emit("acceptCall")
      setCallStatus("connected")
    }
  }

  const handleDeclineCall = () => {
    if (socketRef.current) {
      socketRef.current.emit("declineCall")
      setCallStatus("idle")
    }
  }

  const handleEndCall = () => {
    if (socketRef.current) {
      socketRef.current.emit("endCall")
      setCallStatus("idle")
      setIsCallInitiator(false)
    }
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const roleOptions: { value: UserRole; label: string; icon: string }[] = [
    { value: "listener", label: "Listen", icon: "🎧" },
    { value: "venter", label: "Vent", icon: "😔" },
    { value: "chat", label: "Just Chat", icon: "💭" },
  ]

  const CallStatusMessage = () => {
    switch (callStatus) {
      case "calling":
        return (
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs text-center">
            Calling {matchUsername}...
          </div>
        )
      case "connected":
        return (
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs text-center">
            You're Live! Go Ahead And Talk :)
          </div>
        )
      case "declined":
        return (
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs text-center">
            {matchUsername} Declined The Call.
          </div>
        )
      default:
        return null
    }
  }

  return ( 
    
    
    <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div
        className="
          w-[90%] sm:w-[65%] lg:w-[37.5%] xl:w-[32.5%]
          min-w-[350px] sm:min-w-[400px] max-w-[600px]
          h-[80vh]
          flex flex-col
        "
      > 

        {/* Header */}
        <div className="text-center mb-4 flex-shrink-0">
          <h1
            className="text-2xl font-bold font-poppins cursor-pointer hover:text-primary transition-colors"
            onClick={handleLogoClick}
          >
            BlahBlahBox
          </h1>
          <p className="text-gray-600 text-sm">Vent. Listen. Let It Go.</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <p className="text-xs text-gray-500">
               {onlineCount === 1 ? `${onlineCount} Person` : `${onlineCount} People` } Online
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-4 flex-shrink-0">
          <button
            onClick={handleShufflePartner}
            className="
              w-full flex items-center gap-3 px-6 py-4 rounded-2xl
              bg-[#ECDFCF] text-[#1B221D] transition-all duration-200
              shadow-[0_2px_4px_rgba(0,0,0,0.15)]
              hover:bg-[#1B221D] hover:text-white
              hover:shadow-[inset_0_4px_4px_rgba(0,0,0,1)]
            "
          >
            Shuffle Partner
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="
                  w-full flex items-center justify-between gap-3 px-6 py-4 rounded-2xl
                  bg-[#ECDFCF] text-[#1B221D] transition-all duration-200
                  shadow-[0_2px_4px_rgba(0,0,0,0.15)]
                  hover:bg-[#1B221D] hover:text-white
                  hover:shadow-[inset_0_4px_4px_rgba(0,0,0,1)]
                  group
                "
              >
                <span>Change Role</span>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] p-2">
              {roleOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleRoleChange(option.value)}
                  className={`
                    flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer text-s
                    ${role === option.value ? "text-[#7592FC]" : "text-[#1B221D]"}
                    hover:bg-[#ECDFCF] hover:text-[#7592FC]
                  `}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Chat Container */}
        <div
          className="
          bg-surface rounded-3xl shadow-lg overflow-hidden 
          flex flex-col flex-grow
          relative
        "
        >
          {/* Chat Header with Call Button */}
          <div className="p-3 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center justify-between mr-2.5 mt-2.5">
              <span className="text-sm">
                {matchStatus === "connected" ? (
                  <>
                    {matchUsername} is{" "}
                    <span className="text-primary">
                      {matchRole === "venter" ? "Venting" : matchRole === "listener" ? "Listening" : "Chatting"}
                    </span>
                  </>
                ) : (
                  "Looking For Your Next Partner..."
                )}
              </span>
              <button
                onClick={
                  matchStatus === "connected"
                    ? callStatus === "connected"
                      ? handleEndCall
                      : handleInitiateCall
                    : undefined
                }
                className={`p-[0.2em] rounded-full transition-colors ${
                  callStatus === "connected"
                    ? "text-primary"
                    : matchStatus === "connected"
                      ? "text-gray-400 hover:text-primary"
                      : "text-gray-300"
                }`}
                disabled={matchStatus !== "connected"}
              >
                <CallIcon status={callStatus} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-3 space-y-3">
            {matchStatus === "searching" ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <p className="text-lg font-medium mb-2">Sorry We Couldn't Find A Match :(</p>
                <p className="text-gray-500">Try Changing Roles Or Come Back Later</p>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`
                      ${message.sender === "system" ? "flex justify-center" : ""}
                      ${message.sender === "user" ? "flex justify-end" : ""}
                      ${message.sender === "match" ? "flex justify-start" : ""}
                    `}
                  >
                    {message.sender === "match" && (
                      <div className="flex items-end gap-1">
                        <OpenPeepsAvatar seed={matchUsername} size={24} />
                        <div className="bg-surface text-foreground px-3 py-1.5 rounded-xl rounded-bl-none max-w-[200px] shadow-sm text-xs">
                          {message.content}
                        </div>
                      </div>
                    )}

                    {message.sender === "user" && (
                      <div className="bg-[#1B221D] text-white px-3 py-1.5 rounded-xl rounded-br-none max-w-[200px] shadow-sm text-xs">
                        {message.content}
                      </div>
                    )}

                    {message.sender === "system" && (
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs">{message.content}</div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            <CallStatusMessage />
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-2 border-t border-gray-100 flex-shrink-0">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Type a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-grow bg-background border-0 focus-visible:ring-0 rounded-full font-inter text-xs h-8"
              />
              <Button
                type="submit"
                size="icon"
                className="rounded-full bg-[#1B221D] text-white hover:bg-[#1B221D]/90 h-8 w-8 p-0 flex-shrink-0"
              >
                <Send className="h-3 w-3" />
              </Button>
            </form>
          </div>

          {/* Call Dialog */}
          {callStatus === "ringing" && (
            <CallDialog callerName={matchUsername} onAccept={handleAcceptCall} onDecline={handleDeclineCall} />
          )}
        </div> 
        
      </div>  
      
      
    </main>  
      

        )
}
