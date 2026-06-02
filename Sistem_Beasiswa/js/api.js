/**
 * API Helper - Komunikasi dengan Google Apps Script Backend
 */
const API = {
    /**
     * Send request to Apps Script backend
     */
    async call(action, data = {}) {
        const token = sessionStorage.getItem(CONFIG.TOKEN_KEY);
        const payload = { action, token, ...data };

        try {
            const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(payload),
                redirect: 'follow'
            });

            if (!response.ok) {
                throw new Error('Network response error: ' + response.status);
            }

            const result = await response.json();

            // Handle session expired (skip for demo mode)
            if (result.message && result.message.includes('Sesi tidak valid')) {
                if (typeof isDemoMode === 'function' && isDemoMode()) {
                    return result;
                }
                showToast('Sesi telah berakhir, silakan login kembali', 'warning');
                handleLogout();
                return null;
            }

            return result;
        } catch (error) {
            console.error('API Error:', error);
            showToast('Gagal terhubung ke server. Periksa koneksi internet.', 'error');
            return null;
        }
    },

    // ---- Auth (Google OAuth) ----
    googleLogin(credential) {
        return this.call('googleLogin', { credential });
    },

    // ---- Pendaftar ----
    getPendaftar() { return this.call('getPendaftar'); },
    addPendaftar(pendaftar) { return this.call('addPendaftar', { pendaftar }); },
    updatePendaftar(pendaftar) { return this.call('updatePendaftar', { pendaftar }); },
    deletePendaftar(id) { return this.call('deletePendaftar', { id_pendaftar: id }); },

    // ---- Seleksi ----
    getSeleksi() { return this.call('getSeleksi'); },
    runSAW(pendaftarIds) { return this.call('runSAW', { pendaftarIds }); },
    updateSeleksi(id, status, keterangan) {
        return this.call('updateSeleksi', { id_pendaftar: id, status_seleksi: status, keterangan_seleksi: keterangan });
    },

    // ---- Pencairan ----
    getPencairan() { return this.call('getPencairan'); },
    addPencairan(pencairan) { return this.call('addPencairan', { pencairan }); },
    updatePencairan(pencairan) { return this.call('updatePencairan', { pencairan }); },

    // ---- Kanwil ----
    getKanwil() { return this.call('getKanwil'); },
    addKanwil(kanwil) { return this.call('addKanwil', { kanwil }); },
    updateKanwil(kanwil) { return this.call('updateKanwil', { kanwil }); },
    deleteKanwil(id) { return this.call('deleteKanwil', { id_kanwil: id }); },

    // ---- Tingkatan ----
    getTingkatan() { return this.call('getTingkatan'); },
    addTingkatan(tingkatan) { return this.call('addTingkatan', { tingkatan }); },
    updateTingkatan(tingkatan) { return this.call('updateTingkatan', { tingkatan }); },
    deleteTingkatan(id) { return this.call('deleteTingkatan', { id_tingkatan: id }); },

    // ---- Users ----
    getUsers() { return this.call('getUsers'); },
    addUser(user) { return this.call('addUser', { user }); },
    updateUser(user) { return this.call('updateUser', { user }); },
    deleteUser(id) { return this.call('deleteUser', { user_id: id }); },

    // ---- Dashboard ----
    getDashboard() { return this.call('getDashboard'); },

    // ---- Laporan ----
    getLaporan(tipe) { return this.call('getLaporan', { tipe }); },

    // ---- Kriteria ----
    getKriteria() { return this.call('getKriteria'); },
    updateKriteria(kriteria) { return this.call('updateKriteria', { kriteria }); },

    // ---- Email ----
    sendNotification(to, subject, body) {
        return this.call('sendNotification', { to, subject, body });
    }
};