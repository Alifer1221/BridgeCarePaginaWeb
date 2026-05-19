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
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container hero-content animate-fade-in">
          <span className="hero-tagline">Turismo Médico Seguro e Integral</span>
          <h1>Tu salud y bienestar, en manos expertas en Colombia</h1>
          <p>
            Conectamos pacientes internacionales con cirujanos de élite y clínicas acreditadas internacionalmente. Ahorra hasta un 70% en tratamientos médicos, odontológicos y estéticos de primer nivel.
          </p>
          <div className="hero-ctas">
            <Link href="/contacto" className="btn btn-accent btn-lg">
              Consulta Gratis
            </Link>
            <Link href="/nosotros#paquetes" className="btn btn-white btn-lg">
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
            <div className="why-card">
              <div className="why-icon-box">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="why-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
              </div>
              <h3>Cirujanos Certificados</h3>
              <p>Profesionales miembros de juntas médicas y asociaciones de renombre mundial, con entrenamientos avanzados en EE. UU. y Europa.</p>
            </div>

            <div className="why-card">
              <div className="why-icon-box">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="why-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3>Costos Competitivos</h3>
              <p>Procedimientos premium que representan un ahorro de entre el 50% y 70% en comparación con los costos de EE. UU. o Canadá.</p>
            </div>

            <div className="why-card">
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
              <div key={spec.id} className="specialty-card">
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
            <span className="section-subtitle" style={{ color: "var(--mint-accent)" }}>Paso a Paso</span>
            <h2 style={{ color: "var(--white)" }}>¿Cómo funciona tu viaje médico con Bridge Care?</h2>
            <div className="header-bar" style={{ backgroundColor: "var(--mint-accent)" }}></div>
            <p className="section-desc" style={{ color: "rgba(245, 245, 245, 0.8)" }}>
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
            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p className="testimonial-text">
                "Viajar a Medellín para mi diseño de sonrisa fue la mejor decisión. Ahorré más del 60% en comparación con Miami y la tecnología de la clínica dental me dejó impresionada. El equipo de Bridge Care me acompañó desde el primer día."
              </p>
              <div className="patient-info">
                <div className="patient-name">Sarah Jenkins</div>
                <div className="patient-origin">Miami, EE. UU. (Tratamiento Odontológico)</div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p className="testimonial-text">
                "Mi cirugía bariátrica en Cali fue un éxito rotundo. El cirujano es de primera categoría y la clínica Valle del Lili cuenta con estándares de seguridad increíbles. Bajé 35 kilos y recuperé mi salud. ¡Altamente recomendado!"
              </p>
              <div className="patient-info">
                <div className="patient-name">David L. Miller</div>
                <div className="patient-origin">New York, EE. UU. (Bypass Gástrico)</div>
              </div>
            </div>

            <div className="testimonial-card">
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
        /* Hero Styling */
        .hero-section {
          position: relative;
          background-image: url('https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1920');
          background-size: cover;
          background-position: center;
          color: var(--white);
          padding: 8rem 0;
          display: flex;
          align-items: center;
          min-height: 80vh;
        }
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(10, 31, 26, 0.9) 0%, rgba(10, 74, 66, 0.7) 100%);
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
          letter-spacing: 0.1em;
          font-size: 0.85rem;
          margin-bottom: 1.25rem;
          padding: 0.35rem 1rem;
          background-color: rgba(93, 202, 165, 0.1);
          border-radius: var(--radius-sm);
          border: 1px solid rgba(93, 202, 165, 0.2);
        }
        .hero-content h1 {
          color: var(--white);
          font-size: 3.5rem;
          line-height: 1.15;
          margin-bottom: 1.5rem;
        }
        .hero-content p {
          color: rgba(245, 245, 245, 0.9);
          font-size: 1.2rem;
          line-height: 1.6;
          margin-bottom: 2.5rem;
        }
        .hero-ctas {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .btn-lg {
          padding: 1rem 2.25rem;
          font-size: 1.05rem;
        }

        /* Section Headers */
        .section-header {
          max-width: 700px;
          margin: 0 auto 4rem auto;
        }
        .text-center {
          text-align: center;
        }
        .section-subtitle {
          color: var(--teal-primary);
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          margin-bottom: 0.5rem;
          display: block;
        }
        .header-bar {
          width: 60px;
          height: 3px;
          background-color: var(--teal-primary);
          margin: 1rem auto 1.5rem auto;
          border-radius: 2px;
        }
        .section-desc {
          font-size: 1.1rem;
          color: var(--gris-texto);
        }

        /* Por qué Colombia */
        .why-colombia-section {
          background-color: var(--white);
        }
        .why-card {
          background-color: var(--blanco-hueso);
          padding: 2.5rem 2rem;
          border-radius: var(--radius-md);
          border: 1px solid rgba(10, 31, 26, 0.03);
          transition: var(--transition);
        }
        .why-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-md);
          border-color: rgba(29, 122, 110, 0.15);
        }
        .why-icon-box {
          background-color: rgba(29, 122, 110, 0.1);
          color: var(--teal-primary);
          width: 50px;
          height: 50px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .why-icon {
          width: 28px;
          height: 28px;
        }
        .why-card h3 {
          font-size: 1.3rem;
          margin-bottom: 1rem;
        }
        .why-card p {
          font-size: 0.95rem;
          margin-bottom: 0;
        }

        /* Specialties Cards */
        .specialties-section {
          background-color: var(--blanco-hueso);
        }
        .specialty-card {
          background-color: var(--white);
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
          border: 1px solid rgba(10, 31, 26, 0.02);
          display: flex;
          flex-direction: column;
        }
        .specialty-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-lg);
          border-color: rgba(93, 202, 165, 0.25);
        }
        .spec-card-img {
          height: 200px;
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
          background: linear-gradient(to bottom, rgba(10,31,26,0) 40%, rgba(10,31,26,0.4) 100%);
        }
        .spec-card-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .spec-card-content h3 {
          font-size: 1.2rem;
          margin-bottom: 0.75rem;
        }
        .spec-card-content p {
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          flex-grow: 1;
        }
        .spec-link {
          color: var(--teal-primary);
          font-weight: 600;
          font-size: 0.9rem;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
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
          left: 10%;
          right: 10%;
          height: 2px;
          background-color: rgba(93, 202, 165, 0.2);
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
          background-color: var(--teal-dark);
          color: var(--mint-accent);
          border: 2px solid var(--mint-accent);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
          transition: var(--transition);
          box-shadow: 0 0 15px rgba(93, 202, 165, 0.1);
        }
        .step-item:hover .step-num {
          background-color: var(--mint-accent);
          color: var(--verde-noche);
          transform: scale(1.1);
          box-shadow: 0 0 25px rgba(93, 202, 165, 0.4);
        }
        .step-content h3 {
          font-size: 1.15rem;
          margin-bottom: 0.75rem;
        }
        .step-content p {
          font-size: 0.9rem;
          margin-bottom: 0;
        }

        /* Testimonials */
        .testimonials-section {
          background-color: var(--white);
        }
        .testimonial-card {
          background-color: var(--blanco-hueso);
          padding: 2.25rem;
          border-radius: var(--radius-md);
          border: 1px solid rgba(10, 31, 26, 0.03);
          box-shadow: var(--shadow-sm);
        }
        .stars {
          color: #FFD700;
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }
        .testimonial-text {
          font-size: 0.95rem;
          font-style: italic;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .patient-info {
          border-top: 1px solid var(--light-gray);
          padding-top: 1rem;
        }
        .patient-name {
          font-weight: 600;
          color: var(--negro-suave);
          font-size: 0.95rem;
        }
        .patient-origin {
          font-size: 0.8rem;
          color: var(--gris-texto);
        }

        /* Mobile adaptation */
        @media (max-width: 992px) {
          .hero-content h1 { font-size: 2.75rem; }
          .workflow-steps {
            grid-template-columns: 1fr;
            gap: 3rem;
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
          .hero-section {
            padding: 5rem 0;
          }
          .hero-content h1 {
            font-size: 2.25rem;
          }
          .hero-content p {
            font-size: 1.05rem;
          }
          .hero-ctas {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
