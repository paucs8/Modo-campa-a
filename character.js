/* Personaje pixel art de cada jugador.
   Se dibuja en el navegador a partir de su "look" (colores, peinado, gorra…),
   con los objetos que lleva puestos y los ojos cerrados si está cansado.
   Dibujo de 36×68 px con colores a elegir. */
(function () {
'use strict';

const W = 36, H = 68;

// Valores por defecto de cualquier personaje
const BASE = { skin: '#E8BF9C', hair: '#16161B', hairStyle: 'revuelto', cap: false, capColor: '#1C1C20', top: '#E2E2E4', pants: '#242428', shoes: '#F0F0F0', straps: false };
const OPTIONS = {
  skin: ['#F5D6BA', '#E8BF9C', '#D6A57C', '#B07A52', '#8A5A3A', '#5C3A24'],
  hair: ['#16161B', '#4A3020', '#8B5A2B', '#C9A15A', '#E6DDCB', '#B03A2E', '#6C5CE7'],
  hairStyle: ['revuelto', 'largo', 'corto'],
  capColor: ['#1C1C20', '#F2F2F2', '#C0392B', '#2D5BD7', '#3E7C3A', '#E0A526'],
  top: ['#E2E2E4', '#1F1F24', '#C0392B', '#2D5BD7', '#3E7C3A', '#E0A526', '#E87BB8', '#8C6FE0'],
  pants: ['#242428', '#3B4A6B', '#6B5B45', '#D9D2C3', '#4A5A3A', '#9A9AA0'],
  shoes: ['#F0F0F0', '#1C1C20', '#C0392B', '#2D5BD7', '#E0A526'],
};
const pick = list => list[Math.floor(Math.random() * list.length)];
function randomLook() {
  return { skin: pick(OPTIONS.skin), hair: pick(OPTIONS.hair), hairStyle: pick(OPTIONS.hairStyle), cap: Math.random() < 0.5,
    capColor: pick(OPTIONS.capColor), top: pick(OPTIONS.top), pants: pick(OPTIONS.pants), shoes: pick(OPTIONS.shoes), straps: Math.random() < 0.5 };
}

// Colores
const hexToRgb = hex => { const n = parseInt(String(hex).replace('#', '').padEnd(6, '0').slice(0, 6), 16) || 0; return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const shade = (hex, f) => hexToRgb(hex).map(v => Math.max(0, Math.min(255, Math.round(v * f))));
const lighten = (hex, f) => hexToRgb(hex).map(v => Math.round(v + (255 - v) * f));
const FIXED = { K: [17, 17, 17], W: [244, 244, 244], B: [14, 14, 16], M: [181, 181, 186], Bd: [24, 24, 27], Tr: [196, 196, 200], Wh: [239, 227, 200],
  R: [229, 72, 60], Rd: [170, 40, 34], Y: [255, 197, 61], Yd: [201, 138, 0], Yl: [255, 230, 150], G: [140, 140, 146], Gd: [70, 70, 76], Eye: [44, 44, 54], Kl: [184, 184, 188], Kd: [132, 132, 138] };
function palette(look) {
  return Object.assign({}, FIXED, {
    S: hexToRgb(look.skin), Ss: shade(look.skin, 0.85),
    H: hexToRgb(look.hair), Hh: lighten(look.hair, 0.16),
    L: hexToRgb(look.top), Lg: shade(look.top, 0.82), Ld: shade(look.top, 0.6),
    P: hexToRgb(look.pants), Pd: shade(look.pants, 0.68), Pl: lighten(look.pants, 0.14),
    C: hexToRgb(look.capColor), Cs: lighten(look.capColor, 0.16), Cb: shade(look.capColor, 0.55),
    Sh: hexToRgb(look.shoes), Sg: shade(look.shoes, 0.62),
  });
}

function paint(look, { items = [], closed = false } = {}) {
  const c = palette(Object.assign({}, BASE, look));
  look = Object.assign({}, BASE, look);
  const px = new Uint8ClampedArray(W * H * 4);
  const p = (x, y, k) => { if (x < 0 || y < 0 || x >= W || y >= H) return; const i = (y * W + x) * 4, v = c[k]; px[i] = v[0]; px[i + 1] = v[1]; px[i + 2] = v[2]; px[i + 3] = 255; };
  const r = (x0, y0, x1, y1, k) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) p(x, y, k); };
  const pts = (list, k) => list.forEach(([x, y]) => p(x, y, k));
  const has = k => items.includes(k);

  if (has('skate')) {
    r(30, 29, 33, 63, 'Bd'); pts([[30, 29], [33, 29], [30, 63], [33, 63]], 'K');
    r(31, 28, 32, 28, 'Bd'); r(31, 64, 32, 64, 'Bd');
    for (const y of [33, 58]) { r(29, y, 34, y + 1, 'Wh'); r(30, y - 1, 33, y - 1, 'Tr'); }
    r(31, 42, 32, 49, 'R'); pts([[31, 43], [31, 48]], 'Rd');
  }
  // Pantalón ancho
  for (let y = 37; y <= 60; y++) { const t = (y - 37) / 23; r(Math.round(9 - 3 * t), y, Math.round(23 + 3 * t), y, 'P'); }
  r(15, 47, 17, 60, 'Pd'); p(16, 46, 'Pd');
  for (let y = 39; y < 60; y++) if (y % 5 === 0) { p(11, y, 'Pl'); p(21, y, 'Pl'); }
  for (const x0 of [7, 21]) { r(x0, 44, x0 + 4, 50, 'Pl'); r(x0, 44, x0 + 4, 44, 'Pd'); r(x0 + 1, 45, x0 + 3, 45, 'P'); }
  for (let y = 52; y < 61; y += 2) { p(8, y, 'Pd'); p(24, y, 'Pd'); }
  // Zapatillas
  r(5, 60, 14, 63, 'Sh'); r(18, 60, 27, 63, 'Sh'); r(5, 64, 14, 64, 'Sg'); r(18, 64, 27, 64, 'Sg');
  r(7, 60, 12, 60, 'Pd'); r(20, 60, 25, 60, 'Pd');
  r(8, 62, 11, 62, 'Sg'); r(21, 62, 24, 62, 'Sg');
  // Cinturón
  r(9, 35, 23, 36, 'B'); r(15, 35, 17, 36, 'M'); p(16, 35, 'B');
  if (has('llavero')) {
    for (let y = 37; y < 42; y++) p(20, y, y % 2 ? 'M' : 'Kd');
    r(19, 42, 22, 46, 'Y'); p(19, 42, 'Yl'); r(20, 44, 21, 45, 'Yd');
  }
  // Sudadera
  r(9, 19, 23, 34, 'L'); r(6, 20, 26, 22, 'L'); r(4, 21, 9, 36, 'L'); r(23, 21, 28, 36, 'L');
  r(4, 34, 9, 36, 'Lg'); r(23, 34, 28, 36, 'Lg'); r(9, 33, 23, 34, 'Lg');
  r(8, 22, 8, 33, 'Lg'); r(24, 22, 24, 33, 'Lg');
  r(12, 31, 20, 31, 'Lg'); r(12, 27, 12, 31, 'Lg'); r(20, 27, 20, 31, 'Lg');
  if (look.straps) { r(10, 20, 11, 32, 'B'); r(21, 20, 22, 32, 'B'); pts([[10, 26], [11, 26], [21, 26], [22, 26]], 'M'); }
  for (let y = 20; y < 25; y++) { p(14, y, 'Ld'); p(18, y, 'Ld'); }
  pts([[14, 25], [18, 25]], 'Ld');
  if (has('handycam')) { r(0, 34, 6, 39, 'Bd'); r(1, 35, 5, 35, 'Gd'); pts([[0, 36], [0, 37]], 'G'); r(5, 33, 6, 33, 'Bd'); p(2, 37, 'R'); }
  // Manos, capucha y cuello
  r(5, 37, 8, 39, 'S'); r(5, 39, 8, 39, 'Ss'); r(26, 36, 29, 38, 'S'); r(26, 38, 29, 38, 'Ss'); r(29, 36, 30, 37, 'S');
  r(10, 17, 22, 19, 'L'); r(12, 18, 20, 18, 'Lg'); r(14, 17, 18, 17, 'Ss'); r(14, 16, 18, 17, 'Ss');
  if (has('auriculares')) { r(12, 20, 20, 20, 'B'); r(9, 17, 12, 21, 'Bd'); r(20, 17, 23, 21, 'Bd'); r(10, 18, 11, 20, 'G'); r(21, 18, 22, 20, 'G'); pts([[10, 19], [22, 19]], 'R'); }
  // Pelo largo por detrás de la cara
  if (look.hairStyle === 'largo') { r(7, 8, 10, 22, 'H'); r(22, 8, 25, 22, 'H'); pts([[8, 23], [10, 23], [22, 23], [24, 23]], 'H'); pts([[8, 12], [24, 12], [9, 18], [23, 18]], 'Hh'); }
  // Cara
  r(11, 8, 21, 15, 'S'); r(12, 16, 20, 16, 'S'); r(14, 17, 18, 17, 'Ss'); r(11, 8, 21, 9, 'Ss');
  if (closed) { pts([[13, 12], [14, 12], [18, 12], [19, 12]], 'K'); pts([[12, 13], [20, 13]], 'Ss'); }
  else { pts([[13, 11], [14, 11], [18, 11], [19, 11], [13, 12], [19, 12]], 'K'); pts([[14, 12], [18, 12]], 'Eye'); pts([[12, 13], [20, 13]], 'Ss'); }
  pts([[16, 14], [17, 14]], 'Ss'); r(15, 15, 17, 15, 'S');
  // Pelo
  if (look.hairStyle === 'corto') {
    r(10, 7, 10, 11, 'H'); r(22, 7, 22, 11, 'H'); r(11, 8, 21, 8, 'H'); pts([[11, 9], [21, 9], [13, 9], [17, 9], [19, 9]], 'H');
  } else {
    r(8, 7, 10, 15, 'H'); r(22, 7, 24, 15, 'H');
    if (look.hairStyle === 'revuelto') pts([[7, 10], [7, 12], [7, 14], [25, 10], [25, 12], [25, 14], [9, 16], [10, 16], [23, 16], [22, 16], [8, 16], [24, 16]], 'H');
    r(11, 8, 21, 8, 'H'); pts([[12, 9], [13, 9], [15, 9], [16, 10], [19, 9], [20, 9], [21, 9], [11, 9], [11, 10], [21, 10]], 'H');
    pts([[9, 9], [23, 9], [9, 12], [23, 12]], 'Hh');
    if (look.hairStyle === 'revuelto') { p(9, 14, 'M'); p(23, 14, 'M'); }
  }
  // Gorra o pelo por arriba
  if (look.cap) {
    r(11, 1, 21, 5, 'C'); r(10, 2, 22, 5, 'C'); r(12, 0, 20, 0, 'C'); r(8, 6, 24, 7, 'Cb'); r(9, 6, 23, 6, 'C'); r(13, 1, 15, 2, 'Cs');
  } else {
    const top = look.hairStyle === 'corto' ? 4 : 2;
    r(11, top, 21, 7, 'H'); r(10, top + 1, 22, 7, 'H'); r(12, top - 1, 20, top - 1, 'H'); r(9, 5, 23, 7, 'H');
    pts([[13, top], [17, top + 1], [19, top]], 'Hh');
    if (look.hairStyle === 'revuelto') pts([[11, 1], [15, 0], [19, 1], [21, 2]], 'H');
  }
  // Contorno de 1 px
  const out = new Uint8ClampedArray(px);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    if (px[i + 3]) continue;
    const near = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const nx = x + dx, ny = y + dy; return nx >= 0 && ny >= 0 && nx < W && ny < H && px[(ny * W + nx) * 4 + 3]; });
    if (near) { out[i] = 17; out[i + 1] = 17; out[i + 2] = 17; out[i + 3] = 255; }
  }
  return out;
}

const cache = new Map();
function toURL(pixels, crop) {
  const [x, y, w, h] = crop || [0, 0, W, H];
  const full = document.createElement('canvas'); full.width = W; full.height = H;
  full.getContext('2d').putImageData(new ImageData(pixels, W, H), 0, 0);
  if (!crop) return full.toDataURL('image/png');
  const part = document.createElement('canvas'); part.width = w; part.height = h;
  part.getContext('2d').drawImage(full, x, y, w, h, 0, 0, w, h);
  return part.toDataURL('image/png');
}
/** Imagen del personaje entero (data URL), con objetos y ojos según el estado. */
function image(look, opts = {}) {
  const key = 'b' + JSON.stringify([look, opts.items || [], !!opts.closed]);
  if (!cache.has(key)) cache.set(key, toURL(paint(look, opts)));
  return cache.get(key);
}
/** Solo la cara, para avatares sin foto. */
function face(look) {
  const key = 'f' + JSON.stringify(look);
  if (!cache.has(key)) cache.set(key, toURL(paint(look), [6, 0, 22, 20]));
  return cache.get(key);
}

window.Character = { BASE, OPTIONS, randomLook, image, face, W, H };
})();
