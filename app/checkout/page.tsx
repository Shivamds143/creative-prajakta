"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShieldCheck,
  Truck,
  ArrowRight,
  Gift,
  Sparkles,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/lib/context/CartContext";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi NCR",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Karnataka");
  const [postalCode, setPostalCode] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const shippingFee = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const finalTotal = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-3xl shadow-soft border border-rose-100">
          <h2 className="font-serif text-2xl font-bold text-burgundy mb-2">Your Bag is Empty</h2>
          <p className="text-xs text-stone-500 mb-6">
            Please add items to your cart before proceeding to WhatsApp checkout.
          </p>
          <Link href="/shop" className="btn text-xs">
            Browse Gifts
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim()) return setFormError("Please enter your full name.");
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      return setFormError("Please provide a valid 10-digit WhatsApp phone number.");
    }
    if (!street.trim()) return setFormError("Please provide your delivery street address.");
    if (!city.trim()) return setFormError("Please provide your city.");
    if (!postalCode.trim() || postalCode.replace(/\D/g, "").length !== 6) {
      return setFormError("Please provide a valid 6-digit PIN code.");
    }

    setIsSubmitting(true);

    const orderNumber = `GA-${Date.now().toString().slice(-6)}`;

    // Build the WhatsApp formatted message
    let message = `*NEW CREATIVE PRAJAKTA ORDER #${orderNumber}*\n\n`;
    message += `👤 *Customer Details:*\n`;
    message += `• Name: ${name}\n`;
    message += `• WhatsApp: ${phone}\n`;
    if (email) message += `• Email: ${email}\n`;
    message += `\n📍 *Delivery Address:*\n`;
    message += `${street}, ${city}, ${state} - ${postalCode}\nIndia\n`;
    if (deliveryNotes) message += `_Notes: ${deliveryNotes}_\n`;

    message += `\n🎁 *Items Ordered (${items.length}):*\n`;
    items.forEach((item, idx) => {
      const wrapStr = item.customization?.giftWrap ? " [Gift Wrapped +₹49]" : "";
      message += `${idx + 1}. *${item.name}* x ${item.quantity} = ₹${item.price * item.quantity}${wrapStr}\n`;
      if (item.customization?.customText) {
        message += `   ↳ Personalization: "${item.customization.customText}"\n`;
      }
      if (item.customization?.cardMessage) {
        message += `   ↳ Card Note: "${item.customization.cardMessage}"\n`;
      }
    });

    message += `\n💰 *Pricing Breakdown:*\n`;
    message += `• Subtotal: ₹${subtotal}\n`;
    message += `• Express Delivery: ${shippingFee === 0 ? "FREE" : `₹${shippingFee}`}\n`;
    message += `• *Estimated Total: ₹${finalTotal}*\n\n`;
    message += `_Please confirm order availability and share payment guidance. Thank you!_`;

    // Attempt to persist in backend database
    try {
      await fetch("/api/orders/whatsapp-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, phone, email: email || undefined },
          shippingAddress: {
            street,
            city,
            state,
            postalCode,
            country: "India",
          },
          items: items.map((i) => ({
            slug: i.slug,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            emoji: i.emoji,
            imageUrl: i.imageUrl,
            customization: i.customization,
            subtotal: i.price * i.quantity,
          })),
          pricing: {
            subtotal,
            discount: 0,
            shippingFee,
            totalAmount: finalTotal,
          },
          customerNotes: deliveryNotes || undefined,
        }),
      }).catch(() => {
        // Continue even if database connection fails
      });
    } catch (err) {
      // Continue to WhatsApp redirect
    }

    // Open WhatsApp
    const targetPhone = "918087142499";
    const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;

    // Store in localStorage for customer order tracking
    try {
      const existingOrders = JSON.parse(localStorage.getItem("giftaura_customer_orders") || "[]");
      existingOrders.unshift({
        orderNumber,
        createdAt: new Date().toISOString(),
        items,
        totalAmount: finalTotal,
        status: "PENDING_WHATSAPP",
        address: `${street}, ${city}, ${state} - ${postalCode}`,
      });
      localStorage.setItem("giftaura_customer_orders", JSON.stringify(existingOrders));
    } catch (e) {
      console.error(e);
    }

    clearCart();
    setIsSubmitting(false);

    // Open WhatsApp in new tab and push to success page
    window.open(waUrl, "_blank");
    router.push(`/checkout/success?orderNumber=${orderNumber}&total=${finalTotal}`);
  };

  return (
    <div className="bg-ivory/60 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-10 space-y-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-gold">
            Step 2 of 2 • Direct WhatsApp Checkout
          </span>
          <h1 className="font-serif text-3xl font-bold text-burgundy">
            Delivery & Recipient Details
          </h1>
          <p className="text-stone-500 text-xs">
            Zero online payment risk. Your order details will be pre-filled into our official WhatsApp chat.
          </p>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Details */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl shadow-soft border border-rose-100/60 space-y-6">
              <h2 className="font-serif font-bold text-lg text-burgundy pb-3 border-b border-stone-100 flex items-center gap-2">
                <Truck className="w-5 h-5 text-gold" /> Recipient Shipping Information
              </h2>

              {formError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  ⚠️ {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Recipient or Sender's Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input"
                  />
                  <span className="text-[10px] text-stone-400">Order verification will be sent here</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700">Street / House / Area *</label>
                  <input
                    type="text"
                    required
                    placeholder="Flat/House No., Street name, Landmark"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="input"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bengaluru, Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">State *</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="input bg-white"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="6 digits PIN"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="input"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700">Country</label>
                  <input
                    type="text"
                    disabled
                    value="India"
                    className="input bg-stone-50 text-stone-500 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700">
                    Special Delivery Instructions
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Please deliver on Saturday evening, ring doorbell twice"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    className="input resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Order Review & WhatsApp Action */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-white p-6 rounded-3xl shadow-soft border border-rose-100/60 space-y-4">
                <h3 className="font-serif font-bold text-base text-burgundy pb-3 border-b border-stone-100">
                  Order Items ({items.length})
                </h3>

                <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 text-xs items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-blush/30 overflow-hidden relative shrink-0 flex items-center justify-center">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <span>{item.emoji || "🎁"}</span>
                          )}
                        </div>
                        <div className="truncate">
                          <p className="font-semibold text-ink truncate">{item.name}</p>
                          <p className="text-[10px] text-stone-400">Qty: {item.quantity}</p>
                          {item.customization?.customText && (
                            <p className="text-[10px] text-burgundy italic truncate">
                              &quot;{item.customization.customText}&quot;
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="font-semibold text-burgundy shrink-0">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="pt-3 border-t border-stone-100 space-y-2 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Express Delivery</span>
                    <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
                  </div>
                  <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-bold text-burgundy">
                    <span>Total Amount</span>
                    <span className="text-xl">₹{finalTotal}</span>
                  </div>
                </div>

                {/* Submit to WhatsApp */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-whatsapp w-full py-4 text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Preparing WhatsApp...
                    </>
                  ) : (
                    <>
                      Send Order to WhatsApp 💬
                    </>
                  )}
                </button>

                <div className="p-3 rounded-xl bg-blush/30 border border-rose-200/50 text-[11px] text-stone-600 space-y-1">
                  <p className="font-semibold text-burgundy flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold" /> How WhatsApp Ordering Works:
                  </p>
                  <p>1. Clicking will open your WhatsApp with a pre-filled summary.</p>
                  <p>2. Send the message to our verified Creative Prajakta concierge.</p>
                  <p>3. Our team confirms custom photos, delivery slot, and payment details.</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

