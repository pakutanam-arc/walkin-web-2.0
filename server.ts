import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for Chatbot
  app.post("/api/chat", async (req, res) => {
    try {
      const { history, message } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const lowerMessage = message.toLowerCase();
      
      const FAQ_TEMPLATES = [
        {
          keywords: ["menu", "fungsi menu", "ada menu apa saja", "tab navigasi", "fitur"],
          answer: "Hi Team R&D,\n\nBerikut adalah fungsi menu pada aplikasi Walk-in:\n1. **Denah**: Melihat tata letak gudang (Frozen/Chiller) dan isi keranjang secara visual.\n2. **Masuk**: Memasukkan barang baru ke dalam keranjang di gudang.\n3. **Cari**: Mencari lokasi spesifik dari sebuah barang.\n4. **Riwayat**: Melihat catatan aktivitas barang masuk, keluar, atau pindah.\n5. **Rekap**: Melihat laporan ringkas pergerakan barang (harian/bulanan).\n6. **Reminder**: Menampilkan notifikasi barang yang akan atau sudah kedaluwarsa.\n7. **Pengaturan**: Mengelola data atau pengaturan lainnya (jika memiliki akses)."
        },
        {
          keywords: ["tanda notifikasi", "badge", "warna", "arti warna", "tanda merah", "tanda kuning", "tanda hijau", "status barang", "indikator"],
          answer: "Hi Team R&D,\n\nBerikut adalah arti warna dan tanda status pada keranjang/barang:\n- **Hijau (Aktif/Masuk)**: Barang dalam kondisi baik dan aman digunakan.\n- **Kuning/Orange (EST Lewat)**: Barang akan segera mendekati masa kedaluwarsa atau batas EST.\n- **Merah (Expired/Penuh)**: Barang sudah kedaluwarsa atau keranjang sudah penuh.\n- **Ungu (Pindah/Retain)**: Menandakan barang yang dipindahkan atau sampel retain."
        },
        {
          keywords: ["apa itu", "tentang aplikasi", "walk-in", "fungsi aplikasi", "kegunaan"],
          answer: "Hi Team R&D,\n\nAplikasi **Walk-in Frozen & Chiller | v2.0** adalah sistem manajemen inventaris gudang yang dirancang untuk mempermudah pemantauan stok barang. Anda dapat melacak posisi barang di dalam rak, menginput barang masuk, mengeluarkan barang, memindahkan stok, serta mendapatkan notifikasi untuk barang yang sudah kedaluwarsa."
        },
        {
          keywords: ["login", "masuk", "cara login", "sign in", "lupa password"],
          answer: "Hi Team R&D,\n\nUntuk masuk (login) ke aplikasi Walk-in, silakan ikuti langkah berikut:\n1. Buka halaman depan aplikasi.\n2. Masukkan **Email HokBen** Anda.\n3. Masukkan **Password**.\n4. Klik tombol **Masuk**."
        },
        {
          keywords: ["keluar", "logout", "cara keluar", "sign out"],
          answer: "Hi Team R&D,\n\nUntuk keluar dari aplikasi, silakan klik tombol **Keluar** yang berada di pojok kanan atas layar (tepat di sebelah nama/email Anda)."
        },
        {
          keywords: ["denah", "peta", "lokasi barang", "mencari barang", "cari barang", "dimana"],
          answer: "Hi Team R&D,\n\nUntuk mencari lokasi barang:\n1. Gunakan menu **Denah** untuk melihat tata letak gudang (Frozen/Chiller) dan status isi tiap keranjang secara visual.\n2. Atau, gunakan menu **Cari** dan ketikkan nama barang untuk menemukan lokasinya dengan cepat."
        },
        {
          keywords: ["tambah barang", "barang masuk", "input barang", "masukin barang"],
          answer: "Hi Team R&D,\n\nCara memasukkan barang ke sistem:\n1. Buka tab **Masuk**.\n2. Pilih area (Frozen/Chiller), lalu pilih Rak & Keranjang tujuan.\n3. Isi nama barang, jumlah, dan tanggal kedaluwarsa (EST/ED).\n4. Klik simpan."
        },
        {
          keywords: ["barang keluar", "ambil barang", "keluarin barang"],
          answer: "Hi Team R&D,\n\nCara mengeluarkan barang:\n1. Cari barangnya di menu **Denah** atau **Cari**.\n2. Klik tombol merah bergambar panah keluar (**Out**).\n3. Masukkan jumlah barang yang akan diambil.\n4. Konfirmasi."
        },
        {
          keywords: ["pindah barang", "pindahkan", "geser barang", "mutasi"],
          answer: "Hi Team R&D,\n\nCara memindahkan barang antar keranjang:\n1. Cari barang di **Denah** atau **Cari**.\n2. Klik tombol ungu bergambar panah putar (**Move**).\n3. Pilih rak dan keranjang tujuan yang baru, lalu konfirmasi."
        },
        {
          keywords: ["rekap", "laporan", "statistik"],
          answer: "Hi Team R&D,\n\nAnda bisa melihat ringkasan aktivitas di menu **Rekap**. Di sana terdapat data total barang masuk, keluar, serta pergerakan harian maupun bulanan."
        },
        {
          keywords: ["reminder", "pengingat", "expired", "kedaluwarsa", "basi"],
          answer: "Hi Team R&D,\n\nSilakan cek menu **Reminder**. Menu ini akan menampilkan daftar barang yang sudah melewati batas waktu kedaluwarsa atau EST, agar Anda bisa segera melakukan tindakan."
        },
        {
          keywords: ["halo", "hai", "hi", "pagi", "siang", "sore", "malam", "ping", "test"],
          answer: "Hi Team R&D! Saya adalah asisten AI Walk-in. Ada yang bisa saya bantu terkait aplikasi ini? Anda bisa menanyakan cara login, cari barang, input barang masuk/keluar, dan lainnya."
        }
      ];

      // Periksa apakah pesan cocok dengan FAQ agar bisa balas cepat tanpa memanggil API Gemini
      const words = lowerMessage.split(/\s+/);
      let matchedFaq = null;
      for (const faq of FAQ_TEMPLATES) {
        // Cek kombinasi kata kunci
        if (faq.keywords.some(kw => lowerMessage.includes(kw))) {
          matchedFaq = faq;
          break;
        }
      }

      if (matchedFaq) {
        return res.json({ text: matchedFaq.answer });
      }

      const systemInstruction = `
        Anda adalah asisten AI resmi untuk aplikasi web "Walk-in Frozen & Chiller | v2.0". 
        Aplikasi ini adalah sistem manajemen inventaris untuk gudang penyimpanan beku (Frozen) dan pendingin (Chiller).
        Sapa pengguna dengan "Hi Team R&D" di awal percakapan atau saat pengguna baru menyapa. 
        Gunakan bahasa Indonesia yang formal, profesional, namun tetap ramah dan mudah dipahami.
        Bantu pengguna mencari barang, memberi penjelasan tentang fitur web (seperti denah/keranjang, barang masuk/keluar/pindah, riwayat, rekap), dan memberikan informasi terkait gudang.
        Jaga agar jawaban ringkas dan informatif. Jangan pernah menyarankan login menggunakan Google karena fitur tersebut disembunyikan.
      `;

      let contents = [];
      if (history && history.length > 0) {
        contents = history.map((msg: any) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
        }
      });

      if (response.text) {
        res.json({ text: response.text });
      } else {
        res.status(500).json({ error: "Failed to generate response" });
      }

    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Terjadi kesalahan pada server AI." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
