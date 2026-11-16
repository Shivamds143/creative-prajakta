import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export type AdminRole = "superadmin" | "admin" | "editor" | "support";

export interface IAdminUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: AdminRole;
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["superadmin", "admin", "editor", "support"],
      default: "admin",
      index: true,
    },
    permissions: [{ type: String }],
    isActive: { type: Boolean, default: true, index: true },
    lastLogin: { type: Date },
  },
  {
    timestamps: true,
  }
);

AdminUserSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

AdminUserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const AdminUser: Model<IAdminUser> =
  mongoose.models.AdminUser || mongoose.model<IAdminUser>("AdminUser", AdminUserSchema);

export default AdminUser;
