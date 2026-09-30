"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSpecialties, useDestinations } from "@/lib/useStoredData";
import { useLanguage } from "@/context/LanguageContext";

/* Desktop mega menu, design board M2: every specialty with its photo, price
   and procedures in view, and the destinations with theirs. Phones keep the
   accordion below. */
const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=75&w=900`;
const SPECIALTY_PHOTO: Record<string, string> = {
  "cirugia-estetica": img("1519823551278-64ac92734fb1"),
  odontologia: img("1654373535457-383a0a4d00f9"),
  bariatria: img("1594882645126-14020914d58d"),
  estetica: img("1570172619644-dfd03ed5d881"),
};
const CITY: Record<string, { es: string; en: string; t: string; photo: string }> = {
  medellin: { es: "La eterna primavera", en: "The city of eternal spring", t: "22 °C", photo: img("1512250431446-d0b4b57b27ec") },
  bogota: { es: "La capital, entre montañas", en: "The capital, among mountains", t: "14 °C", photo: img("1681145553138-816eb004b846") },
  cali: { es: "La capital de la salsa", en: "The salsa capital", t: "24 °C", photo: img("1728588519059-a62e06050425") },
  cartagena: { es: "La ciudad amurallada, junto al mar", en: "The walled city by the sea", t: "28 °C", photo: img("1534943441045-1009d7cb0bb9") },
};

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  // Hydration-safe reads: the server and the hydration pass both see the
  // defaults, then the stored copy takes over. (See lib/useStoredData.)
  const specialties = useSpecialties();
  const destinations = useDestinations();
  const [isOpen, setIsOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<"specialties" | "destinations" | null>(null);
  // Which desktop mega menu is open.
  const [mega, setMega] = useState<"specialties" | "destinations" | null>(null);
  const es = language === "es";
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  // Over a full-screen dark photo (a section marked data-header-dark, like the
  // destination hero) the bar turns clear with white type, the way Apple and
  // Tesla headers sit on their films; it frosts again once past that section.
  const [onDark, setOnDark] = useState(false);
  const pathname = usePathname();
  // Scroll bookkeeping lives in refs (not state) so the listener is attached
  // once and never re-subscribed on every scroll event.
  const lastScrollY = useRef(0);
  const upwardTravel = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    // Thresholds: a 1px "up" tick from trackpad jitter, smooth-scroll easing or
    // content shifting height used to re-show the header on its own. Now it
    // only comes back after a deliberate upward scroll, and only hides after
    // a real downward one.
    const SHOW_AFTER_UP_PX = 24;
    const HIDE_AFTER_DOWN_PX = 2;

    const checkDark = () => {
      // Any dark section currently sitting under the bar (the hero, or a
      // full-screen section further down the page).
      const under = Array.from(document.querySelectorAll("[data-header-dark]")).some((el) => {
        const r = el.getBoundingClientRect();
        return r.top < 90 && r.bottom > 90;
      });
      setOnDark(under);
    };

    const handleScroll = () => {
      checkDark();
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      lastScrollY.current = y;

      setIsScrolled(y > 20);

      if (y <= 100) {
        setIsVisible(true); // Always visible near the top of the page
        upwardTravel.current = 0;
        return;
      }

      if (delta > HIDE_AFTER_DOWN_PX) {
        upwardTravel.current = 0;
        setIsVisible(false); // Hide on scroll down
        setIsOpen(false);    // Close mobile menu if open
      } else if (delta < 0) {
        upwardTravel.current += -delta;
        if (upwardTravel.current >= SHOW_AFTER_UP_PX) {
          setIsVisible(true); // Show only after a deliberate scroll up
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // The page's own sections mount after the header; check again shortly.
    checkDark();
    const t = window.setTimeout(checkDark, 60);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.clearTimeout(t);
    };
  }, [pathname]);

  // The mega menu closes on navigation and with Escape.
  useEffect(() => {
    setMega(null);
  }, [pathname]);
  useEffect(() => {
    if (!mega) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMega(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mega]);
  const closeAll = () => {
    setIsOpen(false);
    setMega(null);
  };
  const toggle = (which: "specialties" | "destinations") => {
    setOpenMobileDropdown(openMobileDropdown === which ? null : which);
    setMega(mega === which ? null : which);
  };

  return (
    <header
      className={`site-header-wrapper ${isVisible ? "" : "hidden"} ${isScrolled ? "scrolled" : ""} ${onDark && !isOpen && !mega ? "on-dark" : ""} ${mega ? "mega-open" : ""}`}
      onMouseLeave={() => setMega(null)}
    >
      <div className="header-capsule">
        {/* Left Side: Logo Home link */}
        <Link href="/" className="logo-link" onClick={() => setIsOpen(false)}>
          <img
            src="/logo.svg"
            alt="Bridge Care Home"
            className="logo-img"
            width={93}
            height={44}
          />
        </Link>

        {/* Center: Navigation */}
        <nav className={`nav-menu ${isOpen ? "open" : ""}`}>
          <ul className="nav-list">
            <li
              className="nav-item-dropdown"
              onKeyDown={(e) => {
                if (e.key === "Escape") setOpenMobileDropdown(null);
              }}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpenMobileDropdown(null);
              }}
            >
              <button
                type="button"
                className="nav-link dropdown-trigger"
                aria-expanded={openMobileDropdown === "specialties" || mega === "specialties"}
                aria-controls="nav-dropdown-specialties"
                onMouseEnter={() => setMega("specialties")}
                onClick={() => toggle("specialties")}
              >
                {t("nav.specialties")}
                <svg
                  className={`mobile-chevron ${openMobileDropdown === "specialties" ? "open" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width={14}
                  height={14}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <ul
                id="nav-dropdown-specialties"
                className={`dropdown-menu glass-dropdown ${openMobileDropdown === "specialties" ? "mobile-open" : ""}`}
              >
                {specialties.map((spec) => {
                  // Procedures with their own page get a flyout submenu.
                  const subPages = (spec.procedureDetails || []).filter((p) => p.slug);
                  return (
                    <li key={spec.id} className={subPages.length > 0 ? "dropdown-has-sub" : undefined}>
                      <Link
                        href={`/specialties/${spec.id}`}
                        onClick={() => setIsOpen(false)}
                        className="dropdown-item"
                      >
                        {language === "es" ? spec.name : spec.nameEn}
                        {subPages.length > 0 && (
                          <svg className="dropdown-sub-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="9 6 15 12 9 18"></polyline>
                          </svg>
                        )}
                      </Link>
                      {subPages.length > 0 && (
                        <ul className="dropdown-sub glass-dropdown">
                          {subPages.map((p) => (
                            <li key={p.slug}>
                              <Link
                                href={`/specialties/${spec.id}/${p.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="dropdown-item"
                              >
                                {language === "es" ? p.name : p.nameEn}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>

            <li className="nav-separator">•</li>

            <li
              className="nav-item-dropdown"
              onKeyDown={(e) => {
                if (e.key === "Escape") setOpenMobileDropdown(null);
              }}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpenMobileDropdown(null);
              }}
            >
              <button
                type="button"
                className="nav-link dropdown-trigger"
                aria-expanded={openMobileDropdown === "destinations" || mega === "destinations"}
                aria-controls="nav-dropdown-destinations"
                onMouseEnter={() => setMega("destinations")}
                onClick={() => toggle("destinations")}
              >
                {t("nav.destinations")}
                <svg
                  className={`mobile-chevron ${openMobileDropdown === "destinations" ? "open" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width={14}
                  height={14}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <ul
                id="nav-dropdown-destinations"
                className={`dropdown-menu glass-dropdown ${openMobileDropdown === "destinations" ? "mobile-open" : ""}`}
              >
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
              <Link href="/blog" onClick={closeAll} onMouseEnter={() => setMega(null)} className="nav-link">
                {t("nav.blog")}
              </Link>
            </li>

            <li className="nav-separator">•</li>

            <li>
              <Link href="/nosotros" onClick={closeAll} onMouseEnter={() => setMega(null)} className="nav-link">
                {t("nav.about")}
              </Link>
            </li>

            <li className="nav-separator">•</li>

            <li>
              <Link href="/contacto" onClick={closeAll} onMouseEnter={() => setMega(null)} className="nav-link">
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
            aria-label={language === "es" ? "Switch to English" : "Cambiar a Español"}
            title={language === "es" ? "English" : "Español"}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              width={20}
              height={20}
            >
              <circle cx="12" cy="12" r="9"></circle>
              <path d="M3 12h18M12 3a14.5 14.5 0 0 1 0 18M12 3a14.5 14.5 0 0 0 0 18"></path>
            </svg>
          </button>

          {/* CTA Book (High visibility Call To Action) */}
          <Link href="/contacto" className="btn-book">
            <span className="btn-book-text">{language === "es" ? "Agendar" : "Book"}</span>
            <div className="btn-book-arrow-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="btn-book-arrow" width={12} height={12}>
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className={`menu-toggle ${isOpen ? "active" : ""}`}
            onClick={() => {
              setIsOpen(!isOpen);
              setOpenMobileDropdown(null);
            }}
            aria-label="Toggle menu"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </div>

      {/* Desktop mega menu (board M2); hidden on phones by CSS. */}
      {mega && (
        <>
          <div className="mega-dim" onMouseEnter={() => setMega(null)} onClick={() => setMega(null)} aria-hidden="true" />
          {mega === "specialties" ? (
            <div className="mega" role="region" aria-label={t("nav.specialties")}>
              <div className="mega-grid">
                {specialties.map((spec) => {
                  const subPages = (spec.procedureDetails || []).filter((p) => p.slug);
                  const price = spec.priceFrom?.match(/^\$[\d,.]+/)?.[0];
                  return (
                    <div key={spec.id} className="mega-spec">
                      <Link href={`/specialties/${spec.id}`} onClick={closeAll} className="mega-card">
                        <span
                          className="mega-ph"
                          style={{ backgroundImage: `url(${SPECIALTY_PHOTO[spec.id] || spec.image})` }}
                          aria-hidden="true"
                        />
                        <span className="mega-shade" aria-hidden="true" />
                        <span className="mega-card-text">
                          <strong>{es ? spec.name : spec.nameEn}</strong>
                          {price && <small>{es ? `desde ${price} USD` : `from ${price} USD`}</small>}
                        </span>
                      </Link>
                      <ul className="mega-procs">
                        {subPages.map((p) => (
                          <li key={p.slug}>
                            <Link href={`/specialties/${spec.id}/${p.slug}`} onClick={closeAll}>
                              {es ? p.name : p.nameEn}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
                <div className="mega-side">
                  <span className="mega-label">{t("nav.destinations")}</span>
                  {destinations.map((d) => (
                    <Link key={d.id} href={`/destinations/${d.id}`} onClick={closeAll} className="mega-city-row">
                      <span
                        className="mega-city-thumb"
                        style={{ backgroundImage: `url(${CITY[d.id]?.photo || d.image})` }}
                        aria-hidden="true"
                      />
                      <span className="mega-city-name">
                        {d.name}
                        {CITY[d.id] && <small>{CITY[d.id].t}</small>}
                      </span>
                    </Link>
                  ))}
                  <Link href="/contacto" onClick={closeAll} className="mega-cta">
                    {es ? "Cotiza tu viaje" : "Get a quote"}
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="mega" role="region" aria-label={t("nav.destinations")}>
              <div className="mega-cities">
                {destinations.map((d) => (
                  <Link key={d.id} href={`/destinations/${d.id}`} onClick={closeAll} className="mega-city">
                    <span
                      className="mega-ph"
                      style={{ backgroundImage: `url(${CITY[d.id]?.photo || d.image})` }}
                      aria-hidden="true"
                    />
                    <span className="mega-shade" aria-hidden="true" />
                    {CITY[d.id] && <span className="mega-temp">{CITY[d.id].t}</span>}
                    <span className="mega-card-text">
                      <strong>{d.name}</strong>
                      {CITY[d.id] && <small>{es ? CITY[d.id].es : CITY[d.id].en}</small>}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </header>
  );
}
