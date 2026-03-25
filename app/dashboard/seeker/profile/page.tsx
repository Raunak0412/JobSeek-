"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Brain, MapPin, Sparkles } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import { seekerProfile } from "@/lib/mock-data"

export default function ProfilePage() {
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
        <Header title="Profile" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 space-y-6 p-4 lg:p-6">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <Badge className="rounded-full border-cyan-400/20 bg-cyan-400/10 text-cyan-100">{seekerProfile.category} profile</Badge>
                <h2 className="mt-5 font-heading text-4xl font-semibold tracking-tight">{user?.name ?? seekerProfile.name}</h2>
                <p className="mt-2 text-lg text-cyan-100">{seekerProfile.title}</p>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">{seekerProfile.about}</p>
                <p className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                  <MapPin className="h-4 w-4 text-cyan-300" />
                  {seekerProfile.location}
                </p>
              </div>
              <div className="text-right">
                <p className="font-heading text-5xl font-semibold tracking-tight">{seekerProfile.score}</p>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">AI score out of 10</p>
              </div>
            </div>
          </motion.section>

          <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <Card className="rounded-[1.75rem] border-white/10 bg-[#081321]">
              <CardHeader>
                <CardTitle className="font-heading text-2xl">AI-extracted skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {seekerProfile.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-slate-200">{skill.name}</span>
                      <span className="text-cyan-200">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2 bg-white/10" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="rounded-[1.75rem] border-white/10 bg-[#081321]">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">Sentiment and confidence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400">Resume tone</p>
                        <p className="mt-1 font-heading text-3xl font-semibold">{seekerProfile.sentiment.label}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">Confidence score</p>
                        <p className="mt-1 font-heading text-3xl font-semibold">{seekerProfile.sentiment.score}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {seekerProfile.sentiment.traits.map((trait) => (
                      <Badge key={trait} className="rounded-full border-amber-400/20 bg-amber-400/10 text-amber-100">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[1.75rem] border-white/10 bg-[#081321]">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">Experience snapshot</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {seekerProfile.experience.map((item) => (
                    <div key={`${item.company}-${item.role}`} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                          <Brain className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{item.role}</p>
                          <p className="text-sm text-slate-400">{item.company} · {item.period}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-[1.75rem] border-white/10 bg-[#081321]">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">Profile completeness</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-slate-300">Completion</span>
                    <span className="text-cyan-200">{seekerProfile.completion}%</span>
                  </div>
                  <Progress value={seekerProfile.completion} className="h-2 bg-white/10" />
                  <div className="mt-4 rounded-[1.6rem] border border-cyan-400/15 bg-cyan-400/10 p-4 text-sm leading-6 text-cyan-100">
                    <div className="flex items-start gap-3">
                      <Sparkles className="mt-0.5 h-4 w-4" />
                      <p>One more flagship project and a stronger portfolio link section would raise recruiter confidence further.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
