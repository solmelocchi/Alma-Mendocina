// BUSQUEDA Y FILTROS - usa PLACES de data.js
let SEARCH_INDEX = null;

function normStr(s) {
  return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
}

function buildSearchIndex() {
  return Object.entries(PLACES).map(([id, p]) => {
    const hay = [p.title, p.desc, p.cat, p.categoria||'', (p.tiposViaje||[]).join(' '), (p.keywords||[]).join(' ')].join(' ');
    return {
      id, title:p.title, desc:p.desc, cat:p.cat, img:p.img,
      categoria: p.categoria||'', precioDesde: p.precioDesde||0,
      minPers: p.minPers||1, maxPers: p.maxPers||99,
      tiposViaje: p.tiposViaje||[], keywords: p.keywords||[],
      haystack: normStr(hay)
    };
  });
}
function getSearchIndex() { return SEARCH_INDEX || (SEARCH_INDEX = buildSearchIndex()); }

function applyFilters(state) {
  const idx = getSearchIndex();
  const tokens = normStr(state.q).split(/\s+/).filter(Boolean);
  return idx.filter(e => {
    if (state.tipo && !e.tiposViaje.includes(state.tipo)) return false;
    if (state.personas != null && (state.personas < e.minPers || state.personas > e.maxPers)) return false;
    if (tokens.length && !tokens.every(t => e.haystack.includes(t))) return false;
    return true;
  }).sort((a,b) => a.precioDesde - b.precioDesde);
}

function formatPrice(n) { return n >= 1000 ? Math.round(n/1000)+'K' : String(n); }

function priceLabel(n) {
  if (n === 0) return 'Entrada gratuita';
  if (n >= 100000) return 'Desde $'+formatPrice(n)+' ARS';
  return 'Desde $'+n.toLocaleString('es-AR')+' ARS';
}

function renderResults(results) {
  const grid = document.getElementById('resGrid');
  const count = document.getElementById('resCount');
  count.textContent = results.length;
  if (!results.length) {
    grid.innerHTML = '<p class="res-empty">No encontramos lugares con esos filtros. Probá con menos criterios.</p>';
    return;
  }
  grid.innerHTML = results.map(e => {
    const shortDesc = e.desc.length > 110 ? e.desc.slice(0,110)+'...' : e.desc;
    return '<div class="place-card" data-place-id="'+e.id+'"'
      + ' onmouseenter="highlightPin(\''+e.id+'\',true)"'
      + ' onmouseleave="highlightPin(\''+e.id+'\',false)"'
      + ' onclick="openPlace(\''+e.id+'\')">'
      + '<div class="pc-img" style="background-image:url('+JSON.stringify(e.img)+')">'
      +   '<div class="pc-img-ov"><div class="pc-cat">'+escHtml(e.cat)+'</div></div>'
      + '</div>'
      + '<div class="pc-body">'
      +   '<div class="pc-name">'+escHtml(e.title)+'</div>'
      +   '<p class="pc-desc">'+escHtml(shortDesc)+'</p>'
      +   '<div class="pc-footer">'
      +     '<div class="pc-price">'+priceLabel(e.precioDesde)+'</div>'
      +     '<button class="pc-btn">Ver mas</button>'
      +   '</div>'
      + '</div>'
      + '</div>';
  }).join('');
  if (typeof renderPins === 'function') renderPins(results);
}

function inferTipoFromText(q) {
  const tipos = ['despedida','familia','pareja','amigos','corporativo'];
  const n = normStr(q);
  if (n.includes('solo') || n.includes('sola')) return 'solo';
  for (const t of tipos) if (n.includes(t)) return t;
  return '';
}

function doSearch() {
  const state = {
    tipo: document.getElementById('sTipo').value,
    personas: parseInt(document.getElementById('qPersonas').textContent, 10),
    q: document.getElementById('sQue').value
  };
  if (!state.tipo && state.q) {
    const inferred = inferTipoFromText(state.q);
    if (inferred) state.tipo = inferred;
  }
  const results = applyFilters(state);
  renderResults(results);
  const sec = document.getElementById('resultados');
  sec.style.display = 'block';
  sec.scrollIntoView({behavior:'smooth', block:'start'});
}

function clearSearch() {
  document.getElementById('sQue').value = '';
  document.getElementById('sTipo').value = '';
  document.getElementById('resultados').style.display = 'none';
  window.scrollTo({top:0, behavior:'smooth'});
}
