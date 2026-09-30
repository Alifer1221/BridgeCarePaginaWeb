import type { Metadata } from "next";
import { defaultBlogPosts } from "@/lib/db";
import BlogPostClient from "./BlogPostClient";

interface BlogPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = defaultBlogPosts.find((p) => p.id === id);

  if (!post) {
    return {
      title: "Artículo no encontrado | Bridge Care",
      robots: { index: false, follow: false },
    };
  }

  const title = `${post.title} | Bridge Care Blog`;

  return {
    title,
    description: post.excerpt,
    openGraph: { title, description: post.excerpt },
  };
}

export default function BlogPage({ params }: BlogPageProps) {
  return <BlogPostClient params={params} />;
}
