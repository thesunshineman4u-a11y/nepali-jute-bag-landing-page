import "server-only";

import nodemailer, { type Transporter } from "nodemailer";
import type { OrderRecord } from "@/lib/order-schema";
import { formatNpr } from "@/lib/format";

let transporter: Transporter | undefined;

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function escapeHtml(value: string | number) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getTransporter() {
  if (transporter) return transporter;
  const port = Number(requiredEnv("SMTP_PORT"));
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("SMTP_PORT must be a valid port number.");
  }
  transporter = nodemailer.createTransport({
    host: requiredEnv("SMTP_HOST"),
    port,
    secure: port === 465,
    auth: {
      user: requiredEnv("SMTP_USER"),
      pass: requiredEnv("SMTP_PASS"),
    },
  });
  return transporter;
}

function layout(content: string, preheader: string) {
  return `<!doctype html>
  <html lang="en">
    <head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
    <body style="margin:0;background:#f5eee3;font-family:Arial,sans-serif;color:#2b1c14;">
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5eee3;padding:24px 12px;">
        <tr><td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#fffaf1;border-radius:22px;overflow:hidden;border:1px solid #eadac1;box-shadow:0 18px 45px rgba(75,48,36,.10);">
            ${content}
          </table>
          <p style="margin:20px 0 0;color:#7a685b;font-size:12px;line-height:18px;">Please keep this email for your records.</p>
        </td></tr>
      </table>
    </body>
  </html>`;
}

function header(brand: string, eyebrow: string, title: string, intro: string) {
  return `<tr><td style="padding:32px;background:#4b3024;text-align:center;">
    <div style="color:#e8c98c;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:bold;">${escapeHtml(brand)}</div>
    <div style="margin-top:18px;color:#e8c98c;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:1.5px;">${escapeHtml(eyebrow)}</div>
    <h1 style="margin:8px 0 8px;color:#fffaf1;font-family:Georgia,serif;font-size:30px;line-height:38px;">${escapeHtml(title)}</h1>
    <p style="margin:0;color:#eadfd2;font-size:15px;line-height:24px;">${escapeHtml(intro)}</p>
  </td></tr>`;
}

function detailRow(label: string, value: string | number, emphasis = false) {
  return `<tr>
    <td style="padding:10px 0;color:#7a685b;font-size:14px;border-bottom:1px solid #eee2d2;">${escapeHtml(label)}</td>
    <td align="right" style="padding:10px 0;color:${emphasis ? "#a64b24" : "#2b1c14"};font-size:14px;font-weight:${emphasis ? "700" : "600"};border-bottom:1px solid #eee2d2;">${escapeHtml(value)}</td>
  </tr>`;
}

function section(title: string, rows: string) {
  return `<h2 style="margin:26px 0 8px;font-family:Georgia,serif;font-size:18px;color:#4b3024;">${escapeHtml(title)}</h2>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows}</table>`;
}

export async function sendBusinessOrderEmail(order: OrderRecord) {
  const brand = process.env.BRAND_NAME?.trim() || "Nepali Jute Bag";
  const from = requiredEnv("EMAIL_FROM");
  const businessEmail = requiredEnv("BUSINESS_EMAIL");
  const content = `${header(
    brand,
    "New cash on delivery order",
    "A new order just arrived",
    "Review the details below and contact the customer promptly.",
  )}
  <tr><td style="padding:30px 32px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8f2e7;border:1px solid #eadac1;border-radius:14px;padding:18px;">
      ${detailRow("Order ID", order.orderId)}
      ${detailRow("Date & time", order.createdAt)}
      <tr><td style="padding:12px 0 0;color:#7a685b;font-size:14px;">Status</td><td align="right" style="padding:12px 0 0;"><span style="background:#f1dcc7;color:#8d3e20;border-radius:999px;padding:7px 12px;font-size:12px;font-weight:bold;">New Order</span></td></tr>
    </table>
    ${section(
      "Customer details",
      detailRow("Customer name", order.customerName) +
        detailRow("Phone number", order.phone) +
        detailRow("Email address", order.email) +
        detailRow("Exact location", order.location),
    )}
    ${section(
      "Product details",
      detailRow("Product", order.productName) +
        detailRow("Quantity", order.quantity) +
        detailRow("Price per piece", formatNpr(order.pricePerPiece)) +
        detailRow("Total price", formatNpr(order.totalPrice), true),
    )}
    ${section(
      "Payment details",
      detailRow("Payment method", order.paymentMethod) +
        detailRow("Order status", order.status),
    )}
    <div style="margin-top:26px;padding:18px;background:#fff0dc;border-left:4px solid #a64b24;border-radius:10px;color:#5b301f;font-size:15px;line-height:23px;font-weight:bold;">Please call the customer soon to confirm this order.</div>
  </td></tr>`;

  await getTransporter().sendMail({
    from,
    to: businessEmail,
    replyTo: order.email,
    subject: `New Product Order Received - ${order.orderId}`,
    html: layout(content, `New order ${order.orderId} from ${order.customerName}`),
  });
}

export async function sendCustomerOrderEmail(order: OrderRecord) {
  const brand = process.env.BRAND_NAME?.trim() || "Nepali Jute Bag";
  const from = requiredEnv("EMAIL_FROM");
  const supportEmail = process.env.BUSINESS_EMAIL?.trim() || requiredEnv("SMTP_USER");
  const content = `${header(
    brand,
    "Order received",
    `Thank you, ${order.customerName}!`,
    "We have received your order successfully.",
  )}
  <tr><td style="padding:30px 32px;">
    <p style="margin:0;color:#59483c;font-size:15px;line-height:24px;">Your order is now with our team. Here is a quick summary for your records.</p>
    ${section(
      "Your order",
      detailRow("Order ID", order.orderId) +
        detailRow("Product", order.productName) +
        detailRow("Quantity", order.quantity) +
        detailRow("Total price", formatNpr(order.totalPrice), true) +
        detailRow("Payment method", order.paymentMethod),
    )}
    <div style="margin-top:26px;padding:20px;background:#f8f2e7;border:1px solid #e8d5b6;border-radius:14px;color:#4b3024;font-size:15px;line-height:24px;">Our sales representative will call you soon to confirm your order.</div>
    <p style="margin:26px 0 0;color:#59483c;font-size:14px;line-height:22px;">Need help? Reply to this email or contact us at <a href="mailto:${escapeHtml(supportEmail)}" style="color:#a64b24;font-weight:bold;">${escapeHtml(supportEmail)}</a>.</p>
    <p style="margin:24px 0 0;color:#2b1c14;font-size:15px;line-height:24px;">Thank you for choosing a more natural everyday carry.<br><strong>${escapeHtml(brand)}</strong></p>
  </td></tr>`;

  await getTransporter().sendMail({
    from,
    to: order.email,
    replyTo: supportEmail,
    subject: `Your Order Has Been Received - ${brand}`,
    html: layout(content, `We received your order ${order.orderId}`),
  });
}
