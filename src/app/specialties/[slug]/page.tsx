import type { Metadata } from "next";
import { defaultSpecialties } from "@/lib/db";
import SpecialtyDetailClient from "./SpecialtyDetailClient";

interface SpecialtyPageProps {
  params: Promise<{ slug: string }>;
}

// Metadata is built from the default catalog (not localStorage — search
// engines don't have a visitor's browser storage anyway, so this is the
// correct source of truth for what gets indexed).
export async function generateMetadata({ params }: SpecialtyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const specialty = defaultSpecialties.find((s) => s.id === slug);

  if (!specialty) {
    return {
      title: "Especialidad no encontrada | Bridge Care",
      robots: { index: false, follow: false },
    };
  }

  const title = `${specialty.name} en Colombia | Bridge Care`;
  const description = specialty.fullDescription.length > 160
    ? `${specialty.fullDescription.slice(0, 157)}...`
    : specialty.fullDescription;

  return {
    title,
    description,
    openGraph: { title, description, images: [specialty.image] },
  };
}

export default function SpecialtyPage({ params }: SpecialtyPageProps) {
  return <SpecialtyDetailClient params={params} />;
}
