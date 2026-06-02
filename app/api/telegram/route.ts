import { NextResponse } from 'next/server';
import {
  answerCallbackQuery,
  editMessageText,
  statusKeyboard,
  statusLineFor,
  STATUS_MARKER
} from '@/lib/telegram';

export const runtime = 'nodejs';

type CallbackQuery = {
  id: string;
  data?: string;
  from?: { first_name?: string; username?: string };
  message?: {
    message_id: number;
    text?: string;
    chat: { id: number };
  };
};

export async function POST(req: Request) {
  // Verify the request really comes from Telegram (secret set when registering
  // the webhook). If no secret is configured, skip the check.
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret) {
    const got = req.headers.get('x-telegram-bot-api-secret-token');
    if (got !== secret) {
      return new NextResponse('forbidden', { status: 401 });
    }
  }

  const update = (await req.json().catch(() => null)) as {
    callback_query?: CallbackQuery;
  } | null;

  const cq = update?.callback_query;
  if (!cq || !cq.message || !cq.data) {
    return NextResponse.json({ ok: true });
  }

  const action = cq.data;
  const who = cq.from?.first_name || cq.from?.username || 'admin';
  const when = new Date().toLocaleString('uk-UA', {
    timeZone: 'Europe/Bratislava'
  });

  const base = (cq.message.text ?? '').split(STATUS_MARKER)[0];
  const newText = `${base}${STATUS_MARKER}${statusLineFor(action, who, when)}`;

  try {
    await editMessageText({
      chat_id: cq.message.chat.id,
      message_id: cq.message.message_id,
      text: newText,
      reply_markup: statusKeyboard()
    });
    await answerCallbackQuery({ callback_query_id: cq.id, text: 'Оновлено ✓' });
  } catch (err) {
    console.error('Telegram callback handling failed:', err);
    // Still acknowledge so Telegram stops retrying.
  }

  return NextResponse.json({ ok: true });
}
