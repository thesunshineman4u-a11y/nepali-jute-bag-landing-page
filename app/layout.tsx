import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Nepali Jute Bag | Carry Naturally",
    template: "%s | Nepali Jute Bag",
  },
  description:
    "Reusable Nepali jute bags for shopping, college, travel, gifting, and everyday carry. Cash on delivery and free delivery available.",
  openGraph: {
    title: "Nepali Jute Bag — Carry Naturally",
    description:
      "Natural texture, everyday strength, and effortless style. Order with Cash on Delivery.",
    images: ["/products/festival-jute-bag.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
