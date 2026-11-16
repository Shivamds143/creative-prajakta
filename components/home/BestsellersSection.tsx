"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/data";

const fallbackProducts: Product[] = [
  { slug: "photo-frame", name: "Personalized Photo Frame", price: 599, mrp: 999, emoji: "🖼️", rating: 4.8, reviews: 234, badge: "Bestseller", category: "Personalized", categorySlug: "personalized", occasion: ["Anniversary"], recipient: ["For Couples"], personalizable: true, images: ["https://images.pexels.com/photos/1848565/pexels-photo-1848565.jpeg"], description: "Keepsake frame", stock: 10, isActive: true },
  { slug: "choco-hamper", name: "Premium Chocolate Hamper", price: 1299, mrp: 1799, emoji: "🍫", rating: 4.9, reviews: 189, badge: "Bestseller", category: "Hampers", categorySlug: "hampers", occasion: ["Birthday"], recipient: ["For Friends"], personalizable: false, images: ["https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg"], description: "Chocolate hamper", stock: 10, isActive: true },
  { slug: "custom-mug", name: "Custom Name Mug", price: 399, mrp: 599, emoji: "☕", rating: 4.7, reviews: 312, badge: "Bestseller", category: "Personalized", categorySlug: "personalized", occasion: ["Birthday"], recipient: ["For Friends"], personalizable: true, images: ["https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg"], description: "Custom ceramic mug", stock: 10, isActive: true },
  { slug: "gift-box", name: "Luxury Gift Box", price: 1799, mrp: 2499, emoji: "🎁", rating: 4.9, reviews: 98, badge: "Bestseller", category: "Hampers", categorySlug: "hampers", occasion: ["Corporate"], recipient: ["For Him"], personalizable: false, images: ["https://images.pexels.com/photos/264771/pexels-photo-264771.jpeg"], description: "Luxury gift box", stock: 10, isActive: true },
];

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm animate-pulse">
      <div className="h-44 rounded-xl bg-gray-100" />
      <div className="mt-3 h-4 w-3/4 rounded bg-gray-100" />
      <div className="mt-2 h-3 w-1/2 rounded bg-gray-100" />
      <div className="mt-2 h-4 w-1/3 rounded bg-gray-100" />
    </div>
  );
}

export default function BestsellersSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products?badge=Bestseller&limit=8");
        if (res.ok) {
          const data = await res.json();
          const items: Product[] = data.products ?? data ?? [];
          setProducts(items.length > 0 ? items : fallbackProducts);
        } else {
          setProducts(fallbackProducts);
        }
      } catch {
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-16 px-4" style={{ background: "#FFF9F5" }}>
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-end justify-between"
        >
          <div>
            <h2
              className="text-3xl font-bold md:text-4xl"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#241616" }}
            >
              Bestselling Gifts
            </h2>
            <p className="mt-2 text-gray-500">
              Our most-loved picks — trusted by thousands of gift-givers
            </p>
          </div>
          <a
            href="/shop?badge=Bestseller"
            className="hidden rounded-full border px-5 py-2 text-sm font-semibold transition-all hover:shadow-md md:block"
            style={{ borderColor: "#781D35", color: "#781D35" }}
          >
            View All →
          </a>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : (products.length > 0 ? products : fallbackProducts)
                .slice(0, 8)
                .map((p, i) => (
                  <motion.div
                    key={p.slug}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                  >
                    <ProductCard p={p} />
                  </motion.div>
                ))}
        </div>
      </div>
    </section>
  );
}
