export type UserRole = "venter" | "listener" | "chat"

export type User = {
  id: string
  username: string
  role: UserRole
  socketId: string
  lastMatch?: string // ID of last matched user
}

export type Match = {
  id: string
  users: [string, string] // user IDs
  timestamp: number
}

export type CallStatus = "idle" | "calling" | "ringing" | "connected" | "declined"

export type ServerToClientEvents = {
  userCount: (count: number) => void
  matched: (matchData: { username: string; role: UserRole }) => void
  message: (message: { id: string; content: string; sender: "user" | "match" }) => void
  unmatched: () => void
  // Call events
  incomingCall: () => void
  callAccepted: () => void
  callDeclined: () => void
  callEnded: () => void
}

export type ClientToServerEvents = {
  join: (data: { username: string; role: UserRole }) => void
  findMatch: (role: UserRole) => void
  message: (content: string) => void
  leave: () => void
  // Call events
  initiateCall: () => void
  acceptCall: () => void
  declineCall: () => void
  endCall: () => void
  shuffle: () => void 
  rolechange: (role: UserRole) => void
}

