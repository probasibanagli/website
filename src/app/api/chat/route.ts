import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are ProbasiBangali AI, a helpful assistant for ProbasiBangali.in — a community platform for Bengali people living in Tamil Nadu, India.

You help users find:
- Bengali-friendly PG accommodation, hotels, and rental houses
- Bengali restaurants, sweet shops, and tiffin services
- Travel routes (bus, metro, train, auto) across Tamil Nadu cities
- Hospitals (especially those with Bengali-speaking doctors)
- Blood banks by city and blood group
- Community groups (WhatsApp, Telegram, Facebook)
- Bengali events and festivals (Durga Puja, Poila Boishakh, Saraswati Puja)
- College information and government services

Rules:
1. ALWAYS respond in the same language the user writes in — Bengali (বাংলা), Tamil (தமிழ்), Hindi, or English.
2. Be warm, concise, and culturally aware.
3. If asked about specific listings, guide them to the relevant section on probasibangali.in.
4. For emergencies, immediately suggest calling 112 (all emergency), 108 (ambulance), or visiting /emergency/ambulance on the website.
5. Keep responses under 200 words unless the user asks for detail.

Key website sections:
- /explore/stay — PG, Hotels, Rentals
- /explore/food — Bengali Restaurants & Sweets
- /explore/travel — Bus, Metro, Train routes
- /community/groups — WhatsApp & Telegram groups
- /community/matrimonial — Bengali Matrimony
- /community/events — Festivals & Events
- /emergency/hospitals — Hospital finder with Bengali doctor filter
- /emergency/blood — Blood bank search
- /emergency/ambulance — Emergency SOS (112, 108, 100, 101)
- /services/college — College finder
- /services/government — Government portals`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Try Groq API first (free tier: LLaMA 3 / Mixtral)
    const groqKey = process.env.GROQ_API_KEY;
    // Fallback to OpenAI if Groq key not set
    const openaiKey = process.env.OPENAI_API_KEY;

    // Determine which provider to use
    const useGroq = groqKey && groqKey !== 'your_groq_api_key';
    const useOpenAI = !useGroq && openaiKey && openaiKey !== 'your_openai_api_key';

    if (!useGroq && !useOpenAI) {
      return NextResponse.json({
        reply: getDemoResponse(messages[messages.length - 1]?.content || ''),
      });
    }

    // Build request for the chosen provider
    const apiUrl = useGroq
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';

    const apiKey = useGroq ? groqKey : openaiKey;
    const model = useGroq ? 'llama-3.3-70b-versatile' : 'gpt-4o';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.slice(-10), // Keep context window manageable
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI API error (${response.status}):`, errorText);

      // If Groq fails, try fallback demo response
      return NextResponse.json({
        reply: getDemoResponse(messages[messages.length - 1]?.content || ''),
      });
    }

    const data = await response.json();
    return NextResponse.json({
      reply:
        data.choices?.[0]?.message?.content ||
        'Sorry, I could not process that.',
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
    return "🏠 Looking for accommodation? We have verified Bengali-friendly PGs, hotels, and rental houses across Tamil Nadu!\n\n➡️ Visit our **Stay & Accommodation** page: /explore/stay\n\nPopular options:\n• Kolkata Home PG, Guindy — ₹8,500/mo\n• Bengal Nest Ladies PG, Anna Nagar — ₹9,500/mo\n• Bangla Bhavan PG, Vellore — ₹7,000/mo\n\nAll listings include Bengali food availability, WiFi, and WhatsApp contact.";
  }

  if (q.includes('food') || q.includes('restaurant') || q.includes('খাবার') || q.includes('রেস্তোরাঁ') || q.includes('mishti') || q.includes('sweet')) {
    return "🍛 Craving Bengali food? Here are top spots:\n\n• **Kolkata Kitchen** (T. Nagar) — Hilsa, Kosha Mangsho\n• **Mishti Hub** (Anna Nagar) — Rosogolla, Sandesh\n• **Banglar Rannaghar** (Guindy) — Home-style Bengali thali\n• **Bong Bites** — Delivery via Zomato/Swiggy\n\n➡️ See all: /explore/food";
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
    return "🎉 Bengali festivals in Tamil Nadu:\n\n• **Durga Puja 2025** — Chennai, T.Nagar (October)\n• **Saraswati Puja** — Anna Nagar Bengali Club\n• **Poila Boishakh** — Kalaivanar Arangam\n• **Rabindra Jayanti** — VIT Vellore\n\n➡️ Full calendar: /community/events";
  }

  if (q.includes('matrimon') || q.includes('বিয়ে') || q.includes('marriage')) {
    return "💑 Bengali Matrimonial:\n\nRegister your profile, get admin-verified, and connect with Bengali singles across Tamil Nadu.\n\n➡️ Browse profiles: /community/matrimonial\n➡️ Register: /community/matrimonial/register";
  }

  return "👋 নমস্কার! Welcome to ProbasiBangali AI!\n\nI can help you with:\n🏠 PG & Accommodation\n🍛 Bengali Food\n🚌 Travel & Transport\n🏥 Hospitals & Emergency\n🩸 Blood Bank Search\n👥 Community Groups\n💑 Matrimonial\n🎉 Events & Festivals\n🎓 College Finder\n🏛️ Government Services\n\nJust ask me anything in **Bengali**, **Tamil**, or **English**!\n\n📱 For emergencies, call **112** immediately.";
}
