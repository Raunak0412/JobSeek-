"use client"

import { useSyncExternalStore } from "react"
import { seekerProfile } from "@/lib/mock-data"

export type EditableSeekerProfile = {
  email: string
  github: string
  linkedin: string
  portfolio: string
  availability: string
  contactNote: string
  experienceOverview: string
  avatarStyle: string
  photoDataUrl: string
}

export const seekerAvatarStyles = [
  { id: "ember", from: "#F97316", to: "#F43F5E" },
  { id: "ocean", from: "#38BDF8", to: "#2563EB" },
  { id: "mint", from: "#34D399", to: "#10B981" },
  { id: "violet", from: "#A855F7", to: "#6366F1" },
  { id: "sunset", from: "#FDBA74", to: "#FB7185" },
  { id: "slate", from: "#94A3B8", to: "#334155" },
] as const

const SEEKER_PROFILE_STORAGE_KEY = "jobseek_profile_custom"
const seekerProfileListeners = new Set<() => void>()
let seekerProfileSnapshot: EditableSeekerProfile | null = null

function createDefaultSeekerProfile(): EditableSeekerProfile {
  return {
    email: seekerProfile.email,
    github: "",
    linkedin: "",
    portfolio: "",
    availability: "",
    contactNote: "",
    experienceOverview: "",
    avatarStyle: "ember",
    photoDataUrl: "",
  }
}

export function getProfileInitials(name: string, fallback = "JS") {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

  return initials || fallback
}

export function makeAvatarDataUrl(from: string, to: string, label: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
    <rect width="120" height="120" rx="36" fill="url(#g)"/>
    <text x="60" y="68" text-anchor="middle" font-family="Arial" font-size="44" fill="white" font-weight="700">${label}</text>
  </svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function readStoredSeekerProfile(): EditableSeekerProfile {
  const defaults = createDefaultSeekerProfile()
  if (typeof window === "undefined") return defaults

  const stored = window.localStorage.getItem(SEEKER_PROFILE_STORAGE_KEY)
  if (!stored) return defaults

  try {
    return { ...defaults, ...JSON.parse(stored) }
  } catch {
    return defaults
  }
}

function getSeekerProfileSnapshot() {
  if (typeof window === "undefined") return createDefaultSeekerProfile()
  if (!seekerProfileSnapshot) {
    seekerProfileSnapshot = readStoredSeekerProfile()
  }

  return seekerProfileSnapshot
}

function notifySeekerProfileListeners() {
  seekerProfileListeners.forEach((listener) => listener())
}

function persistSeekerProfile(profile: EditableSeekerProfile) {
  seekerProfileSnapshot = profile
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SEEKER_PROFILE_STORAGE_KEY, JSON.stringify(profile))
  }
  notifySeekerProfileListeners()
}

export function getSeekerAvatarSrc(
  name: string,
  profile: Pick<EditableSeekerProfile, "avatarStyle" | "photoDataUrl">
) {
  if (profile.photoDataUrl) return profile.photoDataUrl

  const avatarStyle = seekerAvatarStyles.find((style) => style.id === profile.avatarStyle) ?? seekerAvatarStyles[0]
  return makeAvatarDataUrl(avatarStyle.from, avatarStyle.to, getProfileInitials(name))
}

type ProfileUpdater = EditableSeekerProfile | ((current: EditableSeekerProfile) => EditableSeekerProfile)

function subscribeToSeekerProfile(listener: () => void) {
  seekerProfileListeners.add(listener)

  if (typeof window === "undefined") {
    return () => {
      seekerProfileListeners.delete(listener)
    }
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key && event.key !== SEEKER_PROFILE_STORAGE_KEY) return
    seekerProfileSnapshot = readStoredSeekerProfile()
    listener()
  }

  window.addEventListener("storage", handleStorage)

  return () => {
    seekerProfileListeners.delete(listener)
    window.removeEventListener("storage", handleStorage)
  }
}

function setSeekerProfile(updater: ProfileUpdater) {
  const current = getSeekerProfileSnapshot()
  const next = typeof updater === "function" ? updater(current) : updater
  persistSeekerProfile(next)
}

export function useSeekerProfileDetails() {
  const profile = useSyncExternalStore(subscribeToSeekerProfile, getSeekerProfileSnapshot, createDefaultSeekerProfile)
  return [profile, setSeekerProfile] as const
}
