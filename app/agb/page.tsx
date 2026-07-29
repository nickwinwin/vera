export default function AgbPage() {
  return (
    <div className="min-h-screen bg-brand-warm-white p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-brand p-8 medical-card">
        <h1 className="text-3xl font-display font-bold mb-6">Allgemeine Geschäftsbedingungen (AGB)</h1>
        
        <h2 className="text-xl font-bold mt-6 mb-2">1. Geltungsbereich</h2>
        <p className="text-brand-secondary">Diese AGB gelten für alle Verträge zwischen dem Betreiber der VERA NiSV-AUDIT Plattform und dem Nutzer (Klinikbetreiber).</p>
        
        <h2 className="text-xl font-bold mt-6 mb-2">2. Leistungsbeschreibung</h2>
        <p className="text-brand-secondary">VERA NiSV-AUDIT stellt eine Plattform zur digitalen Erfassung und Verwaltung von NiSV-Compliance-Dokumenten bereit, inklusive Anamnese, Einwilligungserklärungen und Gerätedokumentation.</p>
        
        <h2 className="text-xl font-bold mt-6 mb-2">3. Zahlungsbedingungen</h2>
        <p className="text-brand-secondary">Die Zahlung erfolgt monatlich per Lastschrift oder Kreditkarte via Stripe. Der Beitrag ist jeweils zum Monatsersten fällig.</p>
        
        <h2 className="text-xl font-bold mt-6 mb-2">4. Kündigung</h2>
        <p className="text-brand-secondary">Die Kündigung kann jederzeit zum Ende des laufenden Monats erfolgen. Bereits gezahlte Beträge für den laufenden Monat werden nicht erstattet.</p>
        
        <h2 className="text-xl font-bold mt-6 mb-2">5. Haftung</h2>
        <p className="text-brand-secondary">Die Plattform wird mit größter Sorgfalt betrieben. Eine Haftung für die Vollständigkeit und Richtigkeit der dokumentierten Daten liegt in der Verantwortung des Nutzers.</p>
      </div>
    </div>
  );
}