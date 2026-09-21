"use client";

import Link from "next/link";
import { useState } from "react";

export function ScientificTransparencySection() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <section className="py-20 px-6 max-w-6xl mx-auto border-t border-[#161F28]">
      <div className="rounded-[14px] bg-[#111820] border border-[#202B36] p-8 md:p-10">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#57C7D9] mb-2 font-mono">
            Transparansi Metodologi & Kredibilitas
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F2F5F7] tracking-tight mb-4 font-display">
            Bagaimana simulasi ini bekerja?
          </h2>
          <p className="text-sm text-[#A9B3BD] leading-relaxed mb-6">
            Model ini dibuat untuk membantu memahami hubungan antara kondisi bencana dan dampaknya secara visual. Hasil simulasi disederhanakan untuk tujuan edukasi dan pemahaman sains kebencanaan, bukan sebagai prediksi kerusakan nyata atau pengganti sistem peringatan dini resmi.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="inline-flex items-center gap-2 text-xs font-medium text-[#57C7D9] hover:underline"
            >
              <span>{showDetails ? "Sembunyikan asumsi model" : "Lihat asumsi model"}</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <span className="text-[#202B36]">•</span>

            <Link
              href="/about"
              className="text-xs text-[#A9B3BD] hover:text-[#F2F5F7] transition-colors"
            >
              Pelajari lebih lanjut →
            </Link>
          </div>

          {/* Expandable Model Assumptions Details */}
          {showDetails && (
            <div className="mt-8 pt-6 border-t border-[#202B36] grid grid-cols-1 md:grid-cols-3 gap-6 text-xs animate-fade-in">
              <div className="p-4 rounded-[10px] bg-[#18212B] border border-[#202B36]">
                <h4 className="font-semibold text-[#F2F5F7] mb-1 font-display">
                  1. Penyederhanaan Atenuasi
                </h4>
                <p className="text-[#A9B3BD] leading-relaxed">
                  Perambatan getaran tanah menggunakan aproksimasi rumus atenuasi standar untuk memetakan PGA dan MMI ke dalam displacement 3D, tanpa memodelkan ketidakhomogenan lapisan batuan mikroskopis.
                </p>
              </div>

              <div className="p-4 rounded-[10px] bg-[#18212B] border border-[#202B36]">
                <h4 className="font-semibold text-[#F2F5F7] mb-1 font-display">
                  2. Respons Struktur Visual
                </h4>
                <p className="text-[#A9B3BD] leading-relaxed">
                  Perilaku bangunan perkotaan dan fenomena likuefaksi dirancang untuk mendemonstrasikan prinsip resonansi dan kerentanan tanah lunak secara proporsional demi efisiensi render web.
                </p>
              </div>

              <div className="p-4 rounded-[10px] bg-[#18212B] border border-[#202B36]">
                <h4 className="font-semibold text-[#F2F5F7] mb-1 font-display">
                  3. Sumber Data Terverifikasi
                </h4>
                <p className="text-[#A9B3BD] leading-relaxed">
                  Zona kerentanan geologis, skala magnitudo, dan radius bahaya merujuk pada standar publikasi resmi BMKG, PVMBG (Badan Geologi), dan BNPB (inaRISK).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
