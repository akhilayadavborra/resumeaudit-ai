import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { PrimaryButton } from "../ui/GlowButton";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 bg-matte-950/70 backdrop-blur-xl border-b border-white/[0.06]" />
      <nav className="relative max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-accent-orange" />
          <span className="font-bold text-lg text-white">
            ResumeAudit <span className="text-accent-orange">AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-sm text-gray-300 hover:text-white">Dashboard</Link>
              <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-300 hover:text-white">Log in</Link>
              <Link to="/signup"><PrimaryButton className="!py-2 !px-5 text-sm">Sign Up Free</PrimaryButton></Link>
            </>
          )}
        </div>

        <button className="md:hidden text-gray-300" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="md:hidden relative bg-matte-900/95 backdrop-blur-xl border-b border-white/[0.06] overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {links.map((link) => (
                <a key={link.label} href={link.href} className="text-sm text-gray-300" onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              ))}
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-sm text-gray-300">Dashboard</Link>
                  <button onClick={handleLogout} className="text-sm text-red-400 text-left">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm text-gray-300">Log in</Link>
                  <Link to="/signup"><PrimaryButton className="w-full">Sign Up Free</PrimaryButton></Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}