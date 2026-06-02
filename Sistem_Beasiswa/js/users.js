/**
 * USERS.JS - Manajemen User / Pengguna
 * User CRUD with role management
 */

let usersData = [];

async function loadUsers() {
    showLoading('Memuat data pengguna...');
    const result = await API.getUsers();
    hideLoading();

    if (!result || !result.success) {
        showToast('Gagal memuat data pengguna', 'error');
        return;
    }

    usersData = result.data || [];
    renderUsersTable();
}

function renderUsersTable() {
    const tbody = document.getElementById('bodyUsers');
    if (!tbody) return;

    if (usersData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state"><i class="fas fa-users"></i><h4>Belum Ada Data Pengguna</h4></div></td></tr>';
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    tbody.innerHTML = usersData.map((u, i) => {
        const levelBadge = u.level === 'admin'
            ? '<span class="badge badge-danger">Admin</span>'
            : u.level === 'pic'
                ? '<span class="badge badge-primary">PIC Program</span>'
                : '<span class="badge badge-warning">Manager</span>';

        const isCurrentUser = u.username === currentUser.username;

        return `
      <tr ${isCurrentUser ? 'style="background:var(--primary-light, #eff6ff);"' : ''}>
        <td>${i + 1}</td>
        <td><strong>${escapeHtml(u.username)}</strong> ${isCurrentUser ? '<span class="badge badge-info" style="font-size:10px;">Anda</span>' : ''}</td>
        <td>${escapeHtml(u.nama_lengkap || '-')}</td>
        <td>${escapeHtml(u.email || '-')}</td>
        <td>${levelBadge}</td>
        <td><span class="badge ${u.status === 'active' ? 'badge-success' : 'badge-secondary'}">${u.status === 'active' ? 'Aktif' : 'Nonaktif'}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn btn-sm btn-warning" onclick="editUser(${i})" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-info" onclick="resetPasswordUser(${i})" title="Reset Password">
              <i class="fas fa-key"></i>
            </button>
            ${!isCurrentUser ? `
            <button class="btn btn-sm btn-danger" onclick="confirmDeleteUser('${escapeHtml(u.username)}')" title="Hapus">
              <i class="fas fa-trash"></i>
            </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
    }).join('');
}

function showAddUser() {
    const body = `
    <form id="userForm">
      <div class="form-group">
        <label>Username *</label>
        <input type="text" id="uf_username" placeholder="Masukkan username" required autocomplete="off">
      </div>
      <div class="form-group">
        <label>Nama Lengkap *</label>
        <input type="text" id="uf_nama" placeholder="Masukkan nama lengkap" required>
      </div>
      <div class="form-group">
        <label>Email *</label>
        <input type="email" id="uf_email" placeholder="Masukkan email" required>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Password *</label>
          <input type="password" id="uf_password" placeholder="Min 6 karakter" required minlength="6" autocomplete="new-password">
        </div>
        <div class="form-group">
          <label>Konfirmasi Password *</label>
          <input type="password" id="uf_password2" placeholder="Ulangi password" required autocomplete="new-password">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Level Akses *</label>
          <select id="uf_level" required>
            <option value="">-- Pilih Level --</option>
            <option value="admin">Admin (Akses Penuh)</option>
            <option value="pic">PIC Program (Seleksi & Kriteria)</option>
            <option value="manager">Manager (Laporan Only)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Status *</label>
          <select id="uf_status" required>
            <option value="active" selected>Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>
      </div>
    </form>
  `;
    const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Batal</button>
    <button class="btn btn-primary" onclick="submitUser()">
      <i class="fas fa-save"></i> Simpan
    </button>
  `;
    openModal('Tambah Pengguna', body, footer);
}

function editUser(index) {
    const u = usersData[index];

    const body = `
    <form id="userForm">
      <div class="form-group">
        <label>Username</label>
        <input type="text" id="uf_username" value="${escapeHtml(u.username)}" readonly style="background:#f1f5f9;">
      </div>
      <div class="form-group">
        <label>Nama Lengkap *</label>
        <input type="text" id="uf_nama" value="${escapeHtml(u.nama_lengkap || '')}" required>
      </div>
      <div class="form-group">
        <label>Email *</label>
        <input type="email" id="uf_email" value="${escapeHtml(u.email || '')}" required>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Level Akses *</label>
          <select id="uf_level" required>
            <option value="admin" ${u.level === 'admin' ? 'selected' : ''}>Admin (Akses Penuh)</option>
            <option value="pic" ${u.level === 'pic' ? 'selected' : ''}>PIC Program (Seleksi & Kriteria)</option>
            <option value="manager" ${u.level === 'manager' ? 'selected' : ''}>Manager (Laporan Only)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Status *</label>
          <select id="uf_status" required>
            <option value="active" ${u.status === 'active' ? 'selected' : ''}>Aktif</option>
            <option value="inactive" ${u.status !== 'active' ? 'selected' : ''}>Nonaktif</option>
          </select>
        </div>
      </div>
      <input type="hidden" id="uf_edit" value="1">
    </form>
  `;
    const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Batal</button>
    <button class="btn btn-primary" onclick="submitUser()">
      <i class="fas fa-save"></i> Update
    </button>
  `;
    openModal('Edit Pengguna', body, footer);
}

async function submitUser() {
    const username = document.getElementById('uf_username').value.trim();
    const nama = document.getElementById('uf_nama').value.trim();
    const email = document.getElementById('uf_email').value.trim();
    const level = document.getElementById('uf_level').value;
    const status = document.getElementById('uf_status').value;
    const isEdit = document.getElementById('uf_edit');

    if (!username || !nama || !email || !level) {
        showToast('Lengkapi semua field wajib', 'warning');
        return;
    }

    const userData = { username, nama_lengkap: nama, email, level, status };

    if (!isEdit) {
        const password = document.getElementById('uf_password').value;
        const password2 = document.getElementById('uf_password2').value;

        if (!password || password.length < 6) {
            showToast('Password minimal 6 karakter', 'warning');
            return;
        }

        if (password !== password2) {
            showToast('Password dan konfirmasi harus sama', 'warning');
            return;
        }

        userData.password = password;
    }

    showLoading('Menyimpan...');
    const action = isEdit ? 'updateUser' : 'addUser';
    const result = await API.call(action, { user: userData });
    hideLoading();

    if (result && result.success) {
        showToast('Pengguna berhasil disimpan', 'success');
        closeModal();
        loadUsers();
    } else {
        showToast(result ? result.message : 'Gagal menyimpan', 'error');
    }
}

function resetPasswordUser(index) {
    const u = usersData[index];

    const body = `
    <form id="resetPwForm">
      <div class="info-box info-blue">
        <i class="fas fa-user"></i>
        <div>Reset password untuk: <strong>${escapeHtml(u.username)}</strong> (${escapeHtml(u.nama_lengkap || '')})</div>
      </div>
      <div class="form-group">
        <label>Password Baru *</label>
        <input type="password" id="rpf_password" placeholder="Min 6 karakter" required minlength="6" autocomplete="new-password">
      </div>
      <div class="form-group">
        <label>Konfirmasi Password Baru *</label>
        <input type="password" id="rpf_password2" placeholder="Ulangi password baru" required autocomplete="new-password">
      </div>
    </form>
  `;
    const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Batal</button>
    <button class="btn btn-warning" onclick="doResetPassword('${escapeHtml(u.username)}')">
      <i class="fas fa-key"></i> Reset Password
    </button>
  `;
    openModal('Reset Password', body, footer);
}

async function doResetPassword(username) {
    const password = document.getElementById('rpf_password').value;
    const password2 = document.getElementById('rpf_password2').value;

    if (!password || password.length < 6) {
        showToast('Password minimal 6 karakter', 'warning');
        return;
    }

    if (password !== password2) {
        showToast('Password dan konfirmasi harus sama', 'warning');
        return;
    }

    showLoading('Mereset password...');
    const result = await API.call('resetPassword', { username, new_password: password });
    hideLoading();

    if (result && result.success) {
        showToast('Password berhasil direset', 'success');
        closeModal();
    } else {
        showToast(result ? result.message : 'Gagal mereset password', 'error');
    }
}

function confirmDeleteUser(username) {
    const body = `
    <div style="text-align:center;padding:20px;">
      <i class="fas fa-exclamation-triangle" style="font-size:3rem;color:var(--danger);margin-bottom:16px;"></i>
      <h4>Hapus Pengguna "${escapeHtml(username)}"?</h4>
      <p>Data yang dihapus tidak dapat dikembalikan.<br>Pastikan pengguna ini tidak lagi diperlukan.</p>
    </div>
  `;
    const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Batal</button>
    <button class="btn btn-danger" onclick="doDeleteUser('${escapeHtml(username)}')">
      <i class="fas fa-trash"></i> Hapus
    </button>
  `;
    openModal('Konfirmasi Hapus', body, footer);
}

async function doDeleteUser(username) {
    closeModal();
    showLoading('Menghapus...');
    const result = await API.deleteUser(username);
    hideLoading();

    if (result && result.success) {
        showToast('Pengguna berhasil dihapus', 'success');
        loadUsers();
    } else {
        showToast(result ? result.message : 'Gagal menghapus', 'error');
    }
}