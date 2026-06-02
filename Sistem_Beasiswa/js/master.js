/**
 * MASTER.JS - Data Master: Kanwil, Tingkatan, Kriteria
 * Master data management for regional offices, scholarship levels, and SAW criteria
 */

// ===================== KANWIL =====================

let kanwilList = [];

async function loadKanwil() {
    // Try cache first
    if (dataStore.kanwil) {
        kanwilList = dataStore.kanwil;
        renderKanwilTable();
        API.getKanwil().then(r => {
            if (r && r.success) { dataStore.kanwil = r.data; kanwilList = r.data; renderKanwilTable(); }
        });
        return;
    }

    showLoading('Memuat data kanwil...');
    const result = await API.getKanwil();
    hideLoading();

    if (!result || !result.success) {
        showToast('Gagal memuat data kanwil', 'error');
        return;
    }

    kanwilList = result.data || [];
    dataStore.kanwil = kanwilList;
    renderKanwilTable();
}

function renderKanwilTable() {
    const tbody = document.getElementById('bodyKanwil');
    if (!tbody) return;

    if (kanwilList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5"><div class="empty-state"><i class="fas fa-building"></i><h4>Belum Ada Data Kanwil</h4></div></td></tr>';
        return;
    }

    tbody.innerHTML = kanwilList.map((k, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${escapeHtml(k.kode_kanwil)}</strong></td>
      <td>${escapeHtml(k.nama_kanwil)}</td>
      <td>${escapeHtml(k.wilayah || '-')}</td>
      <td>
        <div class="action-btns">
          <button class="btn btn-sm btn-warning" onclick="editKanwil(${i})" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="confirmDeleteKanwil('${escapeHtml(k.kode_kanwil)}')" title="Hapus">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function showAddKanwil() {
    const body = `
    <form id="kanwilForm">
      <div class="form-group">
        <label>Kode Kanwil *</label>
        <input type="text" id="kf_kode" placeholder="Contoh: KW001" required>
      </div>
      <div class="form-group">
        <label>Nama Kanwil *</label>
        <input type="text" id="kf_nama" placeholder="Contoh: Kanwil Jakarta" required>
      </div>
      <div class="form-group">
        <label>Wilayah</label>
        <input type="text" id="kf_wilayah" placeholder="Contoh: DKI Jakarta">
      </div>
    </form>
  `;
    const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Batal</button>
    <button class="btn btn-primary" onclick="submitKanwil()">
      <i class="fas fa-save"></i> Simpan
    </button>
  `;
    openModal('Tambah Kanwil', body, footer);
}

function editKanwil(index) {
    const k = kanwilList[index];
    const body = `
    <form id="kanwilForm">
      <div class="form-group">
        <label>Kode Kanwil</label>
        <input type="text" id="kf_kode" value="${escapeHtml(k.kode_kanwil)}" readonly style="background:#f1f5f9;">
      </div>
      <div class="form-group">
        <label>Nama Kanwil *</label>
        <input type="text" id="kf_nama" value="${escapeHtml(k.nama_kanwil)}" required>
      </div>
      <div class="form-group">
        <label>Wilayah</label>
        <input type="text" id="kf_wilayah" value="${escapeHtml(k.wilayah || '')}">
      </div>
      <input type="hidden" id="kf_edit" value="1">
    </form>
  `;
    const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Batal</button>
    <button class="btn btn-primary" onclick="submitKanwil()">
      <i class="fas fa-save"></i> Update
    </button>
  `;
    openModal('Edit Kanwil', body, footer);
}

async function submitKanwil() {
    const kode = document.getElementById('kf_kode').value.trim();
    const nama = document.getElementById('kf_nama').value.trim();
    const wilayah = document.getElementById('kf_wilayah').value.trim();
    const isEdit = document.getElementById('kf_edit');

    if (!kode || !nama) {
        showToast('Kode dan Nama Kanwil wajib diisi', 'warning');
        return;
    }

    showLoading('Menyimpan...');
    const action = isEdit ? 'updateKanwil' : 'addKanwil';
    const result = await API.call(action, {
        kanwil: { kode_kanwil: kode, nama_kanwil: nama, wilayah: wilayah }
    });
    hideLoading();

    if (result && result.success) {
        showToast('Kanwil berhasil disimpan', 'success');
        closeModal();
        loadKanwil();
        loadCaches(); // Refresh global cache
    } else {
        showToast(result ? result.message : 'Gagal menyimpan', 'error');
    }
}

function confirmDeleteKanwil(kode) {
    const body = `
    <div style="text-align:center;padding:20px;">
      <i class="fas fa-exclamation-triangle" style="font-size:3rem;color:var(--danger);margin-bottom:16px;"></i>
      <h4>Hapus Kanwil "${escapeHtml(kode)}"?</h4>
      <p>Data yang dihapus tidak dapat dikembalikan.</p>
    </div>
  `;
    const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Batal</button>
    <button class="btn btn-danger" onclick="doDeleteKanwil('${escapeHtml(kode)}')">
      <i class="fas fa-trash"></i> Hapus
    </button>
  `;
    openModal('Konfirmasi Hapus', body, footer);
}

async function doDeleteKanwil(kode) {
    closeModal();
    showLoading('Menghapus...');
    const result = await API.deleteKanwil(kode);
    hideLoading();

    if (result && result.success) {
        showToast('Kanwil berhasil dihapus', 'success');
        loadKanwil();
        loadCaches();
    } else {
        showToast(result ? result.message : 'Gagal menghapus', 'error');
    }
}


// ===================== TINGKATAN =====================

let tingkatanList = [];

async function loadTingkatan() {
    if (dataStore.tingkatan) {
        tingkatanList = dataStore.tingkatan;
        renderTingkatanTable();
        API.getTingkatan().then(r => {
            if (r && r.success) { dataStore.tingkatan = r.data; tingkatanList = r.data; renderTingkatanTable(); }
        });
        return;
    }

    showLoading('Memuat data tingkatan...');
    const result = await API.getTingkatan();
    hideLoading();

    if (!result || !result.success) {
        showToast('Gagal memuat data tingkatan', 'error');
        return;
    }

    tingkatanList = result.data || [];
    dataStore.tingkatan = tingkatanList;
    renderTingkatanTable();
}

function renderTingkatanTable() {
    const tbody = document.getElementById('bodyTingkatan');
    if (!tbody) return;

    if (tingkatanList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5"><div class="empty-state"><i class="fas fa-layer-group"></i><h4>Belum Ada Data Tingkatan</h4></div></td></tr>';
        return;
    }

    tbody.innerHTML = tingkatanList.map((t, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${escapeHtml(t.kode_tingkatan)}</strong></td>
      <td>${escapeHtml(t.nama_tingkatan)}</td>
      <td><strong>${t.nominal ? formatCurrency(t.nominal) : '-'}</strong></td>
      <td>
        <div class="action-btns">
          <button class="btn btn-sm btn-warning" onclick="editTingkatan(${i})" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="confirmDeleteTingkatan('${escapeHtml(t.kode_tingkatan)}')" title="Hapus">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function showAddTingkatan() {
    const body = `
    <form id="tingkatanForm">
      <div class="form-group">
        <label>Kode Tingkatan *</label>
        <input type="text" id="tf_kode" placeholder="Contoh: TK001" required>
      </div>
      <div class="form-group">
        <label>Nama Tingkatan *</label>
        <input type="text" id="tf_nama" placeholder="Contoh: SD/MI" required>
      </div>
      <div class="form-group">
        <label>Nominal Beasiswa (Rp) *</label>
        <input type="number" id="tf_nominal" placeholder="Contoh: 1500000" min="0" required>
      </div>
    </form>
  `;
    const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Batal</button>
    <button class="btn btn-primary" onclick="submitTingkatan()">
      <i class="fas fa-save"></i> Simpan
    </button>
  `;
    openModal('Tambah Tingkatan', body, footer);
}

function editTingkatan(index) {
    const t = tingkatanList[index];
    const body = `
    <form id="tingkatanForm">
      <div class="form-group">
        <label>Kode Tingkatan</label>
        <input type="text" id="tf_kode" value="${escapeHtml(t.kode_tingkatan)}" readonly style="background:#f1f5f9;">
      </div>
      <div class="form-group">
        <label>Nama Tingkatan *</label>
        <input type="text" id="tf_nama" value="${escapeHtml(t.nama_tingkatan)}" required>
      </div>
      <div class="form-group">
        <label>Nominal Beasiswa (Rp) *</label>
        <input type="number" id="tf_nominal" value="${t.nominal || ''}" min="0" required>
      </div>
      <input type="hidden" id="tf_edit" value="1">
    </form>
  `;
    const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Batal</button>
    <button class="btn btn-primary" onclick="submitTingkatan()">
      <i class="fas fa-save"></i> Update
    </button>
  `;
    openModal('Edit Tingkatan', body, footer);
}

async function submitTingkatan() {
    const kode = document.getElementById('tf_kode').value.trim();
    const nama = document.getElementById('tf_nama').value.trim();
    const nominal = document.getElementById('tf_nominal').value;
    const isEdit = document.getElementById('tf_edit');

    if (!kode || !nama || !nominal) {
        showToast('Semua field wajib diisi', 'warning');
        return;
    }

    showLoading('Menyimpan...');
    const action = isEdit ? 'updateTingkatan' : 'addTingkatan';
    const result = await API.call(action, {
        tingkatan: { kode_tingkatan: kode, nama_tingkatan: nama, nominal: parseFloat(nominal) }
    });
    hideLoading();

    if (result && result.success) {
        showToast('Tingkatan berhasil disimpan', 'success');
        closeModal();
        loadTingkatan();
        loadCaches();
    } else {
        showToast(result ? result.message : 'Gagal menyimpan', 'error');
    }
}

function confirmDeleteTingkatan(kode) {
    const body = `
    <div style="text-align:center;padding:20px;">
      <i class="fas fa-exclamation-triangle" style="font-size:3rem;color:var(--danger);margin-bottom:16px;"></i>
      <h4>Hapus Tingkatan "${escapeHtml(kode)}"?</h4>
      <p>Data yang dihapus tidak dapat dikembalikan.</p>
    </div>
  `;
    const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Batal</button>
    <button class="btn btn-danger" onclick="doDeleteTingkatan('${escapeHtml(kode)}')">
      <i class="fas fa-trash"></i> Hapus
    </button>
  `;
    openModal('Konfirmasi Hapus', body, footer);
}

async function doDeleteTingkatan(kode) {
    closeModal();
    showLoading('Menghapus...');
    const result = await API.deleteTingkatan(kode);
    hideLoading();

    if (result && result.success) {
        showToast('Tingkatan berhasil dihapus', 'success');
        loadTingkatan();
        loadCaches();
    } else {
        showToast(result ? result.message : 'Gagal menghapus', 'error');
    }
}


// ===================== KRITERIA =====================

let kriteriaList = [];

async function loadKriteria() {
    if (dataStore.kriteria) {
        kriteriaList = dataStore.kriteria;
        renderKriteriaTable();
        API.getKriteria().then(r => {
            if (r && r.success) { dataStore.kriteria = r.data; kriteriaList = r.data; renderKriteriaTable(); }
        });
        return;
    }

    showLoading('Memuat data kriteria...');
    const result = await API.getKriteria();
    hideLoading();

    if (!result || !result.success) {
        showToast('Gagal memuat data kriteria', 'error');
        return;
    }

    kriteriaList = result.data || [];
    dataStore.kriteria = kriteriaList;
    renderKriteriaTable();
}

function renderKriteriaTable() {
    const tbody = document.getElementById('bodyKriteria');
    if (!tbody) return;

    if (kriteriaList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state"><i class="fas fa-balance-scale"></i><h4>Belum Ada Data Kriteria</h4></div></td></tr>';
        return;
    }

    const totalBobot = kriteriaList.reduce((sum, k) => sum + (parseFloat(k.bobot) || 0), 0);
    const isValid = Math.abs(totalBobot - 1.0) < 0.001;

    tbody.innerHTML = kriteriaList.map((k, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${escapeHtml(k.kode_kriteria)}</strong></td>
      <td>${escapeHtml(k.nama_kriteria)}</td>
      <td><span class="badge ${k.jenis === 'benefit' ? 'badge-success' : 'badge-warning'}">${escapeHtml(k.jenis)}</span></td>
      <td><strong>${parseFloat(k.bobot).toFixed(2)}</strong></td>
      <td>
        <div class="action-btns">
          <button class="btn btn-sm btn-warning" onclick="editKriteria(${i})" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('') + `
    <tr style="background:${isValid ? 'var(--success-light, #ecfdf5)' : '#fef2f2'};font-weight:bold;">
      <td colspan="4" style="text-align:right;">Total Bobot</td>
      <td>${totalBobot.toFixed(2)} ${isValid ? '<i class="fas fa-check-circle" style="color:var(--success);"></i>' : '<i class="fas fa-exclamation-triangle" style="color:var(--danger);"></i> Harus = 1.00'}</td>
      <td></td>
    </tr>
  `;
}

function showAddKriteria() {
    const body = `
    <form id="kriteriaForm">
      <div class="form-group">
        <label>Kode Kriteria *</label>
        <input type="text" id="krf_kode" placeholder="Contoh: C7" required>
      </div>
      <div class="form-group">
        <label>Nama Kriteria *</label>
        <input type="text" id="krf_nama" placeholder="Contoh: Prestasi Akademik" required>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Jenis Kriteria *</label>
          <select id="krf_jenis" required>
            <option value="benefit">Benefit (semakin tinggi semakin baik)</option>
            <option value="cost">Cost (semakin rendah semakin baik)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Bobot (0.01 - 1.00) *</label>
          <input type="number" id="krf_bobot" step="0.01" min="0.01" max="1.00" placeholder="0.25" required>
        </div>
      </div>
      <div class="info-box info-blue">
        <i class="fas fa-info-circle"></i>
        <div>Total bobot semua kriteria harus = <strong>1.00</strong></div>
      </div>
    </form>
  `;
    const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Batal</button>
    <button class="btn btn-primary" onclick="submitKriteria()">
      <i class="fas fa-save"></i> Simpan
    </button>
  `;
    openModal('Tambah Kriteria', body, footer);
}

function editKriteria(index) {
    const k = kriteriaList[index];
    const body = `
    <form id="kriteriaForm">
      <div class="form-group">
        <label>Kode Kriteria</label>
        <input type="text" id="krf_kode" value="${escapeHtml(k.kode_kriteria)}" readonly style="background:#f1f5f9;">
      </div>
      <div class="form-group">
        <label>Nama Kriteria *</label>
        <input type="text" id="krf_nama" value="${escapeHtml(k.nama_kriteria)}" required>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Jenis Kriteria *</label>
          <select id="krf_jenis" required>
            <option value="benefit" ${k.jenis === 'benefit' ? 'selected' : ''}>Benefit</option>
            <option value="cost" ${k.jenis === 'cost' ? 'selected' : ''}>Cost</option>
          </select>
        </div>
        <div class="form-group">
          <label>Bobot (0.01 - 1.00) *</label>
          <input type="number" id="krf_bobot" value="${k.bobot}" step="0.01" min="0.01" max="1.00" required>
        </div>
      </div>
      <input type="hidden" id="krf_edit" value="1">
    </form>
  `;
    const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Batal</button>
    <button class="btn btn-primary" onclick="submitKriteria()">
      <i class="fas fa-save"></i> Update
    </button>
  `;
    openModal('Edit Kriteria', body, footer);
}

async function submitKriteria() {
    const kode = document.getElementById('krf_kode').value.trim();
    const nama = document.getElementById('krf_nama').value.trim();
    const jenis = document.getElementById('krf_jenis').value;
    const bobot = document.getElementById('krf_bobot').value;
    const isEdit = document.getElementById('krf_edit');

    if (!kode || !nama || !bobot) {
        showToast('Semua field wajib diisi', 'warning');
        return;
    }

    showLoading('Menyimpan...');
    const action = isEdit ? 'updateKriteria' : 'addKriteria';
    const result = await API.call(action, {
        kriteria: { kode_kriteria: kode, nama_kriteria: nama, jenis: jenis, bobot: parseFloat(bobot) }
    });
    hideLoading();

    if (result && result.success) {
        showToast('Kriteria berhasil disimpan', 'success');
        closeModal();
        loadKriteria();
    } else {
        showToast(result ? result.message : 'Gagal menyimpan', 'error');
    }
}