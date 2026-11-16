import { NextRequest } from "next/server";
import { UploadService } from "@/services/upload.service";
import { apiSuccess, handleApiError, apiError } from "@/lib/api/response";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "products";

    if (!file) {
      return apiError("No file provided in form data with key 'file'", 400);
    }

    const uploadResult = await UploadService.uploadImage(file, folder);

    return apiSuccess(uploadResult, "File uploaded successfully", 201);
  } catch (error) {
    return handleApiError(error);
  }
}

