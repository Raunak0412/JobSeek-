"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Briefcase, ScanSearch, Sparkles, Trophy, UploadCloud } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { seekerApplications, seekerJobMatches, seekerProfile, seekerResumeExtraction } from "@/lib/mock-data"

export default function SeekerDashboard() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth/login")
  }, [isLoading, router, user])

  if (isLoading) return null

  return (
    <div className="flex min-h-screen bg-[#07111f] text-white">
      <Sidebar type="seeker" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title="Seeker overview" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 space-y-6 p-4 lg:p-6">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <Badge className="rounded-full border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-cyan-100">Resume status: routed</Badge>
              <h2 className="mt-5 font-heading text-4xl font-semibold tracking-tight">Your profile is already positioned for recruiter review.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                The system has parsed your resume, extracted skills, classified you in the frontend bucket, and matched you against live vacancies with a score out of 10.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/dashboard/seeker/upload">
                  <Button className="rounded-full bg-cyan-400 text-slate-950 hover:bg-cyan-300">Refresh resume</Button>
                </Link>
                <Link href="/dashboard/seeker/jobs">
                  <Button variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                    Browse matched jobs
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "AI profile score", value: `${seekerProfile.score}/10`, icon: Trophy },
                { label: "Profile completion", value: `${seekerProfile.completion}%`, icon: Sparkles },
                { label: "Job matches", value: seekerJobMatches.length, icon: Briefcase },
                { label: "Applications", value: seekerApplications.length, icon: UploadCloud },
              ].map((item) => (
                <Card key={item.label} className="rounded-[1.75rem] border-white/10 bg-white/5">
                  <CardContent className="p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
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
              <Card className="rounded-[1.75rem] border-white/10 bg-[#081321]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-heading text-2xl">Resume extraction</CardTitle>
                    <p className="mt-1 text-sm text-slate-400">Agent router and sentiment analysis highlights from your latest upload.</p>
                  </div>
                  <Badge className="rounded-full border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
                    {seekerResumeExtraction.confidence}% confidence
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-400">Routed category</p>
                    <p className="mt-2 font-heading text-3xl font-semibold tracking-tight text-white">
                      {seekerResumeExtraction.routedCategory}
                    </p>
                    <p className="mt-2 text-sm text-slate-300">{seekerResumeExtraction.documentType}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {seekerResumeExtraction.extractedSkills.map((skill) => (
                      <Badge key={skill.name} className="rounded-full border-white/10 bg-white/5 text-slate-100">
                        {skill.name} · {skill.confidence}%
                      </Badge>
                    ))}
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                    <div className="flex items-start gap-3">
                      <ScanSearch className="mt-0.5 h-4 w-4 text-cyan-300" />
                      <p>{seekerResumeExtraction.sentiment.insights[0]}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="rounded-[1.75rem] border-white/10 bg-[#081321]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-heading text-2xl">Best current job match</CardTitle>
                    <p className="mt-1 text-sm text-slate-400">These roles are ranked using your extracted resume profile.</p>
                  </div>
                  <Link href="/dashboard/seeker/jobs">
                    <Button variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                      View all matches
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                  {seekerJobMatches.slice(0, 2).map((job) => (
                    <div key={job.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-white">{job.title}</p>
                          <p className="mt-1 text-sm text-slate-400">
                            {job.company} · {job.location} · {job.type}
                          </p>
                          <p className="mt-3 text-sm leading-6 text-slate-300">{job.summary}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-heading text-3xl font-semibold tracking-tight text-white">{job.match}%</p>
                          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">match</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link href="/dashboard/seeker/jobs">
                    <Button className="w-full rounded-full bg-cyan-400 text-slate-950 hover:bg-cyan-300">
                      Continue to applications
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
