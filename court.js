/* court.js — icônes de compétences, tableau d'affichage, compteurs, lignes de terrain, curseur ballon */
(function () {
  document.documentElement.classList.add("js");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine =
    matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce;
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

  /* ---------- Curseur ballon ---------- */
  if (fine) {
    const c = document.createElement("div");
    c.className = "fx-ball-cursor ball-dot";
    document.body.appendChild(c);
    document.documentElement.classList.add("court-cursor");
    let mx = innerWidth / 2,
      my = innerHeight / 2,
      x = mx,
      y = my,
      raf = 0;
    const loop = () => {
      x += (mx - x) * 0.25;
      y += (my - y) * 0.25;
      c.style.transform = "translate3d(" + x + "px," + y + "px,0)";
      raf =
        Math.abs(mx - x) > 0.1 || Math.abs(my - y) > 0.1
          ? requestAnimationFrame(loop)
          : 0;
    };
    addEventListener(
      "pointermove",
      (e) => {
        mx = e.clientX;
        my = e.clientY;
        document.body.classList.add("fx-on");
        if (!raf) raf = requestAnimationFrame(loop);
      },
      { passive: true },
    );
    document.addEventListener("mouseleave", () =>
      document.body.classList.remove("fx-on"),
    );
    document.addEventListener("mouseover", (e) => {
      c.classList.toggle(
        "big",
        !!e.target.closest(
          'a,button,input,textarea,[role="button"],.project-card,#fx-hoop',
        ),
      );
    });

    // Au-dessus du terrain, on manipule le ballon 3D : on efface le curseur-ballon
    // et on réaffiche le curseur système pour ne pas voir deux ballons à la fois.
    const court = document.querySelector(".hero-court");
    if (court) {
      court.addEventListener("pointerenter", () =>
        document.documentElement.classList.add("over-court"),
      );
      court.addEventListener("pointerleave", () =>
        document.documentElement.classList.remove("over-court"),
      );
    }
  }
})();
