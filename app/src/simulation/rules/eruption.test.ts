import { describe, it, expect } from "vitest";
import {
  computeEruptionState,
  generateEruptionTimeline,
} from "./eruption";
import { EruptionParameters } from "../types";

describe("Volcanic Eruption Simulation Rules", () => {
  describe("computeEruptionState", () => {
    it("should compute higher intensity for explosive eruptions at Awas (Level IV)", () => {
      const explosiveAwas: EruptionParameters = {
        eruptionType: "explosive",
        activityLevel: "warning",
        settlementDistance: 5,
        volcano: "Gunung Merapi",
        ashDirection: "west",
      };

      const effusiveNormal: EruptionParameters = {
        eruptionType: "effusive",
        activityLevel: "normal",
        settlementDistance: 15,
        volcano: "Gunung Semeru",
        ashDirection: "east",
      };

      const stateExplosive = computeEruptionState(explosiveAwas);
      const stateEffusive = computeEruptionState(effusiveNormal);

      expect(stateExplosive.eruptionIntensity).toBeGreaterThan(stateEffusive.eruptionIntensity);
      expect(stateExplosive.ashColumnHeight).toBeGreaterThan(stateEffusive.ashColumnHeight);
      expect(stateExplosive.pyroclasticRisk).toBeGreaterThan(stateEffusive.pyroclasticRisk);
    });

    it("should assign critical or high evacuation urgency when intensity is high and settlement is close", () => {
      const highDanger: EruptionParameters = {
        eruptionType: "explosive",
        activityLevel: "warning",
        settlementDistance: 4,
        volcano: "Gunung Sinabung",
        ashDirection: "south",
      };

      const state = computeEruptionState(highDanger);
      expect(["critical", "high"]).toContain(state.evacuationUrgency);
    });

    it("should have higher lava flow speed in effusive eruptions than explosive ones", () => {
      const effusiveParams: EruptionParameters = {
        eruptionType: "effusive",
        activityLevel: "watch",
        settlementDistance: 10,
        volcano: "Gunung Bromo",
        ashDirection: "north",
      };

      const explosiveParams: EruptionParameters = {
        eruptionType: "explosive",
        activityLevel: "watch",
        settlementDistance: 10,
        volcano: "Gunung Kelud",
        ashDirection: "north",
      };

      const effusiveState = computeEruptionState(effusiveParams);
      const explosiveState = computeEruptionState(explosiveParams);

      expect(effusiveState.lavaFlowSpeed).toBeGreaterThan(explosiveState.lavaFlowSpeed);
    });
  });

  describe("generateEruptionTimeline", () => {
    it("should generate a sequential timeline with educational overlays", () => {
      const params: EruptionParameters = {
        eruptionType: "explosive",
        activityLevel: "warning",
        settlementDistance: 6,
        volcano: "Gunung Anak Krakatau",
        ashDirection: "west",
      };

      const state = computeEruptionState(params);
      const timeline = generateEruptionTimeline(params, state);

      expect(timeline.length).toBeGreaterThan(0);

      // Verify time ordering
      for (let i = 0; i < timeline.length - 1; i++) {
        expect(timeline[i].time).toBeLessThanOrEqual(timeline[i + 1].time);
      }

      // Check presence of educational overlay
      const hasEducationalOverlay = timeline.some((event) => Boolean(event.educationalOverlay));
      expect(hasEducationalOverlay).toBe(true);
    });
  });
});
