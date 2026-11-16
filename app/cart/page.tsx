"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Sparkles,
  Gift,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "@/lib/context/CartContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal, totalSavings, itemCount } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    const code = couponCode.trim().toUpperCase();
    if (code === "WELCOME10") {
      const disc = Math.round(subtotal * 0.1);
      setDiscount(disc);
      setAppliedCoupon("WELCOME10");
      setCouponMsg({ text: `🎉 10% discount applied! You save ₹${disc}`, error: false });
    } else if (code === "GIFT100" && subtotal >= 999) {
      setDiscount(100);
      setAppliedCoupon("GIFT100");
      setCouponMsg({ text: `🎉 ₹100 flat discount applied!`, error: false });
    } else {
      setCouponMsg({
        text: code === "GIFT100" ? "Requires minimum order of ₹999" : "Invalid coupon code",
        error: true,
      });
    }
  };

  const shippingFee = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - discount + shippingFee);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-ivory/50 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 text-center shadow-soft border border-rose-100/60 space-y-5">
          <div className="w-20 h-20 bg-blush/60 rounded-full flex items-center justify-center mx-auto text-4xl shadow-sm">
            🎁
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-burgundy">Your Bag is Empty</h1>
            <p className="text-stone-500 text-xs mt-1.5 leading-relaxed">
              Looks like you haven&apos;t added any personalized gifts or curated celebration hampers yet.
            </p>
          </div>
          <Link href="/shop" className="btn w-full text-xs flex items-center justify-center gap-2">
            Explore Gift Collections <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory/50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/shop"
              className="text-xs font-semibold text-stone-500 hover:text-burgundy inline-flex items-center gap-1 mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
            </Link>
            <h1 className="font-serif text-3xl font-bold text-burgundy">Review Your Gift Bag</h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-stone-400 hover:text-rose-600 transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-rose-100/60 space-y-4">
              {items.map((item) => {
                const wrapExtra = item.customization?.giftWrap ? 49 : 0;
                const unitTotal = item.price + wrapExtra;
                const lineTotal = unitTotal * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-stone-50/50 border border-stone-100 hover:border-rose-100 transition-colors"
                  >
                    <div className="w-24 h-24 rounded-xl bg-white overflow-hidden relative shrink-0 flex items-center justify-center border border-stone-200">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-4xl">{item.emoji || "🎁"}</span>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-serif font-bold text-base text-ink">{item.name}</h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-stone-400 hover:text-rose-600 p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Customization Details */}
                        <div className="text-xs text-stone-600 mt-1 space-y-1">
                          {item.customization?.customText && (
                            <p className="flex items-center gap-1.5 text-burgundy font-medium">
                              <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
                              Custom Name/Text: &quot;{item.customization.customText}&quot;
                            </p>
                          )}
                          {item.customization?.giftWrap && (
                            <p className="flex items-center gap-1.5 text-emerald-700 font-medium">
                              <Gift className="w-3.5 h-3.5 shrink-0" />
                              Premium Ribbon Gift Wrap (+₹49)
                            </p>
                          )}
                          {item.customization?.cardMessage && (
                            <p className="italic text-stone-500">
                              Greeting Card: &quot;{item.customization.cardMessage}&quot;
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-2 border-t border-stone-200/50">
                        <div className="flex items-center border border-stone-200 rounded-xl bg-white p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-lg"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-lg"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-base font-bold text-burgundy">₹{lineTotal}</span>
                          {wrapExtra > 0 && (
                            <span className="text-[10px] text-stone-400 block">incl. wrapping</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-rose-100/60 space-y-5">
              <h2 className="font-serif font-bold text-lg text-burgundy pb-3 border-b border-stone-100">
                Order Summary
              </h2>

              {/* Coupon Form */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-700">Promo Code</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="WELCOME10 or GIFT100"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-burgundy uppercase"
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2.5 bg-burgundy text-white text-xs font-semibold rounded-xl hover:bg-wine transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponMsg && (
                  <p
                    className={`text-[11px] font-medium ${
                      couponMsg.error ? "text-rose-600" : "text-emerald-700"
                    }`}
                  >
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-medium text-ink">₹{subtotal}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount ({appliedCoupon})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                {totalSavings > 0 && (
                  <div className="flex justify-between text-gold font-medium">
                    <span>Retail MRP Discount</span>
                    <span>-₹{totalSavings}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Pan-India Express Shipping</span>
                  <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-base font-bold text-burgundy">
                  <span>Final Estimated Total</span>
                  <span className="text-xl">₹{finalTotal}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="btn-whatsapp w-full text-center text-sm py-3.5 flex items-center justify-center gap-2"
              >
                Proceed to WhatsApp Checkout 💬
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 text-center pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                <span>Direct WhatsApp Order • 100% Verified Before Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

