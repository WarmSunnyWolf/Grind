/* ---------- sanctuary ---------- */
const previewState = {};
function unlockText(a) { const u = a.unlock; return u.type === 'coins' ? `${u.n} coins` : u.type === 'streak' ? `${u.n}-day streak` : 'Free'; }
function checkUnlocks() {
  const best = Math.max(bestStreak(), streakNow());
  S.bestStreak = best;
  ANIMAL_KEYS.forEach(k => {
    const a = ANIMALS[k];
    if (a.unlock.type === 'streak' && best >= a.unlock.n && !S.unlocked.includes(k)) {
      S.unlocked.push(k); S.pets[k] = { name: '', bond: 0 };
      toast(`<b>A ${a.label.toLowerCase()} arrived at the pond.</b> Your ${a.unlock.n}-day streak earned its trust.`, `<span style="width:34px;height:34px;flex:none">${avatarSVG(k, 'happy')}</span>`);
    }
  });
}
function bondLevel(b) { return Math.min(5, Math.floor((b || 0) / 60)); }
const BOND_NAMES = ['New friend', 'Getting close', 'Study buddy', 'Close friend', 'Best friend', 'Kindred spirit'];
function renderZoo() {
  const best = Math.max(bestStreak(), streakNow());
  $('#zoo').innerHTML = ANIMAL_KEYS.map(k => {
    const a = ANIMALS[k], owned = S.unlocked.includes(k), active = S.active === k, p = S.pets[k] || { name: '', bond: 0 }, pn = p.name || a.label;
    const st = previewState[k] || (owned ? 'awake' : 'sleeping');
    const lv = bondLevel(p.bond);
    let action;
    if (!owned && a.unlock.type === 'coins') action = `<button class="btn small primary" data-adopt="${k}" ${S.coins < a.unlock.n ? 'disabled' : ''}>${icon('i-coin')}Adopt for ${a.unlock.n}</button>${S.coins < a.unlock.n ? `<span class="muted" style="font-size:.78rem">${a.unlock.n - S.coins} more coins</span>` : ''}`;
    else if (!owned) action = `<span class="muted" style="font-size:.82rem">Arrives at a ${a.unlock.n}-day streak. Your best so far is ${best}.</span>`;
    else action = `${active ? `<span class="pill" style="background:var(--accent); color:var(--accent-ink)">Studying with you</span>` : `<button class="btn small primary" data-use="${k}">Study with ${esc(pn)}</button>`}<button class="btn small" data-treat="${k}" ${S.coins < 5 ? 'disabled' : ''}>${icon('i-coin')}Treat · 5</button>`;
    return `<article class="beast ${owned ? '' : 'locked'} ${active ? 'active' : ''}">
      <div class="pic" data-pet="${k}" title="${owned ? 'Tap to pet' : ''}">${animalSVG(k, st, { label: `${a.label}, ${st}`, look: owned ? myLook(k) : null })}</div>
      ${owned ? '' : `<span class="lock">${icon('i-lock')}${unlockText(a)}</span>`}
      <h3><span>${owned ? `<span data-namewrap="${k}">${esc(pn)}</span>` : a.label}</span><span class="sp">${owned && p.name ? a.label : ''}</span></h3>
      <p class="lore">${esc(a.lore)}</p>
      <div class="state-row" role="group" aria-label="Preview faces">${['awake', 'sleeping', 'happy'].map(s => `<button class="btn small ${st === s ? 'primary' : 'quiet'}" data-face="${k}:${s}">${s === 'sleeping' ? 'Napping' : s[0].toUpperCase() + s.slice(1)}</button>`).join('')}</div>
      ${owned ? `<div class="row" style="justify-content:space-between"><span class="bond" title="Bond grows with every focus minute">${[0, 1, 2, 3, 4].map(i => `<svg style="color:${i < lv ? 'var(--moss)' : 'var(--line-2)'}"><use href="#i-leafpip"/></svg>`).join('')}</span><span class="muted" style="font-size:.78rem">${BOND_NAMES[lv]} · ${fmtMin(p.bond || 0)}</span></div>` : ''}
      <div class="row">${action}${owned ? `<button class="btn small" data-dress="${k}">Dress up</button><button class="btn small quiet" data-rename="${k}">Rename</button>` : ''}</div>
    </article>`;
  }).join('');
}
function bindZoo() {
  $('#zoo').addEventListener('click', e => {
    const dr = e.target.closest('[data-dress]'); if (dr) { openDress(dr.dataset.dress); return; }
    const f = e.target.closest('[data-face]'); if (f) { const [k, s] = f.dataset.face.split(':'); previewState[k] = s; renderZoo(); return; }
    const u = e.target.closest('[data-use]'); if (u) { S.active = u.dataset.use; previewState[S.active] = 'happy'; save(); renderAll(); toast(`${esc(petName())} is your study companion now.`, `<span style="width:30px;height:30px;flex:none">${avatarSVG(S.active, 'happy')}</span>`); publishPond(); return; }
    const t = e.target.closest('[data-treat]'); if (t) { const k = t.dataset.treat; if (S.coins < 5) return; S.coins -= 5; S.pets[k].bond = (S.pets[k].bond || 0) + 10; previewState[k] = 'happy'; save(); renderZoo(); renderChips(); toast(`${esc(S.pets[k].name)} loved the treat.`); setTimeout(() => { previewState[k] = 'awake'; renderZoo(); }, 2600); return; }
    const ad = e.target.closest('[data-adopt]'); if (ad) { const k = ad.dataset.adopt, a = ANIMALS[k]; if (S.coins < a.unlock.n) return; S.coins -= a.unlock.n; S.unlocked.push(k); S.pets[k] = { name: '', bond: 0 }; previewState[k] = 'happy'; save(); renderZoo(); renderChips(); toast(`Welcome, little ${a.label.toLowerCase()}.`, `<span style="width:30px;height:30px;flex:none">${avatarSVG(k, 'happy')}</span>`); return; }
    const pp = e.target.closest('[data-pet]'); if (pp && S.unlocked.includes(pp.dataset.pet)) { const k = pp.dataset.pet; previewState[k] = 'happy'; renderZoo(); setTimeout(() => { previewState[k] = 'awake'; renderZoo(); }, 2200); return; }
    const rn = e.target.closest('[data-rename]');
    if (rn) {
      const k = rn.dataset.rename, w = $(`[data-namewrap="${k}"]`);
      w.innerHTML = `<form data-nameform="${k}" style="display:inline-flex; gap:6px"><input class="inp" name="n" maxlength="30" value="${esc(S.pets[k].name)}" placeholder="Name your ${ANIMALS[k].label.toLowerCase()}" style="width:130px; padding:4px 8px" aria-label="New name"><button class="btn small" type="submit">Save</button></form>`;
      w.querySelector('input').focus();
    }
  });
  $('#zoo').addEventListener('submit', e => { const f = e.target.closest('[data-nameform]'); if (!f) return; e.preventDefault(); const k = f.dataset.nameform; const n = f.n.value.trim(); if (n) S.pets[k].name = clampStr(n, 30); save(); renderAll(); publishPond(); });
}

/* ---------- journal (stats) ---------- */
let statSem = 'all', showDailyTable = false;
function semFilter() {
  if (statSem === 'all') return () => true;
  const sem = S.semesters.find(s => s.id === statSem); const ids = new Set((sem ? sem.courses : []).map(c => c.id));
  return s => ids.has(s.courseId) || (!s.courseId && sem && sem.id === S.currentSem);
}
function niceMax(v) { if (v <= 30) return 30; if (v <= 60) return 60; if (v <= 120) return 120; if (v <= 180) return 180; if (v <= 240) return 240; return Math.ceil(v / 120) * 120; }
function renderStats() {
  $('#statSem').innerHTML = `<option value="all">All semesters</option>` + S.semesters.map(s => `<option value="${esc(s.id)}">${esc(s.name)}</option>`).join('');
  $('#statSem').value = statSem;
  const flt = semFilter();
  const ses = S.sessions.filter(flt);
  const total = ses.reduce((a, s) => a + s.mins, 0);
  const wk = addDays(new Date(), -6); wk.setHours(0, 0, 0, 0);
  const week = ses.filter(s => s.start >= +wk).reduce((a, s) => a + s.mins, 0);
  const pebs = S.pebLog.filter(p => statSem === 'all' || flt({ courseId: p.courseId })).length;
  $('#kpis').innerHTML = [
    [fmtMin(total), 'Total focus'], [fmtMin(week), 'Last 7 days'], [ses.length, 'Sessions'], [pebs, 'Stepping stones laid'],
    [`${streakNow()}<small>days</small>`, 'Current streak'], [`${Math.max(bestStreak(), streakNow())}<small>days</small>`, 'Best streak']
  ].map(([v, l]) => `<div class="kpi"><b>${v}</b><span>${l}</span></div>`).join('');
  // daily bars
  const byDay = minutesByDay(flt);
  const days = []; for (let i = 13; i >= 0; i--) { const d = addDays(new Date(), -i); days.push({ d, k: dayKey(d), v: byDay[dayKey(d)] || 0 }); }
  const max = niceMax(Math.max(...days.map(d => d.v), 1));
  const W = 700, H = 220, L = 40, B = 28, T = 10, bw = (W - L) / 14;
  const y = v => T + (H - T - B) * (1 - v / max);
  const ticks = [0, max / 2, max];
  let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Focus minutes per day for the last 14 days">`;
  ticks.forEach(t => { svg += `<line x1="${L}" x2="${W}" y1="${y(t)}" y2="${y(t)}" stroke="var(--line)" stroke-width="1" ${t ? 'stroke-dasharray="3 4"' : ''}/><text x="${L - 8}" y="${y(t) + 4}" text-anchor="end">${t >= 60 && t % 60 === 0 ? t / 60 + 'h' : t + 'm'}</text>`; });
  days.forEach((d, i) => {
    const x = L + i * bw + bw * .2, w = bw * .6, h = Math.max(0, y(0) - y(d.v)), isT = i === 13;
    if (d.v > 0) svg += `<path d="M${x} ${y(0)} V${y(d.v) + Math.min(4, h)} Q${x} ${y(d.v)} ${x + Math.min(4, w / 2)} ${y(d.v)} H${x + w - Math.min(4, w / 2)} Q${x + w} ${y(d.v)} ${x + w} ${y(d.v) + Math.min(4, h)} V${y(0)} Z" fill="${isT ? 'var(--accent)' : 'var(--moss)'}"/>`;
    if (i % (innerWidth < 640 ? 2 : 1) === 0 || isT) svg += `<text x="${x + w / 2}" y="${H - 8}" text-anchor="middle" style="${isT ? 'fill:var(--ink); font-weight:700' : ''}">${isT ? 'Today' : WD[d.d.getDay()].slice(0, 2) + ' ' + d.d.getDate()}</text>`;
    svg += `<rect x="${L + i * bw}" y="${T}" width="${bw}" height="${H - T - B}" fill="transparent" data-tip="${WD[d.d.getDay()]} ${d.d.getDate()} ${MO[d.d.getMonth()]} · ${fmtMin(d.v)}"/>`;
  });
  svg += '</svg>';
  $('#dailyChart').innerHTML = svg;
  $('#dailyChart').hidden = showDailyTable; $('#dailyTable').hidden = !showDailyTable;
  $('#dailyTable').innerHTML = `<table class="data"><thead><tr><th>Day</th><th style="text-align:right">Focus</th></tr></thead><tbody>${days.slice().reverse().map(d => `<tr><td>${WD[d.d.getDay()]} ${d.d.getDate()} ${MO[d.d.getMonth()]}</td><td class="n">${fmtMin(d.v)}</td></tr>`).join('')}</tbody></table>`;
  $('#dailyTableBtn').textContent = showDailyTable ? 'Show as chart' : 'Show as table';
  // by course
  const byC = {}; ses.forEach(s => { byC[s.courseId || ''] = (byC[s.courseId || ''] || 0) + s.mins; });
  const rows = Object.entries(byC).sort((a, b) => b[1] - a[1]); const cmax = Math.max(1, ...rows.map(r => r[1]));
  $('#courseBars').innerHTML = rows.length ? rows.map(([id, v]) => `<div class="hbar"><span class="nm"><i style="background:${courseColor(id)}"></i><span>${esc(courseName(id))}</span></span><span class="tr"><b style="width:${v / cmax * 100}%; background:${courseColor(id)}"></b></span><span class="v">${fmtMin(v)}</span></div>`).join('')
    : `<div class="empty"><span>Your courses fill in here after your first focus session.</span></div>`;
  // heat
  const allDay = minutesByDay(flt); const pebDay = {}; S.pebLog.forEach(p => { const k = dayKey(p.at); pebDay[k] = (pebDay[k] || 0) + 1; });
  const start = addDays(new Date(), -(16 * 7 - 1) - new Date().getDay());
  const lvl = v => v === 0 ? 0 : v < 25 ? 1 : v < 60 ? 2 : v < 120 ? 3 : 4;
  const shade = l => l === 0 ? 'var(--surface-2)' : `color-mix(in srgb, var(--moss) ${[0, 30, 55, 80, 100][l]}%, var(--surface-2))`;
  let cells = '';
  for (let i = 0; i < 16 * 7; i++) { const d = addDays(start, i); if (d > new Date()) { cells += '<i style="visibility:hidden"></i>'; continue; } const k = dayKey(d), v = allDay[k] || 0, pb = pebDay[k] || 0; cells += `<i style="background:${shade(lvl(v || (pb ? 1 : 0)))}" data-tip="${WD[d.getDay()]} ${d.getDate()} ${MO[d.getMonth()]} · ${fmtMin(v)}${pb ? ` · ${pb} pebble${pb > 1 ? 's' : ''}` : ''}"></i>`; }
  $('#heat').innerHTML = cells;
  $('#heatLegend').innerHTML = `<span>Less</span>${[0, 1, 2, 3, 4].map(l => `<i style="width:13px;height:13px;border-radius:4px;background:${shade(l)}"></i>`).join('')}<span>More</span>`;
  // sessions table
  const recent = ses.slice().sort((a, b) => b.start - a.start).slice(0, 12);
  $('#sessTable').innerHTML = recent.length ? `<thead><tr><th>When</th><th>Course</th><th>Companion</th><th style="text-align:right">Length</th><th>How it went</th></tr></thead><tbody>${recent.map(s => `<tr><td>${WD[new Date(s.start).getDay()]} ${new Date(s.start).getDate()} ${MO[new Date(s.start).getMonth()]}, ${new Date(s.start).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</td><td><span class="pill"><i style="background:${courseColor(s.courseId)}"></i>${esc(courseName(s.courseId))}</span></td><td>${esc((S.pets[s.animal] || {}).name || ANIMALS[ANIMAL_OK(s.animal)].label)}</td><td class="n">${fmtMin(s.mins)}</td><td>${s.completed ? 'Full session' : 'Stopped early, still counted'}</td></tr>`).join('')}</tbody>`
    : `<tbody><tr><td class="muted" style="border:0">No sessions yet. Your first focus session will appear here.</td></tr></tbody>`;
}
function bindStats() {
  $('#statSem').onchange = e => { statSem = e.target.value; renderStats(); };
  $('#dailyTableBtn').onclick = () => { showDailyTable = !showDailyTable; renderStats(); };
  const tip = $('#tip');
  document.addEventListener('pointermove', e => {
    const t = e.target.closest && e.target.closest('[data-tip]');
    if (!t) { tip.classList.remove('show'); return; }
    tip.textContent = t.dataset.tip; tip.style.left = e.clientX + 'px'; tip.style.top = e.clientY + 'px'; tip.style.position = 'fixed'; tip.classList.add('show');
  });
}

/* ---------- profile ---------- */
function renderProfile() {
  $('#profAv').innerHTML = avatarSVG(S.active, 'happy', myLook());
  $('#profName').textContent = myName();
  $('#profLine').textContent = [S.profile.uni, S.profile.major].filter(Boolean).join(' · ') || 'Add your university and major below.';
  $('#profPet').textContent = `Studying with ${petTitle()} · ${streakNow()}-day streak`;
  ['Name', 'Uni', 'Major', 'Bio'].forEach(k => { const el = $('#pf' + k); if (document.activeElement !== el) el.value = S.profile[k.toLowerCase()] || ''; });
  if (document.activeElement !== $('#pfPet')) $('#pfPet').value = pet().name || '';
  $('#semList').innerHTML = S.semesters.map(s => `<div class="sem" data-sem="${esc(s.id)}">
    <div class="sem-h"><input class="inp" data-semname value="${esc(s.name)}" maxlength="40" style="max-width:220px; font-family:var(--f-display)" aria-label="Semester name">
      <div class="row">${s.id === S.currentSem ? '<span class="pill" style="background:var(--accent); color:var(--accent-ink)">Current</span>' : '<button class="btn small" data-semcur>Make current</button>'}${S.semesters.length > 1 ? '<span data-semdelwrap><button class="btn small quiet" data-semdel>Remove</button></span>' : ''}</div></div>
    <div class="course-chips">${s.courses.map(c => `<span class="cchip"><i style="background:${c.color}"></i>${esc(c.name)}<button data-cdel="${esc(c.id)}" aria-label="Remove ${esc(c.name)}">${icon('i-x')}</button></span>`).join('') || '<span class="muted" style="font-size:.85rem">No courses yet.</span>'}</div>
    <form class="add-peb" data-cadd><input class="inp" name="n" maxlength="40" placeholder="Add a course, like AIRE410" aria-label="New course"><button class="btn small" type="submit">${icon('i-plus')}Add</button></form>
  </div>`).join('');
}
function renderFriends() {
  $$('#visSeg button').forEach(b => b.setAttribute('aria-pressed', b.dataset.vis === S.profile.visibility));
  const fr = S.friends.map(id => NET.pond.find(r => r.id === id) || EXAMPLES.find(e => e.id === id)).filter(Boolean);
  $('#friendList').innerHTML = fr.length ? fr.map(r => `<button type="button" class="friend" data-peer="${esc(r.id)}"><span class="av">${avatarSVG(r.animal, 'awake', r.look)}</span>${esc(r.name)}${r.vis === 'me' ? `<span class="muted" style="font-size:.75rem">Private</span>` : ''}</button>`).join('')
    : `<p class="muted" style="font-size:.88rem">Tap an animal in the pond and choose Add friend. Friends show up here and in the pond's friends view.</p>`;
}
function bindProfile() {
  $('#profForm').onsubmit = e => {
    e.preventDefault();
    S.profile.name = clampStr($('#pfName').value.trim(), 40); S.profile.uni = clampStr($('#pfUni').value.trim(), 60); S.profile.major = clampStr($('#pfMajor').value.trim(), 60); S.profile.bio = clampStr($('#pfBio').value.trim(), 140);
    const pn = $('#pfPet').value.trim(); if (pn) { S.pets[S.active] = S.pets[S.active] || { bond: 0 }; S.pets[S.active].name = clampStr(pn, 30); }
    save(); renderAll(); publishPond(); updateCircles();
    $('#profSaved').textContent = 'Saved'; setTimeout(() => $('#profSaved').textContent = '', 2000);
  };
  $('#addSem').onclick = () => { const id = 'sem-' + uid(); S.semesters.push({ id, name: 'New semester', courses: [] }); save(); renderProfile(); };
  $('#semList').addEventListener('click', e => {
    const box = e.target.closest('[data-sem]'); if (!box) return; const s = S.semesters.find(x => x.id === box.dataset.sem);
    if (e.target.closest('[data-semcur]')) { S.currentSem = s.id; save(); renderAll(); return; }
    const cd = e.target.closest('[data-cdel]'); if (cd) { s.courses = s.courses.filter(c => c.id !== cd.dataset.cdel); save(); renderAll(); return; }
    if (e.target.closest('[data-semdel]')) { box.querySelector('[data-semdelwrap]').innerHTML = `<span class="confirm">Remove ${esc(s.name)}? Sessions stay in your journal. <button class="btn small rose" data-semyes>Remove</button><button class="btn small" data-semno>Keep</button></span>`; return; }
    if (e.target.closest('[data-semno]')) { renderProfile(); return; }
    if (e.target.closest('[data-semyes]')) { S.semesters = S.semesters.filter(x => x.id !== s.id); if (S.currentSem === s.id) S.currentSem = S.semesters[0].id; save(); renderAll(); }
  });
  $('#semList').addEventListener('change', e => { const i = e.target.closest('[data-semname]'); if (!i) return; const s = S.semesters.find(x => x.id === i.closest('[data-sem]').dataset.sem); s.name = clampStr(i.value.trim(), 40) || s.name; save(); renderStats(); });
  $('#semList').addEventListener('submit', e => {
    const f = e.target.closest('[data-cadd]'); if (!f) return; e.preventDefault();
    const n = f.n.value.trim(); if (!n) return; const s = S.semesters.find(x => x.id === f.closest('[data-sem]').dataset.sem);
    const used = allCourses().length;
    s.courses.push({ id: 'c-' + uid(), name: clampStr(n, 40), color: COURSE_COLORS[used % COURSE_COLORS.length] });
    save(); renderAll(); $(`[data-sem="${CSS.escape(s.id)}"] [data-cadd] input`)?.focus();
  });
}

/* ---------- customize drawer ---------- */
function openDrawer(on) { $('#drawer').classList.toggle('on', on); $('#scrim').classList.toggle('on', on); $('#drawer').setAttribute('aria-hidden', !on); if (on) renderDrawer(); }
function renderDrawer() {
  $('#presets').innerHTML = Object.entries(PRESETS).map(([k, p]) => `<button class="preset" data-preset="${k}" aria-pressed="${S.settings.preset === k}"><span class="sw">${p.sw.map(c => `<i style="background:${c}"></i>`).join('')}</span>${esc(p.name)}</button>`).join('');
  $$('#fxSeg button').forEach(b => b.setAttribute('aria-pressed', b.dataset.fx === S.settings.fx));
  $$('#skySeg button').forEach(b => b.setAttribute('aria-pressed', b.dataset.sky === S.settings.sky));
  [['#swSound', 'sound'], ['#swNoteSound', 'noteSound'], ['#swAuto', 'autoRest']].forEach(([id, k]) => $(id).setAttribute('aria-checked', !!S.settings[k]));
  $('#dataWhere').textContent = NET.db && NET.canWrite ? `Your progress is saved to your account and on this device. The pond, ripples, circles and posts are shared with everyone${NET.web ? ' who signs in' : ' invited'}.` : 'Your progress is saved in this browser on this device. Export it to keep a copy.';
  $('#acctRow').innerHTML = !NET.web ? '' : NET.db ? `<span class="muted" style="font-size:.84rem">Signed in${NET.userName ? ' as ' + esc(NET.userName) : ''}</span><button class="btn small quiet" id="signOutBtn">Sign out</button>` : '<button class="btn small primary" id="signInBtn2">Sign in with Google</button>';
  $('#signOutBtn') && ($('#signOutBtn').onclick = () => signOut());
  $('#signInBtn2') && ($('#signInBtn2').onclick = () => signIn());
}
function bindDrawer() {
  $('#openCustomize').onclick = $('#openCustomize2').onclick = () => openDrawer(true);
  $('#closeDrawer').onclick = $('#scrim').onclick = () => openDrawer(false);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { openDrawer(false); $('#pondPop')?.remove(); popFor = null; } });
  $('#presets').onclick = e => { const b = e.target.closest('[data-preset]'); if (!b) return; S.settings.preset = b.dataset.preset; S.settings.custom = {}; save(); applyTheme(); renderDrawer(); };
  const setC = (k, v) => { S.settings.custom = { ...(S.settings.custom || {}), [k]: v }; applyTheme(); };
  $('#cAccent').oninput = e => setC('accent', e.target.value);
  $('#cBg').oninput = e => setC('bg', e.target.value);
  $('#cWater').oninput = e => setC('water', e.target.value);
  ['#cAccent', '#cBg', '#cWater'].forEach(s => $(s).onchange = () => save());
  $('#cReset').onclick = () => { S.settings.custom = {}; save(); applyTheme(); };
  $('#fxSeg').onclick = e => { const b = e.target.closest('[data-fx]'); if (!b) return; S.settings.fx = b.dataset.fx; save(); renderDrawer(); if (REDUCED) FX.forEach(o => { fxSize(o); fxSeed(o); fxDraw(o, 0); }); };
  $('#skySeg').onclick = e => { const b = e.target.closest('[data-sky]'); if (!b) return; S.settings.sky = b.dataset.sky; save(); applySky(); renderDrawer(); };
  const sw = (id, k, after) => { $(id).onclick = () => { S.settings[k] = !S.settings[k]; save(); renderDrawer(); after && after(); }; };
  sw('#swSound', 'sound'); sw('#swNoteSound', 'noteSound', () => { if (S.settings.noteSound) notePing(); }); sw('#swAuto', 'autoRest');
  $('#exportBtn').onclick = async () => {
    const data = JSON.stringify(S, null, 2);
    const dl = await NET.downloadsP;
    if (dl) { try { await dl.save({ filename: `grind-${dayKey()}.json`, data }); return; } catch (e) { if (e && e.code === 'declined') return; } }
    if (NET.web) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' })); a.download = `grind-${dayKey()}.json`; document.body.appendChild(a); a.click(); a.remove(); return; }
    try { await navigator.clipboard.writeText(data); toast('Your data was copied as text. Paste it into a file to keep it.'); } catch (e) { toast('Export is not available in this view.'); }
  };
  $('#resetBtn').onclick = () => { $('#resetWrap').innerHTML = `<span class="confirm">Erase everything on this device and start fresh? <button class="btn small rose" id="resetYes">Erase</button><button class="btn small" id="resetNo">Keep my pond</button></span>`; $('#resetNo').onclick = restoreReset; $('#resetYes').onclick = () => { S = defaultState(); save(); restoreReset(); applyTheme(); renderAll(); openDrawer(false); showWelcome(); }; };
  function restoreReset() { $('#resetWrap').innerHTML = `<button class="btn small quiet" id="resetBtn">${icon('i-trash')}Start over</button>`; bindReset(); }
  function bindReset() { $('#resetBtn').onclick = () => { $('#resetWrap').innerHTML = `<span class="confirm">Erase everything on this device and start fresh? <button class="btn small rose" id="resetYes">Erase</button><button class="btn small" id="resetNo">Keep my pond</button></span>`; $('#resetNo').onclick = restoreReset; $('#resetYes').onclick = () => { S = defaultState(); save(); restoreReset(); applyTheme(); renderAll(); openDrawer(false); showWelcome(); }; }; }
}

/* ---------- welcome ---------- */
let starterPick = 'frog';
function showWelcome() {
  starterPick = S.active || 'frog';
  const draw = () => { $('#starter').innerHTML = ['frog', 'duckling', 'capybara'].map(k => `<button type="button" data-st="${k}" aria-pressed="${starterPick === k}">${animalSVG(k, starterPick === k ? 'happy' : 'awake')}${ANIMALS[k].label}</button>`).join(''); };
  draw();
  $('#starter').onclick = e => { const b = e.target.closest('[data-st]'); if (!b) return; starterPick = b.dataset.st; $('#wPet').placeholder = `Name your ${ANIMALS[starterPick].label.toLowerCase()}`; draw(); };
  $('#wName').value = S.profile.name; $('#wPet').value = pet().name || ''; $('#wPet').placeholder = `Name your ${ANIMALS[starterPick].label.toLowerCase()}`; $('#wUni').value = S.profile.uni; $('#wMajor').value = S.profile.major;
  $('#welcome').classList.add('on');
}
function bindWelcome() {
  $('#welcomeForm').onsubmit = e => {
    e.preventDefault();
    S.profile.name = clampStr($('#wName').value.trim(), 40); S.profile.uni = clampStr($('#wUni').value.trim(), 60); S.profile.major = clampStr($('#wMajor').value.trim(), 60);
    S.active = starterPick; S.pets[starterPick].name = clampStr($('#wPet').value.trim(), 30);
    S.onboarded = true; save(); $('#welcome').classList.remove('on'); renderAll(); publishPond(); makeHappy(); say(`Hi ${myName()}. I am ${petName()}.`);
  };
  $('#wSkip').onclick = () => { S.onboarded = true; save(); $('#welcome').classList.remove('on'); };
}

/* ---------- shell ---------- */
const TITLES = { focus: 'Focus', pebbles: 'Rocks and pebbles', cal: 'Calendar', pond: 'The Pond', together: 'Grind Together', commons: 'Commons', sanctuary: 'Sanctuary', stats: 'Study journal', profile: 'Your profile', feedback: 'Feedback', guide: 'How to use Grind' };
let currentView = 'focus';
function go(v) {
  if (!TITLES[v]) v = 'focus';
  currentView = v;
  $$('.view').forEach(s => s.classList.toggle('on', s.id === 'v-' + v));
  $$('#nav button').forEach(b => b.toggleAttribute('aria-current', false));
  const nb = $(`#nav button[data-go="${v}"]`); if (nb) nb.setAttribute('aria-current', 'page');
  $('#viewTitle').textContent = TITLES[v];
  try { history.replaceState(null, '', '#' + v); } catch (e) {}
  if (v === 'pond') { renderPond(true); $('#pondDot').hidden = true; if (NET.ripples[0]) { S.seenRipple = NET.ripples[0].at; save(); } }
  if (v === 'stats') renderStats();
  if (v === 'sanctuary') renderZoo();
  if (v === 'commons') { renderFeed(); renderMilestones(); }
  if (v === 'together') renderCircle();
  if (v === 'profile') { renderProfile(); renderFriends(); }
  if (v === 'pebbles') renderRocks();
  if (v === 'cal') renderCal();
  if (v === 'feedback') { renderFeedback(); loadInbox(); }
  if (v === 'guide') renderGuide();
  window.scrollTo({ top: 0 });
}
function renderChips() {
  renderSounds();
  const st = streakNow();
  $('#streakChip').textContent = `${st} day${st === 1 ? '' : 's'}`;
  $('#coinChip').textContent = S.coins;
  $('#coinNow').textContent = S.coins; $('#coinEarned').textContent = `· ${S.coinsEarned || 0} earned in total`;
}
function renderSync() {
  const c = $('#syncChip');
  const on = NET.db && NET.canWrite;
  c.classList.toggle('on', !!on);
  c.querySelector('span').textContent = !NET.ready ? 'Connecting' : on ? 'Shared pond' : NET.db ? 'Pond view only' : NET.web && NET.fbReady ? 'Sign in to join the pond' : 'On this device';
  c.onclick = () => { if (NET.web && NET.fbReady && !NET.db) signIn(); else if (on) go('pond'); };
  c.title = on ? 'Live with everyone in the pond' : NET.db ? 'You can see the pond but not post to it' : 'Your progress is saved in this browser';
}
function noticeHTML(text) { return `<div class="notice">${icon('i-info')}<span>${text}</span></div>`; }
function renderNotices() {
  let pondN = '', togN = '';
  if (NET.ready && !NET.db) {
    if (NET.web) {
      const btn = NET.fbReady ? ' <button class="btn small primary" data-signin>Sign in with Google</button>' : '';
      pondN = noticeHTML('Sign in to see everyone in the pond and put your animal there too. Your own studying is saved on this device either way.' + btn);
      togN = noticeHTML('Sign in to start a circle or join one with a code.' + btn);
    } else {
    pondN = noticeHTML('The shared pond appears when you open Grind from an invite while signed in to Claude. Your own studying is always saved on this device.');
    togN = noticeHTML('Circles need the shared pond, which appears when you open Grind from an invite.');
    }
  } else if (NET.db && !NET.canWrite) {
    pondN = noticeHTML('You can watch the pond, but joining it needs an invite with edit access from the pond’s owner.');
    togN = pondN;
  }
  $('#pondNotice').innerHTML = pondN; $('#togetherNotice').innerHTML = togN;
  renderComposerNote(); renderRipples();
}
function renderGreeting() {
  const h = new Date().getHours();
  const g = h < 5 ? 'Up late' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : h < 22 ? 'Good evening' : 'Up late';
  $('#greetHand').textContent = `${g}${S.profile.name ? ', ' + S.profile.name : ''}`;
  $('#meMiniAv').innerHTML = avatarSVG(S.active, 'awake', myLook());
  $('#meMiniName').textContent = myName();
  $('#meMiniSub').textContent = `with ${petName()}`;
}
function renderAllLight() { renderChips(); renderToday(); renderNextPebble(); renderGreeting(); if (currentView === 'pebbles') renderRocks(); try { if (currentView === 'cal') renderCal(); renderCalDot(); } catch (e) { console.error(e); } if (currentView === 'stats') renderStats(); if (currentView === 'sanctuary') renderZoo(); if (currentView === 'commons') renderMilestones(); if (currentView === 'together') renderCircle(); if (currentView === 'pond') renderPond(); }
function renderAll() {
  renderCourseSelects(); syncRanges(); renderHero(true); renderTimer(); renderAllLight(); renderRipples(); renderFeed(); renderMilestones(); renderProfile(); renderFriends(); renderSync(); renderNotices();
  if (currentView === 'pond') renderPond(true);
}

function boot() {
  document.body.addEventListener('click', e => { if (e.target.closest('[data-signin]')) { signIn(); return; } const g = e.target.closest('[data-go]'); if (g) { e.preventDefault(); go(g.dataset.go); } });
  $('#focusStage').insertAdjacentHTML('afterbegin', sceneSVG('focus'));
  $('#pondStage').insertAdjacentHTML('afterbegin', sceneSVG('pond'));
  makeFX($('#focusStage')); makeFX($('#pondStage'));
  applySky(); applyTheme();
  // one broken feature should never stop the rest of the page from loading
  [bindFocus, bindPebbles, bindPond, bindTogether, bindCommons, bindZoo, bindStats, bindProfile, bindDrawer, bindWelcome, bindFeedback, bindGuide, bindSounds, bindNotes, bindCal, bindDress].forEach(f => { try { f(); } catch (e) { console.error(e); } });
  $('#visSeg').onclick = e => { const b = e.target.closest('[data-vis]'); if (!b || b.dataset.vis === S.profile.visibility) return; S.profile.visibility = b.dataset.vis; save(); renderFriends(); publishPond(); toast({ me: 'Only you can see your stats now.', friends: 'Only your friends can see your stats now.', everyone: 'Everyone who signs in can see your stats now.' }[b.dataset.vis]); };
  $('#peerModal').addEventListener('click', e => { if (e.target.id === 'peerModal' || e.target.closest('[data-peerclose]')) closePeer(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePeer(); });
  $('#v-profile').addEventListener('click', e => { const b = e.target.closest('[data-peer]'); if (b) openPeer(b.dataset.peer === 'me-self' ? (NET.uid || 'me') : b.dataset.peer); });
  if (S.timer) mode = S.timer.phase;
  checkUnlocks();
  renderAll();
  go((location.hash || '').replace('#', '') || 'focus');
  if (!S.onboarded) showWelcome();
  setInterval(tick, 250);
  setInterval(() => { applySky(); if (currentView === 'pond') renderPond(); }, 30000);
  let rT; addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { if (currentView === 'pond') renderPond(true); if (currentView === 'stats') renderStats(); }, 200); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
  requestAnimationFrame(fxLoop);
  initNet();
}
boot();

/* guide */
function renderGuide() {
  $('#gHeroPic').innerHTML = avatarSVG(S.active, 'happy');
  $('#gLink').textContent = (location.host + location.pathname).replace(/\/(index\.html)?$/, '');
}
function bindGuide() {
  $('#v-guide').addEventListener('click', async e => {
    const j = e.target.closest('[data-gjump]');
    if (j) {
      e.preventDefault();
      const el = $('#g-' + j.dataset.gjump);
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 1400);
      return;
    }
    if (e.target.closest('[data-guide-custom]')) { openDrawer(true); return; }
    if (e.target.closest('#gCopy')) {
      try { await navigator.clipboard.writeText(location.origin + location.pathname.replace(/index\.html$/, '')); toast('Link copied. Send it to your classmates.'); }
      catch (err) { toast('Copy is not available here. Select the link and copy it.'); }
    }
  });
}
