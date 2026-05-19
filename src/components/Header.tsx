"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredSpecialties, getStoredDestinations, Specialty, Destination } from "@/lib/db";
import { useLanguage } from "@/context/LanguageContext";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setSpecialties(getStoredSpecialties());
    setDestinations(getStoredDestinations());

    const handleUpdate = () => {
      setSpecialties(getStoredSpecialties());
      setDestinations(getStoredDestinations());
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Hide on scroll down
        setIsOpen(false);   // Close mobile menu if open
      } else {
        setIsVisible(true);  // Show on scroll up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("bc_db_update", handleUpdate);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("bc_db_update", handleUpdate);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header className={`site-header-wrapper ${isVisible ? "" : "hidden"}`}>
      <div className="header-capsule">
        {/* Left Side: Isotipo Home link */}
        <Link href="/" className="logo-link" onClick={() => setIsOpen(false)}>
          <img src="/isotipo.svg" alt="Bridge Care Home" className="isotipo-img" />
        </Link>

        {/* Mobile menu toggle */}
        <button 
          className={`menu-toggle ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* Center: Navigation */}
        <nav className={`nav-menu ${isOpen ? "open" : ""}`}>
          <ul className="nav-list">
            <li className="nav-item-dropdown">
              <span className="nav-link dropdown-trigger">
                {t("nav.specialties")} <span className="arrow">▾</span>
              </span>
              <ul className="dropdown-menu glass-dropdown">
                {specialties.map((spec) => (
                  <li key={spec.id}>
                    <Link 
                      href={`/specialties/${spec.id}`} 
                      onClick={() => setIsOpen(false)}
                      className="dropdown-item"
                    >
                      {language === "es" ? spec.name : spec.nameEn}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li className="nav-item-dropdown">
              <span className="nav-link dropdown-trigger">
                {t("nav.destinations")} <span className="arrow">▾</span>
              </span>
              <ul className="dropdown-menu glass-dropdown">
                {destinations.map((dest) => (
                  <li key={dest.id}>
                    <Link 
                      href={`/destinations/${dest.id}`} 
                      onClick={() => setIsOpen(false)}
                      className="dropdown-item"
                    >
                      {dest.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li>
              <Link href="/nosotros" onClick={() => setIsOpen(false)} className="nav-link">
                {t("nav.about")}
              </Link>
            </li>

            <li>
              <Link href="/contacto" onClick={() => setIsOpen(false)} className="nav-link">
                {t("nav.contact")}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right Side: WhatsApp Link + CTA Book + Language Toggle at the far right */}
        <div className="header-actions">
          {/* WhatsApp click number */}
          <a 
            href={`https://wa.me/573001234567?text=${encodeURIComponent(
              language === "es" 
                ? "Hola, quiero agendar una cita con Bridge Care." 
                : "Hello, I want to book an appointment with Bridge Care."
            )}`}
            target="_blank" 
            rel="noopener noreferrer" 
            className="whatsapp-number-link"
          >
            <span className="wa-icon">💬</span>
            <span className="wa-number">+57 300 123 4567</span>
          </a>

          {/* CTA Book (High visibility Call To Action) */}
          <Link href="/contacto" className="btn-book">
            {t("nav.book")}
          </Link>

          {/* Language toggle at the far right */}
          <button 
            onClick={() => setLanguage(language === "es" ? "en" : "es")}
            className="lang-toggle-btn"
            title={language === "es" ? "Switch to English" : "Cambiar a Español"}
          >
            {language === "es" ? "EN" : "ES"}
          </button>
        </div>
      </div>
    </header>
  );
}
