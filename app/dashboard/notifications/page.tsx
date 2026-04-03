"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Bell, CheckCheck, Clock3, ExternalLink, Trash2, X } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import {
  clearAllNotifications,
  dismissNotification,
  markAllNotificationsRead,
  markNotificationRead,
  useNotifications,
} from "@/lib/demo-store"

function formatNotificationTime(value: string) {
  return new Date(value).toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function NotificationsPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [tab, setTab] = useState("all")
  const notifications = useNotifications()

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth/login")
  }, [isLoading, router, user])

  const filtered = useMemo(() => {
    const lowerQuery = query.toLowerCase().trim()
    const sorted = [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return sorted.filter((item) => {
      if (tab === "unread" && item.read) return false
      if (!lowerQuery) return true
      return [item.app, item.title, item.message].join(" ").toLowerCase().includes(lowerQuery)
    })
  }, [notifications, query, tab])

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications])
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>()
    filtered.forEach((item) => {
      if (!map.has(item.app)) map.set(item.app, [])
      map.get(item.app)!.push(item)
    })
    return [...map.entries()]
  }, [filtered])

  if (isLoading) return null

  return (
    <div className="flex min-h-screen bg-[#150707] text-white">
      <Sidebar type={user?.type ?? "seeker"} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title="Notifications" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 space-y-6 p-4 lg:p-6">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <Badge className="rounded-full border-red-400/20 bg-red-400/10 text-red-100">Shared notification center</Badge>
                <h2 className="mt-4 font-heading text-4xl font-semibold tracking-tight">Everything happening across seeker and recruiter workflows.</h2>
                <p className="mt-3 text-sm text-slate-300">Unread alerts: {unreadCount}. Mark as read, dismiss one item, or clear the timeline instantly.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={() => markAllNotificationsRead()}>
                  <CheckCheck className="mr-2 h-4 w-4" />
                  Mark all read
                </Button>
                <Button variant="outline" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={() => clearAllNotifications()}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear all
                </Button>
              </div>
            </div>
          </motion.section>

          <Card className="rounded-[1.75rem] border-white/10 bg-[#1b0b0b]">
            <CardHeader className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <CardTitle className="font-heading text-2xl">Notification feed</CardTitle>
                <p className="mt-1 text-sm text-slate-400">Styled like a system notification tray with grouped app entries.</p>
              </div>
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search notifications"
                className="h-11 w-full rounded-full border-white/10 bg-white/5 text-white placeholder:text-slate-500 xl:w-[320px]"
              />
            </CardHeader>
            <CardContent>
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="h-auto rounded-full border border-white/10 bg-white/5 p-1">
                  <TabsTrigger value="all" className="rounded-full px-4 text-slate-200 data-[state=active]:bg-red-400/15 data-[state=active]:text-red-100">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="rounded-full px-4 text-slate-200 data-[state=active]:bg-red-400/15 data-[state=active]:text-red-100">
                    Unread
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={tab} className="mt-4">
                  <ScrollArea className="h-[68vh] pr-4">
                    <div className="space-y-4">
                      {grouped.length ? (
                        grouped.map(([app, items]) => (
                          <div key={app} className="rounded-[1.4rem] border border-white/10 bg-white/5">
                            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                              <p className="text-sm font-medium text-slate-200">{app}</p>
                              <span className="text-xs text-slate-500">{items.length} notification(s)</span>
                            </div>
                            <div className="space-y-3 p-3">
                              {items.map((item) => (
                                <div key={item.id} className="rounded-xl border border-white/10 bg-black/15 p-3">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 gap-3">
                                      <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-red-400/10 text-red-200">
                                        <Bell className="h-4 w-4" />
                                      </div>
                                      <div className="min-w-0">
                                        <p className="font-medium text-white">{item.title}</p>
                                        <p className="mt-1 text-sm text-slate-300">{item.message}</p>
                                        <p className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500">
                                          <Clock3 className="h-3 w-3" />
                                          {formatNotificationTime(item.createdAt)}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => dismissNotification(item.id)}
                                      className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                  <div className="mt-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      {!item.read ? (
                                        <span className="rounded-full border border-red-400/25 bg-red-400/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-red-200">
                                          New
                                        </span>
                                      ) : null}
                                      {typeof item.extraCount === "number" ? (
                                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-300">
                                          +{item.extraCount} notifications
                                        </span>
                                      ) : null}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                                        onClick={() => markNotificationRead(item.id)}
                                      >
                                        Mark read
                                      </Button>
                                      {item.deepLink ? (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-8 rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                                          onClick={() => {
                                            markNotificationRead(item.id)
                                            router.push(item.deepLink!)
                                          }}
                                        >
                                          Open
                                          <ExternalLink className="ml-1 h-3.5 w-3.5" />
                                        </Button>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-slate-400">
                          No notifications found for this filter.
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
