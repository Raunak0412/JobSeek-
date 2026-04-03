"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Bell, CheckCheck, ExternalLink, Menu, Search, Settings2, Sparkles, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/lib/auth-context"
import {
  clearAllNotifications,
  dismissNotification,
  markAllNotificationsRead,
  markNotificationRead,
  searchWorkspace,
  useNotifications,
} from "@/lib/demo-store"

interface HeaderProps {
  title: string
  onMenuClick: () => void
}

function formatNotificationTime(value: string) {
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

const typeLabel: Record<string, string> = {
  page: "Page",
  candidate: "Candidate",
  job: "Vacancy",
  application: "Application",
  notification: "Notification",
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeSearchParam = searchParams.get("q") ?? ""
  const notifications = useNotifications()
  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications])
  const [query, setQuery] = useState(activeSearchParam)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const role = user?.type ?? "seeker"

  useEffect(() => {
    setQuery(activeSearchParam)
  }, [activeSearchParam, pathname])

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!searchRef.current) return
      if (!searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const searchResults = useMemo(() => {
    if (query.trim().length < 2) return []
    return searchWorkspace(query, role, 6)
  }, [query, role])

  const visibleNotifications = useMemo(
    () => [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8),
    [notifications]
  )

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = query.trim()
    if (!value) return
    setSearchOpen(false)
    router.push(`/dashboard/search?q=${encodeURIComponent(value)}`)
  }

  const openSearchResult = (href: string) => {
    setSearchOpen(false)
    router.push(href)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#150707]/90 backdrop-blur-2xl">
      <div className="flex h-18 items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="rounded-2xl text-slate-300 hover:bg-white/10 lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl font-semibold tracking-tight text-white">{title}</h1>
              <span className="hidden rounded-full border border-red-400/20 bg-red-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-red-200 sm:inline-flex">
                AI active
              </span>
            </div>
            <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
              <Sparkles className="h-3 w-3 text-red-300" />
              Signed in as {user?.name?.split(" ")[0] ?? "user"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div ref={searchRef} className="relative hidden sm:block">
            <form onSubmit={submitSearch}>
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
              <Input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setSearchOpen(true)
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search people, jobs, pages, skills"
                className="h-11 w-[240px] rounded-full border-white/10 bg-white/5 pl-9 text-white placeholder:text-slate-500 lg:w-[360px]"
              />
            </form>
            {searchOpen && query.trim().length >= 2 ? (
              <div className="absolute right-0 top-[3.25rem] z-40 w-[420px] rounded-2xl border border-white/10 bg-[#1b0b0b] p-2 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
                <div className="mb-2 px-2 pt-1 text-xs uppercase tracking-[0.22em] text-slate-500">Search results</div>
                <ScrollArea className="h-[290px]">
                  <div className="space-y-1 pr-2">
                    {searchResults.length ? (
                      searchResults.map((result) => (
                        <button
                          key={result.id}
                          type="button"
                          onClick={() => openSearchResult(result.href)}
                          className="w-full rounded-xl border border-transparent bg-white/0 px-3 py-2 text-left transition hover:border-white/10 hover:bg-white/5"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-sm font-medium text-white">{result.title}</p>
                            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                              {typeLabel[result.type] ?? result.type}
                            </span>
                          </div>
                          <p className="mt-1 truncate text-xs text-slate-400">{result.subtitle}</p>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-6 text-sm text-slate-500">No results found for this search.</div>
                    )}
                  </div>
                </ScrollArea>
                <div className="mt-2 border-t border-white/10 px-2 pt-2 text-xs text-slate-500">Press Enter to open full search page.</div>
              </div>
            ) : null}
          </div>

          <Popover open={notifOpen} onOpenChange={setNotifOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-2xl text-slate-300 hover:bg-white/10">
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 ? (
                  <>
                    <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-red-300" />
                    <span className="absolute -right-1 -top-1 min-w-5 rounded-full border border-red-300/40 bg-[#150707] px-1 text-[10px] font-semibold text-red-200">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  </>
                ) : null}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" sideOffset={10} className="w-[390px] border-white/10 bg-[#1b0b0b] p-0 text-white">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div>
                  <p className="font-heading text-xl">Notifications</p>
                  <p className="text-xs text-slate-400">Shared for seeker and recruiter workspaces</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => markAllNotificationsRead()}
                    className="h-8 w-8 rounded-xl text-slate-300 hover:bg-white/10"
                    title="Mark all read"
                  >
                    <CheckCheck className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => clearAllNotifications()}
                    className="h-8 w-8 rounded-xl text-slate-300 hover:bg-white/10"
                    title="Clear all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-[420px]">
                <div className="space-y-3 p-3">
                  {visibleNotifications.length ? (
                    visibleNotifications.map((notification) => (
                      <div key={notification.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                          <span>{notification.app}</span>
                          <span>{formatNotificationTime(notification.createdAt)}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            markNotificationRead(notification.id)
                            if (notification.deepLink) {
                              setNotifOpen(false)
                              router.push(notification.deepLink)
                            }
                          }}
                          className="w-full text-left"
                        >
                          <p className="text-base font-medium text-white">{notification.title}</p>
                          <p className="mt-1 text-sm text-slate-300">{notification.message}</p>
                        </button>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {!notification.read ? (
                              <span className="rounded-full border border-red-400/25 bg-red-400/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-red-200">
                                New
                              </span>
                            ) : null}
                            {typeof notification.extraCount === "number" ? (
                              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-300">
                                +{notification.extraCount} notifications
                              </span>
                            ) : null}
                          </div>
                          <button
                            type="button"
                            onClick={() => dismissNotification(notification.id)}
                            className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
                            title="Dismiss"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">No notifications yet.</div>
                  )}
                </div>
              </ScrollArea>
              <div className="grid grid-cols-3 gap-2 border-t border-white/10 p-3">
                <Button
                  variant="outline"
                  className="rounded-xl border-white/10 bg-white/5 text-xs text-white hover:bg-white/10"
                  onClick={() => {
                    setNotifOpen(false)
                    router.push("/dashboard/notifications")
                  }}
                >
                  View all
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl border-white/10 bg-white/5 text-xs text-white hover:bg-white/10"
                  onClick={() => {
                    setNotifOpen(false)
                    router.push("/dashboard/settings")
                  }}
                >
                  <Settings2 className="mr-1 h-3.5 w-3.5" />
                  Settings
                </Button>
                <Button asChild variant="outline" className="rounded-xl border-white/10 bg-white/5 text-xs text-white hover:bg-white/10">
                  <Link href="/dashboard/search?q=notifications" onClick={() => setNotifOpen(false)}>
                    Search alerts
                    <ExternalLink className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  )
}
