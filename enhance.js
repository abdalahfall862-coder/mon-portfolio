/* enhance.js — couche "wow" du portfolio. Injecte son propre CSS et ses éléments :
   barre de progression, curseur custom, grain, badge + stats animées, marquee tech, spotlight sur les cartes. */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce;

  /* ---------- CSS ---------- */
  const css = `
  #fx-progress{position:fixed;top:0;left:0;height:3px;width:100%;z-index:300;transform-origin:left;transform:scaleX(0);
    background:linear-gradient(90deg,#3b82f6,#8b5cf6,#ec4899);pointer-events:none}
  #fx-grain{position:fixed;inset:0;z-index:2;pointer-events:none;opacity:.05;mix-blend-mode:overlay;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
  .dark #fx-grain{opacity:.08}
  .fx-in{opacity:0;transform:translateY(16px);animation:fxIn .9s cubic-bezier(.16,1,.3,1) .1s forwards}
  .fx-in.d2{animation-delay:.35s}
  @keyframes fxIn{to{opacity:1;transform:none}}

  .fx-cursor-ring,.fx-cursor-dot{position:fixed;top:0;left:0;pointer-events:none;z-index:400;border-radius:50%;opacity:0;transition:opacity .3s}
  .fx-cursor-ring{width:36px;height:36px;margin:-18px 0 0 -18px;border:1.5px solid #3b82f6;
    transition:width .25s,height .25s,margin .25s,background .25s,opacity .3s}
  .fx-cursor-ring.big{width:64px;height:64px;margin:-32px 0 0 -32px;background:rgba(59,130,246,.12)}
  .fx-cursor-dot{width:6px;height:6px;margin:-3px 0 0 -3px;background:#6366f1}
  .fx-on .fx-cursor-ring,.fx-on .fx-cursor-dot{opacity:1}
  html.fx-cursor, html.fx-cursor *{cursor:none !important}

  .fx-spot{position:relative}
  .fx-spot::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .35s;
    background:radial-gradient(420px circle at var(--mx,50%) var(--my,50%),rgba(99,102,241,.20),transparent 45%)}
  .fx-spot:hover::after{opacity:1}

  .fx-marquee{overflow:hidden;border-block:1px solid rgba(148,163,184,.25);padding:1.1rem 0;
    -webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);
    mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)}
  .fx-track{display:flex;width:max-content;gap:3rem;animation:fxMq 38s linear infinite}
  .fx-marquee:hover .fx-track{animation-play-state:paused}
  .fx-track span{font-weight:900;font-size:1.05rem;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;
    color:rgba(100,116,139,.8);display:flex;align-items:center;gap:3rem}
  .fx-track span::after{content:"✦";color:#6366f1;font-size:.8rem}
  .dark .fx-track span{color:rgba(148,163,184,.7)}
  @keyframes fxMq{to{transform:translateX(-50%)}}
  @media (prefers-reduced-motion:reduce){.fx-track{animation:none}.fx-in{animation:none;opacity:1;transform:none}}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- Progression de scroll ---------- */
  const bar = document.createElement('div');
  bar.id = 'fx-progress';
  document.body.appendChild(bar);
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0) + ')';
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Grain ---------- */
  const grain = document.createElement('div');
  grain.id = 'fx-grain';
  document.body.appendChild(grain);

  /* ---------- Hero : badge + stats ---------- */
  const heroBox = document.querySelector('#accueil > div');
  if (heroBox) {
    const badge = document.createElement('div');
    badge.className = 'fx-in inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 text-[11px] font-bold uppercase tracking-widest';
    badge.innerHTML = '<span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>Disponible pour de nouveaux projets';
    heroBox.prepend(badge);

    const ctas = heroBox.querySelector('.reveal.flex');
    if (ctas) {
      const stats = document.createElement('div');
      stats.className = 'fx-in d2 mt-12 flex flex-wrap gap-8 sm:gap-12';
      const items = [[4, '', 'Projets en ligne'], [2, '+', 'Ans de pratique'], [2, '', 'Plateformes cloud']];
      stats.innerHTML = items.map(([n, suf, label]) =>
        '<div><div class="text-3xl sm:text-4xl font-black bg-gradient-to-r from-cobalt-600 to-indigo-500 bg-clip-text text-transparent"><span data-count="' + n + '">0</span>' + suf + '</div>' +
        '<div class="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">' + label + '</div></div>'
      ).join('');
      ctas.after(stats);

      const run = (el) => {
        const to = +el.dataset.count;
        if (reduce) { el.textContent = to; return; }
        const t0 = performance.now(), dur = 1400;
        (function step(now) {
          const p = Math.min(1, (now - t0) / dur);
          el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        })(t0);
      };
      const io = new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
      }), { threshold: 0.6 });
      stats.querySelectorAll('[data-count]').forEach((el) => io.observe(el));
    }
  }

  /* ---------- Marquee technologies ---------- */
  const comp = document.getElementById('competences');
  if (comp) {
    const techs = ['TypeScript', 'Node.js', 'React', 'Next.js', 'Tailwind CSS', 'MongoDB', 'TypeORM', 'Firebase', 'Socket.IO', 'JWT', 'Swagger', 'Stripe'];
    const html = techs.map((t) => '<span>' + t + '</span>').join('');
    const mq = document.createElement('div');
    mq.className = 'fx-marquee';
    mq.setAttribute('aria-hidden', 'true');
    mq.innerHTML = '<div class="fx-track">' + html + html + '</div>';
    comp.before(mq);
  }

  /* ---------- Spotlight sur les cartes ---------- */
  document.querySelectorAll('.project-card, #competences .grid > .reveal, #methode .grid > .reveal').forEach((card) => {
    card.classList.add('fx-spot');
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', e.clientX - r.left + 'px');
      card.style.setProperty('--my', e.clientY - r.top + 'px');
    }, { passive: true });
  });

  /* ---------- Curseur personnalisé ---------- */
  if (fine) {
    const ring = document.createElement('div');
    const dot = document.createElement('div');
    ring.className = 'fx-cursor-ring';
    dot.className = 'fx-cursor-dot';
    document.body.append(ring, dot);
    document.documentElement.classList.add('fx-cursor');

    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      document.body.classList.add('fx-on');
    }, { passive: true });
    document.addEventListener('mouseleave', () => document.body.classList.remove('fx-on'));
    document.addEventListener('mouseover', (e) => {
      ring.classList.toggle('big', !!e.target.closest('a,button,input,textarea,[role="button"],.project-card'));
    });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
      requestAnimationFrame(loop);
    })();
  }
})();