import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BrandMark } from "@/components/brand-mark";
import { CheckoutForm } from "@/components/checkout-form";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Secure checkout",
  description: "Complete your Nepali Jute Bag Cash on Delivery order.",
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-oat">
      <header className="border-b border-mocha/10 bg-linen/90 backdrop-blur">
        <div className="section-shell flex items-center justify-between py-5">
          <BrandMark />
          <Link href="/#shop" className="flex items-center gap-2 text-sm font-bold text-mocha/65 transition hover:text-amber">
            <Icon name="chevron" className="h-4 w-4 rotate-180" /> Back to shop
          </Link>
        </div>
      </header>

      <section className="section-shell py-10 sm:py-14">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Secure Cash on Delivery checkout</p>
            <h2 className="mt-2 font-serif text-4xl font-bold text-ink sm:text-5xl">Almost yours.</h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-mocha/55">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-amber text-white"><Icon name="check" className="h-4 w-4" /></span>
            Select bag
            <span className="h-px w-8 bg-mocha/20" />
            <span className="grid h-7 w-7 place-items-center rounded-full bg-mocha text-white">2</span>
            Confirm order
          </div>
        </div>
        <Suspense fallback={<div className="h-[680px] animate-pulse rounded-[2rem] bg-white" />}>
          <CheckoutForm />
        </Suspense>
      </section>
    </main>
  );
}
