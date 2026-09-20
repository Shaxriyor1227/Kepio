// Kepio Telegram Bot Real-time Dev Runner (2026)
// Long-polling mode for local development and instant testing

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env file
try {
  const envPath = resolve(process.cwd(), '.env');
  const envContent = readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length > 0) {
      process.env[key.trim()] = vals.join('=').trim();
    }
  });
} catch (e) {
  console.warn('.env file not found or could not be read');
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

if (!BOT_TOKEN) {
  console.error('❌ Xatolik: TELEGRAM_BOT_TOKEN topilmadi. Iltimos, .env faylini tekshiring.');
  process.exit(1);
}

console.log('🤖 Kepio Telegram Bot ishga tushirilmoqda...');
console.log(`🔑 Bot Token: ${BOT_TOKEN.slice(0, 10)}...`);
console.log(`🧠 OpenRouter Key: ${OPENROUTER_KEY ? OPENROUTER_KEY.slice(0, 15) + '...' : 'Yoʻq (Fallback ishlaydi)'}`);

// Check Bot Info
async function verifyBot() {
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
    const data = await res.json();
    if (data.ok) {
      console.log(`✅ Telegram Bot ulandi: @${data.result.username} (${data.result.first_name})`);
      console.log('🚀 Bot xabarlarni kutmoqda... Telegramda botingizga xabar yuborib koʻring!');
      // Delete any webhook to allow long polling
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`);
      startPolling();
    } else {
      console.error('❌ Bot token notoʻgʻri:', data.description);
    }
  } catch (err) {
    console.error('❌ Ulanishda xatolik:', err);
  }
}

// AI Parsing via OpenRouter
async function parseWithOpenRouter(text) {
  const models = [
    'meta-llama/llama-3.3-70b-instruct:free',
    'google/gemini-2.0-flash-exp:free',
    'mistralai/mistral-small-24b-instruct-2501:free',
    'z-ai/glm-5.2:free',
  ];

  if (!OPENROUTER_KEY) return parseFallback(text);

  for (const model of models) {
    try {
      const prompt = `You are an AI parser for Kepio notebook. Return ONLY valid JSON:
{
  "title": "Short title",
  "summary": "Key summary in 2 sentences",
  "collection": "jobs" | "freelance" | "courses" | "housing" | "tools" | "other",
  "tags": ["relevant", "tags"],
  "note": "Next action",
  "deadline": "YYYY-MM-DD or null"
}
Content:
${text}`;

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          'HTTP-Referer': 'https://kepio.app',
          'X-Title': 'Kepio Bot Dev',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
          max_tokens: 500,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const content = json.choices?.[0]?.message?.content;
        if (content) {
          const clean = content.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/g, '').trim();
          const parsed = JSON.parse(clean);
          console.log(`✨ AI tahlil muvaffaqiyatli yakunlandi (${model})`);
          return parsed;
        }
      }
    } catch (e) {
      console.warn(`Model ${model} xatosi, keyingi modelga oʻtilmoqda...`);
    }
  }

  return parseFallback(text);
}

function parseFallback(text) {
  const firstLine = text.trim().split('\n')[0].replace(/^[#*•-]\s*/, '').slice(0, 70);
  return {
    title: firstLine || 'Yangi saqlangan qayd',
    summary: text.slice(0, 150),
    collection: 'jobs',
    tags: ['telegram', 'saqlangan'],
    note: 'Koʻrib chiqish va aloqaga chiqish.',
  };
}

// Telegram Long Polling Loop
let offset = 0;
async function startPolling() {
  while (true) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${offset}&timeout=30`);
      const data = await res.json();

      if (data.ok && Array.isArray(data.result)) {
        for (const update of data.result) {
          offset = update.update_id + 1;
          await handleUpdate(update);
        }
      }
    } catch (e) {
      console.error('Polling xatosi:', e.message);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

async function handleUpdate(update) {
  // Callback query
  if (update.callback_query) {
    const cb = update.callback_query;
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: cb.id, text: '✅ Bajarildi deb belgilandi!' }),
    });
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: cb.message.chat.id,
        text: '✅ <b>Vazifa yakunlandi!</b> Daftaringizdagi holat "BAJARILDI"ga oʻzgartirildi.',
        parse_mode: 'HTML',
      }),
    });
    return;
  }

  const message = update.message;
  if (!message || (!message.text && !message.caption)) return;

  const chatId = message.chat.id;
  const rawText = message.text || message.caption;
  const userName = message.from?.first_name || 'Foydalanuvchi';

  console.log(`📩 Xabar keldi (${userName}):`, rawText.slice(0, 50));

  if (rawText.startsWith('/start')) {
    const startMsg = `📖 <b>Assalomu alaykum, ${userName}!</b>\n\n` +
      `<b>Kepio</b> — shaxsiy bilimlar va eslatmalar daftarchangiz.\n\n` +
      `<b>Qanday ishlatiladi?</b>\n` +
      `• Telegramdagi istalgan <i>vakansiya, kurs, uy-joy yoki foydali maqola</i> postini menga <b>Forward</b> qiling.\n` +
      `• AI uni avtomatik tahlil qilib, daftaringizga muhrlaydi!\n\n` +
      `<i>Top → Saqla → Bajar.</i>`;

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: startMsg,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [{ text: '🌐 Saytda ochish', url: 'http://localhost:3000/uz/library' }],
            [{ text: '📋 Kun tartibi', url: 'http://localhost:3000/uz/daily' }],
          ],
        },
      }),
    });
    return;
  }

  if (rawText.startsWith('/daily')) {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: '📋 <b>Bugungi kun tartibingiz:</b>\n\n1. <b>Senior Frontend Engineer</b> (#jobs · YANGI)\n2. <b>PostgreSQL Indexing</b> (#courses · OʻQILDI)\n3. <b>Ofis ijarasi</b> (#housing · YANGI)\n\n<i>Hammasi nazorat ostida!</i>',
        parse_mode: 'HTML',
      }),
    });
    return;
  }

  // Send typing action
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendChatAction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, action: 'typing' }),
  });

  // AI Parse
  const parsed = await parseWithOpenRouter(rawText);

  const reply = `🏷 <b>Daftarga muhrlandi!</b>\n\n` +
    `📌 <b>${parsed.title}</b>\n\n` +
    `📁 <b>Toifa:</b> #${(parsed.collection || 'jobs').toUpperCase()}\n` +
    `💡 <b>Xulosa:</b> ${parsed.summary}\n` +
    (parsed.deadline ? `⏰ <b>Muddati:</b> ${parsed.deadline}\n` : '') +
    (parsed.tags ? `🏷 <b>Teglar:</b> ${parsed.tags.map((t) => `#${t}`).join(' ')}\n\n` : '\n') +
    `<i>Kepio daftaringizda saqlandi.</i>`;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: reply,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🌐 Daftarda koʻrish', url: 'http://localhost:3000/uz/library' },
            { text: '✅ Bajarildi', callback_data: 'done:1' },
          ],
        ],
      },
    }),
  });
}

verifyBot();
