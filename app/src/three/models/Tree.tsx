"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

interface TreeProps {
  position: [number, number, number];
  scale?: number;
  type?: "pine" | "round";
}

export function Tree({ position, scale = 1, type = "round" }: TreeProps) {
  const foliageRef = useRef<THREE.Group>(null);
  const { shakeIntensity, ashCoverage, isAnimActive } = useSimulationAnimations();

  const isBurnt = isAnimActive("vegetation_burn") || isAnimActive("trees_damaged");

  // Foliage color transitions from vibrant green to scorched brown/ash
  const foliageColor = useMemo(() => {
    if (isBurnt) return "#3a2f26"; // Scorched dark brown
    if (ashCoverage > 0.4) {
      const c = new THREE.Color("#166534");
      c.lerp(new THREE.Color("#475569"), ashCoverage * 0.7);
      return c;
    }
    return "#15803d"; // Lush tropical foliage
  }, [isBurnt, ashCoverage]);

  useFrame(({ clock }) => {
    if (!foliageRef.current) return;

    if (shakeIntensity > 0.02) {
      const t = clock.getElapsedTime() * 14;
      foliageRef.current.rotation.z = Math.sin(t) * shakeIntensity * 0.08;
      foliageRef.current.rotation.x = Math.cos(t * 1.1) * shakeIntensity * 0.06;
    } else {
      // Gentle wind breeze
      const t = clock.getElapsedTime() * 1.5 + position[0];
      foliageRef.current.rotation.z = Math.sin(t) * 0.02;
    }
  });

  const trunkH = 1.2 * scale;
  const trunkR = 0.16 * scale;

  return (
    <group position={position}>
      {/* Tree Trunk */}
      <mesh position={[0, trunkH / 2, 0]} castShadow>
        <cylinderGeometry args={[trunkR * 0.8, trunkR, trunkH, 6]} />
        <meshStandardMaterial color="#5c3821" roughness={0.9} />
      </mesh>

      {/* Canopy / Foliage */}
      <group ref={foliageRef} position={[0, trunkH, 0]}>
        {type === "pine" ? (
          <>
            <mesh position={[0, 0.8 * scale, 0]} castShadow>
              <coneGeometry args={[1.1 * scale, 1.6 * scale, 6]} />
              <meshStandardMaterial color={foliageColor} roughness={0.8} flatShading />
            </mesh>
            <mesh position={[0, 1.8 * scale, 0]} castShadow>
              <coneGeometry args={[0.8 * scale, 1.4 * scale, 6]} />
              <meshStandardMaterial color={foliageColor} roughness={0.8} flatShading />
            </mesh>
          </>
        ) : (
          <>
            <mesh position={[0, 0.9 * scale, 0]} castShadow>
              <dodecahedronGeometry args={[1.1 * scale, 0]} />
              <meshStandardMaterial color={foliageColor} roughness={0.8} flatShading />
            </mesh>
            <mesh position={[0.3 * scale, 1.3 * scale, 0.2 * scale]} castShadow>
              <dodecahedronGeometry args={[0.7 * scale, 0]} />
              <meshStandardMaterial color={foliageColor} roughness={0.8} flatShading />
            </mesh>
          </>
        )}
      </group>
    </group>
  );
}
