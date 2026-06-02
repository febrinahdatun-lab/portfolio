/**
 * PENCAIRAN.JS - Pencairan Dana Beasiswa
 * Disbursement Management
 */

let pencairanData = [];

async function loadPencairan() {
    // Try cache first for instant render
    if (dataStore.pencairan) {
        pencairanData = dataStore.pencairan;
        renderPencairanTable();
        renderPencairanSummary();
        // Refresh in background
        API.getPencairan().then(r => {
            if (r && r.success) {
                dataStore.pencairan = r.data;
                pencairanData = r.data;
                renderPencairanTable();
                renderPencairanSummary();
            }
        });
        return;
    }

    showLoading('Memuat data pencairan...');
    const result = await API.getPencairan();
    hideLoading();

    if (!result || !result.success) {
        showToast('Gagal memuat data pencairan', 'error');
        return;
    }

    pencairanData = result.data || [];
    dataStore.pencairan = pencairanData;
    renderPencairanTable();
    renderPencairanSummary();
}

function renderPencairanSummary() {
    const summaryEl = document.getElementById('pencairanSummary');
    if (!summaryEl) return;

    const total = pencairanData.length;
    const cair = pencairanData.filter(p => p.status_pencairan === 'cair');
    const proses = pencairanData.filter(p => p.status_pencairan === 'proses');
    const gagal = pencairanData.filter(p => p.status_pencairan === 'gagal');
    const totalNominal = cair.reduce((sum, p) => sum + (parseFloat(p.nominal) || 0), 0);

    summaryEl.innerHTML = `
    <div class="stat-card stat-blue">
      <div class="stat-icon"><i class="fas fa-file-invoice-dollar"></i></div>
      <div class="stat-info"><div class="stat-value">${total}</div><div class="stat-label">Total Pencairan</div></div>
    </div>
    <div class="stat-card stat-green">
      <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
      <div class="stat-info"><div class="stat-value">${cair.length}</div><div class="stat-label">Sudah Cair</div></div>
    </div>
    <div class="stat-card stat-yellow">
      <div class="stat-icon"><i class="fas fa-clock"></i></div>
      <div class="stat-info"><div class="stat-value">${proses.length}</div><div class="stat-label">Dalam Proses</div></div>
    </div>
    <div class="stat-card stat-red">
      <div class="stat-icon"><i class="fas fa-times-circle"></i></div>
      <div class="stat-info"><div class="stat-value">${gagal.length}</div><div class="stat-label">Gagal</div></div>
    </div>
    <div class="stat-card" style="background:linear-gradient(135deg,#1a56db,#3b82f6);color:white;">
      <div class="stat-icon" style="color:rgba(255,255,255,0.8);"><i class="fas fa-money-bill-wave"></i></div>
      <div class="stat-info"><div class="stat-value" style="color:white;">${formatCurrency(totalNominal)}</div><div class="stat-label" style="color:rgba(255,255,255,0.8);">Total Cair</div></div>
    </div>
  `;
}

function renderPencairanTable() {
    const tbody = document.getElementById('bodyPencairan');
    if (!tbody) return;

    if (pencairanData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10"><div class="empty-state"><i class="fas fa-money-bill-wave"></i><h4>Belum Ada Data Pencairan</h4><p>Klik "Tambah Pencairan" untuk menambahkan data pencairan beasiswa</p></div></td></tr>';
        return;
    }

    tbody.innerHTML = pencairanData.map((p, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${escapeHtml(p.nama_pendaftar)}</strong></td>
      <td>${escapeHtml(p.no_rekening || '-')}</td>
      <td>${escapeHtml(p.nama_bank || '-')}</td>
      <td><strong>${p.nominal ? formatCurrency(p.nominal) : '-'}</strong></td>
      <td>${escapeHtml(p.periode || '-')}</td>
      <td>${p.tanggal_cair ? formatDate(p.tanggal_cair) : '-'}</td>
      <td>${getStatusBadge(p.status_pencairan || 'proses')}</td>
      <td>
        <div class="action-btns">
          <button class="btn btn-sm btn-warning" onclick="editPencairan(${i})" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-success" onclick="confirmCairkan('${p.id_pencairan}')" title="Cairkan" ${p.status_pencairan === 'cair' ? 'disabled' : ''}>
            <i class="fas fa-hand-holding-usd"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="confirmDeletePencairan('${p.id_pencairan}')" title="Hapus">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function showAddPencairan() {
    // Only show pendaftars with seleksi status = 'lulus'
    const eligible = seleksiData.filter(s => s.status_seleksi === 'lulus');

    const body = `
    <form id="pencairanForm">
      <div class="form-group">
        <label>Pilih Penerima Beasiswa *</label>
        <select id="pf_pendaftar" required onchange="autoFillPencairan()">
          <option value="">-- Pilih Penerima --</option>
          ${eligible.map(s => {
        const p = pendaftarData.find(pd => pd.id_pendaftar === s.id_pendaftar);
        return `<option value="${s.id_pendaftar}" 
              data-nama="${escapeHtml(s.nama_pendaftar)}"
              data-norek="${p ? escapeHtml(p.no_rekening || '') : ''}"
              data-bank="${p ? escapeHtml(p.nama_bank || '') : ''}"
              data-tingkatan="${p ? escapeHtml(p.tingkatan || '') : ''}"
            >${escapeHtml(s.nama_pendaftar)} (Ranking #${s.ranking || '-'})</option>`;
    }).join('')}
        </select>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>No Rekening *</label>
          <input type="text" id="pf_norek" required>
        </div>
        <div class="form-group">
          <label>Nama Bank *</label>
          <input type="text" id="pf_bank" required>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Nominal Pencairan (Rp) *</label>
          <input type="number" id="pf_nominal" min="0" required>
        </div>
        <div class="form-group">
          <label>Periode *</label>
          <select id="pf_periode" required>
            <option value="">-- Pilih Periode --</option>
            <option value="Semester 1 2024/2025">Semester 1 2024/2025</option>
            <option value="Semester 2 2024/2025">Semester 2 2024/2025</option>
            <option value="Semester 1 2025/2026">Semester 1 2025/2026</option>
            <option value="Semester 2 2025/2026">Semester 2 2025/2026</option>
          </select>
        </div>
      </div>
      
      <div class="form-group">
        <label>Keterangan</label>
        <textarea id="pf_keterangan" rows="2" placeholder="Catatan tambahan..."></textarea>
      </div>
    </form>
  `;

    const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Batal</button>
    <button class="btn btn-primary" onclick="submitPencairan()">
      <i class="fas fa-save"></i> Simpan
    </button>
  `;

    openModal('Tambah Pencairan', body, footer);
}

function autoFillPencairan() {
    const sel = document.getElementById('pf_pendaftar');
    const opt = sel.selectedOptions[0];
    if (!opt || !opt.value) return;

    document.getElementById('pf_norek').value = opt.dataset.norek || '';
    document.getElementById('pf_bank').value = opt.dataset.bank || '';

    // Auto-fill nominal based on tingkatan
    const tingkatanName = opt.dataset.tingkatan;
    if (tingkatanName && typeof tingkatanCache !== 'undefined') {
        const ting = tingkatanCache.find(t => t.nama_tingkatan === tingkatanName);
        if (ting && ting.nominal) {
            document.getElementById('pf_nominal').value = ting.nominal;
        }
    }
}

async function submitPencairan(editId) {
    const pendaftarId = editId || document.getElementById('pf_pendaftar').value;
    const nama = editId
        ? (pencairanData.find(p => p.id_pencairan === editId)?.nama_pendaftar || '')
        : (document.getElementById('pf_pendaftar').selectedOptions[0]?.dataset?.nama || '');

    if (!pendaftarId && !editId) {
        showToast('Pilih penerima terlebih dahulu', 'warning');
        return;
    }

    const pencairanEntry = {
        id_pencairan: editId || 'PCR-' + new Date().getTime(),
        id_pendaftar: editId ? (pencairanData.find(p => p.id_pencairan === editId)?.id_pendaftar || '') : pendaftarId,
        nama_pendaftar: nama,
        no_rekening: document.getElementById('pf_norek').value.trim(),
        nama_bank: document.getElementById('pf_bank').value.trim(),
        nominal: document.getElementById('pf_nominal').value,
        periode: document.getElementById('pf_periode').value,
        status_pencairan: 'proses',
        tanggal_cair: '',
        keterangan: document.getElementById('pf_keterangan').value.trim()
    };

    if (!pencairanEntry.no_rekening || !pencairanEntry.nominal || !pencairanEntry.periode) {
        showToast('Lengkapi semua field wajib', 'warning');
        return;
    }

    showLoading('Menyimpan pencairan...');
    const action = editId ? 'updatePencairan' : 'addPencairan';
    const result = await API.call(action, { pencairan: pencairanEntry });
    hideLoading();

    if (result && result.success) {
        showToast('Data pencairan berhasil disimpan', 'success');
        closeModal();
        loadPencairan();
    } else {
        showToast(result ? result.message : 'Gagal menyimpan', 'error');
    }
}

function editPencairan(index) {
    const p = pencairanData[index];

    const body = `
    <form id="pencairanForm">
      <div class="info-box info-blue">
        <i class="fas fa-user"></i>
        <div><strong>${escapeHtml(p.nama_pendaftar)}</strong></div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>No Rekening *</label>
          <input type="text" id="pf_norek" value="${escapeHtml(p.no_rekening || '')}" required>
        </div>
        <div class="form-group">
          <label>Nama Bank *</label>
          <input type="text" id="pf_bank" value="${escapeHtml(p.nama_bank || '')}" required>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Nominal Pencairan (Rp) *</label>
          <input type="number" id="pf_nominal" value="${p.nominal || ''}" min="0" required>
        </div>
        <div class="form-group">
          <label>Periode *</label>
          <select id="pf_periode" required>
            <option value="">-- Pilih Periode --</option>
            <option value="Semester 1 2024/2025" ${p.periode === 'Semester 1 2024/2025' ? 'selected' : ''}>Semester 1 2024/2025</option>
            <option value="Semester 2 2024/2025" ${p.periode === 'Semester 2 2024/2025' ? 'selected' : ''}>Semester 2 2024/2025</option>
            <option value="Semester 1 2025/2026" ${p.periode === 'Semester 1 2025/2026' ? 'selected' : ''}>Semester 1 2025/2026</option>
            <option value="Semester 2 2025/2026" ${p.periode === 'Semester 2 2025/2026' ? 'selected' : ''}>Semester 2 2025/2026</option>
          </select>
        </div>
      </div>
      
      <div class="form-group">
        <label>Status</label>
        <select id="pf_status">
          <option value="proses" ${p.status_pencairan === 'proses' ? 'selected' : ''}>Proses</option>
          <option value="cair" ${p.status_pencairan === 'cair' ? 'selected' : ''}>Cair</option>
          <option value="gagal" ${p.status_pencairan === 'gagal' ? 'selected' : ''}>Gagal</option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Keterangan</label>
        <textarea id="pf_keterangan" rows="2">${escapeHtml(p.keterangan || '')}</textarea>
      </div>
    </form>
  `;

    const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Batal</button>
    <button class="btn btn-primary" onclick="submitPencairan('${p.id_pencairan}')">
      <i class="fas fa-save"></i> Update
    </button>
  `;

    openModal('Edit Pencairan', body, footer);
}

function confirmCairkan(id) {
    const body = `
    <div style="text-align:center;padding:20px;">
      <i class="fas fa-hand-holding-usd" style="font-size:3rem;color:var(--success);margin-bottom:16px;"></i>
      <h4>Cairkan Dana?</h4>
      <p>Apakah Anda yakin ingin mencatat pencairan ini sebagai sudah cair?</p>
      <div class="form-group" style="text-align:left;margin-top:16px;">
        <label>Tanggal Pencairan</label>
        <input type="date" id="cairDate" value="${new Date().toISOString().split('T')[0]}">
      </div>
    </div>
  `;

    const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Batal</button>
    <button class="btn btn-success" onclick="doCairkan('${id}')">
      <i class="fas fa-check"></i> Ya, Cairkan
    </button>
  `;

    openModal('Konfirmasi Pencairan', body, footer);
}

async function doCairkan(id) {
    const tanggal = document.getElementById('cairDate').value;
    closeModal();
    showLoading('Memproses pencairan...');

    const result = await API.call('updatePencairanStatus', {
        id_pencairan: id,
        status: 'cair',
        tanggal_cair: tanggal
    });

    hideLoading();

    if (result && result.success) {
        showToast('Dana berhasil dicairkan', 'success');
        loadPencairan();
    } else {
        showToast(result ? result.message : 'Gagal', 'error');
    }
}

function confirmDeletePencairan(id) {
    const body = `
    <div style="text-align:center;padding:20px;">
      <i class="fas fa-exclamation-triangle" style="font-size:3rem;color:var(--danger);margin-bottom:16px;"></i>
      <h4>Hapus Data Pencairan?</h4>
      <p>Data yang dihapus tidak dapat dikembalikan.</p>
    </div>
  `;

    const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Batal</button>
    <button class="btn btn-danger" onclick="doDeletePencairan('${id}')">
      <i class="fas fa-trash"></i> Hapus
    </button>
  `;

    openModal('Konfirmasi Hapus', body, footer);
}

async function doDeletePencairan(id) {
    closeModal();
    showLoading('Menghapus...');
    const result = await API.deletePencairan(id);
    hideLoading();

    if (result && result.success) {
        showToast('Data pencairan berhasil dihapus', 'success');
        loadPencairan();
    } else {
        showToast(result ? result.message : 'Gagal menghapus', 'error');
    }
}