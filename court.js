/* court.js — icônes de compétences, tableau d'affichage, compteurs, lignes de terrain */
(function () {
  document.documentElement.classList.add("js");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];

  /* ---------- Icônes des technologies : un sprite local au lieu de 33 appels CDN ---------- */
  const ICON_KEYS = new Set([
    "html5", "css3", "js", "ts", "tailwind", "react", "next", "node",
    "express", "fastify", "nest", "typeorm", "jwt", "bcrypt", "socket",
    "mongodb", "firebase", "swagger", "git", "github", "stripe", "vercel",
    "render", "vite", "expo", "figma", "postgresql", "redis", "jest",
    "graphql", "docker", "githubactions", "linux",
  ]);

  $$("[data-ico]").forEach((el) => {
    const key = el.dataset.ico;
    if (!ICON_KEYS.has(key)) return;
    const wrap = document.createElement("span");
    wrap.className = "ico";
    wrap.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="assets/icons.svg#ico-' + key + '"/></svg>';
    el.prepend(wrap);
  });

  /* ---------- Maillots : retourner la carte ---------- */
  $$(".jflip").forEach((b) =>
    b.addEventListener("click", () => {
      const j = b.closest(".jersey");
      const on = j.classList.toggle("flipped");
      const f = $(".jfront", j),
        k = $(".jback", j);
      if (f) f.setAttribute("aria-hidden", on ? "true" : "false");
      if (k) k.setAttribute("aria-hidden", on ? "false" : "true");
    }),
  );
  $$(".jback").forEach((k) => k.setAttribute("aria-hidden", "true"));

  /* ---------- Tracé des lignes de terrain ---------- */
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("drawn");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.2 },
  );
  $$(".court-svg.draw").forEach((s) => io.observe(s));

  /* ---------- Compteurs ---------- */
  const run = (el) => {
    const to = +el.dataset.count;
    if (reduce) {
      el.textContent = to;
      return;
    }
    const t0 = performance.now(),
      dur = 1400;
    (function step(now) {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  };
  const io2 = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          run(e.target);
          io2.unobserve(e.target);
        }
      }),
    { threshold: 0.6 },
  );
  $$("[data-count]").forEach((el) => io2.observe(el));

  /* ---------- Tableau d'affichage : horloge + score ---------- */
  const home = $("#sb-home"),
    clk = $("#sb-clock"),
    qEl = $("#sb-q");
  if (home && clk && qEl) {
    let secs = 12 * 60,
      q = 1,
      pts = 0;
    const pad = (n) => String(n).padStart(2, "0");
    const paint = () => {
      clk.textContent = pad(Math.floor(secs / 60)) + ":" + pad(secs % 60);
      qEl.textContent = "Q" + q;
    };
    paint();
    setInterval(() => {
      if (document.hidden) return; // rien à animer dans un onglet masqué
      secs--;
      if (secs < 0) {
        secs = 12 * 60;
        q = (q % 4) + 1;
      }
      paint();
    }, 1000);
    addEventListener("fx:swish", () => {
      pts += 2;
      home.textContent = pad(pts);
    });
  }

})();
