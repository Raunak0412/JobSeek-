"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, Sparkles, WandSparkles } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import { addJob, useJobs } from "@/lib/demo-store"

const templates = {
  frontend: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion"],
  backend: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker"],
  ai: ["Python", "LangChain", "OpenRouter", "Prompt engineering", "Embeddings"],
}

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

  const suggestedType = useMemo(() => {
    const title = form.title.toLowerCase()
    if (title.includes("ai")) return "ai"
    if (title.includes("backend")) return "backend"
    return "frontend"
  }, [form.title])

  const addSkill = () => {
    const next = skillInput.trim()
    if (!next || skills.includes(next)) return
    setSkills((current) => [...current, next])
    setSkillInput("")
  }

  const applyTemplate = () => {
    const templateSkills = templates[suggestedType].filter((item) => !skills.includes(item))
    setSkills((current) => [...current, ...templateSkills])
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 700))
    addJob({
      title: form.title,
      company: form.company,
      location: form.location,
      type: form.type,
      vacancies: Number(form.vacancies || 1),
      salary: form.salary,
      description: form.description,
      requiredSkills: skills.length ? skills : templates[suggestedType],
    })
    setIsSubmitting(false)
    router.push("/dashboard/recruiter/candidates")
  }

  if (isLoading) return null

  return (
    <div className="flex min-h-screen bg-[#150707] text-white">
      <Sidebar type="recruiter" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title="Post vacancy" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 space-y-6 p-4 lg:p-6">
          <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="rounded-[1.75rem] border-white/10 bg-[#1b0b0b]">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">Vacancy details</CardTitle>
                  <p className="text-sm text-slate-400">The agent router will compare this job description with uploaded resumes and score candidates automatically.</p>
                </CardHeader>
                <CardContent className="grid gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job title</Label>
                    <Input id="title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="h-12 rounded-2xl border-white/10 bg-white/5 text-white" placeholder="Senior Frontend Engineer" required />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" value={form.company} onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))} className="h-12 rounded-2xl border-white/10 bg-white/5 text-white" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} className="h-12 rounded-2xl border-white/10 bg-white/5 text-white" required />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Input id="type" value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))} className="h-12 rounded-2xl border-white/10 bg-white/5 text-white" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vacancies">Vacancies</Label>
                      <Input id="vacancies" value={form.vacancies} onChange={(event) => setForm((current) => ({ ...current, vacancies: event.target.value }))} className="h-12 rounded-2xl border-white/10 bg-white/5 text-white" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary</Label>
                      <Input id="salary" value={form.salary} onChange={(event) => setForm((current) => ({ ...current, salary: event.target.value }))} className="h-12 rounded-2xl border-white/10 bg-white/5 text-white" placeholder="$120k - $140k" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Job description</Label>
                    <Textarea id="description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="min-h-40 rounded-[1.5rem] border-white/10 bg-white/5 text-white" placeholder="Describe responsibilities, required skills, and seniority expectations." required />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[1.75rem] border-white/10 bg-[#1b0b0b]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="font-heading text-2xl">Required skills</CardTitle>
                    <p className="text-sm text-slate-400">Use AI suggestions to seed the ranker system with the right signals.</p>
                  </div>
                  <Button type="button" variant="outline" onClick={applyTemplate} className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
                    <WandSparkles className="mr-2 h-4 w-4" />
                    Suggest skills
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <Input value={skillInput} onChange={(event) => setSkillInput(event.target.value)} placeholder="Add a skill" className="h-12 rounded-2xl border-white/10 bg-white/5 text-white" />
                    <Button type="button" onClick={addSkill} className="rounded-2xl bg-red-400 px-5 text-slate-950 hover:bg-red-300">
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
              <Card className="rounded-[1.75rem] border-white/10 bg-[#1b0b0b]">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">What happens next</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-7 text-slate-300">
                  {[
                    "Uploaded resumes are routed into the matching category first.",
                    "The ranker compares resume skills, experience, and tone with your vacancy.",
                    "Candidates get a score out of 10 and appear in the dedicated rankings view.",
                    "Top candidates can be auto-selected in the mail studio based on vacancies.",
                  ].map((item) => (
                    <div key={item} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3">
                      {item}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-[1.75rem] border-white/10 bg-[#1b0b0b]">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">Existing roles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {jobs.map((job) => (
                    <div key={job.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <p className="font-medium text-white">{job.title}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {job.company} · {job.vacancies} openings · {job.applicants} applicants
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-full bg-red-400 text-slate-950 hover:bg-red-300">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Publish and open candidates
              </Button>
            </motion.div>
          </form>
        </main>
      </div>
    </div>
  )
}
