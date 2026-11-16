import { NextRequest } from "next/server";
import { CategoryService } from "@/services/category.service";
import { createCategorySchema } from "@/lib/api/validation/schemas";
import { requireAdminAuth } from "@/lib/api/middleware/auth";
import { apiSuccess, handleApiError } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await CategoryService.listCategories(true);
    return apiSuccess(categories);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminAuth(req, ["superadmin", "admin", "editor"]);

    const body = await req.json();
    const validated = createCategorySchema.parse(body);

    const category = await CategoryService.createCategory(validated);
    return apiSuccess(category, "Category created successfully", 201);
  } catch (error) {
    return handleApiError(error);
  }
}

