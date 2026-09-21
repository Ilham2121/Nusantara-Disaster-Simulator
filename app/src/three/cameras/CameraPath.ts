import * as THREE from "three";

export interface CameraKeyframe {
  progress: number;
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
}

/**
 * Interpolate between two keyframes using smooth cubic easing.
 */
function smoothStep(t: number): number {
  return t * t * (3 - 2 * t);
}

/**
 * Find the surrounding keyframes for a given progress value
 * and interpolate camera state.
 */
export function interpolateCameraPath(
  keyframes: CameraKeyframe[],
  progress: number
): { position: THREE.Vector3; target: THREE.Vector3; fov: number } {
  if (keyframes.length === 0) {
    return {
      position: new THREE.Vector3(24, 18, 24),
      target: new THREE.Vector3(0, 2, 0),
      fov: 45,
    };
  }

  // Clamp progress
  const p = Math.max(0, Math.min(1, progress));

  // Find surrounding keyframes
  let startIdx = 0;
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (keyframes[i + 1].progress > p) {
      startIdx = i;
      break;
    }
    startIdx = i;
  }
  const endIdx = Math.min(startIdx + 1, keyframes.length - 1);

  const kfStart = keyframes[startIdx];
  const kfEnd = keyframes[endIdx];

  if (startIdx === endIdx || kfEnd.progress <= kfStart.progress) {
    return {
      position: kfStart.position.clone(),
      target: kfStart.target.clone(),
      fov: kfStart.fov,
    };
  }

  // Local 0-1 between the two keyframes
  const localT = smoothStep((p - kfStart.progress) / (kfEnd.progress - kfStart.progress));

  return {
    position: kfStart.position.clone().lerp(kfEnd.position, localT),
    target: kfStart.target.clone().lerp(kfEnd.target, localT),
    fov: kfStart.fov + (kfEnd.fov - kfStart.fov) * localT,
  };
}

/**
 * Earthquake cinematic camera script.
 * Moves through distinct viewpoints synchronized with seismic phases.
 */
export const earthquakeCameraScript: CameraKeyframe[] = [
  // Pre-simulation: wide establishing shot
  {
    progress: 0,
    position: new THREE.Vector3(28, 20, 28),
    target: new THREE.Vector3(0, 2, 0),
    fov: 45,
  },
  // P-wave arrival: slight zoom in, observing from above
  {
    progress: 0.08,
    position: new THREE.Vector3(22, 16, 22),
    target: new THREE.Vector3(0, 3, 0),
    fov: 44,
  },
  // S-wave peak: dolly to street level, close to buildings
  {
    progress: 0.2,
    position: new THREE.Vector3(8, 5, 14),
    target: new THREE.Vector3(0, 3, 0),
    fov: 52,
  },
  // Surface wave peak: orbit to see wide damage spread
  {
    progress: 0.4,
    position: new THREE.Vector3(-12, 12, 18),
    target: new THREE.Vector3(0, 2, 0),
    fov: 54,
  },
  // Peak intensity: dramatic low angle
  {
    progress: 0.55,
    position: new THREE.Vector3(3, 3.5, 10),
    target: new THREE.Vector3(2, 4, -2),
    fov: 56,
  },
  // Shaking subsides: pull back to survey
  {
    progress: 0.72,
    position: new THREE.Vector3(18, 14, 20),
    target: new THREE.Vector3(0, 2, 0),
    fov: 48,
  },
  // Post-earthquake: slow orbit overview
  {
    progress: 0.88,
    position: new THREE.Vector3(24, 18, 24),
    target: new THREE.Vector3(0, 2, 0),
    fov: 45,
  },
  // End: final wide shot
  {
    progress: 1.0,
    position: new THREE.Vector3(28, 20, 28),
    target: new THREE.Vector3(0, 2, 0),
    fov: 42,
  },
];

/**
 * Eruption cinematic camera script.
 * Focuses on crater, then tracks flow down slopes, then surveys settlement.
 */
export const eruptionCameraScript: CameraKeyframe[] = [
  // Pre-eruption: wide establishing shot showing full mountain
  {
    progress: 0,
    position: new THREE.Vector3(30, 18, 20),
    target: new THREE.Vector3(0, 10, -10),
    fov: 45,
  },
  // Pre-eruption signs: zoom toward crater
  {
    progress: 0.08,
    position: new THREE.Vector3(12, 22, 8),
    target: new THREE.Vector3(0, 20, -16),
    fov: 40,
  },
  // Eruption blast: dramatic close-up of crater explosion
  {
    progress: 0.15,
    position: new THREE.Vector3(8, 26, 0),
    target: new THREE.Vector3(0, 22, -17),
    fov: 55,
  },
  // Ash column rise: pull back to see column scale
  {
    progress: 0.28,
    position: new THREE.Vector3(25, 20, 15),
    target: new THREE.Vector3(0, 18, -15),
    fov: 48,
  },
  // Lava/pyroclastic flow: track down slope
  {
    progress: 0.42,
    position: new THREE.Vector3(10, 8, 5),
    target: new THREE.Vector3(2, 5, -5),
    fov: 52,
  },
  // Ash reaches settlement: focus on village
  {
    progress: 0.58,
    position: new THREE.Vector3(-14, 6, 12),
    target: new THREE.Vector3(-8, 2, 8),
    fov: 50,
  },
  // Impact survey: wide view of damage
  {
    progress: 0.75,
    position: new THREE.Vector3(20, 12, 18),
    target: new THREE.Vector3(0, 4, 0),
    fov: 46,
  },
  // Response phase: overview
  {
    progress: 0.9,
    position: new THREE.Vector3(28, 18, 22),
    target: new THREE.Vector3(0, 8, -8),
    fov: 44,
  },
  // End: final establishing shot
  {
    progress: 1.0,
    position: new THREE.Vector3(32, 22, 26),
    target: new THREE.Vector3(0, 8, -10),
    fov: 42,
  },
];

/**
 * Coastal earthquake script (with tsunami sequence).
 */
export const coastalCameraScript: CameraKeyframe[] = [
  {
    progress: 0,
    position: new THREE.Vector3(24, 16, 20),
    target: new THREE.Vector3(0, 2, 5),
    fov: 45,
  },
  // Earthquake shaking: street level near coastal village
  {
    progress: 0.15,
    position: new THREE.Vector3(8, 4, 12),
    target: new THREE.Vector3(0, 2, 5),
    fov: 52,
  },
  // Sea drawback: camera turns toward ocean
  {
    progress: 0.4,
    position: new THREE.Vector3(5, 6, 0),
    target: new THREE.Vector3(0, 0, -15),
    fov: 50,
  },
  // Tsunami approach: tracking the wave
  {
    progress: 0.6,
    position: new THREE.Vector3(18, 8, -5),
    target: new THREE.Vector3(0, 3, -10),
    fov: 55,
  },
  // Tsunami impact: close to shore
  {
    progress: 0.75,
    position: new THREE.Vector3(12, 5, 8),
    target: new THREE.Vector3(0, 2, 0),
    fov: 58,
  },
  // Post-tsunami survey
  {
    progress: 0.9,
    position: new THREE.Vector3(24, 16, 20),
    target: new THREE.Vector3(0, 2, 5),
    fov: 44,
  },
  {
    progress: 1.0,
    position: new THREE.Vector3(28, 18, 24),
    target: new THREE.Vector3(0, 2, 5),
    fov: 42,
  },
];
