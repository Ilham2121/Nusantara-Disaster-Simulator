"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const footerLinks = {
  Simulasi: [
    { href: "/simulation/setup?type=earthquake", label: "Gempa Bumi" },
    { href: "/simulation/setup?type=eruption", label: "Erupsi Gunung Api" },
  ],
  Belajar: [
    { href: "/education", label: "Pusat Edukasi" },
    { href: "/quiz", label: "Uji Pemahaman" },
  ],
  Transparansi: [
    { href: "/about", label: "Asumsi Model" },
    { href: "/about#sources", label: "Sumber Data" },
    { href: "/about#project", label: "Tentang Proyek" },
    { href: "mailto:ilhamalyabdillah@gmail.com", label: "Contact Dev" },
  ],
};

const dataSources = [
  { name: "BMKG", desc: "Data Seismik & Tsunami" },
  { name: "PVMBG", desc: "Aktivitas Vulkanik" },
  { name: "BNPB / inaRISK", desc: "Kajian Bahaya & Risiko" },
];

export function Footer() {
  const pathname = usePathname();

  // Hide global footer when on dedicated 3D simulation screen
  if (pathname?.startsWith("/simulation/") && pathname !== "/simulation/setup") {
    return null;
  }

  return (
    <footer className="border-t border-[#202B36] bg-[#0B0F14] text-[#A9B3BD]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Purpose */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-[8px] bg-[#18212B] border border-[#202B36] flex items-center justify-center text-[#57C7D9]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 3v18" />
                  <path d="M3 12h18" />
                </svg>
              </div>
              <span className="font-semibold text-sm text-[#F2F5F7] font-display">
                Nusantara Simulator
              </span>
            </div>
            <p className="text-xs text-[#A9B3BD] leading-relaxed mb-4">
              Platform eksplorasi dan visualisasi ilmiah fenomena bencana geofisika Indonesia melalui pendekatan visual.
            </p>
            <a
              href="mailto:ilhamalyabdillah@gmail.com"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-[#111820] hover:bg-[#18222c] border border-[#202B36] hover:border-[#57C7D9]/40 text-xs text-[#A9B3BD] hover:text-[#57C7D9] transition-all duration-150"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>Contact Dev</span>
            </a>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6F7B86] mb-3">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("mailto:") ? (
                      <a
                        href={link.href}
                        className="text-xs text-[#A9B3BD] hover:text-[#57C7D9] transition-colors duration-150 inline-flex items-center gap-1.5"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-xs text-[#A9B3BD] hover:text-[#57C7D9] transition-colors duration-150"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Data Sources Attribution (§54) */}
        <div className="pt-6 border-t border-[#161F28] mb-6">
          <p className="text-[11px] font-medium text-[#6F7B86] uppercase tracking-wider mb-2.5">
            Referensi Data Resmi
          </p>
          <div className="flex flex-wrap gap-2.5">
            {dataSources.map((source) => (
              <div
                key={source.name}
                className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-[#111820] border border-[#202B36]"
              >
                <span className="text-xs font-medium text-[#57C7D9]">
                  {source.name}
                </span>
                <span className="text-xs text-[#6F7B86]">·</span>
                <span className="text-xs text-[#A9B3BD]">{source.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 border-t border-[#161F28] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-[11px] text-[#6F7B86]">
          <p className="max-w-xl leading-relaxed">
            Model edukatif visual ini disederhanakan untuk tujuan pembelajaran interaktif dan bukan sistem prediksi real-time atau pengganti peringatan dini resmi BMKG/PVMBG.
          </p>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="mailto:ilhamalyabdillah@gmail.com"
              className="text-xs text-[#57C7D9] hover:underline inline-flex items-center gap-1.5"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Contact Dev
            </a>
            <span className="text-[#202B36]">·</span>
            <p>
              © {new Date().getFullYear()} Nusantara Disaster Simulator
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
