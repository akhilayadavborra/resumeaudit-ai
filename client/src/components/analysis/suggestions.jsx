import React from "react";
import { Lightbulb, Sparkles } from "lucide-react";
import GlowCard from "../ui/GlowCard";

export default function Suggestions({ suggestions = [] }) {
  return (
    <GlowCard className="p-6">
      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-accent-orange-light" /> Suggestions to Improve
      </h3>
      <ul className="space-y-3">
        {suggestions.map((s, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
            <Sparkles className="w-4 h-4 text-accent-amber mt-0.5 shrink-0" /> {s}
          </li>
        ))}
      </ul>
    </GlowCard>
  );
}