import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const SYSTEM_PROMPT = `Du bist der VERA Dashboard-Assistent — der persönliche KI-Assistent für Kosmetikprofis.

ÜBER VERA:
VERA ist die erste NiSV-Compliance-Plattform für Kosmetikstudios in Deutschland. Sie hilft Studios bei der digitalen Dokumentation von Einwilligungen, Geräteverwaltung, Wartungsfristen und QR-Code-basierten Kunden-Check-ins.

DEINE ROLLE:
- Du hilfst Kosmetikprofis bei Fragen zur NiSV-Compliance
- Du erklärst VERA-Funktionen: Geräteverwaltung, Einwilligungsvorlagen, QR-Codes, PDF-Export, Behandlungsparameter
- Du beantwortest Fragen zu Wartungsfristen, Prüfungen, DSGVO
- Du gibst Tipps für den Studio-Alltag mit VERA
- Du bist ein warmer, professioneller Copilot — wie eine erfahrene Kollegin, die immer bescheid weiß

WICHTIGE FAKTEN:
- NiSV = „Verordnung zum Schutz vor nichtionisierender Strahlung"
- Betrifft: IPL, Laser, Radiofrequenz, Microneedling, etc.
- Pflicht: Einwilligungen, Gerätedokumentation, Wartungsnachweise
- VERA macht all das digital, rechtssicher und prüfungsbereit
- 3 Abo-Stufen: Basic (49€), Professional (99€), Enterprise (199€)

TON & FORMAT:
- Warm, professionell und präzise
- Antworte immer auf Deutsch
- Formatiere Antworten reich mit Markdown: **fett** für Betonung, *kursiv* für Fachbegriffe, Aufzählungen mit -, Kasten mit \`\`\`, bei Bedarf emoji-sparsam
- Strukturiere längere Antworten mit Zwischenüberschriften (###)
- Verwende Emojis sparsam für visuelle Auflockerung

WICHTIG: Wenn du eine konkrete Frage zu einem Gerät, einer Wartung oder einem Dokument nicht beantworten kannst, weil du keinen Zugriff auf die Studio-Daten hast, sag freundlich: „Das kann ich Ihnen im Dashboard unter [Bereich] anzeigen lassen."`;

export async function POST(request: NextRequest) {
  try {
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json(
        { content: '⚠️ Der VERA-Assistent ist aktuell nicht konfiguriert. Bitte hinterlegen Sie einen OpenRouter-API-Key.' },
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
        'X-Title': 'VERA NiSV Audit',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-v4-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...chatMessages,
        ],
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Chat API] OpenRouter error:', response.status, errorText);
      return NextResponse.json(
        { content: '⚠️ Entschuldigung, ich bin kurz nicht erreichbar. Bitte versuchen Sie es später erneut.' },
        { status: 200 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'Keine Antwort erhalten.';

    return NextResponse.json({ content });
  } catch (error) {
    console.error('[Chat API] Error:', error);
    return NextResponse.json(
      { content: '⚠️ Entschuldigung, es gab eine Verbindungsstörung.' },
      { status: 200 }
    );
  }
}
