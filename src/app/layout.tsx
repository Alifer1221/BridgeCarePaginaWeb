import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Bridge Care | Agencia de Turismo Médico en Colombia",
  description: "Tu puente hacia procedimientos de salud y bienestar de alta calidad en Colombia. Cirugía estética, Odontología, Bariatría y tratamientos estéticos de primer nivel con especialistas certificados.",
  keywords: "turismo medico, colombia, cirugia plastica, diseno de sonrisa, manga gastrica, clinicas medellin, salud colombia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <script dangerouslySetInnerHTML={{__html: `
          (function() {
            try {
              var hasShown = sessionStorage.getItem("bc_splash_shown");
              if (hasShown) {
                document.documentElement.classList.add("splash-hidden");
              }
            } catch (e) {}
          })();
        `}} />
      </head>
      <body>
        <LanguageProvider>
          <Header />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
          <WhatsAppButton />
        </LanguageProvider>
      </body>
    </html>
  );
}
