"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, Mail, Send, Sparkles } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import {
  addOutreachRecord,
  getPreferredRecruiterJobId,
  getTopCandidatesForOpenings,
  setActiveRecruiterJobId,
  useOutreachHistory,
  useJobs,
} from "@/lib/demo-store"
import { buildOfferTemplate } from "@/lib/mock-data"

function MailPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { user, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const jobs = useJobs()
  const outreachHistory = useOutreachHistory()
  const [jobId, setJobId] = useState("")
  const [selected, setSelected] = useState<string[]>([])
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [isSending, setIsSending] = useState(false)

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

  const job = jobs.find((item) => item.id === jobId) ?? null
  const shortlist = useMemo(() => (job ? getTopCandidatesForOpenings(job.id) : []), [job])
  const recentOutreach = useMemo(() => outreachHistory.filter((item) => item.jobId === jobId).slice(0, 5), [jobId, outreachHistory])

  useEffect(() => {
    if (!job) return
    const nextIds = shortlist.map((candidate) => candidate.id)
    setSelected(nextIds)
    setSubject(`Shortlist update for ${job.title}`)
    setBody(buildOfferTemplate(shortlist[0]?.name ?? "[Candidate Name]", job.title, job.company))
  }, [job, shortlist])

  const handleSend = async () => {
    if (!job) return

    setIsSending(true)
    await new Promise((resolve) => setTimeout(resolve, 450))

    const selectedCandidates = shortlist.filter((candidate) => selected.includes(candidate.id))
    selectedCandidates.forEach((candidate) => {
      addOutreachRecord({
        jobId: job.id,
        candidateId: candidate.id,
        candidateName: candidate.name,
        candidateEmail: candidate.email,
        subject,
        body,
        source: "mail-studio",
      })
    })

    toast({
      title: "Outreach sent",
      description: `${selectedCandidates.length} candidate(s) marked as contacted for ${job.title}.`,
    })

    setIsSending(false)
  }

  if (isLoading) return null

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <Sidebar type="recruiter" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title="Mail studio" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 space-y-6 p-4 lg:p-6">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <Badge className="rounded-full border-violet-400/20 bg-violet-400/10 text-violet-100">Formal shortlist system</Badge>
            <h2 className="mt-5 font-heading text-4xl font-semibold tracking-tight">Send polished recruiter mail to the top candidates for each vacancy.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              The page automatically pre-selects candidates according to the number of openings for the currently selected vacancy.
            </p>
          </motion.section>

          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <Card className="rounded-[1.75rem] border-white/10 bg-[#171717]">
              <CardHeader>
                <CardTitle className="font-heading text-2xl">Shortlist recipients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-3">
                  <select
                    value={jobId}
                    onChange={(event) => {
                      const nextJobId = event.target.value
                      setJobId(nextJobId)
                      setActiveRecruiterJobId(nextJobId)
                    }}
                    className="w-full bg-transparent text-sm text-white outline-none"
                  >
                    {jobs.map((item) => (
                      <option key={item.id} value={item.id} className="bg-[#171717]">
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>

                {job ? (
                  <div className="rounded-3xl border border-violet-400/15 bg-violet-400/10 p-4 text-sm leading-6 text-violet-100">
                    {job.vacancies} openings detected. The top {job.vacancies} candidates are selected automatically for this mail batch.
                  </div>
                ) : null}

                {shortlist.map((candidate) => (
                  <div key={candidate.id} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selected.includes(candidate.id)}
                          onCheckedChange={() => {
                            setSelected((current) =>
                              current.includes(candidate.id)
                                ? current.filter((item) => item !== candidate.id)
                                : [...current, candidate.id]
                            )
                          }}
                          className="border-white/20 data-[state=checked]:border-violet-300 data-[state=checked]:bg-violet-300"
                        />
                        <div>
                          <p className="font-medium text-white">{candidate.name}</p>
                          <p className="text-sm text-slate-400">{candidate.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-heading text-3xl font-semibold tracking-tight text-white">{candidate.jobScore.score}</p>
                        <p className="text-xs uppercase tracking-[0.24em] text-violet-200">out of 10</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-[1.75rem] border-white/10 bg-[#171717]">
              <CardHeader>
                <CardTitle className="font-heading text-2xl">Compose formal mail</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Subject</label>
                  <Input value={subject} onChange={(event) => setSubject(event.target.value)} className="h-12 rounded-2xl border-white/10 bg-white/5 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Message</label>
                  <Textarea value={body} onChange={(event) => setBody(event.target.value)} className="min-h-72 rounded-[1.5rem] border-white/10 bg-white/5 text-white" />
                </div>
                <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-4 w-4 text-violet-300" />
                    <p>Selected candidates: {selected.length}. The message body is initialized with a formal shortlist template.</p>
                  </div>
                </div>
                <Button onClick={handleSend} disabled={isSending || selected.length === 0} className="h-12 w-full rounded-full bg-violet-500 text-white hover:bg-violet-400">
                  {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Send shortlist mail
                </Button>
                <Button variant="outline" className="h-12 w-full rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                  <Mail className="mr-2 h-4 w-4" />
                  Save draft
                </Button>

                <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-medium text-white">Recent outreach status</p>
                  <div className="mt-3 space-y-2 text-sm text-slate-300">
                    {recentOutreach.length ? (
                      recentOutreach.map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/10 px-3 py-2">
                          <p className="truncate">{entry.candidateName}</p>
                          <p className="text-xs text-slate-400">{new Date(entry.sentAt).toLocaleString()}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400">No outreach sent for this vacancy yet.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function MailPage() {
  return (
    <Suspense fallback={null}>
      <MailPageContent />
    </Suspense>
  )
}

