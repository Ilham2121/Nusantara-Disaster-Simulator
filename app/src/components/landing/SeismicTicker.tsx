"use client";

import { useEffect, useState } from "react";

export interface Quake {
  mag: string;
  loc: string;
  depth: string;
  time: string;
  date?: string;
  coordinates?: string;
  potensi?: string;
  dirasakan?: string;
}

const FALLBACK_EVENTS: Quake[] = [
  { mag: "5.2", loc: "Laut Banda, Maluku", depth: "28 km", time: "03:42 WIB" },
  { mag: "4.8", loc: "Selat Sunda", depth: "12 km", time: "06:15 WIB" },
  { mag: "3.9", loc: "Barat Daya Nias", depth: "35 km", time: "09:28 WIB" },
  { mag: "5.6", loc: "Utara Halmahera", depth: "18 km", time: "12:01 WIB" },
  { mag: "4.1", loc: "Timur Laut Bali", depth: "22 km", time: "14:35 WIB" },
  { mag: "3.7", loc: "Selatan Jawa Timur", depth: "45 km", time: "17:50 WIB" },
  { mag: "4.5", loc: "Barat Laut Flores", depth: "15 km", time: "20:12 WIB" },
  { mag: "5.0", loc: "Teluk Cenderawasih", depth: "32 km", time: "22:44 WIB" },
];

export function SeismicTicker() {
  const [events, setEvents] = useState<Quake[]>(FALLBACK_EVENTS);
  const [sourceName, setSourceName] = useState<string>("BMKG");
  const [isLive, setIsLive] = useState<boolean>(false);

  // Fetch real-time earthquake data from BMKG through our API route
  useEffect(() => {
    let mounted = true;

    async function loadSeismicData() {
      try {
        const res = await fetch("/api/seismic-ticker");
        if (!res.ok) return;
        const data = await res.json();
        if (mounted && data.events && data.events.length > 0) {
          setEvents(data.events);
          if (data.source) setSourceName(data.source);
          setIsLive(data.source !== "Fallback");
        }
      } catch (err) {
        console.warn("Unable to fetch live seismic data, using cache/fallback:", err);
      }
    }

    loadSeismicData();

    // Auto-refresh every 3 minutes
    const interval = setInterval(loadSeismicData, 180000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const displayEvents = [...events, ...events];

  return (
    <div className="w-full overflow-hidden border-y border-[#202B36] bg-[#0B0F14]/90 backdrop-blur-md">
      <div className="flex items-center">
        {/* Fixed label */}
        <div className="shrink-0 px-4 py-2.5 border-r border-[#202B36] bg-[#111820] flex items-center gap-2 z-10 shadow-sm">
          <span
            className={`w-2 h-2 rounded-full ${
              isLive
                ? "bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-[pulse_1.5s_ease-in-out_infinite]"
                : "bg-[#D95C5C] animate-[pulse_2s_ease-in-out_infinite]"
            }`}
          />
          <span className="text-[11px] font-mono font-bold text-[#E2E8F0] uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5">
            <span>SEISMIK</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold bg-[#202B36] text-[#4FD1C5]">
              {isLive ? "LIVE BMKG" : "TERKINI"}
            </span>
          </span>
        </div>

        {/* Scrolling ticker */}
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-ticker flex items-center whitespace-nowrap">
            {displayEvents.map((q, i) => {
              const magNum = parseFloat(q.mag);
              return (
                <div
                  key={`${q.loc}-${q.time}-${i}`}
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#151D26]/50 transition-colors"
                  title={q.potensi || q.dirasakan ? `${q.loc} | ${q.potensi || ""} ${q.dirasakan ? `(Dirasakan: ${q.dirasakan})` : ""}` : undefined}
                >
                  <span
                    className={`text-xs font-mono font-black px-1.5 py-0.5 rounded ${
                      magNum >= 5
                        ? "bg-[#D95C5C]/20 text-[#EF4444] border border-[#D95C5C]/40"
                        : magNum >= 4
                        ? "bg-[#D6A84F]/20 text-[#F59E0B] border border-[#D6A84F]/40"
                        : "bg-[#202B36] text-[#38BDF8]"
                    }`}
                  >
                    M{q.mag}
                  </span>
                  <span className="text-[11px] font-medium text-[#CBD5E1] truncate max-w-[320px]">
                    {q.loc}
                  </span>
                  <span className="text-[11px] font-mono text-[#6F7B86] bg-[#111820] px-1.5 py-0.5 rounded">
                    {q.depth}
                  </span>
                  <span className="text-[11px] font-mono text-[#6F7B86]">
                    {q.date ? `${q.date.split(" ").slice(0, 2).join(" ")}, ` : ""}{q.time}
                  </span>
                  {q.dirasakan && (
                    <span className="text-[10px] text-[#A78BFA] bg-[#8B5CF6]/10 px-1 rounded border border-[#8B5CF6]/20 hidden sm:inline">
                      Dirasakan
                    </span>
                  )}
                  <span className="text-[#202B36] select-none mx-1">·</span>
                </div>
              );
            })}
          </div>
          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#0B0F14] to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0B0F14] to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </div>
  );
}

