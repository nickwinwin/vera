-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Clinics Table
create table if not exists public.clinics (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  owner_id uuid references auth.users(id) on delete cascade,
  address text,
  phone text,
  email text,
  website text,
  logo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Equipment Table
create table if not exists public.equipment (
  id uuid primary key default uuid_generate_v4(),
  clinic_id uuid references public.clinics(id) on delete cascade not null,
  name text not null,
  type text not null,
  serial_number text,
  last_maintenance date,
  next_maintenance date,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Clients Table
create table if not exists public.clients (
  id uuid primary key default uuid_generate_v4(),
  clinic_id uuid references public.clinics(id) on delete cascade not null,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  date_of_birth date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Consent Templates Table (Form definitions)
create table if not exists public.consent_templates (
  id uuid primary key default uuid_generate_v4(),
  clinic_id uuid references public.clinics(id) on delete cascade not null,
  name text not null,
  category text not null, -- 'anamnese', 'peeling', 'laser', etc.
  content jsonb not null, -- The structured form fields
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Procedures Table (Available services for a clinic)
create table if not exists public.procedures (
  id uuid primary key default uuid_generate_v4(),
  clinic_id uuid references public.clinics(id) on delete cascade not null,
  name text not null,
  category text not null, -- Links to consent_templates.category
  description text,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure columns exist if tables were created earlier
do $$ 
begin 
  -- consent_templates
  if not exists (select 1 from information_schema.columns where table_name='consent_templates' and column_name='category') then
    alter table public.consent_templates add column category text not null default 'anamnese';
  end if;

  -- procedures
  if not exists (select 1 from information_schema.columns where table_name='procedures' and column_name='category') then
    alter table public.procedures add column category text not null default 'anamnese';
  end if;
  if not exists (select 1 from information_schema.columns where table_name='procedures' and column_name='icon') then
    alter table public.procedures add column icon text;
  end if;

  -- Ensure id has default if it was created without one (fixes null value constraint error)
  alter table public.procedures alter column id set default uuid_generate_v4();
end $$;

-- Equipment Documents Table
create table if not exists public.equipment_documents (
  id uuid primary key default uuid_generate_v4(),
  equipment_id uuid references public.equipment(id) on delete cascade not null,
  clinic_id uuid references public.clinics(id) on delete cascade not null,
  name text not null,
  type text not null, -- 'CE', 'Manual', 'Maintenance', 'Insurance'
  file_url text not null,
  expiry_date date,
  status text default 'valid', -- 'valid', 'expired', 'pending'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Clinic Members Table
create table if not exists public.clinic_members (
  id uuid primary key default uuid_generate_v4(),
  clinic_id uuid references public.clinics(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text default 'staff', -- 'admin', 'staff', 'doctor'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(clinic_id, user_id)
);

-- Consent Documents Table
create table if not exists public.consent_documents (
  id uuid primary key default uuid_generate_v4(),
  clinic_id uuid references public.clinics(id) on delete cascade not null,
  client_id uuid references public.clients(id) on delete cascade not null,
  template_id uuid references public.consent_templates(id) on delete set null,
  procedure_name text not null,
  pdf_url text,
  signature_data text, -- Base64 signature
  signed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  metadata jsonb default '{}'::jsonb,
  treatment_details jsonb default '{
    "treatment": "",
    "iop": "",
    "frequency": "",
    "cooling": "",
    "zone": "",
    "energy": "",
    "notes": ""
  }'::jsonb, -- Stores the specific technical parameters from the screenshot
  performed_by uuid references auth.users(id)
);

-- Enable Row Level Security
alter table public.clinics enable row level security;
alter table public.equipment enable row level security;
alter table public.clients enable row level security;
alter table public.consent_templates enable row level security;
alter table public.procedures enable row level security;
alter table public.consent_documents enable row level security;
alter table public.equipment_documents enable row level security;
alter table public.clinic_members enable row level security;

-- RLS Policies

-- Clinics: Owners can see and update their own clinic
drop policy if exists "Owners can view their own clinic" on public.clinics;
create policy "Owners can view their own clinic"
  on public.clinics for select
  using (auth.uid() = owner_id);

drop policy if exists "Owners can update their own clinic" on public.clinics;
create policy "Owners can update their own clinic"
  on public.clinics for update
  using (auth.uid() = owner_id);

-- Equipment: Owners can manage equipment for their clinic
drop policy if exists "Owners can manage their clinic equipment" on public.equipment;
create policy "Owners can manage their clinic equipment"
  on public.equipment for all
  using (
    exists (
      select 1 from public.clinics
      where clinics.id = equipment.clinic_id
      and clinics.owner_id = auth.uid()
    )
  );

-- Clients: Owners can manage clients for their clinic
drop policy if exists "Owners can manage their clinic clients" on public.clients;
create policy "Owners can manage their clinic clients"
  on public.clients for all
  using (
    exists (
      select 1 from public.clinics
      where clinics.id = clients.clinic_id
      and clinics.owner_id = auth.uid()
    )
  );

drop policy if exists "Public can insert clients" on public.clients;
create policy "Public can insert clients"
  on public.clients for insert
  with check (true);

-- Consent Templates: Owners can manage templates for their clinic
drop policy if exists "Owners can manage their clinic templates" on public.consent_templates;
create policy "Owners can manage their clinic templates"
  on public.consent_templates for all
  using (
    exists (
      select 1 from public.clinics
      where clinics.id = consent_templates.clinic_id
      and clinics.owner_id = auth.uid()
    )
  );

drop policy if exists "Public can view templates" on public.consent_templates;
create policy "Public can view templates"
  on public.consent_templates for select
  using (true);

-- Procedures: Owners can manage procedures for their clinic
drop policy if exists "Owners can manage their clinic procedures" on public.procedures;
create policy "Owners can manage their clinic procedures"
  on public.procedures for all
  using (
    exists (
      select 1 from public.clinics
      where clinics.id = procedures.clinic_id
      and clinics.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.clinics
      where clinics.id = procedures.clinic_id
      and clinics.owner_id = auth.uid()
    )
  );

drop policy if exists "Public can view procedures" on public.procedures;
create policy "Public can view procedures"
  on public.procedures for select
  using (true);

drop policy if exists "Public can view clinics" on public.clinics;
create policy "Public can view clinics"
  on public.clinics for select
  using (true);

-- Equipment Documents: Owners can manage documents for their clinic
drop policy if exists "Owners can manage their clinic equipment documents" on public.equipment_documents;
create policy "Owners can manage their clinic equipment documents"
  on public.equipment_documents for all
  using (
    exists (
      select 1 from public.clinics
      where clinics.id = equipment_documents.clinic_id
      and clinics.owner_id = auth.uid()
    )
  );

-- Clinic Members: Owners can manage members for their clinic
drop policy if exists "Owners can manage their clinic members" on public.clinic_members;
create policy "Owners can manage their clinic members"
  on public.clinic_members for all
  using (
    exists (
      select 1 from public.clinics
      where clinics.id = clinic_members.clinic_id
      and clinics.owner_id = auth.uid()
    )
  );

-- Consent Documents: Owners can manage documents for their clinic
drop policy if exists "Owners can manage their clinic documents" on public.consent_documents;
create policy "Owners can manage their clinic documents"
  on public.consent_documents for all
  using (
    exists (
      select 1 from public.clinics
      where clinics.id = consent_documents.clinic_id
      and clinics.owner_id = auth.uid()
    )
  );

drop policy if exists "Public can insert consent documents" on public.consent_documents;
create policy "Public can insert consent documents"
  on public.consent_documents for insert
  with check (true);
