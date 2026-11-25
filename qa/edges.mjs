// Края вырезок на фоне сайта в увеличении: node qa/edges.mjs -> qa/edges/site_<имя>.png
import { chromium } from '/Users/shyngysnarseyit/Downloads/alterna/pdf-guides/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';
const out = new URL('./edges/', import.meta.url).pathname; mkdirSync(out, { recursive: true });
const b = await chromium.launch({ channel: 'chrome', args: ['--mute-audio'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
await p.goto(process.argv[2] || 'http://localhost:4707/en/', { waitUntil: 'networkidle' });
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); } });
const names = await p.evaluate(() => [...document.images].map((im, i) => ({ i, src: (im.getAttribute('src') || '').split('/').pop() })).filter(x => /^(who|pain|bonus|obj|phone|podium)/.test(x.src)));
for (const { i, src } of names) {
  const el = (await p.$$('img'))[i];
  await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(150);
  const bx = await el.boundingBox(); if (!bx) continue;
  await p.screenshot({ path: out + 'site_' + src.replace('.webp', '') + '.png', clip: { x: Math.max(0, bx.x - 12), y: Math.max(0, bx.y - 12), width: bx.width + 24, height: bx.height + 24 } });
}
await b.close();
console.log('edges:', names.length);
