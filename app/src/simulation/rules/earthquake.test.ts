import { describe, it, expect } from "vitest";
import {
  calculateAutoDuration,
  computeEarthquakeState,
} from "./earthquake";
import { EarthquakeParameters } from "../types";

describe("Earthquake Simulation Rules", () => {
  describe("calculateAutoDuration", () => {
    it("should clamp duration between 8 and 90 seconds", () => {
      // Very small, deep earthquake
      const minDuration = calculateAutoDuration(3.0, 100);
      expect(minDuration).toBeGreaterThanOrEqual(8);

      // Massive, shallow earthquake
      const maxDuration = calculateAutoDuration(9.5, 5);
      expect(maxDuration).toBeLessThanOrEqual(90);
    });

    it("should produce longer duration for higher magnitude", () => {
      const d1 = calculateAutoDuration(5.0, 20);
      const d2 = calculateAutoDuration(7.5, 20);
      expect(d2).toBeGreaterThan(d1);
    });

    it("should produce longer shaking for shallow events compared to deep events with same magnitude", () => {
      const shallow = calculateAutoDuration(6.5, 10);
      const deep = calculateAutoDuration(6.5, 80);
      expect(shallow).toBeGreaterThanOrEqual(deep);
    });
  });

  describe("computeEarthquakeState", () => {
    it("should compute realistic PGA and MMI for moderate earthquake", () => {
      const params: EarthquakeParameters = {
        magnitude: 6.0,
        depth: 15,
        duration: 30,
        environment: "urban",
        location: "Bandung, Jawa Barat",
      };

      const state = computeEarthquakeState(params);

      expect(state.pgaG).toBeGreaterThan(0.01);
      expect(state.pgaG).toBeLessThanOrEqual(1.8);
      expect(typeof state.mmiScale).toBe("string");
      expect(state.mmiScale?.length).toBeGreaterThan(0);
      expect(typeof state.shakingIntensity).toBe("string");
      expect(typeof state.damageLevel).toBe("string");
    });

    it("should identify tsunami risk for shallow coastal megathrust", () => {
      const tsunamiParams: EarthquakeParameters = {
        magnitude: 7.8,
        depth: 20,
        duration: 45,
        environment: "coastal",
        location: "Pesisir Barat Sumatera",
      };

      const state = computeEarthquakeState(tsunamiParams);
      expect(state.tsunamiPotential).toBe(true);
      expect(state.tsunamiHeight).toBeGreaterThan(0);
    });

    it("should not trigger tsunami for inland urban earthquakes", () => {
      const inlandParams: EarthquakeParameters = {
        magnitude: 7.8,
        depth: 10,
        duration: 40,
        environment: "urban",
        location: "Kota Padang",
      };

      const state = computeEarthquakeState(inlandParams);
      expect(state.tsunamiPotential).toBe(false);
      expect(state.tsunamiHeight).toBe(0);
    });

    it("should flag liquefaction risk for strong shallow events in urban/coastal loose soils", () => {
      const liquefactionParams: EarthquakeParameters = {
        magnitude: 7.5,
        depth: 10,
        duration: 35,
        environment: "urban",
        location: "Palu, Sulawesi Tengah",
      };

      const state = computeEarthquakeState(liquefactionParams);
      expect(state.liquefactionPotential).toBe(true);
    });

    it("should compute positive S-P arrival wave gap", () => {
      const params: EarthquakeParameters = {
        magnitude: 5.5,
        depth: 30,
        duration: 25,
        environment: "rural",
        location: "Sesar Tarera Aiduna, Papua",
      };

      const state = computeEarthquakeState(params);
      expect(state.spIntervalSeconds).toBeGreaterThan(1.0);
    });
  });
});
