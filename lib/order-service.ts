import "server-only";

import { appendOrderToSheet } from "@/lib/google-sheets";
import { sendBusinessOrderEmail, sendCustomerOrderEmail } from "@/lib/email";
import {
  createOrderRecord,
  parseOrderInput,
  type OrderRecord,
} from "@/lib/order-schema";

export async function submitOrder(payload: unknown): Promise<OrderRecord> {
  const input = parseOrderInput(payload);
  const order = createOrderRecord(input);

  if (process.env.ORDER_INTEGRATION_MODE === "mock") {
    return order;
  }

  await appendOrderToSheet(order);
  await Promise.all([
    sendBusinessOrderEmail(order),
    sendCustomerOrderEmail(order),
  ]);

  return order;
}
