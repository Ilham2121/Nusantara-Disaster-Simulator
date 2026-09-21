import { describe, it, expect, beforeEach } from "vitest";
import { useSimulationStore } from "./simulationStore";
import { earthquakeScenarios } from "@/data/scenarios";
import { EarthquakeParameters } from "@/simulation/types";

describe("SimulationStore (Zustand)", () => {
  beforeEach(() => {
    useSimulationStore.getState().reset();
  });

  it("should initialize with default idle state", () => {
    const state = useSimulationStore.getState();
    expect(state.simulationState).toBe("idle");
    expect(state.currentTime).toBe(0);
    expect(state.playbackSpeed).toBe(1);
    expect(state.engine).toBeNull();
    expect(state.result).toBeNull();
  });

  it("should set disasterType and initialize engine properly", () => {
    const store = useSimulationStore.getState();
    const scenario = earthquakeScenarios[0];

    store.setDisasterType(scenario.disasterType);
    store.setScenario(scenario.id);
    store.setParameters(scenario.defaultParameters);
    store.initializeEngine();

    const updated = useSimulationStore.getState();
    expect(updated.disasterType).toBe("earthquake");
    expect(updated.scenarioId).toBe(scenario.id);
    expect(updated.engine).not.toBeNull();
    expect(updated.totalDuration).toBeGreaterThan(0);
    expect(updated.timeline.length).toBeGreaterThan(0);
  });

  it("should transition states: start -> pause -> resume -> restart", () => {
    const store = useSimulationStore.getState();
    const scenario = earthquakeScenarios[0];

    store.setDisasterType(scenario.disasterType);
    store.setScenario(scenario.id);
    store.setParameters(scenario.defaultParameters);
    store.initializeEngine();

    store.startSimulation();
    expect(useSimulationStore.getState().simulationState).toBe("running");

    store.pauseSimulation();
    expect(useSimulationStore.getState().simulationState).toBe("paused");

    store.resumeSimulation();
    expect(useSimulationStore.getState().simulationState).toBe("running");

    store.restartSimulation();
    expect(useSimulationStore.getState().simulationState).toBe("running");
    expect(useSimulationStore.getState().currentTime).toBe(0);
  });

  it("should update playback speed correctly", () => {
    const store = useSimulationStore.getState();
    store.setPlaybackSpeed(2);
    expect(useSimulationStore.getState().playbackSpeed).toBe(2);

    store.setPlaybackSpeed(4);
    expect(useSimulationStore.getState().playbackSpeed).toBe(4);
  });

  it("should advance time on tick and mark completed when time exceeds totalDuration", () => {
    const store = useSimulationStore.getState();
    const scenario = earthquakeScenarios[0];

    store.setDisasterType(scenario.disasterType);
    store.setScenario(scenario.id);
    store.setParameters(scenario.defaultParameters as EarthquakeParameters);
    store.initializeEngine();
    store.startSimulation();

    // Advance by 1 second
    store.tick(1.0);
    expect(useSimulationStore.getState().currentTime).toBeCloseTo(1.0, 1);
    expect(useSimulationStore.getState().simulationState).toBe("running");

    // Advance beyond total duration
    const total = useSimulationStore.getState().totalDuration;
    store.tick(total + 5);

    const completedState = useSimulationStore.getState();
    expect(completedState.simulationState).toBe("completed");
    expect(completedState.currentTime).toBe(total);
    expect(completedState.result).not.toBeNull();
    expect(completedState.result?.impacts.length).toBeGreaterThan(0);
  });
});
