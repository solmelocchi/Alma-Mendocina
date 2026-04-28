let chatHistory = [];

function cAdd(cls, txt) {
  const m = document.getElementById('cMsgs');
  const ty = document.getElementById('cTyping');
  const el = document.createElement('div');
  el.className = 'cmsg ' + cls;
  el.style.whiteSpace = 'pre-line';
  el.textContent = txt;
  m.insertBefore(el, ty);
  m.scrollTop = 9999;
}

async function sendChat() {
  const inp = document.getElementById('cInput');
  const ty = document.getElementById('cTyping');
  const txt = inp.value.trim();
  if (!txt) return;

  cAdd('cmsg-user', txt);
  inp.value = '';
  chatHistory.push({ role: 'user', content: txt });

  ty.style.display = 'flex';
  document.getElementById('cMsgs').scrollTop = 9999;

  try {
    const res = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: chatHistory }),
    });
    if (!res.ok) throw new Error('Error del servidor');
    const data = await res.json();
    const reply = data.reply || 'No pude generar una respuesta, intentá de nuevo.';
    ty.style.display = 'none';
    cAdd('cmsg-ai', reply);
    chatHistory.push({ role: 'assistant', content: reply });
  } catch (err) {
    ty.style.display = 'none';
    cAdd('cmsg-ai', 'No me puedo conectar. Asegurate de que el backend esté corriendo.');
  }
}

document.getElementById('cInput').addEventListener('keypress', e => {
  if (e.key === 'Enter') sendChat();
});

setTimeout(() => {
  const ty = document.getElementById('cTyping');
  ty.style.display = 'flex';
  setTimeout(() => {
    ty.style.display = 'none';
    const msg = 'Hola! Soy Alma, tu guia de Mendoza 🍷 Contame que tipo de viaje tenes en mente: cuantos dias, con quien vas, que te interesa y te armo el itinerario perfecto.';
    cAdd('cmsg-ai', msg);
    chatHistory.push({ role: 'assistant', content: msg });
  }, 1200);
}, 1500);