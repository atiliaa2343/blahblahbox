"use client"

import { useEffect, useState } from "react"
import { OpenPeepsAvatar } from "@/components/open-peeps-avatar"
import type { UserRole } from "@/types/chat"

interface ChatComponentProps {
  role: UserRole
  username: string
}

export function ChatComponent({ role, username }: ChatComponentProps) {
  const [matchedUser, setMatchedUser] = useState<string | null>(null)

  useEffect(() => {
    // Simulate fetching a match.  Replace with actual socket.io logic.
    const intervalId = setInterval(() => {
      setMatchedUser(Math.random() < 0.5 ? "MatchedUser" : null)
    }, 3000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-center mb-8">
        <p className="text-xl font-bold mb-2">You are a {role}</p>
        <p>Username: {username}</p>
        {matchedUser && (
          <div className="mt-4">
            <p className="text-lg font-bold mb-2">Matched with:</p>
            <div className="flex items-center gap-4">
              <OpenPeepsAvatar seed={matchedUser} size={60} />
              <p className="text-lg">{matchedUser}</p>
            </div>
          </div>
        )}
      </div>
      {/* Add chat UI here */}
      <div className="w-full max-w-2xl p-4 border rounded-lg">
        {/* Placeholder for chat messages */}
        <p>Chat UI will go here</p>
      </div>
    </div>
  )
}

