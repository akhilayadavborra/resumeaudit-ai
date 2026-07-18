import React from "react";
import GlowCard from "../ui/GlowCard";

export default function JDComparison({ jobMatch }) {
  if (!jobMatch?.job_description_provided) return null;
  return (
    <GlowCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">Job Description Match</h3>
        <span className="text-sm text-accent-amber font-semibold">{jobMatch.semantic_similarity_percent}% semantic match</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-400 mb-2">Matched Skills</p>
          <div className="flex flex-wrap gap-2">
            {jobMatch.matched_skills.map((s) => <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-accent-amber/10 border border-accent-amber/30 text-accent-amber">{s}</span>)}
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-400 mb-2">Missing Skills</p>
          <div className="flex flex-wrap gap-2">
            {jobMatch.missing_skills.map((s) => <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300">{s}</span>)}
          </div>
        </div>
      </div>
    </GlowCard>
  );
}