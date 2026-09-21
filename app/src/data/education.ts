// ===== EDUCATIONAL CONTENT DATA =====

export interface EducationArticle {
  id: string;
  disasterType: "earthquake" | "eruption";
  title: string;
  summary: string;
  sections: {
    heading: string;
    content: string;
    source?: string;
  }[];
  sources: { name: string; url?: string }[];
}

// ===== EARTHQUAKE ARTICLES =====

export const earthquakeArticles: EducationArticle[] = [
  {
    id: "edu-eq-01",
    disasterType: "earthquake",
    title: "Apa Itu Gempa Bumi?",
    summary: "Memahami fenomena gempa bumi dan mengapa Indonesia sering mengalaminya.",
    sections: [
      {
        heading: "Definisi",
        content:
          "Gempa bumi adalah getaran atau guncangan pada permukaan bumi akibat pelepasan energi secara tiba-tiba dari dalam bumi. Energi ini biasanya berasal dari pergerakan lempeng tektonik, aktivitas vulkanik, atau runtuhan batuan.",
        source: "BMKG",
      },
      {
        heading: "Mengapa Indonesia Sering Gempa?",
        content:
          "Indonesia terletak di pertemuan tiga lempeng tektonik utama: Lempeng Eurasia, Indo-Australia, dan Pasifik. Tumbukan dan gesekan antar lempeng ini menghasilkan energi yang dilepaskan sebagai gempa. Indonesia juga berada di Ring of Fire, zona paling aktif secara seismik di dunia.",
        source: "BMKG",
      },
      {
        heading: "Jenis Gempa",
        content:
          "Ada tiga jenis utama gempa: (1) Gempa tektonik: disebabkan pergerakan lempeng, paling umum dan berpotensi besar; (2) Gempa vulkanik: disebabkan aktivitas magma; (3) Gempa runtuhan: disebabkan runtuhnya gua atau tambang.",
        source: "BMKG",
      },
    ],
    sources: [
      { name: "BMKG", url: "https://www.bmkg.go.id" },
    ],
  },
  {
    id: "edu-eq-02",
    disasterType: "earthquake",
    title: "Magnitudo vs Intensitas",
    summary: "Perbedaan penting antara dua cara mengukur gempa yang sering membingungkan.",
    sections: [
      {
        heading: "Magnitudo",
        content:
          "Magnitudo mengukur total energi yang dilepaskan gempa dari sumbernya. Satu gempa hanya memiliki satu nilai magnitudo. BMKG menggunakan skala Mw (moment magnitude). Setiap kenaikan 1 poin magnitudo, energi yang dilepaskan meningkat sekitar 32 kali lipat.",
        source: "BMKG",
      },
      {
        heading: "Intensitas (MMI)",
        content:
          "Intensitas mengukur efek atau dampak gempa yang dirasakan di suatu lokasi. Satu gempa bisa memiliki banyak nilai intensitas yang berbeda di lokasi yang berbeda. Indonesia menggunakan skala Modified Mercalli Intensity (MMI) dari I (tidak terasa) hingga XII (kerusakan total).",
        source: "BMKG",
      },
      {
        heading: "Hubungan Keduanya",
        content:
          "Gempa M5 yang dangkal (5 km) bisa terasa lebih kuat (intensitas tinggi) dibanding gempa M7 yang dalam (100 km) di lokasi yang sama. Faktor yang memengaruhi intensitas: magnitudo, kedalaman, jarak dari episentrum, kondisi tanah, dan tipe bangunan.",
      },
    ],
    sources: [
      { name: "BMKG", url: "https://www.bmkg.go.id" },
    ],
  },
  {
    id: "edu-eq-03",
    disasterType: "earthquake",
    title: "Mitigasi Gempa Bumi",
    summary: "Tindakan sebelum, saat, dan setelah gempa untuk mengurangi risiko.",
    sections: [
      {
        heading: "Sebelum Gempa",
        content:
          "Kenali jalur evakuasi dan titik kumpul. Amankan furnitur berat ke dinding. Siapkan tas siaga berisi obat-obatan, air, senter, dokumen penting. Pelajari Drop, Cover, Hold On. Periksa konstruksi bangunan.",
        source: "BNPB",
      },
      {
        heading: "Saat Gempa (Indoor)",
        content:
          "DROP (merunduk ke lantai). COVER (berlindung di bawah meja kokoh, lindungi kepala dan leher). HOLD ON (pegang erat tempat berlindung). Jauhi jendela, kaca, lampu gantung. JANGAN gunakan lift. Jangan berlari keluar saat masih berguncang.",
        source: "BNPB",
      },
      {
        heading: "Saat Gempa (Outdoor)",
        content:
          "Jauhi bangunan, tiang listrik, pohon, dan rambu jalan. Cari area terbuka. Jika sedang berkendara, berhenti di tempat aman dan tetap di dalam kendaraan.",
        source: "BNPB",
      },
      {
        heading: "Setelah Gempa",
        content:
          "Periksa diri sendiri dan sekitar. Jauhi bangunan rusak. Waspada gempa susulan. Periksa instalasi gas, listrik, dan air. Ikuti arahan petugas. Jika di pesisir dan gempa terasa kuat lebih dari 20 detik, segera ke tempat tinggi (potensi tsunami).",
        source: "BNPB",
      },
    ],
    sources: [
      { name: "BNPB", url: "https://www.bnpb.go.id" },
      { name: "BMKG", url: "https://www.bmkg.go.id" },
    ],
  },
];

// ===== ERUPTION ARTICLES =====

export const eruptionArticles: EducationArticle[] = [
  {
    id: "edu-er-01",
    disasterType: "eruption",
    title: "Struktur dan Jenis Gunung Api",
    summary: "Memahami anatomi gunung api dan mengapa gunung bisa meletus.",
    sections: [
      {
        heading: "Struktur Gunung Api",
        content:
          "Gunung api tersusun dari dapur magma di kedalaman, saluran magma (conduit), dan kawah di puncak. Magma adalah batuan leleh yang mengandung gas terlarut. Ketika magma naik ke permukaan, tekanan berkurang dan gas terlepas, mendorong erupsi.",
        source: "PVMBG",
      },
      {
        heading: "Mengapa Gunung Meletus?",
        content:
          "Erupsi terjadi ketika tekanan gas dalam magma melebihi kekuatan batuan di atasnya. Magma yang naik dari kedalaman membawa gas dan panas. Semakin kental magma dan semakin banyak gas, semakin eksplosif erupsinya.",
        source: "PVMBG",
      },
      {
        heading: "Indonesia dan Gunung Api",
        content:
          "Indonesia memiliki 127 gunung api aktif, terbanyak di dunia. Ini karena posisi Indonesia di zona subduksi tempat lempeng Indo-Australia menunjam di bawah Lempeng Eurasia. Proses ini menghasilkan magma yang membentuk busur vulkanik.",
        source: "PVMBG",
      },
    ],
    sources: [
      { name: "PVMBG / MAGMA Indonesia", url: "https://magma.esdm.go.id" },
    ],
  },
  {
    id: "edu-er-02",
    disasterType: "eruption",
    title: "Jenis Bahaya Erupsi",
    summary: "Erupsi bukan hanya tentang lava: kenali semua jenis bahayanya.",
    sections: [
      {
        heading: "Awan Panas (Pyroclastic Flow)",
        content:
          "Campuran gas panas, abu, dan fragmen batuan yang mengalir menuruni lereng dengan kecepatan hingga 700 km/jam dan suhu hingga 700°C. Bahaya paling mematikan karena tidak bisa dihindari jika sudah terlalu dekat.",
        source: "PVMBG",
      },
      {
        heading: "Abu Vulkanik",
        content:
          "Fragmen kaca dan batuan vulkanik sangat halus yang tersebar lewat udara. Berbahaya bagi pernapasan, merusak mesin, kontaminasi air, dan jika tebal bisa meruntuhkan atap. Bisa menyebar ratusan kilometer dari sumber.",
        source: "PVMBG",
      },
      {
        heading: "Aliran Lava",
        content:
          "Batuan leleh yang mengalir dari kawah. Umumnya bergerak lambat (beberapa km/jam) sehingga bisa dihindari. Namun lava basaltik yang encer bisa bergerak lebih cepat. Merusak semua yang dilewati.",
        source: "PVMBG",
      },
      {
        heading: "Lahar",
        content:
          "Aliran material vulkanik yang bercampur air (hujan atau salju/es yang meleleh). Lahar mengalir mengikuti lembah sungai dengan kekuatan besar dan bisa terjadi saat erupsi atau bahkan berbulan-bulan setelahnya.",
        source: "PVMBG",
      },
      {
        heading: "Lontaran Material",
        content:
          "Batu dan material vulkanik yang dilontarkan ke udara saat erupsi. Material besar (bom vulkanik) jatuh di dekat kawah, material halus bisa tersebar jauh.",
        source: "PVMBG",
      },
    ],
    sources: [
      { name: "PVMBG / MAGMA Indonesia", url: "https://magma.esdm.go.id" },
      { name: "BNPB", url: "https://www.bnpb.go.id" },
    ],
  },
  {
    id: "edu-er-03",
    disasterType: "eruption",
    title: "Level Aktivitas & Mitigasi Erupsi",
    summary: "Sistem peringatan level aktivitas gunung api Indonesia dan tindakan mitigasi.",
    sections: [
      {
        heading: "Level I: Normal",
        content:
          "Gunung api dalam keadaan dasar. Aktivitas seismik dan visual dalam batas normal. Tidak ada pembatasan aktivitas masyarakat.",
        source: "PVMBG",
      },
      {
        heading: "Level II: Waspada",
        content:
          "Peningkatan aktivitas di atas normal. Masyarakat di sekitar gunung perlu waspada. Tidak boleh mendekati kawah. Koordinasi dengan BPBD setempat dimulai.",
        source: "PVMBG",
      },
      {
        heading: "Level III: Siaga",
        content:
          "Peningkatan aktivitas signifikan. Masyarakat di zona bahaya harus bersiap evakuasi. Radius bahaya diperluas. Posko pengungsi disiapkan.",
        source: "PVMBG",
      },
      {
        heading: "Level IV: Awas",
        content:
          "Erupsi berbahaya segera terjadi atau sedang berlangsung. Evakuasi zona bahaya. Larangan aktivitas di radius bahaya. Semua masyarakat di zona bahaya harus mengungsi.",
        source: "PVMBG",
      },
      {
        heading: "Mitigasi",
        content:
          "Kenali zona bahaya gunung api terdekat. Siapkan tas siaga. Ketahui jalur evakuasi. Pantau informasi PVMBG dan BPBD. Gunakan masker saat hujan abu. Jauhi lembah sungai yang berhulu di gunung api saat hujan deras (risiko lahar).",
        source: "BNPB",
      },
    ],
    sources: [
      { name: "PVMBG / MAGMA Indonesia", url: "https://magma.esdm.go.id" },
      { name: "BNPB", url: "https://www.bnpb.go.id" },
    ],
  },
];

// ===== HELPERS =====

export const allArticles = [...earthquakeArticles, ...eruptionArticles];

export function getArticlesByType(type: "earthquake" | "eruption"): EducationArticle[] {
  return type === "earthquake" ? earthquakeArticles : eruptionArticles;
}

export function getArticleById(id: string): EducationArticle | undefined {
  return allArticles.find((a) => a.id === id);
}
