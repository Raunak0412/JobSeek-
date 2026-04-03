"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Mail, Radar, Sparkles, Trophy, Users } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { getRankedCandidatesForJob, getRecruiterSummary, resetDemoData, useJobs } from "@/lib/demo-store"

export default function RecruiterDashboard() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [resetting, setResetting] = useState(false)
  const jobs = useJobs()
  const summary = getRecruiterSummary()
  const featuredJob = jobs[0]
  const topCandidates = featuredJob ? getRankedCandidatesForJob(featuredJob.id).slice(0, 3) : []
  const featuredJobTitle = featuredJob?.title ?? "your vacancy"

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth/login")
  }, [isLoading, router, user])

  if (isLoading) return null

  return (
    <div className="flex min-h-screen bg-[#150707] text-white">
      <Sidebar type="recruiter" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title="Recruiter overview" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 space-y-6 p-4 lg:p-6">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <Badge className="rounded-full border-red-400/20 bg-red-400/10 px-3 py-1 text-red-100">Recruitment cockpit</Badge>
              <h2 className="mt-5 font-heading text-4xl font-semibold tracking-tight">
                Manage routed resumes, rankings, and shortlist mail from one place.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Every vacancy syncs with the ranker system. Candidate scores are generated against job descriptions, sentiment is surfaced, and the formal outreach layer is ready when your shortlist is locked.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/dashboard/recruiter/post-job">
                  <Button className="rounded-full bg-red-400 text-slate-950 hover:bg-red-300">Create vacancy</Button>
                </Link>
                <Link href="/dashboard/recruiter/rankings">
                  <Button variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                    Open ranker
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={async () => {
                    setResetting(true)
                    await new Promise((resolve) => setTimeout(resolve, 400))
                    resetDemoData()
                    setResetting(false)
                  }}
                  className="rounded-full text-red-200 hover:bg-white/10 hover:text-white"
                >
                  {resetting ? "Resetting demo data..." : "Reset demo data"}
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Active jobs", value: summary.activeJobs, icon: Radar },
                { label: "Applicants", value: summary.totalApplicants, icon: Users },
                { label: "Average score", value: `${summary.averageScore}/10`, icon: Trophy },
                { label: "Shortlist capacity", value: summary.shortlistCount, icon: Mail },
              ].map((item) => (
                <Card key={item.label} className="rounded-[1.75rem] border-white/10 bg-white/5">
                  <CardContent className="p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-400/10 text-red-200">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <p className="mt-5 text-3xl font-semibold tracking-tight text-white">{item.value}</p>
                    <p className="mt-2 text-sm text-slate-400">{item.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>

          <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
              <Card className="rounded-[1.75rem] border-white/10 bg-[#1b0b0b]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-heading text-2xl">Vacancy pipeline</CardTitle>
                    <p className="mt-1 text-sm text-slate-400">The AI router is already matching incoming resumes to these roles.</p>
                  </div>
                  <Link href="/dashboard/recruiter/post-job">
                    <Button variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                      Manage jobs
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-white">{job.title}</p>
                          <p className="mt-1 text-sm text-slate-400">
                            {job.company} · {job.location} · {job.vacancies} openings
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {job.requiredSkills.slice(0, 4).map((skill) => (
                              <Badge key={skill} className="rounded-full border-white/10 bg-white/5 text-slate-200">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-red-200">{job.applicants} applicants</p>
                          <p className="mt-1 text-xs text-slate-500">{job.posted}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="rounded-[1.75rem] border-white/10 bg-[#1b0b0b]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-heading text-2xl">Top candidates for {featuredJobTitle}</CardTitle>
                    <p className="mt-1 text-sm text-slate-400">Scores are generated directly against the selected job description.</p>
                  </div>
                  <Link href="/dashboard/recruiter/candidates">
                    <Button variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                      Open candidates
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topCandidates.map((candidate) => (
                    <div key={candidate!.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-400/10 text-sm font-semibold text-white">
                              {candidate!.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-white">{candidate!.name}</p>
                              <p className="truncate text-sm text-slate-400">{candidate!.currentRole}</p>
                            </div>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-300">{candidate!.jobScore.routeReason}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                          {candidate!.jobScore.matchedSkills.map((skill) => (
                            <Badge key={skill} className="rounded-full border-red-400/20 bg-red-400/10 text-red-100">
                              {skill}
                            </Badge>
                          ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-heading text-3xl font-semibold tracking-tight text-white">{candidate!.jobScore.score}</p>
                          <p className="text-xs uppercase tracking-[0.22em] text-red-200">out of 10</p>
                          <p className="mt-2 text-sm text-slate-400">{candidate!.sentiment}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-4 text-sm leading-6 text-red-100">
                    <div className="flex items-start gap-3">
                      <Sparkles className="mt-0.5 h-4 w-4" />
                      <p>The recruiter mail studio will auto-select the top {featuredJob?.vacancies ?? 0} candidates for this role when you open the outreach page.</p>
                    </div>
                  </div>

                  <Link href="/dashboard/recruiter/mail">
                    <Button className="w-full rounded-full bg-red-400 text-slate-950 hover:bg-red-300">
                      Continue to shortlist mail
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </section>
        </main>
      </div>
    </div>
  )
}
