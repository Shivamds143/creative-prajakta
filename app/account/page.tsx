"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  ShoppingBag,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useWishlist } from "@/lib/context/WishlistContext";
import { products } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export default function AccountPage() {
  const { user, login, logout, isAuthenticated } = useAuth();
  const { wishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "profile">("orders");
  const [orders, setOrders] = useState<any[]>([]);

  // Auth form state if not logged in
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("giftaura_customer_orders");
      if (stored) {
        setOrders(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      name: name || (authMode === "login" ? "Valued Customer" : "New Customer"),
      phone,
      email: email || undefined,
    });
  };

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.slug));

  return (
    <div className="bg-ivory/50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest font-semibold text-gold">
            Customer Dashboard
          </span>
          <h1 className="font-serif text-3xl font-bold text-burgundy">
            {isAuthenticated ? `Welcome back, ${user?.name}` : "My Account"}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Track your WhatsApp orders, access your saved gift wishlist, and manage delivery details.
          </p>
        </div>

        {!isAuthenticated ? (
          /* Login / Registration Card */
          <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-soft border border-rose-100/60 space-y-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-blush/60 text-burgundy rounded-2xl flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-xl font-bold text-burgundy">
                {authMode === "login" ? "Sign In to Creative Prajakta" : "Create Your Customer Account"}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Enter your WhatsApp phone number to access your orders.
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === "register" && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">
                  WhatsApp Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                />
              </div>

              <button type="submit" className="btn w-full text-xs py-3.5 mt-2">
                {authMode === "login" ? "Continue to Account →" : "Create Account →"}
              </button>
            </form>

            <div className="text-center text-xs text-stone-500">
              {authMode === "login" ? (
                <p>
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => setAuthMode("register")}
                    className="text-burgundy font-semibold hover:underline"
                  >
                    Register here
                  </button>
                </p>
              ) : (
                <p>
                  Already registered?{" "}
                  <button
                    onClick={() => setAuthMode("login")}
                    className="text-burgundy font-semibold hover:underline"
                  >
                    Sign in here
                  </button>
                </p>
              )}
            </div>
          </div>
        ) : (
          /* Logged In Hub */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3 bg-white p-5 rounded-3xl shadow-soft border border-rose-100/60 space-y-2">
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-colors ${activeTab === "orders"
                    ? "bg-burgundy text-white"
                    : "text-stone-600 hover:bg-stone-50"
                  }`}
              >
                <Package className="w-4 h-4" />
                <span>My Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("wishlist")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-colors ${activeTab === "wishlist"
                    ? "bg-burgundy text-white"
                    : "text-stone-600 hover:bg-stone-50"
                  }`}
              >
                <Heart className="w-4 h-4" />
                <span>Saved Wishlist ({wishlist.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-colors ${activeTab === "profile"
                    ? "bg-burgundy text-white"
                    : "text-stone-600 hover:bg-stone-50"
                  }`}
              >
                <User className="w-4 h-4" />
                <span>Profile & Details</span>
              </button>

              <div className="pt-4 border-t border-stone-100 mt-2">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Content Tab */}
            <div className="lg:col-span-9 bg-white p-6 sm:p-8 rounded-3xl shadow-soft border border-rose-100/60">
              {/* Tab: Orders */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-stone-100">
                    <h2 className="font-serif font-bold text-lg text-burgundy">Your Order History</h2>
                    <span className="text-xs text-stone-400">Direct WhatsApp Orders</span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-14 space-y-3">
                      <div className="w-16 h-16 bg-blush/60 rounded-full flex items-center justify-center mx-auto text-3xl">
                        📦
                      </div>
                      <h3 className="font-serif text-lg font-bold text-burgundy">No orders yet</h3>
                      <p className="text-xs text-stone-500 max-w-sm mx-auto">
                        Once you order via WhatsApp, your reference details will be logged right here for tracking.
                      </p>
                      <Link href="/shop" className="btn text-xs mt-2">
                        Explore Collections
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((ord, idx) => (
                        <div
                          key={idx}
                          className="p-5 rounded-2xl bg-stone-50/60 border border-stone-200/70 space-y-3"
                        >
                          <div className="flex flex-wrap justify-between items-center gap-2">
                            <div>
                              <span className="text-xs font-bold text-burgundy">
                                #{ord.orderNumber}
                              </span>
                              <span className="text-[11px] text-stone-400 block">
                                Placed on: {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full">
                              ● {ord.status || "PENDING_WHATSAPP"}
                            </span>
                          </div>

                          <div className="text-xs text-stone-600 space-y-1">
                            <p>
                              <strong>Delivery Address:</strong> {ord.address}
                            </p>
                            <p>
                              <strong>Total Amount:</strong> ₹{ord.totalAmount}
                            </p>
                          </div>

                          <div className="pt-2 flex justify-end">
                            <a
                              href={`https://wa.me/918087142499?text=${encodeURIComponent(
                                `Hi Creative Prajakta, could I check the live status of my order #${ord.orderNumber}?`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                            >
                              Track on WhatsApp <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Wishlist */}
              {activeTab === "wishlist" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-stone-100">
                    <h2 className="font-serif font-bold text-lg text-burgundy">Saved Wishlist</h2>
                    <span className="text-xs text-stone-400">{wishlist.length} items</span>
                  </div>

                  {wishlistedProducts.length === 0 ? (
                    <div className="text-center py-14 space-y-3">
                      <div className="w-16 h-16 bg-blush/60 text-burgundy rounded-full flex items-center justify-center mx-auto text-3xl">
                        ❤️
                      </div>
                      <h3 className="font-serif text-lg font-bold text-burgundy">
                        Your wishlist is empty
                      </h3>
                      <p className="text-xs text-stone-500 max-w-sm mx-auto">
                        Tap the heart icon on any gift to save it for upcoming birthdays and anniversaries.
                      </p>
                      <Link href="/shop" className="btn text-xs mt-2">
                        Start Exploring
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {wishlistedProducts.map((p) => (
                        <ProductCard key={p.slug} p={p} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Profile */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <h2 className="font-serif font-bold text-lg text-burgundy pb-4 border-b border-stone-100">
                    Account Profile
                  </h2>
                  <div className="max-w-md space-y-4 text-xs">
                    <div>
                      <label className="font-semibold text-stone-500 block mb-1">Customer Name</label>
                      <p className="text-sm font-semibold text-ink bg-stone-50 p-3 rounded-xl border border-stone-200">
                        {user?.name}
                      </p>
                    </div>
                    <div>
                      <label className="font-semibold text-stone-500 block mb-1">
                        Registered WhatsApp
                      </label>
                      <p className="text-sm font-semibold text-ink bg-stone-50 p-3 rounded-xl border border-stone-200">
                        {user?.phone}
                      </p>
                    </div>
                    {user?.email && (
                      <div>
                        <label className="font-semibold text-stone-500 block mb-1">Email</label>
                        <p className="text-sm font-semibold text-ink bg-stone-50 p-3 rounded-xl border border-stone-200">
                          {user.email}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

