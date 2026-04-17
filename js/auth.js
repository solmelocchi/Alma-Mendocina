// AUTH - persistencia real con localStorage
const USERS_KEY='am_users', SESS_KEY='am_session', REV_KEY='am_reviews';
function getUsers(){ try{return JSON.parse(localStorage.getItem(USERS_KEY))||{};}catch(e){return {};} }
function saveUsers(u){ localStorage.setItem(USERS_KEY,JSON.stringify(u)); }
function getSession(){ try{return JSON.parse(localStorage.getItem(SESS_KEY));}catch(e){return null;} }
function setSession(email){ localStorage.setItem(SESS_KEY,JSON.stringify({email,ts:Date.now()})); }
function clearSession(){ localStorage.removeItem(SESS_KEY); }
function currentUser(){ const s=getSession(); if(!s) return null; const u=getUsers()[s.email]; return u?{...u,email:s.email}:null; }
// hash basico (no es seguridad real pero evita guardar plain text)
function hash(s){ let h=0; for(let i=0;i<s.length;i++){ h=((h<<5)-h)+s.charCodeAt(i); h|=0; } return String(h); }
function isEmail(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

function showErr(id,show){ const e=document.getElementById(id); if(e) e.classList.toggle('show',!!show); }
function clearErrs(ids){ ids.forEach(id=>showErr(id,false)); }

function submitLogin(){
  const email=document.getElementById('liEmail').value.trim().toLowerCase();
  const pass=document.getElementById('liPass').value;
  clearErrs(['liEmailErr','liPassErr']);
  if(!isEmail(email)){ showErr('liEmailErr',true); return; }
  const users=getUsers(), u=users[email];
  if(!u||u.pass!==hash(pass)){ showErr('liPassErr',true); return; }
  setSession(email); refreshAuthUI(); closeModal(); showToast('Hola '+u.name+'! Bienvenido/a de vuelta');
  document.getElementById('liEmail').value=''; document.getElementById('liPass').value='';
}
function submitReg(){
  const name=document.getElementById('upName').value.trim();
  const email=document.getElementById('upEmail').value.trim().toLowerCase();
  const pass=document.getElementById('upPass').value;
  const pass2=document.getElementById('upPass2').value;
  const promo=document.getElementById('promoChk').checked;
  clearErrs(['upNameErr','upEmailErr','upPassErr','upPass2Err']);
  let ok=true;
  if(!name){ showErr('upNameErr',true); ok=false; }
  const users=getUsers();
  if(!isEmail(email)||users[email]){ showErr('upEmailErr',true); ok=false; }
  if(pass.length<8){ showErr('upPassErr',true); ok=false; }
  if(pass!==pass2){ showErr('upPass2Err',true); ok=false; }
  if(!ok) return;
  users[email]={name,pass:hash(pass),promo,created:Date.now()}; saveUsers(users);
  setSession(email); refreshAuthUI(); closeModal();
  showToast(promo?'Cuenta creada! Te llegaran promos':'Bienvenido/a a Alma Mendocina!');
  ['upName','upEmail','upPass','upPass2'].forEach(id=>document.getElementById(id).value='');
}
function quickReg(){
  const email=document.getElementById('regQuickEmail').value.trim().toLowerCase();
  if(!isEmail(email)){ showToast('Ingresa un email valido'); return; }
  openModal(); switchMTabByKey('up');
  document.getElementById('upEmail').value=email;
  setTimeout(()=>document.getElementById('upName').focus(),300);
}
function logout(){ clearSession(); closeDrop(); refreshAuthUI(); showToast('Sesion cerrada'); }
function togglePromo(){
  const u=currentUser(); if(!u) return;
  const users=getUsers(); users[u.email].promo=document.getElementById('dropPromo').checked; saveUsers(users);
  showToast(users[u.email].promo?'Recibiras promos':'Ya no recibiras promos');
}
function toggleDrop(e){ e.stopPropagation(); document.getElementById('navDrop').classList.toggle('open'); }
function closeDrop(){ document.getElementById('navDrop').classList.remove('open'); }
document.addEventListener('click',e=>{ if(!e.target.closest('#navUser')) closeDrop(); });
function scrollToId(id){ document.getElementById(id).scrollIntoView({behavior:'smooth'}); }

function refreshAuthUI(){
  const u=currentUser(); const cta=document.getElementById('navCta'), nu=document.getElementById('navUser');
  if(u){ cta.style.display='none'; nu.style.display='flex';
    document.getElementById('navUserAv').textContent=u.name[0].toUpperCase();
    document.getElementById('navUserName').textContent=u.name.split(' ')[0];
    document.getElementById('dropName').textContent=u.name;
    document.getElementById('dropMail').textContent=u.email;
    document.getElementById('dropPromo').checked=!!u.promo;
    // prefill review form
    const rn=document.getElementById('rfNombre'); if(rn&&!rn.value) rn.value=u.name;
  } else { cta.style.display=''; nu.style.display='none'; }
}

// MODAL
function openModal(){ document.getElementById('mOverlay').classList.add('open'); }
function closeModal(){ document.getElementById('mOverlay').classList.remove('open'); }
function closeMOut(e){ if(e.target.id==='mOverlay') closeModal(); }
function switchMTab(btn,t){ document.querySelectorAll('.m-tab').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); document.getElementById('mIn').style.display=t==='in'?'block':'none'; document.getElementById('mUp').style.display=t==='up'?'block':'none'; }
function switchMTabByKey(t){ const tabs=document.querySelectorAll('.m-tab'); switchMTab(tabs[t==='up'?1:0],t); }
