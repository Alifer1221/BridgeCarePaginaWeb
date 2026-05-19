"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getStoredSpecialties, getStoredDestinations, Specialty, Destination } from "@/lib/db";

export default function Header() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load initial data
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
    <header className="site-header">
      <div className="container header-container">
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
              <ul className="dropdown-menu">
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
              <ul className="dropdown-menu">
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
              <ul className="dropdown-menu">
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
              <Link href="/contacto" onClick={() => setIsOpen(false)} className="nav-link">
                Contacto
              </Link>
            </li>

            <li>
              <Link href="/admin" onClick={() => setIsOpen(false)} className="btn btn-accent admin-btn">
                Portal Admin
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <style jsx>{`
        .site-header {
          background-color: var(--verde-noche);
          border-bottom: 1px solid rgba(93, 202, 165, 0.15);
          position: sticky;
          top: 0;
          z-index: 1000;
          backdrop-filter: blur(8px);
        }
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
        }
        .logo-link {
          display: flex;
          align-items: center;
        }
        .logo-img {
          height: 48px;
          width: auto;
        }
        .nav-list {
          display: flex;
          align-items: center;
          list-style: none;
          gap: 1.5rem;
        }
        .nav-link {
          color: rgba(245, 245, 245, 0.9);
          font-weight: 500;
          font-size: 0.95rem;
          padding: 0.5rem 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          cursor: pointer;
        }
        .nav-link:hover, .nav-link:focus {
          color: var(--mint-accent);
        }
        .nav-item-dropdown {
          position: relative;
        }
        .arrow {
          font-size: 0.75rem;
          transition: var(--transition);
        }
        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background-color: var(--verde-noche);
          border: 1px solid rgba(93, 202, 165, 0.15);
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
          padding: 0.6rem 1.25rem;
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .dropdown-item:hover {
          background-color: rgba(29, 122, 110, 0.2);
          color: var(--mint-accent);
          padding-left: 1.5rem;
        }
        /* Hover triggers dropdown */
        .nav-item-dropdown:hover .dropdown-menu {
          display: flex;
          animation: slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .nav-item-dropdown:hover .arrow {
          transform: rotate(180deg);
          color: var(--mint-accent);
        }
        .admin-btn {
          font-size: 0.85rem;
          padding: 0.5rem 1rem;
        }
        
        /* Mobile styling */
        .menu-toggle {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 30px;
          height: 21px;
          background: transparent;
          border: none;
          cursor: pointer;
          z-index: 2000;
        }
        .menu-toggle .bar {
          width: 100%;
          height: 3px;
          background-color: var(--blanco-hueso);
          border-radius: 2px;
          transition: var(--transition);
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 992px) {
          .menu-toggle {
            display: flex;
          }
          .menu-toggle.active .bar:nth-child(1) {
            transform: translateY(9px) rotate(45deg);
          }
          .menu-toggle.active .bar:nth-child(2) {
            opacity: 0;
          }
          .menu-toggle.active .bar:nth-child(3) {
            transform: translateY(-9px) rotate(-45deg);
          }
          .nav-menu {
            position: fixed;
            top: 0;
            right: -100%;
            width: 80%;
            max-width: 320px;
            height: 100vh;
            background-color: var(--verde-noche);
            border-left: 1px solid rgba(93, 202, 165, 0.15);
            padding: 100px 2rem 2rem;
            transition: var(--transition);
            z-index: 1500;
            overflow-y: auto;
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
          .dropdown-menu {
            position: static;
            display: flex;
            box-shadow: none;
            border: none;
            padding: 0.5rem 0 0 1rem;
            background-color: rgba(10, 74, 66, 0.1);
            min-width: 100%;
          }
          .nav-link {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </header>
  );
}
