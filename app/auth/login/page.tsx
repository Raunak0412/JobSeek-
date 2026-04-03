"use client"

import { Suspense, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DUMMY_CREDENTIALS, getDashboardPath, useAuth } from "@/lib/auth-context"

function LoginContent() {
  const { authMode, login, signInWithGoogle } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const banner = useMemo(() => {
    if (searchParams.get("verified")) return "Email verified. You can sign in now."
    if (searchParams.get("reset")) return "Password updated. Sign in with your new password."
    if (searchParams.get("registered")) return "Account created. Sign in to continue."
    if (searchParams.get("oauth") === "failed") return "Google sign-in could not be completed. Please try again."
    return ""
  }, [searchParams])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setIsLoading(true)
    const result = await login(email, password)
    setIsLoading(false)

    if (!result.success) {
      setError(result.error ?? "Unable to sign in.")
      return
    }

    router.push(getDashboardPath(result.user?.type ?? "seeker"))
  }

  const fillDemo = (role: "seeker" | "recruiter") => {
    const demo = DUMMY_CREDENTIALS[role]
    setEmail(demo.email)
    setPassword(demo.password)
  }

  const handleGoogleSignIn = async () => {
    setError("")
    setIsGoogleLoading(true)
    const result = await signInWithGoogle()
    setIsGoogleLoading(false)

    if (!result.success) {
      setError(result.error ?? "Unable to continue with Google.")
    }
  }

  return (
    <AuthShell
      title="Sign in"
      description="Welcome back. Access your dashboard and continue your hiring workflow."
      backHref="/"
      backLabel="Back to home"
      eyebrow="Secure Workspace Access"
    >
      <div className="space-y-6">
        {banner ? (
          <div className="rounded-2xl border border-red-300/30 bg-red-300/10 px-4 py-3 text-sm text-red-100">{banner}</div>
        ) : null}

        {authMode === "demo" ? (
          <div className="rounded-3xl border border-red-400/15 bg-red-400/10 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-2xl bg-white/10 p-2 text-red-100">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-red-100">Demo access</p>
                <p className="mt-1 text-sm leading-6 text-red-50/80">
                  Quick-fill a test account while backend auth is still mocked.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fillDemo("seeker")}
                    className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10"
                  >
                    Fill seeker
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fillDemo("recruiter")}
                    className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10"
                  >
                    Fill recruiter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="h-12 w-full rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10"
          >
            {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Continue with Google
          </Button>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-200">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="h-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-slate-500"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-slate-200">
                Password
              </Label>
              <Link href="/auth/forgot-password" className="text-sm text-red-300 hover:text-red-200">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="h-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-slate-500"
              required
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{error}</div>
          ) : null}

          <Button type="submit" disabled={isLoading} className="h-12 w-full rounded-2xl bg-red-400 text-slate-950 hover:bg-red-300">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LockKeyhole className="mr-2 h-4 w-4" />}
            Continue
          </Button>
        </form>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 text-red-300" />
            <p>
              {authMode === "demo"
                ? "OTP, verification, and reset states are mocked in local storage for end-to-end frontend flow testing."
                : "Credentials, sessions, and OAuth are now handled by Supabase Auth."}
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-400">
          No account yet?{" "}
          <Link href="/auth/register" className="text-red-300 hover:text-red-200">
            Create one
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  )
}
