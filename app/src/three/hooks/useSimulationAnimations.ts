import { useMemo } from "react";
import { useSimulationStore } from "@/stores/simulationStore";
import { EarthquakeComputedState, EruptionComputedState } from "@/simulation/types";

export interface SimulationAnimationsState {
  activeAnimations: Set<string>;
  isAnimActive: (key: string) => boolean;
  hasAnyAnim: (...keys: string[]) => boolean;

  // Earthquake continuous dynamics (0-1 scalars driven by parameters)
  shakeIntensity: number;
  swayAmplitude: number;
  currentWavePhase: "p_wave" | "s_wave" | "surface_wave" | "coda_decay" | "idle";
  pWaveIntensity: number;
  sWaveIntensity: number;
  surfaceWaveRoll: number;
  pgaG: number;
  tileSlideFactor: number;
  shearDriftAngle: number;
  groundWaveAmplitude: number;

  // Continuous effect scalars (parameter-proportional, not On/Off)
  dustDensity: number;
  isDustActive: boolean;
  glassBreakDensity: number;
  isGlassBreaking: boolean;
  objectFallRate: number;
  isObjectsFalling: boolean;
  crackSeverity: number;
  isCrackActive: boolean;
  buildingDamageState: number;
  isStructuralDamaged: boolean;
  isLiquefactionActive: boolean;
  liquefactionIntensity: number;

  // Coastal and Tsunami
  isTsunamiDrawback: boolean;
  isTsunamiWave: boolean;
  tsunamiWaveProgress: number;
  tsunamiFlooding: number;
  isSeaAgitated: boolean;

  // Rural
  isLandslideActive: boolean;
  landslideProgress: number;

  // Eruption continuous dynamics
  mountainRumble: number;
  isExploding: boolean;
  ashColumnScale: number;
  ashColumnHeight: number;
  ashDensity: number;
  lavaProgress: number;
  lavaGlowIntensity: number;
  isPyroclasticFlowing: boolean;
  pyroclasticProgress: number;
  skyDarkness: number;
  ashCoverage: number;
  visibilityFactor: number;
  progress: number;
  safeZoneHighlight: boolean;
  evacuationIndicators: boolean;
}

/**
 * Smooth phase envelope: ramp up at start, sustain, ramp down at end.
 * Returns 0-1 based on where `t` sits within [start, end].
 */
function phaseEnvelope(t: number, start: number, end: number, rampIn = 0.15, rampOut = 0.2): number {
  if (t < start || t > end) return 0;
  const duration = end - start;
  const local = (t - start) / duration;
  const fadeIn = Math.min(1, local / rampIn);
  const fadeOut = Math.min(1, (1 - local) / rampOut);
  return fadeIn * fadeOut;
}

export function useSimulationAnimations(): SimulationAnimationsState {
  const activeEvents = useSimulationStore((s) => s.activeEvents);
  const computedState = useSimulationStore((s) => s.computedState);
  const currentTime = useSimulationStore((s) => s.currentTime);
  const totalDuration = useSimulationStore((s) => s.totalDuration);
  const disasterType = useSimulationStore((s) => s.disasterType);

  return useMemo(() => {
    const activeSet = new Set<string>();
    activeEvents.forEach((event) => {
      event.animations.forEach((anim) => activeSet.add(anim));
    });

    const isAnimActive = (key: string) => activeSet.has(key);
    const hasAnyAnim = (...keys: string[]) => keys.some((k) => activeSet.has(k));

    const progress = totalDuration > 0 ? currentTime / totalDuration : 0;

    // --- Earthquake: parameter-driven continuous scalars ---
    const eqState = disasterType === "earthquake" ? (computedState as EarthquakeComputedState | null) : null;
    const intensity = eqState?.shakingIntensityValue ?? 0;

    // Wave phase detection with smooth transitions
    let currentWavePhase: "p_wave" | "s_wave" | "surface_wave" | "coda_decay" | "idle" = "idle";
    let pWaveIntensity = 0;
    let sWaveIntensity = 0;
    let surfaceWaveRoll = 0;

    if (disasterType === "earthquake" && intensity > 0) {
      // Phase boundaries (proportional to timeline structure in earthquake.ts)
      const pEnd = 0.15;
      const sEnd = 0.32;
      const surfEnd = 0.72;
      const codaEnd = 0.92;

      if (progress > 0.005 && progress <= pEnd) {
        currentWavePhase = "p_wave";
        pWaveIntensity = phaseEnvelope(progress, 0, pEnd, 0.3, 0.3) * intensity;
      } else if (progress > pEnd && progress <= sEnd) {
        currentWavePhase = "s_wave";
        sWaveIntensity = phaseEnvelope(progress, pEnd, sEnd, 0.2, 0.15) * intensity;
        pWaveIntensity = 0.15 * intensity * Math.max(0, 1 - (progress - pEnd) / 0.1);
      } else if (progress > sEnd && progress <= surfEnd) {
        currentWavePhase = "surface_wave";
        surfaceWaveRoll = phaseEnvelope(progress, sEnd, surfEnd, 0.12, 0.25) * intensity;
        sWaveIntensity = 0.6 * intensity * phaseEnvelope(progress, sEnd, surfEnd, 0.1, 0.3);
      } else if (progress > surfEnd && progress <= codaEnd) {
        currentWavePhase = "coda_decay";
        const decay = Math.exp(-(progress - surfEnd) * 8);
        sWaveIntensity = 0.2 * intensity * decay;
        surfaceWaveRoll = 0.15 * intensity * decay;
      }
    }

    // Composite shake intensity: weighted superposition of all active wave phases
    const shakeIntensity = Math.min(1, pWaveIntensity * 0.4 + sWaveIntensity * 0.8 + surfaceWaveRoll * 1.0);

    const pgaG = eqState?.pgaG ?? (intensity * 0.85);
    const swayAmplitude = shakeIntensity * 0.08;

    // Tile sliding scales with PGA and progress
    const tileSlideFactor = pgaG >= 0.18 && progress > 0.28
      ? Math.min(1.0, (progress - 0.28) * 2.5) * Math.min(1.0, pgaG / 0.45) * intensity
      : 0;

    // Structural shear drift from S-wave and surface wave superposition
    const shearDriftAngle = (sWaveIntensity * 0.045) + (surfaceWaveRoll * 0.055);

    // Ground wave ripple amplitude for GroundWaveRipple effect
    const groundWaveAmplitude = disasterType === "earthquake"
      ? Math.min(1, (pWaveIntensity * 0.6 + sWaveIntensity * 0.9 + surfaceWaveRoll * 1.0) * intensity)
      : 0;

    // --- Continuous effect scalars (proportional to intensity, not boolean) ---

    // Dust: density scales with intensity and phase
    const dustDensity = (() => {
      if (disasterType !== "earthquake") return 0;
      if (progress < 0.15) return 0;
      const peakPhase = phaseEnvelope(progress, 0.25, 0.85, 0.15, 0.3);
      if (intensity > 0.55) return peakPhase * 1.0;
      if (intensity > 0.3) return peakPhase * 0.5;
      if (intensity > 0.15) return peakPhase * 0.2;
      return 0;
    })();
    const isDustActive = dustDensity > 0.01;

    // Glass: break density scales with intensity (only above moderate)
    const glassBreakDensity = (() => {
      if (disasterType !== "earthquake" || intensity < 0.45) return 0;
      const phase = phaseEnvelope(progress, 0.3, 0.75, 0.2, 0.1);
      return phase * Math.min(1, (intensity - 0.45) / 0.4);
    })();
    const isGlassBreaking = glassBreakDensity > 0.01;

    // Objects falling: rate scales with intensity
    const objectFallRate = (() => {
      if (disasterType !== "earthquake" || intensity < 0.25) return 0;
      const phase = phaseEnvelope(progress, 0.28, 0.7, 0.15, 0.2);
      return phase * Math.min(1, (intensity - 0.25) / 0.5);
    })();
    const isObjectsFalling = objectFallRate > 0.01;

    // Crack severity: continuous 0-1 damage progression
    const crackSeverity = (() => {
      if (disasterType !== "earthquake" || intensity < 0.35) return 0;
      const phase = phaseEnvelope(progress, 0.25, 0.9, 0.2, 0.05);
      return phase * Math.min(1, (intensity - 0.35) / 0.45);
    })();
    const isCrackActive = crackSeverity > 0.01;

    // Building damage state: progressive 0-1 (intact → cracked → collapsed)
    const buildingDamageState = (() => {
      if (disasterType !== "earthquake" || intensity < 0.2) return 0;
      const peakDamage = Math.min(1, (intensity - 0.2) / 0.6);
      const timeRamp = Math.min(1, Math.max(0, (progress - 0.2) / 0.5));
      return peakDamage * timeRamp;
    })();
    const isStructuralDamaged = buildingDamageState > 0.4;

    // Liquefaction continuous
    const isLiquefactionActive = hasAnyAnim("liquefaction_sand_boils") ||
      Boolean(eqState?.liquefactionPotential && progress > 0.32 && progress < 0.85);
    const liquefactionIntensity = isLiquefactionActive
      ? phaseEnvelope(progress, 0.32, 0.85, 0.15, 0.3) * intensity
      : 0;

    // Coastal Tsunami Dynamics
    const isTsunamiDrawback = hasAnyAnim("sea_water_drawback");
    const isTsunamiWave = hasAnyAnim("tsunami_wave_incoming", "coastal_flooding");
    let tsunamiWaveProgress = 0;
    if (progress > 0.6) {
      tsunamiWaveProgress = Math.min(1.0, (progress - 0.6) / 0.3);
    }
    const tsunamiFlooding = hasAnyAnim("coastal_flooding", "debris_floating")
      ? Math.min(1.0, (progress - 0.7) * 3.3) : 0;
    const isSeaAgitated = hasAnyAnim("sea_agitation") || shakeIntensity > 0.1;

    // Rural Landslide
    const isLandslideActive = hasAnyAnim("hillside_landslide", "rockfall");
    let landslideProgress = 0;
    if (progress > 0.45) {
      landslideProgress = Math.min(1.0, (progress - 0.45) / 0.2);
    }

    // --- Eruption: continuous scalars ---
    const erState = disasterType === "eruption" ? (computedState as EruptionComputedState | null) : null;
    const erIntensity = erState?.eruptionIntensity ?? 0;

    const mountainRumble = hasAnyAnim("mountain_rumble") ? 0.35 * (0.5 + erIntensity * 0.5) : 0;
    const isExploding = hasAnyAnim("eruption_blast", "crater_explosion", "shockwave");

    let ashColumnScale = 0;
    if (progress > 0.12) {
      ashColumnScale = Math.min(1.0, (progress - 0.12) / 0.38) * (0.4 + erIntensity * 0.6);
    }
    const ashColumnHeight = ashColumnScale * 35;

    const ashDensity = hasAnyAnim("ash_particles", "ash_spread_settlement", "dark_sky")
      ? Math.min(1.0, progress * 1.5) * erIntensity
      : 0;

    let lavaProgress = 0;
    if (progress > 0.26) {
      lavaProgress = Math.min(1.0, (progress - 0.26) / 0.48) * (0.3 + erIntensity * 0.7);
    }
    const lavaGlowIntensity = hasAnyAnim("lava_glow", "lava_flow_start", "extreme_heat_glow")
      ? Math.max(0.5, Math.min(1.0, progress * 1.3)) * erIntensity
      : 0;

    const isPyroclasticFlowing = hasAnyAnim("pyroclastic_flow", "extreme_heat_glow");
    let pyroclasticProgress = 0;
    if (progress > 0.36) {
      pyroclasticProgress = Math.min(1.0, (progress - 0.36) / 0.25) * erIntensity;
    }

    const skyDarkness = hasAnyAnim("dark_sky", "environment_darken", "visibility_decrease")
      ? Math.min(0.85, (progress - 0.2) * 1.3) * erIntensity
      : 0;

    const ashCoverage = hasAnyAnim("roofs_covered_ash", "trees_damaged", "vehicles_covered")
      ? Math.min(1.0, (progress - 0.5) * 2.0) * erIntensity
      : progress > 0.6 ? 0.4 * erIntensity : 0;

    const visibilityFactor = hasAnyAnim("visibility_decrease")
      ? Math.max(0.15, 1.0 - erIntensity * 0.8)
      : 1.0;

    const safeZoneHighlight = hasAnyAnim("safe_zone_highlight");
    const evacuationIndicators = hasAnyAnim("evacuation_indicators");

    return {
      activeAnimations: activeSet,
      isAnimActive,
      hasAnyAnim,
      shakeIntensity,
      swayAmplitude,
      currentWavePhase,
      pWaveIntensity,
      sWaveIntensity,
      surfaceWaveRoll,
      pgaG,
      tileSlideFactor,
      shearDriftAngle,
      groundWaveAmplitude,
      dustDensity,
      isDustActive,
      glassBreakDensity,
      isGlassBreaking,
      objectFallRate,
      isObjectsFalling,
      crackSeverity,
      isCrackActive,
      buildingDamageState,
      isStructuralDamaged,
      isLiquefactionActive,
      liquefactionIntensity,
      isTsunamiDrawback,
      isTsunamiWave,
      tsunamiWaveProgress,
      tsunamiFlooding,
      isSeaAgitated,
      isLandslideActive,
      landslideProgress,
      mountainRumble,
      isExploding,
      ashColumnScale,
      ashColumnHeight,
      ashDensity,
      lavaProgress,
      lavaGlowIntensity,
      isPyroclasticFlowing,
      pyroclasticProgress,
      skyDarkness,
      ashCoverage,
      visibilityFactor,
      progress,
      safeZoneHighlight,
      evacuationIndicators,
    };
  }, [activeEvents, computedState, currentTime, totalDuration, disasterType]);
}
