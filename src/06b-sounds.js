/* ---------- sounds: made in the browser with Web Audio, no files ---------- */
const SOUNDS = {
  rain: { label: 'Rain', note: 'Soft rain on the lily pads', cost: 0, icon: '<path d="M7 4c-2 3-3 4.6-3 6a3 3 0 0 0 6 0c0-1.4-1-3-3-6zM16 9c-2 3-3 4.6-3 6a3 3 0 0 0 6 0c0-1.4-1-3-3-6z"/>' },
  ocean: { label: 'Ocean', note: 'Slow waves on the shore', cost: 30, icon: '<path d="M2 9c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/>' },
  forest: { label: 'Forest', note: 'Wind in the trees and birds', cost: 40, icon: '<path d="M12 3 5 13h4l-3 5h12l-3-5h4zM12 18v3"/>' },
  fire: { label: 'Fireplace', note: 'A warm crackling fire', cost: 60, icon: '<path d="M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-2.6 1.6-3.8 2.6-5.2.4 1.6 1.2 2.4 2.4 2.8C11.6 8.2 11.4 5.6 12 3z"/>' },
  cafe: { label: 'Café', note: 'Quiet chatter and cups', cost: 80, icon: '<path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3c-1 1.4 1 2 0 3.5M12 3c-1 1.4 1 2 0 3.5"/>' },
  quran: { label: 'Quran', note: 'Recitation, free for everyone', cost: 0, media: true, icon: '<path d="M12 6.5C10 5 7 4.6 4 5v13c3-.4 6 0 8 1.5 2-1.5 5-1.9 8-1.5V5c-3-.4-6 0-8 1.5zM12 6.5v13"/>' },
  link: { label: 'Your own link', note: 'YouTube, Spotify, SoundCloud or audio', cost: 0, media: true, icon: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>' }
};
// full recitations served by mp3quran.net, one file per surah
const RECITERS = { afs: { name: 'Mishary Alafasy', base: 'https://server8.mp3quran.net/afs/' }, sds: { name: 'Abdul Rahman Al-Sudais', base: 'https://server11.mp3quran.net/sds/' }, maher: { name: 'Maher Al-Muaiqly', base: 'https://server12.mp3quran.net/maher/' } };
const SURAHS = 'Al-Fatihah,Al-Baqarah,Al Imran,An-Nisa,Al-Maidah,Al-Anam,Al-Araf,Al-Anfal,At-Tawbah,Yunus,Hud,Yusuf,Ar-Rad,Ibrahim,Al-Hijr,An-Nahl,Al-Isra,Al-Kahf,Maryam,Ta-Ha,Al-Anbiya,Al-Hajj,Al-Muminun,An-Nur,Al-Furqan,Ash-Shuara,An-Naml,Al-Qasas,Al-Ankabut,Ar-Rum,Luqman,As-Sajdah,Al-Ahzab,Saba,Fatir,Ya-Sin,As-Saffat,Sad,Az-Zumar,Ghafir,Fussilat,Ash-Shura,Az-Zukhruf,Ad-Dukhan,Al-Jathiyah,Al-Ahqaf,Muhammad,Al-Fath,Al-Hujurat,Qaf,Adh-Dhariyat,At-Tur,An-Najm,Al-Qamar,Ar-Rahman,Al-Waqiah,Al-Hadid,Al-Mujadilah,Al-Hashr,Al-Mumtahanah,As-Saff,Al-Jumuah,Al-Munafiqun,At-Taghabun,At-Talaq,At-Tahrim,Al-Mulk,Al-Qalam,Al-Haqqah,Al-Maarij,Nuh,Al-Jinn,Al-Muzzammil,Al-Muddaththir,Al-Qiyamah,Al-Insan,Al-Mursalat,An-Naba,An-Naziat,Abasa,At-Takwir,Al-Infitar,Al-Mutaffifin,Al-Inshiqaq,Al-Buruj,At-Tariq,Al-Ala,Al-Ghashiyah,Al-Fajr,Al-Balad,Ash-Shams,Al-Layl,Ad-Duha,Ash-Sharh,At-Tin,Al-Alaq,Al-Qadr,Al-Bayyinah,Az-Zalzalah,Al-Adiyat,Al-Qariah,At-Takathur,Al-Asr,Al-Humazah,Al-Fil,Quraysh,Al-Maun,Al-Kawthar,Al-Kafirun,An-Nasr,Al-Masad,Al-Ikhlas,Al-Falaq,An-Nas'.split(',');
// turns a pasted link into something we can play: an embedded player or a plain audio file
function parseSoundLink(raw) {
  let u; try { u = new URL(String(raw || '').trim()); } catch (e) { return null; }
  if (u.protocol !== 'https:') return null;
  const h = u.hostname.replace(/^www\.|^m\./, '');
  if (h === 'youtube.com' || h === 'music.youtube.com' || h === 'youtu.be') {
    const list = u.searchParams.get('list'), id = h === 'youtu.be' ? u.pathname.slice(1) : u.searchParams.get('v') || (u.pathname.match(/^\/(?:shorts|live|embed)\/([\w-]{6,})/) || [])[1];
    if (list && /^[\w-]+$/.test(list)) return { kind: 'embed', src: `https://www.youtube-nocookie.com/embed/videoseries?list=${list}&autoplay=1&loop=1`, h: 200 };
    if (id && /^[\w-]{6,20}$/.test(id)) return { kind: 'embed', src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&loop=1&playlist=${id}`, h: 200 };
    return null;
  }
  if (h === 'open.spotify.com') { const m = u.pathname.match(/\/(track|playlist|album|episode|show)\/([A-Za-z0-9]+)/); return m ? { kind: 'embed', src: `https://open.spotify.com/embed/${m[1]}/${m[2]}`, h: m[1] === 'track' || m[1] === 'episode' ? 152 : 352, note: 'Press play in the Spotify player.' } : null; }
  if (h === 'soundcloud.com' || h === 'on.soundcloud.com') return { kind: 'embed', src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(u.href)}&auto_play=true&visual=false`, h: 166 };
  return { kind: 'audio', src: u.href };
}
const SND = { ctx: null, master: null, bufs: null, stopFn: null, playing: null, audio: null };
const sndOwned = k => SOUNDS[k].cost === 0 || S.sounds.owned.includes(k);

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
function sndVolume() { if (SND.master) SND.master.gain.value = Math.pow(S.sounds.vol, 1.6) * .9; if (SND.audio) SND.audio.volume = Math.min(1, S.sounds.vol); }
function mediaStop() {
  if (SND.audio) { SND.audio.onended = SND.audio.onerror = null; SND.audio.pause(); SND.audio.removeAttribute('src'); SND.audio.load(); SND.audio = null; }
  const em = $('#sndEmbed'); if (em) em.innerHTML = '';
}
function playAudio(src, onEnd) {
  const a = new Audio(); a.preload = 'auto'; a.src = src; SND.audio = a; sndVolume();
  a.onended = onEnd || (() => { a.currentTime = 0; a.play().catch(() => {}); });
  a.onerror = () => { if (SND.audio !== a) return; toast('That audio could not be played. Check the link or your connection.'); sndStop(); };
  a.play().catch(() => {});
}
function mediaPlay(kind) {
  mediaStop();
  if (kind === 'quran') {
    const q = S.sounds.quran, r = RECITERS[q.reciter] || RECITERS.afs;
    const next = () => { q.surah = q.surah >= 114 ? 1 : q.surah + 1; save(); renderSounds(); mediaPlay('quran'); };
    playAudio(r.base + String(q.surah).padStart(3, '0') + '.mp3', next);
    return true;
  }
  const L = parseSoundLink(S.sounds.link);
  if (!L) { toast('Paste a YouTube, Spotify, SoundCloud or audio link first.'); return false; }
  if (L.kind === 'audio') { playAudio(L.src); return true; }
  $('#sndEmbed').innerHTML = `<iframe src="${esc(L.src)}" height="${L.h}" allow="autoplay; encrypted-media; clipboard-write" loading="lazy" title="Your sound" referrerpolicy="strict-origin-when-cross-origin"></iframe>${L.note ? `<p class="muted" style="font-size:.78rem; margin:6px 0 0">${L.note}</p>` : ''}`;
  return true;
}
function sndPlay(kind) {
  try {
    if (SND.stopFn) SND.stopFn();
    SND.stopFn = null; mediaStop();
    if (SOUNDS[kind].media) { SND.playing = mediaPlay(kind) ? kind : null; renderSounds(); return; }
    sndCtx(); sndVolume();
    SND.stopFn = sndBuild(kind); SND.playing = kind;
  } catch (e) { SND.stopFn = null; SND.playing = null; toast('Sounds are not available in this browser.'); }
  renderSounds();
}
function sndStop() { if (SND.stopFn) SND.stopFn(); SND.stopFn = null; mediaStop(); SND.playing = null; renderSounds(); }
function sndOnFocus(started) {
  if (!S.sounds.withFocus) return;
  if (started) sndPlay(S.sounds.pick); else sndStop();
}

function renderSounds() {
  const box = $('#sndList'); if (!box) return;
  const ss = S.sounds;
  if (!SOUNDS[ss.pick]) ss.pick = 'rain';
  box.innerHTML = Object.entries(SOUNDS).map(([k, s]) => {
    const own = sndOwned(k), on = SND.playing === k, sel = ss.pick === k;
    return `<div class="snd ${sel ? 'sel' : ''} ${own ? '' : 'locked'}">
      <button class="snd-main" data-snd="${k}" ${own ? '' : 'disabled'} aria-pressed="${on}" aria-label="${on ? 'Stop' : 'Play'} ${s.label}">
        <span class="snd-ic ${on ? 'on' : ''}"><svg viewBox="0 0 24 24" aria-hidden="true">${s.icon}</svg></span>
        <span class="snd-t"><b>${s.label}</b><small>${on ? (k === 'quran' ? `Playing ${esc(SURAHS[ss.quran.surah - 1])}` : 'Playing now') : s.note}</small></span>
        ${own ? `<span class="snd-act">${icon(on ? 'i-pause' : 'i-play')}</span>` : ''}
      </button>
      ${own ? '' : `<button class="btn small ${S.coins >= s.cost ? 'primary' : ''}" data-sndbuy="${k}" ${S.coins >= s.cost ? '' : 'disabled'}>${icon('i-coin')}${s.cost}</button>`}
    </div>`;
  }).join('');
  const ex = $('#sndExtra');
  if (ss.pick === 'quran') ex.innerHTML = `<div class="snd-opts"><label class="f">Reciter<select class="inp" id="qReciter">${Object.entries(RECITERS).map(([k, r]) => `<option value="${k}" ${ss.quran.reciter === k ? 'selected' : ''}>${r.name}</option>`).join('')}</select></label><label class="f">Surah<select class="inp" id="qSurah">${SURAHS.map((n, i) => `<option value="${i + 1}" ${ss.quran.surah === i + 1 ? 'selected' : ''}>${i + 1}. ${n}</option>`).join('')}</select></label></div><p class="muted" style="font-size:.78rem; margin:6px 0 0">Plays on to the next surah by itself.</p>`;
  else if (ss.pick === 'link') ex.innerHTML = `<form class="snd-opts link" id="sndLinkForm"><input class="inp" id="sndLink" type="url" maxlength="500" placeholder="Paste a YouTube, Spotify or SoundCloud link" value="${esc(ss.link || '')}" aria-label="Sound link"><button class="btn small primary" type="submit">${icon('i-play')}Play</button></form>`;
  else ex.innerHTML = '';
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
  $('#sndExtra').addEventListener('change', e => {
    if (e.target.id === 'qReciter' || e.target.id === 'qSurah') { S.sounds.quran = { reciter: RECITERS[$('#qReciter').value] ? $('#qReciter').value : 'afs', surah: Math.max(1, Math.min(114, +$('#qSurah').value || 1)) }; save(); if (SND.playing === 'quran') sndPlay('quran'); }
  });
  $('#sndExtra').addEventListener('submit', e => {
    if (e.target.id !== 'sndLinkForm') return; e.preventDefault();
    const v = $('#sndLink').value.trim();
    if (!parseSoundLink(v)) { toast('That link did not work. Paste a full link that starts with https://'); return; }
    S.sounds.link = clampStr(v, 500); save(); sndPlay('link');
  });
  $('#sndVol').addEventListener('input', e => { S.sounds.vol = Math.max(0, Math.min(1, +e.target.value / 100)); sndVolume(); });
  $('#sndVol').addEventListener('change', () => save());
  $('#sndWith').onclick = () => { S.sounds.withFocus = !S.sounds.withFocus; save(); renderSounds(); };
}
