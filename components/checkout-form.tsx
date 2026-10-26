"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { formatNpr } from "@/lib/format";
import { getProduct, isProductSku } from "@/lib/product";

type ContactFields = {
  fullName: string;
  phone: string;
  email: string;
  location: string;
};

type FieldErrors = Partial<Record<keyof ContactFields | "form" | "product", string>>;

function validQuantity(value: string | null) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 1 && number <= 20 ? number : 1;
}

export function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const requestedSku = searchParams.get("sku");
  const sku = isProductSku(requestedSku) ? requestedSku : "standard";
  const quantity = validQuantity(searchParams.get("quantity"));
  const product = getProduct(sku);
  const total = product.price * quantity;
  const submissionId = useRef<string | null>(null);
  const [fields, setFields] = useState<ContactFields>({
    fullName: "",
    phone: "",
    email: "",
    location: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(name: keyof ContactFields, value: string) {
    setFields((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined, form: undefined }));
  }

  function validate() {
    const nextErrors: FieldErrors = {};
    if (fields.fullName.trim().length < 2) nextErrors.fullName = "Please enter your full name.";
    if (!/^[+()\-\s0-9]{7,20}$/.test(fields.phone.trim())) nextErrors.phone = "Please enter a valid phone number.";
    if (!/^\S+@\S+\.\S+$/.test(fields.email.trim())) nextErrors.email = "Please enter a valid email address.";
    if (fields.location.trim().length < 5) nextErrors.location = "Kindly share your exact location.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || !validate()) return;

    setIsSubmitting(true);
    setErrors({});
    submissionId.current ??= crypto.randomUUID();

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: submissionId.current,
          ...fields,
          productSku: sku,
          productName: product.name,
          quantity,
          pricePerPiece: product.price,
          totalPrice: total,
        }),
      });
      const result = (await response.json()) as {
        success: boolean;
        message?: string;
        fieldErrors?: FieldErrors;
        order?: {
          orderId: string;
          productName: string;
          quantity: number;
          totalPrice: number;
          paymentMethod: string;
        };
      };

      if (!response.ok || !result.success || !result.order) {
        setErrors({
          ...(result.fieldErrors ?? {}),
          form: result.message ?? "We could not submit your order. Please try again.",
        });
        return;
      }

      const confirmation = new URLSearchParams({
        orderId: result.order.orderId,
        product: result.order.productName,
        quantity: String(result.order.quantity),
        total: String(result.order.totalPrice),
      });
      router.push(`/thank-you?${confirmation.toString()}`);
    } catch {
      setErrors({
        form: "We could not connect to the order service. Check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-7 lg:grid-cols-[1.08fr_.92fr] lg:gap-10">
      <form onSubmit={handleSubmit} noValidate className="rounded-[2rem] border border-mocha/10 bg-white p-6 shadow-soft sm:p-9">
        <div className="flex items-center gap-4 border-b border-mocha/10 pb-6">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-amber text-sm font-black text-white">1</span>
          <div>
            <h1 className="font-serif text-3xl font-bold text-ink">Delivery details</h1>
            <p className="mt-1 text-sm text-mocha/55">Tell us where and how to reach you.</p>
          </div>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <Field
            label="Full name"
            name="fullName"
            value={fields.fullName}
            onChange={updateField}
            error={errors.fullName}
            autoComplete="name"
            placeholder="Your full name"
          />
          <Field
            label="Phone number"
            name="phone"
            value={fields.phone}
            onChange={updateField}
            error={errors.phone}
            autoComplete="tel"
            inputMode="tel"
            placeholder="98XXXXXXXX"
          />
          <Field
            label="Email address"
            name="email"
            type="email"
            value={fields.email}
            onChange={updateField}
            error={errors.email}
            autoComplete="email"
            placeholder="you@example.com"
            wrapperClass="sm:col-span-2"
          />
          <div className="sm:col-span-2">
            <label htmlFor="location" className="form-label">Exact location</label>
            <textarea
              id="location"
              name="location"
              value={fields.location}
              onChange={(event) => updateField("location", event.target.value)}
              autoComplete="street-address"
              rows={4}
              placeholder="Kindly share your exact location"
              className="form-input resize-none"
              aria-invalid={Boolean(errors.location)}
              aria-describedby={errors.location ? "location-error" : undefined}
            />
            {errors.location && <p id="location-error" className="form-error">{errors.location}</p>}
          </div>
        </div>

        <div className="mt-7 rounded-2xl border border-champagne/50 bg-oat p-4 text-sm leading-6 text-mocha/70">
          <div className="flex gap-3">
            <Icon name="phone" className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
            <p><strong className="text-ink">What happens next?</strong><br />Our sales representative will call you soon to confirm your order and delivery details.</p>
          </div>
        </div>

        {errors.form && (
          <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-800">
            {errors.form}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="primary-button mt-7 w-full justify-center disabled:cursor-not-allowed disabled:opacity-65">
          {isSubmitting ? (
            <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Submitting Order...</>
          ) : (
            <>Order now · {formatNpr(total)} <Icon name="arrow" /></>
          )}
        </button>
        <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-mocha/50">
          <Icon name="lock" className="h-4 w-4" /> Your details are sent securely. No online payment is collected.
        </p>
      </form>

      <aside className="lg:sticky lg:top-8 lg:self-start">
        <div className="overflow-hidden rounded-[2rem] border border-mocha/10 bg-mocha text-linen shadow-soft">
          <div className="p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[.18em] text-champagne">Your order</p>
            <div className="mt-6 flex gap-4">
              <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl bg-white">
                <Image src="/products/festival-jute-bag.png" alt="Nepali jute bag" fill sizes="96px" className="object-cover" />
              </div>
              <div className="min-w-0 pt-1">
                <h2 className="font-serif text-xl font-bold leading-6">{product.name}</h2>
                <p className="mt-2 text-xs leading-5 text-linen/55">NPR 1,000 festival saving applied</p>
                <p className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold">Qty {quantity}</p>
              </div>
            </div>

            <div className="mt-7 space-y-3 border-y border-white/10 py-6 text-sm">
              <SummaryRow label="Product name" value={product.name} />
              <SummaryRow label="Quantity" value={String(quantity)} />
              <SummaryRow label="Price per piece" value={formatNpr(product.price)} />
              <SummaryRow label="Delivery" value="Free" accent />
            </div>
            <div className="flex items-end justify-between pt-6">
              <span className="text-sm font-bold text-linen/65">Total price</span>
              <span className="font-serif text-3xl font-bold text-champagne">{formatNpr(total)}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-px bg-white/10">
            <div className="bg-mocha px-5 py-5 text-center"><Icon name="truck" className="mx-auto text-champagne" /><p className="mt-2 text-xs font-bold">Free delivery</p></div>
            <div className="bg-mocha px-5 py-5 text-center"><Icon name="bag" className="mx-auto text-champagne" /><p className="mt-2 text-xs font-bold">Cash on delivery</p></div>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[2rem] border border-amber/20 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-5">
            <div className="shrink-0 rounded-2xl border border-mocha/10 bg-linen p-2 shadow-sm">
              <Image
                src="/contact-phone-qr.png"
                alt="QR code to call 9851366640"
                width={116}
                height={116}
                className="h-[104px] w-[104px] sm:h-[116px] sm:w-[116px]"
              />
            </div>
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber/10 px-3 py-1 text-[10px] font-black uppercase tracking-[.12em] text-amber">
                <Icon name="phone" className="h-3.5 w-3.5" /> Scan to call
              </span>
              <h3 className="mt-3 font-serif text-xl font-bold leading-tight text-ink">Need help ordering?</h3>
              <p className="mt-1.5 text-xs leading-5 text-mocha/60">Scan with your phone camera or call us directly.</p>
              <a href="tel:+9779851366640" className="mt-3 inline-block text-sm font-black tracking-wide text-amber underline decoration-amber/30 underline-offset-4 transition hover:text-mocha">
                9851366640
              </a>
            </div>
          </div>
          <p className="mt-4 border-t border-mocha/10 pt-3 text-center text-[10px] font-bold uppercase tracking-[.1em] text-mocha/45">
            Contact QR only · Payment remains Cash on Delivery
          </p>
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  wrapperClass = "",
  type = "text",
  ...inputProps
}: {
  label: string;
  name: keyof ContactFields;
  value: string;
  onChange: (name: keyof ContactFields, value: string) => void;
  error?: string;
  wrapperClass?: string;
  type?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "value" | "onChange" | "type">) {
  return (
    <div className={wrapperClass}>
      <label htmlFor={name} className="form-label">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        className="form-input"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        {...inputProps}
      />
      {error && <p id={`${name}-error`} className="form-error">{error}</p>}
    </div>
  );
}

function SummaryRow({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-linen/55">{label}</span>
      <span className={`max-w-[60%] text-right font-bold ${accent ? "text-champagne" : "text-linen"}`}>{value}</span>
    </div>
  );
}
