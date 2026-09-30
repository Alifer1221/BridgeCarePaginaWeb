"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BLOG_CATEGORIES, BlogPost, saveBlogPosts } from "@/lib/db";
import { SITE_HOST } from "@/lib/contact";
import { plainText } from "@/lib/blogMarkdown";
import { useBlogPosts, useSpecialties } from "@/lib/useStoredData";

/* The blog dashboard, design boards D1 (article list) and D2 (editor with
   live SEO, LinkedIn and card previews). For now it saves where the rest of
   the admin saves (this browser's storage); when the site goes live the same
   screens will read and write the server instead. */

type Status = NonNullable<BlogPost["status"]>;
const STATUS: Record<Status, { es: string; bg: string; fg: string }> = {
  published: { es: "Publicado", bg: "#e5f3ec", fg: "#0a6b4a" },
  draft: { es: "Borrador", bg: "#f1eee8", fg: "#6b645a" },
  scheduled: { es: "Programado", bg: "#e8eefb", fg: "#2f55b5" },
  review: { es: "En revisión médica", bg: "#fbf0dd", fg: "#9a6412" },
};
const statusOf = (p: BlogPost): Status => p.status || "published";

const slugify = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);

const today = () => new Date().toISOString().slice(0, 10);
const fmt = (iso?: string) =>
  iso
    ? new Date(iso.length === 10 ? `${iso}T12:00:00` : iso).toLocaleString("es-CO", {
        day: "numeric",
        month: "short",
        year: "numeric",
        ...(iso.length > 10 ? { hour: "2-digit", minute: "2-digit" } : {}),
      })
    : "";

const EMPTY: BlogPost = {
  id: "",
  title: "",
  titleEn: "",
  excerpt: "",
  excerptEn: "",
  content: "",
  contentEn: "",
  author: "",
  date: "",
  category: "",
  categoryEn: "",
  status: "draft",
};

/** SEO checks, weighted to 100. Each says what to fix, in plain words. */
function seoChecks(p: BlogPost) {
  const title = p.seoTitle || `${p.title} | Bridge Care`;
  const desc = p.seoDescription || p.excerpt;
  const kw = (p.keyword || "").toLowerCase().trim();
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const text = plainText(p.content);
  const words = text ? text.split(" ").length : 0;
  const firstPara = norm(plainText(p.content.split(/\n\s*\n/).find((b) => b.trim() && !b.trim().startsWith(":::")) || ""));
  const checks = [
    { w: 15, ok: title.length >= 30 && title.length <= 60, t: `Título para Google entre 30 y 60 caracteres (lleva ${title.length})` },
    { w: 15, ok: desc.length >= 120 && desc.length <= 155, t: `Descripción entre 120 y 155 caracteres (lleva ${desc.length})` },
    { w: 10, ok: !!kw, t: "Define la palabra clave principal" },
    { w: 10, ok: !!kw && norm(title).includes(norm(kw)), t: "La palabra clave aparece en el título para Google" },
    { w: 10, ok: !!kw && firstPara.includes(norm(kw)), t: "La palabra clave aparece en el primer párrafo" },
    { w: 15, ok: words >= 600, t: `Contenido de al menos 600 palabras (lleva ${words})` },
    { w: 10, ok: !!p.image && !!p.imageAlt, t: p.image ? "La foto tiene texto alternativo" : "Agrega una foto de portada con texto alternativo" },
    { w: 5, ok: /\]\(\/(specialties|destinations)\//.test(p.content), t: "Enlaza a un procedimiento o destino del sitio" },
    { w: 5, ok: !!p.author && !!p.reviewedBy, t: "Autor y revisión médica asignados" },
    { w: 5, ok: !!p.titleEn && !!p.contentEn && p.contentEn !== p.content, t: "Versión en inglés completa" },
  ];
  return { checks, score: checks.reduce((s, c) => s + (c.ok ? c.w : 0), 0), title, desc };
}

const TOOLS: { label: string; before: string; after?: string; line?: boolean; tip: string }[] = [
  { label: "H2", before: "## ", line: true, tip: "Título de sección" },
  { label: "H3", before: "### ", line: true, tip: "Subtítulo" },
  { label: "B", before: "**", after: "**", tip: "Negrita" },
  { label: "I", before: "*", after: "*", tip: "Cursiva" },
  { label: "• Lista", before: "- ", line: true, tip: "Lista" },
  { label: "❝ Cita", before: "> ", line: true, tip: "Cita" },
  { label: "Enlace", before: "[", after: "](https://)", tip: "Enlace" },
  { label: "Imagen", before: "![descripción](", after: ")", tip: "Imagen por URL" },
  { label: "En 30 segundos", before: ":::resumen\n- ", after: "\n:::", tip: "Recuadro de resumen" },
  { label: "Fuente", before: "[Fuente: ", after: "](https://)", tip: "Cita una fuente" },
];

export default function BlogDashboardClient() {
  const router = useRouter();
  const posts = useBlogPosts();
  const specialties = useSpecialties();
  // Same gate as the rest of the admin, until the site gets real sign-in.
  // null on the server / first pass, then whether this browser is signed in.
  const authed = useSyncExternalStore(
    () => () => {},
    () => localStorage.getItem("bc_admin_auth") === "true",
    () => null,
  );
  const [view, setView] = useState<"list" | "edit">("list");
  const [form, setForm] = useState<BlogPost>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [lang, setLang] = useState<"es" | "en">("es");
  const [tab, setTab] = useState<"seo" | "li" | "prev">("seo");
  const [filter, setFilter] = useState<Status | "all">("all");
  const [q, setQ] = useState("");
  const [notice, setNotice] = useState("");
  const [scheduleAt, setScheduleAt] = useState("");
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (authed === false) router.replace("/admin");
  }, [authed, router]);

  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(() => setNotice(""), 2600);
    return () => window.clearTimeout(t);
  }, [notice]);

  if (!authed) return null;

  const categories = [
    ...specialties.map((s) => ({ es: s.name, en: s.nameEn || s.name })),
    ...BLOG_CATEGORIES.filter((c) => !specialties.some((s) => s.name === c.es)),
  ];
  const counts = (s: Status | "all") => (s === "all" ? posts.length : posts.filter((p) => statusOf(p) === s).length);
  const listed = [...posts]
    .filter((p) => filter === "all" || statusOf(p) === filter)
    .filter((p) => !q.trim() || `${p.title} ${p.category}`.toLowerCase().includes(q.trim().toLowerCase()))
    .sort((a, b) => ((b.updatedAt || b.date) > (a.updatedAt || a.date) ? 1 : -1));
  const avgSeo = posts.length ? Math.round(posts.reduce((s, p) => s + seoChecks(p).score, 0) / posts.length) : 0;
  const nextScheduled = posts
    .filter((p) => statusOf(p) === "scheduled" && p.publishAt)
    .sort((a, b) => ((a.publishAt || "") > (b.publishAt || "") ? 1 : -1))[0];

  const openNew = () => {
    setForm({ ...EMPTY });
    setEditingId(null);
    setLang("es");
    setTab("seo");
    setView("edit");
  };
  const openEdit = (p: BlogPost) => {
    setForm({ ...EMPTY, ...p });
    setEditingId(p.id);
    setLang("es");
    setTab("seo");
    setView("edit");
  };
  const set = (patch: Partial<BlogPost>) => setForm((f) => ({ ...f, ...patch }));

  const save = (status: Status, publishAt?: string) => {
    if (!form.title.trim()) {
      setNotice("Escribe un titular antes de guardar.");
      return;
    }
    if (!form.category.trim()) {
      setNotice("Elige una categoría.");
      return;
    }
    const id = editingId || form.id || slugify(form.title);
    if (!editingId && posts.some((p) => p.id === id)) {
      setNotice("Ya existe un artículo con esa URL. Cambia el titular o la URL.");
      return;
    }
    const wasLive = editingId ? statusOf(posts.find((p) => p.id === editingId) || form) === "published" : false;
    const next: BlogPost = {
      ...form,
      id,
      status,
      publishAt: status === "scheduled" ? publishAt : undefined,
      date: status === "published" && !wasLive ? today() : status === "scheduled" && publishAt ? publishAt.slice(0, 10) : form.date || today(),
      updatedAt: new Date().toISOString(),
      titleEn: form.titleEn || form.title,
      excerptEn: form.excerptEn || form.excerpt,
      contentEn: form.contentEn || form.content,
      categoryEn: categories.find((c) => c.es === form.category)?.en || form.categoryEn || form.category,
    };
    const list = editingId ? posts.map((p) => (p.id === editingId ? next : p)) : [next, ...posts];
    saveBlogPosts(list);
    setForm(next);
    setEditingId(id);
    setNotice(
      status === "published"
        ? "Publicado en el blog."
        : status === "scheduled"
          ? `Programado para el ${fmt(publishAt)}.`
          : status === "review"
            ? "Enviado a revisión médica."
            : "Borrador guardado.",
    );
  };
  const remove = (p: BlogPost) => {
    if (!window.confirm(`¿Eliminar “${p.title}”? No se puede deshacer.`)) return;
    saveBlogPosts(posts.filter((x) => x.id !== p.id));
    if (editingId === p.id) setView("list");
    setNotice("Artículo eliminado.");
  };

  // Toolbar: wraps the selection (or inserts at the start of the line).
  const tool = (t: (typeof TOOLS)[number]) => {
    const el = contentRef.current;
    const key = lang === "es" ? "content" : "contentEn";
    const val = form[key];
    const s = el ? el.selectionStart : val.length;
    const e = el ? el.selectionEnd : val.length;
    let next: string;
    let caret: number;
    if (t.line) {
      const lineStart = val.lastIndexOf("\n", s - 1) + 1;
      next = val.slice(0, lineStart) + t.before + val.slice(lineStart);
      caret = e + t.before.length;
    } else {
      const sel = val.slice(s, e);
      next = val.slice(0, s) + t.before + sel + (t.after || "") + val.slice(e);
      caret = s + t.before.length + sel.length;
    }
    set({ [key]: next } as Partial<BlogPost>);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(caret, caret);
    });
  };

  const seo = seoChecks(form);
  const scoreColor = seo.score >= 80 ? "#0a6b4a" : seo.score >= 60 ? "#9a6412" : "#b4532a";
  const slug = editingId || form.id || slugify(form.title) || "url-del-articulo";
  const L = lang === "es";
  const words = plainText(L ? form.content : form.contentEn).split(" ").filter(Boolean).length;

  return (
    <div className="db">
      <aside className="db-side">
        <span className="db-logo">
          Bridge<span>Care</span>
          <small>PANEL</small>
        </span>
        <button type="button" className={`db-nav${view === "list" ? " is-on" : ""}`} onClick={() => setView("list")}>
          <span>▤</span> Artículos <em>{posts.length}</em>
        </button>
        <button type="button" className={`db-nav${view === "edit" && !editingId ? " is-on" : ""}`} onClick={openNew}>
          <span>✎</span> Nuevo artículo
        </button>
        <Link href="/admin" className="db-nav">
          <span>☷</span> Resto del panel
        </Link>
        <Link href="/blog" className="db-nav" target="_blank">
          <span>↗</span> Ver el blog
        </Link>
        <button
          type="button"
          className="db-nav db-out"
          onClick={() => {
            localStorage.removeItem("bc_admin_auth");
            router.replace("/admin");
          }}
        >
          <span>⎋</span> Cerrar sesión
        </button>
      </aside>

      {view === "list" ? (
        <main className="db-main">
          <div className="db-top">
            <h1>
              Artículos <strong>del blog.</strong>
            </h1>
            <div className="db-top-actions">
              <label className="db-search">
                <span aria-hidden="true">⌕</span>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar artículos…" aria-label="Buscar artículos" />
              </label>
              <button type="button" className="db-primary" onClick={openNew}>
                + Nuevo artículo
              </button>
            </div>
          </div>

          <div className="db-stats">
            <div>
              <span>PUBLICADOS</span>
              <strong>{counts("published")}</strong>
            </div>
            <div>
              <span>BORRADORES</span>
              <strong>{counts("draft")}</strong>
            </div>
            <div>
              <span>PROGRAMADOS</span>
              <strong>{counts("scheduled")}</strong>
              <small>{nextScheduled ? `Próximo: ${fmt(nextScheduled.publishAt)}` : "Ninguno"}</small>
            </div>
            <div>
              <span>SEO PROMEDIO</span>
              <strong>{avgSeo}</strong>
              <small>de 100 · meta: 80</small>
            </div>
          </div>

          <div className="db-filters">
            {(["all", "published", "draft", "scheduled", "review"] as const).map((s) => (
              <button key={s} type="button" className={filter === s ? "is-on" : undefined} onClick={() => setFilter(s)}>
                {s === "all" ? "Todos" : STATUS[s].es} {counts(s)}
              </button>
            ))}
          </div>

          <div className="db-table">
            <div className="db-row db-head">
              <span />
              <span>ARTÍCULO</span>
              <span>ESTADO</span>
              <span>FECHA</span>
              <span>SEO</span>
              <span />
            </div>
            {listed.length === 0 && <p className="db-empty">No hay artículos aquí todavía.</p>}
            {listed.map((p) => {
              const st = STATUS[statusOf(p)];
              const sc = seoChecks(p).score;
              const col = sc >= 80 ? "#0a6b4a" : sc >= 60 ? "#9a6412" : "#b4532a";
              return (
                <div key={p.id} className="db-row">
                  <span className="db-thumb" style={p.image ? { backgroundImage: `url(${p.image})` } : undefined} />
                  <button type="button" className="db-title" onClick={() => openEdit(p)}>
                    <b>{p.title}</b>
                    <small>
                      {p.category}
                      {p.readMinutes ? ` · ${p.readMinutes} min` : ""}
                    </small>
                  </button>
                  <span className="db-status" style={{ background: st.bg, color: st.fg }}>
                    {st.es}
                  </span>
                  <span className="db-date">
                    {statusOf(p) === "scheduled" ? fmt(p.publishAt) : p.updatedAt && statusOf(p) !== "published" ? `Editado ${fmt(p.updatedAt)}` : fmt(p.date)}
                  </span>
                  <span className="db-seo">
                    <span>
                      <i style={{ width: `${sc}%`, background: col }} />
                    </span>
                    <b style={{ color: col }}>{sc}</b>
                  </span>
                  <span className="db-actions">
                    <button type="button" onClick={() => openEdit(p)}>
                      Editar
                    </button>
                    <button type="button" className="db-del" onClick={() => remove(p)} aria-label={`Eliminar ${p.title}`}>
                      Eliminar
                    </button>
                  </span>
                </div>
              );
            })}
          </div>
        </main>
      ) : (
        <>
          <main className="db-main db-editor">
            <div className="db-crumbs">
              <span>
                <button type="button" onClick={() => setView("list")}>
                  ← Artículos
                </button>{" "}
                / <b>{editingId ? "Editando" : "Nuevo artículo"}</b>
                {editingId && <em> · {STATUS[statusOf(form)].es}</em>}
              </span>
              <span className="db-save">
                <button type="button" onClick={() => save("draft")}>
                  Guardar borrador
                </button>
                <button type="button" onClick={() => save("review")}>
                  A revisión médica
                </button>
                <span className="db-sched">
                  <input
                    type="datetime-local"
                    value={scheduleAt}
                    onChange={(e) => setScheduleAt(e.target.value)}
                    aria-label="Fecha y hora de publicación"
                  />
                  <button
                    type="button"
                    onClick={() => (scheduleAt ? save("scheduled", new Date(scheduleAt).toISOString()) : setNotice("Elige fecha y hora para programar."))}
                  >
                    Programar
                  </button>
                </span>
                <button type="button" className="db-primary" onClick={() => save("published")}>
                  Publicar
                </button>
              </span>
            </div>

            <div className="db-lang">
              <button type="button" className={L ? "is-on" : undefined} onClick={() => setLang("es")}>
                ES
              </button>
              <button type="button" className={!L ? "is-on" : undefined} onClick={() => setLang("en")}>
                EN{!form.contentEn ? " · falta traducir" : ""}
              </button>
            </div>

            <label className="db-field">
              <span>TITULAR</span>
              <input
                className="db-headline"
                value={L ? form.title : form.titleEn}
                onChange={(e) => set(L ? { title: e.target.value } : { titleEn: e.target.value })}
                placeholder={L ? "¿Cuántos días quedarte en Colombia después de…?" : "Headline in English"}
              />
            </label>
            <label className="db-field">
              <span>RESUMEN · aparece en la tarjeta del blog</span>
              <textarea
                rows={2}
                value={L ? form.excerpt : form.excerptEn}
                onChange={(e) => set(L ? { excerpt: e.target.value } : { excerptEn: e.target.value })}
              />
            </label>
            <div className="db-field db-content">
              <span>
                CONTENIDO <em>{words} palabras</em>
              </span>
              <div className="db-editorbox">
                <div className="db-tools">
                  {TOOLS.map((t) => (
                    <button key={t.label} type="button" title={t.tip} onClick={() => tool(t)}>
                      {t.label}
                    </button>
                  ))}
                </div>
                <textarea
                  ref={contentRef}
                  value={L ? form.content : form.contentEn}
                  onChange={(e) => set(L ? { content: e.target.value } : { contentEn: e.target.value })}
                  placeholder={"Escribe aquí. Usa la barra para títulos, listas, enlaces o el recuadro “En 30 segundos”.\n\n## Un título de sección\nUn párrafo…"}
                />
              </div>
            </div>
            <div className="db-meta">
              <label className="db-field">
                <span>CATEGORÍA</span>
                <select value={form.category} onChange={(e) => set({ category: e.target.value })}>
                  <option value="">Elige…</option>
                  {categories.map((c) => (
                    <option key={c.es} value={c.es}>
                      {c.es}
                    </option>
                  ))}
                  {form.category && !categories.some((c) => c.es === form.category) && <option value={form.category}>{form.category}</option>}
                </select>
              </label>
              <label className="db-field">
                <span>AUTOR</span>
                <input value={form.author} onChange={(e) => set({ author: e.target.value })} placeholder="Nombre de quien firma" />
              </label>
              <label className="db-field">
                <span>REVISADO POR</span>
                <input value={form.reviewedBy || ""} onChange={(e) => set({ reviewedBy: e.target.value })} placeholder="Dr. / Dra. …" />
              </label>
              <label className="db-field">
                <span>MINUTOS DE LECTURA</span>
                <input
                  type="number"
                  min={1}
                  value={form.readMinutes || ""}
                  onChange={(e) => set({ readMinutes: Number(e.target.value) || undefined })}
                  placeholder={String(Math.max(1, Math.round(words / 200)))}
                />
              </label>
              <label className="db-field db-wide">
                <span>FOTO DE PORTADA (URL)</span>
                <input value={form.image || ""} onChange={(e) => set({ image: e.target.value })} placeholder="https://…" />
              </label>
              <label className="db-field db-wide">
                <span>TEXTO ALTERNATIVO DE LA FOTO</span>
                <input value={form.imageAlt || ""} onChange={(e) => set({ imageAlt: e.target.value })} placeholder="Qué se ve en la foto" />
              </label>
              <label className="db-check">
                <input type="checkbox" checked={!!form.featured} onChange={(e) => set({ featured: e.target.checked })} />
                Nota principal del blog
              </label>
            </div>
          </main>

          <aside className="db-panel">
            <div className="db-tabs">
              {([
                ["prev", "Vista previa"],
                ["seo", "SEO"],
                ["li", "LinkedIn"],
              ] as const).map(([k, n]) => (
                <button key={k} type="button" className={tab === k ? "is-on" : undefined} onClick={() => setTab(k)}>
                  {n}
                </button>
              ))}
            </div>

            {tab === "seo" && (
              <div className="db-pane">
                <div className="db-score">
                  <span style={{ background: `conic-gradient(${scoreColor} 0 ${seo.score}%, #eee9e1 ${seo.score}% 100%)` }}>
                    <b style={{ color: scoreColor }}>{seo.score}</b>
                  </span>
                  <span>
                    <strong>{seo.score >= 80 ? "Buen SEO" : seo.score >= 60 ? "SEO a medias" : "Falta trabajo"}</strong>
                    <small>
                      {seo.checks.filter((c) => !c.ok).length === 0
                        ? "Todo en orden."
                        : `Arregla ${seo.checks.filter((c) => !c.ok).length} puntos para subir.`}
                    </small>
                  </span>
                </div>
                <span className="db-label">ASÍ SE VE EN GOOGLE</span>
                <div className="db-google">
                  <small>
                    {SITE_HOST} › blog › {slug}
                  </small>
                  <b>{seo.title}</b>
                  <p>{seo.desc || "La descripción aparecerá aquí."}</p>
                </div>
                <label className="db-field">
                  <span>TÍTULO PARA GOOGLE · {(form.seoTitle || seo.title).length}/60</span>
                  <input value={form.seoTitle || ""} onChange={(e) => set({ seoTitle: e.target.value })} placeholder={seo.title} />
                </label>
                <label className="db-field">
                  <span>DESCRIPCIÓN · {seo.desc.length}/155</span>
                  <textarea rows={3} value={form.seoDescription || ""} onChange={(e) => set({ seoDescription: e.target.value })} placeholder={form.excerpt} />
                </label>
                <label className="db-field">
                  <span>PALABRA CLAVE PRINCIPAL</span>
                  <input value={form.keyword || ""} onChange={(e) => set({ keyword: e.target.value })} placeholder="días después de lipo HD" />
                </label>
                {!editingId && (
                  <label className="db-field">
                    <span>URL DEL ARTÍCULO</span>
                    <input value={form.id} onChange={(e) => set({ id: slugify(e.target.value) })} placeholder={slugify(form.title) || "se-crea-del-titular"} />
                  </label>
                )}
                <ul className="db-checks">
                  {seo.checks.map((c) => (
                    <li key={c.t} className={c.ok ? "ok" : undefined}>
                      <span>{c.ok ? "✓" : "!"}</span>
                      {c.t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tab === "li" && (
              <div className="db-pane">
                <span className="db-label">ASÍ SE VE AL COMPARTIR EN LINKEDIN</span>
                <div className="db-linkedin">
                  <p>{form.linkedinText || "El texto de tu publicación aparecerá aquí."}</p>
                  <div className="db-li-img" style={form.image ? { backgroundImage: `url(${form.image})` } : undefined} />
                  <div className="db-li-foot">
                    <b>{form.title || "Titular del artículo"}</b>
                    <small>
                      {SITE_HOST}
                      {form.readMinutes ? ` · ${form.readMinutes} min de lectura` : ""}
                    </small>
                  </div>
                </div>
                <label className="db-field">
                  <span>TEXTO PARA LA PUBLICACIÓN</span>
                  <textarea
                    rows={5}
                    value={form.linkedinText || ""}
                    onChange={(e) => set({ linkedinText: e.target.value })}
                    placeholder="Una pregunta o dato que enganche, y el enlace al artículo 👇"
                  />
                </label>
                <button
                  type="button"
                  className="db-li-copy"
                  onClick={() => {
                    const text = `${form.linkedinText || form.title}\n\nhttps://${SITE_HOST}/blog/${slug}`;
                    navigator.clipboard?.writeText(text).then(() => setNotice("Texto copiado para LinkedIn."));
                  }}
                >
                  Copiar texto para LinkedIn
                </button>
              </div>
            )}

            {tab === "prev" && (
              <div className="db-pane">
                <span className="db-label">ASÍ SE VE EN EL BLOG</span>
                <div className="db-card">
                  <div className="db-card-img" style={form.image ? { backgroundImage: `url(${form.image})` } : undefined} />
                  <small>
                    {(form.category || "Categoría").toUpperCase()}
                    {form.readMinutes ? ` · ${form.readMinutes} MIN DE LECTURA` : ""}
                  </small>
                  <b>{form.title || "Titular del artículo"}</b>
                  <p>{form.excerpt || "El resumen aparecerá aquí."}</p>
                </div>
                {editingId && statusOf(form) === "published" && (
                  <Link href={`/blog/${editingId}`} target="_blank" className="db-open">
                    Abrir el artículo publicado ↗
                  </Link>
                )}
              </div>
            )}
          </aside>
        </>
      )}

      {notice && (
        <div className="db-toast" role="status">
          {notice}
        </div>
      )}

      <style jsx>{`
        /* A full-screen app over the site chrome (header, footer, chat). */
        .db {
          position: fixed;
          inset: 0;
          z-index: 3000;
          display: flex;
          overflow: hidden;
          background: #f6f2ea;
          color: #101a18;
          font-family: "Manrope", var(--font-sans);
        }
        .db button {
          font-family: inherit;
          cursor: pointer;
        }
        .db-side {
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          gap: 4px;
          width: 230px;
          padding: 26px 16px;
          background: #0f1a18;
          color: #f4efe6;
        }
        .db-logo {
          display: flex;
          flex-direction: column;
          padding: 0 12px 26px;
          font-size: 20px;
          line-height: 0.92;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        .db-logo span {
          padding-left: 14px;
        }
        .db-logo small {
          margin-top: 8px;
          font-size: 11px;
          letter-spacing: 0.14em;
          opacity: 0.5;
        }
        .db-side :global(.db-nav),
        .db-nav {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 11px 12px;
          border: 0;
          border-radius: 12px;
          background: transparent;
          color: rgba(244, 239, 230, 0.75);
          font-size: 14px;
          font-weight: 700;
          text-align: left;
          text-decoration: none;
        }
        .db-side :global(.db-nav:hover),
        .db-nav:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        .db-nav.is-on {
          background: rgba(93, 202, 165, 0.14);
          color: #5dcaa5;
        }
        .db-side :global(.db-nav span),
        .db-nav span {
          width: 18px;
          text-align: center;
        }
        .db-nav em {
          margin-left: auto;
          font-size: 12px;
          font-style: normal;
          opacity: 0.6;
        }
        .db-out {
          margin-top: auto;
        }

        .db-main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 32px 40px;
          overflow-y: auto;
        }
        .db-top {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }
        .db-top h1 {
          margin: 0;
          color: #101a18;
          -webkit-text-fill-color: currentColor;
          background: none;
          font-family: "Manrope", var(--font-sans);
          font-size: 32px;
          font-weight: 300;
          letter-spacing: -0.04em;
        }
        .db-top h1 strong {
          color: #0a4a42;
          font-weight: 700;
        }
        .db-top-actions {
          display: flex;
          gap: 10px;
        }
        .db-search {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 280px;
          padding: 0 16px;
          border-radius: 999px;
          background: #fff;
          color: #8a918f;
        }
        .db-search input {
          flex: 1;
          padding: 11px 0;
          border: 0;
          outline: none;
          background: none;
          font: inherit;
          font-size: 14px;
        }
        .db-primary {
          padding: 11px 20px;
          border: 0;
          border-radius: 999px;
          background: #0a4a42;
          color: #fff;
          font-size: 14px;
          font-weight: 800;
        }
        .db-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }
        .db-stats > div {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 18px 20px;
          border-radius: 18px;
          background: #fff;
        }
        .db-stats span {
          color: #8a918f;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.1em;
        }
        .db-stats strong {
          font-size: 34px;
          font-weight: 300;
          line-height: 1;
          letter-spacing: -0.04em;
        }
        .db-stats small {
          color: #515856;
          font-size: 12px;
        }
        .db-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .db-filters button,
        .db-lang button,
        .db-tabs button {
          padding: 8px 14px;
          border: 0;
          border-radius: 999px;
          background: #fff;
          color: #2a3432;
          font-size: 13px;
          font-weight: 700;
        }
        .db-filters button.is-on,
        .db-lang button.is-on,
        .db-tabs button.is-on {
          background: #0a4a42;
          color: #fff;
        }
        .db-table {
          border-radius: 20px;
          background: #fff;
          overflow: hidden;
        }
        .db-row {
          display: grid;
          grid-template-columns: 64px minmax(0, 1fr) 160px 170px 120px 150px;
          gap: 16px;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(29, 122, 110, 0.1);
        }
        .db-head {
          color: #8a918f;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }
        .db-empty {
          margin: 0;
          padding: 28px 16px;
          color: #515856;
        }
        .db-thumb {
          height: 46px;
          border-radius: 10px;
          background: #eee9e1 center / cover;
        }
        .db-title {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
          padding: 0;
          border: 0;
          background: none;
          color: #101a18;
          text-align: left;
        }
        .db-title b {
          overflow: hidden;
          font-size: 15px;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .db-title:hover b {
          color: #0a4a42;
        }
        .db-title small {
          color: #8a918f;
          font-size: 12px;
        }
        .db-status {
          justify-self: start;
          padding: 5px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
        }
        .db-date {
          color: #515856;
          font-size: 13px;
        }
        .db-seo {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .db-seo > span {
          flex: 1;
          height: 6px;
          border-radius: 3px;
          background: #eee9e1;
        }
        .db-seo i {
          display: block;
          height: 100%;
          border-radius: 3px;
        }
        .db-seo b {
          font-size: 13px;
        }
        .db-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        .db-actions button {
          padding: 0;
          border: 0;
          background: none;
          color: #1d7a6e;
          font-size: 13px;
          font-weight: 800;
        }
        .db-actions .db-del {
          color: #b4532a;
        }

        .db-editor {
          gap: 14px;
        }
        .db-crumbs {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          color: #8a918f;
          font-size: 13px;
          font-weight: 700;
        }
        .db-crumbs button {
          padding: 0;
          border: 0;
          background: none;
          color: #8a918f;
          font-weight: 700;
        }
        .db-crumbs b {
          color: #101a18;
        }
        .db-crumbs em {
          font-style: normal;
        }
        .db-save {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
        }
        .db-save > button:not(.db-primary),
        .db-sched button {
          padding: 10px 16px;
          border: 0;
          border-radius: 999px;
          background: #fff;
          color: #101a18;
          font-size: 13px;
          font-weight: 800;
        }
        .db-sched {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 3px 3px 3px 12px;
          border-radius: 999px;
          background: #fff;
        }
        .db-sched input {
          border: 0;
          outline: none;
          background: none;
          font: inherit;
          font-size: 12px;
        }
        .db-sched button {
          background: #f1eee8;
        }
        .db-lang {
          display: flex;
          gap: 6px;
        }
        .db-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .db-field > span {
          display: flex;
          justify-content: space-between;
          color: #515856;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
        }
        .db-field > span em {
          color: #8a918f;
          font-style: normal;
          letter-spacing: 0;
        }
        .db-field input,
        .db-field textarea,
        .db-field select {
          width: 100%;
          box-sizing: border-box;
          padding: 11px 13px;
          border: 1px solid rgba(29, 122, 110, 0.18);
          border-radius: 12px;
          background: #fff;
          color: #101a18;
          font: inherit;
          font-size: 15px;
          line-height: 1.5;
          resize: vertical;
        }
        .db-field input:focus,
        .db-field textarea:focus,
        .db-field select:focus {
          outline: 2px solid #1d7a6e;
          outline-offset: 0;
        }
        .db-field .db-headline {
          font-family: Georgia, serif;
          font-size: 24px;
        }
        .db-content {
          flex: 1;
          min-height: 320px;
        }
        .db-editorbox {
          display: flex;
          flex: 1;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(29, 122, 110, 0.18);
          border-radius: 12px;
          background: #fff;
        }
        .db-tools {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          padding: 8px 10px;
          border-bottom: 1px solid rgba(29, 122, 110, 0.12);
        }
        .db-tools button {
          padding: 5px 9px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #515856;
          font-size: 13px;
          font-weight: 800;
        }
        .db-tools button:hover {
          background: #f1eee8;
          color: #0a4a42;
        }
        .db-editorbox textarea {
          flex: 1;
          min-height: 280px;
          padding: 16px 20px;
          border: 0;
          outline: none;
          resize: vertical;
          font-family: Georgia, serif;
          font-size: 16px;
          line-height: 1.7;
          color: #2a3432;
        }
        .db-meta {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }
        .db-wide {
          grid-column: span 2;
        }
        .db-check {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 700;
        }

        .db-panel {
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          gap: 14px;
          width: 400px;
          padding: 32px 24px;
          overflow-y: auto;
          border-left: 1px solid rgba(29, 122, 110, 0.12);
          background: #fbf8f3;
        }
        .db-tabs {
          display: flex;
          gap: 4px;
          padding: 4px;
          border-radius: 999px;
          background: #fff;
        }
        .db-tabs button {
          flex: 1;
          background: transparent;
        }
        .db-pane {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .db-label {
          color: #8a918f;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.14em;
        }
        .db-score {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 18px;
          border-radius: 18px;
          background: #fff;
        }
        .db-score > span:first-child {
          display: flex;
          flex-shrink: 0;
          width: 64px;
          height: 64px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        .db-score > span:first-child b {
          display: flex;
          width: 50px;
          height: 50px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #fff;
          font-size: 20px;
        }
        .db-score > span:last-child {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .db-score small {
          color: #515856;
          font-size: 13px;
        }
        .db-google {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 16px 18px;
          border-radius: 16px;
          background: #fff;
          font-family: Arial, sans-serif;
        }
        .db-google small {
          color: #4d5156;
          font-size: 12px;
        }
        .db-google b {
          color: #1a0dab;
          font-size: 18px;
          font-weight: 400;
        }
        .db-google p {
          margin: 0;
          color: #4d5156;
          font-size: 13px;
          line-height: 1.45;
        }
        .db-checks {
          display: flex;
          flex-direction: column;
          gap: 9px;
          margin: 0;
          padding: 16px 18px;
          list-style: none;
          border-radius: 16px;
          background: #fff;
        }
        .db-checks li {
          display: flex;
          gap: 10px;
          font-size: 13px;
          line-height: 1.4;
        }
        .db-checks li span {
          display: flex;
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #fbf0dd;
          color: #9a6412;
          font-size: 11px;
          font-weight: 800;
        }
        .db-checks li.ok span {
          background: #e5f3ec;
          color: #0a6b4a;
        }
        .db-linkedin {
          overflow: hidden;
          border-radius: 16px;
          background: #fff;
          font-family: Arial, sans-serif;
        }
        .db-linkedin p {
          margin: 0;
          padding: 14px 16px;
          font-size: 14px;
          line-height: 1.45;
          white-space: pre-wrap;
        }
        .db-li-img,
        .db-card-img {
          height: 190px;
          background: #eee9e1 center / cover;
        }
        .db-li-foot {
          display: flex;
          flex-direction: column;
          padding: 12px 16px;
          background: #eef3f8;
          font-size: 14px;
        }
        .db-li-foot small {
          color: #666;
          font-size: 12px;
        }
        .db-li-copy {
          padding: 12px;
          border: 0;
          border-radius: 12px;
          background: #0a66c2;
          color: #fff;
          font-size: 14px;
          font-weight: 800;
        }
        .db-card {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 14px;
          border-radius: 18px;
          background: #faf6f0;
        }
        .db-card-img {
          height: 170px;
          border-radius: 14px;
        }
        .db-card small {
          color: #1d7a6e;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.06em;
        }
        .db-card b {
          font-family: Georgia, serif;
          font-size: 22px;
          font-weight: 400;
          line-height: 1.15;
        }
        .db-card p {
          margin: 0;
          color: #515856;
          font-size: 14px;
        }
        .db-panel :global(.db-open) {
          color: #1d7a6e;
          font-size: 14px;
          font-weight: 800;
        }
        .db-toast {
          position: fixed;
          left: 50%;
          bottom: 28px;
          z-index: 1;
          padding: 12px 20px;
          border-radius: 999px;
          background: #101a18;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          transform: translateX(-50%);
          animation: db-in 0.3s ease both;
        }
        @keyframes db-in {
          from {
            opacity: 0;
            transform: translate(-50%, 10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        @media (max-width: 1100px) {
          .db {
            overflow-y: auto;
            flex-direction: column;
          }
          .db-side {
            flex-direction: row;
            flex-wrap: wrap;
            width: auto;
            padding: 12px;
          }
          .db-logo {
            padding: 0 12px;
          }
          .db-nav,
          .db-side :global(.db-nav) {
            width: auto;
          }
          .db-out {
            margin-top: 0;
          }
          .db-main,
          .db-panel {
            overflow: visible;
          }
          .db-panel {
            width: auto;
            border-left: 0;
          }
          .db-stats,
          .db-meta {
            grid-template-columns: 1fr 1fr;
          }
          .db-row {
            grid-template-columns: 48px minmax(0, 1fr) auto;
          }
          .db-date,
          .db-seo,
          .db-head {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
