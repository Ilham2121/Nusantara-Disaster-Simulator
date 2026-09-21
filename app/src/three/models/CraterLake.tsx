"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CraterLakeProps {
  position?: [number, number, number];
  radius?: number;
}

/**
 * Caldera Crater Lake (Danau Segara Anak - Gunung Rinjani)
 * Distinctive crescent-shaped, vivid turquoise-blue volcanic lake nestled in the high caldera.
 */
export function CraterLake({
  position = [0, 0, 0],
  radius = 9,
}: CraterLakeProps) {
  const lakeMeshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!lakeMeshRef.current) return;
    const t = clock.getElapsedTime();
    // Subtle breathing geothermal ripple effect
    const mat = lakeMeshRef.current.material as THREE.MeshStandardMaterial;
    if (mat) {
      mat.opacity = 0.85 + Math.sin(t * 1.5) * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* Caldera Bed / Basal Rock Basin */}
      <mesh position={[0, -0.3, 0]} receiveShadow>
        <cylinderGeometry args={[radius * 1.05, radius * 0.9, 0.6, 24]} />
        <meshStandardMaterial color="#292524" roughness={0.95} />
      </mesh>

      {/* Turquoise Volcanic Lake Water Body */}
      <mesh
        ref={lakeMeshRef}
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[radius, 32]} />
        <meshStandardMaterial
          color="#06b6d4" // Turquoise Segara Anak cyan
          emissive="#0891b2"
          emissiveIntensity={0.15}
          roughness={0.12}
          metalness={0.2}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Sulfur & Mineral Shoreline Ring */}
      <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.92, radius * 1.02, 32]} />
        <meshStandardMaterial
          color="#ca8a04" // Yellowish sulfur / volcanic deposit rim
          roughness={0.9}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Surrounding Caldera Cliffs Low-Poly Rock Outcrops */}
      {Array.from({ length: 14 }).map((_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        // Leave a gap for the barujari side
        const dist = radius * (1.05 + ((i % 3) * 0.08));
        const x = Math.cos(angle) * dist;
        const z = Math.sin(angle) * dist;
        const height = 0.6 + ((i * 3) % 5) * 0.3;
        return (
          <mesh
            key={i}
            position={[x, height / 2, z]}
            rotation={[0, angle, 0]}
            castShadow
            receiveShadow
          >
            <dodecahedronGeometry args={[height * 0.7, 0]} />
            <meshStandardMaterial color="#44403c" roughness={0.9} flatShading />
          </mesh>
        );
      })}
    </group>
  );
}
