import mongoose, { Schema, Document, Model } from "mongoose";

export type BannerPlacement = "HERO_SLIDER" | "PROMO_BANNER" | "OCCASION_STRIP" | "NOTICE_BAR";

export interface IBanner extends Document {
  title: string;
  subtitle?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  linkUrl: string;
  buttonText: string;
  placement: BannerPlacement;
  sortOrder: number;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "" },
    imageUrl: { type: String, required: true },
    mobileImageUrl: { type: String },
    linkUrl: { type: String, default: "/shop" },
    buttonText: { type: String, default: "Shop Now" },
    placement: {
      type: String,
      enum: ["HERO_SLIDER", "PROMO_BANNER", "OCCASION_STRIP", "NOTICE_BAR"],
      default: "HERO_SLIDER",
      index: true,
    },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const Banner: Model<IBanner> =
  mongoose.models.Banner || mongoose.model<IBanner>("Banner", BannerSchema);

export default Banner;

