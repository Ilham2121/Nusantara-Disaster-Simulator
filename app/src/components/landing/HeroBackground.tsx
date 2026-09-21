"use client";

import { useEffect, useRef } from "react";

export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number = 0;
    let isVisible = true;

    // Offscreen canvas to cache static observatory grid
    let gridCanvas: HTMLCanvasElement | null = null;

    const createGridCache = (w: number, h: number) => {
      gridCanvas = document.createElement("canvas");
      gridCanvas.width = w;
      gridCanvas.height = h;
      const gCtx = gridCanvas.getContext("2d");
      if (!gCtx) return;

      gCtx.strokeStyle = "rgba(32, 43, 54, 0.4)";
      gCtx.lineWidth = 1;
      const step = 64;

      gCtx.beginPath();
      for (let x = 0; x <= w; x += step) {
        gCtx.moveTo(x, 0);
        gCtx.lineTo(x, h);
      }
      for (let y = 0; y <= h; y += step) {
        gCtx.moveTo(0, y);
        gCtx.lineTo(w, y);
      }
      gCtx.stroke();
    };

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = parent ? parent.clientHeight : window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      createGridCache(w, h);
    };

    resize();
    window.addEventListener("resize", resize);

    // Respect user reduced-motion preferences (render single static frame and exit)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (gridCanvas) ctx.drawImage(gridCanvas, 0, 0);
      return () => {
        window.removeEventListener("resize", resize);
      };
    }

    // Viewport Intersection Observer (pause RAF when scrolled away)
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry.isIntersecting;
        if (isVisible && !animationId) {
          animationId = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // Seismographic waveform simulator
    let t = 0;
    const waves: { x: number; y: number; radius: number; maxRadius: number; opacity: number }[] = [];

    const animate = () => {
      if (!isVisible) {
        animationId = 0;
        return;
      }

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // 1. Draw cached Observatory Grid
      if (gridCanvas) {
        ctx.drawImage(gridCanvas, 0, 0);
      }

      // 2. Subtle Seismograph line across the lower section
      const baselineY = h * 0.78;
      ctx.beginPath();
      ctx.strokeStyle = "rgba(87, 199, 217, 0.25)";
      ctx.lineWidth = 1.2;

      for (let x = 0; x < w; x += 3) {
        // Controlled harmonic seismic wave representation
        const noise =
          Math.sin((x * 0.01) + t * 0.02) * 4 +
          Math.sin((x * 0.03) - t * 0.04) * 2 +
          (Math.abs(Math.sin((x * 0.005) + t * 0.01)) > 0.85
            ? Math.sin((x * 0.08) + t * 0.1) * 14
            : 0);

        const y = baselineY + noise;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // 3. Occasional subtle concentric seismic pulse
      if (t % 240 === 0) {
        waves.push({
          x: w * 0.65,
          y: h * 0.45,
          radius: 10,
          maxRadius: Math.min(w, h) * 0.45,
          opacity: 0.2,
        });
      }

      for (let i = waves.length - 1; i >= 0; i--) {
        const wave = waves[i];
        wave.radius += 0.8;
        wave.opacity = 0.2 * (1 - wave.radius / wave.maxRadius);

        if (wave.opacity <= 0.005 || wave.radius >= wave.maxRadius) {
          waves.splice(i, 1);
        } else {
          ctx.beginPath();
          ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(214, 168, 79, ${wave.opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      t++;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationId);
      animationId = 0;
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Editorial vignette gradient - restrained, calm */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F14]/40 via-transparent to-[#0B0F14]" />
    </div>
  );
}
