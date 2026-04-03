"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, Loader2, MapPin, ScanSearch, Sparkles } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { useJobs, useResumeExtraction } from "@/lib/demo-store"

export default function SeekerJobsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [applied, setApplied] = useState<string[]>([])
  const [submitting, setSubmitting] = useState<string | null>(null)
  const resumeExtraction = useResumeExtraction()
  const jobsStore = useJobs()
  const rankingSignals = ["Skill overlap", "Experience strength", "Resume tone", "Format readiness"]
  const getVisibility = (match: number) => {
    if (match >= 92) return { label: "Top tier", className: "border-red-400/20 bg-red-400/10 text-red-100" }
    if (match >= 82) return { label: "Strong", className: "border-white/15 bg-white/10 text-white" }
    if (match >= 70) return { label: "Rising", className: "border-white/10 bg-white/5 text-slate-200" }
    return { label: "Exploratory", className: "border-rose-400/20 bg-rose-400/10 text-rose-100" }
  }

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth/login")
  }, [isLoading, router, user])

  const jobs = useMemo(() => {
    if (!resumeExtraction) return []
    const resumeSkills = resumeExtraction.extractedSkills.map((skill) => skill.name.toLowerCase())
    const relevant = jobsStore.filter((job) => job.category.toLowerCase() === resumeExtraction.routedCategory.toLowerCase())
    const scored = relevant.map((job) => {
      const matchedSkills = job.requiredSkills.filter((skill) => resumeSkills.includes(skill.toLowerCase()))
      const missingSkills = job.requiredSkills.filter((skill) => !resumeSkills.includes(skill.toLowerCase()))
      const match = job.requiredSkills.length ? Math.round((matchedSkills.length / job.requiredSkills.length) * 100) : 0
      return {
        ...job,
        match,
        matchedSkills,
        missingSkills,
        summary: matchedSkills.length
          ? `Matched ${matchedSkills.length} of ${job.requiredSkills.length} required skills.`
          : "No overlap yet. Add the required tools to improve fit.",
      }
    })
    return scored
      .sort((a, b) => b.match - a.match)
      .filter((job) => [job.title, job.company, ...job.matchedSkills].join(" ").toLowerCase().includes(query.toLowerCase()))
  }, [jobsStore, query, resumeExtraction])

  const handleApply = async (jobId: string) => {
    setSubmitting(jobId)
    await new Promise((resolve) => setTimeout(resolve, 900))
    setApplied((current) => [...current, jobId])
    setSubmitting(null)
    toast({
      title: "Application submitted",
      description: "Your application has been sent to the recruiter.",
    })
  }

  const handleContact = (jobTitle: string, company: string) => {
    toast({
      title: "Contact request sent",
      description: `A message was sent to ${company} about the ${jobTitle} role.`,
    })
  }

  if (isLoading) return null

  return (
    <div className="flex min-h-screen bg-[#150707] text-white">
      <Sidebar type="seeker" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title="Matched jobs" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 space-y-6 p-4 lg:p-6">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="font-heading text-4xl font-semibold tracking-tight">Jobs ranked against your resume profile</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Each listing includes the current match score, matched skills, and the missing signals recruiters will likely look for.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {rankingSignals.map((signal) => (
                <Badge key={signal} className="rounded-full border-white/10 bg-white/5 text-slate-200">
                  {signal}
                </Badge>
              ))}
            </div>
            <div className="mt-6">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, company, or skill"
                className="h-12 rounded-full border-white/10 bg-white/5 text-white placeholder:text-slate-500"
              />
            </div>
          </motion.div>

          <div className="space-y-4">
            {!resumeExtraction ? (
              <Card className="rounded-[1.75rem] border-white/10 bg-[#1b0b0b]">
                <CardContent className="p-8">
                  <Empty className="border-white/10 text-slate-200">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Sparkles className="h-5 w-5" />
                      </EmptyMedia>
                      <EmptyTitle>No resume uploaded</EmptyTitle>
                      <EmptyDescription>Upload a resume to see matched jobs based on your skills.</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button onClick={() => router.push("/dashboard/seeker/upload")} className="rounded-full bg-red-400 text-slate-950 hover:bg-red-300">
                        Upload resume
                      </Button>
                    </EmptyContent>
                  </Empty>
                </CardContent>
              </Card>
            ) : jobs.length === 0 ? (
              <Card className="rounded-[1.75rem] border-white/10 bg-[#1b0b0b]">
                <CardContent className="p-8">
                  <Empty className="border-white/10 text-slate-200">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Sparkles className="h-5 w-5" />
                      </EmptyMedia>
                      <EmptyTitle>No matches found</EmptyTitle>
                      <EmptyDescription>Try a different keyword or clear your search to see all ranked roles.</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button onClick={() => setQuery("")} className="rounded-full bg-red-400 text-slate-950 hover:bg-red-300">
                        Clear search
                      </Button>
                    </EmptyContent>
                  </Empty>
                </CardContent>
              </Card>
            ) : (
              jobs.map((job, index) => {
                const isApplied = applied.includes(job.id)
                const isSubmitting = submitting === job.id
                const visibility = getVisibility(job.match)
                return (
                  <motion.div key={job.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                    <Card className="rounded-[1.75rem] border-white/10 bg-[#1b0b0b]">
                      <CardContent className="p-5">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="font-heading text-2xl font-semibold tracking-tight text-white">{job.title}</h3>
                              <Badge className="rounded-full border-red-400/20 bg-red-400/10 text-red-100">{job.match}% match</Badge>
                              <Badge className={`rounded-full border px-2 py-0.5 ${visibility.className}`}>{visibility.label}</Badge>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                              <span>{job.company}</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {job.location}
                              </span>
                              <span>{job.type}</span>
                              <span>{job.salary}</span>
                            </div>
                            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">{job.summary}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {job.matchedSkills.map((skill) => (
                                <Badge key={skill} className="rounded-full border-red-400/20 bg-red-400/10 text-red-100">
                                  {skill}
                                </Badge>
                              ))}
                              {job.missingSkills.map((skill) => (
                                <Badge key={skill} className="rounded-full border-rose-400/20 bg-rose-400/10 text-rose-100">
                                  Missing: {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[220px]">
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                              <div className="flex items-start gap-3">
                                <ScanSearch className="mt-0.5 h-4 w-4 text-red-300" />
                                <p>{job.applicants} applicants already in this pipeline. Strong profile alignment improves recruiter visibility.</p>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleApply(job.id)}
                              disabled={isApplied || isSubmitting}
                              className="rounded-full bg-red-400 text-slate-950 hover:bg-red-300"
                            >
                              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isApplied ? <CheckCircle2 className="mr-2 h-4 w-4" /> : null}
                              {isApplied ? "Application sent" : "Apply now"}
                              {!isApplied ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handleContact(job.title, job.company)}
                              className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                            >
                              Contact recruiter
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
