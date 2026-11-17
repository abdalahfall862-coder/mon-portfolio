/* three-scene.js v5 — ballon de basket façon NBA.
   Texture générée une fois en JS : cuir grainé, canaux creusés, panneaux, marquage "FALL #01".
   Rendu PBR (MeshStandardMaterial + bump map), ombre douce, caméra orthographique en pixels :
   le ballon dribble sur #fx-ball-anchor puis tire vers #fx-hoop. Événement 'fx:swish' à chaque panier. */
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
    const ang = 35 * Math.PI / 180, cs = Math.cos(ang), sn = Math.sin(ang);
    const w = 0.02, F = 46;
    const sm = (a, b, v) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };

    for (let y = 0; y < TH; y++) {
      const th = (y + 0.5) / TH * Math.PI, st = Math.sin(th), ny = Math.cos(th);
      for (let x = 0; x < TW; x++) {
        const nx = -cp[x] * st, nz = sp[x] * st;
        // distance aux 4 canaux : équateur + 3 méridiens (centre et ±35°)
        const d = Math.min(Math.abs(ny), Math.abs(nx), Math.abs(nx * cs - nz * sn), Math.abs(nx * cs + nz * sn));
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
        h = h * (1 - g);
        const ridge = Math.exp(-Math.pow((d - w * 1.4) / (w * 0.65), 2)) * 0.16;
        h += ridge * (1 - g);
        const hv = Math.max(0, Math.min(255, h * 255));
        d2[o] = d2[o + 1] = d2[o + 2] = hv; d2[o + 3] = 255;
      }
    }
    x1.putImageData(i1, 0, 0); x2.putImageData(i2, 0, 0);

    // Marquage sur le grand panneau
    x1.textAlign = 'center'; x1.textBaseline = 'middle';
    x1.fillStyle = 'rgba(16,7,3,.92)';
    x1.font = '900 66px Impact, "Arial Black", sans-serif';
    x1.fillText('FALL', TW * 0.5, TH * 0.385);
    x1.font = '800 34px Impact, "Arial Black", sans-serif';
    x1.fillText('#01', TW * 0.5, TH * 0.63);
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

  /* ---------- Mesures mises en cache ---------- */
  let W = 1, H = 1;
  let A = { l: 0, t: 0, w: 0, h: 0 }, Hm = { x: 0, y: 0, w: 0 };
  function measure() {
    const sy = window.scrollY;
    const a = anchor.getBoundingClientRect();
    A = { l: a.left, t: a.top + sy, w: a.width, h: a.height };
    if (hoopEl) { const r = hoopEl.getBoundingClientRect(); Hm = { x: r.left + r.width / 2, y: r.top + sy + r.height / 2, w: r.width }; }
  }
  function resize() {
    W = innerWidth; H = innerHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H, false);
    camera.left = 0; camera.right = W; camera.top = 0; camera.bottom = -H;
    camera.updateProjectionMatrix();
    measure();
  }
  resize();
  addEventListener('resize', resize);
  addEventListener('load', measure);
  if (window.ResizeObserver) new ResizeObserver(measure).observe(document.body);
  setTimeout(measure, 600); setTimeout(measure, 2000);

  /* ---------- Machine à états : dribble -> shot -> drop -> ret ---------- */
  let st = 'dribble', st0 = 0, lastT = 0;
  let sx0 = 0, sy0 = 0, sr = 30;
  const bp = { x: 0, y: 0, r: 30 };
  addEventListener('fx:shoot', () => {
    if (st === 'dribble' && hoopEl && Hm.w > 0) { st = 'shot'; st0 = lastT; sx0 = bp.x; sy0 = bp.y; sr = bp.r; }
  });
  const ease = (u) => u * u * (3 - 2 * u);

  function frame(t, dt) {
    const sY = window.scrollY;
    const a = { left: A.l, top: A.t - sY, width: A.w, height: A.h, bottom: A.t + A.h - sY };
    const onScreen = a.width > 0 && a.bottom > -60 && a.top < H + 60;
    ball.visible = shadow.visible = onScreen;
    if (!onScreen) return;

    const R = Math.max(22, Math.min(50, a.width * 0.18));
    const cx = a.left + a.width / 2;
    const floorY = a.bottom - 6 - R;
    const drib = Math.min(a.height * 0.55, 190);
    const el = t - st0;
    let k = 1, squash = 1, shOp = 1;

    if (st === 'dribble') {
      if (el >= 4 && hoopEl && Hm.w > 0) { st = 'shot'; st0 = t; sx0 = bp.x; sy0 = bp.y; sr = bp.r; return frame(t, 0); }
      const u = (el % 0.8) / 0.8, h = 4 * u * (1 - u);
      bp.x = cx + Math.sin(el * 0.6) * a.width * 0.12;
      bp.y = floorY - h * drib;
      bp.r = R;
      squash = h < 0.06 ? 0.86 + 0.14 * (h / 0.06) : 1;
      shOp = 1 - h * 0.6;
      ball.rotation.y += dt * 1.6; ball.rotation.x = 0.35; ball.rotation.z += dt * 0.3;
    } else if (st === 'shot') {
      const hx = Hm.x, hy = Hm.y - sY;
      const u = Math.min(1, el / 1.3);
      bp.x = sx0 + (hx - sx0) * u;
      bp.y = sy0 + (hy - sy0) * u - 150 * 4 * u * (1 - u);
      bp.r = sr * (1 - 0.4 * u);
      ball.rotation.z -= dt * 8; ball.rotation.y += dt * 2;
      shOp = Math.max(0, 1 - u * 3);
      if (u >= 1) {
        st = 'drop'; st0 = t;
        hoopEl.classList.remove('swish'); void hoopEl.offsetWidth; hoopEl.classList.add('swish');
        dispatchEvent(new CustomEvent('fx:swish'));
      }
    } else if (st === 'drop') {
      const u = Math.min(1, el / 0.35);
      bp.x = Hm.x; bp.y = Hm.y - sY + 14 * u;
      k = 1 - ease(u); bp.r = sr * 0.6; shOp = 0;
      if (u >= 1) { st = 'ret'; st0 = t; }
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