import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import Input from "../common/Input";
import { PrimaryButton } from "../ui/GlowButton";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password, rememberMe);
    setLoading(false);

    if (result.success) {
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm text-gray-300 mb-1.5 block">Email</label>
        <Input icon={Mail} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm text-gray-300">Password</label>
          <Link to="/forgot-password" className="text-xs text-accent-amber hover:underline">Forgot password?</Link>
        </div>
        <div className="relative">
          <Input icon={Lock} type={showPassword ? "text" : "password"} required value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pr-11" />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
        <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
          className="accent-accent-orange w-4 h-4 rounded" />
        Remember me
      </label>

      <PrimaryButton type="submit" disabled={loading} className="w-full mt-2">
        {loading ? "Signing in..." : (<> <LogIn className="w-4 h-4" /> Log In </>)}
      </PrimaryButton>
    </form>
  );
}