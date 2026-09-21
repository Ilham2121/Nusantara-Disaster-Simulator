"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { earthquakeScenarios, eruptionScenarios } from "@/data/scenarios";
import {
  DisasterType,
  ScenarioDefinition,
  EarthquakeParameters,
  EruptionParameters,
  ActivityLevel,
  EruptionType,
} from "@/simulation/types";
import { computeEarthquakeState } from "@/simulation/rules/earthquake";
import { computeEruptionState } from "@/simulation/rules/eruption";
import { useSimulationStore } from "@/stores/simulationStore";

function SetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  const [selectedType, setSelectedType] = useState<DisasterType>(
    typeParam === "eruption" ? "eruption" : "earthquake"
  );

  const scenarios = selectedType === "earthquake" ? earthquakeScenarios : eruptionScenarios;
  const [selectedScenario, setSelectedScenario] = useState<ScenarioDefinition>(scenarios[0]);

  // Editable parameters state
  const [eqParams, setEqParams] = useState<EarthquakeParameters>(
    scenarios[0].defaultParameters as EarthquakeParameters
  );
  const [erParams, setErParams] = useState<EruptionParameters>(
    eruptionScenarios[0].defaultParameters as EruptionParameters
  );

  // Store actions
  const { setDisasterType, setScenario, setParameters, initializeEngine } = useSimulationStore();

  useEffect(() => {
    if (typeParam === "eruption" || typeParam === "earthquake") {
      setSelectedType(typeParam);
      const list = typeParam === "earthquake" ? earthquakeScenarios : eruptionScenarios;
      setSelectedScenario(list[0]);
      if (typeParam === "earthquake") {
        setEqParams(list[0].defaultParameters as EarthquakeParameters);
      } else {
        setErParams(list[0].defaultParameters as EruptionParameters);
      }
    }
  }, [typeParam]);

  const handleTypeChange = (type: DisasterType) => {
    setSelectedType(type);
    const list = type === "earthquake" ? earthquakeScenarios : eruptionScenarios;
    setSelectedScenario(list[0]);
    if (type === "earthquake") {
      setEqParams(list[0].defaultParameters as EarthquakeParameters);
    } else {
      setErParams(list[0].defaultParameters as EruptionParameters);
    }
  };

  const handleSelectScenario = (sc: ScenarioDefinition) => {
    setSelectedScenario(sc);
    if (selectedType === "earthquake") {
      setEqParams(sc.defaultParameters as EarthquakeParameters);
    } else {
      setErParams(sc.defaultParameters as EruptionParameters);
    }
  };

  // Real-time computed preview state
  const livePreview = useMemo(() => {
    if (selectedType === "earthquake") {
      const state = computeEarthquakeState(eqParams);
      const riskScore = Math.round(state.shakingIntensityValue * 100);
      return {
        intensityLabel: state.shakingIntensity.toUpperCase(),
        damageLabel: state.damageLevel.toUpperCase(),
        riskScore,
        riskLevel:
          riskScore > 75
            ? "KRITIS"
            : riskScore > 50
            ? "TINGGI"
            : riskScore > 25
            ? "SEDANG"
            : "RENDAH",
        detail: `Intensitas ${state.shakingIntensity} dengan estimasi potensi kerusakan struktur ${state.damageLevel}.`,
      };
    } else {
      const state = computeEruptionState(erParams);
      const riskScore = Math.round(state.eruptionIntensity * 100);
      return {
        intensityLabel: `${Math.round(state.eruptionIntensity * 100)}%`,
        damageLabel: state.evacuationUrgency.toUpperCase(),
        riskScore,
        riskLevel:
          riskScore > 75
            ? "KRITIS"
            : riskScore > 50
            ? "TINGGI"
            : riskScore > 25
            ? "SEDANG"
            : "RENDAH",
        detail: `Tingkat urgensi evakuasi level ${state.evacuationUrgency} pada permukiman berjarak ${erParams.settlementDistance} km.`,
      };
    }
  }, [selectedType, eqParams, erParams]);

  const handleStartSimulation = () => {
    const finalParams = selectedType === "earthquake" ? eqParams : erParams;
    setDisasterType(selectedType);
    setScenario(selectedScenario.id);
    setParameters(finalParams);
    initializeEngine();
    router.push(`/simulation/${selectedScenario.id}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-28 lg:pb-16 px-6 max-w-6xl mx-auto bg-[#0B0F14] text-[#F2F5F7]">
      {/* Header (§19) */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#57C7D9] mb-2 font-mono">
          Konfigurasi Eksperimen
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[#F2F5F7] mb-2 font-display">
          Atur parameter simulasi
        </h1>
        <p className="text-sm text-[#A9B3BD] max-w-xl">
          Tentukan domain bencana, pilih lingkungan geografis, dan sesuaikan parameter fisik sebelum memulai simulasi visual 3D.
        </p>
      </div>

      {/* Disaster Domain Selector */}
      <div className="flex gap-3 mb-10">
        <button
          onClick={() => handleTypeChange("earthquake")}
          className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-[10px] border text-xs font-medium transition-colors cursor-pointer ${
            selectedType === "earthquake"
              ? "bg-[#18212B] border-[#D6A84F] text-[#D6A84F]"
              : "bg-[#111820] border-[#202B36] text-[#A9B3BD] hover:text-[#F2F5F7]"
          }`}
        >
          Domain Gempa Bumi
        </button>

        <button
          onClick={() => handleTypeChange("eruption")}
          className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-[10px] border text-xs font-medium transition-colors cursor-pointer ${
            selectedType === "eruption"
              ? "bg-[#18212B] border-[#E8754A] text-[#E8754A]"
              : "bg-[#111820] border-[#202B36] text-[#A9B3BD] hover:text-[#F2F5F7]"
          }`}
        >
          Domain Erupsi Gunung Api
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Skenario & Parameter Settings (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Step 1: Scenario Selection */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#A9B3BD]">
                1. Pilih Skenario Wilayah
              </h2>
              <span className="text-[11px] text-[#6F7B86] font-mono">
                {scenarios.length} Skenario Tersedia
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {scenarios.map((sc) => {
                const isSelected = selectedScenario.id === sc.id;
                const accentBorder = selectedType === "earthquake" ? "#D6A84F" : "#E8754A";

                return (
                  <div
                    key={sc.id}
                    onClick={() => handleSelectScenario(sc)}
                    style={{ borderColor: isSelected ? accentBorder : undefined }}
                    className={`p-5 rounded-[14px] border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#18212B]"
                        : "bg-[#111820] border-[#202B36] hover:border-[#2C3B4A]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono text-[#A9B3BD]">{sc.location}</span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-[6px] bg-[#202B36] text-[#A9B3BD]">
                          {sc.difficulty}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-[#F2F5F7] mb-1.5 font-display">
                        {sc.name}
                      </h3>
                      <p className="text-xs text-[#A9B3BD] leading-relaxed line-clamp-2">
                        {sc.description}
                      </p>
                    </div>

                    <div className="pt-3 mt-4 border-t border-[#202B36] flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#6F7B86] font-mono">
                        Tingkat: {sc.difficulty}
                      </span>
                      <span
                        className="font-medium text-xs"
                        style={{ color: isSelected ? accentBorder : "#A9B3BD" }}
                      >
                        {isSelected ? "Aktif" : "Pilih"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Parameter Adjustment (§19, §20, §21) */}
          <div className="p-6 rounded-[14px] bg-[#111820] border border-[#202B36]">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#A9B3BD] mb-6">
              2. Sesuaikan Parameter Fungsional
            </h2>

            {selectedType === "earthquake" ? (
              <div className="space-y-6">
                {/* Magnitude Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1.5 text-xs">
                    <span className="font-medium text-[#F2F5F7]">Magnitudo (Mw)</span>
                    <span className="font-mono font-semibold text-[#D6A84F] text-sm">
                      M {eqParams.magnitude.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4.0"
                    max="9.0"
                    step="0.1"
                    value={eqParams.magnitude}
                    onChange={(e) =>
                      setEqParams({ ...eqParams, magnitude: parseFloat(e.target.value) })
                    }
                    className="w-full accent-[#D6A84F] h-1.5 bg-[#18212B] rounded-lg cursor-pointer"
                  />
                  <p className="text-[11px] text-[#6F7B86] mt-1.5">
                    Ukuran energi seismik total yang dilepaskan di bidang patahan (skala logaritmik).
                  </p>
                </div>

                {/* Depth Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1.5 text-xs">
                    <span className="font-medium text-[#F2F5F7]">Kedalaman Hiposenter</span>
                    <span className="font-mono font-semibold text-[#D6A84F] text-sm">
                      {eqParams.depth} km
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="70"
                    step="5"
                    value={eqParams.depth}
                    onChange={(e) =>
                      setEqParams({ ...eqParams, depth: parseInt(e.target.value) })
                    }
                    className="w-full accent-[#D6A84F] h-1.5 bg-[#18212B] rounded-lg cursor-pointer"
                  />
                  <p className="text-[11px] text-[#6F7B86] mt-1.5">
                    Kedalaman sumber getaran dari permukaan bumi. Gempa dangkal (&lt;30 km) menghasilkan guncangan permukaan lebih destruktif.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Eruption Type */}
                <div>
                  <label className="text-xs font-medium text-[#F2F5F7] block mb-2">
                    Tipe Karakter Erupsi
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {(
                      [
                        { id: "explosive", label: "Eksplosif (Abu & Awan Panas)" },
                        { id: "effusive", label: "Efusif (Kubah / Aliran Lava)" },
                        { id: "phreatic", label: "Freatik (Letupan Uap Air)" },
                      ] as { id: EruptionType; label: string }[]
                    ).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setErParams({ ...erParams, eruptionType: t.id })}
                        className={`p-2.5 rounded-[10px] border text-xs font-medium transition-colors cursor-pointer text-left ${
                          erParams.eruptionType === t.id
                            ? "bg-[#18212B] border-[#E8754A] text-[#F2F5F7]"
                            : "bg-[#18212B]/40 border-[#202B36] text-[#A9B3BD] hover:text-[#F2F5F7]"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Settlement Distance */}
                <div>
                  <div className="flex justify-between items-center mb-1.5 text-xs">
                    <span className="font-medium text-[#F2F5F7]">Jarak Permukiman dari Kawah</span>
                    <span className="font-mono font-semibold text-[#E8754A] text-sm">
                      {erParams.settlementDistance} km
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="30"
                    step="1"
                    value={erParams.settlementDistance}
                    onChange={(e) =>
                      setErParams({ ...erParams, settlementDistance: parseInt(e.target.value) })
                    }
                    className="w-full accent-[#E8754A] h-1.5 bg-[#18212B] rounded-lg cursor-pointer"
                  />
                  <p className="text-[11px] text-[#6F7B86] mt-1.5">
                    Jarak radial pemukiman terdekat dari pusat letusan (KRB III: &lt;5 km, KRB II: 5-10 km).
                  </p>
                </div>

                {/* Activity Level */}
                <div>
                  <label className="text-xs font-medium text-[#F2F5F7] block mb-2">
                    Status Tingkat Aktivitas (PVMBG)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(
                      [
                        { id: "normal", label: "Normal" },
                        { id: "advisory", label: "Waspada" },
                        { id: "watch", label: "Siaga" },
                        { id: "warning", label: "Awas" },
                      ] as { id: ActivityLevel; label: string }[]
                    ).map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setErParams({ ...erParams, activityLevel: lvl.id })}
                        className={`p-2 rounded-[10px] border text-xs font-mono transition-colors text-center ${
                          erParams.activityLevel === lvl.id
                            ? "bg-[#18212B] border-[#E8754A] text-[#E8754A] font-semibold"
                            : "bg-[#18212B]/40 border-[#202B36] text-[#A9B3BD] hover:text-[#F2F5F7]"
                        }`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Compact Summary & Launch (§22) (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-[14px] bg-[#111820] border border-[#202B36] sticky top-24 space-y-6">
          <div>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#6F7B86]">
              Ringkasan Konfigurasi (§22)
            </span>
            <h3 className="text-lg font-bold text-[#F2F5F7] mt-1 font-display">
              {selectedScenario.name}
            </h3>
            <p className="text-xs text-[#A9B3BD] mt-0.5">
              {selectedScenario.location}
            </p>
          </div>

          {/* Compact Parameter Summary (§22) */}
          <div className="p-4 rounded-[10px] bg-[#18212B] border border-[#202B36] space-y-3 font-mono text-xs">
            {selectedType === "earthquake" ? (
              <>
                <div className="flex justify-between">
                  <span className="text-[#6F7B86]">MAGNITUDE</span>
                  <span className="text-[#F2F5F7] font-semibold">M {eqParams.magnitude.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F7B86]">DEPTH</span>
                  <span className="text-[#F2F5F7] font-semibold">{eqParams.depth} km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6F7B86]">
                    WILAYAH
                    <span className="ml-1.5 text-[9px] text-[#6F7B86]/70 normal-case">
                      (mengikuti skenario)
                    </span>
                  </span>
                  <span className="text-[#D6A84F] capitalize">{eqParams.environment}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-[#6F7B86]">TIPE ERUPSI</span>
                  <span className="text-[#F2F5F7] font-semibold capitalize">{erParams.eruptionType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F7B86]">DISTANCE</span>
                  <span className="text-[#F2F5F7] font-semibold">{erParams.settlementDistance} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F7B86]">STATUS</span>
                  <span className="text-[#E8754A] uppercase">{erParams.activityLevel}</span>
                </div>
              </>
            )}
          </div>

          {/* Live Telemetry Output */}
          <div className="p-4 rounded-[10px] bg-[#18212B] border border-[#202B36] space-y-2 text-xs">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#6F7B86]">RISIKO TERUKUR:</span>
              <span className="text-[#F2F5F7] font-semibold">{livePreview.riskLevel}</span>
            </div>
            <p className="text-[#A9B3BD] text-xs leading-relaxed">
              {livePreview.detail}
            </p>
          </div>

          {/* Action Button (§22, §46: Natural Microcopy) */}
          <button
            onClick={handleStartSimulation}
            className="w-full py-3 px-4 rounded-[10px] bg-[#57C7D9] hover:bg-[#46B6C8] text-[#0B0F14] text-sm font-semibold transition-colors shadow-sm cursor-pointer"
          >
            Jalankan simulasi
          </button>
        </div>
      </div>

      {/* Mobile Sticky Launch Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-[#0B0F14]/95 border-t border-[#202B36] backdrop-blur-md flex items-center justify-between gap-3 shadow-2xl">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold text-[#F2F5F7] truncate font-display">
            {selectedScenario.name}
          </div>
          <div className="text-[11px] font-mono text-[#57C7D9] flex items-center gap-1.5">
            <span>Risiko: {livePreview.riskLevel}</span>
            <span className="text-[#202B36]">•</span>
            <span className="text-[#A9B3BD] capitalize">{selectedType === "earthquake" ? "Gempa" : "Erupsi"}</span>
          </div>
        </div>
        <button
          onClick={handleStartSimulation}
          className="px-5 py-2.5 rounded-[10px] bg-[#57C7D9] hover:bg-[#46B6C8] text-[#0B0F14] text-xs font-semibold shrink-0 transition-colors shadow-sm cursor-pointer"
        >
          Jalankan simulasi
        </button>
      </div>
    </div>
  );
}

export default function SimulationSetupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 text-center text-[#A9B3BD] text-xs font-mono">Memuat konfigurasi...</div>}>
      <SetupContent />
    </Suspense>
  );
}
