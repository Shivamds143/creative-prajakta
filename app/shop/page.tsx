"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data";
import { SlidersHorizontal, Sparkles, X, ChevronDown } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get("category") || "all";
  const initialOccasion = searchParams.get("occasion") || "all";
  const initialRecipient = searchParams.get("recipient") || "all";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedOccasion, setSelectedOccasion] = useState(initialOccasion);
  const [selectedRecipient, setSelectedRecipient] = useState(initialRecipient);
  const [personalizableOnly, setPersonalizableOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = [
    { label: "All Collections", value: "all" },
    { label: "Personalized Gifts", value: "personalized" },
    { label: "Gift Hampers", value: "hampers" },
    { label: "Ready-made Gifts", value: "ready-made" },
    { label: "Corporate Gifting", value: "corporate" },
  ];

  const occasions = [
    "Birthday",
    "Anniversary",
    "Diwali",
    "Valentine's Day",
    "Rakhi",
    "Christmas",
    "Baby Shower",
    "Graduation",
  ];

  const recipients = [
    "For Her",
    "For Him",
    "For Couples",
    "For Parents",
    "For Friends",
    "For Kids",
  ];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.categorySlug === selectedCategory);
    }

    if (selectedOccasion !== "all") {
      result = result.filter((p) =>
        p.occasion?.some((o) => o.toLowerCase() === selectedOccasion.toLowerCase())
      );
    }

    if (selectedRecipient !== "all") {
      result = result.filter((p) =>
        p.recipient?.some((r) => r.toLowerCase() === selectedRecipient.toLowerCase())
      );
    }

    if (personalizableOnly) {
      result = result.filter((p) => p.personalizable);
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedCategory, selectedOccasion, selectedRecipient, personalizableOnly, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedOccasion("all");
    setSelectedRecipient("all");
    setPersonalizableOnly(false);
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedOccasion !== "all" ||
    selectedRecipient !== "all" ||
    personalizableOnly;

  return (
    <div className="bg-ivory/50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-gold">
            Handcrafted with Love
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy">
            Discover Unforgettable Gifts
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm">
            Curated premium gifts and customizable keepsakes, delivered directly across India.
          </p>
        </div>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-soft border border-rose-100/50 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-blush/40 text-burgundy font-semibold text-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            </button>
            <p className="text-xs text-stone-500 font-medium">
              Showing <span className="text-burgundy font-bold">{filteredProducts.length}</span> gifts
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-semibold ml-2"
              >
                <X className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <label className="text-xs font-medium text-stone-500 hidden sm:inline">Sort by:</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-stone-50 border border-stone-200 text-xs font-semibold text-ink px-4 py-2 pr-8 rounded-xl focus:outline-none focus:border-burgundy"
              >
                <option value="featured">Featured Picks</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Catalog Grid with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-6 bg-white p-6 rounded-2xl shadow-soft border border-rose-100/50 h-fit">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-burgundy text-base">Filter Catalog</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-rose-600 hover:underline">
                  Clear
                </button>
              )}
            </div>

            {/* Customization Toggle */}
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-blush/30 border border-rose-200/50 cursor-pointer">
              <input
                type="checkbox"
                checked={personalizableOnly}
                onChange={(e) => setPersonalizableOnly(e.target.checked)}
                className="rounded border-rose-300 text-burgundy focus:ring-burgundy w-4 h-4"
              />
              <span className="text-xs font-semibold text-burgundy flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-gold" /> Customizable Gifts Only
              </span>
            </label>

            {/* Categories */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Collections
              </h4>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`w-full text-left text-xs px-3 py-2 rounded-xl font-medium transition-colors ${
                      selectedCategory === cat.value
                        ? "bg-burgundy text-white font-semibold"
                        : "text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasions */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Occasions
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedOccasion("all")}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    selectedOccasion === "all"
                      ? "bg-burgundy text-white border-burgundy"
                      : "border-stone-200 text-stone-600 hover:border-stone-400"
                  }`}
                >
                  All
                </button>
                {occasions.map((occ) => (
                  <button
                    key={occ}
                    onClick={() => setSelectedOccasion(occ)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                      selectedOccasion === occ
                        ? "bg-burgundy text-white border-burgundy"
                        : "border-stone-200 text-stone-600 hover:border-stone-400"
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipients */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Recipient
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedRecipient("all")}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    selectedRecipient === "all"
                      ? "bg-burgundy text-white border-burgundy"
                      : "border-stone-200 text-stone-600 hover:border-stone-400"
                  }`}
                >
                  All
                </button>
                {recipients.map((rec) => (
                  <button
                    key={rec}
                    onClick={() => setSelectedRecipient(rec)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                      selectedRecipient === rec
                        ? "bg-burgundy text-white border-burgundy"
                        : "border-stone-200 text-stone-600 hover:border-stone-400"
                    }`}
                  >
                    {rec}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center shadow-soft border border-rose-100/50 space-y-4">
                <div className="w-16 h-16 bg-blush/60 rounded-full flex items-center justify-center mx-auto text-3xl">
                  🎁
                </div>
                <h3 className="font-serif text-xl font-bold text-burgundy">
                  No matching gifts found
                </h3>
                <p className="text-stone-500 text-xs max-w-sm mx-auto">
                  Try adjusting your filter combinations or browse all collections.
                </p>
                <button onClick={clearFilters} className="btn text-xs py-2 px-5">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.slug} p={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-ivory/50 min-h-screen py-10 flex items-center justify-center">
          <div className="animate-pulse text-burgundy font-serif font-bold text-base">
            Loading collection...
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
