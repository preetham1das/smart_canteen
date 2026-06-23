"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Coffee, Shield, ChefHat, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const demoAccounts = [
    { role: "Customer", username: "jane", pass: "password123", icon: Coffee, desc: "Place orders, earn points" },
    { role: "Kitchen Staff", username: "staff", pass: "password123", icon: ChefHat, desc: "Manage preparing queue" },
    { role: "Admin", username: "admin", pass: "password123", icon: Shield, desc: "View analytics & system" },
  ];

  const quickLogin = (uname, pass) => {
    setUsername(uname);
    setPassword(pass);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 px-4 py-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-500/10 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="bg-emerald-500/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/30 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]">
            <Coffee className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent tracking-tighter">
            SMART CANTEEN
          </h1>
          <p className="text-zinc-500 mt-3 text-sm font-medium">Digitalizing your dining experience</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="mt-1 bg-zinc-950/50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-300">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 bg-zinc-950/50"
            />
          </div>

          {error && <p className="text-red-400 text-sm font-medium text-center">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full py-6 mt-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <p className="text-center mt-6 text-zinc-500 text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-bold">
              Sign Up
            </Link>
          </p>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5">
          <p className="text-[10px] text-zinc-500 text-center mb-6 uppercase tracking-[0.2em] font-black">
            Quick Access Demo Roles
          </p>
          <div className="grid grid-cols-1 gap-4">
            {demoAccounts.map((acc) => {
              const Icon = acc.icon;
              return (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => quickLogin(acc.username, acc.pass)}
                  className="group relative flex items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.08] transition-all text-left overflow-hidden active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="bg-zinc-800 group-hover:bg-emerald-500/20 w-12 h-12 rounded-xl flex items-center justify-center mr-4 shrink-0 transition-colors border border-white/5 group-hover:border-emerald-500/30">
                    <Icon className="w-6 h-6 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-zinc-100 text-sm group-hover:text-white transition-colors">{acc.role}</h4>
                    <p className="text-[11px] text-zinc-500 leading-tight mt-0.5">{acc.desc}</p>
                  </div>
                  <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20">
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <ShoppingBag className="w-4 h-4 text-emerald-400" />
                      </motion.div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
