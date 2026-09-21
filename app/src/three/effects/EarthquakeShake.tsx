"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

interface EarthquakeShakeProps {
  children: React.ReactNode;
}

/**
 * Parameter-driven seismic wave superposition.
 * Amplitude, frequency, and decay all scale proportionally
 * to the earthquake intensity value (derived from M/depth).
 *
 * Wave physics:
 * - P-Wave: High-freq (8-14 Hz) vertical compression, amp scales with intensity
 * - S-Wave: Mid-freq (2-4 Hz) horizontal shear, most destructive
 * - Surface (Rayleigh+Love): Low-freq (~1 Hz) elliptical ground roll
 */
export function EarthquakeShake({ children }: EarthquakeShakeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const {
    shakeIntensity,
    pWaveIntensity,
    sWaveIntensity,
    surfaceWaveRoll,
  } = useSimulationAnimations();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const anyActive = shakeIntensity > 0.005 || pWaveIntensity > 0.005 || sWaveIntensity > 0.005;

    if (anyActive) {
      const time = clock.getElapsedTime();

      // 1. P-Wave: vertical compression jolts
      // Frequency and amplitude both scale with intensity
      let pJoltY = 0;
      if (pWaveIntensity > 0.005) {
        const pFreq = 40 + pWaveIntensity * 35;
        const pAmp = 0.02 + pWaveIntensity * 0.22;
        const pt = time * pFreq;
        pJoltY = (Math.sin(pt) + 0.35 * Math.sin(pt * 2.1) + 0.15 * Math.sin(pt * 3.7)) * pAmp;
      }

      // 2. S-Wave: horizontal transverse shear
      let sDisplaceX = 0;
      let sDisplaceZ = 0;
      if (sWaveIntensity > 0.005) {
        const sFreq = 12 + sWaveIntensity * 14;
        const sAmp = 0.05 + sWaveIntensity * 0.55;
        const st = time * sFreq;
        sDisplaceX = (
          Math.sin(st) +
          0.4 * Math.sin(st * 1.7) +
          0.2 * Math.cos(st * 2.6) +
          0.12 * Math.sin(st * 3.3)
        ) * sAmp * 0.28;
        sDisplaceZ = (
          Math.cos(st * 1.1) +
          0.5 * Math.sin(st * 1.9) +
          0.3 * Math.cos(st * 2.4) +
          0.15 * Math.sin(st * 3.1)
        ) * sAmp * 0.24;
      }

      // 3. Surface waves: retrograde elliptical roll
      let rollAngleX = 0;
      let rollAngleZ = 0;
      let rollY = 0;
      if (surfaceWaveRoll > 0.005) {
        const rFreq = 4.5 + surfaceWaveRoll * 3;
        const rAmp = 0.01 + surfaceWaveRoll * 0.08;
        const rtime = time * rFreq;
        rollAngleX = Math.sin(rtime) * rAmp * 0.7;
        rollAngleZ = Math.cos(rtime * 0.95) * rAmp * 0.7;
        rollY = Math.sin(rtime * 2) * (0.02 + surfaceWaveRoll * 0.12);
      }

      // Superpose all wave components
      groupRef.current.position.x = sDisplaceX;
      groupRef.current.position.y = pJoltY + rollY;
      groupRef.current.position.z = sDisplaceZ;

      groupRef.current.rotation.x = rollAngleX;
      groupRef.current.rotation.z = rollAngleZ;
    } else {
      // Smooth exponential decay to zero
      const lerpRate = 0.06;
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, lerpRate);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, lerpRate);
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 0, lerpRate);

      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, lerpRate);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, lerpRate);
    }
  });

  return <group ref={groupRef}>{children}</group>;
}
