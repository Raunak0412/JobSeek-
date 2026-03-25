"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useDropzone } from "react-dropzone"
import { Brain, Camera, CheckCircle2, FileText, Loader2, ScanSearch, UploadCloud } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import { seekerResumeExtraction } from "@/lib/mock-data"

export default function UploadResumePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [fileName, setFileName] = useState("")
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<"idle" | "uploading" | "routing" | "complete">("idle")

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth/login")
  }, [isLoading, router, user])

  const beginProcessing = (name: string) => {
    setFileName(name)
    setProgress(0)
    setPhase("uploading")

    const timer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          window.clearInterval(timer)
          setPhase("routing")
          window.setTimeout(() => setPhase("complete"), 1200)
          return 100
        }
        return current + 10
      })
    }, 120)
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) beginProcessing(file.name)
  }, [])

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
  })

  if (isLoading) return null

  return (
    <div className="flex min-h-screen bg-[#07111f] text-white">
      <Sidebar type="seeker" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title="Resume intake" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 space-y-6 p-4 lg:p-6">
          <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="rounded-[1.75rem] border-white/10 bg-[#081321]">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">Upload from file or camera</CardTitle>
                  <p className="text-sm text-slate-400">Your resume will be parsed, routed into a category, and prepared for recruiter ranking.</p>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div
                    {...getRootProps()}
                    className={`rounded-[1.75rem] border-2 border-dashed p-8 text-center transition ${
                      isDragActive ? "border-cyan-300 bg-cyan-400/10" : "border-white/15 bg-white/5 hover:border-cyan-300/40 hover:bg-white/10"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-400/10 text-cyan-200">
                      <UploadCloud className="h-8 w-8" />
                    </div>
                    <p className="mt-5 font-medium text-white">{isDragActive ? "Drop the resume here" : "Drag and drop your resume"}</p>
                    <p className="mt-2 text-sm text-slate-400">PDF, DOC, or DOCX. Click to browse if you prefer.</p>
                  </div>

                  <Button type="button" variant="outline" onClick={() => beginProcessing("camera-captured-resume.pdf")} className="h-12 w-full rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10">
                    <Camera className="mr-2 h-4 w-4" />
                    Use camera capture
                  </Button>

                  {phase !== "idle" ? (
                    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{fileName}</p>
                            <p className="text-sm text-slate-400">
                              {phase === "uploading" ? "Uploading" : phase === "routing" ? "Routing and extracting" : "Ready for matching"}
                            </p>
                          </div>
                        </div>
                        {phase === "complete" ? <CheckCircle2 className="h-5 w-5 text-emerald-300" /> : <Loader2 className="h-5 w-5 animate-spin text-cyan-200" />}
                      </div>
                      <div className="mt-4">
                        <Progress value={phase === "complete" ? 100 : progress} className="h-2 bg-white/10" />
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              <Card className="rounded-[1.75rem] border-white/10 bg-[#081321]">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">Agent router output</CardTitle>
                  <p className="text-sm text-slate-400">This is the structured data the recruiter side will use for ranking and shortlisting.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-slate-400">Category</p>
                      <p className="mt-2 font-heading text-3xl font-semibold text-white">{seekerResumeExtraction.routedCategory}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-slate-400">Sentiment</p>
                      <p className="mt-2 font-heading text-3xl font-semibold text-white">{seekerResumeExtraction.sentiment.label}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {seekerResumeExtraction.extractedSkills.map((skill) => (
                      <Badge key={skill.name} className="rounded-full border-white/10 bg-white/5 text-slate-100">
                        {skill.name} · {skill.confidence}%
                      </Badge>
                    ))}
                  </div>

                  <div className="rounded-[1.75rem] border border-cyan-400/15 bg-cyan-400/10 p-4 text-sm leading-6 text-cyan-100">
                    <div className="flex items-start gap-3">
                      <ScanSearch className="mt-0.5 h-4 w-4" />
                      <p>{seekerResumeExtraction.sentiment.insights[0]}</p>
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                        <Brain className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Recruiter-ready payload</p>
                        <p className="text-sm text-slate-400">Skills, category, score hints, and sentiment are now available to the ranker system.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </section>
        </main>
      </div>
    </div>
  )
}
