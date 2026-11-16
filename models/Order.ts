import mongoose, { Schema, Document, Model } from "mongoose";

export type OrderStatus =
  | "PENDING_WHATSAPP"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING_VERIFICATION" | "PAID" | "FAILED" | "REFUNDED";

export interface IOrderItemCustomization {
  customText?: string;
  customImages?: string[];
  giftWrap?: boolean;
  cardMessage?: string;
  instructions?: string;
}

export interface IOrderItem {
  productId?: mongoose.Types.ObjectId;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  emoji?: string;
  imageUrl?: string;
  customization?: IOrderItemCustomization;
  subtotal: number;
}

export interface IOrderCustomer {
  customerId?: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  email?: string;
}

export interface IOrderShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IOrderPricing {
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  totalAmount: number;
}

export interface IOrderPayment {
  method: "WHATSAPP";
  status: PaymentStatus;
  notes?: string;
  verifiedAt?: Date;
}

export interface IOrderWhatsAppDetails {
  targetPhone: string;
  encodedUrl: string;
  prefilledMessage: string;
  redirectedAt?: Date;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer: IOrderCustomer;
  shippingAddress: IOrderShippingAddress;
  items: IOrderItem[];
  pricing: IOrderPricing;
  payment: IOrderPayment;
  orderStatus: OrderStatus;
  whatsappDetails: IOrderWhatsAppDetails;
  adminNotes?: string;
  customerNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemCustomizationSchema = new Schema<IOrderItemCustomization>(
  {
    customText: { type: String, trim: true },
    customImages: [{ type: String }],
    giftWrap: { type: Boolean, default: false },
    cardMessage: { type: String, trim: true },
    instructions: { type: String, trim: true },
  },
  { _id: false }
);

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    slug: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    emoji: { type: String },
    imageUrl: { type: String },
    customization: { type: OrderItemCustomizationSchema, default: () => ({}) },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: {
      customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true, index: true },
      email: { type: String, lowercase: true, trim: true },
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: "India" },
    },
    items: [OrderItemSchema],
    pricing: {
      subtotal: { type: Number, required: true, min: 0 },
      discount: { type: Number, default: 0, min: 0 },
      couponCode: { type: String },
      shippingFee: { type: Number, default: 0, min: 0 },
      totalAmount: { type: Number, required: true, min: 0 },
    },
    payment: {
      method: { type: String, enum: ["WHATSAPP"], default: "WHATSAPP" },
      status: {
        type: String,
        enum: ["PENDING_VERIFICATION", "PAID", "FAILED", "REFUNDED"],
        default: "PENDING_VERIFICATION",
      },
      notes: { type: String },
      verifiedAt: { type: Date },
    },
    orderStatus: {
      type: String,
      enum: ["PENDING_WHATSAPP", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING_WHATSAPP",
      index: true,
    },
    whatsappDetails: {
      targetPhone: { type: String, required: true },
      encodedUrl: { type: String, required: true },
      prefilledMessage: { type: String, required: true },
      redirectedAt: { type: Date },
    },
    adminNotes: { type: String },
    customerNotes: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;

