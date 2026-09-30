// Database interface and mock data engine with localStorage support for client-side persistence.

/** "Why do this in Colombia" block shown right after the hero: the argument
 *  for the destination, before the page gets into the procedure itself. */
export interface WhyColombia {
  title: string;
  titleEn: string;
  /** Optional second half of the headline, set in bold after `title`. */
  titleStrong?: string;
  titleStrongEn?: string;
  lead: string;
  leadEn: string;
  /** `image` is a small supporting photo shown on the reason's card. */
  /** `tab` is the reason's short name in the deck's tabs; `stat` is set
   *  large on its card with `statLabel` under it ("22°" / "todo el año"). */
  reasons: {
    title: string;
    titleEn: string;
    text: string;
    textEn: string;
    image?: string;
    tab?: string;
    tabEn?: string;
    stat?: string;
    statEn?: string;
    statLabel?: string;
    statLabelEn?: string;
  }[];
}

/** Titled text item, bilingual. */
export interface InfoItem {
  title: string;
  titleEn: string;
  text: string;
  textEn: string;
}

/** What a patient needs to know about one procedure before deciding, shown on
 *  its own page after the "why Colombia" block: a short "what it is", the key
 *  facts, and answers to the patient's real worries. Not a surgical manual. */
export interface ProcedureInfo {
  whatIs: string;
  whatIsEn: string;
  anesthesia: string;
  anesthesiaEn: string;
  /** Time in the operating room. */
  duration: string;
  durationEn: string;
  hospital: string;
  hospitalEn: string;
  /** Short name for the headline ("lipo HD"); falls back to the full name. */
  shortName?: string;
  shortNameEn?: string;
  /** Full "¿Qué es…?" question when "¿Qué es la <shortName>?" doesn't read
   *  right ("¿Qué es el diseño de sonrisa?", "¿Qué son las carillas?"). */
  question?: string;
  questionEn?: string;
  /** Bold second half of the "¿Qué es…?" headline. */
  tagline?: string;
  taglineEn?: string;
  /** What the recovery days in the hotel look like, for the stay track. */
  hotelText?: string;
  hotelTextEn?: string;
  /** The patient's worries, answered: `title` is the question as they'd ask
   *  it ("¿Duele?"), `text` the short, honest answer. */
  concerns: InfoItem[];
}

export interface ProcedureDetail {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  recovery: string;
  recoveryEn: string;
  /** Entry price, shown as a "desde". Omitted procedures show no price at all
   *  rather than a placeholder — an empty price reads better than a wrong one. */
  priceFrom?: string;
  sessions?: string;
  sessionsEn?: string;
  /** Photograph of this specific procedure. The specialty page pins it beside
   *  the treatment list and swaps it as you scroll; without one it falls back
   *  to the specialty's own image, so adding real photography here is the
   *  single biggest upgrade that page can get. */
  photo?: string;
  /** URL segment. When set, the procedure gets its own page at
   *  /specialties/<specialty>/<slug> and an entry in the header submenu. */
  slug?: string;
  heroTitle?: string;
  heroTitleEn?: string;
  heroLead?: string;
  heroLeadEn?: string;
  heroImage?: string;
  heroPosition?: string;
  /** Who this procedure suits — shown on its own page. */
  idealFor?: string[];
  idealForEn?: string[];
  /** Procedure-specific questions, shown before the specialty's general ones. */
  faqs?: Faq[];
  why?: WhyColombia;
  details?: ProcedureInfo;
}

/** A result the clinic can actually evidence. Both photos must be the same
 *  patient, same framing and same lighting, and must be published with written
 *  consent — before/after medical advertising is regulated in most of the
 *  markets these patients travel from. */
export interface BeforeAfter {
  before: string;
  after: string;
  label: string;
  labelEn: string;
  note: string;
  noteEn: string;
}

/** A patient's story, with written consent: a short video or a photo.
 *  `video` is the file URL (mp4/webm); `image` is a photo, used when there is
 *  no video. With neither, the page shows an empty, labelled frame instead of
 *  inventing one. */
export interface VideoStory {
  video?: string;
  poster?: string;
  image?: string;
  /** What the patient says in the video or about the photo, written out in
   *  their own words. Shown under the card; long text folds to four lines. */
  quote?: string;
  quoteEn?: string;
  /** First name only, or initials if the patient prefers. */
  name?: string;
  procedure: string;
  procedureEn: string;
  /** "0:32" */
  duration?: string;
}

/** A patient review. `rating` is out of 5; the page averages them rather than
 *  showing a headline score that no data backs up. */
export interface Review {
  quote: string;
  quoteEn: string;
  author: string;
  origin: string;
  originEn: string;
  procedure: string;
  procedureEn: string;
  rating: number;
}

export interface ClinicDetail {
  name: string;
  note: string;
  noteEn: string;
}

export interface SpecialtyTestimonial {
  quote: string;
  quoteEn: string;
  author: string;
  origin: string;
  originEn: string;
}

/** The specialist who performs the procedure. Shown with name, credentials and
 *  registry number: the benchmark's finding was that patients trust a person,
 *  not a logo. Every field here must be verifiable before publishing. */
export interface DoctorProfile {
  name: string;
  title: string;
  titleEn: string;
  /** Colombian medical registry ("Registro Médico") — the verifiable credential. */
  registry: string;
  yearsExperience: number;
  /** Short list of trainings/affiliations, most authoritative first. */
  credentials: string[];
  credentialsEn: string[];
  photo: string;
  quote: string;
  quoteEn: string;
}

/** What the trip looks like around the procedure — the part a patient cannot
 *  get from a clinic, and the reason to travel with an agency. */
export interface JourneyStep {
  label: string;
  labelEn: string;
  /** Optional photograph for this leg of the trip. */
  photo?: string;
  detail: string;
  detailEn: string;
}

/** Recovery-time city context: what the patient can actually do while healing. */
export interface CityGuide {
  city: string;
  intro: string;
  introEn: string;
  climate: string;
  climateEn: string;
  /** Light activities compatible with recovery for this specialty, in the
   *  order they fit the stay. `when` is the moment of the stay ("Día 7");
   *  `photo` is optional (an empty frame shows until there is one). */
  activities: {
    name: string;
    nameEn: string;
    note: string;
    noteEn: string;
    when?: string;
    whenEn?: string;
    /** Shown after `when` in the story header: "Día 3 · en tu hotel". */
    where?: string;
    whereEn?: string;
    /** Sticker on the story ("22 °C afuera"). */
    tag?: string;
    tagEn?: string;
    /** Colour of the story while there is no photo. */
    tone?: string;
    photo?: string;
  }[];
}

export interface Faq {
  q: string;
  qEn: string;
  a: string;
  aEn: string;
}

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
  /** Full-bleed photo for the specialty page hero. It should show a result
   *  (a patient after treatment), not an operating room. Falls back to image. */
  heroImage?: string;
  /** CSS background-position for heroImage, to keep the face in frame. */
  heroPosition?: string;
  /** Short hero headline and one-line lead. Kept separate from description /
   *  fullDescription (used by the admin, cards and SEO) so the hero can stay
   *  punchy. Fall back to those when missing. */
  heroTitle?: string;
  heroTitleEn?: string;
  heroLead?: string;
  heroLeadEn?: string;
  why?: WhyColombia;
  // Optional richer content — used when present, otherwise the page falls back to the fields above.
  procedureDetails?: ProcedureDetail[];
  packageIncludes?: string[];
  packageIncludesEn?: string[];
  packageExcludes?: string[];
  packageExcludesEn?: string[];
  preOpQuestions?: string[];
  preOpQuestionsEn?: string[];
  clinicDetails?: ClinicDetail[];
  testimonial?: SpecialtyTestimonial;
  /** Entry price for the cheapest procedure in this specialty. Deliberately
   *  separate from avgCostColombia: this one is shown publicly as a "desde". */
  priceFrom?: string;
  doctor?: DoctorProfile;
  journey?: JourneyStep[];
  cityGuide?: CityGuide;
  faqs?: Faq[];
  beforeAfter?: BeforeAfter[];
  reviews?: Review[];
  /** Video stories from the specialist's own patients. */
  videoStories?: VideoStory[];
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
  /** Cover photo (or diagram) for the card and the article. */
  image?: string;
  /** Reading time in minutes, shown as "8 min de lectura". */
  readMinutes?: number;
  /** Takes the lead spot on the blog; otherwise the newest post does. */
  featured?: boolean;
  /** Workflow state from the blog dashboard. Missing means published (the
   *  posts written in code). Only published posts, and scheduled ones whose
   *  time has come, are shown on the site: see isLivePost. */
  status?: "published" | "draft" | "scheduled" | "review";
  /** ISO date-time a scheduled post goes live. */
  publishAt?: string;
  /** Last time the post was saved in the dashboard (ISO). */
  updatedAt?: string;
  /** Who reviewed the medical content ("Dr. …"). */
  reviewedBy?: string;
  /** Search engine title and description; fall back to title / excerpt. */
  seoTitle?: string;
  seoDescription?: string;
  /** The search phrase the article is written to rank for. */
  keyword?: string;
  /** Alternative text for the cover image. */
  imageAlt?: string;
  /** Ready-to-paste text for the LinkedIn post that shares the article. */
  linkedinText?: string;
}

/** Whether a post should be visible on the public site right now. */
export function isLivePost(p: BlogPost, now: Date = new Date()): boolean {
  if (!p.status || p.status === "published") return true;
  if (p.status === "scheduled" && p.publishAt) return new Date(p.publishAt) <= now;
  return false;
}

/** The blog's fixed sections, in the order of its category bar (design board
 *  BL1+). "Ciencia" and "Salud y planeta" also get their own blocks on the
 *  blog page; posts with any other category still show and can be filtered. */
export const BLOG_CATEGORIES = [
  { es: "Cirugía estética", en: "Aesthetic surgery" },
  { es: "Odontología", en: "Dentistry" },
  { es: "Bariatría", en: "Bariatrics" },
  { es: "Estética", en: "Aesthetics" },
  { es: "Ciencia", en: "Science" },
  { es: "Colombia y turismo", en: "Colombia and travel" },
  { es: "Salud y planeta", en: "Health and planet" },
];

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
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1600",
    heroImage: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=80&w=1600",
    heroPosition: "center",
    heroTitle: "Tu cirugía estética en Medellín.",
    heroTitleEn: "Your aesthetic surgery in Medellín.",
    heroLead: "Cirujanos plásticos certificados, clínicas acreditadas y todo tu viaje resuelto.",
    heroLeadEn: "Certified plastic surgeons, accredited clinics and your whole trip handled.",
    why: {
      title: "¿Por qué operarte en Colombia?",
      titleEn: "Why have surgery in Colombia?",
      lead: "Colombia está entre los países con más cirugías estéticas del mundo. Eso significa cirujanos con miles de casos, no con decenas.",
      leadEn: "Colombia ranks among the countries with the most aesthetic surgeries in the world. That means surgeons with thousands of cases, not dozens.",
      reasons: [
        {
          title: "Cirujanos con volumen real",
          titleEn: "Surgeons with real volume",
          tab: "Los cirujanos",
          tabEn: "The surgeons",
          image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600",
          text: "Más casos es más criterio: saben qué funciona en tu cuerpo y qué no.",
          textEn: "More cases means better judgement: they know what works for your body and what doesn't."
        },
        {
          title: "Clínicas habilitadas y vigiladas",
          titleEn: "Licensed, inspected clinics",
          tab: "Las clínicas",
          tabEn: "The clinics",
          image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600",
          text: "Solo operamos en clínicas habilitadas, con quirófano y hospitalización en el mismo edificio.",
          textEn: "We only operate in licensed clinics, with operating rooms and inpatient beds in the same building."
        },
        {
          title: "Menos costo, mismos materiales",
          titleEn: "Lower cost, same materials",
          tab: "El costo",
          tabEn: "The cost",
          image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=600",
          text: "El precio baja por el costo de vida, no por los insumos: implantes y equipos son las mismas marcas internacionales.",
          textEn: "The price is lower because of the cost of living, not the supplies: implants and equipment are the same international brands."
        }
      ]
    },
    // ⚠️ DATOS DE MUESTRA — como todo este archivo (mock data engine).
    // Precios, nombre y registro del especialista, clínicas, reseñas y
    // testimonio deben reemplazarse por información verificable antes de publicar.
    priceFrom: "$2,400 USD",
    reviews: [
      {
        quote: "Lo que me dio confianza fue que el cirujano me dijo que no a una parte de lo que yo quería. Me explicó por qué con mi piel no iba a quedar bien y ajustamos el plan. Hoy le agradezco esa honestidad.",
        quoteEn: "What gave me confidence was that the surgeon said no to part of what I wanted. He explained why it wouldn't look right with my skin and we adjusted the plan. Today I'm grateful for that honesty.",
        author: "Jennifer Castaño",
        origin: "Orlando, Estados Unidos",
        originEn: "Orlando, United States",
        procedure: "Lipoescultura",
        procedureEn: "Liposculpture",
        rating: 5
      },
      {
        quote: "La enfermera iba al hotel todos los días a hacerme los drenajes linfáticos. No tuve que moverme ni buscar a nadie, todo estaba en el plan desde el principio.",
        quoteEn: "The nurse came to the hotel every day for my lymphatic drainage. I didn't have to move or find anyone; it was all in the plan from the start.",
        author: "Paola Andrade",
        origin: "Madrid, España",
        originEn: "Madrid, Spain",
        procedure: "Abdominoplastia",
        procedureEn: "Tummy tuck",
        rating: 5
      },
      {
        quote: "Me hicieron los exámenes prequirúrgicos al día siguiente de llegar y tenía la hemoglobina baja. Movieron la cirugía cuatro días sin cobrarme el hotel extra. Así sí.",
        quoteEn: "They ran my pre-op tests the day after I arrived and my haemoglobin was low. They moved the surgery four days without charging me for the extra hotel nights. That's how it should be.",
        author: "Rachel Donovan",
        origin: "Chicago, Estados Unidos",
        originEn: "Chicago, United States",
        procedure: "Mamoplastia de aumento",
        procedureEn: "Breast augmentation",
        rating: 5
      },
      {
        quote: "El resultado es muy natural, que era lo que buscaba. Le pongo cuatro estrellas porque la primera semana de inflamación fue más pesada de lo que imaginaba, aunque me lo habían advertido.",
        quoteEn: "The result is very natural, which is what I wanted. Four stars because the first week of swelling was heavier than I imagined, even though they had warned me.",
        author: "Sofía Villalba",
        origin: "Buenos Aires, Argentina",
        originEn: "Buenos Aires, Argentina",
        procedure: "Rinoplastia",
        procedureEn: "Rhinoplasty",
        rating: 4
      }
    ],
    procedureDetails: [
      {
        name: "Lipoescultura de alta definición",
        photo: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=1000",
        nameEn: "High-definition Liposculpture",
        details: {
          whatIs: "Retira la grasa localizada y esculpe el contorno para resaltar la forma natural de tus músculos. Se hace con VASER, un ultrasonido que permite trabajar con más precisión y menos trauma.",
          whatIsEn: "It removes localised fat and sculpts your contour to bring out the natural shape of your muscles. It's done with VASER, an ultrasound that allows more precise work with less trauma.",
          anesthesia: "General o sedación",
          anesthesiaEn: "General or sedation",
          duration: "3 – 5 horas",
          durationEn: "3 – 5 hours",
          hospital: "1 noche",
          hospitalEn: "1 night",
          shortName: "lipo HD",
          shortNameEn: "HD lipo",
          tagline: "Esculpir, no solo reducir.",
          taglineEn: "Sculpt, don't just reduce.",
          hotelText: "Una enfermera te hace los drenajes en la habitación. Caminas desde el primer día.",
          hotelTextEn: "A nurse does your drainage in your room. You walk from day one.",
          concerns: [
            {
              title: "¿Duele?",
              titleEn: "Does it hurt?",
              text: "Durante la cirugía no sientes nada. Después hay una molestia parecida a haber entrenado muy fuerte, que se controla con medicamentos.",
              textEn: "You feel nothing during surgery. Afterwards there's soreness similar to a very hard workout, controlled with medication."
            },
            {
              title: "¿Se notan las cicatrices?",
              titleEn: "Will the scars show?",
              text: "Son incisiones de 3 a 4 mm escondidas en pliegues naturales. Con el tiempo casi no se ven.",
              textEn: "They're 3–4 mm incisions hidden in natural folds. Over time they're barely visible."
            },
            {
              title: "¿Cuánto tiempo sin trabajar?",
              titleEn: "How long off work?",
              text: "Trabajo de oficina desde la semana 3 y ejercicio suave desde la semana 4.",
              textEn: "Office work from week 3 and gentle exercise from week 4."
            },
            {
              title: "¿La grasa vuelve?",
              titleEn: "Does the fat come back?",
              text: "Las células que se retiran no vuelven. Si subes de peso, la grasa se acumula en otras zonas: el resultado depende de mantener tu peso.",
              textEn: "The cells removed don't come back. If you gain weight, fat builds up elsewhere: the result depends on keeping your weight stable."
            },
            {
              title: "¿Cuándo veo el resultado?",
              titleEn: "When will I see the result?",
              text: "Notas el cambio desde la primera semana. La definición final aparece entre los 3 y 6 meses, cuando baja la inflamación.",
              textEn: "You notice the change from the first week. The final definition appears between months 3 and 6, once swelling goes down."
            },
            {
              title: "¿Puedo viajar sin compañía?",
              titleEn: "Can I travel alone?",
              text: "Sí. Una enfermera te hace los drenajes en el hotel y tu cirujano te atiende en tu idioma. Si quieres a alguien contigo en cada cita, sumamos un acompañante bilingüe por un costo adicional.",
              textEn: "Yes. A nurse does your drainage at the hotel and your surgeon sees you in your language. If you'd like someone with you at every appointment, we add a bilingual companion at an extra cost."
            }
          ]
        },
        why: {
          title: "La lipo HD nació en Colombia.",
          titleEn: "HD lipo was born in Colombia.",
          titleStrong: "Aquí te operas y aquí te recuperas.",
          titleStrongEn: "You have surgery here, and you recover here.",
          lead: "La desarrolló un cirujano colombiano. Estas son las razones para hacerla aquí.",
          leadEn: "It was developed by a Colombian surgeon. These are the reasons to have it here.",
          reasons: [
            {
              tab: "La técnica",
              tabEn: "The technique",
              stat: "20+",
              statEn: "20+",
              statLabel: "años de escuela",
              statLabelEn: "years of expertise",
              title: "Te opera la escuela que creó la técnica",
              titleEn: "The school that created the technique operates on you",
              text: "Dos décadas perfeccionando la marcación muscular. No es una técnica importada: es la especialidad de la casa.",
              textEn: "Two decades refining muscle definition. It isn't an imported technique: it's the house specialty.",
              image: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&q=80&w=1200"
            },
            {
              tab: "El cuidado",
              tabEn: "The care",
              stat: "$0",
              statEn: "$0",
              statLabel: "extra por tus drenajes",
              statLabelEn: "extra for your drainage",
              title: "Drenajes incluidos, en tu hotel",
              titleEn: "Drainage included, at your hotel",
              text: "El drenaje linfático posoperatorio es parte de la cultura médica local. Aquí viene incluido; en otros países se paga aparte.",
              textEn: "Post-op lymphatic drainage is part of the local medical culture. Here it's included; elsewhere you pay for it separately.",
              image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=1200"
            },
            {
              tab: "La ciudad",
              tabEn: "The city",
              stat: "22°",
              statEn: "72°F",
              statLabel: "todo el año en Medellín",
              statLabelEn: "year-round in Medellín",
              title: "Clima perfecto para la faja",
              titleEn: "The perfect climate for your garment",
              text: "Medellín está a 22 °C todo el año: usar la faja día y noche no se vuelve un suplicio.",
              textEn: "Medellín sits at 22 °C year-round: wearing the garment day and night never becomes an ordeal.",
              image: "https://images.unsplash.com/photo-1583531352515-8884af319dc1?auto=format&fit=crop&q=80&w=1200"
            }
          ]
        },
        slug: "lipoescultura",
        heroTitle: "Tu lipo HD en Medellín.",
        heroTitleEn: "Your HD lipo in Medellín.",
        heroLead: "Lipoescultura VASER de alta definición con cirujano certificado y drenajes en tu hotel.",
        heroLeadEn: "VASER high-definition liposculpture with a certified surgeon and drainage at your hotel.",
        heroImage: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=80&w=1600",
        heroPosition: "center",
        idealFor: [
          "Grasa localizada que no cede con dieta ni ejercicio",
          "Peso estable, cerca de tu peso ideal",
          "Buena elasticidad de piel"
        ],
        idealForEn: [
          "Localised fat that won't shift with diet or exercise",
          "A stable weight, close to your ideal",
          "Good skin elasticity"
        ],
        faqs: [
          {
            q: "¿La lipoescultura sirve para bajar de peso?",
            qEn: "Does liposculpture help you lose weight?",
            a: "No. Moldea el contorno y retira grasa localizada, pero no reemplaza la pérdida de peso. Si necesitas bajar más de 10 kg, te recomendamos hacerlo antes de operarte.",
            aEn: "No. It shapes your contour and removes localised fat, but it doesn't replace weight loss. If you need to lose more than 10 kg, we recommend doing so before surgery."
          },
          {
            q: "¿Cuánto tiempo debo usar la faja?",
            qEn: "How long do I need to wear the garment?",
            a: "Entre 6 y 8 semanas, las primeras cuatro de día y de noche. Te entregamos la faja en la clínica, medida para ti.",
            aEn: "Between 6 and 8 weeks, the first four day and night. We give you the garment at the clinic, fitted to you."
          }
        ],
        description: "Extracción de grasa con tecnología VASER que marca la anatomía muscular en lugar de solo reducir volumen. Se planifica con marcación de pie y se combina con drenajes linfáticos durante toda tu estadía.",
        descriptionEn: "VASER-assisted fat removal that defines the muscle anatomy instead of just reducing volume. It is planned with standing markings and combined with lymphatic drainage throughout your stay.",
        recovery: "12 - 15 días en Colombia",
        recoveryEn: "12 - 15 days in Colombia",
        sessions: "1 cirugía + 8 drenajes",
        sessionsEn: "1 surgery + 8 drainages",
        priceFrom: "$3,800 USD"
      },
      {
        name: "Rinoplastia ultrasónica",
        photo: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=1000",
        nameEn: "Ultrasonic Rhinoplasty",
        details: {
          whatIs: "Cambia la forma de la nariz: el dorso, la punta, el ancho o la simetría. Con ultrasonido el hueso se modela sin martillo ni cincel, y si tienes el tabique desviado se corrige en la misma cirugía.",
          whatIsEn: "It changes the shape of the nose: the bridge, tip, width or symmetry. With ultrasound the bone is shaped without hammer or chisel, and if your septum is deviated it's corrected in the same surgery.",
          anesthesia: "General",
          anesthesiaEn: "General",
          duration: "2 – 3 horas",
          durationEn: "2 – 3 hours",
          hospital: "Ambulatoria o 1 noche",
          hospitalEn: "Outpatient or 1 night",
          tagline: "Armonía, no una nariz de catálogo.",
          taglineEn: "Harmony, not a catalogue nose.",
          hotelText: "Cabeza elevada y compresas frías los primeros días. El día 7 te retiran la férula.",
          hotelTextEn: "Head raised and cold compresses for the first days. On day 7 the splint comes off.",
          concerns: [
            {
              title: "¿Duele?",
              titleEn: "Does it hurt?",
              text: "Molesta más la congestión que el dolor. Los primeros días respiras por la boca y se controla bien con medicamentos.",
              textEn: "The congestion bothers you more than pain. For the first days you breathe through your mouth, well controlled with medication."
            },
            {
              title: "¿Se va a ver operada?",
              titleEn: "Will it look operated on?",
              text: "No. El plan respeta tus rasgos: buscamos una nariz que armonice con tu cara, no una nariz de catálogo.",
              textEn: "No. The plan respects your features: we aim for a nose that fits your face, not a catalogue nose."
            },
            {
              title: "¿Y los morados?",
              titleEn: "What about bruising?",
              text: "Con técnica ultrasónica son menores. Entre el día 7 y el 10 se disimulan con maquillaje.",
              textEn: "With the ultrasonic technique they're milder. Between days 7 and 10 they can be covered with make-up."
            },
            {
              title: "¿Voy a respirar bien?",
              titleEn: "Will I breathe well?",
              text: "Revisamos el tabique antes de operar y, si está desviado, lo corregimos en la misma cirugía.",
              textEn: "We check the septum before surgery and, if it's deviated, correct it in the same operation."
            },
            {
              title: "¿Se nota la cicatriz?",
              titleEn: "Will the scar show?",
              text: "En la técnica cerrada no queda cicatriz visible. En la abierta es una línea mínima bajo la punta que casi no se nota.",
              textEn: "With the closed technique there's no visible scar. With the open one it's a tiny line under the tip that's barely noticeable."
            },
            {
              title: "¿Cuándo veo el resultado?",
              titleEn: "When will I see the result?",
              text: "Al retirar la férula, el día 7, ya ves el cambio. La punta termina de afinarse entre los 9 y 12 meses.",
              textEn: "When the splint comes off on day 7 you already see the change. The tip finishes refining between months 9 and 12."
            }
          ]
        },
        why: {
          title: "¿Por qué hacerte la rinoplastia en Colombia?",
          titleEn: "Why get rhinoplasty in Colombia?",
          lead: "La rinoplastia es una de las cirugías más pedidas en Colombia. Eso se traduce en cirujanos con mucha práctica en todo tipo de narices, incluidas las latinas.",
          leadEn: "Rhinoplasty is one of the most requested surgeries in Colombia. That means surgeons with a lot of practice on every kind of nose, including Latin noses.",
          reasons: [
            {
              title: "Práctica en tu tipo de nariz",
              titleEn: "Practice with your kind of nose",
              tab: "La práctica",
              tabEn: "The practice",
              image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600",
              text: "Piel gruesa, punta ancha o dorso marcado: son casos de todos los días aquí, no excepciones.",
              textEn: "Thick skin, a wide tip or a strong dorsum: these are everyday cases here, not exceptions."
            },
            {
              title: "Tecnología ultrasónica disponible",
              titleEn: "Ultrasonic technology available",
              tab: "La tecnología",
              tabEn: "The technology",
              image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600",
              text: "El piezoeléctrico, que en otros países cuesta un extra, es el estándar de nuestros cirujanos.",
              textEn: "The piezoelectric device, an extra elsewhere, is standard for our surgeons."
            },
            {
              title: "Vuelves sin que se note",
              titleEn: "You go home without it showing",
              tab: "La discreción",
              tabEn: "Discretion",
              image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=600",
              text: "Te recuperas los primeros 10 días lejos de casa: cuando vuelves, la férula y los morados ya pasaron.",
              textEn: "You recover for the first 10 days away from home: by the time you're back, the splint and bruising are gone."
            }
          ]
        },
        slug: "rinoplastia",
        heroTitle: "Tu rinoplastia en Medellín.",
        heroTitleEn: "Your rhinoplasty in Medellín.",
        heroLead: "Rinoplastia ultrasónica: menos inflamación, menos morados y férula fuera al día 7.",
        heroLeadEn: "Ultrasonic rhinoplasty: less swelling, less bruising and the splint off by day 7.",
        heroImage: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=80&w=1600",
        heroPosition: "center",
        idealFor: [
          "Giba, punta caída o nariz ancha",
          "Asimetrías o secuelas de un golpe",
          "Mayores de 18 años con el crecimiento facial completo"
        ],
        idealForEn: [
          "A dorsal hump, drooping tip or wide nose",
          "Asymmetry or the after-effects of an injury",
          "Over 18, with facial growth complete"
        ],
        description: "El hueso nasal se modela con un piezoeléctrico que corta hueso sin dañar tejido blando. Menos inflamación y menos morados que la técnica tradicional, y la férula se retira a los 7 días.",
        descriptionEn: "The nasal bone is shaped with a piezoelectric device that cuts bone without damaging soft tissue. Less swelling and bruising than the traditional technique, and the splint comes off at day 7.",
        recovery: "8 - 10 días en Colombia",
        recoveryEn: "8 - 10 days in Colombia",
        sessions: "1 cirugía + 2 controles",
        sessionsEn: "1 surgery + 2 check-ups",
        priceFrom: "$3,200 USD"
      },
      {
        name: "Mamoplastia de aumento",
        photo: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=1000",
        nameEn: "Breast Augmentation",
        details: {
          whatIs: "Aumenta el volumen y mejora la forma de los senos con implantes de silicona. Eliges con tu cirujano el tamaño, el perfil y si va sobre o bajo el músculo, según tu cuerpo.",
          whatIsEn: "It increases volume and improves breast shape with silicone implants. With your surgeon you choose the size, profile and whether it goes over or under the muscle, based on your body.",
          anesthesia: "General",
          anesthesiaEn: "General",
          duration: "1 – 2 horas",
          durationEn: "1 – 2 hours",
          hospital: "Ambulatoria o 1 noche",
          hospitalEn: "Outpatient or 1 night",
          tagline: "Volumen, con un resultado natural.",
          taglineEn: "Volume, with a natural result.",
          hotelText: "Brasier quirúrgico día y noche y un control con tu cirujano en la primera semana.",
          hotelTextEn: "Surgical bra day and night and a check-up with your surgeon in the first week.",
          concerns: [
            {
              title: "¿Duele?",
              titleEn: "Does it hurt?",
              text: "Sientes tensión en el pecho los primeros días, controlada con medicamentos. Mejora mucho a partir del tercer día.",
              textEn: "You feel tightness in your chest for the first days, controlled with medication. It improves a lot from day three."
            },
            {
              title: "¿Se va a ver natural?",
              titleEn: "Will it look natural?",
              text: "Eliges tamaño y perfil con probadores según tu cuerpo, y tu cirujano te dice con franqueza si un tamaño no te favorece.",
              textEn: "You choose size and profile with sizers based on your body, and your surgeon tells you frankly if a size won't suit you."
            },
            {
              title: "¿Dónde queda la cicatriz?",
              titleEn: "Where is the scar?",
              text: "En el surco bajo el seno, la areola o la axila, de unos 4 cm. Queda oculta en el brasier o el vestido de baño.",
              textEn: "In the fold under the breast, the areola or the armpit, about 4 cm. It's hidden by a bra or swimsuit."
            },
            {
              title: "¿Podré amamantar?",
              titleEn: "Will I be able to breastfeed?",
              text: "En la mayoría de los casos sí. La vía de colocación se elige para proteger la glándula.",
              textEn: "In most cases, yes. The placement approach is chosen to protect the gland."
            },
            {
              title: "¿Hay que cambiarlos?",
              titleEn: "Do they need replacing?",
              text: "No tienen fecha de vencimiento: solo se cambian si más adelante quieres otro tamaño. Además tienen garantía de fábrica de por vida.",
              textEn: "They have no expiry date: they're only replaced if you later want another size. They also carry a lifetime manufacturer warranty."
            },
            {
              title: "¿Cuánto tiempo sin trabajar?",
              titleEn: "How long off work?",
              text: "Trabajo de oficina desde la semana 1 o 2. Sin ejercicio de brazos ni levantar peso hasta la semana 6.",
              textEn: "Office work from week 1 or 2. No arm exercise or lifting until week 6."
            }
          ]
        },
        why: {
          title: "¿Por qué hacerte la mamoplastia en Colombia?",
          titleEn: "Why get breast augmentation in Colombia?",
          lead: "Pagas menos por el procedimiento, no por el implante: se usan las mismas marcas certificadas que en Estados Unidos y Europa.",
          leadEn: "You pay less for the procedure, not for the implant: the same certified brands used in the United States and Europe.",
          reasons: [
            {
              title: "Mismos implantes, garantía internacional",
              titleEn: "Same implants, international warranty",
              tab: "Los implantes",
              tabEn: "The implants",
              image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=600",
              text: "Implantes de marcas aprobadas internacionalmente, con tarjeta de identificación y garantía válida en tu país.",
              textEn: "Internationally approved implant brands, with an ID card and a warranty valid in your home country."
            },
            {
              title: "Eliges con probadores, no por fotos",
              titleEn: "You choose with sizers, not photos",
              tab: "La elección",
              tabEn: "The choice",
              image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=600",
              text: "En la valoración presencial te pruebas los tamaños con tu cirujano antes de decidir.",
              textEn: "At the in-person consultation you try the sizes on with your surgeon before deciding."
            },
            {
              title: "Precio cerrado desde el inicio",
              titleEn: "A closed price from the start",
              tab: "El precio",
              tabEn: "The price",
              image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600",
              text: "La cotización incluye implantes, cirugía, hospitalización y controles. Sin sorpresas al llegar.",
              textEn: "The quote includes implants, surgery, hospital stay and check-ups. No surprises when you arrive."
            }
          ]
        },
        slug: "mamoplastia-de-aumento",
        heroTitle: "Tu aumento de busto en Medellín.",
        heroTitleEn: "Your breast augmentation in Medellín.",
        heroLead: "Implantes con garantía de por vida, elegidos contigo con probadores en la valoración.",
        heroLeadEn: "Lifetime-warranty implants, chosen with you using sizers at the consultation.",
        heroImage: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=80&w=1600",
        heroPosition: "center",
        idealFor: [
          "Poco volumen natural o pérdida tras embarazo o lactancia",
          "Asimetría entre ambos senos",
          "Buen estado de salud y sin planes de embarazo cercanos"
        ],
        idealForEn: [
          "Little natural volume, or loss after pregnancy or breastfeeding",
          "Asymmetry between the breasts",
          "Good health and no pregnancy planned soon"
        ],
        description: "Implantes de gel cohesivo con garantía de fábrica de por vida. Eliges tamaño y perfil con probadores en la valoración presencial, no solo por fotos, y te entregamos la tarjeta de identificación del implante.",
        descriptionEn: "Cohesive-gel implants with a lifetime manufacturer warranty. You choose size and profile with sizers at the in-person assessment, not just from photos, and we hand you the implant ID card.",
        recovery: "7 - 10 días en Colombia",
        recoveryEn: "7 - 10 days in Colombia",
        sessions: "1 cirugía + 2 controles",
        sessionsEn: "1 surgery + 2 check-ups",
        priceFrom: "$3,500 USD"
      },
      {
        name: "Abdominoplastia",
        photo: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=80&w=1000",
        nameEn: "Tummy Tuck",
        details: {
          whatIs: "Retira el exceso de piel y grasa del abdomen bajo y repara los músculos separados por embarazos o cambios de peso, algo que el ejercicio no puede corregir.",
          whatIsEn: "It removes excess skin and fat from the lower abdomen and repairs muscles separated by pregnancies or weight changes, something exercise can't fix.",
          anesthesia: "General",
          anesthesiaEn: "General",
          duration: "3 – 4 horas",
          durationEn: "3 – 4 hours",
          hospital: "1 – 2 noches",
          hospitalEn: "1 – 2 nights",
          tagline: "La firmeza que el ejercicio no logra.",
          taglineEn: "The firmness exercise can't reach.",
          hotelText: "Enfermera en tu hotel, retiro de drenes y controles. Los primeros días caminas un poco inclinada.",
          hotelTextEn: "A nurse at your hotel, drains removed and check-ups. For the first days you walk slightly bent.",
          concerns: [
            {
              title: "¿Duele?",
              titleEn: "Does it hurt?",
              text: "Es la recuperación más exigente: los primeros días molesta al moverte. Por eso tienes enfermería y medicamentos desde el inicio.",
              textEn: "It's the most demanding recovery: moving is uncomfortable for the first days. That's why you have nursing care and medication from the start."
            },
            {
              title: "¿Cómo queda la cicatriz?",
              titleEn: "What will the scar look like?",
              text: "Es una línea baja, de cadera a cadera, que cubre la ropa interior o el vestido de baño. Se aclara durante el primer año.",
              textEn: "It's a low line, hip to hip, covered by underwear or a swimsuit. It fades over the first year."
            },
            {
              title: "¿Cuánto tiempo sin trabajar?",
              titleEn: "How long off work?",
              text: "Entre 2 y 3 semanas para trabajo de oficina. Sin levantar peso hasta la semana 6.",
              textEn: "2 to 3 weeks for office work. No lifting until week 6."
            },
            {
              title: "¿El ombligo se ve natural?",
              titleEn: "Will my belly button look natural?",
              text: "Sí. Se reubica y se moldea para que se vea natural en el nuevo contorno.",
              textEn: "Yes. It's repositioned and shaped to look natural on the new contour."
            },
            {
              title: "¿Puedo tener hijos después?",
              titleEn: "Can I have children afterwards?",
              text: "Sí, pero un embarazo puede volver a separar los músculos. Lo ideal es operarte cuando ya no planees más embarazos.",
              textEn: "Yes, but a pregnancy can separate the muscles again. Ideally have surgery once you don't plan more pregnancies."
            },
            {
              title: "¿Cuándo veo el resultado?",
              titleEn: "When will I see the result?",
              text: "El abdomen plano se nota de inmediato. La forma final y la cicatriz se asientan entre los 6 y 12 meses.",
              textEn: "The flat abdomen shows immediately. The final shape and scar settle between months 6 and 12."
            }
          ]
        },
        why: {
          title: "¿Por qué hacerte la abdominoplastia en Colombia?",
          titleEn: "Why get a tummy tuck in Colombia?",
          lead: "Es la cirugía con la recuperación más exigente. En Colombia esa recuperación viene acompañada, algo que en casa casi nadie tiene.",
          leadEn: "It's the surgery with the most demanding recovery. In Colombia that recovery comes with support, something almost nobody has at home.",
          reasons: [
            {
              title: "Enfermera en tu hotel",
              titleEn: "A nurse at your hotel",
              tab: "El cuidado",
              tabEn: "The care",
              image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600",
              text: "Drenajes y curaciones en tu habitación durante dos semanas, sin moverte ni pedirle ayuda a nadie.",
              textEn: "Drainage and wound care in your room for two weeks, without moving or asking anyone for help."
            },
            {
              title: "Lipo y abdomen en un solo viaje",
              titleEn: "Lipo and tummy tuck in one trip",
              tab: "Un solo viaje",
              tabEn: "One trip",
              image: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&q=80&w=600",
              text: "Si es seguro para ti, se combinan en una sola cirugía: una anestesia, una recuperación, un viaje.",
              textEn: "If it's safe for you, they're combined in one surgery: one anaesthetic, one recovery, one trip."
            },
            {
              title: "Cirujanos de contorno corporal",
              titleEn: "Body contouring surgeons",
              tab: "Los cirujanos",
              tabEn: "The surgeons",
              image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600",
              text: "Colombia es referente en contorno corporal: tu cirujano hace este procedimiento todas las semanas.",
              textEn: "Colombia is a benchmark in body contouring: your surgeon performs this procedure every week."
            }
          ]
        },
        slug: "abdominoplastia",
        heroTitle: "Tu abdominoplastia en Medellín.",
        heroTitleEn: "Your tummy tuck in Medellín.",
        heroLead: "Retira el exceso de piel y repara la pared abdominal. Dos semanas de recuperación acompañada.",
        heroLeadEn: "Removes excess skin and repairs the abdominal wall. Two weeks of supported recovery.",
        heroImage: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=80&w=1600",
        heroPosition: "center",
        idealFor: [
          "Piel flácida en el abdomen que el ejercicio no corrige",
          "Diástasis abdominal tras embarazos",
          "Peso estable durante al menos 6 meses"
        ],
        idealForEn: [
          "Loose abdominal skin that exercise won't fix",
          "Abdominal separation after pregnancies",
          "A stable weight for at least 6 months"
        ],
        faqs: [
          {
            q: "¿Se puede combinar con lipoescultura?",
            qEn: "Can it be combined with liposculpture?",
            a: "Sí, es la combinación más común. Tu cirujano decide si es seguro hacerlas juntas según tu caso y el tiempo total de cirugía.",
            aEn: "Yes, it's the most common combination. Your surgeon decides whether it's safe to do both together based on your case and total operating time."
          }
        ],
        description: "Retira el exceso de piel y reconstruye la pared abdominal separada por embarazos o cambios de peso. Es la cirugía con la recuperación más exigente del catálogo, por eso la estadía mínima es de dos semanas.",
        descriptionEn: "Removes excess skin and repairs the abdominal wall separated by pregnancies or weight changes. It is the surgery with the most demanding recovery in the catalogue, which is why the minimum stay is two weeks.",
        recovery: "14 - 18 días en Colombia",
        recoveryEn: "14 - 18 days in Colombia",
        sessions: "1 cirugía + 10 drenajes",
        sessionsEn: "1 surgery + 10 drainages",
        priceFrom: "$4,200 USD"
      }
    ],
    doctor: {
      name: "Dr. Santiago Mejía",
      title: "Cirujano Plástico, Estético y Reconstructivo",
      titleEn: "Plastic, Aesthetic and Reconstructive Surgeon",
      registry: "Registro Médico 71.204 · Antioquia",
      yearsExperience: 16,
      credentials: [
        "Especialización en Cirugía Plástica — Universidad de Antioquia",
        "Miembro titular de la Sociedad Colombiana de Cirugía Plástica (SCCP)",
        "Miembro de la International Society of Aesthetic Plastic Surgery (ISAPS)",
        "Más de 2.000 procedimientos de contorno corporal"
      ],
      credentialsEn: [
        "Specialization in Plastic Surgery — Universidad de Antioquia",
        "Full member of the Colombian Society of Plastic Surgery (SCCP)",
        "Member of the International Society of Aesthetic Plastic Surgery (ISAPS)",
        "Over 2,000 body contouring procedures"
      ],
      photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600",
      quote: "Mi trabajo empieza diciendo qué no te voy a hacer. Un buen resultado en cirugía estética es el que se ve natural dentro de cinco años, no el más llamativo la primera semana.",
      quoteEn: "My job starts by telling you what I won't do. A good result in aesthetic surgery is the one that still looks natural in five years, not the most striking one in the first week."
    },
    journey: [
      {
        label: "Antes de viajar",
        photo: "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&q=80&w=1000",
        labelEn: "Before you travel",
        detail: "Valoración virtual con tu cirujano, lista de exámenes que puedes hacerte en tu país y cotización cerrada. Si tu IMC o tu historia clínica no permiten operar con seguridad, te lo decimos antes de que compres el tiquete.",
        detailEn: "Virtual assessment with your surgeon, a list of tests you can take at home and a closed quote. If your BMI or medical history doesn't allow safe surgery, we tell you before you buy a ticket."
      },
      {
        label: "Llegada",
        photo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1000",
        labelEn: "Arrival",
        detail: "Te recogemos en el aeropuerto José María Córdova. Al día siguiente: valoración presencial, exámenes prequirúrgicos y consulta con anestesiología.",
        detailEn: "We pick you up at José María Córdova airport. The next day: in-person assessment, pre-op tests and an anaesthesiology consultation."
      },
      {
        label: "Cirugía y hospitalización",
        photo: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&q=80&w=1000",
        labelEn: "Surgery and hospital stay",
        detail: "Cirugía en quirófano habilitado dentro de clínica, nunca en consultorio. Pasas la primera noche hospitalizada con enfermería y salida al hotel con tu faja y tu kit de medicamentos.",
        detailEn: "Surgery in a licensed operating room inside a clinic, never in an office. You spend the first night in hospital with nursing care and leave for the hotel with your garment and medication kit."
      },
      {
        label: "Recuperación en hotel",
        photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000",
        labelEn: "Recovery at the hotel",
        detail: "Hotel con ascensor y cama alta a menos de 15 minutos de la clínica. Una enfermera va a tu habitación para los drenajes linfáticos y revisa heridas, así no tienes que desplazarte.",
        detailEn: "A hotel with a lift and a raised bed within 15 minutes of the clinic. A nurse comes to your room for lymphatic drainage and wound checks, so you don't have to travel."
      },
      {
        label: "Controles antes del vuelo",
        photo: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000",
        labelEn: "Check-ups before flying",
        detail: "Dos controles con tu cirujano, que te atiende en tu idioma. Solo te damos el visto bueno para volar cuando el cirujano lo firma, con medias de compresión y pauta anticoagulante si aplica.",
        detailEn: "Two check-ups with your surgeon, who sees you in your language. We only clear you to fly once the surgeon signs off, with compression stockings and anticoagulant guidance where needed."
      },
      {
        label: "Al volver a casa",
        photo: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=1000",
        labelEn: "Back home",
        detail: "Controles virtuales al mes, a los 3 y a los 6 meses, con fotos guiadas. Te entregamos la historia clínica y la descripción quirúrgica en tu idioma para tu médico local.",
        detailEn: "Virtual check-ups at one, three and six months with guided photos. We give you the clinical record and the operative report in your language for your local doctor."
      }
    ],
    packageIncludes: [
      "Valoración virtual previa y plan quirúrgico por escrito",
      "Exámenes prequirúrgicos y consulta de anestesiología",
      "Cirugía, anestesia, quirófano y honorarios del equipo",
      "Una noche de hospitalización con enfermería",
      "Faja postquirúrgica, medicamentos y medias de compresión",
      "Drenajes linfáticos en el hotel según el procedimiento",
      "Hospedaje adaptado para recuperación y traslados en todas las citas",
      "Controles virtuales durante 6 meses"
    ],
    packageIncludesEn: [
      "Prior virtual assessment and written surgical plan",
      "Pre-op tests and anaesthesiology consultation",
      "Surgery, anaesthesia, operating room and team fees",
      "One night in hospital with nursing care",
      "Post-surgical garment, medication and compression stockings",
      "Lymphatic drainage at the hotel as the procedure requires",
      "Recovery-friendly accommodation and transfers to every appointment",
      "Virtual check-ups for 6 months"
    ],
    packageExcludes: [
      "Tiquetes aéreos internacionales",
      "Seguro médico de viaje y seguro de complicaciones quirúrgicas (te ayudamos a contratarlos)",
      "Comidas fuera del hotel y gastos personales",
      "Procedimientos adicionales no incluidos en el plan aprobado"
    ],
    packageExcludesEn: [
      "International flights",
      "Travel medical insurance and surgical complications insurance (we help you arrange them)",
      "Meals outside the hotel and personal expenses",
      "Additional procedures not included in the approved plan"
    ],
    cityGuide: {
      city: "Medellín",
      intro: "Una cirugía estética pide reposo real la primera semana: caminatas cortas dentro del hotel, nada de esfuerzo y nada de sol directo sobre las cicatrices. A partir de la segunda semana puedes salir a planes tranquilos, siempre con la faja puesta.",
      introEn: "Aesthetic surgery calls for real rest in the first week: short walks inside the hotel, no exertion and no direct sun on the scars. From the second week you can go out for gentle plans, always wearing your garment.",
      climate: "22 °C todo el año y sin humedad extrema: la faja se lleva cómoda y no hay calor que aumente la inflamación. Evitamos el sol directo, no el clima.",
      climateEn: "22 °C year-round without extreme humidity: the garment is comfortable to wear and there is no heat to worsen swelling. We avoid direct sun, not the weather.",
      activities: [
        {
          name: "Café en la terraza del hotel",
          nameEn: "Coffee on the hotel terrace",
          note: "La primera semana es de reposo, pero con este clima el reposo se disfruta.",
          noteEn: "The first week is for rest, but in this weather rest is a pleasure.",
          when: "Día 3",
          whenEn: "Day 3",
          where: "en tu hotel",
          whereEn: "at your hotel",
          tag: "22 °C afuera",
          tagEn: "22 °C outside",
          tone: "linear-gradient(170deg, #c9b394, #8c7458)"
        },
        {
          name: "Jardín Botánico",
          nameEn: "Botanical Garden",
          note: "Tu primera salida: sombra, caminatas cortas y aire fresco.",
          noteEn: "Your first outing: shade, short walks and fresh air.",
          when: "Día 7",
          whenEn: "Day 7",
          where: "primera salida",
          whereEn: "first outing",
          tag: "Senderos planos",
          tagEn: "Flat paths",
          tone: "linear-gradient(170deg, #9fbf97, #5d7f57)"
        },
        {
          name: "Plaza Botero",
          nameEn: "Botero Square",
          note: "El Museo de Antioquia, sin escaleras largas y con tu acompañante.",
          noteEn: "The Museum of Antioquia, without long stairs and with your companion.",
          when: "Semana 2",
          whenEn: "Week 2",
          tag: "Bajo techo",
          tagEn: "Indoors",
          tone: "linear-gradient(170deg, #b8a58a, #6f6252)"
        },
        {
          name: "Parque Arví",
          nameEn: "Parque Arví",
          note: "Subes sentada sobre el bosque. Así cierras tu viaje.",
          noteEn: "You ride seated above the forest. That's how you close your trip.",
          when: "Antes de volar",
          whenEn: "Before you fly",
          tag: "En metrocable",
          tagEn: "By cable car",
          tone: "linear-gradient(170deg, #93b8ae, #4f7d72)"
        }
      ]
    },
    preOpQuestions: [
      "¿Mi cirujano es miembro de la Sociedad Colombiana de Cirugía Plástica y puedo verificarlo?",
      "¿La cirugía se hace en una clínica habilitada o en un consultorio?",
      "¿Qué marca de implantes o qué tecnología se usa y qué garantía tiene?",
      "¿Cuántos días debo esperar antes de volar y quién firma el permiso?",
      "¿Quién me atiende si tengo fiebre o dolor fuerte durante la noche?",
      "¿Qué cubre la garantía si necesito un retoque?"
    ],
    preOpQuestionsEn: [
      "Is my surgeon a member of the Colombian Society of Plastic Surgery, and can I verify it?",
      "Is the surgery performed in a licensed clinic or in a private office?",
      "Which implant brand or technology is used, and what warranty does it carry?",
      "How many days must I wait before flying, and who signs the clearance?",
      "Who attends me if I have a fever or severe pain during the night?",
      "What does the warranty cover if I need a touch-up?"
    ],
    clinicDetails: [
      {
        name: "Clínica El Tesoro (Medellín)",
        note: "Quirófanos habilitados, unidad de cuidados intermedios y hospitalización en el mismo edificio. Es la sede donde opera el Dr. Mejía.",
        noteEn: "Licensed operating rooms, an intermediate care unit and inpatient beds in the same building. This is where Dr. Mejía operates."
      },
      {
        name: "Clínica del Country (Bogotá)",
        note: "Alternativa para quienes llegan por El Dorado. Hospital de alta complejidad con el mismo protocolo de seguridad quirúrgica.",
        noteEn: "An alternative for those arriving through El Dorado. A high-complexity hospital with the same surgical safety protocol."
      }
    ],
    faqs: [
      {
        q: "¿Cuántos días debo quedarme en Colombia?",
        qEn: "How many days do I need to stay in Colombia?",
        a: "Entre 8 y 18 días según el procedimiento: una rinoplastia o un aumento mamario piden alrededor de 10, una lipoescultura entre 12 y 15, y una abdominoplastia al menos 14. No acortamos esos tiempos: antes de volar necesitas tus controles presenciales con el cirujano.",
        aEn: "Between 8 and 18 days depending on the procedure: a rhinoplasty or breast augmentation needs around 10, a liposculpture 12 to 15, and a tummy tuck at least 14. We don't shorten these times: before flying you need your in-person check-ups with the surgeon."
      },
      {
        q: "¿El precio que me dan incluye todo?",
        qEn: "Does the price I'm quoted include everything?",
        a: "Incluye todo lo médico y toda la logística en Colombia: exámenes, cirugía, anestesia, hospitalización, faja, medicamentos, drenajes, hospedaje, traslados y seguimiento. No incluye tiquetes, seguros, gastos personales ni el acompañante bilingüe, que es opcional.",
        aEn: "It includes everything medical and all logistics in Colombia: tests, surgery, anaesthesia, hospital stay, garment, medication, drainage, accommodation, transfers and follow-up. It does not include flights, insurance, personal expenses or the bilingual companion, which is optional."
      },
      {
        q: "¿Puedo combinar varios procedimientos en una sola cirugía?",
        qEn: "Can I combine several procedures in one surgery?",
        a: "A veces sí, pero con límites. Tu cirujano decide según el tiempo quirúrgico total y tu estado de salud; por seguridad no superamos las seis horas de quirófano. Si no es prudente combinarlos, te proponemos dos tiempos quirúrgicos.",
        aEn: "Sometimes, but within limits. Your surgeon decides based on total operating time and your health; for safety we never exceed six hours in theatre. If combining them isn't prudent, we propose two separate surgeries."
      },
      {
        q: "¿Qué pasa si tengo una complicación cuando ya volví a mi país?",
        qEn: "What happens if I have a complication once I'm back home?",
        a: "Tienes un canal directo con nosotros y controles virtuales durante 6 meses. Te entregamos la descripción quirúrgica completa para que cualquier médico local pueda intervenir. Te recomendamos contratar un seguro de complicaciones quirúrgicas antes de viajar y te ayudamos a hacerlo.",
        aEn: "You have a direct channel to us and virtual check-ups for 6 months. We give you the full operative report so any local doctor can step in. We recommend taking out surgical complications insurance before travelling, and we help you do it."
      },
      {
        q: "¿Quién me va a operar y puedo verificar sus credenciales?",
        qEn: "Who will operate on me, and can I verify their credentials?",
        a: "Sabes el nombre de tu cirujano antes de reservar. Te damos su registro médico para que lo consultes en el ReTHUS del Ministerio de Salud y puedes confirmar su membresía en la Sociedad Colombiana de Cirugía Plástica.",
        aEn: "You know your surgeon's name before booking. We give you their medical registry number to check in the Ministry of Health's ReTHUS registry, and you can confirm their membership of the Colombian Society of Plastic Surgery."
      },
      {
        q: "¿Puedo viajar sin compañía?",
        qEn: "Can I travel alone?",
        a: "Sí. La enfermería en el hotel cubre lo que normalmente haría un familiar los primeros días, y tu cirujano te atiende en tu idioma. Si quieres a alguien contigo en cada cita, sumamos un acompañante bilingüe por un costo adicional. Si prefieres venir con alguien, la habitación doble no tiene costo extra.",
        aEn: "Yes. Nursing at the hotel covers what a relative would normally do in the first days, and your surgeon sees you in your language. If you'd like someone with you at every appointment, we add a bilingual companion at an extra cost. If you prefer to come with someone, the double room carries no extra cost."
      }
    ],
    testimonial: {
      quote: "Lo que me dio confianza fue que el cirujano me dijo que no a una parte de lo que yo quería. Me explicó por qué con mi piel no iba a quedar bien y ajustamos el plan. La enfermera fue al hotel todos los días y nunca me sentí sola.",
      quoteEn: "What gave me confidence was that the surgeon said no to part of what I wanted. He explained why it wouldn't look right with my skin and we adjusted the plan. The nurse came to the hotel every day and I never felt alone.",
      author: "Jennifer Castaño",
      origin: "Orlando, Estados Unidos · Lipoescultura",
      originEn: "Orlando, United States · Liposculpture"
    }
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
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800",
    heroImage: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=80&w=1600",
    heroPosition: "center",
    heroTitle: "Tu nueva sonrisa en Medellín.",
    heroTitleEn: "Your new smile in Medellín.",
    heroLead: "Diseño digital, implantes y carillas con especialistas certificados. Tú solo llegas.",
    heroLeadEn: "Digital design, implants and veneers with certified specialists. You just show up.",
    why: {
      title: "¿Por qué tratarte los dientes en Colombia?",
      titleEn: "Why get dental work in Colombia?",
      lead: "Odontólogos especialistas, laboratorios dentales dentro de la clínica y tratamientos que se resuelven en días, no en meses.",
      leadEn: "Specialist dentists, in-house dental laboratories and treatments done in days, not months.",
      reasons: [
        {
          title: "Laboratorio en la misma clínica",
          titleEn: "An in-house laboratory",
          tab: "El laboratorio",
          tabEn: "The laboratory",
          image: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=600",
          text: "Tus carillas o coronas se fabrican a pasos del consultorio, por eso todo cabe en una semana.",
          textEn: "Your veneers or crowns are made steps from the chair, which is why it all fits in a week."
        },
        {
          title: "Marcas internacionales",
          titleEn: "International brands",
          tab: "Los materiales",
          tabEn: "The materials",
          image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600",
          text: "Implantes y porcelanas de las mismas marcas que usa tu odontólogo en casa.",
          textEn: "Implants and porcelain from the same brands your dentist uses at home."
        },
        {
          title: "Un viaje corto y liviano",
          titleEn: "A short, easy trip",
          tab: "El viaje",
          tabEn: "The trip",
          image: "https://images.unsplash.com/photo-1583531352515-8884af319dc1?auto=format&fit=crop&q=80&w=600",
          text: "Es la recuperación más fácil del turismo médico: desde el día siguiente puedes salir a conocer.",
          textEn: "It's the easiest recovery in medical tourism: from the next day you can go out and explore."
        }
      ]
    },
    // ⚠️ DATOS DE MUESTRA — como todo este archivo (mock data engine).
    // Precios, nombre y registro del especialista, clínicas y testimonio
    // deben reemplazarse por información verificable antes de publicar.
    priceFrom: "$180 USD",
    // beforeAfter: la página trae un comparador deslizable listo para usarse.
    // Se queda sin renderizar a propósito hasta que existan pares reales de la
    // clínica: mismo paciente, mismo encuadre, misma luz y con consentimiento
    // escrito. Ver la interfaz BeforeAfter arriba.
    // ⚠️ RESEÑAS DE MUESTRA — reemplazar por reseñas verificables
    // (Google, Doctoralia o las propias) antes de publicar.
    reviews: [
      {
        quote: "Llegué con miedo de que me cobraran de más al llegar, que es lo que uno escucha. Me pasó lo contrario: el precio fue el mismo del correo, la doctora me mostró el diseño tres veces hasta que quedé conforme, y todo me lo explicaron en inglés sin problema.",
        quoteEn: "I arrived afraid of being overcharged on the spot, which is what you hear. The opposite happened: the price matched the email, the dentist showed me the design three times until I was happy, and everything was explained to me in English with no trouble.",
        author: "Marcela Ortiz",
        origin: "Miami, Estados Unidos",
        originEn: "Miami, United States",
        procedure: "Diseño de sonrisa",
        procedureEn: "Smile design",
        rating: 5
      },
      {
        quote: "Me hicieron la valoración virtual y me dijeron que esperara tres meses por una infección de encía. Podían haberme vendido el viaje de una. Volví en marzo y todo salió perfecto.",
        quoteEn: "They did the virtual assessment and told me to wait three months because of a gum infection. They could have just sold me the trip. I came back in March and everything went perfectly.",
        author: "Daniel Restrepo",
        origin: "Toronto, Canadá",
        originEn: "Toronto, Canada",
        procedure: "Implantes",
        procedureEn: "Implants",
        rating: 5
      },
      {
        quote: "Lo que más me sirvió fue el informe clínico en inglés al final. Mi odontólogo acá lo leyó sin problema y me hizo el control de los seis meses.",
        quoteEn: "What helped most was the clinical report in English at the end. My dentist here read it without any trouble and did my six-month check-up.",
        author: "Karen Whitfield",
        origin: "Houston, Estados Unidos",
        originEn: "Houston, United States",
        procedure: "Carillas de porcelana",
        procedureEn: "Porcelain veneers",
        rating: 5
      },
      {
        quote: "El hotel quedaba a diez minutos de la clínica y eso lo agradecí muchísimo los primeros días. Una estrella menos porque el primer traslado se demoró casi una hora.",
        quoteEn: "The hotel was ten minutes from the clinic and I was very grateful for that in the first days. One star off because the first transfer took nearly an hour.",
        author: "Luis Fernando Gómez",
        origin: "Ciudad de México, México",
        originEn: "Mexico City, Mexico",
        procedure: "Rehabilitación oral",
        procedureEn: "Oral rehabilitation",
        rating: 4
      },
      {
        quote: "Pedí el registro médico del odontólogo y me lo mandaron el mismo día, sin rodeos. Eso fue lo que me hizo decidirme.",
        quoteEn: "I asked for the dentist's medical registry number and they sent it the same day, no fuss. That is what made me decide.",
        author: "Ana Lucía Mejía",
        origin: "Madrid, España",
        originEn: "Madrid, Spain",
        procedure: "Blanqueamiento",
        procedureEn: "Whitening",
        rating: 5
      }
    ],
    procedureDetails: [
      {
        name: "Diseño de sonrisa digital",
        photo: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1000",
        nameEn: "Digital Smile Design",
        description: "Planificamos tu sonrisa en software 3D antes de tocar un solo diente: ves el resultado simulado y lo apruebas tú. Luego se fabrican las carillas con fresado CAD/CAM sobre ese diseño exacto.",
        descriptionEn: "We plan your smile in 3D software before touching a single tooth: you see the simulated result and approve it yourself. The veneers are then milled with CAD/CAM against that exact design.",
        recovery: "5 - 7 días en Colombia",
        recoveryEn: "5 - 7 days in Colombia",
        sessions: "2 citas",
        sessionsEn: "2 appointments",
        priceFrom: "$3,200 USD",
        slug: "diseno-de-sonrisa",
        heroTitle: "Tu diseño de sonrisa en Medellín.",
        heroTitleEn: "Your smile design in Medellín.",
        heroLead: "Ves tu nueva sonrisa en 3D y la apruebas antes de que toquemos un solo diente.",
        heroLeadEn: "You see your new smile in 3D and approve it before we touch a single tooth.",
        idealFor: [
          "Dientes manchados, desgastados o de distinto tamaño",
          "Espacios pequeños o forma irregular",
          "Encías sanas, o tratadas antes del viaje"
        ],
        idealForEn: [
          "Stained, worn or uneven teeth",
          "Small gaps or irregular shape",
          "Healthy gums, or treated before the trip"
        ],
        details: {
          question: "¿Qué es el diseño de sonrisa?",
          questionEn: "What is smile design?",
          whatIs: "Planeamos tu nueva sonrisa en un software 3D antes de tocar un solo diente. Ves la simulación, la ajustas con tu especialista y, cuando la apruebas, se fabrican las carillas sobre ese diseño exacto.",
          whatIsEn: "We plan your new smile in 3D software before touching a single tooth. You see the simulation, adjust it with your specialist and, once you approve it, the veneers are made to that exact design.",
          anesthesia: "Local",
          anesthesiaEn: "Local",
          duration: "2 – 3 horas",
          durationEn: "2 – 3 hours",
          hospital: "Ambulatorio",
          hospitalEn: "Outpatient",
          shortName: "diseño de sonrisa",
          shortNameEn: "smile design",
          tagline: "La ves antes de hacerla.",
          taglineEn: "You see it before it's made.",
          hotelText: "Entre la primera y la segunda cita el laboratorio fabrica tus carillas. Tú aprovechas para conocer la ciudad.",
          hotelTextEn: "Between the first and second appointment the lab makes your veneers. You make the most of it to see the city.",
          concerns: [
            {
              title: "¿Duele?",
              titleEn: "Does it hurt?",
              text: "Con anestesia local no sientes dolor. Después puede haber algo de sensibilidad unos días.",
              textEn: "With local anaesthetic you feel no pain. Afterwards there may be some sensitivity for a few days."
            },
            {
              title: "¿Se va a ver natural?",
              titleEn: "Will it look natural?",
              text: "Forma, tamaño y color se diseñan según tu cara, y tú apruebas la simulación antes de fabricar nada.",
              textEn: "Shape, size and colour are designed around your face, and you approve the simulation before anything is made."
            },
            {
              title: "¿Me desgastan los dientes?",
              titleEn: "Will my teeth be filed down?",
              text: "Depende de tu caso. En muchos el desgaste es mínimo; tu especialista te lo explica en la valoración.",
              textEn: "It depends on your case. In many it's minimal; your specialist explains it at the assessment."
            },
            {
              title: "¿Y si no me gusta el diseño?",
              titleEn: "What if I don't like the design?",
              text: "Se rediseña las veces que haga falta antes de fabricar. Es el único paso donde no hay prisa.",
              textEn: "It's redesigned as many times as needed before anything is made. It's the one step with no rush."
            },
            {
              title: "¿Puedo comer normal?",
              titleEn: "Can I eat normally?",
              text: "Los primeros días, comida blanda. Después comes normal, sin morder cosas muy duras como hielo.",
              textEn: "Soft food for the first days. After that you eat normally, just don't bite very hard things like ice."
            },
            {
              title: "¿Cuánto duran?",
              titleEn: "How long do they last?",
              text: "Las carillas de porcelana bien cuidadas duran muchos años. Solo necesitas tus controles con tu odontólogo.",
              textEn: "Well-cared-for porcelain veneers last many years. You just need your check-ups with your dentist."
            }
          ]
        },
        why: {
          title: "Tu sonrisa, diseñada en Colombia.",
          titleEn: "Your smile, designed in Colombia.",
          titleStrong: "Y lista en una semana.",
          titleStrongEn: "And ready in a week.",
          lead: "Diseño digital, laboratorio en la misma clínica y una recuperación que te deja salir desde el día siguiente.",
          leadEn: "Digital design, an in-house lab and a recovery that lets you go out from the next day.",
          reasons: [
            {
              tab: "El diseño",
              tabEn: "The design",
              title: "Apruebas el resultado antes de empezar",
              titleEn: "You approve the result before starting",
              text: "Ves tu sonrisa simulada en la pantalla y la ajustas con tu especialista hasta que te guste.",
              textEn: "You see your simulated smile on screen and adjust it with your specialist until you like it.",
              image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1200",
              stat: "3D",
              statEn: "3D",
              statLabel: "antes de tocar un diente",
              statLabelEn: "before touching a tooth"
            },
            {
              tab: "El laboratorio",
              tabEn: "The lab",
              title: "Laboratorio a pasos del consultorio",
              titleEn: "A lab steps from the chair",
              text: "Tus carillas se fabrican en la misma clínica, por eso todo cabe en un solo viaje.",
              textEn: "Your veneers are made at the same clinic, which is why it all fits in one trip.",
              image: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=1200",
              stat: "1",
              statEn: "1",
              statLabel: "semana, de principio a fin",
              statLabelEn: "week, start to finish"
            },
            {
              tab: "La ciudad",
              tabEn: "The city",
              title: "Una recuperación para salir a conocer",
              titleEn: "A recovery that lets you go out",
              text: "No hay reposo: entre citas conoces la ciudad con tu acompañante.",
              textEn: "No bed rest: between appointments you explore the city with your companion.",
              image: "https://images.unsplash.com/photo-1583531352515-8884af319dc1?auto=format&fit=crop&q=80&w=1200",
              stat: "22°",
              statEn: "72°F",
              statLabel: "todo el año en Medellín",
              statLabelEn: "year-round in Medellín"
            }
          ]
        }
      },
      {
        name: "Implantes de carga inmediata",
        photo: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=80&w=1000",
        nameEn: "Immediate Load Implants",
        description: "El implante de titanio y la corona provisional se colocan en la misma cita, así no vuelves a casa con el espacio vacío. La corona definitiva se instala en la segunda visita o se envía a tu odontólogo local.",
        descriptionEn: "The titanium implant and the temporary crown are placed in the same appointment, so you don't fly home with a gap. The final crown is fitted on a second visit or sent to your local dentist.",
        recovery: "3 - 5 días en Colombia",
        recoveryEn: "3 - 5 days in Colombia",
        sessions: "1 - 2 citas",
        sessionsEn: "1 - 2 appointments",
        priceFrom: "$950 USD",
        slug: "implantes-dentales",
        heroTitle: "Tus implantes dentales en Medellín.",
        heroTitleEn: "Your dental implants in Medellín.",
        heroLead: "Implante y corona provisional en la misma cita: no vuelves a casa con el espacio vacío.",
        heroLeadEn: "Implant and temporary crown in the same appointment: you don't fly home with a gap.",
        idealFor: [
          "Uno o varios dientes perdidos",
          "Hueso suficiente, confirmado en la valoración",
          "No fumar, o poder dejarlo unas semanas"
        ],
        idealForEn: [
          "One or more missing teeth",
          "Enough bone, confirmed at the assessment",
          "Not smoking, or able to stop for a few weeks"
        ],
        details: {
          question: "¿Qué es un implante de carga inmediata?",
          questionEn: "What is an immediate-load implant?",
          whatIs: "Un tornillo de titanio reemplaza la raíz del diente perdido y, en la misma cita, se le coloca una corona provisional. La corona definitiva llega cuando el hueso se integra.",
          whatIsEn: "A titanium post replaces the root of the missing tooth and, in the same appointment, a temporary crown is fitted. The final crown comes once the bone has integrated.",
          anesthesia: "Local",
          anesthesiaEn: "Local",
          duration: "1 – 2 horas",
          durationEn: "1 – 2 hours",
          hospital: "Ambulatorio",
          hospitalEn: "Outpatient",
          shortName: "carga inmediata",
          shortNameEn: "immediate load",
          tagline: "Sales con diente el mismo día.",
          taglineEn: "You leave with a tooth the same day.",
          hotelText: "Comida blanda y fría los primeros días y un control antes de volar para revisar la encía.",
          hotelTextEn: "Soft, cold food for the first days and a check-up before flying to look at the gum.",
          concerns: [
            {
              title: "¿Duele?",
              titleEn: "Does it hurt?",
              text: "Con anestesia local no sientes dolor. Después, una molestia parecida a la de una extracción, que se controla con medicamentos.",
              textEn: "With local anaesthetic you feel no pain. Afterwards, soreness similar to an extraction, controlled with medication."
            },
            {
              title: "¿Se nota que es un implante?",
              titleEn: "Will it look like an implant?",
              text: "No. La corona se hace del color y la forma de tus dientes.",
              textEn: "No. The crown is made in the colour and shape of your teeth."
            },
            {
              title: "¿Cuándo me ponen la corona definitiva?",
              titleEn: "When do I get the final crown?",
              text: "Cuando el hueso se integra al implante. Se instala en una segunda visita o se envía a tu odontólogo local.",
              textEn: "Once the bone integrates with the implant. It's fitted on a second visit or sent to your local dentist."
            },
            {
              title: "¿Todos pueden ponerse implantes?",
              titleEn: "Can anyone get implants?",
              text: "Se necesita hueso suficiente. Lo revisamos con tus radiografías en la valoración virtual, antes de que viajes.",
              textEn: "You need enough bone. We check it on your X-rays at the virtual assessment, before you travel."
            },
            {
              title: "¿Puedo volar después?",
              titleEn: "Can I fly afterwards?",
              text: "Sí. Solo pedimos 48 horas entre la última cita y el vuelo, para revisarte antes de salir.",
              textEn: "Yes. We just ask for 48 hours between the last appointment and the flight, to check you before you leave."
            },
            {
              title: "¿Cuánto dura un implante?",
              titleEn: "How long does an implant last?",
              text: "Bien cuidado, puede durar toda la vida. Solo necesitas tus controles y buena higiene.",
              textEn: "Well cared for, it can last a lifetime. You just need your check-ups and good hygiene."
            }
          ]
        },
        why: {
          title: "¿Por qué ponerte implantes en Colombia?",
          titleEn: "Why get implants in Colombia?",
          lead: "Mismas marcas de implantes que en tu país, en un viaje corto y con la corona provisional desde el primer día.",
          leadEn: "The same implant brands as at home, in a short trip and with a temporary crown from day one.",
          reasons: [
            {
              tab: "El mismo día",
              tabEn: "Same day",
              title: "No vuelves con el espacio vacío",
              titleEn: "You don't go home with a gap",
              text: "El implante y la corona provisional se colocan en la misma cita.",
              textEn: "The implant and the temporary crown go in at the same appointment.",
              image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=80&w=1200",
              stat: "1",
              statEn: "1",
              statLabel: "cita: implante y corona",
              statLabelEn: "appointment: implant and crown"
            },
            {
              tab: "Los materiales",
              tabEn: "The materials",
              title: "Marcas internacionales",
              titleEn: "International brands",
              text: "Implantes de titanio de las mismas marcas que usa tu odontólogo en casa.",
              textEn: "Titanium implants from the same brands your dentist uses at home.",
              image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1200"
            },
            {
              tab: "La ciudad",
              tabEn: "The city",
              title: "Te recuperas paseando",
              titleEn: "You recover while exploring",
              text: "Desde el día siguiente puedes salir: solo cuidas la comida los primeros días.",
              textEn: "From the next day you can go out: you only watch what you eat for the first days.",
              image: "https://images.unsplash.com/photo-1583531352515-8884af319dc1?auto=format&fit=crop&q=80&w=1200",
              stat: "22°",
              statEn: "72°F",
              statLabel: "todo el año en Medellín",
              statLabelEn: "year-round in Medellín"
            }
          ]
        }
      },
      {
        name: "Carillas de porcelana",
        photo: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=1000",
        nameEn: "Porcelain Veneers",
        description: "Láminas de porcelana feldespática o disilicato de litio adheridas a la cara visible del diente. Corrigen color, forma y pequeños desalineamientos sin ortodoncia previa.",
        descriptionEn: "Feldspathic or lithium-disilicate porcelain shells bonded to the visible face of the tooth. They correct colour, shape and minor misalignment without prior orthodontics.",
        recovery: "4 - 5 días en Colombia",
        recoveryEn: "4 - 5 days in Colombia",
        sessions: "2 citas",
        sessionsEn: "2 appointments",
        priceFrom: "$320 USD por unidad",
        slug: "carillas-de-porcelana",
        heroTitle: "Tus carillas de porcelana en Medellín.",
        heroTitleEn: "Your porcelain veneers in Medellín.",
        heroLead: "Color, forma y tamaño corregidos en dos citas, con laboratorio en la misma clínica.",
        heroLeadEn: "Colour, shape and size corrected in two appointments, with an in-house lab.",
        idealFor: [
          "Dientes manchados que el blanqueamiento no aclara",
          "Dientes desgastados, astillados o de distinto tamaño",
          "Pequeños desalineamientos, sin ortodoncia"
        ],
        idealForEn: [
          "Stains whitening can't lift",
          "Worn, chipped or uneven teeth",
          "Minor misalignment, without braces"
        ],
        details: {
          question: "¿Qué son las carillas de porcelana?",
          questionEn: "What are porcelain veneers?",
          whatIs: "Láminas finas de porcelana que se adhieren a la cara visible del diente. Corrigen color, forma y pequeños desalineamientos sin necesidad de ortodoncia.",
          whatIsEn: "Thin porcelain shells bonded to the visible face of the tooth. They correct colour, shape and minor misalignment without braces.",
          anesthesia: "Local",
          anesthesiaEn: "Local",
          duration: "1 – 3 horas",
          durationEn: "1 – 3 hours",
          hospital: "Ambulatorio",
          hospitalEn: "Outpatient",
          shortName: "carillas",
          shortNameEn: "veneers",
          tagline: "Color y forma, sin ortodoncia.",
          taglineEn: "Colour and shape, without braces.",
          hotelText: "Mientras el laboratorio fabrica tus carillas usas unas provisionales. Puedes salir a conocer la ciudad.",
          hotelTextEn: "While the lab makes your veneers you wear temporaries. You can go out and see the city.",
          concerns: [
            {
              title: "¿Duele?",
              titleEn: "Does it hurt?",
              text: "No. Se trabaja con anestesia local y después solo puede haber algo de sensibilidad.",
              textEn: "No. It's done under local anaesthetic and afterwards there may just be some sensitivity."
            },
            {
              title: "¿Se ven falsas?",
              titleEn: "Will they look fake?",
              text: "No. Se eligen tono y translucidez para que parezcan tus propios dientes.",
              textEn: "No. Shade and translucency are chosen so they look like your own teeth."
            },
            {
              title: "¿Cuántas necesito?",
              titleEn: "How many do I need?",
              text: "Las que se ven al sonreír. Tu especialista te lo define en la valoración virtual, antes de viajar.",
              textEn: "The ones that show when you smile. Your specialist decides at the virtual assessment, before you travel."
            },
            {
              title: "¿Se manchan?",
              titleEn: "Do they stain?",
              text: "La porcelana resiste mucho mejor que el diente natural al café, el té o el vino.",
              textEn: "Porcelain resists coffee, tea and wine much better than natural enamel."
            },
            {
              title: "¿Puedo morder normal?",
              titleEn: "Can I bite normally?",
              text: "Sí. Solo evita morder cosas muy duras, como hielo o lapiceros.",
              textEn: "Yes. Just avoid biting very hard things like ice or pens."
            },
            {
              title: "¿Cuánto duran?",
              titleEn: "How long do they last?",
              text: "Bien cuidadas, muchos años. Solo necesitas tus controles con tu odontólogo.",
              textEn: "Well cared for, many years. You just need your check-ups with your dentist."
            }
          ]
        },
        why: {
          title: "¿Por qué hacerte carillas en Colombia?",
          titleEn: "Why get veneers in Colombia?",
          lead: "Porcelana de las mismas marcas que en tu país, fabricada a pasos del consultorio.",
          leadEn: "Porcelain from the same brands as at home, made steps from the chair.",
          reasons: [
            {
              tab: "El laboratorio",
              tabEn: "The lab",
              title: "Todo en un solo viaje",
              titleEn: "All in one trip",
              text: "El laboratorio está en la misma clínica: escaneo, fabricación y cementado en días.",
              textEn: "The lab is at the same clinic: scan, making and fitting in days.",
              image: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=1200",
              stat: "1",
              statEn: "1",
              statLabel: "semana, del escaneo a la carilla",
              statLabelEn: "week, from scan to veneer"
            },
            {
              tab: "Los materiales",
              tabEn: "The materials",
              title: "Porcelana de marcas internacionales",
              titleEn: "Porcelain from international brands",
              text: "Las mismas porcelanas que usa tu odontólogo en casa.",
              textEn: "The same porcelain your dentist uses at home.",
              image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=1200"
            },
            {
              tab: "La ciudad",
              tabEn: "The city",
              title: "Entre citas, la ciudad",
              titleEn: "Between appointments, the city",
              text: "Mientras esperas tus carillas puedes salir a conocer.",
              textEn: "While you wait for your veneers you can go out and explore.",
              image: "https://images.unsplash.com/photo-1583531352515-8884af319dc1?auto=format&fit=crop&q=80&w=1200",
              stat: "22°",
              statEn: "72°F",
              statLabel: "todo el año en Medellín",
              statLabelEn: "year-round in Medellín"
            }
          ]
        }
      },
      {
        name: "Blanqueamiento láser",
        photo: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1000",
        nameEn: "Laser Teeth Whitening",
        description: "Una sola sesión en consultorio con activación por luz LED, más férulas personalizadas para mantenimiento en casa. Es el procedimiento más corto: se puede hacer el mismo día de llegada.",
        descriptionEn: "A single in-office session with LED activation, plus custom trays for maintenance at home. It's the shortest procedure: it can be done on your arrival day.",
        recovery: "Mismo día",
        recoveryEn: "Same day",
        sessions: "1 cita",
        sessionsEn: "1 appointment",
        priceFrom: "$180 USD",
        slug: "blanqueamiento-dental",
        heroTitle: "Tu blanqueamiento dental en Medellín.",
        heroTitleEn: "Your teeth whitening in Medellín.",
        heroLead: "Una sola cita, el mismo día que llegas, y férulas para mantenerlo en casa.",
        heroLeadEn: "A single appointment, the day you arrive, and trays to keep it up at home.",
        idealFor: [
          "Dientes amarillos o manchados por café, té o vino",
          "Dientes sanos, sin caries ni sensibilidad fuerte",
          "Sin carillas ni coronas en los dientes de adelante"
        ],
        idealForEn: [
          "Teeth yellowed by coffee, tea or wine",
          "Healthy teeth, no decay or strong sensitivity",
          "No veneers or crowns on the front teeth"
        ],
        details: {
          question: "¿Qué es el blanqueamiento láser?",
          questionEn: "What is laser whitening?",
          whatIs: "Un gel profesional se activa con luz LED en el consultorio y aclara el tono de tus dientes en una sola sesión. Te llevas férulas a tu medida para mantenerlo en casa.",
          whatIsEn: "A professional gel is activated with LED light in the clinic and lightens your teeth in a single session. You take home custom trays to keep it up.",
          anesthesia: "Sin anestesia",
          anesthesiaEn: "No anaesthetic",
          duration: "1 – 1,5 horas",
          durationEn: "1 – 1.5 hours",
          hospital: "Ambulatorio",
          hospitalEn: "Outpatient",
          shortName: "blanqueamiento",
          shortNameEn: "whitening",
          tagline: "Varios tonos más claro, en una cita.",
          taglineEn: "Several shades lighter, in one appointment.",
          concerns: [
            {
              title: "¿Duele?",
              titleEn: "Does it hurt?",
              text: "No. Puede haber sensibilidad las primeras 24 a 48 horas.",
              textEn: "No. There may be sensitivity for the first 24 to 48 hours."
            },
            {
              title: "¿Cuántos tonos aclara?",
              titleEn: "How many shades lighter?",
              text: "Depende de tus dientes. En la valoración te damos un estimado realista.",
              textEn: "It depends on your teeth. At the assessment we give you a realistic estimate."
            },
            {
              title: "¿Daña el esmalte?",
              titleEn: "Does it damage the enamel?",
              text: "No, cuando lo hace un odontólogo con producto profesional y protegiendo tus encías.",
              textEn: "No, when a dentist does it with professional product and protects your gums."
            },
            {
              title: "¿Qué no puedo comer después?",
              titleEn: "What can't I eat afterwards?",
              text: "Durante 48 horas, nada de café, vino tinto ni salsas oscuras.",
              textEn: "For 48 hours, no coffee, red wine or dark sauces."
            },
            {
              title: "¿Blanquea carillas o coronas?",
              titleEn: "Does it whiten veneers or crowns?",
              text: "No, solo el diente natural. Si tienes restauraciones adelante, te lo decimos antes.",
              textEn: "No, only natural teeth. If you have front restorations, we tell you beforehand."
            },
            {
              title: "¿Cuánto dura?",
              titleEn: "How long does it last?",
              text: "Depende de tus hábitos. Con las férulas de mantenimiento lo conservas mucho más tiempo.",
              textEn: "It depends on your habits. With the maintenance trays it lasts much longer."
            }
          ]
        },
        why: {
          title: "¿Por qué blanquearte los dientes en Colombia?",
          titleEn: "Why whiten your teeth in Colombia?",
          lead: "Es el tratamiento más corto: lo haces el día que llegas y el resto del viaje es tuyo.",
          leadEn: "It's the shortest treatment: you do it the day you arrive and the rest of the trip is yours.",
          reasons: [
            {
              tab: "El tiempo",
              tabEn: "The time",
              title: "Una sola cita",
              titleEn: "A single appointment",
              text: "Una sesión en consultorio y listo. Se puede sumar a cualquier otro tratamiento.",
              textEn: "One in-clinic session and done. It can be added to any other treatment.",
              image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1200",
              stat: "1",
              statEn: "1",
              statLabel: "cita, el día que llegas",
              statLabelEn: "appointment, the day you arrive"
            },
            {
              tab: "Las férulas",
              tabEn: "The trays",
              title: "Férulas a tu medida",
              titleEn: "Custom trays",
              text: "Te llevas férulas hechas para tus dientes, para mantener el tono en casa.",
              textEn: "You take home trays made for your teeth, to keep the shade at home.",
              image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1200"
            },
            {
              tab: "La ciudad",
              tabEn: "The city",
              title: "El resto del viaje es tuyo",
              titleEn: "The rest of the trip is yours",
              text: "Sin reposo ni restricciones, salvo la comida oscura las primeras 48 horas.",
              textEn: "No rest or restrictions, except dark food for the first 48 hours.",
              image: "https://images.unsplash.com/photo-1583531352515-8884af319dc1?auto=format&fit=crop&q=80&w=1200",
              stat: "22°",
              statEn: "72°F",
              statLabel: "todo el año en Medellín",
              statLabelEn: "year-round in Medellín"
            }
          ]
        }
      }
    ],
    doctor: {
      name: "Dr. Andrés Restrepo",
      title: "Odontólogo · Especialista en Rehabilitación Oral y Estética Dental",
      titleEn: "Dentist · Specialist in Oral Rehabilitation and Cosmetic Dentistry",
      registry: "Registro Médico 52.118 · Antioquia",
      yearsExperience: 14,
      credentials: [
        "Especialización en Rehabilitación Oral — Universidad CES, Medellín",
        "Certificación en Diseño de Sonrisa Digital — Digital Smile Design, Madrid",
        "Miembro de la Federación Odontológica Colombiana",
        "Más de 900 casos de rehabilitación estética"
      ],
      credentialsEn: [
        "Specialization in Oral Rehabilitation — Universidad CES, Medellín",
        "Digital Smile Design certification — Digital Smile Design, Madrid",
        "Member of the Colombian Dental Federation",
        "Over 900 aesthetic rehabilitation cases"
      ],
      photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600",
      quote: "Antes de tocar un diente te muestro exactamente cómo vas a quedar. Si el resultado simulado no te convence, lo rediseñamos las veces que haga falta: ese es el único punto en el que no hay prisa.",
      quoteEn: "Before I touch a tooth I show you exactly how you'll look. If the simulated result doesn't convince you, we redesign it as many times as needed: that's the one step where there is no rush."
    },
    journey: [
      {
        label: "Antes de viajar",
        photo: "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&q=80&w=1000",
        labelEn: "Before you travel",
        detail: "Valoración virtual con tu especialista, plan de tratamiento por escrito y cotización cerrada. Si la valoración indica que no deberías viajar todavía, te lo decimos ahí.",
        detailEn: "Virtual assessment with the specialist, a written treatment plan and a closed quote. If the assessment says you shouldn't travel yet, we tell you right there."
      },
      {
        label: "Llegada",
        photo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1000",
        labelEn: "Arrival",
        detail: "Te recogemos en el aeropuerto José María Córdova y te llevamos al hotel. Tarjeta SIM con datos y número de contacto 24/7 desde el primer minuto.",
        detailEn: "We pick you up at José María Córdova airport and take you to your hotel. SIM card with data and a 24/7 contact number from minute one."
      },
      {
        label: "Hospedaje",
        photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000",
        labelEn: "Accommodation",
        detail: "Hotel seleccionado a menos de 15 minutos de la clínica, en zona segura y caminable. Habitación doble sin costo extra si viajas con acompañante.",
        detailEn: "A hotel selected within 15 minutes of the clinic, in a safe, walkable area. Double room at no extra cost if you travel with a companion."
      },
      {
        label: "Durante el tratamiento",
        photo: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000",
        labelEn: "During treatment",
        detail: "Tu especialista te explica cada paso en tu idioma, con calma. Si quieres a alguien contigo en cada cita, sumamos un acompañante bilingüe por un costo adicional.",
        detailEn: "Your specialist calmly explains every step in your language. If you'd like someone with you at every appointment, we add a bilingual companion at an extra cost."
      },
      {
        label: "Tu tiempo libre",
        photo: "https://images.unsplash.com/photo-1583531352515-8884af319dc1?auto=format&fit=crop&q=80&w=1000",
        labelEn: "Your free time",
        detail: "Armamos un plan de ciudad ajustado a tu recuperación real: qué puedes hacer el día 2 y qué conviene dejar para el día 5. Reservas y transporte incluidos.",
        detailEn: "We build a city plan matched to your actual recovery: what you can do on day 2 and what is better left for day 5. Bookings and transport included."
      },
      {
        label: "Al volver a casa",
        photo: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=1000",
        labelEn: "Back home",
        detail: "Controles virtuales durante los primeros 6 meses y un informe clínico completo, en tu idioma, para que tu odontólogo local pueda hacer seguimiento.",
        detailEn: "Virtual check-ups for the first 6 months and a complete clinical report, in your language, so your local dentist can follow up."
      }
    ],
    packageIncludes: [
      "Valoración virtual previa y plan de tratamiento por escrito",
      "Procedimiento completo con tu especialista y su equipo",
      "Materiales, laboratorio dental y medicamentos post-operatorios",
      "Traslados aeropuerto — hotel — clínica en todas las citas",
      "Hospedaje en zona segura a menos de 15 min de la clínica",
      "Especialista que te atiende en tu idioma",
      "Plan de ciudad y reservas adaptados a tu recuperación",
      "Controles virtuales durante 6 meses e informe clínico final"
    ],
    packageIncludesEn: [
      "Prior virtual assessment and written treatment plan",
      "Full procedure with the specialist and her team",
      "Materials, dental laboratory work and post-op medication",
      "Airport — hotel — clinic transfers for every appointment",
      "Accommodation in a safe area under 15 min from the clinic",
      "A specialist who treats you in your language",
      "City plan and bookings adapted to your recovery",
      "Virtual check-ups for 6 months and a final clinical report"
    ],
    packageExcludes: [
      "Tiquetes aéreos internacionales",
      "Seguro médico de viaje (te ayudamos a contratarlo)",
      "Comidas fuera del hotel y gastos personales",
      "Tratamientos adicionales no previstos en la valoración inicial"
    ],
    packageExcludesEn: [
      "International flights",
      "Travel medical insurance (we help you arrange it)",
      "Meals outside the hotel and personal expenses",
      "Additional treatments not foreseen in the initial assessment"
    ],
    cityGuide: {
      city: "Medellín",
      intro: "La recuperación de un tratamiento dental es de las más livianas del turismo médico: puedes caminar, salir y conocer la ciudad desde el día siguiente. La única restricción real durante los primeros días es la comida dura y muy caliente.",
      introEn: "Recovery from dental work is one of the lightest in medical tourism: you can walk, go out and explore the city from the next day. The only real restriction in the first days is hard and very hot food.",
      climate: "22 °C todo el año, sin estaciones. No necesitas aclimatación ni ropa especial, y la altura (1.495 m) no afecta la cicatrización.",
      climateEn: "22 °C year-round, no seasons. You need no acclimatisation or special clothing, and the altitude (1,495 m) does not affect healing.",
      activities: [
        {
          name: "Comuna 13 y sus escaleras eléctricas",
          nameEn: "Comuna 13 and its outdoor escalators",
          note: "Recorrido guiado de 2 horas, casi todo en bajada. Apto desde el día siguiente al procedimiento.",
          noteEn: "A guided 2-hour walk, almost all downhill. Fine from the day after your procedure.",
          when: "Día 1",
          whenEn: "Day 1",
          where: "después de tu cita",
          whereEn: "after your appointment",
          tag: "Casi todo en bajada",
          tagEn: "Mostly downhill",
          tone: "linear-gradient(170deg, #c9a37a, #8a5f3c)",
          photo: "https://images.unsplash.com/photo-1693669029454-ab14dd80faaa?auto=format&fit=crop&q=80&w=1200"
        },
        {
          name: "Parque Arví en metrocable",
          nameEn: "Parque Arví by cable car",
          note: "Bosque a 2.500 m con senderos suaves. Media jornada, sin esfuerzo físico.",
          noteEn: "Cloud forest at 2,500 m with gentle trails. Half a day, no physical effort.",
          when: "Día 2",
          whenEn: "Day 2",
          tag: "En metrocable",
          tagEn: "By cable car",
          tone: "linear-gradient(170deg, #93b8ae, #4f7d72)",
          photo: "https://images.unsplash.com/photo-1715503234327-b57d32e5da0f?auto=format&fit=crop&q=80&w=1200"
        },
        {
          name: "Provenza y El Poblado",
          nameEn: "Provenza and El Poblado",
          note: "Restaurantes con menús blandos y sopas — te indicamos cuáles antes de llegar.",
          noteEn: "Restaurants with soft-food menus and soups — we tell you which ones before you arrive.",
          when: "Cada noche",
          whenEn: "Every night",
          where: "cerca del hotel",
          whereEn: "near the hotel",
          tag: "Menús blandos",
          tagEn: "Soft-food menus",
          tone: "linear-gradient(170deg, #b8a58a, #6f6252)",
          photo: "https://images.unsplash.com/photo-1676081986290-ac79c2968c3f?auto=format&fit=crop&q=80&w=1200"
        },
        {
          name: "Guatapé y la Piedra del Peñol",
          nameEn: "Guatapé and the Peñol Rock",
          note: "Día completo fuera de la ciudad. Recomendado a partir del tercer día.",
          noteEn: "A full day out of the city. Recommended from day three onwards.",
          when: "Día 3",
          whenEn: "Day 3",
          where: "día completo",
          whereEn: "full day",
          tag: "740 escalones",
          tagEn: "740 steps",
          tone: "linear-gradient(170deg, #9fbf97, #5d7f57)",
          photo: "https://images.unsplash.com/photo-1598028060898-c117093edfcb?auto=format&fit=crop&q=80&w=1200"
        }
      ]
    },
    preOpQuestions: [
      "¿Puedo ver el diseño simulado de mi sonrisa antes de aprobar el tratamiento?",
      "¿Qué marca y qué garantía tienen los implantes o las carillas que me van a colocar?",
      "¿Cuántas citas necesito realmente y qué pasa si requiero una más?",
      "¿Quién me atiende si tengo una molestia el fin de semana o de noche?",
      "¿El laboratorio dental es propio de la clínica o es externo?",
      "¿Qué incluye exactamente la cotización y qué podría costar aparte?"
    ],
    preOpQuestionsEn: [
      "Can I see the simulated design of my smile before approving the treatment?",
      "What brand and what warranty do the implants or veneers you'll place carry?",
      "How many appointments do I actually need, and what if I require one more?",
      "Who attends me if I have discomfort at the weekend or at night?",
      "Is the dental laboratory in-house or external?",
      "What exactly does the quote include and what could be charged separately?"
    ],
    clinicDetails: [
      {
        name: "DentiCare Advanced (Medellín)",
        note: "Laboratorio dental propio y escáner intraoral, lo que permite fresar carillas el mismo día. Es la sede donde atiende el Dr. Restrepo.",
        noteEn: "In-house dental laboratory and intraoral scanner, which allows veneers to be milled the same day. This is where Dr. Restrepo practices."
      },
      {
        name: "Clínica Dental VIP (Bogotá)",
        note: "Alternativa para pacientes que llegan por El Dorado y prefieren no tomar un vuelo interno. Mismo protocolo y mismos materiales.",
        noteEn: "An alternative for patients arriving through El Dorado who prefer not to take a domestic flight. Same protocol and same materials."
      }
    ],
    faqs: [
      {
        q: "¿Cuántos días debo quedarme en Colombia?",
        qEn: "How many days do I need to stay in Colombia?",
        a: "Depende del tratamiento: un blanqueamiento se resuelve el mismo día, unas carillas o un diseño de sonrisa toman entre 5 y 7 días, y un implante de carga inmediata entre 3 y 5. Siempre sumamos un día de margen después de la última cita, por si hay que ajustar algo antes de que vueles.",
        aEn: "It depends on the treatment: whitening is resolved the same day, veneers or a smile design take 5 to 7 days, and an immediate-load implant 3 to 5. We always add one buffer day after the final appointment in case something needs adjusting before you fly."
      },
      {
        q: "¿El precio que me dan incluye todo?",
        qEn: "Does the price I'm quoted include everything?",
        a: "Incluye todo lo médico y toda la logística en Colombia: procedimiento, materiales, laboratorio, medicamentos, hospedaje, traslados y seguimiento. No incluye los tiquetes aéreos, el seguro de viaje, tus gastos personales ni el acompañante bilingüe, que es opcional. Te lo decimos de frente porque el viaje completo cuesta más que el procedimiento solo: si comparas únicamente el precio del tratamiento con el de tu país, la cuenta te va a salir mal.",
        aEn: "It includes everything medical and all logistics inside Colombia: procedure, materials, laboratory, medication, accommodation, transfers and follow-up. It does not include flights, travel insurance, personal expenses or the bilingual companion, which is optional. We say this plainly because the full trip costs more than the procedure alone: if you compare only the treatment price against your home country, your maths will be off."
      },
      {
        q: "¿Puedo hacer turismo mientras estoy en tratamiento?",
        qEn: "Can I do any sightseeing while I'm in treatment?",
        a: "Sí, y es una de las razones para elegir odontología. La recuperación no te obliga a guardar reposo: puedes caminar, salir y conocer la ciudad desde el día siguiente. Armamos el plan alrededor de tus citas y ajustado a lo que sí puedes hacer cada día.",
        aEn: "Yes, and it's one of the reasons to choose dentistry. Recovery does not confine you to bed: you can walk, go out and explore the city from the next day. We build the plan around your appointments and matched to what you can actually do each day."
      },
      {
        q: "¿Qué pasa si tengo una complicación cuando ya volví a mi país?",
        qEn: "What happens if I have a complication once I'm back home?",
        a: "Tienes controles virtuales durante 6 meses y un canal directo con nosotros, no un formulario. Te entregamos el informe clínico completo para que cualquier odontólogo local pueda intervenir con toda la información. Si la complicación es atribuible al procedimiento y requiere corrección en Colombia, la clínica la cubre bajo su garantía; los tiquetes de ese segundo viaje corren por tu cuenta y eso queda escrito en el plan antes de que viajes.",
        aEn: "You get virtual check-ups for 6 months and a direct channel to us, not a form. We give you the full clinical report so any local dentist can step in with complete information. If the complication is attributable to the procedure and needs correcting in Colombia, the clinic covers it under its warranty; the flights for that second trip are on you, and that is written into the plan before you travel."
      },
      {
        q: "¿Quién me va a atender y puedo verificar sus credenciales?",
        qEn: "Who will treat me, and can I verify their credentials?",
        a: "Sabes el nombre de tu especialista antes de reservar, no al llegar. Te damos su número de registro médico para que lo consultes en el ReTHUS del Ministerio de Salud, y puedes hablar con ella por videollamada en la valoración previa.",
        aEn: "You know your specialist's name before booking, not on arrival. We give you their medical registry number so you can check it in the Ministry of Health's ReTHUS registry, and you can speak with them by video call during the prior assessment."
      },
      {
        q: "¿Puedo volar después de un implante?",
        qEn: "Can I fly after an implant?",
        a: "Sí. Los cambios de presión en cabina no afectan un implante ni unas carillas. Lo que sí pedimos es dejar al menos 48 horas entre la última cita quirúrgica y el vuelo, para poder revisarte antes de que salgas del país.",
        aEn: "Yes. Cabin pressure changes do not affect an implant or veneers. What we do ask is to leave at least 48 hours between the last surgical appointment and the flight, so we can check you before you leave the country."
      },
      {
        q: "¿Qué pasa si necesito más citas de las previstas?",
        qEn: "What if I need more appointments than planned?",
        a: "Los ajustes y controles dentro del plan aprobado no tienen costo adicional. Si en la valoración presencial aparece algo que no se veía en la virtual, te lo informamos con el precio antes de hacer nada: nunca vas a recibir un cobro que no hayas aprobado.",
        aEn: "Adjustments and check-ups within the approved plan carry no extra cost. If the in-person assessment reveals something the virtual one couldn't see, we tell you along with the price before doing anything: you will never receive a charge you haven't approved."
      }
    ],
    testimonial: {
      quote: "Llegué con miedo de que me cobraran de más al llegar, que es lo que uno escucha. Me pasó lo contrario: el precio fue el mismo del correo, la doctora me mostró el diseño tres veces hasta que quedé conforme, y todo me lo explicaron en inglés sin problema. Terminé haciendo Guatapé el jueves.",
      quoteEn: "I arrived afraid they'd charge me more once I was there, which is what you always hear. The opposite happened: the price was the one in the email, the doctor showed me the design three times until I was happy, and everything was explained to me in English with no trouble. I ended up doing Guatapé on the Thursday.",
      author: "Marcela Ortiz",
      origin: "Miami, Estados Unidos · Diseño de sonrisa",
      originEn: "Miami, United States · Smile design"
    }
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
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
    heroImage: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=80&w=1600",
    heroPosition: "center",
    heroTitle: "Tu cirugía bariátrica en Cali.",
    heroTitleEn: "Your bariatric surgery in Cali.",
    heroLead: "Cirugía bariátrica con cirujanos certificados y 12 meses de seguimiento nutricional.",
    heroLeadEn: "Bariatric surgery with certified surgeons and 12 months of nutrition follow-up.",
    why: {
      title: "¿Por qué hacerte la cirugía bariátrica en Colombia?",
      titleEn: "Why get bariatric surgery in Colombia?",
      lead: "Los programas bariátricos colombianos trabajan con equipos completos: cirugía, nutrición y psicología en un mismo hospital.",
      leadEn: "Colombian bariatric programmes work with complete teams: surgery, nutrition and psychology in one hospital.",
      reasons: [
        {
          title: "Hospitales de alta complejidad",
          titleEn: "High-complexity hospitals",
          tab: "Los hospitales",
          tabEn: "The hospitals",
          image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600",
          text: "Operamos en hospitales que están entre los mejor calificados de Latinoamérica, con cuidados intensivos en el mismo lugar.",
          textEn: "We operate in hospitals rated among the best in Latin America, with intensive care on site."
        },
        {
          title: "Equipo completo, no solo un cirujano",
          titleEn: "A full team, not just a surgeon",
          tab: "El equipo",
          tabEn: "The team",
          image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&q=80&w=600",
          text: "Nutrición, psicología y cardiología te valoran antes de operar. Es lo que hace que el resultado dure.",
          textEn: "Nutrition, psychology and cardiology assess you before surgery. That's what makes the result last."
        },
        {
          title: "Seguimiento de 12 meses",
          titleEn: "12 months of follow-up",
          tab: "El seguimiento",
          tabEn: "Follow-up",
          image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600",
          text: "Tu nutricionista te acompaña a distancia durante el primer año, que es el que define el éxito.",
          textEn: "Your nutritionist supports you remotely through the first year, the one that decides success."
        }
      ]
    },
    // ⚠️ DATOS DE MUESTRA — reemplazar por información verificable antes de publicar.
    priceFrom: "$3,900 USD",
    reviews: [
      {
        quote: "Antes de aceptarme me pidieron valoración con psicología y nutrición. Al principio me molestó, ahora entiendo que es lo que hace que el resultado dure.",
        quoteEn: "Before accepting me they required a psychology and nutrition assessment. It annoyed me at first; now I understand that's what makes the result last.",
        author: "David L. Miller",
        origin: "Nueva York, Estados Unidos",
        originEn: "New York, United States",
        procedure: "Bypass gástrico",
        procedureEn: "Gastric bypass",
        rating: 5
      },
      {
        quote: "La nutricionista me sigue escribiendo cada mes, un año después. No es un formulario, es la misma persona que me vio en Cali.",
        quoteEn: "The nutritionist still messages me every month, a year later. It's not a form; it's the same person who saw me in Cali.",
        author: "Gabriela Rosales",
        origin: "San Juan, Puerto Rico",
        originEn: "San Juan, Puerto Rico",
        procedure: "Manga gástrica",
        procedureEn: "Gastric sleeve",
        rating: 5
      },
      {
        quote: "Todo salió bien, pero el hotel no tenía muchas opciones de comida líquida y tuve que pedir a domicilio. Se lo comenté al equipo y dijeron que ya lo cambiaron.",
        quoteEn: "Everything went well, but the hotel had few liquid-diet options and I had to order delivery. I told the team and they said they've since changed it.",
        author: "Mark Jensen",
        origin: "Denver, Estados Unidos",
        originEn: "Denver, United States",
        procedure: "Manga gástrica",
        procedureEn: "Gastric sleeve",
        rating: 4
      },
      {
        quote: "Me recomendaron el balón en vez de la manga porque mi IMC no justificaba cirugía. Podían haberme vendido lo más caro y no lo hicieron.",
        quoteEn: "They recommended the balloon instead of the sleeve because my BMI didn't justify surgery. They could have sold me the most expensive option and didn't.",
        author: "Laura Benítez",
        origin: "Panamá, Panamá",
        originEn: "Panama City, Panama",
        procedure: "Balón gástrico",
        procedureEn: "Gastric balloon",
        rating: 5
      }
    ],
    procedureDetails: [
      {
        name: "Manga gástrica por laparoscopia",
        photo: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=80&w=1000",
        nameEn: "Laparoscopic Gastric Sleeve",
        description: "Reduce el estómago a través de pequeñas incisiones. Es la cirugía bariátrica más realizada en el mundo por su balance entre efectividad y menor riesgo quirúrgico.",
        descriptionEn: "Reduces the stomach through small incisions. It's the most performed bariatric surgery worldwide due to its balance of effectiveness and lower surgical risk.",
        recovery: "10 - 12 días en Colombia",
        recoveryEn: "10 - 12 days in Colombia",
        sessions: "2 noches de hospitalización",
        sessionsEn: "2 nights in hospital",
        priceFrom: "$5,200 USD",
        slug: "manga-gastrica",
        heroTitle: "Tu manga gástrica en Cali.",
        heroTitleEn: "Your gastric sleeve in Cali.",
        heroLead: "Cirugía por laparoscopia con equipo de nutrición y psicología, y 12 meses de seguimiento.",
        heroLeadEn: "Laparoscopic surgery with a nutrition and psychology team, and 12 months of follow-up.",
        idealFor: [
          "IMC de 40 o más, o de 35 con diabetes o hipertensión",
          "Intentos previos de bajar de peso sin un resultado que dure",
          "Compromiso con el plan de alimentación después"
        ],
        idealForEn: [
          "A BMI of 40 or more, or 35 with diabetes or hypertension",
          "Past attempts to lose weight that didn't last",
          "Commitment to the eating plan afterwards"
        ],
        details: {
          whatIs: "Por laparoscopia, con pequeñas incisiones, se retira la mayor parte del estómago y queda un tubo más pequeño. Te llenas antes y sientes menos hambre.",
          whatIsEn: "Laparoscopically, through small incisions, most of the stomach is removed and a smaller tube remains. You feel full sooner and less hungry.",
          anesthesia: "General",
          anesthesiaEn: "General",
          duration: "1 – 2 horas",
          durationEn: "1 – 2 hours",
          hospital: "2 noches",
          hospitalEn: "2 nights",
          shortName: "manga gástrica",
          shortNameEn: "gastric sleeve",
          tagline: "Comer menos, sin pasar hambre.",
          taglineEn: "Eat less, without going hungry.",
          hotelText: "Dieta líquida guiada por tu nutricionista y caminatas cortas todos los días.",
          hotelTextEn: "A liquid diet guided by your nutritionist and short walks every day.",
          concerns: [
            {
              title: "¿Duele?",
              titleEn: "Does it hurt?",
              text: "Por laparoscopia la molestia es moderada: en las incisiones y a veces en los hombros los primeros días. Se controla con medicamentos.",
              textEn: "Laparoscopy keeps discomfort moderate: at the incisions and sometimes the shoulders for the first days. It's controlled with medication."
            },
            {
              title: "¿Voy a pasar hambre?",
              titleEn: "Will I be hungry?",
              text: "La mayoría siente mucho menos hambre, porque baja la hormona que la produce.",
              textEn: "Most people feel much less hungry, because the hormone that drives hunger goes down."
            },
            {
              title: "¿Cuánto peso voy a perder?",
              titleEn: "How much weight will I lose?",
              text: "En promedio, entre el 60 y el 80 % del exceso de peso en 12 a 18 meses. Depende mucho de seguir el plan.",
              textEn: "On average, 60 to 80% of excess weight in 12 to 18 months. It depends a lot on following the plan."
            },
            {
              title: "¿Qué voy a poder comer?",
              titleEn: "What will I be able to eat?",
              text: "Pasas por fases: líquidos, papillas, blandos y luego comida normal en porciones pequeñas. Tu nutricionista te guía en cada una.",
              textEn: "You go through phases: liquids, purées, soft food, then normal food in small portions. Your nutritionist guides you through each."
            },
            {
              title: "¿Cuánto tiempo sin trabajar?",
              titleEn: "How long off work?",
              text: "Trabajo de oficina desde la segunda o tercera semana.",
              textEn: "Office work from the second or third week."
            },
            {
              title: "¿Se ven las cicatrices?",
              titleEn: "Will the scars show?",
              text: "Son pequeñas incisiones de alrededor de 1 cm que con el tiempo casi no se notan.",
              textEn: "They're small incisions of about 1 cm that become barely noticeable over time."
            }
          ]
        },
        why: {
          title: "¿Por qué hacerte la manga gástrica en Colombia?",
          titleEn: "Why get a gastric sleeve in Colombia?",
          lead: "Programas bariátricos completos: cirugía, nutrición y psicología en el mismo hospital.",
          leadEn: "Complete bariatric programmes: surgery, nutrition and psychology in the same hospital.",
          reasons: [
            {
              tab: "El equipo",
              tabEn: "The team",
              title: "Equipo completo, no solo un cirujano",
              titleEn: "A full team, not just a surgeon",
              text: "Nutrición, psicología y cardiología te valoran antes de operar. Es lo que hace que el resultado dure.",
              textEn: "Nutrition, psychology and cardiology assess you before surgery. That's what makes the result last.",
              image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&q=80&w=1200",
              stat: "3",
              statEn: "3",
              statLabel: "especialistas te valoran antes",
              statLabelEn: "specialists assess you first"
            },
            {
              tab: "El seguimiento",
              tabEn: "Follow-up",
              title: "Te acompañamos el primer año",
              titleEn: "We're with you the first year",
              text: "Tu nutricionista te sigue a distancia durante el año que define el éxito.",
              textEn: "Your nutritionist follows you remotely through the year that decides success.",
              image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200",
              stat: "12",
              statEn: "12",
              statLabel: "meses con tu nutricionista",
              statLabelEn: "months with your nutritionist"
            },
            {
              tab: "El hospital",
              tabEn: "The hospital",
              title: "Hospitales de alta complejidad",
              titleEn: "High-complexity hospitals",
              text: "Operamos en hospitales con cuidados intensivos en el mismo lugar.",
              textEn: "We operate in hospitals with intensive care on site.",
              image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200"
            }
          ]
        }
      },
      {
        name: "Bypass gástrico",
        photo: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&q=80&w=1000",
        nameEn: "Gastric Bypass",
        description: "Reduce el estómago y reconecta el intestino para disminuir la absorción de calorías. Recomendado para IMC más alto o con diabetes tipo 2 asociada.",
        descriptionEn: "Reduces the stomach and reroutes the intestine to lower calorie absorption. Recommended for higher BMI or associated type 2 diabetes.",
        recovery: "12 - 15 días en Colombia",
        recoveryEn: "12 - 15 days in Colombia",
        sessions: "2 - 3 noches de hospitalización",
        sessionsEn: "2 - 3 nights in hospital",
        priceFrom: "$6,400 USD",
        slug: "bypass-gastrico",
        heroTitle: "Tu bypass gástrico en Cali.",
        heroTitleEn: "Your gastric bypass in Cali.",
        heroLead: "Bypass por laparoscopia con cirujana bariátrica, equipo completo y seguimiento de un año.",
        heroLeadEn: "Laparoscopic bypass with a bariatric surgeon, a full team and a year of follow-up.",
        idealFor: [
          "IMC de 40 o más, o de 35 con diabetes tipo 2",
          "Reflujo importante",
          "Compromiso con suplementos y controles de por vida"
        ],
        idealForEn: [
          "A BMI of 40 or more, or 35 with type 2 diabetes",
          "Significant reflux",
          "Commitment to lifelong supplements and check-ups"
        ],
        details: {
          question: "¿Qué es el bypass gástrico?",
          questionEn: "What is gastric bypass?",
          whatIs: "Se crea un estómago pequeño y se conecta directamente con una parte del intestino. Comes menos y tu cuerpo absorbe menos calorías.",
          whatIsEn: "A small stomach pouch is created and connected directly to part of the intestine. You eat less and your body absorbs fewer calories.",
          anesthesia: "General",
          anesthesiaEn: "General",
          duration: "2 – 3 horas",
          durationEn: "2 – 3 hours",
          hospital: "2 – 3 noches",
          hospitalEn: "2 – 3 nights",
          shortName: "bypass gástrico",
          shortNameEn: "gastric bypass",
          tagline: "Menos estómago, menos absorción.",
          taglineEn: "Less stomach, less absorption.",
          hotelText: "Dieta líquida con tu nutricionista, caminatas cortas y tus primeros suplementos.",
          hotelTextEn: "A liquid diet with your nutritionist, short walks and your first supplements.",
          concerns: [
            {
              title: "¿Duele?",
              titleEn: "Does it hurt?",
              text: "Por laparoscopia la molestia es moderada los primeros días y se controla con medicamentos.",
              textEn: "Laparoscopy keeps discomfort moderate for the first days, controlled with medication."
            },
            {
              title: "¿Mejora la diabetes?",
              titleEn: "Does it help diabetes?",
              text: "En muchos pacientes con diabetes tipo 2 mejora de forma importante. Tu cirujana lo evalúa en tu caso.",
              textEn: "In many patients with type 2 diabetes it improves significantly. Your surgeon assesses your case."
            },
            {
              title: "¿Cuánto peso voy a perder?",
              titleEn: "How much weight will I lose?",
              text: "En promedio, entre el 60 y el 80 % del exceso de peso en 12 a 18 meses, siguiendo el plan.",
              textEn: "On average, 60 to 80% of excess weight in 12 to 18 months, following the plan."
            },
            {
              title: "¿Tendré que tomar vitaminas?",
              titleEn: "Will I need vitamins?",
              text: "Sí, de por vida. Sales con tu plan de suplementos y tu nutricionista lo ajusta en los controles.",
              textEn: "Yes, for life. You leave with your supplement plan and your nutritionist adjusts it at check-ups."
            },
            {
              title: "¿Cuánto tiempo sin trabajar?",
              titleEn: "How long off work?",
              text: "Trabajo de oficina desde la segunda o tercera semana.",
              textEn: "Office work from the second or third week."
            },
            {
              title: "¿Se ven las cicatrices?",
              titleEn: "Will the scars show?",
              text: "Son pequeñas incisiones de alrededor de 1 cm que con el tiempo casi no se notan.",
              textEn: "They're small incisions of about 1 cm that become barely noticeable over time."
            }
          ]
        },
        why: {
          title: "¿Por qué hacerte el bypass en Colombia?",
          titleEn: "Why get a bypass in Colombia?",
          lead: "Cirujanos bariátricos con mucha práctica y un equipo que te acompaña antes, durante y después.",
          leadEn: "Bariatric surgeons with plenty of practice and a team that's with you before, during and after.",
          reasons: [
            {
              tab: "La cirujana",
              tabEn: "The surgeon",
              title: "Te opera alguien que lo hace cada semana",
              titleEn: "Operated on by someone who does this every week",
              text: "Tu cirujana tiene formación específica en cirugía bariátrica y metabólica.",
              textEn: "Your surgeon has specific training in bariatric and metabolic surgery.",
              image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1200",
              stat: "1.200+",
              statEn: "1,200+",
              statLabel: "cirugías bariátricas",
              statLabelEn: "bariatric surgeries"
            },
            {
              tab: "El equipo",
              tabEn: "The team",
              title: "Nutrición, psicología y cardiología",
              titleEn: "Nutrition, psychology and cardiology",
              text: "Te valoran antes de operar: es lo que separa bajar de peso de mantenerlo.",
              textEn: "They assess you before surgery: it's what separates losing weight from keeping it off.",
              image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&q=80&w=1200",
              stat: "3",
              statEn: "3",
              statLabel: "especialistas te valoran antes",
              statLabelEn: "specialists assess you first"
            },
            {
              tab: "El seguimiento",
              tabEn: "Follow-up",
              title: "Un año acompañado",
              titleEn: "A year of support",
              text: "Controles a los 1, 3, 6 y 12 meses y tu nutricionista a un mensaje.",
              textEn: "Check-ups at 1, 3, 6 and 12 months and your nutritionist a message away.",
              image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200",
              stat: "12",
              statEn: "12",
              statLabel: "meses con tu nutricionista",
              statLabelEn: "months with your nutritionist"
            }
          ]
        }
      },
      {
        name: "Balón gástrico digerible",
        photo: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1000",
        nameEn: "Swallowable Gastric Balloon",
        description: "Cápsula que se traga sin cirugía ni anestesia y se infla en el estómago para reducir el apetito durante unos 4 meses, luego se disuelve sola.",
        descriptionEn: "A capsule swallowed without surgery or anesthesia that inflates in the stomach to reduce appetite for about 4 months, then dissolves on its own.",
        recovery: "3 - 4 días en Colombia",
        recoveryEn: "3 - 4 days in Colombia",
        sessions: "1 cita ambulatoria",
        sessionsEn: "1 outpatient appointment",
        priceFrom: "$3,900 USD",
        slug: "balon-gastrico",
        heroTitle: "Tu balón gástrico en Cali.",
        heroTitleEn: "Your gastric balloon in Cali.",
        heroLead: "Una cápsula que se traga, sin cirugía ni anestesia, con plan nutricional incluido.",
        heroLeadEn: "A capsule you swallow, no surgery or anaesthetic, with a nutrition plan included.",
        idealFor: [
          "Sobrepeso que no justifica una cirugía",
          "Quieres empezar sin cirugía ni anestesia",
          "Compromiso con el plan nutricional durante el tratamiento"
        ],
        idealForEn: [
          "Excess weight that doesn't justify surgery",
          "You want to start without surgery or anaesthetic",
          "Commitment to the nutrition plan during treatment"
        ],
        details: {
          question: "¿Qué es el balón gástrico digerible?",
          questionEn: "What is the swallowable gastric balloon?",
          whatIs: "Te tragas una cápsula que se llena en el estómago y te hace sentir lleno con menos comida. Después de unos 4 meses se vacía y sale sola.",
          whatIsEn: "You swallow a capsule that fills in your stomach and makes you feel full with less food. After about 4 months it empties and passes on its own.",
          anesthesia: "Sin anestesia",
          anesthesiaEn: "No anaesthetic",
          duration: "20 – 30 minutos",
          durationEn: "20 – 30 minutes",
          hospital: "Ambulatorio",
          hospitalEn: "Outpatient",
          shortName: "balón gástrico",
          shortNameEn: "gastric balloon",
          tagline: "Sin cirugía, sin anestesia.",
          taglineEn: "No surgery, no anaesthetic.",
          hotelText: "Los primeros días el estómago se acostumbra: dieta líquida y medicamentos para sentirte bien.",
          hotelTextEn: "For the first days your stomach adjusts: a liquid diet and medication so you feel well.",
          concerns: [
            {
              title: "¿Cómo se traga?",
              titleEn: "How do I swallow it?",
              text: "Como una pastilla grande, con agua. Una radiografía confirma que quedó bien ubicado.",
              textEn: "Like a large pill, with water. An X-ray confirms it's in place."
            },
            {
              title: "¿Duele?",
              titleEn: "Does it hurt?",
              text: "No. Los primeros días puedes sentir el estómago lleno o algo de náusea, y se controla con medicamentos.",
              textEn: "No. For the first days your stomach may feel full or a little queasy, controlled with medication."
            },
            {
              title: "¿Cuánto peso voy a perder?",
              titleEn: "How much weight will I lose?",
              text: "Depende de tu plan de alimentación. Tu nutricionista te pone una meta realista desde el inicio.",
              textEn: "It depends on your eating plan. Your nutritionist sets a realistic goal from the start."
            },
            {
              title: "¿Cómo sale?",
              titleEn: "How does it come out?",
              text: "Después de unos 4 meses se vacía y sale solo, de forma natural.",
              textEn: "After about 4 months it empties and passes naturally on its own."
            },
            {
              title: "¿Cuándo vuelvo a mi rutina?",
              titleEn: "When am I back to my routine?",
              text: "En pocos días. No hay heridas ni hospitalización.",
              textEn: "Within a few days. There are no wounds and no hospital stay."
            },
            {
              title: "¿Es para mí?",
              titleEn: "Is it for me?",
              text: "Si tu IMC no justifica una cirugía, puede ser la mejor opción. Lo define tu especialista en la valoración.",
              textEn: "If your BMI doesn't justify surgery, it may be the best option. Your specialist decides at the assessment."
            }
          ]
        },
        why: {
          title: "¿Por qué hacerte el balón en Colombia?",
          titleEn: "Why get the balloon in Colombia?",
          lead: "Un viaje corto, sin cirugía, con el mismo equipo de nutrición que acompaña a los pacientes bariátricos.",
          leadEn: "A short trip, no surgery, with the same nutrition team that supports bariatric patients.",
          reasons: [
            {
              tab: "Sin cirugía",
              tabEn: "No surgery",
              title: "Una cápsula, no un quirófano",
              titleEn: "A capsule, not an operating room",
              text: "Se traga en una cita ambulatoria y vuelves al hotel el mismo día.",
              textEn: "It's swallowed at an outpatient appointment and you're back at the hotel the same day.",
              image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1200",
              stat: "0",
              statEn: "0",
              statLabel: "cirugías, 0 anestesia",
              statLabelEn: "surgeries, 0 anaesthetic"
            },
            {
              tab: "El efecto",
              tabEn: "The effect",
              title: "Tiempo para crear hábitos",
              titleEn: "Time to build habits",
              text: "Mientras el balón está, aprendes a comer distinto con tu nutricionista.",
              textEn: "While the balloon is in, you learn to eat differently with your nutritionist.",
              image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1200",
              stat: "4",
              statEn: "4",
              statLabel: "meses de efecto",
              statLabelEn: "months of effect"
            },
            {
              tab: "El seguimiento",
              tabEn: "Follow-up",
              title: "Acompañado después del balón",
              titleEn: "Supported after the balloon",
              text: "El seguimiento sigue cuando el balón ya salió, para que el resultado se quede.",
              textEn: "Follow-up continues once the balloon is gone, so the result stays.",
              image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200",
              stat: "12",
              statEn: "12",
              statLabel: "meses con tu nutricionista",
              statLabelEn: "months with your nutritionist"
            }
          ]
        }
      }
    ],
    doctor: {
      name: "Dra. Catalina Herrera",
      title: "Cirujana General · Especialista en Cirugía Bariátrica y Metabólica",
      titleEn: "General Surgeon · Specialist in Bariatric and Metabolic Surgery",
      registry: "Registro Médico 76.389 · Valle del Cauca",
      yearsExperience: 15,
      credentials: [
        "Especialización en Cirugía General — Universidad del Valle, Cali",
        "Fellowship en Cirugía Bariátrica y Metabólica — São Paulo, Brasil",
        "Miembro de la Asociación Colombiana de Obesidad y Cirugía Bariátrica",
        "Más de 1.200 cirugías bariátricas por laparoscopia"
      ],
      credentialsEn: [
        "Specialization in General Surgery — Universidad del Valle, Cali",
        "Fellowship in Bariatric and Metabolic Surgery — São Paulo, Brazil",
        "Member of the Colombian Association of Obesity and Bariatric Surgery",
        "Over 1,200 laparoscopic bariatric surgeries"
      ],
      photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600",
      quote: "La cirugía dura una hora y media; el tratamiento dura el resto de tu vida. Por eso no opero a nadie que no haya pasado antes por nutrición y psicología: es lo que separa bajar de peso de mantenerlo.",
      quoteEn: "The surgery takes an hour and a half; the treatment lasts the rest of your life. That's why I don't operate on anyone who hasn't first seen nutrition and psychology: it's what separates losing weight from keeping it off."
    },
    journey: [
      {
        label: "Antes de viajar",
        photo: "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&q=80&w=1000",
        labelEn: "Before you travel",
        detail: "Valoración virtual con tu cirujana, nutrición y psicología. Empiezas la dieta preoperatoria en casa dos semanas antes, con seguimiento por mensaje.",
        detailEn: "Virtual assessment with your surgeon, a nutritionist and a psychologist. You start the pre-op diet at home two weeks before, with follow-up by message."
      },
      {
        label: "Llegada",
        photo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1000",
        labelEn: "Arrival",
        detail: "Te recogemos en el aeropuerto Alfonso Bonilla Aragón. Al día siguiente: exámenes, valoración de cardiología y anestesiología en la misma clínica.",
        detailEn: "We pick you up at Alfonso Bonilla Aragón airport. The next day: tests plus cardiology and anaesthesiology assessments at the same clinic."
      },
      {
        label: "Cirugía y hospitalización",
        photo: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&q=80&w=1000",
        labelEn: "Surgery and hospital stay",
        detail: "Cirugía por laparoscopia y dos o tres noches hospitalizada. No sales hasta tolerar líquidos y caminar sin ayuda.",
        detailEn: "Laparoscopic surgery and two or three nights in hospital. You don't leave until you tolerate liquids and walk unaided."
      },
      {
        label: "Recuperación en hotel",
        photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000",
        labelEn: "Recovery at the hotel",
        detail: "Hotel cerca de la clínica con menú de dieta líquida coordinado por tu nutricionista. Caminatas diarias cortas para recuperarte más rápido.",
        detailEn: "A hotel near the clinic with a liquid-diet menu coordinated by your nutritionist. Short daily walks to recover faster."
      },
      {
        label: "Control antes del vuelo",
        photo: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000",
        labelEn: "Check-up before flying",
        detail: "Control presencial con tu cirujana y tu nutricionista, en tu idioma. Sales con tu plan de alimentación por fases y tus suplementos.",
        detailEn: "An in-person check-up with your surgeon and nutritionist, in your language. You leave with your phased eating plan and supplements."
      },
      {
        label: "Al volver a casa",
        photo: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=1000",
        labelEn: "Back home",
        detail: "Seguimiento nutricional virtual durante 12 meses y controles con la cirujana a los 1, 3, 6 y 12 meses. Informe clínico en tu idioma para tu médico local.",
        detailEn: "Virtual nutrition follow-up for 12 months and check-ups with the surgeon at 1, 3, 6 and 12 months. Clinical report in your language for your local doctor."
      }
    ],
    cityGuide: {
      city: "Cali",
      intro: "Después de una cirugía bariátrica la prioridad es caminar un poco todos los días y no hacer esfuerzos. Cali es plana en buena parte y tiene muchos paseos con sombra, ideales para esas caminatas cortas.",
      introEn: "After bariatric surgery the priority is to walk a little every day and avoid exertion. Much of Cali is flat, with plenty of shaded walks that are ideal for those short outings.",
      climate: "Cálido todo el año, entre 24 y 30 °C. Hidratación constante y salidas temprano en la mañana o al final de la tarde.",
      climateEn: "Warm year-round, between 24 and 30 °C. Constant hydration and outings early in the morning or late in the afternoon.",
      activities: [
        {
          name: "Bulevar del Río",
          nameEn: "Bulevar del Río",
          note: "Paseo peatonal plano junto al río Cali. Perfecto para las caminatas diarias desde el día 3.",
          noteEn: "A flat pedestrian walk along the Cali River. Perfect for your daily walks from day 3.",
          when: "Día 3",
          whenEn: "Day 3",
          where: "caminata diaria",
          whereEn: "daily walk",
          tag: "Plano y con sombra",
          tagEn: "Flat and shaded",
          tone: "linear-gradient(170deg, #9fbf97, #5d7f57)"
        },
        {
          name: "Barrio San Antonio",
          nameEn: "San Antonio neighbourhood",
          note: "Calles coloniales y miradores. Mejor al atardecer y a partir de la segunda semana.",
          noteEn: "Colonial streets and viewpoints. Best at sunset and from the second week.",
          when: "Semana 2",
          whenEn: "Week 2",
          where: "al atardecer",
          whereEn: "at sunset",
          tag: "Miradores",
          tagEn: "Viewpoints",
          tone: "linear-gradient(170deg, #c9a37a, #8a5f3c)",
          photo: "https://images.unsplash.com/photo-1728588519059-a62e06050425?auto=format&fit=crop&q=80&w=1200"
        },
        {
          name: "Zoológico de Cali",
          nameEn: "Cali Zoo",
          note: "Recorrido largo pero plano, con bancas. Hazlo a tu ritmo al final de la estadía.",
          noteEn: "A long but flat route with benches. Take it at your own pace at the end of your stay.",
          when: "Antes de volar",
          whenEn: "Before you fly",
          tag: "A tu ritmo",
          tagEn: "At your pace",
          tone: "linear-gradient(170deg, #93b8ae, #4f7d72)"
        },
        {
          name: "Clases de salsa (como espectador)",
          nameEn: "Salsa shows (as a spectator)",
          note: "Cali es la capital de la salsa. Bailar espera, pero ver un show en la noche sí se puede.",
          noteEn: "Cali is the salsa capital. Dancing can wait, but watching an evening show is fine.",
          when: "Una noche",
          whenEn: "One night",
          where: "capital de la salsa",
          whereEn: "salsa capital",
          tag: "Solo mirar",
          tagEn: "Just watch",
          tone: "linear-gradient(170deg, #b88a8a, #6f4b52)"
        }
      ]
    },
    faqs: [
      {
        q: "¿Cuántos días debo quedarme en Colombia?",
        qEn: "How many days do I need to stay in Colombia?",
        a: "Entre 10 y 15 días para la manga o el bypass, y unos 4 días para el balón. Ese tiempo incluye exámenes previos, hospitalización y el control antes de volar.",
        aEn: "Between 10 and 15 days for the sleeve or bypass, and about 4 days for the balloon. That includes pre-op tests, hospital stay and the check-up before flying."
      },
      {
        q: "¿Soy candidato a cirugía bariátrica?",
        qEn: "Am I a candidate for bariatric surgery?",
        a: "En general, con un IMC de 40 o más, o de 35 o más con enfermedades asociadas como diabetes o hipertensión. Lo define tu cirujana en la valoración; si no eres candidato, te proponemos alternativas como el balón gástrico.",
        aEn: "Generally with a BMI of 40 or more, or 35 or more with associated conditions such as diabetes or hypertension. Your surgeon decides at the assessment; if you're not a candidate, we propose alternatives such as the gastric balloon."
      },
      {
        q: "¿El precio que me dan incluye todo?",
        qEn: "Does the price I'm quoted include everything?",
        a: "Incluye exámenes, valoraciones, cirugía, anestesia, hospitalización, medicamentos, hospedaje, traslados y 12 meses de seguimiento nutricional. No incluye tiquetes, seguros ni los suplementos de por vida.",
        aEn: "It includes tests, assessments, surgery, anaesthesia, hospital stay, medication, accommodation, transfers and 12 months of nutrition follow-up. It does not include flights, insurance or lifelong supplements."
      },
      {
        q: "¿Qué pasa si tengo una complicación cuando ya volví a mi país?",
        qEn: "What happens if I have a complication once I'm back home?",
        a: "Tienes un canal directo con tu cirujana y el informe quirúrgico completo para cualquier médico local. Te recomendamos contratar un seguro de complicaciones quirúrgicas antes de viajar y te ayudamos a hacerlo.",
        aEn: "You have a direct channel to your surgeon and the full operative report for any local doctor. We recommend taking out surgical complications insurance before travelling, and we help you do it."
      },
      {
        q: "¿Cuánto peso voy a perder?",
        qEn: "How much weight will I lose?",
        a: "En promedio, entre el 60 y el 80 % del exceso de peso en los primeros 12 a 18 meses con manga o bypass. Depende en gran parte de seguir el plan nutricional; por eso el seguimiento está incluido.",
        aEn: "On average, 60 to 80% of excess weight in the first 12 to 18 months with a sleeve or bypass. It depends largely on following the nutrition plan, which is why follow-up is included."
      }
    ],
    packageIncludes: [
      "Valoración virtual con cirujana, nutrición y psicología",
      "Exámenes prequirúrgicos, valoración de cardiología y anestesiología",
      "Cirugía por laparoscopia, anestesia y honorarios del equipo",
      "Hospitalización según el procedimiento",
      "Kit de medicamentos y suplementos para el primer mes",
      "Hospedaje cerca de la clínica con menú de dieta líquida",
      "Traslados a todas las citas",
      "Seguimiento nutricional virtual durante 12 meses"
    ],
    packageIncludesEn: [
      "Virtual assessment with the surgeon, nutrition and psychology",
      "Pre-op tests, cardiology and anaesthesiology assessments",
      "Laparoscopic surgery, anaesthesia and team fees",
      "Hospital stay depending on the procedure",
      "Medication and supplement kit for the first month",
      "Accommodation near the clinic with a liquid-diet menu",
      "Transfers to every appointment",
      "Virtual nutrition follow-up for 12 months"
    ],
    packageExcludes: [
      "Vuelos internacionales",
      "Hospedaje del acompañante",
      "Suplementos nutricionales de por vida (vitaminas, proteína)",
      "Cirugías de contorno corporal por exceso de piel",
      "Seguro médico de viaje"
    ],
    packageExcludesEn: [
      "International flights",
      "Companion's lodging",
      "Lifelong nutritional supplements (vitamins, protein)",
      "Body contouring surgery for excess skin",
      "Travel medical insurance"
    ],
    preOpQuestions: [
      "¿El cirujano es miembro de una sociedad de cirugía bariátrica reconocida?",
      "¿Cuántos días debo quedarme en Colombia después de la cirugía antes de volar?",
      "¿Incluye seguimiento nutricional a distancia una vez que regrese a mi país?",
      "¿Qué pasa si se presenta una complicación después de que ya estoy en mi país?"
    ],
    preOpQuestionsEn: [
      "Is the surgeon a member of a recognized bariatric surgery society?",
      "How many days must I stay in Colombia after surgery before flying home?",
      "Does it include remote nutritional follow-up once I'm back in my country?",
      "What happens if a complication arises after I've already left the country?"
    ],
    clinicDetails: [
      {
        name: "Clínica Portoazul (Barranquilla)",
        note: "Centro de excelencia en cirugía bariátrica y metabólica en la costa Caribe.",
        noteEn: "Center of excellence in bariatric and metabolic surgery on the Caribbean coast."
      },
      {
        name: "Hospital Universitario Fundación Valle del Lili (Cali)",
        note: "Uno de los hospitales de mayor complejidad de Colombia, con programa bariátrico integral: cirugía, nutrición y psicología.",
        noteEn: "One of Colombia's highest-complexity hospitals, with a comprehensive bariatric program: surgery, nutrition, and psychology."
      }
    ],
    testimonial: {
      quote: "Mi cirugía bariátrica en Cali fue un éxito rotundo. El cirujano es de primera categoría y la clínica Valle del Lili cuenta con estándares de seguridad increíbles. Bajé 35 kilos y recuperé mi salud. ¡Altamente recomendado!",
      quoteEn: "My bariatric surgery in Cali was a resounding success. The surgeon is top-tier and Valle del Lili clinic has incredible safety standards. I lost 35 kilos and got my health back. Highly recommended!",
      author: "David L. Miller",
      origin: "New York, EE. UU. · Bypass Gástrico",
      originEn: "New York, USA · Gastric Bypass"
    }
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
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800",
    heroImage: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=80&w=1600",
    heroPosition: "center",
    heroTitle: "Tus tratamientos estéticos en Cartagena.",
    heroTitleEn: "Your aesthetic treatments in Cartagena.",
    heroLead: "Tratamientos sin cirugía, con productos certificados. Sales el mismo día.",
    heroLeadEn: "Non-surgical treatments with certified products. Walk out the same day.",
    why: {
      title: "¿Por qué hacerte tratamientos estéticos en Colombia?",
      titleEn: "Why get aesthetic treatments in Colombia?",
      lead: "Colombia tiene médicos estéticos con mucha práctica en inyectables y una cultura del cuidado de la piel muy fuerte.",
      leadEn: "Colombia has aesthetic doctors with plenty of practice in injectables and a strong skincare culture.",
      reasons: [
        {
          title: "Productos con registro INVIMA",
          titleEn: "INVIMA-registered products",
          tab: "Los productos",
          tabEn: "The products",
          image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600",
          text: "Cada producto se abre frente a ti y el lote queda en tu historia clínica.",
          textEn: "Every product is opened in front of you and the batch number goes into your record."
        },
        {
          title: "Médicos, no esteticistas",
          titleEn: "Doctors, not beauticians",
          tab: "Los médicos",
          tabEn: "The doctors",
          image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600",
          text: "Todos los tratamientos los aplica un médico especialista en medicina estética.",
          textEn: "Every treatment is applied by a doctor specialised in aesthetic medicine."
        },
        {
          title: "Tratamiento y vacaciones",
          titleEn: "Treatment and a holiday",
          tab: "Las vacaciones",
          tabEn: "The holiday",
          image: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&q=80&w=600",
          text: "La mayoría no tiene incapacidad: te tratas en la mañana y en la tarde estás en la playa.",
          textEn: "Most have no downtime: treatment in the morning, beach in the afternoon."
        }
      ]
    },
    // ⚠️ DATOS DE MUESTRA — reemplazar por información verificable antes de publicar.
    priceFrom: "$250 USD",
    reviews: [
      {
        quote: "Quería verme descansada, no operada, y eso fue exactamente lo que me explicaron desde la videollamada. Poca cantidad, bien puesta.",
        quoteEn: "I wanted to look rested, not done, and that's exactly what they explained from the video call. A small amount, well placed.",
        author: "Claudia Pérez",
        origin: "Miami, Estados Unidos",
        originEn: "Miami, United States",
        procedure: "Ácido hialurónico",
        procedureEn: "Hyaluronic acid",
        rating: 5
      },
      {
        quote: "Hice el HIFU el lunes y el martes ya estaba en Islas del Rosario, con protector solar y sombrero como me indicaron. Cero incapacidad.",
        quoteEn: "I had HIFU on Monday and on Tuesday I was at the Rosario Islands, with sunscreen and a hat as instructed. Zero downtime.",
        author: "Emily Carter",
        origin: "Atlanta, Estados Unidos",
        originEn: "Atlanta, United States",
        procedure: "HIFU facial",
        procedureEn: "Facial HIFU",
        rating: 5
      },
      {
        quote: "Me mostraron la caja sellada del producto antes de aplicarlo y el número de lote quedó en mi historia. Eso no me lo hacen en mi país.",
        quoteEn: "They showed me the sealed product box before applying it and the batch number went into my record. They don't do that back home.",
        author: "Verónica Salas",
        origin: "Santiago, Chile",
        originEn: "Santiago, Chile",
        procedure: "Toxina botulínica",
        procedureEn: "Botulinum toxin",
        rating: 5
      },
      {
        quote: "El peeling funcionó muy bien, pero la descamación duró un par de días más de lo que pensé. Mejor dejarlo para el inicio del viaje, como te sugieren.",
        quoteEn: "The peel worked very well, but the peeling lasted a couple of days longer than I expected. Better to do it at the start of the trip, as they suggest.",
        author: "Natalia Ruiz",
        origin: "Toronto, Canadá",
        originEn: "Toronto, Canada",
        procedure: "Peeling químico",
        procedureEn: "Chemical peel",
        rating: 4
      }
    ],
    procedureDetails: [
      {
        name: "Aplicación de toxina botulínica",
        photo: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1000",
        nameEn: "Botulinum Toxin Application",
        description: "Relaja los músculos que forman arrugas de expresión en frente, entrecejo y patas de gallo. Producto con registro INVIMA, abierto frente a ti, y control a los 15 días para retocar si hace falta.",
        descriptionEn: "Relaxes the muscles that cause expression lines on the forehead, frown area and crow's feet. INVIMA-registered product opened in front of you, with a 15-day check to touch up if needed.",
        recovery: "Mismo día",
        recoveryEn: "Same day",
        sessions: "1 cita + control",
        sessionsEn: "1 appointment + check-up",
        priceFrom: "$250 USD",
        slug: "toxina-botulinica",
        heroTitle: "Tu toxina botulínica en Cartagena.",
        heroTitleEn: "Your botulinum toxin in Cartagena.",
        heroLead: "Producto con registro INVIMA abierto frente a ti, aplicado por una médica estética.",
        heroLeadEn: "INVIMA-registered product opened in front of you, applied by an aesthetic doctor.",
        idealFor: [
          "Líneas en frente, entrecejo o patas de gallo",
          "Quieres un efecto natural, sin cirugía",
          "No estás en embarazo ni lactancia"
        ],
        idealForEn: [
          "Lines on the forehead, frown area or crow's feet",
          "You want a natural effect, without surgery",
          "Not pregnant or breastfeeding"
        ],
        details: {
          question: "¿Qué es la toxina botulínica?",
          questionEn: "What is botulinum toxin?",
          whatIs: "Relaja los músculos que forman las arrugas de expresión en frente, entrecejo y patas de gallo. Se aplica con agujas muy finas y a los 15 días tienes un control para retocar si hace falta.",
          whatIsEn: "It relaxes the muscles that form expression lines on the forehead, frown area and crow's feet. It's applied with very fine needles, with a check-up at 15 days to touch up if needed.",
          anesthesia: "Sin anestesia",
          anesthesiaEn: "No anaesthetic",
          duration: "20 – 30 minutos",
          durationEn: "20 – 30 minutes",
          hospital: "Ambulatorio",
          hospitalEn: "Outpatient",
          shortName: "toxina botulínica",
          shortNameEn: "botulinum toxin",
          tagline: "Descansado, no congelado.",
          taglineEn: "Rested, not frozen.",
          concerns: [
            {
              title: "¿Duele?",
              titleEn: "Does it hurt?",
              text: "Son pinchazos muy finos y rápidos. No hace falta anestesia.",
              textEn: "Very fine, quick pricks. No anaesthetic needed."
            },
            {
              title: "¿Voy a quedar sin expresión?",
              titleEn: "Will I lose my expression?",
              text: "No. La dosis se calcula para suavizar las líneas, no para congelar tu cara.",
              textEn: "No. The dose is set to soften lines, not freeze your face."
            },
            {
              title: "¿Cuándo se ve el efecto?",
              titleEn: "When does it show?",
              text: "Empieza entre el día 3 y el 5 y está completo a las dos semanas.",
              textEn: "It starts between day 3 and 5 and is complete at two weeks."
            },
            {
              title: "¿Cuánto dura?",
              titleEn: "How long does it last?",
              text: "Normalmente entre 3 y 4 meses.",
              textEn: "Usually 3 to 4 months."
            },
            {
              title: "¿Puedo ir a la playa?",
              titleEn: "Can I go to the beach?",
              text: "Sí, desde el día siguiente, con protector. Las primeras 4 horas no te acuestes ni hagas ejercicio.",
              textEn: "Yes, from the next day, with sunscreen. For the first 4 hours don't lie down or exercise."
            },
            {
              title: "¿Es el producto original?",
              titleEn: "Is it the genuine product?",
              text: "Sí. Tiene registro INVIMA, se abre frente a ti y el lote queda en tu historia clínica.",
              textEn: "Yes. It's INVIMA-registered, opened in front of you and the batch goes into your record."
            }
          ]
        },
        why: {
          title: "¿Por qué hacerte la toxina en Colombia?",
          titleEn: "Why get toxin in Colombia?",
          lead: "Médicos estéticos con mucha práctica, productos certificados y cero incapacidad en plenas vacaciones.",
          leadEn: "Experienced aesthetic doctors, certified products and zero downtime on holiday.",
          reasons: [
            {
              tab: "El producto",
              tabEn: "The product",
              title: "Lo abren frente a ti",
              titleEn: "Opened in front of you",
              text: "Cada producto se abre frente a ti y el lote queda en tu historia clínica.",
              textEn: "Every product is opened in front of you and the batch goes into your record.",
              image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=1200",
              stat: "INVIMA",
              statEn: "INVIMA",
              statLabel: "registro de cada producto",
              statLabelEn: "registration on every product"
            },
            {
              tab: "La médica",
              tabEn: "The doctor",
              title: "Médicos, no esteticistas",
              titleEn: "Doctors, not beauticians",
              text: "Lo aplica una médica especialista en medicina estética.",
              textEn: "It's applied by a doctor specialised in aesthetic medicine.",
              image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1200"
            },
            {
              tab: "La ciudad",
              tabEn: "The city",
              title: "Tratamiento y vacaciones",
              titleEn: "Treatment and a holiday",
              text: "Te tratas en la mañana y en la tarde sigues con tu viaje.",
              textEn: "Treatment in the morning, and in the afternoon you carry on with your trip.",
              image: "https://images.unsplash.com/photo-1534943441045-1009d7cb0bb9?auto=format&fit=crop&q=80&w=1200",
              stat: "28°",
              statEn: "82°F",
              statLabel: "en Cartagena todo el año",
              statLabelEn: "in Cartagena year-round"
            }
          ]
        }
      },
      {
        name: "Relleno con ácido hialurónico",
        photo: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=1000",
        nameEn: "Hyaluronic Acid Fillers",
        description: "Devuelve volumen a pómulos, labios, surcos u ojeras con un gel reabsorbible. Se aplica con cánula para reducir morados y, si algo no te convence, es reversible con hialuronidasa.",
        descriptionEn: "Restores volume to cheeks, lips, folds or under-eyes with a resorbable gel. Applied with a cannula to reduce bruising and, if anything doesn't convince you, it's reversible with hyaluronidase.",
        recovery: "1 - 2 días",
        recoveryEn: "1 - 2 days",
        sessions: "1 cita + control",
        sessionsEn: "1 appointment + check-up",
        priceFrom: "$380 USD por jeringa",
        slug: "acido-hialuronico",
        heroTitle: "Tu ácido hialurónico en Cartagena.",
        heroTitleEn: "Your hyaluronic acid filler in Cartagena.",
        heroLead: "Volumen natural en pómulos, labios u ojeras, aplicado con cánula y reversible.",
        heroLeadEn: "Natural volume in cheeks, lips or under-eyes, applied with a cannula and reversible.",
        idealFor: [
          "Pérdida de volumen en pómulos, labios o surcos",
          "Ojeras marcadas",
          "Quieres un cambio sutil, sin cirugía"
        ],
        idealForEn: [
          "Lost volume in cheeks, lips or folds",
          "Deep under-eye hollows",
          "A subtle change, without surgery"
        ],
        details: {
          question: "¿Qué es el relleno con ácido hialurónico?",
          questionEn: "What is hyaluronic acid filler?",
          whatIs: "Un gel que tu cuerpo reabsorbe con el tiempo devuelve volumen a pómulos, labios, surcos u ojeras. Se aplica con cánula para reducir morados y, si algo no te convence, se puede revertir.",
          whatIsEn: "A gel your body slowly reabsorbs restores volume to cheeks, lips, folds or under-eyes. It's applied with a cannula to reduce bruising and, if anything doesn't convince you, it can be reversed.",
          anesthesia: "Anestesia tópica",
          anesthesiaEn: "Topical anaesthetic",
          duration: "30 – 45 minutos",
          durationEn: "30 – 45 minutes",
          hospital: "Ambulatorio",
          hospitalEn: "Outpatient",
          shortName: "ácido hialurónico",
          shortNameEn: "hyaluronic acid",
          tagline: "Volumen donde se perdió.",
          taglineEn: "Volume where it was lost.",
          concerns: [
            {
              title: "¿Duele?",
              titleEn: "Does it hurt?",
              text: "Muy poco: se usa crema anestésica y el producto trae anestesia incluida.",
              textEn: "Very little: numbing cream is used and the product contains anaesthetic."
            },
            {
              title: "¿Se va a notar?",
              titleEn: "Will it be obvious?",
              text: "La idea es que te veas descansado, no operado: poca cantidad, bien puesta.",
              textEn: "The aim is to look rested, not done: a small amount, well placed."
            },
            {
              title: "¿Y si no me gusta?",
              titleEn: "What if I don't like it?",
              text: "Es reversible con hialuronidasa, una enzima que lo disuelve.",
              textEn: "It's reversible with hyaluronidase, an enzyme that dissolves it."
            },
            {
              title: "¿Cuánto dura?",
              titleEn: "How long does it last?",
              text: "Según la zona, entre 6 y 12 meses.",
              textEn: "Depending on the area, 6 to 12 months."
            },
            {
              title: "¿Me quedan morados?",
              titleEn: "Will I bruise?",
              text: "Con cánula son menos. Si aparece alguno, se disimula con maquillaje.",
              textEn: "Fewer with a cannula. If one appears, make-up covers it."
            },
            {
              title: "¿Puedo ir a la playa?",
              titleEn: "Can I go to the beach?",
              text: "Espera 48 horas antes del sol fuerte y el calor. Mientras tanto, planes a la sombra.",
              textEn: "Wait 48 hours before strong sun and heat. Until then, shaded plans."
            }
          ]
        },
        why: {
          title: "¿Por qué hacerte rellenos en Colombia?",
          titleEn: "Why get fillers in Colombia?",
          lead: "Médicos con práctica en anatomía facial y productos certificados, en una ciudad para quedarse unos días.",
          leadEn: "Doctors trained in facial anatomy and certified products, in a city worth staying a few days.",
          reasons: [
            {
              tab: "Reversible",
              tabEn: "Reversible",
              title: "Nada es definitivo",
              titleEn: "Nothing is permanent",
              text: "Si algo no te gusta, se revierte con hialuronidasa.",
              textEn: "If you don't like something, it's reversed with hyaluronidase.",
              image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=1200",
              stat: "100%",
              statEn: "100%",
              statLabel: "reversible si no te convence",
              statLabelEn: "reversible if you're not convinced"
            },
            {
              tab: "El producto",
              tabEn: "The product",
              title: "Lo abren frente a ti",
              titleEn: "Opened in front of you",
              text: "Cada jeringa se abre frente a ti y el lote queda en tu historia.",
              textEn: "Every syringe is opened in front of you and the batch goes into your record.",
              image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=1200",
              stat: "INVIMA",
              statEn: "INVIMA",
              statLabel: "registro de cada producto",
              statLabelEn: "registration on every product"
            },
            {
              tab: "La ciudad",
              tabEn: "The city",
              title: "Dos días a la sombra, luego playa",
              titleEn: "Two days in the shade, then the beach",
              text: "Centro histórico y Getsemaní al atardecer mientras pasan las 48 horas.",
              textEn: "The Old Town and Getsemaní at sunset while the 48 hours pass.",
              image: "https://images.unsplash.com/photo-1534943441045-1009d7cb0bb9?auto=format&fit=crop&q=80&w=1200",
              stat: "28°",
              statEn: "82°F",
              statLabel: "en Cartagena todo el año",
              statLabelEn: "in Cartagena year-round"
            }
          ]
        }
      },
      {
        name: "Peeling químico profundo",
        photo: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=1000",
        nameEn: "Deep Chemical Peeling",
        description: "Renueva las capas superficiales de la piel para tratar manchas, cicatrices de acné y textura irregular. La piel se descama durante unos días, por eso lo programamos al inicio del viaje.",
        descriptionEn: "Renews the outer layers of the skin to treat dark spots, acne scars and uneven texture. The skin peels for a few days, which is why we schedule it at the start of the trip.",
        recovery: "5 - 7 días",
        recoveryEn: "5 - 7 days",
        sessions: "1 sesión + 2 controles",
        sessionsEn: "1 session + 2 check-ups",
        priceFrom: "$450 USD",
        slug: "peeling-quimico",
        heroTitle: "Tu peeling químico en Cartagena.",
        heroTitleEn: "Your chemical peel in Cartagena.",
        heroLead: "Piel renovada para manchas, cicatrices de acné y textura, programado al inicio de tu viaje.",
        heroLeadEn: "Renewed skin for spots, acne scars and texture, scheduled at the start of your trip.",
        idealFor: [
          "Manchas o tono irregular",
          "Cicatrices de acné o textura irregular",
          "Disposición a evitar el sol durante la recuperación"
        ],
        idealForEn: [
          "Dark spots or uneven tone",
          "Acne scars or uneven texture",
          "Willing to avoid the sun during recovery"
        ],
        details: {
          question: "¿Qué es el peeling químico profundo?",
          questionEn: "What is a deep chemical peel?",
          whatIs: "Una solución aplicada por tu médica renueva las capas superficiales de la piel. Trata manchas, cicatrices de acné y textura; la piel se descama unos días y aparece una piel nueva.",
          whatIsEn: "A solution applied by your doctor renews the outer layers of the skin. It treats spots, acne scars and texture; the skin peels for a few days and new skin appears.",
          anesthesia: "Anestesia tópica",
          anesthesiaEn: "Topical anaesthetic",
          duration: "45 – 60 minutos",
          durationEn: "45 – 60 minutes",
          hospital: "Ambulatorio",
          hospitalEn: "Outpatient",
          shortName: "peeling químico",
          shortNameEn: "chemical peel",
          tagline: "Piel nueva, sin manchas.",
          taglineEn: "New skin, without spots.",
          hotelText: "La piel se descama unos días: hidratación, sombra y protector. Por eso lo hacemos al inicio del viaje.",
          hotelTextEn: "Your skin peels for a few days: moisture, shade and sunscreen. That's why we do it at the start of the trip.",
          concerns: [
            {
              title: "¿Duele?",
              titleEn: "Does it hurt?",
              text: "Se siente ardor mientras se aplica, controlado por tu médica. Después, la piel se siente tirante.",
              textEn: "You feel a burning sensation while it's applied, controlled by your doctor. Afterwards the skin feels tight."
            },
            {
              title: "¿Cuánto dura la descamación?",
              titleEn: "How long does peeling last?",
              text: "Entre 5 y 7 días. Por eso lo programamos al inicio del viaje.",
              textEn: "5 to 7 days. That's why we schedule it at the start of the trip."
            },
            {
              title: "¿Puedo ir a la playa?",
              titleEn: "Can I go to the beach?",
              text: "Esa semana no. Dejamos la playa para el final del viaje y los primeros días hay planes a la sombra.",
              textEn: "Not that week. We leave the beach for the end of the trip and plan shaded outings first."
            },
            {
              title: "¿Para qué sirve?",
              titleEn: "What does it treat?",
              text: "Manchas, cicatrices de acné, poros y textura irregular.",
              textEn: "Spots, acne scars, pores and uneven texture."
            },
            {
              title: "¿Cuándo veo el resultado?",
              titleEn: "When will I see the result?",
              text: "Al terminar la descamación ya ves la piel nueva, y sigue mejorando las semanas siguientes.",
              textEn: "Once peeling ends you already see the new skin, and it keeps improving over the following weeks."
            },
            {
              title: "¿Sirve para piel morena?",
              titleEn: "Does it work on darker skin?",
              text: "Sí. Tu médica ajusta el tipo y la profundidad del peeling a tu tipo de piel.",
              textEn: "Yes. Your doctor adjusts the type and depth of the peel to your skin type."
            }
          ]
        },
        why: {
          title: "¿Por qué hacerte el peeling en Colombia?",
          titleEn: "Why get a peel in Colombia?",
          lead: "Una médica estética decide la profundidad y te acompaña durante toda la descamación.",
          leadEn: "An aesthetic doctor decides the depth and supports you throughout the peeling.",
          reasons: [
            {
              tab: "El plan",
              tabEn: "The plan",
              title: "Programado al inicio del viaje",
              titleEn: "Scheduled at the start of the trip",
              text: "Te tratamos al llegar para que la descamación pase antes de la playa.",
              textEn: "We treat you on arrival so the peeling is over before the beach.",
              image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=1200",
              stat: "Día 1",
              statEn: "Day 1",
              statLabel: "del viaje, la playa al final",
              statLabelEn: "of the trip, the beach at the end"
            },
            {
              tab: "La médica",
              tabEn: "The doctor",
              title: "Médicos, no esteticistas",
              titleEn: "Doctors, not beauticians",
              text: "Lo aplica y lo controla una médica especialista en medicina estética.",
              textEn: "It's applied and followed up by a doctor specialised in aesthetic medicine.",
              image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1200"
            },
            {
              tab: "Los controles",
              tabEn: "Check-ups",
              title: "Te revisan mientras sanas",
              titleEn: "Checked while you heal",
              text: "Dos controles presenciales para ver cómo evoluciona tu piel.",
              textEn: "Two in-person check-ups to see how your skin is healing.",
              image: "https://images.unsplash.com/photo-1534943441045-1009d7cb0bb9?auto=format&fit=crop&q=80&w=1200",
              stat: "2",
              statEn: "2",
              statLabel: "controles durante tu estadía",
              statLabelEn: "check-ups during your stay"
            }
          ]
        }
      },
      {
        name: "Tensado facial con HIFU",
        photo: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000",
        nameEn: "Facial Tightening with HIFU",
        description: "Ultrasonido focalizado que estimula colágeno en capas profundas y tensa óvalo facial, papada y cuello sin cortes ni agujas. El efecto se completa en 2 a 3 meses.",
        descriptionEn: "Focused ultrasound that stimulates collagen in deep layers and tightens the jawline, double chin and neck without cuts or needles. The effect completes in 2 to 3 months.",
        recovery: "Mismo día",
        recoveryEn: "Same day",
        sessions: "1 sesión",
        sessionsEn: "1 session",
        priceFrom: "$600 USD",
        slug: "hifu",
        heroTitle: "Tu HIFU facial en Cartagena.",
        heroTitleEn: "Your facial HIFU in Cartagena.",
        heroLead: "Tensa óvalo facial, papada y cuello con ultrasonido, sin cortes ni agujas.",
        heroLeadEn: "Tightens jawline, double chin and neck with ultrasound, no cuts or needles.",
        idealFor: [
          "Flacidez leve o moderada en óvalo, papada o cuello",
          "Quieres un efecto sin cirugía ni agujas",
          "Buscas un resultado gradual y natural"
        ],
        idealForEn: [
          "Mild to moderate laxity in jawline, chin or neck",
          "An effect without surgery or needles",
          "A gradual, natural result"
        ],
        details: {
          question: "¿Qué es el HIFU?",
          questionEn: "What is HIFU?",
          whatIs: "Un ultrasonido focalizado estimula el colágeno en las capas profundas de la piel y tensa el óvalo facial, la papada y el cuello, sin cortes ni agujas.",
          whatIsEn: "Focused ultrasound stimulates collagen in the deep layers of the skin and tightens the jawline, double chin and neck, without cuts or needles.",
          anesthesia: "Sin anestesia",
          anesthesiaEn: "No anaesthetic",
          duration: "45 – 90 minutos",
          durationEn: "45 – 90 minutes",
          hospital: "Ambulatorio",
          hospitalEn: "Outpatient",
          shortName: "HIFU",
          shortNameEn: "HIFU",
          tagline: "Tensa sin cortes ni agujas.",
          taglineEn: "Tightens without cuts or needles.",
          concerns: [
            {
              title: "¿Duele?",
              titleEn: "Does it hurt?",
              text: "Sientes calor y pequeños pinchazos en algunas zonas. Es tolerable y no hace falta anestesia.",
              textEn: "You feel heat and small pricks in some areas. It's tolerable and needs no anaesthetic."
            },
            {
              title: "¿Cuándo veo el resultado?",
              titleEn: "When will I see the result?",
              text: "Notas algo desde el primer día, pero el efecto completo llega entre los 2 y 3 meses.",
              textEn: "You notice something from day one, but the full effect arrives at 2 to 3 months."
            },
            {
              title: "¿Cuánto dura?",
              titleEn: "How long does it last?",
              text: "Suele durar alrededor de un año, según tu piel.",
              textEn: "It usually lasts around a year, depending on your skin."
            },
            {
              title: "¿Puedo ir a la playa al día siguiente?",
              titleEn: "Can I go to the beach the next day?",
              text: "Sí, con protector y sombrero.",
              textEn: "Yes, with sunscreen and a hat."
            },
            {
              title: "¿Reemplaza un lifting?",
              titleEn: "Does it replace a facelift?",
              text: "No. Es para flacidez leve o moderada; tu médica te dice con franqueza si es tu caso.",
              textEn: "No. It's for mild to moderate laxity; your doctor tells you frankly whether it fits your case."
            },
            {
              title: "¿Queda roja la piel?",
              titleEn: "Does the skin get red?",
              text: "Puede haber un enrojecimiento leve unas horas.",
              textEn: "There may be mild redness for a few hours."
            }
          ]
        },
        why: {
          title: "¿Por qué hacerte el HIFU en Colombia?",
          titleEn: "Why get HIFU in Colombia?",
          lead: "Un tratamiento sin incapacidad, aplicado por una médica, en plena ciudad de vacaciones.",
          leadEn: "A no-downtime treatment, applied by a doctor, in a holiday city.",
          reasons: [
            {
              tab: "Sin cortes",
              tabEn: "No cuts",
              title: "Solo ultrasonido",
              titleEn: "Just ultrasound",
              text: "No hay heridas ni agujas: sales del consultorio a seguir tu viaje.",
              textEn: "No wounds, no needles: you walk out of the clinic and carry on with your trip.",
              image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200",
              stat: "0",
              statEn: "0",
              statLabel: "cortes, 0 agujas",
              statLabelEn: "cuts, 0 needles"
            },
            {
              tab: "El efecto",
              tabEn: "The effect",
              title: "Un cambio que sigue creciendo",
              titleEn: "A change that keeps building",
              text: "El colágeno se sigue formando cuando ya estás en casa.",
              textEn: "Collagen keeps forming once you're back home.",
              image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1200",
              stat: "2–3",
              statEn: "2–3",
              statLabel: "meses para el efecto completo",
              statLabelEn: "months to the full effect"
            },
            {
              tab: "La ciudad",
              tabEn: "The city",
              title: "Mañana HIFU, tarde en las islas",
              titleEn: "HIFU in the morning, islands in the afternoon",
              text: "Con protector y sombrero puedes ir a la playa desde el día siguiente.",
              textEn: "With sunscreen and a hat you can go to the beach from the next day.",
              image: "https://images.unsplash.com/photo-1534943441045-1009d7cb0bb9?auto=format&fit=crop&q=80&w=1200",
              stat: "28°",
              statEn: "82°F",
              statLabel: "en Cartagena todo el año",
              statLabelEn: "in Cartagena year-round"
            }
          ]
        }
      }
    ],
    doctor: {
      name: "Dra. Valentina Ospina",
      title: "Médica · Especialista en Medicina Estética",
      titleEn: "Physician · Specialist in Aesthetic Medicine",
      registry: "Registro Médico 13.562 · Bolívar",
      yearsExperience: 11,
      credentials: [
        "Especialización en Medicina Estética — Universidad CES, Medellín",
        "Formación avanzada en anatomía facial e inyectables — Barcelona, España",
        "Miembro de la Asociación Colombiana de Medicina Estética (ACME)",
        "Más de 5.000 tratamientos faciales no quirúrgicos"
      ],
      credentialsEn: [
        "Specialization in Aesthetic Medicine — Universidad CES, Medellín",
        "Advanced training in facial anatomy and injectables — Barcelona, Spain",
        "Member of the Colombian Association of Aesthetic Medicine (ACME)",
        "Over 5,000 non-surgical facial treatments"
      ],
      photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=600",
      quote: "El mejor tratamiento es el que nadie nota como tratamiento. Prefiero quedarme corta y retocar a los quince días que pasarme: lo que se agrega siempre se puede sumar, lo que sobra cuesta quitarlo.",
      quoteEn: "The best treatment is one nobody notices as a treatment. I'd rather fall short and touch up at fifteen days than overdo it: you can always add more, but excess is hard to take away."
    },
    journey: [
      {
        label: "Antes de viajar",
        photo: "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&q=80&w=1000",
        labelEn: "Before you travel",
        detail: "Videollamada con tu médica para revisar fotos de tu rostro, definir el plan y cotizarlo cerrado. Te decimos qué suspender (aspirina, suplementos) antes de llegar.",
        detailEn: "A video call with your doctor to review photos of your face, define the plan and give a closed quote. We tell you what to pause (aspirin, supplements) before arriving."
      },
      {
        label: "Llegada",
        photo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1000",
        labelEn: "Arrival",
        detail: "Te recogemos en el aeropuerto Rafael Núñez y te llevamos al hotel en Bocagrande o el Centro Histórico. SIM con datos y contacto 24/7.",
        detailEn: "We pick you up at Rafael Núñez airport and take you to your hotel in Bocagrande or the Old Town. SIM with data and a 24/7 contact."
      },
      {
        label: "Tratamiento",
        photo: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000",
        labelEn: "Treatment",
        detail: "Valoración presencial y tratamiento el mismo día o el siguiente. Si combinas varios, los ordenamos para que los de más recuperación queden al principio.",
        detailEn: "In-person assessment and treatment the same or next day. If you combine several, we order them so the ones with longer recovery come first."
      },
      {
        label: "Tu tiempo libre",
        photo: "https://images.unsplash.com/photo-1583531352515-8884af319dc1?auto=format&fit=crop&q=80&w=1000",
        labelEn: "Your free time",
        detail: "Plan de ciudad ajustado a cada tratamiento: qué días puedes ir a la playa, cuándo evitar el sol y cuándo no hacer ejercicio.",
        detailEn: "A city plan adapted to each treatment: which days you can go to the beach, when to avoid the sun and when to skip exercise."
      },
      {
        label: "Control",
        photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000",
        labelEn: "Check-up",
        detail: "Control presencial antes de tu regreso o virtual a los 15 días para toxina y rellenos. Los retoques dentro del plan no tienen costo.",
        detailEn: "An in-person check-up before you leave, or a virtual one at 15 days for toxin and fillers. Touch-ups within the plan are free."
      },
      {
        label: "Al volver a casa",
        photo: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=1000",
        labelEn: "Back home",
        detail: "Informe con productos, lotes y dosis aplicadas, en tu idioma, para que cualquier médico pueda continuar tu tratamiento.",
        detailEn: "A report with the products, batch numbers and doses applied, in your language, so any doctor can continue your treatment."
      }
    ],
    packageIncludes: [
      "Valoración virtual previa y plan de tratamiento por escrito",
      "Tratamiento con productos con registro INVIMA, abiertos frente a ti",
      "Anestesia tópica y cuidados posteriores",
      "Retoque en el control si hace falta, sin costo",
      "Traslados aeropuerto — hotel — consultorio",
      "Hospedaje en zona segura cerca del consultorio",
      "Médicos que te atienden en tu idioma",
      "Informe con productos, lotes y dosis aplicadas"
    ],
    packageIncludesEn: [
      "Prior virtual assessment and written treatment plan",
      "Treatment with INVIMA-registered products opened in front of you",
      "Topical anaesthesia and aftercare",
      "Touch-up at the check-up if needed, at no cost",
      "Airport — hotel — clinic transfers",
      "Accommodation in a safe area near the clinic",
      "Doctors who treat you in your language",
      "Report with products, batch numbers and doses applied"
    ],
    packageExcludes: [
      "Tiquetes aéreos internacionales",
      "Seguro médico de viaje",
      "Productos de cuidado en casa (protector solar, cremas)",
      "Tratamientos adicionales no previstos en la valoración"
    ],
    packageExcludesEn: [
      "International flights",
      "Travel medical insurance",
      "Home-care products (sunscreen, creams)",
      "Additional treatments not foreseen in the assessment"
    ],
    cityGuide: {
      city: "Cartagena",
      intro: "Los tratamientos no quirúrgicos casi no te quitan tiempo de viaje: la mayoría permite salir el mismo día. La única regla seria en Cartagena es el sol: protector cada dos horas y sombra los días posteriores a un peeling.",
      introEn: "Non-surgical treatments barely take time from your trip: most let you go out the same day. The only serious rule in Cartagena is the sun: sunscreen every two hours and shade in the days after a peel.",
      climate: "Caribe cálido y húmedo, 28 a 32 °C todo el año. Recomendamos tratar temprano en el día y evitar el sol directo del mediodía.",
      climateEn: "Warm, humid Caribbean, 28 to 32 °C year-round. We recommend morning treatments and avoiding direct midday sun.",
      activities: [
        {
          name: "Centro Histórico amurallado",
          nameEn: "The walled Old Town",
          note: "Recorrido al atardecer, cuando baja el sol. Apto desde el mismo día para toxina, HIFU y rellenos.",
          noteEn: "A walk at sunset, when the sun is low. Fine from the same day for toxin, HIFU and fillers.",
          when: "Día 1",
          whenEn: "Day 1",
          where: "al atardecer",
          whereEn: "at sunset",
          tag: "28 °C afuera",
          tagEn: "28 °C outside",
          tone: "linear-gradient(170deg, #d6b37a, #a0703c)",
          photo: "https://images.unsplash.com/photo-1534943441045-1009d7cb0bb9?auto=format&fit=crop&q=80&w=1200"
        },
        {
          name: "Getsemaní",
          nameEn: "Getsemaní",
          note: "Murales, plazas y restaurantes. Plan nocturno sin exposición solar.",
          noteEn: "Murals, squares and restaurants. An evening plan with no sun exposure.",
          when: "Día 2",
          whenEn: "Day 2",
          where: "de noche",
          whereEn: "at night",
          tag: "Sin sol",
          tagEn: "No sun",
          tone: "linear-gradient(170deg, #c98a7a, #7f4b3c)",
          photo: "https://images.unsplash.com/photo-1536308037887-165852797016?auto=format&fit=crop&q=80&w=1200"
        },
        {
          name: "Islas del Rosario",
          nameEn: "Rosario Islands",
          note: "Día de playa con sombra y protector. Espera 48 horas tras rellenos y evítala toda la semana del peeling.",
          noteEn: "A beach day with shade and sunscreen. Wait 48 hours after fillers and avoid it for the whole peel week.",
          when: "Día 4",
          whenEn: "Day 4",
          where: "día de playa",
          whereEn: "beach day",
          tag: "Con protector",
          tagEn: "With sunscreen",
          tone: "linear-gradient(170deg, #7ab8c9, #3c7f8a)"
        },
        {
          name: "Castillo de San Felipe",
          nameEn: "San Felipe Castle",
          note: "Visita temprano en la mañana. Evita agacharte mucho las primeras 4 horas tras la toxina.",
          noteEn: "Visit early in the morning. Avoid bending down a lot in the first 4 hours after toxin.",
          when: "Antes de volar",
          whenEn: "Before you fly",
          where: "temprano",
          whereEn: "early",
          tag: "Mañana fresca",
          tagEn: "Cool morning",
          tone: "linear-gradient(170deg, #b8a58a, #6f6252)",
          photo: "https://images.unsplash.com/photo-1633394027858-fff49145f120?auto=format&fit=crop&q=80&w=1200"
        }
      ]
    },
    preOpQuestions: [
      "¿El producto tiene registro INVIMA y puedo ver la caja y el lote?",
      "¿El tratamiento lo aplica un médico o un profesional no médico?",
      "¿Cuánto dura el efecto y cada cuánto tendría que repetirlo?",
      "¿Qué hago si tengo una reacción cuando ya estoy en mi país?",
      "¿Puedo tomar sol o hacer ejercicio después del tratamiento?"
    ],
    preOpQuestionsEn: [
      "Is the product INVIMA-registered, and can I see the box and batch number?",
      "Is the treatment applied by a doctor or by a non-medical professional?",
      "How long does the effect last, and how often would I need to repeat it?",
      "What do I do if I have a reaction once I'm back home?",
      "Can I sunbathe or exercise after the treatment?"
    ],
    clinicDetails: [
      {
        name: "Estética Premium (Cartagena)",
        note: "Consultorio médico habilitado en Bocagrande, a pasos de los hoteles. Es la sede donde atiende la Dra. Ospina.",
        noteEn: "A licensed medical practice in Bocagrande, steps from the hotels. This is where Dr. Ospina practices."
      },
      {
        name: "MedSkin Center (Medellín)",
        note: "Alternativa si combinas tu viaje con otra especialidad en Medellín. Mismos productos y mismo protocolo.",
        noteEn: "An alternative if you combine your trip with another specialty in Medellín. Same products and same protocol."
      }
    ],
    faqs: [
      {
        q: "¿Cuántos días debo quedarme en Colombia?",
        qEn: "How many days do I need to stay in Colombia?",
        a: "Con 3 o 4 días es suficiente para toxina, rellenos o HIFU. Para un peeling profundo recomendamos 7 días, para que te vean durante la descamación.",
        aEn: "3 or 4 days is enough for toxin, fillers or HIFU. For a deep peel we recommend 7 days, so you're seen during the peeling phase."
      },
      {
        q: "¿Cómo sé que el producto es original?",
        qEn: "How do I know the product is genuine?",
        a: "Solo usamos productos con registro INVIMA. La caja se abre frente a ti y el número de lote queda en tu historia clínica y en el informe que te llevas.",
        aEn: "We only use INVIMA-registered products. The box is opened in front of you and the batch number goes into your record and the report you take home."
      },
      {
        q: "¿Puedo combinar tratamientos en el mismo viaje?",
        qEn: "Can I combine treatments in the same trip?",
        a: "Sí, es lo más común. Tu médica los ordena para que los de más recuperación, como el peeling, vayan al inicio y los de efecto inmediato al final.",
        aEn: "Yes, it's the most common approach. Your doctor orders them so the ones with longer recovery, like the peel, go first and those with immediate effect go last."
      },
      {
        q: "¿El precio que me dan incluye todo?",
        qEn: "Does the price I'm quoted include everything?",
        a: "Incluye tratamiento, productos, retoque en el control, hospedaje y traslados. No incluye tiquetes, seguro, productos de cuidado en casa ni el acompañante bilingüe, que es opcional.",
        aEn: "It includes treatment, products, a touch-up at the check-up, accommodation and transfers. It does not include flights, insurance, home-care products or the bilingual companion, which is optional."
      },
      {
        q: "¿Qué pasa si no me gusta el resultado?",
        qEn: "What if I don't like the result?",
        a: "La toxina se retoca en el control de los 15 días y el ácido hialurónico es reversible con hialuronidasa. Por eso empezamos con cantidades conservadoras.",
        aEn: "Toxin is touched up at the 15-day check-up and hyaluronic acid is reversible with hyaluronidase. That's why we start with conservative amounts."
      }
    ],
    testimonial: {
      quote: "Quería verme descansada, no operada, y eso fue exactamente lo que me explicaron desde la videollamada. Hice el tratamiento el lunes y esa misma tarde estaba caminando por el Centro Histórico.",
      quoteEn: "I wanted to look rested, not done, and that's exactly what they explained on the video call. I had the treatment on Monday and that same afternoon I was walking through the Old Town.",
      author: "Claudia Pérez",
      origin: "Miami, Estados Unidos · Ácido hialurónico",
      originEn: "Miami, United States · Hyaluronic acid"
    }
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
    image: "https://images.unsplash.com/photo-1583531352515-8884af319dc1?auto=format&fit=crop&q=80&w=1000"
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

// ⚠️ ARTÍCULOS DE MUESTRA — solo para ver cómo se llena el diseño del blog.
// Reemplazar (o borrar desde el panel) por artículos reales antes de publicar.
const blogImg = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1600`;
const samplePost = (
  id: string,
  date: string,
  category: string,
  categoryEn: string,
  title: string,
  titleEn: string,
  excerpt: string,
  excerptEn: string,
  photo: string,
  readMinutes: number,
  featured?: boolean,
): BlogPost => ({
  id,
  title,
  titleEn,
  excerpt,
  excerptEn,
  content: "Artículo de muestra para ver el diseño del blog. El texto completo, con sus fuentes, llegará pronto.",
  contentEn: "Sample article to preview the blog design. The full text, with its sources, is coming soon.",
  author: "Equipo Bridge Care",
  date,
  category,
  categoryEn,
  image: blogImg(photo),
  readMinutes,
  featured,
});

export const defaultBlogPosts: BlogPost[] = [
  samplePost("dias-en-colombia-despues-de-lipo-hd", "2026-09-26", "Cirugía estética", "Aesthetic surgery",
    "¿Cuántos días quedarte en Colombia después de una lipo HD?", "How many days to stay in Colombia after HD lipo?",
    "Qué pasa cada día, cuándo puedes volar y por qué no conviene acortar la estadía.", "What happens each day, when you can fly and why you shouldn't cut the stay short.",
    "1519823551278-64ac92734fb1", 8, true),
  samplePost("laser-o-ultrasonido", "2026-09-24", "Ciencia", "Science",
    "Láser o ultrasonido: cómo trabaja cada tecnología en tu piel", "Laser or ultrasound: how each technology works on your skin",
    "Por qué uno actúa en la superficie y el otro llega hasta la grasa.", "Why one works on the surface and the other reaches the fat.",
    "1540555700478-4be289fbecef", 7),
  samplePost("guatape-en-un-dia", "2026-09-22", "Colombia y turismo", "Colombia and travel",
    "Guatapé en un día: cómo llegar y qué ver", "Guatapé in a day: getting there and what to see",
    "El pueblo de zócalos, la Piedra del Peñol y el embalse, a dos horas de Medellín.", "The town of painted façades, El Peñol Rock and the reservoir, two hours from Medellín.",
    "1598028060898-c117093edfcb", 6),
  samplePost("carillas-o-diseno-de-sonrisa", "2026-09-20", "Odontología", "Dentistry",
    "Carillas o diseño de sonrisa: cuál necesitas y cómo decidir", "Veneers or smile design: which you need and how to decide",
    "Las diferencias reales, cuántas citas toma cada uno y qué preguntar antes.", "The real differences, how many appointments each takes and what to ask first.",
    "1606811841689-23dfddce3e95", 6),
  samplePost("historia-de-las-carillas", "2026-09-18", "Ciencia", "Science",
    "De Hollywood a la pantalla 3D: casi cien años de carillas", "From Hollywood to the 3D screen: nearly a century of veneers",
    "La historia de cómo se volvieron finas, fuertes y digitales.", "How they became thin, strong and digital.",
    "1628177142898-93e36e4e3a50", 6),
  samplePost("clinicas-verdes", "2026-09-16", "Salud y planeta", "Health and planet",
    "Clínicas verdes: cómo un hospital reduce su huella sin tocar la calidad", "Green clinics: how a hospital cuts its footprint without touching quality",
    "Energía, residuos, agua y compras responsables: qué hacen las clínicas que se toman en serio el planeta.", "Energy, waste, water and responsible purchasing: what clinics that take the planet seriously do.",
    "1611148261486-4e315d904232", 7),
  samplePost("manga-o-bypass", "2026-09-14", "Bariatría", "Bariatrics",
    "Manga o bypass: las diferencias que importan", "Sleeve or bypass: the differences that matter",
    "Cómo funciona cada cirugía y qué tiene en cuenta tu cirujano para recomendarte una.", "How each surgery works and what your surgeon weighs when recommending one.",
    "1594882645126-14020914d58d", 7),
  samplePost("cartagena-para-recuperarte", "2026-09-12", "Colombia y turismo", "Colombia and travel",
    "Cartagena para recuperarte: sombra, mar y buenos tiempos", "Cartagena to recover: shade, sea and good timing",
    "Qué planes sí, cuáles esperan y a qué hora salir en el Caribe.", "Which plans work, which wait and when to go out in the Caribbean.",
    "1534943441045-1009d7cb0bb9", 5),
  samplePost("hifu-como-funciona", "2026-09-10", "Ciencia", "Science",
    "HIFU: cómo un ultrasonido tensa sin tocar la superficie", "HIFU: how ultrasound tightens without touching the surface",
    "El truco está en el punto focal, bajo la piel.", "The trick is the focal point, under the skin.",
    "1570172619644-dfd03ed5d881", 5),
  samplePost("toxina-en-vacaciones", "2026-09-08", "Estética", "Aesthetics",
    "Toxina botulínica en vacaciones: qué sí y qué no las primeras 24 horas", "Botulinum toxin on holiday: dos and don'ts for the first 24 hours",
    "El tratamiento más corto del turismo médico, bien hecho.", "The shortest treatment in medical tourism, done right.",
    "1616394584738-fc6e612e71b9", 4),
  samplePost("plaza-botero-y-el-centro", "2026-09-06", "Colombia y turismo", "Colombia and travel",
    "Plaza Botero y el centro de Medellín en una tarde", "Botero Plaza and downtown Medellín in an afternoon",
    "Esculturas, museo y los cafés de siempre, sin caminatas largas.", "Sculptures, a museum and classic cafés, without long walks.",
    "1672263120758-2c2c02eaf977", 5),
  {
    id: "por-que-colombia-turismo-medico",
    title: "¿Por qué elegir Colombia para tu tratamiento médico?",
    titleEn: "Why Choose Colombia for Your Medical Treatment?",
    excerpt: "Conoce las tres razones clave: calidad acreditada, costos hasta un 70% menores y la oportunidad de una recuperación en el paraíso.",
    excerptEn: "Discover the three key reasons: accredited quality, costs up to 70% lower, and the chance to recover in paradise.",
    content: "Colombia se ha posicionado como uno de los principales destinos de turismo de salud en el mundo. Según la revista AméricaEconomía, varias de las mejores clínicas de Latinoamérica están en Colombia. Los costos de los procedimientos en cirugía plástica, odontología y bariatría son sustancialmente inferiores a los de Estados Unidos y Europa, no por falta de calidad, sino por el costo de vida y los tipos de cambio de divisas favorables. Además, los médicos colombianos a menudo realizan sus estudios y subespecialidades en el exterior, trayendo tecnologías y técnicas pioneras al país.",
    contentEn: "Colombia has positioned itself as one of the top health tourism destinations globally. According to AmericaEconomia magazine, several of the best clinics in Latin America are located in Colombia. Treatment costs in plastic surgery, dentistry, and bariatrics are substantially lower than in the US and Europe, not due to lack of quality, but due to cost of living and favorable exchange rates. Furthermore, Colombian doctors frequently complete their training and subspecialties abroad, introducing pioneering technologies and techniques to the country.",
    // ⚠️ Autor de muestra: poner el nombre real de quien firma.
    author: "Equipo Bridge Care",
    date: "2026-05-18",
    category: "Colombia y turismo",
    categoryEn: "Colombia and travel",
    image: "https://images.unsplash.com/photo-1512250431446-d0b4b57b27ec?auto=format&fit=crop&q=80&w=1600",
    readMinutes: 4
  },
  {
    id: "preparacion-viaje-medico-colombia",
    title: "Guía de preparación para tu viaje de salud",
    titleEn: "Preparation Guide for Your Medical Travel",
    excerpt: "Desde la primera consulta virtual hasta tu regreso a casa, detallamos el paso a paso del viaje.",
    excerptEn: "From the first virtual consultation to your trip back home, we detail the step-by-step journey.",
    content: "Viajar para recibir tratamiento médico requiere una planificación detallada. El primer paso es una videollamada de valoración con el especialista. Una vez aprobado tu plan médico, coordinamos las fechas de viaje. Recomendamos comprar los vuelos con flexibilidad. Al llegar, te recogemos en el aeropuerto y te llevamos a tu hotel de recuperación. Tu especialista te atiende en tu idioma en la cirugía y en los controles; si quieres, sumamos un acompañante bilingüe por un costo adicional. Asegúrate de viajar con ropa cómoda y de seguir todas las instrucciones prequirúrgicas que te entreguemos.",
    contentEn: "Traveling for medical care requires detailed planning. The first step is a virtual assessment call with the specialist. Once your medical plan is approved, we coordinate your travel dates. We recommend booking flexible flights. On arrival, we pick you up at the airport and take you to your recovery hotel. Your specialist sees you in your language at surgery and at your check-ups; if you'd like, we add a bilingual companion at an extra cost. Make sure to pack comfortable clothing and follow all the pre-surgical guidelines we give you.",
    // ⚠️ Autor de muestra: poner el nombre real de quien firma.
    author: "Equipo Bridge Care",
    date: "2026-05-15",
    category: "Colombia y turismo",
    categoryEn: "Colombia and travel",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1600",
    readMinutes: 3
  },
  {
    id: "garantias-y-seguridad-en-cirugia",
    title: "¿Qué garantías médicas ofrece Bridge Care?",
    titleEn: "What Medical Guarantees Does Bridge Care Offer?",
    excerpt: "Tu salud y tranquilidad son lo primero. Conoce con quién trabajamos y cómo puedes verificarlo.",
    excerptEn: "Your health and peace of mind come first. Learn who we work with and how you can verify it.",
    content: "En Bridge Care, tu seguridad es innegociable. Trabajamos únicamente con cirujanos miembros de sociedades científicas reconocidas (como la Sociedad Colombiana de Cirugía Plástica o la Federación Odontológica Colombiana) y con clínicas habilitadas por las autoridades de salud de Colombia. Antes de reservar sabes el nombre de tu especialista y su registro médico, para que lo verifiques tú mismo en el ReTHUS del Ministerio de Salud.",
    contentEn: "At Bridge Care, your safety is non-negotiable. We only work with surgeons who are members of recognized scientific societies (such as the Colombian Society of Plastic Surgery or the Colombian Odontological Federation) and with clinics licensed by Colombia's health authorities. Before booking you know your specialist's name and medical registry number, so you can check it yourself in the Ministry of Health's ReTHUS registry.",
    // ⚠️ Autor de muestra: poner el nombre real de quien firma.
    author: "Equipo Bridge Care",
    date: "2026-05-10",
    category: "Garantías",
    categoryEn: "Guarantees",
    image: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=80&w=1600",
    readMinutes: 3
  }
];

// Storage keys are versioned on purpose: every time the shape or content of
// the default data changes (e.g. a specialty gets new fields), bump the
// suffix below. That way a returning visitor's stale cached copy is simply
// never found under the new key, and falls back to the fresh defaults,
// instead of silently hiding new content behind a fragile "does this look
// old?" guess.
// Bumped to v3 when the specialty records gained doctor / journey / cityGuide /
// faqs. Without a new key, returning visitors keep the old stored copy forever
// and never see added content. v4: the other three specialties gained the same
// full content as dentistry. v5: heroImage / heroPosition. v6: heroTitle / heroLead. v7: procedure pages. v8: why-Colombia blocks. v9: reason images. v10: procedure details. v11: patient concerns. v12: photo swaps. v13: why-Colombia scenes. v14: stay track, stat cards. v15: short tabs. v16: trip hero. v17: no risk talk in FAQ.
export const SPECIALTIES_KEY = "bc_specialties_v21";
export const DESTINATIONS_KEY = "bc_destinations_v2";
export const BLOG_KEY = "bc_blog_v5";

// Helper functions that safely check for window/localStorage
export function getStoredSpecialties(): Specialty[] {
  if (typeof window === "undefined") return defaultSpecialties;
  const stored = localStorage.getItem(SPECIALTIES_KEY);
  if (!stored) {
    localStorage.setItem(SPECIALTIES_KEY, JSON.stringify(defaultSpecialties));
    return defaultSpecialties;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return defaultSpecialties;
  }
}

export function saveSpecialties(specialties: Specialty[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SPECIALTIES_KEY, JSON.stringify(specialties));
  window.dispatchEvent(new Event("bc_db_update"));
}

export function getStoredDestinations(): Destination[] {
  if (typeof window === "undefined") return defaultDestinations;
  const stored = localStorage.getItem(DESTINATIONS_KEY);
  if (!stored) {
    localStorage.setItem(DESTINATIONS_KEY, JSON.stringify(defaultDestinations));
    return defaultDestinations;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return defaultDestinations;
  }
}

export function saveDestinations(destinations: Destination[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DESTINATIONS_KEY, JSON.stringify(destinations));
  window.dispatchEvent(new Event("bc_db_update"));
}

export function getStoredBlogPosts(): BlogPost[] {
  if (typeof window === "undefined") return defaultBlogPosts;
  const stored = localStorage.getItem(BLOG_KEY);
  if (!stored) {
    localStorage.setItem(BLOG_KEY, JSON.stringify(defaultBlogPosts));
    return defaultBlogPosts;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return defaultBlogPosts;
  }
}

export function saveBlogPosts(posts: BlogPost[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(BLOG_KEY, JSON.stringify(posts));
  window.dispatchEvent(new Event("bc_db_update"));
}
