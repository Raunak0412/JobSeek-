"use client"

import { useEffect, useMemo, useState } from "react"
import type { CandidateProfile, JobPosting, UserRole } from "@/lib/mock-data"
import { candidates as defaultCandidates, recruiterJobs as defaultJobs, seekerApplications } from "@/lib/mock-data"

const JOBS_KEY = "jobseek_jobs"
const ACTIVE_RECRUITER_JOB_KEY = "jobseek_active_recruiter_job"
const OUTREACH_KEY = "jobseek_outreach_history"
const RESUME_KEY = "jobseek_resume"
const RESUME_META_KEY = "jobseek_resume_meta"
const NOTIFICATIONS_KEY = "jobseek_notifications"
const NOTIFICATIONS_BOOTSTRAPPED_KEY = "jobseek_notifications_bootstrapped"
const NOTIFICATIONS_CLEARED_KEY = "jobseek_notifications_cleared"
const SETTINGS_KEY = "jobseek_settings"
const JOBS_EVENT = "jobseek:jobs:update"
const OUTREACH_EVENT = "jobseek:outreach:update"
const RESUME_EVENT = "jobseek:resume:update"
const NOTIFICATIONS_EVENT = "jobseek:notifications:update"
const SETTINGS_EVENT = "jobseek:settings:update"

export type ResumeSkill = { name: string; confidence: number }
export type ResumeExtraction = {
  routedCategory: string
  documentType: string
  confidence: number
  extractedSkills: ResumeSkill[]
  softSkills: ResumeSkill[]
  sections: { name: string; completion: string }[]
  sentiment: {
    label: "Confident" | "Balanced" | "Passive" | "Analytical"
    score: number
    insights: string[]
  }
}
type ResumeSource = "file" | "camera"
export type ResumeMeta = {
  fileName: string
  fileType: string
  fileSize: number
  lastModified: number
  source: ResumeSource
  capturedAt: string
  previewDataUrl?: string
  fileDataUrl?: string
  extractedText?: string
  ocrText?: string
  ocrConfidence?: number
}

export type OutreachRecord = {
  id: string
  jobId: string
  candidateId: string
  candidateName: string
  candidateEmail: string
  subject: string
  body: string
  sentAt: string
  source: "contact-page" | "mail-studio"
}

export type NotificationChannel = "system" | "recruitment" | "applications" | "profile" | "workspace"

export type AppNotification = {
  id: string
  app: string
  title: string
  message: string
  createdAt: string
  read: boolean
  channel: NotificationChannel
  deepLink?: string
  extraCount?: number
}

export type AppSettings = {
  emailAlerts: boolean
  inAppAlerts: boolean
  weeklyDigest: boolean
  shortlistDigest: boolean
  candidateProfileVisibility: boolean
  recruiterContactVisibility: boolean
  compactCards: boolean
  autoOpenSearchResults: boolean
}

export type WorkspaceSearchType = "page" | "candidate" | "job" | "application" | "notification"

export type WorkspaceSearchResult = {
  id: string
  type: WorkspaceSearchType
  title: string
  subtitle: string
  href: string
  score: number
}

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

function notifyJobsUpdate() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(JOBS_EVENT))
}

function notifyOutreachUpdate() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(OUTREACH_EVENT))
}

function notifyNotificationsUpdate() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(NOTIFICATIONS_EVENT))
}

function notifySettingsUpdate() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(SETTINGS_EVENT))
}

function inferCategory(title: string) {
  const lower = title.toLowerCase()
  if (lower.includes("front")) return "Frontend"
  if (lower.includes("back")) return "Backend"
  if (lower.includes("full")) return "Full Stack"
  if (lower.includes("data")) return "Data"
  if (lower.includes("design")) return "Design"
  if (lower.includes("ai") || lower.includes("ml")) return "AI"
  if (lower.includes("game") || lower.includes("unity") || lower.includes("unreal")) return "Game Development"
  return "General"
}

const defaultSettings: AppSettings = {
  emailAlerts: true,
  inAppAlerts: true,
  weeklyDigest: true,
  shortlistDigest: true,
  candidateProfileVisibility: true,
  recruiterContactVisibility: true,
  compactCards: false,
  autoOpenSearchResults: true,
}

function buildSeedNotifications(): AppNotification[] {
  const now = Date.now()
  const jobs = getJobs()
  const latestJob = jobs[0]
  const latestOutreach = getOutreachHistory()[0]
  const latestApplication = seekerApplications[0]

  const generated: AppNotification[] = [
    {
      id: "notif-system-start",
      app: "JobSeek",
      title: "Workspace ready",
      message: "Recruiter and seeker dashboards are synced for search, notifications, and profile updates.",
      createdAt: new Date(now - 1000 * 60 * 22).toISOString(),
      read: false,
      channel: "system",
      deepLink: "/dashboard/search?q=workspace",
    },
  ]

  if (latestJob) {
    generated.push({
      id: "notif-job-openings",
      app: "Recruitment flow",
      title: `Vacancy live: ${latestJob.title}`,
      message: `${latestJob.vacancies} opening(s) active at ${latestJob.company}.`,
      createdAt: new Date(now - 1000 * 60 * 44).toISOString(),
      read: false,
      channel: "recruitment",
      deepLink: `/dashboard/recruiter/candidates?jobId=${latestJob.id}`,
      extraCount: latestJob.applicants > 1 ? Math.min(4, latestJob.applicants - 1) : undefined,
    })
  }

  if (latestOutreach) {
    generated.push({
      id: "notif-outreach-latest",
      app: "Outreach",
      title: `Mail sent to ${latestOutreach.candidateName}`,
      message: "Outreach history has been updated from the recruiter contact flow.",
      createdAt: latestOutreach.sentAt,
      read: false,
      channel: "recruitment",
      deepLink: `/dashboard/recruiter/contact?jobId=${latestOutreach.jobId}&candidateId=${latestOutreach.candidateId}`,
    })
  }

  if (latestApplication) {
    generated.push({
      id: "notif-seeker-application",
      app: "Applications",
      title: `${latestApplication.company} status: ${latestApplication.status}`,
      message: `${latestApplication.position} was updated in the seeker application tracker.`,
      createdAt: new Date(now - 1000 * 60 * 70).toISOString(),
      read: true,
      channel: "applications",
      deepLink: "/dashboard/seeker/applications",
    })
  }

  generated.push({
    id: "notif-profile-visibility",
    app: "Profile",
    title: "Profile visibility is on",
    message: "Recruiters can view social links, skill depth, and resume highlights you shared.",
    createdAt: new Date(now - 1000 * 60 * 95).toISOString(),
    read: true,
    channel: "profile",
    deepLink: "/dashboard/seeker/profile",
  })

  return generated.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getJobs(): JobPosting[] {
  const stored = safeRead<JobPosting[]>(JOBS_KEY, [])
  if (stored.length > 0) return stored
  safeWrite(JOBS_KEY, defaultJobs)
  return defaultJobs
}

export function getJobById(jobId: string) {
  return getJobs().find((job) => job.id === jobId) ?? null
}

export function getCandidateById(candidateId: string) {
  return defaultCandidates.find((candidate) => candidate.id === candidateId) ?? null
}

export function getActiveRecruiterJobId() {
  if (typeof window === "undefined") return ""
  return window.localStorage.getItem(ACTIVE_RECRUITER_JOB_KEY) ?? ""
}

export function setActiveRecruiterJobId(jobId: string) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(ACTIVE_RECRUITER_JOB_KEY, jobId)
}

export function getPreferredRecruiterJobId(jobs: JobPosting[], preferredJobId?: string) {
  if (!jobs.length) return ""

  if (preferredJobId && jobs.some((job) => job.id === preferredJobId)) {
    return preferredJobId
  }

  const activeId = getActiveRecruiterJobId()
  if (activeId && jobs.some((job) => job.id === activeId)) {
    return activeId
  }

  return jobs[0].id
}

export function addJob(input: {
  title: string
  company: string
  location: string
  type: string
  vacancies: number
  salary: string
  description: string
  requiredSkills: string[]
}) {
  const job: JobPosting = {
    id: `job-${Date.now()}`,
    title: input.title,
    company: input.company,
    location: input.location,
    type: input.type,
    vacancies: input.vacancies,
    applicants: 0,
    posted: "Just now",
    category: inferCategory(input.title),
    description: input.description,
    requiredSkills: input.requiredSkills,
    salary: input.salary,
  }

  const jobs = [...getJobs(), job]
  safeWrite(JOBS_KEY, jobs)
  setActiveRecruiterJobId(job.id)
  addNotification({
    app: "Recruitment flow",
    title: `New vacancy: ${job.title}`,
    message: `${job.company} added ${job.vacancies} opening(s) in ${job.location}.`,
    channel: "recruitment",
    deepLink: `/dashboard/recruiter/candidates?jobId=${job.id}`,
  })
  notifyJobsUpdate()
  return job
}

export function resetDemoData() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(JOBS_KEY)
  window.localStorage.removeItem(ACTIVE_RECRUITER_JOB_KEY)
  window.localStorage.removeItem(OUTREACH_KEY)
  window.localStorage.removeItem(RESUME_KEY)
  window.localStorage.removeItem(RESUME_META_KEY)
  window.localStorage.removeItem(NOTIFICATIONS_KEY)
  window.localStorage.removeItem(NOTIFICATIONS_BOOTSTRAPPED_KEY)
  window.localStorage.removeItem(NOTIFICATIONS_CLEARED_KEY)
  window.localStorage.removeItem(SETTINGS_KEY)
  notifyJobsUpdate()
  notifyOutreachUpdate()
  notifyNotificationsUpdate()
  notifySettingsUpdate()
  window.dispatchEvent(new Event(RESUME_EVENT))
}

export function useJobs() {
  const [jobs, setJobs] = useState<JobPosting[]>(() => getJobs())

  useEffect(() => {
    const handler = () => setJobs(getJobs())
    window.addEventListener(JOBS_EVENT, handler)
    return () => window.removeEventListener(JOBS_EVENT, handler)
  }, [])

  return jobs
}

export function getAppSettings() {
  const stored = safeRead<AppSettings | null>(SETTINGS_KEY, null)
  if (stored) return { ...defaultSettings, ...stored }
  safeWrite(SETTINGS_KEY, defaultSettings)
  return defaultSettings
}

export function updateAppSettings(input: Partial<AppSettings>) {
  const next = { ...getAppSettings(), ...input }
  safeWrite(SETTINGS_KEY, next)
  notifySettingsUpdate()
  return next
}

export function resetAppSettings() {
  safeWrite(SETTINGS_KEY, defaultSettings)
  notifySettingsUpdate()
  return defaultSettings
}

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => getAppSettings())

  useEffect(() => {
    const handler = () => setSettings(getAppSettings())
    window.addEventListener(SETTINGS_EVENT, handler)
    return () => window.removeEventListener(SETTINGS_EVENT, handler)
  }, [])

  return settings
}

export function getNotifications() {
  const stored = safeRead<AppNotification[] | null>(NOTIFICATIONS_KEY, null)
  if (stored) {
    return [...stored].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }
  if (typeof window !== "undefined") {
    const wasCleared = window.localStorage.getItem(NOTIFICATIONS_CLEARED_KEY) === "1"
    const wasBootstrapped = window.localStorage.getItem(NOTIFICATIONS_BOOTSTRAPPED_KEY) === "1"
    if (wasCleared || wasBootstrapped) {
      safeWrite(NOTIFICATIONS_KEY, [])
      return []
    }
  }
  const seeded = buildSeedNotifications()
  safeWrite(NOTIFICATIONS_KEY, seeded)
  if (typeof window !== "undefined") {
    window.localStorage.setItem(NOTIFICATIONS_BOOTSTRAPPED_KEY, "1")
    window.localStorage.removeItem(NOTIFICATIONS_CLEARED_KEY)
  }
  return seeded
}

export function addNotification(input: Omit<AppNotification, "id" | "createdAt" | "read"> & { read?: boolean }) {
  const next: AppNotification = {
    ...input,
    id: `notif-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    read: input.read ?? false,
  }
  const notifications = [next, ...getNotifications()]
  safeWrite(NOTIFICATIONS_KEY, notifications)
  if (typeof window !== "undefined") {
    window.localStorage.setItem(NOTIFICATIONS_BOOTSTRAPPED_KEY, "1")
    window.localStorage.removeItem(NOTIFICATIONS_CLEARED_KEY)
  }
  notifyNotificationsUpdate()
  return next
}

export function markNotificationRead(notificationId: string) {
  const next = getNotifications().map((item) => (item.id === notificationId ? { ...item, read: true } : item))
  safeWrite(NOTIFICATIONS_KEY, next)
  notifyNotificationsUpdate()
  return next
}

export function dismissNotification(notificationId: string) {
  const next = getNotifications().filter((item) => item.id !== notificationId)
  safeWrite(NOTIFICATIONS_KEY, next)
  notifyNotificationsUpdate()
  return next
}

export function markAllNotificationsRead() {
  const next = getNotifications().map((item) => ({ ...item, read: true }))
  safeWrite(NOTIFICATIONS_KEY, next)
  notifyNotificationsUpdate()
  return next
}

export function clearAllNotifications() {
  safeWrite(NOTIFICATIONS_KEY, [])
  if (typeof window !== "undefined") {
    window.localStorage.setItem(NOTIFICATIONS_BOOTSTRAPPED_KEY, "1")
    window.localStorage.setItem(NOTIFICATIONS_CLEARED_KEY, "1")
  }
  notifyNotificationsUpdate()
  return []
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getNotifications())

  useEffect(() => {
    const handler = () => setNotifications(getNotifications())
    window.addEventListener(NOTIFICATIONS_EVENT, handler)
    return () => window.removeEventListener(NOTIFICATIONS_EVENT, handler)
  }, [])

  return notifications
}

export function useUnreadNotificationCount() {
  const notifications = useNotifications()
  return useMemo(() => notifications.filter((item) => !item.read).length, [notifications])
}

const pageSearchEntries: Record<UserRole, { id: string; title: string; subtitle: string; href: string }[]> = {
  seeker: [
    { id: "p-seeker-overview", title: "Seeker overview", subtitle: "Dashboard summary", href: "/dashboard/seeker" },
    { id: "p-seeker-upload", title: "Resume intake", subtitle: "Upload and parse resume", href: "/dashboard/seeker/upload" },
    { id: "p-seeker-jobs", title: "Matched jobs", subtitle: "Ranked opportunities", href: "/dashboard/seeker/jobs" },
    { id: "p-seeker-apps", title: "Applications", subtitle: "Track your applications", href: "/dashboard/seeker/applications" },
    { id: "p-seeker-profile", title: "Profile", subtitle: "Public seeker profile", href: "/dashboard/seeker/profile" },
    { id: "p-shared-notifications-seeker", title: "Notifications", subtitle: "Alert center", href: "/dashboard/notifications" },
    { id: "p-shared-settings-seeker", title: "Settings", subtitle: "Workspace preferences", href: "/dashboard/settings" },
  ],
  recruiter: [
    { id: "p-rec-overview", title: "Recruiter overview", subtitle: "Hiring cockpit", href: "/dashboard/recruiter" },
    { id: "p-rec-post", title: "Post vacancy", subtitle: "Create job postings", href: "/dashboard/recruiter/post-job" },
    { id: "p-rec-candidates", title: "Candidates", subtitle: "AI-ranked candidate list", href: "/dashboard/recruiter/candidates" },
    { id: "p-rec-rankings", title: "Rankings", subtitle: "Leaderboard by role", href: "/dashboard/recruiter/rankings" },
    { id: "p-rec-mail", title: "Mail studio", subtitle: "Formal outreach", href: "/dashboard/recruiter/mail" },
    { id: "p-shared-notifications-recruiter", title: "Notifications", subtitle: "Alert center", href: "/dashboard/notifications" },
    { id: "p-shared-settings-recruiter", title: "Settings", subtitle: "Workspace preferences", href: "/dashboard/settings" },
  ],
}

function scoreSearchMatch(text: string, query: string) {
  const normalizedText = text.toLowerCase()
  const normalizedQuery = query.toLowerCase().trim()
  if (!normalizedQuery) return 0
  if (normalizedText === normalizedQuery) return 100
  if (normalizedText.startsWith(normalizedQuery)) return 78
  if (normalizedText.includes(normalizedQuery)) return 55

  const tokens = normalizedQuery.split(/\s+/).filter(Boolean)
  const tokenHits = tokens.filter((token) => normalizedText.includes(token)).length
  if (!tokens.length || tokenHits === 0) return 0
  return 24 + tokenHits * 10
}

export function searchWorkspace(query: string, role: UserRole, limit = 16): WorkspaceSearchResult[] {
  const q = query.trim()
  if (!q) return []

  const jobResults: WorkspaceSearchResult[] = getJobs().map((job) => {
    const score = Math.max(
      scoreSearchMatch(job.title, q),
      scoreSearchMatch(job.company, q),
      scoreSearchMatch(job.requiredSkills.join(" "), q)
    )
    return {
      id: `job-${job.id}`,
      type: "job",
      title: job.title,
      subtitle: `${job.company} - ${job.location}`,
      href: role === "recruiter" ? `/dashboard/recruiter/candidates?jobId=${job.id}` : `/dashboard/seeker/jobs`,
      score,
    }
  })

  const candidateResults: WorkspaceSearchResult[] =
    role === "recruiter"
      ? defaultCandidates.map((candidate) => {
          const score = Math.max(
            scoreSearchMatch(candidate.name, q),
            scoreSearchMatch(candidate.currentRole, q),
            scoreSearchMatch(candidate.skills.join(" "), q)
          )
          return {
            id: `candidate-${candidate.id}`,
            type: "candidate",
            title: candidate.name,
            subtitle: `${candidate.currentRole} - ${candidate.location}`,
            href: `/dashboard/recruiter/candidates/${candidate.id}`,
            score,
          }
        })
      : []

  const applicationResults: WorkspaceSearchResult[] =
    role === "seeker"
      ? seekerApplications.map((application) => {
          const score = Math.max(
            scoreSearchMatch(application.company, q),
            scoreSearchMatch(application.position, q),
            scoreSearchMatch(application.status, q)
          )
          return {
            id: `application-${application.id}`,
            type: "application",
            title: `${application.company} - ${application.position}`,
            subtitle: `Status: ${application.status}`,
            href: "/dashboard/seeker/applications",
            score,
          }
        })
      : []

  const notificationResults: WorkspaceSearchResult[] = getNotifications().map((notification) => {
    const score = Math.max(
      scoreSearchMatch(notification.title, q),
      scoreSearchMatch(notification.message, q),
      scoreSearchMatch(notification.app, q)
    )
    return {
      id: `notification-${notification.id}`,
      type: "notification",
      title: notification.title,
      subtitle: `${notification.app} - ${notification.message}`,
      href: notification.deepLink ?? "/dashboard/notifications",
      score,
    }
  })

  const pageResults: WorkspaceSearchResult[] = pageSearchEntries[role].map((page) => ({
    id: page.id,
    type: "page",
    title: page.title,
    subtitle: page.subtitle,
    href: page.href,
    score: Math.max(scoreSearchMatch(page.title, q), scoreSearchMatch(page.subtitle, q)),
  }))

  return [...pageResults, ...jobResults, ...candidateResults, ...applicationResults, ...notificationResults]
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

function yearsFromExperience(value: string) {
  const match = value.match(/\d+/)
  return match ? Number(match[0]) : 0
}

function computeScore(candidate: CandidateProfile, job: JobPosting) {
  const required = job.requiredSkills.map((skill) => skill.toLowerCase())
  const candidateSkills = candidate.skills.map((skill) => skill.toLowerCase())

  const matchedSkills = job.requiredSkills.filter((skill) => candidateSkills.includes(skill.toLowerCase()))
  const missingSkills = job.requiredSkills.filter((skill) => !candidateSkills.includes(skill.toLowerCase()))

  const skillScore = required.length ? (matchedSkills.length / required.length) * 7 : 5
  const experienceWeight = Math.min(2, yearsFromExperience(candidate.experience) / 5)
  const sentimentBoost =
    candidate.sentiment === "Confident" ? 0.6 : candidate.sentiment === "Analytical" ? 0.4 : candidate.sentiment === "Balanced" ? 0.2 : -0.3

  const rawScore = Math.min(10, Math.max(0, skillScore + experienceWeight + sentimentBoost))
  const score = Math.round(rawScore * 10) / 10

  return { score, matchedSkills, missingSkills }
}

export function getRankedCandidatesForJob(jobId: string) {
  const job = getJobs().find((item) => item.id === jobId)
  if (!job) return []

  const ranked = defaultCandidates
    .map((candidate) => {
      const scorecard = candidate.scorecard.find((item) => item.jobId === jobId)
      if (scorecard) {
        return { ...candidate, jobScore: scorecard }
      }

      const computed = computeScore(candidate, job)
      return {
        ...candidate,
        jobScore: {
          jobId,
          score: computed.score,
          ranking: 0,
          matchedSkills: computed.matchedSkills,
          missingSkills: computed.missingSkills,
          routeReason: `Matched ${computed.matchedSkills.length} of ${job.requiredSkills.length} required skills for ${job.title}.`,
        },
      }
    })
    .sort((a, b) => b.jobScore.score - a.jobScore.score)

  return ranked.map((candidate, index) => ({
    ...candidate,
    jobScore: { ...candidate.jobScore, ranking: index + 1 },
  }))
}

export function buildCandidateResumeText(params: {
  candidate: CandidateProfile
  job?: JobPosting | null
  score?: number
  matchedSkills?: string[]
  missingSkills?: string[]
}) {
  const { candidate, job, score, matchedSkills = [], missingSkills = [] } = params

  return [
    `${candidate.name}`,
    `${candidate.currentRole}`,
    `${candidate.location}`,
    `${candidate.email}`,
    "",
    "Professional Summary",
    `${candidate.summary}`,
    "",
    "Experience",
    `${candidate.experience}`,
    "",
    "Skills",
    candidate.skills.join(", "),
    "",
    "Strengths",
    candidate.strengths.join("; "),
    "",
    job ? `Target Vacancy: ${job.title} at ${job.company}` : "Target Vacancy: Not selected",
    typeof score === "number" ? `Match Score: ${score}/10` : "Match Score: N/A",
    matchedSkills.length ? `Matched Skills: ${matchedSkills.join(", ")}` : "Matched Skills: N/A",
    missingSkills.length ? `Missing Skills: ${missingSkills.join(", ")}` : "Missing Skills: None",
    "",
    "Generated by JobSeek demo resume exporter.",
  ].join("\n")
}

export function getRecruiterSummary() {
  const jobs = getJobs()
  const totalApplicants = jobs.reduce((sum, job) => sum + job.applicants, 0)
  const scores = jobs.flatMap((job) => getRankedCandidatesForJob(job.id).map((candidate) => candidate.jobScore.score))
  const averageScore = scores.length > 0 ? (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1) : "0.0"

  return {
    activeJobs: jobs.length,
    totalApplicants,
    averageScore,
    shortlistCount: jobs.reduce((sum, job) => sum + job.vacancies, 0),
  }
}

export function getTopCandidatesForOpenings(jobId: string) {
  const job = getJobs().find((item) => item.id === jobId)
  if (!job) return []
  return getRankedCandidatesForJob(jobId).slice(0, job.vacancies)
}

export function getOutreachHistory() {
  return safeRead<OutreachRecord[]>(OUTREACH_KEY, [])
}

export function addOutreachRecord(input: Omit<OutreachRecord, "id" | "sentAt">) {
  const record: OutreachRecord = {
    ...input,
    id: `outreach-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    sentAt: new Date().toISOString(),
  }

  const history = [record, ...getOutreachHistory()]
  safeWrite(OUTREACH_KEY, history)
  addNotification({
    app: "Outreach",
    title: `Outreach sent to ${record.candidateName}`,
    message: `Subject: ${record.subject}`,
    channel: "recruitment",
    deepLink: `/dashboard/recruiter/contact?jobId=${record.jobId}&candidateId=${record.candidateId}`,
  })
  notifyOutreachUpdate()
  return record
}

export function getOutreachHistoryForJob(jobId: string) {
  return getOutreachHistory().filter((item) => item.jobId === jobId)
}

export function getLatestOutreachForCandidate(jobId: string, candidateId: string) {
  return getOutreachHistory().find((item) => item.jobId === jobId && item.candidateId === candidateId) ?? null
}

export function useOutreachHistory() {
  const [history, setHistory] = useState<OutreachRecord[]>(() => getOutreachHistory())

  useEffect(() => {
    const handler = () => setHistory(getOutreachHistory())
    window.addEventListener(OUTREACH_EVENT, handler)
    return () => window.removeEventListener(OUTREACH_EVENT, handler)
  }, [])

  return history
}

export function getResumeExtraction(): ResumeExtraction | null {
  return safeRead<ResumeExtraction | null>(RESUME_KEY, null)
}

export function getResumeMeta(): ResumeMeta | null {
  return safeRead<ResumeMeta | null>(RESUME_META_KEY, null)
}

export function saveResumeExtraction(extraction: ResumeExtraction) {
  safeWrite(RESUME_KEY, extraction)
  addNotification({
    app: "Resume parser",
    title: `Resume parsed as ${extraction.routedCategory}`,
    message: `${extraction.extractedSkills.length} skill signal(s) detected with ${extraction.confidence}% confidence.`,
    channel: "profile",
    deepLink: "/dashboard/seeker/profile",
  })
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(RESUME_EVENT))
  }
  return extraction
}

export function saveResumeMeta(meta: ResumeMeta) {
  safeWrite(RESUME_META_KEY, meta)
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(RESUME_EVENT))
  }
  return meta
}

export function clearResumeExtraction() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(RESUME_KEY)
  window.dispatchEvent(new Event(RESUME_EVENT))
}

export function clearResumeMeta() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(RESUME_META_KEY)
  window.dispatchEvent(new Event(RESUME_EVENT))
}

export function useResumeExtraction() {
  const [extraction, setExtraction] = useState<ResumeExtraction | null>(() => getResumeExtraction())

  useEffect(() => {
    const handler = () => setExtraction(getResumeExtraction())
    window.addEventListener(RESUME_EVENT, handler)
    return () => window.removeEventListener(RESUME_EVENT, handler)
  }, [])

  return extraction
}

export function useResumeMeta() {
  const [meta, setMeta] = useState<ResumeMeta | null>(() => getResumeMeta())

  useEffect(() => {
    const handler = () => setMeta(getResumeMeta())
    window.addEventListener(RESUME_EVENT, handler)
    return () => window.removeEventListener(RESUME_EVENT, handler)
  }, [])

  return meta
}

function buildExtractionFromSignals(input: {
  category: string
  fileLabel: string
  confidence: number
  techSkills: ResumeSkill[]
  softSkills: ResumeSkill[]
  sections: { name: string; completion: string }[]
  sentiment: ResumeExtraction["sentiment"]
}): ResumeExtraction {
  return {
    routedCategory: input.category,
    documentType: input.fileLabel,
    confidence: input.confidence,
    extractedSkills: input.techSkills,
    softSkills: input.softSkills,
    sections: input.sections,
    sentiment: input.sentiment,
  }
}

function inferCategoryFromText(text: string) {
  if (text.includes("front") || text.includes("react") || text.includes("javascript") || text.includes("ui")) return "Frontend"
  if (text.includes("back") || text.includes("api") || text.includes("fastapi") || text.includes("django")) return "Backend"
  if (text.includes("full") || text.includes("node") || text.includes("express")) return "Full Stack"
  if (text.includes("data") || text.includes("analytics") || text.includes("sql") || text.includes("pipeline")) return "Data"
  if (text.includes("design") || text.includes("ux") || text.includes("figma")) return "Design"
  if (text.includes("ai") || text.includes("ml") || text.includes("llm") || text.includes("prompt")) return "AI"
  if (text.includes("game") || text.includes("unity") || text.includes("unreal") || text.includes("gameplay") || text.includes("godot")) return "Game Development"
  return "General"
}

function inferSentimentFromText(text: string) {
  if (text.includes("led") || text.includes("owned") || text.includes("shipped") || text.includes("delivered")) {
    return { label: "Confident" as const, score: 8.6 }
  }
  if (text.includes("analyzed") || text.includes("evaluated") || text.includes("research")) {
    return { label: "Analytical" as const, score: 8.1 }
  }
  if (text.includes("assisted") || text.includes("supported") || text.includes("helped")) {
    return { label: "Passive" as const, score: 6.4 }
  }
  return { label: "Balanced" as const, score: 7.6 }
}

function extractSkillsFromText(text: string) {
  const techKeywords = [
    "react",
    "typescript",
    "next.js",
    "nextjs",
    "javascript",
    "tailwind",
    "node",
    "python",
    "fastapi",
    "django",
    "postgres",
    "postgresql",
    "redis",
    "docker",
    "aws",
    "kubernetes",
    "sql",
    "spark",
    "airflow",
    "etl",
    "langchain",
    "openrouter",
    "prompt",
    "embeddings",
    "evaluation",
    "figma",
    "design systems",
    "unity",
    "unreal",
    "c++",
    "c#",
    "godot",
    "game",
    "gameplay",
    "shader",
    "blender",
    "maya",
    "opengl",
    "directx",
  ]
  const softKeywords = [
    "communication",
    "leadership",
    "team",
    "collaboration",
    "problem solving",
    "ownership",
    "mentoring",
    "documentation",
    "stakeholder",
    "presentation",
    "agile",
    "scrum",
    "time management",
    "adaptability",
  ]

  const collectMatches = (keywords: string[]) => {
    return keywords
      .map((keyword) => {
        const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        const useWordBoundary = /^[a-z0-9 ]+$/i.test(keyword)
        const regex = useWordBoundary ? new RegExp(`\\b${escaped}\\b`, "g") : new RegExp(escaped, "g")
        const count = (text.match(regex) || []).length
        return count > 0 ? { name: keyword, count } : null
      })
      .filter(Boolean) as { name: string; count: number }[]
  }

  const buildSkills = (matches: { name: string; count: number }[]) =>
    matches
      .sort((a, b) => b.count - a.count)
      .map((match, index) => ({
        name: match.name.replace(/\b\w/g, (char) => char.toUpperCase()),
        confidence: Math.min(96, 78 + match.count * 6 - index * 2),
      }))

  return {
    techSkills: buildSkills(collectMatches(techKeywords)),
    softSkills: buildSkills(collectMatches(softKeywords)),
  }
}

function buildSectionsFromText(text: string) {
  const sectionRules = [
    { name: "Contact and links", tokens: ["email", "phone", "linkedin", "github"] },
    { name: "Experience", tokens: ["experience", "work", "employment", "intern"] },
    { name: "Projects", tokens: ["project", "portfolio"] },
    { name: "Achievements", tokens: ["achievement", "award", "impact", "result"] },
    { name: "Education", tokens: ["education", "university", "college", "degree"] },
  ]

  return sectionRules.map((section) => {
    const hasSignal = section.tokens.some((token) => text.includes(token))
    return {
      name: section.name,
      completion: hasSignal ? "Strong" : "Needs attention",
    }
  })
}

export function parseResume(fileName: string, fileType: string, ocrText?: string) {
  const basis = `${fileName} ${ocrText ?? ""}`.toLowerCase()
  const category = inferCategoryFromText(basis)
  const label = fileType.includes("image") ? "Camera capture" : fileName
  const sentimentSignal = inferSentimentFromText(basis)
  const hasMetricsSignal = basis.includes("%") || basis.includes("kpi") || basis.includes("impact") || basis.includes("growth")
  const { techSkills, softSkills } = extractSkillsFromText(basis)
  const sections = buildSectionsFromText(basis).map((section) => {
    if (section.name === "Achievements" && hasMetricsSignal) {
      return { ...section, completion: "Quantified impact" }
    }
    return section
  })
  const confidenceBoost = ocrText ? Math.min(10, Math.floor(ocrText.length / 120)) : 2
  const confidence = Math.min(98, Math.max(70, 76 + confidenceBoost + techSkills.length * 2))
  const insights = [
    techSkills.length ? "Skills were detected and clustered by technical depth." : "No technical skills detected yet.",
    softSkills.length ? "Communication and collaboration cues were identified." : "Add collaboration cues to strengthen soft-skill signals.",
    "Add measurable outcomes to strengthen recruiter confidence.",
  ]

  return buildExtractionFromSignals({
    category,
    fileLabel: fileType.includes("image") ? `${label} - OCR applied` : label,
    confidence,
    techSkills,
    softSkills,
    sections,
    sentiment: {
      label: sentimentSignal.label,
      score: sentimentSignal.score,
      insights,
    },
  })
}
