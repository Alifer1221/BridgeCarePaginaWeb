import type { Metadata } from "next";
import BlogDashboardClient from "./BlogDashboardClient";

export const metadata: Metadata = {
  title: "Blog · Panel | Bridge Care",
  robots: { index: false, follow: false },
};

export default function BlogDashboardPage() {
  return <BlogDashboardClient />;
}
