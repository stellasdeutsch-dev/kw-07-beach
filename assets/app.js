/* Сайт 07: разметка блоков. Данные в content.js, стиль в style.css. */
(function () {
  "use strict";
  var C = window.CONTENT;
  var PAGE = window.PAGE || "main";            // "main" = с рекламой, "lesson" = без
  var BASE = window.BASE || "";                // "" для /, "../" для /lesson/
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- helpers ---------- */
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function rich(s) {                            // **bold**, [[gold]], | -> <br>
    return esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\[\[(.+?)\]\]/g, '<span class="gold">$1</span>').replace(/\|/g, "<br>");
  }
  function src(p) { return /^https?:/.test(p) ? p : BASE + p; }
  function link(h) { return C.links[h] || h; }
  function isExt(h) { return /^https?:/.test(link(h)); }
  function a(h) { var u = link(h); return 'href="' + esc(u) + '"' + (isExt(h) ? ' target="_blank" rel="noopener"' : ""); }
  function img(p, alt, w, h, cls, eager) {
    return '<img src="' + src(p) + '" alt="' + esc(alt || "") + '" width="' + w + '" height="' + h + '"' + (cls ? ' class="' + cls + '"' : "") + (eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async">';
  }

  var I = {
    book: '<path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v15H5.5A1.5 1.5 0 0 1 4 17.5z"/><path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v15h5.5c.8 0 1.5-.7 1.5-1.5z"/>',
    arrow: '<path d="M12 4v15"/><path d="m6 13 6 6 6-6"/>',
    cart: '<path d="M3 4h2.5l2.2 10.2a1.5 1.5 0 0 0 1.5 1.2h7.9a1.5 1.5 0 0 0 1.5-1.1L20.5 8H6.4"/><circle cx="9.5" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/>',
    chat: '<path d="M4 18.5V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H8.5z"/><path d="M8.5 9.5h7M8.5 12.5h4.5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    check: '<path d="m5 12.5 4.2 4L19 7"/>',
    cross: '<path d="m7 7 10 10M17 7 7 17"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    left: '<path d="M19 12H5"/><path d="m11 6-6 6 6 6"/>',
    right: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    star: '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
    question: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.4c-.6.3-1 .8-1 1.5v.4"/><path d="M12 16.8v.2"/>',
    expand: '<path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/>',
    pen: '<path d="M4 20l4-1 10.5-10.5a2.1 2.1 0 0 0-3-3L5 16z"/><path d="m14 7 3 3"/>',
    pin: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    formula: '<path d="M17 5H7l5 7-5 7h10"/>',
    warn: '<path d="M12 4 2.8 19.5h18.4z"/><path d="M12 10v4.5M12 17.2v.1"/>',
    asterisk: '<path d="M12 4v16M5.1 8l13.8 8M18.9 8 5.1 16"/>',
    search: '<circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/>',
    film: '<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M7.5 5v14M16.5 5v14M3.5 9.5h4M3.5 14.5h4M16.5 9.5h4M16.5 14.5h4"/>',
    note: '<path d="M5 4h14v11l-5 5H5z"/><path d="M14 20v-5h5M8.5 9h7M8.5 12.5h4"/>',
    cap: '<path d="m2.5 9.5 9.5-5 9.5 5-9.5 5z"/><path d="M6.5 11.6V16c1.6 1.6 3.6 2.4 5.5 2.4s3.9-.8 5.5-2.4v-4.4M21.5 9.5V15"/>',
    mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m3.8 7 8.2 6 8.2-6"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    sunrise: '<path d="M3 18h18M7 18a5 5 0 0 1 10 0M12 4v4M5.6 10.6 7 12M18.4 10.6 17 12M9.5 6.5 12 4l2.5 2.5"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4M8 14h2M14 14h2M8 17h2"/>',
    stack: '<path d="m12 3 9 4.5-9 4.5-9-4.5z"/><path d="m3 12 9 4.5 9-4.5M3 16.5 12 21l9-4.5"/>',
    archive: '<rect x="3" y="4" width="18" height="5" rx="1.5"/><path d="M5 9v9.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V9M10 13h4"/>',
    infinity: '<path d="M12 12c-2-2.7-3.6-4-5.5-4a4 4 0 0 0 0 8c1.9 0 3.5-1.3 5.5-4zm0 0c2 2.7 3.6 4 5.5 4a4 4 0 0 0 0-8c-1.9 0-3.5 1.3-5.5 4z"/>',
    wallet: '<path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3"/><rect x="4" y="8" width="16.5" height="11" rx="2.5"/><path d="M16 13.5h1.5"/>',
    norepeat: '<path d="M4 11V9.5A3.5 3.5 0 0 1 7.5 6H19M16 3l3 3-3 3M20 13v1.5a3.5 3.5 0 0 1-3.5 3.5H5M8 21l-3-3 3-3"/><path d="m4.5 4.5 15 15"/>',
    map: '<path d="m9 4-5.5 2v14L9 18l6 2 5.5-2V4L15 6z"/><path d="M9 4v14M15 6v14"/>',
    abc: '<path d="M3.5 18 7.5 6l4 12M4.8 14h5.4"/><path d="M14.5 6h3.2a2.8 2.8 0 0 1 0 5.6h-3.2zM14.5 11.6h3.8a3.2 3.2 0 0 1 0 6.4h-3.8z"/>',
    spark: '<path d="M11 3.5c.6 4.2 2.3 5.9 6.5 6.5-4.2.6-5.9 2.3-6.5 6.5-.6-4.2-2.3-5.9-6.5-6.5 4.2-.6 5.9-2.3 6.5-6.5z"/><path d="M18.5 15.5c.3 1.8 1 2.5 2.8 2.8-1.8.3-2.5 1-2.8 2.8-.3-1.8-1-2.5-2.8-2.8 1.8-.3 2.5-1 2.8-2.8z"/>',
    timer: '<circle cx="12" cy="13.5" r="7"/><path d="M12 13.5V10M9.5 3h5M18.5 6.5l1.2-1.2"/>',
    devices: '<rect x="2.5" y="5" width="12" height="9" rx="1.8"/><path d="M1.5 18h14"/><rect x="17" y="8" width="5.5" height="11" rx="1.4"/>',
    backpack: '<path d="M7 9a5 5 0 0 1 10 0v10.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 19.5z"/><path d="M10 4.5V3.5h4v1M7 13h10M10.5 13v2.5h3V13"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.4 3.5 5.2 3.5 8.5s-1.1 6.1-3.5 8.5c-2.4-2.4-3.5-5.2-3.5-8.5s1.1-6.1 3.5-8.5z"/>',
    speak: '<path d="M4 18.5V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H8.5z"/><path d="M9 10h.01M12 10h.01M15 10h.01"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    cursor: '<path d="m5 4 13 6-5.5 1.8L10.5 17.5z"/><path d="m13 12 5 5"/>',
    exam: '<rect x="5" y="4.5" width="14" height="16" rx="2"/><path d="M9 4.5V3h6v1.5M8.5 12l2.2 2.2 4.8-4.7"/>',
    briefcase: '<rect x="3" y="7" width="18" height="12.5" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18"/>',
    suitcase: '<rect x="5" y="7" width="14" height="12.5" rx="2.5"/><path d="M9.5 7V4.5h5V7M9 7v12.5M15 7v12.5"/>',
    tv: '<rect x="3" y="5" width="18" height="12" rx="2.5"/><path d="M8 21h8M12 17v4M10.5 9l4 2-4 2z"/>',
    award: '<circle cx="12" cy="9" r="5.5"/><path d="m8.5 13.5-1.5 7 5-2.5 5 2.5-1.5-7"/>',
    home: '<path d="M4 11 12 4l8 7v8.5a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"/>',
    user: '<circle cx="12" cy="8.5" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
    coin: '<circle cx="12" cy="12" r="8.5"/><path d="M14.8 8.8a3.6 3.6 0 1 0 0 6.4M7.8 11h5M7.8 13.2h5"/>',
    laptop: '<rect x="4.5" y="5" width="15" height="10.5" rx="1.8"/><path d="M2.5 19h19"/>',
    levels: '<path d="M5 20v-5M10 20v-9M15 20V7M20 20V3.5"/>',
    shield: '<path d="M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6z"/><path d="m8.8 12 2.3 2.3 4.2-4.3"/>',
    sprout: '<path d="M12 20v-8M12 12c0-4-2.5-6.5-7-6.5 0 4.5 2.5 6.5 7 6.5zM12 14c0-3.5 2.2-5.8 6.5-5.8 0 4-2.2 5.8-6.5 5.8z"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 8.5-8.5M16 7l2.5 2.5M14 9l2 2"/>',
    wave: '<path d="M2.5 15c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 3-1.5M2.5 19c2 0 2-1.5 4-1.5s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 3-1.5"/><circle cx="12" cy="7.5" r="3"/>'
  };
  function count(html) {                       // первое число -> счётчик (в разметке сразу итоговое число)
    return html.replace(/\d+/, function (n) { return '<span class="count" data-to="' + n + '">' + n + "</span>"; });
  }
  function icon(n, cls) { return '<svg class="ic' + (cls ? " " + cls : "") + '" data-icon="' + n + '" viewBox="0 0 24 24" aria-hidden="true">' + I[n] + "</svg>"; }

  function button(b, cls) {
    if (!b) return "";
    var ic = b.icon || (isExt(b.href) ? "cart" : "arrow");
    return '<a class="btn' + (cls ? " " + cls : "") + '" ' + a(b.href) + '><span class="btn__ic">' + icon(ic) + '</span><span class="btn__tx">' + esc(b.text) + "</span></a>";
  }
  function row(r) {
    if (!r) return "";
    var b = PAGE === "lesson" && r.lessonButton ? r.lessonButton : r.button;
    var btns = r.buttons ? '<div class="row__btns">' + r.buttons.map(function (x) { return button(x); }).join("") + "</div>" : button(b);
    return '<div class="row reveal"><p class="row__tx">' + rich(r.text) + "</p>" + btns + "</div>";
  }
  function h2(t, cls) { return '<h2 class="h2' + (cls ? " " + cls : "") + ' reveal">' + rich(t) + "</h2>"; }
  function sub(t) { return t ? '<p class="sub reveal">' + rich(t) + "</p>" : ""; }
  function ring(text, id) {
    return '<svg class="ring" viewBox="0 0 200 200" aria-hidden="true"><defs><path id="' + id + '" d="M100,100 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0"/></defs><text><textPath href="#' + id + '">' + esc(text) + "</textPath></text></svg>";
  }
  function scallop(cls) {               // волнистый круг как у бейджа в образце
    var n = 22, r1 = 78, r2 = 82, d = "";
    for (var i = 0; i <= n * 8; i++) {
      var t = (i / (n * 8)) * Math.PI * 2, r = (r1 + r2) / 2 + ((r2 - r1) / 2) * Math.cos(t * n);
      d += (i ? "L" : "M") + (100 + r * Math.cos(t)).toFixed(2) + "," + (100 + r * Math.sin(t)).toFixed(2);
    }
    return '<svg class="' + cls + '" viewBox="0 0 200 200" aria-hidden="true"><path d="' + d + 'Z"/></svg>';
  }

  /* ---------- blocks ---------- */
  var R = {};

  R.hero = function (b) {
    var lines = b.title.map(function (l) { return "<span>" + rich(l) + "</span>"; }).join("");
    var last = b.title.length - 1;
    lines = b.title.map(function (l, i) {
      return '<span class="hero__line reveal" style="--d:' + (120 + i * 110) + 'ms">' + rich(l) + (i === last && b.pill ? '<em class="pill">' + esc(b.pill) + "</em>" : "") + "</span>";
    }).join("");
    return '<section class="hero" id="' + b.id + '" data-block="Первый экран">' +
      '<div class="hero__bg">' + img(b.image, b.imageAlt, 1280, 720, "", true) + "</div>" +
      '<div class="wrap hero__in">' +
        '<div class="badge" aria-hidden="true">' + ring(b.badge.ring, "ring-hero") + scallop("badge__shape") +
          '<span class="badge__big">' + esc(b.badge.big) + '</span><span class="badge__small">' + rich(b.badge.small) + "</span></div>" +
        '<div class="hero__copy"><h1 class="hero__title">' + lines + "</h1>" + button(b.button, "btn--hero reveal") + "</div>" +
        (b.author ? '<figure class="hero__author reveal">' + img(b.author.img, b.author.alt, 600, 800, "", true) + "</figure>" : "") +
      "</div></section>";
  };

  R.audience = function (b) {
    var cards = b.cards.map(function (c, i) {
      return '<li class="who reveal" style="--d:' + i * 70 + 'ms"><div class="who__card"><div class="who__pic">' + img(c.img, c.alt, 300, 284) + '</div><p class="who__tx">' + esc(c.text) + '</p></div><div class="who__base"></div></li>';
    }).join("");
    return '<section class="sec sec--panel sec--who" id="' + b.id + '" data-block="Кому пригодится"><div class="wrap">' + h2(b.title) + sub(b.subtitle) +
      '<ul class="who-list">' + cards + "</ul>" + row(b.row) + "</div></section>";
  };

  R.points = function (b) {
    function card(t, i) {
      var n = (i + 1 < 10 ? "0" : "") + (i + 1);
      return '<li class="point reveal" style="--d:' + (i % 3) * 80 + 'ms"><span class="num">' + n + '</span><span class="pt__ic">' + icon(b.icons[i]) + '</span><p>' + rich(t) + "</p></li>";
    }
    var left = [], right = [];
    b.items.forEach(function (t, i) { (i % 2 ? right : left).push(card(t, i)); });
    var p = b.phone;
    var msgs = p.messages.map(function (m) {
      return '<div class="msg msg--' + m.from + '"><span lang="' + esc(C.meta.exampleLang || "en") + '">' + esc(m.text) + "</span>" + (m.note ? "<small>" + esc(m.note) + "</small>" : "") + "</div>";
    }).join("");
    var phone = '<div class="phone reveal">' + img(p.image, p.alt, 540, 980, "phone__img") +
      '<div class="phone__screen"><div class="chat__head"><span class="chat__ava">' + icon("chat") + '</span><span class="chat__name">' + esc(p.chatName) + '</span></div><div class="chat__body">' + msgs + "</div></div></div>";
    var pills = b.pills ? '<div class="pills reveal"><span class="opill">' + esc(b.pills[0]) + '</span><p class="pills__note">' + rich(b.pillsNote) + '</p><span class="opill">' + esc(b.pills[1]) + "</span></div>" : "";
    return '<section class="sec sec--points" id="' + b.id + '" data-block="Главное за минуту"><div class="wrap">' + h2(b.title) +
      '<div class="points"><ul class="points__col">' + left.join("") + "</ul>" + phone + '<ul class="points__col">' + right.join("") + "</ul></div>" + pills + "</div></section>";
  };

  R.checks = function (b) {
    var cards = b.cards.map(function (t, i) {
      return '<li class="check reveal" style="--d:' + (i % 2) * 80 + 'ms"><span class="check__ic">' + icon(b.icons[i]) + "</span><p>" + rich(t) + "</p></li>";
    }).join("");
    return '<section class="sec sec--checks" id="' + b.id + '" data-block="Тебе пригодится"><div class="checks__bg">' + img(b.image, b.imageAlt, 1280, 720) + '</div><div class="wrap">' +
      h2(b.title, "h2--light") + '<ul class="checks">' + cards + "</ul>" + row(b.row) + "</div></section>";
  };

  R.steps = function (b) {
    var steps = b.steps.map(function (s, i) {
      return '<div class="step step--' + (i + 1) + ' reveal" style="--d:' + i * 120 + 'ms"><span class="step__tab">' + esc(s.num) + '</span><div class="step__card">' + img(s.img, s.alt, 300, 260, "step__img") +
        '<div><h3 class="step__t">' + esc(s.title) + '</h3><p class="step__d">' + rich(s.text) + '</p><p class="step__time">' + icon(s.icon) + esc(s.time) + "</p></div></div>" +
        (i < b.steps.length - 1 ? '<svg class="step__arrow step__arrow--d" viewBox="0 0 80 96" aria-hidden="true"><path pathLength="1" d="M4 8C40 6 66 26 66 84"/><path pathLength="1" class="step__head" d="m56 74 10 12 10-12"/></svg>' +
          '<svg class="step__arrow step__arrow--m" viewBox="0 0 24 40" aria-hidden="true"><path pathLength="1" d="M12 3v32"/><path pathLength="1" class="step__head" d="m5 27 7 8 7-8"/></svg>' : "") + "</div>";
    }).join("");
    return '<section class="sec sec--panel sec--steps" id="' + b.id + '" data-block="Три шага"><div class="wrap">' +
      '<div class="steps"><div class="steps__stage">' + img(b.podium, "", 747, 498, "steps__podium") + steps + "</div>" + h2(b.title, "h2--steps") + "</div>" + row(b.row) + "</div></section>";
  };

  R.gallery = function (b) {
    var pages = b.pages.map(function (pg, pi) {
      return '<div class="gpage' + (pi ? "" : " is-on") + '" data-page="' + pi + '"' + (pi ? " hidden" : "") + ">" + pg.map(function (c) {
        return '<figure class="shot"><button class="shot__btn" type="button" data-full="' + src(c.img) + '" data-cap="' + esc(c.caption) + '" aria-label="Открыть крупно: ' + esc(c.caption) + '">' +
          img(c.img, c.caption, 720, 1000).replace(' loading="lazy"', "") + '<span class="shot__tag">' + esc(c.tag) + '</span><span class="shot__zoom">' + icon("expand") + "</span></button><figcaption>" + esc(c.caption) + "</figcaption></figure>";
      }).join("") + "</div>";
    }).join("");
    var dots = b.pages.map(function (_, i) { return '<button type="button" class="dot' + (i ? "" : " is-on") + '" data-go="' + i + '" aria-label="Страница ' + (i + 1) + '"></button>'; }).join("");
    var rib = new Array(8).join(b.ribbon);
    return '<section class="sec sec--gallery" id="' + b.id + '" data-block="Реклама платформы"><div class="ribbon" aria-hidden="true"><span>' + esc(rib) + '</span></div><div class="ribbon ribbon--2" aria-hidden="true"><span>' + esc(rib) + '</span></div><div class="wrap">' +
      h2(b.title) + sub(b.subtitle) + '<div class="gallery reveal">' + pages + '</div><div class="gnav reveal"><button type="button" class="gnav__arr" data-step="-1" aria-label="Назад">' + icon("left") + "</button>" + dots +
      '<button type="button" class="gnav__arr" data-step="1" aria-label="Дальше">' + icon("right") + "</button></div>" +
      '<div class="facts reveal"><div class="facts__l"><p class="facts__big"><span class="facts__ic">' + icon(b.left.icon) + "</span><span>" + count(esc(b.left.big)) + "</span>" + '</p><p class="facts__sub">' + rich(b.left.sub) + '</p><a class="glink" ' + a(b.left.link.href) + ">" + esc(b.left.link.text) + " " + icon("right") + "</a></div>" +
      '<p class="facts__box">' + rich(b.box) + '</p><div class="facts__r"><span class="facts__ic">' + icon(b.right.icon) + "</span><p>" + count(rich(b.right.text)) + '</p><a class="glink" ' + a(b.right.link.href) + ">" + esc(b.right.link.text) + " " + icon("right") + "</a></div></div>" +
      "</div></section>";
  };

  R.pains = function (b) {
    var cards = b.cards.map(function (c, i) {
      return '<li class="pain reveal" style="--d:' + i * 90 + 'ms"><span class="pain__x">' + icon("cross") + '</span><h3>' + rich(c.title) + '</h3><p>' + rich(c.text) + "</p>" + img(c.img, c.alt, 380, 356, "pain__img") + "</li>";
    }).join("");
    return '<section class="sec sec--pains" id="' + b.id + '" data-block="Честный блок"><div class="wrap">' + h2(b.title) + sub(b.subtitle) + '<ul class="pains">' + cards + "</ul></div></section>";
  };

  R.promise = function (b) {
    return '<section class="sec sec--promise" id="' + b.id + '" data-block="' + (b.lesson ? "Концовка" : "Цена") + '"><div class="wrap"><div class="promise reveal">' + img(b.stars, "Пять золотых звёзд", 412, 206, "promise__stars") +
      '<h2 class="promise__t">' + rich(b.title) + '</h2><p class="promise__d">' + rich(b.text) + "</p>" +
      (b.chips ? '<ul class="chips">' + b.chips.map(function (c, i) { return '<li style="--d:' + (500 + i * 90) + 'ms">' + icon(c.icon) + "<span>" + esc(c.text) + "</span></li>"; }).join("") + "</ul>" : "") + "</div></div></section>";
  };

  R.includes = function (b) {
    function list(items, cls, ics) { return '<ul class="inc__list ' + cls + '">' + items.map(function (t, i) { return '<li style="--d:' + i * 70 + 'ms"><span class="inc__ic">' + icon(ics[i]) + "</span><span>" + rich(t) + "</span></li>"; }).join("") + "</ul>"; }
    return '<section class="sec sec--includes" id="' + b.id + '" data-block="Что есть и кому подойдёт"><div class="wrap">' + h2(b.title) +
      '<div class="inc reveal"><div class="inc__card inc__card--w"><p class="inc__name">' + rich(b.left.name) + "</p>" + list(b.left.items, "inc__list--gold", b.left.icons) + "</div>" +
      '<div class="inc__card inc__card--b"><span class="inc__star">' + icon("star") + '</span><p class="inc__intro">' + rich(b.right.intro) + "</p>" + list(b.right.items, "inc__list--blue", b.right.icons) + "</div></div>" +
      '<div class="ticket reveal"><span>' + esc(b.ticket.left) + '</span><i></i><span>' + esc(b.ticket.right) + '</span><small>' + esc(b.ticket.note) + "</small></div></div></section>";
  };

  R.promo = function (b) {
    return '<section class="promo" id="' + b.id + '" data-block="Купить"><div class="promo__bg">' + img(b.image, b.imageAlt, 1280, 720) + '</div><div class="wrap promo__in"><div class="pbadge reveal">' +
      ring(b.ring, "ring-promo") + scallop("pbadge__shape") + '<p class="pbadge__t">' + rich(b.title) + '</p><div class="pbadge__btns">' + b.buttons.map(function (x) { return button(x, "btn--xs"); }).join("") + "</div></div></div></section>";
  };

  R.bonus = function (b) {
    var cards = b.cards.map(function (c, i) {
      return '<li class="bonus reveal" style="--d:' + (i % 2) * 90 + 'ms"><span class="bonus__n">' + esc(c.num) + '</span><p>' + rich(c.text) + "</p>" + img(c.img, c.alt, 340, 344, "bonus__img") + "</li>";
    }).join("");
    return '<section class="sec sec--bonus" id="' + b.id + '" data-block="Ещё внутри"><div class="wrap">' + h2(b.title) + sub(b.subtitle) + '<ul class="bonuses">' + cards + "</ul></div></section>";
  };

  R.faq = function (b) {
    var items = b.items.map(function (it, i) {
      return '<div class="qa reveal"><button class="qa__q" type="button" aria-expanded="false" aria-controls="qa-' + i + '" id="qb-' + i + '"><span class="qa__ic">' + icon(it.icon || "question") + "</span><span class=\"qa__t\">" + esc(it.q) + "</span>" + icon("chevron", "qa__ch") + "</button>" +
        '<div class="qa__a" id="qa-' + i + '" role="region" aria-labelledby="qb-' + i + '"><div><p>' + rich(it.a) + "</p></div></div></div>";
    }).join("");
    return '<section class="sec sec--panel sec--faq" id="' + b.id + '" data-block="Вопросы"><div class="wrap">' + h2(b.title) + (b.image ? '<figure class="faq__pic reveal">' + img(b.image, b.imageAlt, b.imageSize[0], b.imageSize[1]) + "</figure>" : "") + '<div class="faq">' + items + "</div>" + row(b.row) + "</div></section>";
  };

  /* ---------- page ---------- */
  function visible(x) { return PAGE === "lesson" ? !x.ad : !x.lesson; }

  function header() {
    var h = C.header;
    var menu = h.menu.filter(visible).map(function (m) { return '<li><a href="' + m.href + '">' + esc(m.text) + "</a></li>"; }).join("");
    var contact = PAGE === "lesson" || !h.contactLink || !C.links[h.contactLink] ? "" : '<a class="hdr__ic" ' + a(h.contactLink) + ' aria-label="' + esc(h.contactLabel) + '">' + icon("chat") + "</a>";
    return '<header class="hdr" data-block="Шапка"><div class="wrap hdr__in"><a class="hdr__logo" href="#top">' + esc(h.logo) + '</a><div class="hdr__r">' + contact +
      '<button class="hdr__ic hdr__burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Меню">' + icon("menu", "ic-open") + icon("close", "ic-close") + "</button></div></div>" +
      '<nav class="menu" id="menu" hidden><ul>' + menu + "</ul></nav></header>";
  }

  var html = header() + "<main>" + C.blocks.filter(visible).map(function (b) { return R[b.type] ? R[b.type](b) : ""; }).join("") + "</main>" +
    '<footer class="ftr" data-block="Подвал"><div class="wrap">' + icon("wave", "ftr__ic") + esc(C.footer) + "</div></footer>" +
    '<div class="lb" hidden role="dialog" aria-modal="true" aria-label="Скриншот крупно"><button class="lb__x" type="button" aria-label="Закрыть">' + icon("close") + '</button><figure><figcaption></figcaption></figure></div>';
  document.getElementById("app").innerHTML = html;
  document.title = PAGE === "lesson" ? C.meta.lessonTitle : C.meta.title;

  /* ---------- interactions ---------- */
  var root = document.getElementById("app");

  // меню
  var burger = root.querySelector(".hdr__burger"), menuEl = root.querySelector(".menu");
  function setMenu(open) { burger.setAttribute("aria-expanded", open); menuEl.hidden = !open; root.querySelector(".hdr").classList.toggle("is-open", open); }
  burger.addEventListener("click", function () { setMenu(menuEl.hidden); });
  menuEl.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });

  // FAQ
  root.querySelectorAll(".qa__q").forEach(function (q) {
    q.addEventListener("click", function () {
      var open = q.getAttribute("aria-expanded") !== "true";
      q.setAttribute("aria-expanded", open);
      q.parentNode.classList.toggle("is-open", open);
    });
  });
  var firstQ = root.querySelectorAll(".qa__q")[1];       // в образце открыт второй вопрос
  if (firstQ) firstQ.click();

  // галерея: страницы по 3 карточки, без горизонтальной прокрутки
  var gal = root.querySelector(".gallery");
  if (gal) {
    var pgs = gal.querySelectorAll(".gpage"), dots = root.querySelectorAll(".dot"), cur = 0;
    var go = function (n) {
      n = (n + pgs.length) % pgs.length; if (n === cur) return;
      pgs[cur].classList.remove("is-on"); pgs[cur].hidden = true; dots[cur].classList.remove("is-on");
      cur = n; pgs[cur].hidden = false; void pgs[cur].offsetWidth; pgs[cur].classList.add("is-on"); dots[cur].classList.add("is-on");
    };
    root.querySelectorAll("[data-go]").forEach(function (d) { d.addEventListener("click", function () { go(+d.dataset.go); }); });
    root.querySelectorAll("[data-step]").forEach(function (d) { d.addEventListener("click", function () { go(cur + +d.dataset.step); }); });
  }

  // лайтбокс
  var lb = root.querySelector(".lb"), lbFig = lb.querySelector("figure"), lbCap = lb.querySelector("figcaption"), lbImg = null, lastBtn = null;
  function closeLb() { lb.hidden = true; if (lbImg) { lbImg.remove(); lbImg = null; } document.documentElement.classList.remove("no-scroll"); if (lastBtn) lastBtn.focus(); }
  root.addEventListener("click", function (e) {
    var s = e.target.closest(".shot__btn");
    if (s) { lastBtn = s; if (!lbImg) { lbImg = document.createElement("img"); lbFig.insertBefore(lbImg, lbCap); } lbImg.src = s.dataset.full; lbImg.alt = s.dataset.cap; lbCap.textContent = s.dataset.cap; lb.hidden = false; document.documentElement.classList.add("no-scroll"); lb.querySelector(".lb__x").focus(); }
  });
  lb.addEventListener("click", function (e) { if (e.target === lb || e.target.closest(".lb__x")) closeLb(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { if (!lb.hidden) closeLb(); if (!menuEl.hidden) setMenu(false); } });

  // появление при прокрутке
  function runCount(el) {
    var to = +el.dataset.to, t0 = null, dur = 1200;
    function f(t) { if (t0 === null) t0 = t; var k = Math.min(1, (t - t0) / dur); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); }
    el.textContent = "0"; requestAnimationFrame(f);
  }
  function onIn(el) { el.classList.add("is-in"); if (!reduce) el.querySelectorAll(".count").forEach(runCount); }
  var rv = root.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) { rv.forEach(function (el) { el.classList.add("is-in"); }); }
  else {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { onIn(en.target); io.unobserve(en.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    rv.forEach(function (el) { io.observe(el); });
  }
})();
