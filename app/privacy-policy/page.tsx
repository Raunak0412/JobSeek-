import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy | JobSeek",
  description: "How JobSeek collects, uses, protects, and manages personal data across hiring workflows.",
}

export default function PrivacyPolicyPage() {
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
        <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight text-white sm:text-5xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-slate-400">Last updated: April 4, 2026</p>
      </header>

      <section className="mt-8 space-y-6 rounded-3xl border border-white/10 bg-[#171717]/85 p-6 leading-7 text-slate-300">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-white">What we collect</h2>
          <p className="mt-2">
            JobSeek processes account details, candidate resumes, job descriptions, recruiter notes, and usage logs needed to run matching, ranking, and
            communication workflows.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-semibold text-white">How we use data</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Authenticate users and secure workspace access.</li>
            <li>Parse resumes and classify skills for role matching.</li>
            <li>Generate rankings, shortlist views, and recruiter outreach actions.</li>
            <li>Monitor quality, abuse, and system reliability.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-semibold text-white">Sharing and access controls</h2>
          <p className="mt-2">
            Candidate and recruiter information is shared only inside role-based hiring workflows. Access is limited by account permissions and workflow
            context.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-semibold text-white">Security and retention</h2>
          <p className="mt-2">
            JobSeek uses encrypted transport, controlled session handling, and audit-oriented events for sensitive actions. Data retention depends on
            workspace policy, account activity, and legal obligations.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-semibold text-white">Your choices</h2>
          <p className="mt-2">
            Users can request profile updates, data export, or account removal through support and admin controls. For privacy questions, contact your
            organization administrator or JobSeek support.
          </p>
        </div>
      </section>
    </main>
  )
}
