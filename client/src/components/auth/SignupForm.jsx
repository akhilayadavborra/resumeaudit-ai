import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import Input from "../common/Input";
import { PrimaryButton } from "../ui/GlowButton";
import { useAuth } from "../../context/AuthContext";

export default function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const passwordChecks = [
    { label: "8+ characters", valid: password.length >= 8 },
    { label: "Upper & lowercase", valid: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: "At least one number", valid: /\d/.test(password) },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await signup(fullName, email, password);
    setLoading(false);

    if (result.success) {
      toast.success("Account created! Welcome to ResumeAudit AI.");
      navigate("/dashboard");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-gray-300 mb-1.5 block">Full Name</label>
        <Input icon={User} required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" />
      </div>
      <div>
        <label className="text-sm text-gray-300 mb-1.5 block">Email</label>
        <Input icon={Mail} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>
      <div>
        <label className="text-sm text-gray-300 mb-1.5 block">Password</label>
        <div className="relative">
          <Input icon={Lock} type={showPassword ? "text" : "password"} required value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pr-11" />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {password && (
          <div className="mt-2 flex flex-wrap gap-2">
            {passwordChecks.map((c) => (
              <span key={c.label} className={`text-xs px-2 py-0.5 rounded-full border ${
                c.valid ? "border-accent-amber/40 text-accent-amber" : "border-white/10 text-gray-500"
              }`}>
                {c.label}
              </span>
            ))}
          </div>
        )}
      </div>
      <PrimaryButton type="submit" disabled={loading} className="w-full mt-2">
        {loading ? "Creating account..." : (<> <UserPlus className="w-4 h-4" /> Create Account </>)}
      </PrimaryButton>
    </form>
  );
}