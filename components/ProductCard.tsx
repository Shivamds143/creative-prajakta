"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Star, Sparkles, Check } from "lucide-react";
import { useWishlist } from "@/lib/context/WishlistContext";
import { useCart } from "@/lib/context/CartContext";

export interface ProductItem {
  _id?: string;
  slug: string;
  name: string;
  price: number;
  mrp: number;
  rating?: number;
  reviews?: number;
  category?: string;
  categorySlug?: string;
  occasion?: string[];
  recipient?: string[];
  personalizable?: boolean;
  badge?: string;
  emoji?: string;
  images?: string[];
  description?: string;
}

export default function ProductCard({ p }: { p: ProductItem }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const discountPercent = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
  const wishlisted = isWishlisted(p.slug);
  const displayImage = p.images && p.images.length > 0 ? p.images[0] : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: p._id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      mrp: p.mrp,
      imageUrl: displayImage || undefined,
      emoji: p.emoji,
      quantity: 1,
      badge: p.badge,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="group relative rounded-2xl bg-white border border-rose-100/60 p-3.5 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      {/* Media container */}
      <div className="relative aspect-square w-full rounded-xl bg-blush/30 overflow-hidden flex items-center justify-center">
        <Link href={`/shop/${p.slug}`} className="w-full h-full relative block">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={p.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {p.emoji || "🎁"}
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {p.badge && (
            <span className="rounded-full bg-burgundy px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              {p.badge}
            </span>
          )}
          {p.personalizable && (
            <span className="rounded-full bg-gold/90 text-wine px-2 py-0.5 text-[10px] font-semibold flex items-center gap-1 shadow-sm">
              <Sparkles className="w-2.5 h-2.5" /> Custom
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(p.slug);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all duration-200 shadow-sm z-10 ${
            wishlisted
              ? "bg-rose-50 text-rose-600 scale-110"
              : "bg-white/80 text-stone-600 hover:text-rose-600 hover:bg-white"
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-rose-600" : ""}`} />
        </button>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute bottom-2 inset-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handleQuickAdd}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md transition-all duration-200 ${
              isAdded
                ? "bg-emerald-600 text-white"
                : "bg-burgundy text-white hover:bg-wine active:scale-95"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added to Bag
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-3 flex flex-col flex-1 justify-between">
        <div>
          {p.category && (
            <p className="text-[11px] font-medium uppercase tracking-wider text-stone-400 mb-0.5">
              {p.category}
            </p>
          )}
          <Link href={`/shop/${p.slug}`} className="block">
            <h3 className="font-serif text-sm font-semibold text-ink line-clamp-1 group-hover:text-burgundy transition-colors">
              {p.name}
            </h3>
          </Link>
        </div>

        <div className="pt-2">
          {/* Rating */}
          <div className="flex items-center gap-1 text-[11px] text-stone-500 mb-1">
            <div className="flex items-center text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold ml-0.5 text-stone-700">{p.rating || 4.8}</span>
            </div>
            {p.reviews && <span>({p.reviews})</span>}
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-burgundy">₹{p.price}</span>
            {p.mrp && p.mrp > p.price && (
              <>
                <span className="text-xs text-stone-400 line-through">₹{p.mrp}</span>
                <span className="text-[11px] font-semibold text-emerald-600">
                  {discountPercent}% off
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
