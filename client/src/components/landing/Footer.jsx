import React from "react";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-white/[0.06] mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-orange" />
          <span className="text-sm text-gray-400">© {new Date().getFullYear()} ResumeAudit AI. All rights reserved.</span>
        </div>
        <p className="text-xs text-gray-500">contact@resumeaudit.ai</p>
      </div>
    </footer>
  );
}