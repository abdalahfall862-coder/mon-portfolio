/* three-scene.js v8 — ballon de basket officiel NBA Wilson.
   Texture générée en JS : cuir pleine grain, 8 panneaux, NBA Pro Seams à double profondeur
   (3 grands cercles perpendiculaires, coutures ~6,2 mm / max FIBA 6,35 mm), logoman NBA,
   script Wilson avec inline anthracite. Rendu PBR (MeshStandardMaterial + bump map),
   ombre douce, caméra orthographique en pixels : le ballon dribble sur #fx-ball-anchor et
   tire vers #fx-hoop uniquement sur demande (bouton, clic sur le panier, touche B), avec un
   halo, un backspin et un éclat d'étincelles. Un clic ailleurs fait rebondir le ballon avec
   gravité, amortissement et squash à l'impact. Événements 'fx:shoot' (entrée) et 'fx:swish' (sortie). */
(function () {
  if (typeof THREE === 'undefined') return;
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); }
  catch (e) { canvas.remove(); return; }
  renderer.outputEncoding = THREE.sRGBEncoding;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const anchor = document.getElementById('fx-ball-anchor');
  const hoopEl = document.getElementById('fx-hoop');
  if (!anchor) { canvas.remove(); return; }

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(0, 1, 0, -1, -2000, 2000);

  /* ---------- Éclairage (salle : clé chaude, rebond parquet, contre-jour) ---------- */
  scene.add(new THREE.HemisphereLight(0xfff0dc, 0x7a4220, 0.95));
  const key = new THREE.DirectionalLight(0xfff3e2, 1.55); key.position.set(-0.55, 0.85, 1);
  const rimL = new THREE.DirectionalLight(0xffb070, 0.55); rimL.position.set(0.9, 0.1, -0.5);
  scene.add(key, rimL);

  /* ---------- Texture du ballon ---------- */
  function buildTextures() {
    const TW = 1024, TH = 512;
    const c1 = document.createElement('canvas'), c2 = document.createElement('canvas');
    c1.width = c2.width = TW; c1.height = c2.height = TH;
    const x1 = c1.getContext('2d'), x2 = c2.getContext('2d');
    const i1 = x1.createImageData(TW, TH), i2 = x2.createImageData(TW, TH);
    const d1 = i1.data, d2 = i2.data;

    const cp = new Float32Array(TW), sp = new Float32Array(TW);
    for (let x = 0; x < TW; x++) { const ph = (x + 0.5) / TW * Math.PI * 2; cp[x] = Math.cos(ph); sp[x] = Math.sin(ph); }
    /* Canaux conformes à la norme : 3 grands cercles mutuellement perpendiculaires
       (1 équateur + 2 méridiens à 90°) -> 8 panneaux, configuration classique FIBA/NBA.
       Les méridiens sont tournés de 45° pour que le marquage tombe au centre d'un panneau.
       Demi-largeur 0,026 rad ~ 6,2 mm de couture sur une taille 7 (max FIBA : 6,35 mm). */
    const q = Math.SQRT1_2;
    const w = 0.026, F = 46;
    const sm = (a, b, v) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };

    for (let y = 0; y < TH; y++) {
      const th = (y + 0.5) / TH * Math.PI, st = Math.sin(th), ny = Math.cos(th);
      for (let x = 0; x < TW; x++) {
        const nx = -cp[x] * st, nz = sp[x] * st;
        // 3 canaux : équateur + 2 méridiens perpendiculaires (8 panneaux)
        const dEq = Math.abs(ny);
        const dMer = Math.min(Math.abs((nx - nz) * q), Math.abs((nx + nz) * q));
        const d = Math.min(dEq, dMer);
        const dep = dMer < dEq ? 0.95 : 0.78;         // NBA Pro Seams : double profondeur
        const g = 1 - sm(w * 0.6, w, d);              // fond du canal
        const e = sm(w, w * 2.6, d);                   // 0 près du canal -> 1 loin
        const pb = Math.sin(nx * F + 1.3) * Math.sin(ny * F + 0.7) * Math.sin(nz * F + 2.1);
        const pb2 = Math.sin((nx + ny) * F * 1.6 + 0.4) * Math.sin((nz - ny) * F * 1.6 + 1.1);
        const p = Math.max(0, Math.min(1, 0.5 + 0.38 * pb + 0.2 * pb2));
        const tint = 0.965 + 0.035 * Math.sin(nx * 3.1 + nz * 2.3 + ny);
        const shade = (0.5 + 0.5 * e) * (0.9 + 0.13 * p) * tint;
        let r = 0.80 * shade, gg = 0.375 * shade, b = 0.125 * shade;
        r += (0.03 - r) * g; gg += (0.02 - gg) * g; b += (0.015 - b) * g;
        const o = (y * TW + x) * 4;
        d1[o] = Math.min(255, r * 255); d1[o + 1] = Math.min(255, gg * 255); d1[o + 2] = Math.min(255, b * 255); d1[o + 3] = 255;

        let h = (0.6 + 0.26 * (p - 0.5)) * (0.4 + 0.6 * e);
        h = h * (1 - g * dep);
        const ridge = Math.exp(-Math.pow((d - w * 1.4) / (w * 0.65), 2)) * 0.2;
        h += ridge * (1 - g);
        const hv = Math.max(0, Math.min(255, h * 255));
        d2[o] = d2[o + 1] = d2[o + 2] = hv; d2[o + 3] = 255;
      }
    }
    x1.putImageData(i1, 0, 0); x2.putImageData(i2, 0, 0);

    /* Marquage du ballon officiel NBA Wilson : logoman NBA et script Wilson
       estampés dans le cuir grainé, avec l'inline anthracite du logo Wilson. */
    x1.textAlign = 'center'; x1.textBaseline = 'middle';

    /* --- Logoman NBA : joueur en mouvement dans un cercle --- */
    (function logoman(cx, cy, R) {
      const ink = 'rgba(26,12,5,.9)';
      x1.save(); x1.translate(cx, cy);
      x1.beginPath(); x1.arc(0, 0, R, 0, Math.PI * 2);
      x1.fillStyle = 'rgba(120,52,14,.5)'; x1.fill();
      x1.lineWidth = 7; x1.strokeStyle = ink; x1.stroke();
      x1.fillStyle = ink; x1.strokeStyle = ink; x1.lineCap = 'round';
      x1.beginPath(); x1.arc(-R * 0.04, -R * 0.36, R * 0.15, 0, Math.PI * 2); x1.fill();
      x1.save(); x1.rotate(-0.22); x1.fillRect(-R * 0.14, -R * 0.2, R * 0.28, R * 0.5); x1.restore();
      x1.lineWidth = R * 0.11;
      x1.beginPath(); x1.moveTo(R * 0.08, -R * 0.06); x1.lineTo(R * 0.42, -R * 0.26); x1.stroke();
      x1.beginPath(); x1.moveTo(-R * 0.06, R * 0.26); x1.lineTo(-R * 0.26, R * 0.56); x1.stroke();
      x1.beginPath(); x1.moveTo(R * 0.06, R * 0.26); x1.lineTo(R * 0.28, R * 0.54); x1.stroke();
      x1.beginPath(); x1.arc(R * 0.5, -R * 0.32, R * 0.16, 0, Math.PI * 2); x1.fill();
      x1.restore();
      x1.font = '900 22px "Arial Black", Impact, sans-serif';
      x1.fillStyle = ink;
      x1.fillText('NBA', cx, cy + R + 16);
    })(TW * 0.25, TH * 0.31, 58);

    /* --- Script Wilson + inline anthracite --- */
    (function wilson(cx, cy) {
      x1.save(); x1.translate(cx, cy);
      x1.font = 'italic 900 66px Georgia, "Times New Roman", serif';
      x1.lineJoin = 'round'; x1.lineWidth = 9;
      x1.strokeStyle = 'rgba(38,38,42,.92)';                 // anthracite inline
      x1.strokeText('Wilson', 0, 0);
      x1.fillStyle = 'rgba(58,22,6,.94)';
      x1.fillText('Wilson', 0, 0);
      x1.font = '700 16px "Arial Black", sans-serif';
      x1.fillStyle = 'rgba(38,38,42,.8)';
      x1.fillText('OFFICIAL GAME BALL', 0, 50);
      x1.restore();
    })(TW * 0.75, TH * 0.69);
    return { color: c1, bump: c2 };
  }

  const ballMat = new THREE.MeshStandardMaterial({ color: 0xd2631f, roughness: 0.6, metalness: 0 });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), ballMat);
  ball.position.z = 5;

  // La texture est générée juste après le premier affichage (ne bloque pas le chargement)
  setTimeout(() => {
    try {
      const t = buildTextures();
      const map = new THREE.CanvasTexture(t.color); map.encoding = THREE.sRGBEncoding;
      const bump = new THREE.CanvasTexture(t.bump);
      const an = renderer.capabilities.getMaxAnisotropy ? Math.min(8, renderer.capabilities.getMaxAnisotropy()) : 1;
      map.anisotropy = bump.anisotropy = an;
      ballMat.color.setHex(0xffffff);
      ballMat.map = map; ballMat.bumpMap = bump; ballMat.bumpScale = 3.2; ballMat.roughness = 0.58;
      ballMat.needsUpdate = true;
    } catch (e) { /* on garde la couleur unie */ }
  }, 60);

  /* ---------- Ombre douce ---------- */
  const sc = document.createElement('canvas'); sc.width = sc.height = 128;
  const sctx = sc.getContext('2d');
  const grad = sctx.createRadialGradient(64, 64, 4, 64, 64, 62);
  grad.addColorStop(0, 'rgba(25,10,2,.75)'); grad.addColorStop(0.55, 'rgba(25,10,2,.35)'); grad.addColorStop(1, 'rgba(25,10,2,0)');
  sctx.fillStyle = grad; sctx.fillRect(0, 0, 128, 128);
  const shadowMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shadowMat);
  scene.add(shadow, ball);

  /* ---------- Halo doux et étincelles du panier ---------- */
  function softDot() {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const x = c.getContext('2d');
    const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.28, 'rgba(255,240,220,.85)');
    g.addColorStop(0.65, 'rgba(255,190,120,.28)');
    g.addColorStop(1, 'rgba(255,170,90,0)');
    x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }
  const dotTex = softDot();

  /* Halo doux qui accompagne le ballon (s'intensifie pendant le tir) */
  const glowMat = new THREE.SpriteMaterial({
    map: dotTex, color: 0xff8a36, transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false, depthTest: true, opacity: 0.2
  });
  const glow = new THREE.Sprite(glowMat);
  glow.position.z = 4.7;
  scene.add(glow);

  /* Étincelles jaillissant du cercle au moment du swish */
  const BN = 20;
  const bPos = new Float32Array(BN * 3), bCol = new Float32Array(BN * 3);
  const bx = new Float32Array(BN), by = new Float32Array(BN);
  const bvx = new Float32Array(BN), bvy = new Float32Array(BN), bLife = new Float32Array(BN);
  const bGeo = new THREE.BufferGeometry();
  bGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3));
  bGeo.setAttribute('color', new THREE.BufferAttribute(bCol, 3));
  const burst = new THREE.Points(bGeo, new THREE.PointsMaterial({
    size: 9, map: dotTex, vertexColors: true, transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false, depthTest: true,
    sizeAttenuation: false
  }));
  burst.frustumCulled = false; burst.visible = false;
  scene.add(burst);
  function spawnBurst(x, y) {
    for (let i = 0; i < BN; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 60 + Math.random() * 150;
      bx[i] = x; by[i] = y;
      bvx[i] = Math.cos(a) * sp * 0.55;
      bvy[i] = Math.sin(a) * sp * 0.75 - 40;
      bLife[i] = 0.45 + Math.random() * 0.45;
    }
    burst.visible = true;
  }
  function updateBurst(dt) {
    if (!burst.visible || dt <= 0) return;
    let alive = false;
    for (let i = 0; i < BN; i++) {
      if (bLife[i] <= 0) { bCol[i * 3] = bCol[i * 3 + 1] = bCol[i * 3 + 2] = 0; continue; }
      alive = true;
      bLife[i] -= dt;
      bvy[i] += 320 * dt;                     // gravité (écran : y vers le bas)
      bx[i] += bvx[i] * dt; by[i] += bvy[i] * dt;
      const f = Math.max(0, Math.min(1, bLife[i] / 0.9));
      bPos[i * 3] = bx[i]; bPos[i * 3 + 1] = -by[i]; bPos[i * 3 + 2] = 4.3;
      bCol[i * 3] = f; bCol[i * 3 + 1] = 0.55 * f * f; bCol[i * 3 + 2] = 0.12 * f * f;
    }
    bGeo.attributes.position.needsUpdate = true;
    bGeo.attributes.color.needsUpdate = true;
    if (!alive) burst.visible = false;
  }

  /* ---------- Mesures mises en cache ---------- */
  let W = 1, H = 1;
  let A = { l: 0, t: 0, w: 0, h: 0 }, Hm = { x: 0, y: 0, w: 0 };
  function measure() {
    const sy = window.scrollY;
    const a = anchor.getBoundingClientRect();
    A = { l: a.left, t: a.top + sy, w: a.width, h: a.height };
    // Le cercle est à 52% de la hauteur du SVG du panier (le reste est la planche et le bras).
    if (hoopEl) { const r = hoopEl.getBoundingClientRect(); Hm = { x: r.left + r.width / 2, y: r.top + sy + r.height * 0.52, w: r.width }; }
  }
  function resize() {
    W = innerWidth; H = innerHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 640 ? 1.5 : 2));
    renderer.setSize(W, H, false);
    camera.left = 0; camera.right = W; camera.top = 0; camera.bottom = -H;
    camera.updateProjectionMatrix();
    measure();
  }
  resize();
  addEventListener('resize', resize);
  addEventListener('load', measure);
  if (window.ResizeObserver) new ResizeObserver(measure).observe(document.body);

  /* ---------- Machine à états : dribble ↔ bounce → shot → drop → ret ---------- */
  let st = 'dribble', st0 = 0, lastT = 0;
  let sx0 = 0, sy0 = 0, sr = 30;
  let bv = 0, imp = 0;                            // vitesse verticale, intensité de l'impact
  const G = 1900;                                  // gravité en px/s²
  const bp = { x: 0, y: 0, r: 30 };
  /* Tir manuel : bouton dédié, clic sur le panier, touche B ou palette ⌘K.
     Plus aucun tir automatique : c'est l'utilisateur qui marque ses paniers. */
  function shoot() {
    if ((st === 'dribble' || st === 'bounce' || st === 'ret') && hoopEl && Hm.w > 0) {
      st = 'shot'; st0 = lastT; sx0 = bp.x; sy0 = bp.y; sr = bp.r;
      bv = 0; imp = 0;
    }
  }
  addEventListener('fx:shoot', shoot);
  ['fx-shoot-btn', 'fx-hoop'].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', shoot);
  });

  /* Clic (hors liens, boutons, champs, cartes et panneaux) : le ballon rebondit.
     L'impulsion dépend de la hauteur du dribble, l'amortissement rend le geste naturel. */
  addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || !ball.visible || st === 'shot' || st === 'drop') return;
    const el = e.target;
    if (el && el.closest && el.closest('a,button,input,textarea,select,label,[role="button"],.project-card,#project-modal,#sidebar,#top-actions,#fx-hud,#fx-pal')) return;
    // On remplace le dribble par un vrai rebond : hauteur cible calculée depuis la
    // position actuelle, pour une impulsion douce même si le ballon est déjà en l'air.
    const r = anchor.getBoundingClientRect();
    const R = Math.max(22, Math.min(50, r.width * 0.18));
    const curH = Math.max(0, r.bottom - 6 - R - bp.y);
    const target = Math.max(curH + 45, Math.min(r.height * 0.55, 190) * 1.4);
    bv = -Math.sqrt(2 * G * Math.max(45, target - curH));
    imp = 1;
    st = 'bounce'; st0 = lastT;
  }, { passive: true });

  const ease = (u) => u * u * (3 - 2 * u);

  function frame(t, dt) {
    const sY = window.scrollY;
    const a = { left: A.l, top: A.t - sY, width: A.w, height: A.h, bottom: A.t + A.h - sY };
    const onScreen = a.width > 0 && a.bottom > -60 && a.top < H + 60;
    ball.visible = shadow.visible = glow.visible = onScreen;
    if (!onScreen) { burst.visible = false; return; }

    const R = Math.max(22, Math.min(50, a.width * 0.18));
    const cx = a.left + a.width / 2;
    const floorY = a.bottom - 6 - R;
    const drib = Math.min(a.height * 0.55, 190);
    const el = t - st0;
    let k = 1, squash = 1, shOp = 1;

    if (st === 'dribble') {
      const u = (el % 0.8) / 0.8, h = 4 * u * (1 - u);
      bp.x = cx + Math.sin(t * 0.6) * a.width * 0.12;   // phase continue : aucun saut latéral
      bp.y = floorY - h * drib;
      bp.r = R;
      squash = h < 0.06 ? 0.86 + 0.14 * (h / 0.06) : 1;
      shOp = 1 - h * 0.6;
      ball.rotation.y += dt * 1.6; ball.rotation.x = 0.35; ball.rotation.z += dt * 0.3;
    } else if (st === 'shot') {
      const hx = Hm.x, hy = Hm.y - sY;
      const u = Math.min(1, el / 1.25);
      // Parabole réelle : le sommet est avant le panier, le ballon redescend dans le cercle
      const dx = hx - sx0;
      const arc = Math.max(140, Math.min(340, Math.abs(dx) * 0.6 + 80));
      const cxp = sx0 + dx * 0.42;
      const cyp = Math.min(sy0, hy) - arc;
      const iu = 1 - u;
      bp.x = iu * iu * sx0 + 2 * iu * u * cxp + u * u * hx;
      bp.y = iu * iu * sy0 + 2 * iu * u * cyp + u * u * hy;
      bp.r = sr * (1 - 0.22 * u);
      ball.rotation.z = -u * Math.PI * 3.6;   // backspin régulier et lisible
      ball.rotation.y += dt * 2.4;
      shOp = Math.max(0, 1 - u * 3);
      if (u >= 1) {
        st = 'drop'; st0 = t;
        spawnBurst(hx, hy);
        hoopEl.classList.remove('swish'); void hoopEl.offsetWidth; hoopEl.classList.add('swish');
        dispatchEvent(new CustomEvent('fx:swish'));
      }
    } else if (st === 'drop') {
      // Le ballon traverse le cercle, fouille le filet puis disparaît en douceur.
      const u = Math.min(1, el / 0.5);
      bp.x = Hm.x + Math.sin(u * Math.PI * 2) * 3 * (1 - u);
      bp.y = Hm.y - sY + Hm.w * (0.12 + 1.05 * u);
      bp.r = sr * (1 - 0.3 * u);
      k = 1 - ease(Math.max(0, (u - 0.55) / 0.45));
      shOp = 0;
      ball.rotation.z += dt * 2.2;
      if (u >= 1) { st = 'ret'; st0 = t; }
    } else if (st === 'bounce') {
      bv += G * dt;
      bp.y += bv * dt;
      bp.x = cx + Math.sin(t * 0.6) * a.width * 0.12;  // même dérive que le dribble
      bp.r = R;
      const above = Math.max(0, floorY - bp.y);
      if (bp.y >= floorY) {
        bp.y = floorY;
        if (bv > 130) { bv = -bv * 0.62; imp = 1; }   // rebonds successifs de plus en plus bas
        else { bv = 0; st = 'dribble'; st0 = t; }     // reprise du dribble sans coupure
      }
      imp = Math.max(0, imp - dt * 4.5);
      squash = 1 - 0.22 * imp + Math.min(0.1, Math.abs(bv) / 6000);
      shOp = Math.max(0.12, 1 - above / 260);
      ball.rotation.y += dt * (1.6 + Math.abs(bv) / 600);
      ball.rotation.z += dt * 0.5;
    } else {
      const u = Math.min(1, Math.max(0, (el - 0.5) / 0.6));
      bp.x = cx; bp.y = floorY; bp.r = R;
      k = ease(u); shOp = u;
      if (el > 1.1) { st = 'dribble'; st0 = t; }
    }

    const r = bp.r * Math.max(0.001, k);
    ball.position.set(bp.x, -bp.y, 5);
    ball.scale.set(r * (1 + (1 - squash) * 0.55), r * squash, r);
    const sh = Math.max(0.35, 1 - (floorY - bp.y) / 260);
    shadow.position.set(bp.x, -(floorY + R * 0.9), 0);
    shadow.scale.set(R * 1.15 * sh, R * 0.3 * sh, 1);
    shadowMat.opacity = shOp * sh;
    if (st === 'shot' || st === 'drop') shadow.visible = false;

    glow.position.set(bp.x, -bp.y, 4.7);
    const gr = r * 3.4;
    glow.scale.set(gr, gr, 1);
    glowMat.opacity = st === 'shot' ? 0.5 : (st === 'drop' ? 0.32 : 0.18);
    updateBurst(dt);
  }

  const clock = new THREE.Clock();
  let running = true, raf;
  function loop() {
    const t = clock.getElapsedTime();
    const dt = Math.min(0.05, t - lastT); lastT = t;
    const was = ball.visible;
    frame(t, dt);
    if (ball.visible || was) renderer.render(scene, camera);
    if (running && !reduce) raf = requestAnimationFrame(loop);
  }
  loop();
  if (reduce) {
    addEventListener('scroll', () => { frame(lastT, 0); renderer.render(scene, camera); }, { passive: true });
    setTimeout(() => { frame(lastT, 0); renderer.render(scene, camera); }, 400);
  }

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running && !reduce) { clock.getDelta(); loop(); } else cancelAnimationFrame(raf);
  });
})();