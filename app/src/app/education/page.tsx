"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { earthquakeArticles, eruptionArticles, allArticles, EducationArticle } from "@/data/education";

export default function EducationPage() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "earthquake" | "eruption">("all");

  const filteredArticles = useMemo(() => {
    if (selectedCategory === "earthquake") return earthquakeArticles;
    if (selectedCategory === "eruption") return eruptionArticles;
    return allArticles;
  }, [selectedCategory]);

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-6xl mx-auto bg-[#0B0F14] text-[#F2F5F7]">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#57C7D9] mb-2 font-mono">
          Pusat Pengetahuan Kebencanaan
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[#F2F5F7] mb-2 font-display">
          Dasar sains gempa dan erupsi
        </h1>
        <p className="text-sm text-[#A9B3BD] max-w-xl">
          Materi edukasi geofisika dan panduan keselamatan berbasis literatur resmi BMKG, PVMBG, dan BNPB.
        </p>

        {/* Category Filter Tabs */}
        <div className="flex gap-2 mt-6">
          {(
            [
              { id: "all", label: "Semua Materi" },
              { id: "earthquake", label: "Gempa Bumi" },
              { id: "eruption", label: "Erupsi Gunung Api" },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-[8px] text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#18212B] border border-[#202B36] text-[#57C7D9]"
                  : "bg-[#111820] border border-[#202B36] text-[#A9B3BD] hover:text-[#F2F5F7]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
        {filteredArticles.map((article: EducationArticle) => {
          const isEq = article.disasterType === "earthquake";
          const accentColor = isEq ? "#D6A84F" : "#E8754A";

          return (
            <div
              key={article.id}
              className="p-6 rounded-[14px] bg-[#111820] border border-[#202B36] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className="text-[11px] font-mono font-medium"
                    style={{ color: accentColor }}
                  >
                    {isEq ? "Gempa Tektonik" : "Erupsi Vulkanik"}
                  </span>
                  <span className="text-[11px] text-[#6F7B86] font-mono">
                    ~3 mnt baca
                  </span>
                </div>

                <h3 className="text-base font-semibold text-[#F2F5F7] mb-2 font-display">
                  {article.title}
                </h3>
                <p className="text-xs text-[#A9B3BD] leading-relaxed mb-4">
                  {article.summary}
                </p>

                {/* Subsections list */}
                <div className="pt-3 border-t border-[#18212B] flex flex-col gap-1.5 mb-5">
                  {article.sections.map((sec, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#A9B3BD]">
                      <span className="w-1 h-1 rounded-full bg-[#6F7B86] shrink-0" />
                      <span className="truncate">{sec.heading}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#18212B] flex items-center justify-between">
                <div className="text-[11px] text-[#6F7B86] font-mono">
                  Sumber: {article.sources[0]?.name || "Resmi"}
                </div>
                <Link
                  href={`/education/${article.id}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#57C7D9] hover:underline"
                >
                  <span>Baca artikel</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transition to Simulator (§27) */}
      <div className="p-8 rounded-[14px] bg-[#111820] border border-[#202B36] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-[#57C7D9] block mb-1">
            Eksplorasi Praktik
          </span>
          <h2 className="text-xl font-bold text-[#F2F5F7] mb-1 font-display">
            Lihat teori ini dalam simulasi 3D
          </h2>
          <p className="text-xs text-[#A9B3BD] max-w-lg leading-relaxed">
            Amati respons tanah dan bangunan secara langsung terhadap parameter yang kamu pelajari.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            href="/simulation/setup"
            className="px-5 py-2.5 rounded-[10px] bg-[#57C7D9] hover:bg-[#46B6C8] text-[#0B0F14] text-xs font-semibold transition-colors"
          >
            Mulai simulasi
          </Link>
          <Link
            href="/quiz"
            className="px-4 py-2.5 rounded-[10px] bg-[#18212B] hover:bg-[#202B36] border border-[#202B36] text-[#F2F5F7] text-xs font-medium transition-colors"
          >
            Uji pemahaman
          </Link>
        </div>
      </div>
    </div>
  );
}
