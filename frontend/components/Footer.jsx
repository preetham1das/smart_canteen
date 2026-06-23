"use client";

import { Coffee, Globe, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-950 border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 group">
              <div className="bg-emerald-500/20 p-2 rounded-xl border border-emerald-500/30">
                <Coffee className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent tracking-tighter">
                SMART CANTEEN
              </span>
            </div>
            <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
              Elevating the campus dining experience with smart token systems and real-time order tracking.
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="#" className="text-zinc-600 hover:text-white transition-colors"><Globe className="w-5 h-5" /></Link>
              <Link href="#" className="text-zinc-600 hover:text-white transition-colors"><Mail className="w-5 h-5" /></Link>
              <Link href="#" className="text-zinc-600 hover:text-white transition-colors"><MessageCircle className="w-5 h-5" /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/menu" className="text-zinc-500 hover:text-indigo-400 text-sm transition-colors">Order Menu</Link></li>
              <li><Link href="/track" className="text-zinc-500 hover:text-indigo-400 text-sm transition-colors">Track Order</Link></li>
              <li><Link href="/kitchen" className="text-zinc-500 hover:text-indigo-400 text-sm transition-colors">Kitchen Display</Link></li>
              <li><Link href="/display" className="text-zinc-500 hover:text-indigo-400 text-sm transition-colors">Public Display</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-zinc-500 hover:text-indigo-400 text-sm transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-zinc-500 hover:text-indigo-400 text-sm transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-zinc-500 hover:text-indigo-400 text-sm transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-xs font-medium">
            © {new Date().getFullYear()} Smart Canteen System. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">System Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
