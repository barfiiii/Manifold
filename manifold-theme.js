/* Manifold shared theme: green/white by default. Loaded in <head> before page scripts. */
(function () {
  try { if (!localStorage.getItem('manifold_theme')) localStorage.setItem('manifold_theme', 'light'); } catch (e) {}
  function parse(c) {
    var m = c.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (m) { var h = m[1]; if (h.length === 3) h = h.split('').map(function (x) { return x + x; }).join(''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1]; }
    m = c.match(/^rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:[ ,/]+([\d.]+))?\s*\)$/i);
    return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null;
  }
  var cache = {};
  function remap(v) {
    if (cache[v] !== undefined) return cache[v];
    var p = parse(v), out = v;
    if (p) {
      var l = (0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]) / 255, a = p[3];
      if (l > 0.82) out = a < 0.12 ? 'rgba(15,59,31,' + Math.min(0.14, a * 3.2).toFixed(3) + ')' : 'rgba(13,13,13,' + Math.min(1, 0.22 + a * 0.85).toFixed(2) + ')';
      else if (l < 0.22 && a >= 0.5) out = a >= 0.95 ? '#f4f4f4' : 'rgba(244,244,244,' + a + ')';
    }
    return (cache[v] = out);
  }
  function light() { return document.body && document.body.classList.contains('light'); }
  var proto = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
  if (proto) ['fillStyle', 'strokeStyle'].forEach(function (k) {
    var d = Object.getOwnPropertyDescriptor(proto, k);
    if (!d) return;
    Object.defineProperty(proto, k, { configurable: true, get: d.get, set: function (v) { d.set.call(this, (typeof v === 'string' && light()) ? remap(v) : v); } });
  });
})();
