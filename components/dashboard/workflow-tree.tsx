"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

type WorkflowNode = {
  id: string
  title: string
  subtitle: string
  x: number
  y: number
}

const nodes: WorkflowNode[] = [
  { id: "intake", title: "Resume intake", subtitle: "OCR + parser", x: 12, y: 16 },
  { id: "router", title: "Role router", subtitle: "Category classification", x: 38, y: 16 },
  { id: "scoring", title: "JD scorer", subtitle: "Match score + gaps", x: 64, y: 16 },
  { id: "ranker", title: "Rank board", subtitle: "Candidate ranking", x: 88, y: 16 },
  { id: "profile", title: "Profile page", subtitle: "Public seeker details", x: 30, y: 62 },
  { id: "outreach", title: "Mail studio", subtitle: "Formal outreach", x: 56, y: 62 },
  { id: "notify", title: "Notifications", subtitle: "Live updates", x: 82, y: 62 },
]

const edges: Array<[string, string]> = [
  ["intake", "router"],
  ["router", "scoring"],
  ["scoring", "ranker"],
  ["router", "profile"],
  ["scoring", "outreach"],
  ["ranker", "outreach"],
  ["outreach", "notify"],
]

const nodeMap = new Map(nodes.map((node) => [node.id, node]))

export function WorkflowTree() {
  return (
    <div className="relative h-[370px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/20">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {edges.map(([fromId, toId]) => {
          const from = nodeMap.get(fromId)!
          const to = nodeMap.get(toId)!
          return (
            <line
              key={`${fromId}-${toId}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="rgba(248, 113, 113, 0.45)"
              strokeWidth="0.55"
              strokeLinecap="round"
              strokeDasharray="1.4 1.2"
            />
          )
        })}
      </svg>

      {nodes.map((node, index) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.03 * index }}
          className="absolute w-[154px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-white/[0.08] p-3 backdrop-blur"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          <p className="text-sm font-medium text-white">{node.title}</p>
          <p className="mt-1 text-xs text-slate-400">{node.subtitle}</p>
        </motion.div>
      ))}

      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
        <Badge className="rounded-full border-violet-400/20 bg-violet-400/10 text-violet-100">Node-edge execution map</Badge>
        <Badge className="rounded-full border-white/10 bg-white/5 text-slate-200">Realtime dashboard flow</Badge>
      </div>
    </div>
  )
}

