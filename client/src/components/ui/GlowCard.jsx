import React from "react";

export default function GlowCard({ children, className = "", hover = false }) {
  return (
    <div
      className={`glass-card ${
        hover ? "transition-all duration-300 hover:border-accent-orange/25 hover:shadow-glow-orange" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}