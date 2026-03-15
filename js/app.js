// ═══════════════════════════════════════════════════════
//  RISHI'S QUANT TRACKER — App Logic
// ═══════════════════════════════════════════════════════

// ── State ──
let currentPage = 'dashboard';
let fcIndex = 0, fcPhaseFilter = 'all', fcFlipped = false;
let quizState = { questions: [], index: 0, score: 0, answers: [], phase: 'all', active: false };

// ── Router ──
function navigate(page) {
  currentPage = page;
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.page === page));
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === 'page-' + page));
  window.location.hash = page;
  if (page === 'dashboard') renderDashboard();
  else if (page === 'progress') renderProgress();
  else if (page === 'flashcards') renderFlashcards();
  else if (page === 'quiz') renderQuiz();
  else if (page === 'tasks') renderTasks();
  else if (page === 'review') renderReview();
  else if (page === 'notes') renderNotes();
}

window.addEventListener('hashchange', () => {
  const h = location.hash.replace('#','') || 'dashboard';
  navigate(h);
});

// ═══════════════════ DASHBOARD ═══════════════════
function renderDashboard() {
  const progress = load(STORE.PROGRESS, {});
  const studyLog = load(STORE.STUDY_LOG, []);
  const currentWeek = load(STORE.CURRENT_WEEK, 1);
  const tasks = load(STORE.TASKS, {});

  // Overall progress
  const totalTopics = APP_DATA.phases.reduce((s, p) => s + p.topics.length, 0);
  const doneTopic = Object.values(progress).filter(v => v === 'done').length;
  const pct = Math.round(doneTopic / totalTopics * 100);

  // This week tasks
  const weekTasks = APP_DATA.weeklyTasks.find(w => w.week === currentWeek);
  const weekDone = weekTasks ? weekTasks.tasks.filter(t => tasks[t.id]).length : 0;
  const weekTotal = weekTasks ? weekTasks.tasks.length : 0;

  // Study hours this week
  const now = new Date();
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay() + 1);
  weekStart.setHours(0,0,0,0);
  const hoursThisWeek = studyLog.filter(e => new Date(e.date) >= weekStart).reduce((s,e) => s+e.hours, 0);

  // Streak
  const streak = calcStreak(studyLog);

  // Current phase
  const currentPhase = getCurrentPhase(currentWeek);

  document.getElementById('dash-overall-pct').textContent = pct + '%';
  document.getElementById('dash-overall-bar').style.width = pct + '%';
  document.getElementById('dash-topics-done').textContent = doneTopic + ' / ' + totalTopics + ' topics';
  document.getElementById('dash-week-tasks').textContent = weekDone + ' / ' + weekTotal;
  document.getElementById('dash-hours-week').textContent = hoursThisWeek.toFixed(1) + ' / 19.5 hrs';
  document.getElementById('dash-streak').textContent = streak + ' days 🔥';
  document.getElementById('dash-current-week').textContent = 'Week ' + currentWeek;

  const phase = APP_DATA.phases.find(p => p.id === currentPhase) || APP_DATA.phases[0];
  const phEl = document.getElementById('dash-current-phase');
  phEl.textContent = 'Phase ' + phase.num + ': ' + phase.title;
  phEl.style.color = phase.color;

  // Recent activity
  renderActivityFeed(studyLog);

  // Mini phase strip
  renderPhaseStrip(progress);

  // Today's tasks
  renderTodayTasks(currentWeek, tasks);

  // Study hours chart
  renderWeekChart(studyLog);
}

function calcStreak(studyLog) {
  if (!studyLog.length) return 0;
  const dates = [...new Set(studyLog.map(e => e.date.split('T')[0]))].sort().reverse();
  let streak = 0;
  let check = new Date(); check.setHours(0,0,0,0);
  for (const d of dates) {
    const dd = new Date(d); dd.setHours(0,0,0,0);
    const diff = (check - dd) / 86400000;
    if (diff <= 1) { streak++; check = dd; } else break;
  }
  return streak;
}

function getCurrentPhase(week) {
  let cumWeeks = 0;
  for (const p of APP_DATA.phases) {
    cumWeeks += p.weeks_count;
    if (week <= cumWeeks) return p.id;
  }
  return 8;
}

function renderActivityFeed(studyLog) {
  const feed = document.getElementById('dash-activity');
  if (!feed) return;
  const recent = [...studyLog].reverse().slice(0, 5);
  if (!recent.length) { feed.innerHTML = '<div class="empty-state">No study sessions logged yet. Log your first session!</div>'; return; }
  feed.innerHTML = recent.map(e => `
    <div class="activity-item">
      <div class="act-dot" style="background:${APP_DATA.phases[e.phase]?.color||'#999'}"></div>
      <div class="act-info">
        <div class="act-title">${e.note || 'Study session'}</div>
        <div class="act-meta">${new Date(e.date).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})} · ${e.hours} hrs · Phase ${e.phase}</div>
      </div>
    </div>
  `).join('');
}

function renderPhaseStrip(progress) {
  const strip = document.getElementById('dash-phase-strip');
  if (!strip) return;
  strip.innerHTML = APP_DATA.phases.map(ph => {
    const phTopics = ph.topics.map((_,i) => `ph${ph.id}_t${i}`);
    const done = phTopics.filter(k => progress[k] === 'done').length;
    const pct = Math.round(done / ph.topics.length * 100);
    return `
      <div class="phase-strip-item" onclick="navigate('progress')" title="Phase ${ph.num}: ${ph.title}">
        <div class="psi-bar-wrap">
          <div class="psi-bar" style="height:${pct}%;background:${ph.color}"></div>
        </div>
        <div class="psi-label" style="color:${ph.color}">${ph.num}</div>
        <div class="psi-pct">${pct}%</div>
      </div>`;
  }).join('');
}

function renderTodayTasks(week, tasks) {
  const el = document.getElementById('dash-today-tasks');
  if (!el) return;
  const today = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date().getDay()];
  const weekTasks = APP_DATA.weeklyTasks.find(w => w.week === week);
  if (!weekTasks) { el.innerHTML = '<div class="empty-state">No tasks for current week</div>'; return; }
  const todayTasks = weekTasks.tasks.filter(t => t.day === today || t.day === 'All');
  if (!todayTasks.length) { el.innerHTML = '<div class="empty-state">No tasks scheduled for today (' + today + ')</div>'; return; }
  el.innerHTML = todayTasks.map(t => `
    <div class="today-task ${tasks[t.id] ? 'done' : ''}">
      <input type="checkbox" ${tasks[t.id] ? 'checked' : ''} onchange="toggleTask('${t.id}', this.checked)"/>
      <span>${t.text}</span>
    </div>`).join('');
}

function renderWeekChart(studyLog) {
  const canvas = document.getElementById('dash-week-chart');
  if (!canvas) return;
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0,0,0,0);

  const targets = [2.5, 2.5, 2.5, 2.5, 2.5, 4, 3];
  const actuals = days.map((_, i) => {
    const d = new Date(monday); d.setDate(monday.getDate() + i);
    const ds = d.toISOString().split('T')[0];
    return studyLog.filter(e => e.date.split('T')[0] === ds).reduce((s,e) => s+e.hours, 0);
  });

  const ctx = canvas.getContext('2d');
  const w = canvas.offsetWidth, h = canvas.offsetHeight;
  canvas.width = w; canvas.height = h;
  ctx.clearRect(0,0,w,h);

  const barW = w / 7 * 0.4, gap = w / 7;
  const maxH = 5;

  days.forEach((day, i) => {
    const x = i * gap + gap * 0.1;
    const targetH = (targets[i] / maxH) * (h - 40);
    const actualH = (actuals[i] / maxH) * (h - 40);

    // Target bar (ghost)
    ctx.fillStyle = 'rgba(26,79,138,0.1)';
    ctx.beginPath();
    ctx.roundRect(x, h - 30 - targetH, barW * 2, targetH, 4);
    ctx.fill();

    // Actual bar
    const color = actuals[i] >= targets[i] ? '#2e7d32' : actuals[i] > 0 ? '#1a4f8a' : 'rgba(26,79,138,0.15)';
    ctx.fillStyle = color;
    if (actualH > 0) {
      ctx.beginPath();
      ctx.roundRect(x + barW * 0.5, h - 30 - actualH, barW, actualH, 4);
      ctx.fill();
    }

    // Day label
    ctx.fillStyle = '#5a6272';
    ctx.font = '10px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(day, x + gap * 0.3, h - 12);

    // Hour label
    if (actuals[i] > 0) {
      ctx.fillStyle = '#1a4f8a';
      ctx.font = 'bold 9px system-ui';
      ctx.fillText(actuals[i].toFixed(1), x + gap * 0.3, h - 34 - actualH);
    }
  });
}

// ═══════════════════ PROGRESS ═══════════════════
function renderProgress() {
  const progress = load(STORE.PROGRESS, {});
  const cont = document.getElementById('progress-phases');
  if (!cont) return;
  cont.innerHTML = APP_DATA.phases.map(ph => {
    const phPcts = ph.topics.map((topic, i) => {
      const key = `ph${ph.id}_t${i}`;
      const status = progress[key] || 'none';
      return { topic, key, status };
    });
    const done = phPcts.filter(t => t.status === 'done').length;
    const inprog = phPcts.filter(t => t.status === 'in-progress').length;
    const pct = Math.round(done / ph.topics.length * 100);

    return `
    <div class="prog-phase-card" id="progph${ph.id}">
      <div class="ppc-header" onclick="togglePhaseCard(${ph.id})">
        <div class="ppc-badge" style="background:${ph.color}">${ph.num}</div>
        <div class="ppc-info">
          <div class="ppc-title">${ph.title}</div>
          <div class="ppc-sub">${ph.weeks} · ${ph.hours} hrs</div>
        </div>
        <div class="ppc-right">
          <div class="ppc-pct" style="color:${ph.color}">${pct}%</div>
          <div class="ppc-bar-wrap"><div class="ppc-bar" style="width:${pct}%;background:${ph.color}"></div></div>
          <div class="ppc-counts">${done} done · ${inprog} in progress</div>
        </div>
        <div class="ppc-chevron">▾</div>
      </div>
      <div class="ppc-topics" id="ppc-topics-${ph.id}">
        ${phPcts.map(({topic, key, status}) => `
          <div class="topic-row ${status}">
            <div class="topic-status-btns">
              <button class="tsb ${status==='none'?'active':''}" onclick="setTopicStatus('${key}','none')" title="Not started">○</button>
              <button class="tsb in ${status==='in-progress'?'active':''}" onclick="setTopicStatus('${key}','in-progress')" title="In progress">◑</button>
              <button class="tsb done ${status==='done'?'active':''}" onclick="setTopicStatus('${key}','done')" title="Done">●</button>
            </div>
            <div class="topic-text">${topic}</div>
          </div>`).join('')}
      </div>
    </div>`;
  }).join('');
}

function togglePhaseCard(id) {
  const el = document.getElementById(`ppc-topics-${id}`);
  const card = document.getElementById(`progph${id}`);
  el.classList.toggle('open');
  card.classList.toggle('expanded');
}

function setTopicStatus(key, status) {
  const progress = load(STORE.PROGRESS, {});
  progress[key] = status;
  save(STORE.PROGRESS, progress);
  renderProgress();
  // Update dashboard strip if visible
  const strip = document.getElementById('dash-phase-strip');
  if (strip) renderPhaseStrip(progress);
}

// ═══════════════════ FLASHCARDS ═══════════════════
function renderFlashcards() {
  const fcStatus = load(STORE.FC_STATUS, {});
  const filtered = fcPhaseFilter === 'all'
    ? APP_DATA.flashcards
    : APP_DATA.flashcards.filter(f => f.phase === parseInt(fcPhaseFilter));

  // Phase filter buttons
  const filterEl = document.getElementById('fc-phase-filter');
  if (filterEl) {
    const phases = ['all', ...new Set(APP_DATA.flashcards.map(f => f.phase))];
    filterEl.innerHTML = phases.map(p => `
      <button class="fc-filter-btn ${fcPhaseFilter == p ? 'active' : ''}" onclick="setFCFilter('${p}')">
        ${p === 'all' ? 'All' : 'Phase ' + APP_DATA.phases[p]?.num}
      </button>`).join('');
  }

  const known = filtered.filter(f => fcStatus[f.id] === 'known').length;
  const total = filtered.length;

  document.getElementById('fc-count').textContent = (fcIndex % total + 1) + ' / ' + total;
  document.getElementById('fc-known-count').textContent = known + ' known';
  document.getElementById('fc-progress-bar').style.width = Math.round(known/total*100) + '%';

  const card = filtered[fcIndex % filtered.length];
  if (!card) return;

  const front = document.getElementById('fc-front');
  const back = document.getElementById('fc-back');
  const flipCard = document.getElementById('fc-card');

  const status = fcStatus[card.id] || 'unknown';
  front.innerHTML = `<div class="fc-q">${card.q}</div><div class="fc-phase-badge" style="background:${APP_DATA.phases[card.phase]?.color||'#999'}">Phase ${APP_DATA.phases[card.phase]?.num}</div>`;
  back.innerHTML = `<div class="fc-a">${card.a.replace(/\n/g,'<br>')}</div>`;

  flipCard.classList.toggle('flipped', fcFlipped);
  flipCard.classList.toggle('status-known', status === 'known');
  flipCard.classList.toggle('status-review', status === 'review');

  document.getElementById('fc-known-btn').disabled = status === 'known';
  document.getElementById('fc-review-btn').disabled = status === 'review';
}

function setFCFilter(f) { fcPhaseFilter = f; fcIndex = 0; fcFlipped = false; renderFlashcards(); }
function flipCard() { fcFlipped = !fcFlipped; renderFlashcards(); }
function nextCard() { const filtered = getFilteredCards(); fcIndex = (fcIndex + 1) % filtered.length; fcFlipped = false; renderFlashcards(); }
function prevCard() { const filtered = getFilteredCards(); fcIndex = (fcIndex - 1 + filtered.length) % filtered.length; fcFlipped = false; renderFlashcards(); }
function getFilteredCards() { return fcPhaseFilter === 'all' ? APP_DATA.flashcards : APP_DATA.flashcards.filter(f => f.phase === parseInt(fcPhaseFilter)); }
function markFC(status) {
  const filtered = getFilteredCards();
  const card = filtered[fcIndex % filtered.length];
  const fcStatus = load(STORE.FC_STATUS, {});
  fcStatus[card.id] = status;
  save(STORE.FC_STATUS, fcStatus);
  nextCard();
}
function shuffleCards() {
  fcIndex = Math.floor(Math.random() * getFilteredCards().length);
  fcFlipped = false;
  renderFlashcards();
}

// ═══════════════════ QUIZ ═══════════════════
function renderQuiz() {
  if (!quizState.active) renderQuizSetup();
  else renderQuizQuestion();
}

function renderQuizSetup() {
  const scores = load(STORE.QUIZ_SCORES, []);
  const bestScore = scores.length ? Math.max(...scores.map(s => s.pct)) : 0;
  const lastScore = scores.length ? scores[scores.length-1] : null;

  document.getElementById('quiz-setup').style.display = 'block';
  document.getElementById('quiz-active').style.display = 'none';
  document.getElementById('quiz-result').style.display = 'none';

  document.getElementById('quiz-best').textContent = bestScore + '%';
  document.getElementById('quiz-attempts').textContent = scores.length;
  document.getElementById('quiz-last').textContent = lastScore ? lastScore.pct + '% (' + lastScore.date + ')' : '—';
}

function startQuiz(phaseFilter) {
  let questions = phaseFilter === 'all' ? APP_DATA.quizQuestions : APP_DATA.quizQuestions.filter(q => q.phase === parseInt(phaseFilter));
  // Shuffle
  questions = [...questions].sort(() => Math.random() - 0.5).slice(0, Math.min(10, questions.length));
  quizState = { questions, index: 0, score: 0, answers: [], phase: phaseFilter, active: true };
  document.getElementById('quiz-setup').style.display = 'none';
  document.getElementById('quiz-active').style.display = 'block';
  document.getElementById('quiz-result').style.display = 'none';
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const q = quizState.questions[quizState.index];
  if (!q) { endQuiz(); return; }

  document.getElementById('quiz-q-num').textContent = (quizState.index + 1) + ' / ' + quizState.questions.length;
  document.getElementById('quiz-q-text').textContent = q.q;
  document.getElementById('quiz-q-phase').textContent = 'Phase ' + APP_DATA.phases[q.phase]?.num + ' · ' + (q.difficulty || 'medium');
  document.getElementById('quiz-q-phase').style.color = APP_DATA.phases[q.phase]?.color;

  const progress = ((quizState.index) / quizState.questions.length * 100);
  document.getElementById('quiz-progress-bar').style.width = progress + '%';

  const opts = document.getElementById('quiz-options');
  opts.innerHTML = q.options.map((opt, i) => `
    <button class="quiz-opt" onclick="answerQuiz(${i})">${String.fromCharCode(65+i)}. ${opt}</button>
  `).join('');

  document.getElementById('quiz-explanation').style.display = 'none';
}

function answerQuiz(chosen) {
  const q = quizState.questions[quizState.index];
  const correct = chosen === q.answer;
  if (correct) quizState.score++;
  quizState.answers.push({ q: q.id, chosen, correct });

  // Highlight options
  const opts = document.querySelectorAll('.quiz-opt');
  opts.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer) btn.classList.add('correct');
    else if (i === chosen && !correct) btn.classList.add('wrong');
  });

  // Show explanation
  const exp = document.getElementById('quiz-explanation');
  exp.style.display = 'block';
  exp.innerHTML = `<div class="exp-header ${correct ? 'correct' : 'wrong'}">${correct ? '✓ Correct!' : '✗ Incorrect'}</div><div class="exp-text">${q.explanation.replace(/\n/g,'<br>')}</div>`;

  // Next button
  setTimeout(() => {
    quizState.index++;
    if (quizState.index >= quizState.questions.length) endQuiz();
    else renderQuizQuestion();
  }, correct ? 1500 : 3000);
}

function endQuiz() {
  quizState.active = false;
  const pct = Math.round(quizState.score / quizState.questions.length * 100);
  const scores = load(STORE.QUIZ_SCORES, []);
  scores.push({ pct, date: new Date().toLocaleDateString('en-IN'), phase: quizState.phase, score: quizState.score, total: quizState.questions.length });
  save(STORE.QUIZ_SCORES, scores);

  document.getElementById('quiz-setup').style.display = 'none';
  document.getElementById('quiz-active').style.display = 'none';
  document.getElementById('quiz-result').style.display = 'block';

  document.getElementById('qr-score').textContent = pct + '%';
  document.getElementById('qr-correct').textContent = quizState.score + ' / ' + quizState.questions.length + ' correct';
  document.getElementById('qr-grade').textContent = pct >= 80 ? '🏆 Excellent!' : pct >= 60 ? '👍 Good' : '📚 Keep reviewing';
  document.getElementById('qr-score').style.color = pct >= 80 ? '#2e7d32' : pct >= 60 ? '#1a4f8a' : '#c62828';
}

// ═══════════════════ TASKS ═══════════════════
function renderTasks() {
  const tasks = load(STORE.TASKS, {});
  const currentWeek = load(STORE.CURRENT_WEEK, 1);
  const cont = document.getElementById('tasks-cont');
  if (!cont) return;

  // Week selector
  document.getElementById('tasks-week-display').textContent = 'Week ' + currentWeek;

  const weekData = APP_DATA.weeklyTasks.find(w => w.week === currentWeek);
  if (!weekData) {
    cont.innerHTML = `<div class="empty-state">Tasks for week ${currentWeek} coming soon!<br><br>Add your own custom tasks below.</div>`;
  } else {
    const phase = APP_DATA.phases.find(p => p.id === weekData.phase);
    const done = weekData.tasks.filter(t => tasks[t.id]).length;
    cont.innerHTML = `
      <div class="week-header" style="border-color:${phase?.color}">
        <div>
          <div class="wh-title">Week ${currentWeek} Tasks</div>
          <div class="wh-phase" style="color:${phase?.color}">Phase ${phase?.num}: ${phase?.title}</div>
        </div>
        <div class="wh-progress">${done} / ${weekData.tasks.length} done</div>
      </div>
      <div class="task-progress-bar"><div style="width:${Math.round(done/weekData.tasks.length*100)}%;background:${phase?.color}"></div></div>
      ${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => {
        const dayTasks = weekData.tasks.filter(t => t.day === day);
        if (!dayTasks.length) return '';
        return `
          <div class="task-day-group">
            <div class="tdg-label">${day}</div>
            ${dayTasks.map(t => `
              <div class="task-item ${tasks[t.id] ? 'done' : ''}">
                <label>
                  <input type="checkbox" ${tasks[t.id] ? 'checked' : ''} onchange="toggleTask('${t.id}', this.checked)"/>
                  <span class="task-text">${t.text}</span>
                </label>
              </div>`).join('')}
          </div>`;
      }).join('')}`;
  }

  // Custom tasks
  renderCustomTasks(tasks);
}

function renderCustomTasks(tasks) {
  const customTasks = load('rq_custom_tasks', []);
  const el = document.getElementById('custom-tasks-list');
  if (!el) return;
  if (!customTasks.length) { el.innerHTML = '<div class="empty-state">No custom tasks yet</div>'; return; }
  el.innerHTML = customTasks.map((t,i) => `
    <div class="task-item ${tasks['custom_'+i] ? 'done' : ''}">
      <label>
        <input type="checkbox" ${tasks['custom_'+i] ? 'checked' : ''} onchange="toggleTask('custom_${i}', this.checked)"/>
        <span class="task-text">${t.text}</span>
      </label>
      <button class="del-btn" onclick="deleteCustomTask(${i})">×</button>
    </div>`).join('');
}

function toggleTask(id, checked) {
  const tasks = load(STORE.TASKS, {});
  tasks[id] = checked;
  save(STORE.TASKS, tasks);
  renderTasks();
  renderTodayTasks(load(STORE.CURRENT_WEEK, 1), tasks);
}

function addCustomTask() {
  const input = document.getElementById('new-task-input');
  const text = input?.value.trim();
  if (!text) return;
  const customTasks = load('rq_custom_tasks', []);
  customTasks.push({ text, date: new Date().toISOString() });
  save('rq_custom_tasks', customTasks);
  input.value = '';
  renderTasks();
}

function deleteCustomTask(i) {
  const customTasks = load('rq_custom_tasks', []);
  customTasks.splice(i, 1);
  save('rq_custom_tasks', customTasks);
  renderTasks();
}

function changeWeek(delta) {
  let w = load(STORE.CURRENT_WEEK, 1) + delta;
  w = Math.max(1, Math.min(43, w));
  save(STORE.CURRENT_WEEK, w);
  renderTasks();
}

// ═══════════════════ WEEKLY REVIEW ═══════════════════
function renderReview() {
  const reviews = load(STORE.WEEKLY_REVIEWS, {});
  const currentWeek = load(STORE.CURRENT_WEEK, 1);
  const studyLog = load(STORE.STUDY_LOG, []);

  document.getElementById('review-week-num').textContent = 'Week ' + currentWeek;

  // Hours this week
  const now = new Date();
  const monday = new Date(now); monday.setDate(now.getDate() - (now.getDay()||7) + 1); monday.setHours(0,0,0,0);
  const hoursThisWeek = studyLog.filter(e => new Date(e.date) >= monday).reduce((s,e) => s+e.hours, 0);
  document.getElementById('review-hours-logged').textContent = hoursThisWeek.toFixed(1);

  // Load saved review
  const saved = reviews[currentWeek] || {};
  document.getElementById('review-wins').value = saved.wins || '';
  document.getElementById('review-struggles').value = saved.struggles || '';
  document.getElementById('review-next').value = saved.next || '';
  document.getElementById('review-mood').value = saved.mood || '3';
  updateMoodDisplay(saved.mood || '3');

  // Log hours form
  document.getElementById('log-hours-input').value = '';
  document.getElementById('log-note-input').value = '';

  // Past reviews
  renderPastReviews(reviews);
}

function updateMoodDisplay(val) {
  const moods = ['😫','😞','😐','😊','🚀'];
  document.getElementById('mood-display').textContent = moods[parseInt(val)-1] || '😐';
}

function saveWeeklyReview() {
  const currentWeek = load(STORE.CURRENT_WEEK, 1);
  const reviews = load(STORE.WEEKLY_REVIEWS, {});
  reviews[currentWeek] = {
    wins: document.getElementById('review-wins').value,
    struggles: document.getElementById('review-struggles').value,
    next: document.getElementById('review-next').value,
    mood: document.getElementById('review-mood').value,
    savedAt: new Date().toISOString()
  };
  save(STORE.WEEKLY_REVIEWS, reviews);
  showToast('Weekly review saved! 🎉');
  renderPastReviews(reviews);
}

function logStudyHours() {
  const hours = parseFloat(document.getElementById('log-hours-input').value);
  const note = document.getElementById('log-note-input').value;
  const phase = parseInt(document.getElementById('log-phase-select').value);
  if (!hours || hours <= 0 || hours > 24) { showToast('Enter valid hours (0-24)', 'error'); return; }
  const studyLog = load(STORE.STUDY_LOG, []);
  studyLog.push({ hours, note, phase, date: new Date().toISOString() });
  save(STORE.STUDY_LOG, studyLog);
  showToast('Study session logged! +' + hours + ' hrs 📚');
  renderReview();
  renderDashboard();
}

function renderPastReviews(reviews) {
  const el = document.getElementById('past-reviews');
  if (!el) return;
  const weeks = Object.keys(reviews).sort((a,b) => b-a).slice(0,5);
  if (!weeks.length) { el.innerHTML = '<div class="empty-state">No past reviews yet</div>'; return; }
  const moods = ['😫','😞','😐','😊','🚀'];
  el.innerHTML = weeks.map(w => {
    const r = reviews[w];
    return `
      <div class="past-review-card">
        <div class="prc-header">
          <span class="prc-week">Week ${w}</span>
          <span class="prc-mood">${moods[parseInt(r.mood)-1]}</span>
        </div>
        ${r.wins ? `<div class="prc-section"><span class="prc-label">✅ Wins:</span> ${r.wins}</div>` : ''}
        ${r.struggles ? `<div class="prc-section"><span class="prc-label">🔧 Struggles:</span> ${r.struggles}</div>` : ''}
      </div>`;
  }).join('');
}

// ═══════════════════ NOTES ═══════════════════
function renderNotes() {
  const notes = load(STORE.NOTES, {});
  const phases = document.getElementById('notes-phase-tabs');
  const activeNotePhase = window._activeNotePhase || 0;

  if (phases) {
    phases.innerHTML = APP_DATA.phases.map(p => `
      <button class="note-tab ${activeNotePhase === p.id ? 'active' : ''}" 
        style="${activeNotePhase === p.id ? 'border-bottom-color:'+p.color+';color:'+p.color : ''}"
        onclick="setNotePhase(${p.id})">${p.num}: ${p.title.split(' ')[0]}</button>`).join('');
  }

  const phase = APP_DATA.phases[activeNotePhase];
  const textarea = document.getElementById('notes-textarea');
  if (textarea) {
    textarea.value = notes[activeNotePhase] || '';
    textarea.style.borderColor = phase?.color || '#d0daea';
  }

  document.getElementById('notes-phase-label').textContent = 'Phase ' + phase?.num + ': ' + phase?.title;
  document.getElementById('notes-phase-label').style.color = phase?.color;
}

function setNotePhase(id) {
  window._activeNotePhase = id;
  renderNotes();
}

function saveNote() {
  const notes = load(STORE.NOTES, {});
  const id = window._activeNotePhase || 0;
  notes[id] = document.getElementById('notes-textarea').value;
  save(STORE.NOTES, notes);
  showToast('Notes saved!');
}

// ═══════════════════ UTILS ═══════════════════
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast ' + type + ' show';
  setTimeout(() => t.classList.remove('show'), 3000);
}

function openLogModal() {
  document.getElementById('log-modal').classList.add('open');
  // Build phase options
  const sel = document.getElementById('log-phase-select');
  sel.innerHTML = APP_DATA.phases.map(p => `<option value="${p.id}">Phase ${p.num}: ${p.title}</option>`).join('');
}
function closeLogModal() { document.getElementById('log-modal').classList.remove('open'); }

// ═══════════════════ INIT ═══════════════════
document.addEventListener('DOMContentLoaded', () => {
  const page = location.hash.replace('#','') || 'dashboard';
  navigate(page);

  // Keyboard nav for flashcards
  document.addEventListener('keydown', e => {
    if (currentPage !== 'flashcards') return;
    if (e.key === 'ArrowRight') nextCard();
    if (e.key === 'ArrowLeft') prevCard();
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flipCard(); }
    if (e.key === '1') markFC('known');
    if (e.key === '2') markFC('review');
  });

  // Close modal on backdrop click
  document.getElementById('log-modal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeLogModal();
  });
});
