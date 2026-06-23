"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { 
  Coffee, ShoppingBag, LayoutDashboard, ChefHat, 
  User, LogOut, Shield, Menu as MenuIcon, X 
} from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Menu", href: "/menu", icon: ShoppingBag },
    { name: "Kitchen", href: "/kitchen", icon: ChefHat, role: ["staff", "admin"] },
    { name: "Admin", href: "/admin", icon: Shield, role: ["admin"] },
    { name: "Display", href: "/display", icon: LayoutDashboard },
  ];

  const filteredLinks = navLinks.filter(link => 
    !link.role || (session?.user?.role && link.role.includes(session.user.role))
  );

  return (
    <nav className="sticky top-0 z-[100] w-full border-b border-white/5 bg-zinc-950/70 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-emerald-500/20 p-2 rounded-xl border border-emerald-500/30 group-hover:bg-emerald-500/30 transition-all">
              <Coffee className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent tracking-tighter">
              SMART CANTEEN
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {filteredLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-zinc-200">{session.user.name}</span>
                  <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">
                    {session.user.rewardPoints ?? 0} ⭐ POINTS
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl text-zinc-400 hover:text-rose-400 hover:border-rose-500/20 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              pathname !== "/login" && (
                <Link
                  href="/login"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  Sign In
                </Link>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-zinc-400 hover:text-white transition-all"
            >
              {isOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-zinc-950 border-b border-white/5 px-4 pt-2 pb-6 space-y-2"
        >
          {filteredLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold text-zinc-400 hover:text-white hover:bg-white/5"
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </Link>
          ))}
          {!session && pathname !== "/login" && (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-full py-4 mt-4 bg-indigo-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest"
            >
              Sign In
            </Link>
          )}
        </motion.div>
      )}
    </nav>
  );
}
