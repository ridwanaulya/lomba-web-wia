# JagaKota

JagaKota adalah platform web pelaporan dan transparansi fasilitas publik yang memungkinkan masyarakat mengadukan kerusakan infrastruktur secara terbuka serta memantau status penanganannya secara real-time. Aplikasi ini dirancang untuk mewujudkan akuntabilitas pelayanan publik daerah berbasis keterbukaan data dan partisipasi warga.

## Tech Stack
- HTML5 & CSS3
- JavaScript (ES6+)
- React 19
- Vite
- React Router DOM v7
- Tailwind CSS v3
- Lucide React (Icons)
- Web Storage API (LocalStorage)

## Cara Menjalankan Project

1. **Clone repository:**
   ```bash
   git clone https://github.com/username/jagakota.git
   cd jagakota
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Jalankan development server:**
   ```bash
   npm run dev
   ```
   Buka browser dan akses aplikasi melalui `http://localhost:5173`.

## Progres Pengerjaan Saat Ini
Saat ini progres pengerjaan aplikasi sudah mencapai tahap selesai fungsional (100%), yang mencakup:
- **Landing Page (Beranda):** Hero section, pelacak cepat nomor tiket publik, ringkasan 4 metrik status real-time, bento grid alur pelaporan, slider komparasi foto Before vs After, dan 3 laporan prioritas teratas.
- **Halaman Jelajah & Lacak Laporan:** Daftar seluruh aduan fasilitas, fitur pencarian tiket/lokasi, filter kategori & status, sistem upvote komunitas, dan modal detail timeline penanganan.
- **Halaman Buat Laporan:** Formulir pengaduan warga dengan unggah bukti foto, pemilihan dinas otomatis, dan penerbitan kode tiket unik (`#JGK-2026-XXX`).
- **Halaman Statistik & Rapor:** Dashboard visualisasi keterbukaan data, rapor kinerja penyelesaian tiap dinas, grafik sebaran wilayah, dan tombol reset data demo.
- **Halaman Login Instansi & Dashboard Admin:** Autentikasi petugas dengan tombol akses 1-klik untuk demo juri, serta panel dashboard untuk memperbarui status pengerjaan, menambah catatan verifikasi, dan mengunggah foto bukti perbaikan.
