"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredSpecialties, getStoredDestinations, Specialty, Destination } from "@/lib/db";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { language, t } = useLanguage();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    setSpecialties(getStoredSpecialties());
    setDestinations(getStoredDestinations());

    const handleUpdate = () => {
      setSpecialties(getStoredSpecialties());
      setDestinations(getStoredDestinations());
    };

    window.addEventListener("bc_db_update", handleUpdate);
    return () => window.removeEventListener("bc_db_update", handleUpdate);
  }, []);

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        {/* Brand Info */}
        <div className="footer-col brand-col">
          <Link href="/" className="footer-logo">
            <img src="/isotipo.svg" alt="Bridge Care" className="footer-logo-img" />
          </Link>
          <p className="footer-desc">
            {t("footer.desc")}
          </p>
          <div className="footer-socials">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">FB</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">IG</a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon">YT</a>
          </div>
        </div>

        {/* Specialties */}
        <div className="footer-col">
          <h4 className="footer-title">{t("nav.specialties")}</h4>
          <ul className="footer-links">
            {specialties.map((spec) => (
              <li key={spec.id}>
                <Link href={`/specialties/${spec.id}`}>
                  {language === "es" ? spec.name : spec.nameEn}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Destinations */}
        <div className="footer-col">
          <h4 className="footer-title">{t("nav.destinations")}</h4>
          <ul className="footer-links">
            {destinations.map((dest) => (
              <li key={dest.id}>
                <Link href={`/destinations/${dest.id}`}>
                  {dest.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-col">
          <h4 className="footer-title">{t("footer.contact")}</h4>
          <ul className="footer-contact">
            <li>
              <span className="contact-label">{t("footer.support")}</span>
              <a href="mailto:info@bridgecare.co">info@bridgecare.co</a>
            </li>
            <li>
              <span className="contact-label">{t("footer.whatsapp")}</span>
              <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer" className="wa-link">+57 (300) 123-4567</a>
            </li>
            <li>
              <span className="contact-label">{t("footer.location")}</span>
              <span>{t("footer.location.val")}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container bottom-container">
          <p>&copy; {new Date().getFullYear()} Bridge Care. {t("footer.rights")}</p>
          <div className="bottom-links">
            <Link href="/nosotros#garantias">{t("footer.guarantees")}</Link>
            <Link href="/contacto">{t("nav.book")}</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .site-footer {
          background-color: #020604;
          color: rgba(245, 245, 245, 0.7);
          padding: 6rem 0 2.5rem 0;
          border-top: 1px solid rgba(93, 202, 165, 0.12);
          position: relative;
          z-index: 10;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 3rem;
          margin-bottom: 4rem;
        }
        .brand-col {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .footer-logo-img {
          height: 42px;
          width: auto;
        }
        .footer-desc {
          color: var(--gris-texto);
          font-size: 0.9rem;
          line-height: 1.6;
        }
        .footer-socials {
          display: flex;
          gap: 0.75rem;
        }
        .social-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          background-color: rgba(93, 202, 165, 0.05);
          color: var(--mint-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          border: 1px solid rgba(93, 202, 165, 0.15);
          transition: var(--transition-fast);
        }
        .social-icon:hover {
          background: linear-gradient(135deg, var(--teal-primary) 0%, var(--mint-accent) 100%);
          color: var(--negro-suave);
          border-color: transparent;
          transform: translateY(-2px);
        }
        .footer-title {
          color: var(--white);
          font-size: 1.15rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          position: relative;
          padding-bottom: 0.5rem;
        }
        .footer-title::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 30px;
          height: 2px;
          background: linear-gradient(90deg, var(--teal-primary), var(--mint-accent));
        }
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .footer-links a {
          color: var(--gris-texto);
          font-size: 0.9rem;
          transition: var(--transition-fast);
        }
        .footer-links a:hover {
          color: var(--mint-accent);
          padding-left: 0.25rem;
        }
        .footer-contact {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          font-size: 0.9rem;
        }
        .contact-label {
          display: block;
          color: var(--white);
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        .footer-contact a {
          color: var(--gris-texto);
        }
        .wa-link {
          color: var(--mint-accent) !important;
          font-weight: 600;
        }
        .footer-contact a:hover {
          color: var(--mint-accent);
          text-decoration: underline;
        }
        .footer-bottom {
          padding-top: 2rem;
          border-top: 1px solid rgba(93, 202, 165, 0.12);
          font-size: 0.85rem;
          color: rgba(163, 184, 180, 0.6);
        }
        .bottom-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .bottom-links {
          display: flex;
          gap: 1.5rem;
        }
        .bottom-links a {
          color: rgba(163, 184, 180, 0.5);
          transition: var(--transition-fast);
        }
        .bottom-links a:hover {
          color: var(--mint-accent);
        }
        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 576px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .bottom-container {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
