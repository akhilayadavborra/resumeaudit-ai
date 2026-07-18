import React from "react";
import AnimatedBackground from "../components/ui/AnimatedBackground";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-matte-950 relative">
      <AnimatedBackground />
      <main className="flex-1 relative z-10">{children}</main>
    </div>
  );
}