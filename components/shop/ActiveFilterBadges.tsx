"use client";

import React from "react";
import { X, Sparkles, RotateCcw } from "lucide-react";
import { FilterState, CATEGORY_OPTIONS, PRICE_PRESETS } from "./types";

interface ActiveFilterBadgesProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onReset: () => void;
}

export default function ActiveFilterBadges({
  filters,
  onFilterChange,
  onReset,
}: ActiveFilterBadgesProps) {
  const chips: { label: string; onRemove: () => void; icon?: React.ReactNode }[] = [];

  // Search
  if (filters.search.trim()) {
    chips.push({
      label: `"${filters.search.trim()}"`,
      onRemove: () => onFilterChange({ search: "" }),
    });
  }

  // Category
  if (filters.category !== "all") {
    const cat = CATEGORY_OPTIONS.find((c) => c.value === filters.category);
    chips.push({
      label: cat ? cat.label : filters.category,
      onRemove: () => onFilterChange({ category: "all" }),
    });
  }

  // Occasion
  if (filters.occasion !== "all") {
    chips.push({
      label: `Occasion: ${filters.occasion}`,
      onRemove: () => onFilterChange({ occasion: "all" }),
    });
  }

  // Recipient
  if (filters.recipient !== "all") {
    chips.push({
      label: `For: ${filters.recipient}`,
      onRemove: () => onFilterChange({ recipient: "all" }),
    });
  }

  // Price Preset or Custom
  if (filters.pricePreset !== "all") {
    if (filters.pricePreset === "custom") {
      let priceLabel = "Custom Price";
      if (filters.minPrice !== null && filters.maxPrice !== null) {
        priceLabel = `₹${filters.minPrice} – ₹${filters.maxPrice}`;
      } else if (filters.minPrice !== null) {
        priceLabel = `₹${filters.minPrice}+`;
      } else if (filters.maxPrice !== null) {
        priceLabel = `Up to ₹${filters.maxPrice}`;
      }
      chips.push({
        label: priceLabel,
        onRemove: () =>
          onFilterChange({
            pricePreset: "all",
            minPrice: null,
            maxPrice: null,
          }),
      });
    } else {
      const preset = PRICE_PRESETS.find((p) => p.id === filters.pricePreset);
      if (preset) {
        chips.push({
          label: preset.label,
          onRemove: () =>
            onFilterChange({
              pricePreset: "all",
              minPrice: null,
              maxPrice: null,
            }),
        });
      }
    }
  }

  // Rating
  if (filters.minRating !== null) {
    chips.push({
      label: `${filters.minRating}★ & above`,
      onRemove: () => onFilterChange({ minRating: null }),
    });
  }

  // Customizable Only
  if (filters.personalizableOnly) {
    chips.push({
      label: "Customizable",
      icon: <Sparkles className="w-3 h-3 text-gold" />,
      onRemove: () => onFilterChange({ personalizableOnly: false }),
    });
  }

  // In Stock
  if (filters.inStockOnly) {
    chips.push({
      label: "In Stock Only",
      onRemove: () => onFilterChange({ inStockOnly: false }),
    });
  }

  // Bestsellers
  if (filters.bestsellersOnly) {
    chips.push({
      label: "Bestsellers Only",
      onRemove: () => onFilterChange({ bestsellersOnly: false }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 pt-1">
      <span className="text-xs font-semibold text-stone-400 mr-1">Active Filters:</span>
      {chips.map((chip, idx) => (
        <span
          key={idx}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white text-burgundy border border-rose-200/80 shadow-xs hover:border-burgundy/40 transition-colors"
        >
          {chip.icon}
          <span>{chip.label}</span>
          <button
            onClick={chip.onRemove}
            className="w-4 h-4 rounded-full hover:bg-rose-100 flex items-center justify-center text-stone-400 hover:text-burgundy transition-colors ml-0.5"
            aria-label={`Remove filter ${chip.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <button
        onClick={onReset}
        className="text-xs text-rose-600 hover:text-burgundy font-semibold hover:underline inline-flex items-center gap-1 ml-2 transition-colors"
      >
        <RotateCcw className="w-3 h-3" /> Clear all
      </button>
    </div>
  );
}
