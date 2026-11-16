import connectToDatabase from "@/lib/db/mongoose";
import { AdminUser, IAdminUser } from "@/models/AdminUser";
import { UnauthorizedError, NotFoundError } from "@/lib/api/errors";
import { signAdminToken } from "@/lib/api/middleware/auth";

export class AdminService {
  static async login(email: string, password: string) {
    await connectToDatabase();
    const admin = await AdminUser.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!admin || !admin.isActive) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid email or password");
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = signAdminToken({
      adminId: (admin._id as { toString(): string }).toString(),
      email: admin.email,
      role: admin.role,
      name: admin.name,
    });

    return {
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        lastLogin: admin.lastLogin,
      },
      token,
    };
  }

  static async getAdminById(id: string) {
    await connectToDatabase();
    const admin = await AdminUser.findById(id).select("-password");
    if (!admin) {
      throw new NotFoundError("Admin user not found");
    }
    return admin;
  }

  static async createAdmin(data: Partial<IAdminUser>) {
    await connectToDatabase();
    const admin = new AdminUser(data);
    await admin.save();
    return {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
      isActive: admin.isActive,
    };
  }

  static async seedDefaultAdmin() {
    await connectToDatabase();
    const count = await AdminUser.countDocuments();
    if (count > 0) {
      return { created: false, message: "Admin users already exist." };
    }

    const defaultAdmin = new AdminUser({
      name: "Super Admin",
      email: "admin@giftaura.com",
      password: "Admin@GiftAura2026!",
      role: "superadmin",
      permissions: ["all"],
      isActive: true,
    });

    await defaultAdmin.save();
    return {
      created: true,
      message: "Default superadmin created successfully.",
      email: defaultAdmin.email,
    };
  }
}

