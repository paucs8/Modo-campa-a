// Modo Campaña · generador automático de personajes.
// Mientras ComfyUI está abierto, mira cada minuto si alguien ha pedido un personaje en la app,
// lo genera a partir del maniquí (así todos tienen el mismo cuerpo), le quita el fondo, lo sube y le avisa.
import { app } from "../../scripts/app.js";

const SUPABASE_URL = "https://kbifpoklblhygigtzbpd.supabase.co";
const SUPABASE_KEY = "sb_publishable_2RW_a6X-IlB2naB7oV8Png_tslgo8ZS";            // clave publicable (no es secreta)
const BASE_FILE = { filename: "maniqui_00002_.png", subfolder: "modocampana" };   // cuerpo base
const STYLE = "3D render of one stylized streetwear doll character, collectible designer fashion figure, full body, front view, standing straight with arms relaxed down along the body, feet slightly apart, oversized big head, big almond eyes with long lashes, small pouty lips, rosy cheeks, slim small body, very detailed realistic fabric textures with stitching and folds, oversized baggy layered streetwear outfit, soft studio lighting, soft shadow on the floor, plain white background, centered, ultra detailed octane render, no logos, no text, no brand names";
const DENOISE = { nuevo: 0.82, cambio: 0.74, retoque: 0.68 }, EVERY = 60_000;
const CROP = { x: 116, y: 16, w: 600, h: 1200 }, OUT = { w: 360, h: 720 };

let sb = null, busy = false, baseReady = false, box = null;
const log = (msg, kind = "") => { if (!box) return; box.querySelector(".mc-st").textContent = msg; box.dataset.kind = kind; console.log("[Modo Campaña]", msg); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const hash = s => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return Math.abs(h) % 1e9; };

async function client() {
  if (sb) return sb;
  const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm");
  sb = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true, autoRefreshToken: true, storageKey: "mc-avatares-auth" } });
  return sb;
}

// ---------- Panel pequeño en ComfyUI ----------
function panel() {
  box = document.createElement("div");
  box.className = "mc-box";
  box.innerHTML = `<style>
    .mc-box{position:fixed;left:12px;bottom:12px;z-index:9999;background:#1e1d22;color:#eee;border:1px solid #444;border-radius:10px;padding:8px 10px;font:12px system-ui;max-width:260px;box-shadow:0 4px 16px #0006}
    .mc-box b{display:block;margin-bottom:4px}.mc-box input{width:100%;margin:2px 0;padding:4px;background:#111;color:#eee;border:1px solid #555;border-radius:6px}
    .mc-box textarea{width:100%;background:#111;color:#eee;border:1px solid #555;border-radius:6px;margin-top:4px}.mc-box summary{cursor:pointer;margin-top:6px;opacity:.8}.mc-box button{margin-top:4px;padding:4px 8px;border-radius:6px;border:0;background:#C7B5FF;color:#111;font-weight:700;cursor:pointer}
    .mc-box[data-kind=ok] .mc-st{color:#8f8}.mc-box[data-kind=err] .mc-st{color:#f88}.mc-box .mc-x{float:right;cursor:pointer;opacity:.6}</style>
    <span class="mc-x" title="Ocultar">×</span><b>Modo Campaña · personajes</b><div class="mc-st">Arrancando…</div><form class="mc-login" hidden>
    <input name="e" type="email" placeholder="Tu email de la app" autocomplete="username"><input name="p" type="password" placeholder="Contraseña" autocomplete="current-password"><button>Entrar</button></form><button class="mc-all" type="button">Crear los de todos</button>
    <details class="mc-redo"><summary>Rehacer alguno</summary><textarea rows="3" placeholder="Nombre: lo que hay que cambiar"></textarea><button type="button">Rehacer</button></details>`;
  document.body.appendChild(box);
  box.querySelector(".mc-x").onclick = () => { box.style.display = "none"; };
  box.querySelector(".mc-redo button").onclick = e => { const t = box.querySelector(".mc-redo textarea"); if (!t.value.trim()) return; e.target.disabled = true; redo(t.value).finally(() => { t.value = ""; e.target.disabled = false; }); };
  box.querySelector(".mc-all").onclick = e => { e.target.disabled = true; e.target.textContent = "Pidiendo…"; createForAll().finally(() => { e.target.textContent = "Crear los de todos"; e.target.disabled = false; }); };
  box.querySelector(".mc-login").onsubmit = async e => {
    e.preventDefault(); const f = e.target;
    const { error } = await (await client()).auth.signInWithPassword({ email: f.e.value.trim(), password: f.p.value });
    if (error) { log("No se pudo entrar: " + error.message, "err"); return; }
    f.hidden = true; log("Conectado. Esperando pedidos…", "ok"); tick();
  };
}

// ---------- ComfyUI ----------
async function uploadInput(blob, name) {
  const fd = new FormData(); fd.append("image", blob, name); fd.append("overwrite", "true");
  const r = await fetch("/upload/image", { method: "POST", body: fd }); if (!r.ok) throw new Error("subida a ComfyUI");
}
async function ensureBase() {
  if (baseReady) return;
  const r = await fetch(`/view?filename=${BASE_FILE.filename}&subfolder=${BASE_FILE.subfolder}&type=output`);
  if (!r.ok) throw new Error("no encuentro el maniquí " + BASE_FILE.filename);
  await uploadInput(await r.blob(), "mc_maniqui.png"); baseReady = true;
}
function workflow(text, seed, image = "mc_maniqui.png", denoise = DENOISE.nuevo) {
  return {
    "1": { class_type: "UNETLoader", inputs: { unet_name: "z_image_turbo_int8_convrot.safetensors", weight_dtype: "default" } },
    "2": { class_type: "CLIPLoader", inputs: { clip_name: "qwen_3_4b_fp8_mixed.safetensors", type: "lumina2" } },
    "3": { class_type: "VAELoader", inputs: { vae_name: "ae.safetensors" } },
    "4": { class_type: "ModelSamplingAuraFlow", inputs: { model: ["1", 0], shift: 3 } },
    "5": { class_type: "CLIPTextEncode", inputs: { clip: ["2", 0], text } },
    "6": { class_type: "ConditioningZeroOut", inputs: { conditioning: ["5", 0] } },
    "11": { class_type: "LoadImage", inputs: { image } },
    "13": { class_type: "VAEEncode", inputs: { pixels: ["11", 0], vae: ["3", 0] } },
    "8": { class_type: "KSampler", inputs: { model: ["4", 0], positive: ["5", 0], negative: ["6", 0], latent_image: ["13", 0], seed, steps: 9, cfg: 1, sampler_name: "res_multistep", scheduler: "simple", denoise } },
    "9": { class_type: "VAEDecode", inputs: { samples: ["8", 0], vae: ["3", 0] } },
    // recorte del fondo con SAM3 (ya instalado en tu ComfyUI)
    "20": { class_type: "CheckpointLoaderSimple", inputs: { ckpt_name: "sam3.1_multiplex_fp16.safetensors" } },
    "21": { class_type: "CLIPTextEncode", inputs: { clip: ["20", 1], text: "character figure" } },
    "22": { class_type: "SAM3_Detect", inputs: { model: ["20", 0], image: ["9", 0], conditioning: ["21", 0], threshold: 0.4, refine_iterations: 2, individual_masks: false } },
    "23": { class_type: "InvertMask", inputs: { mask: ["22", 0] } },
    "24": { class_type: "JoinImageWithAlpha", inputs: { image: ["9", 0], alpha: ["23", 0] } },
    "10": { class_type: "SaveImage", inputs: { images: ["24", 0], filename_prefix: "modocampana/avatares/av" } },
  };
}
/** Para cambios y retoques se parte del personaje que ya tiene (misma cara y cuerpo), sobre fondo blanco. */
async function prepareBase(url, id) {
  const bmp = await createImageBitmap(await fetch(url).then(r => { if (!r.ok) throw new Error("no puedo bajar su personaje"); return r.blob(); }));
  const c = document.createElement("canvas"); c.width = 832; c.height = 1216;
  const x = c.getContext("2d"); x.fillStyle = "#f4f4f4"; x.fillRect(0, 0, 832, 1216);
  x.drawImage(bmp, CROP.x, CROP.y, CROP.w, CROP.h);
  const name = `mc_base_${id}.png`;
  await uploadInput(await new Promise(r => c.toBlob(r, "image/png")), name);
  return name;
}
async function generate(text, seed, image, denoise) {
  await ensureBase();
  const r = await fetch("/prompt", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: workflow(text, seed, image, denoise), client_id: "modocampana" }) }).then(r => r.json());
  if (!r.prompt_id) throw new Error("ComfyUI no aceptó el trabajo");
  for (let i = 0; i < 300; i++) {          // hasta 10 minutos
    await sleep(2000);
    const h = await fetch("/history/" + r.prompt_id).then(r => r.json());
    const job = h[r.prompt_id]; if (!job) continue;
    if (job.status && job.status.status_str === "error") throw new Error("error al generar");
    const img = job.outputs && job.outputs["10"] && job.outputs["10"].images && job.outputs["10"].images[0];
    if (img) return fetch(`/view?filename=${encodeURIComponent(img.filename)}&subfolder=${encodeURIComponent(img.subfolder)}&type=${img.type}`).then(r => r.blob());
  }
  throw new Error("tardó demasiado");
}

// ---------- Recortar siempre igual (el fondo ya viene quitado) ----------
async function cutout(blob) {
  const bmp = await createImageBitmap(blob);
  const o = document.createElement("canvas"); o.width = OUT.w; o.height = OUT.h;
  const ox = o.getContext("2d"); ox.imageSmoothingQuality = "high";
  ox.drawImage(bmp, CROP.x, CROP.y, CROP.w, CROP.h, 0, 0, OUT.w, OUT.h);
  return new Promise(r => o.toBlob(r, "image/png"));
}


// ---------- Crear de golpe los personajes de los que ya juegan (con lo que tienen marcado en su editor) ----------
const BASE = {
  v: 2,
  skin: '#F1C8A5', eyes: '#3B2A1E', freckles: false, blush: false, beard: 'no', earrings: false,
  hair: '#1E1A1A', hair2: null, hairStyle: 'corto', bangs: false, braids: false,
  glasses: 'no', head: 'no', headColor: '#2A2420',
  top: 'sudadera', topColor: '#EDE6DA', top2: '#26201E', pattern: 'liso', stripe: '#26201E',
  bottom: 'cargo', bottomColor: '#2C2522', legs: 'piel', legsColor: '#1E1A1A',
  shoes: 'bambas', shoesColor: '#EDE6DA', bag: 'no', bagColor: '#26201E', chain: false, necklace: false,
};
const COLOR_NAMES = [['black', 20, 20, 22], ['charcoal grey', 60, 58, 62], ['grey', 140, 138, 140], ['light grey', 205, 203, 200], ['white', 245, 243, 238], ['cream', 236, 226, 205], ['beige', 201, 188, 164],
  ['brown', 110, 70, 45], ['dark brown', 60, 36, 24], ['light brown', 160, 115, 75], ['blonde', 210, 170, 100], ['platinum blonde', 232, 220, 192], ['red', 200, 50, 45], ['ginger', 184, 67, 44], ['burgundy', 110, 30, 40],
  ['orange', 230, 130, 40], ['yellow', 242, 193, 78], ['olive green', 74, 90, 58], ['green', 63, 140, 71], ['mint green', 150, 220, 180], ['neon green', 63, 224, 160], ['teal', 40, 130, 130], ['light blue', 140, 175, 215],
  ['blue', 60, 100, 200], ['navy blue', 34, 56, 94], ['denim blue', 70, 95, 140], ['purple', 120, 80, 180], ['lavender', 170, 140, 240], ['pink', 229, 138, 176], ['hot pink', 240, 70, 150], ['gold', 232, 184, 74]];
function colorName(hex) {
  const h = String(hex || '').replace('#', ''); if (h.length < 6) return '';
  const [r, g, b] = [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16));
  return COLOR_NAMES.reduce((best, c) => { const d = (c[1] - r) ** 2 + (c[2] - g) ** 2 + (c[3] - b) ** 2; return d < best.d ? { d, n: c[0] } : best; }, { d: 1e9, n: '' }).n;
}
function skinName(hex) {
  const h = String(hex || '#F1C8A5').replace('#', ''), l = [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)).reduce((a, v) => a + v, 0) / 3;
  return l > 215 ? 'very fair' : l > 190 ? 'fair' : l > 165 ? 'light tan' : l > 135 ? 'tan' : l > 100 ? 'brown' : 'dark brown';
}
const P_HAIR = { corto: 'short neat hair', revuelto: 'messy tousled hair', rapado: 'a buzz cut', melena: 'a chin length bob haircut', largo: 'long straight hair', mono: 'hair in a high bun', coletas: 'two high pigtails', trenzas: 'two long braids', rizos: 'short curly hair', afro: 'a big round afro', cresta: 'a spiky mohawk' };
const P_GLASSES = { finas: 'thin round glasses', pasta: 'thick black rectangular glasses', sol: 'black sunglasses', estrella: 'star shaped sunglasses', corazon: 'heart shaped sunglasses', vr: 'a futuristic visor' };
const P_HEAD = { gorra: 'baseball cap', gorro: 'knitted beanie', bucket: 'bucket hat', bandana: 'bandana', horquillas: 'hair clips', gato: 'beanie with cat ears', corona: 'small golden crown', vikingo: 'viking helmet with horns', halo: 'golden halo floating above the head' };
const P_TOP = { camiseta: 'oversized t-shirt', sudadera: 'oversized hoodie', jersey: 'oversized knit sweater', capas: 'oversized t-shirt layered over a long sleeve shirt', camisa: 'open oversized shirt over a t-shirt', chaqueta: 'oversized open bomber jacket over a t-shirt' };
const P_BOTTOM = { cargo: 'baggy cargo pants', vaqueros: 'baggy wide leg jeans', chandal: 'baggy track pants with side stripes', corto: 'loose shorts', falda: 'pleated mini skirt' };
const P_LEGS = { medias: 'tights', rejilla: 'fishnet tights', rayas: 'striped tights' };
const P_SHOES = { bambas: 'chunky sneakers', altas: 'high top sneakers', botas: 'chunky boots', plataformas: 'platform shoes', doradas: 'shiny golden sneakers', neon: 'neon green sneakers' };
const P_BAG = { bolso: 'crossbody bag', mochila: 'backpack', rinonera: 'fanny pack worn across the chest', capa: 'cape', guitarra: 'guitar on the back', alas: 'small white angel wings on the back' };
const P_ITEM = { llavero: 'keychain hanging from the belt', botella: 'holding a water bottle', auriculares: 'headphones around the neck', movil: 'holding a phone', mancuerna: 'holding a dumbbell', handycam: 'holding a small camcorder', skate: 'holding a skateboard', chestOpen: 'a small golden treasure chest at the feet',
  raqueta: 'holding a tennis racket', pesarusa: 'holding a kettlebell', cafe: 'holding a coffee cup', libro: 'holding a book', microfono: 'holding a microphone', helado: 'holding an ice cream', perro: 'a small cute dog at the feet', gatito: 'a small cute cat at the feet', balon: 'a ball at the feet', toalla: 'a towel over the shoulder' };
const P_WHO = { chica: 'girl', chico: 'boy', neutro: 'young person' };
/** Traduce el personaje del editor a la descripción que entiende el generador. */
function lookToPrompt(look, items) {
  const L = Object.assign({}, BASE, look), c = colorName;
  const beard = L.beard && L.beard !== 'no' ? (L.beard === 'bigote' ? ' with a visible mustache' : ' with a visible short full beard and mustache') : '';
  const parts = [`${P_WHO[L.gen] || 'young person'}${beard}`, `${c(L.hair)} colored hair, ${P_HAIR[L.hairStyle] || 'short hair'}${L.hair2 ? ` with ${c(L.hair2)} tips` : ''}${L.bangs ? ' with bangs' : ''}`, `${skinName(L.skin)} skin`];
  if (L.eyes) parts.push(`${c(L.eyes)} eyes`);
  if (L.freckles) parts.push('freckles');
  if (L.glasses && L.glasses !== 'no') parts.push(P_GLASSES[L.glasses]);
  if (L.head && L.head !== 'no') parts.push(['corona', 'halo'].includes(L.head) ? P_HEAD[L.head] : `${c(L.headColor)} ${P_HEAD[L.head]}`);
  const PAT = { rayas: `${c(L.stripe)} stripes`, cuadros: `a ${c(L.stripe)} plaid pattern`, franja: `a ${c(L.stripe)} chest stripe`, llamas: 'a flame print', camuflaje: 'a camo print', galaxia: 'a galaxy print', arcoiris: 'a rainbow print' };
  let top = `${c(L.topColor)} ${P_TOP[L.top] || 'oversized t-shirt'}${L.pattern && L.pattern !== 'liso' && PAT[L.pattern] ? ` with ${PAT[L.pattern]}` : ''}`;
  if (['capas', 'camisa', 'chaqueta'].includes(L.top)) top += ` (the inner layer is ${c(L.top2)})`;
  parts.push(top);
  parts.push(`${c(L.bottomColor)} ${P_BOTTOM[L.bottom] || 'baggy pants'}${L.bottom === 'chandal' ? ` with ${c(L.stripe)} stripes` : ''}`);
  if ((L.bottom === 'corto' || L.bottom === 'falda') && L.legs && L.legs !== 'piel') parts.push(`${c(L.legsColor)} ${P_LEGS[L.legs]}`);
  parts.push(['doradas', 'neon'].includes(L.shoes) ? P_SHOES[L.shoes] : `${c(L.shoesColor)} ${P_SHOES[L.shoes] || 'chunky sneakers'}`);
  if (L.bag && L.bag !== 'no') parts.push(['capa', 'alas', 'guitarra'].includes(L.bag) ? P_BAG[L.bag] : `${c(L.bagColor)} ${P_BAG[L.bag]}`);
  if (L.necklace) parts.push('a pendant necklace');
  if (L.chain) parts.push('a silver chain on the pants');
  if (L.earrings) parts.push('silver earrings');
  (items || []).forEach(k => { if (P_ITEM[k]) parts.push(P_ITEM[k]); });
  return parts.filter(Boolean).join(', ');
}
async function createForAll() {
  const c = await client();
  const [{ data: people, error }, { data: reqs }] = await Promise.all([
    c.from("profiles").select("user_id,name,look"),
    c.from("avatar_requests").select("user_id,status"),
  ]);
  if (error) { log("No pude leer los jugadores: " + error.message, "err"); return; }
  const has = new Set((reqs || []).filter(r => r.status !== "error").map(r => r.user_id));
  const todo = (people || []).filter(p => p.look && !p.look.avatar && !has.has(p.user_id));
  let ok = 0;
  for (const p of todo) {
    const look = Object.assign({}, p.look); const items = look.items || []; delete look.items; delete look.avatar;
    const { error: e } = await c.from("avatar_requests").insert({ user_id: p.user_id, name: p.name || "", spec: Object.assign({}, BASE, look, { items, kind: "nuevo" }), prompt: lookToPrompt(look, items), cost: 0 });
    if (!e) ok++; else console.warn("[Modo Campaña]", p.name, e.message);
  }
  log(ok ? `Pedidos ${ok} personajes. Voy generándolos…` : "No había nadie sin personaje.", "ok");
  setTimeout(tick, 500);
}

/** Rehacer personajes concretos. Cada línea: «Nombre: lo que hay que cambiar». */
async function redo(text) {
  const c = await client(); let ok = 0;
  for (const line of text.split("\n").map(l => l.trim()).filter(Boolean)) {
    // «+Nombre: …» lo hace de cero; «… | hair=#B8432C» cambia campos del editor antes de describirlo
    const [whoRaw, ...rest] = line.split(":"); const fresh = whoRaw.trim().startsWith("+"), who = whoRaw.replace("+", "").trim();
    const [noteRaw, over = ""] = rest.join(":").split("|"); const note = noteRaw.trim();
    const { data: ppl } = await c.from("profiles").select("user_id,name,look").ilike("name", who + "%").limit(1);
    const p = ppl && ppl[0]; if (!p) { log(`No encuentro a ${who.trim()}`, "err"); continue; }
    const { data: last } = await c.from("avatar_requests").select("image_url").eq("user_id", p.user_id).eq("status", "listo").order("id", { ascending: false }).limit(1);
    const look = Object.assign({}, p.look || {}); const items = look.items || []; delete look.items; delete look.avatar;
    over.split(",").map(x => x.split("=").map(y => y.trim())).forEach(([k, v]) => { if (k && v) look[k] = v; });
    const base = !fresh && last && last[0] && last[0].image_url;
    const { error } = await c.from("avatar_requests").insert({ user_id: p.user_id, name: p.name || "", spec: Object.assign({}, BASE, look, { items, kind: base ? "retoque" : "nuevo", note, base: base || null }), prompt: (note ? note + ", " : "") + lookToPrompt(look, items), cost: 0 });
    if (!error) ok++;
  }
  log(ok ? `Pedidos ${ok} retoques…` : "No se pidió nada", ok ? "ok" : "err"); setTimeout(tick, 500);
}

/** Copia fija «latest.png» de cada uno (la usa el ranking aunque esa persona aún no haya abierto la app). */
async function backfillLatest() {
  try {
    const c = await client(); const { data: s0 } = await c.auth.getSession(); if (!s0.session) return;
    const { data } = await c.from("avatar_requests").select("user_id,image_url,id").eq("status", "listo").order("id", { ascending: false });
    const seen = new Set();
    for (const r of data || []) {
      if (seen.has(r.user_id) || !r.image_url) continue; seen.add(r.user_id);
      const head = await fetch(`${SUPABASE_URL}/storage/v1/object/public/avatares/${r.user_id}/latest.png`, { method: "HEAD" });
      if (head.ok) continue;
      const blob = await fetch(r.image_url).then(x => x.blob());
      await c.storage.from("avatares").upload(`${r.user_id}/latest.png`, blob, { contentType: "image/png", upsert: true, cacheControl: "60" });
    }
  } catch (e) { console.warn("[Modo Campaña] latest", e); }
}

// ---------- Bucle de pedidos ----------
async function tick() {
  if (busy) return; busy = true;
  try {
    const c = await client(); const { data: s } = await c.auth.getSession();
    if (!s.session) { box.querySelector(".mc-login").hidden = false; log("Entra con tu cuenta de la app (la de admin)."); return; }
    const { data: list, error } = await c.from("avatar_requests").select("*").eq("status", "pendiente").order("id").limit(1);
    if (error) { log("Supabase: " + error.message, "err"); return; }
    const req = list && list[0];
    if (!req) { log("Sin pedidos. Mirando cada minuto…", "ok"); return; }
    const { data: claimed } = await c.from("avatar_requests").update({ status: "generando", updated_at: new Date().toISOString() }).eq("id", req.id).eq("status", "pendiente").select("id");
    if (!claimed || !claimed.length) return;
    try {
      const spec = req.spec || {}, kind = spec.base ? (spec.kind === "retoque" ? "retoque" : "cambio") : "nuevo";
      log(`${kind === "retoque" ? "Retocando" : "Generando"} el personaje de ${req.name || "alguien"}…`);
      const image = kind === "nuevo" ? "mc_maniqui.png" : await prepareBase(spec.base, req.id);
      const text = STYLE + ", " + req.prompt + (spec.note ? `. Cambio pedido por la persona: ${spec.note}` : "");
      const png = await cutout(await generate(text, hash(req.user_id) + (kind === "nuevo" ? 0 : req.id), image, DENOISE[kind]));
      const path = `${req.user_id}/${req.id}.png`;
      const up = await c.storage.from("avatares").upload(path, png, { contentType: "image/png", upsert: true });
      if (up.error) throw new Error("subida: " + up.error.message);
      const url = c.storage.from("avatares").getPublicUrl(path).data.publicUrl;
      await c.storage.from("avatares").upload(`${req.user_id}/latest.png`, png, { contentType: "image/png", upsert: true, cacheControl: "60" });
      await c.from("avatar_requests").update({ status: "listo", image_url: url, updated_at: new Date().toISOString() }).eq("id", req.id);
      await c.functions.invoke("push", { body: { to: req.user_id, kind: "avatar", title: "🎨 Tu personaje está listo", text: "Entra en tu perfil para verlo." } }).catch(() => {});
      log(`Listo el de ${req.name || "alguien"}.`, "ok");
      setTimeout(tick, 1000);
    } catch (e) {
      await c.from("avatar_requests").update({ status: "error", error: String(e.message || e).slice(0, 300), updated_at: new Date().toISOString() }).eq("id", req.id);
      log("Falló: " + (e.message || e), "err");
    }
  } catch (e) { log("Error: " + (e.message || e), "err"); }
  finally { busy = false; }
}

app.registerExtension({
  name: "modocampana.avatares",
  async setup() { panel(); await tick(); backfillLatest(); setInterval(tick, EVERY); },
});
