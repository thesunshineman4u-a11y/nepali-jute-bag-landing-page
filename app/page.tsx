import Image from "next/image";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { Icon } from "@/components/icons";
import { ProductShowcase } from "@/components/product-showcase";
import { benefits, faqs, productVariants } from "@/lib/product";
import { formatNpr } from "@/lib/format";

const trustItems = [
  { icon: "bag" as const, title: "Cash on delivery", detail: "Pay when it arrives" },
  { icon: "truck" as const, title: "Free delivery", detail: "No surprise delivery fee" },
  { icon: "headset" as const, title: "Human confirmation", detail: "We call before dispatch" },
  { icon: "shield" as const, title: "Easy ordering", detail: "A simple, secure form" },
];

const sampleTestimonials = [
  {
    quote:
      "The natural texture feels warm and goes beautifully with simple everyday outfits.",
    persona: "Illustrative customer · Kathmandu",
  },
  {
    quote:
      "A practical size for errands, and I love that I can carry it again instead of taking another plastic bag.",
    persona: "Illustrative customer · Lalitpur",
  },
  {
    quote:
      "The Cash on Delivery process feels straightforward—order online, then confirm by phone.",
    persona: "Illustrative customer · Bhaktapur",
  },
];

function TrustBannerGroup({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="trust-banner-group" aria-hidden={duplicate || undefined}>
      <span className="trust-banner-lead">
        <Icon name="sparkle" className="h-3.5 w-3.5" /> Dashain n Tihar offer
      </span>
      <span className="trust-banner-item">
        <Icon name="truck" className="h-4 w-4" /> Free delivery
      </span>
      <span className="trust-banner-dot" />
      <span className="trust-banner-item">
        <Icon name="bag" className="h-4 w-4" /> Cash on delivery
      </span>
      <span className="trust-banner-dot" />
      <span className="trust-banner-item">
        <Icon name="phone" className="h-4 w-4" /> Confirmed personally by phone
      </span>
    </div>
  );
}

export default function HomePage() {
  const heroProduct = productVariants.standard;

  return (
    <main className="overflow-hidden">
      <div className="trust-banner" role="region" aria-label="Ordering benefits">
        <div className="trust-banner-track">
          <TrustBannerGroup />
          <TrustBannerGroup duplicate />
        </div>
      </div>

      <header className="absolute left-0 right-0 top-[52px] z-20">
        <div className="section-shell flex items-center justify-between py-5">
          <BrandMark />
          <nav className="hidden items-center gap-8 text-sm font-semibold text-mocha/70 md:flex">
            <a href="#shop" className="transition hover:text-amber">Shop</a>
            <a href="#benefits" className="transition hover:text-amber">Why jute</a>
            <a href="#reviews" className="transition hover:text-amber">Reviews</a>
            <a href="#faq" className="transition hover:text-amber">FAQ</a>
          </nav>
          <Link href="/checkout?sku=standard&quantity=1" className="secondary-button hidden sm:inline-flex">
            Order now <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="hero-texture relative min-h-[780px] bg-linen pt-40 sm:pt-44 lg:min-h-[840px]">
        <div className="absolute -left-40 top-52 h-96 w-96 rounded-full bg-champagne/25 blur-3xl" />
        <div className="absolute -right-40 bottom-10 h-[30rem] w-[30rem] rounded-full bg-amber/10 blur-3xl" />
        <div className="section-shell relative grid items-center gap-12 pb-20 lg:grid-cols-[1.04fr_.96fr] lg:gap-16 lg:pb-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber/20 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-amber backdrop-blur">
              <Icon name="leaf" className="h-4 w-4" /> Rooted in nature
            </div>
            <h1 className="mt-7 font-serif text-[3.4rem] font-bold leading-[.96] tracking-[-.045em] text-ink sm:text-7xl lg:text-[5.5rem]">
              Carry less plastic. <span className="text-amber">Carry more meaning.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-mocha/75">
              Meet your reusable Nepali Jute Bag—naturally textured, comfortably lightweight, and ready for markets, college, travel, or gifting.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="#shop" className="primary-button justify-center sm:justify-start">
                Purchase now <Icon name="arrow" />
              </Link>
              <a href="#benefits" className="ghost-button justify-center sm:justify-start">
                See why jute works
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold text-mocha/65">
              <span className="flex items-center gap-2"><Icon name="check" className="h-4 w-4 text-amber" /> Cash on delivery</span>
              <span className="flex items-center gap-2"><Icon name="check" className="h-4 w-4 text-amber" /> Free delivery</span>
              <span className="flex items-center gap-2"><Icon name="check" className="h-4 w-4 text-amber" /> Naturally reusable</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="absolute -inset-5 rotate-3 rounded-[2.5rem] border border-champagne/40 bg-champagne/15" />
            <div className="relative aspect-[4/4.6] overflow-hidden rounded-[2rem] border-[10px] border-white bg-oat shadow-soft">
              <Image
                src="/products/festival-jute-bag.png"
                alt="Decorative Nepali jute bag in a warm festive setting"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 44vw"
                className="object-cover"
              />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl bg-ink/80 p-4 text-white backdrop-blur-md sm:inset-x-6 sm:bottom-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-champagne">Your celebration price</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <p className="font-serif text-2xl font-bold">{formatNpr(heroProduct.price)}</p>
                    <span className="text-xs text-white/55 line-through">{formatNpr(heroProduct.originalPrice)}</span>
                  </div>
                </div>
                <span className="rounded-full bg-champagne px-3 py-1.5 text-center text-[10px] font-black uppercase leading-4 text-mocha">You save<br />NPR 1,000</span>
              </div>
            </div>
            <div className="festival-star" aria-label="Dashain and Tihar offer: save 25 percent">
              <span aria-hidden="true" className="festival-star-spark">★</span>
              <span className="festival-star-title">Dashain n Tihar</span>
              <strong>Offer</strong>
              <span className="festival-star-saving">Save 25%</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-3 bg-white">
        <div className="section-shell grid divide-y divide-mocha/10 border-x border-mocha/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {trustItems.map((item) => (
            <div key={item.title} className="flex items-center gap-4 px-5 py-6 lg:px-7">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-amber/10 text-amber">
                <Icon name={item.icon} />
              </span>
              <div>
                <p className="text-sm font-bold text-ink">{item.title}</p>
                <p className="mt-0.5 text-xs text-mocha/55">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ProductShowcase />

      <section id="benefits" className="scroll-mt-20 bg-mocha py-20 text-linen sm:py-28">
        <div className="section-shell">
          <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="eyebrow !text-champagne">Why you’ll reach for it</p>
              <h2 className="mt-3 font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                One bag.<br />Many better days.
              </h2>
              <p className="mt-6 max-w-sm leading-7 text-linen/65">
                A humble natural fibre becomes a dependable carry that looks at home wherever your day takes you.
              </p>
              <Link href="/checkout?sku=standard&quantity=1" className="champagne-button mt-8">
                Buy now <Icon name="arrow" />
              </Link>
            </div>
            <div className="grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <article key={benefit.number} className="group bg-mocha p-7 transition hover:bg-white/[.04] sm:p-9">
                  <span className="font-serif text-3xl italic text-champagne/55">{benefit.number}</span>
                  <h3 className="mt-10 font-serif text-2xl font-bold">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-linen/60">{benefit.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" className="scroll-mt-20 bg-oat py-20 sm:py-28">
        <div className="section-shell">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">The feeling we’re made for</p>
            <h2 className="section-title">Simple, useful, naturally loved.</h2>
            <p className="mt-5 text-sm leading-7 text-mocha/65">
              The cards below are clearly marked illustrative copy—not verified customer claims. Replace them with real feedback as orders arrive.
            </p>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {sampleTestimonials.map((testimonial, index) => (
              <figure key={testimonial.persona} className="rounded-[1.75rem] border border-mocha/10 bg-white p-7 shadow-sm sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-amber" aria-label="Five decorative stars">
                    {[0, 1, 2, 3, 4].map((star) => <span key={star}>★</span>)}
                  </div>
                  <span className="rounded-full bg-oat px-3 py-1 text-[9px] font-black uppercase tracking-[.14em] text-mocha/55">Sample</span>
                </div>
                <blockquote className="mt-8 font-serif text-2xl leading-9 text-ink">“{testimonial.quote}”</blockquote>
                <figcaption className="mt-8 flex items-center gap-3 border-t border-mocha/10 pt-5 text-xs font-bold uppercase tracking-[.12em] text-mocha/55">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-amber text-sm text-white">{index + 1}</span>
                  {testimonial.persona}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-20 bg-linen py-20 sm:py-28">
        <div className="section-shell grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
          <div>
            <p className="eyebrow">Good to know</p>
            <h2 className="section-title">Questions, answered.</h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-mocha/65">
              Still deciding? Here’s everything you need to know before placing a Cash on Delivery order.
            </p>
          </div>
          <div className="divide-y divide-mocha/15 border-y border-mocha/15">
            {faqs.map((faq, index) => (
              <details key={faq.question} className="faq group" open={index === 0}>
                <summary>
                  <span>{faq.question}</span>
                  <span className="faq-plus"><Icon name="plus" className="h-4 w-4" /></span>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-amber px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl text-center text-white">
          <p className="text-xs font-bold uppercase tracking-[.22em] text-champagne">NPR 1,000 festival saving applied automatically</p>
          <h2 className="mt-4 font-serif text-4xl font-bold leading-tight sm:text-6xl">A better everyday bag is one click away.</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-white/75">Choose your style today. We’ll call to confirm your order before it heads your way.</p>
          <Link href="/checkout?sku=standard&quantity=1" className="mt-8 inline-flex items-center gap-3 rounded-full bg-linen px-7 py-4 text-sm font-black uppercase tracking-[.08em] text-amber shadow-button transition hover:-translate-y-0.5">
            Purchase now <Icon name="arrow" />
          </Link>
        </div>
      </section>

      <footer className="bg-ink py-12 text-linen">
        <div className="section-shell flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <BrandMark light />
            <p className="mt-5 max-w-sm text-sm leading-6 text-linen/55">Natural jute. Everyday usefulness. A simpler way to carry what matters.</p>
          </div>
          <div className="text-sm text-linen/50 sm:text-right">
            <p>Cash On Delivery · Free delivery</p>
            <p className="mt-2">© {new Date().getFullYear()} Nepali Jute Bag</p>
          </div>
        </div>
      </footer>

      <div className="fixed inset-x-3 bottom-3 z-40 sm:hidden">
        <Link href="/checkout?sku=standard&quantity=1" className="primary-button w-full justify-center border-2 border-linen shadow-2xl">
          Order now · From {formatNpr(heroProduct.price)} <Icon name="arrow" />
        </Link>
      </div>
    </main>
  );
}
