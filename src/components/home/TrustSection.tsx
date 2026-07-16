import { BadgeCheck, ExternalLink, Layers3, Scale, Sparkles } from "lucide-react";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const trustPoints = [
  { title: "Curated discovery", icon: Sparkles },
  { title: "Helpful recommendations", icon: BadgeCheck },
  { title: "Multiple shopping options", icon: Layers3 },
  { title: "Clear disclosures", icon: Scale },
  { title: "Retailer checkout", icon: ExternalLink },
];

export default function TrustSection() {
  return (
    <section id="affiliate-disclosure" className="section-space bg-surface" aria-labelledby="trust-heading">
      <Container>
        <div className="rounded-panel border border-cyan-100 bg-brand-soft p-6 sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <SectionHeading
              id="trust-heading"
              eyebrow="Trust through clarity"
              title="We help you discover. You decide where to buy."
              description="MishBaby does not manufacture the products shown. As the platform evolves, checkout and fulfillment for shopping options will take place on the selected retailer’s website."
            />
            <div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {trustPoints.map((point) => (
                  <li key={point.title} className="flex items-center gap-3 rounded-lg bg-white p-4 text-sm font-bold text-ink shadow-sm">
                    <point.icon className="h-5 w-5 shrink-0 text-brand-hover" aria-hidden="true" />
                    {point.title}
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-lg border border-cyan-200 bg-white p-4 text-sm font-semibold leading-6 text-ink-secondary">
                MishBaby may earn a commission when you purchase through selected links, at no additional cost to you.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
