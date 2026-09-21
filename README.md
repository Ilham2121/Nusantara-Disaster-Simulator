# 🌋 Nusantara Disaster Simulator

[![Next.js](https://img.shields.io/badge/Next.js-15+-000000?style=flat&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-black?style=flat&logo=threedotjs)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**Nusantara Disaster Simulator** adalah platform edukasi interaktif visual dan simulasi 3D fisika untuk fenomena bencana geofisika Indonesia (Gempa Bumi & Erupsi Gunung Api). Proyek ini dibangun untuk meningkatkan literasi kebencanaan masyarakat melalui pendekatan visual real-time yang berbasis parameter ilmiah resmi (BMKG, PVMBG, BNPB / inaRISK).

---

## Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Struktur Direktori](#-struktur-direktori)
- [Panduan Memulai (Local Setup)](#-panduan-memulai-local-setup)
- [Prosedur Best Practice: Push ke GitHub](#-prosedur-best-practice-push-ke-github)
- [Panduan Kontribusi (Open for Contributors)](#-panduan-kontribusi-open-for-contributors)
- [Standar Koding & Commit](#-standar-koding--commit)
- [Lisensi & Kontak](#-lisensi--kontak)

---

## Fitur Utama

1. **Simulasi Gempa Bumi 3D (Seismic Simulator)**
   - Parameter Magnitudo, Kedalaman Hiposentrum, dan Tipe Sesar (Strike-Slip, Normal, Reverse).
   - Visualisasi gelombang seismik nyata (P-Wave, S-Wave, Surface Waves) dan Skala Intensitas MMI (Modified Mercalli Intensity).
   - Dynamic structural response & physics collapse simulation menggunakan Rapier Physics.
2. **Simulasi Erupsi Gunung Api (Volcanic Simulator)**
   - Indeks Letusan Vulkanik (VEI 1 - 7).
   - Visualisasi partikel dinamis: kolom erupsi (plume), awan panas guguran (pyroclastic flow), dan volcanic bombs.
   - Peta zonasi bahaya KRB (Kawasan Rawan Bencana).
3. **Pusat Edukasi & Mitigasi**
   - Panduan mitigasi langkah demi langkah sebelum, saat, dan sesudah bencana.
   - Quiz interaktif untuk menguji pemahaman mitigasi kebencanaan.
4. **Transparansi Ilmiah & Asumsi Model**
   - Dokumentasi parameter model, batasan simplifikasi edukatif, dan atribusi sumber data resmi.

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router), [React 19](https://react.dev/)
- **3D Graphics & Physics**: [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei), [@react-three/rapier](https://github.com/pmndrs/react-three-rapier)
- **Styling & UI**: [TailwindCSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Audio Effects**: [Howler.js](https://howlerjs.com/)
- **Testing**: [Vitest](https://vitest.dev/) (Unit/Integration), [Playwright](https://playwright.dev/) (E2E)

---

## Struktur Direktori

```text
Nusantara Disaster Simulator/
├── app/
│   ├── e2e/                     # End-to-End Tests (Playwright)
│   ├── public/                  # Static assets (audio, textures, icons)
│   ├── src/
│   │   ├── app/                 # Next.js App Router (pages & layouts)
│   │   ├── components/          # Reusable UI components (landing, layout, hud)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── stores/              # Zustand state stores
│   │   ├── three/               # 3D canvas, environments, models, & shaders
│   │   └── types/               # TypeScript interfaces & types
│   ├── Dockerfile               # Multi-stage production container build
│   ├── .dockerignore            # Docker ignore rules
│   ├── package.json             # App dependencies & scripts
│   ├── vitest.config.ts         # Vitest config
│   └── playwright.config.ts     # Playwright config
├── docker-compose.yml           # Production Docker Compose stack
├── docker-compose.dev.yml       # Development Docker Compose (Hot-reload)
├── .dockerignore                # Root Docker ignore rules
├── PRD.md                       # Product Requirement Document
├── design.md                    # Arsitektur & Desain Sistem
├── README.md                    # Dokumentasi Proyek
└── CONTRIBUTING.md              # Panduan Kontributor
```

---

## Panduan Memulai (Quickstart)

Pilih salah satu metode: **Menggunakan Docker (Rekomendasi Cepat)** atau **Lokal / Native Node.js**.

---

### Opsi A: Menjalankan dengan Docker (Rekomendasi Cepat 🐳)

Dengan Docker, Anda tidak perlu menginstal Node.js secara lokal.

#### 1. Mode Development (Hot-Reloading)
Menjalankan container development dengan live-reload otomatis saat kode diubah:
```bash
# Dari root repositori
docker compose -f docker-compose.dev.yml up --build
```
Buka browser di `http://localhost:3000`.

#### 2. Mode Production Build
Membangun image multi-stage yang telah teroptimasi:
```bash
# Dari root repositori
docker compose up --build -d
```
Untuk menghentikan container:
```bash
docker compose down
```

---

### Opsi B: Menjalankan secara Lokal (Native Node.js)

#### Prasyarat
- [Node.js](https://nodejs.org/) v18.18+ atau v20+
- `npm`, `pnpm`, atau `yarn`
- Git

#### Langkah Instalasi

1. **Clone repositori**:
   ```bash
   git clone https://github.com/<your-username>/nusantara-disaster-simulator.git
   cd "nusantara-disaster-simulator/app"
   ```

2. **Install dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan development server**:
   ```bash
   npm run dev
   ```
   Buka browser di `http://localhost:3000`.

4. **Menjalankan Pengujian (Testing)**:
   ```bash
   # Unit & Integration Tests (Vitest)
   npm run test

   # End-to-End Tests (Playwright)
   npm run test:e2e

   # Menjalankan seluruh test suite
   npm run test:all
   ```

---

## 📤 Prosedur Best Practice: Push ke GitHub

Ikuti langkah-langkah berikut untuk mengunggah proyek ini ke repositori GitHub baru dengan aman dan rapi:

### 1. Verifikasi `.gitignore` & Keamanan Kredensial
Pastikan file sensitif dan build artifacts **tidak ikut ter-commit**:
- `node_modules/`
- `.next/`
- `.env*.local`
- `*.tsbuildinfo`

### 2. Inisialisasi & Hubungkan ke Repositori GitHub

Jika Anda menginisialisasi dari root direktori proyek:
```bash
# Inisialisasi Git pada root
git init

# Pastikan default branch adalah main
git branch -M main

# Tambahkan seluruh file ke staging area
git add .

# Buat initial commit dengan format semantic commit
git commit -m "feat: initial release of Nusantara Disaster Simulator"

# Hubungkan dengan remote repository GitHub Anda
git remote add origin https://github.com/<your-username>/<repo-name>.git

# Push ke branch main di GitHub
git push -u origin main
```

### 3. Konfigurasi Repositori di GitHub (Rekomendasi)
- **Repository Description**: Isi ringkasan proyek dan tambahkan tags/topics: `nextjs`, `threejs`, `react-three-fiber`, `disaster-simulation`, `indonesia`, `science-education`.
- **Branch Protection Rule**: Aktifkan proteksi untuk branch `main` (require pull request review & pass CI status checks sebelum merge).
- **Issue Templates & Discussions**: Aktifkan fitur Issues dan GitHub Discussions untuk kolaborasi komunitas.

---

## Panduan Kontribusi (Open for Contributors)

Kami sangat menyambut kontribusi dari siapa saja, baik berupa penambahan fitur simulasi baru, penyempurnaan akurasi rumus ilmiah, perbaikan UI/UX, maupun dokumentasi!

### Alur Kontribusi (Git Workflow)

1. **Fork Repositori** ini ke akun GitHub Anda.
2. **Clone** hasil fork ke komputer lokal Anda:
   ```bash
   git clone https://github.com/<your-username>/nusantara-disaster-simulator.git
   cd "nusantara-disaster-simulator/app"
   ```
3. **Buat Branch Baru** untuk fitur atau perbaikan Anda:
   ```bash
   # Format: type/short-description
   git checkout -b feat/volcano-ash-dispersion
   # atau
   git checkout -b fix/seismic-mmi-calculation
   ```
4. **Lakukan Perubahan** dan pastikan kode berjalan dengan baik:
   ```bash
   npm run lint
   npm run test:all
   ```
5. **Commit Perubahan** dengan pesan yang jelas (mengikuti Conventional Commits):
   ```bash
   git add .
   git commit -m "feat: add atmospheric wind factor to volcano ash dispersion"
   ```
6. **Push Branch ke Fork Anda**:
   ```bash
   git push origin feat/volcano-ash-dispersion
   ```
7. **Buka Pull Request (PR)**:
   - Masuk ke repositori asli di GitHub.
   - Klik **Compare & pull request**.
   - Berikan deskripsi detail tentang apa yang diubah, lampirkan tangkapan layar/rekaman bila mengubah UI atau canvas 3D.
   - Tunggu review dari maintainer.

---

## Standar Koding & Commit

### 1. Conventional Commits
Gunakan konvensi commit standar berikut:
- `feat:` Menambahkan fitur baru.
- `fix:` Memperbaiki bug.
- `docs:` Perubahan dokumentasi.
- `style:` Format, whitespace, semicolon (tidak memengaruhi fungsionalitas kode).
- `refactor:` Refactoring kode tanpa mengubah fitur.
- `perf:` Peningkatan performa (misal: optimasi rendering Three.js).
- `test:` Menambahkan atau memperbaiki unit/e2e test.
- `chore:` Perubahan build tool, dependensi, atau konfigurasi.

### 2. Pedoman Performa 3D (Three.js & R3F)
- **Dispose Resources**: Pastikan geometry, material, dan textures di-*dispose* ketika komponen di-unmount.
- **Instancing**: Gunakan `InstancedMesh` untuk merender partikel atau objek berulang dalam jumlah besar.
- **Delta Time**: Selalu kalikan pergerakan atau animasi fisika dengan `delta` frame time pada `useFrame`.

---


## Kontak & Developer

- **Developer**: Ilham Aly Abdillah
- **Email**: [ilhamalyabdillah@gmail.com](mailto:ilhamalyabdillah@gmail.com)
- **GitHub Issues**: Silakan ajukan pertanyaan atau laporkan bug melalui GitHub Issues.

---

