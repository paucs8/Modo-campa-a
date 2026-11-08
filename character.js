/* Personaje pixel art de cada jugador, por capas.
   Se dibuja en el navegador a partir de su "look": cuerpo, cara, pelo, cabeza,
   ropa de arriba y de abajo, calzado y accesorios, más los objetos que ha
   desbloqueado y los ojos cerrados si está cansado. Lienzo de 44×82 px. */
(function () {
'use strict';

const W = 44, H = 82;

// ---------- Catálogo: lo que se puede elegir ----------
const STYLES = {
  hairStyle: { corto: 'Corto', revuelto: 'Revuelto', rapado: 'Rapado', melena: 'Melena', largo: 'Largo', mono: 'Moño', coletas: 'Coletas', trenzas: 'Trenzas', rizos: 'Rizos', afro: 'Afro' },
  glasses: { no: 'Sin gafas', finas: 'Finas', pasta: 'De pasta', sol: 'De sol', estrella: 'De estrella' },
  beard: { no: 'Nada', bigote: 'Bigote', barba: 'Barba' },
  head: { no: 'Nada', gorra: 'Gorra', gorro: 'Gorro', bucket: 'Bucket', bandana: 'Bandana', horquillas: 'Horquillas', gato: 'Gorro de gato', corona: 'Corona' },
  top: { camiseta: 'Camiseta', sudadera: 'Sudadera', jersey: 'Jersey', capas: 'Capas', camisa: 'Camisa abierta', chaqueta: 'Chaqueta' },
  pattern: { liso: 'Liso', rayas: 'Rayas', cuadros: 'Cuadros', franja: 'Franja', llamas: 'Llamas' },
  bottom: { cargo: 'Cargo ancho', vaqueros: 'Vaqueros', chandal: 'Chándal', corto: 'Pantalón corto', falda: 'Falda' },
  legs: { piel: 'Sin medias', medias: 'Medias', rejilla: 'Rejilla', rayas: 'Medias de rayas' },
  shoes: { bambas: 'Bambas', altas: 'Bambas altas', botas: 'Botas', plataformas: 'Plataformas', doradas: 'Doradas' },
  bag: { no: 'Nada', bolso: 'Bolso cruzado', mochila: 'Mochila', rinonera: 'Riñonera', capa: 'Capa' },
};
// Prendas especiales: se ganan, se compran con monedas o salen al subir de nivel
const PREMIUM = {
  'head:corona': { name: 'Corona', how: 'win' },
  'glasses:estrella': { name: 'Gafas de estrella', cost: 300 },
  'head:gato': { name: 'Gorro de gato', cost: 400 },
  'pattern:llamas': { name: 'Estampado de llamas', cost: 500 },
  'shoes:doradas': { name: 'Zapatillas doradas', level: 6 },
  'bag:capa': { name: 'Capa', level: 8 },
};
const free = (field, list) => list.filter(v => !PREMIUM[field + ':' + v]);
const COLORS = {
  skin: ['#FBE0CB', '#F1C8A5', '#E2AE85', '#C98E62', '#A06840', '#7A4A2C', '#523018'],
  eyes: ['#3B2A1E', '#5A7D3A', '#3D6FB3', '#7A5230', '#2B2B30', '#7E8C99'],
  hair: ['#16161B', '#4A3020', '#8B5A2B', '#D9A85A', '#F0E2C0', '#C2462A', '#E97FB0', '#9C7CF0', '#4F8FE0', '#E9E9EE'],
  head: ['#1C1C20', '#F2F2F2', '#C0392B', '#2D5BD7', '#3E7C3A', '#E0A526', '#E97FB0'],
  cloth: ['#F2F2F2', '#1F1F24', '#8C8C94', '#C0392B', '#E07A2E', '#E0C23A', '#3E7C3A', '#2D5BD7', '#1F3A6B', '#8C6FE0', '#E97FB0', '#7A4E32'],
  bottom: ['#242428', '#3B4A6B', '#6E8BB8', '#6B5B45', '#D9D2C3', '#4A5A3A', '#9A9AA0', '#C0392B', '#1F1F24'],
  legs: ['#16161B', '#F2F2F2', '#C0392B', '#8C6FE0', '#E97FB0'],
  shoes: ['#F0F0F0', '#1C1C20', '#C0392B', '#2D5BD7', '#E0A526', '#7A4E32'],
};
const BASE = {
  v: 2,
  skin: '#F1C8A5', eyes: '#3B2A1E', freckles: false, blush: false, beard: 'no', earrings: false,
  hair: '#16161B', hair2: null, hairStyle: 'corto', bangs: false, braids: false,
  glasses: 'no', head: 'no', headColor: '#1C1C20',
  top: 'sudadera', topColor: '#F2F2F2', top2: '#1F1F24', pattern: 'liso', stripe: '#1F1F24',
  bottom: 'cargo', bottomColor: '#242428', legs: 'piel', legsColor: '#16161B',
  shoes: 'bambas', shoesColor: '#F0F0F0', bag: 'no', bagColor: '#1F1F24', chain: false, necklace: false,
};
const pick = list => list[Math.floor(Math.random() * list.length)];
const chance = p => Math.random() < p;
function randomLook() {
  const top = pick(free('top', Object.keys(STYLES.top)));
  return Object.assign({}, BASE, {
    skin: pick(COLORS.skin), eyes: pick(COLORS.eyes), freckles: chance(0.25), blush: chance(0.3), beard: chance(0.15) ? pick(['bigote', 'barba']) : 'no', earrings: chance(0.3),
    hair: pick(COLORS.hair), hair2: chance(0.2) ? pick(COLORS.hair) : null, hairStyle: pick(free('hairStyle', Object.keys(STYLES.hairStyle))), bangs: chance(0.4), braids: chance(0.15),
    glasses: chance(0.3) ? pick(['finas', 'pasta', 'sol']) : 'no', head: chance(0.35) ? pick(['gorra', 'gorro', 'bucket', 'bandana', 'horquillas']) : 'no', headColor: pick(COLORS.head),
    top, topColor: pick(COLORS.cloth), top2: pick(COLORS.cloth), pattern: chance(0.35) ? pick(['rayas', 'cuadros', 'franja']) : 'liso', stripe: pick(COLORS.cloth),
    bottom: pick(free('bottom', Object.keys(STYLES.bottom))), bottomColor: pick(COLORS.bottom), legs: chance(0.3) ? pick(['medias', 'rejilla', 'rayas']) : 'piel', legsColor: pick(COLORS.legs),
    shoes: pick(free('shoes', Object.keys(STYLES.shoes))), shoesColor: pick(COLORS.shoes), bag: chance(0.4) ? pick(['bolso', 'mochila', 'rinonera']) : 'no', bagColor: pick(COLORS.cloth),
    chain: chance(0.2), necklace: chance(0.2),
  });
}
/** Traduce el personaje de la versión anterior (más simple) al nuevo. */
function upgrade(look) {
  if (!look) return randomLook();
  if (look.v === 2 || ['topColor', 'bottom', 'glasses', 'pattern', 'shoesColor'].some(k => k in look)) return Object.assign({}, BASE, look, { v: 2 });
  const style = { revuelto: 'revuelto', largo: 'largo', corto: 'corto' }[look.hairStyle] || 'corto';
  return Object.assign({}, BASE, {
    v: 2, skin: look.skin || BASE.skin, hair: look.hair || BASE.hair, hairStyle: style,
    head: look.cap ? 'gorra' : 'no', headColor: look.capColor || BASE.headColor,
    topColor: look.top || BASE.topColor, bottomColor: look.pants || BASE.bottomColor, shoesColor: look.shoes || BASE.shoesColor,
    bag: look.straps ? 'mochila' : 'no',
  });
}

// ---------- Colores ----------
const rgb = hex => { const n = parseInt(String(hex || '#000').replace('#', '').padEnd(6, '0').slice(0, 6), 16) || 0; return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const mul = (c, f) => c.map(v => Math.max(0, Math.min(255, Math.round(v * f))));
const tint = (c, f) => c.map(v => Math.round(v + (255 - v) * f));
const mix = (a, b, t) => a.map((v, i) => Math.round(v * (1 - t) + b[i] * t));
const K = [17, 17, 17], WHITE = [246, 246, 246], METAL = [181, 181, 186], GOLD = [232, 182, 52], RED = [229, 72, 60], DARK = [28, 28, 32], GREY = [120, 120, 126];

function paint(input, { items = [], closed = false } = {}) {
  const L = upgrade(input);
  const px = new Uint8ClampedArray(W * H * 4);
  const set = (x, y, c) => { if (x < 0 || y < 0 || x >= W || y >= H || !c) return; const i = (y * W + x) * 4; px[i] = c[0]; px[i + 1] = c[1]; px[i + 2] = c[2]; px[i + 3] = 255; };
  const filled = (x, y) => x >= 0 && y >= 0 && x < W && y < H && px[(y * W + x) * 4 + 3] > 0;
  // c puede ser un color o una función (x, y) => color, para estampados
  const rect = (x0, y0, x1, y1, c) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) set(x, y, typeof c === 'function' ? c(x, y) : c); };
  const row = (y, x0, x1, c) => rect(x0, y, x1, y, c);
  const dots = (list, c) => list.forEach(([x, y]) => set(x, y, typeof c === 'function' ? c(x, y) : c));
  const mirror = (list, c) => dots(list.flatMap(([x, y]) => [[x, y], [W - 1 - x, y]]), c);
  const has = k => items.includes(k);

  const skin = rgb(L.skin), skinS = mul(skin, 0.86), skinD = mul(skin, 0.7);
  const hairA = rgb(L.hair), hairB = L.hair2 ? rgb(L.hair2) : hairA;
  const top1 = rgb(L.topColor), top2 = rgb(L.top2), stripe = rgb(L.stripe);
  const bot = rgb(L.bottomColor), legC = rgb(L.legsColor), shoe = rgb(L.shoesColor), bag = rgb(L.bagColor), headC = rgb(L.headColor);

  // Pelo: color base arriba y, si hay segundo color, puntas a partir de cierta altura
  const tipsFrom = { corto: 13, revuelto: 14, rapado: 99, melena: 22, largo: 30, mono: 99, coletas: 19, trenzas: 30, rizos: 18, afro: 16 }[L.hairStyle] || 99;
  const noise = (x, y) => { let h = Math.imul(x, 374761393) + Math.imul(y, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return (h ^ (h >>> 16)) >>> 0; };
  const curly = L.hairStyle === 'rizos' || L.hairStyle === 'afro';
  const hairAt = (x, y) => {
    const base = y >= tipsFrom ? hairB : hairA;
    if ((y === 10 && x >= 16 && x <= 18) || (y === 11 && x >= 15 && x <= 17)) return tint(base, 0.22); // brillo
    if (curly && noise(x, y) % 6 === 0) return mul(base, 0.8); // textura de rizo
    return base;
  };
  const hairS = (x, y) => mul(hairAt(x, y), 0.78);
  const brow = mul(hairA, 0.75);

  // Prenda de arriba con estampado
  const pat = (base, x, y) => {
    if (L.pattern === 'rayas') return (y % 4 < 2) ? stripe : base;
    if (L.pattern === 'cuadros') return (x % 4 === 0 || y % 4 === 0) ? mix(base, stripe, 0.75) : base;
    if (L.pattern === 'franja') return (y >= 40 && y <= 43) ? stripe : base;
    if (L.pattern === 'llamas') { const crest = 45 - [0, 3, 1, 4, 2, 0, 3, 5, 1][x % 9]; if (y >= crest + 4) return tint(stripe, 0.35); if (y >= crest) return stripe; return base; }
    return base;
  };
  const topAt = (x, y) => pat(top1, x, y);
  const topS = (x, y) => mul(topAt(x, y), 0.84);

  // ===== 1. Pelo de detrás =====
  const backHair = {
    melena: () => rect(11, 14, 32, 31, hairS),
    largo: () => { rect(10, 14, 33, 44, hairS); row(45, 11, 32, hairS); row(46, 13, 30, hairS); row(47, 16, 27, hairS); },
    rizos: () => { rect(9, 11, 34, 30, hairS); mirror([[8, 16], [8, 20], [8, 24], [9, 31]], hairS); },
    afro: () => { for (let y = 1; y <= 27; y++) for (let x = 5; x <= 38; x++) { const dx = (x - 21.5) / 16.5, dy = (y - 13) / 13.5; if (dx * dx + dy * dy <= 1) set(x, y, hairAt(x, y)); } },
    coletas: () => { for (const cx of [8, 35]) for (let y = 13; y <= 28; y++) for (let x = cx - 4; x <= cx + 4; x++) { const dx = (x - cx) / 4.5, dy = (y - 20) / 8; if (dx * dx + dy * dy <= 1) set(x, y, (x === cx - 4 || x === cx + 4) ? hairS(x, y) : hairAt(x, y)); } },
    trenzas: () => { for (const x0 of [10, 31]) { for (let y = 18; y <= 44; y++) rect(x0, y, x0 + 2, y, (y % 3 === 0) ? hairS(x0, y) : hairAt(x0, y)); row(45, x0, x0 + 2, RED); row(46, x0, x0 + 2, hairAt); set(x0 + 1, 47, hairAt(x0 + 1, 47)); } },
  };
  (backHair[L.hairStyle] || (() => {}))();
  if (L.top === 'sudadera') rect(14, 29, 29, 33, mul(top1, 0.72)); // capucha por detrás
  if (L.bag === 'capa') { for (let y = 31; y <= 66; y++) { const t = (y - 31) / 35; row(y, Math.round(9 - 5 * t), Math.round(34 + 5 * t), (x) => (x % 5 === 0 ? mul(bag, 0.8) : bag)); } row(66, 4, 39, mul(bag, 0.7)); }

  // ===== 2. Skate (detrás de la mano derecha) =====
  if (has('skate')) {
    rect(38, 36, 42, 76, DARK); row(35, 39, 41, DARK); row(77, 39, 41, DARK);
    for (const y of [41, 71]) { rect(37, y, 42, y + 1, [239, 227, 200]); row(y - 1, 38, 41, [196, 196, 200]); }
    rect(39, 52, 41, 60, RED); rect(39, 53, 39, 59, mul(RED, 0.75));
  }

  // ===== 3. Piernas, parte de abajo y calzado =====
  const legAt = (x, y) => {
    if (L.legs === 'medias') return (x % 5 === 0) ? mul(legC, 0.85) : legC;
    if (L.legs === 'rejilla') return ((x + y) % 2 === 0) ? legC : skin;
    if (L.legs === 'rayas') return (y % 4 < 2) ? legC : WHITE;
    return (x === 14 || x === 24) ? skinS : skin;
  };
  const bare = { corto: 62, falda: 63 }[L.bottom];
  if (bare) { rect(14, bare, 19, 73, legAt); rect(24, bare, 29, 73, legAt); }
  const botS = mul(bot, 0.78), botL = tint(bot, 0.14);
  ({
    cargo: () => {
      for (let y = 54; y <= 73; y++) { const t = (y - 54) / 19; row(y, Math.round(11 - 2 * t), Math.round(32 + 2 * t), bot); }
      rect(21, 62, 22, 73, botS);
      for (const x0 of [9, 29]) { rect(x0, 60, x0 + 5, 66, botL); row(60, x0, x0 + 5, botS); }
      dots([[12, 69], [31, 69], [13, 71], [30, 71]], botS);
    },
    vaqueros: () => { rect(12, 54, 31, 73, bot); rect(21, 61, 22, 73, botS); rect(14, 63, 17, 66, botL); rect(26, 63, 29, 66, botL); mirror([[12, 73], [13, 73]], botS); },
    chandal: () => { rect(12, 54, 31, 72, bot); rect(21, 61, 22, 72, botS); rect(12, 55, 12, 72, stripe); rect(31, 55, 31, 72, stripe); row(73, 13, 20, botS); row(73, 23, 30, botS); },
    corto: () => { rect(11, 54, 32, 61, bot); rect(21, 58, 22, 61, botS); row(61, 11, 20, botS); row(61, 23, 32, botS); },
    falda: () => { for (let y = 54; y <= 62; y++) { const t = (y - 54) / 8; row(y, Math.round(12 - 3 * t), Math.round(31 + 3 * t), (x, yy) => ((x - 9) % 4 === 0 && yy > 56) ? botS : bot); } row(62, 9, 34, botS); },
  }[L.bottom] || (() => {}))();
  if (['cargo', 'vaqueros', 'corto', 'falda'].includes(L.bottom)) { row(54, 12, 31, DARK); rect(20, 54, 23, 54, METAL); }

  const shoeS = mul(shoe, 0.66), sole = L.shoes === 'botas' ? DARK : (shoe[0] + shoe[1] + shoe[2] > 600 ? [200, 200, 204] : WHITE);
  const feet = [[11, 20], [23, 32]];
  ({
    bambas: () => feet.forEach(([a, b]) => { rect(a, 74, b, 77, shoe); row(78, a, b, sole); dots([[a + 3, 75], [a + 5, 75]], shoeS); }),
    altas: () => feet.forEach(([a, b]) => { rect(a + 2, 69, b - 1, 73, shoe); rect(a, 74, b, 77, shoe); row(78, a, b, sole); set(a === 11 ? a + 3 : b - 3, 71, WHITE); set(a === 11 ? a + 3 : b - 3, 72, WHITE); row(73, a + 2, b - 1, shoeS); }),
    botas: () => feet.forEach(([a, b]) => { rect(a + 2, 67, b - 1, 74, shoe); rect(a, 74, b, 77, shoe); rect(a, 78, b, 79, DARK); dots([[a + 4, 69], [a + 5, 71], [a + 4, 73]], shoeS); }),
    plataformas: () => feet.forEach(([a, b]) => { rect(a, 73, b, 75, shoe); rect(a, 76, b, 79, sole); row(76, a, b, mul(sole, 0.85)); }),
    doradas: () => feet.forEach(([a, b]) => { rect(a + 1, 72, b - 1, 73, GOLD); rect(a, 74, b, 77, GOLD); row(78, a, b, mul(GOLD, 0.7)); dots([[a + 2, 75], [b - 2, 74]], tint(GOLD, 0.6)); set(a + 4, 71, WHITE); }),
  }[L.shoes] || (() => {}))();

  // ===== 4. Torso, brazos y manos =====
  const longSleeves = L.top !== 'camiseta';
  const sleeveAt = L.top === 'capas' ? (x, y) => (y <= 39 ? topAt(x, y) : top2) : topAt;
  // brazos
  rect(6, 34, 10, 50, (x, y) => (longSleeves || y <= 40) ? sleeveAt(x, y) : skin);
  rect(33, 34, 37, 50, (x, y) => (longSleeves || y <= 40) ? sleeveAt(x, y) : skin);
  rect(10, 35, 10, 50, (x, y) => ((longSleeves || y <= 40) ? mul(sleeveAt(x, y), 0.8) : skinS));
  rect(33, 35, 33, 50, (x, y) => ((longSleeves || y <= 40) ? mul(sleeveAt(x, y), 0.8) : skinS));
  if (L.top === 'sudadera' || L.top === 'jersey') { row(49, 6, 9, topS); row(50, 6, 9, topS); row(49, 34, 37, topS); row(50, 34, 37, topS); }
  // tronco
  row(32, 12, 31, topAt); row(33, 10, 33, topAt);
  rect(11, 34, 32, 53, topAt);
  rect(11, 34, 11, 53, topS); rect(32, 34, 32, 53, topS);
  ({
    camiseta: () => { row(32, 18, 25, skin); row(33, 17, 26, topS); row(53, 11, 32, topS); },
    sudadera: () => { row(32, 17, 26, mul(top1, 0.72)); dots([[19, 34], [19, 35], [19, 36], [19, 37], [24, 34], [24, 35], [24, 36], [24, 37]], tint(top1, 0.5));
      row(45, 15, 28, topS); rect(15, 45, 15, 50, topS); rect(28, 45, 28, 50, topS); row(52, 11, 32, topS); row(53, 11, 32, topS); },
    jersey: () => { row(32, 18, 25, skin); row(33, 17, 26, topS); for (let x = 11; x <= 32; x++) { set(x, 52, x % 2 ? topS(x, 52) : topAt(x, 52)); set(x, 53, x % 2 ? topS(x, 53) : topAt(x, 53)); } },
    capas: () => { row(32, 18, 25, skin); row(33, 17, 26, topS); rect(11, 51, 32, 54, top2); row(51, 11, 32, mul(top2, 0.8)); },
    camisa: () => { rect(18, 32, 25, 53, top2); dots([[17, 32], [17, 33], [18, 34], [26, 32], [26, 33], [25, 34], [16, 33], [27, 33]], topS); rect(17, 35, 17, 53, topS); rect(26, 35, 26, 53, topS); row(32, 19, 24, skin); },
    chaqueta: () => { rect(19, 32, 24, 53, top2); rect(21, 34, 22, 53, METAL); dots([[17, 32], [18, 33], [26, 32], [25, 33]], topS); rect(18, 34, 18, 53, topS); rect(25, 34, 25, 53, topS); row(32, 20, 23, skin); row(53, 11, 32, topS); },
  }[L.top] || (() => {}))();
  // manos
  rect(6, 51, 9, 53, skin); row(53, 6, 9, skinS); rect(34, 51, 37, 53, skin); row(53, 34, 37, skinS);
  if (L.bag === 'capa') { set(17, 33, GOLD); set(26, 33, GOLD); }
  if (L.necklace) { dots([[18, 33], [19, 34], [20, 34], [21, 35], [22, 35], [23, 34], [24, 34], [25, 33]], GOLD); set(21, 36, GOLD); set(22, 36, GOLD); }

  // ===== 5. Accesorios del cuerpo =====
  ({
    bolso: () => { for (let i = 0; i <= 20; i++) set(31 - Math.round(i * 0.85), 33 + i, DARK); rect(7, 50, 15, 57, bag); row(50, 7, 15, mul(bag, 0.75)); rect(7, 51, 15, 52, mul(bag, 0.75)); set(11, 53, METAL); },
    mochila: () => { rect(14, 33, 15, 47, DARK); rect(28, 33, 29, 47, DARK); dots([[14, 41], [15, 41], [28, 41], [29, 41]], METAL); },
    capa: () => {},
    rinonera: () => { row(50, 11, 32, DARK); rect(16, 49, 28, 54, bag); row(51, 17, 27, mul(bag, 0.7)); set(27, 51, METAL); },
  }[L.bag] || (() => {}))();
  if (L.chain) { for (let i = 0; i <= 6; i++) set(26 + Math.round(i / 2), 55 + i, i % 2 ? METAL : GREY); for (let i = 0; i <= 5; i++) set(30 - Math.round(i / 3), 61 - i, i % 2 ? METAL : GREY); }
  if (has('llavero')) { rect(28, 55, 28, 59, METAL); rect(26, 60, 30, 63, GOLD); set(26, 60, tint(GOLD, 0.4)); rect(28, 61, 28, 62, mul(GOLD, 0.75)); }
  if (has('handycam')) { rect(1, 47, 8, 53, DARK); rect(2, 48, 6, 48, GREY); dots([[1, 49], [1, 50]], METAL); rect(5, 45, 8, 46, DARK); set(3, 51, RED); rect(6, 51, 8, 53, skin); }

  // ===== 6. Cuello, orejas y cara =====
  rect(19, 30, 24, 31, skinS);
  for (const [y, a, b] of [[12, 15, 28], [13, 14, 29], [27, 14, 29], [28, 15, 28], [29, 17, 26]]) row(y, a, b, skin);
  rect(13, 14, 30, 26, skin);
  rect(12, 19, 12, 23, skin); rect(31, 19, 31, 23, skin); set(12, 21, skinS); set(31, 21, skinS);
  if (has('auriculares')) { row(33, 16, 27, DARK); rect(13, 29, 16, 33, DARK); rect(27, 29, 30, 33, DARK); rect(14, 30, 15, 32, GREY); rect(28, 30, 29, 32, GREY); set(14, 31, RED); set(29, 31, RED); }
  // ojos
  const eye = rgb(L.eyes);
  if (closed) { row(21, 15, 18, K); row(21, 25, 28, K); }
  else { rect(16, 20, 17, 22, eye); rect(26, 20, 27, 22, eye); set(16, 20, WHITE); set(26, 20, WHITE); row(22, 16, 17, mul(eye, 0.6)); row(22, 26, 27, mul(eye, 0.6)); }
  row(18, 15, 18, brow); row(18, 25, 28, brow);
  dots([[21, 24], [22, 24]], skinS);
  row(26, 20, 23, mix(skinD, [150, 60, 60], 0.35));
  if (L.blush) dots([[14, 24], [15, 24], [28, 24], [29, 24]], mix(skin, [240, 110, 120], 0.45));
  if (L.freckles) dots([[15, 23], [17, 24], [16, 25], [26, 24], [28, 23], [27, 25]], mix(skinD, [150, 80, 40], 0.3));
  if (L.beard === 'bigote') row(25, 19, 24, brow);
  if (L.beard === 'barba') { rect(13, 22, 14, 26, hairAt); rect(29, 22, 30, 26, hairAt); row(27, 14, 19, hairAt); row(27, 24, 29, hairAt); row(28, 15, 28, hairAt); row(29, 17, 26, hairAt); row(25, 19, 24, hairAt); set(20, 27, hairAt(20, 27)); set(23, 27, hairAt(23, 27)); }
  if (L.earrings) { set(12, 24, GOLD); set(31, 24, GOLD); set(12, 25, GOLD); set(31, 25, GOLD); }

  // ===== 7. Pelo de delante =====
  const top = (rows) => rows.forEach(([y, a, b]) => row(y, a, b, hairAt));
  const capTop = () => top([[9, 16, 27], [10, 14, 29], [11, 13, 30], [12, 13, 30], [13, 13, 30]]);
  ({
    corto: () => { capTop(); rect(12, 14, 13, 18, hairAt); rect(30, 14, 31, 18, hairAt); row(14, 13, 16, hairAt); },
    revuelto: () => { capTop(); dots([[16, 7], [19, 7], [23, 7], [27, 7], [15, 8], [16, 8], [17, 8], [19, 8], [20, 8], [21, 8], [23, 8], [24, 8], [25, 8], [27, 8], [28, 8]], hairAt);
      rect(11, 14, 13, 22, hairAt); rect(30, 14, 32, 22, hairAt); mirror([[10, 16], [10, 19], [12, 23]], hairAt); row(14, 14, 18, hairAt); },
    rapado: () => { const buzz = (x, y) => mix(hairA, skin, 0.45); top([]); rect(14, 10, 29, 13, buzz); row(9, 16, 27, buzz); rect(13, 12, 13, 17, buzz); rect(30, 12, 30, 17, buzz); },
    melena: () => { capTop(); rect(10, 13, 13, 31, hairAt); rect(30, 13, 33, 31, hairAt); row(14, 14, 17, hairAt); mirror([[10, 31], [12, 32]], hairS); },
    largo: () => { capTop(); rect(10, 13, 13, 36, hairAt); rect(30, 13, 33, 36, hairAt); row(14, 14, 17, hairAt); mirror([[11, 37], [12, 37]], hairAt); },
    mono: () => { top([[10, 15, 28], [11, 14, 29], [12, 13, 30], [13, 13, 30]]); rect(12, 14, 13, 19, hairAt); rect(30, 14, 31, 19, hairAt);
      for (let y = 3; y <= 9; y++) { const w = (y === 3 || y === 9) ? 3 : 4; row(y, 22 - w, 21 + w, (x, yy) => ((yy === 4 && x >= 19 && x <= 20) ? tint(hairAt(x, yy), 0.22) : (x === 22 + w - 1 || yy === 9) ? hairS(x, yy) : hairAt(x, yy))); }
      for (let y = 15; y <= 28; y++) { set(y < 21 ? 13 : 14, y, hairAt(13, y)); set(y < 21 ? 30 : 29, y, hairAt(30, y)); } },
    coletas: () => { capTop(); rect(12, 14, 13, 18, hairAt); rect(30, 14, 31, 18, hairAt); rect(11, 15, 12, 17, RED); rect(31, 15, 32, 17, RED); },
    trenzas: () => { top([[10, 15, 28], [11, 14, 29], [12, 13, 30], [13, 13, 30]]); rect(12, 14, 13, 19, hairAt); rect(30, 14, 31, 19, hairAt); row(10, 21, 22, hairS); row(11, 21, 22, hairS); },
    rizos: () => { for (let y = 6; y <= 15; y++) row(y, y < 8 ? 15 : 11, y < 8 ? 28 : 32, hairAt); rect(9, 14, 13, 28, hairAt); rect(30, 14, 34, 28, hairAt); },
    afro: () => { top([[10, 14, 29], [11, 13, 30], [12, 13, 30], [13, 13, 30]]); rect(11, 14, 13, 22, hairAt); rect(30, 14, 32, 22, hairAt); },
  }[L.hairStyle] || (() => {}))();
  if (L.bangs && L.hairStyle !== 'rapado') { rect(14, 13, 29, 15, hairAt); for (let x = 14; x <= 29; x++) if (x % 3 !== 0) set(x, 16, hairAt(x, 16)); }
  if (L.braids) for (let y = 15; y <= 30; y++) { const c = y % 2 ? hairAt(14, y) : hairS(14, y); set(14, y, c); set(29, y, c); if (y === 30) { set(14, 31, RED); set(29, 31, RED); } }

  // ===== 8. Gafas y cabeza =====
  const frame = L.glasses === 'finas' ? [92, 82, 70] : K;
  if (L.glasses === 'estrella') {
    const pink = [233, 127, 176];
    const star = ['...#...', '..###..', '#######', '.#####.', '..###..', '.##.##.', '.#...#.'];
    for (const x0 of [13, 24]) {
      star.forEach((line, dy) => [...line].forEach((ch, dx) => { if (ch === '#') set(x0 + dx, 17 + dy, pink); }));
      rect(x0 + 2, 19, x0 + 4, 21, [70, 30, 70]); set(x0 + 2, 19, WHITE);
    }
    row(20, 20, 23, pink);
  } else if (L.glasses !== 'no') {
    for (const x0 of [14, 24]) {
      if (L.glasses === 'sol') rect(x0, 19, x0 + 5, 23, [34, 34, 40]);
      row(19, x0 + (L.glasses === 'finas' ? 1 : 0), x0 + (L.glasses === 'finas' ? 4 : 5), frame); row(23, x0 + 1, x0 + 4, frame);
      rect(x0, 20, x0, 22, frame); rect(x0 + 5, 20, x0 + 5, 22, frame);
      if (L.glasses === 'sol') set(x0 + 1, 20, [120, 120, 140]);
    }
    row(20, 20, 23, frame); set(13, 20, frame); set(30, 20, frame);
  }
  const headS = mul(headC, 0.72), headL = tint(headC, 0.18);
  ({
    gorra: () => { row(6, 16, 27, headC); row(7, 14, 29, headC); rect(13, 8, 30, 11, headC); rect(15, 7, 18, 8, headL); row(12, 10, 31, headS); row(13, 11, 30, headS); },
    gorro: () => { row(4, 17, 26, headC); row(5, 15, 28, headC); rect(13, 6, 30, 10, (x) => (x % 3 === 0 ? headS : headC)); rect(13, 11, 30, 13, (x) => (x % 2 ? headS : headC)); },
    bucket: () => { row(6, 16, 27, headC); rect(14, 7, 29, 11, headC); row(8, 14, 29, headS); row(12, 11, 32, headS); row(13, 10, 33, headC); row(14, 10, 12, headC); row(14, 31, 33, headC); },
    bandana: () => { rect(13, 12, 30, 13, headC); dots([[15, 12], [19, 13], [24, 12], [28, 13]], headL); rect(31, 13, 33, 14, headC); set(32, 15, headS); set(33, 16, headS); },
    horquillas: () => { dots([[16, 13], [17, 12], [18, 13], [26, 12], [27, 13]], headC); },
    gato: () => { row(5, 15, 28, headC); rect(13, 6, 30, 10, headC); rect(13, 11, 30, 13, (x) => (x % 2 ? headS : headC)); for (const x0 of [13, 26]) { row(4, x0, x0 + 4, headC); row(3, x0 + (x0 === 13 ? 0 : 1), x0 + (x0 === 13 ? 3 : 4), headC); row(2, x0 + (x0 === 13 ? 0 : 2), x0 + (x0 === 13 ? 2 : 4), headC); set(x0 === 13 ? 14 : 29, 3, [240, 150, 170]); } dots([[18, 8], [25, 8]], DARK); row(10, 20, 23, headS); },
    corona: () => { rect(14, 7, 29, 11, GOLD); row(12, 13, 30, mul(GOLD, 0.7)); for (const x of [14, 18, 21, 25, 29]) { set(x, 6, GOLD); set(x, 5, GOLD); } set(21, 4, GOLD); set(22, 4, GOLD); rect(21, 8, 22, 10, RED); dots([[16, 9], [27, 9]], [80, 160, 255]); row(7, 15, 28, tint(GOLD, 0.35)); },
  }[L.head] || (() => {}))();

  // ===== Contorno de 1 px =====
  const out = new Uint8ClampedArray(px);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (filled(x, y)) continue;
    if (filled(x + 1, y) || filled(x - 1, y) || filled(x, y + 1) || filled(x, y - 1)) { const i = (y * W + x) * 4; out[i] = 17; out[i + 1] = 17; out[i + 2] = 17; out[i + 3] = 255; }
  }
  return out;
}

const cache = new Map();
function toURL(pixels, crop) {
  const full = document.createElement('canvas'); full.width = W; full.height = H;
  full.getContext('2d').putImageData(new ImageData(pixels, W, H), 0, 0);
  if (!crop) return full.toDataURL('image/png');
  const [x, y, w, h] = crop, part = document.createElement('canvas'); part.width = w; part.height = h;
  part.getContext('2d').drawImage(full, x, y, w, h, 0, 0, w, h);
  return part.toDataURL('image/png');
}
/** Personaje entero (data URL) con los objetos puestos y los ojos según el ánimo. */
function image(look, opts = {}) {
  const key = 'b' + JSON.stringify([look, opts.items || [], !!opts.closed]);
  if (!cache.has(key)) { if (cache.size > 300) cache.clear(); cache.set(key, toURL(paint(look, opts))); }
  return cache.get(key);
}
/** Solo la cabeza, para avatares sin foto. */
function face(look) {
  const key = 'f' + JSON.stringify(look);
  if (!cache.has(key)) cache.set(key, toURL(paint(look), [6, 1, 32, 32]));
  return cache.get(key);
}

window.Character = { BASE, STYLES, COLORS, PREMIUM, randomLook, upgrade, image, face, W, H };
})();
