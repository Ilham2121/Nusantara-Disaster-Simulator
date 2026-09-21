import { describe, it, expect } from "vitest";
import { GET } from "./route";

describe("Seismic Ticker API Route (/api/seismic-ticker)", () => {
  it("should return valid JSON with events, source, and updatedAt", async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty("events");
    expect(body).toHaveProperty("source");
    expect(body).toHaveProperty("updatedAt");

    expect(Array.isArray(body.events)).toBe(true);
    expect(body.events.length).toBeGreaterThan(0);

    // Verify properties of first event
    const firstEvent = body.events[0];
    expect(firstEvent).toHaveProperty("mag");
    expect(firstEvent).toHaveProperty("loc");
    expect(firstEvent).toHaveProperty("depth");
    expect(firstEvent).toHaveProperty("time");

    // Magnitude should be a parseable number
    const mag = parseFloat(firstEvent.mag);
    expect(Number.isNaN(mag)).toBe(false);
    expect(mag).toBeGreaterThan(0);
  });
});
