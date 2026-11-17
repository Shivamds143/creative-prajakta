"use client";

import React, { useState, useMemo, useEffect, useCallback, Suspense, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/ui/EmptyState";
import { products as fallbackProducts, Product } from "@/lib/data";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Search,
  Sparkles,
  ArrowUpDown,
} from "lucide-react";
import {
  FilterState,
  INITIAL_FILTERS,
  CATEGORY_OPTIONS,
  OCCASION_OPTIONS,
  RECIPIENT_OPTIONS,
  PRICE_PRESETS,
  RATING_OPTIONS,
  SORT_OPTIONS,
} from "@/components/shop/types";
import FilterSidebar, { FilterCounts } from "@/components/shop/FilterSidebar";
import MobileFilterDrawer from "@/components/shop/MobileFilterDrawer";
import ActiveFilterBadges from "@/components/shop/ActiveFilterBadges";

function normalizeString(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function parseUrlParams(searchParams: URLSearchParams): FilterState {
  const category = searchParams.get("category") || "all";
  const occasion = searchParams.get("occasion") || "all";
  const recipient = searchParams.get("recipient") || "all";
  const search = searchParams.get("search") || searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "featured";
  const personalizable = searchParams.get("personalizable") === "true";
  const inStock = searchParams.get("inStock") === "true";
  const bestsellers = searchParams.get("bestsellers") === "true" || searchParams.get("badge") === "bestseller";

  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const minPrice = minPriceParam !== null && minPriceParam !== "" ? Number(minPriceParam) : null;
  const maxPrice = maxPriceParam !== null && maxPriceParam !== "" ? Number(maxPriceParam) : null;

  // Detect preset from min/max or query param
  let pricePreset = searchParams.get("pricePreset") || "all";
  if (!searchParams.get("pricePreset")) {
    if (minPrice === null && maxPrice === null) {
      pricePreset = "all";
    } else if (minPrice === null && maxPrice === 500) {
      pricePreset = "under-500";
    } else if (minPrice === 500 && maxPrice === 1000) {
      pricePreset = "500-1000";
    } else if (minPrice === 1000 && maxPrice === 1500) {
      pricePreset = "1000-1500";
    } else if (minPrice === 1500 && maxPrice === null) {
      pricePreset = "1500-plus";
    } else {
      pricePreset = "custom";
    }
  }

  const ratingParam = searchParams.get("rating");
  const minRating = ratingParam !== null && ratingParam !== "" ? Number(ratingParam) : null;

  return {
    category,
    occasion,
    recipient,
    search,
    minPrice: isNaN(minPrice as number) ? null : minPrice,
    maxPrice: isNaN(maxPrice as number) ? null : maxPrice,
    pricePreset,
    minRating: isNaN(minRating as number) ? null : minRating,
    personalizableOnly: personalizable,
    inStockOnly: inStock,
    bestsellersOnly: bestsellers,
    sortBy: sort,
  };
}

function ShopContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Product catalog from DB or fallback
  const [productList, setProductList] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(false);

  // Active filters
  const [filters, setFilters] = useState<FilterState>(() => parseUrlParams(searchParams));
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Real-time search query buffer for smooth typing
  const [searchInput, setSearchInput] = useState(filters.search);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch verified products from API if available
  useEffect(() => {
    let isMounted = true;
    const fetchApiProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products?limit=100");
        if (res.ok) {
          const json = await res.json();
          const items: Product[] = json.data?.products || json.products || json.data || [];
          if (isMounted && items.length > 0) {
            setProductList(items);
          }
        }
      } catch (e) {
        // Fallback to static products
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchApiProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Synchronize state when URL searchParams change externally (e.g. Back/Forward or MegaMenu clicks)
  useEffect(() => {
    const fromUrl = parseUrlParams(searchParams);
    setFilters((prev) => {
      // Check if values actually differ to avoid state loops
      if (
        prev.category !== fromUrl.category ||
        prev.occasion !== fromUrl.occasion ||
        prev.recipient !== fromUrl.recipient ||
        prev.search !== fromUrl.search ||
        prev.minPrice !== fromUrl.minPrice ||
        prev.maxPrice !== fromUrl.maxPrice ||
        prev.pricePreset !== fromUrl.pricePreset ||
        prev.minRating !== fromUrl.minRating ||
        prev.personalizableOnly !== fromUrl.personalizableOnly ||
        prev.inStockOnly !== fromUrl.inStockOnly ||
        prev.bestsellersOnly !== fromUrl.bestsellersOnly ||
        prev.sortBy !== fromUrl.sortBy
      ) {
        setSearchInput(fromUrl.search);
        return fromUrl;
      }
      return prev;
    });
  }, [searchParams]);

  // Synchronize updated filters with URL query parameters
  const syncUrlWithFilters = useCallback(
    (newFilters: FilterState) => {
      const params = new URLSearchParams();

      if (newFilters.category !== "all") params.set("category", newFilters.category);
      if (newFilters.occasion !== "all") params.set("occasion", newFilters.occasion);
      if (newFilters.recipient !== "all") params.set("recipient", newFilters.recipient);
      if (newFilters.search.trim()) params.set("search", newFilters.search.trim());
      if (newFilters.pricePreset !== "all") params.set("pricePreset", newFilters.pricePreset);
      if (newFilters.minPrice !== null) params.set("minPrice", String(newFilters.minPrice));
      if (newFilters.maxPrice !== null) params.set("maxPrice", String(newFilters.maxPrice));
      if (newFilters.minRating !== null) params.set("rating", String(newFilters.minRating));
      if (newFilters.personalizableOnly) params.set("personalizable", "true");
      if (newFilters.inStockOnly) params.set("inStock", "true");
      if (newFilters.bestsellersOnly) params.set("bestsellers", "true");
      if (newFilters.sortBy !== "featured") params.set("sort", newFilters.sortBy);

      const qs = params.toString();
      const targetUrl = qs ? `${pathname}?${qs}` : pathname;
      router.replace(targetUrl, { scroll: false });
    },
    [pathname, router]
  );

  // Update filters handler
  const handleFilterChange = useCallback(
    (updates: Partial<FilterState>) => {
      setFilters((prev) => {
        const next = { ...prev, ...updates };
        syncUrlWithFilters(next);
        return next;
      });
    },
    [syncUrlWithFilters]
  );

  // Debounced search input handler
  const handleSearchInputChange = (val: string) => {
    setSearchInput(val);
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      handleFilterChange({ search: val });
    }, 350);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    handleFilterChange({ search: "" });
  };

  // Reset all filters
  const handleResetAll = useCallback(() => {
    setSearchInput("");
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    setFilters(INITIAL_FILTERS);
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.category !== "all" ||
      filters.occasion !== "all" ||
      filters.recipient !== "all" ||
      filters.search.trim().length > 0 ||
      filters.pricePreset !== "all" ||
      filters.minPrice !== null ||
      filters.maxPrice !== null ||
      filters.minRating !== null ||
      filters.personalizableOnly ||
      filters.inStockOnly ||
      filters.bestsellersOnly
    );
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== "all") count++;
    if (filters.occasion !== "all") count++;
    if (filters.recipient !== "all") count++;
    if (filters.search.trim().length > 0) count++;
    if (filters.pricePreset !== "all" || filters.minPrice !== null || filters.maxPrice !== null) count++;
    if (filters.minRating !== null) count++;
    if (filters.personalizableOnly) count++;
    if (filters.inStockOnly) count++;
    if (filters.bestsellersOnly) count++;
    return count;
  }, [filters]);

  // Compute option counts across the catalog
  const counts: FilterCounts = useMemo(() => {
    const catCounts: Record<string, number> = {};
    const occCounts: Record<string, number> = {};
    const recCounts: Record<string, number> = {};
    const priceCounts: Record<string, number> = {};
    const ratingCounts: Record<string, number> = {};
    let personalizableCount = 0;
    let inStockCount = 0;
    let bestsellersCount = 0;

    CATEGORY_OPTIONS.forEach((c) => {
      if (c.value !== "all") catCounts[c.value] = 0;
    });
    OCCASION_OPTIONS.forEach((o) => {
      occCounts[o] = 0;
    });
    RECIPIENT_OPTIONS.forEach((r) => {
      recCounts[r] = 0;
    });
    PRICE_PRESETS.forEach((p) => {
      if (p.id !== "all") priceCounts[p.id] = 0;
    });
    RATING_OPTIONS.forEach((r) => {
      if (r.value !== null) ratingCounts[String(r.value)] = 0;
    });

    productList.forEach((p) => {
      if (p.categorySlug && catCounts[p.categorySlug] !== undefined) {
        catCounts[p.categorySlug]++;
      }

      if (p.occasion && Array.isArray(p.occasion)) {
        OCCASION_OPTIONS.forEach((occ) => {
          if (p.occasion.some((o) => normalizeString(o) === normalizeString(occ))) {
            occCounts[occ] = (occCounts[occ] || 0) + 1;
          }
        });
      }

      if (p.recipient && Array.isArray(p.recipient)) {
        RECIPIENT_OPTIONS.forEach((rec) => {
          if (p.recipient.some((r) => normalizeString(r) === normalizeString(rec))) {
            recCounts[rec] = (recCounts[rec] || 0) + 1;
          }
        });
      }

      PRICE_PRESETS.forEach((preset) => {
        if (preset.id === "all") return;
        const minOk = preset.min === null || p.price >= preset.min;
        const maxOk = preset.max === null || p.price <= preset.max;
        if (minOk && maxOk) {
          priceCounts[preset.id] = (priceCounts[preset.id] || 0) + 1;
        }
      });

      RATING_OPTIONS.forEach((r) => {
        if (r.value !== null && (p.rating || 0) >= r.value) {
          ratingCounts[String(r.value)] = (ratingCounts[String(r.value)] || 0) + 1;
        }
      });

      if (p.personalizable) personalizableCount++;
      if (p.stock === undefined || p.stock > 0) inStockCount++;
      if (p.badge?.toLowerCase() === "bestseller") bestsellersCount++;
    });

    return {
      total: productList.length,
      categories: catCounts,
      occasions: occCounts,
      recipients: recCounts,
      pricePresets: priceCounts,
      ratings: ratingCounts,
      personalizable: personalizableCount,
      inStock: inStockCount,
      bestsellers: bestsellersCount,
    };
  }, [productList]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...productList];

    // Search query
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      const words = q.split(/\s+/).filter(Boolean);
      result = result.filter((p) => {
        const textTarget = [
          p.name,
          p.description || "",
          p.category || "",
          ...(p.occasion || []),
          ...(p.recipient || []),
          p.badge || "",
        ]
          .join(" ")
          .toLowerCase();

        return words.every((w) => textTarget.includes(w));
      });
    }

    // Category
    if (filters.category !== "all") {
      result = result.filter(
        (p) =>
          p.categorySlug === filters.category ||
          p.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    // Occasion
    if (filters.occasion !== "all") {
      const targetOcc = normalizeString(filters.occasion);
      result = result.filter((p) =>
        p.occasion?.some((o) => normalizeString(o) === targetOcc)
      );
    }

    // Recipient
    if (filters.recipient !== "all") {
      const targetRec = normalizeString(filters.recipient);
      result = result.filter((p) =>
        p.recipient?.some((r) => normalizeString(r) === targetRec)
      );
    }

    // Price
    if (filters.minPrice !== null) {
      result = result.filter((p) => p.price >= (filters.minPrice as number));
    }
    if (filters.maxPrice !== null) {
      result = result.filter((p) => p.price <= (filters.maxPrice as number));
    }

    // Rating
    if (filters.minRating !== null) {
      result = result.filter((p) => (p.rating || 0) >= (filters.minRating as number));
    }

    // Personalizable
    if (filters.personalizableOnly) {
      result = result.filter((p) => p.personalizable);
    }

    // In Stock
    if (filters.inStockOnly) {
      result = result.filter((p) => p.stock === undefined || p.stock > 0);
    }

    // Bestsellers
    if (filters.bestsellersOnly) {
      result = result.filter((p) => p.badge?.toLowerCase() === "bestseller");
    }

    // Sort
    if (filters.sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (filters.sortBy === "reviews") {
      result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    } else if (filters.sortBy === "discount") {
      result.sort((a, b) => {
        const discA = a.mrp > a.price ? (a.mrp - a.price) / a.mrp : 0;
        const discB = b.mrp > b.price ? (b.mrp - b.price) / b.mrp : 0;
        return discB - discA;
      });
    }

    return result;
  }, [productList, filters]);

  return (
    <div className="bg-ivory/50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Title */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-gold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Handcrafted with Love
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-burgundy tracking-tight">
            Discover Unforgettable Gifts
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm max-w-lg mx-auto">
            Curated premium gifts and customizable keepsakes, lovingly packaged and delivered across India.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl shadow-soft border border-rose-100/70 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 flex-1">
            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-burgundy text-white font-semibold text-xs shadow-sm hover:bg-wine transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-burgundy text-[10px] font-bold flex items-center justify-center ml-0.5">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* In-catalog Search Bar */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search gifts in catalog..."
                value={searchInput}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-burgundy focus:ring-1 focus:ring-burgundy/20 text-ink placeholder:text-stone-400 transition-all"
              />
              {searchInput && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ink p-0.5"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Count indicator */}
            <p className="text-xs text-stone-500 font-medium hidden sm:inline whitespace-nowrap">
              Showing <span className="text-burgundy font-bold">{filteredProducts.length}</span> of{" "}
              <span className="text-stone-700">{productList.length}</span> gifts
            </p>
          </div>

          {/* Right: Sort Dropdown & Quick Count */}
          <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
            <p className="text-xs text-stone-500 font-medium sm:hidden">
              <span className="text-burgundy font-bold">{filteredProducts.length}</span> gifts found
            </p>

            <div className="flex items-center gap-2 ml-auto">
              <label className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3 text-stone-400" />
                <span className="hidden sm:inline">Sort:</span>
              </label>
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                  className="appearance-none bg-stone-50/80 border border-stone-200 text-xs font-semibold text-ink pl-3 pr-8 py-2 rounded-xl focus:outline-none focus:border-burgundy focus:bg-white transition-all cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        <ActiveFilterBadges
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetAll}
        />

        {/* Catalog Grid with Desktop Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-soft border border-rose-100/60 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <FilterSidebar
                filters={filters}
                counts={counts}
                onFilterChange={handleFilterChange}
                onReset={handleResetAll}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <EmptyState
                title="No matching gifts found"
                description={
                  hasActiveFilters
                    ? "We couldn't find any gifts matching your selected filters. Try broadening your criteria or reset filters to browse our full collection."
                    : "No products are currently available in this section. Please check back soon!"
                }
                action={
                  hasActiveFilters
                    ? {
                        label: "Reset All Filters",
                        onClick: handleResetAll,
                      }
                    : undefined
                }
                className="bg-white rounded-3xl p-12 shadow-soft border border-rose-100/50"
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.slug} p={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        filters={filters}
        counts={counts}
        totalFiltered={filteredProducts.length}
        onFilterChange={handleFilterChange}
        onReset={handleResetAll}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-ivory/50 min-h-screen py-16 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-3 border-burgundy border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="animate-pulse text-burgundy font-serif font-bold text-base">
              Loading curated collection...
            </p>
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
