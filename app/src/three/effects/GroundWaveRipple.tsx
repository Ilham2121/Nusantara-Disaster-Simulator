"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

interface GroundWaveRippleProps {
  size?: number;
  resolution?: number;
}

/**
 * Radial ground wave propagation effect.
 * Renders a displaced plane mesh where vertex heights form
 * concentric ripples radiating outward from the epicenter.
 * Amplitude and speed scale with groundWaveAmplitude from parameters.
 */
export function GroundWaveRipple({ size = 80, resolution = 64 }: GroundWaveRippleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { groundWaveAmplitude, currentWavePhase, progress } = useSimulationAnimations();

  const basePositions = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size, size, resolution, resolution);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position.array as Float32Array;
    return { geometry: geo, original: new Float32Array(pos) };
  }, [size, resolution]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const isActive = groundWaveAmplitude > 0.01 && currentWavePhase !== "idle";
    meshRef.current.visible = isActive;

    if (!isActive) return;

    const time = clock.getElapsedTime();
    const posAttr = meshRef.current.geometry.attributes.position;
    const positions = posAttr.array as Float32Array;
    const original = basePositions.original;
    const count = posAttr.count;

    // Wave propagation speed depends on phase
    const waveSpeed = currentWavePhase === "p_wave" ? 12
      : currentWavePhase === "s_wave" ? 7
      : 4;

    // Wavelength
    const wavelength = currentWavePhase === "p_wave" ? 6
      : currentWavePhase === "s_wave" ? 10
      : 16;

    const amp = groundWaveAmplitude * 0.35;

    for (let i = 0; i < count; i++) {
      const x = original[i * 3];
      const z = original[i * 3 + 2];

      // Distance from epicenter (0,0)
      const dist = Math.sqrt(x * x + z * z);

      // Traveling wave: sin(k*dist - omega*t) * envelope
      const k = (2 * Math.PI) / wavelength;
      const omega = waveSpeed;
      const wave = Math.sin(k * dist - omega * time);

      // Radial decay: amplitude falls off with distance
      const distDecay = 1 / (1 + dist * 0.04);

      // Temporal envelope: wave builds up and fades with progress
      const envelope = Math.sin(Math.min(1, progress * 3) * Math.PI);

      positions[i * 3 + 1] = original[i * 3 + 1] + wave * amp * distDecay * envelope;
    }

    posAttr.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  return (
    <mesh
      ref={meshRef}
      geometry={basePositions.geometry}
      position={[0, 0.06, 0]}
      visible={false}
      receiveShadow
    >
      <meshStandardMaterial
        color="#3a3530"
        roughness={0.95}
        metalness={0.05}
        transparent
        opacity={0.4}
        wireframe={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
