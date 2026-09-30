// Contact details shared by every component that sends people to WhatsApp or
// e-mail. Change them here once — the floating chat button, the lead forms
// and the specialty pages all read these.

/** International format, digits only (wa.me links). ⚠️ Placeholder number:
 *  replace with the organization's real WhatsApp. */
export const WHATSAPP_NUMBER = "573001234567";
export const WHATSAPP_DISPLAY = "(+57) 300 123 4567";
export const CONTACT_EMAIL = "info@bridgecare.co";

/** ⚠️ Pending: the founder who signs the "why we exist" story on Nosotros.
 *  While the name is empty the signature line isn't shown. */
export const FOUNDER_NAME = "";
export const FOUNDER_ROLE = "Fundador de Bridge Care";
export const FOUNDER_ROLE_EN = "Founder of Bridge Care";

/** ⚠️ Pending: the team shown on Nosotros ("Quién te atiende"). Fill in name,
 *  photo (URL or /public path), LinkedIn and a short quote in each person's
 *  own words; anything left empty simply isn't shown (no photo shows a brand
 *  portrait, no name shows the role). The general coordinator's name is
 *  FOUNDER_NAME above. */
export const TEAM = {
  general: { photo: "", linkedin: "", quote: "", quoteEn: "" },
  interviews: { name: "", photo: "", linkedin: "", quote: "", quoteEn: "" },
};

/** ⚠️ Pending: the Calendly event link (e.g. "https://calendly.com/bridgecare/valoracion").
 *  After the contact form is sent, this calendar opens in place, prefilled
 *  with the visitor's name and e-mail. While empty, the page tells them
 *  we'll e-mail to agree on a time. */
export const CALENDLY_URL: string = "";

/** ⚠️ Pending: the final domain. Used for the Google and LinkedIn previews in
 *  the blog dashboard (and later for canonical URLs and the sitemap). */
export const SITE_HOST = "bridgecare.co";

/** ⚠️ Pending: the organization's LinkedIn page. While empty, the blog shows
 *  its "follow on LinkedIn" band without the button. */
export const LINKEDIN_URL = "";

/** First name of the patient coordinator who signs the chat replies. */
export const AGENT_NAME = "Laura";

export const waHref = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
