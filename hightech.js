/* hightech.js — couche "high-tech" : texte décodé, rôle tapé façon terminal, HUD système,
   palette de commandes (Ctrl/⌘+K), boutons magnétiques, coins HUD sur les cartes. */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];

  /* ---------- CSS ---------- */
  const st = document.createElement('style');
  st.textContent = `
  .fx-caret{display:inline-block;margin-left:2px;animation:fxBlink 1s steps(1) infinite}
  @keyframes fxBlink{50%{opacity:0}}
  .fx-spot::before{content:"";position:absolute;inset:10px;pointer-events:none;opacity:0;transition:opacity .35s;z-index:3;
    background:
      linear-gradient(#6366f1,#6366f1) top left/16px 1.5px no-repeat, linear-gradient(#6366f1,#6366f1) top left/1.5px 16px no-repeat,
      linear-gradient(#6366f1,#6366f1) top right/16px 1.5px no-repeat, linear-gradient(#6366f1,#6366f1) top right/1.5px 16px no-repeat,
      linear-gradient(#6366f1,#6366f1) bottom left/16px 1.5px no-repeat, linear-gradient(#6366f1,#6366f1) bottom left/1.5px 16px no-repeat,
      linear-gradient(#6366f1,#6366f1) bottom right/16px 1.5px no-repeat, linear-gradient(#6366f1,#6366f1) bottom right/1.5px 16px no-repeat}
  .fx-spot:hover::before{opacity:.9}
  #fx-hud{position:fixed;right:1rem;bottom:1rem;z-index:95;display:none;gap:.5rem;align-items:center;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
  @media(min-width:640px){#fx-hud{display:flex}}
  #fx-hud .pill{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:.5rem .8rem;border-radius:999px;
    background:rgba(255,255,255,.7);color:#334155;border:1px solid rgba(148,163,184,.35);backdrop-filter:blur(14px)}
  .dark #fx-hud .pill{background:rgba(15,23,42,.65);color:#cbd5e1;border-color:rgba(51,65,85,.7)}
  #fx-hud .live{display:inline-block;width:6px;height:6px;border-radius:50%;background:#10b981;margin-right:.5rem;box-shadow:0 0 8px #10b981}
  #fx-hud .pill svg{width:11px;height:11px;vertical-align:-1px;color:#ff6a13}
  #fx-hud button.pill{cursor:pointer;transition:transform .2s}
  #fx-hud button.pill:hover{transform:translateY(-2px)}
  #fx-toast{position:fixed;right:1rem;bottom:4.2rem;z-index:95;display:none;font:700 11px ui-monospace,Menlo,monospace;
    padding:.65rem .9rem;border-radius:.9rem;background:rgba(2,6,23,.88);color:#a5f3fc;border:1px solid rgba(99,102,241,.5);
    opacity:0;transform:translateY(8px);transition:opacity .3s,transform .3s;backdrop-filter:blur(10px)}
  @media(min-width:640px){#fx-toast{display:block}}
  #fx-toast.on{opacity:1;transform:none}
  #fx-toast b{color:#fb923c}
  #fx-pal li button{display:flex;width:100%;align-items:center;justify-content:space-between;gap:1rem;text-align:left;
    padding:.7rem 1rem;border-radius:.9rem;font-size:.85rem;font-weight:600}
  #fx-pal li button.sel{background:linear-gradient(90deg,rgba(37,99,235,.14),rgba(99,102,241,.14));color:#4f46e5}
  .dark #fx-pal li button.sel{color:#a5b4fc}
  `;
  document.head.appendChild(st);

  /* ---------- Scramble (texte décodé) ---------- */
  const CH = '01<>/\\{}[]#*+=_';
  function scramble(node, text, dur) {
    if (reduce) { node.textContent = text; return; }
    const t0 = performance.now(); dur = dur || 900;
    (function step(now) {
      const p = Math.min(1, (now - t0) / dur);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        out += (c === ' ' || i < p * text.length) ? c : CH[(Math.random() * CH.length) | 0];
      }
      node.textContent = out;
      if (p < 1) requestAnimationFrame(step); else node.textContent = text;
    })(t0);
  }
  const lastText = (el) => [...el.childNodes].reverse().find((n) => n.nodeType === 3 && n.textContent.trim());

  // Mot-clé du hero : décodé au chargement et au survol
  const hl = $('#accueil h1 span');
  if (hl) {
    const n = hl.firstChild, txt = hl.textContent;
    if (n && n.nodeType === 3) {
      setTimeout(() => scramble(n, txt, 1100), 300);
      hl.style.cursor = 'default';
      hl.addEventListener('mouseenter', () => scramble(n, txt, 700));
    }
  }

  // Titres de sections : décodage à l'apparition
  $$('#competences h2, #projets h2, #parcours h2, #methode h2').forEach((h2) => {
    const node = lastText(h2);
    if (!node) return;
    const label = node.textContent;
    let done = false;
    new IntersectionObserver((es, o) => es.forEach((e) => {
      if (e.isIntersecting && !done) { done = true; o.disconnect(); scramble(node, label, 800); }
    }), { threshold: 0.8 }).observe(h2);
  });

  /* ---------- Rôle tapé façon terminal ---------- */
  const h1 = $('#accueil h1');
  if (h1) {
    const p = document.createElement('p');
    p.className = 'fx-in font-mono text-xs sm:text-base text-cobalt-600 dark:text-cobalt-400 mb-6 min-h-[1.5rem] break-words';
    p.innerHTML = '<span class="opacity-60">&gt;</span> <span id="fx-role"></span><span class="fx-caret">▍</span>';
    h1.after(p);
    const roles = [
      'const play = pickAndRoll(front, back);',
      'await dribble(bugs).then(shoot);',
      'API.defend({ auth: "JWT", rebound: true });',
      'if (clutch) return deploy("prod");',
      'Interfaces fluides, architectures solides.'
    ];
    const out = $('#fx-role');
    if (reduce) out.textContent = roles[0];
    else {
      let r = 0, c = 0, del = false;
      (function tick() {
        const w = roles[r];
        out.textContent = w.slice(0, c);
        let delay = del ? 28 : 65;
        if (!del && c === w.length) { del = true; delay = 1600; }
        else if (del && c === 0) { del = false; r = (r + 1) % roles.length; delay = 350; }
        c += del ? -1 : 1;
        setTimeout(tick, delay);
      })();
    }
  }

  /* ---------- HUD système ---------- */
  const hud = document.createElement('div');
  hud.id = 'fx-hud';
  hud.innerHTML = '<div class="pill"><span class="live"></span>SYS ONLINE · DKR <span id="fx-time">--:--:--</span> · <span id="fx-scroll">0</span>%</div>' +
    '<div class="pill"><svg aria-hidden="true"><use href="#ico-court"></use></svg> <span id="fx-score">0</span> PTS</div>' +
    '<button class="pill" id="fx-pal-btn" aria-label="Ouvrir la palette de commandes">⌘K · Commandes</button>';
  document.body.appendChild(hud);
  const tEl = $('#fx-time'), sEl = $('#fx-scroll');
  const clock = () => {
    tEl.textContent = new Date().toLocaleTimeString('fr-FR', { timeZone: 'Africa/Dakar', hour12: false });
  };
  clock(); setInterval(clock, 1000);
  let maxScroll = 1, tick = false;
  const calc = () => { maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight); };
  const sc = () => { tick = false; sEl.textContent = Math.min(100, Math.round((scrollY / maxScroll) * 100)); };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(sc); } }, { passive: true });
  addEventListener('resize', calc); addEventListener('load', calc); setTimeout(calc, 800); calc(); sc();

  /* ---------- Palette de commandes ---------- */
  const go = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); };
  const cmds = [
    ['Accueil', 'accueil'], ['Compétences', 'competences'], ['Projets', 'projets'],
    ['Parcours', 'parcours'], ['Ma Méthode', 'methode'], ['Contact', 'contact']
  ].map(([l, id]) => ({ l: 'Aller à · ' + l, k: 'Section', run: () => go(id) }));
  [['Task-manager', 'taskmanager'], ['Portfolio Pro', 'portfolio'], ['API Secure & Scalable', 'api'], ['Meth-Shop', 'methshop'], ['Tarteel', 'tarteel']]
    .forEach(([l, id]) => cmds.push({ l: 'Ouvrir le projet · ' + l, k: 'Projet', run: () => { const c = $('[data-project="' + id + '"]'); if (c) c.click(); } }));
  cmds.push({ l: 'Lancer un tir (touche B)', k: 'Basket', run: () => dispatchEvent(new CustomEvent('fx:shoot')) });
  cmds.push({ l: 'Basculer le thème clair / sombre', k: 'Thème', run: () => { const b = $('#theme-toggle'); if (b) b.click(); } });

  const ov = document.createElement('div');
  ov.id = 'fx-pal';
  ov.className = 'hidden fixed inset-0 z-[350] items-start justify-center pt-[10vh] sm:pt-[15vh] px-4 bg-slate-950/60 backdrop-blur-md';
  ov.innerHTML = '<div class="w-full max-w-lg rounded-3xl overflow-hidden bg-white/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-700/60 shadow-2xl backdrop-blur-2xl">' +
    '<div class="flex items-center gap-3 px-5 py-4 border-b border-slate-200/60 dark:border-slate-800">' +
    '<span class="font-mono text-cobalt-500">&gt;</span>' +
    '<input id="fx-pal-in" autocomplete="off" placeholder="Rechercher une section, un projet…" class="flex-1 min-w-0 bg-transparent outline-none text-base sm:text-sm font-semibold">' +
    '<kbd class="text-[10px] font-mono px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-800">ESC</kbd></div>' +
    '<ul id="fx-pal-list" class="max-h-[min(65vh,20rem)] overflow-y-auto p-2"></ul></div>';
  document.body.appendChild(ov);
  const inp = $('#fx-pal-in'), list = $('#fx-pal-list');
  const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  let shown = [], sel = 0;

  function render() {
    const q = norm(inp.value.trim());
    shown = cmds.filter((c) => norm(c.l).includes(q));
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    list.innerHTML = shown.length
      ? shown.map((c, i) => '<li><button data-i="' + i + '" class="' + (i === sel ? 'sel' : '') + '"><span>' + c.l +
        '</span><span class="font-mono text-[10px] uppercase tracking-widest opacity-50">' + c.k + '</span></button></li>').join('')
      : '<li class="px-4 py-6 text-center text-sm opacity-60">Aucun résultat</li>';
  }
  function open() { ov.classList.remove('hidden'); ov.classList.add('flex'); inp.value = ''; sel = 0; render(); inp.focus(); }
  function close() { ov.classList.add('hidden'); ov.classList.remove('flex'); }
  function exec(i) { const c = shown[i]; if (!c) return; close(); setTimeout(c.run, 120); }

  $('#fx-pal-btn').addEventListener('click', open);
  ov.addEventListener('click', (e) => { if (e.target === ov) close(); });
  list.addEventListener('click', (e) => { const b = e.target.closest('button[data-i]'); if (b) exec(+b.dataset.i); });
  list.addEventListener('mousemove', (e) => {
    const b = e.target.closest('button[data-i]');
    if (b && +b.dataset.i !== sel) { sel = +b.dataset.i; $$('#fx-pal-list button').forEach((x, i) => x.classList.toggle('sel', i === sel)); }
  });
  inp.addEventListener('input', () => { sel = 0; render(); });
  addEventListener('keydown', (e) => {
    const isOpen = !ov.classList.contains('hidden');
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); isOpen ? close() : open(); return; }
    if (!isOpen) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % Math.max(1, shown.length); render(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + shown.length) % Math.max(1, shown.length); render(); }
    else if (e.key === 'Enter') { e.preventDefault(); exec(sel); }
  });

  /* ---------- Boutons magnétiques ---------- */
  if (fine) {
    $$('#accueil a.inline-flex, #contact button[type="submit"], #theme-toggle').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        el.style.translate = dx * 0.18 + 'px ' + dy * 0.28 + 'px';
      });
      el.addEventListener('pointerleave', () => { el.style.translate = ''; });
    });
  }

  /* ---------- Basket x Dev ---------- */
  // Score + log "git" à chaque panier marqué dans la scène 3D
  const toast = document.createElement('div');
  toast.id = 'fx-toast';
  document.body.appendChild(toast);
  const logs = [
    '$ git commit -m "<b>swish</b> +2"', '$ npm run deploy <b>--score=2</b>', '$ git push origin main  <b>✓</b>',
    '$ test: 3pt_shot <b>PASSED</b>', '$ docker build -t <b>buzzer-beater</b> .'
  ];
  let score = 0, li = 0, tt;
  addEventListener('fx:swish', () => {
    score += 2;
    const sEl2 = document.getElementById('fx-score'); if (sEl2) sEl2.textContent = score;
    toast.innerHTML = logs[li++ % logs.length];
    toast.classList.add('on');
    clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('on'), 2600);
  });
  // Touche B = tir immédiat
  addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.toLowerCase() !== 'b') return;
    if (/INPUT|TEXTAREA/.test((document.activeElement || {}).tagName || '')) return;
    if (!ov.classList.contains('hidden')) return;
    dispatchEvent(new CustomEvent('fx:shoot'));
  });
})();