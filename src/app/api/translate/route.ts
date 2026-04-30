import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, targetLanguage } = await req.json();
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;
    console.log('API Key present:', !!API_KEY);

    if (!API_KEY) {
      return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
    }

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
        }),
      }
    );

    const data = await response.json();
    console.log('Google API Response:', JSON.stringify(data, null, 2));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
