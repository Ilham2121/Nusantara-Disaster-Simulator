import {
  EruptionParameters,
  EruptionComputedState,
  TimelineEvent,
  Impact,
  SimulationResult,
  MitigationAction,
  Severity,
} from "../types";

// ===== ERUPTION RULES ENGINE =====

/**
 * Calculate eruption intensity from parameters.
 * Based on simplified VEI (Volcanic Explosivity Index) concept.
 *
 * Reference: PVMBG uses activity levels (Normal, Waspada, Siaga, Awas)
 * mapped to Level I-IV for Indonesian volcanoes.
 */

const activityMultiplier: Record<string, number> = {
  normal: 0.2,
  advisory: 0.4,   // Waspada (Level II)
  watch: 0.7,      // Siaga (Level III)
  warning: 1.0,    // Awas (Level IV)
};

const eruptionTypeMultiplier: Record<string, number> = {
  phreatic: 0.5,    // Steam-driven, less intense
  effusive: 0.6,    // Lava flow dominant
  explosive: 1.0,   // Most intense
};

function calculateEruptionIntensity(params: EruptionParameters): number {
  const activity = activityMultiplier[params.activityLevel] ?? 0.5;
  const type = eruptionTypeMultiplier[params.eruptionType] ?? 0.6;
  const distanceFactor = 1 / (1 + params.settlementDistance / 10);

  return Math.min(activity * type * (0.7 + distanceFactor * 0.3), 1);
}

function calculateEvacuationUrgency(intensity: number, distance: number): Severity {
  if (intensity > 0.8 && distance < 5) return "critical";
  if (intensity > 0.6 && distance < 10) return "high";
  if (intensity > 0.3) return "moderate";
  return "low";
}

// ===== COMPUTE STATE =====

export function computeEruptionState(params: EruptionParameters): EruptionComputedState {
  const intensity = calculateEruptionIntensity(params);

  return {
    eruptionIntensity: intensity,
    ashColumnHeight: intensity * (params.eruptionType === "explosive" ? 1.0 : 0.4),
    ashSpreadRadius: intensity * 0.8,
    lavaFlowSpeed: params.eruptionType === "effusive" ? intensity * 0.7 : intensity * 0.2,
    pyroclasticRisk: params.eruptionType === "explosive" ? intensity * 0.9 : 0.1,
    visibilityReduction: intensity * 0.7,
    evacuationUrgency: calculateEvacuationUrgency(intensity, params.settlementDistance),
  };
}

// ===== GENERATE TIMELINE =====

export function generateEruptionTimeline(
  params: EruptionParameters,
  state: EruptionComputedState
): TimelineEvent[] {
  const totalDuration = 60; // eruption simulations run 60 seconds
  const intensity = state.eruptionIntensity;

  const timeline: TimelineEvent[] = [
    // Phase 1: Pre-eruption signs
    {
      time: 0,
      endTime: totalDuration * 0.12,
      event: "pre_eruption",
      phase: "Tanda Awal",
      description: "Peningkatan aktivitas vulkanik terdeteksi",
      animations: ["mountain_rumble", "smoke_increase", "ground_vibrate_subtle"],
      educationalOverlay: {
        title: "Tanda-Tanda Erupsi",
        content: "Sebelum erupsi, gunung api menunjukkan tanda-tanda seperti peningkatan gempa vulkanik, perubahan suhu air panas, deformasi tubuh gunung, dan peningkatan emisi gas.",
        source: "PVMBG",
      },
    },
    // Phase 2: Eruption onset
    {
      time: totalDuration * 0.12,
      endTime: totalDuration * 0.25,
      event: "eruption_onset",
      phase: "Erupsi Dimulai",
      description: "Letusan dimulai dari kawah utama",
      animations: [
        "eruption_blast",
        "crater_explosion",
        "camera_shake_heavy",
        ...(params.eruptionType === "explosive" ? ["shockwave"] : []),
      ],
      educationalOverlay: {
        title: params.eruptionType === "explosive" ? "Erupsi Eksplosif" :
               params.eruptionType === "effusive" ? "Erupsi Efusif" : "Erupsi Freatik",
        content: params.eruptionType === "explosive"
          ? "Erupsi eksplosif terjadi ketika tekanan gas magma sangat tinggi. Material vulkanik dilontarkan ke udara dengan kecepatan tinggi, disertai suara letusan yang sangat keras."
          : params.eruptionType === "effusive"
          ? "Erupsi efusif ditandai dengan aliran lava yang relatif tenang dari kawah. Lava mengalir mengikuti gravitasi ke lereng gunung."
          : "Erupsi freatik terjadi karena interaksi air tanah dengan panas magma, menghasilkan ledakan uap tanpa material magmatik baru.",
        source: "PVMBG",
      },
    },
    // Phase 3: Ash column development
    {
      time: totalDuration * 0.25,
      endTime: totalDuration * 0.4,
      event: "ash_column",
      phase: "Kolom Abu",
      description: "Kolom abu vulkanik naik ke atmosfer",
      animations: ["ash_column_rise", "dark_sky", "ash_particles"],
      educationalOverlay: {
        title: "Kolom Abu Vulkanik",
        content: `Kolom abu dari erupsi ${params.volcano} naik ke atmosfer. Abu vulkanik bukan abu biasa: terdiri dari fragmen batuan dan kaca vulkanik yang sangat halus dan berbahaya bagi pernapasan.`,
        source: "PVMBG",
      },
    },
  ];

  // Phase 4: Lava flow (effusive/explosive)
  if (params.eruptionType !== "phreatic" && intensity > 0.3) {
    timeline.push({
      time: totalDuration * 0.3,
      endTime: totalDuration * 0.55,
      event: "lava_flow",
      phase: "Aliran Lava",
      description: "Lava mulai mengalir dari kawah menuruni lereng",
      animations: ["lava_flow_start", "lava_glow", "terrain_burning"],
      educationalOverlay: {
        title: "Aliran Lava",
        content: "Lava bergerak mengikuti topografi lereng gunung. Kecepatan aliran bergantung pada viskositas magma dan kemiringan lereng. Lava basaltik lebih cair dan mengalir lebih cepat dibanding lava andesitik.",
        source: "PVMBG",
      },
    });
  }

  // Phase 5: Pyroclastic flow (explosive, high intensity)
  if (params.eruptionType === "explosive" && intensity > 0.5) {
    timeline.push({
      time: totalDuration * 0.38,
      endTime: totalDuration * 0.55,
      event: "pyroclastic_flow",
      phase: "Awan Panas",
      description: "Awan panas (pyroclastic flow) menuruni lereng gunung",
      animations: ["pyroclastic_flow", "extreme_heat_glow", "vegetation_burn"],
      educationalOverlay: {
        title: "Awan Panas (Pyroclastic Flow)",
        content: "Awan panas adalah campuran gas panas, abu, dan fragmen batuan yang mengalir menuruni lereng dengan kecepatan hingga 700 km/jam dan suhu hingga 700°C. Ini adalah bahaya paling mematikan dari erupsi eksplosif.",
        source: "PVMBG",
      },
    });
  }

  // Phase 6: Ash spread to settlement
  timeline.push({
    time: totalDuration * 0.5,
    endTime: totalDuration * 0.7,
    event: "ash_spread",
    phase: "Penyebaran Abu",
    description: `Abu vulkanik menyebar ke arah ${params.ashDirection === "north" ? "utara" : params.ashDirection === "south" ? "selatan" : params.ashDirection === "east" ? "timur" : "barat"} menuju permukiman`,
    animations: ["ash_spread_settlement", "visibility_decrease", "environment_darken"],
    educationalOverlay: {
      title: "Abu Mencapai Permukiman",
      content: `Abu vulkanik menyebar ke area permukiman sejauh ${params.settlementDistance} km dari kawah. Abu dapat menyebabkan gangguan pernapasan, kerusakan mesin, kontaminasi air, dan runtuhnya atap jika menumpuk tebal.`,
      source: "PVMBG",
    },
    impacts: generateEruptionImpacts(state, params),
  });

  // Phase 7: Impact phase
  timeline.push({
    time: totalDuration * 0.7,
    endTime: totalDuration * 0.85,
    event: "impact_phase",
    phase: "Dampak",
    description: "Lingkungan sekitar terdampak material vulkanik",
    animations: ["roofs_covered_ash", "trees_damaged", "vehicles_covered"],
    educationalOverlay: {
      title: "Dampak Erupsi",
      content: "Dampak erupsi tidak hanya lava. Abu vulkanik, awan panas, lontaran material, lahar, dan gas beracun semuanya merupakan bahaya yang berbeda dengan karakteristik masing-masing.",
      source: "BNPB",
    },
  });

  // Phase 8: Response
  timeline.push({
    time: totalDuration * 0.85,
    endTime: totalDuration,
    event: "response_phase",
    phase: "Tanggap Darurat",
    description: "Fase evakuasi dan tanggap darurat",
    animations: ["evacuation_indicators", "safe_zone_highlight"],
    educationalOverlay: {
      title: "Evakuasi & Keselamatan",
      content: "Segera jauhi zona bahaya sesuai rekomendasi PVMBG. Gunakan masker untuk melindungi pernapasan. Ikuti jalur evakuasi yang telah ditentukan. Pantau informasi resmi dari PVMBG dan BPBD.",
      source: "PVMBG",
    },
  });

  return timeline;
}

// ===== GENERATE IMPACTS =====

function generateEruptionImpacts(
  state: EruptionComputedState,
  params: EruptionParameters
): Impact[] {
  const impacts: Impact[] = [];
  const intensity = state.eruptionIntensity;

  // Environmental
  impacts.push({
    category: "environmental",
    severity: intensity > 0.7 ? "critical" : intensity > 0.4 ? "high" : "moderate",
    description: "Material vulkanik menutupi area sekitar gunung",
    visualKey: "volcanic_environment",
  });

  // Ash impact
  impacts.push({
    category: "environmental",
    severity: state.ashSpreadRadius > 0.6 ? "high" : "moderate",
    description: `Abu vulkanik menyebar ke radius ${Math.round(state.ashSpreadRadius * 30)} km`,
    visualKey: "ash_coverage",
  });

  // Infrastructure
  impacts.push({
    category: "infrastructure",
    severity: intensity > 0.6 ? "high" : intensity > 0.3 ? "moderate" : "low",
    description:
      intensity > 0.6
        ? "Bangunan tertutup abu tebal, atap berisiko runtuh"
        : "Abu menutupi bangunan dan kendaraan, gangguan aktivitas",
    visualKey: "infrastructure_damage",
  });

  // Human (conceptual)
  impacts.push({
    category: "human",
    severity: state.evacuationUrgency,
    description:
      state.evacuationUrgency === "critical"
        ? "Evakuasi mendesak: zona bahaya harus segera dikosongkan"
        : state.evacuationUrgency === "high"
        ? "Evakuasi diperlukan untuk area dalam radius bahaya"
        : "Waspada dan siap evakuasi jika aktivitas meningkat",
  });

  // Pyroclastic (if applicable)
  if (state.pyroclasticRisk > 0.5) {
    impacts.push({
      category: "environmental",
      severity: "critical",
      description: "Awan panas mengancam area lereng gunung",
      visualKey: "pyroclastic_danger",
    });
  }

  return impacts;
}

// ===== GENERATE RESULT =====

export function generateEruptionResult(
  params: EruptionParameters,
  state: EruptionComputedState,
  scenario: string
): SimulationResult {
  const intensity = state.eruptionIntensity;
  const riskLevel = Math.round(intensity * 100);
  const riskLabel =
    riskLevel >= 80 ? "Sangat Tinggi" :
    riskLevel >= 60 ? "Tinggi" :
    riskLevel >= 40 ? "Sedang" :
    riskLevel >= 20 ? "Rendah" : "Sangat Rendah";

  const mitigationActions: MitigationAction[] = [
    {
      step: 1,
      action: "Pantau Informasi Resmi",
      detail: "Selalu ikuti informasi terbaru dari PVMBG dan BPBD mengenai status aktivitas gunung api dan zona bahaya.",
      icon: "monitor",
    },
    {
      step: 2,
      action: "Jauhi Zona Bahaya",
      detail: "Segera menjauh dari lereng gunung dan area dalam radius zona bahaya yang ditetapkan PVMBG.",
      icon: "evacuate",
    },
    {
      step: 3,
      action: "Gunakan Masker",
      detail: "Lindungi pernapasan dari abu vulkanik dengan masker atau kain basah. Abu vulkanik mengandung partikel silika yang berbahaya.",
      icon: "mask",
    },
    {
      step: 4,
      action: "Lindungi Sumber Air",
      detail: "Tutup penampungan air bersih untuk mencegah kontaminasi abu vulkanik.",
      icon: "water",
    },
    {
      step: 5,
      action: "Ikuti Jalur Evakuasi",
      detail: "Gunakan jalur evakuasi yang telah ditentukan. Jangan melewati sungai atau lembah yang berasal dari gunung karena risiko lahar.",
      icon: "route",
    },
  ];

  return {
    disasterType: "eruption",
    scenario,
    parameters: params,
    impacts: generateEruptionImpacts(state, params),
    riskLevel,
    riskLabel,
    mitigationActions,
    learningObjective:
      "Memahami bahwa erupsi gunung api dapat menghasilkan beberapa jenis bahaya dengan karakteristik berbeda, dan pentingnya mengikuti informasi resmi serta zona rekomendasi.",
    funFact:
      `${params.volcano} adalah salah satu dari 127 gunung api aktif di Indonesia. Indonesia memiliki jumlah gunung api aktif terbanyak di dunia.`,
    sources: [
      { name: "PVMBG", url: "https://magma.esdm.go.id" },
      { name: "BMKG", url: "https://www.bmkg.go.id" },
      { name: "BNPB", url: "https://www.bnpb.go.id" },
    ],
  };
}
