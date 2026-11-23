// Prototipo: personajes chibi (cabeza grande, cuerpo corto). Mismo formato de "look" que character.js.
(function () {
  const W = 40, H = 44, OX = 4, OY = 2;
  const hex = h => { h = String(h || '#888888').replace('#', ''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); };
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const mul = (a, f) => a.map(v => Math.max(0, Math.min(255, Math.round(v * f))));
  const SUN = [255, 236, 190], COOL = [72, 58, 132], DEEP = [30, 20, 52], INK = [30, 22, 38], WHITE = [255, 252, 246];
  const ramp = c => {
    const b = typeof c === 'string' ? hex(c) : c;
    return { hi: mix(mix(b, WHITE, 0.25), SUN, 0.22), b, s1: mix(mul(b, 0.78), COOL, 0.2), s2: mix(mul(b, 0.56), DEEP, 0.38), ln: mix(mul(b, 0.4), DEEP, 0.5) };
  };
  const ell = (cx, cy, rx, ry) => (x, y) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
  const rect = (x0, y0, x1, y1) => (x, y) => x >= x0 && x <= x1 && y >= y0 && y <= y1;
  const any = (...fs) => (x, y) => fs.some(f => f(x, y));
  const hash = (x, y, s = 0) => { let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

  function draw(look, opts = {}) {
    const L = Object.assign({}, look), items = opts.items || L.items || [], mood = opts.mood || L.mood || 'idle';
    const g = new Array(W * H).fill(null), id = new Int16Array(W * H).fill(-1); let pid = 0;
    const inb = (x, y) => x >= 0 && y >= 0 && x < W && y < H;
    const get = (x, y) => { x += OX; y += OY; return inb(x, y) ? g[y * W + x] : null; };
    const idAt = (x, y) => { x += OX; y += OY; return inb(x, y) ? id[y * W + x] : -1; };
    const set = (x, y, c, p = -2) => { x += OX; y += OY; if (!inb(x, y) || !c) return; g[y * W + x] = c; id[y * W + x] = p; };

    // Dibuja una pieza: rellena la forma, la sombrea con luz arriba-izquierda y marca la línea donde pisa otra pieza
    const part = (test, box, col, o = {}) => {
      const p = pid++, base = o.ramp || ramp(col), M = new Set(), k = (x, y) => x * 100 + y;
      for (let y = box[1]; y <= box[3]; y++) for (let x = box[0]; x <= box[2]; x++) if (test(x, y)) M.add(k(x, y));
      const has = (x, y) => M.has(k(x, y));
      const run = (x, y, dx, dy) => { let n = 0; while (n < 30 && has(x + dx * (n + 1), y + dy * (n + 1))) n++; return n; };
      const out = [];
      M.forEach(s => {
        const x = Math.floor(s / 100), y = s % 100, R = o.rampAt ? (o.rampAt(x, y) || base) : base;
        const l = run(x, y, -1, 0), r = run(x, y, 1, 0), t = run(x, y, 0, -1), d = run(x, y, 0, 1), w = l + r + 1, h = t + d + 1;
        const rx = w > 1 ? l / (w - 1) : 0.5, ry = h > 1 ? t / (h - 1) : 0.5;
        let c = R.b;
        if (!o.flat) {
          if (rx > 0.72 || d === 0) c = R.s1;
          if ((rx > 0.9 && w > 3) || (d === 0 && rx > 0.6)) c = R.s2;
          if (rx < 0.3 && ry < 0.34 && w > 3 && h > 2) c = R.hi;
        }
        if (o.line !== false) {
          const edge = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => !has(x + dx, y + dy) && get(x + dx, y + dy) && idAt(x + dx, y + dy) !== -3);
          if (edge) c = R.ln;
        }
        out.push([x, y, c]);
      });
      out.forEach(([x, y, c]) => set(x, y, c, p));
      return p;
    };
    const stamp = (x0, y0, rows, pal) => rows.forEach((row, j) => [...row].forEach((ch, i) => { if (pal[ch]) set(x0 + i, y0 + j, pal[ch]); }));

    const skin = ramp(L.skin || '#F1C8A5'), hairR = ramp(L.hair || '#1E1A1A');
    const style = L.hairStyle || 'corto', top = L.top || 'sudadera', bottom = L.bottom || 'cargo';
    const topC = L.topColor || '#EDE6DA', top2 = L.top2 || '#26201E', botC = L.bottomColor || '#2C2522';
    const shoesC = L.shoes === 'neon' ? '#3FE0A0' : L.shoes === 'doradas' ? '#E8B84A' : (L.shoesColor || '#EDE6DA');
    const bareLegs = bottom === 'falda' || bottom === 'corto';

    // ---- Detrás de todo: alas, pelo largo, coletas, capucha
    if (L.bag === 'alas') {
      // tres plumas largas por ala, de arriba (la más grande) a abajo
      [[[3.5, 16, 6.5, 3], [-1, 12, 1, 14]], [[4.5, 20.5, 5.5, 2.6]], [[5.5, 24.5, 4.5, 2.4]]].forEach(([e, tip]) => {
        const fl = (x, y) => (ell(...e)(x, y) && x <= 10) || (tip && x >= tip[0] && x <= tip[2] && y >= tip[1] + (x - tip[0]) * 0 && y <= tip[3] && y >= 12 + (1 - x));
        part(fl, [-4, 10, 10, 28], '#F6F2FA');
        part((x, y) => fl(31 - x, y), [21, 10, 35, 28], '#F6F2FA');
      });
    }
    if (style === 'largo' || style === 'melena') {
      const bottomY = style === 'largo' ? 29 : 23;
      part((x, y) => ell(15.5, 11, 9.3, 7.5)(x, y) || (y >= 11 && y <= bottomY && x >= 6 + (y > bottomY - 2 ? 1 : 0) && x <= 25 - (y > bottomY - 2 ? 1 : 0)), [5, 3, 26, bottomY], null, { ramp: hairR });
    }
    if (style === 'coletas') {
      part(ell(4.5, 14, 3.4, 6), [0, 7, 9, 21], null, { ramp: hairR });
      part(ell(26.5, 14, 3.4, 6), [22, 7, 31, 21], null, { ramp: hairR });
    }
    if (top === 'sudadera') part(rect(10, 18, 21, 21), [10, 18, 21, 21], topC, { ramp: { ...ramp(topC), b: ramp(topC).s1, hi: ramp(topC).s1 } });

    // ---- Piernas y zapatos
    const legR = bareLegs ? (L.legs && L.legs !== 'piel' ? ramp(L.legsColor || '#1E1A1A') : skin) : null;
    if (legR) { part(rect(12, 29, 14, 34), [12, 29, 14, 34], null, { ramp: legR }); part(rect(17, 29, 19, 34), [17, 29, 19, 34], null, { ramp: legR }); }
    const shoeTop = L.shoes === 'botas' ? 31 : L.shoes === 'altas' ? 32 : 34;
    const soleC = L.shoes === 'neon' ? ramp('#F2549A') : ramp('#F4F0EA');
    const shoe = (x0, x1) => (x, y) => (y >= shoeTop && y <= 35 && x >= x0 + 1 && x <= x1) || (y === 35 && x >= x0 && x <= x1) || (y === 36 && x >= x0 && x <= x1);
    [[9, 14], [16, 21]].forEach(([a, b]) => part(shoe(a, b), [a, shoeTop, b, 36], shoesC, { rampAt: (x, y) => (y === 36 ? soleC : null) }));
    if (L.shoes === 'botas') { set(13, 32, ramp(shoesC).hi); set(19, 32, ramp(shoesC).hi); }

    // ---- Pantalón / falda
    const pR = ramp(botC);
    if (bottom === 'falda') {
      part((x, y) => y >= 27 && y <= 31 && x >= 11 - (y - 27 > 1 ? 1 : 0) && x <= 20 + (y - 27 > 1 ? 1 : 0), [9, 27, 22, 31], botC,
        { rampAt: (x, y) => (y >= 29 && (x % 2 === 0) ? { ...pR, b: pR.s1 } : null) });
    } else if (bottom === 'corto') {
      part((x, y) => y >= 27 && y <= 30 && x >= 11 && x <= 20 && !(y >= 30 && x >= 15 && x <= 16), [11, 27, 20, 30], botC);
    } else {
      const wide = bottom === 'cargo';
      const legs = (x, y) => y >= 27 && y <= (shoeTop - 1) && ((x >= (wide ? 10 : 11) && x <= 14) || (x >= 17 && x <= (wide ? 21 : 20)) || (y <= 29 && x >= 11 && x <= 20));
      const pp = part(legs, [9, 27, 22, 35], botC, {
        rampAt: (x, y) => (bottom === 'chandal' && (x === 11 || x === 20) ? ramp(L.stripe || '#EDE6DA') : null),
      });
      if (wide) { [[10, 31], [11, 31], [20, 31], [21, 31], [10, 32], [21, 32]].forEach(([x, y]) => set(x, y, pR.s1, pp)); set(10, 30, pR.ln, pp); set(21, 30, pR.ln, pp); }
      if (bottom === 'vaqueros') { for (let y = 30; y < shoeTop; y++) { set(13, y, pR.hi, pp); set(18, y, mix(pR.b, pR.hi, 0.5), pp); } set(12, 28, pR.ln, pp); set(19, 28, pR.ln, pp); }
      if (wide) for (let y = shoeTop - 2; y < shoeTop; y++) { set(11 + (y % 2), y, pR.s1, pp); set(18 + (y % 2), y, pR.s1, pp); }
    }

    // ---- Torso y brazos
    const tR = ramp(topC), t2R = ramp(top2);
    const torso = (x, y) => (y === 20 && x >= 12 && x <= 19) || (y === 21 && x >= 11 && x <= 20) || (y >= 22 && y <= 28 && x >= 10 && x <= 21);
    let torsoAt = null;
    if (L.pattern === 'rayas') { const sR = ramp(L.stripe || '#26201E'); torsoAt = (x, y) => (y % 2 === 0 ? sR : null); }
    if (L.pattern === 'galaxia') { const pu = ramp('#5B3FA0'); torsoAt = (x, y) => (hash(Math.floor(x / 3), Math.floor(y / 3), 7) > 0.68 ? pu : null); }
    if (L.pattern === 'cuadros') { const sR = ramp(L.stripe || '#26201E'); torsoAt = (x, y) => ((x % 3 === 0) || (y % 3 === 0) ? { ...tR, b: mix(tR.b, sR.b, 0.5) } : null); }
    const bodyC = top === 'capas' ? topC : topC;
    const tp = part(torso, [10, 20, 21, 28], bodyC, { rampAt: torsoAt });
    if (L.pattern === 'galaxia') for (let y = 21; y <= 27; y++) for (let x = 11; x <= 20; x++) if (idAt(x, y) === tp && hash(x, y, 3) > 0.9) set(x, y, hash(x, y, 9) > 0.5 ? WHITE : [255, 190, 230], tp);
    if (top === 'sudadera') {
      for (let x = 12; x <= 19; x++) set(x, 25, tR.ln, tp);
      for (let x = 12; x <= 19; x++) set(x, 26, tR.s1, tp);
      set(14, 21, tR.hi, tp); set(14, 22, tR.hi, tp); set(17, 21, tR.hi, tp); set(17, 22, tR.hi, tp);
    }
    if (top === 'chaqueta' || top === 'camisa') {
      part(rect(14, 20, 17, 28), [14, 20, 17, 28], top2);
      for (let y = 22; y <= 28; y++) { set(13, y, tR.ln, tp); set(18, y, tR.ln, tp); }
      set(13, 20, tR.hi); set(12, 21, tR.hi); set(18, 20, tR.s1); set(19, 21, tR.s1);
      if (top === 'chaqueta') { set(11, 26, tR.ln, tp); set(12, 26, tR.ln, tp); set(19, 26, tR.ln, tp); set(20, 26, tR.ln, tp); }
    }
    if (top === 'jersey' || top === 'sudadera') for (let x = 10; x <= 21; x++) set(x, 28, x % 2 ? tR.s1 : tR.s2, tp);
    const sleeveR = top === 'capas' ? t2R : tR;
    const sleeveEnd = top === 'camiseta' ? 23 : 26;
    const arm = x0 => (x, y) => x >= x0 && x <= x0 + 1 && y >= 21 && y <= sleeveEnd && !(y === 21 && x === (x0 < 15 ? x0 : x0 + 1));
    part(arm(8), [8, 21, 9, 26], null, { ramp: sleeveR });
    part(arm(22), [22, 21, 23, 26], null, { ramp: sleeveR });
    if (top === 'camiseta') { part(rect(8, 24, 9, 26), [8, 24, 9, 26], null, { ramp: skin }); part(rect(22, 24, 23, 26), [22, 24, 23, 26], null, { ramp: skin }); }
    if (top === 'jersey' || top === 'sudadera') { set(8, 26, sleeveR.s1); set(9, 26, sleeveR.s1); set(22, 26, sleeveR.s2); set(23, 26, sleeveR.s2); }
    part(rect(8, 27, 9, 28), [8, 27, 9, 28], null, { ramp: skin });
    part(rect(22, 27, 23, 28), [22, 27, 23, 28], null, { ramp: skin });

    // ---- Bolsos
    const bagR = ramp(L.bagColor || '#2A2420');
    if (L.bag === 'mochila') { for (let y = 21; y <= 26; y++) { set(12, y, bagR.b); set(19, y, bagR.s1); } set(12, 25, bagR.hi); set(19, 25, bagR.b); }
    if (L.bag === 'bolso') {
      for (let i = 0; i <= 7; i++) set(20 - i, 21 + i, bagR.b);
      part(rect(9, 27, 12, 30), [9, 27, 12, 30], null, { ramp: bagR });
      set(10, 28, bagR.hi);
    }

    // ---- Cabeza
    part(rect(14, 19, 17, 20), [14, 19, 17, 20], null, { ramp: { ...skin, b: skin.s1, hi: skin.s1 } });
    const head = ell(15.5, 12.6, 7.6, 7.1);
    part(head, [7, 5, 24, 20], null, { ramp: skin });
    for (let x = 11; x <= 20; x++) if (get(x, 19)) set(x, 19, skin.s1);

    // Cara (mirando un poco a la izquierda)
    const eyeC = ramp(L.eyes || '#3A2A20');
    const eye = x => { set(x, 13, INK); set(x + 1, 13, INK); set(x, 14, eyeC.ln); set(x + 1, 14, WHITE); set(x, 15, eyeC.b); set(x + 1, 15, eyeC.ln); };
    if (mood === 'tired') { [11, 17].forEach(x => { set(x, 14, INK); set(x + 1, 14, INK); }); }
    else { eye(11); eye(17); }
    if (L.lashes || L.blush) { set(10, 13, INK); set(19, 13, INK); }
    const mouthC = mix(skin.ln, [180, 60, 70], 0.4);
    if (mood === 'happy') { set(13, 17, mouthC); set(14, 18, mouthC); set(15, 18, mouthC); set(16, 17, mouthC); }
    else if (mood === 'fire') { set(13, 17, mouthC); set(14, 17, WHITE); set(15, 17, WHITE); set(16, 17, mouthC); set(14, 18, mouthC); set(15, 18, mouthC); }
    else { set(14, 17, mouthC); set(15, 17, mouthC); }
    if (L.blush) { set(10, 16, [240, 140, 140]); set(19, 16, [240, 140, 140]); }
    if (L.freckles) { set(11, 17, skin.s1); set(13, 16, skin.s1); set(18, 17, skin.s1); }

    // ---- Pelo delante
    const bang = x => [11, 10, 11, 12, 11, 10, 11, 12, 11, 10, 12, 11, 10, 11, 12, 11, 10, 11][(x + 2) % 18];
    let capT = (x, y) => ell(15.5, 11, 8.7, 6.9)(x, y) && y <= bang(x);
    let sides = (x, y) => (x >= 7 && x <= 8 && y >= 9 && y <= 15) || (x >= 23 && x <= 24 && y >= 9 && y <= 16);
    if (style === 'revuelto' && (!L.head || L.head === 'no' || L.head === 'halo')) {
      const sp = [[10, 4], [11, 3], [14, 3], [15, 2], [18, 3], [19, 3], [21, 4], [8, 6]];
      const base = capT; capT = (x, y) => base(x, y) || sp.some(([a, b]) => a === x && y >= b && y <= 6) || (y === 12 && (x === 12 || x === 19)) || (y === 13 && x === 12);
    }
    if (style === 'rizos' || style === 'afro') {
      const R0 = style === 'afro' ? 10.5 : 9.3;
      capT = (x, y) => { const a = Math.atan2(y - 10.5, x - 15.5), r = R0 * (1 + 0.07 * Math.sin(a * 8)); return Math.hypot((x - 15.5), (y - 10.5) * 1.15) <= r && (y <= bang(x) || x <= 8 || x >= 23); };
      sides = (x, y) => (x >= 6 && x <= 8 && y >= 8 && y <= 17) || (x >= 23 && x <= 25 && y >= 8 && y <= 17);
    }
    if (style === 'rapado') { capT = (x, y) => ell(15.5, 11, 8.1, 6.5)(x, y) && y <= 8; sides = () => false; }
    if (style === 'cresta') { capT = (x, y) => (x >= 14 && x <= 17 && y >= 1 && y <= 8) || (ell(15.5, 11, 8.1, 6.5)(x, y) && y <= 7); sides = () => false; }
    if (style === 'largo' || style === 'melena') { const s = style === 'largo' ? 26 : 21; sides = (x, y) => (x >= 7 && x <= 9 && y >= 9 && y <= s) || (x >= 22 && x <= 24 && y >= 9 && y <= s); }
    if (style === 'mono') part(ell(15.5, 3.6, 3.4, 3), [11, 0, 20, 7], null, { ramp: hairR });
    const hatOn = ['gorra', 'gorro', 'bucket'].includes(L.head);
    const hp = part((x, y) => any(capT, sides)(x, y) && (!hatOn || y >= 6), [4, 0, 27, 27], null, { ramp: hairR });
    // mechones: rayitas de brillo en el pelo
    [[11, 7], [12, 6], [13, 7], [18, 6]].forEach(([x, y]) => { if (idAt(x, y) === hp) set(x, y, hairR.hi, hp); });
    if (style === 'rizos' || style === 'afro') for (let y = 3; y <= 17; y++) for (let x = 5; x <= 26; x++) if (idAt(x, y) === hp && hash(x, y, 5) > 0.82) set(x, y, hairR.s1, hp);
    if (L.braids) [[6, 7], [24, 25]].forEach(([a, b]) => part((x, y) => x >= a && x <= b && y >= 15 && y <= 26, [a, 15, b, 26], null,
      { ramp: hairR, rampAt: (x, y) => ((y % 3) === 0 ? { ...hairR, b: hairR.s1, hi: hairR.s1 } : null) }));
    if (L.earrings) { set(7, 17, [240, 200, 90]); }

    // ---- Gorros
    const hc = L.headColor || '#2A2420', hR = ramp(hc);
    if (L.head === 'gorra') {
      part((x, y) => ell(15.5, 9.4, 8.9, 5.6)(x, y) && y <= 9, [6, 3, 25, 9], hc);
      part((x, y) => y >= 9 && y <= 10 && x >= 4 && x <= 17 - (y === 10 ? 1 : 0), [4, 9, 17, 10], null, { ramp: { ...hR, b: hR.s1, hi: hR.b } });
      set(15, 3, hR.hi);
    }
    if (L.head === 'gorro') {
      part((x, y) => ell(15.5, 9.8, 9.1, 6.4)(x, y) && y <= 9, [6, 2, 25, 9], hc);
      part((x, y) => y >= 8 && y <= 10 && x >= 7 && x <= 24, [7, 8, 24, 10], null, { ramp: hR, rampAt: (x, y) => (x % 2 ? { ...hR, b: hR.s1, hi: hR.s1 } : null) });
    }
    if (L.head === 'bucket') {
      part((x, y) => ell(15.5, 9.4, 8.2, 5.4)(x, y) && y <= 9, [7, 3, 24, 9], hc);
      part((x, y) => y >= 9 && y <= 10 && x >= 5 && x <= 26, [5, 9, 26, 10], hc);
    }
    if (L.head === 'halo') { const gold = [255, 214, 92]; for (let x = 12; x <= 19; x++) { set(x, -2, x < 16 ? [255, 240, 170] : gold); set(x, 0, mul(gold, 0.78)); } set(11, -1, gold); set(20, -1, mul(gold, 0.85)); }

    // ---- Gafas
    if (L.glasses === 'finas' || L.glasses === 'pasta') {
      const fc = L.glasses === 'pasta' ? INK : mix(INK, [120, 90, 70], 0.4);
      [10, 16].forEach(x0 => { for (let x = x0; x <= x0 + 3; x++) { set(x, 12, fc); set(x, 16, fc); } for (let y = 13; y <= 15; y++) { set(x0, y, fc); set(x0 + 3, y, fc); } });
      set(14, 13, fc); set(15, 13, fc);
    }
    if (L.glasses === 'sol') {
      [10, 16].forEach(x0 => { for (let x = x0; x <= x0 + 3; x++) for (let y = 13; y <= 15; y++) set(x, y, y === 15 ? [40, 30, 60] : INK); set(x0 + 1, 13, [120, 130, 170]); });
      set(14, 13, INK); set(15, 13, INK);
    }

    // ---- Objetos
    const has = n => items.includes(n);
    if (has('auriculares')) {
      for (let x = 9; x <= 22; x++) set(x, x <= 10 || x >= 21 ? 5 : 4, [60, 56, 70]);
      set(8, 6, [60, 56, 70]); set(23, 6, [60, 56, 70]);
      part(rect(6, 10, 8, 14), [6, 10, 8, 14], '#E84A5F'); part(rect(23, 10, 25, 14), [23, 10, 25, 14], '#E84A5F');
    }
    if (has('cafe')) stamp(23, 24, ['www', 'bbb', 'www', 'sws'], { w: [250, 246, 238], b: [120, 76, 48], s: [210, 200, 190] });
    if (has('microfono')) stamp(7, 23, ['gg', 'GG', '.k', '.k'], { g: [200, 200, 210], G: [140, 140, 155], k: [40, 36, 48] });
    if (has('llavero')) { set(19, 29, [240, 200, 80]); set(19, 30, [200, 160, 50]); }
    if (has('skate')) { for (let y = 22; y <= 35; y++) { set(4, y, [40, 34, 34]); set(5, y, y >= 27 && y <= 30 ? [200, 70, 60] : [60, 52, 52]); } set(3, 24, [220, 220, 210]); set(3, 33, [220, 220, 210]); }
    if (has('gatito')) stamp(26, 31, ['k...k.', 'kk.kk.', 'kkkkk.', 'kgkgk.', 'kkkkkk', '.kkkkk', '.k.k.k'], { k: [96, 96, 110], g: [130, 220, 120] });
    if (has('perro')) stamp(25, 30, ['.bb.....', 'boooo...', 'nkooo..t', '.ooooooo', '..oooooo', '..o.o..o'], { o: [212, 150, 80], b: [150, 96, 50], k: [40, 30, 30], n: [40, 30, 30], t: [190, 130, 70] });

    // ---- Contorno exterior oscuro
    const filled = g.slice();
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (filled[y * W + x]) continue;
      const n = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([dx, dy]) => (inb(x + dx, y + dy) ? filled[(y + dy) * W + x + dx] : null)).filter(Boolean);
      if (n.length) { const c = n[0]; g[y * W + x] = mix(mul(c, 0.25), INK, 0.7); }
    }
    // ---- Sombra en el suelo
    const shadow = [];
    for (let y = 36; y <= 40; y++) for (let x = 5; x <= 34; x++) if (ell(19.5, 38.4, 11, 1.9)(x, y) && !g[y * W + x]) shadow.push(y * W + x);

    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d'), im = ctx.createImageData(W, H);
    g.forEach((c, i) => { if (c) { im.data.set([c[0], c[1], c[2], 255], i * 4); } });
    shadow.forEach(i => im.data.set([40, 24, 30, 70], i * 4));
    ctx.putImageData(im, 0, 0);
    return cv;
  }
  window.Chibi = { W, H, canvas: draw, image: (look, opts) => draw(look, opts).toDataURL() };
})();
