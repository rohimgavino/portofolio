# Modern Premium Glassmorphism Portfolio & Link Hub

Website portofolio interaktif satu halaman (SPA) dengan desain modern, UI/UX transisi halus, backdrop blur (glassmorphism), dan panel admin bawaan untuk mengelola tautan (CRUD) secara dinamis menggunakan `localStorage`.

## ✨ Fitur Utama
*   **Modern Glassmorphism UI/UX**: Desain futuristik dengan latar belakang mesh gradient animasi, efek kartu bercahaya (*glow card*), dan layout grid yang responsif.
*   **Dynamic Portfolio Link Hub**: Menampilkan proyek utama, akun media sosial, atau tautan lainnya dengan ikon kategori yang otomatis mendeteksi platform (seperti GitHub, LinkedIn, Figma, dll.).
*   **Interactive Category Filters**: Menyaring link berdasarkan kategori (Semua, Proyek Utama, Media Sosial, Lainnya) dengan animasi transisi halus.
*   **Integrated Admin Dashboard**:
    *   Sistem autentikasi passcode untuk keamanan akses.
    *   Formulir CRUD lengkap untuk menambah, memperbarui (*edit*), dan menghapus (*delete*) link secara langsung dari browser.
    *   Pilihan tema warna kartu (*Violet, Cyan, Rose, Emerald, Amber*).
*   **LocalStorage Persistence**: Data tautan disimpan secara lokal di browser Anda, sehingga tidak memerlukan database server terpisah untuk kustomisasi awal.
*   **SEO Optimized**: Dilengkapi dengan metadata penunjang optimasi mesin pencari.

## 🛠️ Tech Stack & Dependencies
*   **Core**: HTML5, Vanilla JavaScript, CSS3
*   **Icons**: [Lucide Icons](https://lucide.dev/) (dimuat via CDN)
*   **Fonts**: [Google Fonts: Plus Jakarta Sans & Outfit](https://fonts.google.com/)
*   **Dev Server Hosting**: `http-server` (dijalankan via Node.js/npx)

## 🔐 Kredensial Akses Admin
*   **Passcode Default**: `rohim123`

*(Anda dapat mengubah passcode ini di dalam file [app.js](file:///D:/ROHIM/portofolio/app.js) pada variabel `DEFAULT_PASSCODE`)*

## 🚀 Cara Menjalankan Secara Lokal
Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/). Jalankan perintah berikut di terminal Anda dalam folder proyek:

```bash
npm run dev
```

Website akan berjalan secara lokal di port `3000`. Silakan buka peramban Anda dan kunjungi:
👉 **[http://localhost:3000](http://localhost:3000)**
