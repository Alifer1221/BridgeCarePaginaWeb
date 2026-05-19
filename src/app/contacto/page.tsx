"use client";

import React, { useState, useEffect } from "react";
import { getStoredSpecialties, Specialty } from "@/lib/db";
import { useLanguage } from "@/context/LanguageContext";

export default function Contacto() {
  const { language, t } = useLanguage();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSpecialties(getStoredSpecialties());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <div className="glow-sphere glow-1"></div>
      
      <section className="contact-hero">
        <div className="container text-center">
          <span className="contact-subtitle">{t("contact.title")}</span>
          <h1>
            {language === "es" 
              ? "Contáctanos y obtén una cotización gratis" 
              : "Contact us and get a free quote"}
          </h1>
          <div className="header-bar"></div>
          <p className="contact-hero-desc">
            {language === "es" 
              ? "Estamos listos para guiarte en cada paso. Escríbenos o agenda una videollamada de valoración gratuita con nuestros especialistas." 
              : "We are ready to guide you at every step. Message us or schedule a free virtual evaluation call with our specialists."}
          </p>
        </div>
      </section>

      <section className="section contact-section">
        <div className="container contact-grid">
          {/* Contact Information & CTAs */}
          <div className="contact-info-panel animate-fade-in">
            <h2>
              {language === "es" ? "Canales de Atención Inmediata" : "Immediate Support Channels"}
            </h2>
            <p>
              {language === "es" 
                ? "Elige el canal de tu preferencia para recibir atención personalizada por parte de nuestros coordinadores médicos." 
                : "Choose your preferred channel to receive personalized assistance from our medical coordinators."}
            </p>
            
            <div className="info-cards-list">
              {/* WhatsApp direct card */}
              <div className="info-card glass-card">
                <div className="info-card-icon wa">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.588 1.971 14.12 .946 11.503.946c-5.44 0-9.866 4.372-9.87 9.802 0 1.714.457 3.39 1.32 4.908l-.888 3.25 3.35-.879zm12.39-7.14c-.266-.134-1.58-.78-1.822-.867-.243-.088-.419-.133-.596.134-.176.265-.685.867-.839 1.044-.156.177-.311.199-.578.066-1.745-.872-3.007-1.517-4.148-3.483-.3-.518.3-.48.86-1.602.156-.312.078-.585-.039-.82-.117-.236-.975-2.355-1.336-3.232-.352-.852-.71-.737-.976-.75-.25-.013-.538-.015-.826-.015-.288 0-.756.108-1.15.538-.396.43-1.512 1.48-1.512 3.61s1.55 4.184 1.767 4.477c.217.294 3.05 4.67 7.387 6.549 1.03.447 1.836.714 2.464.914 1.037.33 1.982.284 2.729.173.832-.124 2.56-1.047 2.92-2.06.36-1.013.36-1.883.252-2.06-.108-.178-.396-.266-.662-.4z"/>
                  </svg>
                </div>
                <div>
                  <h3>
                    {language === "es" ? "WhatsApp Inmediato" : "Instant WhatsApp"}
                  </h3>
                  <p>
                    {language === "es" 
                      ? "Obtén respuestas rápidas chateando directamente con un asesor médico." 
                      : "Get quick answers by chatting directly with a medical advisor."}
                  </p>
                  <a 
                    href={`https://wa.me/573001234567?text=${encodeURIComponent(
                      language === "es" 
                        ? "Hola, quiero agendar una cita con Bridge Care." 
                        : "Hello, I want to book an appointment with Bridge Care."
                    )}`}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-accent btn-sm mt-1"
                  >
                    {language === "es" ? "Chatear Ahora" : "Chat Now"}
                  </a>
                </div>
              </div>

              {/* Free Video Call Card */}
              <div className="info-card glass-card">
                <div className="info-card-icon call">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 7a2 2 0 0 0-2.45-1.45L16 7V5a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2l4.55 1.45A2 2 0 0 0 23 17V7z"/>
                  </svg>
                </div>
                <div>
                  <h3>
                    {language === "es" ? "Videollamada Gratis" : "Free Video Call"}
                  </h3>
                  <p>
                    {language === "es" 
                      ? "Programa una sesión de consulta de 15 minutos para aclarar dudas diagnósticas." 
                      : "Schedule a 15-minute consultation session to clarify diagnostic questions."}
                  </p>
                  <a href="#agendar" className="btn btn-secondary btn-sm mt-1" onClick={(e) => {
                    e.preventDefault();
                    alert(language === "es" ? "Integración con Calendly de simulación." : "Simulated Calendly integration.");
                  }}>
                    {language === "es" ? "Agendar Videollamada" : "Schedule Video Call"}
                  </a>
                </div>
              </div>

              {/* Email Card */}
              <div className="info-card glass-card">
                <div className="info-card-icon email">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <h3>
                    {language === "es" ? "Correo de Soporte" : "Support Email"}
                  </h3>
                  <p>
                    {language === "es" 
                      ? "Para envío de expedientes médicos y documentos de alta complejidad." 
                      : "For sending medical records and high-complexity documents."}
                  </p>
                  <a href="mailto:info@bridgecare.co" className="info-link">info@bridgecare.co</a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-panel glass-card">
            {submitted ? (
              <div className="submission-success">
                <div className="success-icon">✓</div>
                <h2>{t("contact.success").split("!")[0] + "!"}</h2>
                <p>
                  {language === "es"
                    ? "Gracias por confiar en Bridge Care. Uno de nuestros coordinadores de pacientes internacionales se contactará contigo por correo electrónico o WhatsApp dentro de las próximas 24 horas hábiles."
                    : "Thank you for trusting Bridge Care. One of our international patient coordinators will contact you via email or WhatsApp within the next 24 business hours."}
                </p>
                <button className="btn btn-primary" onClick={() => setSubmitted(false)}>
                  {language === "es" ? "Enviar otro mensaje" : "Send another message"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <h2>{language === "es" ? "Formulario de Valoración" : "Evaluation Form"}</h2>
                <p className="form-intro">{t("contact.subtitle")}</p>

                <div className="form-group">
                  <label className="form-label" htmlFor="name">{t("contact.name")}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Ej. Sarah Jenkins"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">{t("contact.email")}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Ej. sarah@example.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">{t("contact.phone")}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Ej. +1 (305) 555-0123"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="specialty">{t("contact.spec")}</label>
                  <select
                    id="specialty"
                    name="specialty"
                    required
                    value={formData.specialty}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">
                      {language === "es" ? "Selecciona una especialidad..." : "Select a specialty..."}
                    </option>
                    {specialties.map((spec) => (
                      <option key={spec.id} value={spec.id}>
                        {language === "es" ? spec.name : spec.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="message">{t("contact.msg")}</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="form-control"
                    placeholder={
                      language === "es" 
                        ? "Escribe brevemente los detalles de tu consulta..." 
                        : "Briefly write the details of your inquiry..."
                    }
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-accent w-full">
                  {t("contact.submit")}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        .contact-page {
          position: relative;
        }
        .glow-sphere {
          position: absolute;
          width: 450px;
          height: 450px;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.1;
          pointer-events: none;
          z-index: 0;
        }
        .glow-1 {
          background: var(--mint-accent);
          top: 30%;
          right: -100px;
        }

        .contact-hero {
          background-color: transparent;
          color: var(--white);
          padding: 8rem 0 4rem 0;
        }
        .contact-subtitle {
          color: var(--mint-accent);
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 0.15em;
          margin-bottom: 0.5rem;
          display: block;
        }
        .contact-hero h1 {
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
        .contact-hero-desc {
          max-width: 600px;
          margin: 0 auto;
          color: var(--gris-texto);
          font-size: 1.1rem;
        }

        .contact-section {
          background-color: transparent;
          padding-top: 2rem;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1.2fr 1.5fr;
          gap: 4rem;
          position: relative;
          z-index: 10;
        }

        .contact-info-panel h2 {
          font-size: 1.75rem;
          margin-bottom: 1.25rem;
        }
        .contact-info-panel p {
          margin-bottom: 2.5rem;
        }
        
        .info-cards-list {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }
        .info-card {
          padding: 1.75rem;
          display: flex;
          gap: 1.5rem;
        }
        .info-card:hover {
          transform: translateY(-2px);
        }
        .info-card-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .info-card-icon.wa {
          background-color: rgba(37, 211, 102, 0.1);
          color: #25d366;
          border: 1px solid rgba(37, 211, 102, 0.2);
        }
        .info-card-icon.call {
          background-color: rgba(29, 122, 110, 0.15);
          color: var(--mint-accent);
          border: 1px solid rgba(93, 202, 165, 0.25);
        }
        .info-card-icon.email {
          background-color: rgba(93, 202, 165, 0.1);
          color: var(--white);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        .info-card h3 {
          font-size: 1.25rem;
          margin-bottom: 0.35rem;
        }
        .info-card p {
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
          color: var(--gris-texto);
        }
        .info-link {
          color: var(--mint-accent);
          font-weight: 600;
          font-size: 0.95rem;
        }
        .info-link:hover {
          text-decoration: underline;
        }
        
        /* Contact Form */
        .contact-form-panel {
          padding: 3rem 2.5rem;
        }
        .contact-form-panel:hover {
          transform: none; /* remove hover animation from form block */
        }
        .contact-form h2 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }
        .form-intro {
          font-size: 0.9rem;
          margin-bottom: 2rem;
          color: var(--gris-texto);
        }
        .mt-1 {
          margin-top: 0.5rem;
        }
        .btn-sm {
          padding: 0.5rem 1.25rem;
          font-size: 0.85rem;
        }
        .w-full {
          width: 100%;
        }

        /* Success screen */
        .submission-success {
          text-align: center;
          padding: 2rem 1rem;
        }
        .success-icon {
          width: 70px;
          height: 70px;
          background-color: rgba(93, 202, 165, 0.12);
          color: var(--mint-accent);
          border: 1px solid rgba(93, 202, 165, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: bold;
          margin: 0 auto 1.5rem auto;
        }
        .submission-success h2 {
          font-size: 1.8rem;
          margin-bottom: 1rem;
        }
        .submission-success p {
          font-size: 1rem;
          margin-bottom: 2rem;
          color: var(--gris-texto);
          line-height: 1.7;
        }

        @media (max-width: 992px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }
        @media (max-width: 576px) {
          .contact-form-panel {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
