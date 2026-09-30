import type { Metadata } from "next";
import { defaultSpecialties } from "@/lib/db";
import SpecialtyDetailClient from "../SpecialtyDetailClient";

interface ProcedurePageProps {
  params: Promise<{ slug: string; procedure: string }>;
}

// Same approach as the specialty page: metadata comes from the default
// catalog, which is what search engines see.
export async function generateMetadata({ params }: ProcedurePageProps): Promise<Metadata> {
  const { slug, procedure } = await params;
  const specialty = defaultSpecialties.find((s) => s.id === slug);
  const detail = specialty?.procedureDetails?.find((p) => p.slug === procedure);

  if (!specialty || !detail) {
    return {
      title: "Procedimiento no encontrado | Bridge Care",
      robots: { index: false, follow: false },
    };
  }

  const title = `${detail.name} en Colombia | Bridge Care`;
  const description = detail.description.length > 160
    ? `${detail.description.slice(0, 157)}...`
    : detail.description;

  return {
    title,
    description,
    openGraph: { title, description, images: [detail.heroImage || detail.photo || specialty.image] },
  };
}

export default function ProcedurePage({ params }: ProcedurePageProps) {
  return <SpecialtyDetailClient params={params} />;
}
