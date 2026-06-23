"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { UserPlus, ArrowLeft, Coffee } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      router.push("/login?registered=true");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 px-4 py-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <Link href="/login" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <div className="text-center mb-8">
          <div className="bg-emerald-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
            <UserPlus className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Create Account</h1>
          <p className="text-zinc-500 mt-2 text-sm">Join the Smart Canteen community</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-zinc-400">Full Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
              placeholder="John Doe"
              className="mt-1 bg-zinc-950/50"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-400">Username</label>
            <Input
              value={formData.username}
              onChange={(e) => setFormData(p => ({ ...p, username: e.target.value }))}
              placeholder="johndoe123"
              className="mt-1 bg-zinc-950/50"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-400">Password</label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
              placeholder="••••••••"
              className="mt-1 bg-zinc-950/50"
              required
            />
          </div>

          {error && <p className="text-rose-400 text-sm font-medium text-center bg-rose-400/10 py-2 rounded-xl border border-rose-400/20">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full py-6 mt-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-lg font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center mt-8 text-zinc-500 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-bold">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
