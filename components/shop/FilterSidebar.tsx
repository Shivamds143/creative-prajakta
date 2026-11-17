"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  RotateCcw,
  Star,
  CheckCircle2,
  Flame,
  ChevronDown,
  ChevronUp,
  Tag,
  IndianRupee,
  Layers,
  Heart,
  Gift,
} from "lucide-react";
import {
  FilterState,
  CATEGORY_OPTIONS,
  OCCASION_OPTIONS,
  RECIPIENT_OPTIONS,
  PRICE_PRESETS,
  RATING_OPTIONS,
} from "./types";

export interface FilterCounts {
  total: number;
  categories: Record<string, number>;
  occasions: Record<string, number>;
  recipients: Record<string, number>;
  pricePresets: Record<string, number>;
  ratings: Record<string, number>;
  personalizable: number;
  inStock: number;
  bestsellers: number;
}

interface FilterSidebarProps {
  filters: FilterState;
  counts: FilterCounts;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  className?: string;
  isMobileDrawer?: boolean;
}

export default function FilterSidebar({
  filters,
  counts,
  onFilterChange,
  onReset,
  hasActiveFilters,
  className = "",
  isMobileDrawer = false,
}: FilterSidebarProps) {
  // Custom price input local state
  const [customMin, setCustomMin] = useState<string>(
    filters.minPrice !== null && filters.pricePreset === "custom"
      ? String(filters.minPrice)
      : ""
  );
  const [customMax, setCustomMax] = useState<string>(
    filters.maxPrice !== null && filters.pricePreset === "custom"
      ? String(filters.maxPrice)
      : ""
  );

  // Sync inputs if filters change from outside
  useEffect(() => {
    if (filters.pricePreset === "custom") {
      setCustomMin(filters.minPrice !== null ? String(filters.minPrice) : "");
      setCustomMax(filters.maxPrice !== null ? String(filters.maxPrice) : "");
    } else if (filters.pricePreset === "all") {
      setCustomMin("");
      setCustomMax("");
    }
  }, [filters.pricePreset, filters.minPrice, filters.maxPrice]);

  const handleApplyCustomPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const minVal = customMin ? Math.max(0, parseInt(customMin, 10)) : null;
    const maxVal = customMax ? Math.max(0, parseInt(customMax, 10)) : null;

    if (minVal !== null && maxVal !== null && minVal > maxVal) {
      // Swap if min > max
      onFilterChange({
        pricePreset: "custom",
        minPrice: maxVal,
        maxPrice: minVal,
      });
      setCustomMin(String(maxVal));
      setCustomMax(String(minVal));
      return;
    }

    onFilterChange({
      pricePreset: "custom",
      minPrice: isNaN(minVal as number) ? null : minVal,
      maxPrice: isNaN(maxVal as number) ? null : maxVal,
    });
  };

  const handlePricePresetSelect = (presetId: string) => {
    const preset = PRICE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    onFilterChange({
      pricePreset: preset.id,
      minPrice: preset.min,
      maxPrice: preset.max,
    });
    if (preset.id !== "custom") {
      setCustomMin("");
      setCustomMax("");
    }
  };

  // Section collapse states for compact view if needed
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    occasions: true,
    recipients: true,
    rating: true,
    toggles: true,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header (desktop only, drawer has own header) */}
      {!isMobileDrawer && (
        <div className="flex items-center justify-between pb-3.5 border-b border-rose-100">
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-bold text-burgundy text-lg">Filter Catalog</h3>
            {hasActiveFilters && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-burgundy/10 text-burgundy">
                Active
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="text-xs text-rose-600 hover:text-burgundy flex items-center gap-1 font-semibold transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset all
            </button>
          )}
        </div>
      )}

      {/* Feature Toggles Card */}
      <div className="space-y-2 bg-gradient-to-br from-blush/30 via-white to-ivory p-3.5 rounded-2xl border border-rose-100/70 shadow-sm">
        {/* Customizable Only */}
        <label className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-white/80 transition-colors cursor-pointer select-none">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-gold/15 flex items-center justify-center text-gold">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-burgundy">Customizable Only</span>
              <span className="text-[10px] text-stone-400">Add custom photo & text</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={filters.personalizableOnly}
            onChange={(e) => onFilterChange({ personalizableOnly: e.target.checked })}
            className="w-4 h-4 rounded text-burgundy focus:ring-burgundy border-rose-300 accent-burgundy"
          />
        </label>

        {/* In Stock Only */}
        <label className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-white/80 transition-colors cursor-pointer select-none">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-stone-800">In Stock Ready</span>
              <span className="text-[10px] text-stone-400">Fast dispatch available</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
            className="w-4 h-4 rounded text-burgundy focus:ring-burgundy border-rose-300 accent-burgundy"
          />
        </label>

        {/* Bestsellers Only */}
        <label className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-white/80 transition-colors cursor-pointer select-none">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Flame className="w-3.5 h-3.5" />
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-stone-800">Bestsellers</span>
              <span className="text-[10px] text-stone-400">Customer favorites</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={filters.bestsellersOnly}
            onChange={(e) => onFilterChange({ bestsellersOnly: e.target.checked })}
            className="w-4 h-4 rounded text-burgundy focus:ring-burgundy border-rose-300 accent-burgundy"
          />
        </label>
      </div>

      {/* 1. Collections / Categories */}
      <div className="space-y-2.5">
        <button
          onClick={() => toggleSection("categories")}
          className="w-full flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-stone-400 group-hover:text-burgundy transition-colors" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 group-hover:text-burgundy transition-colors">
              Collections
            </h4>
          </div>
          {openSections.categories ? (
            <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
          )}
        </button>

        {openSections.categories && (
          <div className="space-y-1 pt-1">
            {CATEGORY_OPTIONS.map((cat) => {
              const isSelected = filters.category === cat.value;
              const count =
                cat.value === "all"
                  ? counts.total
                  : counts.categories[cat.value] || 0;

              return (
                <button
                  key={cat.value}
                  onClick={() => onFilterChange({ category: cat.value })}
                  className={`w-full flex items-center justify-between text-left text-xs px-3 py-2 rounded-xl font-medium transition-all ${
                    isSelected
                      ? "bg-burgundy text-white font-semibold shadow-sm"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <span>{cat.emoji}</span>
                    <span className="truncate">{cat.label}</span>
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Price Filter */}
      <div className="space-y-2.5 pt-3 border-t border-stone-100">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-2">
            <IndianRupee className="w-3.5 h-3.5 text-stone-400 group-hover:text-burgundy transition-colors" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 group-hover:text-burgundy transition-colors">
              Price Range
            </h4>
          </div>
          {openSections.price ? (
            <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
          )}
        </button>

        {openSections.price && (
          <div className="space-y-3 pt-1">
            {/* Preset Tiers */}
            <div className="grid grid-cols-1 gap-1.5">
              {PRICE_PRESETS.map((preset) => {
                const isSelected = filters.pricePreset === preset.id;
                const count = counts.pricePresets[preset.id] || 0;

                return (
                  <button
                    key={preset.id}
                    onClick={() => handlePricePresetSelect(preset.id)}
                    className={`w-full flex items-center justify-between text-left text-xs px-3 py-1.5 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-burgundy text-white border-burgundy font-semibold"
                        : "border-stone-200 text-stone-700 hover:border-burgundy/40 hover:bg-blush/20"
                    }`}
                  >
                    <span>{preset.label}</span>
                    {preset.id !== "all" && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-stone-100 text-stone-500"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Range Inputs */}
            <form onSubmit={handleApplyCustomPrice} className="space-y-2 pt-2 border-t border-dashed border-stone-200">
              <span className="text-[11px] font-semibold text-stone-500 block">Custom Range (₹)</span>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs">₹</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={customMin}
                    onChange={(e) => setCustomMin(e.target.value)}
                    className="w-full pl-6 pr-2 py-1.5 text-xs rounded-lg border border-stone-200 focus:outline-none focus:border-burgundy text-ink bg-stone-50/50"
                  />
                </div>
                <span className="text-stone-400 text-xs">–</span>
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs">₹</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={customMax}
                    onChange={(e) => setCustomMax(e.target.value)}
                    className="w-full pl-6 pr-2 py-1.5 text-xs rounded-lg border border-stone-200 focus:outline-none focus:border-burgundy text-ink bg-stone-50/50"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-burgundy text-white text-xs font-semibold hover:bg-wine transition-colors shrink-0"
                >
                  Go
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* 3. Occasions */}
      <div className="space-y-2.5 pt-3 border-t border-stone-100">
        <button
          onClick={() => toggleSection("occasions")}
          className="w-full flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-2">
            <Gift className="w-3.5 h-3.5 text-stone-400 group-hover:text-burgundy transition-colors" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 group-hover:text-burgundy transition-colors">
              Occasions
            </h4>
          </div>
          {openSections.occasions ? (
            <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
          )}
        </button>

        {openSections.occasions && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              onClick={() => onFilterChange({ occasion: "all" })}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                filters.occasion === "all"
                  ? "bg-burgundy text-white border-burgundy font-semibold shadow-sm"
                  : "border-stone-200 text-stone-600 hover:border-burgundy/40 hover:bg-blush/20"
              }`}
            >
              All Occasions
            </button>
            {OCCASION_OPTIONS.map((occ) => {
              const isSelected =
                filters.occasion.toLowerCase() === occ.toLowerCase() ||
                (occ === "Valentine's Day" && filters.occasion.toLowerCase().includes("valentin"));
              const count = counts.occasions[occ] || 0;

              return (
                <button
                  key={occ}
                  onClick={() =>
                    onFilterChange({
                      occasion: isSelected ? "all" : occ,
                    })
                  }
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all inline-flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-burgundy text-white border-burgundy font-semibold shadow-sm"
                      : "border-stone-200 text-stone-600 hover:border-burgundy/40 hover:bg-blush/20"
                  }`}
                >
                  <span>{occ}</span>
                  <span
                    className={`text-[9px] px-1 rounded-full ${
                      isSelected ? "bg-white/20 text-white" : "bg-stone-100 text-stone-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Recipients */}
      <div className="space-y-2.5 pt-3 border-t border-stone-100">
        <button
          onClick={() => toggleSection("recipients")}
          className="w-full flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-stone-400 group-hover:text-burgundy transition-colors" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 group-hover:text-burgundy transition-colors">
              Recipient
            </h4>
          </div>
          {openSections.recipients ? (
            <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
          )}
        </button>

        {openSections.recipients && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              onClick={() => onFilterChange({ recipient: "all" })}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                filters.recipient === "all"
                  ? "bg-burgundy text-white border-burgundy font-semibold shadow-sm"
                  : "border-stone-200 text-stone-600 hover:border-burgundy/40 hover:bg-blush/20"
              }`}
            >
              All Recipients
            </button>
            {RECIPIENT_OPTIONS.map((rec) => {
              const isSelected = filters.recipient.toLowerCase() === rec.toLowerCase();
              const count = counts.recipients[rec] || 0;

              return (
                <button
                  key={rec}
                  onClick={() =>
                    onFilterChange({
                      recipient: isSelected ? "all" : rec,
                    })
                  }
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all inline-flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-burgundy text-white border-burgundy font-semibold shadow-sm"
                      : "border-stone-200 text-stone-600 hover:border-burgundy/40 hover:bg-blush/20"
                  }`}
                >
                  <span>{rec}</span>
                  <span
                    className={`text-[9px] px-1 rounded-full ${
                      isSelected ? "bg-white/20 text-white" : "bg-stone-100 text-stone-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Rating Filter */}
      <div className="space-y-2.5 pt-3 border-t border-stone-100">
        <button
          onClick={() => toggleSection("rating")}
          className="w-full flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-2">
            <Star className="w-3.5 h-3.5 text-stone-400 group-hover:text-burgundy transition-colors" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 group-hover:text-burgundy transition-colors">
              Customer Rating
            </h4>
          </div>
          {openSections.rating ? (
            <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
          )}
        </button>

        {openSections.rating && (
          <div className="space-y-1.5 pt-1">
            {RATING_OPTIONS.map((rate) => {
              const isSelected =
                (rate.value === null && filters.minRating === null) ||
                filters.minRating === rate.value;
              const countKey = rate.value !== null ? String(rate.value) : "all";
              const count = counts.ratings[countKey] || 0;

              return (
                <button
                  key={countKey}
                  onClick={() => onFilterChange({ minRating: rate.value })}
                  className={`w-full flex items-center justify-between text-left text-xs px-3 py-1.5 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-burgundy text-white border-burgundy font-semibold"
                      : "border-stone-200 text-stone-700 hover:border-burgundy/40 hover:bg-blush/20"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {rate.value !== null && <Star className="w-3.5 h-3.5 fill-gold text-gold" />}
                    <span>{rate.label}</span>
                  </span>
                  {rate.value !== null && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                        isSelected ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
