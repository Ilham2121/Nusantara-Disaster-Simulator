"use client";

import React from "react";
import { RiceField } from "../models/RiceField";
import { TraditionalHouse } from "../models/TraditionalHouse";
import { Tree } from "../models/Tree";
import { Road } from "../models/Road";
import { Vehicle } from "../models/Vehicle";
import { EarthquakeShake } from "../effects/EarthquakeShake";
import { LandslideEffect } from "../effects/LandslideEffect";
import { DustParticles } from "../effects/DustParticles";
import { CrackEffect } from "../effects/CrackEffect";

/**
 * Rural Environment (Wilayah Pedesaan Agraris & Perbukitan)
 * Features terraced stepped rice paddies (sawah terasering), hillside slope,
 * traditional wooden hamlet, village road, and hillside landslide / rockfall simulation.
 */
export function RuralEnvironment() {
  return (
    <EarthquakeShake>
      {/* 1. Base Rural Earth Terrain */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[60, 0.4, 60]} />
        <meshStandardMaterial color="#3f6212" roughness={0.95} />
      </mesh>

      {/* 2. Northwest Hill Ridge (Bukit Longsor) */}
      <mesh position={[-18, 3.5, -12]} rotation={[0, 0.4, 0]} castShadow receiveShadow>
        <coneGeometry args={[14, 8, 7]} />
        <meshStandardMaterial color="#4d7c0f" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-22, 2.5, -2]} rotation={[0, -0.2, 0]} castShadow receiveShadow>
        <coneGeometry args={[10, 6, 6]} />
        <meshStandardMaterial color="#365314" roughness={0.9} flatShading />
      </mesh>

      {/* 3. Northeast Backdrop Hill */}
      <mesh position={[18, 4.0, -18]} rotation={[0, 0.1, 0]} castShadow receiveShadow>
        <coneGeometry args={[15, 9, 7]} />
        <meshStandardMaterial color="#3f6212" roughness={0.9} flatShading />
      </mesh>

      {/* 4. Terraced Rice Paddies (Sawah Terasering) on the East Side */}
      <RiceField position={[8, 0, -4]} scale={1.0} />

      {/* 5. Village Road connecting the hamlet */}
      <Road position={[-2, 0.04, 6]} length={54} width={4.5} />

      {/* Ground Crack along the road from seismic displacement */}
      <CrackEffect position={[-3, 0.08, 6]} length={26} />

      {/* 6. Traditional Rural Hamlet (Pemukiman Rumah Panggung Kayu) */}
      <TraditionalHouse position={[-8, 0, 14]} rotationY={0} scale={1.05} />
      <TraditionalHouse position={[-15, 0, 13]} rotationY={0.2} scale={0.95} />
      <TraditionalHouse position={[-8, 0, -1]} rotationY={Math.PI} scale={1.0} />
      <TraditionalHouse position={[-14, 0, -2]} rotationY={Math.PI - 0.2} scale={0.9} />

      <TraditionalHouse position={[6, 0, 14]} rotationY={-0.1} scale={1.0} />
      <TraditionalHouse position={[13, 0, 13]} rotationY={0.1} scale={0.95} />

      {/* Small Village Pavilion / Pos Ronda */}
      <group position={[0, 0, 14]}>
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[2.5, 0.2, 2.5]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.3, 0]} castShadow>
          <coneGeometry args={[2.0, 1.2, 4]} />
          <meshStandardMaterial color="#a16207" roughness={0.9} flatShading />
        </mesh>
      </group>

      {/* 7. Village Vehicles */}
      <Vehicle position={[-2, 0.04, 6]} rotationY={Math.PI / 2} color="#059669" type="truck" />
      <Vehicle position={[-10, 0.04, 6]} rotationY={-Math.PI / 2} color="#d97706" type="sedan" />

      {/* 8. Lush Rural Foliage & Trees */}
      <Tree position={[-4, 0, 10]} scale={1.2} type="round" />
      <Tree position={[-18, 0, 8]} scale={1.3} type="round" />
      <Tree position={[-2, 0, 0]} scale={1.1} type="round" />
      <Tree position={[2, 0, 10]} scale={1.1} type="round" />
      <Tree position={[18, 0, 10]} scale={1.2} type="round" />
      <Tree position={[22, 0, -3]} scale={1.4} type="round" />
      <Tree position={[20, 0, -10]} scale={1.2} type="pine" />
      <Tree position={[-10, 1.5, -9]} scale={1.0} type="pine" />

      {/* 9. Hillside Landslide Disaster Effect */}
      <LandslideEffect position={[-16, 0, -9]} />

      {/* 10. Seismic Dust plume */}
      <DustParticles count={380} areaSize={32} />
    </EarthquakeShake>
  );
}
