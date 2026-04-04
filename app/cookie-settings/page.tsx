import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Cookie Settings | JobSeek",
  description: "Cookie and local storage usage details for JobSeek authentication, preferences, and analytics.",
}

export default function CookieSettingsPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 pb-20 pt-10 text-slate-100 lg:px-10">
      <Link
        href="/"
        className="glass-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-slate-200 transition-colors hover:border-violet-300/40 hover:text-violet-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <header className="mt-7">
        <p className="text-xs uppercase tracking-[0.22em] text-violet-200/75">Policy</p>
        <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight text-white sm:text-5xl">Cookie Settings</h1>
        <p className="mt-3 text-sm text-slate-400">Last updated: April 4, 2026</p>
      </header>

      <section className="glass-panel glass-outline mt-8 space-y-6 rounded-3xl p-6 leading-7 text-slate-300">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-white">Why cookies are used</h2>
          <p className="mt-2">
            JobSeek uses cookies and local storage to keep sessions active, remember UI preferences, and support secure authentication states.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-semibold text-white">Cookie categories</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Essential: required for login, auth callbacks, and protected routes.</li>
            <li>Preference: stores display choices and non-sensitive UI settings.</li>
            <li>Analytics: helps monitor performance and workflow quality trends.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-semibold text-white">Managing your settings</h2>
          <p className="mt-2">
            You can manage cookies using browser settings. Blocking essential cookies may affect sign-in and dashboard functionality.
          </p>
        </div>

        <div>
          <h2 className="font-heading text-2xl font-semibold text-white">Third-party services</h2>
          <p className="mt-2">
            Authentication and infrastructure providers may set strictly necessary cookies for secure sessions and request handling.
          </p>
        </div>
      </section>
    </main>
  )
}

