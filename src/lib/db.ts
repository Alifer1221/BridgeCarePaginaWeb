// Database interface and mock data engine with localStorage support for client-side persistence.
export interface Specialty {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  procedures: string[];
  avgCostColombia: string;
  avgCostUS: string;
  recoveryDays: string;
  clinics: string[];
  image: string;
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  clinics: string[];
  climate: string;
  tourism: string;
  costOfLiving: string;
  airConnectivity: string;
  image: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
}

// Initial default data
export const defaultSpecialties: Specialty[] = [
  {
    id: "cirugia-estetica",
    name: "Cirugía estética",
    description: "Procedimientos quirúrgicos plásticos y reconstructivos de alta calidad.",
    fullDescription: "Colombia es líder mundial en cirugía estética, con cirujanos certificados internacionalmente y clínicas acreditadas que cumplen con los más altos estándares globales de seguridad y calidad.",
    procedures: ["Lipoescultura de alta definición", "Rinoplastia ultrasónica", "Mamoplastia de aumento", "Abdominoplastia"],
    avgCostColombia: "$3,500 USD",
    avgCostUS: "$12,000 USD",
    recoveryDays: "7 - 14 días",
    clinics: ["Clínica El Tesoro (Medellín)", "Clínica del Country (Bogotá)"],
    image: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "odontologia",
    name: "Odontología",
    description: "Diseño de sonrisa, implantes y rehabilitación oral avanzada.",
    fullDescription: "Nuestros especialistas ofrecen odontología estética de vanguardia. Desde implantes dentales en un solo día hasta diseños de sonrisa personalizados usando tecnología CAD/CAM de última generación.",
    procedures: ["Diseño de sonrisa digital", "Implantes de carga inmediata", "Carillas de porcelana", "Blanqueamiento láser"],
    avgCostColombia: "$2,800 USD",
    avgCostUS: "$9,500 USD",
    recoveryDays: "2 - 5 días",
    clinics: ["DentiCare Advanced (Medellín)", "Clínica Dental VIP (Bogotá)"],
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "bariatria",
    name: "Bariatría",
    description: "Procedimientos de pérdida de peso para mejorar tu salud y calidad de vida.",
    fullDescription: "Cirugías de manga gástrica y bypass gástrico realizadas por cirujanos bariátricos certificados, respaldadas por un equipo multidisciplinario de nutrición, psicología y cardiología.",
    procedures: ["Manga gástrica por laparoscopia", "Bypass gástrico", "Balón gástrico digerible"],
    avgCostColombia: "$5,500 USD",
    avgCostUS: "$18,500 USD",
    recoveryDays: "10 - 15 días",
    clinics: ["Clínica Portoazul (Barranquilla)", "Hospital Universitario Fundación Valle del Lili (Cali)"],
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "estetica",
    name: "Estética",
    description: "Tratamientos no invasivos de rejuvenecimiento facial y corporal.",
    fullDescription: "Tratamientos estéticos avanzados de rápida recuperación que rejuvenecen e hidratan la piel sin cirugía, utilizando las técnicas más seguras y efectivas del mercado.",
    procedures: ["Aplicación de Toxina Botulínica", "Relleno con Ácido Hialurónico", "Peeling químico profundo", "Tensado facial con HIFU"],
    avgCostColombia: "$600 USD",
    avgCostUS: "$2,200 USD",
    recoveryDays: "1 - 3 días",
    clinics: ["MedSkin Center (Medellín)", "Estética Premium (Cartagena)"],
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800"
  }
];

export const defaultDestinations: Destination[] = [
  {
    id: "medellin",
    name: "Medellín",
    description: "La ciudad de la eterna primavera, líder en innovación médica y bienestar.",
    clinics: ["Clínica El Tesoro", "Hospital Pablo Tobón Uribe", "Clínica Las Américas"],
    climate: "Templado primaveral, promedio de 22°C (71°F) todo el año.",
    tourism: "Metrocable, Plaza Botero, Parque Arví, Guatapé y Peñol (a 2 horas), Museo de Antioquia.",
    costOfLiving: "Bajo (Aproximadamente 65% menor que en las principales ciudades de EE. UU.).",
    airConnectivity: "Aeropuerto Internacional José María Córdova (MDE) a 35 min de la ciudad, con conexiones directas a Miami, Fort Lauderdale, Orlando, Nueva York, Panamá y Madrid.",
    image: "https://images.unsplash.com/photo-1596120202271-925206ee85cf?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "bogota",
    name: "Bogotá",
    description: "La capital del país, con la mayor concentración de clínicas de alta complejidad acreditadas.",
    clinics: ["Fundación Santa Fe de Bogotá", "Clínica del Country", "Hospital Universitario San Ignacio"],
    climate: "Fresco de montaña, promedio de 14°C (57°F), noches frías.",
    tourism: "Monserrate, Museo del Oro, Barrio histórico La Candelaria, Catedral de Sal de Zipaquirá (a 1.5 horas).",
    costOfLiving: "Moderado-Bajo (Aproximadamente 60% menor que en EE. UU.).",
    airConnectivity: "Aeropuerto Internacional El Dorado (BOG), el hub principal del país, vuelos directos a más de 30 destinos internacionales en EE. UU., Europa y Latinoamérica.",
    image: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "cali",
    name: "Cali",
    description: "Capital mundial de la salsa, conocida por la calidez de su gente y excelente medicina bariátrica.",
    clinics: ["Fundación Valle del Lili", "Clínica Imbanaco", "Centro Médico Farallones"],
    climate: "Cálido y tropical, promedio de 25°C (77°F) con brisa fresca por las tardes.",
    tourism: "Bulevar del Río, Barrio San Antonio, Cristo Rey, clases de Salsa en el barrio Juanchito.",
    costOfLiving: "Muy bajo (Aproximadamente 70% menor que en EE. UU.).",
    airConnectivity: "Aeropuerto Internacional Alfonso Bonilla Aragón (CLO), vuelos directos a Miami, Fort Lauderdale, Panamá, Madrid y Santiago de Chile.",
    image: "https://images.unsplash.com/photo-1628150383188-75c1d354b1f6?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "cartagena",
    name: "Cartagena",
    description: "La joya histórica del Caribe, perfecta para combinar tratamientos con descanso junto al mar.",
    clinics: ["MediHelp Services", "Nuevo Hospital Bocagrande", "Clínica MediCentro"],
    climate: "Cálido caribeño, promedio de 28°C (82°F), humedad alta y brisa marina.",
    tourism: "Ciudad Amurallada (Patrimonio de la Humanidad), Castillo de San Felipe, Islas del Rosario, Barú.",
    costOfLiving: "Moderado (Aproximadamente 50% menor que en EE. UU., por ser zona turística).",
    airConnectivity: "Aeropuerto Internacional Rafael Núñez (CTG), vuelos directos a Miami, Nueva York, Orlando, Atlanta, Panamá y Lima.",
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=800"
  }
];

export const defaultBlogPosts: BlogPost[] = [
  {
    id: "por-que-colombia-turismo-medico",
    title: "¿Por qué elegir Colombia para tu tratamiento médico?",
    excerpt: "Conoce las tres razones clave: calidad acreditada, costos hasta un 70% menores y la oportunidad de una recuperación en el paraíso.",
    content: "Colombia se ha posicionado como uno de los principales destinos de turismo de salud en el mundo. Según la revista AméricaEconomía, varias de las mejores clínicas de Latinoamérica están en Colombia. Los costos de los procedimientos en cirugía plástica, odontología y bariatría son sustancialmente inferiores a los de Estados Unidos y Europa, no por falta de calidad, sino por el costo de vida y los tipos de cambio de divisas favorables. Además, los médicos colombianos a menudo realizan sus estudios y subespecialidades en el exterior, trayendo tecnologías y técnicas pioneras al país.",
    author: "Dr. Carlos Mario Restrepo",
    date: "2026-05-18",
    category: "Consejos de viaje"
  },
  {
    id: "preparacion-viaje-medico-colombia",
    title: "Guía de preparación para tu viaje de salud",
    excerpt: "Desde la primera consulta virtual hasta tu regreso a casa, detallamos el paso a paso del viaje.",
    content: "Viajar para recibir tratamiento médico requiere una planificación detallada. El primer paso es tener una videollamada de valoración gratuita con nuestros médicos aliados. Una vez aprobado tu plan médico, coordinamos las fechas de viaje. Recomendamos comprar los vuelos con flexibilidad. Al llegar, nuestro chofer bilingüe te recogerá y te llevará a tu hotel de recuperación. Estaremos contigo en la cirugía, en los controles postoperatorios y te brindaremos un seguimiento médico 24/7. Asegúrate de viajar con ropa cómoda y de seguir todas las instrucciones prequirúrgicas facilitadas por tu gestor de Bridge Care.",
    author: "Liliana Gómez",
    date: "2026-05-15",
    category: "Consejos de viaje"
  },
  {
    id: "garantias-y-seguridad-en-cirugia",
    title: "¿Qué garantías médicas ofrece Bridge Care?",
    excerpt: "Tu salud y tranquilidad son lo primero. Conoce nuestras pólizas de complicaciones y estándares de acreditación.",
    content: "En Bridge Care, tu seguridad es innegociable. Trabajamos únicamente con cirujanos miembros de sociedades científicas reconocidas (como la Sociedad Colombiana de Cirugía Plástica o la Federación Odontológica Colombiana) y clínicas de alta complejidad acreditadas por el Ministerio de Salud de Colombia. Además, todos nuestros paquetes incluyen un seguro de complicaciones médicas internacionales de la aseguradora líder del sector, cubriendo cualquier imprevisto de manera integral durante tu estadía en el país.",
    author: "Comité de Calidad",
    date: "2026-05-10",
    category: "Garantías"
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
  return JSON.parse(stored);
}

export function saveSpecialties(specialties: Specialty[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("bc_specialties", JSON.stringify(specialties));
  // Dispatch simple custom event to trigger reactive updates in client elements
  window.dispatchEvent(new Event("bc_db_update"));
}

export function getStoredDestinations(): Destination[] {
  if (typeof window === "undefined") return defaultDestinations;
  const stored = localStorage.getItem("bc_destinations");
  if (!stored) {
    localStorage.setItem("bc_destinations", JSON.stringify(defaultDestinations));
    return defaultDestinations;
  }
  return JSON.parse(stored);
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
  return JSON.parse(stored);
}

export function saveBlogPosts(posts: BlogPost[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("bc_blog", JSON.stringify(posts));
  window.dispatchEvent(new Event("bc_db_update"));
}
