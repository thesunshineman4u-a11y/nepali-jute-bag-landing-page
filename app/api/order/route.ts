import { NextRequest, NextResponse } from "next/server";
import { OrderValidationError } from "@/lib/order-schema";
import { submitOrder } from "@/lib/order-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAllowedOrigin(request: NextRequest) {
  const configuredOrigin = process.env.FRONTEND_URL?.trim();
  const requestOrigin = request.headers.get("origin");
  if (!configuredOrigin || !requestOrigin) return true;

  try {
    return new URL(requestOrigin).origin === new URL(configuredOrigin).origin;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json(
      { success: false, message: "This request origin is not allowed." },
      { status: 403 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "The order request is not valid JSON." },
      { status: 400 },
    );
  }

  try {
    const order = await submitOrder(payload);
    return NextResponse.json({
      success: true,
      order: {
        orderId: order.orderId,
        productName: order.productName,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        paymentMethod: order.paymentMethod,
      },
    });
  } catch (error) {
    if (error instanceof OrderValidationError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          fieldErrors: error.fieldErrors,
        },
        { status: 400 },
      );
    }

    console.error("Order submission failed", {
      reason: error instanceof Error ? error.message : "Unknown server error",
    });
    return NextResponse.json(
      {
        success: false,
        message:
          "We could not complete your order right now. Please try again in a moment.",
      },
      { status: 500 },
    );
  }
}
