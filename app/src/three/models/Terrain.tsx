"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

interface TerrainProps {
  type?: "urban" | "volcanic";
  size?: number;
}

export function Terrain({ type = "urban", size = 60 }: TerrainProps) {
  const { ashCoverage } = useSimulationAnimations();

  // Create subtle low-poly height variation
  const geometry = useMemo(() => {
    const segments = type === "volcanic" ? 40 : 20;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      if (type === "volcanic") {
        // High volcanic slopes to the north (z < 2), flat plains for village settlement to the south (z >= 2)
        if (z < 2) {
          const highlandDist = 2 - z;
          const slope = Math.min(6.5, Math.pow(highlandDist / 22, 1.3) * 5.5);
          const ridge = highlandDist > 4 ? Math.sin(x * 0.2) * Math.cos(z * 0.2) * 0.8 : 0;
          pos.setY(i, Math.max(0, slope + ridge));
        } else {
          // Foothills plain where settlement and evacuation routes are located
          pos.setY(i, 0);
        }
      } else {
        // Very subtle urban topography
        const mound = Math.sin(x * 0.08) * Math.cos(z * 0.08) * 0.2;
        pos.setY(i, mound);
      }
    }
    geo.computeVertexNormals();
    return geo;
  }, [type, size]);

  // Interpolate grass/rock color to ash gray as ash coverage increases
  const baseColor = type === "volcanic" ? "#2e3b2e" : "#1f3323";
  const ashColor = "#3d424b";
  const color = useMemo(() => {
    const c = new THREE.Color(baseColor);
    c.lerp(new THREE.Color(ashColor), ashCoverage);
    return c;
  }, [baseColor, ashCoverage]);

  return (
    <group>
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial
          color={color}
          roughness={0.9}
          metalness={0.1}
          flatShading
        />
      </mesh>

      {/* Subsurface foundation base for urban look */}
      {type === "urban" && (
        <mesh position={[0, -0.6, 0]} receiveShadow>
          <boxGeometry args={[size + 2, 1, size + 2]} />
          <meshStandardMaterial color="#12161f" roughness={1} />
        </mesh>
      )}
    </group>
  );
}
