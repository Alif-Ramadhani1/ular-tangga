# Panduan Menjalankan Aplikasi Web Permainan Ular Tangga

## Persiapan

1. Pastikan Python sudah terinstal di komputer Anda. Jika belum, unduh dan instal dari [python.org](https://www.python.org/downloads/).

2. Buka terminal atau command prompt.

3. Pindah ke direktori proyek:
   ```
   cd path/ke/direktori/proyek
   ```

## Langkah-langkah

1. Buat dan aktifkan lingkungan virtual:

   Untuk Linux/Mac:
   ```
   python3 -m venv venv
   source venv/bin/activate
   ```

   Untuk Windows:
   ```
   python -m venv venv
   venv\Scripts\activate
   ```

2. Instal dependensi yang diperlukan:
   ```
   pip install Flask
   ```

3. Jalankan aplikasi:
   ```
   python app.py
   ```

4. Buka browser dan akses aplikasi di [http://localhost:5000](http://localhost:5000)

## Catatan

- Pastikan untuk selalu mengaktifkan lingkungan virtual sebelum menjalankan aplikasi.
- Jika ada masalah, pastikan semua dependensi terinstal dengan benar.
