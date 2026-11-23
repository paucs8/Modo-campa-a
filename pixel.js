// Personajes por piezas: sprites de índices (sacados de las referencias de IA y limpiados)
// que se pintan con rampas de color exactas. Cada pieza lleva su propio contorno.
(function () {
  const S = window.PIXEL_SPRITES || {};
  const W = (S._meta || {}).w || 40, H = (S._meta || {}).h || 72;
  const hex = h => { h = String(h || '#888888').replace('#', ''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); };
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const mul = (a, f) => a.map(v => Math.max(0, Math.min(255, Math.round(v * f))));
  const SUN = [255, 240, 205], COOL = [72, 62, 132], DEEP = [34, 22, 40], WHITE = [255, 252, 248];
  // rampa: 1 luz, 2 base, 3 sombra, 4 sombra fuerte, o contorno
  const ramp = c => {
    const b = typeof c === 'string' ? hex(c) : c;
    const s1 = mix(mul(b, 0.76), COOL, 0.18);
    return { 1: mix(mix(b, WHITE, 0.28), SUN, 0.2), 2: b, 3: s1, 4: mix(mul(b, 0.54), DEEP, 0.36), o: mix(mul(b, 0.32), DEEP, 0.62) };
  };
  const ORDER = ['base', 'shoes', 'bottom', 'top', 'hands', 'hair', 'glasses', 'hat'];
  const GLASS = { 1: [230, 232, 240], 2: [180, 184, 200], 3: [120, 124, 150], 4: [70, 72, 96], o: [26, 22, 30] };

  function draw(look, opts = {}) {
    const L = look || {};
    const skin = ramp(L.skin || '#F4D2B4');
    const skinMap = { s: skin[1], p: skin[2], q: skin[3], r: skin[4], O: skin.o, k: mix(skin[2], [238, 120, 120], 0.45) };
    const under = ramp('#D9D6D2');
    const layers = [];
    layers.push(['base', S.base, { u: under[2], v: under[3], w: under[4], o: skin.o, a: [70, 40, 34], E: WHITE }, skin]);
    const add = (slot, name, color, accent) => {
      const sp = S[slot + '_' + name]; if (!sp) return;
      const R = slot === 'glasses' ? GLASS : ramp(color || '#EDE6DA');
      const A = ramp(accent || '#26201E');
      layers.push([slot, sp, { a: A[3], 1: R[1], 2: R[2], 3: R[3], 4: R[4], o: R.o }, R]);
    };
    if (L.shoes) add('shoes', L.shoes, L.shoes === 'doradas' ? '#E8B84A' : L.shoes === 'neon' ? '#3FE0A0' : L.shoesColor);
    if (L.bottom) add('bottom', L.bottom, L.bottomColor, L.legsColor);
    if (L.top) add('top', L.top, L.topColor, L.top2);
    if (S.hands) layers.push(['hands', S.hands, { o: skin.o }, skin]);
    if (L.hairStyle) add('hair', L.hairStyle, L.hair);
    if (L.glasses && L.glasses !== 'no') add('glasses', L.glasses);
    if (L.head && L.head !== 'no') add('hat', L.head, L.head === 'halo' ? '#FFD45C' : L.head === 'corona' ? '#E8B84A' : L.headColor);

    const g = new Array(W * H).fill(null);
    layers.forEach(([slot, sp, pal]) => {
      sp.rows.forEach((row, j) => {
        for (let i = 0; i < row.length; i++) {
          const ch = row[i]; if (ch === '.') continue;
          const c = pal[ch] || skinMap[ch]; if (!c) continue;
          const x = sp.x + i, y = sp.y + j;
          if (x >= 0 && x < W && y >= 0 && y < H) g[y * W + x] = c;
        }
      });
    });
    // alturas: se repiten o quitan filas del torso y las piernas
    let rows = [...Array(H).keys()];
    const hgt = L.height || opts.height || 'medio';
    const R = f => Math.round(f * H / 72);
    const cut = [R(42), R(44), R(56), R(58), R(62)].filter((v, i, a) => a.indexOf(v) === i);
    if (hgt === 'bajo') rows = rows.filter(r => !cut.includes(r));
    if (hgt === 'alto') rows = [...rows, ...cut].sort((a, b) => a - b);
    const outH = H + cut.length, off = outH - rows.length;
    const cv = document.createElement('canvas'); cv.width = W; cv.height = outH;
    const ctx = cv.getContext('2d'), im = ctx.createImageData(W, outH);
    rows.forEach((r, k) => { for (let x = 0; x < W; x++) { const c = g[r * W + x]; if (c) im.data.set([c[0], c[1], c[2], 255], ((k + off) * W + x) * 4); } });
    ctx.putImageData(im, 0, 0);
    return cv;
  }
  window.PixelChar = { W, H: H + 5, canvas: draw, image: (l, o) => draw(l, o).toDataURL() };
})();
