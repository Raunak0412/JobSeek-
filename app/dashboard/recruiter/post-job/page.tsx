"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Loader2, Mail, Sparkles, Trophy, Users, WandSparkles } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import { addJob, getPreferredRecruiterJobId, useJobs } from "@/lib/demo-store"

const skillMatchers: Array<{ keywords: string[]; skills: string[] }> = [
  {
    keywords: ["frontend", "react", "next", "ui", "web", "javascript", "typescript", "tailwind"],
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    keywords: ["backend", "api", "server", "microservice", "node", "python", "database", "sql", "fastapi", "django"],
    skills: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker"],
  },
  {
    keywords: ["ai", "ml", "machine learning", "llm", "langchain", "openrouter", "prompt", "nlp", "rag"],
    skills: ["Python", "LangChain", "OpenRouter", "Prompt engineering", "Embeddings"],
  },
  {
    keywords: ["devops", "cloud", "aws", "azure", "gcp", "kubernetes", "terraform", "cicd", "ci/cd"],
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
  },
  {
    keywords: ["game", "game dev", "game developer", "unity", "unreal", "godot", "gameplay", "c++", "c#", "shader", "blender"],
    skills: ["Unity", "Unreal Engine", "C#", "C++", "Gameplay Systems", "Shader Programming"],
  },
]

export default function PostJobPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const jobs = useJobs()
  const [form, setForm] = useState({
    title: "",
    company: user?.company ?? "JobSeek Labs",
    location: "Remote",
    type: "Full-time",
    vacancies: "2",
    salary: "",
    description: "",
  })

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth/login")
  }, [isLoading, router, user])

  const suggestedSkills = useMemo(() => {
    const text = `${form.title} ${form.description}`.toLowerCase().trim()
    if (!text) return []

    const matchedSkills = new Set<string>()
    skillMatchers.forEach((matcher) => {
      if (matcher.keywords.some((keyword) => text.includes(keyword))) {
        matcher.skills.forEach((skill) => matchedSkills.add(skill))
      }
    })

    return Array.from(matchedSkills)
  }, [form.description, form.title])
  const activeJobId = useMemo(() => getPreferredRecruiterJobId(jobs), [jobs])
  const activeJob = useMemo(() => jobs.find((job) => job.id === activeJobId) ?? null, [activeJobId, jobs])

  const addSkill = () => {
    const next = skillInput.trim()
    if (!next || skills.includes(next)) return
    setSkills((current) => [...current, next])
    setSkillInput("")
  }

  const applyTemplate = () => {
    if (!suggestedSkills.length) return
    const templateSkills = suggestedSkills.filter((item) => !skills.includes(item))
    if (!templateSkills.length) return
    setSkills((current) => [...current, ...templateSkills])
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 700))

    const createdJob = addJob({
      title: form.title,
      company: form.company,
      location: form.location,
      type: form.type,
      vacancies: Number(form.vacancies || 1),
      salary: form.salary,
      description: form.description,
      requiredSkills: skills.length ? skills : suggestedSkills,
    })

    setIsSubmitting(false)
    router.push(`/dashboard/recruiter/candidates?jobId=${createdJob.id}`)
  }

  if (isLoading) return null

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <Sidebar type="recruiter" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title="Post vacancy" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 space-y-6 p-4 lg:p-6">
          <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="rounded-[1.75rem] border-white/10 bg-[#171717]">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">Vacancy details</CardTitle>
                  <p className="text-sm text-slate-400">The agent router compares this job description with uploaded resumes and scores matching candidates.</p>
                </CardHeader>
                <CardContent className="grid gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job title</Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                      className="h-12 rounded-2xl border-white/10 bg-white/5 text-white"
                      placeholder="Game Developer"
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={form.company}
                        onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
                        className="h-12 rounded-2xl border-white/10 bg-white/5 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={form.location}
                        onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
                        className="h-12 rounded-2xl border-white/10 bg-white/5 text-white"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Input
                        id="type"
                        value={form.type}
                        onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
                        className="h-12 rounded-2xl border-white/10 bg-white/5 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vacancies">Vacancies</Label>
                      <Input
                        id="vacancies"
                        value={form.vacancies}
                        onChange={(event) => setForm((current) => ({ ...current, vacancies: event.target.value }))}
                        className="h-12 rounded-2xl border-white/10 bg-white/5 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary</Label>
                      <Input
                        id="salary"
                        value={form.salary}
                        onChange={(event) => setForm((current) => ({ ...current, salary: event.target.value }))}
                        className="h-12 rounded-2xl border-white/10 bg-white/5 text-white"
                        placeholder="$120k - $140k"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Job description</Label>
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                      className="min-h-40 rounded-[1.5rem] border-white/10 bg-white/5 text-white"
                      placeholder="Describe responsibilities, seniority, and required skills."
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[1.75rem] border-white/10 bg-[#171717]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-heading text-2xl">Required skills</CardTitle>
                    <p className="text-sm text-slate-400">Suggestions are matched from vacancy details, not a fixed frontend default.</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={applyTemplate}
                    disabled={!suggestedSkills.length}
                    className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    <WandSparkles className="mr-2 h-4 w-4" />
                    Match skills
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-slate-400">
                    {suggestedSkills.length
                      ? `Detected: ${suggestedSkills.join(", ")}`
                      : "Add vacancy title and description, then click Match skills."}
                  </p>
                  <div className="flex gap-3">
                    <Input
                      value={skillInput}
                      onChange={(event) => setSkillInput(event.target.value)}
                      placeholder="Add a skill"
                      className="h-12 rounded-2xl border-white/10 bg-white/5 text-white"
                    />
                    <Button type="button" onClick={addSkill} className="rounded-2xl bg-violet-500 px-5 text-white hover:bg-violet-400">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} className="rounded-full border-white/10 bg-white/5 text-slate-100">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="space-y-6">
              <Button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-full bg-violet-500 text-white hover:bg-violet-400">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Post vacancy
              </Button>

              <Card className="rounded-[1.75rem] border-white/10 bg-[#171717]">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">Launch controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-400">Current focus vacancy</p>
                    <p className="mt-2 font-medium text-white">{activeJob?.title ?? "Post a vacancy to activate controls"}</p>
                    <p className="mt-1 text-xs text-slate-500">{activeJob ? `${activeJob.company} - ${activeJob.vacancies} openings` : "No active role yet"}</p>
                  </div>

                  <div className="grid gap-3">
                    <Link
                      href={activeJobId ? `/dashboard/recruiter/rankings?jobId=${activeJobId}` : "/dashboard/recruiter/rankings"}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:border-violet-400/30 hover:bg-white/10"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-violet-300" />
                        Open rank list
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </Link>
                    <Link
                      href={activeJobId ? `/dashboard/recruiter/candidates?jobId=${activeJobId}` : "/dashboard/recruiter/candidates"}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:border-violet-400/30 hover:bg-white/10"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Users className="h-4 w-4 text-violet-300" />
                        Review candidates
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </Link>
                    <Link
                      href={activeJobId ? `/dashboard/recruiter/mail?jobId=${activeJobId}` : "/dashboard/recruiter/mail"}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:border-violet-400/30 hover:bg-white/10"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Mail className="h-4 w-4 text-violet-300" />
                        Open outreach studio
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden rounded-[1.75rem] border-white/10 bg-[#171717]">
                <div className="pointer-events-none absolute -left-14 -top-14 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-14 -right-10 h-44 w-44 rounded-full bg-lime-300/20 blur-3xl" />
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">3D activity deck</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative h-44 rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-4 [perspective:900px]">
                    <div className="absolute left-4 top-4 h-24 w-24 rounded-3xl border border-white/20 bg-gradient-to-br from-violet-400/30 to-lime-300/15 shadow-[0_24px_80px_rgba(139,92,246,0.34)] [transform:rotateY(-24deg)_rotateX(10deg)]" />
                    <div className="absolute right-5 top-12 h-20 w-20 rounded-[1.2rem] border border-white/15 bg-gradient-to-br from-lime-300/25 to-transparent shadow-[0_20px_60px_rgba(191,226,100,0.24)] [transform:rotateY(22deg)_rotateX(-8deg)]" />
                    <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-200">
                      Vacancy posted jobs automatically sync into rank list, candidates, and outreach.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </form>
        </main>
      </div>
    </div>
  )
}

