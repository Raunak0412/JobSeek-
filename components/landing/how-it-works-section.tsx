"use client"

import { motion } from "framer-motion"
import { Upload, Search, CheckCircle, Send } from "lucide-react"

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Your Resume",
    description: "Use your camera or file picker to upload your resume. Our AI instantly extracts your skills, experience, and qualifications.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    step: "02",
    icon: Search,
    title: "AI Analyzes & Matches",
    description: "Our intelligent algorithms match your profile against thousands of job listings, categorizing you into relevant fields.",
    color: "from-purple-500 to-pink-500",
  },
  {
    step: "03",
    icon: CheckCircle,
    title: "Get Ranked & Scored",
    description: "Receive a score out of 10 based on how well you match each position. Understand your strengths and areas for improvement.",
    color: "from-pink-500 to-cyan-500",
  },
  {
    step: "04",
    icon: Send,
    title: "Connect with Recruiters",
    description: "Top candidates receive automated formal emails from recruiters. Track your application status in real-time.",
    color: "from-cyan-500 to-indigo-500",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative bg-zinc-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-400">
            How It Works
          </span>
          <h2 className="mt-6 text-balance text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Your path to the{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              perfect job
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-zinc-400">
            Four simple steps to connect you with your ideal career opportunity.
          </p>
        </motion.div>

        <div className="mt-16 lg:mt-24">
          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-indigo-500 via-purple-500 to-cyan-500 opacity-20 lg:block" />
            
            <div className="space-y-12 lg:space-y-24">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex flex-col items-center gap-8 lg:flex-row ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                    <div className={`inline-flex items-center gap-3 ${index % 2 === 0 ? "lg:flex-row-reverse" : ""}`}>
                      <span className={`bg-gradient-to-r ${step.color} bg-clip-text text-5xl font-bold text-transparent`}>
                        {step.step}
                      </span>
                      <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="mt-4 max-w-md text-zinc-400 lg:mx-0">
                      {index % 2 === 0 ? (
                        <span className="lg:ml-auto lg:block">{step.description}</span>
                      ) : (
                        step.description
                      )}
                    </p>
                  </div>

                  {/* Icon */}
                  <div className="relative flex items-center justify-center">
                    <div className={`absolute h-24 w-24 rounded-full bg-gradient-to-br ${step.color} opacity-20 blur-xl`} />
                    <div className={`relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} p-0.5`}>
                      <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-zinc-950">
                        <step.icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden flex-1 lg:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
