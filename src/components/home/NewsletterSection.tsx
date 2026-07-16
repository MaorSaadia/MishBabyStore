import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

import Container from "@/components/ui/Container";

export default function NewsletterSection() {
  return (
    <section className="pb-16 sm:pb-20 lg:pb-24" aria-labelledby="newsletter-heading">
      <Container>
        <div className="flex flex-col gap-6 rounded-panel bg-ink p-6 text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12">
          <div className="max-w-2xl">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-cyan-200">
              <Mail className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 id="newsletter-heading" className="mt-6 text-2xl font-bold sm:text-3xl">
              Thoughtful baby finds, without the noise
            </h2>
            <p className="mt-3 leading-7 text-slate-300">
              Helpful baby finds, guides, and recommendations delivered to your inbox. Email updates are coming soon; explore the latest guides in the meantime.
            </p>
          </div>
          <Link href="/blog" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-white px-6 text-sm font-bold text-ink transition hover:bg-brand-soft lg:self-auto">
            Read buying guides <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
