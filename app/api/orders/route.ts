import { NextRequest } from "next/server";
import { OrderService } from "@/services/order.service";
import { requireAdminAuth } from "@/lib/api/middleware/auth";
import { apiSuccess, handleApiError } from "@/lib/api/response";
import { OrderStatus } from "@/models/Order";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireAdminAuth(req, ["superadmin", "admin", "editor", "support"]);

    const { searchParams } = new URL(req.url);
    const status = (searchParams.get("status") as OrderStatus) || undefined;
    const phone = searchParams.get("phone") || undefined;
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 20);

    const result = await OrderService.listOrders({ status, phone }, page, limit);

    return apiSuccess(result.items, "Orders retrieved successfully", 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

