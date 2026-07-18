import React from "react";
import { AlertTriangle } from "lucide-react";
import GlowCard from "../ui/GlowCard";

const SEVERITY_STYLES = {
  high: "border-red-500/30 bg-red-500/5 text-red-300",
  medium: "border-orange-500/30 bg-orange-500/5 text-orange-300",
  low: "border-white/10 bg-white/[0.02] text-gray-400",
};

export default function WeakPoints({ issues = [] }) {
  if (issues.length === 0) return null;
  return (
    <GlowCard className="p-6">
      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-orange-400" /> Formatting & Grammar Issues
      </h3>
      <div className="space-y-2">
        {issues.map((issue, i) => (
          <div key={i} className={`text-sm px-4 py-3 rounded-xl border ${SEVERITY_STYLES[issue.severity]}`}>{issue.message}</div>
        ))}
      </div>
    </GlowCard>
  );
}