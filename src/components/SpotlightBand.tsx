"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useFitBoard } from "@/lib/useFitBoard";

/* Inicio · franja "Tu transformación, a todo color" (design board N4, "el
   foco"): Colombia shows faded, in grey; a round spotlight follows the cursor
   and lights it up in full colour. With no mouse (phones, or the pointer
   elsewhere) the spotlight wanders by itself. Positions are written straight
   to CSS variables in a rAF loop, so nothing re-renders while it moves. */

// Comuna 13: the most colourful street in Medellín, made for "a todo color".
const PHOTO = "https://images.unsplash.com/photo-1693669029454-ab14dd80faaa?auto=format&fit=crop&q=80&w=2400";

export default function SpotlightBand({ es }: { es: boolean }) {
  const boardRef = useFitBoard<HTMLDivElement>({ minH: 600, maxH: 900 });
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pos = { x: 0.62, y: 0.42 };
    const target = { x: 0.62, y: 0.42 };
    let pointer = false;
    let raf = 0;
    const t0 = performance.now();

    const paint = () => {
      el.style.setProperty("--sx", `${(pos.x * 100).toFixed(2)}%`);
      el.style.setProperty("--sy", `${(pos.y * 100).toFixed(2)}%`);
    };
    if (reduced) {
      paint();
      return;
    }

    const tick = (now: number) => {
      if (!pointer) {
        // A slow figure-eight while nobody is steering.
        const t = (now - t0) / 1000;
        target.x = 0.55 + Math.sin(t * 0.45) * 0.25;
        target.y = 0.45 + Math.sin(t * 0.9) * 0.16;
      }
      pos.x += (target.x - pos.x) * 0.12;
      pos.y += (target.y - pos.y) * 0.12;
      paint();
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      pointer = true;
      target.x = (e.clientX - r.left) / r.width;
      target.y = (e.clientY - r.top) / r.height;
    };
    const onLeave = () => {
      pointer = false;
    };

    // Only animate while the band is on screen.
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section className="sb" aria-labelledby="sb-title">
      <div className="sb-board" ref={boardRef}>
        <div className="sb-stage" ref={stageRef}>
          <span className="sb-grey" style={{ backgroundImage: `url(${PHOTO})` }} aria-hidden="true" />
          <span className="sb-color" style={{ backgroundImage: `url(${PHOTO})` }} aria-hidden="true" />
          <span className="sb-ring" aria-hidden="true" />

          <div className="sb-copy">
            <span className="sb-kicker sb-kicker-mouse">{es ? "MUEVE EL MOUSE" : "MOVE YOUR MOUSE"}</span>
            <span className="sb-kicker sb-kicker-touch">{es ? "TU BIENESTAR EN LAS MEJORES MANOS" : "YOUR WELLBEING IN THE BEST HANDS"}</span>
            <h2 id="sb-title">
              {es ? "Tu transformación," : "Your transformation,"} <strong>{es ? "a todo color." : "in full colour."}</strong>
            </h2>
          </div>

          <div className="sb-foot">
            <p>
              {es
                ? "Nosotros ponemos el especialista, la clínica, el hotel y los traslados. Tú solo miras."
                : "We bring the specialist, the clinic, the hotel and the transfers. You just enjoy the view."}
            </p>
            <Link href="/contacto" className="sb-cta">
              {es ? "Iniciar consulta →" : "Start a consultation →"}
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sb {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100svh;
          overflow: hidden;
          background: var(--negro-suave);
        }
        /* Design board N4 at its 1440 px; its height follows the screen (--bh). */
        .sb-board {
          --h: var(--bh, 900px);
          flex-shrink: 0;
          box-sizing: border-box;
          width: 1440px;
          height: var(--h);
          padding: max(88px, calc(var(--h) * 0.1)) 0 0;
          font-family: "Manrope", var(--font-sans);
        }
        .sb-stage {
          --sx: 62%;
          --sy: 42%;
          --r: calc(var(--h) * 0.22);
          position: relative;
          height: 100%;
          overflow: hidden;
          cursor: none;
        }
        .sb-grey,
        .sb-color {
          position: absolute;
          inset: 0;
          background-position: center;
          background-size: cover;
        }
        .sb-grey {
          filter: grayscale(1) contrast(0.8) brightness(1.25);
          opacity: 0.35;
        }
        .sb-color {
          -webkit-mask: radial-gradient(circle var(--r) at var(--sx) var(--sy), #000 97%, transparent 100%);
          mask: radial-gradient(circle var(--r) at var(--sx) var(--sy), #000 97%, transparent 100%);
        }
        .sb-ring {
          position: absolute;
          top: var(--sy);
          left: var(--sx);
          width: calc(var(--r) * 2);
          height: calc(var(--r) * 2);
          border-radius: 50%;
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.9), 0 30px 60px -20px rgba(10, 40, 36, 0.5);
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .sb-copy {
          position: absolute;
          top: calc(var(--h) * 0.03);
          left: 120px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          max-width: 780px;
          pointer-events: none;
        }
        .sb-kicker {
          color: #b0703c;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }
        .sb-kicker-touch {
          display: none;
        }
        /* Touch screens have no cursor to steer the spotlight. */
        @media (hover: none) {
          .sb-kicker-mouse {
            display: none;
          }
          .sb-kicker-touch {
            display: inline;
          }
        }
        .sb-copy h2 {
          margin: 0;
          color: #101a18;
          -webkit-text-fill-color: currentColor;
          background: none;
          font-family: "Manrope", var(--font-sans);
          font-size: calc(var(--h) * 0.102);
          font-weight: 300;
          line-height: 1;
          letter-spacing: -0.055em;
        }
        .sb-copy h2 strong {
          color: #0a4a42;
          font-weight: 700;
        }
        .sb-foot {
          position: absolute;
          right: 120px;
          bottom: calc(var(--h) * 0.075);
          left: 120px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }
        .sb-foot p {
          max-width: 560px;
          margin: 0;
          color: #101a18;
          font-size: 19px;
          line-height: 1.5;
        }
        .sb-foot :global(.sb-cta) {
          flex-shrink: 0;
          padding: 17px 26px;
          border-radius: 999px;
          background: #0a4a42;
          color: #fff;
          font-size: 16px;
          font-weight: 800;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .sb-foot :global(.sb-cta:hover) {
          background: #0d5c52;
          transform: translateY(-2px);
        }
        @media (max-width: 900px) {
          .sb {
            min-height: 0;
          }
          .sb-board {
            --h: 640px;
            width: 100%;
            height: 640px;
            padding: 0;
          }
          .sb-stage {
            --r: 120px;
            cursor: auto;
          }
          .sb-copy {
            top: 40px;
            left: 1.25rem;
            right: 1.25rem;
          }
          .sb-copy h2 {
            font-size: 2.6rem;
          }
          .sb-foot {
            bottom: 28px;
            left: 1.25rem;
            right: 1.25rem;
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }
          .sb-foot p {
            font-size: 16px;
          }
          .sb-foot :global(.sb-cta) {
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
}
