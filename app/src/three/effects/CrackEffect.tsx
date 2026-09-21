"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

interface CrackEffectProps {
  position?: [number, number, number];
  length?: number;
}

/**
 * Surface Fault Fissure & Scarp Dislocation (Retakan Sesar Permukaan & Patahan Bertingkat)
 * Simulates opening of the fault rupture with differential vertical offset (fault scarp)
 * and jagged asphalt/ground dislocation.
 */
export function CrackEffect({
  position = [0, 0.05, 0],
  length = 24,
}: CrackEffectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftEdgeRef = useRef<THREE.Mesh>(null);
  const rightEdgeRef = useRef<THREE.Mesh>(null);
  const { isCrackActive, shakeIntensity, sWaveIntensity, surfaceWaveRoll } = useSimulationAnimations();

  useFrame(() => {
    if (!groupRef.current) return;
    // Fissure widens as shear wave and surface roll accumulate
    const targetScaleX = isCrackActive
      ? Math.min(1.4, 0.5 + (sWaveIntensity * 0.5 + surfaceWaveRoll * 0.4))
      : 0;

    groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScaleX, 0.08);
    groupRef.current.visible = groupRef.current.scale.x > 0.02;

    // Differential vertical fault scarp (one fault block uplifts / other drops)
    if (leftEdgeRef.current && rightEdgeRef.current) {
      const offset = isCrackActive ? Math.min(0.18, 0.05 + shakeIntensity * 0.15) : 0;
      leftEdgeRef.current.position.y = THREE.MathUtils.lerp(leftEdgeRef.current.position.y, offset, 0.05);
      rightEdgeRef.current.position.y = THREE.MathUtils.lerp(rightEdgeRef.current.position.y, -offset * 0.7, 0.05);
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[0, 1, 1]}>
      {/* Deep Ground Fissure Chasm */}
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[0.6, 0.8, length]} />
        <meshBasicMaterial color="#020305" />
      </mesh>

      {/* Raised Left Fault Block (Blok Sesar Naik) */}
      <mesh ref={leftEdgeRef} position={[-0.32, 0.02, 0]} receiveShadow>
        <boxGeometry args={[0.3, 0.12, length]} />
        <meshStandardMaterial color="#1e293b" roughness={0.95} />
      </mesh>

      {/* Dropped Right Fault Block (Blok Sesar Turun) */}
      <mesh ref={rightEdgeRef} position={[0.32, 0.0, 0]} receiveShadow>
        <boxGeometry args={[0.3, 0.08, length]} />
        <meshStandardMaterial color="#0f172a" roughness={0.95} />
      </mesh>
    </group>
  );
}
