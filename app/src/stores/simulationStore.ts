import { create } from "zustand";
import {
  DisasterType,
  DisasterParameters,
  SimulationState,
  PlaybackSpeed,
  TimelineEvent,
  SimulationResult,
  ComputedState,
} from "@/simulation/types";
import { SimulationEngine } from "@/simulation/engine/SimulationEngine";

// ===== SIMULATION STORE =====

interface SimulationStore {
  // Selection
  disasterType: DisasterType | null;
  scenarioId: string | null;
  parameters: DisasterParameters | null;

  // Engine
  engine: SimulationEngine | null;
  computedState: ComputedState | null;

  // Simulation state
  simulationState: SimulationState;
  currentTime: number;
  totalDuration: number;
  playbackSpeed: PlaybackSpeed;
  activeEvents: TimelineEvent[];
  currentPhase: string;
  timeline: TimelineEvent[];

  // Results
  result: SimulationResult | null;

  // Actions - Selection
  setDisasterType: (type: DisasterType) => void;
  setScenario: (scenarioId: string) => void;
  setParameters: (params: DisasterParameters) => void;

  // Actions - Engine
  initializeEngine: () => void;

  // Actions - Simulation Control
  startSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  restartSimulation: () => void;
  setPlaybackSpeed: (speed: PlaybackSpeed) => void;
  tick: (deltaTime: number) => void;

  // Actions - Reset
  reset: () => void;
}

const initialState = {
  disasterType: null as DisasterType | null,
  scenarioId: null as string | null,
  parameters: null as DisasterParameters | null,
  engine: null as SimulationEngine | null,
  computedState: null as ComputedState | null,
  simulationState: "idle" as SimulationState,
  currentTime: 0,
  totalDuration: 30,
  playbackSpeed: 1 as PlaybackSpeed,
  activeEvents: [] as TimelineEvent[],
  currentPhase: "",
  timeline: [] as TimelineEvent[],
  result: null as SimulationResult | null,
};

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  ...initialState,

  setDisasterType: (type) =>
    set({
      disasterType: type,
      scenarioId: null,
      parameters: null,
      engine: null,
      simulationState: "idle",
    }),

  setScenario: (scenarioId) => set({ scenarioId }),

  setParameters: (params) => set({ parameters: params }),

  initializeEngine: () => {
    const { disasterType, scenarioId, parameters } = get();
    if (!disasterType || !scenarioId || !parameters) return;

    const engine = new SimulationEngine({
      disasterType,
      scenario: scenarioId,
      parameters,
    });

    set({
      engine,
      timeline: engine.getTimeline(),
      totalDuration: engine.getTotalDuration(),
      computedState: engine.getComputedState(),
      currentTime: 0,
      simulationState: "idle",
      result: null,
    });
  },

  startSimulation: () => {
    const { engine } = get();
    if (!engine) {
      get().initializeEngine();
    }
    set({
      simulationState: "running",
      currentTime: 0,
      result: null,
      currentPhase: "",
    });
  },

  pauseSimulation: () => set({ simulationState: "paused" }),

  resumeSimulation: () => set({ simulationState: "running" }),

  restartSimulation: () => {
    set({
      simulationState: "running",
      currentTime: 0,
      activeEvents: [],
      result: null,
      currentPhase: "",
    });
  },

  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),

  tick: (deltaTime) => {
    const { engine, currentTime, totalDuration, playbackSpeed, simulationState } = get();
    if (!engine || simulationState !== "running") return;

    const newTime = currentTime + deltaTime * playbackSpeed;

    if (newTime >= totalDuration) {
      const result = engine.getResult();
      set({
        currentTime: totalDuration,
        simulationState: "completed",
        result,
        activeEvents: [],
        currentPhase: "Simulasi Selesai",
      });
      return;
    }

    const snapshot = engine.getSnapshot(newTime);
    set({
      currentTime: newTime,
      activeEvents: snapshot.activeEvents,
      currentPhase: snapshot.currentPhase,
    });
  },

  reset: () => set(initialState),
}));
