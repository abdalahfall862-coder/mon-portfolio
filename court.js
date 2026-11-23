/* court.js — icônes de compétences, tableau d'affichage, compteurs, lignes de terrain, curseur ballon */
(function () {
  document.documentElement.classList.add("js");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine =
    matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];

  /* ---------- Icônes des technologies (Simple Icons, avec repli) ---------- */
  const LOCK =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" fill="#b45309"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="#b45309" stroke-width="2"/></svg>';
  const ICONS = {
    html5: { s: "html5", c: "E34F26" },
    css3: { s: ["css3", "css"], c: "1572B6" },
    js: { s: "javascript", c: "F7DF1E" },
    ts: { s: "typescript", c: "3178C6" },
    tailwind: { s: "tailwindcss", c: "06B6D4" },
    react: { s: "react", c: "61DAFB" },
    next: { s: "nextdotjs", c: "8A8A8A" },
    node: { s: "nodedotjs", c: "5FA04E" },
    express: { s: "express", c: "8A8A8A" },
    fastify: { s: "fastify", c: "8A8A8A" },
    nest: { s: "nestjs", c: "E0234E" },
    typeorm: { s: "typeorm", c: "E83524" },
    jwt: { s: "jsonwebtokens", c: "D63AFF" },
    bcrypt: { svg: LOCK, c: "B45309" },
    socket: { s: "socketdotio", c: "8A8A8A" },
    mongodb: { s: "mongodb", c: "47A248" },
    firebase: { s: "firebase", c: "FFCA28" },
    swagger: { s: "swagger", c: "85EA2D" },
    git: { s: "git", c: "F05032" },
    github: { s: "github", c: "8A8A8A" },
    stripe: { s: "stripe", c: "635BFF" },
    vercel: { s: "vercel", c: "8A8A8A" },
    render: { s: "render", c: "46E3B7" },
  };

  $$("[data-ico]").forEach((el) => {
    const cfg = ICONS[el.dataset.ico];
    if (!cfg) return;
    const label = el.textContent.trim();
    const wrap = document.createElement("span");
    wrap.className = "ico";
    const fallback = () => {
      wrap.innerHTML = "";
      const fb = document.createElement("span");
      fb.className = "ico-fb";
      fb.style.background = "#" + cfg.c;
      fb.textContent = label.slice(0, 2).toUpperCase();
      wrap.appendChild(fb);
    };
    if (cfg.svg) wrap.innerHTML = cfg.svg;
    else {
      const slugs = [].concat(cfg.s);
      let i = 0;
      const img = new Image();
      img.alt = "";
      img.width = 30;
      img.height = 30;
      img.loading = "lazy";
      img.decoding = "async";
      img.onerror = () => {
        i++;
        if (i < slugs.length)
          img.src = "https://cdn.simpleicons.org/" + slugs[i] + "/" + cfg.c;
        else fallback();
      };
      img.src = "https://cdn.simpleicons.org/" + slugs[0] + "/" + cfg.c;
      wrap.appendChild(img);
    }
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
          'a,button,input,textarea,[role="button"],.project-card',
        ),
      );
    });
  }
})();
