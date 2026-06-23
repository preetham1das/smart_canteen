"use client";

import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, Clock, CheckCircle, Loader2, Utensils, Coffee, UtensilsCrossed, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((r) => r.json());

const STATUSES = ["Pending", "Preparing", "Ready", "Completed"];

const STATUS_COLORS = {
  Pending:   { bg: "bg-yellow-500/5",  border: "border-yellow-500/20",  text: "text-yellow-400",  badge: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20 badge-glow-pending" },
  Preparing: { bg: "bg-emerald-500/5",  border: "border-emerald-500/20",  text: "text-emerald-400",  badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 badge-glow-preparing" },
  Ready:     { bg: "bg-teal-500/5", border: "border-teal-500/20", text: "text-teal-400", badge: "bg-teal-500/10 text-teal-300 border-teal-500/20 badge-glow-ready" },
  Completed: { bg: "bg-zinc-800/20",    border: "border-white/5",        text: "text-zinc-500",    badge: "bg-zinc-800 text-zinc-400 border-white/5" },
};

const CATEGORY_ICONS = {
  snacks: Coffee,
  meals: Utensils,
  beverages: UtensilsCrossed,
};

function getStation(order) {
  const categories = order.items.map((i) => i.menuItem?.category).filter(Boolean);
  if (categories.includes("meals")) return "Meals Station";
  if (categories.includes("snacks")) return "Snacks Station";
  return "Beverages Station";
}

function getStationColor(station) {
  if (station === "Meals Station") return "text-rose-400";
  if (station === "Snacks Station") return "text-amber-400";
  return "text-cyan-400";
}

function timeSince(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
}

function isUrgent(date) {
  const diff = (new Date() - new Date(date)) / 1000 / 60;
  return diff > 10; // More than 10 minutes
}

export default function KitchenPage() {
  const [activeFilter, setActiveFilter] = useState("Pending");
  const [updating, setUpdating] = useState(null);

  const { data: orders, mutate } = useSWR(
    "/api/orders",
    fetcher,
    { refreshInterval: 4000 }
  );

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      mutate();
    } finally {
      setUpdating(null);
    }
  };

  const filtered = orders?.filter((o) =>
    activeFilter === "All" ? true : o.status === activeFilter
  ) ?? [];

  const counts = orders
    ? STATUSES.reduce((acc, s) => ({ ...acc, [s]: orders.filter((o) => o.status === s).length }), {})
    : {};

  return (
    <div className="min-h-screen mesh-gradient text-white selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/70 backdrop-blur-2xl border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors mr-2">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="bg-rose-500/20 p-2 rounded-xl border border-rose-500/30">
              <ChefHat className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Kitchen Display System</h1>
              <p className="text-xs text-zinc-400">Live order management · auto-refreshes every 4s</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs text-zinc-400">{orders?.filter((o) => o.status !== "Completed").length ?? 0} active orders</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Filter Tabs */}
        <div className="flex gap-3 mb-10 flex-wrap">
          {["All", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setActiveFilter(s)}
              className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${
                activeFilter === s
                  ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-105"
                  : "bg-zinc-900/50 border-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-300 hover:bg-zinc-900"
              }`}
            >
              {s} {s !== "All" && <span className={`ml-2 px-1.5 py-0.5 rounded-md ${activeFilter === s ? "bg-emerald-400/20 text-emerald-100" : "bg-zinc-800 text-zinc-600"}`}>{counts[s] ?? 0}</span>}
            </button>
          ))}
        </div>

        {/* Orders Grid */}
        {!orders ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-center py-32 bg-white/5 border border-white/5 rounded-[40px] backdrop-blur-sm"
          >
            <div className="relative inline-block">
              <ChefHat className="w-20 h-20 mx-auto mb-6 text-zinc-700 animate-pulse-slow" />
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-zinc-800 rounded-full animate-ping" />
            </div>
            <p className="text-2xl font-bold text-zinc-400 tracking-tight">Kitchen is clear</p>
            <p className="text-sm text-zinc-600 mt-2 font-medium">Waiting for new orders to arrive...</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {filtered.map((order) => {
                const colors = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
                const station = getStation(order);
                const stationColor = getStationColor(station);
                const isUpdating = updating === order._id;

                return (
                  <motion.div
                    key={order._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`${colors.bg} border ${colors.border} rounded-3xl p-6 flex flex-col gap-6 glass-hover group relative overflow-hidden`}
                  >
                    {/* Urgency Glow */}
                    {isUrgent(order.createdAt) && order.status !== "Completed" && (
                      <div className="absolute inset-0 bg-rose-500/5 animate-pulse pointer-events-none" />
                    )}

                    {/* Top: Token & Time */}
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={`text-4xl font-black tracking-tighter ${colors.text}`}>{order.tokenNumber}</p>
                          {isUrgent(order.createdAt) && order.status !== "Completed" && (
                            <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                          )}
                        </div>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mt-1.5 opacity-80 ${stationColor}`}>{station}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${colors.badge}`}>
                          {order.status}
                        </span>
                        <p className="text-[11px] text-zinc-500 mt-3 flex items-center justify-end gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5" /> {timeSince(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white/5 rounded-2xl p-4 space-y-3 relative z-10">
                      {order.items.map((item, idx) => {
                        const CatIcon = CATEGORY_ICONS[item.menuItem?.category] || Utensils;
                        return (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-white/5">
                              <CatIcon className="w-4 h-4 text-zinc-400" />
                            </div>
                            <span className="text-sm text-zinc-100 font-semibold flex-1 leading-tight">{item.menuItem?.name || "Unknown Item"}</span>
                            <span className="text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded text-xs">×{item.quantity}</span>
                          </div>
                        );
                      })}
                    </div>

                    {order.scheduledPickupTime && (
                      <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-2xl px-4 py-3 text-[11px] text-cyan-300 flex items-center gap-2 font-semibold relative z-10">
                        <Clock className="w-3.5 h-3.5" />
                        PRE-ORDER FOR {new Date(order.scheduledPickupTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-auto relative z-10">
                      {order.status === "Pending" && (
                        <button
                          onClick={() => updateStatus(order._id, "Preparing")}
                          disabled={isUpdating}
                          className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
                        >
                          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Utensils className="w-4 h-4" />}
                          Start Cooking
                        </button>
                      )}
                      {order.status === "Preparing" && (
                        <button
                          onClick={() => updateStatus(order._id, "Ready")}
                          disabled={isUpdating}
                          className="flex-1 py-3.5 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 active:scale-95"
                        >
                          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                          Mark as Ready
                        </button>
                      )}
                      {order.status === "Ready" && (
                        <button
                          onClick={() => updateStatus(order._id, "Completed")}
                          disabled={isUpdating}
                          className="flex-1 py-3.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-zinc-900/20 active:scale-95"
                        >
                          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                          Serve Order
                        </button>
                      )}
                      {order.status === "Completed" && (
                        <div className="flex-1 text-center text-zinc-500 text-[10px] font-black uppercase tracking-widest py-3 bg-zinc-900/50 rounded-2xl border border-white/5">
                          Order Fulfilled ✓
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
