"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Destination } from "@/lib/db";
import { useSpecialties } from "@/lib/useStoredData";
import { useFitBoard } from "@/lib/useFitBoard";

/* "Build your trip to <city>", design board Q4: pick a specialty and a
   procedure on the left and a travel pass fills itself in on the right, with
   the stay, the partner clinic in this city and the price. Only specialties
   with a clinic in this city are offered. Desktop draws the board at its real
   1440 x 900 and zooms it to the screen as one piece, like the canvas. */

const CODES: Record<string, string> = { medellin: "MDE", bogota: "BOG", cali: "CLO", cartagena: "CTG" };
const norm = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export type TripPick = { procedure: string; stay: string; price?: string; source: string };

export default function DestinationTrip({
  destination,
  es,
  onPick,
}: {
  destination: Destination;
  es: boolean;
  /** Tells the page what is chosen, so the closing pass carries it. */
  onPick?: (pick: TripPick) => void;
}) {
  const specialties = useSpecialties();
  const [s, setS] = useState(0);
  const [p, setP] = useState(0);
  // Desktop: laid out for the screen first (see useFitBoard), not shrunk.
  const boardRef = useFitBoard<HTMLDivElement>({ minH: 600, maxH: 900, fitContent: true });

  // Specialties with a partner clinic in this city, and their procedures that
  // have their own page.
  const city = norm(destination.name);
  const offer = specialties
    .map((spec) => {
      const clinic = spec.clinics.find((c) => norm(c).includes(`(${city})`));
      const procs = (spec.procedureDetails || []).filter((q) => q.slug);
      return clinic && procs.length > 0 ? { spec, clinic: clinic.replace(/\s*\(.*\)$/, ""), procs } : null;
    })
    .filter(Boolean) as {
    spec: (typeof specialties)[number];
    clinic: string;
    procs: NonNullable<(typeof specialties)[number]["procedureDetails"]>;
  }[];

  const cur = offer.length > 0 ? offer[Math.min(s, offer.length - 1)] : null;
  const q = cur ? cur.procs[Math.min(p, cur.procs.length - 1)] : null;

  // Hand the choice to the page (closing pass), whenever it changes.
  const pickName = q ? (es ? q.name : q.nameEn || q.name) : "";
  const pickStay = q ? (es ? q.recovery : q.recoveryEn || q.recovery) : "";
  const pickPrice = q?.priceFrom;
  const pickSource = cur && q ? `${destination.name} — ${cur.spec.name} — ${q.name}` : "";
  useEffect(() => {
    if (!onPick || !pickName) return;
    const m = pickStay.match(/(\d+)\s*[-–]\s*(\d+)|(\d+)/);
    onPick({
      procedure: pickName,
      stay: m ? (m[1] ? `${m[1]} – ${m[2]} ${es ? "días" : "days"}` : `${m[3]} ${es ? "días" : "days"}`) : pickStay,
      price: pickPrice,
      source: pickSource,
    });
  }, [onPick, pickName, pickStay, pickPrice, pickSource, es]);

  if (!cur || !q) return null;
  const code = CODES[destination.id] || destination.name.slice(0, 3).toUpperCase();
  const stay = (() => {
    const t = es ? q.recovery : q.recoveryEn || q.recovery;
    const m = t.match(/(\d+)\s*[-–]\s*(\d+)|(\d+)/);
    if (!m) return t;
    return m[1] ? `${m[1]}–${m[2]} ${es ? "días" : "days"}` : `${m[3]} ${es ? "días" : "days"}`;
  })();
  const price = q.priceFrom?.match(/^\$[\d,.]+/)?.[0];
  const tagline = es ? q.details?.tagline : q.details?.taglineEn || q.details?.tagline;

  return (
    <section className="dt" aria-labelledby="dt-title">
      <div className="dt-board" ref={boardRef}>
        <div className="dt-pick">
          <h2 id="dt-title">
            {es ? "Arma tu viaje" : "Build your trip"}{" "}
            <strong>{es ? `a ${destination.name}.` : `to ${destination.name}.`}</strong>
          </h2>
          <p className="dt-lead">
            {es ? "Elige qué te quieres hacer y mira cómo queda tu pase." : "Choose what you'd like done and see your pass take shape."}
          </p>
          {offer.length > 1 && (
            <div className="dt-tabs" role="tablist" aria-label={es ? "Especialidad" : "Specialty"}>
              {offer.map((o, i) => (
                <button
                  key={o.spec.id}
                  type="button"
                  role="tab"
                  aria-selected={o === cur}
                  className={o === cur ? "is-on" : undefined}
                  onClick={() => {
                    setS(i);
                    setP(0);
                  }}
                >
                  {es ? o.spec.name : o.spec.nameEn}
                </button>
              ))}
            </div>
          )}
          <div className="dt-list" role="radiogroup" aria-label={es ? "Procedimiento" : "Procedure"}>
            {cur.procs.map((x, i) => (
              <button
                key={x.slug}
                type="button"
                role="radio"
                aria-checked={x === q}
                className={`dt-chip${x === q ? " is-on" : ""}`}
                onClick={() => setP(i)}
              >
                <span className="dt-thumb" style={{ backgroundImage: `url(${x.photo || cur.spec.image})` }} aria-hidden="true" />
                <span className="dt-chip-name">{es ? x.name : x.nameEn}</span>
                <span className="dt-radio" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        <div className="dt-pass-col">
          <div className="dt-pass" key={`${cur.spec.id}-${q.slug}`} aria-live="polite">
            <div className="dt-pass-main">
              <span className="dt-head">
                <span>{es ? "BRIDGE CARE · PASE DE VIAJE" : "BRIDGE CARE · TRAVEL PASS"}</span>
                <span className="dt-head-spec">{(es ? cur.spec.name : cur.spec.nameEn).toUpperCase()}</span>
              </span>
              <span className="dt-route">
                <span className="dt-end">
                  <span className="dt-code dt-from">{es ? "TU" : "YOU"}</span>
                  <span className="dt-lab">{es ? "TU CIUDAD" : "YOUR CITY"}</span>
                </span>
                <span className="dt-line" aria-hidden="true">
                  <span>✈</span>
                </span>
                <span className="dt-end is-to">
                  <span className="dt-code dt-to">{code}</span>
                  <span className="dt-lab">{destination.name.toUpperCase()}</span>
                </span>
              </span>
              <span className="dt-name">{es ? q.name : q.nameEn}</span>
              {tagline && <span className="dt-tag">{tagline}</span>}
              <div className="dt-facts">
                <span>
                  <span className="dt-lab">{es ? "ESTADÍA" : "STAY"}</span>
                  <strong>{stay}</strong>
                </span>
                <span>
                  <span className="dt-lab">{es ? "CLÍNICA" : "CLINIC"}</span>
                  <strong>{cur.clinic}</strong>
                </span>
                {price && (
                  <span>
                    <span className="dt-lab">{es ? "DESDE" : "FROM"}</span>
                    <strong className="dt-price">{price} USD</strong>
                  </span>
                )}
              </div>
            </div>
            <div className="dt-stub">
              <span className="dt-stub-img" style={{ backgroundImage: `url(${q.photo || cur.spec.image})` }} aria-hidden="true" />
              <span className="dt-stamp" aria-hidden="true">
                {es ? "INCLUIDO" : "INCLUDED"}
              </span>
            </div>
          </div>
          <div className="dt-foot">
            <span>
              {es
                ? "Vuelo y gastos personales por tu cuenta. Todo lo demás, incluido."
                : "Your flight and personal expenses are on you. Everything else is included."}
            </span>
            <div className="dt-actions">
              <Link href={`/specialties/${cur.spec.id}/${q.slug}`} className="dt-more">
                {es ? "Ver procedimiento" : "View procedure"}
              </Link>
              {/* The pass itself is issued in the section right below. */}
              <a
                href="#tu-pase"
                className="dt-cta"
                onClick={(e) => {
                  const el = document.getElementById("tu-pase");
                  if (!el) return;
                  e.preventDefault();
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                {es ? "Emitir mi pase →" : "Issue my pass →"}
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dt {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100svh;
          overflow: hidden;
          background: var(--negro-suave);
        }
        /* Desktop: design board Q4's own pixels, zoomed as one piece. */
        .dt-board {
          display: grid;
          grid-template-columns: 430px minmax(0, 1fr);
          gap: 60px;
          box-sizing: border-box;
          flex-shrink: 0;
          align-items: center;
          width: 1440px;
          padding: max(84px, calc(96px * var(--fit, 1))) 120px calc(48px * var(--fit, 1));
          color: #101a18;
          font-family: "Manrope", var(--font-sans);
        }
        .dt-pick {
          display: flex;
          flex-direction: column;
          gap: calc(22px * var(--fit, 1));
          min-height: 0;
        }
        .dt-pick h2 {
          margin: 0;
          color: #101a18;
          -webkit-text-fill-color: currentColor;
          background: none;
          font-family: "Manrope", var(--font-sans);
          font-size: calc(54px * var(--fit, 1));
          font-weight: 300;
          line-height: 1.02;
          letter-spacing: -0.045em;
        }
        .dt-pick h2 strong {
          color: #0a4a42;
          font-weight: 700;
        }
        .dt-lead {
          margin: 0;
          color: #515856;
          font-size: 16px;
          line-height: 1.5;
        }
        .dt-tabs {
          align-self: flex-start;
          display: flex;
          gap: 4px;
          padding: 5px;
          border-radius: 999px;
          background: #fff;
          box-shadow: 0 16px 36px -28px rgba(10, 40, 36, 0.4);
        }
        .dt-tabs button {
          padding: 10px 18px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: #515856;
          font-family: inherit;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .dt-tabs button.is-on {
          background: #0a4a42;
          color: #fff;
        }
        .dt-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .dt-chip {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: calc(12px * var(--fit, 1)) 14px calc(12px * var(--fit, 1)) 12px;
          border: 1px solid rgba(29, 122, 110, 0.14);
          border-radius: 18px;
          background: transparent;
          font-family: inherit;
          text-align: left;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .dt-chip:hover {
          border-color: rgba(10, 74, 66, 0.45);
        }
        .dt-chip.is-on {
          border-color: #0a4a42;
          background: #fff;
          box-shadow: 0 16px 36px -26px rgba(10, 40, 36, 0.5);
        }
        .dt-chip:focus-visible,
        .dt-tabs button:focus-visible {
          outline: 2px solid #1d7a6e;
          outline-offset: 2px;
        }
        .dt-thumb {
          flex-shrink: 0;
          width: calc(52px * var(--fit, 1));
          height: calc(52px * var(--fit, 1));
          border-radius: 12px;
          background-position: center;
          background-size: cover;
        }
        .dt-chip-name {
          color: #101a18;
          font-size: 16px;
          font-weight: 700;
        }
        .dt-radio {
          flex-shrink: 0;
          width: 22px;
          height: 22px;
          margin-left: auto;
          border: 2px solid #c9cfcd;
          border-radius: 50%;
          box-sizing: border-box;
          transition: all 0.25s ease;
        }
        .dt-chip.is-on .dt-radio {
          border-color: #0a4a42;
          background: #0a4a42;
          box-shadow: inset 0 0 0 4px #fff;
        }

        .dt-pass-col {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 22px;
          min-width: 0;
        }
        .dt-pass {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 210px;
          overflow: hidden;
          border-radius: 28px;
          background: #fff;
          box-shadow: 0 50px 90px -50px rgba(10, 40, 36, 0.55);
          animation: dt-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .dt-pass-main {
          display: flex;
          flex-direction: column;
          gap: calc(20px * var(--fit, 1));
          padding: calc(30px * var(--fit, 1)) 34px;
        }
        .dt-head {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          color: #1d7a6e;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.16em;
          white-space: nowrap;
        }
        .dt-head-spec {
          color: #8a918f;
        }
        .dt-route {
          display: flex;
          align-items: center;
          gap: 22px;
        }
        .dt-end {
          display: flex;
          flex-direction: column;
        }
        .dt-end.is-to {
          align-items: flex-end;
        }
        .dt-code {
          font-size: calc(64px * var(--fit, 1));
          line-height: 0.9;
          letter-spacing: -0.05em;
        }
        .dt-from {
          font-weight: 200;
        }
        .dt-to {
          color: #0a4a42;
          font-weight: 700;
        }
        .dt-lab {
          color: #8a918f;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.2em;
        }
        .dt-line {
          position: relative;
          flex-grow: 1;
          height: 2px;
          background: repeating-linear-gradient(90deg, #c9cfcd 0 6px, transparent 6px 12px);
        }
        .dt-line span {
          position: absolute;
          left: 50%;
          top: -14px;
          margin-left: -14px;
          color: #0a4a42;
          font-size: 22px;
          animation: dt-fly 3s ease-in-out infinite;
        }
        .dt-name {
          font-size: calc(30px * var(--fit, 1));
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.035em;
        }
        .dt-tag {
          color: #515856;
          font-size: 16px;
        }
        .dt-facts {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          gap: 28px;
          padding-top: calc(18px * var(--fit, 1));
          border-top: 2px dashed rgba(29, 122, 110, 0.2);
        }
        .dt-facts > span {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .dt-facts strong {
          font-size: 20px;
          font-weight: 700;
        }
        .dt-facts .dt-price {
          color: #0a4a42;
        }
        .dt-stub {
          position: relative;
          overflow: hidden;
          border-left: 2px dashed rgba(255, 255, 255, 0.8);
        }
        .dt-stub-img {
          position: absolute;
          inset: 0;
          background-position: center;
          background-size: cover;
          animation: dt-kb 9s ease-out both;
        }
        .dt-stamp {
          position: absolute;
          left: 50%;
          top: 50%;
          display: flex;
          width: 96px;
          height: 96px;
          margin: -48px 0 0 -48px;
          align-items: center;
          justify-content: center;
          border: 3px solid #fff;
          border-radius: 50%;
          background: rgba(10, 74, 66, 0.55);
          color: #fff;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.14em;
          animation: dt-stamp 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
        }
        .dt-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          color: #515856;
          font-size: 14px;
        }
        .dt-actions {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          gap: 18px;
        }
        .dt-actions :global(.dt-more) {
          color: #1d7a6e;
          font-size: 15px;
          font-weight: 800;
          text-decoration: none;
        }
        .dt-actions :global(.dt-more:hover) {
          color: #0a4a42;
        }
        .dt-foot :global(.dt-cta) {
          flex-shrink: 0;
          padding: 15px 26px;
          border-radius: 999px;
          background: #0a4a42;
          color: #fff;
          font-size: 15px;
          font-weight: 800;
          text-decoration: none;
          transition: background 0.25s ease;
        }
        .dt-foot :global(.dt-cta:hover) {
          background: #0d5e54;
        }

        @keyframes dt-rise {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes dt-kb {
          from {
            transform: scale(1.03);
          }
          to {
            transform: scale(1.12);
          }
        }
        @keyframes dt-stamp {
          0% {
            opacity: 0;
            transform: scale(1.6) rotate(-14deg);
          }
          60% {
            opacity: 1;
            transform: scale(0.95) rotate(-14deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(-14deg);
          }
        }
        @keyframes dt-fly {
          0%,
          100% {
            transform: translateX(-30px);
          }
          50% {
            transform: translateX(30px);
          }
        }

        /* Phones and tablets: the same pieces, stacked. */
        @media (max-width: 900px) {
          .dt {
            min-height: 0;
          }
          .dt-board {
            grid-template-columns: 1fr;
            gap: 2rem;
            width: 100%;
            height: auto;
            padding: 3.5rem 1.25rem;
          }
          .dt-pick h2 {
            font-size: 2.3rem;
          }
          .dt-pass {
            grid-template-columns: 1fr;
          }
          .dt-pass-main {
            padding: 1.4rem;
          }
          .dt-code {
            font-size: 2.6rem;
          }
          .dt-name {
            font-size: 1.5rem;
          }
          .dt-facts {
            grid-template-columns: 1fr 1fr;
          }
          .dt-stub {
            order: -1;
            height: 170px;
            border-left: 0;
          }
          .dt-foot {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .dt-pass,
          .dt-stub-img,
          .dt-stamp,
          .dt-line span {
            animation: none;
          }
          .dt-stamp {
            transform: rotate(-14deg);
          }
        }
      `}</style>
    </section>
  );
}
