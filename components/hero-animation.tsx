"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const canvasElement = canvas
    const context = ctx
    let pixelRatio = window.devicePixelRatio || 1

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      pixelRatio = window.devicePixelRatio || 1
      const rect = canvasElement.getBoundingClientRect()

      canvasElement.width = rect.width * pixelRatio
      canvasElement.height = rect.height * pixelRatio

      context.scale(pixelRatio, pixelRatio)
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)
    const particleColors = ["#F3ECEA", "#A3BDD3", "#CCC4AE", "#AD4E1A", "#24547D"]

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = (Math.random() * canvasElement.width) / pixelRatio
        this.y = (Math.random() * canvasElement.height) / pixelRatio
        this.size = Math.random() * 5 + 1
        this.speedX = Math.random() * 2 - 1
        this.speedY = Math.random() * 2 - 1
        this.color = particleColors[Math.floor(Math.random() * particleColors.length)]
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvasElement.width / pixelRatio || this.x < 0) {
          this.speedX = -this.speedX
        }

        if (this.y > canvasElement.height / pixelRatio || this.y < 0) {
          this.speedY = -this.speedY
        }
      }

      draw() {
        context.fillStyle = this.color
        context.beginPath()
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        context.fill()
      }
    }

    // Create particles
    const particlesArray: Particle[] = []
    const particleCount = 50

    for (let i = 0; i < particleCount; i++) {
      particlesArray.push(new Particle())
    }

    // Animation loop
    const animate = () => {
      context.clearRect(0, 0, canvasElement.width, canvasElement.height)

      // Draw connections
      context.strokeStyle = "rgba(163, 189, 211, 0.12)"
      context.lineWidth = 1

      for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x
          const dy = particlesArray[i].y - particlesArray[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            context.beginPath()
            context.moveTo(particlesArray[i].x, particlesArray[i].y)
            context.lineTo(particlesArray[j].x, particlesArray[j].y)
            context.stroke()
          }
        }
      }

      // Update and draw particles
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update()
        particlesArray[i].draw()
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <motion.div
      className="w-full h-[400px] md:h-[500px] relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />
    </motion.div>
  )
}
