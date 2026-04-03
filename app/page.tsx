"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  ClipboardList,
  FileText,
  KeyRound,
  LineChart,
  Mail,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const highlights = [
  "OTP-protected access and email verification",
  "Recruiter and job seeker workspaces",
  "Resume routing, JD scoring, and ranked shortlists",
  "Formal mail templates for top candidates",
  "Transparent ranking signals and confidence scores",
  "Seeker updates on every stage of the flow",
]

const systemFlow = [
  {
    title: "Secure resume intake",
    description: "Camera capture or document upload is normalized, checked, and queued for extraction.",
    icon: FileText,
  },
  {
    title: "AI routing and parsing",
    description: "Agents classify profiles, extract skills, and build a structured summary in seconds.",
    icon: ScanSearch,
  },
  {
    title: "Match scoring",
    description: "Job descriptions and resume signals produce a score out of 10 with clear reasoning.",
    icon: LineChart,
  },
  {
    title: "Recruiter-ready outcomes",
    description: "Ranked candidates, shortlist workflows, and outreach templates close the loop.",
    icon: Trophy,
  },
]

const seekerFlow = [
  { title: "1. Upload resume", detail: "Drop a PDF, DOCX, or capture a photo to start the pipeline." },
  { title: "2. AI extraction", detail: "Skills, experience, and tone are parsed into a recruiter-ready profile." },
  { title: "3. Matched roles", detail: "Live openings are ranked and sorted by fit and readiness." },
  { title: "4. Apply and track", detail: "Send applications and monitor status updates in one view." },
]

const recruiterFlow = [
  { title: "1. Post vacancy", detail: "Add a job description and the system starts matching automatically." },
  { title: "2. Routed resumes", detail: "Applicants are grouped by category so reviews stay focused." },
  { title: "3. Ranked shortlist", detail: "Scores highlight the strongest candidates with clear explanations." },
  { title: "4. Outreach ready", detail: "Send polished interview invites and offer templates fast." },
]

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#150707] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(248,113,113,0.26),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(251,146,60,0.18),transparent_25%),linear-gradient(180deg,rgba(21,7,7,0.2),rgba(21,7,7,0.95))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:88px_88px] opacity-[0.12]" />

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-red-400 via-rose-500 to-orange-400 shadow-[0_18px_48px_rgba(248,113,113,0.35)]">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-heading text-lg font-semibold tracking-tight">JobSeek</p>
            <p className="text-xs uppercase tracking-[0.25em] text-red-200/75">Smart recruitment system</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login">
            <Button variant="ghost" className="rounded-full text-slate-200 hover:bg-white/10 hover:text-white">
              Sign in
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button className="rounded-full bg-white text-red-900 hover:bg-red-50">Create account</Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:pb-24">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-red-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure access only
            </div>
            <h1 className="mt-8 max-w-4xl font-heading text-5xl font-semibold leading-[1.02] tracking-tight text-white md:text-6xl xl:text-7xl">
              Sign in to the JobSeek workspace.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              This front page is now focused on authentication. Use your credentials to access the recruiter dashboard or the job seeker portal with routed resumes, ranked candidates, and formal outreach tools.
            </p>
            <p className="mt-4 text-sm text-red-200/80 font-fun">Serious hiring. Slightly playful UI.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/auth/login">
                <Button size="lg" className="rounded-full bg-red-400 px-7 text-red-950 hover:bg-red-300">
                  Sign in now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="lg" variant="outline" className="rounded-full border-white/15 bg-white/5 px-7 text-white hover:bg-white/10">
                  Create a new account
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                  <BadgeCheck className="mt-0.5 h-4 w-4 text-red-200" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_25px_120px_rgba(11,2,2,0.45)] backdrop-blur-2xl"
          >
            <div className="rounded-[1.75rem] border border-white/10 bg-[#1b0b0b] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.26em] text-red-200/70">Access control</p>
                  <h2 className="mt-2 font-heading text-2xl font-semibold">Sign in required</h2>
                </div>
                <div className="rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1 text-xs font-medium text-red-100">OTP verified</div>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  { title: "Recruiter dashboard", body: "Post vacancies, rank candidates, and send shortlist mail." },
                  { title: "Job seeker portal", body: "Upload resumes, get routed, and apply to matched jobs." },
                  { title: "Secure access", body: "OTP verification and reset flows are live in the UI." },
                ].map((card) => (
                  <div key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="font-medium text-white">{card.title}</p>
                    <p className="mt-2 text-sm text-slate-300">{card.body}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-red-400/15 bg-red-400/10 p-4 text-sm text-red-100">
                <div className="flex items-start gap-3">
                  <KeyRound className="mt-0.5 h-4 w-4" />
                  <p>Use the demo credentials on the sign-in page if you want to explore both roles instantly.</p>
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white">Quick sign-in preview</p>
                  <span className="text-xs text-red-200/70">Mock UI</span>
                </div>
                <div className="mt-4 space-y-3">
                  <input
                    disabled
                    aria-label="Email"
                    placeholder="email@company.com"
                    className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-slate-200 placeholder:text-slate-500"
                  />
                  <input
                    disabled
                    aria-label="Password"
                    placeholder="********"
                    className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-slate-200 placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    className="h-11 w-full rounded-2xl bg-red-400 text-sm font-semibold text-red-950 shadow-[0_14px_36px_rgba(248,113,113,0.35)]"
                  >
                    Sign in to workspace
                  </button>
                </div>
                <p className="mt-4 text-xs text-red-200/80 font-fun">
                  We made the button bright red so you never miss the way in.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <section className="mx-auto max-w-7xl space-y-12 px-6 pb-20 lg:px-10">
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">How JobSeek works</p>
            <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Every flow is connected end to end.</h2>
            <p className="max-w-3xl text-sm leading-7 text-slate-300">
              JobSeek is designed to keep the seeker journey and recruiter workflow in sync. Resume parsing, routing, ranking, and outreach all happen
              inside one coordinated system so no step gets lost.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            {systemFlow.map((step) => (
              <div key={step.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-400/10 text-red-200">
                  <step.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-[#1b0b0b] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-400/10 text-red-200">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-red-200/70">Job seeker flow</p>
                  <h3 className="font-heading text-2xl font-semibold">From upload to offer-ready.</h3>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {seekerFlow.map((step) => (
                  <div key={step.title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="font-medium text-white">{step.title}</p>
                    <p className="mt-2 text-sm text-slate-300">{step.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#1b0b0b] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-400/10 text-red-200">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-red-200/70">Recruiter flow</p>
                  <h3 className="font-heading text-2xl font-semibold">From vacancy to shortlist.</h3>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {recruiterFlow.map((step) => (
                  <div key={step.title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="font-medium text-white">{step.title}</p>
                    <p className="mt-2 text-sm text-slate-300">{step.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-400/10 text-red-200">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-red-200/70">Ranking clarity</p>
                  <h3 className="font-heading text-2xl font-semibold">Scores that explain themselves.</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Every rank is backed by the same inputs recruiters care about: skill overlap, experience strength, resume tone, and response readiness.
                Seeker dashboards surface these signals so improvements are easy to target.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Skill fit", value: "60%", note: "Matched tools and role depth" },
                  { label: "Experience weight", value: "20%", note: "Years and project evidence" },
                  { label: "Communication tone", value: "10%", note: "Confident, clear language" },
                  { label: "Format quality", value: "10%", note: "ATS readiness and structure" },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-red-200/70">{item.label}</p>
                    <p className="mt-2 font-heading text-2xl font-semibold text-white">{item.value}</p>
                    <p className="mt-2 text-xs text-slate-400">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#1b0b0b] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-400/10 text-red-200">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-red-200/70">Human-ready outputs</p>
                  <h3 className="font-heading text-2xl font-semibold">Less noise, more signal.</h3>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  "Recruiters receive ranked shortlists with missing skills highlighted.",
                  "Seeker profiles show exactly why a role is a high or low fit.",
                  "Outreach templates keep communication professional and fast.",
                ].map((line) => (
                  <div key={line} className="flex items-start gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                    <BadgeCheck className="mt-0.5 h-4 w-4 text-red-200" />
                    <span>{line}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-3xl border border-red-400/15 bg-red-400/10 p-4 text-sm text-red-100">
                <div className="flex items-start gap-3">
                  <KeyRound className="mt-0.5 h-4 w-4" />
                  <p>Security and compliance stay active across every stage of the flow.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
