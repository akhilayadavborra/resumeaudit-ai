import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import GlowCard from "../ui/GlowCard";

const TESTIMONIALS = [
  { name: "Priya S.", role: "Recent CS Graduate", quote: "My score went from 54 to 88 after three rounds of edits. Got two interview calls the same week." },
  { name: "Marcus T.", role: "Software Engineer", quote: "The job description matching caught skill gaps I didn't even realize were missing from my resume." },
  { name: "Aisha R.", role: "Marketing Analyst", quote: "Finally understood why my resume wasn't getting past ATS filters. Clear, actionable feedback." },
];

export default function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-24">
      <div className="text-center mb-14">
        <span className="text-xs uppercase tracking-[0.2em] text-accent-amber font-semibold">Loved by job seekers</span>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white">Real results, real feedback</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
            <GlowCard className="p-6">
              <Quote className="w-6 h-6 text-accent-orange/50 mb-3" />
              <p className="text-gray-300 text-sm leading-relaxed">"{t.quote}"</p>
              <p className="mt-4 text-sm font-semibold text-white">{t.name}</p>
              <p className="text-xs text-gray-500">{t.role}</p>
            </GlowCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}