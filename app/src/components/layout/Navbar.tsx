"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Nusantara" },
  { href: "/simulation/setup", label: "Simulasi" },
  { href: "/education", label: "Belajar" },
  { href: "/about", label: "Tentang" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide global navbar when on dedicated 3D simulation screen (which has its own HUD header)
  if (pathname?.startsWith("/simulation/") && pathname !== "/simulation/setup") {
    return null;
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        scrolled || mobileOpen
          ? "bg-[#0B0F14]/98 border-b border-[#202B36] backdrop-blur-md shadow-md"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group min-h-[44px]">
          <div className="w-8 h-8 rounded-[10px] bg-[#18212B] border border-[#202B36] flex items-center justify-center text-[#57C7D9] group-hover:border-[#57C7D9]/40 transition-colors">
            {/* Scientific telemetry icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3v18" />
              <path d="M3 12h18" />
            </svg>
          </div>
          <span className="text-base font-semibold tracking-tight text-[#F2F5F7] font-display">
            Nusantara <span className="text-[#A9B3BD] font-normal text-xs ml-1 font-sans">Simulator</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 text-sm rounded-[10px] transition-colors duration-150 ${
                  isActive
                    ? "text-[#F2F5F7] bg-[#18212B] font-medium"
                    : "text-[#A9B3BD] hover:text-[#F2F5F7] hover:bg-[#111820]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="w-px h-4 bg-[#202B36] mx-2" />

          {/* Primary CTA (Single primary action per §16) */}
          <Link
            href="/simulation/setup"
            className="px-4 py-2 text-sm font-medium text-[#0B0F14] bg-[#57C7D9] hover:bg-[#46B6C8] rounded-[10px] transition-colors duration-150 shadow-sm"
          >
            Mulai simulasi
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#A9B3BD] hover:text-[#F2F5F7] transition-colors rounded-[10px] cursor-pointer"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0E141B] border-b border-[#202B36] px-6 py-4 space-y-1.5 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center min-h-[44px] px-3.5 py-2 text-sm font-medium text-[#A9B3BD] hover:text-[#F2F5F7] hover:bg-[#18212B] rounded-[10px] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/simulation/setup"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center min-h-[44px] mt-3 px-4 py-2.5 text-sm font-semibold text-[#0B0F14] text-center bg-[#57C7D9] hover:bg-[#46B6C8] rounded-[10px] transition-colors shadow-sm"
          >
            Mulai simulasi
          </Link>
        </div>
      )}
    </nav>
  );
}
