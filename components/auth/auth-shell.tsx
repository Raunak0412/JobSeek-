"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Briefcase } from "lucide-react"
import { MeshGradient } from "@/components/mesh-gradient"

interface AuthShellProps {
  title: string
  description: string
  backHref: string
  backLabel: string
  eyebrow?: string
  children: ReactNode
}

export function AuthShell({
  title,
  description,
  backHref,
  backLabel,
  eyebrow = "JobSeek Recruitment System",
  children,
}: AuthShellProps) {
  return (
    <div className="bg-brand-mesh relative min-h-screen overflow-hidden px-4 py-8 text-white sm:px-6 lg:px-8">
      <MeshGradient />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.16),transparent_42%),radial-gradient(circle_at_bottom,rgba(191,226,100,0.1),transparent_36%),linear-gradient(180deg,rgba(8,12,20,0.18),rgba(8,12,20,0.88))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:90px_90px] opacity-[0.12]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col">
        <div className="flex items-center justify-between">
          <Link
            href={backHref}
            className="glass-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-slate-200 transition hover:border-violet-500/40 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>

          <div className="glass-pill hidden items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-slate-300 sm:inline-flex">
            <Briefcase className="h-3.5 w-3.5 text-violet-400" />
            JobSeek
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mx-auto my-auto w-full max-w-xl"
        >
          <div className="glass-panel glass-outline rounded-[2rem] p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-violet-600 to-lime-400 shadow-[0_18px_44px_rgba(139,92,246,0.3)]">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-heading text-xl font-semibold tracking-tight text-white">JobSeek</p>
                <p className="text-xs uppercase tracking-[0.2em] text-violet-200/80">{eyebrow}</p>
              </div>
            </div>

            <h1 className="text-display mt-8 font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">{description}</p>
            <div className="mt-8">{children}</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
