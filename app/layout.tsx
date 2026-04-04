import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { SiteChrome, SmoothScrollProvider } from "@/components/site/smooth-scroll-provider"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "JobSeek | AI Recruitment Workspace",
  description:
    "JobSeek is an AI-powered smart recruitment system with resume routing, JD scoring, recruiter rankings, OTP auth, and formal outreach workflows.",
  keywords: ["smart recruitment", "resume ranking", "AI hiring", "langchain", "openrouter", "fastapi"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-brand-mesh font-sans antialiased text-slate-100">
        <AuthProvider>
          <SmoothScrollProvider />
          <SiteChrome />
          <div className="relative z-10">{children}</div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
