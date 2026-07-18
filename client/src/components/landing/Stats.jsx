import React from "react";
import { motion } from "framer-motion";

const STATS = [
  { value: "50K+", label: "Resumes Analyzed" },
  { value: "92%", label: "Avg. Score Improvement" },
  { value: "3.2x", label: "More Interview Callbacks" },
  { value: "4.8/5", label: "User Rating" },
];

export default function Stats() {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-24">
      <div className="glass-card grid grid-cols-2 md:grid-cols-4 gap-6 p-8 text-center">
        {STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
            <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-orange to-accent-amber">
              {s.value}
            </p>
            <p className="text-sm text-gray-400 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}