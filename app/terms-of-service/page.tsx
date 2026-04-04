import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service | JobSeek",
  description: "The usage terms for JobSeek recruitment workspace, accounts, data handling, and platform conduct.",
}

export default function TermsOfServicePage() {
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
        <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight text-white sm:text-5xl">Terms of Service</h1>
        <p className="mt-3 text-sm text-slate-400">Last updated: April 4, 2026</p>
      </header>

      <section className="mt-8 space-y-6 rounded-3xl border border-white/10 bg-[#171717]/85 p-6 leading-7 text-slate-300">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-white">Account responsibilities</h2>
          <p className="mt-2">
            You are responsible for account credentials, authorized workspace usage, and actions performed from your account.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-semibold text-white">Acceptable use</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Use JobSeek only for lawful recruitment and career activities.</li>
            <li>Do not upload malicious files, harmful scripts, or deceptive job content.</li>
            <li>Do not attempt to bypass permissions or access unauthorized data.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-semibold text-white">AI and scoring outputs</h2>
          <p className="mt-2">
            Skill extraction and ranking outputs are decision-support signals. Final hiring decisions remain the responsibility of recruiters and
            employers.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-semibold text-white">Content ownership</h2>
          <p className="mt-2">
            Users retain ownership of their submitted content. By using JobSeek, you grant permission to process that content for recruitment workflows.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-semibold text-white">Suspension and termination</h2>
          <p className="mt-2">
            Accounts may be suspended or removed for policy violations, security risks, or legal compliance requirements.
          </p>
        </div>
      </section>
    </main>
  )
}
