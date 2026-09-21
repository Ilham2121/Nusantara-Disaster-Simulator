"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { useSimulationStore } from "@/stores/simulationStore";
import { EarthquakeComputedState } from "@/simulation/types";

interface SeismographHUDProps {
  className?: string;
}

/**
 * Compact real-time seismograph waveform display.
 * Draws a continuous waveform trace that visualizes ground motion intensity,
 * letting users see the dramatic difference between M4.5 and M8.0.
 */
export function SeismographHUD({ className = "" }: SeismographHUDProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const historyRef = useRef<number[]>([]);
  const rafRef = useRef<number>(0);
  const maxSamples = 200;

  const disasterType = useSimulationStore((s) => s.disasterType);
  const computedState = useSimulationStore((s) => s.computedState);
  const currentTime = useSimulationStore((s) => s.currentTime);
  const simulationState = useSimulationStore((s) => s.simulationState);
  const totalDuration = useSimulationStore((s) => s.totalDuration);

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
    const midY = h * 0.55;

    const eqState = disasterType === "earthquake"
      ? (computedState as EarthquakeComputedState | null)
      : null;
    const intensity = eqState?.shakingIntensityValue ?? 0;
    const progress = totalDuration > 0 ? currentTime / totalDuration : 0;

    // Sample current amplitude
    if (simulationState === "running" && disasterType === "earthquake") {
      let amp = 0;
      if (progress > 0.01 && progress < 0.92) {
        // Generate seismograph trace from multi-frequency superposition
        const t = currentTime;
        const pWave = progress < 0.2 ? Math.sin(t * 55) * 0.3 * intensity : 0;
        const sWave = progress > 0.1 && progress < 0.75
          ? (Math.sin(t * 18) + 0.4 * Math.sin(t * 30)) * 0.6 * intensity * Math.min(1, (progress - 0.1) / 0.15)
          : 0;
        const surfWave = progress > 0.25 && progress < 0.8
          ? Math.sin(t * 5.5) * 0.8 * intensity * Math.min(1, (progress - 0.25) / 0.1)
          : 0;
        const noise = (Math.random() - 0.5) * 0.08 * intensity;

        amp = pWave + sWave + surfWave + noise;

        // Decay envelope for late phase
        if (progress > 0.7) {
          amp *= Math.max(0.05, 1 - (progress - 0.7) / 0.22);
        }
      }
      historyRef.current.push(amp);
      if (historyRef.current.length > maxSamples) {
        historyRef.current.shift();
      }
    }

    const history = historyRef.current;

    // Background
    ctx.fillStyle = "#0a0e14";
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 0.5;
    for (let gy = 0; gy < h; gy += h / 6) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(w, gy);
      ctx.stroke();
    }

    // Center line
    ctx.strokeStyle = "rgba(87, 199, 217, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(w, midY);
    ctx.stroke();

    // Waveform trace
    if (history.length > 1) {
      ctx.beginPath();
      const scaleY = (h * 0.4);
      const stepX = w / maxSamples;

      for (let i = 0; i < history.length; i++) {
        const x = i * stepX;
        const y = midY - history[i] * scaleY;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      // Color shifts with intensity
      const r = Math.round(87 + intensity * 168);
      const g = Math.round(199 - intensity * 140);
      const b = Math.round(217 - intensity * 100);
      ctx.strokeStyle = `rgb(${r},${g},${b})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Glow effect on the latest sample
      if (history.length > 0) {
        const lastX = (history.length - 1) * stepX;
        const lastY = midY - history[history.length - 1] * scaleY;
        ctx.beginPath();
        ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fill();
      }
    }

    // PGA bar gauge (bottom)
    const pgaG = eqState?.pgaG ?? 0;
    const barY = h - 12;
    const barW = w - 16;
    const barH = 6;

    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(8, barY, barW, barH);

    const pgaFill = Math.min(1, pgaG / 1.0);
    const barGrad = ctx.createLinearGradient(8, 0, 8 + barW * pgaFill, 0);
    barGrad.addColorStop(0, "#22c55e");
    barGrad.addColorStop(0.4, "#eab308");
    barGrad.addColorStop(0.7, "#f97316");
    barGrad.addColorStop(1, "#ef4444");
    ctx.fillStyle = barGrad;
    ctx.fillRect(8, barY, barW * pgaFill, barH);

    // Labels
    ctx.font = "bold 9px monospace";
    ctx.fillStyle = "#57C7D9";
    ctx.textAlign = "left";
    ctx.fillText("SEISMOGRAF", 6, 12);

    ctx.font = "8px monospace";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.textAlign = "right";
    ctx.fillText(`PGA: ${pgaG.toFixed(2)}g`, w - 6, 12);

    if (simulationState === "running") {
      rafRef.current = requestAnimationFrame(draw);
    }
  }, [disasterType, computedState, currentTime, totalDuration, simulationState]);

  useEffect(() => {
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  useEffect(() => {
    if (simulationState === "running") {
      rafRef.current = requestAnimationFrame(draw);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [simulationState, currentTime, draw]);

  // Reset history when simulation restarts
  useEffect(() => {
    if (simulationState === "idle" || currentTime === 0) {
      historyRef.current = [];
    }
  }, [simulationState, currentTime]);

  if (disasterType !== "earthquake") return null;

  return (
    <canvas
      ref={canvasRef}
      className={`${className}`}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
