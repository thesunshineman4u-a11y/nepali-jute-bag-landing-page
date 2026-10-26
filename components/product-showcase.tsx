"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { formatNpr } from "@/lib/format";
import {
  productImages,
  productVariants,
  type ProductSku,
} from "@/lib/product";

export function ProductShowcase() {
  const [activeImage, setActiveImage] = useState(0);
  const [sku, setSku] = useState<ProductSku>("standard");
  const [quantity, setQuantity] = useState(1);
  const product = productVariants[sku];
  const total = product.price * quantity;

  const checkoutHref = useMemo(
    () => `/checkout?sku=${sku}&quantity=${quantity}`,
    [quantity, sku],
  );

  function moveGallery(direction: number) {
    setActiveImage(
      (current) =>
        (current + direction + productImages.length) % productImages.length,
    );
  }

  return (
    <section id="shop" className="section-shell scroll-mt-24 py-20 sm:py-28">
      <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Find your everyday carry</p>
          <h2 className="section-title max-w-2xl">Natural texture. Your kind of style.</h2>
        </div>
        <p className="max-w-md text-sm leading-7 text-mocha/70 sm:text-right">
          Browse every view, pick your finish, and see your final festival price instantly.
        </p>
      </div>

      <div className="grid overflow-hidden rounded-[2rem] border border-mocha/10 bg-white shadow-soft lg:grid-cols-[1.08fr_.92fr]">
        <div className="bg-oat p-4 sm:p-7 lg:p-9">
          <div className="relative aspect-[4/4.3] overflow-hidden rounded-[1.5rem] bg-white">
            <Image
              key={productImages[activeImage].src}
              src={productImages[activeImage].src}
              alt={productImages[activeImage].alt}
              fill
              sizes="(max-width: 1024px) 100vw, 54vw"
              className="animate-soft-in object-cover"
            />
            <button
              type="button"
              onClick={() => moveGallery(-1)}
              className="gallery-arrow left-4 rotate-180"
              aria-label="Previous product image"
            >
              <Icon name="chevron" />
            </button>
            <button
              type="button"
              onClick={() => moveGallery(1)}
              className="gallery-arrow right-4"
              aria-label="Next product image"
            >
              <Icon name="chevron" />
            </button>
            <div className="absolute bottom-4 left-4 rounded-full bg-ink/75 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
              {activeImage + 1} / {productImages.length}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-5 gap-2 sm:gap-3">
            {productImages.map((image, index) => (
              <button
                type="button"
                key={image.src}
                onClick={() => setActiveImage(index)}
                className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-white transition ${
                  activeImage === index
                    ? "border-amber shadow-md"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
                aria-label={`View product image ${index + 1}`}
                aria-current={activeImage === index}
              >
                <Image src={image.src} alt="" fill sizes="100px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-amber/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-amber">
            <Icon name="sparkle" className="h-4 w-4" /> A celebration gift for you
          </div>
          <h3 className="mt-6 font-serif text-4xl font-bold leading-tight text-ink sm:text-5xl">
            {product.name}
          </h3>
          <p className="mt-4 text-base leading-7 text-mocha/70">{product.description}</p>

          <div className="relative mt-6 overflow-hidden rounded-2xl bg-gradient-to-r from-mocha via-[#70422e] to-amber p-5 text-white shadow-button">
            <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full border-[18px] border-champagne/15" />
            <div className="relative flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[.2em] text-champagne">Dashain &amp; Tihar celebration offer</p>
                <p className="mt-2 font-serif text-2xl font-bold">NPR 1,000 is our gift to you.</p>
                <p className="mt-1 text-xs leading-5 text-white/65">Your 25% saving is added automatically—no coupon needed.</p>
              </div>
              <div className="grid h-20 w-20 shrink-0 rotate-3 place-items-center rounded-full border-2 border-dashed border-champagne bg-champagne text-center text-mocha shadow-lg">
                <span className="text-[10px] font-black uppercase leading-3">Save<br /><strong className="text-lg">25%</strong></span>
              </div>
            </div>
          </div>

          <ul className="mt-7 grid gap-3 text-sm font-semibold text-mocha sm:grid-cols-2">
            {["Reusable natural jute", "Free delivery", "Cash on delivery", "Lightweight carry"].map(
              (item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-amber/10 text-amber">
                    <Icon name="check" className="h-3.5 w-3.5" />
                  </span>
                  {item}
                </li>
              ),
            )}
          </ul>

          <fieldset className="mt-8">
            <legend className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-mocha/60">
              Choose your bag
            </legend>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(productVariants) as ProductSku[]).map((variantSku) => {
                const variant = productVariants[variantSku];
                return (
                  <button
                    type="button"
                    key={variantSku}
                    onClick={() => setSku(variantSku)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      sku === variantSku
                        ? "border-amber bg-amber/5 shadow-sm"
                        : "border-mocha/15 hover:border-amber/40"
                    }`}
                    aria-pressed={sku === variantSku}
                  >
                    <span className="block text-sm font-bold text-ink">{variant.label}</span>
                    <span className="mt-1 block text-xs text-mocha/60">
                      {formatNpr(variant.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-8 flex items-end justify-between gap-5 border-y border-mocha/10 py-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-mocha/50">
                Celebration price
              </p>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="font-serif text-4xl font-bold text-amber">
                  {formatNpr(product.price)}
                </span>
                <span className="text-sm text-mocha/45 line-through">
                  {formatNpr(product.originalPrice)}
                </span>
              </div>
            </div>
            <div>
              <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.16em] text-mocha/50">
                Quantity
              </p>
              <div className="flex items-center rounded-full border border-mocha/20 bg-white p-1">
                <button
                  type="button"
                  className="quantity-button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  aria-label="Decrease quantity"
                >
                  <Icon name="minus" className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="quantity-button"
                  onClick={() => setQuantity((value) => Math.min(20, value + 1))}
                  aria-label="Increase quantity"
                >
                  <Icon name="plus" className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm font-semibold text-mocha/65">Total · Free delivery</span>
            <span className="font-serif text-2xl font-bold text-ink">{formatNpr(total)}</span>
          </div>

          <Link href={checkoutHref} className="primary-button mt-6 w-full justify-center">
            Order now <Icon name="arrow" />
          </Link>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-mocha/55">
            <Icon name="lock" className="h-4 w-4" /> No online payment required
          </p>
        </div>
      </div>
    </section>
  );
}
