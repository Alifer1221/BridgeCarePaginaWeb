"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "es" | "en";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  es: {
    // Header & Footer
    "nav.specialties": "Especialidades",
    "nav.destinations": "Destinos",
    "nav.about": "Nosotros",
    "nav.contact": "Contacto",
    "nav.book": "Agendar Cita",
    "footer.desc": "Tu puente de confianza hacia servicios médicos y odontológicos de primer nivel en Colombia. Cuidado experto, calidez humana y ahorros excepcionales.",
    "footer.rights": "Todos los derechos reservados.",
    "footer.guarantees": "Seguridad y Garantías",
    "footer.contact": "Contacto",
    "footer.support": "Soporte y Consultas:",
    "footer.whatsapp": "WhatsApp Internacional:",
    "footer.location": "Ubicación Central:",
    "footer.location.val": "El Poblado, Medellín, Colombia",
    
    // Home Page
    "hero.tagline": "CONECTAMOS PACIENTES CON LAS MEJORES CLÍNICAS Y ESPECIALISTAS MÉDICOS DE COLOMBIA",
    "hero.title.part1": "UNA SOLA AGENCIA. ",
    "hero.title.part2": "Todo lo que Necesitas para tu Tratamiento en Colombia.",
    "hero.subtitle": "Especialistas certificados, logística completa y acompañamiento personalizado en cada paso. Bridge Care es el puente entre tú y la mejor atención médica.",
    "hero.cta.primary": "Quiero Saber Más",
    "hero.cta.secondary": "Ver Paquetes",
    "hero.stats.clinics.num": "50+",
    "hero.stats.clinics.lbl": "Clínicas Asociadas",
    "hero.stats.patients.num": "10k+",
    "hero.stats.patients.lbl": "Pacientes Atendidos",
    "hero.stats.satisfaction.num": "98%",
    "hero.stats.satisfaction.lbl": "Satisfacción",
    "hero.discover": "DESCUBRE MÁS",
    "why.title": "Por Qué Colombia",
    "why.subtitle": "Líder mundial en medicina de alta calidad, tecnología de punta y calidez humana.",
    
    "why.card1.title": "Acreditación Internacional",
    "why.card1.desc": "Nuestras clínicas aliadas cumplen con estándares rigurosos y certificaciones internacionales Joint Commission.",
    "why.card2.title": "Especialistas Certificados",
    "why.card2.desc": "Cirujanos y odontólogos miembros de sociedades científicas nacionales e internacionales de gran prestigio.",
    "why.card3.title": "Hasta 70% de Ahorro",
    "why.card3.desc": "Costos de tratamientos altamente competitivos debido a la diferencia en el costo de vida y tasa cambiaria.",
    "why.card4.title": "Destinos y Recuperación",
    "why.card4.desc": "Recupérate en climas templados o en el hermoso Caribe, con acompañamiento bilingüe las 24 horas.",
    
    "spec.title": "Especialidades Médicas",
    "spec.subtitle": "Explora nuestro catálogo de tratamientos de alta gama y empieza a planificar tu cambio.",
    "spec.viewDetail": "Ver detalle y cotizar",
    "spec.costCol": "Costo promedio Col",
    "spec.costUS": "EE. UU.",
    "spec.savings": "Ahorro aprox.",
    
    "how.title": "Cómo Funciona",
    "how.subtitle": "Tu viaje de salud coordinado de principio a fin sin preocupaciones.",
    "how.step1.title": "1. Valoración Virtual",
    "how.step1.desc": "Consultas iniciales gratuitas con cirujanos de primer nivel para evaluar tu caso y objetivos.",
    "how.step2.title": "2. Logística y Plan",
    "how.step2.desc": "Coordinamos hospedaje premium, traslados bilingües y citas prequirúrgicas.",
    "how.step3.title": "3. Tu Tratamiento",
    "how.step3.desc": "Intervenciones realizadas en clínicas acreditadas con tecnología médica de punta.",
    "how.step4.title": "4. Recuperación Guiada",
    "how.step4.desc": "Seguimiento médico postoperatorio personalizado e inmediato antes de tu viaje de retorno.",

    "test.title": "Testimonios que Inspiran",
    "test.subtitle": "Lo que dicen nuestros pacientes internacionales sobre su experiencia Bridge Care.",
    
    // Contact Page
    "contact.title": "Comienza Tu Viaje de Salud",
    "contact.subtitle": "Completa el formulario para recibir una valoración virtual gratuita y presupuesto personalizado.",
    "contact.name": "Nombre Completo",
    "contact.email": "Correo Electrónico",
    "contact.phone": "WhatsApp (Con código de país)",
    "contact.spec": "Especialidad de Interés",
    "contact.spec.placeholder": "Selecciona una opción",
    "contact.city": "Destino Preferido",
    "contact.city.placeholder": "Selecciona una opción (opcional)",
    "contact.msg": "Conténtanos sobre tus objetivos o dudas médicas",
    "contact.submit": "Solicitar Valoración Gratis",
    "contact.or": "O contáctanos directamente:",
    "contact.directCall": "Llamar / Escribir por WhatsApp",
    "contact.success": "¡Formulario enviado con éxito! Un asesor se contactará contigo en menos de 24 horas por correo o WhatsApp.",

    // Nosotros Page
    "about.title": "Sobre Bridge Care",
    "about.subtitle": "Nuestra misión es hacer accesible la medicina de primer nivel en Colombia de forma segura y transparente.",
    "about.tab.who": "Quiénes Somos",
    "about.tab.network": "Red Médica",
    "about.tab.packages": "Paquetes VIP",
    "about.tab.guarantees": "Garantías",
    "about.tab.blog": "Blog & FAQ",
    
    "about.who.title": "Haciendo fácil el cuidado de la salud internacional",
    "about.who.p1": "Bridge Care nació con la visión de simplificar y democratizar el acceso a tratamientos médicos y estéticos de calidad mundial. Entendemos que viajar por motivos de salud es una decisión importante, por eso nos convertimos en tu aliado local en Colombia de principio a fin.",
    "about.who.p2": "Gestionamos toda la cadena de valor: selección del especialista óptimo, programación de exámenes, estadías en hoteles asociados aptos para recuperación, transporte privado bilingüe y monitoreo médico postquirúrgico continuo.",
    
    "about.network.title": "Solo Especialistas y Clínicas Top",
    "about.network.p1": "No arriesgamos tu salud. Nuestra red de especialistas está compuesta únicamente por profesionales certificados con trayectoria nacional e internacional contrastable.",
    "about.network.li1": "Cirujanos plásticos adscritos a la SCCP (Sociedad Colombiana de Cirugía Plástica).",
    "about.network.li2": "Odontólogos y rehabilitadores de la Federación Odontológica Colombiana.",
    "about.network.li3": "Clínicas de alta complejidad con Unidades de Cuidados Intensivos (UCI) e infraestructura de última generación.",
    
    "about.packages.title": "Paquetes Todo Incluido: Recuperación sin Preocupaciones",
    "about.packages.p1": "Nuestros planes están diseñados para que tú te enfoques únicamente en descansar y sanar. Nos encargamos de todo.",
    "about.packages.li1": "Alojamiento en hoteles asociados boutique con alimentación balanceada adaptada.",
    "about.packages.li2": "Traslados privados Aeropuerto - Hotel - Clínica - Aeropuerto.",
    "about.packages.li3": "Enfermera de recuperación bilingüe para tus primeras 24-48 horas postoperatorias.",
    "about.packages.li4": "Coordinación de masajes postquirúrgicos y medicamentos formulados.",

    "about.guarantees.title": "Seguridad Total y Cobertura de Complicaciones",
    "about.guarantees.p1": "Somos la única agencia que exige e incluye pólizas específicas de complicaciones para pacientes internacionales en todos nuestros procedimientos mayores.",
    "about.guarantees.li1": "Póliza internacional de complicaciones médicas quirúrgicas hasta por $15,000 USD.",
    "about.guarantees.li2": "Tratamientos en clínicas JCI (Joint Commission International) o acreditadas nacionales.",
    "about.guarantees.li3": "Consultas ilimitadas de seguimiento con tu médico y gestores locales.",
    
    "about.blog.title": "Información y Educación Médica",
    "about.blog.p1": "Mantente informado sobre los tratamientos, fases de recuperación y recomendaciones para pacientes que viajan desde el exterior.",
    
    // Dynamic detail placeholders
    "detail.back": "Volver",
    "detail.specialty": "Especialidad Médica",
    "detail.destination": "Destino Médico Aliado",
    "detail.aboutTreatment": "Sobre el Tratamiento",
    "detail.commonProcs": "Procedimientos Comunes",
    "detail.proceduresIntro": "Ofrecemos una amplia variedad de técnicas dentro de esta categoría, adaptadas a tus objetivos anatómicos y de salud.",
    "detail.clinicsTitle": "Clínicas y Hospitales Aliados",
    "detail.clinicsIntro": "Centros médicos de alta complejidad donde se programarán tus intervenciones quirúrgicas:",
    "detail.costCompare": "Comparativa de Costos",
    "detail.costUsLabel": "Costo Promedio EE. UU.",
    "detail.costColLabel": "Costo Promedio Colombia",
    "detail.savingsLabel": "Te ahorras aproximadamente",
    "detail.clinSpecs": "Detalles Clínicos",
    "detail.recoveryTime": "Tiempo de Recuperación",
    "detail.ctaQuote": "Solicitar Cotización Gratis",
    "detail.saveBadge": "Ahorra hasta",
    "detail.guide": "Guía del Destino para Tu Recuperación",
    "detail.guideIntro": "Planifica tu viaje conociendo los detalles prácticos de tu ciudad de destino. Cada ciudad ha sido seleccionada por sus altos estándares médicos y su potencial turístico.",
    "detail.climate": "Clima y Entorno",
    "detail.airConn": "Conectividad Aérea",
    "detail.costLiving": "Costo de Vida Relativo",
    "detail.tourism": "Turismo de Recuperación",
    "detail.planTripTo": "Planificar Viaje a",
    "detail.accreditation": "Acreditación Nacional / Internacional",
    
    // Lock screen
    "lock.title": "Acceso Restringido",
    "lock.desc": "Por favor ingresa la clave de administrador para acceder a la gestión de datos.",
    "lock.password": "Contraseña",
    "lock.submit": "Entrar",
    "lock.error": "Contraseña incorrecta. Inténtalo de nuevo."
  },
  en: {
    // Header & Footer
    "nav.specialties": "Specialties",
    "nav.destinations": "Destinations",
    "nav.about": "About Us",
    "nav.contact": "Contact",
    "nav.book": "Book Now",
    "footer.desc": "Your trusted bridge to premier medical and dental services in Colombia. Expert care, human warmth, and exceptional savings.",
    "footer.rights": "All rights reserved.",
    "footer.guarantees": "Security & Guarantees",
    "footer.contact": "Contact",
    "footer.support": "Support & Inquiries:",
    "footer.whatsapp": "International WhatsApp:",
    "footer.location": "Central Location:",
    "footer.location.val": "El Poblado, Medellin, Colombia",
    
    // Home Page
    "hero.tagline": "WE CONNECT PATIENTS WITH THE BEST CLINICS AND MEDICAL SPECIALISTS IN COLOMBIA",
    "hero.title.part1": "ONE SINGLE AGENCY. ",
    "hero.title.part2": "Everything You Need for Your Treatment in Colombia.",
    "hero.subtitle": "Certified specialists, complete logistics, and personalized guidance in every step. Bridge Care is the bridge between you and the best medical care.",
    "hero.cta.primary": "Learn More",
    "hero.cta.secondary": "View Packages",
    "hero.stats.clinics.num": "50+",
    "hero.stats.clinics.lbl": "Partner Clinics",
    "hero.stats.patients.num": "10k+",
    "hero.stats.patients.lbl": "Patients Served",
    "hero.stats.satisfaction.num": "98%",
    "hero.stats.satisfaction.lbl": "Satisfaction",
    "hero.discover": "DISCOVER MORE",
    "why.title": "Why Colombia",
    "why.subtitle": "World leader in high-quality medicine, state-of-the-art technology, and warm care.",
    
    "why.card1.title": "International Accreditation",
    "why.card1.desc": "Our allied clinics meet rigorous standards and Joint Commission international certifications.",
    "why.card2.title": "Certified Specialists",
    "why.card2.desc": "Surgeons and dentists who are members of highly prestigious national and international scientific societies.",
    "why.card3.title": "Up to 70% Savings",
    "why.card3.desc": "Highly competitive treatment costs due to the lower cost of living and favorable exchange rates.",
    "why.card4.title": "Destinations & Recovery",
    "why.card4.desc": "Recover in temperate climates or the beautiful Caribbean, with 24/7 bilingual assistance.",
    
    "spec.title": "Medical Specialties",
    "spec.subtitle": "Explore our catalog of premium treatments and start planning your transformation.",
    "spec.viewDetail": "View details & quote",
    "spec.costCol": "Average cost Col",
    "spec.costUS": "US",
    "spec.savings": "Approx. savings",
    
    "how.title": "How It Works",
    "how.subtitle": "Your medical journey coordinated from start to finish without any worries.",
    "how.step1.title": "1. Virtual Consultation",
    "how.step1.desc": "Free initial consultations with top-tier surgeons to evaluate your case and goals.",
    "how.step2.title": "2. Logistics & Plan",
    "how.step2.desc": "We coordinate premium lodging, bilingual transfers, and pre-surgical appointments.",
    "how.step3.title": "3. Your Treatment",
    "how.step3.desc": "Procedures performed in accredited clinics equipped with state-of-the-art medical technology.",
    "how.step4.title": "4. Guided Recovery",
    "how.step4.desc": "Personalized and immediate post-operative medical monitoring before your flight back home.",

    "test.title": "Testimonials that Inspire",
    "test.subtitle": "What our international patients say about their Bridge Care experience.",
    
    // Contact Page
    "contact.title": "Begin Your Health Journey",
    "contact.subtitle": "Complete the form to receive a free virtual consultation and personalized quote.",
    "contact.name": "Full Name",
    "contact.email": "Email Address",
    "contact.phone": "WhatsApp (With country code)",
    "contact.spec": "Specialty of Interest",
    "contact.spec.placeholder": "Select an option",
    "contact.city": "Preferred Destination",
    "contact.city.placeholder": "Select an option (optional)",
    "contact.msg": "Tell us about your medical goals or questions",
    "contact.submit": "Request Free Valuation",
    "contact.or": "Or contact us directly:",
    "contact.directCall": "Call / Message on WhatsApp",
    "contact.success": "Form successfully sent! An advisor will contact you within 24 hours by email or WhatsApp.",

    // Nosotros Page
    "about.title": "About Bridge Care",
    "about.subtitle": "Our mission is to make premier medicine in Colombia accessible, safe, and transparent.",
    "about.tab.who": "Who We Are",
    "about.tab.network": "Medical Network",
    "about.tab.packages": "VIP Packages",
    "about.tab.guarantees": "Guarantees",
    "about.tab.blog": "Blog & FAQ",
    
    "about.who.title": "Making international healthcare easy",
    "about.who.p1": "Bridge Care was born out of the vision to simplify and democratize access to world-class medical and aesthetic treatments. We understand that traveling for health is a major decision, which is why we become your local ally in Colombia from start to finish.",
    "about.who.p2": "We manage the entire value chain: selecting the optimal specialist, scheduling tests, stays in recovery-friendly partner hotels, private bilingual transport, and continuous post-surgical medical monitoring.",
    
    "about.network.title": "Only Top Specialists and Clinics",
    "about.network.p1": "We do not compromise on your health. Our network consists only of certified professionals with a proven national and international track record.",
    "about.network.li1": "Plastic surgeons adscribed to the SCCP (Colombian Society of Plastic Surgery).",
    "about.network.li2": "Dentists and oral rehabilitators from the Colombian Odontological Federation.",
    "about.network.li3": "High-complexity clinics with Intensive Care Units (ICU) and state-of-the-art infrastructure.",
    
    "about.packages.title": "All-Inclusive Packages: Worry-Free Recovery",
    "about.packages.p1": "Our plans are designed so you can focus solely on resting and healing. We take care of everything.",
    "about.packages.li1": "Accommodation in boutique partner hotels with customized balanced meals.",
    "about.packages.li2": "Private transfers: Airport - Hotel - Clinic - Airport.",
    "about.packages.li3": "Bilingual recovery nurse for your first 24-48 post-operative hours.",
    "about.packages.li4": "Coordination of post-surgical massages and prescribed medications.",

    "about.guarantees.title": "Total Safety and Complications Coverage",
    "about.guarantees.p1": "We are the only agency that requires and includes specific international medical complications insurance in all our major packages.",
    "about.guarantees.li1": "International surgical medical complications policy up to $15,000 USD.",
    "about.guarantees.li2": "Treatments in JCI (Joint Commission International) or nationally accredited clinics.",
    "about.guarantees.li3": "Unlimited follow-up consultations with your doctor and local managers.",
    
    "about.blog.title": "Medical Information & Education",
    "about.blog.p1": "Stay informed about treatments, recovery phases, and recommendations for patients traveling from abroad.",
    
    // Dynamic detail placeholders
    "detail.back": "Back",
    "detail.specialty": "Medical Specialty",
    "detail.destination": "Allied Medical Destination",
    "detail.aboutTreatment": "About the Treatment",
    "detail.commonProcs": "Common Procedures",
    "detail.proceduresIntro": "We offer a wide variety of techniques within this category, tailored to your anatomical and health goals.",
    "detail.clinicsTitle": "Allied Clinics and Hospitals",
    "detail.clinicsIntro": "High-complexity medical centers where your surgical procedures will be scheduled:",
    "detail.costCompare": "Cost Comparison",
    "detail.costUsLabel": "Average Cost US",
    "detail.costColLabel": "Average Cost Colombia",
    "detail.savingsLabel": "You save approximately",
    "detail.clinSpecs": "Clinical Details",
    "detail.recoveryTime": "Recovery Time",
    "detail.ctaQuote": "Request Free Quote",
    "detail.saveBadge": "Save up to",
    "detail.guide": "Destination Guide for Your Recovery",
    "detail.guideIntro": "Plan your trip by knowing the practical details of your destination city. Each city has been selected for its high medical standards and tourism potential.",
    "detail.climate": "Climate & Environment",
    "detail.airConn": "Air Connectivity",
    "detail.costLiving": "Relative Cost of Living",
    "detail.tourism": "Recovery Tourism",
    "detail.planTripTo": "Plan Trip to",
    "detail.accreditation": "National / International Accreditation",
    
    // Lock screen
    "lock.title": "Restricted Access",
    "lock.desc": "Please enter the admin password to access data management.",
    "lock.password": "Password",
    "lock.submit": "Enter",
    "lock.error": "Incorrect password. Please try again."
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("es");

  useEffect(() => {
    const stored = localStorage.getItem("bc_language");
    if (stored === "es" || stored === "en") {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("bc_language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations["es"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
