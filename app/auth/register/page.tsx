"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Building2, Loader2, UserRound } from "lucide-react"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { register } = useAuth()
  const initialRole = searchParams.get("role") === "recruiter" ? "recruiter" : "seeker"
  const [role, setRole] = useState<"seeker" | "recruiter">(initialRole)
  const [form, setForm] = useState({ name: "", company: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setIsLoading(true)

    const result = await register({
      email: form.email,
      password: form.password,
      name: form.name,
      type: role,
      company: role === "recruiter" ? form.company : undefined,
    })

    setIsLoading(false)
    if (!result.success) {
      setError(result.error ?? "Unable to create account.")
      return
    }

    router.push(`/auth/verify-email?email=${encodeURIComponent(form.email)}&purpose=verify`)
  }

  return (
    <AuthShell
      title="Create your JobSeek account"
      description="Choose whether you are a job seeker or recruiter, then continue into the verification flow."
      backHref="/auth/login"
      backLabel="Back to sign in"
    >
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              key: "seeker" as const,
              title: "Job seeker",
              detail: "Upload resumes, extract skills, and apply to matched jobs.",
              icon: UserRound,
            },
            {
              key: "recruiter" as const,
              title: "Recruiter",
              detail: "Post jobs, rank candidates, and send shortlist emails.",
              icon: Building2,
            },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setRole(item.key)}
              className={cn(
                "rounded-3xl border p-5 text-left transition",
                role === item.key
                  ? "border-red-400/40 bg-red-400/10 text-white"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10"
              )}
            >
              <item.icon className="h-5 w-5 text-red-300" />
              <p className="mt-4 font-medium">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-200">
              Full name
            </Label>
            <Input
              id="name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Your name"
              className="h-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-slate-500"
              required
            />
          </div>

          {role === "recruiter" ? (
            <div className="space-y-2">
              <Label htmlFor="company" className="text-slate-200">
                Company name
              </Label>
              <Input
                id="company"
                value={form.company}
                onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
                placeholder="Company or startup name"
                className="h-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                required
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-200">
              Work email
            </Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="you@example.com"
              className="h-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-slate-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-200">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              placeholder="Create a password"
              className="h-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-slate-500"
              required
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          <Button type="submit" disabled={isLoading} className="h-12 w-full rounded-2xl bg-red-400 text-red-950 hover:bg-red-300">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Continue to verification
          </Button>
        </form>

        <p className="text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-red-300 hover:text-red-200">
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterContent />
    </Suspense>
  )
}
