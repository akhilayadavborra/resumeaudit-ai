import React from "react";
import { motion } from "framer-motion";

export default function Loader({ size = 40, label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        style={{ width: size, height: size }}
        className="rounded-full border-2 border-white/10 border-t-accent-orange border-r-accent-amber"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
      />
      {label && <p className="text-sm text-gray-400">{label}</p>}
    </div>
  );
}