"use client";

import React from "react";
import Link from "next/link";
import { useSpecialties, useDestinations } from "@/lib/useStoredData";
import { useLanguage } from "@/context/LanguageContext";
import { AGENT_NAME, CONTACT_EMAIL, WHATSAPP_DISPLAY, waHref } from "@/lib/contact";

/* Footer, design board AQ: bone like the rest of the site, and it opens with
   one last conversation (the same coordinator as the chat on the procedure
   pages) before the link columns and the legal row. */
export default function Footer() {
  const { language, t } = useLanguage();
  const es = language === "es";
  // Hydration-safe reads — the footer is on every page, so reading
  // localStorage during render made the mismatch site-wide.
  const specialties = useSpecialties();
  const destinations = useDestinations();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-cta">
          <p className="footer-cta-title">
            {es ? "¿Tienes una duda?" : "Got a question?"}{" "}
            <strong>{es ? `${AGENT_NAME} está en línea.` : `${AGENT_NAME} is online.`}</strong>
          </p>
          <a
            className="footer-cta-btn"
            href={waHref(es ? `Hola ${AGENT_NAME}, tengo una pregunta.` : `Hi ${AGENT_NAME}, I have a question.`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="footer-cta-avatar" aria-hidden="true">
              {AGENT_NAME.charAt(0)}
              <i />
            </span>
            {es ? "Escribirle por WhatsApp" : "Message her on WhatsApp"}
          </a>
        </div>

        <div className="footer-grid">
          <div className="footer-col brand-col">
            <Link href="/" className="footer-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/isotipo.svg" alt="Bridge Care" className="footer-logo-img" width={153} height={42} />
            </Link>
            <p className="footer-desc">{t("footer.desc")}</p>
            <div className="footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">FB</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">IG</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="YouTube">YT</a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">{t("nav.specialties")}</h4>
            <ul className="footer-links">
              {specialties.map((spec) => (
                <li key={spec.id}>
                  <Link href={`/specialties/${spec.id}`}>{es ? spec.name : spec.nameEn}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">{t("nav.destinations")}</h4>
            <ul className="footer-links">
              {destinations.map((dest) => (
                <li key={dest.id}>
                  <Link href={`/destinations/${dest.id}`}>{dest.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">{t("footer.contact")}</h4>
            <ul className="footer-links">
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </li>
              <li>
                <a href={waHref(es ? "Hola, tengo una pregunta." : "Hi, I have a question.")} target="_blank" rel="noopener noreferrer">
                  WhatsApp {WHATSAPP_DISPLAY}
                </a>
              </li>
              <li>
                <span>{t("footer.location.val")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Bridge Care. {t("footer.rights")}
          </p>
          <div className="bottom-links">
            <Link href="/blog">{t("nav.blog")}</Link>
            <Link href="/nosotros#garantias">{t("footer.guarantees")}</Link>
            <Link href="/privacidad">{t("footer.privacy")}</Link>
            <Link href="/terminos">{t("footer.terms")}</Link>
            <Link href="/contacto">{t("nav.book")}</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .site-footer {
          position: relative;
          z-index: 10;
          padding: clamp(3.5rem, 8vh, 5.5rem) 0 clamp(1.5rem, 3.5vh, 2.75rem);
          border-top: 1px solid rgba(29, 122, 110, 0.18);
          background: var(--negro-suave);
          color: #515856;
        }

        /* The last conversation */
        .footer-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem 3.5rem;
          margin-bottom: clamp(2.5rem, 6vh, 4rem);
        }
        .footer-cta-title {
          margin: 0;
          color: #101a18;
          font-family: "Manrope", var(--font-sans);
          font-size: clamp(2rem, 4.4vw, 4rem);
          font-weight: 300;
          letter-spacing: -0.045em;
          line-height: 1.02;
        }
        .footer-cta-title strong {
          color: #0a4a42;
          font-weight: 700;
        }
        .footer-cta-btn {
          display: inline-flex;
          flex-shrink: 0;
          align-items: center;
          gap: 0.9rem;
          padding: 1rem 1.75rem 1rem 1rem;
          border-radius: 999px;
          background: #0a4a42;
          color: #fff;
          font-size: 1.05rem;
          font-weight: 700;
          white-space: nowrap;
          text-decoration: none;
          transition:
            background-color 0.2s ease,
            transform 0.2s ease;
        }
        .footer-cta-btn:hover {
          background: #1d7a6e;
          color: #fff;
          transform: translateY(-2px);
        }
        .footer-cta-btn:focus-visible {
          outline: 2px solid #1d7a6e;
          outline-offset: 3px;
        }
        .footer-cta-avatar {
          position: relative;
          display: grid;
          place-items: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #dfe5e7;
          color: #0a4a42;
          font-weight: 700;
        }
        .footer-cta-avatar i {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 12px;
          height: 12px;
          border: 2px solid #0a4a42;
          border-radius: 50%;
          background: #3fd08a;
        }

        /* Columns */
        .footer-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr 1fr 1.2fr;
          gap: 2.5rem 3rem;
          padding-top: clamp(2rem, 5vh, 2.75rem);
          border-top: 1px solid rgba(29, 122, 110, 0.12);
        }
        .brand-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .footer-logo-img {
          width: auto;
          height: 32px;
        }
        .footer-desc {
          max-width: 300px;
          margin: 0;
          color: #515856;
          font-size: 0.95rem;
          line-height: 1.6;
        }
        .footer-socials {
          display: flex;
          gap: 0.5rem;
        }
        .social-icon {
          display: flex;
          width: 38px;
          height: 38px;
          align-items: center;
          justify-content: center;
          border: 1px solid #e3ddd3;
          border-radius: 50%;
          color: #0a4a42;
          font-size: 0.72rem;
          font-weight: 700;
          text-decoration: none;
          transition:
            background-color 0.2s ease,
            color 0.2s ease;
        }
        .social-icon:hover {
          background: #0a4a42;
          color: #fff;
        }
        .footer-title {
          margin: 0 0 0.9rem;
          color: #101a18;
          font-size: 0.82rem;
          font-weight: 700;
        }
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin: 0;
          padding: 0;
          list-style: none;
          font-size: 0.95rem;
        }
        /* :global — next/link anchors don't get the styled-jsx scope class. */
        .footer-links :global(a) {
          color: #515856;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-links :global(a:hover) {
          color: #0a4a42;
        }

        .footer-bottom {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem 1.5rem;
          margin-top: clamp(2.5rem, 6vh, 4rem);
          color: #737a78;
          font-size: 0.82rem;
        }
        .footer-bottom p {
          margin: 0;
        }
        .bottom-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem 1.5rem;
        }
        .bottom-links :global(a) {
          color: #737a78;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .bottom-links :global(a:hover) {
          color: #0a4a42;
        }

        @media (max-width: 992px) {
          .footer-cta {
            flex-direction: column;
            align-items: flex-start;
          }
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 576px) {
          .footer-cta-btn {
            width: 100%;
            justify-content: center;
          }
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </footer>
  );
}
