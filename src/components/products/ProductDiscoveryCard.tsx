import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Store } from "lucide-react";

interface ProductDiscoveryCardProps {
  name: string;
  href: string;
  image: string;
  brand?: string;
  bestFor?: string;
  category?: string;
  badge?: string;
  retailerCount?: number;
}

export default function ProductDiscoveryCard({
  name,
  href,
  image,
  brand,
  bestFor,
  category,
  badge,
  retailerCount,
}: ProductDiscoveryCardProps) {
  const actionLabel = retailerCount
    ? `Compare ${retailerCount} ${retailerCount === 1 ? "store" : "stores"}`
    : "View product";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card transition duration-200 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-elevated focus-within:border-brand">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-brand-soft">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 719px) 82vw, (max-width: 1023px) 42vw, (max-width: 1279px) 30vw, 280px"
          className="object-cover transition duration-300 group-hover:scale-[1.03] motion-reduce:transform-none"
        />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-brand-hover shadow-sm">
            {badge}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {(brand || category) && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
            {brand || category}
          </p>
        )}
        <h3 className="text-base font-bold leading-6 text-ink sm:text-lg">
          <Link href={href} className="rounded-sm hover:text-brand-hover">
            {name}
          </Link>
        </h3>
        {bestFor && (
          <p className="mt-2 text-sm leading-6 text-ink-secondary">
            <span className="font-semibold text-ink">Best for:</span> {bestFor}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4 text-sm font-bold text-brand-hover">
          <span className="flex items-center gap-2">
            {retailerCount ? <Store className="h-4 w-4" aria-hidden="true" /> : null}
            {actionLabel}
          </span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" aria-hidden="true" />
        </div>
      </div>
    </article>
  );
}
