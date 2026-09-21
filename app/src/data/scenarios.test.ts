import { describe, it, expect } from "vitest";
import {
  earthquakeScenarios,
  eruptionScenarios,
  allScenarios,
  getScenarioById,
} from "./scenarios";

describe("Scenario Catalog & Data Integrity", () => {
  it("should contain predefined earthquake and eruption scenarios", () => {
    expect(earthquakeScenarios.length).toBeGreaterThan(0);
    expect(eruptionScenarios.length).toBeGreaterThan(0);
    expect(allScenarios.length).toBe(earthquakeScenarios.length + eruptionScenarios.length);
  });

  it("should retrieve scenario by ID correctly", () => {
    const lembanScenario = getScenarioById("eq-urban");
    expect(lembanScenario).toBeDefined();
    expect(lembanScenario?.disasterType).toBe("earthquake");

    const merapiScenario = getScenarioById("er-merapi");
    expect(merapiScenario).toBeDefined();
    expect(merapiScenario?.disasterType).toBe("eruption");
  });

  it("should return undefined for non-existent scenario ID", () => {
    const unknown = getScenarioById("non-existent-xyz");
    expect(unknown).toBeUndefined();
  });

  it("all scenarios should have valid default parameters and realistic ranges", () => {
    for (const sc of allScenarios) {
      expect(sc.id).toBeTruthy();
      expect(sc.name).toBeTruthy();
      expect(sc.location).toBeTruthy();
      expect(sc.defaultParameters).toBeDefined();

      if (sc.disasterType === "earthquake") {
        const p = sc.defaultParameters as any;
        expect(p.magnitude).toBeGreaterThanOrEqual(4.0);
        expect(p.magnitude).toBeLessThanOrEqual(9.5);
        expect(p.depth).toBeGreaterThanOrEqual(1);
      } else {
        const p = sc.defaultParameters as any;
        expect(p.settlementDistance).toBeGreaterThan(0);
        expect(["normal", "advisory", "watch", "warning"]).toContain(p.activityLevel);
      }
    }
  });
});
