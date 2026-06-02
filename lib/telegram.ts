const TELEGRAM_API = 'https://api.telegram.org';

// Marker that separates the order body from its status line. Used to rebuild
// the message when the admin taps a status button.
export const STATUS_MARKER = '\n\n📌 Статус: ';

function botToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not set');
  return token;
}

async function call<T = unknown>(
  method: string,
  payload: Record<string, unknown>
): Promise<T> {
  const res = await fetch(`${TELEGRAM_API}/bot${botToken()}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = (await res.json()) as { ok: boolean; result: T; description?: string };
  if (!data.ok) {
    throw new Error(`Telegram ${method} failed: ${data.description ?? 'unknown error'}`);
  }
  return data.result;
}

// Inline buttons the order owner uses to track each request.
export function statusKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: '✅ Виконано', callback_data: 'status:done' },
        { text: '⏳ В роботі', callback_data: 'status:progress' }
      ],
      [{ text: '🔄 Нова', callback_data: 'status:new' }]
    ]
  };
}

export function statusLineFor(action: string, who: string, when: string): string {
  switch (action) {
    case 'status:done':
      return `✅ Виконано — ${who}, ${when}`;
    case 'status:progress':
      return `⏳ В роботі — ${who}, ${when}`;
    default:
      return '🆕 Нова';
  }
}

export function sendMessage(params: {
  chat_id: string | number;
  text: string;
  reply_markup?: unknown;
}) {
  return call('sendMessage', params);
}

export function editMessageText(params: {
  chat_id: string | number;
  message_id: number;
  text: string;
  reply_markup?: unknown;
}) {
  return call('editMessageText', params);
}

export function answerCallbackQuery(params: {
  callback_query_id: string;
  text?: string;
}) {
  return call('answerCallbackQuery', params);
}
