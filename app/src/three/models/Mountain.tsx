"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

interface MountainProps {
  position?: [number, number, number];
  height?: number;
  radiusBottom?: number;
  color?: string;
}

export function Mountain({
  position = [0, 0, -18],
  height = 24,
  radiusBottom = 22,
  color = "#332a26",
}: MountainProps) {
  const mountainRef = useRef<THREE.Mesh>(null);
  const ventRef = useRef<THREE.Mesh>(null);
  const { mountainRumble, lavaGlowIntensity, isExploding } = useSimulationAnimations();

  // Procedural stratovolcano cone geometry with crater depression
  const geometry = useMemo(() => {
    const radialSegments = 36;
    const heightSegments = 24;
    // Truncated cone (cylinder with top radius)
    const geo = new THREE.CylinderGeometry(
      2.8, // radiusTop (crater rim)
      radiusBottom,
      height,
      radialSegments,
      heightSegments,
      false
    );

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      // Add low-poly jaggedness and ridge channels
      const angle = Math.atan2(z, x);
      const dist = Math.sqrt(x * x + z * z);
      const ridgeNoise = Math.sin(angle * 6) * 0.8 + Math.cos(angle * 12) * 0.4;
      const heightFactor = (y + height / 2) / height;

      // Make slopes slightly concave (classic stratovolcano shape)
      const concavity = Math.pow(1 - heightFactor, 1.4);
      const modifiedDist = dist * (1 + ridgeNoise * 0.15 * concavity);

      pos.setX(i, (modifiedDist * x) / (dist || 1));
      pos.setZ(i, (modifiedDist * z) / (dist || 1));
    }

    geo.computeVertexNormals();
    return geo;
  }, [height, radiusBottom]);

  useFrame(({ clock }) => {
    // Mountain rumble vibration
    if (mountainRef.current) {
      if (mountainRumble > 0 || isExploding) {
        const t = clock.getElapsedTime() * 30;
        const amp = (mountainRumble * 0.08) + (isExploding ? 0.2 : 0);
        mountainRef.current.position.x = (position[0] ?? 0) + Math.sin(t) * amp;
        mountainRef.current.position.z = (position[2] ?? -18) + Math.cos(t * 1.1) * amp;
      } else {
        mountainRef.current.position.x = position[0] ?? 0;
        mountainRef.current.position.z = position[2] ?? -18;
      }
    }

    // Vent magma glow pulse
    if (ventRef.current) {
      const pulse = 1.0 + Math.sin(clock.getElapsedTime() * 4) * 0.3;
      const mat = ventRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = (0.5 + lavaGlowIntensity * 2.5 + (isExploding ? 4.0 : 0)) * pulse;
    }
  });

  return (
    <group position={[position[0], position[1], position[2]]}>
      {/* Mountain Body */}
      <mesh
        ref={mountainRef}
        geometry={geometry}
        position={[0, height / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={color}
          roughness={0.95}
          metalness={0.05}
          flatShading
        />
      </mesh>

      {/* Caldera / Crater Depression Basin */}
      <mesh position={[0, height - 0.2, 0]} receiveShadow>
        <cylinderGeometry args={[2.5, 1.2, 1.2, 24]} />
        <meshStandardMaterial color="#1a1412" roughness={1.0} />
      </mesh>

      {/* Active Magma Vent Pool */}
      <mesh
        ref={ventRef}
        position={[0, height - 0.6, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[1.5, 20]} />
        <meshStandardMaterial
          color="#ff4400"
          emissive="#ff3300"
          emissiveIntensity={1.2}
          roughness={0.2}
        />
      </mesh>

      {/* Volcanic Rock Outcrops & Dark Ash Slopes */}
      <mesh position={[4, 5, 8]} rotation={[0.4, 0.2, 0]}>
        <dodecahedronGeometry args={[2.8, 0]} />
        <meshStandardMaterial color="#26201e" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-5, 4, 7]} rotation={[-0.2, 0.5, 0.1]}>
        <dodecahedronGeometry args={[2.4, 0]} />
        <meshStandardMaterial color="#26201e" roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}
