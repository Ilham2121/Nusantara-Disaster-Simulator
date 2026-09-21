# Nusantara Disaster Simulator — Design System & UX Guidelines

## 0. Purpose

Dokumen ini menjadi **single source of truth untuk visual design, UX, UI behavior, interaction, dan copywriting** Nusantara Disaster Simulator.

Design harus memenuhi 4 tujuan utama:

1. Menghindari **AI slop design**
2. Menghasilkan visual **modern, futuristik, tetapi tetap kredibel**
3. Memberikan **user experience yang jelas, cepat, dan immersive**
4. Menggunakan **CTA dan copywriting yang natural, manusiawi, dan kontekstual**

Dokumen ini wajib dibaca sebelum membuat atau mengubah komponen UI.

---

# 1. Design Philosophy

Produk ini bukan website game.

Produk ini bukan dashboard enterprise.

Produk ini bukan landing page startup AI.

Produk ini adalah:

> **interactive scientific learning experience**

Visual harus membuat pengguna merasa:

**“Saya sedang mengeksplorasi sebuah fenomena nyata.”**

bukan:

**“Saya sedang melihat template website AI.”**

Prioritas desain:

```text
Clarity
    >
Experience
    >
Credibility
    >
Visual sophistication
    >
Decoration
```

Elemen visual hanya boleh dipertahankan apabila mempunyai fungsi.

---

# 2. Anti AI-Slop Principles

## 2.1 Forbidden Visual Patterns

Hindari penggunaan berlebihan:

* glassmorphism
* massive gradient background
* neon purple/blue gradient
* glowing borders
* floating cards everywhere
* excessive rounded corners
* excessive blur
* giant centered text
* generic “AI futuristic” illustrations
* decorative 3D objects yang tidak berhubungan dengan bencana
* gradient text
* excessive shadows
* excessive icon usage
* meaningless statistics
* fake badges
* “Powered by AI” aesthetics

Jangan membuat:

```text
████████████████████
WELCOME TO THE FUTURE
████████████████████
```

dengan gradient besar dan tiga tombol CTA.

Itu terlihat generik.

---

# 3. Visual Direction

Visual direction:

**Scientific Futurism**

Bukan cyberpunk.

Bukan sci-fi gaming.

Bukan corporate dashboard.

Karakter visual:

* precise
* atmospheric
* restrained
* technical
* immersive
* editorial
* modern
* human

Inspirasi visual:

* scientific visualization
* observatory interfaces
* geological monitoring systems
* modern museum exhibitions
* aerospace mission interfaces
* premium educational products

---

# 4. Color System

Gunakan palet netral sebagai foundation.

## Background

Primary background:

```text
#0B0F14
```

Secondary:

```text
#111820
```

Surface:

```text
#18212B
```

Elevated surface:

```text
#202B36
```

## Text

Primary:

```text
#F2F5F7
```

Secondary:

```text
#A9B3BD
```

Muted:

```text
#6F7B86
```

## Accent

Gunakan **satu accent utama**.

Recommended:

```text
#57C7D9
```

Accent digunakan untuk:

* primary CTA
* active state
* timeline indicator
* selected parameter
* important interactive elements

Jangan gunakan accent pada semua elemen.

---

# 5. Disaster-Specific Colors

Warna bencana digunakan sebagai semantic color, bukan decoration.

## Earthquake

```text
Accent:
#D6A84F
```

Associations:

* seismic activity
* warning
* ground movement

## Volcanic Eruption

```text
Accent:
#E8754A
```

Associations:

* heat
* lava
* volcanic activity

## Danger

```text
#D95C5C
```

## Success

```text
#63B98A
```

## Information

```text
#57C7D9
```

Color harus mempunyai makna.

---

# 6. Typography

Gunakan maksimal **dua font family**.

Recommended:

### Display

```text
Space Grotesk
```

### Body

```text
Inter
```

Alternative:

```text
IBM Plex Sans
```

Typography hierarchy:

```text
Display
56–72px

H1
40–56px

H2
32–40px

H3
24–28px

Body Large
18–20px

Body
15–17px

Caption
12–14px
```

Jangan membuat seluruh halaman menggunakan font besar.

Gunakan hierarchy untuk membentuk reading flow.

---

# 7. Typography Personality

Headline harus terasa:

* confident
* concise
* informative

Hindari headline seperti:

> Experience The Future Of Disaster Simulation

atau:

> Unlock The Power Of Interactive Learning

Copy tersebut terdengar seperti template AI.

Lebih baik:

> **Lihat bagaimana gempa mengubah sebuah lingkungan.**

atau:

> **Apa yang terjadi ketika tanah mulai bergerak?**

---

# 8. Grid System

Gunakan layout berbasis grid.

Desktop:

```text
12-column grid
max-width: 1280px
```

Main horizontal padding:

```text
24–48px
```

Simulation interface:

```text
70% viewport
30% control / information panel
```

Tetapi panel tidak harus selalu berupa card.

Gunakan whitespace untuk memisahkan informasi.

---

# 9. Spacing System

Gunakan spacing konsisten:

```text
4
8
12
16
24
32
48
64
80
120
```

Hindari padding acak seperti:

```text
17px
23px
37px
51px
```

kecuali ada alasan visual yang jelas.

---

# 10. Border Radius

Gunakan radius moderat.

Recommended:

```text
Button:
10px

Input:
10px

Card:
14px

Large surface:
18px
```

Jangan membuat semua elemen:

```text
border-radius: 999px
```

Tidak semua elemen harus terlihat seperti pill.

---

# 11. Shadow

Shadow harus subtle.

Gunakan shadow untuk:

* elevation
* separation
* focus

Jangan menggunakan:

```text
huge glow
```

atau:

```text
colored neon shadow
```

kecuali untuk efek simulasi tertentu.

---

# 12. Surface Design

Tidak semua section harus menjadi card.

Gunakan tiga jenis surface:

### Open

Tidak memiliki background.

Untuk:

* hero
* editorial content
* explanatory text

### Subtle Surface

Background sedikit berbeda.

Untuk:

* grouped controls
* content sections

### Elevated Surface

Background + shadow/border.

Untuk:

* important controls
* modal
* active simulation panel

Tujuannya menciptakan visual hierarchy tanpa membanjiri interface dengan card.

---

# 13. Landing Page

Landing page harus mempunyai satu pekerjaan:

> Membuat pengguna memahami produk dan mulai bereksplorasi.

Hero structure:

```text
Eyebrow

Headline

Short explanation

Primary CTA
Secondary action

Visual preview / simulation environment
```

Jangan menggunakan hero penuh teks.

---

# 14. Hero Copy

Jangan menggunakan:

> Discover the future of disaster education.

Jangan menggunakan:

> Experience disaster like never before.

Gunakan bahasa yang konkret.

Contoh:

### Option A

> **Lihat bencana dari dekat. Pahami dampaknya.**

Supporting text:

> Eksplorasi simulasi 3D gempa bumi dan erupsi untuk memahami apa yang terjadi, mengapa dampaknya berbeda, dan bagaimana kita dapat bersiap.

CTA:

> Mulai eksplorasi

Secondary:

> Pelajari cara kerjanya

---

### Option B

> **Apa yang terjadi ketika bumi mulai bergerak?**

Supporting text:

> Ubah parameter simulasi, amati perubahan lingkungan, lalu cari tahu tindakan yang tepat.

CTA:

> Coba simulasi

---

# 15. CTA Philosophy

CTA harus menjelaskan tindakan yang akan dilakukan.

Prioritas:

```text
Mulai simulasi
Coba simulasi
Eksplorasi skenario
Lihat dampaknya
Pelajari bencananya
```

Hindari:

```text
Get Started
Learn More
Explore Now
Discover
Experience Now
Let's Go
```

kecuali konteksnya benar-benar mendukung.

---

# 16. CTA Hierarchy

Satu halaman hanya boleh memiliki **satu primary action**.

Contoh:

```text
[ Mulai simulasi ]
```

Secondary:

```text
Pelajari gempa
```

Tertiary:

```text
Bagaimana simulasi ini bekerja →
```

Jangan:

```text
[Mulai]
[Explore]
[Learn]
[Discover]
[Get Started]
```

semuanya tampil sebagai button utama.

---

# 17. Navigation

Navigation harus sederhana.

Recommended:

```text
Nusantara
Simulasi
Belajar
Tentang
```

Right side:

```text
Mulai simulasi
```

Jangan membuat navigation seperti dashboard enterprise.

---

# 18. Disaster Selection

Gunakan **visual comparison**, bukan dropdown tunggal.

Contoh:

```text
Pilih bencana yang ingin kamu eksplorasi

┌─────────────────┐   ┌─────────────────┐
│                 │   │                 │
│    GEMPA        │   │     ERUPSI      │
│                 │   │                 │
│ Getaran tanah   │   │ Aktivitas       │
│ dan dampaknya   │   │ vulkanik        │
│                 │   │                 │
│ Eksplorasi →    │   │ Eksplorasi →    │
└─────────────────┘   └─────────────────┘
```

Card hanya digunakan karena user sedang memilih dua domain.

Jangan membuat 10 kartu dekoratif.

---

# 19. Scenario Builder

Gunakan progressive disclosure.

Jangan menampilkan semua parameter sekaligus.

Flow:

```text
1. Pilih skenario
      ↓
2. Atur parameter utama
      ↓
3. Lihat ringkasan
      ↓
4. Jalankan simulasi
```

Parameter harus terasa seperti alat eksperimen.

---

# 20. Parameter UI

Untuk parameter numerik gunakan slider hanya ketika nilai kontinu dan perubahan visual mudah dipahami.

Contoh:

```text
Magnitude

5.0 ───────●──────── 8.0
            6.5
```

Tampilkan nilai aktual.

Jangan membuat slider tanpa label.

---

# 21. Parameter Explanation

Setiap parameter penting mempunyai contextual explanation.

Contoh:

```text
Magnitude
Ukuran energi gempa yang dilepaskan.

Depth
Kedalaman sumber gempa dari permukaan.
```

Gunakan bahasa sederhana.

Teknis boleh tersedia melalui:

> Pelajari lebih lanjut

---

# 22. Start Simulation

Sebelum mulai, tampilkan compact summary:

```text
SKENARIO
Gempa Perkotaan

MAGNITUDE
6.5

DEPTH
10 km

[ Jalankan simulasi ]
```

CTA harus menjadi konsekuensi alami dari konfigurasi.

---

# 23. Simulation Screen

Simulation screen merupakan **core product experience**.

Layout:

```text
┌───────────────────────────────────────────────────┐
│ Scenario          Time                            │
│ Earthquake        00:12                           │
├───────────────────────────────────────┬───────────┤
│                                       │           │
│                                       │ SIMULATION│
│              3D VIEWPORT              │ INFO      │
│                                       │           │
│                                       │           │
│                                       │           │
├───────────────────────────────────────┴───────────┤
│        ◀  Play  Pause  Restart  ▶                 │
└───────────────────────────────────────────────────┘
```

3D viewport harus mendominasi layar.

---

# 24. Simulation HUD

HUD harus minimal.

Display hanya:

* scenario
* elapsed time
* current phase
* intensity/status

Contoh:

```text
GEMPA PERKOTAAN

Peak shaking
00:14
```

Jangan menampilkan 12 metrik yang tidak dibutuhkan.

---

# 25. Simulation Timeline

Timeline harus membantu pemahaman.

Contoh:

```text
Preparation ── Shaking ── Peak ── Recovery
                  ●
                00:14
```

User dapat memahami posisi dalam proses tanpa membaca banyak teks.

---

# 26. Educational Overlay

Information muncul **ketika relevan**.

Contoh:

```text
PEAK SHAKING

Pada fase ini, pergerakan tanah
mencapai intensitas tertinggi
dalam skenario.

Perhatikan bagaimana objek
merespons guncangan.
```

Gunakan maksimal beberapa baris.

Jangan menghalangi viewport.

---

# 27. Post-Simulation UX

Setelah simulasi jangan langsung menampilkan:

> Congratulations!

Pengguna tidak sedang menyelesaikan game.

Gunakan transition:

```text
Simulation complete

Apa yang baru saja terjadi?
```

Kemudian:

```text
Parameter
↓
Observed effects
↓
Why it happened
↓
What to do
↓
Quiz
```

---

# 28. Result Language

Hindari klaim:

> Bangunan pasti runtuh.

Gunakan:

> Dalam skenario ini, guncangan menyebabkan pergerakan struktur yang lebih besar.

Atau:

> Model edukatif menunjukkan peningkatan dampak visual pada intensitas guncangan yang lebih tinggi.

Bahasa harus membedakan:

**simulation result**

dengan

**real-world prediction**

---

# 29. Mitigation Design

Mitigation section harus actionable.

Jangan menggunakan paragraf panjang.

Contoh:

```text
SAAT GEMPA

01
Lindungi kepala dan leher.

02
Berlindung di bawah permukaan yang kokoh.

03
Jauhi kaca dan benda yang dapat jatuh.
```

Kemudian:

> Pelajari langkah lengkap →

---

# 30. Quiz UX

Quiz harus terasa seperti bagian dari pembelajaran.

Jangan:

> YOU WIN!

Gunakan:

> **Seberapa baik kamu memahami skenarionya?**

Setelah selesai:

```text
4 / 5 benar

Kamu sudah memahami dasar respons
terhadap gempa dalam skenario ini.

[ Coba lagi ]

[ Eksplorasi skenario lain ]
```

---

# 31. Loading State

Jangan gunakan:

> Loading...

terus-menerus.

Gunakan context.

Contoh:

```text
Menyiapkan lingkungan simulasi...
```

atau:

```text
Memuat terrain...
```

atau:

```text
Menyiapkan skenario gempa...
```

Loading text harus mencerminkan proses nyata.

---

# 32. Empty State

Jangan:

> No data found.

Gunakan contextual language.

Contoh:

> Belum ada skenario untuk kombinasi ini.

> Pilih skenario lain untuk melanjutkan.

---

# 33. Error State

Error message harus:

* jelas
* manusiawi
* actionable

Jangan:

> Something went wrong.

Gunakan:

> Simulasi gagal dimuat.

> Coba muat ulang halaman. Jika masalah terus terjadi, gunakan skenario lain.

CTA:

> Muat ulang

---

# 34. Interaction Design

Gunakan motion untuk menjelaskan hubungan sebab-akibat.

Motion yang diperbolehkan:

* fade
* slide
* scale
* environmental movement
* camera movement
* simulation effects

Motion yang harus dihindari:

* bouncing buttons
* excessive hover animation
* infinite floating cards
* random particles
* decorative animations

Animation harus memiliki tujuan.

---

# 35. Transition Timing

UI:

```text
150–250ms
```

Large transitions:

```text
300–500ms
```

Simulation animation:

ditentukan oleh simulation engine.

Jangan membuat setiap elemen bergerak dengan duration yang berbeda tanpa alasan.

---

# 36. Hover States

Hover harus subtle.

Contoh:

```text
default
surface

hover
slightly brighter surface

active
accent border / accent indicator
```

Jangan menggunakan:

```text
massive scale
neon glow
rotation
```

---

# 37. Focus State

Keyboard navigation harus memiliki visible focus.

Gunakan:

```text
2px accent outline
```

Jangan menghilangkan default focus tanpa menggantinya.

---

# 38. Accessibility

Minimum:

* keyboard accessible
* semantic HTML
* visible focus
* sufficient contrast
* readable text
* aria-label untuk interactive controls
* don't rely exclusively on color
* respect reduced motion where possible

---

# 39. Responsive Behavior

Desktop:

```text
3D experience-first
```

Tablet:

```text
3D + compact control panel
```

Mobile:

Jika 3D penuh terlalu berat:

```text
3D viewport
↓
Control drawer
↓
Educational content
```

Jangan mengecilkan seluruh desktop interface secara proporsional.

Responsive design harus mengubah layout, bukan hanya ukuran.

---

# 40. 3D Visual Style

3D environment:

* stylized realistic
* low-poly
* restrained
* believable
* geographically inspired

Jangan menggunakan asset dengan style yang berbeda-beda.

Contoh yang harus dihindari:

```text
photorealistic building
+
cartoon tree
+
low-poly car
+
anime character
```

Semua asset harus memiliki visual language yang konsisten.

---

# 41. 3D Composition

Prioritaskan:

1. readability
2. depth
3. scale
4. environmental context

Jangan membuat:

* excessive fog
* excessive bloom
* cinematic camera movement setiap saat
* unnecessary post-processing

Pengguna harus dapat membaca apa yang sedang terjadi.

---

# 42. Visual Hierarchy

Setiap screen harus memiliki:

```text
Primary
Secondary
Tertiary
```

Contoh simulation screen:

Primary:

> 3D simulation

Secondary:

> Simulation phase

Tertiary:

> Parameter details

Jangan membuat semuanya memiliki visual weight yang sama.

---

# 43. Copywriting Principles

Copy harus:

* sederhana
* natural
* konkret
* conversational tetapi tidak terlalu santai
* informatif
* tidak clickbait

Tulis seperti manusia yang menjelaskan sesuatu dengan percaya diri.

---

# 44. Words to Avoid

Hindari kata-kata marketing generik:

```text
revolutionary
next-generation
cutting-edge
unlock
seamless
empower
transform
redefine
game-changing
immersive experience
future of learning
```

Gunakan kata konkret.

---

# 45. Copywriting Formula

Gunakan:

```text
WHAT
+
WHY
+
ACTION
```

Contoh:

> Atur magnitudo dan kedalaman gempa. Lihat bagaimana perubahan parameter memengaruhi simulasi.

CTA:

> Jalankan simulasi

---

# 46. Natural Microcopy

Parameter:

> Sesuaikan kondisi skenario.

Start:

> Jalankan simulasi

Pause:

> Jeda simulasi

Restart:

> Ulangi simulasi

Next:

> Lanjut

Learn:

> Kenapa dampaknya berbeda?

Quiz:

> Uji pemahaman

Back:

> Kembali ke skenario

---

# 47. Information Density

Jangan takut whitespace.

Setiap screen harus menjawab:

> Apa yang perlu diketahui user sekarang?

Bukan:

> Informasi apa yang bisa kita masukkan?

Progressive disclosure lebih penting daripada completeness pada satu screen.

---

# 48. Design Components

Komponen utama:

```text
Button
IconButton
Input
Slider
Select
Badge
Tabs
Panel
Modal
Tooltip
Progress
Timeline
StatusIndicator
SimulationHUD
SimulationControls
ScenarioCard
DisasterCard
EducationalOverlay
ImpactSummary
MitigationCard
QuizCard
```

Komponen harus reusable tetapi jangan membuat abstraction terlalu dini.

---

# 49. Button Variants

## Primary

Untuk:

* Start simulation
* Main CTA

## Secondary

Untuk:

* alternative action

## Ghost

Untuk:

* low-priority navigation

## Danger

Hanya untuk destructive action.

Jangan membuat setiap button terlihat primary.

---

# 50. Iconography

Gunakan satu icon library.

Recommended:

```text
Lucide
```

Icon style:

* simple
* consistent
* outline based

Jangan mencampur:

* emoji
* SVG random
* icon library berbeda.

---

# 51. Images and Assets

Gunakan visual yang memiliki hubungan langsung dengan:

* geology
* disaster
* environment
* education

Hindari stock photo generic seperti:

> orang tersenyum melihat laptop.

Visual harus membantu storytelling.

---

# 52. Landing Page Content Structure

Recommended:

```text
01 Hero
↓
02 How It Works
↓
03 Explore Disasters
↓
04 Interactive Preview
↓
05 Learn From The Simulation
↓
06 Scientific Transparency
↓
07 CTA
```

Jangan menambahkan section hanya untuk membuat landing page panjang.

---

# 53. How It Works

Gunakan tiga tahap:

```text
01
Pilih skenario

02
Atur parameter

03
Lihat dan pahami dampaknya
```

Copy harus singkat.

---

# 54. Scientific Transparency

Sediakan section:

> **Bagaimana simulasi ini bekerja?**

Copy:

> Model ini dibuat untuk membantu memahami hubungan antara kondisi bencana dan dampaknya secara visual. Hasil simulasi disederhanakan untuk tujuan edukasi dan bukan prediksi kerusakan nyata.

CTA:

> Lihat asumsi model →

Ini meningkatkan trust.

---

# 55. Final CTA

Hindari:

> Start Your Journey Today!

Gunakan:

> **Coba satu skenario. Lihat apa yang berubah.**

CTA:

> Mulai simulasi

Natural, spesifik, dan sesuai konteks produk.

---

# 56. Design Review Checklist

Sebelum sebuah UI dianggap selesai, evaluasi:

## Anti AI Slop

* [ ] Apakah ada terlalu banyak gradient?
* [ ] Apakah semua elemen berbentuk card?
* [ ] Apakah terlalu banyak rounded corners?
* [ ] Apakah ada glow tanpa fungsi?
* [ ] Apakah visual terlihat seperti template AI?
* [ ] Apakah ada decorative element yang tidak memiliki fungsi?

## UX

* [ ] Apakah user tahu harus melakukan apa?
* [ ] Apakah primary CTA jelas?
* [ ] Apakah informasi muncul pada waktu yang tepat?
* [ ] Apakah user dapat kembali tanpa kebingungan?
* [ ] Apakah error memberikan tindakan yang jelas?

## Copywriting

* [ ] Apakah copy terdengar seperti manusia?
* [ ] Apakah kalimat konkret?
* [ ] Apakah CTA menjelaskan tindakan?
* [ ] Apakah tidak ada jargon marketing?
* [ ] Apakah tidak menggunakan klaim berlebihan?

## Visual

* [ ] Apakah hierarchy jelas?
* [ ] Apakah whitespace cukup?
* [ ] Apakah warna memiliki fungsi?
* [ ] Apakah typography konsisten?
* [ ] Apakah 3D membantu pemahaman?

---

# 57. Golden Rule

Ketika memilih antara:

```text
More visual effects
vs
Better understanding
```

pilih:

**Better understanding.**

Ketika memilih antara:

```text
More features
vs
Better user flow
```

pilih:

**Better user flow.**

Ketika memilih antara:

```text
Visually impressive
vs
Scientifically transparent
```

pilih:

**Scientifically transparent.**

---

# 58. AI Coding Rule

Coding agent MUST treat this file as a design constraint.

Before creating UI:

1. Read `design.md`.
2. Follow existing design tokens.
3. Reuse existing components where appropriate.
4. Do not introduce a new visual pattern without reason.
5. Do not add decorative effects merely because they look impressive.
6. Do not generate generic AI landing-page patterns.
7. Preserve consistency with the existing visual language.

If a requested UI conflicts with these principles, prefer the design system unless the task explicitly overrides it.

---

# 59. Core Design Identity

The final visual identity should feel like:

**A modern scientific observatory for understanding disasters.**

Not:

**A futuristic AI startup landing page.**

Not:

**A disaster video game.**

Not:

**A generic SaaS dashboard.**

The product should feel:

> **calm, precise, immersive, intelligent, and trustworthy.**
