"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalSavings, itemCount } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-ink/60 backdrop-blur-sm transition-opacity animate-fadeIn">
      <div className="absolute inset-0" onClick={closeCart} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-ivory/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-burgundy" />
              <h2 className="font-serif text-lg font-bold text-burgundy">
                Your Gift Bag ({itemCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-ink transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 bg-blush/60 rounded-full flex items-center justify-center mx-auto text-4xl">
                  🎁
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-burgundy">Your bag is empty</h3>
                  <p className="text-stone-500 text-xs mt-1">
                    Discover unforgettable gifts crafted with love.
                  </p>
                </div>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="btn text-xs inline-flex items-center gap-1.5"
                >
                  Start Shopping <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {items.map((item) => {
                    const wrapCost = item.customization?.giftWrap ? 49 : 0;
                    const itemTotal = (item.price + wrapCost) * item.quantity;
                    return (
                      <div
                        key={item.id}
                        className="flex gap-3 p-3 bg-stone-50/70 rounded-xl border border-stone-100 hover:border-rose-100 transition-colors"
                      >
                        <div className="w-16 h-16 rounded-lg bg-white overflow-hidden relative shrink-0 flex items-center justify-center border border-stone-200">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-2xl">{item.emoji || "🎁"}</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-ink truncate">{item.name}</h4>
                          <div className="text-[11px] text-stone-500 mt-0.5 space-y-0.5">
                            {item.customization?.customText && (
                              <p className="truncate text-burgundy font-medium">
                                Text: &quot;{item.customization.customText}&quot;
                              </p>
                            )}
                            {item.customization?.giftWrap && (
                              <p className="text-emerald-700 font-medium">
                                + Premium Gift Wrapping (₹49)
                              </p>
                            )}
                            {item.customization?.cardMessage && (
                              <p className="truncate italic">
                                Card: &quot;{item.customization.cardMessage}&quot;
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-stone-200 rounded-lg bg-white">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="px-2 py-0.5 text-xs text-stone-600 hover:text-burgundy"
                              >
                                -
                              </button>
                              <span className="px-2 text-xs font-medium text-ink">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="px-2 py-0.5 text-xs text-stone-600 hover:text-burgundy"
                              >
                                +
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-burgundy">
                                ₹{itemTotal}
                              </span>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Free Delivery Bar */}
                <div className="p-3 bg-blush/40 rounded-xl text-xs space-y-1.5 border border-rose-100">
                  <div className="flex justify-between font-medium text-burgundy">
                    <span>
                      {subtotal >= 999
                        ? "🎉 You qualified for FREE Express Delivery!"
                        : `Add ₹${999 - subtotal} more for Free Delivery`}
                    </span>
                    <span>₹999 goal</span>
                  </div>
                  <div className="w-full bg-rose-200/60 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-burgundy h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (subtotal / 999) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Coupon Box */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Coupon: WELCOME10"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-burgundy uppercase"
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-burgundy text-white text-xs font-medium rounded-xl hover:bg-wine transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMsg && (
                    <p
                      className={`text-[11px] ${
                        couponMsg.error ? "text-rose-600" : "text-emerald-700"
                      }`}
                    >
                      {couponMsg.text}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-stone-100 bg-ivory/80 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-ink">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({appliedCoupon})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                {totalSavings > 0 && (
                  <div className="flex justify-between text-gold">
                    <span>MRP Savings</span>
                    <span>-₹{totalSavings}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Delivery</span>
                  <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
                </div>
                <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-bold text-burgundy">
                  <span>Estimated Total</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-whatsapp w-full text-center text-sm py-3 justify-center"
                >
                  Order via WhatsApp 💬
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full text-center block text-xs font-semibold text-burgundy hover:underline py-1"
                >
                  View Full Cart & Customizations →
                </Link>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                <span>Zero Online Payment Risk • Direct WhatsApp Confirmation</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

