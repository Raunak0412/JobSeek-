"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Brain, Mail, Radar, Sparkles, Target, Trophy, Users, Workflow } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { WorkflowTree } from "@/components/dashboard/workflow-tree"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { getPreferredRecruiterJobId, getRankedCandidatesForJob, getRecruiterSummary, resetDemoData, useJobs } from "@/lib/demo-store"

export default function RecruiterDashboard() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [resetting, setResetting] = useState(false)
  const jobs = useJobs()
  const summary = getRecruiterSummary()
  const featuredJobId = getPreferredRecruiterJobId(jobs)
  const featuredJob = jobs.find((job) => job.id === featuredJobId) ?? jobs[0]
  const topCandidates = featuredJob ? getRankedCandidatesForJob(featuredJob.id).slice(0, 4) : []
  const featuredJobTitle = featuredJob?.title ?? "your vacancy"

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth/login")
  }, [isLoading, router, user])

  if (isLoading) return null

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <Sidebar type="recruiter" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title="Recruiter overview" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 space-y-6 p-4 lg:p-6">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <Badge className="rounded-full border-violet-400/20 bg-violet-400/10 px-3 py-1 text-violet-100">Recruitment cockpit</Badge>
              <h2 className="mt-5 font-heading text-4xl font-semibold tracking-tight">Manage routed resumes, rankings, and shortlist mail from one place.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Every vacancy syncs with the ranker system. Candidate scores are generated against job descriptions, sentiment is surfaced, and the formal outreach layer is ready when your shortlist is locked.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/dashboard/recruiter/post-job">
                  <Button className="rounded-full bg-violet-500 text-white hover:bg-violet-400">Create vacancy</Button>
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
                  className="rounded-full text-violet-200 hover:bg-white/10 hover:text-white"
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
                <Card key={item.label} className="group relative overflow-hidden rounded-[1.75rem] border-white/10 bg-[#171717]">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(248,113,113,0.22),transparent_45%),radial-gradient(circle_at_85%_85%,rgba(251,146,60,0.16),transparent_35%)] opacity-70" />
                  <CardContent className="relative p-5 transition duration-300 group-hover:[transform:translateY(-4px)]">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-violet-400/10 text-violet-200 shadow-[0_10px_30px_rgba(139,92,246,0.2)]">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <p className="mt-5 text-3xl font-semibold tracking-tight text-white">{item.value}</p>
                    <p className="mt-2 text-sm text-slate-400">{item.label}</p>
                    <div className="mt-4 h-1.5 w-20 rounded-full bg-gradient-to-r from-violet-300 to-lime-300/80" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
            <Card className="rounded-[1.75rem] border-white/10 bg-[#171717]">
              <CardHeader>
                <CardTitle className="font-heading text-2xl">Overview workbench</CardTitle>
                <p className="text-sm text-slate-400">Tabbed cards for graph flow, vacancy board, and shortlist execution.</p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="graph" className="space-y-4">
                  <TabsList className="h-auto flex-wrap rounded-full border border-white/10 bg-white/5 p-1">
                    <TabsTrigger value="graph" className="rounded-full px-4 text-slate-200 data-[state=active]:bg-violet-400/15 data-[state=active]:text-violet-100">
                      Workflow graph
                    </TabsTrigger>
                    <TabsTrigger value="vacancies" className="rounded-full px-4 text-slate-200 data-[state=active]:bg-violet-400/15 data-[state=active]:text-violet-100">
                      Vacancy board
                    </TabsTrigger>
                    <TabsTrigger value="shortlist" className="rounded-full px-4 text-slate-200 data-[state=active]:bg-violet-400/15 data-[state=active]:text-violet-100">
                      Shortlist radar
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="graph" className="space-y-4">
                    <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                      <WorkflowTree />
                      <div className="space-y-3">
                        {[
                          {
                            icon: Workflow,
                            title: "Agent flow connected",
                            detail: "Resume intake, role routing, score computation, and notifications now operate as one linked execution tree.",
                          },
                          {
                            icon: Brain,
                            title: "Decision nodes active",
                            detail: "Each node emits recruiter-facing signals: match confidence, missing skills, and sentiment context.",
                          },
                          {
                            icon: Target,
                            title: "Action endpoints ready",
                            detail: "Every branch leads to concrete actions: profile review, direct contact, or shortlist mail handoff.",
                          },
                        ].map((signal) => (
                          <div key={signal.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="inline-flex items-center gap-2 text-sm font-medium text-white">
                              <signal.icon className="h-4 w-4 text-violet-300" />
                              {signal.title}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-300">{signal.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="vacancies">
                    <ScrollArea className="h-[min(62vh,620px)] pr-4">
                      <div className="space-y-3 pr-1">
                        {jobs.map((job) => (
                          <div key={job.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <p className="font-medium text-white">{job.title}</p>
                                <p className="mt-1 text-sm text-slate-400">{job.company} - {job.location} - {job.vacancies} openings</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {job.requiredSkills.slice(0, 5).map((skill) => (
                                    <Badge key={skill} className="rounded-full border-white/10 bg-black/20 text-slate-200">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="text-left sm:text-right">
                                <p className="text-sm font-medium text-violet-200">{job.applicants} applicants</p>
                                <p className="mt-1 text-xs text-slate-500">Posted {job.posted}</p>
                                <Link href={`/dashboard/recruiter/candidates?jobId=${job.id}`}>
                                  <Button variant="outline" size="sm" className="mt-3 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                                    Open ranked list
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="shortlist" className="space-y-4">
                    <p className="text-sm text-slate-400">Top candidates currently routed for <span className="text-violet-200">{featuredJobTitle}</span>.</p>
                    <div className="space-y-3">
                      {topCandidates.map((candidate) => (
                        <div key={candidate.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="font-medium text-white">{candidate.name}</p>
                              <p className="mt-1 text-sm text-slate-400">{candidate.currentRole}</p>
                              <p className="mt-2 text-sm leading-6 text-slate-300">{candidate.jobScore.routeReason}</p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {candidate.jobScore.matchedSkills.map((skill) => (
                                  <Badge key={skill} className="rounded-full border-violet-400/20 bg-violet-400/10 text-violet-100">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="text-left sm:text-right">
                              <p className="font-heading text-3xl font-semibold tracking-tight text-white">{candidate.jobScore.score}</p>
                              <p className="text-xs uppercase tracking-[0.22em] text-violet-200">score</p>
                              <p className="mt-2 text-sm text-slate-400">{candidate.sentiment} tone</p>
                              <Link href={`/dashboard/recruiter/candidates/${candidate.id}?jobId=${featuredJob?.id ?? ""}`}>
                                <Button variant="outline" size="sm" className="mt-3 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                                  Open profile
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-2xl border border-violet-400/20 bg-violet-400/10 p-4 text-sm leading-6 text-violet-100">
                      <div className="flex items-start gap-3">
                        <Sparkles className="mt-0.5 h-4 w-4" />
                        <p>The mail studio can instantly use these ranked candidates based on vacancy openings.</p>
                      </div>
                    </div>

                    <Link href={featuredJob ? `/dashboard/recruiter/mail?jobId=${featuredJob.id}` : "/dashboard/recruiter/mail"}>
                      <Button className="w-full rounded-full bg-violet-500 text-white hover:bg-violet-400">
                        Continue to shortlist mail
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.section>
        </main>
      </div>
    </div>
  )
}

