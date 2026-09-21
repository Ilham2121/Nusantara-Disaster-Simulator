"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

interface LandslideEffectProps {
  position?: [number, number, number];
}

/**
 * Hillside Landslide and Rockfall Effect (Tanah Longsor Perbukitan & Batu Berguling)
 * Simulates soil slope shearing, descending debris mass, tumbling boulders, and dust plumes.
 */
export function LandslideEffect({ position = [-12, 0, -10] }: LandslideEffectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bouldersRef = useRef<THREE.Group>(null);
  const dustRef = useRef<THREE.Points>(null);
  const { isLandslideActive, landslideProgress } = useSimulationAnimations();

  // Boulders with individual randomized initial offsets and rotation speeds
  const boulders = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      startX: (Math.random() - 0.5) * 4,
      startY: 4 + Math.random() * 3,
      startZ: -2 + Math.random() * 2,
      scale: 0.35 + Math.random() * 0.45,
      rollSpeedX: 3 + Math.random() * 4,
      rollSpeedY: 2 + Math.random() * 3,
      color: i % 2 === 0 ? "#57534e" : "#44403c",
    }));
  }, []);

  // Dust particles generated along the slide path
  const dustGeo = useMemo(() => {
    const count = 30;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = Math.random() * 2.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    if (!isLandslideActive && landslideProgress <= 0) {
      groupRef.current.visible = false;
      return;
    }

    groupRef.current.visible = true;

    // Slide mass descends and creeps forward
    if (bouldersRef.current) {
      bouldersRef.current.children.forEach((child, i) => {
        const b = boulders[i];
        if (!b) return;

        // Slide down the hill along Y and forward along Z
        const currentY = b.startY - landslideProgress * (b.startY - 0.3);
        const currentZ = b.startZ + landslideProgress * 7;
        const currentX = b.startX + Math.sin(landslideProgress * Math.PI) * 0.5;

        child.position.set(currentX, Math.max(0.2, currentY), currentZ);

        if (landslideProgress > 0 && landslideProgress < 1) {
          child.rotation.x += b.rollSpeedX * 0.05;
          child.rotation.y += b.rollSpeedY * 0.04;
        }
      });
    }

    // Swirl dust plume
    if (dustRef.current) {
      const t = clock.getElapsedTime() * 2;
      dustRef.current.rotation.y = t * 0.1;
      const mat = dustRef.current.material as THREE.PointsMaterial;
      if (mat) {
        mat.opacity = landslideProgress > 0 && landslideProgress < 0.95 ? 0.6 : 0;
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Sliding Soil Escarpment (Massa Tanah Longsor) */}
      <mesh
        position={[
          0,
          Math.max(0.5, 2.5 - landslideProgress * 2),
          landslideProgress * 3.5,
        ]}
        rotation={[-0.35, 0, 0]}
        castShadow
        receiveShadow
      >
        <coneGeometry args={[3.2, 2.8, 6]} />
        <meshStandardMaterial color="#78350f" roughness={0.95} flatShading />
      </mesh>

      {/* Tumbling Boulders Group */}
      <group ref={bouldersRef}>
        {boulders.map((b, i) => (
          <mesh key={i} position={[b.startX, b.startY, b.startZ]} castShadow receiveShadow>
            <dodecahedronGeometry args={[b.scale, 0]} />
            <meshStandardMaterial color={b.color} roughness={0.9} flatShading />
          </mesh>
        ))}
      </group>

      {/* Dust Clouds (Debu Tanah Longsor) */}
      <points ref={dustRef} geometry={dustGeo} position={[0, 0.5, landslideProgress * 4]}>
        <pointsMaterial
          size={0.6}
          color="#a16207"
          transparent
          opacity={0.6}
        />
      </points>
    </group>
  );
}
