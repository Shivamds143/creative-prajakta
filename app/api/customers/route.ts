import { NextRequest } from "next/server";
import { CustomerService } from "@/services/customer.service";
import { createCustomerSchema } from "@/lib/api/validation/schemas";
import { requireAdminAuth } from "@/lib/api/middleware/auth";
import { apiSuccess, handleApiError } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Only authenticated admin can view customer database
    await requireAdminAuth(req, ["superadmin", "admin", "support"]);

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 20);

    const result = await CustomerService.listCustomers(search, page, limit);

    return apiSuccess(result.items, "Customers retrieved", 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = createCustomerSchema.parse(body);

    const customer = await CustomerService.findOrCreateCustomer({
      name: validated.name,
      phone: validated.phone,
      email: validated.email || undefined,
      address: validated.addresses?.[0],
    });

    return apiSuccess(customer, "Customer registered/retrieved", 201);
  } catch (error) {
    return handleApiError(error);
  }
}

