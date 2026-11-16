import connectToDatabase from "@/lib/db/mongoose";
import { Order, IOrder, OrderStatus, PaymentStatus } from "@/models/Order";
import { CustomerService } from "./customer.service";
import { Coupon } from "@/models/Coupon";
import { config } from "@/lib/config/env";
import { NotFoundError } from "@/lib/api/errors";

export interface CreateWhatsAppCheckoutInput {
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
  };
  items: Array<{
    productId?: string;
    slug: string;
    name: string;
    price: number;
    quantity: number;
    emoji?: string;
    imageUrl?: string;
    customization?: {
      customText?: string;
      customImages?: string[];
      giftWrap?: boolean;
      cardMessage?: string;
      instructions?: string;
    };
  }>;
  couponCode?: string;
  customerNotes?: string;
}

export class OrderService {
  static generateOrderNumber(): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `GA-${dateStr}-${randomHex}`;
  }

  static generateWhatsAppMessage(
    orderNumber: string,
    customer: CreateWhatsAppCheckoutInput["customer"],
    shippingAddress: CreateWhatsAppCheckoutInput["shippingAddress"],
    items: CreateWhatsAppCheckoutInput["items"],
    pricing: { subtotal: number; discount: number; totalAmount: number; couponCode?: string },
    customerNotes?: string
  ): string {
    let msg = `🎁 *NEW GIFTAURA ORDER*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `*Order #:* ${orderNumber}\n`;
    msg += `*Customer:* ${customer.name}\n`;
    msg += `*Phone:* ${customer.phone}\n`;
    if (customer.email) msg += `*Email:* ${customer.email}\n`;
    msg += `*Address:* ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.postalCode}\n\n`;

    msg += `📦 *ITEMS ORDERED:*\n`;
    items.forEach((item, index) => {
      const itemSubtotal = item.price * item.quantity;
      msg += `${index + 1}. *${item.name}* (Qty: ${item.quantity}) - ₹${itemSubtotal}\n`;

      if (item.customization) {
        if (item.customization.customText) {
          msg += `   ✍️ Custom Text: "${item.customization.customText}"\n`;
        }
        if (item.customization.cardMessage) {
          msg += `   💌 Greeting Note: "${item.customization.cardMessage}"\n`;
        }
        if (item.customization.giftWrap) {
          msg += `   🎀 Gift Wrap Requested: Yes\n`;
        }
        if (item.customization.customImages && item.customization.customImages.length > 0) {
          msg += `   📸 Photo(s): ${item.customization.customImages.length} attached / to send\n`;
        }
        if (item.customization.instructions) {
          msg += `   ℹ️ Note: ${item.customization.instructions}\n`;
        }
      }
    });

    msg += `\n💰 *PAYMENT SUMMARY:*\n`;
    msg += `Subtotal: ₹${pricing.subtotal}\n`;
    if (pricing.discount > 0) {
      msg += `Discount (${pricing.couponCode || "Coupon"}): -₹${pricing.discount}\n`;
    }
    msg += `*Total Amount to Pay: ₹${pricing.totalAmount}*\n`;
    msg += `*Payment Method:* Direct on WhatsApp (UPI / Bank Transfer)\n`;

    if (customerNotes) {
      msg += `\n📝 *Special Request:* ${customerNotes}\n`;
    }

    msg += `\nHi GiftAura Team! Please confirm my order and share the UPI payment details to proceed. Thank you! 🙏✨`;

    return msg;
  }

  static async createWhatsAppOrder(input: CreateWhatsAppCheckoutInput) {
    await connectToDatabase();

    // 1. Calculate pricing
    let subtotal = 0;
    const processedItems = input.items.map((item) => {
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;
      return {
        ...item,
        subtotal: itemSubtotal,
      };
    });

    let discount = 0;
    if (input.couponCode) {
      const coupon = await Coupon.findOne({
        code: input.couponCode.toUpperCase().trim(),
        isActive: true,
      });
      if (coupon) {
        const check = coupon.isValidNow(subtotal);
        if (check.valid) {
          if (coupon.discountType === "PERCENTAGE") {
            discount = Math.round((subtotal * coupon.discountValue) / 100);
            if (coupon.maxDiscountAmount) {
              discount = Math.min(discount, coupon.maxDiscountAmount);
            }
          } else {
            discount = Math.min(coupon.discountValue, subtotal);
          }
          coupon.usedCount += 1;
          await coupon.save();
        }
      }
    }

    const shippingFee = 0;
    const totalAmount = Math.max(0, subtotal - discount + shippingFee);

    // 2. Register or update customer
    const customerRecord = await CustomerService.findOrCreateCustomer({
      name: input.customer.name,
      phone: input.customer.phone,
      email: input.customer.email,
      address: {
        label: "Delivery Address",
        fullName: input.customer.name,
        phone: input.customer.phone,
        street: input.shippingAddress.street,
        city: input.shippingAddress.city,
        state: input.shippingAddress.state,
        postalCode: input.shippingAddress.postalCode,
        country: input.shippingAddress.country || "India",
        isDefault: true,
      },
    });

    // 3. Generate Order Number & WhatsApp Message
    const orderNumber = this.generateOrderNumber();
    const whatsappMessage = this.generateWhatsAppMessage(
      orderNumber,
      input.customer,
      input.shippingAddress,
      input.items,
      { subtotal, discount, totalAmount, couponCode: input.couponCode },
      input.customerNotes
    );

    const targetPhone = config.whatsappPhone.replace(/[^0-9]/g, "");
    const encodedUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(whatsappMessage)}`;

    // 4. Save Order in MongoDB
    const order = new Order({
      orderNumber,
      customer: {
        customerId: customerRecord._id,
        name: input.customer.name,
        phone: input.customer.phone,
        email: input.customer.email,
      },
      shippingAddress: {
        street: input.shippingAddress.street,
        city: input.shippingAddress.city,
        state: input.shippingAddress.state,
        postalCode: input.shippingAddress.postalCode,
        country: input.shippingAddress.country || "India",
      },
      items: processedItems,
      pricing: {
        subtotal,
        discount,
        couponCode: input.couponCode,
        shippingFee,
        totalAmount,
      },
      payment: {
        method: "WHATSAPP",
        status: "PENDING_VERIFICATION",
      },
      orderStatus: "PENDING_WHATSAPP",
      whatsappDetails: {
        targetPhone,
        encodedUrl,
        prefilledMessage: whatsappMessage,
        redirectedAt: new Date(),
      },
      customerNotes: input.customerNotes,
    });

    await order.save();

    // Update customer stats
    customerRecord.ordersCount += 1;
    customerRecord.totalSpent += totalAmount;
    await customerRecord.save();

    return {
      order,
      whatsappUrl: encodedUrl,
      whatsappMessage,
      orderNumber,
    };
  }

  static async listOrders(
    filter: { status?: OrderStatus; phone?: string } = {},
    page = 1,
    limit = 20
  ) {
    await connectToDatabase();
    const query: Record<string, any> = {};
    if (filter.status) query.orderStatus = filter.status;
    if (filter.phone) query["customer.phone"] = filter.phone;

    const skip = (Math.max(1, page) - 1) * limit;
    const [items, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(query),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getOrderByIdOrNumber(identifier: string) {
    await connectToDatabase();
    let order;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(identifier);
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: identifier.toUpperCase() });
    }
    if (!order) {
      throw new NotFoundError(`Order '${identifier}' not found`);
    }
    return order;
  }

  static async updateOrderStatus(
    identifier: string,
    orderStatus?: OrderStatus,
    paymentStatus?: PaymentStatus,
    adminNotes?: string
  ) {
    await connectToDatabase();
    const order = await this.getOrderByIdOrNumber(identifier);

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) {
      order.payment.status = paymentStatus;
      if (paymentStatus === "PAID") {
        order.payment.verifiedAt = new Date();
      }
    }
    if (adminNotes !== undefined) order.adminNotes = adminNotes;

    await order.save();
    return order;
  }
}
