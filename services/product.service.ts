import connectToDatabase from "@/lib/db/mongoose";
import { Product, IProduct } from "@/models/Product";
import { NotFoundError } from "@/lib/api/errors";

export interface ProductFilterOptions {
  category?: string;
  occasion?: string;
  recipient?: string;
  personalizable?: boolean;
  search?: string;
  isActive?: boolean;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "rating";
}

export class ProductService {
  static async listProducts(filter: ProductFilterOptions = {}, pagination: PaginationOptions = {}) {
    await connectToDatabase();

    const query: Record<string, any> = {};

    if (filter.isActive !== undefined) {
      query.isActive = filter.isActive;
    } else {
      query.isActive = true;
    }

    if (filter.category) {
      query.$or = [{ category: filter.category }, { categorySlug: filter.category.toLowerCase() }];
    }

    if (filter.occasion) {
      query.occasion = filter.occasion;
    }

    if (filter.recipient) {
      query.recipient = filter.recipient;
    }

    if (filter.personalizable !== undefined) {
      query.personalizable = filter.personalizable;
    }

    if (filter.search) {
      query.$text = { $search: filter.search };
    }

    const page = Math.max(1, pagination.page || 1);
    const limit = Math.min(100, Math.max(1, pagination.limit || 20));
    const skip = (page - 1) * limit;

    let sortQuery: Record<string, 1 | -1> = { createdAt: -1 };
    if (pagination.sort === "price_asc") sortQuery = { price: 1 };
    else if (pagination.sort === "price_desc") sortQuery = { price: -1 };
    else if (pagination.sort === "rating") sortQuery = { rating: -1 };

    const [items, total] = await Promise.all([
      Product.find(query).sort(sortQuery).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getProductBySlugOrId(identifier: string) {
    await connectToDatabase();
    let product;

    // Check if valid ObjectId
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(identifier);
    }
    if (!product) {
      product = await Product.findOne({ slug: identifier.toLowerCase() });
    }

    if (!product) {
      throw new NotFoundError(`Product '${identifier}' not found`);
    }

    return product;
  }

  static async createProduct(data: Partial<IProduct>) {
    await connectToDatabase();
    const product = new Product(data);
    await product.save();
    return product;
  }

  static async updateProduct(identifier: string, data: Partial<IProduct>) {
    await connectToDatabase();
    const product = await this.getProductBySlugOrId(identifier);
    Object.assign(product, data);
    await product.save();
    return product;
  }

  static async deleteProduct(identifier: string) {
    await connectToDatabase();
    const product = await this.getProductBySlugOrId(identifier);
    await Product.findByIdAndDelete(product._id);
    return { id: product._id, slug: product.slug };
  }
}
