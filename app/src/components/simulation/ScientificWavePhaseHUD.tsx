"use client";

import React from "react";
import { useSimulationStore } from "@/stores/simulationStore";
import { EarthquakeComputedState, EruptionComputedState } from "@/simulation/types";
import { useSimulationAnimations } from "@/three/hooks/useSimulationAnimations";

interface ScientificWavePhaseHUDProps {
  className?: string;
}

/**
 * Unified Real-Time Scientific Wave Phase & PGA Instrument HUD
 * Designed for non-intrusive placement at top-left of the viewport.
 */
export function ScientificWavePhaseHUD({ className = "" }: ScientificWavePhaseHUDProps) {
  const disasterType = useSimulationStore((s) => s.disasterType);
  const computedState = useSimulationStore((s) => s.computedState);
  const simulationState = useSimulationStore((s) => s.simulationState);
  const currentPhase = useSimulationStore((s) => s.currentPhase);
  const { currentWavePhase, pgaG } = useSimulationAnimations();

  if (disasterType === "earthquake") {
    const eqState = computedState as EarthquakeComputedState | null;
    const currentPga = (eqState?.pgaG || pgaG || 0.05).toFixed(2);
    const mmi = eqState?.mmiScale || "VI";

    const isRunning = simulationState === "running";
    const phaseColor =
      currentWavePhase === "p_wave"
        ? "text-amber-400"
        : currentWavePhase === "s_wave"
        ? "text-rose-400"
        : currentWavePhase === "surface_wave"
        ? "text-purple-400"
        : currentWavePhase === "coda_decay"
        ? "text-sky-400"
        : "text-[#A9B3BD]";

    const pingBg =
      currentWavePhase === "p_wave"
        ? "bg-amber-400"
        : currentWavePhase === "s_wave"
        ? "bg-rose-500"
        : currentWavePhase === "surface_wave"
        ? "bg-purple-500"
        : currentWavePhase === "coda_decay"
        ? "bg-sky-400"
        : isRunning
        ? "bg-[#63B98A]"
        : "bg-[#6F7B86]";

    return (
      <div
        className={`flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#0B0F14]/90 backdrop-blur-md border border-[#202B36] shadow-xl ${className}`}
      >
        <div className="relative flex items-center justify-center shrink-0">
          <div className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full ${pingBg} ${isRunning && currentWavePhase !== "idle" ? "animate-ping opacity-75" : ""}`} />
          <div className={`absolute w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full ${pingBg}`} />
        </div>

        <div className="flex flex-col min-w-0">
          <div className="text-[9px] sm:text-[10px] text-[#6F7B86] font-mono uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 truncate">
            <span className="hidden xs:inline">Fase Seismik</span>
            <span className="hidden xs:inline text-[#202B36]">•</span>
            <span className="font-bold text-[#57C7D9]">PGA: {currentPga}g</span>
            <span className="text-[#202B36]">•</span>
            <span className="font-bold text-[#F2F5F7]">MMI {mmi}</span>
          </div>

          <div className={`text-[11px] sm:text-xs font-semibold ${phaseColor} flex items-center gap-1 truncate`}>
            {currentWavePhase === "p_wave" ? (
              <>
                <span>⚡</span>
                <span>Gelombang P<span className="hidden sm:inline"> (Kompresi Vertikal)</span></span>
              </>
            ) : currentWavePhase === "s_wave" ? (
              <>
                <span>💥</span>
                <span>Gelombang S<span className="hidden sm:inline"> (Geser Destruktif)</span></span>
              </>
            ) : currentWavePhase === "surface_wave" ? (
              <>
                <span>🌀</span>
                <span>Gelombang Permukaan<span className="hidden sm:inline"> (Rayleigh)</span></span>
              </>
            ) : currentWavePhase === "coda_decay" ? (
              <>
                <span>📉</span>
                <span>Gelombang Coda<span className="hidden sm:inline"> (Pelemahan)</span></span>
              </>
            ) : (
              <>
                <span>⏳</span>
                <span>{isRunning ? "Propagasi..." : "Sensor Siap"}</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Eruption domain HUD
  const erState = computedState as EruptionComputedState | null;
  const isRunning = simulationState === "running";

  return (
    <div
      className={`flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#0B0F14]/90 backdrop-blur-md border border-[#202B36] shadow-xl ${className}`}
    >
      <div className="relative flex items-center justify-center shrink-0">
        <div
          className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full ${
            isRunning ? "bg-[#E8754A] animate-ping opacity-75" : "bg-[#6F7B86]"
          }`}
        />
        <div
          className={`absolute w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full ${
            isRunning ? "bg-[#E8754A]" : "bg-[#6F7B86]"
          }`}
        />
      </div>

      <div className="flex flex-col min-w-0">
        <div className="text-[9px] sm:text-[10px] text-[#6F7B86] font-mono uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 truncate">
          <span>Telemetri</span>
          <span className="text-[#202B36]">•</span>
          <span className="font-bold text-[#E8754A]">
            {Math.round((erState?.eruptionIntensity ?? 0.5) * 100)}%
          </span>
          <span className="text-[#202B36]">•</span>
          <span className="font-bold text-[#F2F5F7] uppercase">
            {(erState?.evacuationUrgency ?? "sedang")}
          </span>
        </div>

        <div className="text-[11px] sm:text-xs font-semibold text-[#F2F5F7] flex items-center gap-1 truncate">
          <span>🌋</span>
          <span>{currentPhase || (isRunning ? "Erupsi Aktif" : "Pemantauan")}</span>
        </div>
      </div>
    </div>
  );
}
