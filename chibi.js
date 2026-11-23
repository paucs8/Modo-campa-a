// Prototipo v2: personajes estilo RPG de bolsillo (vista 3/4, cuerpo con pose, sombreado a mano).
// Mismo formato de "look" que character.js.
(function () {
  const W = 40, H = 48, OX = 3, OY = 2;
  const hex = h => { h = String(h || '#888888').replace('#', ''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); };
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const mul = (a, f) => a.map(v => Math.max(0, Math.min(255, Math.round(v * f))));
  const SUN = [255, 238, 196], COOL = [74, 60, 136], DEEP = [32, 20, 54], INK = [34, 24, 42], WHITE = [255, 252, 246];
  const ramp = c => {
    const b = typeof c === 'string' ? hex(c) : c;
    return { hi: mix(mix(b, WHITE, 0.28), SUN, 0.25), b, s1: mix(mul(b, 0.76), COOL, 0.22), s2: mix(mul(b, 0.54), DEEP, 0.4), ln: mix(mul(b, 0.36), DEEP, 0.55) };
  };
  const ell = (cx, cy, rx, ry) => (x, y) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
  const hash = (x, y, s = 0) => { let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

  // ---- Cuerpo base dibujado a mano. Cada letra es una zona y su tono:
  // T/t/u torso (base/sombra/luz), m bajo de la prenda, A/a/v manga, c puño, H/h mano, N cuello,
  // P/p/q pantalón arriba, L/l/r parte baja de la pierna, F/f/w zapato, O suela
  const BODY = [
    [20, [[14, 17, 'N']]],
    [21, [[10, 10, 'v'], [11, 11, 'A'], [12, 12, 'u'], [13, 18, 'T'], [19, 19, 't'], [20, 21, 'a']]],
    [22, [[9, 9, 'v'], [10, 11, 'A'], [12, 12, 'u'], [13, 18, 'T'], [19, 20, 't'], [21, 22, 'a']]],
    [23, [[8, 8, 'v'], [9, 10, 'A'], [11, 11, 'a'], [12, 12, 'u'], [13, 18, 'T'], [19, 20, 't'], [21, 22, 'a']]],
    [24, [[8, 8, 'v'], [9, 10, 'A'], [11, 11, 'a'], [12, 18, 'T'], [19, 20, 't'], [21, 22, 'a']]],
    [25, [[8, 8, 'v'], [9, 10, 'A'], [11, 11, 'a'], [12, 18, 'T'], [19, 20, 't'], [21, 22, 'a']]],
    [26, [[8, 8, 'A'], [9, 10, 'A'], [11, 11, 'a'], [12, 18, 'T'], [19, 20, 't'], [21, 22, 'a']]],
    [27, [[8, 10, 'c'], [11, 11, 'a'], [12, 18, 'T'], [19, 20, 't'], [21, 22, 'c']]],
    [28, [[8, 9, 'H'], [10, 10, 'h'], [11, 19, 'm'], [20, 20, 'm'], [21, 22, 'h']]],
    [29, [[8, 9, 'H'], [10, 10, 'h'], [11, 11, 'q'], [12, 19, 'P'], [20, 20, 'p'], [21, 22, 'h']]],
    [30, [[11, 11, 'q'], [12, 19, 'P'], [20, 20, 'p']]],
    [31, [[10, 10, 'q'], [11, 14, 'P'], [15, 15, 'p'], [16, 16, 'p'], [17, 19, 'P'], [20, 20, 'p']]],
    [32, [[10, 10, 'q'], [11, 13, 'P'], [14, 14, 'p'], [17, 17, 'p'], [18, 19, 'P'], [20, 20, 'p']]],
    [33, [[10, 10, 'q'], [11, 13, 'P'], [14, 14, 'p'], [17, 17, 'p'], [18, 19, 'P'], [20, 20, 'p']]],
    [34, [[9, 9, 'r'], [10, 12, 'L'], [13, 13, 'l'], [17, 17, 'l'], [18, 19, 'L'], [20, 20, 'l']]],
    [35, [[9, 9, 'r'], [10, 12, 'L'], [13, 13, 'l'], [17, 17, 'l'], [18, 19, 'L'], [20, 20, 'l']]],
    [36, [[9, 9, 'r'], [10, 12, 'L'], [13, 13, 'l'], [17, 17, 'l'], [18, 19, 'L'], [20, 20, 'l']]],
    [37, [[9, 9, 'r'], [10, 12, 'L'], [13, 13, 'l'], [17, 17, 'l'], [18, 19, 'L'], [20, 20, 'l']]],
    [38, [[8, 8, 'w'], [9, 12, 'F'], [13, 13, 'f'], [17, 17, 'f'], [18, 19, 'F'], [20, 21, 'f']]],
    [39, [[7, 7, 'w'], [8, 12, 'F'], [13, 13, 'f'], [17, 17, 'f'], [18, 20, 'F'], [21, 21, 'f']]],
    [40, [[7, 13, 'O'], [17, 21, 'O']]],
  ];
  const HEAD = [[4, 11, 19], [5, 9, 21], [6, 8, 22], [7, 7, 23], [8, 7, 23], [9, 7, 23], [10, 7, 23], [11, 7, 23], [12, 7, 23], [13, 7, 23], [14, 7, 23], [15, 7, 23], [16, 8, 22], [17, 8, 22], [18, 9, 21], [19, 11, 19]];

  function draw(look, opts = {}) {
    const L = Object.assign({}, look), items = opts.items || L.items || [], mood = opts.mood || L.mood || 'idle';
    const g = new Array(W * H).fill(null), zone = new Array(W * H).fill(null);
    const inb = (x, y) => x >= 0 && y >= 0 && x < W && y < H;
    const I = (x, y) => (y + OY) * W + x + OX;
    const get = (x, y) => (inb(x + OX, y + OY) ? g[I(x, y)] : null);
    const zat = (x, y) => (inb(x + OX, y + OY) ? zone[I(x, y)] : null);
    const set = (x, y, c, z) => { if (!inb(x + OX, y + OY) || !c) return; g[I(x, y)] = c; if (z !== undefined) zone[I(x, y)] = z; };
    const stamp = (x0, y0, rows, pal, z = 'item') => rows.forEach((row, j) => [...row].forEach((ch, i) => { if (pal[ch]) set(x0 + i, y0 + j, pal[ch], z); }));
    // Pieza con sombreado automático (para pelo, gorros, bolsos): luz arriba-izquierda y línea donde pisa otra cosa
    const part = (test, box, R, z, o = {}) => {
      const M = new Set(), k = (x, y) => (x + 50) * 200 + y + 50;
      for (let y = box[1]; y <= box[3]; y++) for (let x = box[0]; x <= box[2]; x++) if (test(x, y)) M.add(k(x, y));
      const has = (x, y) => M.has(k(x, y));
      const run = (x, y, dx, dy) => { let n = 0; while (n < 30 && has(x + dx * (n + 1), y + dy * (n + 1))) n++; return n; };
      const out = [];
      M.forEach(s => {
        const x = Math.floor(s / 200) - 50, y = (s % 200) - 50;
        const l = run(x, y, -1, 0), r = run(x, y, 1, 0), t = run(x, y, 0, -1), d = run(x, y, 0, 1), w = l + r + 1, h = t + d + 1;
        const rx = w > 1 ? l / (w - 1) : 0.5, ry = h > 1 ? t / (h - 1) : 0.5;
        const RR = o.rampAt ? (o.rampAt(x, y) || R) : R;
        let c = RR.b;
        if (rx > 0.7 || d === 0) c = RR.s1;
        if ((rx > 0.88 && w > 3) || (d === 0 && rx > 0.55)) c = RR.s2;
        if (rx < 0.34 && ry < 0.4 && w > 3 && h > 2) c = RR.hi;
        if (o.line !== false && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => !has(x + dx, y + dy) && get(x + dx, y + dy))) c = RR.ln;
        out.push([x, y, c]);
      });
      out.forEach(([x, y, c]) => set(x, y, c, z));
    };

    const skin = ramp(L.skin || '#F1C8A5'), hairR = ramp(L.hair || '#1E1A1A');
    const style = L.hairStyle || 'corto', top = L.top || 'sudadera', bottom = L.bottom || 'cargo';
    const tR = ramp(L.topColor || '#EDE6DA'), t2R = ramp(L.top2 || '#26201E'), pR = ramp(L.bottomColor || '#2C2522');
    const shoeR = ramp(L.shoes === 'neon' ? '#3FE0A0' : L.shoes === 'doradas' ? '#E8B84A' : (L.shoesColor || '#EDE6DA'));
    const soleR = ramp(L.shoes === 'neon' ? '#F2549A' : L.shoes === 'botas' ? '#2A2024' : '#F4F0EA');
    const bareLegs = bottom === 'falda' || bottom === 'corto';
    const legR = bareLegs ? (L.legs && L.legs !== 'piel' ? ramp(L.legsColor || '#1E1A1A') : skin) : pR;
    const shortSleeve = top === 'camiseta';
    const sleeveR = top === 'capas' ? t2R : tR;
    const hatOn = ['gorra', 'gorro', 'bucket'].includes(L.head);

    // ---- Detrás: alas, pelo largo y coletas, capucha
    if (L.bag === 'alas') {
      const W1 = ramp('#F7F3FB');
      const wing = side => {
        const fx = x => (side < 0 ? x : 31 - x);
        [[4, 17, 5.5, 3.2], [5, 21.5, 5, 2.6], [6, 25.5, 4, 2.3]].forEach(e =>
          part((x, y) => ell(...e)(fx(x), y) && fx(x) <= 10, [-5, 12, 36, 29], W1, 'wing'));
        part((x, y) => { const X = fx(x); return X >= -1 && X <= 3 && y >= 12 && y <= 15 && y >= 15 - (X + 1); }, [-5, 11, 36, 16], W1, 'wing');
      };
      wing(-1); wing(1);
    }
    if (style === 'largo' || style === 'melena') {
      const yb = style === 'largo' ? 30 : 23;
      part((x, y) => (y >= 8 && y <= yb && x >= 5 && x <= 25 && !(y === yb && (x === 5 || x === 25))) || ell(15, 9, 9.5, 6.5)(x, y), [4, 2, 26, yb], hairR, 'hairB',
        { rampAt: (x, y) => (y > 14 && (x === 8 || x === 21) ? { ...hairR, b: hairR.s1 } : null) });
    }
    if (style === 'coletas') {
      part(ell(4, 15, 3.3, 6.2), [0, 8, 8, 22], hairR, 'hairB', { rampAt: (x, y) => (y === 15 ? { ...hairR, b: hairR.s1, hi: hairR.s1 } : null) });
      part(ell(26.5, 15, 3.3, 6.2), [23, 8, 31, 22], hairR, 'hairB', { rampAt: (x, y) => (y === 15 ? { ...hairR, b: hairR.s1, hi: hairR.s1 } : null) });
    }
    if (top === 'sudadera') for (let y = 18; y <= 21; y++) for (let x = 11; x <= 20; x++) set(x, y, y === 18 ? tR.s2 : tR.s1, 'hood');

    // ---- Cuerpo
    const tone = (R, ch) => (/[a-z]/.test(ch) ? R.s1 : R.b);
    BODY.forEach(([y, spans]) => spans.forEach(([x0, x1, ch]) => {
      for (let x = x0; x <= x1; x++) {
        let c, z;
        switch (ch) {
          case 'T': c = tR.b; z = 'top'; break; case 't': c = tR.s1; z = 'top'; break; case 'u': c = tR.hi; z = 'top'; break; case 'm': c = tR.s1; z = 'top'; break;
          case 'A': case 'a': case 'v': case 'c': {
            const R = (shortSleeve && y >= 24) ? skin : sleeveR;
            c = ch === 'v' ? R.hi : ch === 'a' ? R.s1 : ch === 'c' ? (R === skin ? skin.b : R.s2) : R.b; z = R === skin ? 'skin' : 'arm';
            if (shortSleeve && y === 24) c = skin.s1; break;
          }
          case 'H': c = skin.b; z = 'hand'; break; case 'h': c = skin.s1; z = 'hand'; break; case 'N': c = skin.s1; z = 'skin'; break;
          case 'P': case 'p': case 'q': c = ch === 'q' ? pR.hi : tone(pR, ch); z = 'pants'; break;
          case 'L': case 'l': case 'r': c = ch === 'r' ? legR.hi : tone(legR, ch); z = bareLegs ? 'leg' : 'pants'; break;
          case 'F': c = shoeR.b; z = 'shoe'; break; case 'f': c = shoeR.s1; z = 'shoe'; break; case 'w': c = shoeR.hi; z = 'shoe'; break;
          case 'O': c = (x === 7 || x === 17) ? soleR.hi : soleR.b; z = 'shoe'; break;
        }
        set(x, y, c, z);
      }
    }));
    // líneas entre brazo y torso
    for (let y = 21; y <= 29; y++) { if (zat(11, y) === 'arm' || zat(11, y) === 'skin') set(11, y, (zat(11, y) === 'arm' ? sleeveR : skin).ln); if (zat(20, y) === 'top') set(20, y, tR.ln); }
    // ---- Variantes de pantalón
    if (bottom === 'corto') { for (let x = 9; x <= 20; x++) { if (zat(x, 33)) set(x, 33, pR.s2, 'pants'); } for (let x = 9; x <= 20; x++) if (zat(x, 34)) set(x, 34, legR.s1); }
    if (bottom === 'falda') {
      for (let y = 28; y <= 33; y++) for (let x = 10 - (y > 30 ? 1 : 0); x <= 21 + (y > 30 ? 1 : 0); x++) {
        const pleat = (x + (y > 30 ? 1 : 0)) % 3 === 0;
        set(x, y, y === 33 ? pR.s2 : pleat ? pR.s1 : x < 13 && y < 31 ? pR.hi : pR.b, 'pants');
      }
      for (let y = 31; y <= 33; y++) { set(9, y, pR.hi); set(22, y, pR.s2); }
      for (let x = 9; x <= 20; x++) if (zat(x, 34) && zat(x, 34) !== 'pants') set(x, 34, legR.s1);
    }
    if (bottom === 'cargo') {
      for (let y = 31; y <= 37; y++) { set(9, y, pR.hi, 'pants'); set(21, y, pR.s2, 'pants'); }
      [[9, 33], [10, 33], [9, 34], [10, 34], [20, 33], [21, 33], [20, 34]].forEach(([x, y]) => set(x, y, pR.s1, 'pants'));
      set(9, 32, pR.ln); set(10, 32, pR.ln); set(20, 32, pR.ln); set(21, 32, pR.ln);
      [[10, 36], [12, 37], [18, 36], [19, 37]].forEach(([x, y]) => set(x, y, pR.s1, 'pants'));
    }
    if (bottom === 'vaqueros') {
      for (let y = 30; y <= 37; y++) { set(12, y, pR.hi, 'pants'); set(19, y, mix(pR.b, pR.hi, 0.5), 'pants'); }
      for (let x = 9; x <= 20; x++) if (zat(x, 37) === 'pants') set(x, 37, x < 14 ? pR.hi : pR.b);
      set(13, 30, pR.ln); set(18, 30, pR.ln);
    }
    if (bottom === 'chandal') { const sR = ramp(L.stripe || '#EDE6DA'); for (let y = 29; y <= 37; y++) { if (y > 30) set(y < 34 ? 10 : 9, y, sR.b, 'pants'); set(20, y, sR.s1, 'pants'); } for (let x = 9; x <= 20; x++) if (zat(x, 37) === 'pants') set(x, 37, pR.s2); }
    // ---- Zapatos
    if (L.shoes === 'altas' || L.shoes === 'botas') {
      const y0 = L.shoes === 'botas' ? 34 : 36;
      for (let y = y0; y <= 37; y++) { for (let x = 9; x <= 13; x++) set(x, y, x === 9 ? shoeR.hi : x === 13 ? shoeR.s1 : shoeR.b, 'shoe'); for (let x = 17; x <= 20; x++) set(x, y, x === 20 || x === 17 ? shoeR.s1 : shoeR.b, 'shoe'); }
      if (L.shoes === 'altas') { set(11, 37, WHITE); set(19, 37, WHITE); }
      for (let x = 9; x <= 13; x++) set(x, y0, shoeR.s2); for (let x = 17; x <= 20; x++) set(x, y0, shoeR.s2);
    }
    if (L.shoes !== 'botas') { set(10, 38, shoeR.hi); set(11, 38, WHITE); set(18, 38, WHITE); }

    // ---- Diseño de la parte de arriba
    if (L.pattern === 'rayas') { const sR = ramp(L.stripe || '#26201E'); for (let y = 22; y <= 27; y += 2) for (let x = 11; x <= 20; x++) if (zat(x, y) === 'top') set(x, y, x >= 19 ? sR.s1 : x === 12 ? sR.hi : sR.b); }
    if (L.pattern === 'galaxia') {
      for (let y = 21; y <= 28; y++) for (let x = 11; x <= 20; x++) if (zat(x, y) === 'top') {
        if (hash(x >> 1, y >> 1, 4) > 0.7) set(x, y, mix(get(x, y), [120, 70, 190], 0.55));
        if (hash(x, y, 3) > 0.88) set(x, y, hash(x, y, 9) > 0.5 ? WHITE : [255, 190, 230]);
      }
    }
    if (L.pattern === 'cuadros') { const sR = ramp(L.stripe || '#26201E'); for (let y = 21; y <= 28; y++) for (let x = 11; x <= 20; x++) if (zat(x, y) === 'top' && (x % 3 === 0 || y % 3 === 0)) set(x, y, mix(get(x, y), sR.b, 0.5)); }
    if (top === 'sudadera') {
      for (let x = 13; x <= 18; x++) { set(x, 25, tR.ln); set(x, 26, tR.s1); set(x, 27, tR.s1); }
      set(12, 26, tR.ln); set(19, 26, tR.ln);
      [[14, 21], [14, 22], [14, 23], [16, 21], [16, 22]].forEach(([x, y]) => set(x, y, y === 23 ? tR.s2 : WHITE));
      for (let x = 11; x <= 20; x++) set(x, 28, x % 2 ? tR.s1 : tR.s2);
    }
    if (top === 'chaqueta' || top === 'camisa') {
      for (let y = 21; y <= 28; y++) for (let x = 14; x <= 17; x++) set(x, y, x === 17 ? t2R.s1 : y === 21 ? t2R.s1 : t2R.b, 'top');
      for (let y = 22; y <= 28; y++) { set(13, y, tR.ln); set(18, y, tR.ln); }
      set(13, 21, tR.hi); set(12, 22, tR.hi); set(18, 21, tR.s1); set(19, 22, tR.s1); set(14, 21, tR.hi); set(17, 21, tR.s1);
      if (top === 'chaqueta') { set(11, 26, tR.ln); set(12, 26, tR.ln); set(19, 26, tR.ln); set(20, 26, tR.ln); for (let x = 11; x <= 20; x++) if (x < 14 || x > 17) set(x, 29, x < 14 ? tR.s1 : tR.s2, 'top'); }
    }
    if (top === 'jersey') { for (let x = 13; x <= 18; x++) set(x, 21, tR.s2); for (let x = 11; x <= 20; x++) set(x, 28, x % 2 ? tR.s1 : tR.s2); }
    if (top === 'capas' || top === 'camiseta') { for (let x = 13; x <= 18; x++) set(x, 21, top === 'capas' ? t2R.b : tR.s1); set(14, 21, skin.s1); set(15, 21, skin.s1); set(16, 21, skin.s1); }

    // ---- Bolsos
    const bagR = ramp(L.bagColor || '#2A2420');
    if (L.bag === 'mochila') { for (let y = 21; y <= 27; y++) { set(12, y, y === 21 ? bagR.hi : bagR.b); set(19, y, bagR.s1); } set(12, 25, [200, 190, 170]); }
    if (L.bag === 'bolso') {
      for (let i = 0; i <= 7; i++) set(19 - i, 21 + i, bagR.b);
      part((x, y) => x >= 8 && x <= 11 && y >= 28 && y <= 31, [8, 28, 11, 31], bagR, 'bag');
      set(9, 29, bagR.hi); set(9, 30, [220, 190, 120]);
    }

    // ---- Cabeza y cara (mirando un poco a la izquierda)
    HEAD.forEach(([y, x0, x1]) => { for (let x = x0; x <= x1; x++) set(x, y, x >= x1 - 1 ? skin.s1 : (y >= 18 ? skin.s1 : skin.b), 'face'); });
    set(8, 15, skin.hi); set(9, 16, skin.hi);
    set(23, 13, skin.s1); set(24, 13, skin.s1); set(24, 14, skin.s2); set(23, 14, skin.s1);
    const eyeC = ramp(L.eyes || '#3A2A20');
    const eye = x => { set(x, 12, INK); set(x + 1, 12, INK); set(x, 13, INK); set(x + 1, 13, WHITE); set(x, 14, eyeC.b); set(x + 1, 14, eyeC.ln); set(x, 15, eyeC.hi); set(x + 1, 15, eyeC.b); };
    if (mood === 'tired') { [10, 16].forEach(x => { set(x, 14, INK); set(x + 1, 14, INK); }); } else { eye(10); eye(16); }
    set(9, 12, INK); set(18, 12, INK);
    set(13, 16, skin.s1);
    const mouthC = mix(skin.ln, [180, 56, 66], 0.45);
    if (mood === 'happy') { set(12, 17, mouthC); set(13, 18, mouthC); set(14, 18, mouthC); set(15, 17, mouthC); }
    else if (mood === 'fire') { set(12, 17, mouthC); set(13, 17, WHITE); set(14, 17, WHITE); set(15, 17, mouthC); set(13, 18, [200, 80, 90]); set(14, 18, mouthC); }
    else { set(13, 18, mouthC); set(14, 18, mouthC); }
    if (L.blush) { set(9, 16, [242, 146, 146]); set(10, 16, [246, 170, 160]); set(17, 16, [242, 146, 146]); set(18, 16, [246, 170, 160]); }
    if (L.freckles) { [[10, 17], [12, 16], [17, 17]].forEach(([x, y]) => set(x, y, skin.s1)); }

    // ---- Pelo delante (masa principal + flequillo con mechones)
    const fringe = { corto: [10, 9, 10, 11, 10, 9, 10, 11, 10, 9, 10, 11, 10, 9, 10, 10, 9], revuelto: [11, 10, 12, 10, 11, 9, 12, 10, 11, 10, 12, 9, 11, 10, 11, 10, 9], rizos: [10, 11, 10, 9, 11, 10, 9, 11, 10, 9, 11, 10, 9, 11, 10, 9, 10] }[style] || [10, 10, 11, 11, 10, 9, 9, 10, 11, 11, 10, 9, 9, 10, 11, 10, 9];
    const fr = x => fringe[Math.max(0, Math.min(16, x - 7))];
    let hairTest = (x, y) => ell(15, 9.2, 9.2, 7)(x, y) && (y <= fr(x) || x <= 7 || x >= 23) && y <= 15 + (x >= 23 ? 1 : 0);
    if (style === 'revuelto') { const base = hairTest; const sp = [[9, 3], [11, 2], [14, 1], [15, 1], [18, 2], [20, 3], [6, 6], [7, 5]]; hairTest = (x, y) => base(x, y) || sp.some(([a, b]) => a === x && y >= b && y <= 4); }
    if (style === 'rizos' || style === 'afro') {
      const R0 = style === 'afro' ? 11 : 9.8;
      hairTest = (x, y) => { const a = Math.atan2(y - 9.5, x - 15), r = R0 * (1 + 0.08 * Math.sin(a * 9)); return Math.hypot(x - 15, (y - 9.5) * 1.12) <= r && (y <= fr(x) || x <= 7 || x >= 23) && y <= 18; };
    }
    if (style === 'largo' || style === 'melena') { const yb = style === 'largo' ? 27 : 21; const base = hairTest; hairTest = (x, y) => base(x, y) || (x >= 5 && x <= 8 && y >= 9 && y <= yb - (x === 5 ? 1 : 0)) || (x >= 22 && x <= 25 && y >= 9 && y <= yb - (x === 25 ? 1 : 0)); }
    if (style === 'rapado') hairTest = (x, y) => ell(15, 9.2, 8.6, 6.4)(x, y) && y <= 7;
    if (style === 'cresta') hairTest = (x, y) => (x >= 13 && x <= 17 && y >= 0 && y <= 7) || (ell(15, 9.2, 8.6, 6.4)(x, y) && y <= 6);
    if (style === 'mono') part(ell(15, 2.5, 3.6, 3), [10, -1, 20, 6], hairR, 'hair');
    part((x, y) => hairTest(x, y) && (!hatOn || y >= 5), [3, -2, 27, 28], hairR, 'hair');
    if (!['rapado', 'cresta'].includes(style)) {
      for (let x = 8; x <= 22; x++) { const yb = fr(x); if (zat(x, yb) === 'hair' && fr(x - 1) < yb) set(x, yb - 1, hairR.s1); }
      if (!hatOn) [[10, 4], [11, 4], [12, 3], [13, 3], [9, 5], [16, 3]].forEach(([x, y]) => { if (zat(x, y) === 'hair') set(x, y, hairR.hi); });
      [[12, 8], [12, 9], [18, 7], [18, 8], [15, 8]].forEach(([x, y]) => { if (zat(x, y) === 'hair' && y < fr(x)) set(x, y, hairR.s1); });
    }
    if (style === 'rizos' || style === 'afro') for (let y = 0; y <= 18; y++) for (let x = 4; x <= 26; x++) if (zat(x, y) === 'hair' && hash(x, y, 5) > 0.8) set(x, y, hash(x, y, 2) > 0.5 ? hairR.s1 : hairR.hi);
    if (style === 'largo' || style === 'melena') for (let y = 12; y <= 26; y++) { if (zat(6, y) === 'hair') set(6, y, hairR.s1); if (zat(23, y) === 'hair') set(23, y, hairR.s1); }
    if (L.braids) [[5, 6], [24, 25]].forEach(([a, b]) => part((x, y) => x >= a && x <= b && y >= 15 && y <= 27, [a, 15, b, 27], hairR, 'hair',
      { rampAt: (x, y) => (y % 3 === 0 ? { ...hairR, b: hairR.s2, hi: hairR.s1, s1: hairR.s2 } : null) }));
    if (L.earrings) { set(7, 17, [246, 206, 96]); set(7, 18, [200, 150, 60]); }

    // ---- Gorros
    const hR = ramp(L.headColor || '#2A2420');
    if (L.head === 'gorra') {
      part((x, y) => ell(15, 8.6, 9.2, 5.6)(x, y) && y <= 8, [5, 2, 25, 8], hR, 'hat');
      part((x, y) => (y === 8 && x >= 3 && x <= 15) || (y === 9 && x >= 3 && x <= 13), [3, 8, 15, 9], { ...hR, b: hR.s1, hi: hR.b, s1: hR.s2 }, 'hat');
      set(15, 3, hR.hi); set(15, 2, hR.s1);
      for (let y = 4; y <= 7; y++) set(14 - (y > 5 ? 1 : 0), y, hR.s1);
    }
    if (L.head === 'gorro') {
      part((x, y) => ell(15, 9.2, 9.4, 6.6)(x, y) && y <= 8, [5, 1, 25, 8], hR, 'hat');
      part((x, y) => y >= 7 && y <= 9 && x >= 6 && x <= 24, [6, 7, 24, 9], hR, 'hat', { rampAt: (x, y) => (x % 2 ? { ...hR, b: hR.s1, hi: hR.b } : null) });
      set(15, 2, hR.hi); set(14, 3, hR.hi);
    }
    if (L.head === 'bucket') {
      part((x, y) => ell(15, 8.6, 8.4, 5.2)(x, y) && y <= 8, [6, 2, 24, 8], hR, 'hat');
      part((x, y) => y >= 8 && y <= 9 && x >= 4 && x <= 26, [3, 8, 26, 9], hR, 'hat');
    }
    if (L.head === 'halo') { const gold = [255, 214, 92]; for (let x = 11; x <= 19; x++) { set(x, -2, x < 15 ? [255, 244, 180] : gold); set(x, 0, mul(gold, 0.75)); } set(10, -1, gold); set(20, -1, mul(gold, 0.85)); }

    // ---- Gafas
    if (L.glasses === 'finas' || L.glasses === 'pasta') {
      const fc = L.glasses === 'pasta' ? INK : mix(INK, [140, 100, 70], 0.45);
      [9, 15].forEach(x0 => { for (let x = x0; x <= x0 + 3; x++) { set(x, 11, fc); set(x, 16, fc); } for (let y = 12; y <= 15; y++) { set(x0, y, fc); set(x0 + 3, y, fc); } set(x0 + 1, 11, mix(fc, WHITE, 0.3)); });
      set(13, 12, fc); set(14, 12, fc);
    }
    if (L.glasses === 'sol') {
      [9, 15].forEach(x0 => { for (let x = x0; x <= x0 + 3; x++) for (let y = 12; y <= 15; y++) set(x, y, y === 15 ? [46, 34, 70] : INK); set(x0 + 1, 12, [140, 150, 190]); set(x0 + 2, 13, [80, 84, 120]); });
      set(13, 12, INK); set(14, 12, INK); set(19, 12, INK); set(20, 12, INK);
    }

    // ---- Objetos
    const has = n => items.includes(n);
    if (has('auriculares')) {
      const band = [70, 64, 80];
      for (let x = 8; x <= 22; x++) set(x, x <= 9 || x >= 21 ? (x === 8 || x === 22 ? 5 : 4) : 3, x < 13 ? mix(band, WHITE, 0.25) : band);
      part((x, y) => x >= 5 && x <= 7 && y >= 9 && y <= 13, [5, 9, 7, 13], ramp('#E84A5F'), 'item');
      part((x, y) => x >= 23 && x <= 25 && y >= 9 && y <= 13, [23, 9, 25, 13], ramp('#E84A5F'), 'item');
    }
    if (has('cafe')) stamp(21, 25, ['.ww.', 'wbbw', 'wwww', 'ssss', 'wwww', '.ww.'], { w: [250, 246, 238], b: [120, 76, 48], s: [196, 120, 70] });
    if (has('microfono')) stamp(7, 24, ['gg', 'GG', 'kk', '.k', '.k'], { g: [214, 214, 224], G: [140, 140, 158], k: [44, 40, 52] });
    if (has('llavero')) { set(20, 30, [246, 206, 96]); set(20, 31, [200, 150, 60]); set(21, 31, [120, 200, 240]); }
    if (has('skate')) { for (let y = 23; y <= 39; y++) { set(4, y, [44, 36, 36]); set(5, y, y >= 29 && y <= 33 ? [206, 72, 62] : [66, 56, 56]); set(6, y, [44, 36, 36]); } [[3, 25], [3, 37], [7, 25], [7, 37]].forEach(([x, y]) => set(x, y, [228, 226, 214])); }
    if (has('gatito')) stamp(25, 33, ['g...g...', 'gg.gg...', 'ggggg...', 'gegeg..g', 'ggpgg..g', '.ggggggg', '.gggggg.', '.g.g.gg.'], { g: [104, 104, 118], e: [140, 224, 120], p: [236, 150, 160] });
    if (has('perro')) stamp(24, 33, ['.bb.....', 'bbooo...', 'ooeoo..t', 'kooooo.t', '.oooooot', '..oooooo', '..oo.oo.', '..o...o.'], { o: [216, 156, 86], b: [150, 96, 50], e: [36, 28, 28], k: [36, 28, 28], t: [186, 126, 66] });

    // ---- Contorno exterior oscuro
    const filled = g.slice();
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (filled[y * W + x]) continue;
      const n = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => (inb(x + dx, y + dy) ? filled[(y + dy) * W + x + dx] : null)).filter(Boolean);
      if (n.length) g[y * W + x] = mix(mul(n[0], 0.22), INK, 0.72);
    }
    const shadow = [];
    for (let y = 38; y <= 46; y++) for (let x = 0; x < W; x++) if (ell(17.5, 43.2, 11.5, 2)(x, y) && !g[y * W + x]) shadow.push(y * W + x);

    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d'), im = ctx.createImageData(W, H);
    g.forEach((c, i) => { if (c) im.data.set([c[0], c[1], c[2], 255], i * 4); });
    shadow.forEach(i => im.data.set([60, 30, 30, 70], i * 4));
    ctx.putImageData(im, 0, 0);
    return cv;
  }
  window.Chibi = { W, H, canvas: draw, image: (look, opts) => draw(look, opts).toDataURL() };
})();
