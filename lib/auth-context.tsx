"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { UserRole } from "@/lib/mock-data"

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
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>
  register: (data: {
    email: string
    password: string
    name: string
    type: UserRole
    company?: string
  }) => Promise<{ success: boolean; error?: string }>
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
  session: "smartrecruit_session",
  users: "smartrecruit_users",
  otps: "smartrecruit_otps",
  resetEmail: "smartrecruit_reset_email",
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
    company: "SmartRecruit Labs",
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    safeWrite(STORAGE_KEYS.users, getUsers())
    const session = safeRead<User | null>(STORAGE_KEYS.session, null)
    setUser(session)
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
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

  const register = async (data: {
    email: string
    password: string
    name: string
    type: UserRole
    company?: string
  }) => {
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
    return { success: true }
  }

  const requestPasswordReset = async (email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 450))
    const existing = getUsers().find((entry) => entry.email.toLowerCase() === email.toLowerCase())
    if (!existing) {
      return { success: false, error: "We could not find an account for that email." }
    }
    const otp = issueOtp(existing.email, "reset")
    return { success: true, code: otp.code }
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
    await new Promise((resolve) => setTimeout(resolve, 450))
    const otp = getOtps().find(
      (item) => item.email.toLowerCase() === email.toLowerCase() && item.purpose === purpose
    )
    if (!otp) {
      return { success: false, error: "The OTP has expired. Please request a new one." }
    }
    if (otp.code !== code) {
      return { success: false, error: "Incorrect OTP code." }
    }

    if (purpose === "verify") {
      saveUsers(
        getUsers().map((entry) =>
          entry.email.toLowerCase() === email.toLowerCase() ? { ...entry, verified: true } : entry
        )
      )
    } else if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEYS.resetEmail, email)
    }

    saveOtps(
      getOtps().filter(
        (item) => !(item.email.toLowerCase() === email.toLowerCase() && item.purpose === purpose)
      )
    )
    return { success: true }
  }

  const resendOtp = async (email: string, purpose: "verify" | "reset") => {
    await new Promise((resolve) => setTimeout(resolve, 450))
    const otp = issueOtp(email, purpose)
    return { success: true, code: otp.code }
  }

  const resetPassword = async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 450))
    if (typeof window === "undefined") {
      return { success: false, error: "Reset is only available in the browser." }
    }

    const approvedEmail = window.localStorage.getItem(STORAGE_KEYS.resetEmail)
    if (!approvedEmail || approvedEmail.toLowerCase() !== email.toLowerCase()) {
      return { success: false, error: "Please verify the OTP before setting a new password." }
    }

    saveUsers(
      getUsers().map((entry) =>
        entry.email.toLowerCase() === email.toLowerCase() ? { ...entry, password } : entry
      )
    )
    window.localStorage.removeItem(STORAGE_KEYS.resetEmail)
    return { success: true }
  }

  const getOtpPreview = (email: string, purpose: "verify" | "reset") => {
    const otp = getOtps().find(
      (item) => item.email.toLowerCase() === email.toLowerCase() && item.purpose === purpose
    )
    return otp?.code ?? null
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEYS.session)
    }
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
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
