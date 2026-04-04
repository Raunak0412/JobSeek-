"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Briefcase, FileText, ScanSearch, Sparkles, Trophy, UploadCloud } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import { seekerApplications } from "@/lib/mock-data"
import { useJobs, useResumeExtraction, useResumeMeta } from "@/lib/demo-store"

const seekerFlowSteps = [
  { title: "Resume intake", detail: "Upload or capture your resume to begin the routing pipeline.", icon: UploadCloud },
  { title: "AI parsing", detail: "Skills, experience, and tone are extracted and structured.", icon: ScanSearch },
  { title: "Match scoring", detail: "Open roles are ranked against your resume profile.", icon: Trophy },
  { title: "Apply and track", detail: "Use the seeker dashboard to follow every application.", icon: FileText },
]

export default function SeekerDashboard() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const resumeExtraction = useResumeExtraction()
  const resumeMeta = useResumeMeta()
  const jobs = useJobs()
  const readinessScore = resumeExtraction ? Math.round((resumeExtraction.confidence + resumeExtraction.sentiment.score * 10) / 2) : 0
  const skillsDetected = resumeExtraction?.extractedSkills.length ?? 0
  const profileScore = resumeExtraction ? Math.round(((resumeExtraction.confidence / 10 + resumeExtraction.sentiment.score) / 2) * 10) / 10 : 0
  const sectionStrength = resumeExtraction?.sections.filter((section) => !section.completion.toLowerCase().includes("needs")).length ?? 0
  const profileCompletion = resumeExtraction?.sections.length ? Math.round((sectionStrength / resumeExtraction.sections.length) * 100) : 0

  const jobMatches = useMemo(() => {
    if (!resumeExtraction) return []
    const resumeSkills = resumeExtraction.extractedSkills.map((skill) => skill.name.toLowerCase())
    const relevantJobs = jobs.filter((job) => job.category.toLowerCase() === resumeExtraction.routedCategory.toLowerCase())
    return relevantJobs
      .map((job) => {
        const matched = job.requiredSkills.filter((skill) => resumeSkills.includes(skill.toLowerCase()))
        const missing = job.requiredSkills.filter((skill) => !resumeSkills.includes(skill.toLowerCase()))
        const match = job.requiredSkills.length ? Math.round((matched.length / job.requiredSkills.length) * 100) : 0
        return {
          ...job,
          match,
          matchedSkills: matched,
          missingSkills: missing,
          summary: matched.length
            ? `Matched ${matched.length} of ${job.requiredSkills.length} required skills for ${job.title}.`
            : "No skill overlap yet. Add relevant tools to increase ranking.",
        }
      })
      .sort((a, b) => b.match - a.match)
  }, [jobs, resumeExtraction])

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth/login")
  }, [isLoading, router, user])

  if (isLoading) return null

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <Sidebar type="seeker" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title="Seeker overview" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 space-y-6 p-4 lg:p-6">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <Badge className="rounded-full border-violet-400/20 bg-violet-400/10 px-3 py-1 text-violet-100">
                {resumeMeta ? "Resume status: parsed" : "Resume status: demo"}
              </Badge>
              <h2 className="mt-5 font-heading text-4xl font-semibold tracking-tight">
                {resumeExtraction ? "Your profile is already positioned for recruiter review." : "Upload a resume to activate your profile."}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                {resumeExtraction
                  ? `The system has parsed your resume, extracted skills, classified you in the ${resumeExtraction.routedCategory.toLowerCase()} bucket, and matched you against live vacancies with a score out of 10.`
                  : "Once a resume is uploaded, parsing, skills extraction, and job matching will appear here."}
              </p>
              {resumeMeta ? (
                <p className="mt-3 text-xs uppercase tracking-[0.22em] text-violet-200/70">Latest resume: {resumeMeta.fileName}</p>
              ) : null}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/dashboard/seeker/upload">
                  <Button className="rounded-full bg-violet-500 text-white hover:bg-violet-400">Refresh resume</Button>
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
                { label: "AI profile score", value: `${profileScore}/10`, icon: Trophy },
                { label: "Profile completion", value: `${profileCompletion}%`, icon: Sparkles },
                { label: "Job matches", value: jobMatches.length, icon: Briefcase },
                { label: "Applications", value: seekerApplications.length, icon: UploadCloud },
              ].map((item) => (
                <Card key={item.label} className="rounded-[1.75rem] border-white/10 bg-white/5">
                  <CardContent className="p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-200">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <p className="mt-5 text-3xl font-semibold tracking-tight text-white">{item.value}</p>
                    <p className="mt-2 text-sm text-slate-400">{item.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <Card className="rounded-[1.75rem] border-white/10 bg-[#171717]">
              <CardHeader>
                <CardTitle className="font-heading text-2xl">Your flow, live</CardTitle>
                <p className="text-sm text-slate-400">Every stage your resume passes through before recruiters see it.</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {seekerFlowSteps.map((step) => (
                  <div key={step.title} className="flex items-start gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-200">
                      <step.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{step.title}</p>
                      <p className="mt-1 text-sm text-slate-300">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-[1.75rem] border-white/10 bg-[#171717]">
              <CardHeader>
                <CardTitle className="font-heading text-2xl">Ranking readiness</CardTitle>
                <p className="text-sm text-slate-400">A quick view of how prepared your profile is for ranking.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="text-slate-300">Readiness score</span>
                    <span className="text-violet-200">{readinessScore}%</span>
                  </div>
                  <Progress value={readinessScore} className="h-2 bg-white/10" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-violet-200/80">Category</p>
                    <p className="mt-2 font-heading text-2xl font-semibold text-white">{resumeExtraction?.routedCategory ?? "Not parsed"}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-violet-200/80">Skills detected</p>
                    <p className="mt-2 font-heading text-2xl font-semibold text-white">{skillsDetected}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-violet-200/80">Confidence</p>
                    <p className="mt-2 font-heading text-2xl font-semibold text-white">{resumeExtraction?.confidence ?? 0}%</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-violet-200/80">Tone</p>
                    <p className="mt-2 font-heading text-2xl font-semibold text-white">{resumeExtraction?.sentiment.label ?? "Pending"}</p>
                  </div>
                </div>
                <div className="rounded-[1.6rem] border border-violet-400/15 bg-violet-400/10 p-4 text-sm leading-6 text-violet-100">
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-4 w-4" />
                    <p>Boost readiness by adding one flagship project with measurable impact.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
              <Card className="rounded-[1.75rem] border-white/10 bg-[#171717]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-heading text-2xl">Resume extraction</CardTitle>
                    <p className="mt-1 text-sm text-slate-400">Agent router and sentiment analysis highlights from your latest upload.</p>
                  </div>
                  <Badge className="rounded-full border-violet-400/20 bg-violet-400/10 text-violet-100">
                    {resumeExtraction?.confidence ?? 0}% confidence
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-400">Routed category</p>
                    <p className="mt-2 font-heading text-3xl font-semibold tracking-tight text-white">
                      {resumeExtraction?.routedCategory ?? "Not parsed"}
                    </p>
                    <p className="mt-2 text-sm text-slate-300">{resumeExtraction?.documentType ?? "No resume uploaded"}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resumeExtraction?.extractedSkills.length ? (
                      resumeExtraction.extractedSkills.map((skill) => (
                        <Badge key={skill.name} className="rounded-full border-white/10 bg-white/5 text-slate-100">
                          {skill.name} - {skill.confidence}%
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">No skills parsed yet.</span>
                    )}
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                    <div className="flex items-start gap-3">
                      <ScanSearch className="mt-0.5 h-4 w-4 text-violet-300" />
                      <p>{resumeExtraction?.sentiment.insights?.[0] ?? "Upload a resume to see insights here."}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="rounded-[1.75rem] border-white/10 bg-[#171717]">
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
                  {jobMatches.length ? (
                    jobMatches.slice(0, 2).map((job) => (
                      <div key={job.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-white">{job.title}</p>
                            <p className="mt-1 text-sm text-slate-400">{job.company} - {job.location} - {job.type}</p>
                            <p className="mt-3 text-sm leading-6 text-slate-300">{job.summary}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-heading text-3xl font-semibold tracking-tight text-white">{job.match}%</p>
                            <p className="text-xs uppercase tracking-[0.24em] text-violet-200">match</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                      {resumeExtraction ? "No relevant vacancies found yet for this resume." : "Upload a resume to see matched roles here."}
                    </div>
                  )}
                  <Link href="/dashboard/seeker/jobs">
                    <Button className="w-full rounded-full bg-violet-500 text-white hover:bg-violet-400">
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

