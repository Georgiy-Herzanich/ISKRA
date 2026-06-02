# ISKRA

Landing page for the ISKRA photo restoration / colorization / animation service.
Built with **Next.js (App Router)**, **TypeScript** and **next-intl**. Contact-form
submissions are delivered to a **Telegram bot**, where each order can be marked
**Done / In progress / New** with inline buttons — no database required.

The visual design is a 1:1 port of the original single-file landing; only the
technical foundation was rebuilt.

---

## Tech stack

- **Next.js 15** (App Router, React 19, TypeScript)
- **next-intl** — 3 languages: **Slovak (default)**, Ukrainian, English
  - Slovak at `/`, Ukrainian at `/uk`, English at `/en`
- **Telegram Bot API** — order notifications + status buttons
- SEO: per-locale metadata, hreflang, OpenGraph/Twitter, JSON-LD, sitemap & robots
- **Vercel** for hosting

---

## Project structure

```
app/
  [locale]/        layout.tsx (html, fonts, SEO), page.tsx (section assembly)
  api/order/       receives the contact form, sends to Telegram
  api/telegram/    webhook: handles status-button presses
  sitemap.ts, robots.ts
components/         Header, Hero, Services, Gallery, Reviews, OrderSection, …
i18n/              routing, request config, navigation helpers
messages/          sk.json (default), uk.json, en.json
lib/               site.ts (contacts), telegram.ts (Bot API client)
public/media/      extracted images & video
scripts/           extract-media.mjs, set-webhook.mjs
```

---

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run build        # production build
npm run start        # run the production build
npm run lint         # eslint
npm run set-webhook  # register the Telegram webhook (see step 5)
```

---

## Configure business contacts

Edit `lib/site.ts` — replace the placeholders with the real phone, WhatsApp
number and email **before going live**:

```ts
whatsapp: '380000000000',        // digits only, international, no "+"
phoneDisplay: '+380 00 000 00 00',
phoneHref: '+380000000000',
email: 'hello@example.com',
```

Translatable text (titles, prices, reviews, etc.) lives in `messages/*.json`.

---

## Telegram bot setup (step by step)

You don't need an existing bot — create one in a couple of minutes.

### 1. Create the bot and get the token

1. In Telegram, open **[@BotFather](https://t.me/BotFather)**.
2. Send `/newbot`, follow the prompts (pick a name and a username ending in `bot`).
3. BotFather returns a **token** like `123456789:AAH...`.
   → this is `TELEGRAM_BOT_TOKEN`.

### 2. Get the chat id (where orders are delivered)

- **Personal chat:** open **[@userinfobot](https://t.me/userinfobot)**, press start —
  it replies with your numeric id. → `TELEGRAM_CHAT_ID`.
- **Group/channel:** add your bot to the group, add **@getidsbot** too, and it
  shows the group id (group/channel ids start with `-100...`).

### 3. Generate a webhook secret

A random string Telegram echoes back on every webhook call, so we can reject
forged requests:

```bash
node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
```

→ `TELEGRAM_WEBHOOK_SECRET`.

### 4. Fill in environment variables

In `.env.local` (local) **and** in Vercel Project Settings → Environment Variables:

| Variable                  | Value                                              |
| ------------------------- | -------------------------------------------------- |
| `TELEGRAM_BOT_TOKEN`      | token from BotFather                               |
| `TELEGRAM_CHAT_ID`        | chat/group id where orders arrive                  |
| `TELEGRAM_WEBHOOK_SECRET` | the random string from step 3                      |
| `NEXT_PUBLIC_SITE_URL`    | full deployed URL, no trailing slash               |

> Secrets are **never committed** — `.env*` is gitignored. Only `.env.example`
> (placeholders) is in the repo.

### 5. Register the webhook

After the site is deployed (so it has a public URL), point Telegram at it:

```bash
npm run set-webhook
# or pass the URL explicitly:
npm run set-webhook -- https://your-domain.example
```

This reads `.env.local`, then calls Telegram's `setWebhook` so button presses are
delivered to `/api/telegram`. Re-run it whenever the public URL changes.

### How orders flow

1. Visitor submits the form → `POST /api/order` → bot sends a message to your chat
   with inline buttons: **✅ Done · ⏳ In progress · 🔄 New**.
2. Pressing a button hits `/api/telegram`, which **edits the same message** to show
   the new status and who/when changed it. The status lives inside the message
   text, so no database is needed.

---

## Deploy to Vercel

1. Push this repo to GitHub/GitLab.
2. In [vercel.com](https://vercel.com) → **New Project** → import the repo.
   Framework is auto-detected as Next.js; no build settings to change.
3. Add the four environment variables (table above) for **Production**
   (and Preview if you want).
4. Deploy. Note the production URL and set `NEXT_PUBLIC_SITE_URL` to it
   (redeploy if you changed it after the first build).
5. Register the Telegram webhook (step 5 above) using that URL.

---

## Notes

- `landing3(1).html` is the original source design, kept for reference and
  gitignored.
- Media (`public/media/*`) was extracted from the original file via
  `node scripts/extract-media.mjs`.
- The `/uk` time zone for order timestamps is `Europe/Bratislava`; adjust in
  `app/api/order/route.ts` if needed.
