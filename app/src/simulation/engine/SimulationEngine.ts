import {
  DisasterType,
  DisasterParameters,
  EarthquakeParameters,
  EruptionParameters,
  TimelineEvent,
  SimulationResult,
  ComputedState,
  EarthquakeComputedState,
  EruptionComputedState,
} from "../types";
import {
  computeEarthquakeState,
  generateEarthquakeTimeline,
  generateEarthquakeResult,
  calculateAutoDuration,
} from "../rules/earthquake";
import {
  computeEruptionState,
  generateEruptionTimeline,
  generateEruptionResult,
} from "../rules/eruption";

// ===== SIMULATION ENGINE =====

export interface SimulationConfig {
  disasterType: DisasterType;
  scenario: string;
  parameters: DisasterParameters;
}

export interface SimulationSnapshot {
  currentTime: number;
  totalDuration: number;
  progress: number;           // 0-1
  activeEvents: TimelineEvent[];
  currentPhase: string;
  computedState: ComputedState;
}

export class SimulationEngine {
  private config: SimulationConfig;
  private timeline: TimelineEvent[];
  private computedState: ComputedState;
  private totalDuration: number;

  constructor(config: SimulationConfig) {
    this.config = config;
    this.computedState = this.computeState();
    this.timeline = this.generateTimeline();
    this.totalDuration = this.calculateDuration();
  }

  // --- Compute initial state from parameters ---
  private computeState(): ComputedState {
    if (this.config.disasterType === "earthquake") {
      return computeEarthquakeState(this.config.parameters as EarthquakeParameters);
    } else {
      return computeEruptionState(this.config.parameters as EruptionParameters);
    }
  }

  // --- Generate full timeline ---
  private generateTimeline(): TimelineEvent[] {
    if (this.config.disasterType === "earthquake") {
      return generateEarthquakeTimeline(
        this.config.parameters as EarthquakeParameters,
        this.computedState as EarthquakeComputedState
      );
    } else {
      return generateEruptionTimeline(
        this.config.parameters as EruptionParameters,
        this.computedState as EruptionComputedState
      );
    }
  }

  // --- Calculate total duration ---
  private calculateDuration(): number {
    if (this.config.disasterType === "earthquake") {
      const p = this.config.parameters as EarthquakeParameters;
      return calculateAutoDuration(p.magnitude, p.depth);
    }
    return 60;
  }

  // --- Get snapshot at a given time ---
  getSnapshot(currentTime: number): SimulationSnapshot {
    const clampedTime = Math.max(0, Math.min(currentTime, this.totalDuration));

    // Find active events (events whose time window contains currentTime)
    const activeEvents = this.timeline.filter((event) => {
      const endTime = event.endTime ?? event.time + 2;
      return clampedTime >= event.time && clampedTime < endTime;
    });

    // Determine current phase from the latest active event
    const currentPhase =
      activeEvents.length > 0
        ? activeEvents[activeEvents.length - 1].phase
        : clampedTime >= this.totalDuration
        ? "Simulasi Selesai"
        : "Menunggu";

    return {
      currentTime: clampedTime,
      totalDuration: this.totalDuration,
      progress: clampedTime / this.totalDuration,
      activeEvents,
      currentPhase,
      computedState: this.computedState,
    };
  }

  // --- Get all active animations at a given time ---
  getActiveAnimations(currentTime: number): string[] {
    const snapshot = this.getSnapshot(currentTime);
    const animations = new Set<string>();
    snapshot.activeEvents.forEach((event) => {
      event.animations.forEach((anim) => animations.add(anim));
    });
    return Array.from(animations);
  }

  // --- Get educational overlay at a given time ---
  getActiveOverlay(currentTime: number): TimelineEvent["educationalOverlay"] | null {
    const snapshot = this.getSnapshot(currentTime);
    // Return the most recent overlay
    for (let i = snapshot.activeEvents.length - 1; i >= 0; i--) {
      if (snapshot.activeEvents[i].educationalOverlay) {
        return snapshot.activeEvents[i].educationalOverlay;
      }
    }
    return null;
  }

  // --- Generate simulation result ---
  getResult(): SimulationResult {
    if (this.config.disasterType === "earthquake") {
      return generateEarthquakeResult(
        this.config.parameters as EarthquakeParameters,
        this.computedState as EarthquakeComputedState,
        this.config.scenario
      );
    } else {
      return generateEruptionResult(
        this.config.parameters as EruptionParameters,
        this.computedState as EruptionComputedState,
        this.config.scenario
      );
    }
  }

  // --- Accessors ---
  getTimeline(): TimelineEvent[] {
    return this.timeline;
  }

  getComputedState(): ComputedState {
    return this.computedState;
  }

  getTotalDuration(): number {
    return this.totalDuration;
  }

  getConfig(): SimulationConfig {
    return this.config;
  }
}
