"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { Destination } from "@/lib/db";
import { useDestinations } from "@/lib/useStoredData";
import { useLanguage } from "@/context/LanguageContext";
import DestinationHero from "@/components/DestinationHero";
import IncludedList from "@/components/IncludedList";
import CityHighlights from "@/components/CityHighlights";
import CityMoods from "@/components/CityMoods";
import DestinationTrip, { TripPick } from "@/components/DestinationTrip";
import { ClosingPass } from "@/app/specialties/[slug]/SpecialtyDetailClient";

interface DestinationDetailProps {
  params: Promise<{ slug: string }>;
}

const HOOD: Record<string, string> = { medellin: "El Poblado", bogota: "Usaquén", cali: "Granada", cartagena: "Bocagrande" };

/* The practical facts, as one quiet line before the close: what people ask
   before deciding, not a section of its own. */
const FACTS: Record<string, { temp: string; tempEs: string; tempEn: string; airport: string }> = {
  medellin: { temp: "22 °C", tempEs: "todo el año", tempEn: "year-round", airport: "José María Córdova · MDE" },
  bogota: { temp: "14 °C", tempEs: "de promedio", tempEn: "on average", airport: "El Dorado · BOG" },
  cali: { temp: "24 °C", tempEs: "de promedio", tempEn: "on average", airport: "Alfonso Bonilla Aragón · CLO" },
  cartagena: { temp: "28 °C", tempEs: "de promedio", tempEn: "on average", airport: "Rafael Núñez · CTG" },
};

export default function DestinationDetail({ params }: DestinationDetailProps) {
  const { language } = useLanguage();
  const { slug } = use(params);
  // Hydration-safe, and re-renders on its own when the admin panel saves —
  // no manual refresh counter needed.
  const destination: Destination | null =
    useDestinations().find((d) => d.id === slug) || null;
  // What the reader picked in "build your trip", carried by the closing pass.
  const [pick, setPick] = useState<TripPick | null>(null);

  if (!destination) {
    return (
      <div className="container error-container text-center">
        <h2>
          {language === "es" ? "Destino no encontrado" : "Destination not found"}
        </h2>
        <p>
          {language === "es"
            ? "La ciudad solicitada no está registrada en nuestra red."
            : "The requested city is not registered in our network."}
        </p>
        <Link href="/" className="btn btn-primary">
          {language === "es" ? "Volver al Inicio" : "Return to Home"}
        </Link>
        <style jsx>{`
          .error-container {
            padding: 8rem 1.5rem;
          }
          .error-container h2 {
            margin-bottom: 1rem;
          }
        `}</style>
      </div>
    );
  }

  const es = language === "es";
  const hood = HOOD[destination.id] || destination.name;
  const facts = FACTS[destination.id];

  return (
    <div className="destination-detail-page">
      <div className="glow-sphere glow-1"></div>

      {/* Hero: the city, all inclusive (design board BH4) */}
      <DestinationHero destination={destination} es={es} />

      {/* What the package covers (design board F2) */}
      <IncludedList es={es} hood={hood} />

      {/* Why this city: medicine + places (design board H1) */}
      <CityHighlights destination={destination} es={es} />

      {/* Everything to do in the city, by mood (design boards V2 + E4) */}
      <CityMoods destination={destination} es={es} />

      {/* Build your trip: procedure → travel pass (design board Q4) */}
      <DestinationTrip destination={destination} es={es} onPick={setPick} />

      {/* The practical facts in one line */}
      <section className="dd-facts" aria-label={es ? "Datos prácticos" : "Practical facts"}>
        <dl>
          {facts && (
            <div>
              <dt>{es ? "Clima" : "Climate"}</dt>
              <dd>
                {facts.temp} <span>{es ? facts.tempEs : facts.tempEn}</span>
              </dd>
            </div>
          )}
          {facts && (
            <div>
              <dt>{es ? "Llegas a" : "You land at"}</dt>
              <dd>{facts.airport}</dd>
            </div>
          )}
          <div>
            <dt>{es ? "Te hospedas en" : "You stay in"}</dt>
            <dd>{hood}</dd>
          </div>
          <div>
            <dt>{es ? "Idioma" : "Language"}</dt>
            <dd>{es ? "Especialistas que hablan inglés" : "English-speaking specialists"}</dd>
          </div>
        </dl>
      </section>

      {/* The close: the boarding pass (design board AH), with the trip picked above */}
      <section className="dd-close" id="tu-pase">
        <ClosingPass
          es={es}
          city={destination.name}
          procedure={pick?.procedure || (es ? "Tu tratamiento" : "Your treatment")}
          stay={pick?.stay}
          price={pick?.price}
          source={pick?.source || destination.name}
        />
      </section>

      <style jsx>{`
        .destination-detail-page {
          position: relative;
          /* The glow sphere hangs past the right edge; without this it
             widens the page on phones. clip (not hidden) keeps sticky. */
          overflow-x: clip;
        }
        .glow-sphere {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(140px);
          opacity: 0.12;
          pointer-events: none;
          z-index: 0;
        }
        .glow-1 {
          background: var(--teal-primary);
          top: 30%;
          right: -100px;
        }

        .dd-facts {
          position: relative;
          z-index: 1;
          background: var(--negro-suave);
        }
        .dd-facts dl {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.6rem clamp(1.25rem, 5vw, 3rem);
          border-top: 1px solid rgba(29, 122, 110, 0.16);
          border-bottom: 1px solid rgba(29, 122, 110, 0.16);
        }
        .dd-facts dl > div {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .dd-facts dt {
          color: #8a918f;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .dd-facts dd {
          margin: 0;
          color: #101a18;
          font-family: "Manrope", var(--font-sans);
          font-size: 1.05rem;
          font-weight: 700;
        }
        .dd-facts dd span {
          color: #515856;
          font-weight: 500;
        }

        /* Same frame as the procedure pages' close: the pass board is zoomed
           to the screen by its own component. */
        .dd-close {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100svh;
          overflow: hidden;
          background: var(--negro-suave);
        }

        @media (max-width: 900px) {
          .dd-facts dl {
            grid-template-columns: 1fr 1fr;
          }
          .dd-close {
            min-height: 0;
            padding: 3rem 0;
          }
        }
      `}</style>
    </div>
  );
}
