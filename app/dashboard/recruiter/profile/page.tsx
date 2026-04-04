"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, type Variants } from "framer-motion"
import { BriefcaseBusiness, CheckCircle2, Clock3, Mail, Send, Target, TrendingUp, Users } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/lib/auth-context"
import { getTopCandidatesForOpenings, useJobs, useOutreachHistory } from "@/lib/demo-store"

const pageMotion: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function RecruiterProfilePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const jobs = useJobs()
  const outreachHistory = useOutreachHistory()

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth/login")
  }, [isLoading, router, user])

  const recruiterName = user?.name ?? "Recruiter"
  const recruiterInitials =
    recruiterName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "RW"

  const jobsPosted = jobs.length
  const openPositions = useMemo(() => jobs.reduce((sum, job) => sum + job.vacancies, 0), [jobs])
  const shortlistReady = useMemo(() => jobs.reduce((sum, job) => sum + getTopCandidatesForOpenings(job.id).length, 0), [jobs])
  const interviewUpdates = useMemo(() => new Set(outreachHistory.map((item) => `${item.jobId}:${item.candidateId}`)).size, [outreachHistory])

  const vacancyBoard = useMemo(
    () =>
      jobs.map((job) => {
        const readyCount = getTopCandidatesForOpenings(job.id).length
        const jobOutreach = outreachHistory.filter((item) => item.jobId === job.id)
        const interviewCount = new Set(jobOutreach.map((item) => `${item.jobId}:${item.candidateId}`)).size
        return {
          ...job,
          readyCount,
          interviewCount,
          latestMail: jobOutreach[0] ?? null,
        }
      }),
    [jobs, outreachHistory]
  )

  const recentMailUpdates = useMemo(
    () => [...outreachHistory].sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()).slice(0, 8),
    [outreachHistory]
  )
  const activeVacancies = useMemo(() => vacancyBoard.filter((job) => job.vacancies > 0).length, [vacancyBoard])
  const engagedVacancies = useMemo(() => vacancyBoard.filter((job) => job.readyCount > 0 || job.interviewCount > 0).length, [vacancyBoard])
  const mailsThisWeek = useMemo(() => {
    const now = Date.now()
    const weekInMs = 7 * 24 * 60 * 60 * 1000
    return outreachHistory.filter((item) => now - new Date(item.sentAt).getTime() <= weekInMs).length
  }, [outreachHistory])
  const latestMailUpdate = recentMailUpdates[0] ?? null

  if (isLoading) return null

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <Sidebar type="recruiter" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title="Recruiter profile" onMenuClick={() => setSidebarOpen(true)} />
        <main className="relative flex-1 overflow-hidden p-4 lg:p-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,rgba(167,139,250,0.26),transparent_36%),radial-gradient(circle_at_top_right,rgba(52,211,153,0.14),transparent_28%)]" />
          <motion.div variants={pageMotion} initial="hidden" animate="show" className="relative space-y-6">
            <motion.section
              variants={fadeUp}
              className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)]"
            >
              <motion.div
                aria-hidden="true"
                animate={{ x: [0, 16, 0], y: [0, -12, 0] }}
                transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-violet-400/20 blur-3xl"
              />
              <motion.div
                aria-hidden="true"
                animate={{ x: [0, -10, 0], y: [0, 14, 0] }}
                transition={{ duration: 11, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                className="absolute bottom-0 left-16 h-36 w-36 rounded-full bg-emerald-300/10 blur-3xl"
              />

              <div className="relative grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
                <div className="flex flex-col gap-6">
                  <div className="flex items-start gap-4">
                    <motion.div
                      whileHover={{ scale: 1.04, rotate: -2 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18 }}
                      className="flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-[1.7rem] border border-white/10 bg-gradient-to-br from-violet-300/40 via-violet-500/30 to-emerald-300/15 text-xl font-semibold text-white shadow-[0_16px_45px_rgba(139,92,246,0.25)]"
                    >
                      {recruiterInitials}
                    </motion.div>
                    <div className="min-w-0">
                      <Badge className="rounded-full border-emerald-300/25 bg-emerald-300/10 text-emerald-100">Recruiter profile</Badge>
                      <h2 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-white sm:text-[2.8rem]">
                        {recruiterName}
                      </h2>
                      <p className="mt-2 text-base text-violet-100">{user?.company ?? "Hiring workspace"}</p>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-[15px]">
                        Keep hiring progress in one place with a calmer view of live vacancies, shortlist momentum, and recruiter outreach already reaching seekers.
                      </p>
                      <p className="mt-3 text-sm text-slate-400">{user?.email ?? "recruiter@jobseek.ai"}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link href="/dashboard/recruiter/post-job">
                      <Button className="rounded-full bg-violet-500 px-5 text-white shadow-[0_12px_28px_rgba(139,92,246,0.32)] hover:bg-violet-400">
                        Post vacancy
                      </Button>
                    </Link>
                    <Link href="/dashboard/recruiter/mail">
                      <Button variant="outline" className="rounded-full border-white/10 bg-white/5 px-5 text-white hover:bg-white/10">
                        Open mail updates
                      </Button>
                    </Link>
                  </div>
                </div>

                <motion.div
                  variants={fadeUp}
                  className="grid gap-3 rounded-[1.8rem] border border-white/10 bg-black/15 p-4 backdrop-blur-xl sm:grid-cols-3 xl:grid-cols-1"
                >
                  {[
                    {
                      label: "Active vacancies",
                      value: activeVacancies,
                      hint: `${engagedVacancies} already showing movement`,
                      icon: TrendingUp,
                      tone: "from-emerald-300/20 to-emerald-400/5",
                    },
                    {
                      label: "Mail sent this week",
                      value: mailsThisWeek,
                      hint: latestMailUpdate ? `Latest update to ${latestMailUpdate.candidateName}` : "Outreach will appear here",
                      icon: Clock3,
                      tone: "from-sky-300/20 to-sky-400/5",
                    },
                    {
                      label: "Ready now",
                      value: shortlistReady,
                      hint: "Shortlist-ready candidates across your roles",
                      icon: CheckCircle2,
                      tone: "from-violet-300/20 to-violet-500/5",
                    },
                  ].map((item) => (
                    <motion.div
                      key={item.label}
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 240, damping: 18 }}
                      className={`rounded-[1.45rem] border border-white/10 bg-gradient-to-br ${item.tone} p-4`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white">
                        <item.icon className="h-4.5 w-4.5" />
                      </div>
                      <p className="mt-4 text-xs uppercase tracking-[0.22em] text-slate-400">{item.label}</p>
                      <p className="mt-2 font-heading text-3xl font-semibold tracking-tight text-white">{item.value}</p>
                      <p className="mt-2 text-sm text-slate-300">{item.hint}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.section>

            <motion.section variants={fadeUp} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Vacancies posted", value: jobsPosted, icon: BriefcaseBusiness, accent: "from-violet-400/20 to-transparent" },
                { label: "Open positions", value: openPositions, icon: Target, accent: "from-sky-400/20 to-transparent" },
                { label: "Ready for hiring", value: shortlistReady, icon: Users, accent: "from-emerald-400/20 to-transparent" },
                { label: "Interview updates", value: interviewUpdates, icon: Mail, accent: "from-amber-300/20 to-transparent" },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  variants={fadeUp}
                  transition={{ delay: index * 0.04 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="h-full"
                >
                  <Card className={`h-full rounded-[1.75rem] border-white/10 bg-[linear-gradient(180deg,rgba(23,23,23,0.98),rgba(23,23,23,0.82))] shadow-[0_18px_50px_rgba(0,0,0,0.28)]`}>
                    <CardContent className="relative overflow-hidden p-5">
                      <div className={`absolute inset-x-0 top-0 h-20 bg-gradient-to-r ${item.accent} opacity-80`} />
                      <div className="relative">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-violet-200">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <p className="mt-5 font-heading text-4xl font-semibold tracking-tight text-white">{item.value}</p>
                        <p className="mt-2 text-sm text-slate-400">{item.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.section>

            <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
              <motion.div variants={fadeUp}>
                <Card className="rounded-[1.9rem] border-white/10 bg-[linear-gradient(180deg,rgba(23,23,23,0.98),rgba(23,23,23,0.88))] shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
                  <CardHeader className="border-b border-white/10 pb-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <CardTitle className="font-heading text-2xl text-white">Vacancy pipeline</CardTitle>
                        <p className="mt-2 text-sm text-slate-400">
                          A clean view of which roles are open, shortlist-ready, and already moving through recruiter outreach.
                        </p>
                      </div>
                      <Badge className="rounded-full border-emerald-300/25 bg-emerald-300/10 text-emerald-100">
                        {engagedVacancies} roles in motion
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[min(64vh,720px)] pr-4">
                      <div className="space-y-3 pr-1">
                        {vacancyBoard.length ? (
                          vacancyBoard.map((job, index) => (
                            <motion.div
                              key={job.id}
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.08 + index * 0.04, duration: 0.45 }}
                              whileHover={{ y: -3 }}
                              className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4"
                            >
                              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="font-medium text-white">{job.title}</p>
                                    <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300">
                                      {job.category}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-sm text-slate-400">
                                    {job.company} - {job.location} - {job.vacancies} opening(s)
                                  </p>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    <Badge className="rounded-full border-white/10 bg-black/20 text-slate-200">{job.readyCount} ready for hiring</Badge>
                                    <Badge className="rounded-full border-violet-400/20 bg-violet-400/10 text-violet-100">{job.interviewCount} interview updates</Badge>
                                  </div>
                                  {job.latestMail ? (
                                    <p className="mt-3 text-xs text-slate-400">
                                      Latest mail: {new Date(job.latestMail.sentAt).toLocaleString()} to {job.latestMail.candidateName}
                                    </p>
                                  ) : (
                                    <p className="mt-3 text-xs text-slate-500">No mail update sent for this vacancy yet.</p>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-2 sm:justify-end">
                                  <Link href={`/dashboard/recruiter/candidates?jobId=${job.id}`}>
                                    <Button variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                                      Candidates
                                    </Button>
                                  </Link>
                                  <Link href={`/dashboard/recruiter/mail?jobId=${job.id}`}>
                                    <Button variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                                      Mail updates
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="rounded-[1.6rem] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-400">
                            No vacancy has been posted yet. Create your first role and this page will start showing hiring progress automatically.
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Card className="rounded-[1.9rem] border-white/10 bg-[linear-gradient(180deg,rgba(23,23,23,0.98),rgba(23,23,23,0.88))] shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
                  <CardHeader className="border-b border-white/10 pb-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <CardTitle className="font-heading text-2xl text-white">Mail updates to seekers</CardTitle>
                        <p className="mt-2 text-sm text-slate-400">
                          Recent recruiter outreach with clear status, timing, and quick links back into the hiring flow.
                        </p>
                      </div>
                      <Link href="/dashboard/recruiter/mail">
                        <Button variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                          Open studio
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentMailUpdates.length ? (
                      recentMailUpdates.map((entry, index) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.12 + index * 0.04, duration: 0.45 }}
                          whileHover={{ y: -3 }}
                          className="rounded-[1.6rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-medium text-white">{entry.candidateName}</p>
                                <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-emerald-100">
                                  Sent
                                </span>
                              </div>
                              <p className="mt-1 truncate text-sm text-slate-400">{entry.subject}</p>
                              <p className="mt-2 text-xs text-slate-500">{entry.candidateEmail}</p>
                              <p className="mt-1 text-xs text-slate-500">{new Date(entry.sentAt).toLocaleString()}</p>
                            </div>
                            <Badge className="rounded-full border-violet-400/20 bg-violet-400/10 text-violet-100">
                              {entry.source === "mail-studio" ? "Mail studio" : "Contact page"}
                            </Badge>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Link href={`/dashboard/recruiter/contact?jobId=${entry.jobId}&candidateId=${entry.candidateId}`}>
                              <Button variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                                <Send className="mr-2 h-4 w-4" />
                                View update
                              </Button>
                            </Link>
                            <Link href={`/dashboard/recruiter/candidates?jobId=${entry.jobId}`}>
                              <Button variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                                Vacancy
                              </Button>
                            </Link>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="rounded-[1.6rem] border border-dashed border-white/10 bg-white/5 p-6 text-sm text-slate-400">
                        No recruiter mail has been sent yet. Once you contact seekers, the updates will show here automatically.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </section>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
