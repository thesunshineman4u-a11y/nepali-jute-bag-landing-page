import { describe, expect, it } from "vitest";
import {
  createOrderRecord,
  OrderValidationError,
  parseOrderInput,
} from "@/lib/order-schema";

const validOrder = {
  submissionId: "123e4567-e89b-42d3-a456-426614174000",
  fullName: "Aarav Shrestha",
  phone: "+977 9812345678",
  email: "aarav@example.com",
  location: "Patan Dhoka, Lalitpur",
  productSku: "standard",
  productName: "Classic Nepali Jute Bag",
  quantity: 2,
  pricePerPiece: 2999,
  totalPrice: 5998,
};

describe("order validation", () => {
  it("accepts a valid server-priced order", () => {
    const input = parseOrderInput(validOrder);
    const record = createOrderRecord(input, new Date("2026-10-26T06:00:00.000Z"));

    expect(record.orderId).toBe("NJB-20261026-14174000");
    expect(record.totalPrice).toBe(5998);
    expect(record.paymentMethod).toBe("Cash On Delivery");
    expect(record.status).toBe("New Order");
  });

  it("rejects invalid contact fields", () => {
    expect(() =>
      parseOrderInput({ ...validOrder, email: "not-an-email", phone: "12" }),
    ).toThrow(OrderValidationError);
  });

  it("rejects a client-tampered price", () => {
    expect(() => parseOrderInput({ ...validOrder, totalPrice: 1 })).toThrow(
      "The product price changed",
    );
  });

  it("enforces the premium product price", () => {
    expect(() =>
      parseOrderInput({
        ...validOrder,
        productSku: "premium",
        productName: "Premium Nepali Jute Bag",
        quantity: 1,
        pricePerPiece: 2999,
        totalPrice: 2999,
      }),
    ).not.toThrow();
  });
});
