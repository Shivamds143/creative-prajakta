import { NextRequest } from "next/server";
import { CategoryService } from "@/services/category.service";
import { updateCategorySchema } from "@/lib/api/validation/schemas";
import { requireAdminAuth } from "@/lib/api/middleware/auth";
import { apiSuccess, handleApiError } from "@/lib/api/response";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = await CategoryService.getCategoryBySlugOrId(params.id);
    return apiSuccess(category);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdminAuth(req, ["superadmin", "admin", "editor"]);

    const body = await req.json();
    const validated = updateCategorySchema.parse(body);

    const updated = await CategoryService.updateCategory(params.id, validated);
    return apiSuccess(updated, "Category updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdminAuth(req, ["superadmin", "admin"]);

    const result = await CategoryService.deleteCategory(params.id);
    return apiSuccess(result, "Category deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

