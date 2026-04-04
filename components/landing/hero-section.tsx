"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MeshGradient } from "@/components/mesh-gradient"
import { ArrowRight, Upload, Brain, Sparkles } from "lucide-react"

const floatingCards = [
  { icon: Upload, label: "Upload Resume", delay: 0.2, position: "left-[5%] top-[30%]" },
  { icon: Brain, label: "AI Analysis", delay: 0.4, position: "right-[5%] top-[25%]" },
  { icon: Sparkles, label: "Smart Matching", delay: 0.6, position: "left-[10%] bottom-[20%]" },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-zinc-950">
      <MeshGradient />
      
      {/* Noise overlay */}
      <div 
        className="absolute inset-0 -z-5 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating cards */}
      {floatingCards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: card.delay, duration: 0.8 }}
          className={`absolute hidden lg:flex ${card.position}`}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-lime-400/20">
              <card.icon className="h-5 w-5 text-violet-500" />
            </div>
            <span className="text-sm font-medium text-white">{card.label}</span>
          </motion.div>
        </motion.div>
      ))}

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2"
          >
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span className="text-sm font-medium text-violet-300">AI-Powered Recruitment Platform</span>
          </motion.div>

          {/* Main heading */}
          <h1 className="mx-auto max-w-4xl text-balance text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Find Your{" "}
            <span className="bg-gradient-to-r from-violet-400 via-violet-300 to-lime-300 bg-clip-text text-transparent">
              Dream Career
            </span>{" "}
            with AI Precision
          </h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-zinc-400 sm:text-xl"
          >
            Upload your resume and let our intelligent matching system connect you with the perfect opportunities. 
            For recruiters, discover top talent ranked by AI-powered analysis.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/auth/register?type=seeker">
              <Button
                size="lg"
                className="group h-12 gap-2 bg-gradient-to-r from-violet-500 to-lime-500 px-8 text-base font-semibold text-white transition-all hover:from-violet-400 hover:to-lime-400 hover:shadow-lg hover:shadow-violet-500/25"
              >
                I'm a Job Seeker
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/auth/register?type=recruiter">
              <Button
                size="lg"
                variant="outline"
                className="h-12 gap-2 border-white/20 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
              >
                I'm a Recruiter
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {[
              { value: "50K+", label: "Active Jobs" },
              { value: "100K+", label: "Job Seekers" },
              { value: "5K+", label: "Companies" },
              { value: "95%", label: "Match Rate" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-white sm:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-zinc-500"
          >
            <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
            <div className="h-10 w-6 rounded-full border-2 border-zinc-600 p-1">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-2 w-2 rounded-full bg-zinc-500"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
