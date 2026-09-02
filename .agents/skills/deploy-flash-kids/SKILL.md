---
name: deploy-flash-kids
description: "Деплой статичного сайту Flash Kids на продакшн (flash-kids.com) через rsync на Hostinger. Використовуй цей скіл коли користувач каже 'задеплой', 'задеплой flash-kids', 'залий flash-kids на сервер', 'оновити сайт садочка', 'відправ на хостинг', 'онови flash-kids на проді' або будь-яку комбінацію деплою сайту Flash Kids. Сайт статичний (HTML/CSS/JS, без WordPress)."
category: workflow
risk: high
source: personal
date_added: "2026-06-18"
---

# Deploy — Flash Kids → flash-kids.com

Статичний лендинг міні-садка. Без збірки, без WordPress, без бази даних — просто заливка
файлів на Hostinger через rsync.

## Ключові шляхи та налаштування

```
LOCAL_SITE:   /Users/viktor/Projects/flash-kids/
REMOTE_HOST:  147.93.73.199
REMOTE_PORT:  65002
REMOTE_USER:  u332286398
SSH_KEY:      ~/.ssh/id_hostinger
SSH_ALIAS:    ssh hostinger
REMOTE_ROOT:  /home/u332286398/domains/flash-kids.com/public_html/
LIVE_URL:     https://flash-kids.com
```

> ⚠️ **Домен — `flash-kids.com`, НЕ `flash-kids.com.ua`** (.com.ua не існує/не резолвиться).
> Усі URL у коді (canonical, og:url, hreflang, sitemap `<loc>`, robots `Sitemap:`, JSON-LD
> `url`/`image`/`logo`) мають бути на `.com`. Перед деплоєм перевір:
> `grep -rn "com\.ua" /Users/viktor/Projects/flash-kids/index.html /Users/viktor/Projects/flash-kids/sitemap.xml /Users/viktor/Projects/flash-kids/robots.txt`
> Має бути порожньо.

---

## Крок 0 — Передперевірка (завжди)

```bash
cd /Users/viktor/Projects/flash-kids

# 1. Жодних .com.ua не лишилось
grep -rn "com\.ua" index.html sitemap.xml robots.txt && echo "⚠️ ВИПРАВ .com.ua → .com ПЕРЕД ДЕПЛОЄМ" || echo "URLs OK ✓"

# 2. JSON-LD валідний
python3 -c "import re,json; h=open('index.html',encoding='utf-8').read(); [json.loads(b) for b in re.findall(r'<script type=\"application/ld\+json\">\s*(.*?)\s*</script>',h,re.S)]; print('JSON-LD OK ✓')"
```

Якщо знайдено `.com.ua` — спочатку виправ (`flash-kids.com.ua` → `flash-kids.com`), потім деплой.

---

## Крок 1 — Dry-run (показати що зміниться, нічого не пишемо)

```bash
rsync -avzn --itemize-changes \
  -e "ssh -i ~/.ssh/id_hostinger -p 65002" \
  --exclude='.git/' --exclude='.Codex/' --exclude='.DS_Store' \
  --exclude='AGENTS.md' --exclude='.gitignore' --exclude='*.log' \
  "/Users/viktor/Projects/flash-kids/" \
  "u332286398@147.93.73.199:/home/u332286398/domains/flash-kids.com/public_html/"
```

Покажи список файлів користувачу. Дочекайся підтвердження ("так"/"деплой"/"підтверджую").

---

## Крок 2 — Реальний деплой (після підтвердження)

Та сама команда **без `-n`**:

```bash
rsync -avz --itemize-changes \
  -e "ssh -i ~/.ssh/id_hostinger -p 65002" \
  --exclude='.git/' --exclude='.Codex/' --exclude='.DS_Store' \
  --exclude='AGENTS.md' --exclude='.gitignore' --exclude='*.log' \
  "/Users/viktor/Projects/flash-kids/" \
  "u332286398@147.93.73.199:/home/u332286398/domains/flash-kids.com/public_html/"
```

> Без `--delete` — щоб не зачепити файли, які могли з'явитись на сервері
> (напр. `googXXXX.html` для Google Search Console).

---

## Крок 3 — Перевірка живого сайту (завжди після деплою)

```bash
echo "=== robots.txt ==="; curl -s -L "https://flash-kids.com/robots.txt"
echo "=== sitemap ==="; curl -s -L "https://flash-kids.com/sitemap.xml" | grep -E "loc|lastmod"
echo "=== canonical ==="; curl -s -L "https://flash-kids.com/" | grep -oE '<link rel="canonical"[^>]*>'
echo "=== HTTP статус ==="; curl -s -o /dev/null -w "%{http_code}\n" "https://flash-kids.com/"
```

Очікувано: robots `Allow: /` + Sitemap на `.com`, sitemap `<loc>` на `.com`, canonical `.com`, статус `200`.

> Якщо зміни не видно — Hostinger може кешувати (LiteSpeed). Зачекай 1–2 хв або очисти кеш у hPanel.

---

## Правила безпеки

- **Завжди** Крок 0 (передперевірка `.com.ua` + JSON-LD) перед деплоєм.
- **Завжди** Крок 1 (dry-run) і показ змін перед реальним деплоєм.
- **Ніколи** не деплой без підтвердження користувача.
- **Без `--delete`** — на сервері можуть бути файли підтвердження (Search Console) тощо.
- Не заливай dev-файли (`.git`, `.Codex`, `AGENTS.md`, `.DS_Store`) — вони в `--exclude`.

---

## Типові сценарії

**"Задеплой flash-kids" / "залий на сервер"** → Крок 0 → Крок 1 (dry-run) → підтвердження → Крок 2 → Крок 3.

**"Додай файл підтвердження Google"** → поклади `googXXXX.html` у корінь `/Users/viktor/Projects/flash-kids/`, потім звичайний деплой (Кроки 0–3). Перевір: `curl -s -o /dev/null -w "%{http_code}\n" https://flash-kids.com/googXXXX.html` → `200`.
