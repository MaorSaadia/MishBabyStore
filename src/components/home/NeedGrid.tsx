import Link from "next/link";
import {
  ArrowRight,
  Gift,
  Heart,
  Home,
  Luggage,
  MoonStar,
  ShieldCheck,
  Soup,
  WalletCards,
} from "lucide-react";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { needCards } from "@/data/homeDiscovery";

const iconMap = {
  heart: Heart,
  moon: MoonStar,
  utensils: Soup,
  luggage: Luggage,
  shield: ShieldCheck,
  gift: Gift,
  home: Home,
  wallet: WalletCards,
};

export default function NeedGrid() {
  return (
    <section id="shop-by-need" className="section-space bg-surface" aria-labelledby="need-heading">
      <Container>
        <SectionHeading
          id="need-heading"
          eyebrow="Designed around family life"
          title="Shop by what you need today"
          description="Sometimes the easiest place to begin is the problem you are trying to solve—not a product aisle."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {needCards.map((need) => {
            const Icon = iconMap[need.icon];
            return (
              <Link
                key={need.title}
                href={need.href}
                className="group flex min-h-56 flex-col rounded-card border border-cyan-100 bg-brand-soft p-6 transition duration-200 hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-100/70"
              >
                <Icon className="h-6 w-6 text-brand-hover" aria-hidden="true" />
                <h3 className="mt-6 text-lg font-bold text-ink">{need.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-secondary">{need.description}</p>
                <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-bold text-brand-hover">
                  Explore options <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
