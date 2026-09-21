"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function SimulationPreviewSection() {
  const [activeTab, setActiveTab] = useState<"earthquake" | "eruption">("earthquake");
  const [magnitude, setMagnitude] = useState<number>(6.5);
  const [depth, setDepth] = useState<number>(10);

  // Approximate seismic intensity based on simple physical attenuation
  const pga = ((magnitude * 0.08) / (depth * 0.1)).toFixed(2);
  const mmiLevel = magnitude >= 7 ? "VIII - Hebat" : magnitude >= 6 ? "VII - Kuat" : "V - Sedang";

  return (
    <section className="py-20 px-6 max-w-6xl mx-auto border-t border-[#161F28]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#57C7D9] mb-2 font-mono">
            Pratinjau Telemetri
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F2F5F7] tracking-tight font-display">
            Pengalaman simulasi interaktif
          </h2>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-[#111820] border border-[#202B36] rounded-[10px]">
          <button
            onClick={() => setActiveTab("earthquake")}
            className={`px-3 py-1.5 text-xs font-medium rounded-[8px] transition-colors ${
              activeTab === "earthquake"
                ? "bg-[#18212B] text-[#D6A84F]"
                : "text-[#A9B3BD] hover:text-[#F2F5F7]"
            }`}
          >
            Gempa Bumi
          </button>
          <button
            onClick={() => setActiveTab("eruption")}
            className={`px-3 py-1.5 text-xs font-medium rounded-[8px] transition-colors ${
              activeTab === "eruption"
                ? "bg-[#18212B] text-[#E8754A]"
                : "text-[#A9B3BD] hover:text-[#F2F5F7]"
            }`}
          >
            Erupsi Vulkanik
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="rounded-[14px] bg-[#111820] border border-[#202B36] overflow-hidden">
        {/* HUD Top Bar */}
        <div className="px-5 py-3 border-b border-[#202B36] flex items-center justify-between text-xs font-mono text-[#A9B3BD]">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-[#57C7D9]" />
            <span className="text-[#F2F5F7]">
              {activeTab === "earthquake" ? "GEMPA TEKTONIK PERKOTAAN" : "STRATOVOLCANO AKTIF"}
            </span>
            <span className="text-[#6F7B86]">|</span>
            <span className="text-[#6F7B86]">STATUS: SIAP SIMULASI</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[#6F7B86]">
            <span>FASE: PERSIAPAN</span>
            <span>WAKTU: 00:00</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Viewport Canvas Preview (70% weight per §8) */}
          <div className="lg:col-span-8 p-6 lg:p-8 bg-[#0B0F14] relative min-h-[320px] flex flex-col justify-between overflow-hidden">
            {/* Background technical telemetry grid */}
            <div className="absolute inset-0 telemetry-grid opacity-30 pointer-events-none" />

            {/* Environmental visualization display */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center my-8">
              {activeTab === "earthquake" ? (
                <div className="space-y-4 max-w-sm">
                  {/* Seismographic visual glyph */}
                  <div className="w-16 h-16 mx-auto rounded-[10px] bg-[#18212B] border border-[#202B36] flex items-center justify-center text-[#D6A84F]">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M2 12h3l2-7 3 14 3-10 2 6h7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h4 className="text-base font-semibold text-[#F2F5F7] font-display">
                    Model Resonansi Struktur & Likuefaksi
                  </h4>
                  <p className="text-xs text-[#A9B3BD] leading-relaxed">
                    Gelombang primer (P-Wave) dan sekunder (S-Wave) merambat dari hiposenter sedalam {depth} km, menghasilkan estimasi percepatan tanah puncak {pga}g.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-w-sm">
                  <div className="w-16 h-16 mx-auto rounded-[10px] bg-[#18212B] border border-[#202B36] flex items-center justify-center text-[#E8754A]">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 2L2 22h20L12 2z" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 8v4" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h4 className="text-base font-semibold text-[#F2F5F7] font-display">
                    Dinamika Kolom Abu & Awan Panas
                  </h4>
                  <p className="text-xs text-[#A9B3BD] leading-relaxed">
                    Eksplosivitas magmatik memicu dispersi tephra dan aliran piroklastik menuruni lereng dengan pemantauan radius bahaya sektoral.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Timeline Indicator (§25) */}
            <div className="relative z-10 pt-4 border-t border-[#18212B] flex items-center justify-between text-xs font-mono text-[#6F7B86]">
              <span>00:00 Persiapan</span>
              <div className="flex-1 mx-4 h-1 bg-[#18212B] rounded-full overflow-hidden">
                <div className="w-1/4 h-full bg-[#57C7D9]" />
              </div>
              <span>00:30 Puncak</span>
            </div>
          </div>

          {/* Interactive Controller (30% weight per §8) */}
          <div className="lg:col-span-4 p-6 bg-[#111820] border-t lg:border-t-0 lg:border-l border-[#202B36] flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-mono uppercase text-[#6F7B86] mb-4">
                Kontrol Parameter (§20)
              </p>

              {activeTab === "earthquake" ? (
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-[#F2F5F7]">Magnitudo (Mw)</span>
                      <span className="font-mono text-[#57C7D9] font-semibold">{magnitude.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="5.0"
                      max="8.5"
                      step="0.1"
                      value={magnitude}
                      onChange={(e) => setMagnitude(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-[#18212B] rounded-lg appearance-none cursor-pointer accent-[#57C7D9]"
                    />
                    <p className="text-[11px] text-[#6F7B86] mt-1">
                      Ukuran energi seismik yang dilepaskan di sumber patahan.
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-[#F2F5F7]">Kedalaman Hiposenter</span>
                      <span className="font-mono text-[#57C7D9] font-semibold">{depth} km</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={depth}
                      onChange={(e) => setDepth(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-[#18212B] rounded-lg appearance-none cursor-pointer accent-[#57C7D9]"
                    />
                    <p className="text-[11px] text-[#6F7B86] mt-1">
                      Jarak vertikal dari episenter permukaan tanah ke fokus gempa.
                    </p>
                  </div>

                  {/* Computed Telemetry Card */}
                  <div className="p-3.5 rounded-[10px] bg-[#18212B] border border-[#202B36] space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-[#6F7B86]">Est. Intensitas:</span>
                      <span className="text-[#D6A84F] font-semibold">{mmiLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6F7B86]">PGA Puncak:</span>
                      <span className="text-[#F2F5F7]">{pga} g</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-[10px] bg-[#18212B] border border-[#202B36] space-y-2 text-xs">
                    <p className="font-medium text-[#F2F5F7]">Parameter Terpantau:</p>
                    <ul className="space-y-1.5 text-[#A9B3BD] font-mono text-[11px]">
                      <li>• Skala VEI: 3 (Sub-Plinian)</li>
                      <li>• Tinggi Kolom Abu: ~8.5 km</li>
                      <li>• Kecepatan Angin: 18 km/h Barat Daya</li>
                      <li>• Radius Awan Panas: 5.0 km</li>
                    </ul>
                  </div>
                  <p className="text-xs text-[#A9B3BD] leading-relaxed">
                    Simulasi 3D memodelkan laju pengendapan abu vulkanik pada atap pemukiman dan laju jangkauan awan panas.
                  </p>
                </div>
              )}
            </div>

            {/* Launch link */}
            <div className="pt-6 mt-6 border-t border-[#202B36]">
              <Link
                href={`/simulation/setup?type=${activeTab}`}
                className="w-full block py-2.5 px-4 rounded-[10px] bg-[#57C7D9] hover:bg-[#46B6C8] text-[#0B0F14] text-xs font-semibold text-center transition-colors"
              >
                Buka di Simulator 3D Penuh →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
