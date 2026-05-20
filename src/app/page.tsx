"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredSpecialties, Specialty } from "@/lib/db";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { language, t } = useLanguage();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSpecialties(getStoredSpecialties());

    const handleUpdate = () => {
      setSpecialties(getStoredSpecialties());
    };
    window.addEventListener("bc_db_update", handleUpdate);
    return () => window.removeEventListener("bc_db_update", handleUpdate);
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
    <div className="home-container">
      {/* Aurora Ambient Glow Spheres */}
      <div className="glow-sphere glow-1"></div>
      <div className="glow-sphere glow-2"></div>

      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="hero-video"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
        <div className="container hero-content animate-fade-in">
          <span className="hero-tagline">
            {language === "es" ? "Turismo Médico Seguro e Integral" : "Safe & Comprehensive Medical Tourism"}
          </span>
          <h1>{t("hero.title")}</h1>
          <p>{t("hero.subtitle")}</p>
          <div className="hero-ctas">
            <Link href="/contacto" className="btn btn-accent btn-lg">
              {t("nav.book")}
            </Link>
            <Link href="/nosotros#packages" className="btn btn-secondary btn-lg">
              {language === "es" ? "Ver Paquetes Todo Incluido" : "View All-Inclusive Packages"}
            </Link>
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="why-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
              </div>
              <h3>{t("why.card1.title")}</h3>
              <p>{t("why.card1.desc")}</p>
            </div>

            <div className="why-card glass-card">
              <div className="why-icon-box">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="why-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
              </div>
              <h3>{t("why.card2.title")}</h3>
              <p>{t("why.card2.desc")}</p>
            </div>

            <div className="why-card glass-card">
              <div className="why-icon-box">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="why-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3>{t("why.card3.title")}</h3>
              <p>{t("why.card3.desc")}</p>
            </div>

            <div className="why-card glass-card">
              <div className="why-icon-box">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="why-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-10.5h16.5m-16.5 3h16.5m-16.5 3h16.5M12 3v1.5m0 2v.5m0 1.5v.5m0 1.5V12" />
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
        /* Aurora Glowing Spheres */
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
          background: var(--mint-accent);
          top: 15%;
          left: -100px;
        }
        .glow-2 {
          background: var(--teal-primary);
          top: 55%;
          right: -100px;
        }

        /* Hero Styling */
        @keyframes videoFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .hero-section {
          position: relative;
          overflow: hidden;
          background-color: var(--negro-suave);
          color: var(--white);
          padding: 10rem 0 7rem 0;
          display: flex;
          align-items: center;
          min-height: 85vh;
        }
        .hero-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 1;
          opacity: 0;
          animation: videoFadeIn 1.2s ease-out forwards;
        }
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(3, 8, 6, 0.8) 0%, rgba(3, 8, 6, 0.4) 50%, rgba(3, 8, 6, 0.98) 100%);
          z-index: 2;
        }
        .hero-content {
          position: relative;
          z-index: 3;
          max-width: 800px;
        }
        .hero-tagline {
          display: inline-block;
          color: var(--mint-accent);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
          padding: 0.35rem 1rem;
          background-color: rgba(93, 202, 165, 0.08);
          border-radius: var(--radius-full);
          border: 1px solid rgba(93, 202, 165, 0.2);
        }
        .hero-content h1 {
          font-size: 4rem;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }
        .hero-content p {
          color: var(--gris-texto);
          font-size: 1.25rem;
          line-height: 1.6;
          margin-bottom: 2.5rem;
        }
        .hero-ctas {
          display: flex;
          gap: 1.25rem;
          flex-wrap: wrap;
        }
        .btn-lg {
          padding: 1rem 2.5rem;
          font-size: 1.05rem;
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
            font-size: 2.5rem;
          }
          .hero-content p {
            font-size: 1.1rem;
          }
          .hero-ctas {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
