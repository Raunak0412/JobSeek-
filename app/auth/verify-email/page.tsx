"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowRight, MailCheck } from "lucide-react"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const { getOtpPreview } = useAuth()
  const email = searchParams.get("email") ?? ""
  const preview = email ? getOtpPreview(email, "verify") : null

  return (
    <AuthShell
      title="Verify your email"
      description="Before entering the product, confirm the email address tied to your account."
      backHref="/auth/register"
      backLabel="Back to registration"
    >
      <div className="space-y-5">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-400/10 text-red-200">
            <MailCheck className="h-6 w-6" />
          </div>
          <p className="mt-5 text-base leading-7 text-slate-300">
            We created your account for <span className="font-medium text-white">{email}</span>. Enter the OTP on the next page to mark the address as verified.
          </p>
        </div>

        <div className="rounded-3xl border border-red-400/15 bg-red-400/10 p-4 text-sm leading-6 text-red-100">
          Demo verification code: <span className="font-semibold tracking-[0.28em]">{preview ?? "482913"}</span>
        </div>

        <Link href={`/auth/verify-otp?email=${encodeURIComponent(email)}&purpose=verify`}>
          <Button className="h-12 w-full rounded-2xl bg-red-400 text-slate-950 hover:bg-red-300">
            Continue to OTP
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>

        <p className="text-sm text-slate-400">
          Wrong email?{" "}
          <Link href="/auth/register" className="text-red-300 hover:text-red-200">
            Start again
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  )
}
