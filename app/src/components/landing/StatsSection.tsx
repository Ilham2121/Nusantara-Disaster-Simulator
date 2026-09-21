"use client";

import { motion } from "framer-motion";

const stats = [
  {
    value: "5,000+",
    label: "Gempa Per Tahun",
    description: "Indonesia berada di Ring of Fire Pasifik",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 12h3l2-7 3 14 3-10 2 6h7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "seismic",
  },
  {
    value: "127",
    label: "Gunung Api Aktif",
    description: "Terbanyak di dunia setelah Amerika Serikat",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 22h20L12 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "volcanic",
  },
  {
    value: "70%",
    label: "Wilayah Rawan",
    description: "Mayoritas penduduk tinggal di zona rawan bencana",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
      </svg>
    ),
    color: "warning",
  },
  {
    value: "3",
    label: "Sumber Data Resmi",
    description: "BMKG, PVMBG, dan BNPB/inaRISK",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 20V10M6 20V4M18 20v-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "terrain",
  },
];

const colorMap: Record<string, { bg: string; text: string; glow: string }> = {
  seismic: {
    bg: "bg-seismic/10",
    text: "text-seismic-glow",
    glow: "rgba(59, 130, 246, 0.15)",
  },
  volcanic: {
    bg: "bg-volcanic/10",
    text: "text-volcanic-glow",
    glow: "rgba(232, 93, 42, 0.15)",
  },
  warning: {
    bg: "bg-warning/10",
    text: "text-warning",
    glow: "rgba(245, 158, 11, 0.15)",
  },
  terrain: {
    bg: "bg-terrain/10",
    text: "text-terrain",
    glow: "rgba(34, 197, 94, 0.15)",
  },
};

export function StatsSection() {
  return (
    <section className="relative py-24 px-6 border-t border-border-subtle">
      {/* Background accent */}
      <div className="absolute inset-0 bg-surface/30" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-volcanic-glow uppercase tracking-wider mb-3">
            Fakta Kebencanaan
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Mengapa Edukasi Bencana Penting?
          </h2>
          <p className="text-ash max-w-xl mx-auto">
            Indonesia berada di salah satu zona paling aktif secara geologis di
            dunia.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, i) => {
            const colors = colorMap[stat.color];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative rounded-2xl border border-border bg-surface/60 p-6 hover:border-white/10 transition-all duration-300"
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at center, ${colors.glow}, transparent 70%)`,
                  }}
                />

                <div className="relative">
                  <div
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${colors.bg} ${colors.text} mb-4`}
                  >
                    {stat.icon}
                  </div>
                  <div className={`text-3xl font-bold mb-1 ${colors.text}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-foreground mb-1">
                    {stat.label}
                  </div>
                  <p className="text-xs text-ash leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
