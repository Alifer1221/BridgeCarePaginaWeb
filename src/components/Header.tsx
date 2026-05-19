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

      <style jsx>{`
        .site-header-wrapper {
          position: fixed;
          top: 1.5rem;
          left: 50%;
          transform: translate(-50%, 0);
          width: calc(100% - 2.5rem);
          max-width: 950px;
          z-index: 1000;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        }

        .site-header-wrapper.hidden {
          transform: translate(-50%, -160%);
          opacity: 0;
          pointer-events: none;
        }

        .header-capsule {
          background: rgba(3, 12, 10, 0.65);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(93, 202, 165, 0.12);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.4rem 1.25rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          transition: var(--transition-normal);
        }

        .header-capsule:hover {
          border-color: rgba(93, 202, 165, 0.25);
          box-shadow: 0 10px 40px rgba(93, 202, 165, 0.05);
        }

        .logo-link {
          display: flex;
          align-items: center;
          padding: 0.25rem;
          transition: var(--transition-fast);
        }

        .logo-link:hover {
          transform: scale(1.05);
        }

        .isotipo-img {
          height: 30px;
          width: auto;
        }

        .nav-menu {
          display: flex;
          align-items: center;
        }

        .nav-list {
          list-style: none;
          display: flex;
          gap: 1.5rem;
          margin: 0;
          padding: 0;
        }

        .nav-link {
          color: var(--blanco-hueso);
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          transition: var(--transition-fast);
          padding: 0.5rem 0.25rem;
          display: block;
        }

        .nav-link:hover {
          color: var(--mint-accent);
        }

        /* Dropdowns */
        .nav-item-dropdown {
          position: relative;
        }

        .dropdown-trigger {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .arrow {
          font-size: 0.7rem;
          transition: transform 0.2s ease;
        }

        .nav-item-dropdown:hover .arrow {
          transform: rotate(180deg);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translate(-50%, 15px);
          opacity: 0;
          visibility: hidden;
          list-style: none;
          padding: 0.75rem 0;
          margin: 0;
          min-width: 200px;
          border-radius: var(--radius-md);
          transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
          z-index: 10;
        }

        .nav-item-dropdown:hover .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translate(-50%, 5px);
        }

        .glass-dropdown {
          background: rgba(3, 12, 10, 0.95);
          border: 1px solid rgba(93, 202, 165, 0.15);
          backdrop-filter: blur(10px);
        }

        .dropdown-item {
          display: block;
          padding: 0.6rem 1.25rem;
          color: var(--blanco-hueso);
          font-size: 0.85rem;
          transition: var(--transition-fast);
        }

        .dropdown-item:hover {
          background-color: rgba(93, 202, 165, 0.08);
          color: var(--mint-accent);
          padding-left: 1.5rem;
        }

        /* Actions block */
        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .lang-toggle-btn {
          background: rgba(93, 202, 165, 0.08) !important;
          border: 1px solid rgba(93, 202, 165, 0.25) !important;
          color: var(--mint-accent) !important;
          font-size: 0.75rem !important;
          font-weight: 700 !important;
          padding: 0.35rem 0.7rem !important;
          border-radius: var(--radius-full) !important;
          cursor: pointer !important;
          transition: var(--transition-fast) !important;
        }

        .lang-toggle-btn:hover {
          background: rgba(93, 202, 165, 0.2) !important;
          border-color: var(--mint-accent) !important;
          transform: scale(1.05) !important;
        }

        .whatsapp-number-link {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--blanco-hueso);
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.35rem 0.65rem;
          border-radius: var(--radius-full);
          transition: var(--transition-fast);
        }

        .whatsapp-number-link:hover {
          color: var(--mint-accent);
          background: rgba(93, 202, 165, 0.05);
        }

        .wa-icon {
          font-size: 0.95rem;
        }

        .btn-book {
          background: linear-gradient(135deg, var(--teal-primary) 0%, var(--mint-accent) 100%) !important;
          color: var(--negro-suave) !important;
          font-size: 0.8rem !important;
          font-weight: 800 !important;
          padding: 0.5rem 1.3rem !important;
          border-radius: var(--radius-full) !important;
          box-shadow: 0 4px 15px rgba(93, 202, 165, 0.35) !important;
          transition: all 0.2s ease-in-out !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          display: inline-block !important;
          text-align: center !important;
          text-transform: uppercase !important;
          letter-spacing: 0.03em !important;
        }

        .btn-book:hover {
          transform: translateY(-2px) scale(1.03) !important;
          box-shadow: 0 6px 20px rgba(93, 202, 165, 0.6) !important;
          background: linear-gradient(135deg, #229989 0%, #7ee4c0 100%) !important;
        }

        .menu-toggle {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          z-index: 100;
        }

        .menu-toggle .bar {
          width: 20px;
          height: 2px;
          background-color: var(--white);
          transition: 0.3s ease;
          border-radius: 2px;
        }

        /* Mobile specific styling */
        @media (max-width: 992px) {
          .menu-toggle {
            display: flex;
          }

          .nav-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(3, 12, 10, 0.98);
            border: 1px solid rgba(93, 202, 165, 0.15);
            border-radius: var(--radius-lg);
            flex-direction: column;
            padding: 1.5rem;
            opacity: 0;
            visibility: hidden;
            transform: translateY(15px);
            transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.8);
          }

          .nav-menu.open {
            opacity: 1;
            visibility: visible;
            transform: translateY(10px);
          }

          .nav-list {
            flex-direction: column;
            width: 100%;
            gap: 1rem;
          }

          .dropdown-menu {
            position: static;
            transform: none !important;
            opacity: 1;
            visibility: visible;
            background: rgba(0, 0, 0, 0.2);
            border: none;
            box-shadow: none;
            padding-left: 1rem;
            margin-top: 0.5rem;
          }

          .nav-item-dropdown:hover .dropdown-menu {
            transform: none;
          }

          .header-actions {
            margin-left: auto;
            margin-right: 0.5rem;
          }

          .whatsapp-number-link .wa-number {
            display: none; /* Hide number on tablets/phones to preserve space */
          }
        }

        @media (max-width: 576px) {
          .site-header-wrapper {
            top: 1rem;
          }
          
          .header-capsule {
            padding: 0.4rem 0.75rem;
          }

          .header-actions {
            gap: 0.5rem;
          }

          .btn-book {
            padding: 0.4rem 0.85rem;
            font-size: 0.75rem;
          }

          .whatsapp-number-link {
            padding: 0.3rem;
          }
        }
      `}</style>
    </header>
  );
}
