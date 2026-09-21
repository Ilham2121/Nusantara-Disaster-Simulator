import { QuizQuestion } from "../simulation/types";

// ===== EARTHQUAKE QUIZ =====

export const earthquakeQuiz: QuizQuestion[] = [
  {
    id: "eq-q1",
    question: "Saat gempa terjadi di dalam ruangan, tindakan pertama yang paling tepat adalah?",
    options: [
      { key: "A", text: "Berlari keluar bangunan" },
      { key: "B", text: "Berdiri di dekat jendela" },
      { key: "C", text: "Drop, Cover, Hold On: merunduk, berlindung di bawah meja, dan bertahan" },
      { key: "D", text: "Menggunakan lift untuk turun ke lantai bawah" },
    ],
    correctAnswer: "C",
    explanation:
      "Saat guncangan berlangsung, prioritas utama adalah melindungi kepala dan tubuh dari benda jatuh. Merunduk di bawah meja kokoh (Drop, Cover, Hold On) adalah tindakan yang direkomendasikan BNPB. Berlari keluar berisiko tertimpa benda jatuh, dan lift bisa macet saat gempa.",
    difficulty: "easy",
    relatedScenario: "eq-urban",
  },
  {
    id: "eq-q2",
    question: "Apa perbedaan antara magnitudo dan intensitas gempa?",
    options: [
      { key: "A", text: "Keduanya mengukur hal yang sama" },
      { key: "B", text: "Magnitudo mengukur energi yang dilepaskan, intensitas mengukur dampak yang dirasakan di suatu lokasi" },
      { key: "C", text: "Intensitas selalu lebih besar dari magnitudo" },
      { key: "D", text: "Magnitudo diukur di permukaan, intensitas di bawah tanah" },
    ],
    correctAnswer: "B",
    explanation:
      "Magnitudo (M) mengukur total energi yang dilepaskan oleh gempa dari sumbernya (nilainya tetap untuk satu gempa). Intensitas (seperti skala MMI) mengukur dampak yang dirasakan di suatu lokasi tertentu: nilainya berbeda tergantung jarak, kedalaman, dan kondisi tanah.",
    difficulty: "medium",
  },
  {
    id: "eq-q3",
    question: "Mengapa gempa dangkal cenderung lebih merusak dibanding gempa dalam dengan magnitudo yang sama?",
    options: [
      { key: "A", text: "Gempa dangkal menghasilkan lebih banyak gelombang" },
      { key: "B", text: "Energi gempa dangkal lebih dekat ke permukaan sehingga guncangan lebih kuat" },
      { key: "C", text: "Gempa dalam tidak bisa dirasakan sama sekali" },
      { key: "D", text: "Kedalaman tidak memengaruhi kerusakan" },
    ],
    correctAnswer: "B",
    explanation:
      "Pada gempa dangkal, sumber energi lebih dekat ke permukaan bumi. Energi seismik mengalami pelemahan (atenuasi) saat merambat melalui batuan. Semakin dekat sumber ke permukaan, semakin sedikit pelemahan yang terjadi, sehingga guncangan di permukaan lebih kuat.",
    difficulty: "medium",
    relatedScenario: "eq-urban",
  },
  {
    id: "eq-q4",
    question: "Indonesia sering mengalami gempa karena berada di pertemuan beberapa lempeng tektonik. Lempeng mana saja?",
    options: [
      { key: "A", text: "Lempeng Pasifik dan Antartika" },
      { key: "B", text: "Lempeng Eurasia, Indo-Australia, dan Pasifik" },
      { key: "C", text: "Lempeng Afrika dan Amerika" },
      { key: "D", text: "Hanya Lempeng Indo-Australia" },
    ],
    correctAnswer: "B",
    explanation:
      "Indonesia terletak di pertemuan tiga lempeng tektonik utama: Lempeng Eurasia, Lempeng Indo-Australia, dan Lempeng Pasifik. Pergerakan dan tumbukan lempeng-lempeng ini menyebabkan Indonesia berada di zona seismik aktif yang dikenal sebagai 'Ring of Fire'.",
    difficulty: "easy",
  },
  {
    id: "eq-q5",
    question: "Setelah gempa besar berhenti, apa yang harus diwaspadai?",
    options: [
      { key: "A", text: "Tidak ada: gempa tidak pernah terjadi dua kali" },
      { key: "B", text: "Gempa susulan (aftershock) yang bisa terjadi dalam hitungan menit hingga hari" },
      { key: "C", text: "Cuaca buruk pasti akan menyusul" },
      { key: "D", text: "Gempa berikutnya pasti lebih besar" },
    ],
    correctAnswer: "B",
    explanation:
      "Gempa susulan (aftershock) umum terjadi setelah gempa utama. Gempa susulan bisa terjadi dalam hitungan menit, jam, bahkan berhari-hari atau berbulan-bulan kemudian. Meskipun biasanya lebih kecil dari gempa utama, gempa susulan masih bisa merusak bangunan yang sudah lemah.",
    difficulty: "easy",
    relatedScenario: "eq-coastal",
  },
];

// ===== ERUPTION QUIZ =====

export const eruptionQuiz: QuizQuestion[] = [
  {
    id: "er-q1",
    question: "Bahaya paling mematikan dari erupsi gunung api eksplosif adalah?",
    options: [
      { key: "A", text: "Aliran lava" },
      { key: "B", text: "Abu vulkanik" },
      { key: "C", text: "Awan panas (pyroclastic flow)" },
      { key: "D", text: "Suara letusan" },
    ],
    correctAnswer: "C",
    explanation:
      "Awan panas (pyroclastic flow) adalah campuran gas panas, abu, dan fragmen batuan yang mengalir menuruni lereng dengan kecepatan hingga 700 km/jam dan suhu hingga 700°C. Tidak ada yang bisa selamat jika terkena awan panas secara langsung. Lava biasanya bergerak lambat dan bisa dihindari.",
    difficulty: "easy",
    relatedScenario: "er-merapi",
  },
  {
    id: "er-q2",
    question: "Apa perbedaan antara erupsi efusif dan erupsi eksplosif?",
    options: [
      { key: "A", text: "Erupsi efusif hanya menghasilkan gas, eksplosif menghasilkan lava" },
      { key: "B", text: "Erupsi efusif ditandai aliran lava yang tenang, eksplosif ditandai ledakan material ke udara" },
      { key: "C", text: "Keduanya sama saja" },
      { key: "D", text: "Erupsi efusif lebih berbahaya dari eksplosif" },
    ],
    correctAnswer: "B",
    explanation:
      "Erupsi efusif ditandai oleh aliran lava yang relatif tenang dari kawah, umum pada magma basaltik yang encer. Erupsi eksplosif terjadi ketika tekanan gas sangat tinggi, melontarkan material vulkanik ke udara, umum pada magma andesitik yang lebih kental. Erupsi eksplosif umumnya lebih berbahaya.",
    difficulty: "medium",
  },
  {
    id: "er-q3",
    question: "Level aktivitas gunung api 'Awas' (Level IV) menurut PVMBG berarti?",
    options: [
      { key: "A", text: "Gunung api dalam kondisi normal" },
      { key: "B", text: "Perlu waspada tetapi tidak perlu evakuasi" },
      { key: "C", text: "Erupsi berbahaya segera terjadi atau sedang berlangsung: evakuasi zona bahaya" },
      { key: "D", text: "Gunung api sudah tidak aktif" },
    ],
    correctAnswer: "C",
    explanation:
      "Level IV (Awas) adalah status tertinggi. Artinya erupsi berbahaya segera terjadi atau sedang berlangsung. Masyarakat di zona bahaya harus segera dievakuasi. Level I = Normal, Level II = Waspada, Level III = Siaga, Level IV = Awas.",
    difficulty: "easy",
    relatedScenario: "er-merapi",
  },
  {
    id: "er-q4",
    question: "Mengapa abu vulkanik berbahaya meskipun terlihat seperti debu biasa?",
    options: [
      { key: "A", text: "Abu vulkanik sebenarnya tidak berbahaya" },
      { key: "B", text: "Abu vulkanik terdiri dari fragmen kaca dan batuan tajam yang merusak paru-paru, mesin, dan infrastruktur" },
      { key: "C", text: "Abu vulkanik hanya berbahaya jika dimakan" },
      { key: "D", text: "Abu vulkanik berbahaya karena sangat panas" },
    ],
    correctAnswer: "B",
    explanation:
      "Abu vulkanik bukan abu pembakaran biasa. Abu ini terdiri dari fragmen kaca vulkanik dan mineral yang sangat halus dan tajam. Menghirupnya bisa merusak paru-paru, menyebabkan gangguan pernapasan, iritasi mata, dan jika terakumulasi tebal dapat meruntuhkan atap bangunan. Abu juga merusak mesin pesawat dan kendaraan.",
    difficulty: "medium",
  },
  {
    id: "er-q5",
    question: "Jika Anda berada di area yang terkena hujan abu vulkanik, apa yang harus dilakukan?",
    options: [
      { key: "A", text: "Tetap di luar dan lanjutkan aktivitas" },
      { key: "B", text: "Masuk ke dalam ruangan, tutup pintu dan jendela, gunakan masker jika harus keluar" },
      { key: "C", text: "Mandi di sungai terdekat" },
      { key: "D", text: "Naik ke tempat tinggi" },
    ],
    correctAnswer: "B",
    explanation:
      "Saat hujan abu, masuk ke dalam ruangan dan tutup semua ventilasi untuk mencegah abu masuk. Jika harus keluar, gunakan masker atau kain basah untuk melindungi pernapasan. Tutup penampungan air bersih. Jangan berkendara karena jarak pandang sangat berkurang dan abu bisa merusak mesin.",
    difficulty: "easy",
    relatedScenario: "er-semeru",
  },
];

// ===== HELPERS =====

export const allQuizzes = [...earthquakeQuiz, ...eruptionQuiz];

export function getQuizByDisasterType(type: "earthquake" | "eruption"): QuizQuestion[] {
  return type === "earthquake" ? earthquakeQuiz : eruptionQuiz;
}

export function getQuizByScenario(scenarioId: string): QuizQuestion[] {
  return allQuizzes.filter((q) => q.relatedScenario === scenarioId);
}
