import { Building2, CircleDot } from "lucide-react";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { shoppingOptions } from "@/data/homeDiscovery";

export default function RetailerSection() {
  return (
    <section className="section-space-compact border-y border-line bg-surface" aria-labelledby="retailer-heading">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <SectionHeading
            id="retailer-heading"
            eyebrow="More choice, less searching"
            title="Shop across familiar retailers and baby brands"
            description="MishBaby is being built to bring useful product discovery and available shopping options together in one calm place."
          />
          <div>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3" aria-label="Potential shopping options">
              {shoppingOptions.map((option) => (
                <li key={option} className="flex min-h-24 items-center gap-3 rounded-card border border-line bg-page p-4 text-sm font-bold text-ink sm:text-base">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand-hover" aria-hidden="true">
                    {option === "Direct baby brands" ? <Building2 className="h-4 w-4" /> : <CircleDot className="h-4 w-4" />}
                  </span>
                  {option}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-6 text-ink-muted">
              Retailer availability depends on the product, market, and partnership status. This list does not imply a current formal partnership.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
