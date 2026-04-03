"use client"

import { useEffect, useMemo, useState } from "react"
import type { CandidateProfile, JobPosting } from "@/lib/mock-data"
import { candidates as defaultCandidates, recruiterJobs as defaultJobs } from "@/lib/mock-data"

const JOBS_KEY = "jobseek_jobs"
const ACTIVE_RECRUITER_JOB_KEY = "jobseek_active_recruiter_job"
const OUTREACH_KEY = "jobseek_outreach_history"
const RESUME_KEY = "jobseek_resume"
const RESUME_META_KEY = "jobseek_resume_meta"
const JOBS_EVENT = "jobseek:jobs:update"
const OUTREACH_EVENT = "jobseek:outreach:update"
const RESUME_EVENT = "jobseek:resume:update"

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
  notifyJobsUpdate()
  notifyOutreachUpdate()
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
