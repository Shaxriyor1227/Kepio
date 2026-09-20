import { ParsedSignalData } from './types';
import { SignalCollection, SignalSourceType } from '../api/types';

// Priority list of high-accuracy free models on OpenRouter
const OPENROUTER_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'google/gemini-2.0-flash-exp:free',
  'mistralai/mistral-small-24b-instruct-2501:free',
  'z-ai/glm-5.2:free',
  'thinkingmachines/inkling:free',
  'nvidia/nemotron-3-ultra-550b-a55b:free',
];

export async function parseSignalWithAI(
  rawText: string,
  urlHint?: string
): Promise<ParsedSignalData> {
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  if (openRouterKey) {
    for (const model of OPENROUTER_MODELS) {
      try {
        const parsed = await callOpenRouter(rawText, model, openRouterKey, urlHint);
        if (parsed) {
          return parsed;
        }
      } catch (err) {
        console.warn(`OpenRouter model ${model} failed, trying next fallback model...`, err);
      }
    }
  }

  // Fallback Heuristic & NLP Intelligence Engine (100% offline & fast)
  return parseHeuristically(rawText, urlHint);
}

async function callOpenRouter(
  rawText: string,
  modelName: string,
  apiKey: string,
  urlHint?: string
): Promise<ParsedSignalData | null> {
  const systemPrompt = `You are an expert AI parser for Kepio (personal knowledge & opportunity notebook).
Analyze the user's raw text or forwarded post from Telegram/web and return ONLY a valid JSON object matching this schema:
{
  "title": "Short concise title (max 75 chars)",
  "summary": "Key summary in 2 sentences with main takeaways",
  "collection": "jobs" | "freelance" | "courses" | "housing" | "tools" | "other",
  "sourceType": "telegram" | "web" | "other",
  "sourceLabel": "channel username like @dev_jobs_uz or website domain",
  "tags": ["relevant", "lowercase", "keywords", "without_hashes"],
  "note": "Actionable next step for the user",
  "deadline": "YYYY-MM-DD or null if not mentioned"
}
Important:
- Return ONLY the raw JSON without markdown codeblocks or extra text.
- Title and summary should preserve the original language (Uzbek or English).`;

  const userPrompt = `Content to parse:
${rawText}
${urlHint ? `Source Hint: ${urlHint}` : ''}`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://kepio.app',
      'X-Title': 'Kepio Personal Notebook',
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 600,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter HTTP ${response.status}: ${await response.text()}`);
  }

  const json = await response.json();
  const rawContent = json.choices?.[0]?.message?.content;
  if (!rawContent) return null;

  // Clean codeblock formatting if present
  const cleanJsonStr = rawContent
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/g, '')
    .trim();

  const parsed = JSON.parse(cleanJsonStr);

  const validCollections: SignalCollection[] = ['jobs', 'freelance', 'courses', 'housing', 'tools', 'other'];
  const collection: SignalCollection = validCollections.includes(parsed.collection) ? parsed.collection : 'other';

  return {
    title: parsed.title || rawText.slice(0, 70),
    summary: parsed.summary || rawText.slice(0, 160),
    collection,
    sourceType: (parsed.sourceType || (urlHint?.includes('t.me') ? 'telegram' : 'web')) as SignalSourceType,
    sourceLabel: parsed.sourceLabel || (urlHint?.includes('t.me') ? '@telegram' : 'Telegram'),
    tags: Array.isArray(parsed.tags) ? parsed.tags.map((t: string) => t.toLowerCase().replace(/^#/, '')) : [collection],
    note: parsed.note || undefined,
    deadline: parsed.deadline && parsed.deadline !== 'null' ? parsed.deadline : undefined,
  };
}

function parseHeuristically(text: string, url?: string): ParsedSignalData {
  const clean = text.trim();
  const lower = clean.toLowerCase();

  // Determine collection
  let collection: SignalCollection = 'other';
  if (
    lower.includes('vakansiya') ||
    lower.includes('job') ||
    lower.includes('hiring') ||
    lower.includes('ishga') ||
    lower.includes('developer') ||
    lower.includes('engineer') ||
    lower.includes('maosh') ||
    lower.includes('salary')
  ) {
    collection = 'jobs';
  } else if (
    lower.includes('freelance') ||
    lower.includes('loyixa') ||
    lower.includes('buyurtma') ||
    lower.includes('upwork') ||
    lower.includes('proyekt')
  ) {
    collection = 'freelance';
  } else if (
    lower.includes('kurs') ||
    lower.includes('course') ||
    lower.includes('tutorial') ||
    lower.includes('dars') ||
    lower.includes('taʼlim') ||
    lower.includes('workshop')
  ) {
    collection = 'courses';
  } else if (
    lower.includes('ijara') ||
    lower.includes('kvartira') ||
    lower.includes('hovli') ||
    lower.includes('arenda') ||
    lower.includes('ofis') ||
    lower.includes('rent')
  ) {
    collection = 'housing';
  } else if (
    lower.includes('tool') ||
    lower.includes('library') ||
    lower.includes('github') ||
    lower.includes('kutubxona') ||
    lower.includes('framework') ||
    lower.includes('dastur')
  ) {
    collection = 'tools';
  }

  // Extract source
  const telegramMatch = clean.match(/@([a-zA-Z0-9_]+)/);
  const sourceType: SignalSourceType = (url && url.includes('t.me')) || telegramMatch ? 'telegram' : 'web';
  const sourceLabel = telegramMatch ? `@${telegramMatch[1]}` : url ? new URL(url).hostname : 'Telegram Forward';

  // Extract title
  const firstLine = clean.split('\n')[0].replace(/^[#*•-]\s*/, '').trim();
  const title = firstLine.length > 5 ? firstLine.slice(0, 80) : clean.slice(0, 60);

  // Extract tags
  const hashMatches = clean.match(/#[a-zA-Z0-9_]+/g);
  const tags: string[] = hashMatches
    ? hashMatches.map((t) => t.replace('#', '').toLowerCase()).slice(0, 5)
    : [collection, sourceType];

  // Summary
  const lines = clean.split('\n').filter((l) => l.trim().length > 0);
  const summary = lines.slice(1, 4).join(' ').trim() || clean.slice(0, 160);

  return {
    title,
    summary: summary.slice(0, 250),
    collection,
    sourceType,
    sourceLabel,
    tags,
    note: 'Koʻrib chiqish va zarur boʻlsa aloqaga chiqish.',
  };
}
