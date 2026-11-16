"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const occasions = [
  { emoji: "🎂", name: "Birthday", slug: "Birthday" },
  { emoji: "💕", name: "Anniversary", slug: "Anniversary" },
  { emoji: "🪔", name: "Diwali", slug: "Diwali" },
  { emoji: "🎄", name: "Christmas", slug: "Christmas" },
  { emoji: "🧿", name: "Rakhi", slug: "Rakhi" },
  { emoji: "💝", name: "Valentine's Day", slug: "Valentines Day" },
  { emoji: "👶", name: "Baby Shower", slug: "Baby Shower" },
  { emoji: "🎓", name: "Graduation", slug: "Graduation" },
];

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function OccasionSection() {
  return (
    <section className="py-16 px-4" style={{ background: "#FFF9F5" }}>
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2
            className="text-3xl font-bold md:text-4xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#241616" }}
          >
            Shop by Occasion
          </h2>
          <p className="mt-2 text-gray-500">
            Find the perfect gift for every special moment
          </p>
        </motion.div>

        {/* Mobile: horizontal scroll, Desktop: grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-4 md:overflow-visible md:pb-0 lg:grid-cols-8"
          style={{ scrollbarWidth: "none" }}
        >
          {occasions.map((occ) => (
            <motion.div key={occ.name} variants={item} className="flex-shrink-0">
              <Link
                href={`/shop?occasion=${encodeURIComponent(occ.slug)}`}
                className="group flex flex-col items-center gap-3"
              >
                <div
                  className="relative flex h-20 w-20 items-center justify-center rounded-full text-4xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  style={{
                    backgroundColor: "#FCE8E5",
                    border: "2px solid transparent",
                  }}
                >
                  <span
                    className="absolute inset-0 rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100"
                    style={{ border: "2px solid #781D35" }}
                  />
                  {occ.emoji}
                </div>
                <span
                  className="text-center text-sm font-medium leading-tight transition-colors group-hover:text-burgundy"
                  style={{ color: "#241616", maxWidth: "72px" }}
                >
                  {occ.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
