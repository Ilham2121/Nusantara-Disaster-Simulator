"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { useSimulationStore } from "@/stores/simulationStore";
import { EarthquakeParameters, EarthquakeComputedState } from "@/simulation/types";

interface EarthCrossSectionProps {
  className?: string;
}

/**
 * 2D Canvas cross-section of Earth's interior showing:
 * - Crust, upper mantle, lower mantle layers
 * - Hypocenter point at correct depth
 * - P-wave and S-wave radial propagation circles
 * - Seismic ray paths from hypocenter to surface
 * - Real-time wave front animation synchronized with simulation progress
 */
export function EarthCrossSection({ className = "" }: EarthCrossSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const disasterType = useSimulationStore((s) => s.disasterType);
  const parameters = useSimulationStore((s) => s.parameters);
  const computedState = useSimulationStore((s) => s.computedState);
  const currentTime = useSimulationStore((s) => s.currentTime);
  const totalDuration = useSimulationStore((s) => s.totalDuration);
  const simulationState = useSimulationStore((s) => s.simulationState);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    if (disasterType !== "earthquake") {
      ctx.clearRect(0, 0, w, h);
      return;
    }

    const eqParams = parameters as EarthquakeParameters | null;
    const eqState = computedState as EarthquakeComputedState | null;
    if (!eqParams || !eqState) return;

    const progress = totalDuration > 0 ? currentTime / totalDuration : 0;
    const magnitude = eqParams.magnitude;
    const depth = eqParams.depth;
    const intensity = eqState.shakingIntensityValue;

    // Layout constants
    const surfaceY = h * 0.25;
    const maxDepthKm = 100;
    const kmToPixel = (h * 0.65) / maxDepthKm;

    const epicenterX = w * 0.5;
    const hypoY = surfaceY + depth * kmToPixel;

    // Clear
    ctx.fillStyle = "#0B0F14";
    ctx.fillRect(0, 0, w, h);

    // --- Earth layers ---
    // Sky
    ctx.fillStyle = "#0f1729";
    ctx.fillRect(0, 0, w, surfaceY);

    // Surface line
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, surfaceY);
    ctx.lineTo(w, surfaceY);
    ctx.stroke();

    // Crust (0-35 km)
    const crustBottom = surfaceY + 35 * kmToPixel;
    const crustGrad = ctx.createLinearGradient(0, surfaceY, 0, crustBottom);
    crustGrad.addColorStop(0, "#3d2b1f");
    crustGrad.addColorStop(1, "#5c3d2e");
    ctx.fillStyle = crustGrad;
    ctx.fillRect(0, surfaceY, w, crustBottom - surfaceY);

    // Upper Mantle (35-70 km)
    const mantleBottom = surfaceY + 70 * kmToPixel;
    const mantleGrad = ctx.createLinearGradient(0, crustBottom, 0, mantleBottom);
    mantleGrad.addColorStop(0, "#6b3a2a");
    mantleGrad.addColorStop(1, "#8b4513");
    ctx.fillStyle = mantleGrad;
    ctx.fillRect(0, crustBottom, w, mantleBottom - crustBottom);

    // Lower section (70-100 km)
    const lowerGrad = ctx.createLinearGradient(0, mantleBottom, 0, h);
    lowerGrad.addColorStop(0, "#a0522d");
    lowerGrad.addColorStop(1, "#cd853f");
    ctx.fillStyle = lowerGrad;
    ctx.fillRect(0, mantleBottom, w, h - mantleBottom);

    // Layer boundary lines
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    [crustBottom, mantleBottom].forEach((y) => {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Layer labels
    ctx.font = "10px monospace";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.textAlign = "left";
    ctx.fillText("Kerak Bumi (Crust)", 8, surfaceY + 16);
    ctx.fillText("Mantel Atas", 8, crustBottom + 14);
    ctx.fillText("Mantel Bawah", 8, mantleBottom + 14);

    // Depth scale on right
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    for (let d = 0; d <= maxDepthKm; d += 20) {
      const y = surfaceY + d * kmToPixel;
      ctx.fillText(`${d} km`, w - 6, y + 4);
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w - 35, y);
      ctx.stroke();
    }

    // --- Fault line ---
    ctx.strokeStyle = "rgba(220, 38, 38, 0.6)";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 3]);
    ctx.beginPath();
    ctx.moveTo(epicenterX - 30, hypoY - 30);
    ctx.lineTo(epicenterX + 30, hypoY + 30);
    ctx.stroke();
    ctx.setLineDash([]);

    // --- Hypocenter ---
    const hypoGlow = 4 + Math.sin(currentTime * 6) * 2;
    ctx.beginPath();
    ctx.arc(epicenterX, hypoY, hypoGlow, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(239, 68, 68, ${0.6 + Math.sin(currentTime * 8) * 0.2})`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(epicenterX, hypoY, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#fbbf24";
    ctx.fill();

    // Hypocenter label
    ctx.font = "bold 10px monospace";
    ctx.fillStyle = "#fbbf24";
    ctx.textAlign = "left";
    ctx.fillText(`★ Hiposentrum`, epicenterX + 10, hypoY - 6);
    ctx.font = "9px monospace";
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillText(`M${magnitude.toFixed(1)} | ${depth} km`, epicenterX + 10, hypoY + 8);

    // Epicenter on surface
    ctx.beginPath();
    ctx.arc(epicenterX, surfaceY, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#ef4444";
    ctx.fill();
    ctx.font = "9px monospace";
    ctx.fillStyle = "#ef4444";
    ctx.textAlign = "center";
    ctx.fillText("Episentrum", epicenterX, surfaceY - 8);

    // --- Seismic ray path (dashed line from hypo to surface) ---
    ctx.strokeStyle = "rgba(251, 191, 36, 0.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(epicenterX, hypoY);
    ctx.lineTo(epicenterX, surfaceY);
    ctx.stroke();
    ctx.setLineDash([]);

    // --- P-Wave propagation circle ---
    if (progress > 0.01) {
      const pSpeed = 6.0; // km/s
      const elapsedSec = currentTime;
      const pRadiusKm = pSpeed * elapsedSec;
      const pRadiusPx = pRadiusKm * kmToPixel;

      if (pRadiusPx > 2 && pRadiusPx < w) {
        ctx.beginPath();
        ctx.arc(epicenterX, hypoY, pRadiusPx, 0, Math.PI * 2);
        const pAlpha = Math.max(0.05, 0.5 - progress * 0.6);
        ctx.strokeStyle = `rgba(251, 191, 36, ${pAlpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // P-wave label
        if (pRadiusPx > 20 && pRadiusPx < w * 0.8) {
          ctx.font = "bold 9px monospace";
          ctx.fillStyle = `rgba(251, 191, 36, ${pAlpha + 0.2})`;
          ctx.textAlign = "center";
          ctx.fillText("Gelombang P", epicenterX + pRadiusPx * 0.7, hypoY - pRadiusPx * 0.7 - 4);
        }
      }
    }

    // --- S-Wave propagation circle ---
    if (progress > 0.08) {
      const sSpeed = 3.5; // km/s
      const sDelay = (eqState.spIntervalSeconds ?? 2) * 0.3;
      const sElapsed = Math.max(0, currentTime - sDelay);
      const sRadiusKm = sSpeed * sElapsed;
      const sRadiusPx = sRadiusKm * kmToPixel;

      if (sRadiusPx > 2 && sRadiusPx < w) {
        ctx.beginPath();
        ctx.arc(epicenterX, hypoY, sRadiusPx, 0, Math.PI * 2);
        const sAlpha = Math.max(0.05, 0.6 - progress * 0.5);
        ctx.strokeStyle = `rgba(244, 63, 94, ${sAlpha})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        if (sRadiusPx > 20 && sRadiusPx < w * 0.8) {
          ctx.font = "bold 9px monospace";
          ctx.fillStyle = `rgba(244, 63, 94, ${sAlpha + 0.2})`;
          ctx.textAlign = "center";
          ctx.fillText("Gelombang S", epicenterX - sRadiusPx * 0.7, hypoY + sRadiusPx * 0.7 + 12);
        }
      }
    }

    // --- Surface wave indication ---
    if (progress > 0.25) {
      const surfWaveAlpha = Math.max(0, Math.min(0.6, (progress - 0.25) * 2));
      const surfWaveSpread = Math.min(w * 0.45, (progress - 0.25) * w * 1.2);

      ctx.strokeStyle = `rgba(168, 85, 247, ${surfWaveAlpha})`;
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        const offset = surfWaveSpread * (0.6 + i * 0.2);
        ctx.beginPath();
        ctx.moveTo(epicenterX - offset, surfaceY);
        // Wavy surface deformation
        for (let x = epicenterX - offset; x <= epicenterX + offset; x += 4) {
          const dist = Math.abs(x - epicenterX);
          const waveAmp = 3 * intensity * Math.exp(-dist / (surfWaveSpread * 0.5)) * Math.sin(dist * 0.15 - currentTime * 5);
          ctx.lineTo(x, surfaceY + waveAmp);
        }
        ctx.stroke();
      }

      if (surfWaveSpread > 30) {
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = `rgba(168, 85, 247, ${surfWaveAlpha})`;
        ctx.textAlign = "center";
        ctx.fillText("Surface Waves", epicenterX, surfaceY - 18);
      }
    }

    // --- Intensity info HUD ---
    ctx.textAlign = "left";
    ctx.font = "bold 11px monospace";
    ctx.fillStyle = "#57C7D9";
    ctx.fillText("Penampang Bumi (Cross-Section)", 8, 16);

    ctx.font = "9px monospace";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    const infoY = 32;
    ctx.fillText(`PGA: ${(eqState.pgaG ?? 0).toFixed(2)}g`, 8, infoY);
    ctx.fillText(`MMI: ${eqState.mmiScale ?? "-"}`, 100, infoY);
    ctx.fillText(`S-P Gap: ${(eqState.spIntervalSeconds ?? 0).toFixed(1)}s`, 160, infoY);

    // --- Buildings on surface (simplified silhouettes) ---
    ctx.fillStyle = "#1e293b";
    const buildingWidths = [6, 10, 5, 8, 4, 7, 5];
    let bx = epicenterX - 60;
    buildingWidths.forEach((bw) => {
      const bh = 8 + bw * 1.5;

      // Apply shaking displacement proportional to intensity
      const shakeOffset = progress > 0.1 && progress < 0.85
        ? Math.sin(currentTime * 15 + bx * 0.3) * intensity * 2
        : 0;

      ctx.fillRect(bx + shakeOffset, surfaceY - bh, bw, bh);
      bx += bw + 6;
    });

    // Request next frame if simulation is running
    if (simulationState === "running") {
      rafRef.current = requestAnimationFrame(draw);
    }
  }, [disasterType, parameters, computedState, currentTime, totalDuration, simulationState]);

  useEffect(() => {
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  // Redraw on any state change during simulation
  useEffect(() => {
    if (simulationState === "running") {
      rafRef.current = requestAnimationFrame(draw);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [simulationState, currentTime, draw]);

  if (disasterType !== "earthquake") return null;

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ display: "block" }}
    />
  );
}
