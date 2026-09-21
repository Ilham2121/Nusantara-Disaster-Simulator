# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## 1. Informasi Produk

**Nama sementara:** Nusantara Disaster Simulator
**Tipe produk:** Web-based Interactive Disaster Education Platform
**Platform:** Web Desktop terlebih dahulu, mobile sebagai tahap lanjutan
**Target pengguna:** Pelajar, mahasiswa, guru, masyarakat umum, komunitas edukasi kebencanaan
**Fokus MVP:** Gempa bumi dan erupsi gunung api di Indonesia
**Konsep utama:** Pengguna memasukkan parameter skenario bencana, kemudian melihat simulasi visual 3D mengenai proses kejadian, dampak, serta tindakan mitigasi.

---

# 2. Product Vision

Membangun platform edukasi kebencanaan yang memungkinkan masyarakat **memahami bencana melalui pengalaman visual dan interaktif**, bukan hanya melalui teks, gambar, atau video.

Produk harus menjawab pertanyaan:

> “Apa yang secara visual dapat terjadi ketika bencana dengan karakteristik tertentu terjadi di suatu lingkungan Indonesia?”

Pengguna tidak hanya melihat bencana, tetapi memahami hubungan:

**Parameter bencana → proses kejadian → dampak → risiko → respons/mitigasi**

---

# 3. Problem Statement

Edukasi kebencanaan sering disampaikan melalui:

* artikel,
* poster,
* video,
* infografis,
* simulasi fisik.

Media tersebut memiliki keterbatasan dalam membantu pengguna memahami **hubungan sebab-akibat secara visual**.

Contohnya, pengguna mungkin mengetahui bahwa gempa berkekuatan besar dapat merusak bangunan, tetapi belum tentu memahami:

* bagaimana gelombang guncangan memengaruhi bangunan,
* mengapa bangunan tertentu lebih rentan,
* bagaimana kerusakan berkembang,
* apa yang harus dilakukan ketika guncangan dimulai,
* bagaimana situasi berubah setelah kejadian.

Pada erupsi, pengguna juga perlu memahami bahwa bahaya tidak hanya berupa lava, tetapi dapat meliputi:

* abu vulkanik,
* lontaran material,
* awan panas,
* aliran lava,
* lahar,
* zona terdampak.

Indonesia memiliki risiko tinggi terhadap berbagai bencana geologi. BNPB juga menyediakan data risiko nasional untuk gempa dan letusan gunung api melalui inaRISK.

---

# 4. Product Goal

## 4.1 Primary Goal

Menyediakan pengalaman belajar interaktif yang membuat pengguna dapat memahami:

1. karakteristik suatu bencana,
2. bagaimana bencana terjadi,
3. bagaimana dampaknya berkembang,
4. faktor yang memengaruhi tingkat dampak,
5. tindakan mitigasi yang tepat.

## 4.2 Secondary Goals

Produk juga diharapkan:

* meningkatkan awareness terhadap risiko bencana,
* menjadi media pembelajaran sekolah/kampus,
* menyediakan skenario simulasi berbasis kondisi Indonesia,
* memperkenalkan data kebencanaan resmi kepada pengguna,
* menjadi foundation untuk pengembangan simulator yang lebih kompleks.

---

# 5. Non-Goals

Untuk MVP, produk **tidak bertujuan** untuk:

* memprediksi kapan bencana akan terjadi,
* memprediksi lokasi gempa berikutnya,
* memprediksi jumlah korban nyata,
* menghitung kerusakan aktual suatu wilayah,
* menggantikan sistem peringatan dini pemerintah,
* memberikan rekomendasi evakuasi real-time,
* menjadi sistem emergency response.

Hal ini penting karena simulasi edukatif tidak boleh dianggap sebagai prediksi operasional.

---

# 6. Target User

## Persona 1 — Pelajar

**Umur:** 13–18 tahun

**Kebutuhan:**

* memahami fenomena alam,
* belajar dengan visual,
* pengalaman interaktif,
* materi yang mudah dipahami.

**Behavior:**
lebih tertarik terhadap animasi dan interaksi dibandingkan materi teks panjang.

---

## Persona 2 — Mahasiswa

**Umur:** 18–24 tahun

**Kebutuhan:**

* memahami fenomena secara lebih teknis,
* mengeksplorasi parameter simulasi,
* menggunakan platform sebagai media pembelajaran.

---

## Persona 3 — Guru/Dosen

**Kebutuhan:**

* media pembelajaran,
* demonstrasi fenomena,
* bahan diskusi kelas,
* simulasi yang dapat ditampilkan melalui proyektor.

---

## Persona 4 — General Public

**Kebutuhan:**

* memahami risiko bencana,
* mengetahui tindakan yang benar,
* meningkatkan kesiapsiagaan.

---

# 7. Core Product Experience

Core experience:

```text
Masuk Website
      ↓
Pilih Jenis Bencana
      ↓
Pilih Skenario
      ↓
Atur Parameter
      ↓
Mulai Simulasi
      ↓
Animasi 3D
      ↓
Dampak Ditampilkan
      ↓
Penjelasan Ilmiah
      ↓
Mitigasi / What Should You Do?
      ↓
Quiz / Knowledge Check
```

---

# 8. Konsep Simulasi

Produk menggunakan konsep:

## Scenario-Based Simulation

Alih-alih mengatakan:

> “Masukkan magnitude 8 lalu sistem menghitung kerusakan Indonesia.”

sistem menggunakan:

> “Pilih skenario gempa tertentu lalu eksplorasi konsekuensi yang telah dimodelkan untuk tujuan edukasi.”

Contoh:

```text
Jenis Bencana:
Gempa Bumi

Skenario:
Gempa Tektonik Darat

Magnitudo:
6.5

Kedalaman:
10 km

Lingkungan:
Permukiman Perkotaan

→ MULAI SIMULASI
```

Kemudian sistem menampilkan:

```text
T = 0 s
Gempa mulai

T = 5 s
Bangunan mulai mengalami guncangan

T = 10 s
Objek tertentu jatuh

T = 15 s
Kerusakan bangunan bertambah

T = 20 s
Gempa berakhir

T = +30 s
Fase respons dan mitigasi
```

---

# 9. Disaster Types

## MVP

### A. Gempa Bumi

Parameter utama:

* magnitude,
* kedalaman,
* lokasi/skenario,
* jenis lingkungan,
* durasi simulasi.

Dampak visual:

* tanah bergetar,
* bangunan berguncang,
* benda jatuh,
* kaca pecah,
* struktur rusak,
* listrik terganggu,
* objek bergerak.

Kemungkinan lanjutan:

* likuefaksi,
* tsunami,
* longsor.

Tetapi jangan masukkan semuanya ke MVP.

---

## B. Erupsi Gunung Api

Parameter utama:

* level aktivitas,
* skala erupsi/skenario,
* tipe erupsi,
* lokasi gunung,
* arah penyebaran abu,
* jarak permukiman.

Dampak:

* letusan,
* kolom abu,
* lontaran material,
* lava,
* awan panas,
* abu mencapai permukiman,
* visibility menurun,
* lingkungan tertutup abu.

Sistem harus membedakan jenis bahaya erupsi karena tidak semua erupsi menghasilkan dampak yang sama.

Contoh nyata: aktivitas Anak Krakatau pada September 2026 melibatkan episode erupsi menerus dan fenomena lava fountain, menunjukkan bahwa karakter erupsi jauh lebih kompleks daripada sekadar satu angka “kekuatan”.

---

# 10. Geographic Context

Produk harus memiliki konsep:

## Scenario Location

Lokasi merupakan parameter penting.

Untuk MVP tidak perlu langsung membuat seluruh Indonesia sebagai simulasi real-time.

Gunakan beberapa preset:

### Gempa

* Yogyakarta
* Padang
* Bandung
* Palu

### Gunung Api

* Merapi
* Semeru
* Anak Krakatau
* Rinjani

Setiap lokasi memiliki environment berbeda.

Contoh:

```text
Scenario:
Gempa Bandung

Environment:
Urban

Terrain:
Dataran perkotaan

Building:
Low-rise

Population:
High

Primary learning objective:
Earthquake preparedness
```

Tahap berikutnya dapat menggunakan data geografis nyata.

---

# 11. Simulation Engine

Simulation Engine merupakan inti produk.

Arsitekturnya:

```text
User Parameters
       ↓
Scenario Engine
       ↓
Simulation Rules
       ↓
Environment State
       ↓
Physics / Animation
       ↓
Visual Impact
       ↓
Educational Explanation
```

Simulation Engine tidak harus menggunakan simulasi fisika dunia nyata secara penuh.

Untuk MVP gunakan:

## Rule-Based Simulation

Contoh:

```text
IF earthquake magnitude >= 6
AND depth <= 20 km
THEN
    shakingIntensity = HIGH
```

Kemudian:

```text
IF shakingIntensity == HIGH
THEN
    objectFallProbability = HIGH
    buildingShakeAmplitude = HIGH
```

Ini jauh lebih realistis untuk MVP daripada mencoba membangun earthquake physics engine dari nol.

---

# 12. Impact Model

Dampak sebaiknya dibagi menjadi beberapa layer.

## Layer 1 — Environmental Impact

Contoh:

* tanah bergerak,
* abu,
* lava,
* asap,
* batuan.

## Layer 2 — Infrastructure Impact

Contoh:

* bangunan,
* jalan,
* tiang listrik,
* kendaraan,
* jembatan.

## Layer 3 — Human Impact

Untuk MVP **jangan divisualisasikan secara grafis atau eksplisit**.

Gunakan:

* jumlah kelompok masyarakat terdampak secara konseptual,
* status evakuasi,
* kondisi akses,
* kebutuhan mitigasi.

## Layer 4 — Response

Contoh:

```text
DROP
COVER
HOLD ON
```

atau:

```text
Jauhi lereng
Gunakan masker
Ikuti jalur evakuasi
```

---

# 13. 3D Environment

MVP menggunakan environment sederhana.

Komponen:

```text
Terrain
├── Ground
├── Mountain / Fault
├── Road
├── Houses
├── Buildings
├── Trees
├── Vehicles
└── People
```

Jangan membangun kota realistis sejak awal.

Prioritasnya adalah:

**educational clarity > visual complexity**

---

# 14. User Interface

## Landing Page

Hero section:

> Explore. Understand. Prepare.

Subheading:

> Pelajari bagaimana gempa bumi dan erupsi gunung api dapat memengaruhi lingkungan melalui simulasi 3D interaktif.

CTA:

**Mulai Simulasi**

Secondary CTA:

**Pelajari Bencana**

---

# 15. Simulation Setup Page

Layout:

```text
------------------------------------------------
| Jenis Bencana                                |
| [ Gempa Bumi ▼ ]                             |
------------------------------------------------

| Skenario                                     |
| [ Gempa Perkotaan ▼ ]                       |
------------------------------------------------

| Magnitudo                                    |
| 6.5                                           |
|----●--------------------------|              |
------------------------------------------------

| Kedalaman                                    |
| 10 km                                         |
------------------------------------------------

| Lingkungan                                   |
| [ Perkotaan ▼ ]                              |
------------------------------------------------

              [ MULAI SIMULASI ]
```

---

# 16. Simulation Screen

Layout:

```text
---------------------------------------------------------
| INFO                               TIME                |
| Magnitude 6.5                     00:15               |
| Depth: 10 km                                          |
---------------------------------------------------------
|                                                       |
|                  3D SIMULATION                        |
|                                                       |
|                 [CITY / TERRAIN]                      |
|                                                       |
|                                                       |
---------------------------------------------------------
| SIMULATION CONTROL                                    |
| ▶ Play | Pause | Restart | Speed 1x | 2x | 4x       |
---------------------------------------------------------
```

---

# 17. Educational Overlay

Saat simulasi berjalan, sistem menampilkan informasi singkat.

Contoh:

> **T+05 detik**
> Gelombang seismik mulai menyebabkan permukaan tanah bergetar.

Kemudian:

> **T+10 detik**
> Bangunan dengan struktur lebih rentan mengalami guncangan lebih besar.

Pada erupsi:

> **T+15 detik**
> Abu vulkanik mulai menyebar ke area permukiman.

Informasi harus muncul secara kontekstual, bukan melalui paragraf panjang.

---

# 18. After Simulation

Setelah simulasi selesai:

## Simulation Summary

```text
SIMULASI SELESAI

Jenis:
Gempa Bumi

Magnitude:
6.5

Kedalaman:
10 km

Lingkungan:
Perkotaan

Dampak Utama:
• Guncangan kuat
• Benda jatuh
• Kerusakan bangunan tertentu
• Gangguan aktivitas

RISIKO UTAMA
████████░░ Tinggi
```

Kemudian:

### What Should You Do?

```text
1. Lindungi kepala
2. Berlindung di bawah meja
3. Jauhi kaca
4. Setelah guncangan berhenti,
   keluar dengan tertib
```

---

# 19. Interactive Learning

Fitur penting agar produk tidak berubah menjadi “video game”.

## Quiz

Contoh:

> Saat gempa terjadi di dalam ruangan, tindakan pertama yang paling tepat adalah?

A. Berlari keluar
B. Berdiri di dekat jendela
C. Drop, Cover, Hold On
D. Menggunakan lift

Setelah menjawab:

```text
Jawaban benar.

Penjelasan:
Saat guncangan berlangsung, lindungi kepala dan tubuh
dari benda yang jatuh sebelum melakukan evakuasi.
```

---

# 20. Disaster Education Module

Selain simulator, terdapat halaman edukasi.

Kategori:

### Gempa Bumi

* Apa itu gempa?
* Mengapa Indonesia sering mengalami gempa?
* Magnitudo vs intensitas
* Jenis gelombang seismik
* Dampak gempa
* Mitigasi sebelum gempa
* Saat gempa
* Setelah gempa

### Erupsi Gunung Api

* Struktur gunung api
* Mengapa gunung meletus?
* Tipe erupsi
* Abu vulkanik
* Lava
* Awan panas
* Lahar
* Level aktivitas gunung api
* Mitigasi.

Materi edukasi harus merujuk sumber institusi resmi seperti BMKG dan Badan Geologi/PVMBG. BMKG sendiri menyediakan materi edukasi gempa, tsunami, dan mitigasi.

---

# 21. Data Strategy

Produk sebaiknya menggunakan dua kategori data.

## A. Official Data

Untuk informasi faktual dan referensi:

### BMKG

Untuk:

* data gempa,
* magnitude,
* kedalaman,
* koordinat,
* lokasi,
* potensi tsunami.

BMKG menyediakan data gempa terbuka dalam JSON/XML/JPG dan mengharuskan atribusi BMKG ketika digunakan dalam aplikasi.

### PVMBG / Badan Geologi

Untuk:

* aktivitas gunung api,
* status level,
* informasi erupsi,
* kawasan rawan bencana.

Informasi aktivitas gunung api dan kawasan rawan dirujuk melalui MAGMA Indonesia/PVMBG.

### BNPB / inaRISK

Untuk:

* peta risiko,
* data jiwa terpapar,
* data risiko wilayah,
* informasi spasial kebencanaan.

inaRISK menyediakan layer bahaya seperti gempa bumi, tsunami, dan letusan gunung api.

---

# 22. Data Architecture

```text
                OFFICIAL SOURCES
                     │
       ┌─────────────┼─────────────┐
       ↓             ↓             ↓
      BMKG          PVMBG         BNPB
       │             │             │
       └─────────────┼─────────────┘
                     ↓
                DATA LAYER
                     ↓
              Scenario Database
                     ↓
              Simulation Engine
                     ↓
                Web Renderer
                     ↓
                  User
```

---

# 23. Recommended Technology Stack

## Frontend

**Next.js / React**

Untuk:

* routing,
* UI,
* component architecture,
* state management.

## 3D Engine

### Recommended MVP:

**Three.js + React Three Fiber**

Alasan:

* ecosystem web kuat,
* cocok untuk interactive 3D,
* mudah diintegrasikan dengan React,
* kontrol animation cukup fleksibel.

Alternatif:

**Babylon.js**

lebih cocok bila kebutuhan simulation/game engine menjadi lebih kompleks.

---

# 24. Backend

MVP:

**Node.js / Next.js API**

Database:

**PostgreSQL**

ORM:

**Prisma**

Backend digunakan untuk:

* scenario management,
* educational content,
* user progress,
* quiz,
* simulation configuration.

---

# 25. Content Model

Contoh database:

```text
disasters
------------
id
name
category
description

scenarios
------------
id
disaster_id
name
location
difficulty

simulation_parameters
------------
scenario_id
magnitude
depth
duration
environment
impact_level

educational_contents
------------
id
disaster_id
title
content
source
source_url

quiz_questions
------------
id
content_id
question
option_a
option_b
option_c
option_d
correct_answer
explanation
```

---

# 26. Simulation Configuration

Jangan hard-code aturan simulasi di frontend.

Gunakan configuration.

Contoh:

```json
{
  "disaster": "earthquake",
  "scenario": "urban",
  "magnitude": 6.5,
  "depth": 10,
  "duration": 30,
  "shakeIntensity": 0.8,
  "objectFallProbability": 0.7
}
```

Dengan begitu simulation engine bisa berkembang tanpa mengubah seluruh kode frontend.

---

# 27. Functional Requirements

## FR-01 — Disaster Selection

User dapat memilih:

* Gempa Bumi
* Erupsi Gunung Api

## FR-02 — Scenario Selection

User dapat memilih skenario yang tersedia.

## FR-03 — Parameter Configuration

User dapat mengubah parameter yang diizinkan.

## FR-04 — Simulation Execution

Sistem dapat menjalankan simulasi berdasarkan parameter.

## FR-05 — Simulation Control

User dapat:

* play,
* pause,
* restart,
* mengubah kecepatan.

## FR-06 — Real-Time Visualization

Perubahan parameter memengaruhi visualisasi simulasi.

## FR-07 — Impact Visualization

Sistem menampilkan konsekuensi visual.

## FR-08 — Educational Explanation

Sistem menampilkan penjelasan contextual.

## FR-09 — Mitigation

Sistem menampilkan tindakan yang direkomendasikan.

## FR-10 — Quiz

User dapat menguji pemahaman setelah simulasi.

## FR-11 — Data Source

Sistem menampilkan sumber informasi ilmiah.

---

# 28. Non-Functional Requirements

## Performance

Target:

* initial page load < 3–5 detik pada koneksi normal,
* simulasi berjalan sekitar 30–60 FPS pada device target,
* asset 3D dioptimalkan.

## Accessibility

* keyboard navigable,
* readable typography,
* kontras memadai,
* tidak mengandalkan warna saja.

## Responsiveness

MVP:

* desktop,
* laptop.

Tablet:

Tahap berikutnya.

Mobile:

Tahap berikutnya karena rendering 3D akan membutuhkan optimasi tambahan.

---

# 29. MVP Scope

MVP jangan mencakup terlalu banyak.

## MVP Version 1

### Disaster

* Gempa
* Erupsi

### Simulation

* 2–4 scenario
* satu environment urban
* satu environment volcanic

### Interaction

* parameter input,
* play,
* pause,
* restart,
* speed.

### Visualization

* terrain,
* rumah,
* bangunan,
* kendaraan,
* gunung,
* gempa,
* abu,
* lava.

### Education

* explanation,
* impact summary,
* mitigation,
* quiz.

### Data

* static curated dataset,
* official references.

---

# 30. MVP User Flow

```text
LANDING
   │
   ↓
PILIH BENCANA
   │
   ├───────────────┐
   ↓               ↓
 GEMPA           ERUPSI
   │               │
   ↓               ↓
SCENARIO         SCENARIO
   │               │
   ↓               ↓
PARAMETER        PARAMETER
   │               │
   └───────┬───────┘
           ↓
      START SIMULATION
           ↓
       3D ANIMATION
           ↓
       IMPACT RESULT
           ↓
       MITIGATION
           ↓
          QUIZ
           ↓
     LEARNING SUMMARY
```

---

# 31. Future Version

## Version 2

Tambahkan:

* lebih banyak skenario,
* peta Indonesia,
* lokasi nyata,
* terrain berdasarkan DEM,
* data gempa aktual,
* data gunung api aktual,
* leaderboard quiz,
* user account,
* progress learning.

## Version 3

Tambahkan:

* real-time BMKG data,
* real-time status gunung api,
* GIS layer,
* multiple environments,
* tsunami simulation,
* landslide simulation,
* evacuation simulation.

## Version 4

Advanced Simulation:

* physics-based building response,
* population simulation,
* agent-based evacuation,
* spatial risk modeling,
* VR/AR.

---

# 32. Critical Design Decision

Produk harus menggunakan **dua mode simulasi**.

## Mode 1 — Educational Scenario

Data dikontrol oleh sistem.

Contoh:

```text
Magnitude 5
Magnitude 6
Magnitude 7
Magnitude 8
```

Tujuan:

> memahami hubungan parameter dan dampak.

## Mode 2 — Real Event Replay

Menggunakan data kejadian historis.

Contoh:

```text
Gempa Palu
Magnitude:
7.4

Depth:
10 km

Location:
Palu / Donggala
```

Tujuan:

> memahami kejadian nyata.

Ini jauh lebih menarik daripada sekadar slider magnitude.

BMKG juga memiliki katalog kejadian gempa bumi merusak dan tsunami Indonesia yang dapat menjadi basis future historical replay.

---

# 33. Learning Objective

Setiap simulasi harus memiliki learning objective.

Contoh:

### Scenario: Gempa 6.5

Learning Objective:

> Pengguna memahami bahwa magnitudo bukan satu-satunya faktor yang menentukan dampak gempa.

### Scenario: Erupsi

Learning Objective:

> Pengguna memahami bahwa erupsi dapat menghasilkan beberapa jenis bahaya dengan karakteristik berbeda.

Dengan konsep ini, fitur simulasi tidak menjadi sekadar “animasi keren”.

---

# 34. Success Metrics

## Product Metrics

Target MVP:

* > 70% pengguna menyelesaikan minimal satu simulasi,
* > 60% pengguna menyelesaikan quiz,
* > 70% pengguna memperoleh skor quiz ≥70,
* average session >5 menit.

## Educational Metrics

Gunakan:

### Pre-test

Sebelum simulasi:

```text
Apa yang harus dilakukan saat gempa?
```

### Simulation

User melihat simulasi.

### Post-test

Pertanyaan yang sama atau ekuivalen.

Success:

```text
Post-test Score
-
Pre-test Score
=
Learning Gain
```

Ini lebih bermakna daripada hanya menghitung jumlah visitor.

---

# 35. Risk Analysis

## Risk 1 — Visual terlalu kompleks

Dampaknya:

* development lama,
* performa buruk,
* edukasi malah terganggu.

Mitigasi:

> low-poly stylized 3D terlebih dahulu.

---

## Risk 2 — Simulasi dianggap sebagai prediksi nyata

Mitigasi:

Pada halaman simulasi tampilkan:

> “Simulasi ini merupakan model edukatif dan bukan prediksi kejadian bencana nyata.”

---

## Risk 3 — Model ilmiah tidak akurat

Ini adalah risiko terbesar.

Mitigasi:

* gunakan sumber resmi,
* validasi parameter,
* dokumentasikan asumsi,
* gunakan expert review jika produk akan dipublikasikan secara serius.

---

## Risk 4 — Scope explosion

Potensi:

```text
Gempa
+ Tsunami
+ Erupsi
+ Longsor
+ Banjir
+ Evakuasi
+ VR
+ Multiplayer
+ AI
+ Real-time
```

Ini akan membunuh proyek.

MVP harus tetap:

> **2 jenis bencana + beberapa scenario + 3D educational simulation.**

---

# 36. Development Breakdown

## Phase 1 — Research

Deliverables:

* disaster taxonomy,
* simulation assumptions,
* official data sources,
* educational objectives,
* scenario definitions.

---

## Phase 2 — UX Design

Deliverables:

* information architecture,
* user flow,
* wireframe,
* simulation UI,
* design system.

---

## Phase 3 — 3D Prototype

Deliverables:

* terrain,
* buildings,
* mountain,
* camera,
* lighting,
* basic animation.

---

## Phase 4 — Simulation Engine

Deliverables:

* parameter system,
* rule engine,
* impact calculation,
* animation trigger.

---

## Phase 5 — Educational Layer

Deliverables:

* explanation,
* mitigation,
* quiz,
* summary.

---

## Phase 6 — Backend

Deliverables:

* scenario API,
* content management,
* database,
* analytics.

---

## Phase 7 — Testing

### Technical Testing

* performance,
* browser compatibility,
* responsive layout,
* memory usage.

### Educational Testing

* comprehension,
* quiz results,
* user confusion,
* learning gain.

---

# 37. Suggested Team Structure

Untuk tim 3–5 orang:

### Product / Research

* disaster research,
* educational content,
* requirements.

### Frontend Engineer

* React/Next.js,
* UI,
* interaction.

### 3D Engineer

* Three.js / R3F,
* environment,
* animation,
* simulation visualization.

### Backend Engineer

* API,
* database,
* scenario system.

### UI/UX Designer

* information architecture,
* wireframe,
* interface.

Satu orang dapat memegang beberapa role untuk proyek individu.

---

# 38. Recommended Project Structure

```text
disaster-simulator/
│
├── app/
│   ├── page.tsx
│   ├── disasters/
│   ├── simulation/
│   └── education/
│
├── components/
│   ├── ui/
│   ├── simulation/
│   └── education/
│
├── simulation/
│   ├── engine/
│   ├── rules/
│   ├── scenarios/
│   └── animations/
│
├── 3d/
│   ├── environments/
│   ├── models/
│   ├── effects/
│   └── cameras/
│
├── data/
│   ├── scenarios/
│   ├── disasters/
│   └── education/
│
├── lib/
│   ├── api/
│   └── database/
│
└── public/
    ├── models/
    ├── textures/
    └── audio/
```

---

# 39. Example MVP Scenario

## Scenario: Earthquake in Urban Indonesia

Input:

```text
Disaster:
Earthquake

Magnitude:
6.5

Depth:
10 km

Environment:
Urban

Duration:
30 seconds
```

Simulation:

```text
0–5 sec
Initial shaking

5–10 sec
Buildings begin moving

10–20 sec
Objects fall
Windows break
Vehicles move

20–30 sec
Peak shaking

30+ sec
Shaking stops
Emergency state begins
```

Educational message:

> Besarnya dampak gempa tidak hanya dipengaruhi oleh magnitude, tetapi juga kedalaman, jarak dari sumber gempa, kondisi tanah, dan karakteristik bangunan.

---

# 40. Example MVP Scenario — Volcanic Eruption

Input:

```text
Disaster:
Volcanic Eruption

Scenario:
High Activity

Volcano:
Merapi

Eruption Type:
Explosive

Environment:
Volcanic Settlement
```

Simulation:

```text
0–10 sec
Increased volcanic activity

10–20 sec
Eruption begins

20–40 sec
Ash column develops

40–60 sec
Ash spreads toward settlement

60+ sec
Visibility decreases
People should evacuate
```

Educational focus:

> Pengguna mengenali jenis bahaya erupsi dan memahami pentingnya mengikuti informasi resmi serta zona rekomendasi.

---

# 41. Product Differentiator

Produk tidak boleh menjadi:

> “Earthquake animation website.”

Differentiator utama:

### Interactive Causal Learning

Pengguna mengubah parameter → melihat perubahan → memahami hubungan sebab-akibat.

Contoh:

```text
Magnitude 5
      ↓
guncangan moderat

Magnitude 6
      ↓
guncangan lebih kuat

Magnitude 7
      ↓
dampak lebih signifikan
```

Kemudian parameter lain diubah:

```text
Magnitude tetap

Depth:
10 km → dampak berbeda

Depth:
50 km → dampak berbeda
```

Dengan demikian pengguna **belajar dengan eksperimen**, bukan hanya menonton.

---

# 42. Scientific Integrity

Produk harus memiliki halaman:

## “How This Simulation Works”

Berisi:

* sumber data,
* asumsi,
* simplifikasi model,
* parameter,
* batasan simulasi.

Contoh:

> Model ini dirancang untuk edukasi. Visualisasi dampak merupakan pendekatan terstruktur berdasarkan parameter skenario dan tidak merepresentasikan prediksi kerusakan aktual.

Ini sangat penting apabila proyek nantinya dipublikasikan sebagai portfolio, penelitian, atau digunakan institusi pendidikan.

---

# 43. MVP Acceptance Criteria

MVP dianggap selesai apabila:

### User

* dapat memilih bencana,
* dapat memilih scenario,
* dapat memasukkan parameter,
* dapat menjalankan simulasi,
* dapat pause/restart,
* dapat melihat dampak,
* dapat membaca penjelasan,
* dapat melihat mitigasi,
* dapat menyelesaikan quiz.

### System

* simulasi berjalan tanpa crash,
* 3D environment ter-render,
* parameter memengaruhi simulasi,
* educational content tampil sesuai scenario,
* sumber informasi tercantum.

### Quality

* tidak memberikan klaim prediksi,
* sumber ilmiah jelas,
* performa dapat diterima,
* simulation state konsisten.

---

# 44. Prioritas Fitur

| Fitur                     | Priority |
| ------------------------- | -------- |
| Disaster Selection        | P0       |
| Scenario Selection        | P0       |
| Parameter Input           | P0       |
| 3D Simulation             | P0       |
| Simulation Controls       | P0       |
| Impact Visualization      | P0       |
| Educational Explanation   | P0       |
| Mitigation                | P0       |
| Quiz                      | P1       |
| Historical Replay         | P1       |
| Real BMKG Data            | P1       |
| Interactive Indonesia Map | P1       |
| User Account              | P2       |
| Progress Tracking         | P2       |
| Multiplayer               | P3       |
| VR/AR                     | P3       |
| AI Tutor                  | P3       |

---

# 45. Final Product Concept

Secara keseluruhan, produk memiliki arsitektur:

```text
                USER
                  │
                  ▼
          ┌───────────────┐
          │ Disaster      │
          │ Selection     │
          └───────┬───────┘
                  │
                  ▼
          ┌───────────────┐
          │ Scenario      │
          │ Configuration │
          └───────┬───────┘
                  │
                  ▼
          ┌───────────────┐
          │ Simulation    │
          │ Engine        │
          └───────┬───────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
   3D Environment      Impact Engine
        │                   │
        └─────────┬─────────┘
                  ▼
          ┌───────────────┐
          │ Visualization │
          └───────┬───────┘
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
     Impact    Education  Mitigation
        │         │         │
        └─────────┼─────────┘
                  ▼
                Quiz
                  │
                  ▼
            Learning Gain
```

---

# 46. Product Principle

Tiga prinsip utama produk:

### 1. Simulation before Information

Pengguna mengalami fenomena terlebih dahulu, kemudian mendapat penjelasan.

### 2. Understanding before Complexity

Model sederhana tetapi dapat dijelaskan lebih baik lebih bernilai daripada model kompleks yang tidak transparan.

### 3. Education before Entertainment

Visual 3D digunakan untuk meningkatkan pemahaman, bukan hanya membuat website terlihat keren.

---

# 47. Recommended First Milestone

Milestone pertama **bukan membuat seluruh website**.

Buat satu vertical slice:

> **Gempa bumi → satu environment → satu parameter magnitude → satu simulasi 30 detik → impact visualization → mitigation → quiz.**

Target:

```text
1 Disaster
1 Scenario
1 Environment
1 Simulation Engine
1 Educational Flow
```

Jika vertical slice ini sudah bekerja, barulah arsitektur diperluas ke erupsi.

Dengan strategi tersebut, proyek ini dapat berkembang dari **prototype visual → educational product → historical disaster replay → real-data-driven simulator**, tanpa harus membangun semuanya sekaligus.
