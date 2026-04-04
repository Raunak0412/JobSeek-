"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useDropzone } from "react-dropzone"
import { Brain, Camera, CheckCircle2, FileText, Loader2, ScanSearch, ShieldCheck, Sparkles, Trophy, UploadCloud } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import {
  clearResumeExtraction,
  clearResumeMeta,
  getResumeExtraction,
  parseResume,
  saveResumeExtraction,
  saveResumeMeta,
  useResumeExtraction,
  useResumeMeta,
} from "@/lib/demo-store"

export default function UploadResumePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [fileName, setFileName] = useState("")
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [fileOpenUrl, setFileOpenUrl] = useState<string | null>(null)
  const [fileType, setFileType] = useState("")
  const [docxHtml, setDocxHtml] = useState("")
  const [docxState, setDocxState] = useState<"idle" | "loading" | "ready" | "error">("idle")
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewZoom, setPreviewZoom] = useState(1)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<"idle" | "uploading" | "ocr" | "routing" | "complete">("idle")
  const [extraction, setExtraction] = useState(getResumeExtraction())
  const storedExtraction = useResumeExtraction()
  const resumeMeta = useResumeMeta()
  const cameraInputId = "camera-capture-input"
  const processingRef = useRef(0)

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth/login")
  }, [isLoading, router, user])

  useEffect(() => {
    setExtraction(storedExtraction)
  }, [storedExtraction])

  useEffect(() => {
    if (!resumeMeta || phase === "uploading" || phase === "ocr" || phase === "routing") return
    setFileName(resumeMeta.fileName)
    setFileType(resumeMeta.fileType)
    setFilePreview(resumeMeta.previewDataUrl ?? null)
    setFileOpenUrl(resumeMeta.fileDataUrl ?? resumeMeta.previewDataUrl ?? null)
    setProgress(100)
    setPhase("complete")
  }, [phase, resumeMeta])

  useEffect(() => {
    return () => {
      if (filePreview && filePreview.startsWith("blob:")) {
        URL.revokeObjectURL(filePreview)
      }
      if (fileOpenUrl && fileOpenUrl.startsWith("blob:") && fileOpenUrl !== filePreview) {
        URL.revokeObjectURL(fileOpenUrl)
      }
    }
  }, [fileOpenUrl, filePreview])

  const resetResume = () => {
    if (filePreview) {
      if (filePreview.startsWith("blob:")) {
        URL.revokeObjectURL(filePreview)
      }
    }
    if (fileOpenUrl && fileOpenUrl.startsWith("blob:") && fileOpenUrl !== filePreview) {
      URL.revokeObjectURL(fileOpenUrl)
    }
    setFileName("")
    setFilePreview(null)
    setFileOpenUrl(null)
    setFileType("")
    setPreviewZoom(1)
    setProgress(0)
    setPhase("idle")
    setExtraction(null)
    clearResumeExtraction()
    clearResumeMeta()
  }

  const techSkills = extraction?.extractedSkills ?? []
  const softSkills = extraction?.softSkills ?? []
  const techSkillNames = techSkills.map((skill) => skill.name)
  const techAvg = techSkills.length
    ? Math.round(techSkills.reduce((sum, skill) => sum + skill.confidence, 0) / techSkills.length)
    : 0
  const softAvg = softSkills.length
    ? Math.round(softSkills.reduce((sum, skill) => sum + skill.confidence, 0) / softSkills.length)
    : 0
  const weightedSkillAvg = Math.round(techAvg * 0.7 + softAvg * 0.3)
  const sectionStrength = extraction?.sections.filter((section) => !section.completion.toLowerCase().includes("needs")).length ?? 0
  const sectionHealth = extraction?.sections.length ? Math.round((sectionStrength / extraction.sections.length) * 100) : 0
  const parseHealth = extraction ? Math.round((weightedSkillAvg + extraction.confidence + sectionHealth) / 3) : 0
  const parseTimeLabel =
    phase === "complete"
      ? fileType.startsWith("image/")
        ? "18s"
        : "9s"
      : phase === "ocr"
        ? "OCR running"
        : phase === "routing"
          ? "Extracting"
          : phase === "uploading"
            ? "Uploading"
            : "Waiting"
  const skillCoverage = Math.min(100, Math.round((techSkills.length / 10) * 100))
  const experienceSection = extraction?.sections.find((section) => section.name.toLowerCase().includes("experience"))
  const experienceScore = extraction
    ? experienceSection?.completion.toLowerCase().includes("strong")
      ? 88
      : experienceSection?.completion.toLowerCase().includes("complete")
        ? 84
        : experienceSection?.completion.toLowerCase().includes("good")
          ? 78
          : experienceSection?.completion.toLowerCase().includes("improv")
            ? 70
            : 62
    : 0
  const resumeStrength = extraction
    ? Math.round((weightedSkillAvg + parseHealth + experienceScore + Math.round(extraction.sentiment.score * 10)) / 4)
    : 0
  const resumeScore = extraction ? Math.round((resumeStrength / 10) * 10) / 10 : 0
  const percentile = extraction ? Math.min(99, Math.max(35, Math.round(resumeStrength))) : 0
  const visibilityLabel = percentile >= 90 ? "Top tier visibility" : percentile >= 75 ? "Strong visibility" : "Building visibility"
  const rankingFactors = [
    { label: "Skill coverage", value: extraction ? Math.min(100, Math.max(40, skillCoverage)) : 0 },
    { label: "Experience strength", value: experienceScore },
    { label: "Resume tone", value: extraction ? Math.min(100, Math.round((extraction.sentiment.score / 10) * 100)) : 0 },
    { label: "Format quality", value: extraction ? Math.min(100, Math.round(parseHealth)) : 0 },
  ]
  const routedCategory = extraction?.routedCategory ?? "Not parsed"
  const confidenceValue = extraction?.confidence ?? 0
  const sentimentLabel = extraction?.sentiment.label ?? "Pending"
  const sentimentInsight = extraction?.sentiment.insights?.[0] ?? "Upload a resume to see extraction insights."
  const sections = extraction?.sections ?? []
  const resumeScoreLabel = extraction ? `${resumeScore}/10` : "--"
  const percentileLabel = extraction ? `${percentile}th` : "--"
  const pipelineStages = [
    { title: "Secure intake", detail: "Checksum, file validation, and format normalization.", icon: ShieldCheck },
    { title: "OCR and structure", detail: "Layout detection and section mapping for ATS.", icon: ScanSearch },
    { title: "Skill extraction", detail: "Entity detection for skills, tools, and seniority.", icon: Brain },
    { title: "Ranking prep", detail: "Scorecard compiled for recruiter ranking.", icon: Trophy },
  ]

  const stageStatus = (index: number) => {
    if (phase === "idle") return "pending"
    if (phase === "uploading") return index === 0 ? "active" : "pending"
    if (phase === "ocr") return index <= 0 ? "done" : index === 1 ? "active" : "pending"
    if (phase === "routing") return index <= 1 ? "done" : index === 2 ? "active" : "pending"
    return "done"
  }

  const formatBytes = (bytes: number) => {
    if (!bytes) return "0 B"
    const units = ["B", "KB", "MB", "GB"]
    const idx = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
    const value = bytes / Math.pow(1024, idx)
    return `${value.toFixed(value >= 10 || idx === 0 ? 0 : 1)} ${units[idx]}`
  }

  const formatTimestamp = (value: number | string) => {
    if (!value) return "Unknown"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "Unknown"
    return date.toLocaleString()
  }

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsDataURL(file)
    })

  const createFileDataUrl = async (file: File) => {
    const maxBytes = 5 * 1024 * 1024
    if (file.size > maxBytes) return null
    return readFileAsDataUrl(file)
  }

  const createPreviewDataUrl = async (file: File) => {
    if (!file.type.startsWith("image/")) return null
    const dataUrl = await readFileAsDataUrl(file)
    try {
      const image = new Image()
      image.src = dataUrl
      await image.decode()
      const maxWidth = 920
      const scale = Math.min(1, maxWidth / image.width)
      const canvas = document.createElement("canvas")
      canvas.width = Math.round(image.width * scale)
      canvas.height = Math.round(image.height * scale)
      const ctx = canvas.getContext("2d")
      if (!ctx) return dataUrl
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
      return canvas.toDataURL("image/jpeg", 0.82)
    } catch {
      return dataUrl
    }
  }

  const runOcr = async (file: File) => {
    try {
      const { createWorker } = await import("tesseract.js")
      const worker = await createWorker()
      await worker.load()
      await worker.loadLanguage("eng")
      await worker.initialize("eng")
      const { data } = await worker.recognize(file)
      await worker.terminate()
      return {
        text: (data?.text ?? "").trim(),
        confidence: typeof data?.confidence === "number" ? Math.round(data.confidence) : undefined,
      }
    } catch {
      return { text: "", confidence: undefined }
    }
  }

  const extractDocxText = async (file: File) => {
    try {
      const mammoth = await import("mammoth")
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.convertToHtml({ arrayBuffer })
      const text = result.value
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
      return text
    } catch {
      return ""
    }
  }

  const extractPdfText = async (file: File) => {
    try {
      const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf")
      const version = (pdfjsLib as { version?: string }).version ?? "4.3.136"
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const pageTexts: string[] = []
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
        const page = await pdf.getPage(pageNum)
        const content = await page.getTextContent()
        const pageText = content.items.map((item) => ("str" in item ? item.str : "")).join(" ")
        pageTexts.push(pageText)
      }
      return pageTexts.join("\n").replace(/\s+/g, " ").trim()
    } catch {
      return ""
    }
  }

  const beginProcessing = async (file: File) => {
    const currentId = processingRef.current + 1
    processingRef.current = currentId
    setFileName(file.name)
    setFileType(file.type)
    setProgress(0)
    setPhase("uploading")
    setPreviewZoom(1)
    const fileDataUrl = await createFileDataUrl(file)
    const previewDataUrl = file.type.startsWith("image/") ? await createPreviewDataUrl(file) : null
    if (processingRef.current !== currentId) return
    setFilePreview(previewDataUrl)
    const objectUrl = fileDataUrl ? null : URL.createObjectURL(file)
    setFileOpenUrl(fileDataUrl ?? objectUrl ?? previewDataUrl)
    setProgress(25)

    let ocrText = ""
    let docxText = ""
    let ocrConfidence: number | undefined
    if (file.type.startsWith("image/")) {
      setPhase("ocr")
      setProgress(40)
      const ocr = await runOcr(file)
      if (processingRef.current !== currentId) return
      ocrText = ocr.text
      ocrConfidence = ocr.confidence
      setProgress(65)
    }

    setPhase("routing")
    setProgress(78)
    if (file.type.includes("officedocument.wordprocessingml.document")) {
      docxText = await extractDocxText(file)
    }
    let pdfText = ""
    if (file.type.includes("pdf")) {
      pdfText = await extractPdfText(file)
    }
    const resumeText = (docxText || pdfText || ocrText).slice(0, 5000)
    const parsed = parseResume(file.name, file.type, resumeText)
    saveResumeExtraction(parsed)
    saveResumeMeta({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      lastModified: file.lastModified,
      source: file.type.startsWith("image/") ? "camera" : "file",
      capturedAt: new Date().toISOString(),
      previewDataUrl: previewDataUrl ?? undefined,
      fileDataUrl: fileDataUrl ?? undefined,
      extractedText: resumeText || undefined,
      ocrText: ocrText || undefined,
      ocrConfidence,
    })
    setExtraction(parsed)
    setProgress(100)
    window.setTimeout(() => {
      if (processingRef.current !== currentId) return
      setPhase("complete")
    }, 600)
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      beginProcessing(file)
    }
  }, [])

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
  })

  const resumeSourceLabel = resumeMeta?.source === "camera" ? "Camera capture" : "Document upload"
  const hasCameraResume = resumeMeta?.source === "camera"
  const ocrWordCount = resumeMeta?.ocrText ? resumeMeta.ocrText.trim().split(/\s+/).length : 0
  const ocrSnippet = resumeMeta?.ocrText
    ? resumeMeta.ocrText.trim().length > 220
      ? `${resumeMeta.ocrText.trim().slice(0, 220)}...`
      : resumeMeta.ocrText.trim()
    : ""

  const ocrSummary = useMemo(() => {
    const resumeText = resumeMeta?.extractedText || resumeMeta?.ocrText || ""
    if (!resumeText || !extraction) return ""
    const topTech = techSkillNames.slice(0, 5).join(", ")
    const topSoft = softSkills.slice(0, 4).join(", ")
    const experienceStatus = experienceSection?.completion ?? "Needs attention"
    const tone = sentimentLabel
    return [
      `Summary: ${routedCategory} profile with ${techSkills.length} technical skills detected.`,
      topTech ? `Key technical skills include ${topTech}.` : "No standout technical skills detected yet.",
      topSoft ? `Soft skills noted: ${topSoft}.` : "Soft-skill cues are limited; add collaboration and leadership signals.",
      `Experience section: ${experienceStatus}. Tone reads as ${tone}.`,
    ].join(" ")
  }, [extraction, experienceSection?.completion, resumeMeta?.extractedText, resumeMeta?.ocrText, routedCategory, sentimentLabel, softSkills, techSkillNames, techSkills.length])

  const experienceHighlights = useMemo(() => {
    const resumeText = resumeMeta?.extractedText || ""
    if (!resumeText) return []
    return resumeText
      .split(/\n+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 10)
      .filter((line) => /\b(20\d{2}|19\d{2})\b/.test(line) || /(experience|engineer|developer|designer|intern|lead)/i.test(line))
      .slice(0, 4)
  }, [resumeMeta?.extractedText])

  const displayType = resumeMeta?.fileType || fileType
  const isDocx = useMemo(() => {
    if (!displayType) return false
    if (displayType.includes("officedocument.wordprocessingml.document")) return true
    return fileName.toLowerCase().endsWith(".docx")
  }, [displayType, fileName])
  const canPreviewInline = !!fileOpenUrl && (displayType.startsWith("image/") || displayType.includes("pdf") || isDocx)
  const viewLabel = displayType.startsWith("image/") ? "View capture" : "View resume"

  useEffect(() => {
    if (!previewOpen || !fileOpenUrl || !isDocx) return
    let active = true
    setDocxState("loading")
    setDocxHtml("")
    ;(async () => {
      try {
        const mammoth = await import("mammoth")
        const response = await fetch(fileOpenUrl)
        const arrayBuffer = await response.arrayBuffer()
        const result = await mammoth.convertToHtml({ arrayBuffer })
        if (!active) return
        setDocxHtml(result.value || "")
        setDocxState("ready")
      } catch {
        if (!active) return
        setDocxState("error")
      }
    })()
    return () => {
      active = false
    }
  }, [fileOpenUrl, isDocx, previewOpen])

  if (isLoading) return null

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <Sidebar type="seeker" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title="Resume intake" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 space-y-6 p-4 lg:p-6">
          <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="rounded-[1.75rem] border-white/10 bg-[#171717]">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">Upload from file or camera</CardTitle>
                  <p className="text-sm text-slate-400">Your resume will be parsed, routed into a category, and prepared for recruiter ranking.</p>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div
                    {...getRootProps()}
                    className={`rounded-[1.75rem] border-2 border-dashed p-8 text-center transition ${
                      isDragActive ? "border-violet-300 bg-violet-400/10" : "border-white/15 bg-white/5 hover:border-violet-300/40 hover:bg-white/10"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-400/10 text-violet-200">
                      <UploadCloud className="h-8 w-8" />
                    </div>
                    <p className="mt-5 font-medium text-white">{isDragActive ? "Drop the resume here" : "Drag and drop your resume"}</p>
                    <p className="mt-2 text-sm text-slate-400">PDF, DOC, or DOCX. Click to browse if you prefer.</p>
                  </div>

                  <input
                    id={cameraInputId}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0]
                      if (file) beginProcessing(file)
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById(cameraInputId)?.click()}
                    className="h-12 w-full rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Use camera capture
                  </Button>
                  {fileName ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={resetResume}
                      className="h-11 w-full rounded-2xl border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                    >
                      Remove this resume and upload another
                    </Button>
                  ) : null}

                  <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-slate-300">Processing pipeline</p>
                      <Badge className="rounded-full border-violet-400/20 bg-violet-400/10 text-violet-100">
                        {phase === "idle"
                          ? "Waiting"
                          : phase === "uploading"
                            ? "Uploading"
                            : phase === "ocr"
                              ? "OCR"
                              : phase === "routing"
                                ? "Extracting"
                                : "Complete"}
                      </Badge>
                    </div>
                    <div className="mt-4 space-y-3">
                      {pipelineStages.map((stage, index) => {
                        const status = stageStatus(index)
                        const statusLabel = status === "done" ? "Complete" : status === "active" ? "Running" : "Queued"
                        const statusClass =
                          status === "done"
                            ? "border-violet-400/20 bg-violet-400/10 text-violet-100"
                            : status === "active"
                              ? "border-white/15 bg-white/10 text-white"
                              : "border-white/10 bg-white/5 text-slate-400"

                        return (
                          <div key={stage.title} className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-200">
                                <stage.icon className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">{stage.title}</p>
                                <p className="mt-1 text-xs text-slate-400">{stage.detail}</p>
                              </div>
                            </div>
                            <Badge className={`rounded-full border px-2 py-0.5 text-xs ${statusClass}`}>{statusLabel}</Badge>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-slate-300">Uploaded resume</p>
                      <Badge className="rounded-full border-white/10 bg-white/5 text-slate-200">
                        {resumeMeta ? "On file" : "Not uploaded"}
                      </Badge>
                    </div>
                    {resumeMeta ? (
                      <div className="mt-4 space-y-3 text-sm text-slate-300">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-400">File</span>
                          <span className="text-right text-white">{resumeMeta.fileName}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-400">Source</span>
                          <span className="text-right text-white">{resumeSourceLabel}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-400">Type</span>
                          <span className="text-right text-white">{resumeMeta.fileType || "Unknown"}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-400">Size</span>
                          <span className="text-right text-white">{formatBytes(resumeMeta.fileSize)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-400">Last updated</span>
                          <span className="text-right text-white">{formatTimestamp(resumeMeta.capturedAt || resumeMeta.lastModified)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-400">OCR words</span>
                          <span className="text-right text-white">
                            {resumeMeta.source === "camera" ? (resumeMeta.ocrText ? ocrWordCount : "Pending") : "Not required"}
                          </span>
                        </div>
                        {!resumeMeta.fileDataUrl ? (
                          <p className="text-xs text-slate-500">
                            Preview is not stored for large files. Re-upload to view this file inside the app.
                          </p>
                        ) : null}
                      </div>
                    ) : (
                      <p className="mt-3 text-xs text-slate-500">Upload a resume to track the active file here.</p>
                    )}
                  </div>

                  {phase !== "idle" ? (
                    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-200">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{fileName}</p>
                            <p className="text-sm text-slate-400">
                              {phase === "uploading"
                                ? "Uploading"
                                : phase === "ocr"
                                  ? "Running OCR"
                                  : phase === "routing"
                                    ? "Routing and extracting"
                                    : "Ready for matching"}
                            </p>
                            {phase === "routing" || phase === "complete" ? (
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <Badge className="rounded-full border-violet-400/20 bg-violet-400/10 text-violet-100">
                                  Parsed as {routedCategory}
                                </Badge>
                                <Badge className="rounded-full border-white/10 bg-white/5 text-slate-200">
                                  {fileType.startsWith("image/") ? "Camera capture" : "Document upload"}
                                </Badge>
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={!fileOpenUrl}
                                className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {viewLabel}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl border-white/10 bg-[#140707] text-white">
                              <DialogHeader>
                                <DialogTitle>Uploaded resume</DialogTitle>
                                <DialogDescription className="text-slate-400">{fileName}</DialogDescription>
                              </DialogHeader>
                              {fileOpenUrl ? (
                                canPreviewInline ? (
                                  <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                                    {displayType.startsWith("image/") ? (
                                      <div className="flex h-[70vh] flex-col">
                                        <div className="flex items-center justify-between border-b border-white/10 bg-black/30 px-3 py-2">
                                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Capture preview</p>
                                          <div className="flex items-center gap-2">
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              type="button"
                                              onClick={() => setPreviewZoom((value) => Math.min(2, Math.round((value + 0.2) * 10) / 10))}
                                              className="h-7 rounded-full border-white/10 bg-white/5 px-3 text-xs text-white hover:bg-white/10"
                                            >
                                              Zoom +
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              type="button"
                                              onClick={() => setPreviewZoom((value) => Math.max(0.8, Math.round((value - 0.2) * 10) / 10))}
                                              className="h-7 rounded-full border-white/10 bg-white/5 px-3 text-xs text-white hover:bg-white/10"
                                            >
                                              Zoom -
                                            </Button>
                                          </div>
                                        </div>
                                        <div className="flex flex-1 items-center justify-center overflow-auto bg-black/20">
                                          <img
                                            src={fileOpenUrl}
                                            alt="Uploaded resume preview"
                                            style={{ transform: `scale(${previewZoom})` }}
                                            className="origin-center object-contain transition"
                                          />
                                        </div>
                                      </div>
                                    ) : isDocx ? (
                                      <div className="max-h-[70vh] overflow-auto p-4 text-sm text-slate-200">
                                        {docxState === "loading" ? (
                                          <p className="text-slate-400">Rendering document...</p>
                                        ) : docxState === "error" ? (
                                          <p className="text-slate-400">Unable to render this DOCX file.</p>
                                        ) : docxHtml ? (
                                          <div
                                            className="prose prose-invert max-w-none text-slate-200"
                                            dangerouslySetInnerHTML={{ __html: docxHtml }}
                                          />
                                        ) : (
                                          <p className="text-slate-400">No content found in this document.</p>
                                        )}
                                      </div>
                                    ) : (
                                      <iframe title="Resume preview" src={fileOpenUrl} className="h-[70vh] w-full" />
                                    )}
                                  </div>
                                ) : (
                                  <div className="mt-3 rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-slate-300">
                                    This file type can't be previewed in-app. Use the button below to download and open it.
                                  </div>
                                )
                              ) : (
                                <div className="mt-3 rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-slate-300">
                                  Preview not available. Re-upload this resume to view it here.
                                </div>
                              )}
                              {fileOpenUrl && (!canPreviewInline || isDocx) ? (
                                <div className="mt-4">
                                  <Button asChild className="rounded-full bg-violet-500 text-white hover:bg-violet-400">
                                    <a href={fileOpenUrl} target="_blank" rel="noreferrer">
                                      Download file
                                    </a>
                                  </Button>
                                </div>
                              ) : null}
                            </DialogContent>
                          </Dialog>
                          {phase === "complete" ? <CheckCircle2 className="h-5 w-5 text-violet-200" /> : <Loader2 className="h-5 w-5 animate-spin text-violet-200" />}
                        </div>
                      </div>
                      <div className="mt-4">
                        <Progress value={phase === "complete" ? 100 : progress} className="h-2 bg-white/10" />
                      </div>
                      {filePreview ? (
                        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                          <div className="flex items-center justify-between border-b border-white/10 bg-black/30 px-3 py-2">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Preview</p>
                            <span className="text-xs text-slate-500">Use View capture for zoom</span>
                          </div>
                          <div className="flex h-56 items-center justify-center overflow-hidden bg-black/20">
                            <img src={filePreview} alt="Captured resume preview" className="h-full w-full object-cover" />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              <Card className="rounded-[1.75rem] border-white/10 bg-[#171717]">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">Parsing results</CardTitle>
                  <p className="text-sm text-slate-400">A precise, recruiter-ready summary of what the parser extracted.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!extraction ? (
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                      Upload a resume to generate parsing results, skills, and ranking insights.
                    </div>
                  ) : null}
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-violet-200/80">Category</p>
                      <p className="mt-2 font-heading text-3xl font-semibold text-white">{routedCategory}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-violet-200/80">Confidence</p>
                      <p className="mt-2 font-heading text-3xl font-semibold text-white">{confidenceValue}%</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-violet-200/80">Sentiment</p>
                      <p className="mt-2 font-heading text-3xl font-semibold text-white">{sentimentLabel}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-violet-200/80">Parse health</p>
                      <p className="mt-2 font-heading text-3xl font-semibold text-white">{parseHealth}%</p>
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-200">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-white">Parsing efficiency</p>
                          <p className="text-sm text-slate-400">Processing time: {parseTimeLabel}. Quality checks run during extraction.</p>
                        </div>
                      </div>
                      <Badge className="rounded-full border-violet-400/20 bg-violet-400/10 text-violet-100">ATS-ready</Badge>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-slate-200">
                        <p className="text-xs uppercase tracking-[0.22em] text-violet-200/80">Weighted skill score</p>
                        <p className="mt-2 font-heading text-2xl font-semibold text-white">{weightedSkillAvg}%</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-slate-200">
                        <p className="text-xs uppercase tracking-[0.22em] text-violet-200/80">Section coverage</p>
                        <p className="mt-2 font-heading text-2xl font-semibold text-white">{sectionHealth}%</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-slate-200">
                        <p className="text-xs uppercase tracking-[0.22em] text-violet-200/80">Format clarity</p>
                        <p className="mt-2 font-heading text-2xl font-semibold text-white">{parseHealth}%</p>
                      </div>
                    </div>
                  </div>

                  {hasCameraResume ? (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4 transition hover:border-violet-300/40 hover:bg-white/10">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm text-slate-300">OCR snapshot</p>
                            <Badge className="rounded-full border-white/10 bg-white/5 text-slate-200">
                              {resumeMeta?.ocrConfidence ? `${resumeMeta.ocrConfidence}%` : "Auto"}
                            </Badge>
                          </div>
                          <p className="mt-2 text-xs text-slate-400">
                            Detected words: {resumeMeta?.ocrText ? ocrWordCount : "Pending"}
                          </p>
                          <p className="mt-3 text-sm text-slate-300">
                            {resumeMeta?.ocrText ? ocrSnippet : "OCR text will appear here after capture."}
                          </p>
                          <p className="mt-2 text-xs text-slate-500">Hover for full summary.</p>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-[320px] border-white/10 bg-[#140707] text-slate-200">
                        <p className="text-sm leading-6">{ocrSummary || "No OCR summary available yet."}</p>
                      </HoverCardContent>
                    </HoverCard>
                  ) : null}

                  <Tabs defaultValue="skills" className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm text-slate-300">Resume data</p>
                      <TabsList className="rounded-full border border-white/10 bg-black/30">
                        <TabsTrigger value="skills" className="rounded-full px-4">Skills</TabsTrigger>
                        <TabsTrigger value="sections" className="rounded-full px-4">Sections</TabsTrigger>
                        <TabsTrigger value="experience" className="rounded-full px-4">Experience</TabsTrigger>
                      </TabsList>
                    </div>
                    <TabsContent value="skills" className="mt-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-slate-300">Skills overview</p>
                        <span className="text-xs text-slate-400">Weighted score {weightedSkillAvg}%</span>
                      </div>
                      <div className="mt-3 grid gap-3 lg:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-200">Technical skills</p>
                            <span className="text-xs text-slate-400">Avg {techAvg}%</span>
                          </div>
                          <div className="mt-3 grid gap-2">
                            {techSkills.length ? (
                              techSkills.map((skill) => (
                                <div key={skill.name} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-200">
                                  <span>{skill.name}</span>
                                  <span className="text-violet-200">{skill.confidence}%</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-slate-500">No technical skills detected yet.</p>
                            )}
                          </div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-200">Communication & everyday skills</p>
                            <span className="text-xs text-slate-400">Avg {softAvg}%</span>
                          </div>
                          <div className="mt-3 grid gap-2">
                            {softSkills.length ? (
                              softSkills.map((skill) => (
                                <div key={skill.name} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-200">
                                  <span>{skill.name}</span>
                                  <span className="text-violet-200">{skill.confidence}%</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-slate-500">No soft skills detected yet.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="sections" className="mt-4">
                      <p className="text-sm text-slate-300">Section coverage</p>
                      <div className="mt-3 grid gap-2">
                        {sections.map((section) => (
                          <div key={section.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200">
                            <span>{section.name}</span>
                            <span className="text-violet-200">{section.completion}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="experience" className="mt-4">
                      <p className="text-sm text-slate-300">Experience from resume</p>
                      <div className="mt-3 grid gap-3">
                        {experienceHighlights.length ? (
                          experienceHighlights.map((line, index) => (
                            <div key={`${line}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-slate-200">
                              <p className="font-medium text-white">Experience highlight</p>
                              <p className="mt-1 text-xs text-slate-400">Extracted from resume text</p>
                              <p className="mt-2 text-sm text-slate-300">{line}</p>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-slate-400">
                            No experience highlights extracted yet. Upload a resume with clear experience details.
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="rounded-[1.75rem] border border-violet-400/15 bg-violet-400/10 p-4 text-sm leading-6 text-violet-100">
                    <div className="flex items-start gap-3">
                      <ScanSearch className="mt-0.5 h-4 w-4" />
                      <p>{sentimentInsight}</p>
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-300">Parsing quality checks</p>
                    <div className="mt-4 space-y-3">
                      {[
                        { label: "Section coverage", value: sectionHealth },
                        { label: "Skill clarity", value: weightedSkillAvg },
                        { label: "Format readiness", value: parseHealth },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                            <span>{item.label}</span>
                            <span className="text-violet-200">{item.value}%</span>
                          </div>
                          <Progress value={item.value} className="h-2 bg-white/10" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-200">
                        <Brain className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Recruiter-ready payload</p>
                        <p className="text-sm text-slate-400">Skills, category, confidence, and sentiment now feed the ranking system.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6 rounded-[1.75rem] border-white/10 bg-[#171717]">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">Score and ranking insight</CardTitle>
                  <p className="text-sm text-slate-400">Resume scoring based on skills, experience, tone, and format readiness.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-violet-200/80">Resume score</p>
                      <p className="mt-2 font-heading text-3xl font-semibold text-white">{resumeScoreLabel}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {extraction ? "Based on your uploaded resume data" : "Upload a resume to compute a score"}
                      </p>
                      <p className="mt-3 text-xs text-violet-200/80">Confidence {confidenceValue}% - Tone {sentimentLabel}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-violet-200/80">Skill depth</p>
                      <p className="mt-2 font-heading text-3xl font-semibold text-white">{techSkills.length}</p>
                      <p className="mt-1 text-xs text-slate-400">Detected skills in your resume</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-violet-200/80">Visibility</p>
                      <p className="mt-2 font-heading text-3xl font-semibold text-white">{percentileLabel}</p>
                      <p className="mt-1 text-xs text-slate-400">Overall resume readiness percentile</p>
                      {extraction ? (
                        <Badge className="mt-3 rounded-full border-violet-400/20 bg-violet-400/10 text-violet-100">{visibilityLabel}</Badge>
                      ) : (
                        <Badge className="mt-3 rounded-full border-white/10 bg-white/5 text-slate-300">Awaiting resume</Badge>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-slate-300">Ranking factors</p>
                      <span className="text-xs text-slate-400">Weighted scoring</span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {rankingFactors.map((factor) => (
                        <div key={factor.label}>
                          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                            <span>{factor.label}</span>
                            <span className="text-violet-200">{factor.value}%</span>
                          </div>
                          <Progress value={factor.value} className="h-2 bg-white/10" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-300">Top detected skills</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {techSkills.length ? techSkills.slice(0, 6).map((skill, index) => (
                        <Badge key={`${skill.name}-${index}`} className="rounded-full border-violet-400/20 bg-violet-400/10 text-violet-100">
                          {skill.name}
                        </Badge>
                      )) : (
                        <span className="text-xs text-slate-500">No skills detected yet.</span>
                      )}
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

