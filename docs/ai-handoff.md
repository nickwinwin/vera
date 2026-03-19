# AI Context & Handoff Guide

## How to read this project
1. **Entry Point:** Start with `app/page.tsx` (Landing) and `app/dashboard/page.tsx` (Core Logic).
2. **The Schema:** Read `supabase/schema.sql` to understand the data relationships.
3. **The Logic:** 
    - `hooks/use-auth.tsx`: Handles session and clinic context.
    - `hooks/use-i18n.tsx`: Handles multi-language support.
    - `app/s/[slug]/consent/[procedureId]/page.tsx`: The most complex logic (Signature -> Canvas -> PDF -> Supabase).
4. **The Data:** `lib/seed-data.ts` contains the "Golden Record" for demo purposes.

## Constraints
- **NiSV Compliance:** All treatment logs must be immutable once signed.
- **Mobile-First:** The client portal (`/s/[slug]`) must remain highly responsive for tablet/phone use.
- **Registry-First:** Do not store state locally if it belongs in the Supabase Registry.
