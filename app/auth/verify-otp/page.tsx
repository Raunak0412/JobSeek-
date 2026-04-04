"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, RefreshCcw, ShieldCheck } from "lucide-react"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useAuth } from "@/lib/auth-context"

function VerifyOtpContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { authMode, verifyOtp, resendOtp, getOtpPreview } = useAuth()
  const email = searchParams.get("email") ?? ""
  const purpose = searchParams.get("purpose") === "reset" ? "reset" : "verify"
  const [value, setValue] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [demoCode, setDemoCode] = useState(authMode === "demo" ? getOtpPreview(email, purpose) ?? "" : "")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const handleSubmit = async () => {
    setError("")
    setMessage("")
    setIsLoading(true)
    const result = await verifyOtp({ email, code: value, purpose })
    setIsLoading(false)

    if (!result.success) {
      setError(result.error ?? "Unable to verify OTP.")
      return
    }

    if (purpose === "reset") {
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`)
      return
    }

    router.push("/auth/login?verified=1")
  }

  const handleResend = async () => {
    setError("")
    setMessage("")
    setIsResending(true)
    const result = await resendOtp(email, purpose)
    setIsResending(false)
    if (!result.success) {
      setError(result.error ?? "Unable to resend verification code.")
      return
    }

    if (authMode === "demo") {
      setDemoCode(result.code ?? demoCode)
      setMessage("A new OTP has been generated.")
      return
    }

    setMessage("Verification code email resent. Check your inbox.")
  }

  return (
    <AuthShell
      title={purpose === "reset" ? "Enter reset OTP" : "Confirm verification OTP"}
      description="Use the six-digit code sent during the previous step to continue."
      backHref={purpose === "reset" ? "/auth/forgot-password" : "/auth/register"}
      backLabel="Back"
    >
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-white">{email}</p>
              <p className="text-sm text-slate-400">{authMode === "demo" ? `Demo OTP: ${demoCode || "Generating..."}` : "Enter the 6-digit OTP from your email."}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-[#07111f] p-5">
          <InputOTP maxLength={6} value={value} onChange={setValue} containerClassName="justify-between">
            <InputOTPGroup className="w-full justify-between gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="h-14 w-12 rounded-2xl border border-white/10 bg-white/5 text-lg text-white first:rounded-2xl first:border last:rounded-2xl"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error ? (
          <div className="rounded-2xl border border-violet-400/20 bg-violet-400/10 px-4 py-3 text-sm text-violet-100">
            {error}
          </div>
        ) : null}

        {message ? <div className="rounded-2xl border border-lime-400/20 bg-lime-400/10 px-4 py-3 text-sm text-lime-100">{message}</div> : null}

        <Button
          type="button"
          disabled={value.length !== 6 || isLoading}
          onClick={handleSubmit}
          className="h-12 w-full rounded-2xl bg-violet-500 text-white hover:bg-violet-400"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Verify OTP
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleResend}
          disabled={isResending}
          className="h-12 w-full rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10"
        >
          {isResending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
          Resend code
        </Button>
      </div>
    </AuthShell>
  )
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpContent />
    </Suspense>
  )
}
