/* ---------- focus timer ---------- */
let mode = 'focus';
let heroState = null, happyUntil = 0, napAfterStop = false;
const LINES = {
  start: ['One pebble at a time.', 'I will stay awake with you.', 'Just start. I am right here.', 'Slow is still forward.'],
  pet: ['That tickles.', 'You are doing better than you think.', 'Sip some water?', 'I believe in you.', 'Tiny steps count.'],
  done: ['We did it!', 'Look at that. A whole session.', 'Proud of you.', 'Another stone laid.'],
  stop: ['That still counts. Nap time.', 'Rest is part of it.', 'No worries. I will nap here.'],
  rest: ['Stretch, breathe, look far away.', 'Zzz. Wake me when you are ready.'],
  wake: ['Rest done. Ready for one more pebble?', 'I feel fresh. You?']
};
const pick = a => a[Math.floor(Math.random() * a.length)];
let speechT;
function say(text) {
  const el = $('#speech'); el.textContent = text; el.classList.add('show');
  clearTimeout(speechT); speechT = setTimeout(() => el.classList.remove('show'), 3400);
}
const phaseMs = (min) => min * 60000;

function computeHero() {
  if (Date.now() < happyUntil) return 'happy';
  const t = S.timer;
  if (t && t.phase === 'rest') return 'sleeping';
  if (t && t.phase === 'focus') return t.pausedLeft ? 'awake' : 'awake';
  return napAfterStop ? 'sleeping' : 'awake';
}
function renderHero(force) {
  const st = computeHero(), studying = !!(S.timer && S.timer.phase === 'focus' && !S.timer.pausedLeft);
  const el = $('#heroPet');
  el.classList.toggle('focus', studying);
  if (!force && st + studying === heroState) return;
  heroState = st + studying;
  el.innerHTML = onPadSVG(S.active, st, { look: myLook(), studying: studying && st !== 'sleeping', label: `${petTitle()}, ${st === 'sleeping' ? 'napping' : st}` });
  $('#petName').textContent = petName();
  $('#petSpecies').textContent = `${ANIMALS[S.active].label}${st === 'sleeping' ? ' · napping' : st === 'happy' ? ' · happy' : S.timer?.phase === 'focus' ? ' · awake with you' : ''}`;
}
function makeHappy(ms = 3200) { happyUntil = Date.now() + ms; renderHero(); setTimeout(() => renderHero(), ms + 50); }

function renderTimer() {
  const t = S.timer;
  const startB = $('#startBtn'), pauseB = $('#pauseBtn'), stopB = $('#stopBtn'), skipB = $('#skipBtn');
  let left, total, label, sub;
  if (!t) {
    total = phaseMs(mode === 'focus' ? S.settings.focus : S.settings.rest); left = total;
    label = mode === 'focus' ? (napAfterStop ? `${petName()} is napping` : 'Ready when you are') : 'Time for a rest';
    const np = nextPebble();
    sub = mode === 'focus' ? (np ? `Next pebble: ${np.peb.text}` : 'Pick one small pebble and start. That is enough.') : `${petName()} will nap while you rest.`;
    startB.hidden = false; pauseB.hidden = true; stopB.hidden = true; skipB.hidden = true;
    startB.querySelector('span').textContent = mode === 'focus' ? 'Start focusing' : 'Start resting';
  } else {
    total = t.total;
    left = t.pausedLeft != null ? t.pausedLeft : Math.max(0, t.endsAt - Date.now());
    label = t.phase === 'focus' ? (t.pausedLeft != null ? 'Paused' : 'Focusing') : 'Resting';
    sub = t.phase === 'focus' ? `${courseName(t.courseId)} · ${petName()} is awake with you` : `${petName()} is napping. Stretch and breathe.`;
    startB.hidden = t.pausedLeft == null; startB.querySelector('span').textContent = 'Resume';
    pauseB.hidden = t.pausedLeft != null || t.phase !== 'focus';
    stopB.hidden = t.phase !== 'focus'; skipB.hidden = t.phase !== 'rest';
  }
  const nominalLeft = left;
  const mm = Math.floor(nominalLeft / 60000), ss = Math.floor(nominalLeft / 1000) % 60;
  const txt = `${pad2(mm)}:${pad2(ss)}`;
  const clock = $('#clock');
  if (clock.textContent !== txt) clock.textContent = txt;
  $('#phaseLabel').textContent = label;
  $('#clockSub').textContent = sub;
  const frac = total ? 1 - left / total : 0;
  $('#progFill').style.width = (frac * 100) + '%';
  $('#progDot').style.left = (frac * 100) + '%';
  if (t && !t.pausedLeft) document.title = `${txt} · ${t.phase === 'focus' ? 'Focusing' : 'Resting'} · Grind`; else document.title = 'Grind';
  $('#modeFocus').setAttribute('aria-pressed', mode === 'focus'); $('#modeRest').setAttribute('aria-pressed', mode === 'rest');
  $('#focusRange').disabled = $('#restRange').disabled = !!t;
}

function startPhase(phase) {
  const min = phase === 'focus' ? S.settings.focus : S.settings.rest;
  const total = phaseMs(min);
  S.timer = { phase, min, total, startedAt: Date.now(), endsAt: Date.now() + total, pausedLeft: null, courseId: $('#courseSel').value };
  mode = phase; napAfterStop = false;
  save(); renderTimer(); renderHero(); publishPond();
  say(pick(phase === 'focus' ? LINES.start : LINES.rest));
  if (phase === 'focus') sndOnFocus(true);
  requestWake();
}
function logFocus(mins, completed) {
  const t = S.timer;
  if (mins < 1) return 0;
  S.sessions.push({ id: uid(), start: t.startedAt, mins, courseId: t.courseId, completed, animal: S.active });
  const p = S.pets[S.active]; if (p) p.bond = (p.bond || 0) + mins;
  const coins = completed ? Math.max(1, Math.round(mins / 5)) + 2 : Math.floor(mins / 5);
  checkUnlocks();
  return coins;
}
function completePhase() {
  const t = S.timer; if (!t) return;
  chime();
  if (t.phase === 'focus') {
    sndOnFocus(false);
    const coins = logFocus(t.min, true);
    S.timer = null; mode = 'rest';
    save(); addCoins(coins, `for ${fmtMin(t.min)} of focus`);
    makeHappy(); say(pick(LINES.done));
    afterProgress(); renderAllLight();
    if (S.settings.autoRest) setTimeout(() => { if (!S.timer) startPhase('rest'); }, 1600);
  } else {
    S.timer = null; mode = 'focus';
    save(); say(pick(LINES.wake)); makeHappy(1800); publishPond(); renderTimer();
  }
  releaseWake();
}
function stopFocus() {
  const t = S.timer; if (!t) return;
  const left = t.pausedLeft != null ? t.pausedLeft : Math.max(0, t.endsAt - Date.now());
  const done = Math.floor(t.min * (1 - left / t.total));
  const coins = logFocus(done, false);
  if (t.phase === 'focus') sndOnFocus(false);
  S.timer = null; napAfterStop = true; mode = 'focus';
  save(); renderHero(); renderTimer();
  say(pick(LINES.stop));
  if (done >= 1) { addCoins(coins, `for ${fmtMin(done)} of focus`); toast(`${fmtMin(done)} added to your journal. Every minute counts.`); }
  afterProgress(); renderAllLight(); releaseWake();
}
let wakeLock = null;
async function requestWake() { try { wakeLock = await navigator.wakeLock?.request('screen'); } catch (e) { wakeLock = null; } }
function releaseWake() { try { wakeLock?.release(); } catch (e) {} wakeLock = null; }

function tick() {
  const t = S.timer;
  if (t && t.pausedLeft == null && Date.now() >= t.endsAt) completePhase();
  renderTimer();
}

function renderCourseSelects() {
  const opts = `<option value="">General</option>` + curCourses().map(c => `<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('');
  ['#courseSel', '#rockCourse', '#postCourse'].forEach(s => { const el = $(s); const v = el.value; el.innerHTML = opts; el.value = v && [...el.options].some(o => o.value === v) ? v : (s === '#courseSel' ? (S.lastCourse || '') : ''); if (el.selectedIndex < 0) el.value = ''; });
}
function renderPresetsRow() {
  const sets = [[25, 5, 'Classic 25 · 5'], [50, 10, 'Deep 50 · 10'], [15, 3, 'Gentle start 15 · 3'], [90, 20, 'Long haul 90 · 20']];
  $('#presetRow').innerHTML = `<span class="eyebrow" style="margin-right:4px">Quick picks</span>` + sets.map(([f, r, l]) => `<button class="btn small ${S.settings.focus === f && S.settings.rest === r ? 'primary' : ''}" data-f="${f}" data-r="${r}">${l}</button>`).join('');
}
function renderToday() {
  const k = dayKey();
  const ses = S.sessions.filter(s => dayKey(s.start) === k);
  const pebs = S.pebLog.filter(p => dayKey(p.at) === k);
  const mins = ses.reduce((a, s) => a + s.mins, 0);
  $('#todayDate').textContent = `${WD[new Date().getDay()]} ${new Date().getDate()} ${MO[new Date().getMonth()]}`;
  $('#todayStats').innerHTML = `<div><b class="num">${fmtMin(mins)}</b><span>Focused</span></div><div><b class="num">${ses.length}</b><span>Sessions</span></div><div><b class="num">${pebs.length}</b><span>Pebbles</span></div>`;
  const items = [...ses.map(s => ({ at: s.start, t: `${fmtMin(s.mins)} on ${courseName(s.courseId)}${s.completed ? '' : ' (stopped early, still counts)'}`, i: 'i-timer' })), ...pebs.map(p => ({ at: p.at, t: p.text, i: 'i-check' }))].sort((a, b) => b.at - a.at).slice(0, 6);
  $('#todayList').innerHTML = items.length ? items.map(x => `<li>${icon(x.i)}<span class="t">${esc(x.t)}</span><span class="muted" style="font-size:.78rem">${new Date(x.at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span></li>`).join('')
    : `<li class="muted" style="border:0">Nothing yet, and that is fine. Your first session or pebble will show up here.</li>`;
}
function renderNextPebble() {
  const np = nextPebble();
  const el = $('#nextPebble');
  if (!np) { el.innerHTML = `<div class="empty"><span class="hand">The pond is calm.</span><span>No pebbles waiting. Add a rock when something new comes up.</span><button class="btn small primary" data-go="pebbles">Add a rock</button></div>`; return; }
  const left = np.rock.pebbles.filter(p => !p.done).length;
  el.innerHTML = `<div class="next-peb">${pebbleArt(courseColor(np.rock.courseId), 44)}<div style="min-width:0; flex:1"><h3>${esc(np.peb.text)}</h3>
    <p class="muted" style="font-size:.85rem">${esc(np.rock.title)} · about ${np.peb.mins || 15} min${np.rock.due ? ' · ' + dueText(np.rock.due).toLowerCase() : ''}</p>
    <div class="row" style="margin-top:10px"><button class="btn small primary" id="npFocus">${icon('i-play')}Focus on this</button><button class="btn small" id="npDone">${icon('i-check')}Done</button><span class="muted" style="font-size:.8rem">${left - 1} more after this</span></div></div></div>`;
  $('#npFocus').onclick = () => { if (np.peb.mins) { S.settings.focus = Math.min(120, Math.max(1, np.peb.mins)); syncRanges(); } $('#courseSel').value = np.rock.courseId || ''; if (!S.timer) startPhase('focus'); };
  $('#npDone').onclick = () => togglePebble(np.rock.id, np.peb.id);
}
function pebbleArt(color, w = 44, done = true) {
  return `<svg class="peb-shape" viewBox="0 0 44 34" width="${w}" aria-hidden="true"><path d="M4 22 C2 12 10 5 22 4 C34 3 42 10 41 19 C40 28 30 31 20 31 C11 31 5 28 4 22 Z" fill="${done ? color : 'none'}" stroke="${INK}" stroke-width="2.2" ${done ? '' : 'stroke-dasharray="4 4"'} /><path d="M11 15 C14 11 18 10 23 10" stroke="#fff" stroke-opacity=".5" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>`;
}
function syncRanges() {
  $('#focusRange').value = S.settings.focus; $('#restRange').value = S.settings.rest;
  $('#focusVal').textContent = S.settings.focus; $('#restVal').textContent = S.settings.rest;
  renderPresetsRow(); renderTimer();
}
function bindFocus() {
  $('#focusRange').oninput = e => { S.settings.focus = +e.target.value; $('#focusVal').textContent = S.settings.focus; renderTimer(); };
  $('#restRange').oninput = e => { S.settings.rest = +e.target.value; $('#restVal').textContent = S.settings.rest; renderTimer(); };
  $('#focusRange').onchange = $('#restRange').onchange = () => { renderPresetsRow(); save(); };
  $('#presetRow').onclick = e => { const b = e.target.closest('button[data-f]'); if (!b || S.timer) return; S.settings.focus = +b.dataset.f; S.settings.rest = +b.dataset.r; syncRanges(); save(); };
  $('#modeFocus').onclick = () => { if (!S.timer) { mode = 'focus'; renderTimer(); } };
  $('#modeRest').onclick = () => { if (!S.timer) { mode = 'rest'; renderTimer(); } };
  $('#courseSel').onchange = e => { S.lastCourse = e.target.value; save(); };
  $('#startBtn').onclick = () => {
    const t = S.timer;
    if (t && t.pausedLeft != null) { t.endsAt = Date.now() + t.pausedLeft; t.pausedLeft = null; save(); renderTimer(); renderHero(); publishPond(); say('Back to it.'); return; }
    chimePrime(); startPhase(mode);
  };
  $('#pauseBtn').onclick = () => { const t = S.timer; if (!t) return; t.pausedLeft = Math.max(0, t.endsAt - Date.now()); save(); renderTimer(); renderHero(); publishPond(); };
  $('#stopBtn').onclick = stopFocus;
  $('#skipBtn').onclick = () => { S.timer = null; mode = 'focus'; save(); renderTimer(); renderHero(); publishPond(); say(pick(LINES.wake)); releaseWake(); };
  $('#heroPet').onclick = () => { makeHappy(2200); say(pick(LINES.pet)); };
}
function chimePrime() { try { audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)(); audioCtx.resume?.(); } catch (e) {} }
