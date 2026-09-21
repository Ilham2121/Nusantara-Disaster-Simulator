"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

export interface VolcanicLightningProps {
  craterPosition?: [number, number, number];
  columnHeight?: number;
}

/**
 * Volcanic Lightning (Petir Vulkanik / Dirty Thunderstorm)
 * Generates branching electrostatic discharge bolts crackling through the dense ash plume.
 */
export function VolcanicLightning({
  craterPosition = [0, 24.5, -18],
  columnHeight = 18.0,
}: VolcanicLightningProps) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const flashLightRef = useRef<THREE.PointLight>(null);
  const flashTimer = useRef<number>(0);
  const flashDuration = useRef<number>(0);
  const isFlashing = useRef<boolean>(false);

  const { isExploding, hasAnyAnim, ashDensity, progress } = useSimulationAnimations();

  const isStormActive =
    isExploding ||
    hasAnyAnim("eruption_blast", "ash_column_rise", "pyroclastic_flow") ||
    progress > 0.28;

  // Maximum segments for lightning bolt tree
  const maxSegments = 32;
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(maxSegments * 2 * 3);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [maxSegments]);

  // Helper to generate a procedural jagged bolt inside the ash column
  const generateBolt = (positions: Float32Array) => {
    const [cx, cy, cz] = craterPosition;
    // Bolt starts mid-to-upper ash plume
    const startY = cy + 4.0 + Math.random() * (columnHeight * 0.4);
    const startX = cx + (Math.random() - 0.5) * 4.0;
    const startZ = cz + (Math.random() - 0.5) * 4.0;

    let curX = startX;
    let curY = startY;
    let curZ = startZ;

    const steps = 14 + Math.floor(Math.random() * 12);
    let ptr = 0;

    for (let i = 0; i < steps; i++) {
      positions[ptr++] = curX;
      positions[ptr++] = curY;
      positions[ptr++] = curZ;

      // Jagged step downwards or diagonally
      const nextX = curX + (Math.random() - 0.5) * 1.8;
      const nextY = curY - (0.8 + Math.random() * 1.6);
      const nextZ = curZ + (Math.random() - 0.5) * 1.8;

      positions[ptr++] = nextX;
      positions[ptr++] = nextY;
      positions[ptr++] = nextZ;

      // Occasional fork branch
      if (Math.random() > 0.7 && ptr + 6 < positions.length) {
        positions[ptr++] = curX;
        positions[ptr++] = curY;
        positions[ptr++] = curZ;

        positions[ptr++] = curX + (Math.random() - 0.5) * 2.8;
        positions[ptr++] = curY - (0.6 + Math.random() * 1.2);
        positions[ptr++] = curZ + (Math.random() - 0.5) * 2.8;
      }

      curX = nextX;
      curY = nextY;
      curZ = nextZ;
    }

    // Zero out remainder
    while (ptr < positions.length) {
      positions[ptr++] = 0;
    }
  };

  useFrame((_, delta) => {
    if (!lineRef.current) return;

    if (!isStormActive) {
      lineRef.current.visible = false;
      if (flashLightRef.current) flashLightRef.current.intensity = 0;
      return;
    }

    flashTimer.current += delta;

    if (isFlashing.current) {
      flashDuration.current -= delta;
      if (flashDuration.current <= 0) {
        // Flash ends
        isFlashing.current = false;
        lineRef.current.visible = false;
        if (flashLightRef.current) flashLightRef.current.intensity = 0;
        // Schedule next flash interval (random 0.6s - 2.5s)
        flashTimer.current = -((0.6 + Math.random() * 1.8) / ((ashDensity || 0.5) * 1.5));
      }
    } else if (flashTimer.current > 0) {
      // Trigger new lightning flash
      isFlashing.current = true;
      flashDuration.current = 0.08 + Math.random() * 0.12; // brief flash duration
      flashTimer.current = 0;

      const posAttr = lineRef.current.geometry.attributes.position as THREE.BufferAttribute;
      generateBolt(posAttr.array as Float32Array);
      posAttr.needsUpdate = true;

      lineRef.current.visible = true;

      if (flashLightRef.current) {
        flashLightRef.current.position.set(
          craterPosition[0] + (Math.random() - 0.5) * 6,
          craterPosition[1] + 10 + Math.random() * 6,
          craterPosition[2] + (Math.random() - 0.5) * 6
        );
        flashLightRef.current.intensity = 4.5 + Math.random() * 3.5;
      }
    }
  });

  return (
    <group>
      <lineSegments ref={lineRef} geometry={geometry} visible={false}>
        <lineBasicMaterial
          color="#e9d5ff"
          linewidth={2}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Atmospheric Cloud Flash Illumination */}
      <pointLight
        ref={flashLightRef}
        color="#a855f7"
        intensity={0}
        distance={45}
        decay={2}
      />
    </group>
  );
}
