"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";
import { useSimulationStore } from "@/stores/simulationStore";

export function SceneLighting() {
  const { skyDarkness, lavaGlowIntensity, isExploding } = useSimulationAnimations();
  const disasterType = useSimulationStore((s) => s.disasterType);

  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const lavaLightRef = useRef<THREE.PointLight>(null);
  const explosionLightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    // Dim sun during heavy ash sky
    if (dirLightRef.current) {
      const targetSunIntensity = disasterType === "eruption" ? Math.max(0.3, 1.8 * (1 - skyDarkness)) : 1.8;
      dirLightRef.current.intensity = THREE.MathUtils.lerp(
        dirLightRef.current.intensity,
        targetSunIntensity,
        0.05
      );
    }

    // Ambient light adapts to volcano or earthquake
    if (ambientLightRef.current) {
      const targetAmbient = disasterType === "eruption" ? Math.max(0.2, 0.7 * (1 - skyDarkness * 0.7)) : 0.7;
      ambientLightRef.current.intensity = THREE.MathUtils.lerp(
        ambientLightRef.current.intensity,
        targetAmbient,
        0.05
      );
    }

    // Lava light glow pulse
    if (lavaLightRef.current) {
      const targetLava = lavaGlowIntensity * 3.5;
      lavaLightRef.current.intensity = THREE.MathUtils.lerp(
        lavaLightRef.current.intensity,
        targetLava,
        0.1
      );
    }

    // Crater explosion light flash
    if (explosionLightRef.current) {
      const targetExplosion = isExploding ? 8.0 : 0.0;
      explosionLightRef.current.intensity = THREE.MathUtils.lerp(
        explosionLightRef.current.intensity,
        targetExplosion,
        0.2
      );
    }
  });

  const fogColor = disasterType === "eruption" && skyDarkness > 0.3 ? "#241d1a" : "#0d1117";
  const fogFar = disasterType === "eruption" && skyDarkness > 0.4 ? 55 : 90;

  return (
    <>
      <color attach="background" args={[fogColor]} />
      <fog attach="fog" args={[fogColor, 20, fogFar]} />

      {/* Main Directional Sun */}
      <directionalLight
        ref={dirLightRef}
        position={[25, 35, 20]}
        intensity={1.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={100}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0005}
      />

      {/* Fill Light / Ambient */}
      <ambientLight ref={ambientLightRef} intensity={0.7} color="#dbeafe" />

      {/* Sky / Ground hemisphere differentiation */}
      <hemisphereLight
        args={[
          disasterType === "eruption" && skyDarkness > 0.3 ? "#e85d2a" : "#60a5fa", // sky
          "#1a1e28", // ground
          0.6,
        ]}
      />

      {/* Crater & Lava Point Light for Eruption */}
      {disasterType === "eruption" && (
        <>
          <pointLight
            ref={lavaLightRef}
            position={[0, 14, 0]}
            color="#ff5500"
            intensity={0}
            distance={40}
            decay={2}
          />
          <pointLight
            ref={explosionLightRef}
            position={[0, 18, 0]}
            color="#ffaa33"
            intensity={0}
            distance={50}
            decay={1.8}
          />
        </>
      )}
    </>
  );
}
