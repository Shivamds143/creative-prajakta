import { NextRequest } from "next/server";
import { ProductService } from "@/services/product.service";
import { updateProductSchema } from "@/lib/api/validation/schemas";
import { requireAdminAuth } from "@/lib/api/middleware/auth";
import { apiSuccess, handleApiError } from "@/lib/api/response";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await ProductService.getProductBySlugOrId(params.id);
    return apiSuccess(product);
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
    const validated = updateProductSchema.parse(body);

    const updated = await ProductService.updateProduct(params.id, validated);
    return apiSuccess(updated, "Product updated successfully");
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

    const result = await ProductService.deleteProduct(params.id);
    return apiSuccess(result, "Product deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

