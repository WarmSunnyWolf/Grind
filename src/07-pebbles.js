/* ---------- rocks and pebbles ---------- */
let rockFilter = 'all';
const aiDrafts = {};
function rockArt(color) {
  return `<svg class="rk" viewBox="0 0 52 42" aria-hidden="true"><path d="M3 32 C1 18 12 6 26 5 C40 4 50 14 49 26 C48 37 37 40 25 40 C13 40 4 38 3 32 Z" fill="${color}" stroke="${INK}" stroke-width="2.4"/><path d="M12 22 C16 15 22 12 29 12" stroke="#fff" stroke-opacity=".45" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M30 30 l6 -4 M18 32 l5 1" stroke="${INK}" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"/></svg>`;
}
let lastLaid = null, editRock = null, editPeb = null, showCrossed = false, finishAsk = null;
function crossPos(stones, all) {
  const lastDone = [...stones].reverse().find(s => s.done);
  return all ? { x: 548, y: 58 } : lastDone ? { x: lastDone.x, y: lastDone.y } : { x: 46, y: 62 };
}
function crossingSVG(rock, final) {
  const n = Math.max(1, rock.pebbles.length), done = rock.pebbles.filter(p => p.done).length;
  const x0 = 92, x1 = 508;
  const stones = rock.pebbles.map((p, i) => {
    const x = n === 1 ? 300 : x0 + (x1 - x0) * i / (n - 1), y = 70 + Math.sin(i * 1.3) * 9;
    return { x, y, done: p.done, id: p.id };
  });
  const all = final || rockDone(rock);
  const at = crossPos(stones, all);
  // the animal hops from where it stood before the newest stone was laid
  const laid = !final && lastLaid && lastLaid.rock === rock.id ? lastLaid.peb : null;
  let hop = '';
  if (laid) {
    const before = crossPos(stones.map(s => s.id === laid ? { ...s, done: false } : s), lastLaid.crossed ? false : all);
    hop = ` hop" style="--dx:${before.x - at.x}px; --dy:${before.y - at.y}px`;
  }
  return `<svg viewBox="0 0 600 120" role="img" aria-label="${done} of ${rock.pebbles.length} stepping stones laid">
    <rect width="600" height="120" fill="var(--water)"/>
    <path d="M70 26 h60 M250 18 h50 M420 30 h70 M160 104 h50 M360 108 h60" stroke="var(--water-hi)" stroke-width="3" stroke-linecap="round" opacity=".8"/>
    <path d="M0 0 H52 C70 30 66 90 50 120 H0 Z" fill="var(--bank)" stroke="var(--pad-2)" stroke-width="2"/>
    <path d="M600 0 H548 C530 30 534 90 550 120 H600 Z" fill="var(--bank)" stroke="var(--pad-2)" stroke-width="2"/>
    <g transform="translate(578 40)"><g class="${all ? 'lotus-open' : ''}"><path d="M0 0 C-8 -5 -10 -14 -5 -19 C-2 -13 0 -8 0 0 Z M0 0 C8 -5 10 -14 5 -19 C2 -13 0 -8 0 0 Z M0 0 C-4 -8 -3 -18 0 -23 C3 -18 4 -8 0 0 Z" fill="${all ? 'var(--bloom)' : 'var(--line-2)'}" stroke="${INK}" stroke-width="1.4"/></g></g>
    ${stones.map(s => `<ellipse cx="${s.x}" cy="${s.y + 6}" rx="24" ry="7" fill="var(--water-2)" opacity=".6"/>${s.id === laid ? `<ellipse class="splash" cx="${s.x}" cy="${s.y + 4}" rx="26" ry="9" fill="none" stroke="var(--water-hi)" stroke-width="3"/><ellipse class="splash s2" cx="${s.x}" cy="${s.y + 4}" rx="26" ry="9" fill="none" stroke="var(--water-hi)" stroke-width="2"/>` : ''}<path class="${s.id === laid ? 'stone-new' : ''}" d="M${s.x - 24} ${s.y + 2} C${s.x - 24} ${s.y - 10} ${s.x - 10} ${s.y - 13} ${s.x} ${s.y - 13} C${s.x + 14} ${s.y - 13} ${s.x + 24} ${s.y - 8} ${s.x + 24} ${s.y + 1} C${s.x + 24} ${s.y + 8} ${s.x + 12} ${s.y + 10} ${s.x} ${s.y + 10} C${s.x - 12} ${s.y + 10} ${s.x - 24} ${s.y + 8} ${s.x - 24} ${s.y + 2} Z" fill="${s.done ? '#b9ad97' : 'none'}" stroke="${s.done ? INK : 'var(--water-hi)'}" stroke-width="2.2" ${s.done ? '' : 'stroke-dasharray="5 5"'}/>`).join('')}
    <g class="hopper${hop}">${animalSVG(S.active, all ? 'happy' : 'awake', { look: myLook(), nested: true, x: at.x - 30, y: at.y - 56, w: 60, label: petName() })}</g>
  </svg>`;
}
/* the cairn: one stone for every rock ever crossed, even if the rock is deleted later */
function cairnSVG(max = 9, freshId) {
  const log = (S.crossLog || []).slice(-max), n = log.length, h = 24, W = 120, H = Math.max(1, n) * (h - 5) + 40;
  let y = H - 8, out = `<ellipse cx="${W / 2}" cy="${H - 6}" rx="54" ry="5" fill="${INK}" opacity=".1"/>`;
  if (!n) out += `<path d="M14 ${y - 2} C14 ${y - 20} 40 ${y - 24} 60 ${y - 24} C84 ${y - 24} 106 ${y - 18} 106 ${y - 3} C106 ${y + 2} 86 ${y + 3} 60 ${y + 3} C34 ${y + 3} 14 ${y + 2} 14 ${y - 2} Z" fill="none" stroke="var(--line-2)" stroke-width="2.2" stroke-dasharray="6 5"/>`;
  log.forEach((c, i) => {
    const w = Math.max(44, 96 - i * 6), x = W / 2 + (i ? (i % 2 ? 4 : -4) : 0), col = okColor(c.color) || courseColor(c.courseId), t = y - h / 2 - 2, bt = y + 1;
    out += `<g class="cairn-st${c.id === freshId ? ' new' : ''}"><title>${esc(c.title)} · ${new Date(c.at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</title>
      <path d="M${x - w / 2} ${y - 4} C${x - w / 2} ${t} ${x - w / 4} ${t - 2} ${x} ${t - 2} C${x + w / 4} ${t - 2} ${x + w / 2} ${t} ${x + w / 2} ${y - 3} C${x + w / 2} ${bt} ${x + w / 4} ${bt + 1} ${x} ${bt + 1} C${x - w / 4} ${bt + 1} ${x - w / 2} ${bt} ${x - w / 2} ${y - 4} Z" fill="${col}" stroke="${INK}" stroke-width="2.2"/>
      <path d="M${x - w / 4} ${t + 3} q${w / 8} -3 ${w / 4} -2" stroke="#fff" stroke-opacity=".5" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>`;
    y -= h - 5;
  });
  if (n) { const ty = y - 2; out += `<g transform="translate(${W / 2} ${ty})"><path d="M0 0 C0 -6 0 -10 0 -12" stroke="#5f8a4a" stroke-width="2.4" stroke-linecap="round"/><path d="M0 -8 C-8 -10 -11 -16 -9 -20 C-3 -18 0 -14 0 -8 Z M0 -10 C7 -13 11 -18 9 -22 C3 -20 0 -16 0 -10 Z" fill="#8fb069" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/></g>`; }
  return `<svg class="cairn" viewBox="0 ${n ? Math.min(0, y - 30) : 0} ${W} ${H - (n ? Math.min(0, y - 30) : 0)}" role="img" aria-label="${n} rocks crossed">${out}</svg>`;
}
function weekCounts() {
  const w = weekStart().getTime();
  return { peb: (S.pebLog || []).filter(x => x.at >= w).length, rocks: (S.crossLog || []).filter(x => x.at >= w).length };
}
function renderCairn() {
  const el = $('#cairnCard'); if (!el) return;
  const total = (S.crossLog || []).length, wk = weekCounts(), ws = weekStart();
  const days = Array.from({ length: 7 }, (_, i) => { const d = addDays(ws, i), k = dayKey(d); return { l: d.toLocaleDateString(undefined, { weekday: 'narrow' }), n: (S.pebLog || []).filter(x => dayKey(new Date(x.at)) === k).length, today: k === dayKey() }; });
  el.innerHTML = `<div class="cairn-pic">${cairnSVG(9)}</div>
    <div class="cairn-txt">
      <span class="eyebrow">Your cairn</span>
      <h2>${total ? `${total} ${total === 1 ? 'rock' : 'rocks'} crossed` : 'Cross a rock to start your cairn'}</h2>
      <p class="muted">Every rock you finish adds a stone that stays, even after you remove the rock.${total > 9 ? ` Showing the newest 9.` : ''}</p>
      <div class="cairn-stats"><div><b>${wk.peb}</b><span>pebbles this week</span></div><div><b>${wk.rocks}</b><span>rocks this week</span></div><div><b>${(S.pebLog || []).length}</b><span>pebbles all time</span></div></div>
    </div>
    <div class="week-peb" aria-label="Pebbles laid each day this week">${days.map(d => `<div class="${d.today ? 'today' : ''}"><span class="wp-st">${Array.from({ length: Math.min(5, d.n) }, () => '<i></i>').join('')}${d.n > 5 ? `<small>+${d.n - 5}</small>` : ''}</span><b>${d.l}</b></div>`).join('')}</div>`;
}
function renderRockFilter() {
  const cs = curCourses();
  $('#rockFilter').innerHTML = `<div class="seg" role="group" aria-label="Filter by course"><button data-c="all" aria-pressed="${rockFilter === 'all'}">All</button>${cs.map(c => `<button data-c="${esc(c.id)}" aria-pressed="${rockFilter === c.id}">${esc(c.name)}</button>`).join('')}<button data-c="" aria-pressed="${rockFilter === ''}">General</button></div>`;
}
function rockCard(r) {
  const d = r.pebbles.filter(p => p.done).length, n = r.pebbles.length, open = S.openRock === r.id, done = rockDone(r);
  const draft = aiDrafts[r.id], col = okColor(r.color) || courseColor(r.courseId), justPct = lastLaid && lastLaid.rock === r.id ? lastLaid.pct : null;
  const pct = n ? d / n * 100 : done ? 100 : 0;
  const cOpts = `<option value="">General</option>` + curCourses().map(c => `<option value="${esc(c.id)}" ${c.id === r.courseId ? 'selected' : ''}>${esc(c.name)}</option>`).join('');
  const pebLi = p => editPeb === p.id
    ? `<li class="peb editing"><form class="peb-edit" data-pebedit="${esc(p.id)}"><input class="inp" name="t" maxlength="120" value="${esc(p.text)}" aria-label="Pebble"><input class="inp" name="m" type="number" min="1" max="120" value="${p.mins || 15}" aria-label="Minutes" style="max-width:76px"><button type="button" class="icon-btn sm" data-pebmove="-1" aria-label="Move up"><svg style="transform:rotate(-90deg)"><use href="#i-chev"/></svg></button><button type="button" class="icon-btn sm" data-pebmove="1" aria-label="Move down"><svg style="transform:rotate(90deg)"><use href="#i-chev"/></svg></button><button class="btn small primary" type="submit">Save</button><button type="button" class="btn small" data-pebcancel>Cancel</button></form></li>`
    : `<li class="peb ${p.done ? 'done' : ''} ${lastLaid && lastLaid.peb === p.id ? 'just' : ''}"><button class="chk" data-peb="${esc(p.id)}" aria-label="${p.done ? 'Mark not done' : 'Mark done'}: ${esc(p.text)}">${icon('i-check')}</button><span class="tx" data-pebtx="${esc(p.id)}" title="Click to edit">${esc(p.text)}</span>${lastLaid && lastLaid.peb === p.id ? `<span class="coin-pop">+3</span>` : ''}<span class="mins">${p.mins || 15} min</span><button class="icon-btn sm" data-editpeb="${esc(p.id)}" aria-label="Edit pebble">${icon('i-edit')}</button><button class="icon-btn sm" data-delpeb="${esc(p.id)}" aria-label="Remove pebble">${icon('i-x')}</button></li>`;
  return `<article class="rock ${done ? 'crossed' : ''}" data-rock="${esc(r.id)}">
      <div class="rock-head" data-toggle role="button" tabindex="0" aria-expanded="${open}">${rockArt(col)}
        <div class="meta"><h3>${esc(r.title)}</h3><div class="sub"><span class="pill"><i style="background:${col}"></i>${esc(courseName(r.courseId))}</span>${r.due && !done ? `<span class="due">${dueText(r.due)}</span>` : ''}${r.example ? '<span class="pill example">Example</span>' : ''}${done ? `<span class="pill crossed-pill">${icon('i-check')}Crossed ${new Date(r.crossedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>` : ''}</div></div>
        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px; min-width:90px"><span class="muted num" style="font-size:.82rem">${n ? `${d} of ${n} pebbles` : done ? 'Done' : 'No pebbles'}</span><span class="prog-bar" style="width:90px"><i style="width:${justPct !== null ? justPct : pct}%" ${justPct !== null ? `data-to="${pct}"` : ''}></i></span></div>
      </div>
      ${open ? `<div class="rock-body">
        ${editRock === r.id ? `<form class="rock-edit form-grid" data-rockedit>
          <label class="f" style="grid-column:1/-1">Task<input class="inp" name="title" required maxlength="120" value="${esc(r.title)}"></label>
          <label class="f">Course<select class="inp" name="course">${cOpts}</select></label>
          <label class="f">Due date<input class="inp" name="due" type="date" value="${esc(r.due || '')}"></label>
          <label class="f" style="grid-column:1/-1">Notes<textarea class="inp" name="notes" maxlength="300" rows="2">${esc(r.notes || '')}</textarea></label>
          <div class="row" style="grid-column:1/-1; justify-content:flex-end"><button type="button" class="btn small" data-rockcancel>Cancel</button><button class="btn small primary" type="submit">Save changes</button></div>
        </form>` : ''}
        <div class="crossing">${crossingSVG(r)}</div>
        ${r.pebbles.length ? `<ul class="peb-list">${r.pebbles.map(pebLi).join('')}</ul>` : `<p class="muted">${done ? 'Finished without pebbles. Nice and simple.' : 'No pebbles yet. Add the smallest first step you can think of, let Claude break it down, or just finish the rock when it is done.'}</p>`}
        ${draft ? aiBox(r.id, draft) : ''}
        <form class="add-peb" data-addpeb><input class="inp" name="t" maxlength="120" placeholder="Add a pebble, like “read pages 10 to 14”" aria-label="New pebble"><input class="inp" name="m" type="number" min="1" max="120" value="15" style="max-width:80px" aria-label="Minutes"><button class="btn" type="submit">${icon('i-plus')}Add</button></form>
        ${finishAsk === r.id ? `<div class="confirm-row"><span>Mark the ${n - d} ${n - d === 1 ? 'pebble' : 'pebbles'} left as done and cross the rock?</span><button class="btn small primary" data-finishyes>Yes, cross it</button><button class="btn small" data-finishno>Not yet</button></div>` : ''}
        <div class="row">${done ? `<button class="btn small" data-reopen>Not done yet</button>` : `<button class="btn small primary" data-finish>${icon('i-check')}Finish rock</button><button class="btn small" data-ai>${icon('i-wand')}Break it down</button><button class="btn small" data-focusrock ${d === n ? 'disabled' : ''}>${icon('i-play')}Focus on next pebble</button>`}<button class="btn small" data-editrock>${icon('i-edit')}Edit</button><span class="rock-colors" role="group" aria-label="Rock colour">${['', ...EV_COLORS].map(c => `<button type="button" class="rc ${(okColor(r.color) || '') === c ? 'on' : ''}" data-rockc="${c}" title="${c ? 'Colour' : 'Course colour'}" style="background:${c || courseColor(r.courseId)}">${c ? '' : '<small>A</small>'}</button>`).join('')}</span><span style="flex:1"></span><span data-delwrap><button class="btn small quiet" data-delrock>${icon('i-trash')}Remove rock</button></span></div>
      </div>` : ''}
    </article>`;
}
function renderRocks() {
  renderRockFilter(); renderCairn();
  const rocks = S.rocks.filter(r => rockFilter === 'all' || (r.courseId || '') === rockFilter);
  const active = rocks.filter(r => !rockDone(r)).sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999') || b.createdAt - a.createdAt);
  const crossed = rocks.filter(rockDone).sort((a, b) => b.crossedAt - a.crossedAt);
  const el = $('#rockList');
  if (!rocks.length) { el.innerHTML = `<div class="card flat empty"><span class="hand">No rocks here.</span><span>Add a big task and split it into pebbles, or import your Blackboard calendar.</span></div>`; return; }
  el.innerHTML = (active.length ? active.map(rockCard).join('') : `<div class="card flat empty"><span class="hand">Every rock is crossed.</span><span>Enjoy it. Add a new rock when the next big task comes up.</span></div>`)
    + (crossed.length ? `<button class="btn small quiet crossed-toggle" data-showcrossed aria-expanded="${showCrossed}">${icon('i-chev')}${showCrossed ? 'Hide' : 'Show'} ${crossed.length} crossed ${crossed.length === 1 ? 'rock' : 'rocks'}</button>${showCrossed ? crossed.map(rockCard).join('') : ''}` : '');
  requestAnimationFrame(() => requestAnimationFrame(() => $$('#rockList [data-to]').forEach(b => { b.style.width = b.dataset.to + '%'; })));
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
function plop() {
  if (!S.settings.sound) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime, o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(820, now); o.frequency.exponentialRampToValueAtTime(190, now + .16);
    g.gain.setValueAtTime(.0001, now); g.gain.exponentialRampToValueAtTime(.22, now + .012); g.gain.exponentialRampToValueAtTime(.0001, now + .28);
    o.connect(g).connect(audioCtx.destination); o.start(now); o.stop(now + .3);
  } catch (e) {}
}
function fanfare() {
  if (!S.settings.sound) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    [[523.25, 0], [659.25, .11], [783.99, .22], [1046.5, .33], [783.99, .5], [1046.5, .58], [1318.5, .66]].forEach(([f, d], i) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = i > 3 ? 'sine' : 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(.0001, now + d); g.gain.exponentialRampToValueAtTime(.13, now + d + .02); g.gain.exponentialRampToValueAtTime(.0001, now + d + (i === 6 ? 1.4 : .5));
      o.connect(g).connect(audioCtx.destination); o.start(now + d); o.stop(now + d + 1.5);
    });
  } catch (e) {}
}
function crossRock(r) {
  r.crossedAt = Date.now();
  if (!r.example) { S.crossLog = (S.crossLog || []).filter(x => x.id !== r.id); S.crossLog.push(crossEntry(r)); }
  addCoins(10);
  S.lastCrossed = { title: r.title, at: Date.now() };
  makeHappy(5000); say('We crossed the whole pond!');
  setTimeout(() => celebrateRock(r), 700);
}
function uncrossRock(r) {
  if (!r.crossedAt) return;
  delete r.crossedAt;
  S.coins = Math.max(0, S.coins - 10);
  S.crossLog = (S.crossLog || []).filter(x => x.id !== r.id);
}
function layPebble(r, p) {
  p.done = true; p.doneAt = Date.now();
  S.pebLog.push({ id: p.id, at: p.doneAt, text: p.text, rock: r.title, courseId: r.courseId });
}
function togglePebble(rockId, pebId) {
  const r = S.rocks.find(x => x.id === rockId); if (!r) return;
  const p = r.pebbles.find(x => x.id === pebId); if (!p) return;
  const n = r.pebbles.length, before = r.pebbles.filter(x => x.done).length;
  if (!p.done) {
    layPebble(r, p);
    addCoins(3, currentView === 'pebbles' ? '' : 'for laying a stepping stone');
    const crossed = r.pebbles.every(x => x.done);
    lastLaid = { rock: r.id, peb: p.id, pct: before / n * 100, crossed };
    clearTimeout(togglePebble.t); togglePebble.t = setTimeout(() => { lastLaid = null; }, 1500);
    plop();
    if (crossed && !r.crossedAt) crossRock(r);
    checkUnlocks();
  } else {
    p.done = false;
    S.pebLog = S.pebLog.filter(x => x.id !== p.id);
    S.coins = Math.max(0, S.coins - 3);
    uncrossRock(r);
  }
  save(); renderAllLight(); afterProgress();
}
function finishRock(r) {
  const left = r.pebbles.filter(p => !p.done);
  left.forEach(p => layPebble(r, p));
  if (left.length) addCoins(3 * left.length);
  lastLaid = { rock: r.id, peb: left.length ? left[left.length - 1].id : null, pct: (r.pebbles.length - left.length) / Math.max(1, r.pebbles.length) * 100, crossed: true };
  clearTimeout(togglePebble.t); togglePebble.t = setTimeout(() => { lastLaid = null; }, 1500);
  finishAsk = null; plop();
  crossRock(r); checkUnlocks();
  save(); renderAllLight(); afterProgress();
}
function celebrateRock(r) {
  const n = r.pebbles.length, mins = r.pebbles.reduce((a, p) => a + (p.mins || 15), 0), coins = 10 + 3 * n;
  let when = null;
  if (r.due) {
    const days = Math.round((new Date(r.due + 'T00:00') - new Date(dayKey() + 'T00:00')) / 864e5);
    when = days > 0 ? [days, days === 1 ? 'day early' : 'days early'] : days === 0 ? ['On time', 'finished on the due day'] : [-days, -days === 1 ? 'day past due, still done' : 'days past due, still done'];
  }
  const wk = weekCounts().rocks, total = (S.crossLog || []).length;
  const cols = ['var(--bloom)', 'var(--rose)', 'var(--accent)', '#f1c26b', okColor(r.color) || courseColor(r.courseId)];
  const petals = Array.from({ length: 28 }, (_, i) => `<i style="left:${(i * 37) % 100}%; --d:${((i * 7) % 10) / 10}s; --t:${2.4 + (i % 5) * .35}s; --r:${(i * 53) % 360}deg; --x:${(i % 2 ? 1 : -1) * (20 + (i * 11) % 40)}px; background:${cols[i % cols.length]}"></i>`).join('');
  const tile = (b, l) => `<div><b>${b}</b><span>${l}</span></div>`;
  $('#crossBox').innerHTML = `<div class="petals" aria-hidden="true">${petals}</div>
    <div class="cross-scene">${crossingSVG(r, true)}</div>
    <div class="cross-txt"><span class="hand">You crossed the pond</span><h2>${esc(r.title)}</h2><p class="muted">${esc(courseName(r.courseId))}</p></div>
    <div class="cross-stats">${n ? tile(n, n === 1 ? 'pebble laid' : 'pebbles laid') + tile(fmtMin(mins), 'of work planned and done') : tile('1', 'rock finished')}${when ? tile(when[0], when[1]) : ''}${tile(`+<em data-count="${coins}">0</em>`, 'coins earned')}</div>
    ${r.example ? '' : `<div class="cross-cairn">${cairnSVG(6, r.id)}<p><b>${wk === 1 ? 'Your first rock this week.' : `${wk} rocks crossed this week.`}</b><br><span class="muted">Your cairn is ${total} ${total === 1 ? 'stone' : 'stones'} tall now.</span></p></div>`}
    <div class="row" style="justify-content:flex-end"><button class="btn" data-crossshare>Share the win</button><button class="btn primary" data-crossclose>Keep going</button></div>`;
  $('#crossBox').dataset.title = r.title;
  $('#crossModal').classList.add('on');
  fanfare();
  const c = $('#crossBox [data-count]'), t0 = performance.now();
  const step = t => { const k = Math.min(1, (t - t0) / 900); c.textContent = Math.round(coins * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
function bindPebbles() {
  $('#crossModal').addEventListener('click', e => {
    if (e.target.closest('[data-crossshare]')) { $('#crossModal').classList.remove('on'); go('commons'); postKind = 'win'; $$('#composer [data-kind]').forEach(x => x.setAttribute('aria-pressed', x.dataset.kind === 'win')); $('#postTitle').value = `Crossed “${$('#crossBox').dataset.title}”`; $('#postBody').focus(); return; }
    if (e.target.id === 'crossModal' || e.target.closest('[data-crossclose]')) $('#crossModal').classList.remove('on');
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') $('#crossModal').classList.remove('on'); });
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
    if (e.target.closest('[data-showcrossed]')) { showCrossed = !showCrossed; renderRocks(); return; }
    const art = e.target.closest('[data-rock]'); if (!art) return;
    const id = art.dataset.rock, r = S.rocks.find(x => x.id === id);
    if (e.target.closest('[data-toggle]')) { S.openRock = S.openRock === id ? null : id; renderRocks(); return; }
    const chk = e.target.closest('[data-peb]'); if (chk) { togglePebble(id, chk.dataset.peb); return; }
    const ep = e.target.closest('[data-editpeb]') || e.target.closest('[data-pebtx]'); if (ep) { editPeb = ep.dataset.editpeb || ep.dataset.pebtx; renderRocks(); const i = $(`[data-pebedit="${CSS.escape(editPeb)}"] input`); if (i) { i.focus(); i.select(); } return; }
    if (e.target.closest('[data-pebcancel]')) { editPeb = null; renderRocks(); return; }
    const mv = e.target.closest('[data-pebmove]'); if (mv) { const i = r.pebbles.findIndex(p => p.id === editPeb), j = i + +mv.dataset.pebmove; if (i >= 0 && j >= 0 && j < r.pebbles.length) { const f = mv.closest('form'), cur = r.pebbles[i]; cur.text = clampStr(f.t.value.trim(), 120) || cur.text; cur.mins = Math.min(120, Math.max(1, +f.m.value || cur.mins || 15)); [r.pebbles[i], r.pebbles[j]] = [r.pebbles[j], r.pebbles[i]]; save(); renderRocks(); renderNextPebble(); $(`[data-pebedit="${CSS.escape(editPeb)}"] [data-pebmove="${mv.dataset.pebmove}"]`)?.focus(); } return; }
    if (e.target.closest('[data-editrock]')) { editRock = editRock === id ? null : id; renderRocks(); $(`[data-rock="${CSS.escape(id)}"] [data-rockedit] input`)?.focus(); return; }
    if (e.target.closest('[data-rockcancel]')) { editRock = null; renderRocks(); return; }
    if (e.target.closest('[data-finish]')) { if (r.pebbles.some(p => !p.done)) { finishAsk = id; renderRocks(); } else finishRock(r); return; }
    if (e.target.closest('[data-finishyes]')) { finishRock(r); return; }
    if (e.target.closest('[data-finishno]')) { finishAsk = null; renderRocks(); return; }
    if (e.target.closest('[data-reopen]')) { uncrossRock(r); save(); renderAllLight(); afterProgress(); toast('Rock reopened. Its stone left the cairn for now.'); return; }
    const dp = e.target.closest('[data-delpeb]'); if (dp) { r.pebbles = r.pebbles.filter(p => p.id !== dp.dataset.delpeb); save(); renderRocks(); renderNextPebble(); return; }
    if (e.target.closest('[data-ai]')) { breakDown(id); return; }
    if (e.target.closest('[data-aiclose]')) { delete aiDrafts[id]; renderRocks(); return; }
    if (e.target.closest('[data-aiadd]')) { const d = aiDrafts[id]; d.items.forEach(p => r.pebbles.push({ id: uid(), text: p.text, mins: p.mins, done: false })); delete aiDrafts[id]; save(); renderRocks(); renderNextPebble(); toast(`${d.items.length} pebbles added. Start with the first one.`); return; }
    if (e.target.closest('[data-focusrock]')) { const p = r.pebbles.find(x => !x.done); if (p) { S.settings.focus = Math.min(120, p.mins || 15); syncRanges(); renderCourseSelects(); $('#courseSel').value = r.courseId || ''; go('focus'); if (!S.timer) startPhase('focus'); } return; }
    const rc = e.target.closest('[data-rockc]'); if (rc) { const r = S.rocks.find(x => x.id === art.dataset.rock); if (r) { r.color = okColor(rc.dataset.rockc); save(); renderRocks(); } return; }
    if (e.target.closest('[data-delrock]')) { art.querySelector('[data-delwrap]').innerHTML = `<span class="confirm">Remove this rock and its pebbles? <button class="btn small rose" data-delyes>Remove</button><button class="btn small" data-delno>Keep it</button></span>`; return; }
    if (e.target.closest('[data-delyes]')) { S.rocks = S.rocks.filter(x => x.id !== id); save(); renderRocks(); renderNextPebble(); return; }
    if (e.target.closest('[data-delno]')) { renderRocks(); return; }
  });
  $('#rockList').addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-toggle]')) { e.preventDefault(); e.target.click(); } });
  $('#rockList').addEventListener('keydown', e => { if (e.key === 'Escape' && (editPeb || editRock)) { editPeb = null; editRock = null; renderRocks(); } });
  $('#rockList').addEventListener('submit', e => {
    const pe = e.target.closest('[data-pebedit]');
    if (pe) {
      e.preventDefault();
      const r = S.rocks.find(x => x.id === pe.closest('[data-rock]').dataset.rock), p = r && r.pebbles.find(x => x.id === pe.dataset.pebedit);
      if (p) { p.text = clampStr(pe.t.value.trim(), 120) || p.text; p.mins = Math.min(120, Math.max(1, +pe.m.value || 15)); }
      editPeb = null; save(); renderRocks(); renderNextPebble(); return;
    }
    const re = e.target.closest('[data-rockedit]');
    if (re) {
      e.preventDefault();
      const r = S.rocks.find(x => x.id === re.closest('[data-rock]').dataset.rock); if (!r) return;
      r.title = clampStr(re.title.value.trim(), 120) || r.title; r.courseId = re.course.value; r.due = re.due.value || ''; r.notes = clampStr(re.notes.value.trim(), 300); delete r.example;
      const c = (S.crossLog || []).find(x => x.id === r.id); if (c) Object.assign(c, { title: r.title, courseId: r.courseId });
      editRock = null; save(); renderAllLight(); toast('Rock updated.'); return;
    }
    const f = e.target.closest('[data-addpeb]'); if (!f) return; e.preventDefault();
    const r = S.rocks.find(x => x.id === f.closest('[data-rock]').dataset.rock); const t = f.t.value.trim(); if (!t) return;
    if (r.crossedAt) { uncrossRock(r); toast('New pebble added, so the rock is open again.'); }
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
