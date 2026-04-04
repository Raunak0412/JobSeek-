"use client"

import { useEffect, useMemo, useState, type ChangeEvent, type KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { MapPin, Pencil, Sparkles } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import { seekerProfile } from "@/lib/mock-data"
import { getSeekerAvatarSrc, seekerAvatarStyles, useSeekerProfileDetails } from "@/lib/seeker-profile"
import { useResumeExtraction, useResumeMeta } from "@/lib/demo-store"

type EditableField = "email" | "github" | "linkedin" | "portfolio" | "availability"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const resumeExtraction = useResumeExtraction()
  const resumeMeta = useResumeMeta()
  const averageSkill = resumeExtraction?.extractedSkills.length
    ? Math.round(resumeExtraction.extractedSkills.reduce((sum, skill) => sum + skill.confidence, 0) / resumeExtraction.extractedSkills.length)
    : 0
  const sectionStrength = resumeExtraction?.sections.filter((section) => !section.completion.toLowerCase().includes("needs")).length ?? 0
  const profileCompletion = resumeExtraction?.sections.length ? Math.round((sectionStrength / resumeExtraction.sections.length) * 100) : 0
  const profileScore = resumeExtraction ? Math.round(((resumeExtraction.confidence / 10 + resumeExtraction.sentiment.score) / 2) * 10) / 10 : 0
  const categoryTitleMap: Record<string, string> = {
    Frontend: "Product-focused Frontend Developer",
    Backend: "Backend Platform Engineer",
    "Full Stack": "Full Stack Product Engineer",
    Data: "Data Platform Engineer",
    Finance: "Finance Analyst",
    AI: "Applied AI Engineer",
    Design: "Product Design Lead",
    "Game Development": "Game Development Engineer",
    General: seekerProfile.title,
  }
  const computedTitle = resumeExtraction ? categoryTitleMap[resumeExtraction.routedCategory] ?? seekerProfile.title : seekerProfile.title
  const signalScores = [
    { label: "Skill depth", value: averageSkill },
    { label: "Tone confidence", value: resumeExtraction ? Math.round(resumeExtraction.sentiment.score * 10) : 0 },
    { label: "Profile completeness", value: profileCompletion },
  ]
  const experienceHighlights = useMemo(() => {
    const resumeText = resumeMeta?.extractedText || resumeMeta?.ocrText || ""
    if (!resumeText) return []
    return resumeText
      .split(/\n+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 10)
      .filter((line) => /\b(20\d{2}|19\d{2})\b/.test(line) || /(experience|engineer|developer|designer|intern|lead)/i.test(line))
      .slice(0, 4)
  }, [resumeMeta?.extractedText, resumeMeta?.ocrText])

  const [profileDetails, setProfileDetails] = useSeekerProfileDetails()
  const [editingField, setEditingField] = useState<EditableField | null>(null)
  const avatarSrc = useMemo(() => getSeekerAvatarSrc(user?.name ?? seekerProfile.name, profileDetails), [profileDetails, user?.name])

  const normalizeUrl = (value: string) => {
    if (!value) return ""
    return value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`
  }

  const handleFieldKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      setEditingField(null)
    }
  }

  const updateProfileField = (field: EditableField, value: string) => {
    setProfileDetails((current) => ({ ...current, [field]: value }))
  }

  const handleOpenLink = (value: string) => {
    if (!value) return
    window.open(normalizeUrl(value), "_blank", "noreferrer")
  }

  const handleOpenEmail = (value: string) => {
    if (!value) return
    window.location.href = `mailto:${value}`
  }

  const renderEditableField = ({
    field,
    label,
    value,
    placeholder,
    emptyLabel,
    onOpen,
  }: {
    field: EditableField
    label: string
    value: string
    placeholder: string
    emptyLabel: string
    onOpen?: (value: string) => void
  }) => (
    <div className="space-y-2">
      <p className="text-sm text-slate-300">{label}</p>
      {editingField === field ? (
        <Input
          autoFocus
          value={value}
          onChange={(event) => updateProfileField(field, event.target.value)}
          onBlur={() => setEditingField(null)}
          onKeyDown={handleFieldKeyDown}
          placeholder={placeholder}
          className="h-11 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-slate-500"
        />
      ) : (
        <div className="flex items-center gap-2">
          {onOpen ? (
            <button
              type="button"
              onClick={() => value && onOpen(value)}
              disabled={!value}
              title={value || emptyLabel}
              className={`flex h-11 min-w-0 flex-1 items-center rounded-xl border border-white/10 bg-white/5 px-4 text-left text-sm transition ${
                value ? "text-slate-200 hover:border-violet-300/40 hover:bg-white/10" : "cursor-default text-slate-500"
              }`}
            >
              <span className="truncate">{value || emptyLabel}</span>
            </button>
          ) : (
            <div title={value || emptyLabel} className="flex h-11 min-w-0 flex-1 items-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm">
              <span className={`truncate ${value ? "text-slate-200" : "text-slate-500"}`}>{value || emptyLabel}</span>
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setEditingField(field)}
            className="h-11 w-11 shrink-0 rounded-xl border-white/10 bg-white/5 text-slate-200 shadow-none hover:border-violet-300/40 hover:bg-white/10 hover:text-white"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit {label}</span>
          </Button>
        </div>
      )}
    </div>
  )

  const onPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setProfileDetails((current) => ({ ...current, photoDataUrl: reader.result as string }))
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth/login")
  }, [isLoading, router, user])

  if (isLoading) return null

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <Sidebar type="seeker" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title="Profile" onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 space-y-6 p-4 lg:p-6">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <Badge className="rounded-full border-violet-400/20 bg-violet-400/10 text-violet-100">{resumeExtraction?.routedCategory ?? "Resume"} profile</Badge>
                <h2 className="mt-5 font-heading text-4xl font-semibold tracking-tight">{user?.name ?? seekerProfile.name}</h2>
                <p className="mt-2 text-lg text-violet-100">{computedTitle}</p>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">{seekerProfile.about}</p>
                {resumeMeta ? <p className="mt-3 text-xs uppercase tracking-[0.22em] text-violet-200/70">Latest resume: {resumeMeta.fileName}</p> : null}
                <p className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                  <MapPin className="h-4 w-4 text-violet-300" />
                  {seekerProfile.location}
                </p>
              </div>
              <div className="text-right">
                <p className="font-heading text-5xl font-semibold tracking-tight">{profileScore}</p>
                <p className="text-xs uppercase tracking-[0.24em] text-violet-200">AI score out of 10</p>
              </div>
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}>
            <Card className="rounded-[1.75rem] border-white/10 bg-[#171717]">
              <CardHeader>
                <CardTitle className="font-heading text-2xl">Profile details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                      <img src={avatarSrc} alt="Profile avatar" className="h-full w-full object-cover" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-slate-300">Avatar style</div>
                      <div className="flex flex-wrap gap-2">
                        {seekerAvatarStyles.map((style) => (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => setProfileDetails((current) => ({ ...current, avatarStyle: style.id, photoDataUrl: "" }))}
                            className={`h-10 w-10 rounded-xl border border-white/10 transition ${profileDetails.avatarStyle === style.id ? "ring-2 ring-violet-300/70" : "hover:border-violet-300/40"}`}
                            style={{ background: `linear-gradient(135deg, ${style.from}, ${style.to})` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm text-slate-300">
                      Upload photo
                      <Input type="file" accept="image/*" onChange={onPhotoChange} className="mt-2 h-10 rounded-xl border-white/10 bg-white/5 text-sm text-white" />
                    </label>
                    {profileDetails.photoDataUrl ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setProfileDetails((current) => ({ ...current, photoDataUrl: "" }))}
                        className="h-10 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
                      >
                        Remove photo
                      </Button>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {renderEditableField({
                    field: "email",
                    label: "Email",
                    value: profileDetails.email,
                    placeholder: "name@email.com",
                    emptyLabel: "Add email address",
                    onOpen: handleOpenEmail,
                  })}

                  {renderEditableField({
                    field: "github",
                    label: "GitHub",
                    value: profileDetails.github,
                    placeholder: "github.com/username",
                    emptyLabel: "Add GitHub link",
                    onOpen: handleOpenLink,
                  })}

                  {renderEditableField({
                    field: "linkedin",
                    label: "LinkedIn",
                    value: profileDetails.linkedin,
                    placeholder: "linkedin.com/in/username",
                    emptyLabel: "Add LinkedIn link",
                    onOpen: handleOpenLink,
                  })}

                  {renderEditableField({
                    field: "portfolio",
                    label: "Portfolio",
                    value: profileDetails.portfolio,
                    placeholder: "portfolio link",
                    emptyLabel: "Add portfolio link",
                    onOpen: handleOpenLink,
                  })}
                </div>

                <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-2">
                    <p className="text-sm text-slate-300">Contact note</p>
                    <textarea
                      value={profileDetails.contactNote}
                      onChange={(event) => setProfileDetails((current) => ({ ...current, contactNote: event.target.value }))}
                      placeholder="Tell recruiters the best way to reach you."
                      rows={3}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:outline-none focus:ring-2 focus:ring-violet-300/40"
                    />
                  </div>
                  <div className="space-y-2">
                    {renderEditableField({
                      field: "availability",
                      label: "Availability",
                      value: profileDetails.availability,
                      placeholder: "Immediate / 2 weeks",
                      emptyLabel: "Add availability",
                    })}
                    <Button
                      type="button"
                      onClick={() => handleOpenEmail(profileDetails.email)}
                      disabled={!profileDetails.email}
                      className="h-11 w-full rounded-xl bg-violet-500 text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Contact me
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-slate-500">Click a contact detail to open it, or use the pencil icon to edit it. Changes save locally on this device.</p>
              </CardContent>
            </Card>
          </motion.section>

          <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-6">
              <Card className="rounded-[1.75rem] border-white/10 bg-[#171717]">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">AI-extracted skills</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resumeExtraction?.extractedSkills.length ? resumeExtraction.extractedSkills.map((skill) => (
                    <div key={skill.name}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-slate-200">{skill.name}</span>
                        <span className="text-violet-200">{skill.confidence}%</span>
                      </div>
                      <Progress value={skill.confidence} className="h-2 bg-white/10" />
                    </div>
                  )) : (
                    <p className="text-sm text-slate-500">No skills parsed yet.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-[1.75rem] border-white/10 bg-[#171717]">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">Experience overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-slate-400">
                    Describe the experience you want recruiters to notice first. This is editable and fully yours.
                  </p>
                  <textarea
                    value={profileDetails.experienceOverview}
                    onChange={(event) => setProfileDetails((current) => ({ ...current, experienceOverview: event.target.value }))}
                    placeholder={experienceHighlights.length ? experienceHighlights.join(" | ") : "Add your top roles, projects, or impact highlights."}
                    rows={5}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 transition focus:outline-none focus:ring-2 focus:ring-violet-300/40"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="rounded-[1.75rem] border-white/10 bg-[#171717]">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">Recruiter signals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {signalScores.map((signal) => (
                    <div key={signal.label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-slate-200">{signal.label}</span>
                        <span className="text-violet-200">{signal.value}%</span>
                      </div>
                      <Progress value={signal.value} className="h-2 bg-white/10" />
                    </div>
                  ))}
                  <div className="rounded-[1.6rem] border border-violet-400/15 bg-violet-400/10 p-4 text-sm leading-6 text-violet-100">
                    <div className="flex items-start gap-3">
                      <Sparkles className="mt-0.5 h-4 w-4" />
                      <p>Highlighting one more quantified impact will push your signal strength higher.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[1.75rem] border-white/10 bg-[#171717]">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">Sentiment and confidence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400">Resume tone</p>
                        <p className="mt-1 font-heading text-3xl font-semibold">{resumeExtraction?.sentiment.label ?? "Pending"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">Confidence score</p>
                        <p className="mt-1 font-heading text-3xl font-semibold">{resumeExtraction?.sentiment.score ?? 0}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resumeExtraction?.sentiment.insights?.length ? (
                      resumeExtraction.sentiment.insights.map((trait) => (
                        <Badge key={trait} className="rounded-full border-lime-300/35 bg-lime-300/15 text-lime-100">
                          {trait}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">Upload a resume to see sentiment insights.</span>
                    )}
                  </div>
                </CardContent>
              </Card>


              <Card className="rounded-[1.75rem] border-white/10 bg-[#171717]">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">Profile completeness</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-slate-300">Completion</span>
                    <span className="text-violet-200">{profileCompletion}%</span>
                  </div>
                  <Progress value={profileCompletion} className="h-2 bg-white/10" />
                  <div className="mt-4 rounded-[1.6rem] border border-violet-400/15 bg-violet-400/10 p-4 text-sm leading-6 text-violet-100">
                    <div className="flex items-start gap-3">
                      <Sparkles className="mt-0.5 h-4 w-4" />
                      <p>One more flagship project and a stronger portfolio link section would raise recruiter confidence further.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}


