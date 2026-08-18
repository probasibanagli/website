import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are ProbasiBangali AI, a helpful assistant for ProbasiBangali.in - a community platform for Bengali people living in Tamil Nadu, India.

You help users find:
- Bengali-friendly PG accommodation, hotels, and service apartments
- Bengali restaurants, sweet shops, and tiffin services
- Travel routes (bus, metro, train, auto) across Tamil Nadu cities
- Hospitals (especially those with Bengali-speaking doctors)
- Blood banks by city and blood group
- Community groups (WhatsApp, Telegram, Facebook)
- Bengali events and festivals (Durga Puja, Poila Boishakh, Saraswati Puja)
- College information and government services

Rules:
1. ALWAYS respond in the same language the user writes in - Bengali (বাংলা), Tamil (தமிழ்), Hindi, or English.
2. Be warm, concise, and culturally aware.
3. If asked about specific listings, guide them to the relevant section on probasibangali.in.
4. For emergencies, immediately suggest calling 112 (all emergency), 108 (ambulance), or visiting /emergency/ambulance on the website.
5. Keep responses under 200 words unless the user asks for detail.

Key website sections:
- /explore/stay - PG, Hotels, Service Apartments
- /explore/food - Bengali Restaurants & Sweets
- /explore/travel - Bus, Metro, Train routes
- /community/groups - WhatsApp & Telegram groups
- /community/matrimonial - Bengali Matrimony
- /community/events - Festivals & Events
- /emergency/hospitals - Hospital finder with Bengali doctor filter
- /emergency/blood - Blood bank search
- /emergency/ambulance - Emergency SOS (112, 108, 100, 101)
- /services/college - College finder
- /services/government - Government portals`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'translate_word') {
      const { word } = body;

      // Free public Google Translate endpoint fallback
      const translateTextFree = async (targetLang: string) => {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&dt=rm&q=${encodeURIComponent(word)}`;
        const res = await fetch(url);
        const data = await res.json();
        
        let translated = "";
        let romanization = "";
        
        if (data && data[0]) {
          for (const item of data[0]) {
            if (item[0] && typeof item[0] === 'string') translated += item[0];
            if (item[2] && typeof item[2] === 'string') romanization += item[2];
          }
        }
        return { text: translated.trim() || word, romanization: romanization.trim() };
      };

      // Try Gemini API first if a valid key is provided
      const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;
      
      if (geminiKey && !geminiKey.startsWith('your_')) {
        try {
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
          const prompt = `Translate the English word/phrase "${word}" to Tamil and Bengali. Respond ONLY with a valid JSON array containing exactly one object with these keys: "meaning" (English meaning), "pronunciation" (Tamil pronunciation in English), "tamil" (Tamil script), "bengali" (Bengali script). Do not include any other text or markdown formatting. Use natural, conversational translations (e.g., "Good afternoon" should be "மதிய வணக்கம்", "Good evening" should be "மாலை வணக்கம்").`;

          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.2, maxOutputTokens: 200 }
            }),
          });

          if (response.ok) {
            const data = await response.json();
            let reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            
            if (reply.includes('```json')) reply = reply.split('```json')[1].split('```')[0].trim();
            else if (reply.includes('```')) reply = reply.split('```')[1].split('```')[0].trim();
            
            const parsed = JSON.parse(reply);
            const result = Array.isArray(parsed) ? parsed[0] : parsed;
            
            if (result && result.tamil && result.bengali) {
              return NextResponse.json({
                meaning: result.meaning || word,
                pronunciation: result.pronunciation || "Unavailable",
                tamil: result.tamil,
                bengali: result.bengali,
                bengaliMeaning: result.bengali
              });
            }
          }
        } catch (err) {
          console.warn("Gemini translation failed, falling back to free API", err);
        }
      }

      // Fallback to Free Google Translate if Gemini fails or is not configured
      try {
        const tamilRes = await translateTextFree('ta');
        const bengaliRes = await translateTextFree('bn');

        return NextResponse.json({
          meaning: word,
          pronunciation: tamilRes.romanization || "Unavailable (Free API)",
          tamil: tamilRes.text,
          bengali: bengaliRes.text,
          bengaliMeaning: bengaliRes.text
        });
      } catch (err) {
        console.error('Translation error', err);
        return NextResponse.json({ error: "Translation API Error" }, { status: 500 });
      }
    }

    const { messages } = body;
    return NextResponse.json({
      reply: getDemoResponse(messages?.[messages.length - 1]?.content || ''),
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { reply: 'Sorry, something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}

/** Intelligent demo responses when no API key is configured */
function getDemoResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('pg') || q.includes('accommodation') || q.includes('stay') || q.includes('room') || q.includes('থাকা') || q.includes('পিজি')) {
    return "🏠 Looking for accommodation? We have verified Bengali-friendly PGs, hotels, and service apartments across Tamil Nadu!\n\n➡️ Visit our **Stay & Accommodation** page: /explore/stay\n\nPopular options:\n• Kolkata Home PG, Guindy - ₹8,500/mo\n• Bengal Nest Ladies PG, Anna Nagar - ₹9,500/mo\n• Bangla Bhavan PG, Vellore - ₹7,000/mo\n\nAll listings include Bengali food availability, WiFi, and WhatsApp contact.";
  }

  if (q.includes('food') || q.includes('restaurant') || q.includes('খাবার') || q.includes('রেস্তোরাঁ') || q.includes('mishti') || q.includes('sweet')) {
    return "🍛 Craving Bengali food? Here are top spots:\n\n• **Kolkata Kitchen** (T. Nagar) - Hilsa, Kosha Mangsho\n• **Mishti Hub** (Anna Nagar) - Rosogolla, Sandesh\n• **Banglar Rannaghar** (Guindy) - Home-style Bengali thali\n• **Bong Bites** - Delivery via Zomato/Swiggy\n\n➡️ See all: /explore/food";
  }

  if (q.includes('hospital') || q.includes('doctor') || q.includes('ডাক্তার') || q.includes('হাসপাতাল') || q.includes('emergency')) {
    return "🏥 For medical emergencies:\n\n🔴 **Call 112** for all emergencies\n🚑 **Call 108** for ambulance\n\nHospitals with Bengali doctors:\n• Apollo Hospital, Chennai ✅\n• CMC Hospital, Vellore ✅\n• Sri Ramachandra Medical Centre ✅\n\n➡️ Full list: /emergency/hospitals\n➡️ Emergency SOS: /emergency/ambulance";
  }

  if (q.includes('blood') || q.includes('রক্ত')) {
    return "🩸 Need blood?\n\nSearch by city and blood group on our Blood Help page.\nGovernment blood banks listed first with direct call buttons.\n\n➡️ Visit: /emergency/blood";
  }

  if (q.includes('travel') || q.includes('bus') || q.includes('metro') || q.includes('train') || q.includes('যাতায়াত')) {
    return "🚌 Travel in Tamil Nadu:\n\nOur Travel page shows bus routes, metro lines, train timings, and ride-booking links for Rapido, Uber, and Ola.\n\nCommon Tamil words for travel are also included!\n\n➡️ Visit: /explore/travel";
  }

  if (q.includes('durga') || q.includes('puja') || q.includes('festival') || q.includes('event') || q.includes('পুজো') || q.includes('উৎসব')) {
    return "🎉 Bengali festivals in Tamil Nadu:\n\n• **Durga Puja 2025** - Chennai, T.Nagar (October)\n• **Saraswati Puja** - Anna Nagar Bengali Club\n• **Poila Boishakh** - Kalaivanar Arangam\n• **Rabindra Jayanti** - VIT Vellore\n\n➡️ Full calendar: /community/events";
  }

  if (q.includes('matrimon') || q.includes('বিয়ে') || q.includes('marriage')) {
    return "💑 Bengali Matrimonial:\n\nRegister your profile, get admin-verified, and connect with Bengali singles across Tamil Nadu.\n\n➡️ Browse profiles: /community/matrimonial\n➡️ Register: /community/matrimonial/register";
  }

  return "👋 নমস্কার! Welcome to ProbasiBangali AI!\n\nI can help you with:\n🏠 PG & Accommodation\n🍛 Bengali Food\n🚌 Travel & Transport\n🏥 Hospitals & Emergency\n🩸 Blood Bank Search\n👥 Community Groups\n💑 Matrimonial\n🎉 Events & Festivals\n🎓 College Finder\n🏛️ Government Services\n\nJust ask me anything in **Bengali**, **Tamil**, or **English**!\n\n📱 For emergencies, call **112** immediately.";
}
