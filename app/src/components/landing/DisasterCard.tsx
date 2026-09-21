"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface DisasterCardProps {
  type: "earthquake" | "eruption";
  title: string;
  subtitle: string;
  description: string;
  parameters: string[];
  href: string;
  delay?: number;
}

export function DisasterCard({
  type,
  title,
  subtitle,
  description,
  parameters,
  href,
  delay = 0,
}: DisasterCardProps) {
  const isEarthquake = type === "earthquake";
  const accentColor = isEarthquake ? "#D6A84F" : "#E8754A";

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      className="flex-1"
    >
      <Link
        href={href}
        className="group block h-full p-7 rounded-[14px] bg-[#111820] border border-[#202B36] hover:border-[#2C3B4A] transition-all duration-150 relative"
      >
        {/* Semantic color indicator line */}
        <div
          className="absolute top-0 left-6 right-6 h-[2px] rounded-t-full transition-opacity opacity-70 group-hover:opacity-100"
          style={{ backgroundColor: accentColor }}
        />

        <div className="flex items-center justify-between mb-4 pt-1">
          <span
            className="text-xs font-mono font-semibold uppercase tracking-wider"
            style={{ color: accentColor }}
          >
            {isEarthquake ? "Domain Seismik" : "Domain Vulkanik"}
          </span>
          <span className="text-xs text-[#6F7B86] font-mono">
            {isEarthquake ? "Skala MMI / PGA" : "Skala VEI / Radius Bahaya"}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-[#F2F5F7] mb-1 font-display">
          {title}
        </h3>
        <p className="text-sm font-medium text-[#A9B3BD] mb-4">
          {subtitle}
        </p>

        <p className="text-sm text-[#A9B3BD] leading-relaxed mb-6">
          {description}
        </p>

        {/* Key parameters list */}
        <div className="pt-4 border-t border-[#18212B] mb-6">
          <p className="text-[11px] font-mono uppercase text-[#6F7B86] mb-2">
            Parameter Eksperimen
          </p>
          <div className="flex flex-wrap gap-2">
            {parameters.map((param) => (
              <span
                key={param}
                className="px-2.5 py-1 text-xs rounded-[8px] bg-[#18212B] border border-[#202B36] text-[#F2F5F7] font-mono"
              >
                {param}
              </span>
            ))}
          </div>
        </div>

        {/* Action link */}
        <div className="flex items-center gap-1.5 text-sm font-medium text-[#F2F5F7] group-hover:text-[#57C7D9] transition-colors">
          <span>Eksplorasi skenario</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:translate-x-1 transition-transform duration-150"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </motion.div>
  );
}
