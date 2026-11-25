# Сайт 07: пляжный лендинг (шаблон)

Копия дизайна с Behance (лендинг курса похудения, автор Нина Нетребина), переделанная в шаблон под кодовые слова.
Две вариации в одном дизайне, подход к рекламе «Частые вопросы и честный блок»:

| Вариация | С рекламой | Без рекламы |
|---|---|---|
| Английский, Dias English | https://stellasdeutsch-dev.github.io/kw-07-beach/en/ | https://stellasdeutsch-dev.github.io/kw-07-beach/en/lesson/ |
| Турецкий, Alterna Timur | https://stellasdeutsch-dev.github.io/kw-07-beach/tr/ | https://stellasdeutsch-dev.github.io/kw-07-beach/tr/lesson/ |

Корень и старый `/lesson/` переадресуют на `/en/` и `/en/lesson/`.
- Образец: `design/` (`ref_*.webp` скриншоты, `design_*` модули Behance в полном размере). Только локально, в репозиторий не попадает.
- Figma: https://www.figma.com/design/AvbKNqOKw8z1q3Ac4NgLke (файл `kw-07-beach`)

## Как поменять
| Что | Где |
|---|---|
| Тексты, ссылки покупки, порядок блоков | `gh/content.en.json` и `gh/content.tr.json` |
| Цвета, шрифты, размеры | `gh/assets/style.css`, блок `:root` в начале |
| Картинки | `gh/assets/img/`, путь прописан в `content.js` |
| Разметка блоков | `gh/assets/app.js`, объект `R` (по функции на тип блока) |

После правки собрать все страницы одной командой:
```bash
node build.mjs
```
В текстах файлов данных: `**жирный**`, `[[золотой]]` (часть заголовка), `|` перенос строки.

Ссылки: `links.buy` (покупка), `links.contact` (вопросы, только у турецкого). В кнопках `"href": "buy"`.

Блок убрать: удалить его из массива `blocks`. Повторить: скопировать объект. Переставить: поменять местами.
`ad: true` значит блок только на главной, `lesson: true` только на `/lesson/`.

Типы блоков: `hero`, `audience` (5 карточек с персонажами), `points` (6 пунктов и телефон с диалогом), `checks` (6 карточек на фото),
`steps` (3 шага на подиуме), `gallery` (скриншоты по 3 на страницу), `pains`, `promise` (золотая плашка), `includes` (две платформы и билет),
`promo` (баннер с круглым бейджем), `bonus`, `faq`.

## Картинки
- Фоны пляжа, 3D-персонажи, подиумы, предметы, телефон в руке: сгенерированы в ElevenLabs (gpt-image-2.5-sunburst), фон вырезан скилом `cutout`, край почищен `defringe.py`; у двух персонажей с летящими волосами белые островки между прядями убраны `qa/figma/keywhite.py`. Исходники и чистые вырезки в `qa/raw/` и `qa/raw/cut2/clean/`, проверки края в `qa/edges/`.
- Скриншоты платформ: `shot_dias-*` из гайдов Диаса, `shot_timur-*` из гайдов Тимура.
- Новая картинка: webp не шире 1600 px, до ~250 КБ: `cwebp -q 80 -resize 1280 0 in.png -o gh/assets/img/name.webp`.

## Шрифты
- Заголовки: «Stellas Tall» (`gh/assets/fonts/stellas-tall.woff`). Это свободный Noto Serif Display (OFL), сжатый по ширине до 60 %: в Google Fonts нет узкого контрастного шрифта с кириллицей, как в образце. Скрипт сборки: `qa/font/mk.py`.
- Текст: Montserrat (подмножество латиница и кириллица).

## Figma
Секции «Главная (с рекламой)» и «Урок (без рекламы)», в каждой кадры 1440, 834, 390. Слои названы по смыслу (Шапка, Первый экран, Реклама платформы, Подвал, Icon / …).
Цвета это переменные «Цвета сайта» (те же, что `:root` в CSS), тексты на стилях «Заголовок / N» и «Текст / N». Кнопки это компоненты «Кнопка / Читать | Дальше | Купить / размер».
Заголовки в Figma набраны Sofia Sans Extra Condensed Light: «Stellas Tall» нельзя загрузить в Figma через API. Поставь `qa/font/StellasTall-Regular.ttf` на компьютер и поменяй семейство в стилях «Заголовок / …».
Перенос страницы в Figma: `qa/figma/export.mjs` (выгрузка из браузера), `qa/figma/pack.py` (сжатие), `qa/figma/builder.js` (сборка в Figma через use_figma).

## Проверка
```bash
cd gh && python3 -m http.server 4707
```
```bash
node qa/check.mjs
```
```bash
node qa/interact.mjs
```
```bash
node qa/compare.mjs
```
`check` проверяет 1440/834/390 на четырёх страницах (`en/`, `en/lesson/`, `tr/`, `tr/lesson/`) и переадресации: нет горизонтальной прокрутки, все картинки загрузились, в консоли нет ошибок, в `en/` только ссылка Dias English, в `tr/` только Alterna Timur, в уроках ссылок нет. `node qa/edges.mjs` снимает края вырезок на фоне сайта. Скриншоты в `qa/shots/`.
`interact` кликает FAQ, галерею, лайтбокс, меню и проверяет «уменьшить движение». `compare` кладёт образец и копию рядом в `qa/compare/`.

## Публикация
Репозиторий `stellasdeutsch-dev/kw-07-beach`. В `main` весь проект, GitHub Pages берёт ветку `gh-pages`: это содержимое папки `gh/`.
После правок:
```bash
git add -A && git commit -m "..." && git push && git subtree split --prefix gh -b gh-pages && git push -f origin gh-pages
```
