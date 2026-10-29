/* ---------- feedback ---------- */
const FB_AREAS = ['Focus timer', 'Pebbles', 'The Pond', 'Together', 'Commons', 'Sanctuary', 'Journal', 'Look and feel', 'Something else'];
const FB_WORDS = ['Not for me yet', 'Needs work', 'Okay', 'Really nice', 'Love it'];
let fbRating = 0, fbArea = '', fbSent = false;
function padIcon(on) {
  return `<svg viewBox="0 0 44 28" aria-hidden="true"><path d="M22 16 L34 9 A20 9 0 1 1 26 7.5 Z" fill="${on ? 'var(--pad)' : 'none'}" stroke="${on ? 'var(--pad-2)' : 'var(--line-2)'}" stroke-width="2" stroke-linejoin="round"/>${on ? `<g transform="translate(14 13)"><path d="M0 0 C-4 -2 -5 -7 -2 -9 C-1 -6 0 -4 0 0 Z M0 0 C4 -2 5 -7 2 -9 C1 -6 0 -4 0 0 Z M0 0 C-2 -4 -1.5 -8 0 -10 C1.5 -8 2 -4 0 0 Z" fill="var(--bloom)" stroke="${INK}" stroke-width="1"/></g>` : ''}</svg>`;
}
function feedbackTarget() { return NET.db || NET.anonDb || null; }
function renderFeedback() {
  $('#fbRate').innerHTML = [1, 2, 3, 4, 5].map(n => `<button type="button" role="radio" aria-checked="${fbRating === n}" data-rate="${n}" title="${FB_WORDS[n - 1]}">${padIcon(n <= fbRating)}<span>${n}</span></button>`).join('')
    + `<span class="hand" style="align-self:center; color:var(--rose); font-size:1.4rem">${fbRating ? FB_WORDS[fbRating - 1] : ''}</span>`;
  $('#fbArea').innerHTML = FB_AREAS.map(a => `<button type="button" class="cchip" data-area="${esc(a)}" aria-pressed="${fbArea === a}">${esc(a)}</button>`).join('');
  if (!$('#fbName').value && S.profile.name) $('#fbName').value = S.profile.name;
  $('#fbSide').innerHTML = fbSent
    ? `<div class="pic">${animalSVG(S.active, 'happy', { look: myLook() })}</div><h3 style="text-align:center">Thank you</h3><p class="muted" style="text-align:center; font-size:.88rem; margin-top:6px">${esc(petName())} delivered your note to the team. You can send another any time.</p>`
    : `<div class="pic">${animalSVG(S.active, 'awake', { look: myLook() })}</div><p class="hand" style="text-align:center; font-size:1.45rem; margin-top:4px">Every note helps us make the pond calmer.</p>`;
  $('#fbNote').textContent = feedbackTarget() ? '' : (NET.web ? 'Feedback starts working once the site is connected to its database.' : 'Feedback is saved on this device for now.');
}
function bindFeedback() {
  $('#fbRate').onclick = e => { const b = e.target.closest('[data-rate]'); if (!b) return; fbRating = +b.dataset.rate; renderFeedback(); };
  $('#fbArea').onclick = e => { const b = e.target.closest('[data-area]'); if (!b) return; fbArea = fbArea === b.dataset.area ? '' : b.dataset.area; renderFeedback(); };
  $('#fbForm').onsubmit = async e => {
    e.preventDefault();
    const like = $('#fbLike').value.trim(), improve = $('#fbImprove').value.trim();
    if (!fbRating && !like && !improve) { toast('Pick a rating or write a line before sending.'); return; }
    let last = 0; try { last = +localStorage.getItem('grind.fbAt') || 0; } catch (err) {}
    if (Date.now() - last < 30000) { toast('Thanks! Give it half a minute before sending another.'); return; }
    const doc = { rating: fbRating, area: fbArea, like: clampStr(like, 2000), improve: clampStr(improve, 2000), name: clampStr($('#fbName').value.trim(), 40), contact: clampStr($('#fbContact').value.trim(), 80), at: Date.now(), page: NET.web ? 'web' : 'claude', by: NET.uid || '' };
    const db = feedbackTarget();
    const btn = $('#fbForm button[type=submit]'); btn.disabled = true;
    try {
      if (db) await db.collection('feedback').doc().set(doc);
      else { S.localFeedback = [...(S.localFeedback || []), doc]; save(); }
      try { localStorage.setItem('grind.fbAt', String(Date.now())); } catch (err) {}
      fbSent = true; fbRating = 0; fbArea = '';
      $('#fbLike').value = ''; $('#fbImprove').value = ''; $('#fbContact').value = '';
      renderFeedback(); toast(db ? 'Feedback sent. Thank you!' : 'Saved on this device.', `<span style="width:30px;height:30px;flex:none">${avatarSVG(S.active, 'happy')}</span>`);
      loadInbox();
    } catch (err) {
      toast('Your feedback could not be sent. Check your connection and try again.');
    }
    btn.disabled = false;
  };
  $('#fbInbox').addEventListener('click', async e => {
    const c = e.target.closest('[data-fbcopy]');
    if (c) { const txt = (NET.inbox || []).map(f => `${new Date(f.at).toLocaleString()} | ${f.rating || '-'}/5 | ${f.area || ''}\nLikes: ${f.like}\nChange: ${f.improve}\nFrom: ${f.name || 'anonymous'} ${f.contact || ''}`).join('\n\n'); try { await navigator.clipboard.writeText(txt); toast('All feedback copied.'); } catch (err) { toast('Copy is not available here.'); } return; }
    const d = e.target.closest('[data-fbdel]');
    if (d) { const id = d.dataset.fbdel; try { await NET.db.doc('feedback/' + id).delete(); NET.inbox = NET.inbox.filter(f => f.id !== id); renderInbox(); } catch (err) { toast('That note could not be removed.'); } return; }
    if (e.target.closest('[data-fbreload]')) loadInbox();
  });
}
/* Only the site owner can read feedback: the database refuses everyone else, and then the inbox stays hidden. */
async function loadInbox() {
  const box = $('#fbInbox');
  if (!NET.web || !NET.db) { box.innerHTML = ''; return; }
  try {
    const s = await NET.db.collection('feedback').orderBy('at', 'desc').limit(300).get();
    NET.inbox = s.docs.map(d => { const f = d.data() || {}; return { id: d.id, rating: Math.max(0, Math.min(5, +f.rating || 0)), area: clampStr(f.area, 40), like: clampStr(f.like, 2000), improve: clampStr(f.improve, 2000), name: clampStr(f.name, 40), contact: clampStr(f.contact, 80), at: +f.at || 0 }; });
    renderInbox();
  } catch (err) { box.innerHTML = ''; }
}
function renderInbox() {
  const fs = NET.inbox || [], rated = fs.filter(f => f.rating);
  const avg = rated.length ? (rated.reduce((a, f) => a + f.rating, 0) / rated.length) : 0;
  const areas = {}; fs.forEach(f => { if (f.area) areas[f.area] = (areas[f.area] || 0) + 1; });
  const top = Object.entries(areas).sort((a, b) => b[1] - a[1]);
  $('#fbInbox').innerHTML = `<div class="card"><div class="card-h"><div><h2>Your feedback inbox</h2><p class="muted" style="font-size:.84rem">Only you can see this.</p></div><div class="row"><button class="btn small" data-fbreload>Refresh</button><button class="btn small" data-fbcopy ${fs.length ? '' : 'disabled'}>Copy all</button></div></div>
    <div class="kpis" style="margin-bottom:14px"><div class="kpi"><b>${fs.length}</b><span>Notes received</span></div><div class="kpi"><b>${avg ? avg.toFixed(1) : '–'}<small>/ 5</small></b><span>Average rating</span></div><div class="kpi"><b style="font-size:1.2rem">${top.length ? esc(top[0][0]) : '–'}</b><span>Most mentioned part</span></div></div>
    ${fs.length ? fs.map(f => `<div class="fb-item"><div class="row" style="justify-content:space-between"><span class="row" style="gap:6px">${f.rating ? `<span class="pill" style="background:var(--pad); color:#fff">${f.rating} / 5 · ${FB_WORDS[f.rating - 1]}</span>` : ''}${f.area ? `<span class="pill">${esc(f.area)}</span>` : ''}<span class="muted" style="font-size:.8rem">${f.at ? new Date(f.at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : ''}</span></span><button class="btn small quiet" data-fbdel="${esc(f.id)}">Remove</button></div>
      ${f.like ? `<span class="lbl">Likes</span><p>${esc(f.like)}</p>` : ''}${f.improve ? `<span class="lbl">Change or add</span><p>${esc(f.improve)}</p>` : ''}
      <span class="muted" style="font-size:.82rem">From ${esc(f.name || 'someone anonymous')}${f.contact ? ' · ' + esc(f.contact) : ''}</span></div>`).join('') : '<p class="muted">No feedback yet. Share the link and notes will appear here.</p>'}</div>`;
}
