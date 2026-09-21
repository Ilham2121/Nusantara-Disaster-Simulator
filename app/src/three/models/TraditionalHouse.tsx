"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

interface TraditionalHouseProps {
  position: [number, number, number];
  rotationY?: number;
  scale?: number;
  woodColor?: string;
  roofColor?: string;
  isCoastal?: boolean;
}

/**
 * Traditional Indonesian Stilt House (Rumah Panggung Kayu / Bambu)
 * Features wooden stilts, plank walls, thatch/wood curved pitched roof, front veranda & ladder stairs.
 * Interacts with earthquake shaking, soil liquefaction/tilt, and tsunami inundation.
 */
export function TraditionalHouse({
  position,
  rotationY = 0,
  scale = 1,
  woodColor = "#854d0e", // Warm teak / dark bamboo wood
  roofColor = "#713f12", // Thatch / ijuk / bamboo roof
  isCoastal = false,
}: TraditionalHouseProps) {
  const groupRef = useRef<THREE.Group>(null);
  const {
    shakeIntensity,
    sWaveIntensity,
    surfaceWaveRoll,
    isStructuralDamaged,
    tsunamiFlooding,
    isLiquefactionActive,
  } = useSimulationAnimations();

  // Roof geometry: peaked high-pitch Indonesian style (limasan / joglo-esque low-poly profile)
  const roofGeometry = useMemo(() => {
    // 4-sided pyramid with flared overhang
    const geo = new THREE.ConeGeometry(2.4 * scale, 1.4 * scale, 4);
    geo.rotateY(Math.PI / 4);
    return geo;
  }, [scale]);

  const stiltH = 0.8 * scale;
  const houseW = 2.4 * scale;
  const houseH = 1.4 * scale;
  const houseD = 2.2 * scale;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    // Vernacular timber joint flexibility: absorbs seismic energy through smooth harmonic swaying
    if (shakeIntensity > 0.01 || sWaveIntensity > 0.01) {
      const t = clock.getElapsedTime() * 12; // Natural flexible frequency (~2 Hz)
      // Elastic timber sway without brittle fracture
      groupRef.current.rotation.z = Math.sin(t) * (sWaveIntensity * 0.07 + surfaceWaveRoll * 0.05);
      groupRef.current.rotation.x = Math.cos(t * 0.85) * (sWaveIntensity * 0.05);
    } else {
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.08);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.08);
    }

    // Liquefaction settlement or earthquake differential tilt
    if (isLiquefactionActive) {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, position[1] - 0.18 * scale, 0.05);
      groupRef.current.rotation.z = 0.05;
    } else if (isStructuralDamaged) {
      groupRef.current.rotation.z = 0.04;
      groupRef.current.position.y = position[1] - 0.05 * scale;
    } else {
      groupRef.current.position.y = position[1];
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]} ref={groupRef}>
      {/* 4 Corner Wooden Stilts (Tiang Kolong Rumah) */}
      {[
        [-houseW / 2 + 0.15, -houseD / 2 + 0.15],
        [houseW / 2 - 0.15, -houseD / 2 + 0.15],
        [-houseW / 2 + 0.15, houseD / 2 - 0.15],
        [houseW / 2 - 0.15, houseD / 2 - 0.15],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, stiltH / 2, z]} castShadow receiveShadow>
          <cylinderGeometry args={[0.07 * scale, 0.09 * scale, stiltH, 6]} />
          <meshStandardMaterial color={woodColor} roughness={0.85} />
        </mesh>
      ))}

      {/* Main Floor Platform (Lantai Panggung Kayu) */}
      <mesh position={[0, stiltH + 0.05 * scale, 0]} castShadow receiveShadow>
        <boxGeometry args={[houseW + 0.2 * scale, 0.1 * scale, houseD + 0.4 * scale]} />
        <meshStandardMaterial color="#a16207" roughness={0.75} />
      </mesh>

      {/* Main Wooden Living Quarters */}
      <mesh position={[0, stiltH + 0.1 * scale + houseH / 2, -0.1 * scale]} castShadow receiveShadow>
        <boxGeometry args={[houseW, houseH, houseD]} />
        <meshStandardMaterial color={woodColor} roughness={0.8} />
      </mesh>

      {/* Raised Thatch Roof */}
      <mesh
        geometry={roofGeometry}
        position={[0, stiltH + 0.1 * scale + houseH + (1.4 * scale) / 2, -0.1 * scale]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={roofColor} roughness={0.9} flatShading />
      </mesh>

      {/* Front Veranda / Serambi Railing */}
      <mesh position={[0, stiltH + 0.35 * scale, houseD / 2 + 0.08 * scale]}>
        <boxGeometry args={[houseW * 0.9, 0.05 * scale, 0.04 * scale]} />
        <meshStandardMaterial color="#713f12" roughness={0.7} />
      </mesh>

      {/* Wooden Ladder / Tangga Kayu */}
      <group position={[houseW * 0.25, stiltH / 2, houseD / 2 + 0.25 * scale]} rotation={[-0.4, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.45 * scale, stiltH * 1.1, 0.06 * scale]} />
          <meshStandardMaterial color="#78350f" roughness={0.85} />
        </mesh>
      </group>

      {/* Window Aperture */}
      <mesh position={[-houseW * 0.25, stiltH + houseH * 0.55, houseD / 2 + 0.01 * scale]}>
        <planeGeometry args={[0.5 * scale, 0.5 * scale]} />
        <meshStandardMaterial color="#fed7aa" emissive="#ea580c" emissiveIntensity={0.15} roughness={0.5} />
      </mesh>

      {/* Door Opening */}
      <mesh position={[houseW * 0.25, stiltH + houseH * 0.45, houseD / 2 + 0.01 * scale]}>
        <planeGeometry args={[0.55 * scale, 0.85 * scale]} />
        <meshStandardMaterial color="#451a03" roughness={0.9} />
      </mesh>
    </group>
  );
}
