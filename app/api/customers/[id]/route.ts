import { NextRequest } from "next/server";
import { CustomerService } from "@/services/customer.service";
import { updateCustomerSchema } from "@/lib/api/validation/schemas";
import { requireAdminAuth } from "@/lib/api/middleware/auth";
import { apiSuccess, handleApiError } from "@/lib/api/response";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdminAuth(req, ["superadmin", "admin", "support"]);
    const customer = await CustomerService.getCustomerById(params.id);
    return apiSuccess(customer);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdminAuth(req, ["superadmin", "admin"]);
    const body = await req.json();
    const validated = updateCustomerSchema.parse(body);

    const updated = await CustomerService.updateCustomer(params.id, validated);
    return apiSuccess(updated, "Customer updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

