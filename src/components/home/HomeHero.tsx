import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";

export default function HomeHero() {
  return (
    <section className="overflow-hidden bg-surface" aria-labelledby="home-hero-title">
      <Container className="grid min-w-0 grid-cols-[minmax(0,1fr)] items-center gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 lg:py-20">
        <div className="relative z-10 min-w-0">
          <p className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-200 bg-brand-soft px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-hover sm:text-sm sm:tracking-[0.14em]">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Baby finds, thoughtfully organized
          </p>
          <h1
            id="home-hero-title"
            className="text-balance text-4xl font-extrabold tracking-[-0.035em] text-ink sm:text-5xl sm:leading-[1.08] lg:text-6xl"
          >
            Everything Your Baby Needs.
            <span className="block text-brand-hover">Every Store in One Place.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-secondary sm:text-xl">
            Discover trusted baby products, explore helpful recommendations, and
            choose the shopping option that works best for your family.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="brand">
              <Link href="/list?cat=all-products">
                Explore Products <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="brandOutline">
              <Link href="/#categories">Shop by Category</Link>
            </Button>
          </div>
          <p className="mt-6 max-w-xl text-sm leading-6 text-ink-muted">
            MishBaby helps families discover products. Product availability varies,
            and purchases are completed with the selected store.
          </p>
        </div>

        <div className="relative mx-auto min-w-0 w-full max-w-xl lg:max-w-none">
          <div className="absolute -left-5 top-8 h-28 w-28 rounded-full bg-cyan-100" aria-hidden="true" />
          <div className="absolute -right-6 bottom-8 h-36 w-36 rounded-full bg-sky-100" aria-hidden="true" />
          <div className="relative aspect-[5/4] overflow-hidden rounded-panel border border-cyan-100 bg-sky-100 shadow-elevated">
            <Image
              src="/about-us.png"
              alt="A parent sharing mealtime with their baby"
              fill
              priority
              sizes="(max-width: 1023px) 92vw, 46vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-4 left-4 max-w-[15rem] rounded-card border border-line bg-white p-4 shadow-card sm:left-8 sm:max-w-xs">
            <p className="text-sm font-bold text-ink">Made for real family decisions</p>
            <p className="mt-1 text-xs leading-5 text-ink-secondary">
              Helpful context first, shopping options second.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
