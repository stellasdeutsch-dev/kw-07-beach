# Люди на картинках сайта 07

Правило: на `/en/` только Диас (источник `~/dias/shared/dias-photos-web/` или `~/dias/dias photos/`), на `/tr/` только Тимур (`~/dias/timur-video/` или `~/dias/video/timur-clips/photos/`). Второго автора на странице нет.

**Итог: на сайте 07 из людей только автор своей вариации, один раз, на первом экране:** на `/en/` Диас, на `/tr/` Тимур. Фото целое, как снято, со своим фоном, в рамке как у скриншотов (правило «Людей не вырезать»). Нарисованные персонажи заменены предметами; предметы вырезаны `cutout` и почищены `defringe.py`.

## Что заменено 25 ноября 2026

| Было на сайте | Кто был | Источник | Стало |
|---|---|---|---|
| `who-student`, `who-traveler`, `who-office`, `who-music`, `who-phone` | нарисованные люди (генерация) | не из папок Диаса и Тимура | `who-books`, `who-passport`, `who-laptop`, `who-headphones`, `who-chat` (предметы) |
| `pain-tired`, `pain-dictionary`, `pain-phone` | нарисованные люди (генерация) | не из папок Диаса и Тимура | en: `pain-notebook`, `pain-key`, `pain-piggy`; tr: `pain-key`, `pain-sprout`, `pain-smartphone` |
| `bonus-clock` | нарисованный кудрявый парень, похож на Диаса и Тимура | не из папок Диаса и Тимура | en: `bonus-alarm`; tr: `bonus-index` |
| `bonus-wind`, `bonus-heart`, `bonus-jacket` | нарисованные люди (генерация) | не из папок Диаса и Тимура | en: `bonus-cards`, `bonus-basket`, `bonus-archive`; tr: `bonus-clapper`, `bonus-cap`, `bonus-briefcase` |
| `phone-hand` | женская рука с телефоном | генерация | `phone` (телефон без руки) |
| `bg-hero` | мужчина в шляпе на пляже, со спины | генерация | `bg-hero` (пляж без людей, шляпа и блокнот на песке) |
| `shot_dias-gemini` | стоковое фото женщины внутри платформы | скриншот | `shot_dias-writing` |
| `shot_dias-topic0` | нарисованные лица из мема | скриншот | `shot_dias-wheel` |
| `shot_dias-lexika` | стоковые фото людей в карточках тем | скриншот | `shot_dias-habits` |
| `shot_timur-lexika` | стоковые фото людей в карточках тем | скриншот | `shot_timur-ikileme` |
| `shot_timur-b1` | нарисованные мальчики на обложках | скриншот | `shot_timur-unsuz` |

## Фото авторов

| Файл на сайте | Вариация | Исходный файл | Кто |
|---|---|---|---|
| `author-dias.webp` | en | `~/dias/shared/dias-photos-web/dias-IMG_3119.webp` | Диас |
| `author-timur.webp` | tr | `~/dias/timur-video/IMG_2827.HEIC` | Тимур |

Обрезка только до 3:4 по краям фона: лицо, плечи и руки целиком.

## Все картинки на страницах

QA (`qa/check.mjs`) сверяет каждую картинку страницы с этой таблицей: картинки нет в таблице или у человека источник не из папки своего автора — ошибка.

| Файл на сайте | Вариация | Исходный файл | Кто на картинке |
|---|---|---|---|
| `bg-foryou.webp` | en | `генерация ElevenLabs, пляж с шезлонгами без людей` | людей нет |
| `bg-hero.webp` | en | `генерация ElevenLabs, пляж без людей (qa/raw/v3/hero.png)` | людей нет |
| `bg-promo.webp` | en | `генерация ElevenLabs, пляж с гамаком без людей` | людей нет |
| `bg-silk.webp` | en | `генерация ElevenLabs, шёлк (фон в CSS)` | людей нет |
| `bonus-alarm.webp` | en | `генерация ElevenLabs, лист предметов (qa/raw/v3/bonus_en.png)` | людей нет |
| `bonus-archive.webp` | en | `генерация ElevenLabs, лист предметов (qa/raw/v3/bonus_en.png)` | людей нет |
| `bonus-basket.webp` | en | `генерация ElevenLabs, лист предметов (qa/raw/v3/bonus_en.png)` | людей нет |
| `bonus-cards.webp` | en | `генерация ElevenLabs, лист предметов (qa/raw/v3/bonus_en.png)` | людей нет |
| `obj-bubbles.webp` | en | `генерация ElevenLabs, предмет` | людей нет |
| `obj-medal.webp` | en | `генерация ElevenLabs, предмет` | людей нет |
| `obj-notebook.webp` | en | `генерация ElevenLabs, предмет` | людей нет |
| `obj-stars.webp` | en | `генерация ElevenLabs, предмет` | людей нет |
| `pain-key.webp` | en | `генерация ElevenLabs, лист предметов (qa/raw/v3/pains.png)` | людей нет |
| `pain-notebook.webp` | en | `генерация ElevenLabs, лист предметов (qa/raw/v3/pains.png)` | людей нет |
| `pain-piggy.webp` | en | `генерация ElevenLabs, лист предметов (qa/raw/v3/pains.png)` | людей нет |
| `phone.webp` | en | `генерация ElevenLabs, телефон без руки (qa/raw/v3/phone.png)` | людей нет |
| `podium.webp` | en | `генерация ElevenLabs, подиумы` | людей нет |
| `shot_dias-grammar.webp` | en | `скриншот платформы без людей: ~/dias/3/questions/media/n-grammar.webp` | людей нет |
| `shot_dias-habits.webp` | en | `скриншот платформы без людей: ~/dias/3/sharp/media/n-habits.webp` | людей нет |
| `shot_dias-home.webp` | en | `скриншот платформы без людей: ~/dias/3/questions/media/n-home.webp` | людей нет |
| `shot_dias-res.webp` | en | `скриншот платформы без людей: ~/dias/3/questions/media/n-res.webp` | людей нет |
| `shot_dias-roadmap.webp` | en | `скриншот платформы без людей: ~/dias/3/questions/media/n-roadmap.webp` | людей нет |
| `shot_dias-topic.webp` | en | `скриншот платформы без людей: ~/dias/3/questions/media/n-topic.webp` | людей нет |
| `shot_dias-tracker.webp` | en | `скриншот платформы без людей: ~/dias/3/questions/media/n-tracker.webp` | людей нет |
| `shot_dias-wheel.webp` | en | `скриншот платформы без людей: ~/dias/3/sharp/media/n-wheel.webp` | людей нет |
| `shot_dias-writing.webp` | en | `скриншот платформы без людей: ~/dias/3/sharp/media/n-writing.webp` | людей нет |
| `who-books.webp` | en | `генерация ElevenLabs, лист предметов (qa/raw/v3/who.png)` | людей нет |
| `who-chat.webp` | en | `генерация ElevenLabs, лист предметов (qa/raw/v3/who.png)` | людей нет |
| `who-headphones.webp` | en | `генерация ElevenLabs, лист предметов (qa/raw/v3/who.png)` | людей нет |
| `who-laptop.webp` | en | `генерация ElevenLabs, лист предметов (qa/raw/v3/who.png)` | людей нет |
| `who-passport.webp` | en | `генерация ElevenLabs, лист предметов (qa/raw/v3/who.png)` | людей нет |
| `bg-foryou.webp` | tr | `генерация ElevenLabs, пляж с шезлонгами без людей` | людей нет |
| `bg-hero.webp` | tr | `генерация ElevenLabs, пляж без людей (qa/raw/v3/hero.png)` | людей нет |
| `bg-promo.webp` | tr | `генерация ElevenLabs, пляж с гамаком без людей` | людей нет |
| `bg-silk.webp` | tr | `генерация ElevenLabs, шёлк (фон в CSS)` | людей нет |
| `bonus-briefcase.webp` | tr | `генерация ElevenLabs, лист предметов (qa/raw/v3/bonus_tr.png)` | людей нет |
| `bonus-cap.webp` | tr | `генерация ElevenLabs, лист предметов (qa/raw/v3/bonus_tr.png)` | людей нет |
| `bonus-clapper.webp` | tr | `генерация ElevenLabs, лист предметов (qa/raw/v3/bonus_tr.png)` | людей нет |
| `bonus-index.webp` | tr | `генерация ElevenLabs, лист предметов (qa/raw/v3/bonus_tr.png)` | людей нет |
| `obj-bubbles.webp` | tr | `генерация ElevenLabs, предмет` | людей нет |
| `obj-medal.webp` | tr | `генерация ElevenLabs, предмет` | людей нет |
| `obj-notebook.webp` | tr | `генерация ElevenLabs, предмет` | людей нет |
| `obj-stars.webp` | tr | `генерация ElevenLabs, предмет` | людей нет |
| `pain-key.webp` | tr | `генерация ElevenLabs, лист предметов (qa/raw/v3/pains.png)` | людей нет |
| `pain-smartphone.webp` | tr | `генерация ElevenLabs, лист предметов (qa/raw/v3/pains.png)` | людей нет |
| `pain-sprout.webp` | tr | `генерация ElevenLabs, лист предметов (qa/raw/v3/pains.png)` | людей нет |
| `phone.webp` | tr | `генерация ElevenLabs, телефон без руки (qa/raw/v3/phone.png)` | людей нет |
| `podium.webp` | tr | `генерация ElevenLabs, подиумы` | людей нет |
| `shot_timur-a0.webp` | tr | `скриншот платформы без людей: скриншот платформы Alterna (с опубликованного сайта turkce-izafet / сайтов Тимура)` | людей нет |
| `shot_timur-apps.webp` | tr | `скриншот платформы без людей: скриншот платформы Alterna (с опубликованного сайта turkce-izafet / сайтов Тимура)` | людей нет |
| `shot_timur-cartoons.webp` | tr | `скриншот платформы без людей: скриншот платформы Alterna (с опубликованного сайта turkce-izafet / сайтов Тимура)` | людей нет |
| `shot_timur-forma.webp` | tr | `скриншот платформы без людей: скриншот платформы Alterna (с опубликованного сайта turkce-izafet / сайтов Тимура)` | людей нет |
| `shot_timur-grammar.webp` | tr | `скриншот платформы без людей: скриншот платформы Alterna (с опубликованного сайта turkce-izafet / сайтов Тимура)` | людей нет |
| `shot_timur-ikileme.webp` | tr | `скриншот платформы без людей: turkce-izafet/media/ph-ikileme.webp` | людей нет |
| `shot_timur-podcasts.webp` | tr | `скриншот платформы без людей: скриншот платформы Alterna (с опубликованного сайта turkce-izafet / сайтов Тимура)` | людей нет |
| `shot_timur-route.webp` | tr | `скриншот платформы без людей: скриншот платформы Alterna (с опубликованного сайта turkce-izafet / сайтов Тимура)` | людей нет |
| `shot_timur-unsuz.webp` | tr | `скриншот платформы без людей: turkce-izafet/media/ph-unsuz.webp` | людей нет |
| `who-books.webp` | tr | `генерация ElevenLabs, лист предметов (qa/raw/v3/who.png)` | людей нет |
| `who-chat.webp` | tr | `генерация ElevenLabs, лист предметов (qa/raw/v3/who.png)` | людей нет |
| `who-headphones.webp` | tr | `генерация ElevenLabs, лист предметов (qa/raw/v3/who.png)` | людей нет |
| `who-laptop.webp` | tr | `генерация ElevenLabs, лист предметов (qa/raw/v3/who.png)` | людей нет |
| `who-passport.webp` | tr | `генерация ElevenLabs, лист предметов (qa/raw/v3/who.png)` | людей нет |
| `author-dias.webp` | en | `~/dias/shared/dias-photos-web/dias-IMG_3119.webp` | Диас |
| `author-timur.webp` | tr | `~/dias/timur-video/IMG_2827.HEIC` | Тимур |
