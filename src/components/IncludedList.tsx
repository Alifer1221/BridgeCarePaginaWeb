"use client";

import React, { useState } from "react";

/* "Everything your trip includes", design board F2: a large editorial list
   of what the package covers; the line you point at (hover, focus or tap)
   turns bold and the photo beside it changes, with a one-line detail. */

const photo = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1400`;

export default function IncludedList({ es, hood }: { es: boolean; hood: string }) {
  const items = [
    {
      t: es ? "Te recogemos en el aeropuerto" : "Airport pick-up",
      d: es ? "Un conductor te espera con tu nombre en la salida internacional." : "A driver waits for you, name in hand, at international arrivals.",
      img: photo("1436491865332-7a61a109cc05"),
    },
    {
      t: es ? `Tu hotel en ${hood}` : `Your hotel in ${hood}`,
      d: es ? "Una habitación cómoda para recuperarte, a minutos de la clínica." : "A comfortable room to recover in, minutes from the clinic.",
      img: photo("1566073771259-6a8506099945"),
    },
    {
      t: es ? "Especialista y clínica acreditada" : "Specialist and accredited clinic",
      d: es ? "Honorarios, quirófano, anestesia y exámenes en un precio cerrado." : "Fees, operating room, anaesthesia and tests in one fixed price.",
      img: photo("1666214280557-f1b5022eb634"),
    },
    {
      t: es ? "Enfermera en tu habitación" : "A nurse in your room",
      d: es ? "Curaciones y controles sin que tengas que salir del hotel." : "Dressings and check-ups without leaving your hotel.",
      img: photo("1516841273335-e39b37888115"),
    },
    {
      t: es ? "Especialistas que hablan tu idioma" : "Specialists who speak your language",
      d: es
        ? "Te atienden en tu idioma. Si quieres un acompañante bilingüe en cada cita, lo sumamos por un costo adicional."
        : "They see you in your language. If you'd like a bilingual companion at every appointment, we add one at an extra cost.",
      img: photo("1551882547-ff40c63fe5fa"),
    },
    {
      t: es ? "Traslados a cada cita" : "Transfers to every appointment",
      d: es ? "Del hotel a la clínica y de vuelta, siempre con conductor." : "Hotel to clinic and back, always with a driver.",
      img: photo("1680209082240-1abf11585936"),
    },
  ];
  const [active, setActive] = useState(0);
  const cur = items[active];

  return (
    <section className="il" aria-labelledby="il-title">
      <div className="il-inner">
        <div className="il-list-col">
          <h2 id="il-title">
            {es ? "Todo lo que incluye" : "Everything included in"} <strong>{es ? "tu viaje." : "your trip."}</strong>
          </h2>
          <ul className="il-list">
            {items.map((it, i) => (
              <li key={it.t}>
                <button
                  type="button"
                  className={`il-row${i === active ? " is-on" : ""}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                >
                  <span className="il-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="il-name">{it.t}</span>
                  <span className="il-tag">{es ? "INCLUIDO" : "INCLUDED"}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="il-note">
            {es
              ? "Solo corren por tu cuenta el vuelo y tus gastos personales."
              : "Only your flight and personal expenses are on you."}
          </p>
        </div>

        <figure className="il-figure">
          <div className="il-photo">
            {items.map((it, i) => (
              <span
                key={it.img}
                className={`il-img${i === active ? " is-on" : ""}`}
                style={{ backgroundImage: `url(${it.img})` }}
                aria-hidden="true"
              />
            ))}
          </div>
          <figcaption key={active}>{cur.d}</figcaption>
        </figure>
      </div>

      <style jsx>{`
        .il {
          display: flex;
          align-items: center;
          min-height: 100svh;
          background: var(--negro-suave);
        }
        .il-inner {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 0.62fr);
          gap: clamp(2.5rem, 6vw, 5rem);
          align-items: center;
          width: 100%;
          max-width: 1240px;
          margin: 0 auto;
          padding: clamp(5rem, 11vh, 7rem) clamp(1.25rem, 5vw, 3rem) clamp(3rem, 7vh, 4.5rem);
        }
        .il-list-col {
          display: flex;
          flex-direction: column;
          gap: clamp(1.25rem, 3vh, 1.75rem);
        }
        .il-list-col h2 {
          margin: 0;
          color: #101a18;
          -webkit-text-fill-color: currentColor;
          background: none;
          font-family: "Manrope", var(--font-sans);
          font-size: clamp(2.2rem, min(4vw, 6.5vh), 3.5rem);
          font-weight: 300;
          letter-spacing: -0.045em;
          line-height: 1.03;
        }
        .il-list-col h2 strong {
          color: #0a4a42;
          font-weight: 700;
        }
        .il-list {
          margin: 0;
          padding: 0;
          list-style: none;
          border-top: 1px solid rgba(29, 122, 110, 0.16);
        }
        .il-row {
          display: grid;
          grid-template-columns: 3.5rem 1fr auto;
          align-items: center;
          width: 100%;
          padding: clamp(0.9rem, 2.2vh, 1.35rem) 0;
          border: 0;
          border-bottom: 1px solid rgba(29, 122, 110, 0.16);
          background: none;
          color: #9aa3a0;
          font-family: "Manrope", var(--font-sans);
          text-align: left;
          cursor: pointer;
          transition:
            color 0.25s ease,
            padding-left 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .il-row.is-on {
          padding-left: 1rem;
          color: #0a4a42;
        }
        .il-row:focus-visible {
          outline: 2px solid #1d7a6e;
          outline-offset: 2px;
        }
        .il-num {
          font-size: 0.82rem;
          font-weight: 700;
        }
        .il-name {
          font-size: clamp(1.25rem, min(2.2vw, 3.6vh), 2rem);
          font-weight: 300;
          letter-spacing: -0.03em;
          transition: font-weight 0.2s ease;
        }
        .il-row.is-on .il-name {
          font-weight: 700;
        }
        .il-tag {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: transparent;
          transition: color 0.25s ease;
        }
        .il-row.is-on .il-tag {
          color: #1d7a6e;
        }
        .il-note {
          margin: 0;
          color: var(--sp-muted, #515856);
          font-size: 0.92rem;
        }

        .il-figure {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin: 0;
        }
        .il-photo {
          position: relative;
          height: min(62vh, 560px);
          overflow: hidden;
          border-radius: 26px;
          background: #d8d0c3;
        }
        .il-img {
          position: absolute;
          inset: 0;
          background-position: center;
          background-size: cover;
          opacity: 0;
          transform: scale(1.02);
          transition:
            opacity 0.6s ease,
            transform 5s ease-out;
        }
        .il-img.is-on {
          opacity: 1;
          transform: scale(1.1);
        }
        .il-figure figcaption {
          color: #515856;
          font-size: 1.02rem;
          line-height: 1.55;
          animation: il-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes il-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        @media (max-width: 900px) {
          .il {
            min-height: 0;
          }
          .il-inner {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            padding-block: 3.5rem;
          }
          .il-figure {
            order: -1;
          }
          .il-photo {
            height: auto;
            aspect-ratio: 4 / 3;
          }
          .il-row {
            grid-template-columns: 2.5rem 1fr;
          }
          .il-tag {
            display: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .il-img,
          .il-img.is-on {
            transform: none;
            transition: opacity 0.2s ease;
          }
          .il-figure figcaption {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
