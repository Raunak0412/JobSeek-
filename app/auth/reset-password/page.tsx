"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, ShieldCheck } from "lucide-react"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { resetPassword } = useAuth()
  const email = searchParams.get("email") ?? ""
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsLoading(true)
    const result = await resetPassword(email, password)
    setIsLoading(false)

    if (!result.success) {
      setError(result.error ?? "Unable to update password.")
      return
    }

    router.push("/auth/login?reset=1")
  }

  return (
    <AuthShell
      title="Create a new password"
      description="Finish the reset flow with a new password for your SmartRecruit account."
      backHref="/auth/verify-otp"
      backLabel="Back to OTP"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-cyan-300" />
            <span>Updating password for {email}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-200">
            New password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a new password"
            className="h-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-slate-500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-slate-200">
            Confirm password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repeat the new password"
            className="h-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-slate-500"
            required
          />
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <Button type="submit" disabled={isLoading} className="h-12 w-full rounded-2xl bg-cyan-400 text-slate-950 hover:bg-cyan-300">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save new password
        </Button>
      </form>
    </AuthShell>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  )
}
