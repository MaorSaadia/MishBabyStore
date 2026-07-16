import { ExternalLink, Search, Store } from "lucide-react";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const steps = [
  {
    title: "Discover a product",
    description: "Browse curated categories, family needs, and practical buying guidance.",
    icon: Search,
  },
  {
    title: "Explore shopping options",
    description: "See the available stores and product information MishBaby can provide.",
    icon: Store,
  },
  {
    title: "Choose your retailer",
    description: "Continue to the selected retailer to complete checkout and arrange fulfillment.",
    icon: ExternalLink,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-space bg-brand-hover text-white" aria-labelledby="how-heading">
      <Container>
        <SectionHeading
          id="how-heading"
          eyebrow="A simpler path to the right find"
          title="How MishBaby works"
          description="We help organize the discovery journey. The retailer you select handles the purchase, payment, shipping, and fulfillment."
          className="[&_h2]:text-white [&_p]:text-cyan-50 [&>p:first-child]:text-cyan-200"
        />
        <ol className="mt-12 grid gap-5 lg:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-card border border-white/20 bg-white/10 p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-brand-hover">
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-bold text-cyan-200">0{index + 1}</span>
              </div>
              <h3 className="mt-8 text-xl font-bold">{step.title}</h3>
              <p className="mt-3 leading-7 text-cyan-50">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
