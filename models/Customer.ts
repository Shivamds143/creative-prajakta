import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICustomerAddress {
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface ICustomer extends Document {
  name: string;
  phone: string;
  email?: string;
  addresses: ICustomerAddress[];
  ordersCount: number;
  totalSpent: number;
  isActive: boolean;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<ICustomerAddress>(
  {
    label: { type: String, default: "Home" },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, default: "India" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true, index: true },
    email: { type: String, lowercase: true, trim: true, sparse: true, index: true },
    addresses: [AddressSchema],
    ordersCount: { type: Number, default: 0, min: 0 },
    totalSpent: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    notes: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export const Customer: Model<ICustomer> =
  mongoose.models.Customer || mongoose.model<ICustomer>("Customer", CustomerSchema);

export default Customer;

