/**
 * DASHBOARD.JS - Dashboard Charts & Stats
 */

let chartInstances = {};

async function loadDashboard() {
    // Try cache first for instant render
    if (dataStore.dashboard) {
        renderDashboardData(dataStore.dashboard);
        // Refresh in background
        API.getDashboard().then(r => {
            if (r && r.success) {
                dataStore.dashboard = r.data;
                renderDashboardData(r.data);
            }
        });
        return;
    }

    showLoading('Memuat dashboard...');
    const result = await API.getDashboard();
    hideLoading();

    if (!result || !result.success) {
        showToast('Gagal memuat dashboard', 'error');
        return;
    }

    dataStore.dashboard = result.data;
    renderDashboardData(result.data);
}

function renderDashboardData(data) {
    // Update stat cards
    document.getElementById('statTotal').textContent = data.summary.totalPendaftar;
    document.getElementById('statAktif').textContent = data.summary.aktif;
    document.getElementById('statPending').textContent = data.summary.pending;
    document.getElementById('statDitolak').textContent = data.summary.ditolak;

    // Render charts
    renderStatusPieChart(data.statusDistribution);
    renderKanwilBarChart(data.kanwilDist);
    renderMonthlyTrendChart(data.monthlyTrend);
    renderTingkatanBarChart(data.tingkatanDist);
    renderPenyaluranTable(data.kanwilPencairan);
}

function destroyChart(id) {
    if (chartInstances[id]) {
        chartInstances[id].destroy();
        delete chartInstances[id];
    }
}

function renderStatusPieChart(statusData) {
    destroyChart('statusPie');
    const ctx = document.getElementById('chartStatusPie');
    if (!ctx) return;

    chartInstances['statusPie'] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Aktif', 'Pending', 'Ditolak', 'Non-Aktif'],
            datasets: [{
                data: [statusData.aktif || 0, statusData.pending || 0, statusData.ditolak || 0, statusData.nonaktif || 0],
                backgroundColor: ['#059669', '#d97706', '#dc2626', '#94a3b8'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 16, usePointStyle: true, pointStyleWidth: 10 }
                }
            }
        }
    });
}

function renderKanwilBarChart(kanwilData) {
    destroyChart('kanwilBar');
    const ctx = document.getElementById('chartKanwilBar');
    if (!ctx) return;

    const labels = Object.keys(kanwilData);
    const values = Object.values(kanwilData);

    chartInstances['kanwilBar'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Jumlah Pendaftar',
                data: values,
                backgroundColor: '#1a56db',
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 },
                    grid: { color: '#f1f5f9' }
                },
                x: {
                    grid: { display: false },
                    ticks: { maxRotation: 45 }
                }
            }
        }
    });
}

function renderMonthlyTrendChart(monthlyData) {
    destroyChart('monthlyTrend');
    const ctx = document.getElementById('chartMonthlyTrend');
    if (!ctx) return;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const values = Object.values(monthlyData);

    chartInstances['monthlyTrend'] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthNames,
            datasets: [{
                label: 'Pendaftar',
                data: values,
                borderColor: '#1a56db',
                backgroundColor: 'rgba(26, 86, 219, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#1a56db'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 },
                    grid: { color: '#f1f5f9' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

function renderTingkatanBarChart(tingkatanData) {
    destroyChart('tingkatanBar');
    const ctx = document.getElementById('chartTingkatanBar');
    if (!ctx) return;

    const labels = Object.keys(tingkatanData);
    const values = Object.values(tingkatanData);
    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

    chartInstances['tingkatanBar'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Jumlah Pendaftar',
                data: values,
                backgroundColor: colors.slice(0, labels.length),
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 },
                    grid: { color: '#f1f5f9' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

function renderPenyaluranTable(kanwilPencairan) {
    const tbody = document.getElementById('bodyPenyaluranDashboard');
    if (!tbody) return;

    if (!kanwilPencairan || Object.keys(kanwilPencairan).length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state"><i class="fas fa-inbox"></i><p>Belum ada data penyaluran</p></td></tr>';
        return;
    }

    let html = '';
    let no = 1;
    for (const [nama, data] of Object.entries(kanwilPencairan)) {
        const saldo = data.target - data.realisasi;
        const persen = data.target > 0 ? Math.round((data.realisasi / data.target) * 100) : 0;
        const progressClass = persen >= 80 ? 'progress-green' : persen >= 50 ? 'progress-blue' : persen >= 25 ? 'progress-yellow' : 'progress-red';

        html += `
      <tr>
        <td>${no++}</td>
        <td><strong>${escapeHtml(nama)}</strong></td>
        <td>-</td>
        <td>${data.target}</td>
        <td>${data.realisasi}</td>
        <td>${saldo}</td>
        <td>
          <div style="display:flex;align-items:center;gap:8px;">
            <div class="progress-bar ${progressClass}" style="width:80px;"><div class="progress-fill" style="width:${persen}%"></div></div>
            <span>${persen}%</span>
          </div>
        </td>
      </tr>
    `;
    }

    tbody.innerHTML = html;
}