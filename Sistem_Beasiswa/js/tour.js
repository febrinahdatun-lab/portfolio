/**
 * TOUR.JS - Interactive Guided Tour System
 * Panduan interaktif untuk memahami alur proses bisnis sistem beasiswa
 */

let tourCurrentStep = 0;
let tourSteps = [];
let tourActive = false;

const TOUR_STEPS = [
    {
        target: '#welcomeCard',
        page: 'dashboard',
        title: '👋 Selamat Datang di Sistem Beasiswa!',
        desc: 'Ini adalah <strong>Dashboard</strong> — pusat informasi utama. Di sini Anda dapat melihat ringkasan jumlah pendaftar, status pendaftar (aktif, pending, ditolak), dan grafik statistik penyaluran beasiswa.',
        position: 'bottom'
    },
    {
        target: '.stats-grid',
        page: 'dashboard',
        title: '📊 Kartu Statistik',
        desc: 'Empat kartu ini menampilkan ringkasan cepat: <strong>Total Pendaftar</strong>, <strong>Aktif</strong>, <strong>Pending</strong>, dan <strong>Ditolak</strong>. Angka-angka ini diperbarui secara real-time dari database.',
        position: 'bottom'
    },
    {
        target: '.charts-grid',
        page: 'dashboard',
        title: '📈 Grafik & Visualisasi',
        desc: 'Grafik-grafik ini menampilkan: distribusi status pendaftar (pie chart), jumlah pendaftar per Kantor Wilayah (bar chart), tren bulanan, dan distribusi per tingkatan pendidikan.',
        position: 'top'
    },
    {
        target: '#page-pendaftar .page-actions',
        page: 'pendaftar',
        title: '📝 Langkah 1: Pendaftaran',
        desc: 'Klik tombol <strong>"Tambah Pendaftar"</strong> untuk menginput data calon penerima beasiswa. Formulir mencakup: data diri, data sekolah, data orang tua, data referensi, dan kelengkapan berkas (raport, KTP, KK, SKTM, dll).',
        position: 'bottom'
    },
    {
        target: '#tablePendaftar',
        page: 'pendaftar',
        title: '📋 Daftar & Verifikasi Pendaftar',
        desc: 'Tabel ini menampilkan semua pendaftar. Admin dapat <strong>Lihat Detail</strong>, <strong>Edit</strong>, atau <strong>Hapus</strong> data. Perhatikan kolom <strong>Status</strong> — ini menunjukkan tahap verifikasi: aktif (lolos verifikasi), pending (menunggu), atau ditolak.',
        position: 'top'
    },
    {
        target: '#page-seleksi .page-actions',
        page: 'seleksi',
        title: '⚖️ Langkah 2: Input Nilai Seleksi',
        desc: 'Klik <strong>"Input Nilai Seleksi"</strong> untuk memasukkan 6 kriteria penilaian (C1–C6) bagi setiap pendaftar: Nilai Akhir, Penghasilan Ortu, Tes Psikotes, Survey Lapangan, Umur, dan Jumlah Tanggungan.',
        position: 'bottom'
    },
    {
        target: '#tableSeleksi thead',
        page: 'seleksi',
        title: '🧮 Langkah 3: Hitung SAW & Ranking',
        desc: 'Setelah semua nilai diinput, klik <strong>"Hitung SAW"</strong>. Sistem akan melakukan: (1) <strong>Normalisasi</strong> matriks keputusan, (2) <strong>Perhitungan V<sub>i</sub></strong> = Σ W × R, (3) <strong>Ranking</strong> otomatis. Pendaftar dengan skor tertinggi mendapat ranking #1.',
        position: 'bottom'
    },
    {
        target: '#tableSeleksi',
        page: 'seleksi',
        title: '✅ Langkah 4: Keputusan Seleksi',
        desc: 'Gunakan tombol <strong>✓ (Luluskan)</strong> atau <strong>✗ (Tolak)</strong> pada kolom Aksi untuk memutuskan status akhir. Keputusan bersifat final. Anda juga dapat mengirim <strong>notifikasi email</strong> ke pendaftar dengan tombol amplop.',
        position: 'top'
    },
    {
        target: '#page-pencairan .page-actions',
        page: 'pencairan',
        title: '💰 Langkah 5: Pencairan Dana',
        desc: 'Klik <strong>"Tambah Pencairan"</strong> untuk membuat record pencairan baru, atau <strong>"Generate Salary Crediting"</strong> untuk membuat batch pencairan otomatis. Nominal sesuai tingkatan: SD Rp150rb, SMP Rp200rb, SMA Rp250rb, PT Rp500rb per bulan.',
        position: 'bottom'
    },
    {
        target: '#page-pencairan .card',
        page: 'pencairan',
        title: '📑 Monitoring Pencairan',
        desc: 'Tabel pencairan menampilkan status: <strong>Cair</strong> (berhasil), <strong>Proses</strong> (menunggu), atau <strong>Gagal</strong> (perlu tindakan). Setiap pencairan tercatat lengkap dengan nomor rekening BRI dan Kantor Wilayah.',
        position: 'top'
    },
    {
        target: null,
        page: 'laporan',
        title: '📊 Langkah 6: Laporan',
        desc: 'Halaman Laporan menyediakan 4 jenis: <strong>Data Pendaftar</strong>, <strong>Hasil Seleksi</strong>, <strong>Pencairan Beasiswa</strong>, dan <strong>Penyaluran per Kanwil</strong>. Semua laporan dapat di-<strong>Export</strong> ke Excel atau <strong>Print</strong> untuk dokumentasi.',
        position: 'center'
    },
    {
        target: null,
        page: 'tentang',
        title: '🎓 Tur Selesai!',
        desc: 'Anda telah mempelajari seluruh alur proses bisnis sistem beasiswa — dari <strong>Pendaftaran</strong> → <strong>Verifikasi</strong> → <strong>Seleksi SAW</strong> → <strong>Keputusan</strong> → <strong>Pencairan</strong> → <strong>Laporan</strong>. Sistem ini dirancang berdasarkan skripsi Febri Nahdatun di Universitas Indraprasta PGRI. Selamat menjelajahi!',
        position: 'center'
    }
];

function startGuidedTour() {
    tourSteps = TOUR_STEPS;
    tourCurrentStep = 0;
    tourActive = true;
    showTourStep();
}

function showTourStep() {
    const step = tourSteps[tourCurrentStep];
    const overlay = document.getElementById('tourOverlay');
    const tooltip = document.getElementById('tourTooltip');

    // Navigate to the correct page
    if (step.page && currentPage !== step.page) {
        navigateTo(step.page);
        // Allow page to render
        setTimeout(() => positionTourStep(step), 300);
    } else {
        positionTourStep(step);
    }
}

function positionTourStep(step) {
    const overlay = document.getElementById('tourOverlay');
    const tooltip = document.getElementById('tourTooltip');

    // Update content
    document.getElementById('tourStepIndicator').textContent = (tourCurrentStep + 1) + ' / ' + tourSteps.length;
    document.getElementById('tourTitle').innerHTML = step.title;
    document.getElementById('tourDesc').innerHTML = step.desc;

    // Button visibility
    document.getElementById('tourPrevBtn').style.display = tourCurrentStep === 0 ? 'none' : '';
    const nextBtn = document.getElementById('tourNextBtn');
    if (tourCurrentStep === tourSteps.length - 1) {
        nextBtn.innerHTML = '<i class="fas fa-check"></i> Selesai';
        nextBtn.className = 'btn btn-sm btn-success';
    } else {
        nextBtn.innerHTML = 'Selanjutnya <i class="fas fa-arrow-right"></i>';
        nextBtn.className = 'btn btn-sm btn-primary';
    }

    // Show overlay
    overlay.style.display = 'block';
    tooltip.style.display = 'block';

    // Position tooltip
    if (step.target && step.position !== 'center') {
        const targetEl = document.querySelector(step.target);
        if (targetEl) {
            // Scroll target into view
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

            setTimeout(() => {
                const rect = targetEl.getBoundingClientRect();

                // Highlight the target
                targetEl.classList.add('tour-highlight');

                // Remove highlight from previous elements
                document.querySelectorAll('.tour-highlight').forEach(el => {
                    if (el !== targetEl) el.classList.remove('tour-highlight');
                });

                // Calculate tooltip position
                const tooltipRect = tooltip.getBoundingClientRect();
                let top, left;

                if (step.position === 'bottom') {
                    top = rect.bottom + 12;
                    left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                } else if (step.position === 'top') {
                    top = rect.top - tooltipRect.height - 12;
                    left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                }

                // Keep within viewport
                left = Math.max(12, Math.min(left, window.innerWidth - tooltipRect.width - 12));
                top = Math.max(12, Math.min(top, window.innerHeight - tooltipRect.height - 12));

                tooltip.style.position = 'fixed';
                tooltip.style.top = top + 'px';
                tooltip.style.left = left + 'px';
                tooltip.style.transform = 'none';
            }, 350);
        } else {
            centerTooltip(tooltip);
        }
    } else {
        // Center tooltip
        document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
        centerTooltip(tooltip);
    }
}

function centerTooltip(tooltip) {
    tooltip.style.position = 'fixed';
    tooltip.style.top = '50%';
    tooltip.style.left = '50%';
    tooltip.style.transform = 'translate(-50%, -50%)';
}

function tourNext() {
    if (tourCurrentStep >= tourSteps.length - 1) {
        endTour();
        return;
    }
    tourCurrentStep++;
    showTourStep();
}

function tourPrev() {
    if (tourCurrentStep > 0) {
        tourCurrentStep--;
        showTourStep();
    }
}

function endTour() {
    tourActive = false;
    document.getElementById('tourOverlay').style.display = 'none';
    document.getElementById('tourTooltip').style.display = 'none';
    document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
}

// Close tour on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && tourActive) endTour();
});