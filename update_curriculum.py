import re
import os

print("Starting update script...")

# 1. Update style.css
css_additions = """
/* ══════════════ CURRICULUM ══════════════ */
.curr-legend { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 24px; padding: 16px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); }
.curr-res { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; padding: 4px 12px; border-radius: 20px; text-decoration: none; font-weight: 600; font-family: var(--font-body); transition: all 0.2s;}
.curr-res.vid { background: rgba(239,68,68,.15); color: #fca5a5; border: 1px solid rgba(239,68,68,.3); }
.curr-res.book { background: rgba(16,185,129,.15); color: #6ee7b7; border: 1px solid rgba(16,185,129,.3); }
.curr-res.nb { background: rgba(245,158,11,.15); color: #fcd34d; border: 1px solid rgba(245,158,11,.3); }
.curr-res.web { background: rgba(59,130,246,.15); color: #93c5fd; border: 1px solid rgba(59,130,246,.3); }
.curr-res.paper { background: rgba(168,85,247,.15); color: #d8b4fe; border: 1px solid rgba(168,85,247,.3); }
.curr-res.tool { background: rgba(6,182,212,.15); color: #67e8f9; border: 1px solid rgba(6,182,212,.3); }
.curr-res:hover { filter: brightness(1.2); transform: translateY(-1px); }

.curr-phase { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); margin-bottom: 24px; overflow: hidden; }
.curr-phase-hdr { display: flex; align-items: center; gap: 16px; padding: 20px 24px; border-bottom: 1px solid var(--border); background: var(--surface2); }
.curr-phase-num { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent2)); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-family: var(--font-display); }
.curr-phase-hdr h2 { font-size: 18px; font-weight: 700; color: var(--text); }
.curr-phase-hdr .dur { margin-left: auto; font-size: 12px; font-weight: 600; color: var(--text3); font-family: var(--font-mono); }
.curr-phase-body { padding: 24px; }
.curr-goal { font-size: 13px; color: var(--text2); margin-bottom: 20px; line-height: 1.6; }

.curr-mod { margin-bottom: 24px; }
.curr-mod-title { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.curr-mod-title::before { content: ''; width: 4px; height: 16px; background: var(--accent); border-radius: 2px; }

.curr-topic { margin-bottom: 12px; padding-left: 12px; border-left: 1px solid var(--border2); }
.curr-topic-name { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 8px; }
.curr-resources { display: flex; flex-wrap: wrap; gap: 8px; }

.curr-project { background: var(--surface2); border-left: 3px solid var(--accent); border-radius: 8px; padding: 16px; margin-top: 16px; }
.curr-project-label { font-size: 11px; font-weight: 700; letter-spacing: 1px; color: var(--accent); text-transform: uppercase; margin-bottom: 8px; font-family: var(--font-mono); }
.curr-project p { font-size: 13px; color: var(--text2); line-height: 1.6; }
.curr-checklist { list-style: none; padding: 0; margin-top: 10px; }
.curr-checklist li { font-size: 13px; color: var(--text2); padding: 4px 0 4px 22px; position: relative; }
.curr-checklist li::before { content: '✓'; position: absolute; left: 0; color: var(--green); font-weight: bold; }

.curr-timeline { background: var(--surface); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 24px; border: 1px solid var(--border); }
.curr-timeline h2 { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 18px; text-transform: uppercase; letter-spacing: 1px; }
.curr-tl-row { display: flex; align-items: center; margin-bottom: 12px; gap: 12px; }
.curr-tl-label { font-size: 12px; font-weight: 600; color: var(--text3); width: 90px; flex-shrink: 0; }
.curr-tl-bar-wrap { flex: 1; background: var(--surface3); border-radius: 20px; height: 22px; overflow: hidden; }
.curr-tl-bar { height: 100%; border-radius: 20px; display: flex; align-items: center; padding-left: 10px; font-size: 11px; font-weight: 700; color: white; }
.curr-tl-dur { font-size: 12px; color: var(--text3); width: 70px; flex-shrink: 0; text-align: right; }

.curr-toc { display: none; }
"""

with open("css/style.css", "a", encoding="utf-8") as f:
    f.write(css_additions)
print("Updated style.css")

# 2. Extract HTML from study plan
with open("quant_algo_trading_study_plan.html", "r", encoding="utf-8") as f:
    html = f.read()

match = re.search(r'<div class="container">(.*?)</div><!-- /container -->', html, re.DOTALL)
container = match.group(1) if match else ""

replacements = {
    'class="legend"': 'class="curr-legend"',
    'class="res ': 'class="curr-res ',
    'class="phase"': 'class="curr-phase"',
    'class="phase-header"': 'class="curr-phase-hdr"',
    'class="phase-num"': 'class="curr-phase-num"',
    'class="phase-body"': 'class="curr-phase-body"',
    'class="phase-goal"': 'class="curr-goal"',
    'class="module"': 'class="curr-mod"',
    'class="module-title"': 'class="curr-mod-title"',
    'class="topic"': 'class="curr-topic"',
    'class="topic-name"': 'class="curr-topic-name"',
    'class="resources"': 'class="curr-resources"',
    'class="project"': 'class="curr-project"',
    'class="project-label"': 'class="curr-project-label"',
    'class="checklist"': 'class="curr-checklist"',
    'class="timeline"': 'class="curr-timeline"',
    'class="tl-row"': 'class="curr-tl-row"',
    'class="tl-label"': 'class="curr-tl-label"',
    'class="tl-bar-wrap"': 'class="curr-tl-bar-wrap"',
    'class="tl-bar"': 'class="curr-tl-bar"',
    'class="tl-dur"': 'class="curr-tl-dur"',
    'class="toc"': 'class="curr-toc"',
    'class="tools-grid"': 'class="settings-grid"',
    'class="tool-card"': 'class="settings-card"',
    '<h4>': '<h3 style="margin-bottom:8px;font-size:14px;color:var(--accent)">',
    '</h4>': '</h3>',
    # Ensure links open properly in dashboard context
}

for k, v in replacements.items():
    container = container.replace(k, v)

print("Parsed curriculum HTML")

# 3. Update index.html
with open("index.html", "r", encoding="utf-8") as f:
    idx = f.read()

tab = '''<button class="nav-link" data-page="curriculum" onclick="navigate('curriculum')">
      <span class="nav-icon">🎓</span><span>Curriculum & Links</span>
    </button>
    <button class="nav-link" data-page="settings"'''
idx = idx.replace('<button class="nav-link" data-page="settings"', tab)

# Update the view links button
idx = idx.replace('<a href="quant_algo_trading_study_plan.html" target="_blank"', '<a href="#curriculum" onclick="navigate(\'curriculum\')"')

reminders = '''
    <!-- Reminders -->
    <div class="dash-grid" style="grid-template-columns: 1fr; margin-top: 20px;">
      <div class="panel">
        <div class="panel-title">🔔 Study Reminders & Notes</div>
        <div class="add-task-row">
          <input type="text" id="new-reminder-input" placeholder="Add a reminder (e.g. Watch StatQuest Video at 8PM)..." onkeydown="if(event.key==='Enter')addReminder()"/>
          <button class="add-btn" onclick="addReminder()">+ Add</button>
        </div>
        <div id="reminders-list" style="margin-top:16px; display:flex; flex-direction:column; gap: 8px;"></div>
      </div>
    </div>
    '''
idx = idx.replace('<!-- Chart + activity -->', reminders + '\\n    <!-- Chart + activity -->')

page = f'''
  <!-- ── CURRICULUM ── -->
  <div id="page-curriculum" class="page">
    <div class="page-header">
      <h1>Curriculum & Video Links</h1>
      <p>Full 12-month study plan with YouTube links, notebooks, and resources.</p>
    </div>
    <div style="max-width: 800px;">
      {container}
    </div>
  </div>
'''
idx = idx.replace('<!-- ── SETTINGS & DB ── -->', page + '\\n  <!-- ── SETTINGS & DB ── -->')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(idx)

print("Updated index.html")

# 4. Update js/app.js
with open("js/app.js", "r", encoding="utf-8") as f:
    app = f.read()

app = app.replace("else if (page === 'settings') renderSettings();", "else if (page === 'settings') renderSettings();\\n  else if (page === 'curriculum') renderCurriculum();")

reminders_js = '''
// ═══════════════════ REMINDERS ═══════════════════
function renderReminders() {
  const reminders = load(STORE.REMINDERS, []);
  const el = document.getElementById('reminders-list');
  if (!el) return;
  if (!reminders.length) { el.innerHTML = '<div class="empty-state" style="padding:16px">No reminders set. Add one above!</div>'; return; }
  el.innerHTML = reminders.map((r,i) => `
    <div class="task-item" style="padding: 12px 16px;">
      <div style="flex:1">
        <div class="task-text" style="font-size:14px; font-weight: 500; color:var(--text);">${r.text}</div>
        <div style="font-size:11px; color:var(--text3); margin-top:6px; font-family:var(--font-mono)">Added: ${new Date(r.date).toLocaleDateString('en-IN', {weekday:'short', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}</div>
      </div>
      <button class="del-btn" onclick="deleteReminder(${i})">🗑️</button>
    </div>`).join('');
}

function addReminder() {
  const input = document.getElementById('new-reminder-input');
  const text = input?.value.trim();
  if (!text) return;
  const reminders = load(STORE.REMINDERS, []);
  reminders.push({ text, date: new Date().toISOString() });
  save(STORE.REMINDERS, reminders);
  if (input) input.value = '';
  renderReminders();
  showToast('Reminder added! 🔔');
}

function deleteReminder(i) {
  const reminders = load(STORE.REMINDERS, []);
  reminders.splice(i, 1);
  save(STORE.REMINDERS, reminders);
  renderReminders();
}
'''
app = app.replace("// ═══════════════════ PROGRESS ═══════════════════", reminders_js + "\\n// ═══════════════════ PROGRESS ═══════════════════")
app = app.replace("renderWeekChart(studyLog);", "renderWeekChart(studyLog);\\n\\n  // Reminders\\n  renderReminders();")
app = app.replace("// ═══════════════════ DASHBOARD ═══════════════════", "function renderCurriculum() { /* Static HTML already loaded */ }\\n\\n// ═══════════════════ DASHBOARD ═══════════════════")

with open("js/app.js", "w", encoding="utf-8") as f:
    f.write(app)

print("Updated app.js")
print("Done!")
