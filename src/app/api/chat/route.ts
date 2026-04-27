import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey === 'your_openai_api_key') {
      return NextResponse.json({
        reply: "I'm currently in demo mode. To enable AI responses, please configure your OpenAI API key in the .env.local file. In the meantime, here are some tips:\n\n🏠 Find Bengali PGs: Go to Explore → Stay\n🍛 Bengali Food: Go to Explore → Food\n🚌 Travel Help: Go to Explore → Travel\n🏥 Emergency: Go to Emergency section\n\nFeel free to explore the platform!"
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant for ProbasiBangali.in. You help Bengali people living in Tamil Nadu find accommodation, food, transport, emergency help, and community support. Answer in whichever language the user writes in — Bengali, Tamil, or English. Be warm, concise, and helpful. If asked about specific listings or locations, guide them to the relevant pages on the website.',
          },
          ...messages,
        ],
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    return NextResponse.json({
      reply: data.choices?.[0]?.message?.content || 'Sorry, I could not process that.',
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { reply: 'Sorry, something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
