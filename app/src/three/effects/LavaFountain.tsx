"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

interface LavaFountainProps {
  position?: [number, number, number];
  intensity?: number;
}

/**
 * Strombolian Lava Fountain (Semburan Magma Pijar - Anak Krakatau)
 * Simulates explosive incandescent lava blobs launched into the sky,
 * arcing and falling back into the caldera and surrounding sea with steam jets.
 */
export function LavaFountain({ position = [0, 10, 0], intensity = 1.0 }: LavaFountainProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const { isAnimActive, hasAnyAnim, progress } = useSimulationAnimations();

  const isFountaining = hasAnyAnim("eruption_blast", "lava_flow_start", "crater_explosion") || progress > 0.25;

  const count = 75;
  // Store initial velocities for ballistic trajectories
  const particles = useMemo(() => {
    const p = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spread = 0.2 + Math.random() * 0.8;
      p.push({
        vx: Math.cos(angle) * spread * 4,
        vy: 8 + Math.random() * 12,
        vz: Math.sin(angle) * spread * 4,
        x: 0,
        y: 0,
        z: 0,
        life: Math.random(),
        maxLife: 1.2 + Math.random() * 1.5,
      });
    }
    return p;
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;

      // Incandescent colors: yellow-orange-red
      const isYellow = Math.random() > 0.4;
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = isYellow ? 0.7 : 0.25;
      colors[i * 3 + 2] = 0.05;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !isFountaining) {
      if (pointsRef.current) pointsRef.current.visible = false;
      if (lightRef.current) lightRef.current.intensity = 0;
      return;
    }

    pointsRef.current.visible = true;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    const gravity = -14;
    const dt = Math.min(delta, 0.05);

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      p.life += dt;

      if (p.life > p.maxLife) {
        // Reset particle to crater vent
        p.life = 0;
        p.x = (Math.random() - 0.5) * 1.5;
        p.y = 0;
        p.z = (Math.random() - 0.5) * 1.5;
        const angle = Math.random() * Math.PI * 2;
        const spread = 0.3 + Math.random() * 0.7;
        p.vx = Math.cos(angle) * spread * 5 * intensity;
        p.vy = (10 + Math.random() * 12) * intensity;
        p.vz = Math.sin(angle) * spread * 5 * intensity;
      } else {
        // Apply physics
        p.vy += gravity * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;
      }

      array[i * 3] = p.x;
      array[i * 3 + 1] = p.y;
      array[i * 3 + 2] = p.z;
    }

    posAttr.needsUpdate = true;

    // Magma glow pulsation
    if (lightRef.current) {
      lightRef.current.intensity = 2.5 + Math.random() * 2.0;
    }
  });

  return (
    <group position={position}>
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          size={0.65}
          vertexColors
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Dynamic Magma Crater Point Light */}
      <pointLight
        ref={lightRef}
        color="#ff5500"
        intensity={3}
        distance={30}
        decay={2}
      />
    </group>
  );
}
