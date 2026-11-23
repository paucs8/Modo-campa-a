// Personaje 3D procedural estilo "figura de vinilo". Todo se construye con formas simples,
// así que cada pieza (pelo, ropa, zapatos, gorros) se puede combinar y recolorear sin límites.
(function () {
  const T = window.THREE;
  const col = c => new T.Color(c);
  const mat = (c, o = {}) => new T.MeshStandardMaterial(Object.assign({ color: col(c), roughness: 0.62, metalness: 0 }, o));
  const mesh = (geo, m, p = [0, 0, 0], s = [1, 1, 1], r = [0, 0, 0]) => {
    const x = new T.Mesh(geo, m); x.position.set(...p); x.scale.set(...s); x.rotation.set(...r); x.castShadow = true; x.receiveShadow = true; return x;
  };
  const SPH = (r = 1, w = 48, h = 32) => new T.SphereGeometry(r, w, h);
  const CAP = (r, l) => new T.CapsuleGeometry(r, l, 12, 32);
  const shade = (c, f) => { const k = col(c); k.multiplyScalar(f); return k; };

  // medidas del cuerpo según la altura
  const BODY = { bajo: 0.88, medio: 1, alto: 1.12 };

  function build(look = {}) {
    const L = look, g = new T.Group();
    const skinC = L.skin || '#F4D2B4';
    const skin = mat(skinC, { roughness: 0.55 });
    const hk = BODY[L.height] || 1;                    // largo de piernas y torso
    const legH = 0.6 * hk, torsoH = 0.52 * hk;
    const hipY = 0.16 + legH + 0.17;                   // altura de la cadera
    const chestY = hipY + torsoH * 0.5 + 0.22;
    const neckY = hipY + torsoH + 0.42;
    const headY = neckY + 0.95;

    // ---- cabeza
    const head = new T.Group(); head.position.y = headY; g.add(head);
    head.add(mesh(SPH(1), skin, [0, 0, 0], [1.04, 0.96, 0.96]));
    [-1, 1].forEach(s => {
      head.add(mesh(SPH(0.2), skin, [s * 1.0, -0.12, 0.02], [0.7, 1, 0.8]));
      head.add(mesh(SPH(0.11), mat(shade(skinC, 0.86)), [s * 1.06, -0.12, 0.05], [0.5, 0.75, 0.5]));
    });
    // cara
    const eyeM = mat('#16121A', { roughness: 0.15 }), white = mat('#FFFFFF', { roughness: 0.2, emissive: col('#FFFFFF'), emissiveIntensity: 0.4 });
    const tired = L.mood === 'tired';
    [-1, 1].forEach(s => {
      if (tired) head.add(mesh(new T.TorusGeometry(0.1, 0.022, 8, 24, Math.PI), eyeM, [s * 0.34, -0.1, 0.92], [1, 1, 1], [0, 0, Math.PI]));
      else {
        head.add(mesh(SPH(0.13), eyeM, [s * 0.34, -0.1, 0.9], [0.78, 1, 0.45]));
        head.add(mesh(SPH(0.035), white, [s * 0.34 - 0.035, -0.05, 0.96]));
      }
      head.add(mesh(SPH(0.17), mat('#F29A9A', { transparent: true, opacity: 0.55, roughness: 0.9 }), [s * 0.56, -0.32, 0.79], [1, 0.6, 0.2]));
      if (!L.hairStyle || L.hairStyle === 'rapado') head.add(mesh(CAP(0.02, 0.14), eyeM, [s * 0.34, 0.17, 0.92], [1, 1, 1], [0, 0, Math.PI / 2 + s * 0.12]));
    });
    const happy = L.mood === 'happy' || L.mood === 'fire';
    head.add(mesh(new T.TorusGeometry(happy ? 0.1 : 0.07, 0.022, 8, 24, Math.PI), mat('#5A2E2E'), [0, -0.33, 0.93], [1, 1, 1], [0, 0, Math.PI]));

    // ---- cuello, torso, brazos, piernas (piel)
    g.add(mesh(new T.CylinderGeometry(0.16, 0.18, 0.3, 24), skin, [0, neckY - 0.1, 0]));
    const torso = mesh(CAP(0.4, torsoH), skin, [0, chestY, 0], [1.08, 1, 0.78]); g.add(torso);
    const armY = chestY + torsoH * 0.18;
    [-1, 1].forEach(s => {
      g.add(mesh(CAP(0.13, 0.5 * hk), skin, [s * 0.56, armY - 0.18, 0], [1, 1, 1], [0, 0, s * 0.16]));
      g.add(mesh(SPH(0.155), skin, [s * 0.66, armY - 0.58 * hk, 0.02]));
      g.add(mesh(CAP(0.16, legH), skin, [s * 0.2, 0.16 + 0.17 + legH / 2, 0]));
    });

    // ---- ropa interior (si no hay ropa)
    const topC = L.topColor || '#D9D6D2', botC = L.bottomColor || '#CFCBC6';
    const top = L.top || 'tirantes', bottom = L.bottom || 'shorts';
    const topM = mat(topC, { roughness: 0.8 }), top2M = mat(L.top2 || '#26201E', { roughness: 0.8 }), botM = mat(botC, { roughness: 0.85 });
    // torso de la prenda: un poco más grande que el cuerpo
    const sleeveLen = { tirantes: 0, camiseta: 0.2, sudadera: 0.5, jersey: 0.5, capas: 0.5, chaqueta: 0.5, camisa: 0.35 }[top] ?? 0.5;
    const baggy = ['sudadera', 'jersey', 'chaqueta'].includes(top) ? 1.1 : 1.03;
    g.add(mesh(CAP(0.43, torsoH + 0.05), topM, [0, chestY - 0.02, 0], [1.08 * baggy, 1, 0.8 * baggy]));
    if (top === 'chaqueta' || top === 'camisa') g.add(mesh(new T.BoxGeometry(0.34, torsoH + 0.55, 0.1), top2M, [0, chestY + 0.02, 0.37 * baggy]));
    if (top === 'sudadera') {
      g.add(mesh(new T.TorusGeometry(0.3, 0.1, 16, 40), topM, [0, neckY - 0.12, -0.08], [1.1, 1, 0.9], [Math.PI / 2 - 0.25, 0, 0]));
      g.add(mesh(new T.BoxGeometry(0.5, 0.2, 0.06), mat(shade(topC, 0.9), { roughness: 0.85 }), [0, chestY - 0.16, 0.39], [1, 1, 1], [-0.12, 0, 0]));
      [-1, 1].forEach(s => g.add(mesh(CAP(0.018, 0.2), mat('#F4F0EA'), [s * 0.1, chestY + 0.2, 0.4])));
    }
    if (sleeveLen > 0) [-1, 1].forEach(s => {
      g.add(mesh(CAP(0.16 * baggy, sleeveLen * hk), top === 'capas' ? top2M : topM, [s * 0.57, armY - 0.06 - sleeveLen * 0.25, 0], [1, 1, 1], [0, 0, s * 0.16]));
    });
    if (top === 'capas') g.add(mesh(CAP(0.44, torsoH * 0.6), topM, [0, chestY + 0.06, 0], [1.1, 1, 0.83]));
    // parte de abajo
    if (bottom === 'falda') g.add(mesh(new T.CylinderGeometry(0.42, 0.62, 0.42, 40, 1, true), mat(botC, { roughness: 0.85, side: T.DoubleSide }), [0, hipY - 0.12, 0], [1, 1, 0.82]));
    else {
      g.add(mesh(CAP(0.42, 0.06), botM, [0, hipY, 0], [1.05, 0.8, 0.8]));
      const len = bottom === 'shorts' ? 0.16 : bottom === 'corto' ? 0.26 : legH + 0.1;
      const wide = bottom === 'cargo' || bottom === 'vaqueros' ? 1.32 : 1.1;
      [-1, 1].forEach(s => {
        const geo = new T.CylinderGeometry(0.19, 0.19 * (bottom === 'vaqueros' ? wide * 1.08 : wide), len, 32);
        g.add(mesh(geo, botM, [s * 0.21, hipY - 0.08 - len / 2, 0]));
        if (bottom === 'cargo') g.add(mesh(new T.BoxGeometry(0.08, 0.16, 0.16), mat(shade(botC, 0.85)), [s * 0.43, hipY - 0.32, 0]));
        if (bottom === 'chandal') g.add(mesh(new T.BoxGeometry(0.03, len, 0.05), mat(L.stripe || '#F4F0EA'), [s * 0.41, hipY - 0.08 - len / 2, 0]));
      });
    }
    // pies / zapatos
    const shoe = L.shoes;
    [-1, 1].forEach(s => {
      if (!shoe) { g.add(mesh(SPH(0.17), skin, [s * 0.21, 0.1, 0.06], [1, 0.62, 1.35])); return; }
      const sc = L.shoes === 'neon' ? '#3FE0A0' : L.shoes === 'doradas' ? '#E8B84A' : (L.shoesColor || '#F4F0EA');
      const high = shoe === 'botas' || shoe === 'altas';
      g.add(mesh(SPH(0.2), mat(sc, { roughness: 0.5, metalness: L.shoes === 'doradas' ? 0.6 : 0 }), [s * 0.21, high ? 0.17 : 0.12, 0.07], [1, high ? 1 : 0.7, 1.4]));
      g.add(mesh(new T.CylinderGeometry(0.21, 0.21, 0.07, 32), mat(L.shoes === 'neon' ? '#F2549A' : '#FBF8F2', { roughness: 0.7 }), [s * 0.21, 0.035, 0.07], [1, 1, 1.42]));
    });

    // ---- pelo
    const hairM = mat(L.hair || '#3A2418', { roughness: 0.5 });
    const hs = L.hairStyle;
    if (hs && hs !== 'rapado') {
      // pelo como un casco liso recortado: flequillo en picos, orejas y nuca al aire
      const longH = ['largo', 'melena', 'trenzas', 'coletas'].includes(hs);
      const P = {
        base: hs === 'revuelto' ? 0.28 : hs === 'mono' || hs === 'coletas' ? 0.36 : 0.32,
        teeth: hs === 'revuelto' ? 9.5 : hs === 'largo' || hs === 'melena' ? 0 : 7.5,
        depth: hs === 'revuelto' ? 0.13 : 0.08,
        part: hs === 'largo' || hs === 'melena' ? 1 : 0,
        nape: longH ? -2 : -0.42, ears: longH ? 0 : 1,
      };
      const shellM = hairM.clone(); shellM.side = T.DoubleSide;
      shellM.onBeforeCompile = sh => {
        sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vP;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvP = position;');
        sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vP;').replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
          vec3 p = normalize(vP);
          float fr = ${P.base.toFixed(3)} - ${P.depth.toFixed(3)} * abs(sin(p.x * ${P.teeth.toFixed(2)}));
          if (${P.part.toFixed(1)} > 0.5) fr = 0.62 - 0.55 * smoothstep(0.0, 0.9, abs(p.x));
          if (p.z > 0.05 && p.y < fr && abs(p.x) < 0.88) discard;
          if (p.y < ${P.nape.toFixed(2)}) discard;
          if (${P.ears.toFixed(1)} > 0.5 && p.y < -0.02 && abs(p.x) > 0.55 && p.z > -0.45) discard;`);
      };
      head.add(mesh(SPH(1.085, 64, 48), shellM, [0, 0.03, -0.02], [1.05, 1.02, 1.03]));
      if (hs === 'revuelto' || hs === 'cresta') for (let i = 0; i < 5; i++) head.add(mesh(new T.ConeGeometry(0.15, 0.4, 16), hairM, [-0.5 + i * 0.25, 0.98 - Math.abs(i - 2) * 0.06, -0.1], [1, 1, 1], [-0.3, 0, (i - 2) * -0.25]));
      if (hs === 'largo' || hs === 'melena' || hs === 'trenzas' || hs === 'coletas') {
        const down = hs === 'largo' ? 1.5 : hs === 'melena' ? 0.85 : 0;
        if (down) [-1, 1].forEach(s => head.add(mesh(CAP(0.26, down), hairM, [s * 0.9, -0.2 - down / 2 + 0.25, -0.12], [0.85, 1, 1])));
        if (down) head.add(mesh(CAP(0.75, down * 0.7), hairM, [0, -0.25 - down * 0.3, -0.55], [1.15, 1, 0.55]));
        if (hs === 'coletas') [-1, 1].forEach(s => head.add(mesh(SPH(0.38), hairM, [s * 1.18, 0.25, -0.2], [0.75, 1.25, 0.8], [0, 0, s * 0.4])));
        if (hs === 'trenzas') [-1, 1].forEach(s => { for (let k = 0; k < 5; k++) head.add(mesh(SPH(0.15), hairM, [s * 0.86, -0.55 - k * 0.22, 0.12], [1, 0.9, 1])); });
      }
      if (hs === 'mono') head.add(mesh(SPH(0.38), hairM, [0, 1.05, -0.15]));
      if ((hs === 'rizos' || hs === 'afro') && !['gorro', 'gorra'].includes(L.head)) {
        const R = hs === 'afro' ? 1.28 : 1.14;
        for (let i = 0; i < 46; i++) {
          const u = (i * 0.618034) % 1, v = (i * 0.3819) % 1, th = u * Math.PI * 2, ph = 0.15 + v * Math.PI * 0.42;
          head.add(mesh(SPH(0.22), hairM, [Math.sin(ph) * Math.cos(th) * R, Math.cos(ph) * R * 0.9 + 0.05, Math.sin(ph) * Math.sin(th) * R * 0.9 - 0.12]));
        }
      }
    }
    // ---- gorros
    const hatC = L.head === 'halo' ? '#FFD45C' : L.head === 'corona' ? '#E8B84A' : (L.headColor || '#2A2420');
    const hatM = mat(hatC, { roughness: L.head === 'corona' || L.head === 'halo' ? 0.3 : 0.75, metalness: L.head === 'corona' ? 0.7 : 0 });
    if (L.head === 'gorro') {
      head.add(mesh(new T.SphereGeometry(1.12, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.5), hatM, [0, 0.12, 0], [1.03, 1.05, 1], [-0.12, 0, 0]));
      head.add(mesh(new T.TorusGeometry(1.06, 0.13, 16, 64), hatM, [0, 0.2, 0.02], [1.02, 1, 0.98], [Math.PI / 2 - 0.12, 0, 0]));
    }
    if (L.head === 'gorra') {
      head.add(mesh(new T.SphereGeometry(1.1, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.5), hatM, [0, 0.12, 0], [1.03, 1, 1], [-0.12, 0, 0]));
      head.add(mesh(new T.CylinderGeometry(0.7, 0.7, 0.06, 48), hatM, [0, 0.18, 1.2], [1.1, 1, 0.75], [0.32, 0, 0]));
    }
    if (L.head === 'halo') head.add(mesh(new T.TorusGeometry(0.55, 0.06, 16, 48), mat('#FFD45C', { emissive: col('#FFC93C'), emissiveIntensity: 0.8 }), [0, 1.42, 0], [1, 1, 1], [Math.PI / 2 - 0.2, 0, 0]));
    if (L.head === 'corona') for (let i = 0; i < 5; i++) head.add(mesh(new T.ConeGeometry(0.12, 0.3, 4), hatM, [-0.36 + i * 0.18, 1.12, 0.1], [1, 1, 1], [0, 0, 0]));
    // ---- gafas
    if (L.glasses === 'sol' || L.glasses === 'finas' || L.glasses === 'pasta') {
      const fr = mat('#1A1620', { roughness: 0.3 });
      [-1, 1].forEach(s => {
        if (L.glasses === 'sol') head.add(mesh(SPH(0.22), mat('#141018', { roughness: 0.05, metalness: 0.3 }), [s * 0.36, -0.08, 0.92], [1.15, 0.85, 0.25]));
        else head.add(mesh(new T.TorusGeometry(0.19, L.glasses === 'pasta' ? 0.035 : 0.018, 10, 32), fr, [s * 0.36, -0.08, 0.95]));
      });
      head.add(mesh(CAP(0.015, 0.12), fr, [0, -0.04, 0.98], [1, 1, 1], [0, 0, Math.PI / 2]));
    }
    head.traverse(o => { if (o.isMesh) o.receiveShadow = false; });
    return g;
  }

  // Renderiza el personaje a una imagen (fondo transparente)
  let R = null;
  function render(look, size = 512, opts = {}) {
    if (!R) {
      R = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
      R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
      R.toneMapping = T.ACESFilmicToneMapping; R.toneMappingExposure = 1.05; R.outputColorSpace = T.SRGBColorSpace;
    }
    R.setSize(size, Math.round(size * 1.25), false);
    const scene = new T.Scene();
    scene.add(new T.HemisphereLight('#FFF6EC', '#B8A8C8', 1.25));
    const key = new T.DirectionalLight('#FFF1E0', 2.2); key.position.set(-2.5, 6, 5); key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024); key.shadow.camera.left = -3; key.shadow.camera.right = 3; key.shadow.camera.top = 5; key.shadow.camera.bottom = -1; key.shadow.radius = 6; key.shadow.bias = -0.0005;
    scene.add(key);
    const rim = new T.DirectionalLight('#C8D8FF', 1.1); rim.position.set(4, 3, -3); scene.add(rim);
    const fill = new T.DirectionalLight('#FFE8F0', 0.5); fill.position.set(3, 1, 4); scene.add(fill);
    const ground = new T.Mesh(new T.PlaneGeometry(10, 10), new T.ShadowMaterial({ opacity: 0.18 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
    const ch = build(look); ch.rotation.y = opts.turn ?? -0.18; scene.add(ch);
    const cam = new T.PerspectiveCamera(22, 0.8, 0.1, 100); cam.position.set(0, 2.9, 13); cam.lookAt(0, 1.95, 0);
    R.render(scene, cam);
    return R.domElement.toDataURL('image/png');
  }
  window.Toy3D = { build, render };
})();
