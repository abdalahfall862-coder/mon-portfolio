/* hoop.js — adapté au panier actuel de index.html (viewBox 0 0 100 100, géométrie scale 1.42).
   Le canvas 3D (z-index 50) est pris en sandwich : l'arrière du cercle/filet reste dans
   #fx-hoop (sous le canvas), l'avant est recopié dans #fx-hoop-front (z-index 51).
   Clic et animations restent pilotés par #fx-hoop / three-scene.js. */
(function () {
  const hoop = document.getElementById('fx-hoop');
  if (!hoop || document.getElementById('fx-hoop-front')) return;

  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.id = 'fx-hoop-front';
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML =
    '<g transform="translate(50 52) scale(1.42) translate(-50 -52)">' +
      '<g class="hoop-net">' +
        '<path d="M74 52Q69 67 64 80"/>' +
        '<path d="M70.8 55Q66.5 67 62.1 81.8"/>' +
        '<path d="M62 57.2Q59.5 68 57 83"/>' +
        '<path d="M50 58Q50 68 50 83.5"/>' +
        '<path d="M38 57.2Q40.5 68 43 83"/>' +
        '<path d="M29.2 55Q33.5 67 37.9 81.8"/>' +
        '<path d="M26 52Q31 67 36 80"/>' +
      '</g>' +
      '<path class="hoop-rim-front" d="M26 52A24 6 0 0 1 74 52"/>' +
    '</g>';
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
