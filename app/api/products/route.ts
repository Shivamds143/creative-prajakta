import { NextRequest } from "next/server";
import { Product as ProductModel } from "@/models/Product";
import { connectDB } from "@/lib/db/mongoose";
import { products as fallbackProducts } from "@/lib/data";
import { apiSuccess } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const occasion = searchParams.get("occasion");
  const recipient = searchParams.get("recipient");
  const personalizable = searchParams.get("personalizable");
  const badge = searchParams.get("badge");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sort = searchParams.get("sort") || "featured";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "40", 10);

  let items = [...fallbackProducts];

  // Attempt database query if MongoDB is running
  try {
    const isConnected = await connectDB().catch(() => null);
    if (isConnected) {
      const dbQuery: Record<string, any> = { isActive: true };
      if (search) {
        dbQuery.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
        ];
      }
      if (category) {
        if (category === "personalized") dbQuery.categorySlug = "personalized";
        else if (category === "hampers") dbQuery.categorySlug = "hampers";
        else if (category === "ready-made") dbQuery.categorySlug = "ready-made";
        else if (category === "corporate") dbQuery.categorySlug = "corporate";
        else dbQuery.category = { $regex: category, $options: "i" };
      }
      if (occasion) dbQuery.occasion = { $regex: occasion, $options: "i" };
      if (recipient) dbQuery.recipient = { $regex: recipient, $options: "i" };
      if (personalizable === "true") dbQuery.personalizable = true;

      const dbProducts = await ProductModel.find(dbQuery).lean();
      if (dbProducts && dbProducts.length > 0) {
        items = dbProducts as any;
      }
    }
  } catch (e) {
    // Graceful fallback to static high-res verified products
  }

  // Filter in memory for maximum reliability
  if (search) {
    const s = search.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.description?.toLowerCase().includes(s) ||
        p.category?.toLowerCase().includes(s)
    );
  }

  if (category) {
    const c = category.toLowerCase();
    items = items.filter(
      (p) =>
        p.categorySlug === c ||
        p.category.toLowerCase().includes(c)
    );
  }

  if (occasion) {
    items = items.filter((p) =>
      p.occasion?.some((occ) => occ.toLowerCase() === occasion.toLowerCase())
    );
  }

  if (recipient) {
    items = items.filter((p) =>
      p.recipient?.some((rec) => rec.toLowerCase() === recipient.toLowerCase())
    );
  }

  if (personalizable === "true") {
    items = items.filter((p) => p.personalizable);
  }

  if (badge) {
    items = items.filter((p) => p.badge?.toLowerCase() === badge.toLowerCase());
  }

  if (minPrice) {
    items = items.filter((p) => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    items = items.filter((p) => p.price <= Number(maxPrice));
  }

  // Sort
  if (sort === "price-low") {
    items.sort((a, b) => a.price - b.price);
  } else if (sort === "price-high") {
    items.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sort === "reviews") {
    items.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
  }

  const total = items.length;
  const skip = (page - 1) * limit;
  const paginated = items.slice(skip, skip + limit);

  return apiSuccess({
    products: paginated,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
