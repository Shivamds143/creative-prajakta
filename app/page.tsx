"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Heart,
  ShieldCheck,
  Truck,
  Gift,
  Star,
  ChevronRight,
  Send,
  MessageCircle,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data";

export default function Home() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Occasions dataset
  const occasions = [
    { name: "Birthday", emoji: "🎂", desc: "Celebrate another year" },
    { name: "Anniversary", emoji: "💕", desc: "Romantic keepsakes" },
    { name: "Diwali", emoji: "🪔", desc: "Auspicious hampers" },
    { name: "Valentine's", emoji: "🎁", desc: "Tokens of true love" },
    { name: "Rakhi", emoji: "🧿", desc: "Sweet sibling ties" },
    { name: "Christmas", emoji: "🎄", desc: "Holiday gourmet joy" },
    { name: "Baby Shower", emoji: "👶", desc: "Newborn warm welcomes" },
    { name: "Graduation", emoji: "🎓", desc: "Honor big milestones" },
  ];

  // Recipients dataset
  const recipients = [
    {
      name: "For Her",
      emoji: "👩",
      desc: "Jewelry, spa relaxation & custom keepsakes",
      img: "https://images.pexels.com/photos/1458801/pexels-photo-1458801.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "For Him",
      emoji: "👨",
      desc: "Grooming kits, leather & executive accessories",
      img: "https://images.pexels.com/photos/934063/pexels-photo-934063.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "For Couples",
      emoji: "💑",
      desc: "Matching mugs, illuminated lamps & memories",
      img: "https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      name: "For Parents",
      emoji: "👴",
      desc: "Auspicious dry fruits, tea crates & comfort",
      img: "https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  ];

  // Categories dataset
  const categories = [
    {
      title: "Personalized Keepsakes",
      slug: "personalized",
      desc: "Custom engraved names, high-res photos & heartfelt dedications.",
      icon: "🖼️",
      tag: "Best for Memories",
    },
    {
      title: "Luxury Gift Hampers",
      slug: "hampers",
      desc: "Artisanal chocolates, dry fruits & celebratory treats in royal trunks.",
      icon: "🧺",
      tag: "Festive & Grand",
    },
    {
      title: "Ready-Made Delights",
      slug: "ready-made",
      desc: "Handpicked cozy plushies, scented soy candles & botanical plants.",
      icon: "🧸",
      tag: "Ready to Ship",
    },
    {
      title: "Corporate Gifting",
      slug: "corporate",
      desc: "Custom-branded executive kits, smart temperature flasks & diaries.",
      icon: "💼",
      tag: "Bulk & VIP",
    },
  ];

  // Instagram gallery items
  const galleryItems = [
    {
      img: "https://images.pexels.com/photos/1848565/pexels-photo-1848565.jpeg?auto=compress&cs=tinysrgb&w=800",
      caption: "Unboxing memories that last forever ❤️",
    },
    {
      img: "https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=800",
      caption: "Artisan Belgian chocolate hampers 🍫",
    },
    {
      img: "https://images.pexels.com/photos/5635046/pexels-photo-5635046.jpeg?auto=compress&cs=tinysrgb&w=800",
      caption: "Custom illuminated acrylic LED lamps ✨",
    },
    {
      img: "https://images.pexels.com/photos/264771/pexels-photo-264771.jpeg?auto=compress&cs=tinysrgb&w=800",
      caption: "Luxury celebrations in every package 🎁",
    },
  ];

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setNewsletterEmail("");
  };

  const bestsellers = products.slice(0, 8);
  const personalizedPicks = products.filter((p) => p.personalizable).slice(0, 4);

  return (
    <main className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blush/70 via-ivory to-ivory pt-8 pb-16 sm:py-20 border-b border-rose-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-rose-200/60 rounded-full px-4 py-1.5 shadow-sm text-xs font-semibold text-burgundy">
                <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
                <span>India&apos;s Premier Gifting Experience • WhatsApp Ordering</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-burgundy leading-[1.15]">
                Make Every Moment <br />
                <span className="text-wine italic font-normal">Unforgettably</span> Yours.
              </h1>

              <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover bespoke personalized keepsakes, royal celebratory hampers, and handpicked
                delights. Order seamlessly via WhatsApp with 100% human-verified fulfillment.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Link href="/shop" className="btn text-sm py-4 px-8 shadow-card flex items-center justify-center gap-2">
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/shop?category=personalized"
                  className="btn-outline text-sm py-4 px-8 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span>Personalize a Gift</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-rose-200/50 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-burgundy">15,000+</p>
                  <p className="text-[11px] text-stone-500 font-medium">Gifts Delivered</p>
                </div>
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-burgundy">4.9 ★</p>
                  <p className="text-[11px] text-stone-500 font-medium">Customer Love</p>
                </div>
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-burgundy">100%</p>
                  <p className="text-[11px] text-stone-500 font-medium">WhatsApp Verified</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visuals - Animated hero-gift.png */}
            <div className="lg:col-span-5 relative flex items-center justify-center py-4">
              {/* Soft decorative ambient glow */}
              <div
                className="absolute inset-0 rounded-full opacity-60 blur-3xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(216, 173, 120, 0.4) 0%, rgba(120, 29, 53, 0.2) 50%, transparent 75%)",
                }}
              />

              {/* Animated Hero Gift Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -14, 0],
                  rotate: [0, 1, -1, 0],
                }}
                transition={{
                  opacity: { duration: 0.8 },
                  scale: { duration: 0.8 },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                }}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                className="relative z-10 w-full max-w-lg cursor-pointer flex items-center justify-center"
              >
                <Image
                  src="/images/hero-gift.png"
                  alt="Creative Prajakta Signature Gifts"
                  width={700}
                  height={350}
                  priority
                  className="w-full h-auto object-contain filter drop-shadow-[0_20px_35px_rgba(120,29,53,0.22)] select-none"
                />

                {/* Floating Badge 1 - Top Right */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  className="absolute -top-3 right-0 sm:top-1 sm:right-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-rose-100/80 flex items-center gap-1.5 text-xs font-semibold text-burgundy"
                >
                  <Sparkles className="w-3.5 h-3.5 text-gold animate-spin" style={{ animationDuration: "10s" }} />
                  <span>Handcrafted with Love</span>
                </motion.div>

                {/* Floating Badge 2 - Bottom Left */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                  className="absolute -bottom-3 left-0 sm:bottom-0 sm:left-2 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-rose-100/80 flex items-center gap-3 text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-burgundy to-wine flex items-center justify-center text-white shadow-sm text-base">
                    🎁
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-burgundy">Custom Keepsakes</p>
                    <p className="text-[10px] text-stone-500 font-medium">Verified WhatsApp Flow</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY OCCASION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-gold">
            Celebrate Every Milestone
          </span>
          <h2 className="font-serif text-3xl font-bold text-burgundy">Shop by Occasion</h2>
          <p className="text-stone-500 text-xs sm:text-sm">
            Whether it&apos;s a milestone birthday or an intimate anniversary, find the perfect gift.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
          {occasions.map((occ) => (
            <Link
              key={occ.name}
              href={`/shop?occasion=${encodeURIComponent(occ.name)}`}
              className="group p-4 bg-white rounded-2xl border border-rose-100/60 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center justify-center"
            >
              <div className="w-14 h-14 rounded-full bg-blush/50 flex items-center justify-center text-3xl mb-2.5 group-hover:scale-110 transition-transform">
                {occ.emoji}
              </div>
              <h3 className="font-serif text-xs font-bold text-ink group-hover:text-burgundy transition-colors">
                {occ.name}
              </h3>
              <p className="text-[10px] text-stone-400 mt-0.5 line-clamp-1">{occ.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FOUR CORE GIFT CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.slug}
              className="p-6 rounded-3xl bg-white border border-rose-100/60 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <span className="text-3xl mb-3 block">{cat.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
                  {cat.tag}
                </span>
                <h3 className="font-serif text-lg font-bold text-burgundy mt-1 group-hover:text-wine transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">{cat.desc}</p>
              </div>

              <div className="pt-6">
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className="text-xs font-semibold text-burgundy hover:underline inline-flex items-center gap-1.5"
                >
                  Explore Collection <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BESTSELLING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-gold">
              Customer Favorites
            </span>
            <h2 className="font-serif text-3xl font-bold text-burgundy">
              Bestselling Gifts & Hampers
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              Top curated gifts treasured by gift-givers across India.
            </p>
          </div>
          <Link href="/shop" className="btn-outline text-xs py-2.5 px-5 self-start sm:self-auto">
            View All ({products.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.slug} p={product} />
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE PERSONALIZATION SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-burgundy via-wine to-burgundy text-white p-8 sm:p-14 shadow-card overflow-hidden relative">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-flex items-center gap-1.5 bg-gold/20 text-gold px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Handcrafted For You
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                Turn Precious Memories Into Lasting Keepsakes
              </h2>
              <p className="text-sm text-blush/80 leading-relaxed max-w-lg">
                Upload your cherished photographs, engrave names and anniversaries, or craft a personal
                message. Every custom order is verified with proof photos on WhatsApp before dispatch.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop?category=personalized"
                  className="btn-gold text-xs py-3.5 px-7 font-bold shadow-md inline-flex items-center gap-2"
                >
                  Browse Personalized Gifts <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-white/20">
                <Image
                  src="https://images.pexels.com/photos/1848565/pexels-photo-1848565.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Personalized Photo Frame"
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-white/20 mt-4">
                <Image
                  src="https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Customized Mug"
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SHOP BY RECIPIENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-gold">
            Tailored For Someone Special
          </span>
          <h2 className="font-serif text-3xl font-bold text-burgundy">Shop by Recipient</h2>
          <p className="text-stone-500 text-xs sm:text-sm">
            Curated collections thoughtfully designed for the important people in your world.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recipients.map((rec) => (
            <Link
              key={rec.name}
              href={`/shop?recipient=${encodeURIComponent(rec.name)}`}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-soft hover:shadow-card transition-all duration-500 block"
            >
              <Image
                src={rec.img}
                alt={rec.name}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
              <div className="absolute bottom-5 inset-x-5 text-white">
                <span className="text-2xl mb-1 block">{rec.emoji}</span>
                <h3 className="font-serif text-xl font-bold">{rec.name}</h3>
                <p className="text-xs text-blush/80 mt-1 line-clamp-1">{rec.desc}</p>
                <span className="text-[11px] font-bold text-gold inline-flex items-center gap-1 mt-2 group-hover:underline">
                  Shop Now <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. WHY CHOOSE CREATIVE PRAJAKTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-14 rounded-3xl shadow-soft border border-rose-100/60">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-gold">
              The Creative Prajakta Promise
            </span>
            <h2 className="font-serif text-3xl font-bold text-burgundy">
              Why Customers Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-blush text-burgundy rounded-2xl flex items-center justify-center mx-auto sm:mx-0">
                <Sparkles className="w-6 h-6 text-burgundy" />
              </div>
              <h3 className="font-serif text-lg font-bold text-ink">Bespoke Customization</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                From precision laser engravings to vibrant photo canvas prints, our master artisans craft
                each item to your exact specifications.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto sm:mx-0">
                <MessageCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-serif text-lg font-bold text-ink">Human-Verified WhatsApp Orders</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                No cold automated gateways. Speak directly with a gifting concierge who confirms your
                card message, photo proofs, and delivery slots.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mx-auto sm:mx-0">
                <ShieldCheck className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-serif text-lg font-bold text-ink">Damage-Free Delivery Guarantee</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Triple-layer cushioned protective packaging ensures your luxury gift boxes arrive in
                picture-perfect pristine condition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. INSTAGRAM VISUAL GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-gold">
            @creativeprajakta on Instagram
          </span>
          <h2 className="font-serif text-3xl font-bold text-burgundy">Moments of Pure Joy</h2>
          <p className="text-stone-500 text-xs sm:text-sm">
            Tag us in your celebrations to be featured on our community feed.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryItems.map((item, idx) => (
            <div
              key={idx}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-soft"
            >
              <Image
                src={item.img}
                alt={item.caption}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-ink/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center">
                <p className="text-white text-xs font-medium">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. NEWSLETTER SUBSCRIPTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blush/40 border border-rose-200/60 rounded-3xl p-8 sm:p-14 text-center max-w-3xl mx-auto space-y-4">
          <span className="text-2xl">💌</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy">
            Join the Creative Prajakta Celebration Circle
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
            Subscribe to receive exclusive early bird festive discounts, occasion reminders, and curated
            gifting inspirations.
          </p>

          <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="input flex-1 text-xs"
            />
            <button type="submit" className="btn text-xs py-3.5 px-6 whitespace-nowrap">
              Subscribe Free
            </button>
          </form>

          {subscribed && (
            <p className="text-xs font-semibold text-emerald-700 animate-fadeIn pt-1">
              🎉 Thank you for subscribing! We&apos;ve added you to our VIP list.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
