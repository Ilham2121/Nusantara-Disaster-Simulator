# 🤝 Panduan Kontribusi - Nusantara Disaster Simulator

Terima kasih atas minat Anda untuk berkontribusi pada **Nusantara Disaster Simulator**! Proyek ini bersifat *open-source* dan didedikasikan untuk riset serta edukasi publik mengenai fenomena bencana geofisika di Indonesia.

---

## 🧭 Cara Berkontribusi

Ada berbagai cara untuk berkontribusi:
1. **Melaporkan Bug**: Temukan bug atau perilaku yang tidak sesuai dan buat *Bug Report*.
2. **Mengusulkan Fitur Baru**: Sarankan skenario simulasi baru (misal: Tsunami, Likuefaksi mendalam) atau perbaikan visual/audio.
3. **Mengembangkan Kode**: Memperbaiki issue yang ada atau membuat fitur baru.
4. **Meningkatkan Dokumentasi**: Memperjelas penjelasan rumus fisika, panduan mitigasi, atau instruksi instalasi.

---

## 🚀 Alur Kerja Kontributor (GitHub Flow)

### 1. Fork & Clone
Fork repositori ini ke akun GitHub Anda, lalu clone secara lokal:
```bash
git clone https://github.com/<your-username>/nusantara-disaster-simulator.git
cd "nusantara-disaster-simulator/app"
```

### 2. Setup Environment

Anda dapat menggunakan salah satu metode di bawah ini:

**Opsi A: Menggunakan Docker (Direkomendasikan)**
```bash
# Dari root repositori, jalankan container dengan hot-reload
docker compose -f docker-compose.dev.yml up --build
```
Aplikasi akan tersedia di `http://localhost:3000` dengan sinkronisasi kode langsung.

**Opsi B: Menggunakan Node.js Lokal**
```bash
cd "app"
npm install
npm run dev
```

### 3. Buat Branch Kerja
Gunakan format nama branch yang deskriptif:
- `feat/<fitur-baru>` untuk penambahan fitur
- `fix/<deskripsi-bug>` untuk perbaikan bug
- `docs/<perubahan-dokumen>` untuk dokumentasi
- `perf/<optimasi>` untuk peningkatan performa

Contoh:
```bash
git checkout -b feat/mmi-isoseismal-contour
```

### 4. Menulis Kode & Pengujian
Pastikan kode mematuhi standar proyek:
- Jalankan linting:
  ```bash
  npm run lint
  ```
- Jalankan automated tests:
  ```bash
  npm run test:all
  ```

### 5. Format Pesan Commit (Conventional Commits)
Gunakan format:
`<tipe>(<lingkup-opsional>): <deskripsi singkat>`

Contoh:
- `feat(earthquake): add P-wave attenuation calculation`
- `fix(volcano): resolve particle leak on camera reset`
- `docs(readme): update contributor setup instructions`

### 6. Buka Pull Request (PR)
1. Push branch ke repositori fork Anda:
   ```bash
   git push origin feat/mmi-isoseismal-contour
   ```
2. Buka PR ke branch `main` repositori utama.
3. Jelaskan perubahan yang dilakukan, alasan perubahan, serta sertakan tangkapan layar/GIF jika ada perubahan visual.

---

## 📐 Standar Koding & Arsitektur

- **TypeScript Strict**: Hindari penggunaan `any`. Selalu definisikan tipe data di `src/types/`.
- **Three.js & WebGL Hygiene**:
  - Gunakan `useFrame` secara efisien (hindari alokasi objek/vektor baru di dalam loop `useFrame`).
  - Lakukan pembersihan resource (dispose geometry, materials, textures) pada lifecycle cleanup.
- **State Management**: Gunakan Zustand store (`src/stores/`) untuk state simulasi global.
- **Aksesibilitas & UX**: Pastikan teks memiliki kontras tinggi dan UI responsif di berbagai resolusi layar.

---

## 📬 Kontak & Bantuan

Jika ada pertanyaan atau butuh diskusi terkait desain teknis sebelum membuat PR besar, silakan hubungi pengembang di:
- **Email**: [ilhamalyabdillah@gmail.com](mailto:ilhamalyabdillah@gmail.com)
- **GitHub Issues / Discussions**
