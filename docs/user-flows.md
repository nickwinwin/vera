# VERA NiSV Audit: Comprehensive User Flows

This document outlines every functional path within the VERA system for testing and validation.

---

## 1. Clinic Owner / Admin Flows (The Dashboard)

### Flow A: Initial Setup & Seeding
1. **Login:** Navigate to `/login` and authenticate.
2. **Clinic Context:** Verify the dashboard loads with the correct clinic name in the sidebar.
3. **The Seed (Demo Mode):** 
   - Locate the `SeedButton` (usually in Settings or a dedicated Setup page).
   - Click "Seed Database".
   - **Verification:** Dashboard stats (Clients, Equipment, Documents) should update from 0 to demo values.
4. **Language Toggle:** Switch between DE and EN using the globe icon. Verify all UI labels update.

### Flow B: Equipment Management
1. **Inventory Check:** Navigate to `/dashboard/equipment`.
2. **Detail View:** Click on a specific device (e.g., "Laser Pro X1").
3. **Maintenance Tracking:** 
   - Check "Last Maintenance" and "Next Maintenance" dates.
   - Verify status (Active/Maintenance/Expired).
4. **Document Audit:** View uploaded CE certificates or manuals linked to the device.

### Flow C: Client & Procedure Management
1. **Client Registry:** Navigate to `/dashboard/clients`. Search for a demo client.
2. **Procedure Catalog:** Navigate to `/dashboard/catalog`. Verify available treatments (IPL, Peeling, etc.).
3. **QR Code Generation:** Navigate to `/dashboard/qr-codes`. 
   - Generate a QR code for a specific procedure.
   - **Verification:** The QR code should point to `/s/[your-slug]/consent/[procedure-id]`.

### Flow D: Audit Trail Review
1. **Recent Activity:** On the main Dashboard, check the "Recent Activities" list.
2. **Document Verification:** Click a signed document.
3. **PDF Export:** Verify the ability to download the signed consent as a PDF.

---

## 2. Client / Patient Flows (The Public Portal)

### Flow E: The "Bridge" (Entry)
1. **Access:** Scan QR code or navigate to `/s/[slug]`.
2. **Authentication:** Enter name/email to "check-in" to the clinic session.
3. **Procedure Selection:** Select the scheduled treatment (e.g., "IPL-Behandlung").

### Flow F: Digital Consent & Signing
1. **Form Loading:** Verify the correct template (Anamnese or Procedure-specific) loads.
2. **Data Entry:** Fill out the health questionnaire (Checkboxes, Text fields).
3. **The Signature:**
   - Use the Signature Pad to sign.
   - Use "Clear" to reset the signature.
4. **Submission:** Click "Sign & Complete".
5. **Verification:** 
   - System generates a PDF.
   - System redirects to a "Success" page.
   - Data is written to the `consent_documents` table in Supabase.

---

## 3. System Administrator Flows (Global)

### Flow G: Clinic Onboarding
1. **Admin Login:** Navigate to `/admin`.
2. **Clinic Creation:** Create a new clinic with a unique `slug`.
3. **Subscription Management:** Verify/Update the subscription status for a clinic.

---

## 4. Edge Case Testing
- **Expired Equipment:** Ensure the dashboard shows an "Alert" if a device's maintenance is overdue.
- **Missing Parameters:** Check if the dashboard flags treatment logs that are missing "Energy" or "Pulse" settings.
- **Offline Signature:** Test the signature pad responsiveness on a mobile device.
