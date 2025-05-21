import Image from "next/image"

// This is a placeholder URL. You should replace it with the actual URL for the Open Peeps API
// or use a local path if you've downloaded the images.
const OPEN_PEEPS_BASE_URL = "https://api.openpeeps.com/random"

interface OpenPeepsAvatarProps {
  seed: string
  size?: number
}

export function OpenPeepsAvatar({ seed, size = 40 }: OpenPeepsAvatarProps) {
  // In a real implementation, you'd use the seed to generate a consistent
  // but random avatar for each user. For now, we'll just use it as part of the URL.
  const avatarUrl = `${OPEN_PEEPS_BASE_URL}?seed=${seed}`

  return (
    <div className="rounded-full overflow-hidden bg-gray-200" style={{ width: size, height: size }}>
      <Image
        src={avatarUrl || "/placeholder.svg"}
        alt="User avatar"
        width={size}
        height={size}
        className="object-cover"
      />
    </div>
  )
}

