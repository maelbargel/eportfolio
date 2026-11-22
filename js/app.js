/* Affichage du site : en-tête, pages, langue FR/EN, thème, carte des mobilités.
   Le contenu est dans content.js. */
(function () {
  'use strict';
  var S = window.SITE;
  var app = document.getElementById('app');
  var page = app.dataset.page;

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* stockage indisponible */ } }
  };

  var qLang = null;
  try { qLang = new URLSearchParams(location.search).get('lang'); } catch (e) { /* ignore */ }
  var lang = [qLang, store.get('lang')].filter(function (v) { return v === 'fr' || v === 'en'; })[0] ||
    ((navigator.language || 'fr').toLowerCase().indexOf('fr') === 0 ? 'fr' : 'en');
  var filter = 'all';
  var menuOpen = false;

  /* état de la carte des mobilités */
  var hiddenStates = {};
  var selectedMob = null;
  var mapView = null;
  var mapApi = null;

  var savedTheme = store.get('theme');
  if (savedTheme === 'dark' || savedTheme === 'light') document.documentElement.dataset.theme = savedTheme;

  /* ---------- utilitaires ---------- */
  function t(v) {
    if (v && typeof v === 'object' && !Array.isArray(v) && ('fr' in v || 'en' in v)) return v[lang];
    return v;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  var ui = function () { return S.ui[lang]; };

  var ART = {
    game: '<rect x="14" y="38" width="92" height="46" rx="23"/><path d="M38 52v16M30 60h16"/><circle cx="76" cy="55" r="4"/><circle cx="88" cy="65" r="4"/>',
    planet: '<circle cx="60" cy="60" r="22"/><ellipse cx="60" cy="60" rx="50" ry="13" transform="rotate(-20 60 60)"/><path d="M16 22l2 6M104 96l2 6M98 20h6M101 17v6"/>',
    stage: '<path d="M50 18h20l26 66H24z"/><circle cx="60" cy="14" r="5"/><path d="M18 98h84"/><circle cx="60" cy="70" r="6"/>',
    globe: '<circle cx="60" cy="60" r="36"/><ellipse cx="60" cy="60" rx="15" ry="36"/><path d="M24 60h72M30 40h60M30 80h60"/>',
    racket: '<ellipse cx="44" cy="46" rx="22" ry="28" transform="rotate(-35 44 46)"/><path d="M60 68l34 34M30 30l28 28"/><path d="M84 20l8 14M100 28l-10 8M92 18l-2 16"/>',
    spark: '<path d="M60 12l10 30 30-10-18 26 24 20-30 0 4 30-20-24-20 24 4-30-30 0 24-20L20 32l30 10z"/>',
    growth: '<path d="M16 96l32-32 20 20 36-48"/><path d="M80 36h24v24"/>',
    sun: '<circle cx="60" cy="60" r="24"/><path d="M60 12v12M60 96v12M12 60h12M96 60h12M26 26l8 8M86 86l8 8M94 26l-8 8M34 86l-8 8"/>'
  };
  function art(k) { return '<svg viewBox="0 0 120 120" aria-hidden="true">' + (ART[k] || ART.spark) + '</svg>'; }

  var ICON = {
    dl: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 7v8M8.5 12 12 15.5 15.5 12"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.55h.05c.53-1 1.82-2.05 3.75-2.05 4 0 4.75 2.63 4.75 6.05V21h-4v-5.1c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.32-1.96 2.69V21h-4z"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>'
  };

  /* Lien configurable : actif si une adresse est renseignée, sinon grisé */
  function linkAttrs(url) {
    if (url) return ' href="' + esc(url) + '" target="_blank" rel="noopener"';
    return ' aria-disabled="true" title="' + esc(ui().toAdd) + '"';
  }
  function fileAttrs(url) {
    if (url) return ' href="' + esc(url) + '" download';
    return ' aria-disabled="true" title="' + esc(ui().toAdd) + '"';
  }

  /* ---------- blocs communs ---------- */
  function header() {
    var u = ui();
    var nav = S.pages.map(function (p) {
      return '<li><a href="' + p.href + '"' + (p.id === page ? ' aria-current="page"' : '') + '>' + esc(t(p.nav)) + '</a></li>';
    }).join('');
    return '<header class="site-head' + (menuOpen ? ' open' : '') + '"><div class="wrap head-row">' +
      '<a class="brand" href="index.html"><b>Maël BARGEL</b></a>' +
      '<nav class="nav" id="nav" aria-label="' + esc(u.nav) + '"><ul>' + nav + '</ul></nav>' +
      '<div class="lang" role="group" aria-label="' + esc(u.language) + '">' +
        '<button type="button" data-lang="fr" aria-pressed="' + (lang === 'fr') + '">FR</button>' +
        '<button type="button" data-lang="en" aria-pressed="' + (lang === 'en') + '">EN</button></div>' +
      '<button class="icon-btn" type="button" data-act="theme" aria-label="' + esc(u.theme) + '">' + ICON.moon + '</button>' +
      '<button class="icon-btn menu-btn" type="button" data-act="menu" aria-expanded="' + menuOpen + '" aria-controls="nav" aria-label="' + esc(u.menu) + '">' + ICON.menu + '</button>' +
      '</div></header>';
  }

  function footer() {
    var u = ui(), c = S.cfg;
    return '<footer><div class="wrap"><div class="foot"><div><h2>' + esc(u.contact) + '</h2><p>' + esc(u.contactText) + '</p></div>' +
      '<dl class="contact">' +
        '<div><dt>' + esc(u.phoneLbl) + '</dt><dd>' + esc(t(c.phone)) + '</dd></div>' +
        '<div><dt>' + esc(u.emailLbl) + '</dt><dd><a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a></dd></div>' +
        '<div><dt>' + esc(u.onlineLbl) + '</dt><dd><a' + linkAttrs(c.linkedin) + '>' + esc(u.linkedin) + '</a></dd></div>' +
      '</dl></div><p class="copy">' + esc(u.copy) + '</p></div></footer>';
  }

  /* Description : liste à puces si c'est un tableau, sinon paragraphe */
  function descHtml(v) {
    if (Array.isArray(v)) return '<ul class="bullets">' + v.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
    return '<p class="desc">' + esc(v) + '</p>';
  }

  /* Statistiques du jeu (fichier data/roblox-stats.json mis à jour par GitHub Actions) */
  var statsCache = {};
  function fmtNum(n, compact) {
    if (n == null) return '—';
    try { return new Intl.NumberFormat(lang, compact ? { notation: 'compact', maximumFractionDigits: 1 } : {}).format(n); } catch (e) { return String(n); }
  }
  function fmtDate(s, withTime) {
    if (!s) return '—';
    try { return new Intl.DateTimeFormat(lang, withTime ? { dateStyle: 'medium', timeStyle: 'short' } : { dateStyle: 'medium' }).format(new Date(s)); } catch (e) { return String(s); }
  }
  function statsBlock(d) {
    var u = ui(), s = statsCache[d.stats.src] || {};
    var cells = [
      ['statActive', fmtNum(s.playing), 'live'], ['statVisits', fmtNum(s.visits, true), ''], ['statFavorites', fmtNum(s.favorites), ''],
      ['statLikes', fmtNum(s.likes), ''], ['statUpdated', fmtDate(s.gameUpdated), '']
    ];
    return '<div class="item-stats" data-stats="' + esc(d.stats.src) + '"><dl class="stats">' +
      cells.map(function (c) { return '<div' + (c[2] ? ' class="' + c[2] + '"' : '') + '><dt>' + esc(u[c[0]]) + '</dt><dd>' + esc(c[1]) + '</dd></div>'; }).join('') +
      '</dl><p class="stats-note">' + esc(u.statsNote) + (s.fetchedAt ? ' · ' + esc(u.statsAsOf) + ' ' + esc(fmtDate(s.fetchedAt, true)) : '') +
      (d.stats.url ? ' · <a href="' + esc(d.stats.url) + '" target="_blank" rel="noopener">' + esc(u.viewOnRoblox) + '</a>' : '') + '</p></div>';
  }
  function loadStats() {
    S.items.forEach(function (d) {
      if (!d.stats || statsCache[d.stats.src] || !window.fetch) return;
      fetch(d.stats.src + '?t=' + Math.floor(Date.now() / 600000))
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function (j) {
          statsCache[d.stats.src] = j;
          [].slice.call(document.querySelectorAll('[data-stats]')).forEach(function (el) {
            if (el.getAttribute('data-stats') === d.stats.src) el.outerHTML = statsBlock(d);
          });
        })
        .catch(function () { /* fichier absent (ex. ouverture locale) : on garde les tirets */ });
    });
  }

  function card(d, i, kind) {
    var u = ui();
    var state = d.state ? '<span class="badge st-' + d.state + '">' + esc(u['state' + d.state.charAt(0).toUpperCase() + d.state.slice(1)]) + '</span>' : '';
    var eyebrow = (kind ? '<span>' + esc(kind) + '</span>' : (d.eyebrow ? '<span>' + esc(t(d.eyebrow)) + '</span>' : '')) +
      (d.status ? '<span class="badge' + (d.live ? ' live' : '') + '">' + esc(t(d.status)) + '</span>' : '') + state +
      (d.category ? '<span class="badge cat">' + esc(u['cat' + d.category.charAt(0).toUpperCase() + d.category.slice(1)]) + '</span>' : '') +
      (d.placeholder ? '<span class="badge todo">' + esc(u.placeholder) + '</span>' : '');
    var tags = t(d.tags) || [];
    var more = ('more' in d) ? '<a class="more"' + (d.more ? ' href="' + esc(d.more) + '" target="_blank" rel="noopener"' : ' aria-disabled="true" title="' + esc(u.toAdd) + '"') + '>' + esc(u.discover) + '</a>' : '';
    var media = d.img ? '<img src="' + esc(d.img) + '" alt="' + esc(t(d.title)) + '" loading="lazy">' : art(d.art);
    var mcls = d.img ? ' has-img' + (d.fit === 'contain' || d.fit === 'wide' ? ' contain' : '') + (d.fit === 'wide' ? ' wide' : '') + (d.fit === 'paper' ? ' paper' : '') : '';
    var mstyle = d.img ? ' style="--img:url(\'' + esc(d.img) + '\')"' : '';
    return '<article class="item' + (i % 2 ? ' flip' : '') + '"><div class="item-body">' +
      (eyebrow ? '<div class="eyebrow">' + eyebrow + '</div>' : '') +
      '<h3>' + esc(t(d.title)) + '</h3>' + (d.role ? '<p class="role">' + esc(t(d.role)) + '</p>' : '') +
      descHtml(t(d.desc)) +
      (tags.length ? '<ul class="tags">' + tags.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') +
      more + '</div><div class="item-media' + mcls + '"' + mstyle + '>' + media + '</div>' + (d.stats ? statsBlock(d) : '') + '</article>';
  }
  function simpleList(arr) { return '<div class="stack">' + arr.map(function (d, i) { return card(d, i); }).join('') + '</div>'; }

  /* ---------- accueil ---------- */
  function home() {
    var u = ui(), c = S.cfg;
    var avatar = c.photo ? '<img src="' + esc(c.photo) + '" alt="Maël Bargel">' : 'MB';
    var tiles = S.pages.filter(function (p) { return p.id !== 'home'; }).map(function (p) {
      return '<a class="tile" href="' + p.href + '"><span class="ico"><svg viewBox="0 0 120 120" aria-hidden="true">' + (ART[p.art] || '') + '</svg></span>' +
        '<h3>' + esc(t(p.title)) + '</h3><p>' + esc(t(S.tileText[p.id])) + '</p></a>';
    }).join('');
    return '<section class="hero"><div class="hero-l"><article class="profile"><div class="profile-top">' +
      '<div class="avatar" role="img" aria-label="Maël Bargel">' + avatar + '</div>' +
      '<h1>Maël BARGEL <small>e-portfolio</small></h1><hr class="rule">' +
      '<p class="sub">' + esc(u.role) + '</p><p class="dept">' + esc(u.dept) + '</p></div></article></div>' +
      '<div class="hero-r"><div class="hero-r-in"><h2>' + esc(u.welcome) + '</h2>' +
      '<p class="intro">' + t(S.intro) + '</p><p class="lead">' + esc(t(S.portfolioIntro)) + '</p></div></div></section>' +
      '<div class="wrap explore"><h2>' + esc(u.explore) + '</h2><div class="tiles">' + tiles + '</div></div>';
  }

  /* ---------- projets ---------- */
  function projets() {
    var u = ui();
    var count = function (k) { return k === 'all' ? S.items.length : S.items.filter(function (x) { return x.type === k; }).length; };
    var tab = function (k, label) {
      return '<button type="button" role="tab" data-filter="' + k + '" aria-selected="' + (filter === k) + '">' + esc(label) + ' <span>' + count(k) + '</span></button>';
    };
    var list = S.items.filter(function (x) { return filter === 'all' || x.type === filter; });
    var body = list.length
      ? list.map(function (d, i) { return card(d, i, d.type === 'projet' ? u.kindProject : u.kindExperience); }).join('')
      : '<div class="empty"><b>' + esc(filter === 'experience' ? u.emptyExperience : u.emptyProject) + '</b>' + esc(u.emptyHint) + '</div>';
    return '<div class="tabs" role="tablist">' + tab('all', u.all) + tab('projet', u.projects) + tab('experience', u.experiences) + '</div>' +
      '<div class="stack">' + body + '</div>';
  }

  /* ---------- mobilités : carte ---------- */
  var STATES = ['done', 'live', 'plan'];
  function stateLabel(s) { return ui()['state' + s.charAt(0).toUpperCase() + s.slice(1)]; }
  function mobById(id) { return S.mobilites.filter(function (m) { return m.id === id; })[0]; }
  function visibleMobs() { return S.mobilites.filter(function (m) { return !hiddenStates[m.state]; }); }
  function mobLabel(m) { return t(m.place) + ' – ' + t(m.title); }

  function mobilites() {
    var u = ui();
    var leg = STATES.map(function (s) {
      var n = S.mobilites.filter(function (m) { return m.state === s; }).length;
      return '<button type="button" class="leg" data-leg="' + s + '" aria-pressed="' + (!hiddenStates[s]) + '"><i class="dot st-' + s + '"></i>' + esc(stateLabel(s)) + ' <span>' + n + '</span></button>';
    }).join('');
    return '<div class="map-legend" role="group" aria-label="' + esc(u.mapLabel) + '">' + leg + '</div>' +
      '<div id="mapHost"></div><p class="map-tip">' + esc(u.mapTip) + '</p>' +
      '<div class="chips" id="chips" role="group" aria-label="' + esc(u.places) + '"></div>' +
      '<div class="map-detail" id="mapDetail" aria-live="polite"></div>';
  }
  function renderChips() {
    var el = document.getElementById('chips');
    if (!el) return;
    el.innerHTML = visibleMobs().map(function (m) {
      return '<button type="button" class="chip" data-chip="' + esc(m.id) + '" aria-pressed="' + (m.id === selectedMob) + '"><i class="dot st-' + m.state + '"></i>' + esc(mobLabel(m)) + '</button>';
    }).join('');
  }
  function renderDetail() {
    var el = document.getElementById('mapDetail');
    if (!el) return;
    var m = selectedMob && mobById(selectedMob);
    el.innerHTML = m
      ? '<div class="detail-wrap"><button type="button" class="detail-close" data-close="1" aria-label="' + esc(ui().closeCard) + '">' + ICON.close + '</button>' + card(m, 0) + '</div>'
      : '<div class="empty">' + esc(ui().mapHint) + '</div>';
  }
  function selectMob(id) {
    selectedMob = id;
    if (mapApi) mapApi.select(id);
    renderChips(); renderDetail();
    var d = document.getElementById('mapDetail');
    if (d && d.scrollIntoView) { try { d.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) { /* ignore */ } }
  }
  function mountMap() {
    var host = document.getElementById('mapHost');
    if (!host || !window.WorldMap) return;
    var u = ui();
    if (selectedMob && !visibleMobs().some(function (m) { return m.id === selectedMob; })) selectedMob = null;
    mapApi = window.WorldMap.create(host, {
      points: visibleMobs().map(function (m) { return { id: m.id, state: m.state, lat: m.lat, lon: m.lon, label: mobLabel(m) + ' (' + stateLabel(m.state) + ')' }; }),
      selected: selectedMob, view: mapView,
      labels: { map: u.mapLabel, zoomIn: u.zoomIn, zoomOut: u.zoomOut, reset: u.zoomReset },
      onSelect: selectMob,
      onView: function (v) { mapView = v; }
    });
    renderChips(); renderDetail();
  }

  /* ---------- carrière : CV, vidéos, LinkedIn ---------- */
  function ytId(u) {
    var m = String(u || '').match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    return m ? m[1] : null;
  }
  function videoBlock(src, title, label, dur) {
    var yt = ytId(src);
    if (yt) {
      return '<figure class="vid"><div class="video blank"><button type="button" class="yt-play" data-yt="' + yt + '" data-title="' + esc(label) + '" aria-label="' + esc(label) + '"><span class="play">' + ICON.play + '</span></button></div>' +
        '<figcaption><h3>' + esc(title) + '</h3><a class="link-u"' + linkAttrs(src) + '>' + esc(ui().watchYoutube) + '</a></figcaption></figure>';
    }
    var inner = src
      ? '<video controls preload="metadata" aria-label="' + esc(label) + '"><source src="' + esc(src) + '"></video>'
      : '<div class="play">' + ICON.play + '</div>' + (dur ? '<div class="video-bar"><span>00:00</span><i></i><span>' + dur + '</span></div>' : '');
    return '<figure class="vid"><div class="video' + (src ? '' : ' blank') + '"' + (src ? '' : ' role="img" aria-label="' + esc(label) + '"') + '>' + inner + '</div><figcaption><h3>' + esc(title) + '</h3></figcaption></figure>';
  }
  function carriere() {
    var u = ui(), c = S.cfg;
    var doc = function (key, descKey) {
      return '<article class="doc"><span class="doc-ico">' + ICON.doc + '</span><div><h3>' + esc(u[key]) + '</h3><p>' + esc(u[descKey]) + '</p></div>' +
        '<a class="btn"' + fileAttrs(c[key]) + '>' + esc(u.download) + ICON.dl + '</a></article>';
    };
    return '<section class="sec"><h2 class="sec-title">' + esc(u.secCv) + '</h2><div class="docs">' + doc('cvFr', 'cvFrDesc') + doc('cvEn', 'cvEnDesc') + '</div></section>' +
      '<section class="sec"><h2 class="sec-title">' + esc(u.secVideos) + '</h2><div class="videos">' +
        videoBlock(c.videoPitch, u.pitchTitle, u.pitchLabel, '02:56') + videoBlock(c.videoJp, u.jpTitle, u.jpLabel, '') + '</div></section>' +
      '<section class="sec"><h2 class="sec-title">' + esc(u.secLinkedin) + '</h2>' +
        '<article class="li-card"><span class="li-ico">' + ICON.linkedin + '</span><div><h3>Maël BARGEL</h3><p>' + esc(u.linkedinText) + '</p></div>' +
        '<a class="btn"' + linkAttrs(c.linkedin) + '>' + esc(u.openProfile) + '</a></article></section>';
  }

  /* ---------- centres d'intérêts ---------- */
  function interets() {
    return simpleList(S.interets);
  }

  function inner(p) {
    var body = { projets: projets, mobilites: mobilites, carriere: carriere,
                 engagement: function () { return simpleList(S.civil); }, interets: interets }[p.id]();
    return '<div class="pagehead"><div class="wrap"><h1>' + esc(t(p.title)) + '</h1><p>' + esc(t(p.intro)) + '</p></div></div>' +
      '<div class="wrap content">' + body + '</div>';
  }

  /* ---------- rendu ---------- */
  function render() {
    var p = S.pages.filter(function (x) { return x.id === page; })[0] || S.pages[0];
    document.documentElement.lang = lang;
    document.title = (p.id === 'home' ? 'e-portfolio' : t(p.title)) + ' – Maël BARGEL';
    mapApi = null;
    app.innerHTML = header() + '<main>' + (p.id === 'home' ? home() : inner(p)) + '</main>' + footer();
    if (p.id === 'mobilites') mountMap();
    if (p.id === 'projets') loadStats();
  }

  app.addEventListener('click', function (e) {
    var dis = e.target.closest('[aria-disabled="true"]');
    if (dis) { e.preventDefault(); return; }
    var l = e.target.closest('[data-lang]');
    if (l) { lang = l.dataset.lang; store.set('lang', lang); menuOpen = false; render(); return; }
    var f = e.target.closest('[data-filter]');
    if (f) { filter = f.dataset.filter; render(); return; }
    var g = e.target.closest('[data-leg]');
    if (g) { hiddenStates[g.dataset.leg] = !hiddenStates[g.dataset.leg]; render(); return; }
    var yt = e.target.closest('[data-yt]');
    if (yt) {
      yt.parentNode.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + yt.dataset.yt + '?autoplay=1&rel=0" title="' + esc(yt.dataset.title) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
      return;
    }
    var ch = e.target.closest('[data-chip]');
    if (ch) { selectMob(ch.dataset.chip); return; }
    if (e.target.closest('[data-close]')) {
      selectedMob = null;
      if (mapApi) mapApi.clear();
      renderChips(); renderDetail();
      return;
    }
    var a = e.target.closest('[data-act]');
    if (!a) return;
    if (a.dataset.act === 'menu') { menuOpen = !menuOpen; render(); }
    if (a.dataset.act === 'theme') {
      var root = document.documentElement;
      var dark = root.dataset.theme ? root.dataset.theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.dataset.theme = dark ? 'light' : 'dark';
      store.set('theme', root.dataset.theme);
    }
  });

  render();
})();
