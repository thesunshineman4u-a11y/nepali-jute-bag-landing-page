import { z } from "zod";
import { formatOrderDate } from "@/lib/format";
import { getProduct, productVariants, type ProductSku } from "@/lib/product";

const phonePattern = /^[+()\-\s0-9]{7,20}$/;

export const orderInputSchema = z.object({
  submissionId: z.string().uuid("Please refresh the checkout and try again."),
  fullName: z.string().trim().min(2, "Please enter your full name.").max(100),
  phone: z
    .string()
    .trim()
    .regex(phonePattern, "Please enter a valid phone number."),
  email: z.string().trim().email("Please enter a valid email address.").max(160),
  location: z
    .string()
    .trim()
    .min(5, "Kindly share your exact location.")
    .max(300),
  productSku: z.enum(["standard", "premium"]),
  productName: z.string().trim().min(1, "Product name is required."),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1.").max(20),
  pricePerPiece: z.coerce.number().positive("Price per piece must be valid."),
  totalPrice: z.coerce.number().positive("Total price must be valid."),
});

export type OrderInput = z.infer<typeof orderInputSchema>;

export type OrderRecord = {
  orderId: string;
  createdAt: string;
  customerName: string;
  phone: string;
  email: string;
  location: string;
  productSku: ProductSku;
  productName: string;
  quantity: number;
  pricePerPiece: number;
  totalPrice: number;
  paymentMethod: "Cash On Delivery";
  status: "New Order";
  notes: "";
};

export class OrderValidationError extends Error {
  constructor(
    message: string,
    public readonly fieldErrors: Record<string, string>,
  ) {
    super(message);
  }
}

export function parseOrderInput(payload: unknown): OrderInput {
  const parsed = orderInputSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    throw new OrderValidationError("Please check the highlighted fields.", fieldErrors);
  }

  const input = parsed.data;
  const product = getProduct(input.productSku);
  const expectedTotal = product.price * input.quantity;
  const pricingIsValid =
    input.productName === product.name &&
    input.pricePerPiece === product.price &&
    input.totalPrice === expectedTotal;

  if (!pricingIsValid) {
    throw new OrderValidationError(
      "The product price changed. Please return to the shop and try again.",
      { product: "Invalid product or pricing details." },
    );
  }

  return input;
}

export function createOrderRecord(input: OrderInput, now = new Date()): OrderRecord {
  const product = productVariants[input.productSku];
  const compactDate = now.toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = input.submissionId.replaceAll("-", "").slice(-8).toUpperCase();

  return {
    orderId: `NJB-${compactDate}-${suffix}`,
    createdAt: formatOrderDate(now),
    customerName: input.fullName,
    phone: input.phone,
    email: input.email,
    location: input.location,
    productSku: input.productSku,
    productName: product.name,
    quantity: input.quantity,
    pricePerPiece: product.price,
    totalPrice: product.price * input.quantity,
    paymentMethod: "Cash On Delivery",
    status: "New Order",
    notes: "",
  };
}
