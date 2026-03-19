# ACNH Guides

Гайды чата ACNH — статический сайт для GitHub Pages.

## Как открыть сайт локально

В проекте нет сборки — это чистый HTML/CSS/JS.

**Самый простой способ:**
1. Откройте файл `index.html` двойным кликом в браузере.

**Если нужен локальный сервер (рекомендуется для корректных путей и загрузки компонентов):**
1. Запустите любой статический сервер в корне репозитория.
2. Откройте `http://localhost:PORT`.

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

## Структура проекта

```
├── index.html              — главная страница
├── template.html           — шаблон для новых страниц
├── styles.css              — общие стили
├── components/
│   ├── header.html         — шапка (навигация)
│   ├── footer.html         — подвал (GoatCounter, ссылки)
│   ├── back-to-top.html    — кнопка «Наверх»
│   ├── load-components.js  — загрузка шапки, подвала, кнопки, темы
│   ├── theme-init.js       — инициализация тёмной темы (до отрисовки)
│   └── gallery.js          — скрипт галерей
├── assets/                 — изображения
├── chat/                   — чат: терминология, правила, газета, конкурсы, бот
├── residents/              — жители: FAQ, подарки, дружба, гости, Селеста, Харви, Катрина, песни КК
├── gameplay/               — игровой процесс: новички, достижения, острова, репа, музей и др.
├── seasonal/               — сезонные события: календарь, турниры, свадьба и др.
├── tech/                   — техническое: скриншоты, приложения, подписка
├── other/                  — Нуказон, Метеонук, Pocket Camp, мелодии
└── support/                — поддержка проекта
```

## Как добавлять новые страницы

1. Определите блок: `chat/`, `residents/`, `gameplay/`, `seasonal/`, `tech/`, `other/` или создайте новую папку.
2. Скопируйте `template.html` в нужную папку как `index.html`. Или `template-empty.html` (без заполнения тела сайта).
3. Заполните:
   - `<title>` и `<meta name="description">`
   - Hero-секцию
   - Контент
4. Добавьте ссылку в `index.html`.

**Пути — только абсолютные от корня:**
- `href="/styles.css"`
- `src="/components/load-components.js"`
- `src="/components/theme-init.js"` (в `<head>`)
- `src="/assets/..."`

## Hero-секции

**С изображением (без overlay):**
```html
<section class="hero hero-no-overlay" style="background-image: url('/assets/...');">
```

**С изображением и тёмным overlay:**
```html
<section class="hero hero-compact hero-centered hero-dark" style="background-image: url('/assets/...');">
```

**С цветным фоном:**
```html
<section class="hero hero-compact hero-centered hero-bg-qa" style="background-image: url('/assets/...');">
```
Классы фона: `hero-bg-qa`, `hero-bg-newspaper`, `hero-bg-contest`, `hero-bg-terminology` (все дают единый лавандовый фон в светлой теме).

## Компоненты и плейсхолдеры

На каждой странице должны быть:
- `<div id="header-placeholder"></div>` — заменяется шапкой
- `<div id="footer-placeholder"></div>` — заменяется подвалом

В `<head>`:
- `<link rel="stylesheet" href="/styles.css" />`
- `<script src="/components/theme-init.js"></script>`

Перед `</body>`:
- `<script src="/components/load-components.js"></script>` (или `components/load-components.js` для главной)

Шапка, подвал и кнопка «Наверх» подгружаются автоматически.

## Функции сайта

- **Тёмная тема** — переключатель в шапке (☽/☀), выбор сохраняется в localStorage, учитывается `prefers-color-scheme`. Если сохранённого нет → проверяется prefers-color-scheme: dark: если браузер в тёмном режиме → dark; иначе → light. То есть при первом заходе тема совпадает с системной/браузерной. После переключения вручную выбор сохраняется и больше не зависит от prefers-color-scheme.
- **Кнопка «Наверх»** — появляется при прокрутке, ведёт к оглавлению (если есть) или к началу страницы.
- **Аналитика** — GoatCounter (подключается в footer). Вход в просмотр аналитики: https://animal-crossing.goatcounter.com/
- **Растушёвка** — мягкий переход между шапкой/подвалом и контентом.

## Цвета

**Светлая тема:** фон `#e6e6fa` (лавандовый).  
**Тёмная тема:** фон `#0a0012` (тёмно-фиолетовый).
