export type UserRole = "seeker" | "recruiter"
export type SentimentLabel = "Confident" | "Balanced" | "Passive" | "Analytical"

export interface JobPosting {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary: string
  vacancies: number
  applicants: number
  posted: string
  category: string
  description: string
  requiredSkills: string[]
}

export interface CandidateScore {
  jobId: string
  score: number
  ranking: number
  matchedSkills: string[]
  missingSkills: string[]
  routeReason: string
}

export interface CandidateProfile {
  id: string
  name: string
  email: string
  currentRole: string
  location: string
  experience: string
  category: string
  availability: string
  sentiment: SentimentLabel
  summary: string
  skills: string[]
  strengths: string[]
  scorecard: CandidateScore[]
}

export const platformStats = [
  { value: "92%", label: "resume routing accuracy", detail: "Agent router sorts candidates before recruiter review starts." },
  { value: "8.9/10", label: "average match quality", detail: "Scoring blends skills, experience, and communication tone." },
  { value: "3.4x", label: "faster shortlist creation", detail: "Recruiters move from vacancy to ranked candidates in one flow." },
  { value: "24h", label: "time to first shortlist", detail: "Candidates are routed, ranked, and prepared for outreach quickly." },
]

export const platformFeatures = [
  {
    title: "Resume agent router",
    description: "Vision and parsing agents classify uploaded resumes, extract fields, and place candidates in the right job bucket.",
    accent: "from-cyan-400 via-sky-500 to-blue-600",
  },
  {
    title: "JD-aware ranker",
    description: "Each applicant gets a score out of 10 with matched skills, gaps, experience weighting, and ranking.",
    accent: "from-emerald-400 via-teal-500 to-cyan-600",
  },
  {
    title: "Sentiment intelligence",
    description: "The platform flags confident versus passive language so recruiters review communication quality too.",
    accent: "from-amber-300 via-orange-400 to-rose-500",
  },
  {
    title: "Formal outreach system",
    description: "Recruiters can shortlist the top candidates for each vacancy and send polished emails in one click.",
    accent: "from-fuchsia-400 via-violet-500 to-purple-600",
  },
]

export const routerStages = [
  { title: "1. Intake and OCR", detail: "Camera capture or file upload enters a vision-enabled resume intake layer." },
  { title: "2. Resume routing", detail: "The agent router classifies candidates into frontend, backend, AI, and other hiring lanes." },
  { title: "3. Match scoring", detail: "LangChain-style orchestration compares extracted data with job descriptions and assigns a score out of 10." },
  { title: "4. Recruiter action", detail: "Recruiters see ranked candidates, sentiment, and a one-click shortlist mail action." },
]

export const recruiterJobs: JobPosting[] = [
  {
    id: "job-front-1",
    title: "Senior Frontend Engineer",
    company: "NovaForge Labs",
    location: "Remote",
    type: "Full-time",
    salary: "$135k - $165k",
    vacancies: 3,
    applicants: 42,
    posted: "2 days ago",
    category: "Frontend",
    description: "Own the React and TypeScript experience for a modern hiring platform.",
    requiredSkills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Design systems", "Framer Motion"],
  },
  {
    id: "job-back-1",
    title: "FastAPI Backend Engineer",
    company: "Gridline Talent",
    location: "Bengaluru",
    type: "Full-time",
    salary: "$110k - $145k",
    vacancies: 2,
    applicants: 29,
    posted: "4 days ago",
    category: "Backend",
    description: "Build FastAPI services for resume ingestion, ranking, and recruiter workflows.",
    requiredSkills: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "API design"],
  },
  {
    id: "job-full-1",
    title: "Full Stack Product Engineer",
    company: "HirePilot AI",
    location: "Hybrid",
    type: "Full-time",
    salary: "$125k - $155k",
    vacancies: 4,
    applicants: 38,
    posted: "3 days ago",
    category: "Full Stack",
    description: "Work across recruiter dashboards, scoring pipelines, and candidate experiences.",
    requiredSkills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Product thinking"],
  },
  {
    id: "job-ai-1",
    title: "Applied AI Engineer",
    company: "Signal Match Systems",
    location: "Remote",
    type: "Full-time",
    salary: "$145k - $180k",
    vacancies: 2,
    applicants: 24,
    posted: "1 week ago",
    category: "AI",
    description: "Design LangChain pipelines, OpenRouter-powered ranking agents, and evaluation loops.",
    requiredSkills: ["Python", "LangChain", "OpenRouter", "Prompt engineering", "Embeddings", "Evaluation"],
  },
]

export const candidates: CandidateProfile[] = [
  {
    id: "cand-sarah",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    currentRole: "Lead Frontend Developer",
    location: "Pune, India",
    experience: "6 years",
    category: "Frontend",
    availability: "Immediate",
    sentiment: "Confident",
    summary: "Built recruiter-facing SaaS surfaces with strong accessibility and design-system depth.",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion", "GraphQL"],
    strengths: ["Strong portfolio language", "Excellent design systems", "High ownership signal"],
    scorecard: [
      {
        jobId: "job-front-1",
        score: 9.6,
        ranking: 1,
        matchedSkills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion"],
        missingSkills: ["Design systems leadership"],
        routeReason: "Frontend-heavy resume with advanced UI architecture and animation experience.",
      },
      {
        jobId: "job-full-1",
        score: 8.7,
        ranking: 2,
        matchedSkills: ["React", "TypeScript", "Product thinking"],
        missingSkills: ["Node.js", "AWS"],
        routeReason: "Strong UI product experience with enough cross-functional evidence for product roles.",
      },
    ],
  },
  {
    id: "cand-michael",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    currentRole: "Full Stack Engineer",
    location: "Singapore",
    experience: "5 years",
    category: "Full Stack",
    availability: "2 weeks",
    sentiment: "Confident",
    summary: "Balances frontend delivery with backend architecture and writes metric-driven case studies.",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker"],
    strengths: ["Balanced stack", "Product-first delivery", "Strong quantified impact"],
    scorecard: [
      {
        jobId: "job-full-1",
        score: 9.4,
        ranking: 1,
        matchedSkills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
        missingSkills: ["Product thinking"],
        routeReason: "High overlap across product engineering stack with quantified launch metrics.",
      },
      {
        jobId: "job-front-1",
        score: 8.9,
        ranking: 2,
        matchedSkills: ["React", "TypeScript", "Tailwind CSS"],
        missingSkills: ["Framer Motion", "Design systems"],
        routeReason: "Routing agent marked strong secondary fit due to polished frontend portfolio work.",
      },
    ],
  },
  {
    id: "cand-emily",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    currentRole: "Backend Platform Engineer",
    location: "Hyderabad, India",
    experience: "7 years",
    category: "Backend",
    availability: "30 days",
    sentiment: "Balanced",
    summary: "Deep Python backend specialist with API performance tuning and reliable service design.",
    skills: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "Kubernetes"],
    strengths: ["Excellent API depth", "Reliable systems language", "Clear architecture communication"],
    scorecard: [
      {
        jobId: "job-back-1",
        score: 9.3,
        ranking: 1,
        matchedSkills: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker"],
        missingSkills: ["API design"],
        routeReason: "Backend parser detected direct overlap with FastAPI services and data workflows.",
      },
      {
        jobId: "job-ai-1",
        score: 7.6,
        ranking: 4,
        matchedSkills: ["Python"],
        missingSkills: ["LangChain", "OpenRouter", "Evaluation"],
        routeReason: "Good systems base, but LLM-specific evidence is thinner than specialist candidates.",
      },
    ],
  },
  {
    id: "cand-priya",
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    currentRole: "AI Product Engineer",
    location: "Delhi, India",
    experience: "4 years",
    category: "AI",
    availability: "2 weeks",
    sentiment: "Analytical",
    summary: "Ships LLM workflows end-to-end with prompt evaluation and thoughtful experiment design.",
    skills: ["Python", "LangChain", "OpenRouter", "FastAPI", "Embeddings", "Evaluation"],
    strengths: ["Excellent agent workflow depth", "Strong evaluation mindset", "Good product framing"],
    scorecard: [
      {
        jobId: "job-ai-1",
        score: 9.5,
        ranking: 1,
        matchedSkills: ["Python", "LangChain", "OpenRouter", "Embeddings", "Evaluation"],
        missingSkills: ["Prompt engineering"],
        routeReason: "Agent router flagged AI-first profile with direct LLM orchestration experience.",
      },
      {
        jobId: "job-back-1",
        score: 8.1,
        ranking: 3,
        matchedSkills: ["Python", "FastAPI"],
        missingSkills: ["Redis", "PostgreSQL"],
        routeReason: "Strong platform-adjacent backend skills, but thinner data-service depth than specialists.",
      },
    ],
  },
  {
    id: "cand-david",
    name: "David Park",
    email: "david.park@email.com",
    currentRole: "Frontend Engineer",
    location: "Seoul, South Korea",
    experience: "4 years",
    category: "Frontend",
    availability: "Immediate",
    sentiment: "Passive",
    summary: "Strong React craft and performance tuning, but resume language undersells ownership and impact.",
    skills: ["React", "Redux", "Next.js", "TypeScript", "Jest", "Cypress"],
    strengths: ["Great code depth", "Testing maturity", "Consistent UI delivery"],
    scorecard: [
      {
        jobId: "job-front-1",
        score: 8.6,
        ranking: 3,
        matchedSkills: ["React", "Next.js", "TypeScript"],
        missingSkills: ["Tailwind CSS", "Framer Motion", "Design systems"],
        routeReason: "Router marked frontend primary, but passive language softened the final rank.",
      },
      {
        jobId: "job-full-1",
        score: 7.9,
        ranking: 4,
        matchedSkills: ["React", "TypeScript"],
        missingSkills: ["Node.js", "AWS", "PostgreSQL"],
        routeReason: "Solid UI match but limited backend evidence.",
      },
    ],
  },
]

export const seekerProfile = {
  name: "Aarav Mehta",
  title: "Product-focused Frontend Developer",
  email: "seeker@test.com",
  location: "Ahmedabad, India",
  about:
    "Frontend developer focused on polished product experiences, strong component systems, and measurable UX improvements across modern web apps.",
  category: "Frontend",
  score: 8.8,
  completion: 86,
  experience: [
    {
      role: "Frontend Engineer",
      company: "PixelSprint",
      period: "2023 - Present",
      description: "Built dashboard experiences with React, TypeScript, motion systems, and improved task completion by 22%.",
    },
    {
      role: "UI Developer",
      company: "CloudMint",
      period: "2021 - 2023",
      description: "Delivered reusable components and improved accessibility coverage for customer-facing products.",
    },
  ],
  education: [{ degree: "B.Tech in Computer Engineering", school: "Nirma University", year: "2021" }],
  skills: [
    { name: "React", level: 96 },
    { name: "TypeScript", level: 92 },
    { name: "Next.js", level: 89 },
    { name: "Tailwind CSS", level: 91 },
    { name: "Framer Motion", level: 80 },
    { name: "Node.js", level: 68 },
  ],
  sentiment: {
    label: "Confident" as SentimentLabel,
    score: 8.7,
    traits: ["Action-oriented", "Outcome-focused", "Clear ownership language"],
  },
}

export const seekerResumeExtraction = {
  routedCategory: "Frontend",
  documentType: "PDF resume",
  confidence: 94,
  extractedSkills: [
    { name: "React", confidence: 97 },
    { name: "TypeScript", confidence: 95 },
    { name: "Next.js", confidence: 92 },
    { name: "Tailwind CSS", confidence: 90 },
    { name: "Framer Motion", confidence: 81 },
    { name: "Node.js", confidence: 68 },
  ],
  sections: [
    { name: "Contact and links", completion: "Complete" },
    { name: "Experience", completion: "Strong" },
    { name: "Projects", completion: "Needs one more flagship project" },
    { name: "Achievements", completion: "Good quantified impact" },
  ],
  sentiment: {
    label: "Confident" as SentimentLabel,
    score: 8.7,
    insights: [
      "Action verbs and measurable outcomes are strong across the experience section.",
      "Leadership cues are present but could be surfaced earlier in the resume.",
      "Portfolio links would strengthen recruiter confidence during quick review.",
    ],
  },
}

export const seekerJobMatches = [
  {
    id: "job-front-1",
    title: "Senior Frontend Engineer",
    company: "NovaForge Labs",
    location: "Remote",
    type: "Full-time",
    salary: "$135k - $165k",
    posted: "2 days ago",
    applicants: 42,
    match: 96,
    matchedSkills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Framer Motion"],
    missingSkills: ["Design systems leadership"],
    summary: "High fit based on UI depth, modern stack alignment, and confident portfolio language.",
  },
  {
    id: "job-full-1",
    title: "Full Stack Product Engineer",
    company: "HirePilot AI",
    location: "Hybrid",
    type: "Full-time",
    salary: "$125k - $155k",
    posted: "3 days ago",
    applicants: 38,
    match: 89,
    matchedSkills: ["React", "TypeScript", "Product thinking"],
    missingSkills: ["Node.js depth", "AWS"],
    summary: "Great product signal with some backend gaps that can be offset by frontend excellence.",
  },
  {
    id: "job-back-1",
    title: "FastAPI Backend Engineer",
    company: "Gridline Talent",
    location: "Bengaluru",
    type: "Full-time",
    salary: "$110k - $145k",
    posted: "4 days ago",
    applicants: 29,
    match: 67,
    matchedSkills: ["API collaboration"],
    missingSkills: ["Python", "FastAPI", "Redis"],
    summary: "Low fit today, but still visible because your resume shows strong product collaboration.",
  },
]

export const seekerApplications = [
  {
    id: "app-1",
    company: "NovaForge Labs",
    position: "Senior Frontend Engineer",
    status: "reviewing" as const,
    date: "March 23, 2026",
    score: 9.6,
    email: "talent@novaforge.ai",
  },
  {
    id: "app-2",
    company: "HirePilot AI",
    position: "Full Stack Product Engineer",
    status: "accepted" as const,
    date: "March 18, 2026",
    score: 8.9,
    email: "recruiting@hirepilot.ai",
  },
  {
    id: "app-3",
    company: "Gridline Talent",
    position: "FastAPI Backend Engineer",
    status: "pending" as const,
    date: "March 21, 2026",
    score: 6.7,
    email: "careers@gridlinetalent.com",
  },
]

export function getRankedCandidates(jobId: string) {
  return candidates
    .map((candidate) => {
      const jobScore = candidate.scorecard.find((entry) => entry.jobId === jobId)
      return jobScore ? { ...candidate, jobScore } : null
    })
    .filter(Boolean)
    .sort((a, b) => b!.jobScore.score - a!.jobScore.score)
}

export function getTopCandidatesForOpenings(jobId: string) {
  const job = recruiterJobs.find((item) => item.id === jobId)
  if (!job) return []
  return getRankedCandidates(jobId).slice(0, job.vacancies)
}

export function getRecruiterSummary() {
  const totalApplicants = recruiterJobs.reduce((sum, job) => sum + job.applicants, 0)
  const scores = recruiterJobs.flatMap((job) => getRankedCandidates(job.id).map((candidate) => candidate!.jobScore.score))
  const averageScore = scores.length > 0 ? (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1) : "0.0"

  return {
    activeJobs: recruiterJobs.length,
    totalApplicants,
    averageScore,
    shortlistCount: recruiterJobs.reduce((sum, job) => sum + job.vacancies, 0),
  }
}

export function buildOfferTemplate(candidateName: string, jobTitle: string, company: string) {
  return [
    `Dear ${candidateName},`,
    "",
    `Thank you for applying for the ${jobTitle} role at ${company}.`,
    "",
    "After reviewing your resume against our shortlist criteria, we are pleased to inform you that you have been selected for the next stage of the process.",
    "",
    "Your profile stood out for its skill alignment, relevant experience, and communication quality.",
    "",
    "Please reply to this email with your availability for an interview this week.",
    "",
    "Best regards,",
    "Smart Recruitment Hiring Team",
  ].join("\n")
}
