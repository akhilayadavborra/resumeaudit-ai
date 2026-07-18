import React from "react";
import GlowCard from "../ui/GlowCard";

export default function SkillsAnalysis({ skills = [] }) {
  return (
    <GlowCard className="p-6">
      <h3 className="font-semibold text-white mb-4">Skills Detected ({skills.length})</h3>
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? skills.map((s) => (
          <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-accent-orange/10 border border-accent-orange/30 text-accent-orange-light">{s}</span>
        )) : <p className="text-sm text-gray-500">No skills detected.</p>}
      </div>
    </GlowCard>
  );
}