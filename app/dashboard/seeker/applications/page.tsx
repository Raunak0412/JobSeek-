"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle2, Clock, Mail, ScanSearch, XCircle } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { seekerApplications } from "@/lib/mock-data"

const statusMap = {
  pending: { icon: Clock, label: "Pending", className: "border-red-400/20 bg-red-400/10 text-red-100" },
  reviewing: { icon: ScanSearch, label: "Reviewing", className: "border-rose-400/20 bg-rose-400/10 text-rose-100" },
  accepted: { icon: CheckCircle2, label: "Accepted", className: "border-red-300/30 bg-red-300/10 text-red-100" },
  rejected: { icon: XCircle, label: "Rejected", className: "border-rose-400/20 bg-rose-400/10 text-rose-100" },
}

export default function ApplicationsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const statusCounts = seekerApplications.reduce(
    (acc, item) => {
      acc[item.status] = (acc[item.status] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
  const averageScore = seekerApplications.length
    ? Math.round((seekerApplications.reduce((sum, item) => sum + item.score, 0) / seekerApplications.length) * 10) / 10
    : 0

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth/login")
  }, [isLoading, router, user])

  if (isLoading) return null

  return (
    <div className="flex min-h-screen bg-[#150707] text-white">
      <Sidebar type="seeker" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title="Applications" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 space-y-6 p-4 lg:p-6">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="font-heading text-4xl font-semibold tracking-tight">Track every application in one place.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Recruiters see your profile score, sentiment, and route category. This tracker reflects where each application currently stands.
            </p>
          </motion.section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Reviewing", value: statusCounts.reviewing ?? 0, icon: ScanSearch },
              { label: "Pending", value: statusCounts.pending ?? 0, icon: Clock },
              { label: "Accepted", value: statusCounts.accepted ?? 0, icon: CheckCircle2 },
              { label: "Avg match score", value: averageScore, icon: Mail },
            ].map((item) => (
              <Card key={item.label} className="rounded-[1.6rem] border-white/10 bg-[#1b0b0b]">
                <CardContent className="p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-400/10 text-red-200">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <p className="mt-4 text-2xl font-semibold text-white">{item.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-red-200/80">{item.label}</p>
                </CardContent>
              </Card>
            ))}
          </section>

          <Card className="rounded-[1.75rem] border-white/10 bg-[#1b0b0b]">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Application timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {seekerApplications.map((application) => {
                const status = statusMap[application.status]
                return (
                  <div key={application.id} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                      <div>
                        <p className="font-medium text-white">{application.position}</p>
                        <p className="mt-1 text-sm text-slate-400">{application.company} - {application.date}</p>
                        <p className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                          <Mail className="h-4 w-4 text-red-300" />
                          {application.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-heading text-3xl font-semibold tracking-tight text-white">{application.score}</p>
                          <p className="text-xs uppercase tracking-[0.22em] text-red-200">match score</p>
                        </div>
                        <Badge className={`rounded-full border px-3 py-1 ${status.className}`}>
                          <status.icon className="mr-1 h-4 w-4" />
                          {status.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
