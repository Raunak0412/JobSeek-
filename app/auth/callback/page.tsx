"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { getDashboardPath, useAuth } from "@/lib/auth-context"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading } = useAuth()
  const [isExchanging, setIsExchanging] = useState(true)
  const [oauthError, setOauthError] = useState("")

  useEffect(() => {
    const exchangeCode = async () => {
      const queryError = searchParams.get("error_description") ?? searchParams.get("error") ?? ""
      const hashParams = typeof window !== "undefined" ? new URLSearchParams(window.location.hash.replace(/^#/, "")) : null
      const hashError = hashParams?.get("error_description") ?? hashParams?.get("error") ?? ""
      const authError = queryError || hashError
      if (authError) {
        setOauthError(authError)
        setIsExchanging(false)
        return
      }

      const supabase = getSupabaseBrowserClient()
      if (!supabase) {
        setOauthError("Supabase is not configured in the browser.")
        setIsExchanging(false)
        return
      }

      const code = searchParams.get("code")
      if (!code) {
        setIsExchanging(false)
        return
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        setOauthError(error.message)
      }

      setIsExchanging(false)
    }

    void exchangeCode()
  }, [searchParams])

  useEffect(() => {
    if (isLoading || isExchanging) return
    if (user) {
      router.replace(getDashboardPath(user.type))
      return
    }

    const nextParams = new URLSearchParams({ oauth: "failed" })
    if (oauthError) {
      nextParams.set("message", oauthError)
    }
    router.replace(`/auth/login?${nextParams.toString()}`)
  }, [isExchanging, isLoading, oauthError, router, user])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121212] text-white">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-slate-200">
        <Loader2 className="h-4 w-4 animate-spin text-violet-300" />
        Completing sign in...
      </div>
    </div>
  )
}

