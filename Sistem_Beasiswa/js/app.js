/**
 * APP.JS - Main Application Logic
 * Authentication, Navigation, Utilities
 */

// ==================== GLOBAL STATE ====================
let currentUser = null;
let currentPage = 'dashboard';

// Cache data
let cacheKanwil = [];
let cacheTingkatan = [];

// ==================== DATA STORE (prefetch cache) ====================
const dataStore = {
    dashboard: null,
    pendaftar: null,
    seleksi: null,
    pencairan: null,
    kanwil: null,
    tingkatan: null,
    kriteria: null,
    _ready: false
};

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initNavigation();
    initGoogleSignIn();
});

function initGoogleSignIn() {
    // Wait for GIS library to load
    if (typeof google === 'undefined' || !google.accounts) {
        setTimeout(initGoogleSignIn, 200);
        return;
    }

    google.accounts.id.initialize({
        client_id: CONFIG.GOOGLE_CLIENT_ID,
        callback: handleGoogleSignIn,
        auto_select: false
    });

    var btnContainer = document.getElementById('googleSignInBtn');
    if (btnContainer) {
        google.accounts.id.renderButton(btnContainer, {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            width: 300
        });
    }
}

function checkAuth() {
    const token = sessionStorage.getItem(CONFIG.TOKEN_KEY);
    const userStr = sessionStorage.getItem(CONFIG.USER_KEY);

    if (userStr && token) {
        try {
            currentUser = JSON.parse(userStr);
            showApp();
            return;
        } catch {
            // fall through
        }
    }
    showLoginPage();
}

function showLoginPage() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
}

function showApp() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'flex';

    // Update user info
    document.getElementById('userDisplayName').textContent = currentUser.nama_lengkap || currentUser.username;
    const badge = document.getElementById('userLevelBadge');
    badge.textContent = isDemoMode() ? 'Mode Demo' : getLevelLabel(currentUser.level);
    badge.className = 'user-badge';

    // Update welcome message
    const welcomeEl = document.getElementById('welcomeMsg');
    if (welcomeEl) {
        const hour = new Date().getHours();
        const greeting = hour < 12 ? 'Selamat Pagi' : hour < 17 ? 'Selamat Siang' : 'Selamat Malam';
        welcomeEl.textContent = greeting + ', ' + (currentUser.nama_lengkap || currentUser.username) + '!';
    }

    // Apply role-based visibility
    applyRoleVisibility();

    // Load initial caches and prefetch all data
    loadCaches();
    prefetchAllData();
    navigateTo('dashboard');
}

// ==================== DATA PREFETCH ====================

async function prefetchAllData() {

    // Fire all requests in parallel
    const keys = ['dashboard', 'pendaftar', 'seleksi', 'pencairan', 'kanwil', 'tingkatan', 'kriteria'];
    const fetchers = [
        API.getDashboard(),
        API.getPendaftar(),
        API.getSeleksi(),
        API.getPencairan(),
        API.getKanwil(),
        API.getTingkatan(),
        API.getKriteria()
    ];

    const results = await Promise.allSettled(fetchers);
    results.forEach((r, i) => {
        if (r.status === 'fulfilled' && r.value && r.value.success) {
            dataStore[keys[i]] = r.value.data;
        }
    });
    dataStore._ready = true;
}

function refreshPageData(page) {
    // Invalidate cache for the page so next load fetches fresh
    dataStore[page] = null;
}

// ==================== LOGIN / LOGOUT ====================

function isDemoMode() {
    return currentUser && currentUser.isDemo === true;
}

// Keep isGuest as alias for backward compatibility
function isGuest() {
    return isDemoMode();
}

function enterAsGuest() {
    currentUser = {
        user_id: 'DEMO-001',
        username: 'demo',
        nama_lengkap: 'Mode Demo',
        level: 'admin',
        email: 'demo@beasiswa.id',
        isDemo: true
    };
    sessionStorage.setItem(CONFIG.TOKEN_KEY, 'DEMO_TOKEN');
    sessionStorage.setItem(CONFIG.USER_KEY, JSON.stringify(currentUser));
    showApp();
}

async function handleGoogleSignIn(response) {
    // Hide error, show loading
    document.getElementById('loginError').style.display = 'none';
    document.getElementById('loginLoading').style.display = 'block';

    var result = await API.googleLogin(response.credential);

    document.getElementById('loginLoading').style.display = 'none';

    if (result && result.success) {
        sessionStorage.setItem(CONFIG.TOKEN_KEY, result.data.token);
        sessionStorage.setItem(CONFIG.USER_KEY, JSON.stringify(result.data));
        currentUser = result.data;
        showToast('Selamat datang, ' + currentUser.nama_lengkap, 'success');
        showApp();
    } else {
        // Show error message without revealing which email is allowed
        var errMsg = result ? result.message : 'Gagal terhubung ke server';
        document.getElementById('loginErrorMsg').textContent = errMsg;
        document.getElementById('loginError').style.display = 'block';
    }
}

function handleLogout() {
    sessionStorage.removeItem(CONFIG.TOKEN_KEY);
    sessionStorage.removeItem(CONFIG.USER_KEY);
    currentUser = null;

    // Clear data cache
    Object.keys(dataStore).forEach(k => { if (k !== '_ready') dataStore[k] = null; });
    dataStore._ready = false;

    // Revoke Google session
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.disableAutoSelect();
    }

    showLoginPage();
}

// ==================== NAVIGATION ====================

function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            if (page) navigateTo(page);
        });
    });
}

function navigateTo(page) {
    currentPage = page;

    // Update active nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });

    // Show page
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const pageEl = document.getElementById('page-' + page);
    if (pageEl) pageEl.classList.add('active');

    // Update title
    const titles = {
        dashboard: 'Dashboard',
        pendaftar: 'Data Pendaftar',
        seleksi: 'Seleksi Beasiswa (SAW)',
        pencairan: 'Pencairan Dana Beasiswa',
        kanwil: 'Kantor Wilayah',
        tingkatan: 'Tingkatan Beasiswa',
        kriteria: 'Kriteria & Bobot SAW',
        laporan: 'Laporan',
        tentang: 'Tentang Sistem'
    };
    document.getElementById('pageTitle').textContent = titles[page] || 'Dashboard';

    // Load page data
    loadPageData(page);

    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('mobile-open');
}

function loadPageData(page) {
    switch (page) {
        case 'dashboard': loadDashboard(); break;
        case 'pendaftar': loadPendaftar(); break;
        case 'seleksi': loadSeleksi(); break;
        case 'pencairan': loadPencairan(); break;
        case 'kanwil': loadKanwil(); break;
        case 'tingkatan': loadTingkatan(); break;
        case 'kriteria': loadKriteria(); break;
        case 'laporan': loadLaporan(); break;
        case 'tentang': break; // static page, no data to load
    }
}

// ==================== ROLE VISIBILITY ====================

function applyRoleVisibility() {
    const level = currentUser ? currentUser.level : '';
    const demo = isDemoMode();

    // Show/hide demo banner
    const banner = document.getElementById('guestBanner');
    if (banner) banner.style.display = demo ? 'flex' : 'none';

    // Hide nav items based on roles — demo user has level 'admin' so all items show
    document.querySelectorAll('[data-roles]').forEach(el => {
        const roles = el.dataset.roles.split(',').map(r => r.trim());
        el.style.display = roles.includes(level) ? '' : 'none';
    });
}

function getLevelLabel(level) {
    const labels = {
        admin: 'Administrator',
        pic: 'PIC Program',
        manager: 'Manager',
        demo: 'Mode Demo'
    };
    return labels[level] || level;
}

// ==================== SIDEBAR ====================

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('mobile-open');
    } else {
        sidebar.classList.toggle('collapsed');
    }
}

// ==================== CACHE LOADERS ====================

async function loadCaches() {
    const [kanwilRes, tingkatanRes] = await Promise.all([
        API.getKanwil(),
        API.getTingkatan()
    ]);

    if (kanwilRes && kanwilRes.success) cacheKanwil = kanwilRes.data;
    if (tingkatanRes && tingkatanRes.success) cacheTingkatan = tingkatanRes.data;
}

function getKanwilName(id) {
    const kw = cacheKanwil.find(k => k.id_kanwil === id);
    return kw ? kw.nama_kanwil : id || '-';
}

function getTingkatanName(id) {
    const tk = cacheTingkatan.find(t => t.id_tingkatan === id);
    return tk ? tk.nama_tingkatan : id || '-';
}

function getTingkatanNominal(id) {
    const tk = cacheTingkatan.find(t => t.id_tingkatan === id);
    return tk ? parseInt(tk.besaran_nominal) || 0 : 0;
}

// ==================== MODAL ====================

function openModal(title, bodyHtml, footerHtml) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = bodyHtml;
    document.getElementById('modalFooter').innerHTML = footerHtml || '';
    document.getElementById('modalOverlay').classList.add('show');
    document.getElementById('modal').classList.add('show');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('show');
    document.getElementById('modal').classList.remove('show');
}

// ==================== TOAST ====================

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };

    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.innerHTML = `
    <i class="${icons[type] || icons.info}"></i>
    <span class="toast-message">${escapeHtml(message)}</span>
    <button class="toast-close" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
  `;

    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }
    }, 4000);
}

// ==================== LOADING ====================

function showLoading(text) {
    document.getElementById('loadingText').textContent = text || 'Memuat data...';
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

// ==================== UTILITIES ====================

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function formatCurrency(num) {
    if (!num) return 'Rp 0';
    return 'Rp ' + parseInt(num).toLocaleString('id-ID');
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
        return dateStr;
    }
}

function getStatusBadge(status) {
    const map = {
        aktif: '<span class="badge badge-success">Aktif</span>',
        pending: '<span class="badge badge-warning">Pending</span>',
        ditolak: '<span class="badge badge-danger">Ditolak</span>',
        nonaktif: '<span class="badge badge-secondary">Non-Aktif</span>',
        lulus: '<span class="badge badge-success">Lulus</span>',
        tidak_lulus: '<span class="badge badge-danger">Tidak Lulus</span>',
        sudah_dihitung: '<span class="badge badge-info">Sudah Dihitung</span>',
        belum_dihitung: '<span class="badge badge-secondary">Belum Dihitung</span>',
        cair: '<span class="badge badge-success">Cair</span>',
        proses: '<span class="badge badge-warning">Proses</span>',
        gagal: '<span class="badge badge-danger">Gagal</span>'
    };
    return map[status] || `<span class="badge badge-secondary">${escapeHtml(status || '-')}</span>`;
}

function filterTable(tableId, query) {
    const table = document.getElementById(tableId);
    if (!table) return;
    const rows = table.querySelectorAll('tbody tr');
    const q = query.toLowerCase();

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
    });
}

function toggleSelectAll(masterCheckbox, className) {
    document.querySelectorAll('.' + className).forEach(cb => {
        cb.checked = masterCheckbox.checked;
    });
}

function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

function exportTable(name) {
    const table = document.getElementById('table' + name.charAt(0).toUpperCase() + name.slice(1));
    if (!table) return;

    const rows = [];
    table.querySelectorAll('tr').forEach(tr => {
        const cols = [];
        tr.querySelectorAll('th, td').forEach(td => {
            let text = td.textContent.trim().replace(/"/g, '""');
            cols.push('"' + text + '"');
        });
        rows.push(cols.join(','));
    });

    const csv = '\uFEFF' + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name + '_' + new Date().toISOString().slice(0, 10) + '.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data berhasil di-export', 'success');
}

// Build select options for Kanwil
function kanwilOptions(selected) {
    return cacheKanwil
        .filter(k => k.status === 'aktif')
        .map(k => `<option value="${k.id_kanwil}" ${k.id_kanwil === selected ? 'selected' : ''}>${escapeHtml(k.nama_kanwil)}</option>`)
        .join('');
}

// Build select options for Tingkatan
function tingkatanOptions(selected) {
    return cacheTingkatan
        .filter(t => t.status === 'aktif')
        .map(t => `<option value="${t.id_tingkatan}" ${t.id_tingkatan === selected ? 'selected' : ''}>${escapeHtml(t.nama_tingkatan)} (${formatCurrency(t.besaran_nominal)})</option>`)
        .join('');
}