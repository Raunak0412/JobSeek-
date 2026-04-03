"use client"

import { motion } from "framer-motion"
import { 
  FileText, 
  Brain, 
  BarChart3, 
  Mail, 
  Users, 
  Shield,
  Zap,
  Target
} from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "Smart Resume Parsing",
    description: "Upload your resume via camera or file picker. Our AI extracts skills, experience, and qualifications instantly.",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    icon: Brain,
    title: "AI Skill Extraction",
    description: "Advanced NLP algorithms identify and categorize your skills, matching them with job requirements accurately.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: BarChart3,
    title: "Intelligent Ranking",
    description: "Get scored out of 10 based on how well your profile matches job descriptions. See where you stand.",
    gradient: "from-red-500 to-teal-500",
  },
  {
    icon: Target,
    title: "Sentiment Analysis",
    description: "AI analyzes resume tone - detecting confident vs passive language to help improve your presentation.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Users,
    title: "Auto-Categorization",
    description: "Resumes are automatically routed to relevant job categories, helping recruiters find candidates faster.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Mail,
    title: "Automated Outreach",
    description: "Recruiters can send formal selection emails to top candidates with a single click.",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Track your application status and receive instant notifications when recruiters view your profile.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data is encrypted and secure. Control who sees your information with granular privacy settings.",
    gradient: "from-slate-500 to-zinc-600",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function FeaturesSection() {
  return (
    <section id="features" className="relative bg-zinc-950 py-24 sm:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-block rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm font-medium text-red-400">
            Features
          </span>
          <h2 className="mt-6 text-balance text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-red-400 bg-clip-text text-transparent">
              land your dream job
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-zinc-400">
            Powered by cutting-edge AI technology, our platform streamlines the recruitment process for both job seekers and recruiters.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-white/10"
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} p-0.5`}>
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-zinc-950">
                  <feature.icon className={`h-5 w-5 bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`} style={{ color: 'currentColor' }} />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{feature.description}</p>
              
              {/* Hover glow effect */}
              <div className={`absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-10`} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
