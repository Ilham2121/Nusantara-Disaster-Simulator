"use client";

import React from "react";
import { Mountain } from "../models/Mountain";
import { Terrain } from "../models/Terrain";
import { House } from "../models/House";
import { Tree } from "../models/Tree";
import { Vehicle } from "../models/Vehicle";
import { AshCloud } from "../effects/AshCloud";
import { LavaFlow } from "../effects/LavaFlow";
import { PyroclasticFlow } from "../effects/PyroclasticFlow";
import { VolcanicBombs } from "../effects/VolcanicBombs";
import { DustParticles } from "../effects/DustParticles";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

export function VolcanicEnvironment() {
  const { safeZoneHighlight, evacuationIndicators } = useSimulationAnimations();

  return (
    <group>
      {/* Volcanic Ground Terrain with Flat Foothills (Expanded 70 -> 95) */}
      <Terrain type="volcanic" size={95} />

      {/* Stratovolcano Mountain (Gunung Merapi) */}
      <Mountain position={[0, 0, -18]} height={25} radiusBottom={24} />

      {/* Ash Cloud Column from Crater (Fumarole Steam in Phase 1, Plinian Ash in Phase 2+) */}
      <AshCloud craterPosition={[0, 24.5, -18]} count={950} />

      {/* Explosive Incandescent Volcanic Bombs (Lontaran Bom Vulkanik & Pijar Kawah) */}
      <VolcanicBombs position={[0, 24.5, -18]} count={45} spread={14} maxVelocity={18} />

      {/* Flowing Lava Channel with Advancing Molten Head directly from Crater Vent into Kali Gendol */}
      <LavaFlow
        craterTop={[0, 24.4, -18]}
        pathPoints={[
          [0.0, 24.4, -18.0],
          [0.4, 23.5, -17.2],
          [1.0, 18.5, -15.2],
          [1.8, 13.5, -12.5],
          [1.2, 8.5, -9.2],
          [2.2, 4.5, -5.8],
          [2.5, 1.8, -1.5],
          [2.2, 0.4, 2.5],
          [2.0, 0.2, 7.0],
        ]}
        flowRadius={0.9}
        showSteam={true}
      />

      {/* Fast Pyroclastic Density Current (Awan Panas Guguran) descending South-Southeast flank */}
      <PyroclasticFlow
        count={650}
        origin={[0, 24.5, -18]}
        destination={[2.0, 1.2, 5.0]}
      />

      {/* Valley River Bed / Lahar Path (Expanded length) */}
      <mesh position={[2.5, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0.08]} receiveShadow>
        <planeGeometry args={[6, 56]} />
        <meshStandardMaterial color="#2d2825" roughness={0.9} />
      </mesh>

      {/* Foothill Village Settlement (Kaki Gunung) */}
      <group position={[-8, 0, 8]}>
        {/* Village Courtyard Ground Foundation Pad */}
        <mesh position={[0, 0.02, 3.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[26, 16]} />
          <meshStandardMaterial color="#35302c" roughness={0.9} />
        </mesh>

        {/* Houses clearly elevated on top of foundation */}
        <House position={[0, 0.05, 0]} scale={1.05} roofColor="#b45309" wallColor="#f1f5f9" />
        <House position={[5, 0.05, 1]} scale={1.1} roofColor="#c2410c" wallColor="#e2e8f0" />
        <House position={[-5, 0.05, 1]} scale={0.95} roofColor="#9a3412" wallColor="#f8fafc" />
        <House position={[9, 0.05, 2]} scale={1.0} roofColor="#b45309" wallColor="#f1f5f9" />
        <House position={[-9, 0.05, 2]} scale={1.05} roofColor="#c2410c" wallColor="#e2e8f0" />
        <House position={[2, 0.05, 6]} scale={1.05} roofColor="#b45309" wallColor="#f1f5f9" />
        <House position={[-3, 0.05, 6.5]} scale={1.0} roofColor="#c2410c" wallColor="#e2e8f0" />
      </group>

      {/* Forest & Vegetation on Mountain Flanks */}
      {/* West Flank Trees */}
      <Tree position={[-14, 1.2, -4]} scale={1.4} type="pine" />
      <Tree position={[-12, 0.6, -1]} scale={1.2} type="pine" />
      <Tree position={[-18, 0.05, 1]} scale={1.2} type="pine" />
      <Tree position={[-16, 0.05, 3]} scale={1.3} type="round" />
      <Tree position={[-11, 0.05, 6]} scale={1.1} type="round" />
      <Tree position={[-6, 0.05, 14]} scale={1.2} type="round" />

      {/* East Flank Trees */}
      <Tree position={[14, 1.2, -4]} scale={1.3} type="pine" />
      <Tree position={[12, 0.6, -1]} scale={1.2} type="pine" />
      <Tree position={[18, 0.05, 1]} scale={1.2} type="pine" />
      <Tree position={[15, 0.05, 3]} scale={1.1} type="round" />
      <Tree position={[9, 0.05, 12]} scale={1.0} type="round" />

      {/* Village Road & Evacuation Transport */}
      <mesh position={[-8, 0.04, 14]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[42, 3.5]} />
        <meshStandardMaterial color="#333742" roughness={0.8} />
      </mesh>

      <Vehicle position={[-10, 0.06, 14]} rotationY={Math.PI / 2} color="#ffffff" type="ambulance" />
      <Vehicle position={[-4, 0.06, 14]} rotationY={Math.PI / 2} color="#2563eb" type="sedan" />

      {/* Evacuation Route Indicators & Safe Zone Highlight */}
      {evacuationIndicators && (
        <group position={[-8, 0.35, 14]}>
          {[-8, -2, 4, 10].map((x, i) => (
            <mesh key={i} position={[x, 0.1, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.5, 1.2, 3]} />
              <meshBasicMaterial color="#22c55e" />
            </mesh>
          ))}
        </group>
      )}

      {safeZoneHighlight && (
        <mesh position={[-8, 0.08, 18]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[7, 32]} />
          <meshBasicMaterial color="#22c55e" transparent opacity={0.35} />
        </mesh>
      )}

      {/* Drifting Volcanic Dust & Fallout */}
      <DustParticles count={500} areaSize={45} />
    </group>
  );
}
