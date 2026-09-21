"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { useSimulationAnimations } from "../hooks/useSimulationAnimations";
import { useSimulationStore } from "@/stores/simulationStore";
import {
  interpolateCameraPath,
  earthquakeCameraScript,
  eruptionCameraScript,
  coastalCameraScript,
} from "./CameraPath";
import { EarthquakeParameters } from "@/simulation/types";

export type CameraPreset = "overview" | "street" | "closeup" | "cinematic";

interface SimulationCameraProps {
  preset?: CameraPreset;
  onPresetChange?: (preset: CameraPreset) => void;
}

const PRESET_CONFIGS: Record<CameraPreset, { position: [number, number, number]; target: [number, number, number]; fov: number }> = {
  overview: {
    position: [28, 20, 28],
    target: [0, 2, 0],
    fov: 45,
  },
  street: {
    position: [1, 2.5, 14],
    target: [0, 2.2, 0],
    fov: 55,
  },
  closeup: {
    position: [6, 4.5, 8],
    target: [1, 2.5, 1],
    fov: 48,
  },
  cinematic: {
    position: [24, 16, 24],
    target: [0, 2, 0],
    fov: 45,
  },
};

export function SimulationCamera({ preset = "overview" }: SimulationCameraProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const { shakeIntensity, isExploding, progress } = useSimulationAnimations();
  const disasterType = useSimulationStore((s) => s.disasterType);
  const simulationState = useSimulationStore((s) => s.simulationState);
  const parameters = useSimulationStore((s) => s.parameters);

  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(...PRESET_CONFIGS[preset].position));
  const targetControlsLookAt = useRef<THREE.Vector3>(new THREE.Vector3(...PRESET_CONFIGS[preset].target));
  const targetFov = useRef<number>(PRESET_CONFIGS[preset].fov);

  // Track user interaction to pause auto-cinematic
  const userInteracting = useRef(false);
  const lastInteractionTime = useRef(0);

  const handleInteractionStart = useCallback(() => {
    userInteracting.current = true;
    lastInteractionTime.current = performance.now();
  }, []);

  const handleInteractionEnd = useCallback(() => {
    userInteracting.current = false;
    lastInteractionTime.current = performance.now();
  }, []);

  // Determine if coastal scenario
  const isCoastal = disasterType === "earthquake" &&
    (parameters as EarthquakeParameters | null)?.environment === "coastal";

  // Select camera script based on disaster type
  const getCameraScript = useCallback(() => {
    if (disasterType === "eruption") return eruptionCameraScript;
    if (isCoastal) return coastalCameraScript;
    return earthquakeCameraScript;
  }, [disasterType, isCoastal]);

  useEffect(() => {
    const config = PRESET_CONFIGS[preset];
    if (config && preset !== "cinematic") {
      targetCamPos.current.set(...config.position);
      targetControlsLookAt.current.set(...config.target);
      targetFov.current = config.fov;
    }
  }, [preset]);

  useFrame(({ clock }) => {
    if (!controlsRef.current) return;

    const isRunning = simulationState === "running";
    const isCinematic = preset === "cinematic";

    // Auto-cinematic mode: follows scripted path when running and no user interaction
    const timeSinceInteraction = performance.now() - lastInteractionTime.current;
    const autoMode = isCinematic && isRunning && timeSinceInteraction > 3000 && !userInteracting.current;

    if (autoMode) {
      const script = getCameraScript();
      const interpolated = interpolateCameraPath(script, progress);

      targetCamPos.current.copy(interpolated.position);
      targetControlsLookAt.current.copy(interpolated.target);
      targetFov.current = interpolated.fov;
    }

    // Smooth transition to target position
    const lerpSpeed = autoMode ? 0.025 : 0.04;
    camera.position.lerp(targetCamPos.current, lerpSpeed);
    controlsRef.current.target.lerp(targetControlsLookAt.current, lerpSpeed);

    // Dynamic FOV
    const perspCam = camera as THREE.PerspectiveCamera;
    perspCam.fov = THREE.MathUtils.lerp(perspCam.fov, targetFov.current, 0.03);
    perspCam.updateProjectionMatrix();

    // Camera shake proportional to intensity
    if (shakeIntensity > 0.01 || isExploding) {
      const time = clock.getElapsedTime() * 25;
      const amp = shakeIntensity * 0.3 + (isExploding ? 0.5 : 0);
      const shakeX = (Math.sin(time * 1.3) + Math.sin(time * 2.7)) * amp * 0.5;
      const shakeY = (Math.cos(time * 1.7) + Math.sin(time * 3.1)) * amp * 0.3;
      const shakeZ = (Math.sin(time * 1.9) + Math.cos(time * 2.3)) * amp * 0.5;

      camera.position.x += shakeX;
      camera.position.y += shakeY;
      camera.position.z += shakeZ;
    }

    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={3}
      maxDistance={120}
      maxPolarAngle={Math.PI / 2 - 0.05}
      autoRotate={preset === "cinematic" && simulationState !== "running"}
      autoRotateSpeed={0.6}
      onStart={handleInteractionStart}
      onEnd={handleInteractionEnd}
    />
  );
}
