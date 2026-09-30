"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useSpecialties } from "@/lib/useStoredData";
import { AGENT_NAME, waHref } from "@/lib/contact";


/** How long a specialty page waits before the bubble opens itself. Long enough
 *  that the visitor has started reading, short enough to still feel like an
 *  offer of help rather than an interruption. */
const AUTO_OPEN_DELAY = 2800;
/** The bubble goes straight to WhatsApp instead of opening the in-page chat
 *  preview. The preview (ChatPanel, auto-open) is kept intact below: set this
 *  to false to bring it back. */
const DIRECT_TO_WHATSAPP = true;
/** Below this width the panel covers most of the page, so it never opens on
 *  its own — on a phone the visitor taps the bubble when they want it. */
const AUTO_OPEN_MIN_WIDTH = "(min-width: 769px)";
/** The "typing…" beat before the second message lands. */
const TYPING_DELAY = 1400;

interface QuickReply {
  label: string;
  message: string;
}


/** Brand seal, reused from the splash screen — the avatar in the chat header. */
function BrandAvatar({ size = 42 }: { size?: number }) {
  return (
    <span className="wa-avatar" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        width={size * 0.55}
        height={size * 0.55}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
        />
      </svg>
      <style jsx>{`
        .wa-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 50%;
          background: linear-gradient(135deg, #1d7a6e 0%, #5dcaa5 100%);
          color: #062e29;
          border: 2px solid rgba(255, 255, 255, 0.25);
        }
      `}</style>
    </span>
  );
}

interface ChatPanelProps {
  es: boolean;
  intro: string;
  followUp: string;
  quickReplies: QuickReply[];
  /** Formatted start time of the conversation. */
  clock: string;
  onClose: () => void;
}

/**
 * The conversation itself. Mounted only while open and keyed by specialty, so
 * every treatment gets its own thread and the greeting replays for it — which
 * is also why none of this state needs a reset effect.
 */
function ChatPanel({ es, intro, followUp, quickReplies, clock, onClose }: ChatPanelProps) {
  /** false while the agent is "typing" the second message. */
  const [revealed, setRevealed] = useState(false);
  /** Outgoing bubbles, so the transcript still reads as a conversation when
   *  the visitor comes back from the WhatsApp tab. */
  const [sent, setSent] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setRevealed(true), TYPING_DELAY);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [revealed, sent]);

  const remember = (message: string) => setSent((prev) => [...prev, message]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    remember(text);
    setDraft("");
    window.open(waHref(text), "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="wa-panel"
      role="dialog"
      aria-label={es ? "Chat de WhatsApp con Bridge Care" : "WhatsApp chat with Bridge Care"}
    >
      {/* --------------------------------------------------------- header */}
      <header className="wa-head">
        <BrandAvatar size={42} />
        <div className="wa-head-text">
          <strong>Bridge Care</strong>
          <span>
            <i className="wa-dot" />
            {es ? "En línea · responde en minutos" : "Online · replies in minutes"}
          </span>
        </div>
        <button
          type="button"
          className="wa-close"
          onClick={onClose}
          aria-label={es ? "Cerrar chat" : "Close chat"}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </header>

      {/* ----------------------------------------------------- transcript */}
      <div className="wa-body" ref={transcriptRef}>
        <div className="wa-day">{es ? "HOY" : "TODAY"}</div>

        <div className="wa-msg wa-in">
          <p>{intro}</p>
          <time>{clock}</time>
        </div>

        {!revealed ? (
          <div className="wa-msg wa-in wa-typing" aria-label={es ? "Escribiendo" : "Typing"}>
            <span />
            <span />
            <span />
          </div>
        ) : (
          <>
            <div className="wa-msg wa-in">
              <p>{followUp}</p>
              <time>{clock}</time>
            </div>

            <div className="wa-chips">
              {quickReplies.map((q) => (
                <a
                  key={q.label}
                  className="wa-chip"
                  href={waHref(q.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => remember(q.message)}
                >
                  {q.label}
                </a>
              ))}
            </div>
          </>
        )}

        {sent.map((message, i) => (
          <div className="wa-msg wa-out" key={`${i}-${message.slice(0, 12)}`}>
            <p>{message}</p>
            <time>
              {clock}
              <svg viewBox="0 0 16 11" width="15" height="11" fill="currentColor" aria-hidden="true">
                <path d="M11.07.65a.5.5 0 0 1 .06.7L5.4 8.2a.5.5 0 0 1-.74.04L1.6 5.3a.5.5 0 1 1 .68-.73l2.66 2.5L10.37.71a.5.5 0 0 1 .7-.06Z" />
                <path d="M15.07.65a.5.5 0 0 1 .06.7L9.4 8.2a.5.5 0 0 1-.74.04l-1.1-1.03.68-.86.9.85L14.37.71a.5.5 0 0 1 .7-.06Z" />
              </svg>
            </time>
          </div>
        ))}
      </div>

      {/* ------------------------------------------------------- composer */}
      <form className="wa-composer" onSubmit={submit}>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={es ? "Escribe tu mensaje…" : "Type your message…"}
          aria-label={es ? "Escribe tu mensaje" : "Type your message"}
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          aria-label={es ? "Enviar por WhatsApp" : "Send on WhatsApp"}
        >
          <svg viewBox="0 0 24 24" width="19" height="19" fill="currentColor" aria-hidden="true">
            <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>

      <p className="wa-foot">
        🔒{" "}
        {es
          ? "Se abre en WhatsApp. Tu conversación es privada."
          : "Opens in WhatsApp. Your conversation is private."}
      </p>

      <style jsx>{`
        .wa-panel {
          width: 364px;
          max-width: calc(100vw - 2rem);
          max-height: min(72vh, 580px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-radius: 20px;
          background: var(--pure-white);
          border: 1px solid rgba(29, 122, 110, 0.14);
          box-shadow: 0 24px 60px rgba(10, 74, 66, 0.28);
          transform-origin: bottom right;
          animation: wa-in 0.34s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes wa-in {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.94);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .wa-head {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1rem;
          background: linear-gradient(135deg, var(--teal-dark) 0%, var(--teal-primary) 100%);
          color: #fff;
          flex-shrink: 0;
        }
        .wa-head-text {
          display: flex;
          flex-direction: column;
          line-height: 1.3;
          min-width: 0;
          flex: 1;
        }
        .wa-head-text strong {
          font-size: 0.98rem;
          font-weight: 600;
          color: #fff;
        }
        .wa-head-text span {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.74rem;
          color: rgba(255, 255, 255, 0.78);
        }
        .wa-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #5dcaa5;
          box-shadow: 0 0 0 0 rgba(93, 202, 165, 0.7);
          animation: wa-blink 2s infinite;
        }
        @keyframes wa-blink {
          70% {
            box-shadow: 0 0 0 6px rgba(93, 202, 165, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(93, 202, 165, 0);
          }
        }
        .wa-close {
          border: none;
          background: rgba(255, 255, 255, 0.12);
          color: #fff;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: var(--transition-fast);
        }
        .wa-close:hover {
          background: rgba(255, 255, 255, 0.24);
        }

        /* ------------------------------------------------------ transcript */
        .wa-body {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 0.9rem 0.6rem;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          background-color: #ece5dd;
          background-image:
            radial-gradient(rgba(29, 122, 110, 0.07) 1px, transparent 1px),
            radial-gradient(rgba(29, 122, 110, 0.05) 1px, transparent 1px);
          background-size: 26px 26px, 26px 26px;
          background-position: 0 0, 13px 13px;
          scrollbar-width: thin;
        }
        .wa-day {
          align-self: center;
          padding: 0.2rem 0.75rem;
          margin-bottom: 0.25rem;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.75);
          color: var(--gris-texto);
          font-size: 0.64rem;
          font-weight: 600;
          letter-spacing: 0.08em;
        }

        .wa-msg {
          position: relative;
          max-width: 86%;
          padding: 0.5rem 0.7rem 0.45rem;
          border-radius: 12px;
          font-size: 0.855rem;
          line-height: 1.5;
          color: #12211f;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
          animation: wa-msg-in 0.28s ease-out;
        }
        @keyframes wa-msg-in {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .wa-msg p {
          margin: 0;
          white-space: pre-line;
        }
        .wa-msg time {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.2rem;
          margin-top: 0.15rem;
          font-size: 0.64rem;
          color: rgba(18, 33, 31, 0.45);
        }
        .wa-in {
          align-self: flex-start;
          background: var(--pure-white);
          border-top-left-radius: 3px;
        }
        .wa-out {
          align-self: flex-end;
          background: #d9fdd3;
          border-top-right-radius: 3px;
        }
        .wa-out time {
          color: rgba(18, 33, 31, 0.5);
        }
        .wa-out time svg {
          color: #34b7f1;
        }

        .wa-typing {
          display: flex;
          gap: 4px;
          padding: 0.75rem 0.8rem;
        }
        .wa-typing span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(18, 33, 31, 0.28);
          animation: wa-bounce 1.3s infinite;
        }
        .wa-typing span:nth-child(2) {
          animation-delay: 0.18s;
        }
        .wa-typing span:nth-child(3) {
          animation-delay: 0.36s;
        }
        @keyframes wa-bounce {
          0%,
          60%,
          100% {
            transform: translateY(0);
            opacity: 0.45;
          }
          30% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }

        .wa-chips {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.4rem;
          margin-top: 0.15rem;
        }
        .wa-chip {
          max-width: 90%;
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-full);
          background: var(--pure-white);
          border: 1.5px solid var(--teal-primary);
          color: var(--teal-primary);
          font-size: 0.8rem;
          font-weight: 600;
          text-align: center;
          text-decoration: none;
          transition: var(--transition-fast);
        }
        .wa-chip:hover {
          background: var(--teal-primary);
          color: #fff;
          transform: translateY(-1px);
        }

        /* -------------------------------------------------------- composer */
        .wa-composer {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 0.7rem 0.45rem;
          background: var(--pure-white);
          flex-shrink: 0;
        }
        .wa-composer input {
          flex: 1;
          min-width: 0;
          padding: 0.6rem 0.9rem;
          border: 1px solid rgba(29, 122, 110, 0.2);
          border-radius: var(--radius-full);
          background: var(--negro-suave);
          color: var(--blanco-hueso);
          font-family: inherit;
          font-size: 0.86rem;
          outline: none;
          transition: var(--transition-fast);
        }
        .wa-composer input:focus {
          border-color: var(--teal-primary);
          box-shadow: 0 0 0 3px rgba(29, 122, 110, 0.12);
        }
        .wa-composer button {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border: none;
          border-radius: 50%;
          background: #25d366;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .wa-composer button:hover:not(:disabled) {
          background: #20ba5a;
        }
        .wa-composer button:disabled {
          background: rgba(29, 122, 110, 0.22);
          cursor: not-allowed;
        }

        .wa-foot {
          margin: 0;
          padding: 0 0.9rem 0.7rem;
          background: var(--pure-white);
          color: var(--gris-texto);
          font-size: 0.68rem;
          text-align: center;
        }

        @media (max-width: 560px) {
          .wa-panel {
            width: 100%;
            max-width: none;
            max-height: 74vh;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wa-panel,
          .wa-msg,
          .wa-dot,
          .wa-typing span {
            animation: none;
          }
          .wa-chip:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Floating WhatsApp bubble that expands into a WhatsApp-styled conversation.
 *
 * On a specialty page — and only on a screen wide enough for the panel not to
 * bury the page — it opens itself once per session and greets the visitor by
 * the treatment they are reading about, with quick replies that carry that
 * context straight into the real WhatsApp thread. Everywhere else, and on
 * phones, it stays a plain bubble the visitor opens on purpose.
 */
export default function WhatsAppChat() {
  const { language } = useLanguage();
  const es = language === "es";
  const pathname = usePathname();
  const specialties = useSpecialties();

  const [open, setOpen] = useState(false);
  /** Kills the unread badge for good once the visitor has seen the panel. */
  const [seen, setSeen] = useState(false);
  /** When the conversation started. Never set during render, so the timestamps
   *  can't desync between the server pass and the client one. */
  const [startedAt, setStartedAt] = useState<Date | null>(null);

  /** Stops the auto-open timer from firing after a manual dismissal. */
  const dismissed = useRef(false);

  const slug = useMemo(() => {
    const match = pathname?.match(/^\/specialties\/([^/]+)/);
    return match ? match[1] : null;
  }, [pathname]);

  const specialty = useMemo(
    () => (slug ? (specialties.find((s) => s.id === slug) ?? null) : null),
    [slug, specialties],
  );

  const name = specialty ? (es ? specialty.name : specialty.nameEn || specialty.name) : null;

  const clock = startedAt
    ? startedAt.toLocaleTimeString(es ? "es-CO" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  // ----------------------------------------------------------------- script
  const intro = es
    ? `¡Hola! 👋 Soy ${AGENT_NAME}, coordinadora de pacientes internacionales de Bridge Care.`
    : `Hi! 👋 I'm ${AGENT_NAME}, international patient coordinator at Bridge Care.`;

  const followUp = name
    ? es
      ? `Veo que estás viendo ${name}. Puedo pasarte precios reales, cuántos días necesitas en Colombia y agendar tu valoración virtual — sin costo.\n\n¿Con qué te ayudo?`
      : `I see you're looking at ${name}. I can send you real prices, how many days you'd need in Colombia, and book your virtual assessment — free of charge.\n\nWhat can I help you with?`
    : es
      ? "Cuéntame qué tratamiento tienes en mente y te armo un plan con precios, clínica y tiempos.\n\n¿Con qué te ayudo?"
      : "Tell me which treatment you have in mind and I'll put together a plan with prices, clinic and timing.\n\nWhat can I help you with?";

  const quickReplies: QuickReply[] = useMemo(() => {
    if (name) {
      return [
        {
          label: es ? "💰 Precios y qué incluye" : "💰 Prices and what's included",
          message: es
            ? `Hola ${AGENT_NAME}, estoy viendo ${name} en la página de Bridge Care. ¿Me pasas precios y qué incluye el paquete?`
            : `Hi ${AGENT_NAME}, I'm looking at ${name} on the Bridge Care site. Could you send me prices and what the package includes?`,
        },
        {
          label: es ? "📅 ¿Cuántos días me quedo?" : "📅 How many days do I stay?",
          message: es
            ? `Hola, quiero saber cuántos días debo quedarme en Colombia para ${name}.`
            : `Hi, I'd like to know how many days I need to stay in Colombia for ${name}.`,
        },
        {
          label: es ? "✅ Agendar valoración gratis" : "✅ Book a free assessment",
          message: es
            ? `Hola, quiero agendar la valoración virtual gratuita para ${name}.`
            : `Hi, I'd like to book the free virtual assessment for ${name}.`,
        },
      ];
    }
    return [
      {
        label: es ? "💰 Quiero precios" : "💰 I want prices",
        message: es
          ? "Hola, quiero información de precios de los tratamientos de Bridge Care."
          : "Hi, I'd like pricing information for Bridge Care treatments.",
      },
      {
        label: es ? "✅ Agendar valoración gratis" : "✅ Book a free assessment",
        message: es
          ? "Hola, quiero agendar una valoración virtual gratuita."
          : "Hi, I'd like to book a free virtual assessment.",
      },
      {
        label: es ? "🧭 ¿Cómo funciona?" : "🧭 How does it work?",
        message: es
          ? "Hola, ¿me explicas cómo funciona el proceso con Bridge Care?"
          : "Hi, could you explain how the process with Bridge Care works?",
      },
    ];
  }, [name, es]);

  // ---------------------------------------------------------------- actions
  const reveal = useCallback(() => {
    setOpen(true);
    setSeen(true);
    setStartedAt(new Date());
  }, []);

  const close = useCallback(() => {
    dismissed.current = true;
    setOpen(false);
  }, []);

  const toggle = () => {
    if (DIRECT_TO_WHATSAPP) {
      setSeen(true);
      window.open(
        waHref(
          name
            ? es
              ? `Hola, estoy viendo ${name} en la página de Bridge Care y quiero más información.`
              : `Hi, I'm looking at ${name} on the Bridge Care site and I'd like more information.`
            : es
              ? "Hola, quiero más información sobre Bridge Care."
              : "Hi, I'd like more information about Bridge Care.",
        ),
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }
    if (open) close();
    else reveal();
  };

  // Auto-open, once per specialty per session, on screens wide enough for the
  // panel not to bury the page, and never after a manual close.
  useEffect(() => {
    if (DIRECT_TO_WHATSAPP || !slug || dismissed.current) return;

    const wideEnough = window.matchMedia(AUTO_OPEN_MIN_WIDTH);
    if (!wideEnough.matches) return;

    const key = `bc_wa_greeted_${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
    } catch {
      return; // private mode — better silent than nagging on every page view
    }

    const openNow = () => {
      // Re-checked on fire: a rotation or resize during the delay counts.
      if (dismissed.current || !wideEnough.matches) return;
      try {
        sessionStorage.setItem(key, "1");
      } catch {
        /* storage disabled; the timer already ran, so just open */
      }
      reveal();
    };

    // The page's hero carries the lead form, and the lead form is the primary
    // channel. Opening the panel over it would bury it, so wait until the hero
    // has scrolled out of view, then greet after the usual delay.
    const hero = document.querySelector(".sp-hero");
    let timer: number | undefined;
    if (!hero || typeof IntersectionObserver === "undefined") {
      timer = window.setTimeout(openNow, AUTO_OPEN_DELAY);
      return () => window.clearTimeout(timer);
    }

    const io = new IntersectionObserver(([entry]) => {
      window.clearTimeout(timer);
      if (!entry.isIntersecting) timer = window.setTimeout(openNow, AUTO_OPEN_DELAY);
    });
    io.observe(hero);

    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [slug, reveal]);

  // On phones the floating bubble sits right where the keyboard pushes a form
  // field; hide it while the visitor is typing in any form.
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    const isField = (el: EventTarget | null) =>
      el instanceof HTMLElement && el.matches("input, textarea, select");
    const onIn = (e: FocusEvent) => isField(e.target) && setTyping(true);
    const onOut = (e: FocusEvent) => isField(e.target) && setTyping(false);
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  return (
    <div className={`wa-root${typing && !open ? " is-typing" : ""}`}>
      {open && (
        <ChatPanel
          key={slug ?? "general"}
          es={es}
          intro={intro}
          followUp={followUp}
          quickReplies={quickReplies}
          clock={clock}
          onClose={close}
        />
      )}

      <button
        type="button"
        className={`wa-bubble${open ? " is-open" : ""}`}
        onClick={toggle}
        aria-expanded={DIRECT_TO_WHATSAPP ? undefined : open}
        aria-label={
          open
            ? es
              ? "Cerrar chat de WhatsApp"
              : "Close WhatsApp chat"
            : es
              ? "Abrir chat de WhatsApp"
              : "Open WhatsApp chat"
        }
      >
        {open ? (
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 448 512" width="30" height="30" fill="currentColor" aria-hidden="true">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
          </svg>
        )}
        {!seen && <span className="wa-badge">1</span>}
      </button>

      <style jsx>{`
        .wa-root {
          position: fixed;
          right: 2rem;
          bottom: 2rem;
          z-index: 1200;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.9rem;
        }

        .wa-bubble {
          position: relative;
          width: 60px;
          height: 60px;
          flex-shrink: 0;
          border: none;
          border-radius: 50%;
          background: #25d366;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
          transition: var(--transition);
          animation: wa-pulse 2.4s infinite;
        }
        .wa-bubble:hover {
          background: #20ba5a;
          transform: scale(1.08);
        }
        .wa-bubble.is-open {
          background: var(--teal-dark);
          box-shadow: var(--shadow-md);
          animation: none;
        }
        .wa-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          min-width: 22px;
          height: 22px;
          padding: 0 6px;
          border-radius: var(--radius-full);
          background: #ff3b30;
          color: #fff;
          font-size: 0.72rem;
          font-weight: 700;
          line-height: 22px;
          border: 2px solid var(--negro-suave);
        }
        @keyframes wa-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(37, 211, 102, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
          }
        }

        @media (max-width: 560px) {
          .wa-root {
            right: 1rem;
            bottom: 1rem;
            left: 1rem;
          }
          .wa-bubble {
            width: 54px;
            height: 54px;
          }
          /* Out of the way while the keyboard is up. */
          .wa-root.is-typing {
            opacity: 0;
            pointer-events: none;
            transform: translateY(12px);
          }
        }
        .wa-root {
          transition:
            opacity 0.2s ease,
            transform 0.2s ease;
        }

        @media (prefers-reduced-motion: reduce) {
          .wa-bubble {
            animation: none;
          }
          .wa-bubble:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
