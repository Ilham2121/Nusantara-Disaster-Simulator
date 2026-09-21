"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

interface BuildingProps {
  position: [number, number, number];
  size?: [number, number, number];
  color?: string;
  rotationY?: number;
  floors?: number;
  id?: string;
  isVulnerable?: boolean;
}

/**
 * Building with progressive damage states driven by buildingDamageState (0-1).
 * 0.0-0.2: Intact, sway only
 * 0.2-0.5: Hairline cracks appear, facade discolors
 * 0.5-0.7: Visible diagonal shear cracks, windows darken
 * 0.7-1.0: Permanent tilt, subsidence, partial collapse appearance
 */
export function Building({
  position,
  size = [4, 8, 4],
  color = "#334155",
  rotationY = 0,
  floors = 4,
  isVulnerable = false,
}: BuildingProps) {
  const groupRef = useRef<THREE.Group>(null);
  const crackRef = useRef<THREE.Group>(null);
  const crackUpperRef = useRef<THREE.Group>(null);
  const {
    shakeIntensity,
    sWaveIntensity,
    surfaceWaveRoll,
    buildingDamageState,
    ashCoverage,
  } = useSimulationAnimations();

  const [width, height, depth] = size;

  const windows = useMemo(() => {
    const list: { pos: [number, number, number]; size: [number, number] }[] = [];
    const windowH = 0.8;
    const windowW = 0.6;
    const floorHeight = height / floors;

    for (let f = 1; f < floors; f++) {
      const y = f * floorHeight - floorHeight / 2;
      const cols = Math.max(2, Math.floor(width / 1.2));
      for (let c = 0; c < cols; c++) {
        const x = -width / 2 + (width / (cols + 1)) * (c + 1);
        list.push({ pos: [x, y, depth / 2 + 0.02], size: [windowW, windowH] });
      }
      const sideCols = Math.max(1, Math.floor(depth / 1.5));
      for (let sc = 0; sc < sideCols; sc++) {
        const z = -depth / 2 + (depth / (sideCols + 1)) * (sc + 1);
        list.push({ pos: [width / 2 + 0.02, y, z], size: [windowW, windowH] });
      }
    }
    return list;
  }, [width, height, depth, floors]);

  // Vulnerability multiplier for structural response
  const vulnMul = isVulnerable ? 1.6 : 1.0;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const damage = buildingDamageState * vulnMul;
    const time = clock.getElapsedTime();

    if (shakeIntensity > 0.005 || sWaveIntensity > 0.005) {
      // Natural frequency inversely proportional to building height
      const freq = 8.0 + 16.0 / height;

      // Sway amplitude scales with S-wave intensity and damage state
      const shearBase = sWaveIntensity * 0.04 + surfaceWaveRoll * 0.05;
      const damageAmplification = 1 + damage * 0.8;
      const shearFactor = shearBase * vulnMul * damageAmplification;

      const swayZ = Math.sin(time * freq) * shearFactor;
      const swayX = Math.cos(time * freq * 0.85) * (shearFactor * 0.75);

      // Progressive permanent tilt based on damage state
      const permanentTiltZ = damage > 0.6 ? (damage - 0.6) * 0.28 : 0;
      const permanentTiltX = damage > 0.6 ? (damage - 0.6) * 0.12 : 0;

      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        swayZ + permanentTiltZ,
        0.15
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        swayX + permanentTiltX,
        0.15
      );

      // Progressive subsidence
      if (damage > 0.5) {
        const subsidence = (damage - 0.5) * 0.6;
        groupRef.current.position.y = THREE.MathUtils.lerp(
          groupRef.current.position.y,
          -subsidence,
          0.05
        );
      }
    } else {
      // Rest state: maintain permanent damage tilt
      const restTiltZ = damage > 0.6 ? (damage - 0.6) * 0.28 : 0;
      const restTiltX = damage > 0.6 ? (damage - 0.6) * 0.12 : 0;
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, restTiltZ, 0.04);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, restTiltX, 0.04);
    }

    // Crack visibility: progressive appearance based on damage
    if (crackRef.current) {
      crackRef.current.visible = damage > 0.25;
      // Scale crack width with damage
      crackRef.current.scale.set(
        Math.min(1.5, 0.5 + damage * 1.5),
        1 + damage,
        1
      );
    }
    if (crackUpperRef.current) {
      crackUpperRef.current.visible = damage > 0.5;
    }
  });

  // Facade color darkens progressively with damage and ash
  const facadeColor = useMemo(() => {
    const c = new THREE.Color(color);
    if (ashCoverage > 0.1) {
      c.lerp(new THREE.Color("#4b5563"), ashCoverage * 0.7);
    }
    return c;
  }, [color, ashCoverage]);

  // Window emissive dims with damage (broken windows go dark)
  const windowEmissive = buildingDamageState > 0.4 ? 0.05 : 0.2;

  return (
    <group position={[position[0], position[1], position[2]]} rotation={[0, rotationY, 0]}>
      <group ref={groupRef}>
        {/* Main Body */}
        <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial color={facadeColor} roughness={0.65} metalness={0.15} />
        </mesh>

        {/* Roof Parapet */}
        <mesh position={[0, height + 0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[width * 0.9, 0.6, depth * 0.9]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>

        {/* Rooftop Equipment */}
        <mesh position={[width * 0.2, height + 0.8, -depth * 0.15]} castShadow>
          <boxGeometry args={[0.8, 0.7, 1.2]} />
          <meshStandardMaterial color="#64748b" metalness={0.4} roughness={0.5} />
        </mesh>

        {/* Lower Floor Diagonal Shear Cracks */}
        <group ref={crackRef} visible={false} position={[0, height / floors, depth / 2 + 0.025]}>
          <mesh rotation={[0, 0, 0.6]}>
            <planeGeometry args={[width * 0.65, 0.08]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          <mesh rotation={[0, 0, -0.6]}>
            <planeGeometry args={[width * 0.65, 0.08]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
        </group>

        {/* Upper Floor Cracks (severe damage only) */}
        <group ref={crackUpperRef} visible={false} position={[0, height * 0.6, depth / 2 + 0.025]}>
          <mesh rotation={[0, 0, 0.4]}>
            <planeGeometry args={[width * 0.5, 0.06]} />
            <meshBasicMaterial color="#1e1b18" />
          </mesh>
          <mesh rotation={[0, 0, -0.5]}>
            <planeGeometry args={[width * 0.4, 0.06]} />
            <meshBasicMaterial color="#1e1b18" />
          </mesh>
        </group>

        {/* Windows */}
        {windows.map((w, idx) => (
          <mesh
            key={idx}
            position={w.pos}
            rotation={w.pos[0] > width / 2 ? [0, Math.PI / 2, 0] : [0, 0, 0]}
          >
            <planeGeometry args={[w.size[0], w.size[1]]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={windowEmissive}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        ))}

        {/* Foundation Base */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[width + 0.3, 0.2, depth + 0.3]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}
