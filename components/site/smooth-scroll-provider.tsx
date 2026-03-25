"use client"

import { useEffect } from "react"

export function SmoothScrollProvider() {
  useEffect(() => {
    let frame = 0
    let destroyed = false
    let cleanup = () => {}

    import("lenis")
      .then(({ default: Lenis }) => {
        if (destroyed) return

        const lenis = new Lenis({
          duration: 1.05,
          smoothWheel: true,
          touchMultiplier: 1.1,
        })

        const loop = (time: number) => {
          lenis.raf(time)
          frame = window.requestAnimationFrame(loop)
        }

        frame = window.requestAnimationFrame(loop)
        cleanup = () => {
          window.cancelAnimationFrame(frame)
          lenis.destroy()
        }
      })
      .catch(() => {
        cleanup = () => {}
      })

    return () => {
      destroyed = true
      cleanup()
    }
  }, [])

  return null
}
