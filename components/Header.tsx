"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import AnnouncementBar from "./AnnouncementBar";
import SearchModal from "./SearchModal";
import CartDrawer from "./CartDrawer";
import { useCart } from "@/lib/context/CartContext";
import { useWishlist } from "@/lib/context/WishlistContext";
import { useAuth } from "@/lib/context/AuthContext";

export default function Header() {
  const { toggleCart, itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const occasions = [
    { name: "Birthday", emoji: "🎂", desc: "Celebrate another sweet year" },
    { name: "Anniversary", emoji: "💕", desc: "Romantic keepsakes & tokens" },
    { name: "Diwali", emoji: "🪔", desc: "Auspicious hampers & lamps" },
    { name: "Valentine's Day", emoji: "🎁", desc: "Gifts straight from the heart" },
    { name: "Rakhi", emoji: "🧿", desc: "Siblings bonded forever" },
    { name: "Christmas", emoji: "🎄", desc: "Holiday cheers & gourmet treats" },
    { name: "Baby Shower", emoji: "👶", desc: "Adorable newborn welcome kits" },
    { name: "Graduation", emoji: "🎓", desc: "Honor milestones & hard work" },
  ];

  const recipients = [
    { name: "For Her", emoji: "👩", desc: "Jewelry, self-care & personalized tokens" },
    { name: "For Him", emoji: "👨", desc: "Grooming kits, leather & executive gifts" },
    { name: "For Couples", emoji: "💑", desc: "Matching mugs & engraved photo books" },
    { name: "For Parents", emoji: "👴", desc: "Festive dry fruits & warm cozy hampers" },
    { name: "For Friends", emoji: "🤝", desc: "Customized keychains & quirky mugs" },
    { name: "For Kids", emoji: "👦", desc: "Teddy bears & fun activity sets" },
  ];

  const categories = [
    { name: "Personalized Gifts", slug: "personalized", emoji: "🖼️", desc: "Names, photos & heartfelt texts" },
    { name: "Gift Hampers", slug: "hampers", emoji: "🧺", desc: "Curated gourmet & wellness boxes" },
    { name: "Ready-made Gifts", slug: "ready-made", emoji: "🧸", desc: "Handpicked ready-to-ship treasures" },
    { name: "Corporate Gifting", slug: "corporate", emoji: "💼", desc: "Custom executive kits for teams" },
  ];

  return (
    <>
      <AnnouncementBar />
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-soft py-3 border-b border-rose-100/50"
          : "bg-white py-4.5 border-b border-stone-100"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-ink hover:text-burgundy transition-colors"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/images/logo.png"
              alt="Creative Prajakta"
              width={48}
              height={48}
              className="group-hover:scale-105 transition-transform duration-300"
            />
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-burgundy leading-none">
              Creative Prajakta
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-ink">
            {/* Occasions Mega Menu */}
            <div
              className="relative py-2"
              onMouseEnter={() => setActiveMegaMenu("occasions")}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <button className="flex items-center gap-1.5 hover:text-burgundy transition-colors py-1">
                <span>Shop by Occasion</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {activeMegaMenu === "occasions" && (
                <div className="absolute top-full -left-12 w-[520px] bg-white rounded-2xl shadow-card border border-rose-100/70 p-5 grid grid-cols-2 gap-3 animate-fadeIn">
                  {occasions.map((occ) => (
                    <Link
                      key={occ.name}
                      href={`/shop?occasion=${encodeURIComponent(occ.name)}`}
                      onClick={() => setActiveMegaMenu(null)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blush/40 transition-colors group"
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform">
                        {occ.emoji}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-ink group-hover:text-burgundy">
                          {occ.name}
                        </p>
                        <p className="text-[11px] text-stone-400 leading-tight">{occ.desc}</p>
                      </div>
                    </Link>
                  ))}
                  <div className="col-span-2 pt-2 border-t border-stone-100 text-center">
                    <Link
                      href="/shop"
                      onClick={() => setActiveMegaMenu(null)}
                      className="text-xs font-semibold text-burgundy hover:underline inline-flex items-center gap-1"
                    >
                      View All Occasions →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Recipients Mega Menu */}
            <div
              className="relative py-2"
              onMouseEnter={() => setActiveMegaMenu("recipients")}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <button className="flex items-center gap-1.5 hover:text-burgundy transition-colors py-1">
                <span>Shop by Recipient</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {activeMegaMenu === "recipients" && (
                <div className="absolute top-full -left-10 w-[480px] bg-white rounded-2xl shadow-card border border-rose-100/70 p-5 grid grid-cols-2 gap-3 animate-fadeIn">
                  {recipients.map((rec) => (
                    <Link
                      key={rec.name}
                      href={`/shop?recipient=${encodeURIComponent(rec.name)}`}
                      onClick={() => setActiveMegaMenu(null)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blush/40 transition-colors group"
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform">
                        {rec.emoji}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-ink group-hover:text-burgundy">
                          {rec.name}
                        </p>
                        <p className="text-[11px] text-stone-400 leading-tight">{rec.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Categories */}
            <div
              className="relative py-2"
              onMouseEnter={() => setActiveMegaMenu("categories")}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <button className="flex items-center gap-1.5 hover:text-burgundy transition-colors py-1">
                <span>Categories</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {activeMegaMenu === "categories" && (
                <div className="absolute top-full -left-8 w-[420px] bg-white rounded-2xl shadow-card border border-rose-100/70 p-5 space-y-2 animate-fadeIn">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/shop?category=${cat.slug}`}
                      onClick={() => setActiveMegaMenu(null)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blush/40 transition-colors group"
                    >
                      <span className="text-2xl">{cat.emoji}</span>
                      <div>
                        <p className="text-xs font-semibold text-ink group-hover:text-burgundy">
                          {cat.name}
                        </p>
                        <p className="text-[11px] text-stone-400 leading-tight">{cat.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/shop?category=personalized" className="hover:text-burgundy transition-colors flex items-center gap-1 text-burgundy font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              Personalized
            </Link>

            <Link href="/shop" className="hover:text-burgundy transition-colors">
              All Gifts
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 sm:p-2.5 rounded-full hover:bg-blush/40 text-stone-700 hover:text-burgundy transition-colors"
              aria-label="Search Gifts"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/account"
              className="p-2 sm:p-2.5 rounded-full hover:bg-blush/40 text-stone-700 hover:text-burgundy transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Account */}
            <Link
              href="/account"
              className="p-2 sm:p-2.5 rounded-full hover:bg-blush/40 text-stone-700 hover:text-burgundy transition-colors relative"
              aria-label="Customer Account"
            >
              <User className="w-5 h-5" />
              {user && (
                <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={toggleCart}
              className="flex items-center gap-2 bg-blush/60 hover:bg-burgundy hover:text-white text-burgundy px-3.5 py-2 rounded-full transition-all duration-300 font-medium text-xs sm:text-sm group"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Bag</span>
              <span className="bg-burgundy text-white group-hover:bg-gold group-hover:text-burgundy text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center">
                {itemCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto p-6 z-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <Image src="/images/logo.png" alt="Creative Prajakta" width={36} height={36} />
                  <span className="font-serif text-xl font-bold text-burgundy">Creative Prajakta</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-ink"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick links */}
              <div className="space-y-3">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-stone-400">
                  Collections
                </p>
                <div className="space-y-2">
                  <Link
                    href="/shop"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-medium text-ink hover:text-burgundy"
                  >
                    All Gifts & Hampers
                  </Link>
                  <Link
                    href="/shop?category=personalized"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-medium text-burgundy font-semibold"
                  >
                    ✨ Personalized Gifts
                  </Link>
                  <Link
                    href="/shop?category=hampers"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-medium text-ink hover:text-burgundy"
                  >
                    🧺 Gift Hampers
                  </Link>
                  <Link
                    href="/shop?category=corporate"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-medium text-ink hover:text-burgundy"
                  >
                    💼 Corporate Gifting
                  </Link>
                </div>
              </div>

              {/* Occasions in mobile */}
              <div className="space-y-3">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-stone-400">
                  Shop by Occasion
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {occasions.map((occ) => (
                    <Link
                      key={occ.name}
                      href={`/shop?occasion=${encodeURIComponent(occ.name)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs p-2 rounded-lg bg-stone-50 hover:bg-blush/40 flex items-center gap-1.5"
                    >
                      <span>{occ.emoji}</span>
                      <span className="truncate">{occ.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Account Links */}
              <div className="space-y-2 pt-4 border-t border-stone-100">
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-burgundy"
                >
                  <User className="w-4 h-4 text-burgundy" />
                  <span>My Profile & Order History</span>
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-xs text-stone-400 hover:text-burgundy pt-2"
                >
                  <span>Admin Portal</span>
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-100 text-xs text-stone-500 text-center">
              Direct WhatsApp Support: <br />
              <a href="https://wa.me/918087142499" className="font-semibold text-emerald-600">
                +91 8087142499
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Overlay */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Global Sliding Cart Drawer */}
      <CartDrawer />
    </>
  );
}
