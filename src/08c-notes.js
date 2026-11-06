/* ---------- what's new ----------
   Add an entry at the top for every update students should hear about. It shows once as a
   "What's new" card, in the bell, and on the guide page. bell:false keeps it on the guide only. */
const UPDATES = [
  { id: 'weekhours', at: Date.UTC(2026, 10, 6, 17, 20), title: 'Your hours, week by week', text: 'The journal now shows how many hours you studied each week and each month. A new week starts every Monday, and you can compare this week with last week, your average and your best.', go: 'stats' },
  { id: 'courseedit', at: Date.UTC(2026, 10, 6, 17, 10), title: 'Rename and recolour your courses', text: 'Made a typo or want a new colour? Open your profile and click the pencil on any course. Your sessions, rocks and calendar follow the change.', go: 'profile' },
  { id: 'padpics2', at: Date.UTC(2026, 10, 6, 17, 0), title: 'Bigger, sharper pictures in your notes', text: 'Pictures in Notes to self now show whole and big, and wide screenshots stretch across the page so you can read them. Click the gear on a picture to change its size, crop, corners, frame or caption, and click the picture to open it full screen and zoom in.', go: 'focus' },
  { id: 'padpics', at: Date.UTC(2026, 10, 6, 3, 30), title: 'Pictures in your notes', text: 'Notes to self on Focus now grows as you write, and you can add up to three pictures, like a quote you saved or a mood board. Click Picture, or paste one straight in.', go: 'focus' },
  { id: 'focusday', at: Date.UTC(2026, 10, 3, 12, 0), title: 'A friendlier Focus page', text: 'See how much you studied today at the top of Focus, type your focus length or slide it, pick 20 min, 30 min, 1 hour or 2 hours in one tap, and keep a quote or reminder in the new Notes to self box.', go: 'focus' },
  { id: 'nov', at: Date.UTC(2026, 10, 2, 5, 0), title: 'The November challenge', text: 'Every day this month you get three small tasks that tick themselves as you study. Finish them on any 20 days to hatch the Emberwing, a creature that only exists for this challenge. Each finished day also gives 15 coins.', go: 'challenge', animal: 'emberwing' },
  { id: 'trio', at: Date.UTC(2026, 10, 2, 3, 30), title: 'A hamster, a penguin and a parrot', text: 'Three new friends are in the Sanctuary: the hamster (55 coins), the penguin (110) and a scarlet macaw parrot (170). Each one has three fur coats.', go: 'sanctuary', animal: 'parrot' },
  { id: 'darklight', at: Date.UTC(2026, 10, 1, 16, 50), title: 'Light and dark for every theme', text: 'Enchanted Pond, Midnight, Sakura, Ocean and Forest now each come in a light and a dark version. Open Customize and pick Light, Dark or Match my device.', go: 'customize' },
  { id: 'pondscroll', at: Date.UTC(2026, 10, 1, 16, 40), title: 'A tidier pond', text: 'Students who are focusing now sit in the middle of the pond and nobody overlaps anymore. Swipe or use the arrows to see everyone, and tap Find me to jump to your animal.', go: 'pond' },
  { id: 'wolfback', at: Date.UTC(2026, 10, 1, 16, 15), title: 'The wolf is back', text: 'The original grey wolf is back in the Sanctuary for 240 coins, with four fur coats.', go: 'sanctuary', animal: 'wolf' },
  { id: 'dragon', at: Date.UTC(2026, 10, 1, 10, 20), title: 'The dragon is cheaper', text: 'The dragon now costs 230 coins instead of 300.', go: 'sanctuary', animal: 'dragon' },
  { id: 'herd', at: Date.UTC(2026, 10, 1, 10, 0), title: 'A sheep, a camel and a giraffe', text: 'Three new friends are in the Sanctuary: the sheep (70 coins), the camel (150) and the giraffe (210).', go: 'sanctuary', animal: 'giraffe' },
  { id: 'cairn', at: Date.UTC(2026, 9, 30, 11, 0), title: 'Edit your rocks and build a cairn', text: 'Rename any rock or pebble, change its minutes, course or due date, and finish a rock in one tap. Every rock you cross now gets a celebration and adds a stone to your cairn.', go: 'pebbles' },
  { id: 'spider', at: Date.UTC(2026, 9, 30, 1, 0), title: 'A spider joined the Sanctuary', text: 'A fuzzy jumping spider with eight legs and eight eyes. Adopt it for 90 coins and try its four fur coats.', go: 'sanctuary', animal: 'spider' },
  { id: 'looks', at: Date.UTC(2026, 9, 29, 20, 0), title: 'Costumes, fur coats and emotes', text: 'Dress your animal as a chef, wizard, pirate, hero or royal, give it a real fur coat, and buy emotes for when it studies or naps. While you focus, your animal now reads a book.', go: 'sanctuary', animal: 'wolf' },
  { id: 'colours', at: Date.UTC(2026, 9, 29, 19, 0), title: 'Colour your deadlines', text: 'Pick a colour for any calendar task or rock so the important ones stand out.', go: 'cal' },
  { id: 'dinos', at: Date.UTC(2026, 9, 29, 12, 0), title: 'Dinosaurs and a swan', text: 'A triceratops, a stegosaurus, a longneck, a T. rex and a swan are waiting in the Sanctuary.', go: 'sanctuary', animal: 'trex', bell: false },
  { id: 'quran', at: Date.UTC(2026, 9, 28, 20, 0), title: 'Quran and your own music', text: 'Listen to Quran recitation for free while you focus, or paste your own YouTube, Spotify or SoundCloud link.', go: 'focus', bell: false },
  { id: 'cal', at: Date.UTC(2026, 9, 28, 14, 0), title: 'Calendar and reminders', text: 'Plan deadlines on a monthly calendar, get reminded before they are due, and import your Blackboard calendar.', go: 'cal', bell: false },
  { id: 'board', at: Date.UTC(2026, 9, 28, 10, 0), title: 'Leaderboard', text: 'See who studied the most today, this week and this month on The Pond.', go: 'pond', bell: false }
];
function newsGo(v) { if (v === 'customize') openDrawer(true); else go(v); }
// students who join after an update do not need to hear about it
function newsFloor() {
  if (typeof S.newsFrom !== 'number') { S.newsFrom = S.onboarded ? 0 : Date.now(); save(); }
  return S.newsFrom;
}
function freshNews() {
  const floor = Math.max(newsFloor(), Date.now() - 14 * 864e5);
  return UPDATES.filter(u => u.bell !== false && u.at > floor);
}
function newsPic(u) { return `<span class="av${u.animal ? '' : ' note-ic'}">${u.animal ? avatarSVG(u.animal, 'happy') : icon('i-spark')}</span>`; }
function maybeShowNews() {
  if (!S.onboarded || $('.modal.on')) return;
  const list = freshNews().filter(u => u.at > (S.newsPop || 0));
  if (!list.length) return;
  $('#newsBody').innerHTML = `<ul class="note-list news-list">${list.slice(0, 4).map(u => `<li>${newsPic(u)}<span class="note-t"><b>${esc(u.title)}</b><span class="muted">${esc(u.text)}</span></span><button class="btn small" data-newsgo="${u.go}">Show me</button></li>`).join('')}</ul>`;
  $('#newsModal').classList.add('on');
}
function closeNews() { $('#newsModal').classList.remove('on'); S.newsPop = Date.now(); save(); setTimeout(() => { try { maybeShowChallenge(); } catch (e) {} }, 500); }
function renderGuideNews() {
  const el = $('#gNews'); if (!el) return;
  el.innerHTML = UPDATES.slice(0, 6).map(u => `<li><span class="g-news-d">${new Date(u.at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span><span><b>${esc(u.title)}.</b> ${esc(u.text)}</span></li>`).join('');
}

/* ---------- notification center ---------- */
function collectNotes() {
  const out = [];
  NET.ripples.forEach(r => out.push(r.kind === 'friend'
    ? { at: r.at, kind: 'friend', who: r.name, animal: r.animal, from: r.from, text: 'added you as a friend.' }
    : { at: r.at, kind: 'ripple', who: r.name, animal: r.animal, from: r.from, text: `sent you a ripple: “${r.msg}”` }));
  freshNews().forEach(u => out.push({ at: u.at, kind: 'update', who: '', news: u, text: `New in Grind: ${u.title}. ${u.text}` }));
  (S.remLog || []).forEach(r => out.push({ at: r.at, kind: 'remind', who: '', animal: S.active, text: r.text }));
  const me = NET.uid;
  if (me) (NET.posts || []).filter(p => p.by === me).forEach(p => {
    p.comments.filter(c => c.by !== me).forEach(c => out.push({ at: c.at, kind: 'comment', who: c.name, animal: 'frog', text: `commented on “${p.title}”: “${c.text}”` }));
    const n = p.likes.filter(x => x !== me).length, seen = (S.seenLikes || {})[p.id] || 0;
    if (n > seen) { const who = p.likes.filter(x => x !== me).slice(-(n - seen)).map(id => (p.likeNames || {})[id] || 'A classmate'); out.push({ at: Date.now(), kind: 'like', unread: true, who: '', animal: S.active, text: `${who.length > 2 ? `${who.slice(0, 2).join(', ')} and ${who.length - 2} more` : who.join(' and ')} liked “${p.title}”. ${n} ${n === 1 ? 'like' : 'likes'} in total.` }); }
  });
  out.forEach(n => { if (n.unread === undefined) n.unread = n.at > (S.seenNote || 0); });
  return out.sort((a, b) => b.at - a.at).slice(0, 40);
}
let lastUnread = 0;
function notePing() {
  if (S.settings.noteSound === false) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    [[880, 0], [1318.5, .12]].forEach(([f, d]) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0, now + d); g.gain.linearRampToValueAtTime(.1, now + d + .02); g.gain.exponentialRampToValueAtTime(.0001, now + d + .7);
      o.connect(g).connect(audioCtx.destination); o.start(now + d); o.stop(now + d + .8);
    });
  } catch (e) {}
}
function renderNotes() {
  const btn = $('#noteBtn'); if (!btn) return;
  const list = collectNotes(), unread = list.filter(n => n.unread).length;
  if (unread > lastUnread) {
    notePing();
    const n = list.find(x => x.unread);
    // reminders send their own system alert
    if (n && n.kind !== 'remind' && document.hidden && 'Notification' in window && Notification.permission === 'granted' && S.calAlerts !== false) { try { new Notification('Grind', { body: `${n.who ? n.who + ' ' : ''}${n.text}`, tag: 'grind-note' }); } catch (e) {} }
  }
  lastUnread = unread;
  $('#noteBadge').hidden = !unread; $('#noteBadge').textContent = unread > 9 ? '9+' : unread;
  btn.setAttribute('aria-label', unread ? `Notifications, ${unread} new` : 'Notifications');
  const panel = $('#notePanel'); if (panel.hidden) return;
  let body;
  if (!NET.db && !list.length) body = `<div class="note-empty"><p>Sign in to hear from classmates: ripples, new friends, likes and comments.</p>${NET.web && NET.fbReady ? '<button class="btn small primary" data-signin>Sign in with Google</button>' : ''}</div>`;
  else if (!list.length) body = `<div class="note-empty"><p>Nothing yet. Deadline reminders, ripples, new friends, likes and comments on your posts will show up here.</p></div>`;
  else body = `<ul class="note-list">${list.map(n => {
    const act = n.kind === 'friend' ? (S.friends.includes(n.from) ? '<span class="muted" style="font-size:.78rem">Friends</span>' : `<button class="btn small primary" data-noteadd="${esc(n.from)}">Add back</button>`)
      : n.kind === 'update' ? `<button class="btn small" data-notego="${n.news.go}">Show me</button>`
      : n.kind === 'remind' ? `<button class="btn small" data-notego="cal">Calendar</button>` : n.kind === 'ripple' ? `<button class="btn small" data-notego="pond">Pond</button>` : `<button class="btn small" data-notego="commons">See post</button>`;
    const pic = n.kind === 'update' ? newsPic(n.news) : n.kind === 'remind' ? `<span class="av note-ic">${icon('i-bell')}</span>` : n.kind === 'like' ? `<span class="av note-ic">${icon('i-heart')}</span>` : n.kind === 'comment' ? `<span class="av note-ic">${icon('i-comment')}</span>` : `<span class="av">${avatarSVG(n.animal, 'happy')}</span>`;
    return `<li class="${n.unread ? 'new' : ''}">${pic}<span class="note-t">${n.who ? `<b>${esc(n.who)}</b> ` : ''}${esc(n.text)}<small>${n.kind === 'like' ? 'just now' : ago(n.at)}</small></span>${act}</li>`;
  }).join('')}</ul>`;
  if ('Notification' in window && Notification.permission === 'default') body += `<div class="note-foot"><button class="btn small" data-notealerts>${icon('i-bell')}Also alert me on this device</button></div>`;
  $('#noteBody').innerHTML = body;
}
function markNotesSeen() {
  S.seenNote = Date.now();
  S.seenLikes = S.seenLikes || {};
  (NET.posts || []).filter(p => p.by === NET.uid).forEach(p => { S.seenLikes[p.id] = p.likes.filter(x => x !== NET.uid).length; });
  save();
}
function openNotes(on) {
  const panel = $('#notePanel');
  if (on === undefined) on = panel.hidden;
  if (on) { panel.hidden = false; renderNotes(); $('#noteBtn').setAttribute('aria-expanded', 'true'); }
  else { panel.hidden = true; $('#noteBtn').setAttribute('aria-expanded', 'false'); markNotesSeen(); renderNotes(); }
}
function openCoins(on) {
  const p = $('#coinPanel'); if (on === undefined) on = p.hidden;
  p.hidden = !on; $('#coinBtn').setAttribute('aria-expanded', String(on));
}
function bindNotes() {
  $('#coinBtn').onclick = e => { e.stopPropagation(); if (!$('#notePanel').hidden) openNotes(false); openCoins(); };
  $('#coinPanel').addEventListener('click', e => {
    e.stopPropagation();
    const g = e.target.closest('[data-coingo]'); if (g) { openCoins(false); go(g.dataset.coingo); if (g.dataset.coingo === 'focus') setTimeout(() => $('#sndList')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50); return; }
    if (e.target.closest('[data-coinclose]')) openCoins(false);
  });
  document.addEventListener('click', () => openCoins(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') openCoins(false); });
  $('#noteBtn').onclick = e => { e.stopPropagation(); openCoins(false); openNotes(); };
  $('#notePanel').addEventListener('click', e => {
    e.stopPropagation();
    if (e.target.closest('[data-signin]')) { signIn(); return; }
    if (e.target.closest('[data-notealerts]')) { Notification.requestPermission().then(p => { if (p === 'granted') { S.calAlerts = true; save(); toast('Alerts are on for this device while Grind is open in a tab.'); } renderNotes(); renderCalAlerts(); }).catch(() => {}); return; }
    const a = e.target.closest('[data-noteadd]'); if (a) { if (!S.friends.includes(a.dataset.noteadd)) toggleFriend(a.dataset.noteadd); renderNotes(); return; }
    const g = e.target.closest('[data-notego]'); if (g) { openNotes(false); newsGo(g.dataset.notego); return; }
    if (e.target.closest('[data-noteclose]')) openNotes(false);
  });
  document.addEventListener('click', () => { if (!$('#notePanel').hidden) openNotes(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#notePanel').hidden) openNotes(false); });
  $('#newsModal').addEventListener('click', e => {
    const g = e.target.closest('[data-newsgo]');
    if (g) { closeNews(); newsGo(g.dataset.newsgo); return; }
    if (e.target.id === 'newsModal' || e.target.closest('[data-newsclose]')) closeNews();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#newsModal').classList.contains('on')) closeNews(); });
  renderNotes(); renderGuideNews();
  setTimeout(maybeShowNews, 1800);
}
