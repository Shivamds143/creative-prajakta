import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWishlist extends Document {
  customerId?: mongoose.Types.ObjectId;
  sessionId: string;
  products: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const WishlistSchema = new Schema<IWishlist>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", sparse: true },
    sessionId: { type: String, required: true, index: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  {
    timestamps: true,
  }
);

export const Wishlist: Model<IWishlist> =
  mongoose.models.Wishlist || mongoose.model<IWishlist>("Wishlist", WishlistSchema);

export default Wishlist;

