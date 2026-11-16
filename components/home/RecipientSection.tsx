"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const recipients = [
  {
    emoji: "👩",
    name: "For Her",
    slug: "her",
    gradient: "linear-gradient(135deg, #FCE8E5 0%, #f9d0d0 100%)",
    accent: "#c0616a",
  },
  {
    emoji: "👨",
    name: "For Him",
    slug: "him",
    gradient: "linear-gradient(135deg, #e8ecfc 0%, #c8d4f7 100%)",
    accent: "#4a5fba",
  },
  {
    emoji: "💑",
    name: "For Couples",
    slug: "couples",
    gradient: "linear-gradient(135deg, #fce8f5 0%, #f7c8e8 100%)",
    accent: "#b04a8a",
  },
  {
    emoji: "👴",
    name: "For Parents",
    slug: "parents",
    gradient: "linear-gradient(135deg, #f0fce8 0%, #d4f7c8 100%)",
    accent: "#4a8a50",
  },
  {
    emoji: "👦",
    name: "For Kids",
    slug: "kids",
    gradient: "linear-gradient(135deg, #fdfce8 0%, #f7f0c8 100%)",
    accent: "#b08a2a",
  },
  {
    emoji: "🤝",
    name: "For Friends",
    slug: "friends",
    gradient: "linear-gradient(135deg, #e8f8fc 0%, #c8eef7 100%)",
    accent: "#2a7a9a",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function RecipientSection() {
  return (
    <section className="py-16 px-4 bg-white">
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
            Shop by Recipient
          </h2>
          <p className="mt-2 text-gray-500">
            Gifts that match the person perfectly
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6"
        >
          {recipients.map((r) => (
            <motion.div key={r.slug} variants={card}>
              <Link
                href={`/shop?recipient=${r.slug}`}
                className="group flex flex-col items-center gap-4 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ background: r.gradient }}
              >
                <span
                  className="flex h-16 w-16 items-center justify-center rounded-full text-4xl shadow-sm transition-transform duration-300 group-hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.7)" }}
                >
                  {r.emoji}
                </span>
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: r.accent }}
                  >
                    {r.name}
                  </p>
                  <p
                    className="mt-1 text-xs font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ color: r.accent }}
                  >
                    Shop Gifts →
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
