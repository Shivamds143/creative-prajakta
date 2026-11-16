"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Heart,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Gift,
  Check,
  ChevronRight,
} from "lucide-react";
import { ProductItem } from "@/components/ProductCard";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/lib/context/CartContext";
import { useWishlist } from "@/lib/context/WishlistContext";

export default function ProductDetailClient({
  product,
  related = [],
}: {
  product: ProductItem;
  related?: ProductItem[];
}) {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(
    product.images && product.images.length > 0 ? product.images[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);
  const [cardMessage, setCardMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"desc" | "shipping" | "reviews">("desc");
  const [addedSuccess, setAddedSuccess] = useState(false);

  const wishlisted = isWishlisted(product.slug);
  const discountPercent =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      imageUrl: selectedImage || undefined,
      emoji: product.emoji,
      quantity,
      badge: product.badge,
      customization: {
        customText: customText.trim() || undefined,
        giftWrap,
        cardMessage: cardMessage.trim() || undefined,
      },
    });
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleDirectWhatsApp = () => {
    const wrapNote = giftWrap ? " (with Premium Gift Wrapping)" : "";
    const customNote = customText ? `\n• Personalization: "${customText}"` : "";
    const cardNote = cardMessage ? `\n• Card Greeting: "${cardMessage}"` : "";

    const msg = `Hello GiftAura! 🎁\nI would love to order:\n• Product: ${product.name}${wrapNote}\n• Quantity: ${quantity}\n• Unit Price: ₹${product.price}${customNote}${cardNote}\n\nPlease let me know the availability and payment details. Thank you!`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/918087142499?text=${encoded}`, "_blank");
  };

  return (
    <div className="bg-ivory/60 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-burgundy">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link href="/shop" className="hover:text-burgundy">
            Shop
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          {product.category && (
            <>
              <Link
                href={`/shop?category=${product.categorySlug || ""}`}
                className="hover:text-burgundy"
              >
                {product.category}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            </>
          )}
          <span className="text-ink font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white p-6 sm:p-10 rounded-3xl shadow-soft border border-rose-100/50">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${selectedImage === img
                        ? "border-burgundy ring-2 ring-burgundy/20"
                        : "border-stone-200 hover:border-stone-400"
                      }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="flex-1 relative aspect-square rounded-2xl overflow-hidden bg-blush/20 border border-stone-100 group flex items-center justify-center">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 550px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <span className="text-8xl">{product.emoji || "🎁"}</span>
              )}

              {/* Wishlist Floating */}
              <button
                onClick={() => toggleWishlist(product.slug)}
                className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 shadow-md ${wishlisted
                    ? "bg-rose-50 text-rose-600 scale-110"
                    : "bg-white/90 text-stone-600 hover:text-rose-600 hover:bg-white"
                  }`}
                aria-label="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-rose-600" : ""}`} />
              </button>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                {product.badge && (
                  <span className="bg-burgundy text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    {product.badge}
                  </span>
                )}
                {product.personalizable && (
                  <span className="bg-gold text-wine text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3" /> Customizable
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Details & Customization */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              {product.category && (
                <span className="text-xs uppercase tracking-widest font-semibold text-stone-400 block mb-1">
                  {product.category}
                </span>
              )}
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink leading-tight">
                {product.name}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/50">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-sm ml-1 text-stone-800">
                    {product.rating || 4.8}
                  </span>
                </div>
                <span className="text-xs text-stone-500 font-medium">
                  {product.reviews || 120} verified gifting reviews
                </span>
                <span className="text-emerald-700 text-xs font-semibold flex items-center gap-1 ml-auto">
                  <Check className="w-3.5 h-3.5" /> In Stock & Ready
                </span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-4 rounded-2xl bg-ivory border border-rose-100 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-burgundy">₹{product.price}</span>
              {product.mrp > product.price && (
                <>
                  <span className="text-base text-stone-400 line-through">₹{product.mrp}</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                    Save {discountPercent}%
                  </span>
                </>
              )}
              <span className="text-[11px] text-stone-400 ml-auto">Taxes included</span>
            </div>

            {/* Personalization Inputs */}
            {product.personalizable && (
              <div className="p-5 rounded-2xl bg-blush/25 border border-rose-200/60 space-y-4">
                <div className="flex items-center gap-2 text-burgundy font-serif font-bold text-base">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span>Personalize Your Gift</span>
                </div>
                <p className="text-xs text-stone-600">
                  Enter the recipient&apos;s name or customized quote to be engraved/printed:
                </p>
                <div>
                  <input
                    type="text"
                    maxLength={60}
                    placeholder="e.g. Happy Birthday Priya ❤️ or Rahul & Ananya"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="w-full rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-stone-400 focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/15"
                  />
                  <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                    <span>Will be previewed on your WhatsApp order</span>
                    <span>{customText.length}/60 chars</span>
                  </div>
                </div>
              </div>
            )}

            {/* Gift Options (Wrapping & Greeting Card) */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-stone-200 hover:border-burgundy/40 cursor-pointer transition-colors bg-white">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="mt-0.5 rounded border-stone-300 text-burgundy focus:ring-burgundy w-4 h-4"
                />
                <div className="flex-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-ink flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-burgundy" /> Add Premium Gift Wrapping
                    </span>
                    <span className="font-bold text-burgundy">+₹49</span>
                  </div>
                  <p className="text-stone-500 mt-0.5">
                    Burgundy artisanal satin ribbon with gold seal finish.
                  </p>
                </div>
              </label>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-ink">
                  Personalized Greeting Card Message (Optional)
                </label>
                <textarea
                  rows={2}
                  maxLength={150}
                  placeholder="Add a heartfelt note to be printed inside the greeting card..."
                  value={cardMessage}
                  onChange={(e) => setCardMessage(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white p-3 text-xs text-ink placeholder:text-stone-400 focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/15"
                />
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-stone-200 rounded-xl bg-white p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-100 font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-semibold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-100 font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-6 rounded-full font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-300 ${addedSuccess
                      ? "bg-emerald-600 text-white"
                      : "bg-burgundy text-white hover:bg-wine active:scale-95"
                    }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Bag!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Gift Bag
                    </>
                  )}
                </button>
              </div>

              {/* Direct WhatsApp Instant Buy Button */}
              <button
                onClick={handleDirectWhatsApp}
                className="btn-whatsapp w-full text-center py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
              >
                Order Direct on WhatsApp 💬
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-stone-100 text-center text-[11px] text-stone-500">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-burgundy" />
                <span>Pan-India Express</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span>Zero Risk Payment</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-burgundy" />
                <span>Damage Protection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-10 shadow-soft border border-rose-100/50">
          <div className="flex border-b border-stone-200 gap-6 text-sm font-semibold">
            <button
              onClick={() => setActiveTab("desc")}
              className={`pb-3 transition-colors ${activeTab === "desc"
                  ? "border-b-2 border-burgundy text-burgundy"
                  : "text-stone-400 hover:text-ink"
                }`}
            >
              Description & Details
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`pb-3 transition-colors ${activeTab === "shipping"
                  ? "border-b-2 border-burgundy text-burgundy"
                  : "text-stone-400 hover:text-ink"
                }`}
            >
              Delivery & Packaging
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 transition-colors ${activeTab === "reviews"
                  ? "border-b-2 border-burgundy text-burgundy"
                  : "text-stone-400 hover:text-ink"
                }`}
            >
              Customer Reviews ({product.reviews || 120})
            </button>
          </div>

          <div className="pt-6 text-sm text-stone-600 leading-relaxed">
            {activeTab === "desc" && (
              <div className="space-y-4">
                <p>{product.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-ivory border border-stone-100">
                    <h5 className="font-semibold text-ink text-xs uppercase tracking-wider mb-2">
                      Occasions
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {product.occasion?.map((occ) => (
                        <span
                          key={occ}
                          className="bg-white border border-stone-200 text-stone-700 text-xs px-2.5 py-1 rounded-md"
                        >
                          {occ}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-ivory border border-stone-100">
                    <h5 className="font-semibold text-ink text-xs uppercase tracking-wider mb-2">
                      Best Suited For
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {product.recipient?.map((rec) => (
                        <span
                          key={rec}
                          className="bg-white border border-stone-200 text-stone-700 text-xs px-2.5 py-1 rounded-md"
                        >
                          {rec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-3">
                <p>
                  🚚 <strong>Delivery Timeline:</strong> Dispatched within 24 hours. Metro cities:
                  2–3 business days. Rest of India: 3–5 business days.
                </p>
                <p>
                  📦 <strong>Secure Tamper-Proof Packaging:</strong> Every item is encased in triple-layer
                  cushioned bubble insulation inside an elegant GiftAura branded presentation carton.
                </p>
                <p>
                  💬 <strong>WhatsApp Order Confirmation:</strong> Once you complete your checkout,
                  our concierge team verifies your recipient address and message preview before dispatch.
                </p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-blush/30 border border-rose-100">
                  <div className="text-center pr-6 border-r border-rose-200">
                    <span className="font-serif text-3xl font-bold text-burgundy">
                      {product.rating || 4.9}
                    </span>
                    <div className="flex text-amber-500 justify-center text-xs mt-0.5">★★★★★</div>
                  </div>
                  <p className="text-xs text-stone-600">
                    Based on verified gifting experiences. All reviews are collected from real customers who placed orders through WhatsApp.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded-xl border border-stone-100 bg-stone-50/50">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-ink">Pooja Sharma, Mumbai</span>
                      <span className="text-amber-500">★★★★★</span>
                    </div>
                    <p className="text-xs text-stone-500">
                      &quot;The finish on this gift exceeded my expectations! The WhatsApp team sent a photo proof of the customization before packing.&quot;
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-stone-100 bg-stone-50/50">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-ink">Aditya V., Bengaluru</span>
                      <span className="text-amber-500">★★★★★</span>
                    </div>
                    <p className="text-xs text-stone-500">
                      &quot;Ordered for our wedding anniversary. Fast dispatch and the luxury gift wrap looked extraordinary.&quot;
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-gold">
                  Curated Recommendations
                </span>
                <h3 className="font-serif text-2xl font-bold text-burgundy">
                  You May Also Love
                </h3>
              </div>
              <Link href="/shop" className="text-xs font-semibold text-burgundy hover:underline">
                View All Gifts →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((item) => (
                <ProductCard key={item.slug} p={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

