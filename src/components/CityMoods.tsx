"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Destination } from "@/lib/db";
import { AGENT_NAME, waHref } from "@/lib/contact";

/* "What do you feel like today?", design boards V2 + E4. A full-screen film
   of the city: pick a mood on the left, the city behind changes and three
   plans (morning, afternoon, night) appear; tapping one opens it as a travel
   magazine spread. Desktop draws the board at its real 1440 x 900 and zooms
   it to the screen as one piece, exactly like the design canvas. Only
   Medellín has its guide so far; other cities render nothing until then. */

const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1800`;

type Pace = "calm" | "moderate" | "active";
type Plan = {
  n: string; nEn?: string;
  c: string; cEn: string;
  d: string; dEn: string;
  t: string;
  dur: string; durEn: string;
  pace: Pace;
  img: string;
  doEs: string[]; doEn: string[];
};

const PACE: Record<Pace, { es: string; en: string; color: string }> = {
  calm: { es: "Tranquilo", en: "Easy", color: "#5dcaa5" },
  moderate: { es: "Moderado", en: "Moderate", color: "#e0a23a" },
  active: { es: "Activo", en: "Active", color: "#e07a4f" },
};

const PLANS: Record<string, Plan> = {
  guatape: {
    n: "Guatapé y El Peñol", nEn: "Guatapé and El Peñol Rock", c: "Naturaleza", cEn: "Nature",
    d: "Zócalos de colores y 740 escalones con vista al embalse.", dEn: "Colourful façades and 740 steps above the reservoir.",
    t: "2 h", dur: "Día completo", durEn: "Full day", pace: "active", img: img("1598028060898-c117093edfcb"),
    doEs: ["Subir los 740 escalones de la Piedra del Peñol", "Caminar las calles de zócalos de colores", "Almorzar frente al embalse"],
    doEn: ["Climb the 740 steps of El Peñol Rock", "Walk the streets of painted façades", "Lunch by the reservoir"],
  },
  embalse: {
    n: "Paseo en barco por el embalse", nEn: "Boat ride on the reservoir", c: "Naturaleza", cEn: "Nature",
    d: "Las islas del embalse de Guatapé, sentado y sin esfuerzo.", dEn: "The islands of the Guatapé reservoir, seated and effortless.",
    t: "2 h", dur: "Medio día", durEn: "Half day", pace: "calm", img: img("1611148261486-4e315d904232"),
    doEs: ["Recorrido en barco entre las islas", "Ver la Piedra del Peñol desde el agua", "Sin caminatas ni escaleras"],
    doEn: ["A boat ride between the islands", "See El Peñol Rock from the water", "No hiking, no stairs"],
  },
  arvi: {
    n: "Parque Arví", nEn: "Arví Park", c: "Naturaleza", cEn: "Nature",
    d: "Bosque a 2.500 m al que se sube en Metrocable sobre la ciudad.", dEn: "A forest at 2,500 m, reached by cable car over the city.",
    t: "1 h", dur: "Medio día", durEn: "Half day", pace: "moderate", img: img("1715503234327-b57d32e5da0f"),
    doEs: ["Subir en Metrocable por encima de la ciudad", "Senderos entre bosque de montaña", "Mercado campesino los fines de semana"],
    doEn: ["Ride the Metrocable above the city", "Trails through mountain forest", "Farmers' market at weekends"],
  },
  botero: {
    n: "Plaza Botero", nEn: "Botero Plaza", c: "Cultura", cEn: "Culture",
    d: "23 esculturas de Botero frente al Palacio de la Cultura.", dEn: "23 Botero sculptures facing the Palace of Culture.",
    t: "25 min", dur: "2 – 3 h", durEn: "2 – 3 h", pace: "calm", img: img("1672263120758-2c2c02eaf977"),
    doEs: ["23 esculturas de Botero al aire libre", "El Museo de Antioquia, con obras del maestro", "El Palacio de la Cultura, a un costado"],
    doEn: ["23 open-air Botero sculptures", "The Museo de Antioquia, with the master's work", "The Palace of Culture, right beside it"],
  },
  c13: {
    n: "Comuna 13", c: "Cultura", cEn: "Culture",
    d: "Escaleras eléctricas, grafitis y hip hop: la ciudad que se transformó.", dEn: "Outdoor escalators, street art and hip hop: a city transformed.",
    t: "30 min", dur: "3 h", durEn: "3 h", pace: "moderate", img: img("1693669029454-ab14dd80faaa"),
    doEs: ["Escaleras eléctricas al aire libre", "Recorrido guiado entre grafitis", "Música y baile en la calle"],
    doEn: ["Open-air escalators", "A guided street-art walk", "Music and dancing in the street"],
  },
  murales: {
    n: "Murales de la ciudad", nEn: "The city's murals", c: "Cultura", cEn: "Culture",
    d: "Arte urbano en fachadas enteras, a pie o en carro.", dEn: "Street art across whole façades, on foot or by car.",
    t: "20 min", dur: "1 – 2 h", durEn: "1 – 2 h", pace: "calm", img: img("1715503234322-4edf36c85cf1"),
    doEs: ["Fachadas enteras de arte urbano", "Se puede recorrer en carro", "Ideal para fotos"],
    doEn: ["Whole façades of street art", "Can be seen by car", "Made for photos"],
  },
  cafe: {
    n: "Ruta del café", nEn: "Coffee route", c: "Café", cEn: "Coffee",
    d: "Una finca en las afueras: de la cereza a la taza, con cata.", dEn: "A farm outside the city: from cherry to cup, with a tasting.",
    t: "1 h 30", dur: "Medio día", durEn: "Half day", pace: "moderate", img: img("1672851612794-6687bf0bf1a3"),
    doEs: ["Caminar entre los cultivos", "Ver el proceso de la cereza a la taza", "Cata de café de origen"],
    doEn: ["Walk through the plantation", "See the process from cherry to cup", "A single-origin coffee tasting"],
  },
  provenza: {
    n: "Cenar en Provenza", nEn: "Dinner in Provenza", c: "Sabores", cEn: "Flavours",
    d: "Calles arboladas con restaurantes de autor y cocina paisa.", dEn: "Tree-lined streets with chef-led restaurants and local cooking.",
    t: "5 min", dur: "2 – 3 h", durEn: "2 – 3 h", pace: "calm", img: img("1676081986290-ac79c2968c3f"),
    doEs: ["Restaurantes de autor y cocina paisa", "Cafés de especialidad", "Tiendas de diseño local"],
    doEn: ["Chef-led restaurants and local cooking", "Speciality coffee shops", "Local design stores"],
  },
  rooftop: {
    n: "Rooftops de El Poblado", nEn: "El Poblado rooftops", c: "Noche", cEn: "Night",
    d: "La ciudad iluminada desde una terraza, con cócteles de autor.", dEn: "The city lit up from a terrace, with signature cocktails.",
    t: "5 min", dur: "2 h", durEn: "2 h", pace: "calm", img: img("1573047330199-9a915400744f"),
    doEs: ["El valle iluminado desde lo alto", "Coctelería de autor", "Ambiente tranquilo, sin multitudes"],
    doEn: ["The valley lit up from above", "Signature cocktails", "Relaxed, no crowds"],
  },
  laureles: {
    n: "Terrazas de Laureles", nEn: "Laureles terraces", c: "Noche", cEn: "Night",
    d: "El barrio de la salsa y las noches al aire libre.", dEn: "The neighbourhood of salsa and open-air nights.",
    t: "20 min", dur: "3 h", durEn: "3 h", pace: "moderate", img: img("1563138216-8ff2e182ccbd"),
    doEs: ["Terrazas y bares al aire libre", "Noches de salsa", "El ambiente más local de la ciudad"],
    doEn: ["Open-air terraces and bars", "Salsa nights", "The most local feel in town"],
  },
  poblado: {
    n: "El Poblado de noche", nEn: "El Poblado by night", c: "Noche", cEn: "Night",
    d: "Restaurantes, bares y la ciudad encendida en el valle.", dEn: "Restaurants, bars and the city glowing in the valley.",
    t: "0 min", dur: "A tu ritmo", durEn: "At your pace", pace: "calm", img: img("1512250431446-d0b4b57b27ec"),
    doEs: ["Restaurantes y bares a pie", "El Parque Lleras y sus alrededores", "A pasos de tu hotel"],
    doEn: ["Restaurants and bars on foot", "Parque Lleras and around", "Steps from your hotel"],
  },
  spa: {
    n: "Spa y bienestar", nEn: "Spa and wellness", c: "Bienestar", cEn: "Wellness",
    d: "Masajes y rituales en los hoteles del barrio, sin moverte.", dEn: "Massages and rituals in the neighbourhood's hotels, no travel.",
    t: "0 min", dur: "1 – 2 h", durEn: "1 – 2 h", pace: "calm", img: img("1600334089648-b0d9d3028eb2"),
    doEs: ["Masajes relajantes", "Rituales y circuitos de agua", "Sin salir del barrio"],
    doEn: ["Relaxing massages", "Rituals and water circuits", "Without leaving the neighbourhood"],
  },
  tesoro: {
    n: "El Tesoro y Oviedo", nEn: "El Tesoro and Oviedo", c: "Compras", cEn: "Shopping",
    d: "Centros comerciales, marcas internacionales y diseño local.", dEn: "Malls, international brands and local design.",
    t: "10 min", dur: "2 – 3 h", durEn: "2 – 3 h", pace: "calm", img: img("1701278773098-9cfd25e8cde3"),
    doEs: ["Marcas internacionales", "Diseño colombiano", "Restaurantes y cine"],
    doEn: ["International brands", "Colombian design", "Restaurants and cinema"],
  },
};

// Each mood: three plans ordered morning, afternoon, night.
const MOODS = [
  { n: "Calma", nEn: "Calm", line: "Para bajar el ritmo.", lineEn: "To slow right down.", ks: ["embalse", "spa", "provenza"] },
  { n: "Sabores", nEn: "Flavours", line: "Para comer como un paisa.", lineEn: "To eat like a local.", ks: ["cafe", "provenza", "rooftop"] },
  { n: "Cultura", nEn: "Culture", line: "Para entender la ciudad.", lineEn: "To understand the city.", ks: ["botero", "c13", "laureles"] },
  { n: "Naturaleza", nEn: "Nature", line: "Para respirar montaña.", lineEn: "To breathe mountain air.", ks: ["guatape", "arvi", "poblado"] },
  { n: "Noche", nEn: "Night", line: "Para ver la ciudad encendida.", lineEn: "To see the city lit up.", ks: ["provenza", "laureles", "rooftop"] },
  { n: "Compras", nEn: "Shopping", line: "Para volver con maleta extra.", lineEn: "To fly home with an extra bag.", ks: ["tesoro", "murales", "provenza"] },
];
const WHEN = [
  ["Mañana", "Morning"],
  ["Tarde", "Afternoon"],
  ["Noche", "Night"],
];
const PLAN_KEYS = Object.keys(PLANS);

export default function CityMoods({ destination, es }: { destination: Destination; es: boolean }) {
  const [m, setM] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Desktop: laid out for the screen first, like useFitBoard: both layers
  // (the film and the spread) span the screen's width and take its height
  // (--bh, 640-900 board px), so type and photos fit a short screen instead
  // of the whole board shrinking. Before paint, so an opening spread never
  // flashes at full size.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const desktop = window.matchMedia("(min-width: 901px)");
    const fit = () => {
      // clientWidth: the page's width without the scrollbar.
      const kW = document.documentElement.clientWidth / 1440;
      const bh = Math.max(640, Math.min(900, window.innerHeight / kW));
      const k = Math.min(kW, window.innerHeight / bh);
      root.querySelectorAll<HTMLElement>("[data-cm-board]").forEach((el) => {
        el.style.zoom = desktop.matches ? String(k) : "";
        if (desktop.matches) el.style.setProperty("--bh", `${bh}px`);
        else el.style.removeProperty("--bh");
      });
    };
    fit();
    window.addEventListener("resize", fit);
    desktop.addEventListener("change", fit);
    return () => {
      window.removeEventListener("resize", fit);
      desktop.removeEventListener("change", fit);
    };
  }, [open]);

  // While a spread is open: Escape closes it, the page does not scroll
  // behind it, and focus goes to its close button.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (destination.id !== "medellin") return null;

  const mood = MOODS[m];
  const L = (p: Plan) => (es ? p.n : p.nEn || p.n);
  const plan = open ? PLANS[open] : null;
  const wi = open ? Math.max(0, mood.ks.indexOf(open)) : 0;
  const pace = plan ? PACE[plan.pace] : null;
  const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

  return (
    <section ref={rootRef} className="cm" data-header-dark aria-labelledby="cm-title">
      {MOODS.map((x, i) => (
        <span
          key={x.n}
          className={`cm-bg${i === m ? " is-on" : ""}`}
          style={{ backgroundImage: `url(${PLANS[x.ks[1]].img})` }}
          aria-hidden="true"
        />
      ))}
      <span className="cm-shade-x" aria-hidden="true" />
      <span className="cm-shade-y" aria-hidden="true" />

      <div className="cm-stage">
        <div className="cm-board" data-cm-board>
          <div className="cm-moods">
            <h2 id="cm-title">{es ? "Hoy en Medellín me apetece…" : "Today in Medellín I feel like…"}</h2>
            <div className="cm-mood-list" role="tablist" aria-label={es ? "Elige un plan" : "Pick a mood"}>
              {MOODS.map((x, i) => (
                <button
                  key={x.n}
                  type="button"
                  role="tab"
                  aria-selected={i === m}
                  className={`cm-mood${i === m ? " is-on" : ""}`}
                  onClick={() => setM(i)}
                  onMouseEnter={() => !open && setM(i)}
                >
                  <span className="cm-bar" aria-hidden="true" />
                  {es ? x.n : x.nEn}.
                </button>
              ))}
            </div>
          </div>

          <div className="cm-plans" key={m}>
            <p className="cm-line">{es ? mood.line : mood.lineEn}</p>
            <div className="cm-cards">
              {mood.ks.map((k, i) => {
                const p = PLANS[k];
                return (
                  <button
                    key={k}
                    type="button"
                    className="cm-card"
                    style={{ animationDelay: `${i * 100}ms` }}
                    onClick={() => setOpen(k)}
                    aria-haspopup="dialog"
                  >
                    <span className="cm-thumb" style={{ backgroundImage: `url(${p.img})` }} aria-hidden="true" />
                    <span className="cm-when">{WHEN[i][es ? 0 : 1]}</span>
                    <span className="cm-name">{L(p)}</span>
                    <span className="cm-meta">
                      <span>
                        <span className="cm-dot" style={{ background: PACE[p.pace].color }} aria-hidden="true" />
                        {PACE[p.pace][es ? "es" : "en"]} · {p.t}
                      </span>
                      <span className="cm-plus" aria-hidden="true">+</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="cm-note">
            {es
              ? "Para tu acompañante desde el primer día, y para ti cuando tu médico lo autorice."
              : "For your companion from day one, and for you once your doctor says so."}
          </p>
        </div>
      </div>

      {plan && pace && open && (
        <>
          <div className="cm-dim" onClick={() => setOpen(null)} aria-hidden="true" />
          <div className="cm-stage cm-stage-top">
            <div className="cm-board cm-board-spread" data-cm-board>
              <div className="cm-spread-wrap" role="dialog" aria-modal="true" aria-label={L(plan)} key={open}>
                <div className="cm-spread">
                  <div className="cm-left">
                    <span className="cm-left-img" style={{ backgroundImage: `url(${plan.img})` }} aria-hidden="true" />
                    <span className="cm-gutter" aria-hidden="true" />
                    <span className="cm-caption">{L(plan)} · Antioquia</span>
                  </div>
                  <div className="cm-page">
                    <span className="cm-page-shadow" aria-hidden="true" />
                    <span className="cm-folio">
                      <span>{es ? "MEDELLÍN · GUÍA BRIDGE CARE" : "MEDELLÍN · BRIDGE CARE GUIDE"}</span>
                      <span className="cm-folio-cat">{(es ? plan.c : plan.cEn).toUpperCase()}</span>
                    </span>
                    <h3 className="cm-title">{L(plan)}</h3>
                    <p className="cm-dek">
                      {es
                        ? `Ideal en la ${WHEN[wi][0].toLowerCase()}, a ${plan.t} de tu hotel.`
                        : `Best in the ${WHEN[wi][1].toLowerCase()}, ${plan.t} from your hotel.`}
                    </p>
                    <p className="cm-body">
                      {es
                        ? `${plan.d} Un plan de ritmo ${pace.es.toLowerCase()}, pensado para disfrutar sin prisa: ${lower(plan.dur)}.`
                        : `${plan.dEn} An ${pace.en.toLowerCase()}-paced plan, made to enjoy without hurry: ${lower(plan.durEn)}.`}
                    </p>
                    <ol className="cm-list">
                      {(es ? plan.doEs : plan.doEn).map((x, i) => (
                        <li key={x}>
                          <span>{String(i + 1).padStart(2, "0")}</span>
                          {x}
                        </li>
                      ))}
                    </ol>
                    <span className="cm-page-foot">
                      <span>
                        {es
                          ? "Para tu acompañante, y para ti cuando tu médico lo autorice."
                          : "For your companion, and for you once your doctor says so."}
                      </span>
                      <span className="cm-pno">{String(PLAN_KEYS.indexOf(open) + 1).padStart(2, "0")}</span>
                    </span>
                  </div>
                  <button ref={closeRef} type="button" className="cm-close" onClick={() => setOpen(null)} aria-label={es ? "Cerrar" : "Close"}>
                    ×
                  </button>
                </div>
                <div className="cm-foot">
                  <div className="cm-sibs">
                    <span>{es ? "Sigue leyendo" : "Keep reading"}</span>
                    {mood.ks
                      .filter((k) => k !== open)
                      .map((k) => (
                        <button key={k} type="button" className="cm-sib" onClick={() => setOpen(k)}>
                          <span className="cm-sib-img" style={{ backgroundImage: `url(${PLANS[k].img})` }} aria-hidden="true" />
                          {L(PLANS[k])}
                        </button>
                      ))}
                  </div>
                  <a
                    className="cm-cta"
                    href={waHref(
                      es
                        ? `Hola ${AGENT_NAME}, me gustaría saber más sobre este plan en Medellín: ${plan.n}.`
                        : `Hi ${AGENT_NAME}, I'd like to know more about this plan in Medellín: ${L(plan)}.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {es ? `Pregúntale a ${AGENT_NAME} →` : `Ask ${AGENT_NAME} →`}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .cm {
          position: relative;
          height: 100svh;
          min-height: 560px;
          overflow: hidden;
          background: #101a18;
          color: #ffffff;
        }
        .cm-bg {
          position: absolute;
          inset: 0;
          background-position: center;
          background-size: cover;
          opacity: 0;
          transform: scale(1.02);
          transition:
            opacity 0.9s ease,
            transform 8s ease-out;
        }
        .cm-bg.is-on {
          opacity: 1;
          transform: scale(1.1);
        }
        .cm-shade-x,
        .cm-shade-y {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .cm-shade-x {
          background: linear-gradient(90deg, rgba(6, 18, 16, 0.82) 0%, rgba(6, 18, 16, 0.45) 45%, rgba(6, 18, 16, 0.1) 100%);
        }
        .cm-shade-y {
          background: linear-gradient(0deg, rgba(6, 18, 16, 0.7) 0%, rgba(6, 18, 16, 0) 40%);
        }

        /* Desktop: design board V2's own pixels, zoomed as one piece. */
        .cm-stage {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          pointer-events: none;
        }
        .cm-stage-top {
          z-index: 3;
        }
        .cm-board {
          position: relative;
          width: 1440px;
          height: var(--bh, 900px);
          flex-shrink: 0;
          pointer-events: auto;
        }
        .cm-board-spread {
          pointer-events: none;
        }
        .cm-moods {
          position: absolute;
          left: 120px;
          top: calc(var(--bh, 900px) * 0.133);
          display: flex;
          flex-direction: column;
          gap: 22px;
        }
        .cm-moods h2 {
          margin: 0;
          color: #ffffff;
          -webkit-text-fill-color: currentColor;
          background: none;
          font-family: "Manrope", var(--font-sans);
          font-size: 22px;
          font-weight: 300;
          letter-spacing: 0;
          opacity: 0.85;
        }
        .cm-mood-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          align-items: flex-start;
        }
        .cm-mood {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 0;
          border: 0;
          background: none;
          color: #ffffff;
          font-family: "Manrope", var(--font-sans);
          font-size: calc(var(--bh, 900px) * 0.071);
          font-weight: 300;
          line-height: 1.08;
          letter-spacing: -0.05em;
          text-align: left;
          cursor: pointer;
          opacity: 0.38;
          transition:
            opacity 0.35s ease,
            transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .cm-mood.is-on {
          font-weight: 700;
          opacity: 1;
          transform: translateX(14px);
        }
        .cm-mood:focus-visible {
          outline: 2px solid #5dcaa5;
          outline-offset: 4px;
        }
        .cm-bar {
          display: block;
          width: 0;
          height: 3px;
          border-radius: 2px;
          background: #5dcaa5;
          transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .cm-mood.is-on .cm-bar {
          width: 56px;
        }

        .cm-plans {
          position: absolute;
          right: 120px;
          bottom: calc(var(--bh, 900px) * 0.071);
          width: 640px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .cm-line {
          margin: 0;
          font-size: 26px;
          font-weight: 300;
          letter-spacing: -0.02em;
          animation: cm-fade 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .cm-cards {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }
        .cm-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 10px 10px 14px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.12);
          -webkit-backdrop-filter: blur(18px);
          backdrop-filter: blur(18px);
          color: #ffffff;
          font-family: "Manrope", var(--font-sans);
          text-align: left;
          cursor: pointer;
          animation: cm-fade 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
          transition:
            transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
            background 0.3s ease;
        }
        .cm-card:hover {
          transform: translateY(-6px);
          background: rgba(255, 255, 255, 0.2);
        }
        .cm-card:focus-visible {
          outline: 2px solid #5dcaa5;
          outline-offset: 3px;
        }
        .cm-thumb {
          height: calc(var(--bh, 900px) * 0.133);
          border-radius: 16px;
          background-position: center;
          background-size: cover;
        }
        .cm-when {
          padding: 0 6px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          opacity: 0.75;
        }
        .cm-name {
          padding: 0 6px;
          font-size: 17px;
          font-weight: 700;
          line-height: 1.2;
        }
        .cm-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 6px;
        }
        .cm-meta > span:first-child {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          font-weight: 700;
          opacity: 0.85;
        }
        .cm-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }
        .cm-plus {
          display: flex;
          width: 28px;
          height: 28px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          font-size: 18px;
          transition: all 0.25s ease;
        }
        .cm-card:hover .cm-plus {
          background: #ffffff;
          color: #0a4a42;
        }
        .cm-note {
          position: absolute;
          left: 120px;
          bottom: calc(var(--bh, 900px) * 0.071);
          max-width: 360px;
          margin: 0;
          font-size: 14px;
          line-height: 1.5;
          opacity: 0.75;
        }

        /* The spread (board E4) */
        .cm-dim {
          position: absolute;
          inset: 0;
          z-index: 2;
          background: rgba(8, 18, 16, 0.74);
          -webkit-backdrop-filter: blur(8px);
          backdrop-filter: blur(8px);
          cursor: pointer;
          animation: cm-dim 0.4s ease both;
        }
        .cm-spread-wrap {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 1180px;
          margin: calc(var(--bh, 900px) * -0.389) 0 0 -590px;
          display: flex;
          flex-direction: column;
          gap: 22px;
          pointer-events: auto;
        }
        .cm-spread {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1fr;
          height: calc(var(--bh, 900px) * 0.689);
          box-shadow: 0 60px 110px -40px rgba(0, 0, 0, 0.75);
        }
        .cm-left {
          position: relative;
          overflow: hidden;
          border-radius: 8px 0 0 8px;
          background: #d8d0c3;
        }
        .cm-left-img {
          position: absolute;
          inset: 0;
          background-position: center;
          background-size: cover;
          animation: cm-kb 9s ease-out both;
        }
        .cm-gutter {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(0, 0, 0, 0) 85%, rgba(0, 0, 0, 0.28) 100%);
        }
        .cm-caption {
          position: absolute;
          left: 24px;
          bottom: 20px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          opacity: 0.9;
        }
        .cm-page {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: calc(var(--bh, 900px) * 0.018);
          padding: 40px 46px 30px;
          border-radius: 0 8px 8px 0;
          background: #fbf7ef;
          color: #101a18;
          transform-origin: left center;
          animation: cm-open 1s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .cm-page-shadow {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 40px;
          background: linear-gradient(90deg, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0));
          pointer-events: none;
        }
        .cm-folio {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.22em;
          color: #8a918f;
        }
        .cm-folio-cat {
          color: #1d7a6e;
        }
        .cm-title {
          margin: 0;
          color: #101a18;
          -webkit-text-fill-color: currentColor;
          background: none;
          font-family: "Manrope", var(--font-sans);
          font-size: calc(var(--bh, 900px) * 0.064);
          font-weight: 700;
          line-height: 0.95;
          letter-spacing: -0.055em;
        }
        .cm-dek {
          margin: 0;
          color: #2a3432;
          font-size: 19px;
          font-weight: 300;
          line-height: 1.45;
        }
        .cm-body {
          margin: 0;
          color: #515856;
          font-size: 16px;
          line-height: 1.6;
        }
        .cm-body::first-letter {
          float: left;
          padding: 6px 10px 0 0;
          color: #0a4a42;
          font-size: 74px;
          font-weight: 700;
          line-height: 0.8;
        }
        .cm-list {
          display: flex;
          flex-direction: column;
          margin: 4px 0 0;
          padding: 0;
          list-style: none;
          border-top: 2px solid #101a18;
        }
        .cm-list li {
          display: grid;
          grid-template-columns: 44px 1fr;
          padding: 11px 0;
          border-bottom: 1px solid rgba(16, 26, 24, 0.12);
          font-size: 16px;
          font-weight: 600;
        }
        .cm-list li span {
          color: #0a4a42;
          font-size: 22px;
          font-weight: 200;
          line-height: 1;
        }
        .cm-page-foot {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-top: auto;
          color: #8a918f;
          font-size: 12px;
        }
        .cm-pno {
          font-weight: 800;
        }
        .cm-close {
          position: absolute;
          top: -16px;
          right: -16px;
          z-index: 3;
          display: flex;
          width: 44px;
          height: 44px;
          padding: 0;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 50%;
          background: #ffffff;
          color: #101a18;
          font-size: 22px;
          cursor: pointer;
          box-shadow: 0 10px 24px -10px rgba(0, 0, 0, 0.5);
          transition: transform 0.3s ease;
        }
        .cm-close:hover {
          transform: rotate(90deg);
        }
        .cm-foot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          animation: cm-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.45s both;
        }
        .cm-sibs {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
        }
        .cm-sibs > span {
          font-size: 13px;
          font-weight: 700;
          opacity: 0.75;
        }
        .cm-sib {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 5px 14px 5px 5px;
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          font-family: "Manrope", var(--font-sans);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.25s ease;
        }
        .cm-sib:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .cm-sib-img {
          flex-shrink: 0;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background-position: center;
          background-size: cover;
        }
        .cm-foot :global(.cm-cta) {
          flex-shrink: 0;
          padding: 15px 26px;
          border-radius: 999px;
          background: #ffffff;
          color: #0a4a42;
          font-size: 15px;
          font-weight: 800;
          text-decoration: none;
        }

        @keyframes cm-fade {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes cm-rise {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @keyframes cm-dim {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes cm-open {
          from {
            transform: perspective(2000px) rotateY(-100deg);
          }
          to {
            transform: perspective(2000px) rotateY(0);
          }
        }
        @keyframes cm-kb {
          from {
            transform: scale(1.03);
          }
          to {
            transform: scale(1.12);
          }
        }

        /* Phones and tablets: the same pieces, stacked; the spread becomes a
           full-screen sheet that scrolls. */
        @media (max-width: 900px) {
          .cm {
            height: auto;
            min-height: 100svh;
          }
          .cm-stage {
            position: relative;
            display: block;
          }
          .cm-board {
            box-sizing: border-box;
            width: 100%;
            min-width: 0;
            height: auto;
            display: flex;
            flex-direction: column;
            gap: 2rem;
            padding: 6.5rem 1.25rem 2.5rem;
          }
          .cm-moods,
          .cm-plans,
          .cm-note {
            position: static;
            width: auto;
          }
          .cm-mood {
            font-size: 2.6rem;
          }
          .cm-mood.is-on {
            transform: translateX(8px);
          }
          .cm-mood.is-on .cm-bar {
            width: 32px;
          }
          .cm-cards {
            display: flex;
            gap: 10px;
            margin: 0 -1.25rem;
            padding: 0 1.25rem 4px;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
          }
          .cm-card {
            flex: 0 0 62%;
            scroll-snap-align: start;
          }
          .cm-line {
            font-size: 1.3rem;
          }

          .cm-dim {
            position: fixed;
            z-index: 2000;
          }
          .cm-stage-top {
            position: fixed;
            inset: 0;
            z-index: 2001;
            overflow-y: auto;
            overscroll-behavior: contain;
            pointer-events: auto;
          }
          .cm-board-spread {
            padding: 0;
          }
          .cm-spread-wrap {
            position: static;
            width: auto;
            margin: 0;
            gap: 1rem;
            padding: 1rem 1rem 2rem;
          }
          .cm-spread {
            grid-template-columns: 1fr;
            height: auto;
          }
          .cm-left {
            height: 38svh;
            border-radius: 16px 16px 0 0;
          }
          .cm-page {
            padding: 1.75rem 1.4rem 1.5rem;
            border-radius: 0 0 16px 16px;
            transform-origin: center top;
            animation-name: cm-fade;
          }
          .cm-title {
            font-size: 2.4rem;
          }
          .cm-dek {
            font-size: 1.05rem;
          }
          .cm-close {
            top: 12px;
            right: 12px;
          }
          .cm-foot {
            flex-direction: column;
            align-items: stretch;
          }
          .cm-foot :global(.cm-cta) {
            text-align: center;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cm-bg,
          .cm-bg.is-on {
            transform: none;
            transition: opacity 0.2s ease;
          }
          .cm-line,
          .cm-card,
          .cm-page,
          .cm-left-img,
          .cm-foot,
          .cm-dim {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
