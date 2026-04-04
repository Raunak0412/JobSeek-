import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Global Reach | JobSeek",
  description: "How JobSeek supports distributed teams across regions, hiring markets, and cross-border collaboration.",
}

export default function GlobalReachPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 pb-20 pt-10 text-slate-100 lg:px-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition-colors hover:border-violet-300/40 hover:text-violet-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <header className="mt-7">
        <p className="text-xs uppercase tracking-[0.22em] text-violet-200/75">Policy</p>
        <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight text-white sm:text-5xl">Global Reach</h1>
        <p className="mt-3 text-sm text-slate-400">Last updated: April 4, 2026</p>
      </header>

      <section className="mt-8 space-y-6 rounded-3xl border border-white/10 bg-[#171717]/85 p-6 leading-7 text-slate-300">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-white">Cross-region collaboration</h2>
          <p className="mt-2">
            JobSeek is designed for distributed teams where recruiters, hiring managers, and candidates may operate across different locations and
            time zones.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-semibold text-white">Market-aware workflows</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Role templates can be adapted by region and hiring context.</li>
            <li>Scoring and shortlist views are consistent across recruiter workspaces.</li>
            <li>Communication trails remain centralized for remote teams.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-semibold text-white">Compliance-minded operations</h2>
          <p className="mt-2">
            Hiring activity should align with local employment and privacy requirements. JobSeek supports policy-aware workflows, role-based access, and
            auditable status transitions.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-semibold text-white">Accessibility commitment</h2>
          <p className="mt-2">
            Interfaces prioritize keyboard-friendly controls, readable contrast, and reduced-motion support so teams in every region can access the
            platform effectively.
          </p>
        </div>
      </section>
    </main>
  )
}
