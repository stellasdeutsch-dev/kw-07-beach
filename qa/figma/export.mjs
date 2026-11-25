// Выгрузка страницы в компактное дерево для Figma: node qa/figma/export.mjs <page:''|lesson/> <width>
// Пишет qa/figma/<main|lesson>_<w>.json: [{name, y, h, tree}] по блокам страницы.
import { chromium } from '/Users/shyngysnarseyit/Downloads/alterna/pdf-guides/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';
const [, , page = '', w = '1440'] = process.argv;
const base = 'http://localhost:4707/';
const b = await chromium.launch({ channel: 'chrome', args: ['--mute-audio'] });
const p = await b.newPage({ viewport: { width: +w, height: 900 }, reducedMotion: 'reduce' });
await p.goto(base + page, { waitUntil: 'networkidle' });
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } scrollTo(0, 0); });
await p.waitForTimeout(500);
const data = await p.evaluate(() => {
  const NAMES = {
    hdr__logo: 'Логотип', hdr__r: 'Иконки шапки', hdr__ic: 'Кнопка-иконка', hero__bg: 'Фото первого экрана', hero__copy: 'Заголовок и кнопка', hero__title: 'Заголовок',
    badge: 'Бейдж', pill: 'Плашка', btn: 'Кнопка', btn__ic: 'Иконка кнопки', btn__tx: 'Текст кнопки', row: 'Вывод и кнопка', row__btns: 'Кнопки',
    'who-list': 'Карточки', who: 'Карточка', who__card: 'Карточка', who__pic: 'Фон персонажа', who__base: 'Подставка',
    points: 'Пункты и телефон', points__col: 'Колонка пунктов', point: 'Пункт', num: 'Номер', phone: 'Телефон', phone__screen: 'Экран', chat__head: 'Шапка чата', chat__ava: 'Аватар', chat__body: 'Сообщения', msg: 'Сообщение',
    pills: 'Плашки', opill: 'Плашка', checks__bg: 'Фото фона', checks: 'Карточки', check: 'Карточка', check__ic: 'Иконка карточки',
    steps: 'Шаги', steps__stage: 'Подиум', step: 'Шаг', step__tab: 'Вкладка', step__card: 'Карточка шага',
    gallery: 'Скриншоты', gpage: 'Страница галереи', shot: 'Скриншот', shot__btn: 'Рамка скриншота', shot__tag: 'Метка', shot__zoom: 'Увеличить', gnav: 'Листалка', gnav__arr: 'Стрелка', dot: 'Точка',
    facts: 'Факты', facts__l: 'Факт слева', facts__box: 'Плашка', facts__r: 'Факт справа', facts__stars: 'Звёзды', glink: 'Ссылка',
    pains: 'Карточки', pain: 'Карточка', pain__x: 'Крестик', promise: 'Золотая плашка', inc: 'Две платформы', inc__card: 'Карточка платформы', inc__list: 'Список', inc__star: 'Звезда',
    ticket: 'Билет', promo__bg: 'Фото баннера', promo__in: 'Бейдж покупки', pbadge: 'Бейдж', pbadge__btns: 'Кнопки', bonuses: 'Карточки', bonus: 'Карточка',
    faq: 'Вопросы', faq__pic: 'Картинка по теме языка', pt__ic: 'Иконка пункта', facts__ic: 'Иконка факта', chips: 'Плашки условий', inc__ic: 'Иконка пункта', step__time: 'Когда', count: 'Счётчик', qa: 'Вопрос', qa__q: 'Строка вопроса', qa__a: 'Ответ', qa__ic: 'Иконка вопроса', wrap: 'Контейнер', ftr: 'Подвал'
  };
  const nameOf = el => {
    if (el.dataset && el.dataset.block) return el.dataset.block;
    for (const c of el.classList) if (NAMES[c]) return NAMES[c];
    if (/^H[1-3]$/.test(el.tagName)) return 'Заголовок';
    if (el.tagName === 'LI') return 'Пункт';
    return 'Блок';
  };
  const col = s => { const m = s && s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return [v[0], v[1], v[2], v[3] === undefined ? 1 : v[3]]; };
  const px = v => parseFloat(v) || 0;
  const rad = (cs, r) => ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'].map(k => { const v = cs['border' + k + 'Radius']; return v.endsWith('%') ? Math.min(r.width, r.height) * parseFloat(v) / 100 : px(v); });
  function grad(s) {
    const m = s.match(/linear-gradient\((.*)\)$/); if (!m) return null;
    const parts = m[1].split(/,(?![^(]*\))/).map(x => x.trim());
    let ang = 180; if (/deg$/.test(parts[0])) ang = parseFloat(parts.shift()); else if (/^to /.test(parts[0])) { parts.shift(); }
    const stops = parts.map((t, i) => { const c = col(t); const pm = t.match(/\)\s*([\d.]+)%/); return [c, pm ? +pm[1] / 100 : i / (parts.length - 1)]; }).filter(s => s[0]);
    return { ang, stops };
  }
  function fills(cs) {
    const out = [];
    const bc = col(cs.backgroundColor); if (bc && bc[3] > 0) out.push({ t: 's', c: bc });
    const bi = cs.backgroundImage;
    if (bi && bi !== 'none') {
      const layers = bi.split(/,(?![^(]*\))(?=\s*(?:url|linear))/).map(x => x.trim()).reverse();
      for (const l of layers) {
        if (l.startsWith('url(')) out.push({ t: 'i', src: l.slice(4, -1).replace(/["']/g, '').split('/').pop() });
        else { const g = grad(l); if (g) out.push({ t: 'g', ...g }); }
      }
    }
    return out;
  }
  function shadow(cs) {
    const s = cs.boxShadow; if (!s || s === 'none') return null;
    const first = s.split(/,(?![^(]*\))/)[0]; if (/inset/.test(first)) return null;
    const c = col(first); const nums = first.replace(/rgba?\([^)]*\)/, '').trim().split(/\s+/).map(px);
    return [nums[0] || 0, nums[1] || 0, nums[2] || 0, nums[3] || 0, c];
  }
  function box(el, cs, r) {
    const n = { k: 'f', n: nameOf(el), x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height };
    const f = fills(cs); if (f.length) n.f = f;
    const rr = rad(cs, r); if (rr.some(v => v)) n.r = rr.map(v => Math.round(v));
    const sh = shadow(cs); if (sh) n.sh = sh;
    const bt = px(cs.borderTopWidth), bb2 = px(cs.borderBottomWidth), bl = px(cs.borderLeftWidth), br = px(cs.borderRightWidth);
    const bw = Math.max(bt, bb2, bl, br);
    const bcol = [cs.borderTopColor, cs.borderRightColor, cs.borderBottomColor].map(col).find(c => c && c[3] > 0);
    if (bw && bcol) n.st = [bw, bcol, br && !bt && !bl && !bb2 ? 'r' : (bt && !bb2 ? 'nob' : '')];
    if (cs.overflow === 'hidden' || cs.overflowX === 'hidden') n.clip = 1;
    if (+cs.opacity < 1) n.op = +cs.opacity;
    const tr = cs.transform; if (tr && tr !== 'none' && el.offsetWidth) {
      const m = tr.match(/matrix\(([^)]+)\)/); if (m) { const [a, bb, c, d] = m[1].split(',').map(Number); if (Math.abs(bb) > 0.01) { n.w = el.offsetWidth; n.h = el.offsetHeight; const cx = r.left + scrollX + r.width / 2, cy = r.top + scrollY + r.height / 2; n.x = cx - (a * n.w / 2 + c * n.h / 2); n.y = cy - (bb * n.w / 2 + d * n.h / 2); n.m = [a, bb, c, d]; } }
    }
    return n;
  }
  function pseudo(el, which, r) {
    const cs = getComputedStyle(el, which); if (!cs || cs.content === 'none' || cs.display === 'none') return null;
    const f = fills(cs); if (!f.length) return null;
    let left = cs.left, top = cs.top, right = cs.right, bottom = cs.bottom;
    let wv = px(cs.width), hv = px(cs.height);
    const L = left !== 'auto' ? px(left) : null, T = top !== 'auto' ? px(top) : null, R = right !== 'auto' ? px(right) : null, B = bottom !== 'auto' ? px(bottom) : null;
    if (!wv && L !== null && R !== null) wv = r.width - L - R; if (!hv && T !== null && B !== null) hv = r.height - T - B;
    if (!wv || !hv) return null;
    const x = L !== null ? L : (R !== null ? r.width - R - wv : 0), y = T !== null ? T : (B !== null ? r.height - B - hv : 0);
    const n = { k: 'f', n: which === '::before' ? 'Подложка' : 'Деталь', x: r.left + scrollX + x, y: r.top + scrollY + y, w: wv, h: hv, f };
    const rr = rad(cs, { width: wv, height: hv }); if (rr.some(v => v)) n.r = rr.map(v => Math.round(v));
    return n;
  }
  const skip = el => { if (el.hidden || el.closest('[hidden]')) return true; const cs = getComputedStyle(el); return cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0; };
  const isInline = el => getComputedStyle(el).display === 'inline' && !['IMG', 'svg', 'BR'].includes(el.tagName) && el.tagName.toLowerCase() !== 'svg';
  function svgOf(el) {
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); if (!r.width) return null;
    const base = { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height };
    if (el.dataset.icon) {
      const ic = { k: 's', n: 'Icon / ' + el.dataset.icon, ...base, ic: el.dataset.icon, sc: col(cs.stroke), fc: col(cs.fill), sw: px(cs.strokeWidth) };
      const bw = px(cs.borderTopWidth), pd = px(cs.paddingTop);
      if (bw) { ic.x += bw + pd; ic.y += bw + pd; ic.w -= 2 * (bw + pd); ic.h -= 2 * (bw + pd); return { k: 'f', n: 'Рамка иконки', ...base, r: [px(cs.borderTopLeftRadius), px(cs.borderTopLeftRadius), px(cs.borderTopLeftRadius), px(cs.borderTopLeftRadius)], st: [bw, col(cs.borderTopColor), ''], c: [ic] }; }
      const bg = col(cs.backgroundColor); if (bg && bg[3] > 0) { ic.x += px(cs.paddingLeft); ic.y += px(cs.paddingTop); ic.w -= px(cs.paddingLeft) * 2; ic.h -= px(cs.paddingTop) * 2; return { k: 'f', n: 'Плашка иконки', ...base, f: [{ t: 's', c: bg }], r: [px(cs.borderTopLeftRadius), px(cs.borderTopLeftRadius), px(cs.borderTopLeftRadius), px(cs.borderTopLeftRadius)], c: [ic] }; }
      return ic;
    }
    if (el.classList.contains('step__arrow')) {
      const vb = el.getAttribute('viewBox'); const vw = +vb.split(' ')[2]; const flip = /matrix\(-1/.test(cs.transform);
      const inner = [...el.querySelectorAll('path')].map(p => '<path d="' + p.getAttribute('d') + '"/>').join('');
      const c = col(cs.stroke); const hex = '#' + c.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
      return { k: 'sv', n: 'Стрелка к следующему шагу', ...base, svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '" fill="none" stroke="' + hex + '" stroke-width="' + px(cs.strokeWidth) + '" stroke-linecap="round" stroke-linejoin="round">' + (flip ? '<g transform="translate(' + vw + ',0) scale(-1,1)">' + inner + '</g>' : inner) + '</svg>' };
    }
    if (el.classList.contains('ring')) { const t = el.querySelector('text'); const tc = getComputedStyle(t); return { k: 'rg', n: 'Кольцо с текстом', ...base, text: t.textContent, fc: col(tc.fill), fs: px(tc.fontSize), fw: +tc.fontWeight, ls: px(tc.letterSpacing) }; }
    const pth = el.querySelector('path'); const pc = getComputedStyle(pth);
    return { k: 'sc', n: 'Волнистый круг', ...base, fc: col(pc.fill), sc: col(pc.stroke), sw: px(pc.strokeWidth) };
  }
  function textOf(el) {
    const runs = []; const rects = [];
    const ff = s => /Tall/.test(s) ? 'T' : 'M';
    function addRuns(node, parentEl) {
      for (const ch of node.childNodes) {
        if (ch.nodeType === 3) {
          let t = ch.textContent.replace(/\s+/g, ' '); if (!t.trim() && !runs.length) continue;
          const cs = getComputedStyle(parentEl); if (cs.textTransform === 'uppercase') t = t.toUpperCase();
          const rg = document.createRange(); rg.selectNodeContents(ch); for (const rc of rg.getClientRects()) if (rc.width) rects.push(rc);
          runs.push([t, +cs.fontWeight, col(cs.color), cs.fontStyle === 'italic' ? 1 : 0, /underline/.test(cs.textDecorationLine) ? 1 : 0, px(cs.fontSize), ff(cs.fontFamily)]);
        } else if (ch.nodeType === 1) {
          if (ch.tagName === 'BR') runs.push(['\n']);
          else if (isInline(ch) && !skip(ch)) addRuns(ch, ch);
        }
      }
    }
    addRuns(el, el);
    if (!runs.some(r => r[0].trim())) return null;
    // убрать пробелы по краям и у переносов
    if (runs.length) { runs[0][0] = runs[0][0].replace(/^\s+/, ''); runs[runs.length - 1][0] = runs[runs.length - 1][0].replace(/\s+$/, ''); }
    for (let i = 0; i < runs.length; i++) if (runs[i][0] === '\n') { if (runs[i - 1] && runs[i - 1][1] !== undefined) runs[i - 1][0] = runs[i - 1][0].replace(/\s+$/, ''); if (runs[i + 1] && runs[i + 1][1] !== undefined) runs[i + 1][0] = runs[i + 1][0].replace(/^\s+/, ''); }
    const cs = getComputedStyle(el);
    const x0 = Math.min(...rects.map(r => r.left)), y0 = Math.min(...rects.map(r => r.top)), x1 = Math.max(...rects.map(r => r.right)), y1 = Math.max(...rects.map(r => r.bottom));
    const lh = cs.lineHeight === 'normal' ? px(cs.fontSize) * 1.25 : px(cs.lineHeight);
    const lines = new Set(rects.map(r => Math.round(r.top))).size;
    const er = el.getBoundingClientRect();
    const name = runs.map(r => r[0]).join('').replace(/\s+/g, ' ').trim().slice(0, 40);
    return { k: 't', n: name, x: x0 + scrollX, y: y0 + scrollY, w: x1 - x0, h: y1 - y0, ew: er.width, ex: er.left + scrollX, s: runs, fs: px(cs.fontSize), ff: ff(cs.fontFamily), lh, ls: cs.letterSpacing === 'normal' ? 0 : px(cs.letterSpacing), al: cs.textAlign, ml: lines > 1 ? 1 : 0 };
  }
  function walk(el) {
    if (el.nodeType !== 1 || skip(el)) return null;
    if (el.closest('.lb,.menu')) return null;
    const tag = el.tagName.toLowerCase();
    if (tag === 'svg') return svgOf(el);
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) return null;
    const cs = getComputedStyle(el);
    if (tag === 'img') {
      const n = { k: 'i', n: el.alt || ({ 'podium.webp': 'Белые подиумы' })[el.getAttribute('src').split('/').pop()] || 'Фото', x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height, src: el.getAttribute('src').split('/').pop(), fit: cs.objectFit === 'cover' ? 'FILL' : 'FIT' };
      const rr = rad(cs, r); if (rr.some(v => v)) n.r = rr.map(v => Math.round(v)); if (+cs.opacity < 1) n.op = +cs.opacity;
      return n;
    }
    const n = box(el, cs, r); const ch = [];
    const pb = pseudo(el, '::before', r); if (pb) ch.push(pb);
    const hasText = [...el.childNodes].some(c => c.nodeType === 3 && c.textContent.trim());
    if (hasText) { const t = textOf(el); if (t) ch.push(t); }
    for (const c of el.children) { if (hasText && c.nodeType === 1 && (c.tagName === 'BR' || isInline(c))) continue; const k = walk(c); if (k) ch.push(k); }
    const pa = pseudo(el, '::after', r); if (pa) ch.push(pa);
    const visual = n.f || n.sh || n.st || n.m;
    if (!visual && ch.length === 1 && !el.dataset.block && !n.clip) return ch[0];
    if (!visual && !ch.length) return null;
    if (ch.length) n.c = ch;
    return n;
  }
  const blocks = [document.querySelector('.hdr'), ...document.querySelectorAll('main > section'), document.querySelector('.ftr')];
  const out = blocks.map(el => { const r = el.getBoundingClientRect(); const t = walk(el); t.n = el.dataset.block || nameOf(el); return { name: t.n, id: el.id || '', y: r.top + scrollY, h: r.height, tree: t }; });
  return { w: innerWidth, H: document.documentElement.scrollHeight, blocks: out };
});
// округлить числа, чтобы данные были короче
const round = o => JSON.parse(JSON.stringify(o, (k, v) => typeof v === 'number' ? Math.round(v * 100) / 100 : v));
const res = round(data);
const name = page.replace(/\//g, '_').replace(/_$/, '') + '_' + w;
writeFileSync(new URL('./' + name + '.json', import.meta.url), JSON.stringify(res));
console.log(name, JSON.stringify(res).length, res.blocks.map(b => b.name + ':' + JSON.stringify(b.tree).length).join(' '));
await b.close();
