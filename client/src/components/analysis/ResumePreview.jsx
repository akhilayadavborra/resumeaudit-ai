import React from "react";
import { Mail, Phone, Linkedin } from "lucide-react";
import GlowCard from "../ui/GlowCard";

export default function ResumePreview({ contactInfo, sectionsDetected, yearsExperience }) {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <GlowCard className="p-6">
        <h3 className="font-semibold text-white mb-4">Sections Detected</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(sectionsDetected).map(([section, found]) => (
            <div key={section} className="flex items-center gap-2 text-sm">
              <span className={`w-2 h-2 rounded-full ${found ? "bg-accent-amber" : "bg-gray-700"}`} />
              <span className={found ? "text-gray-200 capitalize" : "text-gray-500 capitalize"}>{section}</span>
            </div>
          ))}
        </div>
      </GlowCard>

      <GlowCard className="p-6">
        <h3 className="font-semibold text-white mb-4">Contact Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-500" /><span className="text-gray-200">{contactInfo.email || "Not detected"}</span></div>
          <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-500" /><span className="text-gray-200">{contactInfo.phone || "Not detected"}</span></div>
          <div className="flex items-center gap-2"><Linkedin className="w-4 h-4 text-gray-500" /><span className="text-gray-200">{contactInfo.linkedin || "Not detected"}</span></div>
        </div>
        <p className="text-xs text-gray-500 mt-4">Estimated experience: <span className="text-gray-300">{yearsExperience} years</span></p>
      </GlowCard>
    </div>
  );
}