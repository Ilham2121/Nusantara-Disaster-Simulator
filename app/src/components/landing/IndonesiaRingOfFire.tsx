"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  INDONESIA_ISLANDS,
  PB2002_BOUNDARIES,
} from "@/data/tectonics/indonesiaGeoData";
import {
  ACTIVE_FAULTS,
  REAL_VOLCANOES,
  REAL_EARTHQUAKES,
  PLATE_VECTORS,
  VolcanoFeature,
  ActiveFault,
  SeismicEventFeature,
} from "@/data/tectonics/hazardCatalog";

// Bounding box for Indonesian archipelago (cartographically bounded)
const MIN_LON = 94.5;
const MAX_LON = 141.5;
const MIN_LAT = -11.5;
const MAX_LAT = 6.5;

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
  color: string;
}

interface HoverInfo {
  type: "volcano" | "fault" | "earthquake";
  title: string;
  subtitle: string;
  coords: string;
  metric1: { label: string; value: string };
  metric2: { label: string; value: string };
  badge?: string;
  screenX: number;
  screenY: number;
}

export function IndonesiaRingOfFire() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const ripplesRef = useRef<Ripple[]>([]);
  const timeRef = useRef<number>(0);

  // Layer toggles
  const [showPlates, setShowPlates] = useState(true);
  const [showFaults, setShowFaults] = useState(true);
  const [showVolcanoes, setShowVolcanoes] = useState(true);
  const [showEarthquakes, setShowEarthquakes] = useState(true);
  const [showVectors, setShowVectors] = useState(true);

  // Interaction telemetry states
  const [cursorCoords, setCursorCoords] = useState<{ lon: number; lat: number } | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<HoverInfo | null>(null);

  // Direct ref for 60fps canvas drawing without triggering React re-renders or effect recreation
  const cursorCoordsRef = useRef<{ lon: number; lat: number } | null>(null);
  const lastMouseMoveTimeRef = useRef<number>(0);
  const lastProximityTimeRef = useRef<number>(0);

  // Refs for animation loop access without recreating loop
  const layersRef = useRef({
    showPlates,
    showFaults,
    showVolcanoes,
    showEarthquakes,
    showVectors,
  });

  useEffect(() => {
    layersRef.current = {
      showPlates,
      showFaults,
      showVolcanoes,
      showEarthquakes,
      showVectors,
    };
  }, [showPlates, showFaults, showVolcanoes, showEarthquakes, showVectors]);

  // Transform geo coordinates [lon, lat] to canvas pixels
  const getProjection = useCallback((w: number, h: number) => {
    const padX = 24;
    const padY = 24;
    const availW = w - padX * 2;
    const availH = h - padY * 2;

    const lonSpan = MAX_LON - MIN_LON;
    const latSpan = MAX_LAT - MIN_LAT;

    // Equirectangular projection ratio: 1° lon = 1° lat near equator
    const scaleX = availW / lonSpan;
    const scaleY = availH / latSpan;
    const scale = Math.min(scaleX, scaleY);

    const mapW = lonSpan * scale;
    const mapH = latSpan * scale;
    const offsetX = padX + (availW - mapW) / 2;
    const offsetY = padY + (availH - mapH) / 2;

    const project = (lon: number, lat: number): [number, number] => {
      const x = offsetX + (lon - MIN_LON) * scale;
      const y = offsetY + (MAX_LAT - lat) * scale;
      return [x, y];
    };

    const unproject = (x: number, y: number): [number, number] => {
      const lon = MIN_LON + (x - offsetX) / scale;
      const lat = MAX_LAT - (y - offsetY) / scale;
      return [lon, lat];
    };

    return { project, unproject, scale, mapW, mapH, offsetX, offsetY };
  }, []);

  // Pre-project island polygon paths for performance
  const islandPathsCache = useRef<Path2D[]>([]);
  const cachedDimensions = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  const updatePathCache = useCallback((w: number, h: number) => {
    const { project } = getProjection(w, h);
    const paths: Path2D[] = [];

    INDONESIA_ISLANDS.forEach((island) => {
      if (!island.c || island.c.length < 3) return;
      const path = new Path2D();
      const [startLon, startLat] = island.c[0];
      const [sx, sy] = project(startLon, startLat);
      path.moveTo(sx, sy);

      for (let i = 1; i < island.c.length; i++) {
        const [lon, lat] = island.c[i];
        const [x, y] = project(lon, lat);
        path.lineTo(x, y);
      }
      path.closePath();
      paths.push(path);
    });

    islandPathsCache.current = paths;
    cachedDimensions.current = { w, h };
  }, [getProjection]);

  // Proximity detection for features (supports both mouse hover and mobile touch)
  const findFeatureAt = useCallback(
    (clientX: number, clientY: number, width: number, height: number, customThreshold = 14): HoverInfo | null => {
      const { project } = getProjection(width, height);
      let found: HoverInfo | null = null;
      const threshold = customThreshold;

      if (layersRef.current.showVolcanoes) {
        for (const v of REAL_VOLCANOES) {
          const [vx, vy] = project(v.coords[0], v.coords[1]);
          const dist = Math.hypot(clientX - vx, clientY - vy);
          if (dist <= threshold) {
            return {
              type: "volcano",
              title: v.name,
              subtitle: v.location,
              coords: `${Math.abs(v.coords[1]).toFixed(2)}°${v.coords[1] >= 0 ? "LU" : "LS"}, ${v.coords[0].toFixed(2)}°BT`,
              metric1: { label: "Elevasi", value: `${v.elevationM.toLocaleString()} m dpl` },
              metric2: { label: "Erupsi Terakhir", value: `${v.lastMajorYear}` },
              badge: `Status: ${v.statusLevel}`,
              screenX: clientX,
              screenY: clientY,
            };
          }
        }
      }

      if (!found && layersRef.current.showEarthquakes) {
        for (const eq of REAL_EARTHQUAKES) {
          const [ex, ey] = project(eq.coords[0], eq.coords[1]);
          const dist = Math.hypot(clientX - ex, clientY - ey);
          if (dist <= threshold) {
            return {
              type: "earthquake",
              title: eq.title,
              subtitle: eq.date,
              coords: `${Math.abs(eq.coords[1]).toFixed(2)}°${eq.coords[1] >= 0 ? "LU" : "LS"}, ${eq.coords[0].toFixed(2)}°BT`,
              metric1: { label: "Magnitudo", value: `M ${eq.magnitude.toFixed(1)}` },
              metric2: { label: "Kedalaman", value: `${eq.depthKm} km (${eq.depthCategory})` },
              badge: eq.mechanism,
              screenX: clientX,
              screenY: clientY,
            };
          }
        }
      }

      if (!found && layersRef.current.showFaults) {
        for (const fault of ACTIVE_FAULTS) {
          for (let i = 0; i < fault.coords.length - 1; i++) {
            const [p1x, p1y] = project(fault.coords[i][0], fault.coords[i][1]);
            const [p2x, p2y] = project(fault.coords[i + 1][0], fault.coords[i + 1][1]);

            const minX = Math.min(p1x, p2x) - 10;
            const maxX = Math.max(p1x, p2x) + 10;
            const minY = Math.min(p1y, p2y) - 10;
            const maxY = Math.max(p1y, p2y) + 10;
            if (clientX < minX || clientX > maxX || clientY < minY || clientY > maxY) continue;

            const l2 = (p2x - p1x) ** 2 + (p2y - p1y) ** 2;
            let t = ((clientX - p1x) * (p2x - p1x) + (clientY - p1y) * (p2y - p1y)) / l2;
            t = Math.max(0, Math.min(1, t));
            const projX = p1x + t * (p2x - p1x);
            const projY = p1y + t * (p2y - p1y);
            const dist = Math.hypot(clientX - projX, clientY - projY);

            if (dist <= Math.max(10, threshold - 4)) {
              return {
                type: "fault",
                title: fault.name,
                subtitle: `Pulau ${fault.island}`,
                coords: `${fault.type.toUpperCase()} FAULT`,
                metric1: { label: "Laju Geser", value: `~${fault.slipRateMmYear} mm/th` },
                metric2: { label: "Potensi Maksimal", value: `Mw ${fault.maxMagnitude}` },
                badge: fault.description.slice(0, 48) + "...",
                screenX: clientX,
                screenY: clientY,
              };
            }
          }
        }
      }

      return null;
    },
    [getProjection]
  );

  // Handle Mouse Move with high-performance ref writing & throttled React updates
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const { unproject } = getProjection(rect.width, rect.height);
    const [lon, lat] = unproject(clientX, clientY);

    if (lon >= MIN_LON - 2 && lon <= MAX_LON + 2 && lat >= MIN_LAT - 2 && lat <= MAX_LAT + 2) {
      cursorCoordsRef.current = { lon, lat };
    } else {
      cursorCoordsRef.current = null;
    }

    const now = performance.now();

    // Throttle React state update for coordinate text readout (max ~12 updates/sec)
    if (now - lastMouseMoveTimeRef.current > 80) {
      lastMouseMoveTimeRef.current = now;
      setCursorCoords(cursorCoordsRef.current ? { ...cursorCoordsRef.current } : null);
    }

    // Throttle complex proximity hit-testing (max ~20 checks/sec)
    if (now - lastProximityTimeRef.current > 50) {
      lastProximityTimeRef.current = now;
      const found = findFeatureAt(clientX, clientY, rect.width, rect.height, 14);
      setHoveredFeature(found);
    }
  }, [getProjection, findFeatureAt]);



  // Handle Touch on Mobile & Tablet
  const handleTouch = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const clientX = touch.clientX - rect.left;
      const clientY = touch.clientY - rect.top;

      const { unproject } = getProjection(rect.width, rect.height);
      const [lon, lat] = unproject(clientX, clientY);

      if (lon >= MIN_LON - 2 && lon <= MAX_LON + 2 && lat >= MIN_LAT - 2 && lat <= MAX_LAT + 2) {
        cursorCoordsRef.current = { lon, lat };
        setCursorCoords({ lon, lat });
      }

      // Slightly larger touch target threshold (22px) for mobile finger taps
      const found = findFeatureAt(clientX, clientY, rect.width, rect.height, 22);
      setHoveredFeature(found);
    },
    [getProjection, findFeatureAt]
  );

  const handleMouseLeave = useCallback(() => {
    cursorCoordsRef.current = null;
    setCursorCoords(null);
    setHoveredFeature(null);
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Cap DPR at 2 to avoid excessive mobile memory usage on 3x/4x screens
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      updatePathCache(w, h);
    };

    resize();
    window.addEventListener("resize", resize);

    // ResizeObserver for reliable dimension tracking across orientation changes and dynamic layout
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && canvas.parentElement) {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            const w = Math.round(width);
            const h = Math.round(height);
            if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
              canvas.width = Math.round(w * dpr);
              canvas.height = Math.round(h * dpr);
              ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
              updatePathCache(w, h);
            }
          }
        }
      });
      resizeObserver.observe(canvas.parentElement);
    }

    // Periodic ripple spawner
    const spawnRipple = (w: number, h: number) => {
      const { project } = getProjection(w, h);
      const isVolcano = Math.random() > 0.4;
      if (isVolcano) {
        const v = REAL_VOLCANOES[Math.floor(Math.random() * REAL_VOLCANOES.length)];
        const [x, y] = project(v.coords[0], v.coords[1]);
        ripplesRef.current.push({
          x,
          y,
          radius: 2,
          maxRadius: 35 + Math.random() * 25,
          opacity: 0.35,
          speed: 0.4 + Math.random() * 0.3,
          color: "232, 117, 74", // Orange-red volcano
        });
      } else {
        const eq = REAL_EARTHQUAKES[Math.floor(Math.random() * REAL_EARTHQUAKES.length)];
        const [x, y] = project(eq.coords[0], eq.coords[1]);
        const color =
          eq.depthCategory === "shallow"
            ? "217, 92, 92"
            : eq.depthCategory === "intermediate"
              ? "214, 168, 79"
              : "87, 199, 217";
        ripplesRef.current.push({
          x,
          y,
          radius: 2,
          maxRadius: 40 + Math.random() * 30,
          opacity: 0.4,
          speed: 0.5 + Math.random() * 0.3,
          color,
        });
      }
    };

    let rippleTimer = 0;

    // Draw Graticule Coordinate Grid (Latitude / Longitude)
    const drawGraticule = (
      w: number,
      h: number,
      project: (lon: number, lat: number) => [number, number]
    ) => {
      ctx.save();
      ctx.lineWidth = 0.5;
      ctx.font = '9px "Space Grotesk", monospace';
      ctx.fillStyle = "rgba(111, 123, 134, 0.45)";

      // Meridians (Longitude)
      for (let lon = 95; lon <= 140; lon += 5) {
        const [x1, y1] = project(lon, MAX_LAT);
        const [x2, y2] = project(lon, MIN_LAT);

        ctx.strokeStyle = lon % 10 === 0 ? "rgba(87, 199, 217, 0.08)" : "rgba(255, 255, 255, 0.03)";
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Label on top border
        if (x1 > 30 && x1 < w - 30) {
          ctx.fillText(`${lon}°E`, x1 - 10, y1 + 11);
        }
      }

      // Parallels (Latitude)
      for (let lat = -10; lat <= 5; lat += 5) {
        const [x1, y1] = project(MIN_LON, lat);
        const [x2, y2] = project(MAX_LON, lat);

        const isEquator = lat === 0;
        if (isEquator) {
          ctx.strokeStyle = "rgba(214, 168, 79, 0.22)"; // Highlight Khatulistiwa in golden tint
          ctx.setLineDash([4, 4]);
        } else {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
          ctx.setLineDash([]);
        }

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label on left border
        const label = isEquator ? "0° KHATULISTIWA" : `${Math.abs(lat)}°${lat < 0 ? "S" : "N"}`;
        if (y1 > 20 && y1 < h - 20) {
          ctx.fillStyle = isEquator ? "rgba(214, 168, 79, 0.6)" : "rgba(111, 123, 134, 0.45)";
          ctx.fillText(label, 6, y1 - 3);
        }
      }

      ctx.restore();
    };

    // Draw Sunda Trench Bathymetric depression gradient
    const drawBathymetryTrench = (
      project: (lon: number, lat: number) => [number, number]
    ) => {
      // Coordinates approximate the deep oceanic Sunda Trench axis (>6.000m)
      const trenchArc: [number, number][] = [
        [93.8, 6.2],
        [94.6, 4.0],
        [96.0, 1.8],
        [98.0, -0.6],
        [100.2, -2.8],
        [102.5, -4.9],
        [105.0, -7.0],
        [108.0, -9.3],
        [111.5, -10.2],
        [115.5, -10.6],
        [119.5, -10.8],
        [123.5, -10.9],
      ];

      ctx.save();
      for (let i = 0; i < trenchArc.length - 1; i++) {
        const [x1, y1] = project(trenchArc[i][0], trenchArc[i][1]);
        const [x2, y2] = project(trenchArc[i + 1][0], trenchArc[i + 1][1]);

        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, "rgba(7, 18, 30, 0.7)");
        grad.addColorStop(1, "rgba(5, 12, 22, 0.9)");

        ctx.strokeStyle = "rgba(4, 9, 16, 0.85)";
        ctx.lineWidth = 14;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Inner core trench shadow
        ctx.strokeStyle = "rgba(2, 6, 12, 0.95)";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.restore();
    };

    // Draw Islands (Real 270 Coastlines)
    const drawIslands = () => {
      ctx.save();
      const paths = islandPathsCache.current;

      // 1. Subtle coastline ambient glow
      ctx.shadowColor = "rgba(87, 199, 217, 0.25)";
      ctx.shadowBlur = 4;
      ctx.strokeStyle = "rgba(87, 199, 217, 0.28)";
      ctx.lineWidth = 1.0;

      paths.forEach((path) => {
        // Base crustal fill
        ctx.fillStyle = "rgba(18, 26, 35, 0.92)";
        ctx.fill(path);
        ctx.stroke(path);
      });

      // Clear shadow for crisp rendering
      ctx.shadowBlur = 0;
      ctx.restore();
    };

    // Draw Tectonic Plate Boundaries with Subduction Barbed Teeth
    const drawPlateBoundaries = (
      t: number,
      project: (lon: number, lat: number) => [number, number]
    ) => {
      if (!layersRef.current.showPlates) return;

      ctx.save();

      PB2002_BOUNDARIES.forEach((bound) => {
        if (!bound.c || bound.c.length < 2) return;

        const isSubduction =
          bound.type.toLowerCase().includes("subduction") ||
          bound.name.includes("SU/AU") ||
          bound.name.includes("BS/SU") ||
          bound.name.includes("PS");

        ctx.beginPath();
        const [sLon, sLat] = bound.c[0];
        const [sx, sy] = project(sLon, sLat);
        ctx.moveTo(sx, sy);

        for (let i = 1; i < bound.c.length; i++) {
          const [lon, lat] = bound.c[i];
          const [x, y] = project(lon, lat);
          ctx.lineTo(x, y);
        }

        // Subduction style: energetic red with dash pulse
        if (isSubduction) {
          // Glow underlay
          ctx.strokeStyle = "rgba(217, 92, 92, 0.18)";
          ctx.lineWidth = 3.5;
          ctx.setLineDash([]);
          ctx.stroke();

          // Animated dashes
          ctx.strokeStyle = "rgba(217, 92, 92, 0.75)";
          ctx.lineWidth = 1.6;
          ctx.setLineDash([8, 6]);
          ctx.lineDashOffset = -t * 0.4;
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw geological thrust fault teeth (triangles facing overriding plate)
          ctx.fillStyle = "rgba(217, 92, 92, 0.65)";
          for (let i = 0; i < bound.c.length - 1; i += 2) {
            const [p1x, p1y] = project(bound.c[i][0], bound.c[i][1]);
            const [p2x, p2y] = project(bound.c[i + 1][0], bound.c[i + 1][1]);
            const dx = p2x - p1x;
            const dy = p2y - p1y;
            const len = Math.hypot(dx, dy);
            if (len < 10) continue;

            const midX = (p1x + p2x) / 2;
            const midY = (p1y + p2y) / 2;

            // Normal pointing north/east towards Sunda overriding plate
            const nx = -dy / len;
            const ny = dx / len;
            const toothH = 4.5;
            const toothW = 3.5;

            ctx.beginPath();
            ctx.moveTo(midX - (dx / len) * toothW, midY - (dy / len) * toothW);
            ctx.lineTo(midX + nx * toothH, midY + ny * toothH);
            ctx.lineTo(midX + (dx / len) * toothW, midY + (dy / len) * toothW);
            ctx.closePath();
            ctx.fill();
          }
        } else {
          // Transform / ridge boundary
          ctx.strokeStyle = "rgba(87, 199, 217, 0.35)";
          ctx.lineWidth = 1.0;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      ctx.restore();
    };

    // Draw Active Continental Fault Lines (PuSGeN)
    const drawActiveFaults = (
      project: (lon: number, lat: number) => [number, number]
    ) => {
      if (!layersRef.current.showFaults) return;

      ctx.save();
      ACTIVE_FAULTS.forEach((fault) => {
        ctx.beginPath();
        const [sLon, sLat] = fault.coords[0];
        const [sx, sy] = project(sLon, sLat);
        ctx.moveTo(sx, sy);

        for (let i = 1; i < fault.coords.length; i++) {
          const [lon, lat] = fault.coords[i];
          const [x, y] = project(lon, lat);
          ctx.lineTo(x, y);
        }

        // Golden amber seismic line (#D6A84F)
        ctx.strokeStyle = "rgba(214, 168, 79, 0.85)";
        ctx.lineWidth = 1.4;
        ctx.setLineDash([5, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label near the midpoint of the fault
        const midIdx = Math.floor(fault.coords.length / 2);
        const [mx, my] = project(fault.coords[midIdx][0], fault.coords[midIdx][1]);

        ctx.font = '8px "Space Grotesk", sans-serif';
        ctx.fillStyle = "rgba(214, 168, 79, 0.75)";
        ctx.fillText(fault.name.split(" (")[0], mx + 6, my - 4);
      });
      ctx.restore();
    };

    // Draw Plate Convergence Velocity Vectors (GPS ITRF)
    const drawPlateVectors = (
      t: number,
      project: (lon: number, lat: number) => [number, number]
    ) => {
      if (!layersRef.current.showVectors) return;

      ctx.save();
      PLATE_VECTORS.forEach((pv) => {
        const [bx, by] = project(pv.baseCoords[0], pv.baseCoords[1]);

        // Convert azimuth to radians (0 = North/Up, 90 = East/Right)
        const rad = ((pv.azimuthDeg - 90) * Math.PI) / 180;
        const arrowLen = 22 + Math.sin(t * 0.04) * 2; // Subtle pulsing length

        const tx = bx + Math.cos(rad) * arrowLen;
        const ty = by + Math.sin(rad) * arrowLen;

        // Draw arrow shaft
        ctx.strokeStyle = "rgba(242, 245, 247, 0.75)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(tx, ty);
        ctx.stroke();

        // Arrow head
        const headLen = 6;
        const headAngle = 0.45;
        ctx.fillStyle = "rgba(242, 245, 247, 0.9)";
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(
          tx - headLen * Math.cos(rad - headAngle),
          ty - headLen * Math.sin(rad - headAngle)
        );
        ctx.lineTo(
          tx - headLen * Math.cos(rad + headAngle),
          ty - headLen * Math.sin(rad + headAngle)
        );
        ctx.closePath();
        ctx.fill();

        // Label
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = "rgba(242, 245, 247, 0.85)";
        ctx.fillText(`${pv.rateMmYear} mm/th`, tx + 6, ty + 3);
      });
      ctx.restore();
    };

    // Draw Seismic Ripples
    const drawRipples = () => {
      const ripples = ripplesRef.current;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.radius += rip.speed;
        rip.opacity = 0.45 * (1 - rip.radius / rip.maxRadius);

        if (rip.opacity <= 0.005 || rip.radius >= rip.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rip.color}, ${rip.opacity})`;
        ctx.lineWidth = 1.0;
        ctx.stroke();
      }
    };

    // Draw Historical Significant Earthquakes
    const drawEarthquakes = (
      t: number,
      project: (lon: number, lat: number) => [number, number]
    ) => {
      if (!layersRef.current.showEarthquakes) return;

      ctx.save();
      REAL_EARTHQUAKES.forEach((eq, idx) => {
        const [x, y] = project(eq.coords[0], eq.coords[1]);
        const pulse = Math.sin(t * 0.05 + idx);

        let color = "217, 92, 92"; // Shallow: red
        if (eq.depthCategory === "intermediate") color = "232, 117, 74"; // Orange
        if (eq.depthCategory === "deep") color = "87, 199, 217"; // Deep: cyan

        // Base halo
        const r = 3.5 + (eq.magnitude - 5.5) * 1.8;
        ctx.beginPath();
        ctx.arc(x, y, r + pulse * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, 0.25)`;
        ctx.fill();

        // Core epicentral dot
        ctx.beginPath();
        ctx.arc(x, y, r * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, 0.9)`;
        ctx.fill();

        // Concentric seismic ring
        ctx.beginPath();
        ctx.arc(x, y, r + 4 + pulse * 2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${color}, 0.4)`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });
      ctx.restore();
    };

    // Draw Active Stratovolcanoes (PVMBG)
    const drawVolcanoes = (
      t: number,
      project: (lon: number, lat: number) => [number, number]
    ) => {
      if (!layersRef.current.showVolcanoes) return;

      ctx.save();
      REAL_VOLCANOES.forEach((v, idx) => {
        const [x, y] = project(v.coords[0], v.coords[1]);
        const pulse = Math.sin(t * 0.04 + idx * 0.8);

        const isHighAlert = v.statusLevel === "Siaga" || v.statusLevel === "Awas";
        const color = isHighAlert ? "217, 92, 92" : "232, 117, 74";

        // Pulsing radar glow
        ctx.beginPath();
        ctx.arc(x, y, 7 + pulse * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${isHighAlert ? 0.28 : 0.14})`;
        ctx.fill();

        // Volcano triangle glyph (△)
        const size = 4.5;
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x - size, y + size * 0.7);
        ctx.lineTo(x + size, y + size * 0.7);
        ctx.closePath();
        ctx.fillStyle = `rgba(${color}, 0.95)`;
        ctx.fill();

        // White core dot
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
      });
      ctx.restore();
    };

    // Draw Crosshair / Cursor Target directly from ref for maximum performance
    const drawCrosshair = (
      w: number,
      h: number,
      project: (lon: number, lat: number) => [number, number]
    ) => {
      const coords = cursorCoordsRef.current;
      if (!coords) return;
      const [cx, cy] = project(coords.lon, coords.lat);

      ctx.save();
      ctx.strokeStyle = "rgba(87, 199, 217, 0.35)";
      ctx.lineWidth = 0.7;
      ctx.setLineDash([3, 3]);

      // Vertical hair
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, h);
      ctx.stroke();

      // Horizontal hair
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(w, cy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center ring
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.strokeStyle = "#57C7D9";
      ctx.stroke();

      ctx.restore();
    };

    // Viewport Intersection Observer (stops animation loop completely when off-screen)
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry.isIntersecting;
        if (isVisible && !frameRef.current) {
          frameRef.current = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.05 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Animation Loop
    const animate = () => {
      if (!isVisible) {
        frameRef.current = 0;
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);

      if (w <= 0 || h <= 0) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      // Automatically initialize or rebuild path cache and canvas size if dimensions changed or empty
      if (
        cachedDimensions.current.w !== w ||
        cachedDimensions.current.h !== h ||
        islandPathsCache.current.length === 0
      ) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        updatePathCache(w, h);
      }

      ctx.clearRect(0, 0, w, h);

      timeRef.current += 1;
      const t = timeRef.current;

      const { project } = getProjection(w, h);

      // Spawn ripples periodically
      rippleTimer++;
      if (rippleTimer >= 90) {
        rippleTimer = 0;
        spawnRipple(w, h);
      }

      // Layer sequence (Cartographic rendering order)
      drawBathymetryTrench(project);
      drawGraticule(w, h, project);
      drawIslands();
      drawPlateBoundaries(t, project);
      drawActiveFaults(project);
      drawPlateVectors(t, project);
      drawRipples();
      drawEarthquakes(t, project);
      drawVolcanoes(t, project);
      drawCrosshair(w, h, project);

      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      observer.disconnect();
      if (resizeObserver) resizeObserver.disconnect();
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
      window.removeEventListener("resize", resize);
    };
  }, [getProjection, updatePathCache]);

  return (
    <section className="relative py-16 px-6 overflow-hidden">
      {/* Section Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#D95C5C] font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D95C5C] animate-pulse" />
            PETA TEKTONIK & CINCIN API INDONESIA
          </p>
          <div className="text-[11px] font-mono text-[#6F7B86] bg-[#111820] px-3 py-1 rounded-full border border-[#202B36]">
            DATASET: PB2002 • PuSGeN 2017 • PVMBG • BMKG
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#F2F5F7] tracking-tight font-display">
          Titik Temu Tiga Lempeng Raksasa Dunia
        </h2>
        <p className="text-sm text-[#A9B3BD] mt-2 max-w-3xl leading-relaxed">
          Peta ini direkonstruksi menggunakan koordinat kartografis dan batas geologis nyata. Garis bergigi
          menunjukkan Sunda Megathrust, retakan emas menandai sesar aktif darat, dan panah mengindikasikan
          laju tumbukan lempeng samudera Indo-Australia dan Pasifik yang memicu bencana di Nusantara.
        </p>
      </div>

      {/* Map Interactive Frame */}
      <div className="max-w-6xl mx-auto relative" ref={containerRef}>
        <div className="relative rounded-[14px] bg-[#0B0F14] border border-[#202B36] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.5)]">

          {/* Top Control Bar & Layer Toggles */}
          <div className="px-4 py-2.5 border-b border-[#202B36] bg-[#0E141B] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
            {/* Live Readout */}
            <div className="flex items-center gap-3 text-[#A9B3BD]">
              <span className="text-[#F2F5F7] font-semibold">OBSERVATORI SEISMIK</span>
              <span className="text-[#202B36]">|</span>
              <span className="text-[#57C7D9]">
                {cursorCoords
                  ? `LON ${cursorCoords.lon.toFixed(2)}°E  LAT ${Math.abs(cursorCoords.lat).toFixed(2)}°${cursorCoords.lat >= 0 ? "N" : "S"}`
                  : "ARAHKAN KURSOR / SENTUH PETA"}
              </span>
            </div>

            {/* Layer Toggles */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setShowPlates(!showPlates)}
                className={`px-2.5 py-1 rounded-[6px] border text-[10px] transition-colors ${showPlates
                  ? "bg-[#D95C5C]/15 border-[#D95C5C]/50 text-[#F2F5F7]"
                  : "bg-[#141C24] border-[#202B36] text-[#6F7B86] hover:text-[#A9B3BD]"
                  }`}
              >
                ▼ Megathrust PB2002
              </button>

              <button
                onClick={() => setShowFaults(!showFaults)}
                className={`px-2.5 py-1 rounded-[6px] border text-[10px] transition-colors ${showFaults
                  ? "bg-[#D6A84F]/15 border-[#D6A84F]/50 text-[#F2F5F7]"
                  : "bg-[#141C24] border-[#202B36] text-[#6F7B86] hover:text-[#A9B3BD]"
                  }`}
              >
                ⚡ Sesar Darat PuSGeN
              </button>

              <button
                onClick={() => setShowVolcanoes(!showVolcanoes)}
                className={`px-2.5 py-1 rounded-[6px] border text-[10px] transition-colors ${showVolcanoes
                  ? "bg-[#E8754A]/15 border-[#E8754A]/50 text-[#F2F5F7]"
                  : "bg-[#141C24] border-[#202B36] text-[#6F7B86] hover:text-[#A9B3BD]"
                  }`}
              >
                △ Gunung Api PVMBG
              </button>

              <button
                onClick={() => setShowEarthquakes(!showEarthquakes)}
                className={`px-2.5 py-1 rounded-[6px] border text-[10px] transition-colors ${showEarthquakes
                  ? "bg-[#57C7D9]/15 border-[#57C7D9]/50 text-[#F2F5F7]"
                  : "bg-[#141C24] border-[#202B36] text-[#6F7B86] hover:text-[#A9B3BD]"
                  }`}
              >
                ○ Katalog Gempa
              </button>

              <button
                onClick={() => setShowVectors(!showVectors)}
                className={`px-2.5 py-1 rounded-[6px] border text-[10px] transition-colors ${showVectors
                  ? "bg-white/10 border-white/30 text-[#F2F5F7]"
                  : "bg-[#141C24] border-[#202B36] text-[#6F7B86] hover:text-[#A9B3BD]"
                  }`}
              >
                → Vektor GPS
              </button>
            </div>
          </div>

          {/* Canvas Map Viewport */}
          <div className="relative aspect-[2/1] sm:aspect-[2.35/1] bg-[#070B0F] cursor-crosshair">
            <canvas
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouch}
              className="absolute inset-0 w-full h-full block touch-pan-y"
            />

            {/* Subtle CRT / Grid Overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.025]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
              }}
            />

            {/* Hover Telemetry HUD Card */}
            {hoveredFeature && (
              <div
                className="absolute z-20 p-3 sm:p-3.5 rounded-[10px] bg-[#0D141D]/95 border border-[#57C7D9]/40 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.7)] text-left w-[260px] sm:w-[280px] pointer-events-auto transition-all"
                style={{
                  left:
                    typeof window !== "undefined" && window.innerWidth < 640
                      ? Math.min(Math.max(hoveredFeature.screenX - 130, 8), (containerRef.current?.clientWidth || 320) - 270)
                      : Math.min(hoveredFeature.screenX + 16, (containerRef.current?.clientWidth || 800) - 296),
                  top: Math.max(hoveredFeature.screenY - 90, 8),
                }}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#162230] text-[#57C7D9] border border-[#57C7D9]/30">
                    {hoveredFeature.type.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {hoveredFeature.badge && (
                      <span className="text-[9px] font-mono text-[#E8754A] truncate max-w-[100px]">
                        {hoveredFeature.badge}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setHoveredFeature(null);
                      }}
                      className="text-[#6F7B86] hover:text-[#F2F5F7] p-0.5 text-xs rounded hover:bg-[#18212B] cursor-pointer"
                      title="Tutup"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="text-sm font-bold text-[#F2F5F7] font-display">
                  {hoveredFeature.title}
                </div>
                <div className="text-[11px] text-[#A9B3BD] mb-2 font-mono">
                  {hoveredFeature.subtitle} • {hoveredFeature.coords}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#202B36] text-[10px] font-mono">
                  <div>
                    <span className="text-[#6F7B86] block">{hoveredFeature.metric1.label}</span>
                    <span className="text-[#F2F5F7] font-semibold">{hoveredFeature.metric1.value}</span>
                  </div>
                  <div>
                    <span className="text-[#6F7B86] block">{hoveredFeature.metric2.label}</span>
                    <span className="text-[#F2F5F7] font-semibold">{hoveredFeature.metric2.value}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Geological Legend Bar */}
          <div className="px-4 py-3 border-t border-[#202B36] bg-[#0B0F14] flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[11px] font-mono text-[#6F7B86]">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-2 flex items-center justify-center text-[9px] text-[#D95C5C] font-bold">
                  ▼▼
                </span>
                <span className="text-[#A9B3BD]">Sunda Megathrust (Subduksi)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 border-t-2 border-dashed border-[#D6A84F]" />
                <span className="text-[#A9B3BD]">Sesar Darat Aktif</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#E8754A] font-bold">△</span>
                <span className="text-[#A9B3BD]">Gunung Api Tipe-A</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D95C5C]" />
                <span className="text-[#A9B3BD]">Gempa Dangkal (&lt;50km)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#57C7D9]" />
                <span className="text-[#A9B3BD]">Gempa Dalam (&gt;300km)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#F2F5F7]">→</span>
                <span className="text-[#A9B3BD]">Vektor GPS (mm/th)</span>
              </div>
            </div>

            <div className="text-[10px] text-[#57C7D9]">
              PROYEKSI: EQUIDISTANT CYLINDRICAL (WGS 84)
            </div>
          </div>
        </div>

        {/* Real Scientific Facts Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {[
            {
              value: "67 mm/th",
              label: "Laju Konvergensi",
              sub: "Indo-Australia menunjam ke bawah Jawa-Sumatra",
            },
            {
              value: "127",
              label: "Gunung Api Aktif",
              sub: "13% dari seluruh gunung api aktif dunia",
            },
            {
              value: "Mw 9.1",
              label: "Megathrust Terbesar",
              sub: "Gempa Aceh 2004, retakan sesar 1.300 km",
            },
            {
              value: "42 mm/th",
              label: "Sesar Tercepat",
              sub: "Sesar geser Palu-Koro di Sulawesi Tengah",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="px-4 py-3 rounded-[10px] bg-[#111820] border border-[#202B36] hover:border-[#57C7D9]/30 transition-colors"
            >
              <div className="text-lg font-bold text-[#D95C5C] font-display">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-[#F2F5F7] mt-0.5">
                {stat.label}
              </div>
              <div className="text-[10px] text-[#6F7B86] mt-0.5 leading-tight">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
