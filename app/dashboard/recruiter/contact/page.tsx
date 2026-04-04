"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, Send } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import {
  addOutreachRecord,
  getCandidateById,
  getLatestOutreachForCandidate,
  getPreferredRecruiterJobId,
  getRankedCandidatesForJob,
  setActiveRecruiterJobId,
  useOutreachHistory,
  useJobs,
} from "@/lib/demo-store"
import { buildOfferTemplate } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function RecruiterContactPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { user, isLoading } = useAuth()
  const jobs = useJobs()
  const outreachHistory = useOutreachHistory()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [jobId, setJobId] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [isSending, setIsSending] = useState(false)

  const preferredJobId = searchParams.get("jobId") ?? ""
  const candidateId = searchParams.get("candidateId") ?? ""

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth/login")
  }, [isLoading, router, user])

  useEffect(() => {
    if (!jobs.length) return

    const currentValid = jobId && jobs.some((job) => job.id === jobId)
    if (currentValid) return

    const nextJobId = getPreferredRecruiterJobId(jobs, preferredJobId)
    if (!nextJobId) return

    setJobId(nextJobId)
    setActiveRecruiterJobId(nextJobId)
  }, [jobId, jobs, preferredJobId])

  const job = jobs.find((item) => item.id === jobId) ?? null
  const rankedCandidates = useMemo(() => (jobId ? getRankedCandidatesForJob(jobId) : []), [jobId])

  const candidate = useMemo(() => {
    if (!candidateId) return null
    return rankedCandidates.find((item) => item.id === candidateId) ?? getCandidateById(candidateId)
  }, [candidateId, rankedCandidates])

  const candidateScore = rankedCandidates.find((item) => item.id === candidateId)?.jobScore ?? null
  const latestOutreach = useMemo(() => {
    if (!jobId || !candidateId) return null
    return getLatestOutreachForCandidate(jobId, candidateId)
  }, [candidateId, jobId, outreachHistory])

  useEffect(() => {
    if (!candidate || !job) return
    setSubject(`Shortlisted: ${job.title} at ${job.company}`)
    setBody(buildOfferTemplate(candidate.name, job.title, job.company))
  }, [candidate, job])

  const handleSend = async () => {
    if (!candidate || !job) return

    setIsSending(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    addOutreachRecord({
      jobId: job.id,
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      subject,
      body,
      source: "contact-page",
    })

    const mailto = `mailto:${candidate.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailto

    toast({
      title: "Outreach logged",
      description: `Mail was logged and your email client opened for ${candidate.name}.`,
    })

    setIsSending(false)
  }

  if (isLoading) return null

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <Sidebar type="recruiter" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title="Candidate contact" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 space-y-6 p-4 lg:p-6">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div>
              <Badge className="rounded-full border-violet-400/20 bg-violet-400/10 text-violet-100">Shortlist outreach</Badge>
              <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight">Candidate details and formal response</h2>
            </div>
            <Link href={`/dashboard/recruiter/candidates${jobId ? `?jobId=${jobId}` : ""}`}>
              <Button variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to candidates
              </Button>
            </Link>
          </motion.section>

          {!candidate || !job ? (
            <Card className="rounded-[1.75rem] border-white/10 bg-[#171717]">
              <CardContent className="p-6 text-sm text-slate-300">Candidate or vacancy was not found. Please go back and open contact from the candidates page.</CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <Card className="rounded-[1.75rem] border-white/10 bg-[#171717]">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">{candidate.name}</CardTitle>
                  <p className="text-sm text-slate-400">{candidate.currentRole}</p>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-slate-300">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p><span className="text-slate-400">Email:</span> {candidate.email}</p>
                    <p><span className="text-slate-400">Location:</span> {candidate.location}</p>
                    <p><span className="text-slate-400">Experience:</span> {candidate.experience}</p>
                    <p><span className="text-slate-400">Availability:</span> {candidate.availability}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-slate-200">{candidate.summary}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill) => (
                      <Badge key={skill} className="rounded-full border-white/10 bg-white/5 text-slate-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {candidateScore ? (
                    <div className="rounded-2xl border border-violet-400/20 bg-violet-400/10 p-4 text-violet-100">
                      Match score: {candidateScore.score}/10 for {job.title}
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              <Card className="rounded-[1.75rem] border-white/10 bg-[#171717]">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">Send formal shortlist mail</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">To</label>
                    <Input value={candidate.email} disabled className="h-12 rounded-2xl border-white/10 bg-white/5 text-white disabled:opacity-100" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Subject</label>
                    <Input value={subject} onChange={(event) => setSubject(event.target.value)} className="h-12 rounded-2xl border-white/10 bg-white/5 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300">Message</label>
                    <Textarea value={body} onChange={(event) => setBody(event.target.value)} className="min-h-72 rounded-[1.5rem] border-white/10 bg-white/5 text-white" />
                  </div>
                  {latestOutreach ? (
                    <div className="rounded-2xl border border-violet-400/20 bg-violet-400/10 p-4 text-sm text-violet-100">
                      Last sent: {new Date(latestOutreach.sentAt).toLocaleString()}
                    </div>
                  ) : null}

                  <Button onClick={handleSend} disabled={isSending} className="h-12 w-full rounded-full bg-violet-500 text-white hover:bg-violet-400">
                    {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Send mail
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

