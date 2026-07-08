"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredBlogPosts, BlogPost } from "@/lib/db";
import { useLanguage } from "@/context/LanguageContext";

type TabId = "quienes-somos" | "red-medica" | "paquetes" | "garantias" | "blog-faq";

const faqs = [
  {
    qEs: "¿Necesito visa para viajar a Colombia por tratamiento médico?",
    qEn: "Do I need a visa to travel to Colombia for medical treatment?",
    aEs: "Los ciudadanos de EE. UU., Canadá, la Unión Europea y la mayoría de países de Latinoamérica no requieren visa para estadías de turismo o tratamientos médicos cortos inferiores a 90 días; solo necesitan su pasaporte vigente.",
    aEn: "Citizens of the US, Canada, the European Union, and most Latin American countries do not require a visa for tourism or short medical treatments under 90 days; they only need a valid passport."
  },
  {
    qEs: "¿Cómo realizan el seguimiento cuando regrese a mi país?",
    qEn: "How do you handle follow-ups when I return to my home country?",
    aEs: "Coordinamos un calendario de revisiones virtuales por videollamada durante los primeros 3 a 6 meses. Además, te facilitamos un informe médico detallado para que puedas compartirlo con tu doctor local en caso de ser necesario.",
    aEn: "We coordinate a calendar of virtual check-ups via video call during the first 3 to 6 months. Additionally, we provide a detailed medical report for you to share with your local doctor if needed."
  },
  {
    qEs: "¿Por qué son tan bajos los precios en comparación con EE. UU.?",
    qEn: "Why are prices so low compared to the United States?",
    aEs: "La diferencia de costos radica principalmente en el menor costo operativo de las clínicas en Colombia, el valor de la moneda local (Peso Colombiano) frente al Dólar, y costos significativamente menores en seguros de mala práctica para los médicos.",
    aEn: "The cost difference is primarily due to lower operating expenses of clinics in Colombia, the exchange rate of the local currency (Colombian Peso) against the Dollar, and significantly lower malpractice insurance costs for physicians."
  }
];

export default function Nosotros() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabId>("quienes-somos");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [mounted, setMounted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

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
        <div className="hero-overlay"></div>
        <div className="container hero-content text-center">
          <span className="nosotros-subtitle">{t("about.title")}</span>
          <h1>
            {language === "es" ? "Excelencia Médica sin Fronteras" : "Medical Excellence Without Borders"}
          </h1>
          <div className="header-bar"></div>
          <p className="nosotros-hero-desc">{t("about.subtitle")}</p>
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
              {t("about.tab.who")}
            </button>
            <button 
              className={`tab-btn ${activeTab === "red-medica" ? "active" : ""}`}
              onClick={() => selectTab("red-medica")}
            >
              {language === "es" ? "Red Médica y Clínicas" : "Medical Network & Clinics"}
            </button>
            <button 
              className={`tab-btn ${activeTab === "paquetes" ? "active" : ""}`}
              onClick={() => selectTab("paquetes")}
            >
              {language === "es" ? "Paquetes Todo Incluido" : "All-Inclusive Packages"}
            </button>
            <button 
              className={`tab-btn ${activeTab === "garantias" ? "active" : ""}`}
              onClick={() => selectTab("garantias")}
            >
              {t("footer.guarantees")}
            </button>
            <button 
              className={`tab-btn ${activeTab === "blog-faq" ? "active" : ""}`}
              onClick={() => selectTab("blog-faq")}
            >
              {t("about.tab.blog")}
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
                  <h2>{language === "es" ? "Nuestra Misión y Visión" : "Our Mission & Vision"}</h2>
                  <p className="lead-text">{t("about.who.title")}</p>
                  <p>{t("about.who.p1")}</p>
                  <p>{t("about.who.p2")}</p>
                  <p>
                    {language === "es"
                      ? "Nuestros valores fundamentales se centran en la seguridad del paciente, la transparencia de costos y la empatía humana en cada interacción."
                      : "Our core values center on patient safety, cost transparency, and human empathy in every interaction."}
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
              <h2>{t("about.network.title")}</h2>
              <p className="section-intro">{t("about.network.p1")}</p>

              <div className="grid grid-2 medical-grid">
                <div className="medical-card glass-card">
                  <h3>
                    {language === "es" ? "Nuestros Especialistas" : "Our Specialists"}
                  </h3>
                  <p>
                    {language === "es"
                      ? "Todos nuestros cirujanos plásticos, odontólogos estéticos y cirujanos bariátricos pertenecen a las sociedades científicas oficiales de Colombia (ej. SCCP, FOC). Cuentan con un promedio de más de 12 años de experiencia y son bilingües."
                      : "All our plastic surgeons, cosmetic dentists, and bariatric surgeons belong to official scientific societies in Colombia (e.g. SCCP, FOC). They average over 12 years of experience and are bilingual."}
                  </p>
                  <ul className="accent-list">
                    <li>{t("about.network.li1")}</li>
                    <li>{t("about.network.li2")}</li>
                    <li>
                      {language === "es" 
                        ? "Certificaciones internacionales y de gran prestigio" 
                        : "Highly prestigious and international certifications"}
                    </li>
                  </ul>
                </div>

                <div className="medical-card glass-card">
                  <h3>
                    {language === "es" ? "Infraestructura Hospitalaria" : "Hospital Infrastructure"}
                  </h3>
                  <p>
                    {language === "es"
                      ? "Las cirugías de alta complejidad se realizan en clínicas que cuentan con unidades de cuidados intensivos (UCI) propias, quirófanos inteligentes y laboratorios clínicos integrados, asegurando la máxima protección ante cualquier eventualidad."
                      : "High-complexity surgeries are performed in clinics featuring their own intensive care units (ICU), smart operating rooms, and integrated clinical laboratories, ensuring maximum safety for any eventuality."}
                  </p>
                  <ul className="accent-list">
                    <li>
                      {language === "es"
                        ? "Clínica El Tesoro (Medellín) - Acreditación de vanguardia"
                        : "El Tesoro Clinic (Medellin) - Cutting-edge accreditation"}
                    </li>
                    <li>
                      {language === "es"
                        ? "Fundación Santa Fe (Bogotá) - Certificación Joint Commission"
                        : "Santa Fe Foundation (Bogota) - Joint Commission Certification"}
                    </li>
                    <li>{t("about.network.li3")}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 3. PAQUETES TODO INCLUIDO */}
          {activeTab === "paquetes" && (
            <div className="tab-pane animate-fade-in">
              <h2>
                {language === "es" ? "Viaja sin Preocupaciones: Todo está Cubierto" : "Travel Worry-Free: Everything is Covered"}
              </h2>
              <p className="section-intro">
                {language === "es"
                  ? "Nuestros paquetes están diseñados para brindarte un servicio tipo conserjería. Desde tu llegada al aeropuerto hasta tu regreso a casa."
                  : "Our packages are designed to provide you with concierge-style service. From your arrival at the airport to your return back home."}
              </p>

              <div className="grid grid-3 packages-grid">
                <div className="package-card glass-card">
                  <div className="package-header">
                    <h3>
                      {language === "es" ? "Plan Básico de Soporte" : "Basic Support Plan"}
                    </h3>
                    <div className="package-subtitle">
                      {language === "es" ? "Logística Médica" : "Medical Logistics"}
                    </div>
                  </div>
                  <ul className="package-features">
                    <li>
                      {language === "es" ? "Valoración y cotización formal" : "Evaluation and formal quote"}
                    </li>
                    <li>
                      {language === "es" ? "Asignación de cirujano certificado" : "Certified surgeon assignment"}
                    </li>
                    <li>
                      {language === "es" ? "Gestión de citas médicas y quirúrgicas" : "Medical & surgical appointment booking"}
                    </li>
                    <li>
                      {language === "es" ? "Acompañamiento telefónico 24/7" : "24/7 telephone support"}
                    </li>
                    <li>
                      {language === "es" ? "Traducción de historial médico" : "Medical history translation"}
                    </li>
                  </ul>
                  <div className="package-footer">
                    <Link href="/contacto" className="btn btn-secondary btn-sm w-full">
                      {language === "es" ? "Solicitar Información" : "Request Information"}
                    </Link>
                  </div>
                </div>

                <div className="package-card glass-card featured-package">
                  <div className="package-tag">
                    {language === "es" ? "MÁS POPULAR" : "MOST POPULAR"}
                  </div>
                  <div className="package-header">
                    <h3>
                      {language === "es" ? "Plan Integral Premium" : "Premium Comprehensive Plan"}
                    </h3>
                    <div className="package-subtitle">
                      {language === "es" ? "Logística + Traslados + Hotel" : "Logistics + Transfers + Hotel"}
                    </div>
                  </div>
                  <ul className="package-features">
                    <li>
                      <strong>
                        {language === "es" ? "Todo lo del Plan Básico" : "Everything in Basic Plan"}
                      </strong>
                    </li>
                    <li>{t("about.packages.li2")}</li>
                    <li>{t("about.packages.li1")}</li>
                    <li>
                      {language === "es" ? "Alimentación balanceada postoperatoria" : "Balanced post-operative meals"}
                    </li>
                    <li>{t("about.packages.li3")}</li>
                    <li>{t("about.guarantees.li1")}</li>
                  </ul>
                  <div className="package-footer">
                    <Link href="/contacto" className="btn btn-accent btn-sm w-full">
                      {language === "es" ? "Cotizar Plan Premium" : "Quote Premium Plan"}
                    </Link>
                  </div>
                </div>

                <div className="package-card glass-card">
                  <div className="package-header">
                    <h3>
                      {language === "es" ? "Plan VIP Deluxe" : "VIP Deluxe Plan"}
                    </h3>
                    <div className="package-subtitle">
                      {language === "es" ? "Experiencia 5 Estrellas" : "5-Star Experience"}
                    </div>
                  </div>
                  <ul className="package-features">
                    <li>
                      <strong>
                        {language === "es" ? "Todo lo del Plan Premium" : "Everything in Premium Plan"}
                      </strong>
                    </li>
                    <li>
                      {language === "es" ? "Hospedaje en Suite Ejecutiva 5 estrellas" : "5-star Executive Suite stay"}
                    </li>
                    <li>
                      {language === "es" ? "Servicio de enfermería privada 24 horas" : "24-hour private nursing service"}
                    </li>
                    <li>
                      {language === "es" ? "Tours turísticos suaves post-alta" : "Mild post-op sightseeing tours"}
                    </li>
                    <li>
                      {language === "es" ? "Gestión de pasajes aéreos y maletas" : "Airfare and baggage management"}
                    </li>
                    <li>
                      {language === "es" ? "Asistente personal en destino" : "Personal destination assistant"}
                    </li>
                  </ul>
                  <div className="package-footer">
                    <Link href="/contacto" className="btn btn-secondary btn-sm w-full">
                      {language === "es" ? "Solicitar VIP" : "Request VIP"}
                    </Link>
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
                  <h2>{t("about.guarantees.title")}</h2>
                  <p className="lead-text">{t("about.guarantees.p1")}</p>
                  
                  <div className="safety-layers">
                    <div className="safety-layer-item">
                      <h4>
                        {language === "es" ? "1. Filtro de Especialista" : "1. Specialist Screening"}
                      </h4>
                      <p>
                        {language === "es"
                          ? "No trabajamos con médicos generales que realizan procedimientos estéticos. Únicamente cirujanos con especializaciones universitarias oficiales y membresías activas en la sociedad de su área."
                          : "We do not work with general practitioners performing cosmetic procedures. Only surgeons with official university credentials and active memberships in their respective medical society."}
                      </p>
                    </div>

                    <div className="safety-layer-item">
                      <h4>
                        {language === "es" ? "2. Seguro de Complicaciones Internacionales" : "2. International Complications Insurance"}
                      </h4>
                      <p>
                        {language === "es"
                          ? "Incluimos en nuestros paquetes premium una póliza de seguro médico internacional que cubre gastos adicionales derivados de imprevistos quirúrgicos, garantizando protección financiera completa."
                          : "We include an international medical insurance policy in our premium packages that covers additional expenses arising from surgical emergencies, guaranteeing complete financial protection."}
                      </p>
                    </div>

                    <div className="safety-layer-item">
                      <h4>
                        {language === "es" ? "3. Historial de Consentimientos Claros" : "3. Clear Informed Consents"}
                      </h4>
                      <p>
                        {language === "es"
                          ? "Proporcionamos toda la documentación de consentimientos informados traducida, permitiéndote tomar decisiones informadas antes de salir de tu país de origen."
                          : "We provide all informed consent documentation fully translated, allowing you to make informed decisions before leaving your home country."}
                      </p>
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
              <h2>{language === "es" ? "Blog de Bridge Care" : "Bridge Care Blog"}</h2>
              <p className="section-intro">{t("about.blog.p1")}</p>

              <div className="grid grid-3 blog-grid">
                {mounted && blogPosts.map((post) => (
                  <article key={post.id} className="blog-card glass-card clickable-blog-card" onClick={() => setSelectedPost(post)}>
                    <div className="blog-card-meta">
                      <span className="blog-cat">
                        {language === "es" ? post.category : post.categoryEn}
                      </span>
                      <span className="blog-date">{post.date}</span>
                    </div>
                    <h3>{language === "es" ? post.title : post.titleEn}</h3>
                    <p>{language === "es" ? post.excerpt : post.excerptEn}</p>
                    <p className="blog-content-preview">
                      {(language === "es" ? post.content : post.contentEn).substring(0, 120)}...
                    </p>
                    <div className="blog-footer">
                      <span className="blog-author">
                        {language === "es" ? "Por" : "By"}: {post.author}
                      </span>
                      <span className="read-more-text">
                        {language === "es" ? "Leer más →" : "Read more →"}
                      </span>
                    </div>
                  </article>
                ))}
              </div>

              {/* MOCK FAQ ACCORDION */}
              <div className="faq-wrapper">
                <h2>{language === "es" ? "Preguntas Frecuentes" : "Frequently Asked Questions"}</h2>
                <div className="faq-list">
                  {faqs.map((faq, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div 
                        key={index} 
                        className={`faq-item glass-card accordion-item ${isOpen ? "active" : ""}`}
                        onClick={() => toggleFaq(index)}
                      >
                        <div className="faq-header">
                          <h4>
                            {language === "es" ? faq.qEs : faq.qEn}
                          </h4>
                          <span className="faq-arrow-icon">
                            ▼
                          </span>
                        </div>
                        <div className="faq-body">
                          <p>
                            {language === "es" ? faq.aEs : faq.aEn}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Blog Modal Reader */}
      {selectedPost && (
        <div className="blog-modal-overlay animate-fade-in" onClick={() => setSelectedPost(null)}>
          <div className="blog-modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedPost(null)} aria-label="Close">
              &times;
            </button>
            <div className="modal-header-meta">
              <span className="modal-category">
                {language === "es" ? selectedPost.category : selectedPost.categoryEn}
              </span>
              <span className="modal-date">{selectedPost.date}</span>
            </div>
            <h2>{language === "es" ? selectedPost.title : selectedPost.titleEn}</h2>
            <div className="modal-author">
              {language === "es" ? "Por" : "By"}: <strong>{selectedPost.author}</strong>
            </div>
            <div className="modal-divider"></div>
            <div className="modal-body-text">
              {(language === "es" ? selectedPost.content : selectedPost.contentEn).split("\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      )}

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
          position: relative;
          background-image: url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1920');
          background-size: cover;
          background-position: center;
          color: var(--white);
          padding: 11rem 0 6rem 0;
        }
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(3, 8, 6, 0.85) 0%, rgba(3, 8, 6, 0.5) 60%, rgba(3, 8, 6, 0.98) 100%);
          z-index: 1;
        }
        .hero-content {
          position: relative;
          z-index: 2;
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
          background: rgba(15, 17, 17, 0.7) !important;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.06);
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
        .tab-pane {
          max-width: 1050px;
          margin: 0 auto;
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
          max-height: 450px;
          object-fit: cover;
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
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .blog-author {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--white);
        }
        .clickable-blog-card {
          cursor: pointer;
          transition: var(--transition);
        }
        .clickable-blog-card:hover {
          transform: translateY(-6px);
          border-color: rgba(29, 122, 110, 0.3);
          box-shadow: var(--shadow-lg);
        }
        .read-more-text {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--mint-accent);
          transition: var(--transition-fast);
        }
        .clickable-blog-card:hover .read-more-text {
          transform: translateX(3px);
        }

        /* FAQ Accordion Styling */
        .faq-wrapper {
          margin-top: 5rem;
          border-top: 1px solid rgba(93, 202, 165, 0.15);
          padding-top: 4rem;
        }
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-top: 2.5rem;
        }
        .faq-item {
          padding: 1.5rem 2rem;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .faq-item:hover {
          transform: translateY(-2px);
        }
        .faq-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        .faq-item h4 {
          font-size: 1.25rem;
          color: var(--white);
          margin-bottom: 0;
          transition: var(--transition-fast);
        }
        .faq-item.active h4 {
          color: var(--mint-accent);
        }
        .faq-arrow-icon {
          font-size: 0.75rem;
          color: var(--mint-accent);
          transition: transform 0.3s ease;
        }
        .faq-item.active .faq-arrow-icon {
          transform: rotate(180deg);
        }
        .faq-body {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease, margin-top 0.35s ease;
          margin-top: 0;
        }
        .faq-item.active .faq-body {
          max-height: 500px;
          opacity: 1;
          margin-top: 1rem;
        }
        .faq-item p {
          font-size: 0.95rem;
          margin-bottom: 0;
          color: var(--gris-texto);
          line-height: 1.6;
        }

        /* Blog Modal */
        .blog-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(3, 8, 6, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1.5rem;
        }
        .blog-modal-content {
          max-width: 680px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          padding: 3rem 2.5rem;
          position: relative;
          background: rgba(255, 255, 255, 0.96) !important;
          border: 1px solid rgba(29, 122, 110, 0.2);
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.2);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .close-btn {
          position: absolute;
          top: 1.25rem;
          right: 1.5rem;
          background: transparent;
          border: none;
          font-size: 2.2rem;
          color: var(--gris-texto);
          cursor: pointer;
          line-height: 1;
          transition: var(--transition-fast);
        }
        .close-btn:hover {
          color: var(--mint-accent);
          transform: scale(1.1);
        }
        .modal-header-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--mint-accent);
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .blog-modal-content h2 {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
          line-height: 1.3;
          color: var(--white);
        }
        .modal-author {
          font-size: 0.85rem;
          color: var(--gris-texto);
          margin-bottom: 1.5rem;
        }
        .modal-divider {
          height: 1px;
          background: rgba(29, 122, 110, 0.12);
          margin-bottom: 1.5rem;
        }
        .modal-body-text p {
          font-size: 0.95rem;
          line-height: 1.65;
          color: var(--blanco-hueso);
          margin-bottom: 1.25rem;
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
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
