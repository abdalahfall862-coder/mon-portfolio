/* hoop.js — couche avant du panier, calée sur la géométrie FIBA ×1,53 de index.html :
   viewBox 0 0 100 100, anneau ⌀25, carré 32,8 × 25, planche 100 × 58,3. Le canvas 3D
   (z-index 50) est pris en sandwich : l'arrière reste dans #fx-hoop, l'avant est recopié
   dans #fx-hoop-front (z-index 51). */
(function () {
  const hoop = document.getElementById('fx-hoop');
  if (!hoop || document.getElementById('fx-hoop-front')) return;

  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.id = 'fx-hoop-front';
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('aria-hidden', 'true');
  // Balayage 0 : demi-cercle inférieur, donc le vrai bord avant passe devant la balle.
  svg.innerHTML =
    '<g class="hoop-net">' +
      '<path d="M62.5 50Q60 62 56 73.3"/>' +
      '<path d="M56.2 51Q55 63 53 74"/>' +
      '<path d="M50 52Q50 64 50 74.5"/>' +
      '<path d="M43.8 51Q45 63 47 74"/>' +
      '<path d="M37.5 50Q40 62 44 73.3"/>' +
    '</g>' +
    '<path class="hoop-rim-front" d="M37.5 50A12.5 3.5 0 0 0 62.5 50"/>';
  document.body.appendChild(svg);

  // Calage sur #fx-hoop en coordonnées document (suit le scroll sans recalcul)
  function place() {
    const r = hoop.getBoundingClientRect();
    svg.style.left = (r.left + window.scrollX) + 'px';
    svg.style.top = (r.top + window.scrollY) + 'px';
    svg.style.width = r.width + 'px';
    svg.style.height = r.height + 'px';
  }
  place();
  addEventListener('resize', place);
  addEventListener('load', place);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
  if (window.ResizeObserver) {
    new ResizeObserver(place).observe(hoop);
    new ResizeObserver(place).observe(document.body);
  }
  setTimeout(place, 600);
  setTimeout(place, 2000);

  // three-scene.js pose swish / rimhit sur #fx-hoop : on recopie sur la couche avant
  new MutationObserver(() => {
    ['swish', 'rimhit'].forEach((c) => svg.classList.toggle(c, hoop.classList.contains(c)));
  }).observe(hoop, { attributes: true, attributeFilter: ['class'] });
})();
