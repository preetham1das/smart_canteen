"use client";

import useSWR from "swr";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, TrendingUp, ShoppingBag, DollarSign,
  Trash2, Plus, Pencil, Check, X, Loader2, ArrowLeft,
  Flame, BarChart3
} from "lucide-react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";

const fetcher = (url) => fetch(url).then((r) => r.json());

const PIE_COLORS = ["#10b981", "#14b8a6", "#34d399", "#2dd4bf", "#059669", "#0d9488"];

const STAT_CARD = ({ icon: Icon, label, value, sub, color }) => (
  <div className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-start gap-4`}>
    <div className={`p-3 rounded-xl ${color} shrink-0`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-zinc-400 text-sm">{label}</p>
      <p className="text-3xl font-black text-white mt-1">{value}</p>
      {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
    </div>
  </div>
);

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data: analytics, isLoading: analyticsLoading } = useSWR("/api/analytics", fetcher, { refreshInterval: 10000 });
  const { data: menuItems, mutate: mutateMenu } = useSWR("/api/menu", fetcher);
  const { data: orders } = useSWR("/api/orders", fetcher, { refreshInterval: 10000 });

  /* ---- Menu Management Handlers ---- */
  const saveEdit = async (item) => {
    setSaving(true);
    await fetch(`/api/menu/${item._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    setEditingItem(null);
    mutateMenu();
    setSaving(false);
  };

  const toggleStock = async (item) => {
    await fetch(`/api/menu/${item._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inStock: !item.inStock }),
    });
    mutateMenu();
  };

  const deleteItem = async (id) => {
    await fetch(`/api/menu/${id}`, { method: "DELETE" });
    mutateMenu();
  };

  const createItem = async () => {
    if (!newItem?.name) return;
    setSaving(true);
    await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newItem,
        price: Number(newItem.price) || 0,
        preparationTime: Number(newItem.preparationTime) || 5,
        inStock: true,
        isTrending: false,
        image: newItem.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80",
      }),
    });
    setNewItem(null);
    mutateMenu();
    setSaving(false);
  };

  const TABS = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "menu", label: "Manage Menu", icon: ShoppingBag },
    { id: "orders", label: "Orders", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Sidebar */}
      <div className="flex h-screen overflow-hidden">
        <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
          <div className="p-6 border-b border-zinc-800">
            <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/20 p-2 rounded-xl border border-emerald-500/30">
                <LayoutDashboard className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h1 className="font-bold text-sm">Admin Panel</h1>
                <p className="text-xs text-zinc-500">NexGen Canteen</p>
              </div>
            </div>
          </div>

          <nav className="p-4 flex flex-col gap-1 flex-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                  activeTab === id
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-zinc-800">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
              <p className="text-xs text-emerald-400 font-semibold">System Status</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs text-zinc-400">All systems operational</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">

          {/* ── Overview Tab ── */}
          {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-1">Overview</h2>
                <p className="text-zinc-400">Today's performance at a glance.</p>
              </div>

              {analyticsLoading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-emerald-400 animate-spin" /></div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <STAT_CARD icon={ShoppingBag} label="Today's Orders" value={analytics?.totalOrders ?? 0} sub="Total placed today" color="bg-emerald-500/10 text-emerald-400" />
                    <STAT_CARD icon={DollarSign} label="Today's Revenue" value={`₹${analytics?.totalRevenue ?? 0}`} sub="Gross sales" color="bg-teal-500/10 text-teal-400" />
                    <STAT_CARD icon={TrendingUp} label="Completed" value={analytics?.statusBreakdown?.Completed ?? 0} sub="Successfully fulfilled" color="bg-emerald-500/10 text-emerald-400" />
                    <STAT_CARD icon={Trash2} label="Pending / In-Progress" value={(analytics?.statusBreakdown?.Pending ?? 0) + (analytics?.statusBreakdown?.Preparing ?? 0)} sub="Not yet fulfilled" color="bg-yellow-500/10 text-yellow-400" />
                  </div>

                  {/* Weekly Revenue Chart */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-6">Weekly Revenue & Orders</h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={analytics?.weeklyRevenue ?? []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="day" stroke="#52525b" tick={{ fill: "#a1a1aa" }} />
                        <YAxis stroke="#52525b" tick={{ fill: "#a1a1aa" }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "12px", color: "#fff" }}
                          formatter={(val, name) => [name === "revenue" ? `₹${val}` : val, name === "revenue" ? "Revenue" : "Orders"]}
                        />
                        <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="orders" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ── Analytics Tab ── */}
          {activeTab === "analytics" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-1">Deep Analytics</h2>
                <p className="text-zinc-400">Popular items, peak hours, and order flow.</p>
              </div>

              {analyticsLoading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-emerald-400 animate-spin" /></div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Popular Items */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Flame className="w-5 h-5 text-rose-400" /> Most Ordered Items</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={analytics?.popularItems ?? []} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                        <XAxis type="number" stroke="#52525b" tick={{ fill: "#a1a1aa" }} />
                        <YAxis dataKey="name" type="category" stroke="#52525b" tick={{ fill: "#a1a1aa", fontSize: 12 }} width={120} />
                        <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "12px", color: "#fff" }} />
                        <Bar dataKey="quantity" fill="#10b981" radius={[0, 6, 6, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Peak Hours */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-indigo-400" /> Peak Hour Analysis (Today)</h3>
                    {analytics?.peakHours?.length === 0 ? (
                      <p className="text-zinc-600 text-center py-16">No orders placed today yet.</p>
                    ) : (
                      <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={analytics?.peakHours ?? []}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                          <XAxis dataKey="hour" stroke="#52525b" tick={{ fill: "#a1a1aa" }} />
                          <YAxis stroke="#52525b" tick={{ fill: "#a1a1aa" }} allowDecimals={false} />
                          <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "12px", color: "#fff" }} />
                          <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 5 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Order Status Pie */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-6">Order Status Breakdown</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie
                          data={Object.entries(analytics?.statusBreakdown ?? {}).map(([k, v]) => ({ name: k, value: v }))}
                          cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}
                        >
                          {Object.entries(analytics?.statusBreakdown ?? {}).map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "12px", color: "#fff" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* AI Demand Prediction (Simulated) */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                      <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">AI</span>
                      Demand Prediction
                    </h3>
                    <p className="text-zinc-500 text-sm mb-4">Simulated forecast for next 6 hours based on historical patterns.</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={analytics?.demandPrediction ?? []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="time" stroke="#52525b" tick={{ fill: "#a1a1aa" }} />
                        <YAxis stroke="#52525b" tick={{ fill: "#a1a1aa" }} />
                        <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "12px", color: "#fff" }} />
                        <Line type="monotone" dataKey="predicted" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: "#f59e0b", r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                    <p className="text-xs text-amber-400 mt-3 bg-amber-500/10 rounded-xl px-3 py-2 border border-amber-500/20">
                      ⚡ Peak predicted at 1–2h from now. Consider increasing meal station capacity.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Menu Management Tab ── */}
          {activeTab === "menu" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold mb-1">Manage Menu</h2>
                  <p className="text-zinc-400">Edit items, toggle availability, set trending.</p>
                </div>
                <button
                  onClick={() => setNewItem({ name: "", category: "snacks", price: "", preparationTime: "", image: "" })}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>

              {/* Add New Item Form */}
              {newItem && (
                <div className="bg-zinc-900 border border-emerald-500/30 rounded-2xl p-6">
                  <h3 className="font-bold mb-4 text-emerald-400">New Menu Item</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { key: "name", placeholder: "Item Name" },
                      { key: "price", placeholder: "Price (₹)", type: "number" },
                      { key: "preparationTime", placeholder: "Prep time (mins)", type: "number" },
                      { key: "image", placeholder: "Image URL" },
                    ].map(({ key, placeholder, type }) => (
                      <input key={key} type={type || "text"} placeholder={placeholder}
                        value={newItem[key] || ""}
                        onChange={(e) => setNewItem((p) => ({ ...p, [key]: e.target.value }))}
                        className="bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    ))}
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem((p) => ({ ...p, category: e.target.value }))}
                      className="bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="snacks">Snacks</option>
                      <option value="meals">Meals</option>
                      <option value="beverages">Beverages</option>
                    </select>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={createItem} disabled={saving} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold disabled:opacity-50">
                      {saving ? "Saving..." : "Create Item"}
                    </button>
                    <button onClick={() => setNewItem(null)} className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm">Cancel</button>
                  </div>
                </div>
              )}

              {/* Menu Item List */}
              <div className="space-y-3">
                {menuItems?.map((item) => (
                  <div key={item._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />

                    {editingItem?._id === item._id ? (
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 items-center">
                        <input value={editingItem.name} onChange={(e) => setEditingItem(p => ({ ...p, name: e.target.value }))}
                          className="bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-1.5 text-sm text-white focus:border-indigo-500 md:col-span-2" placeholder="Name" />
                        
                        <input value={editingItem.image} onChange={(e) => setEditingItem(p => ({ ...p, image: e.target.value }))}
                          className="bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-1.5 text-sm text-white focus:border-indigo-500" placeholder="Image URL" />

                        <div className="flex gap-2">
                          <input type="number" value={editingItem.price} onChange={(e) => setEditingItem(p => ({ ...p, price: e.target.value }))}
                            className="bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-1.5 text-sm text-white w-20 focus:border-indigo-500" placeholder="Price" />
                          <input type="number" value={editingItem.preparationTime} onChange={(e) => setEditingItem(p => ({ ...p, preparationTime: e.target.value }))}
                            className="bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-1.5 text-sm text-white w-20 focus:border-indigo-500" placeholder="Min" />
                        </div>

                        <select value={editingItem.category} onChange={(e) => setEditingItem(p => ({ ...p, category: e.target.value }))}
                          className="bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-1.5 text-sm text-white focus:border-indigo-500">
                          <option value="snacks">Snacks</option>
                          <option value="meals">Meals</option>
                          <option value="beverages">Beverages</option>
                        </select>

                        <div className="flex gap-2 justify-end">
                          <button onClick={() => saveEdit({ ...editingItem, price: Number(editingItem.price), preparationTime: Number(editingItem.preparationTime) })} 
                            className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl transition-colors">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          </button>
                          <button onClick={() => setEditingItem(null)} className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-xl"><X className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            {item.isTrending && <Flame className="w-4 h-4 text-rose-400" />}
                          </div>
                          <p className="text-sm text-zinc-400 capitalize">{item.category} · ₹{item.price} · {item.preparationTime}m prep</p>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* In Stock Toggle */}
                          <button onClick={() => toggleStock(item)}
                            className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${item.inStock ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20"}`}>
                            {item.inStock ? "In Stock" : "Out of Stock"}
                          </button>

                          <button onClick={() => setEditingItem(item)} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteItem(item._id)} className="p-2 hover:bg-rose-500/10 rounded-lg text-zinc-400 hover:text-rose-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Orders Tab ── */}
          {activeTab === "orders" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-1">All Orders</h2>
                <p className="text-zinc-400">Live view of every placed order.</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase">
                      <th className="px-6 py-4 text-left">Token</th>
                      <th className="px-6 py-4 text-left">Items</th>
                      <th className="px-6 py-4 text-left">Amount</th>
                      <th className="px-6 py-4 text-left">Status</th>
                      <th className="px-6 py-4 text-left">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders?.map((o) => {
                      const statusColors = {
                        Pending: "bg-yellow-500/10 text-yellow-400",
                        Preparing: "bg-emerald-500/10 text-emerald-400",
                        Ready: "bg-teal-500/10 text-teal-400",
                        Completed: "bg-zinc-700 text-zinc-400",
                      };
                      return (
                        <tr key={o._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                          <td className="px-6 py-4 font-bold text-emerald-300">{o.tokenNumber}</td>
                          <td className="px-6 py-4 text-zinc-300">{o.items?.map(i => i.menuItem?.name).filter(Boolean).join(", ")}</td>
                          <td className="px-6 py-4 font-semibold">₹{o.totalAmount}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[o.status] || "bg-zinc-700 text-zinc-400"}`}>{o.status}</span>
                          </td>
                          <td className="px-6 py-4 text-zinc-500">{new Date(o.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {!orders?.length && <p className="text-zinc-600 text-center py-12">No orders yet.</p>}
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
