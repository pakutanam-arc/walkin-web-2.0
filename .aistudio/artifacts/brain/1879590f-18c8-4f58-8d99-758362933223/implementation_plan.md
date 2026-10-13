# Walk-in Frozen & Chiller v2.0 — Perbaikan Error, Peringatan & Konsistensi Sistem

Perbaikan menyeluruh terhadap bug runtime antarmuka, ketidakcocokan filter pencarian dan analitik rekap per area gudang, pembaruan model AI asisten R&D pada server, serta pembersihan duplikasi kode dan berkas pengujian sementara.

## User Review & Critical Decisions

> [!IMPORTANT]
> Keputusan berikut telah dikonfirmasi bersama pengguna dan menjadi acuan utama pelaksanaan perbaikan:

- **Cakupan Perbaikan Menyeluruh**: Memperbaiki seluruh error UI/UX, logika pencarian & filter status, tab analitik Rekap, serta koneksi AI Chatbot di sisi server.
- **Filter Area pada Analitik Rekap**: Perhitungan statistik kartu ringkasan, grafik tren (Bulanan & Tahunan), dan tabel rincian pada menu **Rekap** disesuaikan agar memfilter transaksi berdasarkan area gudang yang sedang aktif (`Frozen` atau `Chiller`), selaras dengan judul grafik dan hasil unduhan Export Excel.
- **Pembersihan Kode & Berkas Sementara**: Menghapus deklarasi fungsi dan aturan CSS yang terduplikasi serta membersihkan berkas skrip pengujian sementara yang tidak lagi digunakan di proyek.

---

## 1. Overview & Core Concept

- **What It Does**: Memastikan aplikasi manajemen inventaris **Walk-in Frozen & Chiller** berjalan bebas dari error JavaScript (`ReferenceError`), menampilkan hasil pencarian dan status transaksi yang akurat, menyajikan laporan analitik rekap yang konsisten per area penyimpanan, serta menyediakan asisten AI R&D yang responsif.
- **Target Audience / Persona**: Tim R&D dan pengelola gudang penyimpanan dingin (Frozen & Chiller) yang memantau posisi keranjang, tanggal kedaluwarsa (FEFO), sampel retain, serta laporan mutasi stok harian hingga tahunan.
- **Key Value**: Menghilangkan kegagalan fungsi pada tombol interaktif (tab rekap, badge keranjang penuh, dan chatbot AI) sehingga operasional pencatatan dan audit stok berjalan lancar dan akurat.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Pintasan Status Denah ke Pencarian**: Saat pengguna mengeklik indikator status pada Denah (termasuk *Expired*, *Est. Lewat*, *Retain*, maupun *Keranjang Penuh*), aplikasi berpindah ke tab **Cari**, memilih opsi filter yang sesuai pada dropdown, dan langsung menampilkan daftar barang/keranjang yang relevan.
  2. **Pencarian Riwayat Transaksi**: Saat pengguna memfilter riwayat berdasarkan *Pernah Masuk*, *Pernah Keluar*, atau *Pernah Pindah*, setiap kartu hasil menampilkan ikon dan label status yang tepat (*Masuk* berwarna hijau, *Keluar* berwarna merah, *Pindah* berwarna ungu).
  3. **Analitik Rekap Bulanan & Tahunan**: Pengguna dapat berpindah antara tab **Tren Bulanan** dan **Tren Tahunan** tanpa error, memilih tahun laporan, melihat grafik dan tabel yang terfokus pada area aktif (*Frozen* atau *Chiller*), serta mengunduh laporan Excel yang konsisten.
  4. **Export & Broadcast Reminder**: Pengguna dapat menyalin pesan pengingat ke WhatsApp atau mengunduh CSV pengingat yang mencakup status *Expired*, *Over Thawing (>7 Hari)*, dan *Est. Lewat*.
  5. **Asisten AI R&D**: Pertanyaan umum dijawab instan melalui pencocokan FAQ lokal, sedangkan pertanyaan lanjutan dijawab oleh model Gemini terbaru melalui server.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Utilitarian Enterprise Dashboard — bersih, terstruktur, dan berfokus pada kejelasan status inventaris di layar desktop maupun perangkat seluler.
  - *Color Palette & Mood*: Kanvas netral terang (`--bg-primary: #f8fafc`, `--bg-secondary: #ffffff`) dengan teks kontras tinggi (`--text-primary: #0f172a`) dan warna semantik yang selalu dipasangkan dengan ikon serta label teks:
    - Hijau (`--success: #10b981`) untuk status *Aktif / Aman / Masuk*
    - Oranye/Kuning (`--warning: #f59e0b`, `--orange: #f97316`) untuk *Keranjang Penuh / Est. Lewat*
    - Merah (`--danger: #ef4444`) untuk *Expired / Over Thawing / Keluar*
    - Ungu (`--purple: #8b5cf6`) untuk *Retain Sample / Pindah*
  - *Typography & Hierarchy*: Sans-serif sistem yang tajam dengan penerapan angka tabular (`font-variant-numeric: tabular-nums`) pada kartu statistik, tabel rekap, dan penghitung kapasitas keranjang (`count/capacity`) agar perataan angka vertikal tetap presisi.
  - *Component Styling & Layout*: Tata letak responsif dengan batas kedalaman satu level kartu (`card`), penghapusan aturan CSS ganda pada media query seluler, serta kelengkapan metadata aplikasi.
- **Interactive Feedback & Motion**: Transisi tab dan umpan balik tombol di bawah `200ms`, indikator pengetikan (*typing indicator*) pada jendela chatbot, dan notifikasi *toast* non-blocking di bagian bawah layar.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Ekspos Handler `setRekapMode` pada Modul `App`**
  - *Chosen Approach*: Menambahkan metode publik `App.setRekapMode(mode)` di dalam IIFE `App` untuk menggantikan pemanggilan langsung `state.rekapMode` pada atribut `onclick` HTML.
  - *Why*: Variabel `state` bersifat privat di dalam *closure* `App`. Memanggil `App.setRekapMode()` menjaga enkapsulasi state sekaligus menghilangkan `Uncaught ReferenceError: state is not defined`.
  - *Alternatives Considered*: Mengekspos objek `state` ke `window.state` — ditolak karena melanggar pola *module encapsulation* dan berisiko memicu mutasi state yang tidak terkontrol.
- **Decision 2: Konsistensi Filter Area pada Rekap Analitik & Export Excel**
  - *Chosen Approach*: Menyaring data transaksi pada `renderRekap()` berdasarkan `state.currentArea` (`t.area === state.currentArea || t.area === undefined` untuk kompatibilitas data lama) serta membatasi perhitungan `downloadRekapExcel()` hanya pada transaksi `in` dan `out`.
  - *Why*: Menjamin angka pada kartu *Total Masuk/Keluar*, diagram batang Chart.js, tabel rincian, dan berkas Excel yang diunduh selalu identik untuk area gudang yang sedang dipilih.
  - *Alternatives Considered*: Menampilkan gabungan *Frozen + Chiller* di layar tetapi memisahkannya di Excel — ditolak karena membingungkan pengguna saat mencocokkan laporan.
- **Decision 3: Pembaruan SDK & Model Server Gemini AI**
  - *Chosen Approach*: Memperbarui model pada endpoint `/api/chat` dari `"gemini-3.5-flash"` (tidak valid) menjadi `"gemini-3.8-flash"` dengan inisialisasi `apiKey: process.env.GEMINI_API_KEY` dan header `User-Agent: 'aistudio-build'`.
  - *Why*: Menghindari kegagalan HTTP 404 ketika pengguna menanyakan hal di luar daftar template FAQ.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   Walk-in Frozen & Chiller Client (SPA)                 │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │ Denah Gudang │  │ Cari & Filter│  │ Rekap & Chart│  │ Reminder WA │  │
│  │ (Frozen/Chl) │  │ (Status/Txn) │  │ (Area-Scoped)│  │ & Export CSV│  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘  │
│         └─────────────────┴────────┬────────┴─────────────────┘         │
│                                    ▼                                    │
│                   ┌─────────────────────────────────┐                   │
│                   │   Enkapsulasi State Modul App   │                   │
│                   │  (sections, baskets, txns, ui)  │                   │
│                   └────────┬───────────────┬────────┘                   │
└────────────────────────────┼───────────────┼────────────────────────────┘
                             │               │
              Firestore Sync │               │ POST /api/chat
                             ▼               ▼
             ┌───────────────────────┐ ┌───────────────────────────┐
             │   Firebase Firestore  │ │   Express Backend Server  │
             │  - shared/data        │ │  - FAQ Fast-Matcher       │
             │  - transactions/{id}  │ │  - Gemini 3.8 Flash SDK   │
             └───────────────────────┘ └───────────────────────────┘
```

- **Data Model & State**:
  - `state.appData[area]`: Menyimpan `sections` (peta baris & 5 slot per rak) dan `baskets` (detail item, jumlah, jenis `IIP`/`RM`/`TH`, `expDate`, `estOutDate`, `isRetainSample`).
  - `state.globalTransactions`: Menyimpan hingga 300 transaksi terbaru dari koleksi `transactions`, masing-masing memiliki atribut `id`, `timestamp`, `type` (`in` | `out` | `move` | `edit` | `status`), `area` (`frozen` | `chiller`), `user`, dan `detail`.
- **Interactive Component & State Mapping**:
  - **Tab Rekap (`App.setRekapMode`)**: Mengubah `state.rekapMode` antara `'bulanan'` dan `'tahunan'`, lalu memanggil `renderRekap()` yang menyaring transaksi sesuai `state.currentArea` dan memperbarui instance Chart.js.
  - **Filter Keranjang Penuh (`App.searchByStatus('penuh')` & `performSearch`)**: Menambahkan opsi `<option value="penuh">🚫 Keranjang Penuh</option>` pada `#searchStatus`, memasukkan `'penuh'` ke dalam daftar `isBasketStatus`, serta memfilter item yang berada di dalam keranjang dengan jumlah item mencapai kapasitas maksimal (`isBasketFull(r.keranjangNo)`).
  - **Pencarian Riwayat Transaksi (`performSearch`)**: Memperbaiki pengecekan `r.transactionType === 'in'` (label *Masuk*, badge hijau) dan `r.transactionType === 'out'` (label *Keluar*, badge merah) serta menyesuaikan kelas CSS `.search-result-item`.
  - **Export CSV Reminder (`App.exportReminderCSV`)**: Menambahkan tombol unduh CSV di samping tombol *Copy Semua* pada halaman **Reminder**, serta menyertakan status `'OVER THAWING'` selain `'EXPIRED'` dan `'EST LEWAT'`.
  - **Pembersihan & Konfigurasi**: Menghapus deklarasi ganda `validateMoveKeranjangBaru`, merapikan properti CSS duplikat pada `.baris-label` dan `.status-icon`, melengkapi nama dan deskripsi aplikasi pada metadata, serta menghapus 4 berkas skrip tes `.cjs` yang sudah tidak terpakai.
