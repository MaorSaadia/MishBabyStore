import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";

interface RelatedPostsProps {
  currentSlug: string;
  category: string;
  limit?: number;
}

export default function RelatedPosts({
  currentSlug,
  category,
  limit = 3,
}: RelatedPostsProps) {
  const allPosts = getAllPosts();

  // Get posts from same category, excluding current post
  const relatedPosts = allPosts
    .filter((post) => post.category === category && post.slug !== currentSlug)
    .slice(0, limit);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-12 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Related Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
          >
            <div className="relative h-40 w-full bg-gradient-to-br from-cyan-100 to-blue-100" />
            <div className="p-4">
              <span className="text-xs font-medium text-cyan-600 bg-cyan-50 px-2 py-1 rounded">
                {post.categoryLabel}
              </span>
              <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2 group-hover:text-cyan-600 transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="mt-3 text-sm text-gray-500">{post.readTime}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
