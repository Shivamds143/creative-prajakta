"use client";

import React from "react";
import Link from "next/link";
import EmptyState from "@/components/ui/EmptyState";
import { Home, ShoppingBag, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-ivory/50 min-h-[75vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-12 shadow-soft border border-rose-100/70 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-blush/60 text-burgundy flex items-center justify-center mx-auto text-4xl shadow-inner">
          🎁
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-gold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> 404 Error
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy">
            Gift Not Found
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            The page or curated collection you were looking for could not be found. It may have been moved, updated, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-stone-200 text-stone-700 text-xs sm:text-sm font-semibold hover:border-burgundy hover:text-burgundy transition-all"
          >
            <Home className="w-4 h-4" /> Return to Home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-burgundy hover:bg-wine text-white text-xs sm:text-sm font-semibold shadow-soft hover:shadow-card transition-all"
          >
            <ShoppingBag className="w-4 h-4" /> Browse All Gifts
          </Link>
        </div>
      </div>
    </div>
  );
}
