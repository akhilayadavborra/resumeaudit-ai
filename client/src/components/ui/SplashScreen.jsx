import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const duration = 2200; // total splash time in ms
    const stepTime = 20;
    const steps = duration / stepTime;
    let current = 0;

    const interval = setInterval(() => {
      current += 1;
      // ease-out curve so it feels snappier at the start, settles at the end
      const linear = current / steps;
      const eased = 1 - Math.pow(1 - linear, 2);
      setProgress(Math.min(eased * 100, 100));

      if (current >= steps) {
        clearInterval(interval);
        setTimeout(() => {
          setVisible(false);
          setTimeout(onFinish, 600);
        }, 200);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-matte-950 overflow-hidden"
        >
          {/* Ambient background glow */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full bg-accent-orange/10 blur-[120px]"
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />

          {/* Logo with rotating gradient ring */}
          <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
            <motion.svg
              className="absolute inset-0"
              viewBox="0 0 100 100"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
            >
              <defs>
                <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff5a1f" />
                  <stop offset="100%" stopColor="#ffb300" />
                </linearGradient>
              </defs>
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="url(#ringGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="180 264"
              />
            </motion.svg>

            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "backOut" }}
              className="relative"
            >
              <Sparkles className="w-10 h-10 text-accent-orange" />
              <motion.div
                className="absolute inset-0 blur-xl bg-accent-orange/50 rounded-full"
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
              />
            </motion.div>
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-3xl font-bold text-white mb-2 tracking-tight"
          >
            ResumeAudit <span className="text-accent-orange">AI</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="text-sm text-gray-500 mb-10 tracking-wide"
          >
            Optimize Your Resume. Maximize Your Opportunities.
          </motion.p>

          {/* Progress bar + live percentage */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-64 h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent-orange to-accent-amber"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
            <span className="text-xs text-gray-600 font-mono tabular-nums">
              {Math.round(progress)}%
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}