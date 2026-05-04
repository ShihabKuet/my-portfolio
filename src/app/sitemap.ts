import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/mdx";
import { getAllProjects } from "@/lib/projects";

const baseUrl = "https://shanjid.bd";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const blogUrls = posts.map((post) => ({
    url:          `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority:     0.7,
  }));

  const projects = getAllProjects();
  const projectUrls = projects.map((p) => ({
    url:          `${baseUrl}/projects/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority:     0.6,
  }))

  return [
    {
      url:             `${baseUrl}`,
      lastModified:    new Date(),
      changeFrequency: "weekly",
      priority:        1.0,
    },
    {
      url:             `${baseUrl}/blog`,
      lastModified:    new Date(),
      changeFrequency: "weekly",
      priority:        0.8,
    },
    {
      url:             `${baseUrl}/projects`,
      lastModified:    new Date(),
      changeFrequency: "monthly",
      priority:        0.8,
    },
    ...blogUrls,
    ...projectUrls,
  ];
}