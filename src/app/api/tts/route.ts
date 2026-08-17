import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');
  const lang = searchParams.get('lang') || 'ta'; // 'ta' for Tamil, 'bn' for Bengali, 'en' for English

  if (!text || !text.trim()) {
    return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 });
  }

  const azureKey = process.env.AZURE_SPEECH_KEY;
  const azureRegion = process.env.AZURE_SPEECH_REGION;

  // 1. Try Azure Speech API if keys are configured
  if (azureKey && azureRegion) {
    let voiceName = 'ta-IN-PallaviNeural';
    let xmlLang = 'ta-IN';

    if (lang === 'bn') {
      voiceName = 'bn-IN-TanishaaNeural';
      xmlLang = 'bn-IN';
    } else if (lang === 'en') {
      voiceName = 'en-US-AvaNeural';
      xmlLang = 'en-US';
    }

    const escapedText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

    const ssml = `<speak version='1.0' xml:lang='${xmlLang}'><voice xml:lang='${xmlLang}' name='${voiceName}'>${escapedText}</voice></speak>`;

    try {
      const azureUrl = `https://${azureRegion}.tts.speech.microsoft.com/cognitiveservices/v1`;
      const response = await fetch(azureUrl, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': azureKey,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
          'User-Agent': 'HospitalTranslationTTS',
        },
        body: ssml,
      });

      if (response.ok) {
        const audioBuffer = await response.arrayBuffer();
        return new Response(audioBuffer, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=86400, s-maxage=86400',
          },
        });
      }
    } catch (err) {
      console.warn('Azure TTS failed, falling back to Google Translate TTS:', err);
    }
  }

  // 2. High Quality Direct TTS Stream via Google Translate Speech Engine (Supports ta, bn, en)
  try {
    const targetLang = lang === 'bn' ? 'bn' : (lang === 'ta' ? 'ta' : 'en');
    const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      text
    )}&tl=${targetLang}&client=tw-ob`;

    const res = await fetch(googleTtsUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (res.ok) {
      const audioBuffer = await res.arrayBuffer();
      return new Response(audioBuffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      });
    }
  } catch (err) {
    console.error('Google Translate TTS fallback error:', err);
  }

  return NextResponse.json({ error: 'TTS audio unavailable' }, { status: 500 });
}
