"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronDown, Gift, Heart, ShoppingBag, User, Home, Compass } from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  cartCount?: number;
  wishlistCount?: number;
}

const occasions = [
  { emoji: "🎂", label: "Birthday", href: "/shop?occasion=birthday" },
  { emoji: "💑", label: "Anniversary", href: "/shop?occasion=anniversary" },
  { emoji: "🪔", label: "Diwali", href: "/shop?occasion=diwali" },
  { emoji: "🎄", label: "Christmas", href: "/shop?occasion=christmas" },
  { emoji: "🧵", label: "Rakhi", href: "/shop?occasion=rakhi" },
  { emoji: "💝", label: "Valentine's Day", href: "/shop?occasion=valentines" },
  { emoji: "👶", label: "Baby Shower", href: "/shop?occasion=baby-shower" },
  { emoji: "🎓", label: "Graduation", href: "/shop?occasion=graduation" },
];

const recipients = [
  { emoji: "👩", label: "For Her", href: "/shop?recipient=her" },
  { emoji: "👨", label: "For Him", href: "/shop?recipient=him" },
  { emoji: "👫", label: "For Couples", href: "/shop?recipient=couples" },
  { emoji: "👴", label: "For Parents", href: "/shop?recipient=parents" },
  { emoji: "🧒", label: "For Kids", href: "/shop?recipient=kids" },
  { emoji: "👯", label: "For Friends", href: "/shop?recipient=friends" },
];

const shopLinks = [
  { emoji: "✨", label: "Personalized Gifts", href: "/shop?category=personalized" },
  { emoji: "🧺", label: "Gift Hampers", href: "/shop?category=hampers" },
  { emoji: "🎁", label: "Ready-made Gifts", href: "/shop?category=ready-made" },
  { emoji: "🏢", label: "Corporate Gifting", href: "/shop?category=corporate" },
  { emoji: "🆕", label: "New Arrivals", href: "/shop?category=new-arrivals" },
];

function Accordion({
  title,
  emoji,
  children,
}: {
  title: string;
  emoji: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 text-left text-white font-medium text-base"
      >
        <span>
          {emoji} {title}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={18} className="text-white/60" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pb-3 grid grid-cols-2 gap-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MobileNav({
  isOpen,
  onClose,
  cartCount = 0,
  wishlistCount = 0,
}: MobileNavProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 left-0 h-full w-80 max-w-[85vw] z-50 flex flex-col overflow-y-auto"
            style={{ backgroundColor: "#64172C" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Gift size={22} className="text-[#D8AD78]" />
                <span
                  className="text-white text-xl font-bold"
                  style={{ fontFamily: "var(--font-playfair, serif)" }}
                >
                  GiftAura
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="text-white/70 hover:text-white p-1 transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-5 py-2">
              {/* Direct links */}
              <div className="space-y-1 py-3 border-b border-white/10">
                {[
                  { href: "/", label: "Home", Icon: Home },
                  { href: "/shop", label: "All Gifts", Icon: Gift },
                  { href: "/gift-finder", label: "Gift Finder", Icon: Compass },
                ].map(({ href, label, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className="flex items-center gap-3 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg px-3 transition-all text-sm font-medium"
                  >
                    <Icon size={16} className="text-[#D8AD78]" />
                    {label}
                  </Link>
                ))}
              </div>

              {/* Accordions */}
              <div className="mt-2">
                <Accordion title="Occasions" emoji="🎉">
                  {occasions.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-2 text-white/80 hover:text-white py-2 px-2 rounded-lg hover:bg-white/10 transition-colors text-xs font-medium"
                    >
                      <span>{item.emoji}</span>
                      {item.label}
                    </Link>
                  ))}
                </Accordion>

                <Accordion title="Recipients" emoji="👥">
                  {recipients.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-2 text-white/80 hover:text-white py-2 px-2 rounded-lg hover:bg-white/10 transition-colors text-xs font-medium"
                    >
                      <span>{item.emoji}</span>
                      {item.label}
                    </Link>
                  ))}
                </Accordion>

                <Accordion title="Shop" emoji="🛍️">
                  {shopLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-2 text-white/80 hover:text-white py-2 px-2 rounded-lg hover:bg-white/10 transition-colors text-xs font-medium"
                    >
                      <span>{item.emoji}</span>
                      {item.label}
                    </Link>
                  ))}
                </Accordion>
              </div>
            </nav>

            {/* Bottom bar */}
            <div className="border-t border-white/10 px-5 py-4">
              <div className="flex items-center justify-around">
                <Link
                  href="/account"
                  onClick={onClose}
                  className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors"
                >
                  <User size={20} />
                  <span className="text-xs">Account</span>
                </Link>
                <Link
                  href="/wishlist"
                  onClick={onClose}
                  className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors relative"
                >
                  <Heart size={20} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#D8AD78] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                  <span className="text-xs">Wishlist</span>
                </Link>
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors relative"
                >
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#781D35] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                  <span className="text-xs">Cart</span>
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
