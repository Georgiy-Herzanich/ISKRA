// Registers the Telegram webhook so the bot delivers button presses to the
// site's /api/telegram endpoint.
//
// Usage:
//   1. Fill in TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET and
//      NEXT_PUBLIC_SITE_URL in .env.local
//   2. npm run set-webhook
//
// Or pass the public base URL explicitly:
//   npm run set-webhook -- https://my-site.vercel.app

try {
  process.loadEnvFile('.env.local');
} catch {
  // .env.local is optional — fall back to the ambient environment.
}

const token = process.env.TELEGRAM_BOT_TOKEN;
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
const base = (process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');

if (!token) {
  console.error('Missing TELEGRAM_BOT_TOKEN');
  process.exit(1);
}
if (!base) {
  console.error('Missing site URL (set NEXT_PUBLIC_SITE_URL or pass it as an argument)');
  process.exit(1);
}

const url = `${base}/api/telegram`;

const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url,
    secret_token: secret || undefined,
    allowed_updates: ['callback_query', 'message'],
    drop_pending_updates: true
  })
});

const data = await res.json();
if (data.ok) {
  console.log(`Webhook set to ${url}`);
} else {
  console.error('Failed to set webhook:', data.description);
  process.exit(1);
}
