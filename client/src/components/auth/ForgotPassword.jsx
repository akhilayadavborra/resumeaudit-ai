import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MailCheck, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Input from "../common/Input";
import { PrimaryButton } from "../ui/GlowButton";
import api, { getErrorMessage } from "../../services/api";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/auth/forgot-password", { email });
      setSent(true);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-6">
        <MailCheck className="w-12 h-12 text-accent-amber mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white">Check your inbox</h2>
        <p className="text-sm text-gray-400 mt-2">
          If an account exists for <span className="text-gray-200">{email}</span>, a reset link has been sent (valid 30 min).
        </p>
        <Link to="/login" className="inline-flex items-center gap-1.5 mt-6 text-sm text-gray-400 hover:text-gray-200">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input icon={Mail} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      <PrimaryButton type="submit" disabled={loading} className="w-full">
        {loading ? "Sending..." : "Send Reset Link"}
      </PrimaryButton>
      <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-gray-200">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to login
      </Link>
    </form>
  );
}