import React from "react";
import { Sparkles } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import GlowCard from "../components/ui/GlowCard";
import ForgotPasswordForm from "../components/auth/ForgotPassword";

export default function ForgotPassword() {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-16">
        <GlowCard className="w-full max-w-md p-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-accent-orange" />
            <span className="text-sm text-gray-400">ResumeAudit AI</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Reset your password</h1>
          <p className="text-sm text-gray-400 mt-1">Enter your email and we'll send you a reset link.</p>
          <div className="mt-8"><ForgotPasswordForm /></div>
        </GlowCard>
      </div>
    </MainLayout>
  );
}