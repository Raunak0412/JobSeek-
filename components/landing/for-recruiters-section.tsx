"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  ArrowRight, 
  FileSearch, 
  ListOrdered, 
  MailCheck, 
  PieChart,
  Filter,
  Clock
} from "lucide-react"

const benefits = [
  {
    icon: FileSearch,
    title: "Auto-Categorized Resumes",
    description: "Resumes are automatically sorted by job category and skill match.",
  },
  {
    icon: ListOrdered,
    title: "AI-Ranked Candidates",
    description: "View candidates ranked by score, experience, and skill alignment.",
  },
  {
    icon: Filter,
    title: "Smart Filtering",
    description: "Filter candidates by skills, experience level, and match score.",
  },
  {
    icon: PieChart,
    title: "Analytics Dashboard",
    description: "Track application metrics, conversion rates, and hiring pipeline.",
  },
  {
    icon: MailCheck,
    title: "Bulk Email Outreach",
    description: "Send formal selection emails to top candidates with one click.",
  },
  {
    icon: Clock,
    title: "Save 80% Time",
    description: "Reduce resume screening time from hours to minutes.",
  },
]

export function ForRecruitersSection() {
  return (
    <section id="for-recruiters" className="relative overflow-hidden bg-zinc-950 py-24 sm:py-32">
      {/* Background decoration */}
      <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute left-0 bottom-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <span className="inline-block w-fit rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
              For Recruiters
            </span>
            <h2 className="mt-6 text-balance text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Hire smarter,{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                not harder
              </span>
            </h2>
            <p className="mt-4 text-pretty text-lg text-zinc-400">
              Post your job requirements and let AI do the heavy lifting. Get a sorted, ranked list of candidates 
              with detailed skill matching and sentiment analysis.
            </p>
            
            <div className="mt-8">
              <Link href="/auth/register?type=recruiter">
                <Button
                  size="lg"
                  className="group h-12 gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 text-base font-semibold text-white hover:from-emerald-600 hover:to-cyan-600"
                >
                  Start Hiring Today
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {/* Preview card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              <h4 className="text-sm font-medium text-zinc-400">Sample Candidate Ranking</h4>
              <div className="mt-4 space-y-3">
                {[
                  { name: "Sarah Johnson", score: 9.4, skills: "React, Node.js, AWS" },
                  { name: "Michael Chen", score: 8.8, skills: "Python, ML, TensorFlow" },
                  { name: "Emily Davis", score: 8.2, skills: "Java, Spring, Docker" },
                ].map((candidate, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-xs font-bold text-white">
                        #{i + 1}
                      </div>
                      <div>
                        <p className="font-medium text-white">{candidate.name}</p>
                        <p className="text-xs text-zinc-500">{candidate.skills}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-400">{candidate.score}</p>
                      <p className="text-xs text-zinc-500">Score</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right content - Benefits grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group rounded-xl border border-white/5 bg-white/5 p-5 transition-all hover:border-white/10 hover:bg-white/10"
              >
                <benefit.icon className="h-6 w-6 text-cyan-400" />
                <h3 className="mt-3 font-semibold text-white">{benefit.title}</h3>
                <p className="mt-1 text-sm text-zinc-400">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
