# Flash Kids — Landing Page

## Проект
- **Сайт:** Приватний дитячий садок у Дніпрі
- **URL (майбутній):** https://flash-kids.com.ua
- **Тип:** Статичний HTML/CSS/JS (без фреймворків)
- **GitHub:** https://github.com/viktor-orkush/flash-kids
- **Хостинг:** Hostinger (окремий домен, ще не задеплоєно)

## Бізнес
- **Instagram:** @flash_kids_
- **Телефон:** +380634183223 (Viber + Telegram)
- **Адреса:** вул. Василя Макуха, 1, Дніпро, Індустріальний район, Лівий берег
- **Координати:** 48.5180837, 35.057894
- **Графік:** Пн–Пт 8:00–18:00
- **Ціна:** 700 грн/день
- **Вік дітей:** від 2.5 років, до 8 дітей у групі
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
- Canonical: `https://flash-kids.com.ua/`
- Geo meta: `UA-12`, координати
- Keywords: дитячий садок Дніпро, Лівий берег, Індустріальний район

## TODO
- [ ] Задеплоїти на Hostinger + домен flash-kids.com.ua
- [ ] Додати реальні фото (галерея, команда)
- [ ] Підключити форму до бекенду (Formspree або email)
- [ ] Подати sitemap в Google Search Console
- [ ] Зв'язати Google Business Profile з сайтом
