"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSimulationStore } from "@/stores/simulationStore";
import { getScenarioById } from "@/data/scenarios";
import { EarthquakeParameters, EruptionParameters } from "@/simulation/types";

export default function SimulationResultPage() {
  const router = useRouter();
  const { result, scenarioId, parameters, restartSimulation } = useSimulationStore();
  const scenario = scenarioId ? getScenarioById(scenarioId) : null;

  // Fallback if accessed directly without running simulation
  if (!result) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-6 max-w-lg mx-auto text-center flex flex-col items-center justify-center bg-[#0B0F14]">
        <div className="p-6 rounded-[14px] bg-[#111820] border border-[#202B36]">
          <h1 className="text-lg font-bold text-[#F2F5F7] mb-2 font-display">Belum Ada Hasil Simulasi</h1>
          <p className="text-[#A9B3BD] text-xs leading-relaxed mb-6">
            Jalankan salah satu skenario simulasi terlebih dahulu untuk melihat evaluasi dampak visual dan rekomendasi mitigasi.
          </p>
          <div>
            <Link
              href="/simulation/setup"
              className="inline-block py-2.5 px-4 rounded-[10px] bg-[#57C7D9] text-[#0B0F14] font-semibold text-xs transition-colors"
            >
              Konfigurasi simulasi →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isEarthquake = result.disasterType === "earthquake";
  const eqParams = isEarthquake ? (parameters as EarthquakeParameters | null) : null;
  const erParams = !isEarthquake ? (parameters as EruptionParameters | null) : null;

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-5xl mx-auto bg-[#0B0F14] text-[#F2F5F7]">
      {/* Header (§27) */}
      <div className="mb-10">
        <span className="text-xs font-mono uppercase text-[#57C7D9] font-medium tracking-wider block mb-1">
          Laporan Hasil Simulasi (§27, §28)
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F2F5F7] font-display">
          Apa yang baru saja terjadi?
        </h1>
        <p className="text-xs text-[#A9B3BD] mt-1 max-w-xl">
          Evaluasi ilmiah hubungan sebab-akibat antara parameter skenario dengan dampak visual yang teramati.
        </p>
      </div>

      {/* Recap Banner */}
      <div className="p-6 rounded-[14px] bg-[#111820] border border-[#202B36] mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-mono font-medium"
              style={{ color: isEarthquake ? "#D6A84F" : "#E8754A" }}
            >
              {isEarthquake ? "Domain Gempa Tektonik" : "Domain Erupsi Vulkanik"}
            </span>
            <span className="text-[#6F7B86]">•</span>
            <h2 className="text-base font-semibold text-[#F2F5F7] font-display">
              {scenario?.name || result.scenario}
            </h2>
          </div>
          <p className="text-xs text-[#A9B3BD]">
            Lokasi: {scenario?.location || "Indonesia"}
          </p>
        </div>

        {/* Parameters recap (§22 format) */}
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          {isEarthquake ? (
            <>
              <div className="px-3 py-1.5 rounded-[8px] bg-[#18212B] border border-[#202B36] text-[#A9B3BD]">
                M <span className="text-[#D6A84F] font-semibold">{eqParams?.magnitude ?? 6.5}</span>
              </div>
              <div className="px-3 py-1.5 rounded-[8px] bg-[#18212B] border border-[#202B36] text-[#A9B3BD]">
                Kedalaman: <span className="text-[#F2F5F7]">{eqParams?.depth ?? 10} km</span>
              </div>
            </>
          ) : (
            <>
              <div className="px-3 py-1.5 rounded-[8px] bg-[#18212B] border border-[#202B36] text-[#A9B3BD]">
                Tipe: <span className="text-[#E8754A] font-semibold capitalize">{erParams?.eruptionType ?? "eksplosif"}</span>
              </div>
              <div className="px-3 py-1.5 rounded-[8px] bg-[#18212B] border border-[#202B36] text-[#A9B3BD]">
                Jarak: <span className="text-[#F2F5F7]">{erParams?.settlementDistance ?? 10} km</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Observed Effects & Explanation (§27) */}
      <div className="mb-8">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#A9B3BD] mb-4">
          Dampak Teramati & Sebab Terjadinya
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.impacts.map((imp, idx) => (
            <div
              key={idx}
              className="p-5 rounded-[14px] bg-[#111820] border border-[#202B36] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-medium text-[#57C7D9] uppercase">
                    {imp.category}
                  </span>
                  <span className="text-[11px] font-mono text-[#6F7B86] capitalize">
                    Tingkat: {imp.severity}
                  </span>
                </div>
                <p className="text-xs text-[#A9B3BD] leading-relaxed">
                  {imp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Mitigation (§29: 01, 02, 03 concise format) */}
      <div className="p-6 rounded-[14px] bg-[#111820] border border-[#202B36] mb-8">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#63B98A] mb-4">
          Langkah Mitigasi Kunci (§29)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {result.mitigationActions.map((act, i) => (
            <div
              key={act.step || i}
              className="p-4 rounded-[10px] bg-[#18212B] border border-[#202B36]"
            >
              <div className="text-xs font-mono font-semibold text-[#63B98A] mb-2">
                0{i + 1}
              </div>
              <h4 className="text-xs font-semibold text-[#F2F5F7] mb-1 font-display">
                {act.action}
              </h4>
              <p className="text-xs text-[#A9B3BD] leading-relaxed">
                {act.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Reference Attribution */}
      <div className="p-4 rounded-[10px] bg-[#111820] border border-[#202B36] flex flex-wrap items-center justify-between text-xs text-[#6F7B86] font-mono mb-8">
        <span>Rujukan Data: BMKG, PVMBG, BNPB (inaRISK)</span>
        <span>Model Edukasi Terkalibrasi</span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => {
            restartSimulation();
            router.push(`/simulation/${scenarioId || "eq-yogyakarta"}`);
          }}
          className="px-4 py-2.5 rounded-[10px] bg-[#18212B] hover:bg-[#202B36] border border-[#202B36] text-xs font-medium text-[#F2F5F7] transition-colors cursor-pointer"
        >
          Putar ulang simulasi
        </button>

        <Link
          href={`/quiz?scenario=${scenarioId || "eq-yogyakarta"}`}
          className="px-5 py-2.5 rounded-[10px] bg-[#57C7D9] hover:bg-[#46B6C8] text-[#0B0F14] text-xs font-semibold transition-colors"
        >
          Uji pemahaman di quiz →
        </Link>

        <Link
          href="/simulation/setup"
          className="px-4 py-2.5 rounded-[10px] bg-[#111820] hover:bg-[#18212B] border border-[#202B36] text-xs font-medium text-[#A9B3BD] hover:text-[#F2F5F7] transition-colors"
        >
          Ganti skenario
        </Link>
      </div>
    </div>
  );
}
