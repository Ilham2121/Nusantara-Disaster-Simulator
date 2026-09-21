import {
  EarthquakeParameters,
  EarthquakeComputedState,
  ShakingIntensity,
  DamageLevel,
  TimelineEvent,
  Impact,
  SimulationResult,
  MitigationAction,
} from "../types";

// ===== EARTHQUAKE RULES ENGINE =====

/**
 * Auto-calculate simulation duration from magnitude and depth.
 * Based on empirical rupture duration scaling: T ~ 10^(0.3*M - 1.3)
 * Shallow events produce longer felt-shaking due to trapped surface waves.
 * Range clamp: 8s (M4.0 deep) to 90s (M9.0 shallow).
 */
export function calculateAutoDuration(magnitude: number, depth: number): number {
  const ruptureDuration = Math.pow(10, 0.3 * magnitude - 1.3);
  const depthFactor = 1 + Math.max(0, (60 - depth) / 60) * 0.5;
  const raw = ruptureDuration * depthFactor * 2.5;
  return Math.round(Math.min(90, Math.max(8, raw)));
}

/**
 * Calculate Modified Mercalli Intensity (simplified) from magnitude and depth.
 * This is a simplified educational model, NOT a scientific prediction.
 *
 * Reference: BMKG uses MMI scale for earthquake impact assessment.
 * Formula inspired by: Attenuation relations for Indonesia (simplified).
 */
/**
 * Calculate Modified Mercalli Intensity (simplified) from magnitude and depth.
 */
function calculateIntensityValue(magnitude: number, depth: number): number {
  const magFactor = Math.pow(10, (magnitude - 4) / 3); // exponential scaling
  const depthFactor = 1 / (1 + Math.log10(Math.max(depth, 1)) / 2);
  const raw = magFactor * depthFactor;
  return Math.min(Math.max(raw, 0), 1); // clamp 0-1
}

/**
 * Calculate realistic Peak Ground Acceleration (PGA) in units of g
 * Based on Joyner-Boore / Campbell attenuation formulations for subduction & crustal faults.
 */
function calculatePgaG(magnitude: number, depth: number): number {
  const R = Math.sqrt(100 + depth * depth); // hypocentral distance with 10km epicentral offset
  const rawPga = Math.exp(-0.7 + 0.62 * (magnitude - 5.0) - 1.18 * Math.log(R / 15));
  return Math.min(1.8, Math.max(0.01, parseFloat(rawPga.toFixed(3))));
}

function pgaToMmi(pga: number): string {
  if (pga < 0.005) return "II";
  if (pga < 0.02) return "III";
  if (pga < 0.05) return "IV";
  if (pga < 0.10) return "V";
  if (pga < 0.22) return "VI";
  if (pga < 0.40) return "VII";
  if (pga < 0.70) return "VIII";
  if (pga < 1.05) return "IX";
  return "X+";
}

function intensityToLabel(value: number): ShakingIntensity {
  if (value < 0.1) return "negligible";
  if (value < 0.2) return "light";
  if (value < 0.35) return "moderate";
  if (value < 0.5) return "strong";
  if (value < 0.7) return "very_strong";
  if (value < 0.85) return "severe";
  return "extreme";
}

function intensityToDamageLevel(value: number, environment: string): DamageLevel {
  const envMultiplier = environment === "urban" ? 1.2 : environment === "coastal" ? 1.1 : 1.0;
  const adjusted = value * envMultiplier;

  if (adjusted < 0.15) return "none";
  if (adjusted < 0.3) return "minor";
  if (adjusted < 0.5) return "moderate";
  if (adjusted < 0.7) return "major";
  if (adjusted < 0.85) return "severe";
  return "catastrophic";
}

// ===== COMPUTE STATE =====

export function computeEarthquakeState(params: EarthquakeParameters): EarthquakeComputedState {
  const intensityValue = calculateIntensityValue(params.magnitude, params.depth);
  const pga = calculatePgaG(params.magnitude, params.depth);
  const mmi = pgaToMmi(pga);
  const shakingIntensity = intensityToLabel(intensityValue);
  const damageLevel = intensityToDamageLevel(intensityValue, params.environment);

  // S - P wave arrival time gap: depth * (1/Vs - 1/Vp)
  // Scaled for educational visualization: 1.2s to 6.5s
  const spGap = parseFloat((1.0 + (params.depth / 100) * 5.0).toFixed(1));

  // Tsunami criteria (BMKG standard: undersea/coastal, magnitude >= 7.0, depth <= 60 km)
  const isCoastal = params.environment === "coastal";
  const isTsunami = isCoastal && params.magnitude >= 7.0 && params.depth <= 60;
  const tsunamiHeight = isTsunami
    ? params.magnitude >= 8.0
      ? 8.5
      : params.magnitude >= 7.5
      ? 4.5
      : 2.5
    : 0;

  const landslideRisk = params.environment === "rural" && intensityValue >= 0.35;

  // Liquefaction risk (saturated sandy soil + shallow powerful shaking + PGA >= 0.20g)
  const isLiquefaction =
    (isCoastal || params.environment === "urban") &&
    params.magnitude >= 6.8 &&
    params.depth <= 35 &&
    pga >= 0.20;

  return {
    shakingIntensity,
    shakingIntensityValue: intensityValue,
    damageLevel,
    objectFallProbability: Math.min(intensityValue * 1.3, 1),
    buildingShakeAmplitude: intensityValue,
    groundDisplacement: intensityValue * 0.8,
    infrastructureDamage: intensityValue * (params.environment === "urban" ? 1.2 : 0.8),
    aftershockRisk: params.magnitude >= 6 ? 0.7 : params.magnitude >= 5 ? 0.4 : 0.2,
    tsunamiPotential: isTsunami,
    tsunamiHeight,
    landslideRisk,
    pgaG: pga,
    mmiScale: mmi,
    spIntervalSeconds: spGap,
    liquefactionPotential: isLiquefaction,
  };
}

// ===== GENERATE TIMELINE =====

export function generateEarthquakeTimeline(
  params: EarthquakeParameters,
  state: EarthquakeComputedState
): TimelineEvent[] {
  const { duration } = params;
  const intensity = state.shakingIntensityValue;
  const isCoastal = params.environment === "coastal";
  const isTsunami = Boolean(state.tsunamiPotential);
  const isRural = params.environment === "rural";
  const isLiquefaction = Boolean(state.liquefactionPotential);
  const spGap = state.spIntervalSeconds ?? 2.0;

  // S-wave arrival normalized time in simulation (seconds)
  const sWaveTime = Math.min(duration * 0.25, spGap);
  const surfaceWaveTime = sWaveTime + Math.min(duration * 0.25, 4.0);
  const peakEndTime = Math.min(duration * 0.72, surfaceWaveTime + duration * 0.35);

  const timeline: TimelineEvent[] = [
    // Phase 1: P-Wave Arrival (Compressional Longitudinal Jolt)
    {
      time: 0,
      endTime: sWaveTime,
      event: "p_wave_arrival",
      phase: "Gelombang P (Primer)",
      description: `Gelombang P berkecepatan ~6 km/s tiba lebih dulu: sentakan kompresional vertikal (atas-bawah) terasa dari dalam bumi`,
      animations: ["p_wave_jolt", "ground_vibrate_light", "vertical_compression"],
      educationalOverlay: {
        title: "Gelombang P (Primer): Cepat & Kompresional",
        content: `Gelombang P merambat paling cepat melalui kompresi batuan bumi. Karena gerakannya membujur (longitudinal), getaran terasa sebagai hentakan vertikal naik-turun yang mendahului guncangan samping gelombang S.`,
        source: "BMKG Seismologi",
      },
    },
    // Phase 2: S-Wave Arrival (Transverse Shear Shaking)
    {
      time: sWaveTime,
      endTime: surfaceWaveTime,
      event: "s_wave_arrival",
      phase: "Gelombang S (Sekunder)",
      description: `Gelombang S tiba setelah jeda ${spGap} detik: guncangan geser horizontal keras meretakkan struktur bangunan`,
      animations: [
        "s_wave_shear",
        "ground_shake_medium",
        "building_shear_drift",
        ...(intensity > 0.35 ? ["wall_crack_shear"] : []),
      ],
      educationalOverlay: {
        title: `Gelombang S & Jeda Waktu S - P (${spGap}s)`,
        content: `Gelombang S merambat lebih lambat (~3.5 km/s) tetapi membawa energi geser tegak lurus yang sangat destruktif bagi bangunan. Jeda waktu tiba antara gelombang P dan S (${spGap} detik pada kedalaman ${params.depth} km) digunakan BMKG untuk mengukur jarak hiposentrum gempa.`,
        source: "BMKG Seismologi",
      },
    },
    // Phase 3: Surface Waves & Peak Intensity (Rayleigh & Love Rolling Waves)
    {
      time: surfaceWaveTime,
      endTime: peakEndTime,
      event: "surface_waves_peak",
      phase: "Puncak Guncangan (Surface Waves)",
      description: `Puncak deformasi: Gelombang Rayleigh & Love bergulung di permukaan dengan PGA ~${state.pgaG || 0.4}g (MMI ${state.mmiScale || "VI"})`,
      animations: [
        "surface_wave_roll",
        "ground_shake_heavy",
        "building_shake_intense",
        ...(intensity > 0.3 ? ["tile_sliding"] : []),
        ...(intensity > 0.4 ? ["objects_falling"] : []),
        ...(intensity > 0.55 ? ["glass_breaking", "dust_particles"] : []),
        ...(intensity > 0.7 ? ["structural_damage", "structural_plastic_deformation"] : []),
      ],
      educationalOverlay: {
        title: `Puncak Akselerasi Tanah (PGA: ${state.pgaG}g, Skala ${state.mmiScale})`,
        content: `Pada magnitudo M ${params.magnitude.toFixed(1)} dan kedalaman ${params.depth} km, gelombang permukaan bergulung menyebabkan puntiran tanah. Percepatan puncak tanah mencapai ${state.pgaG}g, memicu jatuhnya genteng dan keretakan dinding getas.`,
        source: "BMKG & SNI Gempa",
      },
      impacts: generatePeakImpacts(state, params),
    },
  ];

  // Liquefaction secondary hazard in coastal / alluvial zones
  if (isLiquefaction) {
    timeline.push({
      time: surfaceWaveTime + 1.0,
      endTime: peakEndTime + 3.0,
      event: "liquefaction_sand_boils",
      phase: "Likuefaksi (Pencairan Tanah)",
      description: "Tekanan pori air tanah melonjak ekstrem: semburan pasir dan lumpur (sand boils) menyembul dari rekahan tanah!",
      animations: ["liquefaction_sand_boils", "ground_subsidence"],
      educationalOverlay: {
        title: "Bahaya Ikutan: Fenomena Likuefaksi",
        content: "Guncangan seismik kuat pada lapisan pasir jenuh air menaikkan tekanan pori hingga tanah kehilangan daya dukungnya dan mencair. Pondasi bangunan amblas miring dan semburan air bercampur pasir (sand boil) keluar ke permukaan.",
        source: "Badan Geologi & BMKG",
      },
    });
  }

  // Coastal Tsunami Dynamics
  if (isCoastal && isTsunami) {
    // Sea Water Drawback (Tanda alam tsunami)
    timeline.push({
      time: duration * 0.45,
      endTime: duration * 0.65,
      event: "sea_drawback",
      phase: "Air Laut Surut Drastis",
      description: "Air laut pantai tiba-tiba surut puluhan meter: dasar laut & karang terlihat kering!",
      animations: ["sea_water_drawback", "tsunami_early_warning_siren"],
      educationalOverlay: {
        title: "Tanda Alam Tsunami: Air Laut Surut",
        content: "Air laut yang surut cepat dan drastis setelah gempa kuat adalah tanda pasti tsunami. Segera lari ke tempat tinggi (bukit atau bangunan evakuasi tsunami), jangan pernah mendekati pantai untuk melihat dasar laut!",
        source: "BMKG & BNPB",
      },
    });

    // Tsunami Surge
    timeline.push({
      time: duration * 0.65,
      endTime: duration * 0.95,
      event: "tsunami_surge",
      phase: "Gelombang Tsunami Menerjang",
      description: `Dinding gelombang tsunami setinggi ~${state.tsunamiHeight || 3} meter bergulung menerjang pantai dan menggenangi daratan!`,
      animations: ["tsunami_wave_incoming", "coastal_flooding", "debris_floating"],
      educationalOverlay: {
        title: "Dinamika Gelombang Tsunami",
        content: "Tsunami bukanlah gelombang ombak biasa, melainkan dinding massa air laut berkecepatan tinggi yang dapat merambah ratusan meter ke daratan, menyapu perahu, merobohkan rumah pantai, dan menghancurkan infrastruktur.",
        source: "BMKG",
      },
    });
  } else if (isCoastal) {
    // Coastal agitation without tsunami
    timeline.push({
      time: duration * 0.45,
      endTime: duration * 0.7,
      event: "sea_agitation",
      phase: "Air Laut Bergolak",
      description: "Permukaan air laut bergolak akibat rambatan gelombang seismik dasar laut tanpa potensi tsunami",
      animations: ["sea_agitation"],
      educationalOverlay: {
        title: "Mengapa Tidak Terjadi Tsunami?",
        content: "Gempa pesisir ini tidak menghasilkan tsunami karena magnitudonya di bawah M 7.0 atau kedalaman hiposentrum terlalu dalam (>60 km), sehingga tidak terjadi deformasi vertikal dasar laut yang signifikan.",
        source: "BMKG",
      },
    });
  } else if (isRural && state.landslideRisk) {
    // Rural Landslide
    timeline.push({
      time: duration * 0.45,
      endTime: duration * 0.7,
      event: "landslide_triggered",
      phase: "Tanah Longsor Perbukitan",
      description: "Guncangan kuat memicu longsoran tanah dan runtuhan batu dari lereng bukit menimpa persawahan dan jalan",
      animations: ["hillside_landslide", "rockfall", "rural_crack"],
      educationalOverlay: {
        title: "Bahaya Ikutan: Tanah Longsor",
        content: "Di kawasan pedesaan dan perbukitan, gempa sering memicu bahaya ikutan berupa tanah longsor. Gaya inersia getaran merusak ikatan tanah pada lereng curam, menimbun akses jalan dan merusak lahan pertanian.",
        source: "PVMBG & BNPB",
      },
    });
  } else if (intensity > 0.3) {
    // Phase 4: Objects falling (Urban default)
    timeline.push({
      time: duration * 0.45,
      endTime: duration * 0.6,
      event: "objects_falling",
      phase: "Benda Berjatuhan",
      description: "Benda-benda tidak terikat mulai berjatuhan",
      animations: ["objects_fall_random", "debris_scatter"],
      educationalOverlay: {
        title: "Mengapa Benda Jatuh?",
        content: "Guncangan menyebabkan gaya inersia pada benda yang tidak terikat. Benda dengan pusat massa tinggi lebih mudah jatuh. Inilah mengapa mengamankan furnitur penting sebagai mitigasi.",
      },
    });
  }

  // Phase 5: Structural effects (high intensity)
  if (intensity > 0.6) {
    timeline.push({
      time: duration * 0.5,
      endTime: duration * 0.65,
      event: "structural_impact",
      phase: "Kerusakan Struktur",
      description: "Beberapa bangunan mengalami kerusakan struktural",
      animations: ["building_crack", "wall_collapse_partial", "heavy_dust"],
      educationalOverlay: {
        title: "Kerentanan Bangunan",
        content: "Bangunan tanpa konstruksi tahan gempa lebih rentan terhadap kerusakan. Faktor seperti material, desain, dan kualitas konstruksi sangat memengaruhi ketahanan bangunan.",
        source: "BNPB",
      },
    });
  }

  // Phase 6: Shaking subsides
  timeline.push({
    time: duration * 0.65,
    endTime: duration * 0.85,
    event: "shaking_subsides",
    phase: "Guncangan Mereda",
    description: "Intensitas guncangan mulai berkurang secara bertahap",
    animations: ["ground_shake_light", "settling_dust", "camera_stabilize"],
    educationalOverlay: {
      title: "Mereda",
      content: "Guncangan utama biasanya berlangsung beberapa detik hingga beberapa menit. Tetap berlindung sampai guncangan benar-benar berhenti.",
    },
  });

  // Phase 7: Post-earthquake
  timeline.push({
    time: duration * 0.85,
    endTime: duration,
    event: "post_earthquake",
    phase: "Pasca Gempa",
    description: "Guncangan berhenti: fase tanggap darurat dimulai",
    animations: ["environment_still", "dust_settling", "alarm_sound"],
    educationalOverlay: {
      title: "Apa yang Harus Dilakukan?",
      content: "Setelah guncangan berhenti: periksa diri dan sekitar, jauhi bangunan rusak, siap terhadap gempa susulan, dan ikuti arahan petugas. Jangan gunakan lift.",
      source: "BNPB",
    },
  });

  return timeline;
}

// ===== GENERATE IMPACTS =====

function generatePeakImpacts(
  state: EarthquakeComputedState,
  params: EarthquakeParameters
): Impact[] {
  const impacts: Impact[] = [];
  const intensity = state.shakingIntensityValue;

  // Environmental
  impacts.push({
    category: "environmental",
    severity: intensity > 0.7 ? "critical" : intensity > 0.4 ? "high" : "moderate",
    description: "Permukaan tanah mengalami guncangan " + state.shakingIntensity,
    visualKey: "ground_shake",
  });

  // Infrastructure
  if (intensity > 0.2) {
    impacts.push({
      category: "infrastructure",
      severity: intensity > 0.7 ? "critical" : intensity > 0.5 ? "high" : intensity > 0.3 ? "moderate" : "low",
      description:
        state.damageLevel === "catastrophic"
          ? "Kerusakan berat pada sebagian besar bangunan"
          : state.damageLevel === "severe"
          ? "Kerusakan signifikan pada bangunan rentan"
          : state.damageLevel === "major"
          ? "Kerusakan pada bangunan tanpa konstruksi tahan gempa"
          : state.damageLevel === "moderate"
          ? "Retak pada dinding, benda-benda jatuh"
          : "Guncangan terasa, kerusakan minimal",
      visualKey: "building_damage",
    });
  }

  // Human (conceptual, not visual)
  impacts.push({
    category: "human",
    severity: intensity > 0.6 ? "high" : intensity > 0.3 ? "moderate" : "low",
    description:
      intensity > 0.6
        ? "Risiko cedera tinggi dari benda jatuh dan reruntuhan"
        : intensity > 0.3
        ? "Risiko cedera dari benda yang bergerak dan jatuh"
        : "Kepanikan mungkin terjadi, risiko cedera rendah",
  });

  return impacts;
}

// ===== GENERATE RESULT =====

export function generateEarthquakeResult(
  params: EarthquakeParameters,
  state: EarthquakeComputedState,
  scenario: string
): SimulationResult {
  const intensity = state.shakingIntensityValue;

  const riskLevel = Math.round(intensity * 100);
  const riskLabel =
    riskLevel >= 80 ? "Sangat Tinggi" :
    riskLevel >= 60 ? "Tinggi" :
    riskLevel >= 40 ? "Sedang" :
    riskLevel >= 20 ? "Rendah" : "Sangat Rendah";

  const mitigationActions: MitigationAction[] = [
    {
      step: 1,
      action: "DROP: Merunduk",
      detail: "Segera merunduk ke posisi rendah. Lindungi kepala dan leher dengan tangan.",
      icon: "drop",
    },
    {
      step: 2,
      action: "COVER: Berlindung",
      detail: "Berlindung di bawah meja kokoh atau furnitur kuat. Jauhi kaca, jendela, dan benda berat yang bisa jatuh.",
      icon: "cover",
    },
    {
      step: 3,
      action: "HOLD ON: Bertahan",
      detail: "Pegang erat tempat berlindung dan tunggu hingga guncangan benar-benar berhenti.",
      icon: "hold",
    },
    {
      step: 4,
      action: "Evakuasi dengan Tertib",
      detail: "Setelah guncangan berhenti, keluar bangunan dengan tenang. Jangan gunakan lift. Perhatikan reruntuhan.",
      icon: "evacuate",
    },
    {
      step: 5,
      action: "Waspada Gempa Susulan",
      detail: "Gempa susulan (aftershock) mungkin terjadi. Tetap waspada dan jauhi bangunan yang rusak.",
      icon: "alert",
    },
  ];

  return {
    disasterType: "earthquake",
    scenario,
    parameters: params,
    impacts: generatePeakImpacts(state, params),
    riskLevel,
    riskLabel,
    mitigationActions,
    learningObjective:
      "Memahami bahwa dampak gempa tidak hanya ditentukan oleh magnitudo, tetapi juga kedalaman, jarak dari sumber, kondisi tanah, dan karakteristik bangunan.",
    funFact:
      params.magnitude >= 7
        ? "Gempa M7+ melepaskan energi setara sekitar 32 kali lebih besar dari M6."
        : "Setiap peningkatan 1 poin magnitudo berarti energi yang dilepaskan ~32 kali lebih besar.",
    sources: [
      { name: "BMKG", url: "https://www.bmkg.go.id" },
      { name: "BNPB", url: "https://www.bnpb.go.id" },
      { name: "inaRISK", url: "https://inarisk.bnpb.go.id" },
    ],
  };
}
