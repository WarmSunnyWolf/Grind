/* ---------- the wardrobe: accessories and colours for each animal ---------- */
// where a hat sits and where a bow tie goes on each animal: [x, y, scale]
const ANCHORS = {
  frog: { hat: [100, 96, .9], neck: [100, 138, .9] }, duckling: { hat: [90, 58, .85], neck: [94, 124, .8] }, capybara: { hat: [86, 48, .95], neck: [86, 140, .9] },
  rabbit: { hat: [100, 72, .85], neck: [100, 142, .8] }, butterfly: { hat: [100, 74, .45], neck: [100, 104, .4] }, kitty: { hat: [100, 60, .95], neck: [100, 128, .85] },
  otter: { hat: [100, 54, .95], neck: [100, 122, .85] }, dog: { hat: [100, 58, .95], neck: [100, 130, .85] }, panda: { hat: [100, 56, .95], neck: [100, 134, .85] },
  fox: { hat: [100, 56, .95], neck: [100, 126, .85] }, horse: { hat: [100, 54, .85], neck: [100, 142, .85] }, deer: { hat: [100, 60, .9], neck: [100, 134, .85] },
  wolf: { hat: [100, 58, .95], neck: [100, 130, .85] }, dragon: { hat: [100, 60, .9], neck: [100, 134, .85] }, triceratops: { hat: [100, 60, .85], neck: [100, 134, .85] },
  stegosaurus: { hat: [100, 56, .85], neck: [100, 126, .85] }, longneck: { hat: [72, 30, .6], neck: [76, 82, .6] }, trex: { hat: [100, 48, 1], neck: [100, 130, .85] },
  turtle: { hat: [168, 106, .55], neck: [160, 146, .5] }, axolotl: { hat: [100, 68, 1], neck: [100, 138, .8] }, swan: { hat: [80, 38, .55], neck: [74, 92, .5] }, heron: { hat: [92, 37, .6], neck: [86, 86, .5] }
};
const WARDROBE = {
  bow: { slot: 'head', label: 'Big bow', cost: 15 }, beanie: { slot: 'head', label: 'Knit beanie', cost: 25 }, flowers: { slot: 'head', label: 'Flower crown', cost: 35 },
  grad: { slot: 'head', label: 'Graduation cap', cost: 40 }, crown: { slot: 'head', label: 'Golden crown', cost: 60 },
  glasses: { slot: 'face', label: 'Study glasses', cost: 20 }, shades: { slot: 'face', label: 'Sunglasses', cost: 30 },
  bowtie: { slot: 'neck', label: 'Bow tie', cost: 20 }, scarf: { slot: 'neck', label: 'Cosy scarf', cost: 25 }
};
const SLOTS = { head: 'Head', face: 'Eyes', neck: 'Neck' };
const TINTS = { natural: { label: 'Natural', deg: 0, sw: '#b9a27e' }, rose: { label: 'Rose', deg: -40, sw: '#e2a0b4' }, gold: { label: 'Gold', deg: 25, sw: '#e6c260' }, mint: { label: 'Mint', deg: 90, sw: '#8fcfaa' }, sky: { label: 'Sky', deg: 170, sw: '#8db8e0' }, lilac: { label: 'Lilac', deg: 230, sw: '#b9a2e0' } };
function cleanLook(l) {
  if (!l || typeof l !== 'object') return null;
  const o = {};
  Object.keys(SLOTS).forEach(sl => { if (WARDROBE[l[sl]] && WARDROBE[l[sl]].slot === sl) o[sl] = l[sl]; });
  if (TINTS[l.tint] && l.tint !== 'natural') o.tint = l.tint;
  return Object.keys(o).length ? o : null;
}
const myLook = (k = S.active) => cleanLook((S.pets[k] || {}).look);
function headItem(id, [x, y, s]) {
  const t = `transform="translate(${x} ${y}) scale(${s})"`;
  if (id === 'beanie') return `<g ${t}><path d="M-30 6 C-30 -22 -16 -34 0 -34 C16 -34 30 -22 30 6 Z" fill="#c95f5a" ${O2}/><path d="M-18 -24 L-14 4 M-6 -32 L-5 4 M6 -32 L5 4 M18 -24 L14 4" stroke="#a84843" stroke-width="2" stroke-linecap="round"/><rect x="-33" y="-2" width="66" height="12" rx="6" fill="#f3e6d2" ${O2}/><circle cx="0" cy="-37" r="7" fill="#f3e6d2" ${O2}/></g>`;
  if (id === 'grad') return `<g ${t}><path d="M-20 -10 L-20 6 C-8 12 8 12 20 6 L20 -10 Z" fill="#2e3a44" ${O2}/><path d="M-40 -14 L0 -29 L40 -14 L0 1 Z" fill="#3b4a56" ${O2}/><path d="M0 -14 L30 -10 L31 8" stroke="#e8b84a" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="31" cy="10" r="3.6" fill="#e8b84a" ${O2}/><circle cx="0" cy="-14" r="2.6" fill="#e8b84a"/></g>`;
  if (id === 'crown') return `<g ${t}><path d="M-24 6 L-28 -22 L-12 -8 L0 -28 L12 -8 L28 -22 L24 6 Z" fill="#f0c64e" ${O2}/><circle cx="0" cy="-4" r="3.6" fill="#d86a6a" ${O2}/><circle cx="-14" cy="-1" r="2.6" fill="#6aa0d8"/><circle cx="14" cy="-1" r="2.6" fill="#6aa0d8"/><circle cx="0" cy="-28" r="2.6" fill="#f7e3a0" ${O2}/></g>`;
  if (id === 'flowers') {
    const fl = [[-30, 6, '#f2a7b5'], [-16, -3, '#fbf8f1'], [0, -6, '#f4d06f'], [16, -3, '#fbf8f1'], [30, 6, '#f2a7b5']];
    return `<g ${t}><path d="M-34 10 C-20 -8 20 -8 34 10" fill="none" stroke="#7d9a52" stroke-width="3.5" stroke-linecap="round"/>${fl.map(([fx, fy, c]) => `<g transform="translate(${fx} ${fy})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-5" rx="3.6" ry="5" fill="${c}" stroke="${INK}" stroke-width="1.6" transform="rotate(${a})"/>`).join('')}<circle r="2.8" fill="#e8b84a" stroke="${INK}" stroke-width="1.4"/></g>`).join('')}</g>`;
  }
  if (id === 'bow') return `<g ${t}><g transform="translate(20 0) rotate(18)"><path d="M0 0 C-10 -16 -28 -14 -26 0 C-28 14 -10 16 0 0 Z" fill="#e27d97" ${O2}/><path d="M0 0 C10 -16 28 -14 26 0 C28 14 10 16 0 0 Z" fill="#e27d97" ${O2}/><circle r="5.5" fill="#c95f7a" ${O2}/></g></g>`;
  return '';
}
function neckItem(id, [x, y, s]) {
  const t = `transform="translate(${x} ${y}) scale(${s})"`;
  if (id === 'bowtie') return `<g ${t}><path d="M0 0 L-17 -10 L-17 10 Z M0 0 L17 -10 L17 10 Z" fill="#3b5f8a" ${O2}/><circle r="4.6" fill="#2e4b70" ${O2}/></g>`;
  if (id === 'scarf') return `<g ${t}><path d="M12 4 L22 32 L8 34 L3 8 Z" fill="#d9874f" ${O2}/><path d="M-32 -6 C-14 6 14 6 32 -6 L32 6 C14 18 -14 18 -32 6 Z" fill="#e9a35f" ${O2}/><path d="M-20 2 L-20 12 M-6 5 L-6 15 M8 5 L8 15 M22 1 L22 11" stroke="#c06f37" stroke-width="2"/></g>`;
  return '';
}
function faceItem(id, f) {
  if (f.eyes.length < 2) return '';
  const r = f.er * 2.1, [[x1, y1], [x2, y2]] = f.eyes, fill = id === 'shades' ? '#2e2a28' : 'rgba(255,255,255,.22)';
  const lens = (x, y) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${INK}" stroke-width="2.4"/>${id === 'shades' ? `<path d="M${x - r * .5} ${y - r * .3} Q${x - r * .2} ${y - r * .65} ${x + r * .2} ${y - r * .6}" stroke="#fff" stroke-width="1.6" fill="none" opacity=".7" stroke-linecap="round"/>` : ''}`;
  return `<g class="acc-face">${lens(x1, y1)}${lens(x2, y2)}<path d="M${x1 + r} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - r * .35} ${x2 - r} ${y2}" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>`;
}
function lookLayers(kind, look) {
  const a = ANCHORS[kind], l = cleanLook(look); if (!l || !a) return { under: '', over: '' };
  return { over: (l.neck ? neckItem(l.neck, a.neck) : '') + (l.face ? faceItem(l.face, ANIMALS[kind].face) : '') + (l.head ? headItem(l.head, a.hat) : '') };
}
const tintFilter = look => { const l = cleanLook(look); return l && l.tint ? ` filter="url(#tint-${l.tint})"` : ''; };

/* the dress-up window in Sanctuary */
let dressFor = null, tryOn = null;
function openDress(k) { dressFor = k; tryOn = null; renderDress(); $('#dressModal').classList.add('on'); }
function closeDress() { $('#dressModal').classList.remove('on'); dressFor = null; tryOn = null; }
function renderDress() {
  const k = dressFor; if (!k) return;
  const p = S.pets[k], cur = cleanLook(p.look) || {}, view = { ...cur, ...(tryOn || {}) }, own = S.wardrobe || [];
  const tile = (slot, id) => {
    const it = WARDROBE[id], on = id === 'none' ? !view[slot] : view[slot] === id, has = id === 'none' || own.includes(id);
    const prev = id === 'none' ? '' : avatarSVG(k, 'awake', { ...view, [slot]: id });
    return `<button type="button" class="dress-tile ${on ? 'on' : ''}" data-dsel="${slot}:${id}" aria-pressed="${on}">${id === 'none' ? `<span class="dress-none">${icon('i-x')}</span>` : `<span class="dress-av">${prev}</span>`}<b>${id === 'none' ? 'None' : it.label}</b><small>${id === 'none' ? '&nbsp;' : has ? 'Yours' : `${icon('i-coin')}${it.cost}`}</small></button>`;
  };
  const pending = tryOn && Object.entries(tryOn).find(([, id]) => !own.includes(id));
  const name = p.name || ANIMALS[k].label;
  $('#dressBox').innerHTML = `<div class="row" style="justify-content:space-between; flex-wrap:nowrap"><div><span class="eyebrow">Wardrobe</span><h2>Dress up ${esc(name)}</h2></div><button class="icon-btn" data-dclose aria-label="Close">${icon('i-x')}</button></div>
    <div class="dress">
      <div class="dress-pic">${animalSVG(k, 'happy', { look: view, label: name })}</div>
      <div class="dress-opts">
        ${Object.entries(SLOTS).map(([slot, lab]) => `<div><span class="eyebrow">${lab}</span><div class="dress-row">${tile(slot, 'none')}${Object.keys(WARDROBE).filter(id => WARDROBE[id].slot === slot).map(id => tile(slot, id)).join('')}</div></div>`).join('')}
        <div><span class="eyebrow">Colour · free</span><div class="dress-tints">${Object.entries(TINTS).map(([t, v]) => `<button type="button" class="tint ${(view.tint || 'natural') === t ? 'on' : ''}" data-dtint="${t}" aria-pressed="${(view.tint || 'natural') === t}"><i style="background:${v.sw}"></i>${v.label}</button>`).join('')}</div><p class="muted" style="font-size:.76rem; margin:6px 0 0">Colours show best on colourful animals. White and grey fur stays the same.</p></div>
      </div>
    </div>
    <div class="row" style="justify-content:flex-end">${pending ? `<span class="muted" style="font-size:.84rem">Trying on the ${WARDROBE[pending[1]].label.toLowerCase()}. You have ${S.coins} coins.</span><button class="btn" data-dcancel>Take it off</button><button class="btn primary" data-dbuy ${S.coins < WARDROBE[pending[1]].cost ? 'disabled' : ''}>${icon('i-coin')}Buy for ${WARDROBE[pending[1]].cost}</button>` : `<span class="muted" style="font-size:.84rem">Bought items work on every animal.</span><button class="btn primary" data-dclose>Done</button>`}</div>`;
}
function setLook(k, look) {
  S.pets[k].look = cleanLook(look); save();
  renderZoo(); renderAll(); if (k === S.active) publishPond();
}
function bindDress() {
  $('#dressModal').addEventListener('click', e => {
    if (e.target.id === 'dressModal' || e.target.closest('[data-dclose]')) { closeDress(); return; }
    const k = dressFor; if (!k) return;
    const cur = cleanLook(S.pets[k].look) || {};
    const sel = e.target.closest('[data-dsel]');
    if (sel) {
      const [slot, id] = sel.dataset.dsel.split(':');
      if (id === 'none') { tryOn = null; delete cur[slot]; setLook(k, cur); }
      else if ((S.wardrobe || []).includes(id)) { tryOn = null; if (cur[slot] === id) delete cur[slot]; else cur[slot] = id; setLook(k, cur); }
      else tryOn = { [slot]: id };
      renderDress(); return;
    }
    const tn = e.target.closest('[data-dtint]'); if (tn) { cur.tint = tn.dataset.dtint; setLook(k, cur); renderDress(); return; }
    if (e.target.closest('[data-dcancel]')) { tryOn = null; renderDress(); return; }
    if (e.target.closest('[data-dbuy]') && tryOn) {
      const [slot, id] = Object.entries(tryOn)[0], it = WARDROBE[id];
      if (S.coins < it.cost) return;
      S.coins -= it.cost; S.wardrobe = [...new Set([...(S.wardrobe || []), id])]; cur[slot] = id; tryOn = null;
      setLook(k, cur); renderChips(); renderDress(); toast(`The ${it.label.toLowerCase()} is yours. It fits every animal.`);
    }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && dressFor) closeDress(); });
}
