/*
  Сайт 07: все тексты, ссылки, картинки и порядок блоков.
  Меняешь только этот файл. Разметка блоков лежит в assets/app.js, цвета и шрифты в assets/style.css (:root).

  Как устроен текст:
    **жирный**  выделение (чёрный полужирный, как в образце)
    [[золотой]] часть заголовка золотым цветом
    |           перенос строки в заголовке

  Блок можно убрать, повторить или переставить: это просто элементы массива blocks.
  ad: true      блок только на главной (/), на /lesson/ его нет
  lesson: true  блок только на /lesson/
*/
window.CONTENT = {
  meta: {
    lang: "ru",
    title: "Тема гайда: заголовок страницы",
    description: "Короткое описание гайда для поиска и превью ссылки.",
    lessonTitle: "Тема гайда: урок без рекламы"
  },

  links: {
    english: "https://app.lava.top/products/2c950aa0-d8be-4317-8f39-0f9b4016f5da",
    turkish: "https://app.lava.top/products/2cdbb9f8-e65b-443e-8d2c-4fea4c121e41",
    whatsapp: "https://wa.me/message/RCHLEOGGLZ5OC1"
  },

  header: {
    logo: "Dias & Timur",
    contactLabel: "Написать Тимуру в WhatsApp",
    contactLink: "whatsapp",
    menu: [
      { text: "Кому пригодится", href: "#who" },
      { text: "Главное за минуту", href: "#main" },
      { text: "Три шага", href: "#steps" },
      { text: "Платформы внутри", href: "#inside", ad: true },
      { text: "Что входит", href: "#includes", ad: true },
      { text: "Вопросы", href: "#faq", ad: true }
    ]
  },

  blocks: [
    {
      type: "hero",
      id: "top",
      image: "assets/img/bg-hero.webp",
      imageAlt: "Пляж с пальмами, человек в шляпе читает блокнот у моря",
      badge: { ring: "Гайд • Заглушка • Гайд • Заглушка • ", big: "Гайд", small: "тема|по порядку" },
      title: ["Название темы", "[[в три строки]]", "крупно"],
      pill: "Коротко и по делу",
      button: { text: "Начать читать", href: "#who", icon: "book" }
    },

    {
      type: "audience",
      id: "who",
      title: "Кому [[пригодится]]",
      subtitle: "**Пять ситуаций**, где тема нужна чаще всего",
      cards: [
        { img: "assets/img/who-student.webp", alt: "Студент в очках со стопкой книг", text: "Учёба" },
        { img: "assets/img/who-traveler.webp", alt: "Девушка с паспортом и билетом", text: "Поездка" },
        { img: "assets/img/who-office.webp", alt: "Мужчина в пиджаке с ноутбуком", text: "Работа" },
        { img: "assets/img/who-music.webp", alt: "Девушка в наушниках слушает музыку", text: "Сериалы" },
        { img: "assets/img/who-phone.webp", alt: "Девушка с телефоном машет рукой", text: "Переписка" }
      ],
      row: { text: "Здесь короткий вывод блока. **Одна мысль, которая ведёт** к следующей части.", button: { text: "Читать дальше", href: "#main", icon: "arrow" } }
    },

    {
      type: "points",
      id: "main",
      title: "Главное, [[за минуту]]",
      items: [
        "**Первое правило** темы одной строкой",
        "**Второе правило** и где оно встречается",
        "Короткая **формула** или схема",
        "**Частая ошибка** и как её избежать",
        "**Исключение**, которое стоит запомнить",
        "**Подсказка**, как узнать тему в тексте"
      ],
      phone: {
        image: "assets/img/phone-hand.webp",
        alt: "Рука держит телефон с перепиской",
        chatName: "Пример диалога",
        messages: [
          { from: "in", text: "Example sentence goes here", note: "перевод под фразой" },
          { from: "out", text: "Short answer with the rule", note: "здесь правило в деле" },
          { from: "in", text: "One more line to practise", note: "ещё один пример" }
        ]
      },
      pills: ["Правило", "Пример"],
      pillsNote: "Под каждым правилом **пример из жизни**"
    },

    {
      type: "checks",
      id: "useful",
      image: "assets/img/bg-foryou.webp",
      imageAlt: "Два пустых пляжных кресла со шляпами смотрят на море",
      title: "Тебе пригодится, [[если]]",
      cards: [
        "Ты **уже учил тему**, но в речи она пока не появляется",
        "Хочешь **понимать фразы** в сериалах и песнях",
        "Нужна **короткая шпаргалка**, к которой можно вернуться",
        "Готовишься к **экзамену** и повторяешь грамматику",
        "Пишешь коллегам и хочешь **звучать естественно**",
        "Любишь, когда **правило видно на примере**"
      ],
      row: { text: "**Здесь вывод блока** в две-три строки. Что человек уже понял и что его ждёт дальше в гайде.", button: { text: "К трём шагам", href: "#steps", icon: "arrow" } }
    },

    {
      type: "steps",
      id: "steps",
      podium: "assets/img/podium.webp",
      title: "[[Три шага]] к теме|по порядку:",
      steps: [
        { num: "I", img: "assets/img/obj-notebook.webp", alt: "Открытый блокнот с карандашом", title: "Прочитать", text: "Разобрать правило|и примеры", time: "сегодня" },
        { num: "II", img: "assets/img/obj-bubbles.webp", alt: "Два облачка диалога", title: "Сказать вслух", text: "Повторить фразы|своими словами", time: "завтра" },
        { num: "III", img: "assets/img/obj-medal.webp", alt: "Золотая медаль", title: "Проверить себя", text: "Вернуться к шпаргалке|и закрепить", time: "через неделю" }
      ],
      row: { text: "Здесь итог гайда. **Три шага работают с любой темой**, эта не исключение.", button: { text: "Что дальше", href: "#inside", icon: "arrow" }, lessonButton: { text: "Наверх", href: "#top", icon: "arrow" } }
    },

    /* ---------- Реклама: только на главной ---------- */

    {
      type: "gallery",
      id: "inside",
      ad: true,
      title: "Как это выглядит [[внутри]]",
      subtitle: "Настоящие скриншоты двух платформ.|**Нажми на карточку**, чтобы открыть крупно.",
      ribbon: "Dias English • Alterna Timur • ",
      pages: [
        [
          { img: "assets/img/shot_dias-roadmap.webp", tag: "EN", caption: "Дорожная карта A0–A1: для кого, итог и нагрузка" },
          { img: "assets/img/shot_timur-route.webp", tag: "TR", caption: "Маршрут от нуля до свободного турецкого" },
          { img: "assets/img/shot_dias-lexika.webp", tag: "EN", caption: "Lexika: слова по темам с картинками" }
        ],
        [
          { img: "assets/img/shot_timur-grammar.webp", tag: "TR", caption: "Гайд по грамматике B1" },
          { img: "assets/img/shot_dias-gemini.webp", tag: "EN", caption: "Gemini: ситуации для разговора с ИИ" },
          { img: "assets/img/shot_timur-podcasts.webp", tag: "TR", caption: "Подкасты по уровням" }
        ],
        [
          { img: "assets/img/shot_dias-home.webp", tag: "EN", caption: "Главная уровня A2–B1 и навигация" },
          { img: "assets/img/shot_timur-cartoons.webp", tag: "TR", caption: "Мультфильмы для начинающих" },
          { img: "assets/img/shot_dias-tracker.webp", tag: "EN", caption: "Трекер: прогресс за день, неделю и месяц" }
        ]
      ],
      left: { big: "210+", sub: "гайдов по грамматике|в Dias English", link: { text: "Купить English", href: "english" } },
      box: "Две платформы,|каждая 30 €|один раз",
      right: { text: "**В Alterna Timur** 128 гайдов по грамматике и 131 блок лексики", link: { text: "Купить Türkçe", href: "turkish" } }
    },

    {
      type: "pains",
      id: "pains",
      ad: true,
      title: "Почему раньше [[не получалось:]]",
      subtitle: "Три причины, из-за которых|**язык откладывают на потом**",
      cards: [
        { img: "assets/img/pain-tired.webp", alt: "Уставшая девушка подпирает голову рукой", title: "Каждый раз|с нуля", text: "приложение, видео,|и снова алфавит" },
        { img: "assets/img/pain-dictionary.webp", alt: "Мужчина растерянно смотрит в словарь", title: "Нет порядка|в темах", text: "непонятно, какая тема|идёт следующей" },
        { img: "assets/img/pain-phone.webp", alt: "Девушка встревоженно смотрит в телефон", title: "Подписки|копятся", text: "платишь каждый месяц|за то, что открываешь редко" }
      ]
    },

    {
      type: "promise",
      id: "price",
      ad: true,
      stars: "assets/img/obj-stars.webp",
      title: "30 € один раз",
      text: "Каждая платформа стоит **30 € один раз**.|Подписки нет, **доступ навсегда**."
    },

    {
      type: "includes",
      id: "includes",
      ad: true,
      title: "[[Что входит]] в платформы",
      left: {
        name: "**Dias English**, английский A0–C1",
        items: [
          "Дорожные карты **A0–A1, A2–B1, B2–C1**",
          "**210+ гайдов** по грамматике",
          "Словарь Lexika: **170+ гайдов** с озвучкой",
          "Практика с ИИ **в Gemini**",
          "Трекер привычек, **календарь, таймер**",
          "Архив: **700+ книг, фильмов,** аудио и экзаменов",
          "Всё **в Notion**: телефон и ноутбук"
        ],
        button: { text: "Купить English", href: "english" }
      },
      right: {
        intro: "**Alterna Timur**, турецкий|от A0 до C1:",
        items: [
          "**128 гайдов** по грамматике",
          "**131 блок** лексики по темам",
          "**109 интерактивных** ресурсов",
          "**32 блока** по экзаменам A1–C1",
          "**36 гайдов** по работе",
          "**1716 материалов** по уровням: фильмы, книги, подкасты"
        ],
        button: { text: "Купить Türkçe", href: "turkish" }
      },
      ticket: { left: "A0–C1", right: "30 €", note: "за каждую" }
    },

    {
      type: "promo",
      id: "buy",
      ad: true,
      image: "assets/img/bg-promo.webp",
      imageAlt: "Пляж с гамаком между пальмами",
      ring: "30 € • 30 € • 30 € • 30 € • ",
      title: "Английский|и турецкий",
      buttons: [ { text: "English", href: "english" }, { text: "Türkçe", href: "turkish" } ]
    },

    {
      type: "bonus",
      id: "bonus",
      ad: true,
      title: "[[Ещё внутри,]] кроме гайдов",
      subtitle: "Инструменты, которые помогают|**заниматься каждый день**",
      cards: [
        { num: "01", img: "assets/img/bonus-clock.webp", alt: "Парень держит будильник", text: "**Трекер и таймер**|у Диаса: минуты|и привычки по дням" },
        { num: "02", img: "assets/img/bonus-wind.webp", alt: "Девушка смеётся, волосы на ветру", text: "**Фильмы и подкасты**|у Тимура: 1716|материалов по уровням" },
        { num: "03", img: "assets/img/bonus-heart.webp", alt: "Девушка прижимает к груди сердце", text: "**Практика с ИИ**|у Диаса: ситуации|для разговора в Gemini" },
        { num: "04", img: "assets/img/bonus-jacket.webp", alt: "Девушка надевает пиджак", text: "**36 гайдов по работе**|у Тимура: для тех,|кто ищет работу" }
      ]
    },

    {
      type: "faq",
      id: "faq",
      ad: true,
      title: "Ответы на [[частые вопросы]]",
      items: [
        { q: "Это подписка?", a: "Нет. Каждая платформа стоит 30 € один раз, доступ навсегда." },
        { q: "Нужно ли платить за Notion для английского?", a: "Нет. Dias English работает в бесплатном Notion. Есть приложение для телефона и ноутбука." },
        { q: "С какого уровня можно начать?", a: "Обе платформы начинаются с A0. В Dias English первый шаг на карте A0–A1 это тест на уровень." },
        { q: "Какие экзамены есть в турецкой платформе?", a: "32 блока: A1, A2, B1, B2, C1, по каждому уровню отдельно. Про свой экзамен можно спросить Тимура в WhatsApp." },
        { q: "Как получить доступ?", a: "Оплата на странице lava.top. Для английского кнопка «Купить English», для турецкого «Купить Türkçe»." }
      ],
      row: { text: "Выбери свой язык. **Оплата один раз**, дальше в своём темпе.", buttons: [ { text: "Купить English", href: "english" }, { text: "Купить Türkçe", href: "turkish" } ] }
    },

    /* ---------- Концовка: только на /lesson/ ---------- */

    {
      type: "promise",
      id: "end",
      lesson: true,
      stars: "assets/img/obj-stars.webp",
      title: "Тема разобрана",
      text: "Здесь короткий итог гайда в одну-две строки.|**Сохрани страницу**, чтобы вернуться к примерам."
    }
  ],

  footer: "Dias English • Alterna Timur • 2026"
};
