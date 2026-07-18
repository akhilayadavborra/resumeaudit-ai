import React from "react";
import { motion } from "framer-motion";

export default function UploadProgress({ label = "Uploading..." }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="w-14 h-14 mx-auto rounded-full border-2 border-white/10 border-t-accent-orange border-r-accent-amber"
          animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
        />
        <p className="mt-6 text-gray-300 font-medium">{label}</p>
        <p className="text-sm text-gray-500 mt-1">This usually takes a few seconds.</p>
      </div>
    </div>
  );
}