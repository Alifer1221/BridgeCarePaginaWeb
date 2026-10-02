"use client";

import React, { useEffect, useRef, useState } from "react";
import { useFitBoard } from "@/lib/useFitBoard";

/* Inicio · "Cómo funciona" (design board H1b, "ruta de vuelo"): the four steps
   ride a flight arc from "tu ciudad" to "casa"; the reached stretch is drawn
   solid, the rest dotted, and the open step shows below as a wide card.
   Desktop: the section pins while you scroll through it and the scroll flies
   the plane along the arc, step by step. Phones: it moves on by itself. Click
   and keyboard focus work on both. Only the real process, no time promises. */

const photo = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1200`;

const STEPS = [
  {
    t: "Cuéntanos qué quieres",
    tEn: "Tell us what you want",
    x: "Por el formulario o por WhatsApp. Sin compromiso.",
    xEn: "Through the form or on WhatsApp. No commitment.",
    tag: "Formulario · WhatsApp",
    tagEn: "Form · WhatsApp",
    img: photo("1516841273335-e39b37888115"),
  },
  {
    t: "Hablamos en tu idioma",
    tEn: "We talk in your language",
    x: "Una videollamada para conocerte. Te enviamos tu plan y un precio cerrado, por escrito.",
    xEn: "A video call to get to know you. We send you your plan and a closed price, in writing.",
    tag: "Videollamada · Precio cerrado",
    tagEn: "Video call · Closed price",
    img: photo("1666214280557-f1b5022eb634"),
  },
  {
    t: "Viajas con todo listo",
    tEn: "You travel with everything ready",
    x: "Aeropuerto, hotel, clínica y cada cita, coordinados por nosotros.",
    xEn: "Airport, hotel, clinic and every appointment, coordinated by us.",
    tag: "Traslados · Hotel · Clínica",
    tagEn: "Transfers · Hotel · Clinic",
    img: photo("1436491865332-7a61a109cc05"),
  },
  {
    t: "Seguimos contigo en casa",
    tEn: "We stay with you at home",
    x: "Tu caso no termina al aterrizar: seguimos pendientes de tu recuperación.",
    xEn: "Your case doesn't end when you land: we keep following your recovery.",
    tag: "Seguimiento",
    tagEn: "Follow-up",
    img: photo("1551882547-ff40c63fe5fa"),
  },
];

// The arc lives in a 1200 × 250 box: a quadratic curve from (40,190) with
// control (600,-40) to (1160,190). Stops sit at t = .2, .4, .6, .8.
const P0 = [40, 190];
const P1 = [600, -40];
const P2 = [1160, 190];
const W = 1200;
const H = 250;
const at = (t: number) => [0, 1].map((k) => (1 - t) ** 2 * P0[k] + 2 * (1 - t) * t * P1[k] + t * t * P2[k]);
const STOP_T = [0.2, 0.4, 0.6, 0.8];
/** The arc from its start up to `t`, as its own quadratic curve. */
const partial = (t: number) => {
  const c = [P0[0] + t * (P1[0] - P0[0]), P0[1] + t * (P1[1] - P0[1])];
  const e = at(t);
  return `M${P0[0]} ${P0[1]} Q ${c[0]} ${c[1]} ${e[0]} ${e[1]}`;
};

export default function HowItWorks({ es }: { es: boolean }) {
  const boardRef = useFitBoard<HTMLDivElement>({ minH: 600, maxH: 900 });
  const sectionRef = useRef<HTMLElement>(null);
  const planeRef = useRef<HTMLSpanElement>(null);
  const doneRef = useRef<SVGPathElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [scrollMode, setScrollMode] = useState(false);

  // Where the plane sits on the arc (t between the first and last stop).
  const placePlane = (t: number) => {
    const [x, y] = at(t);
    if (planeRef.current) {
      planeRef.current.style.left = `${(x / W) * 100}%`;
      planeRef.current.style.top = `${(y / H) * 100}%`;
    }
    doneRef.current?.setAttribute("d", partial(t));
  };

  // Desktop: the pinned section's scroll progress drives the plane and the step.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px)");
    const sync = () => setScrollMode(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!scrollMode) return;
    let raf = 0;
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const travel = Math.max(1, r.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / travel));
      placePlane(STOP_T[0] + p * (STOP_T[3] - STOP_T[0]));
      setActive(Math.min(STEPS.length - 1, Math.floor(p * STEPS.length)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [scrollMode]);

  // Phones: it moves on by itself, and the plane jumps stop to stop.
  useEffect(() => {
    if (scrollMode) return;
    placePlane(STOP_T[active]);
  }, [scrollMode, active]);

  useEffect(() => {
    if (scrollMode || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % STEPS.length), 5000);
    return () => window.clearInterval(id);
  }, [scrollMode, paused]);

  /** Click / focus on a stop: on desktop, scroll to that step's stretch. */
  const goTo = (i: number) => {
    const el = sectionRef.current;
    if (scrollMode && el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const travel = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + ((i + 0.5) / STEPS.length) * travel, behavior: "smooth" });
    } else {
      setActive(i);
    }
  };

  const step = STEPS[active];

  return (
    <section className="hw" ref={sectionRef} aria-labelledby="hw-title">
      <div className="hw-sticky">
      <div className="hw-board" ref={boardRef} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className="hw-head">
          <div>
            <span className="hw-kicker">{es ? "CÓMO FUNCIONA" : "HOW IT WORKS"}</span>
            <h2 id="hw-title">
              {es ? "Así de simple es" : "This is how simple"} <strong>{es ? "tu tratamiento en Colombia." : "your treatment in Colombia is."}</strong>
            </h2>
          </div>
          <p>
            {es
              ? "Tú decides qué quieres cambiar. Nosotros nos encargamos de todo lo demás."
              : "You decide what you want to change. We take care of everything else."}
          </p>
        </div>

        <div className="hw-route">
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
            <path d={`M${P0[0]} ${P0[1]} Q ${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]}`} className="hw-arc" vectorEffect="non-scaling-stroke" />
            <path ref={doneRef} d={partial(STOP_T[0])} className="hw-arc-done" vectorEffect="non-scaling-stroke" />
          </svg>
          <span className="hw-end hw-end-a">{es ? "TU CIUDAD" : "YOUR CITY"}</span>
          <span className="hw-end hw-end-b">{es ? "CASA" : "HOME"}</span>
          <span className="hw-plane" ref={planeRef} aria-hidden="true">
            ✈
          </span>
          <div className="hw-stops" role="tablist" aria-label={es ? "Pasos" : "Steps"}>
            {STEPS.map((s, i) => {
              const [x, y] = at(STOP_T[i]);
              return (
                <button
                  key={s.t}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  className={`hw-stop${i === active ? " is-on" : ""}${i < active ? " is-done" : ""}`}
                  style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}
                  onMouseEnter={() => !scrollMode && setActive(i)}
                  onFocus={() => !scrollMode && setActive(i)}
                  onClick={() => goTo(i)}
                >
                  <span className="hw-dot" aria-hidden="true" />
                  <span className="hw-label">
                    <small>{es ? "PASO" : "STEP"} {String(i + 1).padStart(2, "0")}</small>
                    <b>{es ? s.t : s.tEn}</b>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="hw-card" key={active} role="tabpanel">
          <span className="hw-photo" style={{ backgroundImage: `url(${step.img})` }} aria-hidden="true" />
          <div className="hw-text">
            <span className="hw-count">
              {es ? "PASO" : "STEP"} {String(active + 1).padStart(2, "0")} {es ? "DE" : "OF"} 04
            </span>
            <h3>{es ? step.t : step.tEn}</h3>
            <p>{es ? step.x : step.xEn}</p>
            <span className="hw-tag">{es ? step.tag : step.tagEn}</span>
          </div>
        </div>
      </div>
      </div>

      <style jsx>{`
        /* Tall track: the board stays pinned while the page scrolls ~one
           screen per step, and that scroll flies the plane. */
        .hw {
          position: relative;
          height: 380svh;
          background: var(--negro-suave);
        }
        .hw-sticky {
          position: sticky;
          top: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100svh;
          overflow: hidden;
        }
        /* Design board H1b at its 1440 px; its height follows the screen (--bh). */
        .hw-board {
          --h: var(--bh, 900px);
          display: flex;
          flex-direction: column;
          gap: calc(var(--h) * 0.022);
          flex-shrink: 0;
          box-sizing: border-box;
          width: 1440px;
          height: var(--h);
          padding: max(88px, calc(var(--h) * 0.107)) 120px calc(var(--h) * 0.062);
          color: #101a18;
          font-family: "Manrope", var(--font-sans);
        }
        .hw-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
        }
        .hw-head > div {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .hw-kicker {
          color: #b0703c;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }
        .hw-head h2 {
          margin: 0;
          color: #101a18;
          -webkit-text-fill-color: currentColor;
          background: none;
          font-family: "Manrope", var(--font-sans);
          font-size: calc(var(--h) * 0.062);
          font-weight: 300;
          line-height: 1.02;
          letter-spacing: -0.05em;
        }
        .hw-head h2 strong {
          color: #0a4a42;
          font-weight: 700;
        }
        .hw-head p {
          max-width: 340px;
          margin: 0;
          color: #515856;
          font-size: 15px;
          line-height: 1.5;
          text-align: right;
        }
        .hw-route {
          position: relative;
          flex-shrink: 0;
          height: calc(var(--h) * 0.27);
        }
        .hw-route svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
        }
        .hw-arc {
          fill: none;
          stroke: #d8cfbf;
          stroke-width: 2.5;
          stroke-dasharray: 2 9;
          stroke-linecap: round;
        }
        .hw-arc-done {
          fill: none;
          stroke: #0a4a42;
          stroke-width: 2.5;
          stroke-linecap: round;
        }
        .hw-end {
          position: absolute;
          bottom: 0;
          color: #9aa19f;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }
        .hw-end-a {
          left: 0;
        }
        .hw-end-b {
          right: 0;
        }
        .hw-plane {
          position: absolute;
          z-index: 2;
          color: #0a4a42;
          font-size: 22px;
          transform: translate(-50%, -150%) rotate(8deg);
          pointer-events: none;
        }
        .hw-stop {
          position: absolute;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 230px;
          padding: 0;
          border: 0;
          background: none;
          font-family: "Manrope", var(--font-sans);
          text-align: center;
          cursor: pointer;
          transform: translate(-50%, -12px);
        }
        .hw-dot {
          width: 18px;
          height: 18px;
          box-sizing: border-box;
          border: 3px solid #cfc6b8;
          border-radius: 50%;
          background: #faf6f0;
          transition: transform 0.35s ease, background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
        }
        .hw-stop.is-done .hw-dot {
          border-color: #0a4a42;
          background: #0a4a42;
        }
        .hw-stop.is-on .hw-dot {
          border-color: #0a4a42;
          background: #0a4a42;
          box-shadow: 0 0 0 8px rgba(10, 74, 66, 0.16);
          transform: scale(1.35);
        }
        .hw-label {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 16px;
        }
        .hw-label small {
          color: #9aa19f;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }
        .hw-label b {
          color: #8a918f;
          font-size: 17px;
          transition: color 0.3s ease;
        }
        .hw-stop.is-on .hw-label small,
        .hw-stop.is-done .hw-label small {
          color: #0a4a42;
        }
        .hw-stop.is-on .hw-label b,
        .hw-stop.is-done .hw-label b,
        .hw-stop:hover .hw-label b {
          color: #101a18;
        }
        .hw-stop:focus-visible {
          outline: 3px solid #b0703c;
          outline-offset: 6px;
          border-radius: 12px;
        }
        .hw-card {
          display: grid;
          grid-template-columns: 480px minmax(0, 1fr);
          flex-grow: 1;
          min-height: 0;
          overflow: hidden;
          border-radius: 28px;
          background: #fff;
          box-shadow: 0 50px 90px -60px rgba(10, 40, 36, 0.6);
          animation: hwIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        .hw-photo {
          background-position: center;
          background-size: cover;
          animation: hwPhoto 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
        .hw-text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: calc(var(--h) * 0.016);
          padding: 28px 48px;
        }
        .hw-count {
          color: #b0703c;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.14em;
        }
        .hw-text h3 {
          margin: 0;
          color: #101a18;
          font-family: "Manrope", var(--font-sans);
          font-size: calc(var(--h) * 0.042);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.04em;
        }
        .hw-text p {
          max-width: 520px;
          margin: 0;
          color: #515856;
          font-size: max(16px, calc(var(--h) * 0.02));
          line-height: 1.55;
        }
        .hw-tag {
          align-self: flex-start;
          padding: 7px 12px;
          border-radius: 999px;
          background: #eef5f1;
          color: #0a4a42;
          font-size: 13px;
          font-weight: 800;
        }
        @keyframes hwIn {
          from {
            opacity: 0.4;
          }
        }
        @keyframes hwPhoto {
          from {
            opacity: 0;
            transform: scale(1.04);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hw-card,
          .hw-photo {
            animation: none;
          }
          .hw-plane,
          .hw-arc-done,
          .hw-dot {
            transition: none;
          }
        }
        @media (max-width: 900px) {
          .hw {
            height: auto;
          }
          .hw-sticky {
            position: static;
            height: auto;
          }
          .hw-board {
            --h: 760px;
            width: 100%;
            height: auto;
            padding: 3.5rem 1.25rem;
            gap: 24px;
          }
          .hw-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
          }
          .hw-head h2 {
            font-size: 2.3rem;
          }
          .hw-head p {
            text-align: left;
          }
          /* Phones: the arc becomes a vertical list of the four steps. */
          .hw-route {
            height: auto;
          }
          .hw-route svg,
          .hw-end,
          .hw-plane {
            display: none;
          }
          .hw-stops {
            display: flex;
            flex-direction: column;
          }
          .hw-stop {
            position: static;
            flex-direction: row;
            align-items: center;
            gap: 14px;
            width: auto;
            padding: 12px 0;
            border-top: 1px solid rgba(16, 26, 24, 0.1);
            text-align: left;
            transform: none;
          }
          .hw-label {
            margin-top: 0;
          }
          .hw-card {
            grid-template-columns: 1fr;
          }
          .hw-photo {
            min-height: 220px;
          }
          .hw-text {
            padding: 22px;
          }
          .hw-text h3 {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </section>
  );
}
