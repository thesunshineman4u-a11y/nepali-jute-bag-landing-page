import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { Icon } from "@/components/icons";
import { formatNpr } from "@/lib/format";

export const metadata: Metadata = {
  title: "Order received",
  robots: { index: false, follow: false },
};

type ThankYouPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const params = await searchParams;
  const orderId = first(params.orderId) || "Confirmed";
  const product = first(params.product) || "Nepali Jute Bag";
  const quantity = Number(first(params.quantity)) || 1;
  const total = Number(first(params.total));

  return (
    <main className="hero-texture relative min-h-screen overflow-hidden bg-linen px-5 py-8">
      <div className="absolute -left-48 top-32 h-96 w-96 rounded-full bg-champagne/30 blur-3xl" />
      <div className="absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-amber/10 blur-3xl" />
      <div className="relative mx-auto max-w-3xl">
        <div className="flex justify-center"><BrandMark /></div>
        <section className="mt-10 overflow-hidden rounded-[2.25rem] border border-mocha/10 bg-white text-center shadow-soft">
          <div className="bg-mocha px-6 py-10 text-linen sm:py-12">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border-4 border-champagne/40 bg-champagne text-mocha shadow-lg">
              <Icon name="check" className="h-10 w-10" />
            </div>
            <p className="mt-6 text-xs font-black uppercase tracking-[.22em] text-champagne">Order {orderId}</p>
            <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">Thank you for your order!</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-linen/65">We’ve received your Cash on Delivery order and sent a confirmation to your email.</p>
          </div>

          <div className="p-6 sm:p-10">
            <div className="mx-auto max-w-xl rounded-2xl border border-mocha/10 bg-oat p-5 text-left sm:p-7">
              <ThankYouRow label="Product ordered" value={product} />
              <ThankYouRow label="Quantity" value={String(quantity)} />
              <ThankYouRow label="Total price" value={Number.isFinite(total) && total > 0 ? formatNpr(total) : "See confirmation email"} accent />
              <ThankYouRow label="Payment method" value="Cash On Delivery" last />
            </div>

            <div className="mx-auto mt-7 flex max-w-xl gap-4 rounded-2xl border border-champagne/60 bg-[#fff8e9] p-5 text-left">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber/10 text-amber"><Icon name="phone" /></span>
              <div>
                <h2 className="text-sm font-bold text-ink">Keep your phone nearby</h2>
                <p className="mt-1 text-sm leading-6 text-mocha/65">Our sales representative will call you soon to confirm your order.</p>
              </div>
            </div>

            <Link href="/" className="primary-button mt-8 justify-center">Back to home <Icon name="arrow" /></Link>
            <p className="mt-5 text-xs text-mocha/45">Please keep your order ID for reference: <strong>{orderId}</strong></p>
          </div>
        </section>
      </div>
    </main>
  );
}

function ThankYouRow({ label, value, accent = false, last = false }: { label: string; value: string; accent?: boolean; last?: boolean }) {
  return (
    <div className={`flex items-start justify-between gap-5 py-3.5 ${last ? "" : "border-b border-mocha/10"}`}>
      <span className="text-sm text-mocha/55">{label}</span>
      <span className={`max-w-[62%] text-right text-sm font-bold ${accent ? "text-amber" : "text-ink"}`}>{value}</span>
    </div>
  );
}
