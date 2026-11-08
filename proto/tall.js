/* PRUEBA: personaje de proporciones altas (64×128), ropa ancha con pliegues y 4 tonos por pieza. */
(function () {
'use strict';
const W = 64, H = 128;
const rgb = h => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const mul = (c, f) => c.map(v => Math.max(0, Math.min(255, Math.round(v * f))));
const tint = (c, f) => c.map(v => Math.round(v + (255 - v) * f));
const mix = (a, b, t) => a.map((v, i) => Math.round(v * (1 - t) + b[i] * t));
const WARM = [60, 36, 40];                         // las sombras tiran a cálido
const tones = hex => { const b = rgb(hex); return { hi: tint(b, 0.16), base: b, s1: mix(mul(b, 0.78), WARM, 0.12), s2: mix(mul(b, 0.58), WARM, 0.22) }; };
const INK = [42, 30, 28], WHITE = [246, 240, 230], METAL = [176, 172, 168], GOLD = [226, 176, 70], RED = [210, 70, 60];

function paint(L) {
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
        if (opts.texture !== false && c === T.base && t > 0.5 && (x * 5 + y * 3) % 11 === 0) c = T.s1;   // transición punteada entre tonos
        if (opts.color) c = opts.color(x, y, c, t) || c;
        set(x, y, c);
      }
    }
  };
  const line = (pts, c) => pts.forEach(([x, y]) => set(x, y, c));
  const hline = (y, a, b, c) => { for (let x = a; x <= b; x++) set(x, y, c); };
  const vline = (x, a, b, c) => { for (let y = a; y <= b; y++) set(x, y, c); };
  const lerp = (a, b, t) => Math.round(a + (b - a) * t);
  const has = k => (L.items || []).includes(k);

  const skin = tones(L.skin), hair = tones(L.hair), top = tones(L.top), top2 = tones(L.top2 || L.top), bot = tones(L.bottom), shoe = tones(L.shoes), cap = tones(L.capColor || '#2A2420');
  const stripe = L.stripe ? tones(L.stripe) : null;

  // ---- Pelo por detrás
  if (L.hair_style === 'largo') form(16, 52, y => [24 - (y > 30 ? 2 : 0), 39 + (y > 30 ? 2 : 0)], hair, 1);
  if (L.hair_style === 'mono') { form(2, 9, y => [28 - (y > 3 && y < 8 ? 2 : 0), 35 + (y > 3 && y < 8 ? 2 : 0)], hair, 1); }

  // ---- Piernas (falda) o pantalón ancho
  if (L.bottomType === 'falda') {
    form(84, 113, y => [24, 30], tones(L.legs || L.skin), 2, { color: (x, y, c) => (L.legs ? c : null) });
    form(84, 113, y => [33, 39], tones(L.legs || L.skin), 3);
    form(66, 86, y => { const t = (y - 66) / 20; return [lerp(22, 17, t), lerp(41, 46, t)]; }, bot, 4, {
      color: (x, y, c) => (y > 72 && (x - 17) % 5 === 0 ? bot.s1 : y > 72 && (x - 17) % 5 === 1 ? bot.hi : null) });
    hline(86, 17, 46, bot.s2);
  } else {
    // pierna izquierda y derecha, anchas, con caída y pliegues al final
    const legL = y => { const t = Math.min(1, (y - 66) / 30); return [lerp(20, 13, t) + (y > 104 ? (y % 4 < 2 ? -1 : 0) : 0), y < 80 ? 31 : 30]; };
    const legR = y => { const t = Math.min(1, (y - 66) / 30); return [y < 80 ? 32 : 33, lerp(43, 50, t) + (y > 104 ? (y % 4 < 2 ? 1 : 0) : 0)]; };
    form(66, 116, legL, bot, 4);
    form(66, 116, legR, bot, 5);
    // pliegues: tela amontonada abajo (curvas) y caída desde la rodilla
    for (const [span, zz, dir] of [[legL, 4, -1], [legR, 5, 1]]) {
      z = zz;
      [101, 105, 109, 113].forEach((y0, k) => {
        const [a, b] = span(y0), off = k % 2 ? 2 : -1;
        for (let x = a + 1; x < b; x++) { const t = (x - a) / (b - a), y = y0 + Math.round(2 * Math.sin(Math.PI * Math.min(1, Math.max(0, t + off * 0.08)))); set(x, y, bot.s2); if (y - 1 > y0 - 3) set(x, y - 1, bot.hi); }
      });
      for (let y = 72; y <= 98; y++) { const [a, b] = span(y), x = dir < 0 ? a + 5 + Math.round((y - 72) / 6) : b - 5 - Math.round((y - 72) / 6); set(x, y, bot.s1); if (y > 80) { const x2 = dir < 0 ? b - 3 - Math.round((y - 80) / 5) : a + 3 + Math.round((y - 80) / 5); set(x2, y, bot.s1); } }
    }
    // bolsillos cargo con solapa
    for (const [x0, zz] of [[13, 4], [43, 5]]) {
      z = zz;
      for (let y = 84; y <= 97; y++) hline(y, x0 + 1, x0 + 7, y === 84 || y === 85 ? bot.s2 : (y === 86 ? bot.hi : bot.s1));
      vline(x0 + 1, 84, 97, bot.s2); vline(x0 + 7, 84, 97, bot.s2); set(x0 + 4, 86, METAL);
    }
    // cinturón
    z = 6; hline(66, 20, 43, INK); hline(67, 20, 43, INK); hline(66, 30, 33, METAL); hline(67, 30, 33, METAL);
  }

  // ---- Zapatillas gordas o botas: salen de debajo de cada pierna, con su mismo ancho
  const skirt = L.bottomType === 'falda', boots = L.shoeType === 'botas';
  const foot = (a, b, left, zz) => {
    // a,b = ancho de la pierna (o del bajo del pantalón) justo encima del pie
    const y0 = skirt ? 114 : 113, toe = left ? -1 : 1;
    if (boots && skirt) form(101, 116, y => [a, b], shoe, zz, { color: (x, y, c) => (y === 101 ? shoe.s2 : y === 104 && (x + 1) % 3 === 0 ? METAL : null) });
    form(y0, 121, y => {
      const r = y - y0, inset = r === 0 ? 2 : r === 1 ? 1 : 0, out = r >= 4 ? 1 : 0;
      const lo = left ? a - 1 - out : a, hi = left ? b : b + 1 + out;   // el lado de dentro no crece, así los pies no se juntan
      return [lo + inset, hi - inset];
    }, shoe, zz, {
      color: (x, y, c) => {
        if (boots) return y === y0 + 3 ? shoe.s1 : null;
        if (y >= y0 + 1 && y <= y0 + 3 && x > a + 1 && x < b - 1 && (x + y) % 3 === 0) return shoe.s2;   // cordones
        if (y === 118 && x > a && x < b) return shoe.s1;                                                // pala
        return null;
      } });
    z = zz;
    const s0 = left ? a - 2 : a, s1 = left ? b : b + 2;
    hline(122, s0, s1, boots ? INK : [214, 206, 192]); hline(123, s0, s1, boots ? INK : [176, 168, 154]);
    void toe;
  };
  if (skirt) { foot(24, 30, true, 7); foot(33, 39, false, 8); }
  else {
    // el pantalón tapa el empeine: el pie va por debajo (z menor) y asoma bajo el bajo
    foot(14, 28, true, 2); foot(35, 49, false, 3);
    z = 6; hline(116, 13, 30, mul(bot.s2, 0.8)); hline(116, 33, 50, mul(bot.s2, 0.8));   // sombra del bajo sobre la zapatilla
  }

  // ---- Torso: sudadera ancha / capas
  const longSleeve = L.topType !== 'camiseta';
  const torso = y => { const sh = [[24, 39], [21, 42], [19, 44], [18, 45]]; if (y - 35 < sh.length) return sh[y - 35]; if (y < 50) return [18, 45]; if (y < 61) return [17, 46]; return [18 + (y - 61), 45 - (y - 61)]; };
  const pattern = (x, y, c) => { if (!stripe) return null; if (y % 6 < 3) return c === top.hi ? stripe.hi : c === top.s1 ? stripe.s1 : c === top.s2 ? stripe.s2 : stripe.base; return null; };
  // mangas (brazos caídos, holgadas, más anchas en el puño)
  const sleeve = (side) => y => { const t = (y - 37) / 31, puff = y > 58 && y < 65 ? 1 : 0; return side < 0 ? [lerp(15, 11, t) - puff, lerp(20, 18, t)] : [lerp(43, 45, t), lerp(48, 52, t) + puff]; };
  const sleeveT = L.topType === 'capas' ? top2 : top;
  const sleeveFolds = (x, y, c) => {
    if (L.topType === 'capas' && y < 46) return pattern(x, y, top.base) ? (pattern(x, y, c)) : (c === top2.hi ? top.hi : c === top2.s1 ? top.s1 : c === top2.s2 ? top.s2 : top.base);
    if (!longSleeve && y > 46) return null;
    if ([44, 52, 59, 63].some(f => y === f + Math.round(Math.sin(x * 0.9) * 1))) return sleeveT.s2;   // arrugas del brazo
    if ([44, 52, 59, 63].some(f => y === f - 1 + Math.round(Math.sin(x * 0.9) * 1))) return sleeveT.hi;
    if (L.topType !== 'capas') return pattern(x, y, c);
    return null;
  };
  if (longSleeve) { form(37, 67, sleeve(-1), sleeveT, 9, { color: sleeveFolds }); form(37, 67, sleeve(1), sleeveT, 10, { color: sleeveFolds }); }
  else { form(37, 46, sleeve(-1), top, 9, { color: pattern }); form(37, 46, sleeve(1), top, 10, { color: pattern }); form(47, 66, y => [12, 17], skin, 9); form(47, 66, y => [46, 51], skin, 10); }
  // cuerpo
  form(35, 64, torso, top, 11, { color: (x, y, c, t) => {
    const p = pattern(x, y, c); if (p) return p;
    if (y > 39 && y < 50 && (x === 19 + Math.round((y - 39) * 0.6) || x === 44 - Math.round((y - 39) * 0.6))) return top.s1;   // pliegues desde la axila
    if (y > 56 && y < 62 && x === 31 + Math.round((y - 56) * 0.5)) return top.s1;
    return null; } });
  if (L.topType === 'capas') form(63, 68, y => [17, 46], top2, 11);
  else form(62, 66, y => [19 + Math.max(0, y - 63), 44 - Math.max(0, y - 63)], top, 11, { color: (x, y, c) => (x % 2 ? top.s1 : c) }); // elástico que recoge
  // bolsillo canguro, cordones y capucha
  if (L.topType === 'sudadera') {
    z = 11; for (let y = 51; y <= 61; y++) { set(23 + Math.max(0, 54 - y), y, top.s2); set(40 - Math.max(0, 54 - y), y, top.s2); }
    hline(51, 26, 37, top.s2); hline(61, 23, 40, top.s1);
    vline(28, 37, 45, top.s1); vline(35, 37, 45, top.s1); set(28, 46, METAL); set(35, 46, METAL);
  }
  // cuello
  z = 12; form(31, 35, y => [28, 35], skin, 12);
  if (L.topType === 'sudadera') {
    z = 13; form(31, 40, y => [20 + Math.max(0, y - 35), 43 - Math.max(0, y - 35)], top, 13);
    form(33, 39, y => [26 + Math.max(0, y - 36), 37 - Math.max(0, y - 36)], { hi: top.s2, base: top.s2, s1: mul(top.s2, 0.85), s2: mul(top.s2, 0.75) }, 13);   // hueco de la capucha
    hline(31, 22, 41, top.hi); hline(40, 25, 38, top.s1);
  }

  // ---- Manos
  form(68, 75, y => [11 + (y > 73 ? 1 : 0), 16 - (y > 74 ? 1 : 0)], skin, 14); form(68, 75, y => [47 + (y > 74 ? 1 : 0), 52 - (y > 73 ? 1 : 0)], skin, 15);
  z = 14; set(17, 70, skin.s1); set(17, 71, skin.s1); z = 15; set(46, 70, skin.hi); set(46, 71, skin.hi);

  // ---- Accesorios del cuerpo
  if (L.bag === 'bolso') { z = 0; for (let i = 0; i <= 34; i++) set(44 - Math.round(i * 0.62), 36 + i, INK); form(66, 76, y => [16, 27], tones('#2A2420'), 16); }
  if (L.bag === 'mochila') { z = 0; vline(22, 37, 58, INK); vline(23, 37, 58, INK); vline(40, 37, 58, INK); vline(41, 37, 58, INK); set(22, 48, METAL); set(41, 48, METAL); }
  if (has('llavero')) { z = 0; for (let y = 68; y <= 74; y++) set(41, y, y % 2 ? METAL : [120, 116, 112]); form(75, 80, y => [39, 43], tones('#EDE6DA'), 17); set(40, 77, INK); set(42, 77, INK); }
  if (has('skate')) { form(60, 118, y => [53, 58], tones('#2B2420'), 18, { color: (x, y, c) => ((y > 82 && y < 96 && x > 54 && x < 57) ? WHITE : (y === 66 || y === 112) ? [232, 214, 170] : null) }); }

  // ---- Cabeza
  const faceSpan = y => y === 14 ? [27, 36] : y === 15 ? [26, 37] : y <= 26 ? [25, 38] : y === 27 ? [26, 37] : y === 28 ? [27, 36] : y === 29 ? [28, 35] : [30, 33];
  form(14, 30, faceSpan, skin, 20, { color: (x, y, c, t) => (L.cap && y <= 19 ? skin.s1 : null) });  // la visera hace sombra
  z = 20; form(19, 24, y => [24, 24], skin, 20); form(19, 24, y => [39, 39], skin, 20);
  const eye = rgb(L.eyes || '#3B2A1E');
  for (const ex of [28, 34]) { hline(21, ex - 1, ex + 1, INK); set(ex, 22, eye); set(ex + 1, 22, mul(eye, 0.6)); set(ex - 1, 22, tint(rgb(L.skin), 0.7)); set(ex, 23, mul(eye, 0.7)); }
  hline(19, 27, 29, mul(hair.s2, 1)); hline(19, 33, 35, mul(hair.s2, 1));
  set(31, 25, skin.s1); set(32, 25, skin.s1); hline(27, 30, 33, mix(skin.s2, [150, 60, 60], 0.3));
  if (L.blush) { set(26, 25, mix(skin.base, [230, 110, 110], 0.4)); set(37, 25, mix(skin.base, [230, 110, 110], 0.4)); }
  if (L.freckles) line([[27, 24], [29, 25], [35, 25], [36, 24]], skin.s2);
  if (L.earrings) { set(24, 25, METAL); set(39, 25, METAL); set(24, 26, METAL); set(39, 26, METAL); }
  if (L.glasses) { z = 0; for (const ex of [28, 34]) { hline(20, ex - 2, ex + 2, [110, 90, 70]); hline(24, ex - 2, ex + 2, [110, 90, 70]); vline(ex - 2, 20, 24, [110, 90, 70]); vline(ex + 2, 20, 24, [110, 90, 70]); } hline(21, 31, 32, [110, 90, 70]); }

  // ---- Pelo por delante (mechones)
  z = 21;
  const strands = (x, y, c) => (((x * 7 + y * 3) % 5 === 0) ? hair.s1 : ((x * 3 + y) % 7 === 0 ? hair.hi : null));
  if (L.hair_style === 'revuelto') {
    form(9, 15, y => [24 - (y > 11 ? 1 : 0), 39 + (y > 11 ? 1 : 0)], hair, 21, { color: strands });
    form(15, 27, y => [22 + (y % 3 === 0 ? 1 : 0), 25], hair, 21, { color: strands }); form(15, 27, y => [38, 41 - (y % 3 === 0 ? 1 : 0)], hair, 21, { color: strands });
    line([[26, 16], [27, 17], [29, 16], [30, 17], [33, 16], [35, 17], [36, 16], [28, 18], [34, 18]], hair.base);
    line([[21, 20], [21, 24], [42, 22], [42, 26], [23, 28], [40, 28], [24, 29]], hair.s1);
  } else if (L.hair_style === 'mono') {
    form(10, 15, y => [25, 38], hair, 21, { color: strands }); form(15, 20, y => [24, 25], hair, 21); form(15, 20, y => [38, 39], hair, 21);
    for (let y = 16; y <= 32; y++) { set(y < 24 ? 25 : 26, y, hair.base); set(y < 24 ? 38 : 37, y, hair.base); } // mechones sueltos
    if (L.braids) for (let y = 16; y <= 30; y++) { set(26, y, y % 2 ? hair.s1 : hair.hi); set(37, y, y % 2 ? hair.s1 : hair.hi); }
  } else if (L.hair_style === 'largo') {
    form(10, 16, y => [24, 39], hair, 21, { color: strands }); form(16, 40, y => [22, 25], hair, 21, { color: strands }); form(16, 40, y => [38, 41], hair, 21, { color: strands });
  }
  // ---- Gorra o gorro
  if (L.cap === 'gorra') {
    // copa redondeada con costuras y visera de frente, un poco ladeada
    z = 22; form(5, 15, y => (y === 5 ? [28, 35] : y === 6 ? [26, 37] : y === 7 ? [25, 38] : [24, 39]), cap, 22, { color: (x, y, c) => ((x === 31 && y < 15) ? cap.s1 : null) });
    hline(14, 24, 39, cap.s1);
    z = 23; form(15, 17, y => (y === 15 ? [22, 41] : y === 16 ? [21, 40] : [23, 37]), cap, 23, { color: (x, y, c) => (y === 15 ? cap.hi : y === 17 ? cap.s2 : cap.base) });
    if (L.capLogo) line([[31, 8], [31, 9], [30, 10], [31, 10], [32, 10], [31, 11], [31, 12]], WHITE);
  } else if (L.cap === 'gorro') {
    z = 22; form(5, 16, y => [y < 7 ? 27 : 24, y < 7 ? 36 : 39], cap, 22, { color: (x, y, c) => (x % 3 === 0 ? cap.s1 : null) });
    form(14, 17, y => [23, 40], cap, 23, { color: (x, y, c) => (x % 2 ? cap.s1 : cap.base) });
  }
  if (has('auriculares')) { z = 0; form(32, 37, y => [21, 25], tones('#2A2626'), 24); form(32, 37, y => [38, 42], tones('#2A2626'), 25); hline(38, 25, 38, INK); }

  // ---- Volumen extra por zonas + contorno cálido
  const lit = new Uint8ClampedArray(px);
  const zoneAt = (x, y) => (filled(x, y) ? zone[y * W + x] : -1);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const zz = zoneAt(x, y); if (zz <= 0) continue;
    const i = (y * W + x) * 4; let f = 1;
    if (zoneAt(x, y + 1) !== zz && filled(x, y + 1)) f *= 0.82;      // sombra de una pieza sobre otra
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
function image(look) {
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  c.getContext('2d').putImageData(new ImageData(paint(look), W, H), 0, 0);
  return c.toDataURL('image/png');
}
window.Tall = { image, W, H };
})();
