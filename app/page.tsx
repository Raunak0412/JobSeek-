"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  ClipboardList,
  LineChart,
  Mail,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react"
import { Button } from "@/components/ui/button"

type InsightCard = {
  title: string
  detail: string
  value: string
  icon: LucideIcon
}

type FlowStep = {
  id: string
  title: string
  detail: string
  icon: LucideIcon
}

type RoleCard = {
  title: string
  detail: string
  href: string
  icon: LucideIcon
  bullets: string[]
}

const insightCards: InsightCard[] = [
  {
    title: "Role-safe access",
    detail: "One email stays mapped to one workspace role, so recruiter and seeker data never blur together.",
    value: "Locked",
    icon: ShieldCheck,
  },
  {
    title: "Transparent scoring",
    detail: "Match signals, skill extraction, and shortlist actions stay visible from intake to outreach.",
    value: "Visible",
    icon: LineChart,
  },
  {
    title: "Fast outreach",
    detail: "Once a candidate is shortlisted, recruiter communication moves forward from the same workflow.",
    value: "Ready",
    icon: Mail,
  },
]

const flowSteps: FlowStep[] = [
  {
    id: "intake",
    title: "Secure intake",
    detail: "A resume or profile enters the system with validation, formatting cleanup, and duplicate awareness.",
    icon: ShieldCheck,
  },
  {
    id: "parse",
    title: "Signal extraction",
    detail: "Skills, experience, and role context are parsed into structured fields recruiters can actually review.",
    icon: ScanSearch,
  },
  {
    id: "score",
    title: "Match and rank",
    detail: "The platform scores profiles against job intent with explainable signals instead of vague black-box outputs.",
    icon: LineChart,
  },
  {
    id: "shortlist",
    title: "Shortlist decisions",
    detail: "Candidates move into recruiter-ready lists with score context, missing skills, and fit notes attached.",
    icon: ClipboardList,
  },
  {
    id: "outreach",
    title: "Tracked outreach",
    detail: "Communication happens from the same workspace so status changes, mail activity, and follow-ups stay aligned.",
    icon: Mail,
  },
]

const roleCards: RoleCard[] = [
  {
    title: "For seekers",
    detail: "Upload once, understand your fit, and track every move clearly.",
    href: "/auth/register?type=seeker",
    icon: UserRound,
    bullets: [
      "Resume upload with extracted skills and role clarity",
      "Matched jobs with visible scores and tracked applications",
      "A profile that stays separate from recruiter-side accounts",
    ],
  },
  {
    title: "For recruiters",
    detail: "Post roles, review ranked talent, and move to outreach without leaving the flow.",
    href: "/auth/register?type=recruiter",
    icon: Building2,
    bullets: [
      "Vacancy posting and candidate ranking in one workspace",
      "Shortlist-ready comparisons with cleaner decision context",
      "Recruiter accounts that stay protected from seeker data",
    ],
  },
]

const footerLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Cookie Settings", href: "/cookie-settings" },
  { label: "Global Reach", href: "/global-reach" },
]

export default function LandingPage() {
  const shouldReduceMotion = useReducedMotion()
  const currentYear = new Date().getFullYear()

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/50">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-violet-600 to-lime-400 shadow-[0_16px_44px_rgba(139,92,246,0.32)]">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-heading text-lg font-semibold tracking-tight">JobSeek</p>
            <p className="text-xs uppercase tracking-[0.24em] text-violet-200/75">Glass recruitment workspace</p>
          </div>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-3">
          <Link href="/auth/login?type=seeker">
            <Button variant="ghost" className="glass-pill rounded-full px-5 text-slate-100 hover:bg-white/10 hover:text-white">
              Sign in
            </Button>
          </Link>
          <Link href="/auth/register?type=recruiter">
            <Button className="rounded-full bg-white text-slate-950 hover:bg-violet-100">Create account</Button>
          </Link>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-16 lg:px-10 lg:pb-24">
        <section className="grid gap-8 pt-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-violet-100">
              <Sparkles className="h-3.5 w-3.5" />
              Better role-safe onboarding
            </div>

            <h1 className="text-display mt-8 max-w-4xl font-heading text-5xl font-semibold leading-[0.98] text-white md:text-6xl xl:text-7xl">
              A cleaner hiring flow for seekers and recruiters.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              JobSeek now centers the experience around clear role separation, explainable ranking, and a calmer glassmorphism interface that feels fast
              without feeling crowded.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/auth/register?type=seeker">
                <Button size="lg" className="h-12 rounded-full bg-violet-500 px-7 text-white hover:bg-violet-400">
                  Join as seeker
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/register?type=recruiter">
                <Button size="lg" variant="outline" className="glass-pill h-12 rounded-full px-7 text-white hover:bg-white/10">
                  Join as recruiter
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {insightCards.map((item) => (
                <div key={item.title} className="glass-panel rounded-[1.5rem] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-100">
                      <item.icon className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-200">{item.value}</span>
                  </div>
                  <h2 className="mt-4 font-heading text-lg font-semibold text-white">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.section
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="glass-panel-strong glass-outline rounded-[2rem] p-6"
          >
            <div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-violet-200/72">Live workspace preview</p>
                <h2 className="mt-2 font-heading text-2xl font-semibold text-white">One platform, two protected roles</h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="glass-panel rounded-[1.6rem] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white">Seeker onboarding</p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">Resume upload, parsed skills, and job matches stay on the seeker side only.</p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/12 text-cyan-200">
                    <UserRound className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-[1.6rem] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white">Recruiter operations</p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">Posting roles, ranking candidates, and outreach actions stay in the recruiter workspace.</p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/14 text-violet-100">
                    <Building2 className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-[1.6rem] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">What this gives you</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-medium text-white">Clear sign in</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">Users choose seeker or recruiter before entering the workspace.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-medium text-white">Role-safe accounts</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">One email stays linked to one role, so account data stays clean.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-medium text-white">Faster next steps</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">After login, each user lands directly in the dashboard built for that role.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="glass-panel rounded-[2rem] p-6"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-violet-200/70">Vertical flow chart</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-white sm:text-4xl">The whole pipeline in one readable stack</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              The landing page now shows the product in a vertical sequence so the story is easier to follow on desktop and mobile.
            </p>
          </motion.div>

          <div className="glass-panel-strong glass-outline rounded-[2rem] p-6">
            <ol className="relative space-y-5 before:absolute before:left-5 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-gradient-to-b before:from-cyan-300/45 before:via-violet-300/30 before:to-lime-300/45">
              {flowSteps.map((step, index) => (
                <motion.li
                  key={step.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
                  whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  className="relative pl-16"
                >
                  <span className="absolute left-0 top-1.5 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-slate-950/60 text-violet-100 shadow-[0_12px_32px_rgba(4,8,16,0.35)]">
                    <step.icon className="h-4.5 w-4.5" />
                  </span>

                  <article className="glass-panel rounded-[1.6rem] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-heading text-xl font-semibold text-white">{step.title}</h3>
                      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">0{index + 1}</span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{step.detail}</p>
                  </article>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mt-14 grid gap-5 lg:grid-cols-[1fr_1fr]">
          {roleCards.map((card, index) => (
            <motion.article
              key={card.title}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
              className="glass-panel glass-outline rounded-[2rem] p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-violet-200/72">Workspace lane</p>
                  <h2 className="mt-2 font-heading text-2xl font-semibold text-white">{card.title}</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/14 text-violet-100">
                  <card.icon className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-300">{card.detail}</p>
              <ul className="mt-5 space-y-3">
                {card.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3 text-sm text-slate-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-lime-300" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <Link href={card.href} className="mt-6 inline-flex">
                <Button variant="outline" className="glass-pill rounded-full px-5 text-white hover:bg-white/10">
                  Open {card.title.toLowerCase()}
                </Button>
              </Link>
            </motion.article>
          ))}
        </section>

        <motion.footer
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
          className="glass-panel mt-14 rounded-[2rem] px-6 py-5"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-heading text-xl font-semibold text-white">JobSeek</p>
              <p className="mt-1 text-sm text-slate-400">{currentYear} JobSeek. Cleaner flows for seekers and recruiters.</p>
            </div>

            <ul className="flex flex-wrap gap-2" aria-label="Footer links">
              {footerLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="glass-pill inline-flex rounded-full px-3 py-1.5 text-sm text-slate-200 transition hover:border-violet-300/40 hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.footer>
      </main>
    </div>
  )
}
