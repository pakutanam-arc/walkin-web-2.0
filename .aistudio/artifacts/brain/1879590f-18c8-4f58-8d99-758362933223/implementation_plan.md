# Rencana Implementasi: Logo Browser Tab (Favicon) Walk-in Frozen

Pengguna ingin memasang logo pada tab browser (seperti logo Firebase pada tab "WALK-IN" di atasnya). Berdasarkan jawaban pengguna, logo yang diinginkan adalah **balok es dan kristal salju khas Walk-in Frozen**, diterapkan langsung di proyek ini sekaligus disediakan panduan untuk GitHub Pages.

---

## 1. Pembuatan Aset Logo & Favicon Walk-in Frozen
- Merancang favicon vektor SVG modern dengan tema:
  - Balok es 3D kristal (`#38bdf8` ke `#0284c7`) dengan pencahayaan transparan dingin.
  - Kristal salju 6 cabang simetris putih bercahaya di tengah balok es.
  - Bingkai rounded yang kontras dan jelas terlihat baik pada tab browser berlatar belakang gelap (Dark Mode) maupun terang (Light Mode).
- Menghasilkan format SVG inline/data URI serta file aset icon mandiri (`favicon.svg`, `favicon.ico` data URI, dan `apple-touch-icon`).

---

## 2. Pemasangan di File `index.html` Aplikasi
- Memasukkan tag icon standar modern pada bagian `<head>` di `index.html`:
  - `<link rel="icon" type="image/svg+xml" href="...">`
  - `<link rel="apple-touch-icon" href="...">`
  - Tag warna tema `<meta name="theme-color" content="#0f172a">` agar selaras dengan header Walk-in.
- Mempercantik logo pada kartu Login dan Header Web agar serasi dengan icon di tab browser.

---

## 3. Penyusunan Panduan untuk GitHub Pages (`pakutanam-arc.github.io/walkin-web-2.0/`)
- Menyiapkan panduan salin-tempel yang praktis:
  - Baris kode HTML yang tinggal disalin ke file `index.html` di repositori GitHub Pages.
  - Cara mengatasi cache browser jika logo belum langsung muncul setelah push ke GitHub.
  - Menyertakan tombol salin cepat kode favicon langsung dari menu Pengaturan di aplikasi.

---

## 4. Verifikasi & Pengujian
- Memastikan tab browser langsung memuat logo balok es salju tanpa error.
- Menjalankan `compile_applet` dan `lint_applet` untuk memastikan tidak ada konflik kode.
