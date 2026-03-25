"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Briefcase, Camera, Mail, Radar, ScanSearch, Sparkles, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { platformFeatures, platformStats, recruiterJobs, routerStages } from "@/lib/mock-data"

const previewCards = [
  {
    title: "Resume intake",
    detail: "Upload from file picker or camera, then let the agent router classify the resume automatically.",
    icon: Camera,
  },
  {
    title: "Smart ranking",
    detail: "Generate JD-aware scores out of 10 with ranked candidates, skill gaps, and sentiment signals.",
    icon: Trophy,
  },
  {
    title: "Recruiter outreach",
    detail: "Shortlist the top candidates per opening and send formal mail from the dashboard.",
    icon: Mail,
  },
]

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_24%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.12),transparent_18%),linear-gradient(180deg,rgba(7,17,31,0.2),rgba(7,17,31,0.95))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:88px_88px] opacity-[0.12]" />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 shadow-[0_18px_50px_rgba(14,165,233,0.35)]">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-heading text-lg font-semibold tracking-tight">SmartRecruit</p>
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/75">Smart recruitment system</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login">
            <Button variant="ghost" className="rounded-full text-slate-300 hover:bg-white/10 hover:text-white">
              Sign in
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button className="rounded-full bg-white text-slate-950 hover:bg-cyan-50">Launch workspace</Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:pb-28 lg:pt-16">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              LangChain + OpenRouter + FastAPI
            </div>
            <h1 className="mt-8 max-w-4xl font-heading text-5xl font-semibold leading-[1.02] tracking-tight text-white md:text-6xl xl:text-7xl">
              Frontend-first AI hiring that feels like a real product, not a demo.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Job seekers upload resumes through file picker or camera. The app extracts skills, routes each resume into the right category, scores candidates against live vacancies, and helps recruiters send formal shortlist emails in one flow.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/auth/register?role=recruiter">
                <Button size="lg" className="rounded-full bg-cyan-400 px-7 text-slate-950 hover:bg-cyan-300">
                  Recruiter dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/register?role=seeker">
                <Button size="lg" variant="outline" className="rounded-full border-white/15 bg-white/5 px-7 text-white hover:bg-white/10">
                  Job seeker flow
                </Button>
              </Link>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {platformStats.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <p className="font-heading text-3xl font-semibold tracking-tight text-white">{stat.value}</p>
                  <p className="mt-2 text-sm font-medium text-cyan-100">{stat.label}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{stat.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-[0_25px_120px_rgba(2,6,23,0.45)] backdrop-blur-2xl"
          >
            <div className="rounded-[1.75rem] border border-white/10 bg-[#081321] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-cyan-300/70">Pipeline preview</p>
                  <h2 className="mt-2 font-heading text-2xl font-semibold">Recruitment command center</h2>
                </div>
                <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100">
                  Live AI signals
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {previewCards.map((card) => (
                  <div key={card.title} className="rounded-3xl border border-white/10 bg-slate-950/30 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 text-cyan-200">
                        <card.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{card.title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-400">{card.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-3">
                {recruiterJobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-white">{job.title}</p>
                        <p className="mt-1 text-sm text-slate-400">
                          {job.company} · {job.location} · {job.vacancies} openings
                        </p>
                      </div>
                      <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                        {job.applicants} applicants
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-14">
          <div className="grid gap-5 lg:grid-cols-4">
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ delay: index * 0.06 }}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <div className={`h-2 w-20 rounded-full bg-gradient-to-r ${feature.accent}`} />
                <h3 className="mt-6 font-heading text-2xl font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-300">
                <Radar className="h-3.5 w-3.5" />
                Project flow
              </div>
              <h2 className="mt-6 font-heading text-4xl font-semibold tracking-tight">Exactly the workflow you described.</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
                The product gives seekers a polished upload and application path, while recruiters manage vacancies, rankings, routed resumes, and formal mail from one dashboard.
              </p>
            </div>
            <div className="space-y-4">
              {routerStages.map((stage, index) => (
                <motion.div
                  key={stage.title}
                  initial={{ opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.06 }}
                  className="rounded-[1.75rem] border border-white/10 bg-[#081321]/90 p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 text-cyan-200">
                      <ScanSearch className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-heading text-xl font-semibold tracking-tight text-white">{stage.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{stage.detail}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
