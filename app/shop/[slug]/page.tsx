import { notFound } from "next/navigation";
import { products } from "@/lib/data";
import ProductDetailClient from "@/components/ProductDetailClient";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) return { title: "Product Not Found – Creative Prajakta" };

  return {
    title: `${product.name} – Creative Prajakta Premium Gifts`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const related = products
    .filter((p) => p.categorySlug === product.categorySlug && p.slug !== slug)
    .slice(0, 4);

  return <ProductDetailClient product={product} related={related} />;
}

