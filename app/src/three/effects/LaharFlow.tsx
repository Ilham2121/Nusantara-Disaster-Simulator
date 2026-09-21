"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";

export interface LaharFlowProps {
  position?: [number, number, number];
  pathPoints?: [number, number, number][];
  riverRadius?: number;
}

/**
 * Realistic Canyon Lahar Torrent (Banjir Lahar Dingin Besuk Kobokan)
 * 
 * Replaces primitive tubes and half-spheres with a turbulent sediment mudflow featuring:
 * 1. Flattened canyon-draped fluid ribbon with rushing surface wave displacement
 * 2. Whitewater froth crests and churning silt waves
 * 3. Surging wedge wavefront (kepala arus lumpur bervolume, bukan bola)
 * 4. Tumbling andesite rock boulders swept downstream
 * 5. High-velocity mud spray & riverbank mist
 */
export function LaharFlow({
  position = [0, 0, 0],
  pathPoints,
  riverRadius = 1.4,
}: LaharFlowProps) {
  const torrentMeshRef = useRef<THREE.Mesh>(null);
  const frothMeshRef = useRef<THREE.Mesh>(null);
  const surgeHeadRef = useRef<THREE.Group>(null);
  const bouldersRef = useRef<THREE.Group>(null);
  const sprayRef = useRef<THREE.Points>(null);

  const { progress } = useSimulationAnimations();

  // Lahar activates as eruption ash and rainfall triggers debris flow
  const laharProgress = Math.min(1.0, Math.max(0, (progress - 0.20) / 0.65));

  // Build the riverbed curve and flattened canyon ribbon geometry
  const { curve, totalSteps, ribbonGeo, frothGeo } = useMemo(() => {
    let pts: THREE.Vector3[];

    if (pathPoints && pathPoints.length >= 2) {
      pts = pathPoints.map((p) => new THREE.Vector3(p[0], p[1], p[2]));
    } else {
      // Natural path originating from the upper Mahameru avalanche chute down Besuk Kobokan
      pts = [
        new THREE.Vector3(0.0, 25.0, -19.5),
        new THREE.Vector3(0.8, 18.5, -16.8),
        new THREE.Vector3(1.6, 12.0, -13.0),
        new THREE.Vector3(2.2, 6.5, -8.5),
        new THREE.Vector3(1.2, 3.2, -3.0),
        new THREE.Vector3(2.0, 1.2, 3.0),
        new THREE.Vector3(3.0, 0.4, 9.5),
        new THREE.Vector3(3.8, 0.1, 16.5),
      ];
    }

    const c = new THREE.CatmullRomCurve3(pts, false, "centripetal", 0.25);
    const steps = 60;
    const sampledPoints = c.getPoints(steps);

    // Build ribbon geometry fitting the riverbed canyon
    // 5 vertices per cross-section slice:
    // [0] Left bank
    // [1] Left eddy / wave crest
    // [2] Center deep torrent
    // [3] Right eddy / wave crest
    // [4] Right bank
    const vertsMud: number[] = [];
    const uvsMud: number[] = [];
    const indicesMud: number[] = [];

    const vertsFroth: number[] = [];
    const uvsFroth: number[] = [];
    const indicesFroth: number[] = [];

    const up = new THREE.Vector3(0, 1, 0);

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const pt = sampledPoints[i];
      const tangent = c.getTangent(t).normalize();
      const binormal = new THREE.Vector3().crossVectors(tangent, up).normalize();
      const normal = new THREE.Vector3().crossVectors(binormal, tangent).normalize();

      // Lahar channel widens significantly downstream as canyon opens
      const width = (riverRadius * 2.6) * (1.0 + t * 0.9);
      const depth = (riverRadius * 0.35);

      // 1. Mud slurry vertices
      const p0 = pt.clone().addScaledVector(binormal, -width * 0.5).addScaledVector(normal, 0.08);
      const p1 = pt.clone().addScaledVector(binormal, -width * 0.25).addScaledVector(normal, depth * 0.9);
      const p2 = pt.clone().addScaledVector(normal, depth * 0.75);
      const p3 = pt.clone().addScaledVector(binormal, width * 0.25).addScaledVector(normal, depth * 0.9);
      const p4 = pt.clone().addScaledVector(binormal, width * 0.5).addScaledVector(normal, 0.08);

      [p0, p1, p2, p3, p4].forEach((p) => vertsMud.push(p.x, p.y, p.z));
      uvsMud.push(0, t, 0.25, t, 0.5, t, 0.75, t, 1, t);

      // 2. Whitewater froth streaks (running along center waves)
      const f0 = pt.clone().addScaledVector(binormal, -width * 0.18).addScaledVector(normal, depth * 0.95);
      const f1 = pt.clone().addScaledVector(binormal, width * 0.18).addScaledVector(normal, depth * 0.95);
      [f0, f1].forEach((p) => vertsFroth.push(p.x, p.y, p.z));
      uvsFroth.push(0, t, 1, t);

      if (i < steps) {
        const row = i * 5;
        const nextRow = (i + 1) * 5;
        for (let col = 0; col < 4; col++) {
          indicesMud.push(
            row + col,
            nextRow + col,
            row + col + 1,
            row + col + 1,
            nextRow + col,
            nextRow + col + 1
          );
        }

        const fRow = i * 2;
        const fNextRow = (i + 1) * 2;
        indicesFroth.push(fRow, fNextRow, fRow + 1, fRow + 1, fNextRow, fNextRow + 1);
      }
    }

    const mGeo = new THREE.BufferGeometry();
    mGeo.setAttribute("position", new THREE.Float32BufferAttribute(vertsMud, 3));
    mGeo.setAttribute("uv", new THREE.Float32BufferAttribute(uvsMud, 2));
    mGeo.setIndex(indicesMud);
    mGeo.computeVertexNormals();

    const fGeo = new THREE.BufferGeometry();
    fGeo.setAttribute("position", new THREE.Float32BufferAttribute(vertsFroth, 3));
    fGeo.setAttribute("uv", new THREE.Float32BufferAttribute(uvsFroth, 2));
    fGeo.setIndex(indicesFroth);
    fGeo.computeVertexNormals();

    return {
      curve: c,
      totalSteps: steps,
      ribbonGeo: mGeo,
      frothGeo: fGeo,
    };
  }, [pathPoints, riverRadius]);

  // Jagged andesite boulders tumbling in the lahar
  const boulders = useMemo(() => {
    return [
      { baseT: 0.12, speed: 0.08, lateralOffset: -0.5, size: 0.85, rotSpeed: 4.5 },
      { baseT: 0.28, speed: 0.09, lateralOffset: 0.4, size: 0.65, rotSpeed: 6.0 },
      { baseT: 0.45, speed: 0.07, lateralOffset: -0.2, size: 1.1, rotSpeed: 3.5 },
      { baseT: 0.62, speed: 0.10, lateralOffset: 0.6, size: 0.55, rotSpeed: 7.0 },
      { baseT: 0.78, speed: 0.08, lateralOffset: -0.3, size: 0.95, rotSpeed: 4.0 },
      { baseT: 0.91, speed: 0.11, lateralOffset: 0.1, size: 0.75, rotSpeed: 5.5 },
    ];
  }, []);

  // Churning mud spray particle buffer
  const sprayCount = 45;
  const [sprayPositions] = useMemo(() => {
    const pos = new Float32Array(sprayCount * 3);
    for (let i = 0; i < sprayCount; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;
    }
    return [pos];
  }, []);

  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();
    const effectiveProgress = Math.min(1.0, Math.max(0, laharProgress));

    // 1. Progressive unrolling of canyon lahar ribbon
    if (torrentMeshRef.current && frothMeshRef.current) {
      if (effectiveProgress <= 0.01) {
        torrentMeshRef.current.visible = false;
        frothMeshRef.current.visible = false;
      } else {
        torrentMeshRef.current.visible = true;
        frothMeshRef.current.visible = true;

        const visibleSegments = Math.max(1, Math.floor(effectiveProgress * totalSteps));
        const mudDrawCount = visibleSegments * 4 * 6;
        const frothDrawCount = visibleSegments * 6;

        torrentMeshRef.current.geometry.setDrawRange(0, mudDrawCount);
        frothMeshRef.current.geometry.setDrawRange(0, frothDrawCount);

        // Animate wave displacement on the fluid surface
        const posAttr = torrentMeshRef.current.geometry.attributes.position as THREE.BufferAttribute;
        // Simple subtle surface ripple wave
        for (let i = 0; i < visibleSegments * 5; i += 5) {
          const wave = Math.sin(time * 6.0 + i * 0.4) * 0.05;
          const curY = posAttr.getY(i + 2); // Center trough vertex
          posAttr.setY(i + 2, curY + wave * 0.1);
        }
        posAttr.needsUpdate = true;
      }
    }

    // 2. Surging debris wedge wavefront
    if (surgeHeadRef.current) {
      if (effectiveProgress > 0.02 && effectiveProgress < 0.99) {
        surgeHeadRef.current.visible = true;
        const frontPt = curve.getPointAt(effectiveProgress);
        const tangent = curve.getTangentAt(effectiveProgress).normalize();
        surgeHeadRef.current.position.copy(frontPt);

        // Orient along river course
        const angleY = Math.atan2(tangent.x, tangent.z);
        surgeHeadRef.current.rotation.set(0, angleY, 0);

        // Churning heave motion at wavefront
        surgeHeadRef.current.position.y += Math.sin(time * 8.0) * 0.08;
      } else if (effectiveProgress >= 0.99) {
        surgeHeadRef.current.visible = true;
        const endPt = curve.getPointAt(1.0);
        surgeHeadRef.current.position.copy(endPt);
      } else {
        surgeHeadRef.current.visible = false;
      }
    }

    // 3. Tumbling andesite boulders bouncing in the torrent
    if (bouldersRef.current) {
      const children = bouldersRef.current.children;
      boulders.forEach((b, idx) => {
        const mesh = children[idx] as THREE.Mesh | undefined;
        if (!mesh) return;

        // Boulders advance downstream inside the active slurry
        const t = (b.baseT + time * b.speed) % 1.0;
        if (t <= effectiveProgress) {
          mesh.visible = true;
          const pt = curve.getPointAt(t);
          const tangent = curve.getTangentAt(t).normalize();
          const binormal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

          mesh.position.copy(pt).addScaledVector(binormal, b.lateralOffset);
          // Roll tumbling rotation
          mesh.rotation.x += b.rotSpeed * delta;
          mesh.rotation.z += (b.rotSpeed * 0.7) * delta;
          // Submerge partially in mud
          mesh.position.y += Math.sin(time * 4.0 + idx) * 0.06;
        } else {
          mesh.visible = false;
        }
      });
    }

    // 4. Churning mud spray particles at the wavefront
    if (sprayRef.current && effectiveProgress > 0.03 && effectiveProgress < 0.99) {
      sprayRef.current.visible = true;
      const sAttr = sprayRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const frontPt = curve.getPointAt(effectiveProgress);
      const dt = Math.min(delta, 0.05);

      for (let i = 0; i < sprayCount; i++) {
        let sx = sAttr.getX(i) + (Math.random() - 0.5) * 1.5 * dt;
        let sy = sAttr.getY(i) + (1.5 + Math.random() * 2.0) * dt;
        let sz = sAttr.getZ(i) + (Math.random() - 0.5) * 1.5 * dt;

        if (sy - frontPt.y > 2.5 || Math.random() < 0.05) {
          sx = frontPt.x + (Math.random() - 0.5) * riverRadius * 1.8;
          sy = frontPt.y + 0.2;
          sz = frontPt.z + (Math.random() - 0.5) * riverRadius * 1.8;
        }

        sAttr.setXYZ(i, sx, sy, sz);
      }
      sAttr.needsUpdate = true;
    } else if (sprayRef.current) {
      sprayRef.current.visible = false;
    }
  });

  return (
    <group position={position}>
      {/* 1. Main Dense Mud Slurry Canyon Ribbon */}
      <mesh ref={torrentMeshRef} geometry={ribbonGeo} castShadow receiveShadow>
        <meshStandardMaterial
          color="#352e29"
          roughness={0.75}
          metalness={0.2}
          flatShading
        />
      </mesh>

      {/* 2. Whitewater Froth & Foam Streaks */}
      <mesh ref={frothMeshRef} geometry={frothGeo}>
        <meshStandardMaterial
          color="#94a3b8"
          roughness={0.4}
          metalness={0.1}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* 3. Surging Wedge Debris Wavefront (Jagged Mud Bore, No Primitive Sphere) */}
      <group ref={surgeHeadRef} visible={false}>
        {/* Main crest wedge */}
        <mesh position={[0, 0.15, 0.3]} scale={[riverRadius * 1.4, 0.45, riverRadius * 1.1]} castShadow>
          <dodecahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial
            color="#292524"
            roughness={0.85}
            metalness={0.15}
            flatShading
          />
        </mesh>

        {/* Churning froth cap at the wavefront lip */}
        <mesh position={[0, 0.28, 0.5]} scale={[riverRadius * 1.2, 0.2, 0.6]}>
          <dodecahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial
            color="#cbd5e1"
            roughness={0.3}
            transparent
            opacity={0.75}
            flatShading
          />
        </mesh>

        {/* Tumbling debris logs / rocks caught in the crest */}
        <mesh position={[-riverRadius * 0.5, 0.22, 0.1]} rotation={[0.4, 0.8, -0.2]} scale={[0.5, 0.3, 0.8]}>
          <boxGeometry args={[1, 0.5, 1]} />
          <meshStandardMaterial color="#1c1917" roughness={0.9} />
        </mesh>
        <mesh position={[riverRadius * 0.5, 0.2, 0.2]} rotation={[-0.2, 0.5, 0.6]} scale={[0.6, 0.35, 0.6]}>
          <dodecahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color="#44403c" roughness={0.9} flatShading />
        </mesh>
      </group>

      {/* 4. Tumbling Jagged Andesite Boulders */}
      <group ref={bouldersRef}>
        {boulders.map((b, i) => (
          <mesh key={i} visible={false} castShadow>
            <dodecahedronGeometry args={[b.size, 0]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#1c1917" : "#2d2825"}
              roughness={0.95}
              flatShading
            />
          </mesh>
        ))}
      </group>

      {/* 5. Churning Mud & Spray Particles at Wavefront */}
      <points ref={sprayRef} visible={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[sprayPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={1.2}
          color="#78716c"
          transparent
          opacity={0.5}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
