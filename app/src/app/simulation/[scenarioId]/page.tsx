"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getScenarioById, allScenarios } from "@/data/scenarios";
import { useSimulationStore } from "@/stores/simulationStore";
import dynamic from "next/dynamic";
import { EarthquakeParameters, EruptionParameters, PlaybackSpeed } from "@/simulation/types";

const SimulationCanvas = dynamic(
  () => import("@/three/canvas/SimulationCanvas").then((mod) => mod.SimulationCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-[#070B0F] text-[#57C7D9] font-mono text-xs">
        <div className="w-10 h-10 rounded-full border-2 border-[#57C7D9] border-t-transparent animate-spin mb-4" />
        <span className="tracking-wider uppercase">Inisialisasi Lingkungan Grafis 3D...</span>
      </div>
    ),
  }
);

const EarthCrossSection = dynamic(
  () => import("@/components/simulation/EarthCrossSection").then((mod) => mod.EarthCrossSection),
  { ssr: false }
);

const SeismographHUD = dynamic(
  () => import("@/components/simulation/SeismographHUD").then((mod) => mod.SeismographHUD),
  { ssr: false }
);

import { ScientificWavePhaseHUD } from "@/components/simulation/ScientificWavePhaseHUD";

interface PageProps {
  params: Promise<{ scenarioId: string }>;
}

export default function SimulationScreenPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const scenarioId = resolvedParams.scenarioId;
  const scenario = getScenarioById(scenarioId);

  const {
    simulationState,
    currentTime,
    totalDuration,
    playbackSpeed,
    currentPhase,
    activeEvents,
    scenarioId: storeScenarioId,
    parameters,
    result,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    restartSimulation,
    setPlaybackSpeed,
    setDisasterType,
    setScenario,
    setParameters,
    initializeEngine,
  } = useSimulationStore();

  const [dismissedOverlayTime, setDismissedOverlayTime] = useState<number | null>(null);
  const [splitView, setSplitView] = useState<boolean>(false);

  // Initialize engine for this scenario if not yet matching
  useEffect(() => {
    if (scenario && storeScenarioId !== scenario.id) {
      setDisasterType(scenario.disasterType);
      setScenario(scenario.id);
      setParameters(scenario.defaultParameters);
      initializeEngine();
    }
  }, [scenario, storeScenarioId, setDisasterType, setScenario, setParameters, initializeEngine]);

  // Default to splitView on desktop screens (>= 1024px)
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSplitView(true);
    }
  }, []);

  if (!scenario) {
    return (
      <div className="min-h-screen pt-28 pb-12 px-6 flex flex-col items-center justify-center text-center bg-[#0B0F14]">
        <div className="max-w-md p-6 rounded-[14px] bg-[#111820] border border-[#202B36]">
          <h1 className="text-xl font-bold text-[#F2F5F7] mb-2 font-display">Skenario Tidak Ditemukan</h1>
          <p className="text-[#A9B3BD] text-xs mb-6">
            Skenario dengan kode &quot;{scenarioId}&quot; tidak terdaftar dalam simulator geofisika.
          </p>
          <div className="flex flex-col gap-2 text-xs">
            <Link
              href="/simulation/eq-urban"
              className="px-4 py-2 rounded-[10px] bg-[#18212B] border border-[#D6A84F] text-[#D6A84F] font-medium"
            >
              Simulasi Gempa Perkotaan
            </Link>
            <Link
              href="/simulation/er-merapi"
              className="px-4 py-2 rounded-[10px] bg-[#18212B] border border-[#E8754A] text-[#E8754A] font-medium"
            >
              Simulasi Erupsi Merapi
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Active Educational Overlay (§26)
  const currentOverlay = activeEvents.find((e) => e.educationalOverlay)?.educationalOverlay;
  const isOverlayVisible =
    Boolean(currentOverlay) && dismissedOverlayTime !== Math.floor(currentTime);

  const progressPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  const formatTime = (seconds: number) => {
    const s = Math.floor(seconds);
    const mins = Math.floor(s / 60);
    const rem = s % 60;
    return `${String(mins).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
  };

  const isEarthquake = scenario.disasterType === "earthquake";
  const eqParams = isEarthquake ? (parameters as EarthquakeParameters | null) : null;
  const erParams = !isEarthquake ? (parameters as EruptionParameters | null) : null;

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0B0F14] text-[#F2F5F7] overflow-hidden select-none">
      {/* ===== TOP OBSERVATORY HEADER (§24) ===== */}
      <header className="h-14 px-3 sm:px-5 border-b border-[#202B36] bg-[#0B0F14] flex items-center justify-between z-30 shrink-0 gap-2">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link
            href="/simulation/setup"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-[8px] text-xs font-medium text-[#A9B3BD] hover:text-[#F2F5F7] hover:bg-[#111820] border border-[#202B36] transition-colors shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span className="hidden sm:inline">Kembali</span>
          </Link>

          <div className="h-4 w-px bg-[#202B36] shrink-0" />

          <div className="min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-xs sm:text-sm font-bold tracking-tight text-[#F2F5F7] font-display truncate max-w-[130px] sm:max-w-[200px] md:max-w-none">
                {scenario.name}
              </h1>
              <span
                className="hidden sm:inline-block px-2 py-0.5 rounded-[6px] text-[10px] font-mono font-medium shrink-0"
                style={{
                  color: isEarthquake ? "#D6A84F" : "#E8754A",
                  backgroundColor: isEarthquake ? "rgba(214, 168, 79, 0.12)" : "rgba(232, 117, 74, 0.12)",
                }}
              >
                {isEarthquake ? "Gempa Tektonik" : "Erupsi Vulkanik"}
              </span>
            </div>
          </div>
        </div>

        {/* Minimal Parameter HUD (§24) */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
          {isEarthquake ? (
            <>
              <div className="px-2.5 py-1 rounded-[8px] bg-[#111820] border border-[#202B36] text-[#A9B3BD]">
                M <span className="text-[#D6A84F] font-semibold">{eqParams?.magnitude ?? (scenario.defaultParameters as EarthquakeParameters).magnitude}</span>
              </div>
              <div className="px-2.5 py-1 rounded-[8px] bg-[#111820] border border-[#202B36] text-[#A9B3BD]">
                Kedalaman: <span className="text-[#F2F5F7]">{eqParams?.depth ?? (scenario.defaultParameters as EarthquakeParameters).depth} km</span>
              </div>
            </>
          ) : (
            <>
              <div className="px-2.5 py-1 rounded-[8px] bg-[#111820] border border-[#202B36] text-[#A9B3BD]">
                Tipe: <span className="text-[#E8754A] font-semibold capitalize">{erParams?.eruptionType ?? (scenario.defaultParameters as EruptionParameters).eruptionType}</span>
              </div>
              <div className="px-2.5 py-1 rounded-[8px] bg-[#111820] border border-[#202B36] text-[#A9B3BD]">
                Jarak: <span className="text-[#F2F5F7]">{erParams?.settlementDistance ?? (scenario.defaultParameters as EruptionParameters).settlementDistance} km</span>
              </div>
            </>
          )}
        </div>

        {/* Mode & Scenario Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {isEarthquake && (
            <button
              onClick={() => setSplitView((v) => !v)}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-[8px] border text-[11px] sm:text-xs font-mono transition-colors cursor-pointer ${
                splitView
                  ? "bg-[#18212B] border-[#57C7D9] text-[#57C7D9]"
                  : "bg-[#111820] border-[#202B36] text-[#A9B3BD] hover:text-[#F2F5F7]"
              }`}
              title="Beralih antara Split-View 2D/3D dan Layar Penuh 3D"
            >
              <span>{splitView ? "◫ Split 2D" : "◻ Full 3D"}</span>
            </button>
          )}

          <select
            value={scenario.id}
            onChange={(e) => {
              router.push(`/simulation/${e.target.value}`);
            }}
            className="px-2 sm:px-2.5 py-1.5 rounded-[8px] bg-[#111820] border border-[#202B36] text-[11px] sm:text-xs text-[#F2F5F7] font-mono focus:outline-none cursor-pointer max-w-[110px] sm:max-w-[160px] truncate"
          >
            <optgroup label="Skenario Gempa">
              {allScenarios
                .filter((s) => s.disasterType === "earthquake")
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </optgroup>
            <optgroup label="Skenario Erupsi">
              {allScenarios
                .filter((s) => s.disasterType === "eruption")
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </optgroup>
          </select>
        </div>
      </header>

      {/* ===== MAIN SIMULATION VIEWPORT (Split-View Opsi B or Full View) ===== */}
      <main className="relative flex-1 w-full h-full overflow-hidden bg-[#0B0F14] flex flex-col lg:flex-row">
        {/* Primary 3D Viewport Pane */}
        <div
          className={`relative ${
            isEarthquake && splitView ? "w-full lg:w-[60%] flex-1" : "w-full"
          } h-full overflow-hidden bg-[#0B0F14] flex flex-col`}
        >
          <SimulationCanvas />

          {/* Top-Left: Exclusive Unified Scientific Phase & Seismology HUD */}
          <div className="absolute top-3 left-3 z-20 pointer-events-auto max-w-[calc(100%-135px)] sm:max-w-none">
            <ScientificWavePhaseHUD />
          </div>

          {/* Bottom-Left: Subtitle / Event Narration Banner (Clean Lower-Third) */}
          {activeEvents.length > 0 && activeEvents[activeEvents.length - 1].description && (
            <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md z-20 pointer-events-none animate-fade-in">
              <div className="flex items-start gap-2 sm:gap-2.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-[#0B0F14]/90 backdrop-blur-md border border-[#202B36] shadow-xl">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#57C7D9] mt-1 shrink-0 animate-pulse" />
                <p className="text-[11px] sm:text-xs text-[#E2E8F0] font-medium leading-relaxed font-sans">
                  {activeEvents[activeEvents.length - 1].description}
                </p>
              </div>
            </div>
          )}

          {/* Floating Educational Scientific Overlay (Anchored to Right Side on desktop, clean non-overlapping sheet on mobile) */}
          {isOverlayVisible && currentOverlay && (
            <div className="absolute top-14 sm:top-16 left-3 right-3 sm:left-auto sm:right-4 z-30 sm:max-w-sm p-3.5 sm:p-4 rounded-xl bg-[#0F141C]/95 backdrop-blur-md border border-[#57C7D9]/40 shadow-2xl animate-fade-in pointer-events-auto max-h-[42vh] sm:max-h-none overflow-y-auto">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-sm shrink-0">💡</span>
                  <h3 className="text-xs font-semibold text-[#57C7D9] font-display truncate">
                    {currentOverlay.title}
                  </h3>
                </div>
                <button
                  onClick={() => setDismissedOverlayTime(Math.floor(currentTime))}
                  className="text-[#A9B3BD] hover:text-[#F2F5F7] text-xs p-1 rounded-lg hover:bg-[#18212B] transition-colors cursor-pointer shrink-0 min-w-[28px] min-h-[28px] flex items-center justify-center"
                  title="Tutup edukasi"
                  aria-label="Tutup edukasi"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11px] sm:text-xs text-[#A9B3BD] leading-relaxed mb-2 sm:mb-3">
                {currentOverlay.content}
              </p>
              {currentOverlay.source && (
                <div className="pt-2 border-t border-[#202B36] text-[10px] text-[#6F7B86] font-mono">
                  Referensi: <span className="text-[#A9B3BD]">{currentOverlay.source}</span>
                </div>
              )}
            </div>
          )}

          {/* Post-Simulation Transition (§27, §28) */}
          {simulationState === "completed" && result && (
            <div className="absolute inset-0 z-40 bg-[#0B0F14]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              <div className="max-w-md w-full p-5 sm:p-8 rounded-[14px] bg-[#111820] border border-[#202B36] text-center my-auto max-h-[90vh] overflow-y-auto">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#57C7D9] mb-1 block">
                  Simulasi Selesai (§27)
                </span>
                <h2 className="text-xl font-bold text-[#F2F5F7] mb-2 font-display">
                  Apa yang baru saja terjadi?
                </h2>
                <p className="text-xs text-[#A9B3BD] mb-6 leading-relaxed">
                  {result.learningObjective}
                </p>

                {/* Observed Effects (§27) */}
                <div className="grid grid-cols-2 gap-3 mb-6 font-mono text-xs text-left">
                  <div className="p-3 rounded-[8px] bg-[#18212B] border border-[#202B36]">
                    <span className="text-[10px] text-[#6F7B86] uppercase block mb-1">
                      Indeks Risiko
                    </span>
                    <div className="text-lg font-bold text-[#D6A84F]">
                      {result.riskLevel} / 100
                    </div>
                    <div className="text-[11px] text-[#A9B3BD]">
                      {result.riskLabel}
                    </div>
                  </div>

                  <div className="p-3 rounded-[8px] bg-[#18212B] border border-[#202B36]">
                    <span className="text-[10px] text-[#6F7B86] uppercase block mb-1">
                      Dampak Teramati
                    </span>
                    <div className="text-lg font-bold text-[#57C7D9]">
                      {result.impacts.length} Titik
                    </div>
                    <div className="text-[11px] text-[#A9B3BD]">
                      Infrastruktur / Lahan
                    </div>
                  </div>
                </div>

                {/* Mitigation Action (§29) */}
                {result.mitigationActions.length > 0 && (
                  <div className="p-3 mb-6 rounded-[8px] bg-[#18212B] border border-[#202B36] text-left text-xs">
                    <span className="text-[10px] font-mono uppercase text-[#63B98A] font-semibold block mb-1">
                      Tindakan Mitigasi Relevan:
                    </span>
                    <p className="text-[#F2F5F7] font-medium mb-0.5">
                      {result.mitigationActions[0].action}
                    </p>
                    <p className="text-[#A9B3BD] text-[11px] leading-relaxed">
                      {result.mitigationActions[0].detail}
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-2.5 justify-center">
                  <Link
                    href="/simulation/result"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-[10px] bg-[#57C7D9] hover:bg-[#46B6C8] text-[#0B0F14] text-xs font-semibold transition-colors"
                  >
                    Lihat laporan dampak lengkap →
                  </Link>
                  <button
                    onClick={() => restartSimulation()}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-[10px] bg-[#18212B] hover:bg-[#202B36] border border-[#202B36] text-xs font-medium text-[#F2F5F7] transition-colors cursor-pointer"
                  >
                    Ulangi simulasi
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Secondary 2D Geological Cross-Section & Seismograph Pane (Opsi B) */}
        {isEarthquake && splitView && (
          <aside className="w-full lg:w-[40%] min-w-0 lg:min-w-[320px] max-w-full lg:max-w-[500px] h-[280px] sm:h-[340px] lg:h-full border-t lg:border-t-0 lg:border-l border-[#202B36] flex flex-col bg-[#080C11] shrink-0 z-10">
            {/* Top Sub-Panel: Earth Interior Cross-Section */}
            <div className="relative flex-[1.4] w-full min-h-[150px] sm:min-h-[190px] border-b border-[#202B36] flex flex-col overflow-hidden bg-[#0A0E15]">
              <div className="px-3.5 py-2 border-b border-[#202B36]/60 bg-[#0B0F14] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#D6A84F]" />
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#F2F5F7]">
                    Penampang Dalam Bumi (Cross-Section)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#D6A84F] bg-[#D6A84F]/10 px-2 py-0.5 rounded">
                    2D Fisika Seismik
                  </span>
                  <button
                    onClick={() => setSplitView(false)}
                    className="lg:hidden text-[#A9B3BD] hover:text-[#F2F5F7] text-[10px] font-mono px-2 py-0.5 rounded bg-[#18212B] border border-[#202B36] transition-colors cursor-pointer"
                    title="Tutup instrumen 2D"
                  >
                    ✕ Tutup
                  </button>
                </div>
              </div>
              <div className="relative flex-1 w-full h-full overflow-hidden">
                <EarthCrossSection className="w-full h-full" />
              </div>
            </div>

            {/* Bottom Sub-Panel: Seismograph Instrument */}
            <div className="relative flex-1 w-full min-h-[130px] flex flex-col overflow-hidden bg-[#070A0E]">
              <div className="px-3.5 py-1.5 border-b border-[#202B36]/60 bg-[#0B0F14] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#57C7D9] animate-pulse" />
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#F2F5F7]">
                    Instrumen Seismograf Digital
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#57C7D9] bg-[#57C7D9]/10 px-2 py-0.5 rounded">
                  Sensor Stasiun
                </span>
              </div>
              <div className="relative flex-1 w-full h-full p-1.5">
                <SeismographHUD className="w-full h-full rounded-lg" />
              </div>
            </div>
          </aside>
        )}
      </main>

      {/* ===== BOTTOM CONTROL BAR (§24, §25, §46) ===== */}
      <footer className="h-20 px-3 sm:px-6 border-t border-[#202B36] bg-[#0B0F14] flex flex-col justify-center gap-2 z-30 shrink-0">
        {/* Timeline Scrubber (§25) */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-medium text-[#F2F5F7] min-w-[36px]">
            {formatTime(currentTime)}
          </span>
          <div className="relative flex-1 h-1.5 rounded-full bg-[#18212B] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${Math.min(100, Math.max(0, progressPercent))}%`,
                backgroundColor: isEarthquake ? "#D6A84F" : "#E8754A",
              }}
            />
          </div>
          <span className="text-xs font-mono text-[#6F7B86] min-w-[36px] text-right">
            {formatTime(totalDuration)}
          </span>
        </div>

        {/* Transport Controls (§46 Natural Microcopy) & Speed */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {simulationState === "running" ? (
              <button
                onClick={pauseSimulation}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-[8px] bg-[#18212B] border border-[#202B36] text-xs font-medium text-[#F2F5F7] hover:bg-[#202B36] transition-colors cursor-pointer"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                <span>Jeda<span className="hidden sm:inline"> simulasi</span></span>
              </button>
            ) : simulationState === "paused" ? (
              <button
                onClick={resumeSimulation}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-[8px] bg-[#57C7D9] text-[#0B0F14] text-xs font-semibold hover:bg-[#46B6C8] transition-colors cursor-pointer"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Lanjutkan</span>
              </button>
            ) : (
              <button
                onClick={startSimulation}
                className="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 rounded-[8px] bg-[#57C7D9] text-[#0B0F14] text-xs font-semibold hover:bg-[#46B6C8] transition-colors cursor-pointer"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Jalankan<span className="hidden sm:inline"> simulasi</span></span>
              </button>
            )}

            <button
              onClick={restartSimulation}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-[8px] bg-[#111820] border border-[#202B36] text-xs font-medium text-[#A9B3BD] hover:text-[#F2F5F7] hover:bg-[#18212B] transition-colors cursor-pointer"
              title="Ulangi simulasi"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span>Ulangi<span className="hidden sm:inline"> simulasi</span></span>
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 p-0.5 rounded-[8px] bg-[#111820] border border-[#202B36] text-xs font-mono">
            <span className="text-[10px] text-[#6F7B86] px-1 sm:px-1.5">Kec:</span>
            {([1, 2, 4] as PlaybackSpeed[]).map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-1.5 sm:px-2 py-0.5 text-[11px] sm:text-xs rounded-[6px] transition-colors cursor-pointer ${
                  playbackSpeed === speed
                    ? "bg-[#18212B] text-[#57C7D9] font-semibold"
                    : "text-[#A9B3BD] hover:text-[#F2F5F7]"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
