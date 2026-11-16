import { NextRequest } from "next/server";
import { OrderService } from "@/services/order.service";
import { whatsAppCheckoutSchema } from "@/lib/api/validation/schemas";
import { apiSuccess, handleApiError } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = whatsAppCheckoutSchema.parse(body);

    const result = await OrderService.createWhatsAppOrder(validated);

    return apiSuccess(
      {
        orderNumber: result.orderNumber,
        whatsappUrl: result.whatsappUrl,
        whatsappMessage: result.whatsappMessage,
        orderId: result.order._id,
        totalAmount: result.order.pricing.totalAmount,
        status: result.order.orderStatus,
      },
      "WhatsApp order created successfully",
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

