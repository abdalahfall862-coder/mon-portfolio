/* three-scene.js v9 — ballon de basket officiel NBA Wilson.
   Texture générée en JS : cuir pleine grain, 8 panneaux, NBA Pro Seams à double profondeur
   (3 grands cercles perpendiculaires, coutures ~6,2 mm / max FIBA 6,35 mm), logoman NBA,
   script Wilson avec inline anthracite. Rendu PBR (MeshStandardMaterial + bump map),
   ombre douce, caméra orthographique en pixels : le ballon dribble sur tout .hero-court.
   Échelle FIBA du hero ×1,53 pour la lisibilité : 500 unités = 15 m, anneau ⌀0,69 m, ballon ⌀0,44 m.
   Un clic sur le terrain l'envoie au point choisi, où il rebondit puis reste dribbler
   à cette hauteur, sans descendre au bas du terrain. Un clic sur #fx-hoop déclenche un
   tir balistique : s'il marque, le ballon ressort du filet puis glisse jusqu'en bas du
   terrain avant de reprendre son dribble, sans jamais disparaître. Événements
   'fx:bounce' et 'fx:swish'. */
(function () {
  if (typeof THREE === "undefined") return;
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
  } catch (e) {
    canvas.remove();
    return;
  }
  renderer.outputEncoding = THREE.sRGBEncoding;

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const anchor = document.getElementById("fx-ball-anchor");
  const courtEl = document.querySelector(".hero-court");
  const hoopEl = document.getElementById("fx-hoop");
  if (!anchor) {
    canvas.remove();
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(0, 1, 0, -1, -2000, 2000);

  /* ---------- Éclairage (salle : clé chaude, rebond parquet, contre-jour) ---------- */
  scene.add(new THREE.HemisphereLight(0xfff0dc, 0x7a4220, 0.95));
  const key = new THREE.DirectionalLight(0xfff3e2, 1.55);
  key.position.set(-0.55, 0.85, 1);
  const rimL = new THREE.DirectionalLight(0xffb070, 0.55);
  rimL.position.set(0.9, 0.1, -0.5);
  scene.add(key, rimL);

  /* ---------- Texture du ballon ---------- */
  function buildTextures() {
    const TW = 1024,
      TH = 512;
    const c1 = document.createElement("canvas"),
      c2 = document.createElement("canvas");
    c1.width = c2.width = TW;
    c1.height = c2.height = TH;
    const x1 = c1.getContext("2d"),
      x2 = c2.getContext("2d");
    const i1 = x1.createImageData(TW, TH),
      i2 = x2.createImageData(TW, TH);
    const d1 = i1.data,
      d2 = i2.data;

    const cp = new Float32Array(TW),
      sp = new Float32Array(TW);
    for (let x = 0; x < TW; x++) {
      const ph = ((x + 0.5) / TW) * Math.PI * 2;
      cp[x] = Math.cos(ph);
      sp[x] = Math.sin(ph);
    }
    /* Canaux conformes à la norme : 3 grands cercles mutuellement perpendiculaires
       (1 équateur + 2 méridiens à 90°) -> 8 panneaux, configuration classique FIBA/NBA.
       Les méridiens sont tournés de 45° pour que le marquage tombe au centre d'un panneau.
       Demi-largeur 0,026 rad ~ 6,2 mm de couture sur une taille 7 (max FIBA : 6,35 mm). */
    const q = Math.SQRT1_2;
    const w = 0.026,
      F = 46;
    const sm = (a, b, v) => {
      const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };

    for (let y = 0; y < TH; y++) {
      const th = ((y + 0.5) / TH) * Math.PI,
        st = Math.sin(th),
        ny = Math.cos(th);
      for (let x = 0; x < TW; x++) {
        const nx = -cp[x] * st,
          nz = sp[x] * st;
        // 3 canaux : équateur + 2 méridiens perpendiculaires (8 panneaux)
        const dEq = Math.abs(ny);
        const dMer = Math.min(Math.abs((nx - nz) * q), Math.abs((nx + nz) * q));
        const d = Math.min(dEq, dMer);
        const dep = dMer < dEq ? 0.95 : 0.78; // NBA Pro Seams : double profondeur
        const g = 1 - sm(w * 0.6, w, d); // fond du canal
        const e = sm(w, w * 2.6, d); // 0 près du canal -> 1 loin
        const pb =
          Math.sin(nx * F + 1.3) *
          Math.sin(ny * F + 0.7) *
          Math.sin(nz * F + 2.1);
        const pb2 =
          Math.sin((nx + ny) * F * 1.6 + 0.4) *
          Math.sin((nz - ny) * F * 1.6 + 1.1);
        const p = Math.max(0, Math.min(1, 0.5 + 0.38 * pb + 0.2 * pb2));
        const tint = 0.965 + 0.035 * Math.sin(nx * 3.1 + nz * 2.3 + ny);
        const shade = (0.5 + 0.5 * e) * (0.9 + 0.13 * p) * tint;
        let r = 0.8 * shade,
          gg = 0.375 * shade,
          b = 0.125 * shade;
        r += (0.03 - r) * g;
        gg += (0.02 - gg) * g;
        b += (0.015 - b) * g;
        const o = (y * TW + x) * 4;
        d1[o] = Math.min(255, r * 255);
        d1[o + 1] = Math.min(255, gg * 255);
        d1[o + 2] = Math.min(255, b * 255);
        d1[o + 3] = 255;

        let h = (0.6 + 0.26 * (p - 0.5)) * (0.4 + 0.6 * e);
        h = h * (1 - g * dep);
        const ridge = Math.exp(-Math.pow((d - w * 1.4) / (w * 0.65), 2)) * 0.2;
        h += ridge * (1 - g);
        const hv = Math.max(0, Math.min(255, h * 255));
        d2[o] = d2[o + 1] = d2[o + 2] = hv;
        d2[o + 3] = 255;
      }
    }
    x1.putImageData(i1, 0, 0);
    x2.putImageData(i2, 0, 0);

    /* Marquage du ballon officiel NBA Wilson : logoman NBA et script Wilson
       estampés dans le cuir grainé, avec l'inline anthracite du logo Wilson. */
    x1.textAlign = "center";
    x1.textBaseline = "middle";

    /* --- Logoman NBA : joueur en mouvement dans un cercle --- */
    (function logoman(cx, cy, R) {
      const ink = "rgba(26,12,5,.9)";
      x1.save();
      x1.translate(cx, cy);
      x1.beginPath();
      x1.arc(0, 0, R, 0, Math.PI * 2);
      x1.fillStyle = "rgba(120,52,14,.5)";
      x1.fill();
      x1.lineWidth = 7;
      x1.strokeStyle = ink;
      x1.stroke();
      x1.fillStyle = ink;
      x1.strokeStyle = ink;
      x1.lineCap = "round";
      x1.beginPath();
      x1.arc(-R * 0.04, -R * 0.36, R * 0.15, 0, Math.PI * 2);
      x1.fill();
      x1.save();
      x1.rotate(-0.22);
      x1.fillRect(-R * 0.14, -R * 0.2, R * 0.28, R * 0.5);
      x1.restore();
      x1.lineWidth = R * 0.11;
      x1.beginPath();
      x1.moveTo(R * 0.08, -R * 0.06);
      x1.lineTo(R * 0.42, -R * 0.26);
      x1.stroke();
      x1.beginPath();
      x1.moveTo(-R * 0.06, R * 0.26);
      x1.lineTo(-R * 0.26, R * 0.56);
      x1.stroke();
      x1.beginPath();
      x1.moveTo(R * 0.06, R * 0.26);
      x1.lineTo(R * 0.28, R * 0.54);
      x1.stroke();
      x1.beginPath();
      x1.arc(R * 0.5, -R * 0.32, R * 0.16, 0, Math.PI * 2);
      x1.fill();
      x1.restore();
      x1.font = '900 22px "Arial Black", Impact, sans-serif';
      x1.fillStyle = ink;
      x1.fillText("NBA", cx, cy + R + 16);
    })(TW * 0.25, TH * 0.31, 58);

    /* --- Script Wilson + inline anthracite --- */
    (function wilson(cx, cy) {
      x1.save();
      x1.translate(cx, cy);
      x1.font = 'italic 900 66px Georgia, "Times New Roman", serif';
      x1.lineJoin = "round";
      x1.lineWidth = 9;
      x1.strokeStyle = "rgba(38,38,42,.92)"; // anthracite inline
      x1.strokeText("Wilson", 0, 0);
      x1.fillStyle = "rgba(58,22,6,.94)";
      x1.fillText("Wilson", 0, 0);
      x1.font = '700 16px "Arial Black", sans-serif';
      x1.fillStyle = "rgba(38,38,42,.8)";
      x1.fillText("OFFICIAL GAME BALL", 0, 50);
      x1.restore();
    })(TW * 0.75, TH * 0.69);
    return { color: c1, bump: c2 };
  }

  const ballMat = new THREE.MeshStandardMaterial({
    color: 0xd2631f,
    roughness: 0.6,
    metalness: 0,
  });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), ballMat);
  ball.position.z = 5;

  // La texture est générée juste après le premier affichage (ne bloque pas le chargement)
  setTimeout(() => {
    try {
      const t = buildTextures();
      const map = new THREE.CanvasTexture(t.color);
      map.encoding = THREE.sRGBEncoding;
      const bump = new THREE.CanvasTexture(t.bump);
      const an = renderer.capabilities.getMaxAnisotropy
        ? Math.min(8, renderer.capabilities.getMaxAnisotropy())
        : 1;
      map.anisotropy = bump.anisotropy = an;
      ballMat.color.setHex(0xffffff);
      ballMat.map = map;
      ballMat.bumpMap = bump;
      ballMat.bumpScale = 3.2;
      ballMat.roughness = 0.58;
      ballMat.needsUpdate = true;
    } catch (e) {
      /* on garde la couleur unie */
    }
  }, 60);

  /* ---------- Ombre douce ---------- */
  const sc = document.createElement("canvas");
  sc.width = sc.height = 128;
  const sctx = sc.getContext("2d");
  const grad = sctx.createRadialGradient(64, 64, 4, 64, 64, 62);
  grad.addColorStop(0, "rgba(25,10,2,.75)");
  grad.addColorStop(0.55, "rgba(25,10,2,.35)");
  grad.addColorStop(1, "rgba(25,10,2,0)");
  sctx.fillStyle = grad;
  sctx.fillRect(0, 0, 128, 128);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(sc),
    transparent: true,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shadowMat);
  scene.add(shadow, ball);

  /* ---------- Halo doux et étincelles du panier ---------- */
  function softDot() {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const x = c.getContext("2d");
    const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.28, "rgba(255,240,220,.85)");
    g.addColorStop(0.65, "rgba(255,190,120,.28)");
    g.addColorStop(1, "rgba(255,170,90,0)");
    x.fillStyle = g;
    x.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }
  const dotTex = softDot();

  /* Halo doux qui accompagne le ballon (s'intensifie pendant le tir) */
  const glowMat = new THREE.SpriteMaterial({
    map: dotTex,
    color: 0xff8a36,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true,
    opacity: 0.2,
  });
  const glow = new THREE.Sprite(glowMat);
  glow.position.z = 4.7;
  scene.add(glow);

  /* ---------- Mesures mises en cache ---------- */
  let W = 1,
    H = 1;
  let A = { l: 0, t: 0, w: 0, h: 0 },
    Hm = { x: 0, y: 0, w: 0 };
  function measure() {
    const sy = window.scrollY;
    // Toute la surface du demi-terrain est jouable : le ballon peut aller dans les
    // coins, pas seulement dans la petite zone centrale de l'ancien ancrage.
    const zone = (courtEl || anchor).getBoundingClientRect();
    A = { l: zone.left, t: zone.top + sy, w: zone.width, h: zone.height };
    // L'anneau est au centre du SVG du panier (le reste est la planche et le bras).
    if (hoopEl) {
      const r = hoopEl.getBoundingClientRect();
      Hm = {
        x: r.left + r.width / 2,
        y: r.top + sy + r.height * 0.5,
        w: r.width,
      };
    }
  }
  function resize() {
    W = innerWidth;
    H = innerHeight;
    renderer.setPixelRatio(
      Math.min(devicePixelRatio, innerWidth < 640 ? 1.5 : 2),
    );
    renderer.setSize(W, H, false);
    camera.left = 0;
    camera.right = W;
    camera.top = 0;
    camera.bottom = -H;
    camera.updateProjectionMatrix();
    measure();
  }
  resize();
  addEventListener("resize", resize);
  addEventListener("load", measure);
  if (window.ResizeObserver) new ResizeObserver(measure).observe(document.body);

  /* ---------- Machine à états : dribble ↔ plain | bounce → (drop → slide | miss) ---------- */
  let st = "dribble",
    st0 = 0,
    lastT = 0;
  // Position du dribble après interaction, en relatif au terrain (résiste au scroll/resize).
  // null = ballon itinérant avant le premier clic. homeRY = 1 correspond au bas du terrain.
  let homeRX = null,
    homeRY = 1;
  let scoreR = 30; // rayon du ballon au moment du panier
  let velX = 0,
    velY = 0; // vitesses instantanées (squash / rebond sur le cercle)
  let shX0 = 0,
    shY0 = 0,
    shVY = 0,
    shTargetX = 0,
    shT = 0.9,
    shElapsed = 0,
    shCurve = 0;
  let plainN = 0; // nombre de rebonds libres déjà effectués
  let plX0 = 0,
    plY0 = 0,
    plTX = 0,
    plTY = 0,
    plT = 0.5,
    plTm = 0,
    plVY = 0;
  let plPhase = 0; // 0 = saut vers le point, 1 = rebonds, 2 = tassement final
  let slX0 = 0,
    slY0 = 0,
    slTX = 0,
    slTY = 0; // glissement après un panier
  let curR = 30; // rayon courant, mis à jour à chaque frame
  let imp = 0; // intensité de l'impact
  const G = 1900; // gravité en px/s²
  const bp = { x: 0, y: 0, r: 30 };
  /* Rebond libre : un clic envoie le ballon sur le point choisi du terrain. Il y rebondit
     avec amortissement, puis continue de dribbler exactement à cet endroit. Pas de score. */
  function startPlainBounce(clientX, clientY) {
    if (!ball.visible || st === "drop" || st === "miss" || st === "slide") return;
    const R = curR;
    const top = A.t - window.scrollY;
    plTX = Math.max(A.l + R, Math.min(A.l + A.w - R, clientX));
    plTY = Math.max(top + R, Math.min(top + A.h - R, clientY));
    const zone = {
      left: A.l,
      top,
      width: A.w,
      height: A.h,
      bottom: top + A.h,
    };
    homeRX = xToRatio(plTX, zone, R); // le ballon garde le point choisi, pas seulement en X
    homeRY = yToRatio(plTY, zone, R);
    plX0 = bp.x;
    plY0 = bp.y;
    const dist = Math.hypot(plTX - plX0, plTY - plY0);
    plT = Math.max(0.32, Math.min(0.85, 0.3 + dist / 900));
    plVY = (plTY - plY0 - 0.5 * G * plT * plT) / plT;
    plTm = 0;
    plPhase = 0;
    plainN = 0;
    velX = 0;
    imp = 1;
    st = "plain";
    st0 = lastT;
  }

  /* Tir directionnel : un clic sur le panier envoie le ballon vers le cercle avec une
     trajectoire balistique. Le panier n'est validé que s'il redescend dans le cercle. */
  function startShot(clientX, perfect) {
    if (!ball.visible || st === "drop" || st === "miss" || st === "slide") return;
    if (!hoopEl) return;
    const hr = hoopEl.getBoundingClientRect();
    if (hr.width <= 0) return;
    const hx = hr.left + hr.width / 2;
    const hy = hr.top + hr.height * 0.5;
    const aimLimit = hr.width * 0.08; // tolérance proportionnelle au vrai anneau
    const aim = perfect
      ? 0
      : Math.max(-aimLimit, Math.min(aimLimit, (clientX - bp.x) * 0.16));
    shX0 = bp.x;
    shY0 = bp.y;
    shTargetX = hx + aim;
    // Durée de vol assez longue pour que le sommet soit au-dessus du cercle :
    // le ballon arrive donc en descendance, comme un vrai tir au panier.
    shT = Math.max(0.82, Math.min(1.18, Math.abs(shTargetX - shX0) / 520));
    shVY = (hy - shY0 - 0.5 * G * shT * shT) / shT;
    // Léger renflement latéral à l'apex : la trajectoire ne part pas comme un ascenseur.
    shCurve =
      (shTargetX >= shX0 ? 1 : -1) *
      Math.min(hr.width * 0.25, 10 + Math.abs(shTargetX - shX0) * 0.12);
    shElapsed = 0;
    imp = 1;
    st = "bounce";
    st0 = lastT;
  }

  // Raccourci clavier / palette : tir visé centre, équivalent d'un clic sur le panier.
  addEventListener("fx:bounce", (e) => {
    const d = e.detail || {};
    const hr = hoopEl && hoopEl.getBoundingClientRect();
    startShot(
      typeof d.clientX === "number"
        ? d.clientX
        : hr
          ? hr.left + hr.width / 2
          : bp.x,
      !!d.perfect,
    );
  });

  // Clic sur le panier = tir ; clic ailleurs sur le terrain = simple rebond (sans score).
  addEventListener(
    "pointerdown",
    (e) => {
      if (e.button !== 0) return;
      const el = e.target;
      if (
        el &&
        el.closest &&
        el.closest(
          'a,button,input,textarea,select,label,[role="button"],.project-card,#project-modal,#sidebar,#top-actions,#fx-hud,#fx-pal',
        )
      )
        return;
      if (el && el.closest && el.closest("#fx-hoop"))
        startShot(e.clientX, true);
      else startPlainBounce(e.clientX, e.clientY);
    },
    { passive: true },
  );

  const ease = (u) => u * u * (3 - 2 * u);
  /* Avant le premier clic, le dribble parcourt lentement tout le terrain. Après une
     interaction, il reste à l'endroit choisi par l'utilisateur. */
  function roamX(t, a, radius) {
    const margin = Math.min(
      a.width * 0.45,
      Math.max(radius * 1.4, a.width * 0.06),
    );
    const span = Math.max(0, a.width - margin * 2);
    return a.left + margin + (0.5 + 0.5 * Math.sin(t * 0.42)) * span;
  }
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  function xRange(a, radius) {
    const margin = Math.min(
      a.width * 0.45,
      Math.max(radius * 1.4, a.width * 0.04),
    );
    return { start: a.left + margin, span: Math.max(1, a.width - margin * 2) };
  }
  function yRange(a, radius) {
    const start = a.top + radius;
    const end = a.bottom - 6 - radius;
    return { start, span: Math.max(1, end - start) };
  }
  function xToRatio(x, a, radius) {
    const r = xRange(a, radius);
    return clamp01((x - r.start) / r.span);
  }
  function yToRatio(y, a, radius) {
    const r = yRange(a, radius);
    return clamp01((y - r.start) / r.span);
  }
  function ratioToX(a, radius) {
    const r = xRange(a, radius);
    return r.start + homeRX * r.span;
  }
  function ratioToY(a, radius) {
    const r = yRange(a, radius);
    return r.start + homeRY * r.span;
  }
  function dribbleX(t, a, radius) {
    return homeRX === null ? roamX(t, a, radius) : ratioToX(a, radius);
  }

  function frame(t, dt) {
    const sY = window.scrollY;
    const a = {
      left: A.l,
      top: A.t - sY,
      width: A.w,
      height: A.h,
      bottom: A.t + A.h - sY,
    };
    const onScreen = a.width > 0 && a.bottom > -60 && a.top < H + 60;
    ball.visible = shadow.visible = glow.visible = onScreen;
    if (!onScreen) return;

    // Ballon volontairement agrandi pour la lisibilité : ⌀0,44 m pour un anneau ⌀0,69 m.
    const R = Math.max(7, Math.min(34, (Hm.w || a.width * 0.5) * 0.08));
    curR = R;
    // Niveau où le ballon repose : point cliqué, ou juste sous le panier après un score.
    // Plus besoin de descendre jusqu'en bas du terrain à chaque fois.
    const groundY = ratioToY(a, R);
    const drib = Math.max(
      0,
      Math.min(a.height * 0.45, R * 6, groundY - a.top - R),
    );
    const el = t - st0;
    let k = 1,
      squash = 1,
      shOp = 1;

    if (st === "dribble") {
      const u = (el % 0.8) / 0.8,
        h = 4 * u * (1 - u);
      bp.x = dribbleX(t, a, R); // reste sur le point choisi, ou itinérant avant le premier clic
      bp.y = groundY - h * drib;
      bp.r = R;
      squash = h < 0.06 ? 0.86 + 0.14 * (h / 0.06) : 1;
      shOp = 1 - h * 0.6;
      ball.rotation.y += dt * 1.6;
      ball.rotation.x = 0.35;
      ball.rotation.z += dt * 0.3;
    } else if (st === "drop") {
      // Trois temps : le cercle avale le ballon, le filet le retient, puis il ressort.
      const u = Math.min(1, el / 0.72);
      let depth, sq;
      if (u < 0.3) {
        const v = u / 0.3;
        depth = 0.05 * ease(v);
        sq = 1 - 0.12 * Math.sin(v * Math.PI); // compression dans le cercle
      } else if (u < 0.62) {
        const v = (u - 0.3) / 0.32;
        depth = 0.05 + 0.07 * ease(v);
        sq = 1 + 0.09 * Math.sin(v * Math.PI); // étirement quand le filet le capture
      } else {
        const v = (u - 0.62) / 0.38;
        depth = 0.12 + 0.12 * v * v; // ~0,42 m de filet
        sq = 1;
      }
      bp.x = Hm.x + Math.sin(u * Math.PI * 2) * 2 * (1 - u);
      bp.y = Hm.y - sY + Hm.w * depth;
      bp.r =
        scoreR *
        (1 - 0.08 * Math.min(1, u * 2) - 0.18 * Math.max(0, (u - 0.62) / 0.38));
      squash = sq;
      // Le ballon ne disparaît pas : le filet le ralentit, puis il ressort et retombe.
      k = 1;
      shOp = 0;
      ball.rotation.z += dt * (u < 0.62 ? 3 : 1.4); // le filet freine la rotation
      if (u >= 1) {
        slX0 = bp.x;
        slY0 = bp.y;
        slTX = bp.x; // descente verticale sous le cercle
        slTY = a.bottom - 6 - R; // jusqu'au bas du terrain
        homeRX = xToRatio(slTX, a, R);
        homeRY = 1; // le dribble reprendra en bas, après le glissement
        bp.r = R;
        velX = 0;
        velY = 0;
        imp = 0;
        st = "slide";
        st0 = t;
      }
    } else if (st === "slide") {
      // Après un panier : descente douce et continue jusqu'au bas du terrain.
      const u = Math.min(1, el / 0.85);
      const e = ease(u);
      bp.x = slX0 + (slTX - slX0) * e;
      bp.y = slY0 + (slTY - slY0) * e;
      bp.r = R;
      squash = 1 - 0.06 * Math.sin(u * Math.PI);
      shOp = 0.15 + 0.85 * u;
      ball.rotation.x += dt * 2.4; // effet de roulement pendant la descente
      ball.rotation.z += dt * 0.8;
      if (u >= 1) {
        bp.y = slTY;
        st = "dribble";
        st0 = t;
      }
    } else if (st === "plain") {
      const driftX = dribbleX(t, a, R);
      if (plPhase === 0) {
        // Saut balistique vers le point exact cliqué.
        plTm += dt;
        const u = Math.min(1, plTm / plT);
        velX = (plTX - plX0) / plT;
        velY = plVY + G * plTm;
        bp.x = plX0 + (plTX - plX0) * u;
        bp.y = plY0 + plVY * plTm + 0.5 * G * plTm * plTm;
        if (u >= 1 || bp.y >= groundY) {
          bp.x = plTX;
          bp.y = Math.min(bp.y, groundY);
          velX = 0;
          velY = -Math.max(240, Math.abs(velY) * 0.6); // premier bond sur le point visé
          plPhase = 1;
          plTm = 0;
          plainN = 0;
          imp = 1;
        }
      } else if (plPhase === 1) {
        // Rebonds amortis à l'endroit cliqué.
        velY += G * dt;
        velX += (driftX - bp.x) * dt * 2.5;
        bp.x += velX * dt;
        bp.y += velY * dt;
        if (bp.y >= groundY) {
          bp.y = groundY;
          if (Math.abs(velY) > 150 && plainN < 3) {
            velY = -Math.abs(velY) * 0.56;
            plainN++;
            imp = 1;
          } else {
            velY = 0;
            velX = 0;
            homeRX = xToRatio(bp.x, a, R);
            homeRY = yToRatio(bp.y, a, R);
            plPhase = 2;
            plTm = 0;
          }
        }
      } else {
        // Dernier tassement sur place, puis reprise du dribble au même endroit.
        plTm += dt;
        const u = Math.min(1, plTm / 0.28);
        bp.x = driftX;
        bp.y = groundY - Math.sin(u * Math.PI) * R * 0.35;
        velY = 0;
        velX = 0;
        if (u >= 1) {
          st = "dribble";
          st0 = t;
        }
      }
      bp.r = R;
      const above = Math.max(0, groundY - bp.y);
      imp = Math.max(0, imp - dt * 4.5);
      squash = 1 - 0.22 * imp + Math.min(0.1, Math.abs(velY) / 6000);
      shOp = Math.max(0.12, 1 - above / 260);
      ball.rotation.y += dt * (1.6 + Math.abs(velY) / 600);
      ball.rotation.z += dt * 0.6;
    } else if (st === "bounce" || st === "miss") {
      const hx = Hm.x,
        hy = Hm.y - sY;
      const prevY = bp.y;
      if (st === "bounce") {
        // Trajectoire analytique : parabole verticale + renflement latéral à l'apex.
        shElapsed += dt;
        const u = Math.min(1, shElapsed / shT);
        velY = shVY + G * shElapsed;
        velX =
          (shTargetX - shX0) / shT +
          (Math.cos(u * Math.PI) * shCurve * Math.PI) / shT;
        bp.x = shX0 + (shTargetX - shX0) * u + Math.sin(u * Math.PI) * shCurve;
        bp.y = shY0 + shVY * shElapsed + 0.5 * G * shElapsed * shElapsed;
      } else {
        // Rebond sur le cercle : on reprend une intégration simple jusqu'au sol.
        velY += G * dt;
        bp.x += velX * dt;
        bp.y += velY * dt;
      }
      bp.r = R;

      // Guidage final : en descente près de l'anneau, la balle revient progressivement
      // vers le centre au lieu d'être recalée d'un coup au moment du score.
      if (st === "bounce" && velY > 0) {
        const near = Hm.w * 0.75;
        if (bp.y > hy - near) {
          const g = Math.min(1, (bp.y - (hy - near)) / near);
          bp.x += (hx - bp.x) * g * 0.45;
        }
      }

      // Le ballon redescend au niveau du cercle : on vérifie s'il passe dedans.
      if (st === "bounce" && velY > 0 && prevY <= hy && bp.y > hy) {
        const entryTol = Math.max(2, Hm.w * 0.125 - R * 0.35);
        if (Math.abs(bp.x - hx) <= entryTol) {
          bp.x = hx;
          scoreR = bp.r;
          st = "drop";
          st0 = t;
          hoopEl.classList.remove("swish", "rimhit");
          void hoopEl.offsetWidth;
          hoopEl.classList.add("swish");
          dispatchEvent(new CustomEvent("fx:swish"));
        } else {
          // Cercle raté : le ballon rebondit dessus puis reste au niveau du cercle.
          st = "miss";
          st0 = t;
          homeRX = xToRatio(bp.x, a, R);
          homeRY = yToRatio(hy + Hm.w * 0.12, a, R);
          velY = -Math.abs(velY) * 0.35;
          velX = (bp.x < hx ? -1 : 1) * 110;
          hoopEl.classList.remove("swish", "rimhit");
          void hoopEl.offsetWidth;
          hoopEl.classList.add("rimhit");
        }
      }
      const landingY = ratioToY(a, R);
      if (bp.y >= landingY) {
        bp.y = landingY;
        homeRX = xToRatio(bp.x, a, R); // le ballon reste là où il est retombé
        homeRY = yToRatio(bp.y, a, R);
        st = "dribble";
        st0 = t;
      }

      const above = Math.max(0, landingY - bp.y);
      imp = Math.max(0, imp - dt * 4.5);
      squash = 1 - 0.22 * imp + Math.min(0.1, Math.abs(velY) / 6000);
      shOp = Math.max(0.12, 1 - above / 260);
      ball.rotation.y += dt * (1.6 + Math.abs(velY) / 600);
      ball.rotation.z += dt * (st === "bounce" ? 3.2 : 0.6);
    }

    const r = bp.r * Math.max(0.001, k);
    ball.position.set(bp.x, -bp.y, 5);
    ball.scale.set(r * (1 + (1 - squash) * 0.55), r * squash, r);
    const landingY = ratioToY(a, R);
    const sh = Math.max(0.35, 1 - (landingY - bp.y) / 260);
    shadow.position.set(bp.x, -(landingY + R * 0.9), 0);
    shadow.scale.set(R * 1.15 * sh, R * 0.3 * sh, 1);
    shadowMat.opacity = shOp * sh;
    if (st === "drop") shadow.visible = false;

    glow.position.set(bp.x, -bp.y, 4.7);
    const gr = r * 3.4;
    glow.scale.set(gr, gr, 1);
    glowMat.opacity =
      st === "drop"
        ? 0.32
        : st === "bounce" || st === "plain" || st === "slide"
          ? 0.28
          : 0.18;
  }

  const clock = new THREE.Clock();
  let running = true,
    raf;
  function loop() {
    const t = clock.getElapsedTime();
    const dt = Math.min(0.05, t - lastT);
    lastT = t;
    const was = ball.visible;
    frame(t, dt);
    if (ball.visible || was) renderer.render(scene, camera);
    if (running && !reduce) raf = requestAnimationFrame(loop);
  }
  loop();
  if (reduce) {
    addEventListener(
      "scroll",
      () => {
        frame(lastT, 0);
        renderer.render(scene, camera);
      },
      { passive: true },
    );
    setTimeout(() => {
      frame(lastT, 0);
      renderer.render(scene, camera);
    }, 400);
  }

  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running && !reduce) {
      clock.getDelta();
      loop();
    } else cancelAnimationFrame(raf);
  });
})();
