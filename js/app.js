function openPlace(key) {
  const p = PLACES[key]; if(!p) return;
  document.getElementById('dHeroImg').src = p.img;
  document.getElementById('dHeroImg').alt = p.title;
  document.getElementById('dTitle').textContent = p.title;
  document.getElementById('dCat').textContent = p.cat;
  document.getElementById('dDesc').textContent = p.desc;
  const gal = document.getElementById('dGallery');
  gal.innerHTML = p.gallery.map(u => '<div class="d-gal-img" style="background-image:url('+JSON.stringify(u)+')"></div>').join('');
  const info = document.getElementById('dInfoGrid');
  info.innerHTML = p.info.map(([l,v]) => '<div class="d-info-item"><div class="d-info-lbl">'+l+'</div><div class="d-info-val">'+v+'</div></div>').join('');
  const prices = document.getElementById('dPrices');
  prices.innerHTML = p.prices.map(([l,v]) => '<div class="d-price-row"><span>'+l+'</span><span>'+v+'</span></div>').join('');
  document.getElementById('dWppBtn').href = 'https://wa.me/'+p.wpp+'?text='+encodeURIComponent('Hola! Me interesa info sobre '+p.title);
  document.getElementById('dMap').src = 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15000!2d'+p.lng+'!3d'+p.lat+'!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2sar!4v1';
  document.getElementById('detailPage').classList.add('open');
  document.getElementById('detailPage').scrollTop = 0;
  document.body.style.overflow = 'hidden';
}
function closeDetail() {
  document.getElementById('detailPage').classList.remove('open');
  document.body.style.overflow = '';
}
function goHome() { closeDetail(); window.scrollTo({top:0,behavior:'smooth'}); }

// TRANSLATIONS
const TR = {
  es:{hero:'Bienvenido a Mendoza', sub:'Vino, montanas y experiencias que no olvidaras', llegada:'Llegada', salida:'Salida', que:'Que queres hacer', pers:'Personas', dias:'Dias', tipo:'Tipo de viaje', sbtn:'Buscar experiencias'},
  en:{hero:'Welcome to Mendoza', sub:'Wine, mountains and unforgettable experiences', llegada:'Arrival', salida:'Departure', que:'What do you want to do', pers:'People', dias:'Days', tipo:'Trip type', sbtn:'Search experiences'},
  pt:{hero:'Bem-vindo a Mendoza', sub:'Vinho, montanhas e experiencias incriveis', llegada:'Chegada', salida:'Saida', que:'O que voce quer fazer', pers:'Pessoas', dias:'Dias', tipo:'Tipo de viagem', sbtn:'Buscar experiencias'},
};
function setLang(l, btn) {
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
  const t = TR[l];
  document.getElementById('t-hero-eyebrow').textContent = t.hero;
  document.getElementById('t-hero-sub').textContent = t.sub;
  document.getElementById('t-llegada').textContent = t.llegada;
  document.getElementById('t-salida').textContent = t.salida;
  document.getElementById('t-que').textContent = t.que;
  document.getElementById('t-pers').textContent = t.pers;
  document.getElementById('t-dias').textContent = t.dias;
  document.getElementById('t-tipo').textContent = t.tipo;
  document.getElementById('t-s-btn').textContent = t.sbtn;
  showToast(l==='en'?'Switched to English':'Idioma: '+l.toUpperCase());
}

// TIPOS
function setTipo(btn, key) {
  document.querySelectorAll('.tipo-tab').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
  document.querySelectorAll('.tipo-panel').forEach(p=>p.classList.remove('active'));
  document.getElementById('panel-'+key).classList.add('active');
}
function setTipoByKey(key) {
  const tabs = document.querySelectorAll('.tipo-tab');
  const keys = ['despedida','familia','pareja','amigos','solo','corporativo'];
  const i = keys.indexOf(key); if(i>=0) { setTipo(tabs[i],key); document.getElementById('tipos').scrollIntoView({behavior:'smooth'}); }
}
function onTipoChange() { const v=document.getElementById('sTipo').value; if(v) setTipoByKey(v); }
// doSearch() vive en js/search.js

// ALOJAMIENTOS
let alojP=2, alojTipo='todos';
function chAP(d) { alojP=Math.max(1,alojP+d); document.getElementById('alojP').textContent=alojP; filterAloj(); }
function setAF(btn,tipo) { document.querySelectorAll('.af').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); alojTipo=tipo; filterAloj(); }
function filterAloj() {
  document.querySelectorAll('.aloj-card').forEach(c => {
    const mn=parseInt(c.dataset.min),mx=parseInt(c.dataset.max),tp=c.dataset.tipo;
    c.classList.toggle('hidden', !(alojP>=mn&&alojP<=mx&&(alojTipo==='todos'||tp===alojTipo)));
  });
}

// QTY
const qtys={p:2,d:3};
function chQty(k,d){ qtys[k]=Math.max(1,qtys[k]+d); document.getElementById(k==='p'?'qPersonas':'qDias').textContent=qtys[k]; }

// FILTROS
function setFiltro(btn){ document.querySelectorAll('.filtro').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); }
function setRF(btn){ document.querySelectorAll('.rfb').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); }
// REVIEWS con persistencia
let selStar=0;
function defaultRevs(){ return [
  {n:'Martina Lopez',d:'Buenos Aires',l:'Bodega Zuccardi',s:5,t:'Una experiencia increible. El tour y la degustacion superaron todo lo que esperaba. El Malbec del Valle de Uco es otro nivel.'},
  {n:'Carlos Perez',d:'Cordoba',l:'Cerro Aconcagua',s:5,t:'El trekking de acercamiento es espectacular. Las vistas son unicas. Muy recomendable ir con guia local mendocino.'},
  {n:'Sofia Ramirez',d:'Rosario',l:'Ruta del Vino, Maipu',s:5,t:'Viaje con mis hijos y fue perfecto. Los chicos adoraron la bici y yo pude disfrutar las bodegas. Sin auto y sin complicaciones.'},
  {n:'Joao Silva',d:'Brasil',l:'Valle de Uco',s:5,t:'Vim sozinho e foi incrivel. Conheci outros viajeiros no tour compartilhado. Mendoza e perfeita para viajar solo.'}
]; }
function getRevs(){ try{const r=JSON.parse(localStorage.getItem(REV_KEY)); return r||defaultRevs();}catch(e){return defaultRevs();} }
function saveRevs(r){ localStorage.setItem(REV_KEY,JSON.stringify(r)); }
function renderRevs(){
  const grid=document.getElementById('revsGrid'); if(!grid) return;
  grid.innerHTML=getRevs().map((r,i)=>'<div class="rev-card'+(r.isNew?' new':'')+'"><div class="rv-top"><div class="rv-av">'+r.n[0].toUpperCase()+'</div><div><div class="rv-name">'+escHtml(r.n)+'</div><div class="rv-from">'+escHtml(r.d||'Mendoza')+'</div></div><div class="rv-stars">'+'&#9733;'.repeat(r.s)+'&#9734;'.repeat(5-r.s)+'</div></div><div class="rv-place">'+escHtml(r.l)+'</div><p class="rv-text">"'+escHtml(r.t)+'"</p></div>').join('');
}
function escHtml(s){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function toggleRevForm(){
  if(!currentUser()){ openModal(); showToast('Crea tu cuenta para dejar tu resena'); return; }
  const f=document.getElementById('revForm'); f.classList.toggle('open');
  if(f.classList.contains('open')){ refreshAuthUI(); setTimeout(()=>f.scrollIntoView({behavior:'smooth',block:'nearest'}),100); }
}
function setStar(n){ selStar=n; document.querySelectorAll('.s-opt').forEach((s,i)=>s.classList.toggle('on',i<n)); }
function submitRev(){
  const n=document.getElementById('rfNombre').value.trim(),d=document.getElementById('rfDe').value.trim(),l=document.getElementById('rfLugar').value.trim(),t=document.getElementById('rfText').value.trim();
  if(!n||!l||!t||!selStar){ showToast('Completa todos los campos'); return; }
  const revs=getRevs(); revs.unshift({n,d,l,s:selStar,t,ts:Date.now(),isNew:true}); saveRevs(revs); renderRevs();
  document.getElementById('revForm').classList.remove('open');
  ['rfDe','rfLugar','rfText'].forEach(id=>document.getElementById(id).value='');
  selStar=0; document.querySelectorAll('.s-opt').forEach(s=>s.classList.remove('on'));
  showToast('Resena publicada! Gracias');
  setTimeout(()=>{ const r=getRevs(); r.forEach(x=>delete x.isNew); saveRevs(r); },4000);
}
// TOAST
function showToast(m){ const t=document.getElementById('toast'); t.textContent=m; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),3500); }

// SCROLL ANIM
const obs=new IntersectionObserver(e=>e.forEach(x=>{ if(x.isIntersecting) x.target.classList.add('visible'); }),{threshold:.1});
document.querySelectorAll('.fade-in').forEach(el=>obs.observe(el));

// INIT
renderRevs();
refreshAuthUI();
