"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { getStoredSpecialties, Specialty } from "@/lib/db";
import { useLanguage } from "@/context/LanguageContext";

interface SpecialtyDetailProps {
  params: Promise<{ slug: string }>;
}

export default function SpecialtyDetail({ params }: SpecialtyDetailProps) {
  const { language, t } = useLanguage();
  const { slug } = use(params);
  const [specialty, setSpecialty] = useState<Specialty | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const list = getStoredSpecialties();
    const found = list.find((s) => s.id === slug);
    if (found) {
      setSpecialty(found);
    }
    setLoading(false);

    const handleUpdate = () => {
      const updatedList = getStoredSpecialties();
      const updatedFound = updatedList.find((s) => s.id === slug);
      if (updatedFound) {
        setSpecialty(updatedFound);
      }
    };
    window.addEventListener("bc_db_update", handleUpdate);
    return () => window.removeEventListener("bc_db_update", handleUpdate);
  }, [slug]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>
          {language === "es" ? "Cargando información médica..." : "Loading medical information..."}
        </p>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 50vh;
            color: var(--mint-accent);
          }
          .spinner {
            border: 4px solid rgba(93, 202, 165, 0.1);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border-left-color: var(--mint-accent);
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!specialty) {
    return (
      <div className="container error-container text-center">
        <h2>
          {language === "es" ? "Especialidad no encontrada" : "Specialty not found"}
        </h2>
        <p>
          {language === "es" 
            ? "El tratamiento solicitado no existe o fue removido del catálogo." 
            : "The requested treatment does not exist or has been removed from the catalog."}
        </p>
        <Link href="/" className="btn btn-primary">
          {language === "es" ? "Volver al Inicio" : "Return to Home"}
        </Link>
        <style jsx>{`
          .error-container {
            padding: 8rem 1.5rem;
          }
          .error-container h2 {
            margin-bottom: 1rem;
          }
        `}</style>
      </div>
    );
  }

  const costCol = parseFloat(specialty.avgCostColombia.replace(/[^0-9.]/g, ""));
  const costUS = parseFloat(specialty.avgCostUS.replace(/[^0-9.]/g, ""));
  const savingsPct = costUS ? Math.round(((costUS - costCol) / costUS) * 100) : 0;

  // Bilingual fields fallback
  const name = language === "es" ? specialty.name : (specialty.nameEn || specialty.name);
  const description = language === "es" ? specialty.description : (specialty.descriptionEn || specialty.description);
  const fullDescription = language === "es" ? specialty.fullDescription : (specialty.fullDescriptionEn || specialty.fullDescription);
  const procedures = language === "es" ? specialty.procedures : (specialty.proceduresEn || specialty.procedures || []);
  const recoveryDays = language === "es" ? specialty.recoveryDays : (specialty.recoveryDaysEn || specialty.recoveryDays);

  return (
    <div className="specialty-detail-page">
      <div className="glow-sphere glow-1"></div>

      {/* Hero section */}
      <section 
        className="detail-hero"
        style={{ backgroundImage: `url(${specialty.image})` }}
      >
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <Link href="/" className="back-link">
            &larr; {language === "es" ? "Volver al catálogo" : "Back to catalog"}
          </Link>
          <br />
          <span className="spec-badge">
            {language === "es" ? "Especialidad Médica" : "Medical Specialty"}
          </span>
          <h1>{name}</h1>
          <p className="hero-description">{description}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section content-section">
        <div className="container content-grid">
          {/* Left Column: Details */}
          <div className="main-details">
            <div className="detail-card glass-card">
              <h2>{language === "es" ? "Sobre el Tratamiento" : "About the Treatment"}</h2>
              <p className="large-p">{fullDescription}</p>
            </div>

            <div className="detail-card glass-card mt-3">
              <h2>{language === "es" ? "Procedimientos Comunes" : "Common Procedures"}</h2>
              <p>
                {language === "es"
                  ? "Ofrecemos una amplia variedad de técnicas dentro de esta categoría, adaptadas a tus objetivos anatómicos y de salud."
                  : "We offer a wide variety of techniques within this category, adapted to your anatomical and health goals."}
              </p>
              <ul className="procedures-list">
                {procedures.map((proc, i) => (
                  <li key={i}>
                    <span className="check-bullet">✓</span>
                    <span>{proc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Cost and Logistics Summary */}
          <div className="logistics-sidebar">
            <div className="sidebar-card cost-card glass-card">
              <div className="savings-badge">
                {language === "es" ? `Ahorra hasta un ${savingsPct}%` : `Save up to ${savingsPct}%`}
              </div>
              <h3>{language === "es" ? "Comparativa de Costos" : "Cost Comparison"}</h3>
              
              <div className="cost-row">
                <div className="cost-label">
                  {language === "es" ? "Costo Promedio EE. UU." : "Avg. US Cost"}
                </div>
                <div className="cost-value us">{specialty.avgCostUS}</div>
              </div>
              
              <div className="cost-row">
                <div className="cost-label">
                  {language === "es" ? "Costo Promedio Colombia" : "Avg. Colombia Cost"}
                </div>
                <div className="cost-value col">{specialty.avgCostColombia}</div>
              </div>

              <div className="savings-text text-center">
                {language === "es" ? (
                  <>
                    Te ahorras aproximadamente <strong>{(costUS - costCol).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} USD</strong>
                  </>
                ) : (
                  <>
                    You save approximately <strong>{(costUS - costCol).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} USD</strong>
                  </>
                )}
              </div>
            </div>

            <div className="sidebar-card logistics-info-card glass-card mt-2">
              <h3>{language === "es" ? "Detalles Clínicos" : "Clinical Details"}</h3>
              
              <div className="log-item">
                <span className="log-icon">⏱</span>
                <div>
                  <h4>{language === "es" ? "Tiempo de Recuperación" : "Recovery Time"}</h4>
                  <p>{recoveryDays}</p>
                </div>
              </div>

              <div className="log-item">
                <span className="log-icon">🏥</span>
                <div>
                  <h4>{language === "es" ? "Clínicas Aliadas" : "Partner Clinics"}</h4>
                  <ul>
                    {specialty.clinics && specialty.clinics.map((clinic, i) => (
                      <li key={i}>{clinic}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link href={`/contacto?specialty=${specialty.id}`} className="btn btn-accent w-full text-center bold-btn mt-2">
                {t("nav.book")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .specialty-detail-page {
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
          right: -100px;
        }

        .detail-hero {
          position: relative;
          background-size: cover;
          background-position: center;
          padding: 10rem 0 5rem 0;
          color: var(--white);
        }
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(3, 8, 6, 0.95) 0%, rgba(10, 74, 66, 0.5) 100%);
          z-index: 1;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
        }
        .back-link {
          display: inline-block;
          color: var(--mint-accent);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }
        .back-link:hover {
          text-decoration: underline;
        }
        .spec-badge {
          display: inline-block;
          background-color: rgba(93, 202, 165, 0.08);
          color: var(--mint-accent);
          border: 1px solid rgba(93, 202, 165, 0.25);
          border-radius: var(--radius-full);
          padding: 0.25rem 0.9rem;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }
        .detail-hero h1 {
          font-size: 3.5rem;
          margin-bottom: 1rem;
        }
        .hero-description {
          color: var(--gris-texto);
          font-size: 1.15rem;
          margin-bottom: 0;
        }

        .content-section {
          background-color: transparent;
          position: relative;
          z-index: 10;
        }
        .content-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 3.5rem;
          align-items: start;
        }
        
        .detail-card {
          padding: 2.5rem;
        }
        .detail-card:hover {
          transform: none;
        }
        .large-p {
          font-size: 1.1rem;
          line-height: 1.7;
          color: var(--blanco-hueso);
        }
        .detail-card h2 {
          font-size: 1.5rem;
          color: var(--white);
          margin-bottom: 1.25rem;
          border-bottom: 1px solid rgba(93, 202, 165, 0.15);
          padding-bottom: 0.75rem;
        }
        
        .procedures-list {
          list-style: none;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          margin-top: 1.5rem;
        }
        .procedures-list li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.95rem;
          font-weight: 500;
        }
        .check-bullet {
          color: var(--mint-accent);
          font-weight: bold;
          font-size: 1.1rem;
        }

        .sidebar-card {
          padding: 2rem;
        }
        .cost-card {
          border: 1px solid rgba(93, 202, 165, 0.35);
          position: relative;
          background: rgba(3, 12, 10, 0.8) !important;
          box-shadow: 0 10px 30px rgba(93, 202, 165, 0.1) !important;
        }
        .cost-card:hover {
          border-color: var(--mint-accent);
        }
        .cost-card h3 {
          color: var(--white);
          font-size: 1.25rem;
          margin-bottom: 1.5rem;
        }
        .savings-badge {
          position: absolute;
          top: -12px;
          right: 20px;
          background: linear-gradient(135deg, var(--teal-primary) 0%, var(--mint-accent) 100%);
          color: var(--negro-suave);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.3rem 0.9rem;
          border-radius: var(--radius-full);
          border: 1px solid rgba(255,255,255,0.2);
        }
        .cost-row {
          display: flex;
          justify-content: space-between;
          padding: 0.85rem 0;
          border-bottom: 1px solid rgba(93, 202, 165, 0.1);
        }
        .cost-label {
          font-size: 0.9rem;
          color: var(--gris-texto);
        }
        .cost-value {
          font-weight: 700;
          font-size: 1.1rem;
        }
        .cost-value.us {
          color: #ff6b6b;
          text-decoration: line-through;
        }
        .cost-value.col {
          color: var(--mint-accent);
          font-size: 1.3rem;
        }
        .savings-text {
          font-size: 0.9rem;
          margin-top: 1.5rem;
          color: var(--white);
        }

        .logistics-info-card h3 {
          font-size: 1.25rem;
          color: var(--white);
          margin-bottom: 1.5rem;
        }
        .logistics-info-card:hover {
          transform: none;
        }
        .log-item {
          display: flex;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }
        .log-icon {
          font-size: 1.5rem;
          line-height: 1;
        }
        .log-item h4 {
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: var(--white);
        }
        .log-item p, .log-item ul {
          font-size: 0.85rem;
          color: var(--gris-texto);
          margin-bottom: 0;
        }
        .log-item ul {
          list-style: none;
        }
        
        .mt-3 { margin-top: 2rem; }
        .mt-2 { margin-top: 1rem; }
        .w-full { width: 100%; }
        .text-center { text-align: center; }
        .bold-btn { font-weight: 700; }

        @media (max-width: 992px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
          .procedures-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
