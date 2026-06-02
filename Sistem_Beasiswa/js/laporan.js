/**
 * LAPORAN.JS - Laporan & Reporting
 * Report generation, table display, export, and print
 */

let laporanData = [];
let currentReportType = '';

async function loadLaporan() {
    const wrapper = document.getElementById('laporanContent');
    if (wrapper) {
        wrapper.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-file-alt"></i>
        <h4>Pilih Jenis Laporan</h4>
        <p>Gunakan dropdown di atas untuk memilih jenis laporan yang ingin ditampilkan</p>
      </div>
    `;
    }
}

async function generateLaporan() {
    const selectEl = document.getElementById('reportType');
    if (!selectEl) return;

    currentReportType = selectEl.value;

    if (!currentReportType) {
        showToast('Pilih jenis laporan terlebih dahulu', 'warning');
        return;
    }

    showLoading('Mengambil data laporan...');
    const result = await API.getLaporan(currentReportType);
    hideLoading();

    if (!result || !result.success) {
        showToast('Gagal memuat laporan', 'error');
        return;
    }

    laporanData = result.data || [];

    switch (currentReportType) {
        case 'pendaftar':
            renderLaporanPendaftar();
            break;
        case 'seleksi':
            renderLaporanSeleksi();
            break;
        case 'pencairan':
            renderLaporanPencairan();
            break;
        case 'penyaluran':
            renderLaporanPenyaluran();
            break;
        default:
            showToast('Jenis laporan tidak dikenali', 'warning');
    }
}

function renderLaporanPendaftar() {
    const wrapper = document.getElementById('laporanContent');
    if (!wrapper) return;

    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    wrapper.innerHTML = `
    <div class="report-container" id="reportPrintArea">
      <div class="report-header">
        <h2 style="margin:0;color:var(--primary);">LAPORAN DATA PENDAFTAR BEASISWA</h2>
        <p style="margin:4px 0;">${CONFIG.APP_ORG}</p>
        <p style="margin:4px 0;font-size:12px;color:#666;">Tanggal Cetak: ${today}</p>
        <hr style="margin:12px 0;">
      </div>
      
      <div style="margin-bottom:12px;">
        <strong>Total Pendaftar:</strong> ${laporanData.length}
      </div>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>No Registrasi</th>
            <th>Nama</th>
            <th>Jenis Kelamin</th>
            <th>Tingkatan</th>
            <th>Kanwil</th>
            <th>Status</th>
            <th>Tanggal Daftar</th>
          </tr>
        </thead>
        <tbody>
          ${laporanData.length === 0
            ? '<tr><td colspan="8" style="text-align:center;">Tidak ada data</td></tr>'
            : laporanData.map((p, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${escapeHtml(p.no_registrasi || '-')}</td>
              <td>${escapeHtml(p.nama_pendaftar || '-')}</td>
              <td>${escapeHtml(p.jenis_kelamin || '-')}</td>
              <td>${escapeHtml(p.tingkatan || '-')}</td>
              <td>${escapeHtml(p.kanwil || '-')}</td>
              <td>${getStatusBadge(p.status || 'pending')}</td>
              <td>${p.tanggal_daftar ? formatDate(p.tanggal_daftar) : '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderLaporanSeleksi() {
    const wrapper = document.getElementById('laporanContent');
    if (!wrapper) return;

    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const lulus = laporanData.filter(s => s.status_seleksi === 'lulus').length;
    const tidakLulus = laporanData.filter(s => s.status_seleksi === 'tidak_lulus').length;

    wrapper.innerHTML = `
    <div class="report-container" id="reportPrintArea">
      <div class="report-header">
        <h2 style="margin:0;color:var(--primary);">LAPORAN HASIL SELEKSI BEASISWA</h2>
        <p style="margin:4px 0;">${CONFIG.APP_ORG}</p>
        <p style="margin:4px 0;font-size:12px;color:#666;">Metode: Simple Additive Weighting (SAW) | Tanggal Cetak: ${today}</p>
        <hr style="margin:12px 0;">
      </div>
      
      <div style="display:flex;gap:20px;margin-bottom:12px;">
        <div><strong>Total Peserta Seleksi:</strong> ${laporanData.length}</div>
        <div><strong style="color:var(--success);">Lulus:</strong> ${lulus}</div>
        <div><strong style="color:var(--danger);">Tidak Lulus:</strong> ${tidakLulus}</div>
      </div>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>Ranking</th>
            <th>Nama</th>
            <th>C1</th>
            <th>C2</th>
            <th>C3</th>
            <th>C4</th>
            <th>C5</th>
            <th>C6</th>
            <th>Skor SAW</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${laporanData.length === 0
            ? '<tr><td colspan="10" style="text-align:center;">Tidak ada data</td></tr>'
            : laporanData.sort((a, b) => (a.ranking || 999) - (b.ranking || 999)).map(s => `
            <tr>
              <td><strong>#${s.ranking || '-'}</strong></td>
              <td>${escapeHtml(s.nama_pendaftar || '-')}</td>
              <td>${s.c1_nilai_akhir || '-'}</td>
              <td>${s.c2_penghasilan_ortu ? formatCurrency(s.c2_penghasilan_ortu) : '-'}</td>
              <td>${s.c3_nilai_psikotes || '-'}</td>
              <td>${s.c4_nilai_survey || '-'}</td>
              <td>${s.c5_umur || '-'}</td>
              <td>${s.c6_jumlah_tanggungan || '-'}</td>
              <td><strong>${s.skor_saw ? parseFloat(s.skor_saw).toFixed(4) : '-'}</strong></td>
              <td>${getStatusBadge(s.status_seleksi || 'belum_dihitung')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderLaporanPencairan() {
    const wrapper = document.getElementById('laporanContent');
    if (!wrapper) return;

    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const totalCair = laporanData.filter(p => p.status_pencairan === 'cair');
    const totalNominal = totalCair.reduce((sum, p) => sum + (parseFloat(p.nominal) || 0), 0);

    wrapper.innerHTML = `
    <div class="report-container" id="reportPrintArea">
      <div class="report-header">
        <h2 style="margin:0;color:var(--primary);">LAPORAN PENCAIRAN DANA BEASISWA</h2>
        <p style="margin:4px 0;">${CONFIG.APP_ORG}</p>
        <p style="margin:4px 0;font-size:12px;color:#666;">Tanggal Cetak: ${today}</p>
        <hr style="margin:12px 0;">
      </div>
      
      <div style="display:flex;gap:20px;margin-bottom:12px;">
        <div><strong>Total Record:</strong> ${laporanData.length}</div>
        <div><strong>Sudah Cair:</strong> ${totalCair.length}</div>
        <div><strong>Total Nominal Cair:</strong> ${formatCurrency(totalNominal)}</div>
      </div>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>No Rekening</th>
            <th>Bank</th>
            <th>Nominal</th>
            <th>Periode</th>
            <th>Tanggal Cair</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${laporanData.length === 0
            ? '<tr><td colspan="8" style="text-align:center;">Tidak ada data</td></tr>'
            : laporanData.map((p, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${escapeHtml(p.nama_pendaftar || '-')}</td>
              <td>${escapeHtml(p.no_rekening || '-')}</td>
              <td>${escapeHtml(p.nama_bank || '-')}</td>
              <td><strong>${p.nominal ? formatCurrency(p.nominal) : '-'}</strong></td>
              <td>${escapeHtml(p.periode || '-')}</td>
              <td>${p.tanggal_cair ? formatDate(p.tanggal_cair) : '-'}</td>
              <td>${getStatusBadge(p.status_pencairan || 'proses')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div style="margin-top:20px;text-align:right;">
        <strong>Total Pencairan: ${formatCurrency(totalNominal)}</strong>
      </div>
    </div>
  `;
}

function renderLaporanPenyaluran() {
    const wrapper = document.getElementById('laporanContent');
    if (!wrapper) return;

    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    // Group by kanwil
    const byKanwil = {};
    laporanData.forEach(item => {
        const kw = item.kanwil || 'Tidak Diketahui';
        if (!byKanwil[kw]) byKanwil[kw] = { count: 0, nominal: 0, items: [] };
        byKanwil[kw].count++;
        byKanwil[kw].nominal += parseFloat(item.nominal) || 0;
        byKanwil[kw].items.push(item);
    });

    const grandTotal = Object.values(byKanwil).reduce((sum, kw) => sum + kw.nominal, 0);

    wrapper.innerHTML = `
    <div class="report-container" id="reportPrintArea">
      <div class="report-header">
        <h2 style="margin:0;color:var(--primary);">LAPORAN PENYALURAN BEASISWA PER KANWIL</h2>
        <p style="margin:4px 0;">${CONFIG.APP_ORG}</p>
        <p style="margin:4px 0;font-size:12px;color:#666;">Tanggal Cetak: ${today}</p>
        <hr style="margin:12px 0;">
      </div>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Kanwil</th>
            <th>Jumlah Penerima</th>
            <th>Total Nominal</th>
            <th>Persentase</th>
          </tr>
        </thead>
        <tbody>
          ${Object.keys(byKanwil).length === 0
            ? '<tr><td colspan="5" style="text-align:center;">Tidak ada data</td></tr>'
            : Object.entries(byKanwil).map(([kw, data], i) => {
                const pct = grandTotal > 0 ? ((data.nominal / grandTotal) * 100).toFixed(1) : 0;
                return `
              <tr>
                <td>${i + 1}</td>
                <td><strong>${escapeHtml(kw)}</strong></td>
                <td>${data.count} orang</td>
                <td><strong>${formatCurrency(data.nominal)}</strong></td>
                <td>
                  <div class="progress-bar-container" style="display:inline-flex;align-items:center;gap:8px;width:100%;">
                    <div class="progress-bar" style="flex:1;height:12px;background:#e5e7eb;border-radius:6px;overflow:hidden;">
                      <div style="width:${pct}%;height:100%;background:var(--primary);border-radius:6px;"></div>
                    </div>
                    <span>${pct}%</span>
                  </div>
                </td>
              </tr>`;
            }).join('')}
        </tbody>
        <tfoot>
          <tr style="font-weight:bold;background:#f1f5f9;">
            <td colspan="2" style="text-align:right;">TOTAL</td>
            <td>${Object.values(byKanwil).reduce((s, k) => s + k.count, 0)} orang</td>
            <td>${formatCurrency(grandTotal)}</td>
            <td>100%</td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;
}

function exportLaporan() {
    if (laporanData.length === 0) {
        showToast('Tidak ada data untuk di-export', 'warning');
        return;
    }

    let csvContent = '';
    let filename = '';

    switch (currentReportType) {
        case 'pendaftar':
            filename = 'laporan_pendaftar.csv';
            csvContent = 'No,No Registrasi,Nama,Jenis Kelamin,Tingkatan,Kanwil,Status,Tanggal Daftar\n';
            laporanData.forEach((p, i) => {
                csvContent += `${i + 1},"${p.no_registrasi || ''}","${p.nama_pendaftar || ''}","${p.jenis_kelamin || ''}","${p.tingkatan || ''}","${p.kanwil || ''}","${p.status || ''}","${p.tanggal_daftar || ''}"\n`;
            });
            break;

        case 'seleksi':
            filename = 'laporan_seleksi.csv';
            csvContent = 'Ranking,Nama,C1 Nilai Akhir,C2 Penghasilan Ortu,C3 Psikotes,C4 Survey,C5 Umur,C6 Tanggungan,Skor SAW,Status\n';
            laporanData.sort((a, b) => (a.ranking || 999) - (b.ranking || 999)).forEach(s => {
                csvContent += `${s.ranking || ''},"${s.nama_pendaftar || ''}",${s.c1_nilai_akhir || ''},${s.c2_penghasilan_ortu || ''},${s.c3_nilai_psikotes || ''},${s.c4_nilai_survey || ''},${s.c5_umur || ''},${s.c6_jumlah_tanggungan || ''},${s.skor_saw || ''},"${s.status_seleksi || ''}"\n`;
            });
            break;

        case 'pencairan':
            filename = 'laporan_pencairan.csv';
            csvContent = 'No,Nama,No Rekening,Bank,Nominal,Periode,Tanggal Cair,Status\n';
            laporanData.forEach((p, i) => {
                csvContent += `${i + 1},"${p.nama_pendaftar || ''}","${p.no_rekening || ''}","${p.nama_bank || ''}",${p.nominal || ''},"${p.periode || ''}","${p.tanggal_cair || ''}","${p.status_pencairan || ''}"\n`;
            });
            break;

        case 'penyaluran':
            filename = 'laporan_penyaluran_kanwil.csv';
            csvContent = 'No,Kanwil,Jumlah Penerima,Total Nominal\n';
            const byKanwil = {};
            laporanData.forEach(item => {
                const kw = item.kanwil || 'Tidak Diketahui';
                if (!byKanwil[kw]) byKanwil[kw] = { count: 0, nominal: 0 };
                byKanwil[kw].count++;
                byKanwil[kw].nominal += parseFloat(item.nominal) || 0;
            });
            Object.entries(byKanwil).forEach(([kw, data], i) => {
                csvContent += `${i + 1},"${kw}",${data.count},${data.nominal}\n`;
            });
            break;
    }

    // Create download using BOM for proper encoding in Excel
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Berhasil export ke ' + filename, 'success');
}

function printLaporan() {
    const printArea = document.getElementById('reportPrintArea');
    if (!printArea) {
        showToast('Tidak ada laporan untuk dicetak', 'warning');
        return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Cetak Laporan - ${CONFIG.APP_NAME}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        h2 { color: #1a56db; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 12px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f1f5f9; font-weight: bold; }
        tr:nth-child(even) { background: #f9fafb; }
        .badge { padding: 2px 8px; border-radius: 4px; font-size: 11px; }
        hr { border: none; border-top: 2px solid #1a56db; }
        @media print {
          body { margin: 0; }
          @page { margin: 15mm; }
        }
      </style>
    </head>
    <body>
      ${printArea.innerHTML}
    </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}