"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function MeshGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)

    const colors = [
      { r: 125, g: 211, b: 252 },
      { r: 139, g: 92, b: 246 },
      { r: 167, g: 139, b: 250 },
      { r: 191, g: 226, b: 100 },
      { r: 216, g: 203, b: 255 },
    ]

    interface Blob {
      x: number
      y: number
      radius: number
      color: { r: number; g: number; b: number }
      vx: number
      vy: number
      phase: number
    }

    const blobs: Blob[] = colors.map((color, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 300 + Math.random() * 200,
      color,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      phase: i * (Math.PI / 2.5),
    }))

    const animate = () => {
      time += 0.005
      ctx.fillStyle = "rgba(9, 9, 11, 1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      blobs.forEach((blob) => {
        blob.x += Math.sin(time + blob.phase) * 1.5 + blob.vx
        blob.y += Math.cos(time + blob.phase) * 1.5 + blob.vy

        if (blob.x < -blob.radius) blob.x = canvas.width + blob.radius
        if (blob.x > canvas.width + blob.radius) blob.x = -blob.radius
        if (blob.y < -blob.radius) blob.y = canvas.height + blob.radius
        if (blob.y > canvas.height + blob.radius) blob.y = -blob.radius

        const gradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          blob.radius
        )
        gradient.addColorStop(0, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, 0.4)`)
        gradient.addColorStop(0.5, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, 0.15)`)
        gradient.addColorStop(1, `rgba(${blob.color.r}, ${blob.color.g}, ${blob.color.b}, 0)`)

        ctx.globalCompositeOperation = "lighter"
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.globalCompositeOperation = "source-over"
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="absolute inset-0 -z-10"
      style={{ filter: "blur(60px)" }}
    />
  )
}
