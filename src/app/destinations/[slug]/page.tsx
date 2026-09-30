import type { Metadata } from "next";
import { defaultDestinations } from "@/lib/db";
import DestinationDetailClient from "./DestinationDetailClient";

interface DestinationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DestinationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = defaultDestinations.find((d) => d.id === slug);

  if (!destination) {
    return {
      title: "Destino no encontrado | Bridge Care",
      robots: { index: false, follow: false },
    };
  }

  const title = `Turismo médico en ${destination.name}, Colombia | Bridge Care`;
  const description = destination.description.length > 160
    ? `${destination.description.slice(0, 157)}...`
    : destination.description;

  return {
    title,
    description,
    openGraph: { title, description, images: [destination.image] },
  };
}

export default function DestinationPage({ params }: DestinationPageProps) {
  return <DestinationDetailClient params={params} />;
}
