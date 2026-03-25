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
  pending: { icon: Clock, label: "Pending", className: "border-amber-400/20 bg-amber-400/10 text-amber-100" },
  reviewing: { icon: ScanSearch, label: "Reviewing", className: "border-cyan-400/20 bg-cyan-400/10 text-cyan-100" },
  accepted: { icon: CheckCircle2, label: "Accepted", className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100" },
  rejected: { icon: XCircle, label: "Rejected", className: "border-rose-400/20 bg-rose-400/10 text-rose-100" },
}

export default function ApplicationsPage() {
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
        <Header title="Applications" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 space-y-6 p-4 lg:p-6">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="font-heading text-4xl font-semibold tracking-tight">Track every application in one place.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Recruiters see your profile score, sentiment, and route category. This tracker reflects where each application currently stands.
            </p>
          </motion.section>

          <Card className="rounded-[1.75rem] border-white/10 bg-[#081321]">
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
                        <p className="mt-1 text-sm text-slate-400">{application.company} · {application.date}</p>
                        <p className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                          <Mail className="h-4 w-4 text-cyan-300" />
                          {application.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-heading text-3xl font-semibold tracking-tight text-white">{application.score}</p>
                          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">match score</p>
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
