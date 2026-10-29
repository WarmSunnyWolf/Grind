/* Grind animal illustrations. Every animal is drawn in SVG with three faces: awake, sleeping, happy. */
const INK = '#3b2f27';
const O = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
const O2 = `stroke="${INK}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"`;

const ANIMALS = {
  frog: {
    label: 'Frog', lore: 'Hums quietly on a lily pad. Starts any task with one small hop.', unlock: { type: 'free' }, defaultName: '',
    face: { eyes: [[68, 85], [132, 85]], er: 7, whites: [[68, 84, 14], [132, 84, 14]], lid: '#8fb069', mouth: { x: 100, y: 124, type: 'wide', w: 22 }, blush: [[56, 116], [144, 116]], zz: [150, 52] },
    art: () => {
      const b = '#8fb069', d = '#6d8c4c', l = '#d9e3a8';
      return `<ellipse cx="54" cy="160" rx="24" ry="15" fill="${d}" ${O}/><ellipse cx="146" cy="160" rx="24" ry="15" fill="${d}" ${O}/>
      <circle cx="68" cy="88" r="24" fill="${b}" ${O}/><circle cx="132" cy="88" r="24" fill="${b}" ${O}/>
      <path d="M38 150 C36 112 62 94 100 94 C138 94 164 112 162 150 C161 172 136 180 100 180 C64 180 39 172 38 150 Z" fill="${b}" ${O}/>
      <path d="M50 102 C58 98 62 98 68 100 M132 100 C138 98 142 98 150 102" fill="none" stroke="${b}" stroke-width="5"/>
      <ellipse cx="100" cy="152" rx="42" ry="23" fill="${l}"/>
      <circle cx="60" cy="134" r="5" fill="${d}"/><circle cx="142" cy="130" r="6" fill="${d}"/><circle cx="150" cy="146" r="3.5" fill="${d}"/><circle cx="118" cy="104" r="3" fill="${d}"/>
      <ellipse cx="76" cy="177" rx="14" ry="6" fill="${b}" ${O}/><ellipse cx="124" cy="177" rx="14" ry="6" fill="${b}" ${O}/>`;
    }
  },
  duckling: {
    label: 'Duckling', lore: 'Follows you from one pebble to the next, never in a hurry.', unlock: { type: 'free' }, defaultName: '',
    face: { eyes: [[76, 86], [106, 86]], er: 5.5, mouth: null, blush: [[64, 100], [118, 100]], zz: [128, 50] },
    art: (st) => {
      const y = '#f4d06f', s = '#e3b552', bk = '#e8894a';
      const beak = st === 'happy'
        ? `<path d="M76 102 C84 92 102 92 110 102 Z" fill="${bk}" ${O}/><path d="M78 103 Q93 117 108 103 Z" fill="#7a3b33" ${O2}/><ellipse cx="93" cy="109" rx="6" ry="3" fill="#e58b86"/>`
        : `<path d="M76 104 C84 96 102 96 110 104 C102 112 84 112 76 104 Z" fill="${bk}" ${O}/><path d="M79 104 H107" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`;
      return `<ellipse cx="84" cy="178" rx="13" ry="5" fill="${bk}" ${O2}/><ellipse cx="116" cy="178" rx="13" ry="5" fill="${bk}" ${O2}/>
      <path d="M148 132 L174 116 L162 148 Z" fill="${y}" ${O}/>
      <ellipse cx="106" cy="146" rx="54" ry="34" fill="${y}" ${O}/>
      <path d="M112 136 C128 130 148 136 150 150 C138 160 120 160 110 152 Z" fill="${s}" ${O2}/>
      <circle cx="90" cy="90" r="36" fill="${y}" ${O}/>
      <path d="M86 56 C83 44 92 40 96 49 C98 38 110 41 104 54" fill="none" ${O}/>
      ${beak}`;
    }
  },
  capybara: {
    label: 'Capybara', lore: 'Calm in every storm. Wears a yuzu on its head for luck.', unlock: { type: 'free' }, defaultName: '',
    face: { eyes: [[62, 82], [108, 82]], er: 4.8, mouth: { x: 85, y: 121, type: 'cat' }, blush: [[52, 100], [120, 100]], zz: [140, 58] },
    art: () => {
      const b = '#b98b63', d = '#94694a', l = '#d2ab85';
      return `<rect x="56" y="158" width="20" height="22" rx="9" fill="${d}" ${O}/><rect x="132" y="158" width="20" height="22" rx="9" fill="${d}" ${O}/>
      <path d="M40 142 C38 110 64 98 106 98 C148 98 170 114 168 146 C167 170 148 180 106 180 C64 180 41 170 40 142 Z" fill="${b}" ${O}/>
      <path d="M136 120 C146 124 152 132 154 142" fill="none" stroke="${d}" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="54" cy="52" rx="9" ry="8" fill="${d}" ${O}/><ellipse cx="116" cy="52" rx="9" ry="8" fill="${d}" ${O}/>
      <path d="M42 78 C42 56 60 46 86 46 C114 46 128 58 128 80 L128 108 C128 128 112 138 86 138 C58 138 42 128 42 108 Z" fill="${b}" ${O}/>
      <ellipse cx="85" cy="113" rx="32" ry="20" fill="${l}" ${O2}/>
      <ellipse cx="76" cy="107" rx="3.6" ry="2.6" fill="${INK}"/><ellipse cx="94" cy="107" rx="3.6" ry="2.6" fill="${INK}"/>
      <circle cx="86" cy="40" r="12" fill="#efb24a" ${O}/><circle cx="82" cy="36" r="2.2" fill="#f8d68a"/>
      <path d="M87 28 C91 20 100 19 103 23 C99 28 92 29 87 28 Z" fill="#7d9a52" ${O2}/>`;
    }
  },
  rabbit: {
    label: 'Rabbit', lore: 'Quick bursts of focus, then a good long rest in the clover.', unlock: { type: 'coins', n: 40 }, defaultName: '',
    face: { eyes: [[84, 96], [116, 96]], er: 5.5, mouth: { x: 100, y: 113, type: 'cat' }, blush: [[72, 108], [128, 108]], zz: [142, 62] },
    art: () => {
      const b = '#efe6d8', p = '#eab4ad';
      return `<path d="M74 72 C62 34 64 12 77 11 C90 10 93 36 90 72 Z" fill="${b}" ${O}/><path d="M78 64 C71 38 72 23 77 22 C83 22 85 40 84 64 Z" fill="${p}"/>
      <path d="M110 70 C116 36 128 20 140 25 C151 30 138 54 124 76 Z" fill="${b}" ${O}/><path d="M116 64 C121 42 130 32 137 35 C142 39 132 54 122 68 Z" fill="${p}"/>
      <circle cx="148" cy="156" r="12" fill="#ffffff" ${O}/>
      <ellipse cx="100" cy="150" rx="48" ry="31" fill="${b}" ${O}/>
      <ellipse cx="78" cy="178" rx="16" ry="6" fill="${b}" ${O}/><ellipse cx="122" cy="178" rx="16" ry="6" fill="${b}" ${O}/>
      <ellipse cx="100" cy="98" rx="40" ry="33" fill="${b}" ${O}/>
      <path d="M95 105 H105 L100 110 Z" fill="${p}" ${O2}/>`;
    }
  },
  butterfly: {
    label: 'Butterfly', lore: 'Light and bright. Reminds you that small changes add up.', unlock: { type: 'coins', n: 50 }, defaultName: '',
    face: { eyes: [[92, 82], [108, 82]], er: 3.8, mouth: { x: 100, y: 91, type: 'smile' }, blush: [[86, 89], [114, 89]], blushR: 4, zz: [132, 40] },
    art: () => {
      const up = '#c9b3ea', lo = '#f3b9c8', sp = '#fbe7a6', c = '#f4e4c8', ln = '#a78fcf';
      const wing = `<path d="M96 104 C72 62 32 50 22 74 C14 100 48 122 94 118 Z" fill="${up}" ${O}/>
      <path d="M96 118 C64 122 38 142 48 164 C58 182 88 170 98 134 Z" fill="${lo}" ${O}/>
      <path d="M90 108 C70 82 46 72 34 80 M90 124 C72 134 58 150 60 162" fill="none" stroke="${ln}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="46" cy="82" r="7" fill="${sp}" ${O2}/><circle cx="64" cy="98" r="4.5" fill="${sp}" ${O2}/><circle cx="66" cy="154" r="6" fill="${sp}" ${O2}/>`;
      return `${wing}<g transform="translate(200 0) scale(-1 1)">${wing}</g>
      <path d="M92 104 C92 96 108 96 108 104 L106 164 C106 174 94 174 94 164 Z" fill="${c}" ${O}/>
      <path d="M94 122 H106 M94 136 H106 M95 150 H105" stroke="${ln}" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M93 66 C89 52 81 44 74 42 M107 66 C111 52 119 44 126 42" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>
      <circle cx="73" cy="41" r="4.5" fill="${lo}" ${O2}/><circle cx="127" cy="41" r="4.5" fill="${lo}" ${O2}/>
      <circle cx="100" cy="82" r="20" fill="${c}" ${O}/>`;
    }
  },
  kitty: {
    label: 'Kitty', lore: 'Curls up beside your notes and purrs you through every chapter.', unlock: { type: 'coins', n: 60 }, defaultName: '',
    face: { eyes: [[80, 88], [120, 88]], er: 6, mouth: { x: 100, y: 111, type: 'cat' }, blush: [[68, 104], [132, 104]], zz: [150, 44] },
    art: () => {
      const b = '#f1c58c', d = '#d99a58', w = '#fbf1e2', p = '#eab4ad';
      return `<path d="M128 174 C162 178 174 150 162 126 C158 120 150 124 152 131 C160 150 150 164 126 162 Z" fill="${b}" ${O}/>
      <path d="M156 136 L166 132 M158 150 L168 150" stroke="${d}" stroke-width="3" stroke-linecap="round"/>
      <path d="M66 180 C58 146 74 118 100 118 C126 118 142 146 134 180 Z" fill="${b}" ${O}/>
      <path d="M86 126 Q100 162 114 126 Q100 134 86 126 Z" fill="${w}"/>
      <path d="M70 146 L80 148 M70 158 L80 158 M130 146 L120 148 M130 158 L120 158" stroke="${d}" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="86" cy="178" rx="11" ry="6" fill="${w}" ${O2}/><ellipse cx="114" cy="178" rx="11" ry="6" fill="${w}" ${O2}/>
      <path d="M60 78 L62 36 L94 58 Z" fill="${b}" ${O}/><path d="M140 78 L138 36 L106 58 Z" fill="${b}" ${O}/>
      <path d="M66 68 L67 46 L85 58 Z" fill="${p}"/><path d="M134 68 L133 46 L115 58 Z" fill="${p}"/>
      <path d="M54 88 C54 64 74 54 100 54 C126 54 146 64 146 88 C146 112 126 128 100 128 C74 128 54 112 54 88 Z" fill="${b}" ${O}/>
      <path d="M92 58 L94 70 M100 56 V72 M108 58 L106 70" stroke="${d}" stroke-width="3.2" stroke-linecap="round"/>
      <ellipse cx="100" cy="109" rx="18" ry="12" fill="${w}"/>
      <path d="M95 101 H105 L100 107 Z" fill="${p}" ${O2}/>
      <path d="M74 106 L52 102 M74 112 L54 114 M126 106 L148 102 M126 112 L146 114" stroke="${INK}" stroke-width="1.8" stroke-linecap="round" opacity=".7"/>`;
    }
  },
  otter: {
    label: 'Otter', lore: 'Holds its favourite pebble in its paws, the way you keep your best notes.', unlock: { type: 'coins', n: 80 }, defaultName: '',
    face: { eyes: [[83, 80], [117, 80]], er: 5.5, mouth: { x: 100, y: 103, type: 'cat' }, blush: [[71, 94], [129, 94]], zz: [144, 50] },
    art: () => {
      const b = '#8c6549', d = '#6c4b34', l = '#dcc19d';
      return `<path d="M128 168 C160 170 176 156 178 140 C166 152 150 156 130 154 Z" fill="${d}" ${O}/>
      <path d="M60 180 C50 142 58 108 100 108 C142 108 150 142 140 180 Z" fill="${b}" ${O}/>
      <ellipse cx="100" cy="153" rx="27" ry="25" fill="${l}"/>
      <ellipse cx="82" cy="180" rx="13" ry="5" fill="${d}" ${O2}/><ellipse cx="118" cy="180" rx="13" ry="5" fill="${d}" ${O2}/>
      <circle cx="66" cy="58" r="9" fill="${d}" ${O}/><circle cx="134" cy="58" r="9" fill="${d}" ${O}/>
      <ellipse cx="100" cy="84" rx="42" ry="35" fill="${b}" ${O}/>
      <ellipse cx="100" cy="98" rx="28" ry="18" fill="${l}"/>
      <ellipse cx="100" cy="134" rx="15" ry="10" fill="#aaa79a" ${O}/><path d="M93 131 C96 129 100 129 103 130" fill="none" stroke="#d6d3c6" stroke-width="2" stroke-linecap="round"/>
      <ellipse cx="84" cy="134" rx="8" ry="7" fill="${d}" ${O2}/><ellipse cx="116" cy="134" rx="8" ry="7" fill="${d}" ${O2}/>
      <path d="M93 91 Q100 87 107 91 Q104 97 100 97 Q96 97 93 91 Z" fill="${INK}"/>
      <path d="M76 99 L62 96 M76 103 L62 105 M124 99 L138 96 M124 103 L138 105" stroke="${INK}" stroke-width="1.6" stroke-linecap="round" fill="none"/>`;
    }
  },
  dog: {
    label: 'Dog', lore: 'Loyal and happy to see you, every single session.', unlock: { type: 'coins', n: 100 }, defaultName: '',
    face: { eyes: [[80, 86], [120, 86]], er: 6, mouth: { x: 100, y: 112, type: 'cat' }, blush: [[66, 104], [134, 104]], zz: [152, 44] },
    art: () => {
      const b = '#dcaa70', e = '#8f6340', l = '#f7e6c9', sp = '#c48a52';
      return `<path d="M132 160 C150 150 158 132 152 118 C148 114 142 118 144 126 C148 140 140 150 128 152 Z" fill="${b}" ${O}/>
      <path d="M66 180 C58 146 74 118 100 118 C126 118 142 146 134 180 Z" fill="${b}" ${O}/>
      <path d="M86 128 Q100 164 114 128 Q100 136 86 128 Z" fill="${l}"/>
      <ellipse cx="86" cy="178" rx="11" ry="6" fill="${l}" ${O2}/><ellipse cx="114" cy="178" rx="11" ry="6" fill="${l}" ${O2}/>
      <path d="M56 86 C56 62 76 52 100 52 C124 52 144 62 144 86 C144 112 124 128 100 128 C76 128 56 112 56 86 Z" fill="${b}" ${O}/>
      <ellipse cx="121" cy="84" rx="14" ry="13" fill="${sp}"/>
      <ellipse cx="100" cy="109" rx="22" ry="15" fill="${l}"/>
      <path d="M62 64 C42 62 34 84 40 106 C44 118 58 114 62 102 C65 90 67 76 62 64 Z" fill="${e}" ${O}/>
      <path d="M138 64 C158 62 166 84 160 106 C156 118 142 114 138 102 C135 90 133 76 138 64 Z" fill="${e}" ${O}/>
      <ellipse cx="100" cy="101" rx="7.5" ry="5.2" fill="${INK}"/><circle cx="97.5" cy="99.5" r="1.6" fill="#fff" opacity=".8"/>
      <path d="M74 124 Q100 138 126 124" fill="none" stroke="#d9675a" stroke-width="6" stroke-linecap="round"/>
      <circle cx="100" cy="135" r="5" fill="#efc15a" ${O2}/>`;
    }
  },
  panda: {
    label: 'Panda', lore: 'Munches bamboo between chapters and never rushes a good nap.', unlock: { type: 'coins', n: 140 }, defaultName: '',
    face: { eyes: [[80, 91], [120, 91]], er: 4.4, whites: [[80, 90, 7.5], [120, 90, 7.5]], lid: '#3f3a37', mouth: { x: 100, y: 113, type: 'cat' }, blush: [[64, 110], [136, 110]], zz: [152, 44] },
    art: () => {
      const w = '#f6f3ec', k = '#3f3a37', g = '#8fb069';
      return `<path d="M140 118 L152 72 M152 72 L162 66 M146 92 L156 90" stroke="${g}" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M152 74 C162 64 172 66 174 72 C166 76 158 78 152 74 Z" fill="${g}" ${O2}/>
      <path d="M64 180 C56 146 72 120 100 120 C128 120 144 146 136 180 Z" fill="${w}" ${O}/>
      <path d="M64 150 C70 132 84 124 100 124 C116 124 130 132 136 150 C128 146 118 144 100 144 C82 144 72 146 64 150 Z" fill="${k}"/>
      <ellipse cx="84" cy="176" rx="13" ry="7" fill="${k}" ${O2}/><ellipse cx="116" cy="176" rx="13" ry="7" fill="${k}" ${O2}/>
      <ellipse cx="136" cy="128" rx="9" ry="12" fill="${k}" ${O2} transform="rotate(-20 136 128)"/>
      <circle cx="64" cy="58" r="15" fill="${k}" ${O}/><circle cx="136" cy="58" r="15" fill="${k}" ${O}/>
      <path d="M52 92 C52 66 72 54 100 54 C128 54 148 66 148 92 C148 116 128 132 100 132 C72 132 52 116 52 92 Z" fill="${w}" ${O}/>
      <ellipse cx="78" cy="92" rx="13" ry="16" fill="${k}" transform="rotate(25 78 92)"/><ellipse cx="122" cy="92" rx="13" ry="16" fill="${k}" transform="rotate(-25 122 92)"/>
      <ellipse cx="100" cy="106" rx="6.5" ry="4.6" fill="${k}"/>`;
    }
  },
  fox: {
    label: 'Fox', lore: 'Clever and curious. Loves a fresh question more than an answer.', unlock: { type: 'coins', n: 120 }, defaultName: '',
    face: { eyes: [[80, 86], [120, 86]], er: 5.5, mouth: { x: 100, y: 112, type: 'cat' }, blush: [[67, 100], [133, 100]], zz: [148, 42] },
    art: () => {
      const o = '#dc844b', w = '#f7ecdb', k = INK;
      const head = 'M52 82 C52 60 74 52 100 52 C126 52 148 60 148 82 C148 108 126 128 100 128 C74 128 52 108 52 82 Z';
      return `<path d="M126 170 C176 172 192 124 168 94 C170 126 152 146 122 148 Z" fill="${o}" ${O}/>
      <path d="M168 94 C178 106 183 120 181 134 C172 126 167 110 168 94 Z" fill="${w}" ${O2}/>
      <path d="M64 180 C56 144 72 116 100 116 C128 116 144 144 136 180 Z" fill="${o}" ${O}/>
      <path d="M84 124 Q100 166 116 124 Q100 132 84 124 Z" fill="${w}"/>
      <ellipse cx="86" cy="179" rx="11" ry="5" fill="${k}"/><ellipse cx="114" cy="179" rx="11" ry="5" fill="${k}"/>
      <path d="M58 80 L64 30 L96 62 Z" fill="${o}" ${O}/><path d="M142 80 L136 30 L104 62 Z" fill="${o}" ${O}/>
      <path d="M66 68 L68 42 L85 60 Z" fill="${k}" opacity=".72"/><path d="M134 68 L132 42 L115 60 Z" fill="${k}" opacity=".72"/>
      <path d="${head}" fill="${o}"/>
      <path d="M58 94 C70 104 86 104 100 100 C114 104 130 104 142 94 C138 116 120 128 100 128 C80 128 62 116 58 94 Z" fill="${w}"/>
      <path d="${head}" fill="none" ${O}/>
      <ellipse cx="100" cy="103" rx="6.5" ry="4.8" fill="${k}"/>`;
    }
  },
  horse: {
    label: 'Horse', lore: 'Strong and gentle. Carries you through the long study days.', unlock: { type: 'coins', n: 160 }, defaultName: '',
    face: { eyes: [[80, 80], [120, 80]], er: 5.5, mouth: { x: 100, y: 124, type: 'smile' }, blush: [[64, 96], [136, 96]], zz: [150, 40] },
    art: () => {
      const b = '#b77a4e', d = '#8c5a38', m = '#5a3a2a', l = '#ecd2b2', h = '#4a372c';
      return `<path d="M132 150 C162 146 176 162 170 184 C160 176 150 170 136 170 Z" fill="${m}" ${O}/>
      <path d="M62 180 C54 146 72 118 100 118 C128 118 146 146 138 180 Z" fill="${b}" ${O}/>
      <path d="M84 128 Q100 150 116 128 Q100 136 84 128 Z" fill="${l}" opacity=".8"/>
      <rect x="74" y="160" width="18" height="20" rx="6" fill="${b}" ${O2}/><rect x="108" y="160" width="18" height="20" rx="6" fill="${b}" ${O2}/>
      <ellipse cx="83" cy="180" rx="11" ry="5" fill="${h}"/><ellipse cx="117" cy="180" rx="11" ry="5" fill="${h}"/>
      <path d="M66 52 L70 18 L90 44 Z" fill="${b}" ${O}/><path d="M134 52 L130 18 L110 44 Z" fill="${b}" ${O}/>
      <path d="M72 46 L73 28 L84 43 Z" fill="${d}"/><path d="M128 46 L127 28 L116 43 Z" fill="${d}"/>
      <path d="M62 84 C60 56 78 42 100 42 C122 42 140 56 138 84 C137 100 134 110 130 118 L70 118 C66 110 63 100 62 84 Z" fill="${b}" ${O}/>
      <ellipse cx="100" cy="116" rx="30" ry="21" fill="${l}" ${O}/>
      <ellipse cx="89" cy="112" rx="3.6" ry="2.8" fill="${d}"/><ellipse cx="111" cy="112" rx="3.6" ry="2.8" fill="${d}"/>
      <path d="M82 50 C86 34 98 30 104 40 C108 30 120 34 118 50 C112 44 106 50 100 56 C94 50 88 46 82 50 Z" fill="${m}" ${O2}/>
      <path d="M100 60 L96 70 L104 70 Z" fill="#f4ecdf"/>`;
    }
  },
  deer: {
    label: 'Deer', lore: 'Quiet and watchful. Notices the small wins you forget to count.', unlock: { type: 'coins', n: 200 }, defaultName: '',
    face: { eyes: [[80, 86], [120, 86]], er: 6, mouth: { x: 100, y: 118, type: 'cat' }, blush: [[66, 102], [134, 102]], zz: [152, 34] },
    art: () => {
      const b = '#c98d5a', d = '#9e6a42', l = '#f3e4cb', a = '#7c5638', k = INK;
      return `<path d="M136 146 C146 138 156 142 152 152 C148 156 140 154 136 146 Z" fill="${l}" ${O2}/>
      <path d="M64 180 C56 146 72 120 100 120 C128 120 144 146 136 180 Z" fill="${b}" ${O}/>
      <path d="M86 130 Q100 168 114 130 Q100 138 86 130 Z" fill="${l}"/>
      <circle cx="74" cy="150" r="3.2" fill="${l}"/><circle cx="80" cy="164" r="2.6" fill="${l}"/><circle cx="126" cy="150" r="3.2" fill="${l}"/><circle cx="120" cy="164" r="2.6" fill="${l}"/>
      <ellipse cx="86" cy="179" rx="10" ry="5" fill="${k}"/><ellipse cx="114" cy="179" rx="10" ry="5" fill="${k}"/>
      <path d="M78 52 C74 40 70 30 62 24 M72 38 C66 38 60 34 56 30 M122 52 C126 40 130 30 138 24 M128 38 C134 38 140 34 144 30" fill="none" stroke="${a}" stroke-width="5.5" stroke-linecap="round"/>
      <path d="M78 52 C74 40 70 30 62 24 M72 38 C66 38 60 34 56 30 M122 52 C126 40 130 30 138 24 M128 38 C134 38 140 34 144 30" fill="none" stroke="#a87b55" stroke-width="2" stroke-linecap="round"/>
      <path d="M66 72 C50 72 34 64 30 56 C42 52 58 56 70 64 Z" fill="${b}" ${O}/><path d="M134 72 C150 72 166 64 170 56 C158 52 142 56 130 64 Z" fill="${b}" ${O}/>
      <path d="M62 68 C48 66 40 62 37 58 C46 57 56 60 64 64 Z" fill="#eab4ad"/><path d="M138 68 C152 66 160 62 163 58 C154 57 144 60 136 64 Z" fill="#eab4ad"/>
      <path d="M60 86 C60 62 78 50 100 50 C122 50 140 62 140 86 C140 112 122 130 100 130 C78 130 60 112 60 86 Z" fill="${b}" ${O}/>
      <path d="M80 104 C84 96 92 94 100 94 C108 94 116 96 120 104 C120 120 112 128 100 128 C88 128 80 120 80 104 Z" fill="${l}"/>
      <path d="M60 86 C60 62 78 50 100 50 C122 50 140 62 140 86 C140 112 122 130 100 130 C78 130 60 112 60 86 Z" fill="none" ${O}/>
      <ellipse cx="100" cy="107" rx="7" ry="5" fill="${k}"/>
      <circle cx="90" cy="62" r="2.4" fill="${l}"/><circle cx="110" cy="62" r="2.4" fill="${l}"/><circle cx="100" cy="58" r="2" fill="${l}"/>`;
    }
  },
  wolf: {
    label: 'Wolf', lore: 'Brave and loyal to the pack. Howls for every goal you reach.', unlock: { type: 'coins', n: 240 }, defaultName: '',
    face: { eyes: [[80, 88], [120, 88]], er: 5.5, mouth: { x: 100, y: 115, type: 'cat' }, blush: [[66, 104], [134, 104]], zz: [154, 38] },
    art: () => {
      const g = '#919ca6', d = '#5f6b76', l = '#eef0f2';
      return `<path d="M126 170 C172 174 190 130 168 102 C170 130 154 146 122 150 Z" fill="${g}" ${O}/>
      <path d="M168 102 C180 114 184 130 180 144 C172 134 166 118 168 102 Z" fill="${l}" ${O2}/>
      <path d="M64 180 C56 144 72 118 100 118 C128 118 144 144 136 180 Z" fill="${g}" ${O}/>
      <path d="M80 122 L87 138 L93 128 L100 146 L107 128 L113 138 L120 122 Q100 130 80 122 Z" fill="${l}"/>
      <ellipse cx="86" cy="179" rx="11" ry="5" fill="${d}"/><ellipse cx="114" cy="179" rx="11" ry="5" fill="${d}"/>
      <path d="M58 82 L62 24 L94 58 Z" fill="${g}" ${O}/><path d="M142 82 L138 24 L106 58 Z" fill="${g}" ${O}/>
      <path d="M66 68 L67 38 L85 58 Z" fill="${d}" opacity=".8"/><path d="M134 68 L133 38 L115 58 Z" fill="${d}" opacity=".8"/>
      <path d="M50 88 C50 62 72 52 100 52 C128 52 150 62 150 88 C150 98 156 104 148 110 C150 118 140 122 136 118 C126 128 114 132 100 132 C86 132 74 128 64 118 C60 122 50 118 52 110 C44 104 50 98 50 88 Z" fill="${g}" ${O}/>
      <path d="M66 98 C76 106 88 106 100 100 C112 106 124 106 134 98 C134 120 118 130 100 130 C82 130 66 120 66 98 Z" fill="${l}"/>
      <path d="M100 58 C94 66 92 76 100 86 C108 76 106 66 100 58 Z" fill="${d}" opacity=".55"/>
      <ellipse cx="100" cy="106" rx="7" ry="5" fill="${INK}"/>`;
    }
  },
  dragon: {
    label: 'Dragon', lore: 'A tiny dragon with a big heart. Breathes warm courage before exams.', unlock: { type: 'coins', n: 300 }, defaultName: '',
    face: { eyes: [[80, 86], [120, 86]], er: 6.5, mouth: { x: 100, y: 117, type: 'wide', w: 11 }, blush: [[64, 102], [136, 102]], zz: [156, 38] },
    art: () => {
      const b = '#83bca7', w = '#5f9a86', y = '#f3e3b3', h = '#f1cf7d';
      const wing = `<path d="M70 130 C52 108 34 104 24 114 C34 118 36 126 32 134 C42 132 48 136 50 144 C56 140 64 142 70 146 Z" fill="${w}" ${O}/>`;
      return `<path d="M128 170 C158 176 176 160 176 140 C184 140 192 132 188 122 C178 126 172 132 170 140 C168 156 152 164 126 160 Z" fill="${b}" ${O}/>
      ${wing}<g transform="translate(200 0) scale(-1 1)">${wing}</g>
      <path d="M64 180 C56 146 72 118 100 118 C128 118 144 146 136 180 Z" fill="${b}" ${O}/>
      <path d="M84 130 C90 124 110 124 116 130 C120 152 114 172 100 174 C86 172 80 152 84 130 Z" fill="${y}" ${O2}/>
      <path d="M86 142 H114 M86 154 H114 M88 165 H112" stroke="${INK}" stroke-width="1.8" stroke-linecap="round" opacity=".45"/>
      <ellipse cx="84" cy="179" rx="12" ry="6" fill="${b}" ${O2}/><ellipse cx="116" cy="179" rx="12" ry="6" fill="${b}" ${O2}/>
      <path d="M70 62 C62 44 64 32 72 28 C76 40 80 50 84 58 Z" fill="${h}" ${O2}/><path d="M130 62 C138 44 136 32 128 28 C124 40 120 50 116 58 Z" fill="${h}" ${O2}/>
      <path d="M88 58 L94 42 L100 56 L106 42 L112 58 Z" fill="${w}" ${O2}/>
      <path d="M54 88 C54 62 74 52 100 52 C126 52 146 62 146 88 C146 112 126 128 100 128 C74 128 54 112 54 88 Z" fill="${b}" ${O}/>
      <ellipse cx="100" cy="111" rx="25" ry="14" fill="${y}"/>
      <ellipse cx="92" cy="106" rx="2.6" ry="2" fill="${w}"/><ellipse cx="108" cy="106" rx="2.6" ry="2" fill="${w}"/>
      <path d="M62 74 q4 -4 8 0 M130 74 q4 -4 8 0" fill="none" stroke="${w}" stroke-width="2.2" stroke-linecap="round"/>`;
    }
  },
  triceratops: {
    label: 'Triceratops', lore: 'Three horns, one goal. Charges through a reading list without stopping.', unlock: { type: 'coins', n: 220 }, defaultName: '',
    face: { eyes: [[80, 86], [120, 86]], er: 5.5, mouth: { x: 100, y: 121, type: 'cat' }, blush: [[66, 104], [134, 104]], zz: [152, 40] },
    art: () => {
      const b = '#86a9c9', d = '#6a8db0', fr = '#f0b97a', l = '#c9dcea', h = '#f7ecd6';
      return `<path d="M132 160 C164 162 182 146 186 128 C172 142 152 148 128 146 Z" fill="${b}" ${O}/>
      <path d="M34 94 C32 52 62 26 100 26 C138 26 168 52 166 94 Z" fill="${fr}" ${O}/>
      <circle cx="46" cy="70" r="5" fill="${d}" opacity=".5"/><circle cx="66" cy="44" r="5" fill="${d}" opacity=".5"/><circle cx="100" cy="34" r="5" fill="${d}" opacity=".5"/><circle cx="134" cy="44" r="5" fill="${d}" opacity=".5"/><circle cx="154" cy="70" r="5" fill="${d}" opacity=".5"/>
      <rect x="64" y="156" width="22" height="24" rx="9" fill="${d}" ${O}/><rect x="114" y="156" width="22" height="24" rx="9" fill="${d}" ${O}/>
      <path d="M56 176 C50 144 70 122 100 122 C130 122 150 144 144 176 C140 182 60 182 56 176 Z" fill="${b}" ${O}/>
      <ellipse cx="100" cy="160" rx="24" ry="15" fill="${l}"/>
      <path d="M54 92 C54 68 74 58 100 58 C126 58 146 68 146 92 C146 118 126 134 100 134 C74 134 54 118 54 92 Z" fill="${b}" ${O}/>
      <path d="M78 66 L66 36 L90 60 Z" fill="${h}" ${O2}/><path d="M122 66 L134 36 L110 60 Z" fill="${h}" ${O2}/>
      <ellipse cx="100" cy="114" rx="24" ry="15" fill="${l}" ${O2}/>
      <path d="M93 104 L100 86 L107 104 Z" fill="${h}" ${O2}/>`;
    }
  },
  stegosaurus: {
    label: 'Stegosaurus', lore: 'Slow and steady, with a plate for every finished pebble.', unlock: { type: 'coins', n: 260 }, defaultName: '',
    face: { eyes: [[84, 84], [116, 84]], er: 5, mouth: { x: 100, y: 106, type: 'wide', w: 12 }, blush: [[72, 98], [128, 98]], zz: [148, 40] },
    art: () => {
      const b = '#9bbd6a', d = '#7c9c50', pl = '#e6a86a', l = '#d7e6b0';
      return `<path d="M134 162 C166 164 182 150 186 132 C172 144 154 150 130 148 Z" fill="${b}" ${O}/>
      <path d="M176 138 L190 124 L184 144 Z" fill="${pl}" ${O2}/><path d="M184 130 L198 120 L188 138 Z" fill="${pl}" ${O2}/>
      <path d="M0 12 L-10 0 L-7 -15 L0 -22 L7 -15 L10 0 Z" transform="translate(46 148) rotate(-62) scale(1.25)" fill="${pl}" ${O2}/><path d="M0 12 L-10 0 L-7 -15 L0 -22 L7 -15 L10 0 Z" transform="translate(50 124) rotate(-42) scale(1.25)" fill="${pl}" ${O2}/><path d="M0 12 L-10 0 L-7 -15 L0 -22 L7 -15 L10 0 Z" transform="translate(64 104) rotate(-22) scale(1.25)" fill="${pl}" ${O2}/><path d="M0 12 L-10 0 L-7 -15 L0 -22 L7 -15 L10 0 Z" transform="translate(154 148) rotate(62) scale(1.25)" fill="${pl}" ${O2}/><path d="M0 12 L-10 0 L-7 -15 L0 -22 L7 -15 L10 0 Z" transform="translate(150 124) rotate(42) scale(1.25)" fill="${pl}" ${O2}/><path d="M0 12 L-10 0 L-7 -15 L0 -22 L7 -15 L10 0 Z" transform="translate(136 104) rotate(22) scale(1.25)" fill="${pl}" ${O2}/>
      <rect x="62" y="158" width="22" height="22" rx="9" fill="${d}" ${O}/><rect x="116" y="158" width="22" height="22" rx="9" fill="${d}" ${O}/>
      <path d="M54 178 C48 142 70 116 100 116 C130 116 152 142 146 178 C142 184 58 184 54 178 Z" fill="${b}" ${O}/>
      <ellipse cx="100" cy="160" rx="24" ry="16" fill="${l}"/>
      <circle cx="66" cy="148" r="4" fill="${d}"/><circle cx="136" cy="146" r="5" fill="${d}"/><circle cx="128" cy="166" r="3" fill="${d}"/>
      <path d="M86 58 L92 42 L99 56 Z M99 56 L104 38 L110 56 Z M110 58 L116 44 L121 60 Z" fill="${pl}" ${O2}/>
      <path d="M60 86 C60 64 78 54 100 54 C122 54 140 64 140 86 C140 110 122 124 100 124 C78 124 60 110 60 86 Z" fill="${b}" ${O}/>
      <circle cx="76" cy="66" r="3" fill="${d}"/><circle cx="126" cy="68" r="2.5" fill="${d}"/>`;
    }
  },
  longneck: {
    label: 'Longneck', lore: 'Sees the whole syllabus from up high. Never panics about a deadline.', unlock: { type: 'coins', n: 280 }, defaultName: '',
    face: { eyes: [[63, 44], [81, 44]], er: 4.2, mouth: { x: 72, y: 53, type: 'cat' }, blush: [[56, 52], [89, 52]], blushR: 5, zz: [100, 20] },
    art: () => {
      const b = '#a9c7d8', d = '#87a9bd', l = '#dbe9f0';
      const neck = 'M88 138 C74 110 66 84 70 52';
      return `<path d="M140 160 C172 160 188 146 194 128 C178 142 160 150 136 148 Z" fill="${b}" ${O}/>
      <rect x="128" y="150" width="20" height="30" rx="8" fill="${d}" ${O}/><rect x="60" y="150" width="20" height="30" rx="8" fill="${d}" ${O}/>
      <ellipse cx="106" cy="146" rx="52" ry="30" fill="${b}" ${O}/>
      <rect x="84" y="156" width="20" height="26" rx="8" fill="${b}" ${O}/><rect x="114" y="156" width="20" height="26" rx="8" fill="${b}" ${O}/>
      <circle cx="118" cy="132" r="5" fill="${d}"/><circle cx="136" cy="142" r="4" fill="${d}"/><circle cx="104" cy="126" r="3" fill="${d}"/>
      <path d="${neck}" fill="none" stroke="${INK}" stroke-width="28" stroke-linecap="round"/>
      <path d="${neck}" fill="none" stroke="${b}" stroke-width="22" stroke-linecap="round"/>
      <ellipse cx="90" cy="140" rx="14" ry="12" fill="${b}"/>
      <path d="M74 96 C76 84 78 72 77 62" fill="none" stroke="${l}" stroke-width="6" stroke-linecap="round" opacity=".8"/>
      <ellipse cx="72" cy="46" rx="24" ry="18" fill="${b}" ${O}/>`;
    }
  },
  trex: {
    label: 'T. rex', lore: 'Tiny arms, huge ambition. Roars at procrastination.', unlock: { type: 'coins', n: 320 }, defaultName: '',
    face: { eyes: [[78, 82], [122, 82]], er: 6, mouth: { x: 100, y: 113, type: 'wide', w: 18 }, blush: [[62, 100], [138, 100]], zz: [152, 38] },
    art: () => {
      const b = '#d9874f', d = '#b96c3a', l = '#f2d3a2';
      return `<path d="M130 160 C168 160 188 136 186 110 C176 134 156 144 128 146 Z" fill="${b}" ${O}/>
      <ellipse cx="80" cy="176" rx="16" ry="7" fill="${d}" ${O}/><ellipse cx="120" cy="176" rx="16" ry="7" fill="${d}" ${O}/>
      <path d="M62 180 C54 146 70 120 100 120 C130 120 146 146 138 180 Z" fill="${b}" ${O}/>
      <ellipse cx="100" cy="158" rx="22" ry="18" fill="${l}"/>
      <ellipse cx="70" cy="144" rx="8" ry="5" fill="${b}" ${O2} transform="rotate(30 70 144)"/><ellipse cx="130" cy="144" rx="8" ry="5" fill="${b}" ${O2} transform="rotate(-30 130 144)"/>
      <path d="M82 50 L88 34 L97 47 Z M98 46 L104 30 L112 46 Z M113 49 L120 36 L126 52 Z" fill="${d}" ${O2}/>
      <path d="M46 84 C46 58 70 46 100 46 C130 46 154 58 154 84 C154 112 132 128 100 128 C68 128 46 112 46 84 Z" fill="${b}" ${O}/>
      <ellipse cx="91" cy="100" rx="2.8" ry="2" fill="${INK}"/><ellipse cx="109" cy="100" rx="2.8" ry="2" fill="${INK}"/>
      <path d="M86 112 L89 119 L92 112 Z M108 112 L111 119 L114 112 Z" fill="#fff" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>
      <circle cx="66" cy="64" r="3" fill="${d}"/><circle cx="136" cy="62" r="3.5" fill="${d}"/><circle cx="144" cy="74" r="2.4" fill="${d}"/>`;
    }
  },
  turtle: {
    label: 'Turtle', lore: 'Slow and steady. Trusts you after seven days in a row.', unlock: { type: 'streak', n: 7 }, defaultName: '',
    face: { eyes: [[158, 121], [178, 121]], er: 4.6, mouth: { x: 168, y: 135, type: 'smile' }, blush: [[152, 133], [185, 133]], blushR: 6, zz: [178, 80] },
    art: () => {
      const sh = '#7e9a5d', rim = '#64804b', pl = '#a6bb7b', sk = '#bcc78d';
      return `<ellipse cx="52" cy="168" rx="15" ry="9" fill="${sk}" ${O}/><ellipse cx="128" cy="170" rx="15" ry="9" fill="${sk}" ${O}/>
      <path d="M30 150 L14 157 L32 162 Z" fill="${sk}" ${O}/>
      <path d="M138 142 C140 118 150 102 166 102 C184 102 192 118 188 134 C184 150 166 156 150 154 Z" fill="${sk}" ${O}/>
      <path d="M30 154 C30 106 58 82 92 82 C126 82 152 106 152 154 Z" fill="${sh}" ${O}/>
      <path d="M72 102 L92 93 L112 102 L112 121 L92 130 L72 121 Z" fill="${pl}" ${O2}/>
      <path d="M44 132 L60 118 L72 124 L72 144 L46 146 Z" fill="${pl}" ${O2}/>
      <path d="M112 124 L124 118 L140 130 L138 146 L112 144 Z" fill="${pl}" ${O2}/>
      <path d="M24 154 C24 148 30 146 36 146 H146 C152 146 158 148 158 154 C158 162 152 165 146 165 H36 C30 165 24 162 24 154 Z" fill="${rim}" ${O}/>
      <path d="M50 150 v10 M76 150 v10 M102 150 v10 M128 150 v10" stroke="${INK}" stroke-width="2" stroke-linecap="round" opacity=".55"/>`;
    }
  },
  axolotl: {
    label: 'Axolotl', lore: 'Smiles through everything. Arrives after a 14-day streak.', unlock: { type: 'streak', n: 14 }, defaultName: '',
    face: { eyes: [[78, 102], [122, 102]], er: 6.5, mouth: { x: 100, y: 121, type: 'wide', w: 15 }, blush: [[64, 116], [136, 116]], zz: [152, 56] },
    art: () => {
      const p = '#f3bcc1', d = '#e49aa3', g = '#dd7488';
      const gl = `<path d="M56 86 C38 70 28 74 31 83 C40 86 48 90 56 95 Z" fill="${g}" ${O2}/><path d="M52 101 C32 97 25 104 29 111 C38 109 46 109 54 109 Z" fill="${g}" ${O2}/><path d="M57 116 C42 123 37 132 43 136 C49 130 55 125 61 121 Z" fill="${g}" ${O2}/>`;
      return `<path d="M140 150 C168 146 186 132 192 112 C178 142 160 162 134 168 Z" fill="${p}" ${O}/>
      ${gl}<g transform="translate(200 0) scale(-1 1)">${gl}</g>
      <ellipse cx="112" cy="155" rx="42" ry="22" fill="${p}" ${O}/>
      <ellipse cx="86" cy="175" rx="10" ry="6" fill="${p}" ${O2}/><ellipse cx="134" cy="175" rx="10" ry="6" fill="${p}" ${O2}/>
      <ellipse cx="100" cy="106" rx="50" ry="38" fill="${p}" ${O}/>
      <circle cx="86" cy="78" r="3" fill="${d}"/><circle cx="112" cy="76" r="2.4" fill="${d}"/><circle cx="126" cy="84" r="2" fill="${d}"/><circle cx="120" cy="160" r="3" fill="${d}"/><circle cx="138" cy="150" r="2.4" fill="${d}"/>`;
    }
  },
  swan: {
    label: 'Swan', lore: 'Glides across the pond without a ripple. Calm focus, graceful finish.', unlock: { type: 'coins', n: 180 }, defaultName: '',
    face: { eyes: [[74, 52], [88, 52]], er: 4.2, mouth: null, blush: [[70, 62], [94, 62]], blushR: 5, zz: [118, 22] },
    art: (st) => {
      const w = '#fbf8f1', sh = '#e6e1d6', bk = '#e98a45', k = INK;
      const neck = 'M86 152 C60 130 50 104 64 84 C72 72 78 66 78 54';
      const beak = st === 'happy'
        ? `<path d="M64 54 L40 52 L62 60 Z" fill="${bk}" ${O2}/><path d="M63 61 L42 66 L64 64 Z" fill="${bk}" ${O2}/>`
        : `<path d="M64 53 C54 54 46 57 40 61 C48 64 56 64 64 63 Z" fill="${bk}" ${O2}/>`;
      return `<path d="M150 146 L186 122 L170 156 Z" fill="${w}" ${O}/>
      <path d="M58 150 C56 132 76 122 112 122 C150 122 172 134 170 152 C168 172 142 182 110 182 C78 182 60 172 58 150 Z" fill="${w}" ${O}/>
      <path d="${neck}" fill="none" stroke="${k}" stroke-width="22" stroke-linecap="round"/>
      <path d="${neck}" fill="none" stroke="${w}" stroke-width="16" stroke-linecap="round"/>
      <ellipse cx="86" cy="154" rx="14" ry="13" fill="${w}"/>
      <path d="M96 140 C112 116 150 110 176 122 C170 146 140 160 106 158 C100 152 96 146 96 140 Z" fill="${sh}" ${O}/>
      <path d="M118 136 C132 130 146 130 158 134 M114 148 C130 142 146 142 160 146" fill="none" stroke="#c9c2b4" stroke-width="2.4" stroke-linecap="round"/>
      <circle cx="80" cy="54" r="18" fill="${w}" ${O}/>
      <path d="M66 46 C62 50 62 58 66 62 L62 58 C60 54 61 50 66 46 Z" fill="${k}"/>
      ${beak}
      <path d="M48 186 C70 180 90 190 110 186 C130 182 150 190 172 186" fill="none" stroke="#8fb7c4" stroke-width="3" stroke-linecap="round" opacity=".7"/>`;
    }
  },
  heron: {
    label: 'Heron', lore: 'Patient guardian of the pond. Lands after a 30-day streak.', unlock: { type: 'streak', n: 30 }, defaultName: '',
    face: { eyes: [[85, 56], [100, 56]], er: 4.2, mouth: null, blush: [[79, 67], [103, 68]], blushR: 5, zz: [124, 22] },
    art: (st) => {
      const b = '#a2b3bd', l = '#e5ebed', d = '#5f717c', wg = '#7f919b', bk = '#e2b04f', lg = '#c79f4b';
      const beak = st === 'happy'
        ? `<path d="M108 54 L156 52 L108 62 Z" fill="${bk}" ${O2}/><path d="M108 64 L152 70 L108 68 Z" fill="${bk}" ${O2}/>`
        : `<path d="M108 56 L158 62 L108 68 Z" fill="${bk}" ${O2}/>`;
      return `<path d="M96 150 L96 186 M88 186 H104" stroke="${lg}" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M110 150 L120 164 L107 168" stroke="${lg}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M140 146 L172 160 L146 158 Z" fill="${d}" ${O2}/>
      <path d="M58 124 C58 100 92 94 122 106 C150 118 160 144 142 152 C116 162 66 154 58 124 Z" fill="${b}" ${O}/>
      <path d="M84 112 C110 108 136 118 150 140 C128 150 98 146 86 132 Z" fill="${wg}" ${O2}/>
      <path d="M64 120 C52 98 80 88 80 70 L102 68 C104 92 78 100 86 118 Z" fill="${l}" ${O}/>
      <circle cx="92" cy="56" r="21" fill="${l}" ${O}/>
      <path d="M73 49 C77 36 98 32 109 45 C98 42 86 42 73 49 Z" fill="${d}"/>
      <path d="M76 46 C66 40 56 40 48 44 M78 52 C68 50 60 52 54 57" stroke="${d}" stroke-width="3" stroke-linecap="round" fill="none"/>
      ${beak}`;
    }
  }
};
const ANIMAL_KEYS = Object.keys(ANIMALS);

function faceSVG(f, st) {
  let out = '';
  const er = f.er;
  if (f.whites) {
    f.whites.forEach(([x, y, r]) => {
      out += st === 'sleeping'
        ? `<circle cx="${x}" cy="${y}" r="${r}" fill="${f.lid}" ${O2}/>`
        : `<circle cx="${x}" cy="${y}" r="${r}" fill="#fbfaf4" ${O2}/>`;
    });
  }
  const br = f.blushR || 9;
  (f.blush || []).forEach(([x, y]) => { out += `<ellipse cx="${x}" cy="${y}" rx="${br}" ry="${br * .55}" fill="#e7938a" opacity="${st === 'happy' ? .8 : .5}"/>`; });
  if (st === 'awake') {
    out += '<g class="eyes">' + f.eyes.map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="${er * .86}" ry="${er}" fill="${INK}"/><circle cx="${x + er * .34}" cy="${y - er * .38}" r="${er * .36}" fill="#fff"/>`).join('') + '</g>';
  } else if (st === 'sleeping') {
    out += f.eyes.map(([x, y]) => `<path d="M${x - er * 1.15} ${y} Q${x} ${y + er * 1.1} ${x + er * 1.15} ${y}" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`).join('');
  } else {
    out += f.eyes.map(([x, y]) => `<path d="M${x - er * 1.15} ${y + er * .45} Q${x} ${y - er * 1.3} ${x + er * 1.15} ${y + er * .45}" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linecap="round"/>`).join('');
  }
  const m = f.mouth;
  if (m) {
    const { x, y } = m;
    if (st === 'happy') {
      const w = m.type === 'wide' ? m.w : 8;
      out += `<path d="M${x - w} ${y - 1} Q${x} ${y + w * .9 + 6} ${x + w} ${y - 1} Z" fill="#7a3b33" ${O2}/><ellipse cx="${x}" cy="${y + w * .35 + 2}" rx="${w * .45}" ry="${Math.max(2.4, w * .18)}" fill="#e58b86"/>`;
    } else if (m.type === 'wide') {
      const w = st === 'sleeping' ? m.w * .6 : m.w;
      out += `<path d="M${x - w} ${y} Q${x} ${y + 9} ${x + w} ${y}" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`;
    } else if (m.type === 'cat') {
      out += st === 'sleeping'
        ? `<ellipse cx="${x}" cy="${y + 1}" rx="2.6" ry="2.2" fill="${INK}"/>`
        : `<path d="M${x - 7} ${y - 1} Q${x - 3.5} ${y + 5} ${x} ${y - 1} Q${x + 3.5} ${y + 5} ${x + 7} ${y - 1}" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`;
    } else {
      out += st === 'sleeping'
        ? `<path d="M${x - 3} ${y + 1} H${x + 3}" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`
        : `<path d="M${x - 6} ${y} Q${x} ${y + 6} ${x + 6} ${y}" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`;
    }
  }
  return out;
}

function sparkle(x, y, s) {
  return `<path class="spark" d="M${x} ${y - s} C${x + s * .18} ${y - s * .2} ${x + s * .2} ${y - s * .18} ${x + s} ${y} C${x + s * .2} ${y + s * .18} ${x + s * .18} ${y + s * .2} ${x} ${y + s} C${x - s * .18} ${y + s * .2} ${x - s * .2} ${y + s * .18} ${x - s} ${y} C${x - s * .2} ${y - s * .18} ${x - s * .18} ${y - s * .2} ${x} ${y - s} Z" fill="#f4d97c" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`;
}

/* Returns the animal as an SVG string. state: awake | sleeping | happy */
function animalSVG(kind, state = 'awake', opts = {}) {
  const a = ANIMALS[kind] || ANIMALS.frog;
  const f = a.face;
  const label = opts.label || `${a.label}, ${state === 'sleeping' ? 'napping' : state}`;
  const [zx, zy] = f.zz;
  const extras = state === 'sleeping'
    ? `<g class="zz"><text x="${zx}" y="${zy}" font-size="24">z</text><text x="${zx + 12}" y="${zy - 12}" font-size="19">z</text><text x="${zx + 22}" y="${zy - 24}" font-size="15">z</text></g>`
    : state === 'happy' ? sparkle(zx - 2, zy + 6, 11) + sparkle(36, zy + 26, 9) + sparkle(zx + 20, zy + 46, 7) : '';
  const tag = opts.nested ? `<svg x="${opts.x || 0}" y="${opts.y || 0}" width="${opts.w || 200}" height="${opts.w || 200}"` : '<svg';
  return `${tag} class="ga ${state}" viewBox="0 0 200 200" role="img" aria-label="${label}" overflow="visible">
    <ellipse cx="100" cy="182" rx="60" ry="8" fill="rgba(40,30,20,.16)"/>
    <g class="bod"><g${tintFilter(opts.look)}><g filter="url(#gr-wob)">${a.art(state)}</g></g>${faceSVG(f, state)}${lookLayers(kind, opts.look).over}</g>${extras}</svg>`;
}

/* Animal sitting on its own lily pad */
function onPadSVG(kind, state, opts = {}) {
  const bloom = opts.bloom !== false;
  return `<svg viewBox="0 0 240 230" overflow="visible" aria-hidden="${opts.hidden ? 'true' : 'false'}">
    <g transform="translate(120 200)">
      <ellipse cx="0" cy="8" rx="112" ry="20" fill="var(--water-2)" opacity=".55"/>
      <path d="M0 0 L50 -20.8 A100 24 0 1 1 17.4 -23.6 Z" fill="var(--pad)" stroke="var(--pad-2)" stroke-width="3" stroke-linejoin="round"/>
      <path d="M0 0 L-72 9 M0 0 L-26 21 M0 0 L44 18 M0 0 L84 4 M0 0 L-90 -6" stroke="var(--pad-2)" stroke-width="2" opacity=".6" stroke-linecap="round"/>
      ${bloom ? `<g transform="translate(-86 -12)"><path d="M0 0 C-10 -6 -12 -18 -6 -24 C-2 -16 0 -10 0 0 Z M0 0 C10 -6 12 -18 6 -24 C2 -16 0 -10 0 0 Z M0 0 C-5 -10 -4 -22 0 -28 C4 -22 5 -10 0 0 Z" fill="var(--bloom)" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/></g>` : ''}
    </g>
    ${animalSVG(kind, state, { nested: true, x: 20, y: 6, w: 200, label: opts.label, look: opts.look })}
  </svg>`;
}

/* Small round avatar portrait */
function avatarSVG(kind, state = 'awake', look) {
  return animalSVG(kind, state, { label: (ANIMALS[kind] || ANIMALS.frog).label, look }).replace('viewBox="0 0 200 200"', 'viewBox="10 20 180 180"');
}
