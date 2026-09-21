"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

interface RiceFieldProps {
  position?: [number, number, number];
  rotationY?: number;
  scale?: number;
}

/**
 * Terraced Rice Field (Sawah Terasering Tradisional Indonesia)
 * Features stepped terraces (terasering), soil bunds (galengan), reflective shallow water,
 * and lush green seedling crops (tanaman padi).
 */
export function RiceField({
  position = [0, 0, 0],
  rotationY = 0,
  scale = 1,
}: RiceFieldProps) {
  const { shakeIntensity } = useSimulationAnimations();

  // Define 3 terrace tiers descending along Z
  const tiers = useMemo(() => [
    { z: -7, y: 0.8, width: 14, depth: 6, waterColor: "#10b981", mudColor: "#78350f" },
    { z: 0, y: 0.4, width: 15, depth: 6.5, waterColor: "#059669", mudColor: "#713f12" },
    { z: 7, y: 0.05, width: 16, depth: 7, waterColor: "#047857", mudColor: "#582806" },
  ], []);

  // Clustered rice plants within each tier
  const plantClusters = useMemo(() => {
    const plants: { x: number; z: number; tierIdx: number; scale: number; rot: number }[] = [];
    for (let t = 0; t < 3; t++) {
      const tier = tiers[t];
      for (let i = -5; i <= 5; i += 1.8) {
        for (let j = -2; j <= 2; j += 1.6) {
          plants.push({
            x: i + (Math.random() - 0.5) * 0.4,
            z: tier.z + j + (Math.random() - 0.5) * 0.4,
            tierIdx: t,
            scale: 0.7 + Math.random() * 0.4,
            rot: Math.random() * Math.PI,
          });
        }
      }
    }
    return plants;
  }, [tiers]);

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      {tiers.map((tier, idx) => (
        <group key={`tier-${idx}`} position={[0, tier.y, tier.z]}>
          {/* Mud Bund / Pematang Base */}
          <mesh position={[0, -0.2, 0]} receiveShadow>
            <boxGeometry args={[tier.width, 0.4, tier.depth]} />
            <meshStandardMaterial color={tier.mudColor} roughness={0.9} />
          </mesh>

          {/* Shallow Terrace Water Layer (Air Sawah Berkilau) */}
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[tier.width - 0.5, tier.depth - 0.5]} />
            <meshStandardMaterial
              color={tier.waterColor}
              roughness={0.15}
              metalness={0.1}
              transparent
              opacity={0.88}
            />
          </mesh>

          {/* Raised Soil Berms / Galengan border */}
          {/* North Berm */}
          <mesh position={[0, 0.1, -tier.depth / 2 + 0.15]} castShadow receiveShadow>
            <boxGeometry args={[tier.width, 0.25, 0.3]} />
            <meshStandardMaterial color="#451a03" roughness={0.95} />
          </mesh>
          {/* South Berm */}
          <mesh position={[0, 0.1, tier.depth / 2 - 0.15]} castShadow receiveShadow>
            <boxGeometry args={[tier.width, 0.25, 0.3]} />
            <meshStandardMaterial color="#451a03" roughness={0.95} />
          </mesh>
          {/* East Berm */}
          <mesh position={[tier.width / 2 - 0.15, 0.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.3, 0.25, tier.depth]} />
            <meshStandardMaterial color="#451a03" roughness={0.95} />
          </mesh>
          {/* West Berm */}
          <mesh position={[-tier.width / 2 + 0.15, 0.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.3, 0.25, tier.depth]} />
            <meshStandardMaterial color="#451a03" roughness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Rice Plant Tufts (Rumpun Padi Hijau) */}
      {plantClusters.map((p, idx) => (
        <group
          key={`plant-${idx}`}
          position={[p.x, tiers[p.tierIdx].y + 0.18, p.z]}
          rotation={[0, p.rot, 0]}
          scale={p.scale}
        >
          {/* 3 Crossed low-poly tuft blades */}
          <mesh castShadow>
            <coneGeometry args={[0.18, 0.35, 4]} />
            <meshStandardMaterial color="#84cc16" roughness={0.6} />
          </mesh>
          <mesh position={[0.08, -0.05, 0]} rotation={[0, 0, 0.2]}>
            <coneGeometry args={[0.12, 0.28, 4]} />
            <meshStandardMaterial color="#65a30d" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
