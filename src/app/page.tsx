"use client";

import React, { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import ContactCta from "@/components/ContactCta";
import HowItWorks from "@/components/HowItWorks";
import SpecialtiesIndex from "@/components/SpecialtiesIndex";
import WhyColombia from "@/components/WhyColombia";
import SpotlightBand from "@/components/SpotlightBand";

// Live OS "reduce motion" setting. useSyncExternalStore rather than an effect
// + setState, so it is correct on the first client render and follows the
// visitor if they flip the setting while the page is open.
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  );
}

// Hero typewriter phrases. Module-level so render can show a static phrase
// when motion is reduced, not only the effect that types them.
const HERO_PHRASES_ES = [
  "TU TRATAMIENTO MÉDICO, TODO GESTIONADO.",
  "VUELO, CONSULTA Y HOTEL. TODO INCLUIDO.",
  "MÉDICOS AVALADOS, RESULTADOS REALES.",
  "DEL DIAGNÓSTICO A TU RECUPERACIÓN.",
  "TURISMO MÉDICO SEGURO EN COLOMBIA."
];
const HERO_PHRASES_EN = [
  "YOUR MEDICAL TREATMENT, ALL MANAGED.",
  "FLIGHT, CONSULTATION, AND HOTEL. ALL INCLUDED.",
  "CERTIFIED DOCTORS, REAL RESULTS.",
  "FROM DIAGNOSIS TO YOUR RECOVERY.",
  "SAFE MEDICAL TOURISM IN COLOMBIA."
];

export default function Home() {
  const { language, t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const heroVideoRef = useRef<HTMLVideoElement>(null);


  const [mounted, setMounted] = useState(false);
  const [typedPart2, setTypedPart2] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset typewriter when language changes (during render, not in an effect
  // — same reasoning as the other resets above).
  const [lastTypewriterLang, setLastTypewriterLang] = useState(language);
  if (lastTypewriterLang !== language) {
    setLastTypewriterLang(language);
    setTypedPart2("");
    setIsDeleting(false);
    setPhraseIndex(0);
  }

  // Under reduced motion the hero shows its first phrase, static.
  const heroText = reducedMotion
    ? (language === "es" ? HERO_PHRASES_ES : HERO_PHRASES_EN)[0]
    : typedPart2;

  // The hero video is ambient motion: pause it (poster frame stays) when the
  // visitor has asked the OS to reduce motion.
  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    if (reducedMotion) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  }, [reducedMotion]);

  useEffect(() => {
    if (!mounted || reducedMotion) return;

    const currentPhrases = language === "es" ? HERO_PHRASES_ES : HERO_PHRASES_EN;
    const currentPhrase = currentPhrases[phraseIndex % currentPhrases.length];
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      timer = setTimeout(() => {
        setTypedPart2((prev) => prev.slice(0, -1));
      }, 30); // Fluid delete speed
    } else {
      timer = setTimeout(() => {
        setTypedPart2((prev) => {
          if (prev.length < currentPhrase.length) {
            return currentPhrase.slice(0, prev.length + 1);
          }
          return prev;
        });
      }, 75); // Fluid typing speed
    }

    if (!isDeleting && typedPart2 === currentPhrase) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2500); // Wait 2.5s before deleting
    } else if (isDeleting && typedPart2 === "") {
      // Wrapped in the same kind of timer as the branches above — keeps the
      // state transition inside a callback instead of directly in the
      // effect body, and there's no reason for it to be instantaneous
      // anyway (mirrors the tiny pause a real typing cursor would have).
      timer = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % currentPhrases.length);
      }, 0);
    }

    return () => clearTimeout(timer);
  }, [language, mounted, reducedMotion, typedPart2, isDeleting, phraseIndex]);

  useEffect(() => {
    // Several effects below are gated on `mounted` so they only run
    // client-side: the standard "hasMounted" exception to this lint rule.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);





  // Inline testimonials translation helper
  const testimonials = [
    {
      id: 1,
      stars: "★★★★★",
      textEs: `"Viajar a Medellín para mi diseño de sonrisa fue la mejor decisión. Ahorré más del 60% en comparación con Miami y la tecnología de la clínica dental me dejó impresionada. El equipo de Bridge Care me acompañó desde el primer día."`,
      textEn: `"Traveling to Medellin for my smile design was the best decision. I saved over 60% compared to Miami, and the dental clinic's technology was impressive. The Bridge Care team supported me from day one."`,
      name: "Sarah Jenkins",
      originEs: "Miami, EE. UU. (Tratamiento Odontológico)",
      originEn: "Miami, USA (Dental Treatment)"
    },
    {
      id: 2,
      stars: "★★★★★",
      textEs: `"Mi cirugía bariátrica en Cali fue un éxito rotundo. El cirujano es de primera categoría y la clínica Valle del Lili cuenta con estándares de seguridad increíbles. Bajé 35 kilos y recuperé mi salud. ¡Altamente recomendado!"`,
      textEn: `"My bariatric surgery in Cali was an absolute success. The surgeon is top-notch, and the Valle del Lili clinic has incredible safety standards. I lost 77 lbs (35 kg) and got my health back. Highly recommended!"`,
      name: "David L. Miller",
      originEs: "New York, EE. UU. (Bypass Gástrico)",
      originEn: "New York, USA (Gastric Bypass)"
    },
    {
      id: 3,
      stars: "★★★★★",
      textEs: `"Me realicé una lipoescultura y abdominoplastia en Bogotá. Estaba muy nerviosa de viajar sola, pero Bridge Care se encargó de toda la logística, enfermería y traslados. El hotel de recuperación era fabuloso. ¡Un servicio de 5 estrellas!"`,
      textEn: `"I underwent liposculpture and a tummy tuck in Bogota. I was very nervous about traveling alone, but Bridge Care took care of all logistics, nursing, and transfers. The recovery hotel was fabulous. 5-star service!"`,
      name: "Elena Rodriguez",
      originEs: "Madrid, España (Cirugía Estética)",
      originEn: "Madrid, Spain (Plastic Surgery)"
    }
  ];

  return (
    <>
      <div className="home-container">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        {/* Background media wrapper */}
        <div className="hero-bg-wrapper">
          <video
            ref={heroVideoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/hero-video-poster.jpg"
            className="hero-video"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay"></div>
        </div>

        {/* Content wrapper */}
        <div className="hero-content-wrapper">
          <div className="container hero-content-grid">
            
            {/* LEFT COLUMN */}
            <div className="hero-column-left">
              {/* Top part: Main Title and Typewriter */}
              <div className="hero-title-container animate-fade-in">
                <h1>
                  {t("hero.title.part1")}
                  <span className="highlight-color">
                    {heroText}
                    <span className="cursor-blink" aria-hidden="true">_</span>
                  </span>
                </h1>
              </div>

              {/* Bottom part: Three Vertical Features */}
              <div className="hero-features-list animate-fade-in" style={{ animationDelay: "0.15s", animationFillMode: "backwards" }}>

                {/* Feature 1: Ahorro Promedio */}
                <div className="hero-feature-item">
                  <div className="hero-feature-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hero-feature-icon" width={26} height={26}>
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <div className="hero-feature-content">
                    <h3 className="hero-feature-title">{t("hero.feature1.title")}</h3>
                    <p className="hero-feature-desc">{t("hero.feature1.desc")}</p>
                  </div>
                </div>

                {/* Feature 2: Procedimientos Gestionados */}
                <div className="hero-feature-item">
                  <div className="hero-feature-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hero-feature-icon" width={26} height={26}>
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                  </div>
                  <div className="hero-feature-content">
                    <h3 className="hero-feature-title">{t("hero.feature2.title")}</h3>
                    <p className="hero-feature-desc">{t("hero.feature2.desc")}</p>
                  </div>
                </div>

                {/* Feature 3: Acompañamiento 24/7 */}
                <div className="hero-feature-item">
                  <div className="hero-feature-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hero-feature-icon" width={26} height={26}>
                      <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                    </svg>
                  </div>
                  <div className="hero-feature-content">
                    <h3 className="hero-feature-title">{t("hero.feature3.title")}</h3>
                    <p className="hero-feature-desc">{t("hero.feature3.desc")}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="hero-column-right">
              {/* Bottom part: Tagline and CTA Pill Button */}
              <div className="hero-right-bottom animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}>
                <p className="hero-right-tagline">
                  {t("hero.right.tagline").split("\n").map((line, index) => (
                    <span key={index} className="tagline-span">
                      {line}
                    </span>
                  ))}
                </p>
                
                <div className="hero-ctas-pill">
                  <Link href="/contacto" className="btn-pill-primary">
                    <span>{t("hero.cta.primary")}</span>
                    <div className="btn-pill-arrow-circle">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pill-arrow-icon" width={14} height={14}>
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </div>
                  </Link>
                </div>
              </div>
            </div>


          </div>
        </div>
      </section>

      <HowItWorks es={language === "es"} />

      <SpecialtiesIndex es={language === "es"} />

      <WhyColombia es={language === "es"} />

      <SpotlightBand es={language === "es"} />

      {/* 3. TESTIMONIOS */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">
              {language === "es" ? "Pacientes Satisfechos" : "Satisfied Patients"}
            </span>
            <h2>{t("test.title")}</h2>
            <div className="header-bar"></div>
            <p className="section-desc">{t("test.subtitle")}</p>
          </div>

          <div className="grid grid-3 testimonials-grid">
            {testimonials.map((test) => (
              <div key={test.id} className="testimonial-card glass-card">
                <div className="stars">{test.stars}</div>
                <p className="testimonial-text">
                  {language === "es" ? test.textEs : test.textEn}
                </p>
                <div className="patient-info">
                  <div className="patient-name">{test.name}</div>
                  <div className="patient-origin">
                    {language === "es" ? test.originEs : test.originEn}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CONTACTO — cierre de la home */}
      <ContactCta />

      <style jsx>{`
        /* Hero styling now lives in globals.css (a real stylesheet, present
           before any JS runs) instead of here — see the comment there for
           why. Everything below is unchanged. */

        /* Buttons moved to globals.css */

        /* Same 72px top inset as the other home sections (the generic
           .section default is 136px, which read as a hole after the reveal
           block), and 40px header → cards like the rest of the page. */
        .testimonials-section {
          padding-top: 2.25rem;
        }
        .testimonials-section .section-header {
          margin-bottom: 2.5rem;
        }

        /* Section Headers */
        .section-header {
          max-width: 700px;
          margin: 0 auto 5rem auto;
          position: relative;
          z-index: 10;
        }
        .esp-specialties-tabs-section {
          padding-top: 4.5rem;
          padding-bottom: 3.5rem;
          scroll-margin-top: 100px;
        }
        /* Header scaled to match the "¿Por qué Colombia?" header: 2rem title,
           0.95rem copy, 28px to the tabs — one consistent type scale. */
        /* Header → tabs (36px) is wider than tabs → panel (28px, set on
           .esp-tabs-wrapper): the tabs are the panel's control, so they sit
           with the panel rather than floating between the two. */
        .esp-specialties-tabs-section .section-header {
          margin-bottom: 2.25rem;
        }
        /* Side tag in the left margin, mirroring .proceso-header and
           .why-col-header, so all three sections share one header rhythm. */
        .esp-header-row {
          display: grid;
          grid-template-columns: 250px 1fr 250px;
          gap: 20px;
          align-items: start;
        }
        .esp-header-tag {
          display: flex;
          align-items: center;
          gap: 10px;
          height: fit-content;
          padding-top: 0.4rem; /* optical: sits level with the h2 cap height */
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--mint-accent);
        }
        .esp-header-tag-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: var(--mint-accent);
          color: var(--negro-suave);
          font-size: 10px;
          font-weight: 800;
        }
        @media (max-width: 992px) {
          .esp-header-row {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .esp-header-spacer {
            display: none;
          }
          .esp-header-tag {
            justify-content: center;
            padding-top: 0;
          }
        }
        .esp-specialties-tabs-section .section-header h2 {
          font-size: 2rem;
          line-height: 1.1;
          margin-bottom: 0;
        }
        .text-center {
          text-align: center;
        }
        .section-subtitle {
          color: var(--mint-accent);
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.14em;
          margin-bottom: 0.5rem;
          display: block;
        }
        .header-bar {
          width: 40px;
          height: 3px;
          background: linear-gradient(90deg, var(--teal-primary), var(--mint-accent));
          margin: 0.85rem auto 1rem auto;
          border-radius: 2px;
        }
        .section-desc {
          font-size: 0.95rem;
          line-height: 1.5;
          color: var(--gris-texto);
          max-width: 560px;
          margin-left: auto;
          margin-right: auto;
        }


        /* Specialties Cards */
        .specialty-card {
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .spec-card-img {
          height: 180px;
          background-size: cover;
          background-position: center;
          position: relative;
        }
        .spec-card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(3, 8, 6, 0) 30%, rgba(3, 8, 6, 0.75) 100%);
        }
        .spec-card-content {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .spec-card-content h3 {
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
        }
        .spec-card-content p {
          font-size: 0.9rem;
          margin-bottom: 1.75rem;
          flex-grow: 1;
          color: var(--gris-texto);
        }
        .spec-card-price {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          margin: -0.5rem 0 1.5rem;
          padding-top: 1.1rem;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
        }
        .spec-card-price .price-col {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          line-height: 1.2;
        }
        .spec-card-price .price-col strong {
          font-size: 1.02rem;
          font-weight: 700;
          color: var(--white);
        }
        .spec-card-price .price-col-us strong {
          color: var(--gris-texto);
          font-weight: 600;
          text-decoration: line-through;
          text-decoration-color: rgba(81, 88, 86, 0.4);
        }
        .spec-card-price .price-col em {
          font-size: 0.7rem;
          font-style: normal;
          color: var(--gris-texto);
          white-space: nowrap;
        }
        .spec-card-price .price-vs {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--gris-texto);
          opacity: 0.55;
        }
        .spec-link {
          color: var(--mint-accent);
          font-weight: 600;
          font-size: 0.9rem;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }
        .spec-link-arrow {
          transition: var(--transition);
        }
        .specialty-card:hover .spec-link-arrow {
          transform: translateX(4px);
        }

        /* How it works */
        .workflow-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          position: relative;
        }
        .workflow-steps::before {
          content: "";
          position: absolute;
          top: 25px;
          left: 12%;
          right: 12%;
          height: 2px;
          background-color: rgba(93, 202, 165, 0.1);
          z-index: 1;
        }
        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 2;
        }
        .step-num {
          width: 50px;
          height: 50px;
          background-color: var(--negro-suave);
          color: var(--mint-accent);
          border: 2px solid rgba(93, 202, 165, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.25rem;
          margin-bottom: 1.75rem;
          transition: var(--transition);
          box-shadow: 0 0 20px rgba(93, 202, 165, 0.05);
        }
        .step-item:hover .step-num {
          background-color: var(--mint-accent);
          color: var(--negro-suave);
          border-color: var(--mint-accent);
          transform: scale(1.1);
          box-shadow: 0 0 25px rgba(93, 202, 165, 0.4);
        }
        .step-content h3 {
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
        }
        .step-content p {
          font-size: 0.9rem;
          margin-bottom: 0;
          color: var(--gris-texto);
        }

        /* Testimonials */
        .testimonial-card {
          padding: 2.5rem;
        }
        .stars {
          color: var(--mint-accent);
          font-size: 1.25rem;
          margin-bottom: 1.25rem;
          letter-spacing: 0.1em;
        }
        .testimonial-text {
          font-size: 0.95rem;
          font-style: italic;
          line-height: 1.7;
          margin-bottom: 1.75rem;
          color: var(--white);
        }
        .patient-info {
          border-top: 1px solid rgba(93, 202, 165, 0.15);
          padding-top: 1.25rem;
        }
        .patient-name {
          font-weight: 600;
          color: var(--white);
          font-size: 0.95rem;
        }
        .patient-origin {
          font-size: 0.8rem;
          color: var(--gris-texto);
          margin-top: 0.15rem;
        }

        /* Mobile adaptation — hero-related rules moved to globals.css
           alongside the rest of the hero styling. */
        @media (max-width: 992px) {
          .workflow-steps {
            grid-template-columns: 1fr;
            gap: 3.5rem;
          }
          .workflow-steps::before {
            display: none;
          }
          .step-item {
            flex-direction: row;
            text-align: left;
            align-items: flex-start;
            gap: 1.5rem;
          }
          .step-num {
            margin-bottom: 0;
            flex-shrink: 0;
          }
        }

        /* ==========================================================
           Specialties Interactive 3D Card Stack Styles (Ultra-Minimalist)
           ========================================================== */
        /* Text + card stack travel together as one centred block under the
           header (max 1040px), instead of being flung to opposite edges with
           a void in between. */
        .esp-specialty-pane.active {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 1095px;
          margin: 0 auto;
          gap: 125px;
        }

        .esp-text-col {
          max-width: 520px;
          flex: 0 1 520px;
        }

        .esp-badge {
          display: inline-block;
          /* Brand teal tint, not a stray Tailwind gray. Square-ish corners keep
             it reading as a label, not as another pill tab. */
          background-color: rgba(29, 122, 110, 0.08);
          color: var(--teal-primary);
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 600;
          text-transform: none; /* sentence case */
          letter-spacing: -0.01em;
          /* It labels the title, so it sits tight to it (12px) — tighter than
             title → body (20px) and body → action (28px). */
          margin-bottom: 0.75rem;
        }

        .esp-tagline {
          /* The stack (400px) sets the pane height, so the text column has
             room to breathe without making the section taller. */
          font-size: 2.3rem;
          font-weight: 800;
          line-height: 1.1;
          color: var(--white);
          margin-bottom: 1.25rem;
          letter-spacing: -0.03em;
        }

        .esp-desc {
          font-size: 0.98rem; /* slightly smaller and cleaner */
          color: var(--gris-texto); /* the site's paragraph gray, not Tailwind's bluish gray-600 */
          line-height: 1.65;
          margin-bottom: 1.75rem;
          max-width: 480px;
        }

        /* .esp-cta-link lives in globals.css: it is a <Link>, and next/link
           anchors never receive styled-jsx's scope class, so rules here never
           matched it (it rendered unstyled, with the arrow jammed against the
           text). */

        .esp-stack-col {
          flex: 0 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          user-select: none;
          border-radius: 14px;
        }

        .esp-stack-col:focus-visible {
          outline: 2px solid var(--teal-primary);
          outline-offset: 6px;
        }

        .esp-card-stack {
          position: relative;
          width: 340px;
          height: 400px;
          /* Room for the two offset cards peeking out behind (24px, 24px) */
          margin-right: 24px;
          margin-bottom: 24px;
        }

        .esp-stack-card {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 12px; /* cleaner, sharper radius */
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.02); /* soft shadow */
          /* z-index is deliberately NOT transitioned: the incoming cards must
             take their new stacking order on the very first frame, otherwise
             two cards tie at the same z-index mid-animation and their titles
             overlap. Only the outgoing card (pos-2) handles z-index, inside its
             own keyframes. */
          transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                      opacity 0.7s ease,
                      box-shadow 0.4s ease;
          border: 1px solid rgba(0, 0, 0, 0.04);
        }

        .esp-stack-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .esp-card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.6) 100%);
          z-index: 1;
        }

        .esp-card-info {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          text-align: center; /* centered text at the bottom */
          z-index: 2;
          padding: 0 15px;
        }

        .esp-card-info h4 {
          color: #ffffff;
          font-size: 1.15rem;
          font-weight: 600;
          margin: 0;
          letter-spacing: -0.01em;
        }

        /* Top right circular indicator ring */
        .esp-card-indicator {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1.5px solid rgba(255, 255, 255, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          background-color: rgba(0, 0, 0, 0.05);
          backdrop-filter: blur(2px);
          transition: border-color 0.3s ease;
        }

        .esp-indicator-inner {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #ffffff;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        /* Positions */
        .esp-card-pos-0 {
          z-index: 3;
          transform: translate(0, 0) scale(1) rotate(0deg);
          opacity: 1;
        }

        .esp-card-pos-0 .esp-card-indicator {
          border-color: rgba(255, 255, 255, 0.95);
        }

        .esp-card-pos-0 .esp-indicator-inner {
          opacity: 1;
        }

        .esp-card-pos-1 {
          z-index: 2;
          transform: translate(12px, 12px) scale(0.97) rotate(1.5deg);
          opacity: 0.95;
        }

        .esp-card-pos-2 {
          z-index: 1;
          animation: sendToBack 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* Both titles sit bottom-center, so while the outgoing card crossfades
           its title would read as doubled text over the incoming one. Drop the
           outgoing title almost instantly; the card itself keeps fading. */
        .esp-card-info {
          transition: opacity 0.3s ease 0.15s;
        }
        .esp-card-pos-2 .esp-card-info {
          opacity: 0;
          transition: opacity 0.12s ease;
        }

        /* Hover animation fanning out */
        .esp-stack-col:hover .esp-card-pos-0 {
          transform: translate(-4px, -4px) scale(1.01) rotate(-0.5deg);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
        }

        .esp-stack-col:hover .esp-card-pos-1 {
          transform: translate(12px, 8px) scale(0.98) rotate(3deg);
        }

        .esp-stack-col:hover .esp-card-pos-2 {
          transform: translate(28px, 20px) scale(0.95) rotate(-3deg);
        }

        .esp-progress-ring {
          width: 24px;
          height: 24px;
          display: block;
        }

        /* The ring's own animationend advances the stack (see cycleCard), so
           anything that pauses this animation pauses the advance with it. */
        .esp-progress-ring-circle {
          stroke-dashoffset: 56.54;
          animation: ringFill 5s linear forwards;
        }

        /* Hold the stack while it is being looked at or used. Hover only on
           real pointers: touch browsers keep :hover stuck after a tap. */
        @media (hover: hover) {
          .esp-stack-col:hover .esp-progress-ring-circle {
            animation-play-state: paused;
          }
        }
        .esp-stack-col:focus-visible .esp-progress-ring-circle {
          animation-play-state: paused;
        }

        @keyframes ringFill {
          from { stroke-dashoffset: 56.54; }
          to   { stroke-dashoffset: 0; }
        }

        /* Outgoing card: lifts and fades out ON TOP of the deck (z 4), then —
           while fully transparent — teleports to the back slot and fades back
           in there. Nothing ever crosses through another card, so there is no
           frame where two cards fight for the same layer. */
        @keyframes sendToBack {
          0% {
            z-index: 4;
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          45% {
            z-index: 4;
            opacity: 0;
            transform: translate(0, -28px) scale(0.98) rotate(0deg);
          }
          46% {
            z-index: 1;
            opacity: 0;
            transform: translate(24px, 24px) scale(0.94) rotate(-1.5deg);
          }
          100% {
            z-index: 1;
            opacity: 0.9;
            transform: translate(24px, 24px) scale(0.94) rotate(-1.5deg);
          }
        }

        @keyframes sendToBackMobile {
          0% {
            z-index: 4;
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
          }
          45% {
            z-index: 4;
            opacity: 0;
            transform: translate(0, -22px) scale(0.98) rotate(0deg);
          }
          46% {
            z-index: 1;
            opacity: 0;
            transform: translate(20px, 20px) scale(0.94) rotate(-1.5deg);
          }
          100% {
            z-index: 1;
            opacity: 0.9;
            transform: translate(20px, 20px) scale(0.94) rotate(-1.5deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .esp-stack-card { transition-duration: 0.01ms; }
          .esp-card-pos-2 { animation-duration: 0.01ms; }
          /* No ring animation means no auto-advance; the stack still cycles
             on click and keyboard. */
          .esp-progress-ring-circle { animation: none; }
        }

        @media (max-width: 900px) {
          .esp-specialty-pane.active {
            flex-direction: column;
            justify-content: center;
            gap: 40px;
          }
          .esp-text-col {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            /* Stacked layout: the desktop flex-basis (520px) would become a
               520px HEIGHT here and leave a void above the cards. */
            flex: 0 0 auto;
            max-width: 100%;
          }
          .esp-tagline {
            /* Stacked on a phone, this title reads right after the section's
               own "Especialidades" heading — keep it under that (32px) so the
               hierarchy holds, and at 3 lines instead of 4. */
            font-size: 1.85rem;
          }
          .esp-card-stack {
            width: 280px;
            height: 340px;
            margin-right: 15px;
            margin-bottom: 15px;
          }
          .esp-card-pos-1 {
            transform: translate(10px, 10px) scale(0.97) rotate(1.5deg);
          }
          .esp-card-pos-2 {
            animation: sendToBackMobile 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
        }
      `}</style>
      </div>
    </>
  );
}
