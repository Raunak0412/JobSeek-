import type { Metadata } from "next"
import { Manrope, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { SmoothScrollProvider } from "@/components/site/smooth-scroll-provider"

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" })
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" })

export const metadata: Metadata = {
  title: "SmartRecruit | AI Recruitment Workspace",
  description:
    "SmartRecruit is an AI-powered smart recruitment system with resume routing, JD scoring, recruiter rankings, OTP auth, and formal outreach workflows.",
  keywords: ["smart recruitment", "resume ranking", "AI hiring", "langchain", "openrouter", "fastapi"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${manrope.variable} ${spaceGrotesk.variable} font-sans antialiased bg-[#07111f]`}>
        <AuthProvider>
          <SmoothScrollProvider />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
