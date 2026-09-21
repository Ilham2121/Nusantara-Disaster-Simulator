"use client";

import React from "react";
import { Mountain } from "../models/Mountain";
import { Ocean } from "../models/Ocean";
import { Boat } from "../models/Boat";
import { AshCloud } from "../effects/AshCloud";
import { LavaFlow } from "../effects/LavaFlow";
import { LavaFountain } from "../effects/LavaFountain";
import { VolcanicBombs } from "../effects/VolcanicBombs";
import { DustParticles } from "../effects/DustParticles";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

/**
 * Anak Krakatau Environment (Gunung Anak Krakatau - Selat Sunda)
 * Isolated oceanic volcanic island surrounded 360° by open sea,
 * black volcanic sand, Strombolian magma fountain, and phreatomagmatic steam.
 */
export function KrakatauEnvironment() {
  const { safeZoneHighlight } = useSimulationAnimations();

  return (
    <group>
      {/* 1. Surrounding 360° Open Ocean (Selat Sunda) */}
      <Ocean position={[0, 0, 0]} size={[80, 80]} />

      {/* Seabed under water */}
      <mesh position={[0, -2, 0]} receiveShadow>
        <boxGeometry args={[80, 1.8, 80]} />
        <meshStandardMaterial color="#1e293b" roughness={0.95} />
      </mesh>

      {/* 2. Black Volcanic Sand Island Base (Pulau Gunung Api) */}
      <mesh position={[0, 0.05, -5]} receiveShadow>
        <cylinderGeometry args={[22, 28, 0.6, 28]} />
        <meshStandardMaterial color="#1c1917" roughness={0.95} />
      </mesh>

      {/* 3. Steep Island Volcano Cone */}
      <Mountain
        position={[0, 0.1, -6]}
        height={21}
        radiusBottom={20}
        color="#292524"
      />

      {/* 4. Ash & Phreatomagmatic Steam Column from Crater */}
      <AshCloud craterPosition={[0, 20.6, -6]} count={850} />

      {/* 5. Strombolian Lava Fountain & Volcanic Bombs (Semburan Magma Pijar ke Udara & Laut) */}
      <LavaFountain position={[0, 20.5, -6]} intensity={1.1} />
      <VolcanicBombs position={[0, 20.6, -6]} count={45} spread={16} maxVelocity={19} />

      {/* 6. Molten Lava Flow cascading down the cone flank directly into Selat Sunda ocean */}
      <LavaFlow
        craterTop={[0, 20.5, -6]}
        pathPoints={[
          [0.0, 20.5, -6.0],
          [0.8, 19.5, -5.2],
          [1.8, 14.5, -3.2],
          [1.4, 9.0, -0.8],
          [2.2, 4.2, 2.0],
          [2.6, 0.6, 4.8],
          [2.4, -0.1, 7.5],
        ]}
        flowRadius={0.9}
        showSteam={true}
      />

      {/* 7. Vulcanology Monitoring & Coast Guard Patrol Boat at Safe Offshore Distance */}
      <Boat position={[18, 0, 18]} rotationY={-0.6} scale={1.2} hullColor="#f8fafc" />
      <Boat position={[-16, 0, 20]} rotationY={0.8} scale={1.0} hullColor="#0284c7" />

      {/* 8. Safe Marine Exclusion Zone Ring (Radius Bahaya 5 km) */}
      {safeZoneHighlight && (
        <mesh position={[0, 0.15, -6]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[26, 27.5, 48]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.5} />
        </mesh>
      )}

      {/* Volcanic Ash Fallout & Steam */}
      <DustParticles count={450} areaSize={50} />
    </group>
  );
}
