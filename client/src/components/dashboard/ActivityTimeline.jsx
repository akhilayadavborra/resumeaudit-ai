import React from "react";
import { CheckCircle2, Upload, FileDown } from "lucide-react";
import GlowCard from "../ui/GlowCard";

const ICONS = { upload: Upload, analysis: CheckCircle2, report: FileDown };

export default function ActivityTimeline({ activities }) {
  return (
    <GlowCard className="p-6">
      <h3 className="font-semibold text-white mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((act, i) => {
          const Icon = ICONS[act.type] || CheckCircle2;
          return (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent-orange/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-accent-orange-light" />
              </div>
              <div>
                <p className="text-sm text-gray-300">{act.message}</p>
                <p className="text-xs text-gray-500">{act.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </GlowCard>
  );
}