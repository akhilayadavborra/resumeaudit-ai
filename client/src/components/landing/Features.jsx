import React from "react";
import { motion } from "framer-motion";
import { ScanSearch, Target, FileCheck2, BarChart3, Zap, ShieldCheck } from "lucide-react";
import GlowCard from "../ui/GlowCard";

const FEATURES = [
  { icon: ScanSearch, title: "Real ATS Scoring", desc: "NLP-driven analysis scores your resume 0-100 across sections, keywords, formatting, and semantic relevance." },
  { icon: Target, title: "Job Description Matching", desc: "See your exact skill gaps and semantic alignment against any job posting using sentence-embedding similarity." },
  { icon: FileCheck2, title: "Section & Format Checks", desc: "Detects missing sections, weak phrasing, and inconsistent formatting that trips up ATS parsers." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Track your score trend across every version of your resume with visual charts." },
  { icon: Zap, title: "Instant Results", desc: "Upload a PDF or DOCX and get a full breakdown in seconds." },
  { icon: ShieldCheck, title: "Private & Secure", desc: "JWT-secured accounts and resume data scoped strictly to your account." },
];

export default function Features() {
  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-14">
        <span className="text-xs uppercase tracking-[0.2em] text-accent-amber font-semibold">Everything you need</span>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">Built to pass real ATS filters</h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
            <GlowCard hover className="p-6">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent-orange/20 to-accent-amber/10 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-accent-orange-light" />
              </div>
              <h3 className="font-semibold text-white text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </GlowCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}