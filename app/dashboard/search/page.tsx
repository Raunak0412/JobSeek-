"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Search, Sparkles } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { searchWorkspace, type WorkspaceSearchResult, type WorkspaceSearchType } from "@/lib/demo-store"

const resultTypeLabel: Record<WorkspaceSearchType, string> = {
  page: "Page",
  candidate: "Candidate",
  job: "Vacancy",
  application: "Application",
  notification: "Notification",
}

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeSearchParam = searchParams.get("q") ?? ""
  const { user, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [query, setQuery] = useState(activeSearchParam)
  const [filter, setFilter] = useState<WorkspaceSearchType | "all">("all")
  const role = user?.type ?? "seeker"

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth/login")
  }, [isLoading, router, user])

  useEffect(() => {
    setQuery(activeSearchParam)
  }, [activeSearchParam])

  const results = useMemo(() => searchWorkspace(query, role, 40), [query, role])
  const filtered = useMemo(() => {
    if (filter === "all") return results
    return results.filter((item) => item.type === filter)
  }, [filter, results])

  const groupedCounts = useMemo(() => {
    return results.reduce(
      (acc, item) => {
        acc[item.type] += 1
        return acc
      },
      { page: 0, candidate: 0, job: 0, application: 0, notification: 0 }
    )
  }, [results])

  const openResult = (item: WorkspaceSearchResult) => {
    router.push(item.href)
  }

  if (isLoading) return null

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <Sidebar type={role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title="Search workspace" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 space-y-6 p-4 lg:p-6">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <Badge className="rounded-full border-violet-400/20 bg-violet-400/10 text-violet-100">Global dashboard search</Badge>
                <h2 className="mt-4 font-heading text-4xl font-semibold tracking-tight">Search across pages, candidates, jobs, applications, and notifications.</h2>
                <p className="mt-3 text-sm text-slate-300">Results shown for your active role: {role}.</p>
              </div>
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  router.push(`/dashboard/search?q=${encodeURIComponent(query.trim())}`)
                }}
                className="w-full max-w-[420px]"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search dashboard..."
                    className="h-12 rounded-full border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-500"
                  />
                </div>
              </form>
            </div>
          </motion.section>

          <Card className="rounded-[1.75rem] border-white/10 bg-[#171717]">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Search results</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={filter} onValueChange={(value) => setFilter(value as WorkspaceSearchType | "all")} className="space-y-4">
                <TabsList className="h-auto flex-wrap rounded-full border border-white/10 bg-white/5 p-1">
                  <TabsTrigger value="all" className="rounded-full px-4 text-slate-200 data-[state=active]:bg-violet-400/15 data-[state=active]:text-violet-100">
                    All ({results.length})
                  </TabsTrigger>
                  <TabsTrigger value="page" className="rounded-full px-4 text-slate-200 data-[state=active]:bg-violet-400/15 data-[state=active]:text-violet-100">
                    Pages ({groupedCounts.page})
                  </TabsTrigger>
                  <TabsTrigger value="candidate" className="rounded-full px-4 text-slate-200 data-[state=active]:bg-violet-400/15 data-[state=active]:text-violet-100">
                    Candidates ({groupedCounts.candidate})
                  </TabsTrigger>
                  <TabsTrigger value="job" className="rounded-full px-4 text-slate-200 data-[state=active]:bg-violet-400/15 data-[state=active]:text-violet-100">
                    Vacancies ({groupedCounts.job})
                  </TabsTrigger>
                  <TabsTrigger value="application" className="rounded-full px-4 text-slate-200 data-[state=active]:bg-violet-400/15 data-[state=active]:text-violet-100">
                    Applications ({groupedCounts.application})
                  </TabsTrigger>
                  <TabsTrigger value="notification" className="rounded-full px-4 text-slate-200 data-[state=active]:bg-violet-400/15 data-[state=active]:text-violet-100">
                    Alerts ({groupedCounts.notification})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={filter}>
                  <div className="space-y-3">
                    {filtered.length ? (
                      filtered.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => openResult(item)}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-violet-300/35 hover:bg-white/10"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-medium text-white">{item.title}</p>
                            <Badge className="rounded-full border-white/10 bg-black/20 text-slate-300">{resultTypeLabel[item.type]}</Badge>
                          </div>
                          <p className="mt-2 text-sm text-slate-300">{item.subtitle}</p>
                          <span className="mt-3 inline-flex items-center text-xs text-violet-200">
                            Open result
                            <ArrowRight className="ml-1 h-3.5 w-3.5" />
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-400">
                        {query.trim()
                          ? "No matching workspace items found. Try a different keyword."
                          : "Type in the search field to find anything in the dashboard."}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="rounded-[1.75rem] border-white/10 bg-[#171717]">
            <CardContent className="flex items-start gap-3 p-5 text-sm leading-6 text-slate-300">
              <Sparkles className="mt-0.5 h-4 w-4 text-violet-300" />
              <p>
                Tip: Use the header search from any seeker or recruiter page to instantly jump here with your query.
                <Link href="/dashboard/notifications" className="ml-1 text-violet-200 underline-offset-4 hover:underline">
                  You can also search alert titles from this page.
                </Link>
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

