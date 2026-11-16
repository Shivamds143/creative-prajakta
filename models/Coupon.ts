import mongoose, { Schema, Document, Model } from "mongoose";

export type CouponDiscountType = "PERCENTAGE" | "FLAT";

export interface ICoupon extends Document {
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount?: number;
  validFrom: Date;
  validUntil: Date;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isValidNow(orderTotal?: number): { valid: boolean; reason?: string };
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    discountType: { type: String, enum: ["PERCENTAGE", "FLAT"], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minOrderValue: { type: Number, default: 0, min: 0 },
    maxDiscountAmount: { type: Number, min: 0 },
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date, required: true },
    usageLimit: { type: Number, default: 100, min: 1 },
    usedCount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

CouponSchema.methods.isValidNow = function (orderTotal = 0): { valid: boolean; reason?: string } {
  if (!this.isActive) return { valid: false, reason: "Coupon is inactive" };
  const now = new Date();
  if (now < this.validFrom) return { valid: false, reason: "Coupon is not yet active" };
  if (now > this.validUntil) return { valid: false, reason: "Coupon has expired" };
  if (this.usedCount >= this.usageLimit) return { valid: false, reason: "Coupon usage limit reached" };
  if (orderTotal < this.minOrderValue) {
    return {
      valid: false,
      reason: `Minimum order value of ₹${this.minOrderValue} required for this coupon`,
    };
  }
  return { valid: true };
};

export const Coupon: Model<ICoupon> =
  mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);

export default Coupon;

