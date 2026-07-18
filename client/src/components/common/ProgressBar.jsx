import React from "react";
import { motion } from "framer-motion";

export default function ProgressBar({ progress = 0, className = "" }) {
  return (
    <div className={`h-2 rounded-full bg-white/[0.06] overflow-hidden ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(progress, 100)}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="h-full rounded-full bg-gradient-to-r from-accent-orange to-accent-amber"
      />
    </div>
  );
}