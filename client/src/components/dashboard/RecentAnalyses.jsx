import React from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowRight } from "lucide-react";
import GlowCard from "../ui/GlowCard";

function scoreColor(score) {
  if (score >= 80) return "text-accent-amber";
  if (score >= 60) return "text-accent-orange-light";
  if (score >= 40) return "text-yellow-500";
  return "text-red-400";
}

export default function RecentAnalyses({ analyses }) {
  return (
    <GlowCard className="p-6">
      <h3 className="font-semibold text-white mb-4">Recent Analyses</h3>
      <div className="space-y-2">
        {analyses.map((a) => (
          <Link key={a.id} to={`/analysis/${a.id}`}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] transition-colors group">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-accent-orange-light" />
              <div>
                <p className="text-sm text-gray-200">{a.filename}</p>
                <p className="text-xs text-gray-500">{new Date(a.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-bold ${scoreColor(a.ats_score)}`}>{a.ats_score}</span>
              <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-accent-orange-light" />
            </div>
          </Link>
        ))}
      </div>
    </GlowCard>
  );
}