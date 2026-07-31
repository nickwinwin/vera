import { NextRequest, NextResponse } from 'next/server';

const WHATSAPP_ENABLED = process.env.WHATSAPP_ENABLED === 'true';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const SYSTEM_PROMPT = `Du bist der VERA WhatsApp-Assistent — der KI-Support für Kosmetikstudios.
Du beantwortest Fragen zu NiSV-Compliance, VERA-Funktionen, Wartung und Dokumentation.
Antworte warm, professionell und auf Deutsch. Halte Antworten kurz und verständlich.`;

export async function POST(request: NextRequest) {
  if (!WHATSAPP_ENABLED) {
    return NextResponse.json({ error: 'WhatsApp-Integration nicht aktiviert' }, { status: 503 });
  }

  try {
    const body = await request.json();

    // Meta/WhatsApp Cloud API sendet: object, entry[].changes[].value.messages[]
    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0];
    const message = change?.value?.messages?.[0];

    if (!message || !message.text?.body) {
      return NextResponse.json({ status: 'ok' });
    }

    const userMessage = message.text.body;
    const from = message.from; // Telefonnummer des Absenders

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ error: 'OpenRouter nicht konfiguriert' }, { status: 500 });
    }

    const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://vera-docs.de',
        'X-Title': 'VERA WhatsApp',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-v4-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 512,
      }),
    });

    if (!aiResponse.ok) {
      return NextResponse.json({ status: 'ok' });
    }

    const data = await aiResponse.json();
    const reply = data.choices?.[0]?.message?.content || '';

    // WhatsApp Cloud API: Nachricht zurücksenden
    const whatsappToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (whatsappToken && phoneNumberId) {
      await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${whatsappToken}`,
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: from,
          text: { body: reply },
        }),
      });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('[WhatsApp API] Error:', error);
    return NextResponse.json({ status: 'ok' });
  }
}

// GET = Webhook-Verifizierung für Meta
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === 'subscribe' && token === verifyToken && challenge) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}
