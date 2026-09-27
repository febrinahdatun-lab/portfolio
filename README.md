# Portofolio Febri Nahdatun

Portofolio personal — **Data, Automation & Digital Systems** — dibangun ulang dengan **Angular** (standalone components + signals) dan dipublikasikan otomatis ke GitHub Pages.

🔗 **Live:** https://febrinahdatun-lab.github.io/portfolio/

## Struktur folder

```
.
├── .github/workflows/deploy.yml   # Build + security scan + deploy ke GitHub Pages
├── public/                        # File statis (disalin apa adanya ke hasil build)
│   ├── assets/img/                # Foto profil & ikon
│   ├── assets/screenshots/<id>/   # Screenshot asli per proyek
│   ├── 404.html, favicon.svg, manifest.webmanifest, robots.txt, sitemap.xml
│   └── sw.js                      # "Kill switch" untuk service worker versi lama
├── scripts/
│   ├── check-public.mjs           # Pemindai: endpoint, token, NIK/No. KK, dll.
│   └── preview.mjs                # Server pratinjau lokal di /portfolio/
└── src/
    ├── index.html                 # Meta SEO, Content-Security-Policy
    ├── styles.css                 # Design system (warna, tipografi, layout)
    └── app/
        ├── data/                  # ⬅️ SEMUA KONTEN ADA DI SINI
        │   ├── profile.ts         #    profil, kontak, keahlian, prinsip kerja
        │   ├── projects.ts        #    studi kasus + eksplorasi
        │   └── cv.ts              #    CV (ID/EN), pengalaman, sertifikasi
        ├── sections/              # Komponen tiap bagian halaman
        ├── shared/                # Ikon, directive animasi, service navigasi
        └── models.ts              # Tipe data
```

## Menjalankan secara lokal

Butuh Node.js 22.12+ (disarankan 24 LTS).

```bash
npm install
npm start               # dev server → http://localhost:4200
npm run build           # build produksi ke dist/
npm run check:public    # pastikan tidak ada data sensitif
npm run preview         # pratinjau hasil build → http://localhost:4300/portfolio/
```

## Menambah / mengubah proyek

1. Buka `src/app/data/projects.ts`, tambahkan objek baru dengan `id` unik (huruf kecil-tanda-hubung).
2. Screenshot: simpan di `public/assets/screenshots/<id>/01-nama.jpg` (disarankan lebar 1440 px, JPG/WebP < 250 KB), lalu isi:
   ```ts
   screenshots: [{ src: 'assets/screenshots/<id>/01-nama.jpg', alt: 'Deskripsi gambar', caption: 'Keterangan' }]
   ```
3. Proyek tanpa screenshot otomatis memakai sampul tipografis — bukan mockup palsu.
4. `featured: true` menampilkan proyek di bagian "Selected Work".

**Sebelum mengunggah screenshot:** pastikan tidak ada nama, NIK/No. KK, nomor rekening, email, atau data penerima manfaat yang asli. Gunakan mode demo atau samarkan (blur) terlebih dahulu.

## Media otomatis dari Google Drive

| Konten | Perilaku |
|---|---|
| Foto profil | Semua gambar di folder foto tampil bergantian (crossfade) otomatis |
| Favicon | Gambar terbaru di folder favicon dipakai sebagai ikon tab |
| Sertifikat | Dikelompokkan per penyedia (Dicoding, DQLab, Taalenta, BNSP) berdasarkan nama file/subfolder |

- Daftar file diambil dari **Portfolio Media API** (Apps Script, read-only, cache 10 menit). Hanya file yang dibagikan *"Siapa saja yang memiliki link"* yang ikut tampil.
- Jika API tidak tersedia, situs memakai daftar cadangan di `src/app/data/media.ts`.
- Sertifikat dibuka dalam iframe sandbox (tanpa pop-out/download) + lapisan pelindung; unduh/cetak/salin juga dinonaktifkan di sisi Google Drive.

## Deploy

Setiap `git push` ke branch `main` menjalankan workflow **Deploy to GitHub Pages**: install → build → security scan → deploy.
Jika scan menemukan pola sensitif, deploy **dibatalkan**.

Pengaturan satu kali: *Settings → Pages → Build and deployment → Source: **GitHub Actions***.

## Keamanan

- Tidak ada backend, API key, URL Apps Script, atau ID file Google Drive di repositori publik ini.
- Content-Security-Policy ketat: hanya script/style dari domain sendiri, tanpa CDN pihak ketiga.
- Subresource Integrity (SRI) aktif pada bundle hasil build.
- Formulir kontak hanya membuka aplikasi email pengunjung (`mailto:`) — tidak ada data yang disimpan.
- Semua tautan eksternal memakai `rel="noopener noreferrer"`.
- Source aplikasi internal (mis. Sistem Beasiswa) dan versi portofolio lama disimpan lokal di `_archive/` yang di-*ignore* git.

## Lisensi

© Febri Nahdatun. Konten, foto, dan screenshot tidak untuk digunakan ulang tanpa izin.
