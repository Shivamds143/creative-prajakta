"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";

const wordVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

const floatingEmojis = ["🎁", "🎀", "✨", "💝", "🌸", "🎊"];

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        minHeight: "85vh",
        background: "linear-gradient(135deg, #FFF9F5 0%, #FCE8E5 50%, #FFF9F5 100%)",
      }}
    >
      {/* Decorative background shapes */}
      <div
        className="absolute top-0 right-0 h-96 w-96 rounded-full opacity-20"
        style={{ background: "#D8AD78", filter: "blur(80px)", transform: "translate(30%, -30%)" }}
      />
      <div
        className="absolute bottom-0 left-0 h-64 w-64 rounded-full opacity-15"
        style={{ background: "#781D35", filter: "blur(60px)", transform: "translate(-30%, 30%)" }}
      />

      {/* Floating emoji bubbles */}
      {floatingEmojis.map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl select-none pointer-events-none"
          style={{
            left: `${10 + i * 15}%`,
            top: `${15 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -16, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        >
          {emoji}
        </motion.div>
      ))}

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:py-24 lg:py-32">
        {/* Left: Headline + CTAs */}
        <div>
          <div className="overflow-hidden">
            {["Make Every", "Moment More", "Special."].map((line, lineIdx) => (
              <div key={lineIdx} className="overflow-hidden">
                <motion.div
                  custom={lineIdx}
                  initial="hidden"
                  animate="visible"
                  variants={wordVariants}
                  className="block leading-tight"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
                    fontWeight: 700,
                    color:
                      lineIdx === 1
                        ? "#781D35"
                        : lineIdx === 2
                        ? "#D8AD78"
                        : "#241616",
                  }}
                >
                  {line}
                </motion.div>
              </div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-6 max-w-md text-lg leading-relaxed text-gray-600"
          >
            Discover thoughtful gifts for every occasion — beautifully crafted,
            personally yours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
              style={{ backgroundColor: "#781D35" }}
            >
              Explore Gifts →
            </Link>
            <Link
              href="/shop?category=personalized"
              className="inline-flex items-center gap-2 rounded-full border-2 px-7 py-3.5 font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ borderColor: "#781D35", color: "#781D35", backgroundColor: "transparent" }}
            >
              Personalize a Gift
            </Link>
          </motion.div>
        </div>

        {/* Right: Hero image with parallax */}
        <motion.div
          style={{ y: imageY }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative mx-auto w-full max-w-lg"
        >
          <div
            className="absolute inset-0 rounded-3xl opacity-30"
            style={{
              background:
                "linear-gradient(135deg, #D8AD78 0%, #781D35 100%)",
              filter: "blur(40px)",
              transform: "scale(0.9) translateY(10%)",
            }}
          />
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <Image
              src="https://images.pexels.com/photos/5632400/pexels-photo-5632400.jpeg?auto=compress&cs=tinysrgb&w=800&dpr=1"
              alt="Beautifully wrapped gift boxes with ribbons"
              width={800}
              height={600}
              priority
              className="w-full object-cover"
              style={{ height: "480px" }}
            />
            {/* Shimmer overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)",
              }}
            />
          </div>

          {/* Floating badge */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-4 -left-4 rounded-2xl bg-white px-4 py-3 shadow-xl"
          >
            <p className="text-xs text-gray-500">Delivered with love</p>
            <p className="font-bold" style={{ color: "#781D35" }}>
              ★★★★★ 10,000+ Happy Gifters
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-400"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={20} />
      </motion.div>
    </section>
  );
}
