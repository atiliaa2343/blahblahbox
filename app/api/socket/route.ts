import { Server as SocketIOServer } from "socket.io"
import type { NextApiRequest } from "next"
import type { ClientToServerEvents, ServerToClientEvents, UserRole } from "@/types/chat"

let io: SocketIOServer<ClientToServerEvents, ServerToClientEvents> | null = null
let waitingUsers: { socketId: string; role: UserRole; username: string }[] = []

export async function GET(req: NextApiRequest) {
  if (!io) {
    console.log("Initializing Socket.io server...")
    io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>({
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    })

    if (!io) {
      console.error("Socket.io server failed to initialize")
      return new Response("Socket initialization failed", {
        status: 500,
        headers: {
          "Content-Type": "text/plain",
        },
      })
    }

    io.on("connection", (socket) => {
      console.log("New client connected")

      socket.on("join", (data) => {
        const { username, role } = data
        console.log("User joined:", data)
        
        // Add user to waiting list
        waitingUsers.push({ socketId: socket.id, role, username })
        
        // Update online count for all clients
        if (io) {
          io.emit("userCount", waitingUsers.length)
        }
      })

      socket.on("findMatch", (role) => {
        console.log("Finding match for role:", role)
        
        // Find a match with opposite role
        const match = waitingUsers.find(u => 
          u.role !== role && u.socketId !== socket.id
        )

        if (match && io) {
          // Remove both users from waiting list
          waitingUsers = waitingUsers.filter(u => u.socketId !== socket.id && u.socketId !== match.socketId)
          
          // Notify both users of the match
          socket.emit("matched", { username: match.username, role: match.role })
          io.to(match.socketId).emit("matched", { username: socket.data.username, role })
        }
      })

      socket.on("message", (content) => {
        console.log("Message received:", content)
        // Broadcast message to the matched user
        if (io) {
          io.emit("message", { id: crypto.randomUUID(), content, sender: "user" })
        }
      })

      socket.on("initiateCall", () => {
        console.log("Call initiated")
        // Broadcast call initiation to matched user
        socket.broadcast.emit("incomingCall")
      })

      socket.on("acceptCall", () => {
        console.log("Call accepted")
        // Notify both users
        socket.emit("callAccepted")
        socket.broadcast.emit("callAccepted")
      })

      socket.on("declineCall", () => {
        console.log("Call declined")
        // Notify the other user
        socket.broadcast.emit("callDeclined")
      })

      socket.on("endCall", () => {
        console.log("Call ended")
        // Notify both users
        socket.emit("callEnded")
        socket.broadcast.emit("callEnded")
      })

      socket.on("disconnect", () => {
        console.log("Client disconnected")
        // Remove user from waiting list
        waitingUsers = waitingUsers.filter(u => u.socketId !== socket.id)
        // Update online count
        if (io) {
          io.emit("userCount", waitingUsers.length)
        }
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

