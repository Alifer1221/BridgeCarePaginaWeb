// The partner doctors shown on Nosotros ("Detrás de cada viaje, un especialista
// con nombre"). One entry per doctor; the counts by specialty are computed
// from this list, so adding or removing a doctor updates everything.
//
// ⚠️ REFERENCE DATA: the photos are stock portraits (Unsplash) and the names
// are empty. Replace each entry with a real partner doctor (name, specialty,
// photo) before going live. While `name` is empty the card shows only the
// specialty. The medical registry number is intentionally not shown.

export interface PartnerDoctor {
  name: string;
  specialty: string;
  specialtyEn: string;
  /** URL or /public path. Portrait, face in the upper third. */
  photo: string;
  /** Languages the doctor sees patients in. */
  languages: string[];
}

const ref = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=700&h=880`;

const PLASTIC = { specialty: "Cirugía estética", specialtyEn: "Aesthetic surgery" };
const DENTAL = { specialty: "Odontología", specialtyEn: "Dentistry" };
const BARIATRIC = { specialty: "Bariatría", specialtyEn: "Bariatric surgery" };
const AESTHETIC = { specialty: "Medicina estética", specialtyEn: "Aesthetic medicine" };
const BOTH = ["EN", "ES"];

export const PARTNER_DOCTORS: PartnerDoctor[] = [
  { name: "", ...PLASTIC, photo: ref("1612349317150-e413f6a5b16d"), languages: BOTH },
  { name: "", ...PLASTIC, photo: ref("1559839734-2b71ea197ec2"), languages: BOTH },
  { name: "", ...PLASTIC, photo: ref("1622253692010-333f2da6031d"), languages: BOTH },
  { name: "", ...DENTAL, photo: ref("1594824476967-48c8b964273f"), languages: BOTH },
  { name: "", ...DENTAL, photo: ref("1537368910025-700350fe46c7"), languages: BOTH },
  { name: "", ...BARIATRIC, photo: ref("1651008376811-b90baee60c1f"), languages: BOTH },
  { name: "", ...AESTHETIC, photo: ref("1622902046580-2b47f47f5471"), languages: BOTH },
  { name: "", ...AESTHETIC, photo: ref("1614608682850-e0d6ed316d47"), languages: BOTH },
];
