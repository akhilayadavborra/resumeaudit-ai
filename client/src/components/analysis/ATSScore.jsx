import React from "react";
import { motion } from "framer-motion";

export default function ATSScore({ score = 0, size = 200 }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score, 0), 100) / 100;
  const stroke = score >= 80 ? "#ffb300" : score >= 60 ? "#ff5a1f" : score >= 40 ? "#f59e0b" : "#ef4444";
  const label = score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Needs Work";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth="12" fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} stroke={stroke} strokeWidth="12" fill="none" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - progress) }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold text-white">{Math.round(score)}</span>
        <span className="text-xs text-gray-500">/ 100</span>
        <span className="text-xs font-semibold mt-1" style={{ color: stroke }}>{label}</span>
      </div>
    </div>
  );
}