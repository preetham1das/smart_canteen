"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, Utensils, Loader2, ArrowLeft, Star, Bell } from "lucide-react";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((r) => r.json());

const STATUS_STEPS = ["Pending", "Preparing", "Ready", "Completed"];

const STATUS_META = {
  Pending: {
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    glow: "shadow-[0_0_40px_rgba(234,179,8,0.2)]",
    icon: Clock,
    label: "Order Received",
    desc: "Your order has been placed. Kitchen will start soon.",
  },
  Preparing: {
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
    glow: "shadow-[0_0_40px_rgba(79,70,229,0.2)]",
    icon: Utensils,
    label: "Being Prepared",
    desc: "The kitchen is working on your order right now!",
  },
  Ready: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    glow: "shadow-[0_0_40px_rgba(16,185,129,0.3)]",
    icon: Bell,
    label: "Ready for Pickup! 🎉",
    desc: "Your order is ready! Please collect it from the counter.",
  },
  Completed: {
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
    border: "border-zinc-700",
    glow: "",
    icon: CheckCircle,
    label: "Completed",
    desc: "Thank you! Enjoy your meal.",
  },
};

export default function TrackPage() {
  const { token } = useParams();
  const decodedToken = decodeURIComponent(token);

  // Poll every 5 seconds for live status updates
  const { data: order, error, isLoading } = useSWR(
    `/api/orders/${encodeURIComponent(decodedToken)}`,
    fetcher,
    { refreshInterval: 5000 }
  );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white flex-col gap-4">
        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
        <p className="text-zinc-400">Looking up your token...</p>
      </div>
    );
  }

  if (error || order?.error) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white flex-col gap-4">
        <p className="text-rose-400 text-xl font-bold">Token not found.</p>
        <Link href="/menu" className="text-indigo-400 hover:underline">← Back to Menu</Link>
      </div>
    );
  }

  const status = order?.status || "Pending";
  const meta = STATUS_META[status] || STATUS_META.Pending;
  const StatusIcon = meta.icon;
  const currentStep = STATUS_STEPS.indexOf(status);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* BG glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] transition-colors duration-1000 ${
          status === "Ready" ? "bg-emerald-500/10" :
          status === "Preparing" ? "bg-indigo-500/10" : "bg-yellow-500/5"
        }`} />
      </div>

      <Link href="/menu" className="absolute top-6 left-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <motion.div
        className="w-full max-w-md z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Token Number */}
        <div className={`${meta.bg} ${meta.border} border rounded-3xl p-8 text-center mb-6 ${meta.glow} transition-all duration-700`}>
          <p className="text-zinc-400 text-sm uppercase tracking-widest mb-2 font-semibold">Your Token</p>
          <motion.h1
            key={status}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-7xl font-black tracking-tight mb-4 ${meta.color}`}
          >
            {decodedToken}
          </motion.h1>

          <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl ${meta.bg} border ${meta.border}`}>
            <StatusIcon className={`w-6 h-6 ${meta.color}`} />
            <div className="text-left">
              <p className={`font-bold ${meta.color}`}>{meta.label}</p>
              <p className="text-xs text-zinc-400">{meta.desc}</p>
            </div>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-zinc-800 z-0" />
            <div
              className="absolute top-4 left-4 h-0.5 bg-indigo-500 z-0 transition-all duration-700"
              style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
            />
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className="flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-500 ${
                  i < currentStep ? "bg-indigo-600 border-indigo-600 text-white" :
                  i === currentStep ? `${meta.bg} ${meta.border} ${meta.color} border-2` :
                  "bg-zinc-900 border-zinc-700 text-zinc-600"
                }`}>
                  {i < currentStep ? "✓" : i + 1}
                </div>
                <span className={`text-xs mt-2 font-medium ${i <= currentStep ? "text-zinc-200" : "text-zinc-600"}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Items */}
        {order?.items && (
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Order Summary</h2>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <span className="text-zinc-200">{item.menuItem?.name || "Item"} <span className="text-zinc-500">×{item.quantity}</span></span>
                  <span className="text-indigo-400 font-semibold">₹{(item.menuItem?.price || 0) * item.quantity}</span>
                </div>
              ))}
              <div className="border-t border-zinc-800 pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-emerald-400">₹{order.totalAmount}</span>
              </div>
            </div>

            {/* Rewards */}
            {order.totalAmount && (
              <div className="mt-4 flex items-center gap-2 text-yellow-400 text-xs bg-yellow-500/10 rounded-xl px-4 py-2 border border-yellow-500/20">
                <Star className="w-4 h-4" />
                <span>You earned <strong>{Math.floor(order.totalAmount / 10)} reward points</strong> on this order!</span>
              </div>
            )}
          </div>
        )}

        <p className="text-center text-zinc-600 text-xs mt-6">Status updates automatically every 5 seconds</p>
      </motion.div>
    </div>
  );
}
