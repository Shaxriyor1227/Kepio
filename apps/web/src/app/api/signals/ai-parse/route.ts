import { NextRequest, NextResponse } from 'next/server';
import { parseSignalWithAI } from '@/lib/ai/parser';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, url } = body;

    if (!text && !url) {
      return NextResponse.json(
        { error: 'Iltimos, matn yoki havola kiriting' },
        { status: 400 }
      );
    }

    const contentToParse = text || url;
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
