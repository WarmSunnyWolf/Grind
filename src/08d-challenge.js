/* ---------- monthly challenge ----------
   Every day of the month a student gets three small tasks that tick themselves as they study.
   Finish all three on enough days and the challenge creature hatches from its egg. */
const CHALLENGE = { id: 'nov2026', month: 'November', from: new Date(2026, 10, 1), to: new Date(2026, 11, 1), goal: 20, reward: 'emberwing', dayCoins: 15 };
const chActive = (d = new Date()) => d >= CHALLENGE.from && d < CHALLENGE.to;
function chState() {
  if (!S.challenge || typeof S.challenge !== 'object') S.challenge = {};
  const c = S.challenge[CHALLENGE.id] || (S.challenge[CHALLENGE.id] = { days: [] });
  if (!Array.isArray(c.days)) c.days = [];
  return c;
}
const chDone = () => chState().days.filter(k => k >= dayKey(CHALLENGE.from) && k < dayKey(CHALLENGE.to)).length;
function chSeed(k) { let h = 7; for (const ch of k) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; }
function chCourses() { return ((S.semesters || []).find(x => x.id === S.currentSem) || {}).courses || []; }
// the three tasks for a given day: some focus time, some pebbles, and one that changes
function chTasks(k = dayKey()) {
  const h = chSeed(k), ses = S.sessions.filter(s => dayKey(s.start) === k), pebs = (S.pebLog || []).filter(p => dayKey(p.at) === k);
  const mins = ses.reduce((a, s) => a + (s.mins || 0), 0);
  const m = [25, 30, 40, 25, 50][h % 5], n = [1, 2, 3, 2][(h >> 3) % 4];
  const extras = [
    { id: 'two', label: 'Finish two focus sessions', have: ses.length, need: 2, go: 'focus' },
    { id: 'full', label: 'Finish one session without stopping early', have: ses.filter(s => s.completed).length, need: 1, go: 'focus' },
    { id: 'long', label: 'Do one session of 30 minutes or longer', have: Math.max(0, ...ses.map(s => s.mins || 0)), need: 30, unit: 'min', go: 'focus' },
    { id: 'courses', label: 'Study two different courses', have: new Set(ses.map(s => s.courseId || 'general')).size, need: 2, go: 'focus' }
  ].filter(t => t.id !== 'courses' || chCourses().length >= 2);
  const x = extras[(h >> 6) % extras.length];
  return [
    { id: 'mins', label: `Focus for ${m} minutes`, have: mins, need: m, unit: 'min', go: 'focus' },
    { id: 'pebs', label: n === 1 ? 'Tick off one pebble' : `Tick off ${n} pebbles`, have: pebs.length, need: n, go: 'pebbles' },
    x
  ].map(t => ({ ...t, ok: t.have >= t.need }));
}
function chStage(n) { return n >= CHALLENGE.goal ? 4 : Math.min(3, Math.floor(n / 5)); }
const CH_STAGE = ['A warm egg in a nest of maple leaves', 'Something is moving inside', 'A crack, and a soft glow', 'Almost ready to hatch', 'Hatched'];
// the egg grows cracks and glows brighter as days are finished
function eggSVG(n) {
  const st = chStage(n), f = Math.min(1, n / CHALLENGE.goal), INKc = INK;
  if (st === 4) return animalSVG(CHALLENGE.reward, 'happy', { label: 'Emberwing' });
  const cracks = [
    '',
    `<path d="M84 96 L92 104 L86 112 L95 120" fill="none" stroke="${INKc}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,
    `<path d="M84 96 L92 104 L86 112 L95 120 M112 78 L118 88 L111 94 L119 104" fill="none" stroke="${INKc}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,
    `<path d="M70 104 L80 98 L88 106 L98 98 L108 106 L118 98 L130 104" fill="none" stroke="${INKc}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M80 98 L88 106 L98 98 L108 106 L118 98" fill="none" stroke="#ffe28a" stroke-width="1.4" stroke-linecap="round" opacity=".9"/>`
  ][st];
  const wob = st >= 1 ? ' wob' : '';
  return `<svg viewBox="0 0 200 200" class="ch-egg${wob}" overflow="visible" aria-hidden="true">
    <circle cx="100" cy="104" r="${60 + 30 * f}" fill="#ffe28a" opacity="${.12 + .3 * f}"/>
    <ellipse cx="100" cy="170" rx="66" ry="16" fill="#9a6a44" stroke="${INKc}" stroke-width="3"/>
    <path d="M40 166 l14 -10 l6 12 M70 160 l10 -12 l8 12 M112 158 l10 -10 l8 12 M142 162 l14 -8 l2 12" fill="#d2553f" stroke="${INKc}" stroke-width="2" stroke-linejoin="round"/>
    <g class="ch-egg-body"><path d="M100 40 C128 40 146 82 146 116 C146 146 126 166 100 166 C74 166 54 146 54 116 C54 82 72 40 100 40 Z" fill="#f6e7cf" stroke="${INKc}" stroke-width="3"/>
    <path d="M100 40 C128 40 146 82 146 116 C146 146 126 166 100 166 C118 150 126 128 124 104 C122 74 112 52 100 40 Z" fill="#e8d2b0" opacity=".6"/>
    <circle cx="80" cy="80" r="5" fill="#e88a4a" opacity=".7"/><circle cx="118" cy="128" r="7" fill="#e88a4a" opacity=".7"/><circle cx="74" cy="134" r="4" fill="#d2553f" opacity=".6"/><circle cx="122" cy="72" r="3.5" fill="#d2553f" opacity=".6"/>
    <path d="M78 62 C82 54 88 50 92 48" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>
    ${cracks}</g>
    <path d="M38 170 C50 184 150 184 162 170" fill="#9a6a44" stroke="${INKc}" stroke-width="3"/>
    <path d="M52 176 q10 -6 20 0 q10 -6 20 0 q10 -6 20 0 q10 -6 20 0 q10 -6 18 0" fill="none" stroke="#7a4e30" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
}
function chTaskList(tasks, compact) {
  return `<ul class="ch-tasks${compact ? ' compact' : ''}">${tasks.map(t => `<li class="${t.ok ? 'ok' : ''}"><span class="ch-tick">${t.ok ? icon('i-check') : ''}</span><span class="ch-t"><b>${esc(t.label)}</b>${compact ? '' : `<span class="prog-bar"><i style="width:${Math.min(100, Math.round(t.have / t.need * 100))}%"></i></span>`}</span><span class="ch-n">${t.ok ? 'Done' : t.unit === 'min' ? `${t.have} of ${t.need} min` : `${Math.min(t.have, t.need)} of ${t.need}`}</span>${compact || t.ok ? '' : `<button class="btn small quiet" data-go="${t.go}">Go</button>`}</li>`).join('')}</ul>`;
}
function chDaysLeft() { return Math.max(0, Math.round((CHALLENGE.to - new Date(dayKey() + 'T00:00')) / 864e5)); }
function renderChallenge() {
  const on = chActive(), n = chDone(), won = S.unlocked.includes(CHALLENGE.reward);
  $$('[data-chonly]').forEach(e => { e.hidden = !on; });
  const card = $('#chCard');
  if (card) {
    card.hidden = !on;
    if (on) {
      const tasks = chTasks(), all = tasks.every(t => t.ok);
      card.innerHTML = `<div class="card-h"><h2>${CHALLENGE.month} challenge</h2><button class="btn small quiet" data-go="challenge">Open</button></div>
        <div class="ch-mini"><div class="ch-mini-egg">${eggSVG(n)}</div><div><b>${won ? 'Your Emberwing hatched' : `${n} of ${CHALLENGE.goal} days`}</b><span class="muted">${all ? 'All done for today. See you tomorrow.' : `${tasks.filter(t => t.ok).length} of 3 tasks done today`}</span></div></div>
        ${chTaskList(tasks, true)}`;
    }
  }
  const box = $('#chBody'); if (!box || currentView !== 'challenge') return;
  if (!on) { box.innerHTML = `<div class="card"><p class="muted">The ${CHALLENGE.month} challenge has ended. ${won ? 'Your Emberwing is waiting for you in the Sanctuary.' : 'A new one is coming soon.'}</p></div>`; return; }
  const tasks = chTasks(), today = dayKey(), days = new Set(chState().days), first = new Date(CHALLENGE.from), cells = [];
  for (let d = new Date(first); d < CHALLENGE.to; d.setDate(d.getDate() + 1)) {
    const k = dayKey(d), cls = days.has(k) ? 'done' : k === today ? 'today' : k < today ? 'miss' : '';
    cells.push(`<li class="${cls}" title="${d.getDate()} ${MO[d.getMonth()]}"><span>${d.getDate()}</span>${days.has(k) ? '<svg viewBox="0 0 20 20"><path d="M10 2 L11.4 6.6 L15.6 4.8 L14 9 L18 10.6 L13.6 12 L14.6 16.6 L10 14 L5.4 16.6 L6.4 12 L2 10.6 L6 9 L4.4 4.8 L8.6 6.6 Z" fill="currentColor"/></svg>' : ''}</li>`);
  }
  const left = chDaysLeft(), need = Math.max(0, CHALLENGE.goal - n);
  box.innerHTML = `<div class="ch-hero card">
      <div class="ch-egg-wrap">${eggSVG(n)}</div>
      <div class="ch-info">
        <span class="hand" style="color:var(--rose)">${won ? 'It hatched' : CH_STAGE[chStage(n)]}</span>
        <h2>${won ? 'Meet your Emberwing' : 'Hatch a creature nobody has seen before'}</h2>
        <p class="muted">${won ? 'A firebird with ember feathers and a burning crest. It now lives in your Sanctuary and can study with you. Keep finishing your daily tasks for coins until the month ends.' : `Finish all three tasks on any ${CHALLENGE.goal} days in ${CHALLENGE.month} and the egg hatches into the Emberwing, an animal that only exists for this challenge. Every finished day also gives ${CHALLENGE.dayCoins} coins.`}</p>
        <div class="ch-meter"><span class="prog-bar"><i style="width:${Math.min(100, n / CHALLENGE.goal * 100)}%"></i></span><b>${n} of ${CHALLENGE.goal} days</b></div>
        ${won ? `<div class="row"><button class="btn small primary" data-go="sanctuary">See it in the Sanctuary</button></div>` : `<p class="muted" style="font-size:.85rem; margin:0">${need > left ? `There are ${left} days left, so the egg cannot hatch this month, but every finished day still gives coins.` : `${need} more ${need === 1 ? 'day' : 'days'} to go, with ${left} ${left === 1 ? 'day' : 'days'} left in ${CHALLENGE.month}.`}</p>`}
      </div>
    </div>
    <div class="grid g-ch">
      <div class="card"><div class="card-h"><h2>Today's tasks</h2><span class="hand muted">${WD[new Date().getDay()]} ${new Date().getDate()} ${MO[new Date().getMonth()]}</span></div>
        ${chTaskList(tasks)}
        <p class="muted" style="font-size:.82rem; margin:12px 0 0">${tasks.every(t => t.ok) ? 'All three are done. Today counts toward your egg.' : 'They tick themselves as you study. New tasks arrive every morning.'}</p></div>
      <div class="card"><div class="card-h"><h2>Your ${CHALLENGE.month}</h2><span class="muted" style="font-size:.8rem">Any ${CHALLENGE.goal} days count</span></div>
        <ol class="ch-cal">${cells.join('')}</ol>
        ${won ? '' : `<div class="ch-peek"><div class="pic">${animalSVG(CHALLENGE.reward, 'sleeping', { label: 'A shadow inside the egg' })}</div><p><b>Something is sleeping inside.</b><br><span class="muted">It wakes up at ${CHALLENGE.goal} days.</span></p></div>`}</div>
    </div>`;
}
// called after anything that might finish a task
function checkChallenge() {
  if (!chActive() || !S.onboarded) return;
  const c = chState(), k = dayKey();
  if (c.days.includes(k) || !chTasks(k).every(t => t.ok)) return;
  c.days.push(k); save();
  const n = chDone();
  addCoins(CHALLENGE.dayCoins, `for finishing today's ${CHALLENGE.month} tasks`);
  if (n >= CHALLENGE.goal && !S.unlocked.includes(CHALLENGE.reward)) {
    S.unlocked.push(CHALLENGE.reward); S.pets[CHALLENGE.reward] = S.pets[CHALLENGE.reward] || { name: '', bond: 0 }; save();
    queueCh('hatch');
  } else queueCh('day');
  try { publishPond(); } catch (e) {}
}
// wait for any other celebration to close first
function queueCh(kind, tries = 0) { if ($('.modal.on') && tries < 40) { setTimeout(() => queueCh(kind, tries + 1), 1500); return; } showChallengeModal(kind); }
function showChallengeModal(kind) {
  if ($('.modal.on') && kind === 'daily') return;
  const n = chDone(), tasks = chTasks();
  const head = kind === 'hatch' ? ['It hatched', 'Meet your Emberwing', 'A firebird with ember feathers and a burning crest. Nobody else has one unless they finished the challenge too. It is in your Sanctuary now.']
    : kind === 'day' ? ['Today counts', `${n} of ${CHALLENGE.goal} days`, n >= CHALLENGE.goal ? 'Your egg already hatched. Every finished day still gives coins.' : `All three tasks are done. The egg ${chStage(n) > chStage(n - 1) ? 'just cracked a little more' : 'feels a little warmer'}. Come back tomorrow for new tasks.`]
    : [`${CHALLENGE.month} challenge`, 'Your tasks for today', `Finish all three to warm the egg. ${n} of ${CHALLENGE.goal} days so far.`];
  const petals = kind === 'daily' ? '' : Array.from({ length: 22 }, (_, i) => `<i style="left:${(i * 37) % 100}%; --d:${((i * 7) % 10) / 10}s; --t:${2.4 + (i % 5) * .35}s; --r:${(i * 53) % 360}deg; --x:${(i % 2 ? 1 : -1) * (20 + (i * 11) % 40)}px; background:${['#d2553f', '#f0b84a', '#e88a4a', '#ffe28a'][i % 4]}"></i>`).join('');
  $('#chBox').innerHTML = `<div class="petals" aria-hidden="true">${petals}</div>
    <div class="ch-pop-egg">${eggSVG(n)}</div>
    <div class="cross-txt"><span class="hand">${head[0]}</span><h2>${head[1]}</h2><p class="muted">${head[2]}</p></div>
    ${kind === 'daily' ? chTaskList(tasks, true) : ''}
    <div class="row" style="justify-content:flex-end">${kind === 'hatch' ? '<button class="btn" data-chgo="sanctuary">See it</button>' : '<button class="btn" data-chgo="challenge">See the challenge</button>'}<button class="btn primary" data-chclose>${kind === 'daily' ? 'Let us start' : 'Keep going'}</button></div>`;
  $('#chModal').classList.add('on');
  if (kind !== 'daily') try { fanfare(); } catch (e) {}
}
// once a day, the first time Grind opens in the month, show the day's tasks
function maybeShowChallenge() {
  if (!chActive() || !S.onboarded || $('.modal.on')) return;
  const c = chState(), k = dayKey();
  if (c.pop === k) return;
  c.pop = k; save();
  showChallengeModal('daily');
}
function bindChallenge() {
  $('#chModal').addEventListener('click', e => {
    const g = e.target.closest('[data-chgo]');
    if (g) { $('#chModal').classList.remove('on'); go(g.dataset.chgo); return; }
    if (e.target.id === 'chModal' || e.target.closest('[data-chclose]')) $('#chModal').classList.remove('on');
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') $('#chModal').classList.remove('on'); });
  setTimeout(maybeShowChallenge, 2600);
}
