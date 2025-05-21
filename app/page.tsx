"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { SocialLinks } from "@/components/social-links"
import { Button } from "@/components/ui/button"
import { TalkIcon, ListenIcon, ChatIcon, BoxLogo } from "@/components/icons"
import { generateUsername } from "@/lib/username-generator" 
import { io, type Socket } from "socket.io-client"
export default function Home() {
  const router = useRouter()
  const [onlineCount, setOnlineCount] = useState(0)
  const socketRef = useRef<any>(null)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [isBoxOpen, setIsBoxOpen] = useState(false) 
   
 

  // Remove or comment out this useEffect
  /*
useEffect(() => {
  // Check if there's an existing session
  const existingRole = localStorage.getItem("userRole")
  const existingUsername = localStorage.getItem("username")

  if (existingRole && existingUsername) {
    router.push(`/chat?role=${existingRole}&username=${existingUsername}`)
  }
}, [router])
*/

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role)
  }

  useEffect(() => {
    import('socket.io-client').then((io) => {
      socketRef.current = io.connect('/api/socket', {
        path: '/api/socket'
      })

      socketRef.current?.on('online-count', (count: number) => {
        setOnlineCount(count)
      })

      return () => {
        socketRef.current?.disconnect()
      }
    })
  }, [])

  const handleFindMatch = async () => {
    if (!selectedRole) return
    const username = await generateUsername()

    // Store the session info
    localStorage.setItem("userRole", selectedRole)
    localStorage.setItem("username", username)

    router.push(`/chat?role=${selectedRole}&username=${username}`)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-[25%] min-w-[300px] space-y-8">
        <div className="text-center space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight font-poppins"
          >
            BlahBlahBox
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600"
          >
            Vent. Listen. Let It Go.
          </motion.p>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
              className="flex justify-between items-center group"
            >
              <button
                onClick={() => handleRoleSelect("venter")}
                className={`
                  w-full flex items-center gap-3 px-6 py-4 rounded-2xl
                  bg-[#ECDFCF] text-[#1B221D] transition-all duration-200
                  shadow-[0_2px_4px_rgba(0,0,0,0.15)]
                  hover:bg-[#1B221D] hover:text-white
                  hover:shadow-[inset_0_4px_4px_rgba(0,0,0,1)]
                  ${selectedRole === "venter" ? "bg-foreground text-white shadow-[inset_0_4px_4px_rgba(0,0,0,1)]" : ""}
                `}
              >
                <TalkIcon />
                <span className="font-medium">Talk</span>
                <span className="ml-auto text-sm text-[#606060] group-hover:text-[#D4D4D4] group-active:text-[#D4D4D4]">
                  Share Your Thoughts
                </span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2 }}
              className="flex justify-between items-center group"
            >
              <button
                onClick={() => handleRoleSelect("listener")}
                className={`
                  w-full flex items-center gap-3 px-6 py-4 rounded-2xl
                  bg-[#ECDFCF] text-[#1B221D] transition-all duration-200
                  shadow-[0_2px_4px_rgba(0,0,0,0.15)]
                  hover:bg-[#1B221D] hover:text-white
                  hover:shadow-[inset_0_4px_4px_rgba(0,0,0,1)]
                  ${selectedRole === "listener" ? "bg-foreground text-white shadow-[inset_0_4px_4px_rgba(0,0,0,1)]" : ""}
                `}
              >
                <ListenIcon />
                <span className="font-medium">Listen</span>
                <span className="ml-auto text-sm text-[#606060] group-hover:text-[#D4D4D4] group-active:text-[#D4D4D4]">
                  Lend An Ear
                </span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.3 }}
              className="flex justify-between items-center group"
            >
              <button
                onClick={() => handleRoleSelect("chat")}
                className={`
                  w-full flex items-center gap-3 px-6 py-4 rounded-2xl
                  bg-[#ECDFCF] text-[#1B221D] transition-all duration-200
                  shadow-[0_2px_4px_rgba(0,0,0,0.15)]
                  hover:bg-[#1B221D] hover:text-white
                  ${selectedRole === "chat" ? "bg-foreground text-white" : ""}
                `}
              >
                <ChatIcon />
                <span className="font-medium">Chat</span>
                <span className="ml-auto text-sm text-[#606060] group-hover:text-[#D4D4D4] group-active:text-[#D4D4D4]">
                  Casual, No-Pressure Talk
                </span>
              </button>
            </motion.div>
          </AnimatePresence>

          {selectedRole && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-full font-inter"
                onClick={handleFindMatch}
              >
                Match Now
              </Button>
            </motion.div>
          )}
        </div>

        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-gray-600 text-sm">No Data Stored. No History. Just Conversation.</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" /> 
            
            <p className="text-gray-500 text-sm"> {onlineCount === 1 ? "Person" : `${onlineCount} People`} Online</p>
          </div>
        </motion.div> 
      </div>
      <SocialLinks isOpen={isBoxOpen} setIsOpen={setIsBoxOpen} />

    </main>
  )
}



