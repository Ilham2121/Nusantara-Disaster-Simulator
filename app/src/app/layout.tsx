import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nusantara Disaster Simulator: Edukasi Kebencanaan Interaktif",
    template: "%s | Nusantara Disaster Simulator",
  },
  description:
    "Pelajari bagaimana gempa bumi dan erupsi gunung api memengaruhi lingkungan melalui simulasi 3D interaktif berbasis data resmi Indonesia (BMKG, PVMBG, BNPB).",
  keywords: [
    "simulasi bencana",
    "gempa bumi",
    "erupsi gunung api",
    "edukasi kebencanaan",
    "Indonesia",
    "BMKG",
    "3D simulator",
    "mitigasi bencana",
  ],
  authors: [{ name: "Nusantara Disaster Simulator" }],
  openGraph: {
    title: "Nusantara Disaster Simulator",
    description:
      "Simulasi 3D interaktif untuk memahami bencana alam Indonesia",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
