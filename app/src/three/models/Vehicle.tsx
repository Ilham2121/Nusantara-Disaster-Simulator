"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

interface VehicleProps {
  position: [number, number, number];
  rotationY?: number;
  color?: string;
  type?: "sedan" | "ambulance" | "truck";
}

export function Vehicle({
  position,
  rotationY = 0,
  color = "#dc2626",
  type = "sedan",
}: VehicleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const sirenRef = useRef<THREE.Mesh>(null);
  const { shakeIntensity, ashCoverage } = useSimulationAnimations();

  const bodyColor = useMemo(() => {
    const c = new THREE.Color(type === "ambulance" ? "#ffffff" : color);
    if (ashCoverage > 0.1) {
      c.lerp(new THREE.Color("#4b5563"), ashCoverage * 0.8);
    }
    return c;
  }, [color, type, ashCoverage]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    if (shakeIntensity > 0.02) {
      const t = clock.getElapsedTime() * 18;
      groupRef.current.position.y = position[1] + Math.abs(Math.sin(t)) * shakeIntensity * 0.1;
      groupRef.current.rotation.z = Math.sin(t * 0.9) * shakeIntensity * 0.04;
    } else {
      groupRef.current.position.y = position[1];
      groupRef.current.rotation.z = 0;
    }

    // Flashing emergency siren for ambulance
    if (type === "ambulance" && sirenRef.current) {
      const flash = Math.sin(clock.getElapsedTime() * 10) > 0;
      (sirenRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = flash ? 2.5 : 0.2;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]} ref={groupRef}>
      {/* Lower Chassis */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.8, 0.45, 3.4]} />
        <meshStandardMaterial color={bodyColor} roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Upper Cabin */}
      <mesh position={[0, type === "truck" ? 0.95 : 0.85, type === "truck" ? 0.35 : -0.2]} castShadow>
        <boxGeometry args={[1.6, type === "truck" ? 0.75 : 0.55, type === "truck" ? 1.5 : 2.0]} />
        <meshStandardMaterial color={bodyColor} roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Truck Rear Cargo Bed */}
      {type === "truck" && (
        <mesh position={[0, 0.7, -0.85]} castShadow receiveShadow>
          <boxGeometry args={[1.7, 0.55, 1.6]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
      )}

      {/* Windshield */}
      <mesh position={[0, type === "truck" ? 1.0 : 0.85, type === "truck" ? 1.12 : 0.82]} rotation={[-0.3, 0, 0]}>
        <planeGeometry args={[1.3, 0.45]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Ambulance Red Cross / Decal */}
      {type === "ambulance" && (
        <>
          {/* Siren light */}
          <mesh ref={sirenRef} position={[0, 1.25, -0.2]}>
            <cylinderGeometry args={[0.15, 0.15, 0.2, 8]} />
            <meshStandardMaterial
              color="#ef4444"
              emissive="#ef4444"
              emissiveIntensity={1.5}
            />
          </mesh>
        </>
      )}

      {/* Wheels */}
      {[
        [-0.95, 0.25, 1.0],
        [0.95, 0.25, 1.0],
        [-0.95, 0.25, -1.0],
        [0.95, 0.25, -1.0],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}
