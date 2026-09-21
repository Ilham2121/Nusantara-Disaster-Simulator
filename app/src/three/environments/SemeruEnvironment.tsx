"use client";

import React from "react";
import { Mountain } from "../models/Mountain";
import { Terrain } from "../models/Terrain";
import { House } from "../models/House";
import { Tree } from "../models/Tree";
import { Vehicle } from "../models/Vehicle";
import { AshCloud } from "../effects/AshCloud";
import { PyroclasticFlow } from "../effects/PyroclasticFlow";
import { LaharFlow } from "../effects/LaharFlow";
import { VolcanicBombs } from "../effects/VolcanicBombs";
import { DustParticles } from "../effects/DustParticles";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

/**
 * Mount Semeru Environment (Gunung Semeru / Mahameru - Jawa Timur)
 * Features towering Mahameru peak, active Jonggring Saloka crater,
 * Besuk Kobokan river canyon with cold lahar mudflows (lahar dingin),
 * and foothill settlement evacuation route.
 */
export function SemeruEnvironment() {
  const { safeZoneHighlight, evacuationIndicators } = useSimulationAnimations();

  return (
    <group>
      {/* 1. Volcanic Ash Terrain */}
      <Terrain type="volcanic" size={75} />

      {/* 2. Mahameru Peak (The Highest Stratovolcano in Java) */}
      <Mountain
        position={[0, 0, -20]}
        height={28}
        radiusBottom={25}
        color="#3f3f46"
      />

      {/* 3. Vulcanian Eruption Ash Column from Jonggring Saloka Crater */}
      <AshCloud craterPosition={[0, 27.5, -20]} count={1100} />

      {/* Explosive Incandescent Volcanic Bombs from Jonggring Saloka */}
      <VolcanicBombs position={[0, 27.5, -20]} count={50} spread={16} maxVelocity={20} />

      {/* 4. Pyroclastic Flow (Awan Panas Guguran) down southeastern slope */}
      <PyroclasticFlow
        count={700}
        origin={[0, 27.5, -20]}
        destination={[2.5, 1.2, 8.0]}
      />

      {/* 5. Besuk Kobokan River Canyon with Lahar Torrent originating from Mahameru upper chute */}
      <LaharFlow
        position={[0, 0, 0]}
        riverRadius={1.3}
        pathPoints={[
          [0.0, 25.0, -19.5],
          [0.8, 18.5, -16.8],
          [1.6, 12.0, -13.0],
          [2.2, 6.5, -8.5],
          [1.2, 3.2, -3.0],
          [2.0, 1.2, 3.0],
          [3.0, 0.4, 9.5],
          [3.8, 0.1, 16.5],
        ]}
      />

      {/* Besuk Kobokan Riverbed Cut Trench */}
      <mesh position={[2, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0.12]} receiveShadow>
        <planeGeometry args={[6, 44]} />
        <meshStandardMaterial color="#27272a" roughness={0.95} />
      </mesh>

      {/* 6. Curah Kobokan Foothill Settlement & Evacuation Zone */}
      <group position={[-11, 0, 8]}>
        {/* Elevated settlement terrace */}
        <mesh position={[0, 0.05, 3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[16, 12]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.9} />
        </mesh>

        <House position={[0, 0.1, 0]} scale={1.05} roofColor="#b45309" wallColor="#e2e8f0" />
        <House position={[4.5, 0.1, 1]} scale={1.0} roofColor="#9a3412" wallColor="#f8fafc" />
        <House position={[-4, 0.1, 1]} scale={0.95} roofColor="#c2410c" wallColor="#f1f5f9" />
        <House position={[1, 0.1, 5.5]} scale={1.0} roofColor="#b45309" wallColor="#e2e8f0" />
      </group>

      {/* 7. Cemara Gunung (Mountain Pines) along high ridges */}
      <Tree position={[-16, 1.4, -6]} scale={1.5} type="pine" />
      <Tree position={[-13, 0.8, -2]} scale={1.3} type="pine" />
      <Tree position={[-18, 0.1, 4]} scale={1.2} type="pine" />
      <Tree position={[15, 1.3, -5]} scale={1.4} type="pine" />
      <Tree position={[13, 0.7, -1]} scale={1.2} type="pine" />
      <Tree position={[17, 0.1, 4]} scale={1.1} type="pine" />

      {/* 8. Evacuation Road & Emergency Transport */}
      <mesh position={[-10, 0.06, 15]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[26, 3.5]} />
        <meshStandardMaterial color="#27272a" roughness={0.8} />
      </mesh>

      <Vehicle position={[-12, 0.08, 15]} rotationY={Math.PI / 2} color="#dc2626" type="truck" />
      <Vehicle position={[-6, 0.08, 15]} rotationY={Math.PI / 2} color="#ffffff" type="ambulance" />

      {/* Evacuation Route Indicators */}
      {evacuationIndicators && (
        <group position={[-10, 0.35, 15]}>
          {[-8, -2, 4, 10].map((x, i) => (
            <mesh key={i} position={[x, 0.1, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.5, 1.2, 3]} />
              <meshBasicMaterial color="#22c55e" />
            </mesh>
          ))}
        </group>
      )}

      {/* Safe Assembly Zone */}
      {safeZoneHighlight && (
        <mesh position={[-11, 0.1, 18]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[7, 32]} />
          <meshBasicMaterial color="#22c55e" transparent opacity={0.35} />
        </mesh>
      )}

      {/* Volcanic Ash Fallout */}
      <DustParticles count={600} areaSize={45} />
    </group>
  );
}
