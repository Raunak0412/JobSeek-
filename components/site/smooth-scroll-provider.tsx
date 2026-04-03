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
          duration: 0.95,
          smoothWheel: true,
          wheelMultiplier: 0.9,
          touchMultiplier: 1.15,
          syncTouch: true,
          prevent: (node) => {
            const target = node as Node | null
            const element = target instanceof Element ? target : target?.parentElement ?? null
            return !!element?.closest(
              "[data-lenis-prevent], [data-slot='scroll-area'], [data-slot='scroll-area-viewport'], [data-radix-scroll-area-viewport]"
            )
          },
        })
        document.documentElement.classList.add("js-smooth-scroll")

        const loop = (time: number) => {
          lenis.raf(time)
          frame = window.requestAnimationFrame(loop)
        }

        frame = window.requestAnimationFrame(loop)
        cleanup = () => {
          window.cancelAnimationFrame(frame)
          lenis.destroy()
          document.documentElement.classList.remove("js-smooth-scroll")
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
