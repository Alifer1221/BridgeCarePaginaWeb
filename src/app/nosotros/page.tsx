"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredBlogPosts, BlogPost } from "@/lib/db";

type TabId = "quienes-somos" | "red-medica" | "paquetes" | "garantias" | "blog-faq";

export default function Nosotros() {
  const [activeTab, setActiveTab] = useState<TabId>("quienes-somos");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setBlogPosts(getStoredBlogPosts());

    const handleUpdate = () => {
      setBlogPosts(getStoredBlogPosts());
    };
    window.addEventListener("bc_db_update", handleUpdate);

    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (["quienes-somos", "red-medica", "paquetes", "garantias", "blog-faq"].includes(hash)) {
        setActiveTab(hash as TabId);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    
    return () => {
      window.removeEventListener("bc_db_update", handleUpdate);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const selectTab = (tab: TabId) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", `#${tab}`);
    }
  };

  return (
    <div className="nosotros-page">
      <div className="glow-sphere glow-1"></div>

      <section className="nosotros-hero">
        <div className="container text-center">
          <span className="nosotros-subtitle">Conoce Bridge Care</span>
          <h1>Excelencia Médica sin Fronteras</h1>
          <div className="header-bar"></div>
          <p className="nosotros-hero-desc">
            Te acompañamos en tu proceso de salud y recuperación, brindándote tranquilidad, confort y acceso a la mejor medicina de Colombia.
          </p>
        </div>
      </section>

      {/* TABS NAVIGATION */}
      <section className="tabs-nav-section">
        <div className="container">
          <div className="tabs-list glass-card">
            <button 
              className={`tab-btn ${activeTab === "quienes-somos" ? "active" : ""}`}
              onClick={() => selectTab("quienes-somos")}
            >
              Quiénes Somos
            </button>
            <button 
              className={`tab-btn ${activeTab === "red-medica" ? "active" : ""}`}
              onClick={() => selectTab("red-medica")}
            >
              Red Médica y Clínicas
            </button>
            <button 
              className={`tab-btn ${activeTab === "paquetes" ? "active" : ""}`}
              onClick={() => selectTab("paquetes")}
            >
              Paquetes Todo Incluido
            </button>
            <button 
              className={`tab-btn ${activeTab === "garantias" ? "active" : ""}`}
              onClick={() => selectTab("garantias")}
            >
              Seguridad y Garantías
            </button>
            <button 
              className={`tab-btn ${activeTab === "blog-faq" ? "active" : ""}`}
              onClick={() => selectTab("blog-faq")}
            >
              Blog y FAQ
            </button>
          </div>
        </div>
      </section>

      {/* TAB CONTENTS */}
      <section className="section tab-content-section">
        <div className="container">
          
          {/* 1. QUIÉNES SOMOS */}
          {activeTab === "quienes-somos" && (
            <div className="tab-pane animate-fade-in">
              <div className="two-col-layout">
                <div className="text-pane glass-card info-card-padding">
                  <h2>Nuestra Misión y Visión</h2>
                  <p className="lead-text">
                    Bridge Care nace con el propósito de derribar las barreras geográficas y económicas de la salud, actuando como un puente transparente y seguro hacia la medicina de élite en Colombia.
                  </p>
                  <p>
                    Entendemos que viajar para someterse a un procedimiento médico requiere de una confianza absoluta. Por ello, no somos solo intermediarios: somos tu equipo de soporte integral en destino. Nos encargamos de coordinar tus citas, seleccionar a los mejores profesionales certificados y supervisar cada detalle de tu estadía y recuperación.
                  </p>
                  <p>
                    Nuestros valores fundamentales se centran en la <strong>seguridad del paciente</strong>, la <strong>transparencia de costos</strong> y la <strong>empatía humana</strong> en cada interacción.
                  </p>
                </div>
                <div className="image-pane">
                  <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800" alt="Médicos Bridge Care" className="pane-img" />
                </div>
              </div>
            </div>
          )}

          {/* 2. RED MÉDICA Y CLÍNICAS */}
          {activeTab === "red-medica" && (
            <div className="tab-pane animate-fade-in">
              <h2>Profesionales y Centros de Alta Complejidad</h2>
              <p className="section-intro">
                Trabajamos exclusivamente con especialistas certificados que cuentan con credenciales verificables y clínicas autorizadas por los entes gubernamentales.
              </p>

              <div className="grid grid-2 medical-grid">
                <div className="medical-card glass-card">
                  <h3>Nuestros Especialistas</h3>
                  <p>
                    Todos nuestros cirujanos plásticos, odontólogos estéticos y cirujanos bariátricos pertenecen a las sociedades científicas oficiales de Colombia (ej. SCCP, FOC). Cuentan con un promedio de más de 12 años de experiencia y son bilingües.
                  </p>
                  <ul className="accent-list">
                    <li>Miembros SCCP (Sociedad Colombiana de Cirugía Plástica)</li>
                    <li>Especialistas en Implantología CAD/CAM digital</li>
                    <li>Certificaciones internacionales y de prestigio</li>
                  </ul>
                </div>

                <div className="medical-card glass-card">
                  <h3>Infraestructura Hospitalaria</h3>
                  <p>
                    Las cirugías de alta complejidad se realizan en clínicas que cuentan con unidades de cuidados intensivos (UCI) propias, quirófanos inteligentes y laboratorios clínicos integrados, asegurando la máxima protección ante cualquier eventualidad.
                  </p>
                  <ul className="accent-list">
                    <li>Clínica El Tesoro (Medellín) - Acreditación de vanguardia</li>
                    <li>Fundación Santa Fe (Bogotá) - Certificación Joint Commission</li>
                    <li>Hospital Valle del Lili (Cali) - Catalogado entre los mejores de LATAM</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 3. PAQUETES TODO INCLUIDO */}
          {activeTab === "paquetes" && (
            <div className="tab-pane animate-fade-in">
              <h2>Viaja sin Preocupaciones: Todo está Cubierto</h2>
              <p className="section-intro">
                Nuestros paquetes están diseñados para brindarte un servicio tipo conserjería. Desde tu llegada al aeropuerto hasta tu regreso a casa.
              </p>

              <div className="grid grid-3 packages-grid">
                <div className="package-card glass-card">
                  <div className="package-header">
                    <h3>Plan Básico de Soporte</h3>
                    <div className="package-subtitle">Logística Médica</div>
                  </div>
                  <ul className="package-features">
                    <li>Valoración y cotización formal</li>
                    <li>Asignación de cirujano certificado</li>
                    <li>Gestión de citas médicas y quirúrgicas</li>
                    <li>Acompañamiento telefónico 24/7</li>
                    <li>Traducción de historial médico</li>
                  </ul>
                  <div className="package-footer">
                    <Link href="/contacto" className="btn btn-secondary btn-sm w-full">Solicitar Información</Link>
                  </div>
                </div>

                <div className="package-card glass-card featured-package">
                  <div className="package-tag">MÁS POPULAR</div>
                  <div className="package-header">
                    <h3>Plan Integral Premium</h3>
                    <div className="package-subtitle">Logística + Traslados + Hotel</div>
                  </div>
                  <ul className="package-features">
                    <li><strong>Todo lo del Plan Básico</strong></li>
                    <li>Chofer privado bilingüe en destino</li>
                    <li>Hospedaje de 10 noches en hotel aliado</li>
                    <li>Alimentación balanceada postoperatoria</li>
                    <li>Enfermera bilingüe para curaciones</li>
                    <li>Seguro médico de complicaciones</li>
                  </ul>
                  <div className="package-footer">
                    <Link href="/contacto" className="btn btn-accent btn-sm w-full">Cotizar Plan Premium</Link>
                  </div>
                </div>

                <div className="package-card glass-card">
                  <div className="package-header">
                    <h3>Plan VIP Deluxe</h3>
                    <div className="package-subtitle">Experiencia 5 Estrellas</div>
                  </div>
                  <ul className="package-features">
                    <li><strong>Todo lo del Plan Premium</strong></li>
                    <li>Hospedaje en Suite Ejecutiva 5 estrellas</li>
                    <li>Servicio de enfermería privada 24 horas</li>
                    <li>Tours turísticos suaves post-alta</li>
                    <li>Gestión de pasajes aéreos y maletas</li>
                    <li>Asistente personal en destino</li>
                  </ul>
                  <div className="package-footer">
                    <Link href="/contacto" className="btn btn-secondary btn-sm w-full">Solicitar VIP</Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. SEGURIDAD Y GARANTÍAS */}
          {activeTab === "garantias" && (
            <div className="tab-pane animate-fade-in">
              <div className="two-col-layout">
                <div className="text-pane glass-card info-card-padding">
                  <h2>Pólizas de Seguridad y Calidad Verificada</h2>
                  <p className="lead-text">
                    La tranquilidad del paciente es nuestro indicador de éxito. Implementamos un protocolo de tres capas de protección médica y legal.
                  </p>
                  
                  <div className="safety-layers">
                    <div className="safety-layer-item">
                      <h4>1. Filtro de Especialista</h4>
                      <p>No trabajamos con médicos generales que realizan procedimientos estéticos. Únicamente cirujanos con especializaciones universitarias oficiales y membresías activas en la sociedad de su área.</p>
                    </div>

                    <div className="safety-layer-item">
                      <h4>2. Seguro de Complicaciones Internacionales</h4>
                      <p>Incluimos en nuestros paquetes premium una póliza de seguro médico internacional que cubre gastos adicionales derivados de imprevistos quirúrgicos, garantizando protección financiera completa.</p>
                    </div>

                    <div className="safety-layer-item">
                      <h4>3. Historial de Consentimientos Claros</h4>
                      <p>Proporcionamos toda la documentación de consentimientos informados traducida, permitiéndote tomar decisiones informadas antes de salir de tu país de origen.</p>
                    </div>
                  </div>
                </div>
                <div className="image-pane">
                  <img src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=800" alt="Seguridad médica" className="pane-img" />
                </div>
              </div>
            </div>
          )}

          {/* 5. BLOG Y FAQ */}
          {activeTab === "blog-faq" && (
            <div className="tab-pane animate-fade-in">
              <h2>Blog de Bridge Care</h2>
              <p className="section-intro">Mantente informado con artículos redactados por nuestro equipo médico asesor.</p>

              <div className="grid grid-3 blog-grid">
                {mounted && blogPosts.map((post) => (
                  <article key={post.id} className="blog-card glass-card">
                    <div className="blog-card-meta">
                      <span className="blog-cat">{post.category}</span>
                      <span className="blog-date">{post.date}</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <p className="blog-content-preview">{post.content.substring(0, 120)}...</p>
                    <div className="blog-footer">
                      <span className="blog-author">Por: {post.author}</span>
                    </div>
                  </article>
                ))}
              </div>

              {/* MOCK FAQ */}
              <div className="faq-wrapper">
                <h2>Preguntas Frecuentes</h2>
                <div className="faq-list">
                  <div className="faq-item glass-card">
                    <h4>¿Necesito visa para viajar a Colombia por tratamiento médico?</h4>
                    <p>Los ciudadanos de EE. UU., Canadá, la Unión Europea y la mayoría de países de Latinoamérica no requieren visa para estadías de turismo o tratamientos médicos cortos inferiores a 90 días; solo necesitan su pasaporte vigente.</p>
                  </div>
                  <div className="faq-item glass-card">
                    <h4>¿Cómo realizan el seguimiento cuando regrese a mi país?</h4>
                    <p>Coordinamos un calendario de revisiones virtuales por videollamada durante los primeros 3 a 6 meses. Además, te facilitamos un informe médico detallado para que puedas compartirlo con tu doctor local en caso de ser necesario.</p>
                  </div>
                  <div className="faq-item glass-card">
                    <h4>¿Por qué son tan bajos los precios en comparación con EE. UU.?</h4>
                    <p>La diferencia de costos radica principalmente en el menor costo operativo de las clínicas en Colombia, el valor de la moneda local (Peso Colombiano) frente al Dólar, y costos significativamente menores en seguros de mala práctica para los médicos.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      <style jsx>{`
        .nosotros-page {
          position: relative;
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
          left: -100px;
        }

        .nosotros-hero {
          background-color: transparent;
          color: var(--white);
          padding: 8rem 0 4rem 0;
        }
        .nosotros-subtitle {
          color: var(--mint-accent);
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 0.15em;
          margin-bottom: 0.5rem;
          display: block;
        }
        .nosotros-hero h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        .header-bar {
          width: 50px;
          height: 3px;
          background: linear-gradient(90deg, var(--teal-primary), var(--mint-accent));
          margin: 1.25rem auto;
          border-radius: 2px;
        }
        .nosotros-hero-desc {
          max-width: 600px;
          margin: 0 auto;
          color: var(--gris-texto);
          font-size: 1.1rem;
        }

        /* TABS BUTTONS */
        .tabs-nav-section {
          background-color: transparent;
          position: sticky;
          top: 100px;
          z-index: 100;
          padding: 1rem 0;
        }
        .tabs-list {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding: 0.6rem;
          border-radius: var(--radius-full);
          background: rgba(10, 31, 26, 0.6) !important;
        }
        .tabs-list:hover {
          transform: none;
          box-shadow: var(--shadow-md);
        }
        .tab-btn {
          background: transparent;
          border: none;
          padding: 0.65rem 1.5rem;
          font-family: inherit;
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--gris-texto);
          cursor: pointer;
          border-radius: var(--radius-full);
          transition: var(--transition-fast);
        }
        .tab-btn:hover {
          color: var(--mint-accent);
          background-color: rgba(93, 202, 165, 0.08);
        }
        .tab-btn.active {
          color: var(--negro-suave);
          background: linear-gradient(135deg, var(--teal-primary) 0%, var(--mint-accent) 100%);
          font-weight: 700;
        }

        .tab-content-section {
          background-color: transparent;
          padding-top: 2rem;
        }
        .tab-pane h2 {
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          color: var(--white);
        }
        
        .two-col-layout {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 3.5rem;
          align-items: center;
          position: relative;
          z-index: 10;
        }
        .info-card-padding {
          padding: 3rem 2.5rem;
        }
        .info-card-padding:hover {
          transform: none;
        }
        .lead-text {
          font-size: 1.15rem;
          font-weight: 500;
          color: var(--mint-accent);
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }
        .pane-img {
          width: 100%;
          border-radius: var(--radius-lg);
          border: 1px solid rgba(93, 202, 165, 0.15);
          box-shadow: var(--shadow-lg);
        }

        /* Medical Grid */
        .section-intro {
          font-size: 1.1rem;
          margin-bottom: 2.5rem;
          max-width: 800px;
        }
        .medical-card {
          padding: 2.5rem;
        }
        .medical-card h3 {
          font-size: 1.4rem;
          margin-bottom: 1.25rem;
          color: var(--mint-accent);
        }
        .accent-list {
          list-style: none;
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .accent-list li {
          position: relative;
          padding-left: 1.75rem;
          font-size: 0.95rem;
        }
        .accent-list li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: var(--mint-accent);
          font-weight: bold;
          font-size: 1.1rem;
        }

        /* Package Cards */
        .packages-grid {
          align-items: stretch;
          position: relative;
          z-index: 10;
        }
        .package-card {
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .package-header {
          border-bottom: 1px solid rgba(93, 202, 165, 0.15);
          padding-bottom: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .package-header h3 {
          font-size: 1.3rem;
          margin-bottom: 0.25rem;
        }
        .package-subtitle {
          font-size: 0.85rem;
          color: var(--gris-texto);
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.05em;
        }
        .package-features {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          font-size: 0.9rem;
          margin-bottom: 2.5rem;
          flex-grow: 1;
          color: var(--gris-texto);
        }
        .package-features li {
          position: relative;
          padding-left: 1.5rem;
        }
        .package-features li::before {
          content: "•";
          color: var(--mint-accent);
          position: absolute;
          left: 0;
          font-size: 1.5rem;
          line-height: 0.8;
        }
        .featured-package {
          border: 2px solid var(--mint-accent);
          transform: translateY(-8px);
          box-shadow: 0 16px 40px rgba(93, 202, 165, 0.15);
        }
        .featured-package:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 48px rgba(93, 202, 165, 0.25);
        }
        .package-tag {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, var(--teal-primary) 0%, var(--mint-accent) 100%);
          color: var(--negro-suave);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.3rem 1.2rem;
          border-radius: var(--radius-full);
          letter-spacing: 0.05em;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .btn-sm {
          padding: 0.6rem 1.5rem;
          font-size: 0.85rem;
        }

        /* Safety Layer */
        .safety-layers {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .safety-layer-item h4 {
          color: var(--white);
          font-size: 1.15rem;
          margin-bottom: 0.35rem;
        }
        .safety-layer-item p {
          font-size: 0.9rem;
          margin-bottom: 0;
          color: var(--gris-texto);
        }

        /* Blog Section */
        .blog-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
        }
        .blog-card-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--mint-accent);
          margin-bottom: 1.25rem;
        }
        .blog-card h3 {
          font-size: 1.3rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        .blog-card p {
          font-size: 0.85rem;
          color: var(--gris-texto);
          margin-bottom: 1.25rem;
        }
        .blog-content-preview {
          font-size: 0.85rem;
          color: rgba(163, 184, 180, 0.7) !important;
          flex-grow: 1;
        }
        .blog-footer {
          border-top: 1px solid rgba(93, 202, 165, 0.15);
          padding-top: 1rem;
          margin-top: 1.25rem;
        }
        .blog-author {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--white);
        }

        /* FAQ Styling */
        .faq-wrapper {
          margin-top: 5rem;
          border-top: 1px solid rgba(93, 202, 165, 0.15);
          padding-top: 4rem;
        }
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          margin-top: 2.5rem;
        }
        .faq-item {
          padding: 2rem;
        }
        .faq-item:hover {
          transform: translateY(-2px);
        }
        .faq-item h4 {
          font-size: 1.2rem;
          color: var(--mint-accent);
          margin-bottom: 0.75rem;
        }
        .faq-item p {
          font-size: 0.95rem;
          margin-bottom: 0;
          color: var(--gris-texto);
          line-height: 1.6;
        }
        .w-full {
          width: 100%;
        }

        @media (max-width: 992px) {
          .two-col-layout {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .featured-package {
            transform: none;
          }
          .featured-package:hover {
            transform: translateY(-4px);
          }
          .packages-grid {
            gap: 3rem;
          }
          .tabs-list {
            border-radius: var(--radius-md);
          }
          .tab-btn {
            width: 100%;
            border-radius: var(--radius-sm);
          }
        }
      `}</style>
    </div>
  );
}
