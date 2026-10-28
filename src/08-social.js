/* ---------- the pond (community) ---------- */
const EXAMPLES = [];
const RIPPLE_MSGS = ['You have got this', 'Proud of you', 'Keep going', 'Drink some water', 'Studying with you'];
let pondFilter = 'all', popFor = null;
const SLOTS_WIDE = [[50, 74], [22, 58], [78, 60], [35, 88], [65, 89], [11, 80], [89, 82], [32, 45], [68, 45], [50, 52], [14, 42], [86, 43], [50, 36], [24, 72], [76, 74], [42, 66], [58, 66], [8, 60], [92, 62]];
const SLOTS_TALL = [[50, 76], [24, 60], [76, 62], [26, 90], [74, 91], [50, 50], [20, 40], [80, 42], [50, 32], [50, 92], [16, 76], [84, 78]];
function hashStr(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function residents() {
  const me = { id: NET.uid || 'me', me: true, name: myName(), pet: petName(), animal: S.active, uni: S.profile.uni, major: S.profile.major, bio: S.profile.bio, status: myStatus().status, endsAt: myStatus().endsAt, mins: todayMins(), streak: streakNow(), updatedAt: Date.now() };
  let others = NET.pond.filter(r => r.id !== NET.uid).map(r => ({ ...r, mins: r.todayKey === dayKey() ? r.todayMins : 0, status: liveStatus(r) }));
  const showEx = !others.length;
  if (showEx) others = EXAMPLES.map(e => ({ ...e }));
  if (pondFilter === 'friends') others = others.filter(r => S.friends.includes(r.id));
  return { me, others, showEx };
}
function resState(r) { return r.status === 'focus' ? 'awake' : r.status === 'rest' || r.status === 'away' ? 'sleeping' : 'awake'; }
function statusLine(r) {
  if (r.status === 'focus') { const left = r.endsAt ? Math.max(0, Math.round((r.endsAt - Date.now()) / 60000)) : 0; return r.endsAt ? `Focusing now, ${left} min to go` : 'Focusing now'; }
  if (r.status === 'rest') return 'Resting between sessions';
  if (r.status === 'away') return 'Away, napping on the pad';
  return r.mins ? `Studied ${fmtMin(r.mins)} today` : 'Floating around';
}
let lastPondSig = '';
function renderPond(force) {
  const { me, others, showEx } = residents();
  const wide = $('#pondStage').clientWidth > 640 || window.innerWidth > 640;
  const slots = wide ? SLOTS_WIDE : SLOTS_TALL;
  const list = [me, ...others.sort((a, b) => hashStr(a.id) - hashStr(b.id))];
  const placed = list.slice(0, slots.length);
  const sig = JSON.stringify(placed.map(r => [r.id, r.animal, r.name, r.pet, resState(r), r.status])) + wide;
  if (force || sig !== lastPondSig) {
    lastPondSig = sig;
    const over = $('#pondOver');
    over.innerHTML = placed.map((r, i) => `<button class="resident ${r.me ? 'me' : ''}" style="left:${slots[i][0]}%; top:${slots[i][1]}%" data-res="${esc(r.id)}" aria-label="${esc(r.name)} and ${esc(r.pet || ANIMALS[r.animal].label)}. ${esc(statusLine(r))}">
      ${onPadSVG(r.animal, resState(r), { bloom: false, hidden: true })}<span class="plate ${r.status === 'focus' ? 'focus' : ''}">${esc(r.me ? 'You' : r.name)}${r.example ? ' · example' : ''}</span></button>`).join('');
  }
  $('#pondList').innerHTML = list.map(r => `<li><span class="av">${avatarSVG(r.animal, resState(r))}</span><span class="nm"><b>${esc(r.me ? 'You' : r.name)} <span class="muted" style="font-weight:500">with ${esc(r.pet || ANIMALS[r.animal].label)}</span>${r.example ? ' <span class="pill example">Example</span>' : ''}</b><span>${esc(statusLine(r))}${r.streak ? ` · ${r.streak}-day streak` : ''}</span></span>${r.me ? '' : `<button class="btn small" data-ripple="${esc(r.id)}">${icon('i-ripple')}Ripple</button>`}</li>`).join('')
    + (others.length ? '' : pondFilter === 'friends' ? `<li class="muted" style="background:none">No friends yet. Tap someone in the pond and add them.</li>` : `<li class="muted" style="background:none">No one else is here yet. Share the link from How to use Grind and classmates will appear as they sign in.</li>`);
  if (popFor) openPop(popFor, true);
}
function findRes(id) { const { me, others } = residents(); return [me, ...others].find(r => r.id === id) || EXAMPLES.find(e => e.id === id); }
function openPop(id, refresh) {
  const r = findRes(id); const over = $('#pondOver');
  let pop = $('#pondPop');
  if (!r) { pop && pop.remove(); popFor = null; return; }
  const btn = over.querySelector(`[data-res="${CSS.escape(id)}"]`);
  if (!pop) { pop = document.createElement('div'); pop.className = 'pop'; pop.id = 'pondPop'; over.appendChild(pop); }
  popFor = id;
  const isFriend = S.friends.includes(r.id);
  pop.innerHTML = `<div class="ph"><span class="av">${avatarSVG(r.animal, r.me ? 'happy' : resState(r))}</span><div style="min-width:0; flex:1"><b style="font-family:var(--f-display); font-weight:400; font-size:1.15rem">${esc(r.me ? 'You' : r.name)}</b><div class="muted" style="font-size:.82rem">${esc(r.pet || '')} the ${ANIMALS[r.animal].label.toLowerCase()}${r.uni || r.major ? ' · ' + esc([r.uni, r.major].filter(Boolean).join(', ')) : ''}</div></div><button class="icon-btn" data-popclose aria-label="Close">${icon('i-x')}</button></div>
    ${r.bio ? `<p class="hand" style="font-size:1.3rem">${esc(r.bio)}</p>` : ''}
    <p style="font-size:.88rem">${esc(statusLine(r))}${r.streak ? ` · ${r.streak}-day streak` : ''}</p>
    ${r.me ? `<p class="muted" style="font-size:.84rem">This is you. Friends can send you ripples while you study.</p>` : `<span class="eyebrow">Send a ripple</span><div class="msgs">${RIPPLE_MSGS.map(m => `<button class="btn small" data-send="${esc(m)}">${esc(m)}</button>`).join('')}</div>
    ${r.example ? '<span class="muted" style="font-size:.8rem">Example neighbour. Ripples to examples stay on your screen.</span>' : `<button class="btn small ${isFriend ? '' : 'primary'}" data-friend style="align-self:flex-start">${icon(isFriend ? 'i-check' : 'i-friend')}${isFriend ? 'Friends' : 'Add friend'}</button>`}`}`;
  if (btn) {
    const ob = over.getBoundingClientRect(), bb = btn.getBoundingClientRect();
    const pw = Math.min(300, ob.width - 20);
    let x = bb.left - ob.left + bb.width / 2 - pw / 2; x = Math.max(10, Math.min(ob.width - pw - 10, x));
    let y = bb.top - ob.top - 10; const ph = pop.offsetHeight || 220;
    y = y - ph < 10 ? Math.min(ob.height - ph - 10, bb.bottom - ob.top + 6) : y - ph;
    pop.style.left = x + 'px'; pop.style.top = Math.max(10, y) + 'px'; pop.style.width = pw + 'px';
  }
}
function rippleAt(id) {
  const over = $('#pondOver'); if (!over) return;
  const btn = id ? over.querySelector(`[data-res="${CSS.escape(id)}"]`) : over.querySelector('.resident.me');
  if (!btn) return;
  const ob = over.getBoundingClientRect(), bb = btn.getBoundingClientRect();
  for (let i = 0; i < 3; i++) {
    const r = document.createElement('span'); r.className = 'ripple-ring';
    r.style.left = (bb.left - ob.left + bb.width / 2) + 'px'; r.style.top = (bb.top - ob.top + bb.height * .78) + 'px'; r.style.animationDelay = (i * .35) + 's';
    over.appendChild(r); setTimeout(() => r.remove(), 2600);
  }
}
function sendRipple(id, msg) {
  const r = findRes(id); if (!r || r.me) return;
  rippleAt(id);
  if (!r.example) sendRippleNet(id, msg);
  toast(`Ripple sent to <b>${esc(r.name)}</b>${r.example ? ' (example)' : ''}: “${esc(msg)}”`, `<span style="width:30px;height:30px;flex:none">${avatarSVG(r.animal, 'happy')}</span>`);
}
function renderRipples() {
  const items = NET.ripples.filter(r => r.kind !== 'friend');
  const html = items.length ? items.slice(0, 12).map(r => `<li><span class="av">${avatarSVG(r.animal, 'happy')}</span><span style="min-width:0"><q>${esc(r.msg)}</q><small>from ${esc(r.name)} · ${ago(r.at)}</small></span></li>`).join('')
    : `<li class="muted">${NET.db ? 'No ripples yet. When a friend taps your animal, their encouragement lands here.' : 'Ripples from friends land here once the shared pond is connected.'}</li>`;
  $('#rippleFeed').innerHTML = html;
  $('#rippleMini').innerHTML = items.length ? items.slice(0, 3).map(r => `<li><span class="av">${avatarSVG(r.animal, 'happy')}</span><span style="min-width:0"><q>${esc(r.msg)}</q><small>from ${esc(r.name)} · ${ago(r.at)}</small></span></li>`).join('')
    : `<li class="muted">No ripples yet. Send one to someone in the pond, it makes their day.</li>`;
}
function likedBy(p, me) {
  const names = p.likes.map(id => id === me ? 'you' : ((p.likeNames || {})[id] || (NET.pond.find(r => r.id === id) || {}).name || 'a classmate'));
  names.sort((a, b) => (b === 'you') - (a === 'you'));
  const shown = names.slice(0, 3).map(n => n === 'you' ? 'you' : `<b>${esc(n)}</b>`);
  const more = names.length - shown.length;
  const list = more > 0 ? `${shown.join(', ')} and ${more} ${more === 1 ? 'other' : 'others'}` : shown.length > 1 ? `${shown.slice(0, -1).join(', ')} and ${shown[shown.length - 1]}` : shown[0];
  return `Liked by ${list}`;
}
function toggleFriend(id) {
  const adding = !S.friends.includes(id);
  S.friends = adding ? [...S.friends, id] : S.friends.filter(x => x !== id);
  save(); renderFriends(); renderNotes();
  if (adding && NET.db && id !== NET.uid) sendRippleNet(id, '', 'friend');
}
function bindPond() {
  $('#pondOver').addEventListener('click', e => {
    const res = e.target.closest('[data-res]'); if (res) { openPop(res.dataset.res); return; }
    if (e.target.closest('[data-popclose]')) { $('#pondPop')?.remove(); popFor = null; return; }
    const s = e.target.closest('[data-send]'); if (s) { sendRipple(popFor, s.dataset.send); return; }
    if (e.target.closest('[data-friend]')) { toggleFriend(popFor); openPop(popFor, true); return; }
  });
  $('#pondList').addEventListener('click', e => { const b = e.target.closest('[data-ripple]'); if (b) sendRipple(b.dataset.ripple, pick(RIPPLE_MSGS)); });
  $('#pondAll').onclick = () => { pondFilter = 'all'; $('#pondAll').setAttribute('aria-pressed', true); $('#pondFriends').setAttribute('aria-pressed', false); renderPond(true); };
  $('#pondFriends').onclick = () => { pondFilter = 'friends'; $('#pondAll').setAttribute('aria-pressed', false); $('#pondFriends').setAttribute('aria-pressed', true); renderPond(true); };
}

/* ---------- grind together ---------- */
let activeCircle = null;
function lotusSVG(members) {
  const n = members.length, studied = members.filter(m => m.studied).length, full = n > 0 && studied === n;
  const P = Math.min(14, Math.max(6, n * 2));
  const petal = 'M0 0 C-24 -30 -19 -74 0 -96 C19 -74 24 -30 0 0 Z';
  let petals = '';
  for (let j = 0; j < P; j++) {
    const m = members[Math.floor(j * n / P)] || {};
    const ang = -78 + 156 * j / (P - 1);
    const open = !!m.studied;
    petals += `<path d="${petal}" transform="translate(150 182) rotate(${open ? ang : ang * .28}) scale(${open ? 1 : .78})" fill="${open ? 'var(--bloom)' : 'var(--pad)'}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round" style="transition:transform .8s cubic-bezier(.3,1.4,.5,1)"/>`;
  }
  return `<svg viewBox="0 0 300 260" role="img" aria-label="Lotus: ${studied} of ${n} studied today${full ? ', in full bloom' : ''}">
    ${full ? '<circle cx="150" cy="130" r="110" fill="url(#gr-glow)" opacity=".9"/>' : ''}
    <ellipse cx="150" cy="204" rx="138" ry="34" fill="var(--water)"/>${padShape(150, 196, 118, false)}
    ${petals}
    <path d="M0 0 C-14 -18 -12 -48 0 -62 C12 -48 14 -18 0 0 Z" transform="translate(150 182)" fill="${full ? 'var(--bloom)' : 'var(--pad-2)'}" stroke="${INK}" stroke-width="2.4"/>
    <circle cx="150" cy="150" r="${full ? 12 : 7}" fill="var(--glow)" stroke="${INK}" stroke-width="2"/>
    ${full ? sparkle(70, 70, 9) + sparkle(232, 84, 8) + sparkle(150, 34, 10) : ''}
  </svg>`;
}
function renderCircle() {
  const tabs = $('#circleTabs'), view = $('#circleView');
  const codes = S.circles;
  if (codes.length && (!activeCircle || !codes.includes(activeCircle))) activeCircle = codes[0];
  tabs.innerHTML = codes.map(c => { const d = NET.circleDocs[c]; return `<button class="btn small ${c === activeCircle ? 'primary' : ''}" data-circle="${esc(c)}">${esc(d ? d.name : c)}</button>`; }).join('');
  let doc, code = activeCircle;
  if (code) doc = NET.circleDocs[code];
  const isEx = false;
  if (!code) { view.innerHTML = `<div class="card empty"><span class="hand">No circle yet</span><span>Start one below and share its code, or join a friend's circle with their code.</span></div>`; return; }
  if (doc === undefined) { view.innerHTML = `<div class="card empty"><span class="hand">Finding your circle...</span></div>`; return; }
  if (doc === null) { view.innerHTML = `<div class="card empty"><span>The circle ${esc(code)} was not found.</span><button class="btn small" data-leave="${esc(code)}">Remove it</button></div>`; return; }
  const k = dayKey();
  const ms = Object.entries(doc.members).map(([id, m]) => {
    const mine = id === NET.uid || id === 'me';
    const mm = mine ? meAsMember() : m;
    return { id, mine, ...mm, studied: mm.day === k && mm.mins > 0 };
  });
  const st = ms.filter(m => m.studied).length, full = st === ms.length && ms.length > 0;
  view.innerHTML = `<div class="card"><div class="card-h"><div><h2>${esc(doc.name)}</h2>${isEx ? '<span class="pill example" style="margin-top:6px">Example circle</span>' : `<span class="muted" style="font-size:.84rem">Share this code: <span class="code">${esc(code)}</span> <button class="btn small quiet" data-copy="${esc(code)}">Copy</button></span>`}</div>
    <span class="hand" style="color:var(--rose); font-size:1.6rem">${full ? 'Full bloom today' : `${st} of ${ms.length} studied today`}</span></div>
    <div class="lotus-wrap">${lotusSVG(ms)}<div class="stack" style="gap:12px">
      <ul class="member-list">${ms.map(m => `<li><span class="av">${avatarSVG(m.animal, m.studied ? 'happy' : 'sleeping')}</span><span class="nm"><b>${esc(m.mine ? 'You' : m.name)}</b><span>${m.studied ? `Studied ${fmtMin(m.mins)} today` : 'Not yet today, no pressure'}</span></span>${m.studied ? `<span class="pill" style="background:var(--bloom); color:${INK}">Petals open</span>` : ''}</li>`).join('')}</ul>
      <p class="muted" style="font-size:.86rem">${full ? 'Everyone showed up today. The lotus is open for the whole circle.' : 'Each person opens their petals by finishing a focus session or a pebble today.'}</p>
      ${isEx ? '' : `<span data-leavewrap><button class="btn small quiet" data-leaveask>Leave circle</button></span>`}
    </div></div></div>`;
}
function bindTogether() {
  const code6 = () => { const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s = ''; for (let i = 0; i < 6; i++) s += A[Math.floor(Math.random() * A.length)]; return s; };
  $('#createCircle').onsubmit = async e => {
    e.preventDefault();
    if (!NET.db || !NET.canWrite) { toast(NET.web ? 'Sign in with Google to create a circle.' : 'Circles need the shared pond. Open Grind from an invite to create one.'); if (NET.web) signIn(); return; }
    const name = clampStr($('#circleName').value.trim(), 40) || 'Study circle'; const code = code6();
    await writeQ('circles/' + code, () => NET.db.doc('circles/' + code).set({ name, createdBy: NET.uid, createdAt: Date.now(), members: { [NET.uid]: meAsMember() } }));
    S.circles = [...S.circles, code]; activeCircle = code; save(); subscribeCircles(); renderCircle();
    $('#circleName').value = ''; toast(`Circle created. Share the code ${code} with your friends.`);
  };
  $('#joinCircle').onsubmit = async e => {
    e.preventDefault();
    const code = $('#circleCode').value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!NET.db || !NET.canWrite) { toast(NET.web ? 'Sign in with Google to join a circle.' : 'Joining a circle needs the shared pond.'); if (NET.web) signIn(); return; }
    if (code.length !== 6) { toast('Circle codes have six letters and numbers.'); return; }
    const s = await NET.db.doc('circles/' + code).get().catch(() => null);
    if (!s || !s.exists) { toast(`No circle with the code ${code}. Check it with your friend.`); return; }
    if (!S.circles.includes(code)) S.circles = [...S.circles, code];
    activeCircle = code; save(); subscribeCircles(); updateCircles(); renderCircle();
    $('#circleCode').value = ''; toast('You joined the circle.');
  };
  $('#circleTabs').onclick = e => { const b = e.target.closest('[data-circle]'); if (b) { activeCircle = b.dataset.circle; renderCircle(); } };
  $('#circleView').addEventListener('click', e => {
    const c = e.target.closest('[data-copy]');
    if (c) { navigator.clipboard?.writeText(c.dataset.copy).then(() => toast('Code copied.'), () => { const r = document.createRange(); r.selectNodeContents($('.code')); getSelection().removeAllRanges(); getSelection().addRange(r); toast('Code selected. Copy it to share.'); }); return; }
    if (e.target.closest('[data-leaveask]')) { e.target.closest('[data-leavewrap]').innerHTML = `<span class="confirm">Leave this circle? <button class="btn small rose" data-leave="${esc(activeCircle)}">Leave</button><button class="btn small" data-stay>Stay</button></span>`; return; }
    if (e.target.closest('[data-stay]')) { renderCircle(); return; }
    const l = e.target.closest('[data-leave]');
    if (l) {
      const code = l.dataset.leave;
      if (NET.db && NET.canWrite) writeQ('circles/' + code, async () => { const ref = NET.db.doc('circles/' + code); const s = await ref.get(); if (!s.exists) return; const d = s.data() || {}; if (d.members) delete d.members[NET.uid]; await ref.set(d); });
      S.circles = S.circles.filter(x => x !== code); activeCircle = null; save(); subscribeCircles(); renderCircle();
    }
  });
}

/* ---------- commons ---------- */
let postKind = 'note', feedFilter = 'all';
const openComments = new Set();
const KIND_LABEL = { note: 'Notes', done: 'Finished work', win: 'Achievement' };
function postsNow() { return sharedPosts() ? NET.posts : S.localPosts; }
function renderComposerNote() { $('#composerNote').textContent = sharedPosts() ? 'Everyone in the pond can see this.' : 'Saved on this device until the shared pond is connected.'; }
function renderFeed() {
  const me = NET.uid || 'me';
  const ps = postsNow().filter(p => feedFilter === 'all' || p.kind === feedFilter).slice().sort((a, b) => b.at - a.at);
  $('#feed').innerHTML = ps.length ? ps.map(p => {
    const liked = p.likes.includes(me);
    return `<article class="post" data-post="${esc(p.id)}"><div class="post-h"><span class="av">${avatarSVG(p.animal, 'awake')}</span><div class="who"><b>${esc(p.by === me ? 'You' : p.name)}</b><span>${KIND_LABEL[p.kind]}${p.course ? ' · ' + esc(p.course) : ''} · ${ago(p.at)}</span></div>${p.by === me ? `<span data-delpwrap><button class="icon-btn" data-delpost aria-label="Delete post">${icon('i-trash')}</button></span>` : ''}</div>
      ${p.kind === 'win' ? `<div class="achv">${icon('i-spark')}<b>${esc(p.title)}</b></div>` : `<h3>${esc(p.title)}</h3>`}
      ${p.body ? `<p class="body">${esc(p.body)}</p>` : ''}
      ${p.link ? `<a class="attach" href="${esc(p.link)}" target="_blank" rel="noopener noreferrer">${icon('i-file')}<span>${esc(p.link.replace(/^https:\/\//, '').slice(0, 70))}</span></a>` : ''}
      ${p.likes.length ? `<p class="liked-by">${icon('i-heart')}<span>${likedBy(p, me)}</span></p>` : ''}
      <div class="post-a"><button class="btn small ${liked ? 'liked' : ''}" data-like aria-pressed="${liked}">${icon('i-heart')}<span class="num">${p.likes.length || ''}</span> ${liked ? 'Liked' : 'Like'}</button><button class="btn small" data-cm>${icon('i-comment')}${p.comments.length || ''} Comment</button></div>
      ${openComments.has(p.id) ? `<div class="comments">${p.comments.map(c => `<p class="cm"><b>${esc(c.by === me ? 'You' : c.name)}</b> ${esc(c.text)} <span class="muted" style="font-size:.75rem">${ago(c.at)}</span></p>`).join('')}
        <form class="add-peb" data-cform><input class="inp" name="t" maxlength="500" placeholder="Say something kind" aria-label="Comment"><button class="btn small" type="submit">Send</button></form></div>` : ''}
    </article>`;
  }).join('') : `<div class="card flat empty"><span class="hand">Nothing shared yet.</span><span>Post your notes, a finished assignment, or a small win. Others see what you did, not what you missed.</span></div>`;
}
function milestones() {
  const out = [];
  const st = streakNow(), total = S.sessions.reduce((a, s) => a + s.mins, 0), tm = todayMins();
  if (st >= 2) out.push(`${st}-day study streak with ${petName()}`);
  if (tm >= 25) out.push(`Focused for ${fmtMin(tm)} today`);
  if (S.lastCrossed && Date.now() - S.lastCrossed.at < 7 * 864e5) out.push(`Finished every pebble of “${S.lastCrossed.title}”`);
  if (total >= 60) out.push(`${fmtMin(total)} of focus this semester`);
  const peb = S.pebLog.filter(p => Date.now() - p.at < 7 * 864e5).length;
  if (peb >= 3) out.push(`Laid ${peb} stepping stones this week`);
  return out;
}
function renderMilestones() {
  const ms = milestones();
  $('#milestones').innerHTML = ms.length ? ms.map(m => `<div class="achv">${icon('i-spark')}<div style="flex:1; min-width:0"><b>${esc(m)}</b></div><button class="btn small" data-share="${esc(m)}">Share</button></div>`).join('')
    : `<p class="muted" style="font-size:.88rem">Finish a session or a few pebbles and your wins will show up here, ready to share.</p>`;
}
function bindCommons() {
  $('#composer').addEventListener('click', e => { const b = e.target.closest('[data-kind]'); if (!b) return; postKind = b.dataset.kind; $$('#composer [data-kind]').forEach(x => x.setAttribute('aria-pressed', x === b)); });
  $('#composer').onsubmit = e => {
    e.preventDefault();
    const title = $('#postTitle').value.trim(); if (!title) return;
    const link = $('#postLink').value.trim();
    const p = { by: NET.uid || 'me', name: myName(), animal: S.active, kind: postKind, course: $('#postCourse').value ? courseName($('#postCourse').value) : '', title: clampStr(title, 100), body: clampStr($('#postBody').value.trim(), 2000), link: /^https:\/\//i.test(link) ? link : '', at: Date.now(), likes: [], comments: [] };
    if (sharedPosts()) { const id = uid(); writeQ('posts/' + id, () => NET.db.doc('posts/' + id).set(p)); }
    else { S.localPosts.unshift({ id: uid(), ...p }); save(); renderFeed(); }
    $('#composer').reset(); toast('Shared to the Commons.');
  };
  $('#milestones').onclick = e => { const b = e.target.closest('[data-share]'); if (!b) return; postKind = 'win'; $$('#composer [data-kind]').forEach(x => x.setAttribute('aria-pressed', x.dataset.kind === 'win')); $('#postTitle').value = b.dataset.share; $('#postBody').focus(); };
  $('#feedFilter').onclick = e => { const b = e.target.closest('[data-f]'); if (!b) return; feedFilter = b.dataset.f; $$('#feedFilter button').forEach(x => x.setAttribute('aria-pressed', x === b)); renderFeed(); };
  $('#feed').addEventListener('click', e => {
    const art = e.target.closest('[data-post]'); if (!art) return; const id = art.dataset.post; const me = NET.uid || 'me';
    if (e.target.closest('[data-like]')) { postMutate(id, p => { p.likeNames = p.likeNames || {}; if (p.likes.includes(me)) { p.likes = p.likes.filter(x => x !== me); delete p.likeNames[me]; } else { p.likes = [...p.likes, me]; p.likeNames[me] = myName(); } }); return; }
    if (e.target.closest('[data-cm]')) { openComments.has(id) ? openComments.delete(id) : openComments.add(id); renderFeed(); return; }
    if (e.target.closest('[data-delpost]')) { art.querySelector('[data-delpwrap]').innerHTML = `<span class="confirm"><button class="btn small rose" data-delpyes>Delete</button><button class="btn small" data-delpno>Keep</button></span>`; return; }
    if (e.target.closest('[data-delpno]')) { renderFeed(); return; }
    if (e.target.closest('[data-delpyes]')) { if (sharedPosts()) writeQ('posts/' + id, () => NET.db.doc('posts/' + id).delete()); else { S.localPosts = S.localPosts.filter(p => p.id !== id); save(); renderFeed(); } }
  });
  $('#feed').addEventListener('submit', e => {
    const f = e.target.closest('[data-cform]'); if (!f) return; e.preventDefault();
    const t = f.t.value.trim(); if (!t) return; const id = f.closest('[data-post]').dataset.post;
    postMutate(id, p => { p.comments.push({ by: NET.uid || 'me', name: myName(), text: clampStr(t, 500), at: Date.now() }); });
    f.t.value = '';
  });
}
