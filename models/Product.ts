import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICustomizationOptions {
  allowText: boolean;
  maxTextLength: number;
  allowImage: boolean;
  maxImages: number;
  giftWrapAvailable: boolean;
  cardMessageAvailable: boolean;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  mrp: number;
  images: string[];
  emoji: string;
  category: string;
  categorySlug: string;
  occasion: string[];
  recipient: string[];
  personalizable: boolean;
  customizationOptions: ICustomizationOptions;
  badge?: string;
  stock: number;
  inStock: boolean;
  isActive: boolean;
  rating: number;
  reviews: number;
  sku?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomizationOptionsSchema = new Schema<ICustomizationOptions>(
  {
    allowText: { type: Boolean, default: false },
    maxTextLength: { type: Number, default: 50 },
    allowImage: { type: Boolean, default: false },
    maxImages: { type: Number, default: 1 },
    giftWrapAvailable: { type: Boolean, default: true },
    cardMessageAvailable: { type: Boolean, default: true },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    emoji: { type: String, default: "🎁" },
    category: { type: String, required: true, index: true },
    categorySlug: { type: String, lowercase: true, index: true },
    occasion: [{ type: String, index: true }],
    recipient: [{ type: String, index: true }],
    personalizable: { type: Boolean, default: false, index: true },
    customizationOptions: {
      type: CustomizationOptionsSchema,
      default: () => ({
        allowText: false,
        maxTextLength: 50,
        allowImage: false,
        maxImages: 1,
        giftWrapAvailable: true,
        cardMessageAvailable: true,
      }),
    },
    badge: { type: String, trim: true },
    stock: { type: Number, default: 50, min: 0 },
    inStock: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true, index: true },
    rating: { type: Number, default: 4.8, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    sku: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

// Slug generation hook if missing
ProductSchema.pre("validate", function () {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  if (!this.categorySlug && this.category) {
    this.categorySlug = this.category
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  this.inStock = this.stock > 0;
});

// Index for full-text search
ProductSchema.index({ name: "text", description: "text" });

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
