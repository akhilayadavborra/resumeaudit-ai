import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import GlowCard from "../ui/GlowCard";

const FAQS = [
  { q: "Is my resume data kept private?", a: "Yes. Your resumes and analyses are scoped strictly to your account and secured with JWT authentication. We never share your data." },
  { q: "What file formats are supported?", a: "PDF and DOCX files up to 5MB." },
  { q: "How is the ATS score calculated?", a: "We combine section detection, keyword/skill matching, formatting checks, and semantic similarity (when you provide a job description) into one weighted 0-100 score." },
  { q: "Is there a free plan?", a: "Yes — you can sign up and analyze resumes for free, no credit card required." },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <GlowCard className="p-5 cursor-pointer" hover>
      <button className="w-full flex items-center justify-between text-left" onClick={() => setOpen(!open)}>
        <span className="font-medium text-white">{q}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="text-sm text-gray-400 mt-3 overflow-hidden"
          >
            {a}
          </motion.p>
        )}
      </AnimatePresence>
    </GlowCard>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="max-w-3xl mx-auto px-6 pb-24">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Frequently Asked Questions</h2>
      </div>
      <div className="space-y-3">
        {FAQS.map((f) => <FAQItem key={f.q} {...f} />)}
      </div>
    </section>
  );
}