import { NextRequest } from "next/server";
import { BannerService } from "@/services/banner.service";
import { createBannerSchema } from "@/lib/api/validation/schemas";
import { requireAdminAuth } from "@/lib/api/middleware/auth";
import { apiSuccess, handleApiError } from "@/lib/api/response";
import { BannerPlacement } from "@/models/Banner";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const placement = (searchParams.get("placement") as BannerPlacement) || undefined;
    const activeOnly = searchParams.get("all") !== "true";

    const banners = await BannerService.listBanners(placement, activeOnly);
    return apiSuccess(banners);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminAuth(req, ["superadmin", "admin", "editor"]);

    const body = await req.json();
    const validated = createBannerSchema.parse(body);

    const banner = await BannerService.createBanner(validated);
    return apiSuccess(banner, "Banner created successfully", 201);
  } catch (error) {
    return handleApiError(error);
  }
}

