/* ---------- sounds: made in the browser with Web Audio, no files ---------- */
const SOUNDS = {
  rain: { label: 'Rain', note: 'Soft rain on the lily pads', cost: 0, icon: '<path d="M7 4c-2 3-3 4.6-3 6a3 3 0 0 0 6 0c0-1.4-1-3-3-6zM16 9c-2 3-3 4.6-3 6a3 3 0 0 0 6 0c0-1.4-1-3-3-6z"/>' },
  ocean: { label: 'Ocean', note: 'Slow waves on the shore', cost: 30, icon: '<path d="M2 9c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/>' },
  forest: { label: 'Forest', note: 'Wind in the trees and birds', cost: 40, icon: '<path d="M12 3 5 13h4l-3 5h12l-3-5h4zM12 18v3"/>' },
  fire: { label: 'Fireplace', note: 'A warm crackling fire', cost: 60, icon: '<path d="M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2.6 1.6-3.8 2.6-5.2.4 1.6 1.2 2.4 2.4 2.8C11.6 8.2 11.4 5.6 12 3z"/>' },
  cafe: { label: 'Café', note: 'Quiet chatter and cups', cost: 80, icon: '<path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3c-1 1.4 1 2 0 3.5M12 3c-1 1.4 1 2 0 3.5"/>' }
};
const SND = { ctx: null, master: null, bufs: null, stopFn: null, playing: null };

function sndCtx() {
  if (!SND.ctx) {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    SND.ctx = audioCtx;
    SND.master = SND.ctx.createGain(); SND.master.connect(SND.ctx.destination);
  }
  SND.ctx.resume?.();
  return SND.ctx;
}
function noiseBuffers(ctx) {
  if (SND.bufs) return SND.bufs;
  const len = ctx.sampleRate * 4, mk = () => ctx.createBuffer(1, len, ctx.sampleRate);
  const w = mk(), p = mk(), b = mk(), wd = w.getChannelData(0), pd = p.getChannelData(0), bd = b.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0;
  for (let i = 0; i < len; i++) {
    const x = Math.random() * 2 - 1;
    wd[i] = x;
    b0 = .99886 * b0 + x * .0555179; b1 = .99332 * b1 + x * .0750759; b2 = .969 * b2 + x * .153852; b3 = .8665 * b3 + x * .3104856; b4 = .55 * b4 + x * .5329522; b5 = -.7616 * b5 - x * .016898;
    pd[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + x * .5362) * .11; b6 = x * .115926;
    last = (last + .02 * x) / 1.02; bd[i] = last * 3.5;
  }
  return (SND.bufs = { white: w, pink: p, brown: b });
}
function sndBuild(kind) {
  const ctx = sndCtx(), B = noiseBuffers(ctx), out = ctx.createGain(), nodes = [], timers = [];
  out.gain.value = 0; out.connect(SND.master);
  const src = (buf) => { const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.loopStart = Math.random() * 2; s.start(0, Math.random() * 3); nodes.push(s); return s; };
  const filt = (type, f, q) => { const n = ctx.createBiquadFilter(); n.type = type; n.frequency.value = f; if (q) n.Q.value = q; return n; };
  const gain = (v) => { const g = ctx.createGain(); g.gain.value = v; return g; };
  const chain = (...ns) => { for (let i = 0; i < ns.length - 1; i++) ns[i].connect(ns[i + 1]); return ns[ns.length - 1]; };
  const lfo = (hz, depth, target) => { const o = ctx.createOscillator(), g = gain(depth); o.frequency.value = hz; o.connect(g); g.connect(target); o.start(); nodes.push(o); };
  const every = (min, max, fn) => { let id; const go = () => { fn(); id = setTimeout(go, min + Math.random() * (max - min)); timers.push(id); }; id = setTimeout(go, min); timers.push(id); };
  const burst = (dur, type, f, q, v) => {
    const s = ctx.createBufferSource(); s.buffer = B.white; const n = filt(type, f, q), g = gain(0), t = ctx.currentTime;
    s.connect(n); n.connect(g); g.connect(out);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .002); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    s.start(t, Math.random() * 3); s.stop(t + dur + .05);
  };
  const tone = (f1, f2, dur, v, delay = 0) => {
    const o = ctx.createOscillator(), g = gain(0), t = ctx.currentTime + delay;
    o.type = 'sine'; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    o.connect(g); g.connect(out);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.start(t); o.stop(t + dur + .05);
  };
  if (kind === 'rain') {
    chain(src(B.brown), filt('highpass', 300), filt('lowpass', 5000), gain(.55), out);
    chain(src(B.white), filt('bandpass', 2800, .6), gain(.12), out);
    every(25, 110, () => burst(.012 + Math.random() * .02, 'bandpass', 1800 + Math.random() * 3500, 3, .04 + Math.random() * .12));
  } else if (kind === 'ocean') {
    const g = chain(src(B.brown), filt('lowpass', 650), gain(.5)); g.connect(out); lfo(.085, .42, g.gain);
    const f = chain(src(B.white), filt('lowpass', 2200), gain(.07)); f.connect(out); lfo(.085, .065, f.gain);
  } else if (kind === 'forest') {
    const bp = filt('bandpass', 700, .5); chain(src(B.pink), bp, gain(.5), out); lfo(.05, 380, bp.frequency);
    every(1800, 6500, () => { const n = 2 + Math.floor(Math.random() * 3), base = 2600 + Math.random() * 1800; for (let i = 0; i < n; i++) tone(base, base * (Math.random() < .5 ? 1.25 : .8), .09, .035, i * .14); });
  } else if (kind === 'fire') {
    chain(src(B.brown), filt('lowpass', 320), gain(.7), out);
    chain(src(B.pink), filt('bandpass', 1100, .8), gain(.06), out);
    every(30, 220, () => burst(.004 + Math.random() * .014, 'highpass', 1400 + Math.random() * 2000, .7, Math.random() < .08 ? .5 : .05 + Math.random() * .16));
  } else if (kind === 'cafe') {
    chain(src(B.brown), filt('lowpass', 450), gain(.4), out);
    const babble = chain(src(B.pink), filt('bandpass', 650, 1.1), gain(.12)); babble.connect(out); lfo(.31, .05, babble.gain); lfo(.17, .04, babble.gain);
    every(3500, 9000, () => { tone(2700, 2650, .5, .025); tone(3950, 3900, .4, .015, .01); });
  }
  const t = ctx.currentTime; out.gain.setValueAtTime(0, t); out.gain.linearRampToValueAtTime({ rain: 1.7, ocean: .9, forest: 2.8, fire: 1.1, cafe: 1.8 }[kind] || 1, t + 1.2);
  return () => {
    timers.forEach(clearTimeout);
    const n = ctx.currentTime; out.gain.cancelScheduledValues(n); out.gain.setValueAtTime(out.gain.value, n); out.gain.linearRampToValueAtTime(0, n + .6);
    setTimeout(() => { nodes.forEach(x => { try { x.stop(); } catch (e) {} }); out.disconnect(); }, 800);
  };
}
function sndVolume() { if (SND.master) SND.master.gain.value = Math.pow(S.sounds.vol, 1.6) * .9; }
function sndPlay(kind) {
  try {
    if (SND.stopFn) SND.stopFn();
    sndCtx(); sndVolume();
    SND.stopFn = sndBuild(kind); SND.playing = kind;
  } catch (e) { SND.stopFn = null; SND.playing = null; toast('Sounds are not available in this browser.'); }
  renderSounds();
}
function sndStop() { if (SND.stopFn) SND.stopFn(); SND.stopFn = null; SND.playing = null; renderSounds(); }
function sndOnFocus(started) {
  if (!S.sounds.withFocus) return;
  if (started) sndPlay(S.sounds.pick); else sndStop();
}

function renderSounds() {
  const box = $('#sndList'); if (!box) return;
  const ss = S.sounds;
  box.innerHTML = Object.entries(SOUNDS).map(([k, s]) => {
    const own = ss.owned.includes(k), on = SND.playing === k, sel = ss.pick === k;
    return `<div class="snd ${sel ? 'sel' : ''} ${own ? '' : 'locked'}">
      <button class="snd-main" data-snd="${k}" ${own ? '' : 'disabled'} aria-pressed="${on}" aria-label="${on ? 'Stop' : 'Play'} ${s.label}">
        <span class="snd-ic ${on ? 'on' : ''}"><svg viewBox="0 0 24 24" aria-hidden="true">${s.icon}</svg></span>
        <span class="snd-t"><b>${s.label}</b><small>${on ? 'Playing now' : s.note}</small></span>
        ${own ? `<span class="snd-act">${icon(on ? 'i-pause' : 'i-play')}</span>` : ''}
      </button>
      ${own ? '' : `<button class="btn small ${S.coins >= s.cost ? 'primary' : ''}" data-sndbuy="${k}" ${S.coins >= s.cost ? '' : 'disabled'}>${icon('i-coin')}${s.cost}</button>`}
    </div>`;
  }).join('');
  $('#sndVol').value = Math.round(ss.vol * 100);
  $('#sndWith').setAttribute('aria-checked', !!ss.withFocus);
}
function bindSounds() {
  $('#sndList').addEventListener('click', e => {
    const b = e.target.closest('[data-sndbuy]');
    if (b) {
      const k = b.dataset.sndbuy, s = SOUNDS[k];
      if (S.coins < s.cost || S.sounds.owned.includes(k)) return;
      S.coins -= s.cost; S.sounds.owned.push(k); S.sounds.pick = k; save(); renderChips();
      toast(`${s.label} is yours. Tap it to play.`); renderSounds(); return;
    }
    const p = e.target.closest('[data-snd]');
    if (p) {
      const k = p.dataset.snd;
      if (SND.playing === k) { sndStop(); return; }
      S.sounds.pick = k; save(); sndPlay(k);
    }
  });
  $('#sndVol').addEventListener('input', e => { S.sounds.vol = Math.max(0, Math.min(1, +e.target.value / 100)); sndVolume(); });
  $('#sndVol').addEventListener('change', () => save());
  $('#sndWith').onclick = () => { S.sounds.withFocus = !S.sounds.withFocus; save(); renderSounds(); };
}
