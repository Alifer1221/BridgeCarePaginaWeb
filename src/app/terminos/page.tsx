import type { Metadata } from "next";
import TerminosClient from "./TerminosClient";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Bridge Care",
  description: "Condiciones de uso del servicio de facilitación y acompañamiento de turismo médico de Bridge Care en Colombia.",
};

export default function TerminosPage() {
  return <TerminosClient />;
}
