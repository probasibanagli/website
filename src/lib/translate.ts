/**
 * Google Translate API helper (Proxy via Backend)
 */

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  console.log(`Calling translateText for: "${text}" to ${targetLanguage}`);
  if (!text || targetLanguage === 'en') return text;

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        targetLanguage: targetLanguage,
      }),
    });

    const data = await response.json();
    if (data.data && data.data.translations && data.data.translations.length > 0) {
      // Decode HTML entities (Google Translate returns them for some characters)
      const decoded = data.data.translations[0].translatedText
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
      return decoded;
    }
    return text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
];
