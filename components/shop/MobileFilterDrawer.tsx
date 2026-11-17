"use client";

import React, { useEffect } from "react";
import { X, SlidersHorizontal, RotateCcw } from "lucide-react";
import FilterSidebar, { FilterCounts } from "./FilterSidebar";
import { FilterState } from "./types";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  counts: FilterCounts;
  totalFiltered: number;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export default function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  counts,
  totalFiltered,
  onFilterChange,
  onReset,
  hasActiveFilters,
}: MobileFilterDrawerProps) {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/60 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 right-0 max-w-full w-full sm:w-[420px] bg-white shadow-2xl flex flex-col z-50 animate-slideLeft">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-rose-100 bg-white">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-burgundy" />
            <h3 className="font-serif font-bold text-burgundy text-lg">Filters</h3>
            {hasActiveFilters && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-burgundy/10 text-burgundy">
                Active
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={onReset}
                className="text-xs text-rose-600 hover:text-burgundy flex items-center gap-1 font-semibold px-2 py-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-ink rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Filter List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <FilterSidebar
            filters={filters}
            counts={counts}
            onFilterChange={onFilterChange}
            onReset={onReset}
            hasActiveFilters={hasActiveFilters}
            isMobileDrawer={true}
          />
        </div>

        {/* Sticky Footer CTA */}
        <div className="p-4 border-t border-rose-100 bg-white shadow-card flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="px-4 py-3 rounded-xl border border-stone-200 text-stone-700 font-semibold text-xs hover:bg-stone-50 transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-3 px-5 rounded-xl bg-burgundy hover:bg-wine text-white text-xs sm:text-sm font-semibold shadow-soft hover:shadow-card transition-all flex items-center justify-center gap-2"
          >
            <span>Show {totalFiltered} {totalFiltered === 1 ? "Gift" : "Gifts"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
