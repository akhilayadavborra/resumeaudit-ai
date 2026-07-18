import React from "react";
import { Briefcase } from "lucide-react";
import GlowCard from "../ui/GlowCard";

export default function RoleMatch({ roleMatch }) {
  if (!roleMatch) return null;

  return (
    <GlowCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-accent-orange-light" /> Role Fit: {roleMatch.role_label}
        </h3>
        <span className="text-sm text-accent-amber font-semibold">{roleMatch.role_match_percent}% match</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-400 mb-2">Skills You Have</p>
          <div className="flex flex-wrap gap-2">
            {roleMatch.matched_critical_skills.map((s) => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-accent-amber/10 border border-accent-amber/30 text-accent-amber">{s}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-400 mb-2">Commonly Expected, Not Found</p>
          <div className="flex flex-wrap gap-2">
            {roleMatch.missing_critical_skills.length > 0 ? roleMatch.missing_critical_skills.map((s) => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300">{s}</span>
            )) : <p className="text-sm text-gray-600">None — great coverage!</p>}
          </div>
        </div>
      </div>
    </GlowCard>
  );
}