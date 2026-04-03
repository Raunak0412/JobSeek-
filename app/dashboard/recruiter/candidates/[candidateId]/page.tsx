"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { motion, useScroll, useSpring } from "framer-motion"
import {
  ArrowLeft,
  CalendarClock,
  Download,
  ExternalLink,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
  UserRound,
} from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { buildCandidateResumeText, getCandidateById, getRankedCandidatesForJob, useJobs } from "@/lib/demo-store"
import { candidatePublicProfiles } from "@/lib/mock-data"

const sectionMotion = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
}

export default function CandidateProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams<{ candidateId: string }>()
  const { user, isLoading } = useAuth()
  const jobs = useJobs()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 130, damping: 28 })

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth/login")
  }, [isLoading, router, user])

  const candidateId = Array.isArray(params?.candidateId) ? params.candidateId[0] : params?.candidateId ?? ""
  const jobId = searchParams.get("jobId") ?? ""
  const job = jobs.find((item) => item.id === jobId) ?? null

  const rankedCandidate = useMemo(() => {
    if (!jobId || !candidateId) return null
    return getRankedCandidatesForJob(jobId).find((item) => item.id === candidateId) ?? null
  }, [candidateId, jobId])

  const candidate = rankedCandidate ?? getCandidateById(candidateId)
  const publicProfile = candidate ? candidatePublicProfiles[candidate.id] : null

  const techSkills = useMemo(() => {
    if (!candidate) return []
    if (publicProfile?.techSkills?.length) return publicProfile.techSkills
    return candidate.skills.map((skill, index) => ({
      name: skill,
      level: Math.max(68, 94 - index * 4),
    }))
  }, [candidate, publicProfile?.techSkills])

  const timeline = publicProfile?.timeline.length
    ? publicProfile.timeline
    : candidate
      ? [
          {
            role: candidate.currentRole,
            company: "Current role",
            period: candidate.experience,
            highlights: [candidate.summary],
          },
        ]
      : []

  const resumeText = candidate
    ? buildCandidateResumeText({
        candidate,
        job,
        score: rankedCandidate?.jobScore.score,
        matchedSkills: rankedCandidate?.jobScore.matchedSkills,
        missingSkills: rankedCandidate?.jobScore.missingSkills,
      })
    : ""

  const socialLinks = [
    { label: "GitHub", href: publicProfile?.socialLinks.github, icon: Github },
    { label: "LinkedIn", href: publicProfile?.socialLinks.linkedin, icon: Linkedin },
    { label: "Portfolio", href: publicProfile?.socialLinks.portfolio, icon: Globe },
    { label: "Website", href: publicProfile?.socialLinks.website, icon: ExternalLink },
  ]

  const handleDownloadResume = () => {
    if (!candidate) return
    const blob = new Blob([resumeText], { type: "text/plain;charset=utf-8" })
    const blobUrl = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = blobUrl
    anchor.download = `${candidate.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-profile-resume.txt`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(blobUrl)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#150707] text-slate-300">
        <div className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm">Loading candidate profile...</div>
      </div>
    )
  }

  if (!candidate) {
    return (
      <div className="flex min-h-screen bg-[#150707] text-white">
        <Sidebar type="recruiter" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header title="Candidate profile" onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 lg:p-6">
            <Card className="rounded-[1.75rem] border-white/10 bg-[#1b0b0b]">
              <CardContent className="space-y-4 p-6 text-sm text-slate-300">
                <p>Candidate profile was not found. Please open profile again from the candidates list.</p>
                <Link href="/dashboard/recruiter/candidates">
                  <Button variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to candidates
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  const initials = candidate.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

  return (
    <div className="flex min-h-screen bg-[#150707] text-white">
      <motion.div style={{ scaleX: progressScaleX }} className="fixed left-0 right-0 top-0 z-50 h-0.5 origin-left bg-red-300/80" />
      <Sidebar type="recruiter" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title="Candidate profile" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 space-y-6 p-4 lg:p-6">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
          >
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20 rounded-3xl border border-white/10">
                  <AvatarImage src={publicProfile?.photoUrl} alt={`${candidate.name} profile photo`} className="object-cover" />
                  <AvatarFallback className="rounded-3xl bg-red-400/15 font-heading text-xl text-red-100">{initials || "JS"}</AvatarFallback>
                </Avatar>
                <div>
                  <Badge className="rounded-full border-red-400/20 bg-red-400/10 text-red-100">Public seeker profile</Badge>
                  <h2 className="mt-4 font-heading text-4xl font-semibold tracking-tight">{candidate.name}</h2>
                  <p className="mt-1 text-red-100">{candidate.currentRole}</p>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{publicProfile?.headline ?? candidate.summary}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-red-300" />
                      {candidate.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarClock className="h-4 w-4 text-red-300" />
                      {candidate.experience} experience
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <UserRound className="h-4 w-4 text-red-300" />
                      {candidate.availability} availability
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/dashboard/recruiter/candidates${jobId ? `?jobId=${jobId}` : ""}`}>
                  <Button variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to candidates
                  </Button>
                </Link>
                <Button
                  className="rounded-full bg-red-400 text-slate-950 hover:bg-red-300"
                  onClick={() => {
                    const query = jobId ? `?jobId=${jobId}&candidateId=${candidate.id}` : `?candidateId=${candidate.id}`
                    router.push(`/dashboard/recruiter/contact${query}`)
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contact
                </Button>
              </div>
            </div>
          </motion.section>

          <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-6">
              <motion.div {...sectionMotion}>
                <Card className="rounded-[1.75rem] border-white/10 bg-[#1b0b0b]">
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl">About this seeker</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <p className="text-sm leading-7 text-slate-300">{publicProfile?.about ?? candidate.summary}</p>
                    <Separator className="bg-white/10" />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Category</p>
                        <p className="mt-2 text-sm text-slate-200">{candidate.category}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Email</p>
                        <p className="mt-2 break-all text-sm text-slate-200">{candidate.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div {...sectionMotion}>
                <Card className="rounded-[1.75rem] border-white/10 bg-[#1b0b0b]">
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl">Tech skills visible to recruiters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[320px] pr-4">
                      <div className="space-y-4">
                        {techSkills.map((skill) => (
                          <div key={skill.name}>
                            <div className="mb-2 flex items-center justify-between text-sm">
                              <span className="text-slate-200">{skill.name}</span>
                              <span className="text-red-200">{skill.level}%</span>
                            </div>
                            <Progress value={skill.level} className="h-2 bg-white/10" />
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div {...sectionMotion}>
                <Card className="rounded-[1.75rem] border-white/10 bg-[#1b0b0b]">
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl">Experience timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {timeline.map((item, index) => (
                        <div key={`${item.role}-${item.company}-${item.period}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="font-medium text-white">{item.role}</p>
                              <p className="text-sm text-slate-400">{item.company}</p>
                            </div>
                            <Badge className="rounded-full border-red-400/20 bg-red-400/10 text-red-100">{item.period}</Badge>
                          </div>
                          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                            {item.highlights.map((point) => (
                              <li key={point} className="flex items-start gap-2">
                                <span className="mt-[0.45rem] h-1.5 w-1.5 rounded-full bg-red-300" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                          {index !== timeline.length - 1 ? <Separator className="mt-4 bg-white/10" /> : null}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div {...sectionMotion}>
                <Card className="rounded-[1.75rem] border-white/10 bg-[#1b0b0b]">
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl">Match and highlights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-[1.5rem] border border-red-400/20 bg-red-400/10 p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-red-200">Score for selected vacancy</p>
                      <p className="mt-2 font-heading text-5xl font-semibold tracking-tight">{rankedCandidate?.jobScore.score ?? "N/A"}</p>
                      <p className="mt-1 text-sm text-red-100">{job ? `${job.title} at ${job.company}` : "Open from candidates list to map a vacancy score."}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(rankedCandidate?.jobScore.matchedSkills ?? candidate.skills.slice(0, 4)).map((skill) => (
                        <Badge key={skill} className="rounded-full border-red-400/20 bg-red-400/10 text-red-100">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                      <div className="flex items-start gap-2">
                        <Sparkles className="mt-0.5 h-4 w-4 text-red-300" />
                        <p>{rankedCandidate?.jobScore.routeReason ?? "Profile details are visible exactly as shared by the seeker in their public profile."}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div {...sectionMotion}>
                <Card className="rounded-[1.75rem] border-white/10 bg-[#1b0b0b]">
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl">Social links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {socialLinks.some((link) => link.href) ? (
                      socialLinks.map((link) => {
                        if (!link.href) return null
                        const Icon = link.icon
                        return (
                          <Button
                            key={link.label}
                            asChild
                            variant="outline"
                            className="h-11 w-full justify-between rounded-2xl border-white/10 bg-white/5 px-4 text-white hover:bg-white/10"
                          >
                            <a href={link.href} target="_blank" rel="noreferrer">
                              <span className="inline-flex items-center gap-2">
                                <Icon className="h-4 w-4 text-red-300" />
                                {link.label}
                              </span>
                              <ExternalLink className="h-4 w-4 text-slate-400" />
                            </a>
                          </Button>
                        )
                      })
                    ) : (
                      <p className="text-sm text-slate-500">No social links shared by this seeker yet.</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div {...sectionMotion}>
                <Card className="rounded-[1.75rem] border-white/10 bg-[#1b0b0b]">
                  <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div>
                      <CardTitle className="font-heading text-2xl">Resume preview</CardTitle>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                        {publicProfile?.resume.fileName ?? `${candidate.name} resume`}
                      </p>
                      {publicProfile?.resume.updatedAt ? (
                        <p className="mt-1 text-xs text-slate-500">Updated {publicProfile.resume.updatedAt}</p>
                      ) : null}
                    </div>
                    <Button
                      variant="outline"
                      className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                      onClick={handleDownloadResume}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {publicProfile?.resume.highlights.length ? (
                      <div className="space-y-2">
                        {publicProfile.resume.highlights.map((item) => (
                          <p key={item} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
                            {item}
                          </p>
                        ))}
                      </div>
                    ) : null}
                    <ScrollArea className="h-64 rounded-2xl border border-white/10 bg-black/20 p-3">
                      <pre className="whitespace-pre-wrap font-mono text-xs leading-6 text-slate-300">{resumeText}</pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
