"use client";

import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-24 px-6 border-t border-[#161F28]">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#F2F5F7] mb-4 font-display tracking-tight">
          Coba satu skenario. Lihat apa yang berubah.
        </h2>
        <p className="text-base text-[#A9B3BD] max-w-xl mx-auto mb-8 leading-relaxed">
          Atur magnitudo, kedalaman, atau skala erupsi. Amati langsung bagaimana perubahan parameter memengaruhi lingkungan dan mitigasi.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/simulation/setup"
            className="px-6 py-3 text-sm font-semibold text-[#0B0F14] bg-[#57C7D9] hover:bg-[#46B6C8] rounded-[10px] transition-colors shadow-sm"
          >
            Mulai simulasi
          </Link>
          <Link
            href="/education"
            className="px-5 py-3 text-sm font-medium text-[#A9B3BD] hover:text-[#F2F5F7] bg-[#111820] hover:bg-[#18212B] border border-[#202B36] rounded-[10px] transition-colors"
          >
            Pelajari materinya
          </Link>
        </div>

        <p className="mt-8 text-xs text-[#6F7B86] max-w-md mx-auto leading-relaxed">
          Model visual interaktif berbasis data referensi ilmiah geologi Indonesia.
        </p>
      </div>
    </section>
  );
}
