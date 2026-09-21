"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

export interface PyroclasticFlowProps {
  count?: number;
  origin?: [number, number, number];
  destination?: [number, number, number];
}

export function PyroclasticFlow({
  count = 500,
  origin = [0, 24.5, -18],
  destination = [0, 1.5, 4],
}: PyroclasticFlowProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { isPyroclasticFlowing, pyroclasticProgress, ashDensity } = useSimulationAnimations();

  // Dense cloud points traveling rapidly down the flank
  const [positions, offsets] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const off = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const spreadX = (Math.random() - 0.5) * 6.0;
      const spreadY = Math.random() * 4.0;
      const spreadZ = (Math.random() - 0.5) * 8.0;

      off[i * 3] = spreadX;
      off[i * 3 + 1] = spreadY;
      off[i * 3 + 2] = spreadZ;

      pos[i * 3] = origin[0] + spreadX;
      pos[i * 3 + 1] = origin[1] + spreadY;
      pos[i * 3 + 2] = origin[2] + spreadZ;
    }

    return [pos, off];
  }, [count, origin]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const mat = pointsRef.current.material as THREE.PointsMaterial;

    if (isPyroclasticFlowing && pyroclasticProgress > 0) {
      const targetOpacity = 0.45 + (ashDensity || 0.5) * 0.45;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.1);
      mat.size = 2.2 + (ashDensity || 0.5) * 2.0;

      // Path moves from summit dome origin down to foothills destination
      const currentX = THREE.MathUtils.lerp(origin[0], destination[0], pyroclasticProgress);
      const currentY = THREE.MathUtils.lerp(origin[1], destination[1], pyroclasticProgress);
      const currentZ = THREE.MathUtils.lerp(origin[2], destination[2], pyroclasticProgress);

      const lateralExpansion = 1 + pyroclasticProgress * (1.2 + (ashDensity || 0.5) * 1.0);

      for (let i = 0; i < count; i++) {
        // Swirling motion
        const swirlX = Math.sin(delta * 5 + i) * (0.2 + (ashDensity || 0.5) * 0.3);
        const x = currentX + offsets[i * 3] * lateralExpansion + swirlX;
        const y = Math.max(0.4, currentY + offsets[i * 3 + 1]);
        const z = currentZ + offsets[i * 3 + 2];

        posAttr.setXYZ(i, x, y, z);
      }
      posAttr.needsUpdate = true;
    } else {
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0, 0.15);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={3.2}
        color="#54433a" // Superheated ash & gas mix
        transparent
        opacity={0}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
