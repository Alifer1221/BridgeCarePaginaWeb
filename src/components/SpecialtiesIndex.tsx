"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useFitBoard } from "@/lib/useFitBoard";
import { useSpecialties } from "@/lib/useStoredData";

/* Inicio · Especialidades (design board S2, "índice editorial"): a giant
   numbered list of the specialties on the left; the one you point at turns
   bold and its photo + procedures appear on the right. It also moves on by
   itself. Everything comes from the specialties catalogue, so a new
   specialty shows up here without touching this file. */

const photo = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1400`;

// Home-specific photo and one-line promise per specialty. A specialty that
// isn't listed falls back to its catalogue image and description.
const EXTRA: Record<string, { img: string; es: string; en: string }> = {
  "cirugia-estetica": { img: photo("1512290923902-8a9f81dc236c"), es: "Cambios que se notan, con naturalidad.", en: "Changes that show, naturally." },
  odontologia: { img: photo("1606811841689-23dfddce3e95"), es: "La sonrisa que diseñas antes de viajar.", en: "The smile you design before you travel." },
  bariatria: { img: photo("1512621776951-a57141f2eefd"), es: "Un nuevo comienzo para tu salud.", en: "A fresh start for your health." },
  estetica: { img: photo("1570172619644-dfd03ed5d881"), es: "Resultados sutiles, sin quirófano.", en: "Subtle results, no operating room." },
};

export default function SpecialtiesIndex({ es }: { es: boolean }) {
  const specialties = useSpecialties();
  const boardRef = useFitBoard<HTMLDivElement>({ minH: 600, maxH: 900 });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = specialties.length;

  useEffect(() => {
    if (paused || count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % count), 5500);
    return () => window.clearInterval(id);
  }, [paused, count]);

  if (!count) return null;
  const current = specialties[active % count];
  const procs = (current.procedureDetails || []).filter((p) => p.slug);

  return (
    <section className="si" aria-labelledby="si-title">
      <div className="si-board" ref={boardRef} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className="si-left">
          <span className="si-kicker">{es ? "ESPECIALIDADES" : "SPECIALTIES"}</span>
          <h2 id="si-title">
            {es ? "Especialistas certificados en Colombia que te atienden en tu idioma." : "Certified specialists in Colombia who see you in your language."}
          </h2>
          <ol className="si-list">
            {specialties.map((s, i) => {
              const on = i === active % count;
              const x = EXTRA[s.id];
              return (
                <li key={s.id} className={on ? "is-on" : ""}>
                  <Link
                    href={`/specialties/${s.id}`}
                    className="si-row"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => {
                      setActive(i);
                      setPaused(true);
                    }}
                    onBlur={() => setPaused(false)}
                  >
                    <span className="si-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="si-name">
                      <b>{es ? s.name : s.nameEn}</b>
                      <span className="si-tag">{x ? (es ? x.es : x.en) : es ? s.description : s.descriptionEn}</span>
                    </span>
                    <span className="si-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="si-right">
          {specialties.map((s, i) => (
            <span
              key={s.id}
              className={`si-photo${i === active % count ? " is-on" : ""}`}
              style={{ backgroundImage: `url(${EXTRA[s.id]?.img || s.image})` }}
              aria-hidden="true"
            />
          ))}
          <div className="si-card" key={current.id}>
            <span className="si-card-kicker">
              {es ? "PROCEDIMIENTOS" : "PROCEDURES"} · {es ? current.name.toUpperCase() : current.nameEn.toUpperCase()}
            </span>
            {procs.length ? (
              <ul>
                {procs.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/specialties/${current.id}/${p.slug}`} className="si-proc">
                      <span>{es ? p.name : p.nameEn}</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            <Link href={`/specialties/${current.id}`} className="si-more">
              {es ? "Ver la especialidad completa →" : "See the full specialty →"}
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .si {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100svh;
          overflow: hidden;
          background: var(--negro-suave);
        }
        /* Design board S2 at its 1440 px; its height follows the screen (--bh). */
        .si-board {
          --h: var(--bh, 900px);
          display: grid;
          grid-template-columns: minmax(0, 1fr) 560px;
          gap: 70px;
          flex-shrink: 0;
          box-sizing: border-box;
          width: 1440px;
          height: var(--h);
          padding: max(88px, calc(var(--h) * 0.107)) 120px calc(var(--h) * 0.062);
          color: #101a18;
          font-family: "Manrope", var(--font-sans);
        }
        .si-left {
          display: flex;
          flex-direction: column;
          gap: calc(var(--h) * 0.02);
          min-height: 0;
        }
        .si-kicker {
          color: #b0703c;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }
        .si-left h2 {
          max-width: 560px;
          margin: 0;
          color: #515856;
          -webkit-text-fill-color: currentColor;
          background: none;
          font-family: "Manrope", var(--font-sans);
          font-size: 22px;
          font-weight: 500;
          line-height: 1.35;
          letter-spacing: -0.01em;
        }
        .si-list {
          margin: auto 0 0;
          padding: 0;
          list-style: none;
        }
        .si-list li {
          border-top: 1px solid rgba(16, 26, 24, 0.12);
        }
        .si-list :global(.si-row) {
          display: flex;
          align-items: baseline;
          gap: 22px;
          padding: calc(var(--h) * 0.022) 0;
          color: #101a18;
          text-decoration: none;
          opacity: 0.38;
          transition: opacity 0.35s ease;
        }
        .si-list li.is-on :global(.si-row),
        .si-list :global(.si-row:hover) {
          opacity: 1;
        }
        .si-num {
          color: #0a4a42;
          font-size: 15px;
          font-weight: 800;
        }
        .si-name {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          gap: 6px;
        }
        .si-name b {
          font-size: calc(var(--h) * 0.046);
          font-weight: 300;
          line-height: 1;
          letter-spacing: -0.05em;
          transition: font-size 0.35s ease, color 0.35s ease;
        }
        .si-list li.is-on .si-name b {
          color: #0a4a42;
          font-size: calc(var(--h) * 0.058);
          font-weight: 700;
        }
        .si-tag {
          display: none;
          color: #515856;
          font-size: 16px;
        }
        .si-list li.is-on .si-tag {
          display: block;
          animation: siIn 0.45s ease both;
        }
        .si-arrow {
          color: #0a4a42;
          font-size: 26px;
          opacity: 0;
          transform: translateX(-10px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .si-list li.is-on .si-arrow {
          opacity: 1;
          transform: none;
        }
        .si-list :global(.si-row:focus-visible) {
          outline: 3px solid #b0703c;
          outline-offset: 4px;
          border-radius: 8px;
        }
        .si-right {
          position: relative;
          min-height: 0;
          overflow: hidden;
          border-radius: 30px;
          background: #e8e1d5;
        }
        .si-photo {
          position: absolute;
          inset: 0;
          background-position: center;
          background-size: cover;
          opacity: 0;
          transform: scale(1.05);
          transition: opacity 0.7s ease, transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .si-photo.is-on {
          opacity: 1;
          transform: none;
        }
        .si-card {
          position: absolute;
          right: 22px;
          bottom: 22px;
          left: 22px;
          padding: 20px 24px;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(10px);
          animation: siIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        .si-card-kicker {
          color: #b0703c;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.14em;
        }
        .si-card ul {
          margin: 8px 0 0;
          padding: 0;
          list-style: none;
        }
        .si-card :global(.si-proc) {
          display: flex;
          justify-content: space-between;
          padding: calc(var(--h) * 0.013) 0;
          border-top: 1px solid rgba(16, 26, 24, 0.08);
          color: #101a18;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          transition: color 0.2s ease, padding 0.2s ease;
        }
        .si-card :global(.si-proc span:last-child) {
          color: #0a4a42;
        }
        .si-card :global(.si-proc:hover) {
          padding-left: 6px;
          color: #0a4a42;
        }
        .si-card :global(.si-more) {
          display: inline-block;
          margin-top: 12px;
          color: #0a4a42;
          font-size: 14px;
          font-weight: 800;
          text-decoration: none;
        }
        @keyframes siIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .si-photo,
          .si-name b,
          .si-arrow {
            transition: none;
          }
          .si-card,
          .si-list li.is-on .si-tag {
            animation: none;
          }
        }
        @media (max-width: 900px) {
          .si {
            min-height: 0;
          }
          .si-board {
            --h: 700px;
            grid-template-columns: 1fr;
            gap: 28px;
            width: 100%;
            height: auto;
            padding: 3.5rem 1.25rem;
          }
          .si-left h2 {
            font-size: 1.15rem;
          }
          .si-list {
            margin-top: 8px;
          }
          .si-name b {
            font-size: 1.7rem;
          }
          .si-list li.is-on .si-name b {
            font-size: 2rem;
          }
          .si-right {
            min-height: 520px;
          }
        }
      `}</style>
    </section>
  );
}
