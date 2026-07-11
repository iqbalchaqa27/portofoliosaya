"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface GlassmorphicCardProps {
  children: ReactNode
}

export function GlassmorphicCard({ children }: GlassmorphicCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <div className="relative overflow-hidden rounded-xl bg-kv-navy/55 backdrop-blur-sm border border-kv-sky/20 p-6 transition-all duration-300 hover:border-kv-sand/60">
        <div className="absolute -inset-1 bg-gradient-to-r from-kv-sky/15 to-kv-rust/15 rounded-xl blur opacity-25 hover:opacity-100 transition duration-1000 hover:duration-200"></div>

        <div className="relative">{children}</div>
      </div>
    </motion.div>
  )
}
