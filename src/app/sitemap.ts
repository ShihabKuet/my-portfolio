import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/mdx";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const blogUrls = posts.map((post) => ({
    url:          `https://shanjidarefin.vercel.app/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority:     0.7,
  }));

  return [
    {
      url:             "https://shanjidarefin.vercel.app",
      lastModified:    new Date(),
      changeFrequency: "weekly",
      priority:        1.0,
    },
    {
      url:             "https://shanjidarefin.vercel.app/blog",
      lastModified:    new Date(),
      changeFrequency: "weekly",
      priority:        0.8,
    },
    ...blogUrls,
  ];
}