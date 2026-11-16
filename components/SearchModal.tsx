"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import Image from "next/image";

interface SearchResult {
  _id: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  images: string[];
  emoji: string;
  category: string;
}

export default function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=6`);
        const json = await res.json();
        if (json.success && json.data) {
          setResults(json.data.products || json.data || []);
        }
      } catch (err) {
        console.error("Search fetch error", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const popularSearches = [
    "Personalized Photo Frame",
    "Birthday Hamper",
    "Anniversary Gift Box",
    "Custom Mug",
    "Diwali Sweets",
    "Luxury Candle",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-ink/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-card overflow-hidden border border-rose-100/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-5 py-4 border-b border-stone-100 gap-3">
          <Search className="w-5 h-5 text-burgundy shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search gifts, hampers, personalized items..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-ink placeholder:text-stone-400 focus:outline-none text-base md:text-lg"
          />
          {loading && <Loader2 className="w-5 h-5 text-burgundy animate-spin shrink-0" />}
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-ink rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-5">
          {!query.trim() && (
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-stone-400 mb-3">
                Trending Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((item) => (
                  <button
                    key={item}
                    onClick={() => setQuery(item)}
                    className="text-xs md:text-sm px-3 py-1.5 rounded-full bg-blush/60 text-burgundy hover:bg-burgundy hover:text-white transition-all duration-200"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.trim() && !loading && results.length === 0 && (
            <div className="text-center py-10">
              <p className="text-stone-500 text-sm">No gifts found for &quot;{query}&quot;</p>
              <Link
                href="/shop"
                onClick={onClose}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-burgundy underline"
              >
                Browse All Collections <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wider font-semibold text-stone-400 mb-2">
                Products ({results.length})
              </p>
              {results.map((product) => {
                const img = product.images?.[0];
                return (
                  <Link
                    key={product._id || product.slug}
                    href={`/shop/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-blush/30 transition-colors group"
                  >
                    <div className="w-14 h-14 rounded-lg bg-stone-100 overflow-hidden relative shrink-0 flex items-center justify-center border border-stone-200/50">
                      {img ? (
                        <Image
                          src={img}
                          alt={product.name}
                          fill
                          sizes="60px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <span className="text-2xl">{product.emoji || "🎁"}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-ink truncate group-hover:text-burgundy transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-xs text-stone-400">{product.category}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-burgundy">₹{product.price}</p>
                      {product.mrp && product.mrp > product.price && (
                        <p className="text-xs text-stone-400 line-through">₹{product.mrp}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

