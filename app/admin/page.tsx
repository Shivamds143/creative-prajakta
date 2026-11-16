"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Users,
  Settings,
  TrendingUp,
  Tag,
  CheckCircle,
  ExternalLink,
  Plus,
} from "lucide-react";
import { products } from "@/lib/data";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "settings">("overview");

  // Simulated orders state
  const [orders, setOrders] = useState([
    {
      id: "GA-849201",
      customer: "Priya Sharma",
      phone: "+91 98450 12345",
      product: "Personalized Oak Wood Photo Frame",
      total: 648,
      status: "SHIPPED",
      date: "16 Nov 2026",
    },
    {
      id: "GA-849202",
      customer: "Rahul Verma",
      phone: "+91 99801 67890",
      product: "Royal Artisan Chocolate & Macaron Trunk",
      total: 1499,
      status: "CONFIRMED",
      date: "16 Nov 2026",
    },
    {
      id: "GA-849203",
      customer: "Ananya Iyer",
      phone: "+91 97402 11223",
      product: "Custom Spotify Code Keychain",
      total: 249,
      status: "PROCESSING",
      date: "15 Nov 2026",
    },
    {
      id: "GA-849204",
      customer: "Vikram Malhotra",
      phone: "+91 98110 99887",
      product: "Signature Executive Onboarding Welcome Hamper",
      total: 1999,
      status: "DELIVERED",
      date: "14 Nov 2026",
    },
  ]);

  const [whatsappPhone, setWhatsappPhone] = useState("918087142499");
  const [savedMsg, setSavedMsg] = useState(false);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === id ? { ...ord, status: newStatus } : ord))
    );
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  return (
    <div className="bg-ivory/50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="flex flex-wrap items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-gold">
              Management Console
            </span>
            <h1 className="font-serif text-3xl font-bold text-burgundy">Creative Prajakta Admin Portal</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="btn-outline text-xs py-2 px-4">
              View Live Website ↗
            </Link>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-stone-200 mt-6 gap-2 sm:gap-6 text-xs sm:text-sm font-semibold overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 px-2 transition-colors whitespace-nowrap ${activeTab === "overview"
                ? "border-b-2 border-burgundy text-burgundy"
                : "text-stone-400 hover:text-ink"
              }`}
          >
            Dashboard Overview
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 px-2 transition-colors whitespace-nowrap ${activeTab === "products"
                ? "border-b-2 border-burgundy text-burgundy"
                : "text-stone-400 hover:text-ink"
              }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 px-2 transition-colors whitespace-nowrap ${activeTab === "orders"
                ? "border-b-2 border-burgundy text-burgundy"
                : "text-stone-400 hover:text-ink"
              }`}
          >
            WhatsApp Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-3 px-2 transition-colors whitespace-nowrap ${activeTab === "settings"
                ? "border-b-2 border-burgundy text-burgundy"
                : "text-stone-400 hover:text-ink"
              }`}
          >
            WhatsApp & Store Settings
          </button>
        </div>

        {/* Content Tabs */}
        <div className="py-8">
          {/* 1. Overview */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-2xl shadow-soft border border-rose-100/60">
                  <span className="text-stone-400 text-xs font-semibold uppercase">Total Catalog</span>
                  <p className="font-serif text-2xl font-bold text-burgundy mt-1">
                    {products.length} Items
                  </p>
                  <span className="text-[11px] text-emerald-600 font-medium">4 Collections Active</span>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-soft border border-rose-100/60">
                  <span className="text-stone-400 text-xs font-semibold uppercase">WhatsApp Inquiries</span>
                  <p className="font-serif text-2xl font-bold text-burgundy mt-1">214 Chats</p>
                  <span className="text-[11px] text-emerald-600 font-medium">↑ 18% this week</span>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-soft border border-rose-100/60">
                  <span className="text-stone-400 text-xs font-semibold uppercase">Fulfilled Orders</span>
                  <p className="font-serif text-2xl font-bold text-burgundy mt-1">1,480+</p>
                  <span className="text-[11px] text-emerald-600 font-medium">99.4% On-time</span>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-soft border border-rose-100/60">
                  <span className="text-stone-400 text-xs font-semibold uppercase">Average Rating</span>
                  <p className="font-serif text-2xl font-bold text-amber-500 mt-1">4.9 ★</p>
                  <span className="text-[11px] text-stone-400">1,240 Verified Reviews</span>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-3xl p-6 shadow-soft border border-rose-100/60">
                <h3 className="font-serif font-bold text-lg text-burgundy mb-4">
                  Recent WhatsApp Orders
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase tracking-wider">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Product</th>
                        <th className="pb-3">Total</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-600">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-stone-50/50">
                          <td className="py-3.5 font-bold text-burgundy">{ord.id}</td>
                          <td className="py-3.5">
                            <span className="font-semibold text-ink block">{ord.customer}</span>
                            <span className="text-[10px] text-stone-400">{ord.phone}</span>
                          </td>
                          <td className="py-3.5 truncate max-w-xs">{ord.product}</td>
                          <td className="py-3.5 font-semibold text-ink">₹{ord.total}</td>
                          <td className="py-3.5">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blush text-burgundy">
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. Products */}
          {activeTab === "products" && (
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-rose-100/60 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-stone-100">
                <h2 className="font-serif font-bold text-lg text-burgundy">Live Product Catalog</h2>
                <span className="text-xs text-stone-500 font-medium">{products.length} Products</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => (
                  <div
                    key={p.slug}
                    className="p-4 rounded-2xl border border-stone-200 flex gap-3 hover:border-burgundy/40 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-xl bg-blush/30 shrink-0 overflow-hidden relative flex items-center justify-center">
                      <span className="text-2xl">{p.emoji || "🎁"}</span>
                    </div>
                    <div className="flex-1 min-w-0 text-xs space-y-0.5">
                      <h4 className="font-semibold text-ink truncate">{p.name}</h4>
                      <p className="text-stone-400">{p.category}</p>
                      <p className="font-bold text-burgundy">₹{p.price}</p>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                        Stock: {p.stock}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Orders Management */}
          {activeTab === "orders" && (
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-rose-100/60 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-stone-100">
                <h2 className="font-serif font-bold text-lg text-burgundy">Manage Orders</h2>
                <span className="text-xs text-stone-500">{orders.length} Total Orders</span>
              </div>

              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl bg-stone-50/50 border border-stone-200 flex flex-wrap items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-burgundy text-sm">{ord.id}</span>
                        <span className="text-xs text-stone-400">• {ord.date}</span>
                      </div>
                      <p className="text-xs text-ink font-semibold mt-1">
                        {ord.customer} ({ord.phone})
                      </p>
                      <p className="text-xs text-stone-500">{ord.product}</p>
                      <p className="text-xs font-bold text-burgundy mt-1">Total: ₹{ord.total}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                        className="text-xs font-semibold bg-white border border-stone-300 rounded-xl px-3 py-2 focus:outline-none focus:border-burgundy"
                      >
                        <option value="PENDING_WHATSAPP">PENDING_WHATSAPP</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>

                      <a
                        href={`https://wa.me/${ord.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-whatsapp text-xs py-2 px-3.5"
                      >
                        Open Chat
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Settings */}
          {activeTab === "settings" && (
            <div className="max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-rose-100/60 space-y-6">
              <h2 className="font-serif font-bold text-lg text-burgundy pb-4 border-b border-stone-100">
                WhatsApp Concierge Configuration
              </h2>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">
                    Business WhatsApp Phone Number
                  </label>
                  <input
                    type="text"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    className="input font-mono"
                    placeholder="e.g. 918087142499"
                  />
                  <span className="text-[10px] text-stone-400 block">
                    All customer checkout flows redirect to this registered WhatsApp number. Include country code without + or spaces (e.g. 918087142499).
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Store Support Email</label>
                  <input
                    type="email"
                    defaultValue="support@creativeprajakta.com"
                    className="input font-mono"
                  />
                </div>

                <button type="submit" className="btn text-xs py-3 px-6">
                  Save Changes
                </button>

                {savedMsg && (
                  <p className="text-xs font-semibold text-emerald-700 animate-fadeIn">
                    ✓ Settings updated successfully.
                  </p>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

