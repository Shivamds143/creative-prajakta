"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/ui/EmptyState";
import { useWishlist } from "@/lib/context/WishlistContext";
import { products } from "@/lib/data";
import { Heart, ArrowLeft, Sparkles } from "lucide-react";

function WishlistContent() {
  const { wishlist } = useWishlist();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.slug));

  return (
    <div className="bg-ivory/50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-burgundy transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-gold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Saved Treasures
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy mt-1">
                My Saved Wishlist
              </h1>
            </div>
            <span className="text-xs font-medium text-stone-500 bg-white px-3 py-1.5 rounded-full border border-rose-100 shadow-xs w-fit">
              {wishlistedProducts.length} {wishlistedProducts.length === 1 ? "gift saved" : "gifts saved"}
            </span>
          </div>
        </div>

        {/* Content */}
        {wishlistedProducts.length === 0 ? (
          <EmptyState
            title="Your wishlist is empty"
            description="Explore our curated collection of personalized keepsakes and gourmet hampers, then tap the heart icon on any gift to save it here."
            action={{
              label: "Discover Gifts",
              onClick: () => {
                window.location.href = "/shop";
              },
            }}
            className="bg-white rounded-3xl p-12 shadow-soft border border-rose-100/50"
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistedProducts.map((p) => (
              <ProductCard key={p.slug} p={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function WishlistPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-ivory/50 min-h-screen py-16 flex items-center justify-center">
          <div className="animate-pulse text-burgundy font-serif font-bold text-base">
            Loading your wishlist...
          </div>
        </div>
      }
    >
      <WishlistContent />
    </Suspense>
  );
}
