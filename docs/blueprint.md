# VERA NiSV Audit: System Blueprint

## 1. Vision & Purpose
VERA is a specialized compliance and documentation platform for NiSV-regulated clinics. It digitizes the "Audit Trail" for non-ionizing radiation treatments, ensuring legal compliance through automated consent management and equipment tracking.

## 2. Core Architecture (Registry-First)
- **Frontend:** Next.js 15 (App Router) + TypeScript.
- **Database:** Supabase (PostgreSQL) as the "Single Source of Truth."
- **Auth:** Supabase Auth with Role-Based Access Control (Admin vs. Clinic Owner).
- **Styling:** Tailwind CSS 4.0 + Framer Motion (Cinematic UI).

## 3. Data Model (The Registry)
- `clinics`: The root entity (name, slug, owner).
- `equipment`: NiSV-relevant devices (serial numbers, maintenance dates).
- `clients`: Patient database linked to clinics.
- `consent_templates`: JSONB-defined dynamic forms (Anamnese, IPL, Peeling).
- `consent_documents`: Signed instances of templates with PDF storage links.

## 4. Key Workflows
- **The Seed:** `lib/seed-data.ts` populates the environment for demos.
- **The Bridge:** QR-code-driven client portal (`/s/[slug]`) for mobile-first consent signing.
- **The Audit:** Automated PDF generation (`jspdf`) of signed consents for legal documentation.

## 5. Tech Stack
- **Framework:** Next.js 15.4.9
- **Database/Auth:** Supabase 2.98.0
- **PDF Engine:** jsPDF + html2canvas
- **UI Components:** Lucide React + Radix UI (via Shadcn patterns)
