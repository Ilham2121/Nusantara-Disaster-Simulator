// Real geological and tectonic hazard catalog for Indonesian archipelago
// Sources: PuSGeN 2017, PVMBG (Badan Geologi), BMKG, USGS, Bird 2003 (PB2002)

export interface ActiveFault {
  id: string;
  name: string;
  island: string;
  type: "strike-slip" | "thrust" | "normal";
  slipRateMmYear: number;
  maxMagnitude: number;
  description: string;
  coords: [number, number][]; // [lon, lat]
}

export interface VolcanoFeature {
  id: string;
  name: string;
  location: string;
  coords: [number, number]; // [lon, lat]
  elevationM: number;
  statusLevel: "Normal" | "Waspada" | "Siaga" | "Awas";
  lastMajorYear: number;
  tectonicSetting: string;
}

export interface SeismicEventFeature {
  id: string;
  date: string;
  title: string;
  magnitude: number;
  depthKm: number;
  depthCategory: "shallow" | "intermediate" | "deep";
  coords: [number, number]; // [lon, lat]
  mechanism: string;
}

export interface PlateVector {
  plateName: string;
  baseCoords: [number, number]; // [lon, lat]
  rateMmYear: number;
  azimuthDeg: number; // 0=North, 90=East, 180=South, 270=West
  label: string;
}

// Major Active Fault Lines (PuSGeN 2017)
export const ACTIVE_FAULTS: ActiveFault[] = [
  {
    id: "fault-semangko",
    name: "Sesar Besar Sumatra (Semangko Fault)",
    island: "Sumatra",
    type: "strike-slip",
    slipRateMmYear: 15,
    maxMagnitude: 7.7,
    description: "Sesar geser menganan aktif sepanjang 1.900 km membelah pegunungan Bukit Barisan.",
    coords: [
      [95.3, 5.6],
      [96.1, 4.8],
      [97.0, 3.8],
      [98.5, 2.2],
      [99.3, 1.2],
      [100.2, 0.2],
      [100.8, -0.6],
      [101.5, -1.8],
      [102.3, -2.8],
      [103.2, -3.9],
      [104.3, -5.0],
      [104.8, -5.7],
    ],
  },
  {
    id: "fault-palu-koro",
    name: "Sesar Palu-Koro",
    island: "Sulawesi",
    type: "strike-slip",
    slipRateMmYear: 35,
    maxMagnitude: 7.5,
    description: "Sesar geser mengiri berkecepatan tinggi (~35-42 mm/th) pemicu gempa & likuefaksi Palu 2018.",
    coords: [
      [119.5, -0.2],
      [119.8, -0.8],
      [120.0, -1.3],
      [120.4, -2.0],
      [120.8, -2.7],
      [121.3, -3.4],
    ],
  },
  {
    id: "fault-matano",
    name: "Sesar Matano",
    island: "Sulawesi",
    type: "strike-slip",
    slipRateMmYear: 20,
    maxMagnitude: 7.2,
    description: "Cabang utama Palu-Koro ke arah tenggara melintasi Danau Matano.",
    coords: [
      [121.2, -2.5],
      [121.8, -2.6],
      [122.4, -2.8],
      [123.0, -3.0],
    ],
  },
  {
    id: "fault-cimandiri",
    name: "Sesar Cimandiri",
    island: "Jawa",
    type: "strike-slip",
    slipRateMmYear: 4,
    maxMagnitude: 6.7,
    description: "Sesar geser aktif Jawa Barat dari Pelabuhan Ratu hingga Padalarang.",
    coords: [
      [106.5, -7.0],
      [106.9, -6.9],
      [107.2, -6.8],
      [107.5, -6.8],
    ],
  },
  {
    id: "fault-opak",
    name: "Sesar Opak",
    island: "Jawa",
    type: "strike-slip",
    slipRateMmYear: 3,
    maxMagnitude: 6.6,
    description: "Sesar aktif sepanjang lembah Sungai Opak pemicu gempa dahsyat Yogyakarta 2006.",
    coords: [
      [110.25, -8.05],
      [110.35, -7.92],
      [110.45, -7.80],
      [110.55, -7.68],
    ],
  },
  {
    id: "fault-flores-thrust",
    name: "Sesar Naik Busur Belakang Flores (Flores Back-arc Thrust)",
    island: "Nusa Tenggara",
    type: "thrust",
    slipRateMmYear: 10,
    maxMagnitude: 7.4,
    description: "Zona sesar naik di utara busur kepulauan Nusa Tenggara pemicu gempa Lombok 2018.",
    coords: [
      [115.5, -8.1],
      [116.5, -8.0],
      [118.0, -7.9],
      [119.5, -8.0],
      [121.0, -8.1],
      [122.5, -8.1],
      [124.0, -8.0],
    ],
  },
  {
    id: "fault-sorong",
    name: "Sesar Sorong",
    island: "Papua & Maluku",
    type: "strike-slip",
    slipRateMmYear: 28,
    maxMagnitude: 7.8,
    description: "Sesar geser raksasa mengiri batas lempeng Pasifik-Australia memanjang dari Papua ke Maluku.",
    coords: [
      [135.5, -1.0],
      [133.5, -0.9],
      [131.2, -0.8],
      [129.0, -1.2],
      [127.0, -1.5],
      [124.8, -1.8],
    ],
  },
  {
    id: "fault-tarera-aiduna",
    name: "Sesar Tarera-Aiduna",
    island: "Papua",
    type: "strike-slip",
    slipRateMmYear: 25,
    maxMagnitude: 7.6,
    description: "Sesar geser aktif di bagian leher Pulau Papua.",
    coords: [
      [133.8, -3.8],
      [135.0, -3.9],
      [136.5, -4.0],
      [138.0, -4.2],
    ],
  },
];

// Active Stratovolcanoes (PVMBG - Type A)
export const REAL_VOLCANOES: VolcanoFeature[] = [
  {
    id: "sinabung",
    name: "Gunung Sinabung",
    location: "Karo, Sumatera Utara",
    coords: [98.39, 3.17],
    elevationM: 2460,
    statusLevel: "Waspada",
    lastMajorYear: 2021,
    tectonicSetting: "Busur Magmatik Sunda (Subduksi Indo-Australia)",
  },
  {
    id: "marapi",
    name: "Gunung Marapi",
    location: "Agam/Tanah Datar, Sumbar",
    coords: [100.47, -0.38],
    elevationM: 2891,
    statusLevel: "Siaga",
    lastMajorYear: 2023,
    tectonicSetting: "Bukit Barisan (Sunda Arc)",
  },
  {
    id: "kerinci",
    name: "Gunung Kerinci",
    location: "Jambi / Sumbar",
    coords: [101.26, -1.69],
    elevationM: 3805,
    statusLevel: "Waspada",
    lastMajorYear: 2023,
    tectonicSetting: "Gunung tertinggi di Sumatra, Sunda Arc",
  },
  {
    id: "anak-krakatau",
    name: "Anak Krakatau",
    location: "Selat Sunda, Lampung",
    coords: [105.42, -6.10],
    elevationM: 157,
    statusLevel: "Siaga",
    lastMajorYear: 2022,
    tectonicSetting: "Zona Transisi Busur Sumatra-Jawa (Selat Sunda)",
  },
  {
    id: "tangkuban-parahu",
    name: "Tangkuban Parahu",
    location: "Subang / Bandung Barat",
    coords: [107.60, -6.77],
    elevationM: 2084,
    statusLevel: "Normal",
    lastMajorYear: 2019,
    tectonicSetting: "Busur Vulkanik Jawa Barat",
  },
  {
    id: "slamet",
    name: "Gunung Slamet",
    location: "Banyumas / Brebes, Jateng",
    coords: [109.21, -7.24],
    elevationM: 3428,
    statusLevel: "Waspada",
    lastMajorYear: 2014,
    tectonicSetting: "Busur Vulkanik Jawa Tengah",
  },
  {
    id: "merapi",
    name: "Gunung Merapi",
    location: "Sleman / Magelang / Boyolali",
    coords: [110.44, -7.54],
    elevationM: 2930,
    statusLevel: "Siaga",
    lastMajorYear: 2024,
    tectonicSetting: "Persimpangan Sesar Tektonik & Subduksi Jawa",
  },
  {
    id: "kelud",
    name: "Gunung Kelud",
    location: "Kediri / Blitar / Malang",
    coords: [112.31, -7.93],
    elevationM: 1731,
    statusLevel: "Normal",
    lastMajorYear: 2014,
    tectonicSetting: "Busur Vulkanik Jawa Timur",
  },
  {
    id: "bromo",
    name: "Gunung Bromo",
    location: "Probolinggo / Pasuruan, Jatim",
    coords: [112.95, -7.94],
    elevationM: 2329,
    statusLevel: "Waspada",
    lastMajorYear: 2019,
    tectonicSetting: "Kaldera Tengger Caldera Complex",
  },
  {
    id: "semeru",
    name: "Gunung Semeru",
    location: "Lumajang / Malang, Jatim",
    coords: [112.92, -8.11],
    elevationM: 3676,
    statusLevel: "Siaga",
    lastMajorYear: 2024,
    tectonicSetting: "Atap Pulau Jawa, Busur Subduksi Jawa",
  },
  {
    id: "agung",
    name: "Gunung Agung",
    location: "Karangasem, Bali",
    coords: [115.51, -8.34],
    elevationM: 3031,
    statusLevel: "Normal",
    lastMajorYear: 2019,
    tectonicSetting: "Busur Sunda-Banda Arc Transition",
  },
  {
    id: "rinjani",
    name: "Gunung Rinjani",
    location: "Lombok Utara, NTB",
    coords: [116.46, -8.42],
    elevationM: 3726,
    statusLevel: "Waspada",
    lastMajorYear: 2016,
    tectonicSetting: "Busur Kepulauan Nusa Tenggara",
  },
  {
    id: "tambora",
    name: "Gunung Tambora",
    location: "Dompu / Bima, Sumbawa",
    coords: [117.96, -8.25],
    elevationM: 2850,
    statusLevel: "Normal",
    lastMajorYear: 1967,
    tectonicSetting: "Situs Erupsi Terbesar Sejarah Modern (1815 VEI 7)",
  },
  {
    id: "lewotobi",
    name: "Lewotobi Laki-laki",
    location: "Flores Timur, NTT",
    coords: [122.77, -8.54],
    elevationM: 1584,
    statusLevel: "Awas",
    lastMajorYear: 2024,
    tectonicSetting: "Busur Banda / Tumbukan Busur-Benua",
  },
  {
    id: "lokon",
    name: "Gunung Lokon",
    location: "Tomohon, Sulawesi Utara",
    coords: [124.79, 1.36],
    elevationM: 1580,
    statusLevel: "Waspada",
    lastMajorYear: 2015,
    tectonicSetting: "Busur Vulkanik Sangihe (Subduksi Laut Maluku)",
  },
  {
    id: "ruang",
    name: "Gunung Ruang",
    location: "Kepulauan Sitaro, Sulut",
    coords: [125.37, 2.30],
    elevationM: 725,
    statusLevel: "Siaga",
    lastMajorYear: 2024,
    tectonicSetting: "Busur Busur Sangihe / Pemicu Tsunami Erupsi 2024",
  },
  {
    id: "karangetang",
    name: "Gunung Karangetang",
    location: "Pulau Siau, Sulut",
    coords: [125.40, 2.78],
    elevationM: 1784,
    statusLevel: "Waspada",
    lastMajorYear: 2023,
    tectonicSetting: "Gunung api paling persisten di Busur Sangihe",
  },
  {
    id: "gamalama",
    name: "Gunung Gamalama",
    location: "Pulau Ternate, Maluku Utara",
    coords: [127.33, 0.80],
    elevationM: 1715,
    statusLevel: "Waspada",
    lastMajorYear: 2018,
    tectonicSetting: "Busur Halmahera Barat",
  },
  {
    id: "ibu",
    name: "Gunung Ibu",
    location: "Halmahera Barat, Malut",
    coords: [127.63, 1.49],
    elevationM: 1325,
    statusLevel: "Siaga",
    lastMajorYear: 2024,
    tectonicSetting: "Zona Tumbukan Ganda Lempeng Laut Maluku",
  },
  {
    id: "dukono",
    name: "Gunung Dukono",
    location: "Halmahera Utara, Malut",
    coords: [127.89, 1.69],
    elevationM: 1335,
    statusLevel: "Waspada",
    lastMajorYear: 2024,
    tectonicSetting: "Busur Halmahera Timur",
  },
];

// Historical Significant Earthquake Epicenters (BMKG & USGS NEIC)
export const REAL_EARTHQUAKES: SeismicEventFeature[] = [
  {
    id: "eq-2004-aceh",
    date: "26 Des 2004",
    title: "Gempa & Tsunami Aceh-Andaman",
    magnitude: 9.1,
    depthKm: 30,
    depthCategory: "shallow",
    coords: [95.85, 3.32],
    mechanism: "Sunda Megathrust Subduction",
  },
  {
    id: "eq-2005-nias",
    date: "28 Mar 2005",
    title: "Gempa Nias-Simeulue",
    magnitude: 8.6,
    depthKm: 30,
    depthCategory: "shallow",
    coords: [97.01, 2.07],
    mechanism: "Sunda Megathrust Subduction",
  },
  {
    id: "eq-2006-jogja",
    date: "27 Mei 2006",
    title: "Gempa Yogyakarta (Sesar Opak)",
    magnitude: 6.3,
    depthKm: 10,
    depthCategory: "shallow",
    coords: [110.32, -7.96],
    mechanism: "Intraplate Strike-slip (Sesar Opak)",
  },
  {
    id: "eq-2009-padang",
    date: "30 Sep 2009",
    title: "Gempa Padang Sumatera Barat",
    magnitude: 7.6,
    depthKm: 87,
    depthCategory: "intermediate",
    coords: [99.85, -0.79],
    mechanism: "Intraslab Benioff Subduction",
  },
  {
    id: "eq-2018-palu",
    date: "28 Sep 2018",
    title: "Gempa, Tsunami & Likuefaksi Palu",
    magnitude: 7.5,
    depthKm: 10,
    depthCategory: "shallow",
    coords: [119.84, -0.18],
    mechanism: "Sesar Mendatar Palu-Koro (Supershear)",
  },
  {
    id: "eq-2018-lombok",
    date: "5 Agu 2018",
    title: "Gempa Lombok Utara",
    magnitude: 7.0,
    depthKm: 31,
    depthCategory: "shallow",
    coords: [116.45, -8.29],
    mechanism: "Flores Back-arc Thrust",
  },
  {
    id: "eq-2021-mamuju",
    date: "15 Jan 2021",
    title: "Gempa Mamuju-Majene",
    magnitude: 6.2,
    depthKm: 18,
    depthCategory: "shallow",
    coords: [118.90, -2.97],
    mechanism: "Mamuju Thrust Fault",
  },
  {
    id: "eq-2022-cianjur",
    date: "21 Nov 2022",
    title: "Gempa Darat Cianjur (Sesar Cugenang)",
    magnitude: 5.6,
    depthKm: 10,
    depthCategory: "shallow",
    coords: [107.09, -6.85],
    mechanism: "Shallow Crustal Strike-slip Fault",
  },
  {
    id: "eq-2023-banda",
    date: "10 Jan 2023",
    title: "Gempa Laut Banda - Tanimbar",
    magnitude: 7.6,
    depthKm: 105,
    depthCategory: "intermediate",
    coords: [130.13, -7.04],
    mechanism: "Banda Arc Intermediate Subduction",
  },
  {
    id: "eq-deep-javawa",
    date: "Zona Dalam",
    title: "Gempa Dalam Laut Jawa (Wadati-Benioff)",
    magnitude: 6.5,
    depthKm: 590,
    depthCategory: "deep",
    coords: [112.50, -5.80],
    mechanism: "Deep Mantle Slab Detachment",
  },
];

// Geodetic GPS Plate Motion Convergence Vectors (ITRF GPS Solutions)
export const PLATE_VECTORS: PlateVector[] = [
  {
    plateName: "Lempeng Indo-Australia (Jawa)",
    baseCoords: [108.5, -11.4],
    rateMmYear: 67,
    azimuthDeg: 12, // Moving North-North-East into Sunda trench
    label: "Indo-Australia → 67 mm/th",
  },
  {
    plateName: "Lempeng Indo-Australia (Sumatra)",
    baseCoords: [96.0, -4.5],
    rateMmYear: 58,
    azimuthDeg: 22, // NNE into Sumatra trench
    label: "Indo-Australia → 58 mm/th",
  },
  {
    plateName: "Lempeng Laut Filipina",
    baseCoords: [129.5, 4.8],
    rateMmYear: 82,
    azimuthDeg: 295, // WNW into Halmahera / Sangihe
    label: "Laut Filipina ← 82 mm/th",
  },
  {
    plateName: "Lempeng Pasifik",
    baseCoords: [138.8, 1.2],
    rateMmYear: 102,
    azimuthDeg: 285, // WNW into New Guinea trench
    label: "Pasifik ← 102 mm/th",
  },
];
