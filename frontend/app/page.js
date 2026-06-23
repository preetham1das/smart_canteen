"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Coffee, Shield, ChefHat, LogOut, ArrowRight, LayoutDashboard, Monitor } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div className="flex h-screen items-center justify-center bg-zinc-950"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center bg-zinc-950 text-white p-4 relative overflow-hidden">
        {/* Decorative Bg */}
        <div className="absolute top-0 w-full h-[40vh] bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />

        <motion.div
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="text-center z-10 max-w-2xl"
        >
          <div className="bg-zinc-900/50 p-4 rounded-3xl inline-block mb-6 border border-zinc-800">
             <Coffee className="w-12 h-12 text-indigo-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Nex<span className="text-indigo-400">Gen</span> Canteen
          </h1>
          <p className="text-xl text-zinc-400 mb-10 leading-relaxed">
            Experience the future of campus dining. Smart queueing, pre-orders, and dynamic live tokens.
          </p>

          <Link href="/login" className="inline-flex items-center px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-lg font-medium transition-all shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)]">
            Launch System <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    );
  }

  // Dashboard Hub for Logged In User
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-16">
           <div className="flex items-center gap-3">
             <div className="bg-indigo-500/20 p-2 rounded-xl border border-indigo-500/30">
               <Coffee className="w-6 h-6 text-indigo-400" />
             </div>
             <h1 className="text-xl font-bold">NexGen</h1>
           </div>
           
           <div className="flex items-center gap-6">
             <div className="text-right">
               <p className="font-medium">{session.user.name}</p>
               <p className="text-xs text-indigo-400 font-mono uppercase">{session.user.role}</p>
             </div>
             <button onClick={() => signOut()} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
               <LogOut className="w-5 h-5" />
             </button>
           </div>
        </header>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-3xl font-bold mb-2">Welcome back, {session.user.name.split(' ')[0]}</h2>
          <p className="text-zinc-400 mb-10">Select a module to continue.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Conditional Cards based on Role */}
            {(session.user.role === 'customer' || session.user.role === 'admin') && (
              <Link href="/menu" className="group block bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 rounded-3xl p-8 transition-all hover:-translate-y-1">
                <div className="bg-indigo-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                   <Coffee className="w-7 h-7 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">Order Menu</h3>
                <p className="text-zinc-400">Browse snacks, meals, and schedule your pre-orders.</p>
              </Link>
            )}

            {(session.user.role === 'staff' || session.user.role === 'admin') && (
               <Link href="/kitchen" className="group block bg-zinc-900 border border-zinc-800 hover:border-rose-500/50 rounded-3xl p-8 transition-all hover:-translate-y-1">
                 <div className="bg-rose-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-rose-500/20 transition-colors">
                    <ChefHat className="w-7 h-7 text-rose-400" />
                 </div>
                 <h3 className="text-2xl font-semibold mb-2">Kitchen Display</h3>
                 <p className="text-zinc-400">Manage incoming orders and update preparation status.</p>
               </Link>
            )}

            {(session.user.role === 'admin') && (
               <Link href="/admin" className="group block bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 rounded-3xl p-8 transition-all hover:-translate-y-1">
                 <div className="bg-emerald-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                    <LayoutDashboard className="w-7 h-7 text-emerald-400" />
                 </div>
                 <h3 className="text-2xl font-semibold mb-2">Admin Dashboard</h3>
                 <p className="text-zinc-400">View analytics, manage inventory, and track sales.</p>
               </Link>
            )}

            <Link href="/display" className="group block bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 rounded-3xl p-8 transition-all hover:-translate-y-1">
                 <div className="bg-cyan-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan-500/20 transition-colors">
                    <Monitor className="w-7 h-7 text-cyan-400" />
                 </div>
                 <h3 className="text-2xl font-semibold mb-2">Public Token Screen</h3>
                 <p className="text-zinc-400">View live token calls and ready orders.</p>
            </Link>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
