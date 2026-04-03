"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Briefcase, Sparkles } from "lucide-react"
import { MeshGradient } from "@/components/mesh-gradient"
import { cn } from "@/lib/utils"

interface AuthShellProps {
  title: string
  description: string
  backHref: string
  backLabel: string
  eyebrow?: string
  asideTitle?: string
  asideBody?: string
  children: ReactNode
}

export function AuthShell({
  title,
  description,
  backHref,
  backLabel,
  eyebrow = "JobSeek Recruitment System",
  asideTitle = "AI-assisted hiring, end to end",
  asideBody = "From resume routing and skill extraction to rankings, recruiter workflows, and formal outreach, every step stays connected.",
  children,
}: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#150707] px-4 py-8 text-white sm:px-6 lg:px-8">
      <MeshGradient />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(248,113,113,0.26),transparent_35%),linear-gradient(180deg,rgba(21,7,7,0.35),rgba(21,7,7,0.92))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:90px_90px] opacity-[0.12]" />

      <Link
        href={backHref}
        className="relative z-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-red-400/40 hover:bg-white/10 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <div className="relative z-10 mx-auto mt-8 grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl lg:block"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-red-200">
            <Sparkles className="h-3.5 w-3.5" />
            {eyebrow}
          </div>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-400 via-rose-500 to-orange-400 shadow-[0_18px_50px_rgba(248,113,113,0.35)]">
              <Briefcase className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="font-heading text-3xl font-semibold tracking-tight">JobSeek</p>
              <p className="text-sm text-red-200/80">Recruitment intelligence workspace</p>
            </div>
          </div>
          <h2 className="mt-10 font-heading text-4xl font-semibold leading-tight tracking-tight text-white">
            {asideTitle}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">{asideBody}</p>
          <div className="mt-8 grid gap-3">
            {[
              "LangChain orchestration for routing and ranking",
              "OpenRouter-ready AI workflows and scoring agents",
              "FastAPI backend contract for auth, jobs, and outreach",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-sm text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className={cn("w-full")}
        >
          <div className="rounded-[2rem] border border-white/10 bg-[#1b0b0b]/85 p-6 shadow-[0_32px_120px_rgba(11,2,2,0.55)] backdrop-blur-2xl sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-300">{eyebrow}</p>
            <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">{description}</p>
            <div className="mt-8">{children}</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
