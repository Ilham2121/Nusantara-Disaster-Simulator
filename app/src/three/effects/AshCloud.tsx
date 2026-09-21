"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";
import { VolcanicLightning } from "./VolcanicLightning";

interface AshCloudProps {
  craterPosition?: [number, number, number];
  count?: number;
}

export function AshCloud({
  craterPosition = [0, 23.8, -18],
  count = 950,
}: AshCloudProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const blastRef = useRef<THREE.Mesh>(null);
  const puffsGroupRef = useRef<THREE.Group>(null);
  const blastScale = useRef<number>(0);

  const { ashColumnScale, ashColumnHeight, ashDensity, isAnimActive, isExploding } = useSimulationAnimations();

  const isSmoking = isAnimActive("smoke_increase") || isAnimActive("mountain_rumble");
  const isErupting =
    isAnimActive("ash_column_rise") ||
    isAnimActive("eruption_blast") ||
    isAnimActive("ash_particles") ||
    isAnimActive("ash_spread_settlement") ||
    ashColumnScale > 0.05;

  // Particle positions, velocities, and lifetimes
  const [positions, velocities, lifetimes, currentLife] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const life = new Float32Array(count);
    const cur = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const r = Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      pos[i * 3] = craterPosition[0] + r * Math.cos(theta);
      pos[i * 3 + 1] = craterPosition[1];
      pos[i * 3 + 2] = craterPosition[2] + r * Math.sin(theta);

      vel[i * 3] = (Math.random() - 0.5) * 1.8;
      vel[i * 3 + 1] = 6.0 + Math.random() * 9.0;
      vel[i * 3 + 2] = 0.5 + Math.random() * 2.2;

      life[i] = 2.5 + Math.random() * 3.5;
      cur[i] = Math.random() * life[i];
    }

    return [pos, vel, life, cur];
  }, [count, craterPosition]);

  useFrame((_, delta) => {
    // Shockwave expansion animation
    if (blastRef.current) {
      if (isExploding) {
        blastScale.current += delta * (12.0 + (ashDensity || 0.5) * 12.0);
        blastRef.current.scale.set(blastScale.current, blastScale.current, blastScale.current);
        const mat = blastRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, 0.9 - blastScale.current / 18);
        blastRef.current.visible = mat.opacity > 0.01;
      } else {
        blastScale.current = 0.1;
        blastRef.current.visible = false;
      }
    }

    if (!pointsRef.current) return;

    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const mat = pointsRef.current.material as THREE.PointsMaterial;

    if (isErupting) {
      const targetOpacity = 0.45 + (ashDensity || 0.5) * 0.45;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.08);
      mat.color.set("#2c2422"); // Dark dense volcanic ash
      mat.size = 1.8 + (ashDensity || 0.5) * 1.8;

      for (let i = 0; i < count; i++) {
        currentLife[i] += delta;

        if (currentLife[i] > lifetimes[i]) {
          currentLife[i] = 0;
          const r = Math.random() * 1.6;
          const theta = Math.random() * Math.PI * 2;
          posAttr.setXYZ(
            i,
            craterPosition[0] + r * Math.cos(theta),
            craterPosition[1],
            craterPosition[2] + r * Math.sin(theta)
          );
        } else {
          const progress = currentLife[i] / lifetimes[i];
          const heightFactor = 0.6 + (ashColumnHeight || 0.5) * 0.9;
          const speedMultiplier = Math.max(0.3, ashColumnScale * 1.2 * heightFactor);
          const curY = posAttr.getY(i) + velocities[i * 3 + 1] * delta * speedMultiplier;

          // Billowing umbrella cloud expansion scaled with ashDensity
          const maxSpread = 8 + (ashDensity || 0.5) * 10;
          const expansion = progress > 0.35 ? (progress - 0.35) * maxSpread : 1;
          const curX = posAttr.getX(i) + velocities[i * 3] * delta * expansion;
          const curZ = posAttr.getZ(i) + velocities[i * 3 + 2] * delta * expansion;

          posAttr.setXYZ(i, curX, curY, curZ);
        }
      }
      posAttr.needsUpdate = true;
    } else if (isSmoking) {
      // Gentle fumarole steam rising before main eruption
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.45, 0.05);
      mat.color.set("#94a3b8"); // Light sulfur steam
      mat.size = 1.6;

      for (let i = 0; i < count; i++) {
        currentLife[i] += delta;

        if (currentLife[i] > lifetimes[i] * 0.7) {
          currentLife[i] = 0;
          const r = Math.random() * 1.2;
          const theta = Math.random() * Math.PI * 2;
          posAttr.setXYZ(
            i,
            craterPosition[0] + r * Math.cos(theta),
            craterPosition[1],
            craterPosition[2] + r * Math.sin(theta)
          );
        } else {
          const curY = posAttr.getY(i) + 2.2 * delta;
          const curX = posAttr.getX(i) + (Math.sin(i) * 0.4) * delta;
          const curZ = posAttr.getZ(i) + (Math.cos(i) * 0.4) * delta;
          posAttr.setXYZ(i, curX, curY, curZ);
        }
      }
      posAttr.needsUpdate = true;
    } else {
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0, 0.1);
    }

    // Billowing volumetric cauliflower puffs animation
    if (puffsGroupRef.current) {
      if (isErupting) {
        puffsGroupRef.current.visible = true;
        const targetScale = Math.max(0.2, ashColumnScale * 1.15 * (1.0 + (ashDensity || 0.5) * 0.8));
        puffsGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale * 1.35, targetScale), 0.05);

        // Billow rotation
        puffsGroupRef.current.children.forEach((child, idx) => {
          child.rotation.y += (0.15 + idx * 0.04) * delta;
          child.rotation.x += (0.10 + idx * 0.03) * delta;
        });
      } else {
        puffsGroupRef.current.scale.lerp(new THREE.Vector3(0.01, 0.01, 0.01), 0.1);
        if (puffsGroupRef.current.scale.x < 0.05) {
          puffsGroupRef.current.visible = false;
        }
      }
    }
  });

  return (
    <group>
      {/* Explosive Shockwave Blast Ring */}
      <mesh
        ref={blastRef}
        position={[craterPosition[0], craterPosition[1] + 1, craterPosition[2]]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
      >
        <ringGeometry args={[0.5, 1.8, 32]} />
        <meshBasicMaterial
          color="#ffa033"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Volumetric Billowing Cauliflower Ash Clouds (Dense Convective Plinian Plume) */}
      <group
        ref={puffsGroupRef}
        position={[craterPosition[0], craterPosition[1] + 2.5, craterPosition[2]]}
        visible={false}
      >
        {/* Tier 1: Lower Vent Choke Cloud */}
        <mesh position={[0, 1.2, 0]} scale={[1.4, 1.2, 1.4]} castShadow>
          <dodecahedronGeometry args={[2.2, 1]} />
          <meshStandardMaterial color="#2d2624" roughness={0.95} flatShading />
        </mesh>
        {/* Tier 2: Rising Convective Mid-Column */}
        <mesh position={[-0.8, 4.5, 0.5]} scale={[1.8, 1.6, 1.7]} castShadow>
          <dodecahedronGeometry args={[2.8, 1]} />
          <meshStandardMaterial color="#261f1d" roughness={0.98} flatShading />
        </mesh>
        <mesh position={[0.9, 5.2, -0.6]} scale={[1.7, 1.5, 1.8]} castShadow>
          <dodecahedronGeometry args={[2.6, 1]} />
          <meshStandardMaterial color="#231c1a" roughness={0.98} flatShading />
        </mesh>
        {/* Tier 3: Mushroom Umbrella Top */}
        <mesh position={[0, 9.5, 0]} scale={[3.4, 1.6, 3.2]} castShadow>
          <dodecahedronGeometry args={[3.6, 1]} />
          <meshStandardMaterial color="#1a1412" roughness={1.0} flatShading />
        </mesh>
        <mesh position={[-1.8, 10.8, 1.2]} scale={[2.6, 1.4, 2.8]} castShadow>
          <dodecahedronGeometry args={[3.2, 1]} />
          <meshStandardMaterial color="#211b19" roughness={1.0} flatShading />
        </mesh>
        <mesh position={[1.9, 11.2, -1.0]} scale={[2.8, 1.5, 2.6]} castShadow>
          <dodecahedronGeometry args={[3.0, 1]} />
          <meshStandardMaterial color="#241d1b" roughness={1.0} flatShading />
        </mesh>
      </group>

      {/* Ash Column Particles (Fine Tephra & Lapilli Fallout) */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={2.8}
          color="#2c2422"
          transparent
          opacity={0}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Volcanic Lightning (Petir Vulkanik di dalam Kolom Abu) */}
      <VolcanicLightning craterPosition={craterPosition} columnHeight={18} />
    </group>
  );
}
