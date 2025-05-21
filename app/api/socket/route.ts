import { Server as SocketIOServer } from "socket.io"
import type { NextApiRequest } from "next"
import type { ClientToServerEvents, ServerToClientEvents } from "@/types/chat"

let io: SocketIOServer<ClientToServerEvents, ServerToClientEvents> | null = null

export async function GET(req: NextApiRequest) {
  if (!io) {
    console.log("Initializing Socket.io server...")
    io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>({
      path: "/api/socket",
      addTrailingSlash: false,
    })

    io.on("connection", (socket) => {
      console.log("New client connected")

      socket.on("join", (data) => {
        console.log("User joined:", data)
        // Implement matching logic here
      })

      socket.on("findMatch", (role) => {
        console.log("Finding match for role:", role)
        // Implement match finding logic
      })

      socket.on("message", (content) => {
        console.log("Message received:", content)
        // Broadcast message to the matched user
      })

      socket.on("initiateCall", () => {
        console.log("Call initiated")
        // Handle call initiation
      })

      socket.on("acceptCall", () => {
        console.log("Call accepted")
        // Handle call acceptance
      })

      socket.on("declineCall", () => {
        console.log("Call declined")
        // Handle call decline
      })

      socket.on("endCall", () => {
        console.log("Call ended")
        // Handle call ending
      })

      socket.on("disconnect", () => {
        console.log("Client disconnected")
      })
    })
  }

  return new Response("Socket is initialized", {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  })
}

