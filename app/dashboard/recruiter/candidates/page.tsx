"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Download, Mail, Search, Sparkles } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { getRankedCandidatesForJob, useJobs } from "@/lib/demo-store"

export default function CandidatesPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [query, setQuery] = useState("")
  const jobs = useJobs()
  const [jobId, setJobId] = useState("")
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth/login")
  }, [isLoading, router, user])

  const rankedCandidates = useMemo(() => {
    if (!jobId) return []
    return getRankedCandidatesForJob(jobId).filter((candidate) =>
      [candidate!.name, candidate!.currentRole, ...candidate!.skills].join(" ").toLowerCase().includes(query.toLowerCase())
    )
  }, [jobId, query])

  const job = jobs.find((item) => item.id === jobId)

  useEffect(() => {
    if (!jobId && jobs.length) {
      setJobId(jobs[0].id)
    }
  }, [jobId, jobs])

  if (isLoading) return null

  return (
    <div className="flex min-h-screen bg-[#150707] text-white">
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
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search candidates or skills" className="h-12 rounded-full border-white/10 bg-white/5 text-white placeholder:text-slate-500" />
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-3">
                  <select value={jobId} onChange={(event) => setJobId(event.target.value)} className="bg-transparent text-sm text-white outline-none">
                    {jobs.map((item) => (
                      <option key={item.id} value={item.id} className="bg-[#1b0b0b]">
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.section>

          <Card className="rounded-[1.75rem] border-white/10 bg-[#1b0b0b]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
              <CardTitle className="font-heading text-2xl">{job?.title ?? "Select a vacancy"}</CardTitle>
                <p className="mt-1 text-sm text-slate-400">{job?.company} · {job?.vacancies ?? 0} openings · {rankedCandidates.length} strong matches</p>
              </div>
              <Badge className="rounded-full border-red-400/20 bg-red-400/10 text-red-100">
                {selected.length} selected
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {rankedCandidates.map((candidate, index) => (
                <div key={candidate!.id} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selected.includes(candidate!.id)}
                        onCheckedChange={() =>
                          setSelected((current) =>
                            current.includes(candidate!.id)
                              ? current.filter((item) => item !== candidate!.id)
                              : [...current, candidate!.id]
                          )
                        }
                        className="mt-1 border-white/20 data-[state=checked]:border-red-300 data-[state=checked]:bg-red-300"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-400/10 text-sm font-semibold text-white">
                            #{index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-white">{candidate!.name}</p>
                            <p className="text-sm text-slate-400">{candidate!.currentRole} · {candidate!.experience}</p>
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-slate-300">{candidate!.jobScore.routeReason}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {candidate!.jobScore.matchedSkills.map((skill) => (
                            <Badge key={skill} className="rounded-full border-red-400/20 bg-red-400/10 text-red-100">
                              {skill}
                            </Badge>
                          ))}
                          {candidate!.jobScore.missingSkills.map((skill) => (
                            <Badge key={skill} className="rounded-full border-rose-400/20 bg-rose-400/10 text-rose-100">
                              Missing: {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 xl:min-w-[220px] xl:items-end">
                      <div className="text-right">
                        <p className="font-heading text-4xl font-semibold tracking-tight text-white">{candidate!.jobScore.score}</p>
                        <p className="text-xs uppercase tracking-[0.24em] text-red-200">out of 10</p>
                        <p className="mt-2 text-sm text-slate-400">{candidate!.sentiment} tone</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                          <Download className="mr-2 h-4 w-4" />
                          Resume
                        </Button>
                        <Button className="rounded-full bg-red-400 text-slate-950 hover:bg-red-300">
                          <Mail className="mr-2 h-4 w-4" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="rounded-[1.6rem] border border-red-400/15 bg-red-400/10 p-4 text-sm leading-6 text-red-100">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4" />
                  <p>Selected candidates can be carried into the mail studio, where the top candidates for the opening are pre-filled automatically.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
