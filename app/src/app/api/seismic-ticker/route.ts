import { NextResponse } from "next/server";

export const revalidate = 180; // Cache 3 minutes

export interface LiveQuake {
  mag: string;
  loc: string;
  depth: string;
  time: string;
  date?: string;
  coordinates?: string;
  potensi?: string;
  dirasakan?: string;
}

const FALLBACK_EVENTS: LiveQuake[] = [
  { mag: "5.2", loc: "Laut Banda, Maluku", depth: "28 km", time: "03:42 WIB" },
  { mag: "4.8", loc: "Selat Sunda", depth: "12 km", time: "06:15 WIB" },
  { mag: "3.9", loc: "Barat Daya Nias", depth: "35 km", time: "09:28 WIB" },
  { mag: "5.6", loc: "Utara Halmahera", depth: "18 km", time: "12:01 WIB" },
  { mag: "4.1", loc: "Timur Laut Bali", depth: "22 km", time: "14:35 WIB" },
  { mag: "3.7", loc: "Selatan Jawa Timur", depth: "45 km", time: "17:50 WIB" },
  { mag: "4.5", loc: "Barat Laut Flores", depth: "15 km", time: "20:12 WIB" },
  { mag: "5.0", loc: "Teluk Cenderawasih", depth: "32 km", time: "22:44 WIB" },
];

interface BmkgRawItem {
  Tanggal?: string;
  Jam?: string;
  DateTime?: string;
  Coordinates?: string;
  Magnitude?: string;
  Kedalaman?: string;
  Wilayah?: string;
  Potensi?: string;
  Dirasakan?: string;
}

export async function GET() {
  try {
    const fetchOptions: RequestInit = {
      next: { revalidate: 180 },
      headers: {
        Accept: "application/json",
        "User-Agent": "NusantaraDisasterSimulator/1.0",
      },
      signal: AbortSignal.timeout(6000),
    };

    const [terkiniRes, dirasakanRes] = await Promise.allSettled([
      fetch("https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json", fetchOptions),
      fetch("https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json", fetchOptions),
    ]);

    const rawList: BmkgRawItem[] = [];

    if (terkiniRes.status === "fulfilled" && terkiniRes.value.ok) {
      try {
        const data = await terkiniRes.value.json();
        const gempa = data?.Infogempa?.gempa;
        if (Array.isArray(gempa)) rawList.push(...gempa);
      } catch {
        // ignore parse error
      }
    }

    if (dirasakanRes.status === "fulfilled" && dirasakanRes.value.ok) {
      try {
        const data = await dirasakanRes.value.json();
        const gempa = data?.Infogempa?.gempa;
        if (Array.isArray(gempa)) rawList.push(...gempa);
      } catch {
        // ignore parse error
      }
    }

    if (rawList.length === 0) {
      // If BMKG had no items or both failed, try USGS bounded to Indonesia as failover
      try {
        const usgsRes = await fetch(
          "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=4.0&limit=15&minlatitude=-11.0&maxlatitude=6.0&minlongitude=95.0&maxlongitude=141.0",
          { ...fetchOptions, signal: AbortSignal.timeout(5000) }
        );
        if (usgsRes.ok) {
          const usgsData = await usgsRes.json();
          const usgsFeatures = usgsData.features || [];
          if (usgsFeatures.length > 0) {
            const usgsQuakes: LiveQuake[] = usgsFeatures.map((f: { properties: { mag?: number; place?: string; time: number }; geometry?: { coordinates?: number[] } }) => {
              const d = new Date(f.properties.time);
              const timeStr = d.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Jakarta",
              }) + " WIB";
              return {
                mag: f.properties.mag ? f.properties.mag.toFixed(1) : "4.0",
                loc: f.properties.place || "Wilayah Indonesia",
                depth: f.geometry?.coordinates?.[2] ? `${Math.round(f.geometry.coordinates[2])} km` : "-",
                time: timeStr,
              };
            });
            return NextResponse.json({
              source: "USGS (Indonesia Region)",
              updatedAt: new Date().toISOString(),
              events: usgsQuakes,
            });
          }
        }
      } catch {
        // fall through to fallback
      }

      return NextResponse.json({
        source: "Fallback",
        updatedAt: new Date().toISOString(),
        events: FALLBACK_EVENTS,
      });
    }

    // Deduplicate BMKG items by (Coordinates + Magnitude + Jam)
    const map = new Map<string, BmkgRawItem>();
    for (const item of rawList) {
      if (!item.Coordinates || !item.Magnitude) continue;
      const key = `${item.Coordinates}_${item.Magnitude}_${item.Jam || ""}`;
      if (!map.has(key)) {
        map.set(key, item);
      }
    }

    // Sort by DateTime descending
    const sorted = Array.from(map.values()).sort((a, b) => {
      const tA = a.DateTime ? new Date(a.DateTime).getTime() : 0;
      const tB = b.DateTime ? new Date(b.DateTime).getTime() : 0;
      return tB - tA;
    });

    const events: LiveQuake[] = sorted.slice(0, 16).map((q) => {
      let timeDisplay = q.Jam || "";
      // If Jam has seconds like "17:58:04 WIB", clean to "17:58 WIB"
      timeDisplay = timeDisplay.replace(/:(\d{2}) WIB/, " WIB");

      // Clean location prefix if redundant or very long
      const locDisplay = q.Wilayah || "Indonesia";

      return {
        mag: q.Magnitude || "0.0",
        loc: locDisplay,
        depth: q.Kedalaman || "-",
        time: timeDisplay,
        date: q.Tanggal,
        coordinates: q.Coordinates,
        potensi: q.Potensi,
        dirasakan: q.Dirasakan,
      };
    });

    return NextResponse.json({
      source: "BMKG Indonesia",
      updatedAt: new Date().toISOString(),
      events: events.length > 0 ? events : FALLBACK_EVENTS,
    });
  } catch (error) {
    console.error("Seismic Ticker API error:", error);
    return NextResponse.json({
      source: "Fallback",
      updatedAt: new Date().toISOString(),
      events: FALLBACK_EVENTS,
    });
  }
}
