import { NextRequest, NextResponse } from 'next/server';
import { handleTelegramUpdate } from '@/lib/bot/bot';

export async function POST(req: NextRequest) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      console.warn('TELEGRAM_BOT_TOKEN sozlanmagan');
      return NextResponse.json({ ok: false, message: 'Bot token missing' }, { status: 200 });
    }

    const update = await req.json();
    await handleTelegramUpdate(update, botToken);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram Webhook Handler Error:', error);
    return NextResponse.json({ ok: true }); // Always return 200 to Telegram so it doesn't retry infinitely
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    message: 'Kepio Telegram Webhook Endpoint is operational (2026)',
  });
}
