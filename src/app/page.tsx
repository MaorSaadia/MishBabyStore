import type { Metadata } from "next";
import { Suspense } from "react";

import BuyingGuides from "@/components/home/BuyingGuides";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HomeHero from "@/components/home/HomeHero";
import HowItWorks from "@/components/home/HowItWorks";
import NeedGrid from "@/components/home/NeedGrid";
import NewsletterSection from "@/components/home/NewsletterSection";
import RetailerSection from "@/components/home/RetailerSection";
import TrustSection from "@/components/home/TrustSection";
import Container from "@/components/ui/Container";
import { getAllPosts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: {
    absolute: "MishBaby | Discover and Compare Baby Products",
  },
  description:
    "Discover curated baby products, helpful buying guides, and shopping options across trusted retailers and baby brands.",
  alternates: {
    canonical: "https://www.mishbaby.com",
  },
  openGraph: {
    title: "MishBaby | Discover and Compare Baby Products",
    description:
      "Discover curated baby products, helpful buying guides, and shopping options for your family.",
    url: "https://www.mishbaby.com",
  },
};

function FeaturedProductsFallback() {
  return (
    <section className="section-space bg-page" aria-label="Loading featured products">
      <Container>
        <div className="h-4 w-36 animate-pulse rounded bg-cyan-100 motion-reduce:animate-none" />
        <div className="mt-4 h-10 w-72 max-w-full animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="aspect-[3/4] animate-pulse rounded-card bg-slate-200 motion-reduce:animate-none" />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default function HomePage() {
  const posts = getAllPosts()
    .filter((post) => post.title && post.excerpt && post.categoryLabel)
    .slice(0, 3);

  return (
    <main>
      <HomeHero />
      <CategoryGrid />
      <NeedGrid />
      <Suspense fallback={<FeaturedProductsFallback />}>
        <FeaturedProducts
          categoryId={process.env.FEATURED_PRODUCTS_FEATURED_ALL_CATEGORY_ID}
          limit={8}
        />
      </Suspense>
      <RetailerSection />
      <HowItWorks />
      <BuyingGuides posts={posts} />
      <TrustSection />
      <NewsletterSection />
    </main>
  );
}
