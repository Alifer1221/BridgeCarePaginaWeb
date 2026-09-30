"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

import { CONTACT_EMAIL, WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "@/lib/contact";

/**
 * Lead capture shared by every form: saves the lead locally first (the admin
 * panel lists it even if the email API is down), then posts it to
 * /api/contact. `source` becomes the lead's "specialty".
 */
export function useLeadForm(source: string) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    // Local fallback so the lead is never lost even if the email API is down.
    // Same record shape as the Contact page, so the admin panel lists it.
    try {
      const leads = JSON.parse(localStorage.getItem("bc_leads") || "[]");
      leads.push({
        id: "lead_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9),
        name: form.name,
        email: form.email,
        phone: "",
        specialty: source,
        message: form.message,
        date: new Date().toISOString().split("T")[0],
        status: "nuevo",
        adminNotes: "",
      });
      localStorage.setItem("bc_leads", JSON.stringify(leads));
      window.dispatchEvent(new Event("bc_db_update"));
    } catch {
      /* localStorage unavailable — ignore */
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, specialty: source }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return { form, status, handleChange, handleSubmit };
}

interface ContactFormCardProps {
  /** Saved as the lead's "specialty", so the admin panel and the notification
   *  email say where the request came from. */
  source: string;
  /** Prefix for the field ids — must differ if two forms share a page. */
  idPrefix?: string;
  title?: React.ReactNode;
  messagePlaceholder?: string;
  rows?: number;
  className?: string;
  /** Submit button text; defaults to "Enviar Mensaje". Name the result
   *  ("Recibir mi cotización") where the form is the page's main action. */
  submitLabel?: string;
  /** Hide the optional message field for a shorter, faster form. */
  showMessage?: boolean;
  /** Reassurance shown right under the submit button, where the decision is
   *  made (who answers, when, what it costs). */
  footer?: React.ReactNode;
}

/**
 * The white lead-capture card. Submits to the same /api/contact route as the
 * Contact page and mirrors its localStorage lead fallback so the admin panel
 * sees these leads too. Used by the home CTA and the specialty page hero.
 */
export function ContactFormCard({
  source,
  idPrefix = "cta",
  title,
  messagePlaceholder,
  rows = 4,
  className,
  submitLabel,
  showMessage = true,
  footer,
}: ContactFormCardProps) {
  const { language } = useLanguage();
  const es = language === "es";

  const { form, status, handleChange, handleSubmit } = useLeadForm(source);

  return (
    <div className={`cta-form-card${className ? ` ${className}` : ""}`}>
      <h3 className="cta-form-title">
        {title ?? (
          <>
            {es ? "¿Listo para empezar tu " : "Ready to start your "}
            <span>{es ? "tratamiento?" : "treatment?"}</span>
          </>
        )}
      </h3>

      {status === "sent" ? (
        <div className="cta-form-success" role="status">
          <strong>{es ? "¡Mensaje enviado!" : "Message sent!"}</strong>
          <p>
            {es
              ? "Un coordinador de Bridge Care te escribirá en menos de 24 horas hábiles."
              : "A Bridge Care coordinator will get back to you within 24 business hours."}
          </p>
        </div>
      ) : (
        <form className="cta-form" onSubmit={handleSubmit}>
          <label className="cta-label" htmlFor={`${idPrefix}-name`}>
            {es ? "Tu nombre*" : "Your name*"}
          </label>
          <input
            id={`${idPrefix}-name`}
            name="name"
            type="text"
            className="cta-input"
            placeholder={es ? "Ej. María Gómez" : "e.g. Maria Gomez"}
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="name"
          />

          <label className="cta-label" htmlFor={`${idPrefix}-email`}>
            E-mail*
          </label>
          <input
            id={`${idPrefix}-email`}
            name="email"
            type="email"
            className="cta-input"
            placeholder={es ? "tu@email.com" : "you@email.com"}
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />

          {showMessage && (
            <>
              <label className="cta-label" htmlFor={`${idPrefix}-message`}>
                {es ? "Mensaje" : "Message"}
              </label>
              <textarea
                id={`${idPrefix}-message`}
                name="message"
                className="cta-input cta-textarea"
                placeholder={
                  messagePlaceholder ??
                  (es ? "Cuéntanos qué procedimiento te interesa" : "Tell us which procedure you're interested in")
                }
                value={form.message}
                onChange={handleChange}
                rows={rows}
              />
            </>
          )}

          <button
            type="submit"
            className="cta-submit"
            disabled={status === "sending"}
          >
            {status === "sending"
              ? es ? "Enviando…" : "Sending…"
              : submitLabel ?? (es ? "Enviar Mensaje" : "Send Message")}
          </button>

          {footer}

          {status === "error" && (
            <p className="cta-form-error" role="alert">
              {es ? "No pudimos enviar tu mensaje. " : "We couldn't send your message. "}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  es ? "Hola, intenté escribirles desde la página." : "Hi, I tried to reach you from the website.",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {es ? "Escríbenos por WhatsApp" : "Message us on WhatsApp"}
              </a>
              {es ? " o inténtalo de nuevo; tus datos siguen aquí." : " or try again; your details are still here."}
            </p>
          )}

          <p className="cta-form-note">
            {es ? "Al enviar, aceptas nuestros " : "By sending, you accept our "}
            <Link href="/terminos">{es ? "Términos" : "Terms"}</Link>
            {es ? " y " : " and "}
            <Link href="/privacidad">{es ? "Política de Privacidad" : "Privacy Policy"}</Link>.
          </p>
        </form>
      )}
    </div>
  );
}

interface ContactPillFormProps {
  source: string;
  idPrefix?: string;
  submitLabel?: string;
  /** Reassurance line under the bar (who answers, when). */
  note?: React.ReactNode;
  className?: string;
}

/**
 * The same lead form as a single rounded bar — name, e-mail and the button on
 * one line, like a search field — for heroes where a card would be too heavy.
 */
export function ContactPillForm({
  source,
  idPrefix = "pill",
  submitLabel,
  note,
  className,
}: ContactPillFormProps) {
  const { language } = useLanguage();
  const es = language === "es";
  const { form, status, handleChange, handleSubmit } = useLeadForm(source);

  return (
    <div className={`cta-pill-wrap${className ? ` ${className}` : ""}`}>
      {status === "sent" ? (
        <div className="cta-pill-success" role="status">
          <strong>{es ? "¡Listo!" : "Done!"}</strong>{" "}
          {es
            ? "Una coordinadora de Bridge Care te escribirá en menos de 24 horas hábiles."
            : "A Bridge Care coordinator will write to you within 24 business hours."}
        </div>
      ) : (
        <form className="cta-pill" onSubmit={handleSubmit}>
          <label className="cta-pill-field" htmlFor={`${idPrefix}-name`}>
            <span>{es ? "Tu nombre" : "Your name"}</span>
            <input
              id={`${idPrefix}-name`}
              name="name"
              type="text"
              placeholder={es ? "Ej. María Gómez" : "e.g. Maria Gomez"}
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </label>
          <span className="cta-pill-divider" aria-hidden="true" />
          <label className="cta-pill-field" htmlFor={`${idPrefix}-email`}>
            <span>E-mail</span>
            <input
              id={`${idPrefix}-email`}
              name="email"
              type="email"
              placeholder={es ? "tu@email.com" : "you@email.com"}
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </label>
          <button type="submit" className="cta-pill-submit" disabled={status === "sending"}>
            {status === "sending"
              ? es ? "Enviando…" : "Sending…"
              : submitLabel ?? (es ? "Recibir mi cotización" : "Get my quote")}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="cta-form-error cta-pill-error" role="alert">
          {es ? "No pudimos enviar tu mensaje. " : "We couldn't send your message. "}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              es ? "Hola, intenté escribirles desde la página." : "Hi, I tried to reach you from the website.",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {es ? "Escríbenos por WhatsApp" : "Message us on WhatsApp"}
          </a>
          {es ? " o inténtalo de nuevo; tus datos siguen aquí." : " or try again; your details are still here."}
        </p>
      )}

      {note}

      <p className="cta-pill-legal">
        {es ? "Al enviar, aceptas nuestros " : "By sending, you accept our "}
        <Link href="/terminos">{es ? "Términos" : "Terms"}</Link>
        {es ? " y " : " and "}
        <Link href="/privacidad">{es ? "Política de Privacidad" : "Privacy Policy"}</Link>.
      </p>
    </div>
  );
}

/**
 * Closing contact block for the home page: white form card on the left,
 * big headline + benefits + advisor card + direct contact on the right,
 * on a black full-bleed background.
 */
export default function ContactCta() {
  const { language } = useLanguage();
  const es = language === "es";

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    es
      ? "Hola, quiero agendar una llamada con Bridge Care."
      : "Hi, I'd like to schedule a call with Bridge Care."
  )}`;

  return (
    <section className="cta-contact-section" id="contacto-rapido">
      <div className="cta-contact-container">
        <ContactFormCard source="Home CTA" />

        {/* RIGHT: headline, benefits, advisor, direct contact */}
        <div className="cta-content">
          <h2 className="cta-headline">{es ? "Hablemos" : "Let's talk"}</h2>
          <p className="cta-lead">
            {es
              ? "Tu tratamiento en Colombia empieza aquí. Cuéntanos qué necesitas y en menos de 24 horas tienes una propuesta completa."
              : "Your treatment in Colombia starts here. Tell us what you need and you'll have a complete proposal within 24 hours."}
          </p>

          <div className="cta-features">
            <div className="cta-feature">
              <h4>
                <span aria-hidden="true">✦</span> {es ? "Sin costo." : "No cost."}
              </h4>
              <p>
                {es
                  ? "Consulta inicial y propuesta personalizada sin ningún compromiso."
                  : "Initial consultation and personalized proposal, no strings attached."}
              </p>
            </div>
            <div className="cta-feature">
              <h4>
                <span aria-hidden="true">◎</span> {es ? "100% acompañado." : "100% supported."}
              </h4>
              <p>
                {es
                  ? "Vuelo, clínica, hotel y seguimiento — todo coordinado por nosotros."
                  : "Flight, clinic, hotel and follow-up — all coordinated by us."}
              </p>
            </div>
          </div>

          <div className="cta-advisor">
            <div className="cta-advisor-avatar" aria-hidden="true">
              BC
            </div>
            <div className="cta-advisor-body">
              <span className="cta-advisor-role">
                {es ? "Coordinación de pacientes internacionales" : "International patient coordination"}
              </span>
              <span className="cta-advisor-name">{es ? "Equipo Bridge Care" : "Bridge Care Team"}</span>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="cta-advisor-btn">
                {es ? "Agendar llamada" : "Schedule a call"} <span aria-hidden="true">•</span>
              </a>
            </div>
          </div>

          <ul className="cta-direct">
            <li>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2m0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.54-3.7 8.24-8.23 8.24m4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28" />
                </svg>
                {WHATSAPP_DISPLAY}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="cta-email">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
