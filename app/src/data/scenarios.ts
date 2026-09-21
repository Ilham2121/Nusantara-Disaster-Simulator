import { ScenarioDefinition } from "../simulation/types";

// ===== EARTHQUAKE REGIONAL SCENARIOS =====
// Disederhanakan menjadi 3 Kategori Wilayah Kejadian Bencana

export const earthquakeScenarios: ScenarioDefinition[] = [
  {
    id: "eq-urban",
    disasterType: "earthquake",
    name: "Gempa Wilayah Perkotaan",
    location: "Kawasan Perkotaan (Urban Grid)",
    description:
      "Simulasi gempa tektonik pada area perkotaan padat penduduk. Menguji ketahanan gedung bertingkat, jaringan jalan, retakan aspal patahan, kaca gedung pecah berhamburan, dan runtuhan fasad bangunan.",
    difficulty: "beginner",
    defaultParameters: {
      magnitude: 6.5,
      depth: 10,
      duration: 30,
      environment: "urban" as const,
      location: "Kawasan Perkotaan",
    },
    parameterRanges: {
      magnitude: { min: 4.0, max: 9.0, step: 0.1, unit: "M" },
      depth: { min: 5, max: 150, step: 5, unit: "km" },
      duration: { min: 15, max: 60, step: 5, unit: "detik" },
    },
    learningObjective:
      "Memahami dampak guncangan gempa bumi di kawasan perkotaan padat penduduk dan pentingnya standar konstruksi bangunan tahan gempa.",
  },
  {
    id: "eq-coastal",
    disasterType: "earthquake",
    name: "Gempa Wilayah Pesisir & Pantai",
    location: "Kawasan Pesisir & Laut Lepas",
    description:
      "Simulasi gempa tektonik di wilayah pesisir pantai dan laut terbuka. Jika magnitudo gempa besar (M ≥ 7.0) dan dangkal (≤ 60 km), simulasi secara dinamis memicu penarikan air laut surut drastis disusul terjangan dinding gelombang tsunami 3D sesuai kriteria BMKG.",
    difficulty: "intermediate",
    defaultParameters: {
      magnitude: 7.5,
      depth: 15,
      duration: 40,
      environment: "coastal" as const,
      location: "Kawasan Pesisir & Pantai",
    },
    parameterRanges: {
      magnitude: { min: 4.0, max: 9.0, step: 0.1, unit: "M" },
      depth: { min: 5, max: 150, step: 5, unit: "km" },
      duration: { min: 15, max: 60, step: 5, unit: "detik" },
    },
    learningObjective:
      "Memahami kriteria BMKG mengenai gempa pemicu tsunami di kawasan pesisir dan pentingnya evakuasi segera ke tempat tinggi saat air laut surut.",
  },
  {
    id: "eq-rural",
    disasterType: "earthquake",
    name: "Gempa Wilayah Pedesaan & Perbukitan",
    location: "Kawasan Pedesaan & Lereng Bukit",
    description:
      "Simulasi gempa di daerah perbukitan dan pedesaan agraris dengan sawah terasering dan lereng bukit curam. Guncangan kuat menguji stabilitas lereng yang dapat memicu runtuhan tanah longsor masif dan bongkahan batu berguling.",
    difficulty: "intermediate",
    defaultParameters: {
      magnitude: 5.8,
      depth: 10,
      duration: 35,
      environment: "rural" as const,
      location: "Kawasan Pedesaan & Perbukitan",
    },
    parameterRanges: {
      magnitude: { min: 4.0, max: 9.0, step: 0.1, unit: "M" },
      depth: { min: 5, max: 150, step: 5, unit: "km" },
      duration: { min: 15, max: 60, step: 5, unit: "detik" },
    },
    learningObjective:
      "Memahami kerentanan lereng perbukitan dan pemukiman pedesaan terhadap bahaya tanah longsor dan runtuhan batu akibat guncangan gempa dangkal.",
  },
];

// ===== VOLCANO TYPOLOGY SCENARIOS =====
// Dikelompokkan berdasarkan Karakteristik Geologis Gunung Api

export const eruptionScenarios: ScenarioDefinition[] = [
  {
    id: "er-merapi",
    disasterType: "eruption",
    name: "Gunung Merapi",
    location: "Stratovulkan Andesitik",
    description:
      "Simulasi gunung api andesitik kerucut terjal dengan kubah lava aktif di puncak. Karakteristik utama berupa aliran awan panas guguran (pyroclastic flow / wedhus gembel) yang meluncur cepat ke lereng serta hujan abu lebat pada pemukiman.",
    difficulty: "intermediate",
    defaultParameters: {
      activityLevel: "warning" as const,
      eruptionType: "explosive" as const,
      volcano: "Merapi",
      ashDirection: "south" as const,
      settlementDistance: 8,
    },
    parameterRanges: {
      settlementDistance: { min: 3, max: 25, step: 1, unit: "km" },
    },
    learningObjective:
      "Memahami bahaya awan panas guguran (pyroclastic flow) dan pentingnya mematuhi zona radius bahaya yang ditetapkan PVMBG.",
  },
  {
    id: "er-krakatau",
    disasterType: "eruption",
    name: "Gunung Anak Krakatau",
    location: "Pulau Gunung Api Laut Lepas",
    description:
      "Simulasi gunung api kerucut basaltik yang berdiri di tengah laut lepas Selat Sunda. Menampilkan letusan tipe Strombolian dengan semburan magma pijar ke langit malam dan kepulan uap panas kontak lava dengan air laut.",
    difficulty: "advanced",
    defaultParameters: {
      activityLevel: "warning" as const,
      eruptionType: "explosive" as const,
      volcano: "Anak Krakatau",
      ashDirection: "west" as const,
      settlementDistance: 15,
    },
    parameterRanges: {
      settlementDistance: { min: 5, max: 40, step: 1, unit: "km" },
    },
    learningObjective:
      "Memahami bahwa gunung api di laut dapat memicu tsunami vulkanik dan bahaya semburan magma pijar serta pentingnya zona steril maritim.",
  },
  {
    id: "er-semeru",
    disasterType: "eruption",
    name: "Gunung Semeru (Mahameru)",
    location: "Puncak Tertinggi & Ngarai Sungai",
    description:
      "Simulasi gunung tertinggi di Pulau Jawa (3.676 mdpl) dengan kawah aktif Jonggring Saloka. Menampilkan kolom letusan abu vulkanik tebal dan ancaman aliran lahar dingin deras yang menyapu ngarai sungai Besuk Kobokan.",
    difficulty: "intermediate",
    defaultParameters: {
      activityLevel: "watch" as const,
      eruptionType: "explosive" as const,
      volcano: "Semeru",
      ashDirection: "east" as const,
      settlementDistance: 10,
    },
    parameterRanges: {
      settlementDistance: { min: 3, max: 30, step: 1, unit: "km" },
    },
    learningObjective:
      "Memahami bahaya lahar dingin dan bagaimana erupsi dapat memengaruhi area pemukiman jauh dari kawah melalui aliran ngarai sungai.",
  },
  {
    id: "er-rinjani",
    disasterType: "eruption",
    name: "Gunung Rinjani",
    location: "Kaldera & Danau Kawah Segara Anak",
    description:
      "Simulasi kaldera vulkanik raksasa dengan danau kawah Segara Anak berwarna biru toska. Di tengah danau terdapat kerucut anak gunung api baru Gunung Barujari yang aktif mengepulkan asap solfatara dan aliran lava baru.",
    difficulty: "beginner",
    defaultParameters: {
      activityLevel: "advisory" as const,
      eruptionType: "phreatic" as const,
      volcano: "Rinjani",
      ashDirection: "north" as const,
      settlementDistance: 12,
    },
    parameterRanges: {
      settlementDistance: { min: 5, max: 25, step: 1, unit: "km" },
    },
    learningObjective:
      "Memahami struktur geologi kaldera vulkanik, interaksi danau kawah asam, dan aktivitas fumarol pada gunung api tipe freatik.",
  },
];

// ===== HELPERS =====

export const allScenarios = [...earthquakeScenarios, ...eruptionScenarios];

const scenarioAliasMap: Record<string, string> = {
  "eq-yogyakarta": "eq-urban",
  "eq-bandung": "eq-urban",
  "eq-padang": "eq-coastal",
  "eq-palu": "eq-coastal",
  "eq-cianjur": "eq-rural",
};

export function getScenarioById(id: string): ScenarioDefinition | undefined {
  const direct = allScenarios.find((s) => s.id === id);
  if (direct) return direct;
  const aliasId = scenarioAliasMap[id];
  if (aliasId) {
    return allScenarios.find((s) => s.id === aliasId);
  }
  return undefined;
}

export function getScenariosByType(type: "earthquake" | "eruption"): ScenarioDefinition[] {
  return allScenarios.filter((s) => s.disasterType === type);
}
