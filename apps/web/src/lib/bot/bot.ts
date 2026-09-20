import { parseSignalWithAI } from '../ai/parser';
import { mockStore } from '../api/mock';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kepio.app';

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username?: string;
    };
    chat: {
      id: number;
      first_name: string;
      type: string;
    };
    date: number;
    text?: string;
    caption?: string;
    forward_from_chat?: {
      id: number;
      title: string;
      username?: string;
      type: string;
    };
  };
  callback_query?: {
    id: string;
    from: { id: number; first_name: string };
    message: { message_id: number; chat: { id: number } };
    data: string;
  };
}

export async function handleTelegramUpdate(update: TelegramUpdate, botToken: string) {
  const sendMessage = async (chatId: number, text: string, replyMarkup?: any) => {
    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          reply_markup: replyMarkup,
          disable_web_page_preview: true,
        }),
      });
    } catch (e) {
      console.error('Telegram sendMessage error:', e);
    }
  };

  const answerCallback = async (callbackId: string, text: string) => {
    try {
      await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query_id: callbackId,
          text,
        }),
      });
    } catch (e) {
      console.error('Telegram answerCallback error:', e);
    }
  };

  // Handle Callback Queries (Inline Button clicks)
  if (update.callback_query) {
    const cb = update.callback_query;
    const [action, signalId] = cb.data.split(':');

    if (action === 'done' && signalId) {
      await mockStore.updateStatus(signalId, 'done');
      await answerCallback(cb.id, '✅ Vazifa bajarildi deb belgilandi!');
      await sendMessage(
        cb.message.chat.id,
        `✅ <b>Qayd yakunlandi!</b>\nDaftaringizdagi holat "BAJARILDI"ga oʻzgartirildi.`
      );
    }
    return;
  }

  const message = update.message;
  if (!message || (!message.text && !message.caption)) return;

  const chatId = message.chat.id;
  const rawText = message.text || message.caption || '';
  const senderName = message.from.first_name || 'Doʻstim';

  // 1. /start command
  if (rawText.startsWith('/start')) {
    const welcomeMsg = `📖 <b>Assalomu alaykum, ${senderName}!</b>\n\n` +
      `<b>Kepio</b> — sizning shaxsiy bilimlar va eslatmalar daftaringiz.\n\n` +
      `<b>Qanday ishlatiladi?</b>\n` +
      `• Telegramdagi istalgan <i>vakansiya, kurs, foydali maqola yoki uy-joy eʼlonini</i> menga <b>Forward</b> qiling.\n` +
      `• AI uni 1 soniyada tahlil qilib, toifasi, sarlavhasi va muddatlari bilan daftaringizga muhrlaydi.\n\n` +
      `<i>Eslab qolishni bizga qoldiring. Sizning ishingiz — bajarish.</i>`;

    await sendMessage(chatId, welcomeMsg, {
      inline_keyboard: [
        [
          { text: '🌐 Daftarni ochish', web_app: { url: `${SITE_URL}/uz/library` } },
          { text: '📋 Kun tartibi', url: `${SITE_URL}/uz/daily` },
        ],
      ],
    });
    return;
  }

  // 2. /daily command
  if (rawText.startsWith('/daily')) {
    const dailyResult = await mockStore.list({ pageSize: 5 });
    let dailyMsg = `📋 <b>Bugungi kun tartibingiz:</b>\n\n`;

    dailyResult.items.slice(0, 5).forEach((item, idx) => {
      dailyMsg += `${idx + 1}. <b>${item.title}</b>\n   📁 #${item.collection} · <i>${item.status.toUpperCase()}</i>\n`;
    });

    await sendMessage(chatId, dailyMsg, {
      inline_keyboard: [
        [{ text: '📖 Kutubxonaga oʻtish', url: `${SITE_URL}/uz/library` }],
      ],
    });
    return;
  }

  // 3. Process any forwarded message or raw finding with AI Parser
  const forwardChannel = message.forward_from_chat?.username
    ? `@${message.forward_from_chat.username}`
    : message.forward_from_chat?.title;

  const parsed = await parseSignalWithAI(rawText, forwardChannel);

  // Save to database
  const createdSignal = await mockStore.create({
    title: parsed.title,
    summary: parsed.summary,
    sourceType: parsed.sourceType,
    sourceLabel: forwardChannel || parsed.sourceLabel || 'Telegram',
    collection: parsed.collection,
    tags: parsed.tags,
    note: parsed.note,
    deadline: parsed.deadline,
  });

  const responseText =
    `🏷 <b>Daftarga muhrlandi!</b>\n\n` +
    `📌 <b>${createdSignal.title}</b>\n\n` +
    `📁 <b>Toifa:</b> #${createdSignal.collection.toUpperCase()}\n` +
    `💡 <b>Xulosa:</b> ${createdSignal.summary}\n` +
    (createdSignal.deadline ? `⏰ <b>Muddati:</b> ${createdSignal.deadline}\n` : '') +
    `🏷 <b>Teglar:</b> ${createdSignal.tags.map((t) => `#${t}`).join(' ')}\n\n` +
    `<i>Daftaringizda saqlandi va tartibga keltirildi.</i>`;

  await sendMessage(chatId, responseText, {
    inline_keyboard: [
      [
        { text: '🌐 Daftarda koʻrish', url: `${SITE_URL}/uz/library/${createdSignal.id}` },
        { text: '✅ Bajarildi', callback_data: `done:${createdSignal.id}` },
      ],
      [
        { text: '📋 Barcha qaydlar', url: `${SITE_URL}/uz/library` },
      ],
    ],
  });
}
