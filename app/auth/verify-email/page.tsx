"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowRight, MailCheck } from "lucide-react"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") ?? ""

  return (
    <AuthShell
      title="Verify your email"
      description="Before entering the product, enter the OTP sent to your email address."
      backHref="/auth/register"
      backLabel="Back to registration"
    >
      <div className="space-y-5">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-200">
            <MailCheck className="h-6 w-6" />
          </div>
          <p className="mt-5 text-base leading-7 text-slate-300">
            We created your account for <span className="font-medium text-white">{email}</span>. Check your inbox and enter the 6-digit OTP code sent by
            Supabase Auth.
          </p>
        </div>

        <div className="rounded-3xl border border-violet-500/15 bg-violet-500/10 p-4 text-sm leading-6 text-violet-100">
          If the OTP is delayed, check spam/promotions, then use resend on the OTP screen.
        </div>

        <Link href={`/auth/verify-otp?email=${encodeURIComponent(email)}&purpose=verify`}>
          <Button className="h-12 w-full rounded-2xl bg-violet-500 text-white hover:bg-violet-400">
            Enter OTP
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>

        <p className="text-sm text-slate-400">
          Wrong email?{" "}
          <Link href="/auth/register" className="text-violet-400 hover:text-violet-200">
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
