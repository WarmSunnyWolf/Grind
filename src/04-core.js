/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-5);
const pad2 = n => String(n).padStart(2, '0');
const dayKey = (d = new Date()) => { const x = new Date(d); return `${x.getFullYear()}-${pad2(x.getMonth() + 1)}-${pad2(x.getDate())}`; };
const keyToDate = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const icon = (id, cls = '') => `<svg class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
const fmtMin = m => { m = Math.round(m); if (m < 60) return `${m} min`; const h = Math.floor(m / 60), r = m % 60; return r ? `${h}h ${r}m` : `${h}h`; };
const ago = t => { const s = (Date.now() - t) / 1000; if (s < 60) return 'just now'; if (s < 3600) return `${Math.floor(s / 60)} min ago`; if (s < 86400) return `${Math.floor(s / 3600)}h ago`; const d = Math.floor(s / 86400); return d === 1 ? 'yesterday' : `${d} days ago`; };
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const clampStr = (s, n) => String(s ?? '').slice(0, n);
const COURSE_COLORS = ['#5f8a5a', '#b0766a', '#5b7fa0', '#c39a43', '#8a6aa0', '#4f9a94', '#a0705a', '#7a8a3a'];

/* ---------- state ---------- */
const KEY = 'grind.v1';
function exampleRock() {
  const due = dayKey(addDays(new Date(), 5));
  return {
    id: 'example-rock', title: 'Example: quiz on chapter 4', courseId: '', due, example: true, createdAt: Date.now(), notes: '',
    pebbles: [
      { id: uid(), text: 'Skim the chapter 4 slides and list five key terms', mins: 15, done: true, doneAt: Date.now() },
      { id: uid(), text: 'Rewatch the hardest part of the lecture', mins: 20, done: false },
      { id: uid(), text: 'Do five practice questions', mins: 20, done: false },
      { id: uid(), text: 'Write a one-page cheat sheet', mins: 25, done: false },
      { id: uid(), text: 'Quiz each other in your Grind Together circle', mins: 15, done: false }
    ]
  };
}
function defaultState() {
  const semId = 'sem-' + uid();
  return {
    v: 1, updatedAt: 0, onboarded: false,
    profile: { name: '', uni: '', major: '', bio: '', visibility: 'everyone' },
    active: 'frog',
    pets: { frog: { name: '', bond: 0 }, duckling: { name: '', bond: 0 }, capybara: { name: '', bond: 0 } },
    unlocked: ['frog', 'duckling', 'capybara'],
    coins: 20, coinsEarned: 20, bestStreak: 0,
    settings: { focus: 25, rest: 5, preset: 'auto', custom: {}, fx: 'fireflies', sky: 'auto', sound: true, noteSound: true, autoRest: true, demo: false },
    semesters: [{ id: semId, name: 'This semester', courses: [] }],
    currentSem: semId,
    rocks: [exampleRock()], crossLog: [], events: [], wardrobe: [], sessions: [], pebLog: [], friends: [], circles: [], localPosts: [],
    seenRipple: 0, visV2: true, timer: null, lastCourse: '', openRock: 'example-rock',
    sounds: { owned: ['rain'], pick: 'rain', vol: .5, withFocus: true, quran: { reciter: 'afs', surah: 1 }, link: '' }
  };
}
// When someone signs in, combine what they did on this device before signing in with what is saved in their account.
// Two saved copies of the same student's progress (this device and the account) are combined, never replaced,
// so a device that was offline or out of date can never wipe sessions, coins or animals saved elsewhere.
function unionState(newer, older) {
  const m = JSON.parse(JSON.stringify(newer)), o = older || {};
  const key = x => x && (x.id || '') + ':' + (x.at || x.start || '');
  const byId = (a = [], b = []) => { const ids = new Set(a.map(x => x && x.id)); return [...a, ...b.filter(x => x && x.id && !ids.has(x.id) && !x.example)]; };
  const byKey = (a = [], b = []) => { const ks = new Set(a.map(key)); return [...a, ...b.filter(x => x && !ks.has(key(x)))]; };
  const set = (a = [], b = []) => [...new Set([...a, ...b])];
  m.sessions = byId(m.sessions, o.sessions).sort((x, y) => x.start - y.start);
  m.rocks = byId(m.rocks, o.rocks);
  m.events = byId(m.events, o.events);
  m.localPosts = byId(m.localPosts, o.localPosts);
  m.pebLog = byKey(m.pebLog, o.pebLog);
  m.crossLog = byKey(m.crossLog, o.crossLog);
  m.unlocked = set(m.unlocked, o.unlocked);
  m.wardrobe = set(m.wardrobe, o.wardrobe);
  m.friends = set(m.friends, o.friends);
  m.circles = set(m.circles, o.circles);
  m.pets = m.pets || {};
  Object.entries(o.pets || {}).forEach(([k, p]) => { const q = m.pets[k]; if (!q) m.pets[k] = p; else { q.bond = Math.max(q.bond || 0, p.bond || 0); if (!q.name && p.name) q.name = p.name; if (p.coats) q.coats = set(q.coats, p.coats); if (!q.look && p.look) q.look = p.look; } });
  m.coins = Math.max(m.coins || 0, o.coins || 0);
  m.coinsEarned = Math.max(m.coinsEarned || 0, o.coinsEarned || 0);
  m.bestStreak = Math.max(m.bestStreak || 0, o.bestStreak || 0);
  if (m.sounds && o.sounds) m.sounds.owned = set(m.sounds.owned, o.sounds.owned);
  const ms = m.semesters || (m.semesters = []);
  (o.semesters || []).forEach(sm => { const t = ms.find(x => x.id === sm.id); if (!t) ms.push(sm); else t.courses = byId(t.courses, sm.courses); });
  Object.entries(o.challenge || {}).forEach(([id, c]) => { m.challenge = m.challenge || {}; const r = m.challenge[id] || { days: [] }; r.days = set(r.days, c.days); m.challenge[id] = r; });
  ['name', 'uni', 'major', 'bio'].forEach(f => { if (m.profile && !m.profile[f] && o.profile && o.profile[f]) m.profile[f] = o.profile[f]; });
  if (o.onboarded) m.onboarded = true;
  return m;
}
function mergeAccount(remote, local, uid) {
  if (!remote) return local.ownerUid && local.ownerUid !== uid ? defaultState() : local;
  if (local.ownerUid === uid) return (local.updatedAt || 0) > (remote.updatedAt || 0) ? unionState(local, remote) : unionState(remote, local);
  if (local.ownerUid) return remote;
  const remIds = new Set([...(remote.sessions || []), ...(remote.rocks || []), ...(remote.events || [])].map(x => x.id));
  const mine = [...(local.sessions || []), ...(local.rocks || []).filter(r => !r.example), ...(local.events || [])];
  if (mine.some(x => remIds.has(x.id))) return (local.updatedAt || 0) > (remote.updatedAt || 0) ? local : remote;
  if (!mine.length) return remote;
  const m = remote, byId = (a, b) => { const ids = new Set(a.map(x => x.id)); return [...a, ...b.filter(x => x && !ids.has(x.id))]; };
  m.sessions = byId(m.sessions || [], local.sessions || []).sort((a, b) => a.start - b.start);
  m.rocks = byId(m.rocks || [], (local.rocks || []).filter(r => !r.example));
  m.pebLog = [...(m.pebLog || []), ...(local.pebLog || [])].filter((x, i, a) => a.findIndex(y => JSON.stringify(y) === JSON.stringify(x)) === i);
  m.localPosts = byId(m.localPosts || [], local.localPosts || []);
  m.events = byId(m.events || [], local.events || []);
  m.unlocked = [...new Set([...(m.unlocked || []), ...(local.unlocked || [])])];
  m.wardrobe = [...new Set([...(m.wardrobe || []), ...(local.wardrobe || [])])];
  Object.entries(local.pets || {}).forEach(([k, p]) => { if (!m.pets[k]) m.pets[k] = p; else { m.pets[k].bond = Math.max(m.pets[k].bond || 0, p.bond || 0); if (!m.pets[k].name && p.name) m.pets[k].name = p.name; } });
  const earned = Math.max(0, (local.coinsEarned || 20) - 20);
  m.coins = (m.coins || 0) + earned; m.coinsEarned = (m.coinsEarned || 0) + earned;
  m.friends = [...new Set([...(m.friends || []), ...(local.friends || [])])];
  m.circles = [...new Set([...(m.circles || []), ...(local.circles || [])])];
  m.sounds = m.sounds || local.sounds;
  if (m.sounds && local.sounds) m.sounds.owned = [...new Set([...(m.sounds.owned || []), ...(local.sounds.owned || [])])];
  m.bestStreak = Math.max(m.bestStreak || 0, local.bestStreak || 0);
  Object.entries(local.challenge || {}).forEach(([id, c]) => { m.challenge = m.challenge || {}; const r = m.challenge[id] || { days: [] }; r.days = [...new Set([...(r.days || []), ...(c.days || [])])]; m.challenge[id] = r; });
  return m;
}
function mergeState(s) {
  const d = defaultState();
  const m = { ...d, ...s, settings: { ...d.settings, ...(s.settings || {}) }, profile: { ...d.profile, ...(s.profile || {}) }, sounds: { ...d.sounds, ...(s.sounds || {}) } };
  if (!['me', 'friends', 'everyone'].includes(m.profile.visibility)) m.profile.visibility = m.profile.public === false ? 'me' : 'everyone';
  delete m.profile.public;
  // everyone starts public; earlier versions could leave accounts hidden
  if (!s.visV2) { m.profile.visibility = 'everyone'; m.visV2 = true; }
  if (!m.sounds.quran || typeof m.sounds.quran !== 'object') m.sounds.quran = { reciter: 'afs', surah: 1 };
  if (!Array.isArray(m.sounds.owned) || !m.sounds.owned.includes('rain')) m.sounds.owned = ['rain', ...(Array.isArray(m.sounds.owned) ? m.sounds.owned : [])];
  // earlier versions gave every animal a made-up name; students now name their own
  const OLD_NAMES = { frog: 'Pip', duckling: 'Sunny', capybara: 'Yuzu', rabbit: 'Clover', otter: 'Miso', fox: 'Ember', horse: 'Maple', deer: 'Fern', turtle: 'Moss', axolotl: 'Nori', heron: 'Sage' };
  Object.entries(m.pets || {}).forEach(([k, p]) => { if (p && p.name === OLD_NAMES[k]) p.name = ''; });
  // demo speed and the sample week are gone; drop their leftovers
  m.settings.demo = false;
  if (Array.isArray(m.sessions)) m.sessions = m.sessions.filter(x => !x.sample);
  // a rock is finished once it has crossedAt; older versions only knew "every pebble ticked"
  (m.rocks || []).forEach(r => { if (!r.crossedAt && r.pebbles && r.pebbles.length && r.pebbles.every(p => p.done)) r.crossedAt = Math.max(0, ...r.pebbles.map(p => +p.doneAt || 0)) || Date.now(); });
  if (!Array.isArray(s.crossLog)) m.crossLog = (m.rocks || []).filter(r => r.crossedAt && !r.example).map(r => crossEntry(r)).sort((a, b) => a.at - b.at);
  return m;
}
function rockDone(r) { return !!r.crossedAt; }
function crossEntry(r) { return { id: r.id, title: r.title, courseId: r.courseId || '', color: r.color || '', at: r.crossedAt, pebbles: r.pebbles.length, due: r.due || '' }; }
function loadLocal() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1) return mergeState(s); } catch (e) {}
  return defaultState();
}
let S = loadLocal();
let saveT = null;
function save() {
  S.updatedAt = Date.now();
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  clearTimeout(saveT); saveT = setTimeout(remoteSave, 1500);
}

/* ---------- derived data ---------- */
const allCourses = () => S.semesters.flatMap(s => s.courses.map(c => ({ ...c, sem: s.id })));
const curCourses = () => (S.semesters.find(s => s.id === S.currentSem) || S.semesters[0] || { courses: [] }).courses;
const courseById = id => allCourses().find(c => c.id === id);
const courseName = id => courseById(id)?.name || 'General';
const courseColor = id => courseById(id)?.color || 'var(--muted)';
const pet = () => { const p = S.pets[S.active]; return p || { name: '', bond: 0 }; };
const petName = () => pet().name || ANIMALS[S.active].label;
const petTitle = () => pet().name ? `${pet().name} the ${ANIMALS[S.active].label.toLowerCase()}` : `your ${ANIMALS[S.active].label.toLowerCase()}`;
const myName = () => S.profile.name || 'Student';

function minutesByDay(filter) {
  const m = {};
  S.sessions.forEach(s => { if (filter && !filter(s)) return; const k = dayKey(s.start); m[k] = (m[k] || 0) + s.mins; });
  return m;
}
function activeDays() {
  const set = new Set();
  S.sessions.forEach(s => { if (s.mins > 0) set.add(dayKey(s.start)); });
  S.pebLog.forEach(p => set.add(dayKey(p.at)));
  return set;
}
function streakNow() {
  const days = activeDays();
  let d = new Date(), n = 0;
  if (!days.has(dayKey(d))) d = addDays(d, -1);
  while (days.has(dayKey(d))) { n++; d = addDays(d, -1); }
  return n;
}
function bestStreak() {
  const ks = [...activeDays()].sort();
  let best = 0, run = 0, prev = null;
  ks.forEach(k => { const d = keyToDate(k); run = prev && Math.round((d - prev) / 864e5) === 1 ? run + 1 : 1; best = Math.max(best, run); prev = d; });
  return Math.max(best, S.bestStreak || 0);
}
const todayMins = () => minutesByDay()[dayKey()] || 0;
const weekStart = (d = new Date()) => { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };
// leaderboard minutes, keyed by period so old numbers drop off by themselves (weeks start on Monday)
function boardStats() {
  const d = dayKey(), w = dayKey(weekStart()), mo = d.slice(0, 7), b = { d, w, m: mo, dm: 0, wm: 0, mm: 0 };
  S.sessions.forEach(s => { const k = dayKey(s.start); if (k === d) b.dm += s.mins; if (k >= w) b.wm += s.mins; if (k.slice(0, 7) === mo) b.mm += s.mins; });
  return b;
}
function publicStats() {
  const week = dayKey(addDays(new Date(), -6));
  return {
    totalMins: S.sessions.reduce((a, s) => a + s.mins, 0),
    weekMins: S.sessions.filter(s => dayKey(s.start) >= week).reduce((a, s) => a + s.mins, 0),
    sessions: S.sessions.length,
    bestStreak: Math.max(bestStreak(), streakNow()),
    coinsEarned: S.coinsEarned || 0,
    pebbles: (S.pebLog || []).length,
    animals: S.unlocked.slice(0, 40)
  };
}
function nextPebble() {
  const rocks = S.rocks.filter(r => !r.crossedAt && r.pebbles.some(p => !p.done));
  rocks.sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999'));
  for (const r of rocks) { const p = r.pebbles.find(p => !p.done); if (p) return { rock: r, peb: p }; }
  return null;
}
function dueText(due) {
  if (!due) return '';
  const n = Math.round((keyToDate(due) - keyToDate(dayKey())) / 864e5);
  if (n === 0) return 'Due today';
  if (n === 1) return 'Due tomorrow';
  if (n > 1) return `Due in ${n} days`;
  return n === -1 ? 'Was due yesterday' : `Was due ${-n} days ago`;
}

/* ---------- toasts & small UI ---------- */
function toast(html, art) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = (art || '') + `<span>${html}</span>`;
  $('#toasts').appendChild(t);
  setTimeout(() => { t.style.transition = 'opacity .4s'; t.style.opacity = '0'; setTimeout(() => t.remove(), 450); }, 3800);
}
function addCoins(n, why) {
  if (!n) return;
  S.coins = Math.max(0, S.coins + n);
  if (n > 0) S.coinsEarned = (S.coinsEarned || 0) + n;
  renderChips();
  if (n > 0 && why) toast(`<b>+${n} coins</b> ${esc(why)}`, icon('i-coin'));
}
let audioCtx = null;
function chime() {
  if (!S.settings.sound) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0, now + i * .16); g.gain.linearRampToValueAtTime(.12, now + i * .16 + .03); g.gain.exponentialRampToValueAtTime(.0001, now + i * .16 + 1.4);
      o.connect(g).connect(audioCtx.destination); o.start(now + i * .16); o.stop(now + i * .16 + 1.5);
    });
  } catch (e) {}
}

/* ---------- themes ---------- */
const TOKENS = ['bg', 'bg-2', 'surface', 'surface-2', 'line', 'line-2', 'ink', 'ink-2', 'muted', 'accent', 'accent-ink', 'moss', 'rose', 'rose-soft', 'gold', 'sky', 'water', 'water-2', 'water-hi', 'pad', 'pad-2', 'bank', 'reed', 'bloom', 'glow', 'shadow'];
const PRESETS = {
  auto: { name: 'Enchanted Pond', native: 'device',
    light: ['#efe6d5', '#e6dac4', '#f8f2e7', '#eee4d2', '#d6c7ab', '#c4b291', '#22352a', '#4b5a4a', '#7a7d69', '#2f5a3f', '#f8f2e7', '#7f8f55', '#b07a6e', '#ecd5cc', '#c39a43', '#eadfc8', '#a2baa6', '#86a48f', '#cbdbc8', '#6f8f4e', '#57763d', '#cdb995', '#5d6d3c', '#e9bcb3', '#f4e3a3', 'rgba(52, 40, 24, .14)'],
    dark: ['#131b16', '#18221c', '#1d2922', '#24332a', '#32443a', '#435a4c', '#ede4d1', '#c3bca8', '#8f9481', '#a9c48b', '#14201a', '#93a468', '#d29b8e', '#47312d', '#d9b65f', '#17241e', '#2a463b', '#20392f', '#3e5f51', '#4d6e3b', '#3b5631', '#29352a', '#3d4c31', '#d7a3a0', '#f3e49c', 'rgba(0, 0, 0, .35)'] },
  midnight: { name: 'Midnight', native: 'dark',
    light: ['#eeeaf4', '#e4dfee', '#f7f5fb', '#ebe6f3', '#d4cce3', '#bfb4d4', '#232338', '#4a4862', '#7a7890', '#5b4a8a', '#f7f5fb', '#6f86a8', '#b0708a', '#ecd6e0', '#b8963c', '#e6e2f0', '#b5bfd8', '#9aa6c6', '#d6dcec', '#6f8a6a', '#58714f', '#cfc6dd', '#5e6a52', '#e7b7c8', '#f5e7a1', 'rgba(40, 30, 70, .14)'],
    dark: ['#10141f', '#141a28', '#181f2f', '#1f2839', '#2b3549', '#3a4660', '#e8e4d8', '#bdbbb0', '#8a8d99', '#c9b6e4', '#151826', '#8fa3c4', '#e0a3b0', '#3d2a35', '#e0c070', '#121a2c', '#1d2b45', '#16223a', '#2d3f60', '#3e5a4a', '#2f4739', '#1c2436', '#2a3a3a', '#e7b7c8', '#f5e7a1', 'rgba(0, 0, 0, .4)'] },
  sakura: { name: 'Sakura', native: 'light',
    light: ['#f6e9e6', '#efdcd8', '#fbf4f1', '#f2e3df', '#e2c8c2', '#d3afa8', '#3a2a2e', '#5e4a4e', '#8e7a7c', '#a8506a', '#fff6f3', '#8c9a6a', '#c97a8c', '#f3d4d9', '#c9a050', '#f7e3e3', '#c9d6d4', '#aec4c2', '#e2ebe8', '#86a06a', '#6b8752', '#e6cfc4', '#7f8f5a', '#f0aebe', '#fbeec0', 'rgba(90, 40, 50, .14)'],
    dark: ['#1e1517', '#24191c', '#2a1e21', '#33252a', '#463238', '#5a414a', '#f3e4e6', '#d4bfc2', '#a08a8e', '#f0a6bc', '#2a1418', '#a3b07a', '#e59aae', '#4a2a33', '#d9b060', '#2a1d22', '#3e3a44', '#322e38', '#57505e', '#5d7a45', '#4a6236', '#3a2a2e', '#55603f', '#f0aebe', '#fbeec0', 'rgba(0, 0, 0, .4)'] },
  ocean: { name: 'Ocean', native: 'light',
    light: ['#e8eef0', '#dce6ea', '#f4f8f9', '#e6eef1', '#c8d6dc', '#aebfc7', '#1d3440', '#44606c', '#72878f', '#2b6a85', '#f4f8f9', '#6c9a8a', '#c08a7a', '#f1dcd4', '#c9a050', '#dfeaf0', '#8fb6c6', '#6f9db1', '#c3dbe4', '#5f9a7a', '#4a7f62', '#d6d0bd', '#4f7a6a', '#f2c4b8', '#f8eab0', 'rgba(20, 50, 60, .14)'],
    dark: ['#0f1b22', '#13222a', '#172832', '#1e323e', '#2a4250', '#3a5666', '#e2eef2', '#b6cbd2', '#7f97a0', '#7cc0dc', '#0d1a20', '#7fb29c', '#e0a596', '#3e2e2c', '#d9b65f', '#12212a', '#1f4456', '#173746', '#2f5d72', '#3f6e57', '#305744', '#1d2f36', '#3a5a4e', '#f2c4b8', '#f8eab0', 'rgba(0, 0, 0, .4)'] },
  forest: { name: 'Forest', native: 'dark',
    light: ['#eef0e2', '#e3e7d2', '#f7f8ef', '#e9ecdb', '#cfd5b8', '#b8c19c', '#1f2a1c', '#43513d', '#77806a', '#3f5f2c', '#f7f8ef', '#7d9a4f', '#b57d6a', '#ecd8cc', '#b8902f', '#e4e9d4', '#9fbc9c', '#82a483', '#c6dbc0', '#5d8a3e', '#4a7231', '#c9c79f', '#4e6a35', '#e2a9a0', '#f2e08f', 'rgba(30, 40, 20, .14)'],
    dark: ['#1a2219', '#1f291e', '#243022', '#2c3a29', '#3a4b36', '#4b5f45', '#efe6cf', '#cfc5aa', '#98a08a', '#d9b36a', '#1a2219', '#9db06a', '#d29b85', '#45332a', '#d9b36a', '#1d2a1d', '#2f4a37', '#233d2c', '#43614a', '#5a7d3e', '#476431', '#2a3524', '#415234', '#e2a9a0', '#f2e08f', 'rgba(0, 0, 0, .35)'] }
};
const deviceDark = () => { try { return matchMedia('(prefers-color-scheme: dark)').matches; } catch (e) { return false; } };
/* light or dark: the student's choice, else the theme's own (Enchanted Pond follows the device) */
function themeMode(key) {
  const m = S.settings.mode, p = PRESETS[key] || PRESETS.auto;
  if (m === 'light' || m === 'dark') return m;
  if (m === 'auto' || p.native === 'device') return deviceDark() ? 'dark' : 'light';
  return p.native;
}
const swatch = v => [v[0], v[9], v[11], v[12], v[16]];
function lum(hex) { const h = hex.replace('#', ''); if (h.length < 6) return .5; const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255); return .2126 * r + .7152 * g + .0722 * b; }
function applyTheme() {
  const st = document.documentElement.style;
  TOKENS.forEach(t => st.removeProperty('--' + t));
  st.removeProperty('color-scheme');
  const key = PRESETS[S.settings.preset] ? S.settings.preset : 'auto', mode = themeMode(key), v = PRESETS[key][mode], isDark = mode === 'dark';
  TOKENS.forEach((t, i) => st.setProperty('--' + t, v[i])); st.setProperty('color-scheme', mode);
  document.documentElement.dataset.theme = mode;
  const c = S.settings.custom || {};
  if (c.accent) { st.setProperty('--accent', c.accent); st.setProperty('--accent-ink', lum(c.accent) > .55 ? '#1b241e' : '#fbf6ec'); }
  if (c.bg) { st.setProperty('--bg', c.bg); const dark = lum(c.bg) < .4; if (dark !== isDark) { /* keep text readable on a custom paper */ st.setProperty('--ink', dark ? '#ede4d1' : '#22352a'); st.setProperty('--ink-2', dark ? '#c3bca8' : '#4b5a4a'); } }
  if (c.water) { st.setProperty('--water', c.water); }
  const cs = getComputedStyle(document.documentElement);
  $('#cAccent').value = toHex(cs.getPropertyValue('--accent'));
  $('#cBg').value = toHex(cs.getPropertyValue('--bg'));
  $('#cWater').value = toHex(cs.getPropertyValue('--water'));
}
function toHex(v) { v = v.trim(); if (/^#[0-9a-f]{6}$/i.test(v)) return v; if (/^#[0-9a-f]{3}$/i.test(v)) return '#' + [...v.slice(1)].map(c => c + c).join(''); return '#888888'; }
function skyNow() {
  if (S.settings.sky !== 'auto') return S.settings.sky;
  const h = new Date().getHours() + new Date().getMinutes() / 60;
  return h >= 6 && h < 17 ? 'day' : h >= 17 && h < 19.5 ? 'dusk' : 'night';
}

/* ---------- pond scenery ---------- */
function padShape(x, y, r, bloom) {
  return `<g transform="translate(${x} ${y}) scale(${r / 100})"><path d="M0 0 L50 -20.8 A100 24 0 1 1 17.4 -23.6 Z" fill="var(--pad)" stroke="var(--pad-2)" stroke-width="${300 / r}" stroke-linejoin="round"/><path d="M0 0 L-70 9 M0 0 L-24 21 M0 0 L46 17" stroke="var(--pad-2)" stroke-width="${200 / r}" opacity=".55"/>${bloom ? `<g transform="translate(-40 -14) scale(${Math.max(1.3, 90 / r)})"><path d="M0 0 C-10 -6 -12 -18 -6 -24 C-2 -16 0 -10 0 0 Z M0 0 C10 -6 12 -18 6 -24 C2 -16 0 -10 0 0 Z M0 0 C-5 -10 -4 -22 0 -28 C4 -22 5 -10 0 0 Z" fill="var(--bloom)" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/></g>` : ''}</g>`;
}
function cattails(x, flip) {
  const s = flip ? -1 : 1;
  const stems = [[0, 0, -18, -150], [26, 0, 34, -120], [-20, 0, -44, -100], [12, 0, 6, -170]];
  return `<g transform="translate(${x} 505) scale(${s} 1)">${stems.map(([a, b, c, d], i) => `<path d="M${a} ${b} Q${(a + c) / 2 + 10} ${d / 2} ${c} ${d}" stroke="var(--reed)" stroke-width="4" fill="none" stroke-linecap="round"/>${i % 2 === 0 ? `<rect x="${c - 6}" y="${d - 4}" width="12" height="34" rx="6" fill="#7a5a3c" stroke="${INK}" stroke-width="2"/>` : ''}`).join('')}
    <path d="M-30 0 Q-40 -60 -70 -90 M40 0 Q52 -50 80 -70" stroke="var(--reed)" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/></g>`;
}
function sceneSVG(kind) {
  const pads = kind === 'focus'
    ? [[130, 330, 46, 1], [672, 300, 40, 0], [70, 450, 62, 0], [736, 440, 58, 1], [292, 236, 24, 0], [540, 228, 20, 1], [430, 300, 18, 0]]
    : [[110, 250, 26, 1], [700, 240, 24, 0], [40, 480, 40, 0], [770, 470, 40, 1], [400, 212, 16, 1]];
  let stars = '';
  for (let i = 0; i < 26; i++) { const x = (i * 137) % 800, y = (i * 53) % 130 + 8; stars += `<circle cx="${x}" cy="${y}" r="${i % 3 ? 1.1 : 1.8}" fill="#fff8dc"/>`; }
  let trees = 'M0 150';
  for (let x = 0; x <= 800; x += 40) trees += ` Q${x + 20} ${118 + ((x * 7) % 26)} ${x + 40} ${146 - ((x * 3) % 10)}`;
  trees += ' V170 H0 Z';
  return `<svg class="scene" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><linearGradient id="wg-${kind}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--water-hi)"/><stop offset=".22" style="stop-color:var(--water)"/><stop offset="1" style="stop-color:var(--water-2)"/></linearGradient></defs>
    <rect width="800" height="500" fill="var(--sky)"/>
    <g class="stars">${stars}</g>
    <circle class="sun" cx="640" cy="70" r="34" fill="var(--glow)" opacity=".9"/>
    <g class="moon"><circle cx="640" cy="72" r="24" fill="#f3ecd2"/><circle cx="651" cy="64" r="21" fill="var(--sky)"/></g>
    <path d="M0 152 C80 112 160 124 240 136 C320 104 420 108 500 132 C580 110 680 114 800 142 V180 H0Z" fill="var(--bank)"/>
    <path d="${trees}" fill="var(--reed)" opacity=".5"/>
    <rect y="166" width="800" height="334" fill="url(#wg-${kind})"/>
    <path d="M0 168 C200 160 600 176 800 166" stroke="var(--pad-2)" stroke-width="3" opacity=".25" fill="none"/>
    <g class="water-line" stroke="var(--water-hi)" stroke-width="3" stroke-linecap="round" opacity=".75" fill="none">
      <path d="M90 200 h70 M220 214 h40 M470 196 h90 M610 222 h50 M330 266 h60 M560 290 h80 M200 300 h44 M60 360 h50 M690 360 h50 M380 420 h70 M240 470 h60 M540 470 h70"/></g>
    ${pads.map(p => padShape(...p)).join('')}
    ${cattails(18, false)}${cattails(782, true)}
    <rect class="tint" width="800" height="500" fill="#0b1424" opacity="0"/>
  </svg>`;
}

/* ---------- ambient effects (fireflies, rain, petals) ---------- */
const FX = [];
function makeFX(stage) { const c = document.createElement('canvas'); c.className = 'fx'; stage.appendChild(c); const o = { stage, c, ctx: c.getContext('2d'), parts: [], drops: [], mode: null, sky: null, w: 0, h: 0 }; FX.push(o); return o; }
function fxSize(o) {
  const r = o.stage.getBoundingClientRect();
  if (!r.width) return false;
  if (Math.abs(o.w - r.width) > 1 || Math.abs(o.h - r.height) > 1) {
    const d = Math.min(2, devicePixelRatio || 1);
    o.w = r.width; o.h = r.height; o.c.width = r.width * d; o.c.height = r.height * d; o.ctx.setTransform(d, 0, 0, d, 0, 0); o.mode = null;
  }
  return true;
}
function fxSeed(o) {
  o.mode = S.settings.fx; o.sky = skyNow(); o.parts = []; o.drops = [];
  const { w, h } = o;
  const n = o.mode === 'fireflies' ? (o.sky === 'night' ? 26 : o.sky === 'dusk' ? 18 : 11) : o.mode === 'rain' ? 90 : o.mode === 'petals' ? 22 : 0;
  for (let i = 0; i < n; i++) o.parts.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .2, ph: Math.random() * 6.28, r: 1.6 + Math.random() * 1.8, s: .6 + Math.random() * .9, a: Math.random() * 6.28 });
}
function fxDraw(o, t) {
  const { ctx, w, h } = o;
  ctx.clearRect(0, 0, w, h);
  if (o.mode === 'fireflies') {
    const night = o.sky !== 'day';
    o.parts.forEach(p => {
      p.x += p.vx + Math.sin(t / 1900 + p.ph) * .25; p.y += p.vy + Math.cos(t / 2300 + p.ph) * .2;
      if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10; if (p.y < h * .12) p.vy = Math.abs(p.vy); if (p.y > h) p.vy = -Math.abs(p.vy);
      const a = .25 + .75 * Math.pow(Math.abs(Math.sin(t / 900 * p.s + p.ph)), 2);
      const R = p.r * (night ? 7 : 5);
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, R);
      g.addColorStop(0, `rgba(255,246,190,${a})`); g.addColorStop(.25, `rgba(244,227,150,${a * .55})`); g.addColorStop(1, 'rgba(244,227,150,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, 6.283); ctx.fill();
      ctx.fillStyle = `rgba(255,250,215,${Math.min(1, a + .2)})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * .7, 0, 6.283); ctx.fill();
    });
  } else if (o.mode === 'rain') {
    ctx.strokeStyle = 'rgba(235,242,240,.55)'; ctx.lineWidth = 1.2; ctx.beginPath();
    o.parts.forEach(p => {
      p.y += 7 * p.s + 3; p.x += .8;
      const floor = h * (.38 + (p.ph / 6.28) * .6);
      if (p.y > floor) { o.drops.push({ x: p.x, y: floor, r: 1, a: .6 }); p.y = -20 - Math.random() * h * .3; p.x = Math.random() * w; }
      ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - 1.6, p.y - 11);
    });
    ctx.stroke();
    o.drops = o.drops.filter(d => d.a > .02);
    o.drops.forEach(d => { d.r += .5; d.a *= .955; ctx.strokeStyle = `rgba(240,246,244,${d.a})`; ctx.beginPath(); ctx.ellipse(d.x, d.y, d.r * 2, d.r * .6, 0, 0, 6.283); ctx.stroke(); });
  } else if (o.mode === 'petals') {
    o.parts.forEach(p => {
      p.y += .45 * p.s + .2; p.x += .35 + Math.sin(t / 1400 + p.ph) * .5; p.a += .012 * p.s;
      if (p.y > h + 10 || p.x > w + 10) { p.y = -10; p.x = Math.random() * w * .9 - w * .1; }
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.scale(1, .55 + .45 * Math.sin(p.a * 2));
      ctx.fillStyle = 'rgba(240,176,190,.88)'; ctx.strokeStyle = 'rgba(160,90,100,.5)'; ctx.lineWidth = .8;
      ctx.beginPath(); ctx.ellipse(0, 0, p.r * 2.6, p.r * 1.6, 0, 0, 6.283); ctx.fill(); ctx.stroke(); ctx.restore();
    });
  }
}
function fxLoop(t) {
  FX.forEach(o => {
    if (!o.stage.offsetParent || !fxSize(o)) return;
    if (o.mode !== S.settings.fx || o.sky !== skyNow()) fxSeed(o);
    fxDraw(o, t);
  });
  if (!REDUCED) requestAnimationFrame(fxLoop);
}
function applySky() { const s = skyNow(); $$('.stage').forEach(st => st.dataset.sky = s); }
