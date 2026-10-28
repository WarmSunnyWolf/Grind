/* ---------- notification center ---------- */
function collectNotes() {
  const out = [];
  NET.ripples.forEach(r => out.push(r.kind === 'friend'
    ? { at: r.at, kind: 'friend', who: r.name, animal: r.animal, from: r.from, text: 'added you as a friend.' }
    : { at: r.at, kind: 'ripple', who: r.name, animal: r.animal, from: r.from, text: `sent you a ripple: “${r.msg}”` }));
  const me = NET.uid;
  if (me) (NET.posts || []).filter(p => p.by === me).forEach(p => {
    p.comments.filter(c => c.by !== me).forEach(c => out.push({ at: c.at, kind: 'comment', who: c.name, animal: 'frog', text: `commented on “${p.title}”: “${c.text}”` }));
    const n = p.likes.filter(x => x !== me).length, seen = (S.seenLikes || {})[p.id] || 0;
    if (n > seen) out.push({ at: Date.now(), kind: 'like', unread: true, who: '', animal: S.active, text: `${n - seen} new ${n - seen === 1 ? 'like' : 'likes'} on “${p.title}”. ${n} in total.` });
  });
  out.forEach(n => { if (n.unread === undefined) n.unread = n.at > (S.seenNote || 0); });
  return out.sort((a, b) => b.at - a.at).slice(0, 40);
}
function renderNotes() {
  const btn = $('#noteBtn'); if (!btn) return;
  const list = collectNotes(), unread = list.filter(n => n.unread).length;
  $('#noteBadge').hidden = !unread; $('#noteBadge').textContent = unread > 9 ? '9+' : unread;
  btn.setAttribute('aria-label', unread ? `Notifications, ${unread} new` : 'Notifications');
  const panel = $('#notePanel'); if (panel.hidden) return;
  let body;
  if (!NET.db) body = `<div class="note-empty"><p>Sign in to hear from classmates: ripples, new friends, likes and comments.</p>${NET.web && NET.fbReady ? '<button class="btn small primary" data-signin>Sign in with Google</button>' : ''}</div>`;
  else if (!list.length) body = `<div class="note-empty"><p>Nothing yet. Ripples, new friends, likes and comments on your posts will show up here.</p></div>`;
  else body = `<ul class="note-list">${list.map(n => {
    const act = n.kind === 'friend' ? (S.friends.includes(n.from) ? '<span class="muted" style="font-size:.78rem">Friends</span>' : `<button class="btn small primary" data-noteadd="${esc(n.from)}">Add back</button>`)
      : n.kind === 'ripple' ? `<button class="btn small" data-notego="pond">Pond</button>` : `<button class="btn small" data-notego="commons">See post</button>`;
    const pic = n.kind === 'like' ? `<span class="av note-ic">${icon('i-heart')}</span>` : n.kind === 'comment' ? `<span class="av note-ic">${icon('i-comment')}</span>` : `<span class="av">${avatarSVG(n.animal, 'happy')}</span>`;
    return `<li class="${n.unread ? 'new' : ''}">${pic}<span class="note-t">${n.who ? `<b>${esc(n.who)}</b> ` : ''}${esc(n.text)}<small>${n.kind === 'like' ? 'just now' : ago(n.at)}</small></span>${act}</li>`;
  }).join('')}</ul>`;
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
function bindNotes() {
  $('#noteBtn').onclick = e => { e.stopPropagation(); openNotes(); };
  $('#notePanel').addEventListener('click', e => {
    e.stopPropagation();
    if (e.target.closest('[data-signin]')) { signIn(); return; }
    const a = e.target.closest('[data-noteadd]'); if (a) { if (!S.friends.includes(a.dataset.noteadd)) toggleFriend(a.dataset.noteadd); renderNotes(); return; }
    const g = e.target.closest('[data-notego]'); if (g) { openNotes(false); go(g.dataset.notego); return; }
    if (e.target.closest('[data-noteclose]')) openNotes(false);
  });
  document.addEventListener('click', () => { if (!$('#notePanel').hidden) openNotes(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#notePanel').hidden) openNotes(false); });
  renderNotes();
}
