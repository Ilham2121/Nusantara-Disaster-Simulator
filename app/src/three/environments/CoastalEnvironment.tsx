"use client";

import React from "react";
import { Ocean } from "../models/Ocean";
import { Boat } from "../models/Boat";
import { TraditionalHouse } from "../models/TraditionalHouse";
import { Tree } from "../models/Tree";
import { Road } from "../models/Road";
import { Vehicle } from "../models/Vehicle";
import { EarthquakeShake } from "../effects/EarthquakeShake";
import { TsunamiWave } from "../effects/TsunamiWave";
import { DustParticles } from "../effects/DustParticles";
import { CrackEffect } from "../effects/CrackEffect";
import { GroundLiquefaction } from "../effects/GroundLiquefaction";
import { GroundWaveRipple } from "../effects/GroundWaveRipple";

/**
 * Coastal Environment (Wilayah Pesisir & Pantai Nelayan)
 * Features an open ocean bay, wooden jetty pier, outrigger fishing boats,
 * traditional coastal stilt houses, sandy beach, coconut palms,
 * and realistic tsunami dynamics (drawback & surge wave).
 */
export function CoastalEnvironment() {
  return (
    <EarthquakeShake>
      {/* 1. Deep Ocean & Coastal Bay (Expanded 96x44) */}
      <Ocean position={[0, 0, -24]} size={[96, 44]} />

      {/* Seabed under water (prevent empty void when water recedes during drawback) */}
      <mesh position={[0, -1.8, -24]} receiveShadow>
        <boxGeometry args={[96, 1.5, 44]} />
        <meshStandardMaterial color="#ca8a04" roughness={0.9} />
      </mesh>

      {/* 2. Sandy Beach Slope (Pantai Pasir) */}
      <mesh position={[0, -0.1, -2]} receiveShadow>
        <boxGeometry args={[96, 0.5, 10]} />
        <meshStandardMaterial color="#eab308" roughness={0.9} />
      </mesh>

      {/* 3. Coastal Village Land Plateau (Expanded 96x36) */}
      <mesh position={[0, 0, 21]} receiveShadow>
        <boxGeometry args={[96, 0.6, 36]} />
        <meshStandardMaterial color="#65a30d" roughness={0.95} />
      </mesh>

      {/* Radial Ground Wave Propagation on Land */}
      <GroundWaveRipple size={90} resolution={64} />

      {/* Coastal Road */}
      <Road position={[0, 0.32, 12]} length={92} width={5} />

      {/* Ground Crack from undersea quake fault slip */}
      <CrackEffect position={[4, 0.35, 14]} length={36} />

      {/* 4. Traditional Wooden Fishing Pier / Jetty (Dermaga Kayu Nelayan) */}
      <group position={[-2, 0.25, -5]}>
        {/* Pier Deck */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[3, 0.2, 10]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        {/* Wooden Piling Stilts */}
        {[-3.5, -0.5, 2.5].map((z, i) => (
          <React.Fragment key={i}>
            <mesh position={[-1.2, -0.6, z]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 1.4, 6]} />
              <meshStandardMaterial color="#451a03" roughness={0.9} />
            </mesh>
            <mesh position={[1.2, -0.6, z]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 1.4, 6]} />
              <meshStandardMaterial color="#451a03" roughness={0.9} />
            </mesh>
          </React.Fragment>
        ))}
      </group>

      {/* 5. Traditional Indonesian Outrigger Boats (Perahu Cadik Nelayan) */}
      <Boat position={[-3.5, 0, -8]} rotationY={0.4} scale={0.9} hullColor="#0284c7" />
      <Boat position={[7, 0, -11]} rotationY={-0.6} scale={1.0} hullColor="#ea580c" />
      <Boat position={[-14, 0, -14]} rotationY={0.2} scale={1.1} hullColor="#16a34a" />
      <Boat position={[16, 0, -7]} rotationY={-0.2} scale={0.85} hullColor="#dc2626" />
      <Boat position={[-24, 0, -18]} rotationY={0.5} scale={1.0} hullColor="#0284c7" />
      <Boat position={[26, 0, -14]} rotationY={-0.4} scale={0.95} hullColor="#eab308" />
      <Boat position={[0, 0, -19]} rotationY={0.1} scale={1.05} hullColor="#16a34a" />

      {/* 6. Traditional Coastal Stilt Houses (Rumah Panggung Pesisir) */}
      <TraditionalHouse position={[-24, 0.3, 5]} rotationY={0.15} scale={0.95} isCoastal={true} />
      <TraditionalHouse position={[-16, 0.3, 5]} rotationY={-0.1} scale={0.95} isCoastal={true} />
      <TraditionalHouse position={[-9, 0.3, 4]} rotationY={0.1} scale={1.0} isCoastal={true} />
      <TraditionalHouse position={[5, 0.3, 4]} rotationY={-0.2} scale={1.05} isCoastal={true} />
      <TraditionalHouse position={[13, 0.3, 5]} rotationY={0.15} scale={1.0} isCoastal={true} />
      <TraditionalHouse position={[20, 0.3, 4]} rotationY={-0.1} scale={0.9} isCoastal={true} />
      <TraditionalHouse position={[28, 0.3, 5]} rotationY={0.2} scale={1.0} isCoastal={true} />

      {/* Inset residential row behind road */}
      <TraditionalHouse position={[-18, 0.3, 20]} rotationY={Math.PI} scale={0.95} isCoastal={true} />
      <TraditionalHouse position={[-8, 0.3, 20]} rotationY={Math.PI} scale={1.0} isCoastal={true} />
      <TraditionalHouse position={[0, 0.3, 22]} rotationY={Math.PI} scale={1.05} isCoastal={true} />
      <TraditionalHouse position={[8, 0.3, 20]} rotationY={Math.PI} scale={1.0} isCoastal={true} />
      <TraditionalHouse position={[18, 0.3, 20]} rotationY={Math.PI} scale={0.95} isCoastal={true} />

      {/* 7. Coastal Vegetation (Palms & Coastal Shrubs) */}
      <Tree position={[-5, 0.3, 2]} scale={1.2} type="pine" />
      <Tree position={[-12, 0.3, 1]} scale={1.3} type="pine" />
      <Tree position={[-22, 0.3, 2]} scale={1.2} type="pine" />
      <Tree position={[2, 0.3, 1.5]} scale={1.1} type="pine" />
      <Tree position={[10, 0.3, 2]} scale={1.3} type="pine" />
      <Tree position={[17, 0.3, 1]} scale={1.2} type="pine" />
      <Tree position={[26, 0.3, 2]} scale={1.1} type="pine" />
      <Tree position={[-20, 0.3, 8]} scale={1.0} type="round" />
      <Tree position={[22, 0.3, 8]} scale={1.1} type="round" />

      {/* 8. Coastal Vehicles on Road */}
      <Vehicle position={[-18, 0.32, 12]} rotationY={Math.PI / 2} color="#dc2626" type="sedan" />
      <Vehicle position={[-4, 0.32, 12]} rotationY={Math.PI / 2} color="#0284c7" type="truck" />
      <Vehicle position={[12, 0.32, 12]} rotationY={-Math.PI / 2} color="#ea580c" type="sedan" />
      <Vehicle position={[24, 0.32, 12]} rotationY={-Math.PI / 2} color="#ffffff" type="ambulance" />

      {/* 9. Tsunami & Secondary Geological Effects */}
      <GroundLiquefaction position={[0, 0.35, 6]} />
      <TsunamiWave waveHeight={4.8} width={96} />
      <DustParticles count={500} areaSize={45} />
    </EarthquakeShake>
  );
}
