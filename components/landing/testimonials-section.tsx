"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    content: "Jobseek completely transformed our hiring process. We went from spending days on resume screening to minutes. The AI ranking is incredibly accurate.",
    author: "Jessica Martinez",
    role: "HR Director, TechCorp",
    avatar: "JM",
    rating: 5,
  },
  {
    content: "I uploaded my resume and within a week had three interview calls. The skill matching really works - every job I was matched with was relevant to my experience.",
    author: "David Park",
    role: "Software Engineer",
    avatar: "DP",
    rating: 5,
  },
  {
    content: "The sentiment analysis feature helped me improve my resume's tone. My match scores went up significantly after making the suggested changes.",
    author: "Amanda Foster",
    role: "Marketing Specialist",
    avatar: "AF",
    rating: 5,
  },
  {
    content: "As a startup, we needed to hire quickly without a dedicated HR team. Jobseek's automated candidate ranking saved us countless hours.",
    author: "Ryan Thompson",
    role: "CTO, StartupXYZ",
    avatar: "RT",
    rating: 5,
  },
  {
    content: "The auto-categorization is brilliant. Candidates are perfectly organized by job type, making it easy to find the right talent for each position.",
    author: "Lisa Chen",
    role: "Talent Acquisition Lead",
    avatar: "LC",
    rating: 5,
  },
  {
    content: "I was skeptical about AI-driven recruitment, but the results speak for themselves. Our time-to-hire has decreased by 60% since using Jobseek.",
    author: "Mark Williams",
    role: "VP of People, FinanceHub",
    avatar: "MW",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative bg-zinc-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-block rounded-full border border-lime-500/30 bg-lime-500/10 px-4 py-1.5 text-sm font-medium text-lime-300">
            Testimonials
          </span>
          <h2 className="mt-6 text-balance text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Loved by{" "}
            <span className="bg-gradient-to-r from-lime-300 to-lime-400 bg-clip-text text-transparent">
              thousands
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-zinc-400">
            See what job seekers and recruiters are saying about their experience with Jobseek.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group rounded-2xl border border-white/5 bg-white/5 p-6 transition-all hover:border-white/10 hover:bg-white/10"
            >
              {/* Rating */}
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-lime-300 text-lime-300" />
                ))}
              </div>
              
              {/* Content */}
              <p className="mt-4 text-pretty text-zinc-300">"{testimonial.content}"</p>
              
              {/* Author */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-violet-600 text-sm font-bold text-white">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-medium text-white">{testimonial.author}</p>
                  <p className="text-sm text-zinc-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
