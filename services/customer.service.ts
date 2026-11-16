import connectToDatabase from "@/lib/db/mongoose";
import { Customer, ICustomer } from "@/models/Customer";
import { NotFoundError } from "@/lib/api/errors";

export class CustomerService {
  static async listCustomers(search?: string, page = 1, limit = 20) {
    await connectToDatabase();
    const query: Record<string, any> = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Math.max(1, page) - 1) * limit;
    const [items, total] = await Promise.all([
      Customer.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Customer.countDocuments(query),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getCustomerById(id: string) {
    await connectToDatabase();
    const customer = await Customer.findById(id);
    if (!customer) {
      throw new NotFoundError(`Customer with ID '${id}' not found`);
    }
    return customer;
  }

  static async getCustomerByPhone(phone: string) {
    await connectToDatabase();
    return Customer.findOne({ phone: phone.trim() });
  }

  static async findOrCreateCustomer(data: {
    name: string;
    phone: string;
    email?: string;
    address?: unknown;
  }) {
    await connectToDatabase();
    let customer = await Customer.findOne({ phone: data.phone.trim() });
    if (!customer) {
      customer = new Customer({
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email?.trim() || undefined,
        addresses: data.address ? [data.address] : [],
      });
      await customer.save();
    } else {
      let modified = false;
      if (!customer.name && data.name) {
        customer.name = data.name.trim();
        modified = true;
      }
      if (!customer.email && data.email) {
        customer.email = data.email.trim();
        modified = true;
      }
      if (modified) await customer.save();
    }
    return customer;
  }

  static async updateCustomer(id: string, data: Partial<ICustomer>) {
    await connectToDatabase();
    const customer = await this.getCustomerById(id);
    Object.assign(customer, data);
    await customer.save();
    return customer;
  }
}
