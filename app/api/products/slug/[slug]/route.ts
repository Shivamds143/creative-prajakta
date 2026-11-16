import { NextRequest } from "next/server";
import { Product as ProductModel } from "@/models/Product";
import { connectDB } from "@/lib/db/mongoose";
import { products as fallbackProducts } from "@/lib/data";
import { apiSuccess, apiError } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  try {
    const isConnected = await connectDB().catch(() => null);
    if (isConnected) {
      const dbProduct = await ProductModel.findOne({ slug, isActive: true }).lean();
      if (dbProduct) {
        const related = await ProductModel.find({
          categorySlug: (dbProduct as any).categorySlug,
          slug: { $ne: slug },
        })
          .limit(4)
          .lean();

        return apiSuccess({
          product: dbProduct,
          related,
        });
      }
    }
  } catch (e) {
    // Graceful fallback
  }

  const staticProduct = fallbackProducts.find((p) => p.slug === slug);
  if (!staticProduct) {
    return apiError("Product not found", 404);
  }

  const related = fallbackProducts
    .filter((p) => p.categorySlug === staticProduct.categorySlug && p.slug !== slug)
    .slice(0, 4);

  return apiSuccess({
    product: staticProduct,
    related,
  });
}

