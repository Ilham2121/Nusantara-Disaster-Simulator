"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

interface DustParticlesProps {
  count?: number;
  areaSize?: number;
}

export function DustParticles({ count = 600, areaSize = 30 }: DustParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { isDustActive, dustDensity } = useSimulationAnimations();

  // Create initial random particle positions & velocities
  const [positions, velocities, initialY] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const initY = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * areaSize;
      const y = Math.random() * 6; // Low to ground near buildings
      const z = (Math.random() - 0.5) * areaSize;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      initY[i] = y;

      vel[i * 3] = (Math.random() - 0.5) * 0.4;
      vel[i * 3 + 1] = 0.3 + Math.random() * 0.8; // Upward plume
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }

    return [pos, vel, initY];
  }, [count, areaSize]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const mat = pointsRef.current.material as THREE.PointsMaterial;

    if (isDustActive && dustDensity > 0.02) {
      // Opacity and particle size scale with dust density
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.25 + 0.45 * dustDensity, 0.08);
      mat.size = THREE.MathUtils.lerp(mat.size, 0.3 + dustDensity * 0.6, 0.05);

      // Velocity multiplier: denser dust moves faster and higher
      const speedFactor = 0.3 + dustDensity * 0.9;
      const maxHeight = 5 + dustDensity * 8;
      // Only animate a fraction of particles for low density
      const activeCount = Math.floor(count * Math.min(1, dustDensity * 1.5));

      for (let i = 0; i < activeCount; i++) {
        let y = posAttr.getY(i) + velocities[i * 3 + 1] * delta * speedFactor;
        let x = posAttr.getX(i) + velocities[i * 3] * delta * speedFactor;
        let z = posAttr.getZ(i) + velocities[i * 3 + 2] * delta * speedFactor;

        if (y > maxHeight) {
          y = 0.1 + Math.random() * 0.5;
          x = (Math.random() - 0.5) * areaSize;
          z = (Math.random() - 0.5) * areaSize;
        }

        posAttr.setXYZ(i, x, y, z);
      }
      posAttr.needsUpdate = true;
    } else {
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0, 0.08);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.65}
        color="#d1c4b2" // Earthy plaster dust tone
        transparent
        opacity={0}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
