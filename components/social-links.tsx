// SocialLinks.tsx
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { BoxLogo } from "@/components/icons"

export function SocialLinks({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}) {
  const links = [
    {
      id: "twitter",
      label: "Shout At Us On X",
      href: "https://twitter.com/blahblahbox",
    },
    {
      id: "kofi",
      label: "Support Us Through Kofi ♥",
      href: "https://ko-fi.com/blahblahbox",
    },
    {
      id: "feedback",
      label: "Got Feedback? We're Listening",
      href: "https://forms.google.com/feedback",
    },
  ]

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      <AnimatePresence mode="popLayout">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-4 flex flex-col items-end gap-2"
          >
            {links.map((link) => (
              <motion.a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="
                  inline-flex h-10 items-center
                  rounded-2xl bg-[#ECDFCF] px-2.5 py-1.5
                  text-sm text-[#1B221D]
                  shadow-[0_2px_4px_rgba(0,0,0,0.15)]
                  whitespace-nowrap
                "
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <BoxLogo isOpen={isOpen} />
      </motion.button>
    </div>
  )
}

