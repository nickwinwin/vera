export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-brand-warm-white p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-brand p-8 medical-card">
        <h1 className="text-3xl font-display font-bold mb-6">Datenschutzerklärung</h1>
        
        <h2 className="text-xl font-bold mt-6 mb-2">1. Verantwortlicher</h2>
        <p className="text-brand-secondary">Verantwortlich für die Verarbeitung personenbezogener Daten im Sinne der DSGVO ist der Betreiber dieser Plattform (siehe Impressum).</p>
        
        <h2 className="text-xl font-bold mt-6 mb-2">2. Erhobene Daten</h2>
        <p className="text-brand-secondary">Wir erheben folgende personenbezogene Daten:<br />
        - Name, E-Mail-Adresse, Telefonnummer<br />
        - Klinik- und Gerätedaten<br />
        - Patienten- und Behandlungsdaten (Anamnese, Einwilligungserklärungen)<br />
        - Zahlungsinformationen (via Stripe)</p>
        
        <h2 className="text-xl font-bold mt-6 mb-2">3. Zweck der Verarbeitung</h2>
        <p className="text-brand-secondary">Die Datenverarbeitung erfolgt ausschließlich zur Erbringung der NiSV-Compliance-Dokumentation und Vertragserfüllung.</p>
        
        <h2 className="text-xl font-bold mt-6 mb-2">4. Speicherdauer</h2>
        <p className="text-brand-secondary">Personenbezogene Daten werden gemäß den gesetzlichen Aufbewahrungsfristen (insb. § 630f BGB – 10 Jahre) gespeichert und anschließend gelöscht.</p>
      </div>
    </div>
  );
}