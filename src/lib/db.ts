// Database interface and mock data engine with localStorage support for client-side persistence.

export interface Specialty {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  fullDescription: string;
  fullDescriptionEn: string;
  procedures: string[];
  proceduresEn: string[];
  avgCostColombia: string;
  avgCostUS: string;
  recoveryDays: string;
  recoveryDaysEn: string;
  clinics: string[];
  image: string;
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  descriptionEn: string;
  clinics: string[];
  climate: string;
  climateEn: string;
  tourism: string;
  tourismEn: string;
  costOfLiving: string;
  costOfLivingEn: string;
  airConnectivity: string;
  airConnectivityEn: string;
  image: string;
}

export interface BlogPost {
  id: string;
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  content: string;
  contentEn: string;
  author: string;
  date: string;
  category: string;
  categoryEn: string;
}

// Initial default data
export const defaultSpecialties: Specialty[] = [
  {
    id: "cirugia-estetica",
    name: "Cirugía estética",
    nameEn: "Aesthetic Surgery",
    description: "Procedimientos quirúrgicos plásticos y reconstructivos de alta calidad.",
    descriptionEn: "High-quality plastic and reconstructive surgical procedures.",
    fullDescription: "Colombia es líder mundial en cirugía estética, con cirujanos certificados internacionalmente y clínicas acreditadas que cumplen con los más altos estándares globales de seguridad y calidad.",
    fullDescriptionEn: "Colombia is a world leader in aesthetic surgery, with internationally certified surgeons and accredited clinics that meet the highest global safety and quality standards.",
    procedures: ["Lipoescultura de alta definición", "Rinoplastia ultrasónica", "Mamoplastia de aumento", "Abdominoplastia"],
    proceduresEn: ["High-definition Liposculpture", "Ultrasonic Rhinoplasty", "Breast Augmentation", "Tummy Tuck"],
    avgCostColombia: "$3,500 USD",
    avgCostUS: "$12,000 USD",
    recoveryDays: "7 - 14 días",
    recoveryDaysEn: "7 - 14 days",
    clinics: ["Clínica El Tesoro (Medellín)", "Clínica del Country (Bogotá)"],
    image: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "odontologia",
    name: "Odontología",
    nameEn: "Dentistry",
    description: "Diseño de sonrisa, implantes y rehabilitación oral avanzada.",
    descriptionEn: "Smile design, implants, and advanced oral rehabilitation.",
    fullDescription: "Nuestros especialistas ofrecen odontología estética de vanguardia. Desde implantes dentales en un solo día hasta diseños de sonrisa personalizados usando tecnología CAD/CAM de última generación.",
    fullDescriptionEn: "Our specialists offer cutting-edge cosmetic dentistry. From dental implants in a single day to customized smile designs using state-of-the-art CAD/CAM technology.",
    procedures: ["Diseño de sonrisa digital", "Implantes de carga inmediata", "Carillas de porcelana", "Blanqueamiento láser"],
    proceduresEn: ["Digital Smile Design", "Immediate Load Implants", "Porcelain Veneers", "Laser Teeth Whitening"],
    avgCostColombia: "$2,800 USD",
    avgCostUS: "$9,500 USD",
    recoveryDays: "2 - 5 días",
    recoveryDaysEn: "2 - 5 days",
    clinics: ["DentiCare Advanced (Medellín)", "Clínica Dental VIP (Bogotá)"],
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "bariatria",
    name: "Bariatría",
    nameEn: "Bariatrics",
    description: "Procedimientos de pérdida de peso para mejorar tu salud y calidad de vida.",
    descriptionEn: "Weight loss procedures to improve your health and quality of life.",
    fullDescription: "Cirugías de manga gástrica y bypass gástrico realizadas por cirujanos bariátricos certificados, respaldadas por un equipo multidisciplinario de nutrición, psicología y cardiología.",
    fullDescriptionEn: "Gastric sleeve and gastric bypass surgeries performed by certified bariatric surgeons, backed by a multidisciplinary team of nutrition, psychology, and cardiology.",
    procedures: ["Manga gástrica por laparoscopia", "Bypass gástrico", "Balón gástrico digerible"],
    proceduresEn: ["Laparoscopic Gastric Sleeve", "Gastric Bypass", "Swallowable Gastric Balloon"],
    avgCostColombia: "$5,500 USD",
    avgCostUS: "$18,500 USD",
    recoveryDays: "10 - 15 días",
    recoveryDaysEn: "10 - 15 days",
    clinics: ["Clínica Portoazul (Barranquilla)", "Hospital Universitario Fundación Valle del Lili (Cali)"],
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "estetica",
    name: "Estética",
    nameEn: "Non-Surgical Aesthetics",
    description: "Tratamientos no invasivos de rejuvenecimiento facial y corporal.",
    descriptionEn: "Non-invasive facial and body rejuvenation treatments.",
    fullDescription: "Tratamientos estéticos avanzados de rápida recuperación que rejuvenecen e hidratan la piel sin cirugía, utilizando las técnicas más seguras y efectivas del mercado.",
    fullDescriptionEn: "Advanced quick-recovery aesthetic treatments that rejuvenate and hydrate the skin without surgery, using the safest and most effective techniques on the market.",
    procedures: ["Aplicación de Toxina Botulínica", "Relleno con Ácido Hialurónico", "Peeling químico profundo", "Tensado facial con HIFU"],
    proceduresEn: ["Botox Application", "Hyaluronic Acid Fillers", "Deep Chemical Peeling", "Facial Tightening with HIFU"],
    avgCostColombia: "$600 USD",
    avgCostUS: "$2,200 USD",
    recoveryDays: "1 - 3 días",
    recoveryDaysEn: "1 - 3 days",
    clinics: ["MedSkin Center (Medellín)", "Estética Premium (Cartagena)"],
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800"
  }
];

export const defaultDestinations: Destination[] = [
  {
    id: "medellin",
    name: "Medellín",
    description: "La ciudad de la eterna primavera, líder en innovación médica y bienestar.",
    descriptionEn: "The city of eternal spring, a leader in medical innovation and wellness.",
    clinics: ["Clínica El Tesoro", "Hospital Pablo Tobón Uribe", "Clínica Las Américas"],
    climate: "Templado primaveral, promedio de 22°C (71°F) todo el año.",
    climateEn: "Temperate spring-like, average of 22°C (71°F) all year round.",
    tourism: "Metrocable, Plaza Botero, Parque Arví, Guatapé y Peñol (a 2 horas), Museo de Antioquia.",
    tourismEn: "Metrocable, Botero Square, Arvi Park, Guatape & Penol Rock (2 hours away), Museum of Antioquia.",
    costOfLiving: "Bajo (Aproximadamente 65% menor que en las principales ciudades de EE. UU.).",
    costOfLivingEn: "Low (Approximately 65% lower than in major US cities).",
    airConnectivity: "Aeropuerto Internacional José María Córdova (MDE) a 35 min de la ciudad, con conexiones directas a Miami, Fort Lauderdale, Orlando, Nueva York, Panamá y Madrid.",
    airConnectivityEn: "Jose Maria Cordova International Airport (MDE) 35 min away, with direct flights to Miami, Fort Lauderdale, Orlando, New York, Panama, and Madrid.",
    image: "https://images.unsplash.com/photo-1596120202271-925206ee85cf?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "bogota",
    name: "Bogotá",
    description: "La capital del país, con la mayor concentración de clínicas de alta complejidad acreditadas.",
    descriptionEn: "The country's capital, featuring the highest concentration of accredited high-complexity clinics.",
    clinics: ["Fundación Santa Fe de Bogotá", "Clínica del Country", "Hospital Universitario San Ignacio"],
    climate: "Fresco de montaña, promedio de 14°C (57°F), noches frías.",
    climateEn: "Cool mountain climate, average of 14°C (57°F), cold nights.",
    tourism: "Monserrate, Museo del Oro, Barrio histórico La Candelaria, Catedral de Sal de Zipaquirá (a 1.5 horas).",
    tourismEn: "Monserrate, Gold Museum, Historic La Candelaria neighborhood, Salt Cathedral of Zipaquira (1.5 hours away).",
    costOfLiving: "Moderado-Bajo (Aproximadamente 60% menor que en EE. UU.).",
    costOfLivingEn: "Moderate-Low (Approximately 60% lower than in the US).",
    airConnectivity: "Aeropuerto Internacional El Dorado (BOG), el hub principal del país, vuelos directos a más de 30 destinos internacionales en EE. UU., Europa y Latinoamérica.",
    airConnectivityEn: "El Dorado International Airport (BOG), the main hub of the country, with direct flights to over 30 international destinations in the US, Europe, and Latin America.",
    image: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "cali",
    name: "Cali",
    description: "Capital mundial de la salsa, conocida por la calidez de su gente y excelente medicina bariátrica.",
    descriptionEn: "World salsa capital, known for its warm people and excellent bariatric medicine.",
    clinics: ["Fundación Valle del Lili", "Clínica Imbanaco", "Centro Médico Farallones"],
    climate: "Cálido y tropical, promedio de 25°C (77°F) con brisa fresca por las tardes.",
    climateEn: "Warm and tropical, average of 25°C (77°F) with cool breeze in the evening.",
    tourism: "Bulevar del Río, Barrio San Antonio, Cristo Rey, clases de Salsa en el barrio Juanchito.",
    tourismEn: "River Boulevard, San Antonio traditional neighborhood, Christ the King statue, Salsa lessons in Juanchito.",
    costOfLiving: "Muy bajo (Aproximadamente 70% menor que en EE. UU.).",
    costOfLivingEn: "Very low (Approximately 70% lower than in the US).",
    airConnectivity: "Aeropuerto Internacional Alfonso Bonilla Aragón (CLO), vuelos directos a Miami, Fort Lauderdale, Panamá, Madrid y Santiago de Chile.",
    airConnectivityEn: "Alfonso Bonilla Aragon International Airport (CLO), direct flights to Miami, Fort Lauderdale, Panama, Madrid, and Santiago.",
    image: "https://images.unsplash.com/photo-1628150383188-75c1d354b1f6?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "cartagena",
    name: "Cartagena",
    description: "La joya histórica del Caribe, perfecta para combinar tratamientos con descanso junto al mar.",
    descriptionEn: "The historical gem of the Caribbean, perfect for combining treatments with oceanside rest.",
    clinics: ["MediHelp Services", "Nuevo Hospital Bocagrande", "Clínica MediCentro"],
    climate: "Cálido caribeño, promedio de 28°C (82°F), humedad alta y brisa marina.",
    climateEn: "Warm Caribbean, average of 28°C (82°F), high humidity and ocean breeze.",
    tourism: "Ciudad Amurallada (Patrimonio de la Humanidad), Castillo de San Felipe, Islas del Rosario, Barú.",
    tourismEn: "Walled City (UNESCO World Heritage Site), San Felipe Castle, Rosario Islands, Baru.",
    costOfLiving: "Moderado (Aproximadamente 50% menor que en EE. UU., por ser zona turística).",
    costOfLivingEn: "Moderate (Approximately 50% lower than in the US, due to tourism activity).",
    airConnectivity: "Aeropuerto Internacional Rafael Núñez (CTG), vuelos directos a Miami, Nueva York, Orlando, Atlanta, Panamá y Lima.",
    airConnectivityEn: "Rafael Nunez International Airport (CTG), direct flights to Miami, New York, Orlando, Atlanta, Panama, and Lima.",
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=800"
  }
];

export const defaultBlogPosts: BlogPost[] = [
  {
    id: "por-que-colombia-turismo-medico",
    title: "¿Por qué elegir Colombia para tu tratamiento médico?",
    titleEn: "Why Choose Colombia for Your Medical Treatment?",
    excerpt: "Conoce las tres razones clave: calidad acreditada, costos hasta un 70% menores y la oportunidad de una recuperación en el paraíso.",
    excerptEn: "Discover the three key reasons: accredited quality, costs up to 70% lower, and the chance to recover in paradise.",
    content: "Colombia se ha posicionado como uno de los principales destinos de turismo de salud en el mundo. Según la revista AméricaEconomía, varias de las mejores clínicas de Latinoamérica están en Colombia. Los costos de los procedimientos en cirugía plástica, odontología y bariatría son sustancialmente inferiores a los de Estados Unidos y Europa, no por falta de calidad, sino por el costo de vida y los tipos de cambio de divisas favorables. Además, los médicos colombianos a menudo realizan sus estudios y subespecialidades en el exterior, trayendo tecnologías y técnicas pioneras al país.",
    contentEn: "Colombia has positioned itself as one of the top health tourism destinations globally. According to AmericaEconomia magazine, several of the best clinics in Latin America are located in Colombia. Treatment costs in plastic surgery, dentistry, and bariatrics are substantially lower than in the US and Europe, not due to lack of quality, but due to cost of living and favorable exchange rates. Furthermore, Colombian doctors frequently complete their training and subspecialties abroad, introducing pioneering technologies and techniques to the country.",
    author: "Dr. Carlos Mario Restrepo",
    date: "2026-05-18",
    category: "Consejos de viaje",
    categoryEn: "Travel Tips"
  },
  {
    id: "preparacion-viaje-medico-colombia",
    title: "Guía de preparación para tu viaje de salud",
    titleEn: "Preparation Guide for Your Medical Travel",
    excerpt: "Desde la primera consulta virtual hasta tu regreso a casa, detallamos el paso a paso del viaje.",
    excerptEn: "From the first virtual consultation to your trip back home, we detail the step-by-step journey.",
    content: "Viajar para recibir tratamiento médico requiere una planificación detallada. El primer paso es tener una videollamada de valoración gratuita con nuestros médicos aliados. Una vez aprobado tu plan médico, coordinamos las fechas de viaje. Recomendamos comprar los vuelos con flexibilidad. Al llegar, nuestro chofer bilingüe te recogerá y te llevará a tu hotel de recuperación. Estaremos contigo en la cirugía, en los controles postoperatorios y te brindaremos un seguimiento médico 24/7. Asegúrate de viajar con ropa cómoda y de seguir todas las instrucciones prequirúrgicas facilitadas por tu gestor de Bridge Care.",
    contentEn: "Traveling for medical care requires detailed planning. The first step is to have a free virtual evaluation call with our allied physicians. Once your medical plan is approved, we coordinate your travel dates. We recommend booking flexible flights. Upon arrival, our bilingual driver will pick you up and take you to your recovery hotel. We will accompany you to surgery, assist during post-op checks, and offer 24/7 medical follow-up. Make sure to pack comfortable clothing and follow all pre-surgical guidelines provided by your Bridge Care manager.",
    author: "Liliana Gómez",
    date: "2026-05-15",
    category: "Consejos de viaje",
    categoryEn: "Travel Tips"
  },
  {
    id: "garantias-y-seguridad-en-cirugia",
    title: "¿Qué garantías médicas ofrece Bridge Care?",
    titleEn: "What Medical Guarantees Does Bridge Care Offer?",
    excerpt: "Tu salud y tranquilidad son lo primero. Conoce nuestras pólizas de complicaciones y estándares de acreditación.",
    excerptEn: "Your health and peace of mind come first. Learn about our complications policies and accreditation standards.",
    content: "En Bridge Care, tu seguridad es innegociable. Trabajamos únicamente con cirujanos miembros de sociedades científicas reconocidas (como la Sociedad Colombiana de Cirugía Plástica o la Federación Odontológica Colombiana) y clínicas de alta complejidad acreditadas por el Ministerio de Salud de Colombia. Además, todos nuestros paquetes incluyen un seguro de complicaciones médicas internacionales de la aseguradora líder del sector, cubriendo cualquier imprevisto de manera integral durante tu estadía en el país.",
    contentEn: "At Bridge Care, your safety is non-negotiable. We only work with surgeons who are members of recognized scientific societies (such as the Colombian Society of Plastic Surgery or the Colombian Odontological Federation) and high-complexity clinics accredited by the Colombian Ministry of Health. Additionally, all our packages include international medical complications insurance from the industry's leading insurer, fully covering any unforeseen events during your stay in the country.",
    author: "Comité de Calidad",
    date: "2026-05-10",
    category: "Garantías",
    categoryEn: "Guarantees"
  }
];

// Helper functions that safely check for window/localStorage
export function getStoredSpecialties(): Specialty[] {
  if (typeof window === "undefined") return defaultSpecialties;
  const stored = localStorage.getItem("bc_specialties");
  if (!stored) {
    localStorage.setItem("bc_specialties", JSON.stringify(defaultSpecialties));
    return defaultSpecialties;
  }
  try {
    const parsed = JSON.parse(stored);
    // If the stored data is outdated (doesn't have nameEn), overwrite it
    if (parsed.length > 0 && !parsed[0].nameEn) {
      localStorage.setItem("bc_specialties", JSON.stringify(defaultSpecialties));
      return defaultSpecialties;
    }
    return parsed;
  } catch (e) {
    return defaultSpecialties;
  }
}

export function saveSpecialties(specialties: Specialty[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("bc_specialties", JSON.stringify(specialties));
  window.dispatchEvent(new Event("bc_db_update"));
}

export function getStoredDestinations(): Destination[] {
  if (typeof window === "undefined") return defaultDestinations;
  const stored = localStorage.getItem("bc_destinations");
  if (!stored) {
    localStorage.setItem("bc_destinations", JSON.stringify(defaultDestinations));
    return defaultDestinations;
  }
  try {
    const parsed = JSON.parse(stored);
    if (parsed.length > 0 && !parsed[0].descriptionEn) {
      localStorage.setItem("bc_destinations", JSON.stringify(defaultDestinations));
      return defaultDestinations;
    }
    return parsed;
  } catch (e) {
    return defaultDestinations;
  }
}

export function saveDestinations(destinations: Destination[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("bc_destinations", JSON.stringify(destinations));
  window.dispatchEvent(new Event("bc_db_update"));
}

export function getStoredBlogPosts(): BlogPost[] {
  if (typeof window === "undefined") return defaultBlogPosts;
  const stored = localStorage.getItem("bc_blog");
  if (!stored) {
    localStorage.setItem("bc_blog", JSON.stringify(defaultBlogPosts));
    return defaultBlogPosts;
  }
  try {
    const parsed = JSON.parse(stored);
    if (parsed.length > 0 && !parsed[0].titleEn) {
      localStorage.setItem("bc_blog", JSON.stringify(defaultBlogPosts));
      return defaultBlogPosts;
    }
    return parsed;
  } catch (e) {
    return defaultBlogPosts;
  }
}

export function saveBlogPosts(posts: BlogPost[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("bc_blog", JSON.stringify(posts));
  window.dispatchEvent(new Event("bc_db_update"));
}
