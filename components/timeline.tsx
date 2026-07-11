"use client"

import { motion } from "framer-motion"
import { useMobile } from "@/hooks/use-mobile"
import type { ExperienceItem } from "@/lib/site-content"

interface TimelineProps {
  experiences: ExperienceItem[]
}

export function Timeline({ experiences }: TimelineProps) {
  const isMobile = useMobile()

  return (
    <div
      className={`space-y-12 relative ${
        !isMobile
          ? "before:absolute before:inset-0 before:left-1/2 before:ml-0 before:-translate-x-px before:border-l-2 before:border-kv-sky/25 before:h-full before:z-0"
          : ""
      }`}
    >
      {experiences.map((experience, index) => (
        <div
          key={index}
          className={`relative z-10 flex items-center ${index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"}`}
        >
          <motion.div
            className={`w-full md:w-1/2 ${index % 2 === 0 ? "md:pl-10" : "md:pr-10"}`}
            initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="relative overflow-hidden rounded-xl bg-kv-navy/55 backdrop-blur-sm border border-kv-sky/20 p-6 transition-all duration-300 hover:border-kv-sand/60">
              <div className="absolute -inset-1 bg-gradient-to-r from-kv-sky/15 to-kv-rust/15 rounded-xl blur opacity-25 hover:opacity-100 transition duration-1000 hover:duration-200"></div>

              <div className="relative">
                <h3 className="text-xl font-bold">{experience.title}</h3>
                <div className="text-kv-sand mb-4">
                  {experience.company} | {experience.period}
                </div>
                <p className="text-kv-cream/80">{experience.description}</p>
              </div>
            </div>
          </motion.div>

          {!isMobile && (
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
              <motion.div
                className="w-6 h-6 rounded-full bg-gradient-to-r from-kv-sand to-kv-rust z-10 flex items-center justify-center"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="w-2 h-2 rounded-full bg-kv-cream"></div>
              </motion.div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
