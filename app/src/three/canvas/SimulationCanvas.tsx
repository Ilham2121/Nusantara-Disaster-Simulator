"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationStore } from "@/stores/simulationStore";
import { EarthquakeParameters, EruptionParameters, EnvironmentType } from "@/simulation/types";
import { SceneLighting } from "../lighting/SceneLighting";
import { SimulationCamera, CameraPreset } from "../cameras/SimulationCamera";
import { UrbanEnvironment } from "../environments/UrbanEnvironment";
import { CoastalEnvironment } from "../environments/CoastalEnvironment";
import { RuralEnvironment } from "../environments/RuralEnvironment";
import { VolcanicEnvironment } from "../environments/VolcanicEnvironment";
import { KrakatauEnvironment } from "../environments/KrakatauEnvironment";
import { SemeruEnvironment } from "../environments/SemeruEnvironment";
import { RinjaniEnvironment } from "../environments/RinjaniEnvironment";
import { useTimelineSync } from "../hooks/useTimelineSync";

/**
 * Inner component to run R3F frame hooks
 */
function SimulationSync() {
  useTimelineSync();
  return null;
}


export interface SimulationCanvasProps {
  initialPreset?: CameraPreset;
  className?: string;
  showCameraControls?: boolean;
}

export function SimulationCanvas({
  initialPreset = "overview",
  className = "w-full h-full relative",
  showCameraControls = true,
}: SimulationCanvasProps) {
  const [mounted, setMounted] = useState(false);
  const [preset, setPreset] = useState<CameraPreset>(initialPreset);

  const disasterType = useSimulationStore((s) => s.disasterType);
  const scenarioId = useSimulationStore((s) => s.scenarioId);
  const parameters = useSimulationStore((s) => s.parameters);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`${className} flex items-center justify-center bg-[#0a0c10]`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-volcanic-orange/30 border-t-volcanic-orange rounded-full animate-spin" />
          <span className="text-xs text-ash tracking-wider uppercase font-medium">
            Memuat World 3D...
          </span>
        </div>
      </div>
    );
  }

  // Determine active environment
  const isEarthquake = disasterType === "earthquake";
  const eqParams = isEarthquake ? (parameters as EarthquakeParameters | null) : null;
  const currentEnv: EnvironmentType = eqParams?.environment ?? "urban";

  const erParams = !isEarthquake ? (parameters as EruptionParameters | null) : null;
  const scId = (scenarioId ?? "").toLowerCase();
  const volcanoName = (erParams?.volcano ?? "").toLowerCase();

  const isKrakatau = scId.includes("krakatau") || volcanoName.includes("krakatau");
  const isSemeru = scId.includes("semeru") || volcanoName.includes("semeru");
  const isRinjani = scId.includes("rinjani") || volcanoName.includes("rinjani");

  return (
    <div className={className}>
      <Canvas
        shadows={{ type: THREE.PCFShadowMap }}
        camera={{ position: [24, 18, 24], fov: 45 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
          powerPreference: "high-performance",
        }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <SimulationSync />
          <SceneLighting />
          <SimulationCamera preset={preset} />

          {/* Regional Environment Switching */}
          {isEarthquake ? (
            currentEnv === "coastal" ? (
              <CoastalEnvironment />
            ) : currentEnv === "rural" ? (
              <RuralEnvironment />
            ) : (
              <UrbanEnvironment />
            )
          ) : isKrakatau ? (
            <KrakatauEnvironment />
          ) : isSemeru ? (
            <SemeruEnvironment />
          ) : isRinjani ? (
            <RinjaniEnvironment />
          ) : (
            <VolcanicEnvironment />
          )}
        </Suspense>
      </Canvas>

      {/* Floating HUD Top Bar: Camera & Volcano Identifier */}
      {showCameraControls && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {/* Volcano Identifier Badge for Eruption */}
          {!isEarthquake && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-[#0B0F14]/90 backdrop-blur-md border border-[#202B36] shadow-lg text-[11px] sm:text-xs font-semibold text-[#E8754A]">
              <span>🌋</span>
              <span>
                {isKrakatau
                  ? "Anak Krakatau"
                  : isSemeru
                  ? "Semeru"
                  : isRinjani
                  ? "Rinjani"
                  : "Merapi"}
              </span>
            </div>
          )}

          {/* Camera Preset Floating Switcher HUD */}
          <div className="flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 rounded-xl bg-[#0B0F14]/90 backdrop-blur-md border border-[#202B36] shadow-lg">
            <span className="text-[10px] font-bold text-[#6F7B86] px-1.5 uppercase tracking-wider hidden md:inline">
              Kamera:
            </span>
            {(
              [
                { id: "overview", label: "Overview", icon: "🌐" },
                { id: "street", label: "Street", icon: "🏙️" },
                { id: "closeup", label: "Close-up", icon: "🔍" },
                { id: "cinematic", label: "Cinematic", icon: "🎬" },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => setPreset(item.id)}
                title={item.label}
                aria-label={item.label}
                className={`p-1.5 sm:px-2.5 sm:py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1 cursor-pointer min-w-[28px] sm:min-w-0 justify-center ${
                  preset === item.id
                    ? "bg-[#D6A84F]/20 text-[#D6A84F] border border-[#D6A84F]/40 shadow-sm"
                    : "text-[#A9B3BD] hover:text-[#F2F5F7] hover:bg-[#18212B]"
                }`}
              >
                <span className="text-xs sm:text-sm">{item.icon}</span>
                <span className="hidden md:inline text-[11px]">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
