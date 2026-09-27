import { Lab, Project } from '../models';

/**
 * Isi portofolio publik. Jangan menaruh URL backend, ID file, token, atau data pribadi di sini.
 * Screenshot diletakkan di `public/assets/screenshots/<id>/` — lihat README.
 */
export const PROJECTS: Project[] = [
  {
    id: 'governance-portal',
    title: 'Corporate Governance Portal',
    subtitle: 'Satu pintu untuk pekerjaan yang saling terhubung.',
    category: 'Aplikasi Operasional',
    featured: true,
    year: '2025 — 2026',
    summary:
      'Portal modular berbasis Angular yang mempertemukan laporan aktivitas, pengelolaan akun, risalah rapat, dan pemantauan cloud dalam satu ruang kerja.',
    problem:
      'Modul operasional yang tersebar membuat pengguna harus berpindah antarsistem dan mempelajari pola akses yang berbeda-beda.',
    approach: [
      'Membangun shell portal Angular dengan modul yang dapat dikembangkan terpisah.',
      'Menggunakan Apps Script untuk otorisasi dan direktori pengguna berbasis Google Identity.',
      'Merancang cache di memori dan penyegaran latar belakang agar navigasi antarmodul tetap cepat.',
    ],
    output:
      'Portal Angular, kontrak integrasi antarmodul, struktur backend, serta pengujian keamanan dasar. Versi dashboard sebelumnya menjadi fondasi evolusi portal ini.',
    stack: ['Angular', 'TypeScript', 'Apps Script', 'Google Identity'],
    note: 'Sistem internal. Tidak ada login, direktori pegawai, atau modul internal yang dibuka di portofolio ini.',
  },
  {
    id: 'sistem-beasiswa',
    title: 'Sistem Informasi Beasiswa',
    subtitle: 'Dari pendaftaran sampai pencairan, dalam satu alur.',
    category: 'Aplikasi Operasional',
    featured: true,
    year: '2025',
    summary:
      'Aplikasi web untuk mengelola program beasiswa: pendaftaran, seleksi berbasis kriteria, pencairan dana, laporan, dan manajemen pengguna.',
    problem:
      'Pengelolaan beasiswa berbasis spreadsheet manual menyulitkan penelusuran status pendaftar, konsistensi penilaian, dan rekap pencairan per wilayah.',
    approach: [
      'Memodelkan master data kantor wilayah, jenjang pendidikan, serta kriteria & bobot seleksi.',
      'Seleksi dengan metode SAW (Simple Additive Weighting) — skor dan peringkat dihitung otomatis dari 6 kriteria benefit/cost.',
      'Alur pendaftaran → seleksi → pencairan (termasuk file salary crediting) → laporan siap cetak.',
      'Login Google, peran pengguna (admin/PIC), mode demo terpisah, dan tur panduan interaktif.',
    ],
    output:
      'Aplikasi single-page dengan dashboard ringkasan, modul CRUD, perhitungan SAW, laporan & ekspor, serta backend Apps Script + Google Sheets.',
    stack: ['JavaScript', 'Apps Script', 'Google Sheets', 'SAW Method'],
    note: 'Source code dan endpoint backend tidak dipublikasikan. Seluruh screenshot diambil dari Mode Demo berisi data contoh — bukan data pendaftar sungguhan.',
    screenshots: [
      { src: 'assets/screenshots/sistem-beasiswa/01-dashboard.jpg', alt: 'Dashboard Sistem Beasiswa: ringkasan pendaftar dan grafik per kanwil', caption: 'Dashboard ringkasan status pendaftar dan sebaran per kantor wilayah.' },
      { src: 'assets/screenshots/sistem-beasiswa/02-seleksi.jpg', alt: 'Tabel seleksi beasiswa dengan skor dan peringkat SAW', caption: 'Seleksi metode SAW: nilai tiap kriteria, skor akhir, dan peringkat otomatis.' },
      { src: 'assets/screenshots/sistem-beasiswa/03-kriteria.jpg', alt: 'Pengaturan kriteria dan bobot SAW', caption: 'Pengaturan kriteria & bobot — total bobot divalidasi = 1,00.' },
      { src: 'assets/screenshots/sistem-beasiswa/04-pencairan.jpg', alt: 'Tabel pencairan dana beasiswa', caption: 'Pencairan dana dengan status dan pembuatan file salary crediting.' },
    ],
  },
  {
    id: 'siagaai',
    title: 'SiagaAI — Disaster Preparedness',
    subtitle: 'Aplikasi kecil untuk kesiapsiagaan besar.',
    category: 'AI & Otomasi',
    featured: true,
    year: '2025',
    summary:
      'Platform kesiapsiagaan bencana untuk IDCamp 2025 Developer Challenge: pemantauan gempa BMKG, asisten AI, dan panduan tanggap bencana.',
    problem:
      'Informasi gempa dan panduan keselamatan sering tersebar dan sulit dipahami cepat oleh masyarakat saat situasi darurat.',
    approach: [
      'Menampilkan data gempa terkini dan riwayat gempa BMKG melalui relay backend.',
      'Menyediakan asisten AI (Google Gemini dengan failover API key otomatis) dan pertanyaan cepat seputar kesiapsiagaan.',
      'Menyusun panduan praktis untuk gempa, tsunami, banjir, longsor, dan kebakaran.',
    ],
    output: 'Aplikasi web publik beserta repositori source code di GitHub.',
    stack: ['JavaScript', 'BMKG Open Data', 'Google Gemini', 'Apps Script'],
    screenshots: [
      { src: 'assets/screenshots/siagaai/01-siagaai.jpg', alt: 'SiagaAI: arsitektur sistem, monitor gempa BMKG, dan chat AI', caption: 'Arsitektur (frontend → proxy Apps Script → BMKG & AI), monitor gempa live, dan asisten AI.' },
      { src: 'assets/screenshots/siagaai/02-siagaai.jpg', alt: 'SiagaAI: daftar gempa terkini dan panduan kesiapsiagaan', caption: 'Riwayat gempa terkini dan panduan kesiapsiagaan untuk 5 jenis bencana.' },
    ],
    links: [
      {
        label: 'Buka aplikasi',
        url: 'https://febrinahdatun-lab.github.io/IDCamp-2025-Developer-Challenge--Small-Apps-for-Big-Preparedness/',
      },
      {
        label: 'Repositori GitHub',
        url: 'https://github.com/febrinahdatun-lab/IDCamp-2025-Developer-Challenge--Small-Apps-for-Big-Preparedness',
      },
    ],
  },
  {
    id: 'cloud-migration',
    title: 'Cloud Migration & Identity Management',
    subtitle: 'Memindahkan data. Menjaga jejaknya.',
    category: 'Cloud & Integrasi',
    featured: true,
    year: '2025 — 2026',
    summary:
      'Migrasi copy-only dari SharePoint ke Google Shared Drive dengan checkpoint, verifikasi file, dashboard pemantauan, serta tata kelola akun Entra ID & Google Admin.',
    problem:
      'Pemindahan arsip lintas cloud harus dapat dilanjutkan ketika proses terhenti, tanpa menghapus sumber dan tanpa kehilangan jejak status setiap file.',
    approach: [
      'Memisahkan tahap inventarisasi, penyalinan, dan verifikasi.',
      'Mencatat status per file dan checkpoint agar proses dapat dilanjutkan dengan aman.',
      'Menggabungkan dashboard pemantauan, audit kapasitas, dan runbook operasional.',
    ],
    output:
      'Mesin migrasi Python, dashboard pemantauan, skrip audit penyimpanan, CLI pengelolaan akun, dan runbook operasional.',
    stack: ['Python', 'Microsoft Graph', 'Google Drive API', 'Admin SDK'],
    note: 'Nama file, struktur folder, dan data akun organisasi tidak ditampilkan.',
  },
  {
    id: 'activity-dashboard',
    title: 'Activity & Publication Insights',
    subtitle: 'Menghubungkan laporan kegiatan dengan publikasi.',
    category: 'Data & Dashboard',
    featured: true,
    year: '2025',
    summary:
      'Dashboard untuk membaca jumlah laporan, status publikasi, periode, unit kerja, dan pilar program dalam satu tampilan.',
    problem:
      'Laporan kegiatan dan artikel publikasi perlu dibaca bersama agar tim tahu apa yang sudah terdokumentasi dan apa yang belum dipublikasikan.',
    approach: [
      'Menyajikan ringkasan laporan dan rasio publikasi.',
      'Menyediakan filter periode, unit kerja, dan pilar program.',
      'Membuka rincian kegiatan dan tautan artikel langsung dari tampilan ringkasan.',
    ],
    output: 'Dashboard dengan kartu indikator, grafik, tabel kegiatan, dan pratinjau artikel.',
    stack: ['JavaScript', 'Apps Script', 'SharePoint', 'Chart.js'],
    note: 'Angka capaian program lembaga tidak dipublikasikan.',
  },
  {
    id: 'bi-dashboards',
    title: 'Interactive BI Dashboards',
    subtitle: 'Dataset publik, dibaca seperti ruang kendali.',
    category: 'Analitik Data',
    featured: true,
    year: '2025 — 2026',
    summary:
      'Tiga dashboard analitik interaktif: SuperStore (penjualan & profit), Marketing Omnichannel (funnel & CTR), dan Rig Operations Telemetry (produktivitas & bahan bakar).',
    problem:
      'Data mentah ribuan baris sulit dibaca tanpa ringkasan KPI, segmentasi, dan visual yang konsisten untuk mendukung keputusan.',
    approach: [
      'Membersihkan dan mengagregasi data CSV (9.900+ baris untuk SuperStore) langsung di browser.',
      'Menyusun KPI, tren, segmentasi wilayah/kanal, dan tabel peringkat dalam tab tematik.',
      'Menambahkan kartu grafik yang dapat diurutkan, diperbesar, dan diunduh sebagai PNG.',
    ],
    output:
      'Dashboard SuperStore Analytics, Marketing Analytics (7 tab: overview hingga funnel), dan Rig Operations Telemetry (DDR, fuel, productivity).',
    stack: ['JavaScript', 'Chart.js', 'PapaParse', 'Google Sheets'],
    note: 'Menggunakan dataset publik/latihan, bukan data organisasi.',
    screenshots: [
      { src: 'assets/screenshots/bi-dashboards/01-superstore.jpg', alt: 'Dashboard SuperStore Intelligence dengan KPI dan grafik revenue vs profit', caption: 'SuperStore Intelligence — KPI revenue, profit, order, margin, dan tren bulanan.' },
      { src: 'assets/screenshots/bi-dashboards/02-marketing.jpg', alt: 'Dashboard Marketing Analytics dengan impressions dan CTR', caption: 'Marketing Analytics — impressions, klik, CTR, dan tren omnichannel.' },
      { src: 'assets/screenshots/bi-dashboards/03-rig.jpg', alt: 'Dashboard Rig Operations dengan produktivitas dan efisiensi bahan bakar', caption: 'Rig Operations Telemetry — produktivitas harian dan efisiensi bahan bakar per rig.' },
    ],
  },
  {
    id: 'ml-fraud-detection',
    title: 'ML Fraud Detection',
    subtitle: 'Clustering, lalu klasifikasi.',
    category: 'Analitik Data',
    year: '2026',
    summary:
      'Deteksi anomali transaksi: K-Means untuk pelabelan klaster, lalu klasifikasi dengan Decision Tree dan Random Forest (akurasi terbaik 96,02%).',
    problem:
      'Dataset transaksi tidak memiliki label penipuan, sehingga pola anomali perlu ditemukan sebelum model klasifikasi dapat dilatih.',
    approach: [
      'Eksplorasi dan pra-pemrosesan 2.512 data transaksi.',
      'Clustering K-Means untuk membentuk label, lalu melatih Decision Tree (93,63%) dan Random Forest (95,62%).',
      'Tuning hyperparameter Random Forest hingga akurasi 96,02% dan membuat simulator risiko interaktif.',
    ],
    output: 'Notebook analisis, perbandingan model, dan simulator skor risiko berbasis browser.',
    stack: ['Python', 'scikit-learn', 'pandas', 'K-Means'],
    note: 'Proyek pembelajaran Dicoding "Belajar Machine Learning untuk Pemula" dengan dataset latihan.',
    screenshots: [
      { src: 'assets/screenshots/ml-fraud-detection/01-bmlp.jpg', alt: 'Halaman proyek Machine Learning Fraud Detection', caption: 'Ringkasan proyek: clustering K-Means → klasifikasi Random Forest (akurasi 96,02%).' },
    ],
  },
  {
    id: 'program-mapping',
    title: 'Program Distribution Mapping',
    subtitle: 'Membaca sebaran program dari sudut wilayah.',
    category: 'Data & Dashboard',
    summary:
      'Pipeline normalisasi dan agregasi data untuk peta interaktif sebaran program menurut wilayah dan pilar.',
    problem:
      'Data yang tersebar di banyak sheet perlu dinormalisasi sebelum dapat dipetakan dan dibandingkan secara konsisten.',
    approach: [
      'Memetakan sheet ke program dan pilar.',
      'Normalisasi lokasi, geocoding, dan agregasi.',
      'Menyajikan hasil melalui peta Leaflet dengan cluster dan filter wilayah.',
    ],
    output: 'Pipeline Python, pemetaan program, dan frontend Leaflet.',
    stack: ['Python', 'Leaflet.js', 'Geocoding', 'JavaScript'],
    note: 'Tidak ada nama, alamat, atau koordinat penerima manfaat yang dipublikasikan.',
  },
  {
    id: 'meeting-records',
    title: 'Meeting Records & Approval',
    subtitle: 'Dari catatan rapat menjadi arsip yang terstruktur.',
    category: 'Aplikasi Operasional',
    summary:
      'Aplikasi risalah rapat dengan lampiran, rekaman, revisi, penempatan tanda tangan PDF, dan riwayat dokumen.',
    problem:
      'Dokumen rapat, presensi, rekaman, dan dokumentasi berada di lokasi berbeda sehingga penelusuran dan review memakan waktu.',
    approach: [
      'Menghimpun informasi rapat dan lampiran dalam satu alur input.',
      'Menyediakan riwayat, catatan revisi, dan posisi tanda tangan pada PDF.',
      'Memisahkan penyimpanan file, metadata, dan antarmuka pengguna.',
    ],
    output: 'Halaman input, riwayat, login, backend Apps Script, dan logika frontend.',
    stack: ['JavaScript', 'Apps Script', 'Google Drive', 'PDF'],
    note: 'Isi rapat dan dokumen internal tidak dipublikasikan.',
  },
  {
    id: 'report-automation',
    title: 'Visual Report Automation',
    subtitle: 'Merangkai data, foto, dan laporan berkala.',
    category: 'AI & Otomasi',
    summary:
      'Workflow n8n yang menghubungkan SharePoint, kurasi foto berbantuan AI Vision, dan persiapan konten laporan Canva.',
    problem:
      'Laporan berkala melibatkan pengambilan data, pemilihan foto, penulisan caption, dan pengisian template yang berulang.',
    approach: [
      'Memisahkan koneksi sumber, kurasi foto, dan penyusunan laporan.',
      'Skoring foto dan caption berbantuan AI Vision dengan review manusia.',
      'Menyiapkan data untuk Canva Bulk Create.',
    ],
    output: 'Workflow n8n, dokumentasi integrasi, serta ekspor CSV/JSON.',
    stack: ['n8n', 'AI Vision', 'Microsoft Graph', 'Canva'],
  },
  {
    id: 'workspace-admin',
    title: 'Workspace Account Lifecycle',
    category: 'Cloud & Integrasi',
    summary:
      'Rekonsiliasi akun aktif, pengelolaan grup, pemeriksaan kandidat nonaktif, dan alur persetujuan administratif.',
    problem:
      'Direktori akun perlu dicocokkan dengan data pegawai aktif, dengan perlindungan bagi akun administratif dan pengecualian operasional.',
    approach: [
      'CLI Python untuk operasi direktori.',
      'Dry-run sebagai pemeriksaan wajib sebelum perubahan.',
      'Dokumentasi pengecualian, masa tunggu, approval, dan riwayat laporan.',
    ],
    output: 'CLI dan dokumentasi pengelolaan akun Google Workspace & Microsoft 365.',
    stack: ['Python', 'Admin SDK', 'Microsoft Graph', 'Apps Script'],
  },
  {
    id: 'sheet-sync',
    title: 'SharePoint → Google Sheets Sync',
    category: 'Cloud & Integrasi',
    summary: 'Sinkronisasi data terpilih dari Excel SharePoint ke Google Sheets dengan aturan kelengkapan dan status.',
    problem: 'Data program perlu tersedia di platform pelaporan lain tanpa menyalin baris satu per satu.',
    approach: [
      'Membaca workbook melalui Microsoft Graph.',
      'Menyaring status realisasi dan kelengkapan kolom.',
      'Eksekusi sekali jalan, terjadwal, atau alternatif Apps Script.',
    ],
    output: 'Skrip sinkronisasi, panduan konfigurasi, dan log proses.',
    stack: ['Python', 'pandas', 'Google Sheets API', 'Microsoft Graph'],
  },
  {
    id: 'unit-performance',
    title: 'Unit Performance Dashboard',
    category: 'Data & Dashboard',
    summary: 'Ringkasan kinerja unit kerja: rencana vs realisasi, penghimpunan, penyaluran, dan saldo.',
    problem: 'Pengambilan keputusan membutuhkan pandangan lintas indikator dengan filter unit dan periode yang konsisten.',
    approach: [
      'Mengelompokkan indikator ke panel tematik.',
      'Pembandingan rencana dan realisasi.',
      'Rincian per program, kanal, sumber dana, dan wilayah.',
    ],
    output: 'Dashboard dan backend Apps Script dengan jalur ekspor.',
    stack: ['Apps Script', 'JavaScript', 'Spreadsheet'],
    note: 'Nilai transaksi dan data donor tidak ditampilkan.',
  },
  {
    id: 'disaster-response',
    title: 'Disaster Response Reporting',
    category: 'Data & Dashboard',
    summary: 'Dashboard situasi dan form laporan harian untuk kronologi respons, bantuan, dan dokumentasi lapangan.',
    problem: 'Informasi respons lapangan perlu dihimpun menjadi ringkasan yang mudah dibaca dan diperbarui.',
    approach: [
      'Menghubungkan ringkasan bantuan dengan linimasa kegiatan.',
      'Form laporan harian dan penyimpanan dokumentasi.',
      'Agregat laporan dari Apps Script untuk dashboard Angular.',
    ],
    output: 'Dashboard situasi, pemetaan form, dan dokumentasi alur pelaporan harian.',
    stack: ['Angular', 'JavaScript', 'Apps Script', 'Google Drive'],
  },
  {
    id: 'knowledge-hub',
    title: 'Knowledge & Policy Hub',
    category: 'Dokumen & Pengetahuan',
    summary: 'Portal dokumen kebijakan dengan kategori, tahun, pratinjau dokumen, dan pembatasan akses.',
    problem: 'Dokumen acuan perlu mudah ditemukan tanpa kehilangan konteks kategori dan hak aksesnya.',
    approach: [
      'Pengelompokan dokumen berdasarkan kategori dan tahun.',
      'Akses satu pintu ke dashboard dan dokumen acuan.',
      'Halaman login, akses ditolak, dan pratinjau dokumen yang terpisah.',
    ],
    output: 'Portal KMS untuk 100+ karyawan dengan backend Apps Script.',
    stack: ['HTML / CSS', 'JavaScript', 'Apps Script'],
  },
  {
    id: 'wbs-awareness',
    title: 'WBS & Fraud Awareness Assessment',
    category: 'Aplikasi Operasional',
    summary: 'E-form asesmen pemahaman dengan navigasi soal, timer, penilaian otomatis, dan rekap respons.',
    problem: 'Kegiatan edukasi internal membutuhkan cara terstruktur untuk mengumpulkan respons dan menghitung hasil.',
    approach: [
      'Antarmuka soal dengan indikator progres dan timer.',
      'Validasi identitas responden terhadap direktori internal.',
      'Perekaman hasil, durasi, dan rincian respons via Apps Script.',
    ],
    output: 'Frontend asesmen, backend, dan panduan deployment.',
    stack: ['JavaScript', 'Apps Script', 'Google Sheets'],
  },
  {
    id: 'regulatory-reporting',
    title: 'Regulatory Reporting Workspace',
    category: 'Data & Dashboard',
    summary: 'Ruang kerja data pelaporan: penghimpunan, donor, penyaluran, dan penerima manfaat sebelum dikirim.',
    problem: 'Data lintas bagian perlu ditata sesuai struktur pelaporan dan diperiksa sebelum dikirim.',
    approach: [
      'Panel ringkasan dan tabel pelaporan.',
      'Pemilihan periode dan status validasi.',
      'Pemisahan dashboard dari proses submit eksternal.',
    ],
    output: 'Dashboard pelaporan dan source otomasi.',
    stack: ['JavaScript', 'Apps Script', 'Spreadsheet'],
  },
  {
    id: 'qurban-operations',
    title: 'Qurban Operations & Report Access',
    category: 'Data & Dashboard',
    summary:
      'Dashboard lintas campaign (penghimpunan, stok, progres laporan) serta halaman "Cek Qurbanmu" untuk akses laporan per wilayah.',
    problem: 'Berbagai skema program dan tahapan laporan perlu diringkas tanpa kehilangan rincian tiap unit kerja.',
    approach: [
      'Menu terpisah untuk campaign dan operasi.',
      'Tren penghimpunan, stok, dan progres laporan dalam satu layar.',
      'Frontend GitHub Pages terpisah dari backend Apps Script, plus konsolidasi tautan & PDF laporan.',
    ],
    output: 'Dashboard, landing page laporan, skrip sinkronisasi tautan, dan alat penggabungan PDF.',
    stack: ['JavaScript', 'Apps Script', 'Python', 'pdf-lib'],
    note: 'Demo pencarian publik dihapus dari portofolio untuk melindungi data pribadi pekurban.',
  },
  {
    id: 'economic-reporting',
    title: 'Economic Program Reporting',
    category: 'Aplikasi Operasional',
    summary: 'Portal laporan kelompok, riwayat pelaporan, dan pengelolaan database fasilitator.',
    problem: 'Pelaporan tingkat kelompok memerlukan struktur input dan riwayat yang dapat ditelusuri oleh peran berbeda.',
    approach: [
      'Frontend dan backend spreadsheet yang terpisah.',
      'Akses pengguna melalui Google Identity.',
      'Menu modular dan administrasi fasilitator.',
    ],
    output: 'Portal modular dengan backend Apps Script.',
    stack: ['JavaScript', 'Apps Script', 'Google Identity'],
  },
  {
    id: 'telegram-workflows',
    title: 'Telegram Knowledge & Communication',
    category: 'AI & Otomasi',
    summary:
      'Pengarsipan pesan berizin, deteksi kandidat permintaan/laporan, dan pengiriman pesan dengan mode dry-run.',
    problem: 'Permintaan data dan laporan mudah tenggelam dalam percakapan grup yang panjang.',
    approach: [
      'Ekspor pesan beserta konteks topik.',
      'Aturan kategori untuk menyaring kandidat, ditinjau manusia.',
      'Dry-run sebagai perilaku awal sebelum pengiriman.',
    ],
    output: 'Exporter, detektor kandidat, frontend, dan backend Python.',
    stack: ['Python', 'Telethon', 'Apps Script'],
  },
  {
    id: 'minutes-drafting',
    title: 'Minutes Drafting Pipeline',
    category: 'Dokumen & Pengetahuan',
    summary: 'Pengolahan catatan menjadi draf risalah Word dengan template, tindak lanjut, dan catatan validasi.',
    problem: 'Catatan percakapan perlu dipilah berdasarkan konteks sebelum menjadi draf dokumen rapat yang konsisten.',
    approach: [
      'Pemisahan seleksi sumber, konteks rapat, dan penyusunan draf.',
      'Struktur tabel dan gaya dokumen acuan.',
      'Penandaan informasi yang perlu dikonfirmasi.',
    ],
    output: 'Generator draf Word untuk direview manusia.',
    stack: ['Python', 'python-docx'],
  },
  {
    id: 'document-engineering',
    title: 'Document Engineering Toolkit',
    category: 'Dokumen & Pengetahuan',
    summary: 'Perangkat bantu untuk matriks bukti, rekap program, transkripsi audio, dan dokumen terstruktur.',
    problem: 'Kebutuhan pelaporan sering dimulai dari formulir, audio, dan workbook dengan struktur yang tidak seragam.',
    approach: [
      'Matriks praktik baik dan usulan bukti.',
      'Rekap program dengan pemetaan wilayah.',
      'Transkripsi bertimestamp menjadi dokumen Word.',
    ],
    output: 'Skrip dan keluaran spreadsheet, rekap, serta transkrip.',
    stack: ['Python', 'PowerShell', 'openpyxl', 'faster-whisper'],
  },
];

export const LABS: Lab[] = [
  {
    title: 'Knowledge Assistant / RAG',
    detail:
      'Workflow Telegram dengan model bahasa, memory, dan vector store. Kualitas jawaban dan grounding masih dievaluasi.',
    stack: 'n8n · Qdrant · Ollama · Embeddings',
  },
  {
    title: 'Submission Automation Prototype',
    detail: 'Rancangan sinkronisasi dan otomasi browser. Validasi respons akhir masih dalam pengujian.',
    stack: 'Playwright · GitHub Actions · Apps Script',
  },
  {
    title: 'Data Engineering / Fabric',
    detail: 'Workspace notebook dan SQL untuk eksplorasi data engineering di Microsoft Fabric.',
    stack: 'Microsoft Fabric · PySpark · SQL',
  },
  {
    title: 'Desktop Meeting Automation',
    detail: 'Otomasi antarmuka desktop dan browser dengan fallback OCR dan logging.',
    stack: 'Python · UI Automation · Playwright · OCR',
  },
];
