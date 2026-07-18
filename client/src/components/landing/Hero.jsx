import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "../ui/GlowButton";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 text-center px-6">
      <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}
        className="inline-flex items-center gap-2 glass-card px-4 py-1.5 mb-8 text-sm text-gray-300 mx-auto">
        <Sparkles className="w-4 h-4 text-accent-amber" />
        AI-powered resume analysis for job seekers
      </motion.div>

      <motion.h1 initial="hidden" animate="visible" custom={1} variants={fadeUp}
        className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
        Optimize Your Resume.{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-orange via-accent-orange-light to-accent-amber">
          Maximize Your Opportunities.
        </span>
      </motion.h1>

      <motion.p initial="hidden" animate="visible" custom={2} variants={fadeUp}
        className="mt-6 max-w-2xl mx-auto text-lg text-gray-400">
        ResumeAudit AI analyzes your resume with real NLP, scores it against ATS standards,
        matches it to any job description, and tells you exactly what to fix — before a recruiter ever sees it.
      </motion.p>

      <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp}
        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to="/signup"><PrimaryButton className="text-base">Analyze Resume <ArrowRight className="w-4 h-4" /></PrimaryButton></Link>
        <SecondaryButton className="text-base">Watch Demo</SecondaryButton>
      </motion.div>

      <motion.div initial="hidden" animate="visible" custom={4} variants={fadeUp}
        className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-accent-amber" /> No credit card</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-accent-amber" /> Results in seconds</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-accent-amber" /> PDF & DOCX support</span>
      </motion.div>
    </section>
  );
}