"use client";

import React from "react";
import { Destination } from "@/lib/db";

/* Why this city, design board H1: first the medicine (three verified facts,
   each with its source), then the city to enjoy (a photo mosaic of places).
   Medellín has its own set; other cities fall back to the national fact and
   the places listed in their catalogue entry until they get theirs. */

const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1600`;

type Fact = { big: string; text: string; textEn: string; source: string };
type Place = { name: string; nameEn?: string; text: string; textEn: string; img: string };

const NATIONAL: Fact = {
  big: "26",
  text: "hospitales colombianos entre los 80 mejores de Latinoamérica",
  textEn: "Colombian hospitals among Latin America's 80 best",
  source: "IntelLat 2025",
};

const CITY: Record<string, { facts: Fact[]; places: Place[] }> = {
  medellin: {
    facts: [
      NATIONAL,
      {
        big: "Top 250",
        text: "del mundo: el Hospital Pablo Tobón Uribe de Medellín",
        textEn: "in the world: Medellín's Hospital Pablo Tobón Uribe",
        source: "Newsweek · Statista",
      },
      {
        big: "2013",
        text: "Medellín, elegida la ciudad más innovadora del mundo",
        textEn: "Medellín, named the world's most innovative city",
        source: "Wall Street Journal · Citi",
      },
    ],
    places: [
      { name: "Guatapé", text: "El pueblo de colores junto al embalse, a 2 horas.", textEn: "The colourful town by the reservoir, 2 hours away.", img: img("1598028060898-c117093edfcb") },
      { name: "La Piedra del Peñol", nameEn: "El Peñol Rock", text: "740 escalones y la mejor vista de Antioquia.", textEn: "740 steps and the best view in Antioquia.", img: img("1679605848614-b508dd4c4f85") },
      { name: "Comuna 13", text: "Grafitis, música y la historia de transformación de la ciudad.", textEn: "Street art, music and the city's story of change.", img: img("1693669029454-ab14dd80faaa") },
      { name: "El Poblado de noche", nameEn: "El Poblado by night", text: "Restaurantes, terrazas y la ciudad iluminada.", textEn: "Restaurants, terraces and the city lit up.", img: img("1512250431446-d0b4b57b27ec") },
    ],
  },
};

export default function CityHighlights({ destination, es }: { destination: Destination; es: boolean }) {
  const own = CITY[destination.id];
  const facts = own?.facts || [NATIONAL];
  const tourism = (es ? destination.tourism : destination.tourismEn || destination.tourism) || "";
  const places: Place[] =
    own?.places ||
    tourism
      .replace(/\.$/, "")
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)
      .slice(0, 4)
      .map((p) => ({ name: p, text: "", textEn: "", img: destination.image }));

  return (
    <section className="ch" aria-labelledby="ch-title">
      <div className="ch-inner">
        <div className="ch-med">
          <h2 id="ch-title">
            {es ? "Medicina de" : "First-rate"} <strong>{es ? "primer nivel." : "medicine."}</strong>
          </h2>
          {facts.map((f) => (
            <div key={f.big} className="ch-fact">
              <span className="ch-big">{f.big}</span>
              <span className="ch-text">{es ? f.text : f.textEn}</span>
              <span className="ch-src">{f.source}</span>
            </div>
          ))}
        </div>

        <div className="ch-city-head">
          <p>
            {es ? "Y una ciudad" : "And a city"} <strong>{es ? "para disfrutar." : "to enjoy."}</strong>
          </p>
          <span>
            {es
              ? "Cuando tu médico lo autorice, o para tu acompañante."
              : "Once your doctor says so, or for your companion."}
          </span>
        </div>

        <div className={`ch-grid n-${places.length}`}>
          {places.map((p, i) => (
            <figure key={p.name} className={`ch-tile t-${i}`}>
              <span className="ch-ph" style={{ backgroundImage: `url(${p.img})` }} aria-hidden="true" />
              <span className="ch-shade" aria-hidden="true" />
              <figcaption>
                <strong>{es ? p.name : p.nameEn || p.name}</strong>
                {(es ? p.text : p.textEn) && <span>{es ? p.text : p.textEn}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <style jsx>{`
        .ch {
          display: flex;
          align-items: center;
          min-height: 100svh;
          background: var(--negro-suave);
        }
        .ch-inner {
          display: flex;
          flex-direction: column;
          gap: clamp(1.25rem, 3vh, 2rem);
          width: 100%;
          max-width: 1240px;
          margin: 0 auto;
          padding: clamp(5rem, 11vh, 6.5rem) clamp(1.25rem, 5vw, 3rem) clamp(2.5rem, 6vh, 3.5rem);
        }
        .ch-med {
          display: grid;
          grid-template-columns: 1.1fr repeat(3, 1fr);
          gap: clamp(1.5rem, 3vw, 2.5rem);
          align-items: end;
        }
        .ch-med h2 {
          margin: 0;
          color: #101a18;
          -webkit-text-fill-color: currentColor;
          background: none;
          font-family: "Manrope", var(--font-sans);
          font-size: clamp(2rem, min(3.6vw, 6vh), 3.2rem);
          font-weight: 300;
          letter-spacing: -0.045em;
          line-height: 1.02;
        }
        .ch-med h2 strong {
          color: #0a4a42;
          font-weight: 700;
        }
        .ch-fact {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .ch-big {
          color: #0a4a42;
          font-family: "Manrope", var(--font-sans);
          font-size: clamp(2.4rem, min(4vw, 6.5vh), 3.5rem);
          font-weight: 200;
          letter-spacing: -0.05em;
          line-height: 0.9;
        }
        .ch-text {
          color: #515856;
          font-size: 0.98rem;
          line-height: 1.45;
        }
        .ch-src {
          color: #8a918f;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.04em;
        }
        .ch-city-head {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          justify-content: space-between;
          gap: 0.5rem 2rem;
          padding-top: clamp(1rem, 2.6vh, 1.5rem);
          border-top: 1px solid rgba(29, 122, 110, 0.16);
        }
        .ch-city-head p {
          margin: 0;
          color: #101a18;
          font-family: "Manrope", var(--font-sans);
          font-size: clamp(1.5rem, 2.2vw, 1.9rem);
          font-weight: 300;
          letter-spacing: -0.03em;
        }
        .ch-city-head p strong {
          color: #0a4a42;
          font-weight: 700;
        }
        .ch-city-head span {
          color: #515856;
          font-size: 0.9rem;
        }
        .ch-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr;
          grid-template-rows: repeat(2, clamp(150px, 22vh, 230px));
          gap: 14px;
        }
        .ch-grid.n-4 .t-0 {
          grid-row: span 2;
        }
        .ch-grid.n-4 .t-3 {
          grid-column: span 2;
        }
        .ch-tile {
          position: relative;
          margin: 0;
          overflow: hidden;
          border-radius: 22px;
          background: #d8d0c3;
        }
        .ch-ph {
          position: absolute;
          inset: 0;
          background-position: center;
          background-size: cover;
          transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ch-tile:hover .ch-ph {
          transform: scale(1.06);
        }
        .ch-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(0deg, rgba(8, 20, 18, 0.78), rgba(8, 20, 18, 0) 55%);
        }
        .ch-tile figcaption {
          position: absolute;
          right: 20px;
          bottom: 18px;
          left: 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          color: #fff;
        }
        .ch-tile figcaption strong {
          font-family: "Manrope", var(--font-sans);
          font-size: 1.2rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .ch-tile.t-0 figcaption strong {
          font-size: 1.6rem;
        }
        .ch-tile figcaption span {
          font-size: 0.85rem;
          line-height: 1.45;
          opacity: 0.9;
        }

        @media (max-width: 900px) {
          .ch {
            min-height: 0;
          }
          .ch-med {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
          .ch-grid {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: none;
            grid-auto-rows: 180px;
          }
          .ch-grid.n-4 .t-0 {
            grid-row: auto;
            grid-column: span 2;
          }
          .ch-grid.n-4 .t-3 {
            grid-column: span 2;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ch-ph {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}
