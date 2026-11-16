import { apiSuccess, handleApiError } from "@/lib/api/response";
import { AdminService } from "@/services/admin.service";

export async function POST() {
  try {
    const result = await AdminService.seedDefaultAdmin();
    return apiSuccess(result, result.message);
  } catch (error) {
    return handleApiError(error);
  }
}

