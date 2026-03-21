import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend('re_BEmpugeB_7f3So97REKAViEGyjueUMo4c');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { institute, name, email, message } = body;

    const { data, error } = await resend.emails.send({
      from: 'VERA Audit <onboarding@resend.dev>',
      to: ['kontakt@vera-docs.de'],
      subject: `Neue Demo-Anfrage: ${institute}`,
      html: `
        <h2>Neue Demo-Anfrage</h2>
        <p><strong>Institut:</strong> ${institute}</p>
        <p><strong>Ansprechpartner:</strong> ${name}</p>
        <p><strong>E-Mail:</strong> ${email}</p>
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
