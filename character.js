/* Personaje pixel art de cada jugador, por capas.
   Estilo alto (64×128): ropa ancha con pliegues, 4 tonos por pieza con sombras
   cálidas y contorno del color de lo que rodea. Se dibuja en el navegador a partir
   de su "look": cara, pelo, cabeza, ropa de arriba y de abajo, calzado, accesorios,
   los objetos que ha desbloqueado y la cara según su ánimo. */
(function () {
'use strict';

const W = 64, H = 128;

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
// Paleta cálida y algo apagada, como ropa real
const COLORS = {
  skin: ['#FBE0CB', '#F1C8A5', '#E2AE85', '#C98E62', '#A06840', '#7A4A2C', '#523018'],
  eyes: ['#3B2A1E', '#4E6B34', '#3D6FB3', '#7A5230', '#2B2B30', '#7E8C99'],
  hair: ['#1E1A1A', '#3A2418', '#7A4E2C', '#C99A5A', '#E8DCC0', '#B8432C', '#E58AB0', '#9C7CF0', '#4F8FE0', '#E6E2DA'],
  head: ['#2A2420', '#EDE6DA', '#B8432C', '#2D5BD7', '#3F6B47', '#D9822B', '#E58AB0'],
  cloth: ['#EDE6DA', '#26201E', '#8C8580', '#B8432C', '#D9822B', '#D8B84A', '#3F6B47', '#2D5BD7', '#22385E', '#8C6FE0', '#E58AB0', '#7A4E32', '#C9B79A'],
  bottom: ['#2C2522', '#3B4A6B', '#6E8BB8', '#6B5B45', '#C9BCA4', '#4A5A3A', '#8C8580', '#B8432C', '#1E1A1A'],
  legs: ['#1E1A1A', '#EDE6DA', '#B8432C', '#8C6FE0', '#E58AB0'],
  shoes: ['#EDE6DA', '#2A2420', '#B8432C', '#2D5BD7', '#D9822B', '#7A4E32'],
};
const BASE = {
  v: 2,
  skin: '#F1C8A5', eyes: '#3B2A1E', freckles: false, blush: false, beard: 'no', earrings: false,
  hair: '#1E1A1A', hair2: null, hairStyle: 'corto', bangs: false, braids: false,
  glasses: 'no', head: 'no', headColor: '#2A2420',
  top: 'sudadera', topColor: '#EDE6DA', top2: '#26201E', pattern: 'liso', stripe: '#26201E',
  bottom: 'cargo', bottomColor: '#2C2522', legs: 'piel', legsColor: '#1E1A1A',
  shoes: 'bambas', shoesColor: '#EDE6DA', bag: 'no', bagColor: '#26201E', chain: false, necklace: false,
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
const hexOf = c => '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
const mul = (c, f) => c.map(v => Math.max(0, Math.min(255, Math.round(v * f))));
const tint = (c, f) => c.map(v => Math.round(v + (255 - v) * f));
const mix = (a, b, t) => a.map((v, i) => Math.round(v * (1 - t) + b[i] * t));
const WARM = [60, 36, 40];   // las sombras tiran a cálido, no a gris
/** Cuatro tonos por pieza: luz, base y dos sombras. */
const tones = hex => { const b = Array.isArray(hex) ? hex : rgb(hex); return { hi: tint(b, 0.16), base: b, s1: mix(mul(b, 0.78), WARM, 0.12), s2: mix(mul(b, 0.58), WARM, 0.22) }; };
/** Cambia un tono de una pieza por el equivalente en otra (para estampados). */
const retone = (c, A, B) => (c === A.hi ? B.hi : c === A.s1 ? B.s1 : c === A.s2 ? B.s2 : B.base);
const INK = [42, 30, 28], WHITE = [246, 240, 230], METAL = [176, 172, 168], GOLD = [226, 176, 70], RED = [200, 66, 56], DARK = [38, 32, 30], PINK = [233, 127, 176];
const noise = (x, y) => { let h = Math.imul(x, 374761393) + Math.imul(y, 668265263); h = Math.imul(h ^ (h >>> 13), 1274126177); return (h ^ (h >>> 16)) >>> 0; };
const lerp = (a, b, t) => Math.round(a + (b - a) * t);

function paint(input, { items = [], closed = false, mood = 'idle' } = {}) {
  if (mood === 'tired') closed = true;
  const L = upgrade(input);
  const px = new Uint8ClampedArray(W * H * 4), zone = new Uint8Array(W * H); let z = 1;
  const set = (x, y, c) => { if (x < 0 || y < 0 || x >= W || y >= H || !c) return; const i = (y * W + x) * 4; px[i] = c[0]; px[i + 1] = c[1]; px[i + 2] = c[2]; px[i + 3] = 255; zone[y * W + x] = z; };
  const filled = (x, y) => x >= 0 && y >= 0 && x < W && y < H && px[(y * W + x) * 4 + 3] > 0;
  /** Rellena una forma fila a fila con volumen: claro a la izquierda, sombra a la derecha. */
  const form = (y0, y1, span, T, zz, opts = {}) => {
    z = zz;
    for (let y = y0; y <= y1; y++) {
      const [a, b] = span(y); if (b < a) continue;
      for (let x = a; x <= b; x++) {
        const t = (x - a) / Math.max(1, b - a);
        let c = t < 0.14 ? T.hi : t > 0.9 ? T.s2 : t > 0.68 ? T.s1 : T.base;
        if (opts.texture !== false && c === T.base && t > 0.5 && (x * 5 + y * 3) % 11 === 0) c = T.s1;   // transición punteada
        if (opts.color) c = opts.color(x, y, c, t) || c;
        set(x, y, c);
      }
    }
  };
  /** Elipse rellena con volumen. */
  const blob = (cx, cy, rx, ry, T, zz, opts) => form(Math.ceil(cy - ry), Math.floor(cy + ry), y => { const d = 1 - ((y - cy) / ry) ** 2; if (d < 0) return [1, 0]; const w = rx * Math.sqrt(d); return [Math.round(cx - w), Math.round(cx + w)]; }, T, zz, opts);
  const dots = (pts, c) => pts.forEach(([x, y]) => set(x, y, c));
  const hline = (y, a, b, c) => { for (let x = a; x <= b; x++) set(x, y, c); };
  const vline = (x, a, b, c) => { for (let y = a; y <= b; y++) set(x, y, c); };
  const has = k => items.includes(k);

  const skin = tones(L.skin), hairA = tones(L.hair), hairB = L.hair2 ? tones(L.hair2) : hairA;
  const top = tones(L.topColor), top2 = tones(L.top2), stripe = tones(L.stripe), mixT = tones(mix(rgb(L.topColor), rgb(L.stripe), 0.7)), stripeL = tones(tint(rgb(L.stripe), 0.4));
  const bot = tones(L.bottomColor), legC = tones(L.legsColor), bag = tones(L.bagColor), headC = tones(L.headColor);
  const shoe = L.shoes === 'doradas' ? tones(GOLD) : tones(L.shoesColor);
  const hatOn = ['gorra', 'gorro', 'bucket', 'gato', 'corona'].includes(L.head);

  // Pelo: segundo color en las puntas, mechones y brillo
  const tipsFrom = { corto: 20, revuelto: 22, rapado: 99, melena: 26, largo: 34, mono: 99, coletas: 30, trenzas: 36, rizos: 24, afro: 22 }[L.hairStyle] || 99;
  const curly = L.hairStyle === 'rizos' || L.hairStyle === 'afro';
  const strands = (x, y, c) => {
    const T = y >= tipsFrom ? hairB : hairA;
    let k = retone(c, hairA, T);
    if (curly) { const n = noise(x, y) % 7; if (n === 0) k = T.s1; else if (n === 1) k = T.hi; }
    else if ((x * 7 + y * 3) % 5 === 0) k = T.s1; else if ((x * 3 + y) % 7 === 0) k = T.hi;
    return k;
  };
  const hair = (y0, y1, span, zz) => form(y0, y1, span, hairA, zz, { color: strands, texture: false });

  // Estampado de la prenda de arriba
  const pattern = (x, y, c, T = top) => {
    if (L.pattern === 'rayas') return y % 6 < 3 ? retone(c, T, stripe) : null;
    if (L.pattern === 'cuadros') return (x % 6 === 0 || y % 6 === 0) ? retone(c, T, mixT) : null;
    if (L.pattern === 'franja') return (y >= 48 && y <= 53) ? retone(c, T, stripe) : null;
    if (L.pattern === 'llamas') { const crest = 54 - [0, 4, 1, 7, 2, 0, 5, 9, 1, 3][x % 10]; if (y >= crest + 6) return retone(c, T, stripeL); if (y >= crest) return retone(c, T, stripe); }
    return null;
  };

  // ===== 1. Detrás del cuerpo: capa, pelo largo, coletas, moño, capucha =====
  if (L.bag === 'capa') {
    form(34, 104, y => { const t = (y - 34) / 70; return [lerp(18, 6, t), lerp(45, 57, t)]; }, bag, 1, { color: (x, y, c) => ((x + Math.round(y / 9)) % 7 === 0 ? bag.s1 : null) });
    hline(104, 6, 57, bag.s2);
  }
  const hairBack = {
    melena: () => hair(14, 36, y => [22, 41], 2),
    largo: () => hair(16, 54, y => [24 - (y > 30 ? 2 : 0), 39 + (y > 30 ? 2 : 0) - (y > 52 ? 1 : 0)], 2),
    rizos: () => hair(12, 36, y => [20 - (y % 4 === 0 ? 1 : 0), 43 + (y % 4 === 2 ? 1 : 0)], 2),
    afro: () => blob(31.5, 16, 17, 14.5, hairA, 2, { color: strands, texture: false }),
    coletas: () => { blob(17, 30, 4.5, 12, hairA, 2, { color: strands, texture: false }); blob(46, 30, 4.5, 12, hairA, 2, { color: strands, texture: false }); },
    mono: () => { if (!hatOn) blob(31.5, 6, 5.5, 4.5, hairA, 2, { color: strands, texture: false }); },
  };
  (hairBack[L.hairStyle] || (() => {}))();

  // ===== 2. Skate (detrás de la mano derecha) =====
  if (has('skate')) form(58, 118, y => [53, 58], tones('#2B2420'), 3, { color: (x, y, c) => ((y > 80 && y < 96 && x > 54 && x < 57) ? RED : (y === 66 || y === 110) ? [232, 214, 170] : null) });

  // ===== 3. Piernas y parte de abajo =====
  const legAt = (x, y, c, T) => {
    if (L.legs === 'medias') return retone(c, skin, legC);
    if (L.legs === 'rejilla') return (x + y) % 2 === 0 ? retone(c, skin, legC) : null;
    if (L.legs === 'rayas') return y % 4 < 2 ? retone(c, skin, legC) : retone(c, skin, tones(WHITE));
    return null;
  };
  const bareFrom = { falda: 84, corto: 86 }[L.bottom];
  if (bareFrom) { form(bareFrom, 114, y => [24, 30], skin, 4, { color: legAt }); form(bareFrom, 114, y => [33, 39], skin, 5, { color: legAt }); }
  const belt = () => { z = 8; hline(66, 20, 43, INK); hline(67, 20, 43, INK); hline(66, 30, 33, METAL); hline(67, 30, 33, METAL); };
  const wide = (flare, folds) => {
    const legL = y => { const t = Math.min(1, (y - 66) / 30); return [lerp(20, 20 - flare, t) + (folds && y > 104 ? (y % 4 < 2 ? -1 : 0) : 0), y < 80 ? 31 : 30]; };
    const legR = y => { const t = Math.min(1, (y - 66) / 30); return [y < 80 ? 32 : 33, lerp(43, 43 + flare, t) + (folds && y > 104 ? (y % 4 < 2 ? 1 : 0) : 0)]; };
    form(66, 116, legL, bot, 6); form(66, 116, legR, bot, 7);
    for (const [span, zz, dir] of [[legL, 6, -1], [legR, 7, 1]]) {
      z = zz;
      (folds ? [101, 105, 109, 113] : [107, 112]).forEach((y0, k) => {
        const [a, b] = span(y0), off = k % 2 ? 2 : -1;
        for (let x = a + 1; x < b; x++) { const t = (x - a) / (b - a), y = y0 + Math.round(2 * Math.sin(Math.PI * Math.min(1, Math.max(0, t + off * 0.08)))); set(x, y, bot.s2); if (y - 1 > y0 - 3) set(x, y - 1, bot.hi); }
      });
      for (let y = 72; y <= 98; y++) { const [a, b] = span(y), x = dir < 0 ? a + 5 + Math.round((y - 72) / 6) : b - 5 - Math.round((y - 72) / 6); set(x, y, bot.s1); if (y > 80) { const x2 = dir < 0 ? b - 3 - Math.round((y - 80) / 5) : a + 3 + Math.round((y - 80) / 5); set(x2, y, bot.s1); } }
    }
    return [legL, legR];
  };
  let feet;   // dónde van los pies y si quedan por debajo de la tela
  ({
    cargo: () => {
      wide(7, true);
      for (const [x0, zz] of [[13, 6], [43, 7]]) {   // bolsillos con solapa
        z = zz;
        for (let y = 84; y <= 97; y++) hline(y, x0 + 1, x0 + 7, y <= 85 ? bot.s2 : (y === 86 ? bot.hi : bot.s1));
        vline(x0 + 1, 84, 97, bot.s2); vline(x0 + 7, 84, 97, bot.s2); set(x0 + 4, 86, METAL);
      }
      belt(); feet = { l: [14, 28], r: [35, 49], under: true };
    },
    vaqueros: () => {
      wide(5, false);
      z = 6; for (let i = 0; i < 5; i++) set(23 + i, 69 + Math.round(i * 0.8), bot.s2);   // bolsillos delanteros
      z = 7; for (let i = 0; i < 5; i++) set(40 - i, 69 + Math.round(i * 0.8), bot.s2);
      z = 6; for (let y = 70; y <= 114; y += 2) set(16 + Math.round((y - 70) / 14), y, bot.hi);   // costura clara
      z = 7; for (let y = 70; y <= 114; y += 2) set(47 - Math.round((y - 70) / 14), y, bot.hi);
      belt(); feet = { l: [16, 28], r: [35, 47], under: true };
    },
    chandal: () => {
      const legL = y => [y < 100 ? lerp(19, 18, (y - 66) / 34) : 19, y < 80 ? 31 : 30], legR = y => [y < 80 ? 32 : 33, y < 100 ? lerp(44, 45, (y - 66) / 34) : 44];
      const side = (x, y, c, t) => (t < 0.12 ? stripe.base : null);
      form(66, 112, legL, bot, 6, { color: (x, y, c, t) => (t < 0.12 ? stripe.base : null) });
      form(66, 112, legR, bot, 7, { color: (x, y, c, t) => (t > 0.88 ? stripe.s1 : null) });
      for (const [a, b, zz] of [[19, 30, 6], [33, 44, 7]]) { form(110, 114, y => [a + 1, b - 1], bot, zz, { color: (x, y, c) => (x % 2 ? bot.s1 : c) }); }   // puño elástico
      z = 6; dots([[24, 78], [25, 79], [23, 92], [24, 93], [25, 104]], bot.s1); z = 7; dots([[39, 80], [38, 81], [40, 94], [39, 95], [38, 105]], bot.s1);
      z = 8; hline(66, 19, 44, bot.s2); hline(67, 19, 44, bot.s1); dots([[29, 68], [29, 69], [34, 68], [34, 69]], WHITE);   // cintura con cordón
      void side; feet = { l: [20, 29], r: [34, 43], under: true };
    },
    corto: () => {
      form(66, 88, y => { const t = (y - 66) / 22; return [lerp(20, 17, t), y > 80 ? 30 : 31]; }, bot, 6);
      form(66, 88, y => { const t = (y - 66) / 22; return [y > 80 ? 33 : 32, lerp(43, 46, t)]; }, bot, 7);
      z = 6; hline(88, 17, 30, bot.s2); z = 7; hline(88, 33, 46, bot.s2);
      belt(); feet = { l: [24, 30], r: [33, 39], under: false };
    },
    falda: () => {
      form(66, 86, y => { const t = (y - 66) / 20; return [lerp(22, 17, t), lerp(41, 46, t)]; }, bot, 6, {
        color: (x, y, c) => (y > 72 && (x - 17) % 5 === 0 ? bot.s1 : y > 72 && (x - 17) % 5 === 1 ? bot.hi : null) });
      z = 6; hline(86, 17, 46, bot.s2); hline(66, 22, 41, bot.s1);
      feet = { l: [24, 30], r: [33, 39], under: false };
    },
  }[L.bottom] || (() => { feet = { l: [24, 30], r: [33, 39], under: false }; }))();
  if (L.chain && !['falda'].includes(L.bottom)) { z = 9; for (let i = 0; i <= 12; i++) set(40 + Math.round(Math.sin(i / 12 * Math.PI) * 4), 68 + i, i % 2 ? METAL : [120, 116, 112]); }

  // ===== 4. Calzado: sale de debajo de cada pierna, con su mismo ancho =====
  const boots = L.shoes === 'botas', high = L.shoes === 'altas', plat = L.shoes === 'plataformas';
  const lift = plat ? 2 : 0;
  const foot = ([a, b], left, zz) => {
    const y0 = (feet.under ? 113 : 114) - lift, yEnd = 121 - lift;
    if ((boots || high) && !feet.under) form(boots ? 101 : 106, y0 + 2, y => [a, b], shoe, zz, { color: (x, y, c) => (boots ? (y === 101 ? shoe.s2 : y === 104 && (x + 1) % 3 === 0 ? METAL : null) : (y === 106 ? shoe.s2 : (x === (left ? a + 2 : b - 2) && y > 107 && y < 112 ? WHITE : null))) });
    form(y0, yEnd, y => {
      const r = y - y0, inset = r === 0 ? 2 : r === 1 ? 1 : 0, out = r >= 4 ? 1 : 0;
      const lo = left ? a - 1 - out : a, hi = left ? b : b + 1 + out;   // el lado de dentro no crece, así los pies no se juntan
      return [lo + inset, hi - inset];
    }, shoe, zz, {
      color: (x, y, c) => {
        if (boots) return y === y0 + 3 ? shoe.s1 : null;
        if (L.shoes === 'doradas' && (x + y) % 9 === 0) return tint(GOLD, 0.6);
        if (y >= y0 + 1 && y <= y0 + 3 && x > a + 1 && x < b - 1 && (x + y) % 3 === 0) return shoe.s2;   // cordones
        if (y === yEnd - 3 && x > a && x < b) return shoe.s1;
        return null;
      } });
    z = zz;
    const s0 = left ? a - 2 : a, s1 = left ? b : b + 2;
    const light = shoe.base[0] + shoe.base[1] + shoe.base[2] > 560;
    const sole = boots ? INK : L.shoes === 'doradas' ? mul(GOLD, 0.7) : light ? [190, 182, 168] : [214, 206, 192];
    for (let y = 122 - lift; y <= 123; y++) hline(y, s0, s1, y === 123 ? mul(sole, 0.82) : sole);
  };
  foot(feet.l, true, feet.under ? 4 : 10); foot(feet.r, false, feet.under ? 5 : 11);
  if (feet.under) { z = 9; hline(feet.l[0] < 18 ? 116 : 114, feet.l[0] - 1, feet.l[1] + 1, mul(bot.s2, 0.8)); hline(feet.l[0] < 18 ? 116 : 114, feet.r[0] - 1, feet.r[1] + 1, mul(bot.s2, 0.8)); }

  // ===== 5. Torso, mangas y manos =====
  const T = L.top, longSleeve = T !== 'camiseta';
  const torso = y => { const sh = [[24, 39], [21, 42], [19, 44], [18, 45]]; if (y - 35 < sh.length) return sh[y - 35]; if (y < 50) return [18, 45]; return [17, 46]; };
  const sleeve = side => y => { const t = (y - 37) / 31, puff = y > 58 && y < 65 ? 1 : 0; return side < 0 ? [lerp(15, 11, t) - puff, lerp(20, 18, t)] : [lerp(43, 45, t), lerp(48, 52, t) + puff]; };
  const sleeveT = T === 'capas' ? top2 : top;
  const sleeveCol = (x, y, c) => {
    if (T === 'capas' && y < 46) return pattern(x, y, retone(c, top2, top)) || retone(c, top2, top);   // manga corta de encima
    if ([44, 52, 59].some(f => y === f + Math.round(Math.sin(x * 0.9)))) return sleeveT.s2;            // arrugas del brazo
    if ([44, 52, 59].some(f => y === f - 1 + Math.round(Math.sin(x * 0.9)))) return sleeveT.hi;
    if ((T === 'sudadera' || T === 'jersey') && y >= 64) return x % 2 ? sleeveT.s1 : c;                // puño
    return T === 'capas' ? null : pattern(x, y, c);
  };
  if (longSleeve) { form(37, 67, sleeve(-1), sleeveT, 12, { color: sleeveCol }); form(37, 67, sleeve(1), sleeveT, 13, { color: sleeveCol }); }
  else { form(37, 47, sleeve(-1), top, 12, { color: (x, y, c) => pattern(x, y, c) || (y === 47 ? top.s1 : null) }); form(37, 47, sleeve(1), top, 13, { color: (x, y, c) => pattern(x, y, c) || (y === 47 ? top.s1 : null) }); form(48, 67, y => [12, 17], skin, 12); form(48, 67, y => [46, 51], skin, 13); }
  // cuerpo
  const open = T === 'camisa' ? [27, 36] : T === 'chaqueta' ? [29, 34] : null;
  form(35, 64, torso, top, 14, { color: (x, y, c) => {
    if (open && y >= 37 && x >= open[0] + Math.max(0, 40 - y) && x <= open[1] - Math.max(0, 40 - y)) return retone(c, top, top2);   // prenda de debajo
    const p = pattern(x, y, c); if (p) return p;
    if (y > 39 && y < 50 && (x === 19 + Math.round((y - 39) * 0.6) || x === 44 - Math.round((y - 39) * 0.6))) return top.s1;   // pliegues desde la axila
    if (y > 54 && y < 62 && x === 31 + Math.round((y - 54) * 0.5)) return top.s1;
    return null; } });
  // bajo de la prenda
  if (T === 'capas') form(63, 68, y => [17, 46], top2, 14);
  else if (T === 'sudadera' || T === 'jersey') form(62, 66, y => [19 + Math.max(0, y - 63), 44 - Math.max(0, y - 63)], top, 14, { color: (x, y, c) => (x % 2 ? top.s1 : (pattern(x, y, c) || c)) });
  else form(62, 67, y => [17, 46], top, 14, { color: (x, y, c) => (open && x >= open[0] && x <= open[1] ? retone(c, top, top2) : (pattern(x, y, c) || (y === 67 ? top.s1 : null))) });
  z = 14;
  ({
    sudadera: () => {   // bolsillo canguro y cordones
      for (let y = 51; y <= 61; y++) { set(23 + Math.max(0, 54 - y), y, top.s2); set(40 - Math.max(0, 54 - y), y, top.s2); }
      hline(51, 26, 37, top.s2); hline(61, 23, 40, top.s1);
      vline(28, 37, 45, top.s1); vline(35, 37, 45, top.s1); set(28, 46, METAL); set(35, 46, METAL);
    },
    camisa: () => {   // solapas y botón
      for (let i = 0; i < 6; i++) { set(26 + Math.floor(i / 2), 35 + i, top.hi); set(37 - Math.floor(i / 2), 35 + i, top.s1); }
      vline(26, 41, 67, top.s2); vline(37, 41, 67, top.s2);
    },
    chaqueta: () => {   // cremalleras abiertas y bolsillos
      vline(28, 38, 67, METAL); vline(35, 38, 67, METAL);
      hline(56, 20, 25, top.s2); hline(56, 38, 43, top.s2);
    },
  }[T] || (() => {}))();
  // cuello y escote
  form(31, 36, y => [28, 35], skin, 15);
  if (T === 'sudadera') {   // capucha caída con su hueco
    form(31, 40, y => [20 + Math.max(0, y - 35), 43 - Math.max(0, y - 35)], top, 16);
    form(33, 39, y => [26 + Math.max(0, y - 36), 37 - Math.max(0, y - 36)], { hi: top.s2, base: top.s2, s1: mul(top.s2, 0.85), s2: mul(top.s2, 0.75) }, 16);
    z = 16; hline(31, 22, 41, top.hi); hline(40, 25, 38, top.s1);
  } else if (T === 'jersey') {
    form(34, 36, y => [26, 37], top, 16, { color: (x, y, c) => (x % 2 ? top.s1 : c) });
  } else if (T === 'chaqueta') {
    form(31, 37, y => [y < 34 ? 25 : 24, y < 34 ? 38 : 39], top, 16, { color: (x, y, c) => (x >= 29 && x <= 34 && y > 32 ? retone(c, top, top2) : null) });
  } else {
    z = 16; hline(36, 27, 36, (T === 'capas' ? top : top).s1); if (T === 'camiseta' || T === 'capas') { set(27, 35, top.s1); set(36, 35, top.s1); }
  }
  if (L.necklace) { z = 17; dots([[28, 37], [29, 38], [30, 38], [31, 39], [32, 39], [33, 38], [34, 38], [35, 37]], GOLD); set(31, 40, GOLD); set(32, 40, GOLD); }
  // manos
  form(68, 75, y => [11 + (y > 73 ? 1 : 0), 16 - (y > 74 ? 1 : 0)], skin, 18); form(68, 75, y => [47 + (y > 74 ? 1 : 0), 52 - (y > 73 ? 1 : 0)], skin, 19);
  z = 18; set(17, 70, skin.s1); set(17, 71, skin.s1); z = 19; set(46, 70, skin.hi); set(46, 71, skin.hi);

  // ===== 6. Accesorios del cuerpo =====
  ({
    bolso: () => { z = 20; for (let i = 0; i <= 34; i++) set(44 - Math.round(i * 0.62), 36 + i, INK); form(66, 76, y => [16, 27], bag, 21); z = 21; hline(66, 16, 27, bag.s2); hline(67, 16, 27, bag.s2); set(21, 69, METAL); },
    mochila: () => { z = 20; for (const x of [22, 23, 40, 41]) vline(x, 37, 58, DARK); dots([[22, 48], [23, 48], [40, 48], [41, 48]], METAL); form(32, 36, y => [19, 22], bag, 1); form(32, 36, y => [41, 44], bag, 1); },
    rinonera: () => { z = 20; for (let i = 0; i <= 26; i++) set(44 - i, 38 + Math.round(i * 0.75), DARK); form(54, 62, y => [y === 54 || y === 62 ? 26 : 25, y === 54 || y === 62 ? 37 : 38], bag, 21); z = 21; hline(57, 26, 37, bag.s2); set(36, 57, METAL); },
    capa: () => { z = 20; set(25, 37, GOLD); set(26, 37, GOLD); set(37, 37, GOLD); set(38, 37, GOLD); },
  }[L.bag] || (() => {}))();
  if (has('llavero')) { z = 22; for (let y = 68; y <= 74; y++) set(41, y, y % 2 ? METAL : [120, 116, 112]); form(75, 80, y => [39, 43], tones(GOLD), 22); set(40, 77, mul(GOLD, 0.6)); set(42, 77, mul(GOLD, 0.6)); }
  if (has('handycam')) { form(64, 72, y => [4, 13], tones(DARK), 23); z = 23; hline(66, 5, 9, [110, 106, 104]); set(5, 70, RED); form(61, 63, y => [9, 13], tones(DARK), 23); dots([[3, 67], [3, 68]], METAL); form(68, 75, y => [11, 16], skin, 24); }

  // ===== 7. Cabeza =====
  const faceSpan = y => y === 14 ? [27, 36] : y === 15 ? [26, 37] : y <= 26 ? [25, 38] : y === 27 ? [26, 37] : y === 28 ? [27, 36] : y === 29 ? [28, 35] : [30, 33];
  const brimShade = L.head === 'gorra' || L.head === 'bucket';
  form(14, 30, faceSpan, skin, 25, { color: (x, y, c) => (brimShade && y <= 19 ? skin.s1 : null) });
  form(19, 24, y => [24, 24], skin, 25); form(19, 24, y => [39, 39], skin, 25); z = 25; set(24, 21, skin.s1); set(39, 21, skin.s2);
  if (has('auriculares')) { form(31, 37, y => [21, 25], tones('#2A2626'), 26); form(31, 37, y => [38, 42], tones('#2A2626'), 26); z = 26; hline(38, 25, 38, INK); set(23, 34, RED); set(40, 34, RED); }
  z = 25;
  const eye = rgb(L.eyes), lid = mix(hairA.s2, INK, 0.5), brow = hairA.s2, lip = mix(skin.s2, [150, 60, 60], 0.3);
  for (const ex of [28, 34]) {
    if (closed) { hline(22, ex - 1, ex + 1, lid); set(ex - 2, 21, lid); set(ex + 2, 21, lid); }
    else { hline(21, ex - 1, ex + 1, INK); set(ex, 22, eye); set(ex + 1, 22, mul(eye, 0.6)); set(ex - 1, 22, tint(skin.base, 0.7)); set(ex, 23, mul(eye, 0.7)); set(ex - 1, 21, INK); set(ex + 2, 21, (ex === 34) ? INK : null); set(ex - 2, 21, ex === 28 ? INK : null); }
  }
  hline(19, 27, 29, brow); hline(19, 33, 35, brow);
  if (mood === 'tired') { set(26, 18, brow); set(37, 18, brow); }
  if (mood === 'fire') { set(26, 20, brow); set(37, 20, brow); }
  set(31, 25, skin.s1); set(32, 25, skin.s1); set(31, 24, skin.hi);
  if (L.blush) dots([[26, 25], [27, 25], [36, 25], [37, 25]], mix(skin.base, [230, 110, 110], 0.4));
  if (L.freckles) dots([[27, 24], [29, 25], [28, 26], [35, 25], [36, 24], [34, 26]], skin.s2);
  if (L.beard === 'barba') form(23, 30, y => faceSpan(y), hairA, 25, { color: (x, y, c) => { const [a, b] = faceSpan(y); if (y < 28 && x > a + 1 && x < b - 1 && !(y === 26)) return skin.base; if (y === 27 && x >= 29 && x <= 34) return skin.s1; return strands(x, y, c); }, texture: false });
  z = 25;
  if (L.beard === 'bigote' || L.beard === 'barba') hline(26, 29, 34, hairA.s1);
  // boca según el ánimo
  if (mood === 'fire') { hline(27, 29, 34, mul(lip, 0.5)); hline(27, 30, 33, WHITE); hline(28, 30, 33, mix(lip, [220, 90, 100], 0.4)); }
  else if (mood === 'happy' || mood === 'proud') { hline(28, 30, 33, lip); set(29, 27, lip); set(34, 27, lip); }
  else if (mood === 'tired') hline(28, 31, 32, lip);
  else hline(27, 30, 33, lip);
  if (L.earrings) { set(24, 25, GOLD); set(39, 25, GOLD); set(24, 26, GOLD); set(39, 26, GOLD); }

  // ===== 8. Pelo de delante =====
  const crown = (y0 = 9) => hair(y0, 15, y => (y === y0 ? [27, 36] : y === y0 + 1 ? [25, 38] : [24, 39]), 27);
  ({
    corto: () => { if (!hatOn) crown(10); hair(15, 21, y => [23, 25], 27); hair(15, 21, y => [38, 40], 27); z = 27; hline(15, 26, 30, hairA.base); set(26, 16, hairA.base); },
    revuelto: () => {
      if (!hatOn) { crown(9); z = 27; dots([[26, 8], [29, 7], [30, 8], [33, 8], [36, 7], [37, 8]], hairA.base); }
      hair(15, 27, y => [22 + (y % 3 === 0 ? 1 : 0), 25], 27); hair(15, 27, y => [38, 41 - (y % 3 === 0 ? 1 : 0)], 27);
      z = 27; dots([[26, 16], [27, 17], [29, 16], [30, 17], [33, 16], [35, 17], [36, 16], [28, 18], [34, 18]], hairA.base);
      dots([[21, 20], [21, 24], [42, 22], [42, 26], [23, 28], [40, 28]], hairA.s1);
    },
    rapado: () => { const buzz = tones(mix(hairA.base, skin.base, 0.45)); if (!hatOn) form(11, 15, y => (y === 11 ? [27, 36] : [25, 38]), buzz, 27); form(15, 19, y => [24, 25], buzz, 27); form(15, 19, y => [38, 39], buzz, 27); },
    melena: () => { if (!hatOn) crown(10); hair(15, 34, y => [22, 25], 27); hair(15, 34, y => [38, 41], 27); z = 27; hline(15, 26, 31, hairA.base); },
    largo: () => { if (!hatOn) crown(10); hair(16, 42, y => [22, 25], 27); hair(16, 42, y => [38, 41], 27); },
    mono: () => {
      if (!hatOn) crown(10);
      hair(15, 20, y => [24, 25], 27); hair(15, 20, y => [38, 39], 27);
      z = 27; for (let y = 16; y <= 32; y++) { set(y < 24 ? 25 : 26, y, hairA.base); set(y < 24 ? 38 : 37, y, hairA.base); }   // mechones sueltos
    },
    coletas: () => { if (!hatOn) crown(10); hair(15, 21, y => [23, 25], 27); hair(15, 21, y => [38, 40], 27); z = 27; for (const x of [19, 20, 43, 44]) { set(x, 19, RED); set(x, 20, RED); } },
    trenzas: () => {
      if (!hatOn) crown(10); hair(15, 20, y => [24, 25], 27); hair(15, 20, y => [38, 39], 27);
      z = 27; if (!hatOn) { set(31, 10, hairA.s2); set(31, 11, hairA.s2); set(32, 12, hairA.s2); }
      for (const x0 of [21, 40]) { form(20, 50, y => [x0, x0 + 2], hairA, 28, { color: (x, y, c) => (y >= tipsFrom ? retone(c, hairA, hairB) : (y % 3 === 0 ? hairA.s2 : (y % 3 === 1 ? hairA.hi : null))) }); z = 28; hline(51, x0, x0 + 2, RED); hline(52, x0, x0 + 2, hairB.base); set(x0 + 1, 53, hairB.base); }
    },
    rizos: () => { if (!hatOn) hair(7, 16, y => [y < 9 ? 25 : 22, y < 9 ? 38 : 41], 27); hair(15, 30, y => [20, 25 - (y > 26 ? 1 : 0)], 27); hair(15, 30, y => [38 + (y > 26 ? 1 : 0), 43], 27); },
    afro: () => { if (!hatOn) crown(9); hair(15, 24, y => [21, 25], 27); hair(15, 24, y => [38, 42], 27); },
  }[L.hairStyle] || (() => {}))();
  if (L.bangs && L.hairStyle !== 'rapado') { hair(14, 17, y => [25, 38], 27); z = 27; for (let x = 25; x <= 38; x++) if (x % 3 !== 0) set(x, 18, hairA.s1); }
  if (L.braids && L.hairStyle !== 'trenzas') { z = 28; for (let y = 16; y <= 32; y++) { set(25, y, y % 2 ? hairA.s1 : hairA.hi); set(38, y, y % 2 ? hairA.s1 : hairA.hi); } set(25, 33, RED); set(38, 33, RED); }

  // ===== 9. Gafas =====
  z = 29;
  if (L.glasses === 'estrella') {
    const star = ['...#...', '..###..', '#######', '.#####.', '..###..', '.##.##.', '.#...#.'];
    for (const cx of [28, 35]) {
      star.forEach((line, dy) => [...line].forEach((ch, dx) => { if (ch === '#') set(cx - 3 + dx, 18 + dy, PINK); }));
      hline(21, cx - 1, cx + 1, [80, 30, 70]); set(cx, 22, [80, 30, 70]); set(cx - 1, 21, WHITE);
    }
  } else if (L.glasses !== 'no') {
    const frame = L.glasses === 'finas' ? [120, 96, 72] : INK;
    for (const ex of [28, 34]) {
      if (L.glasses === 'sol') { for (let y = 21; y <= 23; y++) hline(y, ex - 1, ex + 1, [40, 36, 44]); set(ex - 1, 21, [110, 110, 130]); }
      hline(20, ex - 2, ex + 2, frame); hline(24, ex - 2, ex + 2, frame); vline(ex - 2, 20, 24, frame); vline(ex + 2, 20, 24, frame);
      if (L.glasses === 'pasta') hline(20, ex - 2, ex + 2, mix(frame, top.base, 0));
    }
    hline(21, 31, 32, frame); set(25, 21, frame); set(38, 21, frame);
    if (L.glasses === 'pasta') { hline(19, 26, 30, INK); hline(19, 32, 36, INK); }
  }

  // ===== 10. Cabeza: gorra, gorro… =====
  const hc = headC;
  ({
    gorra: () => {   // copa redondeada con costura y visera
      form(5, 15, y => (y === 5 ? [28, 35] : y === 6 ? [26, 37] : y === 7 ? [25, 38] : [24, 39]), hc, 30, { color: (x, y) => ((x === 31 && y < 15) ? hc.s1 : null) });
      z = 30; hline(14, 24, 39, hc.s1); set(31, 5, hc.s2);
      form(15, 17, y => (y === 15 ? [22, 41] : y === 16 ? [21, 40] : [23, 37]), hc, 31, { color: (x, y) => (y === 15 ? hc.hi : y === 17 ? hc.s2 : hc.base) });
    },
    gorro: () => {
      form(5, 16, y => [y < 7 ? 27 : 24, y < 7 ? 36 : 39], hc, 30, { color: x => (x % 3 === 0 ? hc.s1 : null) });
      form(14, 17, y => [23, 40], hc, 31, { color: (x, y, c) => (x % 2 ? hc.s1 : c) });
    },
    bucket: () => {
      form(6, 14, y => (y === 6 ? [27, 36] : [25, 38]), hc, 30, { color: (x, y) => (y === 12 ? hc.s2 : null) });
      form(14, 17, y => [y === 14 ? 22 : 20, y === 14 ? 41 : 43], hc, 31, { color: (x, y) => (y === 17 ? hc.s2 : null) });
    },
    bandana: () => { form(13, 16, y => [24, 39], hc, 30, { color: (x, y) => ((x + y * 2) % 5 === 0 ? hc.hi : null) }); form(14, 20, y => [40, 41 + Math.floor((y - 14) / 3)], hc, 30); },
    horquillas: () => { z = 30; for (const [x, y] of [[26, 15], [28, 14], [35, 14], [37, 15]]) { set(x, y, hc.base); set(x + 1, y, hc.hi); } },
    gato: () => {
      form(5, 16, y => [y < 7 ? 27 : 24, y < 7 ? 36 : 39], hc, 30);
      form(14, 17, y => [23, 40], hc, 31, { color: (x, y, c) => (x % 2 ? hc.s1 : c) });
      for (const [x0, dir] of [[24, 1], [39, -1]]) for (let r = 0; r < 5; r++) for (let k = 0; k <= 4 - r; k++) { z = 30; set(x0 + dir * k, 5 - r, r > 0 && k > 0 && k < 4 - r ? [240, 150, 170] : hc.base); }
      z = 30; dots([[28, 10], [35, 10]], DARK); hline(12, 30, 33, hc.s1);
    },
    corona: () => {
      const g = tones(GOLD);
      form(7, 13, y => [25, 38], g, 30, { color: (x, y) => (y === 13 ? g.s2 : null) });
      z = 30; for (const x of [25, 28, 31, 32, 35, 38]) { set(x, 6, GOLD); set(x, 5, GOLD); } set(31, 4, tint(GOLD, 0.4)); set(32, 4, GOLD);
      hline(10, 31, 32, RED); hline(11, 31, 32, mul(RED, 0.7)); set(27, 10, [80, 160, 255]); set(36, 10, [80, 160, 255]);
    },
  }[L.head] || (() => {}))();

  // ===== Volumen extra por zonas + contorno cálido =====
  const lit = new Uint8ClampedArray(px);
  const zoneAt = (x, y) => (filled(x, y) ? zone[y * W + x] : -1);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const zz = zoneAt(x, y); if (zz <= 0) continue;
    const i = (y * W + x) * 4; let f = 1;
    if (zoneAt(x, y + 1) !== zz && filled(x, y + 1)) f *= 0.84;      // sombra de una pieza sobre otra
    if (zoneAt(x, y - 1) !== zz && !filled(x, y - 1)) f *= 1.06;
    if (f === 1) continue;
    const c = f < 1 ? mul([px[i], px[i + 1], px[i + 2]], f) : tint([px[i], px[i + 1], px[i + 2]], 0.06);
    lit[i] = c[0]; lit[i + 1] = c[1]; lit[i + 2] = c[2];
  }
  const out = new Uint8ClampedArray(lit);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (filled(x, y)) continue;
    const n = [[0, 1], [0, -1], [1, 0], [-1, 0]].find(([dx, dy]) => filled(x + dx, y + dy));
    if (!n) continue;
    const j = ((y + n[1]) * W + x + n[0]) * 4, c = mix(mul([lit[j], lit[j + 1], lit[j + 2]], 0.35), INK, 0.55), i = (y * W + x) * 4;
    out[i] = c[0]; out[i + 1] = c[1]; out[i + 2] = c[2]; out[i + 3] = 255;
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
/** Personaje entero (data URL) con los objetos puestos y la cara según el ánimo. */
function image(look, opts = {}) {
  const key = 'b' + JSON.stringify([look, opts.items || [], !!opts.closed, opts.mood || 'idle']);
  if (!cache.has(key)) { if (cache.size > 300) cache.clear(); cache.set(key, toURL(paint(look, opts))); }
  return cache.get(key);
}
/** Solo la cabeza, para avatares sin foto. */
function face(look) {
  const key = 'f' + JSON.stringify(look);
  if (!cache.has(key)) cache.set(key, toURL(paint(look), [17, 3, 30, 30]));
  return cache.get(key);
}

window.Character = { BASE, STYLES, COLORS, PREMIUM, randomLook, upgrade, image, face, W, H, hexOf };
})();
