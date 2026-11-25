// Сборка сайта 07: node build.mjs
// Берёт gh/content.en.json и gh/content.tr.json и пишет gh/en/ и gh/tr/ (обе с рекламой, версий без рекламы нет).
// Корень gh/ и старый gh/lesson/ переадресуют на /en/, старые /en/lesson/ и /tr/lesson/ на свою вариацию.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const root = new URL('./gh/', import.meta.url).pathname;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

function page({ content, page, base, title }) {
  const json = JSON.stringify(content).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(content.meta.description)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:image" content="${base}assets/img/bg-hero.webp">
<link rel="preload" href="${base}assets/fonts/stellas-tall.woff" as="font" type="font/woff" crossorigin>
<link rel="preload" href="${base}assets/img/bg-hero.webp" as="image">
<link rel="icon" href="${base}assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${base}assets/style.css">
<script>window.PAGE = "${page}"; window.BASE = "${base}"; window.CONTENT = ${json};</script>
<script src="${base}assets/app.js" defer></script>
</head>
<body>
<div id="app"></div>
<noscript><p style="padding:40px;text-align:center">Для этой страницы нужен JavaScript.</p></noscript>
</body>
</html>
`;
}

function redirect(to) {
  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Гайд: английский и турецкий</title>
<meta http-equiv="refresh" content="0; url=${to}">
<link rel="canonical" href="${to}">
<script>location.replace(${JSON.stringify(to)} + location.hash);</script>
</head>
<body style="font-family:system-ui,sans-serif;padding:40px;text-align:center">
<p><a href="${to}">Открыть гайд</a></p>
</body>
</html>
`;
}

const out = [];
for (const lang of ['en', 'tr']) {
  const content = JSON.parse(readFileSync(root + `content.${lang}.json`, 'utf8'));
  mkdirSync(root + lang, { recursive: true });
  writeFileSync(root + lang + '/index.html', page({ content, page: 'main', base: '../', title: content.meta.title }));
  out.push(lang + '/');
  mkdirSync(root + lang + '/lesson', { recursive: true });
  writeFileSync(root + lang + '/lesson/index.html', redirect('../'));
  out.push(lang + '/lesson/ → ' + lang + '/');
}
writeFileSync(root + 'index.html', redirect('en/'));
mkdirSync(root + 'lesson', { recursive: true });
writeFileSync(root + 'lesson/index.html', redirect('../en/'));
out.push('index.html → en/', 'lesson/ → en/');
console.log('built:', out.join(', '));
