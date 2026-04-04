"use client"

import { useEffect } from "react"
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"

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

export function SiteChrome() {
  const shouldReduceMotion = useReducedMotion()
  const { scrollY, scrollYProgress } = useScroll()
  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 30,
    mass: 0.22,
  })

  const orbOneY = useTransform(scrollY, [0, 2400], [0, shouldReduceMotion ? 0 : 180])
  const orbTwoY = useTransform(scrollY, [0, 2400], [0, shouldReduceMotion ? 0 : -140])
  const orbThreeY = useTransform(scrollY, [0, 2400], [0, shouldReduceMotion ? 0 : 110])

  return (
    <>
      <motion.div
        style={{ scaleX: progressScaleX }}
        className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-px origin-left bg-gradient-to-r from-cyan-300 via-violet-300 to-lime-300 shadow-[0_0_30px_rgba(167,139,250,0.55)]"
      />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,10,18,0.06),rgba(5,10,18,0.34)_72%,rgba(5,10,18,0.68))]" />

        <motion.div
          style={{ y: orbOneY }}
          className="absolute -left-28 top-[-8%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.16),rgba(125,211,252,0.06)_42%,transparent_72%)] blur-3xl"
        />
        <motion.div
          style={{ y: orbTwoY }}
          className="absolute right-[-10%] top-[6%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.18),rgba(139,92,246,0.06)_40%,transparent_74%)] blur-3xl"
        />
        <motion.div
          style={{ y: orbThreeY }}
          className="absolute bottom-[-14%] left-[22%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(191,226,100,0.12),rgba(191,226,100,0.05)_45%,transparent_74%)] blur-3xl"
        />
      </div>
    </>
  )
}
