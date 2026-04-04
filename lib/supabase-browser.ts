"use client"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

function toValidHttpUrl(value: string | undefined) {
  if (!value) return null
  try {
    const parsed = new URL(value)
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null
    return value
  } catch {
    return null
  }
}

const supabaseUrl = toValidHttpUrl(rawSupabaseUrl)

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

let browserClient: SupabaseClient | null = null
let didWarnInvalidSupabaseConfig = false

function warnInvalidSupabaseConfigOnce() {
  if (didWarnInvalidSupabaseConfig || typeof window === "undefined") return
  if (!rawSupabaseUrl && !supabaseAnonKey) return

  const reasons: string[] = []
  if (!rawSupabaseUrl) {
    reasons.push("NEXT_PUBLIC_SUPABASE_URL is missing.")
  } else if (!supabaseUrl) {
    reasons.push("NEXT_PUBLIC_SUPABASE_URL must be a valid HTTP or HTTPS URL.")
  }
  if (!supabaseAnonKey) {
    reasons.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.")
  }

  didWarnInvalidSupabaseConfig = true
  console.warn(`[auth] Supabase config invalid. Falling back to demo auth mode. ${reasons.join(" ")}`)
}

export function getSupabaseBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    warnInvalidSupabaseConfigOnce()
    return null
  }
  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }
  return browserClient
}
