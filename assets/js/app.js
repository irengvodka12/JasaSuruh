const API = 'api';

async function apiRequest(endpoint, options = {}) {
  const config = { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } };
  const response = await fetch(`${API}/${endpoint}`, config);
  const data = await response.json().catch(() => ({ success: false, message: 'Respons server tidak valid.' }));
  if (!response.ok) throw new Error(data.message || 'Terjadi kesalahan.');
  return data;
}

function setMessage(message, type = 'error') {
  const box = document.getElementById('formMessage');
  if (!box) return;
  box.textContent = message;
  box.className = `form-message ${type}`;
}

function money(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0));
}

function statusClass(status) {
  return {
    'Menunggu': 'pill-yellow', 'Diproses': 'pill-blue', 'Diambil': 'pill-blue',
    'Selesai': 'pill-green', 'Dibatalkan': 'pill-red'
  }[status] || 'pill-yellow';
}

function orderCard(order) {
  return `<article class="order-card"><div class="order-card-main"><div class="order-icon small">${order.service_type === 'Titip Belanja' ? '🛒' : order.service_type === 'Antar Barang' ? '📦' : order.service_type === 'Bantuan Rumah' ? '🧹' : '🔧'}</div><div><div class="order-code">${order.order_code}</div><h3>${escapeHtml(order.service_type)}</h3><p>${escapeHtml(order.details)}</p></div></div><div class="order-meta"><span class="pill ${statusClass(order.status)}">${escapeHtml(order.status)}</span><strong>${money(order.estimated_price)}</strong><small>${escapeHtml(order.schedule)}</small></div></article>`;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

async function requireUser() {
  try {
    const data = await apiRequest('me.php');
    return data.user;
  } catch {
    window.location.href = 'login.html';
    return null;
  }
}

async function initAuthForms() {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = new FormData(loginForm);
      try {
        const data = await apiRequest('login.php', { method: 'POST', body: JSON.stringify(Object.fromEntries(form.entries())) });
        setMessage(data.message, 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 500);
      } catch (err) { setMessage(err.message); }
    });
  }

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = new FormData(registerForm);
      try {
        const data = await apiRequest('register.php', { method: 'POST', body: JSON.stringify(Object.fromEntries(form.entries())) });
        setMessage(data.message, 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 500);
      } catch (err) { setMessage(err.message); }
    });
  }
}

async function initDashboard() {
  const welcome = document.getElementById('welcomeName');
  const list = document.getElementById('recentOrders');
  if (!welcome && !list) return;
  const user = await requireUser();
  if (!user) return;
  if (welcome) welcome.textContent = `Halo, ${user.name} 👋`;
  try {
    const data = await apiRequest('orders.php');
    const recent = data.orders.slice(0, 5);
    list.innerHTML = recent.length ? recent.map(orderCard).join('') : '<div class="empty-state">Belum ada pesanan. Yuk buat pesanan pertama!</div>';
  } catch (err) { list.innerHTML = `<div class="empty-state">${escapeHtml(err.message)}</div>`; }
}

async function initOrderForm() {
  const form = document.getElementById('orderForm');
  if (!form) return;
  await requireUser();
  const params = new URLSearchParams(window.location.search);
  const selected = params.get('type');
  const select = document.getElementById('serviceType');
  if (selected && select) select.value = selected;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const result = await apiRequest('orders.php', { method: 'POST', body: JSON.stringify(data) });
      setMessage(`${result.message} Nomor pesanan: ${result.order_code}`, 'success');
      form.reset();
      setTimeout(() => window.location.href = 'orders.html', 900);
    } catch (err) { setMessage(err.message); }
  });
}

async function initOrders() {
  const list = document.getElementById('ordersList');
  if (!list) return;
  await requireUser();
  try {
    const data = await apiRequest('orders.php');
    list.innerHTML = data.orders.length ? data.orders.map(orderCard).join('') : '<div class="empty-state">Belum ada pesanan.</div>';
  } catch (err) { list.innerHTML = `<div class="empty-state">${escapeHtml(err.message)}</div>`; }
}

function initLogout() {
  const button = document.getElementById('logoutBtn');
  if (!button) return;
  button.addEventListener('click', async () => {
    try { await apiRequest('logout.php', { method: 'POST' }); } finally { window.location.href = 'index.html'; }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initAuthForms();
  initDashboard();
  initOrderForm();
  initOrders();
  initLogout();
});
