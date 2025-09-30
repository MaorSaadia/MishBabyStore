import Link from "next/link";
import Image from "next/image";

// Custom components to use in MDX files
export const MDXComponents = {
  // Custom heading with anchor links
  h2: ({ children, ...props }: any) => (
    <h2
      className="text-3xl font-bold text-gray-900 mt-8 mb-4 scroll-mt-20"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3
      className="text-2xl font-semibold text-gray-900 mt-6 mb-3 scroll-mt-20"
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, ...props }: any) => (
    <p className="text-lg text-gray-700 leading-relaxed mb-4" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-inside mb-4 space-y-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-inside mb-4 space-y-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="text-lg text-gray-700 ml-4" {...props}>
      {children}
    </li>
  ),
  a: ({ children, href, ...props }: any) => {
    const isInternal = href?.startsWith("/");
    const isAnchor = href?.startsWith("#");

    if (isInternal || isAnchor) {
      return (
        <Link
          href={href}
          className="text-cyan-600 hover:text-cyan-700 underline"
          {...props}
        >
          {children}
        </Link>
      );
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-600 hover:text-cyan-700 underline"
        {...props}
      >
        {children}
      </a>
    );
  },
  img: ({ src, alt, ...props }: any) => (
    <div className="my-8 rounded-lg overflow-hidden">
      <Image
        src={src}
        alt={alt || ""}
        width={800}
        height={600}
        className="w-full h-auto"
        {...props}
      />
    </div>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote
      className="border-l-4 border-cyan-500 pl-4 py-2 my-6 bg-gray-50 italic text-gray-700"
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ children, ...props }: any) => (
    <code
      className="bg-gray-100 text-cyan-600 px-2 py-1 rounded text-sm font-mono"
      {...props}
    >
      {children}
    </code>
  ),
  pre: ({ children, ...props }: any) => (
    <pre
      className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6"
      {...props}
    >
      {children}
    </pre>
  ),

  // Custom components for callouts
  CalloutBox: ({ children, type = "info" }: any) => {
    const styles = {
      info: "bg-blue-50 border-blue-200 text-blue-900",
      warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
      success: "bg-green-50 border-green-200 text-green-900",
      tip: "bg-purple-50 border-purple-200 text-purple-900",
    };

    return (
      <div
        className={`border-l-4 p-4 my-6 rounded-r-lg ${
          styles[type as keyof typeof styles]
        }`}
      >
        {children}
      </div>
    );
  },

  // Product card component for inline product mentions
  ProductCard: ({ title, href, price }: any) => (
    <div className="my-6 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <Link href={href} className="block">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
        {price && <p className="text-cyan-600 font-bold text-xl">${price}</p>}
        <span className="text-cyan-600 text-sm hover:underline mt-2 inline-block">
          View Product →
        </span>
      </Link>
    </div>
  ),
};
