// Modo Campaña · generador automático de personajes.
// Mientras ComfyUI está abierto, mira cada minuto si alguien ha pedido un personaje en la app,
// lo genera a partir del maniquí (así todos tienen el mismo cuerpo), le quita el fondo, lo sube y le avisa.
import { app } from "../../scripts/app.js";

const SUPABASE_URL = "https://kbifpoklblhygigtzbpd.supabase.co";
const SUPABASE_KEY = "sb_publishable_2RW_a6X-IlB2naB7oV8Png_tslgo8ZS";            // clave publicable (no es secreta)
const BASE_FILE = { filename: "maniqui_00002_.png", subfolder: "modocampana" };   // cuerpo base
const STYLE = "3D render of one stylized streetwear doll character, collectible designer fashion figure, full body, front view, standing straight with arms relaxed down along the body, feet slightly apart, oversized big head, big almond eyes with long lashes, small pouty lips, rosy cheeks, slim small body, very detailed realistic fabric textures with stitching and folds, oversized baggy layered streetwear outfit, soft studio lighting, soft shadow on the floor, plain white background, centered, ultra detailed octane render, no logos, no text, no brand names";
const DENOISE = { nuevo: 0.82, cambio: 0.72, retoque: 0.55 }, EVERY = 60_000;
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
    .mc-box button{margin-top:4px;padding:4px 8px;border-radius:6px;border:0;background:#C7B5FF;color:#111;font-weight:700;cursor:pointer}
    .mc-box[data-kind=ok] .mc-st{color:#8f8}.mc-box[data-kind=err] .mc-st{color:#f88}.mc-box .mc-x{float:right;cursor:pointer;opacity:.6}</style>
    <span class="mc-x" title="Ocultar">×</span><b>Modo Campaña · personajes</b><div class="mc-st">Arrancando…</div><form class="mc-login" hidden>
    <input name="e" type="email" placeholder="Tu email de la app" autocomplete="username"><input name="p" type="password" placeholder="Contraseña" autocomplete="current-password"><button>Entrar</button></form>`;
  document.body.appendChild(box);
  box.querySelector(".mc-x").onclick = () => { box.style.display = "none"; };
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
  async setup() { panel(); await tick(); setInterval(tick, EVERY); },
});
