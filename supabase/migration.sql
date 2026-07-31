-- VERA Database Migration
-- Creates all missing tables for admin + clinic dashboards

-- 1. Clients (Kunden)
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

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS clients ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE IF EXISTS clients ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE IF EXISTS clients ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE IF EXISTS clients ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE IF EXISTS clients ADD COLUMN IF NOT EXISTS address TEXT;

-- 2. Equipment (Geräte der Klinik)
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

ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

-- 3. Equipment Documents
CREATE TABLE IF NOT EXISTS equipment_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_url TEXT,
  document_type TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE equipment_documents ENABLE ROW LEVEL SECURITY;

-- 4. Consent Documents (unterschriebene Einwilligungen)
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

ALTER TABLE consent_documents ENABLE ROW LEVEL SECURITY;

-- 5. Consent Templates (Formularvorlagen)
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

-- Fix existing tables that may lack columns from earlier schemas
ALTER TABLE IF EXISTS consent_templates ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Consent';
ALTER TABLE IF EXISTS consent_templates ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0';
ALTER TABLE IF EXISTS consent_templates ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE IF EXISTS consent_templates ADD COLUMN IF NOT EXISTS content JSONB DEFAULT '{}';
-- Fix pre-existing columns from earlier Supabase schema that may conflict
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'consent_templates' AND column_name = 'category') THEN
    ALTER TABLE consent_templates ALTER COLUMN category DROP NOT NULL;
    ALTER TABLE consent_templates ALTER COLUMN category SET DEFAULT 'Allgemein';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'consent_templates' AND column_name = 'content') THEN
    ALTER TABLE consent_templates ALTER COLUMN content DROP NOT NULL;
    ALTER TABLE consent_templates ALTER COLUMN content SET DEFAULT '{}';
  END IF;
END $$;

ALTER TABLE consent_templates ENABLE ROW LEVEL SECURITY;

-- 6. Global Device Catalog (Admin)
CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  manufacturer TEXT,
  category TEXT,
  required_documents JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

-- 7. Subscriptions (Admin)
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

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 8. Document Types (Admin)
CREATE TABLE IF NOT EXISTS document_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  required_for TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE document_types ENABLE ROW LEVEL SECURITY;

-- 9. Form Templates (Admin)
CREATE TABLE IF NOT EXISTS form_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT DEFAULT 'Consent',
  version TEXT DEFAULT '1.0',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE form_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow authenticated users to read/write their own clinic data
CREATE POLICY "Users can read their own clinic clients" ON clients
  FOR SELECT USING (clinic_id IN (SELECT id FROM clinics WHERE owner_id = auth.uid()));

CREATE POLICY "Users can insert their own clinic clients" ON clients
  FOR INSERT WITH CHECK (clinic_id IN (SELECT id FROM clinics WHERE owner_id = auth.uid()));

CREATE POLICY "Users can delete their own clinic clients" ON clients
  FOR DELETE USING (clinic_id IN (SELECT id FROM clinics WHERE owner_id = auth.uid()));

CREATE POLICY "Users can read their own clinic equipment" ON equipment
  FOR SELECT USING (clinic_id IN (SELECT id FROM clinics WHERE owner_id = auth.uid()));

CREATE POLICY "Users can read their own clinic consent docs" ON consent_documents
  FOR SELECT USING (clinic_id IN (SELECT id FROM clinics WHERE owner_id = auth.uid()));

CREATE POLICY "Users can insert their own clinic consent docs" ON consent_documents
  FOR INSERT WITH CHECK (clinic_id IN (SELECT id FROM clinics WHERE owner_id = auth.uid()));

CREATE POLICY "Users can update their own clinic consent docs" ON consent_documents
  FOR UPDATE USING (clinic_id IN (SELECT id FROM clinics WHERE owner_id = auth.uid()));

-- Seed: Default consent templates for the existing clinic
INSERT INTO consent_templates (clinic_id, name, type, version, status)
SELECT id, 'IPL Einwilligung', 'Consent', '1.2', 'active' FROM clinics
WHERE NOT EXISTS (SELECT 1 FROM consent_templates LIMIT 1);

INSERT INTO consent_templates (clinic_id, name, type, version, status)
SELECT id, 'Laser Haarentfernung', 'Consent', '2.0', 'active' FROM clinics
WHERE EXISTS (SELECT 1 FROM clinics)
  AND NOT EXISTS (SELECT 1 FROM consent_templates WHERE name = 'Laser Haarentfernung');

INSERT INTO consent_templates (clinic_id, name, type, version, status)
SELECT id, 'Allgemeine Anamnese', 'Questionnaire', '1.0', 'active' FROM clinics
WHERE EXISTS (SELECT 1 FROM clinics)
  AND NOT EXISTS (SELECT 1 FROM consent_templates WHERE name = 'Allgemeine Anamnese');

INSERT INTO consent_templates (clinic_id, name, type, version, status)
SELECT id, 'Hautsensibilität', 'Questionnaire', '1.1', 'active' FROM clinics
WHERE EXISTS (SELECT 1 FROM clinics)
  AND NOT EXISTS (SELECT 1 FROM consent_templates WHERE name = 'Hautsensibilität');

-- Seed: Subscription for the existing clinic
INSERT INTO subscriptions (clinic_id, plan, status, amount, start_date, next_billing_date)
SELECT id, 'pro', 'active', 99.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 month'
FROM clinics
WHERE NOT EXISTS (SELECT 1 FROM subscriptions LIMIT 1);