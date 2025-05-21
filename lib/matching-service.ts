type UserRole = "venter" | "listener" | "chat"

type MatchedUser = {
  username: string
  role: UserRole
}

const mockUsers: MatchedUser[] = [
  { username: "QuietOwl", role: "listener" },
  { username: "BraveTiger", role: "venter" },
  { username: "SwiftFox", role: "chat" },
  { username: "GentleBear", role: "listener" },
  { username: "WildDeer", role: "venter" },
  { username: "CleverHawk", role: "chat" },
]

export async function findMatch(userRole: UserRole): Promise<MatchedUser> {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  let compatibleUsers: MatchedUser[] = []

  if (userRole === "venter") {
    compatibleUsers = mockUsers.filter((user) => user.role === "listener")
  } else if (userRole === "listener") {
    compatibleUsers = mockUsers.filter((user) => user.role === "venter")
  } else {
    compatibleUsers = mockUsers.filter((user) => user.role === "chat")
  }

  if (compatibleUsers.length === 0) {
    throw new Error("No compatible users found")
  }

  return compatibleUsers[Math.floor(Math.random() * compatibleUsers.length)]
}

