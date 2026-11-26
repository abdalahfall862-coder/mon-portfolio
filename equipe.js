/* equipe.js — onglets d'équipes + animation de présentation des joueurs.
   Adapté au portfolio actuel : les panneaux sont masqués dès le HTML (anti-FOUC),
   les icônes sont injectées par court.js et le thème sombre est géré par equipe.css. */
(function () {
  const root = document.getElementById('competences');
  if (!root) return;
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));
  if (!tabs.length || panels.some((p) => !p)) return;
  document.documentElement.classList.add('js-team');
  let current = 0;

  function replay(p) { p.classList.remove('is-active'); void p.offsetWidth; p.classList.add('is-active'); }

  function show(i, focus) {
    current = i;
    tabs.forEach((t, k) => {
      const on = k === i;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      panels[k].hidden = !on;
      panels[k].classList.toggle('is-active', on);
    });
    if (focus) tabs[i].focus();
  }

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => show(i));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); show((i + 1) % tabs.length, true); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); show((i - 1 + tabs.length) % tabs.length, true); }
      else if (e.key === 'Home') { e.preventDefault(); show(0, true); }
      else if (e.key === 'End') { e.preventDefault(); show(tabs.length - 1, true); }
    });
  });
  show(0);

  // La présentation se joue quand la section arrive à l'écran
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { replay(panels[current]); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(root);
  }
})();
