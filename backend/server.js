require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Groq = require('groq-sdk');

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const JWT_SECRET = process.env.JWT_SECRET || 'alma-mendocina-secret-change-me';
const USERS_FILE = path.join(__dirname, 'users.json');
const EXP_FILE = path.join(__dirname, 'experiencias.json');

app.use(cors());
app.use(express.json());

const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS }
});

function readUsers() {
  try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')); } catch(e) { return {}; }
}
function writeUsers(u) { fs.writeFileSync(USERS_FILE, JSON.stringify(u, null, 2)); }
function readExp() {
  try { return JSON.parse(fs.readFileSync(EXP_FILE, 'utf8')); } catch(e) { return {}; }
}
function writeExp(d) { fs.writeFileSync(EXP_FILE, JSON.stringify(d, null, 2)); }

function authUser(req) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try { return jwt.verify(token, JWT_SECRET); } catch(e) { return null; }
}

async function sendWelcomeEmail(name, email) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) return;
  try {
    await mailer.sendMail({
      from: `"Alma Mendocina" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: '¡Bienvenido/a a Alma Mendocina! 🍷',
      html: `<div style="font-family:sans-serif;max-width:500px;margin:auto">
        <h2 style="color:#8B1A1A">¡Hola ${name}!</h2>
        <p>Tu cuenta en <strong>Alma Mendocina</strong> fue creada correctamente.</p>
        <p>Ya podés planificar tu viaje a Mendoza: bodegas, aventuras, gastronomía y mucho más.</p>
        <p style="margin-top:32px">¡Buen viaje! 🍷<br><strong>El equipo de Alma Mendocina</strong></p>
      </div>`
    });
  } catch(e) { console.error('Error email:', e.message); }
}

// AUTH
app.post('/api/register', async (req, res) => {
  const { name, email, pass, promo } = req.body;
  if (!name || !email || !pass) return res.status(400).json({ error: 'Faltan campos' });
  if (pass.length < 8) return res.status(400).json({ error: 'Contrasena muy corta' });
  const users = readUsers();
  const key = email.toLowerCase();
  if (users[key]) return res.status(409).json({ error: 'Email ya registrado' });
  const hashed = await bcrypt.hash(pass, 10);
  users[key] = { name, pass: hashed, promo: !!promo, created: Date.now() };
  writeUsers(users);
  sendWelcomeEmail(name, key);
  const user = { email: key, name, promo: !!promo };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user });
});

app.post('/api/login', async (req, res) => {
  const { email, pass } = req.body;
  if (!email || !pass) return res.status(400).json({ error: 'Faltan campos' });
  const users = readUsers();
  const key = email.toLowerCase();
  const u = users[key];
  if (!u) return res.status(401).json({ error: 'Email o contrasena incorrectos' });
  const valid = await bcrypt.compare(pass, u.pass);
  if (!valid) return res.status(401).json({ error: 'Email o contrasena incorrectos' });
  const user = { email: key, name: u.name, promo: u.promo };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user });
});

// EXPERIENCIAS
app.post('/api/experiencia', (req, res) => {
  const u = authUser(req);
  if (!u) return res.status(401).json({ error: 'No autorizado' });
  const { placeId, title, img, cat } = req.body;
  const data = readExp();
  if (!data[u.email]) data[u.email] = [];
  if (!data[u.email].find(e => e.placeId === placeId)) {
    data[u.email].push({ placeId, title, img, cat, savedAt: Date.now() });
  }
  writeExp(data);
  res.json({ ok: true });
});

app.get('/api/experiencias', (req, res) => {
  const u = authUser(req);
  if (!u) return res.status(401).json({ error: 'No autorizado' });
  const data = readExp();
  res.json({ experiencias: data[u.email] || [] });
});

app.delete('/api/experiencia/:placeId', (req, res) => {
  const u = authUser(req);
  if (!u) return res.status(401).json({ error: 'No autorizado' });
  const data = readExp();
  if (data[u.email]) {
    data[u.email] = data[u.email].filter(e => e.placeId !== req.params.placeId);
  }
  writeExp(data);
  res.json({ ok: true });
});

// CHAT IA
const SYSTEM_PROMPT = `Sos Alma, una asistente experta en turismo de Mendoza, Argentina. Ayudas a los viajeros a planificar itinerarios personalizados y detallados.

Conoces perfectamente:
- Bodegas: Zuccardi (Valle de Uco), Achaval Ferrer, Catena Zapata, Norton, La Rural, Clos de los Siete
- Aventura: Rafting en Río Mendoza (Potrerillos), trekking al Aconcagua, cabalgatas, ski en Las Leñas
- Gastronomía: Casa El Enemigo, Primer Mundo, restaurantes de la Arístides, empanadas mendocinas
- Alojamientos: Cavas Wine Lodge, Finca Adalgisa, hostels del centro, cabañas en Potrerillos
- Actividades: Ruta del Vino en bici (Maipú), free walking tour, Reserva Divisadero Largo, astroturismo

Precios reales aproximados en ARS (2024):
- Cata en bodega: $8.000-$45.000 por persona
- Rafting: $25.000-$35.000 por persona
- Cabalgata: $18.000-$32.000 por persona
- Hostel: $8.000-$15.000 por noche
- Hotel boutique: $80.000-$200.000 por noche
- Restaurante medio: $20.000-$40.000 por persona
- Alquiler bici Maipú: $4.000 por día

Reglas:
- Respondé siempre en español
- Dá itinerarios concretos con actividades, lugares reales y precios aproximados
- Preguntá cuántos días, tipo de viaje y presupuesto si no te lo dicen
- Sé conversacional y entusiasta, como un mendocino que ama su provincia
- Si preguntan algo fuera de Mendoza, redirigí amablemente al tema
- Máximo 3-4 párrafos por respuesta, usá emojis con moderación`;

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'Se requiere messages' });
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages.slice(-10)],
      temperature: 0.7, max_tokens: 600,
    });
    res.json({ reply: completion.choices[0]?.message?.content || 'No pude generar una respuesta.' });
  } catch(err) {
    console.error('Error Groq:', err.message);
    res.status(500).json({ error: 'Error al conectar con la IA' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Alma backend corriendo en http://localhost:${PORT}`));
