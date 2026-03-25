"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, MailOpen } from "lucide-react"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [demoCode, setDemoCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setIsLoading(true)

    const result = await requestPasswordReset(email)
    setIsLoading(false)

    if (!result.success) {
      setError(result.error ?? "Unable to send reset code.")
      return
    }

    setDemoCode(result.code ?? "")
    router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}&purpose=reset`)
  }

  return (
    <AuthShell
      title="Reset your password"
      description="Enter your email and we will send an OTP so you can securely create a new password."
      backHref="/auth/login"
      backLabel="Back to sign in"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
          This flow is mocked on the frontend. For demo purposes, the reset OTP is generated immediately and stored in local storage.
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-200">
            Account email
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

        {demoCode ? (
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
            Demo OTP generated: <span className="font-semibold tracking-[0.3em]">{demoCode}</span>
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <Button type="submit" disabled={isLoading} className="h-12 w-full rounded-2xl bg-cyan-400 text-slate-950 hover:bg-cyan-300">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MailOpen className="mr-2 h-4 w-4" />}
          Send reset OTP
        </Button>

        <p className="text-sm text-slate-400">
          Remember your password?{" "}
          <Link href="/auth/login" className="text-cyan-300 hover:text-cyan-200">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}
