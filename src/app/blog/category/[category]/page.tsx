import type { Metadata } from "next";
import Link from "next/link";
import { getPostsByCategory, getAllCategories } from "@/lib/mdx";
import { notFound } from "next/navigation";

const categoryLabels: Record<string, string> = {
  feeding: "Feeding & Nutrition",
  sleep: "Sleep & Routines",
  safety: "Safety",
  "product-guides": "Product Guides",
  development: "Development & Milestones",
};

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const label = categoryLabels[params.category] || params.category;

  return {
    title: `${label} - Parenting Tips`,
    description: `Expert advice and guides about ${label.toLowerCase()} for new parents`,
  };
}

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const posts = getPostsByCategory(params.category);
  const categoryLabel = categoryLabels[params.category] || params.category;

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 py-12">
        <div className="container mx-auto px-4 md:px-8">
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-cyan-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-cyan-600">
              Blog
            </Link>
            <span>/</span>
            <span className="text-gray-900">{categoryLabel}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {categoryLabel}
          </h1>
          <p className="text-xl text-gray-600">
            {posts.length} {posts.length === 1 ? "article" : "articles"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="relative h-48 w-full bg-gradient-to-br from-cyan-100 to-blue-100" />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-cyan-600 bg-cyan-50 px-2 py-1 rounded">
                      {post.categoryLabel}
                    </span>
                    <span className="text-sm text-gray-500">
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-cyan-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <time className="text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
