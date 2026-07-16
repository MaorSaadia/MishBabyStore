import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products } from "@wix/stores";

import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductDiscoveryCard from "@/components/products/ProductDiscoveryCard";
import { wixClientServer } from "@/lib/wixClientServer";

interface FeaturedProductsProps {
  categoryId?: string;
  limit?: number;
}

export default async function FeaturedProducts({
  categoryId,
  limit = 8,
}: FeaturedProductsProps) {
  const wixClient = await wixClientServer();
  let query = wixClient.products.queryProducts().limit(limit);

  if (categoryId) {
    query = query.eq("collectionIds", categoryId);
  }

  const result = await query.descending("lastUpdated").find();

  return (
    <section className="section-space bg-page" aria-labelledby="featured-products-heading">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            id="featured-products-heading"
            eyebrow="Curated discovery"
            title="Featured baby finds"
            description="A small selection from the current MishBaby catalog, chosen to make browsing feel simple and useful."
          />
          <Link
            href="/list?cat=all-products"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-lg px-1 text-sm font-bold text-brand-hover hover:text-cyan-800 sm:self-auto"
          >
            View all products <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {result.items.length > 0 ? (
          <div className="mt-10 flex w-full min-w-0 gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible md:gap-5 lg:grid-cols-4">
            {result.items.map((product: products.Product) => {
              const productWithBrand = product as products.Product & { brand?: string };
              return (
                <div key={product._id || product.slug} className="w-[82vw] max-w-xs shrink-0 sm:w-auto sm:max-w-none">
                  <ProductDiscoveryCard
                    name={product.name || "Baby product"}
                    href={`/${product.slug}`}
                    image={
                      product.media?.mainMedia?.image?.url ||
                      product.media?.items?.[1]?.image?.url ||
                      "/product.png"
                    }
                    brand={productWithBrand.brand}
                    category="MishBaby find"
                    badge={product.ribbon === "New Arrival" ? "New arrival" : undefined}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-card border border-line bg-surface p-8 text-center text-ink-secondary">
            Featured products are temporarily unavailable. Browse the full catalog to keep exploring.
          </div>
        )}
      </Container>
    </section>
  );
}
