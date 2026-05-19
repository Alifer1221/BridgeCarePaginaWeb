"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredSpecialties, Specialty } from "@/lib/db";

export default function Home() {
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

  return (
    <div className="home-container">
      {/* Aurora Ambient Glow Spheres */}
      <div className="glow-sphere glow-1"></div>
      <div className="glow-sphere glow-2"></div>

      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container hero-content animate-fade-in">
          <span className="hero-tagline">Turismo Médico Seguro e Integral</span>
          <h1>Tu salud y bienestar, en manos expertas en Colombia</h1>
          <p>
            Conectamos pacientes internacionales con cirujanos de élite y clínicas acreditadas internacionalmente. Ahorra hasta un 70% en tratamientos de primer nivel.
          </p>
          <div className="hero-ctas">
            <Link href="/contacto" className="btn btn-accent btn-lg">
              Consulta Gratis
            </Link>
            <Link href="/nosotros#paquetes" className="btn btn-secondary btn-lg">
              Ver Paquetes Todo Incluido
            </Link>
          </div>
        </div>
      </section>

      {/* 2. POR QUÉ COLOMBIA */}
      <section className="section why-colombia-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">Excelencia e Innovación</span>
            <h2>¿Por qué elegir Colombia para tu procedimiento?</h2>
            <div className="header-bar"></div>
            <p className="section-desc">
              Colombia es el hub médico de mayor crecimiento en Latinoamérica, combinando tecnología de vanguardia, profesionales titulados internacionalmente y una inigualable hospitalidad.
            </p>
          </div>

          <div className="grid grid-3 why-grid">
            <div className="why-card glass-card">
              <div className="why-icon-box">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="why-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
              </div>
              <h3>Cirujanos Certificados</h3>
              <p>Profesionales miembros de juntas médicas y asociaciones de renombre mundial, con entrenamientos avanzados en EE. UU. y Europa.</p>
            </div>

            <div className="why-card glass-card">
              <div className="why-icon-box">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="why-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3>Costos Competitivos</h3>
              <p>Procedimientos premium que representan un ahorro de entre el 50% y 70% en comparación con los costos de EE. UU. o Canadá.</p>
            </div>

            <div className="why-card glass-card">
              <div className="why-icon-box">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="why-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-10.5h16.5m-16.5 3h16.5m-16.5 3h16.5M12 3v1.5m0 2v.5m0 1.5v.5m0 1.5V12" />
                </svg>
              </div>
              <h3>Clínicas Acreditadas</h3>
              <p>Infraestructura clínica equipada con tecnología de punta y acreditaciones internacionales que garantizan la máxima seguridad del paciente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ESPECIALIDADES VISTA RÁPIDA */}
      <section className="section specialties-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">Nuestros Procedimientos</span>
            <h2>Especialidades Médicas y Estéticas</h2>
            <div className="header-bar"></div>
            <p className="section-desc">
              Ofrecemos soluciones integrales y personalizadas para cada necesidad. Explora nuestras principales áreas de tratamiento.
            </p>
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
                  <h3>{spec.name}</h3>
                  <p>{spec.description}</p>
                  <Link href={`/specialties/${spec.id}`} className="spec-link">
                    Saber más <span className="spec-link-arrow">&rarr;</span>
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
            <span className="section-subtitle">Paso a Paso</span>
            <h2>¿Cómo funciona tu viaje médico con Bridge Care?</h2>
            <div className="header-bar"></div>
            <p className="section-desc">
              Nos encargamos de toda la logística médica y de viaje para que puedas concentrarte exclusivamente en tu salud y recuperación.
            </p>
          </div>

          <div className="workflow-steps">
            <div className="step-item">
              <div className="step-num">1</div>
              <div className="step-content">
                <h3>Consulta y Diagnóstico Virtual</h3>
                <p>Envía tus fotos, radiografías o historia clínica. Realizaremos una videollamada de valoración gratuita con el especialista idóneo para diseñar tu plan de tratamiento.</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-num">2</div>
              <div className="step-content">
                <h3>Planificación y Agenda</h3>
                <p>Te enviamos una cotización detallada de tu tratamiento y opciones de hospedaje. Coordinamos las fechas médicas y de vuelo adaptándolas a tu agenda.</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-num">3</div>
              <div className="step-content">
                <h3>Viaje y Procedimiento</h3>
                <p>A tu llegada, un chofer de Bridge Care te recogerá y te acompañará a tu hospedaje. Te acompañamos en tu consulta prequirúrgica, tu cirugía y tus controles.</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-num">4</div>
              <div className="step-content">
                <h3>Recuperación y Retorno</h3>
                <p>Te asistimos durante tu postoperatorio en hoteles adaptados para recuperación. Una vez dado de alta por el médico, retornas a casa con seguimiento virtual remoto.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIOS */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">Pacientes Satisfechos</span>
            <h2>Historias que Transforman Vidas</h2>
            <div className="header-bar"></div>
            <p className="section-desc">
              Conoce las opiniones y experiencias de pacientes internacionales que confiaron su salud y bienestar a Bridge Care en Colombia.
            </p>
          </div>

          <div className="grid grid-3 testimonials-grid">
            <div className="testimonial-card glass-card">
              <div className="stars">★★★★★</div>
              <p className="testimonial-text">
                "Viajar a Medellín para mi diseño de sonrisa fue la mejor decisión. Ahorré más del 60% en comparación con Miami y la tecnología de la clínica dental me dejó impresionada. El equipo de Bridge Care me acompañó desde el primer día."
              </p>
              <div className="patient-info">
                <div className="patient-name">Sarah Jenkins</div>
                <div className="patient-origin">Miami, EE. UU. (Tratamiento Odontológico)</div>
              </div>
            </div>

            <div className="testimonial-card glass-card">
              <div className="stars">★★★★★</div>
              <p className="testimonial-text">
                "Mi cirugía bariátrica en Cali fue un éxito rotundo. El cirujano es de primera categoría y la clínica Valle del Lili cuenta con estándares de seguridad increíbles. Bajé 35 kilos y recuperé mi salud. ¡Altamente recomendado!"
              </p>
              <div className="patient-info">
                <div className="patient-name">David L. Miller</div>
                <div className="patient-origin">New York, EE. UU. (Bypass Gástrico)</div>
              </div>
            </div>

            <div className="testimonial-card glass-card">
              <div className="stars">★★★★★</div>
              <p className="testimonial-text">
                "Me realicé una lipoescultura y abdominoplastia en Bogotá. Estaba muy nerviosa de viajar sola, pero Bridge Care se encargó de toda la logística, enfermería y traslados. El hotel de recuperación era fabuloso. ¡Un servicio de 5 estrellas!"
              </p>
              <div className="patient-info">
                <div className="patient-name">Elena Rodriguez</div>
                <div className="patient-origin">Madrid, España (Cirugía Estética)</div>
              </div>
            </div>
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
        .hero-section {
          position: relative;
          background-image: url('https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1920');
          background-size: cover;
          background-position: center;
          color: var(--white);
          padding: 10rem 0 7rem 0;
          display: flex;
          align-items: center;
          min-height: 85vh;
        }
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(3, 8, 6, 0.95) 0%, rgba(10, 74, 66, 0.55) 100%);
          z-index: 1;
        }
        .hero-content {
          position: relative;
          z-index: 2;
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
          padding: 3rem 2.25rem;
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
          font-size: 1.4rem;
          margin-bottom: 1rem;
        }
        .why-card p {
          font-size: 0.95rem;
          margin-bottom: 0;
          color: var(--gris-texto);
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
          font-size: 1.2rem;
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
