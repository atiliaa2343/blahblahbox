"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

interface CallDialogProps {
  callerName: string
  onAccept: () => void
  onDecline: () => void
}

export function CallDialog({ callerName, onAccept, onDecline }: CallDialogProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute inset-x-0 top-1/3 mx-auto w-[80%] max-w-sm bg-white rounded-xl shadow-lg p-4"
      >
        <h3 className="text-center mb-4 text-sm">{callerName} Wants To Voicechat</h3>
        <div className="flex gap-2 justify-center">
          <Button
            onClick={onDecline}
            variant="outline"
            className="w-24 bg-surface hover:bg-surface text-foreground border-0 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.15)] hover:shadow-[inset_0_4px_4px_rgba(0,0,0,1)] hover:text-white hover:bg-[#1B221D]"
          >
            Pass
          </Button>
          <Button onClick={onAccept} className="w-24 bg-[#7592FC] hover:bg-[#7592FC]/90 text-white rounded-full">
            Talk
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

