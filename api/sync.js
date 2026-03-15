// api/sync.js — Vercel KV persistence for Quant Tracker
// Supports GET (pull all), POST (set one key), PUT (replace all), DELETE (clear all)

const KV_NAMESPACE = 'qt_';

async function kvGet(key) {
  const url = `${process.env.KV_REST_API_URL}/get/${encodeURIComponent(KV_NAMESPACE + key)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.result;
}

async function kvSet(key, value) {
  const url = `${process.env.KV_REST_API_URL}/set/${encodeURIComponent(KV_NAMESPACE + key)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(value)
  });
  return res.ok;
}

async function kvKeys(prefix) {
  const url = `${process.env.KV_REST_API_URL}/keys/${encodeURIComponent(KV_NAMESPACE + (prefix || '') + '*')}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.result || []).map(k => k.replace(KV_NAMESPACE, ''));
}

async function kvDelete(key) {
  const url = `${process.env.KV_REST_API_URL}/del/${encodeURIComponent(KV_NAMESPACE + key)}`;
  await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` }
  });
}

export default async function handler(req, res) {
  // CORS for same-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Check KV env vars
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    // No KV configured — return empty (app works fully offline via PouchDB)
    if (req.method === 'GET') return res.status(200).json({});
    return res.status(200).json({ ok: true, note: 'KV not configured' });
  }

  try {
    // GET — pull all user data
    if (req.method === 'GET') {
      const keys = await kvKeys('rq_');
      if (!keys.length) return res.status(200).json({});
      const entries = await Promise.all(
        keys.map(async k => {
          const val = await kvGet(k);
          return [k, val !== null ? JSON.parse(val) : null];
        })
      );
      const result = Object.fromEntries(entries.filter(([, v]) => v !== null));
      return res.status(200).json(result);
    }

    // POST — set a single key
    if (req.method === 'POST') {
      const { key, value } = req.body;
      if (!key) return res.status(400).json({ error: 'Missing key' });
      await kvSet(key, JSON.stringify(value));
      return res.status(200).json({ ok: true });
    }

    // PUT — replace entire dataset (import / bulk push)
    if (req.method === 'PUT') {
      const data = req.body;
      if (typeof data !== 'object') return res.status(400).json({ error: 'Body must be JSON object' });
      await Promise.all(
        Object.entries(data).map(([key, value]) => kvSet(key, JSON.stringify(value)))
      );
      return res.status(200).json({ ok: true, count: Object.keys(data).length });
    }

    // DELETE — clear all data
    if (req.method === 'DELETE') {
      const keys = await kvKeys('rq_');
      await Promise.all(keys.map(k => kvDelete(k)));
      return res.status(200).json({ ok: true, deleted: keys.length });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[api/sync] error:', err);
    return res.status(500).json({ error: err.message });
  }
}
