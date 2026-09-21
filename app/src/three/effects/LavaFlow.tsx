"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

export interface LavaFlowProps {
  craterTop?: [number, number, number];
  pathPoints?: [number, number, number][];
  flowRadius?: number;
  showSteam?: boolean;
}

/**
 * Realistic Braided Lobate Lava Flow (Aliran Lava Pijar Berkerak Basalt & Multi-Lobe)
 * 
 * Replaces primitive cylindrical tubes with a terrain-draped flattened ribbon featuring:
 * 1. Raised cooling basaltic levee shoulders with jagged rock clinkers
 * 2. Active incandescent central molten channel with fiery fracture glow
 * 3. Multi-lobate advancing flow front (crawling incandescent magma toes, not a sphere)
 * 4. Heat convection embers and contact vegetation smoke
 */
export function LavaFlow({
  craterTop = [0, 24.4, -18],
  pathPoints,
  flowRadius = 0.9,
  showSteam = true,
}: LavaFlowProps) {
  const channelMeshRef = useRef<THREE.Mesh>(null);
  const moltenCoreMeshRef = useRef<THREE.Mesh>(null);
  const toesGroupRef = useRef<THREE.Group>(null);
  const embersRef = useRef<THREE.Points>(null);
  const smokeRef = useRef<THREE.Points>(null);
  const lavaLightRef = useRef<THREE.PointLight>(null);

  const { lavaProgress, lavaGlowIntensity, progress } = useSimulationAnimations();

  // Construct the CatmullRom curve along the natural slope
  const { curve, totalIndices, channelGeo, moltenGeo, curvePoints } = useMemo(() => {
    let rawPoints: THREE.Vector3[];

    if (pathPoints && pathPoints.length >= 2) {
      rawPoints = pathPoints.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
    } else {
      const [cx, cy, cz] = craterTop;
      rawPoints = [
        new THREE.Vector3(cx, cy - 0.2, cz),
        new THREE.Vector3(cx + 0.5, cy * 0.82, cz + 2.5),
        new THREE.Vector3(cx + 1.2, cy * 0.62, cz + 5.5),
        new THREE.Vector3(cx + 0.8, cy * 0.42, cz + 9.0),
        new THREE.Vector3(cx + 1.8, cy * 0.22, cz + 13.0),
        new THREE.Vector3(cx + 2.0, cy * 0.08, cz + 17.5),
        new THREE.Vector3(cx + 2.2, 0.2, cz + 22.0),
      ];
    }

    const c = new THREE.CatmullRomCurve3(rawPoints, false, "centripetal", 0.3);
    const numSteps = 56;
    const sampledPoints = c.getPoints(numSteps);

    // Build flattened, terrain-hugging trapezoidal ribbon geometry
    // Cross-section profile: 5 lateral vertices per slice
    // [0] Left outer margin (flush with ground)
    // [1] Left cooling basalt levee ridge (raised jagged berm)
    // [2] Center molten channel bed
    // [3] Right cooling basalt levee ridge
    // [4] Right outer margin
    const vertsChannel: number[] = [];
    const uvsChannel: number[] = [];
    const indicesChannel: number[] = [];

    const vertsMolten: number[] = [];
    const uvsMolten: number[] = [];
    const indicesMolten: number[] = [];

    const up = new THREE.Vector3(0, 1, 0);

    for (let i = 0; i <= numSteps; i++) {
      const t = i / numSteps;
      const pt = sampledPoints[i];
      const tangent = c.getTangent(t).normalize();

      // Lateral binormal vector
      const binormal = new THREE.Vector3().crossVectors(tangent, up).normalize();
      // Adjusted normal perpendicular to slope
      const normal = new THREE.Vector3().crossVectors(binormal, tangent).normalize();

      // Lava channel naturally widens as it approaches the base/delta fan
      const width = (flowRadius * 2.8) * (1.0 + t * 0.85);
      const height = (flowRadius * 0.42) * (1.0 - t * 0.15);

      // Jagged procedural noise so borders look organic and rocky
      const noiseL = Math.sin(i * 1.8) * 0.15;
      const noiseR = Math.cos(i * 2.1) * 0.15;

      // 1. Channel crust points
      // p0: left outer
      const p0 = pt.clone().addScaledVector(binormal, -width * 0.5 + noiseL).addScaledVector(normal, 0.02);
      // p1: left levee crest
      const p1 = pt.clone().addScaledVector(binormal, -width * 0.28).addScaledVector(normal, height * 1.15);
      // p2: center trough
      const p2 = pt.clone().addScaledVector(normal, height * 0.6);
      // p3: right levee crest
      const p3 = pt.clone().addScaledVector(binormal, width * 0.28).addScaledVector(normal, height * 1.15);
      // p4: right outer
      const p4 = pt.clone().addScaledVector(binormal, width * 0.5 + noiseR).addScaledVector(normal, 0.02);

      [p0, p1, p2, p3, p4].forEach((p) => {
        vertsChannel.push(p.x, p.y, p.z);
      });
      uvsChannel.push(0, t, 0.25, t, 0.5, t, 0.75, t, 1, t);

      // 2. Active molten central ribbon (recessed inside levees)
      const mLeft = pt.clone().addScaledVector(binormal, -width * 0.22).addScaledVector(normal, height * 0.75);
      const mCenter = pt.clone().addScaledVector(normal, height * 0.82);
      const mRight = pt.clone().addScaledVector(binormal, width * 0.22).addScaledVector(normal, height * 0.75);

      [mLeft, mCenter, mRight].forEach((p) => {
        vertsMolten.push(p.x, p.y, p.z);
      });
      uvsMolten.push(0, t, 0.5, t, 1, t);

      if (i < numSteps) {
        const row = i * 5;
        const nextRow = (i + 1) * 5;
        // 4 quad strips for crust
        for (let col = 0; col < 4; col++) {
          indicesChannel.push(
            row + col,
            nextRow + col,
            row + col + 1,
            row + col + 1,
            nextRow + col,
            nextRow + col + 1
          );
        }

        // 2 quad strips for molten core
        const mRow = i * 3;
        const mNextRow = (i + 1) * 3;
        for (let col = 0; col < 2; col++) {
          indicesMolten.push(
            mRow + col,
            mNextRow + col,
            mRow + col + 1,
            mRow + col + 1,
            mNextRow + col,
            mNextRow + col + 1
          );
        }
      }
    }

    const cGeo = new THREE.BufferGeometry();
    cGeo.setAttribute("position", new THREE.Float32BufferAttribute(vertsChannel, 3));
    cGeo.setAttribute("uv", new THREE.Float32BufferAttribute(uvsChannel, 2));
    cGeo.setIndex(indicesChannel);
    cGeo.computeVertexNormals();

    const mGeo = new THREE.BufferGeometry();
    mGeo.setAttribute("position", new THREE.Float32BufferAttribute(vertsMolten, 3));
    mGeo.setAttribute("uv", new THREE.Float32BufferAttribute(uvsMolten, 2));
    mGeo.setIndex(indicesMolten);
    mGeo.computeVertexNormals();

    return {
      curve: c,
      totalIndices: indicesChannel.length,
      channelGeo: cGeo,
      moltenGeo: mGeo,
      curvePoints: sampledPoints,
    };
  }, [craterTop, flowRadius, pathPoints]);

  // Floating embers particle buffer
  const emberCount = 38;
  const [emberPositions, emberVelocities] = useMemo(() => {
    const pos = new Float32Array(emberCount * 3);
    const vel = new Float32Array(emberCount * 3);
    for (let i = 0; i < emberCount; i++) {
      pos[i * 3] = craterTop[0];
      pos[i * 3 + 1] = craterTop[1];
      pos[i * 3 + 2] = craterTop[2];

      vel[i * 3] = (Math.random() - 0.5) * 0.4;
      vel[i * 3 + 1] = 0.8 + Math.random() * 1.5;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    return [pos, vel];
  }, [craterTop]);

  // Steam/smoke particle buffer
  const smokeCount = 32;
  const [smokePositions] = useMemo(() => {
    const pos = new Float32Array(smokeCount * 3);
    for (let i = 0; i < smokeCount; i++) {
      pos[i * 3] = craterTop[0];
      pos[i * 3 + 1] = craterTop[1];
      pos[i * 3 + 2] = craterTop[2];
    }
    return [pos];
  }, [craterTop]);

  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();
    const effectiveProgress = Math.min(1.0, Math.max(0, lavaProgress));

    // 1. Progressive unrolling of the flattened lava ribbon
    if (channelMeshRef.current && moltenCoreMeshRef.current) {
      if (effectiveProgress <= 0.01) {
        channelMeshRef.current.visible = false;
        moltenCoreMeshRef.current.visible = false;
      } else {
        channelMeshRef.current.visible = true;
        moltenCoreMeshRef.current.visible = true;

        const visibleSegments = Math.max(1, Math.floor(effectiveProgress * 56));
        const channelDrawCount = visibleSegments * 4 * 6;
        const moltenDrawCount = visibleSegments * 2 * 6;

        channelMeshRef.current.geometry.setDrawRange(0, channelDrawCount);
        moltenCoreMeshRef.current.geometry.setDrawRange(0, moltenDrawCount);

        // Incandescent pulsing of central fissure
        const moltenMat = moltenCoreMeshRef.current.material as THREE.MeshStandardMaterial;
        const pulse = 1.0 + Math.sin(time * 3.5) * 0.25;
        moltenMat.emissiveIntensity = (1.8 + lavaGlowIntensity * 2.2) * pulse;
      }
    }

    // 2. Position multi-lobate flow front (toes) at current front point
    if (toesGroupRef.current) {
      if (effectiveProgress > 0.02 && effectiveProgress < 0.99) {
        toesGroupRef.current.visible = true;
        const frontPt = curve.getPointAt(effectiveProgress);
        const tangent = curve.getTangentAt(effectiveProgress).normalize();
        toesGroupRef.current.position.copy(frontPt);

        // Orient toes forward along flow direction
        const angleY = Math.atan2(tangent.x, tangent.z);
        toesGroupRef.current.rotation.set(0, angleY, 0);

        // Dynamic pulsing light at flow front
        if (lavaLightRef.current) {
          lavaLightRef.current.intensity = (2.5 + Math.sin(time * 5.0) * 1.2) * lavaGlowIntensity;
        }
      } else if (effectiveProgress >= 0.99) {
        // Delta fan at final resting base
        toesGroupRef.current.visible = true;
        const endPt = curve.getPointAt(1.0);
        toesGroupRef.current.position.copy(endPt);
      } else {
        toesGroupRef.current.visible = false;
      }
    }

    // 3. Floating heat embers ascending from the active lava
    if (embersRef.current && effectiveProgress > 0.05) {
      embersRef.current.visible = true;
      const posAttr = embersRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const dt = Math.min(delta, 0.05);

      for (let i = 0; i < emberCount; i++) {
        let y = posAttr.getY(i) + emberVelocities[i * 3 + 1] * dt;
        let x = posAttr.getX(i) + emberVelocities[i * 3] * dt;
        let z = posAttr.getZ(i) + emberVelocities[i * 3 + 2] * dt;

        // Reset ember along active segment
        if (y > 35 || Math.random() < 0.015) {
          const sampleT = Math.random() * effectiveProgress;
          const p = curve.getPointAt(sampleT);
          x = p.x + (Math.random() - 0.5) * flowRadius * 2.0;
          y = p.y + 0.2;
          z = p.z + (Math.random() - 0.5) * flowRadius * 2.0;
        }

        posAttr.setXYZ(i, x, y, z);
      }
      posAttr.needsUpdate = true;
    } else if (embersRef.current) {
      embersRef.current.visible = false;
    }

    // 4. Contact smoke rising along margins
    if (smokeRef.current && showSteam && effectiveProgress > 0.08) {
      smokeRef.current.visible = true;
      const sAttr = smokeRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const dt = Math.min(delta, 0.05);

      for (let i = 0; i < smokeCount; i++) {
        let sy = sAttr.getY(i) + (1.2 + Math.random() * 0.8) * dt;
        let sx = sAttr.getX(i) + Math.sin(time + i) * 0.4 * dt;
        let sz = sAttr.getZ(i) + Math.cos(time + i) * 0.4 * dt;

        if (sy - craterTop[1] > 6.0 || Math.random() < 0.02) {
          const sampleT = Math.random() * effectiveProgress;
          const p = curve.getPointAt(sampleT);
          // Emerge on the outer levee flank
          const side = Math.random() > 0.5 ? 1 : -1;
          sx = p.x + side * flowRadius * 1.6;
          sy = p.y + 0.1;
          sz = p.z + side * flowRadius * 0.8;
        }

        sAttr.setXYZ(i, sx, sy, sz);
      }
      sAttr.needsUpdate = true;
    } else if (smokeRef.current) {
      smokeRef.current.visible = false;
    }
  });

  return (
    <group>
      {/* 1. Outer Cooling Basalt Levee Shoulder Ribbon (Dark Jagged Rock Channel) */}
      <mesh ref={channelMeshRef} geometry={channelGeo} castShadow receiveShadow>
        <meshStandardMaterial
          color="#1c1917"
          roughness={0.92}
          metalness={0.08}
          flatShading
        />
      </mesh>

      {/* 2. Inner Active Molten Magma Trench (Bright Incandescent Glow) */}
      <mesh ref={moltenCoreMeshRef} geometry={moltenGeo}>
        <meshStandardMaterial
          color="#ff3b00"
          emissive="#ff2200"
          emissiveIntensity={2.5}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>

      {/* 3. Multi-Lobate Advancing Flow Front (Braided Magma Toes - No primitive sphere!) */}
      <group ref={toesGroupRef} visible={false}>
        {/* Central creeping main lobe (flattened extruded tongue) */}
        <mesh position={[0, 0.08, 0.5]} scale={[flowRadius * 1.1, 0.25, flowRadius * 1.3]} castShadow>
          <dodecahedronGeometry args={[0.8, 1]} />
          <meshStandardMaterial
            color="#ff4500"
            emissive="#ff2a00"
            emissiveIntensity={3.0}
            roughness={0.3}
            flatShading
          />
        </mesh>

        {/* Left branching toe */}
        <mesh position={[-flowRadius * 0.75, 0.06, 0.2]} scale={[flowRadius * 0.65, 0.2, flowRadius * 0.8]} castShadow>
          <dodecahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial
            color="#ff5500"
            emissive="#ff3300"
            emissiveIntensity={2.4}
            roughness={0.35}
            flatShading
          />
        </mesh>

        {/* Right branching toe */}
        <mesh position={[flowRadius * 0.75, 0.06, 0.25]} scale={[flowRadius * 0.7, 0.2, flowRadius * 0.85]} castShadow>
          <dodecahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial
            color="#ff5500"
            emissive="#ff3300"
            emissiveIntensity={2.4}
            roughness={0.35}
            flatShading
          />
        </mesh>

        {/* Cooling crusted levee edges at the front */}
        <mesh position={[-flowRadius * 1.1, 0.1, -0.2]} scale={[0.5, 0.28, 0.6]}>
          <dodecahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color="#26201e" roughness={0.95} flatShading />
        </mesh>
        <mesh position={[flowRadius * 1.1, 0.1, -0.2]} scale={[0.5, 0.28, 0.6]}>
          <dodecahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color="#26201e" roughness={0.95} flatShading />
        </mesh>

        {/* Dynamic incandescent glow illumination */}
        <pointLight
          ref={lavaLightRef}
          color="#ff4400"
          intensity={2.8}
          distance={14}
          decay={2}
        />
      </group>

      {/* 4. Ascending Fiery Embers & Cinders */}
      <points ref={embersRef} visible={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[emberPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.5}
          color="#ffb703"
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* 5. Scorched Earth / Contact Smoke Puffs along Levees */}
      <points ref={smokeRef} visible={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[smokePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={1.6}
          color="#a8a29e"
          transparent
          opacity={0.35}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
