import { Resend } from 'resend';
import { NextResponse } from 'next/server';

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }
  return new Resend(apiKey);
}

export async function POST(request: Request) {
  try {
    const resend = getResend();
    const body = await request.json();
    const { institute, name, email, message, locations, deviceCount, staffCount, currentMethod } = body;

    const { data, error } = await resend.emails.send({
      from: 'VERA Audit <onboarding@resend.dev>',
      to: ['kontakt@vera-docs.de'],
      subject: `Neue Demo-Anfrage: ${institute}`,
      html: `
        <h2>Neue Demo-Anfrage</h2>
        <p><strong>Institut:</strong> ${institute}</p>
        <p><strong>Ansprechpartner:</strong> ${name}</p>
        <p><strong>E-Mail:</strong> ${email}</p>
        <hr />
        <h3>Institut Details</h3>
        <p><strong>Anzahl Standorte:</strong> ${locations || 'Nicht angegeben'}</p>
        <p><strong>Anzahl NiSV-Geräte:</strong> ${deviceCount || 'Nicht angegeben'}</p>
        <p><strong>Anzahl Mitarbeiter:</strong> ${staffCount || 'Nicht angegeben'}</p>
        <p><strong>Aktuelle Dokumentation:</strong> ${currentMethod || 'Nicht angegeben'}</p>
        <hr />
        <p><strong>Nachricht:</strong></p>
        <p>${message || 'Keine Nachricht hinterlassen.'}</p>
        <hr />
        <p>Diese E-Mail wurde automatisch von vera-docs.de gesendet.</p>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
