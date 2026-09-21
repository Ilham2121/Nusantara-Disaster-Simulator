import { useFrame } from "@react-three/fiber";
import { useSimulationStore } from "@/stores/simulationStore";

/**
 * useTimelineSync
 * Synchronizes R3F render loop delta time with the SimulationEngine tick.
 * Clamps delta to 0.1s to prevent huge jumps when browser tab is inactive.
 */
export function useTimelineSync() {
  const tick = useSimulationStore((state) => state.tick);
  const simulationState = useSimulationStore((state) => state.simulationState);

  useFrame((_, delta) => {
    if (simulationState === "running") {
      // Clamp delta to avoid animation jumping on frame drops / tab switches
      const safeDelta = Math.min(delta, 0.1);
      tick(safeDelta);
    }
  });
}
