"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Terminos() {
  const { language } = useLanguage();

  return (
    <div className="legal-page">
      <section className="section">
        <div className="container">
          <h1>{language === "es" ? "Términos y Condiciones" : "Terms & Conditions"}</h1>
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
                <h2>1. Naturaleza del servicio</h2>
                <p>
                  Bridge Care es un servicio de facilitación y acompañamiento de turismo
                  médico. Coordinamos citas, logística de viaje y seguimiento, pero no
                  prestamos servicios médicos ni odontológicos directamente. Cada
                  procedimiento es responsabilidad exclusiva de la clínica y del
                  profesional de la salud tratante.
                </p>

                <h2>2. Cotizaciones y precios</h2>
                <p>
                  Los precios de referencia publicados en el sitio son estimados y pueden
                  variar según la valoración médica individual, el estado de salud del
                  paciente y las decisiones de la clínica tratante. El precio final se
                  confirma directamente con el centro médico antes del procedimiento.
                </p>

                <h2>3. Responsabilidad médica</h2>
                <p>
                  Bridge Care no garantiza resultados clínicos específicos. Las decisiones
                  médicas, riesgos y complicaciones son responsabilidad del cirujano o
                  especialista tratante y de la institución donde se realice el
                  procedimiento.
                </p>

                <h2>4. Cancelaciones y reprogramaciones</h2>
                <p>
                  Las políticas de cancelación, depósitos y reembolsos son definidas por
                  cada clínica aliada y se comunican por escrito antes de confirmar tu
                  cita. Te recomendamos leerlas con cuidado antes de viajar.
                </p>

                <h2>5. Uso del sitio web</h2>
                <p>
                  El contenido de este sitio es informativo y no constituye asesoría
                  médica. Antes de tomar cualquier decisión de salud, consulta con un
                  profesional médico calificado.
                </p>

                <p className="legal-note">
                  Este documento es una guía general y no reemplaza asesoría legal.
                  Recomendamos que un abogado revise estos términos antes de considerarlos
                  definitivos para tu operación.
                </p>
              </>
            ) : (
              <>
                <h2>1. Nature of the service</h2>
                <p>
                  Bridge Care is a medical tourism facilitation and support service. We
                  coordinate appointments, travel logistics, and follow-up, but we do not
                  directly provide medical or dental services. Each procedure is the sole
                  responsibility of the treating clinic and healthcare professional.
                </p>

                <h2>2. Quotes and pricing</h2>
                <p>
                  Reference prices published on the site are estimates and may vary based
                  on individual medical evaluation, the patient&apos;s health status, and the
                  treating clinic&apos;s decisions. The final price is confirmed directly with
                  the medical center before the procedure.
                </p>

                <h2>3. Medical responsibility</h2>
                <p>
                  Bridge Care does not guarantee specific clinical outcomes. Medical
                  decisions, risks, and complications are the responsibility of the
                  treating surgeon or specialist and the institution where the procedure
                  is performed.
                </p>

                <h2>4. Cancellations and rescheduling</h2>
                <p>
                  Cancellation, deposit, and refund policies are defined by each partner
                  clinic and communicated in writing before your appointment is confirmed.
                  We recommend reading them carefully before traveling.
                </p>

                <h2>5. Use of the website</h2>
                <p>
                  The content on this site is informational and does not constitute
                  medical advice. Before making any health decision, consult a qualified
                  medical professional.
                </p>

                <p className="legal-note">
                  This document is a general guide and does not replace legal advice. We
                  recommend having a lawyer review these terms before treating them as
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
