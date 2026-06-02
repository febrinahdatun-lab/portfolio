/**
 * PENDAFTAR.JS - CRUD Pendaftar Management
 */

let pendaftarData = [];

async function loadPendaftar() {
    // Try cache first for instant render
    if (dataStore.pendaftar) {
        pendaftarData = dataStore.pendaftar;
        renderPendaftarTable();
        // Refresh in background
        API.getPendaftar().then(r => {
            if (r && r.success) {
                dataStore.pendaftar = r.data;
                pendaftarData = r.data;
                renderPendaftarTable();
            }
        });
        return;
    }

    showLoading('Memuat data pendaftar...');
    const result = await API.getPendaftar();
    hideLoading();

    if (!result || !result.success) {
        showToast('Gagal memuat data pendaftar', 'error');
        return;
    }

    pendaftarData = result.data || [];
    dataStore.pendaftar = pendaftarData;
    renderPendaftarTable();
}

function renderPendaftarTable() {
    const tbody = document.getElementById('bodyPendaftar');
    if (!tbody) return;

    if (pendaftarData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state"><i class="fas fa-users"></i><h4>Belum Ada Data Pendaftar</h4><p>Klik "Tambah Pendaftar" untuk menambahkan data baru</p></div></td></tr>';
        return;
    }

    tbody.innerHTML = pendaftarData.map((p, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${escapeHtml(p.no_registrasi)}</strong></td>
      <td>${escapeHtml(p.nama_pendaftar)}</td>
      <td>${escapeHtml(getTingkatanName(p.id_tingkatan))}</td>
      <td>${escapeHtml(getKanwilName(p.id_kanwil))}</td>
      <td>${getStatusBadge(p.status)}</td>
      <td>${formatDate(p.created_at)}</td>
      <td>
        <div class="action-btns">
          <button class="btn btn-sm btn-info" onclick="viewPendaftar(${i})" title="Detail">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-sm btn-warning" onclick="editPendaftar(${i})" title="Edit" ${currentUser.level !== 'admin' ? 'style="display:none"' : ''}>
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="confirmDeletePendaftar('${p.id_pendaftar}', '${escapeHtml(p.nama_pendaftar)}')" title="Hapus" ${currentUser.level !== 'admin' ? 'style="display:none"' : ''}>
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function buildPendaftarForm(p = {}) {
    return `
    <form id="pendaftarForm">
      <input type="hidden" id="pf_id" value="${p.id_pendaftar || ''}">
      <input type="hidden" id="pf_noreg" value="${p.no_registrasi || ''}">
      
      <!-- Data Pribadi -->
      <div class="form-section" style="border-top:none;margin-top:0;padding-top:0;">
        <h4><i class="fas fa-user"></i> Data Pribadi</h4>
        <div class="form-group">
          <label>Nama Lengkap *</label>
          <input type="text" id="pf_nama" value="${escapeHtml(p.nama_pendaftar || '')}" required>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Jenis Kelamin *</label>
            <select id="pf_jk" required>
              <option value="">-- Pilih --</option>
              <option value="Laki-laki" ${p.jns_kelamin === 'Laki-laki' ? 'selected' : ''}>Laki-laki</option>
              <option value="Perempuan" ${p.jns_kelamin === 'Perempuan' ? 'selected' : ''}>Perempuan</option>
            </select>
          </div>
          <div class="form-group">
            <label>Agama</label>
            <select id="pf_agama">
              <option value="">-- Pilih --</option>
              <option value="Islam" ${p.agama === 'Islam' ? 'selected' : ''}>Islam</option>
              <option value="Kristen" ${p.agama === 'Kristen' ? 'selected' : ''}>Kristen</option>
              <option value="Katolik" ${p.agama === 'Katolik' ? 'selected' : ''}>Katolik</option>
              <option value="Hindu" ${p.agama === 'Hindu' ? 'selected' : ''}>Hindu</option>
              <option value="Buddha" ${p.agama === 'Buddha' ? 'selected' : ''}>Buddha</option>
              <option value="Konghucu" ${p.agama === 'Konghucu' ? 'selected' : ''}>Konghucu</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Tempat Lahir</label>
            <input type="text" id="pf_tmptlahir" value="${escapeHtml(p.tempat_lahir || '')}">
          </div>
          <div class="form-group">
            <label>Tanggal Lahir *</label>
            <input type="date" id="pf_tgllahir" value="${p.tgl_lahir || ''}" required>
          </div>
        </div>
        <div class="form-group">
          <label>Alamat</label>
          <textarea id="pf_alamat" rows="2">${escapeHtml(p.alamat || '')}</textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Kelurahan</label>
            <input type="text" id="pf_kel" value="${escapeHtml(p.kelurahan || '')}">
          </div>
          <div class="form-group">
            <label>Kecamatan</label>
            <input type="text" id="pf_kec" value="${escapeHtml(p.kecamatan || '')}">
          </div>
        </div>
        <div class="form-row-3">
          <div class="form-group">
            <label>Kabupaten/Kota</label>
            <input type="text" id="pf_kab" value="${escapeHtml(p.kabupaten || '')}">
          </div>
          <div class="form-group">
            <label>Provinsi</label>
            <input type="text" id="pf_prov" value="${escapeHtml(p.provinsi || '')}">
          </div>
          <div class="form-group">
            <label>Kode Pos</label>
            <input type="text" id="pf_kodepos" value="${escapeHtml(p.kode_pos || '')}" maxlength="5">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>No. Telepon</label>
            <input type="tel" id="pf_telp" value="${escapeHtml(p.no_telp || '')}">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="pf_email" value="${escapeHtml(p.email || '')}">
          </div>
        </div>
      </div>
      
      <!-- Data Pendidikan -->
      <div class="form-section">
        <h4><i class="fas fa-school"></i> Data Pendidikan</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Nama Sekolah/PT *</label>
            <input type="text" id="pf_sekolah" value="${escapeHtml(p.nama_sekolah || '')}" required>
          </div>
          <div class="form-group">
            <label>Tingkatan *</label>
            <select id="pf_tingkatan" required>
              <option value="">-- Pilih Tingkatan --</option>
              ${tingkatanOptions(p.id_tingkatan)}
            </select>
          </div>
        </div>
        <div class="form-row-3">
          <div class="form-group">
            <label>Tingkat/Kelas</label>
            <input type="text" id="pf_kelas" value="${escapeHtml(p.kelas || '')}">
          </div>
          <div class="form-group">
            <label>Semester</label>
            <input type="text" id="pf_semester" value="${escapeHtml(p.semester || '')}">
          </div>
          <div class="form-group">
            <label>Jurusan</label>
            <input type="text" id="pf_jurusan" value="${escapeHtml(p.jurusan || '')}">
          </div>
        </div>
        <div class="form-row-3">
          <div class="form-group">
            <label>Tahun Pelajaran</label>
            <input type="text" id="pf_tahun" value="${escapeHtml(p.tahun_pelajaran || '')}" placeholder="2025/2026">
          </div>
          <div class="form-group">
            <label>Nilai Akhir/IPK *</label>
            <input type="number" id="pf_nilai" value="${p.nilai_akhir || ''}" step="0.01" min="0" max="100" required>
          </div>
          <div class="form-group">
            <label>Nama Kepsek/Dekan</label>
            <input type="text" id="pf_kepsek" value="${escapeHtml(p.nama_kepsek || '')}">
          </div>
        </div>
      </div>
      
      <!-- Data Orang Tua -->
      <div class="form-section">
        <h4><i class="fas fa-home"></i> Data Orang Tua</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Nama Ayah</label>
            <input type="text" id="pf_ayah" value="${escapeHtml(p.nama_ayah || '')}">
          </div>
          <div class="form-group">
            <label>Pekerjaan Ayah</label>
            <input type="text" id="pf_pekayah" value="${escapeHtml(p.pekerjaan_ayah || '')}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Nama Ibu</label>
            <input type="text" id="pf_ibu" value="${escapeHtml(p.nama_ibu || '')}">
          </div>
          <div class="form-group">
            <label>Pekerjaan Ibu</label>
            <input type="text" id="pf_pekibu" value="${escapeHtml(p.pekerjaan_ibu || '')}">
          </div>
        </div>
        <div class="form-row-3">
          <div class="form-group">
            <label>No. Telp Orang Tua</label>
            <input type="tel" id="pf_telportu" value="${escapeHtml(p.no_telp_ortu || '')}">
          </div>
          <div class="form-group">
            <label>Pemasukan Orang Tua (Rp) *</label>
            <input type="number" id="pf_pemasukan" value="${p.pemasukan_ortu || ''}" required min="0">
          </div>
          <div class="form-group">
            <label>Pengeluaran Orang Tua (Rp)</label>
            <input type="number" id="pf_pengeluaran" value="${p.pengeluaran_ortu || ''}" min="0">
          </div>
        </div>
        <div class="form-group">
          <label>Jumlah Tanggungan Keluarga *</label>
          <input type="number" id="pf_tanggungan" value="${p.jumlah_tanggungan || ''}" required min="1" max="20">
        </div>
      </div>
      
      <!-- Data Preferensi/Referensi -->
      <div class="form-section">
        <h4><i class="fas fa-user-tie"></i> Data Referensi (Preferensi)</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Nama Referensi</label>
            <input type="text" id="pf_prefnama" value="${escapeHtml(p.nama_preferensi || '')}">
          </div>
          <div class="form-group">
            <label>Jabatan</label>
            <input type="text" id="pf_prefjabatan" value="${escapeHtml(p.jabatan_preferensi || '')}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Nama Lembaga</label>
            <input type="text" id="pf_preflembaga" value="${escapeHtml(p.nama_lembaga_preferensi || '')}">
          </div>
          <div class="form-group">
            <label>No. Telp Referensi</label>
            <input type="tel" id="pf_preftelp" value="${escapeHtml(p.no_telp_preferensi || '')}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Alamat Referensi</label>
            <input type="text" id="pf_prefalamat" value="${escapeHtml(p.alamat_preferensi || '')}">
          </div>
          <div class="form-group">
            <label>Email Referensi</label>
            <input type="email" id="pf_prefemail" value="${escapeHtml(p.email_preferensi || '')}">
          </div>
        </div>
      </div>
      
      <!-- Data Rekening -->
      <div class="form-section">
        <h4><i class="fas fa-credit-card"></i> Data Rekening</h4>
        <div class="form-row-3">
          <div class="form-group">
            <label>Jenis Rekening</label>
            <select id="pf_jnsrek">
              <option value="">-- Pilih --</option>
              <option value="BRI" ${p.jns_rekening === 'BRI' ? 'selected' : ''}>BRI</option>
              <option value="BCA" ${p.jns_rekening === 'BCA' ? 'selected' : ''}>BCA</option>
              <option value="BNI" ${p.jns_rekening === 'BNI' ? 'selected' : ''}>BNI</option>
              <option value="Mandiri" ${p.jns_rekening === 'Mandiri' ? 'selected' : ''}>Mandiri</option>
              <option value="BSI" ${p.jns_rekening === 'BSI' ? 'selected' : ''}>BSI</option>
              <option value="Lainnya" ${p.jns_rekening === 'Lainnya' ? 'selected' : ''}>Lainnya</option>
            </select>
          </div>
          <div class="form-group">
            <label>Nama Rekening</label>
            <input type="text" id="pf_namarek" value="${escapeHtml(p.nama_rekening || '')}">
          </div>
          <div class="form-group">
            <label>Nomor Rekening</label>
            <input type="text" id="pf_norek" value="${escapeHtml(p.no_rekening || '')}">
          </div>
        </div>
      </div>
      
      <!-- Kanwil & Kelengkapan -->
      <div class="form-section">
        <h4><i class="fas fa-building"></i> Kantor Wilayah & Kelengkapan</h4>
        <div class="form-group">
          <label>Kantor Wilayah *</label>
          <select id="pf_kanwil" required>
            <option value="">-- Pilih Kanwil --</option>
            ${kanwilOptions(p.id_kanwil)}
          </select>
        </div>
        <div class="form-row-3">
          <div class="form-group">
            <label>FC Raport</label>
            <select id="pf_fcraport"><option value="belum" ${p.fc_raport !== 'ada' ? 'selected' : ''}>Belum</option><option value="ada" ${p.fc_raport === 'ada' ? 'selected' : ''}>Ada</option></select>
          </div>
          <div class="form-group">
            <label>FC KTP Orang Tua</label>
            <select id="pf_fcktp"><option value="belum" ${p.fc_ktp_ortu !== 'ada' ? 'selected' : ''}>Belum</option><option value="ada" ${p.fc_ktp_ortu === 'ada' ? 'selected' : ''}>Ada</option></select>
          </div>
          <div class="form-group">
            <label>FC Kartu Keluarga</label>
            <select id="pf_fckk"><option value="belum" ${p.fc_kk !== 'ada' ? 'selected' : ''}>Belum</option><option value="ada" ${p.fc_kk === 'ada' ? 'selected' : ''}>Ada</option></select>
          </div>
        </div>
        <div class="form-row-3">
          <div class="form-group">
            <label>Pas Foto</label>
            <select id="pf_pasfoto"><option value="belum" ${p.pas_foto !== 'ada' ? 'selected' : ''}>Belum</option><option value="ada" ${p.pas_foto === 'ada' ? 'selected' : ''}>Ada</option></select>
          </div>
          <div class="form-group">
            <label>SK Masih Aktif</label>
            <select id="pf_skaktif"><option value="belum" ${p.sk_aktif !== 'ada' ? 'selected' : ''}>Belum</option><option value="ada" ${p.sk_aktif === 'ada' ? 'selected' : ''}>Ada</option></select>
          </div>
          <div class="form-group">
            <label>SK Tidak Mampu</label>
            <select id="pf_sktm"><option value="belum" ${p.sk_tidak_mampu !== 'ada' ? 'selected' : ''}>Belum</option><option value="ada" ${p.sk_tidak_mampu === 'ada' ? 'selected' : ''}>Ada</option></select>
          </div>
        </div>
      </div>
    </form>
  `;
}

function collectPendaftarForm() {
    return {
        id_pendaftar: document.getElementById('pf_id').value,
        no_registrasi: document.getElementById('pf_noreg').value,
        nama_pendaftar: document.getElementById('pf_nama').value.trim(),
        jns_kelamin: document.getElementById('pf_jk').value,
        tempat_lahir: document.getElementById('pf_tmptlahir').value.trim(),
        tgl_lahir: document.getElementById('pf_tgllahir').value,
        alamat: document.getElementById('pf_alamat').value.trim(),
        kelurahan: document.getElementById('pf_kel').value.trim(),
        kecamatan: document.getElementById('pf_kec').value.trim(),
        kabupaten: document.getElementById('pf_kab').value.trim(),
        provinsi: document.getElementById('pf_prov').value.trim(),
        kode_pos: document.getElementById('pf_kodepos').value.trim(),
        agama: document.getElementById('pf_agama').value,
        no_telp: document.getElementById('pf_telp').value.trim(),
        email: document.getElementById('pf_email').value.trim(),
        nama_sekolah: document.getElementById('pf_sekolah').value.trim(),
        id_tingkatan: document.getElementById('pf_tingkatan').value,
        tingkat: document.getElementById('pf_tingkatan').selectedOptions[0]?.textContent?.split(' (')[0] || '',
        kelas: document.getElementById('pf_kelas').value.trim(),
        semester: document.getElementById('pf_semester').value.trim(),
        jurusan: document.getElementById('pf_jurusan').value.trim(),
        tahun_pelajaran: document.getElementById('pf_tahun').value.trim(),
        nilai_akhir: document.getElementById('pf_nilai').value,
        nama_kepsek: document.getElementById('pf_kepsek').value.trim(),
        nama_ayah: document.getElementById('pf_ayah').value.trim(),
        pekerjaan_ayah: document.getElementById('pf_pekayah').value.trim(),
        nama_ibu: document.getElementById('pf_ibu').value.trim(),
        pekerjaan_ibu: document.getElementById('pf_pekibu').value.trim(),
        no_telp_ortu: document.getElementById('pf_telportu').value.trim(),
        pemasukan_ortu: document.getElementById('pf_pemasukan').value,
        pengeluaran_ortu: document.getElementById('pf_pengeluaran').value,
        jumlah_tanggungan: document.getElementById('pf_tanggungan').value,
        nama_preferensi: document.getElementById('pf_prefnama').value.trim(),
        jabatan_preferensi: document.getElementById('pf_prefjabatan').value.trim(),
        nama_lembaga_preferensi: document.getElementById('pf_preflembaga').value.trim(),
        no_telp_preferensi: document.getElementById('pf_preftelp').value.trim(),
        alamat_preferensi: document.getElementById('pf_prefalamat').value.trim(),
        email_preferensi: document.getElementById('pf_prefemail').value.trim(),
        jns_rekening: document.getElementById('pf_jnsrek').value,
        nama_rekening: document.getElementById('pf_namarek').value.trim(),
        no_rekening: document.getElementById('pf_norek').value.trim(),
        id_kanwil: document.getElementById('pf_kanwil').value,
        fc_raport: document.getElementById('pf_fcraport').value,
        fc_ktp_ortu: document.getElementById('pf_fcktp').value,
        fc_kk: document.getElementById('pf_fckk').value,
        pas_foto: document.getElementById('pf_pasfoto').value,
        sk_aktif: document.getElementById('pf_skaktif').value,
        sk_tidak_mampu: document.getElementById('pf_sktm').value,
    };
}

function showAddPendaftar() {
    const body = buildPendaftarForm();
    const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Batal</button>
    <button class="btn btn-primary" onclick="submitPendaftar(false)">
      <i class="fas fa-save"></i> Simpan
    </button>
  `;
    openModal('Tambah Pendaftar Baru', body, footer);
}

function editPendaftar(index) {
    const p = pendaftarData[index];
    const body = buildPendaftarForm(p);
    const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Batal</button>
    <button class="btn btn-primary" onclick="submitPendaftar(true)">
      <i class="fas fa-save"></i> Update
    </button>
  `;
    openModal('Edit Pendaftar - ' + p.nama_pendaftar, body, footer);
}

async function submitPendaftar(isEdit) {
    const data = collectPendaftarForm();

    if (!data.nama_pendaftar || !data.jns_kelamin || !data.tgl_lahir || !data.nama_sekolah || !data.id_tingkatan || !data.nilai_akhir || !data.pemasukan_ortu || !data.jumlah_tanggungan || !data.id_kanwil) {
        showToast('Lengkapi semua field yang wajib (*)', 'warning');
        return;
    }

    showLoading(isEdit ? 'Memperbarui data...' : 'Menyimpan data...');
    const result = isEdit ? await API.updatePendaftar(data) : await API.addPendaftar(data);
    hideLoading();

    if (result && result.success) {
        showToast(result.message, 'success');
        closeModal();
        dataStore.pendaftar = null; // Invalidate cache
        dataStore.dashboard = null;
        loadPendaftar();
    } else {
        showToast(result ? result.message : 'Gagal menyimpan data', 'error');
    }
}

function viewPendaftar(index) {
    const p = pendaftarData[index];
    const body = `
    <div style="display:grid;gap:12px;">
      <div class="info-box info-blue">
        <i class="fas fa-id-card"></i>
        <div>
          <strong>No. Registrasi: ${escapeHtml(p.no_registrasi)}</strong><br>
          Status: ${getStatusBadge(p.status)}
          ${p.keterangan ? '<br>Keterangan: ' + escapeHtml(p.keterangan) : ''}
        </div>
      </div>
      
      <h4 style="color:var(--primary);"><i class="fas fa-user"></i> Data Pribadi</h4>
      <table class="data-table" style="font-size:0.88rem;">
        <tr><td style="width:180px;font-weight:600;">Nama Lengkap</td><td>${escapeHtml(p.nama_pendaftar)}</td></tr>
        <tr><td style="font-weight:600;">Jenis Kelamin</td><td>${escapeHtml(p.jns_kelamin)}</td></tr>
        <tr><td style="font-weight:600;">TTL</td><td>${escapeHtml(p.tempat_lahir)}, ${formatDate(p.tgl_lahir)} (Umur: ${p.umur || '-'} th)</td></tr>
        <tr><td style="font-weight:600;">Agama</td><td>${escapeHtml(p.agama)}</td></tr>
        <tr><td style="font-weight:600;">Alamat</td><td>${escapeHtml(p.alamat)} ${escapeHtml(p.kelurahan)} ${escapeHtml(p.kecamatan)} ${escapeHtml(p.kabupaten)} ${escapeHtml(p.provinsi)} ${escapeHtml(p.kode_pos)}</td></tr>
        <tr><td style="font-weight:600;">No. Telp</td><td>${escapeHtml(p.no_telp)}</td></tr>
        <tr><td style="font-weight:600;">Email</td><td>${escapeHtml(p.email)}</td></tr>
      </table>
      
      <h4 style="color:var(--primary);"><i class="fas fa-school"></i> Data Pendidikan</h4>
      <table class="data-table" style="font-size:0.88rem;">
        <tr><td style="width:180px;font-weight:600;">Nama Sekolah/PT</td><td>${escapeHtml(p.nama_sekolah)}</td></tr>
        <tr><td style="font-weight:600;">Tingkatan</td><td>${getTingkatanName(p.id_tingkatan)}</td></tr>
        <tr><td style="font-weight:600;">Kelas / Semester</td><td>${escapeHtml(p.kelas)} / ${escapeHtml(p.semester)}</td></tr>
        <tr><td style="font-weight:600;">Jurusan</td><td>${escapeHtml(p.jurusan)}</td></tr>
        <tr><td style="font-weight:600;">Nilai Akhir/IPK</td><td><strong>${p.nilai_akhir || '-'}</strong></td></tr>
      </table>
      
      <h4 style="color:var(--primary);"><i class="fas fa-home"></i> Data Orang Tua</h4>
      <table class="data-table" style="font-size:0.88rem;">
        <tr><td style="width:180px;font-weight:600;">Nama Ayah</td><td>${escapeHtml(p.nama_ayah)} (${escapeHtml(p.pekerjaan_ayah)})</td></tr>
        <tr><td style="font-weight:600;">Nama Ibu</td><td>${escapeHtml(p.nama_ibu)} (${escapeHtml(p.pekerjaan_ibu)})</td></tr>
        <tr><td style="font-weight:600;">Pemasukan</td><td>${formatCurrency(p.pemasukan_ortu)}</td></tr>
        <tr><td style="font-weight:600;">Pengeluaran</td><td>${formatCurrency(p.pengeluaran_ortu)}</td></tr>
        <tr><td style="font-weight:600;">Jumlah Tanggungan</td><td>${p.jumlah_tanggungan || '-'} orang</td></tr>
      </table>
      
      <h4 style="color:var(--primary);"><i class="fas fa-credit-card"></i> Data Rekening</h4>
      <table class="data-table" style="font-size:0.88rem;">
        <tr><td style="width:180px;font-weight:600;">Jenis Rekening</td><td>${escapeHtml(p.jns_rekening)}</td></tr>
        <tr><td style="font-weight:600;">Nama Rekening</td><td>${escapeHtml(p.nama_rekening)}</td></tr>
        <tr><td style="font-weight:600;">No. Rekening</td><td>${escapeHtml(p.no_rekening)}</td></tr>
      </table>
      
      <h4 style="color:var(--primary);"><i class="fas fa-building"></i> Info Lain</h4>
      <table class="data-table" style="font-size:0.88rem;">
        <tr><td style="width:180px;font-weight:600;">Kanwil</td><td>${getKanwilName(p.id_kanwil)}</td></tr>
        <tr><td style="font-weight:600;">Tanggal Daftar</td><td>${formatDate(p.created_at)}</td></tr>
      </table>
    </div>
  `;
    openModal('Detail Pendaftar - ' + p.nama_pendaftar, body, '<button class="btn btn-outline" onclick="closeModal()">Tutup</button>');
}

function confirmDeletePendaftar(id, nama) {
    const body = `
    <div style="text-align:center;padding:20px;">
      <i class="fas fa-exclamation-triangle" style="font-size:3rem;color:var(--danger);margin-bottom:16px;"></i>
      <h4>Hapus Data Pendaftar?</h4>
      <p style="margin:10px 0;">Anda yakin ingin menghapus data <strong>${escapeHtml(nama)}</strong>?<br>Data yang dihapus tidak dapat dikembalikan.</p>
    </div>
  `;
    const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Batal</button>
    <button class="btn btn-danger" onclick="doDeletePendaftar('${id}')">
      <i class="fas fa-trash"></i> Hapus
    </button>
  `;
    openModal('Konfirmasi Hapus', body, footer);
}

async function doDeletePendaftar(id) {
    showLoading('Menghapus data...');
    const result = await API.deletePendaftar(id);
    hideLoading();

    if (result && result.success) {
        showToast(result.message, 'success');
        closeModal();
        dataStore.pendaftar = null;
        dataStore.dashboard = null;
        loadPendaftar();
    } else {
        showToast(result ? result.message : 'Gagal menghapus data', 'error');
    }
}