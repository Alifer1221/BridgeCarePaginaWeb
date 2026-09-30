import type { Metadata } from "next";
import PrivacidadClient from "./PrivacidadClient";

export const metadata: Metadata = {
  title: "Política de Privacidad | Bridge Care",
  description: "Cómo Bridge Care recopila, usa y protege tu información al coordinar tu tratamiento médico en Colombia.",
};

export default function PrivacidadPage() {
  return <PrivacidadClient />;
}
