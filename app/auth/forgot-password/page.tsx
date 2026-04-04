"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, MailOpen } from "lucide-react"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"

export default function ForgotPasswordPage() {
  const { authMode, requestPasswordReset } = useAuth()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setMessage("")
    setIsLoading(true)

    const result = await requestPasswordReset(email)
    setIsLoading(false)

    if (!result.success) {
      setError(result.error ?? "Unable to send reset code.")
      return
    }

    if (authMode === "demo") {
      setMessage(`Demo OTP generated: ${result.code ?? ""}`)
      return
    }

    setMessage("Password reset email sent. Open the link in your inbox to set a new password.")
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
          {authMode === "demo"
            ? "This flow is mocked on the frontend. A reset OTP is generated and shown immediately."
            : "We use Supabase Auth recovery links. Submit your email and check your inbox."}
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

        {message ? (
          <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 px-4 py-3 text-sm text-violet-100">{message}</div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-violet-400/20 bg-violet-400/10 px-4 py-3 text-sm text-violet-100">
            {error}
          </div>
        ) : null}

        <Button type="submit" disabled={isLoading} className="h-12 w-full rounded-2xl bg-violet-500 text-white hover:bg-violet-400">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MailOpen className="mr-2 h-4 w-4" />}
          {authMode === "demo" ? "Send reset OTP" : "Send reset link"}
        </Button>

        <p className="text-sm text-slate-400">
          Remember your password?{" "}
          <Link href="/auth/login" className="text-violet-400 hover:text-violet-200">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}
