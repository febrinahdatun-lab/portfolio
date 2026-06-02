/**
 * CONFIG - Konfigurasi Frontend
 * PENTING: Ganti APPS_SCRIPT_URL dengan URL deployment Apps Script Anda
 */
const CONFIG = {
    // URL Web App dari Google Apps Script (ganti setelah deploy)
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycby4QUKcQO8f5pnvIoJ6Gj_7OITLFXFinmLPhxNU4TgqIl9I0-3gdPpf8gUM1TJHj_o5/exec',

    // Google OAuth Client ID (dari Google Cloud Console)
    // Ini BUKAN rahasia - Client ID memang harus di frontend untuk Google Sign-In
    GOOGLE_CLIENT_ID: '491099453450-htge0pkh59nke6dn4qptpm6voukb3dk4.apps.googleusercontent.com',

    // App info
    APP_NAME: 'Sistem Pembiayaan Beasiswa',
    APP_ORG: 'Lembaga Zakat Baitul Maal - BRI Kantor Pusat',
    APP_VERSION: '2.0.0',

    // Session config
    TOKEN_KEY: 'beasiswa_token',
    USER_KEY: 'beasiswa_user',
    SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours in ms
};