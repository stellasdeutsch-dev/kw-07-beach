// Сравнение бок о бок: node qa/compare.mjs  -> qa/compare/<секция>.jpg (слева образец, справа копия на 1440)
import { chromium } from '/Users/shyngysnarseyit/Downloads/alterna/pdf-guides/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const root = new URL('../', import.meta.url).pathname;
const out = root + 'qa/compare/'; mkdirSync(out, { recursive: true });
// [секция, селектор, файл образца, x0, y0, x1, y1] — кадр лендинга в образце: x 310..1668 (1358 px = 1440 px сайта)
const pairs = [
  ['01_hero', '#top', 'ref_13', 310, 475, 1668, 1290],
  ['02_who', '#who', 'ref_12', 310, 380, 1668, 1020],
  ['03_points', '#main', 'ref_11', 310, 470, 1668, 1240],
  ['04_checks', '#useful', 'ref_10', 310, 200, 1668, 900],
  ['05_steps', '#steps', 'ref_09', 310, 230, 1668, 940],
  ['06_gallery', '#inside', 'ref_06', 310, 230, 1668, 880],
  ['07_pains', '#pains', 'ref_05', 310, 230, 1668, 760],
  ['08_promise', '#price', 'ref_05', 310, 760, 1668, 1240],
  ['09_includes', '#includes', 'ref_04', 310, 290, 1668, 1130],
  ['10_promo', '#buy', 'ref_03', 310, 200, 1668, 800],
  ['11_bonus', '#bonus', 'ref_02', 310, 480, 1668, 1010],
  ['12_faq', '#faq', 'ref_01', 310, 230, 1668, 920]
];
const b = await chromium.launch({ channel: 'chrome', args: ['--mute-audio'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(process.argv[2] || 'http://localhost:4707/en/', { waitUntil: 'networkidle' });
await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 100)); } document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-in')); });
await p.waitForTimeout(800);
for (const [name, sel] of pairs) {
  const el = await p.$(sel); if (!el) continue;
  await el.screenshot({ path: out + name + '_ours.png' });
}
await b.close();
execFileSync('python3', ['-c', `
import json,sys
from PIL import Image
pairs=json.loads(sys.argv[1]); root=sys.argv[2]
for name,sel,ref,x0,y0,x1,y1 in pairs:
  try: ours=Image.open(root+'qa/compare/'+name+'_ours.png').convert('RGB')
  except Exception: continue
  r=Image.open(root+'design/'+ref+'.webp').convert('RGB').crop((x0,y0,x1,y1))
  W=720
  r=r.resize((W,int(r.height*W/r.width))); o=ours.resize((W,int(ours.height*W/ours.width)))
  H=max(r.height,o.height); c=Image.new('RGB',(W*2+16,H),'#ff3366'); c.paste(r,(0,0)); c.paste(o,(W+16,0))
  c.save(root+'qa/compare/'+name+'.jpg',quality=78)
`, JSON.stringify(pairs), root]);
console.log('ok', out);
