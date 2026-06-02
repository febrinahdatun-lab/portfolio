/**
 * SELEKSI.JS - Seleksi Beasiswa dengan Metode SAW
 * Simple Additive Weighting
 */

let seleksiData = [];

async function loadSeleksi() {
    // Try cache first for instant render
    if (dataStore.seleksi) {
        seleksiData = dataStore.seleksi;
        renderSeleksiTable();
        // Refresh in background
        API.getSeleksi().then(r => {
            if (r && r.success) {
                dataStore.seleksi = r.data;
                seleksiData = r.data;
                renderSeleksiTable();
            }
        });
        return;
    }

    showLoading('Memuat data seleksi...');
    const result = await API.getSeleksi();
    hideLoading();

    if (!result || !result.success) {
        showToast('Gagal memuat data seleksi', 'error');
        return;
    }

    seleksiData = result.data || [];
    dataStore.seleksi = seleksiData;
    renderSeleksiTable();
}

function renderSeleksiTable() {
    const tbody = document.getElementById('bodySeleksi');
    if (!tbody) return;

    if (seleksiData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="13"><div class="empty-state"><i class="fas fa-check-double"></i><h4>Belum Ada Data Seleksi</h4><p>Klik "Input Nilai Seleksi" untuk menambahkan data penilaian</p></div></td></tr>';
        return;
    }

    // Sort by ranking (best first), then by skor SAW
    const sorted = [...seleksiData].sort((a, b) => {
        if (a.ranking && b.ranking) return a.ranking - b.ranking;
        return (b.skor_saw || 0) - (a.skor_saw || 0);
    });

    tbody.innerHTML = sorted.map((s, i) => `
    <tr>
      <td><input type="checkbox" class="seleksiCheck" value="${s.id_pendaftar}"></td>
      <td>${i + 1}</td>
      <td><strong>${escapeHtml(s.nama_pendaftar)}</strong></td>
      <td>${s.c1_nilai_akhir || '-'}</td>
      <td>${s.c2_penghasilan_ortu ? formatCurrency(s.c2_penghasilan_ortu) : '-'}</td>
      <td>${s.c3_nilai_psikotes || '-'}</td>
      <td>${s.c4_nilai_survey || '-'}</td>
      <td>${s.c5_umur || '-'}</td>
      <td>${s.c6_jumlah_tanggungan || '-'}</td>
      <td><strong style="color:var(--primary);">${s.skor_saw ? parseFloat(s.skor_saw).toFixed(4) : '-'}</strong></td>
      <td>${s.ranking ? '<span class="badge badge-primary">#' + s.ranking + '</span>' : '-'}</td>
      <td>${getStatusBadge(s.status_seleksi || 'belum_dihitung')}</td>
      <td>
        <div class="action-btns">
          <button class="btn btn-sm btn-warning" onclick="editSeleksiNilai(${i})" title="Edit Nilai">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-success" onclick="setSeleksiStatus('${s.id_pendaftar}', 'lulus')" title="Luluskan" ${s.status_seleksi === 'lulus' ? 'disabled' : ''}>
            <i class="fas fa-check"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="showRejectSeleksi('${s.id_pendaftar}')" title="Tolak" ${s.status_seleksi === 'tidak_lulus' ? 'disabled' : ''}>
            <i class="fas fa-times"></i>
          </button>
          <button class="btn btn-sm btn-info" onclick="sendSeleksiEmail('${s.id_pendaftar}')" title="Kirim Email">
            <i class="fas fa-envelope"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function showAddSeleksi() {
    // Show form to input selection criteria values for a pendaftar
    const body = `
    <form id="seleksiForm">
      <div class="info-box info-blue">
        <i class="fas fa-info-circle"></i>
        <div>
          <strong>Input Nilai Seleksi:</strong> Masukkan nilai untuk setiap kriteria penilaian pendaftar.
          Nilai akan digunakan dalam perhitungan SAW untuk menentukan ranking.
        </div>
      </div>
      
      <div class="form-group">
        <label>Pilih Pendaftar *</label>
        <select id="sf_pendaftar" required onchange="autoFillSeleksi()">
          <option value="">-- Pilih Pendaftar --</option>
          ${pendaftarData.filter(p => p.status === 'pending').map(p =>
        `<option value="${p.id_pendaftar}" data-nama="${escapeHtml(p.nama_pendaftar)}" data-nilai="${p.nilai_akhir || 0}" data-penghasilan="${p.pemasukan_ortu || 0}" data-umur="${p.umur || 0}" data-tanggungan="${p.jumlah_tanggungan || 0}">${escapeHtml(p.nama_pendaftar)} - ${escapeHtml(p.no_registrasi)}</option>`
    ).join('')}
        </select>
      </div>
      
      <div class="form-section">
        <h4><i class="fas fa-star"></i> Kriteria Penilaian</h4>
        <div class="form-row">
          <div class="form-group">
            <label>C1 - Nilai Akhir/IPK * (0-100)</label>
            <input type="number" id="sf_c1" step="0.01" min="0" max="100" required>
          </div>
          <div class="form-group">
            <label>C2 - Penghasilan Orang Tua (Rp) *</label>
            <input type="number" id="sf_c2" min="0" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>C3 - Nilai Tes Psikotes * (0-100)</label>
            <input type="number" id="sf_c3" step="0.01" min="0" max="100" required>
          </div>
          <div class="form-group">
            <label>C4 - Nilai Survey Lapangan * (0-100)</label>
            <input type="number" id="sf_c4" step="0.01" min="0" max="100" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>C5 - Umur Pendaftar * (tahun)</label>
            <input type="number" id="sf_c5" min="1" max="60" required>
          </div>
          <div class="form-group">
            <label>C6 - Jumlah Tanggungan * (orang)</label>
            <input type="number" id="sf_c6" min="1" max="20" required>
          </div>
        </div>
      </div>
    </form>
  `;

    const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Batal</button>
    <button class="btn btn-primary" onclick="submitSeleksiNilai()">
      <i class="fas fa-save"></i> Simpan Nilai
    </button>
  `;

    openModal('Input Nilai Seleksi', body, footer);
}

function autoFillSeleksi() {
    const sel = document.getElementById('sf_pendaftar');
    const opt = sel.selectedOptions[0];
    if (!opt || !opt.value) return;

    document.getElementById('sf_c1').value = opt.dataset.nilai || '';
    document.getElementById('sf_c2').value = opt.dataset.penghasilan || '';
    document.getElementById('sf_c5').value = opt.dataset.umur || '';
    document.getElementById('sf_c6').value = opt.dataset.tanggungan || '';
}

async function submitSeleksiNilai() {
    const pendaftarId = document.getElementById('sf_pendaftar').value;
    const pendaftarName = document.getElementById('sf_pendaftar').selectedOptions[0]?.dataset?.nama || '';

    if (!pendaftarId) {
        showToast('Pilih pendaftar terlebih dahulu', 'warning');
        return;
    }

    const seleksiEntry = {
        id_seleksi: 'SEL-' + new Date().getTime(),
        id_pendaftar: pendaftarId,
        nama_pendaftar: pendaftarName,
        c1_nilai_akhir: document.getElementById('sf_c1').value,
        c2_penghasilan_ortu: document.getElementById('sf_c2').value,
        c3_nilai_psikotes: document.getElementById('sf_c3').value,
        c4_nilai_survey: document.getElementById('sf_c4').value,
        c5_umur: document.getElementById('sf_c5').value,
        c6_jumlah_tanggungan: document.getElementById('sf_c6').value,
        skor_saw: '',
        ranking: '',
        status_seleksi: 'belum_dihitung',
        keterangan_seleksi: '',
        diseleksi_oleh: '',
        tanggal_seleksi: ''
    };

    // Validate all criteria
    const criteria = ['sf_c1', 'sf_c2', 'sf_c3', 'sf_c4', 'sf_c5', 'sf_c6'];
    for (const c of criteria) {
        if (!document.getElementById(c).value) {
            showToast('Lengkapi semua nilai kriteria', 'warning');
            return;
        }
    }

    // Add to Seleksi sheet via a direct sheet append through our API
    showLoading('Menyimpan nilai seleksi...');

    // We use a generic approach - call addSeleksi (needs backend support, we'll add the data directly)
    const result = await API.call('addSeleksiEntry', { seleksi: seleksiEntry });

    hideLoading();

    if (result && result.success) {
        showToast('Nilai seleksi berhasil disimpan', 'success');
        closeModal();
        loadSeleksi();
    } else {
        showToast(result ? result.message : 'Gagal menyimpan', 'error');
    }
}

function editSeleksiNilai(index) {
    const sorted = [...seleksiData].sort((a, b) => {
        if (a.ranking && b.ranking) return a.ranking - b.ranking;
        return (b.skor_saw || 0) - (a.skor_saw || 0);
    });
    const s = sorted[index];

    const body = `
    <form id="editSeleksiForm">
      <div class="info-box info-blue">
        <i class="fas fa-user"></i>
        <div><strong>${escapeHtml(s.nama_pendaftar)}</strong> (${escapeHtml(s.id_pendaftar)})</div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>C1 - Nilai Akhir/IPK</label>
          <input type="number" id="esf_c1" value="${s.c1_nilai_akhir || ''}" step="0.01" min="0" max="100">
        </div>
        <div class="form-group">
          <label>C2 - Penghasilan Orang Tua (Rp)</label>
          <input type="number" id="esf_c2" value="${s.c2_penghasilan_ortu || ''}" min="0">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>C3 - Nilai Tes Psikotes</label>
          <input type="number" id="esf_c3" value="${s.c3_nilai_psikotes || ''}" step="0.01" min="0" max="100">
        </div>
        <div class="form-group">
          <label>C4 - Nilai Survey Lapangan</label>
          <input type="number" id="esf_c4" value="${s.c4_nilai_survey || ''}" step="0.01" min="0" max="100">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>C5 - Umur</label>
          <input type="number" id="esf_c5" value="${s.c5_umur || ''}" min="1" max="60">
        </div>
        <div class="form-group">
          <label>C6 - Jumlah Tanggungan</label>
          <input type="number" id="esf_c6" value="${s.c6_jumlah_tanggungan || ''}" min="1" max="20">
        </div>
      </div>
      <input type="hidden" id="esf_id" value="${s.id_pendaftar}">
      <input type="hidden" id="esf_selid" value="${s.id_seleksi}">
    </form>
  `;

    const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Batal</button>
    <button class="btn btn-primary" onclick="submitEditSeleksi()">
      <i class="fas fa-save"></i> Update Nilai
    </button>
  `;

    openModal('Edit Nilai Seleksi', body, footer);
}

async function submitEditSeleksi() {
    const seleksi = {
        id_seleksi: document.getElementById('esf_selid').value,
        id_pendaftar: document.getElementById('esf_id').value,
        c1_nilai_akhir: document.getElementById('esf_c1').value,
        c2_penghasilan_ortu: document.getElementById('esf_c2').value,
        c3_nilai_psikotes: document.getElementById('esf_c3').value,
        c4_nilai_survey: document.getElementById('esf_c4').value,
        c5_umur: document.getElementById('esf_c5').value,
        c6_jumlah_tanggungan: document.getElementById('esf_c6').value
    };

    showLoading('Memperbarui nilai...');
    const result = await API.call('updateSeleksiNilai', { seleksi });
    hideLoading();

    if (result && result.success) {
        showToast('Nilai berhasil diperbarui', 'success');
        closeModal();
        loadSeleksi();
    } else {
        showToast(result ? result.message : 'Gagal memperbarui', 'error');
    }
}

async function runSAWCalculation() {
    // Get selected checkboxes
    const checked = document.querySelectorAll('.seleksiCheck:checked');
    let ids;

    if (checked.length > 0) {
        ids = Array.from(checked).map(cb => cb.value);
    } else {
        // If none selected, use all
        ids = seleksiData.map(s => s.id_pendaftar);
    }

    if (ids.length === 0) {
        showToast('Tidak ada data seleksi untuk dihitung', 'warning');
        return;
    }

    const body = `
    <div style="text-align:center;padding:20px;">
      <i class="fas fa-calculator" style="font-size:3rem;color:var(--primary);margin-bottom:16px;"></i>
      <h4>Jalankan Perhitungan SAW?</h4>
      <p style="margin:10px 0;">Akan menghitung skor SAW untuk <strong>${ids.length} pendaftar</strong>.<br>
      Metode: Simple Additive Weighting (SAW)<br>
      Kriteria: C1-C6 dengan bobot yang sudah ditentukan.</p>
    </div>
  `;

    const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Batal</button>
    <button class="btn btn-success" onclick="doRunSAW(${JSON.stringify(ids).replace(/"/g, '&quot;')})">
      <i class="fas fa-play"></i> Jalankan SAW
    </button>
  `;

    openModal('Konfirmasi Perhitungan SAW', body, footer);
}

async function doRunSAW(ids) {
    closeModal();
    showLoading('Menjalankan perhitungan SAW...');

    const result = await API.runSAW(ids);
    hideLoading();

    if (result && result.success) {
        showToast('Perhitungan SAW berhasil! ' + (result.data ? result.data.length + ' pendaftar telah diranking.' : ''), 'success');

        // Show results
        if (result.data && result.data.length > 0) {
            showSAWResults(result.data);
        }

        loadSeleksi();
    } else {
        showToast(result ? result.message : 'Gagal menjalankan SAW', 'error');
    }
}

function showSAWResults(results) {
    let tableRows = results.map((r, i) => `
    <tr style="${i < 3 ? 'background:var(--success-light);' : ''}">
      <td><strong>#${r.ranking}</strong></td>
      <td>${escapeHtml(r.nama_pendaftar)}</td>
      <td><strong style="color:var(--primary);">${parseFloat(r.skor_saw).toFixed(4)}</strong></td>
      <td>${i < 3 ? '<span class="badge badge-success">Top 3</span>' : ''}</td>
    </tr>
  `).join('');

    const body = `
    <div class="info-box info-blue">
      <i class="fas fa-trophy"></i>
      <div><strong>Hasil Perhitungan SAW</strong><br>Berikut adalah ranking berdasarkan skor SAW (tertinggi ke terendah)</div>
    </div>
    <table class="data-table">
      <thead>
        <tr><th>Ranking</th><th>Nama Pendaftar</th><th>Skor SAW</th><th>Keterangan</th></tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>
  `;

    openModal('Hasil Perhitungan SAW', body, '<button class="btn btn-primary" onclick="closeModal()">OK</button>');
}

async function setSeleksiStatus(id, status) {
    showLoading('Memperbarui status...');
    const result = await API.updateSeleksi(id, status, '');
    hideLoading();

    if (result && result.success) {
        showToast('Status seleksi berhasil diperbarui', 'success');
        loadSeleksi();
    } else {
        showToast(result ? result.message : 'Gagal memperbarui status', 'error');
    }
}

function showRejectSeleksi(id) {
    const body = `
    <div class="form-group">
      <label>Alasan Penolakan</label>
      <textarea id="rejectReason" rows="3" placeholder="Masukkan alasan penolakan..."></textarea>
    </div>
  `;
    const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Batal</button>
    <button class="btn btn-danger" onclick="doRejectSeleksi('${id}')">
      <i class="fas fa-times"></i> Tolak
    </button>
  `;
    openModal('Tolak Pendaftar', body, footer);
}

async function doRejectSeleksi(id) {
    const reason = document.getElementById('rejectReason').value.trim();
    closeModal();
    showLoading('Memperbarui status...');
    const result = await API.updateSeleksi(id, 'tidak_lulus', reason);
    hideLoading();

    if (result && result.success) {
        showToast('Pendaftar ditolak', 'success');
        loadSeleksi();
    } else {
        showToast(result ? result.message : 'Gagal', 'error');
    }
}

async function sendSeleksiEmail(pendaftarId) {
    // Find pendaftar email
    const pendaftar = pendaftarData.find(p => p.id_pendaftar === pendaftarId);
    const seleksi = seleksiData.find(s => s.id_pendaftar === pendaftarId);

    if (!pendaftar || !pendaftar.email) {
        showToast('Email pendaftar tidak tersedia', 'warning');
        return;
    }

    const status = seleksi ? seleksi.status_seleksi : 'belum_dihitung';
    let statusText = 'belum ditentukan';
    if (status === 'lulus') statusText = 'LULUS';
    else if (status === 'tidak_lulus') statusText = 'TIDAK LULUS';

    const subject = 'Informasi Hasil Seleksi Beasiswa - ' + CONFIG.APP_ORG;
    const body = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#1a56db;color:white;padding:20px;text-align:center;">
        <h2>Informasi Hasil Seleksi Beasiswa</h2>
        <p>${CONFIG.APP_ORG}</p>
      </div>
      <div style="padding:20px;border:1px solid #e2e8f0;">
        <p>Kepada Yth. <strong>${escapeHtml(pendaftar.nama_pendaftar)}</strong>,</p>
        <p>Dengan ini kami informasikan bahwa hasil seleksi beasiswa Anda adalah:</p>
        <div style="text-align:center;padding:20px;margin:20px 0;background:${status === 'lulus' ? '#ecfdf5' : '#fef2f2'};border-radius:8px;">
          <h2 style="color:${status === 'lulus' ? '#059669' : '#dc2626'};">${statusText}</h2>
          ${seleksi && seleksi.keterangan_seleksi ? '<p>' + escapeHtml(seleksi.keterangan_seleksi) + '</p>' : ''}
        </div>
        <p>Nomor Registrasi: <strong>${escapeHtml(pendaftar.no_registrasi)}</strong></p>
        ${seleksi && seleksi.skor_saw ? '<p>Skor SAW: <strong>' + parseFloat(seleksi.skor_saw).toFixed(4) + '</strong></p>' : ''}
        <p>Demikian informasi ini kami sampaikan. Terima kasih.</p>
        <br>
        <p>Hormat kami,<br><strong>${CONFIG.APP_ORG}</strong></p>
      </div>
    </div>
  `;

    showLoading('Mengirim email...');
    const result = await API.sendNotification(pendaftar.email, subject, body);
    hideLoading();

    if (result && result.success) {
        showToast('Email berhasil dikirim ke ' + pendaftar.email, 'success');
    } else {
        showToast(result ? result.message : 'Gagal mengirim email', 'error');
    }
}