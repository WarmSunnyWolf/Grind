/* ---------- the wardrobe: accessories and colours for each animal ---------- */
// where a hat sits and where a bow tie goes on each animal: [x, y, scale]
const ANCHORS = {
  frog: { hat: [100, 96, .9], neck: [100, 138, .9] }, duckling: { hat: [90, 58, .85], neck: [94, 124, .8] }, capybara: { hat: [86, 48, .95], neck: [86, 140, .9] },
  rabbit: { hat: [100, 72, .85], neck: [100, 142, .8] }, butterfly: { hat: [100, 74, .45], neck: [100, 104, .4] }, kitty: { hat: [100, 60, .95], neck: [100, 128, .85] },
  otter: { hat: [100, 54, .95], neck: [100, 122, .85] }, dog: { hat: [100, 58, .95], neck: [100, 130, .85] }, spider: { hat: [100, 76, .9], neck: [100, 156, .8] }, panda: { hat: [100, 56, .95], neck: [100, 134, .85] },
  fox: { hat: [100, 56, .95], neck: [100, 126, .85] }, horse: { hat: [100, 54, .85], neck: [100, 142, .85] }, deer: { hat: [100, 60, .9], neck: [100, 134, .85] },
  wolf: { hat: [100, 58, .95], neck: [100, 130, .85] }, dragon: { hat: [100, 60, .9], neck: [100, 134, .85] }, triceratops: { hat: [100, 60, .85], neck: [100, 134, .85] },
  stegosaurus: { hat: [100, 56, .85], neck: [100, 126, .85] }, longneck: { hat: [72, 30, .6], neck: [76, 82, .6] }, trex: { hat: [100, 48, 1], neck: [100, 130, .85] },
  turtle: { hat: [168, 106, .55], neck: [160, 146, .5] }, axolotl: { hat: [100, 68, 1], neck: [100, 138, .8] }, swan: { hat: [80, 38, .55], neck: [74, 92, .5] }, sheep: { hat: [100, 62, .85], neck: [100, 126, .8] }, camel: { hat: [64, 40, .6], neck: [66, 104, .55] }, giraffe: { hat: [100, 26, .65], neck: [100, 92, .55] },
  hamster: { hat: [100, 58, .9], neck: [100, 122, .8] }, penguin: { hat: [100, 50, .9], neck: [100, 118, .8] }, parrot: { hat: [100, 32, .8], neck: [100, 100, .7] }, heron: { hat: [92, 37, .6], neck: [86, 86, .5] },
  hedgehog: { hat: [100, 70, .9], neck: [100, 140, .8] }, cow: { hat: [100, 50, .9], neck: [100, 136, .85] }, owl: { hat: [100, 52, .9], neck: [100, 130, .85] }, koala: { hat: [100, 56, .9], neck: [100, 134, .85] }, redpanda: { hat: [100, 52, .9], neck: [100, 130, .85] }
};
// real fur coats: each one swaps the animal's own colours for new ones
const COATS = {"frog":{"golden":{"label":"Golden","map":{"#8fb069":"#e8c15a","#6d8c4c":"#c99b34","#d9e3a8":"#f6e7a6"}},"blue":{"label":"Poison dart blue","map":{"#8fb069":"#5b8fd0","#6d8c4c":"#3f6aa8","#d9e3a8":"#a9c9ef"}},"berry":{"label":"Strawberry","map":{"#8fb069":"#e0746a","#6d8c4c":"#b9514a","#d9e3a8":"#f4c0a8"}}},"duckling":{"snow":{"label":"Snow white","map":{"#ffe49a":"#fbf8f1","#ffcf6b":"#e9e3d6","#fff6d8":"#ffffff"}},"pink":{"label":"Bubblegum","map":{"#ffe49a":"#ffc9d6","#ffcf6b":"#f7a3b8","#fff6d8":"#ffe8ee"}},"mint":{"label":"Mint","map":{"#ffe49a":"#c6ecd3","#ffcf6b":"#9fd6b3","#fff6d8":"#ecfaf0"}},"sky":{"label":"Baby blue","map":{"#ffe49a":"#cfe4fb","#ffcf6b":"#a3c6ef","#fff6d8":"#eef6ff"}}},"capybara":{"cocoa":{"label":"Cocoa","map":{"#e2b98a":"#9a6c52","#c99a6b":"#7a5240","#f6e2c6":"#d9b89c","#f0d2ad":"#b58a6e"}},"honey":{"label":"Honey","map":{"#e2b98a":"#f2c879","#c99a6b":"#d9a650","#f6e2c6":"#fbeac4","#f0d2ad":"#fbe0a6"}},"snow":{"label":"Snow","map":{"#e2b98a":"#efe6dc","#c99a6b":"#cfc0b0","#f6e2c6":"#fbf6f0","#f0d2ad":"#fbf6f0"}},"peach":{"label":"Peach","map":{"#e2b98a":"#f7c0a6","#c99a6b":"#e49c82","#f6e2c6":"#fde6da","#f0d2ad":"#fcd8c6"}}},"rabbit":{"choc":{"label":"Chocolate","map":{"#efe6d8":"#8c6549"}},"grey":{"label":"Silver grey","map":{"#efe6d8":"#b9b6b3"}},"cinnamon":{"label":"Cinnamon","map":{"#efe6d8":"#d8a271","#eab4ad":"#f0c2b0"}}},"butterfly":{"monarch":{"label":"Monarch","map":{"#c9b3ea":"#f0a04b","#f3b9c8":"#e07a3a","#fbe7a6":"#fff3d6","#a78fcf":"#9a5a22"}},"morpho":{"label":"Blue morpho","map":{"#c9b3ea":"#5aa7e0","#f3b9c8":"#3f86c9","#fbe7a6":"#dff1ff","#a78fcf":"#2d5f93"}},"lime":{"label":"Lime","map":{"#c9b3ea":"#b9dd7a","#f3b9c8":"#f4e07a","#fbe7a6":"#fffbe0","#a78fcf":"#7fa64a"}}},"kitty":{"tabby":{"label":"Grey tabby","map":{"#f1c58c":"#b3b6bb","#d99a58":"#868b93","#fbf1e2":"#f2f2f2"}},"black":{"label":"Black cat","map":{"#f1c58c":"#4a4442","#d99a58":"#2f2b2a","#fbf1e2":"#d9d2cc"}},"cream":{"label":"Cream","map":{"#f1c58c":"#f6e6c8","#d99a58":"#e3c89a"}}},"otter":{"sea":{"label":"Sea otter","map":{"#8c6549":"#b08a68","#6c4b34":"#8c6a4e","#dcc19d":"#efdcc0"}},"dark":{"label":"Dark river","map":{"#8c6549":"#5a4234","#6c4b34":"#3f2e24","#dcc19d":"#c7a989"}},"silver":{"label":"Silver","map":{"#8c6549":"#9ea3a6","#6c4b34":"#767c80","#dcc19d":"#e3e5e6"}}},"dog":{"lab":{"label":"Black lab","map":{"#dcaa70":"#4a4442","#8f6340":"#2f2b2a","#f7e6c9":"#d9cfc4","#c48a52":"#3a3533"}},"dalmatian":{"label":"Dalmatian","map":{"#dcaa70":"#f6f3ec","#8f6340":"#3f3a37","#f7e6c9":"#ffffff","#c48a52":"#3f3a37"}},"golden":{"label":"Golden retriever","map":{"#dcaa70":"#e8bd6a","#8f6340":"#c48a3c","#f7e6c9":"#f8e7c0","#c48a52":"#d9a14f"}}},"panda":{"brown":{"label":"Brown panda","map":{"#3f3a37":"#6b4a36","#f6f3ec":"#f0e2cc"}},"blue":{"label":"Midnight blue","map":{"#3f3a37":"#33475e"}},"lilac":{"label":"Lilac","map":{"#3f3a37":"#8a7fb0","#f6f3ec":"#f7f3fb"}}},"fox":{"arctic":{"label":"Arctic fox","map":{"#dc844b":"#e9edf0","#f7ecdb":"#ffffff"}},"silver":{"label":"Silver fox","map":{"#dc844b":"#7f8794","#f7ecdb":"#eef0f2"}},"fennec":{"label":"Fennec sand","map":{"#dc844b":"#e8c48f","#f7ecdb":"#fbf1de"}}},"horse":{"black":{"label":"Black stallion","map":{"#b77a4e":"#3f3a37","#8c5a38":"#2b2725","#5a3a2a":"#1f1c1b","#ecd2b2":"#8a817a","#4a372c":"#1f1c1b"}},"white":{"label":"White mare","map":{"#b77a4e":"#f2eee8","#8c5a38":"#d6cfc5","#5a3a2a":"#c9c2b8","#ecd2b2":"#ffffff","#4a372c":"#b9b0a5"}},"palomino":{"label":"Palomino","map":{"#b77a4e":"#e6be78","#8c5a38":"#c79a52","#5a3a2a":"#f7ecd6","#ecd2b2":"#f8e8cc","#4a372c":"#efe3c8"}}},"deer":{"reindeer":{"label":"Reindeer","map":{"#c98d5a":"#8c6a52","#9e6a42":"#6b4f3c","#f3e4cb":"#e8dccb","#7c5638":"#c9b08a"}},"snow":{"label":"Snow deer","map":{"#c98d5a":"#efe6da","#9e6a42":"#cfc2b2","#f3e4cb":"#ffffff","#7c5638":"#b9a58a"}},"red":{"label":"Red fawn","map":{"#c98d5a":"#b5703e","#9e6a42":"#8c5230","#f3e4cb":"#f6e3c5"}}},"wolf":{"arctic":{"label":"Arctic wolf","map":{"#919ca6":"#e9edf0","#5f6b76":"#b4bec7","#eef0f2":"#ffffff"}},"black":{"label":"Black wolf","map":{"#919ca6":"#3e434a","#5f6b76":"#202429","#eef0f2":"#c9ccd0"}},"timber":{"label":"Timber wolf","map":{"#919ca6":"#9a7a5c","#5f6b76":"#5e4a38","#eef0f2":"#f1e6d6"}},"red":{"label":"Red wolf","map":{"#919ca6":"#c27a4e","#5f6b76":"#7a4a2e","#eef0f2":"#f5e6d3"}}},"dragon":{"ruby":{"label":"Ruby","map":{"#83bca7":"#d9675a","#5f9a86":"#a8483e","#f3e3b3":"#f6dcb4"}},"sapphire":{"label":"Sapphire","map":{"#83bca7":"#6f9fd8","#5f9a86":"#4d78b0","#f3e3b3":"#e6eefb"}},"gold":{"label":"Gold","map":{"#83bca7":"#e8c15a","#5f9a86":"#c99b34","#f3e3b3":"#fbf0c8","#f1cf7d":"#f7ecd6"}},"shadow":{"label":"Shadow","map":{"#83bca7":"#5b5470","#5f9a86":"#3d3850","#f3e3b3":"#c9c2dc","#f1cf7d":"#b9a6e0"}}},"triceratops":{"green":{"label":"Forest","map":{"#86a9c9":"#8fb069","#6a8db0":"#6d8c4c","#c9dcea":"#d9e3a8"}},"violet":{"label":"Violet","map":{"#86a9c9":"#a78fcf","#6a8db0":"#8670b3","#c9dcea":"#e3d9f4","#f0b97a":"#f3b9c8"}},"sunset":{"label":"Sunset","map":{"#86a9c9":"#e9905a","#6a8db0":"#c36d3a","#c9dcea":"#f6d6b8","#f0b97a":"#e8b84a"}}},"stegosaurus":{"ocean":{"label":"Ocean","map":{"#9bbd6a":"#6fa6c9","#7c9c50":"#4f86ab","#d7e6b0":"#cfe4f1","#e6a86a":"#f3b9c8"}},"lava":{"label":"Lava","map":{"#9bbd6a":"#b9514a","#7c9c50":"#8f3a34","#d7e6b0":"#f0c0a8","#e6a86a":"#f4d06f"}},"lilac":{"label":"Lilac","map":{"#9bbd6a":"#b9a6d6","#7c9c50":"#9682bd","#d7e6b0":"#ece4f6","#e6a86a":"#8fcfaa"}}},"longneck":{"leaf":{"label":"Leaf green","map":{"#a9c7d8":"#9bbd6a","#87a9bd":"#7c9c50","#dbe9f0":"#d7e6b0"}},"peach":{"label":"Peach","map":{"#a9c7d8":"#f2b28f","#87a9bd":"#d98e6a","#dbe9f0":"#fbe1d2"}},"lavender":{"label":"Lavender","map":{"#a9c7d8":"#b9a6d6","#87a9bd":"#9682bd","#dbe9f0":"#ece4f6"}}},"trex":{"jungle":{"label":"Jungle","map":{"#d9874f":"#7fa65a","#b96c3a":"#5e8540","#f2d3a2":"#dfe8b8"}},"midnight":{"label":"Midnight","map":{"#d9874f":"#4f5f86","#b96c3a":"#36446a","#f2d3a2":"#c9d2ea"}},"bubblegum":{"label":"Bubblegum","map":{"#d9874f":"#ef9db5","#b96c3a":"#d5768f","#f2d3a2":"#fbe0e8"}}},"turtle":{"sea":{"label":"Sea turtle","map":{"#7e9a5d":"#6f9a8f","#64804b":"#4f7a70","#a6bb7b":"#9cc4b8","#bcc78d":"#b8d8c8"}},"golden":{"label":"Golden","map":{"#7e9a5d":"#c9a14f","#64804b":"#a07e36","#a6bb7b":"#e3c47a"}},"rose":{"label":"Rose shell","map":{"#7e9a5d":"#c98a95","#64804b":"#a8697a","#a6bb7b":"#e6b4bd"}}},"axolotl":{"wild":{"label":"Wild","map":{"#ffd3df":"#8f8a86","#f8b3c7":"#6d6764","#ff8fb0":"#d07a8c","#ec6f95":"#b15e70","#fff0f4":"#b5afa9","#ffe3ea":"#a39d98"}},"golden":{"label":"Golden","map":{"#ffd3df":"#ffe6a3","#f8b3c7":"#f2c86c","#ff8fb0":"#ff9f7a","#ec6f95":"#e9805d","#fff0f4":"#fff6d8","#ffe3ea":"#fff0c4"}},"blue":{"label":"Blue","map":{"#ffd3df":"#c6dcf7","#f8b3c7":"#94b7e3","#ff8fb0":"#7b9ee0","#ec6f95":"#5b7fc4","#fff0f4":"#ecf4ff","#ffe3ea":"#dceafc"}},"lilac":{"label":"Lilac","map":{"#ffd3df":"#e2d3fa","#f8b3c7":"#c3abef","#ff8fb0":"#b28be8","#ec6f95":"#9670d6","#fff0f4":"#f5effe","#ffe3ea":"#ece2fc"}}},"swan":{"black":{"label":"Black swan","map":{"#fbf8f1":"#46404a","#e6e1d6":"#2e2a31","#e98a45":"#d9534f"}},"blush":{"label":"Blush pink","map":{"#fbf8f1":"#f8d3da","#e6e1d6":"#eeb0be"}}},"heron":{"egret":{"label":"White egret","map":{"#a2b3bd":"#f4f2ed","#e5ebed":"#ffffff","#5f717c":"#c9cdd1","#7f919b":"#e3e6e8","#e2b04f":"#f0c64e"}},"purple":{"label":"Purple heron","map":{"#a2b3bd":"#a5869a","#e5ebed":"#efe1e6","#5f717c":"#5e4a58","#7f919b":"#7a6070"}}},"spider":{"peacock":{"label":"Peacock","map":{"#4f4a63":"#3f6aa8","#353144":"#24406e","#8b7fb3":"#e8904a"}},"redback":{"label":"Red back","map":{"#4f4a63":"#3a3535","#353144":"#211e1e","#8b7fb3":"#d9534f"}},"golden":{"label":"Golden orb","map":{"#4f4a63":"#d9a85f","#353144":"#a07436","#8b7fb3":"#f6e3b0"}},"mint":{"label":"Mint","map":{"#4f4a63":"#7fbfa6","#353144":"#4f8f78","#8b7fb3":"#e0f3ea"}}},"sheep":{"black":{"label":"Black sheep","map":{"#f4efe4":"#4a4442","#ddd3c0":"#2f2b2a","#f2d7c0":"#d9c3b0"}},"pink":{"label":"Cotton candy","map":{"#f4efe4":"#f8d3da","#ddd3c0":"#eeb0be"}},"cream":{"label":"Cream wool","map":{"#f4efe4":"#f1dfb8","#ddd3c0":"#d9c193","#f2d7c0":"#8c6a52"}}},"camel":{"white":{"label":"White camel","map":{"#d9b07a":"#efe6d6","#b98d58":"#cfc2ad","#efd6ad":"#fbf6ec"}},"dark":{"label":"Dark desert","map":{"#d9b07a":"#8c6249","#b98d58":"#6b4a36","#efd6ad":"#c9a989"}},"royal":{"label":"Royal blanket","map":{"#c96a5a":"#4f5f86","#e9c15a":"#f0c64e"}}},"giraffe":{"reticulated":{"label":"Reticulated","map":{"#f1c76b":"#f6e6c4","#b8743a":"#9a4f2a"}},"white":{"label":"White giraffe","map":{"#f1c76b":"#f6f1e6","#b8743a":"#e3d6c2","#9a5a2a":"#c9b9a6"}},"mint":{"label":"Mint","map":{"#f1c76b":"#bfe3c4","#b8743a":"#6fa58c"}}},"hamster":{"white":{"label":"Winter white","map":{"#e3a25f":"#e9e4dc","#c7844a":"#c9c2b8"}},"choc":{"label":"Chocolate","map":{"#e3a25f":"#9a6644","#c7844a":"#7a4c30"}},"grey":{"label":"Grey dwarf","map":{"#e3a25f":"#aaa49c","#c7844a":"#857e76"}}},"penguin":{"blue":{"label":"Little blue","map":{"#3f4b5e":"#5f88b8","#2e3848":"#456c9c"}},"chick":{"label":"Fluffy chick","map":{"#3f4b5e":"#9c9890","#2e3848":"#7d7972"}},"rosy":{"label":"Rosy","map":{"#3f4b5e":"#c98b98","#2e3848":"#a96b78"}}},"parrot":{"bluegold":{"label":"Blue and gold","map":{"#d9473f":"#4a8ad0","#b23630":"#356fb0","#3f7fc4":"#2d5f9c"}},"green":{"label":"Green macaw","map":{"#d9473f":"#5fa85a","#b23630":"#478a44"}},"hyacinth":{"label":"Hyacinth","map":{"#d9473f":"#5256ab","#b23630":"#3d408c","#3f7fc4":"#383b80","#f7efe4":"#f2d36a"}}},"hedgehog":{"snow":{"label":"Snow","map":{"#b98c6a":"#e6ddd3","#8f684d":"#bdb2a6","#f1dcc4":"#ffffff"}},"cinnamon":{"label":"Cinnamon","map":{"#b98c6a":"#d98f62","#8f684d":"#b06a42"}},"pink":{"label":"Sakura","map":{"#b98c6a":"#efa3b7","#8f684d":"#cf7d95","#f1dcc4":"#fde3ea"}}},"cow":{"strawberry":{"label":"Strawberry milk","map":{"#8a6a5c":"#f29bb2"}},"highland":{"label":"Highland","map":{"#fffaf2":"#e9a46f","#8a6a5c":"#c47a48"}},"chocolate":{"label":"Chocolate","map":{"#fffaf2":"#a87c62","#8a6a5c":"#6e4c3c"}},"blue":{"label":"Blueberry","map":{"#8a6a5c":"#7f9ed9"}}},"owl":{"snowy":{"label":"Snowy owl","map":{"#f0c98f":"#f7f4ee","#d9a764":"#e3ddd2","#a9998c":"#4a4442"}},"night":{"label":"Night owl","map":{"#f0c98f":"#8f88b8","#d9a764":"#6f679c","#f3d9b8":"#c9c2e6"}},"rose":{"label":"Rose","map":{"#f0c98f":"#f2b6c4","#d9a764":"#dd8fa3"}}},"koala":{"cream":{"label":"Cream","map":{"#b4bcc6":"#e9dfd2","#959eaa":"#cbbfb0"}},"blue":{"label":"Misty blue","map":{"#b4bcc6":"#a9c3e6","#959eaa":"#86a5d2"}},"lilac":{"label":"Lilac","map":{"#b4bcc6":"#c7b8e6","#959eaa":"#a593d0"}}},"redpanda":{"snow":{"label":"Snow","map":{"#e5824f":"#f2ece4","#c4643a":"#d6cbbe","#f4b98a":"#ffffff","#5b3a33":"#8a7f78"}},"golden":{"label":"Golden","map":{"#e5824f":"#f2b75c","#c4643a":"#d6943a","#f4b98a":"#fbe0a6"}},"berry":{"label":"Berry","map":{"#e5824f":"#e5788f","#c4643a":"#c45670","#f4b98a":"#f8c0cc"}}}};
const COAT_COST = 150;
const WARDROBE = {
  chef: { slot: 'outfit', label: 'Chef', cost: 250 }, wizard: { slot: 'outfit', label: 'Wizard', cost: 300 }, pirate: { slot: 'outfit', label: 'Pirate', cost: 300 },
  hero: { slot: 'outfit', label: 'Superhero', cost: 350 }, royal: { slot: 'outfit', label: 'Royal', cost: 450 }, fairy: { slot: 'outfit', label: 'Fairy', cost: 400 },
  bow: { slot: 'head', label: 'Big bow', cost: 40 }, beanie: { slot: 'head', label: 'Knit beanie', cost: 60 }, flowers: { slot: 'head', label: 'Flower crown', cost: 80 },
  grad: { slot: 'head', label: 'Graduation cap', cost: 100 }, crown: { slot: 'head', label: 'Golden crown', cost: 150 },
  headphones: { slot: 'head', label: 'Study headphones', cost: 90 }, berry: { slot: 'head', label: 'Strawberry hat', cost: 110 },
  glasses: { slot: 'face', label: 'Golden glasses', cost: 50 }, shades: { slot: 'face', label: 'Heart sunglasses', cost: 70 },
  bowtie: { slot: 'neck', label: 'Bow tie', cost: 50 }, scarf: { slot: 'neck', label: 'Cosy scarf', cost: 60 }, pearls: { slot: 'neck', label: 'Pearl necklace', cost: 80 },
  f_none: { slot: 'emoteF', label: 'Just the book', cost: 0 }, f_think: { slot: 'emoteF', label: 'Thinking', cost: 0 }, f_bulb: { slot: 'emoteF', label: 'Big idea', cost: 120 }, f_notes: { slot: 'emoteF', label: 'Humming', cost: 120 },
  f_coffee: { slot: 'emoteF', label: 'Coffee break', cost: 150 }, f_star: { slot: 'emoteF', label: 'Star student', cost: 150 }, f_heart: { slot: 'emoteF', label: 'Loving it', cost: 150 }, f_fire: { slot: 'emoteF', label: 'On fire', cost: 200 },
  n_zz: { slot: 'emoteN', label: 'Snoring', cost: 0 }, n_moon: { slot: 'emoteN', label: 'Moon and stars', cost: 120 }, n_heart: { slot: 'emoteN', label: 'Sweet dreams', cost: 150 }, n_sheep: { slot: 'emoteN', label: 'Counting sheep', cost: 200 }
};
const SLOTS = { outfit: 'Costumes', head: 'Head', face: 'Eyes', neck: 'Neck' };
const EMOTE_SLOTS = { emoteF: 'While focusing', emoteN: 'While napping' };
const FREE_ITEMS = ['f_none', 'f_think', 'n_zz'];
const ownsItem = id => FREE_ITEMS.includes(id) || (S.wardrobe || []).includes(id);
// Dress up was briefly switched off on 2026-11-26 and came back the same day with redrawn, prettier items.
const LOOKS_RETIRED = false;
function cleanLook(l) {
  if (LOOKS_RETIRED || !l || typeof l !== 'object') return null;
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
// soft pastel palette shared by every item, so outfits look like one set
const PAL = { pink: '#f6a9bd', rose: '#e8798f', blush: '#fbd3dc', lav: '#b9a3e3', lavD: '#9580cf', mint: '#a8dcc4', mintD: '#7fc0a3', sky: '#a9cdf0', skyD: '#7fa9d8', cream: '#fff8ec', gold: '#f5c95c', goldD: '#d9a63a', berry: '#e5566f', leaf: '#8cc47a', navy: '#4d5d8f' };
const shine = (x, y, w) => `<path d="M${x} ${y} q${w * .4} ${-w * .5} ${w} ${-w * .4}" stroke="#fff" stroke-width="2.2" stroke-linecap="round" fill="none" opacity=".8"/>`;
function flower(x, y, r, c) { return `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="${-r}" rx="${r * .72}" ry="${r}" fill="${c}" stroke="${INK}" stroke-width="1.5" transform="rotate(${a})"/>`).join('')}<circle r="${r * .55}" fill="${PAL.gold}" stroke="${INK}" stroke-width="1.3"/></g>`; }
function headItem(id, [x, y, s]) {
  const t = T(x, y, s * 1.12);
  if (id === 'beanie') return `<g ${t}><path d="M-31 6 C-31 -24 -16 -36 0 -36 C16 -36 31 -24 31 6 Z" fill="${PAL.pink}" ${O2}/>${[-20, -10, 0, 10, 20].map(dx => `<path d="M${dx - 3} ${-26 + Math.abs(dx) * .3} l3 5 l3 -5 M${dx - 3} ${-16 + Math.abs(dx) * .2} l3 5 l3 -5 M${dx - 3} ${-6} l3 5 l3 -5" stroke="${PAL.rose}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}<rect x="-34" y="-3" width="68" height="13" rx="6.5" fill="${PAL.cream}" ${O2}/><path d="M-26 1 V7 M-17 1 V7 M-8 1 V7 M1 1 V7 M10 1 V7 M19 1 V7 M28 1 V7" stroke="#eadfcf" stroke-width="2" stroke-linecap="round"/><circle cx="0" cy="-40" r="9" fill="${PAL.cream}" ${O2}/><path d="M-4 -44 l3 3 M3 -43 l2 3 M-1 -38 l3 2" stroke="#eadfcf" stroke-width="1.6" stroke-linecap="round"/>${shine(-22, -16, 10)}</g>`;
  if (id === 'grad') return `<g ${t}><path d="M-21 -10 L-21 6 C-8 12 8 12 21 6 L21 -10 Z" fill="${PAL.navy}" ${O2}/><path d="M-42 -15 L0 -31 L42 -15 L0 1 Z" fill="#5c6da3" ${O2}/><path d="M-30 -15 L0 -26" stroke="#7d8dc0" stroke-width="2.4" stroke-linecap="round"/><path d="M0 -15 L31 -10 L32 8" stroke="${PAL.gold}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M28 8 L36 8 L35 20 L29 20 Z" fill="${PAL.gold}" ${O2}/><circle cx="0" cy="-15" r="3.4" fill="${PAL.gold}" stroke="${INK}" stroke-width="1.3"/></g>`;
  if (id === 'crown') return `<g ${t}><path d="M-28 6 L-32 -26 L-14 -10 L0 -34 L14 -10 L32 -26 L28 6 Z" fill="${PAL.gold}" ${O2}/><path d="M-28 -2 C-10 2 10 2 28 -2 L28 6 L-28 6 Z" fill="${PAL.goldD}" ${O2}/><path d="M-6 -20 C-2 -24 2 -24 4 -22" stroke="#fff3c4" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M0 -12 l5 6 l-5 6 l-5 -6 Z" fill="${PAL.pink}" ${O2}/><circle cx="-17" cy="0" r="3.4" fill="${PAL.sky}" stroke="${INK}" stroke-width="1.4"/><circle cx="17" cy="0" r="3.4" fill="${PAL.mint}" stroke="${INK}" stroke-width="1.4"/><circle cx="0" cy="-35" r="3.6" fill="${PAL.blush}" ${O2}/><circle cx="-32" cy="-27" r="3" fill="${PAL.blush}" ${O2}/><circle cx="32" cy="-27" r="3" fill="${PAL.blush}" ${O2}/></g>`;
  if (id === 'flowers') {
    const fl = [[-32, 7, 5.4, PAL.pink], [-19, -2, 6, PAL.cream], [-6, -6, 6.6, PAL.lav], [7, -6, 6.6, PAL.blush], [20, -2, 6, PAL.cream], [33, 7, 5.4, PAL.pink]];
    return `<g ${t}><path d="M-38 12 C-22 -8 22 -8 38 12" fill="none" stroke="#6fa860" stroke-width="3.4" stroke-linecap="round"/>${[[-26, 2, -40], [-12, -4, -20], [12, -4, 20], [26, 2, 40]].map(([lx, ly, a]) => `<path d="M0 0 C4 -6 12 -6 14 0 C10 4 4 4 0 0 Z" fill="${PAL.leaf}" stroke="${INK}" stroke-width="1.4" transform="translate(${lx} ${ly}) rotate(${a})"/>`).join('')}${fl.map(([fx, fy, r, c]) => flower(fx, fy, r, c)).join('')}</g>`;
  }
  if (id === 'bow') return `<g ${t}><g transform="translate(22 -2) rotate(16)"><path d="M-2 4 L-12 22 L-6 21 L-4 26 Z M2 4 L10 22 L4 21 L3 26 Z" fill="${PAL.rose}" ${O2}/><path d="M0 0 C-12 -18 -32 -16 -30 0 C-32 16 -12 18 0 0 Z" fill="${PAL.pink}" ${O2}/><path d="M0 0 C12 -18 32 -16 30 0 C32 16 12 18 0 0 Z" fill="${PAL.pink}" ${O2}/><path d="M-22 -8 C-16 -10 -10 -8 -6 -4 M22 -8 C16 -10 10 -8 6 -4" stroke="${PAL.rose}" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="-20" cy="2" r="2" fill="#fff"/><circle cx="-14" cy="8" r="1.6" fill="#fff"/><circle cx="18" cy="4" r="2" fill="#fff"/><ellipse rx="6.5" ry="7.5" fill="${PAL.rose}" ${O2}/></g></g>`;
  if (id === 'headphones') return `<g ${t}><path d="M-36 8 C-38 -30 38 -30 36 8" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M-36 8 C-38 -30 38 -30 36 8" fill="none" stroke="${PAL.lav}" stroke-width="5" stroke-linecap="round"/><rect x="-46" y="-2" width="18" height="26" rx="8" fill="${PAL.lavD}" ${O2}/><rect x="28" y="-2" width="18" height="26" rx="8" fill="${PAL.lavD}" ${O2}/><circle cx="-37" cy="11" r="5" fill="${PAL.pink}" stroke="${INK}" stroke-width="1.4"/><circle cx="37" cy="11" r="5" fill="${PAL.pink}" stroke="${INK}" stroke-width="1.4"/><path d="M44 18 C52 26 56 18 62 26" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M56 4 v-8 l6 -2 v7" stroke="${PAL.rose}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="54" cy="5" rx="2.6" ry="2" fill="${PAL.rose}"/></g>`;
  if (id === 'berry') return `<g ${t}><path d="M-30 6 C-34 -22 -16 -38 0 -38 C16 -38 34 -22 30 6 C14 12 -14 12 -30 6 Z" fill="${PAL.berry}" ${O2}/>${[[-18, -18], [-6, -26], [8, -24], [20, -14], [-20, -4], [-6, -10], [8, -8], [20, 0], [-8, 4], [6, 4]].map(([sx, sy]) => `<ellipse cx="${sx}" cy="${sy}" rx="1.8" ry="2.6" fill="#ffe9a8"/>`).join('')}<path d="M-16 -36 C-10 -30 -4 -36 0 -42 C4 -36 10 -30 16 -36 C14 -30 10 -28 6 -28 L0 -32 L-6 -28 C-10 -28 -14 -30 -16 -36 Z" fill="${PAL.leaf}" ${O2}/><path d="M0 -40 C2 -46 6 -50 10 -50" stroke="#5f9a4f" stroke-width="3" stroke-linecap="round" fill="none"/>${shine(-22, -12, 9)}</g>`;
  if (id === 'wizard') return `<g ${t}><ellipse cx="0" cy="4" rx="42" ry="9" fill="${PAL.lavD}" ${O2}/><path d="M-30 4 C-14 -2 14 -2 30 4 C24 -18 16 -40 8 -56 C4 -64 -4 -66 -10 -60 C-14 -56 -12 -50 -8 -50 C-16 -32 -24 -14 -30 4 Z" fill="${PAL.lav}" ${O2}/><path d="M-26 -6 C-10 -11 10 -11 26 -6 L28 2 C10 -3 -10 -3 -28 2 Z" fill="${PAL.gold}" ${O2}/><path d="M6 -40 a7 7 0 1 0 6 8 a5.5 5.5 0 1 1 -6 -8 Z" fill="#fff3c4" stroke="${INK}" stroke-width="1.3"/>${star(-10, -26, 5)}${star(14, -18, 3.6)}${star(-4, -44, 3)}<circle cx="-10" cy="-60" r="4.5" fill="${PAL.gold}" ${O2}/></g>`;
  if (id === 'pirate') return `<g ${t}><path d="M-44 4 C-34 -28 -16 -26 0 -36 C16 -26 34 -28 44 4 C22 -6 -22 -6 -44 4 Z" fill="#5a3e5c" ${O2}/><path d="M-38 -2 C-18 -10 18 -10 38 -2" fill="none" stroke="${PAL.gold}" stroke-width="3"/><path d="M0 -26 l2.4 5 l5.4 .6 l-4 3.8 l1 5.4 l-4.8 -2.6 l-4.8 2.6 l1 -5.4 l-4 -3.8 l5.4 -.6 Z" fill="${PAL.gold}" stroke="${INK}" stroke-width="1.3" stroke-linejoin="round"/><path d="M26 -16 C38 -40 52 -42 58 -36 C50 -30 40 -24 30 -12 Z" fill="${PAL.pink}" ${O2}/><path d="M30 -14 C40 -28 48 -34 56 -36" stroke="${PAL.rose}" stroke-width="1.6" fill="none"/></g>`;
  if (id === 'chef') return `<g ${t}><rect x="-21" y="-22" width="42" height="26" rx="5" fill="#ffffff" ${O2}/><circle cx="-17" cy="-30" r="13" fill="#ffffff" ${O2}/><circle cx="17" cy="-30" r="13" fill="#ffffff" ${O2}/><circle cx="0" cy="-40" r="15" fill="#ffffff" ${O2}/><path d="M-21 -8 H21 V2 C21 4 19 4 18 4 H-18 C-19 4 -21 4 -21 2 Z" fill="${PAL.pink}" ${O2}/>${[-14, -4, 6, 16].map(dx => `<circle cx="${dx}" cy="-2" r="1.8" fill="#fff"/>`).join('')}<path d="M-10 -24 C-8 -30 -4 -34 2 -34" stroke="#eee8de" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>`;
  if (id === 'fairy') return headItem('flowers', [x, y, s * .92]);
  if (id === 'royal') return headItem('crown', [x, y, s * 1.12]);
  return '';
}
function star(x, y, r) { const p = []; for (let i = 0; i < 10; i++) { const a = Math.PI / 5 * i - Math.PI / 2, rr = i % 2 ? r * .45 : r; p.push(`${(x + Math.cos(a) * rr).toFixed(1)} ${(y + Math.sin(a) * rr).toFixed(1)}`); } return `<path d="M${p.join(' L')} Z" fill="#f7d774" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/>`; }
function neckItem(id, [x, y, s]) {
  const t = T(x, y, s * 1.08);
  if (id === 'bowtie') return `<g ${t}><path d="M0 0 C-6 -8 -16 -13 -19 -9 C-21 -3 -21 3 -19 9 C-16 13 -6 8 0 0 Z M0 0 C6 -8 16 -13 19 -9 C21 -3 21 3 19 9 C16 13 6 8 0 0 Z" fill="${PAL.sky}" ${O2}/>${[[-13, -3], [-10, 5], [-15, 4], [13, -3], [10, 5], [15, 4]].map(([dx, dy]) => `<circle cx="${dx}" cy="${dy}" r="1.7" fill="#fff"/>`).join('')}<rect x="-5" y="-6" width="10" height="12" rx="4" fill="${PAL.skyD}" ${O2}/></g>`;
  if (id === 'scarf') return `<g ${t}><path d="M12 4 L22 34 L8 36 L3 8 Z" fill="${PAL.mint}" ${O2}/><path d="M13 14 L17 13 M15 22 L19 21 M17 30 L21 29" stroke="${PAL.cream}" stroke-width="3" stroke-linecap="round"/><path d="M9 36 l-1 4 M13 35 l0 4 M17 35 l1 4 M21 34 l2 4" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/><path d="M-33 -6 C-14 6 14 6 33 -6 L33 7 C14 19 -14 19 -33 7 Z" fill="${PAL.mint}" ${O2}/><path d="M-22 -1 L-22 11 M-8 2 L-8 14 M8 2 L8 14 M22 -1 L22 11" stroke="${PAL.cream}" stroke-width="4"/></g>`;
  if (id === 'pearls') return `<g ${t}>${Array.from({ length: 11 }, (_, i) => { const a = Math.PI * (.12 + .76 * i / 10); return `<circle cx="${(-Math.cos(a) * 30).toFixed(1)}" cy="${(Math.sin(a) * 12 - 4).toFixed(1)}" r="4" fill="#fffaf3" stroke="${INK}" stroke-width="1.4"/>`; }).join('')}<path d="M0 8 C-6 8 -8 16 0 22 C8 16 6 8 0 8 Z" fill="${PAL.pink}" ${O2}/></g>`;
  if (id === 'chef') return `<g ${t}><path d="M-24 -4 C-10 4 10 4 24 -4 L0 24 Z" fill="${PAL.pink}" ${O2}/>${[[-10, 4], [8, 4], [0, 12], [-4, -0], [12, -2]].map(([dx, dy]) => `<circle cx="${dx}" cy="${dy}" r="1.8" fill="#fff"/>`).join('')}<circle cx="0" cy="1" r="4.4" fill="${PAL.rose}" ${O2}/></g>`;
  if (id === 'pirate') return `<g ${t}><path d="M-26 -4 C-10 4 10 4 26 -4 L18 8 C6 12 -6 12 -18 8 Z" fill="${PAL.berry}" ${O2}/><path d="M-16 2 h4 M-4 5 h4 M8 3 h4" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><path d="M14 6 L24 22 L16 22 Z" fill="${PAL.berry}" ${O2}/></g>`;
  if (id === 'royal') return `<g ${t}><path d="M-36 -6 C-16 8 16 8 36 -6 L36 7 C16 21 -16 21 -36 7 Z" fill="#fffaf3" ${O2}/>${[-26, -13, 0, 13, 26].map((dx, i) => `<path d="M${dx} ${6 + (i % 2) * 3} l2 4 l2 -4 z" fill="${INK}"/>`).join('')}<circle cx="0" cy="12" r="5" fill="${PAL.gold}" ${O2}/><circle cx="0" cy="12" r="2" fill="${PAL.pink}"/></g>`;
  if (id === 'hero') return `<g ${t}><circle cx="-24" cy="0" r="5" fill="${PAL.gold}" ${O2}/><circle cx="24" cy="0" r="5" fill="${PAL.gold}" ${O2}/><path d="M0 4 l3 6 l6.5 .8 l-4.8 4.4 l1.2 6.4 l-5.9 -3.2 l-5.9 3.2 l1.2 -6.4 l-4.8 -4.4 l6.5 -.8 Z" fill="${PAL.gold}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/></g>`;
  if (id === 'wizard') return `<g ${t}><path d="M-24 0 C-10 8 10 8 24 0" stroke="${PAL.gold}" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="0" cy="8" r="6" fill="${PAL.sky}" ${O2}/><path d="M-2 5 l2 -2" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></g>`;
  if (id === 'fairy') return neckItem('pearls', [x, y, s]);
  return '';
}
// capes and wings sit behind the animal
function capeUnder(id, [x, y, s]) {
  if (id === 'fairy') {
    const w = Math.max(54, 92 * s), yy = y - 12 * s;
    const wing = d => `<g transform="translate(${x} ${yy}) scale(${d} 1)"><path d="M6 0 C20 -40 ${w + 10} -52 ${w + 4} -16 C${w} 0 ${w * .5} 6 6 4 Z" fill="${PAL.sky}" fill-opacity=".85" ${O2}/><path d="M6 6 C${w * .4} 10 ${w * .8} 22 ${w * .7} 40 C${w * .5} 50 ${w * .2} 30 6 10 Z" fill="${PAL.blush}" fill-opacity=".9" ${O2}/><path d="M14 -4 C${w * .4} -20 ${w * .7} -30 ${w * .85} -26" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/><circle cx="${w * .65}" cy="-22" r="2.4" fill="#fff"/><circle cx="${w * .45}" cy="24" r="2" fill="#fff"/></g>`;
    return wing(-1) + wing(1);
  }
  const col = { hero: [PAL.rose, '#c95f76', PAL.gold], wizard: [PAL.lav, PAL.lavD, PAL.gold], royal: ['#a6455f', '#82344a', PAL.gold] }[id]; if (!col) return '';
  const w0 = 34 * s, w1 = Math.max(58, 86 * s), y0 = y - 6 * s, yb = 180, mid = (y0 + yb) / 2;
  const sp = id === 'wizard' ? star(x - w1 * .7, yb - 18, 4.4) + star(x + w1 * .75, mid + 10, 4) + star(x - w1 * .5, mid - 4, 3.2) + star(x + w1 * .45, yb - 10, 3) : id === 'hero' ? `<path d="M${x + w1 * .62} ${mid + 14} c-4 -6 -12 -2 -6 6 l6 6 l6 -6 c6 -8 -2 -12 -6 -6 Z" fill="${PAL.blush}" ${O2}/>` : '';
  const trim = `<path d="M${x - w1} ${yb - 4} Q${x} ${yb + 6} ${x + w1} ${yb - 4}" fill="none" stroke="${id === 'royal' ? '#fffaf3' : col[2]}" stroke-width="${id === 'royal' ? 8 : 4}" stroke-linecap="round"/>${id === 'royal' ? [-.6, -.2, .2, .6].map(f => `<path d="M${x + w1 * f - 2} ${yb - 2} l2 4 l2 -4 z" fill="${INK}"/>`).join('') : ''}`;
  return `<path d="M${x - w0} ${y0} C${x - w0 - 20 * s} ${mid} ${x - w1 - 4} ${yb - 20} ${x - w1} ${yb - 2} Q${x} ${yb + 8} ${x + w1} ${yb - 2} C${x + w1 + 4} ${yb - 20} ${x + w0 + 20 * s} ${mid} ${x + w0} ${y0} Z" fill="${col[0]}" ${O}/><path d="M${x - w1 * .55} ${yb - 4} C${x - w1 * .5} ${mid + 20} ${x - w0 * .6} ${mid} ${x - w0 * .4} ${y0 + 10}" fill="none" stroke="${col[1]}" stroke-width="2.4" stroke-linecap="round"/><path d="M${x + w1 * .55} ${yb - 4} C${x + w1 * .5} ${mid + 20} ${x + w0 * .6} ${mid} ${x + w0 * .4} ${y0 + 10}" fill="none" stroke="${col[1]}" stroke-width="2.4" stroke-linecap="round"/>${sp}${trim}`;
}
function faceItem(id, f) {
  if (f.eyes.length < 2) return '';
  const er = f.er, [[x1, y1], [x2, y2]] = f.eyes;
  if (id === 'hero') {
    // a light domino mask with eye holes, so the eyes stay visible
    const r = er * 1.6, pad = er * 2.5, h = er * 1.9, yy = (y1 + y2) / 2;
    return `<path fill-rule="evenodd" d="M${x1 - pad} ${yy - h * .5} C${x1} ${yy - h * 1.05} ${x2} ${yy - h * 1.05} ${x2 + pad} ${yy - h * .5} L${x2 + pad * .85} ${yy + h * .6} C${(x1 + x2) / 2 + 6} ${yy + h * .35} ${(x1 + x2) / 2 - 6} ${yy + h * .35} ${x1 - pad * .85} ${yy + h * .6} Z M${x1 - r} ${y1} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z M${x2 - r} ${y2} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z" fill="${PAL.rose}" stroke="${INK}" stroke-width="2" stroke-linejoin="round" opacity=".95"/>`;
  }
  if (id === 'pirate') return '';
  if (id === 'shades') {
    // heart-shaped sunglasses
    const r = er * 2.1;
    const heart = (x, y) => `<path d="M${x} ${y + r * .95} C${x - r * 1.5} ${y} ${x - r * 1.2} ${y - r * 1.2} ${x - r * .55} ${y - r * 1.05} C${x - r * .2} ${y - r} ${x} ${y - r * .7} ${x} ${y - r * .55} C${x} ${y - r * .7} ${x + r * .2} ${y - r} ${x + r * .55} ${y - r * 1.05} C${x + r * 1.2} ${y - r * 1.2} ${x + r * 1.5} ${y} ${x} ${y + r * .95} Z" fill="${PAL.rose}" fill-opacity=".92" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><path d="M${x - r * .7} ${y - r * .45} q${r * .2} ${-r * .35} ${r * .5} ${-r * .3}" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".85"/>`;
    return `<g class="acc-face">${heart(x1, y1)}${heart(x2, y2)}<path d="M${x1 + r * .9} ${y1 - r * .3} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - r * .7} ${x2 - r * .9} ${y2 - r * .3}" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>`;
  }
  if (id !== 'glasses') return '';
  const r = er * 2;
  const lens = (x, y) => `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,255,255,.25)" stroke="${PAL.goldD}" stroke-width="3"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${INK}" stroke-width="1.2" opacity=".6"/><path d="M${x - r * .55} ${y - r * .35} q${r * .2} ${-r * .3} ${r * .45} ${-r * .3}" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".9"/>`;
  return `<g class="acc-face">${lens(x1, y1)}${lens(x2, y2)}<path d="M${x1 + r} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - r * .4} ${x2 - r} ${y2}" stroke="${PAL.goldD}" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;
}
const OUTFITS = { chef: { head: 'chef', neck: 'chef' }, wizard: { head: 'wizard', neck: 'wizard', cape: 1 }, pirate: { head: 'pirate', neck: 'pirate' }, hero: { face: 'hero', neck: 'hero', cape: 1 }, royal: { head: 'royal', neck: 'royal', cape: 1 }, fairy: { head: 'fairy', neck: 'fairy', cape: 1 } };
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
let dressFor = null, tryOn = null, dressPose = 'happy', dressPreview = false, previewLook = {};
// preview: the owner looks at any animal and any item without buying or saving anything
function openDress(k, preview) { dressFor = k; tryOn = null; dressPose = 'happy'; dressPreview = !!preview; previewLook = {}; renderDress(); $('#dressModal').classList.add('on'); }
function closeDress() { $('#dressModal').classList.remove('on'); dressFor = null; tryOn = null; dressPreview = false; previewLook = {}; }
const coatsOwned = k => (S.pets[k] && Array.isArray(S.pets[k].coats) ? S.pets[k].coats : []);
function itemPrice(slot, id) { return slot === 'coat' ? COAT_COST : WARDROBE[id].cost; }
function itemLabel(slot, id) { return slot === 'coat' ? COATS[dressFor][id].label : WARDROBE[id].label; }
function itemOwned(slot, id) { return slot === 'coat' ? coatsOwned(dressFor).includes(id) : ownsItem(id); }
function renderDress() {
  const k = dressFor; if (!k) return;
  const prev = dressPreview, p = S.pets[k] || { name: '' }, cur = prev ? previewLook : (cleanLook(p.look) || {}), view = prev ? cur : { ...cur, ...(tryOn || {}) };
  const poseOf = slot => slot === 'emoteF' ? 'study' : slot === 'emoteN' ? 'sleeping' : 'awake';
  const pic = (look, pose) => avatarSVG(k, pose === 'study' ? 'awake' : pose, look, pose === 'study');
  const tile = (slot, id) => {
    const isNone = id === 'none', on = isNone ? !view[slot] : view[slot] === id, has = isNone || itemOwned(slot, id);
    const lk = { ...view }; if (isNone) delete lk[slot]; else lk[slot] = id;
    if (slot === 'outfit' && !isNone) { delete lk.head; delete lk.face; delete lk.neck; }
    return `<button type="button" class="dress-tile ${on ? 'on' : ''}" data-dsel="${slot}:${id}" aria-pressed="${on}"><span class="dress-av">${pic(lk, poseOf(slot))}</span><b>${isNone ? (slot === 'coat' ? 'Natural' : 'None') : esc(itemLabel(slot, id))}</b><small>${prev ? (isNone ? (on ? 'Showing' : '') : itemPrice(slot, id) ? `${icon('i-coin')}${itemPrice(slot, id)}` : 'Free') : isNone || has ? (on ? 'Wearing' : 'Yours') : `${icon('i-coin')}${itemPrice(slot, id)}`}</small></button>`;
  };
  const pending = !prev && tryOn && Object.entries(tryOn).find(([sl, id]) => !itemOwned(sl, id));
  const name = p.name || ANIMALS[k].label;
  const section = (lab, slot, ids, none = true) => `<div><span class="eyebrow">${lab}</span><div class="dress-row">${none ? tile(slot, 'none') : ''}${ids.map(id => tile(slot, id)).join('')}</div></div>`;
  const ofSlot = sl => Object.keys(WARDROBE).filter(id => WARDROBE[id].slot === sl);
  const pose = dressPose;
  $('#dressBox').innerHTML = `<div class="row" style="justify-content:space-between; flex-wrap:nowrap"><div><span class="eyebrow">${prev ? 'Owner preview' : 'Wardrobe'}</span><h2>${prev ? `Preview the ${esc(ANIMALS[k].label.toLowerCase())}` : `Dress up ${esc(name)}`}</h2></div><button class="icon-btn" data-dclose aria-label="Close">${icon('i-x')}</button></div>
    <div class="dress">
      <div class="dress-side"><div class="dress-pic">${animalSVG(k, pose === 'study' ? 'awake' : pose, { look: view, label: name, studying: pose === 'study' })}</div>
        <div class="seg dress-pose" role="group" aria-label="Preview">${[['happy', 'Happy'], ['study', 'Studying'], ['sleeping', 'Napping']].map(([v, t]) => `<button type="button" data-dpose="${v}" aria-pressed="${pose === v}">${t}</button>`).join('')}</div></div>
      <div class="dress-opts">
        ${section('Costumes · replace hat, eyes and neck', 'outfit', ofSlot('outfit'))}
        ${section('Head', 'head', ofSlot('head'))}${section('Eyes', 'face', ofSlot('face'))}${section('Neck', 'neck', ofSlot('neck'))}
        ${COATS[k] ? section(`Colours for this ${ANIMALS[k].label.toLowerCase()} · ${COAT_COST} coins each`, 'coat', Object.keys(COATS[k])) : ''}
        ${section('While focusing · your animal reads a book and shows this', 'emoteF', ofSlot('emoteF'), false)}
        ${section('While napping', 'emoteN', ofSlot('emoteN'), false)}
      </div>
    </div>
    <div class="row dress-foot">${prev ? `<span class="muted" style="font-size:.84rem">Preview only. Nothing is bought, saved or shown to anyone.</span><button class="btn" data-dreset>Clear</button><button class="btn primary" data-dclose>Done</button>` : pending ? `<span class="muted" style="font-size:.84rem">Trying on ${esc(itemLabel(pending[0], pending[1]))}. You have ${S.coins} coins.</span><button class="btn" data-dcancel>Take it off</button><button class="btn primary" data-dbuy ${S.coins < itemPrice(pending[0], pending[1]) ? 'disabled' : ''}>${icon('i-coin')}Buy for ${itemPrice(pending[0], pending[1])}</button>` : `<span class="muted" style="font-size:.84rem">Outfits and emotes work on every animal. Colours belong to one animal.</span><button class="btn primary" data-dclose>Done</button>`}</div>`;
}
function setLook(k, look) {
  S.pets[k].look = cleanLook(look); save();
  renderZoo(); renderAll(); if (k === S.active) publishPond();
}
function bindDress() {
  $('#dressModal').addEventListener('click', e => {
    if (e.target.id === 'dressModal' || e.target.closest('[data-dclose]')) { closeDress(); return; }
    const k = dressFor; if (!k) return;
    const ps = e.target.closest('[data-dpose]'); if (ps) { dressPose = ps.dataset.dpose; renderDress(); return; }
    if (dressPreview) {
      if (e.target.closest('[data-dreset]')) { previewLook = {}; renderDress(); return; }
      const ps2 = e.target.closest('[data-dsel]'); if (!ps2) return;
      const [slot, id] = ps2.dataset.dsel.split(':');
      if (slot === 'emoteF') dressPose = 'study'; else if (slot === 'emoteN') dressPose = 'sleeping'; else if (dressPose !== 'happy') dressPose = 'happy';
      if (id === 'none' || previewLook[slot] === id) delete previewLook[slot]; else { previewLook[slot] = id; if (slot === 'outfit') { delete previewLook.head; delete previewLook.face; delete previewLook.neck; } }
      renderDress(); return;
    }
    const cur = cleanLook(S.pets[k].look) || {};
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
