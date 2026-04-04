"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-24 sm:py-32">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-transparent to-transparent" />
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-violet-500/20 via-violet-400/20 to-lime-500/20 blur-3xl" />
      
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-lime-500">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-balance text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Ready to transform your{" "}
            <span className="bg-gradient-to-r from-violet-400 via-violet-300 to-lime-300 bg-clip-text text-transparent">
              career journey?
            </span>
          </h2>
          
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-zinc-400">
            Join thousands of job seekers and recruiters who are already using AI to make smarter hiring decisions.
          </p>
          
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="group h-14 gap-2 bg-gradient-to-r from-violet-500 to-lime-500 px-10 text-lg font-semibold text-white transition-all hover:from-violet-400 hover:to-lime-400 hover:shadow-lg hover:shadow-violet-500/25"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="h-14 border-white/20 bg-white/5 px-10 text-lg font-semibold text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
              >
                Sign In
              </Button>
            </Link>
          </div>
          
          <p className="mt-6 text-sm text-zinc-500">
            No credit card required. Start matching with opportunities in minutes.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
