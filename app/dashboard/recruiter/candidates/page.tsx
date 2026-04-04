"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Download, ExternalLink, Loader2, Mail, Sparkles } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/lib/auth-context"
import {
  buildCandidateResumeText,
  getPreferredRecruiterJobId,
  getRankedCandidatesForJob,
  setActiveRecruiterJobId,
  useOutreachHistory,
  useJobs,
} from "@/lib/demo-store"

export default function CandidatesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [query, setQuery] = useState("")
  const jobs = useJobs()
  const outreachHistory = useOutreachHistory()
  const [jobId, setJobId] = useState("")
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth/login")
  }, [isLoading, router, user])

  const preferredJobId = searchParams.get("jobId") ?? ""

  useEffect(() => {
    if (!jobs.length) return

    const currentValid = jobId && jobs.some((job) => job.id === jobId)
    if (currentValid) return

    const nextJobId = getPreferredRecruiterJobId(jobs, preferredJobId)
    if (!nextJobId) return

    setJobId(nextJobId)
    setActiveRecruiterJobId(nextJobId)
  }, [jobId, jobs, preferredJobId])

  const job = jobs.find((item) => item.id === jobId)

  const rankedCandidates = useMemo(() => {
    if (!jobId) return []

    const matchingQuery = getRankedCandidatesForJob(jobId).filter((candidate) =>
      [candidate.name, candidate.currentRole, ...candidate.skills].join(" ").toLowerCase().includes(query.toLowerCase())
    )

    const relevantMatches = matchingQuery.filter(
      (candidate) =>
        candidate.jobScore.matchedSkills.length > 0 ||
        candidate.jobScore.score >= 7 ||
        (job?.category ? candidate.category.toLowerCase() === job.category.toLowerCase() : false)
    )

    return relevantMatches.length ? relevantMatches : matchingQuery
  }, [job?.category, jobId, query])

  const outreachByCandidate = useMemo(() => {
    const map = new Map<string, string>()
    outreachHistory.forEach((entry) => {
      if (entry.jobId === jobId && !map.has(entry.candidateId)) {
        map.set(entry.candidateId, entry.sentAt)
      }
    })
    return map
  }, [jobId, outreachHistory])

  const handleDownloadResume = (candidate: (typeof rankedCandidates)[number]) => {
    const text = buildCandidateResumeText({
      candidate,
      job,
      score: candidate.jobScore.score,
      matchedSkills: candidate.jobScore.matchedSkills,
      missingSkills: candidate.jobScore.missingSkills,
    })

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
    const blobUrl = URL.createObjectURL(blob)

    const anchor = document.createElement("a")
    anchor.href = blobUrl
    anchor.download = `${candidate.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-resume.txt`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)

    URL.revokeObjectURL(blobUrl)
  }

  const openCandidateProfile = (candidateId: string) => {
    const query = jobId ? `?jobId=${jobId}` : ""
    router.push(`/dashboard/recruiter/candidates/${candidateId}${query}`)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#121212] text-slate-300">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm">
          <Loader2 className="h-4 w-4 animate-spin text-violet-300" />
          Loading candidates...
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <Sidebar type="recruiter" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title="Candidates" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 space-y-6 p-4 lg:p-6">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <h2 className="font-heading text-4xl font-semibold tracking-tight">AI-ranked candidates by vacancy</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  Select a vacancy to see routed resumes, candidate scores, missing skills, and shortlist-ready profiles.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search candidates or skills"
                  className="h-12 rounded-full border-white/10 bg-white/5 text-white placeholder:text-slate-500"
                />
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-3">
                  <select
                    value={jobId}
                    onChange={(event) => {
                      const nextJobId = event.target.value
                      setJobId(nextJobId)
                      setSelected([])
                      setActiveRecruiterJobId(nextJobId)
                    }}
                    className="bg-transparent text-sm text-white outline-none"
                  >
                    {jobs.map((item) => (
                      <option key={item.id} value={item.id} className="bg-[#171717]">
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.section>

          <Card className="rounded-[1.75rem] border-white/10 bg-[#171717]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-heading text-2xl">{job?.title ?? "Select a vacancy"}</CardTitle>
                <p className="mt-1 text-sm text-slate-400">
                  {job?.company ?? "-"} - {job?.vacancies ?? 0} openings - {rankedCandidates.length} strong matches
                </p>
              </div>
              <Badge className="rounded-full border-violet-400/20 bg-violet-400/10 text-violet-100">{selected.length} selected</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea className="h-[min(66vh,720px)] pr-4">
                <div className="space-y-4 pr-1">
                  {rankedCandidates.map((candidate, index) => (
                    <div key={candidate.id} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={selected.includes(candidate.id)}
                            onCheckedChange={() =>
                              setSelected((current) =>
                                current.includes(candidate.id) ? current.filter((item) => item !== candidate.id) : [...current, candidate.id]
                              )
                            }
                            className="mt-1 border-white/20 data-[state=checked]:border-violet-300 data-[state=checked]:bg-violet-300"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-400/10 text-sm font-semibold text-white">#{index + 1}</div>
                              <div>
                                <button
                                  type="button"
                                  onClick={() => openCandidateProfile(candidate.id)}
                                  className="inline-flex items-center gap-1 font-medium text-white transition hover:text-violet-200"
                                >
                                  {candidate.name}
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </button>
                                <p className="text-sm text-slate-400">
                                  {candidate.currentRole} - {candidate.experience}
                                </p>
                              </div>
                            </div>
                            <p className="mt-3 text-sm leading-7 text-slate-300">{candidate.jobScore.routeReason}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {candidate.jobScore.matchedSkills.map((skill) => (
                                <Badge key={skill} className="rounded-full border-violet-400/20 bg-violet-400/10 text-violet-100">
                                  {skill}
                                </Badge>
                              ))}
                              {candidate.jobScore.missingSkills.map((skill) => (
                                <Badge key={skill} className="rounded-full border-lime-300/35 bg-lime-300/15 text-lime-100">
                                  Missing: {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 xl:min-w-[220px] xl:items-end">
                          <div className="text-right">
                            <p className="font-heading text-4xl font-semibold tracking-tight text-white">{candidate.jobScore.score}</p>
                            <p className="text-xs uppercase tracking-[0.24em] text-violet-200">out of 10</p>
                            <p className="mt-2 text-sm text-slate-400">{candidate.sentiment} tone</p>
                          </div>
                          <div className="flex flex-wrap gap-2 xl:justify-end">
                            <Button
                              variant="outline"
                              className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                              onClick={() => openCandidateProfile(candidate.id)}
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Profile
                            </Button>
                            <Button
                              variant="outline"
                              className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                              onClick={() => handleDownloadResume(candidate)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Resume
                            </Button>
                            <Button
                              className="rounded-full bg-violet-500 text-white hover:bg-violet-400"
                              onClick={() => {
                                const query = jobId ? `?jobId=${jobId}&candidateId=${candidate.id}` : `?candidateId=${candidate.id}`
                                router.push(`/dashboard/recruiter/contact${query}`)
                              }}
                            >
                              <Mail className="mr-2 h-4 w-4" />
                              Contact
                            </Button>
                          </div>
                          {outreachByCandidate.has(candidate.id) ? (
                            <p className="text-xs text-violet-200">
                              Contacted on {new Date(outreachByCandidate.get(candidate.id) ?? "").toLocaleString()}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                  {rankedCandidates.length === 0 ? (
                    <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-6 text-sm text-slate-400">
                      No candidates matched your search. Try another skill keyword or change vacancy.
                    </div>
                  ) : null}
                </div>
              </ScrollArea>

              <div className="rounded-[1.6rem] border border-violet-400/15 bg-violet-400/10 p-4 text-sm leading-6 text-violet-100">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4" />
                  <p>Selected candidates can be carried into the mail studio, where top candidates for the opening are pre-filled automatically.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

