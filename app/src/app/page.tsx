"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { HeroBackground } from "@/components/landing/HeroBackground";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { DisasterCard } from "@/components/landing/DisasterCard";
import { SimulationPreviewSection } from "@/components/landing/SimulationPreviewSection";
import { ScientificTransparencySection } from "@/components/landing/ScientificTransparencySection";
import { CTASection } from "@/components/landing/CTASection";
import { SeismicTicker } from "@/components/landing/SeismicTicker";
import { TectonicParticles } from "@/components/landing/TectonicParticles";

const IndonesiaRingOfFire = dynamic(
  () => import("@/components/landing/IndonesiaRingOfFire").then((mod) => mod.IndonesiaRingOfFire),
  {
    ssr: false,
    loading: () => (
      <section className="relative py-16 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="h-[400px] rounded-[14px] bg-[#0E141B] border border-[#202B36] flex flex-col items-center justify-center text-[#6F7B86] font-mono text-xs animate-pulse">
            <div className="w-8 h-8 rounded-full border-2 border-[#57C7D9] border-t-transparent animate-spin mb-3" />
            <span>MEMUAT OBSERVATORI PETA TEKTONIK...</span>
          </div>
        </div>
      </section>
    ),
  }
);

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#0B0F14] text-[#F2F5F7]">
      {/* ===== 01. HERO SECTION (§13, §14 Option A) ===== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 pt-24 pb-16">
        <HeroBackground />
        <TectonicParticles />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Eyebrow / Observatory Label (§13) */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[8px] border border-[#202B36] bg-[#111820]/80 text-[#57C7D9] text-xs font-mono font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#57C7D9]" />
            Observatorium Virtual Bencana Geofisika Indonesia
          </div>

          {/* Concrete, Confident Headline (§14 Option A) */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F2F5F7] mb-6 font-display leading-[1.15]">
            Lihat bencana dari dekat. <br className="hidden sm:inline" />
            Pahami dampaknya.
          </h1>

          {/* Supporting Text (§14 Option A) */}
          <p className="text-base sm:text-lg text-[#A9B3BD] max-w-2xl mx-auto leading-relaxed mb-8">
            Eksplorasi simulasi 3D gempa bumi dan erupsi untuk memahami apa yang
            terjadi, mengapa dampaknya berbeda, dan bagaimana kita dapat bersiap.
          </p>

          {/* Action Buttons (§15, §16: Single Primary Action) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/simulation/setup"
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-[#0B0F14] bg-[#57C7D9] hover:bg-[#46B6C8] rounded-[10px] transition-colors shadow-sm text-center"
            >
              Mulai simulasi
            </Link>
            <Link
              href="#how-it-works"
              className="w-full sm:w-auto px-5 py-3 text-sm font-medium text-[#A9B3BD] hover:text-[#F2F5F7] bg-[#111820] hover:bg-[#18212B] border border-[#202B36] rounded-[10px] transition-colors text-center"
            >
              Pelajari cara kerjanya
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SEISMIC TICKER (Live-feel observatory element) ===== */}
      <SeismicTicker />

      {/* ===== 02. HOW IT WORKS (§52, §53) ===== */}
      <div id="how-it-works">
        <HowItWorksSection />
      </div>

      {/* ===== 03. EXPLORE DISASTERS (§52, §18) ===== */}
      <section className="py-20 px-6 max-w-6xl mx-auto border-t border-[#161F28]">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#57C7D9] mb-2 font-mono">
            Pilihan Domain
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F2F5F7] tracking-tight font-display">
            Pilih bencana yang ingin kamu eksplorasi
          </h2>
        </div>

        {/* Visual Comparison: 2 Domains (§18) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DisasterCard
            type="earthquake"
            title="Gempa Bumi"
            subtitle="Getaran tanah dan respons struktur"
            description="Pelajari perambatan gelombang seismik dari patahan aktif, percepatan tanah puncak (PGA), dan fenomena likuefaksi pada tanah perkotaan."
            parameters={["Magnitudo (Mw)", "Kedalaman (km)", "Tipe Tanah"]}
            href="/simulation/setup?type=earthquake"
            delay={0}
          />
          <DisasterCard
            type="eruption"
            title="Erupsi Gunung Api"
            subtitle="Aktivitas vulkanik dan bahaya primer"
            description="Eksplorasi dinamika letusan stratovolcano, dispersi kolom abu vulkanik, jatuhan tephra, serta jangkauan awan panas pada lereng gunung."
            parameters={["Indeks VEI", "Tinggi Kolom", "Radius Bahaya"]}
            href="/simulation/setup?type=eruption"
            delay={0.1}
          />
        </div>
      </section>

      {/* ===== 03b. INDONESIA RING OF FIRE MAP (Animated Tectonic Visualization) ===== */}
      <IndonesiaRingOfFire />

      {/* ===== 04. INTERACTIVE PREVIEW (§52.04) ===== */}
      <SimulationPreviewSection />

      {/* ===== 05. LEARN FROM THE SIMULATION (§52.05) ===== */}
      <section className="py-20 px-6 max-w-6xl mx-auto border-t border-[#161F28]">
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#57C7D9] mb-2 font-mono">
            Tujuan Pembelajaran
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F2F5F7] tracking-tight font-display">
            Apa yang dapat kamu pelajari dari simulasi?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-[14px] bg-[#111820] border border-[#202B36]">
            <div className="w-10 h-10 rounded-[8px] bg-[#18212B] border border-[#202B36] flex items-center justify-center text-[#57C7D9] mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-[#F2F5F7] mb-2 font-display">
              Resonansi & Getaran Tanah
            </h3>
            <p className="text-xs text-[#A9B3BD] leading-relaxed">
              Pahami mengapa bangunan dengan tinggi berbeda berosilasi berbeda pada gempa yang sama karena efek frekuensi alami dan kondisi lapisan tanah.
            </p>
          </div>

          <div className="p-6 rounded-[14px] bg-[#111820] border border-[#202B36]">
            <div className="w-10 h-10 rounded-[8px] bg-[#18212B] border border-[#202B36] flex items-center justify-center text-[#D6A84F] mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-[#F2F5F7] mb-2 font-display">
              Bahaya Sekunder & Ikutan
            </h3>
            <p className="text-xs text-[#A9B3BD] leading-relaxed">
              Amati bagaimana hilangnya daya dukung tanah akibat tekanan air pori (likuefaksi) atau penumpukan abu basah pada atap dapat memicu kerusakan lanjutan.
            </p>
          </div>

          <div className="p-6 rounded-[14px] bg-[#111820] border border-[#202B36]">
            <div className="w-10 h-10 rounded-[8px] bg-[#18212B] border border-[#202B36] flex items-center justify-center text-[#63B98A] mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-[#F2F5F7] mb-2 font-display">
              Keputusan Mitigasi Kontekstual
            </h3>
            <p className="text-xs text-[#A9B3BD] leading-relaxed">
              Ketahui langkah perlindungan diri saat guncangan (Drop, Cover, Hold On) serta pemetaan zona evakuasi bahaya vulkanik berdasarkan jarak aman.
            </p>
          </div>
        </div>
      </section>

      {/* ===== 06. SCIENTIFIC TRANSPARENCY (§52, §54) ===== */}
      <ScientificTransparencySection />

      {/* ===== 07. FINAL CTA (§52, §55) ===== */}
      <CTASection />
    </div>
  );
}
