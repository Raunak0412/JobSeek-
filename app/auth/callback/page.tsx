"use client"

import { useEffect } from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { getDashboardPath, useAuth } from "@/lib/auth-context"
import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading } = useAuth()
  const [isExchanging, setIsExchanging] = useState(true)

  useEffect(() => {
    const exchangeCode = async () => {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) {
        setIsExchanging(false)
        return
      }
      const code = searchParams.get("code")
      if (!code) {
        setIsExchanging(false)
        return
      }
      await supabase.auth.exchangeCodeForSession(code)
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
    router.replace("/auth/login?oauth=failed")
  }, [isExchanging, isLoading, router, user])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121212] text-white">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-slate-200">
        <Loader2 className="h-4 w-4 animate-spin text-violet-300" />
        Completing sign in...
      </div>
    </div>
  )
}

