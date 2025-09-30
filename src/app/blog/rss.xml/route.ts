import { getAllPosts } from "@/lib/mdx";

export async function GET() {
  const posts = getAllPosts();
  const baseUrl = "https://www.mishbaby.com";

  const rssItems = posts
    .map((post) => {
      return `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <description><![CDATA[${post.excerpt}]]></description>
        <link>${baseUrl}/blog/${post.slug}</link>
        <guid>${baseUrl}/blog/${post.slug}</guid>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        <category>${post.categoryLabel}</category>
      </item>
    `;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>MishBaby Blog - Parenting Tips & Guides</title>
      <link>${baseUrl}/blog</link>
      <description>Expert parenting advice, baby care tips, and product guides for new parents</description>
      <language>en-us</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
      ${rssItems}
    </channel>
  </rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
