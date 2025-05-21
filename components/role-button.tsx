"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface RoleButtonProps {
  icon: LucideIcon
  label: string
  description: string
  onClick: () => void
  isSelected?: boolean
}

export function RoleButton({ icon: Icon, label, description, onClick, isSelected }: RoleButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        variant="outline"
        className={`w-full bg-surface hover:bg-surface text-foreground border-0 h-16 rounded-2xl transition-all duration-200 ${
          isSelected ? "ring-2 ring-primary ring-offset-2" : "shadow-lg hover:shadow-xl"
        }`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5" />
            <span className="font-medium font-poppins">{label}</span>
          </div>
          <span className="text-sm text-gray-500 font-inter">{description}</span>
        </div>
      </Button>
    </motion.div>
  )
}

