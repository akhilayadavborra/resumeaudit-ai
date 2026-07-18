import React from "react";
import GlowCard from "../ui/GlowCard";

export default function KeywordAnalysis({ matched = [], missing = [] }) {
  return (
    <GlowCard className="p-6">
      <h3 className="font-semibold text-white mb-4">Keyword Analysis</h3>
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-400 mb-2">Matched ({matched.length})</p>
          <div className="flex flex-wrap gap-2">
            {matched.map((k) => <span key={k} className="text-xs px-2.5 py-1 rounded-full bg-accent-amber/10 border border-accent-amber/30 text-accent-amber">{k}</span>)}
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-400 mb-2">Missing ({missing.length})</p>
          <div className="flex flex-wrap gap-2">
            {missing.map((k) => <span key={k} className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300">{k}</span>)}
          </div>
        </div>
      </div>
    </GlowCard>
  );
}