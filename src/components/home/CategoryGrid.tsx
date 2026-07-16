import Link from "next/link";
import {
  ArrowRight,
  Baby,
  Blocks,
  LampDesk,
  ShieldCheck,
  Shirt,
  Soup,
  Waves,
} from "lucide-react";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { categories } from "@/lib/getCatgeories";

const icons = [Shirt, Baby, Waves, Soup, LampDesk, ShieldCheck, Blocks];

export default function CategoryGrid() {
  const visibleCategories = categories.filter((category) => category.slug !== "all-products");

  return (
    <section id="categories" className="section-space bg-page" aria-labelledby="category-heading">
      <Container>
        <SectionHeading
          id="category-heading"
          eyebrow="Browse your way"
          title="Start with a category"
          description="Explore practical collections built around the moments, routines, and milestones of early family life."
        />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {visibleCategories.map((category, index) => {
            const Icon = icons[index] || Blocks;
            return (
              <Link
                key={category.slug}
                href={`/list?cat=${category.slug}`}
                className="group flex min-h-48 flex-col rounded-card border border-line bg-surface p-4 shadow-card transition duration-200 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-elevated sm:min-h-52 sm:p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-hover sm:h-12 sm:w-12" aria-hidden="true">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
                <h3 className="mt-5 text-base font-bold leading-6 text-ink sm:text-lg">
                  {category.name}
                </h3>
                <p className="mt-2 hidden text-sm leading-6 text-ink-secondary sm:block">
                  {category.shortLabel}
                </p>
                <ArrowRight className="mt-auto h-4 w-4 text-brand-hover transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true" />
              </Link>
            );
          })}
          <Link
            href="/list?cat=all-products"
            className="group flex min-h-48 flex-col justify-between rounded-card bg-brand-hover p-4 text-white shadow-card transition duration-200 hover:bg-cyan-800 sm:min-h-52 sm:p-6"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">All collections</p>
              <h3 className="mt-4 text-xl font-bold sm:text-2xl">See every baby find</h3>
            </div>
            <span className="flex items-center gap-2 text-sm font-bold">
              Browse all <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
