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
    profile: { name: '', uni: '', major: '', bio: '' },
    active: 'frog',
    pets: { frog: { name: 'Pip', bond: 0 }, duckling: { name: 'Sunny', bond: 0 }, capybara: { name: 'Yuzu', bond: 0 } },
    unlocked: ['frog', 'duckling', 'capybara'],
    coins: 20, coinsEarned: 20, bestStreak: 0,
    settings: { focus: 25, rest: 5, preset: 'auto', custom: {}, fx: 'fireflies', sky: 'auto', sound: true, autoRest: true, demo: false },
    semesters: [{ id: semId, name: 'This semester', courses: [] }],
    currentSem: semId,
    rocks: [exampleRock()], sessions: [], pebLog: [], friends: [], circles: [], localPosts: [],
    seenRipple: 0, timer: null, lastCourse: '', openRock: 'example-rock'
  };
}
function mergeState(s) {
  const d = defaultState();
  return { ...d, ...s, settings: { ...d.settings, ...(s.settings || {}) }, profile: { ...d.profile, ...(s.profile || {}) } };
}
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
const pet = () => { const p = S.pets[S.active]; return p || { name: ANIMALS[S.active].defaultName, bond: 0 }; };
const petName = () => pet().name || ANIMALS[S.active].label;
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
function nextPebble() {
  const rocks = S.rocks.filter(r => r.pebbles.some(p => !p.done));
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
  auto: { name: 'Enchanted Pond', note: 'Beige, moss and rosy brown. Follows light and dark.', sw: ['#efe6d5', '#2f5a3f', '#7f8f55', '#b07a6e', '#a2baa6'] },
  midnight: { name: 'Midnight', dark: true, sw: ['#10141f', '#c9b6e4', '#8fa3c4', '#e0a3b0', '#1d2b45'],
    v: ['#10141f', '#141a28', '#181f2f', '#1f2839', '#2b3549', '#3a4660', '#e8e4d8', '#bdbbb0', '#8a8d99', '#c9b6e4', '#151826', '#8fa3c4', '#e0a3b0', '#3d2a35', '#e0c070', '#121a2c', '#1d2b45', '#16223a', '#2d3f60', '#3e5a4a', '#2f4739', '#1c2436', '#2a3a3a', '#e7b7c8', '#f5e7a1', 'rgba(0,0,0,.4)'] },
  sakura: { name: 'Sakura', sw: ['#f6e9e6', '#a8506a', '#8c9a6a', '#c97a8c', '#c9d6d4'],
    v: ['#f6e9e6', '#efdcd8', '#fbf4f1', '#f2e3df', '#e2c8c2', '#d3afa8', '#3a2a2e', '#5e4a4e', '#8e7a7c', '#a8506a', '#fff6f3', '#8c9a6a', '#c97a8c', '#f3d4d9', '#c9a050', '#f7e3e3', '#c9d6d4', '#aec4c2', '#e2ebe8', '#86a06a', '#6b8752', '#e6cfc4', '#7f8f5a', '#f0aebe', '#fbeec0', 'rgba(90,40,50,.14)'] },
  ocean: { name: 'Ocean', sw: ['#e8eef0', '#2b6a85', '#6c9a8a', '#c08a7a', '#8fb6c6'],
    v: ['#e8eef0', '#dce6ea', '#f4f8f9', '#e6eef1', '#c8d6dc', '#aebfc7', '#1d3440', '#44606c', '#72878f', '#2b6a85', '#f4f8f9', '#6c9a8a', '#c08a7a', '#f1dcd4', '#c9a050', '#dfeaf0', '#8fb6c6', '#6f9db1', '#c3dbe4', '#5f9a7a', '#4a7f62', '#d6d0bd', '#4f7a6a', '#f2c4b8', '#f8eab0', 'rgba(20,50,60,.14)'] },
  forest: { name: 'Forest', dark: true, sw: ['#1a2219', '#d9b36a', '#9db06a', '#d29b85', '#2f4a37'],
    v: ['#1a2219', '#1f291e', '#243022', '#2c3a29', '#3a4b36', '#4b5f45', '#efe6cf', '#cfc5aa', '#98a08a', '#d9b36a', '#1a2219', '#9db06a', '#d29b85', '#45332a', '#d9b36a', '#1d2a1d', '#2f4a37', '#233d2c', '#43614a', '#5a7d3e', '#476431', '#2a3524', '#415234', '#e2a9a0', '#f2e08f', 'rgba(0,0,0,.35)'] }
};
function lum(hex) { const h = hex.replace('#', ''); if (h.length < 6) return .5; const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255); return .2126 * r + .7152 * g + .0722 * b; }
function applyTheme() {
  const st = document.documentElement.style;
  TOKENS.forEach(t => st.removeProperty('--' + t));
  st.removeProperty('color-scheme');
  const p = PRESETS[S.settings.preset];
  if (p && p.v) { TOKENS.forEach((t, i) => st.setProperty('--' + t, p.v[i])); st.setProperty('color-scheme', p.dark ? 'dark' : 'light'); }
  const c = S.settings.custom || {};
  if (c.accent) { st.setProperty('--accent', c.accent); st.setProperty('--accent-ink', lum(c.accent) > .55 ? '#1b241e' : '#fbf6ec'); }
  if (c.bg) { st.setProperty('--bg', c.bg); const dark = lum(c.bg) < .4; if (dark !== !!(p && p.dark)) { /* keep text readable on a custom paper */ st.setProperty('--ink', dark ? '#ede4d1' : '#22352a'); st.setProperty('--ink-2', dark ? '#c3bca8' : '#4b5a4a'); } }
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
