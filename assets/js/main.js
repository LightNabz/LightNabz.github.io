// ============================================================
// NABZ — ~/index.html
// ============================================================

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── BOOT SEQUENCE ───
const bootLines = [
  '[  OK  ] Created slice User Slice of UID 1000.',
  '[  OK  ] Starting User Manager for UID 1000...',
  '[  OK  ] Started User Manager for UID 1000.',
  '[  OK  ] Reached target Main Root File System.',
  '         Mounting ~/portfolio...',
  '[  OK  ] Mounted ~/portfolio.',
  '         Starting Configuration Parser...',
  '[  OK  ] Loading nabz.conf.',
  '[  OK  ] Reading dotfiles from ~/.config...',
  '[  OK  ] Successfully parsed custom dotfiles.',
  '         Starting WebGL Rendering Contexts...',
  '[  OK  ] Started WebGL Rendering Contexts.',
  '[  OK  ] Pre-fetching project assets and images...',
  '[  OK  ] Initializing CSS Grid and animations...',
  '         Starting Wayland Compositor (hyprland)...',
  '[  OK  ] Started compositor (hyprland).',
  '         Spawning statusbar (waybar)...',
  '[  OK  ] Spawned statusbar.',
  '[  OK  ] Reached target Graphical Web Interface.',
  '[  OK  ] Reached target Multi-User Environment.',
  '',
  'Arch Linux 6.7.6-folk-7 (tty1)',
  '',
  'nabz@arch-chan:~$'
];

function runBoot() {
  const boot = document.getElementById('boot');
  if (prefersReduced) { boot.remove(); return; }
  const container = document.getElementById('boot-lines');
  bootLines.forEach((text, i) => {
    const div = document.createElement('div');
    div.className = 'line' + (text.startsWith('[  OK  ]') ? '' : ' dim');
    div.innerHTML = text.startsWith('[  OK  ]')
      ? `<span class="ok">[  OK  ]</span>${text.slice(8)}`
      : text;
    container.appendChild(div);
    setTimeout(() => div.classList.add('show'), 50 + i * 60);
  });
  setTimeout(() => {
    boot.classList.add('hide');
    setTimeout(() => boot.remove(), 450);
  }, 120 + bootLines.length * 60 + 80);
}
runBoot();

// ─── THEME ───
const html = document.documentElement;
function setTheme(t) {
  html.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
  document.getElementById('theme-toggle').textContent = t === 'dark' ? 'mocha' : 'latte';
}
function initTheme() {
  const current = html.getAttribute('data-theme') || 'light';
  document.getElementById('theme-toggle').textContent = current === 'dark' ? 'mocha' : 'latte';
}
document.getElementById('theme-toggle').addEventListener('click', () => {
  setTheme((html.getAttribute('data-theme') || 'light') === 'dark' ? 'light' : 'dark');
});
initTheme();

// ─── TOAST ───
let toastTimeout;
function showToast(msg, label = 'psst') {
  document.getElementById('toast-msg').textContent = msg;
  document.querySelector('.toast-label').textContent = label;
  const t = document.getElementById('toast');
  t.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => t.classList.remove('show'), 3000);
}
function copyToClipboard(text, label) {
  navigator.clipboard.writeText(text)
    .then(() => showToast(text + ' copied!', label + ' copied'))
    .catch(() => showToast(text));
}

// ─── CLOCK ───
function tickClock() {
  const el = document.getElementById('status-clock');
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  el.textContent = `${days[now.getDay()]} ${hh}:${mm}`;
}
tickClock();
setInterval(tickClock, 15000);

// ─── MOBILE TREE TOGGLE ───
function toggleTree() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ─── USER RAGE CLICK (tsundere, hmph...) ───
let userClicks = 0;
let userMaxed = false;
const MAX_RAGE = 8;
const rageMsgs = [
  "H-hey! Why are you clicking my name?!",
  "Stop that. It's weird.",
  "I—it's not like I care if you click it again...",
  "Seriously, cut it out already.",
  "B-baka! Go read the actual files instead!",
  "...",
  "Fine. One secret: I have no idea what I'm doing either.",
  "N-not like this whole site knows what it's doing! Hmph.",
];
function userClick() {
  if (userMaxed) return;
  const el = document.getElementById('sb-user');
  el.classList.remove('shaking'); void el.offsetWidth; el.classList.add('shaking');
  showToast(rageMsgs[Math.min(userClicks, rageMsgs.length - 1)], 'click #' + (userClicks + 1));
  userClicks++;
  if (userClicks === 5) document.getElementById('konami-hint').style.display = 'block';
  if (userClicks >= MAX_RAGE) maxRage();
}
function maxRage() {
  userMaxed = true;
  const el = document.getElementById('sb-user');
  el.style.opacity = '0';
  setTimeout(() => {
    el.innerHTML = `<img src="assets/images/tsundere.gif" style="height:28px;width:auto;display:block;" alt="rage">`;
    el.style.opacity = '1';
  }, 220);
  showToast("THAT'S IT. HMPH. BAKA.", 'max rage');
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => {
      el.innerHTML = 'nabz@arch-chan';
      el.style.opacity = '1';
      userMaxed = false; userClicks = 0;
      showToast("...fine, i'm back. don't do that again.", 'ok ok');
    }, 220);
  }, 5000);
}

// ─── MOOD / STATUS CYCLE ───
const moods = ['open to work', 'procrastinating', 'in the void', 'debugging since 3am', 'building selachii 🦈', 'fr send help', 'compiling...'];
let moodIdx = 0;
function cycleMood() {
  moodIdx = (moodIdx + 1) % moods.length;
  document.getElementById('status-mood').textContent = moods[moodIdx];
  document.getElementById('status-mood-bar').textContent = '🔋 mood: ' + moods[moodIdx];
  showToast(moods[moodIdx], 'mood');
}

// ─── SECRET / HIDDEN FILE ───
const secrets = [
  'i write html with two spaces not four. fight me.',
  'once spent 6 hours debugging a missing semicolon.',
  'my shell is called "fih 🐟" — yes, on purpose.',
  'selachii means shark in latin, i googled it.',
  'my arch install is named arch-chan, no regrets.',
  'this site is themed off my actual dotfiles.',
  'css is my villain origin story.',
];
let secretIdx = 0;
function revealSecret() {
  const box = document.getElementById('secret-box');
  box.style.display = box.style.display === 'block' ? 'none' : 'block';
  if (box.style.display === 'block') {
    document.getElementById('secret-text').textContent = secrets[secretIdx % secrets.length];
    secretIdx++;
    showToast('found the hidden file 👀', '.secret opened');
  }
}

// ─── NEOFETCH ───
const ARCH_ART = `
         .
        / \\
       /   \\
      /\\    \\
     /       \\
    /         \\
   /    .-.    \\
  /     | |   _ \\
 /   _.'   '._   \\
/ _.-'        '-._\\`;
const NEO_LINES = [
  { type: 'header', text: 'nabz@arch-chan' },
  { type: 'uline', text: '--------------' },
  { type: 'row', key: 'OS', val: 'Arch Linux x86_64' },
  { type: 'row', key: 'Kernel', val: '6.7.6-arch1-1' },
  { type: 'row', key: 'Shell', val: 'fih 🐟' },
  { type: 'row', key: 'WM', val: 'Hyprland' },
  { type: 'row', key: 'Editor', val: 'nvim (of course)' },
  { type: 'row', key: 'Terminal', val: 'kitty' },
  { type: 'row', key: 'Uptime', val: '12 days, 4:20' },
  { type: 'blank' },
  { type: 'colors' },
];
function triggerNeofetch() {
  const wrap = document.getElementById('neofetch-wrap');
  const isOpen = wrap.classList.contains('visible');
  if (isOpen) {
    wrap.classList.remove('visible', 'popped');
    wrap.style.left = ''; wrap.style.top = '';
    return;
  }
  document.getElementById('neo-arch').textContent = ARCH_ART;
  const right = document.getElementById('neo-right');
  right.innerHTML = '';
  wrap.classList.add('visible');
  showToast('arch btw 🐧', 'neofetch');
  NEO_LINES.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'neo-line';
    if (item.type === 'header') div.innerHTML = `<span class="neo-header">${item.text}</span>`;
    else if (item.type === 'uline') div.innerHTML = `<span class="neo-uline">${item.text}</span>`;
    else if (item.type === 'row') div.innerHTML = `<span class="neo-key">${item.key}</span><span class="neo-colon">: </span>${item.val}`;
    else if (item.type === 'blank') div.innerHTML = '&nbsp;';
    else if (item.type === 'colors') {
      const colors = ['--red','--peach','--yellow','--green','--teal','--blue','--mauve','--subtext0'];
      div.innerHTML = colors.map(c => `<span class="neo-sw" style="background:var(${c})"></span>`).join('');
      div.style.cssText += 'display:flex;gap:3px;margin-top:3px;';
    }
    right.appendChild(div);
    setTimeout(() => div.classList.add('show'), 80 + i * 70);
  });
}

// drag drag neofetch owo
const NEO_BREAKPOINT = 860;
function neoIsDesktop() { return window.innerWidth > NEO_BREAKPOINT; }

const neoTitlebar = document.querySelector('.neo-titlebar');
neoTitlebar.addEventListener('dblclick', e => {
  if (!neoIsDesktop()) return;
  if (e.target.classList.contains('neo-dot')) return;
  const wrap = document.getElementById('neofetch-wrap');
  if (wrap.classList.contains('popped')) return;
  const r = wrap.getBoundingClientRect();
  wrap.style.left = r.left + 'px';
  wrap.style.top = r.top + 'px';
  wrap.classList.add('popped');
  showToast('window popped out — drag the titlebar', 'neofetch');
});

let neoDragging = false, neoOffX = 0, neoOffY = 0;
neoTitlebar.addEventListener('mousedown', e => {
  const wrap = document.getElementById('neofetch-wrap');
  if (!wrap.classList.contains('popped')) return;
  if (e.target.classList.contains('neo-dot')) return;
  neoDragging = true;
  const r = wrap.getBoundingClientRect();
  neoOffX = e.clientX - r.left;
  neoOffY = e.clientY - r.top;
});
document.addEventListener('mousemove', e => {
  if (!neoDragging) return;
  const wrap = document.getElementById('neofetch-wrap');
  const ww = wrap.offsetWidth, wh = wrap.offsetHeight;
  const nx = Math.min(Math.max(8, e.clientX - neoOffX), window.innerWidth - ww - 8);
  const ny = Math.min(Math.max(8, e.clientY - neoOffY), window.innerHeight - wh - 8);
  wrap.style.left = nx + 'px';
  wrap.style.top = ny + 'px';
});
document.addEventListener('mouseup', () => { neoDragging = false; });

// ─── KONAMI CODE ───
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;
document.addEventListener('keydown', e => {
  if (e.key === KONAMI[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === KONAMI.length) {
      showToast('unlocking something special... 👾', 'secret found');
      setTimeout(() => { window.location.href = 'index-retro.html'; }, 900);
      konamiIdx = 0;
    }
  } else { konamiIdx = 0; }
});

// ─── DRAGGABLE DESKTOP ICON ───
const icon = document.getElementById('desktop-icon');
let dragging = false, offX = 0, offY = 0;
function startDrag(x, y) {
  dragging = true;
  const r = icon.getBoundingClientRect();
  offX = x - r.left; offY = y - r.top;
}
function moveDrag(x, y) {
  if (!dragging) return;
  icon.style.left = (x - offX) + 'px';
  icon.style.top = (y - offY) + 'px';
  icon.style.bottom = 'auto'; icon.style.right = 'auto';
}
icon.addEventListener('mousedown', e => startDrag(e.clientX, e.clientY));
document.addEventListener('mousemove', e => moveDrag(e.clientX, e.clientY));
document.addEventListener('mouseup', () => { if (dragging) { dragging = false; showToast('u found the fish 🐟', 'desktop icon'); } });
icon.addEventListener('touchstart', e => { const t = e.touches[0]; startDrag(t.clientX, t.clientY); e.preventDefault(); }, { passive: false });
document.addEventListener('touchmove', e => { const t = e.touches[0]; moveDrag(t.clientX, t.clientY); }, { passive: false });
document.addEventListener('touchend', () => { dragging = false; });

// ─── DEV CONSOLE EGG ───
setTimeout(() => {
  console.log('%c🐟 fih', 'color:#40a02b;font-size:2rem;font-weight:900;');
  console.log('%cnabz@arch-chan:~ — hi stalker 👋', 'font-family:monospace;font-size:13px;');
  console.log('%ctry the konami code: ↑↑↓↓←→←→BA', 'color:#1e66f5;font-family:monospace;font-size:12px;');
}, 1500);
