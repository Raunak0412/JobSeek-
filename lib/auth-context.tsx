"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { User as SupabaseAuthUser } from "@supabase/supabase-js"
import type { UserRole } from "@/lib/mock-data"
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase-browser"

export type AuthMode = "supabase" | "demo"

interface User {
  email: string
  name: string
  type: UserRole
  company?: string
  verified: boolean
}

interface StoredUser extends User {
  password: string
}

interface OtpRecord {
  email: string
  purpose: "verify" | "reset"
  code: string
  expiresAt: number
}

interface AuthContextType {
  authMode: AuthMode
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>
  signInWithGoogle: (preferredRole?: UserRole) => Promise<{ success: boolean; error?: string }>
  register: (data: {
    email: string
    password: string
    name: string
    type: UserRole
    company?: string
  }) => Promise<{ success: boolean; error?: string; requiresEmailVerification?: boolean }>
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string; code?: string }>
  verifyOtp: (params: {
    email: string
    code: string
    purpose: "verify" | "reset"
  }) => Promise<{ success: boolean; error?: string }>
  resendOtp: (email: string, purpose: "verify" | "reset") => Promise<{ success: boolean; code?: string }>
  resetPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  getOtpPreview: (email: string, purpose: "verify" | "reset") => string | null
  logout: () => void
}

const STORAGE_KEYS = {
  session: "JobSeek_session",
  users: "JobSeek_users",
  otps: "JobSeek_otps",
  resetEmail: "JobSeek_reset_email",
  pendingGoogleRole: "JobSeek_pending_google_role",
} as const

const DEMO_USERS: StoredUser[] = [
  {
    email: "seeker@test.com",
    password: "seeker123",
    name: "Aarav Mehta",
    type: "seeker",
    verified: true,
  },
  {
    email: "recruiter@test.com",
    password: "recruiter123",
    name: "Riya Kapoor",
    type: "recruiter",
    company: "JobSeek Labs",
    verified: true,
  },
]

export const DUMMY_CREDENTIALS = {
  seeker: DEMO_USERS[0],
  recruiter: DEMO_USERS[1],
}

export function getDashboardPath(role: UserRole) {
  return role === "recruiter" ? "/dashboard/recruiter" : "/dashboard/seeker"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  const raw = window.localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function safeWrite<T>(key: string, value: T) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(key, JSON.stringify(value))
}

function normalizeRole(value: unknown, fallback: UserRole = "seeker") {
  if (value === "recruiter") return "recruiter"
  if (value === "seeker") return "seeker"
  return fallback
}

function toPublicUser(user: StoredUser): User {
  return {
    email: user.email,
    name: user.name,
    type: user.type,
    company: user.company,
    verified: user.verified,
  }
}

function getUsers() {
  const users = safeRead<StoredUser[]>(STORAGE_KEYS.users, DEMO_USERS)
  if (users.length === 0) {
    safeWrite(STORAGE_KEYS.users, DEMO_USERS)
    return DEMO_USERS
  }
  return users
}

function saveUsers(users: StoredUser[]) {
  safeWrite(STORAGE_KEYS.users, users)
}

function getOtps() {
  const otps = safeRead<OtpRecord[]>(STORAGE_KEYS.otps, []).filter((item) => item.expiresAt > Date.now())
  safeWrite(STORAGE_KEYS.otps, otps)
  return otps
}

function saveOtps(otps: OtpRecord[]) {
  safeWrite(STORAGE_KEYS.otps, otps)
}

function issueOtp(email: string, purpose: "verify" | "reset") {
  const code = purpose === "verify" ? "482913" : "314159"
  const otp: OtpRecord = {
    email,
    purpose,
    code,
    expiresAt: Date.now() + 1000 * 60 * 15,
  }
  const nextOtps = getOtps().filter((item) => !(item.email === email && item.purpose === purpose))
  saveOtps([...nextOtps, otp])
  return otp
}

function getPendingGoogleRole() {
  if (typeof window === "undefined") return null
  return normalizeRole(window.localStorage.getItem(STORAGE_KEYS.pendingGoogleRole), "seeker")
}

function setPendingGoogleRole(role: UserRole) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEYS.pendingGoogleRole, role)
}

function clearPendingGoogleRole() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(STORAGE_KEYS.pendingGoogleRole)
}

function extractNameFromAuthUser(authUser: SupabaseAuthUser) {
  const metadata = authUser.user_metadata as Record<string, unknown> | undefined
  const fromMetadata =
    (typeof metadata?.name === "string" && metadata.name) ||
    (typeof metadata?.full_name === "string" && metadata.full_name) ||
    (typeof metadata?.user_name === "string" && metadata.user_name) ||
    ""
  if (fromMetadata) return fromMetadata

  const email = authUser.email ?? ""
  if (!email) return "User"
  return email.split("@")[0]
}

type ProfileRow = {
  id: string
  email: string | null
  full_name: string | null
  role: UserRole | null
  company: string | null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const authMode: AuthMode = useMemo(() => (isSupabaseConfigured ? "supabase" : "demo"), [])

  const syncSupabaseUser = async (authUser: SupabaseAuthUser | null) => {
    if (!authUser) {
      setUser(null)
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(STORAGE_KEYS.session)
      }
      return null
    }

    const supabase = getSupabaseBrowserClient()
    if (!supabase) return null

    const metadata = authUser.user_metadata as Record<string, unknown> | undefined
    const metadataRole = normalizeRole(metadata?.type ?? metadata?.role, "seeker")
    const pendingRole = getPendingGoogleRole()
    let profile: ProfileRow | null = null

    const { data: profileData } = await supabase
      .from("profiles")
      .select("id,email,full_name,role,company")
      .eq("id", authUser.id)
      .maybeSingle()

    if (profileData) {
      profile = profileData as ProfileRow
    }

    const role = normalizeRole(profile?.role ?? pendingRole ?? metadataRole, "seeker")
    const companyFromMetadata = typeof metadata?.company === "string" ? metadata.company : null
    const nameFromMetadata =
      typeof metadata?.name === "string"
        ? metadata.name
        : typeof metadata?.full_name === "string"
          ? metadata.full_name
          : null

    const nextName = profile?.full_name ?? nameFromMetadata ?? extractNameFromAuthUser(authUser)
    const nextCompany = profile?.company ?? companyFromMetadata

    const nextProfile: ProfileRow = {
      id: authUser.id,
      email: authUser.email ?? profile?.email ?? "",
      full_name: nextName,
      role,
      company: nextCompany,
    }

    const shouldUpsert =
      !profile ||
      Boolean(pendingRole) ||
      profile.email !== nextProfile.email ||
      profile.full_name !== nextProfile.full_name ||
      profile.role !== nextProfile.role ||
      profile.company !== nextProfile.company

    if (shouldUpsert) {
      await supabase.from("profiles").upsert(nextProfile, { onConflict: "id" })
    }

    if (pendingRole) clearPendingGoogleRole()

    const nextUser: User = {
      email: nextProfile.email ?? authUser.email ?? "",
      name: nextName,
      type: role,
      company: nextCompany ?? undefined,
      verified: Boolean(authUser.email_confirmed_at),
    }

    setUser(nextUser)
    safeWrite(STORAGE_KEYS.session, nextUser)
    return nextUser
  }

  useEffect(() => {
    if (authMode === "demo") {
      safeWrite(STORAGE_KEYS.users, getUsers())
      const session = safeRead<User | null>(STORAGE_KEYS.session, null)
      setUser(session)
      setIsLoading(false)
      return
    }

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setIsLoading(false)
      return
    }

    let mounted = true

    const initialize = async () => {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      await syncSupabaseUser(data.session?.user ?? null)
      if (mounted) setIsLoading(false)
    }

    void initialize()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      void syncSupabaseUser(session?.user ?? null)
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [authMode])

  const login = async (email: string, password: string) => {
    if (authMode === "demo") {
      await new Promise((resolve) => setTimeout(resolve, 450))
      const existing = getUsers().find((entry) => entry.email.toLowerCase() === email.toLowerCase())
      if (!existing || existing.password !== password) {
        return { success: false, error: "Invalid email or password" }
      }
      if (!existing.verified) {
        return { success: false, error: "Please verify your email before signing in." }
      }

      const nextUser = toPublicUser(existing)
      setUser(nextUser)
      safeWrite(STORAGE_KEYS.session, nextUser)
      return { success: true, user: nextUser }
    }

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      return { success: false, error: "Supabase is not configured. Add env keys first." }
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      return { success: false, error: error.message }
    }

    const nextUser = await syncSupabaseUser(data.user)
    return { success: true, user: nextUser ?? undefined }
  }

  const signInWithGoogle = async (preferredRole?: UserRole) => {
    if (authMode === "demo") {
      return { success: false, error: "Google sign in requires Supabase mode. Add env keys first." }
    }

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      return { success: false, error: "Supabase is not configured. Add env keys first." }
    }

    if (preferredRole) {
      setPendingGoogleRole(preferredRole)
    } else {
      setPendingGoogleRole("seeker")
    }

    const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          prompt: "select_account",
        },
      },
    })

    if (error) {
      clearPendingGoogleRole()
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  const register = async (data: {
    email: string
    password: string
    name: string
    type: UserRole
    company?: string
  }) => {
    if (authMode === "demo") {
      await new Promise((resolve) => setTimeout(resolve, 450))
      const users = getUsers()
      const exists = users.some((entry) => entry.email.toLowerCase() === data.email.toLowerCase())
      if (exists) {
        return { success: false, error: "An account already exists for this email." }
      }

      saveUsers([
        ...users,
        {
          email: data.email,
          password: data.password,
          name: data.name,
          type: data.type,
          company: data.company,
          verified: false,
        },
      ])
      issueOtp(data.email, "verify")
      return { success: true, requiresEmailVerification: true }
    }

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      return { success: false, error: "Supabase is not configured. Add env keys first." }
    }

    const emailRedirectTo = typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          type: data.type,
          company: data.company ?? null,
        },
        emailRedirectTo,
      },
    })

    if (error) {
      return { success: false, error: error.message }
    }

    if (signUpData.session?.user) {
      await syncSupabaseUser(signUpData.session.user)
    }

    return {
      success: true,
      requiresEmailVerification: !signUpData.session,
    }
  }

  const requestPasswordReset = async (email: string) => {
    if (authMode === "demo") {
      await new Promise((resolve) => setTimeout(resolve, 450))
      const existing = getUsers().find((entry) => entry.email.toLowerCase() === email.toLowerCase())
      if (!existing) {
        return { success: false, error: "We could not find an account for that email." }
      }
      const otp = issueOtp(existing.email, "reset")
      return { success: true, code: otp.code }
    }

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      return { success: false, error: "Supabase is not configured. Add env keys first." }
    }

    const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/auth/reset-password` : undefined
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  const verifyOtp = async ({
    email,
    code,
    purpose,
  }: {
    email: string
    code: string
    purpose: "verify" | "reset"
  }) => {
    if (authMode === "demo") {
      await new Promise((resolve) => setTimeout(resolve, 450))
      const otp = getOtps().find((item) => item.email.toLowerCase() === email.toLowerCase() && item.purpose === purpose)
      if (!otp) {
        return { success: false, error: "The OTP has expired. Please request a new one." }
      }
      if (otp.code !== code) {
        return { success: false, error: "Incorrect OTP code." }
      }

      if (purpose === "verify") {
        saveUsers(getUsers().map((entry) => (entry.email.toLowerCase() === email.toLowerCase() ? { ...entry, verified: true } : entry)))
      } else if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEYS.resetEmail, email)
      }

      saveOtps(getOtps().filter((item) => !(item.email.toLowerCase() === email.toLowerCase() && item.purpose === purpose)))
      return { success: true }
    }

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      return { success: false, error: "Supabase is not configured. Add env keys first." }
    }

    const type = purpose === "verify" ? "signup" : "recovery"
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    const { data } = await supabase.auth.getSession()
    await syncSupabaseUser(data.session?.user ?? null)
    return { success: true }
  }

  const resendOtp = async (email: string, purpose: "verify" | "reset") => {
    if (authMode === "demo") {
      await new Promise((resolve) => setTimeout(resolve, 450))
      const otp = issueOtp(email, purpose)
      return { success: true, code: otp.code }
    }

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      return { success: false, code: undefined }
    }

    if (purpose === "reset") {
      return { success: false, code: undefined }
    }

    const { error } = await supabase.auth.resend({ email, type: "signup" })
    if (error) {
      return { success: false, code: undefined }
    }

    return { success: true, code: undefined }
  }

  const resetPassword = async (_email: string, password: string) => {
    if (authMode === "demo") {
      await new Promise((resolve) => setTimeout(resolve, 450))
      if (typeof window === "undefined") {
        return { success: false, error: "Reset is only available in the browser." }
      }

      const approvedEmail = window.localStorage.getItem(STORAGE_KEYS.resetEmail)
      if (!approvedEmail) {
        return { success: false, error: "Please verify the OTP before setting a new password." }
      }

      saveUsers(getUsers().map((entry) => (entry.email.toLowerCase() === approvedEmail.toLowerCase() ? { ...entry, password } : entry)))
      window.localStorage.removeItem(STORAGE_KEYS.resetEmail)
      return { success: true }
    }

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      return { success: false, error: "Supabase is not configured. Add env keys first." }
    }

    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  const getOtpPreview = (email: string, purpose: "verify" | "reset") => {
    if (authMode !== "demo") return null
    const otp = getOtps().find((item) => item.email.toLowerCase() === email.toLowerCase() && item.purpose === purpose)
    return otp?.code ?? null
  }

  const logout = () => {
    if (authMode === "demo") {
      setUser(null)
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(STORAGE_KEYS.session)
      }
      router.push("/")
      return
    }

    const supabase = getSupabaseBrowserClient()
    if (supabase) {
      void supabase.auth.signOut()
    }

    setUser(null)
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEYS.session)
    }
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        authMode,
        user,
        isLoading,
        login,
        signInWithGoogle,
        register,
        requestPasswordReset,
        verifyOtp,
        resendOtp,
        resetPassword,
        getOtpPreview,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
