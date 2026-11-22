/* Carte du monde interactive (SVG, sans fond de carte externe).
   Déplacement au glisser, zoom par boutons / Ctrl + molette / pincement, points cliquables.
   Les points de données sont dans worldmap-data.js (window.WORLD_DOTS). */
(function () {
  'use strict';
  var W = 360, H = 142, AR = H / W, MAXK = 16;
  var NS = 'http://www.w3.org/2000/svg';
  var PX = { core: 6.5, halo: 11, hit: 17 };   /* tailles des points à l'écran, en pixels */

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* opts : points [{id,state,lat,lon,label}], selected, view {x,y,w}, labels, onSelect(id), onView(view) */
  function create(host, opts) {
    var points = opts.points || [];
    var view = opts.view && opts.view.w ? { x: opts.view.x, y: opts.view.y, w: opts.view.w } : { x: 0, y: 0, w: W };
    var selected = opts.selected || null;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var anim = null;

    var L = opts.labels || {};
    host.innerHTML =
      '<div class="map-stage">' +
        '<svg class="map-svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet" role="group" aria-label="' + esc(L.map || '') + '">' +
          '<path class="map-land" d="' + (window.WORLD_DOTS || '') + '"/>' +
          '<g class="map-pts">' + points.map(function (p) {
            return '<g class="pt st-' + p.state + (p.id === selected ? ' sel' : '') + '" data-id="' + esc(p.id) + '" tabindex="0" role="button" aria-label="' + esc(p.label) + '">' +
              '<title>' + esc(p.label) + '</title>' +
              '<circle class="hit"/><circle class="ring"/>' + (p.state === 'live' ? '<circle class="pulse"/>' : '') + '<circle class="core"/></g>';
          }).join('') + '</g>' +
        '</svg>' +
        '<div class="map-ctl">' +
          '<button type="button" data-z="in" aria-label="' + esc(L.zoomIn || '+') + '">+</button>' +
          '<button type="button" data-z="out" aria-label="' + esc(L.zoomOut || '−') + '">−</button>' +
          '<button type="button" data-z="reset" aria-label="' + esc(L.reset || '') + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button>' +
        '</div>' +
      '</div>';

    var stage = host.querySelector('.map-stage');
    var svg = host.querySelector('.map-svg');
    var groups = [].slice.call(host.querySelectorAll('.pt'));
    var byId = {};
    points.forEach(function (p, i) { byId[p.id] = { p: p, g: groups[i], x: p.lon + 180, y: 84 - p.lat }; });

    function h() { return view.w * AR; }
    function fix() {
      view.w = clamp(view.w, W / MAXK, W);
      view.x = clamp(view.x, 0, W - view.w);
      view.y = clamp(view.y, 0, H - h());
    }
    function paint() {
      fix();
      svg.setAttribute('viewBox', view.x + ' ' + view.y + ' ' + view.w + ' ' + h());
      var upp = view.w / (svg.clientWidth || W);      /* unités de carte par pixel */
      groups.forEach(function (g, i) {
        var o = byId[points[i].id], s = g.children;
        for (var j = 0; j < s.length; j++) {
          var c = s[j], cls = c.getAttribute('class');
          if (!cls) continue;
          c.setAttribute('cx', o.x); c.setAttribute('cy', o.y);
          c.setAttribute('r', (cls === 'hit' ? PX.hit : cls === 'core' ? PX.core : PX.halo) * upp);
          if (cls === 'core' || cls === 'ring') c.setAttribute('stroke-width', (cls === 'core' ? 2 : 1.5) * upp);
        }
      });
      svg.style.setProperty('--dot', (0.95).toString());
      stage.style.touchAction = view.w < W - 0.01 ? 'none' : 'pan-y';
      stage.classList.toggle('zoomed', view.w < W - 0.01);
      if (opts.onView) opts.onView({ x: view.x, y: view.y, w: view.w });
    }

    function zoomAt(factor, cx, cy) {   /* cx, cy en coordonnées de carte */
      var nw = clamp(view.w / factor, W / MAXK, W);
      var f = nw / view.w;
      view.x = cx - (cx - view.x) * f;
      view.y = cy - (cy - view.y) * f;
      view.w = nw;
      paint();
    }
    function centerOf() { return { x: view.x + view.w / 2, y: view.y + h() / 2 }; }

    function tween(to) {
      if (anim) cancelAnimationFrame(anim);
      if (reduce) { view = to; paint(); return; }
      var from = { x: view.x, y: view.y, w: view.w }, t0 = null, dur = 650;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var k = clamp((ts - t0) / dur, 0, 1), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        view.x = from.x + (to.x - from.x) * e; view.y = from.y + (to.y - from.y) * e; view.w = from.w + (to.w - from.w) * e;
        paint();
        anim = k < 1 ? requestAnimationFrame(step) : null;
      }
      anim = requestAnimationFrame(step);
    }
    function viewOn(o, k) { var w = W / k; return { x: o.x - w / 2, y: o.y - w * AR / 2, w: w }; }

    /* ----- interactions ----- */
    stage.addEventListener('click', function (e) {
      var b = e.target.closest('[data-z]');
      if (b) {
        var c = centerOf();
        if (b.dataset.z === 'in') zoomAt(1.7, c.x, c.y);
        else if (b.dataset.z === 'out') zoomAt(1 / 1.7, c.x, c.y);
        else tween({ x: 0, y: 0, w: W });
        return;
      }
      var g = e.target.closest('.pt');
      if (g && !stage.dataset.dragged && opts.onSelect) opts.onSelect(g.dataset.id);
    });
    stage.addEventListener('keydown', function (e) {
      var g = e.target.closest && e.target.closest('.pt');
      if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); if (opts.onSelect) opts.onSelect(g.dataset.id); }
    });
    stage.addEventListener('wheel', function (e) {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      var r = svg.getBoundingClientRect(), upp = view.w / r.width;
      zoomAt(e.deltaY < 0 ? 1.25 : 0.8, view.x + (e.clientX - r.left) * upp, view.y + (e.clientY - r.top) * upp);
    }, { passive: false });
    stage.addEventListener('dblclick', function (e) {
      if (e.target.closest('.pt') || e.target.closest('.map-ctl')) return;
      var r = svg.getBoundingClientRect(), upp = view.w / r.width;
      zoomAt(1.8, view.x + (e.clientX - r.left) * upp, view.y + (e.clientY - r.top) * upp);
    });

    var ptrs = {}, start = null, pinch = null;
    svg.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.pt')) return;
      ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(ptrs);
      if (ids.length === 1) start = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y, moved: false };
      if (ids.length === 2) { var a = ptrs[ids[0]], b = ptrs[ids[1]]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) }; start = null; }
      delete stage.dataset.dragged;
    });
    svg.addEventListener('pointermove', function (e) {
      if (!ptrs[e.pointerId]) return;
      ptrs[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(ptrs), r = svg.getBoundingClientRect(), upp = view.w / r.width;
      if (ids.length === 2 && pinch) {
        var a = ptrs[ids[0]], b = ptrs[ids[1]], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinch.d > 0) zoomAt(d / pinch.d, view.x + ((a.x + b.x) / 2 - r.left) * upp, view.y + ((a.y + b.y) / 2 - r.top) * upp);
        pinch.d = d; stage.dataset.dragged = '1';
      } else if (start && view.w < W - 0.01) {
        var dx = e.clientX - start.x, dy = e.clientY - start.y;
        if (!start.moved && Math.hypot(dx, dy) > 4) { start.moved = true; stage.dataset.dragged = '1'; try { svg.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ } stage.classList.add('drag'); }
        if (start.moved) { view.x = start.vx - dx * upp; view.y = start.vy - dy * upp; paint(); }
      }
    });
    function up(e) {
      delete ptrs[e.pointerId];
      if (Object.keys(ptrs).length < 2) pinch = null;
      if (!Object.keys(ptrs).length) { start = null; stage.classList.remove('drag'); setTimeout(function () { delete stage.dataset.dragged; }, 0); }
    }
    svg.addEventListener('pointerup', up);
    svg.addEventListener('pointercancel', up);

    var ro = window.ResizeObserver ? new ResizeObserver(paint) : null;
    if (ro) ro.observe(svg); else window.addEventListener('resize', paint);
    paint();

    return {
      select: function (id) {
        selected = id;
        groups.forEach(function (g) { g.classList.toggle('sel', g.dataset.id === id); });
        if (id && byId[id]) tween(viewOn(byId[id], Math.max(3.2, W / view.w)));
      },
      clear: function () {
        selected = null;
        groups.forEach(function (g) { g.classList.remove('sel'); });
        tween({ x: 0, y: 0, w: W });
      }
    };
  }

  window.WorldMap = { create: create };
})();
