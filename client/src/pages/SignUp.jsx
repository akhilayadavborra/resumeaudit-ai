import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import GlowCard from "../components/ui/GlowCard";
import SignupForm from "../components/auth/SignupForm";
import GoogleLoginButton from "../components/auth/GoogleLoginButton";

export default function Signup() {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-16">
        <GlowCard className="w-full max-w-md p-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-accent-orange" />
            <span className="text-sm text-gray-400">ResumeAudit AI</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-sm text-gray-400 mt-1">Start analyzing resumes with real AI scoring.</p>
          <div className="mt-8"><SignupForm /></div>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <GoogleLoginButton />
          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account? <Link to="/login" className="text-accent-orange-light font-medium hover:underline">Log in</Link>
          </p>
        </GlowCard>
      </div>
    </MainLayout>
  );
}