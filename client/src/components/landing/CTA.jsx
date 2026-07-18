import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import GlowCard from "../ui/GlowCard";
import { PrimaryButton } from "../ui/GlowButton";

export default function CTA() {
  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 pb-24">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <GlowCard className="relative overflow-hidden text-center py-16 px-6">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-orange/10 via-transparent to-accent-amber/10" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to see your real ATS score?</h2>
            <p className="mt-3 text-gray-400 max-w-lg mx-auto">
              Free to start. No credit card required.
            </p>
            <Link to="/signup">
              <PrimaryButton className="mt-8 text-base">Get Started Free <ArrowRight className="w-4 h-4" /></PrimaryButton>
            </Link>
          </div>
        </GlowCard>
      </motion.div>
    </section>
  );
}