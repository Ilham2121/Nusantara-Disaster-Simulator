"use client";

import React from "react";
import { Terrain } from "../models/Terrain";
import { Road } from "../models/Road";
import { Building } from "../models/Building";
import { House } from "../models/House";
import { Tree } from "../models/Tree";
import { Vehicle } from "../models/Vehicle";
import { EarthquakeShake } from "../effects/EarthquakeShake";
import { FallingObjects } from "../effects/FallingObjects";
import { DustParticles } from "../effects/DustParticles";
import { GlassBreak } from "../effects/GlassBreak";
import { CrackEffect } from "../effects/CrackEffect";
import { GroundWaveRipple } from "../effects/GroundWaveRipple";

export function UrbanEnvironment() {
  return (
    <EarthquakeShake>
      {/* Base Terrain (Expanded 60 -> 100) */}
      <Terrain type="urban" size={100} />

      {/* Radial Ground Wave Ripple Displaced Mesh */}
      <GroundWaveRipple size={95} resolution={64} />

      {/* Main Avenues / Roads (Expanded) */}
      <Road position={[0, 0.02, 0]} length={88} width={7} />
      <Road position={[0, 0.02, 0]} length={88} width={5} rotation={[0, Math.PI / 2, 0]} />

      {/* Surface Earthquake Fault Fissure */}
      <CrackEffect position={[2, 0.05, 0]} length={42} />

      {/* Commercial High & Mid-Rise Buildings */}
      {/* Northwest Quadrant */}
      <Building
        position={[-7, 0, -8]}
        size={[5, 14, 5]}
        floors={6}
        color="#334155"
        isVulnerable={true}
      />
      <Building
        position={[-14, 0, -7]}
        size={[4.5, 9, 4.5]}
        floors={4}
        color="#475569"
      />
      <Building
        position={[-8, 0, -16]}
        size={[6, 11, 4]}
        floors={5}
        color="#1e293b"
      />

      {/* Northeast Quadrant */}
      <Building
        position={[8, 0, -8]}
        size={[5.5, 16, 5]}
        floors={7}
        color="#27272a"
        isVulnerable={true}
      />
      <Building
        position={[15, 0, -8]}
        size={[4.5, 8, 4.5]}
        floors={3}
        color="#3f3f46"
      />
      <Building
        position={[9, 0, -16]}
        size={[5, 10, 5]}
        floors={4}
        color="#1e293b"
      />

      {/* Far Background Skyline (Deep City Scenery) */}
      <Building
        position={[-18, 0, -24]}
        size={[6, 20, 6]}
        floors={9}
        color="#1e293b"
      />
      <Building
        position={[-9, 0, -25]}
        size={[7, 24, 6]}
        floors={11}
        color="#0f172a"
        isVulnerable={true}
      />
      <Building
        position={[0, 0, -26]}
        size={[8, 22, 6]}
        floors={10}
        color="#1e293b"
      />
      <Building
        position={[11, 0, -25]}
        size={[6.5, 26, 6.5]}
        floors={12}
        color="#27272a"
        isVulnerable={true}
      />
      <Building
        position={[20, 0, -23]}
        size={[6, 18, 6]}
        floors={8}
        color="#334155"
      />

      {/* Far East & West Flanking Mid-Rises */}
      <Building
        position={[-23, 0, -8]}
        size={[5, 12, 5]}
        floors={5}
        color="#3f3f46"
      />
      <Building
        position={[23, 0, -8]}
        size={[5, 13, 5]}
        floors={6}
        color="#334155"
      />

      {/* Southeast Quadrant - Residential Houses & Low Rise */}
      <Building
        position={[10, 0, 8]}
        size={[5, 7, 5]}
        floors={3}
        color="#475569"
      />
      <House position={[6, 0, 16]} rotationY={0} scale={1.1} roofColor="#b45309" />
      <House position={[12, 0, 16]} rotationY={0} scale={1.0} roofColor="#9a3412" />
      <House position={[18, 0, 15]} rotationY={-0.2} scale={1.0} roofColor="#c2410c" />
      <House position={[24, 0, 16]} rotationY={0.1} scale={1.05} roofColor="#b45309" />
      <House position={[16, 0, 8]} rotationY={Math.PI / 2} scale={1.1} roofColor="#b45309" />
      <House position={[22, 0, 8]} rotationY={Math.PI / 2} scale={1.0} roofColor="#9a3412" />

      {/* Southwest Quadrant - Mixed Residential & Public Facilities */}
      <House position={[-8, 0, 8]} rotationY={0} scale={1.1} roofColor="#b45309" />
      <House position={[-14, 0, 8]} rotationY={0} scale={1.0} roofColor="#c2410c" />
      <House position={[-20, 0, 8]} rotationY={-0.1} scale={1.0} roofColor="#b45309" />
      <House position={[-8, 0, 16]} rotationY={0} scale={1.0} roofColor="#9a3412" />
      <House position={[-14, 0, 16]} rotationY={0} scale={1.1} roofColor="#b45309" />
      <House position={[-20, 0, 16]} rotationY={0.2} scale={0.95} roofColor="#c2410c" />

      {/* Outer South Residential Cluster */}
      <House position={[-6, 0, 24]} rotationY={Math.PI} scale={1.05} roofColor="#b45309" />
      <House position={[0, 0, 24]} rotationY={Math.PI} scale={1.1} roofColor="#9a3412" />
      <House position={[6, 0, 24]} rotationY={Math.PI} scale={1.0} roofColor="#c2410c" />
      <House position={[14, 0, 24]} rotationY={Math.PI} scale={1.0} roofColor="#b45309" />

      {/* Street Trees */}
      <Tree position={[-3, 0, -4.5]} scale={1.1} type="round" />
      <Tree position={[-3, 0, -11]} scale={1.0} type="round" />
      <Tree position={[-3, 0, -18]} scale={1.1} type="round" />
      <Tree position={[3, 0, -4.5]} scale={1.2} type="round" />
      <Tree position={[3, 0, -11]} scale={1.0} type="round" />
      <Tree position={[3, 0, -18]} scale={1.2} type="round" />
      <Tree position={[-4.5, 0, 3.5]} scale={1.0} type="round" />
      <Tree position={[-11, 0, 3.5]} scale={1.1} type="round" />
      <Tree position={[-18, 0, 3.5]} scale={1.2} type="round" />
      <Tree position={[4.5, 0, 3.5]} scale={1.1} type="round" />
      <Tree position={[11, 0, 3.5]} scale={1.2} type="round" />
      <Tree position={[18, 0, 3.5]} scale={1.0} type="round" />

      {/* City Vehicles */}
      <Vehicle position={[-8, 0, -1.6]} rotationY={Math.PI / 2} color="#2563eb" type="sedan" />
      <Vehicle position={[-20, 0, -1.6]} rotationY={Math.PI / 2} color="#475569" type="truck" />
      <Vehicle position={[6, 0, 1.6]} rotationY={-Math.PI / 2} color="#dc2626" type="sedan" />
      <Vehicle position={[18, 0, 1.6]} rotationY={-Math.PI / 2} color="#16a34a" type="sedan" />
      <Vehicle position={[1.6, 0, -7]} rotationY={0} color="#eab308" type="sedan" />
      <Vehicle position={[1.6, 0, -18]} rotationY={0} color="#0284c7" type="sedan" />
      <Vehicle position={[-1.6, 0, 8]} rotationY={Math.PI} color="#ffffff" type="ambulance" />
      <Vehicle position={[-1.6, 0, 20]} rotationY={Math.PI} color="#ef4444" type="sedan" />

      {/* Earthquake Effects in Urban Setting */}
      <FallingObjects />
      <DustParticles count={900} areaSize={50} />
      <GlassBreak count={350} />
    </EarthquakeShake>
  );
}
