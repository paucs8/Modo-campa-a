/* Fondo de la plaza y corona, en pixel art, dibujados una vez en el navegador. */
(function () {
'use strict';
const cache = {};
function canvas(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; draw(g); return c.toDataURL('image/png'); }
const R = (g, x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };

/** Plaza de 240×200 px: cielo, edificios con balcones y tiendas, árboles, farolas, rampa, banco y suelo de panot. */
function plaza() {
  if (cache.plaza) return cache.plaza;
  return (cache.plaza = canvas(240, 200, g => {
    const GROUND = 124;
    // Cielo por bandas
    R(g, 0, 0, 240, 30, '#86BFFF'); R(g, 0, 30, 240, 28, '#9CCBFF'); R(g, 0, 58, 240, 40, '#B4D8FF');
    // Sol con halo
    R(g, 196, 12, 20, 20, '#FFF1B8'); R(g, 199, 9, 14, 26, '#FFF1B8'); R(g, 193, 15, 26, 14, '#FFF1B8');
    R(g, 199, 14, 14, 16, '#FFD45E'); R(g, 201, 12, 10, 20, '#FFD45E'); R(g, 197, 16, 18, 12, '#FFD45E'); R(g, 201, 15, 4, 3, '#FFF1B8');
    // Nubes con sombra
    for (const [x, y, w] of [[14, 14, 34], [84, 8, 28], [140, 26, 38]]) {
      R(g, x, y + 4, w, 8, '#FFFFFF'); R(g, x + 6, y, w - 14, 6, '#FFFFFF'); R(g, x + w / 2, y - 3, w / 3, 5, '#FFFFFF');
      R(g, x + 2, y + 11, w - 4, 2, '#DCE9FF');
    }
    // Ciudad al fondo
    for (const [x, top, w] of [[0, 62, 22], [20, 54, 16], [36, 66, 24], [60, 50, 14], [74, 60, 30], [104, 56, 18], [122, 64, 26], [148, 52, 16], [164, 60, 30], [194, 58, 18], [212, 64, 28]]) {
      R(g, x, top, w, 70 - top + 20, '#A9BEE0');
      for (let wy = top + 4; wy < 86; wy += 5) for (let wx = x + 2; wx < x + w - 2; wx += 4) R(g, wx, wy, 2, 2, '#C4D4EE');
    }
    // Edificios con balcones, persianas y tiendas
    const B = [
      { x: 0, w: 46, top: 40, wall: '#EBC48E', shade: '#D6A96F', awn: ['#C0392B', '#F4ECDF'], sign: '#2D5BD7' },
      { x: 46, w: 40, top: 30, wall: '#DD957A', shade: '#C47A60', awn: ['#2F7A4B', '#F4ECDF'], sign: '#F2E3C4' },
      { x: 86, w: 50, top: 44, wall: '#C9B8F0', shade: '#AE9BDD', awn: ['#1F3A6B', '#F4ECDF'], sign: '#E07A2E' },
      { x: 136, w: 42, top: 26, wall: '#F2DDAE', shade: '#DCC28C', awn: ['#E07A2E', '#F4ECDF'], sign: '#3E7C3A' },
      { x: 178, w: 62, top: 38, wall: '#9CC7B0', shade: '#7FAE96', awn: ['#B03A6E', '#F4ECDF'], sign: '#F2F2F2' },
    ];
    for (const b of B) {
      R(g, b.x, b.top, b.w, GROUND - b.top, b.wall);
      R(g, b.x, b.top, b.w, 3, b.shade); R(g, b.x, b.top + 3, b.w, 1, '#00000022'); // cornisa
      R(g, b.x + b.w - 2, b.top, 2, GROUND - b.top, b.shade);                       // sombra lateral
      // pisos: ventanas con persiana verde y balcón
      for (let fy = b.top + 8; fy < 92; fy += 16) {
        for (let wx = b.x + 5; wx < b.x + b.w - 9; wx += 13) {
          R(g, wx - 1, fy - 1, 9, 12, b.shade);
          R(g, wx, fy, 7, 10, '#41557E'); R(g, wx + 1, fy + 1, 2, 4, '#7F9BC9');      // cristal con reflejo
          R(g, wx - 3, fy, 2, 10, '#3E7C5A'); R(g, wx + 8, fy, 2, 10, '#3E7C5A');   // persianas
          for (let k = 1; k < 10; k += 2) { R(g, wx - 3, fy + k, 2, 1, '#2E6247'); R(g, wx + 8, fy + k, 2, 1, '#2E6247'); }
          R(g, wx - 2, fy + 10, 11, 1, '#2B2B30');                                  // barandilla
          for (let k = 0; k < 11; k += 2) R(g, wx - 2 + k, fy + 11, 1, 3, '#2B2B30');
          R(g, wx - 2, fy + 14, 11, 1, '#2B2B30');
          if ((wx + fy) % 3 === 0) { R(g, wx + 6, fy + 8, 3, 2, '#9C5B3B'); R(g, wx + 6, fy + 6, 3, 2, '#5DB257'); R(g, wx + 7, fy + 5, 1, 1, '#E97FB0'); }
        }
      }
      // planta baja: rótulo, toldo de rayas, escaparate y puerta
      R(g, b.x + 3, 93, b.w - 6, 6, b.sign); R(g, b.x + 3, 98, b.w - 6, 1, '#00000033');
      for (let k = 0; k < 4; k++) R(g, b.x + 8 + k * 7, 95, 4, 2, '#00000030');
      for (let ax = b.x + 2; ax < b.x + b.w - 2; ax++) {
        const col = Math.floor((ax - b.x) / 4) % 2 ? b.awn[1] : b.awn[0];
        R(g, ax, 100, 1, 6, col); if ((ax - b.x) % 4 < 2) R(g, ax, 106, 1, 1, col);
      }
      R(g, b.x + 2, 100, b.w - 4, 1, '#FFFFFF55');
      R(g, b.x + 4, 108, b.w - 20, 15, '#6F8DB8'); R(g, b.x + 5, 109, b.w - 22, 13, '#9DB9E0');
      for (let k = 0; k < 9; k++) R(g, b.x + 6 + k, 120 - k, 1, 1, '#C9DCF5');      // reflejo
      R(g, b.x + b.w - 14, 107, 9, 17, '#5A3A26'); R(g, b.x + b.w - 13, 108, 7, 15, '#7A5032'); R(g, b.x + b.w - 8, 116, 1, 2, '#E0B85A');
    }
    // Acera: panot (la baldosa de la flor) con bordillo
    R(g, 0, GROUND, 240, 76, '#CFC8BC');
    R(g, 0, GROUND, 240, 2, '#A79F92');
    for (let ty = GROUND + 2; ty < 200; ty += 10) for (let tx = (Math.floor((ty - GROUND) / 10) % 2) * 5 - 5; tx < 240; tx += 10) {
      R(g, tx, ty, 10, 1, '#B9B1A4'); R(g, tx, ty, 1, 10, '#B9B1A4');
      R(g, tx + 4, ty + 3, 2, 4, '#BDB5A8'); R(g, tx + 3, ty + 4, 4, 2, '#BDB5A8'); R(g, tx + 5, ty + 3, 1, 1, '#DED8CE');
    }
    // Rampa de skate a la izquierda
    for (let k = 0; k < 34; k++) { const h = Math.round(34 - Math.sqrt(34 * 34 - (34 - k) * (34 - k))); R(g, k, GROUND + 28 - h, 1, h, k % 6 === 0 ? '#B07A4A' : '#C68E58'); }
    R(g, 0, GROUND - 6, 6, 34, '#9C6B42'); R(g, 0, GROUND - 7, 8, 2, '#9AA0A8'); R(g, 0, GROUND + 28, 36, 2, '#7A5032');
    R(g, 40, GROUND + 18, 5, 8, '#E07A2E'); R(g, 39, GROUND + 25, 7, 2, '#E07A2E'); R(g, 41, GROUND + 21, 3, 2, '#F4ECDF');
    // Árboles en alcorque
    for (const x of [62, 160]) {
      R(g, x - 6, GROUND + 6, 15, 3, '#7A6A55');
      R(g, x, GROUND - 22, 3, 30, '#6E4A30'); R(g, x + 1, GROUND - 22, 1, 30, '#8A6040');
      R(g, x - 13, GROUND - 46, 29, 22, '#3F8A44'); R(g, x - 9, GROUND - 52, 21, 8, '#4E9E4E'); R(g, x - 16, GROUND - 40, 35, 12, '#3F8A44');
      R(g, x - 8, GROUND - 48, 8, 5, '#6CC06A'); R(g, x - 12, GROUND - 40, 5, 4, '#5DB257'); R(g, x + 6, GROUND - 44, 6, 4, '#5DB257'); R(g, x - 14, GROUND - 30, 31, 3, '#2F6E35');
    }
    // Farolas
    for (const x of [112, 228]) {
      R(g, x, GROUND - 40, 2, 48, '#2E3B33'); R(g, x - 2, GROUND + 6, 6, 2, '#2E3B33');
      R(g, x - 4, GROUND - 46, 10, 2, '#2E3B33'); R(g, x - 3, GROUND - 44, 8, 5, '#FFE9A8'); R(g, x - 3, GROUND - 39, 8, 1, '#2E3B33');
    }
    // Banco (a la derecha, donde se sienta quien está parado)
    R(g, 176, 128, 40, 3, '#9C6B42'); R(g, 176, 131, 40, 1, '#7A5032');
    R(g, 176, 136, 40, 3, '#B07A4A'); R(g, 176, 139, 40, 1, '#7A5032');
    R(g, 179, 140, 2, 8, '#2E3B33'); R(g, 211, 140, 2, 8, '#2E3B33'); R(g, 179, 131, 2, 5, '#2E3B33'); R(g, 211, 131, 2, 5, '#2E3B33');
    // Palomas
    for (const [x, y] of [[96, 186], [104, 189], [140, 182]]) { R(g, x, y, 5, 3, '#8E8E98'); R(g, x + 4, y - 2, 3, 3, '#7A7A84'); R(g, x + 7, y - 1, 1, 1, '#E0A526'); R(g, x + 1, y + 3, 1, 1, '#E07A5A'); R(g, x + 3, y + 3, 1, 1, '#E07A5A'); R(g, x + 1, y + 1, 2, 1, '#6E9E9A'); }
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
