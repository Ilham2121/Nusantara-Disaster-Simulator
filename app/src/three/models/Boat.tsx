"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

interface BoatProps {
  position: [number, number, number];
  rotationY?: number;
  scale?: number;
  color?: string;
  hullColor?: string;
}

export function Boat({
  position,
  rotationY = 0,
  scale = 1,
  color = "#0284c7",
  hullColor,
}: BoatProps) {
  const actualColor = hullColor ?? color;
  const groupRef = useRef<THREE.Group>(null);
  const { isTsunamiDrawback, isTsunamiWave, tsunamiFlooding, isSeaAgitated } = useSimulationAnimations();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime() * 2.0;

    if (isTsunamiDrawback) {
      // Boat tilts on dry ground as water leaves
      groupRef.current.position.y = position[1] - 0.4;
      groupRef.current.rotation.z = 0.35; // Tilted on sand
    } else if (isTsunamiWave) {
      // Swept / carried high by tsunami surge
      const surgeY = position[1] + 1.8 * (tsunamiFlooding || 0.6);
      groupRef.current.position.y = surgeY;
      groupRef.current.position.z = position[2] - (tsunamiFlooding || 0.5) * 6; // Swept towards shore
      groupRef.current.rotation.z = Math.sin(time * 3) * 0.4;
      groupRef.current.rotation.x = Math.cos(time * 2.5) * 0.3;
    } else {
      // Normal ocean bobbing
      const bob = Math.sin(time + position[0]) * 0.08;
      const roll = Math.sin(time * 1.2) * (isSeaAgitated ? 0.18 : 0.06);
      groupRef.current.position.y = position[1] + bob;
      groupRef.current.rotation.z = roll;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]} ref={groupRef} scale={scale}>
      {/* Main Narrow Hull (Lambung Perahu) */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.8, 0.45, 3.2]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.6} />
      </mesh>

      {/* Hull Trim Stripe */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.82, 0.12, 3.22]} />
        <meshStandardMaterial color={actualColor} roughness={0.5} />
      </mesh>

      {/* Pointed Bow & Stern Caps */}
      <mesh position={[0, 0.3, 1.7]} rotation={[0.4, 0, 0]}>
        <coneGeometry args={[0.4, 0.6, 4]} />
        <meshStandardMaterial color={actualColor} />
      </mesh>
      <mesh position={[0, 0.3, -1.7]} rotation={[-0.4, 0, 0]}>
        <coneGeometry args={[0.4, 0.6, 4]} />
        <meshStandardMaterial color={actualColor} />
      </mesh>

      {/* Outrigger Beams (Katir / Cadik) */}
      <mesh position={[0, 0.45, 0.4]}>
        <cylinderGeometry args={[0.04, 0.04, 2.6, 6]} />
        <meshStandardMaterial color="#92400e" />
      </mesh>
      <mesh position={[0, 0.45, -0.4]}>
        <cylinderGeometry args={[0.04, 0.04, 2.6, 6]} />
        <meshStandardMaterial color="#92400e" />
      </mesh>

      {/* Outrigger Bamboo Floats (Pelampung Samping) */}
      <mesh position={[-1.3, 0.2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2.8, 8]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[1.3, 0.2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 2.8, 8]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
    </group>
  );
}
