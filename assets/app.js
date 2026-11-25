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
    expand: '<path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/>'
  };
  function icon(n, cls) { return '<svg class="ic' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" aria-hidden="true">' + I[n] + "</svg>"; }

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
      return '<span class="hero__line">' + rich(l) + (i === last && b.pill ? '<em class="pill">' + esc(b.pill) + "</em>" : "") + "</span>";
    }).join("");
    return '<section class="hero" id="' + b.id + '" data-block="Первый экран">' +
      '<div class="hero__bg">' + img(b.image, b.imageAlt, 1280, 720, "", true) + "</div>" +
      '<div class="wrap hero__in">' +
        '<div class="badge" aria-hidden="true">' + ring(b.badge.ring, "ring-hero") + scallop("badge__shape") +
          '<span class="badge__big">' + esc(b.badge.big) + '</span><span class="badge__small">' + rich(b.badge.small) + "</span></div>" +
        '<div class="hero__copy"><h1 class="hero__title">' + lines + "</h1>" + button(b.button, "btn--hero") + "</div>" +
      "</div></section>";
  };

  R.audience = function (b) {
    var cards = b.cards.map(function (c, i) {
      return '<li class="who reveal" style="--d:' + i * 70 + 'ms"><div class="who__card"><div class="who__pic">' + img(c.img, c.alt, 300, 400) + '</div><p class="who__tx">' + esc(c.text) + '</p></div><div class="who__base"></div></li>';
    }).join("");
    return '<section class="sec sec--panel sec--who" id="' + b.id + '" data-block="Кому пригодится"><div class="wrap">' + h2(b.title) + sub(b.subtitle) +
      '<ul class="who-list">' + cards + "</ul>" + row(b.row) + "</div></section>";
  };

  R.points = function (b) {
    function card(t, i) {
      var n = (i + 1 < 10 ? "0" : "") + (i + 1);
      return '<li class="point reveal" style="--d:' + (i % 3) * 80 + 'ms"><span class="num">' + n + '</span><p>' + rich(t) + "</p></li>";
    }
    var left = [], right = [];
    b.items.forEach(function (t, i) { (i % 2 ? right : left).push(card(t, i)); });
    var p = b.phone;
    var msgs = p.messages.map(function (m) {
      return '<div class="msg msg--' + m.from + '"><span>' + esc(m.text) + "</span>" + (m.note ? "<small>" + esc(m.note) + "</small>" : "") + "</div>";
    }).join("");
    var phone = '<div class="phone reveal">' + img(p.image, p.alt, 520, 709, "phone__img") +
      '<div class="phone__screen"><div class="chat__head"><span class="chat__ava">' + icon("chat") + '</span><span class="chat__name">' + esc(p.chatName) + '</span></div><div class="chat__body">' + msgs + "</div></div></div>";
    var pills = b.pills ? '<div class="pills reveal"><span class="opill">' + esc(b.pills[0]) + '</span><p class="pills__note">' + rich(b.pillsNote) + '</p><span class="opill">' + esc(b.pills[1]) + "</span></div>" : "";
    return '<section class="sec sec--points" id="' + b.id + '" data-block="Главное за минуту"><div class="wrap">' + h2(b.title) +
      '<div class="points"><ul class="points__col">' + left.join("") + "</ul>" + phone + '<ul class="points__col">' + right.join("") + "</ul></div>" + pills + "</div></section>";
  };

  R.checks = function (b) {
    var cards = b.cards.map(function (t, i) {
      return '<li class="check reveal" style="--d:' + (i % 2) * 80 + 'ms"><span class="check__ic">' + icon("check") + "</span><p>" + rich(t) + "</p></li>";
    }).join("");
    return '<section class="sec sec--checks" id="' + b.id + '" data-block="Тебе пригодится"><div class="checks__bg">' + img(b.image, b.imageAlt, 1280, 720) + '</div><div class="wrap">' +
      h2(b.title, "h2--light") + '<ul class="checks">' + cards + "</ul>" + row(b.row) + "</div></section>";
  };

  R.steps = function (b) {
    var steps = b.steps.map(function (s, i) {
      return '<div class="step step--' + (i + 1) + ' reveal" style="--d:' + i * 120 + 'ms"><span class="step__tab">' + esc(s.num) + '</span><div class="step__card">' + img(s.img, s.alt, 300, 260, "step__img") +
        '<div><h3 class="step__t">' + esc(s.title) + '</h3><p class="step__d">' + rich(s.text) + '</p><p class="step__time">' + esc(s.time) + "</p></div></div></div>";
    }).join("");
    return '<section class="sec sec--panel sec--steps" id="' + b.id + '" data-block="Три шага"><div class="wrap">' +
      '<div class="steps"><div class="steps__stage">' + img(b.podium, "", 747, 498, "steps__podium") + steps + "</div>" + h2(b.title, "h2--steps") + "</div>" + row(b.row) + "</div></section>";
  };

  R.gallery = function (b) {
    var pages = b.pages.map(function (pg, pi) {
      return '<div class="gpage' + (pi ? "" : " is-on") + '" data-page="' + pi + '"' + (pi ? " hidden" : "") + ">" + pg.map(function (c) {
        return '<figure class="shot"><button class="shot__btn" type="button" data-full="' + src(c.img) + '" data-cap="' + esc(c.caption) + '" aria-label="Открыть крупно: ' + esc(c.caption) + '">' +
          img(c.img, c.caption, 720, 1000) + '<span class="shot__tag">' + esc(c.tag) + '</span><span class="shot__zoom">' + icon("expand") + "</span></button><figcaption>" + esc(c.caption) + "</figcaption></figure>";
      }).join("") + "</div>";
    }).join("");
    var dots = b.pages.map(function (_, i) { return '<button type="button" class="dot' + (i ? "" : " is-on") + '" data-go="' + i + '" aria-label="Страница ' + (i + 1) + '"></button>'; }).join("");
    var rib = new Array(8).join(b.ribbon);
    return '<section class="sec sec--gallery" id="' + b.id + '" data-block="Реклама платформы"><div class="ribbon" aria-hidden="true"><span>' + esc(rib) + '</span></div><div class="ribbon ribbon--2" aria-hidden="true"><span>' + esc(rib) + '</span></div><div class="wrap">' +
      h2(b.title) + sub(b.subtitle) + '<div class="gallery reveal">' + pages + '</div><div class="gnav reveal"><button type="button" class="gnav__arr" data-step="-1" aria-label="Назад">' + icon("left") + "</button>" + dots +
      '<button type="button" class="gnav__arr" data-step="1" aria-label="Дальше">' + icon("right") + "</button></div>" +
      '<div class="facts reveal"><div class="facts__l"><p class="facts__big">' + esc(b.left.big) + ' <span class="facts__stars">' + icon("star") + icon("star") + icon("star") + icon("star") + icon("star") + '</span></p><p class="facts__sub">' + rich(b.left.sub) + '</p><a class="glink" ' + a(b.left.link.href) + ">" + esc(b.left.link.text) + " " + icon("right") + "</a></div>" +
      '<p class="facts__box">' + rich(b.box) + '</p><div class="facts__r"><p>' + rich(b.right.text) + '</p><a class="glink" ' + a(b.right.link.href) + ">" + esc(b.right.link.text) + " " + icon("right") + "</a></div></div>" +
      "</div></section>";
  };

  R.pains = function (b) {
    var cards = b.cards.map(function (c, i) {
      return '<li class="pain reveal" style="--d:' + i * 90 + 'ms"><span class="pain__x">' + icon("cross") + '</span><h3>' + rich(c.title) + '</h3><p>' + rich(c.text) + "</p>" + img(c.img, c.alt, 360, 400, "pain__img") + "</li>";
    }).join("");
    return '<section class="sec sec--pains" id="' + b.id + '" data-block="Почему не получалось"><div class="wrap">' + h2(b.title) + sub(b.subtitle) + '<ul class="pains">' + cards + "</ul></div></section>";
  };

  R.promise = function (b) {
    return '<section class="sec sec--promise" id="' + b.id + '" data-block="' + (b.lesson ? "Концовка" : "Цена") + '"><div class="wrap"><div class="promise reveal">' + img(b.stars, "Пять золотых звёзд", 412, 206, "promise__stars") +
      '<h2 class="promise__t">' + rich(b.title) + '</h2><p class="promise__d">' + rich(b.text) + "</p></div></div></section>";
  };

  R.includes = function (b) {
    function list(items, cls) { return '<ul class="inc__list ' + cls + '">' + items.map(function (t) { return "<li>" + icon("check") + "<span>" + rich(t) + "</span></li>"; }).join("") + "</ul>"; }
    return '<section class="sec sec--includes" id="' + b.id + '" data-block="Что входит"><div class="wrap">' + h2(b.title) +
      '<div class="inc reveal"><div class="inc__card inc__card--w"><p class="inc__name">' + rich(b.left.name) + "</p>" + list(b.left.items, "inc__list--gold") + "</div>" +
      '<div class="inc__card inc__card--b"><span class="inc__star">' + icon("star") + '</span><p class="inc__intro">' + rich(b.right.intro) + "</p>" + list(b.right.items, "inc__list--blue") + "</div></div>" +
      '<div class="ticket reveal"><span>' + esc(b.ticket.left) + '</span><i></i><span>' + esc(b.ticket.right) + '</span><small>' + esc(b.ticket.note) + "</small></div></div></section>";
  };

  R.promo = function (b) {
    return '<section class="promo" id="' + b.id + '" data-block="Купить"><div class="promo__bg">' + img(b.image, b.imageAlt, 1280, 720) + '</div><div class="wrap promo__in"><div class="pbadge reveal">' +
      ring(b.ring, "ring-promo") + scallop("pbadge__shape") + '<p class="pbadge__t">' + rich(b.title) + '</p><div class="pbadge__btns">' + b.buttons.map(function (x) { return button(x, "btn--xs"); }).join("") + "</div></div></div></section>";
  };

  R.bonus = function (b) {
    var cards = b.cards.map(function (c, i) {
      return '<li class="bonus reveal" style="--d:' + (i % 2) * 90 + 'ms"><span class="bonus__n">' + esc(c.num) + '</span><p>' + rich(c.text) + "</p>" + img(c.img, c.alt, 340, 360, "bonus__img") + "</li>";
    }).join("");
    return '<section class="sec sec--bonus" id="' + b.id + '" data-block="Ещё внутри"><div class="wrap">' + h2(b.title) + sub(b.subtitle) + '<ul class="bonuses">' + cards + "</ul></div></section>";
  };

  R.faq = function (b) {
    var items = b.items.map(function (it, i) {
      return '<div class="qa reveal"><button class="qa__q" type="button" aria-expanded="false" aria-controls="qa-' + i + '" id="qb-' + i + '"><span class="qa__ic">' + icon("question") + "</span><span class=\"qa__t\">" + esc(it.q) + "</span>" + icon("chevron", "qa__ch") + "</button>" +
        '<div class="qa__a" id="qa-' + i + '" role="region" aria-labelledby="qb-' + i + '"><div><p>' + rich(it.a) + "</p></div></div></div>";
    }).join("");
    return '<section class="sec sec--panel sec--faq" id="' + b.id + '" data-block="Вопросы"><div class="wrap">' + h2(b.title) + '<div class="faq">' + items + "</div>" + row(b.row) + "</div></section>";
  };

  /* ---------- page ---------- */
  function visible(x) { return PAGE === "lesson" ? !x.ad : !x.lesson; }

  function header() {
    var h = C.header;
    var menu = h.menu.filter(visible).map(function (m) { return '<li><a href="' + m.href + '">' + esc(m.text) + "</a></li>"; }).join("");
    var contact = PAGE === "lesson" ? "" : '<a class="hdr__ic" ' + a(h.contactLink) + ' aria-label="' + esc(h.contactLabel) + '">' + icon("chat") + "</a>";
    return '<header class="hdr" data-block="Шапка"><div class="wrap hdr__in"><a class="hdr__logo" href="#top">' + esc(h.logo) + '</a><div class="hdr__r">' + contact +
      '<button class="hdr__ic hdr__burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Меню">' + icon("menu", "ic-open") + icon("close", "ic-close") + "</button></div></div>" +
      '<nav class="menu" id="menu" hidden><ul>' + menu + "</ul></nav></header>";
  }

  var html = header() + "<main>" + C.blocks.filter(visible).map(function (b) { return R[b.type] ? R[b.type](b) : ""; }).join("") + "</main>" +
    '<footer class="ftr" data-block="Подвал"><div class="wrap">' + esc(C.footer) + "</div></footer>" +
    '<div class="lb" hidden role="dialog" aria-modal="true" aria-label="Скриншот крупно"><button class="lb__x" type="button" aria-label="Закрыть">' + icon("close") + '</button><figure><img alt=""><figcaption></figcaption></figure></div>';
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
  var lb = root.querySelector(".lb"), lbImg = lb.querySelector("img"), lbCap = lb.querySelector("figcaption"), lastBtn = null;
  function closeLb() { lb.hidden = true; document.documentElement.classList.remove("no-scroll"); if (lastBtn) lastBtn.focus(); }
  root.addEventListener("click", function (e) {
    var s = e.target.closest(".shot__btn");
    if (s) { lastBtn = s; lbImg.src = s.dataset.full; lbImg.alt = s.dataset.cap; lbCap.textContent = s.dataset.cap; lb.hidden = false; document.documentElement.classList.add("no-scroll"); lb.querySelector(".lb__x").focus(); }
  });
  lb.addEventListener("click", function (e) { if (e.target === lb || e.target.closest(".lb__x")) closeLb(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { if (!lb.hidden) closeLb(); if (!menuEl.hidden) setMenu(false); } });

  // появление при прокрутке
  var rv = root.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) { rv.forEach(function (el) { el.classList.add("is-in"); }); }
  else {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    rv.forEach(function (el) { io.observe(el); });
  }
})();
