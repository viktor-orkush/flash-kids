# Flash Kids — Landing Page

## Проект
- **Сайт:** Приватний міні-садок у Дніпрі
- **⚠️ Назва:** немає ліцензії ЗДО, тому **не називати «дитячим садком»** у самоназвах
  (`title`, OG/Twitter, `alternateName` і назви офферів у JSON-LD, H1/H2, `alt`).
  Основний термін — **«міні-садок»**. Фраза «дитячий садок» допустима лише як
  порівняння («як у звичайному дитячому садку») та в цитатах відгуків батьків.
- **URL:** https://flash-kids.com/ (задеплоєно)
- **Тип:** Статичний HTML/CSS/JS (без фреймворків)
- **GitHub:** https://github.com/viktor-orkush/flash-kids
- **Хостинг:** Hostinger

## Бізнес
- **Instagram:** @flash_kids_
- **Телефон:** +380634183223 (Viber + Telegram)
- **Адреса:** вул. Василя Макуха, 1, Дніпро, Індустріальний район, Лівий берег (індекс 49087)
- **Координати:** 48.5180837, 35.057894
- **Google Business Profile:** https://maps.google.com/?cid=16172342004554622414 (kgmid `/g/11z42p65c5`)
- **Графік:** Пн–Пт 8:00–18:00
- **Ціна:** 700 грн/день (повний день), 500 грн/день (півдня)
- **Вік дітей:** від 2,5 років, до 8 дітей у групі
- **Рейтинг:** Google 5.0★

## Структура файлів
```
flash-kids/
├── index.html        # Єдина сторінка (10 секцій)
├── css/style.css     # Всі стилі (~750 рядків)
├── js/main.js        # Інтерактивність
├── images/
│   ├── logo.webp     # Логотип (15KB, 475×475)
│   └── logo.jpg      # Оригінал
├── robots.txt
├── sitemap.xml
└── CLAUDE.md
```

## Секції сторінки
Header → Hero → About → Programs (9) → Advantages → Gallery → Reviews → Price → Contacts → Footer

## Design Tokens
```css
--color-yellow: #FFD234   /* основний акцент */
--color-blue:   #3A7BD5   /* вторинний */
--color-dark:   #1A1A2E   /* текст */
--font-display: 'Comfortaa'
--font-body:    'Nunito'
--radius:       16px
```

## SEO
- JSON-LD: `ChildCare` + `FAQPage` + `BreadcrumbList`
- Canonical: `https://flash-kids.com/`
- Geo meta: `UA-12`, координати
- Keywords: міні-садок Дніпро, приватний міні-садок, Лівий берег, Індустріальний район

## TODO
- [x] Сайт → GBP: `sameAs` + `hasMap` у JSON-LD вказують на cid-профіль
- [ ] GBP → сайт: вписати https://flash-kids.com/ у поле «Вебсайт» у кабінеті Google Business Profile
- [ ] **GBP: узгодити назву й категорію** — прибрати «дитячий садок» з назви та категорії
      в Google Business Profile, інакше юридична правка half-done (Google зіставляє сайт і GBP)
- [ ] Search Console: надіслати сторінку на переобхід після деплою (змінився `title`)
- [ ] Скинути кеш OG-превʼю: Facebook Sharing Debugger (стара картинка живе днями)
- [ ] Додати `email` у JSON-LD (робочої адреси ще немає)
- [ ] Контраст: `--color-blue` 3.22:1 і `--color-muted` 3.85:1 замість 4.5:1 (Lighthouse a11y 96)
