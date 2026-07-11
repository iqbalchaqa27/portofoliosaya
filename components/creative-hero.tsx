"use client"

import { useEffect, useRef } from "react"

interface CreativeHeroProps {
  portraitImage?: string
  portraitAlt?: string
}

export function CreativeHero({ portraitImage, portraitAlt = "" }: CreativeHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const canvasElement = canvas
    const context = ctx

    let devicePixelRatio: number

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      devicePixelRatio = window.devicePixelRatio || 1
      const rect = canvasElement.getBoundingClientRect()

      canvasElement.width = rect.width * devicePixelRatio
      canvasElement.height = rect.height * devicePixelRatio

      context.scale(devicePixelRatio, devicePixelRatio)
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Mouse position
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0
    const particleColors = ["#F3ECEA", "#A3BDD3", "#CCC4AE", "#AD4E1A", "#24547D"]

    window.addEventListener("mousemove", (e) => {
      const rect = canvasElement.getBoundingClientRect()
      targetX = e.clientX - rect.left
      targetY = e.clientY - rect.top
    })

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      baseX: number
      baseY: number
      density: number
      color: string
      distance: number

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.baseX = x
        this.baseY = y
        this.size = Math.random() * 5 + 2
        this.density = Math.random() * 30 + 1
        this.distance = 0

        this.color = particleColors[Math.floor(Math.random() * particleColors.length)]
      }

      update() {
        // Calculate distance between mouse and particle
        const dx = mouseX - this.x
        const dy = mouseY - this.y
        this.distance = Math.sqrt(dx * dx + dy * dy)

        const forceDirectionX = dx / this.distance
        const forceDirectionY = dy / this.distance

        const maxDistance = 100
        const force = (maxDistance - this.distance) / maxDistance

        if (this.distance < maxDistance) {
          const directionX = forceDirectionX * force * this.density
          const directionY = forceDirectionY * force * this.density

          this.x -= directionX
          this.y -= directionY
        } else {
          if (this.x !== this.baseX) {
            const dx = this.x - this.baseX
            this.x -= dx / 10
          }
          if (this.y !== this.baseY) {
            const dy = this.y - this.baseY
            this.y -= dy / 10
          }
        }
      }

      draw() {
        context.fillStyle = this.color
        context.beginPath()
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        context.closePath()
        context.fill()
      }
    }

    // Create particle grid
    const particlesArray: Particle[] = []
    const particleCount = 1000
    const gridSize = 30

    function init() {
      particlesArray.length = 0

      const canvasWidth = canvasElement.width / devicePixelRatio
      const canvasHeight = canvasElement.height / devicePixelRatio

      const numX = Math.floor(canvasWidth / gridSize)
      const numY = Math.floor(canvasHeight / gridSize)

      for (let y = 0; y < numY; y++) {
        for (let x = 0; x < numX; x++) {
          const posX = x * gridSize + gridSize / 2
          const posY = y * gridSize + gridSize / 2
          particlesArray.push(new Particle(posX, posY))
        }
      }
    }

    init()

    // Animation loop
    const animate = () => {
      context.clearRect(0, 0, canvasElement.width, canvasElement.height)

      // Smooth mouse following
      mouseX += (targetX - mouseX) * 0.1
      mouseY += (targetY - mouseY) * 0.1

      // Draw connections
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update()
        particlesArray[i].draw()

        // Draw connections
        for (let j = i; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x
          const dy = particlesArray[i].y - particlesArray[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 30) {
            context.beginPath()
            context.strokeStyle = `rgba(163, 189, 211, ${0.2 - distance / 150})`
            context.lineWidth = 0.5
            context.moveTo(particlesArray[i].x, particlesArray[i].y)
            context.lineTo(particlesArray[j].x, particlesArray[j].y)
            context.stroke()
          }
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    // Handle window resize
    window.addEventListener("resize", init)

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      window.removeEventListener("resize", init)
    }
  }, [])

  return (
    <div
      className="relative h-[440px] w-full overflow-visible md:h-[560px]"
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full" style={{ display: "block" }} />
      {portraitImage && (
        <div className="pointer-events-none absolute bottom-0 left-1/2 z-10 flex h-full max-h-[560px] w-[min(72vw,390px)] -translate-x-1/2 items-end justify-center md:w-[min(34vw,430px)]">
          <img
            src={portraitImage}
            alt={portraitAlt}
            className="h-full w-full object-contain drop-shadow-[0_28px_45px_rgba(25,31,69,0.65)]"
          />
        </div>
      )}
    </div>
  )
}
