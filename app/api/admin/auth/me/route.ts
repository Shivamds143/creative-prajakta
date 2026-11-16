import { NextRequest } from "next/server";
import { AdminService } from "@/services/admin.service";
import { requireAdminAuth } from "@/lib/api/middleware/auth";
import { apiSuccess, handleApiError } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdminAuth(req);
    const admin = await AdminService.getAdminById(auth.adminId);

    return apiSuccess({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
      lastLogin: admin.lastLogin,
      createdAt: admin.createdAt,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

