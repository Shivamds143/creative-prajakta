"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SearchResult {
  _id: string;
  name: string;
  slug: string;
  price: number;
  mrp?: number;
  images: string[];
  emoji?: string;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  "Birthday Gifts",
  "Anniversary Hampers",
  "Personalized Mugs",
  "Diwali Gifts",
];

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  // Auto-focus on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // ESC key handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Search fetch
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/products?search=${encodeURIComponent(debouncedQuery)}&limit=5`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        setResults(data?.products ?? data?.data ?? []);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setLoading(false);
      });
    return () => controller.abort();
  }, [debouncedQuery]);

  const handlePopular = useCallback((term: string) => {
    setQuery(term);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex flex-col items-center pt-24 px-4"
          style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="relative flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden">
              <Search size={20} className="absolute left-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search gifts, occasions, recipients..."
                className="w-full py-5 pl-14 pr-14 text-lg text-gray-800 outline-none font-medium placeholder-gray-400"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-5 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Content panel */}
            <div className="mt-3 bg-white rounded-2xl shadow-2xl overflow-hidden">
              {!query.trim() ? (
                /* Popular searches */
                <div className="p-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                    Popular Searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((term) => (
                      <button
                        key={term}
                        onClick={() => handlePopular(term)}
                        className="px-4 py-2 rounded-full text-sm font-medium border border-gray-200 text-gray-700 hover:border-[#781D35] hover:text-[#781D35] hover:bg-rose-50 transition-all"
                      >
                        🔍 {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : loading ? (
                /* Loading state */
                <div className="p-5 space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-100 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : results.length > 0 ? (
                /* Results */
                <div className="divide-y divide-gray-50">
                  {results.map((product) => (
                    <Link
                      key={product._id}
                      href={`/products/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 p-4 hover:bg-rose-50 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-2xl">{product.emoji ?? "🎁"}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate group-hover:text-[#781D35] transition-colors">
                          {product.name}
                        </p>
                        <p className="text-sm text-[#781D35] font-bold mt-0.5">
                          ₹{product.price.toLocaleString("en-IN")}
                          {product.mrp && product.mrp > product.price && (
                            <span className="text-xs text-gray-400 line-through ml-2 font-normal">
                              ₹{product.mrp.toLocaleString("en-IN")}
                            </span>
                          )}
                        </p>
                      </div>
                      <span className="text-gray-300 group-hover:text-[#781D35] transition-colors text-xs">→</span>
                    </Link>
                  ))}
                  <div className="p-3 text-center">
                    <Link
                      href={`/shop?search=${encodeURIComponent(query)}`}
                      onClick={onClose}
                      className="text-sm font-semibold text-[#781D35] hover:underline"
                    >
                      View all results for "{query}" →
                    </Link>
                  </div>
                </div>
              ) : (
                /* No results */
                <div className="p-8 text-center">
                  <span className="text-4xl">🔍</span>
                  <p className="text-gray-500 mt-2 font-medium">No gifts found for "{query}"</p>
                  <p className="text-gray-400 text-sm mt-1">Try searching "birthday", "personalized", or "hampers"</p>
                </div>
              )}
            </div>

            {/* Close hint */}
            <p className="text-center text-white/50 text-xs mt-3">
              Press <kbd className="bg-white/20 text-white px-1.5 py-0.5 rounded text-xs font-mono">ESC</kbd> to close
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
