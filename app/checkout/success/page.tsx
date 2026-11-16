"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, MessageCircle, ArrowRight, Package, Clock, ShieldCheck } from "lucide-react";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "GA-DEMO";
  const total = searchParams.get("total") || "0";

  return (
    <div className="min-h-[80vh] bg-ivory/60 flex items-center justify-center py-16 px-4">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-12 text-center shadow-soft border border-rose-100/60 space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold block mb-1">
            WhatsApp Order Initiated
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy">
            Order Sent Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-2">
            Your order reference is <span className="font-bold text-ink">{orderNumber}</span>.
            {total !== "0" && ` (Total: ₹${total})`}
          </p>
        </div>

        {/* What Happens Next Card */}
        <div className="p-5 rounded-2xl bg-ivory border border-rose-100 text-left space-y-3">
          <h4 className="font-serif font-bold text-sm text-burgundy flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold" /> What Happens Next?
          </h4>
          <ul className="text-xs text-stone-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="font-bold text-burgundy">1.</span>
              <span>
                <strong>Send WhatsApp Chat:</strong> Make sure you clicked &quot;Send&quot; in the opened WhatsApp window.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-burgundy">2.</span>
              <span>
                <strong>Personalization Verification:</strong> Our team reviews custom text and high-res photos.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-burgundy">3.</span>
              <span>
                <strong>Dispatch & Tracking:</strong> You will receive courier tracking details directly on WhatsApp.
              </span>
            </li>
          </ul>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/account"
            className="btn-outline flex-1 text-xs py-3.5 flex items-center justify-center gap-1.5"
          >
            <Package className="w-4 h-4" /> View My Orders
          </Link>
          <Link
            href="/shop"
            className="btn flex-1 text-xs py-3.5 flex items-center justify-center gap-1.5"
          >
            Continue Gifting <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-gold" />
          <span>Need immediate assistance? Call or WhatsApp +91 8087142499</span>
        </div>
      </div>
    </div>
  );
}

