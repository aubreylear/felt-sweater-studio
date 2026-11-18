/* Sweater Endeavor — everything is drawn as one SVG built from the state object S. */

const COLORS = {
  Red: '#e8372a', Wine: '#8e1b2a', Berry: '#c2356e', Plum: '#6b2d5c', Pink: '#f19aab', Blush: '#f7cfd2',
  Cream: '#f2e8cf', White: '#f8f6f0', Silver: '#c9ccd4', Gray: '#6e6e70', Gold: '#f2c244', Clementine: '#f0793a',
  Gingerbread: '#d8a066', Cocoa: '#6b4530', Mint: '#8fd8c4', Teal: '#22b5a7', Olive: '#7d9b3d', Green: '#1f9150',
  Forest: '#1d5a37', Ice: '#9cc9ef', 'Winter blue': '#3f7fc4', Navy: '#22355e',
};
const PALETTES = {
  Classic: ['#e8372a', '#f2e8cf', '#1f9150', '#f2c244'],
  Candy: ['#f19aab', '#8fd8c4', '#f7cfd2', '#f2c244', '#22b5a7'],
  Nordic: ['#22355e', '#f8f6f0', '#e8372a', '#9cc9ef'],
  Frosty: ['#9cc9ef', '#f8f6f0', '#8fd8c4', '#22b5a7'],
  Woodland: ['#1d5a37', '#7d9b3d', '#f2e8cf', '#d8a066', '#8e1b2a'],
  Festive: ['#e8372a', '#f19aab', '#f2c244', '#7d9b3d', '#22b5a7', '#1f9150', '#8fd8c4', '#8e1b2a', '#9cc9ef', '#d8a066', '#22355e'],
};
const PATTERNS = [['none', 'Plain'], ['stripes', 'Stripes'], ['wide', 'Bold bands'], ['candy', 'Candy stripe'], ['argyle', 'Argyle'], ['fairisle', 'Fair Isle'], ['dots', 'Polka dots'], ['check', 'Checkered']];
const YOKES = [['none', 'None'], ['zigzag', 'Zigzag'], ['round', 'Round']];
const STITCHES = [['none', 'None'], ['running', 'Running stitch']];
const STICKERS = [['tree', 'Tree'], ['snowman', 'Snowman'], ['gingerbread', 'Gingerbread'], ['wreath', 'Wreath'], ['star', 'Star'], ['present', 'Present'], ['candy', 'Candy cane'], ['snowflake', 'Snowflake'], ['bunting', 'Bunting'], ['lights', 'Lights'], ['pomgarland', 'Pom garland']];
// Clip art is switched off for now; set to true to bring back the tray, the default tree and random decorations.
const CLIP_ART = false;
// Plain felt shapes for the tray under the sweater; each is drawn around (0,0).
const SHAPES = {
  circle: ['Circle', c => `<circle r="28" fill="${c}"/>`],
  square: ['Square', c => rect(-26, -26, 52, 52, c)],
  triangle: ['Triangle', c => `<polygon points="0,-30 31,24 -31,24" fill="${c}"/>`],
  diamond: ['Diamond', c => `<polygon points="0,-34 24,0 0,34 -24,0" fill="${c}"/>`],
  star: ['Star', c => `<polygon points="${starPts(5, 34, 14)}" fill="${c}"/>`],
  heart: ['Heart', c => `<path transform="translate(0,10) scale(.72)" d="M0,30 C-55,-5 -45,-60 0,-30 C45,-60 55,-5 0,30Z" fill="${c}"/>`],
  hexagon: ['Hexagon', c => `<polygon points="${starPts(3, 30, 30)}" fill="${c}"/>`],
  semicircle: ['Half circle', c => `<path d="M-30,14 A30,30 0 0 1 30,14 Z" fill="${c}"/>`],
  rectangle: ['Rectangle', c => rect(-36, -16, 72, 32, c)],
  oval: ['Oval', c => `<ellipse rx="34" ry="20" fill="${c}"/>`],
  evergreen: ['Evergreen', c => `<path d="M0,-36 L14,-16 L8,-16 L22,4 L14,4 L28,24 L5,24 L5,36 L-5,36 L-5,24 L-28,24 L-14,4 L-22,4 L-8,-16 L-14,-16 Z" fill="${c}"/>`],
  flake: ['Snowflake', c => poly(flakePts(), c)],
  reindeer: ['Reindeer', c => `<path d="M-27,-5 L-20,-1 L2,-1 L9,-15 L10,-19 L8,-26 L2,-30 L3,-33 L9,-30 L10,-37 L13,-37 L13,-30 L19,-34 L20,-31 L14,-26 L14,-19 L20,-19 L27,-14 L27,-10 L16,-8 L13,5 L11,13 L11,34 L6,34 L6,14 L-14,14 L-14,34 L-19,34 L-19,14 L-22,11 L-22,3 Z" fill="${c}"/>`],
  menorah: ['Menorah', c => menorahArt(c)],
  bulb: ['Light bulb', c => rect(-9, -36, 18, 16, c) + `<path d="M-9,-22 C-27,-10 -23,26 0,36 C23,26 27,-10 9,-22 Z" fill="${c}"/>`],
};
// Six-armed snowflake as one outline, so it cuts and colors as a single piece.
function flakePts() {
  const w = 3.2, h = 2.8, L = 35, b = 19, len = 12, k = .866, pts = [];
  const t1 = (w - .5 * h) / k, t2 = (w + .5 * h) / k;
  const side = [[1.732 * w, -w], [b - k * h + .5 * t1, -w], [b - k * h + .5 * len, -.5 * h - k * len], [b + k * h + .5 * len, .5 * h - k * len], [b + k * h + .5 * t2, -w], [L, -w]];
  const arm = side.concat(side.map(([u, v]) => [u, -v]).reverse());
  for (let i = 0; i < 6; i++) {
    const a = i * Math.PI / 3 - Math.PI / 2, co = Math.cos(a), si = Math.sin(a);
    arm.forEach(([u, v]) => pts.push([u * co - v * si, u * si + v * co]));
  }
  return pts;
}
// Nine candles on a curved branch with a stem and base, plus a flame over each candle.
function menorahArt(c) {
  let d = 'M-35,2 ', flames = '';
  for (let i = -4; i <= 4; i++) {
    const x = i * 8, t = i ? -18 : -25;
    d += `L${x - 2.5},2 L${x - 2.5},${t} L${x + 2.5},${t} L${x + 2.5},2 `;
    flames += `<ellipse cx="${x}" cy="${t - 5}" rx="2" ry="3.4" fill="${c}"/>`;
  }
  return `<path d="${d}L35,2 Q33,14 3.5,14 L3.5,27 L17,27 L17,34 L-17,34 L-17,27 L-3.5,27 L-3.5,14 Q-33,14 -35,2 Z" fill="${c}"/>` + flames;
}
// Felt letters A to Z, set in Graduate, a varsity-style font.
const LETTER_FONT = "Graduate, Rockwell, 'Courier New', serif";
const LETTERS = Object.fromEntries([...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map(ch =>
  ['ltr' + ch, ['Letter ' + ch, c => `<text text-anchor="middle" y="22" font-family="${LETTER_FONT}" font-size="64" fill="${c}">${ch}</text>`]]));
// Solid one-color garlands, about 280 wide, drawn as filled ribbons so they outline cleanly in the coloring page.
function ribbon(pts, c, w = 8) {
  const a = [], b = [];
  pts.forEach((p, i) => {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[Math.min(pts.length - 1, i + 1)];
    const dx = p1[0] - p0[0], dy = p1[1] - p0[1], n = Math.hypot(dx, dy) || 1;
    a.push([p[0] - dy / n * w / 2, p[1] + dx / n * w / 2]);
    b.unshift([p[0] + dy / n * w / 2, p[1] - dx / n * w / 2]);
  });
  return poly(a.concat(b), c);
}
const curve = (fn, step = 4) => { const p = []; for (let x = -140; x <= 140; x += step) p.push([x, fn(x)]); return p; };
const archY = x => 44 * (1 - (x / 140) ** 2) - 22;
const GARLANDS = {
  arch: ['Arched', c => ribbon(curve(archY), c)],
  wavy: ['Wavy', c => ribbon(curve(x => Math.sin(x / 140 * Math.PI * 3) * 12), c)],
  straight: ['Straight', c => ribbon([[-140, 0], [140, 0]], c)],
  zigzag: ['Zigzag', c => ribbon(curve(x => (Math.round(x / 20) % 2 ? 11 : -11), 20), c)],
  scallop: ['Scalloped', c => ribbon(curve(x => Math.abs(Math.sin((x + 140) / 280 * Math.PI * 4)) * 24 - 12, 2.5), c)],
  beads: ['Beaded', c => curve(archY, 20).map(([x, y]) => `<circle cx="${x}" cy="${f(y)}" r="7.5" fill="${c}"/>`).join('')],
};
const WIDE = ['bunting', 'lights', 'pomgarland'];
// Default color per decoration; null means it takes its colors from the accent palette instead.
const STICKER_COLOR = { tree: '#1f9150', snowman: '#e8372a', gingerbread: '#d8a066', wreath: '#22b5a7', star: '#f2c244', present: '#22b5a7', candy: '#e8372a', snowflake: '#f8f6f0', bunting: null, lights: null, pomgarland: '#e8372a' };
const STICKER_SIZE = { star: .6, snowflake: .7, present: .8, tree: 1.05, gingerbread: 1.05, wreath: 1.05 };

const W = 600, H = 520;
// Silhouette: the neckline (round, or a V for the cardigan) followed by the shared shoulders, sleeves and body.
const D_REST = 'L420,72 C470,80 505,120 528,200 C552,280 572,350 568,440 L568,462 Q568,472 558,472 L481,472 Q471,472 471,462 Q468,350 444,270 L448,472 L152,472 L156,270 Q132,350 129,462 Q129,472 119,472 L42,472 Q32,472 32,462 L32,440 C28,350 48,280 72,200 C95,120 130,80 180,72 Z';
const CUFF_R = [[572, 494], [468, 494], [468, 446], [572, 446]]; // same band height as the hem; clipped to the sleeve
const CUFF_L = CUFF_R.map(([x, y]) => [W - x, y]);

let S = {
  seed: 7, mode: 'felt', side: 'front', accent: 'Festive',
  base: '#f2e8cf',
  pattern: 'check', p1: '#22355e', p2: '#d8a066',
  yoke: 'none', yokeColor: '#d8a066',
  trim: '#d8a066',
  stitch: 'none', stitchColor: '#e8372a',
  style: 'pullover', buttonColor: '#f8f6f0',
  shapeColor: '#d8a066', letterColor: '#d8a066', garlandColor: '#d8a066',
  stickers: [
    { id: 1, type: 'star', x: 49, y: 282.7, s: 2.175, r: 1.8, c: '#d8a066' },
    { id: 2, type: 'star', x: 542.3, y: 283.3, s: 1.904, r: -3.9, c: '#d8a066' },
  ],
  backStickers: [], // pieces on the back; colors, pattern, yoke and trims are shared by both sides
};
// The side being drawn. The back has a higher neckline and never shows the cardigan opening or buttons.
let VIEW = 'front';
const cardi = () => S.style === 'cardigan' && VIEW === 'front';
const KEY = (side = S.side) => side === 'back' ? 'backStickers' : 'stickers';
const list = () => S[KEY()];

/* ---------- helpers ---------- */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f = n => +n.toFixed(1);
const rect = (x, y, w, h, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
const poly = (pts, c) => `<polygon points="${pts.map(p => f(p[0]) + ',' + f(p[1])).join(' ')}" fill="${c}"/>`;
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const dist = (a, b) => { const x = rgb(a), y = rgb(b); return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]); };
function starPts(n, R, r) {
  const p = [];
  for (let i = 0; i < n * 2; i++) {
    const a = -Math.PI / 2 + i * Math.PI / n, rr = i % 2 ? r : R;
    p.push(f(Math.cos(a) * rr) + ',' + f(Math.sin(a) * rr));
  }
  return p.join(' ');
}
const pom = (x, y, r, c) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${c}"/><circle class="noline" cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="url(#pomShade)"/>`;
const accentCols = () => { const c = PALETTES[S.accent].filter(c => dist(c, S.base) > 60); return c.length ? c : PALETTES[S.accent]; };

/* ---------- layers ---------- */
function patternSVG(R) {
  const { p1, p2 } = S; let s = '';
  switch (S.pattern) {
    case 'stripes':
      for (let y = 100; y < H; y += 56) s += rect(0, y, W, 18, p1) + rect(0, y + 27, W, 6, p2);
      break;
    case 'wide':
      for (let y = 112; y < H; y += 72) s += rect(0, y, W, 30, p1);
      break;
    case 'candy':
      s += '<g transform="rotate(14 300 260)">';
      for (let x = -300; x < 900; x += 38) s += rect(x, -200, 16, 900, p1) + rect(x + 23, -200, 4, 900, p2);
      s += '</g>';
      break;
    case 'argyle': {
      for (let j = 0; j < 6; j++) for (let i = 0; i < 11; i++) {
        if ((i + j) % 2) continue;
        const cx = i * 60, cy = 60 + j * 90;
        s += `<polygon points="${cx},${cy - 45} ${cx + 30},${cy} ${cx},${cy + 45} ${cx - 30},${cy}" fill="${p1}"/>`;
      }
      let l = '';
      for (let n = -12; n < 22; n++) { const x = n * 60; l += `M${x - 600},-840 L${x + 600},960 M${x + 600},-840 L${x - 600},960 `; }
      s += `<path class="line" d="${l}" stroke="${p2}" stroke-width="2.5" stroke-dasharray="7 6" fill="none"/>`;
      break;
    }
    case 'fairisle':
      [150, 285, 405].forEach(y => {
        s += rect(0, y, W, 12, p2);
        let t = '';
        for (let x = 0; x < W; x += 30) { t += `M${x},${y + 12} L${x + 30},${y + 12} L${x + 15},${y + 36}Z `; s += `<circle cx="${x}" cy="${y + 34}" r="3.2" fill="${p2}"/>`; }
        s += `<path d="${t}" fill="${p1}"/>`;
      });
      break;
    case 'check':
      for (let y = 30, row = 0; y < H; y += 30, row++)
        for (let x = row % 2 ? 30 : 0; x < W; x += 60) s += rect(x, y, 30, 30, p1);
      break;
    case 'dots':
      for (let y = 105, row = 0; y < H; y += 40, row++)
        for (let x = row % 2 ? 20 : 0; x < 620; x += 40) s += `<circle cx="${x}" cy="${y}" r="8" fill="${row % 2 ? p2 : p1}"/>`;
      break;
  }
  return s;
}

function yokeSVG() {
  if (S.yoke === 'none') return '';
  let d, extra = '';
  if (S.yoke === 'zigzag') {
    d = 'M0,0 L600,0 ';
    for (let x = 600, i = 0; x >= 0; x -= 25, i++) d += `L${x},${i % 2 ? 170 : 128} `;
  } else {
    d = 'M0,0 L600,0 L600,96 Q300,236 0,96 ';
  }
  return `<path d="${d}Z" fill="${S.yokeColor}"/>${extra}`;
}

function trimSVG() {
  return rect(130, 446, 340, 50, S.trim) + poly(CUFF_R, S.trim) + poly(CUFF_L, S.trim) +
    (cardi()
      ? `<path d="M225,32 L283,170 L283,480 L317,480 L317,170 L375,32 Z" fill="${S.trim}"/>` // V-neck band running into the button band
      : `<path d="M222,30 L378,30 L378,52 Q300,${VIEW === 'back' ? 114 : 136} 222,52 Z" fill="${S.trim}"/>`);
}

function buttonSVG() {
  if (!cardi()) return '';
  let s = '';
  for (let y = 200; y <= 430; y += 57.5)
    s += `<circle cx="300" cy="${y}" r="7" fill="${S.buttonColor}"/><circle class="noline" cx="297.6" cy="${y}" r="1.2" fill="#000" fill-opacity=".45"/><circle class="noline" cx="302.4" cy="${y}" r="1.2" fill="#000" fill-opacity=".45"/>`;
  return s;
}

// Embroidery: dashed running stitch along the trims and the yoke line.
function stitchSVG() {
  if (S.stitch === 'none') return '';
  const yoke = S.yoke;
  let d = 'M150,460 L450,460 ' + (cardi() ? 'M243.9,62.7 L288,168 L288,446 M356.1,62.7 L312,168 L312,446 ' : VIEW === 'back' ? 'M238,55 Q300,92 362,55 ' : 'M238,55 Q300,114 362,55 ');
  [CUFF_R, CUFF_L].forEach(q => { const a = lerp(q[0], q[3], .7), b = lerp(q[1], q[2], .7); d += `M${f(a[0])},${f(a[1])} L${f(b[0])},${f(b[1])} `; });
  if (yoke === 'zigzag') { d += 'M600,116 '; for (let x = 575, i = 1; x >= 0; x -= 25, i++) d += `L${x},${i % 2 ? 158 : 116} `; }
  else if (yoke === 'round') d += 'M0,82 Q300,222 600,82 ';
  return `<path class="line st" d="${d}" stroke="${S.stitchColor}" stroke-width="3" stroke-dasharray="9 7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
}

/* ---------- clip-art decorations ---------- */
function garlandArt(type, c) {
  const cols = accentCols();
  let felt = '', poms = '';
  const P0 = [-144, 0], P1 = [0, 90], P2 = [144, 0], d = `M${P0} Q${P1} ${P2}`;
  const at = t => { const u = 1 - t; return [u * u * P0[0] + 2 * u * t * P1[0] + t * t * P2[0], u * u * P0[1] + 2 * u * t * P1[1] + t * t * P2[1]]; };
  const ang = t => Math.atan2(2 * (1 - t) * (P1[1] - P0[1]) + 2 * t * (P2[1] - P1[1]), 2 * (1 - t) * (P1[0] - P0[0]) + 2 * t * (P2[0] - P1[0])) * 180 / Math.PI;
  const rope = `<path class="line" d="${d}" stroke="#f8f6f0" stroke-width="6.5" stroke-linecap="round" fill="none"/>`;
  if (type === 'bunting') {
    for (let i = 0; i < 10; i++) {
      const t = (i + .5) / 10, p = at(t);
      felt += `<polygon transform="translate(${f(p[0])},${f(p[1])}) rotate(${f(ang(t))})" points="-12,0 12,0 0,26" fill="${cols[i % cols.length]}"/>`;
    }
    poms += rope;
  } else if (type === 'lights') {
    for (let i = 0; i < 8; i++) {
      const t = (i + .5) / 8, p = at(t);
      felt += `<path transform="translate(${f(p[0])},${f(p[1])}) rotate(${f(ang(t) + (i % 2 ? 14 : -14))})" d="M0,2 C10,9 9,25 0,32 C-9,25 -10,9 0,2Z" fill="${cols[i % cols.length]}"/>`;
    }
    poms += rope;
  } else {
    for (let i = 0; i <= 20; i++) { const p = at(i / 20); poms += pom(p[0], p[1], 7, i % 2 ? '#f8f6f0' : c); }
  }
  return { felt, poms };
}

function treeSVG(c, cols) {
  const orn = [[-20, 22], [24, 20], [2, -8], [-14, -28], [12, -40], [-38, 26], [40, 28], [0, 22]];
  return rect(-9, 30, 18, 30, '#7b4a2b') +
    `<path d="M0,-98 L28,-52 L16,-52 L44,-10 L28,-10 L62,36 L-62,36 L-28,-10 L-44,-10 L-16,-52 L-28,-52 Z" fill="${c}"/>` +
    orn.map((o, i) => `<circle cx="${o[0]}" cy="${o[1]}" r="5.5" fill="${cols[i % cols.length]}"/>`).join('') +
    `<polygon transform="translate(0,-98)" points="${starPts(5, 15, 6.5)}" fill="#f2c244"/>`;
}

// Art for one decoration, drawn around (0,0). Returns flat felt pieces and fuzzy pom pieces separately.
function stickerArt(type, c) {
  const piece = SHAPES[type] || LETTERS[type] || GARLANDS[type];
  if (piece) return { felt: piece[1](c), poms: '' };
  if (WIDE.includes(type)) return garlandArt(type, c);
  const cols = PALETTES[S.accent].filter(k => dist(k, c) > 60);
  let felt = '', poms = '';
  switch (type) {
    case 'tree': felt = treeSVG(c, cols); break;
    case 'snowman':
      felt = `<path class="line" d="M-38,22 L-76,-6 M-62,4 L-74,16 M38,22 L76,-6 M62,4 L74,16" stroke="#7b4a2b" stroke-width="4.5" stroke-linecap="round" fill="none"/>` +
        `<circle cx="0" cy="36" r="45" fill="#f8f6f0"/><circle cx="0" cy="-36" r="31" fill="#f8f6f0"/>` +
        `<path d="M-30,-14 Q0,2 30,-14 L31,-2 Q0,14 -31,-2Z" fill="${c}"/><path d="M12,2 L24,36 L10,38 L3,4Z" fill="${c}"/>` +
        `<circle cx="-10" cy="-44" r="3.6" fill="#2b2b2e"/><circle cx="10" cy="-44" r="3.6" fill="#2b2b2e"/>` +
        `<path d="M0,-37 L26,-32 L0,-29Z" fill="#ee7b30"/>` +
        [26, 44, 62].map(y => `<circle cx="-4" cy="${y}" r="4" fill="#2b2b2e"/>`).join('');
      break;
    case 'gingerbread': {
      const g = 'M-14,-38 C-40,-50 -36,-92 0,-92 C36,-92 40,-50 14,-38 L52,-34 C68,-32 68,-10 52,-10 L26,-10 L28,22 L50,60 C56,74 38,84 30,72 L0,34 L-30,72 C-38,84 -56,74 -50,60 L-28,22 L-26,-10 L-52,-10 C-68,-10 -68,-32 -52,-34 Z';
      felt = `<path d="${g}" fill="${c}"/><path class="line" transform="translate(0,-1) scale(.84)" d="${g}" stroke="#f8f6f0" stroke-width="3.6" stroke-linejoin="round" fill="none"/>` +
        `<circle cx="-9" cy="-68" r="3" fill="#3b3b3e"/><circle cx="9" cy="-68" r="3" fill="#3b3b3e"/>` +
        `<path class="line" d="M-9,-57 Q0,-49 9,-57" stroke="#f8f6f0" stroke-width="3" stroke-linecap="round" fill="none"/>` +
        [-22, -4, 14].map((y, i) => `<circle cx="0" cy="${y}" r="5" fill="${cols[i % cols.length]}"/>`).join('');
      break;
    }
    case 'wreath': {
      const light = cols.find(k => dist(k, S.base) > 80) || '#8fd8c4';
      for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; poms += pom(Math.cos(a) * 52, Math.sin(a) * 52 - 6, 16, i % 3 === 1 ? light : c); }
      poms += `<g transform="translate(0,48)"><path d="M0,0 L-30,-16 L-30,16Z M0,0 L30,-16 L30,16Z M-4,4 L-16,34 L-2,28Z M4,4 L16,34 L2,28Z" fill="#e8372a"/><circle r="8" fill="#8e1b2a"/></g>`;
      break;
    }
    case 'star':
      felt = `<polygon points="${starPts(5, 88, 38)}" fill="${c}"/><polygon class="line" points="${starPts(5, 72, 30)}" stroke="#f8f6f0" stroke-width="3" stroke-dasharray="7 6" fill="none"/>`;
      break;
    case 'present': {
      const r = cols[0] || '#f8f6f0';
      felt = rect(-58, -28, 116, 96, c) + rect(-66, -42, 132, 26, c) + rect(-11, -42, 22, 110, r) +
        `<path d="M0,-44 C-40,-90 -70,-50 0,-44 C40,-90 70,-50 0,-44Z" fill="${r}"/><circle cx="0" cy="-46" r="8" fill="${r}"/>`;
      break;
    }
    case 'candy': {
      const d = 'M22,82 L22,-36 A34,34 0 0 0 -46,-36 L-46,-18';
      felt = `<path class="line" d="${d}" stroke="#f8f6f0" stroke-width="26" stroke-linecap="round" fill="none"/><path class="noline" d="${d}" stroke="${c}" stroke-width="26" stroke-dasharray="13 15" stroke-dashoffset="-8" fill="none"/>`;
      break;
    }
    case 'snowflake': {
      let d = '';
      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3, p = (r, da = 0) => f(Math.cos(a + da) * r) + ',' + f(Math.sin(a + da) * r);
        d += `M0,0 L${p(84)} M${p(46)} L${p(68, .28)} M${p(46)} L${p(68, -.28)} M${p(24)} L${p(40, .4)} M${p(24)} L${p(40, -.4)} `;
      }
      felt = `<path class="line" d="${d}" stroke="${c}" stroke-width="8" stroke-linecap="round" fill="none"/><circle r="10" fill="${c}"/>`;
    }
  }
  return { felt, poms };
}

const tf = st => `translate(${f(st.x)},${f(st.y)}) rotate(${f(st.r)}) scale(${+st.s.toFixed(3)})`;

const sweaterPath = (view = VIEW) => (view === 'back' ? 'M255,58 Q300,70 345,58 ' : S.style === 'cardigan' ? 'M255,58 L300,168 L345,58 ' : 'M255,58 Q300,92 345,58 ') + D_REST;
const otherSide = side => side === 'back' ? 'front' : 'back';

/* ---------- wrap-around ----------
   Whatever hangs over the edge on one side carries on round to the other. The overhang is folded over the
   nearest stretch of edge (a mirror across that edge) and then flipped left-to-right, because the other
   side is seen from behind. */
// A piece belongs to the part it sits on: the body (B) or a sleeve (R, L). Below the armpit it stays on that
// part instead of jumping the gap; above the armpit the parts are joined, so it runs straight across the seam.
const sideX = y => 444.5 + Math.max(0, y - 270) * .02;  // the body's side seam
const homeOf = st => { const g = 444.5 + Math.max(0, st.y - 270) * .06; return st.x > g ? 'R' : st.x < W - g ? 'L' : 'B'; };
const inZone = (k, x, y) => y < 270 || (k === 'R' ? x >= sideX(y) : k === 'L' ? x <= W - sideX(y) : x < sideX(y) && x > W - sideX(y));
const ZONE = {
  B: 'M-900,-900 H1500 V270 H444.5 L449.5,520 H150.5 L155.5,270 H-900 Z',
  R: 'M-900,-900 H1500 V1500 H469.1 L444.5,270 H-900 Z',
  L: 'M-900,-900 H1500 V270 H155.5 L130.9,1500 H-900 Z',
};
const FLIPPED = { B: 'B', R: 'L', L: 'R' }; // the same part as seen from the other side
const edgeCache = {};
function edgePoints(d) {
  if (!edgeCache[d]) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.cssText = 'position:absolute;width:0;height:0;visibility:hidden';
    svg.innerHTML = `<path d="${d}"/>`;
    document.body.append(svg);
    const p = svg.firstChild, n = p.getTotalLength(), pts = [];
    for (let l = 0; l < n; l += 4) { const q = p.getPointAtLength(l); pts.push([q.x, q.y]); }
    svg.remove();
    edgeCache[d] = pts;
  }
  return edgeCache[d];
}
function wrapMatrix(st, d, home) {
  const pts = edgePoints(d).filter(p => inZone(home, p[0], p[1]));
  let best = 0, bd = Infinity;
  pts.forEach((p, i) => { const k = (p[0] - st.x) ** 2 + (p[1] - st.y) ** 2; if (k < bd) { bd = k; best = i; } });
  const p = pts[best], a = pts[(best + pts.length - 1) % pts.length], b = pts[(best + 1) % pts.length];
  if (p[0] > 250 && p[0] < 350 && p[1] < 172) return null; // the neck is an opening, not a fold
  const th = Math.atan2(b[1] - a[1], b[0] - a[0]), C = Math.cos(2 * th), Sn = Math.sin(2 * th);
  return `matrix(${[-C, Sn, -Sn, -C, W - (p[0] - C * p[0] - Sn * p[1]), p[1] - Sn * p[0] + C * p[1]].map(v => +v.toFixed(4))})`;
}

const defs = () => `
<clipPath id="sw"><path d="${sweaterPath()}"/></clipPath>
${['B', 'R', 'L'].map(k => `<clipPath id="z${k}"><path d="${ZONE[k]}"/></clipPath>
<clipPath id="o${k}"><path clip-rule="evenodd" d="M-2000,-2000 H2600 V2600 H-2000 Z ${sweaterPath(otherSide(VIEW))}"/><path clip-rule="evenodd" d="M-2000,-2000 H2600 V2600 H-2000 Z ${ZONE[k]}"/></clipPath>`).join('')}
<radialGradient id="pomShade" cx="38%" cy="34%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".16"/></radialGradient>
${['felt', 'feltBase', 'pom'].map((id, i) => `
<filter id="${id}" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="${i === 2 ? 1.1 : .85}" numOctaves="3" seed="${4 + i}" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="${i === 2 ? 3 : 1.2}" xChannelSelector="R" yChannelSelector="G" result="d"/>
  <feColorMatrix in="n" type="matrix" values="0.16 0.16 0.16 0 0.77  0.16 0.16 0.16 0 0.77  0.16 0.16 0.16 0 0.77  0 0 0 0 1" result="g"/>
  <feBlend in="d" in2="g" mode="multiply" result="t"/>
  <feComposite in="t" in2="d" operator="in" result="tex"/>
</filter>`).join('')}
`;

const OUTLINE_CSS = `
.art *{fill:#fff!important;stroke:#222!important;stroke-width:2px!important;stroke-dasharray:none!important;stroke-opacity:1!important;filter:none!important;vector-effect:non-scaling-stroke;stroke-linejoin:round}
.art .line{fill:none!important}
.art .noline{display:none}
.art .st{stroke-dasharray:9 7!important;stroke-linecap:butt}
.art .ol{stroke-width:3.5px!important}`;

function buildSVG(side = S.side, suffix = '') {
  VIEW = side;
  const R = rng(S.seed * 9973 + 11);
  const felt = inner => inner ? `<g filter="url(#felt)">${inner}</g>` : '';
  const clipped = inner => inner ? felt(`<g clip-path="url(#sw)">${inner}</g>`) : '';
  const art = st => { const a = stickerArt(st.type, st.c); return felt(a.felt) + (a.poms ? `<g filter="url(#pom)">${a.poms}</g>` : ''); };
  const stickers = S[KEY(side)].map(st => `<g clip-path="url(#z${homeOf(st)})"><g class="stk" data-id="${st.id}" transform="${tf(st)}">${art(st)}</g></g>`).join('');
  // the cut-off parts of the other side's pieces, wrapped round onto this side
  const wrapped = S[KEY(otherSide(side))].map(st => {
    const home = homeOf(st), m = wrapMatrix(st, sweaterPath(otherSide(side)), home);
    return m ? `<g clip-path="url(#z${FLIPPED[home]})"><g transform="${m}"><g clip-path="url(#o${home})"><g transform="${tf(st)}">${art(st)}</g></g></g></g>` : '';
  }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
<style>${S.mode === 'outline' ? OUTLINE_CSS : ''}</style><defs>${defs()}</defs>${S.mode === 'outline' ? rect(0, 0, W, H, '#fff') : ''}
<g class="art">
<g filter="url(#feltBase)"><path d="${sweaterPath()}" fill="${S.base}"/></g>
${clipped(patternSVG(R))}${clipped(yokeSVG())}${clipped(trimSVG())}${clipped(stitchSVG())}${clipped(buttonSVG())}
<g clip-path="url(#sw)"><g pointer-events="none">${wrapped}</g>${stickers}</g>
<path class="line ol" d="${sweaterPath()}" fill="none" stroke="none"/>
</g></svg>`;
  return suffix ? svg.replace(/(id="|url\(#)(o[BRL]|z[BRL]|sw|feltBase|felt|pomShade|pom)\b/g, '$1$2' + suffix) : svg;
}

/* ---------- UI ---------- */
const stage = document.getElementById('stage'), panel = document.getElementById('panel'), tray = document.getElementById('tray'), letterTray = document.getElementById('letters'), garlandTray = document.getElementById('garlands');
const TRAYS = { shapeColor: SHAPES, letterColor: LETTERS, garlandColor: GARLANDS };
let sel = null, nextId = 3, drag = null;
const cur = () => list().find(s => s.id === sel);

const section = (title, body) => `<section><h2>${title}</h2>${body}</section>`;
const label = t => `<div class="lbl">${t}</div>`;
const swatches = (k, set = COLORS) => '<div class="swatches">' + Object.entries(set).map(([n, c]) =>
  `<button class="sw${S[k] === c ? ' on' : ''}" style="--c:${c}" data-k="${k}" data-v="${c}" title="${n}" aria-label="${n}"></button>`).join('') + '</div>';
const pills = (k, opts) => '<div class="pills">' + opts.map(([v, l]) =>
  `<button class="pill${String(S[k]) === String(v) ? ' on' : ''}" data-k="${k}" data-v="${v}">${l}</button>`).join('') + '</div>';

function clipArtPanel() {
  const st = cur();
  let h = '<div class="clips">' + STICKERS.map(([t, l]) => {
    const a = stickerArt(t, STICKER_COLOR[t] || '#e8372a'), wide = WIDE.includes(t);
    return `<button class="clip${wide ? ' wide' : ''}" data-add="${t}" title="Add ${l}" aria-label="Add ${l}"><svg viewBox="${wide ? '-156 -14 312 92' : '-100 -118 200 212'}">${a.felt}${a.poms}</svg></button>`;
  }).join('') + '</div><p class="note">Click to add one, then drag it on the sweater. Use the blue handle to resize and rotate.</p>';
  if (st) {
    h += label('Selected: ' + STICKERS.find(s => s[0] === st.type)[1]);
    if (STICKER_COLOR[st.type]) h += '<div class="swatches">' + Object.entries(COLORS).map(([n, c]) =>
      `<button class="sw${st.c === c ? ' on' : ''}" style="--c:${c}" data-sc="${c}" title="${n}" aria-label="${n}"></button>`).join('') + '</div>';
    h += '<div class="pills" style="margin-top:10px"><button class="pill" data-act="front">Bring to front</button><button class="pill" data-act="dup">Duplicate</button><button class="pill" data-act="remove">Remove</button></div>';
  }
  if (list().length > 1) h += '<div class="pills" style="margin-top:8px"><button class="pill" data-act="clear">Remove all</button></div>';
  return h;
}

function buildPanel() {
  const p = S.pattern;
  panel.innerHTML =
    section('Style', pills('style', [['pullover', 'Pullover'], ['cardigan', 'Cardigan']]) + (S.style === 'cardigan' ? label('Buttons') + swatches('buttonColor') : '')) +
    section('Sweater color', swatches('base')) +
    section('Pattern', pills('pattern', PATTERNS) +
      (p !== 'none' ? label('Pattern color') + swatches('p1') + (p === 'wide' || p === 'check' ? '' : label('Second color') + swatches('p2')) : '')) +
    section('Yoke', pills('yoke', YOKES) + (S.yoke !== 'none' ? swatches('yokeColor') : '')) +
    section('Cuffs, collar &amp; hem', swatches('trim')) +
    section('Stitching', pills('stitch', STITCHES) + (S.stitch !== 'none' ? swatches('stitchColor') : '')) +
    (CLIP_ART ? section('Clip art', clipArtPanel()) : '');
  document.querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('on', b.dataset.mode === S.mode));
}

// Selection box with remove and resize/rotate handles; lives outside .art so it never exports.
function drawSelection() {
  const svg = stage.querySelector('svg'), st = cur();
  const el = st && svg.querySelector(`.stk[data-id="${st.id}"]`);
  if (!el) return;
  const b = el.getBBox(), k = 1 / st.s, p = 7 * k;
  const x0 = b.x - p, y0 = b.y - p, x1 = b.x + b.width + p, y1 = b.y + b.height + p;
  svg.insertAdjacentHTML('beforeend', `<g class="ui" transform="${tf(st)}">
<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="none" stroke="#3a6cc0" stroke-width="1.5" stroke-dasharray="5 4" vector-effect="non-scaling-stroke" pointer-events="none"/>
<g data-h="del" transform="translate(${x0},${y0}) scale(${k})"><title>Remove</title><circle r="11" fill="#e8372a" stroke="#fff" stroke-width="2"/><path d="M-4,-4 L4,4 M4,-4 L-4,4" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></g>
<g data-h="rs" transform="translate(${x1},${y1}) scale(${k})"><title>Drag to resize and rotate</title><circle r="11" fill="#3a6cc0" stroke="#fff" stroke-width="2"/><path d="M-4,-4 L4,4 M0.5,4 L4,4 L4,0.5 M-0.5,-4 L-4,-4 L-4,-0.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>
</g>`);
}

// One tray of add-on pieces (shapes or garlands) with its own color and controls for the selected piece.
function trayHTML(title, set, colorKey, kind, note) {
  const wide = kind === 'wide';
  const st = cur(), mine = st && set[st.type];
  return `<h2>${title}</h2><div class="tray-row"><div class="clips">` +
    Object.entries(set).map(([t, [l, art]]) =>
      `<button class="clip${kind ? ' ' + kind : ''}" data-add="${t}" title="Add ${l}" aria-label="Add ${l}"><svg viewBox="${wide ? '-150 -34 300 68' : '-40 -40 80 80'}">${art(S[colorKey])}</svg></button>`).join('') +
    '</div><div class="tray-side">' + label(mine ? 'Selected: ' + mine[0] : 'Color') +
    '<div class="swatches">' + Object.entries(COLORS).map(([n, c]) =>
      `<button class="sw${(mine ? st.c : S[colorKey]) === c ? ' on' : ''}" style="--c:${c}" data-sc="${c}" data-ck="${colorKey}" title="${n}" aria-label="${n}"></button>`).join('') + '</div>' +
    (mine ? '<div class="pills" style="margin-top:10px"><button class="pill" data-act="front">Bring to front</button><button class="pill" data-act="dup">Duplicate</button><button class="pill" data-act="remove">Remove</button></div>' : '') +
    `</div></div><p class="note">${note}</p>`;
}
function buildTray() {
  tray.innerHTML = trayHTML('Shapes', SHAPES, 'shapeColor', '', 'Click a shape to add it, then drag it on the sweater. Use the blue handle to resize and rotate, or the red × to remove.');
  letterTray.innerHTML = trayHTML('Letters', LETTERS, 'letterColor', 'letter', 'Click a letter to add it, then drag, resize and rotate it like a shape.');
  garlandTray.innerHTML = trayHTML('Garland', GARLANDS, 'garlandColor', 'wide', 'Click a garland to add it, then drag, resize and rotate it like a shape.') +
    (list().length > 1 ? `<div class="pills" style="margin-top:10px"><button class="pill" data-act="clear">Remove everything from the ${S.side}</button></div>` : '');
}

// Undo: every render compares the design with the last one drawn and, if it changed, remembers the old one.
// The felt / coloring-page view and the side on show are left out, so switching them is not an undo step.
const undoBtn = document.getElementById('undo'), undoStack = [];
const snapshot = () => JSON.stringify({ ...S, mode: null, side: null });
const sideTag = document.getElementById('sideTag');
let lastSnap = snapshot();

function render(rebuild = true) {
  const now = snapshot();
  if (now !== lastSnap) { undoStack.push(lastSnap); if (undoStack.length > 100) undoStack.shift(); lastSnap = now; }
  undoBtn.disabled = !undoStack.length;
  stage.innerHTML = buildSVG();
  sideTag.textContent = S.side === 'back' ? 'Back' : 'Front';
  drawSelection();
  if (rebuild) { buildPanel(); buildTray(); }
}

function undo() {
  if (!undoStack.length) return;
  lastSnap = undoStack.pop();
  const prev = JSON.parse(lastSnap), differs = k => JSON.stringify(prev[k]) !== JSON.stringify(S[k]);
  const f = differs('stickers'), b = differs('backStickers');
  S = { ...prev, mode: S.mode, side: b && !f ? 'back' : f && !b ? 'front' : S.side }; // show the side the undo changed
  if (!cur()) sel = null;
  render();
}

function addSticker(type, props = {}) {
  const n = list().length;
  const st = { id: nextId++, type, x: 300, y: WIDE.includes(type) ? 170 + (n % 4) * 40 : 290 + (n % 4) * 14 - 20, s: STICKER_SIZE[type] || 1, r: 0, c: STICKER_COLOR[type] || '#e8372a', ...props };
  if (!props.c && dist(st.c, S.base) < 70) st.c = dist('#f8f6f0', S.base) > 70 ? '#f8f6f0' : '#f2c244';
  list().push(st);
  return st;
}
function removeSel() { S[KEY()] = list().filter(s => s.id !== sel); sel = null; render(); }

const onControlClick = e => {
  const b = e.target.closest('button'); if (!b) return;
  const d = b.dataset, st = cur();
  if (d.add) sel = addSticker(d.add, SHAPES[d.add] ? { c: S.shapeColor } : LETTERS[d.add] ? { c: S.letterColor, s: 1.4, x: 220 + (list().length % 5) * 40, y: 250 } : GARLANDS[d.add] ? { c: S.garlandColor, y: 170 + (list().length % 4) * 34 } : {}).id;
  else if (d.sc) {
    S[d.ck] = d.sc;
    if (st && TRAYS[d.ck][st.type]) st.c = d.sc; // recolor the selection only from its own tray
  }
  else if (d.act === 'remove') return removeSel();
  else if (d.act === 'clear') { S[KEY()] = []; sel = null; }
  else if (d.act === 'front' && st) { S[KEY()] = list().filter(s => s !== st).concat(st); }
  else if (d.act === 'dup' && st) sel = addSticker(st.type, { ...st, id: nextId++, x: st.x + 24, y: st.y + 24 }).id;
  else if (d.k) S[d.k] = d.v;
  else return;
  render();
};
panel.addEventListener('click', onControlClick);
tray.addEventListener('click', onControlClick);
letterTray.addEventListener('click', onControlClick);
garlandTray.addEventListener('click', onControlClick);

/* ---------- dragging on the sweater ---------- */
function svgPoint(e) {
  const m = stage.querySelector('svg').getScreenCTM().inverse();
  return [e.clientX * m.a + m.e, e.clientY * m.d + m.f];
}
stage.addEventListener('pointerdown', e => {
  const h = e.target.closest('[data-h]'), g = e.target.closest('.stk');
  if (h && h.dataset.h === 'del') return removeSel();
  const [px, py] = svgPoint(e);
  if (h) {
    const st = cur();
    drag = { mode: 'rs', st, a0: Math.atan2(py - st.y, px - st.x), d0: Math.hypot(px - st.x, py - st.y) || 1, s0: st.s, r0: st.r };
  } else if (g) {
    const changed = sel !== +g.dataset.id;
    sel = +g.dataset.id;
    const st = cur();
    drag = { mode: 'move', st, dx: px - st.x, dy: py - st.y };
    if (changed) render();
  } else {
    if (sel !== null) { sel = null; render(); }
    return;
  }
  stage.setPointerCapture(e.pointerId);
  e.preventDefault();
});
stage.addEventListener('pointermove', e => {
  if (!drag) return;
  const [px, py] = svgPoint(e), st = drag.st;
  if (drag.mode === 'move') {
    st.x = Math.max(0, Math.min(W, px - drag.dx)); st.y = Math.max(0, Math.min(H, py - drag.dy));
  } else {
    st.s = Math.max(.2, Math.min(3, drag.s0 * Math.hypot(px - st.x, py - st.y) / drag.d0));
    st.r = drag.r0 + (Math.atan2(py - st.y, px - st.x) - drag.a0) * 180 / Math.PI;
  }
  stage.querySelectorAll(`.stk[data-id="${st.id}"], .ui`).forEach(n => n.setAttribute('transform', tf(st)));
  stage.querySelector(`.stk[data-id="${st.id}"]`).parentNode.setAttribute('clip-path', `url(#z${homeOf(st)})`);
});
const endDrag = () => { if (drag) { drag = null; render(false); } };
stage.addEventListener('pointerup', endDrag);
stage.addEventListener('pointercancel', endDrag);

/* ---------- randomizer ---------- */
function randomize() {
  const R = Math.random, pick = a => a[Math.floor(R() * a.length)];
  const accent = pick(Object.keys(PALETTES)), cols = PALETTES[accent];
  const pattern = pick(['none', 'none', 'stripes', 'wide', 'candy', 'argyle', 'fairisle', 'dots', 'check']);
  const base = pick(['#e8372a', '#e8372a', '#8e1b2a', '#1f9150', '#1d5a37', '#6e6e70', '#22355e', '#d8a066', '#f8f6f0', '#22b5a7', '#f19aab', '#7d9b3d', '#f2e8cf', '#6b2d5c', '#3f7fc4', '#c2356e']);
  let o = cols.filter(c => dist(c, base) > 110).sort(() => R() - .5);
  ['#f8f6f0', '#e8372a', '#f2c244'].forEach(c => { if (o.length < 3 && dist(c, base) > 110 && !o.includes(c)) o.push(c); });
  const at = i => o[i % o.length];
  const center = !CLIP_ART ? null : pick([null, null, ...STICKERS.map(s => s[0]).filter(t => !WIDE.includes(t))]);
  const garland = !CLIP_ART ? null : pick([null, null, ...WIDE]);
  const busy = !!garland;
  S = {
    ...S, seed: Math.floor(R() * 1e6), accent, base, pattern, p1: at(0), p2: at(1),
    yoke: busy ? 'none' : pick(['none', 'zigzag', 'zigzag', 'round']), yokeColor: at(1),
    trim: at(0), stickers: [], backStickers: [],
    stitch: pick(['none', 'none', 'running']),
    style: pick(['pullover', 'pullover', 'pullover', 'cardigan']),
  };
  // thread color: whichever option stands out most against the trim, yoke and body
  S.stitchColor = ['#f8f6f0', '#22355e', '#f2c244', '#e8372a'].map(c => [Math.min(dist(c, S.trim), dist(c, S.base), S.yoke === 'none' ? 999 : dist(c, S.yokeColor)), c]).sort((a, b) => b[0] - a[0])[0][1];
  S.buttonColor = ['#f2c244', '#f8f6f0', '#6b4530', '#22355e'].map(c => [dist(c, S.trim), c]).sort((a, b) => b[0] - a[0])[0][1];
  sel = null;
  if (garland) (center ? [135] : pick([[178], [165, 300], [165, 300], [150, 262, 374]])).forEach(y => addSticker(garland, { y, c: at(0) }));
  if (center) {
    let c = STICKER_COLOR[center];
    if (['snowman', 'present'].includes(center)) c = at(2);
    if (dist(c, base) < 90) c = dist('#f8f6f0', base) > 90 ? '#f8f6f0' : at(0);
    addSticker(center, { y: 305, c });
  }
  render();
}

/* ---------- export ---------- */
// An SVG drawn to a canvas cannot see the page's web fonts, so letters need the font file embedded in the SVG itself.
let fontCSS = null;
async function letterFontCSS() {
  if (fontCSS !== null) return fontCSS;
  try {
    const css = await (await fetch('https://fonts.googleapis.com/css2?family=Graduate&display=swap')).text();
    const url = [...css.matchAll(/url\((https:[^)]+)\)/g)].pop()[1];
    const bytes = new Uint8Array(await (await fetch(url)).arrayBuffer());
    let bin = ''; bytes.forEach(b => bin += String.fromCharCode(b));
    fontCSS = `@font-face{font-family:"Graduate";src:url(data:font/woff2;base64,${btoa(bin)}) format("woff2")}`;
  } catch (e) { return ''; } // offline: letters fall back to a system font, try again next time
  return fontCSS;
}

// Front and back are drawn side by side in one image.
async function download() {
  const scale = 3;
  const hasLetters = [...S.stickers, ...S.backStickers].some(st => LETTERS[st.type]);
  const css = hasLetters ? await letterFontCSS() : '';
  const imgs = await Promise.all(['front', 'back'].map(side => new Promise((res, rej) => {
    const svg = buildSVG(side).replace('<svg ', `<svg width="${W * scale}" height="${H * scale}" `).replace('<style>', '<style>' + css);
    const img = new Image();
    img.onload = () => res(img); img.onerror = rej;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  })));
  if (hasLetters) await new Promise(r => setTimeout(r, 120)); // give the embedded font a moment to decode
  const c = document.createElement('canvas'); c.width = W * scale * 2; c.height = H * scale;
  imgs.forEach((img, i) => c.getContext('2d').drawImage(img, i * W * scale, 0, W * scale, H * scale));
  c.toBlob(b => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = S.mode === 'outline' ? 'sweater-coloring-page.png' : 'felt-sweater.png';
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });
}

// Printing swaps the stage for a sheet with both sides; each copy gets its own ids so their clips and filters don't clash.
const printout = document.getElementById('printout');
window.addEventListener('beforeprint', () => { printout.innerHTML = buildSVG('front', 'F') + buildSVG('back', 'B'); });
window.addEventListener('afterprint', () => { printout.innerHTML = ''; });

function flip() {
  if (drag) return;
  stage.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], { duration: 130, easing: 'ease-in' }).onfinish = () => {
    S.side = S.side === 'back' ? 'front' : 'back'; sel = null; render();
    stage.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 130, easing: 'ease-out' });
  };
}

document.getElementById('rand').onclick = randomize;
undoBtn.onclick = undo;
document.getElementById('flip').onclick = flip;
document.getElementById('dl').onclick = download;
document.getElementById('print').onclick = () => window.print();
document.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => { S.mode = b.dataset.mode; render(); });
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === 'z') { e.preventDefault(); return undo(); }
  if (e.metaKey || e.ctrlKey || e.target.tagName === 'INPUT') return;
  if (e.key === 'r') randomize();
  else if (e.key === 'f') flip();
  else if ((e.key === 'Delete' || e.key === 'Backspace') && sel !== null) { e.preventDefault(); removeSel(); }
  else if (e.key === 'Escape' && sel !== null) { sel = null; render(); }
});

render();
if (document.fonts) document.fonts.ready.then(() => render(false)); // re-measure letters once the font is in
