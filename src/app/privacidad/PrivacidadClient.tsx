"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Privacidad() {
  const { language } = useLanguage();

  return (
    <div className="legal-page">
      <section className="section">
        <div className="container">
          <h1>{language === "es" ? "Política de Privacidad" : "Privacy Policy"}</h1>
          <p className="legal-updated">
            {language === "es" ? "Última actualización: " : "Last updated: "}
            {new Date().toLocaleDateString(language === "es" ? "es-CO" : "en-US", {
              year: "numeric",
              month: "long",
            })}
          </p>

          <div className="detail-card glass-card legal-body">
            {language === "es" ? (
              <>
                <h2>1. Quiénes somos</h2>
                <p>
                  Bridge Care (&quot;nosotros&quot;) es una agencia de turismo médico que conecta
                  pacientes internacionales con clínicas y especialistas en Colombia. No
                  somos un prestador de servicios de salud: coordinamos, orientamos y
                  acompañamos, pero cada procedimiento es realizado por profesionales y
                  centros médicos independientes.
                </p>

                <h2>2. Qué información recopilamos</h2>
                <p>
                  Cuando llenas nuestro formulario de contacto recopilamos tu nombre,
                  correo electrónico, teléfono, la especialidad de tu interés y el mensaje
                  que nos escribas. No solicitamos historias clínicas ni información médica
                  sensible a través del sitio web; eso se coordina directamente y de forma
                  segura con la clínica correspondiente durante tu proceso.
                </p>

                <h2>3. Para qué usamos tu información</h2>
                <p>
                  Usamos tus datos únicamente para contactarte, entender tu caso y
                  conectarte con el especialista o clínica adecuada. No vendemos ni
                  compartimos tu información con terceros para fines de mercadeo.
                </p>

                <h2>4. Con quién la compartimos</h2>
                <p>
                  Solo compartimos los datos necesarios de tu solicitud con la clínica o
                  el especialista que tú elijas, para que puedan atender tu caso.
                </p>

                <h2>5. Tus derechos</h2>
                <p>
                  Puedes pedirnos en cualquier momento que actualicemos o eliminemos tu
                  información escribiendo a{" "}
                  <a href="mailto:info@bridgecare.co">info@bridgecare.co</a>.
                </p>

                <h2>6. Cookies</h2>
                <p>
                  Usamos almacenamiento local del navegador únicamente para recordar tu
                  idioma preferido y mejorar tu experiencia de navegación. No usamos este
                  sitio para rastrearte con fines publicitarios.
                </p>

                <p className="legal-note">
                  Este documento es una guía general y no reemplaza asesoría legal.
                  Recomendamos que un abogado revise esta política antes de considerarla
                  definitiva para tu operación.
                </p>
              </>
            ) : (
              <>
                <h2>1. Who we are</h2>
                <p>
                  Bridge Care (&quot;we&quot;) is a medical tourism agency that connects
                  international patients with clinics and specialists in Colombia. We are
                  not a healthcare provider: we coordinate, guide, and accompany you, but
                  every procedure is performed by independent professionals and medical
                  centers.
                </p>

                <h2>2. What information we collect</h2>
                <p>
                  When you fill out our contact form we collect your name, email, phone
                  number, the specialty you&apos;re interested in, and your message. We do not
                  request medical records or sensitive health information through the
                  website; that is coordinated directly and securely with the relevant
                  clinic during your process.
                </p>

                <h2>3. How we use your information</h2>
                <p>
                  We use your data solely to contact you, understand your case, and
                  connect you with the right specialist or clinic. We do not sell or share
                  your information with third parties for marketing purposes.
                </p>

                <h2>4. Who we share it with</h2>
                <p>
                  We only share the data needed for your request with the clinic or
                  specialist you choose, so they can attend to your case.
                </p>

                <h2>5. Your rights</h2>
                <p>
                  You can ask us at any time to update or delete your information by
                  writing to <a href="mailto:info@bridgecare.co">info@bridgecare.co</a>.
                </p>

                <h2>6. Cookies</h2>
                <p>
                  We use local browser storage only to remember your preferred language
                  and improve your browsing experience. We do not use this site to track
                  you for advertising purposes.
                </p>

                <p className="legal-note">
                  This document is a general guide and does not replace legal advice. We
                  recommend having a lawyer review this policy before treating it as
                  final for your operation.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        .legal-page h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }
        .legal-updated {
          color: var(--gris-texto);
          font-size: 0.9rem;
          margin-bottom: 2.5rem;
        }
        .legal-body {
          padding: 2.5rem;
          max-width: 800px;
        }
        .legal-body h2 {
          font-size: 1.2rem;
          color: var(--white);
          margin: 2rem 0 0.75rem;
        }
        .legal-body h2:first-child {
          margin-top: 0;
        }
        .legal-body p {
          font-size: 0.98rem;
          line-height: 1.7;
          color: var(--gris-texto);
        }
        .legal-body a {
          color: var(--mint-accent);
        }
        .legal-note {
          margin-top: 2.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(93, 202, 165, 0.15);
          font-size: 0.85rem;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
