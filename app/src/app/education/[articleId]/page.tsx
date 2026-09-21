"use client";

import React, { use } from "react";
import Link from "next/link";
import { getArticleById, allArticles } from "@/data/education";

interface PageProps {
  params: Promise<{ articleId: string }>;
}

export default function ArticleDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const articleId = resolvedParams.articleId;
  const article = getArticleById(articleId);

  if (!article) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-6 max-w-md mx-auto text-center flex flex-col items-center justify-center">
        <div className="p-8 rounded-3xl bg-surface border border-border shadow-2xl">
          <div className="text-4xl mb-4">📖</div>
          <h1 className="text-2xl font-bold text-white mb-2">Artikel Tidak Ditemukan</h1>
          <p className="text-ash text-xs leading-relaxed mb-6">
            Artikel edukasi dengan ID &quot;{articleId}&quot; tidak terdaftar dalam basis pengetahuan kami.
          </p>
          <Link
            href="/education"
            className="py-3 px-5 rounded-xl bg-seismic text-white font-bold text-xs hover:bg-seismic-blue-glow transition-all"
          >
            ← Kembali ke Pusat Edukasi
          </Link>
        </div>
      </div>
    );
  }

  const isEq = article.disasterType === "earthquake";

  // Find other related articles
  const otherArticles = allArticles.filter((a) => a.id !== article.id).slice(0, 2);

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/education"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ash hover:text-white transition-colors"
        >
          <span>← Kembali ke Pusat Edukasi</span>
        </Link>
      </div>

      {/* Article Header Card */}
      <div className="p-6 sm:p-10 rounded-3xl bg-surface border border-border mb-8 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isEq
                ? "bg-seismic/15 text-seismic-blue-glow border border-seismic/30"
                : "bg-volcanic/15 text-volcanic-glow border border-volcanic/30"
            }`}
          >
            {isEq ? "Sains & Mitigasi Gempa" : "Vulkanologi & Mitigasi Erupsi"}
          </span>
          <span className="text-xs text-ash font-mono">• {article.sections.length} Bagian Materi</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4 leading-tight">
          {article.title}
        </h1>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          {article.summary}
        </p>
      </div>

      {/* Article Structured Content Sections */}
      <div className="flex flex-col gap-6 mb-10">
        {article.sections.map((sec, idx) => (
          <article
            key={idx}
            className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-md"
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-background border border-border flex items-center justify-center text-xs text-ash font-mono">
                  {idx + 1}
                </span>
                <span>{sec.heading}</span>
              </h2>
              {sec.source && (
                <span className="text-[10px] font-bold text-ash px-2 py-0.5 rounded-md bg-background border border-border">
                  Rujukan: {sec.source}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed">
              {sec.content}
            </p>
          </article>
        ))}
      </div>

      {/* Official Sources Attribution Box */}
      <div className="p-5 rounded-2xl bg-background/50 border border-border mb-10 flex flex-wrap items-center justify-between gap-3 text-xs text-ash">
        <span>Rujukan Data & Informasi Resmi:</span>
        <div className="flex flex-wrap gap-4">
          {article.sources.map((src, i) => (
            <a
              key={i}
              href={src.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-white hover:text-seismic-blue-glow transition-colors underline"
            >
              {src.name} ↗
            </a>
          ))}
        </div>
      </div>

      {/* Direct Interactive Simulation CTA */}
      <div className="p-8 rounded-3xl bg-gradient-hero border border-border shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-volcanic-glow block mb-1">
            Simulasi Terkait
          </span>
          <h3 className="text-xl font-bold text-white mb-2">
            Lihat Fenomena Ini di Dunia 3D
          </h3>
          <p className="text-xs text-ash max-w-md leading-relaxed">
            Eksplorasi guncangan gelombang seismik atau luncuran awan panas vulkanik secara visual melalui simulasi interaktif.
          </p>
        </div>

        <Link
          href={`/simulation/setup?type=${article.disasterType}`}
          className={`px-7 py-3.5 rounded-2xl text-white font-bold text-xs shadow-lg shrink-0 transition-all ${
            isEq
              ? "bg-gradient-seismic hover:shadow-seismic/30 hover:scale-[1.02]"
              : "bg-gradient-volcanic hover:shadow-volcanic/30 hover:scale-[1.02]"
          }`}
        >
          🚀 Mulai Simulasi {isEq ? "Gempa" : "Erupsi"} →
        </Link>
      </div>

      {/* Suggested Other Articles */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-ash mb-4">
          Artikel Edukasi Lainnya
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {otherArticles.map((other) => (
            <Link
              key={other.id}
              href={`/education/${other.id}`}
              className="p-5 rounded-2xl bg-surface border border-border hover:border-border-subtle hover:bg-surface/90 transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-bold text-ash block mb-1">
                  {other.disasterType === "earthquake" ? "Gempa Bumi" : "Erupsi Gunung Api"}
                </span>
                <h4 className="text-sm font-bold text-white group-hover:text-seismic-blue-glow transition-colors mb-2">
                  {other.title}
                </h4>
                <p className="text-xs text-ash line-clamp-2 leading-relaxed">
                  {other.summary}
                </p>
              </div>
              <span className="text-xs font-bold text-seismic-blue-glow mt-3">
                Baca Selengkapnya →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
