"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredSpecialties, Specialty } from "@/lib/db";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [mounted, setMounted] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [splashFadeOut, setSplashFadeOut] = useState(false);
  const [typedPart2, setTypedPart2] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset typewriter when language changes
  useEffect(() => {
    setTypedPart2("");
    setIsDeleting(false);
    setPhraseIndex(0);
  }, [language]);

  useEffect(() => {
    if (!mounted) return;

    const phrasesEs = [
      "TU TRATAMIENTO MÉDICO, TODO GESTIONADO.",
      "VUELO, CONSULTA Y HOTEL. TODO INCLUIDO.",
      "MÉDICOS AVALADOS, RESULTADOS REALES.",
      "DEL DIAGNÓSTICO A TU RECUPERACIÓN.",
      "TURISMO MÉDICO SEGURO EN COLOMBIA."
    ];

    const phrasesEn = [
      "YOUR MEDICAL TREATMENT, ALL MANAGED.",
      "FLIGHT, CONSULTATION, AND HOTEL. ALL INCLUDED.",
      "CERTIFIED DOCTORS, REAL RESULTS.",
      "FROM DIAGNOSIS TO YOUR RECOVERY.",
      "SAFE MEDICAL TOURISM IN COLOMBIA."
    ];

    const currentPhrases = language === "es" ? phrasesEs : phrasesEn;
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
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % currentPhrases.length);
    }

    return () => clearTimeout(timer);
  }, [language, mounted, typedPart2, isDeleting, phraseIndex]);

  useEffect(() => {
    setMounted(true);
    setSpecialties(getStoredSpecialties());

    // Only show splash screen once per session to avoid annoying the user on navigation
    const hasShown = sessionStorage.getItem("bc_splash_shown");
    if (hasShown) {
      setShowSplash(false);
    }

    // Failsafe timer: if video doesn't play or trigger events in 2.2s, force show it
    const timer = setTimeout(() => {
      setVideoPlaying(true);
    }, 2200);

    const handleUpdate = () => {
      setSpecialties(getStoredSpecialties());
    };
    window.addEventListener("bc_db_update", handleUpdate);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("bc_db_update", handleUpdate);
    };
  }, []);

  const selectLanguage = (lang: "es" | "en") => {
    setLanguage(lang);
    sessionStorage.setItem("bc_splash_shown", "true");
    setSplashFadeOut(true);
    setTimeout(() => {
      setShowSplash(false);
    }, 600);
  };

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
      {showSplash && (
        <div 
          className={`splash-screen ${splashFadeOut ? "fade-out" : ""}`}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "radial-gradient(circle at center, #0e1212 0%, #080909 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100000,
            transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            opacity: splashFadeOut ? 0 : 1,
            pointerEvents: splashFadeOut ? "none" : "auto",
          }}
        >
          <div 
            className="splash-card"
            style={{
              background: "rgba(15, 17, 17, 0.75)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "28px",
              padding: "3.5rem 3rem",
              maxWidth: "500px",
              width: "90%",
              textAlign: "center",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(93, 202, 165, 0.05)",
            }}
          >
            {/* Glowing Logo Icon */}
            <div 
              className="logo-container"
              style={{
                position: "relative",
                width: "90px",
                height: "90px",
                margin: "0 auto 1.5rem auto",
              }}
            >
              <div 
                className="pulse-glow"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "#5DCAA5",
                  borderRadius: "50%",
                  filter: "blur(15px)",
                  opacity: 0.15,
                }}
              ></div>
              <div 
                className="logo-icon-box"
                style={{
                  position: "relative",
                  background: "linear-gradient(135deg, #1D7A6E 0%, #5DCAA5 100%)",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 8px 24px rgba(93, 202, 165, 0.3)",
                }}
              >
                <svg 
                  width="44" 
                  height="44" 
                  style={{
                    width: "44px",
                    height: "44px",
                    color: "#080909",
                    fill: "none",
                    display: "block",
                  }}
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="logo-svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
              </div>
            </div>

            <h2 
              className="splash-title"
              style={{
                fontSize: "2.2rem",
                fontWeight: 800,
                letterSpacing: "0.15em",
                marginBottom: "1.5rem",
                background: "linear-gradient(135deg, #ffffff 30%, #A3B8B4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              BRIDGE CARE
            </h2>
            
            <div 
              className="loader-container"
              style={{
                marginBottom: "2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <div 
                className="spinner"
                style={{
                  width: "36px",
                  height: "36px",
                  border: "3px solid rgba(93, 202, 165, 0.1)",
                  borderTopColor: "#5DCAA5",
                  borderRadius: "50%",
                }}
              ></div>
              <p 
                className="loading-text"
                style={{
                  fontSize: "0.85rem",
                  color: "#A3B8B4",
                  opacity: 0.8,
                  margin: 0,
                  letterSpacing: "0.05em",
                }}
              >
                Cargando servicios de salud... / Loading health services...
              </p>
            </div>

            <div 
              className="language-selector-section"
              style={{
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                paddingTop: "1.75rem",
              }}
            >
              <p 
                className="select-prompt"
                style={{
                  fontSize: "0.95rem",
                  color: "#ffffff",
                  marginBottom: "1.25rem",
                  fontWeight: 500,
                }}
              >
                Selecciona tu idioma / Select your language:
              </p>
              <div 
                className="splash-buttons"
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                }}
              >
                <button onClick={() => selectLanguage("es")} className="btn btn-accent btn-splash">
                  Español
                </button>
                <button onClick={() => selectLanguage("en")} className="btn btn-secondary btn-splash">
                  English
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="home-container" style={{ opacity: showSplash ? 0 : 1, transition: "opacity 0.8s ease" }}>
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        {/* Background media wrapper */}
        <div className="hero-bg-wrapper">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            onTimeUpdate={(e) => {
              if (e.currentTarget.currentTime > 0.01) {
                setVideoPlaying(true);
              }
            }}
            className={`hero-video ${videoPlaying ? "playing" : ""}`}
            style={{ opacity: videoPlaying ? 1 : 0 }}
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
              <div className="hero-title-container">
                <h1>
                  {t("hero.title.part1")}
                  <span className="highlight-color">
                    {typedPart2}
                    <span className="cursor-blink">_</span>
                  </span>
                </h1>
              </div>

              {/* Bottom part: Three Vertical Features */}
              <div className="hero-features-list">
                
                {/* Feature 1: Ahorro Promedio */}
                <div className="hero-feature-item">
                  <div className="hero-feature-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hero-feature-icon">
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
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hero-feature-icon">
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
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hero-feature-icon">
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
              <div className="hero-right-bottom">
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
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="pill-arrow-icon">
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

      {/* MI PROCESO - NUESTRO PROCESO */}
      <section className="proceso-section">
        <div className="proceso-container">
          <div className="proceso-header">
            <div className="proceso-tag">
              <span className="proceso-tag-icon">✦</span>
              {language === "es" ? "Nuestro Proceso" : "Our Process"}
            </div>
            
            <div className="proceso-header-content">
              <h4>{language === "es" ? "Cómo Funciona" : "How It Works"}</h4>
              <h2>
                {language === "es" ? (
                  <>
                    Así de simple es<br />
                    <span>tu tratamiento en Colombia</span>
                  </>
                ) : (
                  <>
                    As simple as that:<br />
                    <span>your treatment in Colombia</span>
                  </>
                )}
              </h2>
              <p>
                {language === "es" 
                  ? "Un proceso transparente y sin estrés desde tu primera consulta hasta tu recuperación completa. Así es exactamente como lo gestionamos."
                  : "A transparent and stress-free process from your very first consultation to your complete recovery. That is exactly how we manage it."}
              </p>
            </div>
          </div>

          <div className="proceso-cards-grid">
            
            <div className="proceso-card">
              <div className="proceso-card-header">
                <div className="proceso-dots">
                  <span className="proceso-dot active"></span>
                  <span className="proceso-dot"></span>
                  <span className="proceso-dot"></span>
                  <span className="proceso-dot"></span>
                </div>
                <span className="proceso-card-number">01</span>
              </div>
              <div className="proceso-card-body">
                <div className="proceso-card-icon">
                  <img src="/bridgecare_icon_01.svg" alt="Form" className="proceso-svg-icon" />
                </div>
                <div className="proceso-card-content">
                  <h3 className="proceso-card-title">
                    {language === "es" ? "Cuéntanos qué necesitas" : "Tell us what you need"}
                  </h3>
                  <p className="proceso-card-desc">
                    {language === "es" 
                      ? "Llena nuestro formulario en menos de 2 minutos. Sin compromisos ni costos."
                      : "Fill out our form in under 2 minutes. No commitment, no fees."}
                  </p>
                </div>
              </div>
            </div>

            <div className="proceso-card">
              <div className="proceso-card-header">
                <div className="proceso-dots">
                  <span className="proceso-dot"></span>
                  <span className="proceso-dot active"></span>
                  <span className="proceso-dot"></span>
                  <span className="proceso-dot"></span>
                </div>
                <span className="proceso-card-number">02</span>
              </div>
              <div className="proceso-card-body">
                <div className="proceso-card-icon">
                  <img src="/bridgecare_icon_02.svg" alt="Plan" className="proceso-svg-icon" />
                </div>
                <div className="proceso-card-content">
                  <h3 className="proceso-card-title">
                    {language === "es" ? "Recibe tu plan personalizado" : "Receive your personalized plan"}
                  </h3>
                  <p className="proceso-card-desc">
                    {language === "es" 
                      ? "En menos de 24 horas tienes tu propuesta completa: especialista, procedimiento y costos."
                      : "In less than 24 hours, you get your complete proposal: specialist, procedure, and costs."}
                  </p>
                </div>
              </div>
            </div>

            <div className="proceso-card">
              <div className="proceso-card-header">
                <div className="proceso-dots">
                  <span className="proceso-dot"></span>
                  <span className="proceso-dot"></span>
                  <span className="proceso-dot active"></span>
                  <span className="proceso-dot"></span>
                </div>
                <span className="proceso-card-number">03</span>
              </div>
              <div className="proceso-card-body">
                <div className="proceso-card-icon">
                  <img src="/bridgecare_icon_03.svg" alt="Travel" className="proceso-svg-icon" />
                </div>
                <div className="proceso-card-content">
                  <h3 className="proceso-card-title">
                    {language === "es" ? "Viaja con todo listo" : "Travel with everything ready"}
                  </h3>
                  <p className="proceso-card-desc">
                    {language === "es" 
                      ? "Vuelo, hotel y traslados ya coordinados. Tú solo llegas a Bogotá."
                      : "Flights, hotel, and transfers all coordinated. You just arrive in Bogota."}
                  </p>
                </div>
              </div>
            </div>

            <div className="proceso-card">
              <div className="proceso-card-header">
                <div className="proceso-dots">
                  <span className="proceso-dot"></span>
                  <span className="proceso-dot"></span>
                  <span className="proceso-dot"></span>
                  <span className="proceso-dot active"></span>
                </div>
                <span className="proceso-card-number">04</span>
              </div>
              <div className="proceso-card-body">
                <div className="proceso-card-icon">
                  <img src="/bridgecare_icon_04.svg" alt="Recovery" className="proceso-svg-icon" />
                </div>
                <div className="proceso-card-content">
                  <h3 className="proceso-card-title">
                    {language === "es" ? "Recupérate, nosotros seguimos contigo" : "Recover, we stay by your side"}
                  </h3>
                  <p className="proceso-card-desc">
                    {language === "es" 
                      ? "Acompañamiento post-procedimiento hasta que estés de vuelta en casa."
                      : "Post-procedure support until you are safely back home."}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. POR QUÉ COLOMBIA */}
      <section className="section why-colombia-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">
              {language === "es" ? "Excelencia e Innovación" : "Excellence & Innovation"}
            </span>
            <h2>{t("why.title")}</h2>
            <div className="header-bar"></div>
            <p className="section-desc">{t("why.subtitle")}</p>
          </div>

          <div className="grid grid-4 why-grid">
            <div className="why-card glass-card">
              <div className="why-icon-box">
                <svg width="26" height="26" style={{ width: "26px", height: "26px" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="why-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
              </div>
              <h3>{t("why.card1.title")}</h3>
              <p>{t("why.card1.desc")}</p>
            </div>

            <div className="why-card glass-card">
              <div className="why-icon-box">
                <svg width="26" height="26" style={{ width: "26px", height: "26px" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="why-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <h3>{t("why.card2.title")}</h3>
              <p>{t("why.card2.desc")}</p>
            </div>

            <div className="why-card glass-card">
              <div className="why-icon-box">
                <svg width="26" height="26" style={{ width: "26px", height: "26px" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="why-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3>{t("why.card3.title")}</h3>
              <p>{t("why.card3.desc")}</p>
            </div>

            <div className="why-card glass-card">
              <div className="why-icon-box">
                <svg width="26" height="26" style={{ width: "26px", height: "26px" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="why-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </div>
              <h3>{t("why.card4.title")}</h3>
              <p>{t("why.card4.desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ESPECIALIDADES VISTA RÁPIDA */}
      <section className="section specialties-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">
              {language === "es" ? "Nuestros Procedimientos" : "Our Procedures"}
            </span>
            <h2>{t("spec.title")}</h2>
            <div className="header-bar"></div>
            <p className="section-desc">{t("spec.subtitle")}</p>
          </div>

          <div className="grid grid-4 specialties-grid">
            {mounted && specialties.map((spec) => (
              <div key={spec.id} className="specialty-card glass-card">
                <div 
                  className="spec-card-img" 
                  style={{ backgroundImage: `url(${spec.image})` }}
                >
                  <div className="spec-card-overlay"></div>
                </div>
                <div className="spec-card-content">
                  <h3>{language === "es" ? spec.name : spec.nameEn}</h3>
                  <p>{language === "es" ? spec.description : spec.descriptionEn}</p>
                  <Link href={`/specialties/${spec.id}`} className="spec-link">
                    {language === "es" ? "Saber más" : "Learn more"}{" "}
                    <span className="spec-link-arrow">&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CÓMO FUNCIONA */}
      <section className="section-dark section workflow-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">
              {language === "es" ? "Paso a Paso" : "Step by Step"}
            </span>
            <h2>{t("how.title")}</h2>
            <div className="header-bar"></div>
            <p className="section-desc">{t("how.subtitle")}</p>
          </div>

          <div className="workflow-steps">
            <div className="step-item">
              <div className="step-num">1</div>
              <div className="step-content">
                <h3>{t("how.step1.title")}</h3>
                <p>{t("how.step1.desc")}</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-num">2</div>
              <div className="step-content">
                <h3>{t("how.step2.title")}</h3>
                <p>{t("how.step2.desc")}</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-num">3</div>
              <div className="step-content">
                <h3>{t("how.step3.title")}</h3>
                <p>{t("how.step3.desc")}</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-num">4</div>
              <div className="step-content">
                <h3>{t("how.step4.title")}</h3>
                <p>{t("how.step4.desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIOS */}
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

      <style jsx>{`
        /* Hero Styling */
        .hero-section {
          position: relative;
          z-index: 1;
          overflow: hidden;
          background-color: var(--negro-suave);
          color: var(--white);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-bg-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }
        .hero-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }
        .hero-video.playing {
          opacity: 0.25; /* Soft watermark video on white */
        }
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 70% 30%, rgba(250, 246, 240, 0.15) 0%, rgba(250, 246, 240, 0.8) 100%), 
                      linear-gradient(to bottom, rgba(250, 246, 240, 0.4) 0%, rgba(250, 246, 240, 0.1) 50%, rgba(250, 246, 240, 0.98) 100%);
          z-index: 2;
          pointer-events: none;
        }
        .hero-content-wrapper {
          position: relative;
          z-index: 10;
          width: 100%;
          padding: 9.5rem 0 4.5rem 0;
        }
        .hero-content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4.5rem;
          align-items: flex-end;
          min-height: 72vh;
          position: relative;
          margin-left: 0 !important;
        }
        
        /* Column Left Styling */
        .hero-column-left {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          min-height: 520px;
        }
        .hero-title-container h1 {
          font-size: 3.2rem;
          line-height: 1.1;
          margin-bottom: 2.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          text-align: left;
          max-width: 600px;
        }
        .highlight-color {
          color: var(--white);
          -webkit-text-fill-color: var(--white);
          display: block;
          margin-top: 0.25rem;
          font-weight: 700;
        }
        .cursor-blink {
          animation: blink 0.9s infinite;
          color: var(--mint-accent);
          font-weight: 400;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* Features List Styling */
        .hero-features-list {
          display: flex;
          flex-direction: column;
          gap: 1.55rem;
          margin-top: auto;
          text-align: left;
        }
        .hero-feature-item {
          display: flex;
          align-items: flex-start;
          gap: 1.15rem;
          transition: transform 0.2s ease;
        }
        .hero-feature-item:hover {
          transform: translateX(4px);
        }
        .hero-feature-icon-box {
          color: var(--white);
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 0.15rem;
        }
        .hero-feature-icon {
          width: 26px;
          height: 26px;
          stroke-width: 1.75px;
        }
        .hero-feature-content {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .hero-feature-title {
          font-size: 0.98rem;
          font-weight: 700;
          color: var(--white);
          margin: 0;
          letter-spacing: -0.01em;
        }
        .hero-feature-desc {
          font-size: 0.84rem;
          color: var(--gris-texto);
          margin: 0;
          line-height: 1.4;
          max-width: 320px;
        }

        /* Column Right Styling */
        .hero-column-right {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          height: 100%;
        }
        .hero-right-bottom {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          max-width: 520px;
          text-align: left;
        }
        .hero-right-tagline {
          font-size: clamp(1.35rem, 2.1vw, 1.65rem);
          font-weight: 600;
          color: var(--white);
          line-height: 1.25;
          letter-spacing: -0.02em;
          margin: 0;
          display: flex;
          flex-direction: column;
        }
        .tagline-span {
          display: block;
          white-space: nowrap;
        }
        .hero-ctas-pill {
          display: flex;
          justify-content: flex-start;
          margin-top: 0.5rem;
        }
        
        /* Buttons moved to globals.css */

        /* Section Headers */
        .section-header {
          max-width: 700px;
          margin: 0 auto 5rem auto;
          position: relative;
          z-index: 10;
        }
        .text-center {
          text-align: center;
        }
        .section-subtitle {
          color: var(--mint-accent);
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 0.15em;
          margin-bottom: 0.5rem;
          display: block;
        }
        .header-bar {
          width: 50px;
          height: 3px;
          background: linear-gradient(90deg, var(--teal-primary), var(--mint-accent));
          margin: 1.25rem auto 1.75rem auto;
          border-radius: 2px;
        }
        .section-desc {
          font-size: 1.1rem;
          color: var(--gris-texto);
        }

        /* Por qué Colombia */
        .why-colombia-section {
          position: relative;
        }
        .why-card {
          padding: 2.5rem 2rem;
        }
        .why-icon-box {
          background-color: rgba(93, 202, 165, 0.08);
          color: var(--mint-accent);
          width: 54px;
          height: 54px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.75rem;
          border: 1px solid rgba(93, 202, 165, 0.15);
        }
        .why-icon {
          width: 26px;
          height: 26px;
        }
        .why-card h3 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }
        .why-card p {
          font-size: 0.9rem;
          margin-bottom: 0;
          color: var(--gris-texto);
          line-height: 1.5;
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

        /* Mobile adaptation */
        @media (max-width: 992px) {
          .hero-section {
            min-height: auto;
            height: auto;
            padding: 0;
          }
          .hero-content-wrapper {
            padding: 8.5rem 0 4.5rem 0;
          }
          .hero-content-grid {
            grid-template-columns: 1fr;
            gap: 3.5rem;
            min-height: auto;
          }
          .hero-column-left {
            min-height: auto;
          }
          .hero-column-right {
            justify-content: flex-start;
          }
          .hero-title-container h1 { 
            font-size: 2.5rem; 
            max-width: 100%;
            margin-bottom: 2rem;
          }
          .hero-right-bottom {
            max-width: 100%;
          }
          .hero-right-tagline {
            font-size: 1.35rem;
          }
          .tagline-span {
            white-space: normal;
          }
          .hero-packages-badge-container {
            position: relative;
            bottom: auto;
            right: auto;
            display: flex;
            justify-content: flex-start;
            margin-top: 1rem;
          }
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
        @media (max-width: 768px) {
          .hero-content-wrapper {
            padding: 7.5rem 0 3.5rem 0;
          }
          .hero-title-container h1 {
            font-size: 1.85rem;
          }
          .hero-right-tagline {
            font-size: 1.1rem;
          }

          .hero-features-list {
            gap: 1.35rem;
          }
          .hero-feature-desc {
            max-width: 100%;
          }
        }
      `}</style>
      </div>
    </>
  );
}
