# Rencana Implementasi: Penyesuaian Posisi Tombol & Jendela Chat AI

Menurunkan posisi tombol bulat chat AI dan jendela popup chat ke sudut kanan bawah standar (20px dari tepi bawah layar) serta mencegah elemen terpotong pada berbagai ukuran layar.

---

### User Review Required

> [!NOTE]
> Berdasarkan preferensi Anda:
> - Tombol bulat chat dan jendela chat diturunkan ke sudut kanan bawah.
> - Jarak dari tepi bawah layar diatur menjadi **20px** (posisi standar floating action button).
> - Jendela chat diberi batas tinggi dinamis (`max-height: calc(100vh - 110px)`) agar tidak meluap atau terpotong di bagian atas layar.

---

### Perubahan yang Diusulkan

#### File: `index.html`

- **Update CSS `.chat-widget`**:
  - Ubah `bottom: 80px;` menjadi `bottom: 20px;`.
  - Pertahankan `right: 20px;` dan `z-index: 1000;`.
  - Hasil: Tombol bulat chat berada persis di sudut kanan bawah dengan jarak nyaman 20px dari tepi layar.

- **Update CSS `.chat-window`**:
  - Pertahankan `position: absolute; bottom: 70px; right: 0;` sehingga jendela muncul tepat di atas tombol bulat chat tanpa saling menimpa.
  - Perbaiki `max-height: 80vh;` menjadi `max-height: calc(100vh - 110px);` untuk menjamin header atau footer jendela chat tidak pernah terpotong di layar laptop/desktop beresolusi rendah.
  - Pastikan tampilan mobile (`max-width: 480px`) tetap full-screen bersih dan tertutup rapat saat digunakan di smartphone.

---

### Verification Plan

1. **Uji Tampilan Desktop/Laptop**:
   - Buka halaman aplikasi.
   - Verifikasi posisi tombol bulat chat AI berada di pojok kanan bawah berjarak 20px dari bawah layar.
   - Klik tombol untuk membuka jendela chat, pastikan header ("R&D Assistant AI"), isi pesan, dan input bar ("Ketik pesan...") terlihat utuh tanpa ada yang terpotong.
2. **Uji Responsivitas**:
   - Verifikasi tidak ada tumpang tindih dengan elemen login atau navigasi dasar.
   - Jalankan `compile_applet` untuk memastikan tidak ada kesalahan sintaksis atau regresi pada aplikasi.
