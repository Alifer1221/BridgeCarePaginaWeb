"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { getStoredDestinations, Destination } from "@/lib/db";
import { useLanguage } from "@/context/LanguageContext";

interface DestinationDetailProps {
  params: Promise<{ slug: string }>;
}

export default function DestinationDetail({ params }: DestinationDetailProps) {
  const { language, t } = useLanguage();
  const { slug } = use(params);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const list = getStoredDestinations();
    const found = list.find((d) => d.id === slug);
    if (found) {
      setDestination(found);
    }
    setLoading(false);

    const handleUpdate = () => {
      const updatedList = getStoredDestinations();
      const updatedFound = updatedList.find((d) => d.id === slug);
      if (updatedFound) {
        setDestination(updatedFound);
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
          {language === "es" ? "Cargando información del destino..." : "Loading destination details..."}
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

  if (!destination) {
    return (
      <div className="container error-container text-center">
        <h2>
          {language === "es" ? "Destino no encontrado" : "Destination not found"}
        </h2>
        <p>
          {language === "es" 
            ? "La ciudad solicitada no está registrada en nuestra red." 
            : "The requested city is not registered in our network."}
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

  // Bilingual fields fallback
  const description = language === "es" ? destination.description : (destination.descriptionEn || destination.description);
  const climate = language === "es" ? destination.climate : (destination.climateEn || destination.climate);
  const airConnectivity = language === "es" ? destination.airConnectivity : (destination.airConnectivityEn || destination.airConnectivity);
  const costOfLiving = language === "es" ? destination.costOfLiving : (destination.costOfLivingEn || destination.costOfLiving);
  const tourism = language === "es" ? destination.tourism : (destination.tourismEn || destination.tourism);

  return (
    <div className="destination-detail-page">
      <div className="glow-sphere glow-1"></div>

      {/* Hero section */}
      <section 
        className="dest-hero"
        style={{ backgroundImage: `url(${destination.image})` }}
      >
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <Link href="/" className="back-link">
            &larr; {language === "es" ? "Volver al inicio" : "Back to home"}
          </Link>
          <br />
          <span className="dest-badge">
            {language === "es" ? "Destino Médico Aliado" : "Partner Medical Destination"}
          </span>
          <h1>{destination.name}, Colombia</h1>
          <p className="hero-description">{description}</p>
        </div>
      </section>

      {/* Main Grid Info */}
      <section className="section info-section">
        <div className="container">
          <div className="dest-info-grid">
            
            {/* Left Block: Logistics & Environment Details */}
            <div className="logistics-cards">
              <h2>
                {language === "es" ? "Guía del Destino para Tu Recuperación" : "Destination Recovery Guide"}
              </h2>
              <p className="section-intro-text">
                {language === "es"
                  ? "Planifica tu viaje conociendo los detalles prácticos de tu ciudad de destino. Cada ciudad ha sido seleccionada por sus altos estándares médicos y su potencial turístico."
                  : "Plan your trip by knowing the practical details of your destination city. Each city has been chosen for its high medical standards and tourism potential."}
              </p>

              <div className="grid grid-2 cards-layout">
                {/* 1. Clima */}
                <div className="detail-card glass-card">
                  <div className="card-icon">☀️</div>
                  <h3>{language === "es" ? "Clima y Entorno" : "Climate & Environment"}</h3>
                  <p>{climate}</p>
                </div>

                {/* 2. Conectividad aérea */}
                <div className="detail-card glass-card">
                  <div className="card-icon">✈️</div>
                  <h3>{language === "es" ? "Conectividad Aérea" : "Air Connectivity"}</h3>
                  <p>{airConnectivity}</p>
                </div>

                {/* 3. Costo de vida */}
                <div className="detail-card glass-card">
                  <div className="card-icon">💰</div>
                  <h3>{language === "es" ? "Costo de Vida Relativo" : "Relative Cost of Living"}</h3>
                  <p>{costOfLiving}</p>
                </div>

                {/* 4. Turismo */}
                <div className="detail-card glass-card">
                  <div className="card-icon">🌴</div>
                  <h3>{language === "es" ? "Turismo de Recuperación" : "Recovery Tourism"}</h3>
                  <p>{tourism}</p>
                </div>
              </div>
            </div>

            {/* Right Block: Clinics in the city */}
            <div className="clinics-sidebar">
              <div className="sidebar-card clinics-card glass-card">
                <h3>
                  {language === "es" ? "Clínicas y Hospitales Aliados" : "Partner Clinics & Hospitals"}
                </h3>
                <p>
                  {language === "es"
                    ? "Centros médicos de alta complejidad donde se programarán tus intervenciones quirúrgicas:"
                    : "High-complexity medical facilities where your surgical procedures will be scheduled:"}
                </p>
                
                <ul className="clinics-list">
                  {destination.clinics && destination.clinics.map((clinic, index) => (
                    <li key={index}>
                      <span className="bullet">✓</span>
                      <div>
                        <strong>{clinic}</strong>
                        <span className="clinic-sub">
                          {language === "es" ? "Acreditación Nacional / Internacional" : "National / International Accreditation"}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                <Link href="/contacto" className="btn btn-accent w-full text-center bold-btn mt-2">
                  {language === "es" 
                    ? `Planificar Viaje a ${destination.name}` 
                    : `Plan Trip to ${destination.name}`}
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      <style jsx>{`
        .destination-detail-page {
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

        .dest-hero {
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
        .dest-badge {
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
        .dest-hero h1 {
          color: var(--white);
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        .hero-description {
          color: var(--gris-texto);
          font-size: 1.15rem;
          margin-bottom: 0;
          line-height: 1.6;
        }

        .info-section {
          background-color: transparent;
          position: relative;
          z-index: 10;
        }
        .dest-info-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 3.5rem;
          align-items: start;
        }
        
        .logistics-cards h2 {
          font-size: 1.6rem;
          color: var(--white);
          margin-bottom: 1rem;
        }
        .section-intro-text {
          font-size: 1.05rem;
          margin-bottom: 2.5rem;
          color: var(--gris-texto);
        }
        
        .cards-layout {
          gap: 1.5rem;
        }
        .detail-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .detail-card:hover {
          transform: none;
        }
        .card-icon {
          font-size: 2rem;
          line-height: 1;
        }
        .detail-card h3 {
          font-size: 1.15rem;
          color: var(--mint-accent);
          margin-bottom: 0;
        }
        .detail-card p {
          font-size: 0.85rem;
          margin-bottom: 0;
          color: var(--gris-texto);
          line-height: 1.5;
        }

        .clinics-card {
          padding: 2.5rem 2rem;
        }
        .clinics-card:hover {
          transform: none;
        }
        .clinics-card h3 {
          font-size: 1.3rem;
          color: var(--white);
          margin-bottom: 1rem;
        }
        .clinics-card p {
          font-size: 0.9rem;
          color: var(--gris-texto);
          margin-bottom: 1.5rem;
        }
        
        .clinics-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        .clinics-list li {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          font-size: 0.9rem;
        }
        .bullet {
          color: var(--mint-accent);
          font-weight: bold;
          font-size: 1.1rem;
          line-height: 1.2;
        }
        .clinic-sub {
          display: block;
          font-size: 0.75rem;
          color: var(--gris-texto);
          margin-top: 0.15rem;
        }
        
        .w-full { width: 100%; }
        .text-center { text-align: center; }
        .bold-btn { font-weight: 700; }
        .mt-2 { margin-top: 1rem; }

        @media (max-width: 992px) {
          .dest-info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
