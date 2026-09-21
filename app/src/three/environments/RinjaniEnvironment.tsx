"use client";

import React from "react";
import { Mountain } from "../models/Mountain";
import { CraterLake } from "../models/CraterLake";
import { Tree } from "../models/Tree";
import { AshCloud } from "../effects/AshCloud";
import { LavaFlow } from "../effects/LavaFlow";
import { VolcanicBombs } from "../effects/VolcanicBombs";
import { DustParticles } from "../effects/DustParticles";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

/**
 * Mount Rinjani Environment (Gunung Rinjani & Danau Segara Anak - Lombok)
 * Features the majestic volcanic caldera, vivid turquoise-blue Segara Anak lake,
 * active young Barujari cinder cone steaming in the center, and trekker campsite on the caldera rim.
 */
export function RinjaniEnvironment() {
  const { safeZoneHighlight } = useSimulationAnimations();

  return (
    <group>
      {/* 1. High Caldera Basin Base Floor */}
      <mesh position={[0, -0.4, 0]} receiveShadow>
        <boxGeometry args={[68, 0.8, 68]} />
        <meshStandardMaterial color="#292524" roughness={0.95} />
      </mesh>

      {/* 2. Outer Caldera Rim Mountain Walls (Dinding Kaldera Rinjani / Plawangan) */}
      <mesh position={[-20, 8, -20]} rotation={[0, 0.3, 0]} castShadow receiveShadow>
        <coneGeometry args={[18, 18, 6]} />
        <meshStandardMaterial color="#44403c" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[20, 9, -20]} rotation={[0, -0.4, 0]} castShadow receiveShadow>
        <coneGeometry args={[20, 20, 6]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-24, 6, 4]} rotation={[0, 0.8, 0]} castShadow receiveShadow>
        <coneGeometry args={[15, 14, 6]} />
        <meshStandardMaterial color="#52525b" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[24, 6, 8]} rotation={[0, -0.6, 0]} castShadow receiveShadow>
        <coneGeometry args={[16, 15, 6]} />
        <meshStandardMaterial color="#44403c" roughness={0.9} flatShading />
      </mesh>

      {/* 3. Danau Segara Anak (Turquoise Blue Caldera Lake) */}
      <CraterLake position={[-2, 0.05, -3]} radius={13} />

      {/* 4. Gunung Barujari (Active Baby Cone inside Segara Anak) */}
      <Mountain
        position={[3, 0.1, -4]}
        height={11}
        radiusBottom={7.5}
        color="#1c1917"
      />

      {/* 5. Volcanic Ash Column & Fumarole Steam from Barujari Cone */}
      <AshCloud craterPosition={[3, 10.6, -4]} count={600} />

      {/* Explosive Volcanic Bombs from Barujari Cone */}
      <VolcanicBombs position={[3, 10.6, -4]} count={25} spread={6} maxVelocity={12} gravity={-18} />

      {/* 6. Active Basaltic Lava Flow pouring from Barujari crater down into Segara Anak lake */}
      <LavaFlow
        craterTop={[3, 10.5, -4]}
        pathPoints={[
          [3.0, 10.5, -4.0],
          [2.4, 9.5, -3.8],
          [1.6, 6.2, -3.5],
          [0.7, 3.2, -3.2],
          [-0.1, 0.8, -3.0],
          [-0.9, 0.06, -2.8],
        ]}
        flowRadius={0.65}
        showSteam={true}
      />

      {/* 7. Plawangan Campsite on the South Caldera Rim (Z: 14 to 18) */}
      <group position={[0, 0.1, 15]}>
        {/* Flat campsite terrace */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[24, 0.2, 10]} />
          <meshStandardMaterial color="#57534e" roughness={0.9} />
        </mesh>

        {/* Low-poly Trekker Expedition Tents */}
        {[
          { x: -6, z: 0, color: "#f97316" }, // Orange dome tent
          { x: -3, z: 1, color: "#eab308" }, // Yellow dome tent
          { x: 3, z: -1, color: "#06b6d4" }, // Cyan dome tent
          { x: 6, z: 0.5, color: "#ef4444" }, // Red dome tent
        ].map((tent, i) => (
          <group key={i} position={[tent.x, 0.2, tent.z]}>
            <mesh castShadow>
              <coneGeometry args={[1.0, 1.1, 4]} />
              <meshStandardMaterial color={tent.color} roughness={0.6} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 8. Mountain Ridge Pines & Alpine Shrubs */}
      <Tree position={[-12, 0.2, 13]} scale={1.2} type="pine" />
      <Tree position={[-8, 0.2, 16]} scale={1.3} type="pine" />
      <Tree position={[9, 0.2, 14]} scale={1.1} type="pine" />
      <Tree position={[13, 0.2, 16]} scale={1.2} type="pine" />

      {/* 9. Caldera Safety Rim Perimeter */}
      {safeZoneHighlight && (
        <mesh position={[0, 0.25, 15]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[11, 12, 32]} />
          <meshBasicMaterial color="#22c55e" transparent opacity={0.5} />
        </mesh>
      )}

      {/* Sulfur particles and ash drifting */}
      <DustParticles count={350} areaSize={40} />
    </group>
  );
}
