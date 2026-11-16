import connectToDatabase from "@/lib/db/mongoose";
import { Banner, IBanner, BannerPlacement } from "@/models/Banner";
import { NotFoundError } from "@/lib/api/errors";

export class BannerService {
  static async listBanners(placement?: BannerPlacement, activeOnly = true) {
    await connectToDatabase();
    const query: Record<string, unknown> = {};
    if (activeOnly) {
      query.isActive = true;
    }
    if (placement) {
      query.placement = placement;
    }
    return Banner.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean();
  }

  static async getBannerById(id: string) {
    await connectToDatabase();
    const banner = await Banner.findById(id);
    if (!banner) {
      throw new NotFoundError(`Banner '${id}' not found`);
    }
    return banner;
  }

  static async createBanner(data: Partial<IBanner>) {
    await connectToDatabase();
    const banner = new Banner(data);
    await banner.save();
    return banner;
  }

  static async updateBanner(id: string, data: Partial<IBanner>) {
    await connectToDatabase();
    const banner = await this.getBannerById(id);
    Object.assign(banner, data);
    await banner.save();
    return banner;
  }

  static async deleteBanner(id: string) {
    await connectToDatabase();
    const banner = await this.getBannerById(id);
    await Banner.findByIdAndDelete(banner._id);
    return { id: banner._id };
  }
}

