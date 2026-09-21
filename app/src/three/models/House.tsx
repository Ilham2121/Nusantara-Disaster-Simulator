"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

interface HouseProps {
  position: [number, number, number];
  rotationY?: number;
  scale?: number;
  roofColor?: string;
  wallColor?: string;
}

/**
 * Residential house with progressive damage driven by buildingDamageState (0-1).
 * Roof tiles slide proportionally to tileSlideFactor, wall cracks scale with crackSeverity,
 * structural tilt and subsidence increase with damage state.
 */
export function House({
  position,
  rotationY = 0,
  scale = 1,
  roofColor = "#b45309",
  wallColor = "#f8fafc",
}: HouseProps) {
  const groupRef = useRef<THREE.Group>(null);
  const crackRef = useRef<THREE.Group>(null);
  const roofRef = useRef<THREE.Mesh>(null);
  const {
    ashCoverage,
    shakeIntensity,
    sWaveIntensity,
    surfaceWaveRoll,
    buildingDamageState,
    tileSlideFactor,
    crackSeverity,
  } = useSimulationAnimations();

  const roofGeometry = useMemo(() => {
    const geo = new THREE.ConeGeometry(2.3 * scale, 1.2 * scale, 4);
    geo.rotateY(Math.PI / 4);
    return geo;
  }, [scale]);

  const currentRoofColor = useMemo(() => {
    const c = new THREE.Color(roofColor);
    if (ashCoverage > 0.05) {
      c.lerp(new THREE.Color("#4b5563"), ashCoverage * 0.85);
    }
    return c;
  }, [roofColor, ashCoverage]);

  const wallW = 2.6 * scale;
  const wallH = 1.6 * scale;
  const wallD = 2.4 * scale;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const damage = buildingDamageState;
    const t = clock.getElapsedTime() * 16;

    if (shakeIntensity > 0.005 || sWaveIntensity > 0.005) {
      // Sway amplitude increases with damage (weakened structure)
      const damageAmplification = 1 + damage * 0.6;
      const rotZ = Math.sin(t) * (sWaveIntensity * 0.05 + surfaceWaveRoll * 0.04) * damageAmplification;
      const rotX = Math.cos(t * 0.9) * (sWaveIntensity * 0.04 + surfaceWaveRoll * 0.03) * damageAmplification;

      // Progressive permanent tilt
      const permTilt = damage > 0.5 ? (damage - 0.5) * 0.15 : 0;
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, rotZ + permTilt, 0.18);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, rotX, 0.18);

      // Subsidence at high damage
      if (damage > 0.6) {
        groupRef.current.position.y = THREE.MathUtils.lerp(
          groupRef.current.position.y,
          position[1] - (damage - 0.6) * 0.3,
          0.04
        );
      }
    } else {
      const restTilt = damage > 0.5 ? (damage - 0.5) * 0.15 : 0;
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, restTilt, 0.04);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.04);
    }

    // Crack visibility and scale based on crackSeverity
    if (crackRef.current) {
      crackRef.current.visible = crackSeverity > 0.05;
      crackRef.current.scale.set(
        0.4 + crackSeverity * 1.2,
        0.4 + crackSeverity * 1.2,
        1
      );
    }

    // Roof sagging proportional to damage
    if (roofRef.current && damage > 0.4) {
      const sagAngle = (damage - 0.4) * 0.15;
      roofRef.current.rotation.z = THREE.MathUtils.lerp(roofRef.current.rotation.z, sagAngle, 0.03);
      const sagY = wallH + (1.2 * scale) / 2 - (damage - 0.4) * 0.15 * scale;
      roofRef.current.position.y = THREE.MathUtils.lerp(roofRef.current.position.y, sagY, 0.03);
    }
  });

  // Number of sliding tiles proportional to tileSlideFactor
  const tilePositions = useMemo(() => [
    { x: -0.6 * scale, z: 0.8 * scale },
    { x: 0.3 * scale, z: 0.9 * scale },
    { x: -0.2 * scale, z: -0.8 * scale },
    { x: 0.5 * scale, z: -0.7 * scale },
    { x: -0.4 * scale, z: -0.6 * scale },
  ], [scale]);

  const activeTileCount = Math.floor(tilePositions.length * Math.min(1, tileSlideFactor * 2));

  return (
    <group position={position} rotation={[0, rotationY, 0]} ref={groupRef}>
      {/* Wall Structure */}
      <mesh position={[0, wallH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallW, wallH, wallD]} />
        <meshStandardMaterial
          color={ashCoverage > 0.3 ? "#94a3b8" : wallColor}
          roughness={0.8}
        />
      </mesh>

      {/* Wall Shear Cracks (scale with crackSeverity) */}
      <group ref={crackRef} visible={false} position={[-0.5 * scale, wallH * 0.5, wallD / 2 + 0.025]}>
        <mesh rotation={[0, 0, 0.7]}>
          <planeGeometry args={[0.9 * scale, 0.04 * scale]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0.8 * scale, 0, 0]} rotation={[0, 0, -0.65]}>
          <planeGeometry args={[0.7 * scale, 0.04 * scale]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
      </group>

      {/* Pitched Roof */}
      <mesh
        ref={roofRef}
        geometry={roofGeometry}
        position={[0, wallH + (1.2 * scale) / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={currentRoofColor} roughness={0.7} flatShading />
      </mesh>

      {/* Sliding Roof Tiles (count proportional to tileSlideFactor) */}
      {activeTileCount > 0 && tilePositions.slice(0, activeTileCount).map((tile, i) => {
        const slideY = -tileSlideFactor * 0.7 * scale;
        const slideZ = tile.z > 0 ? tileSlideFactor * 0.5 * scale : -tileSlideFactor * 0.5 * scale;
        return (
          <mesh
            key={i}
            position={[tile.x, wallH + (1.0 * scale) / 2 + slideY, tile.z + slideZ]}
            rotation={[0.6, 0.2, 0.4]}
            castShadow
          >
            <boxGeometry args={[0.32 * scale, 0.04 * scale, 0.32 * scale]} />
            <meshStandardMaterial color="#9a3412" roughness={0.9} />
          </mesh>
        );
      })}

      {/* Front Door */}
      <mesh position={[0, (0.9 * scale) / 2, wallD / 2 + 0.02]}>
        <planeGeometry args={[0.6 * scale, 0.9 * scale]} />
        <meshStandardMaterial color="#78350f" roughness={0.6} />
      </mesh>

      {/* Window */}
      <mesh position={[0.7 * scale, wallH * 0.55, wallD / 2 + 0.02]}>
        <planeGeometry args={[0.5 * scale, 0.5 * scale]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0369a1"
          emissiveIntensity={buildingDamageState > 0.4 ? 0.05 : 0.2}
          roughness={0.3}
        />
      </mesh>

      {/* Porch / Teras */}
      <mesh position={[0, 0.05, wallD / 2 + 0.3 * scale]} receiveShadow>
        <boxGeometry args={[wallW * 0.9, 0.1, 0.6 * scale]} />
        <meshStandardMaterial color="#64748b" roughness={0.9} />
      </mesh>
    </group>
  );
}
