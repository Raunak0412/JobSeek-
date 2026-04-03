"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import {
  Briefcase,
  ChevronRight,
  FileText,
  Home,
  ListPlus,
  LogOut,
  Mail,
  Search,
  Trophy,
  Upload,
  User,
  Users,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

interface SidebarProps {
  type: "seeker" | "recruiter"
  isOpen: boolean
  onClose: () => void
}

const seekerLinks = [
  { href: "/dashboard/seeker", label: "Overview", icon: Home },
  { href: "/dashboard/seeker/upload", label: "Resume intake", icon: Upload },
  { href: "/dashboard/seeker/jobs", label: "Matched jobs", icon: Search },
  { href: "/dashboard/seeker/applications", label: "Applications", icon: FileText },
  { href: "/dashboard/seeker/profile", label: "Profile", icon: User },
]

const recruiterLinks = [
  { href: "/dashboard/recruiter", label: "Overview", icon: Home },
  { href: "/dashboard/recruiter/post-job", label: "Post vacancy", icon: ListPlus },
  { href: "/dashboard/recruiter/candidates", label: "Candidates", icon: Users },
  { href: "/dashboard/recruiter/rankings", label: "Rankings", icon: Trophy },
  { href: "/dashboard/recruiter/mail", label: "Mail studio", icon: Mail },
]

export function Sidebar({ type, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const links = type === "seeker" ? seekerLinks : recruiterLinks

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
        <Link href="/" onClick={onClose} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-red-400 via-rose-500 to-red-600 shadow-[0_18px_48px_rgba(248,113,113,0.35)]">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-heading text-lg font-semibold tracking-tight text-white">JobSeek</p>
            <p className="text-[10px] uppercase tracking-[0.24em] text-red-300/70">Workspace</p>
          </div>
        </Link>
        <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="border-b border-white/10 p-4">
        <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-red-400/25 to-red-600/20 text-sm font-semibold text-white">
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium text-white">{user?.name ?? "User"}</p>
              <p className="truncate text-xs text-slate-400">{user?.email ?? "user@example.com"}</p>
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-slate-950/35 px-3 py-2 text-xs text-slate-300">
            {type === "recruiter"
              ? `Recruiter workspace${user?.company ? ` - ${user.company}` : ""}`
              : "Job seeker workspace"}
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <p className="px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-slate-500">
          {type === "recruiter" ? "Recruitment flow" : "Career flow"}
        </p>
        {links.map((link) => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                "group flex items-center justify-between rounded-2xl px-3 py-3 text-sm transition",
                active
                  ? "bg-red-400/10 text-white ring-1 ring-red-400/20"
                  : "text-slate-400 hover:bg-white/10 hover:text-white"
              )}
            >
              <span className="flex items-center gap-3">
                <link.icon className={cn("h-4.5 w-4.5", active ? "text-red-200" : "text-slate-500 group-hover:text-red-200")} />
                {link.label}
              </span>
              {active ? <ChevronRight className="h-4 w-4 text-red-200" /> : null}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start rounded-2xl px-3 py-6 text-slate-400 hover:bg-rose-500/10 hover:text-rose-200"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        ) : null}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-0 top-0 z-50 h-screen w-[280px] border-r border-white/10 bg-[#1b0b0b] lg:hidden"
      >
        {content}
      </motion.aside>

      <aside className="sticky top-0 hidden h-screen w-[280px] flex-shrink-0 border-r border-white/10 bg-[#1b0b0b] lg:block">
        {content}
      </aside>
    </>
  )
}
