"use client";

import { useEffect, useRef } from "react";

/**
 * Animated particles flowing along tectonic fault lines beneath the hero.
 * Particles trace visible paths representing geological energy flow,
 * converging at subduction zone intersections.
 * Optimized with IntersectionObserver and zero-regex rendering.
 */
export function TectonicParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect user motion preferences
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number = 0;
    let isVisible = true;

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent ? parent.clientWidth : window.innerWidth;
      canvas.height = parent ? parent.clientHeight : window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Pause RAF loop when scrolled out of viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) {
          animId = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      color: string;
    }

    const particles: Particle[] = [];
    const PARTICLE_COUNT = 180;
    const colors = [
      "rgb(217, 92, 92)",
      "rgb(232, 117, 74)",
      "rgb(214, 168, 79)",
    ];

    // Spawn particles along tectonic boundary paths
    const spawnPaths = [
      // Sumatra-Java trench (bottom left diagonal)
      (w: number, h: number) => ({
        x: Math.random() * w * 0.4,
        y: h * 0.6 + Math.random() * h * 0.3,
        vx: 0.15 + Math.random() * 0.2,
        vy: -0.05 + Math.random() * 0.1,
      }),
      // Eastern arc (bottom right)
      (w: number, h: number) => ({
        x: w * 0.5 + Math.random() * w * 0.4,
        y: h * 0.65 + Math.random() * h * 0.25,
        vx: 0.1 + Math.random() * 0.15,
        vy: -0.1 - Math.random() * 0.1,
      }),
      // Northern band (Sulawesi-Maluku)
      (w: number, h: number) => ({
        x: w * 0.55 + Math.random() * w * 0.3,
        y: h * 0.2 + Math.random() * h * 0.2,
        vx: 0.12 + Math.random() * 0.1,
        vy: 0.05 + Math.random() * 0.08,
      }),
    ];

    const spawn = () => {
      const w = canvas.width;
      const h = canvas.height;
      const pathFn = spawnPaths[Math.floor(Math.random() * spawnPaths.length)];
      const { x, y, vx, vy } = pathFn(w, h);
      const maxLife = 180 + Math.random() * 220;

      particles.push({
        x,
        y,
        vx,
        vy,
        life: 0,
        maxLife,
        size: 1 + Math.random() * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    };

    // Seed initial particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      spawn();
      const p = particles[particles.length - 1];
      p.life = Math.random() * p.maxLife * 0.8;
    }

    const animate = () => {
      if (!isVisible) {
        animId = 0;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (particles.length < PARTICLE_COUNT && Math.random() < 0.15) {
        spawn();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        p.vx += (Math.random() - 0.5) * 0.01;
        p.vy += (Math.random() - 0.5) * 0.01;

        const lifeRatio = p.life / p.maxLife;
        const alpha = lifeRatio < 0.15
          ? lifeRatio / 0.15
          : lifeRatio > 0.8
            ? (1 - lifeRatio) / 0.2
            : 1;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;

        // Particle trail (using ctx.globalAlpha instead of expensive regex)
        ctx.globalAlpha = alpha * 0.45;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Bright core
        ctx.globalAlpha = alpha * 0.8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Reset alpha for clean canvas state
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
      animId = 0;
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
