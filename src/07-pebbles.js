/* ---------- rocks and pebbles ---------- */
let rockFilter = 'all';
const aiDrafts = {};
function rockArt(color) {
  return `<svg class="rk" viewBox="0 0 52 42" aria-hidden="true"><path d="M3 32 C1 18 12 6 26 5 C40 4 50 14 49 26 C48 37 37 40 25 40 C13 40 4 38 3 32 Z" fill="${color}" stroke="${INK}" stroke-width="2.4"/><path d="M12 22 C16 15 22 12 29 12" stroke="#fff" stroke-opacity=".45" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M30 30 l6 -4 M18 32 l5 1" stroke="${INK}" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"/></svg>`;
}
function crossingSVG(rock) {
  const n = Math.max(1, rock.pebbles.length), done = rock.pebbles.filter(p => p.done).length;
  const x0 = 92, x1 = 508;
  const stones = rock.pebbles.map((p, i) => {
    const x = n === 1 ? 300 : x0 + (x1 - x0) * i / (n - 1), y = 70 + Math.sin(i * 1.3) * 9;
    return { x, y, done: p.done };
  });
  const lastDone = [...stones].reverse().find(s => s.done);
  const all = done === rock.pebbles.length && rock.pebbles.length > 0;
  const ax = all ? 548 : lastDone ? lastDone.x : 46, ay = all ? 58 : lastDone ? lastDone.y : 62;
  return `<svg viewBox="0 0 600 120" role="img" aria-label="${done} of ${rock.pebbles.length} stepping stones laid">
    <rect width="600" height="120" fill="var(--water)"/>
    <path d="M70 26 h60 M250 18 h50 M420 30 h70 M160 104 h50 M360 108 h60" stroke="var(--water-hi)" stroke-width="3" stroke-linecap="round" opacity=".8"/>
    <path d="M0 0 H52 C70 30 66 90 50 120 H0 Z" fill="var(--bank)" stroke="var(--pad-2)" stroke-width="2"/>
    <path d="M600 0 H548 C530 30 534 90 550 120 H600 Z" fill="var(--bank)" stroke="var(--pad-2)" stroke-width="2"/>
    <g transform="translate(578 40)"><path d="M0 0 C-8 -5 -10 -14 -5 -19 C-2 -13 0 -8 0 0 Z M0 0 C8 -5 10 -14 5 -19 C2 -13 0 -8 0 0 Z M0 0 C-4 -8 -3 -18 0 -23 C3 -18 4 -8 0 0 Z" fill="${all ? 'var(--bloom)' : 'var(--line-2)'}" stroke="${INK}" stroke-width="1.4"/></g>
    ${stones.map(s => `<ellipse cx="${s.x}" cy="${s.y + 6}" rx="24" ry="7" fill="var(--water-2)" opacity=".6"/><path d="M${s.x - 24} ${s.y + 2} C${s.x - 24} ${s.y - 10} ${s.x - 10} ${s.y - 13} ${s.x} ${s.y - 13} C${s.x + 14} ${s.y - 13} ${s.x + 24} ${s.y - 8} ${s.x + 24} ${s.y + 1} C${s.x + 24} ${s.y + 8} ${s.x + 12} ${s.y + 10} ${s.x} ${s.y + 10} C${s.x - 12} ${s.y + 10} ${s.x - 24} ${s.y + 8} ${s.x - 24} ${s.y + 2} Z" fill="${s.done ? '#b9ad97' : 'none'}" stroke="${s.done ? INK : 'var(--water-hi)'}" stroke-width="2.2" ${s.done ? '' : 'stroke-dasharray="5 5"'}/>`).join('')}
    ${animalSVG(S.active, all ? 'happy' : 'awake', { look: myLook(), nested: true, x: ax - 30, y: ay - 56, w: 60, label: petName() })}
  </svg>`;
}
function renderRockFilter() {
  const cs = curCourses();
  $('#rockFilter').innerHTML = `<div class="seg" role="group" aria-label="Filter by course"><button data-c="all" aria-pressed="${rockFilter === 'all'}">All</button>${cs.map(c => `<button data-c="${esc(c.id)}" aria-pressed="${rockFilter === c.id}">${esc(c.name)}</button>`).join('')}<button data-c="" aria-pressed="${rockFilter === ''}">General</button></div>`;
}
function renderRocks() {
  renderRockFilter();
  let rocks = S.rocks.filter(r => rockFilter === 'all' || (r.courseId || '') === rockFilter);
  const isDone = r => r.pebbles.length && r.pebbles.every(p => p.done);
  rocks.sort((a, b) => (isDone(a) - isDone(b)) || (a.due || '9999').localeCompare(b.due || '9999') || b.createdAt - a.createdAt);
  const el = $('#rockList');
  if (!rocks.length) { el.innerHTML = `<div class="card flat empty"><span class="hand">No rocks here.</span><span>Add a big task and split it into pebbles, or import your Blackboard calendar.</span></div>`; return; }
  el.innerHTML = rocks.map(r => {
    const d = r.pebbles.filter(p => p.done).length, n = r.pebbles.length, open = S.openRock === r.id;
    const draft = aiDrafts[r.id];
    return `<article class="rock" data-rock="${esc(r.id)}">
      <div class="rock-head" data-toggle role="button" tabindex="0" aria-expanded="${open}">${rockArt(courseColor(r.courseId))}
        <div class="meta"><h3>${esc(r.title)}</h3><div class="sub"><span class="pill"><i style="background:${courseColor(r.courseId)}"></i>${esc(courseName(r.courseId))}</span>${r.due ? `<span class="due">${dueText(r.due)}</span>` : ''}${r.example ? '<span class="pill example">Example</span>' : ''}${isDone(r) ? '<span class="pill" style="background:var(--moss);color:#fff">Crossed</span>' : ''}</div></div>
        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px; min-width:90px"><span class="muted num" style="font-size:.82rem">${d} of ${n} pebbles</span><span class="prog-bar" style="width:90px"><i style="width:${n ? d / n * 100 : 0}%"></i></span></div>
      </div>
      ${open ? `<div class="rock-body">
        <div class="crossing">${crossingSVG(r)}</div>
        ${r.pebbles.length ? `<ul class="peb-list">${r.pebbles.map(p => `<li class="peb ${p.done ? 'done' : ''}"><button class="chk" data-peb="${esc(p.id)}" aria-label="${p.done ? 'Mark not done' : 'Mark done'}: ${esc(p.text)}">${icon('i-check')}</button><span class="tx">${esc(p.text)}</span><span class="mins">${p.mins || 15} min</span><button class="icon-btn" style="width:30px;height:30px" data-delpeb="${esc(p.id)}" aria-label="Remove pebble">${icon('i-x')}</button></li>`).join('')}</ul>` : '<p class="muted">No pebbles yet. Add the smallest first step you can think of, or let Claude break it down.</p>'}
        ${draft ? aiBox(r.id, draft) : ''}
        <form class="add-peb" data-addpeb><input class="inp" name="t" maxlength="120" placeholder="Add a pebble, like “read pages 10 to 14”" aria-label="New pebble"><input class="inp" name="m" type="number" min="1" max="120" value="15" style="max-width:80px" aria-label="Minutes"><button class="btn" type="submit">${icon('i-plus')}Add</button></form>
        <div class="row"><button class="btn small" data-ai>${icon('i-wand')}Break it down</button><button class="btn small" data-focusrock ${d === n ? 'disabled' : ''}>${icon('i-play')}Focus on next pebble</button><span style="flex:1"></span><span data-delwrap><button class="btn small quiet" data-delrock>${icon('i-trash')}Remove rock</button></span></div>
      </div>` : ''}
    </article>`;
  }).join('');
}
function aiBox(id, d) {
  if (d.loading) return `<div class="ai-box"><span class="hand">Claude is thinking about small first steps...</span></div>`;
  if (d.error) return `<div class="ai-box"><span>${esc(d.error)}</span><div class="row"><button class="btn small" data-aiclose>Close</button></div></div>`;
  return `<div class="ai-box"><span class="eyebrow">${d.offline ? 'A simple starting split' : 'Suggested by Claude'}</span><ol>${d.items.map(p => `<li>${esc(p.text)} <span class="muted">· ${p.mins} min</span></li>`).join('')}</ol>
    <div class="row"><button class="btn small primary" data-aiadd>${icon('i-plus')}Add these pebbles</button>${d.offline ? '' : '<button class="btn small" data-ai>Try again</button>'}<button class="btn small quiet" data-aiclose>Dismiss</button></div></div>`;
}
async function breakDown(rockId) {
  const r = S.rocks.find(x => x.id === rockId); if (!r) return;
  aiDrafts[rockId] = { loading: true }; S.openRock = rockId; renderRocks();
  const sample = await NET.sampleP;
  const offline = () => ({ offline: true, items: [
    { text: 'Write the task in one sentence and note what “done” looks like', mins: 10 },
    { text: 'Gather what you need: slides, notes, the brief', mins: 10 },
    { text: 'Do the smallest first part only', mins: 20 },
    { text: 'Do the next part', mins: 25 },
    { text: 'Review, fix one thing, and submit or save', mins: 15 }] });
  if (!sample) { aiDrafts[rockId] = offline(); renderRocks(); return; }
  try {
    const prompt = `You help a university student who procrastinates because of decision fatigue, not laziness. Split their task into 4 to 7 small pebbles. Each pebble is one concrete action that takes 10 to 30 minutes. The first pebble must be the easiest possible start. Be specific to the task, warm and plain. No emojis.
Course: ${courseName(r.courseId)}
Task: ${r.title}
${r.due ? 'Due: ' + r.due + ' (today is ' + dayKey() + ')' : ''}
${r.notes ? 'Notes from the student: ' + r.notes : ''}
Reply with only JSON in this shape: {"pebbles":[{"text":"under 90 characters","mins":15}]}`;
    const out = await sample.json(prompt, { modelTier: 'quick', cache: false });
    const items = (out && Array.isArray(out.pebbles) ? out.pebbles : []).slice(0, 8).map(p => ({ text: clampStr(p.text, 120), mins: Math.min(60, Math.max(5, Math.round(+p.mins || 15))) })).filter(p => p.text);
    aiDrafts[rockId] = items.length ? { items } : offline();
  } catch (e) {
    aiDrafts[rockId] = e && e.code === 'not_granted' ? offline() : { error: e && e.code === 'rate_limited' ? 'Claude needs a short breather. Try again in a minute.' : 'Claude could not split this one right now. You can add pebbles by hand.' };
  }
  renderRocks();
}
function togglePebble(rockId, pebId) {
  const r = S.rocks.find(x => x.id === rockId); if (!r) return;
  const p = r.pebbles.find(x => x.id === pebId); if (!p) return;
  const wasAll = r.pebbles.every(x => x.done);
  p.done = !p.done;
  if (p.done) {
    p.doneAt = Date.now();
    S.pebLog.push({ id: p.id, at: p.doneAt, text: p.text, rock: r.title, courseId: r.courseId });
    addCoins(3, 'for laying a stepping stone');
    if (r.pebbles.every(x => x.done)) { addCoins(10, `for crossing “${r.title}”`); S.lastCrossed = { title: r.title, at: Date.now() }; makeHappy(4000); say('We crossed the whole pond!'); }
    checkUnlocks();
  } else {
    S.pebLog = S.pebLog.filter(x => x.id !== p.id);
    S.coins = Math.max(0, S.coins - 3 - (wasAll ? 10 : 0));
  }
  save(); renderAllLight(); afterProgress();
}
function bindPebbles() {
  $('#newRockBtn').onclick = () => { $('#rockForm').hidden = false; renderCourseSelects(); $('#rockCourse').value = rockFilter !== 'all' ? rockFilter : (S.lastCourse || ''); $('#rockTitle').focus(); };
  $('#rockCancel').onclick = () => { $('#rockForm').hidden = true; };
  const addRock = (split) => {
    const title = $('#rockTitle').value.trim(); if (!title) { $('#rockTitle').focus(); return; }
    const r = { id: uid(), title: clampStr(title, 120), courseId: $('#rockCourse').value, due: $('#rockDue').value || '', notes: clampStr($('#rockNotes').value.trim(), 300), createdAt: Date.now(), pebbles: [] };
    S.rocks.unshift(r); S.openRock = r.id; save();
    $('#rockForm').reset(); $('#rockForm').hidden = true; renderRocks();
    if (split) breakDown(r.id);
  };
  $('#rockForm').onsubmit = e => { e.preventDefault(); addRock(false); };
  $('#rockAddSplit').onclick = () => addRock(true);
  $('#rockFilter').onclick = e => { const b = e.target.closest('button[data-c]'); if (!b) return; rockFilter = b.dataset.c; renderRocks(); };
  $('#rockList').addEventListener('click', e => {
    const art = e.target.closest('[data-rock]'); if (!art) return;
    const id = art.dataset.rock, r = S.rocks.find(x => x.id === id);
    if (e.target.closest('[data-toggle]')) { S.openRock = S.openRock === id ? null : id; renderRocks(); return; }
    const chk = e.target.closest('[data-peb]'); if (chk) { togglePebble(id, chk.dataset.peb); return; }
    const dp = e.target.closest('[data-delpeb]'); if (dp) { r.pebbles = r.pebbles.filter(p => p.id !== dp.dataset.delpeb); save(); renderRocks(); renderNextPebble(); return; }
    if (e.target.closest('[data-ai]')) { breakDown(id); return; }
    if (e.target.closest('[data-aiclose]')) { delete aiDrafts[id]; renderRocks(); return; }
    if (e.target.closest('[data-aiadd]')) { const d = aiDrafts[id]; d.items.forEach(p => r.pebbles.push({ id: uid(), text: p.text, mins: p.mins, done: false })); delete aiDrafts[id]; save(); renderRocks(); renderNextPebble(); toast(`${d.items.length} pebbles added. Start with the first one.`); return; }
    if (e.target.closest('[data-focusrock]')) { const p = r.pebbles.find(x => !x.done); if (p) { S.settings.focus = Math.min(120, p.mins || 15); syncRanges(); renderCourseSelects(); $('#courseSel').value = r.courseId || ''; go('focus'); if (!S.timer) startPhase('focus'); } return; }
    if (e.target.closest('[data-delrock]')) { art.querySelector('[data-delwrap]').innerHTML = `<span class="confirm">Remove this rock and its pebbles? <button class="btn small rose" data-delyes>Remove</button><button class="btn small" data-delno>Keep it</button></span>`; return; }
    if (e.target.closest('[data-delyes]')) { S.rocks = S.rocks.filter(x => x.id !== id); save(); renderRocks(); renderNextPebble(); return; }
    if (e.target.closest('[data-delno]')) { renderRocks(); return; }
  });
  $('#rockList').addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-toggle]')) { e.preventDefault(); e.target.click(); } });
  $('#rockList').addEventListener('submit', e => {
    const f = e.target.closest('[data-addpeb]'); if (!f) return; e.preventDefault();
    const r = S.rocks.find(x => x.id === f.closest('[data-rock]').dataset.rock); const t = f.t.value.trim(); if (!t) return;
    r.pebbles.push({ id: uid(), text: clampStr(t, 120), mins: Math.min(120, Math.max(1, +f.m.value || 15)), done: false });
    save(); renderRocks(); renderNextPebble();
    const nf = $(`[data-rock="${CSS.escape(r.id)}"] [data-addpeb] input`); nf && nf.focus();
  });
  const icsDone = n => { $('#icsModal').classList.remove('on'); toast(n ? `Imported ${n} deadlines from your calendar. They are in Pebbles and on your Calendar.` : 'No upcoming deadlines found. Past events are skipped.'); renderRocks(); renderNextPebble(); renderCal(); renderCalDot(); };
  document.addEventListener('click', e => { if (e.target.closest('[data-icsopen]')) { $('#icsHelp').innerHTML = ''; $('#icsModal').classList.add('on'); setTimeout(() => $('#icsLink').focus(), 50); } });
  $('#icsModal').onclick = e => { if (e.target.id === 'icsModal' || e.target.closest('[data-icsclose]')) $('#icsModal').classList.remove('on'); };
  $('#icsLinkForm').onsubmit = async e => {
    e.preventDefault();
    const url = $('#icsLink').value.trim().replace(/^webcal:\/\//i, 'https://');
    if (!/^https:\/\//i.test(url)) { $('#icsHelp').innerHTML = '<p class="muted">That does not look like a link. It should start with https://</p>'; return; }
    $('#icsHelp').innerHTML = '<p class="muted">Reading your calendar...</p>';
    try {
      const r = await fetch(url); const t = await r.text();
      if (!/BEGIN:VCALENDAR/.test(t)) throw new Error('not ics');
      icsDone(importICS(t));
    } catch (err) {
      // most universities block other sites from reading the link directly, so let the browser download it
      $('#icsHelp').innerHTML = `<div class="card flat" style="padding:14px"><p style="margin:0 0 10px">Blackboard did not let Grind read the link directly. Two quick steps instead:</p><div class="row"><a class="btn small primary" href="${esc(url)}" target="_blank" rel="noopener noreferrer">1. Download the file</a><label class="btn small" for="icsFile">2. Choose the downloaded file</label></div></div>`;
    }
  };
  $('#icsFile').onchange = async e => {
    const f = e.target.files[0]; if (!f) return;
    if ($('#icsModal').classList.contains('on')) { try { icsDone(importICS(await f.text())); } catch (err) { toast('That file could not be read. Make sure it ends in .ics and try again.'); } e.target.value = ''; return; }
    try { const n = importICS(await f.text()); toast(n ? `Imported ${n} deadlines from your calendar. They are in Pebbles and on your Calendar.` : 'No upcoming assignments found in that file.'); }
    catch (err) { toast('That file could not be read. Export the calendar from Blackboard as an .ics file and try again.'); }
    e.target.value = ''; renderRocks(); renderNextPebble(); renderCal(); renderCalDot();
  };
}
function importICS(text) {
  const lines = text.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '').split(/\r?\n/);
  const evs = []; let cur = null;
  lines.forEach(l => {
    if (l === 'BEGIN:VEVENT' || l === 'BEGIN:VTODO') cur = {};
    else if ((l === 'END:VEVENT' || l === 'END:VTODO') && cur) { evs.push(cur); cur = null; }
    else if (cur) { const i = l.indexOf(':'); if (i < 0) return; const k = l.slice(0, i).split(';')[0]; cur[k] = l.slice(i + 1); }
  });
  const unesc = s => (s || '').replace(/\\n/gi, ' ').replace(/\\([,;\\])/g, '$1').trim();
  const today = dayKey(addDays(new Date(), -1));
  let n = 0;
  evs.forEach(ev => {
    const title = unesc(ev.SUMMARY); const raw = ev.DUE || ev.DTSTART || ''; if (!title) return;
    const m = raw.match(/(\d{4})(\d{2})(\d{2})/); const due = m ? `${m[1]}-${m[2]}-${m[3]}` : '';
    if (due && due < today) return;
    const icsId = 'ics-' + (ev.UID || title + due).replace(/[^a-z0-9]/gi, '').slice(0, 40);
    if (S.rocks.some(r => r.icsId === icsId)) return;
    const lc = (title + ' ' + unesc(ev.CATEGORIES || '')).toLowerCase();
    const course = allCourses().find(c => lc.includes(c.name.toLowerCase()));
    S.rocks.push({ id: uid(), icsId, title: clampStr(title, 120), courseId: course ? course.id : '', due, notes: clampStr(unesc(ev.DESCRIPTION), 300), createdAt: Date.now(), pebbles: [] });
    n++;
  });
  save();
  return n;
}
