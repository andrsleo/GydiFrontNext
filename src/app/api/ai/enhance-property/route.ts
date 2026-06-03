import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const PROMPTS = {
  title: `You are a real estate copywriter specializing in Latin American markets.
Improve the property title to make it more appealing, evocative, and professional.
Rules:
- Keep it between 10 and 100 characters
- Same language as the input (Spanish or English)
- Do not add emojis
- Do not add quotes or punctuation wrapping the result
- Return ONLY the improved title, nothing else`,

  description: `You are a real estate copywriter specializing in Latin American markets.
Improve the property description to make it more engaging, warm, and compelling for potential guests or buyers.
Rules:
- Keep it between 20 and 2000 characters
- Same language as the input (Spanish or English)
- Preserve all factual details mentioned in the original
- Use vivid but professional language
- Do not add emojis
- Return ONLY the improved description, nothing else`,
};

export async function POST(request: NextRequest) {
  const { field, content } = await request.json();

  if (!field || !content || !['title', 'description'].includes(field)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: PROMPTS[field as 'title' | 'description'] },
        { role: 'user', content },
      ],
      temperature: 0.7,
      max_tokens: field === 'title' ? 60 : 600,
    });

    const enhanced = completion.choices[0]?.message?.content?.trim() ?? '';

    if (!enhanced) {
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 502 });
    }

    return NextResponse.json({ enhanced });
  } catch {
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 502 });
  }
}
