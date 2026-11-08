/* Fondo de la plaza y corona, en pixel art, dibujados una vez en el navegador. */
(function () {
'use strict';
const cache = {};
function canvas(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; draw(g); return c.toDataURL('image/png'); }
const R = (g, x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };

/** Plaza de 200×100 px: cielo, edificios, árboles, banco y suelo de baldosas. */
function plaza() {
  if (cache.plaza) return cache.plaza;
  return (cache.plaza = canvas(200, 100, g => {
    R(g, 0, 0, 200, 100, '#9FC3FF');
    R(g, 0, 40, 200, 30, '#B7D2FF');
    // sol y nubes
    R(g, 168, 10, 12, 12, '#FFD66B'); R(g, 166, 12, 16, 8, '#FFD66B'); R(g, 170, 8, 8, 16, '#FFD66B');
    for (const [x, y] of [[20, 12], [92, 7], [130, 18]]) { R(g, x, y + 3, 26, 6, '#FFFFFF'); R(g, x + 5, y, 14, 4, '#FFFFFF'); R(g, x + 2, y + 9, 22, 1, '#E3ECFF'); }
    // edificios
    const blocks = [[0, 30, 26, '#E9B87C'], [26, 22, 22, '#D98E6A'], [48, 36, 30, '#C7B5FF'], [78, 26, 24, '#F0D9A8'], [102, 18, 28, '#8FB7A0'], [130, 32, 22, '#E5A3B8'], [152, 24, 26, '#D9C2A0'], [178, 34, 22, '#A6B8E8']];
    for (const [x, top, w, col] of blocks) {
      R(g, x, top, w, 70 - top, col); R(g, x, top, w, 2, 'rgba(0,0,0,.18)');
      for (let wy = top + 5; wy < 62; wy += 7) for (let wx = x + 3; wx < x + w - 4; wx += 6) { R(g, wx, wy, 3, 4, '#3D4A6B'); R(g, wx, wy, 3, 1, '#7D8BB0'); }
    }
    // árboles
    for (const x of [14, 104, 186]) { R(g, x, 52, 3, 18, '#7A4E32'); R(g, x - 7, 40, 17, 14, '#4E9A4A'); R(g, x - 5, 36, 13, 6, '#5DB257'); R(g, x - 4, 42, 4, 3, '#7FCB72'); }
    // suelo
    R(g, 0, 70, 200, 30, '#D8D2C8');
    for (let y = 72; y < 100; y += 6) for (let x = (y / 6) % 2 ? 0 : 6; x < 200; x += 12) R(g, x, y, 11, 1, '#C4BDB1');
    R(g, 0, 70, 200, 2, '#B8B0A3');
    // banco
    R(g, 150, 64, 30, 3, '#9C6B42'); R(g, 150, 58, 30, 2, '#9C6B42'); R(g, 152, 67, 2, 6, '#3A3A40'); R(g, 176, 67, 2, 6, '#3A3A40');
  }));
}
/** Corona dorada de 12×8 px para quien va primero. */
function crown() {
  if (cache.crown) return cache.crown;
  return (cache.crown = canvas(13, 9, g => {
    R(g, 0, 0, 13, 9, 'rgba(0,0,0,0)');
    const K = '#111111', Y = '#FFC53D', D = '#C98A00', L = '#FFE69A';
    for (const [x, y] of [[0, 1], [6, 0], [12, 1]]) { R(g, x, y, 1, 1, K); }
    R(g, 1, 2, 11, 6, K); R(g, 2, 3, 9, 4, Y); R(g, 1, 1, 1, 2, Y); R(g, 6, 1, 1, 2, Y); R(g, 11, 1, 1, 2, Y);
    R(g, 2, 6, 9, 1, D); R(g, 3, 4, 1, 1, L); R(g, 6, 4, 1, 1, '#E5483C'); R(g, 9, 4, 1, 1, L); R(g, 1, 8, 11, 1, K);
  }));
}
window.Scene = { plaza, crown };
})();
