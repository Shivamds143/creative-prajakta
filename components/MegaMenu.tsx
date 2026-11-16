"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export interface MegaMenuItem {
  emoji: string;
  label: string;
  description: string;
  href: string;
}

interface MegaMenuProps {
  items: MegaMenuItem[];
  columns: 2 | 3 | 4;
  isOpen: boolean;
}

const colClass: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

export default function MegaMenu({ items, columns, isOpen }: MegaMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50 min-w-[480px]"
          style={{ boxShadow: "0 20px 60px rgba(120,29,53,0.12)" }}
        >
          {/* Decorative top accent */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-24 rounded-full"
            style={{ backgroundColor: "#781D35" }}
          />

          <div className={`grid ${colClass[columns] ?? "grid-cols-3"} gap-3`}>
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start gap-3 p-3 rounded-xl hover:bg-rose-50 transition-all duration-200 hover:scale-[1.02]"
              >
                <span className="text-2xl leading-none mt-0.5 group-hover:scale-110 transition-transform duration-200">
                  {item.emoji}
                </span>
                <div className="min-w-0">
                  <p
                    className="font-semibold text-sm text-gray-800 group-hover:text-[#781D35] transition-colors"
                  >
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-tight">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
