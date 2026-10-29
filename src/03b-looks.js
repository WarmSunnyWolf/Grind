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
// real fur coats: each one swaps the animal's own colours for new ones
const COATS = {"frog":{"golden":{"label":"Golden","map":{"#8fb069":"#e8c15a","#6d8c4c":"#c99b34","#d9e3a8":"#f6e7a6"}},"blue":{"label":"Poison dart blue","map":{"#8fb069":"#5b8fd0","#6d8c4c":"#3f6aa8","#d9e3a8":"#a9c9ef"}},"berry":{"label":"Strawberry","map":{"#8fb069":"#e0746a","#6d8c4c":"#b9514a","#d9e3a8":"#f4c0a8"}}},"duckling":{"snow":{"label":"Snow white","map":{"#f4d06f":"#f7f4ea","#e3b552":"#e2ddd0"}},"pink":{"label":"Bubblegum","map":{"#f4d06f":"#f6b3c4","#e3b552":"#e591a7"}},"mint":{"label":"Mint","map":{"#f4d06f":"#bfe3c4","#e3b552":"#9ccaa3"}}},"capybara":{"cocoa":{"label":"Cocoa","map":{"#b98b63":"#7a5640","#94694a":"#5c3f2e","#d2ab85":"#a57c5f"}},"honey":{"label":"Honey","map":{"#b98b63":"#d9a85f","#94694a":"#b5843f","#d2ab85":"#efcb8f"}},"snow":{"label":"Snow","map":{"#b98b63":"#e8ddd0","#94694a":"#c9b9a6","#d2ab85":"#f6efe6"}}},"rabbit":{"choc":{"label":"Chocolate","map":{"#efe6d8":"#8c6549"}},"grey":{"label":"Silver grey","map":{"#efe6d8":"#b9b6b3"}},"cinnamon":{"label":"Cinnamon","map":{"#efe6d8":"#d8a271","#eab4ad":"#f0c2b0"}}},"butterfly":{"monarch":{"label":"Monarch","map":{"#c9b3ea":"#f0a04b","#f3b9c8":"#e07a3a","#fbe7a6":"#fff3d6","#a78fcf":"#9a5a22"}},"morpho":{"label":"Blue morpho","map":{"#c9b3ea":"#5aa7e0","#f3b9c8":"#3f86c9","#fbe7a6":"#dff1ff","#a78fcf":"#2d5f93"}},"lime":{"label":"Lime","map":{"#c9b3ea":"#b9dd7a","#f3b9c8":"#f4e07a","#fbe7a6":"#fffbe0","#a78fcf":"#7fa64a"}}},"kitty":{"tabby":{"label":"Grey tabby","map":{"#f1c58c":"#b3b6bb","#d99a58":"#868b93","#fbf1e2":"#f2f2f2"}},"black":{"label":"Black cat","map":{"#f1c58c":"#4a4442","#d99a58":"#2f2b2a","#fbf1e2":"#d9d2cc"}},"cream":{"label":"Cream","map":{"#f1c58c":"#f6e6c8","#d99a58":"#e3c89a"}}},"otter":{"sea":{"label":"Sea otter","map":{"#8c6549":"#b08a68","#6c4b34":"#8c6a4e","#dcc19d":"#efdcc0"}},"dark":{"label":"Dark river","map":{"#8c6549":"#5a4234","#6c4b34":"#3f2e24","#dcc19d":"#c7a989"}},"silver":{"label":"Silver","map":{"#8c6549":"#9ea3a6","#6c4b34":"#767c80","#dcc19d":"#e3e5e6"}}},"dog":{"lab":{"label":"Black lab","map":{"#dcaa70":"#4a4442","#8f6340":"#2f2b2a","#f7e6c9":"#d9cfc4","#c48a52":"#3a3533"}},"dalmatian":{"label":"Dalmatian","map":{"#dcaa70":"#f6f3ec","#8f6340":"#3f3a37","#f7e6c9":"#ffffff","#c48a52":"#3f3a37"}},"golden":{"label":"Golden retriever","map":{"#dcaa70":"#e8bd6a","#8f6340":"#c48a3c","#f7e6c9":"#f8e7c0","#c48a52":"#d9a14f"}}},"panda":{"brown":{"label":"Brown panda","map":{"#3f3a37":"#6b4a36","#f6f3ec":"#f0e2cc"}},"blue":{"label":"Midnight blue","map":{"#3f3a37":"#33475e"}},"lilac":{"label":"Lilac","map":{"#3f3a37":"#8a7fb0","#f6f3ec":"#f7f3fb"}}},"fox":{"arctic":{"label":"Arctic fox","map":{"#dc844b":"#e9edf0","#f7ecdb":"#ffffff"}},"silver":{"label":"Silver fox","map":{"#dc844b":"#7f8794","#f7ecdb":"#eef0f2"}},"fennec":{"label":"Fennec sand","map":{"#dc844b":"#e8c48f","#f7ecdb":"#fbf1de"}}},"horse":{"black":{"label":"Black stallion","map":{"#b77a4e":"#3f3a37","#8c5a38":"#2b2725","#5a3a2a":"#1f1c1b","#ecd2b2":"#8a817a","#4a372c":"#1f1c1b"}},"white":{"label":"White mare","map":{"#b77a4e":"#f2eee8","#8c5a38":"#d6cfc5","#5a3a2a":"#c9c2b8","#ecd2b2":"#ffffff","#4a372c":"#b9b0a5"}},"palomino":{"label":"Palomino","map":{"#b77a4e":"#e6be78","#8c5a38":"#c79a52","#5a3a2a":"#f7ecd6","#ecd2b2":"#f8e8cc","#4a372c":"#efe3c8"}}},"deer":{"reindeer":{"label":"Reindeer","map":{"#c98d5a":"#8c6a52","#9e6a42":"#6b4f3c","#f3e4cb":"#e8dccb","#7c5638":"#c9b08a"}},"snow":{"label":"Snow deer","map":{"#c98d5a":"#efe6da","#9e6a42":"#cfc2b2","#f3e4cb":"#ffffff","#7c5638":"#b9a58a"}},"red":{"label":"Red fawn","map":{"#c98d5a":"#b5703e","#9e6a42":"#8c5230","#f3e4cb":"#f6e3c5"}}},"wolf":{"arctic":{"label":"Arctic wolf","map":{"#7f8d9c":"#e9edf0","#4d5a68":"#b4bec7","#f1f1ea":"#ffffff","#a7b3bf":"#d3dae0"}},"black":{"label":"Black wolf","map":{"#7f8d9c":"#3e434a","#4d5a68":"#202429","#f1f1ea":"#c9ccd0","#a7b3bf":"#5b6169"}},"timber":{"label":"Timber wolf","map":{"#7f8d9c":"#9a7a5c","#4d5a68":"#5e4a38","#f1f1ea":"#f1e6d6","#a7b3bf":"#b89a7c"}},"red":{"label":"Red wolf","map":{"#7f8d9c":"#c27a4e","#4d5a68":"#7a4a2e","#f1f1ea":"#f5e6d3","#a7b3bf":"#d89a72"}}},"dragon":{"ruby":{"label":"Ruby","map":{"#83bca7":"#d9675a","#5f9a86":"#a8483e","#f3e3b3":"#f6dcb4"}},"sapphire":{"label":"Sapphire","map":{"#83bca7":"#6f9fd8","#5f9a86":"#4d78b0","#f3e3b3":"#e6eefb"}},"gold":{"label":"Gold","map":{"#83bca7":"#e8c15a","#5f9a86":"#c99b34","#f3e3b3":"#fbf0c8","#f1cf7d":"#f7ecd6"}},"shadow":{"label":"Shadow","map":{"#83bca7":"#5b5470","#5f9a86":"#3d3850","#f3e3b3":"#c9c2dc","#f1cf7d":"#b9a6e0"}}},"triceratops":{"green":{"label":"Forest","map":{"#86a9c9":"#8fb069","#6a8db0":"#6d8c4c","#c9dcea":"#d9e3a8"}},"violet":{"label":"Violet","map":{"#86a9c9":"#a78fcf","#6a8db0":"#8670b3","#c9dcea":"#e3d9f4","#f0b97a":"#f3b9c8"}},"sunset":{"label":"Sunset","map":{"#86a9c9":"#e9905a","#6a8db0":"#c36d3a","#c9dcea":"#f6d6b8","#f0b97a":"#e8b84a"}}},"stegosaurus":{"ocean":{"label":"Ocean","map":{"#9bbd6a":"#6fa6c9","#7c9c50":"#4f86ab","#d7e6b0":"#cfe4f1","#e6a86a":"#f3b9c8"}},"lava":{"label":"Lava","map":{"#9bbd6a":"#b9514a","#7c9c50":"#8f3a34","#d7e6b0":"#f0c0a8","#e6a86a":"#f4d06f"}},"lilac":{"label":"Lilac","map":{"#9bbd6a":"#b9a6d6","#7c9c50":"#9682bd","#d7e6b0":"#ece4f6","#e6a86a":"#8fcfaa"}}},"longneck":{"leaf":{"label":"Leaf green","map":{"#a9c7d8":"#9bbd6a","#87a9bd":"#7c9c50","#dbe9f0":"#d7e6b0"}},"peach":{"label":"Peach","map":{"#a9c7d8":"#f2b28f","#87a9bd":"#d98e6a","#dbe9f0":"#fbe1d2"}},"lavender":{"label":"Lavender","map":{"#a9c7d8":"#b9a6d6","#87a9bd":"#9682bd","#dbe9f0":"#ece4f6"}}},"trex":{"jungle":{"label":"Jungle","map":{"#d9874f":"#7fa65a","#b96c3a":"#5e8540","#f2d3a2":"#dfe8b8"}},"midnight":{"label":"Midnight","map":{"#d9874f":"#4f5f86","#b96c3a":"#36446a","#f2d3a2":"#c9d2ea"}},"bubblegum":{"label":"Bubblegum","map":{"#d9874f":"#ef9db5","#b96c3a":"#d5768f","#f2d3a2":"#fbe0e8"}}},"turtle":{"sea":{"label":"Sea turtle","map":{"#7e9a5d":"#6f9a8f","#64804b":"#4f7a70","#a6bb7b":"#9cc4b8","#bcc78d":"#b8d8c8"}},"golden":{"label":"Golden","map":{"#7e9a5d":"#c9a14f","#64804b":"#a07e36","#a6bb7b":"#e3c47a"}},"rose":{"label":"Rose shell","map":{"#7e9a5d":"#c98a95","#64804b":"#a8697a","#a6bb7b":"#e6b4bd"}}},"axolotl":{"wild":{"label":"Wild","map":{"#f3bcc1":"#8a8178","#e49aa3":"#6c645c","#dd7488":"#c96a7a"}},"golden":{"label":"Golden","map":{"#f3bcc1":"#f4d98a","#e49aa3":"#e6bf62","#dd7488":"#e98a6a"}},"blue":{"label":"Blue","map":{"#f3bcc1":"#a9c7e8","#e49aa3":"#83a6cf","#dd7488":"#5b7fbf"}}},"swan":{"black":{"label":"Black swan","map":{"#fbf8f1":"#46404a","#e6e1d6":"#2e2a31","#e98a45":"#d9534f"}},"blush":{"label":"Blush pink","map":{"#fbf8f1":"#f8d3da","#e6e1d6":"#eeb0be"}}},"heron":{"egret":{"label":"White egret","map":{"#a2b3bd":"#f4f2ed","#e5ebed":"#ffffff","#5f717c":"#c9cdd1","#7f919b":"#e3e6e8","#e2b04f":"#f0c64e"}},"purple":{"label":"Purple heron","map":{"#a2b3bd":"#a5869a","#e5ebed":"#efe1e6","#5f717c":"#5e4a58","#7f919b":"#7a6070"}}}};
const COAT_COST = 150;
const WARDROBE = {
  chef: { slot: 'outfit', label: 'Chef', cost: 250 }, wizard: { slot: 'outfit', label: 'Wizard', cost: 300 }, pirate: { slot: 'outfit', label: 'Pirate', cost: 300 },
  hero: { slot: 'outfit', label: 'Superhero', cost: 350 }, royal: { slot: 'outfit', label: 'Royal', cost: 450 },
  bow: { slot: 'head', label: 'Big bow', cost: 40 }, beanie: { slot: 'head', label: 'Knit beanie', cost: 60 }, flowers: { slot: 'head', label: 'Flower crown', cost: 80 },
  grad: { slot: 'head', label: 'Graduation cap', cost: 100 }, crown: { slot: 'head', label: 'Golden crown', cost: 150 },
  glasses: { slot: 'face', label: 'Study glasses', cost: 50 }, shades: { slot: 'face', label: 'Sunglasses', cost: 70 },
  bowtie: { slot: 'neck', label: 'Bow tie', cost: 50 }, scarf: { slot: 'neck', label: 'Cosy scarf', cost: 60 },
  f_none: { slot: 'emoteF', label: 'Just the book', cost: 0 }, f_think: { slot: 'emoteF', label: 'Thinking', cost: 0 }, f_bulb: { slot: 'emoteF', label: 'Big idea', cost: 120 }, f_notes: { slot: 'emoteF', label: 'Humming', cost: 120 },
  f_coffee: { slot: 'emoteF', label: 'Coffee break', cost: 150 }, f_star: { slot: 'emoteF', label: 'Star student', cost: 150 }, f_heart: { slot: 'emoteF', label: 'Loving it', cost: 150 }, f_fire: { slot: 'emoteF', label: 'On fire', cost: 200 },
  n_zz: { slot: 'emoteN', label: 'Snoring', cost: 0 }, n_moon: { slot: 'emoteN', label: 'Moon and stars', cost: 120 }, n_heart: { slot: 'emoteN', label: 'Sweet dreams', cost: 150 }, n_sheep: { slot: 'emoteN', label: 'Counting sheep', cost: 200 }
};
const SLOTS = { outfit: 'Costumes', head: 'Head', face: 'Eyes', neck: 'Neck' };
const EMOTE_SLOTS = { emoteF: 'While focusing', emoteN: 'While napping' };
const FREE_ITEMS = ['f_none', 'f_think', 'n_zz'];
const ownsItem = id => FREE_ITEMS.includes(id) || (S.wardrobe || []).includes(id);
function cleanLook(l) {
  if (!l || typeof l !== 'object') return null;
  const o = {};
  [...Object.keys(SLOTS), ...Object.keys(EMOTE_SLOTS)].forEach(sl => { if (WARDROBE[l[sl]] && WARDROBE[l[sl]].slot === sl) o[sl] = l[sl]; });
  if (typeof l.coat === 'string' && /^[a-z]{1,16}$/.test(l.coat)) o.coat = l.coat;
  return Object.keys(o).length ? o : null;
}
const myLook = (k = S.active) => cleanLook((S.pets[k] || {}).look);
function recolor(kind, look, art) {
  const c = look && look.coat && COATS[kind] && COATS[kind][look.coat]; if (!c) return art;
  return art.replace(/#[0-9a-f]{6}\b/gi, h => c.map[h.toLowerCase()] || h);
}
const T = (x, y, s) => `transform="translate(${x} ${y}) scale(${s})"`;
function headItem(id, [x, y, s]) {
  const t = T(x, y, s);
  if (id === 'beanie') return `<g ${t}><path d="M-30 6 C-30 -22 -16 -34 0 -34 C16 -34 30 -22 30 6 Z" fill="#c95f5a" ${O2}/><path d="M-18 -24 L-14 4 M-6 -32 L-5 4 M6 -32 L5 4 M18 -24 L14 4" stroke="#a84843" stroke-width="2" stroke-linecap="round"/><rect x="-33" y="-2" width="66" height="12" rx="6" fill="#f3e6d2" ${O2}/><circle cx="0" cy="-37" r="7" fill="#f3e6d2" ${O2}/></g>`;
  if (id === 'grad') return `<g ${t}><path d="M-20 -10 L-20 6 C-8 12 8 12 20 6 L20 -10 Z" fill="#2e3a44" ${O2}/><path d="M-40 -14 L0 -29 L40 -14 L0 1 Z" fill="#3b4a56" ${O2}/><path d="M0 -14 L30 -10 L31 8" stroke="#e8b84a" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="31" cy="10" r="3.6" fill="#e8b84a" ${O2}/><circle cx="0" cy="-14" r="2.6" fill="#e8b84a"/></g>`;
  if (id === 'crown') return `<g ${t}><path d="M-26 6 L-30 -24 L-13 -9 L0 -31 L13 -9 L30 -24 L26 6 Z" fill="#f0c64e" ${O2}/><path d="M-26 0 H26" stroke="#c99b34" stroke-width="2"/><circle cx="0" cy="-5" r="4" fill="#d86a6a" ${O2}/><circle cx="-15" cy="-2" r="3" fill="#6aa0d8" stroke="${INK}" stroke-width="1.4"/><circle cx="15" cy="-2" r="3" fill="#6aa0d8" stroke="${INK}" stroke-width="1.4"/><circle cx="0" cy="-31" r="3" fill="#f7e3a0" ${O2}/><circle cx="-30" cy="-24" r="2.6" fill="#f7e3a0" ${O2}/><circle cx="30" cy="-24" r="2.6" fill="#f7e3a0" ${O2}/></g>`;
  if (id === 'flowers') {
    const fl = [[-30, 6, '#f2a7b5'], [-16, -3, '#fbf8f1'], [0, -6, '#f4d06f'], [16, -3, '#fbf8f1'], [30, 6, '#f2a7b5']];
    return `<g ${t}><path d="M-34 10 C-20 -8 20 -8 34 10" fill="none" stroke="#7d9a52" stroke-width="3.5" stroke-linecap="round"/>${fl.map(([fx, fy, c]) => `<g transform="translate(${fx} ${fy})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-5" rx="3.6" ry="5" fill="${c}" stroke="${INK}" stroke-width="1.6" transform="rotate(${a})"/>`).join('')}<circle r="2.8" fill="#e8b84a" stroke="${INK}" stroke-width="1.4"/></g>`).join('')}</g>`;
  }
  if (id === 'bow') return `<g ${t}><g transform="translate(20 0) rotate(18)"><path d="M0 0 C-10 -16 -28 -14 -26 0 C-28 14 -10 16 0 0 Z" fill="#e27d97" ${O2}/><path d="M0 0 C10 -16 28 -14 26 0 C28 14 10 16 0 0 Z" fill="#e27d97" ${O2}/><circle r="5.5" fill="#c95f7a" ${O2}/></g></g>`;
  if (id === 'wizard') return `<g ${t}><path d="M-30 4 C-14 -2 14 -2 30 4 L10 -58 C6 -68 -2 -66 -6 -60 Z" fill="#5b4a8a" ${O2}/><path d="M-6 -60 C-14 -64 -20 -60 -22 -54" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="0" cy="4" rx="40" ry="8" fill="#4a3b75" ${O2}/>${star(-8, -22, 5)}${star(8, -40, 4)}${star(12, -12, 3.4)}</g>`;
  if (id === 'pirate') return `<g ${t}><path d="M-42 2 C-30 -30 -14 -26 0 -34 C14 -26 30 -30 42 2 C20 -6 -20 -6 -42 2 Z" fill="#2b2725" ${O2}/><path d="M-36 -4 C-16 -12 16 -12 36 -4" fill="none" stroke="#e8b84a" stroke-width="2.6"/><circle cx="0" cy="-17" r="5" fill="#f3efe6" ${O2}/><path d="M-8 -9 L8 -2 M8 -9 L-8 -2" stroke="#f3efe6" stroke-width="2.4" stroke-linecap="round"/></g>`;
  if (id === 'chef') return `<g ${t}><rect x="-20" y="-24" width="40" height="28" rx="4" fill="#ffffff" ${O2}/><circle cx="-16" cy="-30" r="12" fill="#ffffff" ${O2}/><circle cx="16" cy="-30" r="12" fill="#ffffff" ${O2}/><circle cx="0" cy="-38" r="14" fill="#ffffff" ${O2}/><path d="M-20 -4 H20" stroke="#d8d2c6" stroke-width="2.4"/><path d="M-12 -14 V-4 M0 -16 V-4 M12 -14 V-4" stroke="#e6e1d6" stroke-width="2"/></g>`;
  if (id === 'royal') return headItem('crown', [x, y, s * 1.15]);
  return '';
}
function star(x, y, r) { const p = []; for (let i = 0; i < 10; i++) { const a = Math.PI / 5 * i - Math.PI / 2, rr = i % 2 ? r * .45 : r; p.push(`${(x + Math.cos(a) * rr).toFixed(1)} ${(y + Math.sin(a) * rr).toFixed(1)}`); } return `<path d="M${p.join(' L')} Z" fill="#f4d97c" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/>`; }
function neckItem(id, [x, y, s]) {
  const t = T(x, y, s);
  if (id === 'bowtie') return `<g ${t}><path d="M0 0 L-17 -10 L-17 10 Z M0 0 L17 -10 L17 10 Z" fill="#3b5f8a" ${O2}/><circle r="4.6" fill="#2e4b70" ${O2}/></g>`;
  if (id === 'scarf') return `<g ${t}><path d="M12 4 L22 32 L8 34 L3 8 Z" fill="#d9874f" ${O2}/><path d="M-32 -6 C-14 6 14 6 32 -6 L32 6 C14 18 -14 18 -32 6 Z" fill="#e9a35f" ${O2}/><path d="M-20 2 L-20 12 M-6 5 L-6 15 M8 5 L8 15 M22 1 L22 11" stroke="#c06f37" stroke-width="2"/></g>`;
  if (id === 'chef') return `<g ${t}><path d="M-22 -4 C-10 4 10 4 22 -4 L0 22 Z" fill="#d9534f" ${O2}/><circle cx="0" cy="2" r="4" fill="#b8423e" ${O2}/></g>`;
  if (id === 'royal') return `<g ${t}><path d="M-34 -6 C-16 8 16 8 34 -6 L34 6 C16 20 -16 20 -34 6 Z" fill="#fbf8f1" ${O2}/>${[-24, -10, 6, 20].map((dx, i) => `<path d="M${dx} ${4 + (i % 2) * 3} l2 4 l2 -4 z" fill="${INK}"/>`).join('')}<circle cx="0" cy="10" r="4" fill="#f0c64e" ${O2}/></g>`;
  if (id === 'hero' || id === 'wizard') return `<g ${t}><circle cx="-22" cy="0" r="4.6" fill="#f0c64e" ${O2}/><circle cx="22" cy="0" r="4.6" fill="#f0c64e" ${O2}/></g>`;
  return '';
}
function capeUnder(id, [x, y, s]) {
  const col = { hero: ['#d9534f', '#b8423e'], wizard: ['#5b4a8a', '#463870'], royal: ['#b8323b', '#8f2530'] }[id]; if (!col) return '';
  const w0 = 34 * s, w1 = Math.max(58, 86 * s), y0 = y - 6 * s, yb = 180, mid = (y0 + yb) / 2;
  const sp = id === 'wizard' ? star(x - w1 * .7, yb - 18, 4) + star(x + w1 * .75, mid + 10, 3.6) + star(x - w1 * .5, mid - 4, 3) : '';
  const trim = id === 'royal' ? `<path d="M${x - w1} ${yb - 4} Q${x} ${yb + 6} ${x + w1} ${yb - 4}" fill="none" stroke="#fbf8f1" stroke-width="7" stroke-linecap="round"/>` : '';
  return `<path d="M${x - w0} ${y0} C${x - w0 - 20 * s} ${mid} ${x - w1 - 4} ${yb - 20} ${x - w1} ${yb - 2} Q${x} ${yb + 8} ${x + w1} ${yb - 2} C${x + w1 + 4} ${yb - 20} ${x + w0 + 20 * s} ${mid} ${x + w0} ${y0} Z" fill="${col[0]}" ${O}/><path d="M${x - w1 * .55} ${yb - 4} C${x - w1 * .5} ${mid + 20} ${x - w0 * .6} ${mid} ${x - w0 * .4} ${y0 + 10}" fill="none" stroke="${col[1]}" stroke-width="2.4" stroke-linecap="round"/>${sp}${trim}`;
}
function faceItem(id, f) {
  if (f.eyes.length < 2) return '';
  const er = f.er, [[x1, y1], [x2, y2]] = f.eyes;
  if (id === 'hero') {
    const r = er * 1.7, pad = er * 2.8, h = er * 2.2, yy = (y1 + y2) / 2;
    return `<path fill-rule="evenodd" d="M${x1 - pad} ${yy - h * .6} C${x1} ${yy - h * 1.1} ${x2} ${yy - h * 1.1} ${x2 + pad} ${yy - h * .6} L${x2 + pad * .9} ${yy + h * .7} C${(x1 + x2) / 2 + 6} ${yy + h * .4} ${(x1 + x2) / 2 - 6} ${yy + h * .4} ${x1 - pad * .9} ${yy + h * .7} Z M${x1 - r} ${y1} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z M${x2 - r} ${y2} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z" fill="#2e3a6e" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>`;
  }
  if (id === 'pirate') { const r = er * 1.9; return `<path d="M${x2 - r * 2.2} ${y2 - r * 2.4} L${x2 + r * 2.4} ${y2 + r * .6}" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="${x2}" cy="${y2}" rx="${r}" ry="${r * .9}" fill="#2b2725" ${O2}/>`; }
  if (id !== 'glasses' && id !== 'shades') return '';
  const r = er * 2.1, fill = id === 'shades' ? '#2e2a28' : 'rgba(255,255,255,.22)';
  const lens = (x, y) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${INK}" stroke-width="2.4"/>${id === 'shades' ? `<path d="M${x - r * .5} ${y - r * .3} Q${x - r * .2} ${y - r * .65} ${x + r * .2} ${y - r * .6}" stroke="#fff" stroke-width="1.6" fill="none" opacity=".7" stroke-linecap="round"/>` : ''}`;
  return `<g class="acc-face">${lens(x1, y1)}${lens(x2, y2)}<path d="M${x1 + r} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - r * .35} ${x2 - r} ${y2}" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>`;
}
const OUTFITS = { chef: { head: 'chef', neck: 'chef' }, wizard: { head: 'wizard', neck: 'wizard', cape: 1 }, pirate: { head: 'pirate', face: 'pirate' }, hero: { face: 'hero', neck: 'hero', cape: 1 }, royal: { head: 'royal', neck: 'royal', cape: 1 } };
function bookSVG([x, y, s]) {
  return `<g class="study-book" ${T(x, y + 22 * s, s * 1.05)}><path d="M-33 -3 L-33 19 C-22 15 -10 15 0 21 C10 15 22 15 33 19 L33 -3 Z" fill="#b8504b" ${O2}/><path d="M0 -2 C-10 -9 -22 -9 -30 -5 L-30 15 C-22 11 -10 11 0 17 Z" fill="#fbf8f1" ${O2}/><path d="M0 -2 C10 -9 22 -9 30 -5 L30 15 C22 11 10 11 0 17 Z" fill="#fbf8f1" ${O2}/><path d="M-24 -1 C-17 -3 -10 -3 -5 0 M-24 5 C-17 3 -10 3 -5 6 M5 0 C10 -3 17 -3 24 -1 M5 6 C10 3 17 3 24 5" stroke="#c9c2b4" stroke-width="1.6" stroke-linecap="round" fill="none"/></g>`;
}
function emoteIcon(id) {
  if (id === 'think') return `<circle cx="-7" cy="0" r="2.6" fill="${INK}"/><circle cx="0" cy="0" r="2.6" fill="${INK}"/><circle cx="7" cy="0" r="2.6" fill="${INK}"/>`;
  if (id === 'bulb') return `<path d="M0 -10 C-7 -10 -10 -4 -8 1 C-7 4 -4 5 -4 8 H4 C4 5 7 4 8 1 C10 -4 7 -10 0 -10 Z" fill="#f4d97c" ${O2}/><path d="M-3 11 H3" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/><path d="M-13 -9 L-10 -7 M13 -9 L10 -7 M0 -15 V-13" stroke="#e8b84a" stroke-width="2" stroke-linecap="round"/>`;
  if (id === 'notes') return `<path d="M-6 6 V-8 L7 -11 V3" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><ellipse cx="-8.5" cy="6.5" rx="3.6" ry="2.8" fill="${INK}"/><ellipse cx="4.5" cy="3.5" rx="3.6" ry="2.8" fill="${INK}"/>`;
  if (id === 'coffee') return `<path d="M-9 -3 H6 V5 C6 9 3 11 -1 11 H-2 C-6 11 -9 9 -9 5 Z" fill="#f3e6d2" ${O2}/><path d="M6 0 C10 0 10 6 6 6" fill="none" stroke="${INK}" stroke-width="2"/><path d="M-5 -6 C-7 -9 -3 -10 -5 -13 M0 -6 C-2 -9 2 -10 0 -13" stroke="#a7a19a" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M-9 0 H6" stroke="#8f6340" stroke-width="2.4"/>`;
  if (id === 'star') return star(0, 0, 10);
  if (id === 'heart') return `<path d="M0 9 C-12 1 -11 -9 -5 -9 C-2 -9 0 -6 0 -5 C0 -6 2 -9 5 -9 C11 -9 12 1 0 9 Z" fill="#e8798f" ${O2}/>`;
  if (id === 'fire') return `<path d="M0 -12 C2 -6 9 -3 8 4 C7 9 3 11 0 11 C-4 11 -8 8 -8 3 C-8 -2 -4 -3 -3 -7 C-1 -4 0 -2 1 0 C2 -4 1 -8 0 -12 Z" fill="#ef8a4a" ${O2}/><path d="M0 3 C2 5 2 8 0 9 C-2 8 -2 5 0 3 Z" fill="#f4d97c"/>`;
  if (id === 'moon') return `<path d="M3 -10 A10 10 0 1 0 9 6 A8 8 0 1 1 3 -10 Z" fill="#f4d97c" ${O2}/>${star(9, -7, 3.2)}`;
  if (id === 'sheep') return `<g><circle cx="-4" cy="0" r="5" fill="#fbf8f1" stroke="${INK}" stroke-width="1.6"/><circle cx="2" cy="-2" r="5" fill="#fbf8f1" stroke="${INK}" stroke-width="1.6"/><circle cx="3" cy="3" r="5" fill="#fbf8f1" stroke="${INK}" stroke-width="1.6"/><circle cx="-3" cy="4" r="4.4" fill="#fbf8f1" stroke="${INK}" stroke-width="1.6"/><ellipse cx="10" cy="0" rx="3.4" ry="4" fill="${INK}"/><path d="M-4 8 V11 M3 8 V11" stroke="${INK}" stroke-width="2" stroke-linecap="round"/></g>`;
  return '';
}
function emoteSVG(id, [zx, zy]) {
  const icon = emoteIcon(id); if (!icon) return '';
  const x = Math.min(176, zx + 4), y = Math.max(22, zy + 4);
  return `<g transform="translate(${x} ${y})"><g class="emote"><circle cx="-16" cy="22" r="3" fill="#fbf8f1" stroke="${INK}" stroke-width="1.6"/><circle cx="-9" cy="15" r="4.4" fill="#fbf8f1" stroke="${INK}" stroke-width="1.6"/><ellipse cx="4" cy="0" rx="19" ry="16" fill="#fbf8f1" stroke="${INK}" stroke-width="2"/><g transform="translate(4 0)">${icon}</g></g></g>`;
}
// all the layers a look adds around the animal: capes go behind it, the rest in front
function lookLayers(kind, look, state, studying) {
  const a = ANCHORS[kind] || ANCHORS.frog, f = ANIMALS[kind].face, l = cleanLook(look) || {}, out = { under: '', over: '', zz: null };
  const fit = l.outfit ? OUTFITS[l.outfit] : null;
  const head = fit ? fit.head : l.head, face = fit && fit.face ? fit.face : l.face, neck = fit && fit.neck ? fit.neck : l.neck;
  if (fit && fit.cape) out.under = capeUnder(l.outfit, a.neck);
  if (studying && state !== 'sleeping') out.over += bookSVG(a.neck);
  if (neck) out.over += neckItem(neck, a.neck);
  if (face && state !== 'sleeping' || face === 'hero' || face === 'pirate') out.over += faceItem(face, f);
  if (head) out.over += headItem(head, a.hat);
  if (studying && state !== 'sleeping') { const e = (l.emoteF || 'f_think').slice(2); if (e !== 'none') out.over += emoteSVG(e, f.zz); }
  if (state === 'sleeping' && l.emoteN && l.emoteN !== 'n_zz') out.zz = emoteSVG(l.emoteN.slice(2), f.zz);
  return out;
}

/* the dress-up window in Sanctuary */
let dressFor = null, tryOn = null, dressPose = 'happy';
function openDress(k) { dressFor = k; tryOn = null; dressPose = 'happy'; renderDress(); $('#dressModal').classList.add('on'); }
function closeDress() { $('#dressModal').classList.remove('on'); dressFor = null; tryOn = null; }
const coatsOwned = k => (S.pets[k] && Array.isArray(S.pets[k].coats) ? S.pets[k].coats : []);
function itemPrice(slot, id) { return slot === 'coat' ? COAT_COST : WARDROBE[id].cost; }
function itemLabel(slot, id) { return slot === 'coat' ? COATS[dressFor][id].label : WARDROBE[id].label; }
function itemOwned(slot, id) { return slot === 'coat' ? coatsOwned(dressFor).includes(id) : ownsItem(id); }
function renderDress() {
  const k = dressFor; if (!k) return;
  const p = S.pets[k], cur = cleanLook(p.look) || {}, view = { ...cur, ...(tryOn || {}) };
  const poseOf = slot => slot === 'emoteF' ? 'study' : slot === 'emoteN' ? 'sleeping' : 'awake';
  const pic = (look, pose) => avatarSVG(k, pose === 'study' ? 'awake' : pose, look, pose === 'study');
  const tile = (slot, id) => {
    const isNone = id === 'none', on = isNone ? !view[slot] : view[slot] === id, has = isNone || itemOwned(slot, id);
    const lk = { ...view }; if (isNone) delete lk[slot]; else lk[slot] = id;
    if (slot === 'outfit' && !isNone) { delete lk.head; delete lk.face; delete lk.neck; }
    return `<button type="button" class="dress-tile ${on ? 'on' : ''}" data-dsel="${slot}:${id}" aria-pressed="${on}"><span class="dress-av">${pic(lk, poseOf(slot))}</span><b>${isNone ? (slot === 'coat' ? 'Natural' : 'None') : esc(itemLabel(slot, id))}</b><small>${isNone || has ? (on ? 'Wearing' : 'Yours') : `${icon('i-coin')}${itemPrice(slot, id)}`}</small></button>`;
  };
  const pending = tryOn && Object.entries(tryOn).find(([sl, id]) => !itemOwned(sl, id));
  const name = p.name || ANIMALS[k].label;
  const section = (lab, slot, ids, none = true) => `<div><span class="eyebrow">${lab}</span><div class="dress-row">${none ? tile(slot, 'none') : ''}${ids.map(id => tile(slot, id)).join('')}</div></div>`;
  const ofSlot = sl => Object.keys(WARDROBE).filter(id => WARDROBE[id].slot === sl);
  const pose = dressPose;
  $('#dressBox').innerHTML = `<div class="row" style="justify-content:space-between; flex-wrap:nowrap"><div><span class="eyebrow">Wardrobe</span><h2>Dress up ${esc(name)}</h2></div><button class="icon-btn" data-dclose aria-label="Close">${icon('i-x')}</button></div>
    <div class="dress">
      <div class="dress-side"><div class="dress-pic">${animalSVG(k, pose === 'study' ? 'awake' : pose, { look: view, label: name, studying: pose === 'study' })}</div>
        <div class="seg dress-pose" role="group" aria-label="Preview">${[['happy', 'Happy'], ['study', 'Studying'], ['sleeping', 'Napping']].map(([v, t]) => `<button type="button" data-dpose="${v}" aria-pressed="${pose === v}">${t}</button>`).join('')}</div></div>
      <div class="dress-opts">
        ${section('Costumes · replace hat, eyes and neck', 'outfit', ofSlot('outfit'))}
        ${section('Head', 'head', ofSlot('head'))}${section('Eyes', 'face', ofSlot('face'))}${section('Neck', 'neck', ofSlot('neck'))}
        ${COATS[k] ? section(`Fur coat for this ${ANIMALS[k].label.toLowerCase()} · ${COAT_COST} coins each`, 'coat', Object.keys(COATS[k])) : ''}
        ${section('While focusing · your animal reads a book and shows this', 'emoteF', ofSlot('emoteF'), false)}
        ${section('While napping', 'emoteN', ofSlot('emoteN'), false)}
      </div>
    </div>
    <div class="row dress-foot">${pending ? `<span class="muted" style="font-size:.84rem">Trying on ${esc(itemLabel(pending[0], pending[1]))}. You have ${S.coins} coins.</span><button class="btn" data-dcancel>Take it off</button><button class="btn primary" data-dbuy ${S.coins < itemPrice(pending[0], pending[1]) ? 'disabled' : ''}>${icon('i-coin')}Buy for ${itemPrice(pending[0], pending[1])}</button>` : `<span class="muted" style="font-size:.84rem">Outfits and emotes work on every animal. Coats belong to one animal.</span><button class="btn primary" data-dclose>Done</button>`}</div>`;
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
    const ps = e.target.closest('[data-dpose]'); if (ps) { dressPose = ps.dataset.dpose; renderDress(); return; }
    const sel = e.target.closest('[data-dsel]');
    if (sel) {
      const [slot, id] = sel.dataset.dsel.split(':');
      if (slot === 'emoteF') dressPose = 'study'; else if (slot === 'emoteN') dressPose = 'sleeping'; else if (dressPose !== 'happy') dressPose = 'awake' === dressPose ? 'happy' : dressPose;
      if (id === 'none') { tryOn = null; delete cur[slot]; setLook(k, cur); }
      else if (itemOwned(slot, id)) { tryOn = null; if (cur[slot] === id && slot !== 'emoteF' && slot !== 'emoteN') delete cur[slot]; else cur[slot] = id; setLook(k, cur); }
      else tryOn = { [slot]: id };
      renderDress(); return;
    }
    if (e.target.closest('[data-dcancel]')) { tryOn = null; renderDress(); return; }
    if (e.target.closest('[data-dbuy]') && tryOn) {
      const [slot, id] = Object.entries(tryOn)[0], cost = itemPrice(slot, id), label = itemLabel(slot, id);
      if (S.coins < cost) return;
      S.coins -= cost;
      if (slot === 'coat') S.pets[k].coats = [...new Set([...coatsOwned(k), id])];
      else S.wardrobe = [...new Set([...(S.wardrobe || []), id])];
      cur[slot] = id; tryOn = null;
      setLook(k, cur); renderChips(); renderDress(); toast(`${esc(label)} is yours.`);
    }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && dressFor) closeDress(); });
}
