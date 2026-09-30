import React from "react";

/* The small markup the blog dashboard writes, rendered as React elements (no
   raw HTML is ever injected, so an article can't carry a script):

   ## Title / ### Subtitle     - list item        > quote
   **bold**  *italic*  [text](https://…)  ![description](https://…)
   :::resumen … :::   the "In 30 seconds" box (its lines become bullets)

   Anything else is a paragraph; a blank line separates blocks. */

const safeHref = (url: string) => (/^(https?:\/\/|\/|#|mailto:)/i.test(url.trim()) ? url.trim() : "#");

function inline(text: string, key: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    const k = `${key}-${i++}`;
    if (tok.startsWith("**")) out.push(<strong key={k}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith("*")) out.push(<em key={k}>{tok.slice(1, -1)}</em>);
    else {
      const [, label, url] = tok.match(/\[([^\]]+)\]\(([^)]+)\)/) || [];
      const href = safeHref(url || "");
      const external = /^https?:/i.test(href);
      out.push(
        <a key={k} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {label}
        </a>,
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function renderBlogContent(src: string, summaryTitle = "En 30 segundos"): React.ReactNode[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const out: React.ReactNode[] = [];
  let para: string[] = [];
  let list: string[] = [];
  let n = 0;
  const flushPara = () => {
    if (para.length) out.push(<p key={`p${n++}`}>{inline(para.join(" "), `p${n}`)}</p>);
    para = [];
  };
  const flushList = () => {
    if (list.length)
      out.push(
        <ul key={`u${n++}`}>
          {list.map((li, i) => (
            <li key={i}>{inline(li, `u${n}-${i}`)}</li>
          ))}
        </ul>,
      );
    list = [];
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith(":::resumen")) {
      flushPara();
      flushList();
      const items: string[] = [];
      for (i++; i < lines.length && !lines[i].trim().startsWith(":::"); i++) {
        const t = lines[i].trim().replace(/^-\s*/, "");
        if (t) items.push(t);
      }
      out.push(
        <aside key={`s${n++}`} className="md-summary">
          <span>{summaryTitle}</span>
          <ul>
            {items.map((t, k) => (
              <li key={k}>{inline(t, `s${n}-${k}`)}</li>
            ))}
          </ul>
        </aside>,
      );
      continue;
    }
    if (!line) {
      flushPara();
      flushList();
    } else if (line.startsWith("### ")) {
      flushPara();
      flushList();
      out.push(<h3 key={`h${n++}`}>{inline(line.slice(4), `h${n}`)}</h3>);
    } else if (line.startsWith("## ")) {
      flushPara();
      flushList();
      out.push(<h2 key={`h${n++}`}>{inline(line.slice(3), `h${n}`)}</h2>);
    } else if (line.startsWith("> ")) {
      flushPara();
      flushList();
      out.push(<blockquote key={`q${n++}`}>{inline(line.slice(2), `q${n}`)}</blockquote>);
    } else if (/^!\[[^\]]*\]\([^)]+\)$/.test(line)) {
      flushPara();
      flushList();
      const [, alt, url] = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/) || [];
      // eslint-disable-next-line @next/next/no-img-element
      out.push(<img key={`i${n++}`} src={safeHref(url || "")} alt={alt || ""} loading="lazy" />);
    } else if (line.startsWith("- ")) {
      flushPara();
      list.push(line.slice(2));
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();
  return out;
}

/** Plain text of the markup: for word counts and the first-paragraph check. */
export function plainText(src: string): string {
  return src
    .replace(/:::resumen|:::/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
