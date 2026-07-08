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
  const [isScrolled, setIsScrolled] = useState(false);
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
      
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

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
    <header className={`site-header-wrapper ${isVisible ? "" : "hidden"} ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-capsule">
        {/* Left Side: Logo Home link */}
        <Link href="/" className="logo-link" onClick={() => setIsOpen(false)}>
          <img src="/logo.svg" alt="Bridge Care Home" className="logo-img" />
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
                {t("nav.specialties")}
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

            <li className="nav-separator">•</li>

            <li className="nav-item-dropdown">
              <span className="nav-link dropdown-trigger">
                {t("nav.destinations")}
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

            <li className="nav-separator">•</li>

            <li>
              <Link href="/nosotros" onClick={() => setIsOpen(false)} className="nav-link">
                {t("nav.about")}
              </Link>
            </li>

            <li className="nav-separator">•</li>

            <li>
              <Link href="/contacto" onClick={() => setIsOpen(false)} className="nav-link">
                {t("nav.contact")}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right Side: CTA Book */}
        <div className="header-actions">
          <button 
            className="lang-toggle-btn"
            onClick={() => setLanguage(language === "es" ? "en" : "es")}
            aria-label="Toggle language"
          >
            {language === "es" ? "EN" : "ES"}
          </button>
          {/* CTA Book (High visibility Call To Action) */}
          <Link href="/contacto" className="btn-book">
            <span className="btn-book-text">{t("nav.book")}</span>
            <div className="btn-book-arrow-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-book-arrow">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
