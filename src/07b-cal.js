/* ---------- calendar and reminders ---------- */
const EV_TYPES = { deadline: 'Deadline', exam: 'Exam or quiz', lab: 'Lab', meeting: 'Meeting', other: 'Other' };
const REMIND_OPTS = [[-1, 'No reminder'], [60, '1 hour before'], [180, '3 hours before'], [1440, '1 day before'], [2880, '2 days before'], [10080, '1 week before']];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let calMonth = dayKey().slice(0, 7), calDay = dayKey(), calEdit = null;

// an event without a time is anchored at 9 in the morning, so "1 day before" lands the morning before
const evAt = e => { const d = keyToDate(e.date); const [h, m] = (e.time || '09:00').split(':').map(Number); d.setHours(h || 0, m || 0, 0, 0); return +d; };
const fmtClock = t => (t ? new Date(`2000-01-01T${t}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '');
function calItems() {
  const ev = (S.events || []).map(e => ({ ...e, kind: 'event' }));
  const rocks = S.rocks.filter(r => r.due && !r.example && !(r.pebbles && r.pebbles.length && r.pebbles.every(p => p.done))).map(r => ({ id: 'rock-' + r.id, rockId: r.id, kind: 'rock', title: r.title, date: r.due, time: '', courseId: r.courseId, type: 'deadline', remind: 1440 }));
  return [...ev, ...rocks].sort((a, b) => evAt(a) - evAt(b));
}
function whenText(it) {
  const n = Math.round((keyToDate(it.date) - keyToDate(dayKey())) / 864e5), t = it.time ? ` at ${fmtClock(it.time)}` : '';
  if (n < 0) return `${-n} day${n === -1 ? '' : 's'} ago`;
  if (n === 0) return 'Today' + t;
  if (n === 1) return 'Tomorrow' + t;
  if (n < 7) return `${WD[keyToDate(it.date).getDay()]}${t}, in ${n} days`;
  const d = keyToDate(it.date); return `${WD[d.getDay()]} ${d.getDate()} ${MO[d.getMonth()]}${t}`;
}
function chipHTML(it) {
  return `<button class="cal-ev ${it.kind === 'rock' ? 'rock' : ''} t-${it.type}" style="--c:${courseColor(it.courseId)}" data-calev="${esc(it.id)}" title="${esc(it.title)}">${it.time ? `<small>${esc(fmtClock(it.time))}</small> ` : ''}${esc(it.title)}</button>`;
}
function renderCal() {
  if (!$('#calGrid')) return;
  const [y, m] = calMonth.split('-').map(Number), first = new Date(y, m - 1, 1), today = dayKey();
  $('#calTitle').textContent = `${MONTHS[m - 1]} ${y}`;
  const items = calItems(), byDay = {};
  items.forEach(it => (byDay[it.date] = byDay[it.date] || []).push(it));
  const start = addDays(first, -first.getDay()), weeks = Math.ceil((first.getDay() + new Date(y, m, 0).getDate()) / 7);
  let cells = '';
  for (let i = 0; i < weeks * 7; i++) {
    const d = addDays(start, i), k = dayKey(d), list = byDay[k] || [], out = d.getMonth() !== m - 1;
    cells += `<div class="cal-day${out ? ' out' : ''}${k === today ? ' today' : ''}${k === calDay ? ' sel' : ''}" data-calday="${k}" role="button" tabindex="0" aria-label="${d.getDate()} ${MO[d.getMonth()]}, ${list.length} item${list.length === 1 ? '' : 's'}"><span class="n">${d.getDate()}</span>${list.slice(0, 3).map(chipHTML).join('')}${list.length > 3 ? `<span class="more">+${list.length - 3} more</span>` : ''}${list.length ? `<span class="dots">${list.slice(0, 4).map(it => `<i style="background:${courseColor(it.courseId)}"></i>`).join('')}</span>` : ''}</div>`;
  }
  $('#calGrid').innerHTML = cells;
  // the selected day
  const dl = byDay[calDay] || [], sd = keyToDate(calDay);
  $('#calDayTitle').textContent = calDay === today ? 'Today' : `${WD[sd.getDay()]} ${sd.getDate()} ${MO[sd.getMonth()]}`;
  $('#calDayList').innerHTML = dl.length ? dl.map(itemRow).join('') : `<li class="muted" style="background:none">Nothing on this day yet.</li>`;
  // coming up in the next two weeks
  const now = Date.now(), soon = items.filter(it => evAt(it) >= now - 864e5 / 2 && it.date >= today && it.date <= dayKey(addDays(new Date(), 14)));
  $('#calSoon').innerHTML = soon.length ? soon.slice(0, 12).map(itemRow).join('') : `<li class="muted" style="background:none">Nothing due in the next two weeks. Add a deadline and Grind will remind you before it.</li>`;
  renderCalAlerts();
}
function itemRow(it) {
  const n = Math.round((keyToDate(it.date) - keyToDate(dayKey())) / 864e5);
  return `<li><span class="bar" style="background:${courseColor(it.courseId)}"></span><span class="nm"><b>${esc(it.title)}</b><span>${esc(whenText(it))} · ${esc(courseName(it.courseId))} · ${it.kind === 'rock' ? 'Rock in Pebbles' : EV_TYPES[it.type] || 'Other'}</span></span>${n >= 0 && n <= 2 ? `<span class="pill soon">${n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : 'Soon'}</span>` : ''}<button class="btn small" data-calev="${esc(it.id)}">${it.kind === 'rock' ? 'Open' : 'Edit'}</button></li>`;
}
function renderCalAlerts() {
  const b = $('#calAlerts'); if (!b) return;
  const has = 'Notification' in window, p = has ? Notification.permission : 'denied';
  b.hidden = !has || p === 'denied' || (p === 'granted' && S.calAlerts !== false);
}
function openEvForm(it) {
  calEdit = it && it.kind === 'event' ? it.id : null;
  const f = $('#evForm'), e = it || { title: '', date: calDay, time: '', courseId: S.lastCourse || '', type: 'deadline', remind: 1440 };
  $('#evFormTitle').textContent = calEdit ? 'Edit' : 'Add to your calendar';
  $('#evCourse').innerHTML = `<option value="">General</option>` + curCourses().map(c => `<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('');
  $('#evType').innerHTML = Object.entries(EV_TYPES).map(([k, v]) => `<option value="${k}">${v}</option>`).join('');
  $('#evRemind').innerHTML = REMIND_OPTS.map(([v, t]) => `<option value="${v}">${t}</option>`).join('');
  $('#evTitle').value = e.title; $('#evDate').value = e.date; $('#evTime').value = e.time || ''; $('#evCourse').value = e.courseId || ''; $('#evType').value = e.type || 'deadline'; $('#evRemind').value = String(e.remind ?? 1440);
  $('#evDel').hidden = !calEdit;
  f.hidden = false; $('#evTitle').focus();
}
function closeEvForm() { $('#evForm').hidden = true; calEdit = null; }

/* reminders: checked every minute while the site is open, and once when it loads */
function reminderList() {
  return calItems().filter(it => it.remind >= 0).map(it => ({ it, key: `${it.id}@${evAt(it)}@${it.remind}`, at: evAt(it) - it.remind * 60000, due: evAt(it) }));
}
function checkReminders() {
  S.remDone = S.remDone || {};
  const now = Date.now(); let fired = 0;
  reminderList().forEach(r => {
    if (S.remDone[r.key] || r.at > now || r.due < now) return;
    S.remDone[r.key] = now; fired++;
    const n = Math.round((keyToDate(r.it.date) - keyToDate(dayKey())) / 864e5);
    const text = `${r.it.title} is ${r.it.type === 'deadline' ? 'due ' : ''}${n === 0 ? 'today' : n === 1 ? 'tomorrow' : `in ${n} days`}${r.it.time ? ` at ${fmtClock(r.it.time)}` : ''}.`;
    S.remLog = [{ at: now, id: r.it.id, text, courseId: r.it.courseId }, ...(S.remLog || [])].slice(0, 30);
    if (fired <= 3) toast(esc(text), `<span class="toast-ic">${icon('i-bell')}</span>`);
    if ('Notification' in window && Notification.permission === 'granted' && S.calAlerts !== false) { try { new Notification('Grind reminder', { body: text, tag: r.key }); } catch (e) {} }
  });
  // forget reminders for things that are long past
  Object.keys(S.remDone).forEach(k => { if (now - S.remDone[k] > 60 * 864e5) delete S.remDone[k]; });
  if (fired) { save(); renderNotes(); }
  renderCalDot();
}
function renderCalDot() {
  const d = $('#calDot'); if (!d) return;
  const lim = dayKey(addDays(new Date(), 2)), today = dayKey();
  d.hidden = !calItems().some(it => it.date >= today && it.date <= lim && evAt(it) >= Date.now());
}

function bindCal() {
  $('#calPrev').onclick = () => { const [y, m] = calMonth.split('-').map(Number); calMonth = dayKey(new Date(y, m - 2, 1)).slice(0, 7); renderCal(); };
  $('#calNext').onclick = () => { const [y, m] = calMonth.split('-').map(Number); calMonth = dayKey(new Date(y, m, 1)).slice(0, 7); renderCal(); };
  $('#calToday').onclick = () => { calDay = dayKey(); calMonth = calDay.slice(0, 7); renderCal(); };
  $('#calAdd').onclick = () => openEvForm();
  $('#calDayAdd').onclick = () => openEvForm();
  $('#v-cal').addEventListener('click', e => {
    const ev = e.target.closest('[data-calev]');
    if (ev) {
      e.stopPropagation();
      const it = calItems().find(x => x.id === ev.dataset.calev); if (!it) return;
      if (it.kind === 'rock') { S.openRock = it.rockId; save(); go('pebbles'); return; }
      calDay = it.date; renderCal(); openEvForm(it); return;
    }
    const d = e.target.closest('[data-calday]');
    if (d) { calDay = d.dataset.calday; if (calDay.slice(0, 7) !== calMonth) calMonth = calDay.slice(0, 7); renderCal(); }
  });
  $('#calGrid').addEventListener('dblclick', e => { const d = e.target.closest('[data-calday]'); if (d && !e.target.closest('[data-calev]')) { calDay = d.dataset.calday; openEvForm(); } });
  $('#calGrid').addEventListener('keydown', e => { const d = e.target.closest('[data-calday]'); if (d && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); d.click(); } });
  $('#evCancel').onclick = closeEvForm;
  $('#evForm').addEventListener('submit', e => {
    e.preventDefault();
    const title = $('#evTitle').value.trim(), date = $('#evDate').value;
    if (!title || !date) return;
    const data = { title: clampStr(title, 100), date, time: $('#evTime').value || '', courseId: $('#evCourse').value, type: EV_TYPES[$('#evType').value] ? $('#evType').value : 'other', remind: +$('#evRemind').value };
    S.events = S.events || [];
    if (calEdit) { const x = S.events.find(v => v.id === calEdit); if (x) Object.assign(x, data); }
    else S.events.push({ id: uid(), createdAt: Date.now(), ...data });
    calDay = date; calMonth = date.slice(0, 7);
    toast(calEdit ? 'Saved.' : data.remind >= 0 ? `Added. You will get a reminder ${REMIND_OPTS.find(o => o[0] === data.remind)[1]}.` : 'Added to your calendar.');
    closeEvForm(); save(); renderCal(); checkReminders();
  });
  $('#evDel').onclick = () => { if (!calEdit) return; S.events = S.events.filter(v => v.id !== calEdit); closeEvForm(); save(); renderCal(); renderCalDot(); toast('Removed from your calendar.'); };
  $('#calAlerts').onclick = async () => {
    if (!('Notification' in window)) return;
    let p = Notification.permission;
    if (p === 'default') { try { p = await Notification.requestPermission(); } catch (e) {} }
    if (p === 'granted') { S.calAlerts = true; save(); toast('Reminders will also pop up on this device while Grind is open in a tab.'); }
    renderCalAlerts();
  };
  checkReminders();
  setInterval(() => { checkReminders(); if (currentView === 'cal') renderCal(); }, 60000);
}
