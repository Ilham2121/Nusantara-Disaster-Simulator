"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

interface GroundLiquefactionProps {
  position?: [number, number, number];
}

/**
 * Sand Boil & Ground Liquefaction Effect (Fenomena Likuefaksi & Semburan Pasir)
 * Simulates high pore-water pressure expelling muddy sand geysers
 * and creating localized surface subsidence/pooling.
 */
export function GroundLiquefaction({ position = [0, 0, 0] }: GroundLiquefactionProps) {
  const groupRef = useRef<THREE.Group>(null);
  const jetsRef = useRef<THREE.Points>(null);
  const { isLiquefactionActive, progress } = useSimulationAnimations();

  // Multiple sand boil volcano mounds on the ground
  const boilLocations = useMemo(
    () => [
      { x: -3.5, z: 2.0, scale: 1.1 },
      { x: 2.5, z: 3.5, scale: 1.3 },
      { x: -1.0, z: -1.5, scale: 0.9 },
      { x: 5.0, z: -2.0, scale: 1.0 },
    ],
    []
  );

  // Sand and water jet particles bubbling upward
  const count = 45;
  const particlesData = useMemo(() => {
    const p = [];
    for (let i = 0; i < count; i++) {
      const boil = boilLocations[i % boilLocations.length];
      p.push({
        boilX: boil.x,
        boilZ: boil.z,
        vx: (Math.random() - 0.5) * 0.8,
        vy: 1.5 + Math.random() * 2.5,
        vz: (Math.random() - 0.5) * 0.8,
        x: boil.x,
        y: 0.1,
        z: boil.z,
        life: Math.random(),
        maxLife: 0.8 + Math.random() * 0.6,
      });
    }
    return p;
  }, [boilLocations]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = particlesData[i].x;
      pos[i * 3 + 1] = particlesData[i].y;
      pos[i * 3 + 2] = particlesData[i].z;

      // Muddy silt & water color: mix of beige sand and grayish silt
      const isWater = i % 2 === 0;
      colors[i * 3] = isWater ? 0.45 : 0.76;
      colors[i * 3 + 1] = isWater ? 0.55 : 0.62;
      colors[i * 3 + 2] = isWater ? 0.60 : 0.40;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [particlesData]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (!isLiquefactionActive) {
      groupRef.current.visible = false;
      return;
    }

    groupRef.current.visible = true;

    // Animate upward spraying sand geysers
    if (jetsRef.current) {
      const posAttr = jetsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;
      const dt = Math.min(delta, 0.05);

      for (let i = 0; i < count; i++) {
        const p = particlesData[i];
        p.life += dt;

        if (p.life > p.maxLife) {
          p.life = 0;
          p.x = p.boilX;
          p.y = 0.1;
          p.z = p.boilZ;
          p.vy = 1.5 + Math.random() * 2.5;
        } else {
          p.vy -= 9.8 * dt; // gravity
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.z += p.vz * dt;
        }

        array[i * 3] = p.x;
        array[i * 3 + 1] = Math.max(0.05, p.y);
        array[i * 3 + 2] = p.z;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Muddy Sand Cones (Kawah Mini Sand Boil) */}
      {boilLocations.map((boil, idx) => (
        <group key={idx} position={[boil.x, 0.05, boil.z]} scale={boil.scale}>
          {/* Outer Mud Puddle Ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[1.4, 16]} />
            <meshStandardMaterial
              color="#57534e"
              roughness={0.2}
              metalness={0.1}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Sand Cone Mound */}
          <mesh position={[0, 0.12, 0]} receiveShadow castShadow>
            <coneGeometry args={[0.9, 0.25, 12]} />
            <meshStandardMaterial color="#a8a29e" roughness={0.9} />
          </mesh>

          {/* Vent Orifice with Boiled Slurry Pool */}
          <mesh position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.3, 10]} />
            <meshStandardMaterial color="#292524" roughness={0.1} />
          </mesh>
        </group>
      ))}

      {/* Upward Spraying Sand-Water Jet Particles */}
      <points ref={jetsRef} geometry={geometry}>
        <pointsMaterial size={0.18} vertexColors transparent opacity={0.85} />
      </points>
    </group>
  );
}
