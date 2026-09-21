// Simulation Engine - barrel export
export { SimulationEngine } from "./engine/SimulationEngine";
export type { SimulationConfig, SimulationSnapshot } from "./engine/SimulationEngine";

// Rules
export { computeEarthquakeState, generateEarthquakeTimeline, generateEarthquakeResult, calculateAutoDuration } from "./rules/earthquake";
export { computeEruptionState, generateEruptionTimeline, generateEruptionResult } from "./rules/eruption";

// Types
export type {
  DisasterType,
  SimulationState,
  PlaybackSpeed,
  EarthquakeParameters,
  EruptionParameters,
  DisasterParameters,
  TimelineEvent,
  Impact,
  SimulationResult,
  ScenarioDefinition,
  QuizQuestion,
  ComputedState,
  EarthquakeComputedState,
  EruptionComputedState,
  EducationalOverlay,
  MitigationAction,
} from "./types";
