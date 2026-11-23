(function () {
'use strict';

/* =========================================================
   1. Constantes y recursos
   ========================================================= */
const IMG = {
  "llavero": "assets/items/llavero.png",
  "botella": "assets/items/botella.png",
  "auriculares": "assets/items/auriculares.png",
  "movil": "assets/items/movil.png",
  "mancuerna": "assets/items/mancuerna.png",
  "handycam": "assets/items/handycam.png",
  "skate": "assets/items/skate.png",
  "chest": "assets/cofre.png",
  "chestOpen": "assets/cofre-abierto.png",
  "coin": "assets/moneda.png",
  "boss": "assets/jefe.png"
};

const svg = (paths, attrs = '') =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${attrs}>${paths}</svg>`;

const ICONS = {
  car: svg('<path d="M5 17h14v-5l-2-5H7l-2 5z"/><path d="M3 12h18"/><circle cx="7.5" cy="17" r="1.8"/><circle cx="16.5" cy="17" r="1.8"/>'),
  dumbbell: svg('<path d="M6 7v10M3 9.5v5M18 7v10M21 9.5v5M6 12h12"/>'),
  book: svg('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>'),
  flag: svg('<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'),
  star: svg('<path d="M12 2.5 13.8 10.2 21.5 12 13.8 13.8 12 21.5 10.2 13.8 2.5 12 10.2 10.2z"/>'),
  money: svg('<rect x="3" y="6" width="18" height="12" rx="3"/><circle cx="12" cy="12" r="2.5"/>'),
  mail: svg('<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>'),
  case: svg('<rect x="3" y="7" width="18" height="13" rx="3"/><path d="M9 7V5h6v2M3 13h18"/>'),
  code: svg('<path d="m8 7-5 5 5 5M16 7l5 5-5 5"/>'),
  heart: svg('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'),
  camera: svg('<rect x="3" y="7" width="13" height="10" rx="2"/><path d="m16 11 5-3v8l-5-3"/>'),
};
const GLYPH = {
  home: svg('<path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>', 'width="22" height="22"'),
  check: svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>', 'stroke-width="3.2"'),
  chev: svg('<path d="m6 9 6 6 6-6"/>', 'width="20" height="20" stroke-width="2.4"'),
  lock: svg('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', 'width="14" height="14"'),
  trophy: svg('<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5v1a3 3 0 0 0 3 3M16 6h3v1a3 3 0 0 1-3 3M12 13v4M8 20h8M10 17h4v3h-4z"/>'),
  share: svg('<path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6"/>'),
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',
  stop: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
  next: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  prev: svg('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
  chart: svg('<path d="M4 19h16"/><path d="m5 15 4-4 3 3 6-7"/>'),
  bag: svg('<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'),
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.5 14.2 9.8 22.5 12 14.2 14.2 12 22.5 9.8 14.2 1.5 12 9.8 9.8z"/></svg>',
};

const COLORS = ['lilac', 'orange', 'blue', 'lime', 'pink'];
const RANKS = ['Novato', 'Aprendiz', 'Explorador', 'Veterano', 'Élite', 'Maestro', 'Leyenda'];
const ITEMS = [
  { key: 'llavero', name: 'Llavero', level: 2, wearable: true },
  { key: 'botella', name: 'Botella', level: 3, wearable: true, slot: 'R' },
  { key: 'auriculares', name: 'Cascos', level: 4, wearable: true },
  { key: 'movil', name: 'Móvil', level: 5, wearable: true, slot: 'L' },
  { key: 'mancuerna', name: 'Mancuerna', level: 6, wearable: true, slot: 'R' },
  { key: 'handycam', name: 'Handycam', level: 7, wearable: true, slot: 'L' },
  { key: 'skate', name: 'Skate', level: 8, wearable: true },
  { key: 'chestOpen', name: 'Cofre de oro', level: 10, wearable: true, slot: 'P' },
];
// Objetos que se eligen: cada nivel nuevo te deja escoger 1 entre 3 de los que aún no tienes
const PICK_ITEMS = [
  { key: 'raqueta', name: 'Raqueta', wearable: true, slot: 'R' },
  { key: 'pesarusa', name: 'Pesa rusa', wearable: true, slot: 'R' },
  { key: 'cafe', name: 'Café', wearable: true, slot: 'R' },
  { key: 'libro', name: 'Libro', wearable: true, slot: 'L' },
  { key: 'microfono', name: 'Micro', wearable: true, slot: 'L' },
  { key: 'helado', name: 'Helado', wearable: true, slot: 'L' },
  { key: 'perro', name: 'Perrito', wearable: true, slot: 'P' },
  { key: 'gatito', name: 'Gatito', wearable: true, slot: 'P' },
  { key: 'balon', name: 'Balón', wearable: true, slot: 'P' },
  { key: 'toalla', name: 'Toalla', wearable: true },
];
const ALL_ITEMS = [...ITEMS, ...PICK_ITEMS];
// Iconos pixel de los objetos nuevos (16×16)
const ITEM_SPRITES = {
  raqueta: [['....kkkkkk......', '...kbbbbbbk.....', '..kbwbbwbbbk....', '..kbbbbbbbbk....', '..kbbwbbwbbk....', '..kbbbbbbbbk....', '..kbwbbwbbbk....', '...kbbbbbbk.....', '....kkbbkk......', '......kbk.......', '......kak.......', '......kak.......', '......kak.......', '......kak.......', '.......k........'], { k: '#22202a', b: '#2D5BD7', w: '#dfe8ff', a: '#555' }],
  pesarusa: [['.....kkkkk......', '....k.....k.....', '...k.......k....', '...k.......k....', '....kkkkkkk.....', '...kgggggggk....', '..kgllgggggggk..', '..kglggggggggk..', '..kgggggggggk...', '..kgggggggggk...', '..kgggggggggk...', '...kgggggggk....', '....kkkkkkk.....'], { k: '#1a1a1e', g: '#3a3a42', l: '#6a6a74' }],
  cafe: [['....kkkkkk......', '...kddddddk.....', '...kwwwwwwk.....', '...kwwwwwwk.....', '...kbbbbbbk.....', '...kbbbbbbk.....', '...kbbbbbbk.....', '...kwwwwwwk.....', '....kwwwwk......', '....kkkkkk......'], { k: '#2a1e1c', d: '#333', w: '#f2eee6', b: '#8c5a32' }],
  libro: [['..kkkkkkkkkk....', '..krrrrrrrpk....', '..krryyyrrpk....', '..krrrrrrrpk....', '..krrrrrrrpk....', '..krrrrrrrpk....', '..krrrrrrrpk....', '..krrrrrrrpk....', '..krrrrrrrpk....', '..kkkkkkkkkk....'], { k: '#2a1e1c', r: '#B8432C', y: '#E2B046', p: '#f0e8d6' }],
  microfono: [['......kkk.......', '.....kmgmk......', '.....kgmgk......', '.....kmgmk......', '......kkk.......', '......kbk.......', '......kbk.......', '......kbk.......', '......kbk.......', '......kbk.......', '.......k........'], { k: '#18181c', m: '#9a9aa2', g: '#5a5a62', b: '#222226' }],
  helado: [['.....kkkk.......', '....kppwpk......', '...kppppppk.....', '...kppppppk.....', '....kkkkkk......', '....kcCcck......', '.....kcCk.......', '.....kCck.......', '......kk........'], { k: '#2a1e1c', p: '#F08CB4', w: '#fff', c: '#DCAA64', C: '#B48246' }],
  perro: [['..k.............', '.kbk............', 'kbbbk......k....', 'kbebbk....kbk...', 'kbbbbbkkkkbk....', '.kbbbbbbbbbk....', '..kbbbbbbbbk....', '..kbkbk.kbkbk...', '..kbkbk.kbkbk...', '...k.k...k.k....'], { k: '#2a1e1c', b: '#C48C50', e: '#1e1816' }],
  gatito: [['k...k...........', 'kgkgk...........', 'kgggk......k....', 'kegegk....kgk...', 'kgpggk....kg....', '.kggggkkkkgk....', '..kggggggggk....', '..kgkgk.kgkgk...', '...k.k...k.k....'], { k: '#1e1c22', g: '#5a565c', e: '#8cdc78', p: '#F096AA' }],
  balon: [['....kkkkk.......', '...kwwbwwk......', '..kwwbbbwwk.....', '..kbwwbwwbk.....', '..kbbwwwbbk.....', '..kwwwwwwwk.....', '..kwbwwwbwk.....', '...kwbbbwk......', '....kkkkk.......'], { k: '#1e1c22', w: '#f6f4f0', b: '#26262a' }],
  toalla: [['...kkkkkkk......', '...kwwwwwk......', '...kbbbbbk......', '...kwwwwwk......', '...kwwwwwk......', '...kbbbbbk......', '...kwwwwwk......', '...kwwwwwk......', '...kbbbbbk......', '...kwwwwwk......', '...kkkkkkk......'], { k: '#2a1e1c', w: '#eeeae4', b: '#4690DC' }],
};
const spriteCache = {};
function itemImg(key) {
  if (IMG[key]) return IMG[key];
  if (spriteCache[key]) return spriteCache[key];
  const sp = ITEM_SPRITES[key]; if (!sp) return '';
  const [rows, pal] = sp, cv = document.createElement('canvas'); cv.width = 16; cv.height = 16;
  const g = cv.getContext('2d'), off = Math.floor((16 - rows.length) / 2);
  rows.forEach((row, y) => [...row].forEach((ch, x) => { if (pal[ch]) { g.fillStyle = pal[ch]; g.fillRect(x, y + off, 1, 1); } }));
  return (spriteCache[key] = cv.toDataURL());
}
const XP = { train: 5, record: 10, daily: 2 };
// Monedas: desde el 21/11/2026 se ganan más despacio (lo de antes se queda como estaba)
const COINS = { train: 2, record: 5, missionShare: 0.3 };
const COINS_OLD = { train: 3, missionShare: 0.5 }, COINS_CUTOFF = '2026-11-21', COINS_CUTOFF_MS = new Date(COINS_CUTOFF + 'T00:00').getTime();
const HABITS = [
  { key: 'agua', label: 'Bebe 2 litros de agua' },
  { key: 'dormir', label: 'Duerme 7 horas o más' },
  { key: 'estirar', label: '10 minutos de estiramientos' },
  { key: 'caminar', label: 'Sal a caminar 20 minutos' },
  { key: 'comida', label: 'Hazte una comida sana' },
  { key: 'pantalla', label: 'Sin móvil la media hora antes de dormir' },
];
const xpForLevel = L => 50 * L * (L - 1);
const EXERCISE_KINDS = {
  peso: 'Peso (kg × repes)',
  reps: 'Repes (peso opcional)',
  seg: 'Segundos',
  min: 'Minutos',
  run: 'Carrera (km + min)',
};
const STORAGE = { state: 'modo-campana', draft: 'modo-campana-draft' };
const SYNC_LABEL = {
  cloud: 'Sincronizado', saving: 'Guardando…', error: 'Sin conexión: se subirá al volver',
  signedout: 'Sin sincronizar: toca para entrar', off: 'Solo en este dispositivo', local: 'Solo en este dispositivo',
};

/* =========================================================
   2. Utilidades
   ========================================================= */
let seq = 0;
const uid = () => Date.now().toString(36) + (seq++).toString(36) + Math.random().toString(36).slice(2, 5);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = v => (v == null || v === '' ? '–' : (Math.round(v * 10) / 10).toLocaleString('es-ES'));
const num = v => parseFloat(String(v == null ? '' : v).replace(',', '.'));
const dateKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const today = () => dateKey(new Date());
const scroller = () => document.getElementById('scroll') || document.scrollingElement;
const scrollTop0 = () => { scroller().scrollTop = 0; };
/** Día en el que se está apuntando: hoy, o ayer/anteayer si se te olvidó apuntar algo. */
const logDate = () => { const d = new Date(); d.setDate(d.getDate() - (ui.logDay || 0)); return dateKey(d); };
// Se puede apuntar en cualquier día de esta semana (desde el lunes); ayer siempre, aunque hoy sea lunes
const maxBack = () => Math.max(1, (new Date().getDay() + 6) % 7);
const backDate = i => { const d = new Date(); d.setDate(d.getDate() - i); return d; };
const dayWord = i => (i === 0 ? 'hoy' : i === 1 ? 'ayer' : 'el ' + backDate(i).toLocaleDateString('es-ES', { weekday: 'long' }));
const dayChip = i => (i === 0 ? 'Hoy' : i === 1 ? 'Ayer' : backDate(i).toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '').replace(/^./, c => c.toUpperCase()) + ' ' + backDate(i).getDate());
const deDay = i => (i < 2 ? 'de ' + dayWord(i) : dayWord(i).replace(/^el /, 'del '));
const dayOptions = () => Array.from({ length: maxBack() + 1 }, (_, i) => i);
const shortDate = key => new Date(key + 'T12:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
const pct = p => Math.round(p * 100);
const colorVar = c => `var(--${c.color || 'lilac'})`;
// Color del jugador: cualquier color (hex). Los nombres antiguos se traducen.
const NAMED_COLORS = { lilac: '#C7B5FF', orange: '#FFB547', blue: '#8C9EFF', lime: '#C5E86C', pink: '#FF8AD0', red: '#E5483C' };
const colorHex = c => (NAMED_COLORS[c] || (/^#[0-9a-f]{6}$/i.test(c || '') ? c : '#C7B5FF'));
const inkFor = hex => { const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.32 ? '#111111' : '#FFFFFF'; };
const rankFor = L => RANKS[Math.min(L - 1, RANKS.length - 1)];
const storage = {
  get(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } },
  set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } },
};

/* =========================================================
   3. Datos iniciales y migraciones
   ========================================================= */
const mission = (name, xp, extra) => Object.assign({ id: uid(), name, xp, done: false }, extra);
const count = (name, xp, target) => mission(name, xp, { type: 'count', target, count: 0 });
const auto = (name, xp, rule, extra) => mission(name, xp, Object.assign({ type: 'auto', auto: rule }, extra));
const level = (name, missions) => ({ id: uid(), name, missions });
// Puntos justos: la XP de una misión la marca el esfuerzo, no lo que cada uno quiera ponerle
const EFFORT = {
  rapida: { label: '⚡ Rápida (+15)', one: 15, per: 3 },
  normal: { label: '💪 Normal (+30)', one: 30, per: 6 },
  dura: { label: '🔥 Dura (+60)', one: 60, per: 10 },
  hito: { label: '🏆 Hito (+150)', one: 150, per: 15 },
};
const COUNT_XP_MAX = 200, CAMPAIGN_XP_MAX = 1200;
/** XP según esfuerzo: de una vez, el valor fijo; si se repite, un poco por cada vez (con tope). */
const effortXP = (k, times) => { const e = EFFORT[k] || EFFORT.normal; return times > 1 ? Math.min(COUNT_XP_MAX, Math.max(e.one, Math.round(e.per * times / 5) * 5)) : e.one; };
const exercise = (name, sets, repMin, repMax, kind = 'peso', step = 2.5) => ({ id: uid(), name, sets, repMin, repMax, step, kind });

/** Ajusta una vez las campañas creadas a mano para que den lo mismo que las demás por el mismo esfuerzo. */
function fairCampaigns(s) {
  const builtIn = new Set(['carnet', 'fisico']);
  (s.campaigns || []).forEach(c => {
    if (c.fairV === 2 || builtIn.has(c.id) || c.tpl) return;
    const last = c.levels[c.levels.length - 1];
    c.levels.forEach(l => l.missions.forEach(m => {
      if (m.type === 'auto') return;
      // Repetibles: como mucho 10 XP por vez (tope ${COUNT_XP_MAX}); de una vez: el escalón de esfuerzo más cercano, y «Hito» solo en el último nivel
      if (m.type === 'count') m.xp = Math.min(m.xp, COUNT_XP_MAX, Math.max(30, Math.round(10 * (m.target || 1) / 5) * 5));
      else { const tiers = l === last ? [15, 30, 60, 150] : [15, 30, 60]; m.xp = tiers.reduce((best, t) => (Math.abs(t - m.xp) < Math.abs(best - m.xp) ? t : best), tiers[0]); }
    }));
    const total = c.levels.reduce((a, l) => a + l.missions.reduce((b, m) => b + m.xp, 0), 0);
    if (total > CAMPAIGN_XP_MAX) { const f = CAMPAIGN_XP_MAX / total; c.levels.forEach(l => l.missions.forEach(m => { m.xp = Math.max(5, Math.round(m.xp * f / 5) * 5); })); }
    c.fairV = 2;
  });
}
function defaultCampaigns() {
  return [
    { id: 'carnet', name: 'Carnet de conducir', icon: 'car', color: 'orange', sub: 'Del papeleo al examen práctico', levels: [
      level('Papeleo', [mission('Elegir autoescuela', 20), mission('Matricularme', 30), mission('Pasar el psicotécnico (reconocimiento médico)', 40), mission('Pagar la tasa de la DGT', 20)]),
      level('Teórico', [Object.assign(count('Hacer tests de práctica', 60, 20), { unit: 3 }), Object.assign(count('Hacer tests de práctica', 180, 60), { unit: 3 }), mission('5 tests seguidos con 3 fallos o menos', 50), mission('Fecha de examen teórico confirmada', 20), mission('Aprobar el teórico', 150)]),
      level('Práctico', [mission('Primera clase práctica', 30), Object.assign(count('Clases prácticas', 75, 15), { unit: 5 }), mission('Simulacro de examen sin eliminatorias', 60), mission('Fecha de examen práctico confirmada', 20)]),
      level('Jefe final', [mission('Aprobar el práctico', 250), mission('Primer viaje solo', 50)]),
    ] },
    { id: 'fisico', name: 'Físico', icon: 'dumbbell', color: 'lime', sub: 'Bajar peso y ganar músculo', tracker: 'body', levels: [
      level('Arranque', [auto('Apuntar peso inicial', 20, 'wstart'), auto('Fijar peso objetivo', 20, 'wgoal'), mission('Foto de progreso del día 1', 20), auto('Primeros entrenos', 40, 'train', { target: 3 })]),
      level('Rutina', [auto('Entrenos acumulados', 80, 'train', { target: 15 }), auto('Bajar 2 kg', 60, 'wloss', { kg: 2 }), auto('Récords personales', 60, 'prs', { target: 5 }), mission('Dormir 7h+ una semana entera', 40)]),
      level('Cambio visible', [auto('Entrenos acumulados', 120, 'train', { target: 40 }), auto('Bajar 5 kg', 100, 'wloss', { kg: 5 }), mission('Foto de progreso a los 3 meses', 30), auto('Récords personales', 100, 'prs', { target: 20 })]),
      level('Jefe final', [auto('Llegar al peso objetivo', 250, 'wreach'), auto('Entrenos acumulados', 150, 'train', { target: 100 })]),
    ] },
  ];
}
// Campañas ya montadas para elegir (además de Físico y Carnet)
const TEMPLATES = [
  { key: 'ahorro', emoji: '💰', name: 'Ahorrar', sub: 'Juntar dinero para algo que quieres', icon: 'money', color: 'lime', levels: () => [
    level('Primeros pasos', [mission('Decidir para qué ahorro y cuánto', 20), count('Apuntar todos los gastos (días)', 40, 7), mission('Separar el ahorro en una cuenta o hucha aparte', 30)]),
    level('Constancia', [count('Semanas ahorrando algo', 60, 4), mission('Quitar una suscripción que no uso', 30), mission('Llegar al 25% del objetivo', 50)]),
    level('Media partida', [mission('Llegar al 50% del objetivo', 80), count('Días sin compras por impulso', 60, 30)]),
    level('Jefe final', [mission('Llegar al objetivo', 200), mission('Darme un capricho pequeño por conseguirlo', 30)]) ] },
  { key: 'examen', emoji: '📚', name: 'Aprobar un examen', sub: 'Del temario al aprobado', icon: 'book', color: 'blue', levels: () => [
    level('Organización', [mission('Apuntar la fecha del examen', 10), mission('Reunir todos los apuntes', 20), mission('Hacer un calendario de estudio', 30)]),
    level('Estudio', [count('Sesiones de 45 minutos', 80, 20), mission('Resumen de cada tema', 50), count('Repasos de temas', 50, 10)]),
    level('Práctica', [count('Exámenes de otros años', 60, 5), mission('Explicar un tema en voz alta sin mirar', 40)]),
    level('Jefe final', [mission('Aprobar el examen', 250)]) ] },
  { key: 'leer', emoji: '📖', name: 'Leer más', sub: 'Coger el hábito de leer', icon: 'book', color: 'pink', levels: () => [
    level('Arranque', [mission('Elegir los próximos 3 libros', 20), count('Días leyendo 10 minutos', 40, 7)]),
    level('Hábito', [mission('Terminar el primer libro', 60), count('Días leyendo', 60, 20)]),
    level('Lector', [count('Libros terminados', 100, 3), mission('Leer un género que nunca leo', 40)]),
    level('Jefe final', [count('Libros terminados', 200, 10)]) ] },
  { key: 'movil', emoji: '📵', name: 'Menos móvil', sub: 'Recuperar tiempo y atención', icon: 'heart', color: 'lilac', levels: () => [
    level('Darse cuenta', [mission('Mirar mi tiempo de pantalla real', 10), mission('Quitar notificaciones que no necesito', 30), count('Noches con el móvil fuera del cuarto', 40, 3)]),
    level('Control', [count('Días sin redes sociales', 60, 3), count('Días con menos de 2 h de pantalla', 60, 7)]),
    level('Libre', [mission('Borrar la app que más tiempo me quita (una semana)', 60), count('Días con menos de 2 h de pantalla', 100, 21)]),
    level('Jefe final', [mission('Un mes con menos de 2 h al día', 200)]) ] },
  { key: 'baile', emoji: '💃', name: 'Baile', sub: 'Mejorar técnica y aprender coreos', icon: 'heart', color: 'pink', levels: () => [
    level('Base', [count('Clases o vídeos de técnica', 50, 5), count('Días estirando después de bailar', 30, 5), mission('Grabarme bailando para verme', 20)]),
    level('Coreos', [count('Coreos aprendidas enteras', 80, 3), count('Prácticas de 30 minutos', 80, 15)]),
    level('Escenario', [mission('Bailar delante de alguien', 60), mission('Probar una clase de otro estilo', 40)]),
    level('Jefe final', [mission('Crear y grabar una coreo propia', 200)]) ] },
  { key: 'correr', emoji: '🏃', name: 'Correr 5 km', sub: 'De cero a 5 km sin parar', icon: 'flag', color: 'orange', levels: () => [
    level('Arranque', [count('Salidas de correr y andar 20 min', 60, 6)]),
    level('Base', [mission('Correr 2 km sin parar', 50), mission('Correr 3 km sin parar', 70)]),
    level('Ritmo', [mission('Correr 4 km sin parar', 80), count('Salidas a correr', 80, 15)]),
    level('Jefe final', [mission('Correr 5 km sin parar', 200), mission('Apuntarme a una carrera popular', 60)]) ] },
  { key: 'idioma', emoji: '🗣️', name: 'Aprender un idioma', sub: 'Constancia y perder la vergüenza', icon: 'book', color: 'blue', levels: () => [
    level('Arranque', [mission('Elegir app, curso o profe', 20), count('Días practicando 10 minutos', 50, 7)]),
    level('Base', [count('Días practicando', 80, 30), count('Capítulos de serie en ese idioma', 40, 5)]),
    level('Conversación', [mission('Primera conversación de 5 minutos', 80), count('Conversaciones', 80, 5)]),
    level('Jefe final', [mission('Aprobar un examen de nivel o hablar 15 minutos seguidos', 250)]) ] },
  { key: 'skate', emoji: '🛹', name: 'Skate', sub: 'Trucos nuevos y clips', icon: 'star', color: 'orange', levels: () => [
    level('Base', [mission('Ollie limpio y alto', 40), mission('Shove-it', 40), count('Sesiones de skate', 50, 5)]),
    level('Trucos', [count('Intentos de kickflip', 60, 100), mission('Primer kickflip aterrizado', 80), mission('Bajar un bordillo o escalón', 50)]),
    level('Clips', [mission('Grabar una línea de 3 trucos', 60), count('Sesiones de skate', 80, 20)]),
    level('Jefe final', [mission('Editar un clip y compartirlo', 200)]) ] },
  { key: 'fumar', emoji: '🚭', name: 'Dejar de fumar', sub: 'Día a día, sin prisa pero sin pausa', icon: 'heart', color: 'lilac', levels: () => [
    level('Preparación', [mission('Elegir el día en que lo dejo', 15), mission('Contárselo a alguien de confianza', 30), mission('Tirar tabaco, mecheros y ceniceros', 30), count('Días apuntando cuándo y por qué fumo', 30, 5)]),
    level('Primera semana', [count('Días sin fumar', 60, 7), mission('Superar un momento de ganas fuertes sin fumar', 60), mission('Primer café o cerveza sin cigarro', 30)]),
    level('Primer mes', [count('Días sin fumar', 150, 30), mission('Calcular el dinero ahorrado', 15), mission('Hacer algo con el dinero ahorrado', 30), mission('Subir escaleras sin ahogarme', 30)]),
    level('Jefe final', [count('Días sin fumar', 200, 90), mission('Ser libre de humo: 3 meses sin fumar', 150)]) ] },
  { key: 'cocina', emoji: '🍳', name: 'Aprender a cocinar', sub: 'Comer mejor y sin depender de nadie', icon: 'heart', color: 'lime', levels: () => [
    level('Básicos', [count('Recetas sencillas hechas', 50, 5), mission('Hacer la compra de la semana con lista', 30)]),
    level('Variedad', [count('Días cocinando en casa', 80, 12), count('Platos nuevos', 60, 5)]),
    level('Chef', [mission('Preparar comida para toda la semana (táper)', 60), mission('Cocinar un plato de otro país', 40)]),
    level('Jefe final', [mission('Hacer una cena para amigos', 200)]) ] },
];
/** Campañas con un check de "¿lo has hecho hoy?" que suma un día a sus contadores de días. */
const DAY_CHECKS = { leer: { q: '¿Has leído hoy?', past: '¿Leíste', yes: 'Hoy has leído', match: /^Días leyendo/i, emoji: '📖' } };
const dayCheckOf = c => DAY_CHECKS[c.tpl] || (/^leer más$/i.test(c.name || '') ? DAY_CHECKS.leer : null);
const dayCheckStreak = c => { const set = new Set(c.checkDays || []); let d = set.has(today()) ? today() : addDays(today(), -1), n = 0; while (set.has(d)) { n++; d = addDays(d, -1); } return n; };
const fromTemplate = t => ({ id: uid(), tpl: t.key, name: t.name, icon: t.icon, color: t.color, sub: t.sub, levels: t.levels() });
function defaultRoutines() {
  return [
    { id: uid(), name: 'En casa', exercises: [exercise('Flexiones', 3, 8, 15, 'reps'), exercise('Sentadillas', 3, 15, 25, 'reps'), exercise('Fondos en silla', 3, 8, 15, 'reps'), exercise('Plancha', 3, 0, 0, 'seg')] },
    { id: uid(), name: 'Cardio', exercises: [exercise('Saltar a la comba', 3, 0, 0, 'min'), exercise('Correr', 1, 0, 0, 'run')] },
    { id: uid(), name: 'Gimnasio A', exercises: [exercise('Sentadilla', 3, 8, 12), exercise('Press banca', 3, 8, 12), exercise('Remo con barra', 3, 8, 12), exercise('Curl de bíceps', 2, 10, 15, 'peso', 1)] },
    { id: uid(), name: 'Gimnasio B', exercises: [exercise('Peso muerto rumano', 3, 8, 12), exercise('Press militar', 3, 8, 12), exercise('Jalón al pecho', 3, 8, 12), exercise('Extensión de tríceps', 2, 10, 15, 'peso', 1)] },
  ];
}
// Rutinas ya montadas para añadir con un toque
const ROUTINE_CATS = { casa: '🏠 En casa', gym: '🏋️ Gimnasio', cali: '🤸 Calistenia', cardio: '🏃 Cardio', movilidad: '🧘 Movilidad y baile' };
const ROUTINE_TEMPLATES = [
  { key: 'casa1', cat: 'casa', emoji: '🏠', name: 'Casa · Cuerpo entero', sub: 'Sin material, 30 minutos', ex: () => [
    exercise('Flexiones', 3, 8, 15, 'reps'), exercise('Sentadillas', 3, 15, 25, 'reps'), exercise('Zancadas', 3, 10, 16, 'reps'),
    exercise('Fondos en silla', 3, 8, 15, 'reps'), exercise('Puente de glúteo', 3, 12, 20, 'reps'), exercise('Plancha', 3, 0, 0, 'seg')] },
  { key: 'casa2', cat: 'casa', emoji: '🔥', name: 'Casa · HIIT', sub: 'Rápida y que cansa', ex: () => [
    exercise('Burpees', 4, 8, 15, 'reps'), exercise('Mountain climbers', 4, 0, 0, 'seg'), exercise('Jumping jacks', 4, 0, 0, 'seg'),
    exercise('Sentadillas con salto', 4, 10, 20, 'reps'), exercise('Plancha', 3, 0, 0, 'seg')] },
  { key: 'casa3', cat: 'casa', emoji: '🎯', name: 'Casa · Abdomen', sub: 'Core en 15 minutos', ex: () => [
    exercise('Abdominales', 3, 15, 25, 'reps'), exercise('Elevación de piernas', 3, 10, 15, 'reps'), exercise('Plancha lateral', 3, 0, 0, 'seg'),
    exercise('Hollow hold', 3, 0, 0, 'seg'), exercise('Bicicleta abdominal', 3, 20, 30, 'reps')] },
  { key: 'casa4', cat: 'casa', emoji: '🏋️', name: 'Casa · Con mancuernas', sub: 'Si tienes un par en casa', ex: () => [
    exercise('Sentadilla goblet', 3, 10, 15), exercise('Press de hombro con mancuernas', 3, 8, 12, 'peso', 1), exercise('Remo con mancuerna', 3, 8, 12, 'peso', 1),
    exercise('Peso muerto rumano con mancuernas', 3, 10, 15), exercise('Curl de bíceps', 3, 10, 15, 'peso', 1)] },
  { key: 'gym1', cat: 'gym', emoji: '🔁', name: 'Gym · Full body', sub: '3 días a la semana, para empezar', ex: () => [
    exercise('Sentadilla', 3, 8, 12), exercise('Press banca', 3, 8, 12), exercise('Jalón al pecho', 3, 8, 12),
    exercise('Peso muerto rumano', 3, 8, 12), exercise('Press militar', 3, 8, 12), exercise('Plancha', 3, 0, 0, 'seg')] },
  { key: 'gym2', cat: 'gym', emoji: '➡️', name: 'Gym · Empuje', sub: 'Pecho, hombro y tríceps', ex: () => [
    exercise('Press banca', 4, 6, 10), exercise('Press inclinado con mancuernas', 3, 8, 12, 'peso', 1), exercise('Press militar', 3, 8, 12),
    exercise('Elevaciones laterales', 3, 12, 15, 'peso', 1), exercise('Extensión de tríceps', 3, 10, 15, 'peso', 1)] },
  { key: 'gym3', cat: 'gym', emoji: '⬅️', name: 'Gym · Tirón', sub: 'Espalda y bíceps', ex: () => [
    exercise('Peso muerto', 3, 5, 8), exercise('Dominadas', 3, 5, 10, 'reps'), exercise('Remo con barra', 3, 8, 12),
    exercise('Face pull', 3, 12, 15, 'peso', 1), exercise('Curl martillo', 3, 10, 12, 'peso', 1)] },
  { key: 'gym4', cat: 'gym', emoji: '🦵', name: 'Gym · Pierna', sub: 'Cuádriceps, glúteo y femoral', ex: () => [
    exercise('Sentadilla', 4, 6, 10), exercise('Prensa de piernas', 3, 10, 15, 'peso', 5), exercise('Hip thrust', 3, 8, 12),
    exercise('Curl femoral', 3, 10, 15), exercise('Elevación de gemelos', 4, 12, 20)] },
  { key: 'gym5', cat: 'gym', emoji: '💥', name: 'Gym · Torso', sub: 'Para hacer torso / pierna 4 días', ex: () => [
    exercise('Press banca', 4, 6, 10), exercise('Remo con barra', 4, 6, 10), exercise('Press militar', 3, 8, 12),
    exercise('Jalón al pecho', 3, 8, 12), exercise('Curl de bíceps', 2, 10, 15, 'peso', 1), exercise('Extensión de tríceps', 2, 10, 15, 'peso', 1)] },
  { key: 'cali1', cat: 'cali', emoji: '🤸', name: 'Calistenia · Base', sub: 'Para empezar o volver a coger el ritmo', ex: () => [
    exercise('Flexiones', 3, 8, 15, 'reps'), exercise('Dominadas australianas', 3, 6, 12, 'reps'), exercise('Fondos en banco', 3, 8, 15, 'reps'),
    exercise('Sentadillas', 3, 15, 25, 'reps'), exercise('Plancha', 3, 0, 0, 'seg'), exercise('Hollow hold', 3, 0, 0, 'seg')] },
  { key: 'cali2', cat: 'cali', emoji: '💪', name: 'Calistenia · Empuje', sub: 'Pecho, hombro y tríceps', ex: () => [
    exercise('Fondos en paralelas', 4, 6, 12, 'reps'), exercise('Flexiones diamante', 3, 8, 15, 'reps'), exercise('Pike push-ups', 3, 6, 12, 'reps'),
    exercise('Flexiones arqueras', 3, 4, 8, 'reps'), exercise('Pino contra la pared', 3, 0, 0, 'seg')] },
  { key: 'cali3', cat: 'cali', emoji: '🧗', name: 'Calistenia · Tirón', sub: 'Espalda y bíceps', ex: () => [
    exercise('Dominadas', 4, 4, 10, 'reps'), exercise('Chin-ups', 3, 5, 10, 'reps'), exercise('Remo invertido', 3, 8, 15, 'reps'),
    exercise('Elevación de piernas colgado', 3, 6, 12, 'reps'), exercise('Colgarse de la barra', 3, 0, 0, 'seg')] },
  { key: 'cali4', cat: 'cali', emoji: '🦵', name: 'Calistenia · Piernas y core', sub: 'Sin máquinas', ex: () => [
    exercise('Sentadilla búlgara', 3, 8, 12, 'reps'), exercise('Pistol squat asistida', 3, 4, 8, 'reps'), exercise('Zancadas con salto', 3, 8, 12, 'reps'),
    exercise('Puente de glúteo a una pierna', 3, 8, 15, 'reps'), exercise('L-sit', 3, 0, 0, 'seg'), exercise('Dragon flag negativas', 3, 3, 6, 'reps')] },
  { key: 'cali5', cat: 'cali', emoji: '⭐', name: 'Calistenia · Skills', sub: 'Trucos: muscle-up, front lever, pino…', ex: () => [
    exercise('Muscle-up negativas', 3, 3, 6, 'reps'), exercise('Front lever tuck', 4, 0, 0, 'seg'), exercise('Back lever tuck', 3, 0, 0, 'seg'),
    exercise('Pino libre (intentos)', 5, 0, 0, 'seg'), exercise('Planche lean', 3, 0, 0, 'seg')] },
  { key: 'cardio1', cat: 'cardio', emoji: '🏃', name: 'Cardio · Correr', sub: 'Una salida: apuntas distancia y tiempo', ex: () => [exercise('Correr', 1, 0, 0, 'run')] },
  { key: 'cardio2', cat: 'cardio', emoji: '🪢', name: 'Cardio · Comba', sub: 'Rondas de comba y burpees', ex: () => [exercise('Saltar a la comba', 5, 0, 0, 'min'), exercise('Burpees', 3, 8, 12, 'reps')] },
  { key: 'cardio3', cat: 'cardio', emoji: '🚴', name: 'Cardio · Bici y core', sub: 'Bici estática o de calle + abdomen', ex: () => [exercise('Bici', 1, 0, 0, 'min'), exercise('Plancha', 3, 0, 0, 'seg'), exercise('Abdominales', 3, 15, 25, 'reps')] },
  { key: 'mov1', cat: 'movilidad', emoji: '🧘', name: 'Movilidad · Estirar', sub: '15 minutos para soltar el cuerpo', ex: () => [
    exercise('Estiramiento de isquios', 2, 0, 0, 'seg'), exercise('Estiramiento de cadera', 2, 0, 0, 'seg'), exercise('Gato-camello', 2, 8, 12, 'reps'),
    exercise('Apertura de pecho', 2, 0, 0, 'seg'), exercise('Sentadilla profunda', 2, 0, 0, 'seg')] },
  { key: 'baile1', cat: 'movilidad', emoji: '💃', name: 'Baile · Técnica', sub: 'Calentar, técnica y coreo', ex: () => [
    exercise('Cardio de baile', 1, 0, 0, 'min'), exercise('Aislamientos', 3, 0, 0, 'min'), exercise('Giros', 3, 8, 12, 'reps'),
    exercise('Footwork', 3, 0, 0, 'min'), exercise('Pasadas de coreografía', 4, 1, 3, 'reps'), exercise('Estiramientos de baile', 1, 0, 0, 'min')] },
];
const reward = (name, cost) => ({ id: uid(), name, cost });
const defaultRewards = () => [
  reward('Ir al cine', 250),
  reward('Comprarme algo pequeño que me apetezca (hasta 20 €)', 400),
  reward('Algo para el skate (ruedas, lija, rodamientos…)', 700),
  reward('Algo para grabar (filtro, micro, accesorio…)', 900),
  reward('Comprarme eso que llevo tiempo queriendo (hasta 60 €)', 1500),
  reward('Concierto o plan especial', 2000),
];
// Premios de ejemplo de la versión anterior: si siguen sin tocar, se cambian por los nuevos
const OLD_REWARDS = ['Un café o un snack fuera', 'Tarde de videojuegos o serie', 'Un día libre de entreno sin culpa', 'Cena fuera o pedir comida', 'Un capricho (ropa, algo para el skate…)'];
const defaultState = () => ({ v: 5, name: '', onboarded: false, color: '#C7B5FF', look: Character.randomLook(), photo: null, xpDays: {}, wardrobe: [], wins: [], recapSeen: null, nudgesSent: {}, weight: { start: null, goal: null, log: [] }, train: [], sessions: [], routines: defaultRoutines(), campaigns: defaultCampaigns(),
  daily: {}, activity: {}, rewards: defaultRewards(), purchases: [], unequipped: [] });

/** Pone al día datos guardados por versiones anteriores. */
function migrate(s) {
  (s.campaigns || []).forEach(c => c.id === 'carnet' && c.levels.forEach(l => l.missions.forEach(m => {
    if (m.type !== 'count' || m.unit) return;
    if (/tests de pr[aá]ctica/i.test(m.name)) { m.unit = 3; m.xp = m.target * 3; }
    if (/clases pr[aá]cticas/i.test(m.name)) { m.unit = 5; m.xp = m.target * 5; }
  })));
  // Una sola vez: los tests y clases que ya estaban hechos cuentan como de hoy, para que se vean también en la semana
  (s.campaigns || []).forEach(c => c.id === 'carnet' && c.levels.forEach(l => l.missions.forEach(m => {
    if (m.type !== 'count' || !m.unit || m.backfilled) return;
    const logged = Object.values(m.log || {}).reduce((a, n) => a + n, 0), missing = Math.min(m.count, m.target) - logged;
    if (missing > 0) { m.log = m.log || {}; const d = dateKey(new Date()); m.log[d] = (m.log[d] || 0) + missing; }
    m.backfilled = true;
  })));
  if (!s.routines) {
    s.routines = defaultRoutines();
    const body = s.campaigns.find(c => c.tracker === 'body');
    if (body && body.levels[1] && !body.levels.some(l => l.missions.some(m => m.auto === 'prs'))) body.levels[1].missions.push(auto('Récords personales', 60, 'prs', { target: 5 }));
  }
  s.sessions = s.sessions || [];
  // v3: fuera correos y trabajos
  s.campaigns = s.campaigns.filter(c => c.tracker !== 'leads' && c.tracker !== 'jobs');
  delete s.leads; delete s.jobs; delete s.active;
  const defaultColors = { carnet: 'orange', fisico: 'lime' };
  s.campaigns.forEach((c, i) => { c.color = c.color || defaultColors[c.id] || COLORS[i % COLORS.length]; });
  s.routines.forEach(r => r.exercises.forEach(x => { if (x.name === 'Sentadillas sin peso') x.name = 'Sentadillas'; }));
  // v4: misiones diarias, tienda y objetos equipables
  s.daily = s.daily || {}; s.activity = s.activity || {};
  s.rewards = s.rewards || defaultRewards(); s.purchases = s.purchases || []; s.unequipped = s.unequipped || [];
  // v5: premios nuevos (cine y compras) si los de ejemplo no se habían cambiado
  if ((s.v || 0) < 5 && s.rewards.every(r => OLD_REWARDS.includes(r.name))) s.rewards = defaultRewards();
  // Perfil para el ranking: nombre, color y XP por día (para la liga semanal)
  if (s.onboarded === undefined) s.onboarded = !!s.name;
  s.color = colorHex(s.color); s.xpDays = s.xpDays || {};
  // Personaje propio (el antiguo preset fijo pasa a ser un personaje normal para personalizar)
  if (!s.look || s.look.preset === 'axis') s.look = Character.randomLook();
  delete s.look.preset; delete s.look.star;
  s.look = Character.upgrade(s.look); // personaje por capas (v2)
  // Armario especial, semanas ganadas, cierre del lunes visto y cañas enviadas
  s.wardrobe = s.wardrobe || []; s.wins = s.wins || []; s.recapSeen = s.recapSeen || null; s.nudgesSent = s.nudgesSent || {}; s.feedSent = s.feedSent || {}; s.shields = s.shields || 0; s.shielded = s.shielded || []; s.coinLog = s.coinLog || []; s.duelsSettled = s.duelsSettled || {}; s.duelBase = s.duelBase || {}; s.vouchersDone = s.vouchersDone || {}; s.rivals = s.rivals || []; fairCampaigns(s); s.dailyItems = s.dailyItems || []; s.dailyDone = s.dailyDone || {}; s.passed = s.passed || {}; if (s.rivalsOnly === undefined) s.rivalsOnly = true; if (s.avatarUrl === undefined) s.avatarUrl = null; s.avatarReq = s.avatarReq || null; s.avatarRefunds = s.avatarRefunds || [];
  if (s.photo === undefined) s.photo = null;
  s.v = 5;
  return s;
}

/* =========================================================
   4. Estado: datos guardados + estado de la interfaz
   ========================================================= */
let S = migrate(storage.get(STORAGE.state) || defaultState());
const ui = {
  view: 'home', editing: false, open: {}, armed: null,
  addingCampaign: false, newIcon: 'star', newColor: 'pink',
  draft: storage.get(STORAGE.draft), sync: 'local', exForm: null, account: false,
  addingReward: false, bossHit: null,
  ranking: null, rankingState: 'idle', rankTab: 'week', onboardCamps: { fisico: true, carnet: false }, profileExtras: true, prevCols: true, lookTab: 'cara', playerId: null, nudgeQueue: [], ideas: null, ideasState: 'idle', feed: null, feedState: 'idle', duels: null, duelsState: 'idle', vouchers: null, vouchersState: 'idle', invite: null, duelForm: { metric: 'xp', stake: 50 }, isAdmin: false, ideaKind: 'campana',
};

/* =========================================================
   5. Cálculos derivados
   ========================================================= */
const lastKg = () => { const l = S.weight.log; return l.length ? l[l.length - 1].kg : null; };

// Récords: cada serie se puntúa según su tipo (kg y repes, solo repes, tiempo o carrera)
const oneRepMax = s => (+s.kg || 0) * (1 + s.r / 30) + s.r * 0.01;
function setScore(s) {
  if (s.km != null) return (+s.km || 0) * 1000 - (+s.t || 0) * 0.01;
  if (s.t != null) return +s.t || 0;
  if ((+s.kg || 0) > 0) return oneRepMax(s) + 1000;
  return +s.r || 0;
}
function exerciseStats(exId) {
  let best = null, last = null, records = 0, bestScore = 0;
  for (const session of S.sessions) {
    const sets = session.ex[exId];
    if (!sets || !sets.length) continue;
    last = { d: session.d, sets };
    const top = sets.reduce((a, b) => (setScore(b) > setScore(a) ? b : a));
    if (setScore(top) > bestScore + 0.001) { if (best) records++; bestScore = setScore(top); best = top; }
  }
  return { best, last, records };
}
function totalRecords() {
  const ids = new Set();
  S.sessions.forEach(s => Object.keys(s.ex).forEach(id => ids.add(id)));
  let n = 0; ids.forEach(id => { n += exerciseStats(id).records; });
  return n;
}

// Misiones automáticas: valor actual de cada contador
const COUNTERS = { train: () => S.train.length, prs: totalRecords };
function autoProgress(m) {
  const w = S.weight, cur = lastKg();
  switch (m.auto) {
    case 'wstart': return w.start != null ? 1 : 0;
    case 'wgoal': return w.goal != null ? 1 : 0;
    case 'wloss': return w.start == null || cur == null ? 0 : clamp((w.start - cur) / m.kg);
    case 'wreach': return w.start == null || w.goal == null || cur == null || w.start <= w.goal ? 0 : clamp((w.start - cur) / (w.start - w.goal));
    default: return COUNTERS[m.auto] ? clamp(COUNTERS[m.auto]() / m.target) : 0;
  }
}
const clamp = v => Math.max(0, Math.min(1, v));
const progress = m => (m.type === 'count' ? clamp(m.count / m.target) : m.type === 'auto' ? autoProgress(m) : m.done ? 1 : 0);
const isDone = m => progress(m) >= 1;
// Misiones que se repiten (tests, clases…): cada vez da su XP, no solo al terminar
const unitXP = m => m.unit || Math.max(1, Math.round(m.xp / Math.max(1, m.target || 1)));
const missionXP = m => (m.type === 'count' ? Math.min(m.count || 0, m.target) * unitXP(m) : isDone(m) ? m.xp : 0);
const missionMaxXP = m => (m.type === 'count' ? m.target * unitXP(m) : m.xp);
/** Apunta en qué día se hizo cada repetición (para la XP de la semana). */
function countLog(m, delta, date = logDate()) {
  const log = (m.log = m.log || {});
  if (delta > 0) { log[date] = (log[date] || 0) + delta; return; }
  const days = Object.keys(log).filter(d => log[d] > 0).sort();
  const d = days.includes(date) ? date : days.pop(); if (d) { log[d]--; if (!log[d]) delete log[d]; }
}
const avg = list => (list.length ? list.reduce((a, m) => a + progress(m), 0) / list.length : 0);
const levelProgress = l => avg(l.missions);
const campaignProgress = c => avg(c.levels.flatMap(l => l.missions));
const allMissions = () => S.campaigns.flatMap(c => c.levels.flatMap(l => l.missions));
function currentLevelIndex(c) {
  const i = c.levels.findIndex(l => !(l.missions.length && levelProgress(l) >= 1));
  return i < 0 ? c.levels.length - 1 : i;
}
function totalXP() {
  return trainXP() + totalRecords() * XP.record + allMissions().reduce((a, m) => a + missionXP(m), 0) + chestTotals().xp + dailyItemsXP();
}
// ---------- Cada día: cosas propias que hacer o tomar a diario (pastilla, creatina, apuntar la comida…) ----------
const DAILY_PRESETS = [['💊', 'Tomar la pastilla'], ['🥤', 'Tomar la creatina'], ['🍽️', 'Apuntar lo que como'], ['💧', 'Beber 2 litros de agua'], ['🍊', 'Vitaminas'], ['🧴', 'Skincare'], ['📖', 'Leer 10 minutos'], ['🦷', 'Hilo dental']];
const DAILY_EMOJIS = ['💊', '🥤', '🍽️', '💧', '🍊', '🧴', '📖', '🦷', '🧘', '🚶', '😴', '✍️', '🎸', '🌱'];
/** Cada cosa diaria da un poco de XP (como mucho 5 al día cuentan), para que se note sin poder abusar. */
function dailyItemsXP() { return Object.values(S.dailyDone).reduce((a, ids) => a + Math.min(5, ids.length) * XP.daily, 0); }
function dailyItemStreak(id) {
  const d = new Date(); if (!(S.dailyDone[today()] || []).includes(id)) d.setDate(d.getDate() - 1);
  let n = 0; while ((S.dailyDone[dateKey(d)] || []).includes(id)) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
// ---------- XP de entrenar: según el tiempo y la intensidad de cada sesión ----------
// Desde el 23/11/2026 cada sesión cuenta por sus minutos e intensidad (lo de antes se queda a 5 XP por día entrenado).
const TRAIN_CUTOFF = '2026-11-23';
const INTENSITY = {
  suave: { label: '🚶 Suave', hint: 'Caminar, estirar, yoga', xpm: 0.15 },
  media: { label: '💪 Media', hint: 'Fuerza, bici, técnica de baile', xpm: 0.3 },
  fuerte: { label: '🔥 Fuerte', hint: 'Correr, comba, HIIT, partido, bailar coreos', xpm: 0.45 },
};
// El baile cuenta como fuerte (coreos, clases, ensayos): mueve todo el cuerpo y cansa como correr. Si es solo técnica o estirar, se puede bajar a media o suave.
const INTENSE_WORDS = /correr|carrera|comba|cuerda|hiit|burpee|f[uú]tbol|boxeo|nataci[oó]n|nadar|escalada|baloncesto|sprint|crossfit|spinning|mountain|baile|bailar|danza|coreo|zumba|dance|salsa|bachata|hip ?hop|reggaet[oó]n|ballet/i;
const SOFT_WORDS = /caminar|andar|paseo|estir|yoga|movilidad|respira|meditar/i;
/** Intensidad que se le supone a una actividad o rutina si no la has elegido. */
function guessIntensity(name, exNames = []) {
  const all = [name || '', ...exNames].join(' ');
  if (INTENSE_WORDS.test(all) && !/fuerza|press|sentadilla|peso muerto/i.test(all)) return 'fuerte';
  if (SOFT_WORDS.test(all) && !exNames.some(n => !SOFT_WORDS.test(n))) return 'suave';
  return 'media';
}
/** Minutos de una sesión: los que apuntaste, o una estimación por las series que hiciste. */
function sessionMinutes(se) {
  if (se.mins) return Math.min(180, se.mins);
  let m = 0;
  Object.entries(se.ex || {}).forEach(([id, sets]) => {
    const x = findExercise(id), k = x ? x.kind : 'reps';
    sets.forEach(st => { m += k === 'min' ? (st.t || 0) : k === 'run' ? (st.t || (st.km || 0) * 6) : k === 'seg' ? (st.t || 0) / 60 + 1.5 : 2.5; });
  });
  return Math.min(180, Math.round(m));
}
const sessionIntensity = se => se.int || guessIntensity(se.activity || se.rname, Object.keys(se.ex || {}).map(id => (findExercise(id) || {}).name || ''));
/** XP de una sesión: minutos (hasta 2 h) × intensidad. Como mínimo 2. Los récords suman aparte. */
const sessionXP = se => Math.max(2, Math.round(Math.min(120, sessionMinutes(se)) * INTENSITY[sessionIntensity(se)].xpm));
/** XP del día: lo que pasa de 60 cuenta la mitad, para que se pueda entrenar varias veces sin que se dispare. */
const dayXPfrom = raw => (raw <= 60 ? raw : 60 + Math.round((raw - 60) / 2));
function trainByDay() {
  const days = {};
  S.train.forEach(d => { days[d] = days[d] || { marked: true, ses: [] }; days[d].marked = true; });
  S.sessions.forEach(se => { (days[se.d] = days[se.d] || { marked: false, ses: [] }).ses.push(se); });
  const out = {};
  Object.entries(days).forEach(([d, v]) => {
    if (d < TRAIN_CUTOFF) { out[d] = v.marked ? XP.train : 0; return; }
    const raw = v.ses.reduce((a, se) => a + sessionXP(se), 0) + (v.ses.length ? 0 : (v.marked ? XP.train : 0));
    out[d] = dayXPfrom(raw);
  });
  return out;
}
const trainXP = () => Object.values(trainByDay()).reduce((a, n) => a + n, 0);
function levelOf(xp) { let L = 1; while (xpForLevel(L + 1) <= xp) L++; return L; }
function streak() {
  const set = new Set(S.train), d = new Date();
  if (!set.has(today())) d.setDate(d.getDate() - 1);
  let n = 0; while (set.has(dateKey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
/* ---------- Juego: diarias, cofres, monedas, ánimo del personaje y jefes ---------- */
const hash = str => [...str].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);
const dayOf = (s, date = today()) => (s.daily[date] = s.daily[date] || {});
function chestTotals() {
  return Object.values(S.daily).reduce((t, d) => (d.chest ? { xp: t.xp + d.chest.xp, coins: t.coins + d.chest.coins } : t), { xp: 0, coins: 0 });
}
/** Apunta que hoy se ha avanzado (o deshecho) algo en una campaña: alimenta las diarias y el ánimo. */
function logActivity(s, cid, delta) {
  const day = (s.activity[logDate()] = s.activity[logDate()] || {});
  day[cid] = Math.max(0, (day[cid] || 0) + delta);
}

/** Las 3 misiones de un día: entrenar, avanzar en una campaña y un hábito, siempre las mismas para esa fecha. */
function dailyQuests(date = today()) {
  const seed = hash(date), quests = [];
  const body = S.campaigns.find(c => c.tracker === 'body');
  if (body) quests.push({ key: 'train', kind: 'train' });
  const open = S.campaigns.filter(c => c.tracker !== 'body' && campaignProgress(c) < 1);
  if (open.length) { const c = open[seed % open.length]; quests.push({ key: 'adv:' + c.id, kind: 'advance', cid: c.id }); }
  const pool = HABITS.map(h => ({ key: h.key, kind: 'habit', label: h.label }));
  if (body && S.weight.goal != null) pool.push({ key: 'weigh', kind: 'weigh' });
  let n = seed;
  while (quests.length < 3 && pool.length) { quests.push(pool.splice(n % pool.length, 1)[0]); n = Math.floor(n / 7) + 3; }
  return quests;
}
function questDone(q, date = today()) {
  switch (q.kind) {
    case 'train': return S.train.includes(date);
    case 'advance': return ((S.activity[date] || {})[q.cid] || 0) > 0;
    case 'weigh': return S.weight.log.some(p => p.d === date);
    default: return !!((S.daily[date] || {}).habits || {})[q.key];
  }
}
function questText(q) {
  if (q.kind === 'train') return ui.logDay ? { title: 'Entrenar', sub: 'Márcalo si entrenaste ese día' } : { title: 'Entrena hoy', sub: 'Una rutina, correr o comba: lo que te apetezca' };
  if (q.kind === 'weigh') return { title: 'Pésate', sub: 'Apúntalo en Físico' };
  if (q.kind === 'advance') {
    const c = findCampaign(q.cid), l = c && c.levels[currentLevelIndex(c)], next = l && l.missions.find(m => !isDone(m));
    return { title: `Avanza en ${c ? c.name : 'una campaña'}`, sub: next ? `Por ejemplo: ${next.name}` : 'Marca cualquier misión' };
  }
  return { title: q.label, sub: 'Márcalo tú cuando lo hagas' };
}

// Monedas: se ganan jugando y se gastan en la tienda
function coinsEarned() {
  const fromMissions = allMissions().reduce((a, m) => a + Math.round(missionXP(m) * (m.type === 'count' || (m.doneAt && m.doneAt >= COINS_CUTOFF_MS) ? COINS.missionShare : COINS_OLD.missionShare)), 0);
  const fromTrain = Object.entries(trainByDay()).reduce((a, [d, xp]) => a + (d < COINS_CUTOFF ? (xp ? COINS_OLD.train : 0) : d < TRAIN_CUTOFF ? (xp ? COINS.train : 0) : Math.max(xp ? 1 : 0, Math.round(xp * 0.15))), 0);
  return fromMissions + fromTrain + totalRecords() * COINS.record + chestTotals().coins + S.coinLog.reduce((a, c) => a + c.amount, 0);
}
const chestReady = () => !(S.daily[today()] || {}).chest && dailyQuests().every(q => questDone(q));
const coinsSpent = () => S.purchases.reduce((a, p) => a + p.cost, 0);
const coins = () => Math.max(0, coinsEarned() - coinsSpent());

// Ánimo del personaje según lo que has hecho estos días
function activeDays() {
  const days = new Set([...S.train, ...S.weight.log.map(p => p.d), ...S.sessions.map(x => x.d), ...S.shielded]);
  Object.entries(S.activity).forEach(([d, v]) => { if (Object.values(v).some(n => n > 0)) days.add(d); });
  Object.entries(S.daily).forEach(([d, v]) => { if (v.chest || Object.values(v.habits || {}).some(Boolean)) days.add(d); });
  return days;
}
function mood() {
  const days = activeDays(), t = today(), d = new Date();
  const activeToday = days.has(t);
  if (!activeToday) d.setDate(d.getDate() - 1);
  let run = 0; while (days.has(dateKey(d))) { run++; d.setDate(d.getDate() - 1); }
  const last = [...days].sort().pop();
  const idle = last ? Math.round((new Date(t + 'T12:00') - new Date(last + 'T12:00')) / 864e5) : null;
  const quests = dailyQuests(), left = quests.filter(q => !questDone(q)).length, chest = (S.daily[t] || {}).chest;
  if (activeToday && chest) return { kind: 'proud', line: run >= 2 ? `Cofre abierto y ${run} días seguidos. Así sí.` : 'Cofre de hoy abierto. Mañana más.' };
  if (activeToday && run >= 3) return { kind: 'fire', line: `${run} días seguidos. ${left ? `Te ${left === 1 ? 'queda 1 misión' : 'quedan ' + left + ' misiones'} para el cofre.` : 'Abre el cofre.'}` };
  if (activeToday) return { kind: 'happy', line: left ? `Buen arranque. Te ${left === 1 ? 'queda 1 misión' : 'quedan ' + left + ' misiones'} para el cofre.` : '¡Las 3 hechas! Abre el cofre.' };
  if (idle != null && idle >= 2) return { kind: 'tired', line: `Llevamos ${idle} días parados… Una misión pequeña y arrancamos.` };
  if (run >= 2) return { kind: 'idle', line: `Racha de ${run} días en juego. Haz una misión hoy y la salvas.` };
  return { kind: 'idle', line: idle === 1 ? 'Ayer bien. ¿Seguimos hoy?' : '¿Empezamos? Tus misiones de hoy están aquí abajo.' };
}
/** Objetos que tienes: los que ya tenías por nivel cuando llegó la elección, y los que has elegido en cada nivel. */
function ensureItems() {
  if (S.itemsFrom != null) return;
  const L = levelOf(totalXP());
  S.itemsFrom = L; S.itemsBase = ITEMS.filter(i => i.level <= L).map(i => i.key); S.itemPicks = S.itemPicks || {};
}
const ownedItems = () => { ensureItems(); return new Set([...(S.itemsBase || []), ...Object.values(S.itemPicks || {})]); };
const seededShuffle = (arr, seed) => { const a = arr.slice(); let h = seed * 2654435761 >>> 0; for (let i = a.length - 1; i > 0; i--) { h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0; const j = h % (i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
/** Niveles en los que aún te toca elegir objeto, y las 3 opciones de cada uno. */
function pendingPicks() {
  ensureItems();
  const L = levelOf(totalXP()), own = ownedItems(), out = [];
  for (let l = S.itemsFrom + 1; l <= L; l++) if (!S.itemPicks[l]) out.push(l);
  return out.filter(() => ALL_ITEMS.some(i => !own.has(i.key)));
}
const pickOptions = l => { const own = ownedItems(); return seededShuffle(ALL_ITEMS.filter(i => !own.has(i.key)), l * 7919).slice(0, 3); };
// Cada mano lleva una sola cosa (y a los pies, una mascota o cosa): si hay dos, se queda la última conseguida
const wearing = () => {
  const own = ownedItems(), used = {};
  return ALL_ITEMS.filter(i => i.wearable && own.has(i.key) && !S.unequipped.includes(i.key)).reverse()
    .filter(i => { if (!i.slot) return true; if (used[i.slot]) return false; used[i.slot] = true; return true; }).reverse().map(i => i.key);
};

// Jefe final: el último nivel de cada campaña; los niveles anteriores le quitan vida
function boss(c) {
  if (c.levels.length < 2) return null;
  const last = c.levels[c.levels.length - 1], before = c.levels.slice(0, -1).flatMap(l => l.missions);
  if (!before.length) return null;
  const hp = 1 - avg(before), defeated = last.missions.length > 0 && levelProgress(last) >= 1;
  const left = before.filter(m => !isDone(m)).length;
  return { level: last, hp: defeated ? 0 : hp, defeated, left, target: (last.missions.find(m => !isDone(m)) || last.missions[0] || {}).name };
}

// Liga semanal: XP ganada desde el lunes, a partir de la XP guardada cada día
function mondayKey(date = new Date()) { const d = new Date(date); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return dateKey(d); }
/** Récords de fuerza conseguidos desde una fecha (cada uno da XP). */
function recordsSince(date) {
  const best = {}; let n = 0;
  S.sessions.slice().sort((a, b) => (a.d < b.d ? -1 : a.d > b.d ? 1 : 0)).forEach(se => Object.entries(se.ex).forEach(([id, sets]) => {
    if (!sets || !sets.length) return;
    const top = Math.max(...sets.map(setScore));
    if (best[id] != null && top > best[id] + 0.001 && se.d >= date) n++;
    if (best[id] == null || top > best[id]) best[id] = top;
  }));
  return n;
}
/** XP ganada desde una fecha, sumando cada cosa por el día en que se hizo.
 *  (Antes se restaban fotos del total y, al cambiar cómo se cuenta la XP, la semana se quedaba en 0.) */
function xpSince(date, until) {
  const from = new Date(date + 'T00:00').getTime(), to = until ? new Date(until + 'T00:00').getTime() : Infinity;
  const inRange = d => d >= date && (!until || d < until);
  let x = 0;
  allMissions().forEach(m => {
    if (m.type === 'count') { Object.entries(m.log || {}).forEach(([d, n]) => { if (inRange(d)) x += n * unitXP(m); }); return; }
    if (m.type !== 'auto' && isDone(m) && m.doneAt && m.doneAt >= from && m.doneAt < to) x += m.xp;
  });
  Object.entries(trainByDay()).forEach(([d, v]) => { if (inRange(d)) x += v; });
  Object.entries(S.daily).forEach(([d, v]) => { if (v.chest && inRange(d)) x += v.chest.xp; });
  Object.entries(S.dailyDone).forEach(([d, ids]) => { if (inRange(d)) x += Math.min(5, ids.length) * XP.daily; });
  x += (recordsSince(date) - (until ? recordsSince(until) : 0)) * XP.record;
  return x;
}
function weekXP() {
  return xpSince(mondayKey());
}
const chestsThisWeek = () => Object.entries(S.daily).filter(([d, v]) => d >= mondayKey() && v.chest).length;
function activeStreak() {
  const days = activeDays(), d = new Date();
  if (!days.has(today())) d.setDate(d.getDate() - 1);
  let n = 0; while (days.has(dateKey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
/** ¿Está desbloqueada una prenda especial? Devuelve también cómo se consigue. */
function unlockState(key) {
  const def = Character.PREMIUM[key];
  if (!def) return { ok: true };
  if (def.level) return { ok: levelOf(totalXP()) >= def.level, how: `Sale en el nivel ${def.level}`, short: `Nv ${def.level}` };
  if (def.cost) return { ok: S.wardrobe.includes(key), how: `Se compra en la tienda por ${def.cost} monedas`, short: `${def.cost}`, cost: def.cost };
  if (def.streak) return { ok: S.wardrobe.includes(key) || activeStreak() >= def.streak, how: `Se gana con una racha de ${def.streak} días`, short: `Racha ${def.streak}` };
  if (def.how === 'duel') return { ok: S.wardrobe.includes(key) || Object.values(S.duelsSettled).includes('win'), how: 'Se gana ganando un duelo', short: 'Duelo' };
  return { ok: S.wins.length > 0, how: 'Se gana quedando primero en una liga semanal', short: 'Gana' };
}
const lastMondayKey = () => { const d = new Date(); d.setDate(d.getDate() - 7); return mondayKey(d); };
const xpBefore = date => { const k = Object.keys(S.xpDays).filter(d => d < date).sort().pop(); return k ? S.xpDays[k] : 0; };
const myPrevWeekXP = () => xpSince(lastMondayKey(), mondayKey());
function daysLeftInWeek() { return 7 - ((new Date().getDay() + 6) % 7); }

function weekDays() {
  const now = new Date(), dow = (now.getDay() + 6) % 7, monday = new Date(now);
  monday.setDate(now.getDate() - dow);
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return { date: d, key: dateKey(d), isToday: i === dow }; });
}

// Progresión de ejercicios
const KIND_LABEL = { seg: 's', min: 'min' };
function setText(s) {
  if (s.km != null) return `${fmt(s.km)} km en ${fmt(s.t)} min`;
  if (s.t != null) return `${fmt(s.t)} ${KIND_LABEL[s.u] || 's'}`;
  if ((+s.kg || 0) > 0) return `${s.r} repes con ${fmt(s.kg)} kg`;
  return `${s.r} repes sin peso`;
}
function scheme(x) {
  if (x.kind === 'peso' || x.kind === 'reps') return `${x.sets}×${x.repMin}-${x.repMax}${x.kind === 'reps' ? ' repes' : ''}`;
  if (x.kind === 'run') return 'carrera';
  return `${x.sets} series en ${x.kind === 'seg' ? 'segundos' : 'minutos'}`;
}
const blankSet = x => ({ peso: { kg: '', r: '' }, reps: { r: '', kg: '' }, run: { km: '', t: '' } }[x.kind] || { t: '', u: x.kind });
const FIRST_TIME = {
  peso: x => `Primera vez: busca un peso con el que hagas ${x.repMin}-${x.repMax} repes con buena técnica`,
  reps: x => `Primera vez: haz las que puedas con buena técnica, objetivo ${x.repMax}`,
  seg: () => 'Primera vez: aguanta lo que puedas y apúntalo',
  min: () => 'Primera vez: apunta cuánto aguantas en cada ronda',
  run: () => 'Primera vez: apunta distancia y tiempo, sin pasarte',
};
/** Qué toca hoy en un ejercicio: series prerrellenadas y consejo de progresión. */
function nextSession(x) {
  const last = exerciseStats(x.id).last, sets = Math.max(1, x.sets || 1);
  if (!last) return { rows: Array.from({ length: sets }, () => (x.kind === 'peso' && x.startKg ? { kg: String(x.startKg), r: '' } : blankSet(x))), tip: FIRST_TIME[x.kind](x), levelUp: false };
  const copy = () => last.sets.map(s => Object.assign({}, s));
  const allAtTop = last.sets.length >= x.sets && last.sets.every(s => s.r >= x.repMax);
  switch (x.kind) {
    case 'peso': {
      if (!allAtTop) return { rows: copy(), tip: `Mismo peso, intenta sumar repes hasta ${x.repMax}`, levelUp: false };
      const kg = Math.round((Math.max(...last.sets.map(s => +s.kg || 0)) + x.step) * 100) / 100;
      return { rows: Array.from({ length: sets }, () => ({ kg, r: x.repMin })), tip: `Toca subir: ${fmt(kg)} kg`, levelUp: true };
    }
    case 'reps':
      return allAtTop
        ? { rows: copy(), tip: `Ya llegas a ${x.repMax}: añade algo de peso, una serie más o una variante más difícil`, levelUp: true }
        : { rows: copy(), tip: 'Intenta 1 repe más en cada serie', levelUp: false };
    case 'seg': case 'min': {
      const best = Math.max(...last.sets.map(s => +s.t || 0));
      const goal = x.kind === 'seg' ? Math.ceil(best * 1.1 / 5) * 5 : Math.ceil(best * 1.1 * 2) / 2;
      return { rows: copy(), tip: `Objetivo: ${fmt(goal)} ${KIND_LABEL[x.kind]} en alguna serie`, levelUp: false };
    }
    default:
      return { rows: copy(), tip: `Última: ${setText(last.sets[0])}. Un poco más de distancia o lo mismo más rápido`, levelUp: false };
  }
}
/** Convierte lo escrito en la sesión en series válidas, descartando las vacías. */
function parseSet(kind, s) {
  if (kind === 'peso') { const r = parseInt(s.r, 10); return r > 0 ? { kg: num(s.kg) || 0, r } : null; }
  if (kind === 'reps') { const r = parseInt(s.r, 10), kg = num(s.kg); return r > 0 ? (kg > 0 ? { r, kg } : { r }) : null; }
  if (kind === 'run') { const km = num(s.km); return km > 0 ? { km, t: num(s.t) || 0 } : null; }
  const t = num(s.t); return t > 0 ? { t, u: kind } : null;
}

/* =========================================================
   6. Guardado: local + nube
   ========================================================= */
const CONFIG = window.APP_CONFIG || {};
const cloud = { client: null, user: null, timer: null, pending: false, queued: null, channel: null };

function setSync(state) {
  ui.sync = state;
  const el = document.getElementById('sync');
  if (el) { el.dataset.s = state; el.title = SYNC_LABEL[state]; el.setAttribute('aria-label', SYNC_LABEL[state]); }
}
const isTyping = () => { const a = document.activeElement; return !!a && (a.tagName === 'INPUT' || a.tagName === 'SELECT'); };
const stamp = s => s.updatedAt || 0;

/** Guarda en el dispositivo y, si hay sesión, sube a Supabase poco después. */
/** Lo que se gana por racha o duelo se queda para siempre aunque luego pierdas la racha. */
function grantUnlocks() {
  Object.entries(Character.PREMIUM).forEach(([key, def]) => {
    if ((def.streak || def.how === 'duel') && !S.wardrobe.includes(key) && unlockState(key).ok) { S.wardrobe.push(key); setTimeout(() => toast(`🎁 Nueva prenda desbloqueada: ${def.name}`), 1500); }
  });
}
let duelSyncTimer = null;
function persist() {
  grantUnlocks();
  if (avisos.endpoint) { clearTimeout(pushTimer); pushTimer = setTimeout(pushSync, 2000); }
  if (ui.duels) { clearTimeout(duelSyncTimer); duelSyncTimer = setTimeout(syncDuels, 1500); }
  S.updatedAt = Date.now();
  S.xpDays[today()] = totalXP();
  storage.set(STORAGE.state, S);
  if (cloud.user) schedulePush();
}
function schedulePush(delay = 800) {
  cloud.pending = true; setSync('saving');
  clearTimeout(cloud.timer);
  cloud.timer = setTimeout(push, delay);
}
async function push() {
  const { error } = await cloud.client.from('saves').upsert({ user_id: cloud.user.id, state: S, updated_at: new Date(stamp(S) || Date.now()).toISOString() });
  cloud.pending = false;
  if (error) { ui.syncErr = error.message || String(error.code || 'error'); setSync('error'); setTimeout(() => cloud.user && schedulePush(0), 15000); } else { ui.syncErr = null; setSync('cloud'); publishProfile(); }
}

/* ---------- Ranking: cada uno publica su perfil y todos ven la tabla ---------- */
const missingColumn = e => e && (e.code === 'PGRST204' || e.code === '42703' || /column/i.test(e.message || ''));
const missingTable = e => e && (e.code === '42P01' || e.code === 'PGRST205' || /does not exist|schema cache/i.test(e.message || ''));
async function publishProfile() {
  if (!cloud.user || !S.onboarded || !S.name) return;
  const xp = totalXP();
  const row = { user_id: cloud.user.id, name: S.name.slice(0, 24), color: S.color, level: levelOf(xp), xp,
    week: mondayKey(), week_xp: weekXP(), streak: activeStreak(), chests_week: chestsThisWeek(), updated_at: new Date().toISOString() };
  const extras = { photo: S.photo, look: Object.assign({}, S.look, { items: wearing(), avatar: S.avatarOff ? null : (S.avatarUrl || null) }) }, prev = { prev_week: lastMondayKey(), prev_week_xp: myPrevWeekXP() };
  // Si a la tabla le faltan columnas (SQL sin ejecutar), se publica lo que se pueda
  const tries = [[ui.profileExtras, ui.prevCols], [ui.profileExtras, false], [false, false]].filter(([e, p], i, a) => i === 0 || (e !== a[0][0] || p !== a[0][1]));
  let error = null;
  for (const [withExtras, withPrev] of tries) {
    ({ error } = await cloud.client.from('profiles').upsert(Object.assign({}, row, withExtras ? extras : {}, withPrev ? prev : {})));
    if (!error || !missingColumn(error)) { if (!error && (ui.profileExtras !== withExtras || ui.prevCols !== withPrev)) { ui.profileExtras = withExtras; ui.prevCols = withPrev; render(); } break; }
  }
  if (missingTable(error)) { ui.rankingState = 'missing'; render(); }
  if (!error) publishRoutines();
}
// Rutinas compartidas: cada uno publica las suyas (sin «Otros ejercicios») para que los demás puedan copiarlas
const routineSig = r => r.name + '|' + r.exercises.map(x => x.name + x.sets + x.repMin + x.repMax).join(',');
const DEFAULT_SIGS = new Set(defaultRoutines().map(routineSig));   // las que trae la app sin tocar no se comparten (las tiene todo el mundo)
const shareableRoutines = () => S.shareRoutines === false ? [] : S.routines.filter(r => !r.other && r.exercises.length && !DEFAULT_SIGS.has(routineSig(r))).slice(0, 15)
  .map(r => ({ name: r.name.slice(0, 40), ex: r.exercises.slice(0, 15).map(x => ({ name: x.name, kind: x.kind, sets: x.sets, repMin: x.repMin, repMax: x.repMax, step: x.step, startKg: x.startKg || null })) }));
let routinesSent = '';
async function publishRoutines() {
  if (!cloud.user || ui.routinesCol === false) return;
  const list = shareableRoutines(), key = JSON.stringify(list);
  if (key === routinesSent) return;
  const { error } = await cloud.client.from('profiles').update({ routines: list }).eq('user_id', cloud.user.id);
  if (error && missingColumn(error)) ui.routinesCol = false; else if (!error) routinesSent = key;
}
async function loadSharedRoutines() {
  if (!cloud.user || ui.routinesCol === false || ui.sharedLoading) return;
  ui.sharedLoading = true;
  const { data, error } = await cloud.client.from('profiles').select('user_id,name,color,routines').limit(200);
  ui.sharedLoading = false;
  if (error) { if (missingColumn(error)) { ui.routinesCol = false; render(); } return; }
  ui.sharedRoutines = data || []; render();
}
let rankingTimer = null;
async function loadRanking() {
  if (!cloud.user) return;
  const cols = 'user_id,name,color,level,xp,week,week_xp,streak,chests_week';
  const tries = [[ui.profileExtras, ui.prevCols], [ui.profileExtras, false], [false, false]];
  let data = null, error = null;
  for (const [withExtras, withPrev] of tries) {
    ({ data, error } = await cloud.client.from('profiles').select(cols + (withExtras ? ',photo,look' : '') + (withPrev ? ',prev_week,prev_week_xp' : '')).limit(200));
    if (!error || !missingColumn(error)) { ui.profileExtras = withExtras; ui.prevCols = withPrev; break; }
  }
  if (error) { ui.rankingState = missingTable(error) ? 'missing' : 'error'; render(); return; }
  ui.ranking = data; ui.rankingState = 'ok';
  if (!isTyping()) render();
  maybeShowRecap();
}
function listenRanking() {
  if (cloud.rankChannel) cloud.client.removeChannel(cloud.rankChannel);
  cloud.rankChannel = cloud.client.channel('ranking')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => { clearTimeout(rankingTimer); rankingTimer = setTimeout(loadRanking, 400); })
    .subscribe();
}
/* ---------- Escudo de racha: si un día fallas, se gasta solo y tu racha sigue ---------- */
const SHIELD_COST = 250, SHIELD_MAX = 3;
function useShields() {
  if (!S.onboarded || !S.shields) return;
  const days = activeDays(), d = new Date(), gap = [];
  d.setDate(d.getDate() - 1);
  while (!days.has(dateKey(d)) && gap.length < 7) { gap.push(dateKey(d)); d.setDate(d.getDate() - 1); }
  if (!gap.length || gap.length > S.shields || !days.has(dateKey(d))) return;
  const kept = (() => { let n = 0; const k = new Date(d); while (days.has(dateKey(k))) { n++; k.setDate(k.getDate() - 1); } return n; })();
  update(s => { s.shielded.push(...gap); s.shields -= gap.length; }, { reward: false });
  setTimeout(() => toast(`🛡️ ${gap.length === 1 ? 'Un escudo ha salvado' : gap.length + ' escudos han salvado'} tu racha de ${kept} ${kept === 1 ? 'día' : 'días'}`), 900);
}

/* ---------- Duelos 1 contra 1: una semana, quien más XP o más entrenos, con monedas en juego ---------- */
const DUEL_METRIC = { xp: { name: 'Más XP', desc: 'más XP', unit: 'XP' }, entrenos: { name: 'Más días entrenados', desc: 'más días entrenados', unit: 'entrenos' } };
const DUEL_STAKES = [0, 50, 100, 200];
const addDays = (key, n) => { const d = new Date(key + 'T12:00'); d.setDate(d.getDate() + n); return dateKey(d); };
/** Los duelos van de lunes a domingo y siempre empiezan la semana siguiente, para que nadie salga con ventaja. */
const nextMonday = () => addDays(mondayKey(), 7);
const iAmChallenger = d => cloud.user && d.challenger === cloud.user.id;
const duelRival = d => (iAmChallenger(d) ? { id: d.opponent, name: d.opponent_name } : { id: d.challenger, name: d.challenger_name });
/** Mi marcador en un duelo: lo que he sumado entre el día de inicio y el de fin. */
function myDuelScore(d) {
  if (!d.start_day || today() < d.start_day) return 0;
  const end = d.end_day, now = today(), until = now < end ? null : end;
  if (d.metric === 'entrenos') return S.train.filter(k => k >= d.start_day && k < end).length;
  return xpSince(d.start_day, until);
}
const duelScores = d => { const mine = myDuelScore(d), theirs = iAmChallenger(d) ? d.opponent_score : d.challenger_score; return { mine, theirs: theirs || 0 }; };
async function loadDuels() {
  if (!cloud.user) return;
  const { data, error } = await cloud.client.from('duels').select('*').order('created_at', { ascending: false }).limit(30);
  if (error) { ui.duelsState = missingTable(error) ? 'missing' : 'error'; return; }
  ui.duels = (data || []).filter(d => d.challenger === cloud.user.id || d.opponent === cloud.user.id); ui.duelsState = 'ok';
  syncDuels();
  if (!isTyping()) render();
}
let duelsTimer = null;
function listenDuels() {
  if (cloud.duelChannel) cloud.client.removeChannel(cloud.duelChannel);
  cloud.duelChannel = cloud.client.channel('duels')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'duels' }, () => { clearTimeout(duelsTimer); duelsTimer = setTimeout(loadDuels, 400); })
    .subscribe();
}
/** Sube mi marcador a los duelos activos y reparte las monedas de los que han terminado. */
function syncDuels() {
  if (!cloud.user || !ui.duels) return;
  ui.duels.forEach(d => {
    if (d.status !== 'active' && d.status !== 'finished') return;
    // Punto de partida de mi XP: lo que tenía al empezar el duelo (si lo veo el mismo día, lo que tengo ahora)
    if (d.metric === 'xp' && d.start_day && today() >= d.start_day && S.duelBase[d.id] == null) { S.duelBase[d.id] = today() === d.start_day ? totalXP() : xpBefore(d.start_day); persist(); }
    const field = iAmChallenger(d) ? 'challenger_score' : 'opponent_score', mine = myDuelScore(d);
    if (d.status === 'active' && d[field] !== mine) { d[field] = mine; cloud.client.from('duels').update({ [field]: mine }).eq('id', d.id).then(() => {}); }
    if (today() >= d.end_day && !S.duelsSettled[d.id]) {
      const { theirs } = duelScores(d), rival = duelRival(d);
      const won = mine > theirs, lost = mine < theirs;
      S.duelsSettled[d.id] = won ? 'win' : lost ? 'loss' : 'tie';
      if (d.stake && (won || lost)) S.coinLog.push({ id: uid(), d: today(), amount: won ? d.stake : -d.stake, note: `Duelo ${won ? 'ganado a' : 'perdido contra'} ${rival.name}` });
      persist();
      if (d.status === 'active') cloud.client.from('duels').update({ status: 'finished' }).eq('id', d.id).then(() => {});
      setTimeout(() => toast(won ? `¡Has ganado el duelo contra ${rival.name}!${d.stake ? ' +' + d.stake + ' monedas' : ''}` : lost ? `${rival.name} te ha ganado el duelo${d.stake ? ' (−' + d.stake + ' monedas)' : ''}` : `Empate en el duelo con ${rival.name}`), 1200);
      if (won) postFeed('duel', `ha ganado el duelo contra ${rival.name} (${mine} a ${theirs} ${DUEL_METRIC[d.metric].unit})`, 'duel:' + d.id);
    }
  });
}

/* ---------- Invitaciones: gastas monedas y un amigo te invita a algo de verdad ---------- */
const INVITES = [
  { key: 'cafe', ico: '☕', name: 'Un café', verb: 'a un café', cost: 500 },
  { key: 'desayuno', ico: '🥐', name: 'Desayunar', verb: 'a desayunar', cost: 1200 },
  { key: 'cine', ico: '🎬', name: 'Ir al cine', verb: 'al cine', cost: 2000 },
  { key: 'plan', ico: '🎳', name: 'Una tarde de plan', verb: 'a una tarde de plan (bolos, karting…)', cost: 3000 },
  { key: 'cena', ico: '🍕', name: 'Cenar', verb: 'a cenar', cost: 3500 },
  { key: 'montana', ico: '⛰️', name: 'Plan de 1 día a elegir', verb: 'a un plan de un día (montaña, playa, excursión…)', cost: 5000 },
  { key: 'finde', ico: '🏕️', name: 'Plan de 2 días a elegir', verb: 'a una escapada de dos días', cost: 9000 },
];
const THANKS = 0.2;   // quien invita recupera un 20% en monedas al cumplir
const inviteOf = k => INVITES.find(i => i.key === k) || { ico: '🎁', name: k, verb: 'a algo', cost: 0 };
async function loadVouchers() {
  if (!cloud.user) return;
  const { data, error } = await cloud.client.from('vouchers').select('*').order('created_at', { ascending: false }).limit(40);
  if (error) { ui.vouchersState = missingTable(error) ? 'missing' : 'error'; return; }
  ui.vouchers = (data || []).filter(v => v.from_id === cloud.user.id || v.to_id === cloud.user.id); ui.vouchersState = 'ok';
  settleVouchers();
  if (!isTyping()) render();
}
let vouchersTimer = null;
function listenVouchers() {
  if (cloud.voucherChannel) cloud.client.removeChannel(cloud.voucherChannel);
  cloud.voucherChannel = cloud.client.channel('vouchers')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'vouchers' }, () => { clearTimeout(vouchersTimer); vouchersTimer = setTimeout(loadVouchers, 400); })
    .subscribe();
}
/** Devuelve las monedas si te rechazan una invitación (una sola vez). */
function settleVouchers() {
  (ui.vouchers || []).forEach(v => {
    if (v.from_id === cloud.user.id && v.status === 'declined' && !S.vouchersDone[v.id]) {
      S.vouchersDone[v.id] = 'refund';
      S.coinLog.push({ id: uid(), d: today(), amount: v.cost, note: `Devuelto: ${v.to_name} no puede invitarte ${inviteOf(v.reward).verb}` });
      persist(); setTimeout(() => toast(`${v.to_name} no puede ahora. Te devolvemos ${v.cost} monedas`), 800);
    }
  });
}

/* ---------- Avisos al móvil (push): recordatorio diario y avisos de amigos ---------- */
const PUSH_KEY = 'modo-campana-avisos';   // de este dispositivo, no se sincroniza
const PUSH_KINDS = { reminder: 'Recordatorio diario', nudge: 'Cuando te dan caña', overtake: 'Cuando te pasan en la liga', duel: 'Duelos', invite: 'Invitaciones', react: 'Reacciones a tus logros' };
let avisos = { endpoint: null, hour: 20, hour2: 13, kinds: Object.keys(PUSH_KINDS) };
try { avisos = Object.assign(avisos, JSON.parse(localStorage.getItem(PUSH_KEY) || '{}')); } catch (e) { /* sin almacenamiento */ }
const savePushLocal = () => { try { localStorage.setItem(PUSH_KEY, JSON.stringify(avisos)); } catch (e) { /* sin almacenamiento */ } };
const pushSupported = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window && !!CONFIG.vapidPublicKey;
const isStandalone = () => (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent);
const b64ToBytes = b64 => { const s = atob((b64 + '='.repeat((4 - b64.length % 4) % 4)).replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from(s, ch => ch.charCodeAt(0)); };
const allDailyDone = () => dailyQuests().every(q => questDone(q));
function pushRow() {
  const row = { endpoint: avisos.endpoint, user_id: cloud.user.id, items: S.dailyItems.filter(i => i.hour != null).map(i => ({ n: `${i.emoji} ${i.name}`, h: i.hour, d: (S.dailyDone[today()] || []).includes(i.id) ? today() : null })), hour: avisos.hour, hour2: avisos.hour2 === avisos.hour ? null : avisos.hour2, kinds: avisos.kinds, rivals: S.rivals, done_day: allDailyDone() ? today() : null, updated_at: new Date().toISOString() };
  if (ui.pushItemsCol === false) delete row.items;   // tabla sin la columna nueva
  return row;
}
async function enablePush() {
  if (!cloud.user) { toast('Entra con tu cuenta para activar los avisos'); return; }
  if (!pushSupported()) { toast('Este navegador no permite avisos'); return; }
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') { toast('Sin permiso no te puedo avisar. Actívalo en los ajustes del móvil'); render(); return; }
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = (await reg.pushManager.getSubscription()) || await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(CONFIG.vapidPublicKey) });
    const j = sub.toJSON();
    avisos.endpoint = sub.endpoint; savePushLocal();
    let { error } = await cloud.client.from('push_subs').upsert(Object.assign(pushRow(), { p256dh: j.keys.p256dh, auth: j.keys.auth }));
    if (error && missingColumn(error) && ui.pushItemsCol !== false) { ui.pushItemsCol = false; ({ error } = await cloud.client.from('push_subs').upsert(Object.assign(pushRow(), { p256dh: j.keys.p256dh, auth: j.keys.auth }))); }
    if (error) { toast(missingTable(error) ? 'Falta activar los avisos en Supabase' : 'No se pudieron guardar los avisos'); return; }
    toast('🔔 Avisos activados en este móvil'); render();
  } catch (e) { toast('No se pudieron activar los avisos'); }
}
async function disablePush() {
  try { const reg = await navigator.serviceWorker.ready, sub = await reg.pushManager.getSubscription(); if (sub) await sub.unsubscribe(); } catch (e) { /* ya no estaba */ }
  if (avisos.endpoint && cloud.user) await cloud.client.from('push_subs').delete().eq('endpoint', avisos.endpoint);
  avisos.endpoint = null; savePushLocal(); render(); toast('Avisos desactivados en este móvil');
}
let pushSent = '', pushTimer = null;
/** Mantiene al día lo que el servidor necesita: si ya has hecho las misiones de hoy, tus rivales y tus preferencias. */
function pushSync(force) {
  if (!avisos.endpoint || !cloud.user) return;
  const row = pushRow(), key = JSON.stringify([row.items, row.hour, row.hour2, row.kinds, row.rivals, row.done_day]);
  if (!force && key === pushSent) return;
  pushSent = key;
  cloud.client.from('push_subs').update(row).eq('endpoint', avisos.endpoint).then(({ error }) => { if (error && missingColumn(error) && ui.pushItemsCol !== false) { ui.pushItemsCol = false; pushSent = ''; pushSync(true); } });
}
/** Avisa a otro jugador en su móvil (si lo tiene activado y quiere ese tipo de aviso). */
function notify(to, kind, title, text) {
  if (!cloud.user || !to || to === cloud.user.id || !cloud.client.functions) return;
  cloud.client.functions.invoke('push', { body: { to, kind, title, text } }).catch(() => {});
}
/** Si con lo que acabas de hacer pasas a alguien en la liga semanal, le llega un aviso (una vez por semana y persona). */
function checkOvertakes(weekBefore, weekAfter) {
  if (!cloud.user || !ui.ranking || weekAfter <= weekBefore) return;
  const monday = mondayKey(), done = (S.passed[monday] = S.passed[monday] || []);
  ui.ranking.forEach(r => {
    if (r.user_id === cloud.user.id || r.week !== monday || done.includes(r.user_id)) return;
    if (r.week_xp >= weekBefore && r.week_xp < weekAfter && r.week_xp > 0) {
      done.push(r.user_id);
      notify(r.user_id, 'overtake', `🏃 ${S.name} te ha pasado en la liga`, `Ahora va por delante con ${weekAfter} XP esta semana. ¡Recupera tu puesto!`);
    }
  });
  Object.keys(S.passed).forEach(k => { if (k !== monday) delete S.passed[k]; });
}

/* ---------- Muro de actividad: lo que va consiguiendo cada uno, con reacciones ---------- */
const REACTIONS = ['🔥', '💪', '👏'];
const FEED_ICON = { invite: '🎁', duel: '⚔️', level: '⭐', campaign: '🏁', boss: '⚔️', workout: '🏋️', record: '🏆', chest: '💰', player: '🆙' };
/** Publica un logro en el muro (una sola vez por clave, para no repetir si desmarcas y vuelves a marcar). */
function postFeed(kind, text, key) {
  if (!cloud.user || ui.feedState === 'missing') return;
  if (key) { if (S.feedSent[key]) return; S.feedSent[key] = Date.now(); persist(); }
  cloud.client.from('feed').insert({ user_id: cloud.user.id, name: S.name || '', kind, text: text.slice(0, 200) })
    .then(({ error }) => { if (error && missingTable(error)) ui.feedState = 'missing'; else if (!error) setTimeout(loadFeed, 300); });
}
let feedTimer = null;
async function loadFeed() {
  if (!cloud.user) return;
  const { data, error } = await cloud.client.from('feed').select('id,user_id,name,kind,text,created_at,feed_reactions(user_id,emoji)').order('created_at', { ascending: false }).limit(40);
  if (error) { ui.feedState = missingTable(error) ? 'missing' : 'error'; return; }
  ui.feed = data || []; ui.feedState = 'ok';
  if (!isTyping()) render();
}
function listenFeed() {
  if (cloud.feedChannel) cloud.client.removeChannel(cloud.feedChannel);
  cloud.feedChannel = cloud.client.channel('feed')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'feed' }, () => { clearTimeout(feedTimer); feedTimer = setTimeout(loadFeed, 400); })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'feed_reactions' }, () => { clearTimeout(feedTimer); feedTimer = setTimeout(loadFeed, 400); })
    .subscribe();
}
/** Niveles de campaña superados ahora mismo (para saber cuáles se acaban de superar). */
const clearedLevels = () => new Set(S.campaigns.flatMap(c => c.levels.filter(l => l.missions.length && levelProgress(l) >= 1).map(l => c.id + ':' + l.id)));
function announceProgress(levelsBefore, xpBefore) {
  if (!cloud.user) return;
  clearedLevels().forEach(k => {
    if (levelsBefore.has(k)) return;
    const [cid, lid] = k.split(':'), c = S.campaigns.find(x => x.id === cid), l = c && c.levels.find(x => x.id === lid);
    if (!l) return;
    const b = boss(c), last = c.levels[c.levels.length - 1] === l;
    if (b && b.level === l) postFeed('boss', `ha derrotado al jefe de ${c.name}${b.target ? ': ' + b.target : ''}`, 'boss:' + k);
    else if (last) postFeed('campaign', `ha completado la campaña ${c.name}`, 'camp:' + k);
    else postFeed('level', `ha superado «${l.name}» en ${c.name}`, 'lvl:' + k);
  });
  const L0 = levelOf(xpBefore), L1 = levelOf(totalXP());
  if (L1 > L0) postFeed('player', `ha subido al nivel ${L1}: ${rankFor(L1)}`, 'player:' + L1);
}

/* ---------- Darse caña: un aviso de ánimo entre amigos ---------- */
// ---------- Buzón de ideas: los jugadores sugieren y quien lleva la app decide ----------
const IDEA_KINDS = { campana: 'Campaña nueva', ejercicio: 'Ejercicio o deporte', funcion: 'Algo de la app', otro: 'Otra cosa' };
const IDEA_STATUS = { pendiente: 'Pendiente', aceptada: 'Aceptada', rechazada: 'Descartada', hecha: 'Ya está en la app' };
async function loadIdeas() {
  if (!cloud.user) return;
  ui.ideasState = 'loading';
  const [list, admin] = await Promise.all([
    cloud.client.from('suggestions').select('id,user_id,name,kind,text,status,reply,created_at').order('created_at', { ascending: false }).limit(150),
    cloud.client.rpc('is_admin'),
  ]);
  if (list.error) { ui.ideasState = /does not exist|schema cache|relation/i.test(list.error.message || '') ? 'missing' : 'error'; ui.ideas = []; }
  else { ui.ideas = list.data || []; ui.ideasState = 'ok'; }
  ui.isAdmin = !admin.error && admin.data === true;
  render();
}
const pendingIdeas = () => (ui.isAdmin && ui.ideas ? ui.ideas.filter(i => i.status === 'pendiente').length : 0);
/** Texto listo para pegar en el chat con Claude con todo lo aceptado y aún sin hacer. */
function ideasForClaude() {
  const list = (ui.ideas || []).filter(i => i.status === 'aceptada');
  if (!list.length) return '';
  return 'Sugerencias aceptadas del buzón de Modo Campaña. Impleméntalas en la app:\n\n'
    + list.map((i, k) => `${k + 1}. [${IDEA_KINDS[i.kind] || i.kind}] ${i.text.trim()} (de ${i.name || 'alguien'}${i.reply ? `; nota mía: ${i.reply.trim()}` : ''})`).join('\n')
    + '\n\nCuando estén, márcalas como hechas en el buzón.';
}
async function loadNudges() {
  if (!cloud.user) return;
  const { data, error } = await cloud.client.from('nudges').select('id,from_id,created_at').eq('to_id', cloud.user.id).eq('seen', false).limit(20);
  if (!error && data && data.length) queueNudges(data);
}
function listenNudges() {
  if (cloud.nudgeChannel) cloud.client.removeChannel(cloud.nudgeChannel);
  cloud.nudgeChannel = cloud.client.channel('nudges-' + cloud.user.id)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'nudges', filter: `to_id=eq.${cloud.user.id}` }, p => p.new && queueNudges([p.new]))
    .subscribe();
}
function queueNudges(rows) {
  const known = new Set(ui.nudgeQueue.map(n => n.id));
  ui.nudgeQueue.push(...rows.filter(r => !known.has(r.id) && isRival(r.from_id)));
  if (!document.querySelector('.nudge-pop')) showNextNudge();
}
async function showNextNudge() {
  const n = ui.nudgeQueue[0];
  if (!n) return;
  if (!ui.ranking) await loadRanking();
  const from = (ui.ranking || []).find(r => r.user_id === n.from_id) || { name: 'Alguien', color: '#C7B5FF' };
  const el = document.createElement('div');
  el.className = 'lvlup nudge-pop';
  el.innerHTML = html`<div style="background:${colorHex(from.color)};color:${inkFor(colorHex(from.color))}"><span class="pill">${GLYPH.star}¡Te dan caña!</span>
    ${from.look ? `<img class="nudge-char" src="${Character.image(from.look, { items: from.look.items || [], mood: 'fire' })}" alt="">` : ''}
    <h2>${esc(from.name)} te dice: ¡vamos!</h2><p class="hint" style="color:inherit">Haz una misión hoy y no te quedes atrás.</p>
    <button class="btn dark wide">¡Voy!</button></div>`;
  el.addEventListener('click', async () => {
    el.remove();
    const done = ui.nudgeQueue.shift();
    if (done && cloud.user) await cloud.client.from('nudges').update({ seen: true }).eq('id', done.id);
    showNextNudge();
  });
  document.body.appendChild(el);
}

/* ---------- Cierre del lunes: resultados de la semana pasada, una vez ---------- */
function lastWeekRows() {
  const lastMonday = lastMondayKey();
  return (ui.ranking || []).map(r => {
    const me = cloud.user && r.user_id === cloud.user.id;
    const xp = me ? myPrevWeekXP() : r.prev_week === lastMonday ? r.prev_week_xp : r.week === lastMonday ? r.week_xp : 0;
    return Object.assign({}, r, me ? { name: S.name, color: S.color, look: Object.assign({}, S.look, { items: wearing() }), me: true } : {}, { last_xp: xp || 0 });
  }).filter(r => r.last_xp > 0).sort((a, b) => b.last_xp - a.last_xp);
}
function maybeShowRecap() {
  const lastMonday = lastMondayKey();
  if (!S.onboarded || !cloud.user || S.recapSeen === lastMonday || document.querySelector('.recap-pop')) return;
  const rows = lastWeekRows();
  if (rows.length < 2) return;
  const pos = rows.findIndex(r => r.me), won = pos === 0;
  update(s => { s.recapSeen = lastMonday; if (won && !s.wins.includes(lastMonday)) s.wins.push(lastMonday); }, { reward: false });
  const top = rows.slice(0, 3), order = [1, 0, 2].filter(i => top[i]);
  const el = document.createElement('div');
  el.className = 'lvlup recap-pop';
  el.innerHTML = html`<div><span class="pill">${GLYPH.trophy}Semana terminada</span><h2>${won ? '¡Has ganado la semana!' : `Ganó ${esc(rows[0].name)}`}</h2>
    <div class="mini-podium">${order.map(i => `<div class="mp mp${i + 1}"><img src="${Character.image(top[i].look || Character.BASE, { items: (top[i].look && top[i].look.items) || [], mood: i === 0 ? 'fire' : 'happy' })}" alt=""><span class="mp-block"><b>${i + 1}</b><small class="num">${top[i].last_xp} XP</small></span><span class="mp-name">${esc(top[i].name)}</span></div>`).join('')}</div>
    <p class="hint on-lilac">${pos < 0 ? 'La semana pasada no sumaste XP. Esta semana empieza de cero para todos.' : won ? 'Ya puedes ponerte la corona en tu perfil.' : `Quedaste ${pos + 1}º de ${rows.length}. Esta semana empieza de cero.`}</p>
    <button class="btn dark wide">${won ? 'Ponerme la corona' : 'A por esta semana'}</button></div>`;
  el.addEventListener('click', () => { el.remove(); if (won) { ui.view = 'profile'; ui.lookTab = 'extras'; render(); scrollTop0(); } });
  document.body.appendChild(el);
}

/** Tabla ordenada: en la semana manda la XP de esta semana (quien no ha jugado esta semana va con 0). */
/** Solo compites con tus rivales si has elegido alguno (y no estás viendo "Todos"). */
const rivalsOn = () => S.rivals.length > 0 && S.rivalsOnly;
const isRival = id => !rivalsOn() || (cloud.user && id === cloud.user.id) || S.rivals.includes(id);
function rankedPlayers(tab = ui.rankTab, all = false) {
  const monday = mondayKey();
  const rows = (ui.ranking || []).filter(r => all || isRival(r.user_id)).map(r => (r.user_id === (cloud.user && cloud.user.id)
    ? { ...r, name: S.name, color: S.color, photo: S.photo, look: Object.assign({}, S.look, { items: wearing() }), level: levelOf(totalXP()), xp: totalXP(), week: monday, week_xp: weekXP(), streak: activeStreak(), chests_week: chestsThisWeek(), me: true }
    : { ...r, week_xp: r.week === monday ? r.week_xp : 0, chests_week: r.week === monday ? r.chests_week : 0 }));
  const score = r => (tab === 'week' ? r.week_xp : r.xp);
  return rows.sort((a, b) => score(b) - score(a) || b.streak - a.streak);
}
function applyRemote(remote) {
  if (isTyping()) { cloud.queued = remote; return; }
  S = migrate(remote); storage.set(STORAGE.state, S); render();
}
/** Trae lo de la nube: gana la versión más reciente. */
async function pull() {
  if (!cloud.user || cloud.pending) return;
  const { data, error } = await cloud.client.from('saves').select('state').eq('user_id', cloud.user.id).maybeSingle();
  if (error) { setSync('error'); return; }
  if (!data) { schedulePush(0); return; }
  if (stamp(data.state) > stamp(S)) applyRemote(data.state);
  else if (stamp(S) > stamp(data.state)) { schedulePush(0); return; }
  setSync('cloud');
}
function listenRemote() {
  if (cloud.channel) cloud.client.removeChannel(cloud.channel);
  cloud.channel = cloud.client.channel('saves-' + cloud.user.id)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'saves', filter: `user_id=eq.${cloud.user.id}` }, payload => {
      const remote = payload.new && payload.new.state;
      if (remote && !cloud.pending && stamp(remote) > stamp(S)) applyRemote(remote);
    })
    .subscribe();
}
/** Al entrar con la cuenta: junta lo de este dispositivo con lo de la nube, sin perder nada. */
async function mergeWithCloud() {
  const { data, error } = await cloud.client.from('saves').select('state').eq('user_id', cloud.user.id).maybeSingle();
  if (error) { setSync('error'); return; }
  // Un dispositivo sin estrenar (sin bienvenida hecha) no aporta nada: se queda tal cual la cuenta
  if (data && data.state) { S = stamp(S) && S.onboarded ? mergeProgress(migrate(data.state), S) : migrate(data.state); render(); }
  persist();
}
async function startSync(user, { fresh = false } = {}) {
  cloud.user = user;
  ui.account = false;
  render();
  if (fresh) await mergeWithCloud(); else await pull();
  listenRemote();
  listenRanking();
  listenFeed(); loadFeed();
  listenDuels(); loadDuels();
  listenVouchers(); loadVouchers();
  useShields();
  listenNudges();
  publishProfile();
  loadRanking();
  loadNudges();
  loadIdeas();
  checkAvatar();
}
function stopSync() {
  if (cloud.channel) cloud.client.removeChannel(cloud.channel);
  if (cloud.rankChannel) cloud.client.removeChannel(cloud.rankChannel);
  if (cloud.nudgeChannel) cloud.client.removeChannel(cloud.nudgeChannel);
  Object.assign(cloud, { user: null, channel: null, rankChannel: null, nudgeChannel: null, pending: false });
  Object.assign(ui, { ranking: null, rankingState: 'idle' });
  setSync('signedout');
}
async function initCloud() {
  if (!CONFIG.supabaseUrl || !CONFIG.supabaseKey || !window.supabase) { setSync('off'); return; }
  cloud.client = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey, { auth: { persistSession: true, autoRefreshToken: true } });
  const { data } = await cloud.client.auth.getSession();
  if (data.session) startSync(data.session.user);
  else setSync('signedout');
  cloud.client.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session && (!cloud.user || cloud.user.id !== session.user.id)) startSync(session.user, { fresh: true });
    if (event === 'SIGNED_OUT') stopSync();
  });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { pull(); loadRanking(); checkAvatar(); } });
  window.addEventListener('online', () => pull());
}
document.addEventListener('focusout', () => setTimeout(() => {
  if (cloud.queued && !isTyping()) { const r = cloud.queued; cloud.queued = null; applyRemote(r); }
}, 50));

/** Única puerta para cambiar datos: aplica el cambio, guarda, repinta y premia. */
function update(change, { reward = true } = {}) {
  const before = totalXP(), readyBefore = chestReady(), levelsBefore = clearedLevels(), weekBefore = weekXP();
  change(S);
  announceProgress(levelsBefore, before);
  checkOvertakes(weekBefore, weekXP());
  persist();
  render();
  if (!readyBefore && chestReady()) setTimeout(() => toast('¡Cofre del día listo! Ábrelo en Inicio'), reward ? 2000 : 0);
  if (!reward) return;
  const after = totalXP();
  if (after > before) toast(`+${after - before} XP`);
  if (levelOf(after) > levelOf(before)) setTimeout(() => showLevelUp(levelOf(after)), 500);
}
const saveDraft = () => storage.set(STORAGE.draft, ui.draft);

/* =========================================================
   7. Vistas
   ========================================================= */
const html = (strings, ...vals) => strings.reduce((out, s, i) => out + s + (i < vals.length ? (Array.isArray(vals[i]) ? vals[i].join('') : vals[i] ?? '') : ''), '');
const when = (cond, a, b = '') => (cond ? a : b);
const confirmBtn = (action, id, label, attrs = '') =>
  `<button class="del ${ui.armed === id ? 'arm' : ''}" data-act="${action}" data-id="${id}" ${attrs}>${ui.armed === id ? '¿Seguro?' : label}</button>`;
const bar = (p, cls = 'bar') => `<div class="${cls}"><i style="width:${p * 100}%"></i></div>`;

function viewTop() {
  const d = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });
  return html`<header class="top"><button class="avatar ${!S.photo && S.avatarUrl && !S.avatarOff ? 'ill' : ''}" data-act="open" data-id="profile" aria-label="Tu perfil"><img src="${S.photo || (S.avatarUrl && !S.avatarOff ? esc(S.avatarUrl) : Character.face(S.look))}" alt="" class="${S.photo ? 'photo' : ''}"></button>${pendingIdeas() ? `<button class="idea-badge num" data-act="open" data-id="ideas" aria-label="${pendingIdeas()} ideas nuevas en el buzón">${pendingIdeas()}</button>` : ''}
    <div class="hello"><b>Hola, ${esc(S.name)}</b><span>${esc(d[0].toUpperCase() + d.slice(1))}</span></div>
    <button class="sync" id="sync" data-s="${ui.sync}" title="${SYNC_LABEL[ui.sync]}" aria-label="${SYNC_LABEL[ui.sync]}" data-act="syncInfo"><i></i></button></header>`;
}
function viewAccount() {
  if (!ui.account) return '';
  if (ui.sync === 'off') return html`<section class="panel nofold"><h3>Sincronización</h3><p class="hint">Falta configurar Supabase. Mientras tanto, todo se guarda en este dispositivo.</p></section>`;
  if (cloud.user) return html`<section class="panel nofold"><h3>Tu cuenta <button class="btn ghost" data-act="toggleAccount">Cerrar</button></h3>
    <p class="hint">Conectado como <b>${esc(cloud.user.email || '')}</b>. ${SYNC_LABEL[ui.sync]}.</p>${ui.syncErr ? `<p class="hint err">Detalle del error: ${esc(ui.syncErr)}</p><button class="btn" data-act="retrySync">Reintentar ahora</button>` : ''}
    <button class="btn" data-act="open" data-id="profile">Editar perfil y personaje</button>
    <div class="edit-row"><button class="btn" data-act="syncNow">Sincronizar ahora</button><button class="btn danger" data-act="signOut">Cerrar sesión</button></div></section>`;
  return html`<section class="panel nofold"><h3>Tu cuenta <button class="btn ghost" data-act="toggleAccount">Cerrar</button></h3>
    <p class="hint">Sirve para guardar tu progreso, usarlo en el móvil y en el PC, y competir en el ranking.</p>
    <form class="stack-s" data-form="signIn">
      <label class="fld"><span>Email</span><input name="email" type="email" autocomplete="email" required></label>
      <label class="fld"><span>Contraseña</span><input name="password" type="password" autocomplete="current-password" minlength="6" required></label>
      <div class="edit-row"><button class="btn primary">Entrar</button><button type="button" class="btn" data-act="signUp">Crear cuenta</button></div>
      ${ui.authMsg ? `<p class="auth-msg ${ui.authMsg.ok ? 'ok' : ''}">${esc(ui.authMsg.text)}</p>` : ''}
    </form>
    <p class="hint">¿Primera vez? Pon tu email y una contraseña nueva y dale a Crear cuenta. Si ya tienes, dale a Entrar.</p></section>`;
}
function viewAxis(state, look = S.look) {
  if (look === S.look && S.avatarUrl && !S.avatarOff) return `<div class="char ill mood-${state}" aria-hidden="true"><img src="${esc(S.avatarUrl)}" alt=""></div>`;
  const src = Character.image(look, { items: wearing(), mood: state });
  return `<div class="char mood-${state}" aria-hidden="true"><img src="${src}" alt="">${state === 'tired' ? '<span class="zzz">z<b>z</b></span>' : ''}</div>`;
}
const heroStyle = () => { const bg = colorHex(S.color), ink = inkFor(bg); return `style="--hero-bg:${bg};--hero-ink:${ink}" data-ink="${ink === '#111111' ? 'dark' : 'light'}"`; };
const coinBadge = (n, count) => `<span class="coins num"><img src="${IMG.coin}" alt=""><span ${count ? `data-count="${count}"` : ''}>${n}</span></span>`;
const PLAYER_COLORS = ['#C7B5FF', '#FFB547', '#8C9EFF', '#C5E86C', '#FF8AD0', '#E5483C', '#7FD8C9', '#1F1F24'];
/** Muestras de color más un selector libre para cualquier color. */
const viewColorPicker = (current, act, field = '') => {
  const cur = colorHex(current), custom = !PLAYER_COLORS.some(c => c.toLowerCase() === cur.toLowerCase());
  return `<div class="swatches" role="radiogroup" aria-label="Color">${PLAYER_COLORS.map(k =>
    `<button type="button" data-act="${act}" data-k="${k}" ${field ? `data-f="${field}"` : ''} aria-pressed="${k.toLowerCase() === cur.toLowerCase()}" aria-label="Color ${k}" style="background:${k}"></button>`).join('')}
    <label class="swatch-custom ${custom ? 'on' : ''}" title="Elegir otro color" style="${custom ? `background:${cur}` : ''}"><input type="color" value="${cur}" data-color-act="${act}" ${field ? `data-f="${field}"` : ''} aria-label="Otro color"><span>+</span></label></div>`;
};
function avatar(r) {
  const bg = colorHex(r.color);
  if (r.photo) return `<span class="ava" style="background:${bg}"><img src="${esc(r.photo)}" alt=""></span>`;
  if (r.look && r.look.avatar) return `<span class="ava ill" style="background:${bg}"><img src="${esc(r.look.avatar)}" alt=""></span>`;
  if (r.look) return `<span class="ava pix" style="background:${bg}"><img src="${Character.face(r.look)}" alt=""></span>`;
  return `<span class="ava" style="background:${bg};color:${inkFor(bg)}">${esc((r.name || '?').trim().charAt(0).toUpperCase() || '?')}</span>`;
}

function viewOnboarding() {
  const starters = [
    { id: 'fisico', title: '💪 Físico', sub: 'Peso, entrenos y rutinas con progresión' },
    { id: 'carnet', title: '🚗 Carnet de conducir', sub: 'Del papeleo al examen práctico' },
    ...TEMPLATES.map(t => ({ id: t.key, title: `${t.emoji} ${t.name}`, sub: t.sub })),
  ];
  return html`<section class="hero onb-hero" ${heroStyle()}>${viewAxis('happy')}
    <div class="hero-txt"><h1>Modo Campaña</h1>
      <p class="onb-lead">Tus objetivos como un videojuego. Sube de nivel, abre cofres y compite con tus amigos.</p></div></section>
    <form class="panel onb" data-form="onboard">
      <label class="fld"><span>¿Cómo te llamas?</span><input name="n" maxlength="24" required autocomplete="given-name" placeholder="Tu nombre"></label>
      <div class="fld"><span>Tu color</span>${viewColorPicker(S.color, 'setProfileColor')}</div>
      <div class="fld"><span>¿Con qué empiezas?</span><div class="starters">${starters.map(c =>
        `<button type="button" class="starter ${ui.onboardCamps[c.id] ? 'on' : ''}" data-act="toggleStarter" data-k="${c.id}" aria-pressed="${!!ui.onboardCamps[c.id]}"><span class="check">${GLYPH.check}</span><span><b>${c.title}</b><small>${c.sub}</small></span></button>`)}</div>
        <p class="hint">Luego puedes crear tus propias campañas. Después te harás tu personaje.</p></div>
      <button class="btn primary wide">Empezar</button>
    </form>
    ${when(ui.sync !== 'off', '<p class="hint center">¿Ya tienes cuenta? <button class="linkbtn" data-act="syncInfo">Entra aquí</button></p>')}`;
}
function viewLookRow(label, field, options, current, custom = true) {
  const cur = String(current || '');
  return `<div class="look-row"><span class="label">${label}</span><div class="swatches">${options.map(v =>
    `<button type="button" data-act="setLook" data-f="${field}" data-v="${v}" aria-pressed="${cur.toLowerCase() === v.toLowerCase()}" aria-label="${label} ${v}" style="background:${v}"></button>`).join('')}
    ${custom ? `<label class="swatch-custom ${cur && !options.some(o => o.toLowerCase() === cur.toLowerCase()) ? 'on' : ''}" title="Otro color" style="${cur && !options.some(o => o.toLowerCase() === cur.toLowerCase()) ? `background:${cur}` : ''}"><input type="color" value="${cur || '#888888'}" data-color-act="setLook" data-f="${field}" aria-label="Otro color de ${label.toLowerCase()}"><span>+</span></label>` : ''}</div></div>`;
}
const chipsRow = (label, field, map, current) => `<div class="look-row"><span class="label">${label}</span><div class="chips">${Object.entries(map).map(([v, t]) => chip(field, v, t, current)).join('')}</div></div>`;
const yesNo = (label, field, current, yes = 'Sí', no = 'No') => `<div class="look-row"><span class="label">${label}</span><div class="chips">${chip(field, true, yes, !!current)}${chip(field, false, no, !!current)}</div></div>`;
const LOOK_TABS = { cara: 'Cara', pelo: 'Pelo', ropa: 'Ropa', extras: 'Extras' };
function viewLookControls(L) {
  const C = Character.COLORS, T = Character.STYLES;
  switch (ui.lookTab) {
    case 'pelo': return [
      chipsRow('Peinado', 'hairStyle', T.hairStyle, L.hairStyle),
      viewLookRow('Color', 'hair', C.hair, L.hair),
      `<div class="look-row"><span class="label">Puntas de otro color</span><div class="chips">${chip('hair2', 'null', 'No', L.hair2 === null ? 'null' : '')}</div></div>`,
      viewLookRow('Color de las puntas', 'hair2', C.hair, L.hair2 || ''),
      yesNo('Flequillo', 'bangs', L.bangs), yesNo('Trencitas en la cara', 'braids', L.braids),
    ].join('');
    case 'ropa': return [
      chipsRow('Arriba', 'top', T.top, L.top), viewLookRow('Color', 'topColor', C.cloth, L.topColor),
      when(['capas', 'camisa', 'chaqueta'].includes(L.top), viewLookRow(L.top === 'capas' ? 'Manga de debajo' : 'Camiseta de dentro', 'top2', C.cloth, L.top2)),
      chipsRow('Estampado', 'pattern', T.pattern, L.pattern), when(L.pattern !== 'liso', viewLookRow('Color del estampado', 'stripe', C.cloth, L.stripe)),
      chipsRow('Abajo', 'bottom', T.bottom, L.bottom), viewLookRow('Color', 'bottomColor', C.bottom, L.bottomColor),
      when(L.bottom === 'chandal', viewLookRow('Color de la raya', 'stripe', C.cloth, L.stripe)),
      when(L.bottom === 'corto' || L.bottom === 'falda', chipsRow('Piernas', 'legs', T.legs, L.legs) + when(L.legs !== 'piel', viewLookRow('Color de las medias', 'legsColor', C.legs, L.legsColor))),
      chipsRow('Calzado', 'shoes', T.shoes, L.shoes), viewLookRow('Color', 'shoesColor', C.shoes, L.shoesColor),
    ].join('');
    case 'extras': return [
      chipsRow('Cabeza', 'head', T.head, L.head), when(L.head !== 'no', viewLookRow('Color', 'headColor', C.head, L.headColor)),
      chipsRow('Bolsa', 'bag', T.bag, L.bag), when(L.bag === 'bolso' || L.bag === 'rinonera', viewLookRow('Color', 'bagColor', C.cloth, L.bagColor)),
      yesNo('Collar', 'necklace', L.necklace), yesNo('Cadena', 'chain', L.chain), yesNo('Pendientes', 'earrings', L.earrings),
    ].join('');
    default: return [
      viewLookRow('Piel', 'skin', C.skin, L.skin), viewLookRow('Ojos', 'eyes', C.eyes, L.eyes),
      chipsRow('Gafas', 'glasses', T.glasses, L.glasses), chipsRow('Barba', 'beard', T.beard, L.beard),
      yesNo('Pecas', 'freckles', L.freckles), yesNo('Colorete', 'blush', L.blush),
    ].join('');
  }
}
const chip = (field, value, label, current) => {
  const lock = unlockState(field + ':' + value);
  if (!lock.ok) return `<button type="button" class="chip-btn locked" data-act="lockedLook" data-k="${field}:${value}" title="${esc(lock.how)}">${GLYPH.lock}${label} <small>${esc(lock.short)}</small></button>`;
  return `<button type="button" class="chip-btn ${Character.PREMIUM[field + ':' + value] ? 'special' : ''}" data-act="setLook" data-f="${field}" data-v="${value}" aria-pressed="${String(current) === String(value)}">${label}</button>`;
};
/* ---------- Personaje ilustrado: se pide desde aquí y lo genera el ordenador de Pau ---------- */
const AVATAR_COST = 40;
const avatarCost = () => (S.purchases.some(p => p.avatar) ? AVATAR_COST : 0);   // el primero es gratis
const COLOR_NAMES = [['black', 20, 20, 22], ['charcoal grey', 60, 58, 62], ['grey', 140, 138, 140], ['light grey', 205, 203, 200], ['white', 245, 243, 238], ['cream', 236, 226, 205], ['beige', 201, 188, 164],
  ['brown', 110, 70, 45], ['dark brown', 60, 36, 24], ['light brown', 160, 115, 75], ['blonde', 210, 170, 100], ['platinum blonde', 232, 220, 192], ['red', 200, 50, 45], ['ginger', 184, 67, 44], ['burgundy', 110, 30, 40],
  ['orange', 230, 130, 40], ['yellow', 242, 193, 78], ['olive green', 74, 90, 58], ['green', 63, 140, 71], ['mint green', 150, 220, 180], ['neon green', 63, 224, 160], ['teal', 40, 130, 130], ['light blue', 140, 175, 215],
  ['blue', 60, 100, 200], ['navy blue', 34, 56, 94], ['denim blue', 70, 95, 140], ['purple', 120, 80, 180], ['lavender', 170, 140, 240], ['pink', 229, 138, 176], ['hot pink', 240, 70, 150], ['gold', 232, 184, 74]];
function colorName(hex) {
  const h = String(hex || '').replace('#', ''); if (h.length < 6) return '';
  const [r, g, b] = [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16));
  return COLOR_NAMES.reduce((best, c) => { const d = (c[1] - r) ** 2 + (c[2] - g) ** 2 + (c[3] - b) ** 2; return d < best.d ? { d, n: c[0] } : best; }, { d: 1e9, n: '' }).n;
}
function skinName(hex) {
  const h = String(hex || '#F1C8A5').replace('#', ''), l = [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)).reduce((a, v) => a + v, 0) / 3;
  return l > 215 ? 'very fair' : l > 190 ? 'fair' : l > 165 ? 'light tan' : l > 135 ? 'tan' : l > 100 ? 'brown' : 'dark brown';
}
const P_HAIR = { corto: 'short neat hair', revuelto: 'messy tousled hair', rapado: 'a buzz cut', melena: 'a chin length bob haircut', largo: 'long straight hair', mono: 'hair in a high bun', coletas: 'two high pigtails', trenzas: 'two long braids', rizos: 'short curly hair', afro: 'a big round afro', cresta: 'a spiky mohawk' };
const P_GLASSES = { finas: 'thin round glasses', pasta: 'thick black rectangular glasses', sol: 'black sunglasses', estrella: 'star shaped sunglasses', corazon: 'heart shaped sunglasses', vr: 'a futuristic visor' };
const P_HEAD = { gorra: 'baseball cap', gorro: 'knitted beanie', bucket: 'bucket hat', bandana: 'bandana', horquillas: 'hair clips', gato: 'beanie with cat ears', corona: 'small golden crown', vikingo: 'viking helmet with horns', halo: 'golden halo floating above the head' };
const P_TOP = { camiseta: 'oversized t-shirt', sudadera: 'oversized hoodie', jersey: 'oversized knit sweater', capas: 'oversized t-shirt layered over a long sleeve shirt', camisa: 'open oversized shirt over a t-shirt', chaqueta: 'oversized open bomber jacket over a t-shirt' };
const P_BOTTOM = { cargo: 'baggy cargo pants', vaqueros: 'baggy wide leg jeans', chandal: 'baggy track pants with side stripes', corto: 'loose shorts', falda: 'pleated mini skirt' };
const P_LEGS = { medias: 'tights', rejilla: 'fishnet tights', rayas: 'striped tights' };
const P_SHOES = { bambas: 'chunky sneakers', altas: 'high top sneakers', botas: 'chunky boots', plataformas: 'platform shoes', doradas: 'shiny golden sneakers', neon: 'neon green sneakers' };
const P_BAG = { bolso: 'crossbody bag', mochila: 'backpack', rinonera: 'fanny pack worn across the chest', capa: 'cape', guitarra: 'guitar on the back', alas: 'small white angel wings on the back' };
const P_ITEM = { llavero: 'keychain hanging from the belt', botella: 'holding a water bottle', auriculares: 'headphones around the neck', movil: 'holding a phone', mancuerna: 'holding a dumbbell', handycam: 'holding a small camcorder', skate: 'holding a skateboard', chestOpen: 'a small golden treasure chest at the feet',
  raqueta: 'holding a tennis racket', pesarusa: 'holding a kettlebell', cafe: 'holding a coffee cup', libro: 'holding a book', microfono: 'holding a microphone', helado: 'holding an ice cream', perro: 'a small cute dog at the feet', gatito: 'a small cute cat at the feet', balon: 'a ball at the feet', toalla: 'a towel over the shoulder' };
const P_WHO = { chica: 'girl', chico: 'boy', neutro: 'young person' };
/** Traduce el personaje del editor a la descripción que entiende el generador. */
function lookToPrompt(look, items) {
  const L = Character.upgrade(look), c = colorName, parts = [P_WHO[L.gen] || 'young person', `${skinName(L.skin)} skin`];
  if (L.eyes) parts.push(`${c(L.eyes)} eyes`);
  parts.push(`${c(L.hair)} ${P_HAIR[L.hairStyle] || 'short hair'}${L.hair2 ? ` with ${c(L.hair2)} tips` : ''}${L.bangs ? ' with bangs' : ''}`);
  if (L.freckles) parts.push('freckles');
  if (L.beard && L.beard !== 'no') parts.push(L.beard === 'bigote' ? 'a mustache' : 'a short beard');
  if (L.glasses && L.glasses !== 'no') parts.push(P_GLASSES[L.glasses]);
  if (L.head && L.head !== 'no') parts.push(['corona', 'halo'].includes(L.head) ? P_HEAD[L.head] : `${c(L.headColor)} ${P_HEAD[L.head]}`);
  const PAT = { rayas: `${c(L.stripe)} stripes`, cuadros: `a ${c(L.stripe)} plaid pattern`, franja: `a ${c(L.stripe)} chest stripe`, llamas: 'a flame print', camuflaje: 'a camo print', galaxia: 'a galaxy print', arcoiris: 'a rainbow print' };
  let top = `${c(L.topColor)} ${P_TOP[L.top] || 'oversized t-shirt'}${L.pattern && L.pattern !== 'liso' && PAT[L.pattern] ? ` with ${PAT[L.pattern]}` : ''}`;
  if (['capas', 'camisa', 'chaqueta'].includes(L.top)) top += ` (the inner layer is ${c(L.top2)})`;
  parts.push(top);
  parts.push(`${c(L.bottomColor)} ${P_BOTTOM[L.bottom] || 'baggy pants'}${L.bottom === 'chandal' ? ` with ${c(L.stripe)} stripes` : ''}`);
  if ((L.bottom === 'corto' || L.bottom === 'falda') && L.legs && L.legs !== 'piel') parts.push(`${c(L.legsColor)} ${P_LEGS[L.legs]}`);
  parts.push(['doradas', 'neon'].includes(L.shoes) ? P_SHOES[L.shoes] : `${c(L.shoesColor)} ${P_SHOES[L.shoes] || 'chunky sneakers'}`);
  if (L.bag && L.bag !== 'no') parts.push(['capa', 'alas', 'guitarra'].includes(L.bag) ? P_BAG[L.bag] : `${c(L.bagColor)} ${P_BAG[L.bag]}`);
  if (L.necklace) parts.push('a pendant necklace');
  if (L.chain) parts.push('a silver chain on the pants');
  if (L.earrings) parts.push('silver earrings');
  (items || []).forEach(k => { if (P_ITEM[k]) parts.push(P_ITEM[k]); });
  return parts.filter(Boolean).join(', ');
}
const AVATAR_STATUS = { pendiente: '⏳ En cola', generando: '🎨 Generándose ahora', listo: '✅ Listo', error: '⚠️ No se pudo generar' };
function viewAvatarPanel() {
  const r = S.avatarReq, cost = avatarCost(), waiting = r && (r.status === 'pendiente' || r.status === 'generando');
  const who = Character.upgrade(S.look).gen || '';
  return html`<section class="panel avatar-panel"><h3>Personaje ilustrado</h3>
    <p class="hint">Con lo que eliges arriba (ropa, colores, objetos que llevas puestos) se dibuja tu personaje en 3D. <b>No es al momento</b>: se genera en el ordenador de Pau y te llega un aviso cuando esté, normalmente en unas horas.</p>
    <div class="look-row"><span class="label">Eres</span><div class="chips">${Object.entries({ chica: 'Chica', chico: 'Chico', neutro: 'Prefiero no decir' }).map(([k, t]) => `<button type="button" class="chip-btn" data-act="setLook" data-f="gen" data-v="${k}" aria-pressed="${who === k}">${t}</button>`).join('')}</div></div>
    ${r ? `<p class="avatar-status st-${esc(r.status)}">${AVATAR_STATUS[r.status] || r.status}${r.status === 'error' ? ' · te hemos devuelto las monedas' : ''}</p>` : ''}
    ${waiting ? '<p class="hint">Cuando esté listo te avisamos. Si cambias algo ahora, tendrás que pedirlo otra vez.</p>'
      : `<button class="btn primary wide" data-act="buyAvatar" ${!cloud.user ? 'disabled' : ''}>${ui.armed === 'buy:avatar' ? (cost ? `¿Gastar ${cost} monedas?` : '¿Pedirlo ahora?') : (S.avatarUrl ? 'Pedir personaje nuevo' : 'Crear mi personaje')} · ${cost ? `${cost} monedas` : 'gratis'}</button>`}
    ${!cloud.user ? '<p class="hint">Necesitas cuenta para pedirlo.</p>' : ''}
    ${S.avatarUrl ? '<div class="edit-row"><button class="btn ghost" data-act="toggleAvatar">' + (S.avatarOff ? 'Usar el ilustrado' : 'Volver al pixel art') + '</button></div>' : ''}</section>`;
}
let avatarTimer = null;
/** Mira cómo va tu último pedido; si está listo se pone solo, si falló se devuelven las monedas. */
async function checkAvatar() {
  clearTimeout(avatarTimer);
  if (!cloud.user || ui.avatarTable === false) return;
  const { data, error } = await cloud.client.from('avatar_requests').select('id,status,image_url,cost,error').eq('user_id', cloud.user.id).order('id', { ascending: false }).limit(1);
  if (error) { if (missingTable(error)) ui.avatarTable = false; return; }
  const r = data && data[0]; if (!r) return;
  const prev = S.avatarReq || {}, changed = prev.id !== r.id || prev.status !== r.status;
  if (r.status === 'listo' && r.image_url && S.avatarUrl !== r.image_url) {
    update(s => { s.avatarUrl = r.image_url; s.avatarOff = false; s.avatarReq = { id: r.id, status: r.status }; }, { reward: false });
    toast('🎨 ¡Tu personaje ilustrado ya está listo!'); return;
  }
  if (r.status === 'error' && r.cost && !S.avatarRefunds.includes(r.id)) {
    update(s => { s.avatarRefunds.push(r.id); s.coinLog.push({ id: uid(), d: today(), amount: r.cost, note: 'Devolución: personaje no generado' }); s.avatarReq = { id: r.id, status: r.status }; }, { reward: false });
  } else if (changed) { S.avatarReq = { id: r.id, status: r.status }; render(); }
  if (r.status === 'pendiente' || r.status === 'generando') avatarTimer = setTimeout(checkAvatar, 120000);
}
function viewProfile() {
  const L = Character.upgrade(S.look), xp = totalXP();
  return html`<section class="c-hero profile-hero" ${heroStyle()}>
    <div class="me-row"><span class="big-ava ${!S.photo && S.avatarUrl && !S.avatarOff ? 'ill' : ''}">${S.photo ? `<img src="${S.photo}" alt="Tu foto">` : S.avatarUrl && !S.avatarOff ? `<img src="${esc(S.avatarUrl)}" alt="">` : `<img class="pix" src="${Character.face(L)}" alt="">`}</span>
      <div><h2>${esc(S.name || 'Tu perfil')}</h2><p>Nivel ${levelOf(xp)} · ${rankFor(levelOf(xp))}</p></div></div>
    <div class="edit-row"><label class="btn dark file-btn">${S.photo ? 'Cambiar foto' : 'Subir foto'}<input type="file" accept="image/*" data-photo hidden></label>
      ${when(S.photo, '<button class="btn on-color" data-act="removePhoto">Quitar foto</button>')}</div></section>
    <section class="panel"><h3>Tú</h3>
      <form class="inrow" data-form="saveProfile"><input name="n" maxlength="24" required value="${esc(S.name)}" aria-label="Tu nombre"><button class="btn">Guardar nombre</button></form>
      <div class="fld"><span>Tu color: pinta tu tarjeta y tu sitio en el ranking</span>${viewColorPicker(S.color, 'setProfileColor')}</div></section>
    <section class="panel"><h3>Tu personaje <button class="btn ghost" data-act="randomLook">Aleatorio</button></h3>
      <div class="look-tabs" role="tablist">${Object.entries(LOOK_TABS).map(([k, t]) => `<button role="tab" data-act="lookTab" data-k="${k}" aria-selected="${ui.lookTab === k}">${t}</button>`).join('')}</div>
      <div class="look-editor"><div class="look-preview" style="background:${colorHex(S.color)}">${viewAxis('happy')}</div>
        <div class="look-controls">${viewLookControls(L)}</div></div>
      <p class="hint">Lo que desbloqueas en el inventario (cascos, llavero, handycam, skate) se lo pone tu personaje.</p></section>
    ${viewAvatarPanel()}
    <button class="teaser idea-teaser" data-act="open" data-id="ideas"><span class="teaser-ico">${GLYPH.star || '+'}</span><span class="txt"><b>Buzón de ideas</b><small>¿Echas algo en falta? Una campaña, un deporte, algo de la app…</small></span><span class="go">${GLYPH.chev}</span></button>
${viewPushPanel()}
    <section class="panel"><h3>Cuenta</h3>
      ${cloud.user ? html`<p class="hint">Conectado como <b>${esc(cloud.user.email || '')}</b>. ${SYNC_LABEL[ui.sync]}.</p>
        <div class="edit-row"><button class="btn danger" data-act="signOut">Cerrar sesión</button></div>
        ${when(!ui.profileExtras, '<p class="hint">Para que los demás vean tu foto y tu personaje en el ranking, falta ejecutar <b>supabase-perfil.sql</b> en Supabase.</p>')}`
        : ui.sync === 'off' ? '<p class="hint">Sin conexión con Supabase: todo se guarda en este dispositivo.</p>'
        : '<p class="hint">Crea una cuenta para guardar tu progreso, usarlo en varios dispositivos y salir en el ranking.</p><button class="btn primary" data-act="syncInfo">Crear cuenta o entrar</button>'}</section>`;
}
// ---------- Instalar la app en la pantalla de inicio ----------
let installPrompt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installPrompt = e; if (S.onboarded) render(); });
window.addEventListener('appinstalled', () => { installPrompt = null; toast('📲 ¡App instalada! Ábrela desde el icono'); render(); });
const isMobile = () => /Android|iPhone|iPad|iPod/.test(navigator.userAgent);
const installHidden = () => { try { return localStorage.getItem('modo-campana-instalar') === 'no'; } catch (e) { return false; } };
function viewInstallSteps() {
  if (isIOS()) return html`<ol class="steps"><li>Abre la app en <b>Safari</b> (en otros navegadores de iPhone no sale la opción).</li>
    <li>Toca el botón <b>Compartir</b> <span class="kbd">⬆︎</span>, el cuadrado con la flecha hacia arriba, abajo en el centro.</li>
    <li>Baja y elige <b>Añadir a pantalla de inicio</b>.</li><li>Dale a <b>Añadir</b> y abre la app desde el icono del cofre.</li></ol>`;
  const btn = installPrompt ? '<button class="btn primary wide" data-act="installApp">📲 Instalar la app</button>' : '';
  if (!isMobile()) return html`${btn}<ol class="steps"><li>En <b>Chrome</b> o <b>Edge</b>, busca el icono de instalar <span class="kbd">⊕</span> a la derecha de la barra de direcciones.</li><li>Dale a <b>Instalar</b>. Se abrirá en su propia ventana, como un programa.</li></ol>`;
  return html`${btn}<p class="hint">${btn ? 'Si el botón no funciona, hazlo a mano:' : 'En Android:'}</p>
    <ol class="steps"><li><b>Chrome:</b> menú <span class="kbd">⋮</span> arriba a la derecha → <b>Instalar aplicación</b> o <b>Añadir a pantalla de inicio</b>.</li>
    <li><b>Samsung Internet:</b> menú <span class="kbd">≡</span> abajo a la derecha → <b>Añadir página a</b> → <b>Pantalla de inicio</b>.</li>
    <li>Ábrela desde el icono del cofre.</li></ol>`;
}
function viewInstallCard() {
  if (isStandalone() || installHidden() || !S.onboarded || (!isMobile() && !installPrompt)) return '';
  return html`<section class="panel install-card nofold"><h3>📲 Ponla en tu pantalla de inicio</h3>
    <p class="hint">Así se abre como una app, a pantalla completa, y te pueden llegar los avisos.</p>
    ${viewInstallSteps()}<button class="btn ghost" data-act="hideInstall">Ahora no</button></section>`;
}
function viewPushPanel() {
  const on = !!avisos.endpoint && (!('Notification' in window) || Notification.permission === 'granted');
  let body;
  if (!cloud.user) body = '<p class="hint">Entra con tu cuenta para recibir avisos en el móvil.</p>';
  else if (isIOS() && !isStandalone()) body = html`<p class="hint">En iPhone los avisos solo funcionan con la app en la pantalla de inicio. Así se hace:</p>${viewInstallSteps()}<p class="hint">Luego ábrela desde el icono y vuelve aquí para activarlos.</p>`;
  else if (!pushSupported()) body = '<p class="hint">Este navegador no permite avisos. Prueba desde la app instalada o con Chrome.</p>';
  else if ('Notification' in window && Notification.permission === 'denied') body = '<p class="hint">Has bloqueado los avisos. Actívalos en los ajustes del móvil (Notificaciones → Modo Campaña) y vuelve aquí.</p>';
  else if (!on) body = '<p class="hint">Te aviso si se te olvidan las misiones del día, si te pasan en la liga o si te retan. Tú eliges cuáles.</p><button class="btn primary wide" data-act="pushOn">🔔 Activar avisos en este móvil</button>';
  else body = html`<div class="push-hours"><label class="fld"><span>Primer recordatorio</span><select data-act-change="pushHour2"><option value="" ${avisos.hour2 == null ? 'selected' : ''}>Ninguno</option>${Array.from({ length: 16 }, (_, i) => i + 8).map(h => `<option value="${h}" ${avisos.hour2 === h ? 'selected' : ''}>${h}:00</option>`)}</select></label>
    <label class="fld"><span>Segundo recordatorio</span><select data-act-change="pushHour">${Array.from({ length: 16 }, (_, i) => i + 8).map(h => `<option value="${h}" ${avisos.hour === h ? 'selected' : ''}>${h}:00</option>`)}</select></label></div>
    <span class="label">Quiero que me avises de</span><div class="chips">${Object.entries(PUSH_KINDS).map(([k, t]) => `<button class="chip-btn" data-act="pushKind" data-k="${k}" aria-pressed="${avisos.kinds.includes(k)}">${t}</button>`).join('')}</div>
    <p class="hint">Como mucho dos al día, y solo si aún no has hecho las misiones de ese día. ${S.rivals.length ? 'Los avisos de la liga, la caña y las reacciones solo llegan de tus rivales.' : ''}</p>
    <div class="edit-row"><button class="btn" data-act="pushTest">Probar aviso</button><button class="btn ghost" data-act="pushOff">Desactivar</button></div>`;
  return html`<section class="panel push-panel"><h3>Avisos <span class="label">${on ? '🔔 activados' : 'desactivados'}</span></h3>${body}</section>`;
}
function viewIdeas() {
  const kinds = Object.entries(IDEA_KINDS).map(([k, t]) => `<button type="button" class="chip-btn" data-act="ideaKind" data-k="${k}" aria-pressed="${ui.ideaKind === k}">${t}</button>`).join('');
  const hero = html`<section class="c-hero idea-hero"><span class="pill">${GLYPH.star || ''}Buzón de ideas</span><h2>¿Qué le falta a la app?</h2>
    <p>Pide una campaña distinta, un deporte que no sale o cualquier cosa que te motivaría más. ${ui.isAdmin ? 'Tú decides qué entra.' : 'Pau lo revisa y te dice si entra.'}</p></section>`;
  if (!cloud.user) return hero + '<section class="panel"><p class="hint">Entra con tu cuenta para mandar ideas.</p><button class="btn primary" data-act="syncInfo">Crear cuenta o entrar</button></section>';
  if (ui.ideasState === 'missing') return hero + '<section class="panel"><p class="hint">El buzón aún no está activado. Hay que ejecutar <b>supabase-sugerencias.sql</b> en Supabase.</p></section>';
  const list = ui.ideas || [];
  const forClaude = ui.isAdmin ? ideasForClaude() : '';
  const admin = ui.isAdmin ? html`<section class="panel admin-ideas"><h3>Para Claude <span class="label">${list.filter(i => i.status === 'aceptada').length} aceptadas</span></h3>
    ${forClaude ? `<p class="hint">Copia esto y pégalo en el chat con Claude para que lo meta en la app. Luego márcalas como hechas.</p><textarea readonly rows="5" id="for-claude">${esc(forClaude)}</textarea><button class="btn primary" data-act="copyForClaude">Copiar para Claude</button>`
      : '<p class="hint">Cuando aceptes ideas, aquí te saldrá el texto para pasárselo a Claude.</p>'}</section>` : '';
  const item = i => {
    const mine = i.user_id === cloud.user.id, when_ = new Date(i.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    const actions = ui.isAdmin
      ? `<div class="edit-row">${['aceptada', 'rechazada', 'hecha'].filter(st => st !== i.status).map(st => `<button class="btn ${st === 'aceptada' ? 'primary' : st === 'rechazada' ? 'danger' : ''}" data-act="setIdea" data-id="${i.id}" data-k="${st}">${{ aceptada: 'Aceptar', rechazada: 'Descartar', hecha: 'Ya está hecha' }[st]}</button>`).join('')}
         <button class="btn ghost" data-act="replyIdea" data-id="${i.id}">${i.reply ? 'Cambiar nota' : 'Añadir nota'}</button>${confirmBtn('deleteIdea', 'idea' + i.id, 'Borrar')}</div>`
      : (mine && i.status === 'pendiente' ? `<div class="edit-row">${confirmBtn('deleteIdea', 'idea' + i.id, 'Borrar')}</div>` : '');
    return `<li class="idea st-${i.status}"><div class="idea-h"><span class="label">${esc(IDEA_KINDS[i.kind] || i.kind)}</span><span class="idea-st">${IDEA_STATUS[i.status] || i.status}</span></div>
      <p>${esc(i.text)}</p>${i.reply ? `<p class="idea-reply"><b>Respuesta:</b> ${esc(i.reply)}</p>` : ''}<small class="hint">${mine ? 'Tú' : esc(i.name || 'Alguien')} · ${when_}</small>${actions}</li>`;
  };
  return hero + html`<section class="panel"><h3>Mandar una idea</h3>
    <form class="stack-s" data-form="sendIdea"><div class="chips">${kinds}</div>
      <textarea name="t" rows="3" maxlength="600" required placeholder="${{ campana: 'Ej: una campaña para aprender a cocinar', ejercicio: 'Ej: que salga baile como ejercicio', funcion: 'Ej: poder poner recordatorios', otro: 'Cuéntalo como quieras' }[ui.ideaKind]}"></textarea>
      <button class="btn primary">Enviar idea</button></form>
    ${when(ui.ideaKind === 'ejercicio', '<p class="hint">Truco: en tus rutinas ya puedes añadir cualquier ejercicio con su nombre, por repeticiones, peso o tiempo. Si lo que quieres es otra cosa, cuéntalo aquí.</p>')}
    ${when(ui.ideaKind === 'campana', '<p class="hint">Truco: ya puedes crear tus propias campañas con sus niveles y misiones desde Inicio. Si quieres una ya montada para todos, pídela aquí.</p>')}</section>`
    + admin
    + html`<section class="panel"><h3>Ideas de todos <span class="label">${list.length}</span></h3>
      ${ui.ideasState === 'loading' && !list.length ? '<p class="hint">Cargando…</p>' : list.length ? `<ul class="ideas">${list.map(item).join('')}</ul>` : '<p class="hint">Todavía no hay ideas. Sé el primero.</p>'}</section>`;
}
function viewRankTeaser() {
  if (!cloud.user || ui.rankingState !== 'ok') return '';
  const rows = rankedPlayers('week'), pos = rows.findIndex(r => r.me);
  if (pos < 0) return '';
  if (rows.length < 2) return html`<button class="teaser" data-act="open" data-id="ranking"><span class="teaser-ico">${GLYPH.trophy}</span><span class="txt"><b>Tu liga está vacía</b><small>Invita a alguien y competid por la semana</small></span><span class="go">${GLYPH.chev}</span></button>`;
  const ahead = pos > 0 ? rows[pos - 1] : null, me = rows[pos];
  const sub = ahead ? `A ${ahead.week_xp - me.week_xp + 1} XP de pasar a ${esc(ahead.name)}` : `Le sacas ${me.week_xp - rows[1].week_xp} XP a ${esc(rows[1].name)}`;
  return html`<button class="teaser ${pos === 0 ? 'first' : ''}" data-act="open" data-id="ranking"><span class="teaser-pos num">${pos + 1}º</span>
    <span class="txt"><b>Vas ${pos + 1}º de ${rows.length} esta semana</b><small>${sub}</small></span><span class="go">${GLYPH.chev}</span></button>`;
}
/** Ánimo de cualquier jugador: el tuyo se calcula entero; el de los demás, por su racha. */
function playerMood(r) {
  if (r.me) return mood().kind;
  if (r.streak >= 3) return 'fire';
  if (r.streak >= 1) return 'happy';
  return r.xp > 0 ? 'tired' : 'idle';
}
const playerImage = r => (r.look && r.look.avatar) ? r.look.avatar : Character.image(r.look || Character.BASE, { items: (r.look && r.look.items) || [], mood: playerMood(r) });
const MOOD_TEXT = { fire: 'En racha', happy: 'Activo', proud: 'Cofre abierto', tired: 'Lleva días parado', idle: 'Recién llegado' };
/** La plaza: todos los personajes, los tres primeros en el podio y quien está parado, en el banco. */
function viewPlaza(rows) {
  const tab = ui.rankTab, score = r => (tab === 'week' ? r.week_xp : r.xp);
  const podium = rows.slice(0, 3), others = rows.slice(3);
  const blocks = [{ x: 50, h: 24 }, { x: 31, h: 17 }, { x: 69, h: 11 }];
  // Por el suelo, de delante a atrás; quien lleva días parado se sienta en el banco
  const ground = [{ x: 9, b: 1, s: 1 }, { x: 91, b: 1, s: 1 }, { x: 17, b: 21, s: 0.8 }, { x: 40, b: 31, s: 0.66 }, { x: 60, b: 31, s: 0.66 }, { x: 27, b: 34, s: 0.6 }, { x: 8, b: 30, s: 0.66 }, { x: 70, b: 36, s: 0.56 }];
  const bench = [{ x: 76, b: 31, s: 0.7 }, { x: 88, b: 31, s: 0.7 }];
  const active = others.filter(r => playerMood(r) !== 'tired'), tired = others.filter(r => playerMood(r) === 'tired');
  const placed = [...tired.slice(0, bench.length).map((r, i) => [r, bench[i], 'bench']), ...active.slice(0, ground.length).map((r, i) => [r, ground[i], ''])];
  const person = (r, x, b, sc, extra = '') => {
    const m = playerMood(r), bg = colorHex(r.color);
    return `<button class="pl m-${m} ${r.me ? 'me' : ''} ${extra}" style="left:${x}%;bottom:calc(${b}% - 3px);--s:${sc};z-index:${extra.includes('podium') ? 80 : b < 10 ? 70 : Math.round(55 - b)}" data-act="openPlayer" data-id="${esc(r.user_id)}" aria-label="${esc(r.name)}">
      <span class="tag" style="background:${bg};color:${inkFor(bg)}">${esc(r.name)}</span>${extra.includes('first') ? `<img class="crown" src="${Scene.crown()}" alt="">` : ''}
      <img class="pl-img" src="${playerImage(r)}" alt="">${m === 'tired' ? '<span class="zzz">z<b>z</b></span>' : ''}</button>`;
  };
  const hidden = others.length - placed.length;
  return html`<section class="plaza" style="background-image:url(${Scene.plaza()})">
    ${podium.map((r, i) => `<span class="podium p${i + 1}" style="left:${blocks[i].x}%;height:${blocks[i].h}%"><b>${i + 1}</b><small class="num">${score(r)} XP</small></span>`)}
    ${podium.map((r, i) => person(r, blocks[i].x, blocks[i].h, 1, i === 0 ? 'first podium' : 'podium'))}
    ${placed.map(([r, p, extra]) => person(r, p.x, p.b, p.s, extra))}
    ${when(hidden > 0, `<span class="plaza-more">+${hidden}</span>`)}
  </section>`;
}
function viewPlayer() {
  const rows = ui.ranking ? rankedPlayers('week') : [], r = (ui.ranking ? rankedPlayers('week', true) : []).find(x => x.user_id === ui.playerId);
  if (!r) return '<section class="panel"><p class="hint">No encuentro a esta persona. Vuelve al ranking.</p><button class="btn" data-act="open" data-id="ranking">Ir al ranking</button></section>';
  const pos = Math.max(1, rows.findIndex(x => x.user_id === r.user_id) + 1), bg = colorHex(r.color), ink = inkFor(bg), m = playerMood(r);
  const items = ALL_ITEMS.filter(i => ((r.look && r.look.items) || []).includes(i.key));
  return html`<section class="c-hero player-hero" style="--hero-bg:${bg};--hero-ink:${ink}" data-ink="${ink === '#111111' ? 'dark' : 'light'}">
      <div class="player-top"><div class="player-char ${'m-' + m}"><img src="${playerImage(r)}" alt=""></div>
        <div class="player-info"><span class="pill">${GLYPH.trophy}${pos}º esta semana</span><h2>${esc(r.name)}</h2><p>Nivel ${r.level} · ${rankFor(r.level)}</p><p class="mood-chip">${MOOD_TEXT[m]}</p></div></div></section>
    <section class="panel"><h3>Esta semana</h3>
      <div class="trio"><div><b class="num">${r.week_xp}</b><span>XP</span></div><div><b class="num">${r.streak}</b><span>${r.streak === 1 ? 'día seguido' : 'días seguidos'}</span></div><div><b class="num">${r.chests_week}</b><span>${r.chests_week === 1 ? 'cofre' : 'cofres'}</span></div></div>
      <p class="hint num">${r.xp} XP en total.</p></section>
    <section class="panel"><h3>Lleva puesto <span class="label">${items.length}</span></h3>
      ${items.length ? `<div class="mini-items">${items.map(i => `<span title="${i.name}"><img src="${itemImg(i.key)}" alt="${i.name}"></span>`).join('')}</div>` : '<p class="hint">Ahora mismo no lleva ningún objeto.</p>'}</section>
    ${when(!r.me, viewPlayerRoutines(r))}
    ${when(!r.me, `<button class="btn wide ${S.rivals.includes(r.user_id) ? '' : 'dark'} rival-btn" data-act="toggleRival" data-id="${esc(r.user_id)}">${S.rivals.includes(r.user_id) ? '★ Es tu rival · quitar' : '☆ Añadir como rival'}</button>`)}
    ${when(!r.me && cloud.user, viewDuelForm(r))}
    ${r.me ? '<button class="btn wide" data-act="open" data-id="profile">Editar mi perfil</button>'
      : S.nudgesSent[r.user_id] === today() ? '<button class="btn wide" disabled>Ya le has dado caña hoy</button>'
      : `<button class="btn primary wide" data-act="nudge" data-id="${esc(r.user_id)}">¡Vamos! Dale caña a ${esc(r.name)}</button><p class="hint center">Le saldrá un aviso al abrir la app. Una vez al día.</p>`}
    <button class="btn ghost wide" data-act="open" data-id="ranking">Volver al ranking</button>`;
}
const ago = iso => {
  const m = Math.round((Date.now() - new Date(iso)) / 60000);
  if (m < 1) return 'ahora'; if (m < 60) return `hace ${m} min`; const h = Math.round(m / 60); if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24); return d === 1 ? 'ayer' : d < 7 ? `hace ${d} días` : new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};
function viewPlayerRoutines(r) {
  if (!ui.sharedRoutines) { setTimeout(loadSharedRoutines, 0); return ''; }
  const p = ui.sharedRoutines.find(x => x.user_id === r.user_id);
  if (!p || !(p.routines || []).length) return '';
  return html`<section class="panel"><h3>Sus rutinas <span class="label">${p.routines.length}</span></h3><p class="hint">Así entrena ${esc(r.name)}. Copia la que quieras y ajústala a ti.</p>
    <ul class="pick-list">${p.routines.map((rt, i) => viewSharedRoutine({ user_id: p.user_id, name: p.name, color: p.color, idx: i, routine: rt })).join('')}</ul></section>`;
}
function viewDuelCard(d) {
  const rival = duelRival(d), who = (ui.ranking || []).find(r => r.user_id === rival.id) || { name: rival.name, color: '#C7B5FF', user_id: rival.id };
  const me = (ui.ranking || []).find(r => r.user_id === cloud.user.id) || { name: S.name, color: S.color, look: S.look, photo: S.photo };
  const meta = DUEL_METRIC[d.metric] || DUEL_METRIC.xp, stake = d.stake ? `${coinBadge(d.stake)} en juego` : 'Sin apuesta, solo el orgullo';
  if (d.status === 'pending') {
    const incoming = !iAmChallenger(d);
    return html`<li class="duel pending"><div class="duel-h"><span class="pill">⚔️ ${incoming ? 'Te han retado' : 'Reto enviado'}</span><small>${stake}</small></div>
      <p><b>${esc(incoming ? rival.name : 'Tú')}</b> ${incoming ? 'te reta' : `has retado a <b>${esc(rival.name)}</b>`} a una semana de <b>${meta.desc}</b>. Si acepta, empieza el lunes ${shortDate(nextMonday())}.</p>
      <div class="edit-row">${incoming ? `<button class="btn primary" data-act="acceptDuel" data-id="${d.id}">Aceptar</button><button class="btn ghost" data-act="declineDuel" data-id="${d.id}">Rechazar</button>`
        : `<small class="hint">Esperando a que acepte…</small><button class="btn ghost" data-act="declineDuel" data-id="${d.id}">Cancelar</button>`}</div></li>`;
  }
  if (today() < d.start_day) {
    return html`<li class="duel soon"><div class="duel-h"><span class="pill">⚔️ ${meta.name}</span><small>Empieza el lunes ${shortDate(d.start_day)}</small></div>
      <p>Contra <b>${esc(rival.name)}</b>, de lunes a domingo. Lo que hagáis antes no cuenta.</p><small class="hint">${stake}</small></li>`;
  }
  const { mine, theirs } = duelScores(d), max = Math.max(1, mine, theirs), over = today() >= d.end_day;
  const left = Math.max(0, Math.round((new Date(d.end_day + 'T00:00') - Date.now()) / 86400000));
  const res = S.duelsSettled[d.id];
  const status = over ? (res === 'win' || mine > theirs ? '¡Has ganado!' : res === 'loss' || mine < theirs ? 'Has perdido' : 'Empate') : left <= 1 ? 'Último día' : `Quedan ${left} días`;
  const side = (p, v, cls) => `<div class="duel-side ${cls}">${avatar(p)}<b class="num">${v}</b><small>${esc(p.name)}</small><div class="duel-bar"><i style="width:${v / max * 100}%"></i></div></div>`;
  return html`<li class="duel ${over ? 'over' : ''} ${mine > theirs ? 'ahead' : mine < theirs ? 'behind' : ''}"><div class="duel-h"><span class="pill">⚔️ ${meta.name}</span><small>${status}</small></div>
    <div class="duel-vs">${side(me, mine, 'me')}<span class="vs">VS</span>${side(who, theirs, 'them')}</div><small class="hint">${stake} · ${meta.unit === 'XP' ? 'XP sumada' : 'Días entrenados'} desde ${shortDate(d.start_day)}</small></li>`;
}
function viewVoucher(v) {
  const it = inviteOf(v.reward), toMe = v.to_id === cloud.user.id;
  const st = { pending: toMe ? 'Te toca invitar' : 'Esperando', done: '¡Hecho!', declined: 'No pudo' }[v.status] || v.status;
  const line = toMe ? `<b>${esc(v.from_name)}</b> ha canjeado ${v.cost} monedas: le invitas <b>${esc(it.verb)}</b>.` : `<b>${esc(v.to_name)}</b> te invita <b>${esc(it.verb)}</b>.`;
  const actions = toMe && v.status === 'pending'
    ? `<div class="edit-row"><button class="btn primary" data-act="voucherDone" data-id="${v.id}">Ya le he invitado</button><button class="btn ghost" data-act="deleteVoucher" data-id="${v.id}">No puedo</button></div><small class="hint">Al cumplir recuperas ${Math.round(v.cost * THANKS)} monedas de agradecimiento.</small>`
    : '';
  return `<li class="voucher st-${esc(v.status)} ${toMe ? 'to-me' : ''}"><span class="v-ico">${it.ico}</span><div class="txt"><div class="v-h"><small>${st}</small><small>${shortDate(v.created_at.slice(0, 10))}</small></div><p>${line}</p>${actions}</div></li>`;
}
function viewMyVouchers(onlyPending) {
  if (!cloud.user || ui.vouchersState !== 'ok') return '';
  const list = (ui.vouchers || []).filter(v => (onlyPending ? v.status === 'pending' && v.to_id === cloud.user.id : true));
  if (!list.length) return '';
  return html`<section class="vouchers"><div class="edit-row spread"><h2 class="sec-t">${onlyPending ? 'Te toca invitar' : 'Invitaciones'}</h2></div><ul class="v-list">${list.slice(0, onlyPending ? 5 : 12).map(viewVoucher)}</ul></section>`;
}
function viewInviteShop(have) {
  if (!cloud.user) return '<section class="panel"><h3>Invitaciones</h3><p class="hint">Entra con tu cuenta para canjear monedas por planes con tus amigos.</p><button class="btn primary" data-act="syncInfo">Crear cuenta o entrar</button></section>';
  if (ui.vouchersState === 'missing') return '<section class="panel"><h3>Invitaciones</h3><p class="hint">Falta activarlas en Supabase (supabase-invitaciones.sql).</p></section>';
  const friends = (ui.ranking || []).filter(r => r.user_id !== cloud.user.id), inv = ui.invite;
  const cards = INVITES.map(it => {
    const can = have >= it.cost, open = inv && inv.key === it.key;
    return html`<li class="inv-card ${can ? 'can' : ''} ${open ? 'open' : ''}"><button class="inv-top" data-act="pickInvite" data-k="${it.key}" ${can ? '' : 'aria-disabled="true"'}>
      <span class="inv-ico">${it.ico}</span><span class="txt"><b>${it.name}</b>${coinBadge(it.cost)}</span>${can ? `<span class="go">${GLYPH.chev}</span>` : `<span class="need num">Te faltan ${it.cost - have}</span>`}</button>
      ${!open ? '' : html`<div class="inv-pick"><span class="label">¿Quién te invita?</span>${friends.length ? `<div class="chips">${friends.map(f => `<button class="chip-btn ${inv.to === f.user_id ? '' : ''}" data-act="pickInviter" data-id="${esc(f.user_id)}" aria-pressed="${inv.to === f.user_id}">${avatar(f)}${esc(f.name)}</button>`).join('')}</div>` : '<p class="hint">Aún no hay nadie más. Invita a tus amigos desde el Ranking.</p>'}
        ${when(inv.to, `<button class="btn primary wide" data-act="buyInvite">${ui.armed === 'buy:invite' ? `¿Gastar ${it.cost} monedas?` : `Canjear: ${esc((friends.find(f => f.user_id === inv.to) || {}).name || '')} te invita ${esc(it.verb)}`}</button>`)}</div>`}</li>`;
  }).join('');
  return html`<section class="panel invites"><h3>Invitaciones <span class="label">un amigo te invita</span></h3><ul class="inv-list">${cards}</ul>
    <p class="hint">Ganas monedas con misiones, entrenos, récords, cofres y duelos. Eliges a quién y le llega el vale. Si no puede, te devolvemos las monedas. Cuando cumple, recupera un ${THANKS * 100}% de agradecimiento.</p></section>`;
}
function viewDuels() {
  if (!cloud.user || !ui.duels || ui.duelsState !== 'ok') return '';
  const recent = ui.duels.filter(d => d.status === 'pending' || d.status === 'active' || (d.status === 'finished' && today() < addDays(d.end_day, 3)));
  if (!recent.length) return '';
  return html`<section class="duels"><div class="edit-row spread"><h2 class="sec-t">Duelos</h2></div><ul class="duel-list">${recent.map(viewDuelCard)}</ul></section>`;
}
function viewDuelForm(r) {
  if (ui.duelsState === 'missing') return '<section class="panel"><h3>Duelo</h3><p class="hint">Los duelos aún no están activados en Supabase (falta supabase-duelos.sql).</p></section>';
  const open = (ui.duels || []).find(d => (d.challenger === r.user_id || d.opponent === r.user_id) && (d.status === 'pending' || d.status === 'active'));
  if (open) return `<ul class="duel-list">${viewDuelCard(open)}</ul>`;
  const f = ui.duelForm, have = coins();
  return html`<section class="panel duel-form"><h3>Retar a un duelo</h3><p class="hint">Una semana entera, de lunes a domingo. Empieza el lunes ${shortDate(nextMonday())} si acepta.</p>
    <div class="chips">${Object.entries(DUEL_METRIC).map(([k, m]) => `<button class="chip-btn" data-act="duelMetric" data-k="${k}" aria-pressed="${f.metric === k}">${m.name}</button>`).join('')}</div>
    <span class="label">Apuesta</span><div class="chips">${DUEL_STAKES.map(v => `<button class="chip-btn" data-act="duelStake" data-k="${v}" aria-pressed="${f.stake === v}" ${v > have ? 'disabled' : ''}>${v ? v + ' monedas' : 'Nada'}</button>`).join('')}</div>
    <button class="btn primary wide" data-act="challenge" data-id="${esc(r.user_id)}">⚔️ Retar a ${esc(r.name)}</button></section>`;
}
function viewFeedItem(f) {
  const who = (ui.ranking || []).find(r => r.user_id === f.user_id) || { name: f.name, color: '#C7B5FF', user_id: f.user_id };
  const me = cloud.user && f.user_id === cloud.user.id, reacts = f.feed_reactions || [];
  const chips = REACTIONS.map(e => {
    const n = reacts.filter(r => r.emoji === e).length, mine = reacts.some(r => r.emoji === e && cloud.user && r.user_id === cloud.user.id);
    return `<button class="react ${mine ? 'on' : ''}" data-act="react" data-id="${f.id}" data-k="${e}" aria-pressed="${mine}" aria-label="Reaccionar ${e}">${e}${n ? `<span class="num">${n}</span>` : ''}</button>`;
  }).join('');
  return html`<li class="fi k-${esc(f.kind)}"><button class="fi-ava" data-act="openPlayer" data-id="${esc(f.user_id)}" aria-label="Perfil de ${esc(who.name)}">${avatar(who)}<span class="fi-ico" aria-hidden="true">${FEED_ICON[f.kind] || '⭐'}</span></button>
    <div class="fi-body"><p><b>${me ? 'Tú' : esc(who.name || f.name || 'Alguien')}</b> ${esc(me ? f.text.replace(/^ha /, 'has ') : f.text)}</p>
      <div class="fi-foot"><small>${ago(f.created_at)}</small><div class="reacts">${chips}</div></div></div></li>`;
}
function viewFeed(limit) {
  if (!cloud.user || ui.feedState === 'missing' || ui.feedState === 'error') return '';
  const list = (ui.feed || []).filter(f => isRival(f.user_id)).slice(0, limit || 40);
  return html`<section class="feed"><div class="edit-row spread"><h2 class="sec-t">${limit ? 'Lo último' : 'Actividad'}</h2>${limit && (ui.feed || []).length > limit ? '<button class="btn ghost" data-act="open" data-id="ranking">Ver todo</button>' : ''}</div>
    ${list.length ? `<ul class="fl">${list.map(viewFeedItem).join('')}</ul>` : `<p class="hint">${ui.feed ? 'Aún no hay nada. Supera un nivel, entrena o abre un cofre y saldrá aquí para los demás.' : 'Cargando…'}</p>`}</section>`;
}
function viewRanking() {
  const left = daysLeftInWeek(), tab = ui.rankTab;
  const head = html`<section class="c-hero rank-hero"><span class="pill">${GLYPH.trophy}Ranking</span>
    <h2>${tab === 'week' ? 'Liga semanal' : 'Clasificación total'}</h2>
    <p>${tab === 'week' ? `Gana quien más XP sume de lunes a domingo. ${left === 1 ? 'Hoy es el último día' : `Quedan ${left} días`}.` : 'Toda la XP desde que empezasteis.'}</p>
    <div class="row"><div class="seg-tabs" role="tablist">
      <button role="tab" data-act="rankTab" data-k="week" aria-selected="${tab === 'week'}">Esta semana</button>
      <button role="tab" data-act="rankTab" data-k="total" aria-selected="${tab === 'total'}">Total</button></div>
      <button class="btn dark" data-act="shareApp">${GLYPH.share}Invitar</button></div></section>`;
  let body;
  if (ui.sync === 'off') body = '<p class="hint">El ranking necesita la conexión con Supabase.</p>';
  else if (!cloud.user) body = html`<p>Para competir necesitas una cuenta. Así cada uno tiene su progreso y aparece en la tabla.</p>
    <button class="btn primary" data-act="syncInfo">Crear cuenta o entrar</button>`;
  else if (ui.rankingState === 'missing') body = '<p>Falta preparar el ranking en Supabase: ejecuta <b>supabase-ranking.sql</b> en el SQL Editor.</p>';
  else if (ui.rankingState === 'error') body = '<p class="hint">No se ha podido cargar el ranking. Revisa la conexión.</p>';
  else if (!ui.ranking) body = '<p class="hint">Cargando ranking…</p>';
  else {
    const rows = rankedPlayers(tab), others = rankedPlayers(tab, true).filter(r => !r.me);
    const picker = others.length ? html`<section class="panel rivals"><h3>Tus rivales <span class="label">${S.rivals.length ? S.rivals.length + (S.rivals.length === 1 ? ' elegido' : ' elegidos') : 'compites con todos'}</span></h3>
      <p class="hint">Elige con quién quieres competir. Solo verás a esa gente en el ranking, la plaza y el muro, y solo te llegarán sus avisos. Sin elegir a nadie, compites con todos.</p>
      <div class="chips">${others.map(o => `<button class="chip-btn" data-act="toggleRival" data-id="${esc(o.user_id)}" aria-pressed="${S.rivals.includes(o.user_id)}">${avatar(o)}${esc(o.name)}</button>`).join('')}</div>
      ${when(S.rivals.length, `<div class="seg-tabs small" role="tablist"><button role="tab" data-act="rivalsOnly" data-k="1" aria-selected="${S.rivalsOnly}">Solo mis rivales</button><button role="tab" data-act="rivalsOnly" data-k="0" aria-selected="${!S.rivalsOnly}">Ver a todos</button></div>`)}</section>` : '';
    ui.rivalsPicker = picker;
    body = html`<ol class="ranking">${rows.map((r, i) => {
      const value = tab === 'week' ? r.week_xp : r.xp;
      return `<li class="${r.me ? 'me' : ''} ${i < 3 ? 'top top' + (i + 1) : ''}"><button class="rank-row" data-act="openPlayer" data-id="${esc(r.user_id)}"><span class="pos num">${i + 1}</span>${avatar(r)}
        <span class="who"><b>${esc(r.name)}${r.me ? ' <em>tú</em>' : ''}</b><small class="num">Nivel ${r.level} · racha ${r.streak} ${r.streak === 1 ? 'día' : 'días'}${tab === 'week' ? ` · ${r.chests_week} ${r.chests_week === 1 ? 'cofre' : 'cofres'}` : ''}</small></span>
        <span class="score num">${value}<small>XP</small></span></button></li>`;
    })}</ol>${when(rows.length < 2, '<p class="hint">De momento estás tú solo. Dale a Invitar y pásale el enlace a quien quieras retar.</p>')}`;
    return head + viewPlaza(rows) + `<p class="hint center">Toca a alguien para ver su perfil.</p><section class="panel">${body}</section>` + ui.rivalsPicker + viewFeed();
  }
  return head + `<section class="panel">${body}</section>`;
}
function viewHero() {
  const xp = totalXP(), L = levelOf(xp), from = xpForLevel(L), to = xpForLevel(L + 1), p = (xp - from) / (to - from), m = mood();
  return html`<section class="hero" ${heroStyle()}>${viewAxis(m.kind)}
    <div class="hero-txt">
      <span class="pill">${GLYPH.star}Nivel ${L}</span><h1>${rankFor(L)}</h1>
      <div class="xpbar" role="progressbar" aria-valuenow="${pct(p)}" aria-valuemin="0" aria-valuemax="100" aria-label="Progreso al siguiente nivel"><i style="width:${p * 100}%"></i></div>
      <small class="num">${xp} XP · faltan ${to - xp} para el nivel ${L + 1}</small></div>
    <p class="say mood-${m.kind}">${esc(m.line)}</p>
    <div class="hero-stats"><button class="coins-btn" data-act="open" data-id="shop" aria-label="Ir a la tienda">${coinBadge(coins(), 'coins')}</button></div></section>`;
}
const viewDaySwitch = () => `<div class="day-switch" role="tablist" aria-label="Día que apuntas">${dayOptions().map(i => `<button role="tab" data-act="logDay" data-k="${i}" aria-selected="${(ui.logDay || 0) === i}">${dayChip(i)}</button>`).join('')}</div>`;
function viewLogBanner() {
  if (!ui.logDay) return '';
  const d = new Date(logDate() + 'T12:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' });
  return `<div class="log-banner"><span>✏️ Apuntando para <b>${dayWord(ui.logDay)}</b> (${d})</span><button data-act="logDay" data-k="0">Volver a hoy</button></div>`;
}
function viewDaily() {
  const date = logDate(), quests = dailyQuests(date), done = quests.filter(q => questDone(q, date)).length, chest = (S.daily[date] || {}).chest, ready = done === quests.length && !chest;
  return html`<section class="daily"><div class="edit-row spread"><h2 class="sec-t">Misiones ${deDay(ui.logDay || 0)}</h2><span class="label num">${done}/${quests.length}</span></div>
    <ul class="quests">${quests.map(q => {
      const ok = questDone(q, date), t = questText(q);
      const act = q.kind === 'habit' ? `data-act="toggleHabit" data-k="${q.key}"` : q.kind === 'train' && ui.logDay ? 'data-act="toggleTrainedToday"' : q.kind === 'advance' ? `data-act="open" data-id="${q.cid}"` : 'data-act="open" data-id="fisico"';
      return `<li><button class="quest ${ok ? 'done' : ''}" data-pk="q-${esc(q.key || q.cid || q.kind)}" ${act}><span class="check">${GLYPH.check}</span><span class="txt"><b>${esc(t.title)}</b><small>${esc(t.sub)}</small></span>${q.kind === 'habit' || (q.kind === 'train' && ui.logDay) ? '' : `<span class="go">${GLYPH.chev}</span>`}</button></li>`;
    })}</ul>
    <div class="chest ${ready ? 'ready' : chest ? 'opened' : ''}"><img src="${chest ? IMG.chestOpen : IMG.chest}" alt="">
      <div class="txt">${chest ? `<b>Cofre abierto</b><small class="num">+${chest.coins} monedas · +${chest.xp} XP${chest.gold ? ' · ¡dorado!' : ''}</small>`
        : ready ? '<b>¡Cofre listo!</b><small>Has hecho las 3. Ábrelo.</small>' : `<b>Cofre del día</b><small>Completa las 3 misiones para abrirlo</small>`}</div>
      ${when(ready, '<button class="btn dark" data-act="openChest">Abrir</button>')}</div></section>`;
}
function viewDailyItems() {
  const date = logDate(), done = new Set(S.dailyDone[date] || []), items = S.dailyItems, edit = ui.dailyEdit;
  const form = ui.dailyForm ? html`<div class="di-form"><div class="chips">${DAILY_PRESETS.filter(([, n]) => !items.some(i => i.name === n)).map(([e, n]) => `<button class="chip-btn" data-act="dailyPreset" data-k="${esc(e + '|' + n)}">${e} ${esc(n)}</button>`).join('')}</div>
      <div class="emoji-row">${DAILY_EMOJIS.map(e => `<button data-act="dailyEmoji" data-k="${e}" aria-pressed="${ui.dailyForm.emoji === e}">${e}</button>`).join('')}</div>
      <div class="inrow"><input id="di-name" autocomplete="off" maxlength="40" placeholder="Ej: Tomar la pastilla" value="${esc(ui.dailyForm.name || '')}"></div>
      <label class="fld inline"><span>Avisarme a las</span><select id="di-hour"><option value="">Sin aviso</option>${Array.from({ length: 18 }, (_, i) => i + 6).map(h => `<option value="${h}" ${ui.dailyForm.hour === h ? 'selected' : ''}>${h}:00</option>`).join('')}</select></label>
      <div class="edit-row"><button class="btn primary" data-act="dailySave">Añadir</button><button class="btn ghost" data-act="dailyForm">Cancelar</button></div></div>` : '';
  if (!items.length && !ui.dailyForm) return html`<section class="daily-items empty"><div class="edit-row spread"><h2 class="sec-t">Cada día</h2></div>
    <button class="teaser" data-act="dailyForm"><span class="teaser-ico">💊</span><span class="txt"><b>Lo que haces cada día</b><small>Una pastilla, la creatina, apuntar la comida… Márcalo cada día y no se te olvida.</small></span><span class="go">${GLYPH.plus}</span></button></section>`;
  const n = items.filter(i => done.has(i.id)).length;
  return html`<section class="daily-items"><div class="edit-row spread"><h2 class="sec-t">Cada día</h2><span class="label num">${n}/${items.length}</span>
      <button class="btn ghost sm" data-act="dailyEdit">${edit ? 'Listo' : 'Editar'}</button></div>
    <ul class="quests">${items.map(i => { const ok = done.has(i.id), st = dailyItemStreak(i.id);
      return `<li><button class="quest di ${ok ? 'done' : ''}" data-pk="d-${i.id}" ${edit ? '' : `data-act="dailyToggle" data-id="${i.id}"`}><span class="check">${ok ? GLYPH.check : `<span class="di-e">${i.emoji || '✅'}</span>`}</span><span class="txt"><b>${esc(i.name)}</b><small>${st > 1 ? `🔥 ${st} días seguidos` : st === 1 ? 'Racha de 1 día' : 'Empieza la racha hoy'}${i.hour != null ? ` · aviso a las ${i.hour}:00` : ''}</small></span>${edit ? `<span class="di-x" data-act="dailyDelete" data-id="${i.id}" role="button" aria-label="Borrar">${ui.armed === i.id ? '¿Borrar?' : '✕'}</span>` : ''}</button></li>`; }).join('')}</ul>
    ${form || `<button class="btn add-ex" data-act="dailyForm">+ Añadir algo diario</button>`}</section>`;
}
function viewWeek() {
  const trained = new Set(S.train), names = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], days = weekDays();
  const n = days.filter(d => trained.has(d.key)).length;
  return html`<section class="stack"><div class="edit-row spread"><h2 class="sec-t">Esta semana</h2><span class="label">${n} ${n === 1 ? 'entreno' : 'entrenos'} · racha ${streak()}</span></div>
    <div class="week" role="tablist" aria-label="Elige el día que apuntas">${days.map((d, i) => {
      const back = Math.round((new Date(today() + 'T12:00') - new Date(d.key + 'T12:00')) / 86400000), can = back >= 0 && back <= maxBack(), sel = can && back === (ui.logDay || 0);
      return html`<button class="day ${d.isToday ? 'today' : ''} ${sel ? 'sel' : ''} ${back < 0 ? 'future' : ''}" ${can ? `data-act="logDay" data-k="${back}"` : 'disabled'} role="tab" aria-selected="${sel}" aria-label="${names[i]} ${d.date.getDate()}${trained.has(d.key) ? ', entrenado' : ''}">${trained.has(d.key) ? GLYPH.star : '<span class="ph"></span>'}<span class="d">${names[i]}</span><b>${d.date.getDate()}</b></button>`;
    })}</div>
    <p class="hint week-hint">${ui.logDay ? `Estás apuntando lo ${deDay(ui.logDay)}. Toca hoy para volver.` : 'Toca un día de esta semana para apuntar lo que se te olvidó.'}</p></section>`;
}
function viewCampaignCard(c) {
  const li = currentLevelIndex(c), l = c.levels[li], next = l && l.missions.find(m => !isDone(m)), p = campaignProgress(c);
  return html`<button class="cc" style="background:${colorVar(c)}" data-act="open" data-id="${c.id}"><span class="ico">${ICONS[c.icon] || ICONS.star}</span>
    <span class="lv">Nivel ${li + 1}${l ? ' · ' + esc(l.name) : ''}</span><b>${esc(c.name)}</b>
    ${next ? `<span class="next">Siguiente: ${esc(next.name)}</span>` : when(p >= 1, '<span class="next">Campaña completada</span>')}
    <span class="big num">${pct(p)}%</span>${bar(p)}</button>`;
}
function viewInventory() {
  const own = ownedItems(), worn = wearing(), pend = pendingPicks();
  const choose = pend.length ? html`<div class="pick-item"><b>🎁 Nivel ${pend[0]}: elige un objeto</b><small>Te quedas con uno. Los otros podrán salirte al subir de nivel.</small>
    <div class="pick-opts">${pickOptions(pend[0]).map(i => `<button class="item got" data-act="pickItem" data-l="${pend[0]}" data-k="${i.key}"><img src="${itemImg(i.key)}" alt=""><small>${i.name}</small></button>`).join('')}</div>${pend.length > 1 ? `<small>Te quedan ${pend.length} por elegir.</small>` : ''}</div>` : '';
  return html`<section class="inv"><h3>Inventario <span>${own.size}/${ALL_ITEMS.length} objetos</span></h3>${choose}<div class="items">${ALL_ITEMS.map(i => {
    const ok = own.has(i.key), on = worn.includes(i.key);
    const inner = `<img src="${itemImg(i.key)}" alt="">${when(on, '<em>Puesto</em>')}<small>${ok ? i.name : '?'}</small>`;
    return ok ? `<button class="item got ${on ? 'on' : ''}" data-act="toggleWear" data-k="${i.key}" aria-pressed="${on}" aria-label="${on ? 'Quitar' : 'Poner'} ${i.name}">${inner}</button>`
      : `<div class="item locked" title="Puede salirte al subir de nivel">${inner}</div>`;
  })}</div><p class="hint inv-hint">Cada nivel nuevo eliges un objeto. Toca los tuyos para ponértelos o quitártelos: una cosa en cada mano y una a tus pies.</p></section>`;
}
function viewNewCampaign() {
  const have = new Set(S.campaigns.map(c => c.tpl || c.id));
  const base = defaultCampaigns().filter(c => !have.has(c.id)).map(c => ({ key: c.id, emoji: c.id === 'carnet' ? '🚗' : '💪', name: c.name, sub: c.sub, levels: () => c.levels, base: true }));
  const list = [...base, ...TEMPLATES.filter(t => !have.has(t.key))];
  return html`<section class="panel new-camp"><h3>Nueva campaña</h3>
    ${list.length ? html`<span class="label">Elige una ya montada</span><ul class="tpl-list">${list.map(t => `<li><button class="tpl" data-act="addTemplate" data-k="${t.key}"><span class="tpl-e">${t.emoji}</span><span class="txt"><b>${esc(t.name)}</b><small>${esc(t.sub)} · ${t.levels().length} niveles</small></span><span class="tpl-add">${GLYPH.plus}</span></button></li>`).join('')}</ul>` : ''}
    <span class="label">O créala desde cero</span>
    <input id="nc-name" placeholder="Ej: Ahorrar 3.000 €" maxlength="40">
    <div class="icons">${Object.keys(ICONS).map(k => `<button data-act="pickIcon" data-k="${k}" aria-pressed="${k === ui.newIcon}" aria-label="${k}">${ICONS[k]}</button>`)}</div>
    <div class="swatches">${COLORS.map(k => `<button data-act="pickColor" data-k="${k}" aria-pressed="${k === ui.newColor}" aria-label="Color ${k}" style="background:var(--${k})"></button>`)}</div>
    <div class="edit-row"><button class="btn primary" data-act="createCampaign">Crear campaña</button><button class="btn ghost" data-act="toggleNewCampaign">Cancelar</button></div>
    <p class="hint">Las ya montadas las puedes editar después: cambiar misiones, añadir niveles… Las de cero empiezan con un nivel vacío.</p></section>`;
}
function viewHome() {
  return viewInstallCard() + viewHero() + viewWeek() + viewDaily() + viewDailyItems() + viewMyVouchers(true) + viewDuels() + viewRankTeaser() + viewFeed(3) + html`<section class="stack"><h2 class="sec-t">Tus campañas</h2><div class="grid">${S.campaigns.map(viewCampaignCard)}
    <button class="cc add" data-act="toggleNewCampaign">${GLYPH.plus}Nueva campaña</button></div></section>`
    + when(ui.addingCampaign, viewNewCampaign()) + viewInventory();
}
function viewNav() {
  const body = S.campaigns.find(c => c.tracker === 'body'), cur = ui.view.startsWith('rt:') && body ? body.id : ui.view;
  const item = (id, label, icon) => `<button data-act="open" data-id="${id}" aria-label="${esc(label)}" ${cur === id ? 'aria-current="page"' : ''}>${icon}</button>`;
  return item('home', 'Inicio', GLYPH.home) + item('ranking', 'Ranking', GLYPH.trophy) + item('shop', 'Tienda', GLYPH.bag) + S.campaigns.map(c => item(c.id, c.name, ICONS[c.icon] || ICONS.star)).join('');
}

// --- Físico
function viewWeightChart() {
  const w = S.weight;
  if (w.log.length < 2) return '';
  const pts = w.log.slice(-30), values = pts.map(p => p.kg).concat(w.goal != null ? [w.goal] : []);
  const lo = Math.min(...values) - 0.5, hi = Math.max(...values) + 0.5;
  const X = i => 6 + i * (288 / (pts.length - 1)), Y = k => 8 + (hi - k) / (hi - lo) * 64;
  const line = pts.map((p, i) => `${X(i).toFixed(1)},${Y(p.kg).toFixed(1)}`).join(' ');
  return html`<svg class="spark" viewBox="0 0 300 80" preserveAspectRatio="none" aria-label="Evolución del peso">
    ${when(w.goal != null, `<line x1="0" x2="300" y1="${Y(w.goal)}" y2="${Y(w.goal)}" stroke="var(--muted)" stroke-dasharray="4 4" stroke-width="1.5" vector-effect="non-scaling-stroke"/>`)}
    <polygon points="6,80 ${line} 294,80" fill="var(--lime)" opacity=".55"/>
    <polyline points="${line}" fill="none" stroke="var(--ink)" stroke-width="2.5" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>
    <circle cx="${X(pts.length - 1)}" cy="${Y(pts[pts.length - 1].kg)}" r="4.5" fill="var(--ink)"/></svg>`;
}
function viewWeight() {
  const w = S.weight, cur = lastKg();
  const hasGoal = w.start != null && w.goal != null;
  const p = hasGoal && cur != null && w.start !== w.goal ? clamp((w.start - cur) / (w.start - w.goal)) : 0;
  return html`<section class="panel"><h3>Peso <span class="label">${w.log.length} registros</span></h3>
    <div class="trio"><div><b>${fmt(w.start)}</b><span>Inicio kg</span></div><div><b>${fmt(cur)}</b><span>Actual kg</span></div><div><b>${fmt(w.goal)}</b><span>Objetivo kg</span></div></div>
    ${when(hasGoal, bar(p, 'bar2') + `<p class="hint"><b class="num">${pct(p)}%</b> del camino${cur != null ? ' · ' + fmt(Math.max(0, w.start - cur)) + ' kg menos desde el inicio' : ''}</p>`)}
    ${viewWeightChart()}
    <div class="inrow"><input id="kg" type="number" inputmode="decimal" step="0.1" min="30" max="250" placeholder="Peso ${deDay(ui.logDay || 0)} (kg)"><button class="btn primary" data-act="logWeight">Apuntar</button></div>
    ${when(w.goal == null || ui.editing, `<div class="inrow"><input id="goal" type="number" inputmode="decimal" step="0.5" min="30" max="250" placeholder="Peso objetivo (kg)" value="${w.goal ?? ''}"><button class="btn" data-act="setGoal">${w.goal == null ? 'Fijar objetivo' : 'Cambiar objetivo'}</button></div>`)}
    <p class="hint">${w.start == null ? 'El primer peso que apuntes queda como peso inicial.' : 'Pésate siempre en las mismas condiciones, por ejemplo al levantarte.'}</p></section>`;
}
// ---------- Entrenar: empezar ahora, apuntar uno ya hecho y lo último que has hecho ----------
const ACTIVITIES = ['Baile', 'Correr', 'Fútbol', 'Pádel', 'Gimnasio', 'Yoga', 'Natación', 'Bici', 'Caminar', 'Boxeo', 'Escalada', 'Skate'];
const sessionSets = se => Object.values(se.ex || {}).reduce((a, b) => a + b.length, 0);
function sessionLine(se) {
  const bits = [];
  if (se.mins) bits.push(`${se.mins} min`);
  const n = sessionSets(se); if (n) bits.push(`${n} ${n === 1 ? 'serie' : 'series'}`);
  return bits.join(' · ');
}
function viewTraining() {
  const week = new Set(weekDays().map(d => d.key)), dayName = dayWord(ui.logDay || 0), trainedDay = S.train.includes(logDate());
  const recent = S.sessions.slice(-6).reverse();
  return html`<section class="panel nofold train-panel"><h3>Entrenar <span class="label">XP por tiempo e intensidad</span></h3>
    <div class="trio"><div><b>${S.train.length}</b><span>Total</span></div><div><b>${S.train.filter(k => week.has(k)).length}</b><span>Esta semana</span></div><div><b>${streak()}</b><span>Días seguidos</span></div></div>
    <div class="train-cta"><button class="btn primary" data-act="openStart">${GLYPH.play} Entrenar ahora</button><button class="btn dark" data-act="openLog">✏️ Apuntar uno hecho</button></div>
    <p class="hint">«Entrenar ahora» te guía serie a serie con descansos. «Apuntar uno hecho» es para lo que ya hiciste: una rutina, 40 min de baile, un partido…</p>
    <p class="hint">La XP va por <b>minutos e intensidad</b> (1 h de comba da mucho más que 20 min caminando) y cada récord suma +${XP.record}. Puedes entrenar varias veces al día: a partir de 60 XP en un día, lo demás cuenta la mitad.</p>
    ${when(recent.length, html`<div class="stack-s"><span class="label">Últimos entrenos</span><ul class="hist sess-hist">${recent.map(se => `<li><b>${esc(se.rname || 'Entreno')}</b><span>${shortDate(se.d)}${sessionLine(se) ? ' · ' + sessionLine(se) : ''}${se.note ? ' · ' + esc(se.note) : ''}${se.d >= TRAIN_CUTOFF ? ` · +${sessionXP(se)} XP` : ''}</span>${confirmBtn('deleteSession', se.id, 'Borrar')}</li>`)}</ul></div>`)}
    <button class="link-btn" data-act="toggleTrainedToday">${trainedDay ? `${dayName[0].toUpperCase() + dayName.slice(1)} ya cuenta como entrenado · quitar` : `Solo marcar ${dayName} como entrenado, sin detalles`}</button></section>`;
}
function viewRoutineTpl() {
  const have = new Set(S.routines.map(r => r.tpl));
  const card = t => { const ex = t.ex(); return `<li><button class="tpl" data-act="addRoutineTpl" data-k="${t.key}" ${have.has(t.key) ? 'disabled' : ''}><span class="tpl-e">${t.emoji}</span><span class="txt"><b>${esc(t.name)}</b><small>${esc(t.sub)} · ${ex.map(x => esc(x.name)).join(', ')}</small></span><span class="tpl-add">${have.has(t.key) ? GLYPH.check : GLYPH.plus}</span></button></li>`; };
  const cat = ui.tplCat || 'casa', friends = sharedFromFriends();
  const tabs = [...Object.entries(ROUTINE_CATS), ['amigos', '👥 De tus amigos']].map(([k, t]) => `<button class="chip-btn" data-act="tplCat" data-k="${k}" aria-pressed="${cat === k}">${t}</button>`).join('');
  const list = cat === 'amigos'
    ? (friends.length ? `<ul class="pick-list">${friends.map(viewSharedRoutine).join('')}</ul>` : `<p class="hint">${cloud.user ? (ui.routinesCol === false ? 'Para ver las rutinas de tus amigos falta activarlo en Supabase.' : 'Aún no hay rutinas de tus amigos. Cuando creen las suyas, saldrán aquí.') : 'Entra con tu cuenta para ver las rutinas de tus amigos.'}</p>`)
    : `<ul class="pick-list">${ROUTINE_TEMPLATES.filter(t => t.cat === cat).map(card).join('')}</ul>`;
  return html`<div class="sheet-bg" data-act="closeSheet"></div><section class="sheet" role="dialog" aria-label="Añadir rutina"><div class="sheet-grip"></div>
    <div class="edit-row spread"><h3>Añadir rutina</h3><button class="btn ghost" data-act="closeSheet">Cerrar</button></div>
    <form class="adde" data-form="addRoutine"><input name="n" autocomplete="off" placeholder="Nombre (ej: Día de piernas)" required maxlength="30" aria-label="Nombre de la nueva rutina"><button class="btn primary">Crear vacía</button></form>
    <span class="label">O elige una ya hecha</span>
    <div class="chips tpl-tabs">${tabs}</div>${list}
    <p class="hint">Después puedes cambiar series, repes o quitar ejercicios desde la rutina.</p></section>`;
}
/** Rutinas que comparten los demás (solo de tus rivales si has elegido alguno). */
function sharedFromFriends() {
  return (ui.sharedRoutines || []).filter(p => !cloud.user || p.user_id !== cloud.user.id).filter(p => isRival(p.user_id))
    .flatMap(p => (p.routines || []).map((r, i) => ({ user_id: p.user_id, name: p.name, color: p.color, idx: i, routine: r })));
}
function viewSharedRoutine(f) {
  const r = f.routine, mine = S.routines.some(x => x.from === f.user_id + ':' + r.name);
  const det = x => esc(x.name) + ' ' + (x.sets || 1) + '×' + (x.kind === 'peso' || x.kind === 'reps' ? (x.repMin === x.repMax ? x.repMax : x.repMin + '-' + x.repMax) : (x.kind === 'run' ? 'km' : x.kind === 'seg' ? 's' : 'min'));
  return `<li><div class="tpl shared"><span class="tpl-e" style="background:${esc(colorHex(f.color))};color:#111;font-weight:800">${esc((f.name || '?').charAt(0).toUpperCase())}</span><span class="txt"><b>${esc(r.name)}</b><small>de ${esc(f.name)} · ${(r.ex || []).map(det).join(', ')}</small></span>
    <button class="btn sm ${mine ? '' : 'primary'}" data-act="copyRoutine" data-id="${esc(f.user_id)}" data-k="${f.idx}" ${mine ? 'disabled' : ''}>${mine ? 'La tienes' : 'Copiar'}</button></div></li>`;
}
function viewStartPicker() {
  return html`<div class="sheet-bg" data-act="closeSheet"></div><section class="sheet" role="dialog" aria-label="Entrenar ahora"><div class="sheet-grip"></div>
    <div class="edit-row spread"><h3>¿Qué vas a entrenar?</h3><button class="btn ghost" data-act="closeSheet">Cerrar</button></div>
    ${S.routines.length ? `<ul class="pick-list">${S.routines.map(r => `<li><button class="tpl" data-act="startSession" data-id="${r.id}"><span class="tpl-e">${GLYPH.play}</span><span class="txt"><b>${esc(r.name)}</b><small>${r.exercises.length} ejercicios</small></span></button></li>`).join('')}</ul>` : '<p class="hint">Aún no tienes rutinas. Crea una abajo, en Rutinas.</p>'}
    <p class="hint">Para baile, partidos o cualquier actividad por tiempo, mejor «Apuntar uno hecho» cuando acabes.</p></section>`;
}
// Apuntar un entreno ya hecho
const qKinds = { reps: 'Series y repes', peso: 'Con peso', min: 'Minutos', seg: 'Segundos', run: 'Distancia' };
function qRows(x, rows, key) {
  return rows.map((st, i) => {
    const inp = (f, ph, w) => `<input class="qi ${w || ''}" inputmode="decimal" data-qk="${key}" data-i="${i}" data-f="${f}" value="${esc(st[f] ?? '')}" placeholder="${ph}" aria-label="${ph} serie ${i + 1}">`;
    const k = x.kind;
    const f = k === 'peso' ? inp('kg', 'kg') + '<span>×</span>' + inp('r', 'repes') : k === 'reps' ? inp('r', 'repes') + inp('kg', '+kg', 'sm') : k === 'run' ? inp('km', 'km') + inp('t', 'min') : inp('t', k === 'seg' ? 'seg' : 'min');
    return `<div class="qrow"><span class="qn">${i + 1}</span>${f}</div>`;
  }).join('');
}
const qInt = q => q.int || guessIntensity(q.mode === 'activity' ? q.activity : ((S.routines.find(x => x.id === q.routine) || {}).name || ''), q.mode === 'activity' ? q.extra.map(e => e.name) : ((S.routines.find(x => x.id === q.routine) || {}).exercises || []).map(x => x.name));
function qEstimate(q) {
  const mins = parseInt(q.mins, 10) || 0;
  if (!mins) return 'Pon los minutos para saber cuánta XP te dará (si no, se calcula por las series).';
  return `≈ +${Math.max(2, Math.round(Math.min(120, mins) * INTENSITY[qInt(q)].xpm))} XP por ${Math.min(120, mins)} min.`;
}
function viewQuickLog() {
  const q = ui.qlog, r = S.routines.find(x => x.id === q.routine), isAct = q.mode === 'activity';
  const exBlock = (x, key, removable) => {
    const rows = q.ex[key] || [], off = q.skip[key];
    return html`<div class="qex ${off ? 'off' : ''}"><div class="qex-h"><b>${esc(x.name)}</b><small>${qKinds[x.kind] || ''}</small>
      ${removable ? `<button class="btn ghost sm" data-act="qRemove" data-k="${key}">Quitar</button>` : `<button class="btn ghost sm" data-act="qSkip" data-k="${key}">${off ? 'Lo hice' : 'No lo hice'}</button>`}</div>
      ${off ? '' : `<div class="qrows">${qRows(x, rows, key)}</div><div class="edit-row"><button class="btn ghost sm" data-act="qSet" data-k="${key}" data-d="1">+ Serie</button>${rows.length > 1 ? `<button class="btn ghost sm" data-act="qSet" data-k="${key}" data-d="-1">− Serie</button>` : ''}</div>`}</div>`;
  };
  const extras = q.extra.map((e, i) => exBlock(e, 'n' + i, true)).join('');
  const add = q.adding ? html`<div class="qadd"><input id="qa-name" list="qa-list" placeholder="Ejercicio (ej: Giros, Flexiones…)" maxlength="40"><datalist id="qa-list">${COMMON_EXERCISES.map(n => `<option value="${esc(n)}">`).join('')}</datalist>
      <div class="chips">${Object.entries(qKinds).map(([k, t]) => `<button class="chip-btn" data-act="qKind" data-k="${k}" aria-pressed="${q.addKind === k}">${t}</button>`).join('')}</div>
      <label class="fld inline"><span>Series</span><input id="qa-sets" type="number" inputmode="numeric" min="1" max="20" value="3"></label>
      <div class="edit-row"><button class="btn primary" data-act="qAddEx">Añadir</button><button class="btn ghost" data-act="qAdding">Cancelar</button></div></div>`
    : `<button class="btn wide" data-act="qAdding">+ Añadir ejercicio${isAct ? ' (opcional)' : ''}</button>`;
  return html`<div class="sheet-bg" data-act="closeSheet"></div><section class="sheet qlog" role="dialog" aria-label="Apuntar entreno"><div class="sheet-grip"></div>
    <div class="edit-row spread"><h3>Apuntar entreno</h3><button class="btn ghost" data-act="closeSheet">Cerrar</button></div>
    <div class="qsec"><span class="label">¿Cuándo?</span><div class="day-switch">${dayOptions().map(i => `<button data-act="qDay" data-k="${i}" aria-selected="${q.day === i}">${dayChip(i)}</button>`).join('')}</div></div>
    <div class="qsec"><span class="label">¿Qué has hecho?</span><div class="chips">
      <button class="chip-btn" data-act="qMode" data-k="activity" aria-pressed="${isAct}">🏃 Una actividad (baile, correr, partido…)</button>
      ${S.routines.map(x => `<button class="chip-btn" data-act="qRoutine" data-id="${x.id}" aria-pressed="${!isAct && q.routine === x.id}">${esc(x.name)}</button>`).join('')}</div></div>
    ${isAct ? html`<div class="qsec"><label class="fld"><span>Actividad</span><input data-q="activity" list="act-list" value="${esc(q.activity)}" placeholder="Ej: Baile" maxlength="30"></label><datalist id="act-list">${ACTIVITIES.map(a => `<option value="${a}">`).join('')}</datalist>
        <div class="chips">${ACTIVITIES.slice(0, 6).map(a => `<button class="chip-btn" data-act="qAct" data-k="${a}" aria-pressed="${q.activity === a}">${a}</button>`).join('')}</div></div>` : ''}
    <div class="qsec"><span class="label">Intensidad</span><div class="chips">${Object.entries(INTENSITY).map(([k, v]) => `<button class="chip-btn" data-act="qInt" data-k="${k}" aria-pressed="${qInt(q) === k}" title="${v.hint}">${v.label}</button>`).join('')}</div>
      <small class="hint">${INTENSITY[qInt(q)].hint}. ${qEstimate(q)}</small></div>
    <div class="qsec two"><label class="fld"><span>Duración (min)</span><div class="stp"><button class="stp-b" data-act="qMins" data-d="-5" aria-label="Menos minutos">−</button><input data-q="mins" inputmode="numeric" value="${esc(q.mins)}" placeholder="0" aria-label="Minutos"><span class="stp-u">min</span><button class="stp-b" data-act="qMins" data-d="5" aria-label="Más minutos">+</button></div></label>
      <label class="fld"><span>${isAct && /baile/i.test(q.activity) ? 'Coreografía' : 'Nota (opcional)'}</span><input data-q="note" value="${esc(q.note)}" maxlength="60" placeholder="${isAct && /baile/i.test(q.activity) ? 'Ej: coreo de Rosalía' : 'Ej: me he notado fuerte'}"></label></div>
    <div class="qsec"><span class="label">${isAct ? 'Ejercicios y series' : 'Ejercicios de ' + esc(r ? r.name : '')}</span>
      ${!isAct && r ? r.exercises.map(x => exBlock(x, x.id, false)).join('') : ''}${extras}${add}</div>
    <button class="btn primary wide" data-act="qSave">Guardar entreno</button>
    <p class="hint">Lo que dejes vacío no se guarda. Los ejercicios nuevos se quedan en «Otros ejercicios» para que veas cómo mejoras.</p></section>`;
}
// Formulario de ejercicio: crear o editar, con campos según el tipo
const KIND_FIELDS = { peso: ['sets', 'reps', 'start', 'step'], reps: ['sets', 'reps'], seg: ['sets'], min: ['sets'], run: [] };
const KIND_SHORT = { peso: 'Peso', reps: 'Repes', seg: 'Segundos', min: 'Minutos', run: 'Carrera' };
const KIND_HELP = {
  peso: 'Kilos y repes. Cuando hagas todas las series al máximo de repes, te dirá que subas peso.',
  reps: 'Repes, con o sin peso. En cada serie puedes apuntar kilos extra (mochila, mancuerna) o dejarlo vacío. Te pedirá una repe más cada vez.',
  seg: 'Para aguantar tiempo, como la plancha. Te pondrá un objetivo un poco por encima de tu mejor marca.',
  min: 'Para rondas largas, como la comba. Te pondrá un objetivo un poco por encima de tu mejor marca.',
  run: 'Distancia y tiempo. Para ir a más kilómetros o a mejor ritmo.',
};
const COMMON_EXERCISES = ['Flexiones', 'Flexiones diamante', 'Flexiones inclinadas', 'Dominadas', 'Dominadas australianas', 'Fondos en paralelas', 'Fondos en silla', 'Sentadillas sin peso', 'Sentadilla búlgara', 'Zancadas', 'Puente de glúteo', 'Elevación de gemelos', 'Plancha', 'Plancha lateral', 'Abdominales', 'Elevación de piernas', 'Mountain climbers', 'Burpees', 'Jumping jacks', 'Saltar a la comba', 'Correr', 'Bici', 'Sentadilla', 'Peso muerto', 'Peso muerto rumano', 'Press banca', 'Press inclinado', 'Press militar', 'Remo con barra', 'Remo con mancuerna', 'Jalón al pecho', 'Curl de bíceps', 'Curl martillo', 'Extensión de tríceps', 'Elevaciones laterales', 'Prensa de piernas', 'Hip thrust', 'Baile', 'Yoga', 'Pilates', 'Estiramientos', 'Natación', 'Caminar', 'Pádel', 'Fútbol', 'Baloncesto', 'Escalada', 'Patinar', 'Boxeo', 'Giros', 'Saltos', 'Footwork', 'Aislamientos', 'Ondas', 'Freezes', 'Pasadas de coreografía', 'Cardio de baile', 'Estiramientos de baile', 'Pike push-ups', 'Flexiones arqueras', 'Flexiones pseudo planche', 'Chin-ups', 'Remo invertido', 'Elevación de piernas colgado', 'Colgarse de la barra', 'Hollow hold', 'L-sit', 'Pistol squat', 'Pistol squat asistida', 'Dragon flag', 'Dragon flag negativas', 'Muscle-up', 'Muscle-up negativas', 'Front lever tuck', 'Back lever tuck', 'Pino contra la pared', 'Pino libre (intentos)', 'Flexiones en pino', 'Planche lean', 'Fondos en banco', 'Zancadas con salto', 'Puente de glúteo a una pierna'];

function viewExerciseForm(r, x, inSession) {
  const kind = x ? x.kind : 'reps';
  const field = (name, label, value, min, max, step = 1) =>
    `<label class="fld"><span>${label}</span><input name="${name}" type="number" inputmode="decimal" min="${min}" max="${max}" step="${step}" value="${value}"></label>`;
  const group = (key, inner) => `<div class="fgroup" data-needs="${key}" ${KIND_FIELDS[kind].includes(key) ? '' : 'hidden'}>${inner}</div>`;
  const hasHistory = x && S.sessions.some(s => s.ex[x.id]);
  return html`<form class="exform" data-form="saveExercise" data-r="${r.id}" ${x ? `data-x="${x.id}"` : ''} ${inSession ? 'data-session="1"' : ''}>
    <b>${x ? 'Editar ejercicio' : 'Nuevo ejercicio'}</b>
    <label class="fld wide"><span>Nombre</span><input name="n" list="ex-list" autocomplete="off" placeholder="Ej: Dominadas" maxlength="50" required value="${x ? esc(x.name) : ''}"></label>
    <div class="fld wide"><span>Tipo</span><div class="seg" role="radiogroup" aria-label="Tipo de ejercicio">${Object.keys(KIND_SHORT).map(k =>
      `<label><input type="radio" name="k" value="${k}" ${k === kind ? 'checked' : ''}><span>${KIND_SHORT[k]}</span></label>`)}</div></div>
    <p class="hint kind-help">${KIND_HELP[kind]}</p>
    <div class="fgrid">
      ${group('sets', field('s', 'Series', x ? x.sets : 3, 1, 10))}
      ${group('reps', field('a', 'Repes mín', x && x.repMin ? x.repMin : 8, 1, 100) + field('b', 'Repes máx', x && x.repMax ? x.repMax : 12, 1, 100))}
      ${group('start', field('kg0', 'Peso con el que empiezas (kg)', x && x.startKg ? x.startKg : '', 0, 500, 0.5))}
      ${group('step', field('st', 'Cuánto subir cada vez (kg)', x ? x.step : 2.5, 0.5, 20, 0.5))}
    </div>
    ${group('step', '<p class="hint">«Cuánto subir» es el salto de peso cuando ya te sale fácil: normalmente 2,5 kg, o 1 kg en mancuernas pequeñas.</p>')}
    ${when(hasHistory, '<p class="hint">Tu historial y tus récords se mantienen aunque cambies el ejercicio.</p>')}
    <div class="edit-row"><button class="btn primary">${x ? 'Guardar' : 'Añadir'}</button><button type="button" class="btn ghost" data-act="closeExerciseForm">Cancelar</button>
      ${when(x && !inSession, confirmBtn('deleteExercise', x ? x.id : '', 'Borrar ejercicio', `type="button" data-r="${r.id}"`))}</div>
  </form>`;
}
const formOpenFor = (routineId, exId = null) => ui.exForm && ui.exForm.routine === routineId && ui.exForm.id === exId;

function viewRoutine(r) {
  const editing = ui.editing;
  return html`<div class="rt"><div class="rt-h"><b>${esc(r.name)}</b><button class="btn primary" data-act="startSession" data-id="${r.id}">Empezar</button></div>
    <ul class="exl">${r.exercises.map(x => {
      if (formOpenFor(r.id, x.id) && !ui.exForm.inSession) return `<li class="formli">${viewExerciseForm(r, x, false)}</li>`;
      const best = exerciseStats(x.id).best;
      return `<li><button class="exname" data-act="editExercise" data-r="${r.id}" data-id="${x.id}" aria-label="Editar ${esc(x.name)}">${esc(x.name)} <small>${scheme(x)}</small></button>${best ? `<button class="pr" data-act="openStats" data-id="${x.id}" aria-label="Ver progreso de ${esc(x.name)}">${GLYPH.chart}${esc(setText(best))}</button>` : '<small>Sin datos</small>'}</li>`;
    })}${when(!r.exercises.length, '<li><small>Sin ejercicios todavía</small></li>')}</ul>
    ${formOpenFor(r.id) && !ui.exForm.inSession ? viewExerciseForm(r, null, false) : `<button class="btn add-ex" data-act="newExercise" data-r="${r.id}">+ Ejercicio</button>`}</div>`;
}
function viewRoutines() {
  const lastOf = r => { const se = [...S.sessions].reverse().find(x => x.routine === r.id); return se ? shortDate(se.d) : null; };
  const rows = S.routines.map(r => html`<li><button class="rt-row" data-act="openRoutine" data-id="${r.id}"><span class="txt"><b>${esc(r.name)}</b><small>${r.exercises.length} ${r.exercises.length === 1 ? 'ejercicio' : 'ejercicios'}${lastOf(r) ? ' · última vez ' + lastOf(r) : ''}</small></span><span class="go">${GLYPH.chev}</span></button></li>`).join('');
  return html`<section class="panel"><h3>Rutinas <span class="label">+${XP.record} XP por récord</span></h3>
    ${S.routines.length ? `<ul class="rt-list">${rows}</ul>` : '<p class="hint">No tienes rutinas todavía.</p>'}
    <button class="btn wide" data-act="openRoutineTpl">+ Añadir rutina</button>
    <p class="hint">Toca una rutina para ver sus ejercicios antes de empezar, o para editarla.</p>
    ${when(cloud.user, `<button class="link-btn" data-act="toggleShareRoutines">${S.shareRoutines === false ? 'Tus rutinas son privadas · compartirlas con tus amigos' : 'Tus amigos pueden ver y copiar tus rutinas · hacerlas privadas'}</button>`)}</section>`;
}
/** Pantalla de una rutina: ver qué toca hoy, empezar, apuntarla hecha o editarla. */
function viewRoutinePage(r) {
  const editing = ui.editing, body = S.campaigns.find(c => c.tracker === 'body');
  const back = `<button class="back-btn" data-act="open" data-id="${body ? body.id : 'home'}">${GLYPH.prev} ${body ? esc(body.name) : 'Inicio'}</button>`;
  const last = [...S.sessions].reverse().find(x => x.routine === r.id);
  const items = r.exercises.map((x, i) => {
    if (editing && formOpenFor(r.id, x.id) && !ui.exForm.inSession) return `<li class="formli">${viewExerciseForm(r, x, false)}</li>`;
    const st = exerciseStats(x.id), next = nextSession(x), today = next.rows.map(row => parseSet(x.kind, row)).filter(Boolean).map(setText);
    const toca = !today.length ? `${x.sets || 1} ${x.sets === 1 ? 'serie' : 'series'} · primera vez, elige tú` : today.every(t => t === today[0]) ? `${today.length} × ${today[0]}` : today.join(' · ');
    return html`<li class="rx-card ${editing ? 'editing' : ''}"><div class="rx-h"><b>${esc(x.name)}</b><small>${scheme(x)}</small>
        ${editing ? `<span class="rx-tools"><button class="icon-b" data-act="moveExercise" data-r="${r.id}" data-id="${x.id}" data-d="-1" ${i === 0 ? 'disabled' : ''} aria-label="Subir">↑</button><button class="icon-b" data-act="moveExercise" data-r="${r.id}" data-id="${x.id}" data-d="1" ${i === r.exercises.length - 1 ? 'disabled' : ''} aria-label="Bajar">↓</button><button class="btn sm" data-act="editExercise" data-r="${r.id}" data-id="${x.id}">Editar</button></span>` : ''}</div>
      ${editing ? '' : html`<div class="rx-b"><span class="rx-toca"><span class="label">Hoy toca</span>${esc(toca)}</span>${st.best ? `<button class="pr" data-act="openStats" data-id="${x.id}">${GLYPH.chart}${esc(setText(st.best))}</button>` : ''}</div>
      <small class="hint">${esc(next.tip)}</small>`}</li>`;
  }).join('');
  return html`${back}<section class="rt-hero" ${heroStyle()}><span class="label">Rutina</span>
      ${editing ? `<form class="inrow" data-form="renameRoutine" data-id="${r.id}"><input name="rn" value="${esc(r.name)}" maxlength="30" autocomplete="off" aria-label="Nombre de la rutina"><button class="btn">Guardar</button></form>` : `<h2>${esc(r.name)}</h2>`}
      <p>${r.exercises.length} ${r.exercises.length === 1 ? 'ejercicio' : 'ejercicios'} · ${r.exercises.reduce((a, x) => a + (x.sets || 1), 0)} series${last ? ' · última vez ' + shortDate(last.d) : ' · aún no la has hecho'}</p>
      ${editing ? '' : `<div class="train-cta"><button class="btn on-color" data-act="startSession" data-id="${r.id}">${GLYPH.play} Empezar</button><button class="btn dark" data-act="openLog" data-id="${r.id}">✏️ Apuntar hecha</button></div>`}</section>
    <section class="panel nofold"><h3>Ejercicios <button class="btn ${editing ? 'primary' : ''} sm" data-act="toggleEditing">${editing ? 'Listo' : 'Editar'}</button></h3>
      ${r.exercises.length ? `<ul class="rx-list">${items}</ul>` : '<p class="hint">Sin ejercicios todavía. Dale a Editar para añadirlos.</p>'}
      ${editing ? (formOpenFor(r.id) && !ui.exForm.inSession ? viewExerciseForm(r, null, false) : `<button class="btn add-ex" data-act="newExercise" data-r="${r.id}">+ Ejercicio</button>`) : ''}
      ${editing ? `<div class="danger-zone">${confirmBtn('deleteRoutine', r.id, 'Borrar esta rutina')}<small class="hint">Tu historial de entrenos no se borra.</small></div>` : ''}</section>`;
}
function setInput(x, i, field, value, placeholder, label, mode = 'decimal') {
  return `<input inputmode="${mode}" data-x="${x}" data-i="${i}" data-f="${field}" value="${esc(value ?? '')}" placeholder="${placeholder}" aria-label="${label}">`;
}
// ---------- Progreso de un ejercicio: gráfica y sesiones ----------
const METRIC = {
  peso: { label: 'Kilos máximos', unit: 'kg', of: sets => Math.max(...sets.map(st => +st.kg || 0)) },
  reps: { label: 'Repes máximas en una serie', unit: 'repes', of: sets => Math.max(...sets.map(st => +st.r || 0)) },
  seg: { label: 'Mejor tiempo', unit: 's', of: sets => Math.max(...sets.map(st => +st.t || 0)) },
  min: { label: 'Mejor tiempo', unit: 'min', of: sets => Math.max(...sets.map(st => +st.t || 0)) },
  run: { label: 'Distancia', unit: 'km', of: sets => Math.max(...sets.map(st => +st.km || 0)) },
};
const findExercise = id => { for (const r of S.routines) { const x = r.exercises.find(e => e.id === id); if (x) return x; } return null; };
function viewChart(points, unit) {
  if (points.length < 2) return `<div class="chart-empty">${points.length ? 'Con una sesión más ya verás la línea.' : 'Aún no hay sesiones de este ejercicio.'}</div>`;
  const W = 320, H = 150, P = 14, vals = points.map(p => p.v), lo = Math.min(...vals), hi = Math.max(...vals), span = hi - lo || 1;
  const xy = points.map((p, i) => [P + i * (W - 2 * P) / (points.length - 1), H - P - (p.v - lo) / span * (H - 2 * P - 16)]);
  const line = xy.map((q, i) => `${i ? 'L' : 'M'}${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(' ');
  let best = -Infinity;
  const dots = xy.map((q, i) => { const pr = points[i].v > best; best = Math.max(best, points[i].v); return `<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="${pr && i ? 5 : 3.5}" class="${pr && i ? 'pr' : ''}"/>`; }).join('');
  const last = xy[xy.length - 1];
  return html`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolución de ${fmt(points[0].v)} a ${fmt(points[points.length - 1].v)} ${unit}">
    <defs><linearGradient id="cg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".55"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
    <line x1="${P}" x2="${W - P}" y1="${H - P}" y2="${H - P}" class="axis"/>
    <path d="${line} L${last[0].toFixed(1)} ${H - P} L${P} ${H - P} Z" fill="url(#cg)"/>
    <path d="${line}" class="ln"/>${dots}
    <text x="${P}" y="12" class="lbl">${fmt(hi)} ${unit}</text><text x="${P}" y="${H - P - 4}" class="lbl">${fmt(lo)}</text>
    <text x="${last[0].toFixed(1)}" y="${Math.max(12, last[1] - 10).toFixed(1)}" text-anchor="end" class="val">${fmt(points[points.length - 1].v)}</text></svg>`;
}
function viewExerciseStats() {
  const x = findExercise(ui.exStats);
  if (!x) return '';
  const M = METRIC[x.kind] || METRIC.reps, list = S.sessions.filter(se => se.ex[x.id] && se.ex[x.id].length);
  const points = list.map(se => ({ d: se.d, v: M.of(se.ex[x.id]) }));
  const st = exerciseStats(x.id), first = points[0], last = points[points.length - 1];
  const diff = first && last ? last.v - first.v : 0;
  const volume = x.kind === 'peso' ? list.reduce((a, se) => a + se.ex[x.id].reduce((b, set) => b + (+set.kg || 0) * (+set.r || 0), 0), 0) : 0;
  const day = d => new Date(d + 'T12:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  return html`<div class="sheet-bg" data-act="closeStats"></div><section class="sheet" role="dialog" aria-label="Progreso de ${esc(x.name)}">
    <div class="sheet-grip"></div>
    <div class="edit-row spread"><div><span class="label">${M.label}</span><h3>${esc(x.name)}</h3></div><button class="btn ghost" data-act="closeStats">Cerrar</button></div>
    ${viewChart(points, M.unit)}
    <div class="trio"><div class="stat"><b class="num">${st.best ? esc(setText(st.best)) : '–'}</b><small>Récord</small></div>
      <div class="stat"><b class="num ${diff > 0 ? 'up' : ''}">${first ? (diff > 0 ? '+' : '') + fmt(diff) + ' ' + M.unit : '–'}</b><small>Desde el principio</small></div>
      <div class="stat"><b class="num">${x.kind === 'peso' && volume ? fmt(volume) + ' kg' : list.length}</b><small>${x.kind === 'peso' && volume ? 'Kilos movidos' : 'Sesiones'}</small></div></div>
    ${list.length ? html`<h4>Últimas sesiones</h4><ul class="exhist">${list.slice(-8).reverse().map(se => `<li><span>${day(se.d)}</span><b>${esc(se.ex[x.id].map(setText).join(' · '))}</b></li>`)}</ul>` : ''}</section>`;
}

// ---------- Modo entrenamiento: un ejercicio cada vez, series con botones grandes, descanso y cronómetro ----------
const STEP = { r: 1, kg: 2.5, km: 0.5, t: 5 };
const mmss = sec => { sec = Math.max(0, Math.round(sec)); return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`; };
const sessionRoutine = () => S.routines.find(x => x.id === ui.draft.routine);
function stepper(x, i, field, value, unit, label, step) {
  return `<div class="stp"><button class="stp-b" data-act="wsStep" data-x="${x}" data-i="${i}" data-f="${field}" data-d="-${step}" aria-label="Menos ${label}">−</button>
    ${setInput(x, i, field, value, '0', label, field === 'r' ? 'numeric' : 'decimal')}<span class="stp-u">${unit}</span>
    <button class="stp-b" data-act="wsStep" data-x="${x}" data-i="${i}" data-f="${field}" data-d="${step}" aria-label="Más ${label}">+</button></div>`;
}
function viewSetRow(x, s, i, best) {
  const k = x.kind, parsed = parseSet(k, s), pr = s.done && parsed && best != null && setScore(parsed) > best + 0.001;
  const sw = ui.draft.sw && ui.draft.sw.x === x.id && ui.draft.sw.i === i;
  let fields;
  if (k === 'peso') fields = stepper(x.id, i, 'kg', s.kg, 'kg', `kilos serie ${i + 1}`, x.step || STEP.kg) + stepper(x.id, i, 'r', s.r, 'repes', `repes serie ${i + 1}`, 1);
  else if (k === 'reps') fields = stepper(x.id, i, 'r', s.r, 'repes', `repes serie ${i + 1}`, 1) + `<label class="extra-kg">+ ${setInput(x.id, i, 'kg', s.kg, '0', `kilos extra serie ${i + 1}`)} kg extra</label>`;
  else if (k === 'run') fields = stepper(x.id, i, 'km', s.km, 'km', 'kilómetros', STEP.km) + stepper(x.id, i, 't', s.t, 'min', 'minutos', 1);
  else fields = stepper(x.id, i, 't', s.t, k === 'seg' ? 's' : 'min', `tiempo serie ${i + 1}`, k === 'seg' ? 5 : 0.5)
    + `<button class="sw ${sw ? 'on' : ''}" data-act="wsWatch" data-x="${x.id}" data-i="${i}">${sw ? GLYPH.stop : GLYPH.play}<span data-sw="${x.id}-${i}">${sw ? mmss((Date.now() - ui.draft.sw.start) / 1000) : 'Cronómetro'}</span></button>`;
  return `<div class="wset ${s.done ? 'done' : ''} ${pr ? 'pr' : ''}" data-pk="s-${x.id}-${i}"><span class="wset-n">${i + 1}</span><div class="wset-f">${fields}</div>
    <button class="wset-ok check" data-act="wsDone" data-x="${x.id}" data-i="${i}" aria-pressed="${!!s.done}" aria-label="Serie ${i + 1} hecha">${GLYPH.check}</button>${pr ? '<em class="pr-badge">¡Récord!</em>' : ''}</div>`;
}
function sessionCounts() {
  const r = sessionRoutine(); let total = 0, done = 0;
  r.exercises.forEach(x => (ui.draft.ex[x.id] || []).forEach(s => { total++; if (s.done) done++; }));
  return { total, done };
}
function viewSession() {
  const d = ui.draft, r = sessionRoutine(), xs = r.exercises;
  if (!d.started) d.started = Date.now();
  d.cur = Math.min(d.cur || 0, Math.max(0, xs.length - 1));
  const { total, done } = sessionCounts(), x = xs[d.cur];
  const allDone = ex => { const rows = d.ex[ex.id] || []; return rows.length && rows.every(s => s.done); };
  const tabs = xs.map((e, i) => `<button class="ws-tab ${i === d.cur ? 'on' : ''} ${allDone(e) ? 'ok' : ''}" data-act="wsGo" data-k="${i}">${allDone(e) ? GLYPH.check : `<span>${i + 1}</span>`}${esc(e.name)}</button>`).join('');
  let card = '<p class="hint">Esta rutina no tiene ejercicios. Añade uno abajo.</p>';
  if (x) {
    const st = exerciseStats(x.id), next = nextSession(x), rows = d.ex[x.id] || (d.ex[x.id] = []);
    const best = st.best ? setScore(st.best) : null;
    card = html`<div class="ws-card"><div class="ws-h"><span class="label">Ejercicio ${d.cur + 1} de ${xs.length}</span><h3>${esc(x.name)}</h3>
        <small>${scheme(x)}${st.last ? ' · la última vez: ' + esc(st.last.sets.map(setText).join(', ')) : ''}</small>${when(st.last, `<button class="link-btn" data-act="openStats" data-id="${x.id}">${GLYPH.chart} Ver progreso</button>`)}</div>
      <div class="ws-tips"><span class="sug ${next.levelUp ? '' : 'keep'}">${esc(next.tip)}</span>${st.best ? `<span class="best">${GLYPH.trophy} Récord: ${esc(setText(st.best))}</span>` : ''}</div>
      <div class="wsets">${rows.map((row, i) => viewSetRow(x, row, i, best))}</div>
      <div class="edit-row"><button class="btn" data-act="addSet" data-x="${x.id}">+ Serie</button>${when(rows.length > 1, `<button class="btn ghost" data-act="removeSet" data-x="${x.id}">− Serie</button>`)}</div>
      <div class="ws-nav"><button class="btn" data-act="wsGo" data-k="${d.cur - 1}" ${d.cur === 0 ? 'disabled' : ''}>${GLYPH.prev}</button>
        ${d.cur < xs.length - 1 ? `<button class="btn ${allDone(x) ? 'primary' : ''} grow" data-act="wsGo" data-k="${d.cur + 1}">Siguiente: ${esc(xs[d.cur + 1].name)} ${GLYPH.next}</button>` : `<button class="btn primary grow" data-act="saveSession">Terminar entreno</button>`}</div></div>`;
  }
  const rest = d.rest && d.rest.until > Date.now() ? d.rest : null;
  return html`<section class="ws">
    <div class="ws-top" ${heroStyle()}><div class="ws-row"><div><span class="label">${ui.logDay ? `Apuntando para ${dayWord(ui.logDay)}` : 'Entrenando'}</span><b>${esc(r.name)}</b></div>
      <div class="ws-clock num" data-clock="${d.started}">${mmss((Date.now() - d.started) / 1000)}</div></div>
      <div class="ws-prog"><div class="xpbar"><i style="width:${total ? done / total * 100 : 0}%"></i></div><span class="num">${done}/${total} series</span></div></div>
    <div class="ws-tabs">${tabs}</div>
    ${card}
    ${formOpenFor(r.id) && ui.exForm.inSession ? `<div class="panel">${viewExerciseForm(r, null, true)}</div>` : '<button class="btn add-ex" data-act="newExercise" data-r="' + r.id + '" data-session="1">+ Añadir ejercicio a esta sesión</button>'}
    <div class="ws-end"><button class="btn primary wide" data-act="saveSession">Terminar y guardar</button>
      <button class="btn ghost" data-act="discardSession">${ui.armed === 'session' ? '¿Seguro? Toca otra vez para descartar' : 'Descartar entreno'}</button>
      <p class="hint">Marca cada serie con ✓ al hacerla y empieza el descanso. Lo que dejes vacío no se guarda. Los ejercicios que añadas se quedan en la rutina.</p></div>
    <div class="rest ${rest ? 'on' : ''}" role="timer" aria-live="off"><span class="label">Descanso</span><b class="num" data-rest>${rest ? mmss((rest.until - Date.now()) / 1000) : ''}</b>
      <button class="rest-b" data-act="wsRest" data-d="-15">−15</button><button class="rest-b" data-act="wsRest" data-d="15">+15</button><button class="rest-b skip" data-act="wsRest" data-d="0">Saltar</button>
      <i class="rest-bar" data-restbar style="width:${rest ? (rest.until - Date.now()) / 1000 / rest.total * 100 : 0}%"></i></div></section>`;
}
// Reloj de la sesión, descanso y cronómetro: se actualizan solos sin repintar la pantalla
setInterval(() => {
  const d = ui.draft; if (!d) return;
  document.querySelectorAll('[data-clock]').forEach(e => { e.textContent = mmss((Date.now() - +e.dataset.clock) / 1000); });
  if (d.sw) { const e = document.querySelector(`[data-sw="${d.sw.x}-${d.sw.i}"]`); if (e) e.textContent = mmss((Date.now() - d.sw.start) / 1000); }
  const bar = document.querySelector('.rest');
  if (d.rest && bar) {
    const left = (d.rest.until - Date.now()) / 1000;
    if (left <= 0) {
      d.rest = null; saveDraft(); bar.classList.remove('on');
      try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch (e) { /* sin vibración */ }
      beep(); toast('¡Descanso terminado! A por la siguiente');
    } else { bar.querySelector('[data-rest]').textContent = mmss(left); bar.querySelector('[data-restbar]').style.width = `${left / d.rest.total * 100}%`; }
  }
}, 250);
let audioCtx = null;
function beep() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.18].forEach(t => { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.frequency.value = 880; o.connect(g); g.connect(audioCtx.destination);
      g.gain.setValueAtTime(0.0001, audioCtx.currentTime + t); g.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + t + 0.15);
      o.start(audioCtx.currentTime + t); o.stop(audioCtx.currentTime + t + 0.16); });
  } catch (e) { /* sin sonido */ }
}
function showWorkoutSummary(sum) {
  const el = document.createElement('div');
  el.className = 'lvlup ws-sum';
  el.innerHTML = html`<div><span class="pill">${GLYPH.star}Entreno completado</span><h2>${esc(sum.name)}</h2>
    <div class="sum-grid"><div><b class="num">${mmss(sum.secs)}</b><small>duración</small></div><div><b class="num">${sum.sets}</b><small>series</small></div>
      <div><b class="num">${sum.volume ? fmt(sum.volume) : '–'}</b><small>kg movidos</small></div><div><b class="num">+${sum.xp}</b><small>XP</small></div></div>
    ${sum.records ? `<p class="sum-pr">${GLYPH.trophy} ${sum.records === 1 ? '1 récord nuevo' : sum.records + ' récords nuevos'}</p>` : ''}
    <button class="btn dark wide" data-close>¡Genial!</button></div>`;
  el.addEventListener('click', e => { if (e.target === el || e.target.closest('[data-close]')) el.remove(); });
  document.body.appendChild(el);
}
const sessionOpen = () => !!ui.draft && S.routines.some(r => r.id === ui.draft.routine);
function viewBody() {
  return sessionOpen() ? viewSession() : viewWeight() + viewTraining() + viewRoutines();
}

// --- Mapa de niveles
function viewMission(c, l, m) {
  const done = isDone(m), p = progress(m);
  let control = '', detail = '', title = esc(m.name);
  if (m.type === 'count') {
    title += ` (${m.target})`;
    control = `<div class="counter"><button data-act="decrement" aria-label="Restar">−</button><span class="num">${m.count}/${m.target}</span><button data-act="increment" aria-label="Sumar">+</button></div>`;
    detail = bar(p, 'mbar');
  } else if (m.type === 'auto') {
    control = '<span class="auto">auto</span>';
    if (COUNTERS[m.auto]) { title += `: ${m.target}`; detail = `<small class="num">${Math.min(COUNTERS[m.auto](), m.target)}/${m.target}</small>` + bar(p, 'mbar'); }
    else if (m.auto === 'wloss' || m.auto === 'wreach') detail = `<small class="num">${pct(p)}%</small>` + bar(p, 'mbar');
  }
  const box = !m.type || m.type === 'check'
    ? `<button class="check" data-act="toggleMission" aria-pressed="${done}" aria-label="Marcar ${esc(m.name)}">${GLYPH.check}</button>`
    : `<span class="check" aria-hidden="true">${GLYPH.check}</span>`;
  const doneDate = done && m.doneAt && m.type !== 'auto' ? `<small>${new Date(m.doneAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</small>` : '';
  return html`<li class="m ${done ? 'done' : ''}" data-c="${c.id}" data-l="${l.id}" data-m="${m.id}">${box}
    <div class="txt"><span>${title}</span>${detail}${doneDate}</div>
    ${ui.editing ? confirmBtn('deleteMission', m.id, 'Quitar') : control}<span class="xp">${m.type === 'count' ? `+${unitXP(m)} c/u` : `+${m.xp}`}</span></li>`;
}
function viewLevel(c, l, i, current, forceOpen = false) {
  const p = levelProgress(l), done = l.missions.length && p >= 1, state = done ? 'done' : i === current ? 'current' : 'upcoming';
  const key = c.id + l.id, open = forceOpen || (ui.open[key] ?? state === 'current');
  const left = l.missions.filter(m => !isDone(m)).length, xp = l.missions.reduce((a, m) => a + missionMaxXP(m), 0);
  const status = !l.missions.length ? 'Sin misiones' : `${done ? 'Superado' : (state === 'current' ? 'En curso · ' : '') + left + ' por hacer'} · ${xp} XP`;
  return html`<div class="lv-card ${state}" data-open="${open ? 1 : 0}" ${state === 'current' ? `style="--cbg:${colorVar(c)}"` : ''}>
    <button class="lv-h" ${forceOpen ? 'tabindex="-1"' : `data-act="toggleLevel" data-k="${key}" aria-expanded="${open}"`}><span class="lv-n">${done ? GLYPH.star : i + 1}</span><div class="t"><b>${esc(l.name)}</b><small>${status}</small></div>${forceOpen ? '' : `<span class="chev">${GLYPH.chev}</span>`}</button>
    ${when(open, html`<ul class="missions">${l.missions.map(m => viewMission(c, l, m))}</ul>
      ${when(ui.editing, html`<form class="addm" data-form="addMission" data-c="${c.id}" data-l="${l.id}"><input name="n" placeholder="Nueva misión" maxlength="80" required>
        <input name="t" type="number" min="1" max="999" placeholder="Veces" title="Déjalo vacío si es de una sola vez">
        <select name="x" aria-label="Esfuerzo">${Object.entries(EFFORT).map(([k, e]) => `<option value="${k}" ${k === 'normal' ? 'selected' : ''}>${e.label}</option>`).join('')}</select>
        <button class="btn">Añadir</button><small class="hint addm-hint">La XP va por esfuerzo para que sea justo para todos. Si pones «Veces», suma un poco por cada vez (máx. ${COUNT_XP_MAX}).</small>${when(c.levels.length > 1, confirmBtn('deleteLevel', l.id, 'Borrar nivel', `data-c="${c.id}" type="button"`))}</form>`)}`)}</div>`;
}
function viewMap(c) {
  const current = currentLevelIndex(c);
  const head = html`<div class="edit-row spread"><h2 class="sec-t">Niveles</h2>${when(ui.editing, '<button class="btn" data-act="addLevel">+ Nivel</button>')}</div>`;
  // Editando: la lista de siempre, que es más cómoda para añadir y borrar
  if (ui.editing) return html`<section class="stack">${head}<div class="map">${c.levels.map((l, i) => viewLevel(c, l, i, current))}</div></section>`;
  // Jugando: un camino con un nodo por nivel, tu personaje en el que vas y el jefe al final
  const n = c.levels.length, ROW = 104, X = [50, 76, 50, 24], sel = Math.min((ui.mapSel || {})[c.id] ?? current, n - 1);
  const pts = c.levels.map((_, i) => [X[i % 4], i * ROW + ROW / 2]);
  const seg = (a, b) => `M${a[0]} ${a[1]} C${a[0]} ${a[1] + ROW / 2} ${b[0]} ${b[1] - ROW / 2} ${b[0]} ${b[1]}`;
  const all = pts.slice(1).map((p, i) => seg(pts[i], p)).join(' ');
  const walked = pts.slice(1, current + 1).map((p, i) => seg(pts[i], p)).join(' ');
  const b = boss(c), m = mood();
  const nodes = c.levels.map((l, i) => {
    const p = levelProgress(l), done = l.missions.length && p >= 1, state = done ? 'done' : i === current ? 'current' : i < current ? 'done' : 'upcoming';
    const isBoss = b && b.level === l, side = X[i % 4] > 50 ? 'left' : 'right';
    const face = isBoss && !done ? `<img class="node-boss ${b.hp === 0 ? 'weak' : ''}" src="${IMG.boss}" alt="">` : done ? GLYPH.star : i + 1;
    const ring = state === 'current' && l.missions.length ? `<svg class="node-ring" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="16" pathLength="100" stroke-dasharray="${Math.round(p * 100)} 100"/></svg>` : '';
    return html`<div class="node-wrap" style="left:${X[i % 4]}%;top:${i * ROW + ROW / 2}px">
      <button class="node ${state} ${i === sel ? 'sel' : ''} ${isBoss ? 'is-boss' : ''}" data-act="pickLevel" data-k="${i}" aria-pressed="${i === sel}" aria-label="Nivel ${i + 1}: ${esc(l.name)}" ${state === 'current' ? `style="--node:${colorVar(c)}"` : ''}>${ring}<span>${face}</span></button>
      <span class="node-name ${side}">${esc(l.name)}</span>
      ${when(i === current && !(b && b.defeated), `<div class="node-me ${side === 'left' ? 'right' : 'left'} mood-${m.kind}" aria-hidden="true"><img src="${Character.image(S.look, { items: wearing(), mood: m.kind })}" alt=""></div>`)}</div>`;
  });
  return html`<section class="stack">${head}
    <div class="path" style="height:${n * ROW}px;--cc:${colorVar(c)}">
      <svg class="path-line" viewBox="0 0 100 ${n * ROW}" preserveAspectRatio="none" aria-hidden="true"><path class="todo" d="${all}"/>${when(walked, `<path class="walked" d="${walked}"/>`)}</svg>
      ${nodes}</div>
    <div class="map">${viewLevel(c, c.levels[sel], sel, current, true)}</div></section>`;
}
function viewBoss(c) {
  const b = boss(c);
  if (!b) return '';
  const hp = Math.round(b.hp * 100), weak = !b.defeated && hp === 0;
  const msg = b.defeated ? 'Derrotado. Campaña superada.'
    : weak ? 'Sin vida. Ahora te toca rematarlo en el último nivel.'
    : `Cada misión de los niveles anteriores le quita vida. ${b.left === 1 ? 'Queda 1' : 'Quedan ' + b.left}.`;
  return html`<section class="boss ${b.defeated ? 'defeated' : ''} ${weak ? 'weak' : ''} ${ui.bossHit === c.id ? 'hit' : ''}">
    <img src="${IMG.boss}" alt="">
    <div class="txt"><span class="label">${esc(b.level.name)}</span><b>${esc(b.target || 'El jefe')}</b>
      <div class="hp" role="meter" aria-valuenow="${hp}" aria-valuemin="0" aria-valuemax="100" aria-label="Vida del jefe"><i style="width:${hp}%"></i></div>
      <small class="num">${b.defeated ? '' : `HP ${hp}/100 · `}${msg}</small></div></section>`;
}
function viewShop() {
  const have = coins(), recent = S.purchases.slice(-6).reverse();
  return html`<section class="c-hero shop-hero"><span class="pill">${GLYPH.bag}Tienda</span>
    <h2>Tus recompensas</h2><p>Canjea monedas por planes con tus amigos y cosas para tu personaje.</p>
    <div class="row"><span class="big num coins-big"><img src="${IMG.coin}" alt=""><span data-count="shop">${have}</span></span></div></section>
    <section class="shield-card ${S.shields ? 'has' : ''}"><div class="shield-ico">🛡️<b class="num">${S.shields}</b></div>
      <div class="txt"><b>Escudo de racha</b><small>Si un día no haces nada, se gasta solo y tu racha sigue. Puedes tener ${SHIELD_MAX}.</small>${coinBadge(SHIELD_COST)}</div>
      ${S.shields >= SHIELD_MAX ? '<span class="owned">Al máximo</span>' : have >= SHIELD_COST ? `<button class="btn ${ui.armed === 'buy:shield' ? 'primary' : 'dark'}" data-act="buyShield">${ui.armed === 'buy:shield' ? '¿Comprar?' : 'Comprar'}</button>` : `<span class="need num">Te faltan ${SHIELD_COST - have}</span>`}</section>
    ${viewInviteShop(have)}${viewMyVouchers(false)}
    <section class="panel"><h3>Armario especial <span class="label">para tu personaje</span></h3>
      <ul class="wardrobe">${Object.entries(Character.PREMIUM).map(([key, def]) => {
        const [field, value] = key.split(':'), st = unlockState(key), armed = ui.armed === 'ward:' + key;
        const preview = Object.assign({}, Character.upgrade(S.look), { [field]: value }, value === 'llamas' ? { stripe: '#E07A2E', topColor: '#1F1F24' } : {}, value === 'capa' ? { bagColor: '#C0392B' } : {});
        const action = st.ok ? '<span class="owned">Lo tienes</span>'
          : st.cost ? (have >= st.cost ? `<button class="btn ${armed ? 'primary' : ''}" data-act="buyWardrobe" data-k="${key}">${armed ? '¿Comprar?' : 'Comprar'}</button>` : `<span class="need num">Te faltan ${st.cost - have}</span>`)
          : `<span class="need">${esc(st.how)}</span>`;
        return `<li class="${st.ok ? 'got' : ''}"><img src="${Character.image(preview)}" alt=""><div class="txt"><b>${esc(def.name)}</b>${when(st.cost, coinBadge(st.cost || 0))}</div>${action}</li>`;
      })}</ul></section>
    ${when(recent.length, html`<section class="panel"><h3>Canjeado</h3><ul class="hist">${recent.map(p =>
      `<li><b>${esc(p.name)}</b><span class="num">${shortDate(p.d)} · ${p.cost}</span>${when(ui.editing, confirmBtn('deletePurchase', p.id, 'Devolver'))}</li>`)}</ul></section>`)}`;
}
function viewDayCheck(c) {
  const cfg = dayCheckOf(c); if (!cfg) return '';
  const date = logDate(), ok = (c.checkDays || []).includes(date), st = dayCheckStreak(c);
  const title = ui.logDay ? `${cfg.past} ${dayWord(ui.logDay)}?` : ok ? cfg.yes : cfg.q;
  return html`<section class="day-check"><ul class="quests"><li><button class="quest di ${ok ? 'done' : ''}" data-act="dayCheck" data-id="${c.id}"><span class="check">${ok ? GLYPH.check : `<span class="di-e">${cfg.emoji}</span>`}</span><span class="txt"><b>${esc(title)}</b><small>${st > 1 ? `🔥 ${st} días seguidos` : ok ? 'Suma un día a tus misiones de días leyendo' : 'Márcalo y suma un día a tus misiones de días leyendo'}</small></span></button></li></ul></section>`;
}
function viewCampaign(c) {
  const p = campaignProgress(c), inSession = c.tracker === 'body' && sessionOpen();
  if (inSession) return viewSession();
  return html`<section class="c-hero" style="background:${colorVar(c)}"><span class="ico">${ICONS[c.icon] || ICONS.star}</span>
    <span class="pill">${GLYPH.star}Nivel ${currentLevelIndex(c) + 1} de ${c.levels.length}</span>
    <h2>${esc(c.name)}</h2>${when(c.sub, `<p>${esc(c.sub)}</p>`)}
    <div class="row"><span class="big num">${pct(p)}%</span>
      <div class="edit-row">${when(ui.editing && S.campaigns.length > 1, `<button class="btn danger on-color" data-act="deleteCampaign">${ui.armed === c.id ? '¿Borrar campaña?' : 'Borrar'}</button>`)}<button class="btn dark" data-act="toggleEditing">${ui.editing ? 'Listo' : 'Editar'}</button></div></div>
    ${bar(p)}</section>
    ${viewDayCheck(c)}${when(!inSession, viewBoss(c))}${when(c.tracker === 'body', viewBody())}${when(!inSession, viewMap(c))}`;
}

function render() {
  const campaign = S.campaigns.find(c => c.id === ui.view);
  if (!campaign && !['shop', 'ranking', 'profile', 'player', 'ideas'].includes(ui.view) && !S.routines.some(r => 'rt:' + r.id === ui.view)) ui.view = 'home';
  const y = scroller().scrollTop;
  const nav = document.getElementById('nav');
  if (!S.onboarded) {
    document.getElementById('app').innerHTML = viewAccount() + viewOnboarding();
    nav.hidden = true;
    return;
  }
  nav.hidden = false;
  const main = campaign ? viewCampaign(campaign) : ui.view === 'shop' ? viewShop() : ui.view === 'ranking' ? viewRanking() : ui.view === 'profile' ? viewProfile() : ui.view === 'player' ? viewPlayer() : ui.view === 'ideas' ? viewIdeas() : ui.view.startsWith('rt:') && S.routines.some(r => 'rt:' + r.id === ui.view) ? viewRoutinePage(S.routines.find(r => 'rt:' + r.id === ui.view)) : viewHome();
  document.getElementById('app').innerHTML = viewTop() + viewLogBanner() + viewAccount() + main + (ui.exStats ? viewExerciseStats() : '') + (ui.qlog ? viewQuickLog() : '') + (ui.startPick ? viewStartPicker() : '') + (ui.routineTpl ? viewRoutineTpl() : '')
    + `<datalist id="ex-list">${COMMON_EXERCISES.map(n => `<option value="${n}">`).join('')}</datalist>`;
  nav.innerHTML = viewNav();
  enhance();
  scroller().scrollTop = y;
}

// ---------- Detalles visuales tras pintar: paneles plegables, animaciones de entrada y de "hecho" ----------
const FOLD_KEY = 'modo-campana-plegados';
const FOLD_CLOSED = ['Canjeado'];   // empiezan cerrados
const NO_FOLD = ['Nueva campaña', 'Mandar una idea', 'Para Claude'];
let folds = {}; try { folds = JSON.parse(localStorage.getItem(FOLD_KEY) || '{}'); } catch { folds = {}; }
const fx = { view: null, done: null, counts: {} };
const reduceMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function enhance() {
  const app = document.getElementById('app');
  document.documentElement.style.setProperty('--accent', colorHex(S.color));
  // Paneles plegables: el título abre y cierra, y se recuerda cómo lo dejaste
  app.querySelectorAll('section.panel').forEach(p => {
    const h = p.firstElementChild;
    if (!h || h.tagName !== 'H3' || p.classList.contains('nofold')) return;
    const title = (h.childNodes[0] && h.childNodes[0].textContent || '').trim();
    if (!title || NO_FOLD.includes(title)) return;
    const key = (S.campaigns.some(c => c.id === ui.view) ? 'c' : ui.view) + ':' + title;
    const open = key in folds ? folds[key] : !FOLD_CLOSED.includes(title);
    const body = document.createElement('div'); body.className = 'fold-body';
    const inner = document.createElement('div'); inner.className = 'fold-in';
    while (h.nextSibling) inner.appendChild(h.nextSibling);
    body.appendChild(inner); p.appendChild(body);
    p.classList.add('fold'); p.classList.toggle('open', open);
    Object.assign(h.dataset, { act: 'fold', k: key });
    h.setAttribute('role', 'button'); h.setAttribute('tabindex', '0'); h.setAttribute('aria-expanded', String(open));
    h.insertAdjacentHTML('beforeend', `<span class="fold-chev" aria-hidden="true">${GLYPH.chev}</span>`);
  });
  // Al cambiar de pantalla, los bloques entran escalonados y las barras se llenan
  // Solo al cambiar tú de pantalla (no al abrir la app, ni cuando se repinta la misma pantalla al llegar datos de la nube:
  // eso reiniciaba la animación varias veces seguidas y la pantalla daba saltos)
  const key = ui.view;
  if (fx.view !== null && fx.view !== key && !reduceMotion()) {
    app.classList.remove('enter'); void app.offsetWidth; app.classList.add('enter');
    clearTimeout(fx.t); fx.t = setTimeout(() => app.classList.remove('enter'), 700);
  } else if (fx.view === key) { app.classList.remove('enter'); clearTimeout(fx.t); }
  // Lo que acabas de completar hace "pop"
  const doneNow = new Set([...app.querySelectorAll('.done[data-pk], .m.done[data-m]')].map(e => e.dataset.pk || 'm' + e.dataset.m));
  if (fx.done && fx.view === key) app.querySelectorAll('.done[data-pk], .m.done[data-m]').forEach(e => { if (!fx.done.has(e.dataset.pk || 'm' + e.dataset.m)) e.classList.add('pop'); });
  fx.done = doneNow;
  // Los números que cambian (monedas) cuentan hasta su valor nuevo
  app.querySelectorAll('[data-count]').forEach(e => {
    const k = e.dataset.count, to = +e.textContent.replace(/\D/g, ''), from = fx.counts[k];
    fx.counts[k] = to;
    if (from == null || from === to || reduceMotion()) return;
    const t0 = performance.now(), dur = 700;
    const step = now => { const t = Math.min(1, (now - t0) / dur), v = Math.round(from + (to - from) * (1 - (1 - t) ** 3)); e.textContent = v; if (t < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step); e.classList.add('bump');
  });
  // Las hojas que suben desde abajo solo se animan al abrirse, no cada vez que cambias algo dentro
  const sheet = app.querySelector('.sheet');
  if (sheet && fx.sheet) { sheet.classList.add('still'); const bg = app.querySelector('.sheet-bg'); if (bg) bg.classList.add('still'); }
  fx.sheet = !!sheet;
  document.body.classList.toggle('sheet-open', !!sheet);   // la barra de abajo se esconde mientras hay una hoja abierta
  fx.view = key;
}

let toastTimer = null;
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 1900);
}
function showChest(chest) {
  const el = document.createElement('div');
  el.className = 'lvlup chest-pop';
  el.innerHTML = html`<div class="${chest.gold ? 'gold' : ''}"><span class="pill">${GLYPH.star}${chest.gold ? '¡Cofre dorado!' : 'Cofre del día'}</span>
    <img src="${IMG.chestOpen}" alt=""><div class="loot"><span class="num">+${chest.coins}</span><img src="${IMG.coin}" alt="monedas"></div>
    <p class="hint on-lilac num">+${chest.xp} XP · Vuelve mañana a por otro</p><button class="btn dark wide">Genial</button></div>`;
  el.addEventListener('click', () => el.remove());
  document.body.appendChild(el);
}
function showLevelUp(L) {
  const pick = pendingPicks().includes(L), el = document.createElement('div');
  el.className = 'lvlup';
  el.innerHTML = html`<div><span class="pill">${GLYPH.star}Subes de nivel</span><div class="big">${L}</div><h2>${rankFor(L)}</h2>
    ${pick ? `<div class="lv-opts">${pickOptions(L).map(i => `<img src="${itemImg(i.key)}" alt="">`).join('')}</div><p class="hint on-lilac">Toca <b>Elegir objeto</b> y quédate con uno de estos tres.</p><button class="btn wide" data-go-inv>Elegir objeto</button>` : ''}
    <button class="btn dark wide">Seguir</button></div>`;
  el.addEventListener('click', e => { el.remove(); if (e.target.closest('[data-go-inv]')) { ui.view = 'home'; render(); const inv = document.querySelector('.inv'); if (inv) inv.scrollIntoView({ behavior: 'smooth', block: 'start' }); } });
  document.body.appendChild(el);
}

/* =========================================================
   8. Acciones (data-act="nombre" en el HTML)
   ========================================================= */
const findCampaign = id => S.campaigns.find(c => c.id === id);
const activeCampaign = () => findCampaign(ui.view);
function findMission(el) {
  const row = el.closest('.m'), c = findCampaign(row.dataset.c), l = c.levels.find(x => x.id === row.dataset.l);
  return { c, l, m: l.missions.find(x => x.id === row.dataset.m) };
}
/** Borrado en dos toques: el primero arma el botón, el segundo confirma. */
function confirmTwice(id, change) {
  if (ui.armed === id) { ui.armed = null; update(change, { reward: false }); }
  else { ui.armed = id; render(); }
}
const repaint = fn => (...args) => { fn(...args); render(); };
/** Cambia una misión y, si le quita vida al jefe de su campaña, lo enseña. */
function hitBoss(el, change) {
  const { c } = findMission(el), before = boss(c);
  update(change);
  const after = boss(c);
  if (!before || !after || after.defeated || after.hp >= before.hp - 0.001) return;
  ui.bossHit = c.id; render();
  setTimeout(() => toast(`−${Math.round((before.hp - after.hp) * 100)} HP al jefe`), 1900);
  setTimeout(() => { ui.bossHit = null; render(); }, 700);
}

const actions = {
  syncInfo: repaint(() => { ui.account = !ui.account; }),
  toggleAccount: repaint(() => { ui.account = false; }),
  syncNow: () => { pull(); toast('Sincronizando…'); },
  signOut: async () => {
    if (avisos.endpoint) { await cloud.client.from('push_subs').delete().eq('endpoint', avisos.endpoint); avisos.endpoint = null; savePushLocal(); }
    await cloud.client.auth.signOut();
    // Lo tuyo ya está en tu cuenta: el dispositivo se queda limpio para que otra persona pueda entrar con la suya
    S = defaultState(); storage.set(STORAGE.state, S); ui.draft = null; saveDraft();
    Object.assign(ui, { account: false, view: 'home' }); render();
    toast('Sesión cerrada. Tu progreso está guardado en tu cuenta');
  },
  signUp: async el => {
    const F = el.closest('form').elements;
    if (!F.email.checkValidity() || !F.password.checkValidity()) { toast('Pon un email y una contraseña de 6 caracteres o más'); return; }
    const { data, error } = await cloud.client.auth.signUp({ email: F.email.value.trim(), password: F.password.value, options: { emailRedirectTo: location.origin + location.pathname } });
    if (error) { ui.authMsg = { text: authError(error) }; toast(authError(error)); render(); return; }
    if (!data.session) { ui.authMsg = { ok: true, text: 'Cuenta creada, pero falta confirmarla: abre el correo que te ha llegado, toca el enlace y luego vuelve aquí y dale a Entrar. Si no llega en unos minutos, mira en spam o avisa a Pau.' }; render(); }
    else ui.authMsg = null;
  },
  open: el => { if (el.dataset.id === 'ranking') loadRanking(); if (el.dataset.id === 'ideas') loadIdeas(); ui.view = el.dataset.id; ui.addingCampaign = false; ui.editing = false; ui.exForm = null; ui.addingReward = false; render(); scrollTop0(); },
  toggleEditing: repaint(() => { ui.editing = !ui.editing; }),
  pickLevel: el => { ui.mapSel = ui.mapSel || {}; ui.mapSel[ui.view] = +el.dataset.k; render(); const card = document.querySelector('.map .lv-card'); if (card) { card.classList.add('swap'); if (card.getBoundingClientRect().top > window.innerHeight - 160) card.scrollIntoView({ behavior: 'smooth', block: 'center' }); } },
  toggleLevel: el => { const card = el.closest('.lv-card'); ui.open[el.dataset.k] = card.dataset.open !== '1'; render(); },

  // Misiones
  toggleMission: el => hitBoss(el, s => { const { c, m } = findMission(el); m.done = !m.done; m.doneAt = m.done ? Date.now() : null; logActivity(s, c.id, m.done ? 1 : -1); if (m.done && ui.logDay) m.doneAt = new Date(logDate() + 'T20:00').getTime(); }),
  increment: el => hitBoss(el, s => { const { c, m } = findMission(el); if (m.count < m.target) { m.count++; countLog(m, 1); logActivity(s, c.id, 1); if (m.count >= m.target) m.doneAt = Date.now(); } }),
  decrement: el => hitBoss(el, s => { const { c, m } = findMission(el); if (m.count > 0) { m.count--; countLog(m, -1); logActivity(s, c.id, -1); if (m.count < m.target) m.doneAt = null; } }),

  // Perfil, bienvenida y ranking
  toggleStarter: el => { const k = el.dataset.k, on = !ui.onboardCamps[k]; ui.onboardCamps[k] = on; el.classList.toggle('on', on); el.setAttribute('aria-pressed', on); },
  setProfileColor: el => update(s => { s.color = colorHex(el.dataset.k); }, { reward: false }),
  setLook: el => update(s => {
    const v = el.dataset.v;
    s.look = Object.assign({}, Character.upgrade(s.look), { [el.dataset.f]: v === 'true' ? true : v === 'false' ? false : v === 'null' ? null : v });
  }, { reward: false }),
  lookTab: repaint(el => { ui.lookTab = el.dataset.k; }),
  randomLook: () => update(s => { s.look = Character.randomLook(); }, { reward: false }),
  removePhoto: () => update(s => { s.photo = null; }, { reward: false }),
  rankTab: repaint(el => { ui.rankTab = el.dataset.k; }),
  lockedLook: el => { const st = unlockState(el.dataset.k); toast(`${Character.PREMIUM[el.dataset.k].name}: ${st.how.charAt(0).toLowerCase() + st.how.slice(1)}`); },
  buyWardrobe: el => {
    const key = el.dataset.k, def = Character.PREMIUM[key];
    if (!def || !def.cost || coins() < def.cost || S.wardrobe.includes(key)) return;
    if (ui.armed !== 'ward:' + key) { ui.armed = 'ward:' + key; render(); return; }
    ui.armed = null;
    update(s => { s.wardrobe.push(key); s.purchases.push({ id: uid(), name: def.name, cost: def.cost, d: today(), wardrobe: key }); }, { reward: false });
    toast(`¡${def.name} es tuyo! Póntelo en tu perfil`);
  },
  nudge: async el => {
    const to = el.dataset.id;
    if (!cloud.user || S.nudgesSent[to] === today()) return;
    const { error } = await cloud.client.from('nudges').insert({ from_id: cloud.user.id, to_id: to });
    if (error) { toast(missingTable(error) ? 'Para esto falta ejecutar supabase-social.sql en Supabase' : 'No se ha podido enviar. Prueba otra vez'); return; }
    update(s => { s.nudgesSent[to] = today(); }, { reward: false });
    const r = (ui.ranking || []).find(x => x.user_id === to);
    notify(to, 'nudge', `💪 ${S.name} te da caña`, '¡Vamos! Haz algo hoy y súbete al ranking.');
    toast(`Le has dado caña a ${r ? r.name : 'tu amigo'}`);
  },
  fold: el => {
    const p = el.closest('.panel'), open = !p.classList.contains('open');
    p.classList.toggle('open', open); el.setAttribute('aria-expanded', String(open));
    folds[el.dataset.k] = open; try { localStorage.setItem(FOLD_KEY, JSON.stringify(folds)); } catch {}
  },
  ideaKind: el => { ui.ideaKind = el.dataset.k; render(); },
  setIdea: async el => {
    const { error } = await cloud.client.from('suggestions').update({ status: el.dataset.k }).eq('id', el.dataset.id);
    if (error) { toast('No se pudo cambiar'); return; }
    toast(el.dataset.k === 'aceptada' ? 'Aceptada: ya sale en el texto para Claude' : el.dataset.k === 'hecha' ? 'Marcada como hecha' : 'Descartada');
    loadIdeas();
  },
  replyIdea: async el => {
    const idea = (ui.ideas || []).find(i => String(i.id) === el.dataset.id);
    const note = window.prompt('Nota para quien la mandó (se verá debajo de su idea):', idea && idea.reply ? idea.reply : '');
    if (note === null) return;
    const { error } = await cloud.client.from('suggestions').update({ reply: note.trim().slice(0, 300) || null }).eq('id', el.dataset.id);
    if (error) toast('No se pudo guardar'); else loadIdeas();
  },
  deleteIdea: async el => {
    if (ui.armed !== el.dataset.id) { ui.armed = el.dataset.id; render(); return; }
    ui.armed = null;
    const { error } = await cloud.client.from('suggestions').delete().eq('id', el.dataset.id.replace('idea', ''));
    if (error) toast('No se pudo borrar'); else { toast('Idea borrada'); loadIdeas(); }
  },
  copyForClaude: async () => {
    const text = ideasForClaude();
    try { await navigator.clipboard.writeText(text); toast('Copiado. Pégalo en el chat con Claude'); }
    catch { const t = document.getElementById('for-claude'); if (t) { t.focus(); t.select(); } toast('Mantén pulsado el texto y copia'); }
  },
  openPlayer: el => { ui.playerId = el.dataset.id; ui.view = 'player'; render(); scrollTop0(); },
  shareApp: async () => {
    const url = location.origin + location.pathname, text = `Te reto en Modo Campaña. Hazte una cuenta y a ver quién sube más esta semana: ${url}`;
    try { if (navigator.share) { await navigator.share({ title: 'Modo Campaña', text, url }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(text); toast('Invitación copiada: pégala donde quieras'); } catch (e) { toast(url); }
  },

  // Diarias, cofre, tienda e inventario
  toggleHabit: el => update(s => { const day = dayOf(s, logDate()), h = (day.habits = day.habits || {}); h[el.dataset.k] = !h[el.dataset.k]; }),
  openChest: () => {
    const date = logDate(), quests = dailyQuests(date);
    if (!quests.every(q => questDone(q, date)) || (S.daily[date] || {}).chest) return;
    const gold = Math.random() < 0.15, chest = { coins: (15 + Math.floor(Math.random() * 16)) * (gold ? 2 : 1), xp: gold ? 50 : 25, gold };
    update(s => { dayOf(s, date).chest = chest; });
    showChest(chest);
    if (gold) postFeed('chest', `ha abierto un cofre dorado: +${chest.coins} monedas`, 'chest:' + date);
  },
  pickItem: el => {
    const l = +el.dataset.l, k = el.dataset.k, it = ALL_ITEMS.find(i => i.key === k);
    update(s => { s.itemPicks[l] = k; s.unequipped = s.unequipped.filter(x => x !== k); if (it.slot) ALL_ITEMS.filter(i => i.slot === it.slot && i.key !== k && !s.unequipped.includes(i.key)).forEach(i => s.unequipped.push(i.key)); }, { reward: false });
    toast(`🎁 ¡${it.name} para ti! Tu personaje ya lo lleva`);
  },
  toggleWear: el => update(s => {
    const it = ALL_ITEMS.find(i => i.key === el.dataset.k);
    if (it && it.slot && !wearing().includes(it.key)) {   // al ponerte algo en una mano, se quita lo que llevaras en esa mano
      s.unequipped = s.unequipped.filter(x => x !== it.key);
      ALL_ITEMS.filter(i => i.slot === it.slot && i.key !== it.key && !s.unequipped.includes(i.key)).forEach(i => s.unequipped.push(i.key));
      return;
    }
    const k = el.dataset.k;
    s.unequipped = s.unequipped.includes(k) ? s.unequipped.filter(x => x !== k) : [...s.unequipped, k];
  }, { reward: false }),
  buyReward: el => {
    const r = S.rewards.find(x => x.id === el.dataset.id);
    if (!r || coins() < r.cost) return;
    if (ui.armed !== 'buy:' + r.id) { ui.armed = 'buy:' + r.id; render(); return; }
    ui.armed = null;
    update(s => s.purchases.push({ id: uid(), rewardId: r.id, name: r.name, cost: r.cost, d: today() }), { reward: false });
    toast(`¡Disfrútalo! −${r.cost} monedas`);
  },
  addRewardForm: repaint(() => { ui.addingReward = true; }),
  deleteReward: el => confirmTwice(el.dataset.id, s => { s.rewards = s.rewards.filter(x => x.id !== el.dataset.id); }),
  deletePurchase: el => confirmTwice(el.dataset.id, s => {
    const p = s.purchases.find(x => x.id === el.dataset.id);
    if (p && p.wardrobe) s.wardrobe = s.wardrobe.filter(k => k !== p.wardrobe);
    s.purchases = s.purchases.filter(x => x.id !== el.dataset.id);
  }),
  deleteMission: el => { const { l, m } = findMission(el); confirmTwice(m.id, () => { l.missions = l.missions.filter(x => x !== m); }); },
  addLevel: () => { const c = activeCampaign(), l = level(`Nivel ${c.levels.length + 1}`, []); ui.open[c.id + l.id] = true; update(() => c.levels.push(l), { reward: false }); },
  deleteLevel: (el, ev) => { ev.preventDefault(); const c = findCampaign(el.dataset.c); confirmTwice(el.dataset.id, () => { c.levels = c.levels.filter(x => x.id !== el.dataset.id); }); },

  // Campañas
  toggleNewCampaign: () => { ui.addingCampaign = !ui.addingCampaign; render(); const p = document.querySelector('.new-camp'); if (p) p.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
  pickIcon: el => { ui.newIcon = el.dataset.k; document.querySelectorAll('.icons button').forEach(b => b.setAttribute('aria-pressed', b.dataset.k === ui.newIcon)); },
  pickColor: el => { ui.newColor = el.dataset.k; document.querySelectorAll('.swatches button').forEach(b => b.setAttribute('aria-pressed', b.dataset.k === ui.newColor)); },
  addTemplate: el => {
    const k = el.dataset.k, t = TEMPLATES.find(x => x.key === k), base = defaultCampaigns().find(c => c.id === k);
    const c = t ? fromTemplate(t) : base;
    if (!c) return;
    Object.assign(ui, { addingCampaign: false, view: c.id, editing: false });
    update(s => { if (!s.campaigns.some(x => x.id === c.id)) s.campaigns.push(c); }, { reward: false });
    scrollTop0(); toast(`${t ? t.emoji : '✨'} Campaña «${c.name}» lista. ¡A por el nivel 1!`);
  },
  createCampaign: () => {
    const input = document.getElementById('nc-name'), name = input.value.trim();
    if (!name) { input.focus(); return; }
    const c = { id: uid(), name, icon: ui.newIcon, color: ui.newColor, sub: '', levels: [level('Nivel 1', [])] };
    Object.assign(ui, { addingCampaign: false, view: c.id, editing: true });
    ui.open[c.id + c.levels[0].id] = true;
    update(s => s.campaigns.push(c), { reward: false });
    scrollTop0();
  },
  deleteCampaign: () => {
    const c = activeCampaign();
    if (ui.armed !== c.id) { ui.armed = c.id; render(); return; }
    Object.assign(ui, { armed: null, editing: false, view: 'home' });
    update(s => { s.campaigns = s.campaigns.filter(x => x !== c); }, { reward: false });
  },

  // Peso y entrenos
  logWeight: () => {
    const kg = num(document.getElementById('kg').value);
    if (!(kg >= 30 && kg <= 250)) { toast('Pon un peso entre 30 y 250 kg'); return; }
    update(s => {
      const d = logDate(), same = s.weight.log.find(p => p.d === d);
      if (same) same.kg = kg; else { s.weight.log.push({ d, kg }); s.weight.log.sort((a, b) => (a.d < b.d ? -1 : 1)); }
      if (s.weight.start == null) s.weight.start = kg;
    });
  },
  setGoal: () => {
    const kg = num(document.getElementById('goal').value);
    if (!(kg >= 30 && kg <= 250)) { toast('Pon un peso entre 30 y 250 kg'); return; }
    update(s => { s.weight.goal = kg; });
  },
  toggleTrainedToday: () => update(s => {
    const d = logDate(), i = s.train.indexOf(d);
    if (i >= 0) s.train.splice(i, 1); else { s.train.push(d); s.train.sort(); }
  }),
  logDay: el => { ui.logDay = +el.dataset.k; render(); if (ui.logDay) toast(`Apuntando para ${dayWord(ui.logDay)}`); },

  // Rutinas y sesiones
  startSession: el => {
    const r = S.routines.find(x => x.id === el.dataset.id);
    ui.startPick = false; ui.editing = false;
    { const b = S.campaigns.find(c => c.tracker === 'body'); if (b) ui.view = b.id; }
    ui.draft = { routine: r.id, started: Date.now(), cur: 0, restSec: 90, ex: Object.fromEntries(r.exercises.map(x => [x.id, nextSession(x).rows])) };
    saveDraft(); render(); scrollTop0();
  },
  discardSession: () => {
    if (ui.armed !== 'session') { ui.armed = 'session'; render(); return; }
    ui.armed = null; ui.draft = null; ui.exForm = null; saveDraft(); render();
  },
  addSet: el => {
    const rows = ui.draft.ex[el.dataset.x], x = S.routines.find(r => r.id === ui.draft.routine).exercises.find(e => e.id === el.dataset.x);
    rows.push(rows.length ? Object.assign({}, rows[rows.length - 1], { done: false }) : blankSet(x));
    saveDraft(); render();
  },
  pickInvite: el => {
    const it = inviteOf(el.dataset.k);
    if (coins() < it.cost) { toast(`Te faltan ${it.cost - coins()} monedas`); return; }
    ui.invite = ui.invite && ui.invite.key === it.key ? null : { key: it.key, to: null }; render();
  },
  pickInviter: el => { ui.invite.to = el.dataset.id; ui.armed = null; render(); },
  buyAvatar: async el => {
    if (!cloud.user) return;
    const cost = avatarCost();
    if (coins() < cost) { toast(`Te faltan ${cost - coins()} monedas`); return; }
    if (!Character.upgrade(S.look).gen) { toast('Elige primero si eres chica o chico'); return; }
    if (ui.armed !== 'buy:avatar') { ui.armed = 'buy:avatar'; render(); return; }
    ui.armed = null; el.disabled = true;
    const items = wearing(), spec = Object.assign({}, Character.upgrade(S.look), { items });
    const { data, error } = await cloud.client.from('avatar_requests').insert({ user_id: cloud.user.id, name: S.name, spec, prompt: lookToPrompt(S.look, items), cost }).select('id,status').maybeSingle();
    if (error) { toast(missingTable(error) ? 'Falta activar los personajes en Supabase' : 'No se pudo pedir'); el.disabled = false; return; }
    update(s => { s.purchases.push({ id: uid(), name: 'Personaje ilustrado', cost, d: today(), avatar: data && data.id }); s.avatarReq = { id: data && data.id, status: 'pendiente' }; }, { reward: false });
    toast('⏳ Pedido enviado. Te avisamos cuando esté listo');
    avatarTimer = setTimeout(checkAvatar, 120000);
  },
  toggleAvatar: () => { update(s => { s.avatarOff = !s.avatarOff; }, { reward: false }); },
  buyInvite: async el => {
    const inv = ui.invite, it = inviteOf(inv && inv.key), f = (ui.ranking || []).find(r => r.user_id === (inv && inv.to));
    if (!inv || !f || coins() < it.cost) return;
    if (ui.armed !== 'buy:invite') { ui.armed = 'buy:invite'; render(); return; }
    ui.armed = null; el.disabled = true;
    const { data, error } = await cloud.client.from('vouchers').insert({ from_id: cloud.user.id, to_id: f.user_id, from_name: S.name, to_name: f.name, reward: it.key, cost: it.cost }).select().maybeSingle();
    if (error) { toast(missingTable(error) ? 'Falta activar las invitaciones en Supabase' : 'No se pudo canjear'); el.disabled = false; return; }
    update(s => { s.purchases.push({ id: uid(), name: `${it.name} con ${f.name}`, cost: it.cost, d: today(), voucher: data && data.id }); }, { reward: false });
    ui.invite = null; toast(`🎁 Vale enviado: ${f.name} te invita ${it.verb}`); loadVouchers();
    notify(f.user_id, 'invite', `🎁 ${S.name} ha canjeado un vale`, `Te toca invitarle ${it.verb}.`);
  },
  voucherDone: async el => {
    const v = (ui.vouchers || []).find(x => String(x.id) === el.dataset.id); if (!v) return;
    const { error } = await cloud.client.from('vouchers').update({ status: 'done', done_at: new Date().toISOString() }).eq('id', v.id);
    if (error) { toast('No se pudo'); return; }
    v.status = 'done';
    if (!S.vouchersDone[v.id]) { S.vouchersDone[v.id] = 'thanks'; const bonus = Math.round(v.cost * THANKS); update(s => { s.coinLog.push({ id: uid(), d: today(), amount: bonus, note: `Gracias por invitar a ${v.from_name}` }); }, { reward: false }); toast(`¡Bien hecho! +${bonus} monedas`); }
    postFeed('invite', `ha invitado a ${v.from_name} ${inviteOf(v.reward).verb}`, 'voucher:' + v.id);
    notify(v.from_id, 'invite', `🎉 ${S.name} ha cumplido tu vale`, `Ya te ha invitado ${inviteOf(v.reward).verb}. ¡Disfrútalo!`);
    loadVouchers();
  },
  deleteVoucher: async el => {
    const v = (ui.vouchers || []).find(x => String(x.id) === el.dataset.id); if (!v) return;
    if (ui.armed !== 'v' + v.id) { ui.armed = 'v' + v.id; el.textContent = '¿Seguro? Se le devuelven'; return; }
    ui.armed = null;
    const { error } = await cloud.client.from('vouchers').update({ status: 'declined' }).eq('id', v.id);
    if (error) toast('No se pudo'); else loadVouchers();
  },
  installApp: async () => { if (!installPrompt) return; installPrompt.prompt(); try { await installPrompt.userChoice; } catch (e) { /* cancelado */ } installPrompt = null; render(); },
  hideInstall: () => { try { localStorage.setItem('modo-campana-instalar', 'no'); } catch (e) { /* sin almacenamiento */ } render(); toast('Lo tienes en tu perfil, en Avisos, por si cambias de idea'); },
  retrySync: () => { if (cloud.user) { toast('Reintentando…'); schedulePush(0); } },
  pushOn: () => enablePush(),
  pushOff: () => disablePush(),
  pushKind: el => { const k = el.dataset.k; avisos.kinds = avisos.kinds.includes(k) ? avisos.kinds.filter(x => x !== k) : [...avisos.kinds, k]; savePushLocal(); pushSync(true); render(); },
  pushTest: async () => {
    try { const reg = await navigator.serviceWorker.ready; await reg.showNotification('🔔 Así te llegarán los avisos', { body: 'Todo listo. Te avisaré cuando haga falta.', icon: 'icons/icon-192-cofre.png', badge: 'icons/favicon-cofre.png' }); }
    catch (e) { toast('No se pudo mostrar el aviso'); }
  },
  toggleRival: el => {
    const id = el.dataset.id;
    update(s => { s.rivals = s.rivals.includes(id) ? s.rivals.filter(x => x !== id) : [...s.rivals, id]; if (s.rivals.length) s.rivalsOnly = true; }, { reward: false });
  },
  rivalsOnly: el => update(s => { s.rivalsOnly = el.dataset.k === '1'; }, { reward: false }),
  buyShield: () => {
    if (S.shields >= SHIELD_MAX || coins() < SHIELD_COST) return;
    if (ui.armed !== 'buy:shield') { ui.armed = 'buy:shield'; render(); return; }
    ui.armed = null;
    update(s => { s.shields++; s.purchases.push({ id: uid(), name: 'Escudo de racha', cost: SHIELD_COST, d: today() }); }, { reward: false });
    toast('🛡️ Escudo listo. Tu racha está protegida');
  },
  duelMetric: el => { ui.duelForm.metric = el.dataset.k; render(); },
  duelStake: el => { ui.duelForm.stake = +el.dataset.k; render(); },
  challenge: async el => {
    const r = (ui.ranking || []).find(x => x.user_id === el.dataset.id), f = ui.duelForm;
    if (!r || !cloud.user || coins() < f.stake) return;
    el.disabled = true;
    const { error } = await cloud.client.from('duels').insert({ challenger: cloud.user.id, opponent: r.user_id, challenger_name: S.name, opponent_name: r.name, metric: f.metric, stake: f.stake });
    if (error) { toast(missingTable(error) ? 'Falta activar los duelos en Supabase' : 'No se pudo enviar el reto'); el.disabled = false; return; }
    toast(`⚔️ Reto enviado a ${r.name}`); loadDuels();
    notify(r.user_id, 'duel', `⚔️ ${S.name} te reta a un duelo`, `La semana del lunes ${shortDate(nextMonday())}, a ${DUEL_METRIC[f.metric].desc}${f.stake ? ` con ${f.stake} monedas en juego` : ''}. ¿Aceptas?`);
  },
  acceptDuel: async el => {
    const d = (ui.duels || []).find(x => String(x.id) === el.dataset.id); if (!d) return;
    if (coins() < d.stake) { toast(`Necesitas ${d.stake} monedas para aceptar`); return; }
    const start = nextMonday(), patch = { status: 'active', start_day: start, end_day: addDays(start, 7), challenger_score: 0, opponent_score: 0 };
    const { error } = await cloud.client.from('duels').update(patch).eq('id', d.id);
    if (error) { toast('No se pudo aceptar'); return; }
    Object.assign(d, patch); toast(`⚔️ ¡Duelo aceptado! Empieza el lunes ${shortDate(start)}`); syncDuels(); render();
    notify(d.challenger, 'duel', `⚔️ ${S.name} ha aceptado tu duelo`, `Empieza el lunes ${shortDate(start)} y dura toda la semana.`);
  },
  declineDuel: async el => {
    const d = (ui.duels || []).find(x => String(x.id) === el.dataset.id); if (!d) return;
    const { error } = await cloud.client.from('duels').update({ status: iAmChallenger(d) ? 'cancelled' : 'declined' }).eq('id', d.id);
    if (error) toast('No se pudo'); else loadDuels();
  },
  react: async el => {
    if (!cloud.user || !ui.feed) return;
    const f = ui.feed.find(x => String(x.id) === el.dataset.id), e = el.dataset.k; if (!f) return;
    f.feed_reactions = f.feed_reactions || [];
    const mine = f.feed_reactions.some(r => r.emoji === e && r.user_id === cloud.user.id);
    f.feed_reactions = mine ? f.feed_reactions.filter(r => !(r.emoji === e && r.user_id === cloud.user.id)) : [...f.feed_reactions, { user_id: cloud.user.id, emoji: e }];
    render();
    const q = cloud.client.from('feed_reactions');
    const { error } = mine ? await q.delete().eq('feed_id', f.id).eq('user_id', cloud.user.id).eq('emoji', e) : await q.insert({ feed_id: f.id, user_id: cloud.user.id, emoji: e });
    if (error) { toast('No se pudo reaccionar'); loadFeed(); }
    else if (!mine) notify(f.user_id, 'react', `${e} A ${S.name} le mola tu logro`, `${f.text.charAt(0).toUpperCase() + f.text.slice(1)}`.replace(/^Ha /, 'Has '));
  },
  openRoutine: el => { ui.view = 'rt:' + el.dataset.id; ui.editing = false; ui.exForm = null; render(); scrollTop0(); },
  moveExercise: el => update(s => { const r = s.routines.find(x => x.id === el.dataset.r), i = r.exercises.findIndex(x => x.id === el.dataset.id), j = i + (+el.dataset.d); if (j < 0 || j >= r.exercises.length) return; [r.exercises[i], r.exercises[j]] = [r.exercises[j], r.exercises[i]]; }, { reward: false }),
  rtOpen: el => { ui.rtOpen = el.dataset.id; ui.exForm = null; render(); },
  dailyForm: () => { ui.dailyForm = ui.dailyForm ? null : { emoji: '💊', name: '', hour: null }; render(); const i = document.getElementById('di-name'); if (i) i.focus(); },
  dailyPreset: el => { const [e, n] = el.dataset.k.split('|'); Object.assign(ui.dailyForm, { emoji: e, name: n }); render(); },
  dailyEmoji: el => { const i = document.getElementById('di-name'); ui.dailyForm.name = i ? i.value : ui.dailyForm.name; ui.dailyForm.emoji = el.dataset.k; render(); },
  dailySave: () => {
    const name = (document.getElementById('di-name').value || '').trim(), h = document.getElementById('di-hour').value;
    if (!name) { toast('Escribe qué tienes que hacer'); return; }
    const item = { id: uid(), name: name.slice(0, 40), emoji: ui.dailyForm.emoji || '✅', hour: h === '' ? null : +h };
    ui.dailyForm = null;
    update(s => { s.dailyItems.push(item); }, { reward: false });
    toast(item.hour != null ? `Añadido. ${avisos.endpoint ? `Te avisaré a las ${item.hour}:00 si no lo has marcado` : 'Activa los avisos en tu perfil para que te recuerde'}` : 'Añadido a «Cada día»');
  },
  dayCheck: el => {
    const c = findCampaign(el.dataset.id), cfg = c && dayCheckOf(c); if (!cfg) return;
    const before = boss(c);
    update(s => {
      const date = logDate(), days = (c.checkDays = c.checkDays || []), on = !days.includes(date);
      const bumps = (c.checkBumps = c.checkBumps || {}), all = c.levels.flatMap(l => l.missions);
      if (on) {
        days.push(date);
        bumps[date] = all.filter(m => m.type === 'count' && cfg.match.test(m.name) && m.count < m.target).map(m => { m.count++; countLog(m, 1, date); logActivity(s, c.id, 1); if (m.count >= m.target) m.doneAt = Date.now(); return m.id; });
      } else {
        // Al desmarcar se deshace solo lo que sumó ese check
        days.splice(days.indexOf(date), 1);
        (bumps[date] || []).forEach(id => { const m = all.find(x => x.id === id); if (m && m.count > 0) { m.count--; countLog(m, -1, date); logActivity(s, c.id, -1); } });
        delete bumps[date];
      }
    });
    const after = boss(c);
    if (before && after && !after.defeated && after.hp < before.hp - 0.001) setTimeout(() => toast(`−${Math.round((before.hp - after.hp) * 100)} HP al jefe`), 900);
  },
  dailyToggle: el => update(s => { const d = logDate(), list = (s.dailyDone[d] = s.dailyDone[d] || []), i = list.indexOf(el.dataset.id); if (i >= 0) list.splice(i, 1); else list.push(el.dataset.id); if (!list.length) delete s.dailyDone[d]; }),
  dailyEdit: () => { ui.dailyEdit = !ui.dailyEdit; ui.dailyForm = null; render(); },
  dailyDelete: el => confirmTwice(el.dataset.id, s => { s.dailyItems = s.dailyItems.filter(i => i.id !== el.dataset.id); }),
  openRoutineTpl: () => { ui.routineTpl = true; render(); loadSharedRoutines(); },
  tplCat: el => { ui.tplCat = el.dataset.k; render(); },
  copyRoutine: el => {
    const p = (ui.sharedRoutines || []).find(x => x.user_id === el.dataset.id), r = p && (p.routines || [])[+el.dataset.k]; if (!r) return;
    const id = uid(); ui.routineTpl = false; ui.view = 'rt:' + id; ui.editing = false;
    update(s => { s.routines.push({ id, from: p.user_id + ':' + r.name, name: `${r.name} (de ${p.name})`.slice(0, 40), exercises: (r.ex || []).map(x => Object.assign(exercise(x.name, x.sets || 3, x.repMin || 0, x.repMax || 0, x.kind || 'reps', x.step || 2.5), x.startKg ? { startKg: x.startKg } : {})) }); }, { reward: false });
    scrollTop0(); toast(`Rutina de ${p.name} copiada. Ya es tuya: cámbiala como quieras`);
  },
  toggleShareRoutines: () => update(s => { s.shareRoutines = s.shareRoutines === false; }, { reward: false }),
  addRoutineTpl: el => {
    const t = ROUTINE_TEMPLATES.find(x => x.key === el.dataset.k); if (!t || S.routines.some(r => r.tpl === t.key)) return;
    const id = uid(); ui.routineTpl = false; ui.view = 'rt:' + id; ui.editing = false;
    update(s => { s.routines.push({ id, tpl: t.key, name: t.name.replace('Calistenia · ', 'Cali · '), exercises: t.ex() }); }, { reward: false });
    toast(`${t.emoji} Rutina «${t.name}» añadida`);
  },
  openStart: () => { ui.startPick = true; render(); },
  openLog: el => {
    const r = (el && el.dataset && el.dataset.id && S.routines.find(x => x.id === el.dataset.id)) || S.routines[0];
    ui.qlog = { day: ui.logDay || 0, mode: r ? 'routine' : 'activity', routine: r ? r.id : null, activity: '', mins: '', note: '', ex: {}, skip: {}, extra: [], adding: false, addKind: 'reps' };
    if (r) r.exercises.forEach(x => { ui.qlog.ex[x.id] = nextSession(x).rows; });
    render();
  },
  closeSheet: () => {
    const sh = document.querySelector('.sheet');
    const done = () => { ui.qlog = null; ui.startPick = false; ui.routineTpl = false; ui.exStats = null; render(); };
    if (sh) { sh.classList.add('out'); const bg = document.querySelector('.sheet-bg'); if (bg) bg.classList.add('out'); setTimeout(done, 220); } else done();
  },
  qDay: el => { ui.qlog.day = +el.dataset.k; render(); },
  qMode: () => { Object.assign(ui.qlog, { mode: 'activity', routine: null, ex: Object.fromEntries(Object.entries(ui.qlog.ex).filter(([k]) => k[0] === 'n')), skip: {} }); render(); },
  qRoutine: el => {
    const r = S.routines.find(x => x.id === el.dataset.id), q = ui.qlog, keep = Object.fromEntries(Object.entries(q.ex).filter(([k]) => k[0] === 'n'));
    Object.assign(q, { mode: 'routine', routine: r.id, skip: {}, ex: keep });
    r.exercises.forEach(x => { q.ex[x.id] = nextSession(x).rows; });
    render();
  },
  qAct: el => { ui.qlog.activity = el.dataset.k; render(); },
  qInt: el => { ui.qlog.int = el.dataset.k; render(); },
  qMins: el => { const q = ui.qlog; q.mins = String(Math.max(0, (parseInt(q.mins, 10) || 0) + (+el.dataset.d))); render(); },
  qSkip: el => { const q = ui.qlog; q.skip[el.dataset.k] = !q.skip[el.dataset.k]; render(); },
  qSet: el => {
    const q = ui.qlog, k = el.dataset.k, rows = q.ex[k] || (q.ex[k] = []);
    const x = k[0] === 'n' ? q.extra[+k.slice(1)] : findExercise(k);
    if (+el.dataset.d > 0) rows.push(rows.length ? Object.assign({}, rows[rows.length - 1]) : blankSet(x)); else if (rows.length > 1) rows.pop();
    render();
  },
  qAdding: () => { ui.qlog.adding = !ui.qlog.adding; render(); const i = document.getElementById('qa-name'); if (i) i.focus(); },
  qKind: el => { const name = document.getElementById('qa-name'), sets = document.getElementById('qa-sets'); ui.qlog.addKind = el.dataset.k; ui.qlog.addName = name ? name.value : ''; ui.qlog.addSets = sets ? sets.value : 3; render(); const n2 = document.getElementById('qa-name'); if (n2) n2.value = ui.qlog.addName || ''; const s2 = document.getElementById('qa-sets'); if (s2) s2.value = ui.qlog.addSets || 3; },
  qAddEx: () => {
    const q = ui.qlog, name = (document.getElementById('qa-name').value || '').trim(), n = Math.max(1, Math.min(20, parseInt(document.getElementById('qa-sets').value, 10) || 3));
    if (!name) { toast('Pon el nombre del ejercicio'); return; }
    const known = S.routines.flatMap(r => r.exercises).find(x => x.name.toLowerCase() === name.toLowerCase());
    const x = { name: known ? known.name : name, kind: known ? known.kind : q.addKind };
    q.extra.push(x); q.ex['n' + (q.extra.length - 1)] = Array.from({ length: n }, () => blankSet(x));
    q.adding = false; render();
  },
  qRemove: el => { const q = ui.qlog, i = +el.dataset.k.slice(1); q.extra.splice(i, 1); const ex = {}; Object.entries(q.ex).forEach(([k, v]) => { if (k[0] !== 'n') ex[k] = v; else { const j = +k.slice(1); if (j < i) ex[k] = v; else if (j > i) ex['n' + (j - 1)] = v; } }); q.ex = ex; render(); },
  qSave: () => {
    const q = ui.qlog, r = q.mode === 'routine' ? S.routines.find(x => x.id === q.routine) : null;
    const mins = parseInt(q.mins, 10) || 0, activity = (q.activity || '').trim();
    if (q.mode === 'activity' && !activity) { toast('Escribe qué actividad has hecho'); return; }
    const d = new Date(); d.setDate(d.getDate() - q.day); const day = dateKey(d);
    let sum = null; const xp0 = totalXP();
    update(s => {
      const ex = {};
      if (r) r.exercises.forEach(x => { if (q.skip[x.id]) return; const sets = (q.ex[x.id] || []).map(st => parseSet(x.kind, st)).filter(Boolean); if (sets.length) ex[x.id] = sets; });
      q.extra.forEach((e, i) => {
        const sets = (q.ex['n' + i] || []).map(st => parseSet(e.kind, st)).filter(Boolean); if (!sets.length) return;
        let x = s.routines.flatMap(rr => rr.exercises).find(y => y.name.toLowerCase() === e.name.toLowerCase());
        if (!x) {
          let other = s.routines.find(rr => rr.other);
          if (!other) { other = { id: uid(), name: 'Otros ejercicios', other: true, exercises: [] }; s.routines.push(other); }
          x = { id: uid(), name: e.name, kind: e.kind, sets: sets.length, reps: e.kind === 'peso' ? [8, 12] : e.kind === 'reps' ? [8, 15] : undefined, step: e.kind === 'peso' ? 2.5 : undefined };
          other.exercises.push(x);
        }
        ex[x.id] = (ex[x.id] || []).concat(sets);
      });
      if (!Object.keys(ex).length && !mins) { sum = false; return; }
      const name = r ? r.name : activity;
      s.sessions.push({ id: uid(), d: day, routine: r ? r.id : null, rname: name, ex, mins, note: (q.note || '').trim(), activity: r ? null : activity, int: qInt(q) });
      s.sessions.sort((a, b) => (a.d < b.d ? -1 : a.d > b.d ? 1 : 0));
      if (!s.train.includes(day)) { s.train.push(day); s.train.sort(); }
      sum = { name, secs: mins * 60, sets: Object.values(ex).reduce((a, l) => a + l.length, 0), volume: Object.values(ex).flat().reduce((a, st) => a + (st.kg || 0) * (st.r || 0), 0) };
    });
    if (sum === false) { toast('Pon al menos los minutos o alguna serie'); return; }
    ui.qlog = null; render();
    sum.records = 0; sum.xp = Math.max(0, totalXP() - xp0);
    showWorkoutSummary(sum);
    const note = (q.note || '').trim();
    postFeed('workout', r ? `ha entrenado ${r.name}${mins ? ` · ${mins} min` : ''} · ${sum.sets} ${sum.sets === 1 ? 'serie' : 'series'}` : `ha hecho ${mins ? mins + ' min de ' : ''}${activity.toLowerCase()}${note ? ` · ${note}` : ''}`);
  },
  openStats: el => { ui.exStats = el.dataset.id; render(); },
  closeStats: () => { const sh = document.querySelector('.sheet'); if (sh) { sh.classList.add('out'); document.querySelector('.sheet-bg').classList.add('out'); setTimeout(() => { ui.exStats = null; render(); }, 220); } else { ui.exStats = null; render(); } },
  wsGo: el => { const k = +el.dataset.k, n = sessionRoutine().exercises.length; if (k < 0 || k >= n) return; ui.draft.cur = k; saveDraft(); render(); const t = document.querySelector('.ws-tabs .on'); if (t) t.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }); const c = document.querySelector('.ws-card'); if (c) { c.classList.add('swap'); c.scrollIntoView({ block: 'start', behavior: 'smooth' }); } },
  wsStep: el => {
    const row = ui.draft.ex[el.dataset.x][+el.dataset.i], f = el.dataset.f, d = num(el.dataset.d);
    const v = Math.max(0, Math.round(((num(row[f]) || 0) + d) * 100) / 100);
    row[f] = f === 'r' ? String(Math.round(v)) : String(v);
    saveDraft(); const input = document.querySelector(`input[data-x="${el.dataset.x}"][data-i="${el.dataset.i}"][data-f="${f}"]`); if (input) input.value = row[f];
  },
  wsDone: el => {
    const x = sessionRoutine().exercises.find(e => e.id === el.dataset.x), row = ui.draft.ex[x.id][+el.dataset.i];
    if (!row.done && !parseSet(x.kind, row)) { toast('Pon primero cuánto has hecho'); return; }
    row.done = !row.done;
    if (row.done) { const sec = ui.draft.restSec || 90; ui.draft.rest = { until: Date.now() + sec * 1000, total: sec }; }
    saveDraft(); render();
  },
  wsRest: el => {
    const d = ui.draft, k = num(el.dataset.d);
    if (!d.rest) return;
    if (!k) d.rest = null;
    else { d.rest.until += k * 1000; d.rest.total = Math.max(15, d.rest.total + k); d.restSec = Math.max(15, Math.min(600, (d.restSec || 90) + k)); }
    saveDraft(); render();
  },
  wsWatch: el => {
    const d = ui.draft, x = sessionRoutine().exercises.find(e => e.id === el.dataset.x), i = +el.dataset.i;
    if (d.sw && d.sw.x === x.id && d.sw.i === i) {
      const secs = (Date.now() - d.sw.start) / 1000, row = d.ex[x.id][i];
      row.t = x.kind === 'seg' ? String(Math.round(secs)) : String(Math.round(secs / 30) / 2 || 0.5);
      d.sw = null; row.done = true; const sec = d.restSec || 90; d.rest = { until: Date.now() + sec * 1000, total: sec };
    } else d.sw = { x: x.id, i, start: Date.now() };
    saveDraft(); render();
  },
  removeSet: el => { ui.draft.ex[el.dataset.x].pop(); saveDraft(); render(); },
  saveSession: () => {
    const r = S.routines.find(x => x.id === ui.draft.routine), ex = {};
    r.exercises.forEach(x => {
      const sets = (ui.draft.ex[x.id] || []).map(s => parseSet(x.kind, s)).filter(Boolean);
      if (sets.length) ex[x.id] = sets;
    });
    if (!Object.keys(ex).length) { toast('Apunta al menos una serie'); return; }
    const recordsBefore = totalRecords(), xpBefore0 = totalXP(), started = ui.draft.started;
    const sum = { name: r.name, secs: started ? (Date.now() - started) / 1000 : 0, sets: Object.values(ex).reduce((a, l) => a + l.length, 0),
      volume: Object.values(ex).flat().reduce((a, st) => a + (st.kg || 0) * (st.r || 0), 0) };
    ui.draft = null; saveDraft();
    update(s => {
      const day = logDate();
      s.sessions.push({ id: uid(), d: day, routine: r.id, rname: r.name, ex, mins: sum.secs ? Math.round(sum.secs / 60) : 0 }); s.sessions.sort((a, b) => (a.d < b.d ? -1 : a.d > b.d ? 1 : 0));
      if (s.sessions.length > 600) s.sessions.shift();
      if (!s.train.includes(day)) { s.train.push(day); s.train.sort(); }
    });
    scrollTop0();
    sum.records = totalRecords() - recordsBefore; sum.xp = Math.max(0, totalXP() - xpBefore0);
    showWorkoutSummary(sum);
    const mins = Math.round(sum.secs / 60);
    postFeed(sum.records ? 'record' : 'workout', `ha entrenado ${r.name}${mins ? ` · ${mins} min` : ''} · ${sum.sets} ${sum.sets === 1 ? 'serie' : 'series'}${sum.records ? ` y ha batido ${sum.records === 1 ? '1 récord' : sum.records + ' récords'}` : ''}`);
  },
  deleteRoutine: el => { const wasArmed = ui.armed === el.dataset.id; confirmTwice(el.dataset.id, s => { s.routines = s.routines.filter(x => x.id !== el.dataset.id); }); if (wasArmed && ui.view === 'rt:' + el.dataset.id) { const b = S.campaigns.find(c => c.tracker === 'body'); ui.view = b ? b.id : 'home'; ui.editing = false; render(); toast('Rutina borrada'); } },
  newExercise: el => { ui.exForm = { routine: el.dataset.r, id: null, inSession: !!el.dataset.session }; render(); focusExerciseForm(); },
  editExercise: el => { ui.exForm = { routine: el.dataset.r, id: el.dataset.id, inSession: false }; render(); focusExerciseForm(); },
  closeExerciseForm: repaint(() => { ui.exForm = null; }),
  deleteExercise: (el, ev) => { ev.preventDefault(); confirmTwice(el.dataset.id, s => { ui.exForm = null; const r = s.routines.find(x => x.id === el.dataset.r); r.exercises = r.exercises.filter(x => x.id !== el.dataset.id); }); },
  deleteSession: el => confirmTwice(el.dataset.id, s => { s.sessions = s.sessions.filter(x => x.id !== el.dataset.id); }),
};

// Formularios (data-form="nombre")
const authError = e => /invalid login/i.test(e.message) ? 'Email o contraseña incorrectos'
  : /not confirmed/i.test(e.message) ? 'Confirma tu email desde el correo que te llegó'
  : /already registered/i.test(e.message) ? 'Ya existe esa cuenta: dale a Entrar'
  : /rate limit|too many/i.test(e.message) ? 'Demasiados intentos seguidos. Espera unos minutos y vuelve a probar'
  : /signups? not allowed|signup.*disabled/i.test(e.message) ? 'Ahora mismo no se pueden crear cuentas nuevas. Avisa a Pau'
  : /password/i.test(e.message) ? 'La contraseña tiene que tener 6 caracteres o más'
  : 'No se pudo: ' + e.message;
/** Junta otro progreso con el actual sin perder nada de ninguno de los dos. */
function mergeProgress(cur, inc) {
  inc = migrate(JSON.parse(JSON.stringify(inc)));
  const byKey = (list, key) => new Map(list.map(x => [key(x), x]));
  // Peso y entrenos
  cur.weight.start = cur.weight.start ?? inc.weight.start;
  cur.weight.goal = cur.weight.goal ?? inc.weight.goal;
  const log = byKey(inc.weight.log, p => p.d);
  cur.weight.log.forEach(p => log.set(p.d, p));
  cur.weight.log = [...log.values()].sort((a, b) => a.d.localeCompare(b.d));
  if (cur.weight.log.length && inc.weight.start != null && inc.weight.log[0] && inc.weight.log[0].d <= cur.weight.log[0].d) cur.weight.start = inc.weight.start;
  cur.train = [...new Set([...cur.train, ...inc.train])].sort();
  // Rutinas: las importadas mandan (las sesiones apuntan a sus ejercicios) y se añade lo que solo existía aquí
  const routines = inc.routines;
  cur.routines.forEach(r => {
    const twin = routines.find(x => x.id === r.id || x.name === r.name);
    if (!twin) { routines.push(r); return; }
    r.exercises.forEach(x => { if (!twin.exercises.some(y => y.id === x.id || y.name === x.name)) twin.exercises.push(x); });
  });
  // Ejercicios con el mismo nombre en las dos versiones: las sesiones de aquí pasan a apuntar al importado
  const alias = {};
  cur.routines.forEach(r => r.exercises.forEach(x => {
    const twin = routines.flatMap(y => y.exercises).find(y => y.name === x.name);
    if (twin && twin.id !== x.id) alias[x.id] = twin.id;
  }));
  const sessions = byKey(inc.sessions, x => x.id);
  cur.sessions.forEach(x => {
    const ex = {}; Object.entries(x.ex).forEach(([k, v]) => { ex[alias[k] || k] = v; });
    sessions.set(x.id, Object.assign({}, x, { ex }));
  });
  cur.routines = routines;
  cur.sessions = [...sessions.values()].sort((a, b) => a.d.localeCompare(b.d));
  // Diarias, actividad y tienda
  Object.entries(inc.daily).forEach(([d, v]) => {
    const day = (cur.daily[d] = cur.daily[d] || {});
    day.habits = Object.assign({}, v.habits, day.habits);
    Object.keys(v.habits || {}).forEach(k => { if (v.habits[k]) day.habits[k] = true; });
    day.chest = day.chest || v.chest;
  });
  Object.entries(inc.activity).forEach(([d, v]) => {
    const day = (cur.activity[d] = cur.activity[d] || {});
    Object.entries(v).forEach(([cid, n]) => { day[cid] = Math.max(day[cid] || 0, n); });
  });
  inc.rewards.forEach(r => { if (!cur.rewards.some(x => x.id === r.id || x.name === r.name)) cur.rewards.push(r); });
  inc.purchases.forEach(p => { if (!cur.purchases.some(x => x.id === p.id)) cur.purchases.push(p); });
  cur.wardrobe = [...new Set([...(cur.wardrobe || []), ...(inc.wardrobe || [])])];
  cur.wins = [...new Set([...(cur.wins || []), ...(inc.wins || [])])];
  if ((inc.recapSeen || '') > (cur.recapSeen || '')) cur.recapSeen = inc.recapSeen;
  // Campañas: misiones emparejadas por nivel y nombre
  inc.campaigns.forEach(ic => {
    const c = cur.campaigns.find(x => x.id === ic.id || x.name === ic.name);
    if (!c) { cur.campaigns.push(ic); return; }
    ic.levels.forEach(il => {
      const l = c.levels.find(x => x.name === il.name);
      if (!l) { c.levels.push(il); return; }
      il.missions.forEach(im => {
        const m = l.missions.find(x => x.name === im.name && (x.target || 0) === (im.target || 0));
        if (!m) { l.missions.push(im); return; }
        if (im.done && !m.done) { m.done = true; m.doneAt = im.doneAt; }
        if (m.type === 'count') m.count = Math.max(m.count || 0, im.count || 0);
      });
    });
    if (ic.checkDays) c.checkDays = [...new Set([...(c.checkDays || []), ...ic.checkDays])].sort();
    if (ic.checkBumps) c.checkBumps = Object.assign({}, ic.checkBumps, c.checkBumps || {});
  });
  return cur;
}
const forms = {
  onboard: (f, F) => {
    const name = F.n.value.trim();
    if (!name) { F.n.focus(); return; }
    update(s => {
      s.name = name.slice(0, 24); s.onboarded = true;
      s.campaigns = s.campaigns.filter(c => ui.onboardCamps[c.id] !== false);
      TEMPLATES.filter(t => ui.onboardCamps[t.key] && !s.campaigns.some(c => c.tpl === t.key)).forEach(t => s.campaigns.push(fromTemplate(t)));
    }, { reward: false });
    ui.view = 'profile'; render(); scrollTop0();
    toast(`¡Bienvenido, ${name}! Ahora hazte tu personaje`);
  },
  sendIdea: async (f, F) => {
    const text = F.t.value.trim();
    if (text.length < 3 || !cloud.user) return;
    const btn = f.querySelector('button.primary'); if (btn) btn.disabled = true;
    const { error } = await cloud.client.from('suggestions').insert({ user_id: cloud.user.id, name: S.name || '', kind: ui.ideaKind, text: text.slice(0, 600) });
    if (btn) btn.disabled = false;
    if (error) { toast('No se pudo enviar'); return; }
    F.t.value = ''; toast('¡Enviada! Te diremos si entra'); loadIdeas();
  },
  saveProfile: (f, F) => {
    const name = F.n.value.trim();
    if (!name) return;
    update(s => { s.name = name.slice(0, 24); }, { reward: false });
    toast('Perfil guardado');
  },
  addReward: (f, F) => {
    const name = F.n.value.trim(), cost = Math.max(10, Math.round(num(F.c.value) || 0));
    if (!name || !cost) return;
    ui.addingReward = false;
    update(s => s.rewards.push(reward(name, cost)), { reward: false });
    toast('Premio añadido');
  },
  signIn: async (f, F) => {
    const { error } = await cloud.client.auth.signInWithPassword({ email: F.email.value.trim(), password: F.password.value });
    if (error) { ui.authMsg = { text: authError(error) }; toast(authError(error)); render(); } else { ui.authMsg = null; toast('Conectado. Sincronizando…'); }
  },
  addMission: (f, F) => {
    const c = findCampaign(f.dataset.c), l = c.levels.find(x => x.id === f.dataset.l), name = F.n.value.trim();
    if (!name) return;
    const times = parseInt(F.t.value, 10), xp = effortXP(F.x.value, times);
    update(() => l.missions.push(times > 1 ? count(name, xp, times) : mission(name, xp)), { reward: false });
    refocus(`[data-form="addMission"][data-l="${l.id}"]`);
  },
  renameRoutine: (f, F) => { const name = F.rn.value.trim(); if (!name) return; update(s => { const r = s.routines.find(x => x.id === f.dataset.id); if (r) r.name = name; }, { reward: false }); toast('Nombre guardado'); },
  addRoutine: (f, F) => {
    const name = F.n.value.trim(); if (!name) return;
    const id = uid(); ui.routineTpl = false; ui.view = 'rt:' + id; ui.editing = true;
    update(s => s.routines.push({ id, name, exercises: [] }), { reward: false }); scrollTop0();
    toast(`Rutina «${name}» creada. Añádele ejercicios`);
  },
  saveExercise: (f, F) => {
    const r = S.routines.find(x => x.id === f.dataset.r), name = F.n.value.trim();
    if (!name) { F.n.focus(); return; }
    const kind = F.k.value, needs = KIND_FIELDS[kind];
    const min = needs.includes('reps') ? Math.max(1, parseInt(F.a.value, 10) || 8) : 0;
    const fields = {
      name, kind,
      sets: needs.includes('sets') ? Math.min(10, Math.max(1, parseInt(F.s.value, 10) || 3)) : 1,
      repMin: min,
      repMax: needs.includes('reps') ? Math.max(min, parseInt(F.b.value, 10) || 12) : 0,
      step: needs.includes('step') ? Math.min(20, Math.max(0.5, num(F.st.value) || 2.5)) : 2.5,
      startKg: needs.includes('start') && num(F.kg0.value) > 0 ? num(F.kg0.value) : null,
    };
    const existing = f.dataset.x && r.exercises.find(x => x.id === f.dataset.x);
    ui.exForm = null;
    if (existing) { update(() => Object.assign(existing, fields), { reward: false }); toast('Ejercicio guardado'); return; }
    const x = Object.assign(exercise(name, 1, 0, 0, kind), fields);
    if (f.dataset.session && ui.draft) { ui.draft.ex[x.id] = Array.from({ length: x.sets }, () => blankSet(x)); saveDraft(); }
    update(() => r.exercises.push(x), { reward: false });
    toast(`${name} añadido a ${r.name}`);
  },
};
const focusExerciseForm = () => { const el = document.querySelector('.exform input[name="n"]'); if (el) { el.focus(); if (el.scrollIntoView) el.scrollIntoView({ block: 'center' }); } };
const refocus = sel => { const el = document.querySelector(`${sel} input[name="n"]`); if (el) el.focus(); };

/* =========================================================
   9. Eventos
   ========================================================= */
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act]');
  if (!el) return;
  const name = el.dataset.act;
  // Los botones de dos toques (borrar, comprar, canjear) guardan su confirmación
  if (!/delete/i.test(name) && !name.startsWith('buy') && name !== 'discardSession') ui.armed = null;
  if (actions[name]) actions[name](el, ev);
});
document.addEventListener('keydown', ev => {
  if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.dataset && ev.target.dataset.act === 'fold') { ev.preventDefault(); actions.fold(ev.target); }
});
document.addEventListener('submit', ev => {
  const f = ev.target;
  ev.preventDefault();
  if (forms[f.dataset.form]) forms[f.dataset.form](f, f.elements);
});
document.addEventListener('input', ev => {
  const q = ui.qlog, t0 = ev.target;
  if (q && t0.dataset.q) { q[t0.dataset.q] = t0.value; return; }
  if (q && t0.dataset.qk) { const row = (q.ex[t0.dataset.qk] || [])[+t0.dataset.i]; if (row) row[t0.dataset.f] = t0.value; return; }
});
document.addEventListener('input', ev => {
  const t = ev.target, d = ui.draft;
  if (!t.dataset.f || !d || !d.ex[t.dataset.x]) return;
  const row = d.ex[t.dataset.x][+t.dataset.i];
  if (row) { row[t.dataset.f] = t.value; saveDraft(); }
});
document.addEventListener('change', ev => {
  if (ev.target.dataset && ev.target.dataset.actChange === 'pushHour2') { avisos.hour2 = ev.target.value === '' ? null : +ev.target.value; savePushLocal(); pushSync(true); toast(avisos.hour2 == null ? 'Solo un recordatorio al día' : `También te recordaré a las ${avisos.hour2}:00`); return; }
  if (ev.target.dataset && ev.target.dataset.actChange === 'pushHour') { avisos.hour = +ev.target.value; savePushLocal(); pushSync(true); toast(`Te recordaré a las ${avisos.hour}:00 si te faltan misiones`); return; }
});
document.addEventListener('change', ev => {
  const t = ev.target, form = t.closest('.exform');
  if (!form || t.name !== 'k') return;
  form.querySelectorAll('.fgroup').forEach(g => { g.hidden = !KIND_FIELDS[t.value].includes(g.dataset.needs); });
  form.querySelector('.kind-help').textContent = KIND_HELP[t.value];
});
/** Foto de perfil: recorte cuadrado de 192 px en JPEG, para que pese poco. */
async function resizePhoto(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise((ok, fail) => { img.onload = ok; img.onerror = fail; img.src = url; });
    const side = Math.min(img.naturalWidth, img.naturalHeight), out = document.createElement('canvas');
    out.width = out.height = 192;
    out.getContext('2d').drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, 192, 192);
    return out.toDataURL('image/jpeg', 0.8);
  } finally { URL.revokeObjectURL(url); }
}
document.addEventListener('change', async ev => {
  const t = ev.target;
  if (t.dataset.colorAct) { const fake = { dataset: { k: t.value, v: t.value, f: t.dataset.f } }; actions[t.dataset.colorAct](fake); return; }
  if (t.hasAttribute('data-photo') && t.files && t.files[0]) {
    try { const photo = await resizePhoto(t.files[0]); update(s => { s.photo = photo; }, { reward: false }); toast('Foto guardada'); }
    catch (e) { toast('No se ha podido leer esa imagen. Prueba con otra'); }
  }
});
// Sin zoom con dos dedos (Safari)
['gesturestart', 'gesturechange'].forEach(type => document.addEventListener(type, e => e.preventDefault(), { passive: false }));
const ENTER = { kg: 'logWeight', goal: 'setGoal', 'nc-name': 'createCampaign' };
document.addEventListener('keydown', ev => {
  if (ev.key !== 'Enter' || !ENTER[ev.target.id]) return;
  ev.preventDefault();
  actions[ENTER[ev.target.id]]();
});

render();
useShields();
initCloud();
})();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
