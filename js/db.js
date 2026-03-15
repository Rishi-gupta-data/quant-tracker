// ═══════════════════════════════════════════════════════
//  RISHI'S QUANT TRACKER — Database Layer
//  PouchDB (IndexedDB) as local cache + cloud sync
//  via Vercel KV through /api/sync endpoint.
// ═══════════════════════════════════════════════════════

const DB_NAME = 'quant_tracker_rishi';
let _db = null;
let _dbReady = false;
let _cloudSynced = false;

// ── Init ──
async function initDB() {
  try {
    _db = new PouchDB(DB_NAME);
    await _db.info();
    _dbReady = true;
    console.log('%c[DB] PouchDB ready ✓', 'color:#10b981;font-weight:700');
    await migrateFromLocalStorage();
    // Pull latest from cloud on boot
    await cloudPull();
  } catch (err) {
    console.warn('[DB] PouchDB failed, falling back to localStorage:', err);
    _dbReady = false;
  }
}

// ── Core get/set/delete ──
async function dbGet(key) {
  if (!_dbReady) return lsGet(key);
  try {
    const doc = await _db.get(key);
    return doc.value;
  } catch (e) {
    if (e.status === 404) return null;
    return lsGet(key);
  }
}

async function dbSet(key, value) {
  if (!_dbReady) { lsSet(key, value); return; }
  try {
    let existing = null;
    try { existing = await _db.get(key); } catch {}
    const doc = existing
      ? { _id: key, _rev: existing._rev, value, updatedAt: new Date().toISOString() }
      : { _id: key, value, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    await _db.put(doc);
  } catch (e) {
    lsSet(key, value);
  }
}

async function dbDelete(key) {
  if (!_dbReady) { localStorage.removeItem(key); return; }
  try { const doc = await _db.get(key); await _db.remove(doc); } catch {}
}

// ── Cloud Sync ──
async function cloudPull() {
  try {
    const res = await fetch('/api/sync', { method: 'GET' });
    if (!res.ok) return;
    const data = await res.json();
    if (data && typeof data === 'object' && Object.keys(data).length > 0) {
      for (const [key, value] of Object.entries(data)) {
        await dbSet(key, value);
      }
      _cloudSynced = true;
      console.log('%c[DB] Cloud pull ✓ (' + Object.keys(data).length + ' keys)', 'color:#10b981');
    }
  } catch (e) {
    console.warn('[DB] Cloud pull skipped (offline?):', e.message);
  }
}

async function cloudPush(key, value) {
  try {
    await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    });
  } catch (e) {
    console.warn('[DB] Cloud push failed (will retry on next save):', e.message);
  }
}

async function cloudPushAll() {
  try {
    if (!_dbReady) return;
    const all = await _db.allDocs({ include_docs: true });
    const out = {};
    all.rows.forEach(r => { if (!r.id.startsWith('_')) out[r.id] = r.doc.value; });
    await fetch('/api/sync', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(out)
    });
    showToast('Synced to cloud ☁️');
  } catch (e) {
    console.warn('[DB] Full push failed:', e.message);
  }
}

// ── Export / Import ──
async function dbExport() {
  if (!_dbReady) return JSON.stringify(Object.fromEntries(Object.entries(localStorage)));
  const all = await _db.allDocs({ include_docs: true });
  const out = {};
  all.rows.forEach(r => { if (!r.id.startsWith('_')) out[r.id] = r.doc.value; });
  return JSON.stringify(out, null, 2);
}

async function dbImport(jsonStr) {
  const data = JSON.parse(jsonStr);
  for (const [key, value] of Object.entries(data)) await dbSet(key, value);
  // Push imported data to cloud too
  await fetch('/api/sync', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: jsonStr
  }).catch(() => {});
}

// ── DB Stats ──
async function dbStats() {
  if (!_dbReady) return { engine: 'localStorage', docs: Object.keys(localStorage).length };
  const info = await _db.info();
  return {
    engine: 'PouchDB + Vercel KV',
    name: info.db_name,
    docs: info.doc_count,
    size: info.sizes?.file ? (info.sizes.file / 1024).toFixed(1) + ' KB' : 'N/A',
    adapter: _db.adapter,
    cloud: _cloudSynced ? '✓ synced' : '⟳ pending'
  };
}

// ── localStorage fallback ──
function lsGet(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }
function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { console.error('[LS]', e); } }

// ── Migrate localStorage → PouchDB ──
async function migrateFromLocalStorage() {
  const migrated = await dbGet('__migrated_v1');
  if (migrated) return;
  const keys = [...Object.values(STORE), 'rq_custom_tasks'];
  let count = 0;
  for (const key of keys) {
    const val = lsGet(key);
    if (val !== null && val !== undefined) { await dbSet(key, val); count++; }
  }
  await dbSet('__migrated_v1', true);
  if (count > 0) console.log(`[DB] Migrated ${count} keys from localStorage`);
}

// ═══════════════════════════════════════════════════════
//  STORE KEYS
// ═══════════════════════════════════════════════════════
const STORE = {
  PROGRESS:       'rq_progress',
  QUIZ_SCORES:    'rq_quiz_scores',
  FC_STATUS:      'rq_fc_status',
  TASKS:          'rq_tasks',
  WEEKLY_REVIEWS: 'rq_weekly_reviews',
  CURRENT_WEEK:   'rq_current_week',
  NOTES:          'rq_notes',
  STUDY_LOG:      'rq_study_log',
  REMINDERS:      'rq_reminders',
  CUSTOM_TASKS:   'rq_custom_tasks',
  SETTINGS:       'rq_settings',
};

// ═══════════════════════════════════════════════════════
//  IN-MEMORY CACHE
// ═══════════════════════════════════════════════════════
const _cache = {};

async function loadAllIntoCache() {
  const keys = [...Object.values(STORE), 'rq_custom_tasks'];
  await Promise.all(keys.map(async key => {
    const val = await dbGet(key);
    _cache[key] = val;
  }));
}

function load(key, def = null) {
  const val = _cache[key];
  if (val === null || val === undefined) return def;
  return val;
}

function save(key, val) {
  _cache[key] = val;
  dbSet(key, val);        // persist locally
  cloudPush(key, val);    // sync to cloud (fire & forget)
}

// ═══════════════════════════════════════════════════════
//  SETTINGS PAGE HELPERS
// ═══════════════════════════════════════════════════════
async function renderDBStatus() {
  const el = document.getElementById('db-status-panel');
  if (!el) return;
  const stats = await dbStats();
  el.innerHTML = `
    <div class="db-stat-row"><span>Engine</span><strong>${stats.engine}</strong></div>
    <div class="db-stat-row"><span>Documents</span><strong>${stats.docs}</strong></div>
    ${stats.size ? `<div class="db-stat-row"><span>Local Size</span><strong>${stats.size}</strong></div>` : ''}
    ${stats.adapter ? `<div class="db-stat-row"><span>Adapter</span><strong>${stats.adapter}</strong></div>` : ''}
    <div class="db-stat-row"><span>Cloud</span><strong>${stats.cloud || '—'}</strong></div>
    <div class="db-stat-row"><span>Status</span><strong style="color:${_dbReady ? '#10b981' : '#f59e0b'}">${_dbReady ? '● Online' : '⚠ Fallback mode'}</strong></div>
  `;
}

async function exportData() {
  const json = await dbExport();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `quant-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Backup downloaded! 💾');
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    try {
      await dbImport(text);
      await loadAllIntoCache();
      showToast('Data imported & synced to cloud! 🎉');
      navigate(currentPage);
    } catch {
      showToast('Import failed — invalid file', 'error');
    }
  };
  input.click();
}

async function clearAllData() {
  if (!confirm('⚠️ This will delete ALL your progress, notes, and study logs. Are you sure?')) return;
  if (!confirm('Really sure? This cannot be undone.')) return;
  if (_dbReady) {
    const all = await _db.allDocs();
    await Promise.all(all.rows.map(r => _db.remove(r.id, r.value)));
  }
  localStorage.clear();
  Object.keys(_cache).forEach(k => delete _cache[k]);
  // Also clear cloud
  await fetch('/api/sync', { method: 'DELETE' }).catch(() => {});
  showToast('All data cleared.', 'error');
  setTimeout(() => navigate('dashboard'), 1000);
}
