"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Destination } from "@/lib/db";

/* Destination hero, design board BH4: the city, all inclusive, told in four
   parts (arrive, stay, care, live the city) that play full screen like a
   streaming hero. Each part crossfades its own photo with a slow push-in,
   and the tabs at the bottom fill as it plays; tapping a tab jumps there.
   It sells the city and the package, never the days of a given surgery. */

const PART_MS = 6500;

// Premium photography per city. Medellín is shot from El Poblado; the other
// cities fall back to their catalogue image until they get their own set.
const CITY_MEDIA: Record<string, { hood: string; hero: string; live: string; temp?: string; nickname?: string }> = {
  medellin: {
    hood: "El Poblado",
    hero: "https://images.unsplash.com/photo-1512250431446-d0b4b57b27ec?auto=format&fit=crop&q=80&w=2400",
    live: "https://images.unsplash.com/photo-1680209082240-1abf11585936?auto=format&fit=crop&q=80&w=2400",
    temp: "22 °C",
    nickname: "la eterna primavera",
  },
  bogota: { hood: "Usaquén", hero: "", live: "" },
  cali: { hood: "Granada", hero: "", live: "" },
  cartagena: { hood: "Bocagrande", hero: "", live: "" },
};
const ARRIVAL = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=2400";
const HOTEL = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2400";
// A consultation, not a hospital corridor: care, not signage.
const CARE = "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=80&w=2400";

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function DestinationHero({ destination, es }: { destination: Destination; es: boolean }) {
  const media = CITY_MEDIA[destination.id] || { hood: destination.name, hero: "", live: "" };
  const city = destination.name;
  const tourism = es ? destination.tourism : destination.tourismEn || destination.tourism;

  const parts = [
    {
      tab: es ? "Llegas" : "You arrive",
      title: es ? "Te esperamos con tu nombre" : "We wait for you, name in hand",
      text: es
        ? `Un conductor te recoge en el aeropuerto y te lleva a tu hotel. Desde ese momento, no te mueves solo por ${city}.`
        : `A driver picks you up at the airport and takes you to your hotel. From then on, you never get around ${city} alone.`,
      img: media.hero || destination.image || ARRIVAL,
    },
    {
      tab: es ? "Te hospedas" : "You stay",
      title: es ? `Tu hotel en ${media.hood}` : `Your hotel in ${media.hood}`,
      text: es
        ? "Un barrio tranquilo y caminable, con cafés y restaurantes a pocas cuadras, y cerca de la clínica."
        : "A quiet, walkable neighbourhood with cafés and restaurants a few blocks away, close to the clinic.",
      img: HOTEL,
    },
    {
      tab: es ? "Te cuidamos" : "We look after you",
      title: es ? "Médicos de primer nivel" : "First-rate doctors",
      text: es
        ? "Clínicas acreditadas y especialistas certificados que te atienden en tu idioma. Una enfermera va a tu hotel."
        : "Accredited clinics and certified specialists who treat you in your language. A nurse visits your hotel.",
      img: CARE,
    },
    {
      tab: es ? "Vives la ciudad" : "You live the city",
      title: media.nickname
        ? es ? `${media.temp}, ${media.nickname}` : `${media.temp}, the city of eternal spring`
        : es ? `${city} a tu ritmo` : `${city} at your pace`,
      text: es
        ? `${tourism} Planes para tu acompañante, y para ti cuando tu médico lo autorice.`
        : `${tourism} Plans for your companion, and for you once your doctor says so.`,
      img: media.live || destination.image || media.hero,
    },
  ];
  const n = parts.length;

  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [playing, setPlaying] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  // Play only while the hero is on screen; never under reduced motion.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || reducedMotion() || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setPlaying(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => {
      setActive((a) => (a + 1) % n);
      setCycle((c) => c + 1);
    }, PART_MS);
    return () => window.clearTimeout(t);
  }, [playing, active, cycle, n]);

  const go = (i: number) => {
    setActive(i);
    setCycle((c) => c + 1);
  };
  const cur = parts[active];

  return (
    <section className="dh" ref={rootRef} data-header-dark aria-label={es ? `${city}, todo incluido` : `${city}, all inclusive`}>
      {parts.map((p, i) => (
        <div
          key={i}
          className={`dh-bg${i === active ? " is-on" : ""}`}
          style={{ backgroundImage: `url(${p.img})` }}
          aria-hidden="true"
        />
      ))}
      <span className="dh-shade" aria-hidden="true" />

      <div className="dh-inner">
        <div className="dh-copy">
          <span className="dh-badge">{es ? "TODO INCLUIDO" : "ALL INCLUSIVE"}</span>
          <h1>
            {city},
            <br />
            <strong>{es ? "todo incluido." : "all inclusive."}</strong>
          </h1>
          <div className="dh-part" key={`${active}-${cycle}`} aria-live="polite">
            <span className="dh-part-tab">{cur.tab.toUpperCase()}</span>
            <span className="dh-part-title">{cur.title}</span>
            <span className="dh-part-text">{cur.text}</span>
          </div>
          <Link href="/contacto" className="dh-cta">
            {es ? "Cotizar mi viaje" : "Quote my trip"}
          </Link>
        </div>

        <div className="dh-tabs" role="tablist" aria-label={es ? "Tu viaje" : "Your trip"}>
          {parts.map((p, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`dh-tab${i === active ? " is-on" : ""}`}
              onClick={() => go(i)}
            >
              <span className="dh-track" aria-hidden="true">
                <span
                  key={i === active ? `live-${cycle}` : "still"}
                  className={`dh-fill${i < active ? " is-done" : ""}${i === active ? (playing ? " is-live" : " is-done") : ""}`}
                  style={{ animationDuration: `${PART_MS}ms` }}
                />
              </span>
              <span className="dh-tab-label">{p.tab}</span>
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .dh {
          position: relative;
          display: flex;
          min-height: 100svh;
          overflow: hidden;
          background: #1c2320;
          color: #fff;
        }
        .dh-bg {
          position: absolute;
          inset: 0;
          background-position: center;
          background-size: cover;
          opacity: 0;
          transform: scale(1.04);
          transition:
            opacity 1.1s ease,
            transform 8s ease-out;
        }
        .dh-bg.is-on {
          opacity: 1;
          transform: scale(1.14);
        }
        .dh-shade {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(8, 20, 18, 0.8) 0%, rgba(8, 20, 18, 0.3) 58%, rgba(8, 20, 18, 0.12) 100%),
            linear-gradient(0deg, rgba(8, 20, 18, 0.85) 0%, rgba(8, 20, 18, 0) 38%);
        }
        .dh-inner {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 3rem;
          width: 100%;
          max-width: 1240px;
          margin: 0 auto;
          padding: clamp(8rem, 19vh, 11rem) clamp(1.25rem, 5vw, 3rem) clamp(2rem, 5vh, 3rem);
        }
        .dh-copy {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          max-width: 36rem;
        }
        .dh-badge {
          align-self: flex-start;
          padding: 0.45rem 0.9rem;
          border-radius: 999px;
          background: #fff;
          color: #0a4a42;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.06em;
        }
        .dh-copy h1 {
          margin: 0;
          color: #fff;
          -webkit-text-fill-color: currentColor;
          background: none;
          font-family: "Manrope", var(--font-sans);
          font-size: clamp(3.2rem, min(7.2vw, 11vh), 6.5rem);
          font-weight: 200;
          letter-spacing: -0.06em;
          line-height: 0.9;
        }
        .dh-copy h1 strong {
          font-weight: 700;
        }
        .dh-part {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.5rem;
          animation: dh-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes dh-in {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .dh-part-tab {
          color: #5dcaa5;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.1em;
        }
        .dh-part-title {
          font-family: "Manrope", var(--font-sans);
          font-size: clamp(1.6rem, 2.6vw, 2.4rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }
        .dh-part-text {
          max-width: 32rem;
          color: rgba(255, 255, 255, 0.92);
          font-size: clamp(1rem, 1.3vw, 1.12rem);
          line-height: 1.55;
        }
        .dh-copy :global(.dh-cta) {
          align-self: flex-start;
          margin-top: 0.5rem;
          padding: 1rem 1.75rem;
          border-radius: 999px;
          background: #fff;
          color: #0a4a42;
          font-size: 0.95rem;
          font-weight: 800;
          text-decoration: none;
          transition: transform 0.2s ease;
        }
        .dh-copy :global(.dh-cta:hover) {
          transform: translateY(-2px);
        }
        .dh-tabs {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(0.75rem, 2vw, 1.5rem);
        }
        .dh-tab {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          padding: 0;
          border: 0;
          background: none;
          color: #fff;
          font-family: "Manrope", var(--font-sans);
          text-align: left;
          cursor: pointer;
          opacity: 0.62;
          transition: opacity 0.3s ease;
        }
        .dh-tab.is-on,
        .dh-tab:hover {
          opacity: 1;
        }
        .dh-tab:focus-visible {
          outline: 2px solid #5dcaa5;
          outline-offset: 6px;
          border-radius: 4px;
        }
        .dh-track {
          position: relative;
          display: block;
          height: 3px;
          overflow: hidden;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.3);
        }
        .dh-fill {
          position: absolute;
          inset: 0;
          background: #fff;
          transform: scaleX(0);
          transform-origin: left center;
        }
        .dh-fill.is-done {
          transform: none;
        }
        .dh-fill.is-live {
          animation: dh-fill linear both;
        }
        @keyframes dh-fill {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
        .dh-tab-label {
          font-size: clamp(0.95rem, 1.4vw, 1.25rem);
          font-weight: 700;
        }

        @media (max-width: 700px) {
          .dh-tab-label {
            font-size: 0.8rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .dh-bg {
            transition: opacity 0.3s ease;
            transform: none;
          }
          .dh-bg.is-on {
            transform: none;
          }
          .dh-part {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
