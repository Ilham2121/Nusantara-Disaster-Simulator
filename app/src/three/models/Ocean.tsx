"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

interface OceanProps {
  position?: [number, number, number];
  size?: [number, number];
  islandMode?: boolean; // If true, surrounds an island 360 degrees
}

export function Ocean({
  position = [0, -0.2, 14],
  size = [90, 60],
  islandMode = false,
}: OceanProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { isTsunamiDrawback, isTsunamiWave, tsunamiFlooding, isSeaAgitated } = useSimulationAnimations();

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size[0], size[1], 36, 36);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, [size]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const time = clock.getElapsedTime();
    const pos = meshRef.current.geometry.attributes.position;

    // Water level dynamics
    let targetY = position[1];
    let targetZ = position[2];

    if (isTsunamiDrawback) {
      // Water recedes drastically (sea drawback)
      targetY = position[1] - 1.8;
      targetZ = position[2] + 12; // Pulls away into the ocean
    } else if (isTsunamiWave) {
      // Inundation flooding surging onto shore
      targetY = position[1] + 1.2 * (tsunamiFlooding || 0.6);
      targetZ = position[2] - 8; // Surges inland
    }

    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.05);

    // Wave ripple vertex displacement
    const waveFreq = isSeaAgitated ? 4.0 : 1.5;
    const waveAmp = isSeaAgitated ? 0.4 : 0.15;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const ripple =
        Math.sin(x * 0.3 + time * waveFreq) * Math.cos(z * 0.3 + time * waveFreq * 0.8) * waveAmp;
      pos.setY(i, ripple);
    }
    pos.needsUpdate = true;
  });

  return (
    <group position={[position[0], 0, 0]}>
      {/* Main Ocean Surface */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        position={[0, position[1], position[2]]}
        receiveShadow
      >
        <meshStandardMaterial
          color={islandMode ? "#0c4a6e" : "#0284c7"} // Deep ocean or tropical coast
          roughness={0.15}
          metalness={0.8}
          transparent
          opacity={0.88}
          flatShading
        />
      </mesh>

      {/* Foam Line Along Shoreline */}
      {!islandMode && (
        <mesh position={[0, position[1] + 0.02, 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[size[0], 1.2]} />
          <meshBasicMaterial color="#e0f2fe" transparent opacity={0.65} />
        </mesh>
      )}
    </group>
  );
}
