# Generator RPM (Rencana Pembelajaran Mendalam) AI

Aplikasi web berbasis React dan AI (Google Gemini) untuk membantu guru menyusun Rencana Pembelajaran Mendalam sesuai format Permendikdasmen No. 1 Tahun 2026.

## 🚀 Deploy Otomatis (Cara Tercepat)

Anda bisa langsung membuat website ini online dalam hitungan menit menggunakan Netlify. Pastikan Anda sudah memiliki [Google Gemini API Key](https://aistudio.google.com/app/apikey).

1. Klik tombol di bawah ini:
   
   [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/eko-cahyono/generator-rpm-ai)
   
   *(Catatan: Jika link repository di atas belum tersedia, silakan buat repository GitHub Anda sendiri berisi kode ini, lalu gunakan fitur "Import from Git" di dashboard Netlify).*

2. **Connect to GitHub**: Izinkan Netlify mengakses akun GitHub Anda.
3. **Configure Site**:
   - Di kolom `API_KEY`, masukkan kunci API Google Gemini Anda.
4. Klik **Save & Deploy**. Website Anda akan aktif dalam 1-2 menit.

---

## 🛠 Cara Deploy Manual ke Netlify

Jika Anda ingin melakukan push manual dari komputer:

### Langkah 1: Push ke GitHub
1. Buat repository baru di GitHub.
2. Upload semua file project ini ke repository tersebut.

### Langkah 2: Hubungkan ke Netlify
1. Buka [Netlify](https://www.netlify.com/).
2. Klik **Add new site** > **Import an existing project**.
3. Pilih **GitHub** dan pilih repository yang baru Anda buat.

### Langkah 3: Konfigurasi Build (Otomatis)
Karena sudah ada file `netlify.toml`, Netlify akan otomatis mengisi konfigurasi build.

### Langkah 4: Masukkan API Key (PENTING!)
Sebelum deploy selesai:
1. Masuk ke **Site configuration** > **Environment variables**.
2. Klik **Add a variable**.
3. Key: `API_KEY`
4. Value: `(Masukkan API Key Gemini Anda)`
5. Simpan dan Redeploy (Trigger deploy).

---

## 💻 Pengembangan Lokal

1. Install dependencies:
   ```bash
   npm install
   ```
2. Buat file `.env` di root folder:
   ```env
   API_KEY=masukkan_api_key_disini
   ```
3. Jalankan server dev:
   ```bash
   npm run dev
   ```
