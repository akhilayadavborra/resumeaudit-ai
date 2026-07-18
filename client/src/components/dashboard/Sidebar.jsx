import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Upload, History, User, LogOut, Sparkles, FileEdit, GitCompare, Wand2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// IMPORTANT: every new feature/page added to the app should get an entry
// here so users can always discover it from the sidebar without searching.
const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/upload", label: "Upload Resume", icon: Upload },
  { path: "/builder", label: "Build Resume", icon: FileEdit },
  { path: "/tailor", label: "Tailor Resume", icon: Wand2 },
  { path: "/history", label: "History", icon: History },
  { path: "/profile", label: "Profile", icon: User },
  { path: "/history", label: "Compare", icon: GitCompare },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-white/[0.06] bg-matte-950/60 backdrop-blur-xl min-h-screen p-5">
      <Link to="/" className="flex items-center gap-2 mb-10 px-2">
        <Sparkles className="w-5 h-5 text-accent-orange" />
        <span className="font-bold text-white">ResumeAudit <span className="text-accent-orange">AI</span></span>
      </Link>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item, i) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={`${item.path}-${item.label}-${i}`}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                active ? "bg-accent-orange/10 text-accent-orange-light border border-accent-orange/20" : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-200"
              }`}
            >
              <item.icon className="w-4 h-4" /> {item.label}
            </Link>
          );
        })}
      </nav>

      <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors">
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </aside>
  );
}