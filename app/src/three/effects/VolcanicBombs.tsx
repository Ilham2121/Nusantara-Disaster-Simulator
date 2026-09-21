"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

export interface VolcanicBombsProps {
  position?: [number, number, number];
  count?: number;
  spread?: number;
  maxVelocity?: number;
  gravity?: number;
}

interface BombParticle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  vRotX: number;
  vRotY: number;
  vRotZ: number;
  scale: number;
  life: number;
  maxLife: number;
}

/**
 * Ballistic Volcanic Bombs & Incandescent Tephra (Lontaran Bom Vulkanik & Piroklas Pijar)
 * Simulates jagged molten rock masses ejected from the active vent pool,
 * tracing glowing ballistic arcs across the sky before crashing into the flanks.
 */
export function VolcanicBombs({
  position = [0, 24.5, -18],
  count = 42,
  spread = 12.0,
  maxVelocity = 18.0,
  gravity = -22.0,
}: VolcanicBombsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const sparksRef = useRef<THREE.Points>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { isAnimActive, hasAnyAnim, progress, isExploding } = useSimulationAnimations();

  const isEjecting =
    isExploding ||
    hasAnyAnim("eruption_blast", "crater_explosion", "ash_column_rise", "pyroclastic_flow") ||
    progress > 0.18;

  // Initialize bomb physics data
  const bombs = useMemo<BombParticle[]>(() => {
    const list: BombParticle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const horizontalSpeed = 4.0 + Math.random() * (spread * 0.9);
      const verticalSpeed = 12.0 + Math.random() * maxVelocity;
      const lifeSpan = 1.6 + Math.random() * 2.2;

      list.push({
        x: position[0],
        y: position[1],
        z: position[2],
        vx: Math.cos(angle) * horizontalSpeed,
        vy: verticalSpeed,
        vz: Math.sin(angle) * horizontalSpeed,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        vRotX: (Math.random() - 0.5) * 6,
        vRotY: (Math.random() - 0.5) * 6,
        vRotZ: (Math.random() - 0.5) * 6,
        scale: 0.35 + Math.random() * 0.65,
        life: Math.random() * lifeSpan, // desynchronize ejection intervals
        maxLife: lifeSpan,
      });
    }
    return list;
  }, [count, maxVelocity, position, spread]);

  // Trailing sparks buffer
  const [sparkPositions, sparkColors] = useMemo(() => {
    const pos = new Float32Array(count * 3 * 2);
    const col = new Float32Array(count * 3 * 2);
    for (let i = 0; i < count * 2; i++) {
      pos[i * 3] = position[0];
      pos[i * 3 + 1] = position[1];
      pos[i * 3 + 2] = position[2];

      col[i * 3] = 1.0;
      col[i * 3 + 1] = Math.random() > 0.4 ? 0.6 : 0.2;
      col[i * 3 + 2] = 0.05;
    }
    return [pos, col];
  }, [count, position]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    if (!isEjecting) {
      meshRef.current.visible = false;
      if (sparksRef.current) sparksRef.current.visible = false;
      return;
    }

    meshRef.current.visible = true;
    if (sparksRef.current) sparksRef.current.visible = true;

    const dt = Math.min(delta, 0.06);
    const sparkPosAttr = sparksRef.current?.geometry.attributes.position;

    for (let i = 0; i < count; i++) {
      const b = bombs[i];
      b.life += dt;

      if (b.life >= b.maxLife) {
        // Reset bomb to vent launchpad with randomized burst
        b.life = 0;
        b.x = position[0] + (Math.random() - 0.5) * 1.8;
        b.y = position[1] + 0.2;
        b.z = position[2] + (Math.random() - 0.5) * 1.8;

        const angle = Math.random() * Math.PI * 2;
        const hSpeed = 4.5 + Math.random() * spread;
        const vSpeed = (12.0 + Math.random() * maxVelocity) * (isExploding ? 1.4 : 1.0);

        b.vx = Math.cos(angle) * hSpeed;
        b.vy = vSpeed;
        b.vz = Math.sin(angle) * hSpeed;
      } else {
        // Apply ballistic trajectory & angular rotation
        b.vy += gravity * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.z += b.vz * dt;

        b.rotX += b.vRotX * dt;
        b.rotY += b.vRotY * dt;
        b.rotZ += b.vRotZ * dt;
      }

      // Update instanced transform
      dummy.position.set(b.x, b.y, b.z);
      dummy.rotation.set(b.rotX, b.rotY, b.rotZ);

      // Sizing with slight shrink as bomb cools in flight
      const flightRatio = b.life / b.maxLife;
      const currentScale = b.scale * (1.1 - flightRatio * 0.25);
      dummy.scale.set(currentScale, currentScale, currentScale);
      dummy.updateMatrix();

      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Trailing sparks update
      if (sparkPosAttr) {
        const pIdx = i * 2;
        sparkPosAttr.setXYZ(pIdx, b.x, b.y, b.z);
        // trailing wake point slightly behind
        sparkPosAttr.setXYZ(
          pIdx + 1,
          b.x - b.vx * dt * 0.8,
          b.y - b.vy * dt * 0.8,
          b.z - b.vz * dt * 0.8
        );
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (sparkPosAttr) sparkPosAttr.needsUpdate = true;
  });

  return (
    <group>
      {/* Low-poly jagged volcanic bomb chunks */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, count]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color="#1c1917"
          emissive="#ff3700"
          emissiveIntensity={2.8}
          roughness={0.8}
          metalness={0.2}
          flatShading
        />
      </instancedMesh>

      {/* Trailing incandescent sparks & cinder tails */}
      <points ref={sparksRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[sparkPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[sparkColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.6}
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
