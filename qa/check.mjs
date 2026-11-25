// QA сайта 07: node qa/check.mjs [baseUrl]
// Ширины 1440/834/390, обе версии: scrollWidth, картинки, консоль, ссылки покупки, скриншоты.
import { chromium } from '/Users/shyngysnarseyit/Downloads/alterna/pdf-guides/node_modules/playwright/index.mjs';
import { mkdirSync, readFileSync } from 'node:fs';
// media/PEOPLE.md: | файл на сайте | вариация | исходный файл | кто |
const people = Object.fromEntries(readFileSync(new URL('../media/PEOPLE.md', import.meta.url), 'utf8').split('\n').filter(l => /^\| `/.test(l)).map(l => l.split('|').map(x => x.trim().replace(/`/g, ''))).map(c => [c[1] + '@' + c[2], { src: c[3], who: c[4] }]));
const DIAS = /^~\/dias\/(shared\/dias-photos-web\/|dias photos\/)/, TIMUR = /^~\/dias\/(timur-video\/|video\/timur-clips\/photos\/)/;
const base = process.argv[2] || 'http://localhost:4707/';
const out = new URL('./shots/', import.meta.url).pathname; mkdirSync(out, { recursive: true });
const b = await chromium.launch({ channel: 'chrome', args: ['--mute-audio'] });
const results = [];
for (const page of ['en/', 'tr/']) {
  for (const w of [1440, 834, 390]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    const errors = [];
    p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    p.on('pageerror', e => errors.push(e.message));
    await p.goto(base + page, { waitUntil: 'networkidle' });
    // прокрутить, чтобы сработали lazy и появления
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, document.body.scrollHeight); await new Promise(r => setTimeout(r, 800)); window.scrollTo(0, 0); });
    await p.evaluate(() => document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-in')));
    // листаем галерею: страницы 2 и 3, потом обратно на 1
    for (const n of [1, 2, 0]) { const d = await p.$('[data-go="' + n + '"]'); if (d) { await d.click(); await p.waitForTimeout(500); } }
    await p.waitForLoadState('networkidle'); await p.waitForTimeout(600);
    const r = await p.evaluate(() => {
      const imgs = [...document.images].filter(i => !i.closest('.lb'));
      const broken = imgs.filter(i => !(i.complete && i.naturalWidth > 0)).map(i => i.getAttribute('src'));
      const lava = [...document.querySelectorAll('a[href*="lava.top"]')].map(a => a.href);
      const wide = [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.right > document.documentElement.clientWidth + 1 && getComputedStyle(e).position !== 'fixed' && !e.closest('.ribbon,.hero__bg,.checks__bg,.promo__bg,.lb'); }).slice(0, 5).map(e => e.className || e.tagName);
      const text = document.body.innerText + ' ' + imgs.map(i => i.alt).join(' ') + ' ' + document.title;
      const money = (text.match(/.{0,20}(\$|USD|₸|₽|руб|тенге|доллар|в месяц|\/ ?мес|ежемесяч).{0,20}/gi) || []).concat((text.match(/\d+[\s ]*€/g) || []).filter(x => !/^30[\s ]*€$/.test(x)));
      const author = (text.match(/Тимур|Timur/g) || []).length + ':' + (text.match(/Диас|Dias/g) || []).length;
      return { srcs: [...new Set(imgs.map(i => (i.getAttribute('src') || '').split('/').pop()))], money, author, scrollWidth: document.documentElement.scrollWidth, imgs: imgs.length, broken, lava: [...new Set(lava)], lavaCount: lava.length, wide, h: document.body.scrollHeight, title: document.title };
    });
    const name = page.replace(/\//g, '_').replace(/_$/, '') + '_' + w;
    await p.screenshot({ path: out + name + '_full.png', fullPage: true });
    await p.screenshot({ path: out + name + '_first.png' });
    const ad = await p.$('#inside');
    if (ad) { await ad.scrollIntoViewIfNeeded(); await p.waitForTimeout(300); await p.screenshot({ path: out + name + '_ad.png' }); }
    const wantLava = page.startsWith('en') ? '2c950aa0' : '2cdbb9f8', badLava = page.startsWith('en') ? '2cdbb9f8' : '2c950aa0';
    const lavaOk = r.lava.every(u => u.includes(wantLava)) && r.lavaCount > 0 && !r.lava.some(u => u.includes(badLava));
    const lang = page.slice(0, 2), other = lang === 'en' ? /Тимур|Timur/ : /Диас|Dias/;
    const peopleBad = r.srcs.filter(f => { const e = people[f + '@' + lang]; if (!e) return true; if (e.who === 'людей нет') return false; return lang === 'en' ? !(DIAS.test(e.src) && /Диас/.test(e.who)) : !(TIMUR.test(e.src) && /Тимур/.test(e.who)); });
    const otherAuthor = lang === 'en' ? +r.author.split(':')[0] : +r.author.split(':')[1];
    delete r.srcs;
    results.push({ page, w, ok: r.scrollWidth === w && !r.broken.length && !errors.length && lavaOk && !peopleBad.length && !r.money.length && !otherAuthor, lavaOk, peopleBad, otherAuthor, ...r, errors });
    await ctx.close();
  }
}
// переадресации со старых адресов
for (const [from, to] of [['', 'en/'], ['lesson/', 'en/'], ['en/lesson/', 'en/'], ['tr/lesson/', 'tr/']]) {
  const p = await b.newPage(); await p.goto(base + from, { waitUntil: 'load' }); await p.waitForTimeout(400);
  results.push({ page: 'redirect /' + from, ok: p.url().endsWith(to), to: p.url() }); await p.close();
}
await b.close();
for (const r of results) console.log(JSON.stringify(r));
