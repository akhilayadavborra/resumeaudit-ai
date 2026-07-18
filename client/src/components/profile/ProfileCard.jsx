import React, { useState } from "react";
import { User, Mail, Save } from "lucide-react";
import toast from "react-hot-toast";
import Input from "../common/Input";
import { PrimaryButton } from "../ui/GlowButton";
import GlowCard from "../ui/GlowCard";
import { useAuth } from "../../context/AuthContext";
import api, { getErrorMessage } from "../../services/api";

export default function ProfileCard() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/api/auth/me", { full_name: fullName });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <GlowCard className="p-6">
      <h3 className="font-semibold text-white mb-5 flex items-center gap-2"><User className="w-4 h-4 text-accent-orange-light" /> Personal Information</h3>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="text-sm text-gray-300 mb-1.5 block">Full Name</label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-gray-300 mb-1.5 block">Email</label>
          <Input icon={Mail} value={user?.email || ""} disabled className="opacity-60 cursor-not-allowed" />
        </div>
        <PrimaryButton type="submit" disabled={saving}><Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}</PrimaryButton>
      </form>
    </GlowCard>
  );
}