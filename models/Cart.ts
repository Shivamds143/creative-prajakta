import mongoose, { Schema, Document, Model } from "mongoose";
import { IOrderItemCustomization } from "./Order";

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  customization?: IOrderItemCustomization;
  addedAt: Date;
}

export interface ICart extends Document {
  customerId?: mongoose.Types.ObjectId;
  sessionId: string;
  items: ICartItem[];
  couponCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    customization: {
      customText: { type: String },
      customImages: [{ type: String }],
      giftWrap: { type: Boolean, default: false },
      cardMessage: { type: String },
      instructions: { type: String },
    },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const CartSchema = new Schema<ICart>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", sparse: true },
    sessionId: { type: String, required: true, index: true },
    items: [CartItemSchema],
    couponCode: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Cart: Model<ICart> =
  mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);

export default Cart;

