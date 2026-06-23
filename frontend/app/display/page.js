"use client";

import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, Bell, CheckCircle, Clock } from "lucide-react";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function DisplayPage() {
  const { data: orders } = useSWR("/api/orders", fetcher, { refreshInterval: 3000 });

  const preparing = orders?.filter((o) => o.status === "Preparing") ?? [];
  const ready = orders?.filter((o) => o.status === "Ready") ?? [];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-8 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Monitor className="w-6 h-6 text-cyan-400" />
          <h1 className="text-2xl font-black tracking-tight">
            Nex<span className="text-indigo-400">Gen</span> Canteen · Live Token Board
          </h1>
        </div>
        <div className="flex items-center gap-2 text-zinc-400 text-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Live · Updates every 3s
        </div>
      </header>

      <div className="flex flex-1 gap-0 overflow-hidden">
        {/* PREPARING Column */}
        <div className="flex-1 border-r border-zinc-800 flex flex-col">
          <div className="bg-indigo-500/10 border-b border-indigo-500/20 px-8 py-5 flex items-center gap-3">
            <Clock className="w-7 h-7 text-indigo-400" />
            <div>
              <h2 className="text-2xl font-bold text-indigo-300">Now Preparing</h2>
              <p className="text-sm text-indigo-400/70">{preparing.length} order{preparing.length !== 1 ? "s" : ""} in kitchen</p>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {preparing.length === 0 ? (
              <div className="text-center py-20 text-zinc-700">
                <Clock className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-xl">No orders preparing</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <AnimatePresence>
                  {preparing.map((order) => (
                    <motion.div
                      key={order._id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-6 text-center flex flex-col items-center gap-2"
                    >
                      <p className="text-5xl font-black text-indigo-300 tracking-tight">{order.tokenNumber}</p>
                      <div className="text-xs text-indigo-400/70 font-medium">
                        {order.items?.map(i => i.menuItem?.category).filter((v, i, a) => a.indexOf(v) === i).join(" · ")}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* READY Column */}
        <div className="flex-1 flex flex-col">
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-8 py-5 flex items-center gap-3">
            <Bell className="w-7 h-7 text-emerald-400" />
            <div>
              <h2 className="text-2xl font-bold text-emerald-300">Ready for Pickup</h2>
              <p className="text-sm text-emerald-400/70">{ready.length} order{ready.length !== 1 ? "s" : ""} waiting</p>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {ready.length === 0 ? (
              <div className="text-center py-20 text-zinc-700">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-xl">No orders ready yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <AnimatePresence>
                  {ready.map((order) => (
                    <motion.div
                      key={order._id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative bg-emerald-500/10 border-2 border-emerald-500/50 rounded-2xl p-6 text-center flex flex-col items-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                    >
                      {/* Pulsing ring */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-emerald-500/30 animate-ping opacity-20 pointer-events-none" />
                      <p className="text-5xl font-black text-emerald-300 tracking-tight">{order.tokenNumber}</p>
                      <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                        <Bell className="w-3 h-3" /> Collect Now!
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Ticker */}
      <footer className="bg-zinc-900 border-t border-zinc-800 px-8 py-3 text-zinc-500 text-sm flex items-center gap-4">
        <span className="text-indigo-400 font-bold">📢</span>
        <span>Please collect your order promptly from the counter · Thank you for using NexGen Canteen!</span>
      </footer>
    </div>
  );
}
