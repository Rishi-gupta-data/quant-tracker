// ═══════════════════════════════════════════════════════
//  RISHI'S QUANT TRACKER — Database Layer (PouchDB)
//  Runs 100% in-browser (IndexedDB), no server needed.
//  All ops are async/await. Falls back to localStorage
//  if PouchDB fails to init.
// ═══════════════════════════════════════════════════════

const DB_NAME = 'quant_tracker_rishi';

// ── Single PouchDB instance ──
let _db = null;
let _dbReady = false;

async function initDB() {
  try {
    _db = new PouchDB(DB_NAME);
    // Verify it works
    await _db.info();
    _dbReady = true;
    console.log('%c[DB] PouchDB ready ✓', 'color:#10b981;font-weight:700');

    // Migrate any existing localStorage data on first run
    await migrateFromLocalStorage();
  } catch (err) {
    console.warn('[DB] PouchDB failed, falling back to localStorage:', err);
    _dbReady = false;
  }
}

// ── Core get/set/delete (all return Promises) ──
async function dbGet(key) {
  if (!_dbReady) return lsGet(key);
  try {
    const doc = await _db.get(key);
    return doc.value;
  } catch (e) {
    if (e.status === 404) return null;
    console.error('[DB] get error:', e);
    return lsGet(key); // fallback
  }
}

async function dbSet(key, value) {
  if (!_dbReady) { lsSet(key, value); return; }
  try {
    let existing = null;
    try { existing = await _db.get(key); } catch (e) { /* not found = new doc */ }
    const doc = existing
      ? { _id: key, _rev: existing._rev, value, updatedAt: new Date().toISOString() }
      : { _id: key, value, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    await _db.put(doc);
  } catch (e) {
    console.error('[DB] set error:', e);
    lsSet(key, value); // fallback
  }
}

async function dbDelete(key) {
  if (!_dbReady) { localStorage.removeItem(key); return; }
  try {
    const doc = await _db.get(key);
    await _db.remove(doc);
  } catch (e) { /* already gone */ }
}

// Export full database as JSON string
async function dbExport() {
  if (!_dbReady) return JSON.stringify(Object.fromEntries(Object.entries(localStorage)));
  const all = await _db.allDocs({ include_docs: true });
  const out = {};
  all.rows.forEach(r => { if (!r.id.startsWith('_')) out[r.id] = r.doc.value; });
  return JSON.stringify(out, null, 2);
}

// Import from JSON string
async function dbImport(jsonStr) {
  const data = JSON.parse(jsonStr);
  for (const [key, value] of Object.entries(data)) {
    await dbSet(key, value);
  }
}

// ── DB Stats ──
async function dbStats() {
  if (!_dbReady) return { engine: 'localStorage', docs: Object.keys(localStorage).length };
  const info = await _db.info();
  return {
    engine: 'PouchDB (IndexedDB)',
    name: info.db_name,
    docs: info.doc_count,
    size: info.sizes?.file ? (info.sizes.file / 1024).toFixed(1) + ' KB' : 'N/A',
    adapter: _db.adapter,
  };
}

// ── localStorage fallback ──
function lsGet(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { console.error('[LS]', e); }
}

// ── Migrate existing localStorage data to PouchDB (runs once) ──
async function migrateFromLocalStorage() {
  const migrated = await dbGet('__migrated_v1');
  if (migrated) return; // already done

  const keys = Object.values(STORE);
  let count = 0;
  for (const key of keys) {
    const val = lsGet(key);
    if (val !== null && val !== undefined) {
      await dbSet(key, val);
      count++;
    }
  }
  // Also migrate custom tasks
  const ct = lsGet('rq_custom_tasks');
  if (ct) { await dbSet('rq_custom_tasks', ct); count++; }

  await dbSet('__migrated_v1', true);
  if (count > 0) console.log(`[DB] Migrated ${count} keys from localStorage`);
}

// ═══════════════════════════════════════════════════════
//  STORE KEYS (same as before — used everywhere)
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
//  HIGH-LEVEL API — used throughout app.js
//  All return resolved values (not promises) via cache,
//  and write-through async. App state is cached in memory
//  for synchronous UI rendering.
// ═══════════════════════════════════════════════════════

// In-memory cache so UI renders synchronously
const _cache = {};

// Load all keys into cache on boot, then resolve
async function loadAllIntoCache() {
  const keys = [...Object.values(STORE), 'rq_custom_tasks'];
  await Promise.all(keys.map(async key => {
    const val = await dbGet(key);
    _cache[key] = val;
  }));
}

// Synchronous cache read (use after boot)
function load(key, def = null) {
  const val = _cache[key];
  if (val === null || val === undefined) return def;
  return val;
}

// Write to cache + async persist
function save(key, val) {
  _cache[key] = val;
  dbSet(key, val); // fire and forget
}

// ═══════════════════════════════════════════════════════
//  DB SETTINGS PAGE HELPERS
// ═══════════════════════════════════════════════════════
async function renderDBStatus() {
  const el = document.getElementById('db-status-panel');
  if (!el) return;
  const stats = await dbStats();
  el.innerHTML = `
    <div class="db-stat-row"><span>Engine</span><strong>${stats.engine}</strong></div>
    <div class="db-stat-row"><span>Documents</span><strong>${stats.docs}</strong></div>
    ${stats.size ? `<div class="db-stat-row"><span>Size</span><strong>${stats.size}</strong></div>` : ''}
    ${stats.adapter ? `<div class="db-stat-row"><span>Adapter</span><strong>${stats.adapter}</strong></div>` : ''}
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
      showToast('Data imported successfully! 🎉');
      navigate(currentPage);
    } catch (err) {
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
  showToast('All data cleared.', 'error');
  setTimeout(() => navigate('dashboard'), 1000);
}
