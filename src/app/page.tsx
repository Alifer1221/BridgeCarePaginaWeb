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

  useEffect(() => {
    if (!mounted) return;
    const part2 = t("hero.title.part2");
    setTypedPart2("");
    let idx = 0;
    const interval = setInterval(() => {
      setTypedPart2((prev) => {
        // Ensure we only append if we have valid chars
        if (idx < part2.length) {
          return prev + part2.charAt(idx);
        }
        return prev;
      });
      idx++;
      if (idx >= part2.length) {
        clearInterval(interval);
      }
    }, 45);
    return () => clearInterval(interval);
  }, [language, mounted]);

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
              if (e.currentTarget.currentTime > 0.15) {
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
          <div className="container hero-content">
            <span className="hero-tagline">
              {t("hero.tagline")}
            </span>
            <h1>
              {t("hero.title.part1")}
              <span className="highlight-color">
                {typedPart2}
                <span className="cursor-blink">_</span>
              </span>
            </h1>
            <p className="hero-subheadline">{t("hero.subtitle")}</p>
            <div className="hero-ctas">
              <Link href="/contacto" className="btn btn-accent btn-lg">
                {t("hero.cta.primary")} &rarr;
              </Link>
              <Link href="/nosotros#packages" className="btn btn-secondary btn-lg btn-glass">
                {t("hero.cta.secondary")}
              </Link>
            </div>

            {/* Statistics Row */}
            <div className="hero-stats-row">
              <div className="stat-col">
                <div className="stat-num">{t("hero.stats.clinics.num")}</div>
                <div className="stat-label">{t("hero.stats.clinics.lbl")}</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-col">
                <div className="stat-num">{t("hero.stats.patients.num")}</div>
                <div className="stat-label">{t("hero.stats.patients.lbl")}</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-col">
                <div className="stat-num">{t("hero.stats.satisfaction.num")}</div>
                <div className="stat-label">{t("hero.stats.satisfaction.lbl")}</div>
              </div>
            </div>

            {/* Discover More */}
            <div className="hero-discover-more">
              <span className="discover-text">{t("hero.discover")}</span>
              <div className="discover-indicator">
                <span className="discover-line"></span>
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
          min-height: 85vh;
          display: flex;
          align-items: center;
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
          transition: opacity 0.8s ease-in-out;
        }
        .hero-video.playing {
          opacity: 1;
        }
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(8, 9, 9, 0.8) 0%, rgba(8, 9, 9, 0.3) 50%, rgba(8, 9, 9, 1) 100%);
          z-index: 2;
          pointer-events: none;
        }
        .hero-content-wrapper {
          position: relative;
          z-index: 10;
          width: 100%;
          padding: 10rem 0 7rem 0;
        }
        .hero-content {
          max-width: 900px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin: 0 auto;
        }
        .hero-tagline {
          display: inline-block;
          color: var(--mint-accent);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.8rem;
          margin-bottom: 1.75rem;
          padding: 0.4rem 1.25rem;
          background-color: rgba(93, 202, 165, 0.06);
          border-radius: var(--radius-full);
          border: 1px solid rgba(93, 202, 165, 0.15);
          max-width: 100%;
          line-height: 1.4;
        }
        .hero-content h1 {
          font-size: 3.8rem;
          line-height: 1.15;
          margin-bottom: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .highlight-color {
          color: var(--mint-accent);
          position: relative;
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
        .hero-subheadline {
          color: var(--gris-texto);
          font-size: 1.25rem;
          line-height: 1.6;
          margin-bottom: 2.5rem;
          max-width: 650px;
        }
        .hero-ctas {
          display: flex;
          gap: 1.25rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .btn-lg {
          padding: 1rem 2.5rem;
          font-size: 1.05rem;
        }
        .btn-glass {
          background: rgba(255, 255, 255, 0.04) !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          color: var(--white) !important;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .btn-glass:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(255, 255, 255, 0.35) !important;
          color: var(--white) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.05);
        }

        /* Stats Row */
        .hero-stats-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3.5rem;
          margin-top: 5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 2.2rem;
          width: 100%;
          max-width: 800px;
        }
        .stat-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .stat-num {
          font-size: 2.8rem;
          font-weight: 800;
          color: var(--white);
          line-height: 1;
          margin-bottom: 0.5rem;
          font-family: var(--font-sans);
          letter-spacing: -0.02em;
        }
        .stat-label {
          font-size: 0.8rem;
          color: var(--gris-texto);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          opacity: 0.75;
          font-weight: 500;
        }
        .stat-divider {
          width: 1px;
          height: 45px;
          background-color: rgba(255, 255, 255, 0.12);
        }

        /* Discover More Scroll Down */
        .hero-discover-more {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 4.5rem;
          width: 100%;
        }
        .discover-text {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--gris-texto);
          opacity: 0.5;
          letter-spacing: 0.25em;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
        }
        .discover-indicator {
          width: 1px;
          height: 35px;
          background-color: rgba(255, 255, 255, 0.15);
          position: relative;
          overflow: hidden;
        }
        .discover-line {
          display: block;
          width: 100%;
          height: 100%;
          background-color: var(--mint-accent);
          animation: scrollLine 2s infinite ease-in-out;
          transform-origin: top;
        }
        @keyframes scrollLine {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          50.1% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }

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
            padding: 8rem 0 5rem 0;
          }
          .hero-content h1 { font-size: 3rem; }
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
          .hero-content h1 {
            font-size: 2.4rem;
          }
          .hero-subheadline {
            font-size: 1.1rem;
          }
          .hero-ctas {
            flex-direction: column;
            width: 100%;
          }
          .hero-ctas .btn {
            width: 100%;
          }
          .hero-stats-row {
            flex-wrap: wrap;
            gap: 1.5rem;
            justify-content: space-between;
            margin-top: 3.5rem;
            padding-top: 1.8rem;
          }
          .stat-divider {
            display: none;
          }
          .stat-col {
            flex: 1 1 40%;
            align-items: center;
            text-align: center;
          }
          .stat-col:last-child {
            flex: 1 1 100%;
            margin-top: 0.5rem;
          }
          .stat-num {
            font-size: 2.2rem;
          }
          .hero-discover-more {
            margin-top: 3.5rem;
          }
        }
      `}</style>
      </div>
    </>
  );
}
