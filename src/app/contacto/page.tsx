import type { Metadata } from "next";
import ContactoClient from "./ContactoClient";

export const metadata: Metadata = {
  title: "Contacto | Bridge Care",
  description: "Cuéntanos qué quieres, agenda una videollamada con nuestro equipo o escríbenos por WhatsApp. Sin compromiso.",
};

export default function ContactoPage() {
  return <ContactoClient />;
}
