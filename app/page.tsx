"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  FileText,
  LineChart,
  Mail,
  ScanSearch,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"

type TrilogyCard = {
  id: string
  eyebrow: string
  title: string
  description: string
  stat: string
  icon: LucideIcon
  iconGlow: string
}

type FlowStep = {
  title: string
  detail: string
  icon: LucideIcon
}

type DailyQuote = {
  quote: string
  author: string
}

const trilogyCards: TrilogyCard[] = [
  {
    id: "capture",
    eyebrow: "Trilogy I",
    title: "Capture and normalize",
    description: "Upload PDF, DOCX, or camera scans. The intake layer cleans and standardizes input before parsing.",
    stat: "< 30 sec intake",
    icon: FileText,
    iconGlow: "from-violet-500/25 to-violet-700/20",
  },
  {
    id: "analyze",
    eyebrow: "Trilogy II",
    title: "Extract and classify",
    description: "Agent parsing detects skills, experience, sentiment, and role category so matching stays explainable.",
    stat: "Skill graph ready",
    icon: ScanSearch,
    iconGlow: "from-violet-500/25 to-lime-500/20",
  },
  {
    id: "rank",
    eyebrow: "Trilogy III",
    title: "Score and activate",
    description: "Ranking signals produce a clear score, then route outcomes to dashboards and recruiter outreach workflows.",
    stat: "Out of 10 scoring",
    icon: LineChart,
    iconGlow: "from-lime-400/25 to-violet-500/20",
  },
]

const flowSteps: FlowStep[] = [
  {
    title: "Secure Intake",
    detail: "Resume enters with validation and formatting checks.",
    icon: ShieldCheck,
  },
  {
    title: "Parsing Engine",
    detail: "Core signals are extracted into structured profile data.",
    icon: ScanSearch,
  },
  {
    title: "Ranking Matrix",
    detail: "Profiles are scored against live vacancies with weighted criteria.",
    icon: LineChart,
  },
  {
    title: "Shortlist Layer",
    detail: "Top candidates are routed into recruiter-ready lists.",
    icon: ClipboardList,
  },
  {
    title: "Outreach",
    detail: "Communication templates trigger with audit-friendly logs.",
    icon: Mail,
  },
]

const accessNotes = [
  "AI resume parsing with role routing, skill extraction, and sentiment signals",
  "Recruiter workspace with ranked shortlists, comparison views, and outreach actions",
  "Seeker workspace with matching clarity, score transparency, and tracked applications",
]

const dailyQuotes: DailyQuote[] = [
  {
    quote: "Great hiring is not speed alone, it is clarity plus consistency.",
    author: "JobSeek Playbook",
  },
  {
    quote: "When decisions are transparent, teams move faster with less doubt.",
    author: "JobSeek Principles",
  },
  {
    quote: "A strong workflow makes both talent and recruiters feel respected.",
    author: "Hiring Systems Note",
  },
  {
    quote: "The best recruitment stack removes friction without removing judgment.",
    author: "JobSeek Engineering",
  },
  {
    quote: "Signal wins over noise when process, scoring, and communication align.",
    author: "Talent Ops Journal",
  },
  {
    quote: "Trust grows when every score can be explained in plain language.",
    author: "JobSeek Team",
  },
]

function getDailyQuoteIndex(date: Date) {
  const localMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  return Math.abs(Math.floor(localMidnight / 86400000)) % dailyQuotes.length
}

export default function LandingPage() {
  const shouldReduceMotion = useReducedMotion()
  const [quoteIndex, setQuoteIndex] = useState(0)

  useEffect(() => {
    setQuoteIndex(getDailyQuoteIndex(new Date()))
  }, [])

  const todayQuote = dailyQuotes[quoteIndex]
  const currentYear = new Date().getFullYear()

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#121212] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_-10%,rgba(139,92,246,0.26),transparent_35%),radial-gradient(circle_at_82%_8%,rgba(191,226,100,0.14),transparent_28%),linear-gradient(180deg,rgba(18,18,18,0.3),rgba(18,18,18,0.96))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:92px_92px] opacity-[0.12]" />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/50 rounded-2xl">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-violet-600 to-lime-400 shadow-[0_16px_44px_rgba(139,92,246,0.32)]">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-heading text-lg font-semibold tracking-tight">JobSeek</p>
            <p className="text-xs uppercase tracking-[0.24em] text-violet-200/75">Smart recruitment system</p>
          </div>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-3">
          <Link href="/auth/login">
            <Button variant="ghost" className="rounded-full text-slate-200 hover:bg-white/10 hover:text-white">
              Sign in
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button className="rounded-full bg-white text-violet-950 hover:bg-violet-100">Create account</Button>
          </Link>
        </nav>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-14 pt-3 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:pb-20">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-violet-100">
              <Sparkles className="h-3.5 w-3.5" />
              New minimal experience
            </div>

            <h1 className="mt-7 max-w-4xl font-heading text-5xl font-semibold leading-[1.02] tracking-tight text-white md:text-6xl xl:text-7xl">
              Fast hiring flow.
              <span className="block bg-gradient-to-r from-violet-300 via-violet-200 to-lime-300 bg-clip-text text-transparent">Clear signal, lower friction.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              JobSeek is an AI-powered recruitment platform that connects job seekers and recruiters in one secure workflow. It handles resume intake,
              skill extraction, role classification, JD matching, shortlist ranking, and outreach with clear score logic so every hiring decision is
              faster, explainable, and easier to trust.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/auth/login">
                <Button size="lg" className="h-12 rounded-full bg-violet-500 px-7 text-white hover:bg-violet-400">
                  Enter workspace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="lg" variant="outline" className="h-12 rounded-full border-white/15 bg-white/5 px-7 text-white hover:bg-white/10">
                  Start with a new account
                </Button>
              </Link>
            </div>

            <ul className="mt-9 space-y-3" aria-label="Accessibility and UX improvements">
              {accessNotes.map((note) => (
                <li key={note} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-lime-300" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <section aria-label="Trilogy card animation" className="space-y-4">
            {trilogyCards.map((card, index) => (
              <motion.article
                key={card.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        opacity: 1,
                        y: 0,
                      }
                }
                transition={{ duration: 0.45, delay: 0.1 + index * 0.08 }}
                whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.01 }}
                className="group rounded-[1.7rem] border border-white/10 bg-[#171717]/95 p-5 shadow-[0_18px_48px_rgba(8,8,8,0.4)] transition-colors hover:border-violet-300/35"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-violet-200/80">{card.eyebrow}</p>
                    <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-white">{card.title}</h2>
                  </div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br ${card.iconGlow}`}>
                    <card.icon className="h-5 w-5 text-violet-100" />
                  </div>
                </div>

                <p className="mt-3 text-sm leading-7 text-slate-300">{card.description}</p>

                <motion.div
                  animate={shouldReduceMotion ? undefined : { opacity: [0.65, 1, 0.65] }}
                  transition={{ duration: 3.2 + index, repeat: Infinity, ease: "easeInOut" }}
                  className="mt-4 inline-flex rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-100"
                >
                  {card.stat}
                </motion.div>
              </motion.article>
            ))}
          </section>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="rounded-[2rem] border border-white/10 bg-[#171717]/90 p-6 shadow-[0_24px_80px_rgba(8,8,8,0.45)] sm:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-violet-200/70">Flow chart</p>
                <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">One continuous pipeline</h2>
              </div>
              <span className="rounded-full border border-lime-300/40 bg-lime-300/15 px-3 py-1 text-xs font-medium text-lime-100">
                Structured for quick scanning
              </span>
            </div>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              The flow below shows exactly how data moves from upload to outreach. The layout is compact, readable, and designed for faster
              understanding on both mobile and desktop.
            </p>

            <div className="relative mt-10">
              <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-violet-400/40 to-lime-300/40 md:hidden" />
              <div className="absolute left-[8%] right-[8%] top-11 hidden h-px bg-gradient-to-r from-violet-400/35 via-violet-300/25 to-lime-300/40 md:block" />

              <ol className="relative grid gap-4 md:grid-cols-5 md:gap-3" aria-label="JobSeek workflow">
                {flowSteps.map((step, index) => (
                  <motion.li
                    key={step.title}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                    whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                    className="relative pl-12 md:pl-0"
                  >
                    <article className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-violet-300/35">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-100">
                          <step.icon className="h-4.5 w-4.5" />
                        </div>
                        <span className="text-xs font-medium text-slate-500">0{index + 1}</span>
                      </div>
                      <h3 className="mt-3 font-medium text-white">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{step.detail}</p>
                    </article>
                  </motion.li>
                ))}
              </ol>
            </div>

            <div className="mt-8 space-y-4">
              <article className="rounded-2xl border border-violet-300/20 bg-gradient-to-r from-violet-500/10 to-lime-300/10 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-violet-200/80">Quote of the day</p>
                <blockquote className="mt-3 font-heading text-2xl leading-snug text-white sm:text-3xl">
                  “{todayQuote.quote}”
                </blockquote>
                <p className="mt-3 text-sm font-medium text-lime-200">- {todayQuote.author}</p>
              </article>

              <article className="rounded-2xl border border-slate-300/25 bg-slate-100/95 px-5 py-4 text-slate-700">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">JobSeek</p>
                    <p className="mt-1 text-xs text-slate-500">© {currentYear} JobSeek Recruitment Workspace. All rights reserved.</p>
                  </div>
                  <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600" aria-label="Policy links">
                    <li>Privacy Policy</li>
                    <li>Terms of Service</li>
                    <li>Cookie Settings</li>
                    <li>Global Reach</li>
                  </ul>
                </div>
              </article>
            </div>

          </motion.div>
        </section>
      </main>
    </div>
  )
}
