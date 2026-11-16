import { NextRequest } from "next/server";
import { AdminService } from "@/services/admin.service";
import { adminLoginSchema } from "@/lib/api/validation/schemas";
import { apiSuccess, handleApiError } from "@/lib/api/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = adminLoginSchema.parse(body);

    const result = await AdminService.login(validated.email, validated.password);

    return apiSuccess(result, "Login successful");
  } catch (error) {
    return handleApiError(error);
  }
}

