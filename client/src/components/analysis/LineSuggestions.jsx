import React from "react";
import { AlertCircle, ArrowRight, Lightbulb } from "lucide-react";
import GlowCard from "../ui/GlowCard";

export default function LineSuggestions({ suggestions = [] }) {
  if (suggestions.length === 0) return null;

  return (
    <GlowCard className="p-6">
      <h3 className="font-semibold text-white mb-1 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-accent-orange" /> Specific Lines to Improve
      </h3>
      <p className="text-sm text-gray-500 mb-5">
        Real before → after examples showing exactly how to rewrite these lines.
      </p>

      <div className="space-y-5">
        {suggestions.map((s, i) => (
          <div key={i} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
            <p className="text-xs text-orange-400 font-medium mb-3">{s.problem}</p>

            <div className="space-y-2">
              <div>
                <span className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">Before</span>
                <p className="text-sm text-red-300/90 line-through decoration-red-500/50">
                  {s.example_before}
                </p>
              </div>

              <div className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 text-accent-amber mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase tracking-wide text-accent-amber font-semibold">After</span>
                  <p className="text-sm text-accent-amber font-medium">{s.example_after}</p>
                </div>
              </div>
            </div>

            {s.formula && (
              <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/[0.06]">
                <Lightbulb className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                <p className="text-xs text-gray-500 italic">Formula: {s.formula}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </GlowCard>
  );
}