"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useFitBoard } from "@/lib/useFitBoard";

/* Inicio · Por qué Colombia (design board X2c, "la ventana"): a bone panel
   with COLOMBIA cut out of it; through the letters you see Colombia, the city,
   Guatapé and the clinic, crossfading, and the photo drifts with the mouse
   like looking through a window. Below, four reasons, two for the treatment
   and two for the trip. The 70% figure stays by the owner's decision. */

const photo = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=2200`;
const SCENES = [
  { img: photo("1680209082240-1abf11585936"), es: "Medellín", en: "Medellín" },
  { img: photo("1598028060898-c117093edfcb"), es: "Guatapé", en: "Guatapé" },
  { img: photo("1606811841689-23dfddce3e95"), es: "Tu clínica", en: "Your clinic" },
];

const REASONS = [
  { k: "TU TRATAMIENTO", kEn: "YOUR TREATMENT", big: "−70%", s: "frente al mismo procedimiento en EE. UU.", sEn: "vs. the same procedure in the US.", trip: false },
  { k: "TU ESPECIALISTA", kEn: "YOUR SPECIALIST", big: "EN · ES", s: "te atiende en tu idioma, con precio cerrado.", sEn: "sees you in your language, with a closed price.", trip: false },
  { k: "TU VIAJE", kEn: "YOUR TRIP", big: "22 °C", s: "todo el año en Medellín.", sEn: "all year round in Medellín.", trip: true },
  { k: "TU DESCANSO", kEn: "YOUR DOWNTIME", big: "Guatapé", s: "café, Comuna 13 y el Caribe a un vuelo.", sEn: "coffee, Comuna 13 and the Caribbean a flight away.", trip: true },
];

const BOARD_W = 1440;

export default function WhyColombia({ es }: { es: boolean }) {
  // The cut-out is an SVG mask drawn at the board's real height, so the
  // letters never stretch: onFit hands us that height.
  const [bh, setBh] = useState(0);
  const onFit = useCallback((_el: HTMLElement, _zoom: number, h: number) => setBh(h), []);
  const boardRef = useFitBoard<HTMLDivElement>({ minH: 600, maxH: 900, onFit });
  const [scene, setScene] = useState(0);
  const [drift, setDrift] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setScene((s) => (s + 1) % SCENES.length), 4500);
    return () => window.clearInterval(id);
  }, []);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setDrift({ x: ((e.clientX - r.left) / r.width - 0.5) * -40, y: ((e.clientY - r.top) / r.height - 0.5) * -24 });
  };

  const H = bh || 900;
  // Fills the board's inner width (≈1240 px) without spilling on short screens.
  const fontSize = Math.round(Math.min(266, H * 0.39));

  return (
    <section className="wc" aria-labelledby="wc-title">
      <div className="wc-board" ref={boardRef} onMouseMove={onMove} onMouseLeave={() => setDrift({ x: 0, y: 0 })}>
        <div className="wc-photos" aria-hidden="true" style={{ transform: `translate3d(${drift.x}px, ${drift.y}px, 0) scale(1.06)` }}>
          {SCENES.map((s, i) => (
            <span key={s.img} className={i === scene ? "is-on" : ""} style={{ backgroundImage: `url(${s.img})` }} />
          ))}
        </div>

        {/* Desktop: the bone panel with the word cut out of it. */}
        <svg className="wc-mask" width={BOARD_W} height={H} viewBox={`0 0 ${BOARD_W} ${H}`} aria-hidden="true">
          <defs>
            <mask id="wc-cut">
              <rect width={BOARD_W} height={H} fill="#fff" />
              <text
                x={BOARD_W / 2}
                y={H * 0.47 + fontSize * 0.36}
                textAnchor="middle"
                fontFamily="Manrope, sans-serif"
                fontWeight={800}
                fontSize={fontSize}
                letterSpacing={-fontSize * 0.073}
                fill="#000"
              >
                COLOMBIA
              </text>
            </mask>
          </defs>
          <rect width={BOARD_W} height={H} fill="#faf6f0" mask="url(#wc-cut)" />
        </svg>

        {/* Phones: the same word, with the photo painted inside the letters. */}
        <b className="wc-word" aria-hidden="true" style={{ backgroundImage: `url(${SCENES[scene].img})` }}>
          COLOMBIA
        </b>

        <div className="wc-top">
          <span className="wc-kicker">{es ? "POR QUÉ" : "WHY"}</span>
          <h2 id="wc-title" className="wc-sr">
            {es ? "Por qué Colombia: tu tratamiento y tu viaje" : "Why Colombia: your treatment and your trip"}
          </h2>
          <span className="wc-scene">
            {es ? "A TRAVÉS DE LAS LETRAS:" : "THROUGH THE LETTERS:"} <b>{es ? SCENES[scene].es : SCENES[scene].en}</b>
          </span>
        </div>

        <ul className="wc-reasons">
          {REASONS.map((r) => (
            <li key={r.k} className={r.trip ? "is-trip" : ""}>
              <span className="wc-k">{es ? r.k : r.kEn}</span>
              <b>{r.big}</b>
              <span className="wc-s">{es ? r.s : r.sEn}</span>
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .wc {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100svh;
          overflow: hidden;
          background: var(--negro-suave);
        }
        /* Design board X2c at its 1440 px; its height follows the screen (--bh). */
        .wc-board {
          --h: var(--bh, 900px);
          position: relative;
          flex-shrink: 0;
          overflow: hidden;
          width: 1440px;
          height: var(--h);
          color: #101a18;
          font-family: "Manrope", var(--font-sans);
        }
        .wc-photos {
          position: absolute;
          inset: -30px;
          transition: transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .wc-photos span {
          position: absolute;
          inset: 0;
          background-position: center;
          background-size: cover;
          opacity: 0;
          transition: opacity 1.1s ease;
        }
        .wc-photos span.is-on {
          opacity: 1;
        }
        .wc-mask {
          position: absolute;
          top: 0;
          left: 0;
        }
        .wc-word {
          display: none;
        }
        .wc-top {
          position: absolute;
          top: max(96px, calc(var(--h) * 0.107));
          right: 120px;
          left: 120px;
          display: flex;
          justify-content: space-between;
        }
        .wc-kicker {
          color: #b0703c;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }
        .wc-scene {
          color: #515856;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }
        .wc-scene b {
          color: #0a4a42;
        }
        .wc-sr {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }
        .wc-reasons {
          position: absolute;
          right: 120px;
          bottom: calc(var(--h) * 0.062);
          left: 120px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
          margin: 0;
          padding: calc(var(--h) * 0.029) 0 0;
          border-top: 1px solid rgba(16, 26, 24, 0.12);
          list-style: none;
        }
        .wc-reasons li {
          display: flex;
          flex-direction: column;
          gap: 6px;
          color: #0a4a42;
        }
        .wc-reasons li.is-trip {
          color: #b0703c;
        }
        .wc-k {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }
        .wc-reasons b {
          font-size: calc(var(--h) * 0.051);
          line-height: 1;
          letter-spacing: -0.05em;
        }
        .wc-s {
          color: #515856;
          font-size: 15px;
          line-height: 1.4;
        }
        @media (prefers-reduced-motion: reduce) {
          .wc-photos,
          .wc-photos span {
            transition: none;
          }
        }
        @media (max-width: 900px) {
          .wc {
            min-height: 0;
            background: #faf6f0;
          }
          .wc-board {
            display: flex;
            flex-direction: column;
            gap: 20px;
            width: 100%;
            height: auto;
            padding: 3.5rem 1.25rem;
            box-sizing: border-box;
          }
          .wc-photos,
          .wc-mask {
            display: none;
          }
          .wc-top {
            position: static;
            order: -1;
            flex-direction: column;
            gap: 8px;
          }
          .wc-word {
            display: block;
            /* The word is ~4.7 em wide: fill the phone's width exactly. */
            font-size: calc((100vw - 2.5rem) / 4.75);
            font-weight: 800;
            line-height: 0.9;
            letter-spacing: -0.075em;
            background-position: center;
            background-size: cover;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            transition: background-image 0.6s ease;
          }
          .wc-reasons {
            position: static;
            grid-template-columns: 1fr 1fr;
            gap: 22px 16px;
            padding-top: 20px;
          }
          .wc-reasons b {
            font-size: 1.9rem;
          }
          .wc-s {
            font-size: 14px;
          }
        }
      `}</style>
    </section>
  );
}
