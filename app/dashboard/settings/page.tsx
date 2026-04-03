"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { BellRing, ShieldCheck, SlidersHorizontal, Sparkles } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/auth-context"
import { resetAppSettings, updateAppSettings, useAppSettings } from "@/lib/demo-store"

type SettingRowProps = {
  label: string
  hint: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

function SettingRow({ label, hint, checked, onCheckedChange }: SettingRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="mt-1 text-xs leading-5 text-slate-400">{hint}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} className="data-[state=checked]:bg-red-400" />
    </div>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const settings = useAppSettings()
  const [savedAt, setSavedAt] = useState("")

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth/login")
  }, [isLoading, router, user])

  const saveSetting = (key: keyof typeof settings, value: boolean) => {
    updateAppSettings({ [key]: value })
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
  }

  const completion = useMemo(() => {
    const values = Object.values(settings)
    const enabled = values.filter(Boolean).length
    return Math.round((enabled / values.length) * 100)
  }, [settings])

  if (isLoading) return null

  return (
    <div className="flex min-h-screen bg-[#150707] text-white">
      <Sidebar type={user?.type ?? "seeker"} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title="Settings" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 space-y-6 p-4 lg:p-6">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <Badge className="rounded-full border-red-400/20 bg-red-400/10 text-red-100">Workspace settings</Badge>
                <h2 className="mt-4 font-heading text-4xl font-semibold tracking-tight">Manage notifications, privacy, and UI behavior.</h2>
                <p className="mt-3 text-sm text-slate-300">Settings are shared for both seeker and recruiter views on this device.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-right">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Setup score</p>
                <p className="mt-1 font-heading text-4xl font-semibold tracking-tight text-white">{completion}%</p>
                <p className="mt-1 text-xs text-slate-500">{savedAt ? `Last updated at ${savedAt}` : "Auto-save enabled"}</p>
              </div>
            </div>
          </motion.section>

          <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <Card className="rounded-[1.75rem] border-white/10 bg-[#1b0b0b]">
              <CardHeader>
                <CardTitle className="font-heading text-2xl">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <SettingRow
                  label="In-app notification panel"
                  hint="Show real-time alerts in the bell panel and notifications page."
                  checked={settings.inAppAlerts}
                  onCheckedChange={(checked) => saveSetting("inAppAlerts", checked)}
                />
                <SettingRow
                  label="Email notifications"
                  hint="Receive updates for outreach, shortlist events, and application changes."
                  checked={settings.emailAlerts}
                  onCheckedChange={(checked) => saveSetting("emailAlerts", checked)}
                />
                <SettingRow
                  label="Weekly digest"
                  hint="Send one combined summary each week for seeker and recruiter activity."
                  checked={settings.weeklyDigest}
                  onCheckedChange={(checked) => saveSetting("weeklyDigest", checked)}
                />
                <SettingRow
                  label="Shortlist digest"
                  hint="Notify when top candidate rankings shift for an active vacancy."
                  checked={settings.shortlistDigest}
                  onCheckedChange={(checked) => saveSetting("shortlistDigest", checked)}
                />
              </CardContent>
            </Card>

            <Card className="rounded-[1.75rem] border-white/10 bg-[#1b0b0b]">
              <CardHeader>
                <CardTitle className="font-heading text-2xl">Privacy and profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <SettingRow
                  label="Candidate profile visibility"
                  hint="Allow recruiter-facing profile sections like social links and tech skill depth."
                  checked={settings.candidateProfileVisibility}
                  onCheckedChange={(checked) => saveSetting("candidateProfileVisibility", checked)}
                />
                <SettingRow
                  label="Recruiter contact visibility"
                  hint="Expose recruiter contact actions where candidate cards and profiles are shown."
                  checked={settings.recruiterContactVisibility}
                  onCheckedChange={(checked) => saveSetting("recruiterContactVisibility", checked)}
                />
                <SettingRow
                  label="Compact cards"
                  hint="Use denser cards and tighter spacing in data-heavy screens."
                  checked={settings.compactCards}
                  onCheckedChange={(checked) => saveSetting("compactCards", checked)}
                />
                <SettingRow
                  label="Auto-open search results"
                  hint="Open first result quickly when search confidence is high."
                  checked={settings.autoOpenSearchResults}
                  onCheckedChange={(checked) => saveSetting("autoOpenSearchResults", checked)}
                />
              </CardContent>
            </Card>
          </section>

          <Card className="rounded-[1.75rem] border-white/10 bg-[#1b0b0b]">
            <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 text-sm font-medium text-white">
                  <SlidersHorizontal className="h-4 w-4 text-red-300" />
                  Quick actions
                </p>
                <p className="mt-2 text-sm text-slate-400">Reset to default if you want to start fresh with a clean baseline.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                  onClick={() => {
                    resetAppSettings()
                    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
                  }}
                >
                  Reset defaults
                </Button>
                <Button variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={() => router.push("/dashboard/notifications")}>
                  <BellRing className="mr-2 h-4 w-4" />
                  Open notifications
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] border-white/10 bg-[#1b0b0b]">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-red-400/10 text-red-200">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Account safety and workspace health</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Keep notifications and visibility settings aligned with your active role while switching between seeker and recruiter dashboards.
                  </p>
                  <Separator className="my-3 bg-white/10" />
                  <p className="inline-flex items-center gap-1 text-xs text-red-200">
                    <Sparkles className="h-3.5 w-3.5" />
                    Changes are saved instantly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
