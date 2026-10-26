export const BRAND_NAME = "Nepali Jute Bag";
export const OFFER_RATE = 0.25;

export const productVariants = {
  standard: {
    sku: "standard",
    name: "Classic Nepali Jute Bag",
    label: "Classic",
    description: "A lightweight everyday carry for errands, college, and gifting.",
    originalPrice: 3999,
    price: 2999,
  },
  premium: {
    sku: "premium",
    name: "Premium Nepali Jute Bag",
    label: "Premium",
    description: "A roomier, elevated jute carry with a refined everyday finish.",
    originalPrice: 3999,
    price: 2999,
  },
} as const;

export type ProductSku = keyof typeof productVariants;

export const productImages = [
  {
    src: "/products/festival-jute-bag.png",
    alt: "Decorative Nepali jute tote displayed in a warm festive setting",
  },
  {
    src: "/products/classic-jute-bag.png",
    alt: "Classic natural rectangular jute tote bag",
  },
  {
    src: "/products/compact-jute-bag.png",
    alt: "Compact natural jute bag with measurements",
  },
  {
    src: "/products/colour-jute-bags.png",
    alt: "Collection of colourful compact jute bags",
  },
  {
    src: "/products/round-jute-bag.png",
    alt: "Round woven jute shoulder bag with colourful tassels",
  },
] as const;

export const benefits = [
  {
    number: "01",
    title: "A conscious everyday choice",
    text: "Choose a reusable, plant-based jute carry instead of reaching for another single-use bag.",
  },
  {
    number: "02",
    title: "Naturally strong",
    text: "Jute's sturdy woven fibres are made for regular errands, shopping, college, and daily essentials.",
  },
  {
    number: "03",
    title: "Warm, effortless style",
    text: "An earthy texture and timeless silhouette that pair naturally with relaxed everyday looks.",
  },
  {
    number: "04",
    title: "Useful again and again",
    text: "Fold it, carry it, and bring it back into your routine—a practical alternative to disposable bags.",
  },
  {
    number: "05",
    title: "Made for many moments",
    text: "A versatile companion for markets, casual outings, classes, travel days, and thoughtful gifting.",
  },
  {
    number: "06",
    title: "Naturally distinctive",
    text: "The organic weave gives every bag subtle texture and character; small variations are part of its charm.",
  },
] as const;

export const faqs = [
  {
    question: "What is the bag made from?",
    answer:
      "It is made primarily from woven natural jute fibre. Because jute is a natural material, slight variations in colour and texture may occur.",
  },
  {
    question: "Which bag should I choose?",
    answer:
      "Choose Classic for light everyday errands and Premium when you prefer a roomier, more elevated carry. The checkout summary will always show your selected option and final price.",
  },
  {
    question: "How does Cash on Delivery work?",
    answer:
      "Place your order without online payment. Our sales representative will call to confirm the details, and you pay when the order is delivered.",
  },
  {
    question: "Is delivery free?",
    answer:
      "Yes. Delivery is currently free, so the product total shown at checkout is the amount due on delivery.",
  },
  {
    question: "How should I care for my jute bag?",
    answer:
      "Keep it dry, spot-clean gently with a damp cloth, and air-dry in shade. Avoid machine washing, soaking, and carrying loads beyond its comfortable capacity.",
  },
  {
    question: "Will the bag look exactly like the photo?",
    answer:
      "The overall design will match the selected style, but natural fibres and handmade-looking textures can have small, beautiful variations.",
  },
  {
    question: "Can I change or cancel an order?",
    answer:
      "Reply to your confirmation email or tell our representative during the confirmation call as soon as possible. Changes depend on whether dispatch has begun.",
  },
] as const;

export function isProductSku(value: string | null): value is ProductSku {
  return value === "standard" || value === "premium";
}

export function getProduct(sku: string) {
  if (!isProductSku(sku)) return productVariants.standard;
  return productVariants[sku];
}
