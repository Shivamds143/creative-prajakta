export interface FilterState {
  category: string;
  occasion: string;
  recipient: string;
  search: string;
  minPrice: number | null;
  maxPrice: number | null;
  pricePreset: string;
  minRating: number | null;
  personalizableOnly: boolean;
  inStockOnly: boolean;
  bestsellersOnly: boolean;
  sortBy: string;
}

export const INITIAL_FILTERS: FilterState = {
  category: "all",
  occasion: "all",
  recipient: "all",
  search: "",
  minPrice: null,
  maxPrice: null,
  pricePreset: "all",
  minRating: null,
  personalizableOnly: false,
  inStockOnly: false,
  bestsellersOnly: false,
  sortBy: "featured",
};

export interface CategoryOption {
  label: string;
  value: string;
  emoji?: string;
}

export const CATEGORY_OPTIONS: CategoryOption[] = [
  { label: "All Collections", value: "all", emoji: "✨" },
  { label: "Personalized Gifts", value: "personalized", emoji: "🖼️" },
  { label: "Gift Hampers", value: "hampers", emoji: "🧺" },
  { label: "Ready-made Gifts", value: "ready-made", emoji: "🧸" },
  { label: "Corporate Gifting", value: "corporate", emoji: "💼" },
];

export const OCCASION_OPTIONS = [
  "Birthday",
  "Anniversary",
  "Valentine's Day",
  "Diwali",
  "Rakhi",
  "Christmas",
  "Baby Shower",
  "Graduation",
];

export const RECIPIENT_OPTIONS = [
  "For Her",
  "For Him",
  "For Couples",
  "For Parents",
  "For Friends",
  "For Kids",
];

export interface PricePreset {
  id: string;
  label: string;
  min: number | null;
  max: number | null;
}

export const PRICE_PRESETS: PricePreset[] = [
  { id: "all", label: "All Prices", min: null, max: null },
  { id: "under-500", label: "Under ₹500", min: null, max: 500 },
  { id: "500-1000", label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { id: "1000-1500", label: "₹1,000 – ₹1,500", min: 1000, max: 1500 },
  { id: "1500-plus", label: "₹1,500 & Above", min: 1500, max: null },
];

export const RATING_OPTIONS = [
  { label: "Any Rating", value: null },
  { label: "4.8 ★ & above", value: 4.8 },
  { label: "4.5 ★ & above", value: 4.5 },
  { label: "4.0 ★ & above", value: 4.0 },
];

export const SORT_OPTIONS = [
  { label: "Featured Picks", value: "featured" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Customer Rating", value: "rating" },
  { label: "Most Popular", value: "reviews" },
  { label: "Biggest Discount", value: "discount" },
];
