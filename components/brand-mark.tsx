import Link from "next/link";
import { Icon } from "@/components/icons";

export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 ${light ? "text-linen" : "text-mocha"}`}
      aria-label="Nepali Jute Bag home"
    >
      <span
        className={`grid h-10 w-10 place-items-center rounded-full border ${
          light
            ? "border-champagne/50 bg-champagne/10 text-champagne"
            : "border-amber/20 bg-amber/10 text-amber"
        }`}
      >
        <Icon name="leaf" className="h-5 w-5" />
      </span>
      <span>
        <span className="block font-serif text-lg font-bold leading-none tracking-tight">
          Nepali Jute Bag
        </span>
        <span
          className={`mt-1 block text-[9px] font-bold uppercase tracking-[0.24em] ${
            light ? "text-champagne" : "text-amber"
          }`}
        >
          Carry consciously
        </span>
      </span>
    </Link>
  );
}
