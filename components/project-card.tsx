"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Github } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  image: string
  demoUrl: string
  repoUrl: string
}

export function ProjectCard({ title, description, tags, image, demoUrl, repoUrl }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const demoHref = getExternalHref(demoUrl)
  const repoHref = getExternalHref(repoUrl)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group"
    >
      <div
        className="relative h-full overflow-hidden rounded-xl bg-kv-navy/55 backdrop-blur-sm border border-kv-sky/20 transition-all duration-300 group-hover:border-kv-sand/60"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-kv-sky/15 to-kv-rust/15 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

        <div className="relative h-full flex flex-col">
          <div className="relative overflow-hidden h-48">
            <div className="absolute inset-0 bg-gradient-to-b from-kv-sky/25 to-kv-rust/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
            <img
              src={image || "/placeholder.svg"}
              alt={title}
              className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? "scale-110" : "scale-100"}`}
            />
          </div>

          <div className="p-6 flex-grow">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-kv-sand mb-4">{description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-kv-blue/50 hover:bg-kv-blue text-kv-cream">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex justify-between mt-auto pt-4 border-t border-kv-sky/20">
              {repoHref ? (
                <Button variant="ghost" size="sm" className="text-kv-sand hover:text-kv-cream hover:bg-kv-blue/50" asChild>
                  <Link href={repoHref} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    Code
                  </Link>
                </Button>
              ) : (
                <span />
              )}
              {demoHref && (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-kv-cream to-kv-sky hover:from-kv-sand hover:to-kv-sky text-kv-navy border-0"
                  asChild
                >
                  <Link href={demoHref} target="_blank" rel="noopener noreferrer">
                    Live Demo
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="absolute top-3 right-3 z-20">
            <div
              className={`w-3 h-3 rounded-full ${isHovered ? "bg-kv-sky" : "bg-kv-sand/60"} transition-colors duration-300`}
            ></div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function getExternalHref(value: string) {
  const href = value.trim()

  if (!href) {
    return ""
  }

  if (/^(https?:|mailto:|tel:|#|\/)/i.test(href)) {
    return href
  }

  return `https://${href}`
}
