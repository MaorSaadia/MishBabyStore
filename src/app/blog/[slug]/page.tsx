import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllSlugs } from "@/lib/mdx";
import { MDXComponents } from "@/components/MDXComponents";
import ProductList from "@/components/ProductList";
import RelatedPosts from "@/components/RelatedPosts";

// Generate static params for all blog posts
export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
    alternates: {
      canonical: `https://www.mishbaby.com/blog/${params.slug}`,
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs for SEO */}
      <div className="container mx-auto px-4 md:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-cyan-600">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-cyan-600">
            Blog
          </Link>
          <span>/</span>
          <Link
            href={`/blog/category/${post.category}`}
            className="hover:text-cyan-600"
          >
            {post.categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-gray-900 truncate">{post.title}</span>
        </nav>
      </div>

      {/* Article Header */}
      <article className="container mx-auto px-4 md:px-8 max-w-4xl py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-medium text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">
              {post.categoryLabel}
            </span>
            <time className="text-sm text-gray-500">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className="text-sm text-gray-500">• {post.readTime}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>By {post.author}</span>
          </div>
        </header>

        {/* Article Content - MDX rendered here */}
        <div className="prose prose-lg max-w-none mb-12">
          <MDXRemote source={post.content} components={MDXComponents} />
        </div>

        {/* Related Products Section */}
        {post.relatedProducts && (
          <div className="border-t border-gray-200 pt-12 mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Shop Related Products
            </h2>
            <ProductList categoryId={post.relatedProducts} limit={4} />
            <div className="flex justify-center mt-6">
              <Link
                href={`/list?cat=${post.category}`}
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white rounded-full hover:from-cyan-600 hover:to-cyan-500 transition-all"
              >
                View All {post.categoryLabel} Products
              </Link>
            </div>
          </div>
        )}
      </article>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            dateModified: post.date,
            author: {
              "@type": "Organization",
              name: post.author,
            },
            publisher: {
              "@type": "Organization",
              name: "MishBaby",
              logo: {
                "@type": "ImageObject",
                url: "https://www.mishbaby.com/logo.png",
              },
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://www.mishbaby.com/blog/${params.slug}`,
            },
          }),
        }}
      />
    </div>
  );
}
