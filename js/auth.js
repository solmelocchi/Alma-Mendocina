const SESS_KEY = 'am_session';
const API_BASE = 'http://localhost:3001';

function isEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function showErr(id, show) { const e = document.getElementById(id); if (e) e.classList.toggle('show', !!show); }
function clearErrs(ids) { ids.forEach(id => showErr(id, false)); }

function getSession() { try { return JSON.parse(localStorage.getItem(SESS_KEY)); } catch(e) { return null; } }
function setSession(token, user) { localStorage.setItem(SESS_KEY, JSON.stringify({ token, user, ts: Date.now() })); }
function clearSession() { localStorage.removeItem(SESS_KEY); }
function currentUser() { const s = getSession(); return s ? s.user : null; }

async function submitLogin() {
  const email = document.getElementById('liEmail').value.trim().toLowerCase();
  const pass = document.getElementById('liPass').value;
  clearErrs(['liEmailErr', 'liPassErr']);
  if (!isEmail(email)) { showErr('liEmailErr', true); return; }
  try {
    const res = await fetch(API_BASE + '/api/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, pass })
    });
    const data = await res.json();
    if (!res.ok) { showErr('liPassErr', true); return; }
    setSession(data.token, data.user);
    refreshAuthUI(); closeModal();
    showToast('Hola ' + data.user.name + '! Bienvenido/a de vuelta');
    document.getElementById('liEmail').value = '';
    document.getElementById('liPass').value = '';
  } catch(err) {
    showToast('No me puedo conectar. Asegurate de que el backend este corriendo.');
  }
}

async function submitReg() {
  const name = document.getElementById('upName').value.trim();
  const email = document.getElementById('upEmail').value.trim().toLowerCase();
  const pass = document.getElementById('upPass').value;
  const pass2 = document.getElementById('upPass2').value;
  const promo = document.getElementById('promoChk').checked;
  clearErrs(['upNameErr', 'upEmailErr', 'upPassErr', 'upPass2Err']);
  let ok = true;
  if (!name) { showErr('upNameErr', true); ok = false; }
  if (!isEmail(email)) { showErr('upEmailErr', true); ok = false; }
  if (pass.length < 8) { showErr('upPassErr', true); ok = false; }
  if (pass !== pass2) { showErr('upPass2Err', true); ok = false; }
  if (!ok) return;
  try {
    const res = await fetch(API_BASE + '/api/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, pass, promo })
    });
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 409) showErr('upEmailErr', true);
      else showToast(data.error || 'Error al registrarse');
      return;
    }
    setSession(data.token, data.user);
    refreshAuthUI(); closeModal();
    showToast(promo ? 'Cuenta creada! Te llegaran promos' : 'Bienvenido/a a Alma Mendocina!');
    ['upName', 'upEmail', 'upPass', 'upPass2'].forEach(id => document.getElementById(id).value = '');
  } catch(err) {
    showToast('No me puedo conectar. Asegurate de que el backend este corriendo.');
  }
}

function quickReg() {
  const email = document.getElementById('regQuickEmail').value.trim().toLowerCase();
  if (!isEmail(email)) { showToast('Ingresa un email valido'); return; }
  openModal(); switchMTabByKey('up');
  document.getElementById('upEmail').value = email;
  setTimeout(() => document.getElementById('upName').focus(), 300);
}

function logout() { clearSession(); closeDrop(); refreshAuthUI(); showToast('Sesion cerrada'); }

function togglePromo() {
  const s = getSession(); if (!s) return;
  s.user.promo = document.getElementById('dropPromo').checked;
  localStorage.setItem(SESS_KEY, JSON.stringify(s));
  showToast(s.user.promo ? 'Recibiras promos' : 'Ya no recibiras promos');
}

function toggleDrop(e) { e.stopPropagation(); document.getElementById('navDrop').classList.toggle('open'); }
function closeDrop() { document.getElementById('navDrop').classList.remove('open'); }
document.addEventListener('click', e => { if (!e.target.closest('#navUser')) closeDrop(); });
function scrollToId(id) { document.getElementById(id).scrollIntoView({ behavior: 'smooth' }); }

function refreshAuthUI() {
  const u = currentUser();
  const cta = document.getElementById('navCta'), nu = document.getElementById('navUser');
  if (u) {
    cta.style.display = 'none'; nu.style.display = 'flex';
    document.getElementById('navUserAv').textContent = u.name[0].toUpperCase();
    document.getElementById('navUserName').textContent = u.name.split(' ')[0];
    document.getElementById('dropName').textContent = u.name;
    document.getElementById('dropMail').textContent = u.email;
    document.getElementById('dropPromo').checked = !!u.promo;
    const rn = document.getElementById('rfNombre'); if (rn && !rn.value) rn.value = u.name;
  } else {
    cta.style.display = ''; nu.style.display = 'none';
  }
}

function openModal() { document.getElementById('mOverlay').classList.add('open'); }
function closeModal() { document.getElementById('mOverlay').classList.remove('open'); }
function closeMOut(e) { if (e.target.id === 'mOverlay') closeModal(); }
function switchMTab(btn, t) {
  document.querySelectorAll('.m-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('mIn').style.display = t === 'in' ? 'block' : 'none';
  document.getElementById('mUp').style.display = t === 'up' ? 'block' : 'none';
}
function switchMTabByKey(t) {
  const tabs = document.querySelectorAll('.m-tab');
  switchMTab(tabs[t === 'up' ? 1 : 0], t);
}

// MIS EXPERIENCIAS
async function saveExperiencia() {
  if (!currentUser()) {
    openModal(); switchMTabByKey('up');
    showToast('Crea una cuenta para guardar experiencias');
    return;
  }
  const key = window._currentPlaceKey;
  if (!key || typeof PLACES === 'undefined') return;
  const p = PLACES[key];
  try {
    const token = getSession().token;
    const res = await fetch(API_BASE + '/api/experiencia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ placeId: key, title: p.title, img: p.img, cat: p.cat })
    });
    if (res.ok) {
      showToast('Guardado en Mis Experiencias!');
      const btn = document.getElementById('dSaveBtn');
      if (btn) { btn.textContent = '✓ Guardada'; btn.disabled = true; }
    }
  } catch(e) {
    showToast('No me puedo conectar al backend.');
  }
}

async function openMisExp() {
  if (!currentUser()) {
    openModal(); switchMTabByKey('in');
    showToast('Inicia sesion para ver tus experiencias');
    return;
  }
  document.getElementById('misExpOverlay').classList.add('open');
  const list = document.getElementById('misExpList');
  list.innerHTML = '<p style="text-align:center;color:#999;padding:20px">Cargando...</p>';
  try {
    const token = getSession().token;
    const res = await fetch(API_BASE + '/api/experiencias', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    renderMisExp(data.experiencias || []);
  } catch(e) {
    list.innerHTML = '<p style="text-align:center;color:#999;padding:20px">No se pudo cargar. Verifica que el backend este corriendo.</p>';
  }
}

function closeMisExp() { document.getElementById('misExpOverlay').classList.remove('open'); }

function renderMisExp(list) {
  const el = document.getElementById('misExpList');
  if (!list.length) {
    el.innerHTML = '<p style="text-align:center;color:#999;padding:20px">Todavia no guardaste ninguna experiencia.<br>Explora lugares y hace clic en "Guardar experiencia".</p>';
    return;
  }
  el.innerHTML = list.map(e => `
    <div style="display:flex;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid #eee">
      <div style="width:64px;height:64px;border-radius:8px;flex-shrink:0;background:url(${JSON.stringify(e.img)}) center/cover"></div>
      <div style="flex:1">
        <div style="font-weight:600;color:#1a1a1a;font-size:15px">${escHtml(e.title)}</div>
        <div style="font-size:12px;color:#888;margin-top:3px">${escHtml(e.cat)}</div>
      </div>
      <button onclick="removeExp('${e.placeId}')" style="background:none;border:none;color:#bbb;cursor:pointer;font-size:22px;line-height:1" title="Eliminar">×</button>
    </div>
  `).join('');
}

async function removeExp(placeId) {
  const token = getSession()?.token; if (!token) return;
  try {
    await fetch(API_BASE + '/api/experiencia/' + placeId, {
      method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token }
    });
    openMisExp();
  } catch(e) {}
}