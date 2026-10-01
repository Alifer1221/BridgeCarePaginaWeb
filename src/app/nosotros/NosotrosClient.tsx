"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useFitBoard } from "@/lib/useFitBoard";
import { Caveat, Newsreader } from "next/font/google";
import { useLanguage } from "@/context/LanguageContext";
import { FOUNDER_NAME, FOUNDER_ROLE, FOUNDER_ROLE_EN, TEAM, waHref } from "@/lib/contact";
import { PARTNER_DOCTORS } from "@/lib/doctors";

const serif = Newsreader({ subsets: ["latin"], weight: ["400"], display: "swap", preload: false });
const hand = Caveat({ subsets: ["latin"], weight: ["500"], display: "swap", preload: false });

/* Nosotros, rebuilt section by section around trust. First: "why we exist"
   (design board N5), the founder's real story told from the patient's side.
   Desktop draws the boards at their real 1440 px width across the screen;
   useFitBoard reads the screen first and fits type, photos and spacing to
   its height (--fit, --bh) instead of shrinking the whole board. */

// ⚠️ Mood photo, not the founder: replace with a real photo when there is one.
const PHOTO =
  "https://images.unsplash.com/photo-1674938248536-a6252246216a?auto=format&fit=crop&q=80&w=1400";

const STORY = {
  es: [
    "Todo empezó con una conversación en Estados Unidos. Una mujer me contó que soñaba con operarse en Colombia. Lo decía con ilusión, como quien habla de algo que lleva años imaginando.",
    "Y yo pensé en todo lo que venía después de esa ilusión: a quién creerle, dónde quedarse, quién iba a estar ahí al despertar de la cirugía, lejos de casa y en otro idioma.",
    "Ahí entendí que la cirugía no era lo difícil. Lo difícil era hacerlo sin nadie al lado. Por eso existe Bridge Care: para que ese cambio que imaginas lo vivas con calma y con compañía de principio a fin.",
  ],
  en: [
    "It all started with a conversation in the United States. A woman told me she dreamed of having surgery in Colombia. She said it with excitement, the way you talk about something you've imagined for years.",
    "And I thought about everything that came after that excitement: who to trust, where to stay, who would be there when she woke up from surgery, far from home and in another language.",
    "That's when I understood that the surgery wasn't the hard part. The hard part was doing it with no one by your side. That's why Bridge Care exists: so the change you imagine is lived calmly, with company from start to finish.",
  ],
};

const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1200`;

/* The Bridge promise (design board P3): five signed commitments, one at a
   time in giant type, the photo changing beside it. ⚠️ Each line is a public
   commitment: confirm Bridge Care keeps it before going live. */
const PROMISES = [
  {
    t: "Sabrás quién te opera antes de pagar.",
    tEn: "You'll know who operates on you before you pay.",
    x: "Nombre, registro médico y sociedad científica de tu especialista, para que lo verifiques tú.",
    xEn: "Your specialist's name, medical registry and scientific society, so you can check them yourself.",
    s: "Sabes quién te opera",
    sEn: "You know who operates",
    img: img("1612349317150-e413f6a5b16d"),
  },
  {
    t: "El precio que firmas es el que pagas.",
    tEn: "The price you sign is the price you pay.",
    x: "Cotización cerrada y por escrito antes de comprar el tiquete. Sin cobros al llegar.",
    xEn: "A closed quote, in writing, before you buy your ticket. No charges on arrival.",
    s: "Precio que firmas",
    sEn: "The price you sign",
    img: img("1666214280557-f1b5022eb634"),
  },
  {
    t: "Nunca en consultorio.",
    tEn: "Never in a doctor's office.",
    x: "Solo clínicas habilitadas, con quirófano y hospitalización en el mismo lugar.",
    xEn: "Only licensed clinics, with an operating room and inpatient beds in the same place.",
    s: "Nunca en consultorio",
    sEn: "Never in an office",
    img: img("1551076805-e1869033e561"),
  },
  {
    t: "Siempre sabrás a quién escribirle.",
    tEn: "You'll always know who to message.",
    x: "Te recogemos en el aeropuerto, te llevamos a cada cita y Laura está pendiente de ti por WhatsApp.",
    xEn: "We pick you up at the airport, take you to every appointment, and Laura is there for you on WhatsApp.",
    s: "Alguien a quien escribir",
    sEn: "Someone to message",
    img: img("1674938248536-a6252246216a"),
  },
  {
    t: "Te diremos que no, si no es para ti.",
    tEn: "We'll tell you no, if it isn't right for you.",
    x: "Si tu valoración dice que no eres buen candidato, te lo decimos antes de que viajes.",
    xEn: "If your assessment says you're not a good candidate, we tell you before you travel.",
    s: "Un no honesto",
    sEn: "An honest no",
    img: img("1519494026892-80bbd2d6fd0d"),
  },
];

/* Who looks after you (design board R5): the two people, with name, face and
   a verifiable profile, then the partner network. Only what's true: the
   general coordinator runs the whole trip; the other coordinator schedules
   the interview by email, asks which language you prefer and does the
   interviews in English; every partner speaks English. */
const TEAM_CARDS = (es: boolean) => [
  {
    key: "general",
    name: FOUNDER_NAME,
    role: es ? "Coordinador general" : "General coordinator",
    when: es ? "DE PRINCIPIO A FIN" : "FROM START TO FINISH",
    does: es
      ? ["Te conecta con el especialista", "Coordina clínica, hotel y traslados", "Responde tus dudas", "Sigue tu caso cuando vuelves a casa"]
      : ["Connects you with the specialist", "Coordinates clinic, hotel and transfers", "Answers your questions", "Follows your case once you're home"],
    photo: TEAM.general.photo,
    linkedin: TEAM.general.linkedin,
    quote: es ? TEAM.general.quote : TEAM.general.quoteEn,
    whatsapp: true,
  },
  {
    key: "interviews",
    name: TEAM.interviews.name,
    role: es ? "Coordinador" : "Coordinator",
    when: es ? "TU ENTREVISTA, EN TU IDIOMA" : "YOUR INTERVIEW, IN YOUR LANGUAGE",
    does: es
      ? ["Agenda tu entrevista por correo", "Te pregunta en qué idioma prefieres hacerla", "Hace las entrevistas en inglés"]
      : ["Schedules your interview by email", "Asks which language you'd prefer", "Runs the interviews in English"],
    photo: TEAM.interviews.photo,
    linkedin: TEAM.interviews.linkedin,
    quote: es ? TEAM.interviews.quote : TEAM.interviews.quoteEn,
    whatsapp: false,
  },
];


function TeamSection({ es }: { es: boolean }) {
  const boardRef = useFitBoard<HTMLDivElement>({ minH: 600, maxH: 900, fitContent: true });
  return (
    <section className="tm" aria-labelledby="tm-title">
      <div className="tm-board" ref={boardRef}>
        <div className="tm-head">
          <h2 id="tm-title">
            {es ? "Quién te atiende," : "Who looks after you,"} <strong>{es ? "con nombre propio." : "by name."}</strong>
          </h2>
          <p>
            {es
              ? "No un call center: personas que conocen tu caso y responden por él."
              : "Not a call centre: people who know your case and answer for it."}
          </p>
        </div>

        <div className="tm-cards">
          {TEAM_CARDS(es).map((p) => (
            <article key={p.key} className="tm-card">
              {p.photo ? (
                <span className="tm-photo" style={{ backgroundImage: `url(${p.photo})` }} role="img" aria-label={p.name || p.role} />
              ) : (
                <span className="tm-photo tm-photo-brand" aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/isotipo.svg" alt="" />
                </span>
              )}
              <div className="tm-body">
                <span className="tm-when">{p.when}</span>
                <h3>{p.name || p.role}</h3>
                {p.name && <span className="tm-role">{p.role}</span>}
                <ul>
                  {p.does.map((d) => (
                    <li key={d}>
                      <span aria-hidden="true">✓</span>
                      {d}
                    </li>
                  ))}
                </ul>
                {p.quote && <p className={`tm-quote ${serif.className}`}>“{p.quote}”</p>}
                <span className="tm-links">
                  {p.linkedin && (
                    <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="tm-li">
                      in&nbsp; LinkedIn
                    </a>
                  )}
                  {p.whatsapp && (
                    <a
                      href={waHref(es ? "Hola, quiero información sobre mi viaje con Bridge Care." : "Hi, I'd like information about my trip with Bridge Care.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tm-wa"
                    >
                      WhatsApp
                    </a>
                  )}
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>

      <style jsx>{`
        .tm {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100svh;
          overflow: hidden;
          background: var(--negro-suave);
        }
        /* Design board R5 at its 1440 px, fitted to the screen (useFitBoard). */
        .tm-board {
          --f: var(--fit, 1);
          display: flex;
          flex-direction: column;
          gap: calc(26px * var(--f));
          flex-shrink: 0;
          box-sizing: border-box;
          width: 1440px;
          padding: max(88px, calc(96px * var(--f))) 120px calc(44px * var(--f));
          color: #101a18;
          font-family: "Manrope", var(--font-sans);
        }
        .tm-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
        }
        .tm-head h2 {
          margin: 0;
          color: #101a18;
          -webkit-text-fill-color: currentColor;
          background: none;
          font-family: "Manrope", var(--font-sans);
          font-size: calc(54px * var(--f));
          font-weight: 300;
          line-height: 1.03;
          letter-spacing: -0.05em;
        }
        .tm-head h2 strong {
          color: #0a4a42;
          font-weight: 700;
        }
        .tm-head p {
          max-width: 320px;
          margin: 0;
          color: #515856;
          font-size: 15px;
          line-height: 1.5;
          text-align: right;
        }
        .tm-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
        }
        .tm-card {
          display: grid;
          grid-template-columns: 250px minmax(0, 1fr);
          gap: 28px;
          padding: 22px;
          border-radius: 28px;
          background: #fff;
          box-shadow: 0 30px 60px -48px rgba(10, 40, 36, 0.55);
        }
        .tm-photo {
          min-height: calc(360px * var(--f));
          border-radius: 20px;
          background-position: center top;
          background-size: cover;
        }
        .tm-photo-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(160deg, #eef5f1 0%, #f3e6d3 100%);
        }
        .tm-photo-brand img {
          width: 45%;
          height: auto;
          opacity: 0.85;
        }
        .tm-body {
          display: flex;
          flex-direction: column;
          gap: calc(10px * var(--f));
          min-width: 0;
        }
        .tm-when {
          color: #b0703c;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.14em;
        }
        .tm-body h3 {
          margin: 0;
          color: #101a18;
          font-family: "Manrope", var(--font-sans);
          font-size: calc(34px * var(--f));
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.04em;
        }
        .tm-role {
          color: #515856;
          font-size: 16px;
        }
        .tm-body ul {
          margin: 4px 0 0;
          padding: 0;
          list-style: none;
        }
        .tm-body li {
          display: flex;
          gap: 10px;
          padding: calc(8px * var(--f)) 0;
          border-top: 1px solid rgba(16, 26, 24, 0.08);
          font-size: 15px;
        }
        .tm-body li span {
          color: #0a4a42;
          font-weight: 800;
        }
        .tm-quote {
          margin: 0;
          color: #2a3432;
          font-size: 17px;
          line-height: 1.5;
        }
        .tm-links {
          display: flex;
          gap: 8px;
          margin-top: auto;
        }
        .tm-links :global(a) {
          padding: 9px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }
        .tm-links :global(.tm-li) {
          background: #0a66c2;
          color: #fff;
        }
        .tm-links :global(.tm-wa) {
          background: #f1eee8;
          color: #0a4a42;
        }
        @media (max-width: 900px) {
          .tm {
            min-height: 0;
          }
          .tm-board {
            width: 100%;
            padding: 3.5rem 1.25rem;
          }
          .tm-head {
            flex-direction: column;
            align-items: flex-start;
          }
          .tm-head h2 {
            font-size: 2.3rem;
          }
          .tm-head p {
            text-align: left;
          }
          .tm-cards {
            grid-template-columns: 1fr;
          }
          .tm-card {
            grid-template-columns: 1fr;
          }
          .tm-photo {
            min-height: 260px;
          }
        }
      `}</style>
    </section>
  );
}

/* The partner doctors (design board D3, "mural"): the message and the count by
   specialty on the left, a wall of portraits on the right. One portrait is
   always open with its details; it moves on by itself and follows the hover
   or keyboard focus. Beyond eight doctors, "Ver a todos" opens the full list. */
const WALL_MAX = 8;
const WALL_SPANS = [2, 3, 2, 3, 3, 2, 3, 2];

function DoctorsSection({ es }: { es: boolean }) {
  const boardRef = useFitBoard<HTMLDivElement>({ minH: 600, maxH: 900 });
  const [active, setActive] = useState(3);
  const [paused, setPaused] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const wall = PARTNER_DOCTORS.slice(0, WALL_MAX);
  const current = wall.length ? active % wall.length : 0;

  const bySpecialty = PARTNER_DOCTORS.reduce<{ es: string; en: string; n: number }[]>((acc, d) => {
    const row = acc.find((r) => r.es === d.specialty);
    if (row) row.n += 1;
    else acc.push({ es: d.specialty, en: d.specialtyEn, n: 1 });
    return acc;
  }, []);

  useEffect(() => {
    if (paused || wall.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % wall.length), 3800);
    return () => window.clearInterval(id);
  }, [paused, wall.length]);

  if (!PARTNER_DOCTORS.length) return null;
  const langs = (l: string[]) => (es ? `atiende en ${l.map((x) => (x === "EN" ? "inglés" : x === "ES" ? "español" : x)).join(" y ")}` : `sees patients in ${l.map((x) => (x === "EN" ? "English" : x === "ES" ? "Spanish" : x)).join(" and ")}`);

  return (
    <section className="dm" aria-labelledby="dm-title">
      <div className="dm-board" ref={boardRef}>
        <div className="dm-copy">
          <span className="dm-kicker">{es ? "EL EQUIPO MÉDICO" : "THE MEDICAL TEAM"}</span>
          <h2 id="dm-title">
            {es ? "Detrás de cada viaje," : "Behind every trip,"} <strong>{es ? "un especialista con nombre." : "a specialist with a name."}</strong>
          </h2>
          <p className={serif.className}>
            {es
              ? "Trabajamos con especialistas certificados en Colombia. Antes de viajar sabes quién te va a atender, y te atiende en tu idioma."
              : "We work with certified specialists in Colombia. Before you travel you know who will see you, and they see you in your language."}
          </p>
          <ul className="dm-count">
            {bySpecialty.map((r) => (
              <li key={r.es}>
                <span>{es ? r.es : r.en}</span>
                <b>{r.n}</b>
              </li>
            ))}
          </ul>
          <p className="dm-net">
            {es
              ? "Junto a ellos, clínicas habilitadas, hoteles y traslados aliados. "
              : "Alongside them, licensed partner clinics, hotels and transfers. "}
            <b>{es ? "Todos hablan inglés." : "All of them speak English."}</b>
          </p>
          {PARTNER_DOCTORS.length > WALL_MAX && (
            <button type="button" className="dm-all" onClick={() => setShowAll((v) => !v)} aria-expanded={showAll}>
              {showAll ? (es ? "Ocultar la lista" : "Hide the list") : es ? `Ver a todos los médicos (${PARTNER_DOCTORS.length}) →` : `See all doctors (${PARTNER_DOCTORS.length}) →`}
            </button>
          )}
        </div>

        <div
          className="dm-wall"
          style={{ gridTemplateColumns: `repeat(${Math.ceil(wall.length / 2)}, 1fr)` }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {wall.map((d, i) => {
            const open = i === current;
            const spec = es ? d.specialty : d.specialtyEn;
            return (
              <button
                key={d.photo + i}
                type="button"
                className={`dm-tile${open ? " is-open" : ""}`}
                style={{ gridRow: `span ${WALL_SPANS[i]}`, backgroundImage: `url(${d.photo})` }}
                onMouseEnter={() => setActive(i)}
                onFocus={() => {
                  setActive(i);
                  setPaused(true);
                }}
                onBlur={() => setPaused(false)}
                onClick={() => setActive(i)}
                aria-label={`${d.name || spec}. ${langs(d.languages)}`}
              >
                <span className="dm-tag">{spec}</span>
                <span className="dm-info" aria-hidden={!open}>
                  <span className="dm-info-spec">{spec.toUpperCase()}</span>
                  <b>{d.name || spec}</b>
                  <span>
                    ✓ {es ? "Certificado" : "Certified"} · {langs(d.languages)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {showAll && (
        <ul className="dm-list">
          {PARTNER_DOCTORS.map((d, i) => (
            <li key={d.photo + i}>
              <span style={{ backgroundImage: `url(${d.photo})` }} aria-hidden="true" />
              <span>
                <small>{(es ? d.specialty : d.specialtyEn).toUpperCase()}</small>
                <b>{d.name || (es ? d.specialty : d.specialtyEn)}</b>
                <em>{langs(d.languages)}</em>
              </span>
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .dm {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100svh;
          /* Tighter hand-off from "Quién te atiende": 5% of the screen less gap. */
          margin-top: -5svh;
          overflow: hidden;
          background: var(--negro-suave);
        }
        /* Design board D3 at its 1440 px; its height follows the screen (--bh). */
        .dm-board {
          --h: var(--bh, 900px);
          display: grid;
          grid-template-columns: 420px minmax(0, 1fr);
          gap: 60px;
          flex-shrink: 0;
          box-sizing: border-box;
          width: 1440px;
          height: var(--h);
          padding: max(88px, calc(var(--h) * 0.1)) 120px calc(var(--h) * 0.05);
          color: #101a18;
          font-family: "Manrope", var(--font-sans);
        }
        .dm-copy {
          display: flex;
          flex-direction: column;
          gap: calc(var(--h) * 0.022);
          min-height: 0;
        }
        .dm-kicker {
          color: #b0703c;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }
        .dm-copy h2 {
          margin: 0;
          color: #101a18;
          -webkit-text-fill-color: currentColor;
          background: none;
          font-family: "Manrope", var(--font-sans);
          font-size: calc(var(--h) * 0.064);
          font-weight: 300;
          line-height: 1.02;
          letter-spacing: -0.05em;
        }
        .dm-copy h2 strong {
          color: #0a4a42;
          font-weight: 700;
        }
        .dm-copy p {
          margin: 0;
          color: #2a3432;
          font-size: max(17px, calc(var(--h) * 0.022));
          line-height: 1.5;
        }
        .dm-count {
          margin: 4px 0 0;
          padding: 0;
          list-style: none;
        }
        .dm-count li {
          display: flex;
          justify-content: space-between;
          padding: calc(var(--h) * 0.013) 0;
          border-top: 1px solid rgba(16, 26, 24, 0.1);
          font-size: 16px;
        }
        .dm-count b {
          color: #0a4a42;
        }
        .dm-copy .dm-net {
          margin-top: auto;
          color: #515856;
          font-family: "Manrope", var(--font-sans);
          font-size: 14px;
          line-height: 1.5;
        }
        .dm-net b {
          color: #0a4a42;
        }
        .dm-all {
          align-self: flex-start;
          padding: 14px 22px;
          border: 0;
          border-radius: 999px;
          background: #0a4a42;
          color: #fff;
          font: 800 15px "Manrope", var(--font-sans);
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .dm-all:hover {
          background: #0d5c52;
          transform: translateY(-2px);
        }
        .dm-wall {
          display: grid;
          grid-template-rows: repeat(5, 1fr);
          grid-auto-flow: column;
          gap: 14px;
          min-height: 0;
        }
        .dm-tile {
          position: relative;
          overflow: hidden;
          padding: 0;
          border: 0;
          border-radius: 20px;
          background-color: #ece5d9;
          background-position: center 20%;
          background-size: cover;
          cursor: pointer;
          text-align: left;
          font-family: "Manrope", var(--font-sans);
          transition: box-shadow 0.35s ease, transform 0.35s ease;
        }
        .dm-tile.is-open {
          box-shadow: 0 0 0 3px #0a4a42;
        }
        .dm-tile:focus-visible {
          outline: 3px solid #b0703c;
          outline-offset: 3px;
        }
        .dm-tag {
          position: absolute;
          left: 10px;
          bottom: 10px;
          padding: 5px 10px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
          color: #0a4a42;
          font-size: 11px;
          font-weight: 800;
          transition: opacity 0.3s ease;
        }
        .dm-info {
          position: absolute;
          inset: auto 0 0 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 40px 16px 16px;
          background: linear-gradient(transparent, rgba(8, 30, 27, 0.85));
          color: #fff;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .dm-info-spec {
          color: #f3c89b;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }
        .dm-info b {
          font-size: 19px;
        }
        .dm-info span:last-child {
          font-size: 12px;
          opacity: 0.85;
        }
        .dm-tile.is-open .dm-info {
          opacity: 1;
          transform: none;
        }
        .dm-tile.is-open .dm-tag {
          opacity: 0;
        }
        .dm-list {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          box-sizing: border-box;
          width: min(1200px, 100%);
          margin: 0 auto 80px;
          padding: 0 20px;
          list-style: none;
        }
        .dm-list li {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          border-radius: 18px;
          background: #fff;
        }
        .dm-list li > span:first-child {
          flex-shrink: 0;
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background-position: center 20%;
          background-size: cover;
        }
        .dm-list li > span:last-child {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .dm-list small {
          color: #b0703c;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }
        .dm-list em {
          color: #515856;
          font-size: 12px;
          font-style: normal;
        }
        @media (prefers-reduced-motion: reduce) {
          .dm-info,
          .dm-tag,
          .dm-tile {
            transition: none;
          }
        }
        @media (max-width: 900px) {
          .dm {
            min-height: 0;
            margin-top: 0;
          }
          .dm-board {
            --h: 760px;
            grid-template-columns: 1fr;
            gap: 32px;
            width: 100%;
            height: auto;
            padding: 3.5rem 1.25rem;
          }
          .dm-copy h2 {
            font-size: 2.3rem;
          }
          .dm-all {
            margin-top: 8px;
          }
          .dm-wall {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-template-rows: none;
            grid-auto-flow: row;
            grid-auto-rows: 210px;
            gap: 10px;
          }
          .dm-tile {
            grid-row: auto !important;
          }
          .dm-info {
            padding: 32px 12px 12px;
          }
          .dm-info b {
            font-size: 16px;
          }
          .dm-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

/* The page's closing (design board K3, "horizonte"): a full-bleed evening
   photo, one line and two doors, WhatsApp or the quote form. */
const CLOSING_PHOTO = img("1563138216-8ff2e182ccbd").replace("w=1200", "w=2000");

function ClosingSection({ es }: { es: boolean }) {
  const boardRef = useFitBoard<HTMLDivElement>({ minH: 600, maxH: 900 });
  return (
    <section className="hz" aria-labelledby="hz-title">
      <div className="hz-board" ref={boardRef}>
        <div className="hz-photo" style={{ backgroundImage: `url(${CLOSING_PHOTO})` }}>
          <div className="hz-content">
            <div className="hz-copy">
              <span className="hz-kicker">{es ? "TU VIAJE EMPIEZA AQUÍ" : "YOUR TRIP STARTS HERE"}</span>
              <h2 id="hz-title">
                {es ? "Imagínalo." : "Imagine it."} <strong>{es ? "Nosotros nos encargamos del resto." : "We'll take care of the rest."}</strong>
              </h2>
            </div>
            <div className="hz-doors">
              <a
                href={waHref(es ? "Hola, quiero información sobre mi viaje con Bridge Care." : "Hi, I'd like information about my trip with Bridge Care.")}
                target="_blank"
                rel="noopener noreferrer"
                className="hz-wa"
              >
                {es ? "Escríbenos por WhatsApp →" : "Message us on WhatsApp →"}
              </a>
              <Link href="/contacto" className="hz-quote">
                {es ? "Cotiza tu viaje" : "Get a quote"}
              </Link>
            </div>
          </div>
        </div>
        <div className="hz-foot">
          <span>{es ? "Te responde una persona del equipo, en tu idioma." : "A person from our team replies, in your language."}</span>
          <span>{es ? "Sin compromiso · Cotización por escrito antes de viajar" : "No commitment · Written quote before you travel"}</span>
        </div>
      </div>

      <style jsx>{`
        .hz {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100svh;
          overflow: hidden;
          background: var(--negro-suave);
        }
        /* Design board K3 at its 1440 px; its height follows the screen (--bh). */
        .hz-board {
          --h: var(--bh, 900px);
          display: flex;
          flex-direction: column;
          gap: calc(var(--h) * 0.024);
          flex-shrink: 0;
          box-sizing: border-box;
          width: 1440px;
          height: var(--h);
          padding: max(88px, calc(var(--h) * 0.107)) 120px calc(var(--h) * 0.067);
          font-family: "Manrope", var(--font-sans);
        }
        .hz-photo {
          position: relative;
          display: flex;
          align-items: flex-end;
          flex-grow: 1;
          min-height: 0;
          overflow: hidden;
          border-radius: 34px;
          background-position: center;
          background-size: cover;
        }
        .hz-photo::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(8, 30, 27, 0) 30%, rgba(8, 30, 27, 0.78) 100%);
        }
        .hz-content {
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
          width: 100%;
          box-sizing: border-box;
          padding: calc(var(--h) * 0.062) 60px;
          color: #fff;
        }
        .hz-copy {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 700px;
        }
        .hz-kicker {
          color: #f3c89b;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }
        .hz-copy h2 {
          margin: 0;
          color: #fff;
          -webkit-text-fill-color: currentColor;
          background: none;
          font-family: "Manrope", var(--font-sans);
          font-size: calc(var(--h) * 0.073);
          font-weight: 300;
          line-height: 1;
          letter-spacing: -0.05em;
        }
        .hz-copy h2 strong {
          font-weight: 700;
        }
        .hz-doors {
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex-shrink: 0;
        }
        .hz-doors :global(a) {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 17px 26px;
          border-radius: 999px;
          font-size: 16px;
          font-weight: 800;
          text-decoration: none;
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .hz-doors :global(a:hover) {
          transform: translateY(-2px);
        }
        .hz-doors :global(.hz-wa) {
          background: #fff;
          color: #0a4a42;
        }
        .hz-doors :global(.hz-quote) {
          background: rgba(255, 255, 255, 0.14);
          box-shadow: inset 0 0 0 1.5px rgba(255, 255, 255, 0.5);
          color: #fff;
          backdrop-filter: blur(6px);
        }
        .hz-doors :global(.hz-quote:hover) {
          background: rgba(255, 255, 255, 0.24);
        }
        .hz-foot {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          color: #515856;
          font-size: 14px;
        }
        @media (max-width: 900px) {
          .hz {
            min-height: 0;
          }
          .hz-board {
            --h: 700px;
            width: 100%;
            height: auto;
            padding: 3.5rem 1.25rem;
          }
          .hz-photo {
            min-height: 520px;
            border-radius: 26px;
          }
          .hz-content {
            flex-direction: column;
            align-items: stretch;
            gap: 24px;
            padding: 28px 22px;
          }
          .hz-copy h2 {
            font-size: 2.4rem;
          }
          .hz-foot {
            flex-direction: column;
            gap: 6px;
          }
        }
      `}</style>
    </section>
  );
}

function BridgePromise({ es }: { es: boolean }) {
  const [a, setA] = useState(0);
  const boardRef = useFitBoard<HTMLDivElement>({ minH: 620, maxH: 900 });
  const p = PROMISES[a];
  return (
    <section className="bp" aria-labelledby="bp-title">
      <div className="bp-board" ref={boardRef}>
        <div className="bp-head">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Bridge Care" width={92} height={44} />
          <span id="bp-title">{es ? "PROMESA BRIDGE · CINCO COMPROMISOS FIRMADOS" : "THE BRIDGE PROMISE · FIVE SIGNED COMMITMENTS"}</span>
        </div>

        <div className="bp-copy" key={a} aria-live="polite">
          <span className="bp-num">{String(a + 1).padStart(2, "0")}</span>
          <h2>{es ? p.t : p.tEn}</h2>
          <p className={serif.className}>{es ? p.x : p.xEn}</p>
        </div>

        <div className="bp-photo">
          {PROMISES.map((q, i) => (
            <span
              key={q.img}
              className={`bp-img${i === a ? " is-on" : ""}`}
              style={{ backgroundImage: `url(${q.img})` }}
              aria-hidden="true"
            />
          ))}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="bp-mark" src="/isotipo.svg" alt="" aria-hidden="true" />
        </div>

        <div className="bp-tabs" role="tablist" aria-label={es ? "Compromisos" : "Commitments"}>
          {PROMISES.map((q, i) => (
            <button
              key={q.s}
              type="button"
              role="tab"
              aria-selected={i === a}
              className={i === a ? "is-on" : undefined}
              onClick={() => setA(i)}
              onMouseEnter={() => setA(i)}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              {es ? q.s : q.sEn}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .bp {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100svh;
          overflow: hidden;
          background: var(--negro-suave);
        }
        /* Desktop: design board P3's own pixels, zoomed as one piece. */
        /* Its height (--bh) comes from the screen's proportions (see
           useFitBoard); type, photo width and spacing follow it. */
        .bp-board {
          --h: var(--bh, 820px);
          display: grid;
          grid-template-columns: minmax(0, 1fr) calc(var(--h) * 0.63);
          grid-template-rows: auto 1fr auto;
          column-gap: 70px;
          row-gap: calc(var(--h) * 0.032);
          flex-shrink: 0;
          box-sizing: border-box;
          width: 1440px;
          height: var(--h);
          padding: max(88px, calc(var(--h) * 0.117)) 120px calc(var(--h) * 0.054);
          color: #101a18;
          font-family: "Manrope", var(--font-sans);
        }
        .bp-head {
          grid-column: 1 / -1;
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .bp-head img {
          height: 40px;
          width: auto;
        }
        .bp-head span {
          padding-left: 18px;
          border-left: 1px solid rgba(14, 92, 90, 0.25);
          color: #0a4a42;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }
        .bp-copy {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: calc(var(--h) * 0.027);
          animation: bp-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .bp-num {
          color: #b0703c;
          font-size: calc(var(--h) * 0.18);
          font-weight: 200;
          line-height: 0.8;
          letter-spacing: -0.07em;
        }
        .bp-copy h2 {
          margin: 0;
          color: #101a18;
          -webkit-text-fill-color: currentColor;
          background: none;
          font-family: "Manrope", var(--font-sans);
          font-size: calc(var(--h) * 0.08);
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.055em;
        }
        .bp-copy p {
          max-width: 620px;
          margin: 0;
          color: #2a3432;
          font-size: max(17px, calc(var(--h) * 0.027));
          line-height: 1.55;
        }
        .bp-photo {
          position: relative;
          grid-row: 2 / 4;
          grid-column: 2;
          overflow: hidden;
          border-radius: 30px;
          background: #d8d0c3;
        }
        .bp-img {
          position: absolute;
          inset: 0;
          background-position: center;
          background-size: cover;
          opacity: 0;
          transform: scale(1.12);
          transition:
            opacity 0.7s ease,
            transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .bp-img.is-on {
          opacity: 1;
          transform: scale(1.06);
        }
        .bp-mark {
          position: absolute;
          top: 22px;
          right: 22px;
          width: 64px;
          height: auto;
          filter: brightness(0) invert(1) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.35));
        }
        .bp-tabs {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 14px;
        }
        .bp-tabs button {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 12px 0 0;
          border: 0;
          border-top: 3px solid rgba(16, 26, 24, 0.12);
          background: none;
          color: #8a918f;
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.25;
          text-align: left;
          cursor: pointer;
          transition:
            border-color 0.3s ease,
            color 0.3s ease;
        }
        .bp-tabs button span {
          font-size: 12px;
          font-weight: 800;
        }
        .bp-tabs button.is-on {
          border-top-color: #0a4a42;
          color: #101a18;
        }
        .bp-tabs button:focus-visible {
          outline: 2px solid #1d7a6e;
          outline-offset: 3px;
        }
        @keyframes bp-in {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @media (max-width: 900px) {
          .bp {
            min-height: 0;
          }
          .bp-board {
            grid-template-columns: 1fr;
            grid-template-rows: none;
            width: 100%;
            height: auto;
            padding: 3.5rem 1.25rem;
          }
          .bp-photo {
            grid-row: auto;
            grid-column: auto;
            height: 300px;
            order: 3;
          }
          .bp-tabs {
            order: 2;
            display: flex;
            overflow-x: auto;
          }
          .bp-tabs button {
            flex: 0 0 42%;
          }
          .bp-num {
            font-size: 96px;
          }
          .bp-copy h2 {
            font-size: 2.4rem;
          }
          .bp-copy p {
            font-size: 1.1rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .bp-copy {
            animation: none;
          }
          .bp-img,
          .bp-img.is-on {
            transform: none;
            transition: opacity 0.2s ease;
          }
        }
      `}</style>
    </section>
  );
}

export default function Nosotros() {
  const { language } = useLanguage();
  const es = language === "es";
  const boardRef = useFitBoard<HTMLDivElement>({ minH: 600, maxH: 900, fitContent: true });

  return (
    <div className="ns">
      <section className="ns-why" aria-labelledby="ns-why-title">
        <div className="ns-board" ref={boardRef}>
          <figure className="ns-photo">
            <span className="ns-img" style={{ backgroundImage: `url(${PHOTO})` }} aria-hidden="true" />
            <span className="ns-shade" aria-hidden="true" />
            <figcaption>
              {es ? "Lejos de casa, con algo que llevas años imaginando." : "Far from home, with something you've imagined for years."}
            </figcaption>
            <span className="ns-bridge">
              <strong>BRIDGE = {es ? "PUENTE" : "A BRIDGE"}</strong>
              <span>{es ? "Entre lo que imaginas y quien te acompaña." : "Between what you imagine and who's by your side."}</span>
            </span>
          </figure>

          <div className="ns-copy">
            <span className="ns-kicker">{es ? "POR QUÉ EXISTIMOS" : "WHY WE EXIST"}</span>
            <h1 id="ns-why-title">
              {es ? "Nadie debería cruzar este puente" : "No one should cross this bridge"}{" "}
              <strong>{es ? "sin alguien al lado." : "without someone by their side."}</strong>
            </h1>
            {(es ? STORY.es : STORY.en).map((p) => (
              <p key={p} className={serif.className}>
                {p}
              </p>
            ))}
            {FOUNDER_NAME && (
              <span className="ns-sign">
                <span className={hand.className}>{FOUNDER_NAME}</span>
                <small>
                  {FOUNDER_NAME} · {es ? FOUNDER_ROLE : FOUNDER_ROLE_EN}
                </small>
              </span>
            )}
          </div>
        </div>
      </section>

      <BridgePromise es={es} />

      <TeamSection es={es} />
      <DoctorsSection es={es} />
      <ClosingSection es={es} />

      <style jsx>{`
        .ns-why {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100svh;
          overflow: hidden;
          background: linear-gradient(180deg, #fbf3e8 0%, #faf6f0 70%);
        }
        /* Desktop: design board N5's own pixels, zoomed as one piece. */
        .ns-board {
          display: grid;
          grid-template-columns: 450px minmax(0, 1fr);
          gap: 86px;
          align-items: center;
          flex-shrink: 0;
          box-sizing: border-box;
          width: 1440px;
          padding: 112px 120px calc(56px * var(--fit, 1));
          color: #101a18;
          font-family: "Manrope", var(--font-sans);
        }
        .ns-photo {
          position: relative;
          height: calc(620px * var(--fit, 1));
          margin: 0;
          border-radius: 30px;
          box-shadow: 0 40px 80px -50px rgba(120, 70, 30, 0.55);
        }
        .ns-img,
        .ns-shade {
          position: absolute;
          inset: 0;
          border-radius: 30px;
        }
        .ns-img {
          background-position: 72% center;
          background-size: cover;
        }
        .ns-shade {
          background: linear-gradient(0deg, rgba(40, 20, 5, 0.35), rgba(40, 20, 5, 0) 45%);
        }
        .ns-photo figcaption {
          position: absolute;
          left: 20px;
          bottom: 18px;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          opacity: 0.9;
        }
        .ns-bridge {
          position: absolute;
          right: -26px;
          bottom: 60px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-width: 280px;
          padding: 14px 18px;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 24px 50px -30px rgba(10, 40, 36, 0.5);
        }
        .ns-bridge strong {
          color: #1d7a6e;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }
        .ns-bridge span {
          color: #2a3432;
          font-size: 14px;
        }
        .ns-copy {
          display: flex;
          flex-direction: column;
          gap: calc(22px * var(--fit, 1));
        }
        .ns-kicker {
          color: #b0703c;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }
        .ns-copy h1 {
          margin: 0;
          color: #101a18;
          -webkit-text-fill-color: currentColor;
          background: none;
          font-family: "Manrope", var(--font-sans);
          font-size: calc(60px * var(--fit, 1));
          font-weight: 300;
          line-height: 1.03;
          letter-spacing: -0.05em;
        }
        .ns-copy h1 strong {
          color: #0a4a42;
          font-weight: 700;
        }
        .ns-copy p {
          margin: 0;
          color: #2a3432;
          font-size: max(16px, calc(21px * var(--fit, 1)));
          line-height: 1.65;
        }
        .ns-sign {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-top: 6px;
        }
        .ns-sign > span {
          color: #0a4a42;
          font-size: 44px;
          line-height: 1;
        }
        .ns-sign small {
          color: #8a918f;
          font-size: 13px;
        }

        @media (max-width: 900px) {
          .ns-why {
            min-height: 0;
          }
          .ns-board {
            grid-template-columns: 1fr;
            gap: 2rem;
            width: 100%;
            padding: 6.5rem 1.25rem 3.5rem;
          }
          .ns-photo {
            height: 60svh;
            max-height: 520px;
          }
          .ns-bridge {
            right: 12px;
            bottom: 52px;
          }
          .ns-copy h1 {
            font-size: 2.4rem;
          }
          .ns-copy p {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}
