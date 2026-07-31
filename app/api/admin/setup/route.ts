import { NextRequest, NextResponse } from 'next/server';

const PROJECT_REF = 'kmylhzssmumadbqrzsvu';

const SQL = `
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  manufacturer TEXT,
  serial_number TEXT,
  category TEXT,
  status TEXT DEFAULT 'active',
  purchase_date DATE,
  warranty_until DATE,
  last_maintenance DATE,
  next_maintenance DATE,
  certificate_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS equipment_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT,
  document_type TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS consent_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  procedure_name TEXT,
  treatment_details JSONB DEFAULT '{}',
  signed_at TIMESTAMPTZ DEFAULT now(),
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS consent_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'Consent',
  version TEXT DEFAULT '1.0',
  status TEXT DEFAULT 'active',
  content JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  manufacturer TEXT,
  category TEXT,
  required_documents JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'pro',
  status TEXT DEFAULT 'active',
  amount DECIMAL(10,2) DEFAULT 99.00,
  start_date DATE DEFAULT CURRENT_DATE,
  next_billing_date DATE,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS document_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  required_for TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS form_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT DEFAULT 'Consent',
  version TEXT DEFAULT '1.0',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO consent_templates (clinic_id, name, type, version, status)
SELECT id, 'IPL Einwilligung', 'Consent', '1.2', 'active' FROM clinics
WHERE NOT EXISTS (SELECT 1 FROM consent_templates WHERE name = 'IPL Einwilligung');

INSERT INTO consent_templates (clinic_id, name, type, version, status)
SELECT id, 'Laser Haarentfernung', 'Consent', '2.0', 'active' FROM clinics
WHERE NOT EXISTS (SELECT 1 FROM consent_templates WHERE name = 'Laser Haarentfernung');

INSERT INTO consent_templates (clinic_id, name, type, version, status)
SELECT id, 'Allgemeine Anamnese', 'Questionnaire', '1.0', 'active' FROM clinics
WHERE NOT EXISTS (SELECT 1 FROM consent_templates WHERE name = 'Allgemeine Anamnese');

INSERT INTO consent_templates (clinic_id, name, type, version, status)
SELECT id, 'Hautsensibilität', 'Questionnaire', '1.1', 'active' FROM clinics
WHERE NOT EXISTS (SELECT 1 FROM consent_templates WHERE name = 'Hautsensibilität');

INSERT INTO subscriptions (clinic_id, plan, status, amount, start_date, next_billing_date)
SELECT id, 'pro', 'active', 99.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 month'
FROM clinics WHERE NOT EXISTS (SELECT 1 FROM subscriptions LIMIT 1);
`;

export async function POST(request: NextRequest) {
  try {
    const token = process.env.SUPABASE_MANAGEMENT_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: 'SUPABASE_MANAGEMENT_TOKEN not set. Go to Supabase Dashboard → Settings → API → Manage API Tokens → Generate, then add to .env.local' },
        { status: 400 }
      );
    }

    const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: SQL }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `API error (${res.status}): ${text}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'All tables created and seeded successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    tables: [
      'clients', 'equipment', 'equipment_documents',
      'consent_documents', 'consent_templates',
      'devices', 'subscriptions', 'document_types', 'form_templates',
    ],
    note: 'Hit POST to run migration. Requires SUPABASE_MANAGEMENT_TOKEN in .env.local.',
  });
}