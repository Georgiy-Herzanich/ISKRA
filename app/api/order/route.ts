import { NextResponse } from 'next/server';
import { sendMessage, statusKeyboard, STATUS_MARKER } from '@/lib/telegram';

export const runtime = 'nodejs';

function clean(value: unknown, max: number): string {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

export async function POST(req: Request) {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!process.env.TELEGRAM_BOT_TOKEN || !chatId) {
    return NextResponse.json({ error: 'not_configured' }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  const name = clean(body.name, 200);
  const contact = clean(body.contact, 200);
  const message = clean(body.message, 2000);
  const locale = clean(body.locale, 5);

  if (!name || !contact) {
    return NextResponse.json({ error: 'validation' }, { status: 422 });
  }

  const when = new Date().toLocaleString('uk-UA', {
    timeZone: 'Europe/Bratislava'
  });

  const base =
    `🆕 Нова заявка — ISKRA\n\n` +
    `👤 Ім'я: ${name}\n` +
    `📞 Контакт: ${contact}\n` +
    `💬 Повідомлення: ${message || '—'}\n` +
    `🌐 Мова сайту: ${locale || '—'}\n` +
    `🕒 ${when}`;

  const text = `${base}${STATUS_MARKER}🆕 Нова`;

  try {
    await sendMessage({
      chat_id: chatId,
      text,
      reply_markup: statusKeyboard()
    });
  } catch (err) {
    console.error('Telegram send failed:', err);
    return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
