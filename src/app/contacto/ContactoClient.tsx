"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Newsreader } from "next/font/google";
import { useSpecialties } from "@/lib/useStoredData";
import { useLanguage } from "@/context/LanguageContext";
import { useFitBoard } from "@/lib/useFitBoard";
import { CALENDLY_URL, CONTACT_EMAIL, WHATSAPP_DISPLAY, waHref } from "@/lib/contact";

const serif = Newsreader({ subsets: ["latin"], weight: ["400"], display: "swap", preload: false });

/* Contacto (design board CT1, "dos pasos"): the path on the left, a short
   form on the right, WhatsApp and e-mail as the other doors. Sending the form
   opens the real Calendly widget in place, prefilled with name and e-mail, so
   the visitor picks a day and time without typing anything twice. */

const UNSURE = "unsure";
const WHEN = [
  { v: "", es: "Aún no tengo fecha", en: "No date yet" },
  { v: "1m", es: "En el próximo mes", en: "Within a month" },
  { v: "1-3m", es: "En 1 a 3 meses", en: "In 1 to 3 months" },
  { v: "3-6m", es: "En 3 a 6 meses", en: "In 3 to 6 months" },
  { v: "6m+", es: "En más de 6 meses", en: "In more than 6 months" },
];

function calendlySrc(name: string, email: string) {
  if (!CALENDLY_URL) return "";
  const host = typeof window !== "undefined" ? window.location.host : "";
  const q = new URLSearchParams({
    embed_type: "Inline",
    embed_domain: host,
    hide_gdpr_banner: "1",
    primary_color: "0a4a42",
    name,
    email,
  });
  return `${CALENDLY_URL}${CALENDLY_URL.includes("?") ? "&" : "?"}${q.toString()}`;
}

function ContactoForm() {
  const { language } = useLanguage();
  const es = language === "es";
  const searchParams = useSearchParams();
  const specialties = useSpecialties();
  const boardRef = useFitBoard<HTMLDivElement>({ minH: 600, maxH: 900, fitContent: true });
  const [form, setForm] = useState(() => ({
    name: "",
    email: "",
    phone: "",
    country: "",
    specialty: searchParams.get("specialty") || "",
    when: "",
    lang: language === "en" ? "en" : "es",
    message: "",
  }));
  const [step, setStep] = useState<"form" | "schedule">("form");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const onInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    set(e.target.name as keyof typeof form, e.target.value);

  const specialtyLabel = () => {
    if (form.specialty === UNSURE) return es ? "Aún no lo sé" : "Not sure yet";
    const s = specialties.find((x) => x.id === form.specialty);
    return s ? (es ? s.name : s.nameEn) : "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(false);

    const when = WHEN.find((w) => w.v === form.when);
    const details = [
      form.country && `País: ${form.country}`,
      `Cuándo viajar: ${when ? when.es : "—"}`,
      `Idioma para hablar: ${form.lang === "en" ? "English" : "Español"}`,
    ]
      .filter(Boolean)
      .join("\n");
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      specialty: form.specialty === UNSURE ? "Aún no lo sabe" : form.specialty,
      message: `${details}${form.message ? `\n\n${form.message}` : ""}`,
    };

    // Local copy so the admin panel on this browser keeps working.
    try {
      const existing = localStorage.getItem("bc_leads");
      const leads = existing ? JSON.parse(existing) : [];
      leads.push({
        id: "lead_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9),
        ...payload,
        date: new Date().toISOString().split("T")[0],
        status: "nuevo",
        adminNotes: "",
      });
      localStorage.setItem("bc_leads", JSON.stringify(leads));
      window.dispatchEvent(new Event("bc_db_update"));
    } catch (err) {
      console.error("Error saving lead to localStorage:", err);
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("request_failed");
      setStep("schedule");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Error sending lead to server:", err);
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const waLink = waHref(es ? "Hola, quiero información sobre mi viaje con Bridge Care." : "Hi, I'd like information about my trip with Bridge Care.");
  const STEPS = es
    ? [
        ["Cuéntanos qué quieres", "Un formulario corto. Dos minutos."],
        ["Agenda tu videollamada", "Al enviar, eliges día y hora en el calendario."],
        ["Hablamos en tu idioma", "Confirmamos por correo y te preguntamos el idioma."],
      ]
    : [
        ["Tell us what you want", "A short form. Two minutes."],
        ["Book your video call", "Once sent, pick a day and time on the calendar."],
        ["We talk in your language", "We confirm by email and ask your preferred language."],
      ];
  const src = step === "schedule" ? calendlySrc(form.name, form.email) : "";

  return (
    <div className="ct">
      <div className="ct-board" ref={boardRef}>
        {step === "form" ? (
          <>
            <div className="ct-head">
              <div>
                <span className="ct-kicker">{es ? "CONTACTO" : "CONTACT"}</span>
                <h1>
                  {es ? "Empecemos por" : "Let's start with"} <strong>{es ? "una conversación." : "a conversation."}</strong>
                </h1>
              </div>
              <p>
                {es
                  ? "Nos cuentas qué quieres, eliges un momento para hablar y te acompañamos desde ahí."
                  : "Tell us what you want, pick a time to talk, and we'll take it from there."}
              </p>
            </div>

            <div className="ct-grid">
              <aside className="ct-side">
                <ol className="ct-steps">
                  {STEPS.map(([t, x], i) => (
                    <li key={t} className={i === 0 ? "is-on" : ""}>
                      <span className="ct-num">{i + 1}</span>
                      <span>
                        <b>{t}</b>
                        <span>{x}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <div className="ct-other">
                  <span className="ct-other-label">{es ? "¿PREFIERES OTRO CAMINO?" : "PREFER ANOTHER WAY?"}</span>
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="ct-channel">
                    <span className="ct-ic ct-ic-wa" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M.057 24l1.687-6.163A11.867 11.867 0 0 1 .157 11.891C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                      </svg>
                    </span>
                    <span className="ct-ch-text">
                      <b>WhatsApp</b>
                      <span>{WHATSAPP_DISPLAY} · {es ? "te responde una persona" : "a person replies"}</span>
                    </span>
                    <span className="ct-ch-cta">{es ? "Escribir →" : "Message →"}</span>
                  </a>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="ct-channel">
                    <span className="ct-ic ct-ic-mail" aria-hidden="true">@</span>
                    <span className="ct-ch-text">
                      <b>{es ? "Correo" : "Email"}</b>
                      <span>{CONTACT_EMAIL}</span>
                    </span>
                    <span className="ct-ch-cta">{es ? "Escribir →" : "Write →"}</span>
                  </a>
                </div>
              </aside>

              <form className="ct-form" onSubmit={handleSubmit}>
                <div className="ct-row">
                  <label className="ct-field">
                    <span>{es ? "NOMBRE" : "NAME"}</span>
                    <input name="name" value={form.name} onChange={onInput} required autoComplete="name" placeholder={es ? "Tu nombre" : "Your name"} />
                  </label>
                  <label className="ct-field">
                    <span>{es ? "CORREO" : "EMAIL"}</span>
                    <input name="email" type="email" value={form.email} onChange={onInput} required autoComplete="email" placeholder={es ? "tu@correo.com" : "you@email.com"} />
                  </label>
                  <label className="ct-field">
                    <span>WHATSAPP</span>
                    <input name="phone" type="tel" value={form.phone} onChange={onInput} autoComplete="tel" placeholder="+1 305 555 0123" />
                  </label>
                </div>

                <fieldset className="ct-chips">
                  <legend>{es ? "¿QUÉ TE INTERESA?" : "WHAT ARE YOU INTERESTED IN?"}</legend>
                  <div>
                    {[...specialties.map((s) => ({ id: s.id, label: es ? s.name : s.nameEn })), { id: UNSURE, label: es ? "Aún no lo sé" : "Not sure yet" }].map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        className={form.specialty === o.id ? "is-on" : ""}
                        aria-pressed={form.specialty === o.id}
                        onClick={() => set("specialty", o.id)}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="ct-row">
                  <label className="ct-field">
                    <span>{es ? "PAÍS" : "COUNTRY"}</span>
                    <input name="country" value={form.country} onChange={onInput} autoComplete="country-name" placeholder={es ? "Dónde vives" : "Where you live"} />
                  </label>
                  <label className="ct-field">
                    <span>{es ? "¿CUÁNDO TE GUSTARÍA VIAJAR?" : "WHEN WOULD YOU LIKE TO TRAVEL?"}</span>
                    <select name="when" value={form.when} onChange={onInput}>
                      {WHEN.map((w) => (
                        <option key={w.v} value={w.v}>
                          {es ? w.es : w.en}
                        </option>
                      ))}
                    </select>
                  </label>
                  <fieldset className="ct-chips ct-lang">
                    <legend>{es ? "IDIOMA PARA HABLAR" : "LANGUAGE TO TALK IN"}</legend>
                    <div>
                      {[
                        ["es", "Español"],
                        ["en", "English"],
                      ].map(([v, l]) => (
                        <button key={v} type="button" className={form.lang === v ? "is-on" : ""} aria-pressed={form.lang === v} onClick={() => set("lang", v)}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </div>

                <label className="ct-field">
                  <span>{es ? "CUÉNTANOS UN POCO MÁS (OPCIONAL)" : "TELL US A LITTLE MORE (OPTIONAL)"}</span>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={onInput}
                    rows={2}
                    placeholder={es ? "Qué te gustaría cambiar, dudas, lo que quieras…" : "What you'd like to change, questions, anything…"}
                  />
                </label>

                {submitError && (
                  <p className="ct-error" role="alert">
                    {es
                      ? "No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp."
                      : "We couldn't send your request. Try again or message us on WhatsApp."}
                  </p>
                )}

                <div className="ct-send">
                  <button type="submit" disabled={submitting}>
                    {submitting ? (es ? "Enviando…" : "Sending…") : es ? "Enviar y agendar videollamada →" : "Send and book a video call →"}
                  </button>
                  <span>{es ? "Sin compromiso. Tus datos solo los usamos para responderte." : "No commitment. We only use your details to reply to you."}</span>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="ct-done">
            <div className="ct-done-copy">
              <span className="ct-ok">✓ {es ? "Recibimos tu solicitud" : "We got your request"}</span>
              <h1>
                {es ? "Ahora elige" : "Now choose"} <strong>{es ? "cuándo hablamos." : "when we talk."}</strong>
              </h1>
              <p className={serif.className}>
                {src
                  ? es
                    ? "Una videollamada para conocerte y resolver tus dudas. Te llegará la confirmación a tu correo."
                    : "A video call to get to know you and answer your questions. The confirmation will reach your email."
                  : es
                    ? "Te escribiremos a tu correo para acordar el día y la hora de tu videollamada."
                    : "We'll email you to agree on a day and time for your video call."}
              </p>
              <div className="ct-summary">
                <span>{[form.name, specialtyLabel(), form.lang === "en" ? "English" : "Español"].filter(Boolean).join(" · ")}</span>
                <button type="button" onClick={() => setStep("form")}>
                  {es ? "Editar mis datos" : "Edit my details"}
                </button>
              </div>
              <span className="ct-alt">
                {src ? (es ? "¿Ninguna hora te sirve? " : "No time works for you? ") : es ? "¿Prefieres hablar ya? " : "Rather talk now? "}
                <a href={waLink} target="_blank" rel="noopener noreferrer">
                  {es ? "Escríbenos por WhatsApp" : "Message us on WhatsApp"}
                </a>
              </span>
            </div>
            {src ? (
              <iframe className="ct-cal" src={src} title={es ? "Agenda tu videollamada" : "Book your video call"} />
            ) : (
              <div className="ct-cal ct-cal-empty">
                <span>✉</span>
                <b>{es ? "Revisa tu correo" : "Check your email"}</b>
                <p>{form.email}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .ct {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100svh;
          overflow: hidden;
          background: var(--negro-suave);
        }
        /* Design board CT1 at its 1440 px, fitted to the screen (useFitBoard). */
        .ct-board {
          --f: var(--fit, 1);
          display: flex;
          flex-direction: column;
          gap: calc(22px * var(--f));
          flex-shrink: 0;
          box-sizing: border-box;
          width: 1440px;
          padding: max(88px, calc(96px * var(--f))) 120px calc(44px * var(--f));
          color: #101a18;
          font-family: "Manrope", var(--font-sans);
        }
        .ct-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
        }
        .ct-head > div {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .ct-kicker {
          color: #b0703c;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.16em;
        }
        .ct h1 {
          margin: 0;
          color: #101a18;
          -webkit-text-fill-color: currentColor;
          background: none;
          font-family: "Manrope", var(--font-sans);
          font-size: calc(58px * var(--f));
          font-weight: 300;
          line-height: 1.02;
          letter-spacing: -0.05em;
        }
        .ct h1 strong {
          color: #0a4a42;
          font-weight: 700;
        }
        .ct-head p {
          max-width: 360px;
          margin: 0;
          color: #515856;
          font-size: 15px;
          line-height: 1.5;
          text-align: right;
        }
        .ct-grid {
          display: grid;
          grid-template-columns: 380px minmax(0, 1fr);
          gap: 60px;
        }
        .ct-side {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .ct-steps {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .ct-steps li {
          display: flex;
          gap: 16px;
          padding: calc(15px * var(--f)) 0;
          border-top: 1px solid rgba(16, 26, 24, 0.1);
        }
        .ct-num {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          box-shadow: inset 0 0 0 1.5px rgba(10, 74, 66, 0.3);
          color: #0a4a42;
          font-size: 14px;
          font-weight: 800;
        }
        .ct-steps li.is-on .ct-num {
          background: #0a4a42;
          box-shadow: none;
          color: #fff;
        }
        .ct-steps li > span:last-child {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .ct-steps b {
          font-size: 18px;
        }
        .ct-steps li > span:last-child > span {
          color: #515856;
          font-size: 14px;
          line-height: 1.45;
        }
        .ct-other {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: auto;
        }
        .ct-other-label {
          color: #8a918f;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.14em;
        }
        .ct-other :global(.ct-channel) {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: calc(11px * var(--f)) 16px;
          border-radius: 18px;
          background: #fff;
          color: #101a18;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .ct-other :global(.ct-channel:hover) {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px -30px rgba(10, 40, 36, 0.6);
        }
        .ct-ic {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          color: #fff;
          font-size: 20px;
          font-weight: 800;
        }
        .ct-ic-wa {
          background: #25d366;
        }
        .ct-ic-mail {
          background: #0a4a42;
        }
        .ct-ch-text {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          gap: 2px;
          min-width: 0;
        }
        .ct-ch-text b {
          font-size: 16px;
        }
        .ct-ch-text span {
          color: #515856;
          font-size: 13px;
        }
        .ct-ch-cta {
          color: #0a4a42;
          font-size: 14px;
          font-weight: 800;
          white-space: nowrap;
        }
        .ct-form {
          display: flex;
          flex-direction: column;
          gap: calc(16px * var(--f));
          padding: calc(24px * var(--f)) 28px;
          border-radius: 28px;
          background: #fff;
          box-shadow: 0 40px 80px -60px rgba(10, 40, 36, 0.55);
        }
        .ct-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: calc(14px * var(--f)) 14px;
        }
        .ct-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
          min-width: 0;
        }
        .ct-field > span,
        .ct-chips legend {
          padding: 0;
          color: #515856;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.06em;
        }
        .ct-field input,
        .ct-field select,
        .ct-field textarea {
          box-sizing: border-box;
          width: 100%;
          padding: calc(14px * var(--f)) 16px;
          border: 0;
          border-radius: 14px;
          background: #faf6f0;
          box-shadow: inset 0 0 0 1px rgba(16, 26, 24, 0.1);
          color: #101a18;
          font: 15px "Manrope", var(--font-sans);
          outline: none;
          transition: box-shadow 0.2s ease, background 0.2s ease;
        }
        .ct-field textarea {
          resize: vertical;
          min-height: calc(64px * var(--f));
        }
        .ct-field input::placeholder,
        .ct-field textarea::placeholder {
          color: #9aa19f;
        }
        .ct-field input:focus,
        .ct-field select:focus,
        .ct-field textarea:focus {
          background: #fff;
          box-shadow: inset 0 0 0 2px #0a4a42;
        }
        .ct-chips {
          min-width: 0;
          margin: 0;
          padding: 0;
          border: 0;
        }
        .ct-chips legend {
          margin-bottom: 9px;
        }
        .ct-chips > div {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .ct-chips button {
          padding: 10px 15px;
          border: 0;
          border-radius: 999px;
          background: #fff;
          box-shadow: inset 0 0 0 1px rgba(16, 26, 24, 0.12);
          color: #2a3432;
          font: 800 14px "Manrope", var(--font-sans);
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
        }
        .ct-chips button:hover {
          box-shadow: inset 0 0 0 1.5px #0a4a42;
        }
        .ct-chips button.is-on {
          background: #0a4a42;
          box-shadow: none;
          color: #fff;
        }
        .ct-lang button {
          font-size: 13px;
        }
        .ct-error {
          margin: 0;
          color: #b3261e;
          font-size: 14px;
        }
        .ct-send {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .ct-send button {
          padding: 17px 26px;
          border: 0;
          border-radius: 999px;
          background: #0a4a42;
          color: #fff;
          font: 800 16px "Manrope", var(--font-sans);
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .ct-send button:hover {
          background: #0d5c52;
          transform: translateY(-2px);
        }
        .ct-send button:disabled {
          opacity: 0.6;
          cursor: wait;
          transform: none;
        }
        .ct-send span {
          max-width: 230px;
          color: #515856;
          font-size: 13px;
          line-height: 1.4;
        }
        .ct-done {
          display: grid;
          grid-template-columns: 360px minmax(0, 1fr);
          gap: 50px;
          align-items: center;
          min-height: calc(700px * var(--f));
        }
        .ct-done-copy {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .ct-ok {
          align-self: flex-start;
          padding: 8px 14px;
          border-radius: 999px;
          background: #eef5f1;
          color: #0a4a42;
          font-size: 13px;
          font-weight: 800;
        }
        .ct-done-copy p {
          margin: 0;
          color: #2a3432;
          font-size: 20px;
          line-height: 1.5;
        }
        .ct-summary {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 14px;
          border-top: 1px solid rgba(16, 26, 24, 0.1);
          color: #515856;
          font-size: 15px;
        }
        .ct-summary button {
          align-self: flex-start;
          padding: 0;
          border: 0;
          background: none;
          color: #0a4a42;
          font: 800 15px "Manrope", var(--font-sans);
          cursor: pointer;
        }
        .ct-alt {
          color: #515856;
          font-size: 14px;
        }
        .ct-alt :global(a) {
          color: #0a4a42;
          font-weight: 800;
        }
        .ct-cal {
          width: 100%;
          height: calc(660px * var(--f));
          border: 0;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 40px 80px -60px rgba(10, 40, 36, 0.55);
        }
        .ct-cal-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: calc(420px * var(--f));
          color: #0a4a42;
        }
        .ct-cal-empty span {
          font-size: 40px;
        }
        .ct-cal-empty b {
          font-size: 22px;
        }
        .ct-cal-empty p {
          margin: 0;
          color: #515856;
        }
        @media (max-width: 900px) {
          .ct {
            min-height: 0;
          }
          .ct-board {
            width: 100%;
            padding: 6rem 1.25rem 3.5rem;
          }
          .ct-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
          }
          .ct h1 {
            font-size: 2.4rem;
          }
          .ct-head p {
            text-align: left;
          }
          .ct-grid,
          .ct-done {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .ct-form {
            order: -1;
            padding: 22px 18px;
          }
          .ct-row {
            grid-template-columns: 1fr;
          }
          .ct-send {
            flex-direction: column;
            align-items: stretch;
          }
          .ct-send span {
            max-width: none;
          }
          .ct-cal {
            height: 1000px;
          }
        }
      `}</style>
    </div>
  );
}

export default function Contacto() {
  // useSearchParams() needs a Suspense boundary above it per Next.js.
  return (
    <Suspense fallback={null}>
      <ContactoForm />
    </Suspense>
  );
}
