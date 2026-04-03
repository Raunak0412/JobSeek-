"use client"

import { Bell, Menu, Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"

interface HeaderProps {
  title: string
  onMenuClick: () => void
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const { user } = useAuth()

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
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
            <Input
              type="search"
              placeholder="Search people, jobs, or skills"
              className="h-11 w-[240px] rounded-full border-white/10 bg-white/5 pl-9 text-white placeholder:text-slate-500 lg:w-[320px]"
            />
          </div>
          <Button variant="ghost" size="icon" className="relative rounded-2xl text-slate-300 hover:bg-white/10">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-300" />
          </Button>
        </div>
      </div>
    </header>
  )
}
