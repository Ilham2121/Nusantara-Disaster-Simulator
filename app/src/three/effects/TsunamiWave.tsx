"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

interface TsunamiWaveProps {
  waveHeight?: number;
  width?: number;
}

/**
 * 3D Tsunami Surge Wave
 * Renders an advancing curved wall of oceanic water with foam crest and mist spray
 * as it surges from offshore onto the coastline.
 */
export function TsunamiWave({ waveHeight = 4.5, width = 45 }: TsunamiWaveProps) {
  const groupRef = useRef<THREE.Group>(null);
  const foamRef = useRef<THREE.Mesh>(null);
  const { isTsunamiWave, tsunamiWaveProgress } = useSimulationAnimations();

  // Wave profile geometry (curved cross-section along X)
  const waveGeometry = useMemo(() => {
    // Cylinder segment curved to resemble a breaking wave crest
    const geo = new THREE.CylinderGeometry(
      waveHeight * 0.45,
      waveHeight * 1.1,
      width,
      24,
      4,
      true,
      0,
      Math.PI * 0.8
    );
    // Rotate cylinder so its length is along X axis
    geo.rotateZ(Math.PI / 2);
    geo.rotateX(-Math.PI * 0.25);
    return geo;
  }, [waveHeight, width]);

  // White foam crest geometry on top of wave
  const foamGeometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(
      0.35,
      0.5,
      width,
      12,
      1
    );
    geo.rotateZ(Math.PI / 2);
    return geo;
  }, [width]);

  // Mist / spray particles
  const sprayParticles = useMemo(() => {
    const count = 35;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * width;
      positions[i * 3 + 1] = waveHeight * (0.8 + Math.random() * 0.4);
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [waveHeight, width]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    if (!isTsunamiWave && tsunamiWaveProgress <= 0) {
      groupRef.current.visible = false;
      return;
    }

    groupRef.current.visible = true;

    // Advance from offshore (Z = -28) to onshore (Z = 5)
    const currentZ = -28 + tsunamiWaveProgress * 33;
    groupRef.current.position.z = currentZ;

    // Wave height rises as it approaches shallow water, then crests
    const heightFactor = Math.sin(tsunamiWaveProgress * Math.PI);
    groupRef.current.position.y = Math.max(0.1, heightFactor * waveHeight);

    // Wave churning motion
    const t = clock.getElapsedTime() * 4;
    groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.05;

    // Animate foam crest pulsation
    if (foamRef.current) {
      foamRef.current.scale.y = 1 + Math.sin(t * 2) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -28]}>
      {/* Main Curved Wave Water Wall */}
      <mesh geometry={waveGeometry} receiveShadow castShadow>
        <meshStandardMaterial
          color="#0369a1" // Deep turbulent oceanic blue
          roughness={0.15}
          metalness={0.2}
          transparent
          opacity={0.88}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Breaking White Foam Crest (Buih Ombak Putih) */}
      <mesh
        ref={foamRef}
        geometry={foamGeometry}
        position={[0, waveHeight * 0.45, 0.4]}
      >
        <meshStandardMaterial
          color="#ffffff"
          emissive="#e0f2fe"
          emissiveIntensity={0.6}
          roughness={0.5}
        />
      </mesh>

      {/* Spray Mist Particles */}
      <points geometry={sprayParticles}>
        <pointsMaterial
          size={0.25}
          color="#ffffff"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
