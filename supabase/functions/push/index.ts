// Avisos al móvil de Modo Campaña.
// - La app la llama con la sesión del usuario para avisar a un amigo (caña, duelo, invitación, reacción, adelantamiento).
// - El cron la llama cada hora con el secreto CRON_SECRET para el recordatorio diario.
// Secretos necesarios: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, CRON_SECRET (SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY ya vienen puestos).
import webpush from 'npm:web-push@3.6.7';
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-cron-secret' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
webpush.setVapidDetails('mailto:avisos@modo-campana.app', Deno.env.get('VAPID_PUBLIC_KEY')!, Deno.env.get('VAPID_PRIVATE_KEY')!);

// Avisos que se mandan aunque no sea uno de tus rivales (son cosas que te mandan a ti directamente)
const DIRECT = ['duel', 'invite'];
const KINDS = ['nudge', 'duel', 'invite', 'react', 'overtake'];

type Sub = { endpoint: string; p256dh: string; auth: string; user_id: string; kinds: string[]; rivals: string[]; hour: number; hour2: number | null; done_day: string | null };

async function sendTo(subs: Sub[], payload: Record<string, unknown>) {
  let sent = 0;
  await Promise.all(subs.map(async s => {
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, JSON.stringify(payload), { TTL: 60 * 60 * 12 });
      sent++;
    } catch (e) {
      const code = (e as { statusCode?: number }).statusCode;
      if (code === 404 || code === 410) await admin.from('push_subs').delete().eq('endpoint', s.endpoint);   // suscripción caducada
    }
  }));
  return sent;
}

const madrid = () => {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false }).formatToParts(new Date());
  const get = (t: string) => parts.find(p => p.type === t)!.value;
  return { day: `${get('year')}-${get('month')}-${get('day')}`, hour: Number(get('hour')) % 24 };
};

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const body = await req.json().catch(() => ({}));

  // ---- Recordatorio diario (cron cada hora) ----
  if (body.cron) {
    if (req.headers.get('x-cron-secret') !== Deno.env.get('CRON_SECRET')) return json({ error: 'no' }, 401);
    const { day, hour } = madrid();
    const { data: subs } = await admin.from('push_subs').select('*').or(`hour.eq.${hour},hour2.eq.${hour}`).contains('kinds', ['reminder']);
    const pending = (subs || []).filter((s: Sub) => s.done_day !== day);
    const ids = [...new Set(pending.map((s: Sub) => s.user_id))];
    const { data: profiles } = ids.length ? await admin.from('profiles').select('user_id,name,streak').in('user_id', ids) : { data: [] };
    let sent = 0;
    for (const id of ids) {
      const p = (profiles || []).find((x: { user_id: string }) => x.user_id === id) as { name?: string; streak?: number } | undefined;
      const streak = p?.streak || 0;
      sent += await sendTo(pending.filter((s: Sub) => s.user_id === id), {
        title: streak > 1 ? `🔥 No pierdas tu racha de ${streak} días` : '⚔️ Te quedan misiones hoy',
        body: streak > 1 ? 'Aún te quedan misiones de hoy. Una y la racha sigue.' : 'Haz tus misiones de hoy y abre el cofre.',
        url: './', tag: 'reminder',
      });
    }
    return json({ ok: true, hour, sent });
  }

  // ---- Aviso de un jugador a otro ----
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '');
  const { data: auth } = await admin.auth.getUser(token);
  const from = auth?.user;
  if (!from) return json({ error: 'sin sesión' }, 401);
  const { to, kind, title, text, url } = body as { to?: string; kind?: string; title?: string; text?: string; url?: string };
  if (!to || to === from.id || !kind || !KINDS.includes(kind) || !title) return json({ error: 'datos' }, 400);

  // Que no se pueda usar para mandar spam: máximo 30 avisos por hora de cada jugador
  const since = new Date(Date.now() - 3600_000).toISOString();
  const { count } = await admin.from('push_log').select('id', { count: 'exact', head: true }).eq('from_id', from.id).gte('created_at', since);
  if ((count || 0) >= 30) return json({ error: 'demasiados' }, 429);
  await admin.from('push_log').insert({ from_id: from.id, to_id: to, kind });

  const { data: subs } = await admin.from('push_subs').select('*').eq('user_id', to);
  const ok = (subs || []).filter((s: Sub) => s.kinds.includes(kind) && (DIRECT.includes(kind) || !s.rivals.length || s.rivals.includes(from.id)));
  const sent = await sendTo(ok, { title: String(title).slice(0, 80), body: String(text || '').slice(0, 160), url: url || './', tag: kind });
  return json({ ok: true, sent });
});
