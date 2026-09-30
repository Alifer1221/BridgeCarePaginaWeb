"use client";

import React, { use } from "react";
import Link from "next/link";
import { isLivePost } from "@/lib/db";
import { renderBlogContent } from "@/lib/blogMarkdown";
import { useBlogPosts } from "@/lib/useStoredData";
import { useLanguage } from "@/context/LanguageContext";

interface BlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { language } = useLanguage();
  const { id } = use(params);
  // Derived on every render: always in sync with the id in the URL, including
  // client-side navigation between posts, and with whatever the admin panel
  // last saved. The hook keeps the hydration pass matching the server.
  const post = useBlogPosts().find((p) => p.id === id && isLivePost(p)) || null;

  if (!post) {
    return (
      <div className="container text-center" style={{ padding: "10rem 1.5rem" }}>
        <h2>{language === "es" ? "Artículo no encontrado" : "Article not found"}</h2>
        <p>
          {language === "es"
            ? "El artículo solicitado no existe o fue removido del blog."
            : "The requested article does not exist or was removed from the blog."}
        </p>
        <Link href="/blog" className="btn btn-primary">
          {language === "es" ? "Volver al Blog" : "Back to Blog"}
        </Link>
      </div>
    );
  }

  const title = language === "es" ? post.title : post.titleEn;
  const content = language === "es" ? post.content : post.contentEn;
  const category = language === "es" ? post.category : post.categoryEn;

  return (
    <div className="blog-post-page">
      <section className="section blog-post-hero">
        <div className="container">
          <Link href="/blog" className="back-link">
            &larr; {language === "es" ? "Volver al blog" : "Back to blog"}
          </Link>
          <span className="post-badge">{category}</span>
          <h1>{title}</h1>
          <div className="post-meta">
            <span>{post.author}</span>
            <span>•</span>
            <span>{post.date}</span>
          </div>
        </div>
      </section>

      <section className="blog-post-content-section">
        <div className="container">
          <article className="detail-card glass-card post-body">
            {renderBlogContent(content, language === "es" ? "En 30 segundos" : "In 30 seconds")}
          </article>

          <div className="post-cta detail-card glass-card">
            <h3>
              {language === "es"
                ? "¿Listo para dar el siguiente paso?"
                : "Ready to take the next step?"}
            </h3>
            <p>
              {language === "es"
                ? "Cuéntanos qué necesitas y recibe tu plan personalizado en menos de 24 horas."
                : "Tell us what you need and get your personalized plan in under 24 hours."}
            </p>
            <Link href="/contacto" className="btn btn-accent">
              {language === "es" ? "Agendar Cita" : "Book Now"}
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .blog-post-hero {
          padding-bottom: 2rem;
        }
        .back-link {
          display: inline-block;
          color: var(--mint-accent);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }
        .back-link:hover {
          text-decoration: underline;
        }
        .post-badge {
          display: block;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--mint-accent);
          margin-bottom: 0.75rem;
        }
        .blog-post-hero h1 {
          font-size: 2.75rem;
          max-width: 800px;
          margin-bottom: 1rem;
        }
        .post-meta {
          display: flex;
          gap: 0.6rem;
          font-size: 0.9rem;
          color: var(--gris-texto);
        }
        .blog-post-content-section {
          padding-bottom: 6rem;
        }
        .post-body {
          padding: 2.5rem;
          max-width: 760px;
          margin-bottom: 2.5rem;
        }
        .post-body p {
          font-size: 1.05rem;
          line-height: 1.75;
          color: var(--blanco-hueso);
          margin-bottom: 1.25rem;
        }
        .post-body p:last-child {
          margin-bottom: 0;
        }
        /* The dashboard's markup (see lib/blogMarkdown). */
        .post-body :global(h2) {
          margin: 2rem 0 0.75rem;
          font-size: 1.6rem;
        }
        .post-body :global(h3) {
          margin: 1.5rem 0 0.5rem;
          font-size: 1.25rem;
        }
        .post-body :global(ul) {
          margin: 0 0 1.25rem 1.25rem;
          line-height: 1.7;
        }
        .post-body :global(blockquote) {
          margin: 1.5rem 0;
          padding-left: 1rem;
          border-left: 3px solid var(--mint-accent);
          font-style: italic;
        }
        .post-body :global(img) {
          width: 100%;
          margin: 1.5rem 0;
          border-radius: 16px;
        }
        .post-body :global(.md-summary) {
          margin: 0 0 1.5rem;
          padding: 1.25rem 1.5rem;
          border-radius: 16px;
          background: rgba(93, 202, 165, 0.08);
        }
        .post-body :global(.md-summary > span) {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--mint-accent);
        }
        .post-body :global(a) {
          color: var(--mint-accent);
          text-decoration: underline;
        }
        .post-cta {
          padding: 2.5rem;
          max-width: 760px;
          text-align: center;
        }
        .post-cta h3 {
          color: var(--white);
          font-size: 1.4rem;
          margin-bottom: 0.75rem;
        }
        .post-cta p {
          color: var(--gris-texto);
          margin-bottom: 1.5rem;
        }
      `}</style>
    </div>
  );
}
