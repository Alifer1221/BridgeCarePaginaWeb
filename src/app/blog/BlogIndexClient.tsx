"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Newsreader } from "next/font/google";
import { BLOG_CATEGORIES, BlogPost, isLivePost } from "@/lib/db";
import { LINKEDIN_URL } from "@/lib/contact";
import { useBlogPosts, useSpecialties } from "@/lib/useStoredData";
import { useLanguage } from "@/context/LanguageContext";

const serif = Newsreader({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

/* The blog as a magazine, design board BL1+, kept simple:
   1. Lead story: the post marked featured, else the newest.
   2. Latest: the next four newest, any category.
   3. All articles, in publication order.
   Finding (design board C2): a search field and a "Filter" panel with the
   specialties (read from the site, so a new specialty shows up on its own)
   and the fixed topics, several at a time. While filtering, the page shows
   only the matching articles. */

const FALLBACK = "https://images.unsplash.com/photo-1512250431446-d0b4b57b27ec?auto=format&fit=crop&q=80&w=1600";

export default function BlogIndex() {
  const { language } = useLanguage();
  const es = language === "es";
  const all = useBlogPosts();
  const specialties = useSpecialties();
  const [sel, setSel] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // The panel closes with Escape or a click outside it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  // Drafts, posts in medical review and scheduled posts not yet due stay off the site.
  const sorted = all.filter((p) => isLivePost(p)).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const norm = (v: string) => v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const query = norm(q.trim());
  const filtering = sel.length > 0 || query.length > 0;
  const posts = sorted.filter(
    (p) =>
      (sel.length === 0 || sel.includes(p.category)) &&
      (!query ||
        norm([p.title, p.titleEn, p.excerpt, p.excerptEn, p.category, p.categoryEn].join(" ")).includes(query)),
  );

  // Filter groups: every specialty on the site, then the blog's own topics
  // (and any other category a post uses), each with its article count.
  const count = (c: string) => sorted.filter((p) => p.category === c).length;
  const specGroup = specialties.map((sp) => ({ es: sp.name, en: sp.nameEn || sp.name }));
  const topicGroup = [
    ...BLOG_CATEGORIES.filter((c) => !specGroup.some((g) => g.es === c.es)),
    ...Array.from(new Set(sorted.map((p) => p.category)))
      .filter((c) => !specGroup.some((g) => g.es === c) && !BLOG_CATEGORIES.some((g) => g.es === c))
      .map((c) => ({ es: c, en: sorted.find((p) => p.category === c)?.categoryEn || c })),
  ];
  const label = (c: string) => [...specGroup, ...topicGroup].find((g) => g.es === c)?.[es ? "es" : "en"] || c;
  const toggle = (c: string) => setSel(sel.includes(c) ? sel.filter((v) => v !== c) : [...sel, c]);

  const fmtDate = (d: string) =>
    new Date(`${d}T12:00:00`).toLocaleDateString(es ? "es-CO" : "en-US", { day: "numeric", month: "short", year: "numeric" });

  const used = new Set<string>();
  const take = (list: BlogPost[], n: number) => {
    const out = list.filter((p) => !used.has(p.id)).slice(0, n);
    out.forEach((p) => used.add(p.id));
    return out;
  };
  const lead = filtering ? undefined : take([...posts.filter((p) => p.featured), ...posts], 1)[0];
  const latest = filtering ? [] : take(posts, 4);
  // The archive: every article, in publication order.
  const archive = posts;

  const t = (p: BlogPost) => (es ? p.title : p.titleEn || p.title);
  const x = (p: BlogPost) => (es ? p.excerpt : p.excerptEn || p.excerpt);
  const meta = (p: BlogPost) => (
    <span className="bl-meta">
      <span>{(es ? p.category : p.categoryEn || p.category).toUpperCase()}</span>
      {p.readMinutes && (
        <span className="bl-min">
          {p.readMinutes} {es ? "MIN DE LECTURA" : "MIN READ"}
        </span>
      )}
    </span>
  );
  const photo = (p: BlogPost, className: string) => (
    <span className={`bl-ph ${className}`} aria-hidden="true">
      <span style={{ backgroundImage: `url(${p.image || FALLBACK})` }} />
    </span>
  );

  return (
    <div className="bl">
      <div className="bl-inner">
        <header className="bl-head">
          <h1>
            {es ? "Guía" : "The"} <strong>{es ? "Bridge Care." : "Bridge Care guide."}</strong>
          </h1>
          <div className="bl-find" ref={panelRef}>
            <label className="bl-search">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={es ? "Busca un tema, procedimiento o ciudad…" : "Search a topic, procedure or city…"}
                aria-label={es ? "Buscar en el blog" : "Search the blog"}
              />
            </label>
            <button type="button" className="bl-filter-btn" aria-expanded={open} aria-controls="bl-filter" onClick={() => setOpen(!open)}>
              {es ? "Filtrar" : "Filter"}
              {sel.length > 0 && <span className="bl-badge">{sel.length}</span>}
            </button>
            {open && (
              <div className="bl-panel" id="bl-filter" role="dialog" aria-label={es ? "Filtrar artículos" : "Filter articles"}>
                {[
                  { title: es ? "ESPECIALIDADES" : "SPECIALTIES", items: specGroup },
                  { title: es ? "TEMAS" : "TOPICS", items: topicGroup },
                ].map((g) => (
                  <div key={g.title} className="bl-group">
                    <span className="bl-label">{g.title}</span>
                    <div className="bl-chips">
                      {g.items.map((c) => (
                        <button
                          key={c.es}
                          type="button"
                          className={`bl-chip-btn${sel.includes(c.es) ? " is-on" : ""}`}
                          aria-pressed={sel.includes(c.es)}
                          onClick={() => toggle(c.es)}
                        >
                          {es ? c.es : c.en} <span>{count(c.es)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="bl-panel-foot">
                  <button type="button" className="bl-clear" onClick={() => setSel([])}>
                    {es ? "Limpiar" : "Clear"}
                  </button>
                  <button type="button" className="bl-see" onClick={() => setOpen(false)}>
                    {es ? `Ver ${posts.length} artículos` : `See ${posts.length} articles`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {sel.length > 0 && (
          <div className="bl-active" aria-label={es ? "Filtros activos" : "Active filters"}>
            {sel.map((c) => (
              <span key={c} className="bl-tag">
                {label(c)}
                <button type="button" onClick={() => toggle(c)} aria-label={es ? `Quitar ${label(c)}` : `Remove ${label(c)}`}>
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {filtering && posts.length === 0 ? (
          <p className="bl-empty">
            {es
              ? "No hay artículos con esa búsqueda todavía. Prueba con otra palabra o quita un filtro."
              : "No articles match yet. Try another word or remove a filter."}
          </p>
        ) : !lead ? null : (
          <section className="bl-top">
            <Link href={`/blog/${lead.id}`} className="bl-lead">
              {photo(lead, "bl-lead-ph")}
              {meta(lead)}
              <span className={`bl-lead-title ${serif.className}`}>{t(lead)}</span>
              <span className="bl-lead-x">{x(lead)}</span>
            </Link>
            {latest.length > 0 && (
              <div className="bl-latest">
                <span className="bl-label">{es ? "LO MÁS RECIENTE" : "LATEST"}</span>
                {latest.map((p) => (
                  <Link key={p.id} href={`/blog/${p.id}`} className="bl-row">
                    {photo(p, "bl-row-ph")}
                    <span className="bl-row-text">
                      {meta(p)}
                      <span className="bl-row-title">{t(p)}</span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {archive.length > 0 && (
          <section className="bl-block">
            <div className="bl-block-head">
              <span className="bl-block-title">
                {filtering ? (es ? "Resultados" : "Results") : es ? "Todos los" : "All"}{" "}
                {!filtering && <strong>{es ? "artículos" : "articles"}</strong>}
              </span>
              <span className="bl-block-note">
                {es ? `${archive.length} artículos, del más reciente al más antiguo.` : `${archive.length} articles, newest first.`}
              </span>
            </div>
            <ol className="bl-archive">
              {archive.map((p) => (
                <li key={p.id}>
                  <Link href={`/blog/${p.id}`} className="bl-arch">
                    <time dateTime={p.date} className="bl-arch-date">
                      {fmtDate(p.date)}
                    </time>
                    {photo(p, "bl-arch-ph")}
                    <span className="bl-arch-text">
                      {meta(p)}
                      <span className="bl-row-title">{t(p)}</span>
                      <span className="bl-arch-x">{x(p)}</span>
                    </span>
                    <span className="bl-arch-go" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}

        <aside className="bl-follow">
          <span>
            <strong>{es ? "Una guía cada semana." : "A new guide every week."}</strong>{" "}
            <span>{es ? "Cada artículo, resumido también en LinkedIn." : "Every article, summed up on LinkedIn too."}</span>
          </span>
          {LINKEDIN_URL && (
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="bl-li">
              in&nbsp; {es ? "Seguir en LinkedIn" : "Follow on LinkedIn"}
            </a>
          )}
        </aside>
      </div>

      <style jsx>{`
        .bl {
          background: var(--negro-suave);
          color: #101a18;
          font-family: "Manrope", var(--font-sans);
        }
        .bl-inner {
          display: flex;
          flex-direction: column;
          gap: clamp(2rem, 4vw, 2.6rem);
          max-width: 1200px;
          margin: 0 auto;
          padding: clamp(6.5rem, 12vh, 8rem) clamp(1.25rem, 5vw, 3rem) 5rem;
        }
        .bl-head {
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
        }
        .bl-head h1 {
          margin: 0;
          color: #101a18;
          -webkit-text-fill-color: currentColor;
          background: none;
          font-family: "Manrope", var(--font-sans);
          font-size: clamp(2.6rem, 5vw, 3.75rem);
          font-weight: 300;
          line-height: 1;
          letter-spacing: -0.05em;
        }
        .bl-head h1 strong {
          color: #0a4a42;
          font-weight: 700;
        }
        .bl-head {
          flex-direction: row;
          flex-wrap: wrap;
          align-items: flex-end;
          justify-content: space-between;
        }
        .bl-find {
          position: relative;
          z-index: 5;
          display: flex;
          gap: 10px;
        }
        .bl-search {
          display: flex;
          align-items: center;
          gap: 10px;
          width: min(380px, 60vw);
          padding: 0 18px;
          border-radius: 999px;
          background: #fff;
          box-shadow: 0 16px 36px -28px rgba(10, 40, 36, 0.4);
          color: #8a918f;
          font-size: 1.1rem;
        }
        .bl-search:focus-within {
          box-shadow: 0 0 0 2px #1d7a6e;
        }
        .bl-search input {
          flex: 1;
          min-width: 0;
          padding: 13px 0;
          border: 0;
          outline: none;
          background: none;
          color: #101a18;
          font-family: inherit;
          font-size: 0.95rem;
        }
        .bl-filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 13px 20px;
          border: 0;
          border-radius: 999px;
          background: #0a4a42;
          color: #fff;
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
        }
        .bl-filter-btn:focus-visible,
        .bl-chip-btn:focus-visible {
          outline: 2px solid #1d7a6e;
          outline-offset: 2px;
        }
        .bl-badge {
          display: flex;
          width: 22px;
          height: 22px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #fff;
          color: #0a4a42;
          font-size: 0.75rem;
        }
        .bl-panel {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: min(640px, calc(100vw - 2.5rem));
          padding: 1.5rem;
          border-radius: 24px;
          background: #fff;
          box-shadow: 0 40px 80px -40px rgba(10, 40, 36, 0.5), 0 0 0 1px rgba(29, 122, 110, 0.08);
          animation: bl-drop 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .bl-group {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .bl-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .bl-chip-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 14px;
          border: 1px solid rgba(29, 122, 110, 0.18);
          border-radius: 999px;
          background: #fff;
          color: #2a3432;
          font-family: inherit;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .bl-chip-btn span {
          opacity: 0.55;
        }
        .bl-chip-btn:hover {
          border-color: #0a4a42;
        }
        .bl-chip-btn.is-on {
          border-color: #0a4a42;
          background: #0a4a42;
          color: #fff;
        }
        .bl-panel-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.9rem;
          border-top: 1px solid rgba(29, 122, 110, 0.12);
        }
        .bl-clear {
          border: 0;
          background: none;
          color: #515856;
          font-family: inherit;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
        }
        .bl-see {
          padding: 11px 20px;
          border: 0;
          border-radius: 999px;
          background: #0a4a42;
          color: #fff;
          font-family: inherit;
          font-size: 0.88rem;
          font-weight: 800;
          cursor: pointer;
        }
        .bl-active {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: -1rem;
        }
        .bl-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 8px 6px 14px;
          border-radius: 999px;
          background: #eef5f1;
          color: #0a4a42;
          font-size: 0.82rem;
          font-weight: 800;
        }
        .bl-tag button {
          border: 0;
          background: none;
          color: #0a4a42;
          font-size: 1rem;
          line-height: 1;
          cursor: pointer;
        }
        @keyframes bl-drop {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .bl-empty {
          margin: 2rem 0;
          color: #515856;
        }

        .bl :global(a) {
          color: inherit;
          text-decoration: none;
        }
        .bl :global(.bl-ph) {
          position: relative;
          display: block;
          overflow: hidden;
          background: #d8d0c3;
        }
        .bl :global(.bl-ph > span) {
          position: absolute;
          inset: 0;
          background-position: center;
          background-size: cover;
          transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .bl :global(a:hover .bl-ph > span) {
          transform: scale(1.05);
        }
        .bl :global(.bl-meta) {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          color: #1d7a6e;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.06em;
        }
        .bl :global(.bl-min) {
          color: #8a918f;
        }

        .bl-top {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
          gap: clamp(2rem, 4vw, 3.5rem);
        }
        .bl :global(.bl-lead) {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }
        .bl :global(.bl-lead-ph) {
          height: clamp(240px, 32vw, 400px);
          border-radius: 24px;
        }
        .bl-lead-title {
          font-size: clamp(1.9rem, 3.2vw, 2.75rem);
          font-weight: 500;
          line-height: 1.08;
          letter-spacing: -0.02em;
          transition: color 0.2s ease;
        }
        .bl :global(.bl-lead:hover) .bl-lead-title,
        .bl :global(.bl-row:hover) .bl-row-title {
          color: #0a4a42;
        }
        .bl-lead-x {
          color: #515856;
          font-size: 1.06rem;
          line-height: 1.55;
        }
        .bl-latest {
          display: flex;
          flex-direction: column;
        }
        .bl-label {
          display: block;
          padding-bottom: 0.4rem;
          color: #8a918f;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.14em;
        }
        .bl :global(.bl-row) {
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: 1rem;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(29, 122, 110, 0.12);
        }
        .bl :global(.bl-row-ph) {
          height: 84px;
          border-radius: 14px;
        }
        .bl-row-text {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .bl-row-title {
          font-size: 1.06rem;
          font-weight: 700;
          line-height: 1.25;
          transition: color 0.2s ease;
        }

        .bl-block {
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
          padding-top: 1.9rem;
          border-top: 1px solid rgba(29, 122, 110, 0.16);
        }
        .bl-block-head {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          justify-content: space-between;
          gap: 0.75rem 2rem;
        }
        .bl-block-title {
          display: block;
          font-size: clamp(1.7rem, 3vw, 2.4rem);
          font-weight: 300;
          line-height: 1.05;
          letter-spacing: -0.04em;
        }
        .bl-block-title strong {
          font-weight: 700;
        }
        .bl-block-note {
          max-width: 360px;
          color: #515856;
          font-size: 0.9rem;
          line-height: 1.5;
        }
        .bl-archive {
          margin: 0;
          padding: 0;
          list-style: none;
          border-top: 1px solid rgba(29, 122, 110, 0.12);
        }
        .bl :global(.bl-arch) {
          display: grid;
          grid-template-columns: 110px 150px minmax(0, 1fr) 28px;
          gap: 1.5rem;
          align-items: center;
          padding: 1.1rem 0.5rem;
          border-bottom: 1px solid rgba(29, 122, 110, 0.12);
          transition: background 0.25s ease, padding-left 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .bl :global(.bl-arch:hover) {
          padding-left: 1rem;
          background: rgba(255, 255, 255, 0.6);
        }
        .bl :global(.bl-arch:hover) .bl-row-title {
          color: #0a4a42;
        }
        .bl-arch-date {
          color: #8a918f;
          font-size: 0.82rem;
          font-weight: 700;
        }
        .bl :global(.bl-arch-ph) {
          height: 96px;
          border-radius: 14px;
        }
        .bl-arch-text {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .bl-arch-x {
          color: #515856;
          font-size: 0.9rem;
          line-height: 1.45;
        }
        .bl-arch-go {
          color: #1d7a6e;
          font-size: 1.2rem;
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .bl :global(.bl-arch:hover) .bl-arch-go {
          opacity: 1;
        }
        .bl-follow {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.4rem 1.75rem;
          border-radius: 22px;
          background: #fff;
          font-size: 1rem;
          line-height: 1.4;
        }
        .bl-follow span span {
          color: #515856;
        }
        .bl-follow :global(.bl-li) {
          padding: 0.75rem 1.25rem;
          border-radius: 999px;
          background: #0a66c2;
          color: #fff;
          font-size: 0.88rem;
          font-weight: 800;
        }

        @media (max-width: 700px) {
          .bl-find {
            width: 100%;
          }
          .bl-search {
            flex: 1;
            width: auto;
          }
          .bl-panel {
            right: auto;
            left: 0;
            width: 100%;
            box-sizing: border-box;
          }
        }
        @media (max-width: 900px) {
          .bl-top {
            grid-template-columns: 1fr;
          }
          .bl :global(.bl-row) {
            grid-template-columns: 96px 1fr;
          }
          .bl :global(.bl-row-ph) {
            height: 72px;
          }
          .bl :global(.bl-arch) {
            grid-template-columns: 96px minmax(0, 1fr);
            gap: 1rem;
          }
          .bl-arch-date {
            grid-column: 1 / -1;
          }
          .bl :global(.bl-arch-ph) {
            height: 72px;
          }
          .bl-arch-x,
          .bl-arch-go {
            display: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .bl :global(.bl-ph > span) {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
