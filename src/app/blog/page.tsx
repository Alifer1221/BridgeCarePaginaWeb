import type { Metadata } from "next";
import BlogIndexClient from "./BlogIndexClient";

export const metadata: Metadata = {
  title: "Guía Bridge Care: cirugía, odontología, ciencia y turismo en Colombia | Blog",
  description: "Guías sobre cirugía estética, odontología y estética en Colombia, ciencia médica explicada en simple, turismo y salud sostenible. Para decidir con información.",
};

export default function BlogPage() {
  return <BlogIndexClient />;
}
