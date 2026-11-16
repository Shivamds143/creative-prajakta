import mongoose, { Schema, Document, Model } from "mongoose";

export type CustomizationType = "TEXT" | "IMAGE" | "COMBO" | "WRAP" | "GREETING_CARD";
export type CustomizationFieldType = "text" | "textarea" | "image" | "boolean" | "select";

export interface ICustomizationField {
  name: string;
  label: string;
  fieldType: CustomizationFieldType;
  required: boolean;
  maxChars?: number;
  options?: string[];
  extraPrice: number;
}

export interface IGiftCustomization extends Document {
  title: string;
  code: string;
  type: CustomizationType;
  description?: string;
  fields: ICustomizationField[];
  basePrice: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CustomizationFieldSchema = new Schema<ICustomizationField>(
  {
    name: { type: String, required: true },
    label: { type: String, required: true },
    fieldType: {
      type: String,
      enum: ["text", "textarea", "image", "boolean", "select"],
      default: "text",
    },
    required: { type: Boolean, default: false },
    maxChars: { type: Number },
    options: [{ type: String }],
    extraPrice: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const GiftCustomizationSchema = new Schema<IGiftCustomization>(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    type: {
      type: String,
      enum: ["TEXT", "IMAGE", "COMBO", "WRAP", "GREETING_CARD"],
      required: true,
      index: true,
    },
    description: { type: String, default: "" },
    fields: [CustomizationFieldSchema],
    basePrice: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

export const GiftCustomization: Model<IGiftCustomization> =
  mongoose.models.GiftCustomization ||
  mongoose.model<IGiftCustomization>("GiftCustomization", GiftCustomizationSchema);

export default GiftCustomization;

