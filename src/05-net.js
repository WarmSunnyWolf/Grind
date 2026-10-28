/* ---------- shared pond (runtime capabilities) ---------- */
const NET = { db: null, uid: null, canWrite: false, ready: false, pond: [], ripples: [], posts: null, circleDocs: {}, circleUnsub: {}, sampleP: Promise.resolve(null), downloadsP: Promise.resolve(null) };
const wq = {};
function signIn() {}
function signOut() {}
function writeQ(path, fn) {
  wq[path] = (wq[path] || Promise.resolve()).then(fn).catch(e => {
    if (e && e.code === 'invalid_argument') { NET.canWrite = false; renderSync(); renderNotices(); }
    else if (e && e.code === 'quota_exceeded') toast('The shared pond is full right now. Ask the owner to clear old posts.');
  });
  return wq[path];
}
const ANIMAL_OK = k => ANIMAL_KEYS.includes(k) ? k : 'frog';
function cleanResident(id, d) {
  return {
    id, name: clampStr(d.name, 40) || 'Someone', pet: clampStr(d.pet, 30), animal: ANIMAL_OK(d.animal), uni: clampStr(d.uni, 60), major: clampStr(d.major, 60), bio: clampStr(d.bio, 140),
    status: ['focus', 'rest', 'idle'].includes(d.status) ? d.status : 'idle', endsAt: +d.endsAt || 0, todayKey: clampStr(d.todayKey, 10), todayMins: Math.max(0, +d.todayMins || 0),
    streak: Math.max(0, Math.min(9999, +d.streak || 0)), updatedAt: +d.updatedAt || 0,
    public: d.public === true, stats: d.public === true && d.stats && typeof d.stats === 'object' ? {
      totalMins: Math.max(0, +d.stats.totalMins || 0), weekMins: Math.max(0, +d.stats.weekMins || 0), sessions: Math.max(0, +d.stats.sessions || 0),
      bestStreak: Math.max(0, +d.stats.bestStreak || 0), coinsEarned: Math.max(0, +d.stats.coinsEarned || 0), pebbles: Math.max(0, +d.stats.pebbles || 0),
      animals: Array.isArray(d.stats.animals) ? [...new Set(d.stats.animals.filter(k => ANIMAL_KEYS.includes(k)))] : []
    } : null
  };
}
function liveStatus(r) {
  if ((r.status === 'focus' || r.status === 'rest') && r.endsAt > Date.now() - 30000) return r.status;
  return Date.now() - r.updatedAt > 30 * 60000 ? 'away' : 'idle';
}

async function initNet() {
  const c = window.claude;
  if (!c || typeof c.use !== 'function') { NET.ready = true; renderSync(); renderNotices(); return; }
  NET.sampleP = c.use('sample').catch(() => null);
  NET.downloadsP = c.use('downloads').catch(() => null);
  let db = null, user = null;
  try { [db, user] = await Promise.all([c.use('db'), c.use('user')]); } catch (e) {}
  NET.ready = true;
  if (!db || !user) { renderSync(); renderNotices(); return; }
  let id = null;
  try { id = await user.id(); } catch (e) {}
  if (!id) { renderSync(); renderNotices(); return; }
  NET.db = db; NET.uid = id;
  let cw = null;
  try { cw = await user.can('data.write'); } catch (e) {}
  NET.canWrite = cw !== false;
  // bring back this person's own saved progress from other devices
  try {
    const snap = await db.doc(`data/users/${id}/state`).get();
    if (snap.exists) {
      const d = snap.data();
      if (d && d.json && (+d.updatedAt || 0) > (S.updatedAt || 0)) {
        S = mergeState(JSON.parse(d.json));
        try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
        applyTheme(); renderAll();
      }
    }
  } catch (e) {}
  db.collection('pond').orderBy('updatedAt', 'desc').limit(80).onSnapshot(s => {
    NET.pond = s.docs.filter(d => d.exists).map(d => cleanResident(d.id, d.data() || {}));
    renderPond(); renderFriends(); renderCircle();
  }, () => {});
  db.doc('ripples/' + id).onSnapshot(s => {
    const items = s.exists ? ((s.data() || {}).items || []) : [];
    const prev = NET.ripples.length ? NET.ripples[0].at : S.seenRipple;
    NET.ripples = items.filter(r => r && typeof r === 'object').map(r => ({ from: clampStr(r.from, 80), name: clampStr(r.name, 40) || 'Someone', animal: ANIMAL_OK(r.animal), msg: clampStr(r.msg, 60), at: +r.at || 0, kind: r.kind === 'friend' ? 'friend' : 'ripple' }));
    const fresh = NET.ripples.filter(r => r.at > Math.max(prev || 0, S.seenRipple || 0));
    if (fresh.length) {
      const r = fresh[0];
      if (r.kind === 'friend') toast(`<b>${esc(r.name)}</b> added you as a friend.`, `<span style="width:34px;height:34px;flex:none">${avatarSVG(r.animal, 'happy')}</span>`);
      else {
        toast(`<b>${esc(r.name)}</b> sent you a ripple: “${esc(r.msg)}”`, `<span style="width:34px;height:34px;flex:none">${avatarSVG(r.animal, 'happy')}</span>`);
        rippleAt(null);
        if (currentView !== 'pond') $('#pondDot').hidden = false;
      }
      if (currentView === 'pond') { S.seenRipple = r.at; save(); }
    }
    renderRipples(); renderNotes();
  }, () => {});
  db.collection('posts').orderBy('at', 'desc').limit(80).onSnapshot(s => {
    NET.posts = s.docs.filter(d => d.exists).map(d => cleanPost(d.id, d.data() || {}));
    renderFeed(); renderNotes();
  }, () => {});
  subscribeCircles();
  publishPond();
  if (NET.canWrite) remoteSave();
  renderSync(); renderNotices(); renderComposerNote();
}

function remoteSave() {
  if (!NET.db || !NET.uid || !NET.canWrite) return;
  const json = JSON.stringify(S);
  if (json.length > 240000) { S.sessions = S.sessions.slice(-1500); }
  const body = { json: JSON.stringify(S), updatedAt: S.updatedAt };
  writeQ(`data/users/${NET.uid}/state`, () => NET.db.doc(`data/users/${NET.uid}/state`).set(body));
}
function myStatus() {
  const t = S.timer;
  if (t && t.endsAt && !t.pausedLeft) return { status: t.phase, endsAt: t.endsAt };
  return { status: 'idle', endsAt: 0 };
}
function publishPond() {
  if (!NET.db || !NET.uid || !NET.canWrite) return;
  const st = myStatus();
  const doc = { name: myName(), pet: petName(), animal: S.active, uni: S.profile.uni, major: S.profile.major, bio: S.profile.bio, status: st.status, endsAt: st.endsAt, todayKey: dayKey(), todayMins: todayMins(), streak: streakNow(), updatedAt: Date.now(), public: S.profile.public !== false };
  if (doc.public) doc.stats = publicStats();
  writeQ('pond/' + NET.uid, () => NET.db.doc('pond/' + NET.uid).set(doc));
}
function sendRippleNet(toId, msg, kind = 'ripple') {
  if (!NET.db || !NET.canWrite) return;
  const ref = NET.db.doc('ripples/' + toId);
  writeQ('ripples/' + toId, async () => {
    const s = await ref.get();
    const items = s.exists ? ((s.data() || {}).items || []) : [];
    items.unshift({ from: NET.uid, name: myName(), animal: S.active, msg, at: Date.now(), kind });
    await ref.set({ items: items.slice(0, 30) });
  });
}

/* posts */
function cleanPost(id, d) {
  return {
    id, by: clampStr(d.by, 80), name: clampStr(d.name, 40) || 'Someone', animal: ANIMAL_OK(d.animal), kind: ['note', 'done', 'win'].includes(d.kind) ? d.kind : 'note',
    course: clampStr(d.course, 60), title: clampStr(d.title, 100), body: clampStr(d.body, 2000), link: /^https:\/\//i.test(d.link || '') ? clampStr(d.link, 300) : '',
    at: +d.at || 0, likes: Array.isArray(d.likes) ? d.likes.slice(0, 500).map(x => clampStr(x, 80)) : [],
    likeAnimals: Object.fromEntries(Object.entries(d.likeAnimals && typeof d.likeAnimals === 'object' ? d.likeAnimals : {}).slice(0, 500).map(([k, v]) => [clampStr(k, 80), ANIMAL_OK(v)])),
    likeNames: Object.fromEntries(Object.entries(d.likeNames && typeof d.likeNames === 'object' ? d.likeNames : {}).slice(0, 500).map(([k, v]) => [clampStr(k, 80), clampStr(v, 40)])),
    comments: Array.isArray(d.comments) ? d.comments.slice(-100).map(c => ({ by: clampStr(c.by, 80), name: clampStr(c.name, 40) || 'Someone', text: clampStr(c.text, 500), at: +c.at || 0 })) : []
  };
}
const sharedPosts = () => NET.db && NET.canWrite && NET.posts !== null;
function postMutate(id, fn) {
  if (sharedPosts()) {
    const ref = NET.db.doc('posts/' + id);
    return writeQ('posts/' + id, async () => {
      const s = await ref.get(); if (!s.exists) return;
      const p = cleanPost(id, s.data() || {}); fn(p);
      const { id: _, ...body } = p; await ref.set(body);
    });
  }
  const p = S.localPosts.find(p => p.id === id); if (p) { fn(p); save(); renderFeed(); }
}

/* circles */
function subscribeCircles() {
  if (!NET.db) return;
  Object.entries(NET.circleUnsub).forEach(([code, un]) => { if (!S.circles.includes(code)) { un(); delete NET.circleUnsub[code]; delete NET.circleDocs[code]; } });
  S.circles.forEach(code => {
    if (NET.circleUnsub[code]) return;
    NET.circleUnsub[code] = NET.db.doc('circles/' + code).onSnapshot(s => {
      NET.circleDocs[code] = s.exists ? cleanCircle(s.data() || {}) : null;
      renderCircle();
    }, () => {});
  });
}
function cleanCircle(d) {
  const members = {};
  Object.entries(d.members || {}).slice(0, 12).forEach(([k, m]) => { members[clampStr(k, 80)] = { name: clampStr(m.name, 40) || 'Someone', animal: ANIMAL_OK(m.animal), pet: clampStr(m.pet, 30), day: clampStr(m.day, 10), mins: Math.max(0, +m.mins || 0) }; });
  return { name: clampStr(d.name, 40) || 'Study circle', createdBy: clampStr(d.createdBy, 80), members };
}
function meAsMember() { return { name: myName(), animal: S.active, pet: petName(), day: dayKey(), mins: todayMins() }; }
function updateCircles() {
  if (!NET.db || !NET.canWrite) return;
  S.circles.forEach(code => {
    const ref = NET.db.doc('circles/' + code);
    writeQ('circles/' + code, async () => {
      const s = await ref.get(); if (!s.exists) return;
      const d = s.data() || {}; d.members = d.members || {}; d.members[NET.uid] = meAsMember();
      await ref.set(d);
    });
  });
}
function afterProgress() { publishPond(); updateCircles(); }
