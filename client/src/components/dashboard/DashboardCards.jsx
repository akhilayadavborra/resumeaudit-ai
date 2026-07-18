import React from "react";
import { Layers, TrendingUp, Award, FileUp } from "lucide-react";
import GlowCard from "../ui/GlowCard";

const ICONS = { total: Layers, average: TrendingUp, best: Award, latest: FileUp };

export default function DashboardCards({ stats }) {
  const cards = [
    { key: "total", label: "Total Analyses", value: stats.total_analyses, suffix: "" },
    { key: "average", label: "Average Score", value: stats.average_score, suffix: "/ 100" },
    { key: "best", label: "Best Score", value: stats.highest_score, suffix: "/ 100" },
    { key: "latest", label: "Latest Score", value: stats.latest_score, suffix: "/ 100" },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = ICONS[c.key];
        return (
          <GlowCard key={c.key} className="p-5">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <Icon className="w-4 h-4 text-accent-amber" /> {c.label}
            </div>
            <p className="text-2xl font-bold text-white">
              {c.value}<span className="text-sm text-gray-500 ml-1">{c.suffix}</span>
            </p>
          </GlowCard>
        );
      })}
    </div>
  );
}