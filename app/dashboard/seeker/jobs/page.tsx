"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, Loader2, MapPin, ScanSearch } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { seekerJobMatches } from "@/lib/mock-data"

export default function SeekerJobsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [applied, setApplied] = useState<string[]>([])
  const [submitting, setSubmitting] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth/login")
  }, [isLoading, router, user])

  const jobs = useMemo(
    () =>
      seekerJobMatches.filter((job) =>
        [job.title, job.company, ...job.matchedSkills].join(" ").toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  )

  const handleApply = async (jobId: string) => {
    setSubmitting(jobId)
    await new Promise((resolve) => setTimeout(resolve, 900))
    setApplied((current) => [...current, jobId])
    setSubmitting(null)
  }

  if (isLoading) return null

  return (
    <div className="flex min-h-screen bg-[#07111f] text-white">
      <Sidebar type="seeker" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title="Matched jobs" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 space-y-6 p-4 lg:p-6">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="font-heading text-4xl font-semibold tracking-tight">Jobs ranked against your resume profile</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Each listing includes the current match score, matched skills, and the missing signals recruiters will likely look for.
            </p>
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
            {jobs.map((job, index) => {
              const isApplied = applied.includes(job.id)
              const isSubmitting = submitting === job.id
              return (
                <motion.div key={job.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <Card className="rounded-[1.75rem] border-white/10 bg-[#081321]">
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-heading text-2xl font-semibold tracking-tight text-white">{job.title}</h3>
                            <Badge className="rounded-full border-cyan-400/20 bg-cyan-400/10 text-cyan-100">{job.match}% match</Badge>
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
                              <Badge key={skill} className="rounded-full border-emerald-400/20 bg-emerald-400/10 text-emerald-100">
                                {skill}
                              </Badge>
                            ))}
                            {job.missingSkills.map((skill) => (
                              <Badge key={skill} className="rounded-full border-amber-400/20 bg-amber-400/10 text-amber-100">
                                Missing: {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[220px]">
                          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                            <div className="flex items-start gap-3">
                              <ScanSearch className="mt-0.5 h-4 w-4 text-cyan-300" />
                              <p>{job.applicants} applicants already in this pipeline. Strong profile alignment improves recruiter visibility.</p>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleApply(job.id)}
                            disabled={isApplied || isSubmitting}
                            className="rounded-full bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                          >
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isApplied ? <CheckCircle2 className="mr-2 h-4 w-4" /> : null}
                            {isApplied ? "Application sent" : "Apply now"}
                            {!isApplied ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}
