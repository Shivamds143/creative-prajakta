import React from "react";
import Link from "next/link";
import { Heart, ShieldCheck, Truck, Clock, Sparkles } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-wine text-blush pt-16 pb-8 border-t border-burgundy/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-14 border-b border-white/10 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-gold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-semibold text-white text-base">Handcrafted Quality</h4>
              <p className="text-xs text-blush/70 mt-1">Curated with love & meticulous attention</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-gold">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-semibold text-white text-base">Pan-India Express</h4>
              <p className="text-xs text-blush/70 mt-1">Safe transit to over 19,000+ PIN codes</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-gold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-semibold text-white text-base">Direct WhatsApp Flow</h4>
              <p className="text-xs text-blush/70 mt-1">100% human-verified gift coordination</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-gold">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-semibold text-white text-base">Prompt Customer Care</h4>
              <p className="text-xs text-blush/70 mt-1">Mon-Sat • 9:00 AM - 9:00 PM IST</p>
            </div>
          </div>
        </div>

        {/* Links Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/images/logo.png" alt="Creative Prajakta" width={40} height={40} />
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Creative Prajakta
              </span>
            </Link>
            <p className="text-sm text-blush/80 leading-relaxed max-w-sm">
              Creative Prajakta transforms everyday gifting into extraordinary memory-making. From custom-engraved
              keepsakes to gourmet celebration hampers, we bring heartfelt touches to your loved ones.
            </p>
            <div className="pt-2 text-xs text-blush/60 space-y-1">
              <p>📍 Crafted & Dispatched from Bengaluru & New Delhi, India</p>
              <p>💬 Official WhatsApp Concierge: +91 8087142499</p>
              <p>✉️ Support: shivamsonawane767@gmail.com </p>
            </div>
          </div>

          {/* Occasions */}
          <div className="space-y-3">
            <h5 className="font-serif text-sm font-semibold uppercase tracking-wider text-gold">
              Occasions
            </h5>
            <ul className="space-y-2 text-xs text-blush/70">
              <li><Link href="/shop?occasion=Birthday" className="hover:text-white transition-colors">Birthday Gifts</Link></li>
              <li><Link href="/shop?occasion=Anniversary" className="hover:text-white transition-colors">Anniversary Surprises</Link></li>
              <li><Link href="/shop?occasion=Diwali" className="hover:text-white transition-colors">Diwali Hampers</Link></li>
              <li><Link href="/shop?occasion=Valentine's Day" className="hover:text-white transition-colors">Valentine’s Day</Link></li>
              <li><Link href="/shop?occasion=Rakhi" className="hover:text-white transition-colors">Raksha Bandhan</Link></li>
              <li><Link href="/shop?occasion=Baby Shower" className="hover:text-white transition-colors">Baby Shower Kits</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h5 className="font-serif text-sm font-semibold uppercase tracking-wider text-gold">
              Collections
            </h5>
            <ul className="space-y-2 text-xs text-blush/70">
              <li><Link href="/shop?category=personalized" className="hover:text-white transition-colors">Personalized Keepsakes</Link></li>
              <li><Link href="/shop?category=hampers" className="hover:text-white transition-colors">Luxury Gift Hampers</Link></li>
              <li><Link href="/shop?category=ready-made" className="hover:text-white transition-colors">Ready-Made Gifts</Link></li>
              <li><Link href="/shop?category=corporate" className="hover:text-white transition-colors">Corporate Gifting</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">All Bestsellers</Link></li>
            </ul>
          </div>

          {/* Help & Admin */}
          <div className="space-y-3">
            <h5 className="font-serif text-sm font-semibold uppercase tracking-wider text-gold">
              Account & Help
            </h5>
            <ul className="space-y-2 text-xs text-blush/70">
              <li><Link href="/account" className="hover:text-white transition-colors">Order Tracking</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">View Gift Bag</Link></li>
              <li><Link href="/checkout" className="hover:text-white transition-colors">WhatsApp Checkout</Link></li>
              <li><Link href="/account" className="hover:text-white transition-colors">My Profile</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors text-white/50">Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-blush/60 gap-4">
          <p>© {new Date().getFullYear()} Creative Prajakta India. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Delivering smiles across India with <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          </p>
        </div>
      </div>
    </footer>
  );
}
