import React from "react";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent-orange/10 rounded-full blur-[130px]" />
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-accent-amber/8 rounded-full blur-[120px]" />
    </div>
  );
}