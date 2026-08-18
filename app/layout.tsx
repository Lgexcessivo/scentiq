import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ScentIQ — Encontre seu perfume ideal com IA",
  description:
    "Diga quais notas você ama, seu orçamento e a ocasião. O ScentIQ cruza tudo isso com um catálogo de perfumes e mostra as combinações perfeitas, com percentual de compatibilidade.",
  keywords: ["perfume", "recomendação de perfume", "IA", "notas olfativas", "perfumaria"],
  openGraph: {
    title: "ScentIQ — Encontre seu perfume ideal com IA",
    description:
      "O assistente de perfumaria que combina suas notas favoritas, orçamento e ocasião com o perfume certo.",
    type: "website",
    locale: "pt_BR",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${display.variable}`}>
      <body className="bg-charcoal-950 text-neutral-100 antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
