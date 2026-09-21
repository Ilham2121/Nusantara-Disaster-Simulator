"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

interface RoadProps {
  position?: [number, number, number];
  length?: number;
  width?: number;
  rotation?: [number, number, number];
}

export function Road({
  position = [0, 0.02, 0],
  length = 50,
  width = 6,
  rotation = [0, 0, 0],
}: RoadProps) {
  const { ashCoverage, isCrackActive } = useSimulationAnimations();

  // Stripe dashes calculation
  const stripes = useMemo(() => {
    const list: number[] = [];
    const stripeSpacing = 3.5;
    for (let x = -length / 2 + 2; x < length / 2 - 2; x += stripeSpacing) {
      list.push(x);
    }
    return list;
  }, [length]);

  return (
    <group position={position} rotation={rotation}>
      {/* Asphalt Surface */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[length, width]} />
        <meshStandardMaterial
          color={ashCoverage > 0.4 ? "#383c44" : "#1e222b"}
          roughness={0.8}
        />
      </mesh>

      {/* Sidewalk Borders (Curbs) */}
      <mesh position={[0, 0.06, width / 2 + 0.4]} castShadow receiveShadow>
        <boxGeometry args={[length, 0.12, 0.8]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.06, -width / 2 - 0.4]} castShadow receiveShadow>
        <boxGeometry args={[length, 0.12, 0.8]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>

      {/* Road Center Dashes */}
      {stripes.map((x, idx) => (
        <mesh key={idx} position={[x, 0.01, 0]}>
          <planeGeometry args={[1.6, 0.25]} />
          <meshBasicMaterial
            color={ashCoverage > 0.4 ? "#64748b" : "#f1f5f9"}
            opacity={0.8}
            transparent
          />
        </mesh>
      ))}

      {/* Surface Crack Markings on Road when crack active */}
      {isCrackActive && (
        <group position={[3, 0.03, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0.3]}>
            <planeGeometry args={[0.3, width * 0.9]} />
            <meshBasicMaterial color="#080a0e" />
          </mesh>
        </group>
      )}
    </group>
  );
}
