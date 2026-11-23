// Prototipo v3: estilo "pixel cozy" (cabeza grande de frente, cara simple con ojos oscuros y rubor,
// ropa oversize, pantalón ancho que cae sobre el zapato, sombreado con textura). Mismo formato de "look" que character.js.
(function () {
  const W = 40, H = 54, OX = 4, OY = 4;
  const hex = h => { h = String(h || '#888888').replace('#', ''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); };
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const mul = (a, f) => a.map(v => Math.max(0, Math.min(255, Math.round(v * f))));
  const SUN = [255, 240, 205], COOL = [70, 66, 120], DEEP = [30, 22, 40], INK = [36, 24, 26], WHITE = [252, 250, 246];
  // 5 tonos: luz, base, medio, sombra, sombra fuerte + línea
  const ramp = c => {
    const b = typeof c === 'string' ? hex(c) : c;
    const s1 = mix(mul(b, 0.74), COOL, 0.16);
    return { t: [mix(mix(b, WHITE, 0.26), SUN, 0.2), b, mix(b, s1, 0.5), s1, mix(mul(b, 0.52), DEEP, 0.34)], ln: mix(mul(b, 0.34), DEEP, 0.55) };
  };
  const ell = (cx, cy, rx, ry) => (x, y) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
  const hash = (x, y, s = 0) => { let h = (x * 374761393 + y * 668265263 + (s + 1) * 1442695041) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

  function draw(look, opts = {}) {
    const L = Object.assign({}, look), items = opts.items || L.items || [], mood = opts.mood || L.mood || 'idle';
    const g = new Array(W * H).fill(null), zone = new Array(W * H).fill(null);
    const inb = (x, y) => x >= 0 && y >= 0 && x < W && y < H;
    const I = (x, y) => (y + OY) * W + x + OX;
    const get = (x, y) => (inb(x + OX, y + OY) ? g[I(x, y)] : null);
    const zat = (x, y) => (inb(x + OX, y + OY) ? zone[I(x, y)] : null);
    const set = (x, y, c, z) => { if (!inb(x + OX, y + OY) || !c) return; g[I(x, y)] = c; if (z !== undefined) zone[I(x, y)] = z; };
    const stamp = (x0, y0, rows, pal, z = 'item') => rows.forEach((row, j) => [...row].forEach((ch, i) => { if (pal[ch]) set(x0 + i, y0 + j, pal[ch], z); }));

    // Pieza: forma + sombreado (luz arriba-izquierda) + textura + línea donde pisa algo que ya estaba
    const part = (test, box, R, z, o = {}) => {
      const M = new Set(), k = (x, y) => (x + 50) * 200 + y + 50, seed = Math.floor(hash(box[0], box[1], 77) * 1000);
      for (let y = box[1]; y <= box[3]; y++) for (let x = box[0]; x <= box[2]; x++) if (test(x, y)) M.add(k(x, y));
      const has = (x, y) => M.has(k(x, y));
      const run = (x, y, dx, dy) => { let n = 0; while (n < 30 && has(x + dx * (n + 1), y + dy * (n + 1))) n++; return n; };
      const out = [];
      M.forEach(s => {
        const x = Math.floor(s / 200) - 50, y = (s % 200) - 50;
        const l = run(x, y, -1, 0), r = run(x, y, 1, 0), t = run(x, y, 0, -1), d = run(x, y, 0, 1), w = l + r + 1, h = t + d + 1;
        const rx = w > 1 ? l / (w - 1) : 0.5, ry = h > 1 ? t / (h - 1) : 0.5;
        let i = rx < 0.22 ? (ry < 0.55 ? 0 : 1) : rx < 0.58 ? 1 : rx < 0.84 ? 2 : 3;
        if (w <= 2) i = rx < 0.5 ? 1 : 2;
        if (d === 0) i += 1;
        if (o.tex) i = o.tex(x, y, i);
        const n = o.noise ?? 0.18;
        const hv = hash(x, y, seed);
        if (hv < n / 2) i -= 1; else if (hv > 1 - n / 2) i += 1;
        i = Math.max(0, Math.min(4, i));
        let c = (o.rampAt && o.rampAt(x, y) || R).t[i];
        if (o.line !== false && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => !has(x + dx, y + dy) && get(x + dx, y + dy) && zat(x + dx, y + dy) !== 'shadow')) c = (o.rampAt && o.rampAt(x, y) || R).ln;
        out.push([x, y, c]);
      });
      out.forEach(([x, y, c]) => set(x, y, c, z));
    };

    const skin = ramp(L.skin || '#F1C8A5'), hairR = ramp(L.hair || '#1E1A1A');
    const S = skin.t;
    const style = L.hairStyle || 'corto', top = L.top || 'sudadera', bottom = L.bottom || 'cargo';
    const tR = ramp(L.topColor || '#EDE6DA'), t2R = ramp(L.top2 || '#26201E'), pR = ramp(L.bottomColor || '#2C2522');
    const shoeR = ramp(L.shoes === 'neon' ? '#3FE0A0' : L.shoes === 'doradas' ? '#E8B84A' : (L.shoesColor || '#EDE6DA'));
    const soleR = ramp(L.shoes === 'neon' ? '#F2549A' : L.shoes === 'botas' ? '#2A2024' : '#F2EEE8');
    const bareLegs = bottom === 'falda' || bottom === 'corto';
    const legR = L.legs && L.legs !== 'piel' ? ramp(L.legsColor || '#1E1A1A') : skin;
    const hatOn = ['gorra', 'gorro', 'bucket'].includes(L.head);
    const longHair = style === 'largo' || style === 'melena';
    const strands = (x, y, i) => i + (((x * 2 + Math.floor(y / 3)) % 5 === 0) ? 1 : 0);

    // ---------- Detrás de todo
    if (L.bag === 'alas') {
      const W1 = ramp('#F4F0FA');
      [-1, 1].forEach(side => {
        const fx = x => (side < 0 ? x : 30 - x);
        [[3, 18, 5.5, 3.2], [4, 22.5, 5, 2.8], [5.5, 26.5, 4, 2.4]].forEach(e => part((x, y) => ell(...e)(fx(x), y) && fx(x) <= 9, [-6, 13, 36, 30], W1, 'wing', { noise: 0.05 }));
        part((x, y) => { const X = fx(x); return X >= -2 && X <= 2 && y >= 13 && y <= 16 && y >= 16 - (X + 2); }, [-6, 12, 36, 17], W1, 'wing', { noise: 0 });
      });
    }
    if (longHair) {
      const yb = style === 'largo' ? 33 : 23;
      const edge = y => Math.round(Math.sin(y * 0.9) * 0.8);
      part((x, y) => (y >= 7 && y <= yb && x >= 4 + edge(y) && x <= 26 - edge(y + 2) && !(y >= yb - 1 && (x <= 5 || x >= 25)) && !(y === yb && (x % 3 === 0))) || ell(15, 8.5, 10, 7)(x, y),
        [2, 0, 28, yb], hairR, 'hairB', { tex: strands, noise: 0.1 });
    }
    if (style === 'coletas') {
      part(ell(3.5, 16, 3.4, 6.5), [-1, 9, 8, 23], hairR, 'hairB', { tex: strands });
      part(ell(26.5, 16, 3.4, 6.5), [22, 9, 31, 23], hairR, 'hairB', { tex: strands });
    }
    if (top === 'sudadera') part((x, y) => y >= 18 && y <= 21 && x >= 10 && x <= 20, [10, 18, 20, 21], tR, 'hood', { tex: (x, y, i) => i + 2, noise: 0.1 });

    // ---------- Piernas, pantalón y zapatos
    if (bareLegs) {
      [[10, 13], [17, 20]].forEach(([a, b]) => part((x, y) => x >= a && x <= b && y >= 33 && y <= 43, [a, 33, b, 43], legR, 'leg', { noise: 0 }));
      [[9, 13], [17, 21]].forEach(([a, b]) => part((x, y) => (y === 44 && x >= a && x <= b) || (y === 45 && x >= a - 1 && x <= b) || (L.shoes === 'botas' && y >= 39 && y <= 43 && x >= a + 1 && x <= b - 1) || (L.shoes === 'altas' && y >= 42 && y <= 43 && x >= a + 1 && x <= b - 1),
        [a - 1, 39, b, 45], shoeR, 'shoe', { noise: 0.08, rampAt: (x, y) => (y === 45 ? soleR : null) }));
    } else {
      [[7, 13], [17, 23]].forEach(([a, b]) => part((x, y) => (y === 44 && x >= a && x <= b) || (y === 45 && x >= a && x <= b), [a, 44, b, 45], shoeR, 'shoe', { noise: 0.08, rampAt: (x, y) => (y === 45 ? soleR : null) }));
    }
    if (bottom === 'falda') {
      part((x, y) => y >= 29 && y <= 35 && x >= 9 - (y > 31 ? 1 : 0) - (y > 33 ? 1 : 0) && x <= 21 + (y > 31 ? 1 : 0) + (y > 33 ? 1 : 0), [6, 29, 24, 35], pR, 'pants',
        { tex: (x, y, i) => i + (((x + (y > 32 ? 1 : 0)) % 3 === 0) ? 1 : 0), noise: 0.12 });
    } else if (bottom === 'corto') {
      part((x, y) => y >= 29 && y <= 34 && x >= 9 && x <= 21 && !(y >= 33 && x === 15), [9, 29, 21, 34], pR, 'pants', { noise: 0.15 });
    } else {
      const wide = bottom === 'cargo' ? 1 : 0;
      const legs = (x, y) => y >= 29 && y <= 44 && (
        (y <= 33 && x >= 9 && x <= 21) ||
        (y > 33 && x >= (y >= 39 ? 7 : 8) - wide && x <= 14) ||
        (y > 33 && x >= 16 && x <= (y >= 39 ? 23 : 22) + wide)) && !(y === 44 && (x === 15 || x === 11 || x === 19));
      const denim = bottom === 'vaqueros';
      part(legs, [5, 29, 25, 44], pR, 'pants', {
        noise: denim ? 0.42 : 0.2,
        tex: (x, y, i) => {
          if (y === 43) return 0;                       // dobladillo claro
          if (y === 44) return 3;
          if (x === 15 || x === 14 && y > 33) return i + 1; // costura del medio
          if (denim && hash(x >> 1, y >> 1, 12) > 0.72) return i - 1; // manchas de lavado
          return i;
        },
        rampAt: (x, y) => (bottom === 'chandal' && y > 31 && y < 43 && (x === (y >= 39 ? 7 : 8) || x === (y >= 39 ? 23 : 22)) ? ramp(L.stripe || '#EDE6DA') : null),
      });
      if (bottom === 'cargo') [[7, 36], [7, 37], [8, 36], [23, 36], [23, 37], [22, 36]].forEach(([x, y]) => set(x, y, pR.t[3], 'pants'));
    }

    // ---------- Parte de arriba (oversize)
    const torso = (x, y) => y >= 20 && y <= 30 && x >= (y === 20 ? 10 : 9) && x <= (y === 20 ? 20 : 21);
    let torsoR = tR, torsoTex = null;
    if (L.pattern === 'rayas') { const sR = ramp(L.stripe || '#26201E'); torsoTex = null; torsoR = null; part(torso, [9, 20, 21, 31], tR, 'top', { rampAt: (x, y) => (y % 2 === 0 && y > 21 ? sR : null), noise: 0.12 }); }
    else part(torso, [9, 20, 21, 30], tR, 'top', { noise: 0.12, tex: (x, y, i) => (y === 30 ? i + 1 : i) });
    if (L.pattern === 'galaxia') for (let y = 21; y <= 30; y++) for (let x = 9; x <= 21; x++) if (zat(x, y) === 'top') {
      if (hash(x >> 1, y >> 1, 4) > 0.68) set(x, y, mix(get(x, y), [120, 72, 196], 0.5));
      if (hash(x, y, 3) > 0.9) set(x, y, hash(x, y, 9) > 0.5 ? WHITE : [255, 196, 232]);
    }
    if (L.pattern === 'cuadros') { const sR = ramp(L.stripe || '#26201E'); for (let y = 21; y <= 31; y++) for (let x = 9; x <= 21; x++) if (zat(x, y) === 'top' && (x % 3 === 0 || y % 3 === 0)) set(x, y, mix(get(x, y), sR.t[1], 0.5)); }
    const open = top === 'chaqueta' || top === 'camisa';
    if (open) {
      part((x, y) => y >= 20 && y <= 30 && x >= 12 && x <= 18, [12, 20, 18, 30], t2R, 'inner', { noise: 0.2 });
      for (let y = 21; y <= 30; y++) { set(11, y, tR.t[0], 'top'); set(19, y, tR.t[3], 'top'); }
    }
    if (top === 'capas' || top === 'camiseta' || top === 'jersey') for (let x = 13; x <= 17; x++) set(x, 20, top === 'capas' ? t2R.t[2] : tR.t[3]);
    if (top === 'capas' || top === 'camiseta') { set(14, 20, S[3]); set(15, 20, S[3]); set(16, 20, S[3]); }
    if (top === 'sudadera') {
      for (let x = 11; x <= 19; x++) set(x, 26, tR.ln);
      for (let y = 27; y <= 28; y++) for (let x = 11; x <= 19; x++) set(x, y, tR.t[Math.min(4, (x > 16 ? 3 : 2) + (hash(x, y, 2) > 0.85 ? 1 : 0))]);
      [[13, 21], [13, 22], [13, 23], [17, 21], [17, 22]].forEach(([x, y]) => set(x, y, y === 23 ? tR.t[3] : WHITE));
    }
    if (top === 'jersey' || top === 'sudadera') for (let x = 9; x <= 21; x++) set(x, 30, x % 2 ? tR.t[3] : tR.t[4]);
    // mangas
    const sleeveR = top === 'capas' ? t2R : tR;
    const sEnd = top === 'camiseta' ? 24 : 29;
    const sleeve = side => (x, y) => { const X = side < 0 ? x : 30 - x; return y >= 21 && y <= sEnd && X >= 6 && X <= 8 && !(y === 21 && X < 8) && !(y === 22 && X < 7); };
    part(sleeve(-1), [6, 21, 8, sEnd], sleeveR, 'arm', { noise: 0.14 });
    part(sleeve(1), [22, 21, 24, sEnd], sleeveR, 'arm', { noise: 0.14 });
    if (top === 'camiseta') { part((x, y) => x >= 7 && x <= 8 && y >= 25 && y <= 29, [7, 25, 8, 29], skin, 'skin', { noise: 0.05 }); part((x, y) => x >= 22 && x <= 23 && y >= 25 && y <= 29, [22, 25, 23, 29], skin, 'skin', { noise: 0.05 }); }
    if (sEnd === 29) { [6, 7, 8].forEach(x => set(x, 29, sleeveR.t[3])); [22, 23, 24].forEach(x => set(x, 29, sleeveR.t[4])); }
    part((x, y) => x >= 6 && x <= 7 && y >= 30 && y <= 31, [6, 30, 7, 31], skin, 'hand', { noise: 0 });
    part((x, y) => x >= 23 && x <= 24 && y >= 30 && y <= 31, [23, 30, 24, 31], skin, 'hand', { noise: 0 });

    // ---------- Bolsos
    const bagR = ramp(L.bagColor || '#2A2420');
    if (L.bag === 'mochila') for (let y = 21; y <= 27; y++) { set(11, y, y === 21 ? bagR.t[0] : bagR.t[1]); set(19, y, bagR.t[3]); }
    if (L.bag === 'bolso') {
      for (let i = 0; i <= 8; i++) set(20 - i, 21 + i, bagR.t[1]);
      part((x, y) => x >= 7 && x <= 11 && y >= 28 && y <= 31, [7, 28, 11, 31], bagR, 'bag', { noise: 0.1 });
      set(9, 29, [222, 192, 122]);
    }

    // ---------- Cabeza (de frente) y cara simple
    part((x, y) => x >= 14 && x <= 16 && y >= 19 && y <= 20, [14, 19, 16, 20], skin, 'neck', { tex: () => 3, noise: 0 });
    const FACE = { 5: [10, 20], 6: [9, 21], 7: [8, 22], 8: [8, 22], 9: [8, 22], 10: [8, 22], 11: [8, 22], 12: [8, 22], 13: [8, 22], 14: [8, 22], 15: [8, 22], 16: [9, 21], 17: [10, 20], 18: [11, 19], 19: [13, 17] };
    part((x, y) => FACE[y] && x >= FACE[y][0] && x <= FACE[y][1], [8, 5, 22, 19], skin, 'face', { noise: 0, tex: (x, y, i) => (x >= 21 ? 2 : y >= 18 ? 2 : Math.min(i, 1)) });
    // orejas
    if (!longHair) { [[7, 12], [7, 13], [23, 12], [23, 13]].forEach(([x, y]) => set(x, y, x < 15 ? S[1] : S[2], 'face')); set(7, 13, S[2]); set(23, 13, S[3]); }
    const eyeR = ramp(L.eyes || '#2E1E18');
    const eye = (x, out) => {
      set(x, 12, INK); set(x + 1, 12, INK); set(out, 12, INK);
      set(x, 13, mix(eyeR.t[4], INK, 0.5)); set(x + 1, 13, mix(eyeR.t[4], INK, 0.5));
      set(x, 14, eyeR.t[3]); set(x + 1, 14, mix(eyeR.t[2], WHITE, 0.25));
    };
    if (mood === 'tired') { [[11, 10], [17, 19]].forEach(([x, o]) => { set(x, 13, INK); set(x + 1, 13, INK); set(o, 13, INK); }); }
    else { eye(11, 10); eye(17, 19); }
    // rubor y boca mínima
    const blushC = mix(S[1], [236, 120, 120], 0.45);
    if (L.blush !== false) { set(9, 15, blushC); set(10, 15, mix(blushC, S[1], 0.4)); set(20, 15, blushC); set(21, 15, mix(blushC, S[1], 0.4)); }
    const mouthC = mix(S[3], [190, 80, 80], 0.35);
    if (mood === 'happy') { set(14, 16, mouthC); set(15, 17, mouthC); set(16, 16, mouthC); }
    else if (mood === 'fire') { set(14, 16, mouthC); set(15, 16, WHITE); set(16, 16, mouthC); set(15, 17, mouthC); }
    else set(15, 17, mouthC);
    if (L.freckles) [[10, 14], [12, 15], [19, 15], [20, 14]].forEach(([x, y]) => set(x, y, S[3]));

    // ---------- Pelo delante
    let front;
    const cap = ell(15, 8.3, 9.8, 7);
    if (longHair) {
      // raya al medio, mechones que enmarcan la cara
      front = (x, y) => cap(x, y) && (y <= 5 + Math.floor(Math.abs(x - 15) * 0.55) || x <= 9 || x >= 21) ||
        ((x >= 5 && x <= 9 && y >= 8 && y <= (style === 'largo' ? 30 : 21) - (x === 9 ? 6 : 0)) || (x >= 21 && x <= 25 && y >= 8 && y <= (style === 'largo' ? 30 : 21) - (x === 21 ? 6 : 0)));
    } else if (style === 'rizos' || style === 'afro') {
      const R0 = style === 'afro' ? 11.5 : 10.3;
      front = (x, y) => { const a = Math.atan2(y - 8, x - 15), r = R0 * (1 + 0.09 * Math.sin(a * 10)); return Math.hypot(x - 15, (y - 8) * 1.15) <= r && (y <= 9 + ((x * 7) % 3 === 0 ? 1 : 0) || x <= 7 || x >= 23) && y <= 13; };
    } else {
      const fr = style === 'revuelto' ? [10, 9, 11, 9, 10, 8, 11, 9, 10, 9, 11, 8, 10, 9, 10, 9, 10] : [9, 9, 10, 10, 9, 8, 9, 10, 9, 8, 9, 10, 10, 9, 8, 9, 9];
      front = (x, y) => cap(x, y) && (y <= fr[Math.max(0, Math.min(16, x - 7))] || x <= 7 || x >= 23) && y <= 12;
      if (style === 'revuelto') { const b = front; const sp = [[8, 2], [10, 1], [13, 0], [14, 0], [17, 1], [20, 1], [22, 3], [6, 4]]; front = (x, y) => b(x, y) || sp.some(([a, c]) => a === x && y >= c && y <= 3); }
      if (style === 'rapado') front = (x, y) => ell(15, 8.3, 8.6, 6.4)(x, y) && y <= 6;
      if (style === 'cresta') front = (x, y) => (x >= 13 && x <= 17 && y >= -1 && y <= 6) || (ell(15, 8.3, 8.6, 6.4)(x, y) && y <= 5);
    }
    if (style === 'mono') part(ell(15, 1.5, 3.8, 3), [10, -2, 20, 5], hairR, 'hair', { tex: strands });
    part((x, y) => front(x, y) && (!hatOn || y >= 4), [2, -3, 28, 30], hairR, 'hair', { tex: strands, noise: style === 'rizos' || style === 'afro' ? 0.4 : 0.1 });
    // mechones sueltos
    if (longHair) [[3, 22], [2, 23], [2, 24], [27, 18], [28, 19], [27, 27]].forEach(([x, y]) => set(x, y, hairR.t[3], 'hair'));
    if (!hatOn && !['rapado', 'cresta'].includes(style)) [[11, 3], [12, 3], [13, 2], [10, 4]].forEach(([x, y]) => { if (zat(x, y) === 'hair') set(x, y, hairR.t[0]); });
    if (L.braids) [[5, 6], [24, 25]].forEach(([a, b]) => part((x, y) => x >= a && x <= b && y >= 13 && y <= 29, [a, 13, b, 29], hairR, 'hair', { tex: (x, y, i) => i + (y % 3 === 0 ? 2 : 0), noise: 0.1 }));
    if (L.earrings) { set(7, 14, [246, 210, 110]); set(23, 14, [246, 210, 110]); }

    // ---------- Gorros
    const hR = ramp(L.headColor || '#2A2420');
    if (L.head === 'gorra') {
      part((x, y) => ell(15, 7.4, 9.8, 5.8)(x, y) && y <= 7, [5, 1, 25, 7], hR, 'hat', { noise: 0.12 });
      part((x, y) => (y === 7 && x >= 4 && x <= 26) || (y === 8 && x >= 6 && x <= 24), [4, 7, 26, 8], hR, 'hat', { tex: (x, y, i) => i + 1, noise: 0.08 });
      set(15, 2, hR.t[0]);
    }
    if (L.head === 'gorro') {
      part((x, y) => ell(15, 8, 10, 6.6)(x, y) && y <= 6, [5, 0, 25, 6], hR, 'hat', { noise: 0.14 });
      part((x, y) => y >= 6 && y <= 8 && x >= 5 && x <= 25, [5, 6, 25, 8], hR, 'hat', { tex: (x, y, i) => i + (x % 2), noise: 0.06 });
    }
    if (L.head === 'bucket') {
      part((x, y) => ell(15, 7.4, 8.6, 5.4)(x, y) && y <= 7, [6, 1, 24, 7], hR, 'hat', { noise: 0.12 });
      part((x, y) => y >= 7 && y <= 8 && x >= 4 - (y - 7) && x <= 26 + (y - 7), [3, 7, 27, 8], hR, 'hat', { tex: (x, y, i) => i + 1 });
    }
    if (L.head === 'halo') { const gold = [255, 214, 96]; for (let x = 11; x <= 19; x++) { set(x, -3, x < 15 ? [255, 244, 186] : gold); set(x, -1, mul(gold, 0.74)); } set(10, -2, gold); set(20, -2, mul(gold, 0.85)); }

    // ---------- Gafas
    if (L.glasses === 'finas' || L.glasses === 'pasta') {
      const fc = L.glasses === 'pasta' ? INK : mix(INK, [130, 96, 70], 0.4);
      [[10, 13], [16, 19]].forEach(([a, b]) => { for (let x = a; x <= b; x++) { set(x, 11, fc); set(x, 15, fc); } for (let y = 12; y <= 14; y++) { set(a, y, fc); set(b, y, fc); } });
      set(14, 12, fc); set(15, 12, fc);
    }
    if (L.glasses === 'sol') {
      [[10, 13], [17, 20]].forEach(([a, b]) => { for (let x = a; x <= b; x++) for (let y = 12; y <= 14; y++) set(x, y, y === 14 ? [52, 40, 74] : INK); set(a + 1, 12, [150, 156, 196]); });
      for (let x = 14; x <= 16; x++) set(x, 12, INK);
    }

    // ---------- Objetos
    const has = n => items.includes(n);
    if (has('auriculares')) {
      const band = [64, 58, 74];
      for (let x = 7; x <= 23; x++) set(x, x <= 8 || x >= 22 ? 3 : 2, x < 12 ? mix(band, WHITE, 0.3) : band);
      part((x, y) => x >= 4 && x <= 6 && y >= 8 && y <= 12, [4, 8, 6, 12], ramp('#E8505F'), 'item', { noise: 0 });
      part((x, y) => x >= 24 && x <= 26 && y >= 8 && y <= 12, [24, 8, 26, 12], ramp('#E8505F'), 'item', { noise: 0 });
    }
    if (has('cafe')) stamp(24, 27, ['.ww.', 'wbbw', 'wwww', 'ssss', 'wwww', '.ww.'], { w: [248, 244, 236], b: [118, 74, 46], s: [196, 122, 72] });
    if (has('microfono')) stamp(5, 26, ['gg', 'GG', 'kk', '.k', '.k'], { g: [214, 214, 226], G: [138, 138, 156], k: [42, 38, 50] });
    if (has('llavero')) { set(21, 31, [246, 208, 100]); set(21, 32, [200, 152, 60]); set(22, 32, [120, 200, 240]); }
    if (has('skate')) { for (let y = 29; y <= 45; y++) { set(1, y, [44, 36, 36]); set(2, y, y >= 35 && y <= 39 ? [206, 74, 64] : [70, 60, 60]); set(3, y, [44, 36, 36]); } [[0, 31], [0, 43], [4, 31], [4, 43]].forEach(([x, y]) => set(x, y, [228, 226, 214])); }
    if (has('gatito')) stamp(26, 38, ['g...g...', 'gg.gg...', 'ggggg...', 'gegeg..g', 'ggpgg..g', '.ggggggg', '.gggggg.', '.g.g.gg.'], { g: [106, 106, 120], e: [140, 224, 120], p: [236, 150, 160] });
    if (has('perro')) stamp(25, 38, ['.bb.....', 'bbooo...', 'ooeoo..t', 'kooooo.t', '.oooooot', '..oooooo', '..oo.oo.', '..o...o.'], { o: [216, 158, 88], b: [150, 98, 52], e: [36, 28, 28], k: [36, 28, 28], t: [186, 128, 68] });

    // ---------- Contorno exterior oscuro y sombra en el suelo
    const filled = g.slice();
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (filled[y * W + x]) continue;
      const n = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => (inb(x + dx, y + dy) ? filled[(y + dy) * W + x + dx] : null)).filter(Boolean);
      if (n.length) g[y * W + x] = mix(mul(n[0], 0.25), INK, 0.7);
    }
    const shadow = [];
    for (let y = 44; y < H; y++) for (let x = 0; x < W; x++) if (ell(19, 50, 12, 1.8)(x, y) && !g[y * W + x]) shadow.push(y * W + x);

    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d'), im = ctx.createImageData(W, H);
    g.forEach((c, i) => { if (c) im.data.set([c[0], c[1], c[2], 255], i * 4); });
    shadow.forEach(i => im.data.set([70, 50, 40, 60], i * 4));
    ctx.putImageData(im, 0, 0);
    return cv;
  }
  window.Chibi = { W, H, canvas: draw, image: (look, opts) => draw(look, opts).toDataURL() };
})();
