// MAPA - Leaflet + OpenStreetMap (gratis, sin API key)
let _mapInstance = null;
const _markers = [];
const _markerById = {};
const MENDOZA_CENTER = [-32.89, -68.84];

function ensureMap() {
  if (_mapInstance) return _mapInstance;
  if (typeof L === 'undefined') return null;
  _mapInstance = L.map('resMap', { zoomControl: true, scrollWheelZoom: false }).setView(MENDOZA_CENTER, 8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap'
  }).addTo(_mapInstance);
  _mapInstance.on('click', () => { /* close popups on map bg click */ });
  return _mapInstance;
}

function priceShort(n) {
  if (!n) return 'Free';
  if (n >= 1000) return '$' + Math.round(n/1000) + 'K';
  return '$' + n;
}

function clearMarkers() {
  if (!_mapInstance) return;
  _markers.forEach(m => _mapInstance.removeLayer(m));
  _markers.length = 0;
  Object.keys(_markerById).forEach(k => delete _markerById[k]);
}

function renderPins(results) {
  const map = ensureMap();
  if (!map) return;
  clearMarkers();
  const bounds = [];
  results.forEach(e => {
    const p = PLACES[e.id];
    if (!p || !p.lat || !p.lng) return;
    const lat = parseFloat(p.lat), lng = parseFloat(p.lng);
    const icon = L.divIcon({
      className: 'price-pin',
      html: '<div class="price-pin-inner" data-pin-id="'+e.id+'">'+priceShort(e.precioDesde)+'</div>',
      iconSize: [58, 28],
      iconAnchor: [29, 14]
    });
    const m = L.marker([lat, lng], { icon }).addTo(map);
    m.bindPopup(
      '<div class="pop">'
      + '<div class="pop-cat">'+escHtml(e.cat)+'</div>'
      + '<div class="pop-title">'+escHtml(e.title)+'</div>'
      + '<div class="pop-price">'+priceShort(e.precioDesde)+'</div>'
      + '<button class="pop-btn" onclick="openPlace(\''+e.id+'\')">Ver mas</button>'
      + '</div>'
    );
    m.on('mouseover', () => highlightCard(e.id, true));
    m.on('mouseout', () => highlightCard(e.id, false));
    _markers.push(m);
    _markerById[e.id] = m;
    bounds.push([lat, lng]);
  });
  if (bounds.length) {
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 });
  }
  setTimeout(() => map.invalidateSize(), 120);
}

function highlightCard(id, on) {
  const card = document.querySelector('[data-place-id="'+id+'"]');
  if (card) card.classList.toggle('card-highlight', on);
}

function highlightPin(id, on) {
  const el = document.querySelector('.price-pin-inner[data-pin-id="'+id+'"]');
  if (el) el.classList.toggle('pin-highlight', on);
  if (on && _markerById[id]) _markerById[id].openPopup();
}

function setResView(view) {
  const sec = document.getElementById('resultados');
  sec.classList.toggle('view-list', view === 'list');
  sec.classList.toggle('view-map', view === 'map');
  document.getElementById('rvtList').classList.toggle('active', view === 'list');
  document.getElementById('rvtMap').classList.toggle('active', view === 'map');
  if (view === 'map' && _mapInstance) setTimeout(() => _mapInstance.invalidateSize(), 120);
}
