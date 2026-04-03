import { Skeleton } from "@/components/ui/skeleton"

export default function CandidateProfileLoading() {
  return (
    <div className="min-h-screen bg-[#150707] p-4 text-white lg:p-6">
      <div className="mx-auto max-w-[1400px] space-y-6">
        <Skeleton className="h-52 rounded-[2rem] border border-white/10 bg-white/5" />
        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
            <Skeleton className="h-60 rounded-[1.75rem] border border-white/10 bg-white/5" />
            <Skeleton className="h-96 rounded-[1.75rem] border border-white/10 bg-white/5" />
            <Skeleton className="h-72 rounded-[1.75rem] border border-white/10 bg-white/5" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 rounded-[1.75rem] border border-white/10 bg-white/5" />
            <Skeleton className="h-56 rounded-[1.75rem] border border-white/10 bg-white/5" />
            <Skeleton className="h-96 rounded-[1.75rem] border border-white/10 bg-white/5" />
          </div>
        </div>
      </div>
    </div>
  )
}
