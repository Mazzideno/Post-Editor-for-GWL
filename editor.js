/* ============================================
   GWL POST STUDIO — editor.js
   Built by MazziGroup | @mazzigroup 2026
   Ikuyinminu Michael Mazzideno
   ============================================ */

'use strict';

// ─── STATE ───
let accentColor = '#FFCA28';
let textAlign = 'left';
let shapes = [];
let userLogo = null;
let isStoryMode = false;
let isDragging = false;
let dragShapeIdx = -1;
let dragOffX = 0, dragOffY = 0;

// ─── TEMPLATES ───
const templates = {
  reality: {
    label: 'TODAY\'S TRUTH',
    headline: 'Learning a new language has taught me to live fully in the present — because I literally cannot speak any other tense yet.',
    accent: 'live fully in the present',
    body: 'Jokes apart — your brain is doing something extraordinary right now. Every tense you master unlocks a new way to tell your story.',
    cta: '💬 Which tense trips you up most? Drop it below ↓',
    brand: 'GOODWILL LANGUAGE SOLUTION  ·  CLARITY. ACROSS BORDERS.'
  },
  quote: {
    label: 'LANGUAGE QUOTE',
    headline: '"The limits of my language are the limits of my world." — Ludwig Wittgenstein',
    accent: 'limits of my world',
    body: 'Expand your language. Expand your world. It\'s that simple — and that powerful.',
    cta: '💬 What language are you learning? Tell us!',
    brand: 'GOODWILL LANGUAGE SOLUTION  ·  CLARITY. ACROSS BORDERS.'
  },
  myth: {
    label: 'MYTH VS REALITY',
    headline: 'People think accent means incompetence. Reality: it means you\'re doing something most people are too afraid to try.',
    accent: 'too afraid to try',
    body: 'Your accent is proof of courage. Wear it. Own it. Speak anyway.',
    cta: '💬 Drop a ✅ if you agree!',
    brand: 'GOODWILL LANGUAGE SOLUTION  ·  CLARITY. ACROSS BORDERS.'
  },
  fact: {
    label: 'DID YOU KNOW',
    headline: 'People who speak 2+ languages earn more, empathize more, and even age slower.',
    accent: 'earn more, empathize more',
    body: 'Your second language isn\'t just a skill. It\'s a biological upgrade. Science said so.',
    cta: '💬 What\'s your second language? Share below!',
    brand: 'GOODWILL LANGUAGE SOLUTION  ·  CLARITY. ACROSS BORDERS.'
  },
  culture: {
    label: 'CULTURE DROP',
    headline: 'Food is not just food. What you eat is what your grandparents decided you would be.',
    accent: 'your grandparents decided',
    body: 'Culture lives in recipes, songs, proverbs. Every dish is a conversation across generations.',
    cta: '💬 What dish most represents your culture?',
    brand: 'GOODWILL LANGUAGE SOLUTION  ·  CLARITY. ACROSS BORDERS.'
  },
  announce: {
    label: 'ANNOUNCEMENT',
    headline: 'New Month. Clearer Understanding. Let Your Message Transcend Borders.',
    accent: 'Transcend Borders',
    body: 'We help individuals and brands communicate with clarity across languages and cultures.',
    cta: '🌍 Visit us — Goodwill Language Solution',
    brand: 'GOODWILL LANGUAGE SOLUTION  ·  CLARITY. ACROSS BORDERS.'
  },
  promo: {
    label: 'SPECIAL OFFER',
    headline: 'Your language barrier ends today. Professional translation & language coaching available now.',
    accent: 'ends today',
    body: 'From business documents to personal communication — we bridge the gap with clarity and care.',
    cta: '📩 DM us or visit the link in bio!',
    brand: 'GOODWILL LANGUAGE SOLUTION  ·  CLARITY. ACROSS BORDERS.'
  },
  blank: {
    label: 'YOUR LABEL',
    headline: 'Write your own headline here. Make it bold. Make it yours.',
    accent: 'Make it yours',
    body: 'Add your subtext or body copy here. Keep it short, sharp, and meaningful.',
    cta: '💬 Add your call to action here',
    brand: 'YOUR BRAND  ·  YOUR TAGLINE'
  }
};

// ─── INIT ───
window.onload = () => {
  renderCanvas();
  setupCanvasDrag();
};

// ─── THEME TOGGLE ───
function toggleTheme() {
  const html = document.documentElement;
  const isLight = html.getAttribute('data-theme') === 'light';
  html.setAttribute('data-theme', isLight ? 'dark' : 'light');
  document.getElementById('themeIcon').className = isLight ? 'ti ti-sun' : 'ti ti-moon';
  document.getElementById('themeLabel').textContent = isLight ? 'Light Mode' : 'Dark Mode';
}

// ─── TEMPLATE SETTER ───
function setTpl(name, btn) {
  document.querySelectorAll('.tpl-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const t = templates[name];
  document.getElementById('inLabel').value = t.label;
  document.getElementById('inHeadline').value = t.headline;
  document.getElementById('inAccentPhrase').value = t.accent;
  document.getElementById('inBody').value = t.body;
  document.getElementById('inCta').value = t.cta;
  document.getElementById('inBrand').value = t.brand;
  renderCanvas();
}

// ─── TEXT TRANSFORM ───
function transformText(id, mode) {
  const el = document.getElementById(id);
  if (!el) return;
  const v = el.value;
  el.value = mode === 'upper' ? v.toUpperCase()
    : mode === 'lower' ? v.toLowerCase()
    : v.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase());
  renderCanvas();
}

// ─── ALIGNMENT ───
function setAlign(dir, btn) {
  textAlign = dir;
  document.querySelectorAll('.align-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderCanvas();
}

// ─── ACCENT COLOR ───
function setAccent(color, el) {
  accentColor = color;
  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
  if (el) el.classList.add('active');
  renderCanvas();
}

// ─── LOGO UPLOAD ───
function loadUserLogo(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => { userLogo = img; renderCanvas(); };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ─── SHAPES ───
function addShape(type) {
  const color = document.getElementById('shapeColor').value;
  const op = parseInt(document.getElementById('shapeOp').value) / 100;
  shapes.push({ type, x: 100, y: 100, w: 200, h: 200, color, op });
  renderCanvas();
}
function clearShapes() { shapes = []; renderCanvas(); }

// ─── STORY MODE ───
function toggleSize() {
  isStoryMode = !isStoryMode;
  const canvas = document.getElementById('postCanvas');
  const btn = document.getElementById('sizeToggle');
  const label = document.querySelector('.canvas-size-label');
  if (isStoryMode) {
    canvas.width = 1080; canvas.height = 1920;
    btn.innerHTML = '<i class="ti ti-square"></i> Square';
    label.textContent = '1080 × 1920 px (Story)';
  } else {
    canvas.width = 1080; canvas.height = 1080;
    btn.innerHTML = '<i class="ti ti-device-mobile"></i> Story';
    label.textContent = '1080 × 1080 px';
  }
  renderCanvas();
}

function downloadStory() {
  const prev = isStoryMode;
  if (!prev) toggleSize();
  setTimeout(() => {
    download('png', 'story');
    if (!prev) toggleSize();
  }, 100);
}

// ─── RESET ───
function resetAll() {
  shapes = [];
  userLogo = null;
  accentColor = '#FFCA28';
  textAlign = 'left';
  document.querySelectorAll('.tpl-btn')[0].click();
  document.getElementById('hSize').value = 54;
  document.getElementById('bSize').value = 30;
  document.getElementById('hSizeVal').textContent = '54';
  document.getElementById('bSizeVal').textContent = '30';
  document.getElementById('bgTop').value = '#0B2D6E';
  document.getElementById('bgBot').value = '#1A5DC8';
  document.getElementById('logoPos').value = 'none';
  setAlign('left', document.getElementById('alignLeft'));
  renderCanvas();
}

// ─── COPY CAPTION ───
function copyCaption() {
  const text = [
    document.getElementById('inHeadline').value,
    '',
    document.getElementById('inBody').value,
    '',
    document.getElementById('inCta').value,
    '',
    '— ' + document.getElementById('inBrand').value
  ].join('\n');
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.export-btn.copy');
    btn.innerHTML = '<i class="ti ti-check"></i> Copied!';
    setTimeout(() => { btn.innerHTML = '<i class="ti ti-copy"></i> Copy Caption'; }, 2000);
  });
}

// ─── CANVAS DRAG ───
function setupCanvasDrag() {
  const canvas = document.getElementById('postCanvas');
  const wrap = document.getElementById('canvasWrap');

  canvas.addEventListener('mousedown', e => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    for (let i = shapes.length - 1; i >= 0; i--) {
      const s = shapes[i];
      if (mx >= s.x && mx <= s.x + s.w && my >= s.y && my <= s.y + s.h) {
        isDragging = true;
        dragShapeIdx = i;
        dragOffX = mx - s.x;
        dragOffY = my - s.y;
        break;
      }
    }
  });

  canvas.addEventListener('mousemove', e => {
    if (!isDragging || dragShapeIdx < 0) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
    shapes[dragShapeIdx].x = mx - dragOffX;
    shapes[dragShapeIdx].y = my - dragOffY;
    renderCanvas();
  });

  canvas.addEventListener('mouseup', () => { isDragging = false; dragShapeIdx = -1; });
  canvas.addEventListener('mouseleave', () => { isDragging = false; dragShapeIdx = -1; });
}

// ─── TEXT HELPERS ───
function wrapLines(ctx, text, maxW) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line + w + ' ';
    if (ctx.measureText(test).width > maxW && line !== '') {
      lines.push(line.trim()); line = w + ' ';
    } else line = test;
  }
  lines.push(line.trim());
  return lines;
}

function drawHeadlineAccent(ctx, text, accentPhrase, x, y, maxW, lineH, baseColor, accentCol, align, canvasW, pad) {
  const lines = wrapLines(ctx, text, maxW);
  const accent = accentPhrase.trim().toLowerCase();

  lines.forEach((line, i) => {
    let startX = x;
    if (align === 'center') startX = canvasW / 2 - ctx.measureText(line).width / 2;
    else if (align === 'right') startX = canvasW - pad - ctx.measureText(line).width;

    let cx = startX;
    const words = line.split(' ');
    words.forEach((word, wi) => {
      const wLower = word.toLowerCase().replace(/[.,!?'"]/g, '');
      const inAcc = accent && (accent.includes(wLower) || wLower.includes(accent.split(' ')[0]));
      ctx.fillStyle = inAcc ? accentCol : baseColor;
      ctx.fillText(word + (wi < words.length - 1 ? ' ' : ''), cx, y + i * lineH);
      cx += ctx.measureText(word + ' ').width;
    });
  });
  return lines.length;
}

function drawLines(ctx, lines, x, y, lineH, color, align, canvasW, pad) {
  lines.forEach((line, i) => {
    let lx = x;
    if (align === 'center') lx = canvasW / 2;
    else if (align === 'right') lx = canvasW - pad;
    ctx.fillStyle = color;
    ctx.textAlign = align === 'left' ? 'left' : align;
    ctx.fillText(line, lx, y + i * lineH);
  });
  ctx.textAlign = 'left';
}

// ─── DRAW SHAPES ───
function drawShapes(ctx) {
  shapes.forEach(s => {
    const hex = s.color;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    ctx.fillStyle = `rgba(${r},${g},${b},${s.op})`;
    ctx.strokeStyle = `rgba(${r},${g},${b},${Math.min(s.op + 0.3, 1)})`;
    ctx.lineWidth = 3;

    ctx.beginPath();
    if (s.type === 'rect') {
      ctx.roundRect(s.x, s.y, s.w, s.h, 16);
      ctx.fill();
    } else if (s.type === 'circle') {
      ctx.arc(s.x + s.w / 2, s.y + s.h / 2, s.w / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (s.type === 'triangle') {
      ctx.moveTo(s.x + s.w / 2, s.y);
      ctx.lineTo(s.x + s.w, s.y + s.h);
      ctx.lineTo(s.x, s.y + s.h);
      ctx.closePath();
      ctx.fill();
    } else if (s.type === 'line') {
      ctx.strokeStyle = `rgba(${r},${g},${b},${s.op + 0.4})`;
      ctx.lineWidth = 6;
      ctx.moveTo(s.x, s.y + s.h / 2);
      ctx.lineTo(s.x + s.w, s.y + s.h / 2);
      ctx.stroke();
    } else if (s.type === 'star') {
      const cx = s.x + s.w / 2, cy = s.y + s.h / 2;
      const outerR = s.w / 2, innerR = s.w / 4;
      for (let p = 0; p < 5; p++) {
        const a = (p * 4 * Math.PI) / 5 - Math.PI / 2;
        const ai = ((p * 4 + 2) * Math.PI) / 5 - Math.PI / 2;
        p === 0 ? ctx.moveTo(cx + outerR * Math.cos(a), cy + outerR * Math.sin(a))
          : ctx.lineTo(cx + outerR * Math.cos(a), cy + outerR * Math.sin(a));
        ctx.lineTo(cx + innerR * Math.cos(ai), cy + innerR * Math.sin(ai));
      }
      ctx.closePath(); ctx.fill();
    } else if (s.type === 'quote') {
      ctx.font = `bold ${s.w * 0.6}px 'Playfair Display', serif`;
      ctx.fillText('\u201C', s.x, s.y + s.h * 0.7);
    }
  });
}

// ─── DRAW LOGO ───
function drawLogo(ctx, W, H) {
  const pos = document.getElementById('logoPos').value;
  if (pos === 'none' || !userLogo) return;
  const sz = parseInt(document.getElementById('logoSz').value);
  let lx, ly;
  const pad = 50;
  if (pos === 'br') { lx = W - sz - pad; ly = H - sz - pad; }
  else if (pos === 'bl') { lx = pad; ly = H - sz - pad; }
  else if (pos === 'tr') { lx = W - sz - pad; ly = pad; }
  else if (pos === 'tl') { lx = pad; ly = pad; }
  else if (pos === 'center') { lx = (W - sz) / 2; ly = (H - sz) / 2; ctx.globalAlpha = 0.12; }
  ctx.drawImage(userLogo, lx, ly, sz, sz);
  ctx.globalAlpha = 1.0;
}

// ─── BACKGROUND ───
function drawBackground(ctx, W, H) {
  const bgStyle = document.getElementById('bgStyle').value;
  const c1 = document.getElementById('bgTop').value;
  const c2 = document.getElementById('bgBot').value;
  const op = parseInt(document.getElementById('overlayOp').value) / 100;

  if (bgStyle === 'solid') {
    ctx.fillStyle = c1;
    ctx.fillRect(0, 0, W, H);
  } else if (bgStyle === 'gradient') {
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, c1);
    grad.addColorStop(1, c2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  } else if (bgStyle === 'radial') {
    const grad = ctx.createRadialGradient(W * 0.4, H * 0.35, 0, W / 2, H / 2, W * 0.8);
    grad.addColorStop(0, c2);
    grad.addColorStop(1, c1);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  } else if (bgStyle === 'geo') {
    ctx.fillStyle = c1;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = c2;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.18;
    for (let r = 0; r < H + 200; r += 80) {
      ctx.beginPath();
      ctx.moveTo(0, r);
      ctx.lineTo(H, r - 200);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  } else if (bgStyle === 'diagonal') {
    ctx.fillStyle = c1;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = c2;
    ctx.beginPath();
    ctx.moveTo(W * 0.4, 0);
    ctx.lineTo(W, 0);
    ctx.lineTo(W, H);
    ctx.lineTo(W * 0.6, H);
    ctx.closePath();
    ctx.fill();
  }

  // Overlay circles
  ctx.fillStyle = `rgba(255,255,255,${op})`;
  ctx.beginPath(); ctx.arc(W + 80, -80, 480, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(-80, H + 80, 350, 0, Math.PI * 2); ctx.fill();
}

// ─── MAIN RENDER ───
function renderCanvas() {
  const canvas = document.getElementById('postCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const label = document.getElementById('inLabel').value;
  const headline = document.getElementById('inHeadline').value;
  const accentPhrase = document.getElementById('inAccentPhrase').value;
  const body = document.getElementById('inBody').value;
  const cta = document.getElementById('inCta').value;
  const brand = document.getElementById('inBrand').value;
  const hFont = document.getElementById('fontHeadline').value;
  const hSize = parseInt(document.getElementById('hSize').value);
  const bSize = parseInt(document.getElementById('bSize').value);
  const pad = 90;
  const maxW = W - pad * 2;
  const align = textAlign;

  drawBackground(ctx, W, H);
  drawShapes(ctx);

  let cy = isStoryMode ? 220 : 110;

  // ─── PILL LABEL ───
  ctx.font = `700 ${Math.round(hSize * 0.45)}px 'Plus Jakarta Sans', sans-serif`;
  const lw = ctx.measureText(label).width + 56;
  const lh = Math.round(hSize * 0.9);
  let lx = pad;
  if (align === 'center') lx = W / 2 - lw / 2;
  else if (align === 'right') lx = W - pad - lw;
  ctx.beginPath();
  ctx.roundRect(lx, cy, lw, lh, 100);
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = accentColor;
  ctx.fillText(label, lx + 28, cy + lh * 0.64);
  cy += lh + Math.round(hSize * 1.0);

  // ─── SUB HEADER ───
  ctx.font = `500 ${Math.round(bSize * 0.85)}px 'Plus Jakarta Sans', sans-serif`;
  ctx.letterSpacing = '4px';
  ctx.fillStyle = 'rgba(127,184,255,0.9)';
  ctx.textAlign = align === 'center' ? 'center' : align === 'right' ? 'right' : 'left';
  const subX = align === 'center' ? W / 2 : align === 'right' ? W - pad : pad;
  ctx.fillText('LANGUAGE REALITY CHECK', subX, cy);
  ctx.letterSpacing = '0px';
  ctx.textAlign = 'left';
  cy += Math.round(bSize * 1.5);

  // ─── HEADLINE ───
  const hLineH = Math.round(hSize * 1.28);
  ctx.font = `700 ${hSize}px ${hFont}`;
  const hLines = drawHeadlineAccent(ctx, headline, accentPhrase, pad, cy, maxW, hLineH, '#ffffff', accentColor, align, W, pad);
  cy += hLines * hLineH + Math.round(hSize * 0.9);

  // ─── BODY ───
  const bLineH = Math.round(bSize * 1.55);
  ctx.strokeStyle = 'rgba(127,184,255,0.5)';
  ctx.lineWidth = 4;
  if (align === 'left') {
    ctx.beginPath(); ctx.moveTo(pad, cy); ctx.lineTo(pad, cy + bLineH * 0.7); ctx.stroke();
  }
  ctx.font = `400 ${bSize}px 'Plus Jakarta Sans', sans-serif`;
  const bLines = wrapLines(ctx, body, align === 'left' ? maxW - 28 : maxW);
  const bx = align === 'left' ? pad + 28 : pad;
  drawLines(ctx, bLines, bx, cy, bLineH, 'rgba(255,255,255,0.72)', align, W, pad);
  cy += bLines.length * bLineH + Math.round(bSize * 1.6);

  // ─── CTA BOX ───
  const ctaH = Math.round(bSize * 2.4);
  ctx.beginPath();
  ctx.roundRect(pad, cy, maxW, ctaH, 100);
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.font = `500 ${Math.round(bSize * 0.95)}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(cta, W / 2, cy + ctaH * 0.6);
  ctx.textAlign = 'left';
  cy += ctaH + Math.round(bSize * 1.6);

  // ─── DIVIDER ───
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(pad, cy); ctx.lineTo(W - pad, cy); ctx.stroke();
  cy += Math.round(bSize * 1.1);

  // ─── BRAND LINE ───
  ctx.font = `600 ${Math.round(bSize * 0.8)}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.textAlign = 'center';
  ctx.fillText(brand, W / 2, cy);
  ctx.textAlign = 'left';

  drawLogo(ctx, W, H);
}

// ─── DOWNLOAD ───
function download(fmt, suffix) {
  const canvas = document.getElementById('postCanvas');
  const link = document.createElement('a');
  const ts = new Date().toISOString().slice(0, 10);
  const sfx = suffix ? `-${suffix}` : '';
  link.download = `GWL-post${sfx}-${ts}.${fmt}`;
  link.href = fmt === 'png'
    ? canvas.toDataURL('image/png')
    : canvas.toDataURL('image/jpeg', 0.95);
  link.click();
}
