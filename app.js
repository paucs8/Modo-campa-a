(function () {
'use strict';

/* =========================================================
   1. Constantes y recursos
   ========================================================= */
const IMG = {
  "hero": "assets/hero.png",
  "face": "assets/face.png",
  "llavero": "assets/llavero.png",
  "movil": "assets/movil.png",
  "auriculares": "assets/auriculares.png",
  "spray": "assets/spray.png",
  "mechero": "assets/mechero.png",
  "handycam": "assets/handycam.png",
  "skate": "assets/skate.png",
  "logo": "assets/logo.webp",
  "chest": "assets/cofre.png",
  "chestOpen": "assets/cofre-abierto.png",
  "coin": "assets/moneda.png",
  "boss": "assets/jefe.png"
};
// AXIS por capas: la base y lo que lleva puesto se apilan en la misma caja
const AXIS_LAYERS = { base: 'assets/axis/base.png', eyesClosed: 'assets/axis/ojos.png', llavero: 'assets/axis/llavero.png', auriculares: 'assets/axis/auriculares.png', handycam: 'assets/axis/handycam.png', skate: 'assets/axis/skate.png' };

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
  bag: svg('<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'),
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.5 14.2 9.8 22.5 12 14.2 14.2 12 22.5 9.8 14.2 1.5 12 9.8 9.8z"/></svg>',
};

const COLORS = ['lilac', 'orange', 'blue', 'lime', 'pink'];
const RANKS = ['Novato', 'Aprendiz', 'Explorador', 'Veterano', 'Élite', 'Maestro', 'Leyenda'];
const ITEMS = [
  { key: 'llavero', name: 'Llavero', level: 2, wearable: true },
  { key: 'movil', name: 'Móvil', level: 3 },
  { key: 'auriculares', name: 'Cascos', level: 4, wearable: true },
  { key: 'spray', name: 'Spray', level: 5 },
  { key: 'mechero', name: 'Mechero', level: 6 },
  { key: 'handycam', name: 'Handycam', level: 7, wearable: true },
  { key: 'skate', name: 'Skate', level: 8, wearable: true },
  { key: 'hero', name: 'AXIS', level: 10 },
];
const XP = { train: 5, record: 10 };
const COINS = { train: 3, record: 5, missionShare: 0.5 };
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
const shortDate = key => new Date(key + 'T12:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
const pct = p => Math.round(p * 100);
const colorVar = c => `var(--${c.color || 'lilac'})`;
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
const exercise = (name, sets, repMin, repMax, kind = 'peso', step = 2.5) => ({ id: uid(), name, sets, repMin, repMax, step, kind });

function defaultCampaigns() {
  return [
    { id: 'carnet', name: 'Carnet de conducir', icon: 'car', color: 'orange', sub: 'Del papeleo al examen práctico', levels: [
      level('Papeleo', [mission('Elegir autoescuela', 20), mission('Matricularme', 30), mission('Pasar el psicotécnico (reconocimiento médico)', 40), mission('Pagar la tasa de la DGT', 20)]),
      level('Teórico', [count('Hacer tests de práctica', 40, 20), count('Hacer tests de práctica', 60, 60), mission('5 tests seguidos con 3 fallos o menos', 50), mission('Fecha de examen teórico confirmada', 20), mission('Aprobar el teórico', 150)]),
      level('Práctico', [mission('Primera clase práctica', 30), count('Clases prácticas', 60, 15), mission('Simulacro de examen sin eliminatorias', 60), mission('Fecha de examen práctico confirmada', 20)]),
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
function defaultRoutines() {
  return [
    { id: uid(), name: 'En casa', exercises: [exercise('Flexiones', 3, 8, 15, 'reps'), exercise('Sentadillas', 3, 15, 25, 'reps'), exercise('Fondos en silla', 3, 8, 15, 'reps'), exercise('Plancha', 3, 0, 0, 'seg')] },
    { id: uid(), name: 'Cardio', exercises: [exercise('Saltar a la comba', 3, 0, 0, 'min'), exercise('Correr', 1, 0, 0, 'run')] },
    { id: uid(), name: 'Gimnasio A', exercises: [exercise('Sentadilla', 3, 8, 12), exercise('Press banca', 3, 8, 12), exercise('Remo con barra', 3, 8, 12), exercise('Curl de bíceps', 2, 10, 15, 'peso', 1)] },
    { id: uid(), name: 'Gimnasio B', exercises: [exercise('Peso muerto rumano', 3, 8, 12), exercise('Press militar', 3, 8, 12), exercise('Jalón al pecho', 3, 8, 12), exercise('Extensión de tríceps', 2, 10, 15, 'peso', 1)] },
  ];
}
const reward = (name, cost) => ({ id: uid(), name, cost });
const defaultRewards = () => [
  reward('Un café o un snack fuera', 60),
  reward('Tarde de videojuegos o serie', 120),
  reward('Un día libre de entreno sin culpa', 200),
  reward('Cena fuera o pedir comida', 400),
  reward('Un capricho (ropa, algo para el skate…)', 800),
];
const defaultState = () => ({ v: 4, name: 'Pau', weight: { start: null, goal: null, log: [] }, train: [], sessions: [], routines: defaultRoutines(), campaigns: defaultCampaigns(),
  daily: {}, activity: {}, rewards: defaultRewards(), purchases: [], unequipped: [] });

/** Pone al día datos guardados por versiones anteriores. */
function migrate(s) {
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
  s.v = 4;
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
const avg = list => (list.length ? list.reduce((a, m) => a + progress(m), 0) / list.length : 0);
const levelProgress = l => avg(l.missions);
const campaignProgress = c => avg(c.levels.flatMap(l => l.missions));
const allMissions = () => S.campaigns.flatMap(c => c.levels.flatMap(l => l.missions));
function currentLevelIndex(c) {
  const i = c.levels.findIndex(l => !(l.missions.length && levelProgress(l) >= 1));
  return i < 0 ? c.levels.length - 1 : i;
}
function totalXP() {
  return S.train.length * XP.train + totalRecords() * XP.record + allMissions().filter(isDone).reduce((a, m) => a + m.xp, 0) + chestTotals().xp;
}
function levelOf(xp) { let L = 1; while (xpForLevel(L + 1) <= xp) L++; return L; }
function streak() {
  const set = new Set(S.train), d = new Date();
  if (!set.has(today())) d.setDate(d.getDate() - 1);
  let n = 0; while (set.has(dateKey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
/* ---------- Juego: diarias, cofres, monedas, ánimo de AXIS y jefes ---------- */
const hash = str => [...str].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);
const dayOf = (s, date = today()) => (s.daily[date] = s.daily[date] || {});
function chestTotals() {
  return Object.values(S.daily).reduce((t, d) => (d.chest ? { xp: t.xp + d.chest.xp, coins: t.coins + d.chest.coins } : t), { xp: 0, coins: 0 });
}
/** Apunta que hoy se ha avanzado (o deshecho) algo en una campaña: alimenta las diarias y el ánimo. */
function logActivity(s, cid, delta) {
  const day = (s.activity[today()] = s.activity[today()] || {});
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
  if (q.kind === 'train') return { title: 'Entrena hoy', sub: 'Una rutina, correr o comba: lo que te apetezca' };
  if (q.kind === 'weigh') return { title: 'Pésate', sub: 'Apúntalo en Físico' };
  if (q.kind === 'advance') {
    const c = findCampaign(q.cid), l = c && c.levels[currentLevelIndex(c)], next = l && l.missions.find(m => !isDone(m));
    return { title: `Avanza en ${c ? c.name : 'una campaña'}`, sub: next ? `Por ejemplo: ${next.name}` : 'Marca cualquier misión' };
  }
  return { title: q.label, sub: 'Márcalo tú cuando lo hagas' };
}

// Monedas: se ganan jugando y se gastan en la tienda
function coinsEarned() {
  const fromMissions = allMissions().filter(isDone).reduce((a, m) => a + Math.round(m.xp * COINS.missionShare), 0);
  return fromMissions + S.train.length * COINS.train + totalRecords() * COINS.record + chestTotals().coins;
}
const chestReady = () => !(S.daily[today()] || {}).chest && dailyQuests().every(q => questDone(q));
const coinsSpent = () => S.purchases.reduce((a, p) => a + p.cost, 0);
const coins = () => Math.max(0, coinsEarned() - coinsSpent());

// Ánimo de AXIS según lo que has hecho estos días
function activeDays() {
  const days = new Set([...S.train, ...S.weight.log.map(p => p.d), ...S.sessions.map(x => x.d)]);
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
const wearing = () => ITEMS.filter(i => i.wearable && levelOf(totalXP()) >= i.level && !S.unequipped.includes(i.key)).map(i => i.key);

// Jefe final: el último nivel de cada campaña; los niveles anteriores le quitan vida
function boss(c) {
  if (c.levels.length < 2) return null;
  const last = c.levels[c.levels.length - 1], before = c.levels.slice(0, -1).flatMap(l => l.missions);
  if (!before.length) return null;
  const hp = 1 - avg(before), defeated = last.missions.length > 0 && levelProgress(last) >= 1;
  const left = before.filter(m => !isDone(m)).length;
  return { level: last, hp: defeated ? 0 : hp, defeated, left, target: (last.missions.find(m => !isDone(m)) || last.missions[0] || {}).name };
}

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
  if (!last) return { rows: Array.from({ length: sets }, () => blankSet(x)), tip: FIRST_TIME[x.kind](x), levelUp: false };
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
function persist() {
  S.updatedAt = Date.now();
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
  if (error) { setSync('error'); setTimeout(() => cloud.user && schedulePush(0), 15000); } else setSync('cloud');
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
  if (data && data.state) { S = mergeProgress(migrate(data.state), S); render(); }
  persist();
}
async function startSync(user, { fresh = false } = {}) {
  cloud.user = user;
  ui.account = false;
  render();
  if (fresh) await mergeWithCloud(); else await pull();
  listenRemote();
}
function stopSync() {
  if (cloud.channel) cloud.client.removeChannel(cloud.channel);
  Object.assign(cloud, { user: null, channel: null, pending: false });
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
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') pull(); });
  window.addEventListener('online', () => pull());
}
document.addEventListener('focusout', () => setTimeout(() => {
  if (cloud.queued && !isTyping()) { const r = cloud.queued; cloud.queued = null; applyRemote(r); }
}, 50));

/** Única puerta para cambiar datos: aplica el cambio, guarda, repinta y premia. */
function update(change, { reward = true } = {}) {
  const before = totalXP(), readyBefore = chestReady();
  change(S);
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
  return html`<header class="top"><div class="avatar"><img src="${IMG.face}" alt="AXIS"></div>
    <div class="hello"><b>Hola, ${esc(S.name)}</b><span>${esc(d[0].toUpperCase() + d.slice(1))}</span></div>
    <button class="sync" id="sync" data-s="${ui.sync}" title="${SYNC_LABEL[ui.sync]}" aria-label="${SYNC_LABEL[ui.sync]}" data-act="syncInfo"><i></i></button></header>`;
}
function viewAccount() {
  if (!ui.account) return '';
  if (ui.sync === 'off') return html`<section class="panel"><h3>Sincronización</h3><p class="hint">Falta configurar Supabase. Mientras tanto, todo se guarda en este dispositivo.</p></section>`;
  if (cloud.user) return html`<section class="panel"><h3>Tu cuenta <button class="btn ghost" data-act="toggleAccount">Cerrar</button></h3>
    <p class="hint">Conectado como <b>${esc(cloud.user.email || '')}</b>. ${SYNC_LABEL[ui.sync]}.</p>
    <div class="edit-row"><button class="btn" data-act="syncNow">Sincronizar ahora</button><button class="btn danger" data-act="signOut">Cerrar sesión</button></div></section>`;
  return html`<section class="panel"><h3>Sincronizar móvil y PC <button class="btn ghost" data-act="toggleAccount">Cerrar</button></h3>
    <form class="stack-s" data-form="signIn">
      <label class="fld"><span>Email</span><input name="email" type="email" autocomplete="email" required></label>
      <label class="fld"><span>Contraseña</span><input name="password" type="password" autocomplete="current-password" minlength="6" required></label>
      <div class="edit-row"><button class="btn primary">Entrar</button><button type="button" class="btn" data-act="signUp">Crear cuenta</button></div>
    </form>
    <p class="hint">Usa la misma cuenta en el móvil y en el PC. Al entrar se junta lo de este dispositivo con lo de tu cuenta.</p></section>`;
}
function viewAxis(state) {
  const layers = [AXIS_LAYERS.base, ...wearing().map(k => AXIS_LAYERS[k])];
  if (state === 'tired') layers.push(AXIS_LAYERS.eyesClosed);
  return `<div class="char mood-${state}" aria-hidden="true">${layers.map(src => `<img src="${src}" alt="">`).join('')}${state === 'tired' ? '<span class="zzz">z<b>z</b></span>' : ''}</div>`;
}
const coinBadge = n => `<span class="coins num"><img src="${IMG.coin}" alt="">${n}</span>`;
function viewHero() {
  const xp = totalXP(), L = levelOf(xp), from = xpForLevel(L), to = xpForLevel(L + 1), p = (xp - from) / (to - from), m = mood();
  return html`<section class="hero">${viewAxis(m.kind)}
    <div class="hero-txt"><img class="logo" src="${IMG.logo}" alt="AXIS">
      <span class="pill">${GLYPH.star}Nivel ${L}</span><h1>${rankFor(L)}</h1>
      <div class="xpbar" role="progressbar" aria-valuenow="${pct(p)}" aria-valuemin="0" aria-valuemax="100" aria-label="Progreso al siguiente nivel"><i style="width:${p * 100}%"></i></div>
      <small class="num">${xp} XP · faltan ${to - xp} para el nivel ${L + 1}</small></div>
    <p class="say mood-${m.kind}">${esc(m.line)}</p>
    <div class="hero-stats"><button class="coins-btn" data-act="open" data-id="shop" aria-label="Ir a la tienda">${coinBadge(coins())}</button></div></section>`;
}
function viewDaily() {
  const quests = dailyQuests(), done = quests.filter(q => questDone(q)).length, chest = (S.daily[today()] || {}).chest, ready = done === quests.length && !chest;
  return html`<section class="daily"><div class="edit-row spread"><h2 class="sec-t">Misiones de hoy</h2><span class="label num">${done}/${quests.length}</span></div>
    <ul class="quests">${quests.map(q => {
      const ok = questDone(q), t = questText(q);
      const act = q.kind === 'habit' ? `data-act="toggleHabit" data-k="${q.key}"` : q.kind === 'advance' ? `data-act="open" data-id="${q.cid}"` : 'data-act="open" data-id="fisico"';
      return `<li><button class="quest ${ok ? 'done' : ''}" ${act}><span class="check">${GLYPH.check}</span><span class="txt"><b>${esc(t.title)}</b><small>${esc(t.sub)}</small></span>${q.kind === 'habit' ? '' : `<span class="go">${GLYPH.chev}</span>`}</button></li>`;
    })}</ul>
    <div class="chest ${ready ? 'ready' : chest ? 'opened' : ''}"><img src="${chest ? IMG.chestOpen : IMG.chest}" alt="">
      <div class="txt">${chest ? `<b>Cofre abierto</b><small class="num">+${chest.coins} monedas · +${chest.xp} XP${chest.gold ? ' · ¡dorado!' : ''}</small>`
        : ready ? '<b>¡Cofre listo!</b><small>Has hecho las 3. Ábrelo.</small>' : `<b>Cofre del día</b><small>Completa las 3 misiones para abrirlo</small>`}</div>
      ${when(ready, '<button class="btn dark" data-act="openChest">Abrir</button>')}</div></section>`;
}
function viewWeek() {
  const trained = new Set(S.train), names = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], days = weekDays();
  const n = days.filter(d => trained.has(d.key)).length;
  return html`<section class="stack"><div class="edit-row spread"><h2 class="sec-t">Esta semana</h2><span class="label">${n} ${n === 1 ? 'entreno' : 'entrenos'} · racha ${streak()}</span></div>
    <div class="week">${days.map((d, i) => html`<div class="day ${d.isToday ? 'today' : ''}" title="${trained.has(d.key) ? 'Entrenaste' : 'Sin entreno'}">${trained.has(d.key) ? GLYPH.star : '<span class="ph"></span>'}<span class="d">${names[i]}</span><b>${d.date.getDate()}</b></div>`)}</div></section>`;
}
function viewCampaignCard(c) {
  const li = currentLevelIndex(c), l = c.levels[li], next = l && l.missions.find(m => !isDone(m)), p = campaignProgress(c);
  return html`<button class="cc" style="background:${colorVar(c)}" data-act="open" data-id="${c.id}"><span class="ico">${ICONS[c.icon] || ICONS.star}</span>
    <span class="lv">Nivel ${li + 1}${l ? ' · ' + esc(l.name) : ''}</span><b>${esc(c.name)}</b>
    ${next ? `<span class="next">Siguiente: ${esc(next.name)}</span>` : when(p >= 1, '<span class="next">Campaña completada</span>')}
    <span class="big num">${pct(p)}%</span>${bar(p)}</button>`;
}
function viewInventory() {
  const L = levelOf(totalXP()), got = ITEMS.filter(i => L >= i.level).length, worn = wearing();
  return html`<section class="inv"><h3>Inventario <span>${got}/${ITEMS.length} objetos</span></h3><div class="items">${ITEMS.map(i => {
    const ok = L >= i.level, on = worn.includes(i.key);
    const inner = `<img src="${IMG[i.key]}" alt="">${when(on, '<em>Puesto</em>')}<small>${ok ? i.name : 'Nv ' + i.level}</small>`;
    return ok && i.wearable
      ? `<button class="item got ${on ? 'on' : ''}" data-act="toggleWear" data-k="${i.key}" aria-pressed="${on}" aria-label="${on ? 'Quitar' : 'Poner'} ${i.name}">${inner}</button>`
      : `<div class="item ${ok ? 'got' : 'locked'}" title="${ok ? i.name : 'Se desbloquea en el nivel ' + i.level}">${inner}</div>`;
  })}</div><p class="hint inv-hint">Cascos, llavero, handycam y skate se los pone AXIS. Tócalos para ponérselos o quitárselos.</p></section>`;
}
function viewNewCampaign() {
  return html`<section class="panel"><h3>Nueva campaña</h3>
    <input id="nc-name" placeholder="Ej: Ahorrar 3.000 €" maxlength="40">
    <div class="icons">${Object.keys(ICONS).map(k => `<button data-act="pickIcon" data-k="${k}" aria-pressed="${k === ui.newIcon}" aria-label="${k}">${ICONS[k]}</button>`)}</div>
    <div class="swatches">${COLORS.map(k => `<button data-act="pickColor" data-k="${k}" aria-pressed="${k === ui.newColor}" aria-label="Color ${k}" style="background:var(--${k})"></button>`)}</div>
    <div class="edit-row"><button class="btn primary" data-act="createCampaign">Crear campaña</button><button class="btn ghost" data-act="toggleNewCampaign">Cancelar</button></div>
    <p class="hint">Se crea con un nivel vacío y la abres en modo edición para añadir misiones.</p></section>`;
}
function viewHome() {
  return viewHero() + viewDaily() + viewWeek() + html`<section class="stack"><h2 class="sec-t">Tus campañas</h2><div class="grid">${S.campaigns.map(viewCampaignCard)}
    <button class="cc add" data-act="toggleNewCampaign">${GLYPH.plus}Nueva campaña</button></div></section>`
    + when(ui.addingCampaign, viewNewCampaign()) + viewInventory();
}
function viewNav() {
  const item = (id, label, icon) => `<button data-act="open" data-id="${id}" aria-label="${esc(label)}" ${ui.view === id ? 'aria-current="page"' : ''}>${icon}</button>`;
  return item('home', 'Inicio', GLYPH.home) + item('shop', 'Tienda', GLYPH.bag) + S.campaigns.map(c => item(c.id, c.name, ICONS[c.icon] || ICONS.star)).join('');
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
    <div class="inrow"><input id="kg" type="number" inputmode="decimal" step="0.1" min="30" max="250" placeholder="Peso de hoy (kg)"><button class="btn primary" data-act="logWeight">Apuntar</button></div>
    ${when(w.goal == null || ui.editing, `<div class="inrow"><input id="goal" type="number" inputmode="decimal" step="0.5" min="30" max="250" placeholder="Peso objetivo (kg)" value="${w.goal ?? ''}"><button class="btn" data-act="setGoal">${w.goal == null ? 'Fijar objetivo' : 'Cambiar objetivo'}</button></div>`)}
    <p class="hint">${w.start == null ? 'El primer peso que apuntes queda como peso inicial.' : 'Pésate siempre en las mismas condiciones, por ejemplo al levantarte.'}</p></section>`;
}
function viewTraining() {
  const trainedToday = S.train.includes(today()), week = new Set(weekDays().map(d => d.key));
  return html`<section class="panel"><h3>Entrenos <span class="label">+${XP.train} XP cada uno</span></h3>
    <div class="trio"><div><b>${S.train.length}</b><span>Total</span></div><div><b>${S.train.filter(k => week.has(k)).length}</b><span>Esta semana</span></div><div><b>${streak()}</b><span>Días seguidos</span></div></div>
    <button class="btn ${trainedToday ? '' : 'primary'} wide" data-act="toggleTrainedToday">${trainedToday ? 'Hoy ya cuenta como entrenado · deshacer' : 'He entrenado hoy'}</button>
    <p class="hint">Si guardas una sesión de rutina, el día cuenta solo.</p></section>`;
}
// Formulario de ejercicio: crear o editar, con campos según el tipo
const KIND_FIELDS = { peso: ['sets', 'reps', 'step'], reps: ['sets', 'reps'], seg: ['sets'], min: ['sets'], run: [] };
const KIND_SHORT = { peso: 'Peso', reps: 'Repes', seg: 'Segundos', min: 'Minutos', run: 'Carrera' };
const KIND_HELP = {
  peso: 'Kilos y repes. Cuando hagas todas las series al máximo de repes, te dirá que subas peso.',
  reps: 'Repes, con o sin peso. En cada serie puedes apuntar kilos extra (mochila, mancuerna) o dejarlo vacío. Te pedirá una repe más cada vez.',
  seg: 'Para aguantar tiempo, como la plancha. Te pondrá un objetivo un poco por encima de tu mejor marca.',
  min: 'Para rondas largas, como la comba. Te pondrá un objetivo un poco por encima de tu mejor marca.',
  run: 'Distancia y tiempo. Para ir a más kilómetros o a mejor ritmo.',
};
const COMMON_EXERCISES = ['Flexiones', 'Flexiones diamante', 'Flexiones inclinadas', 'Dominadas', 'Dominadas australianas', 'Fondos en paralelas', 'Fondos en silla', 'Sentadillas sin peso', 'Sentadilla búlgara', 'Zancadas', 'Puente de glúteo', 'Elevación de gemelos', 'Plancha', 'Plancha lateral', 'Abdominales', 'Elevación de piernas', 'Mountain climbers', 'Burpees', 'Jumping jacks', 'Saltar a la comba', 'Correr', 'Bici', 'Sentadilla', 'Peso muerto', 'Peso muerto rumano', 'Press banca', 'Press inclinado', 'Press militar', 'Remo con barra', 'Remo con mancuerna', 'Jalón al pecho', 'Curl de bíceps', 'Curl martillo', 'Extensión de tríceps', 'Elevaciones laterales', 'Prensa de piernas', 'Hip thrust'];

function viewExerciseForm(r, x, inSession) {
  const kind = x ? x.kind : 'reps';
  const field = (name, label, value, min, max, step = 1) =>
    `<label class="fld"><span>${label}</span><input name="${name}" type="number" inputmode="decimal" min="${min}" max="${max}" step="${step}" value="${value}"></label>`;
  const group = (key, inner) => `<div class="fgroup" data-needs="${key}" ${KIND_FIELDS[kind].includes(key) ? '' : 'hidden'}>${inner}</div>`;
  const hasHistory = x && S.sessions.some(s => s.ex[x.id]);
  return html`<form class="exform" data-form="saveExercise" data-r="${r.id}" ${x ? `data-x="${x.id}"` : ''} ${inSession ? 'data-session="1"' : ''}>
    <b>${x ? 'Editar ejercicio' : 'Nuevo ejercicio'}</b>
    <label class="fld wide"><span>Nombre</span><input name="n" list="ex-list" placeholder="Ej: Dominadas" maxlength="50" required value="${x ? esc(x.name) : ''}"></label>
    <div class="fld wide"><span>Tipo</span><div class="seg" role="radiogroup" aria-label="Tipo de ejercicio">${Object.keys(KIND_SHORT).map(k =>
      `<label><input type="radio" name="k" value="${k}" ${k === kind ? 'checked' : ''}><span>${KIND_SHORT[k]}</span></label>`)}</div></div>
    <p class="hint kind-help">${KIND_HELP[kind]}</p>
    <div class="fgrid">
      ${group('sets', field('s', 'Series', x ? x.sets : 3, 1, 10))}
      ${group('reps', field('a', 'Repes mín', x && x.repMin ? x.repMin : 8, 1, 100) + field('b', 'Repes máx', x && x.repMax ? x.repMax : 12, 1, 100))}
      ${group('step', field('st', 'Subir de kg en kg', x ? x.step : 2.5, 0.5, 20, 0.5))}
    </div>
    ${when(hasHistory, '<p class="hint">Tu historial y tus récords se mantienen aunque cambies el ejercicio.</p>')}
    <div class="edit-row"><button class="btn primary">${x ? 'Guardar' : 'Añadir'}</button><button type="button" class="btn ghost" data-act="closeExerciseForm">Cancelar</button>
      ${when(x && !inSession, confirmBtn('deleteExercise', x ? x.id : '', 'Borrar ejercicio', `type="button" data-r="${r.id}"`))}</div>
  </form>`;
}
const formOpenFor = (routineId, exId = null) => ui.exForm && ui.exForm.routine === routineId && ui.exForm.id === exId;

function viewRoutine(r) {
  const editing = ui.editing;
  return html`<div class="rt"><div class="rt-h"><b>${esc(r.name)}</b>${editing ? confirmBtn('deleteRoutine', r.id, 'Borrar rutina') : `<button class="btn primary" data-act="startSession" data-id="${r.id}">Empezar</button>`}</div>
    <ul class="exl">${r.exercises.map(x => {
      if (formOpenFor(r.id, x.id) && !ui.exForm.inSession) return `<li class="formli">${viewExerciseForm(r, x, false)}</li>`;
      const best = exerciseStats(x.id).best;
      return `<li><button class="exname" data-act="editExercise" data-r="${r.id}" data-id="${x.id}" aria-label="Editar ${esc(x.name)}">${esc(x.name)} <small>${scheme(x)}</small></button>${best ? `<span class="pr">Récord ${esc(setText(best))}</span>` : '<small>Sin datos</small>'}</li>`;
    })}${when(!r.exercises.length, '<li><small>Sin ejercicios todavía</small></li>')}</ul>
    ${formOpenFor(r.id) && !ui.exForm.inSession ? viewExerciseForm(r, null, false) : `<button class="btn add-ex" data-act="newExercise" data-r="${r.id}">+ Ejercicio</button>`}</div>`;
}
function viewRoutines() {
  const recent = S.sessions.slice(-5).reverse();
  return html`<section class="panel"><h3>Rutinas <span class="label">+${XP.record} XP por récord</span></h3>
    ${S.routines.map(viewRoutine)}
    <form class="adde" data-form="addRoutine"><input name="n" placeholder="Nueva rutina (ej: Día de piernas)" required maxlength="30" aria-label="Nombre de la nueva rutina"><button class="btn">Crear rutina</button></form>
    <p class="hint">Toca un ejercicio para cambiarlo o borrarlo.</p>
    ${when(recent.length, html`<div class="stack-s"><span class="label">Últimas sesiones</span><ul class="hist">${recent.map(s => {
      const r = S.routines.find(x => x.id === s.routine), sets = Object.values(s.ex).reduce((a, b) => a + b.length, 0);
      return `<li><b>${esc(r ? r.name : s.rname || 'Rutina')}</b><span>${shortDate(s.d)} · ${sets} series</span>${when(ui.editing, confirmBtn('deleteSession', s.id, 'Borrar'))}</li>`;
    })}</ul></div>`)}</section>`;
}
function setInput(x, i, field, value, placeholder, label, mode = 'decimal') {
  return `<input inputmode="${mode}" data-x="${x}" data-i="${i}" data-f="${field}" value="${esc(value ?? '')}" placeholder="${placeholder}" aria-label="${label}">`;
}
function viewSetRow(x, s, i) {
  const n = `<span class="i">${i + 1}</span>`, k = x.kind;
  if (k === 'peso') return `<div class="setrow">${n}${setInput(x.id, i, 'kg', s.kg, 'kg o vacío', `Kilos serie ${i + 1}`)}<span>kg ×</span>${setInput(x.id, i, 'r', s.r, 'repes', `Repes serie ${i + 1}`, 'numeric')}<span>repes</span></div>`;
  if (k === 'reps') return `<div class="setrow">${n}${setInput(x.id, i, 'r', s.r, 'repes', `Repes serie ${i + 1}`, 'numeric')}<span>repes +</span>${setInput(x.id, i, 'kg', s.kg, 'sin peso', `Kilos extra serie ${i + 1} (opcional)`)}<span>kg</span></div>`;
  if (k === 'run') return `<div class="setrow">${n}${setInput(x.id, i, 'km', s.km, 'km', 'Kilómetros')}<span>km en</span>${setInput(x.id, i, 't', s.t, 'min', 'Minutos')}<span>min</span></div>`;
  return `<div class="setrow one">${n}${setInput(x.id, i, 't', s.t, k === 'seg' ? 'segundos' : 'minutos', `Tiempo serie ${i + 1}`)}<span>${KIND_LABEL[k]}</span></div>`;
}
function viewSession() {
  const r = S.routines.find(x => x.id === ui.draft.routine);
  return html`<section class="panel"><h3>${esc(r.name)} <button class="btn ghost" data-act="discardSession">${ui.armed === 'session' ? '¿Descartar sesión?' : 'Descartar'}</button></h3>
    ${r.exercises.map(x => {
      const { last } = exerciseStats(x.id), next = nextSession(x), rows = ui.draft.ex[x.id] || [];
      const maxKg = last ? Math.max(...last.sets.map(s => +s.kg || 0)) : 0;
      const lastText = !last ? '' : x.kind === 'peso' || x.kind === 'reps'
        ? `${last.sets.map(s => s.r).join(', ')} repes${maxKg > 0 ? ' con ' + fmt(maxKg) + ' kg' : x.kind === 'peso' ? ' sin peso' : ''}`
        : last.sets.map(setText).join(', ');
      return html`<div class="ex"><div><b>${esc(x.name)}</b><br><small>${scheme(x)}${lastText ? ' · última: ' + esc(lastText) : ''}</small></div>
        <div class="sug ${next.levelUp ? '' : 'keep'}">${esc(next.tip)}</div>
        ${rows.map((s, i) => viewSetRow(x, s, i))}
        <div class="edit-row"><button class="btn" data-act="addSet" data-x="${x.id}">+ Serie</button>${when(rows.length > 1, `<button class="btn ghost" data-act="removeSet" data-x="${x.id}">− Serie</button>`)}</div></div>`;
    })}
    ${formOpenFor(r.id) && ui.exForm.inSession ? `<div class="ex">${viewExerciseForm(r, null, true)}</div>` : '<button class="btn add-ex" data-act="newExercise" data-r="' + r.id + '" data-session="1">+ Añadir ejercicio a esta sesión</button>'}
    <button class="btn primary wide" data-act="saveSession">Guardar sesión</button><p class="hint">Lo que dejes vacío no se guarda, así que puedes saltarte ejercicios. Los que añadas se quedan en la rutina.</p></section>`;
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
    ${ui.editing ? confirmBtn('deleteMission', m.id, 'Quitar') : control}<span class="xp">+${m.xp}</span></li>`;
}
function viewLevel(c, l, i, current) {
  const p = levelProgress(l), done = l.missions.length && p >= 1, state = done ? 'done' : i === current ? 'current' : 'upcoming';
  const key = c.id + l.id, open = ui.open[key] ?? state === 'current';
  const left = l.missions.filter(m => !isDone(m)).length, xp = l.missions.reduce((a, m) => a + m.xp, 0);
  const status = !l.missions.length ? 'Sin misiones' : `${done ? 'Superado' : (state === 'current' ? 'En curso · ' : '') + left + ' por hacer'} · ${xp} XP`;
  return html`<div class="lv-card ${state}" data-open="${open ? 1 : 0}" ${state === 'current' ? `style="--cbg:${colorVar(c)}"` : ''}>
    <button class="lv-h" data-act="toggleLevel" data-k="${key}" aria-expanded="${open}"><span class="lv-n">${done ? GLYPH.star : i + 1}</span><div class="t"><b>${esc(l.name)}</b><small>${status}</small></div><span class="chev">${GLYPH.chev}</span></button>
    ${when(open, html`<ul class="missions">${l.missions.map(m => viewMission(c, l, m))}</ul>
      ${when(ui.editing, html`<form class="addm" data-form="addMission" data-c="${c.id}" data-l="${l.id}"><input name="n" placeholder="Nueva misión" maxlength="80" required>
        <input name="t" type="number" min="1" max="999" placeholder="Veces" title="Déjalo vacío si es de una sola vez">
        <select name="x" aria-label="XP">${[10, 20, 30, 50, 100, 200].map(v => `<option value="${v}" ${v === 30 ? 'selected' : ''}>${v} XP</option>`)}</select>
        <button class="btn">Añadir</button>${when(c.levels.length > 1, confirmBtn('deleteLevel', l.id, 'Borrar nivel', `data-c="${c.id}" type="button"`))}</form>`)}`)}</div>`;
}
function viewMap(c) {
  const current = currentLevelIndex(c);
  return html`<section class="stack"><div class="edit-row spread"><h2 class="sec-t">Niveles</h2>${when(ui.editing, '<button class="btn" data-act="addLevel">+ Nivel</button>')}</div>
    <div class="map">${c.levels.map((l, i) => viewLevel(c, l, i, current))}</div></section>`;
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
    <h2>Tus recompensas</h2><p>Canjea monedas por premios de verdad. Los pones tú.</p>
    <div class="row"><span class="big num coins-big"><img src="${IMG.coin}" alt="">${have}</span>
      <button class="btn dark" data-act="toggleEditing">${ui.editing ? 'Listo' : 'Editar'}</button></div></section>
    <section class="panel"><h3>Premios</h3>
      <ul class="rewards">${S.rewards.map(r => {
        const can = have >= r.cost, armed = ui.armed === 'buy:' + r.id;
        return `<li class="reward ${can ? 'can' : ''}"><div class="txt"><b>${esc(r.name)}</b>${coinBadge(r.cost)}</div>
          ${ui.editing ? confirmBtn('deleteReward', r.id, 'Borrar')
            : can ? `<button class="btn ${armed ? 'primary' : ''}" data-act="buyReward" data-id="${r.id}">${armed ? '¿Canjear?' : 'Canjear'}</button>`
            : `<span class="need num">Te faltan ${r.cost - have}</span>`}</li>`;
      })}${when(!S.rewards.length, '<li><small class="hint">Añade tu primer premio.</small></li>')}</ul>
      ${ui.addingReward || ui.editing ? html`<form class="adde" data-form="addReward"><input name="n" placeholder="Premio (ej: Zapatillas nuevas)" maxlength="60" required aria-label="Premio">
        <input name="c" type="number" inputmode="numeric" min="10" max="99999" step="10" value="300" aria-label="Precio en monedas" style="width:96px"><button class="btn primary">Añadir</button></form>`
        : '<button class="btn add-ex" data-act="addRewardForm">+ Premio</button>'}
      <p class="hint">Ganas monedas con cada misión (la mitad de su XP), cada entreno (+${COINS.train}), cada récord (+${COINS.record}) y el cofre diario.</p></section>
    ${when(recent.length, html`<section class="panel"><h3>Canjeado</h3><ul class="hist">${recent.map(p =>
      `<li><b>${esc(p.name)}</b><span class="num">${shortDate(p.d)} · ${p.cost}</span>${when(ui.editing, confirmBtn('deletePurchase', p.id, 'Devolver'))}</li>`)}</ul></section>`)}`;
}
function viewCampaign(c) {
  const p = campaignProgress(c), inSession = c.tracker === 'body' && sessionOpen();
  return html`<section class="c-hero" style="background:${colorVar(c)}"><span class="ico">${ICONS[c.icon] || ICONS.star}</span>
    <span class="pill">${GLYPH.star}Nivel ${currentLevelIndex(c) + 1} de ${c.levels.length}</span>
    <h2>${esc(c.name)}</h2>${when(c.sub, `<p>${esc(c.sub)}</p>`)}
    <div class="row"><span class="big num">${pct(p)}%</span>
      <div class="edit-row">${when(ui.editing && S.campaigns.length > 1, `<button class="btn danger on-color" data-act="deleteCampaign">${ui.armed === c.id ? '¿Borrar campaña?' : 'Borrar'}</button>`)}<button class="btn dark" data-act="toggleEditing">${ui.editing ? 'Listo' : 'Editar'}</button></div></div>
    ${bar(p)}</section>
    ${when(!inSession, viewBoss(c))}${when(c.tracker === 'body', viewBody())}${when(!inSession, viewMap(c))}`;
}

function render() {
  const campaign = S.campaigns.find(c => c.id === ui.view);
  if (!campaign && ui.view !== 'shop') ui.view = 'home';
  const y = window.scrollY;
  document.getElementById('app').innerHTML = viewTop() + viewAccount() + (campaign ? viewCampaign(campaign) : ui.view === 'shop' ? viewShop() : viewHome())
    + `<datalist id="ex-list">${COMMON_EXERCISES.map(n => `<option value="${n}">`).join('')}</datalist>`;
  document.getElementById('nav').innerHTML = viewNav();
  window.scrollTo(0, y);
  const name = document.getElementById('nc-name');
  if (name && !name.value) name.focus();
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
  const item = ITEMS.find(i => i.level === L), el = document.createElement('div');
  el.className = 'lvlup';
  el.innerHTML = html`<div><span class="pill">${GLYPH.star}Subes de nivel</span><div class="big">${L}</div><h2>${rankFor(L)}</h2>
    ${item ? `<img src="${IMG[item.key]}" alt=""><p class="hint on-lilac">Desbloqueas: <b>${item.name}</b>${item.wearable ? '. AXIS ya lo lleva puesto.' : ''}</p>` : ''}
    <button class="btn dark wide">Seguir</button></div>`;
  el.addEventListener('click', () => el.remove());
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
  signOut: async () => { await cloud.client.auth.signOut(); ui.account = false; render(); toast('Sesión cerrada. Lo tuyo sigue en este dispositivo'); },
  signUp: async el => {
    const F = el.closest('form').elements;
    if (!F.email.checkValidity() || !F.password.checkValidity()) { toast('Pon un email y una contraseña de 6 caracteres o más'); return; }
    const { data, error } = await cloud.client.auth.signUp({ email: F.email.value.trim(), password: F.password.value, options: { emailRedirectTo: location.origin + location.pathname } });
    if (error) { toast(authError(error)); return; }
    if (!data.session) toast('Revisa tu correo para confirmar la cuenta y luego dale a Entrar');
  },
  open: el => { ui.view = el.dataset.id; ui.addingCampaign = false; ui.editing = false; ui.exForm = null; ui.addingReward = false; render(); window.scrollTo(0, 0); },
  toggleEditing: repaint(() => { ui.editing = !ui.editing; }),
  toggleLevel: el => { const card = el.closest('.lv-card'); ui.open[el.dataset.k] = card.dataset.open !== '1'; render(); },

  // Misiones
  toggleMission: el => hitBoss(el, s => { const { c, m } = findMission(el); m.done = !m.done; m.doneAt = m.done ? Date.now() : null; logActivity(s, c.id, m.done ? 1 : -1); }),
  increment: el => hitBoss(el, s => { const { c, m } = findMission(el); if (m.count < m.target) { m.count++; logActivity(s, c.id, 1); if (m.count >= m.target) m.doneAt = Date.now(); } }),
  decrement: el => hitBoss(el, s => { const { c, m } = findMission(el); if (m.count > 0) { m.count--; logActivity(s, c.id, -1); } }),

  // Diarias, cofre, tienda e inventario
  toggleHabit: el => update(s => { const day = dayOf(s), h = (day.habits = day.habits || {}); h[el.dataset.k] = !h[el.dataset.k]; }),
  openChest: () => {
    const quests = dailyQuests();
    if (!quests.every(q => questDone(q)) || (S.daily[today()] || {}).chest) return;
    const gold = Math.random() < 0.15, chest = { coins: (30 + Math.floor(Math.random() * 31)) * (gold ? 2 : 1), xp: gold ? 50 : 25, gold };
    update(s => { dayOf(s).chest = chest; });
    showChest(chest);
  },
  toggleWear: el => update(s => {
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
  deletePurchase: el => confirmTwice(el.dataset.id, s => { s.purchases = s.purchases.filter(x => x.id !== el.dataset.id); }),
  deleteMission: el => { const { l, m } = findMission(el); confirmTwice(m.id, () => { l.missions = l.missions.filter(x => x !== m); }); },
  addLevel: () => { const c = activeCampaign(), l = level(`Nivel ${c.levels.length + 1}`, []); ui.open[c.id + l.id] = true; update(() => c.levels.push(l), { reward: false }); },
  deleteLevel: (el, ev) => { ev.preventDefault(); const c = findCampaign(el.dataset.c); confirmTwice(el.dataset.id, () => { c.levels = c.levels.filter(x => x.id !== el.dataset.id); }); },

  // Campañas
  toggleNewCampaign: repaint(() => { ui.addingCampaign = !ui.addingCampaign; }),
  pickIcon: el => { ui.newIcon = el.dataset.k; document.querySelectorAll('.icons button').forEach(b => b.setAttribute('aria-pressed', b.dataset.k === ui.newIcon)); },
  pickColor: el => { ui.newColor = el.dataset.k; document.querySelectorAll('.swatches button').forEach(b => b.setAttribute('aria-pressed', b.dataset.k === ui.newColor)); },
  createCampaign: () => {
    const input = document.getElementById('nc-name'), name = input.value.trim();
    if (!name) { input.focus(); return; }
    const c = { id: uid(), name, icon: ui.newIcon, color: ui.newColor, sub: '', levels: [level('Nivel 1', [])] };
    Object.assign(ui, { addingCampaign: false, view: c.id, editing: true });
    ui.open[c.id + c.levels[0].id] = true;
    update(s => s.campaigns.push(c), { reward: false });
    window.scrollTo(0, 0);
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
      const last = s.weight.log[s.weight.log.length - 1];
      if (last && last.d === today()) last.kg = kg; else s.weight.log.push({ d: today(), kg });
      if (s.weight.start == null) s.weight.start = kg;
    });
  },
  setGoal: () => {
    const kg = num(document.getElementById('goal').value);
    if (!(kg >= 30 && kg <= 250)) { toast('Pon un peso entre 30 y 250 kg'); return; }
    update(s => { s.weight.goal = kg; });
  },
  toggleTrainedToday: () => update(s => {
    const i = s.train.indexOf(today());
    if (i >= 0) s.train.splice(i, 1); else { s.train.push(today()); s.train.sort(); }
  }),

  // Rutinas y sesiones
  startSession: el => {
    const r = S.routines.find(x => x.id === el.dataset.id);
    ui.draft = { routine: r.id, ex: Object.fromEntries(r.exercises.map(x => [x.id, nextSession(x).rows])) };
    saveDraft(); render(); window.scrollTo(0, 0);
  },
  discardSession: () => {
    if (ui.armed !== 'session') { ui.armed = 'session'; render(); return; }
    ui.armed = null; ui.draft = null; ui.exForm = null; saveDraft(); render();
  },
  addSet: el => {
    const rows = ui.draft.ex[el.dataset.x], x = S.routines.find(r => r.id === ui.draft.routine).exercises.find(e => e.id === el.dataset.x);
    rows.push(rows.length ? Object.assign({}, rows[rows.length - 1]) : blankSet(x));
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
    const recordsBefore = totalRecords();
    ui.draft = null; saveDraft();
    update(s => {
      s.sessions.push({ id: uid(), d: today(), routine: r.id, rname: r.name, ex });
      if (s.sessions.length > 600) s.sessions.shift();
      if (!s.train.includes(today())) { s.train.push(today()); s.train.sort(); }
    });
    window.scrollTo(0, 0);
    const fresh = totalRecords() - recordsBefore;
    if (fresh > 0) setTimeout(() => toast(fresh > 1 ? `${fresh} récords nuevos` : '1 récord nuevo'), 2000);
  },
  deleteRoutine: el => confirmTwice(el.dataset.id, s => { s.routines = s.routines.filter(x => x.id !== el.dataset.id); }),
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
  });
  return cur;
}
const forms = {
  addReward: (f, F) => {
    const name = F.n.value.trim(), cost = Math.max(10, Math.round(num(F.c.value) || 0));
    if (!name || !cost) return;
    ui.addingReward = false;
    update(s => s.rewards.push(reward(name, cost)), { reward: false });
    toast('Premio añadido');
  },
  signIn: async (f, F) => {
    const { error } = await cloud.client.auth.signInWithPassword({ email: F.email.value.trim(), password: F.password.value });
    if (error) toast(authError(error)); else toast('Conectado. Sincronizando…');
  },
  addMission: (f, F) => {
    const c = findCampaign(f.dataset.c), l = c.levels.find(x => x.id === f.dataset.l), name = F.n.value.trim();
    if (!name) return;
    const times = parseInt(F.t.value, 10), xp = parseInt(F.x.value, 10);
    update(() => l.missions.push(times > 1 ? count(name, xp, times) : mission(name, xp)), { reward: false });
    refocus(`[data-form="addMission"][data-l="${l.id}"]`);
  },
  addRoutine: (f, F) => {
    const name = F.n.value.trim();
    if (name) update(s => s.routines.push({ id: uid(), name, exercises: [] }), { reward: false });
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
      step: needs.includes('step') ? Math.max(0.5, num(F.st.value) || 2.5) : 2.5,
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
  if (!name.startsWith('delete') && name !== 'discardSession') ui.armed = null;
  if (actions[name]) actions[name](el, ev);
});
document.addEventListener('submit', ev => {
  const f = ev.target;
  ev.preventDefault();
  if (forms[f.dataset.form]) forms[f.dataset.form](f, f.elements);
});
document.addEventListener('input', ev => {
  const t = ev.target, d = ui.draft;
  if (!t.dataset.f || !d || !d.ex[t.dataset.x]) return;
  const row = d.ex[t.dataset.x][+t.dataset.i];
  if (row) { row[t.dataset.f] = t.value; saveDraft(); }
});
document.addEventListener('change', ev => {
  const t = ev.target, form = t.closest('.exform');
  if (!form || t.name !== 'k') return;
  form.querySelectorAll('.fgroup').forEach(g => { g.hidden = !KIND_FIELDS[t.value].includes(g.dataset.needs); });
  form.querySelector('.kind-help').textContent = KIND_HELP[t.value];
});
const ENTER = { kg: 'logWeight', goal: 'setGoal', 'nc-name': 'createCampaign' };
document.addEventListener('keydown', ev => {
  if (ev.key !== 'Enter' || !ENTER[ev.target.id]) return;
  ev.preventDefault();
  actions[ENTER[ev.target.id]]();
});

render();
initCloud();
})();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
