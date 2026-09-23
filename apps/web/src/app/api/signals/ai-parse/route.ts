import { NextRequest, NextResponse } from 'next/server';
import { parseSignalWithAI } from '@/lib/ai/parser';

export async function POST(req: NextRequest) {
  try {
    if (req.cookies.get('kepio_demo_session')?.value !== 'active') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > 32_000) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    const body = await req.json();
    const { text, url } = body;

    if (
      (text !== undefined && typeof text !== 'string') ||
      (url !== undefined && typeof url !== 'string') ||
      (!text && !url)
    ) {
      return NextResponse.json(
        { error: 'Text or URL is required' },
        { status: 400 }
      );
    }

    const contentToParse = String(text || url).trim();
    if (contentToParse.length > 12_000) {
      return NextResponse.json({ error: 'Text is too long' }, { status: 413 });
    }
    const parsedData = await parseSignalWithAI(contentToParse, url);

    return NextResponse.json({
      success: true,
      data: parsedData,
    });
  } catch (error) {
    console.error('AI Parse API Error:', error);
    return NextResponse.json(
      { error: 'Tahlil qilishda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
