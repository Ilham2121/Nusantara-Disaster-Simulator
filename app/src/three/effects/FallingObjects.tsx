"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

interface FallingItem {
  id: number;
  startX: number;
  startY: number;
  startZ: number;
  size: [number, number, number];
  color: string;
  fallDelay: number;
  rotationSpeed: [number, number, number];
}

export function FallingObjects() {
  const { isObjectsFalling, shakeIntensity, objectFallRate } = useSimulationAnimations();
  const meshesRef = useRef<(THREE.Mesh | null)[]>([]);
  const fallProgress = useRef<number[]>([]);

  // Fixed set of 16 falling debris items positioned on high building ledges
  const items: FallingItem[] = useMemo(() => {
    const list: FallingItem[] = [];
    const buildingAnchors = [
      { x: -5, y: 12, z: -5 },
      { x: 6, y: 14, z: -4 },
      { x: -7, y: 8, z: 5 },
      { x: 8, y: 10, z: 6 },
    ];

    let id = 0;
    buildingAnchors.forEach((anchor) => {
      for (let i = 0; i < 4; i++) {
        list.push({
          id: id++,
          startX: anchor.x + (Math.random() - 0.5) * 2.2,
          startY: anchor.y + Math.random() * 1.5,
          startZ: anchor.z + (Math.random() - 0.5) * 2.2,
          size: [0.35 + Math.random() * 0.25, 0.25 + Math.random() * 0.2, 0.35 + Math.random() * 0.25],
          color: Math.random() > 0.5 ? "#b45309" : "#64748b", // Brick or concrete chunk
          fallDelay: Math.random() * 2.0, // Staggered falling times
          rotationSpeed: [Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 4 - 2],
        });
      }
    });
    return list;
  }, []);

  // Initialize progress trackers
  if (fallProgress.current.length !== items.length) {
    fallProgress.current = items.map(() => 0);
  }

  useFrame((_, delta) => {
    // Number of active items scales with objectFallRate (0-1)
    const activeItemCount = Math.max(2, Math.floor(items.length * Math.min(1, objectFallRate * 1.5)));
    const fallSpeed = 0.6 + objectFallRate * 1.8;

    items.forEach((item, index) => {
      const mesh = meshesRef.current[index];
      if (!mesh) return;

      if (isObjectsFalling && index < activeItemCount) {
        fallProgress.current[index] += delta * fallSpeed;
        // Delay inversely proportional to intensity: high intensity = shorter delays
        const effectiveDelay = item.fallDelay * (1.2 - objectFallRate * 0.8);
        const p = Math.max(0, fallProgress.current[index] - effectiveDelay);

        if (p > 0) {
          const targetY = Math.max(0.15, item.startY - 9.8 * 0.5 * p * p);
          mesh.position.y = targetY;

          const scatter = 0.3 + objectFallRate * 0.5;
          mesh.position.x = item.startX + (item.startX > 0 ? 1 : -1) * (p * scatter);
          mesh.position.z = item.startZ + (item.startZ > 0 ? 1 : -1) * (p * scatter);

          if (targetY > 0.2) {
            const rotSpeed = 3 + objectFallRate * 4;
            mesh.rotation.x += item.rotationSpeed[0] * delta * rotSpeed;
            mesh.rotation.y += item.rotationSpeed[1] * delta * rotSpeed;
            mesh.rotation.z += item.rotationSpeed[2] * delta * rotSpeed;
          }
          mesh.visible = true;
        } else {
          mesh.position.set(item.startX, item.startY, item.startZ);
          mesh.visible = shakeIntensity > 0.2;
        }
      } else {
        fallProgress.current[index] = 0;
        mesh.position.set(item.startX, item.startY, item.startZ);
        mesh.visible = false;
      }
    });
  });

  return (
    <group>
      {items.map((item, idx) => (
        <mesh
          key={item.id}
          ref={(el) => {
            meshesRef.current[idx] = el;
          }}
          position={[item.startX, item.startY, item.startZ]}
          castShadow
          visible={false}
        >
          <boxGeometry args={item.size} />
          <meshStandardMaterial color={item.color} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}
