"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Crown, Medal, Search, Trophy } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { getRankedCandidatesForJob, useJobs } from "@/lib/demo-store"

export default function RankingsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const jobs = useJobs()
  const [jobId, setJobId] = useState("")
  const [query, setQuery] = useState("")

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth/login")
  }, [isLoading, router, user])

  const rankings = jobId
    ? getRankedCandidatesForJob(jobId).filter((candidate) =>
      candidate!.name.toLowerCase().includes(query.toLowerCase())
    )
    : []

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
        <Header title="Rankings" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 space-y-6 p-4 lg:p-6">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <Badge className="rounded-full border-red-400/20 bg-red-400/10 text-red-100">Dedicated ranker page</Badge>
                <h2 className="mt-5 font-heading text-4xl font-semibold tracking-tight">Candidate leaderboard scored directly against the job description.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  This page is the dedicated ranker system view. Every candidate appears with a score out of 10, route reason, and sentiment signal.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search candidate" className="h-12 rounded-full border-white/10 bg-white/5 text-white placeholder:text-slate-500" />
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-3">
                  <select value={jobId} onChange={(event) => setJobId(event.target.value)} className="bg-transparent text-sm text-white outline-none">
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id} className="bg-[#1b0b0b]">
                        {job.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.section>

          <Card className="rounded-[1.75rem] border-white/10 bg-[#1b0b0b]">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Leaderboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {rankings.map((candidate, index) => (
                <div key={candidate!.id} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-400/10 text-red-100">
                        {index === 0 ? <Crown className="h-5 w-5" /> : index === 1 ? <Medal className="h-5 w-5" /> : <span className="font-semibold">#{index + 1}</span>}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="font-medium text-white">{candidate!.name}</p>
                          <Badge className="rounded-full border-white/10 bg-white/5 text-slate-200">{candidate!.sentiment}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-slate-400">{candidate!.currentRole} · {candidate!.location}</p>
                        <p className="mt-3 text-sm leading-7 text-slate-300">{candidate!.jobScore.routeReason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-heading text-4xl font-semibold tracking-tight text-white">{candidate!.jobScore.score}</p>
                        <p className="text-xs uppercase tracking-[0.24em] text-red-200">out of 10</p>
                      </div>
                      <div className="h-16 w-px bg-white/10" />
                      <div className="flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-sm text-rose-100">
                        <Trophy className="h-4 w-4" />
                        Rank {candidate!.jobScore.ranking}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
