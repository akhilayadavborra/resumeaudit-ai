import React, { useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import Input from "../common/Input";
import { SecondaryButton } from "../ui/GlowButton";
import GlowCard from "../ui/GlowCard";
import api, { getErrorMessage } from "../../services/api";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/auth/change-password", { current_password: currentPassword, new_password: newPassword });
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlowCard className="p-6">
      <h3 className="font-semibold text-white mb-5 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-accent-amber" /> Change Password</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-300 mb-1.5 block">Current Password</label>
          <Input icon={Lock} type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-gray-300 mb-1.5 block">New Password</label>
          <Input icon={Lock} type="password" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <SecondaryButton type="submit" disabled={loading}>{loading ? "Updating..." : "Update Password"}</SecondaryButton>
      </form>
    </GlowCard>
  );
}