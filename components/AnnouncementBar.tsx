"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ChevronRight, X } from "lucide-react";
import Link from "next/link";

const ANNOUNCEMENTS = [
  "✨ Handcrafted with Love • Free Express Delivery on orders above ₹999",
  "🎁 Direct WhatsApp Ordering • Instant Personalization & Support",
  "💐 Premium Gift Hampers for Birthdays, Anniversaries & Festive Moments",
  "⭐ 100% Delight Guarantee • Over 15,000+ Happy Moments Delivered",
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-burgundy via-wine to-burgundy text-white text-xs md:text-sm py-2 px-4 shadow-sm z-50 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 text-center font-medium tracking-wide flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-gold shrink-0 animate-pulse" />
          <span className="transition-opacity duration-500 ease-in-out">
            {ANNOUNCEMENTS[currentIndex]}
          </span>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center text-gold underline underline-offset-2 ml-2 hover:text-white transition-colors"
          >
            Explore <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white/70 hover:text-white transition-colors p-1"
          aria-label="Close Announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
