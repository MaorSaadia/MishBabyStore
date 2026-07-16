import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import type { BlogPost } from "@/lib/mdx";

interface BuyingGuidesProps {
  posts: BlogPost[];
}

export default function BuyingGuides({ posts }: BuyingGuidesProps) {
  return (
    <section className="section-space bg-page" aria-labelledby="guides-heading">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            id="guides-heading"
            eyebrow="Helpful before you shop"
            title="Guides for everyday parent decisions"
            description="Clear, practical reading to help you understand what matters before choosing a product."
          />
          <Link href="/blog" className="inline-flex min-h-11 items-center gap-2 self-start text-sm font-bold text-brand-hover hover:text-cyan-800">
            Browse all guides <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {posts.map((post, index) => (
            <article key={post.slug} className="group flex min-h-80 flex-col rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-hover">
                  <BookOpen className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-ink-muted">{post.categoryLabel}</span>
              </div>
              <h3 className="mt-8 text-xl font-bold leading-7 text-ink sm:text-2xl">
                <Link href={`/blog/${post.slug}`} className="hover:text-brand-hover">{post.title}</Link>
              </h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink-secondary">{post.excerpt}</p>
              <div className="mt-auto flex items-center justify-between border-t border-line pt-5 text-sm">
                <span className="text-ink-muted">{post.readTime}</span>
                <Link href={`/blog/${post.slug}`} className="flex items-center gap-2 font-bold text-brand-hover" aria-label={`Read ${post.title}`}>
                  Read guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
