/* ---------- shared pond (runtime capabilities) ---------- */
const NET = { db: null, uid: null, canWrite: false, ready: false, pond: [], ripples: [], posts: null, circleDocs: {}, circleUnsub: {}, sampleP: Promise.resolve(null), downloadsP: Promise.resolve(null) };
const wq = {};
function writeQ(path, fn) {
  wq[path] = (wq[path] || Promise.resolve()).then(fn).catch(e => {
    if (e && (e.code === 'invalid_argument' || e.code === 'permission-denied')) { toast('That change was not allowed by the pond. Try signing in again.'); }
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
    vis: ['me', 'friends', 'everyone'].includes(d.vis) ? d.vis : d.public === true ? 'everyone' : 'me'
  };
}
function liveStatus(r) {
  if ((r.status === 'focus' || r.status === 'rest') && r.endsAt > Date.now() - 30000) return r.status;
  return Date.now() - r.updatedAt > 30 * 60000 ? 'away' : 'idle';
}

/* ---------- shared pond on Firebase (public website build) ---------- */
const FB_VERSION = '10.12.2';
let FB = null;
function fsAdapter(m, fs) {
  const snapDoc = s => ({ id: s.id, exists: s.exists(), data: () => s.data(), metadata: s.metadata });
  const qSnap = s => ({ docs: s.docs.map(snapDoc), size: s.size, empty: s.empty });
  const docRef = path => {
    const r = m.doc(fs, path);
    return {
      id: r.id, path,
      get: async () => snapDoc(await m.getDoc(r)),
      set: d => m.setDoc(r, d),
      delete: () => m.deleteDoc(r),
      onSnapshot: (next, err) => m.onSnapshot(r, s => next(snapDoc(s)), e => err && err(e)),
      collection: p => colRef(path + '/' + p)
    };
  };
  const query = (path, cons) => ({
    where: (f, op, v) => query(path, [...cons, m.where(f, op, v)]),
    orderBy: (f, d = 'asc') => query(path, [...cons, m.orderBy(f, d)]),
    limit: n => query(path, [...cons, m.limit(n)]),
    get: async () => qSnap(await m.getDocs(m.query(m.collection(fs, path), ...cons))),
    onSnapshot: (next, err) => m.onSnapshot(m.query(m.collection(fs, path), ...cons), s => next(qSnap(s)), e => err && err(e))
  });
  const colRef = path => ({ ...query(path, []), path, doc: id => docRef(path + '/' + (id || m.doc(m.collection(fs, path)).id)) });
  return { doc: docRef, collection: colRef };
}
function signIn() {
  if (!FB) { toast('Sign-in is still loading. Try again in a moment.'); return; }
  FB.authM.signInWithPopup(FB.auth, new FB.authM.GoogleAuthProvider()).catch(e => {
    if (e && e.code === 'auth/popup-closed-by-user') return;
    const code = (e && e.code) || '';
    const why = {
      'auth/unauthorized-domain': 'This web address is not on the Authorized domains list in Firebase yet.',
      'auth/operation-not-allowed': 'Google sign-in is not switched on in Firebase yet.',
      'auth/popup-blocked': 'The browser blocked the sign-in window. Allow pop-ups for this site and try again.',
      'auth/cancelled-popup-request': 'Another sign-in window is already open.',
      'auth/network-request-failed': 'The connection dropped. Check your internet and try again.'
    }[code] || 'Please try again in a moment.';
    toast(`Sign-in did not finish. ${why}${code ? ` <span style="opacity:.6">(${esc(code)})</span>` : ''}`);
  });
}
function signOut() {
  if (!FB) return;
  clearTimeout(saveT); remoteSave();
  setTimeout(() => FB.authM.signOut(FB.auth).then(() => {
    S = defaultState(); S.onboarded = true;
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
    applyTheme(); renderAll();
    toast('Signed out. Your progress is safe in your account. Sign in again on any device to continue.');
  }), 400);
}

async function initNet() {
  NET.web = true; NET.unsubs = [];
  const cfg = window.GRIND_FIREBASE;
  if (!cfg || !cfg.apiKey) { NET.ready = true; renderSync(); renderNotices(); return; }
  try {
    const base = `https://www.gstatic.com/firebasejs/${FB_VERSION}/`;
    const [appM, authM, fsM] = await Promise.all([import(base + 'firebase-app.js'), import(base + 'firebase-auth.js'), import(base + 'firebase-firestore.js')]);
    const app = appM.initializeApp(cfg);
    const auth = authM.getAuth(app);
    FB = { authM, auth, fsM, fs: fsM.getFirestore(app) };
    NET.anonDb = fsAdapter(fsM, FB.fs);
    NET.fbReady = true;
  } catch (e) { NET.ready = true; renderSync(); renderNotices(); return; }
  NET.ready = true; renderSync(); renderNotices();
  FB.authM.onAuthStateChanged(FB.auth, u => { if (u) connect(u); else disconnect(); });
}
function disconnect() {
  (NET.unsubs || []).forEach(u => { try { u(); } catch (e) {} });
  NET.unsubs = [];
  Object.values(NET.circleUnsub).forEach(u => { try { u(); } catch (e) {} });
  Object.assign(NET, { db: null, uid: null, canWrite: false, userName: '', pond: [], ripples: [], posts: null, circleDocs: {}, circleUnsub: {} });
  renderAll(); renderDrawer();
}
async function connect(u) {
  const db = fsAdapter(FB.fsM, FB.fs), id = u.uid;
  NET.db = db; NET.uid = id; NET.canWrite = true; NET.userName = u.displayName || ''; NET.syncing = true;
  try {
    const snap = await db.doc(`data/users/${id}/state`).get();
    const d = snap.exists ? snap.data() : null;
    const remote = d && d.json ? mergeState(JSON.parse(d.json)) : null;
    const before = S;
    S = mergeState(mergeAccount(remote, S, id));
    S.ownerUid = id;
    if (!S.profile.name && u.displayName) S.profile.name = clampStr(u.displayName.split(' ')[0], 40);
    if (S !== before && !before.ownerUid && remote && (before.sessions.length || before.rocks.some(r => !r.example))) toast('Your progress from this device was added to your account.');
    applyTheme();
    NET.syncing = false; save(); remoteSave();
  } catch (e) { NET.syncing = false; NET.db = null; NET.canWrite = false; toast('Could not load your account just now. Your progress stays on this device. Try signing in again.'); renderAll(); return; }
  renderAll();
  NET.unsubs.push(db.collection('pond').orderBy('updatedAt', 'desc').limit(80).onSnapshot(s => {
    NET.pond = s.docs.filter(d => d.exists).map(d => cleanResident(d.id, d.data() || {}));
    renderPond(); renderFriends(); renderCircle();
  }, () => {}));
  NET.unsubs.push(db.doc('ripples/' + id).onSnapshot(s => {
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
  }, () => {}));
  NET.unsubs.push(db.collection('posts').orderBy('at', 'desc').limit(80).onSnapshot(s => {
    NET.posts = s.docs.filter(d => d.exists).map(d => cleanPost(d.id, d.data() || {}));
    renderFeed(); renderNotes();
  }, () => {}));
  subscribeCircles();
  publishPond();
  remoteSave();
  renderSync(); renderNotices(); renderComposerNote(); renderDrawer();
  toast(`Signed in. ${esc(petName())} has joined the pond.`, `<span style="width:30px;height:30px;flex:none">${avatarSVG(S.active, 'happy')}</span>`);
}

function remoteSave() {
  if (!NET.db || !NET.uid || !NET.canWrite || NET.syncing) return;
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
  const doc = { name: myName(), pet: petName(), animal: S.active, uni: S.profile.uni, major: S.profile.major, bio: S.profile.bio, status: st.status, endsAt: st.endsAt, todayKey: dayKey(), todayMins: todayMins(), streak: streakNow(), updatedAt: Date.now(), vis: S.profile.visibility };
  const vis = S.profile.visibility, card = { vis, allow: vis === 'friends' ? S.friends.filter(x => typeof x === 'string' && !x.startsWith('ex-')).slice(0, 300) : [], stats: vis === 'me' ? null : publicStats(), updatedAt: Date.now() };
  writeQ('stats/' + NET.uid, () => NET.db.doc('stats/' + NET.uid).set(card));
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
