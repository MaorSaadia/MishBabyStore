import Link from "next/link";
import type { Metadata } from "next";

import { getAllPosts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Parenting Tips & Guides",
  description:
    "Expert parenting advice, baby care tips, product guides, and resources for new parents. Learn about feeding, sleep, safety, and child development.",
  openGraph: {
    title: "MishBaby Blog - Parenting Tips & Baby Care Guides",
    description: "Expert parenting advice and baby care tips for new parents",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 py-12">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Parenting Tips & Guides
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Expert advice on baby care, product guides, and everything you need
            to know as a new parent
          </p>
        </div>
      </div>

      {/* Blog Categories */}
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            href="/blog"
            className="px-4 py-2 rounded-full bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
          >
            All Posts
          </Link>
          <Link
            href="/blog/category/feeding"
            className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Feeding & Nutrition
          </Link>
          <Link
            href="/blog/category/sleep"
            className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Sleep & Routines
          </Link>
          <Link
            href="/blog/category/safety"
            className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Safety
          </Link>
          <Link
            href="/blog/category/product-guides"
            className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Product Guides
          </Link>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="relative h-48 w-full bg-gradient-to-br from-cyan-100 to-blue-100">
                  {/* Add actual images when available */}
                </div>
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
