import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const SYSTEM_PROMPT = `Du bist der VERA Support-Assistent — der digitale Begleiter für Kosmetikstudios auf vera-docs.de.

DEINE ROLLE:
- Du beantwortest Fragen von Interessenten und Studio-Inhabern zu VERA
- Du erklärst Funktionen, Preise und NiSV-Compliance
- Du hilfst bei der Entscheidung für das richtige Abo
- Du kannst Demo-Termine vorschlagen: "Gerne können Sie eine persönliche Demo buchen – schreiben Sie uns einfach eine E-Mail an kontakt@vera-docs.de"
- Du bist freundlich, warm und professionell

WICHTIGE PRODUKTINFOS:
- VERA ist eine NiSV-Compliance-Plattform für Kosmetikstudios
- Funktionen: Geräteverwaltung, digitale Einwilligungen per QR-Code, PDF-Export, Behandlungsparameter, Wartungserinnerungen
- 3 Abos: Basic (49€/Monat, 5 Geräte), Professional (99€, unbegrenzt), Enterprise (199€, Multi-Standort)
- Keine versteckten Kosten, monatlich kündbar
- 14 Tage kostenlos testen

TON & FORMAT:
- Warm, hilfsbereit, professionell
- Antworte immer auf Deutsch
- Formatiere Antworten reich mit Markdown: **fett** für Betonung, *kursiv* für Fachbegriffe, Aufzählungen mit -, Kasten mit \`\`\`
- Strukturiere längere Antworten mit Zwischenüberschriften (###)
- Verwende Emojis sparsam
- Wenn du eine Frage nicht beantworten kannst: "Das klären wir gern persönlich. Schreiben Sie uns eine E-Mail an kontakt@vera-docs.de"`;

export async function POST(request: NextRequest) {
  try {
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { content: 'Haben Sie eine Frage zu VERA? Schreiben Sie uns einfach eine E-Mail an kontakt@vera-docs.de – wir antworten innerhalb von 24 Stunden.' },
        { status: 200 }
      );
    }

    const body = await request.json();
    const { message, messages } = body;

    const chatMessages = messages || [];
    if (message && chatMessages.length === 0) {
      chatMessages.push({ role: 'user', content: message });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': APP_URL,
        'X-Title': 'VERA Public Chat',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-v4-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...chatMessages,
        ],
        max_tokens: 512,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { content: 'Haben Sie eine Frage zu VERA? Schreiben Sie uns eine E-Mail an kontakt@vera-docs.de.' },
        { status: 200 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'Keine Antwort erhalten.';

    return NextResponse.json({ content });
  } catch {
    return NextResponse.json(
      { content: 'Haben Sie eine Frage zu VERA? Schreiben Sie uns eine E-Mail an kontakt@vera-docs.de.' },
      { status: 200 }
    );
  }
}