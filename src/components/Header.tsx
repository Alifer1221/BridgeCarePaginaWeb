"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredSpecialties, getStoredDestinations, Specialty, Destination } from "@/lib/db";

export default function Header() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Load initial data
    setSpecialties(getStoredSpecialties());
    setDestinations(getStoredDestinations());

    const handleUpdate = () => {
      setSpecialties(getStoredSpecialties());
      setDestinations(getStoredDestinations());
    };

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("bc_db_update", handleUpdate);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("bc_db_update", handleUpdate);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="site-header-wrapper">
      <div className={`container header-capsule ${scrolled ? "scrolled" : ""}`}>
        <Link href="/" className="logo-link">
          <img src="/logo.svg" alt="Bridge Care" className="logo-img" />
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

        <nav className={`nav-menu ${isOpen ? "open" : ""}`}>
          <ul className="nav-list">
            <li>
              <Link href="/" onClick={() => setIsOpen(false)} className="nav-link">
                Inicio
              </Link>
            </li>
            
            <li className="nav-item-dropdown">
              <span className="nav-link dropdown-trigger">
                Especialidades <span className="arrow">▾</span>
              </span>
              <ul className="dropdown-menu glass-dropdown">
                {specialties.map((spec) => (
                  <li key={spec.id}>
                    <Link 
                      href={`/specialties/${spec.id}`} 
                      onClick={() => setIsOpen(false)}
                      className="dropdown-item"
                    >
                      {spec.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li className="nav-item-dropdown">
              <span className="nav-link dropdown-trigger">
                Destinos <span className="arrow">▾</span>
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

            <li className="nav-item-dropdown">
              <span className="nav-link dropdown-trigger">
                Nosotros <span className="arrow">▾</span>
              </span>
              <ul className="dropdown-menu glass-dropdown">
                <li>
                  <Link href="/nosotros#quienes-somos" onClick={() => setIsOpen(false)} className="dropdown-item">
                    Quiénes somos
                  </Link>
                </li>
                <li>
                  <Link href="/nosotros#red-medica" onClick={() => setIsOpen(false)} className="dropdown-item">
                    Red de médicos y clínicas
                  </Link>
                </li>
                <li>
                  <Link href="/nosotros#paquetes" onClick={() => setIsOpen(false)} className="dropdown-item">
                    Paquetes todo incluido
                  </Link>
                </li>
                <li>
                  <Link href="/nosotros#garantias" onClick={() => setIsOpen(false)} className="dropdown-item">
                    Seguridad y garantías
                  </Link>
                </li>
                <li>
                  <Link href="/nosotros#blog-faq" onClick={() => setIsOpen(false)} className="dropdown-item">
                    Blog / FAQ
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link href="/admin" onClick={() => setIsOpen(false)} className="nav-link admin-link">
                Panel Admin
              </Link>
            </li>

            <li className="mobile-cta-item">
              <Link href="/contacto" onClick={() => setIsOpen(false)} className="btn btn-accent header-btn-pill">
                Consulta Gratis
              </Link>
            </li>
          </ul>
        </nav>

        {/* Desktop CTA Button */}
        <div className="desktop-cta">
          <Link href="/contacto" className="btn btn-accent header-btn-pill">
            Consulta Gratis
          </Link>
        </div>
      </div>

      <style jsx>{`
        .site-header-wrapper {
          position: fixed;
          top: 1.5rem;
          left: 0;
          width: 100%;
          z-index: 1000;
          display: flex;
          justify-content: center;
          padding: 0 1.5rem;
          pointer-events: none;
        }

        .header-capsule {
          width: 100%;
          max-width: 1100px;
          height: 70px;
          background: rgba(3, 12, 10, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(93, 202, 165, 0.15);
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1rem 0 2rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
          pointer-events: auto;
          transition: var(--transition);
        }

        /* Scrolled state for even tighter fit */
        .header-capsule.scrolled {
          height: 64px;
          background: rgba(3, 8, 6, 0.9);
          border-color: rgba(93, 202, 165, 0.25);
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.55), 0 0 20px rgba(93, 202, 165, 0.05);
        }

        .logo-link {
          display: flex;
          align-items: center;
        }
        .logo-img {
          height: 38px;
          width: auto;
          transition: var(--transition);
        }
        .header-capsule.scrolled .logo-img {
          height: 34px;
        }

        .nav-list {
          display: flex;
          align-items: center;
          list-style: none;
          gap: 1.75rem;
        }
        
        .nav-link {
          color: rgba(245, 245, 245, 0.8);
          font-weight: 500;
          font-size: 0.95rem;
          padding: 0.5rem 0.25rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          cursor: pointer;
          letter-spacing: 0.01em;
        }
        .nav-link:hover, .nav-link:focus {
          color: var(--mint-accent);
        }

        .admin-link {
          color: rgba(93, 202, 165, 0.7);
        }
        .admin-link:hover {
          color: var(--mint-accent);
        }

        .nav-item-dropdown {
          position: relative;
        }
        .arrow {
          font-size: 0.75rem;
          transition: var(--transition);
        }

        .glass-dropdown {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(15px);
          background: rgba(3, 12, 10, 0.95);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(93, 202, 165, 0.2);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          list-style: none;
          min-width: 240px;
          padding: 0.75rem 0;
          display: none;
          flex-direction: column;
          z-index: 1100;
        }

        .dropdown-item {
          color: rgba(245, 245, 245, 0.8);
          padding: 0.65rem 1.5rem;
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .dropdown-item:hover {
          background-color: rgba(93, 202, 165, 0.1);
          color: var(--mint-accent);
          padding-left: 1.75rem;
        }

        /* Hover Dropdown Triggers */
        .nav-item-dropdown:hover .glass-dropdown {
          display: flex;
          animation: slideUpDropdown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .nav-item-dropdown:hover .arrow {
          transform: rotate(180deg);
          color: var(--mint-accent);
        }

        /* Glowing Pill button */
        .header-btn-pill {
          padding: 0.65rem 1.5rem;
          font-size: 0.9rem;
          font-weight: 700;
          border-radius: var(--radius-full);
          letter-spacing: 0.02em;
        }

        .mobile-cta-item {
          display: none;
        }

        /* Animations */
        @keyframes slideUpDropdown {
          from { opacity: 0; transform: translateX(-50%) translateY(15px); }
          to { opacity: 1; transform: translateX(-50%) translateY(5px); }
        }

        /* Mobile styling */
        .menu-toggle {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 28px;
          height: 18px;
          background: transparent;
          border: none;
          cursor: pointer;
          z-index: 2000;
          margin-right: 0.5rem;
        }
        .menu-toggle .bar {
          width: 100%;
          height: 2px;
          background-color: var(--blanco-hueso);
          border-radius: 2px;
          transition: var(--transition);
        }

        @media (max-width: 992px) {
          .menu-toggle {
            display: flex;
          }
          .menu-toggle.active .bar:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
          }
          .menu-toggle.active .bar:nth-child(2) {
            opacity: 0;
          }
          .menu-toggle.active .bar:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
          }
          .desktop-cta {
            display: none;
          }
          .nav-menu {
            position: fixed;
            top: -20px;
            right: -100%;
            width: 85%;
            max-width: 320px;
            height: 100vh;
            background: rgba(3, 12, 10, 0.98);
            backdrop-filter: blur(24px);
            border-left: 1px solid rgba(93, 202, 165, 0.2);
            padding: 100px 2rem 2rem;
            transition: var(--transition);
            z-index: 1500;
            overflow-y: auto;
            border-radius: var(--radius-lg) 0 0 var(--radius-lg);
            box-shadow: -10px 0 40px rgba(0,0,0,0.5);
          }
          .nav-menu.open {
            right: 0;
          }
          .nav-list {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.5rem;
            width: 100%;
          }
          .nav-item-dropdown {
            width: 100%;
          }
          .glass-dropdown {
            position: static;
            display: flex;
            box-shadow: none;
            border: none;
            padding: 0.5rem 0 0 1rem;
            background-color: rgba(93, 202, 165, 0.05);
            min-width: 100%;
            transform: none;
            margin-top: 0.5rem;
          }
          .nav-link {
            width: 100%;
            justify-content: space-between;
          }
          .mobile-cta-item {
            display: block;
            width: 100%;
            margin-top: 1.5rem;
          }
          .mobile-cta-item .btn {
            width: 100%;
          }
        }
      `}</style>
    </header>
  );
}
