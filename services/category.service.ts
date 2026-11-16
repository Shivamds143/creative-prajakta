import connectToDatabase from "@/lib/db/mongoose";
import { Category, ICategory } from "@/models/Category";
import { NotFoundError } from "@/lib/api/errors";

export class CategoryService {
  static async listCategories(activeOnly = true) {
    await connectToDatabase();
    const query = activeOnly ? { isActive: true } : {};
    return Category.find(query).sort({ sortOrder: 1, name: 1 }).lean();
  }

  static async getCategoryBySlugOrId(identifier: string) {
    await connectToDatabase();
    let category;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(identifier);
    }
    if (!category) {
      category = await Category.findOne({ slug: identifier.toLowerCase() });
    }
    if (!category) {
      throw new NotFoundError(`Category '${identifier}' not found`);
    }
    return category;
  }

  static async createCategory(data: Partial<ICategory>) {
    await connectToDatabase();
    const category = new Category(data);
    await category.save();
    return category;
  }

  static async updateCategory(identifier: string, data: Partial<ICategory>) {
    await connectToDatabase();
    const category = await this.getCategoryBySlugOrId(identifier);
    Object.assign(category, data);
    await category.save();
    return category;
  }

  static async deleteCategory(identifier: string) {
    await connectToDatabase();
    const category = await this.getCategoryBySlugOrId(identifier);
    await Category.findByIdAndDelete(category._id);
    return { id: category._id, slug: category.slug };
  }
}

