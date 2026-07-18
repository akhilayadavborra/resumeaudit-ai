import React, { useState } from "react";
import { Menu, X, Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";

export default function Topbar() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="md:hidden flex items-center justify-between px-4 h-16 border-b border-white/[0.06] bg-matte-950/70 backdrop-blur-xl sticky top-0 z-40">
        <button onClick={() => setMobileOpen(true)} className="text-gray-300"><Menu className="w-6 h-6" /></button>
        <span className="font-bold text-white">ResumeAudit <span className="text-accent-orange">AI</span></span>
        <button className="text-gray-400"><Bell className="w-5 h-5" /></button>
      </div>

      <div className="hidden md:flex items-center justify-end gap-4 px-8 h-16 border-b border-white/[0.06]">
        <button className="text-gray-400 hover:text-white"><Bell className="w-5 h-5" /></button>
        <span className="text-sm text-gray-300">{user?.full_name || "there"}</span>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-matte-950/95 backdrop-blur-xl">
          <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-gray-300"><X className="w-6 h-6" /></button>
          <Sidebar />
        </div>
      )}
    </>
  );
}