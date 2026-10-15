# Rencana Implementasi: Barcode / QR Code Web Walk-in dengan Favicon [SELESAI]

Menyediakan generator QR Code beresolusi tinggi untuk URL web Walk-in (`https://walkin-web-v2.vercel.app/`) dengan logo favicon Walk-in Frozen (kristal es/salju) di bagian tengah. Fitur ini ditempatkan di tab **⚙️ Pengaturan** khusus untuk akun Admin, lengkap dengan tombol **Unduh Gambar (PNG)**, tombol **Bagikan (Web Share API)**, serta tombol **Salin Link**.

---

## 1. Arsitektur & Teknologi (Telah Diterapkan)

1. **Library QR Code**:
   * Menambahkan library standar dan andal `easyqrcodejs@4.6.1` via CDN di `<head>` `index.html`.
   * Menghasilkan QR Code dengan level koreksi kesalahan tertinggi (**Error Correction Level 'H' / High - 30%**), memastikan logo favicon di tengah tidak mengganggu pemindaian kamera HP.
   * Dilengkapi sistem **fallback native HTML5 Canvas** jika akses CDN offline/terkendala.
2. **Kustomisasi Visual & Logo Favicon**:
   * Menghasilkan canvas beresolusi tinggi (540x540 px) untuk hasil cetak dan unduhan yang jernih.
   * Di bagian tengah QR Code, ditambahkan latar lingkaran putih bersih (*badge shield*) dan logo favicon Walk-in (balok es & kristal salju biru) secara presisi.
3. **Penempatan di Menu Pengaturan (Manage)**:
   * Ditambahkan sebagai kartu khusus di dalam `renderManageBaskets()` yang hanya dapat dilihat dan diakses oleh akun **Admin** (`isAdmin()`).
   * Menampilkan pratinjau QR Code yang responsif, URL target `https://walkin-web-v2.vercel.app/`, serta informasi status siap pindai.
4. **Fitur Unduh & Berbagi**:
   * **Unduh PNG**: Menyimpan QR Code berkualitas tinggi langsung ke perangkat dengan nama file `walkin-web-qrcode.png`.
   * **Bagikan (Web Share API)**: Menggunakan `navigator.share` untuk membagikan file gambar QR Code atau tautan langsung ke WhatsApp, Telegram, Email, atau aplikasi media sosial lainnya di perangkat seluler / desktop.
   * **Salin Tautan**: Tombol cepat untuk menyalin URL `https://walkin-web-v2.vercel.app/` ke papan klip (*clipboard*) disertai notifikasi toast.

---

## 2. Status Hasil Pengujian

- [x] Library EasyQRCodeJS terpasang di `<head>` `index.html`.
- [x] Kartu `Barcode & QR Code Akses Web Walk-in` tampil di tab **⚙️ Pengaturan** khusus Admin.
- [x] Pembuatan QR code beresolusi tinggi (540x540) dengan logo favicon kristal salju Walk-in di tengah berjalan otomatis.
- [x] Tombol **Unduh Gambar (PNG)** mengekspor `walkin-web-qrcode.png`.
- [x] Tombol **Bagikan (Share)** mendukung Web Share API (berkas gambar/link) dengan fallback clipboard.
- [x] Tombol **Salin Link** menyalin `https://walkin-web-v2.vercel.app/`.
- [x] Build dan lint lulus tanpa error.
