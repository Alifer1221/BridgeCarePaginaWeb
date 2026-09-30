"use client";

import React, { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BeforeAfter, CityGuide, DoctorProfile as DoctorProfileData, Specialty, VideoStory } from "@/lib/db";
import { useDestinations, useSpecialties } from "@/lib/useStoredData";
import { useLanguage } from "@/context/LanguageContext";
import { ContactPillForm, useLeadForm } from "@/components/ContactCta";
import { AGENT_NAME, waHref } from "@/lib/contact";
import { useFitBoard } from "@/lib/useFitBoard";

interface SpecialtyDetailProps {
  /** `procedure` is set on /specialties/<slug>/<procedure>: the same page,
   *  focused on one procedure of the specialty. */
  params: Promise<{ slug: string; procedure?: string }>;
}

/* ============================================================================
   Icons — one drawn set, 24px box, 1.5 stroke, currentColor. Kept together so
   the weight never drifts between sections.
   ========================================================================== */

type IconName =
  | "calendar"
  | "layers"
  | "price"
  | "check"
  | "minus"
  | "sun"
  | "shield"
  | "arrow"
  | "quote"
  | "star"
  | "drag"
  | "plane"
  | "bed";

const ICON_PATHS: Record<IconName, React.ReactNode> = {
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  layers: <path d="M12 3 3 7.5l9 4.5 9-4.5L12 3ZM3 12.5 12 17l9-4.5M3 17.5 12 22l9-4.5" />,
  price: (
    <>
      <path d="M20.5 12.5 12.8 20.2a2 2 0 0 1-2.8 0l-6.2-6.2a2 2 0 0 1-.6-1.6l.4-5.6a2 2 0 0 1 1.9-1.9l5.6-.4a2 2 0 0 1 1.6.6l6.2 6.2a2 2 0 0 1 0 2.8Z" />
      <circle cx="8.5" cy="8.5" r="1.3" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5 10-11" />,
  minus: <path d="M5 12h14" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.5 4.5 5.8v6c0 4.6 3.1 8.5 7.5 9.7 4.4-1.2 7.5-5.1 7.5-9.7v-6L12 2.5Z" />
      <path d="m8.8 11.8 2.3 2.3 4.1-4.6" />
    </>
  ),
  arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
  quote: (
    <path d="M9.5 6C6.5 7.6 5 10.2 5 13.8V18h5.4v-5.4H7.9c0-2 .6-3.4 2.4-4.4L9.5 6Zm9 0c-3 1.6-4.5 4.2-4.5 7.8V18h5.4v-5.4h-2.5c0-2 .6-3.4 2.4-4.4L18.5 6Z" />
  ),
  star: (
    <path d="m12 2.8 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 2.8Z" />
  ),
  drag: <path d="M9 7 4.5 12 9 17m6-10 4.5 5-4.5 5" />,
  plane: <path d="M2.5 13.5 21 7l-2.5 5.5L9 16l-2 4.5-1.5-5-3-2Z" />,
  bed: (
    <>
      <path d="M3 18V8M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5" />
      <circle cx="7" cy="11" r="1.6" />
    </>
  ),
};

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const filled = name === "quote" || name === "star";
  return (
    <svg
      className="ic"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
      <style jsx>{`
        .ic {
          display: block;
          flex-shrink: 0;
        }
      `}</style>
    </svg>
  );
}

/** Rating rendered as drawn stars, with the value itself exposed to anyone who
 *  is not looking at the picture. */
function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="stars" role="img" aria-label={`${rating} / 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <i key={i} className={i < rating ? "on" : "off"}>
          <Icon name="star" size={size} />
        </i>
      ))}
      <style jsx>{`
        .stars {
          display: inline-flex;
          gap: 2px;
        }
        .stars i {
          display: flex;
        }
        .on {
          color: #c8891b;
        }
        .off {
          color: rgba(81, 88, 86, 0.28);
        }
      `}</style>
    </span>
  );
}

/**
 * Before/after comparison. The split is driven by a real range input rather
 * than pointer maths: that brings keyboard support, touch dragging and a
 * spoken value for free, and the visible handle is drawn on top of it.
 */
function BeforeAfterFigure({ item, es }: { item: BeforeAfter; es: boolean }) {
  const [pos, setPos] = useState(52);

  return (
    <figure className="ba">
      <div className="ba-frame" style={{ "--pos": `${pos}%` } as React.CSSProperties}>
        {/* Plain <img>: catalog photos are remote URLs and next.config.ts
            declares no images.remotePatterns. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ba-img" src={item.after} alt={es ? "Despues" : "After"} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ba-img ba-before" src={item.before} alt={es ? "Antes" : "Before"} />

        <span className="ba-tag ba-tag-before">{es ? "Antes" : "Before"}</span>
        <span className="ba-tag ba-tag-after">{es ? "Despues" : "After"}</span>

        <span className="ba-divider" aria-hidden="true">
          <span className="ba-knob">
            <Icon name="drag" size={16} />
          </span>
        </span>

        <input
          className="ba-range"
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={
            es
              ? `Comparar antes y despues: ${item.label}`
              : `Compare before and after: ${item.labelEn}`
          }
        />
      </div>

      <figcaption>
        <strong>{es ? item.label : item.labelEn}</strong>
        <span>{es ? item.note : item.noteEn}</span>
      </figcaption>

      <style jsx>{`
        .ba {
          margin: 0;
        }
        .ba-frame {
          position: relative;
          aspect-ratio: 4 / 3;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--verde-noche);
          box-shadow: 0 18px 44px rgba(10, 74, 66, 0.18);
          touch-action: pan-y;
        }
        .ba-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          user-select: none;
        }
        .ba-before {
          clip-path: inset(0 calc(100% - var(--pos)) 0 0);
        }
        .ba-tag {
          position: absolute;
          top: 0.85rem;
          padding: 0.3rem 0.7rem;
          border-radius: var(--radius-full);
          background: rgba(6, 40, 36, 0.74);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          color: #fff;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          pointer-events: none;
        }
        .ba-tag-before {
          left: 0.85rem;
        }
        .ba-tag-after {
          right: 0.85rem;
        }
        .ba-divider {
          position: absolute;
          top: 0;
          bottom: 0;
          left: var(--pos);
          width: 2px;
          margin-left: -1px;
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 0 12px rgba(6, 40, 36, 0.4);
          pointer-events: none;
        }
        .ba-knob {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--pure-white);
          color: var(--teal-dark);
          box-shadow: 0 6px 18px rgba(6, 40, 36, 0.35);
        }
        .ba-range {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          margin: 0;
          opacity: 0;
          cursor: ew-resize;
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
        }
        .ba-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 44px;
          height: 600px;
        }
        .ba-range::-moz-range-thumb {
          width: 44px;
          height: 600px;
          border: 0;
          background: transparent;
        }
        .ba-frame:has(.ba-range:focus-visible) {
          outline: 3px solid var(--teal-primary);
          outline-offset: 3px;
        }
        figcaption {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-top: 1.1rem;
        }
        figcaption strong {
          color: var(--teal-dark);
          font-size: 1.05rem;
          font-weight: 600;
          letter-spacing: -0.02em;
        }
        figcaption span {
          max-width: 46ch;
          color: var(--gris-texto);
          font-size: 0.92rem;
          line-height: 1.6;
        }
      `}</style>
    </figure>
  );
}

/* ============================================================================
   Motion
   ========================================================================== */

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Marks an element `data-in` the first time it enters the viewport, so CSS can
 * settle it into place. Reduced motion resolves it immediately — the content is
 * never gated behind an animation that will not run.
 */
function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      el.setAttribute("data-in", "");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-in", "");
            io.unobserve(entry.target);
          }
        }
      },
      // threshold 0, deliberately: a block taller than the viewport can never
      // show a given fraction of itself at once, and any higher threshold would
      // leave it stuck at opacity 0 forever.
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}

/**
 * Progress 0→1 tied to the scroll, both ways: scrolling down moves the stay
 * forward, scrolling up takes it back. On desktop it runs through the tall,
 * pinned section; on phones, where nothing is pinned, it runs while the
 * section crosses the screen. The value eases toward the scroll position so
 * it glides instead of jumping. Reduced motion: always 1.
 */
function useScrollProgress<T extends HTMLElement>() {
  const [progress, setProgress] = useState(0);
  // A callback ref, so the effect starts whenever the section actually
  // mounts — it may not exist on the first render while data loads.
  const [el, setEl] = useState<T | null>(null);

  useEffect(() => {
    if (!el) return;
    if (prefersReducedMotion()) {
      setProgress(1);
      return;
    }

    const desktop = window.matchMedia("(min-width: 901px)");
    const target = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (desktop.matches) {
        const span = r.height - vh;
        if (span <= 0) return 1;
        return Math.min(1, Math.max(0, -r.top / (span * 0.85)));
      }
      // Phones: measured on the day bar itself, not the section. The
      // section's heading and text come first, so tying it to the section
      // left the bar already half full by the time it scrolled into view.
      // Day 0 while the bar enters the bottom of the screen, day 15 once it
      // has risen to about a third of the way down.
      const bar = (el.querySelector("[data-stay-track]") as HTMLElement | null) ?? el;
      const b = bar.getBoundingClientRect();
      return Math.min(1, Math.max(0, (vh * 0.85 - b.top) / (vh * 0.5)));
    };

    let current = target();
    setProgress(current);
    let raf = 0;
    const tick = () => {
      const goal = target();
      const next = current + (goal - current) * 0.14;
      current = Math.abs(goal - next) < 0.001 ? goal : next;
      setProgress(current);
      raf = current === goal ? 0 : requestAnimationFrame(tick);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [el]);

  return [progress, setEl] as const;
}

/* ============================================================================
   The specialist as a signed letter, with the rest of the profile one tab
   away: their results, their training and where they operate. The letter is
   what everyone reads; the tabs are for whoever wants proof.
   ========================================================================== */

/** Stand-ins until the clinic sends real before/after pairs (same patient,
 *  same framing and light, written consent). They render as labelled empty
 *  frames, never as stock photos. */
const RESULT_PLACEHOLDERS: BeforeAfter[] = [1, 2, 3].map((n) => ({
  before: "",
  after: "",
  label: `Caso ${n}`,
  labelEn: `Case ${n}`,
  note: "Foto real pendiente",
  noteEn: "Real photo pending",
}));

function DoctorProfile({
  doctor,
  es,
  surgical,
  clinic,
  hospital,
  results,
}: {
  doctor: DoctorProfileData;
  es: boolean;
  surgical: boolean;
  clinic?: { name: string; city?: string; note: string };
  hospital?: string;
  results?: BeforeAfter[];
}) {
  const [tab, setTab] = useState(0);
  const [caseIdx, setCaseIdx] = useState(0);
  const [pos, setPos] = useState(50);
  const cases = results && results.length > 0 ? results : RESULT_PLACEHOLDERS;
  const current = cases[Math.min(caseIdx, cases.length - 1)];
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const creds = es ? doctor.credentials : doctor.credentialsEn;

  // Figures pulled out of the credentials so the strip under the letter
  // stays true to the data: "Más de 2.000 …" → 2.000+, "(SCCP)" → SCCP.
  const volume = creds
    .map((c) => c.match(/^(?:Más de|Over)\s+([\d.,]+)\s+(.+)$/i))
    .find(Boolean);
  const societies = creds.map((c) => c.match(/\(([A-Z]{2,})\)/)?.[1]).filter(Boolean) as string[];
  // `short`/`shortLabel`: the phone version, where the three sit side by
  // side and every figure has to be a plain number to fit.
  const facts = [
    {
      big: es ? `${doctor.yearsExperience} años` : `${doctor.yearsExperience} years`,
      label: es ? "de experiencia" : "of experience",
      short: String(doctor.yearsExperience),
      shortLabel: es ? "años de experiencia" : "years of experience",
    },
    volume && { big: `${volume[1]}+`, label: volume[2] },
    societies.length > 0 && {
      big: societies.join(" · "),
      label: es ? "sociedades que lo avalan" : "societies that back them",
      short: String(societies.length),
      shortLabel: es ? `sociedades: ${societies.join(" y ")}` : `societies: ${societies.join(" and ")}`,
    },
  ].filter(Boolean) as { big: string; label: string; short?: string; shortLabel?: string }[];

  const tabList = [
    { key: "letter", label: es ? "Su carta" : "Their letter" },
    { key: "results", label: es ? "Sus resultados" : "Their results" },
    { key: "training", label: es ? "Formación" : "Training" },
    ...(clinic ? [{ key: "clinic", label: es ? "Dónde opera" : "Where they work" }] : []),
  ];
  const tabs = tabList.map((t) => t.label);
  const active = tabList[tab]?.key;
  const resultsTab = 1;

  // Arrow keys move between tabs, as in any tab list.
  const onKey = (e: React.KeyboardEvent) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (tab + dir + tabs.length) % tabs.length;
    setTab(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="doc-grid">
      <div className="doc-main">
        <h2>
          {es
            ? surgical ? "Sabes quién te opera" : "Sabes quién te atiende"
            : surgical ? "You know who operates on you" : "You know who treats you"}{" "}
          <strong>{es ? "antes de reservar, no al llegar." : "before booking, not on arrival."}</strong>
        </h2>

        <div className="doc-card">
          <div className="doc-tabs" role="tablist" onKeyDown={onKey}>
            {tabs.map((label, i) => (
              <button
                key={label}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`doc-tab-${i}`}
                aria-selected={tab === i}
                aria-controls="doc-pane"
                tabIndex={tab === i ? 0 : -1}
                className={tab === i ? "is-on" : undefined}
                onClick={() => setTab(i)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="doc-pane" id="doc-pane" role="tabpanel" aria-labelledby={`doc-tab-${tab}`} key={tab}>
            {active === "letter" && (
              <div className="doc-letter">
                <p className="doc-quote">{es ? doctor.quote : doctor.quoteEn}</p>
                <div className="doc-sign">
                  {/* Placeholder signature: swap for the doctor's real one. */}
                  <svg className="doc-sig" width="200" height="64" viewBox="0 0 260 86" fill="none" aria-hidden="true">
                    <path d="M8 58c14-22 30-46 36-40 7 7-18 52-10 54 10 3 22-40 34-38 9 2-8 30 2 30 9 0 16-22 24-20 7 2 0 18 8 18 10 0 18-26 28-24 8 2-4 22 6 22 12 0 22-30 34-28 9 2 2 20 12 20 14 0 30-12 44-16" />
                  </svg>
                  <strong>{doctor.name}</strong>
                  <span>{es ? doctor.title : doctor.titleEn}</span>
                </div>
              </div>
            )}

            {active === "results" && (
              <div className="doc-results">
                <div className="doc-ba">
                  <div className="doc-ba-frame" style={{ "--pos": `${pos}%` } as React.CSSProperties}>
                    {current.after ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="doc-ba-img" src={current.after} alt={es ? "Después" : "After"} />
                    ) : (
                      <span className="doc-ba-img doc-ba-empty is-after">{es ? "Foto real · después" : "Real photo · after"}</span>
                    )}
                    {current.before ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="doc-ba-img doc-ba-before" src={current.before} alt={es ? "Antes" : "Before"} />
                    ) : (
                      <span className="doc-ba-img doc-ba-before doc-ba-empty">{es ? "Foto real · antes" : "Real photo · before"}</span>
                    )}
                    <span className="doc-ba-tag is-before">{es ? "Antes" : "Before"}</span>
                    <span className="doc-ba-tag is-after">{es ? "Después" : "After"}</span>
                    <span className="doc-ba-line" aria-hidden="true">
                      <span className="doc-ba-knob">
                        <Icon name="drag" size={16} />
                      </span>
                    </span>
                    <input
                      className="doc-ba-range"
                      type="range"
                      min={0}
                      max={100}
                      value={pos}
                      onChange={(e) => setPos(Number(e.target.value))}
                      aria-label={
                        es
                          ? `Comparar antes y después: ${current.label}`
                          : `Compare before and after: ${current.labelEn}`
                      }
                    />
                  </div>
                  <p className="doc-ba-note">
                    {es
                      ? `Pacientes ${doctor.name.startsWith("Dra") ? "de la" : "del"} ${doctor.name.split(" ")[0]} ${doctor.name.split(" ").slice(-1)[0]}, con su consentimiento. Mismo encuadre y misma luz.`
                      : `${doctor.name}'s patients, with their consent. Same framing, same light.`}
                  </p>
                </div>
                <ul className="doc-cases" aria-label={es ? "Casos" : "Cases"}>
                  {cases.map((c, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        className={i === caseIdx ? "is-on" : undefined}
                        aria-pressed={i === caseIdx}
                        onClick={() => {
                          setCaseIdx(i);
                          setPos(50);
                        }}
                      >
                        <strong>{es ? c.label : c.labelEn}</strong>
                        <span>{es ? c.note : c.noteEn}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {active === "training" && (
              <ul className="doc-rows">
                {creds.map((c) => {
                  const [head, sub] = c.split(/\s+—\s+/);
                  return (
                    <li key={c}>
                      <Icon name="check" size={18} />
                      <span>
                        <strong>{head}</strong>
                        {sub && <em>{sub}</em>}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}

            {clinic && active === "clinic" && (
              <div className="doc-clinic">
                <p className="doc-clinic-name">
                  {es ? "Opera en" : "Works at"} <strong>{clinic.name}</strong>
                  {clinic.city ? `, ${clinic.city}.` : "."}
                </p>
                <p>{clinic.note}</p>
                <div className="doc-clinic-facts">
                  <span>
                    <b>15 min</b>
                    {es ? "de tu hotel" : "from your hotel"}
                  </span>
                  {hospital && (
                    <span>
                      <b>{hospital}</b>
                      {es ? "en la clínica" : "in the clinic"}
                    </span>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

        {facts.length > 0 && (
          <dl className="doc-facts">
            {facts.map((f) => (
              <div key={f.big}>
                <dt>
                  <span className="is-long">{f.big}</span>
                  <span className="is-short">{f.short ?? f.big}</span>
                </dt>
                <dd>
                  <span className="is-long">{f.label}</span>
                  <span className="is-short">{f.shortLabel ?? f.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <figure className="doc-figure">
        <div className="doc-photo" style={{ backgroundImage: `url(${doctor.photo})` }} role="img" aria-label={doctor.name} />
        <button type="button" className="doc-badge" onClick={() => setTab(resultsTab)}>
          <span className="doc-badge-ic" aria-hidden="true">
            <Icon name="arrow" size={18} />
          </span>
          <span>
            <strong>{es ? "Mira sus resultados" : "See their results"}</strong>
            {es ? "Antes y después, casos reales" : "Before and after, real cases"}
          </span>
        </button>
      </figure>

      <style jsx>{`
        .doc-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 0.72fr);
          gap: clamp(2.5rem, 6vw, 5.5rem);
          align-items: center;
        }
        .doc-main {
          display: flex;
          flex-direction: column;
          gap: clamp(1.1rem, 2.6vh, 1.75rem);
          min-width: 0;
        }
        .doc-main h2 {
          margin: 0;
          color: var(--sp-muted);
          -webkit-text-fill-color: currentColor;
          background: none;
          font-family: "Manrope", var(--font-sans);
          font-size: clamp(1.15rem, 1.7vw, 1.4rem);
          font-weight: 400;
          letter-spacing: -0.01em;
          line-height: 1.35;
        }
        .doc-main h2 strong {
          color: #0a4a42;
          font-weight: 700;
        }

        .doc-card {
          border-radius: 20px;
          background: #fff;
          box-shadow: 0 40px 80px -48px rgba(10, 40, 36, 0.35);
        }
        .doc-tabs {
          display: flex;
          gap: clamp(1.1rem, 2.4vw, 2rem);
          padding: 0 clamp(1.25rem, 3.2vw, 3rem);
          border-bottom: 1px solid #ecece8;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .doc-tabs::-webkit-scrollbar {
          display: none;
        }
        .doc-tabs button {
          flex-shrink: 0;
          margin-bottom: -1px;
          padding: clamp(0.9rem, 2vh, 1.25rem) 0 clamp(0.75rem, 1.7vh, 1rem);
          border: 0;
          border-bottom: 2px solid transparent;
          background: none;
          color: var(--sp-muted);
          font-family: "Manrope", var(--font-sans);
          font-size: 0.95rem;
          font-weight: 500;
          white-space: nowrap;
          cursor: pointer;
          transition:
            color 0.2s ease,
            border-color 0.2s ease;
        }
        .doc-tabs button:hover {
          color: #0a4a42;
        }
        .doc-tabs button.is-on {
          border-bottom-color: #0a4a42;
          color: #0a4a42;
          font-weight: 700;
        }
        .doc-tabs button:focus-visible {
          outline: 2px solid #1d7a6e;
          outline-offset: 2px;
        }

        .doc-pane {
          display: flex;
          flex-direction: column;
          min-height: clamp(280px, 47vh, 430px);
          padding: clamp(1.5rem, 4vh, 2.5rem) clamp(1.25rem, 3.2vw, 3rem) clamp(1.4rem, 3.5vh, 2.25rem);
          font-family: "Manrope", var(--font-sans);
          animation: doc-pane 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes doc-pane {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        .doc-letter {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 1.5rem;
        }
        .doc-quote {
          margin: 0;
          color: #101a18;
          font-size: clamp(1.35rem, min(2.3vw, 3.7vh), 2.05rem);
          font-weight: 300;
          letter-spacing: -0.03em;
          line-height: 1.26;
          text-wrap: pretty;
        }
        .doc-sign {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          margin-top: auto;
        }
        .doc-sig {
          margin-bottom: 0.25rem;
          stroke: #0a4a42;
          stroke-width: 2.4;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .doc-sig path {
          stroke-dasharray: 900;
          animation: doc-sign 2.4s cubic-bezier(0.6, 0, 0.2, 1) 0.2s both;
        }
        @keyframes doc-sign {
          from {
            stroke-dashoffset: 900;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .doc-sign strong {
          color: #101a18;
          font-size: 1rem;
          font-weight: 700;
        }
        .doc-sign span {
          color: var(--sp-muted);
          font-size: 0.9rem;
        }

        .doc-rows {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .doc-rows li {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 0.9rem;
          align-items: start;
          padding: clamp(0.8rem, 1.9vh, 1.1rem) 0;
          border-top: 1px solid #ecece8;
        }
        .doc-rows li:first-child {
          padding-top: 0;
          border-top: 0;
        }
        .doc-rows li :global(.ic) {
          margin-top: 3px;
          color: var(--teal-primary);
        }
        .doc-rows strong {
          display: block;
          color: #101a18;
          font-size: 1.02rem;
          font-weight: 600;
          line-height: 1.4;
        }
        .doc-rows em {
          display: block;
          color: var(--sp-muted);
          font-size: 0.9rem;
          font-style: normal;
        }

        .doc-clinic {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 0.9rem;
        }
        .doc-clinic p {
          margin: 0;
          max-width: 46ch;
          color: var(--sp-muted);
          font-size: 1rem;
          line-height: 1.6;
        }
        .doc-clinic .doc-clinic-name {
          color: #101a18;
          font-size: clamp(1.4rem, 2.2vw, 1.8rem);
          font-weight: 300;
          letter-spacing: -0.03em;
          line-height: 1.2;
        }
        .doc-clinic-name strong {
          color: #0a4a42;
          font-weight: 700;
        }
        .doc-clinic-facts {
          display: flex;
          flex-wrap: wrap;
          gap: 1.25rem 2.5rem;
          margin-top: auto;
        }
        .doc-clinic-facts span {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          color: var(--sp-muted);
          font-size: 0.85rem;
        }
        .doc-clinic-facts b {
          color: #0a4a42;
          font-size: clamp(1.5rem, 2.2vw, 1.9rem);
          font-weight: 300;
          letter-spacing: -0.04em;
          line-height: 1;
        }

        .doc-results {
          display: grid;
          flex: 1;
          grid-template-columns: minmax(0, 1fr) minmax(150px, 0.34fr);
          gap: clamp(1rem, 2vw, 1.5rem);
        }
        .doc-ba {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          min-width: 0;
        }
        .doc-ba-frame {
          position: relative;
          flex: 1;
          min-height: 200px;
          overflow: hidden;
          border-radius: 14px;
          background: #e9e4dc;
          touch-action: pan-y;
        }
        .doc-ba-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .doc-ba-before {
          clip-path: inset(0 calc(100% - var(--pos)) 0 0);
        }
        .doc-ba-empty {
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #cfc6b8, #bfb4a3);
          color: #6f675c;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .doc-ba-empty.is-after {
          background: linear-gradient(135deg, #e6e0d6, #d9d1c4);
          color: #8a8176;
        }
        .doc-ba-tag {
          position: absolute;
          top: 0.75rem;
          padding: 0.3rem 0.65rem;
          border-radius: 999px;
          background: rgba(16, 26, 24, 0.6);
          color: #fff;
          font-size: 0.75rem;
          font-weight: 600;
          pointer-events: none;
        }
        .doc-ba-tag.is-before {
          left: 0.75rem;
        }
        .doc-ba-tag.is-after {
          right: 0.75rem;
        }
        .doc-ba-line {
          position: absolute;
          top: 0;
          bottom: 0;
          left: var(--pos);
          width: 2px;
          margin-left: -1px;
          background: #fff;
          pointer-events: none;
        }
        .doc-ba-knob {
          position: absolute;
          top: 50%;
          left: 50%;
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #fff;
          color: #0a4a42;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          transform: translate(-50%, -50%);
        }
        .doc-ba-range {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          margin: 0;
          opacity: 0;
          cursor: ew-resize;
        }
        .doc-ba-range:focus-visible + .doc-ba-line,
        .doc-ba-frame:focus-within {
          outline: 2px solid #1d7a6e;
          outline-offset: 2px;
        }
        .doc-ba-note {
          margin: 0;
          color: var(--sp-muted);
          font-size: 0.8rem;
          line-height: 1.45;
        }
        .doc-cases {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .doc-cases button {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          width: 100%;
          padding: 0.75rem 0.9rem;
          border: 1px solid #ecece8;
          border-radius: 12px;
          background: #fff;
          color: #101a18;
          font-family: inherit;
          text-align: left;
          cursor: pointer;
          transition:
            background-color 0.2s ease,
            border-color 0.2s ease;
        }
        .doc-cases button:hover {
          border-color: #b9d6cd;
        }
        .doc-cases button.is-on {
          border-color: #1d7a6e;
          background: #eef7f3;
        }
        .doc-cases button:focus-visible {
          outline: 2px solid #1d7a6e;
          outline-offset: 2px;
        }
        .doc-cases strong {
          font-size: 0.92rem;
          font-weight: 700;
        }
        .doc-cases span {
          color: var(--sp-muted);
          font-size: 0.8rem;
        }

        .doc-facts {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem clamp(1.75rem, 3.5vw, 3rem);
          margin: 0;
        }
        .doc-facts div {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .doc-facts dt {
          color: #0a4a42;
          font-family: "Manrope", var(--font-sans);
          font-size: clamp(1.5rem, min(2.4vw, 4vh), 2.1rem);
          font-weight: 300;
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .doc-facts dd {
          margin: 0;
          color: var(--sp-muted);
          font-size: 0.88rem;
        }
        .doc-facts .is-short {
          display: none;
        }

        .doc-figure {
          position: relative;
          margin: 0;
        }
        .doc-photo {
          height: min(78vh, 700px);
          border-radius: 24px;
          background-position: center 22%;
          background-size: cover;
        }
        .doc-badge {
          position: absolute;
          left: clamp(-2.25rem, -2.5vw, -1rem);
          bottom: clamp(1.5rem, 5vh, 2.5rem);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1.1rem;
          border: 0;
          border-radius: 16px;
          background: #fff;
          color: var(--sp-muted);
          font-family: "Manrope", var(--font-sans);
          font-size: 0.8rem;
          text-align: left;
          cursor: pointer;
          box-shadow: 0 24px 48px -20px rgba(10, 40, 36, 0.35);
          transition: transform 0.25s ease;
        }
        .doc-badge:hover {
          transform: translateY(-2px);
        }
        .doc-badge:focus-visible {
          outline: 2px solid #1d7a6e;
          outline-offset: 3px;
        }
        .doc-badge strong {
          display: block;
          color: #101a18;
          font-size: 0.9rem;
          font-weight: 700;
        }
        .doc-badge-ic {
          display: grid;
          flex-shrink: 0;
          place-items: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #e6f4ee;
          color: #0a4a42;
        }

        @media (max-width: 1024px) {
          .doc-grid {
            grid-template-columns: 1fr;
          }
          .doc-figure {
            order: -1;
            width: 100%;
          }
          /* Full width, landscape crop on the face: a full portrait filled
             the whole phone screen. The width drives the height, so it never
             shrinks sideways and leaves a gap. */
          .doc-photo {
            width: 100%;
            height: auto;
            aspect-ratio: 4 / 3.9; /* 4:3 plus 30% of height */
            background-position: center 18%;
          }
          .doc-badge {
            left: 1rem;
          }
          /* Phones: the three figures side by side as plain numbers, split
             by hairlines, instead of a tall stack of big type. */
          .doc-facts {
            display: grid;
            grid-auto-columns: minmax(0, 1fr);
            grid-auto-flow: column;
            gap: 0;
            padding-top: 1.1rem;
            border-top: 1px solid var(--sp-rule);
          }
          .doc-facts div {
            gap: 0.4rem;
            padding: 0 0.85rem;
          }
          .doc-facts div:first-child {
            padding-left: 0;
          }
          .doc-facts div + div {
            border-left: 1px solid var(--sp-rule);
          }
          .doc-facts dt {
            font-size: 2rem;
            font-variant-numeric: tabular-nums;
          }
          .doc-facts dd {
            font-size: 0.76rem;
            line-height: 1.35;
          }
          .doc-facts .is-long {
            display: none;
          }
          .doc-facts .is-short {
            display: inline;
          }
          .doc-results {
            grid-template-columns: 1fr;
          }
          .doc-ba-frame {
            min-height: 0;
            aspect-ratio: 4 / 3;
          }
          .doc-cases {
            flex-direction: row;
            overflow-x: auto;
          }
          .doc-cases li {
            flex: 1 0 8.5rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .doc-pane,
          .doc-sig path {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

/* ============================================================================
   Patient stories as short vertical videos. They come from the specialist's
   own patients (with written consent), not from "people who travelled with
   us", so the section never claims a track record the agency doesn't have.
   Without videos yet, the frames stay empty and say so.
   ========================================================================== */

/** A patient's written comment: folds to six lines with "Leer todo" when long. */
function StoryComment({ text, es }: { text: string; es: boolean }) {
  const [open, setOpen] = useState(false);
  const long = text.length > 320;
  return (
    <>
      <blockquote className={`sc-text${long && !open ? " is-folded" : ""}`}>&ldquo;{text}&rdquo;</blockquote>
      {long && (
        <button type="button" className="sc-more" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? (es ? "Leer menos" : "Show less") : es ? "Leer todo" : "Read all"}
        </button>
      )}
      <style jsx>{`
        .sc-text.is-folded {
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 6;
        }
        .sc-more {
          align-self: flex-start;
          padding: 0;
          border: 0;
          background: none;
          color: #0a4a42;
          font: inherit;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
        }
        .sc-more:focus-visible {
          outline: 2px solid #1d7a6e;
          outline-offset: 3px;
        }
      `}</style>
    </>
  );
}

function PatientStories({
  stories,
  es,
  doctorName,
  procedure,
}: {
  stories: VideoStory[];
  es: boolean;
  doctorName?: string;
  procedure: { es: string; en: string };
}) {
  const items: VideoStory[] =
    stories.length > 0
      ? stories
      : [1, 2, 3].map(() => ({ procedure: procedure.es, procedureEn: procedure.en }));
  const who = doctorName
    ? (() => {
        const parts = doctorName.split(" ");
        const title = parts[0];
        const last = parts[parts.length - 1];
        return es ? `${title.startsWith("Dra") ? "de la" : "del"} ${title} ${last}` : `${title} ${last}'s`;
      })()
    : "";

  return (
    <div className="ps-grid">
      <div className="ps-copy">
        <h2>
          {es ? "Escúchalo" : "Hear it"}{" "}
          <strong>
            {doctorName
              ? es ? `de los pacientes ${who}.` : `from ${who} patients.`
              : es ? "de sus pacientes." : "from the patients."}
          </strong>
        </h2>
        <p>
          {es
            ? "Sin guion: cómo fue su cirugía y su recuperación, en video o en fotos, compartido por ellos con su permiso."
            : "Unscripted: their surgery and recovery, on video or in photos, shared by them with consent."}
        </p>
      </div>

      <ul className="ps-rail">
        {items.map((st, i) => (
          <li key={i} className="ps-card">
            <div className="ps-frame">
              {st.video ? (
                <video
                  className="ps-video"
                  src={st.video}
                  poster={st.poster}
                  controls
                  playsInline
                  preload="none"
                  aria-label={
                    es
                      ? `Testimonio en video${st.name ? ` de ${st.name}` : ""}: ${st.procedure}`
                      : `Video story${st.name ? ` from ${st.name}` : ""}: ${st.procedureEn}`
                  }
                />
              ) : st.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="ps-video"
                  src={st.image}
                  alt={
                    es
                      ? `${st.name ? `${st.name}, ` : ""}paciente de ${st.procedure}`
                      : `${st.name ? `${st.name}, ` : ""}${st.procedureEn} patient`
                  }
                  loading="lazy"
                />
              ) : (
                // Empty frames alternate video / photo, so the layout shows
                // that both kinds fit.
                <>
                  <span className="ps-empty">
                    {i % 2 === 1
                      ? es ? "Foto real del paciente" : "Real patient photo"
                      : es ? "Video real del paciente" : "Real patient video"}
                  </span>
                  <span className="ps-play" aria-hidden="true">
                    {i % 2 === 1 ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
                        <circle cx="9" cy="10" r="1.6" />
                        <path d="M20.5 16l-5-5-8 8" />
                      </svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5.5v13l11-6.5z" />
                      </svg>
                    )}
                  </span>
                </>
              )}
              {st.video && st.duration && <span className="ps-time">{st.duration}</span>}
              {!st.video && st.image && (
                <span className="ps-time">{es ? "Foto" : "Photo"}</span>
              )}
            </div>
            {/* The patient's words, written out under their photo or video. */}
            <figure className="ps-comment">
              {st.quote ? (
                <StoryComment text={es ? st.quote : st.quoteEn || st.quote} es={es} />
              ) : (
                <blockquote className="is-pending">
                  {es
                    ? "Aquí va, escrito, lo que cuenta el paciente en su video o sobre su foto: por qué eligió operarse, cómo vivió la recuperación y cómo se siente hoy con el resultado."
                    : "What the patient says in the video or about the photo goes here, written out: why they chose surgery, how it went, how recovery felt and how they feel about the result today. There is room for a full paragraph, in their own words."}
                </blockquote>
              )}
              <figcaption>
                {st.name && <strong>{st.name} · </strong>}
                {es ? st.procedure : st.procedureEn}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .ps-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.34fr) minmax(0, 1fr);
          gap: clamp(2.5rem, 5vw, 4.5rem);
          align-items: center;
        }
        .ps-copy {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .ps-copy h2 {
          margin: 0;
          color: #101a18;
          -webkit-text-fill-color: currentColor;
          background: none;
          font-family: "Manrope", var(--font-sans);
          font-size: clamp(2rem, min(3.4vw, 6vh), 3.1rem);
          font-weight: 300;
          letter-spacing: -0.04em;
          line-height: 1.05;
          text-wrap: balance;
        }
        .ps-copy h2 strong {
          color: #0a4a42;
          font-weight: 700;
        }
        .ps-copy p {
          max-width: 34ch;
          margin: 0;
          color: var(--sp-muted);
          font-size: clamp(1rem, 1.2vw, 1.08rem);
          line-height: 1.6;
        }
        .ps-rail {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(1rem, 1.6vw, 1.5rem);
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .ps-card {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          min-width: 0;
        }
        .ps-frame {
          position: relative;
          aspect-ratio: 4 / 5;
          max-height: 46vh;
          overflow: hidden;
          border-radius: 22px;
          background: linear-gradient(160deg, #d9cfc0, #b8ab97);
        }
        .ps-card:nth-child(2) .ps-frame {
          background: linear-gradient(160deg, #cfd9d2, #a9bdb2);
        }
        .ps-card:nth-child(3) .ps-frame {
          background: linear-gradient(160deg, #ddd2c6, #c2b2a0);
        }
        .ps-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          background: #101a18;
        }
        .ps-empty {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          padding-bottom: 5.5rem;
          color: rgba(255, 255, 255, 0.78);
          font-size: 0.82rem;
          font-weight: 600;
          text-align: center;
        }
        .ps-play {
          position: absolute;
          top: 50%;
          left: 50%;
          display: grid;
          place-items: center;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          color: #0a4a42;
          transform: translate(-50%, -20%);
        }
        .ps-time {
          position: absolute;
          top: 0.85rem;
          left: 0.85rem;
          padding: 0.3rem 0.6rem;
          border-radius: 999px;
          background: rgba(16, 26, 24, 0.55);
          color: #fff;
          font-size: 0.75rem;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          pointer-events: none;
        }
        .ps-comment {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 0.7rem;
          min-height: 16rem; /* 20% under the previous 320px */
          margin: 0;
          padding: 1rem 1.15rem 0.95rem;
          border-radius: 16px;
          background: #fff;
          box-shadow: 0 14px 30px -24px rgba(10, 40, 36, 0.35);
        }
        .ps-comment :global(blockquote) {
          margin: 0;
          color: #101a18;
          font-size: 0.95rem;
          line-height: 1.55;
        }
        .ps-comment :global(blockquote.is-pending) {
          color: var(--sp-muted);
          font-style: italic;
        }
        .ps-comment figcaption {
          margin-top: auto;
          padding-top: 0.7rem;
          border-top: 1px solid #ecece8;
          color: var(--sp-muted);
          font-size: 0.82rem;
        }
        .ps-comment figcaption strong {
          color: #101a18;
          font-weight: 700;
        }

        @media (max-width: 900px) {
          .ps-grid {
            grid-template-columns: 1fr;
            gap: 1.75rem;
          }
          /* Phones: the videos become a swipeable row, like stories. */
          .ps-rail {
            display: flex;
            gap: 0.9rem;
            margin-inline: calc(-1 * var(--sp-gutter, 1.25rem));
            padding-inline: var(--sp-gutter, 1.25rem);
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scroll-padding-inline: var(--sp-gutter, 1.25rem);
            scrollbar-width: none;
          }
          .ps-rail::-webkit-scrollbar {
            display: none;
          }
          .ps-card {
            flex: 0 0 68%;
            scroll-snap-align: start;
          }
          .ps-frame {
            max-height: none;
          }
          .ps-card {
            flex-basis: 78%;
          }
        }
      `}</style>
    </div>
  );
}

/* ============================================================================
   The close as a boarding pass (design board AH). The form on the left fills
   the pass on the right as the reader types; sending it stamps the pass.
   The pass has a life of its own: it lands on screen when the section comes
   into view, a small plane flies the route TU -> city on a loop, it tilts
   toward the pointer, and the name flips in letter by letter.
   Desktop draws the board at its real 1440 x 900 and zooms it to the screen,
   like the city stories, so it matches the design board exactly.
   ========================================================================== */

const CITY_CODES: Record<string, string> = {
  Medellín: "MDE",
  Cali: "CLO",
  Cartagena: "CTG",
  Bogotá: "BOG",
};

// Also closes the destination pages, fed by their "build your trip" picker.
export function ClosingPass({
  es,
  city,
  procedure,
  stay,
  doctor,
  price,
  source,
}: {
  es: boolean;
  city: string;
  procedure: string;
  stay?: string;
  doctor?: string;
  price?: string;
  source: string;
}) {
  const { form, status, handleChange, handleSubmit } = useLeadForm(source);
  const [sentName, setSentName] = useState("");
  const [landed, setLanded] = useState(false);
  const boardRef = useFitBoard<HTMLDivElement>({ minH: 600, maxH: 900, fitContent: true });
  const passRef = useRef<HTMLDivElement>(null);
  const code = CITY_CODES[city] || city.slice(0, 3).toUpperCase();
  const name = status === "sent" ? sentName : form.name;
  const priceNum = price?.replace(/\s*USD\s*$/i, "");

  // Desktop: laid out for the screen first (see useFitBoard), not shrunk.

  // The pass lands the first time the section is on screen.
  useEffect(() => {
    const el = passRef.current;
    if (!el) return;
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      setLanded(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLanded(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Tilt toward the pointer (mouse only, never with reduced motion).
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const el = passRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--tilt-x", `${(-y * 8).toFixed(2)}deg`);
    el.style.setProperty("--tilt-y", `${(x * 10).toFixed(2)}deg`);
  };
  const onLeave = () => {
    passRef.current?.style.setProperty("--tilt-x", "0deg");
    passRef.current?.style.setProperty("--tilt-y", "0deg");
  };

  const onSubmit = (e: React.FormEvent) => {
    setSentName(form.name);
    handleSubmit(e);
  };

  const sent = status === "sent";

  return (
    <div className="cp-board" ref={boardRef}>
      <div className="cp-grid">
        <div className="cp-copy">
          <h2>
            {es ? `Tu pase a ${city}` : `Your pass to ${city}`}{" "}
            <strong>{es ? "empieza aquí." : "starts here."}</strong>
          </h2>
          <p>
            {es
              ? "Escribe tu nombre y tu correo. Laura te responde en menos de 24 horas con tu valoración virtual y tu plan por escrito."
              : "Type your name and email. Laura replies within 24 hours with your virtual assessment and a written plan."}
          </p>
          {sent ? (
            <p className="cp-sent" role="status">
              <strong>{es ? "¡Pase emitido!" : "Pass issued!"}</strong>{" "}
              {es
                ? "Laura te escribe a tu correo en menos de 24 horas hábiles."
                : "Laura will email you within 24 business hours."}
            </p>
          ) : (
            <form className="cp-form" onSubmit={onSubmit}>
              <label className="cp-field" htmlFor="cp-name">
                <span>{es ? "Tu nombre" : "Your name"}</span>
                <input
                  id="cp-name"
                  name="name"
                  type="text"
                  placeholder={es ? "Ej. María Gómez" : "e.g. Maria Gomez"}
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
              </label>
              <label className="cp-field" htmlFor="cp-email">
                <span>E-mail</span>
                <input
                  id="cp-email"
                  name="email"
                  type="email"
                  placeholder={es ? "tu@email.com" : "you@email.com"}
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </label>
              <button type="submit" className="cp-go" disabled={status === "sending"}>
                {status === "sending" ? (es ? "Emitiendo…" : "Issuing…") : es ? "Emitir mi plan" : "Issue my plan"}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="cp-error" role="alert">
              {es ? "No pudimos enviarlo. " : "We couldn't send it. "}
              <a
                href={waHref(es ? "Hola, intenté escribirles desde la página." : "Hi, I tried to reach you from the website.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                {es ? "Escríbenos por WhatsApp" : "Message us on WhatsApp"}
              </a>
              {es ? " o inténtalo de nuevo." : " or try again."}
            </p>
          )}
          <p className="cp-note">
            {es ? "Sin compromiso · también por " : "No commitment · also on "}
            <a href={waHref(es ? `Hola ${AGENT_NAME}, quiero mi plan.` : `Hi ${AGENT_NAME}, I'd like my plan.`)} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </p>
        </div>

        <div className="cp-stage" onPointerMove={onMove} onPointerLeave={onLeave}>
          <div
            ref={passRef}
            className={`cp-pass${landed ? " is-landed" : ""}${sent ? " is-sent" : ""}`}
            aria-label={es ? "Tu pase de tratamiento" : "Your treatment pass"}
          >
            <div className="cp-main">
              <div className="cp-top">
                <span className="cp-brand">Bridge Care</span>
                <span className="cp-kicker">{es ? "PASE DE TRATAMIENTO" : "TREATMENT PASS"}</span>
              </div>
              <div className="cp-route">
                <span className="cp-code">
                  <b>{es ? "TU" : "YOU"}</b>
                  <small>{es ? "Tu ciudad" : "Your city"}</small>
                </span>
                <span className="cp-path" aria-hidden="true">
                  <svg viewBox="0 0 120 24" fill="none">
                    <path className="cp-dash" d="M2 12h108" />
                    <path className="cp-arrow" d="M108 5l10 7-10 7" />
                  </svg>
                  <span className="cp-plane">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" transform="rotate(90 12 12)" />
                    </svg>
                  </span>
                </span>
                <span className="cp-code is-dest">
                  <b>{code}</b>
                  <small>{city}</small>
                </span>
              </div>
              <div className="cp-fields">
                <div>
                  <span>{es ? "PACIENTE" : "PATIENT"}</span>
                  <b className={`cp-name${name.trim() ? "" : " is-empty"}`} key={name.trim() ? "n" : "e"}>
                    {name.trim()
                      ? Array.from(name).map((ch, i) => (
                          <span key={i} className="cp-letter" style={{ animationDelay: `${Math.min(i, 20) * 12}ms` }}>
                            {ch === " " ? " " : ch}
                          </span>
                        ))
                      : es ? "Tu nombre" : "Your name"}
                  </b>
                </div>
                <div>
                  <span>{es ? "PROCEDIMIENTO" : "PROCEDURE"}</span>
                  <b>{procedure}</b>
                </div>
                {stay && (
                  <div>
                    <span>{es ? "ESTADÍA" : "STAY"}</span>
                    <b>{stay}</b>
                  </div>
                )}
                {doctor && (
                  <div>
                    <span>{es ? "CIRUJANO" : "SURGEON"}</span>
                    <b>{doctor}</b>
                  </div>
                )}
              </div>
            </div>
            {priceNum && (
              <div className="cp-stub">
                <span>{es ? "DESDE" : "FROM"}</span>
                <b>{priceNum}</b>
                <small>USD</small>
              </div>
            )}
            {sent && <span className="cp-stamp">{es ? "EMITIDO" : "ISSUED"}</span>}
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Desktop: design board AH's own pixels, zoomed as one piece. */
        .cp-board {
          box-sizing: border-box;
          width: 1440px;
          margin: 0 auto;
          padding: max(56px, calc(72px * var(--fit, 1))) 120px calc(64px * var(--fit, 1));
        }
        .cp-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
          gap: 80px;
          align-items: center;
        }
        .cp-copy {
          display: flex;
          flex-direction: column;
          gap: calc(22px * var(--fit, 1));
        }
        .cp-copy h2 {
          margin: 0;
          color: #101a18;
          -webkit-text-fill-color: currentColor;
          background: none;
          font-family: "Manrope", var(--font-sans);
          font-size: calc(56px * var(--fit, 1));
          font-weight: 300;
          letter-spacing: -0.045em;
          line-height: 1.04;
        }
        .cp-copy h2 strong {
          color: #0a4a42;
          font-weight: 700;
        }
        .cp-copy > p {
          max-width: 420px;
          margin: 0;
          color: #515856;
          font-size: 18px;
          line-height: 1.6;
        }
        .cp-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 6px;
        }
        .cp-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 12px 18px;
          border: 1px solid #e3ddd3;
          border-radius: 16px;
          background: #fff;
          transition: border-color 0.2s ease;
        }
        .cp-field:focus-within {
          border-color: #1d7a6e;
        }
        .cp-field span {
          color: #101a18;
          font-size: 12px;
          font-weight: 700;
        }
        .cp-field input {
          padding: 0;
          border: 0;
          outline: none;
          background: transparent;
          color: #101a18;
          font-family: inherit;
          font-size: 16px;
        }
        .cp-field input::placeholder {
          color: #8a918f;
        }
        .cp-go {
          padding: 18px 24px;
          border: 0;
          border-radius: 999px;
          background: #0a4a42;
          color: #fff;
          font-family: inherit;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition:
            background-color 0.2s ease,
            transform 0.15s ease;
        }
        .cp-go:hover:not(:disabled) {
          background: #1d7a6e;
        }
        .cp-go:active:not(:disabled) {
          transform: scale(0.98);
        }
        .cp-go:disabled {
          opacity: 0.7;
          cursor: default;
        }
        .cp-go:focus-visible {
          outline: 2px solid #1d7a6e;
          outline-offset: 3px;
        }
        .cp-copy .cp-sent {
          padding: 18px 20px;
          border-radius: 16px;
          background: #e6f4ee;
          color: #0a4a42;
          font-size: 16px;
        }
        .cp-copy .cp-error {
          color: #b3261e;
          font-size: 14px;
        }
        .cp-copy .cp-note {
          color: #515856;
          font-size: 13px;
        }
        .cp-note a,
        .cp-error a {
          color: #1d7a6e;
          font-weight: 600;
        }

        .cp-stage {
          perspective: 1400px;
        }
        .cp-pass {
          --tilt-x: 0deg;
          --tilt-y: 0deg;
          position: relative;
          display: flex;
          overflow: hidden;
          border-radius: 28px;
          background: #fff;
          box-shadow: 0 50px 90px -46px rgba(10, 40, 36, 0.45);
          opacity: 0;
          transform: translate3d(0, 90px, 0) rotate(-9deg) scale(0.94);
          transition:
            opacity 0.7s ease,
            transform 1.1s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.6s ease;
        }
        .cp-pass.is-landed {
          opacity: 1;
          transform: rotate(-2deg) rotateX(var(--tilt-x)) rotateY(var(--tilt-y));
          transition:
            opacity 0.7s ease,
            transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.6s ease;
          /* backwards, not both: once landed, the regular transform (with the
             pointer tilt) takes over from the keyframes. */
          animation: cp-land 1.1s cubic-bezier(0.22, 1, 0.36, 1) backwards;
        }
        @keyframes cp-land {
          from {
            opacity: 0;
            transform: translate3d(0, 90px, 0) rotate(-9deg) scale(0.94);
          }
          to {
            opacity: 1;
            transform: rotate(-2deg);
          }
        }
        .cp-pass.is-sent {
          box-shadow: 0 60px 100px -46px rgba(10, 74, 66, 0.55);
        }
        .cp-main {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: calc(26px * var(--fit, 1));
          padding: calc(36px * var(--fit, 1)) 40px;
          font-family: "Manrope", var(--font-sans);
        }
        .cp-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .cp-brand {
          color: #0a4a42;
          font-size: 15px;
          font-weight: 700;
        }
        .cp-kicker {
          color: #8a918f;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
        }
        .cp-route {
          display: flex;
          align-items: center;
          gap: 22px;
        }
        .cp-code {
          display: flex;
          flex-direction: column;
        }
        .cp-code b {
          color: #101a18;
          font-size: calc(60px * var(--fit, 1));
          font-weight: 300;
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .cp-code.is-dest b {
          color: #0a4a42;
          font-weight: 700;
        }
        .cp-code small {
          color: #515856;
          font-size: 13px;
        }
        .cp-path {
          position: relative;
          width: 120px;
          height: 24px;
          flex-shrink: 0;
        }
        .cp-path svg {
          display: block;
          width: 120px;
          height: 24px;
        }
        .cp-dash {
          stroke: #c9d9d3;
          stroke-width: 2;
          stroke-dasharray: 4 6;
        }
        .cp-arrow {
          stroke: #1d7a6e;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        /* The plane flies the route on a loop once the pass has landed. */
        .cp-plane {
          position: absolute;
          top: 50%;
          left: 0;
          width: 22px;
          height: 22px;
          margin-top: -11px;
          color: #0a4a42;
          opacity: 0;
        }
        .cp-plane svg {
          width: 100%;
          height: 100%;
        }
        .cp-pass.is-landed .cp-plane {
          animation: cp-fly 3.6s cubic-bezier(0.45, 0, 0.25, 1) 1s infinite;
        }
        @keyframes cp-fly {
          0% {
            opacity: 0;
            transform: translateX(0);
          }
          12% {
            opacity: 1;
          }
          78% {
            opacity: 1;
          }
          92%,
          100% {
            opacity: 0;
            transform: translateX(92px);
          }
        }
        .cp-fields {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: calc(18px * var(--fit, 1)) 24px;
          padding-top: calc(22px * var(--fit, 1));
          border-top: 1px dashed #e3ddd3;
        }
        .cp-fields > div {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }
        .cp-fields span {
          color: #8a918f;
          font-size: 12px;
          font-weight: 700;
        }
        .cp-fields b {
          color: #101a18;
          font-size: 20px;
          font-weight: 700;
          line-height: 1.2;
        }
        .cp-fields b.is-empty {
          color: #c2c7c5;
        }
        /* The name flips in letter by letter as it is typed. */
        .cp-fields :global(.cp-letter) {
          display: inline-block;
          color: #101a18;
          font-size: 20px;
          font-weight: 700;
          animation: cp-letter 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes cp-letter {
          from {
            opacity: 0;
            transform: translateY(8px) rotateX(-70deg);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .cp-stub {
          display: flex;
          width: 150px;
          flex-shrink: 0;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border-left: 2px dashed #e3ddd3;
          background: #f6f3ee;
          font-family: "Manrope", var(--font-sans);
        }
        .cp-stub span {
          color: #8a918f;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
        }
        .cp-stub b {
          color: #0a4a42;
          font-size: 34px;
          font-weight: 300;
          letter-spacing: -0.04em;
          line-height: 1;
        }
        .cp-stub small {
          color: #515856;
          font-size: 12px;
        }
        .cp-stamp {
          position: absolute;
          right: 182px;
          bottom: 30px;
          padding: 8px 16px;
          border: 3px solid #1d7a6e;
          border-radius: 10px;
          color: #1d7a6e;
          font-family: "Manrope", var(--font-sans);
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.12em;
          transform: rotate(-14deg);
          animation: cp-stamp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes cp-stamp {
          0% {
            opacity: 0;
            transform: rotate(-14deg) scale(1.7);
          }
          60% {
            opacity: 1;
            transform: rotate(-14deg) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: rotate(-14deg) scale(1);
          }
        }

        /* Phones: stacked, no board, the pass a bit smaller and straight. */
        @media (max-width: 900px) {
          .cp-board {
            width: auto;
            height: auto;
            padding: 0;
          }
          .cp-grid {
            grid-template-columns: 1fr;
            gap: 2.25rem;
          }
          .cp-copy h2 {
            font-size: clamp(2rem, 8.5vw, 2.6rem);
          }
          .cp-copy > p {
            font-size: 1rem;
          }
          .cp-pass.is-landed {
            transform: rotate(-1.5deg);
          }
          @keyframes cp-land {
            from {
              opacity: 0;
              transform: translate3d(0, 60px, 0) rotate(-6deg);
            }
            to {
              opacity: 1;
              transform: rotate(-1.5deg);
            }
          }
          .cp-main {
            gap: 18px;
            padding: 22px 20px;
          }
          .cp-route {
            gap: 12px;
          }
          .cp-code b {
            font-size: 38px;
          }
          .cp-path,
          .cp-path svg {
            width: 64px;
          }
          @keyframes cp-fly {
            0% {
              opacity: 0;
              transform: translateX(0);
            }
            12%,
            78% {
              opacity: 1;
            }
            92%,
            100% {
              opacity: 0;
              transform: translateX(44px);
            }
          }
          .cp-fields {
            grid-template-columns: 1fr 1fr;
            gap: 12px 14px;
          }
          .cp-fields b,
          .cp-fields :global(.cp-letter) {
            font-size: 15px;
          }
          .cp-stub {
            width: 84px;
          }
          .cp-stub b {
            font-size: 22px;
          }
          .cp-stamp {
            right: 96px;
            font-size: 15px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cp-pass,
          .cp-pass.is-landed,
          .cp-plane,
          .cp-stamp,
          .cp-fields :global(.cp-letter) {
            animation: none !important;
            transition: none !important;
          }
          .cp-pass {
            opacity: 1;
            transform: rotate(-2deg);
          }
        }
      `}</style>
    </div>
  );
}

/* ============================================================================
   The city as a phone playing stories: the reader already knows how to use
   it, so the section reads at a glance. The first story is the weather (the
   strongest argument for recovering here), then one plan per moment of the
   stay. Stories run on their own while on screen; a tap moves forward (left
   third goes back), and the rings on the side jump to any of them.
   ========================================================================== */

const STORY_MS = 5000;

function CityStories({ guide, es, photo }: { guide: CityGuide; es: boolean; photo?: string }) {
  // One story per moment of the stay, exactly as the design board AE.
  // The city photo stands in for a story that has no photo of its own and
  // no tone either; the rest keep their colour until real photos exist.
  const stories = guide.activities.map((a) => {
    const when = (es ? a.when : a.whenEn || a.when) || (es ? "Durante tu estadía" : "During your stay");
    const where = es ? a.where : a.whereEn || a.where;
    return {
      ring: when,
      when: where ? `${when} · ${where}` : when,
      tag: (es ? a.tag : a.tagEn || a.tag) || when,
      title: es ? a.name : a.nameEn,
      text: es ? a.note : a.noteEn,
      photo: a.photo || (!a.tone ? photo : undefined),
      tone: a.tone,
    };
  });
  const n = stories.length;

  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0); // restarts the progress bar
  const [playing, setPlaying] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Desktop: laid out for the screen first (see useFitBoard). The board spans
  // the screen's width and takes the screen's height (--bh, 640-900 board
  // px); the phone and the type follow that height instead of shrinking.
  const boardRef = useFitBoard<HTMLDivElement>({
    minH: 640,
    maxH: 900,
    onFit: (el, k, bh) => {
      if (!bh) {
        el.style.removeProperty("--cs-shift");
        el.style.removeProperty("--cs-phone-shift");
        return;
      }
      // The text sits up to 199 board px further left and the phone up to
      // 132 further right than on board AE, using whatever margin the screen
      // leaves around the board; never closer than 96 board px to the edge.
      const room = (window.innerWidth / k - 1440) / 2 + 120 - 96;
      el.style.setProperty("--cs-shift", `${Math.max(0, Math.min(199, room))}px`);
      el.style.setProperty("--cs-phone-shift", `${Math.max(0, Math.min(132, room))}px`);
    },
  });

  // Play only while the phone is on screen, and never under reduced motion.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setPlaying(e.isIntersecting), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => {
      setActive((a) => (a + 1) % n);
      setCycle((c) => c + 1);
    }, STORY_MS);
    return () => window.clearTimeout(t);
  }, [playing, active, cycle, n]);

  const go = (i: number) => {
    setActive((i + n) % n);
    setCycle((c) => c + 1);
  };
  const onTap = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    go(e.clientX - r.left < r.width / 3 ? active - 1 : active + 1);
  };
  const cur = stories[active];

  return (
    <div className="cs-board" ref={boardRef}>
    <div className="cs-grid" ref={rootRef}>
      <div className="cs-copy">
        {/* Two set lines: "Así se ve Medellín mientras te" / "recuperas." */}
        <h2>
          <span className="cs-line">
            {es ? `Así se ve ${guide.city}` : `This is ${guide.city}`}{" "}
            <strong>{es ? "mientras te" : "while you"}</strong>
          </span>{" "}
          <strong className="cs-line">{es ? "recuperas." : "recover."}</strong>
        </h2>
        <p>
          {es
            ? `${["Un", "Dos", "Tres", "Cuatro", "Cinco", "Seis"][n - 1] ?? n} ${n === 1 ? "momento" : "momentos"} de tu estadía, contados como los contarías tú. Toca la historia para avanzar.`
            : `${["One", "Two", "Three", "Four", "Five", "Six"][n - 1] ?? n} ${n === 1 ? "moment" : "moments"} of your stay, told the way you'd tell them. Tap the story to move on.`}
        </p>
        <ul className="cs-rings" aria-label={es ? "Historias" : "Stories"}>
          {stories.map((st, i) => (
            <li key={i}>
              <button
                type="button"
                className={`cs-ring${i === active ? " is-on" : ""}${i < active ? " is-seen" : ""}`}
                onClick={() => go(i)}
                aria-label={st.title}
                aria-current={i === active}
              >
                <span
                  className="cs-ring-img"
                  style={
                    st.photo
                      ? { backgroundImage: `url(${st.photo})` }
                      : st.tone
                        ? { backgroundImage: st.tone }
                        : undefined
                  }
                  aria-hidden="true"
                />
                <span className="cs-ring-label">{st.ring}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="cs-phone">
        <button
          type="button"
          className="cs-screen"
          onClick={onTap}
          aria-label={es ? "Siguiente historia" : "Next story"}
          style={
            cur.photo ? { backgroundImage: `url(${cur.photo})` } : cur.tone ? { backgroundImage: cur.tone } : undefined
          }
        >
          {!cur.photo && (
            <span className="cs-empty">{es ? `Foto: ${cur.title}` : `Photo: ${cur.title}`}</span>
          )}
          <span className="cs-shade" aria-hidden="true" />
          <span className="cs-bars" aria-hidden="true">
            {stories.map((_, i) => (
              <span key={i} className="cs-bar">
                <span
                  key={i === active ? `live-${cycle}` : "still"}
                  className={`cs-bar-fill${i < active ? " is-done" : ""}${i === active ? (playing ? " is-live" : " is-done") : ""}`}
                  style={{ animationDuration: `${STORY_MS}ms` }}
                />
              </span>
            ))}
          </span>
          <span className="cs-head" aria-hidden="true">
            <span className="cs-avatar">BC</span>
            <span className="cs-head-text">
              <strong>{guide.city}</strong>
              <span>{cur.when}</span>
            </span>
          </span>
          <span className="cs-body" key={active} aria-live="polite">
            <span className="cs-tag">{cur.tag}</span>
            <strong className="cs-title">{cur.title}</strong>
            <span className="cs-text">{cur.text}</span>
          </span>
        </button>
      </div>

    </div>
      <style jsx>{`
        /* Desktop values are the design board's own pixels (AE, 1440 x 900);
           the board is zoomed to the screen as a whole, see the effect. */
        .cs-board {
          box-sizing: border-box;
          width: 1440px;
          height: var(--bh, 900px);
          margin: 0 auto;
          padding: 80px 120px calc(var(--bh, 900px) * 0.062);
        }
        .cs-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) calc((var(--bh, 900px) - 140px) * 0.579);
          gap: 96px;
          align-items: center;
          height: 100%;
        }
        .cs-copy {
          display: flex;
          flex-direction: column;
          gap: calc(var(--bh, 900px) * 0.029);
          transform: translateX(calc(-1 * var(--cs-shift, 0px)));
        }
        .cs-copy h2 {
          margin: 0;
          color: #101a18;
          -webkit-text-fill-color: currentColor;
          background: none;
          font-family: "Manrope", var(--font-sans);
          font-size: calc(var(--bh, 900px) * 0.062);
          font-weight: 300;
          letter-spacing: -0.045em;
          line-height: 1.04;
        }
        .cs-copy h2 strong {
          color: #0a4a42;
          font-weight: 700;
        }
        .cs-copy h2 .cs-line {
          display: block;
          white-space: nowrap;
        }
        .cs-copy p {
          max-width: 480px;
          margin: 0;
          color: #515856;
          font-size: max(15px, calc(var(--bh, 900px) * 0.02));
          line-height: 1.6;
        }
        .cs-rings {
          display: flex;
          gap: 18px;
          margin: 10px 0 0;
          padding: 0;
          list-style: none;
        }
        .cs-ring {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 0;
          border: 0;
          background: none;
          font-family: "Manrope", var(--font-sans);
          cursor: pointer;
        }
        .cs-ring-img {
          display: block;
          box-sizing: border-box;
          width: calc(var(--bh, 900px) * 0.08);
          height: calc(var(--bh, 900px) * 0.08);
          border: 3px solid #faf6f0;
          border-radius: 50%;
          background: linear-gradient(160deg, #cdb899, #9d8666) center / cover;
          box-shadow: 0 0 0 3px #5dcaa5;
          transition:
            box-shadow 0.25s ease,
            transform 0.25s ease;
        }
        .cs-ring:hover .cs-ring-img {
          transform: translateY(-2px);
        }
        .cs-ring.is-seen .cs-ring-img {
          box-shadow: 0 0 0 3px #d6ddd9;
        }
        .cs-ring.is-on .cs-ring-img {
          box-shadow: 0 0 0 3px #1d7a6e;
        }
        .cs-ring-label {
          color: #515856;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
        }
        .cs-ring.is-on .cs-ring-label {
          color: #0a4a42;
        }
        .cs-ring:focus-visible {
          outline: 2px solid #1d7a6e;
          outline-offset: 4px;
          border-radius: 12px;
        }

        .cs-phone {
          box-sizing: border-box;
          width: calc((var(--bh, 900px) - 140px) * 0.579); /* board AE's 400 plus 10% */
          height: calc(var(--bh, 900px) - 140px);
          transform: translateX(var(--cs-phone-shift, 0px));
          padding: 12px;
          border-radius: 44px;
          background: #101a18;
          box-shadow: 0 50px 90px -40px rgba(10, 40, 36, 0.55);
        }
        .cs-screen {
          position: relative;
          display: block;
          width: 100%;
          height: 100%;
          padding: 0;
          overflow: hidden;
          border: 0;
          border-radius: 34px;
          background: linear-gradient(170deg, #c9b394, #8c7458) center / cover;
          color: #fff;
          font-family: "Manrope", var(--font-sans);
          text-align: left;
          cursor: pointer;
        }
        .cs-screen:focus-visible {
          outline: 3px solid #5dcaa5;
          outline-offset: -3px;
        }
        .cs-empty {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 13px;
          font-weight: 600;
          text-align: center;
        }
        .cs-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.35) 0%,
            rgba(0, 0, 0, 0) 22%,
            rgba(0, 0, 0, 0) 55%,
            rgba(0, 0, 0, 0.65) 100%
          );
        }
        .cs-bars {
          position: absolute;
          top: 14px;
          right: 14px;
          left: 14px;
          display: flex;
          gap: 4px;
        }
        .cs-bar {
          flex: 1 1 0;
          height: 3px;
          overflow: hidden;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.35);
        }
        .cs-bar-fill {
          display: block;
          width: 100%;
          height: 100%;
          background: #fff;
          transform: scaleX(0);
          transform-origin: left center;
        }
        .cs-bar-fill.is-done {
          transform: none;
        }
        .cs-bar-fill.is-live {
          animation: cs-fill linear both;
        }
        @keyframes cs-fill {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
        .cs-head {
          position: absolute;
          top: 30px;
          left: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .cs-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #fff;
          color: #0a4a42;
          font-size: 13px;
          font-weight: 700;
        }
        .cs-head-text {
          display: flex;
          flex-direction: column;
        }
        .cs-head-text strong {
          font-size: 14px;
          font-weight: 700;
        }
        .cs-head-text span {
          font-size: 12px;
          opacity: 0.85;
        }
        .cs-body {
          position: absolute;
          right: 22px;
          bottom: 34px;
          left: 22px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          animation: cs-rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes cs-rise {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .cs-tag {
          align-self: flex-start;
          padding: 6px 12px;
          border-radius: 999px;
          background: #fff;
          color: #0a4a42;
          font-size: 13px;
          font-weight: 700;
        }
        .cs-title {
          font-size: 30px;
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }
        .cs-text {
          font-size: 15px;
          line-height: 1.5;
          opacity: 0.92;
        }

        /* Phones: a normal responsive layout, no board. */
        @media (max-width: 900px) {
          .cs-board {
            width: auto;
            height: auto;
            padding: 0;
          }
          .cs-grid {
            grid-template-columns: 1fr;
            gap: 1.75rem;
          }
          .cs-copy {
            gap: 1.25rem;
            transform: none;
          }
          .cs-copy h2 {
            font-size: clamp(2rem, 8.5vw, 2.6rem);
          }
          .cs-copy h2 .cs-line {
            white-space: normal;
          }
          .cs-copy p {
            font-size: 1rem;
          }
          .cs-rings {
            gap: 14px;
            overflow-x: auto;
            scrollbar-width: none;
          }
          .cs-ring-img {
            width: 64px;
            height: 64px;
          }
          .cs-phone {
            justify-self: center;
            width: auto;
            height: min(72svh, 560px);
            aspect-ratio: 400 / 760;
            padding: 10px;
          }
          .cs-screen {
            border-radius: 32px;
          }
          .cs-title {
            font-size: 1.5rem;
          }
          .cs-text {
            font-size: 0.9rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cs-body {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

/* ============================================================================
   Patient questions as a conversation with the coordinator. Tap a question:
   it goes out as the patient's message, the coordinator is "typing…" for a
   beat, then her answer lands. Only the last two exchanges stay on screen.
   ========================================================================== */

interface ChatQAItem {
  q: string;
  a: string;
}

/* The specialty overview's procedure picker, in the language of design board
   F2: a large numbered list, the row you point at turns bold and the photo
   beside it changes, with its stay and price; each row opens its page. */
function ProcedurePicker({
  procedures,
  specialtyId,
  fallbackImage,
  es,
}: {
  procedures: NonNullable<Specialty["procedureDetails"]>;
  specialtyId: string;
  fallbackImage: string;
  es: boolean;
}) {
  const [active, setActive] = useState(0);
  const cur = procedures[active];
  const days = (p: (typeof procedures)[number]) => {
    const t = es ? p.recovery : p.recoveryEn || p.recovery;
    const m = t.match(/(\d+)\s*[-–]\s*(\d+)|(\d+)/);
    if (!m) return t;
    return m[1] ? `${m[1]}–${m[2]} ${es ? "días" : "days"}` : `${m[3]} ${es ? "días" : "days"}`;
  };
  const price = (p: (typeof procedures)[number]) => p.priceFrom?.match(/^\$[\d,.]+/)?.[0];

  return (
    <div className="pp">
      <div className="pp-list-col">
        <h2>
          {es ? "Elige tu" : "Choose your"} <strong>{es ? "procedimiento." : "procedure."}</strong>
        </h2>
        <ul className="pp-list">
          {procedures.map((p, i) => {
            const row = (
              <>
                <span className="pp-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="pp-name">{es ? p.name : p.nameEn}</span>
                <span className="pp-meta">
                  {days(p)}
                  {price(p) && <em>{es ? `desde ${price(p)}` : `from ${price(p)}`}</em>}
                </span>
                <span className="pp-arrow" aria-hidden="true">
                  <Icon name="arrow" size={18} />
                </span>
              </>
            );
            const props = {
              className: `pp-row${i === active ? " is-on" : ""}`,
              onMouseEnter: () => setActive(i),
              onFocus: () => setActive(i),
            };
            return (
              <li key={p.name}>
                {p.slug ? (
                  <Link href={`/specialties/${specialtyId}/${p.slug}`} {...props}>
                    {row}
                  </Link>
                ) : (
                  <button type="button" {...props} onClick={() => setActive(i)}>
                    {row}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        <p className="pp-note">
          {es
            ? "Precios desde, en USD, con todo el viaje incluido. Solo corren por tu cuenta el vuelo y tus gastos personales."
            : "Prices from, in USD, with the whole trip included. Only your flight and personal expenses are on you."}
        </p>
      </div>

      <figure className="pp-figure">
        <div className="pp-photo">
          {procedures.map((p, i) => (
            <span
              key={p.name}
              className={`pp-img${i === active ? " is-on" : ""}`}
              style={{ backgroundImage: `url(${p.photo || fallbackImage})` }}
              aria-hidden="true"
            />
          ))}
        </div>
        <figcaption key={active}>{es ? cur.description : cur.descriptionEn}</figcaption>
      </figure>

      <style jsx>{`
        .pp {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 0.62fr);
          gap: clamp(2.5rem, 6vw, 5rem);
          align-items: center;
        }
        .pp-list-col {
          display: flex;
          flex-direction: column;
          gap: clamp(1.25rem, 3vh, 1.75rem);
        }
        .pp-list-col h2 {
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
        .pp-list-col h2 strong {
          color: #0a4a42;
          font-weight: 700;
        }
        .pp-list {
          margin: 0;
          padding: 0;
          list-style: none;
          border-top: 1px solid rgba(29, 122, 110, 0.16);
        }
        .pp-list :global(.pp-row) {
          display: grid;
          grid-template-columns: 3.5rem 1fr auto 2rem;
          gap: 1rem;
          align-items: center;
          width: 100%;
          padding: clamp(0.9rem, 2.2vh, 1.35rem) 0;
          border: 0;
          border-bottom: 1px solid rgba(29, 122, 110, 0.16);
          background: none;
          color: #9aa3a0;
          font-family: "Manrope", var(--font-sans);
          text-align: left;
          text-decoration: none;
          cursor: pointer;
          transition:
            color 0.25s ease,
            padding-left 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .pp-list :global(.pp-row.is-on) {
          padding-left: 1rem;
          color: #0a4a42;
        }
        .pp-list :global(.pp-row:focus-visible) {
          outline: 2px solid #1d7a6e;
          outline-offset: 2px;
        }
        .pp-num {
          font-size: 0.82rem;
          font-weight: 700;
        }
        .pp-name {
          font-size: clamp(1.25rem, min(2.2vw, 3.6vh), 2rem);
          font-weight: 300;
          letter-spacing: -0.03em;
        }
        .pp-list :global(.pp-row.is-on) .pp-name {
          font-weight: 700;
        }
        .pp-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
          font-size: 0.85rem;
          font-weight: 700;
          white-space: nowrap;
        }
        .pp-meta em {
          font-style: normal;
          font-weight: 500;
          opacity: 0.8;
        }
        .pp-arrow {
          display: flex;
          justify-content: flex-end;
          opacity: 0;
          transform: translateX(-6px);
          transition:
            opacity 0.25s ease,
            transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .pp-list :global(.pp-row.is-on) .pp-arrow {
          opacity: 1;
          transform: none;
        }
        .pp-note {
          margin: 0;
          color: #515856;
          font-size: 0.92rem;
        }
        .pp-figure {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin: 0;
        }
        .pp-photo {
          position: relative;
          height: min(62vh, 560px);
          overflow: hidden;
          border-radius: 26px;
          background: #d8d0c3;
        }
        .pp-img {
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
        .pp-img.is-on {
          opacity: 1;
          transform: scale(1.1);
        }
        .pp-figure figcaption {
          color: #515856;
          font-size: 1.02rem;
          line-height: 1.55;
          animation: pp-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes pp-in {
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
          .pp {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .pp-figure {
            order: -1;
          }
          .pp-photo {
            height: auto;
            aspect-ratio: 4 / 3;
          }
          .pp-list :global(.pp-row) {
            grid-template-columns: 2.5rem 1fr auto;
          }
          .pp-arrow {
            display: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .pp-img,
          .pp-img.is-on {
            transform: none;
            transition: opacity 0.2s ease;
          }
          .pp-figure figcaption {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

function ChatQA({ items, es, whatsappText }: { items: ChatQAItem[]; es: boolean; whatsappText: string }) {
  const [asked, setAsked] = useState<number[]>([0]);
  const [typing, setTyping] = useState(false);
  // The next suggested question sits in the compose bar, typed out as if the
  // patient were writing it; send posts it, the arrows swap to another one.
  const [page, setPage] = useState(0);
  const [typed, setTyped] = useState(0);
  const timer = useRef<number | undefined>(undefined);
  const threadRef = useRef<HTMLDivElement>(null);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  // Like a real chat: always showing the newest message.
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [asked, typing]);

  const ask = (i: number) => {
    if (typing) return;
    setAsked((prev) => prev.concat(i));
    if (prefersReducedMotion()) return;
    setTyping(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setTyping(false), 900);
  };

  const shown = asked.slice(-3);
  const remaining = items.map((it, i) => ({ ...it, i })).filter((it) => !asked.includes(it.i));
  const draft = remaining.length > 0 ? remaining[page % remaining.length] : null;
  const draftText = draft ? draft.q : "";

  // Type the draft out, one character at a time.
  useEffect(() => {
    if (!draftText) return;
    if (prefersReducedMotion()) {
      setTyped(draftText.length);
      return;
    }
    setTyped(0);
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setTyped(n);
      if (n >= draftText.length) window.clearInterval(id);
    }, 32);
    return () => window.clearInterval(id);
  }, [draftText]);

  const send = () => {
    if (!draft || typing) return;
    ask(draft.i);
    // The list shrinks by one, so the same page index now points at the next.
    setPage((p) => (remaining.length > 1 ? p % (remaining.length - 1) : 0));
  };
  // The full list of questions, opened from the compose bar.
  const [menuOpen, setMenuOpen] = useState(false);
  const footRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!footRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);
  const pick = (i: number) => {
    setMenuOpen(false);
    if (typing) return;
    ask(i);
    setPage(0);
  };

  return (
    <div className="chat-grid">
      <div className="chat-copy">
        <h2>
          {es ? "Pregúntale lo que sea." : "Ask her anything."}{" "}
          <strong>{es ? "Así te responde tu coordinadora." : "This is how your coordinator answers."}</strong>
        </h2>
        <p>
          {es
            ? "Estas son las dudas que más recibimos antes de reservar. Toca una y mira la respuesta."
            : "These are the questions we get most before people book. Tap one to see the answer."}
        </p>
        <a className="chat-wa" href={waHref(whatsappText)} target="_blank" rel="noopener noreferrer">
          {es ? "Escribirle por WhatsApp" : "Message her on WhatsApp"}
          <Icon name="arrow" size={16} />
        </a>
      </div>

      {/* Dressed as a WhatsApp conversation: that is where she actually
          answers, so the demo looks like the real thing. */}
      <div className="chat-window">
        <div className="chat-head">
          <svg className="chat-back" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
          <span className="chat-avatar" aria-hidden="true">
            {AGENT_NAME.charAt(0)}
          </span>
          <span className="chat-who">
            <strong>{AGENT_NAME} · Bridge Care</strong>
            <span>
              {typing
                ? es ? "escribiendo…" : "typing…"
                : es ? "Coordinadora de pacientes · en línea" : "Patient coordinator · online"}
            </span>
          </span>
          <span className="chat-tools" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2.5" y="6" width="13" height="12" rx="2.5" />
              <path d="M15.5 10.5l6-3.5v10l-6-3.5" />
            </svg>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 3.5h3.2l1.6 4.2-2.1 1.4a11.5 11.5 0 0 0 7.2 7.2l1.4-2.1 4.2 1.6V19a1.8 1.8 0 0 1-1.9 1.8A16.5 16.5 0 0 1 3.2 5.4 1.8 1.8 0 0 1 5 3.5z" />
            </svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.8" />
              <circle cx="12" cy="12" r="1.8" />
              <circle cx="12" cy="19" r="1.8" />
            </svg>
          </span>
        </div>

        <div className="chat-thread" aria-live="polite" ref={threadRef}>
          <span className="chat-day">{es ? "Hoy" : "Today"}</span>
          {shown.map((idx, k) => {
            const last = k === shown.length - 1;
            // Clock times that move forward with the conversation.
            const n = asked.length - shown.length + k;
            const time = (extra: number) => `10:${String(24 + n * 2 + extra).padStart(2, "0")}`;
            return (
              <React.Fragment key={`${idx}-${asked.length}-${k}`}>
                <div className="chat-row is-me">
                  <div className="chat-bubble is-me">
                    {items[idx].q}
                    <span className="chat-meta">
                      {time(0)}
                      <svg width="16" height="11" viewBox="0 0 16 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M1 6l3 3 6-7M7 9l1 0.5 6-7.5" />
                      </svg>
                    </span>
                  </div>
                </div>
                {last && typing ? (
                  <div className="chat-row">
                    <div className="chat-bubble chat-typing" aria-label={es ? "Escribiendo" : "Typing"}>
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                ) : (
                  <div className="chat-row">
                    <div className="chat-bubble">
                      {items[idx].a}
                      <span className="chat-meta">{time(1)}</span>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="chat-foot" ref={footRef}>
          {draft && menuOpen && (
            <div className="chat-menu" id="chat-menu" role="menu">
              <span className="chat-menu-head">
                {es ? "Preguntas frecuentes" : "Frequent questions"}
                <span>{remaining.length}</span>
              </span>
              <ul>
                {remaining.map((it) => (
                  <li key={it.i}>
                    <button type="button" role="menuitem" onClick={() => pick(it.i)} disabled={typing}>
                      {it.q}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M3.4 20.4l17.5-7.5a1 1 0 0 0 0-1.8L3.4 3.6a.9.9 0 0 0-1.3 1l1.9 6.4 9 1-9 1-1.9 6.4a.9.9 0 0 0 1.3 1z" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {draft ? (
            <div className="chat-compose">
              <span className="chat-input">
                <button
                  type="button"
                  className={`chat-cycle${menuOpen ? " is-open" : ""}`}
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-expanded={menuOpen}
                  aria-controls="chat-menu"
                  aria-label={es ? "Ver todas las preguntas" : "See all questions"}
                  title={es ? "Ver todas las preguntas" : "See all questions"}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 6h16M4 12h16M4 18h10" />
                  </svg>
                </button>
                <button type="button" className="chat-draft" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen}>
                  <span aria-hidden="true">{draftText.slice(0, typed)}</span>
                  <span className="sr-only">{draftText}</span>
                  <i className="chat-caret" aria-hidden="true" />
                </button>
                <span className="chat-count" aria-hidden="true">
                  {remaining.length} {es ? "preguntas" : "questions"}
                </span>
              </span>
              <button
                type="button"
                className="chat-send"
                onClick={send}
                disabled={typing}
                aria-label={es ? `Enviar: ${draftText}` : `Send: ${draftText}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3.4 20.4l17.5-7.5a1 1 0 0 0 0-1.8L3.4 3.6a.9.9 0 0 0-1.3 1l1.9 6.4 9 1-9 1-1.9 6.4a.9.9 0 0 0 1.3 1z" />
                </svg>
              </button>
            </div>
          ) : (
            /* Every question asked: the bar becomes the real way in. */
            <a className="chat-compose" href={waHref(whatsappText)} target="_blank" rel="noopener noreferrer">
              <span className="chat-input is-placeholder">
                {es ? "Escribe tu propia pregunta en WhatsApp" : "Ask your own question on WhatsApp"}
              </span>
              <span className="chat-send" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.4 20.4l17.5-7.5a1 1 0 0 0 0-1.8L3.4 3.6a.9.9 0 0 0-1.3 1l1.9 6.4 9 1-9 1-1.9 6.4a.9.9 0 0 0 1.3 1z" />
                </svg>
              </span>
            </a>
          )}
          <span className="chat-hint">
            {draft
              ? es ? "Envía la pregunta o toca la barra para ver todas" : "Send the question or tap the bar to see them all"
              : es ? "Ya viste todas las respuestas" : "You've seen every answer"}
          </span>
        </div>
      </div>

      <style jsx>{`
        .chat-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
          gap: clamp(2.5rem, 5vw, 5rem);
          align-items: center;
        }
        .chat-copy {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: clamp(1rem, 2.4vh, 1.5rem);
        }
        .chat-copy h2 {
          margin: 0;
          color: #101a18;
          -webkit-text-fill-color: currentColor;
          background: none;
          font-family: "Manrope", var(--font-sans);
          font-size: clamp(2rem, 4vw, 3.6rem);
          font-weight: 300;
          letter-spacing: -0.04em;
          line-height: 1.04;
          text-wrap: balance;
        }
        .chat-copy h2 strong {
          color: #0a4a42;
          font-weight: 700;
        }
        .chat-copy p {
          max-width: 40ch;
          margin: 0;
          color: var(--sp-muted);
          font-size: clamp(1rem, 1.3vw, 1.15rem);
          line-height: 1.6;
        }
        .chat-wa {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          margin-top: 0.4rem;
          padding: 0.95rem 1.6rem;
          border-radius: 999px;
          background: #0a4a42;
          color: #fff;
          font-size: 1rem;
          font-weight: 700;
          text-decoration: none;
          transition: background-color 0.2s ease;
        }
        .chat-wa:hover {
          background: #1d7a6e;
          color: #fff;
        }
        .chat-wa:focus-visible {
          outline: 2px solid #1d7a6e;
          outline-offset: 3px;
        }

        /* WhatsApp's own light theme: green bar, beige wallpaper, green
           outgoing bubbles with a tail, ticks and times. */
        .chat-window {
          font-family: "Segoe UI", "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif;
          display: flex;
          flex-direction: column;
          /* 20% narrower than its column, like a phone-sized conversation. */
          width: 80%;
          justify-self: center;
          height: clamp(520px, 74vh, 660px);
          overflow: hidden;
          border-radius: 24px;
          background: #efeae2;
          box-shadow: 0 40px 80px -40px rgba(10, 40, 36, 0.35);
        }
        .chat-head {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px 10px 12px;
          background: #008069;
          color: #fff;
        }
        .chat-back {
          flex-shrink: 0;
          opacity: 0.9;
        }
        .chat-avatar {
          display: grid;
          flex-shrink: 0;
          place-items: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #dfe5e7;
          color: #0a4a42;
          font-size: 16px;
          font-weight: 700;
        }
        .chat-who {
          display: flex;
          flex: 1;
          flex-direction: column;
          min-width: 0;
        }
        .chat-who strong {
          overflow: hidden;
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .chat-who span {
          overflow: hidden;
          color: rgba(255, 255, 255, 0.82);
          font-size: 12.5px;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .chat-tools {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          gap: 20px;
          opacity: 0.95;
        }

        .chat-thread {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 4px;
          padding: 14px 6% 16px;
          overflow-y: auto;
          overscroll-behavior: contain;
          scrollbar-width: none;
          /* A faint doodle wallpaper, drawn in CSS. */
          background-color: #efeae2;
          background-image:
            radial-gradient(circle at 20% 30%, rgba(120, 100, 70, 0.07) 0 2px, transparent 2.5px),
            radial-gradient(circle at 70% 70%, rgba(120, 100, 70, 0.06) 0 3px, transparent 3.5px),
            radial-gradient(circle at 85% 20%, rgba(120, 100, 70, 0.05) 0 1.5px, transparent 2px);
          background-size: 46px 46px, 64px 64px, 38px 38px;
        }
        .chat-thread::-webkit-scrollbar {
          display: none;
        }
        /* justify-content: flex-end would stop the thread from scrolling up;
           this spacer pushes short threads to the bottom instead. */
        .chat-thread::before {
          content: "";
          margin-top: auto;
        }
        .chat-day {
          align-self: center;
          margin-bottom: 8px;
          padding: 5px 12px;
          border-radius: 8px;
          background: #fff;
          color: #54656f;
          font-size: 12.5px;
          box-shadow: 0 1px 0.5px rgba(11, 20, 26, 0.13);
        }
        .chat-row {
          display: flex;
          justify-content: flex-start;
          margin-top: 6px;
          animation: chat-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .chat-row.is-me {
          justify-content: flex-end;
        }
        @keyframes chat-in {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .chat-bubble {
          position: relative;
          max-width: 80%;
          padding: 7px 10px 8px 10px;
          border-radius: 0 8px 8px 8px;
          background: #fff;
          color: #111b21;
          font-size: 15px;
          line-height: 1.45;
          box-shadow: 0 1px 0.5px rgba(11, 20, 26, 0.13);
        }
        /* The little tail on the top corner. */
        .chat-bubble::before {
          content: "";
          position: absolute;
          top: 0;
          left: -8px;
          border-right: 8px solid #fff;
          border-bottom: 10px solid transparent;
        }
        .chat-bubble.is-me {
          max-width: 72%;
          border-radius: 8px 0 8px 8px;
          background: #d9fdd3;
        }
        .chat-bubble.is-me::before {
          left: auto;
          right: -8px;
          border-right: 0;
          border-left: 8px solid #d9fdd3;
        }
        .chat-meta {
          display: inline-flex;
          float: right;
          align-items: center;
          gap: 3px;
          margin: 8px 0 -4px 12px;
          color: #667781;
          font-size: 11px;
          line-height: 1;
        }
        .chat-bubble.is-me .chat-meta svg {
          color: #53bdeb;
        }
        .chat-typing {
          display: inline-flex;
          gap: 4px;
          padding: 12px 14px;
        }
        .chat-typing span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #8696a0;
          animation: chat-dot 1s ease-in-out infinite;
        }
        .chat-typing span:nth-child(2) {
          animation-delay: 0.15s;
        }
        .chat-typing span:nth-child(3) {
          animation-delay: 0.3s;
        }
        @keyframes chat-dot {
          0%,
          60%,
          100% {
            opacity: 0.35;
            transform: translateY(0);
          }
          30% {
            opacity: 1;
            transform: translateY(-3px);
          }
        }

        .chat-foot {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 4px 12px 12px;
          background: #efeae2;
        }
        .chat-compose {
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: 999px;
          text-decoration: none;
        }
        .chat-input {
          display: flex;
          flex: 1;
          align-items: center;
          gap: 6px;
          min-width: 0;
          padding: 5px 14px 5px 6px;
          border-radius: 999px;
          background: #fff;
          box-shadow: 0 1px 0.5px rgba(11, 20, 26, 0.13);
        }
        .chat-input.is-placeholder {
          padding: 12px 18px;
          color: #8696a0;
          font-size: 15px;
        }
        .chat-cycle {
          display: grid;
          flex-shrink: 0;
          place-items: center;
          width: 36px;
          height: 36px;
          border: 0;
          border-radius: 50%;
          background: transparent;
          color: #54656f;
          cursor: pointer;
          transition:
            background-color 0.2s ease,
            transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .chat-cycle:hover:not(:disabled) {
          background: #f0f2f5;
        }
        .chat-cycle.is-open {
          background: #e7f8f1;
          color: #008069;
        }

        /* The question list slides up from the compose bar, like WhatsApp's
           attachment sheet. */
        .chat-menu {
          position: absolute;
          right: 12px;
          bottom: calc(100% - 4px);
          left: 12px;
          z-index: 2;
          display: flex;
          flex-direction: column;
          max-height: min(380px, 52vh);
          overflow: hidden;
          border-radius: 16px;
          background: #fff;
          box-shadow:
            0 2px 5px rgba(11, 20, 26, 0.18),
            0 12px 32px -8px rgba(11, 20, 26, 0.25);
          transform-origin: bottom left;
          animation: chat-menu-in 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes chat-menu-in {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .chat-menu-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px 10px;
          color: #008069;
          font-size: 13px;
          font-weight: 600;
        }
        .chat-menu-head span {
          color: #8696a0;
          font-weight: 400;
          font-variant-numeric: tabular-nums;
        }
        .chat-menu ul {
          margin: 0;
          padding: 0 0 8px;
          overflow-y: auto;
          list-style: none;
          overscroll-behavior: contain;
          scrollbar-width: thin;
          scrollbar-color: #d1d7db transparent;
        }
        .chat-menu li + li button {
          border-top: 1px solid #f0f2f5;
        }
        .chat-menu button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          width: 100%;
          padding: 12px 18px;
          border: 0;
          background: transparent;
          color: #111b21;
          font-family: inherit;
          font-size: 15px;
          text-align: left;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        .chat-menu button svg {
          flex-shrink: 0;
          color: #00a884;
          opacity: 0;
          transition: opacity 0.15s ease;
        }
        .chat-menu button:hover:not(:disabled),
        .chat-menu button:focus-visible {
          background: #f5f6f6;
          outline: none;
        }
        .chat-menu button:hover svg,
        .chat-menu button:focus-visible svg {
          opacity: 1;
        }
        .chat-cycle:disabled {
          opacity: 0.35;
          cursor: default;
        }
        .chat-draft {
          display: flex;
          flex: 1;
          align-items: center;
          min-width: 0;
          padding: 8px 0;
          border: 0;
          background: transparent;
          color: #111b21;
          font-family: inherit;
          font-size: 15px;
          text-align: left;
          white-space: nowrap;
          cursor: pointer;
          overflow: hidden;
        }
        .chat-draft > span:first-child {
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .chat-caret {
          flex-shrink: 0;
          width: 2px;
          height: 20px;
          margin-left: 1px;
          background: #00a884;
          animation: chat-caret 1s steps(1) infinite;
        }
        @keyframes chat-caret {
          50% {
            opacity: 0;
          }
        }
        .chat-count {
          flex-shrink: 0;
          color: #8696a0;
          font-size: 12px;
          font-variant-numeric: tabular-nums;
        }
        .chat-send {
          display: grid;
          flex-shrink: 0;
          place-items: center;
          width: 48px;
          height: 48px;
          border: 0;
          border-radius: 50%;
          background: #00a884;
          color: #fff;
          cursor: pointer;
          transition:
            background-color 0.2s ease,
            transform 0.2s ease;
        }
        .chat-send:hover:not(:disabled),
        .chat-compose:hover .chat-send {
          background: #008069;
        }
        .chat-send:active:not(:disabled) {
          transform: scale(0.92);
        }
        .chat-send:disabled {
          opacity: 0.6;
          cursor: default;
        }
        .chat-cycle:focus-visible,
        .chat-draft:focus-visible,
        .chat-send:focus-visible,
        .chat-compose:focus-visible {
          outline: 2px solid #008069;
          outline-offset: 2px;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }
        .chat-hint {
          padding-left: 16px;
          color: #667781;
          font-size: 12px;
        }

        @media (max-width: 900px) {
          .chat-grid {
            grid-template-columns: 1fr;
          }
          .chat-window {
            width: 100%;
            height: min(520px, 72svh);
          }
          /* The thread scrolls with a finger to read earlier answers, and
             once it reaches its top or bottom the swipe carries on to the
             page (no "contain"), so it never traps the page scroll. */
          .chat-thread {
            overflow-y: auto;
            overscroll-behavior-y: auto;
            -webkit-overflow-scrolling: touch;
            touch-action: pan-y;
          }
          .chat-bubble {
            max-width: 88%;
          }
          .chat-bubble.is-me {
            max-width: 80%;
          }
          .chat-tools {
            gap: 16px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .chat-row,
          .chat-typing span {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

/* ============================================================================
   Hero itinerary: the trip resolving itself, step by step. The one authored
   motion of the hero — the line fills, each step is ticked off, and "Todo
   listo" lands at the end; then it holds and starts over. Runs only while the
   card is on screen; with reduced motion it simply shows every step done.
   ========================================================================== */

interface TripStep {
  icon: IconName;
  title: string;
  text: string;
  /** Photo shown in the hero while this step is the current one. */
  image?: string;
}

function HeroVisual({
  title,
  doneLabel,
  steps,
  cover,
  coverPosition,
  coverLabel,
}: {
  title: string;
  doneLabel: string;
  steps: TripStep[];
  cover: string;
  coverPosition?: string;
  coverLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const n = steps.length;
  // -1: nothing yet; 0..n-1: that step in progress; n: all done.
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      setActive(n);
      return;
    }

    let timer: number | undefined;
    let step = -1;
    const tick = () => {
      step = step >= n ? 0 : step + 1;
      setActive(step);
      // Each step takes a beat; the finished card holds a little longer.
      timer = window.setTimeout(tick, step >= n ? 3200 : step === 0 ? 1100 : 1000);
    };
    const io = new IntersectionObserver(([entry]) => {
      window.clearTimeout(timer);
      if (entry.isIntersecting) timer = window.setTimeout(tick, 900);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [n]);

  const progress = n > 1 ? Math.max(0, Math.min(active, n - 1)) / (n - 1) : 1;
  const allDone = active >= n;
  // The photo follows the itinerary: the cover before it starts, then each
  // step's own picture; when everything is done it stays on the last one.
  const slides = [{ key: "cover", image: cover, position: coverPosition }].concat(
    steps.map((st, i) => ({ key: `step-${i}`, image: st.image || cover, position: undefined as string | undefined })),
  );
  const shown = active < 0 ? 0 : Math.min(active, n - 1) + 1;

  return (
    <div className="sp-hero-visual" ref={ref}>
      <div className="sp-hero-photo" role="img" aria-label={coverLabel}>
        {slides.map((sl, i) => (
          <span
            key={sl.key}
            className={`hero-slide${i === shown ? " is-on" : ""}`}
            style={{ backgroundImage: `url(${sl.image})`, backgroundPosition: sl.position || "center" }}
            aria-hidden="true"
          />
        ))}
      </div>

    <div className="sp-hero-trip">
      <div className="trip-head">
        <strong>{title}</strong>
        <span className={`trip-done${allDone ? " is-on" : ""}`} aria-hidden={!allDone}>
          <Icon name="check" size={13} />
          {doneLabel}
        </span>
      </div>
      <ol style={{ ["--p" as string]: String(progress) }}>
        {steps.map((st, i) => {
          const state = allDone || i < active ? "is-done" : i === active ? "is-current" : "";
          return (
            <li key={i} className={state}>
              <span className="trip-icon" aria-hidden="true">
                <Icon name={state === "is-done" ? "check" : st.icon} size={16} />
              </span>
              <span className="trip-text">
                <b>{st.title}</b>
                {st.text && <span>{st.text}</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </div>

      <style jsx>{`
        .sp-hero-visual {
          position: relative;
          height: clamp(420px, 76vh, 740px);
          opacity: 0;
          animation: visual-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.35s forwards;
        }
        @keyframes visual-in {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .sp-hero-photo {
          position: absolute;
          inset: 0 0 clamp(3.5rem, 10vh, 5.5rem);
          overflow: hidden;
          border-radius: 20px;
          background: #e6ece9;
          animation: photo-in 1.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        /* The frame opens from a cropped window to full size on load. */
        @keyframes photo-in {
          from {
            clip-path: inset(8% 6% 8% 6% round 28px);
          }
          to {
            clip-path: inset(0 round 20px);
          }
        }
        /* Slides crossfade; the one on screen drifts in slowly. */
        .hero-slide {
          position: absolute;
          inset: 0;
          background-size: cover;
          opacity: 0;
          transform: scale(1.08);
          transition:
            opacity 1.1s ease,
            transform 6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .hero-slide.is-on {
          opacity: 1;
          transform: scale(1);
        }
        .sp-hero-trip {
          position: absolute;
          left: -2.5rem;
          bottom: 0;
          width: 21rem;
          padding: clamp(1rem, 2.4vh, 1.4rem) 1.5rem;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 30px 60px -24px rgba(10, 40, 36, 0.35);
          opacity: 0;
          animation: trip-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.7s forwards;
        }
        @keyframes trip-in {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .trip-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: clamp(0.6rem, 1.6vh, 1rem);
        }
        .trip-head strong {
          color: #101a18;
          font-size: 0.95rem;
          font-weight: 700;
        }
        .trip-done {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.25rem 0.6rem;
          border-radius: 999px;
          background: #0a4a42;
          color: #fff;
          font-size: 0.72rem;
          font-weight: 700;
          opacity: 0;
          transform: scale(0.85);
          transition:
            opacity 0.35s ease,
            transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .trip-done.is-on {
          opacity: 1;
          transform: none;
        }
        ol {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: clamp(0.55rem, 1.5vh, 0.9rem);
          margin: 0;
          padding: 0;
          list-style: none;
        }
        /* The track, and the fill that follows the current step. */
        ol::before,
        ol::after {
          content: "";
          position: absolute;
          top: 1rem;
          left: 15px;
          width: 2px;
          margin-left: -0.5px;
          border-radius: 2px;
        }
        ol::before {
          bottom: 1rem;
          background: rgba(29, 122, 110, 0.18);
        }
        ol::after {
          height: calc((100% - 2rem) * var(--p, 0));
          background: #1d7a6e;
          transition: height 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        li {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          opacity: 0.5;
          transition: opacity 0.4s ease;
        }
        li.is-done,
        li.is-current {
          opacity: 1;
        }
        .trip-icon {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #e3f0ec;
          color: #0a4a42;
          transition:
            background-color 0.4s ease,
            color 0.4s ease,
            transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        li.is-current .trip-icon {
          background: #fff;
          box-shadow: 0 0 0 2px #1d7a6e;
          animation: trip-pulse 1.2s ease-out infinite;
        }
        li.is-done .trip-icon {
          background: #0a4a42;
          color: #fff;
          transform: scale(1.04);
        }
        @keyframes trip-pulse {
          0% {
            box-shadow: 0 0 0 2px #1d7a6e, 0 0 0 0 rgba(29, 122, 110, 0.35);
          }
          100% {
            box-shadow: 0 0 0 2px #1d7a6e, 0 0 0 10px rgba(29, 122, 110, 0);
          }
        }
        .trip-text {
          display: flex;
          flex-direction: column;
          line-height: 1.35;
        }
        .trip-text b {
          color: #101a18;
          font-size: 0.88rem;
          font-weight: 700;
        }
        .trip-text span {
          color: var(--sp-muted);
          font-size: 0.8rem;
        }

        @media (max-width: 900px) {
          .sp-hero-visual {
            height: auto;
          }
          .sp-hero-photo {
            position: relative;
            inset: auto;
            aspect-ratio: 4 / 3;
          }
          .sp-hero-trip {
            position: relative;
            left: auto;
            bottom: auto;
            width: auto;
            margin: -3rem 1rem 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .sp-hero-visual,
          .sp-hero-trip,
          .sp-hero-photo {
            opacity: 1;
            animation: none;
          }
          .hero-slide {
            transition: none;
          }
          ol::after,
          li,
          .trip-icon,
          .trip-done {
            transition: none;
          }
          li.is-current .trip-icon {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

/* ============================================================================
   Page
   ========================================================================== */

export default function SpecialtyDetail({ params }: SpecialtyDetailProps) {
  const { language, t } = useLanguage();
  const { slug, procedure: procedureSlug } = use(params);
  // Active scene of the "why Colombia" deck; back to the first on each page.
  const [scene, setScene] = useState(0);
  const deckTouch = useRef<number | null>(null);
  useEffect(() => setScene(0), [slug, procedureSlug]);
  // Catalog photos are remote URLs that can rot. If one 404s the section drops
  // to a single column instead of leaving an empty frame on the page.
  const [cityPhotoBroken, setCityPhotoBroken] = useState(false);
  // Hydration-safe: renders the defaults on the server and for the hydration
  // pass, then swaps to the stored copy. Also re-renders when the admin panel
  // saves, so no manual refresh counter is needed.
  const specialties = useSpecialties();
  const destinations = useDestinations();

  const specialty: Specialty | null = specialties.find((s) => s.id === slug) || null;

  const es = language === "es";

  const allProcedureDetails = specialty?.procedureDetails;
  // On a procedure page, the procedure being shown. Undefined on the specialty
  // page, and also when the slug doesn't match (handled as "not found" below).
  const focus = procedureSlug
    ? allProcedureDetails?.find((p) => p.slug === procedureSlug)
    : undefined;
  const procedureDetails = focus ? [focus] : allProcedureDetails;
  // Sibling procedures that have their own page, for the "other procedures" links.
  const linkedProcedures = (allProcedureDetails || []).filter((p) => p.slug && p !== focus);


  const introRef = useReveal<HTMLDivElement>();
  const doctorRef = useReveal<HTMLDivElement>();
  const cityRef = useReveal<HTMLDivElement>();
  const resultsRef = useReveal<HTMLDivElement>();
  const reviewsRef = useReveal<HTMLDivElement>();
  const closeRef = useReveal<HTMLDivElement>();
  const othersRef = useReveal<HTMLDivElement>();
  const whyRef = useReveal<HTMLDivElement>();
  const [stayProgress, stayScrollRef] = useScrollProgress<HTMLElement>();

  if (!specialty || (procedureSlug && !focus)) {
    return (
      <div className="container sp-missing">
        <h2>{es ? "Especialidad no encontrada" : "Specialty not found"}</h2>
        <p>
          {es
            ? "El tratamiento solicitado no existe o fue removido del catálogo."
            : "The requested treatment does not exist or has been removed from the catalog."}
        </p>
        <Link href="/" className="btn btn-primary">
          {es ? "Volver al Inicio" : "Return to Home"}
        </Link>
        <style jsx>{`
          .sp-missing {
            padding: 12rem 1.5rem;
            text-align: center;
          }
          .sp-missing h2 {
            margin-bottom: 1rem;
          }
          .sp-missing p {
            margin-bottom: 2rem;
            color: var(--gris-texto);
          }
        `}</style>
      </div>
    );
  }

  const costCol = parseFloat(specialty.avgCostColombia.replace(/[^0-9.]/g, ""));
  const costUS = parseFloat(specialty.avgCostUS.replace(/[^0-9.]/g, ""));
  const savingsPct = costUS ? Math.round(((costUS - costCol) / costUS) * 100) : 0;

  // Bilingual fields fallback
  const name = es ? specialty.name : specialty.nameEn || specialty.name;
  const description = es
    ? specialty.description
    : specialty.descriptionEn || specialty.description;
  const fullDescription = es
    ? specialty.fullDescription
    : specialty.fullDescriptionEn || specialty.fullDescription;
  const focusName = focus ? (es ? focus.name : focus.nameEn || focus.name) : "";
  const heroTitle = focus
    ? (es ? focus.heroTitle : focus.heroTitleEn || focus.heroTitle) || focusName
    : (es ? specialty.heroTitle : specialty.heroTitleEn || specialty.heroTitle) || description;
  const heroImage = focus?.heroImage || specialty.heroImage || specialty.image;
  const heroPosition = focus?.heroImage ? focus.heroPosition : specialty.heroPosition;
  const procedures = es
    ? specialty.procedures
    : specialty.proceduresEn || specialty.procedures || [];
  const recoveryDays = es
    ? specialty.recoveryDays
    : specialty.recoveryDaysEn || specialty.recoveryDays;

  const { doctor, cityGuide, beforeAfter, testimonial } = specialty;

  // A procedure page leads with its own questions, then the specialty's.
  // Complications are the doctor's conversation, not the page's.
  const faqs = [...(focus?.faqs || []), ...(specialty.faqs || [])].filter(
    (f) => !/complicaci|complication/i.test(f.q),
  );

  // On a procedure page the FAQ joins the patient Q&A as one block: the six
  // concerns up front, the rest behind "more questions", minus anything the
  // concerns already answer.
  const norm = (t: string) =>
    t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, "").trim();
  const concernKeys = new Set((focus?.details?.concerns || []).map((c) => norm(c.title)));
  const extraFaqs = focus?.details ? faqs.filter((f) => !concernKeys.has(norm(f.q))) : [];

  // A procedure page shows the reviews for that procedure ("Rinoplastia" matches
  // "Rinoplastia ultrasónica"); if none match, it keeps the specialty's.
  const matchesFocus = (label: string) => {
    if (!focus) return true;
    const a = label.toLowerCase();
    const b = focus.name.toLowerCase();
    return a.includes(b) || b.includes(a);
  };
  const focusReviews = specialty.reviews?.filter((r) => matchesFocus(r.procedure));
  const reviews = focusReviews && focusReviews.length > 0 ? focusReviews : specialty.reviews;

  // Averaged from the reviews we actually hold, so the headline figure can
  // never drift from the list underneath it.
  // Three or more, or it isn't a track record: fewer show as one quote.
  const hasReviews = !!reviews && reviews.length >= 3;
  const soleReview = !hasReviews && reviews && reviews.length > 0 ? reviews[0] : undefined;
  const ratingAvg = hasReviews
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;


  // The city guide names a destination we already have photography for; match
  // on the name rather than inventing an image for the section.
  const cityPhoto = cityGuide
    ? destinations.find((d) => d.name === cityGuide.city)?.image
    : undefined;

  // The stay, drawn as a track of days: surgery day, recovery in the hotel,
  // then the check-up and flight window. Built from the procedure's own
  // figures ("12 - 15 días en Colombia", "3 – 5 horas", "1 noche").
  const stay = (() => {
    if (!focus?.details) return null;
    const d = focus.details;
    const range = (es ? focus.recovery : focus.recoveryEn).match(/(\d+)\s*(?:[-–]\s*(\d+))?/);
    if (!range) return null;
    const min = Number(range[1]);
    const total = Number(range[2] ?? range[1]);
    // One- or two-day treatments have no stay worth drawing.
    if (total < 3) return null;
    const lastSpan = Math.max(1, Math.min(total - 2, total - min + 1));
    const hotelSpan = Math.max(1, total - 1 - lastSpan);
    const hospital = es ? d.hospital : d.hospitalEn;
    const hospitalIsCount = /^\d/.test(hospital);
    const dash = (t: string) => t.replace(/\s*[–-]\s*/g, "–");
    // Surgery under general anaesthesia or sedation reads as surgery; a
    // treatment under local, topical or none (implants, balloon, peels)
    // reads as a treatment with its specialist.
    const operated = /general|sedaci/i.test(d.anesthesia);
    const anesthesia = (t: string, en: boolean) =>
      /^(anest|sin |no |topical)/i.test(t) ? t : en ? `${t} anaesthesia` : `Anestesia ${t.toLowerCase()}`;
    return {
      total,
      hotelSpan,
      lastSpan,
      ticks: [
        { col: 1, label: es ? "Día 0" : "Day 0" },
        { col: 2, label: "1" },
        { col: total - lastSpan + 1, label: String(total - lastSpan) },
        { col: total, label: String(total), end: true },
      ],
      steps: [
        {
          key: "surgery",
          big: dash((es ? d.duration : d.durationEn).replace(/\s*(horas|hours)$/, " h").replace(/\s*(minutos|minutes)$/, " min")),
          title: operated
            ? es
              ? hospitalIsCount
                ? `Cirugía y ${hospital} en la clínica`
                : `Cirugía ${hospital.toLowerCase()} en la clínica`
              : hospitalIsCount
                ? `Surgery and ${hospital} in the clinic`
                : `Surgery: ${hospital.toLowerCase()} in the clinic`
            : es
              ? "Tu tratamiento en la clínica"
              : "Your treatment at the clinic",
          text: es
            ? `${anesthesia(d.anesthesia, false)}. Te llevamos de la clínica al hotel.`
            : `${anesthesia(d.anesthesiaEn, true)}. We take you from the clinic to the hotel.`,
        },
        {
          key: "hotel",
          big: es
            ? `${hotelSpan} ${hotelSpan === 1 ? "día" : "días"}`
            : `${hotelSpan} ${hotelSpan === 1 ? "day" : "days"}`,
          title: es ? "Recuperación en tu hotel" : "Recovery at your hotel",
          text:
            (es ? d.hotelText : d.hotelTextEn || d.hotelText) ||
            (es
              ? "Te recuperas en un hotel cerca de la clínica, con tus controles programados."
              : "You recover in a hotel near the clinic, with check-ups and support."),
        },
        {
          key: "home",
          big: es
            ? min === total ? `Día ${total}` : `Día ${min}–${total}`
            : min === total ? `Day ${total}` : `Day ${min}–${total}`,
          title: es ? "Control y vuelo a casa" : "Check-up and flight home",
          text: operated
            ? es
              ? "Tu cirujano te revisa y firma el permiso para volar."
              : "Your surgeon checks you and signs your clearance to fly."
            : es
              ? "Tu especialista te revisa antes de que vueles a casa."
              : "Your specialist checks you before you fly home.",
        },
      ],
      summary: es
        ? `Estadía de ${total} días: cirugía el día 0, ${hotelSpan} días de recuperación en el hotel y control y vuelo entre el día ${min} y el ${total}.`
        : `A ${total}-day stay: surgery on day 0, ${hotelSpan} days of recovery at the hotel, and check-up and flight between day ${min} and ${total}.`,
    };
  })();

  // Where the scroll has taken the reader in the stay: the day, how full each
  // segment is, and which leg of the trip is current.
  const stayLive = stay
    ? (() => {
        const day = stayProgress * stay.total;
        const ranges = [
          [0, 1],
          [1, 1 + stay.hotelSpan],
          [1 + stay.hotelSpan, stay.total],
        ];
        const fill = ranges.map(([a, b]) => Math.min(1, Math.max(0, (day - a) / (b - a))));
        const phase = day < 1 ? 0 : day < 1 + stay.hotelSpan ? 1 : 2;
        return { day, fill, phase, label: Math.min(stay.total, Math.floor(day)) };
      })()
    : null;

  // Procedure page uses its own argument; otherwise the specialty's.
  const why = focus?.why || specialty.why;

  // ---------------------------------------------------------------- hero
  // The hero sells the whole trip, not a body: where you'll be, with whom,
  // and that everything around the procedure is handled.
  const surgical = specialty.id === "cirugia-estetica" || specialty.id === "bariatria";
  const heroStrong = es ? "Con todo tu viaje resuelto." : "With your whole trip taken care of.";
  const heroTripLead = es
    ? `${surgical ? "Cirujano" : "Especialista"} certificado que te atiende en tu idioma, clínica acreditada, hotel y traslados. Tú solo llegas.`
    : `Certified ${surgical ? "surgeon" : "specialist"}, who treats you in your language, accredited clinic, hotel and transfers. You just show up.`;
  const stayText = focus ? (es ? focus.recovery : focus.recoveryEn) : recoveryDays;
  const stayRange = stayText.match(/(\d+)\s*(?:[-–]\s*(\d+))?/);
  const stayMin = stayRange ? Number(stayRange[1]) : null;
  const stayMax = stayRange ? Number(stayRange[2] ?? stayRange[1]) : null;
  const priceFrom = (focus ? focus.priceFrom : undefined) || specialty.priceFrom;
  const heroFacts = [
    stayMin !== null && {
      key: "stay",
      big: stayMin === stayMax ? String(stayMin) : `${stayMin}–${stayMax}`,
      label: es ? "días en Colombia" : "days in Colombia",
    },
    savingsPct > 0 && {
      key: "save",
      big: `${savingsPct}%`,
      label: es ? "menos que en EE. UU." : "less than in the US",
    },
    priceFrom && {
      key: "price",
      big: priceFrom.match(/^\$[\d,.]+/)?.[0] ?? priceFrom,
      label: es ? "desde, en USD" : "from, in USD",
    },
  ].filter(Boolean) as { key: string; big: string; label: string }[];

  // "Dr. Santiago Mejía" → "el Dr. Mejía"; "Dra. Catalina Herrera" → "la Dra. Herrera".
  const doctorShort = doctor
    ? (() => {
        const parts = doctor.name.split(" ");
        const title = parts[0];
        const last = parts[parts.length - 1];
        const article = title.startsWith("Dra") ? (es ? "la" : "") : es ? "el" : "";
        return `${article ? article + " " : ""}${title} ${last}`;
      })()
    : "";
  const clinicName = (specialty.clinicDetails?.[0]?.name || specialty.clinics[0] || "").replace(/\s*\(.*\)$/, "");
  const heroCity = cityGuide?.city || "Colombia";
  const tripSteps = [
    {
      icon: "plane" as IconName,
      title: es ? `Llegada a ${heroCity}` : `Arrival in ${heroCity}`,
      text: es ? "Te recogemos en el aeropuerto" : "We pick you up at the airport",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1400",
    },
    doctor && {
      icon: "shield" as IconName,
      title: es
        ? `${surgical ? "Cirugía" : "Tratamiento"} con ${doctorShort}`
        : `${surgical ? "Surgery" : "Treatment"} with ${doctorShort.trim()}`,
      text: clinicName,
      image: heroImage,
    },
    {
      icon: "bed" as IconName,
      title: es ? "Hotel incluido" : "Hotel included",
      text: es ? "A menos de 15 min de la clínica" : "Under 15 min from the clinic",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1400",
    },
    {
      icon: "check" as IconName,
      title: es ? "Control y vuelo a casa" : "Check-up and flight home",
      image: cityPhoto,
      text:
        stayMin !== null
          ? es
            ? stayMin === stayMax ? `El día ${stayMax}` : `Entre el día ${stayMin} y el ${stayMax}`
            : stayMin === stayMax ? `On day ${stayMax}` : `Between day ${stayMin} and ${stayMax}`
          : "",
    },
  ].filter(Boolean) as TripStep[];

  const contactHref = `/contacto?specialty=${specialty.id}`;
  const leadSource = focus ? `${specialty.name} — ${focus.name}` : specialty.name;

  return (
    <article className="sp">
      {/* ============================== HERO ============================== */}
      <header className="sp-hero">
        <div className="sp-hero-inner">
          <div className="sp-hero-copy">
            <h1 className="sp-hero-title">
              {heroTitle.split(" ").map((w, i) => (
                <React.Fragment key={`a${i}`}>
                  <span className="hero-word" style={{ animationDelay: `${0.12 + i * 0.07}s` }}>
                    {w}
                  </span>{" "}
                </React.Fragment>
              ))}
              <strong>
                {heroStrong.split(" ").map((w, i, arr) => (
                  <React.Fragment key={`b${i}`}>
                    <span
                      className="hero-word"
                      style={{ animationDelay: `${0.12 + (heroTitle.split(" ").length + i) * 0.07}s` }}
                    >
                      {w}
                    </span>
                    {i < arr.length - 1 ? " " : ""}
                  </React.Fragment>
                ))}
              </strong>
            </h1>

            <p className="sp-hero-lead">{heroTripLead}</p>

            {heroFacts.length > 0 && (
              <dl className="sp-hero-facts">
                {heroFacts.map((f) => (
                  <div key={f.key}>
                    <dt>{f.label}</dt>
                    <dd>{f.big}</dd>
                  </div>
                ))}
              </dl>
            )}

            <ContactPillForm
              source={leadSource}
              idPrefix="sp-hero"
              className="sp-hero-form"
              note={
                <p className="sp-hero-note">
                  {es
                    ? "Te responde una coordinadora en menos de 24 h · Sin compromiso · Registro médico verificable"
                    : "A coordinator replies within 24 hours · No commitment · Verifiable medical registry"}
                </p>
              }
            />
          </div>

          <HeroVisual
            title={es ? "Tu viaje, resuelto" : "Your trip, handled"}
            doneLabel={es ? "Todo listo" : "All set"}
            steps={tripSteps}
            cover={heroImage}
            coverPosition={heroPosition}
            coverLabel={es ? "Especialista explicándole el plan a un paciente" : "A specialist walking a patient through the plan"}
          />
        </div>
      </header>

      {/* ========================= POR QUÉ EN COLOMBIA ========================= */}
      {why && (
        <section className="sp-why" id="por-que-colombia">
          {/* A deck of reasons: the front card is the current one, set around
              one large fact; the next ones wait behind it in depth, and a click
              sends the front card to the back. */}
          <div className="sp-wrap sp-deck">
            <div className="sp-deck-copy">
              <div className="sp-why-head" ref={whyRef}>
                <h2>
                  {es ? why.title : why.titleEn}
                  {(es ? why.titleStrong : why.titleStrongEn || why.titleStrong) && (
                    <>
                      {" "}
                      <strong>{es ? why.titleStrong : why.titleStrongEn || why.titleStrong}</strong>
                    </>
                  )}
                </h2>
                <p>{es ? why.lead : why.leadEn}</p>
              </div>

              <div className="sp-deck-tabs" role="tablist" aria-label={es ? "Razones" : "Reasons"}>
                {why.reasons.map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    id={`sp-deck-tab-${i}`}
                    aria-selected={i === scene}
                    aria-controls="sp-deck-panel"
                    className={`sp-deck-tab${i === scene ? " is-on" : ""}`}
                    onClick={() => setScene(i)}
                  >
                    {(es ? r.tab : r.tabEn || r.tab) || (es ? r.title : r.titleEn)}
                  </button>
                ))}
              </div>

              <div
                className="sp-deck-panel"
                id="sp-deck-panel"
                role="tabpanel"
                aria-labelledby={`sp-deck-tab-${scene}`}
                aria-live="polite"
              >
                <div key={scene} className="sp-deck-panel-in">
                  <h3>{es ? why.reasons[scene]?.title : why.reasons[scene]?.titleEn}</h3>
                  <p>{es ? why.reasons[scene]?.text : why.reasons[scene]?.textEn}</p>
                </div>
              </div>

              <div className="sp-deck-controls">
                <button
                  type="button"
                  className="sp-deck-nav"
                  aria-label={es ? "Razón anterior" : "Previous reason"}
                  onClick={() => setScene((scene - 1 + why.reasons.length) % why.reasons.length)}
                >
                  <span className="sp-deck-nav-prev"><Icon name="arrow" size={18} /></span>
                </button>
                <button
                  type="button"
                  className="sp-deck-nav"
                  aria-label={es ? "Razón siguiente" : "Next reason"}
                  onClick={() => setScene((scene + 1) % why.reasons.length)}
                >
                  <Icon name="arrow" size={18} />
                </button>
                <span className="sp-deck-count">
                  {String(scene + 1).padStart(2, "0")} / {String(why.reasons.length).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  className="sp-deck-cta"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    window.setTimeout(() => document.getElementById("sp-hero-name")?.focus({ preventScroll: true }), 500);
                  }}
                >
                  {es ? "Recibir mi cotización" : "Get my quote"}
                </button>
              </div>
            </div>

            <div
              className="sp-deck-stage"
              onTouchStart={(e) => {
                deckTouch.current = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                const start = deckTouch.current;
                deckTouch.current = null;
                if (start === null) return;
                const dx = e.changedTouches[0].clientX - start;
                if (Math.abs(dx) < 40) return;
                const n = why.reasons.length;
                setScene((scene + (dx < 0 ? 1 : -1) + n) % n);
              }}
            >
              {why.reasons.map((r, i) => {
                const n = why.reasons.length;
                const depth = (i - scene + n) % n;
                const stat = es ? r.stat : r.statEn || r.stat;
                return (
                  <button
                    key={i}
                    type="button"
                    className={`sp-deck-card is-depth-${Math.min(depth, 3)}`}
                    style={r.image ? { backgroundImage: `url(${r.image})` } : undefined}
                    onClick={() => setScene(depth === 0 ? (i + 1) % n : i)}
                    aria-hidden={depth !== 0}
                    tabIndex={depth === 0 ? 0 : -1}
                    aria-label={es ? "Ver la siguiente razón" : "See the next reason"}
                  >
                    <span className="sp-deck-card-shade" aria-hidden="true" />
                    <span className="sp-deck-card-label" aria-hidden="true">
                      {stat ? (
                        <>
                          <strong>{stat}</strong>
                          <small>{es ? r.statLabel : r.statLabelEn || r.statLabel}</small>
                        </>
                      ) : (
                        <em>{es ? r.title : r.titleEn}</em>
                      )}
                    </span>
                  </button>
                );
              })}
              <span className="sp-deck-hint" aria-hidden="true">
                <span className="sp-deck-hint-click">
                  {es ? "Clic para ver la siguiente razón" : "Click to see the next reason"}
                </span>
                <span className="sp-deck-hint-tap">
                  {es ? "Toca para ver la siguiente razón" : "Tap to see the next reason"}
                </span>
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ======================== EL PROCEDIMIENTO ======================== */}
      {focus?.details ? (
        <>
        {/* What it is, then the stay as a track of days: the patient sees
            where each part of the trip falls before reading the details. */}
        <section className="sp-stay" id="procedimiento" ref={stayScrollRef}>
          <div className="sp-stay-pin">
          <div className="sp-wrap">
            <div className="sp-stay-head">
              <h2>
                {es
                  ? focus.details.question || `¿Qué es la ${focus.details.shortName || focusName.toLowerCase()}?`
                  : focus.details.questionEn ||
                    `What is ${focus.details.shortNameEn || focus.details.shortName || focusName.toLowerCase()}?`}
                {(es ? focus.details.tagline : focus.details.taglineEn || focus.details.tagline) && (
                  <>
                    {" "}
                    <strong>{es ? focus.details.tagline : focus.details.taglineEn || focus.details.tagline}</strong>
                  </>
                )}
              </h2>
              <p>{es ? focus.details.whatIs : focus.details.whatIsEn}</p>
            </div>

            {stay && (
              <div className="sp-stay-track" data-stay-track>
                <div
                  className="sp-stay-ticks"
                  style={{ gridTemplateColumns: `repeat(${stay.total}, minmax(0, 1fr))` }}
                  aria-hidden="true"
                >
                  {stay.ticks.map((t) => (
                    <span
                      key={t.col + t.label}
                      className={`sp-stay-tick${t.end ? " is-end" : ""}${t.col === 1 ? " is-start" : ""}`}
                      style={{ gridColumn: `${t.col} / span 1` }}
                    >
                      {t.label}
                    </span>
                  ))}
                </div>
                <div
                  className="sp-stay-bar"
                  style={{ gridTemplateColumns: `repeat(${stay.total}, minmax(0, 1fr))` }}
                  role="img"
                  aria-label={stay.summary}
                >
                  {[
                    { key: "surgery", span: 1 },
                    { key: "hotel", span: stay.hotelSpan },
                    { key: "home", span: stay.lastSpan },
                  ].map((seg, i) => (
                    <span key={seg.key} className={`sp-stay-seg is-${seg.key}`} style={{ gridColumn: `span ${seg.span}` }}>
                      <span className="sp-stay-fill" style={{ transform: `scaleX(${stayLive?.fill[i] ?? 1})` }} />
                    </span>
                  ))}
                  {/* The traveller: today's day, riding along the stay. */}
                  <span
                    className="sp-stay-marker"
                    style={{ left: `${stayProgress * 100}%` }}
                    aria-hidden="true"
                  >
                    {/* Slides from the marker's right to its left over the stay,
                        so it never pokes out past either end of the bar. */}
                    <span
                      className="sp-stay-marker-pill"
                      style={{ transform: `translate(${-stayProgress * 100}%, -50%)` }}
                    >
                      {es ? "Día" : "Day"} {stayLive?.label ?? 0}
                    </span>
                  </span>
                </div>
                <ol className="sp-stay-legend">
                  {stay.steps.map((st, i) => (
                    <li key={st.key} className={stayLive?.phase === i ? "is-active" : undefined}>
                      <span className="sp-stay-big">
                        <span className={`sp-stay-chip is-${st.key}`} aria-hidden="true" />
                        {st.big}
                      </span>
                      <strong>{st.title}</strong>
                      <p>{st.text}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {focus.idealFor && focus.idealFor.length > 0 && (
              <div className="sp-stay-fit">
                <h3>{es ? "Es para ti si tienes" : "It suits you if you have"}</h3>
                <ul>
                  {(es ? focus.idealFor : focus.idealForEn || focus.idealFor).map((item, k) => (
                    <li key={k}>
                      <Icon name="check" size={16} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          </div>
        </section>

        <section className="sp-proc">
          <div className="sp-wrap">
            <ChatQA
              es={es}
              items={[
                ...focus.details.concerns.map((c) => ({ q: es ? c.title : c.titleEn, a: es ? c.text : c.textEn })),
                ...extraFaqs.map((f) => ({ q: es ? f.q : f.qEn, a: es ? f.a : f.aEn })),
              ]}
              whatsappText={
                es
                  ? `Hola ${AGENT_NAME}, estoy viendo ${focusName} en la página de Bridge Care y tengo una pregunta.`
                  : `Hi ${AGENT_NAME}, I'm looking at ${focusName} on the Bridge Care site and I have a question.`
              }
            />
          </div>
        </section>
        </>
      ) : procedureDetails && procedureDetails.length > 0 ? (
        <>
          <section className="sp-sec sp-pick" id="tratamientos">
            <div className="sp-wrap">
              <ProcedurePicker
                procedures={procedureDetails}
                specialtyId={specialty.id}
                fallbackImage={specialty.image}
                es={es}
              />
            </div>
          </section>
          {faqs.length > 0 && (
            <section className="sp-proc" id="preguntas">
              <div className="sp-wrap">
                <ChatQA
                  es={es}
                  items={faqs.map((f) => ({ q: es ? f.q : f.qEn, a: es ? f.a : f.aEn }))}
                  whatsappText={
                    es
                      ? `Hola ${AGENT_NAME}, estoy viendo ${name} en la página de Bridge Care y tengo una pregunta.`
                      : `Hi ${AGENT_NAME}, I'm looking at ${specialty.nameEn || name} on the Bridge Care site and I have a question.`
                  }
                />
              </div>
            </section>
          )}
        </>
      ) : (
        procedures.length > 0 && (
          <section className="sp-sec sp-treatments" id="tratamientos">
            <div className="sp-wrap">
              <div className="sp-intro" ref={introRef}>
                <h2>{es ? "Qué podemos hacer" : "What we can do"}</h2>
              </div>
              <ul className="sp-plain-list">
                {procedures.map((p, i) => (
                  <li key={i}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )
      )}

      {/* ============================== RESULTADOS ============================== */}
      {/* On procedure pages the results live in the specialist's profile. */}
      {!doctor && beforeAfter && beforeAfter.length > 0 && (
        <section className="sp-sec sp-results" id="resultados">
          <div className="sp-wrap">
            <div className="sp-intro" ref={resultsRef}>
              <h2>{es ? "El resultado, sin retoques" : "The result, unretouched"}</h2>
              <p>
                {es
                  ? "Arrastra el control para ver el antes y el despues del mismo paciente. Todas las fotos son de casos reales, publicadas con su autorizacion."
                  : "Drag the control to see the same patient before and after. Every photo is a real case, published with the patient's permission."}
              </p>
            </div>

            <div className="sp-results-grid">
              {beforeAfter.map((item, i) => (
                <BeforeAfterFigure key={i} item={item} es={es} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================ ESPECIALISTA ============================ */}
      {doctor && (
        <section className="sp-doctor" id="especialista">
          <div className="sp-wrap sp-doctor-grid" ref={doctorRef}>
            <DoctorProfile
              doctor={doctor}
              es={es}
              surgical={surgical}
              hospital={focus ? (es ? focus.details?.hospital : focus.details?.hospitalEn) : undefined}
              results={beforeAfter}
              clinic={
                specialty.clinicDetails?.[0]
                  ? {
                      name: clinicName,
                      city: specialty.clinicDetails[0].name.match(/\(([^)]+)\)/)?.[1],
                      note: es ? specialty.clinicDetails[0].note : specialty.clinicDetails[0].noteEn,
                    }
                  : undefined
              }
            />
          </div>
        </section>
      )}

      {/* ============================ SUS PACIENTES ============================ */}
      <section className="sp-reviews" id="resenas">
        <div className="sp-wrap" ref={reviewsRef}>
          <PatientStories
            es={es}
            doctorName={doctor?.name}
            stories={(specialty.videoStories || []).filter((v) => matchesFocus(v.procedure))}
            procedure={{
              es: focus ? focus.name : name,
              en: focus ? focus.nameEn || focus.name : specialty.nameEn || name,
            }}
          />
        </div>
      </section>

      {/* =============================== CIUDAD =============================== */}
      {cityGuide && (
        <section className="sp-sec sp-city" id="ciudad">
          <div className="sp-wrap" ref={cityRef}>
            <CityStories guide={cityGuide} es={es} photo={cityPhoto && !cityPhotoBroken ? cityPhoto : undefined} />
          </div>
        </section>
      )}

      {/* =============================== CIERRE =============================== */}
      <section className="sp-close" id="tu-pase">
        <div className="sp-wrap" ref={closeRef}>
          <ClosingPass
            es={es}
            city={cityGuide?.city || heroCity}
            procedure={(() => {
              const p = focus
                ? es
                  ? focus.details?.shortName || focus.name
                  : focus.details?.shortNameEn || focus.nameEn || focus.name
                : es
                  ? name
                  : specialty.nameEn || name;
              return p.charAt(0).toUpperCase() + p.slice(1);
            })()}
            stay={
              stayMin && stayMax
                ? stayMin === stayMax
                  ? `${stayMin} ${es ? "días" : "days"}`
                  : `${stayMin} – ${stayMax} ${es ? "días" : "days"}`
                : undefined
            }
            doctor={doctor ? `${doctor.name.split(" ")[0]} ${doctor.name.split(" ").slice(-1)[0]}` : undefined}
            price={priceFrom}
            source={leadSource}
          />
        </div>
      </section>

      {/* ========================= OTROS PROCEDIMIENTOS ========================= */}
      {/* Not a section: one slim bar (design board AN2) with a thumbnail,
          the name, the price and the stay of each sibling procedure. */}
      {focus && linkedProcedures.length > 0 && (
        <section className="sp-more" id="otros-procedimientos" aria-label={es ? "Otros procedimientos" : "Other procedures"}>
          <div className="sp-wrap">
            <div className="sp-more-bar" ref={othersRef}>
              <p className="sp-more-label">
                {es ? "¿Te interesa otro " : "Interested in another "}
                <strong>{es ? "procedimiento?" : "procedure?"}</strong>
              </p>
              <ul className="sp-more-list">
                {linkedProcedures.map((p) => {
                  const days = (es ? p.recovery : p.recoveryEn || p.recovery)?.match(/(\d+)\s*[-–]\s*(\d+)|(\d+)/);
                  const stayDays = days
                    ? days[1]
                      ? `${days[1]} – ${days[2]} ${es ? "días" : "days"}`
                      : `${days[3]} ${es ? "días" : "days"}`
                    : "";
                  const label = (es ? p.name : p.nameEn || p.name).split(" ")[0];
                  return (
                    <li key={p.slug}>
                      <Link href={`/specialties/${specialty.id}/${p.slug}`} className="sp-more-item">
                        <span
                          className="sp-more-img"
                          style={{ backgroundImage: `url(${p.photo || specialty.image})` }}
                          aria-hidden="true"
                        />
                        <span className="sp-more-text">
                          <strong>{label}</strong>
                          <span>
                            {p.priceFrom && `${es ? "Desde" : "From"} ${p.priceFrom.replace(/\s*USD\s*$/i, "")}`}
                            {p.priceFrom && stayDays && " · "}
                            {stayDays}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ====================================================================== */}
      <style jsx>{`
        .sp {
          --sp-ink: var(--blanco-hueso);
          --sp-muted: var(--gris-texto);
          --sp-rule: rgba(29, 122, 110, 0.16);
          --sp-rule-soft: rgba(29, 122, 110, 0.09);
          --sp-ease: cubic-bezier(0.22, 1, 0.36, 1);
          display: block;
          overflow-x: clip;
        }

        .sp-wrap {
          width: 100%;
          max-width: 1240px;
          margin: 0 auto;
          padding-inline: clamp(1.25rem, 5vw, 3rem);
        }

        .sp-sec {
          padding-block: clamp(5rem, 11vw, 9rem);
        }

        /* Section openers. One shape, used sparingly: a wide heading and, when
           the section needs it, a lead. No labels above it. */
        .sp-intro {
          max-width: 72ch;
          margin-bottom: clamp(3rem, 6vw, 4.5rem);
        }
        .sp-intro h2 {
          max-width: 21ch;
          font-size: clamp(2rem, 4.4vw, 3.4rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.05;
          text-wrap: balance;
          color: var(--teal-dark);
          margin: 0;
        }
        .sp-intro p {
          max-width: 62ch;
          margin-top: 1.5rem;
          font-size: 1.05rem;
          line-height: 1.7;
          color: var(--sp-muted);
        }

        /* Entrances: one shared settle, only on the blocks that open a section. */
        .sp-intro,
        .sp-why-head,
        .sp-price-note,
        .sp-doctor-grid,
        .sp-city-grid,
        .sp-reviews-head,
        .sp-ask,
        .sp-close-inner {
          opacity: 0;
          transform: translateY(18px);
          transition:
            opacity 0.7s var(--sp-ease),
            transform 0.7s var(--sp-ease);
        }
        .sp-intro[data-in],
        .sp-why-head[data-in],
        .sp-price-note[data-in],
        .sp-doctor-grid[data-in],
        .sp-city-grid[data-in],
        .sp-reviews-head[data-in],
        .sp-ask[data-in],
        .sp-close-inner[data-in] {
          opacity: 1;
          transform: none;
        }

        /* ================================ HERO ================================ */
        /* The trip hero: warm ground, the promise on the left with the lead
           form as one bar, and on the right the consultation with the trip
           itinerary laid over it. One screen tall on desktop; every size is
           clamped against the viewport height as well as its width. */
        .sp-hero {
          display: flex;
          align-items: center;
          min-height: 100vh;
          min-height: 100svh;
          padding-block: calc(4.5rem + clamp(0.75rem, 3vh, 2.25rem)) clamp(1.25rem, 4vh, 3rem);
          background: var(--negro-suave);
        }
        .sp-hero-inner {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
          align-items: center;
          gap: clamp(2.5rem, 4.5vw, 4rem);
          width: 100%;
          max-width: 1240px;
          margin: 0 auto;
          padding-inline: clamp(1.25rem, 5vw, 3rem);
        }
        .sp-hero-copy {
          display: flex;
          flex-direction: column;
          gap: clamp(0.9rem, 2.6vh, 1.6rem);
        }
        .sp-hero-copy > :global(*) {
          opacity: 0;
          animation: sp-rise 0.9s var(--sp-ease) forwards;
        }
        .sp-hero-copy > :global(:nth-child(1)) {
          animation-delay: 0.1s;
        }
        .sp-hero-copy > :global(:nth-child(2)) {
          animation-delay: 0.2s;
        }
        .sp-hero-copy > :global(:nth-child(3)) {
          animation-delay: 0.3s;
        }
        .sp-hero-copy > :global(:nth-child(4)) {
          animation-delay: 0.4s;
        }
        @keyframes sp-rise {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        .sp-hero-title {
          max-width: 16ch;
          margin: 0;
          color: #101a18;
          -webkit-text-fill-color: currentColor;
          background: none;
          font-family: "Manrope", var(--font-sans);
          font-size: clamp(2.3rem, min(5vw, 8.5vh), 4.9rem);
          font-weight: 300;
          letter-spacing: -0.045em;
          line-height: 1.02;
          text-wrap: balance;
        }
        .sp-hero-title strong {
          color: var(--teal-dark);
          font-weight: 700;
        }
        /* The title arrives word by word (the block itself doesn't rise). */
        .sp-hero-copy > :global(.sp-hero-title) {
          opacity: 1;
          animation: none;
        }
        .sp-hero-title :global(.hero-word) {
          display: inline-block;
          opacity: 0;
          filter: blur(8px);
          transform: translateY(0.35em);
          animation: sp-word 0.9s var(--sp-ease) forwards;
        }
        @keyframes sp-word {
          to {
            opacity: 1;
            filter: none;
            transform: none;
          }
        }
        .sp-hero-lead {
          max-width: 46ch;
          margin: 0;
          color: var(--sp-muted);
          font-size: clamp(1rem, min(1.35vw, 2.4vh), 1.25rem);
          line-height: 1.55;
          text-wrap: pretty;
        }

        /* <dt> first in the markup (valid <dl>); the number shows on top. */
        .sp-hero-facts {
          display: flex;
          gap: clamp(1.5rem, 3vw, 2.75rem);
          margin: 0;
          padding-block: clamp(0.75rem, 2.2vh, 1.25rem);
          border-block: 1px solid var(--sp-rule);
        }
        .sp-hero-facts > div {
          display: flex;
          flex-direction: column-reverse;
          gap: 0.3rem;
        }
        .sp-hero-facts dd {
          margin: 0;
          color: var(--teal-dark);
          font-family: "Manrope", var(--font-sans);
          font-size: clamp(1.8rem, min(2.8vw, 5vh), 2.5rem);
          font-weight: 300;
          letter-spacing: -0.04em;
          line-height: 1;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }
        .sp-hero-facts dt {
          color: var(--sp-muted);
          font-size: 0.85rem;
        }
        .sp-hero-copy :global(.sp-hero-note) {
          margin: 0;
          color: var(--sp-muted);
          font-size: 0.82rem;
        }


        /* ============================= TRATAMIENTOS ============================= */
        .sp-treatments {
          background: var(--negro-suave);
        }

        .sp-treat {
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
          gap: clamp(2rem, 6vw, 5.5rem);
          align-items: start;
        }

        .sp-treat-media {
          position: sticky;
          top: clamp(5.5rem, 13vh, 7rem);
        }
        .sp-treat-col {
          min-width: 0;
        }
        .sp-treat-frame {
          position: relative;
          aspect-ratio: 4 / 5;
          max-height: min(58vh, 520px);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 26px 60px rgba(10, 74, 66, 0.22);
        }
        .sp-treat-photo {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transform: scale(1.05);
          transition:
            opacity 0.8s var(--sp-ease),
            transform 1.1s var(--sp-ease);
        }
        .sp-treat-photo.is-active {
          opacity: 1;
          transform: scale(1);
        }
        .sp-treat-veil {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(6, 40, 36, 0.08) 0%,
            rgba(6, 40, 36, 0.28) 46%,
            rgba(6, 40, 36, 0.9) 100%
          );
        }
        .sp-treat-readout {
          position: absolute;
          inset: auto 0 0 0;
          padding: clamp(1.25rem, 3vw, 2rem);
          color: #fff;
        }
        .sp-treat-count {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          font-variant-numeric: tabular-nums;
          color: var(--mint-light);
        }
        .sp-treat-count i {
          font-style: normal;
          color: rgba(255, 255, 255, 0.55);
        }
        .sp-treat-readout strong {
          display: block;
          font-size: clamp(1.15rem, 2vw, 1.5rem);
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1.2;
          animation: sp-readout 0.5s var(--sp-ease);
        }
        @keyframes sp-readout {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
        }
        .sp-treat-bars {
          display: flex;
          gap: 5px;
          margin-top: 1.1rem;
        }
        .sp-treat-bars span {
          height: 3px;
          flex: 1;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.3);
          transition: background 0.4s ease;
        }
        .sp-treat-bars span.is-active {
          background: var(--mint-light);
        }

        .sp-treat-list {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .sp-treat-item {
          padding-block: clamp(2.5rem, 6vw, 4.5rem);
          border-top: 1px solid var(--sp-rule-soft);
        }
        .sp-treat-item:first-child {
          border-top: 0;
          padding-top: 0;
        }
        .sp-treat-item.is-active {
          opacity: 1;
        }
        /* The focus signal rides on the heading and the index only. Body copy
           never dims: at the contrast a 0.45 veil produces it would drop to
           roughly 2:1 against the bone background. */
        .sp-treat-index {
          display: block;
          margin-bottom: 0.9rem;
          color: var(--teal-primary);
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          font-variant-numeric: tabular-nums;
          opacity: 0.6;
          transition: opacity 0.5s var(--sp-ease);
        }
        .sp-treat-item.is-active .sp-treat-index {
          opacity: 1;
        }
        .sp-treat-item h3 {
          margin: 0 0 0.9rem;
          color: var(--teal-dark);
          opacity: 0.6;
          transition: opacity 0.5s var(--sp-ease);
          font-size: clamp(1.4rem, 2.6vw, 2rem);
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.12;
        }
        .sp-treat-item.is-active h3 {
          opacity: 1;
        }
        .sp-treat-item p {
          max-width: 56ch;
          margin: 0;
          color: var(--sp-muted);
          font-size: 1.01rem;
          line-height: 1.7;
        }
        .sp-treat-meta {
          display: flex;
          flex-wrap: wrap;
          gap: clamp(1.25rem, 4vw, 2.75rem);
          margin: clamp(1.5rem, 3vw, 2rem) 0 0;
          padding-top: 1.25rem;
          border-top: 1px solid var(--sp-rule-soft);
        }
        .sp-treat-meta dt {
          color: var(--sp-muted);
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }
        .sp-treat-meta dd {
          margin: 0.35rem 0 0;
          color: var(--teal-dark);
          font-size: 1.02rem;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
        }
        .sp-treat-meta dd.sp-treat-price {
          color: var(--teal-primary);
        }

        .sp-treat-ideal {
          margin-top: clamp(1.5rem, 3vw, 2rem);
        }
        .sp-treat-ideal h4 {
          margin: 0 0 0.8rem;
          color: var(--teal-dark);
          font-size: 0.95rem;
          font-weight: 600;
        }
        .sp-treat-ideal ul {
          display: grid;
          gap: 0.6rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .sp-treat-ideal li {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          color: var(--sp-muted);
          font-size: 0.98rem;
          line-height: 1.55;
        }
        .sp-treat-ideal li :global(svg) {
          flex-shrink: 0;
          margin-top: 0.2rem;
          color: var(--teal-primary);
        }
        .sp-treat-item :global(.sp-treat-link) {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          margin-top: 1.25rem;
          color: var(--teal-primary);
          font-size: 0.92rem;
          font-weight: 600;
          text-decoration: none;
          transition: gap 0.25s var(--sp-ease);
        }
        .sp-treat-item :global(.sp-treat-link:hover) {
          gap: 0.75rem;
        }

        /* ========================= POR QUÉ EN COLOMBIA ========================= */
        /* Compact and centred: the argument is the content, the photos only
           support it. */
        /* Exactly one screen on desktop, content centred in it. The header
           hides while scrolling down, so no space is reserved for it; every
           size is clamped against the viewport height, and the card photos
           take up whatever height is left so there's no empty band. */
        .sp-why {
          display: flex;
          align-items: center;
          min-height: 100vh;
          min-height: 100svh;
          padding-block: clamp(1rem, 4vh, 3.5rem);
          background: var(--negro-suave);
        }
        .sp-why > .sp-wrap {
          width: 100%;
        }
        .sp-deck {
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
          gap: clamp(2.5rem, 5vw, 4.5rem);
          align-items: center;
        }
        .sp-deck-copy {
          display: flex;
          flex-direction: column;
          gap: clamp(1.1rem, 3vh, 1.75rem);
        }
        .sp-why-head h2 {
          margin: 0 0 clamp(0.6rem, 1.6vh, 1rem);
          color: #101a18;
          font-family: "Manrope", var(--font-sans);
          font-size: clamp(2rem, min(4.1vw, 7vh), 4rem);
          font-weight: 300;
          letter-spacing: -0.04em;
          line-height: 1.04;
          text-wrap: balance;
        }
        .sp-why-head h2 strong {
          color: var(--teal-dark);
          font-weight: 700;
        }
        .sp-why-head p {
          max-width: 46ch;
          margin: 0;
          color: var(--sp-muted);
          font-size: clamp(0.98rem, min(1.25vw, 2.3vh), 1.12rem);
          line-height: 1.6;
          text-wrap: pretty;
        }

        .sp-deck-tabs {
          display: flex;
          gap: clamp(1.25rem, 2.5vw, 2rem);
          border-bottom: 1px solid var(--sp-rule);
        }
        .sp-deck-tab {
          margin-bottom: -1px;
          padding: 0 0 0.8rem;
          border: 0;
          border-bottom: 2px solid transparent;
          background: none;
          color: var(--sp-muted);
          font: inherit;
          font-size: 0.97rem;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          transition:
            color 0.3s ease,
            border-color 0.3s ease;
        }
        .sp-deck-tab:hover {
          color: var(--teal-dark);
        }
        .sp-deck-tab.is-on {
          border-bottom-color: var(--teal-dark);
          color: var(--teal-dark);
          font-weight: 700;
        }
        .sp-deck-panel {
          min-height: clamp(7rem, 17vh, 9.5rem);
        }
        .sp-deck-panel-in {
          animation: sp-deck-in 0.55s var(--sp-ease) both;
        }
        @keyframes sp-deck-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .sp-deck-panel h3 {
          margin: 0 0 0.55rem;
          color: var(--teal-dark);
          font-size: clamp(1.35rem, min(2vw, 3.4vh), 1.85rem);
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.15;
        }
        .sp-deck-panel p {
          max-width: 46ch;
          margin: 0;
          color: var(--sp-muted);
          font-size: 1rem;
          line-height: 1.6;
        }

        .sp-deck-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .sp-deck-nav {
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          border: 1px solid rgba(10, 74, 66, 0.2);
          border-radius: 50%;
          background: rgba(10, 74, 66, 0.05);
          color: var(--teal-dark);
          cursor: pointer;
          transition: background-color 0.25s ease;
        }
        .sp-deck-nav:hover {
          background: rgba(10, 74, 66, 0.12);
        }
        .sp-deck-nav-prev {
          display: flex;
          transform: rotate(180deg);
        }
        .sp-deck-count {
          margin-left: 0.4rem;
          color: var(--teal-primary);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          font-variant-numeric: tabular-nums;
        }
        .sp-deck-cta {
          margin-left: auto;
          padding: 0.95rem 1.6rem;
          border: 0;
          border-radius: 999px;
          background: var(--teal-dark);
          color: #fff;
          font: inherit;
          font-size: 0.97rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.25s ease;
        }
        .sp-deck-cta:hover {
          background: var(--teal-primary);
        }

        /* The deck: cards stacked in depth, the front one full size. */
        .sp-deck-stage {
          position: relative;
          height: clamp(360px, 64vh, 660px);
          perspective: 1600px;
        }
        .sp-deck-card {
          position: absolute;
          inset: 0 14% 0 0;
          padding: 0;
          overflow: hidden;
          border: 0;
          border-radius: 20px;
          background-color: var(--teal-dark);
          background-size: cover;
          background-position: center;
          box-shadow: 0 40px 80px -32px rgba(10, 40, 36, 0.45);
          cursor: pointer;
          transform-origin: left center;
          transition:
            transform 0.9s var(--sp-ease),
            opacity 0.7s ease,
            filter 0.7s ease;
        }
        .sp-deck-card.is-depth-0 {
          z-index: 3;
          transform: translate3d(0, 0, 0) rotateY(0deg);
        }
        .sp-deck-card.is-depth-1 {
          z-index: 2;
          opacity: 0.65;
          filter: saturate(0.75);
          transform: translate3d(14%, 0, -220px) rotateY(-14deg);
        }
        .sp-deck-card.is-depth-2 {
          z-index: 1;
          opacity: 0.35;
          filter: saturate(0.5);
          transform: translate3d(26%, 0, -420px) rotateY(-20deg);
        }
        .sp-deck-card.is-depth-3 {
          z-index: 0;
          opacity: 0;
          transform: translate3d(34%, 0, -560px) rotateY(-24deg);
        }
        .sp-deck-card-shade {
          position: absolute;
          inset: 45% 0 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 100%);
        }
        .sp-deck-card-label {
          position: absolute;
          left: clamp(1.5rem, 2.5vw, 2.25rem);
          right: clamp(1.5rem, 2.5vw, 2.25rem);
          bottom: clamp(1.5rem, 2.5vw, 2rem);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.3rem;
          color: #fff;
          text-align: left;
        }
        .sp-deck-card-label small {
          color: rgba(255, 255, 255, 0.86);
          font-size: 1rem;
          font-weight: 500;
          letter-spacing: 0;
        }
        .sp-deck-card-label strong {
          font-family: "Manrope", var(--font-sans);
          font-size: clamp(3.5rem, min(6.5vw, 11vh), 6rem);
          font-weight: 300;
          letter-spacing: -0.05em;
          line-height: 0.9;
          font-variant-numeric: tabular-nums;
        }
        .sp-deck-card-label em {
          max-width: 18ch;
          font-family: "Manrope", var(--font-sans);
          font-size: clamp(1.6rem, 2.6vw, 2.4rem);
          font-style: normal;
          font-weight: 600;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }
        .sp-deck-hint {
          position: absolute;
          right: 14%;
          bottom: -2rem;
          color: var(--sp-muted);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .sp-deck-hint-tap {
          display: none;
        }
        @media (hover: none) {
          .sp-deck-hint-click {
            display: none;
          }
          .sp-deck-hint-tap {
            display: inline;
          }
        }

        @media (max-width: 900px) {
          .sp-why {
            min-height: 0;
            padding-block: clamp(3rem, 8vw, 4rem);
          }
          /* Phones: title, then the deck, then the scene's text and controls,
             so the picture sits right where the story starts. */
          .sp-deck {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 1.25rem;
          }
          .sp-deck-copy {
            display: contents;
          }
          .sp-why-head {
            order: 1;
          }
          /* One card, full width, with the next ones tucked below it rather
             than fanned out to the right: symmetric on a narrow screen. */
          .sp-deck-stage {
            order: 2;
            height: auto;
            aspect-ratio: 5 / 4;
            max-height: 52svh;
            margin-bottom: 1.1rem;
            perspective: none;
            touch-action: pan-y;
          }
          .sp-deck-tabs {
            order: 3;
          }
          .sp-deck-panel {
            order: 4;
          }
          .sp-deck-controls {
            order: 5;
          }
          .sp-deck-card {
            inset: 0;
            border-radius: 18px;
            transform-origin: center bottom;
          }
          .sp-deck-card.is-depth-1 {
            opacity: 0.7;
            transform: translate3d(0, 9px, 0) scale(0.94);
          }
          .sp-deck-card.is-depth-2 {
            opacity: 0.4;
            transform: translate3d(0, 18px, 0) scale(0.88);
          }
          .sp-deck-card.is-depth-3 {
            transform: translate3d(0, 18px, 0) scale(0.88);
          }
          .sp-deck-card-label {
            left: 1.25rem;
            right: 1.25rem;
            bottom: 1.15rem;
          }
          .sp-deck-card-label strong {
            font-size: clamp(3rem, 16vw, 4.25rem);
          }
          /* The reason's title sits right below the card on a phone, so
             the card doesn't repeat it; a figure (20+, $0…) still shows. */
          .sp-deck-card-label em {
            display: none;
          }
          /* The tabs already say which reason is on and let you jump; a
             swipe moves the deck. Arrows, counter and hint would repeat it. */
          .sp-deck-hint,
          .sp-deck-nav,
          .sp-deck-count {
            display: none;
          }
          .sp-deck-tabs {
            gap: 1.25rem;
            overflow-x: auto;
            scrollbar-width: none;
          }
          .sp-deck-tab {
            flex-shrink: 0;
            padding-top: 0.35rem;
            white-space: nowrap;
          }
          .sp-deck-panel {
            min-height: 0;
          }
          .sp-deck-cta {
            width: 100%;
            margin: 0.25rem 0 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .sp-deck-card,
          .sp-deck-panel-in {
            animation: none;
            transition: none;
          }
        }

        /* Scroll magnet (desktop only): if the reader stops close to the start
           of the hero or the "why Colombia" screen, the page settles onto it,
           so a full-screen block is never left half showing the previous one.
           "proximity" only acts near those points; everywhere else scrolling
           is untouched. The pinned stay section deliberately has no snap
           point: one at its start pulled short scrolls back to the top of it,
           so it took several scrolls to get through. Scoped to this page
           because styled-jsx removes the rule when the page unmounts. */
        @media (min-width: 901px) {
          :global(html) {
            scroll-snap-type: y proximity;
          }
          .sp-hero,
          .sp-why {
            scroll-snap-align: start;
          }
        }

        /* =========================== EL PROCEDIMIENTO =========================== */
        /* ============================ TU ESTADÍA ============================ */
        /* One screen on desktop, like the "why Colombia" block: the top
           padding clears the header, and every size is clamped against the
           viewport height so a short laptop screen shrinks it rather than
           cutting it. */
        .sp-stay {
          position: relative;
          background: var(--negro-suave);
        }
        .sp-stay-pin {
          display: flex;
          align-items: center;
          min-height: 100vh;
          min-height: 100svh;
          padding-block: calc(4.5rem + 2vh) clamp(1.5rem, 4vh, 3rem);
        }
        .sp-stay-pin > .sp-wrap {
          width: 100%;
        }
        /* Desktop: the section is taller than the screen and its content stays
           pinned while you scroll through it; that scroll walks the stay day
           by day on the track below. */
        @media (min-width: 901px) {
          .sp-stay {
            height: 170vh;
          }
          .sp-stay-pin {
            position: sticky;
            top: 0;
          }
        }

        .sp-stay-head {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
          gap: clamp(2rem, 5vw, 5rem);
          align-items: end;
          margin-bottom: clamp(1.25rem, 4vh, 3.75rem);
        }
        .sp-stay-head h2 {
          margin: 0;
          color: #101a18;
          -webkit-text-fill-color: currentColor;
          background: none;
          font-family: "Manrope", var(--font-sans);
          font-size: clamp(2rem, min(4.4vw, 7vh), 4rem);
          font-weight: 300;
          letter-spacing: -0.04em;
          line-height: 1.04;
          text-wrap: balance;
        }
        .sp-stay-head h2 strong {
          color: var(--teal-dark);
          font-weight: 700;
        }
        .sp-stay-head p {
          margin: 0;
          color: var(--sp-muted);
          font-size: clamp(0.95rem, min(1.3vw, 2.2vh), 1.15rem);
          line-height: 1.6;
          text-wrap: pretty;
        }

        .sp-stay-ticks,
        .sp-stay-bar {
          display: grid;
          gap: 6px;
        }
        .sp-stay-ticks {
          margin-bottom: clamp(0.4rem, 1vh, 0.75rem);
        }
        .sp-stay-tick {
          color: #8a918f;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          white-space: nowrap;
        }
        .sp-stay-tick.is-start {
          color: var(--teal-dark);
          text-transform: uppercase;
        }
        .sp-stay-tick.is-end {
          text-align: right;
        }
        .sp-stay-bar {
          height: clamp(40px, min(7vw, 9vh), 88px);
        }
        .sp-stay-seg,
        .sp-stay-chip {
          border-radius: 14px;
        }
        .sp-stay-bar {
          position: relative;
        }
        .sp-stay-seg {
          position: relative;
          overflow: hidden;
        }
        .sp-stay-fill {
          position: absolute;
          inset: 0;
          transform-origin: left center;
          will-change: transform;
        }
        .sp-stay-seg.is-surgery {
          background: rgba(10, 74, 66, 0.1);
        }
        .sp-stay-seg.is-surgery .sp-stay-fill,
        .sp-stay-chip.is-surgery {
          background: var(--teal-dark);
        }
        .sp-stay-seg.is-hotel {
          background: rgba(29, 122, 110, 0.07);
        }
        .sp-stay-seg.is-hotel .sp-stay-fill,
        .sp-stay-chip.is-hotel {
          background: #c3e2d8;
        }
        .sp-stay-seg.is-home,
        .sp-stay-chip.is-home {
          border: 2px dashed var(--teal-primary);
          box-sizing: border-box;
        }
        .sp-stay-seg.is-home .sp-stay-fill {
          background: #dcefe8;
        }
        .sp-stay-marker {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 2px;
          margin-left: -1px;
          background: #101a18;
          border-radius: 2px;
          pointer-events: none;
        }
        .sp-stay-marker-pill {
          position: absolute;
          top: 50%;
          left: 0;
          padding: 0.4rem 0.85rem;
          border-radius: 999px;
          background: #101a18;
          color: #fff;
          font-size: 0.85rem;
          font-weight: 700;
          white-space: nowrap;
          font-variant-numeric: tabular-nums;
          box-shadow: 0 10px 24px -10px rgba(0, 0, 0, 0.5);
        }
        .sp-stay-legend {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(1.5rem, 4vw, 3rem);
          margin: clamp(0.75rem, 2.2vh, 1.75rem) 0 0;
          padding: 0;
          list-style: none;
        }
        .sp-stay-legend li {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          opacity: 0.4;
          transition: opacity 0.45s ease;
        }
        .sp-stay-legend li.is-active {
          opacity: 1;
        }
        .sp-stay-big {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          color: var(--teal-dark);
          font-family: "Manrope", var(--font-sans);
          font-size: clamp(1.6rem, min(3.4vw, 5.5vh), 2.85rem);
          font-weight: 300;
          letter-spacing: -0.04em;
          line-height: 1.05;
          font-variant-numeric: tabular-nums;
        }
        .sp-stay-chip {
          flex-shrink: 0;
          width: 14px;
          height: 14px;
          border-radius: 4px;
        }
        .sp-stay-legend strong {
          color: #101a18;
          font-size: 1rem;
          font-weight: 700;
        }
        .sp-stay-legend p {
          margin: 0;
          max-width: 34ch;
          color: var(--sp-muted);
          font-size: 0.95rem;
          line-height: 1.55;
        }

        .sp-stay-fit {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1rem 1.5rem;
          margin-top: clamp(1.25rem, 4vh, 3.5rem);
          padding-top: clamp(0.9rem, 2.2vh, 1.9rem);
          border-top: 1px solid rgba(16, 26, 24, 0.1);
        }
        .sp-stay-fit h3 {
          margin: 0;
          color: #101a18;
          font-size: 1rem;
          font-weight: 700;
        }
        .sp-stay-fit ul {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .sp-stay-fit li {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.05rem;
          border-radius: 999px;
          background: #fff;
          color: #1d1d1f;
          font-size: 0.95rem;
          line-height: 1.3;
        }
        .sp-stay-fit li :global(svg) {
          flex-shrink: 0;
          color: var(--teal-primary);
        }

        @media (max-width: 900px) {
          .sp-stay-pin {
            min-height: 0;
            padding-block: clamp(3.5rem, 9vw, 4.5rem) clamp(1.75rem, 4.5vw, 2.25rem);
          }
          .sp-stay-head,
          .sp-stay-legend {
            grid-template-columns: 1fr;
          }
          .sp-stay-legend {
            gap: 1.5rem;
          }
          /* Narrow bars: keep only the first and last day labels. */
          .sp-stay-tick:not(.is-start):not(.is-end) {
            visibility: hidden;
          }
          .sp-stay-fit li {
            width: 100%;
            border-radius: 14px;
          }
        }

        /* ============================ DUDAS DEL PACIENTE ============================ */
        .sp-proc {
          padding-block: clamp(4rem, 8vw, 6.5rem);
          background: var(--negro-suave);
        }
        @media (max-width: 900px) {
          /* Half the old gaps around the questions chat. */
          .sp-proc {
            padding-top: 2rem;
            padding-bottom: 3.5rem;
          }
        }

        /* ========================= OTROS PROCEDIMIENTOS ========================= */
        .sp-others-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
          gap: 1rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .sp-others-grid :global(.sp-other) {
          display: flex;
          align-items: center;
          gap: 1rem;
          height: 100%;
          padding: 0.75rem 1.1rem 0.75rem 0.75rem;
          border: 1px solid var(--sp-rule);
          border-radius: var(--radius-md);
          color: var(--teal-dark);
          text-decoration: none;
          transition:
            border-color 0.25s ease,
            transform 0.3s var(--sp-ease);
        }
        .sp-others-grid :global(.sp-other:hover) {
          border-color: var(--teal-primary);
          transform: translateY(-2px);
        }
        .sp-other-img {
          flex-shrink: 0;
          width: 4.5rem;
          height: 4.5rem;
          border-radius: 12px;
          background-size: cover;
          background-position: center;
        }
        .sp-other-body {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 0.25rem;
        }
        .sp-other-body strong {
          font-size: 1rem;
          line-height: 1.3;
        }
        .sp-other-body span {
          color: var(--sp-muted);
          font-size: 0.85rem;
        }

        .sp-price-note {
          display: block;
          max-width: 58ch;
          margin: clamp(2.5rem, 5vw, 3.5rem) 0 0;
          padding-top: 1.75rem;
          border-top: 1px solid var(--sp-rule);
        }
        .sp-price-note p {
          margin: 0;
          color: var(--sp-muted);
          font-size: 0.95rem;
          line-height: 1.75;
          font-variant-numeric: tabular-nums;
        }

        .sp-plain-list {
          margin: 0;
          padding: 0;
          list-style: none;
          border-top: 1px solid var(--sp-rule-soft);
        }
        .sp-plain-list li {
          display: flex;
          align-items: baseline;
          gap: 1.5rem;
          padding-block: 1.5rem;
          border-bottom: 1px solid var(--sp-rule-soft);
          color: var(--teal-dark);
          font-size: clamp(1.1rem, 2vw, 1.5rem);
          font-weight: 600;
          letter-spacing: -0.02em;
        }
        .sp-plain-list span {
          color: var(--teal-primary);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          font-variant-numeric: tabular-nums;
        }

        /* ============================== ESPECIALISTA ============================== */
        .sp-doctor {
          display: flex;
          align-items: center;
          min-height: 100svh;
          padding-block: clamp(4.5rem, 9vh, 6rem) clamp(2rem, 5vh, 3.5rem);
          background: var(--negro-suave);
        }
        .sp-doctor > .sp-wrap {
          width: 100%;
        }
        @media (max-width: 900px) {
          .sp-doctor {
            min-height: 0;
            padding-top: 1.5rem;
          }
        }

        /* ================================ EL VIAJE ================================ */
        /* The trip as one horizontal line of stops: read at a glance, not
           scrolled through. */
        .sp-strip {
          position: relative;
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 1.5rem;
          margin: 0 0 clamp(3rem, 6vw, 4.5rem);
          padding: 0;
          list-style: none;
        }
        .sp-strip::before {
          content: "";
          position: absolute;
          top: 0.45rem;
          left: 0.45rem;
          right: 0;
          height: 1px;
          background: var(--sp-rule);
        }
        .sp-strip li {
          position: relative;
          padding-top: 1.75rem;
        }
        .sp-strip-dot {
          position: absolute;
          top: 0;
          left: 0;
          width: 0.9rem;
          height: 0.9rem;
          border: 2px solid var(--teal-primary);
          border-radius: 50%;
          background: var(--negro-suave);
        }
        .sp-strip li:first-child .sp-strip-dot {
          background: var(--teal-primary);
        }
        .sp-strip h3 {
          margin: 0 0 0.45rem;
          color: var(--teal-dark);
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          line-height: 1.25;
        }
        .sp-strip p {
          margin: 0;
          color: var(--sp-muted);
          font-size: 0.9rem;
          line-height: 1.55;
        }
        @media (max-width: 1100px) {
          .sp-strip {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            row-gap: 2.25rem;
          }
          .sp-strip::before {
            display: none;
          }
        }
        @media (max-width: 680px) {
          .sp-strip {
            grid-template-columns: 1fr;
            row-gap: 0;
          }
          .sp-strip li {
            padding: 0 0 1.4rem 1.75rem;
            border-left: 1px solid var(--sp-rule);
            margin-left: 0.45rem;
          }
          .sp-strip li:last-child {
            border-left-color: transparent;
            padding-bottom: 0;
          }
          .sp-strip-dot {
            left: -0.5rem;
          }
        }


        /* Small in-flow thumbnail: on a phone the pinned column is gone, so the
           photo travels with its own step instead. */


        .sp-ledger {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
          gap: clamp(2rem, 5vw, 4rem);
          padding-top: clamp(2.5rem, 5vw, 3.5rem);
          border-top: 1px solid var(--sp-rule);
        }
        .sp-ledger-col h3 {
          margin: 0 0 1.5rem;
          color: var(--teal-dark);
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .sp-ledger-list {
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 0.9rem;
        }
        .sp-ledger-list li {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 0.8rem;
          align-items: start;
          font-size: 0.97rem;
          line-height: 1.6;
        }
        .sp-ledger-list li :global(.ic) {
          margin-top: 3px;
        }
        .sp-yes li {
          color: var(--sp-ink);
        }
        .sp-yes li :global(.ic) {
          color: var(--teal-primary);
        }
        .sp-no li {
          color: var(--sp-muted);
        }
        .sp-no li :global(.ic) {
          color: rgba(81, 88, 86, 0.55);
        }

        /* ================================= CIUDAD ================================= */
        /* Desktop: the board inside sets the size (it is zoomed to the
           screen), so the section adds no padding or width cap. */
        .sp-city {
          padding-block: 0;
          background: var(--negro-suave);
        }
        .sp-city > .sp-wrap {
          max-width: none;
          padding-inline: 0;
        }
        @media (max-width: 900px) {
          .sp-city {
            padding-block: 3.5rem;
          }
          .sp-city > .sp-wrap {
            padding-inline: clamp(1.25rem, 5vw, 3rem);
          }
        }
        .sp-city-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 0.85fr);
          gap: clamp(2.5rem, 6vw, 5rem);
          align-items: center;
          margin-bottom: clamp(3.5rem, 7vw, 5rem);
        }
        .sp-city-text h2 {
          max-width: 16ch;
          margin: 0 0 1.75rem;
          color: var(--teal-dark);
          font-size: clamp(2rem, 4.2vw, 3.2rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.05;
          text-wrap: balance;
        }
        .sp-city-lead {
          max-width: 56ch;
          margin: 0;
          color: var(--sp-muted);
          font-size: 1.04rem;
          line-height: 1.72;
        }
        .sp-city-climate {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 0.75rem;
          align-items: start;
          max-width: 54ch;
          margin: 1.75rem 0 0;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(29, 122, 110, 0.18);
          color: var(--sp-muted);
          font-size: 0.94rem;
          line-height: 1.65;
        }
        .sp-city-climate :global(.ic) {
          margin-top: 2px;
          color: var(--teal-primary);
        }
        .sp-city-grid.is-solo {
          grid-template-columns: 1fr;
        }
        .sp-city-photo {
          position: relative;
          margin: 0;
          aspect-ratio: 4 / 5;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 24px 56px rgba(10, 74, 66, 0.2);
        }
        .sp-city-photo img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .sp-city-pin {
          position: absolute;
          left: 1.25rem;
          bottom: 1.25rem;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          background: rgba(6, 40, 36, 0.74);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: #fff;
          font-size: 0.82rem;
          font-weight: 600;
        }

        .sp-acts {
          max-width: 1020px;
          margin: 0;
          padding: 0;
          list-style: none;
          border-top: 1px solid rgba(29, 122, 110, 0.18);
        }
        .sp-acts li {
          display: grid;
          grid-template-columns: 3.5rem minmax(0, 22rem) minmax(0, 1fr);
          gap: clamp(1rem, 3vw, 2.5rem);
          align-items: baseline;
          padding-block: clamp(1.4rem, 3vw, 2rem);
          border-bottom: 1px solid rgba(29, 122, 110, 0.18);
        }
        .sp-acts-index {
          color: var(--teal-primary);
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          font-variant-numeric: tabular-nums;
        }
        .sp-acts h3 {
          margin: 0;
          color: var(--teal-dark);
          font-size: clamp(1.05rem, 1.8vw, 1.3rem);
          font-weight: 600;
          letter-spacing: -0.02em;
        }
        .sp-acts p {
          margin: 0;
          color: var(--sp-muted);
          font-size: 0.96rem;
          line-height: 1.65;
        }

        /* ================================ RESENAS ================================ */
        .sp-reviews {
          padding-block: clamp(3.5rem, 9vh, 6rem);
          background: var(--negro-suave);
          overflow: hidden;
        }
        .sp-reviews-head {
          display: flex;
          flex-wrap: wrap;
          align-items: end;
          justify-content: space-between;
          gap: 1.5rem 3rem;
          margin-bottom: clamp(2.5rem, 5vw, 3.5rem);
        }
        .sp-reviews-head h2 {
          max-width: 18ch;
          margin: 0;
          color: var(--teal-dark);
          font-size: clamp(2rem, 4.2vw, 3.2rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.05;
          text-wrap: balance;
        }
        .sp-reviews-score {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 0;
          padding-bottom: 0.4rem;
        }
        .sp-reviews-score strong {
          color: var(--teal-dark);
          font-size: 1.35rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          font-variant-numeric: tabular-nums;
        }
        .sp-reviews-score > span {
          max-width: 24ch;
          color: var(--sp-muted);
          font-size: 0.88rem;
          line-height: 1.5;
        }

        .sp-reviews-rail {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: minmax(280px, 25rem);
          gap: 1.25rem;
          margin: 0;
          padding: 0 clamp(1.25rem, 5vw, 3rem) 1.5rem;
          margin-inline: calc(clamp(1.25rem, 5vw, 3rem) * -1);
          list-style: none;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          overscroll-behavior-x: contain;
          scrollbar-width: thin;
          scrollbar-color: var(--teal-primary) transparent;
        }
        .sp-reviews-rail::-webkit-scrollbar {
          height: 6px;
        }
        .sp-reviews-rail::-webkit-scrollbar-track {
          background: rgba(29, 122, 110, 0.09);
          border-radius: 3px;
        }
        .sp-reviews-rail::-webkit-scrollbar-thumb {
          background: var(--teal-primary);
          border-radius: 3px;
        }

        .sp-review {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          padding: clamp(1.4rem, 2.5vw, 1.8rem);
          border-radius: var(--radius-md);
          background: var(--pure-white);
          scroll-snap-align: start;
          transition: transform 0.35s var(--sp-ease);
        }
        .sp-review:hover {
          transform: translateY(-3px);
        }
        .sp-review blockquote {
          flex: 1;
          margin: 0;
          color: var(--sp-ink);
          font-size: 0.97rem;
          line-height: 1.65;
        }
        .sp-review footer {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: center;
          gap: 0.7rem;
          padding-top: 0.9rem;
          border-top: 1px solid var(--sp-rule-soft);
        }
        .sp-review-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--teal-dark);
          color: #fff;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .sp-review-who {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .sp-review-who strong {
          color: var(--teal-dark);
          font-size: 0.92rem;
          font-weight: 600;
        }
        .sp-review-who > span {
          color: var(--sp-muted);
          font-size: 0.82rem;
        }
        .sp-review-tag {
          grid-column: 1 / -1;
          justify-self: start;
          padding: 0.28rem 0.7rem;
          border-radius: var(--radius-full);
          background: rgba(29, 122, 110, 0.1);
          color: var(--teal-primary);
          font-size: 0.74rem;
          font-weight: 600;
        }

        .sp-featured-quote {
          max-width: 44rem;
          margin: 0 auto;
          text-align: center;
        }
        .sp-featured-quote p {
          margin: 0;
          color: var(--teal-dark);
          font-size: clamp(1.4rem, 3.2vw, 2.1rem);
          font-weight: 500;
          letter-spacing: -0.025em;
          line-height: 1.34;
          text-wrap: balance;
        }
        .sp-featured-quote footer {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          margin-top: clamp(1.75rem, 3.5vw, 2.5rem);
        }
        .sp-featured-quote footer strong {
          color: var(--teal-dark);
          font-size: 0.95rem;
          font-weight: 600;
        }
        .sp-featured-quote footer span {
          color: var(--sp-muted);
          font-size: 0.86rem;
        }

        /* ============================== RESULTADOS ============================== */
        .sp-results {
          background: var(--verde-noche);
        }
        .sp-results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 26rem), 1fr));
          gap: clamp(2rem, 4vw, 3.5rem);
        }

        /* =============================== PREGUNTAS =============================== */
        .sp-faq {
          border-top: 1px solid var(--sp-rule);
        }
        .sp-faq-row {
          border-bottom: 1px solid var(--sp-rule);
        }
        .sp-faq-row h3 {
          margin: 0;
          font-size: inherit;
          font-weight: inherit;
        }
        .sp-faq-row button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          width: 100%;
          padding-block: clamp(1.35rem, 3vw, 1.8rem);
          border: 0;
          background: none;
          color: var(--teal-dark);
          font-family: inherit;
          font-size: clamp(1rem, 1.8vw, 1.2rem);
          font-weight: 600;
          letter-spacing: -0.015em;
          text-align: left;
          cursor: pointer;
          transition: color 0.25s ease;
        }
        .sp-faq-row button:hover {
          color: var(--teal-primary);
        }
        .sp-faq-sign {
          position: relative;
          flex-shrink: 0;
          width: 16px;
          height: 16px;
        }
        .sp-faq-sign::before,
        .sp-faq-sign::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 1.5px;
          border-radius: 2px;
          background: currentColor;
          transition: transform 0.4s var(--sp-ease);
        }
        .sp-faq-sign::after {
          transform: rotate(90deg);
        }
        .sp-faq-row.is-open .sp-faq-sign::after {
          transform: rotate(0deg);
        }
        .sp-faq-panel {
          padding-bottom: clamp(1.35rem, 3vw, 1.9rem);
        }
        .sp-faq-panel p {
          max-width: 68ch;
          margin: 0;
          color: var(--sp-muted);
          font-size: 1rem;
          line-height: 1.72;
          animation: sp-rise 0.45s var(--sp-ease);
        }

        .sp-ask {
          margin-top: clamp(4rem, 8vw, 6rem);
          padding-top: clamp(2.5rem, 5vw, 3.5rem);
          border-top: 1px solid var(--sp-rule);
        }
        .sp-ask-head h3 {
          max-width: 22ch;
          margin: 0 0 0.85rem;
          color: var(--teal-dark);
          font-size: clamp(1.3rem, 2.4vw, 1.8rem);
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.15;
        }
        .sp-ask-head p {
          max-width: 60ch;
          margin: 0 0 clamp(2rem, 4vw, 2.75rem);
          color: var(--sp-muted);
          font-size: 0.98rem;
          line-height: 1.68;
        }
        .sp-ask-list {
          columns: 2;
          column-gap: clamp(2rem, 5vw, 4rem);
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .sp-ask-list li {
          break-inside: avoid;
          margin-bottom: 1rem;
          padding-left: 1.4rem;
          position: relative;
          color: var(--sp-ink);
          font-size: 0.97rem;
          line-height: 1.6;
        }
        .sp-ask-list li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.62em;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--teal-primary);
        }

        /* ================================= CIERRE ================================= */
        /* ======================= OTROS PROCEDIMIENTOS (barra) ======================= */
        .sp-more {
          padding-block: clamp(1.5rem, 4vh, 3rem) clamp(3rem, 7vh, 5rem);
          background: var(--negro-suave);
        }
        .sp-more-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding: 1.1rem 1.4rem;
          border-radius: 999px;
          background: #fff;
          box-shadow: 0 20px 40px -32px rgba(10, 40, 36, 0.35);
        }
        .sp-more-label {
          margin: 0;
          padding-left: 0.75rem;
          color: var(--sp-muted);
          font-size: 1rem;
          white-space: nowrap;
        }
        .sp-more-label strong {
          color: #0a4a42;
        }
        .sp-more-list {
          display: flex;
          gap: 0.6rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .sp-more :global(.sp-more-item) {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem 0.5rem 0.5rem;
          border: 1px solid #e3ddd3;
          border-radius: 999px;
          background: #fff;
          color: #101a18;
          text-decoration: none;
          transition:
            transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 0.25s ease,
            border-color 0.2s ease;
        }
        .sp-more :global(.sp-more-item:hover) {
          border-color: #b9d6cd;
          box-shadow: 0 20px 40px -24px rgba(10, 40, 36, 0.35);
          transform: translateY(-3px);
        }
        .sp-more :global(.sp-more-item:focus-visible) {
          outline: 2px solid #1d7a6e;
          outline-offset: 3px;
        }
        .sp-more-img {
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          border-radius: 50%;
          background-color: #d8d0c3;
          background-position: center;
          background-size: cover;
        }
        .sp-more-text {
          display: flex;
          flex-direction: column;
        }
        .sp-more-text strong {
          font-size: 0.95rem;
          font-weight: 700;
        }
        .sp-more-text span {
          color: var(--sp-muted);
          font-size: 0.8rem;
          white-space: nowrap;
        }
        @media (max-width: 900px) {
          .sp-more-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 0.9rem;
            padding: 1.1rem;
            border-radius: 24px;
          }
          .sp-more-label {
            padding-left: 0.25rem;
            white-space: normal;
          }
          .sp-more-list {
            flex-direction: column;
          }
        }

        /* The boarding-pass close: the board inside sets the size on
           desktop (zoomed to the screen), so no padding or width cap. */
        .sp-close {
          display: flex;
          align-items: center;
          min-height: 100svh;
          padding-block: 0;
          background: var(--negro-suave);
        }
        .sp-close > .sp-wrap {
          width: 100%;
        }
        .sp-close > .sp-wrap {
          max-width: none;
          padding-inline: 0;
        }
        @media (max-width: 900px) {
          .sp-close {
            display: block;
            min-height: 0;
            padding-block: 3.5rem 4.5rem;
          }
          .sp-close > .sp-wrap {
            padding-inline: clamp(1.25rem, 5vw, 3rem);
          }
        }
        .sp-close-inner {
          text-align: center;
        }
        .sp-close h2 {
          max-width: 16ch;
          margin: 0 auto 1.25rem;
          color: var(--teal-dark);
          font-size: clamp(2rem, 4.6vw, 3.4rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.05;
          text-wrap: balance;
        }
        .sp-close p {
          max-width: 54ch;
          margin: 0 auto;
          color: var(--sp-muted);
          font-size: 1.04rem;
          line-height: 1.7;
        }
        .sp-close-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 1rem 2rem;
          margin-top: clamp(2.25rem, 4vw, 3rem);
        }
        .sp-close :global(.sp-close-btn) {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 1rem 2rem;
          border-radius: var(--radius-full);
          background: var(--teal-dark);
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          box-shadow: 0 12px 30px rgba(10, 74, 66, 0.26);
          transition:
            transform 0.3s var(--sp-ease),
            box-shadow 0.3s var(--sp-ease),
            background 0.3s ease;
        }
        .sp-close :global(.sp-close-btn:hover) {
          background: var(--teal-primary);
          transform: translateY(-2px);
          box-shadow: 0 18px 38px rgba(10, 74, 66, 0.32);
        }
        .sp-close :global(.sp-close-alt) {
          color: var(--teal-primary);
          font-size: 0.97rem;
          font-weight: 600;
          text-decoration: none;
          border-bottom: 1px solid rgba(29, 122, 110, 0.35);
          padding-bottom: 2px;
          transition: border-color 0.25s ease;
        }
        .sp-close :global(.sp-close-alt:hover) {
          border-color: var(--teal-primary);
        }

        /* =============================== RESPONSIVE =============================== */
        /* Hero keeps text and form side by side down to 900px (small laptops,
           tablets in landscape); below that they stack. */
        @media (max-width: 900px) {
          .sp-hero {
            min-height: 0;
          }
          .sp-hero-inner {
            grid-template-columns: 1fr;
          }

        }

        /* Big monitors: the type and cards are capped in rem so they don't
           balloon, which on a 2K/4K screen leaves them floating in empty
           space. Scale the two full-screen blocks up as a whole instead. */
        @media (min-width: 1800px) and (min-height: 1000px) {
          .sp-hero-inner,
          .sp-why > .sp-wrap,
          .sp-stay-pin > .sp-wrap {
            zoom: 1.12;
          }
        }
        @media (min-width: 2200px) and (min-height: 1250px) {
          .sp-hero-inner,
          .sp-why > .sp-wrap,
          .sp-stay-pin > .sp-wrap {
            zoom: 1.4;
          }
        }

        @media (max-width: 1024px) {
          .sp-treat,
          .sp-city-grid {
            grid-template-columns: 1fr;
          }
          .sp-treat-media {
            position: relative;
            top: 0;
            margin-bottom: 2.5rem;
          }
          .sp-treat-frame {
            aspect-ratio: 16 / 11;
            max-height: none;
          }
          .sp-city-photo {
            aspect-ratio: 16 / 10;
          }
          .sp-acts li {
            grid-template-columns: 3rem 1fr;
          }
          .sp-acts p {
            grid-column: 2;
          }
        }

        @media (max-width: 680px) {
          .sp-hero {
            min-height: 0;
          }
          .sp-close :global(.sp-close-btn) {
            width: 100%;
            justify-content: center;
          }
          .sp-treat-meta {
            gap: 1rem 1.75rem;
          }
          .sp-ask-list {
            columns: 1;
          }
          .sp-reviews-head {
            align-items: start;
          }
          .sp-close-actions {
            flex-direction: column;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sp-hero-copy > :global(*),
          .sp-hero-copy > :global(.sp-hero-title .hero-word),
          .sp-treat-readout strong,
          .sp-faq-panel p {
            animation: none;
            opacity: 1;
            transform: none;
          }
          .sp-intro,
          .sp-why-head,
          .sp-price-note,
          .sp-doctor-grid,
          .sp-city-grid,
          .sp-reviews-head,
          .sp-ask,
          .sp-close-inner {
            opacity: 1;
            transform: none;
            transition: none;
          }
          .sp-treat-item h3,
          .sp-treat-index {
            opacity: 1;
            transition: none;
          }
          .sp-review {
            transition: none;
          }
          .sp-review:hover {
            transform: none;
          }
          .sp-close :global(.sp-close-btn:hover) {
            transform: none;
          }
        }
      `}</style>
    </article>
  );
}
