import { z } from "zod";

// --- Product Schemas ---
export const productCustomizationOptionsSchema = z.object({
  allowText: z.boolean().default(false),
  maxTextLength: z.number().int().min(1).max(500).default(50),
  allowImage: z.boolean().default(false),
  maxImages: z.number().int().min(1).max(10).default(1),
  giftWrapAvailable: z.boolean().default(true),
  cardMessageAvailable: z.boolean().default(true),
});

export const createProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters").max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens").optional(),
  description: z.string().max(2000).optional().default(""),
  price: z.number().positive("Price must be greater than 0"),
  mrp: z.number().positive("MRP must be greater than 0"),
  images: z.array(z.string().url().or(z.string().startsWith("/"))).default([]),
  emoji: z.string().min(1).max(10).default("🎁"),
  category: z.string().min(1, "Category is required"),
  occasion: z.array(z.string()).default([]),
  recipient: z.array(z.string()).default([]),
  personalizable: z.boolean().default(false),
  customizationOptions: productCustomizationOptionsSchema.optional(),
  badge: z.string().max(50).optional(),
  stock: z.number().int().min(0).default(50),
  inStock: z.boolean().default(true),
  isActive: z.boolean().default(true),
  rating: z.number().min(0).max(5).default(4.8),
  reviews: z.number().int().min(0).default(0),
  sku: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  category: z.string().optional(),
  occasion: z.string().optional(),
  recipient: z.string().optional(),
  personalizable: z.enum(["true", "false"]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(["newest", "price_asc", "price_desc", "rating"]).default("newest"),
});

// --- Category Schemas ---
export const createCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters").max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  description: z.string().max(500).optional().default(""),
  image: z.string().optional().default(""),
  icon: z.string().optional().default("🎁"),
  badge: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const updateCategorySchema = createCategorySchema.partial();

// --- Customer Schemas ---
export const customerAddressSchema = z.object({
  label: z.string().default("Home"),
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  street: z.string().min(3, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  country: z.string().default("India"),
  isDefault: z.boolean().default(false),
});

export const createCustomerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  addresses: z.array(customerAddressSchema).optional().default([]),
  notes: z.string().max(1000).optional().default(""),
  isActive: z.boolean().default(true),
});

export const updateCustomerSchema = createCustomerSchema.partial();

// --- Admin Auth Schemas ---
export const adminLoginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const adminCreateSchema = z.object({
  name: z.string().min(2, "Admin name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["superadmin", "admin", "editor", "support"]).default("admin"),
  permissions: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

// --- WhatsApp Checkout & Order Schemas ---
export const orderItemCustomizationSchema = z.object({
  customText: z.string().max(500).optional(),
  customImages: z.array(z.string()).optional(),
  giftWrap: z.boolean().default(false),
  cardMessage: z.string().max(500).optional(),
  instructions: z.string().max(1000).optional(),
});

export const orderItemSchema = z.object({
  productId: z.string().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().min(1),
  emoji: z.string().optional(),
  imageUrl: z.string().optional(),
  customization: orderItemCustomizationSchema.optional(),
});

export const whatsAppCheckoutSchema = z.object({
  customer: z.object({
    name: z.string().min(2, "Customer name is required"),
    phone: z.string().min(10, "Valid phone number is required for WhatsApp communication"),
    email: z.string().email().optional().or(z.literal("")),
  }),
  shippingAddress: z.object({
    street: z.string().min(3, "Street address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    postalCode: z.string().min(4, "Postal code is required"),
    country: z.string().default("India"),
  }),
  items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
  couponCode: z.string().optional(),
  customerNotes: z.string().max(1000).optional(),
});

// --- Banner Schemas ---
export const createBannerSchema = z.object({
  title: z.string().min(2).max(150),
  subtitle: z.string().max(300).optional().default(""),
  imageUrl: z.string().min(1, "Banner image URL is required"),
  mobileImageUrl: z.string().optional(),
  linkUrl: z.string().default("/shop"),
  buttonText: z.string().default("Shop Now"),
  placement: z.enum(["HERO_SLIDER", "PROMO_BANNER", "OCCASION_STRIP", "NOTICE_BAR"]).default("HERO_SLIDER"),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export const updateBannerSchema = createBannerSchema.partial();

// --- Coupon Schemas ---
export const createCouponSchema = z.object({
  code: z.string().min(3).max(30).toUpperCase(),
  discountType: z.enum(["PERCENTAGE", "FLAT"]),
  discountValue: z.number().positive(),
  minOrderValue: z.number().min(0).default(0),
  maxDiscountAmount: z.number().positive().optional(),
  validFrom: z.coerce.date().default(() => new Date()),
  validUntil: z.coerce.date(),
  usageLimit: z.number().int().positive().default(100),
  isActive: z.boolean().default(true),
});

