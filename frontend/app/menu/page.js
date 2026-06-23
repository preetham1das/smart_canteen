"use client";

import useSWR from "swr";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShoppingBag, Clock, ArrowRight, Flame, Star, Trophy,
  Coffee, Utensils, UtensilsCrossed, ArrowLeft
} from "lucide-react";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((r) => r.json());

const CATEGORY_ICON = { snacks: Coffee, meals: Utensils, beverages: UtensilsCrossed };

// Simulated off-peak discount: 20% off before 11am or after 3pm
function getDiscountedPrice(price) {
  const h = new Date().getHours();
  if (h < 11 || h >= 15) return { price: Math.round(price * 0.8), discounted: true };
  return { price, discounted: false };
}

export default function MenuPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const { data: menuItems, isLoading } = useSWR("/api/menu", fetcher, { refreshInterval: 15000 });
  const { data: leaderboard } = useSWR("/api/leaderboard", fetcher);

  const [cart, setCart] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  const addToCart = (item) => {
    const { price } = getDiscountedPrice(item.price);
    setCart((prev) => {
      const existing = prev.find((x) => x.menuItem._id === item._id);
      if (existing) return prev.map((x) => x.menuItem._id === item._id ? { ...x, quantity: x.quantity + 1 } : x);
      return [...prev, { menuItem: { ...item, price }, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => setCart((prev) => prev.filter((x) => x.menuItem._id !== itemId));
  const changeQty = (itemId, delta) => {
    setCart((prev) => prev
      .map((x) => x.menuItem._id === itemId ? { ...x, quantity: x.quantity + delta } : x)
      .filter((x) => x.quantity > 0)
    );
  };

  const totalAmount = cart.reduce((acc, c) => acc + c.menuItem.price * c.quantity, 0);
  const filteredItems = menuItems?.filter((i) => activeCategory === "all" || i.category === activeCategory) ?? [];

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((c) => ({ menuItem: c.menuItem._id, quantity: c.quantity })),
          totalAmount,
          userId: session?.user?.id,
          scheduledPickupTime: selectedTime
            ? new Date(new Date().toDateString() + " " + selectedTime)
            : null,
        }),
      });
      const data = await res.json();
      if (data.tokenNumber) router.push(`/track/${encodeURIComponent(data.tokenNumber)}`);
    } catch (err) {
      console.error(err);
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-rose-400 bg-clip-text text-transparent">
                Order Menu
              </h1>
              {session?.user && (
                <p className="text-xs text-zinc-400">
                  Points: <span className="text-yellow-500 font-bold">{session.user.rewardPoints ?? 0} ⭐</span>
                </p>
              )}
            </div>
          </div>
          <div className="relative">
            <ShoppingBag className="w-6 h-6 text-indigo-400" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cart.reduce((a, c) => a + c.quantity, 0)}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Off-peak Banner */}
      {getDiscountedPrice(1).discounted && (
        <div className="bg-gradient-to-r from-amber-500/10 to-rose-500/10 border-b border-amber-500/20 text-center py-2 px-4 text-sm text-amber-400 font-semibold">
          🎉 Off-Peak Hours — All items 20% OFF!
        </div>
      )}

      <div className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Menu (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {["all", "snacks", "meals", "beverages"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border capitalize ${
                  activeCategory === cat
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Trending Banner */}
          {menuItems?.some((i) => i.isTrending && (activeCategory === "all" || i.category === activeCategory)) && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl px-5 py-3 flex items-center gap-2 text-rose-400 text-sm font-medium">
              <Flame className="w-4 h-4" /> Trending items are marked with 🔥 — grab them before they run out!
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-zinc-900 rounded-2xl h-36 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredItems.map((item) => {
                const { price: discountedPrice, discounted } = getDiscountedPrice(item.price);
                const CatIcon = CATEGORY_ICON[item.category] || Coffee;
                return (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`bg-zinc-900/50 border rounded-2xl p-4 flex gap-4 transition-colors ${
                      item.inStock
                        ? "border-zinc-800 hover:border-indigo-500/50"
                        : "border-zinc-800 opacity-60"
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl shrink-0"
                      onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=60"; }}
                    />
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h3 className="font-semibold text-base flex items-center gap-1.5 flex-wrap">
                          {item.name}
                          {item.isTrending && <Flame className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                          <CatIcon className="w-3 h-3" />
                          <span className="capitalize">{item.category}</span>
                          <span>· {item.preparationTime}m</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div>
                          <span className="font-bold text-indigo-400">₹{discountedPrice}</span>
                          {discounted && (
                            <span className="text-xs text-zinc-500 line-through ml-1.5">₹{item.price}</span>
                          )}
                        </div>
                        {item.inStock ? (
                          <button
                            onClick={() => addToCart(item)}
                            className="bg-zinc-800 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                          >
                            + Add
                          </button>
                        ) : (
                          <span className="text-rose-500 text-xs font-semibold">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Leaderboard */}
          {leaderboard?.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-4">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" /> Rewards Leaderboard
              </h3>
              <div className="space-y-2">
                {leaderboard.map((u, i) => (
                  <div key={u._id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 text-center font-bold ${i === 0 ? "text-yellow-400" : i === 1 ? "text-zinc-300" : i === 2 ? "text-amber-600" : "text-zinc-500"}`}>
                        {i + 1}
                      </span>
                      <span className="text-zinc-200">{u.name}</span>
                    </div>
                    <span className="text-yellow-400 font-semibold">{u.rewardPoints} ⭐</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cart (Right Col) */}
        <div>
          <div className="sticky top-24 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-400" /> Your Order
            </h2>

            {cart.length === 0 ? (
              <p className="text-zinc-600 text-center py-10 text-sm">Your cart is empty.<br />Add something delicious!</p>
            ) : (
              <div className="space-y-4">
                {cart.map((c) => (
                  <div key={c.menuItem._id} className="flex justify-between items-center gap-2">
                    <p className="text-sm font-medium text-zinc-200 flex-1 truncate">{c.menuItem.name}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => changeQty(c.menuItem._id, -1)} className="w-6 h-6 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs flex items-center justify-center font-bold">−</button>
                      <span className="text-sm font-mono w-4 text-center">{c.quantity}</span>
                      <button onClick={() => changeQty(c.menuItem._id, 1)} className="w-6 h-6 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs flex items-center justify-center font-bold">+</button>
                      <span className="text-indigo-400 font-bold text-sm w-14 text-right">₹{c.menuItem.price * c.quantity}</span>
                    </div>
                  </div>
                ))}

                <div className="border-t border-zinc-800 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-indigo-400">₹{totalAmount}</span>
                  </div>
                  {session?.user && (
                    <div className="flex items-center gap-1 text-yellow-400 text-xs mt-1 justify-end">
                      <Star className="w-3 h-3" /> +{Math.floor(totalAmount / 10)} points on checkout
                    </div>
                  )}
                </div>

                {/* Pre-Order Scheduling */}
                <div>
                  <label className="text-sm font-medium text-zinc-400 flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4" /> Schedule Pickup <span className="text-xs text-zinc-600">(optional)</span>
                  </label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                  {selectedTime && (
                    <p className="text-xs text-cyan-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Pre-order for {selectedTime}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-4 mt-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] disabled:opacity-50"
                >
                  {isCheckingOut ? "Processing..." : <>Place Order & Get Token <ArrowRight className="ml-2 w-5 h-5" /></>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
