import React, { useState } from "react";
import { Bell, Shield, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import GlowCard from "../ui/GlowCard";

export default function AccountSettings() {
  const [emailNotifs, setEmailNotifs] = useState(true);

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure? This will permanently delete your account and all analyses.")) {
      toast.error("Account deletion not connected to backend yet.");
    }
  };

  return (
    <GlowCard className="p-6">
      <h3 className="font-semibold text-white mb-5 flex items-center gap-2"><Bell className="w-4 h-4 text-accent-orange-light" /> Notification Preferences</h3>
      <label className="flex items-center justify-between py-2">
        <span className="text-sm text-gray-300">Email me about completed analyses</span>
        <input type="checkbox" checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} className="accent-accent-orange w-4 h-4" />
      </label>

      <div className="border-t border-white/[0.06] mt-6 pt-6">
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-red-400" /> Danger Zone</h3>
        <button onClick={handleDeleteAccount} className="text-sm text-red-400 hover:text-red-300 flex items-center gap-2">
          <Trash2 className="w-4 h-4" /> Delete my account
        </button>
      </div>
    </GlowCard>
  );
}