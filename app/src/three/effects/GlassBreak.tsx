"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

interface GlassBreakProps {
  count?: number;
}

export function GlassBreak({ count = 250 }: GlassBreakProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { isGlassBreaking, glassBreakDensity } = useSimulationAnimations();

  // Shard points exploding from window positions
  const [positions, velocities, initialPos] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const init = new Float32Array(count * 3);

    const origins = [
      [-5, 7, -3],
      [6, 8, -2],
      [-5, 4, -3],
      [6, 5, -2],
    ];

    for (let i = 0; i < count; i++) {
      const orig = origins[i % origins.length];
      const ox = orig[0] + (Math.random() - 0.5) * 1.5;
      const oy = orig[1] + (Math.random() - 0.5) * 2.0;
      const oz = orig[2] + 2.0; // Outward from building front

      pos[i * 3] = ox;
      pos[i * 3 + 1] = oy;
      pos[i * 3 + 2] = oz;

      init[i * 3] = ox;
      init[i * 3 + 1] = oy;
      init[i * 3 + 2] = oz;

      // Burst outward with gravity
      vel[i * 3] = (Math.random() - 0.5) * 4.0;
      vel[i * 3 + 1] = 1.0 + Math.random() * 2.5;
      vel[i * 3 + 2] = 2.0 + Math.random() * 3.5;
    }

    return [pos, vel, init];
  }, [count]);

  const burstTime = useRef<number>(0);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const mat = pointsRef.current.material as THREE.PointsMaterial;

    if (isGlassBreaking && glassBreakDensity > 0.01) {
      burstTime.current += delta;
      // Opacity and particle lifespan scale with break density
      mat.opacity = Math.max(0, (0.5 + glassBreakDensity * 0.5) - burstTime.current * 0.35);

      // Only animate a fraction of shards at low density
      const activeCount = Math.floor(count * Math.min(1, glassBreakDensity * 1.8));
      const velScale = 0.4 + glassBreakDensity * 0.8;

      for (let i = 0; i < activeCount; i++) {
        const vy = velocities[i * 3 + 1] * velScale - 9.8 * burstTime.current;
        const curY = Math.max(0.05, posAttr.getY(i) + vy * delta);
        const curX = posAttr.getX(i) + velocities[i * 3] * delta * velScale;
        const curZ = posAttr.getZ(i) + velocities[i * 3 + 2] * delta * velScale;

        posAttr.setXYZ(i, curX, curY, curZ);
      }
      posAttr.needsUpdate = true;
    } else {
      burstTime.current = 0;
      mat.opacity = 0;
      for (let i = 0; i < count; i++) {
        posAttr.setXYZ(i, initialPos[i * 3], initialPos[i * 3 + 1], initialPos[i * 3 + 2]);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.25}
        color="#7dd3fc" // Bright sparkling glass shard
        transparent
        opacity={0}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
