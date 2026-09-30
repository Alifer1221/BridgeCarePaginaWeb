import type { Metadata } from "next";
import NosotrosClient from "./NosotrosClient";

export const metadata: Metadata = {
  title: "Nosotros | Bridge Care",
  description: "Por qué existe Bridge Care: para que nadie viaje a operarse a Colombia sin alguien al lado. Especialistas verificados, precio cerrado y compañía de principio a fin.",
};

export default function NosotrosPage() {
  return <NosotrosClient />;
}
